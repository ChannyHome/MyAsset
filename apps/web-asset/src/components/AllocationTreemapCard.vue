<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

type AllocationItem = {
  key: string;
  label: string;
  value: number;
  ratioPct: number;
  returnPct?: number | null;
};

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    currency: string;
    items: AllocationItem[];
    maskAmounts?: boolean;
    loading?: boolean;
    error?: string;
    storageKey?: string;
  }>(),
  {
    subtitle: "",
    maskAmounts: false,
    loading: false,
    error: "",
    storageKey: "",
  },
);

type ReturnRange = {
  hasRange: boolean;
  min: number;
  max: number;
};

function normalize(min: number, max: number, value: number): number {
  const denom = max - min;
  if (!Number.isFinite(denom) || denom === 0) {
    return 1;
  }
  return Math.max(0, Math.min(1, (value - min) / denom));
}

function colorForReturn(returnPct: number | null | undefined, range: ReturnRange): string {
  if (returnPct == null || !Number.isFinite(returnPct)) {
    return "hsl(215, 14%, 38%)";
  }
  if (returnPct === 0) {
    return "hsl(215, 14%, 38%)";
  }

  if (!range.hasRange) {
    return returnPct > 0 ? "hsl(145, 68%, 32%)" : "hsl(2, 70%, 36%)";
  }

  if (returnPct > 0) {
    const intensity =
      range.max <= 0 ? 0 : range.min >= 0 ? normalize(range.min, range.max, returnPct) : normalize(0, range.max, returnPct);
    const saturation = 52 + intensity * 34;
    const lightness = 44 - intensity * 16;
    return `hsl(145, ${saturation}%, ${lightness}%)`;
  }

  const intensity =
    range.min >= 0 ? 0 : range.max <= 0 ? 1 - normalize(range.min, range.max, returnPct) : 1 - normalize(range.min, 0, returnPct);
  const saturation = 54 + intensity * 32;
  const lightness = 46 - intensity * 16;
  return `hsl(2, ${saturation}%, ${lightness}%)`;
}

const returnRange = computed<ReturnRange>(() => {
  const values = props.items
    .map((item) => item.returnPct)
    .filter((value): value is number => value != null && Number.isFinite(value));
  if (values.length === 0) {
    return { hasRange: false, min: 0, max: 0 };
  }
  return {
    hasRange: true,
    min: Math.min(...values),
    max: Math.max(...values),
  };
});

const normalizedItems = computed(() =>
  props.items
    .filter((item) => Number.isFinite(item.value) && item.ratioPct > 0)
    .map((item) => ({
      ...item,
      backgroundColor: colorForReturn(item.returnPct, returnRange.value),
      weight: Math.max(1, Math.round(item.ratioPct * 100)),
    })),
);

const returnRangeLabel = computed(() => {
  if (!returnRange.value.hasRange) {
    return null;
  }
  return `${formatSignedPercent(returnRange.value.min)} ~ ${formatSignedPercent(returnRange.value.max)}`;
});

const expanded = ref(true);
const infoOpen = ref(false);
const topItem = computed(() => normalizedItems.value[0] ?? null);
const collapsedSummary = computed(() => {
  if (!topItem.value) return "No holdings allocation data.";
  return `Top block: ${topItem.value.label} ${formatPercent(topItem.value.ratioPct)}`;
});

function loadExpandedState(): void {
  if (typeof window === "undefined" || !props.storageKey) return;
  const raw = window.localStorage.getItem(props.storageKey);
  if (raw === "1") expanded.value = true;
  if (raw === "0") expanded.value = false;
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatPercent(value: number): string {
  return `${value.toFixed(2)}%`;
}

function formatSignedPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

watch(expanded, (value) => {
  if (typeof window === "undefined" || !props.storageKey) return;
  window.localStorage.setItem(props.storageKey, value ? "1" : "0");
});

onMounted(() => {
  loadExpandedState();
});
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-start justify-between gap-2">
      <div>
        <div class="flex items-center gap-2">
          <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
          <button
            type="button"
            class="inline-flex h-7 w-7 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :aria-pressed="infoOpen"
            :aria-label="infoOpen ? 'Hide treemap info' : 'Show treemap info'"
            @click="infoOpen = !infoOpen"
          >
            i
          </button>
        </div>
        <p v-if="subtitle" class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
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
      <p>Treemap blocks are sized by allocation ratio, so bigger blocks represent larger positions.</p>
      <p class="mt-1">Color represents return tone, which helps us spot large winners and laggards at a glance.</p>
    </div>

    <div v-if="expanded && loading" class="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      Loading...
    </div>
    <div v-else-if="expanded && error" class="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
      {{ error }}
    </div>
    <div
      v-else-if="expanded && normalizedItems.length === 0"
      class="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300"
    >
      No holdings allocation data.
    </div>
    <div
      v-else-if="!expanded"
      class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
    >
      <p class="font-medium text-slate-700 dark:text-slate-200">Collapsed. Click Expand to preview the latest treemap.</p>
      <p class="mt-1">{{ collapsedSummary }}</p>
      <p v-if="returnRangeLabel" class="mt-1">Return range: {{ returnRangeLabel }}</p>
    </div>
    <div v-else class="mt-4 space-y-3">
      <div class="flex min-h-[180px] flex-wrap gap-1.5 rounded-xl bg-slate-950/95 p-1.5">
        <div
          v-for="item in normalizedItems"
          :key="item.key"
          class="flex min-h-[64px] min-w-[110px] flex-col justify-between rounded-lg p-2 text-xs text-white"
          :style="{ flexGrow: item.weight, flexBasis: `${Math.max(18, item.ratioPct)}%`, backgroundColor: item.backgroundColor }"
        >
          <p class="truncate font-semibold">{{ item.label }}</p>
          <div class="text-[11px] text-white/90">
            <p>
              {{ formatPercent(item.ratioPct) }}
              <template v-if="item.returnPct != null">| {{ formatSignedPercent(item.returnPct) }}</template>
            </p>
            <p :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
              {{ formatCurrency(item.value, currency) }}
            </p>
          </div>
        </div>
      </div>
      <p class="text-[11px] text-slate-500 dark:text-slate-400">
        Treemap blocks are sized by allocation ratio. Color represents return (green gain, red loss).
      </p>
      <p v-if="returnRangeLabel" class="text-[11px] text-slate-500 dark:text-slate-400">
        Return range: {{ returnRangeLabel }}
      </p>
    </div>
  </article>
</template>


