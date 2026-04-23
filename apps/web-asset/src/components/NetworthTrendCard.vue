<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";

type NetworthPoint = {
  label: string;
  gross: number;
  liabilities: number;
  net: number;
};

type NetworthSeriesLinePoint = {
  snapshot_date: string;
  value: number;
};

type NetworthSeriesLine = {
  key: string;
  label: string;
  points: NetworthSeriesLinePoint[];
};

type PortfolioOption = {
  key: string;
  label: string;
};

type TrendMode = "SUMMARY" | "PORTFOLIO" | "ASSET";
type PortfolioMetric = "CURRENT_VALUE" | "CURRENT_NET" | "PROFIT" | "RETURN";
type AssetMetric = "CURRENT_VALUE" | "PROFIT" | "RETURN";
type NetworthTrendRange = "1M" | "3M" | "6M" | "1Y";
type NetworthTrendBucket = "DAY" | "WEEK" | "MONTH";
type ZoomLevel = -2 | -1 | 0 | 1 | 2;

type AssetMover = {
  key: string;
  label: string;
  current_value: number;
  baseline_value: number;
  delta_value: number;
  current_profit: number;
  baseline_profit: number;
  delta_profit: number;
  current_return_pct: number | null;
  baseline_return_pct: number | null;
  delta_return_pct: number | null;
  current_cost_basis: number;
  baseline_cost_basis: number;
  delta_cost_basis: number;
  status: "NEW" | "REMOVED" | null;
};

type AssetMovers = {
  top_gainers: AssetMover[];
  top_losers: AssetMover[];
};

type PortfolioMoverBasis = "GROSS" | "NET" | "LIABILITIES";

type PortfolioMover = {
  portfolio_id: number | null;
  portfolio_name: string;
  portfolio_type: string | null;
  current_value: number;
  baseline_value: number;
  delta_value: number;
  current_net: number;
  baseline_net: number;
  delta_net: number;
  current_liabilities: number;
  baseline_liabilities: number;
  delta_liabilities: number;
  current_invested: number;
  baseline_invested: number;
  delta_invested: number;
  current_profit: number;
  baseline_profit: number;
  delta_profit: number;
  current_return_pct: number | null;
  baseline_return_pct: number | null;
  delta_return_pct: number | null;
  driver_type: "CAPITAL_LED" | "PERFORMANCE_LED" | "WITHDRAWAL_LED" | "LIABILITY_LED" | "MIXED" | "NEUTRAL";
  status: "NEW" | "REMOVED" | null;
};

type PortfolioMovers = {
  top_gainers: PortfolioMover[];
  top_losers: PortfolioMover[];
};

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    currency: string;
    points: NetworthPoint[];
    maskAmounts?: boolean;
    loading?: boolean;
    error?: string;
    showGross?: boolean;
    showLiabilities?: boolean;
    showNet?: boolean;
    showVisibilityControls?: boolean;
    mode?: TrendMode;
    portfolioMetric?: PortfolioMetric;
    assetMetric?: AssetMetric;
    showModeToggle?: boolean;
    portfolioLines?: NetworthSeriesLine[];
    assetLines?: NetworthSeriesLine[];
    portfolioOptions?: PortfolioOption[];
    assetOptions?: PortfolioOption[];
    portfolioKey?: string;
    assetKey?: string;
    portfolioMovers?: PortfolioMovers | null;
    portfolioMoverBasis?: PortfolioMoverBasis;
    assetMovers?: AssetMovers | null;
    showPortfolioSelector?: boolean;
    storageKey?: string;
    range?: NetworthTrendRange;
    bucket?: NetworthTrendBucket;
    rangeStartDate?: string | null;
    rangeEndDate?: string | null;
    showRangeBucketControls?: boolean;
    showRefreshControl?: boolean;
  }>(),
  {
    title: "Networth Trend",
    subtitle: "valuation_snapshots",
    maskAmounts: false,
    loading: false,
    error: "",
    showGross: true,
    showLiabilities: true,
    showNet: true,
    showVisibilityControls: true,
    mode: "SUMMARY",
    portfolioMetric: "RETURN",
    assetMetric: "CURRENT_VALUE",
    showModeToggle: true,
    portfolioLines: () => [],
    assetLines: () => [],
    portfolioOptions: () => [],
    assetOptions: () => [],
    portfolioKey: "ALL",
    assetKey: "TOP_MOVERS",
    portfolioMovers: null,
    portfolioMoverBasis: "GROSS",
    assetMovers: null,
    showPortfolioSelector: true,
    storageKey: "",
    range: "3M",
    bucket: "DAY",
    rangeStartDate: null,
    rangeEndDate: null,
    showRangeBucketControls: true,
    showRefreshControl: false,
  },
);

const emit = defineEmits<{
  (e: "update:showGross", value: boolean): void;
  (e: "update:showLiabilities", value: boolean): void;
  (e: "update:showNet", value: boolean): void;
  (e: "update:mode", value: TrendMode): void;
  (e: "update:portfolioMetric", value: PortfolioMetric): void;
  (e: "update:assetMetric", value: AssetMetric): void;
  (e: "update:portfolioKey", value: string): void;
  (e: "update:assetKey", value: string): void;
  (e: "update:range", value: NetworthTrendRange): void;
  (e: "update:bucket", value: NetworthTrendBucket): void;
  (e: "refresh"): void;
}>();

type RenderLine = {
  key: string;
  label: string;
  color: string;
  values: Array<number | null>;
};

const chartHeight = 320;
const plotPaddingX = 52;
const chartPaddingY = 62;
const minPlotWidth = 560;
const inspectText = ref("");
const expanded = ref(true);
const infoOpen = ref(false);
const plotScrollRef = ref<HTMLDivElement | null>(null);
const plotViewportWidth = ref(0);
const viewportStartIndex = ref(0);
const viewportEndIndex = ref(0);
const zoomLevel = ref<ZoomLevel>(0);
let plotResizeObserver: ResizeObserver | null = null;

const zoomMultipliers: Record<ZoomLevel, number> = {
  [-2]: 0.65,
  [-1]: 0.82,
  [0]: 1,
  [1]: 1.25,
  [2]: 1.55,
};

const rangeOptions: Array<{ key: NetworthTrendRange; label: string }> = [
  { key: "1M", label: "1M" },
  { key: "3M", label: "3M" },
  { key: "6M", label: "6M" },
  { key: "1Y", label: "1Y" },
];

