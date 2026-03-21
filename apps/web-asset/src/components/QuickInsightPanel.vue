<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, ref, watch } from "vue";

import {
  getQuickInsight,
  type AnalyticsQuickInsightOut,
  type QuickInsightPeriod,
} from "../api/analytics";
import {
  getSnapshotPreviewQuickInsight,
  getSnapshotQuickInsight,
  type SnapshotCsvPreviewOut,
} from "../api/snapshots";
import { formatDateTimeSeoul } from "../utils/datetime";

type DisplayCurrency = "KRW" | "USD";
type SourceMode = "LIVE" | "SNAPSHOT" | "CSV_PREVIEW";
type Severity = "positive" | "negative" | "neutral";

type QuickInsightUiState = {
  expanded: boolean;
  period: QuickInsightPeriod;
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
    scopeType?: "USER" | "HOUSEHOLD";
    scopeId?: number | null;
    snapshotId?: number | null;
    previewPayload?: SnapshotCsvPreviewOut | null;
  }>(),
  {
    title: "Quick Insight",
    description: "Snapshot delta analysis",
    amountMask: false,
    scopeType: "USER",
    scopeId: null,
    snapshotId: null,
    previewPayload: null,
  },
);

const DEFAULT_UI_STATE: QuickInsightUiState = {
  expanded: true,
  period: "1D",
  netDrivers: false,
  manualExpanded: false,
  missingExpanded: false,
};

const quickInsight = ref<AnalyticsQuickInsightOut | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const panelExpanded = ref(DEFAULT_UI_STATE.expanded);
const period = ref<QuickInsightPeriod>(DEFAULT_UI_STATE.period);
const showNetDrivers = ref(DEFAULT_UI_STATE.netDrivers);
const manualQuotesExpanded = ref(DEFAULT_UI_STATE.manualExpanded);
const missingQuotesExpanded = ref(DEFAULT_UI_STATE.missingExpanded);

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
  if (!raw || typeof raw !== "object") {
    return { ...DEFAULT_UI_STATE };
  }
  const parsed = raw as Partial<QuickInsightUiState>;
  return {
    expanded: typeof parsed.expanded === "boolean" ? parsed.expanded : DEFAULT_UI_STATE.expanded,
    period: parsed.period === "1D" || parsed.period === "7D" || parsed.period === "30D" ? parsed.period : DEFAULT_UI_STATE.period,
    netDrivers: typeof parsed.netDrivers === "boolean" ? parsed.netDrivers : DEFAULT_UI_STATE.netDrivers,
    manualExpanded: typeof parsed.manualExpanded === "boolean" ? parsed.manualExpanded : DEFAULT_UI_STATE.manualExpanded,
    missingExpanded: typeof parsed.missingExpanded === "boolean" ? parsed.missingExpanded : DEFAULT_UI_STATE.missingExpanded,
  };
}

function loadUiState(): void {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(`${props.storageKeyPrefix}:ui`);
  if (!raw) return;
  try {
    const parsed = normalizeUiState(JSON.parse(raw));
    panelExpanded.value = parsed.expanded;
    period.value = parsed.period;
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
    netDrivers: showNetDrivers.value,
    manualExpanded: manualQuotesExpanded.value,
    missingExpanded: missingQuotesExpanded.value,
  };
  window.localStorage.setItem(`${props.storageKeyPrefix}:ui`, JSON.stringify(payload));
}

if (typeof window !== "undefined") {
  loadUiState();
}

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
  return quickInsight.value.baseline_snapshot_date || `No ${quickInsight.value.period} snapshot baseline`;
});

function amountMaskStyle() {
  return props.amountMask ? { filter: "blur(6px)" } : undefined;
}

