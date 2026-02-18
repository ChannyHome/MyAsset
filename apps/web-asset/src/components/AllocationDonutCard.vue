<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

type AllocationItem = {
  key: string;
  label: string;
  value: number;
  ratioPct: number;
};

type DonutStartPosition = "TOP" | "RIGHT" | "LEFT";

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    currency: string;
    total: number;
    items: AllocationItem[];
    startPosition?: DonutStartPosition;
    loading?: boolean;
    error?: string;
  }>(),
  {
    subtitle: "",
    startPosition: "TOP",
    loading: false,
    error: "",
  },
);

const palette = [
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#8b5cf6",
  "#ef4444",
  "#14b8a6",
  "#ec4899",
  "#a3e635",
  "#f97316",
  "#6366f1",
];

const normalizedItems = computed(() =>
  props.items
    .filter((item) => Number.isFinite(item.value) && item.ratioPct > 0)
    .map((item, index) => ({
      ...item,
      color: palette[index % palette.length],
    })),
);

const viewportWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1280);

function updateViewportWidth() {
  viewportWidth.value = window.innerWidth;
}

onMounted(() => {
  window.addEventListener("resize", updateViewportWidth, { passive: true });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", updateViewportWidth);
});

const listScrollThreshold = computed(() => {
  if (viewportWidth.value >= 1536) return 16;
  if (viewportWidth.value >= 1280) return 14;
  if (viewportWidth.value >= 1024) return 12;
  if (viewportWidth.value >= 768) return 10;
  return 8;
});

const shouldEnableListScroll = computed(() => normalizedItems.value.length > listScrollThreshold.value);

const startAngle = computed(() => {
  if (props.startPosition === "RIGHT") return 90;
  if (props.startPosition === "LEFT") return 270;
  return 0;
});

const donutExportStops = computed(() =>
  normalizedItems.value
    .map((item) => `${Math.max(0, Math.min(100, item.ratioPct)).toFixed(6)}:${item.color}`)
    .join("|"),
);

const donutStyle = computed(() => {
  if (normalizedItems.value.length === 0) {
    return { background: "conic-gradient(#334155 0% 100%)" };
  }

  let cursor = 0;
  const stops = normalizedItems.value
    .map((item) => {
      const ratio = Math.max(0, Math.min(100, item.ratioPct));
      const start = cursor;
      const end = Math.min(100, cursor + ratio);
      cursor = end;
      return `${item.color} ${start.toFixed(3)}% ${end.toFixed(3)}%`;
    })
    .join(", ");

  return { background: `conic-gradient(from ${startAngle.value}deg, ${stops})` };
});

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
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex items-start justify-between gap-2">
      <div>
        <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h3>
        <p v-if="subtitle" class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
      </div>
      <span class="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">
        {{ currency }}
      </span>
    </div>

    <div v-if="loading" class="mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
      Loading...
    </div>
    <div v-else-if="error" class="mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
      {{ error }}
    </div>
    <div v-else class="mt-4 grid min-h-[180px] grid-cols-[192px_minmax(0,1fr)] items-start gap-3">
      <div class="relative mx-auto h-[12rem] w-[12rem]">
        <div
          class="absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(15,23,42,0.2)]"
          :style="donutStyle"
          data-export-donut="1"
          :data-donut-stops="donutExportStops"
          :data-donut-start-angle="String(startAngle)"
        />
        <div
          class="absolute left-1/2 top-1/2 flex h-[6rem] w-[6rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white px-1 text-center text-[12px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
        >
          <span>{{ formatCurrency(total, currency) }}</span>
        </div>
      </div>

      <ul
        class="space-y-1 pr-1"
        :class="
          shouldEnableListScroll
            ? 'max-h-[10rem] overflow-y-auto md:max-h-[11rem] lg:max-h-[12rem] xl:max-h-[13rem]'
            : ''
        "
      >
        <li
          v-for="item in normalizedItems"
          :key="item.key"
          class="flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2 py-1 text-xs dark:bg-slate-800"
        >
          <span class="flex min-w-0 items-center gap-2">
            <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: item.color }" />
            <span class="truncate text-slate-700 dark:text-slate-200">{{ item.label }}</span>
          </span>
          <span class="shrink-0 font-semibold text-slate-700 dark:text-slate-200">
            {{ formatPercent(item.ratioPct) }}
          </span>
        </li>
        <li
          v-if="normalizedItems.length === 0"
          class="rounded-lg bg-slate-50 px-2 py-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
        >
          No allocation data.
        </li>
      </ul>
    </div>
  </article>
</template>