const bucketOptions: Array<{ key: NetworthTrendBucket; label: string }> = [
  { key: "DAY", label: "Day" },
  { key: "WEEK", label: "Week" },
  { key: "MONTH", label: "Month" },
];

function loadExpandedState(): void {
  if (typeof window === "undefined" || !props.storageKey) return;
  const raw = window.localStorage.getItem(props.storageKey);
  if (raw === "1") expanded.value = true;
  if (raw === "0") expanded.value = false;
}

const showGrossModel = computed({
  get: () => props.showGross,
  set: (value: boolean) => emit("update:showGross", value),
});

const showLiabilitiesModel = computed({
  get: () => props.showLiabilities,
  set: (value: boolean) => emit("update:showLiabilities", value),
});

const showNetModel = computed({
  get: () => props.showNet,
  set: (value: boolean) => emit("update:showNet", value),
});

const modeModel = computed({
  get: () => props.mode,
  set: (value: TrendMode) => emit("update:mode", value),
});

const portfolioMetricModel = computed({
  get: () => props.portfolioMetric,
  set: (value: PortfolioMetric) => emit("update:portfolioMetric", value),
});

const assetMetricModel = computed({
  get: () => props.assetMetric,
  set: (value: AssetMetric) => emit("update:assetMetric", value),
});

const portfolioKeyModel = computed({
  get: () => props.portfolioKey,
  set: (value: string) => emit("update:portfolioKey", value),
});

const assetKeyModel = computed({
  get: () => props.assetKey,
  set: (value: string) => emit("update:assetKey", value),
});

const rangeModel = computed({
  get: () => props.range,
  set: (value: NetworthTrendRange) => emit("update:range", value),
});

const bucketModel = computed({
  get: () => props.bucket,
  set: (value: NetworthTrendBucket) => emit("update:bucket", value),
});

const portfolioPalette = [
  "#a78bfa",
  "#22c55e",
  "#0ea5e9",
  "#f59e0b",
  "#ef4444",
  "#14b8a6",
  "#8b5cf6",
  "#eab308",
  "#f97316",
  "#94a3b8",
];

const isAmountAxis = computed(
  () =>
    props.mode === "SUMMARY" ||
    (props.mode === "PORTFOLIO" && props.portfolioMetric !== "RETURN") ||
    (props.mode === "ASSET" && props.assetMetric !== "RETURN"),
);

const summaryPointByLabel = computed(() => new Map(props.points.map((point) => [point.label, point])));

const chartLabels = computed(() => {
  const allLabels = props.points.map((point) => point.label);
  if (props.mode === "SUMMARY") return allLabels;

  const dataLabels = new Set<string>();
  const lines = props.mode === "ASSET" ? props.assetLines : props.portfolioLines;
  for (const line of lines) {
    for (const point of line.points) {
      if (point.value != null && Number.isFinite(point.value)) {
        dataLabels.add(point.snapshot_date);
      }
    }
  }

  const labelsWithData = allLabels.filter((label) => dataLabels.has(label));
  if (labelsWithData.length > 0) return labelsWithData;

  return Array.from(dataLabels).sort();
});

