<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, nextTick, ref, watch } from "vue";

import {
  getQuickInsight,
  type AnalyticsQuickInsightOut,
  type QuickInsightPeriod,
  type QuickInsightPreset,
} from "../api/analytics";
import { formatDateTimeSeoul } from "../utils/datetime";

type DisplayCurrency = "KRW" | "USD";
type SourceMode = "LIVE";
type Severity = "positive" | "negative" | "neutral";
type CompareHintState = "pending" | "exact" | "nearest" | "missing";

type QuickInsightUiState = {
  expanded: boolean;
  period: QuickInsightPeriod;
  currentDate: string;
  compareDate: string;
  netDrivers: boolean;
  manualExpanded: boolean;
  missingExpanded: boolean;
};

const props = withDefaults(
  defineProps<{
    title?: string;
    description?: string;
    sourceMode: SourceMode;
    displayCurrency: DisplayCurrency;
    amountMask?: boolean;
    storageKeyPrefix: string;
    allowCustomCompare?: boolean;
    scopeType?: "USER" | "HOUSEHOLD";
    scopeId?: number | null;
  }>(),
  {
    title: "Quick Insight",
    description: "Snapshot delta analysis",
    amountMask: false,
    allowCustomCompare: false,
    scopeType: "USER",
    scopeId: null,
  },
);

const PRESET_OPTIONS: QuickInsightPreset[] = ["1D", "7D", "30D"];

