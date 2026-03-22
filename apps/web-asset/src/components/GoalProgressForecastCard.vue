<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, onMounted, reactive, ref, watch } from "vue";

import {
  getGoalProgress,
  getMyGoalTarget,
  updateMyGoalTarget,
  type AnalyticsGoalProgressOut,
  type GoalBasis,
  type GoalDisplayCurrency,
  type GoalScopeType,
  type GoalTargetOut,
} from "../api/goals";
import { formatDateTimeSeoul } from "../utils/datetime";

type GoalCardUiState = {
  expanded: boolean;
  useNet: boolean;
};

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    displayCurrency: GoalDisplayCurrency;
    scopeType?: GoalScopeType | null;
    scopeId?: number | null;
    amountMask?: boolean;
    storageKeyPrefix: string;
  }>(),
  {
    title: "Goal Progress and Forecast",
    subtitle: "Track progress toward your target wealth.",
    scopeType: null,
    scopeId: null,
    amountMask: false,
  },
);

const loading = ref(false);
const saving = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const target = ref<GoalTargetOut | null>(null);
const progress = ref<AnalyticsGoalProgressOut | null>(null);
const editMode = ref(false);
const infoOpen = ref(false);
const assumptionsInfoOpen = ref(false);

const form = reactive({
  targetAmount: "",
  annualReturnRatePct: "",
  monthlyInvestAmount: "",
});

function todayUiState(): GoalCardUiState {
  return {
    expanded: true,
    useNet: false,
  };
}

const expanded = ref(todayUiState().expanded);
const useNet = ref(todayUiState().useNet);

function loadUiState(): void {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(`${props.storageKeyPrefix}:ui`);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Partial<GoalCardUiState>;
    if (typeof parsed.expanded === "boolean") expanded.value = parsed.expanded;
    if (typeof parsed.useNet === "boolean") useNet.value = parsed.useNet;
  } catch {
    // ignore malformed values
  }
}

function saveUiState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    `${props.storageKeyPrefix}:ui`,
    JSON.stringify({
      expanded: expanded.value,
      useNet: useNet.value,
    }),
  );
}

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency = "KRW"): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatSignedCurrency(value: number, currency = "KRW"): string {
  const absolute = formatCurrency(Math.abs(value), currency);
  if (value > 0) return `+${absolute}`;
  if (value < 0) return `-${absolute}`;
  return absolute;
}

function formatPercent(value: string | number | null | undefined): string {
  if (value == null) return "-";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return `${parsed >= 0 ? "+" : ""}${parsed.toFixed(2)}%`;
}

function formatRatio(value: string | number | null | undefined): string {
  if (value == null) return "-";
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return "-";
  return `${Math.max(0, parsed).toFixed(1)}%`;
}

function formatProjectedDate(value: string | null | undefined): string {
  if (!value) return "-";
  return value;
}

function formatAsOf(value: string | null | undefined): string {
  return formatDateTimeSeoul(value);
}

function amountMaskStyle() {
  return props.amountMask ? { filter: "blur(6px)" } : undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.detail || error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Unknown error";
}

function populateForm(next: GoalTargetOut | null): void {
  form.targetAmount = next?.configured && next.target_amount != null ? String(toNumber(next.target_amount)) : "";
  form.annualReturnRatePct =
    next?.configured && next.annual_return_rate_pct != null ? String(toNumber(next.annual_return_rate_pct)) : "";
  form.monthlyInvestAmount =
    next?.configured && next.monthly_invest_amount != null ? String(toNumber(next.monthly_invest_amount)) : "";
}

const canLoad = computed(() => Boolean(props.scopeType && props.scopeId != null));
const basis = computed<GoalBasis>(() => (useNet.value ? "NET" : "GROSS"));
const currentAmount = computed(() => toNumber(progress.value?.current_amount));
const targetAmount = computed(() => toNumber(progress.value?.target_amount));
const progressRatioPct = computed(() => {
  const raw = toNumber(progress.value?.progress_ratio_pct);
  return Math.max(0, Math.min(100, raw));
});
const remainingAmount = computed(() => toNumber(progress.value?.remaining_amount));
const overTargetAmount = computed(() => toNumber(progress.value?.over_target_amount));
const annualReturnInputValue = computed(() => toNumber(target.value?.annual_return_rate_pct));
const basisLabel = computed(() => (basis.value === "NET" ? "Net" : "Gross"));

