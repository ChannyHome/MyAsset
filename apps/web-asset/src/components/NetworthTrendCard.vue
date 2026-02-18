<script setup lang="ts">
import { computed } from "vue";

type NetworthPoint = {
  label: string;
  gross: number;
  liabilities: number;
  net: number;
};

const props = withDefaults(
  defineProps<{
    title?: string;
    subtitle?: string;
    currency: string;
    points: NetworthPoint[];
    loading?: boolean;
    error?: string;
  }>(),
  {
    title: "Networth Trend",
    subtitle: "valuation_snapshots",
    loading: false,
    error: "",
  },
);

const chartWidth = 640;
const chartHeight = 220;
const chartPadding = 18;

const allValues = computed<[number, number]>(() => {
  const rows = props.points.flatMap((point) => [point.gross, point.liabilities, point.net]);
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

function buildPath(values: number[]): string {
  if (values.length === 0) return "";
  return values
    .map((value, index) => `${index === 0 ? "M" : "L"} ${toX(index, values.length)} ${toY(value)}`)
    .join(" ");
}

const grossPath = computed(() => buildPath(props.points.map((point) => point.gross)));
const liabilitiesPath = computed(() => buildPath(props.points.map((point) => point.liabilities)));
const netPath = computed(() => buildPath(props.points.map((point) => point.net)));

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

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
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
      <div class="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="h-56 w-full min-w-[540px] bg-slate-50 dark:bg-slate-950/40">
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
          </g>
          <path :d="grossPath" fill="none" stroke="#0ea5e9" stroke-width="2.5" />
          <path :d="liabilitiesPath" fill="none" stroke="#f59e0b" stroke-width="2.5" />
          <path :d="netPath" fill="none" stroke="#10b981" stroke-width="3" />
        </svg>
      </div>

      <div class="grid grid-cols-1 gap-2 text-xs md:grid-cols-3">
        <div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <p class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <span class="h-2.5 w-2.5 rounded-full bg-sky-500" />
            Gross
          </p>
          <p class="mt-1 text-slate-600 dark:text-slate-300">
            {{ formatCurrency(lastPoint?.gross ?? 0, currency) }}
          </p>
        </div>
        <div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <p class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <span class="h-2.5 w-2.5 rounded-full bg-amber-500" />
            Liabilities
          </p>
          <p class="mt-1 text-slate-600 dark:text-slate-300">
            {{ formatCurrency(lastPoint?.liabilities ?? 0, currency) }}
          </p>
        </div>
        <div class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          <p class="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200">
            <span class="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            Net
          </p>
          <p class="mt-1 text-slate-600 dark:text-slate-300">
            {{ formatCurrency(lastPoint?.net ?? 0, currency) }}
          </p>
        </div>
      </div>

      <p class="text-[11px] text-slate-500 dark:text-slate-400">
        Range: {{ firstPoint?.label ?? "-" }} -> {{ lastPoint?.label ?? "-" }}
      </p>
    </div>
  </article>
</template>