function clampNumber(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function currentPlotViewportWidth(): number {
  return Math.max(1, plotViewportWidth.value || minPlotWidth);
}

const svgWidthStyle = computed(() => (plotViewportWidth.value > 0 ? `${plotWidth.value}px` : "100%"));

const defaultVisiblePointSlots = computed(() => {
  const viewportWidth = currentPlotViewportWidth();
  const compact = viewportWidth < 760;

  if (compact) {
    if (props.bucket === "DAY") return props.range === "1M" ? 18 : 22;
    if (props.bucket === "WEEK") return 16;
    return 10;
  }

  const usable = Math.max(1, viewportWidth - plotPaddingX * 2);
  if (props.bucket === "DAY") return clampNumber(Math.floor(usable / 28) + 1, 24, 90);
  if (props.bucket === "WEEK") return clampNumber(Math.floor(usable / 52) + 1, 14, 40);
  return clampNumber(Math.floor(usable / 76) + 1, 8, 24);
});

const basePointGap = computed(() => {
  const slots = Math.max(2, defaultVisiblePointSlots.value);
  const usable = Math.max(1, currentPlotViewportWidth() - plotPaddingX * 2);
  return Math.max(1, usable / Math.max(1, slots - 1));
});

const pointGap = computed(() => Math.max(4, basePointGap.value * zoomMultipliers[zoomLevel.value]));

const pointRadius = computed(() => {
  const total = chartLabels.value.length;
  if (props.bucket === "DAY" && total >= 90) return 2.4;
  if (props.bucket === "DAY" && total >= 55) return 2.8;
  return 3.5;
});

const plotWidth = computed(() => {
  const total = Math.max(chartLabels.value.length, 2);
  const viewportWidth = currentPlotViewportWidth();
  return Math.max(viewportWidth, plotPaddingX * 2 + (total - 1) * pointGap.value);
});

const renderLines = computed<RenderLine[]>(() => {
  if (props.mode === "PORTFOLIO" || props.mode === "ASSET") {
    const labels = chartLabels.value;
    const lines = props.mode === "ASSET" ? props.assetLines : props.portfolioLines;
    return lines.map((line, index) => {
      const valueByLabel = new Map<string, number>();
      for (const point of line.points) {
        valueByLabel.set(point.snapshot_date, point.value);
      }
      return {
        key: line.key,
        label: line.label,
        color: portfolioPalette[index % portfolioPalette.length] ?? "#94a3b8",
        values: labels.map((label) => valueByLabel.get(label) ?? null),
      };
    });
  }

  const lines: RenderLine[] = [];
  const labels = chartLabels.value;
  const pointByLabel = summaryPointByLabel.value;
  if (props.showGross) {
    lines.push({
      key: "gross",
      label: "Gross",
      color: "#22c55e",
      values: labels.map((label) => pointByLabel.get(label)?.gross ?? null),
    });
  }
  if (props.showLiabilities) {
    lines.push({
      key: "liabilities",
      label: "Liabilities",
      color: "#ef4444",
      values: labels.map((label) => pointByLabel.get(label)?.liabilities ?? null),
    });
  }
  if (props.showNet) {
    lines.push({
      key: "net",
      label: "Net",
      color: "#0ea5e9",
      values: labels.map((label) => pointByLabel.get(label)?.net ?? null),
    });
  }
  return lines;
});

const visibleIndexBounds = computed(() => {
  const total = chartLabels.value.length;
  if (total <= 0) return { start: 0, end: 0 };
  if (viewportEndIndex.value <= viewportStartIndex.value && total > 1) {
    return { start: 0, end: total - 1 };
  }
  const start = Math.max(0, Math.min(viewportStartIndex.value, total - 1));
  const end = Math.max(start, Math.min(viewportEndIndex.value, total - 1));
  return { start, end };
});

const scaledValues = computed<[number, number]>(() => {
  const bounds = visibleIndexBounds.value;
  const rows = renderLines.value.flatMap((line) =>
    line.values
      .slice(bounds.start, bounds.end + 1)
      .filter((value): value is number => value != null && Number.isFinite(value)),
  );
  if (rows.length === 0) return [0, 1];
  const min = Math.min(...rows);
  const max = Math.max(...rows);
  if (min === max) {
    const padding = Math.max(Math.abs(min) * 0.1, isAmountAxis.value ? 1_000 : 1);
    return [min - padding, max + padding];
  }
  const padding = Math.max((max - min) * 0.1, isAmountAxis.value ? 1_000 : 0.5);
  return [min - padding, max + padding];
});

const firstPoint = computed(() => {
  const firstLabel = chartLabels.value[0];
  if (firstLabel) return summaryPointByLabel.value.get(firstLabel) ?? null;
  return props.points.length > 0 ? props.points[0] : null;
});
const lastPoint = computed(() => {
  const lastLabel = chartLabels.value[chartLabels.value.length - 1];
  if (lastLabel) return summaryPointByLabel.value.get(lastLabel) ?? null;
  return props.points.length > 0 ? props.points[props.points.length - 1] : null;
});

const collapsedSummary = computed(() => {
  if (props.mode === "PORTFOLIO" || props.mode === "ASSET") {
    const metricLabel =
      props.mode === "ASSET"
        ? props.assetMetric === "CURRENT_VALUE"
          ? "Current Value"
          : props.assetMetric === "PROFIT"
            ? "Profit"
            : "Return"
        : props.portfolioMetric === "CURRENT_VALUE"
        ? "Current Value"
        : props.portfolioMetric === "CURRENT_NET"
          ? "Current Net"
          : props.portfolioMetric === "PROFIT"
            ? "Profit"
            : "Return";
    return `${props.mode === "ASSET" ? "Asset" : "Portfolio"} trend - ${metricLabel} - ${lastPoint.value?.label ?? "-"}`;
  }
  if (!lastPoint.value) return "No trend data.";
  return `Latest snapshot - Gross ${formatCurrency(lastPoint.value.gross, props.currency)} - Net ${formatCurrency(lastPoint.value.net, props.currency)}`;
});

const rangeMetaText = computed(() => {
  const firstVisible = chartLabels.value[0] ?? null;
  const lastVisible = chartLabels.value[chartLabels.value.length - 1] ?? null;
  const start = props.mode === "PORTFOLIO" || props.mode === "ASSET" ? firstVisible : props.rangeStartDate ?? firstVisible;
  const end = props.mode === "PORTFOLIO" || props.mode === "ASSET" ? lastVisible : props.rangeEndDate ?? lastVisible;
  if (!start || !end) return "";
  return `${formatXAxisLabel(start)} - ${formatXAxisLabel(end)}`;
});

watch(expanded, (value) => {
  if (typeof window !== "undefined" && props.storageKey) {
    window.localStorage.setItem(props.storageKey, value ? "1" : "0");
  }
  void nextTick(value ? scrollToLatest : syncVisibleRange);
});

function handleResize(): void {
  measurePlotViewport(true);
}

onMounted(() => {
  loadExpandedState();
  void nextTick(() => {
    observePlotViewport();
    scrollToLatest();
  });
  if (typeof window !== "undefined") {
    window.addEventListener("resize", handleResize);
  }
});

onBeforeUnmount(() => {
  plotResizeObserver?.disconnect();
  plotResizeObserver = null;
  if (typeof window !== "undefined") {
    window.removeEventListener("resize", handleResize);
  }
});

watch(
  () => [
    props.points.length,
    props.bucket,
    props.range,
    props.mode,
    chartLabels.value.length,
    props.portfolioMetric,
    props.assetMetric,
    props.portfolioKey,
    props.assetKey,
    props.portfolioLines.length,
    props.assetLines.length,
    props.showGross,
    props.showLiabilities,
    props.showNet,
  ],
  () => {
    viewportStartIndex.value = 0;
    viewportEndIndex.value = 0;
    void nextTick(scrollToLatest);
  },
);

watch(
  () => [props.range, props.bucket, props.mode, props.portfolioMetric, props.assetMetric, props.portfolioKey, props.assetKey] as const,
  () => {
    zoomLevel.value = 0;
  },
);

watch(plotScrollRef, () => {
  void nextTick(() => {
    observePlotViewport();
    measurePlotViewport(true);
  });
});

function setZoomLevel(next: number): void {
  const keepLatest = isScrolledNearLatest();
  zoomLevel.value = Math.max(-2, Math.min(2, next)) as ZoomLevel;
  void nextTick(keepLatest ? scrollToLatest : syncVisibleRange);
}

function zoomOut(): void {
  setZoomLevel(zoomLevel.value - 1);
}

function zoomIn(): void {
  setZoomLevel(zoomLevel.value + 1);
}

function resetZoom(): void {
  setZoomLevel(0);
}

function isScrolledNearLatest(): boolean {
  const el = plotScrollRef.value;
  if (!el) return true;
  return el.scrollWidth - el.clientWidth - el.scrollLeft <= 8;
}

function observePlotViewport(): void {
  const el = plotScrollRef.value;
  plotResizeObserver?.disconnect();
  plotResizeObserver = null;
  if (!el || typeof ResizeObserver === "undefined") return;
  plotResizeObserver = new ResizeObserver(() => {
    measurePlotViewport(isScrolledNearLatest());
  });
  plotResizeObserver.observe(el);
}

function measurePlotViewport(keepLatest = false): void {
  const changed = updatePlotViewportWidth();
  if (changed) {
    void nextTick(keepLatest ? scrollToLatest : syncVisibleRange);
    return;
  }
  syncVisibleRange();
}

function scrollToLatest(): void {
  updatePlotViewportWidth();
  void nextTick(() => {
    const el = plotScrollRef.value;
    if (!el) {
      syncVisibleRange();
      return;
    }
    el.scrollLeft = Math.max(0, el.scrollWidth - el.clientWidth);
    syncVisibleRange();
  });
}

function updatePlotViewportWidth(): boolean {
  const el = plotScrollRef.value;
  if (!el) return false;
  const nextWidth = Math.floor(el.clientWidth);
  if (nextWidth > 0 && nextWidth !== plotViewportWidth.value) {
    plotViewportWidth.value = nextWidth;
    return true;
  }
  return false;
}

function syncVisibleRange(): void {
  const el = plotScrollRef.value;
  const total = chartLabels.value.length;
  updatePlotViewportWidth();
  if (!el || total <= 1) {
    viewportStartIndex.value = 0;
    viewportEndIndex.value = Math.max(0, total - 1);
    return;
  }
  const usable = Math.max(1, plotWidth.value - plotPaddingX * 2);
  const gap = usable / Math.max(1, total - 1);
  const left = Math.max(0, el.scrollLeft - plotPaddingX);
  const right = Math.max(0, el.scrollLeft + el.clientWidth - plotPaddingX);
  const start = Math.max(0, Math.floor(left / gap) - 1);
  const end = Math.min(total - 1, Math.ceil(right / gap) + 1);
  viewportStartIndex.value = start;
  viewportEndIndex.value = Math.max(start, end);
}

function toX(index: number, total: number): number {
  if (total <= 1) return plotPaddingX;
  const usable = plotWidth.value - plotPaddingX * 2;
  return plotPaddingX + (usable * index) / (total - 1);
}

function toY(value: number): number {
  const [min, max] = scaledValues.value;
  const usable = chartHeight - chartPaddingY * 2;
  const ratio = (value - min) / (max - min || 1);
  return chartHeight - chartPaddingY - usable * ratio;
}

function buildPath(values: Array<number | null>): string {
  if (values.length === 0) return "";
  const segments: string[] = [];
  let hasStarted = false;
  values.forEach((value, index) => {
    if (value == null || !Number.isFinite(value)) {
      hasStarted = false;
      return;
    }
    const prefix = hasStarted ? "L" : "M";
    segments.push(`${prefix} ${toX(index, values.length)} ${toY(value)}`);
    hasStarted = true;
  });
  return segments.join(" ");
}

const linePaths = computed(() =>
  renderLines.value.map((line) => ({
    ...line,
    path: buildPath(line.values),
  })),
);

function setSummaryMetric(metric: "gross" | "liabilities" | "net", checked: boolean): void {
  if (metric === "gross") emit("update:showGross", checked);
  if (metric === "liabilities") emit("update:showLiabilities", checked);
  if (metric === "net") emit("update:showNet", checked);
}

const ticks = computed(() => {
  const [min, max] = scaledValues.value;
  const step = (max - min) / 3;
  return [0, 1, 2, 3].map((index) => {
    const value = min + step * index;
    return {
      y: toY(value),
      value,
    };
  });
});

const xTicks = computed(() => {
  const total = chartLabels.value.length;
  if (total <= 1) return [];
  let step = 1;
  if (props.bucket === "DAY") {
    step = total > 40 ? 7 : Math.max(1, Math.ceil(total / 6));
  } else if (props.bucket === "WEEK") {
    step = Math.max(1, Math.ceil(total / 8));
  }
  const indexes: number[] = [];
  for (let index = 0; index < total; index += step) {
    indexes.push(index);
  }
  const latestIndex = total - 1;
  if (indexes[indexes.length - 1] !== latestIndex) {
    const previousIndex = indexes[indexes.length - 1] ?? 0;
    const latestX = toX(latestIndex, total);
    const previousX = toX(previousIndex, total);
    if (latestX - previousX < 54) {
      indexes[indexes.length - 1] = latestIndex;
    } else {
      indexes.push(latestIndex);
    }
  }
  return Array.from(new Set(indexes)).map((index) => ({
    index,
    x: toX(index, total),
    label: chartLabels.value[index] ?? "",
  }));
});

function pointX(index: number): number {
  return toX(index, chartLabels.value.length);
}

function formatAxisValue(value: number): string {
  if (props.maskAmounts && isAmountAxis.value) {
    return "***";
  }
  if ((props.mode === "PORTFOLIO" && props.portfolioMetric === "RETURN") || (props.mode === "ASSET" && props.assetMetric === "RETURN")) {
    return `${value.toFixed(1)}%`;
  }
  if ((props.currency || "KRW").toUpperCase() === "KRW") {
    const abs = Math.abs(value);
    const sign = value < 0 ? "-" : "";
    const trim = (num: number) =>
      num
        .toFixed(2)
        .replace(/\.00$/, "")
        .replace(/(\.\d)0$/, "$1");
    if (abs >= 1_0000_0000_0000) {
      return `${sign}${trim(abs / 1_0000_0000_0000)}조`;
    }
    if (abs >= 1_0000_0000) {
      return `${sign}${trim(abs / 1_0000_0000)}억`;
    }
    if (abs >= 1_0000) {
      return `${sign}${trim(abs / 1_0000)}만`;
    }
    return `${sign}${Math.round(abs).toLocaleString("ko-KR")}`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: props.currency,
    maximumFractionDigits: 2,
    notation: "compact",
  }).format(value || 0);
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatPercent(value: number): string {
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function currentMetricLabel(): string {
  if (props.mode === "SUMMARY") return `Amount (${props.currency})`;
  if (props.mode === "ASSET") {
    if (props.assetMetric === "RETURN") return "Return (%)";
    if (props.assetMetric === "PROFIT") return `Profit (${props.currency})`;
    return `Current Value (${props.currency})`;
  }
  if (props.portfolioMetric === "RETURN") return "Return (%)";
  if (props.portfolioMetric === "CURRENT_VALUE") return `Current Value (${props.currency})`;
  if (props.portfolioMetric === "CURRENT_NET") return `Current Net (${props.currency})`;
  return `Profit (${props.currency})`;
}

function formatSignedCurrency(value: number): string {
  if (props.maskAmounts) return "***";
  const sign = value > 0 ? "+" : "";
  return `${sign}${formatCurrency(value, props.currency)}`;
}

function formatSignedNumber(value: number | null): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return formatPercent(value);
}

function moverRankText(mover: AssetMover): string {
  if (props.assetMetric === "RETURN") return `Return Δ ${formatSignedNumber(mover.delta_return_pct)}`;
  if (props.assetMetric === "PROFIT") return `Profit Δ ${formatSignedCurrency(mover.delta_profit)}`;
  return `Current Δ ${formatSignedCurrency(mover.delta_value)}`;
}

function portfolioMoverRankText(mover: PortfolioMover): string {
  if (props.portfolioMoverBasis === "NET") return `Net Δ ${formatSignedCurrency(mover.delta_net)}`;
  if (props.portfolioMoverBasis === "LIABILITIES") return `Liabilities Δ ${formatSignedCurrency(mover.delta_liabilities)}`;
  return `Gross Δ ${formatSignedCurrency(mover.delta_value)}`;
}

function portfolioDriverLabel(driver: PortfolioMover["driver_type"]): string {
  if (driver === "CAPITAL_LED") return "Capital-led";
  if (driver === "PERFORMANCE_LED") return "Performance-led";
  if (driver === "WITHDRAWAL_LED") return "Withdrawal-led";
  if (driver === "LIABILITY_LED") return "Liability-led";
  if (driver === "NEUTRAL") return "Neutral";
  return "Mixed";
}

function portfolioDriverClass(driver: PortfolioMover["driver_type"]): string {
  if (driver === "CAPITAL_LED") {
    return "border-sky-300 text-sky-700 dark:border-sky-600 dark:text-sky-200";
  }
  if (driver === "PERFORMANCE_LED") {
    return "border-emerald-300 text-emerald-700 dark:border-emerald-600 dark:text-emerald-200";
  }
  if (driver === "WITHDRAWAL_LED") {
    return "border-amber-300 text-amber-700 dark:border-amber-600 dark:text-amber-200";
  }
  if (driver === "LIABILITY_LED") {
    return "border-rose-300 text-rose-700 dark:border-rose-600 dark:text-rose-200";
  }
  return "border-slate-300 text-slate-600 dark:border-slate-600 dark:text-slate-300";
}

function setPortfolioFromMover(portfolioId: number | null): void {
  if (portfolioId == null) return;
  emit("update:portfolioKey", String(portfolioId));
  emit("update:mode", "PORTFOLIO");
}

function setAssetFromMover(key: string): void {
  emit("update:assetKey", key);
}

function formatXAxisLabel(label: string): string {
  const normalized = (label || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    const [year = "", month = "", day = ""] = normalized.split("-");
    if (props.bucket === "MONTH") {
      return props.range === "1Y" ? `${year.slice(2)}.${Number(month)}` : `${Number(month)}월`;
    }
    return `${Number(month)}/${Number(day)}`;
  }
  if (/^\d{4}-\d{2}$/.test(normalized)) {
    const [year = "", month = ""] = normalized.split("-");
    return props.range === "1Y" ? `${year.slice(2)}.${Number(month)}` : `${Number(month)}월`;
  }
  return normalized;
}

function inspectPoint(lineLabel: string, pointLabel: string, value: number): void {
  inspectText.value = `${lineLabel} - ${pointLabel || "-"} - ${
    (props.mode === "PORTFOLIO" && props.portfolioMetric === "RETURN") || (props.mode === "ASSET" && props.assetMetric === "RETURN")
      ? formatPercent(value)
      : formatCurrency(value, props.currency)
  }`;
}
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-start justify-between gap-2">
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :aria-pressed="infoOpen"
            :aria-label="infoOpen ? 'Hide trend info' : 'Show trend info'"
            @click="infoOpen = !infoOpen"
          >
            i
          </button>
        </div>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
      </div>
      <div class="flex items-center gap-2">
        <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          {{ currency }}
        </span>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="expanded = !expanded"
        >
          {{ expanded ? "Collapse" : "Expand" }}
        </button>
      </div>
    </div>

    <div
      v-if="infoOpen"
      class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
    >
      <p>Networth Trend shows how the selected scope changed across valuation snapshots over time.</p>
      <p class="mt-1">Range is anchored to the latest matched snapshot, not today's calendar date.</p>
      <p class="mt-1">Day/Week/Month each use the last snapshot available inside that bucket.</p>
      <p class="mt-1">On mobile, the Y-axis stays fixed while the plot scrolls and rescales to the visible points.</p>
    </div>

    <div
      v-if="!expanded"
      class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
    >
      <p class="font-medium text-slate-700 dark:text-slate-200">Collapsed. Click Expand to preview the latest networth trend.</p>
      <p class="mt-1" :style="props.maskAmounts && isAmountAxis ? { filter: 'blur(6px)' } : undefined">
        {{ collapsedSummary }}
      </p>
      <p v-if="chartLabels.length > 0" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Range: {{ rangeMetaText || `${firstPoint?.label ?? '-'} -> ${lastPoint?.label ?? '-'}` }}
      </p>
    </div>

    <div v-if="expanded && showRangeBucketControls" class="mt-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3 py-3 dark:border-slate-700 dark:bg-slate-950/30">
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <span class="mr-1 font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Range</span>
        <button
          v-for="item in rangeOptions"
          :key="`trend-range-${item.key}`"
          type="button"
          class="rounded-lg border px-3 py-1.5 font-semibold transition-colors"
          :class="
            rangeModel === item.key
              ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="rangeModel = item.key"
        >
          {{ item.label }}
        </button>
        <span class="ml-2 mr-1 font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Bucket</span>
        <button
          v-for="item in bucketOptions"
          :key="`trend-bucket-${item.key}`"
          type="button"
          class="rounded-lg border px-3 py-1.5 font-semibold transition-colors"
          :class="
            bucketModel === item.key
              ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="bucketModel = item.key"
        >
          {{ item.label }}
        </button>
      </div>
      <p v-if="rangeMetaText" class="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
        Range anchor: latest snapshot - {{ rangeMetaText }}
      </p>
    </div>

    <div v-if="expanded && showModeToggle" class="mt-3 flex flex-wrap items-center gap-2">
      <button
        type="button"
        class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
        :class="
          modeModel === 'SUMMARY'
            ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
            : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
        "
        @click="modeModel = 'SUMMARY'"
      >
        Summary
      </button>
      <button
        type="button"
        class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
        :class="
          modeModel === 'PORTFOLIO'
            ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
            : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
        "
        @click="modeModel = 'PORTFOLIO'"
      >
        Portfolio
      </button>
      <button
        type="button"
        class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
        :class="
          modeModel === 'ASSET'
            ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
            : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
        "
        @click="modeModel = 'ASSET'"
      >
        Asset
      </button>
      <div v-if="modeModel === 'PORTFOLIO'" class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
          :class="
            portfolioMetricModel === 'CURRENT_VALUE'
              ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="portfolioMetricModel = 'CURRENT_VALUE'"
        >
          Current Value
        </button>
        <button
          type="button"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
          :class="
            portfolioMetricModel === 'CURRENT_NET'
              ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="portfolioMetricModel = 'CURRENT_NET'"
        >
          Current Net
        </button>
        <button
          type="button"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
          :class="
            portfolioMetricModel === 'PROFIT'
              ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="portfolioMetricModel = 'PROFIT'"
        >
          Profit
        </button>
        <button
          type="button"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
          :class="
            portfolioMetricModel === 'RETURN'
              ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="portfolioMetricModel = 'RETURN'"
        >
          Return
        </button>
      </div>
      <div v-if="modeModel === 'ASSET'" class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
          :class="
            assetMetricModel === 'CURRENT_VALUE'
              ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="assetMetricModel = 'CURRENT_VALUE'"
        >
          Current Value
        </button>
        <button
          type="button"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
          :class="
            assetMetricModel === 'PROFIT'
              ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="assetMetricModel = 'PROFIT'"
        >
          Profit
        </button>
        <button
          type="button"
          class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
          :class="
            assetMetricModel === 'RETURN'
              ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
              : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
          "
          @click="assetMetricModel = 'RETURN'"
        >
          Return
        </button>
      </div>
      <select
        v-if="(modeModel === 'PORTFOLIO' || modeModel === 'ASSET') && showPortfolioSelector"
        v-model="portfolioKeyModel"
        class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <option v-for="item in portfolioOptions" :key="`trend-portfolio-${item.key}`" :value="item.key">
          {{ item.label }}
        </option>
      </select>
      <select
        v-if="modeModel === 'ASSET'"
        v-model="assetKeyModel"
        class="min-w-[180px] rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <option value="TOP_MOVERS">Top movers</option>
        <option v-for="item in assetOptions" :key="`trend-asset-${item.key}`" :value="item.key">
          {{ item.label }}
        </option>
      </select>
    </div>

    <div v-if="expanded && loading" class="mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      Loading trend...
    </div>
    <div v-else-if="expanded && error" class="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
      {{ error }}
    </div>
    <div v-else-if="expanded && chartLabels.length <= 1" class="mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      Need at least 2 snapshot points to draw trend line.
    </div>
    <div v-else-if="expanded" class="mt-3 space-y-3">
      <div v-if="modeModel === 'SUMMARY' && showVisibilityControls" class="flex flex-wrap items-center gap-4 text-xs">
        <label class="inline-flex items-center gap-2">
          <input
            :checked="showGrossModel"
            type="checkbox"
            class="h-4 w-4 rounded"
            @change="setSummaryMetric('gross', ($event.target as HTMLInputElement).checked)"
          />
          Gross
        </label>
        <label class="inline-flex items-center gap-2">
          <input
            :checked="showLiabilitiesModel"
            type="checkbox"
            class="h-4 w-4 rounded"
            @change="setSummaryMetric('liabilities', ($event.target as HTMLInputElement).checked)"
          />
          Liabilities
        </label>
        <label class="inline-flex items-center gap-2">
          <input
            :checked="showNetModel"
            type="checkbox"
            class="h-4 w-4 rounded"
            @change="setSummaryMetric('net', ($event.target as HTMLInputElement).checked)"
          />
          Net
        </label>
      </div>

      <div class="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300 sm:flex-row sm:items-center sm:justify-between">
        <div class="grid gap-1">
          <p>
            <span class="font-semibold text-slate-700 dark:text-slate-200">X-axis:</span>
            {{ bucketModel === "DAY" ? "Snapshot date" : bucketModel === "WEEK" ? "Last snapshot in each week" : "Last snapshot in each month" }}
          </p>
          <p>
            <span class="font-semibold text-slate-700 dark:text-slate-200">Y-axis:</span>
            {{ currentMetricLabel() }}
          </p>
          <p v-if="modeModel === 'ASSET'" class="text-[11px] text-slate-500 dark:text-slate-400">
            Current Value Δ includes price movement and quantity/cost basis changes. Use Profit or Return to focus on performance.
          </p>
        </div>
        <div class="ml-auto flex items-center gap-1">
          <span class="mr-1 font-semibold uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Zoom</span>
          <button
            type="button"
            class="rounded-lg border px-2 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            :class="
              zoomLevel <= -2
                ? 'border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-500'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
            "
            :disabled="zoomLevel <= -2"
            aria-label="Zoom out networth chart"
            @click="zoomOut"
          >
            -
          </button>
          <button
            type="button"
            class="rounded-lg border px-2 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            :class="
              zoomLevel >= 2
                ? 'border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-500'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
            "
            :disabled="zoomLevel >= 2"
            aria-label="Zoom in networth chart"
            @click="zoomIn"
          >
            +
          </button>
          <button
            type="button"
            class="rounded-lg border px-2.5 py-1 text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-40"
            :class="
              zoomLevel === 0
                ? 'border-slate-300 text-slate-500 dark:border-slate-700 dark:text-slate-500'
                : 'border-indigo-300 text-indigo-700 hover:bg-indigo-50 dark:border-indigo-700 dark:text-indigo-200 dark:hover:bg-indigo-950/40'
            "
            :disabled="zoomLevel === 0"
            aria-label="Reset networth chart zoom"
            @click="resetZoom"
          >
            Fit
          </button>
          <button
            v-if="showRefreshControl"
            type="button"
            class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="loading"
            aria-label="Refresh networth trend data"
            @click="emit('refresh')"
          >
            {{ loading ? "Refreshing..." : "Refresh" }}
          </button>
        </div>
      </div>

      <div v-if="linePaths.length > 0" class="-mx-3 overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 sm:-mx-2 md:-mx-1">
        <div class="relative bg-slate-50 dark:bg-slate-950/40">
          <div class="pointer-events-none absolute inset-y-0 right-0 z-10 w-16">
            <span
              v-for="tick in ticks"
              :key="`floating-y-label-${tick.y}`"
              class="absolute right-2 -translate-y-1/2 rounded-sm px-0.5 text-right text-[10px] leading-none text-slate-500/95 [text-shadow:0_1px_2px_rgba(15,23,42,0.75)] dark:text-slate-400/95"
              :style="{
                top: `${(tick.y / chartHeight) * 100}%`,
                filter: props.maskAmounts && isAmountAxis ? 'blur(6px)' : undefined,
              }"
            >
              {{ formatAxisValue(tick.value) }}
            </span>
          </div>
          <div ref="plotScrollRef" class="overflow-x-auto" @scroll="syncVisibleRange">
            <svg
              :viewBox="`0 0 ${plotWidth} ${chartHeight}`"
              class="h-[320px] bg-slate-50 dark:bg-slate-950/40 md:h-[380px] xl:h-[420px]"
              :style="{ width: svgWidthStyle, minWidth: svgWidthStyle }"
            >
              <g>
                <line
                  v-for="tick in ticks"
                  :key="`tick-${tick.y}`"
                  x1="0"
                  :y1="tick.y"
                  :x2="plotWidth"
                  :y2="tick.y"
                  stroke="rgba(148, 163, 184, 0.28)"
                  stroke-width="1"
                />
              </g>
              <g>
                <line
                  v-for="tick in xTicks"
                  :key="`x-grid-${tick.index}`"
                  :x1="tick.x"
                  y1="0"
                  :x2="tick.x"
                  :y2="chartHeight"
                  stroke="rgba(148, 163, 184, 0.12)"
                  stroke-width="1"
                />
                <text
                  v-for="tick in xTicks"
                  :key="`x-label-${tick.index}`"
                  :x="tick.x"
                  :y="chartHeight - 4"
                  text-anchor="middle"
                  font-size="10"
                  fill="rgba(148, 163, 184, 0.95)"
                >
                  {{ formatXAxisLabel(tick.label) }}
                </text>
              </g>
              <g v-for="line in linePaths" :key="`line-${line.key}`">
                <path :d="line.path" fill="none" :stroke="line.color" stroke-width="2.5" />
                <circle
                  v-for="(value, idx) in line.values"
                  :key="`point-${line.key}-${idx}`"
                  v-show="value != null"
                  :cx="pointX(idx)"
                  :cy="toY(Number(value ?? 0))"
                  :r="pointRadius"
                  :fill="line.color"
                  class="cursor-pointer"
                  @mouseenter="inspectPoint(line.label, chartLabels[idx] ?? '-', Number(value ?? 0))"
                  @click="inspectPoint(line.label, chartLabels[idx] ?? '-', Number(value ?? 0))"
                />
              </g>
            </svg>
          </div>
        </div>
      </div>
      <div v-else class="rounded-xl border border-slate-200 bg-slate-100 p-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        Not enough points.
      </div>

      <div v-if="linePaths.length > 0" class="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
        <span v-for="line in linePaths" :key="`legend-${line.key}`" class="inline-flex items-center gap-1">
          <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: line.color }" />
          {{ line.label }}
        </span>
      </div>
      <p
        v-if="linePaths.length > 0"
        class="text-xs text-slate-500 dark:text-slate-400"
        :style="props.maskAmounts && isAmountAxis ? { filter: 'blur(6px)' } : undefined"
      >
        {{ inspectText || "Hover/click a point to inspect value." }}
      </p>

      <div v-if="modeModel === 'SUMMARY' && linePaths.length > 0" class="grid grid-cols-1 gap-2 text-xs md:grid-cols-3">
        <div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <p class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <span class="h-2.5 w-2.5 rounded-full bg-green-500" />
            Gross
          </p>
          <p class="mt-1 text-slate-600 dark:text-slate-300" :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
            {{ formatCurrency(lastPoint?.gross ?? 0, currency) }}
          </p>
        </div>
        <div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <p class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <span class="h-2.5 w-2.5 rounded-full bg-rose-500" />
            Liabilities
          </p>
          <p class="mt-1 text-slate-600 dark:text-slate-300" :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
            {{ formatCurrency(lastPoint?.liabilities ?? 0, currency) }}
          </p>
        </div>
        <div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <p class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <span class="h-2.5 w-2.5 rounded-full bg-sky-500" />
            Net
          </p>
          <p class="mt-1 text-slate-600 dark:text-slate-300" :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
            {{ formatCurrency(lastPoint?.net ?? 0, currency) }}
          </p>
        </div>
      </div>

      <div v-if="modeModel === 'SUMMARY' && portfolioMovers" class="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs dark:border-slate-700 dark:bg-slate-900/40">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="font-semibold text-slate-800 dark:text-slate-100">Top Portfolio Movers</p>
            <p class="mt-0.5 text-slate-500 dark:text-slate-400">
              Invested Δ helps separate added capital from actual profit movement.
            </p>
          </div>
          <span class="rounded-full border border-indigo-300 px-2 py-0.5 text-[11px] font-semibold text-indigo-700 dark:border-indigo-500/50 dark:text-indigo-200">
            Basis: {{ portfolioMoverBasis }}
          </span>
        </div>
        <div class="mt-3 grid gap-3 lg:grid-cols-2">
          <div>
            <p class="mb-2 font-semibold uppercase tracking-[0.18em] text-emerald-500">Top Gainers</p>
            <div v-if="portfolioMovers.top_gainers.length > 0" class="grid gap-2">
              <button
                v-for="mover in portfolioMovers.top_gainers"
                :key="`portfolio-gainer-${mover.portfolio_id ?? mover.portfolio_name}`"
                type="button"
                class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
                :disabled="mover.portfolio_id == null"
                @click="setPortfolioFromMover(mover.portfolio_id)"
              >
                <p class="flex flex-wrap items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <span>{{ mover.portfolio_name }}</span>
                  <span v-if="mover.portfolio_type" class="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    {{ mover.portfolio_type }}
                  </span>
                  <span v-if="mover.status" class="rounded-full border border-emerald-300 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:border-emerald-600 dark:text-emerald-200">
                    {{ mover.status }}
                  </span>
                  <span class="rounded-full border px-1.5 py-0.5 text-[10px]" :class="portfolioDriverClass(mover.driver_type)">
                    {{ portfolioDriverLabel(mover.driver_type) }}
                  </span>
                </p>
                <p class="mt-1 text-emerald-600 dark:text-emerald-300">{{ portfolioMoverRankText(mover) }}</p>
                <p class="mt-1 text-slate-500 dark:text-slate-400">
                  Invested Δ {{ formatSignedCurrency(mover.delta_invested) }} · Profit Δ {{ formatSignedCurrency(mover.delta_profit) }}
                </p>
                <p class="mt-1 text-slate-500 dark:text-slate-400">
                  Return Δ {{ formatSignedNumber(mover.delta_return_pct) }} · Liabilities Δ {{ formatSignedCurrency(mover.delta_liabilities) }}
                </p>
              </button>
            </div>
            <p v-else class="rounded-lg border border-slate-200 px-3 py-2 text-slate-500 dark:border-slate-700 dark:text-slate-400">No portfolio gainers in this range.</p>
          </div>
          <div>
            <p class="mb-2 font-semibold uppercase tracking-[0.18em] text-rose-500">Top Losers</p>
            <div v-if="portfolioMovers.top_losers.length > 0" class="grid gap-2">
              <button
                v-for="mover in portfolioMovers.top_losers"
                :key="`portfolio-loser-${mover.portfolio_id ?? mover.portfolio_name}`"
                type="button"
                class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-rose-300 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-rose-700 dark:hover:bg-rose-950/30"
                :disabled="mover.portfolio_id == null"
                @click="setPortfolioFromMover(mover.portfolio_id)"
              >
                <p class="flex flex-wrap items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <span>{{ mover.portfolio_name }}</span>
                  <span v-if="mover.portfolio_type" class="rounded-full bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-300">
                    {{ mover.portfolio_type }}
                  </span>
                  <span v-if="mover.status" class="rounded-full border border-rose-300 px-1.5 py-0.5 text-[10px] text-rose-700 dark:border-rose-600 dark:text-rose-200">
                    {{ mover.status }}
                  </span>
                  <span class="rounded-full border px-1.5 py-0.5 text-[10px]" :class="portfolioDriverClass(mover.driver_type)">
                    {{ portfolioDriverLabel(mover.driver_type) }}
                  </span>
                </p>
                <p class="mt-1 text-rose-600 dark:text-rose-300">{{ portfolioMoverRankText(mover) }}</p>
                <p class="mt-1 text-slate-500 dark:text-slate-400">
                  Invested Δ {{ formatSignedCurrency(mover.delta_invested) }} · Profit Δ {{ formatSignedCurrency(mover.delta_profit) }}
                </p>
                <p class="mt-1 text-slate-500 dark:text-slate-400">
                  Return Δ {{ formatSignedNumber(mover.delta_return_pct) }} · Liabilities Δ {{ formatSignedCurrency(mover.delta_liabilities) }}
                </p>
              </button>
            </div>
            <p v-else class="rounded-lg border border-slate-200 px-3 py-2 text-slate-500 dark:border-slate-700 dark:text-slate-400">No portfolio losers in this range.</p>
          </div>
        </div>
      </div>

      <div v-if="modeModel === 'ASSET' && assetMovers" class="rounded-xl border border-slate-200 bg-slate-50/70 p-3 text-xs dark:border-slate-700 dark:bg-slate-900/40">
        <div class="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p class="font-semibold text-slate-800 dark:text-slate-100">Top Asset Movers</p>
            <p class="mt-0.5 text-slate-500 dark:text-slate-400">
              Cost basis Δ helps separate added capital from actual profit movement.
            </p>
          </div>
          <span class="rounded-full border border-amber-300 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:border-amber-500/50 dark:text-amber-200">
            {{ assetKeyModel === "TOP_MOVERS" ? "Top movers" : "Selected asset" }}
          </span>
        </div>
        <div class="mt-3 grid gap-3 lg:grid-cols-2">
          <div>
            <p class="mb-2 font-semibold uppercase tracking-[0.18em] text-emerald-500">Top Gainers</p>
            <div v-if="assetMovers.top_gainers.length > 0" class="grid gap-2">
              <button
                v-for="mover in assetMovers.top_gainers"
                :key="`asset-gainer-${mover.key}`"
                type="button"
                class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-emerald-300 hover:bg-emerald-50 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-emerald-700 dark:hover:bg-emerald-950/30"
                @click="setAssetFromMover(mover.key)"
              >
                <p class="flex flex-wrap items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <span>{{ mover.label }}</span>
                  <span v-if="mover.status" class="rounded-full border border-emerald-300 px-1.5 py-0.5 text-[10px] text-emerald-700 dark:border-emerald-600 dark:text-emerald-200">
                    {{ mover.status }}
                  </span>
                </p>
                <p class="mt-1 text-emerald-600 dark:text-emerald-300">{{ moverRankText(mover) }}</p>
                <p class="mt-1 text-slate-500 dark:text-slate-400">
                  Profit Δ {{ formatSignedCurrency(mover.delta_profit) }} · Return Δ {{ formatSignedNumber(mover.delta_return_pct) }}
                </p>
                <p class="mt-1 text-slate-500 dark:text-slate-400">
                  Cost basis Δ {{ formatSignedCurrency(mover.delta_cost_basis) }}
                </p>
              </button>
            </div>
            <p v-else class="rounded-lg border border-slate-200 px-3 py-2 text-slate-500 dark:border-slate-700 dark:text-slate-400">No gainers in this range.</p>
          </div>
          <div>
            <p class="mb-2 font-semibold uppercase tracking-[0.18em] text-rose-500">Top Losers</p>
            <div v-if="assetMovers.top_losers.length > 0" class="grid gap-2">
              <button
                v-for="mover in assetMovers.top_losers"
                :key="`asset-loser-${mover.key}`"
                type="button"
                class="rounded-lg border border-slate-200 bg-white px-3 py-2 text-left transition-colors hover:border-rose-300 hover:bg-rose-50 dark:border-slate-700 dark:bg-slate-950/40 dark:hover:border-rose-700 dark:hover:bg-rose-950/30"
                @click="setAssetFromMover(mover.key)"
              >
                <p class="flex flex-wrap items-center gap-2 font-semibold text-slate-800 dark:text-slate-100">
                  <span>{{ mover.label }}</span>
                  <span v-if="mover.status" class="rounded-full border border-rose-300 px-1.5 py-0.5 text-[10px] text-rose-700 dark:border-rose-600 dark:text-rose-200">
                    {{ mover.status }}
                  </span>
                </p>
                <p class="mt-1 text-rose-600 dark:text-rose-300">{{ moverRankText(mover) }}</p>
                <p class="mt-1 text-slate-500 dark:text-slate-400">
                  Profit Δ {{ formatSignedCurrency(mover.delta_profit) }} · Return Δ {{ formatSignedNumber(mover.delta_return_pct) }}
                </p>
                <p class="mt-1 text-slate-500 dark:text-slate-400">
                  Cost basis Δ {{ formatSignedCurrency(mover.delta_cost_basis) }}
                </p>
              </button>
            </div>
            <p v-else class="rounded-lg border border-slate-200 px-3 py-2 text-slate-500 dark:border-slate-700 dark:text-slate-400">No losers in this range.</p>
          </div>
        </div>
      </div>

      <p v-if="linePaths.length > 0" class="text-[11px] text-slate-500 dark:text-slate-400">
        Range: {{ rangeMetaText || `${firstPoint?.label ?? '-'} -> ${lastPoint?.label ?? '-'}` }}
      </p>
    </div>
  </article>
</template>