async function refreshCard(): Promise<void> {
  if (!canLoad.value || !props.scopeType || props.scopeId == null) {
    target.value = null;
    progress.value = null;
    return;
  }
  loading.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    const preserveEditState = editMode.value && !saving.value;
    const [targetOut, progressOut] = await Promise.all([
      getMyGoalTarget({
        scope_type: props.scopeType,
        scope_id: props.scopeId,
        display_currency: props.displayCurrency,
      }),
      getGoalProgress({
        scope_type: props.scopeType,
        scope_id: props.scopeId,
        display_currency: props.displayCurrency,
        basis: basis.value,
      }),
    ]);
    target.value = targetOut;
    progress.value = progressOut;
    if (!preserveEditState) {
      populateForm(targetOut);
    }
    editMode.value = targetOut.configured ? preserveEditState : true;
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

function validateForm(): string {
  const targetAmountValue = Number(form.targetAmount);
  const annualReturnValue = Number(form.annualReturnRatePct);
  const monthlyInvestValue = Number(form.monthlyInvestAmount);
  if (!Number.isFinite(targetAmountValue) || targetAmountValue <= 0) {
    return "Target amount must be greater than 0.";
  }
  if (!Number.isFinite(annualReturnValue) || annualReturnValue < 0 || annualReturnValue > 100) {
    return "Annual return rate must be between 0 and 100.";
  }
  if (!Number.isFinite(monthlyInvestValue) || monthlyInvestValue < 0) {
    return "Monthly invest amount must be 0 or greater.";
  }
  return "";
}

async function saveTarget(): Promise<void> {
  if (!props.scopeType || props.scopeId == null) return;
  const validation = validateForm();
  if (validation) {
    errorMessage.value = validation;
    successMessage.value = "";
    return;
  }
  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    await updateMyGoalTarget({
      scope_type: props.scopeType,
      scope_id: props.scopeId,
      display_currency: props.displayCurrency,
      target_amount: Number(form.targetAmount),
      annual_return_rate_pct: Number(form.annualReturnRatePct),
      monthly_invest_amount: Number(form.monthlyInvestAmount),
    });
    await refreshCard();
    editMode.value = false;
    successMessage.value = "Goal settings saved.";
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    saving.value = false;
  }
}

function resetForm(): void {
  populateForm(target.value);
  errorMessage.value = "";
  successMessage.value = "";
}

function cancelEdit(): void {
  resetForm();
  if (target.value?.configured) {
    editMode.value = false;
  }
}

function toggleExpanded(): void {
  expanded.value = !expanded.value;
}

function polarToCartesian(cx: number, cy: number, radius: number, angleInDegrees: number) {
  const angleInRadians = (angleInDegrees * Math.PI) / 180.0;
  return {
    x: cx + radius * Math.cos(angleInRadians),
    y: cy - radius * Math.sin(angleInRadians),
  };
}

function describeArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number): string {
  const start = polarToCartesian(cx, cy, radius, endAngle);
  const end = polarToCartesian(cx, cy, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
}

const gaugeViewBox = "0 0 360 240";
const gaugeTrackPath = computed(() => describeArc(180, 180, 118, 180, 0));
const gaugeProgressPath = computed(() => {
  const ratio = progressRatioPct.value / 100;
  const endAngle = 180 - 180 * ratio;
  return describeArc(180, 180, 118, 180, endAngle);
});
const gaugeNeedleEnd = computed(() => {
  const ratio = progressRatioPct.value / 100;
  const angle = 180 - 180 * ratio;
  return polarToCartesian(180, 180, 96, angle);
});
const currentMarker = computed(() => {
  const ratio = progressRatioPct.value / 100;
  const angle = 180 - 180 * ratio;
  return polarToCartesian(180, 180, 118, angle);
});

const progressToneClass = computed(() => {
  if (!progress.value?.configured) return "text-slate-300";
  if (progress.value.reached) return "text-emerald-300";
  if (progressRatioPct.value >= 75) return "text-emerald-300";
  if (progressRatioPct.value >= 35) return "text-indigo-300";
  return "text-amber-300";
});

const projectedReachLabel = computed(() => {
  if (!progress.value?.configured) return "Set a goal to start forecasting.";
  if (progress.value.reached) {
    return `Goal reached. ${formatSignedCurrency(overTargetAmount.value, props.displayCurrency)} above target.`;
  }
  if (progress.value.projected_reach_date && progress.value.projected_months_to_goal != null) {
    return `Estimated reach: ${formatProjectedDate(progress.value.projected_reach_date)} (${formatMonths(progress.value.projected_months_to_goal)}).`;
  }
  return "Not projected to reach the goal within 50 years under current assumptions.";
});

const comparisonComment = computed(() => {
  if (!progress.value?.configured) return "Save target assumptions to compare them with recent realized growth.";
  if (progress.value.recent_actual_annualized_return_pct == null || progress.value.recent_actual_window_days == null) {
    return "Recent actual growth is unavailable because snapshot history is too short.";
  }
  const actualText = formatPercent(progress.value.recent_actual_annualized_return_pct);
  const assumedText = formatPercent(target.value?.annual_return_rate_pct);
  const base = `Recent actual annualized growth over ${progress.value.recent_actual_window_days} days was ${actualText}.`;
  if (progress.value.comparison_tone === "AHEAD") {
    return `${base} That's above your assumed ${assumedText}.`;
  }
  if (progress.value.comparison_tone === "BEHIND") {
    return `${base} That's below your assumed ${assumedText}.`;
  }
  return `${base} That's broadly in line with your assumed ${assumedText}.`;
});

const collapsedSummary = computed(() => {
  if (loading.value) return "Loading goal progress...";
  if (!canLoad.value) return "Waiting for Home scope...";
  if (errorMessage.value) return errorMessage.value;
  if (!progress.value?.configured) return "No goal configured yet. Click Expand to set your target.";

  const progressText = formatRatio(progress.value.progress_ratio_pct);
  const basisText = basisLabel.value;
  const targetText = formatCurrency(targetAmount.value, props.displayCurrency);

  if (progress.value.reached) {
    return `${basisText} progress ${progressText}. Goal reached above ${targetText}.`;
  }

  if (progress.value.projected_reach_date) {
    return `${basisText} progress ${progressText}. Estimated reach ${progress.value.projected_reach_date}.`;
  }

  return `${basisText} progress ${progressText}. Goal not projected within 50 years.`;
});

function formatMonths(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "-";
  const total = Math.trunc(value);
  const years = Math.floor(total / 12);
  const months = total % 12;
  if (years <= 0) return `${months}m`;
  if (months <= 0) return `${years}y`;
  return `${years}y ${months}m`;
}

const milestoneRows = computed(() => {
  if (!progress.value?.configured) return [];
  return [
    { label: "3y", amount: toNumber(progress.value.projection_3y) },
    { label: "5y", amount: toNumber(progress.value.projection_5y) },
    { label: "10y", amount: toNumber(progress.value.projection_10y) },
  ];
});

const canSave = computed(() => validateForm() === "" && !saving.value);

watch(
  () => [expanded.value, useNet.value],
  () => {
    saveUiState();
  },
  { deep: true },
);

watch(
  () => [props.scopeType, props.scopeId, props.displayCurrency, basis.value],
  () => {
    void refreshCard();
  },
);

onMounted(() => {
  loadUiState();
  void refreshCard();
});
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
          <button
            type="button"
            class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :aria-expanded="infoOpen"
            aria-label="Goal progress help"
            @click="infoOpen = !infoOpen"
          >
            i
          </button>
        </div>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
        <div
          v-if="infoOpen"
          class="mt-3 max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
        >
          Tracks how close your current Gross or Net amount is to the saved target. Turn on Net to measure progress against net assets instead of gross assets. Forecast milestones use simple monthly compounding, and the monthly invest amount is added at month-end in each simulated month.
        </div>
      </div>
      <div class="flex items-center gap-3">
        <label class="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
          <input v-model="useNet" type="checkbox" class="h-4 w-4 rounded border-slate-400 bg-transparent text-indigo-500 focus:ring-indigo-400" />
          <span>Net</span>
        </label>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="toggleExpanded"
        >
          {{ expanded ? "Collapse" : "Expand" }}
        </button>
      </div>
    </div>

    <div v-if="!expanded" class="mt-3 space-y-1">
      <p class="text-xs text-slate-500 dark:text-slate-400">
        Collapsed. Click Expand to preview goal progress and forecast.
      </p>
      <p class="text-sm font-medium text-slate-700 dark:text-slate-200">
        {{ collapsedSummary }}
      </p>
    </div>

    <div v-else class="mt-4 space-y-4">
      <div v-if="loading" class="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        Loading goal progress...
      </div>
      <div v-else-if="errorMessage" class="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
        {{ errorMessage }}
      </div>
      <div v-else-if="!canLoad" class="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        Waiting for Home scope...
      </div>
      <div v-else class="space-y-4">
        <div class="grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]">
          <section class="rounded-2xl border border-slate-700 bg-slate-950/90 p-4">
            <div class="mx-auto max-w-[360px]">
              <svg :viewBox="gaugeViewBox" class="w-full">
                <defs>
                  <linearGradient id="goal-gauge-progress" x1="0%" x2="100%" y1="0%" y2="0%">
                    <stop offset="0%" stop-color="#6366f1" />
                    <stop offset="60%" stop-color="#4f46e5" />
                    <stop offset="100%" stop-color="#10b981" />
                  </linearGradient>
                </defs>
                <path :d="gaugeTrackPath" fill="none" stroke="rgba(100,116,139,0.28)" stroke-linecap="round" stroke-width="22" />
                <path
                  v-if="progress && progress.configured"
                  :d="gaugeProgressPath"
                  fill="none"
                  stroke="url(#goal-gauge-progress)"
                  stroke-linecap="round"
                  stroke-width="22"
                />
                <line
                  :x1="180"
                  :y1="180"
                  :x2="gaugeNeedleEnd.x"
                  :y2="gaugeNeedleEnd.y"
                  stroke="#cbd5f5"
                  stroke-linecap="round"
                  stroke-width="6"
                />
                <circle cx="180" cy="180" r="14" fill="#0f172a" stroke="#a5b4fc" stroke-width="6" />
                <circle :cx="currentMarker.x" :cy="currentMarker.y" r="6" fill="#f8fafc" stroke="#34d399" stroke-width="2" />
                <text x="36" y="198" fill="#94a3b8" font-size="12" font-weight="700">0%</text>
                <text x="296" y="198" fill="#94a3b8" font-size="12" font-weight="700">100%</text>
                <text x="180" y="98" text-anchor="middle" fill="#a5b4fc" font-size="12" font-weight="800">TARGET</text>
              </svg>
            </div>

            <div class="-mt-3 text-center">
              <p class="text-[11px] uppercase tracking-[0.28em] text-slate-400">{{ basisLabel }} progress</p>
              <p class="mt-2 text-2xl font-semibold" :class="progressToneClass">
                <span :style="amountMaskStyle()">{{ formatCurrency(currentAmount, displayCurrency) }}</span>
              </p>
              <p class="mt-1 text-sm text-slate-300">
                Target
                <span :style="amountMaskStyle()">
                  {{ target?.configured ? formatCurrency(targetAmount, displayCurrency) : "-" }}
                </span>
                · {{ formatRatio(progress?.progress_ratio_pct ?? null) }}
              </p>
              <p class="mt-3 text-xs text-slate-400">{{ projectedReachLabel }}</p>
            </div>
          </section>

          <section class="space-y-4">
            <div v-if="!progress?.configured" class="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300">
              No goal is configured for this Home scope yet. Set a target amount, annual return, and monthly invest amount to start forecasting.
            </div>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Remaining</p>
                <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  <span :style="amountMaskStyle()">
                    {{ progress?.configured ? formatCurrency(remainingAmount, displayCurrency) : "-" }}
                  </span>
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Estimated reach</p>
                <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {{ progress?.configured ? formatProjectedDate(progress.projected_reach_date) : "-" }}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Time to goal</p>
                <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {{ progress?.configured && progress.projected_months_to_goal != null ? formatMonths(progress.projected_months_to_goal) : "-" }}
                </p>
              </div>
              <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Recent actual</p>
                <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {{ progress?.configured && progress.recent_actual_annualized_return_pct != null ? formatPercent(progress.recent_actual_annualized_return_pct) : "-" }}
                </p>
              </div>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
              <div class="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Forecast milestones</h3>
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Simple compounding with month-end contributions.</p>
                </div>
                <span class="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
                  as_of {{ formatAsOf(progress?.as_of) }}
                </span>
              </div>
              <div class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div v-for="row in milestoneRows" :key="row.label" class="rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900">
                  <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">{{ row.label }}</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <span :style="amountMaskStyle()">{{ formatCurrency(row.amount, displayCurrency) }}</span>
                  </p>
                </div>
              </div>
              <p class="mt-4 text-sm text-slate-700 dark:text-slate-200">{{ comparisonComment }}</p>
            </div>

            <div class="rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div class="flex flex-wrap items-center gap-2">
                    <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Goal assumptions</h3>
                    <button
                      type="button"
                      class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      :aria-expanded="assumptionsInfoOpen"
                      aria-label="Goal assumptions help"
                      @click="assumptionsInfoOpen = !assumptionsInfoOpen"
                    >
                      i
                    </button>
                  </div>
                  <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Stored in {{ displayCurrency }} for the current Home scope.</p>
                </div>
                <div class="flex flex-wrap items-center gap-2">
                  <button
                    v-if="!editMode"
                    type="button"
                    class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    @click="editMode = true"
                  >
                    Edit
                  </button>
                  <template v-else>
                    <button
                      type="button"
                      class="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
                      :disabled="!canSave"
                      @click="saveTarget"
                    >
                      {{ saving ? "Saving..." : "Save" }}
                    </button>
                    <button
                      type="button"
                      class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      @click="resetForm"
                    >
                      Reset
                    </button>
                    <button
                      v-if="target?.configured"
                      type="button"
                      class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                      @click="cancelEdit"
                    >
                      Cancel
                    </button>
                  </template>
                </div>
              </div>

              <div
                v-if="assumptionsInfoOpen"
                class="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
              >
                Target amount is the wealth goal for this Home scope. Annual return is the assumed yearly growth rate, and monthly invest amount is added at month-end using monthly compounding in the forecast simulation.
              </div>

              <p v-if="successMessage" class="mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
                {{ successMessage }}
              </p>

              <div v-if="editMode" class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <label class="space-y-1 text-sm">
                  <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">목표자산</span>
                  <input
                    v-model="form.targetAmount"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>
                <label class="space-y-1 text-sm">
                  <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">연수익률</span>
                  <input
                    v-model="form.annualReturnRatePct"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>
                <label class="space-y-1 text-sm">
                  <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">월투자금액</span>
                  <input
                    v-model="form.monthlyInvestAmount"
                    type="number"
                    min="0"
                    step="1"
                    class="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>
              </div>

              <div v-else class="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3">
                <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">목표자산</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <span :style="amountMaskStyle()">
                      {{ target?.configured ? formatCurrency(targetAmount, displayCurrency) : "-" }}
                    </span>
                  </p>
                </div>
                <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">연수익률</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {{ target?.configured ? formatPercent(annualReturnInputValue) : "-" }}
                  </p>
                </div>
                <div class="rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800">
                  <p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">월투자금액</p>
                  <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">
                    <span :style="amountMaskStyle()">
                      {{ target?.configured ? formatCurrency(toNumber(target?.monthly_invest_amount), displayCurrency) : "-" }}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  </article>
</template>