async function loadQuickInsight(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";
  try {
    if (props.sourceMode === "LIVE") {
      quickInsight.value = await getQuickInsight({
        scope_type: props.scopeType,
        scope_id: props.scopeId ?? undefined,
        display_currency: props.displayCurrency,
        period: period.value,
      });
      return;
    }

    if (props.sourceMode === "SNAPSHOT") {
      if (!props.snapshotId) {
        quickInsight.value = null;
        return;
      }
      quickInsight.value = await getSnapshotQuickInsight(props.snapshotId, {
        display_currency: props.displayCurrency,
        period: period.value,
      });
      return;
    }

    if (!props.previewPayload) {
      quickInsight.value = null;
      return;
    }

    quickInsight.value = await getSnapshotPreviewQuickInsight(props.previewPayload, {
      display_currency: props.displayCurrency,
      period: period.value,
    });
  } catch (error) {
    quickInsight.value = null;
    errorMessage.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

watch(
  () => [props.sourceMode, props.displayCurrency, props.scopeType, props.scopeId, props.snapshotId, props.previewPayload, period.value],
  () => {
    void loadQuickInsight();
  },
  { immediate: true },
);

watch(
  () => [panelExpanded.value, period.value, showNetDrivers.value, manualQuotesExpanded.value, missingQuotesExpanded.value],
  () => {
    saveUiState();
  },
);

function renderAmount(value: number): string {
  return formatSignedCurrency(value, props.displayCurrency);
}

function renderReturn(value: string | number | null | undefined): string {
  return formatPercentPoint(toNumber(value));
}

function toggleExpanded(): void {
  panelExpanded.value = !panelExpanded.value;
}
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div class="min-w-0">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ description }}</p>
      </div>
      <div class="flex flex-wrap items-center justify-end gap-2">
        <div class="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800">
          <button v-for="option in ['1D', '7D', '30D']" :key="option" type="button" class="rounded-lg px-3 py-1.5 text-xs font-semibold transition" :class="period === option ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700'" @click="period = option as QuickInsightPeriod">
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
      <div v-if="loading" class="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">Loading snapshot delta insight...</div>
      <div v-else-if="errorMessage" class="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 dark:text-rose-300">{{ errorMessage }}</div>
      <div v-else-if="quickInsight" class="space-y-4">
        <div class="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400">
          <span>Current as_of: {{ formatDateTime(quickInsight.current_as_of) }}</span>
          <span>Baseline: {{ baselineLabel }}</span>
        </div>

        <section class="rounded-2xl border px-4 py-4" :class="insightSeverityClass(quickInsight.summary_alert.severity)">
          <p class="text-sm font-semibold [overflow-wrap:anywhere]">{{ quickInsight.summary_alert.comment }}</p>
          <div class="mt-3 grid gap-3 md:grid-cols-3">
            <div class="rounded-xl bg-white/40 px-3 py-3 dark:bg-slate-900/30"><p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Gross</p><p class="mt-1 text-sm font-semibold" :class="insightDeltaClass(toNumber(quickInsight.summary_alert.gross_delta))"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(quickInsight.summary_alert.gross_delta)) }}</span></p></div>
            <div class="rounded-xl bg-white/40 px-3 py-3 dark:bg-slate-900/30"><p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Net</p><p class="mt-1 text-sm font-semibold" :class="insightDeltaClass(toNumber(quickInsight.summary_alert.net_delta))"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(quickInsight.summary_alert.net_delta)) }}</span></p></div>
            <div class="rounded-xl bg-white/40 px-3 py-3 dark:bg-slate-900/30"><p class="text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400">Liabilities</p><p class="mt-1 text-sm font-semibold" :class="insightDeltaClass(toNumber(quickInsight.summary_alert.liabilities_delta) * -1)"><span :style="amountMaskStyle()">{{ renderAmount(toNumber(quickInsight.summary_alert.liabilities_delta)) }}</span></p></div>
          </div>
        </section>

        <section class="rounded-2xl border border-slate-200 p-4 dark:border-slate-700">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ driverCardTitle }}</h3>
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
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Profit Delta Movers</h3>
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
                        </div>
                        <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">{{ item.portfolio_name || "-" }}</p>
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
                        </div>
                        <p class="mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400">{{ item.portfolio_name || "-" }}</p>
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
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Return Delta Movers</h3>
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
