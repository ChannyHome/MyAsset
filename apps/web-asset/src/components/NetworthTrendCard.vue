<script setup lang="ts">
import { computed, ref } from "vue";

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

type TrendMode = "SUMMARY" | "PORTFOLIO_RETURN";

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
    showModeToggle?: boolean;
    portfolioLines?: NetworthSeriesLine[];
    portfolioOptions?: PortfolioOption[];
    portfolioKey?: string;
    showPortfolioSelector?: boolean;
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
    showModeToggle: true,
    portfolioLines: () => [],
    portfolioOptions: () => [],
    portfolioKey: "ALL",
    showPortfolioSelector: true,
  },
);

const emit = defineEmits<{
  (e: "update:showGross", value: boolean): void;
  (e: "update:showLiabilities", value: boolean): void;
  (e: "update:showNet", value: boolean): void;
  (e: "update:mode", value: TrendMode): void;
  (e: "update:portfolioKey", value: string): void;
}>();

type RenderLine = {
  key: string;
  label: string;
  color: string;
  values: Array<number | null>;
};

const chartWidth = 760;
const chartHeight = 240;
const chartPadding = 56;
const inspectText = ref("");

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

const portfolioKeyModel = computed({
  get: () => props.portfolioKey,
  set: (value: string) => emit("update:portfolioKey", value),
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

const renderLines = computed<RenderLine[]>(() => {
  if (props.mode === "PORTFOLIO_RETURN") {
    const labels = props.points.map((item) => item.label);
    return props.portfolioLines.map((line, index) => {
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
  if (props.showGross) {
    lines.push({
      key: "gross",
      label: "Gross",
      color: "#22c55e",
      values: props.points.map((point) => point.gross),
    });
  }
  if (props.showLiabilities) {
    lines.push({
      key: "liabilities",
      label: "Liabilities",
      color: "#ef4444",
      values: props.points.map((point) => point.liabilities),
    });
  }
  if (props.showNet) {
    lines.push({
      key: "net",
      label: "Net",
      color: "#0ea5e9",
      values: props.points.map((point) => point.net),
    });
  }
  return lines;
});

const allValues = computed<[number, number]>(() => {
  const rows = renderLines.value.flatMap((line) =>
    line.values.filter((value): value is number => value != null && Number.isFinite(value)),
  );
  if (rows.length === 0) return [0, 1];
  const min = Math.min(...rows);
  const max = Math.max(...rows);
  if (min === max) {
    return [min - 1, max + 1];
  }
  return [min, max];
});

const firstPoint = computed(() => (props.points.length > 0 ? props.points[0] : null));
const lastPoint = computed(() => (props.points.length > 0 ? props.points[props.points.length - 1] : null));

function toX(index: number, total: number): number {
  if (total <= 1) return chartPadding;
  const usable = chartWidth - chartPadding * 2;
  return chartPadding + (usable * index) / (total - 1);
}

function toY(value: number): number {
  const [min, max] = allValues.value;
  const usable = chartHeight - chartPadding * 2;
  const ratio = (value - min) / (max - min || 1);
  return chartHeight - chartPadding - usable * ratio;
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
  const [min, max] = allValues.value;
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
  const total = props.points.length;
  if (total <= 1) return [];
  const raw = [
    0,
    Math.floor((total - 1) * 0.25),
    Math.floor((total - 1) * 0.5),
    Math.floor((total - 1) * 0.75),
    total - 1,
  ];
  const unique = Array.from(new Set(raw)).filter((index) => index >= 0 && index < total);
  return unique.map((index) => ({
    index,
    x: toX(index, total),
    label: props.points[index]?.label ?? "",
  }));
});

function pointX(index: number): number {
  return toX(index, props.points.length);
}

function formatAxisValue(value: number): string {
  if (props.maskAmounts && props.mode === "SUMMARY") {
    return "•••";
  }
  if (props.mode === "PORTFOLIO_RETURN") {
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

function formatXAxisLabel(label: string): string {
  const normalized = (label || "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
    return normalized.slice(5);
  }
  return normalized;
}

function inspectPoint(lineLabel: string, pointLabel: string, value: number): void {
  inspectText.value = `${lineLabel} · ${pointLabel || "-"} · ${
    props.mode === "PORTFOLIO_RETURN" ? formatPercent(value) : formatCurrency(value, props.currency)
  }`;
}
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
      </div>
      <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {{ currency }}
      </span>
    </div>

    <div v-if="showModeToggle" class="mt-3 flex flex-wrap items-center gap-2">
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
          modeModel === 'PORTFOLIO_RETURN'
            ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
            : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
        "
        @click="modeModel = 'PORTFOLIO_RETURN'"
      >
        Portfolio Return
      </button>
      <select
        v-if="modeModel === 'PORTFOLIO_RETURN' && showPortfolioSelector"
        v-model="portfolioKeyModel"
        class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
      >
        <option v-for="item in portfolioOptions" :key="`trend-portfolio-${item.key}`" :value="item.key">
          {{ item.label }}
        </option>
      </select>
    </div>

    <div v-if="loading" class="mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      Loading trend...
    </div>
    <div v-else-if="error" class="mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
      {{ error }}
    </div>
    <div v-else-if="points.length <= 1" class="mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      Need at least 2 snapshot points to draw trend line.
    </div>
    <div v-else class="mt-3 space-y-3">
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

      <div class="grid gap-1 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
        <p>
          <span class="font-semibold text-slate-700 dark:text-slate-200">X-axis:</span>
          Snapshot date (valuation history)
        </p>
        <p>
          <span class="font-semibold text-slate-700 dark:text-slate-200">Y-axis:</span>
          {{ modeModel === "SUMMARY" ? `Amount (${currency})` : "Return (%)" }}
        </p>
      </div>

      <div v-if="linePaths.length > 0" class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="h-64 w-full min-w-[560px] bg-slate-50 dark:bg-slate-950/40">
          <g>
            <line
              v-for="tick in ticks"
              :key="`tick-${tick.y}`"
              x1="0"
              :y1="tick.y"
              :x2="chartWidth"
              :y2="tick.y"
              stroke="rgba(148, 163, 184, 0.28)"
              stroke-width="1"
            />
            <text
              v-for="tick in ticks"
              :key="`tick-label-${tick.y}`"
              x="6"
              :y="tick.y - 2"
              text-anchor="start"
              font-size="10"
              fill="rgba(148, 163, 184, 0.95)"
            >
              {{ formatAxisValue(tick.value) }}
            </text>
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
              r="3.5"
              :fill="line.color"
              class="cursor-pointer"
              @mouseenter="inspectPoint(line.label, points[idx]?.label ?? '-', Number(value ?? 0))"
              @click="inspectPoint(line.label, points[idx]?.label ?? '-', Number(value ?? 0))"
            />
          </g>
        </svg>
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
        :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined"
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

      <p v-if="linePaths.length > 0" class="text-[11px] text-slate-500 dark:text-slate-400">
        Range: {{ firstPoint?.label ?? "-" }} -> {{ lastPoint?.label ?? "-" }}
      </p>
    </div>
  </article>
</template>
