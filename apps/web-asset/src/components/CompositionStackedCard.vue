<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import {
  getCompositionSeries,
  type AnalyticsCompositionBucket,
  type AnalyticsCompositionChartKind,
  type AnalyticsCompositionGroupBy,
  type AnalyticsCompositionMode,
  type AnalyticsCompositionPointOut,
  type AnalyticsCompositionSeriesOut,
  type AnalyticsCompositionTab,
} from "../api/analytics";
import { getMySettings, updateMySettings } from "../api/userSettings";
import { formatDateTimeSeoul } from "../utils/datetime";

type PortfolioOption = {
  key: string;
  label: string;
};

type CardUiState = {
  expanded: boolean;
  tab: AnalyticsCompositionTab;
  bucket: AnalyticsCompositionBucket;
  grossMode: AnalyticsCompositionMode;
  grossGroup: "ASSET_CLASS" | "PORTFOLIO" | "ASSET";
  assetTopN: number;
  assetThresholdPct: number;
  liabilityGroup: "PORTFOLIO" | "LIABILITY_TYPE";
  portfolioKey: string;
};

const props = withDefaults(
  defineProps<{
    title: string;
    description: string;
    chartKind: AnalyticsCompositionChartKind;
    displayCurrency: "KRW" | "USD";
    scopeType?: "USER" | "HOUSEHOLD" | null;
    scopeId?: number | null;
    amountMask?: boolean;
    storageKeyPrefix: string;
    portfolioOptions?: PortfolioOption[];
  }>(),
  {
    scopeType: null,
    scopeId: null,
    amountMask: false,
    portfolioOptions: () => [],
  },
);

const TAB_OPTIONS: AnalyticsCompositionTab[] = [
  "GROSS_COMPOSITION",
  "CAPITAL_STRUCTURE",
  "LIABILITY_BREAKDOWN",
];
const BUCKET_OPTIONS: AnalyticsCompositionBucket[] = ["DAY", "WEEK", "MONTH"];
const SUMMARY_GROSS_GROUP_OPTIONS: Array<"ASSET_CLASS" | "PORTFOLIO" | "ASSET"> = ["ASSET_CLASS", "PORTFOLIO", "ASSET"];
const PORTFOLIO_GROSS_GROUP_OPTIONS: Array<"ASSET_CLASS" | "ASSET"> = ["ASSET_CLASS", "ASSET"];
const LIABILITY_GROUP_OPTIONS: Array<"PORTFOLIO" | "LIABILITY_TYPE"> = ["PORTFOLIO", "LIABILITY_TYPE"];
const ASSET_TOP_N_OPTIONS = [5, 8, 10, 12];
const ASSET_THRESHOLD_OPTIONS = [8, 10, 12, 15];

function createDefaultUiState(): CardUiState {
  return {
    expanded: true,
    tab: "GROSS_COMPOSITION",
    bucket: "DAY",
    grossMode: "SUMMARY",
    grossGroup: "ASSET_CLASS",
    assetTopN: 8,
    assetThresholdPct: 10,
    liabilityGroup: "PORTFOLIO",
    portfolioKey: "",
  };
}