function formatDateInputValue(value: Date): string {
  const year = value.getFullYear();
  const month = `${value.getMonth() + 1}`.padStart(2, "0");
  const day = `${value.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayDateInputValue(): string {
  return formatDateInputValue(new Date());
}

function addDaysToDateInput(value: string, days: number): string {
  const base = new Date(`${value}T00:00:00`);
  if (Number.isNaN(base.getTime())) return todayDateInputValue();
  base.setDate(base.getDate() + days);
  return formatDateInputValue(base);
}

function createDefaultUiState(): QuickInsightUiState {
  const today = todayDateInputValue();
  return {
    expanded: true,
    period: "1D",
    currentDate: today,
    compareDate: addDaysToDateInput(today, -1),
    netDrivers: false,
    manualExpanded: false,
    missingExpanded: false,
  };
}

const quickInsight = ref<AnalyticsQuickInsightOut | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const panelExpanded = ref(createDefaultUiState().expanded);
const period = ref<QuickInsightPeriod>(createDefaultUiState().period);
const currentDate = ref(createDefaultUiState().currentDate);
const compareDate = ref(createDefaultUiState().compareDate);
const showNetDrivers = ref(createDefaultUiState().netDrivers);
const manualQuotesExpanded = ref(createDefaultUiState().manualExpanded);
const missingQuotesExpanded = ref(createDefaultUiState().missingExpanded);
const thresholdInfoOpen = ref(false);
const driverInfoOpen = ref(false);
const profitInfoOpen = ref(false);
const returnInfoOpen = ref(false);
const currentDateInput = ref<HTMLInputElement | null>(null);
const compareDateInput = ref<HTMLInputElement | null>(null);
const driverSectionRef = ref<HTMLElement | null>(null);
const driverSectionFlash = ref(false);

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: DisplayCurrency): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatSignedCurrency(value: number, currency: DisplayCurrency): string {
  const absText = formatCurrency(Math.abs(value), currency);
  if (value > 0) return `+${absText}`;
  if (value < 0) return `-${absText}`;
  return absText;
}

function formatPercentPoint(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%p`;
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatDateTime(value: string | null | undefined): string {
  return formatDateTimeSeoul(value);
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

function insightSeverityClass(severity: Severity | undefined): string {
  if (severity === "positive") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
  if (severity === "negative") return "border-rose-500/40 bg-rose-500/10 text-rose-100";
  return "border-slate-700 bg-slate-800/60 text-slate-100";
}

function insightDeltaClass(value: number | null | undefined): string {
  if (value == null) return "text-slate-200";
  if (value > 0) return "text-emerald-300";
  if (value < 0) return "text-rose-300";
  return "text-slate-200";
}

function insightStatusBadgeClass(status: string | null | undefined): string {
  if (status === "NEW") return "bg-emerald-500/15 text-emerald-200";
  if (status === "REMOVED") return "bg-rose-500/15 text-rose-200";
  return "bg-slate-700 text-slate-200";
}

function displayClassLabel(displayClass: string | null | undefined): string {
  const normalized = (displayClass || "").toUpperCase();
  if (!normalized) return "UNKNOWN";
  if (normalized === "REAL_ESTATE") return "REAL ESTATE";
  if (normalized === "DEPOSIT_SAVING") return "DEPOSIT";
  return normalized.replace(/_/g, " ");
}

function displayClassBadgeClass(displayClass: string | null | undefined): string {
  const normalized = (displayClass || "").toUpperCase();
  if (normalized === "CASH") return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30";
  if (normalized === "LIABILITY") return "bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30";
  if (normalized === "REAL_ESTATE") return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30";
  if (normalized === "CRYPTO") return "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30";
  if (normalized === "STOCK") return "bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/30";
  if (normalized === "DEPOSIT_SAVING") return "bg-teal-500/15 text-teal-200 ring-1 ring-teal-500/30";
  if (normalized === "BOND") return "bg-fuchsia-500/15 text-fuchsia-200 ring-1 ring-fuchsia-500/30";
  return "bg-slate-700 text-slate-200 ring-1 ring-slate-600";
}

function normalizeUiState(raw: unknown): QuickInsightUiState {
  const defaults = createDefaultUiState();
  if (!raw || typeof raw !== "object") {
    return defaults;
  }
  const parsed = raw as Partial<QuickInsightUiState>;
  return {
    expanded: typeof parsed.expanded === "boolean" ? parsed.expanded : defaults.expanded,
    period:
      parsed.period === "1D" || parsed.period === "7D" || parsed.period === "30D" || parsed.period === "CUSTOM"
        ? parsed.period
        : defaults.period,
    currentDate:
      typeof parsed.currentDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(parsed.currentDate)
        ? parsed.currentDate
        : defaults.currentDate,
    compareDate:
      typeof parsed.compareDate === "string" && /^\d{4}-\d{2}-\d{2}$/.test(parsed.compareDate)
        ? parsed.compareDate
        : defaults.compareDate,
    netDrivers: typeof parsed.netDrivers === "boolean" ? parsed.netDrivers : defaults.netDrivers,
    manualExpanded: typeof parsed.manualExpanded === "boolean" ? parsed.manualExpanded : defaults.manualExpanded,
    missingExpanded: typeof parsed.missingExpanded === "boolean" ? parsed.missingExpanded : defaults.missingExpanded,
  };
}

function loadUiState(): void {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(`${props.storageKeyPrefix}:ui`);
  if (!raw) return;
  try {
    const parsed = normalizeUiState(JSON.parse(raw));
    panelExpanded.value = parsed.expanded;
    period.value = !props.allowCustomCompare && parsed.period === "CUSTOM" ? "1D" : parsed.period;
    currentDate.value = parsed.currentDate;
    compareDate.value = parsed.compareDate;
    showNetDrivers.value = parsed.netDrivers;
    manualQuotesExpanded.value = parsed.manualExpanded;
    missingQuotesExpanded.value = parsed.missingExpanded;
  } catch {
    // ignore malformed storage
  }
}

function saveUiState(): void {
  if (typeof window === "undefined") return;
  const payload: QuickInsightUiState = {
    expanded: panelExpanded.value,
    period: period.value,
    currentDate: currentDate.value,
    compareDate: compareDate.value,
    netDrivers: showNetDrivers.value,
    manualExpanded: manualQuotesExpanded.value,
    missingExpanded: missingQuotesExpanded.value,
  };
  window.localStorage.setItem(`${props.storageKeyPrefix}:ui`, JSON.stringify(payload));
}

if (typeof window !== "undefined") {
  loadUiState();
}

const customCompareEnabled = computed(() => props.allowCustomCompare && props.sourceMode === "LIVE");
const isCustomMode = computed(() => customCompareEnabled.value && period.value === "CUSTOM");
const periodButtons = computed<QuickInsightPeriod[]>(() =>
  customCompareEnabled.value ? [...PRESET_OPTIONS, "CUSTOM"] : [...PRESET_OPTIONS],
);
const todayInputMax = computed(() => todayDateInputValue());
const driverCardTitle = computed(() => (showNetDrivers.value ? "Top Net Drivers" : "Top Gross Drivers"));
const driverPositiveLabel = computed(() => (showNetDrivers.value ? "Top Boosters" : "Top Gainers"));
const driverNegativeLabel = computed(() => (showNetDrivers.value ? "Top Drags" : "Top Losers"));
const driverPositiveItems = computed(() =>
  showNetDrivers.value
    ? (quickInsight.value?.net_drivers.top_gainers ?? [])
    : (quickInsight.value?.gross_drivers.top_gainers ?? []),
);
const driverNegativeItems = computed(() =>
  showNetDrivers.value
    ? (quickInsight.value?.net_drivers.top_losers ?? [])
    : (quickInsight.value?.gross_drivers.top_losers ?? []),
);
const portfolioChangeTitle = computed(() => (showNetDrivers.value ? "Current Net Delta" : "Current Value Delta"));
const portfolioChangeItems = computed(() =>
  showNetDrivers.value
    ? (quickInsight.value?.portfolio_changes.top_net_value_changes ?? [])
    : (quickInsight.value?.portfolio_changes.top_current_value_changes ?? []),
);
const baselineLabel = computed(() => {
  if (!quickInsight.value) return "-";
  return (
    quickInsight.value.matched_compare_snapshot_date ||
    quickInsight.value.baseline_snapshot_date ||
    (quickInsight.value.period === "CUSTOM" ? "No custom snapshot baseline" : `No ${quickInsight.value.period} snapshot baseline`)
  );
});
const compareModeLabel = computed(() =>
  quickInsight.value?.compare_mode === "CUSTOM" ? "snapshot-to-snapshot compare" : "valuation snapshot delta analysis",
);

function compareHintClass(state: CompareHintState): string {
  if (state === "exact") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  }
  if (state === "nearest") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }
  if (state === "missing") {
    return "border-rose-500/30 bg-rose-500/10 text-rose-200";
  }
  return "border-slate-700 bg-slate-800/60 text-slate-300";
}

