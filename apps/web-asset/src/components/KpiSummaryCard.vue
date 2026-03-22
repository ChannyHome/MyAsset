<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

type NullableNumber = number | null | undefined;

const props = withDefaults(
  defineProps<{
    currency: string;
    grossAssetsTotal: number;
    liabilitiesTotal: number;
    netAssetsTotal: number;
    investedPrincipalTotal: number;
    principalMinusDebtTotal: number;
    grossReturnPct?: NullableNumber;
    netReturnPct?: NullableNumber;
    grossProfitTotal: number;
    netProfitTotal: number;
    asOf?: string;
    title?: string;
    subtitle?: string;
    maskAmounts?: boolean;
    storageKey?: string;
  }>(),
  {
    grossReturnPct: null,
    netReturnPct: null,
    asOf: "",
    title: "KPI Summary",
    subtitle: "",
    maskAmounts: false,
    storageKey: "",
  },
);

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedCurrency(value: number, currency: string): string {
  const abs = formatCurrency(Math.abs(value), currency);
  if (value > 0) return `+${abs}`;
  if (value < 0) return `-${abs}`;
  return abs;
}

function formatSignedPercent(value: NullableNumber): string {
  if (value == null || !Number.isFinite(value)) return "-";
  const num = Number(value);
  return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
}

function toneClass(value: NullableNumber): string {
  if (value == null || !Number.isFinite(value)) return "text-slate-400";
  if (value > 0) return "text-emerald-400";
  if (value < 0) return "text-rose-400";
  return "text-slate-300";
}

const expanded = ref(true);
const infoOpen = ref(false);

const collapsedSummary = computed(
  () => `Gross ${formatCurrency(props.grossAssetsTotal, props.currency)} · Net ${formatCurrency(props.netAssetsTotal, props.currency)}`,
);

function loadExpandedState(): void {
  if (typeof window === "undefined" || !props.storageKey) return;
  const raw = window.localStorage.getItem(props.storageKey);
  if (raw === "1") expanded.value = true;
  if (raw === "0") expanded.value = false;
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
            :aria-label="infoOpen ? 'Hide KPI Summary info' : 'Show KPI Summary info'"
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
      <p>KPI Summary shows the latest Gross, Liabilities, and Net totals for the current scope.</p>
      <p class="mt-1">Gross is compared to invested principal, and Net is compared to debt-adjusted principal.</p>
    </div>

    <div
      v-if="!expanded"
      class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
    >
      <p class="font-medium text-slate-700 dark:text-slate-200">Collapsed. Click Expand to preview the latest KPI summary.</p>
      <p class="mt-1" :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">{{ collapsedSummary }}</p>
    </div>

    <div v-else class="mt-4 space-y-3 text-sm">
      <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
        <p class="font-semibold text-slate-800 dark:text-slate-100">
          Gross:
          <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
            {{ formatCurrency(grossAssetsTotal, currency) }}
          </span>
          <span :class="toneClass(grossReturnPct)">
            (
            {{ formatSignedPercent(grossReturnPct) }},
            <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
              {{ formatSignedCurrency(grossProfitTotal, currency) }}
            </span>
            )
          </span>
        </p>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          vs invested principal
          <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
            ({{ formatCurrency(investedPrincipalTotal, currency) }})
          </span>
        </p>
      </div>

      <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
        <p class="font-semibold text-slate-800 dark:text-slate-100">
          Liabilities:
          <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
            {{ formatCurrency(liabilitiesTotal, currency) }}
          </span>
        </p>
      </div>

      <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
        <p class="font-semibold text-slate-800 dark:text-slate-100">
          Net:
          <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
            {{ formatCurrency(netAssetsTotal, currency) }}
          </span>
          <span :class="toneClass(netReturnPct)">
            (
            {{ formatSignedPercent(netReturnPct) }},
            <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
              {{ formatSignedCurrency(netProfitTotal, currency) }}
            </span>
            )
          </span>
        </p>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          vs debt-adjusted principal
          <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
            ({{ formatCurrency(principalMinusDebtTotal, currency) }})
          </span>
        </p>
      </div>
    </div>

    <p v-if="asOf" class="mt-3 text-[11px] text-slate-500 dark:text-slate-400">as_of: {{ asOf }}</p>
  </article>
</template>