const ui = reactive<CardUiState>(createDefaultUiState());
const data = ref<AnalyticsCompositionSeriesOut | null>(null);
const loading = ref(false);
const errorMessage = ref("");
const inspectIndex = ref<number | null>(null);
const infoOpen = ref(false);
const hoveredSegmentKey = ref<string | null>(null);
const thresholdSaving = ref(false);
const thresholdSaveError = ref("");
const USER_REBALANCE_THRESHOLD_EVENT = "myasset:user-settings:asset-rebalance-threshold";

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: number, currency: "KRW" | "USD"): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCompactAmount(value: number): string {
  return new Intl.NumberFormat("ko-KR", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value || 0);
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value.toFixed(1)}%`;
}

function formatDateTime(value: string | null | undefined): string {
  return formatDateTimeSeoul(value);
}

function amountMaskStyle() {
  return props.amountMask ? { filter: "blur(6px)" } : undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    return error.response?.data?.detail || error.message;
  }
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function loadUiState(): void {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(`${props.storageKeyPrefix}:ui`);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Partial<CardUiState> & {
      grossSummaryGroup?: "ASSET_CLASS" | "PORTFOLIO";
    };
    if (typeof parsed.expanded === "boolean") ui.expanded = parsed.expanded;
    if (TAB_OPTIONS.includes(parsed.tab as AnalyticsCompositionTab)) ui.tab = parsed.tab as AnalyticsCompositionTab;
    if (BUCKET_OPTIONS.includes(parsed.bucket as AnalyticsCompositionBucket)) ui.bucket = parsed.bucket as AnalyticsCompositionBucket;
    if (parsed.grossMode === "SUMMARY" || parsed.grossMode === "PORTFOLIO") ui.grossMode = parsed.grossMode;
    if (
      parsed.grossGroup === "ASSET_CLASS" ||
      parsed.grossGroup === "PORTFOLIO" ||
      parsed.grossGroup === "ASSET"
    ) {
      ui.grossGroup = parsed.grossGroup;
    } else if (
      parsed.grossSummaryGroup === "ASSET_CLASS" ||
      parsed.grossSummaryGroup === "PORTFOLIO"
    ) {
      ui.grossGroup = parsed.grossSummaryGroup;
    }
    if (parsed.liabilityGroup === "PORTFOLIO" || parsed.liabilityGroup === "LIABILITY_TYPE") {
      ui.liabilityGroup = parsed.liabilityGroup;
    }
    if (typeof parsed.assetTopN === "number" && Number.isFinite(parsed.assetTopN) && parsed.assetTopN >= 3 && parsed.assetTopN <= 20) {
      ui.assetTopN = Math.round(parsed.assetTopN);
    }
    if (typeof parsed.assetThresholdPct === "number" && Number.isFinite(parsed.assetThresholdPct) && parsed.assetThresholdPct >= 5 && parsed.assetThresholdPct <= 30) {
      ui.assetThresholdPct = Math.round(parsed.assetThresholdPct);
    }
    if (typeof parsed.portfolioKey === "string") ui.portfolioKey = parsed.portfolioKey;
  } catch {
    // ignore malformed state
  }
}

function saveUiState(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(`${props.storageKeyPrefix}:ui`, JSON.stringify(ui));
}

const canLoad = computed(() => Boolean(props.scopeType && props.scopeId != null));
const effectiveMode = computed<AnalyticsCompositionMode>(() =>
  ui.tab === "GROSS_COMPOSITION" ? ui.grossMode : "SUMMARY",
);
const effectiveGroupBy = computed<AnalyticsCompositionGroupBy>(() => {
  if (ui.tab === "LIABILITY_BREAKDOWN") return ui.liabilityGroup;
  if (ui.tab === "CAPITAL_STRUCTURE") return "PORTFOLIO";
  if (ui.grossMode === "PORTFOLIO") {
    return ui.grossGroup === "ASSET" ? "ASSET" : "ASSET_CLASS";
  }
  return ui.grossGroup;
});
const selectedPortfolioId = computed<number | undefined>(() => {
  if (ui.tab !== "GROSS_COMPOSITION" || ui.grossMode !== "PORTFOLIO") return undefined;
  const parsed = Number(ui.portfolioKey);
  return Number.isFinite(parsed) ? parsed : undefined;
});
const showAssetTopNControls = computed(() => ui.tab === "GROSS_COMPOSITION" && ui.grossGroup === "ASSET");
const showAssetThresholdControls = computed(
  () => ui.tab === "GROSS_COMPOSITION" && ui.grossGroup === "ASSET",
);
const enableStrongSegmentHover = computed(
  () => props.chartKind === "ALLOCATION" && ui.tab === "GROSS_COMPOSITION" && ui.grossGroup === "ASSET",
);
const assetNearThresholdPct = computed(() => Math.max(0, ui.assetThresholdPct - 2));

function ensurePortfolioSelection(): void {
  if (ui.tab !== "GROSS_COMPOSITION" || ui.grossMode !== "PORTFOLIO") return;
  const validKeys = props.portfolioOptions.map((item) => item.key);
  if (validKeys.length === 0) {
    ui.portfolioKey = "";
    return;
  }
  if (!validKeys.includes(ui.portfolioKey)) {
    ui.portfolioKey = validKeys[0] ?? "";
  }
}

async function refreshData(): Promise<void> {
  if (!canLoad.value || !props.scopeType || props.scopeId == null) {
    data.value = null;
    return;
  }
  ensurePortfolioSelection();
  if (ui.tab === "GROSS_COMPOSITION" && ui.grossMode === "PORTFOLIO" && !selectedPortfolioId.value) {
    data.value = null;
    errorMessage.value = props.portfolioOptions.length === 0 ? "No portfolios available for portfolio mode." : "";
    return;
  }
  loading.value = true;
  errorMessage.value = "";
  inspectIndex.value = null;
  try {
    data.value = await getCompositionSeries({
      scope_type: props.scopeType,
      scope_id: props.scopeId,
      display_currency: props.displayCurrency,
      chart_kind: props.chartKind,
      tab: ui.tab,
      mode: effectiveMode.value,
      group_by: effectiveGroupBy.value,
      portfolio_id: selectedPortfolioId.value,
      bucket: ui.bucket,
      limit: 12,
      top_n: effectiveGroupBy.value === "ASSET" ? ui.assetTopN : undefined,
    });
  } catch (error) {
    data.value = null;
    errorMessage.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

const chartPoints = computed(() => data.value?.points ?? []);
const legendItems = computed(() => data.value?.legend ?? []);
const latestPoint = computed<AnalyticsCompositionPointOut | null>(() => {
  if (chartPoints.value.length === 0) return null;
  return chartPoints.value[chartPoints.value.length - 1] ?? null;
});
const inspectedPoint = computed<AnalyticsCompositionPointOut | null>(() => {
  if (inspectIndex.value == null) return latestPoint.value;
  return chartPoints.value[inspectIndex.value] ?? latestPoint.value;
});
const isInspectingHoveredDate = computed(() => inspectIndex.value != null && inspectedPoint.value != null);
const inspectedDatePillLabel = computed(() => {
  if (!inspectedPoint.value) return "-";
  return isInspectingHoveredDate.value ? "Hovering date" : "Latest date";
});
const inspectedDatePillValue = computed(() => {
  if (!inspectedPoint.value) return "-";
  return inspectedPoint.value.snapshot_date || inspectedPoint.value.bucket_label;
});
const chartSummaryDateLabel = computed(() => inspectedPoint.value?.bucket_label ?? "-");
const chartSummaryAmountLabel = computed(() =>
  props.chartKind === "ALLOCATION" ? "Underlying total" : "Total",
);
const chartSummaryAmountText = computed(() =>
  formatCurrency(toNumber(inspectedPoint.value?.total_amount), props.displayCurrency),
);

const collapsedSummary = computed(() => {
  if (!data.value?.has_data || !latestPoint.value) return "Collapsed. Click Expand to preview stacked composition.";
  return `${tabLabel(ui.tab)} · ${latestPoint.value.bucket_label} · ${props.chartKind === "ALLOCATION" ? "100% normalized" : "stacked amount view"}`;
});

function tabLabel(tab: AnalyticsCompositionTab): string {
  if (tab === "CAPITAL_STRUCTURE") return "Capital Structure";
  if (tab === "LIABILITY_BREAKDOWN") return "Liability Breakdown";
  return "Gross Composition";
}

const infoSummary = computed(() => {
  if (props.chartKind === "AMOUNT") {
    return "Tracks how the total amount changed over time and how much each component contributed to that move.";
  }
  return "Normalizes each bar to 100% so you can compare composition changes without total size distorting the view.";
});

const tabHelpTitle = computed(() => {
  if (ui.tab === "CAPITAL_STRUCTURE") return "Capital Structure";
  if (ui.tab === "LIABILITY_BREAKDOWN") return "Liability Breakdown";
  return "Gross Composition";
});

const tabHelpBody = computed(() => {
  if (ui.tab === "CAPITAL_STRUCTURE") {
    if (props.chartKind === "AMOUNT") {
      return "Each bar equals gross assets, split into net assets and liabilities as positive amounts. Use this to see whether debt is taking a larger share of total assets.";
    }
    return "Each bar is normalized to 100% of gross assets. It shows how the net-vs-liabilities mix is changing over time.";
  }
  if (ui.tab === "LIABILITY_BREAKDOWN") {
    if (props.chartKind === "AMOUNT") {
      return "Each bar equals total liabilities, broken down by portfolio or liability type. Use this to see which debt bucket is growing in actual amount.";
    }
    return "Each bar is normalized to 100% of liabilities. It shows where debt concentration is moving without being affected by total liability size.";
  }
  if (props.chartKind === "AMOUNT") {
    return ui.grossGroup === "ASSET"
      ? `Each bar shows the actual amount split across individual assets. Top ${ui.assetTopN} assets stay separate, and the rest are combined into Others.`
      : "Each bar shows the actual amount split across asset classes or portfolios. Use this for growth and contribution analysis, especially when you want to know what really increased in money terms.";
  }
  return ui.grossGroup === "ASSET"
    ? `Each bar is normalized to 100% of gross assets and split by individual assets. Top ${ui.assetTopN} assets stay separate, which makes single-name weight drift and rebalancing checks easier.`
    : "Each bar is normalized to 100% of gross assets. Use this for mix and rebalancing analysis, such as checking whether crypto or cash share is drifting up or down.";
});

const tabHelpFooter = computed(() => {
  if (ui.tab === "GROSS_COMPOSITION" && props.chartKind === "ALLOCATION") {
    return `This is the best view for future allocation rules like 'BTC should stay under ${ui.assetThresholdPct}% of total assets.'`;
  }
  if (ui.tab === "LIABILITY_BREAKDOWN") {
    return "Liabilities are shown as positive stack segments here on purpose so debt composition stays easy to compare.";
  }
  return "DAY, WEEK, and MONTH use snapshot history, with WEEK and MONTH selecting the last snapshot in each bucket.";
});

function bucketLabel(bucket: AnalyticsCompositionBucket): string {
  return bucket;
}

function grossGroupLabel(value: "ASSET_CLASS" | "PORTFOLIO" | "ASSET"): string {
  if (value === "PORTFOLIO") return "Portfolio";
  if (value === "ASSET") return "Asset";
  return "Asset Class";
}

function liabilityGroupLabel(value: "PORTFOLIO" | "LIABILITY_TYPE"): string {
  return value === "LIABILITY_TYPE" ? "Liability Type" : "Portfolio";
}

const inlineHint = computed(() => {
  if (ui.tab === "CAPITAL_STRUCTURE") {
    return "Capital Structure uses Gross as the full bar, with Net + Liabilities = Gross.";
  }
  if (ui.tab === "LIABILITY_BREAKDOWN") {
    return ui.liabilityGroup === "PORTFOLIO"
      ? "Portfolio groups debt by account or institution bucket so you can see where total liabilities are concentrated."
      : "Liability Type groups debt by type so you can compare categories like loan, mortgage, or credit balance.";
  }
  if (ui.grossGroup === "ASSET") {
    return `Asset groups Gross Composition by individual holdings. Top ${ui.assetTopN} assets stay separate and smaller positions are combined into Others.`;
  }
  return "";
});

function hashString(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) >>> 0;
  }
  return hash;
}

const fallbackPalette = [
  "#60a5fa",
  "#34d399",
  "#f59e0b",
  "#a78bfa",
  "#ef4444",
  "#14b8a6",
  "#f472b6",
  "#84cc16",
  "#fb7185",
  "#38bdf8",
];

function colorForToken(token: string): string {
  const normalized = token.toUpperCase();
  if (normalized === "ASSET:OTHERS" || normalized === "OTHERS") return "#64748b";
  if (normalized === "REAL_ESTATE") return "#57c0c7";
  if (normalized === "DEPOSIT_SAVING") return "#a3d16f";
  if (normalized === "STOCK") return "#7aa2e3";
  if (normalized === "CRYPTO") return "#e25d4f";
  if (normalized === "CASH") return "#8b7ce6";
  if (normalized === "BOND") return "#f4bf4f";
  if (normalized === "NET") return "#8b7ce6";
  if (normalized === "LIABILITIES" || normalized.startsWith("LIABILITY_TYPE")) return "#e15263";
  return fallbackPalette[hashString(token) % fallbackPalette.length] ?? "#94a3b8";
}

function setHoveredSegment(key: string | null): void {
  hoveredSegmentKey.value = key;
}

function clearHoveredSegment(): void {
  hoveredSegmentKey.value = null;
}

function normalizeAssetThreshold(value: number | null | undefined): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 10;
  return Math.min(30, Math.max(5, Math.round(parsed)));
}

async function loadAssetThresholdFromSettings(): Promise<void> {
  try {
    const settings = await getMySettings();
    ui.assetThresholdPct = normalizeAssetThreshold(settings.asset_rebalance_threshold_pct);
  } catch {
    // keep local/default value if user settings are unavailable
  }
}

function broadcastAssetThreshold(value: number): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(
    new CustomEvent<number>(USER_REBALANCE_THRESHOLD_EVENT, {
      detail: value,
    }),
  );
}

async function setAssetThreshold(value: number): Promise<void> {
  const normalized = normalizeAssetThreshold(value);
  if (ui.assetThresholdPct === normalized && !thresholdSaveError.value) return;
  ui.assetThresholdPct = normalized;
  thresholdSaving.value = true;
  thresholdSaveError.value = "";
  try {
    await updateMySettings({ asset_rebalance_threshold_pct: normalized });
    broadcastAssetThreshold(normalized);
  } catch (error) {
    thresholdSaveError.value = getErrorMessage(error);
  } finally {
    thresholdSaving.value = false;
  }
}

function handleAssetThresholdBroadcast(event: Event): void {
  const customEvent = event as CustomEvent<number>;
  ui.assetThresholdPct = normalizeAssetThreshold(customEvent.detail);
  thresholdSaveError.value = "";
}

const legendWithColors = computed(() =>
  legendItems.value.map((item) => ({
    ...item,
    color: colorForToken(item.color_token || item.key),
  })),
);

const legendColorByKey = computed(() => {
  const map = new Map<string, string>();
  for (const item of legendWithColors.value) {
    map.set(item.key, item.color);
  }
  return map;
});

const displayedSegments = computed(() =>
  inspectedPoint.value?.segments.map((segment) => ({
    ...segment,
    color: legendColorByKey.value.get(segment.key) ?? "#94a3b8",
  })) ?? [],
);

const capitalStructurePills = computed(() => {
  if (ui.tab !== "CAPITAL_STRUCTURE" || !inspectedPoint.value) return [];
  return displayedSegments.value.map((segment) => ({
    key: segment.key,
    label: segment.label,
    color: segment.color,
    ratioPct: toNumber(segment.ratio_pct),
    amount: toNumber(segment.amount),
  }));
});

const grossCompositionPills = computed(() => {
  if (ui.tab !== "GROSS_COMPOSITION" || !inspectedPoint.value) return [];
  return [...displayedSegments.value]
    .map((segment) => ({
      key: segment.key,
      label: segment.label,
      color: segment.color,
      ratioPct: toNumber(segment.ratio_pct),
      amount: toNumber(segment.amount),
    }))
    .sort((left, right) => right.amount - left.amount)
    .slice(0, 3);
});
const rebalancingDraft = computed(() => {
  if (ui.tab !== "GROSS_COMPOSITION" || ui.grossGroup !== "ASSET" || !inspectedPoint.value) return null;
  const items = displayedSegments.value
    .filter((segment) => segment.key !== "asset:others")
    .map((segment) => ({
      key: segment.key,
      label: segment.label,
      color: segment.color,
      ratioPct: toNumber(segment.ratio_pct),
      amount: toNumber(segment.amount),
      excessPct: Math.max(0, toNumber(segment.ratio_pct) - ui.assetThresholdPct),
    }))
    .sort((left, right) => right.ratioPct - left.ratioPct);
  return {
    thresholdPct: ui.assetThresholdPct,
    nearPct: assetNearThresholdPct.value,
    aboveLimit: items.filter((item) => item.ratioPct > ui.assetThresholdPct).slice(0, 4),
    nearLimit: items
      .filter((item) => item.ratioPct >= assetNearThresholdPct.value && item.ratioPct <= ui.assetThresholdPct)
      .slice(0, 4),
    usingDate: inspectedDatePillValue.value,
    hovered: isInspectingHoveredDate.value,
  };
});

const chartHeight = 280;
const chartPaddingLeft = 54;
const chartPaddingRight = 20;
const chartPaddingTop = 18;
const chartPaddingBottom = 34;
const barWidth = 42;
const barGap = 18;
const hoverBandWidth = barWidth + barGap;

const chartWidth = computed(() => Math.max(760, chartPaddingLeft + chartPaddingRight + chartPoints.value.length * (barWidth + barGap)));
const plotHeight = computed(() => chartHeight - chartPaddingTop - chartPaddingBottom);

const yAxisMax = computed(() => {
  if (props.chartKind === "ALLOCATION") return 100;
  const rows = chartPoints.value.map((point) => toNumber(point.total_amount));
  const maxValue = rows.length > 0 ? Math.max(...rows, 0) : 0;
  if (maxValue <= 0) return 1;
  return maxValue * 1.1;
});

function toX(index: number): number {
  return chartPaddingLeft + index * (barWidth + barGap);
}

function toY(value: number): number {
  const ratio = Math.max(0, Math.min(1, value / yAxisMax.value));
  return chartPaddingTop + plotHeight.value * (1 - ratio);
}

const yTicks = computed(() => {
  const tickValues = props.chartKind === "ALLOCATION" ? [0, 25, 50, 75, 100] : [0, 1, 2, 3, 4].map((step) => (yAxisMax.value / 4) * step);
  return tickValues.map((value) => ({
    value,
    y: toY(value),
  }));
});

const barLayouts = computed(() =>
  chartPoints.value.map((point, index) => {
    let currentY = chartHeight - chartPaddingBottom;
    const rects = point.segments.map((segment) => {
      const rawValue = props.chartKind === "ALLOCATION" ? toNumber(segment.ratio_pct) : toNumber(segment.amount);
      const height = Math.max(0, (rawValue / yAxisMax.value) * plotHeight.value);
      const rect = {
        key: segment.key,
        label: segment.label,
        color: legendColorByKey.value.get(segment.key) ?? "#94a3b8",
        x: toX(index),
        y: currentY - height,
        width: barWidth,
        height,
        amount: toNumber(segment.amount),
        ratioPct: toNumber(segment.ratio_pct),
      };
      currentY -= height;
      return rect;
    });
    return {
      point,
      x: toX(index),
      hoverX: toX(index) - barGap / 2,
      hoverWidth: hoverBandWidth,
      rects,
    };
  }),
);

function resolveHoveredSegmentKeyFromBand(
  event: MouseEvent,
  rects: Array<{ key: string; y: number; height: number }>,
): string | null {
  if (!enableStrongSegmentHover.value) return null;
  const currentTarget = event.currentTarget;
  if (!(currentTarget instanceof SVGRectElement)) return null;
  const bounds = currentTarget.getBoundingClientRect();
  if (bounds.height <= 0) return null;
  const relativeY = Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height));
  const svgY = chartPaddingTop + relativeY * plotHeight.value;
  const matched = rects.find((rect) => rect.height > 0 && svgY >= rect.y && svgY <= rect.y + rect.height);
  return matched?.key ?? null;
}

function handleBandHover(
  event: MouseEvent,
  index: number,
  rects: Array<{ key: string; y: number; height: number }>,
): void {
  inspectIndex.value = index;
  hoveredSegmentKey.value = resolveHoveredSegmentKeyFromBand(event, rects);
}

function clearBandHover(): void {
  inspectIndex.value = null;
  hoveredSegmentKey.value = null;
}

function segmentOpacity(segmentKey: string, index: number): number {
  if (enableStrongSegmentHover.value && hoveredSegmentKey.value) {
    return hoveredSegmentKey.value === segmentKey ? 1 : 0.22;
  }
  return inspectIndex.value == null || inspectIndex.value === index ? 1 : 0.6;
}

function segmentStroke(segmentKey: string): string {
  if (enableStrongSegmentHover.value && hoveredSegmentKey.value === segmentKey) {
    return "rgba(255,255,255,0.92)";
  }
  return "transparent";
}

function segmentStrokeWidth(segmentKey: string): number {
  return enableStrongSegmentHover.value && hoveredSegmentKey.value === segmentKey ? 1.5 : 0;
}

function segmentHighlightClasses(segmentKey: string): string {
  if (!enableStrongSegmentHover.value || !hoveredSegmentKey.value) return "";
  return hoveredSegmentKey.value === segmentKey
    ? "border-indigo-400/60 ring-2 ring-indigo-400/45"
    : "opacity-60";
}

watch(
  () => ({ ...ui }),
  () => {
    saveUiState();
  },
  { deep: true },
);

watch(
  () => [props.scopeType, props.scopeId, props.displayCurrency, props.portfolioOptions, ui.tab, ui.bucket, ui.grossMode, ui.grossGroup, ui.assetTopN, ui.liabilityGroup, ui.portfolioKey] as const,
  () => {
    void refreshData();
  },
  { deep: true },
);

watch(
  () => [ui.tab, ui.grossMode] as const,
  () => {
    if (ui.grossMode === "PORTFOLIO" && ui.grossGroup === "PORTFOLIO") {
      ui.grossGroup = "ASSET_CLASS";
    }
    ensurePortfolioSelection();
  },
);

watch(
  enableStrongSegmentHover,
  (enabled) => {
    if (!enabled) {
      hoveredSegmentKey.value = null;
    }
  },
);

onMounted(() => {
  loadUiState();
  ensurePortfolioSelection();
  void loadAssetThresholdFromSettings();
  if (typeof window !== "undefined") {
    window.addEventListener(USER_REBALANCE_THRESHOLD_EVENT, handleAssetThresholdBroadcast as EventListener);
  }
  void refreshData();
});

onBeforeUnmount(() => {
  if (typeof window !== "undefined") {
    window.removeEventListener(USER_REBALANCE_THRESHOLD_EVENT, handleAssetThresholdBroadcast as EventListener);
  }
});
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <div class="flex flex-wrap items-center gap-2">
          <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :aria-expanded="infoOpen"
            :aria-label="`${title} info`"
            @click="infoOpen = !infoOpen"
          >
            i
          </button>
        </div>
        <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ description }}</p>
      </div>
      <button
        type="button"
        class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
        @click="ui.expanded = !ui.expanded"
      >
        {{ ui.expanded ? "Collapse" : "Expand" }}
      </button>
    </div>

    <div
      v-if="infoOpen"
      class="mt-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 shadow-sm dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
    >
      <p class="font-semibold text-slate-700 dark:text-slate-100">{{ infoSummary }}</p>
      <p class="mt-2 [overflow-wrap:anywhere]">
        <span class="font-semibold text-slate-700 dark:text-slate-100">{{ tabHelpTitle }}:</span>
        {{ tabHelpBody }}
      </p>
      <p class="mt-2 [overflow-wrap:anywhere]">{{ tabHelpFooter }}</p>
    </div>

    <div v-if="!ui.expanded" class="mt-3 space-y-1">
      <p class="text-xs text-slate-500 dark:text-slate-400">Collapsed. Click Expand to preview stacked composition.</p>
      <p class="text-sm font-medium text-slate-700 dark:text-slate-200">{{ collapsedSummary }}</p>
    </div>

    <div v-else class="mt-4 space-y-4">
      <div class="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-for="option in TAB_OPTIONS"
            :key="`${storageKeyPrefix}-tab-${option}`"
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors"
            :class="ui.tab === option ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="ui.tab = option"
          >
            {{ tabLabel(option) }}
          </button>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2">
          <div class="flex flex-wrap items-center gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Bucket</span>
            <button
              v-for="option in BUCKET_OPTIONS"
              :key="`${storageKeyPrefix}-bucket-${option}`"
              type="button"
              class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
              :class="ui.bucket === option ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
              @click="ui.bucket = option"
            >
              {{ bucketLabel(option) }}
            </button>
          </div>

	          <template v-if="ui.tab === 'GROSS_COMPOSITION'">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Mode</span>
              <button
                type="button"
                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                :class="ui.grossMode === 'SUMMARY' ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="ui.grossMode = 'SUMMARY'"
              >
                Summary
              </button>
              <button
                type="button"
                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                :class="ui.grossMode === 'PORTFOLIO' ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="ui.grossMode = 'PORTFOLIO'"
              >
                Portfolio
              </button>
            </div>

            <div v-if="ui.grossMode === 'SUMMARY'" class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Group</span>
              <button
                v-for="option in SUMMARY_GROSS_GROUP_OPTIONS"
                :key="`${storageKeyPrefix}-gross-group-${option}`"
                type="button"
                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                :class="ui.grossGroup === option ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="ui.grossGroup = option"
              >
                {{ grossGroupLabel(option) }}
              </button>
            </div>

	            <div v-else class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Portfolio</span>
              <select
                v-model="ui.portfolioKey"
                class="min-w-[12rem] rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option v-for="item in portfolioOptions" :key="`${storageKeyPrefix}-portfolio-${item.key}`" :value="item.key">
                  {{ item.label }}
                </option>
              </select>
              <div class="flex flex-wrap items-center gap-2">
                <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Group</span>
                <button
                  v-for="option in PORTFOLIO_GROSS_GROUP_OPTIONS"
                  :key="`${storageKeyPrefix}-gross-portfolio-group-${option}`"
                  type="button"
                  class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                  :class="ui.grossGroup === option ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                  @click="ui.grossGroup = option"
                >
                  {{ grossGroupLabel(option) }}
                </button>
	              </div>
	            </div>

	            <div v-if="showAssetTopNControls" class="flex flex-wrap items-center gap-2">
	              <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Top N</span>
	              <button
	                v-for="option in ASSET_TOP_N_OPTIONS"
	                :key="`${storageKeyPrefix}-asset-top-n-${option}`"
	                type="button"
	                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
	                :class="ui.assetTopN === option ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
	                @click="ui.assetTopN = option"
	              >
	                {{ option }}
	              </button>
	            </div>

	            <div v-if="showAssetThresholdControls" class="flex flex-wrap items-center gap-2">
	              <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Rule %</span>
	              <button
	                v-for="option in ASSET_THRESHOLD_OPTIONS"
	                :key="`${storageKeyPrefix}-asset-threshold-${option}`"
	                type="button"
	                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
	                :class="ui.assetThresholdPct === option ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
	                :disabled="thresholdSaving"
	                @click="void setAssetThreshold(option)"
	              >
	                {{ option }}%
	              </button>
	              <span v-if="thresholdSaving" class="text-[11px] text-slate-500 dark:text-slate-400">Saving...</span>
	            </div>
	          </template>

          <template v-else-if="ui.tab === 'LIABILITY_BREAKDOWN'">
            <div class="flex flex-wrap items-center gap-2">
              <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Group</span>
              <button
                v-for="option in LIABILITY_GROUP_OPTIONS"
                :key="`${storageKeyPrefix}-liability-group-${option}`"
                type="button"
                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold transition-colors"
                :class="ui.liabilityGroup === option ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="ui.liabilityGroup = option"
              >
                {{ liabilityGroupLabel(option) }}
              </button>
            </div>
          </template>

          <p
            v-if="inlineHint"
            class="mt-3 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400"
          >
            {{ inlineHint }}
          </p>
        </div>
      </div>

      <div v-if="loading" class="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        Loading composition history...
      </div>
      <div v-else-if="errorMessage" class="rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100">
        {{ errorMessage }}
      </div>
      <div v-else-if="!canLoad" class="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        Waiting for Home scope...
      </div>
      <div v-else-if="!data?.has_data" class="rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
        No valuation snapshot history yet.
      </div>
      <div v-else class="space-y-4">
        <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70">
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p class="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">{{ tabLabel(ui.tab) }}</p>
              <p class="mt-2 text-sm text-slate-700 dark:text-slate-200">
                <span>{{ chartSummaryDateLabel }}</span>
                <span class="text-slate-400 dark:text-slate-500"> · </span>
                <span>{{ chartSummaryAmountLabel }}</span>
                <span class="ml-1" :style="amountMaskStyle()">{{ chartSummaryAmountText }}</span>
              </p>
              <div v-if="inspectedPoint" class="mt-3 flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[11px] font-medium"
                  :class="
                    isInspectingHoveredDate
                      ? 'border-indigo-400/50 bg-indigo-500/15 text-indigo-200'
                      : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300'
                  "
                >
                  <span class="uppercase tracking-[0.16em]">{{ inspectedDatePillLabel }}</span>
                  <span class="font-semibold">{{ inspectedDatePillValue }}</span>
                </span>
              </div>
	              <div v-if="grossCompositionPills.length > 0" class="mt-3 flex flex-wrap items-center gap-2">
	                <span class="text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500 dark:text-slate-400">Top now</span>
	                <span
	                  v-for="item in grossCompositionPills"
                  :key="`${storageKeyPrefix}-gross-pill-${item.key}`"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: item.color }" />
                  <span class="font-medium">{{ item.label }}</span>
                  <span class="text-slate-500 dark:text-slate-400">{{ formatPercent(item.ratioPct) }}</span>
                  <span class="text-slate-400 dark:text-slate-500">·</span>
                  <span class="text-slate-500 dark:text-slate-400" :style="amountMaskStyle()">
	                    {{ formatCurrency(item.amount, displayCurrency) }}
	                  </span>
	                </span>
	              </div>
	              <div
	                v-if="rebalancingDraft"
	                class="mt-3 rounded-xl border border-amber-500/20 bg-amber-500/10 px-3 py-3 text-xs text-slate-700 dark:text-slate-200"
	              >
	                <div class="flex flex-wrap items-center gap-2">
	                  <span class="rounded-full border border-amber-400/40 bg-amber-500/10 px-2 py-1 font-semibold text-amber-200">
	                    Draft rebalancing rule
	                  </span>
	                  <span class="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
	                    Single asset &gt; {{ rebalancingDraft.thresholdPct.toFixed(0) }}%
	                  </span>
	                  <span class="rounded-full border border-slate-200 bg-white px-2 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">
	                    {{ rebalancingDraft.hovered ? "Using hovered date" : "Using latest date" }} {{ rebalancingDraft.usingDate }}
	                  </span>
	                </div>
	                <p class="mt-2 text-slate-600 dark:text-slate-300">
	                  Flag single assets above {{ rebalancingDraft.thresholdPct.toFixed(0) }}% of gross assets. Assets between
	                  {{ rebalancingDraft.nearPct.toFixed(0) }}% and {{ rebalancingDraft.thresholdPct.toFixed(0) }}% are near the draft limit.
	                </p>
	                <div
	                  v-if="rebalancingDraft.aboveLimit.length > 0"
	                  class="mt-3 rounded-xl border border-rose-500/35 bg-rose-500/10 px-3 py-3 text-rose-100"
	                >
	                  <p class="font-semibold">
	                    Warning: {{ rebalancingDraft.aboveLimit.length }}
	                    {{ rebalancingDraft.aboveLimit.length === 1 ? "asset exceeds" : "assets exceed" }}
	                    your {{ rebalancingDraft.thresholdPct.toFixed(0) }}% rule.
	                  </p>
	                  <p class="mt-1 text-rose-100/90">
	                    Gross Composition > Asset is currently flagging concentrated positions that may need a rebalance review.
	                  </p>
	                </div>
	                <div
	                  v-else-if="rebalancingDraft.nearLimit.length > 0"
	                  class="mt-3 rounded-xl border border-amber-400/35 bg-amber-500/10 px-3 py-3 text-amber-100"
	                >
	                  <p class="font-semibold">
	                    Heads up: {{ rebalancingDraft.nearLimit.length }}
	                    {{ rebalancingDraft.nearLimit.length === 1 ? "asset is" : "assets are" }}
	                    near your {{ rebalancingDraft.thresholdPct.toFixed(0) }}% rule.
	                  </p>
	                  <p class="mt-1 text-amber-100/90">
	                    These positions are not above the threshold yet, but they are close enough to watch during future rebalancing.
	                  </p>
	                </div>
	                <div class="mt-3 flex flex-wrap gap-2">
	                  <template v-if="rebalancingDraft.aboveLimit.length > 0 || rebalancingDraft.nearLimit.length > 0">
	                    <button
	                      v-for="item in rebalancingDraft.aboveLimit"
	                      :key="`${storageKeyPrefix}-rebalance-over-${item.key}`"
	                      type="button"
	                      class="inline-flex items-center gap-2 rounded-full border border-rose-400/40 bg-rose-500/10 px-3 py-1 text-left text-rose-100 transition-colors"
	                      :class="segmentHighlightClasses(item.key)"
	                      @mouseenter="setHoveredSegment(item.key)"
	                      @mouseleave="clearHoveredSegment()"
	                      @focus="setHoveredSegment(item.key)"
	                      @blur="clearHoveredSegment()"
	                    >
	                      <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: item.color }" />
	                      <span class="font-semibold">{{ item.label }}</span>
	                      <span>{{ formatPercent(item.ratioPct) }}</span>
	                      <span class="text-rose-200">+{{ item.excessPct.toFixed(1) }}%p</span>
	                    </button>
	                    <button
	                      v-for="item in rebalancingDraft.nearLimit"
	                      :key="`${storageKeyPrefix}-rebalance-near-${item.key}`"
	                      type="button"
	                      class="inline-flex items-center gap-2 rounded-full border border-amber-400/40 bg-amber-500/10 px-3 py-1 text-left text-amber-100 transition-colors"
	                      :class="segmentHighlightClasses(item.key)"
	                      @mouseenter="setHoveredSegment(item.key)"
	                      @mouseleave="clearHoveredSegment()"
	                      @focus="setHoveredSegment(item.key)"
	                      @blur="clearHoveredSegment()"
	                    >
	                      <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: item.color }" />
	                      <span class="font-semibold">{{ item.label }}</span>
	                      <span>{{ formatPercent(item.ratioPct) }}</span>
	                      <span class="text-amber-200">near limit</span>
	                    </button>
	                  </template>
	                  <span
	                    v-else
	                    class="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-slate-600 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300"
	                  >
	                    No asset currently exceeds the draft {{ rebalancingDraft.thresholdPct.toFixed(0) }}% threshold.
	                  </span>
	                </div>
	                <p v-if="thresholdSaveError" class="mt-3 text-rose-200">
	                  Failed to save your threshold setting: {{ thresholdSaveError }}
	                </p>
	              </div>
	              <div v-if="capitalStructurePills.length > 0" class="mt-3 flex flex-wrap items-center gap-2">
	                <span
	                  v-for="item in capitalStructurePills"
                  :key="`${storageKeyPrefix}-capital-pill-${item.key}`"
                  class="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                >
                  <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: item.color }" />
                  <span class="font-medium">{{ item.label }}</span>
                  <span class="text-slate-500 dark:text-slate-400">{{ formatPercent(item.ratioPct) }}</span>
                  <span class="text-slate-400 dark:text-slate-500">·</span>
                  <span class="text-slate-500 dark:text-slate-400" :style="amountMaskStyle()">
                    {{ formatCurrency(item.amount, displayCurrency) }}
                  </span>
                </span>
              </div>
            </div>
            <span class="rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-700 dark:text-slate-300">
              as_of {{ formatDateTime(data?.as_of) }}
            </span>
          </div>

          <div class="mt-4 overflow-x-auto pb-2">
            <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" :width="chartWidth" :height="chartHeight" class="min-w-full">
              <g>
                <line
                  v-for="tick in yTicks"
                  :key="`${storageKeyPrefix}-grid-${tick.value}`"
                  :x1="chartPaddingLeft"
                  :x2="chartWidth - chartPaddingRight"
                  :y1="tick.y"
                  :y2="tick.y"
                  stroke="rgba(148,163,184,0.18)"
                  stroke-width="1"
                />
              </g>

              <g :style="chartKind === 'AMOUNT' ? amountMaskStyle() : undefined">
                <text
                  v-for="tick in yTicks"
                  :key="`${storageKeyPrefix}-tick-${tick.value}`"
                  :x="chartPaddingLeft - 10"
                  :y="tick.y + 4"
                  text-anchor="end"
                  fill="#94a3b8"
                  font-size="11"
                >
                  {{ chartKind === "ALLOCATION" ? formatPercent(tick.value) : formatCompactAmount(tick.value) }}
                </text>
              </g>

	              <g v-for="(bar, index) in barLayouts" :key="`${storageKeyPrefix}-bar-${bar.point.snapshot_date}`">
	                <rect
	                  v-if="inspectIndex === index"
	                  :x="bar.x - 8"
	                  :y="chartPaddingTop - 6"
	                  :width="barWidth + 16"
	                  :height="plotHeight + 12"
	                  rx="10"
	                  fill="rgba(129, 140, 248, 0.12)"
	                  stroke="rgba(129, 140, 248, 0.35)"
	                  stroke-width="1"
                    pointer-events="none"
	                />
	                <rect
	                  v-for="segment in bar.rects"
	                  :key="`${storageKeyPrefix}-segment-${bar.point.snapshot_date}-${segment.key}`"
	                  :x="segment.x"
	                  :y="segment.y"
	                  :width="segment.width"
	                  :height="segment.height"
	                  :fill="segment.color"
	                  :stroke="segmentStroke(segment.key)"
	                  :stroke-width="segmentStrokeWidth(segment.key)"
	                  rx="4"
	                  :opacity="segmentOpacity(segment.key, index)"
	                  pointer-events="none"
	                />
		                <rect
		                  :x="bar.hoverX"
		                  :y="chartPaddingTop"
	                  :width="bar.hoverWidth"
	                  :height="plotHeight"
	                  fill="transparent"
	                  @mouseenter="handleBandHover($event, index, bar.rects)"
	                  @mousemove="handleBandHover($event, index, bar.rects)"
	                  @mouseleave="clearBandHover()"
	                  @click="inspectIndex = index"
	                  @touchstart.passive="inspectIndex = index"
	                />
	                <text
	                  :x="bar.x + barWidth / 2"
	                  :y="chartHeight - 10"
	                  text-anchor="middle"
	                  :fill="inspectIndex === index ? '#c4b5fd' : '#94a3b8'"
	                  :font-size="inspectIndex === index ? 12 : 11"
	                  :font-weight="inspectIndex === index ? 700 : 500"
	                >
	                  {{ bar.point.bucket_label }}
	                </text>
	              </g>
            </svg>
          </div>

	          <div class="mt-4 flex flex-wrap gap-2">
	            <span
	              v-for="item in legendWithColors"
	              :key="`${storageKeyPrefix}-legend-${item.key}`"
	              class="inline-flex max-w-full items-start gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 transition-colors dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
	              :class="segmentHighlightClasses(item.key)"
	              :title="item.label"
	              @mouseenter="setHoveredSegment(item.key)"
	              @mouseleave="clearHoveredSegment()"
	            >
	              <span class="mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: item.color }" />
	              <span class="name-clamp-2 max-w-[11rem] leading-4">{{ item.label }}</span>
	            </span>
	          </div>

          <div v-if="displayedSegments.length > 0" class="mt-4 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
	            <div
	              v-for="segment in displayedSegments"
	              :key="`${storageKeyPrefix}-inspect-${segment.key}`"
	              class="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm transition-colors dark:border-slate-700 dark:bg-slate-900"
	              :class="segmentHighlightClasses(segment.key)"
	              @mouseenter="setHoveredSegment(segment.key)"
	              @mouseleave="clearHoveredSegment()"
	            >
              <div class="flex items-start gap-2">
                <span class="mt-1 h-2.5 w-2.5 shrink-0 rounded-full" :style="{ backgroundColor: segment.color }" />
                <span
                  class="name-clamp-2 min-w-0 flex-1 font-medium leading-5 text-slate-800 dark:text-slate-100"
                  :title="segment.label"
                >
                  {{ segment.label }}
                </span>
              </div>
              <p class="mt-1 text-slate-600 dark:text-slate-300">
                <span :style="chartKind === 'AMOUNT' ? amountMaskStyle() : undefined">
                  {{ chartKind === "AMOUNT" ? formatCurrency(toNumber(segment.amount), displayCurrency) : formatPercent(toNumber(segment.ratio_pct)) }}
                </span>
                <span v-if="chartKind === 'AMOUNT'" class="text-xs text-slate-500 dark:text-slate-400">
                  · {{ formatPercent(toNumber(segment.ratio_pct)) }}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>