function buildCompareHint(
  requestedValue: string,
  requestedFromInsight: string | null | undefined,
  matchedFromInsight: string | null | undefined,
): { state: CompareHintState; text: string } {
  if (!isCustomMode.value) {
    return { state: "pending", text: "" };
  }
  if (!quickInsight.value || quickInsight.value.compare_mode !== "CUSTOM") {
    return { state: "pending", text: "Apply to check which snapshot will be used." };
  }
  if (requestedFromInsight !== requestedValue) {
    return { state: "pending", text: "Apply to refresh the matched snapshot for this date." };
  }
  if (!matchedFromInsight) {
    return { state: "missing", text: "No snapshot found on or before this date." };
  }
  if (matchedFromInsight === requestedValue) {
    return { state: "exact", text: "Exact snapshot found for this date." };
  }
  return {
    state: "nearest",
    text: `No exact snapshot on this date. Using nearest snapshot: ${matchedFromInsight}.`,
  };
}

const customCurrentHint = computed(() =>
  buildCompareHint(
    currentDate.value,
    quickInsight.value?.requested_current_date,
    quickInsight.value?.matched_current_snapshot_date,
  ),
);
const customCompareHint = computed(() =>
  buildCompareHint(
    compareDate.value,
    quickInsight.value?.requested_compare_date,
    quickInsight.value?.matched_compare_snapshot_date,
  ),
);

function amountMaskStyle() {
  return props.amountMask ? { filter: "blur(6px)" } : undefined;
}

function validateCustomCompare(): string {
  if (!currentDate.value || !compareDate.value) {
    return "Select both current and compare dates.";
  }
  if (currentDate.value > todayInputMax.value) {
    return "Current date cannot be later than today.";
  }
  if (compareDate.value > todayInputMax.value) {
    return "Compare date cannot be later than today.";
  }
  if (compareDate.value > currentDate.value) {
    return "Compare date cannot be later than current date.";
  }
  return "";
}

async function loadQuickInsight(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";
  try {
    if (isCustomMode.value) {
      quickInsight.value = await getQuickInsight({
        scope_type: props.scopeType,
        scope_id: props.scopeId ?? undefined,
        display_currency: props.displayCurrency,
        mode: "CUSTOM",
        current_date: currentDate.value,
        compare_date: compareDate.value,
      });
      return;
    }
    quickInsight.value = await getQuickInsight({
      scope_type: props.scopeType,
      scope_id: props.scopeId ?? undefined,
      display_currency: props.displayCurrency,
      mode: "PRESET",
      preset: period.value as QuickInsightPreset,
    });
  } catch (error) {
    quickInsight.value = null;
    errorMessage.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => [props.sourceMode, props.displayCurrency, props.scopeType, props.scopeId, period.value],
  (_next, previous) => {
    const previousPeriod = Array.isArray(previous) ? previous[4] : undefined;
    if (customCompareEnabled.value && period.value === "CUSTOM" && previousPeriod !== undefined && previousPeriod !== "CUSTOM") {
      return;
    }
    void loadQuickInsight();
  },
  { immediate: true },
);

watch(
  () => [panelExpanded.value, period.value, currentDate.value, compareDate.value, showNetDrivers.value, manualQuotesExpanded.value, missingQuotesExpanded.value],
  () => {
    saveUiState();
  },
);

function renderAmount(value: number): string {
  return formatSignedCurrency(value, props.displayCurrency);
}

function splitTextAndAmounts(source: string): Array<{ text: string; isAmount: boolean; isDriver: boolean }> {
  const pattern = /([+-]?(?:₩|\$)\d[\d,]*(?:\.\d+)?)/g;
  const parts: Array<{ text: string; isAmount: boolean; isDriver: boolean }> = [];
  let lastIndex = 0;
  for (const match of source.matchAll(pattern)) {
    const matchIndex = match.index ?? 0;
    if (matchIndex > lastIndex) {
      parts.push({ text: source.slice(lastIndex, matchIndex), isAmount: false, isDriver: false });
    }
    parts.push({ text: match[0], isAmount: true, isDriver: false });
    lastIndex = matchIndex + match[0].length;
  }
  if (lastIndex < source.length) {
    parts.push({ text: source.slice(lastIndex), isAmount: false, isDriver: false });
  }
  return parts;
}

const summaryCommentDisplayParts = computed(() => {
  const alert = quickInsight.value?.summary_alert;
  const comment = alert?.comment || "";
  const driverLabel = alert?.driver_label || "";
  if (!comment) return [];
  if (!driverLabel) return splitTextAndAmounts(comment);
  const matchIndex = comment.indexOf(driverLabel);
  if (matchIndex < 0) return splitTextAndAmounts(comment);
  return [
    ...splitTextAndAmounts(comment.slice(0, matchIndex)),
    { text: driverLabel, isAmount: false, isDriver: true },
    ...splitTextAndAmounts(comment.slice(matchIndex + driverLabel.length)),
  ];
});

const canJumpToSummaryDriver = computed(() => {
  const alert = quickInsight.value?.summary_alert;
  return Boolean(alert?.driver_label && alert?.driver_target);
});

function renderReturn(value: string | number | null | undefined): string {
  return formatPercentPoint(toNumber(value));
}

function renderReturnPercent(value: string | number | null | undefined): string {
  if (value == null || value === "") return "-";
  return formatPercent(toNumber(value));
}

function toggleExpanded(): void {
  panelExpanded.value = !panelExpanded.value;
}

function toggleThresholdInfo(): void {
  thresholdInfoOpen.value = !thresholdInfoOpen.value;
}

function toggleDriverInfo(): void {
  driverInfoOpen.value = !driverInfoOpen.value;
}

function toggleProfitInfo(): void {
  profitInfoOpen.value = !profitInfoOpen.value;
}

function toggleReturnInfo(): void {
  returnInfoOpen.value = !returnInfoOpen.value;
}

async function jumpToSummaryDriver(): Promise<void> {
  if (!quickInsight.value?.summary_alert.driver_target) return;
  panelExpanded.value = true;
  showNetDrivers.value = quickInsight.value.summary_alert.driver_target === "NET_DRIVERS";
  await nextTick();
  driverSectionFlash.value = false;
  driverSectionRef.value?.scrollIntoView({ behavior: "smooth", block: "start" });
  driverSectionFlash.value = true;
  window.setTimeout(() => {
    driverSectionFlash.value = false;
  }, 1400);
}

function hasCostBasisDelta(value: string | number | null | undefined): boolean {
  if (value == null) return false;
  return Math.abs(toNumber(value)) >= 1;
}

function openNativeDatePicker(target: HTMLInputElement | null): void {
  if (!target) return;
  target.focus();
  if (typeof target.showPicker === "function") {
    try {
      target.showPicker();
    } catch {
      // ignore browsers that block programmatic picker open
    }
  }
}

function setQuickInsightPeriod(option: QuickInsightPeriod): void {
  period.value = option;
  if (option === "CUSTOM") {
    if (!currentDate.value) {
      currentDate.value = todayDateInputValue();
    }
    if (!compareDate.value) {
      compareDate.value = addDaysToDateInput(currentDate.value, -1);
    }
    errorMessage.value = "";
  }
}

async function applyCustomCompare(): Promise<void> {
  const validationMessage = validateCustomCompare();
  if (validationMessage) {
    errorMessage.value = validationMessage;
    return;
  }
  await loadQuickInsight();
}

function resetCustomCompareDates(): void {
  const today = todayDateInputValue();
  currentDate.value = today;
  compareDate.value = addDaysToDateInput(today, -1);
  errorMessage.value = "";
}

async function resetCustomCompareAndApply(): Promise<void> {
  resetCustomCompareDates();
  await applyCustomCompare();
}
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <div class="flex flex-wrap items-center gap-2">
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :aria-expanded="thresholdInfoOpen"
            aria-label="Quick Insight threshold info"
            @click="toggleThresholdInfo"
          >
            i
          </button>
        </div>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ description }}</p>
        <div
          v-if="thresholdInfoOpen"
          class="mt-3 max-w-2xl rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
        >
          <p class="font-semibold text-slate-700 dark:text-slate-100">Minor move threshold</p>
          <p class="mt-1 [overflow-wrap:anywhere]">
            Changes below 0.25% of baseline gross are treated as a minor move.
            Exact threshold = max(0.25% of baseline gross, 1 unit in the selected display currency).
          </p>
        </div>
      </div>
      <div class="flex flex-wrap items-center justify-end gap-2">
        <div class="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
          <button
            v-for="option in periodButtons"
            :key="option"
            type="button"
            class="rounded-lg px-3 py-1.5 text-xs font-semibold transition"
            :class="period === option ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'"
            @click="setQuickInsightPeriod(option)"
          >
            {{ option }}
          </button>
        </div>
        <label class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
          <input v-model="showNetDrivers" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900" />
          Net
        </label>
        <button type="button" class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="toggleExpanded">
          {{ panelExpanded ? "Collapse" : "Expand" }}
        </button>
      </div>
    </div>

    <div v-if="panelExpanded" class="mt-4">
      <section v-if="isCustomMode" class="mb-4 rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr),minmax(0,1fr),auto,auto] md:items-end">
          <label class="block min-w-0">
            <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Current 기준일</span>
            <input
              ref="currentDateInput"
              v-model="currentDate"
              type="date"
              :max="todayInputMax"
              class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              @click="openNativeDatePicker(currentDateInput)"
              @focus="openNativeDatePicker(currentDateInput)"
            />
            <span
              class="mt-2 inline-flex rounded-lg border px-2.5 py-1 text-xs"
              :class="compareHintClass(customCurrentHint.state)"
            >
              {{ customCurrentHint.text }}
            </span>
          </label>
          <label class="block min-w-0">
            <span class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">비교 기준일</span>
            <input
              ref="compareDateInput"
              v-model="compareDate"
              type="date"
              :max="todayInputMax"
              class="mt-2 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              @click="openNativeDatePicker(compareDateInput)"
              @focus="openNativeDatePicker(compareDateInput)"
            />
            <span
              class="mt-2 inline-flex rounded-lg border px-2.5 py-1 text-xs"
              :class="compareHintClass(customCompareHint.state)"
            >
              {{ customCompareHint.text }}
            </span>
          </label>
          <button
            type="button"
            class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
              :disabled="loading"
              @click="applyCustomCompare"
            >
              Apply
            </button>
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="loading"
            @click="resetCustomCompareDates"
          >
            Reset to Today
          </button>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            class="rounded-xl border border-indigo-400/40 bg-indigo-500/10 px-4 py-2 text-sm font-semibold text-indigo-200 transition-colors hover:bg-indigo-500/15 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="loading"
            @click="resetCustomCompareAndApply"
          >
            Reset to Today + Apply
          </button>
          <p class="text-xs text-slate-500 dark:text-slate-400">
            Custom compare uses snapshot-to-snapshot comparison on the selected dates. Click a date field to open the calendar picker.
          </p>
        </div>
      </section>

      <div v-if="loading" class="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">Loading snapshot delta insight...</div>
      <div v-else-if="errorMessage" class="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 dark:text-rose-300">{{ errorMessage }}</div>
      <div v-else-if="quickInsight" class="space-y-4">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Current as_of: {{ formatDateTime(quickInsight.current_as_of) }}</span>
          <span v-if="quickInsight.compare_mode">Mode: {{ compareModeLabel }}</span>
          <template v-if="quickInsight.compare_mode">
            <span>Requested current: {{ quickInsight.requested_current_date || "-" }}</span>
            <span>Matched current snapshot: {{ quickInsight.matched_current_snapshot_date || "-" }}</span>
            <span>Requested compare: {{ quickInsight.requested_compare_date || "-" }}</span>
            <span>Matched compare snapshot: {{ quickInsight.matched_compare_snapshot_date || baselineLabel }}</span>
          </template>
          <span v-else>Baseline: {{ baselineLabel }}</span>
        </div>

        <section class="rounded-2xl border px-4 py-4" :class="insightSeverityClass(quickInsight.summary_alert.severity)">
          <p class="text-sm font-semibold [overflow-wrap:anywhere]">
            <template
              v-for="(part, index) in summaryCommentDisplayParts"
              :key="`summary-comment-${index}`"
            >
              <button
                v-if="part.isDriver && canJumpToSummaryDriver"
                type="button"
                class="inline font-semibold text-indigo-100 underline decoration-indigo-300/60 underline-offset-2 transition hover:text-white"
                @click="jumpToSummaryDriver"
              >
                {{ part.text }}
              </button>
              <span v-else :style="part.isAmount ? amountMaskStyle() : undefined">{{ part.text }}</span>
            </template>
          </p>
          <div class="mt-3 grid gap-3 md:grid-cols-3">
            <div class="rounded-xl bg-white/40 px-3 py-3 dark:bg-slate-900/30"><p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Gross</p><p class="mt-1 text-sm font-semibold" :class="insightDeltaClass(toNumber(quickInsight.summary_alert.gross_delta))"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(quickInsight.summary_alert.gross_delta)) }}</span></p></div>
            <div class="rounded-xl bg-white/40 px-3 py-3 dark:bg-slate-900/30"><p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Net</p><p class="mt-1 text-sm font-semibold" :class="insightDeltaClass(toNumber(quickInsight.summary_alert.net_delta))"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(quickInsight.summary_alert.net_delta)) }}</span></p></div>
            <div class="rounded-xl bg-white/40 px-3 py-3 dark:bg-slate-900/30"><p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Liabilities</p><p class="mt-1 text-sm font-semibold" :class="insightDeltaClass(toNumber(quickInsight.summary_alert.liabilities_delta) * -1)"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(quickInsight.summary_alert.liabilities_delta)) }}</span></p></div>
          </div>
        </section>

        <section
          ref="driverSectionRef"
          class="scroll-mt-24 rounded-2xl border border-slate-200 p-4 transition-all duration-500 dark:border-slate-700"
          :class="driverSectionFlash ? 'ring-2 ring-indigo-400/60 bg-indigo-500/5 shadow-[0_0_0_1px_rgba(129,140,248,0.18)]' : ''"
        >
          <div class="flex flex-wrap items-center gap-2">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ driverCardTitle }}</h3>
            <button
              type="button"
              class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              :aria-expanded="driverInfoOpen"
              :aria-label="`${driverCardTitle} info`"
              @click="toggleDriverInfo"
            >
              i
            </button>
          </div>
          <div
            v-if="driverInfoOpen"
            class="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
          >
              <p class="font-semibold text-slate-700 dark:text-slate-100">{{ driverCardTitle }} meaning</p>
              <p class="mt-1 [overflow-wrap:anywhere]">
                {{ showNetDrivers
                  ? "Top Net Drivers shows net-asset impact. Holdings use evaluated value delta, while liabilities reduce net when their balances rise."
                  : "Top Gross Drivers shows evaluated value delta versus the selected baseline snapshot. This is current evaluated amount minus baseline evaluated amount." }}
              </p>
              <p v-if="!showNetDrivers" class="mt-2 [overflow-wrap:anywhere]">
                Cost basis Δ is shown as a helper line so you can compare why Gross Delta and Profit Delta may diverge for the same holding.
              </p>
            </div>
          <div class="mt-3 grid gap-3 md:grid-cols-2">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">{{ driverPositiveLabel }}</p>
              <ul v-if="driverPositiveItems.length" class="mt-2 space-y-2">
                <li v-for="item in driverPositiveItems" :key="`driver-positive-${item.key}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <p class="text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{{ item.label }}</p>
                        <span v-if="item.display_class" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="displayClassBadgeClass(item.display_class)">{{ displayClassLabel(item.display_class) }}</span>
                        <span v-if="item.status" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="insightStatusBadgeClass(item.status)">{{ item.status }}</span>
                      </div>
                      <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">{{ item.portfolio_name || "-" }}</p>
                      <p
                        v-if="!showNetDrivers && hasCostBasisDelta(item.delta_cost_basis)"
                        class="mt-1 text-xs [overflow-wrap:anywhere]"
                        :class="insightDeltaClass(toNumber(item.delta_cost_basis))"
                      >
                        Cost basis Δ:
                        <span :style="amountMaskStyle()">{{ renderAmount(toNumber(item.delta_cost_basis)) }}</span>
                      </p>
                    </div>
                    <p class="text-left text-sm font-semibold text-emerald-600 sm:text-right dark:text-emerald-300"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(item.delta_amount)) }}</span></p>
                  </div>
                </li>
              </ul>
              <p v-else class="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ showNetDrivers ? "No boosters." : "No gainers." }}</p>
            </div>
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 dark:text-rose-300">{{ driverNegativeLabel }}</p>
              <ul v-if="driverNegativeItems.length" class="mt-2 space-y-2">
                <li v-for="item in driverNegativeItems" :key="`driver-negative-${item.key}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                  <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div class="min-w-0 flex-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <p class="text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{{ item.label }}</p>
                        <span v-if="item.display_class" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="displayClassBadgeClass(item.display_class)">{{ displayClassLabel(item.display_class) }}</span>
                        <span v-if="item.status" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="insightStatusBadgeClass(item.status)">{{ item.status }}</span>
                      </div>
                      <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">{{ item.portfolio_name || "-" }}</p>
                      <p
                        v-if="!showNetDrivers && hasCostBasisDelta(item.delta_cost_basis)"
                        class="mt-1 text-xs [overflow-wrap:anywhere]"
                        :class="insightDeltaClass(toNumber(item.delta_cost_basis))"
                      >
                        Cost basis Δ:
                        <span :style="amountMaskStyle()">{{ renderAmount(toNumber(item.delta_cost_basis)) }}</span>
                      </p>
                    </div>
                    <p class="text-left text-sm font-semibold text-rose-500 sm:text-right dark:text-rose-300"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(item.delta_amount)) }}</span></p>
                  </div>
                </li>
              </ul>
              <p v-else class="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">{{ showNetDrivers ? "No drags." : "No losers." }}</p>
            </div>
          </div>
        </section>

        <div class="grid gap-4 xl:grid-cols-2">
          <section class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Profit Delta Movers</h3>
              <button
                type="button"
                class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                :aria-expanded="profitInfoOpen"
                aria-label="Profit Delta Movers info"
                @click="toggleProfitInfo"
              >
                i
              </button>
            </div>
            <div
              v-if="profitInfoOpen"
              class="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
            >
              <p class="font-semibold text-slate-700 dark:text-slate-100">Profit Delta formula</p>
              <p class="mt-1 [overflow-wrap:anywhere]">
                Profit Delta compares profit versus the selected baseline snapshot. Profit = evaluated value - cost basis, so Profit Delta = Gross Delta - Cost Basis Delta.
              </p>
            </div>
            <div class="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Top 3</p>
                <ul v-if="quickInsight.profit_movers.top_gainers.length" class="mt-2 space-y-2">
                  <li v-for="item in quickInsight.profit_movers.top_gainers" :key="`profit-gain-${item.key}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{{ item.label }}</p>
                          <span v-if="item.display_class" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="displayClassBadgeClass(item.display_class)">{{ displayClassLabel(item.display_class) }}</span>
                          <span v-if="item.status" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="insightStatusBadgeClass(item.status)">{{ item.status }}</span>
                        </div>
                        <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">{{ item.portfolio_name || "-" }}</p>
                        <p
                          v-if="hasCostBasisDelta(item.delta_cost_basis)"
                          class="mt-1 text-xs [overflow-wrap:anywhere]"
                          :class="insightDeltaClass(toNumber(item.delta_cost_basis))"
                        >
                          Cost basis Δ:
                          <span :style="amountMaskStyle()">{{ renderAmount(toNumber(item.delta_cost_basis)) }}</span>
                        </p>
                      </div>
                      <p class="text-left text-sm font-semibold text-emerald-600 sm:text-right dark:text-emerald-300"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(item.delta_amount)) }}</span></p>
                    </div>
                  </li>
                </ul>
                <p v-else class="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">No movers yet.</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 dark:text-rose-300">Bottom 3</p>
                <ul v-if="quickInsight.profit_movers.top_losers.length" class="mt-2 space-y-2">
                  <li v-for="item in quickInsight.profit_movers.top_losers" :key="`profit-loss-${item.key}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{{ item.label }}</p>
                          <span v-if="item.display_class" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="displayClassBadgeClass(item.display_class)">{{ displayClassLabel(item.display_class) }}</span>
                          <span v-if="item.status" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="insightStatusBadgeClass(item.status)">{{ item.status }}</span>
                        </div>
                        <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">{{ item.portfolio_name || "-" }}</p>
                        <p
                          v-if="hasCostBasisDelta(item.delta_cost_basis)"
                          class="mt-1 text-xs [overflow-wrap:anywhere]"
                          :class="insightDeltaClass(toNumber(item.delta_cost_basis))"
                        >
                          Cost basis Δ:
                          <span :style="amountMaskStyle()">{{ renderAmount(toNumber(item.delta_cost_basis)) }}</span>
                        </p>
                      </div>
                      <p class="text-left text-sm font-semibold text-rose-500 sm:text-right dark:text-rose-300"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(item.delta_amount)) }}</span></p>
                    </div>
                  </li>
                </ul>
                <p v-else class="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">No losers yet.</p>
              </div>
            </div>
          </section>

          <section class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <div class="flex flex-wrap items-center gap-2">
              <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Return Delta Movers</h3>
              <button
                type="button"
                class="inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                :aria-expanded="returnInfoOpen"
                aria-label="Return Delta Movers info"
                @click="toggleReturnInfo"
              >
                i
              </button>
            </div>
            <div
              v-if="returnInfoOpen"
              class="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
            >
              <p class="font-semibold text-slate-700 dark:text-slate-100">Return Delta formula</p>
              <p class="mt-1 [overflow-wrap:anywhere]">
                Return Delta compares return percentage versus the selected baseline snapshot. It is shown in percentage points (%p), not in currency amount.
              </p>
              <p class="mt-2 [overflow-wrap:anywhere]">
                Each row also shows current return and baseline return so you can see which side of the gap changed.
              </p>
            </div>
            <div class="mt-3 grid gap-3 md:grid-cols-2">
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300">Top 3</p>
                <ul v-if="quickInsight.return_movers.top_gainers.length" class="mt-2 space-y-2">
                  <li v-for="item in quickInsight.return_movers.top_gainers" :key="`return-gain-${item.key}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{{ item.label }}</p>
                          <span v-if="item.display_class" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="displayClassBadgeClass(item.display_class)">{{ displayClassLabel(item.display_class) }}</span>
                        </div>
                        <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">{{ item.portfolio_name || "-" }}</p>
                        <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                          Current:
                          <span class="font-medium text-slate-700 dark:text-slate-200">{{ renderReturnPercent(item.current_return_pct) }}</span>
                          · Baseline:
                          <span class="font-medium text-slate-700 dark:text-slate-200">{{ renderReturnPercent(item.baseline_return_pct) }}</span>
                        </p>
                      </div>
                      <p class="text-left text-sm font-semibold text-emerald-600 sm:text-right dark:text-emerald-300">{{ renderReturn(item.delta_return_pct) }}</p>
                    </div>
                  </li>
                </ul>
                <p v-else class="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">No movers yet.</p>
              </div>
              <div>
                <p class="text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 dark:text-rose-300">Bottom 3</p>
                <ul v-if="quickInsight.return_movers.top_losers.length" class="mt-2 space-y-2">
                  <li v-for="item in quickInsight.return_movers.top_losers" :key="`return-loss-${item.key}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{{ item.label }}</p>
                          <span v-if="item.display_class" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="displayClassBadgeClass(item.display_class)">{{ displayClassLabel(item.display_class) }}</span>
                        </div>
                        <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">{{ item.portfolio_name || "-" }}</p>
                        <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">
                          Current:
                          <span class="font-medium text-slate-700 dark:text-slate-200">{{ renderReturnPercent(item.current_return_pct) }}</span>
                          · Baseline:
                          <span class="font-medium text-slate-700 dark:text-slate-200">{{ renderReturnPercent(item.baseline_return_pct) }}</span>
                        </p>
                      </div>
                      <p class="text-left text-sm font-semibold text-rose-500 sm:text-right dark:text-rose-300">{{ renderReturn(item.delta_return_pct) }}</p>
                    </div>
                  </li>
                </ul>
                <p v-else class="mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">No losers yet.</p>
              </div>
            </div>
          </section>
        </div>

        <div class="grid gap-4 xl:grid-cols-[minmax(0,2fr),minmax(0,1fr)]">
          <section class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Portfolio Changes</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ portfolioChangeTitle }}</p>
            <ul v-if="portfolioChangeItems.length" class="mt-3 space-y-2">
              <li v-for="item in portfolioChangeItems" :key="`portfolio-change-${item.key}`" class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div class="min-w-0 flex-1">
                    <p class="text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{{ item.label }}</p>
                    <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      <span v-if="item.status" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="insightStatusBadgeClass(item.status)">{{ item.status }}</span>
                    </p>
                  </div>
                  <p class="text-left text-sm font-semibold sm:text-right" :class="insightDeltaClass(toNumber(item.delta_amount))">
                    <span :style="amountMaskStyle()">{{ renderAmount(toNumber(item.delta_amount)) }}</span>
                  </p>
                </div>
              </li>
            </ul>
            <p v-else class="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">No portfolio changes yet.</p>
          </section>

          <section class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Warnings</h3>
            <ul class="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <li class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">Stale quotes: {{ quickInsight.warnings.stale_quote_count }}</li>
              <li class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <span>Manual quotes: {{ quickInsight.warnings.manual_quote_count }}</span>
                  <button v-if="quickInsight.warnings.manual_quote_count > 0" type="button" class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700" @click="manualQuotesExpanded = !manualQuotesExpanded">
                    {{ manualQuotesExpanded ? "Collapse" : "Expand" }}
                  </button>
                </div>
                <ul v-if="manualQuotesExpanded && quickInsight.warnings.manual_quotes.length" class="mt-2 space-y-2 border-t border-slate-200 pt-2 text-xs dark:border-slate-700">
                  <li v-for="item in quickInsight.warnings.manual_quotes" :key="`manual-quote-${item.key}`" class="rounded-lg bg-white/70 px-2 py-2 dark:bg-slate-900/40">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{{ item.label }}</p>
                          <span v-if="item.display_class" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="displayClassBadgeClass(item.display_class)">{{ displayClassLabel(item.display_class) }}</span>
                        </div>
                        <p class="mt-0.5 [overflow-wrap:anywhere] text-slate-500 dark:text-slate-400">{{ item.portfolio_name || "-" }}<span v-if="item.symbol"> · {{ item.symbol }}</span></p>
                      </div>
                      <p class="text-slate-500 dark:text-slate-400">{{ formatDateTime(item.quote_as_of) }}</p>
                    </div>
                  </li>
                </ul>
              </li>
              <li class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <span>Missing quotes: {{ quickInsight.warnings.missing_quote_count }}</span>
                  <button v-if="quickInsight.warnings.missing_quote_count > 0" type="button" class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700" @click="missingQuotesExpanded = !missingQuotesExpanded">
                    {{ missingQuotesExpanded ? "Collapse" : "Expand" }}
                  </button>
                </div>
                <ul v-if="missingQuotesExpanded && quickInsight.warnings.missing_quotes.length" class="mt-2 space-y-2 border-t border-slate-200 pt-2 text-xs dark:border-slate-700">
                  <li v-for="item in quickInsight.warnings.missing_quotes" :key="`missing-quote-${item.key}`" class="rounded-lg bg-white/70 px-2 py-2 dark:bg-slate-900/40">
                    <div class="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div class="min-w-0 flex-1">
                        <div class="flex flex-wrap items-center gap-2">
                          <p class="font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100">{{ item.label }}</p>
                          <span v-if="item.display_class" class="inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold" :class="displayClassBadgeClass(item.display_class)">{{ displayClassLabel(item.display_class) }}</span>
                        </div>
                        <p class="mt-0.5 [overflow-wrap:anywhere] text-slate-500 dark:text-slate-400">{{ item.portfolio_name || "-" }}<span v-if="item.symbol"> · {{ item.symbol }}</span></p>
                        <p class="mt-0.5 text-slate-500 dark:text-slate-400">No current quote available</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </div>

    <p v-else class="mt-3 text-xs text-slate-500 dark:text-slate-400">
      Collapsed. Click <span class="font-semibold">Expand</span> to view snapshot delta insight.
    </p>
  </article>
</template>
