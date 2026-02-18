<script setup lang="ts">
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
  }>(),
  {
    grossReturnPct: null,
    netReturnPct: null,
    asOf: "",
    title: "KPI Summary",
    subtitle: "",
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

    <div class="mt-4 space-y-3 text-sm">
      <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
        <p class="font-semibold text-slate-800 dark:text-slate-100">
          Gross:
          {{ formatCurrency(grossAssetsTotal, currency) }}
          <span :class="toneClass(grossReturnPct)">({{ formatSignedPercent(grossReturnPct) }}, {{ formatSignedCurrency(grossProfitTotal, currency) }})</span>
        </p>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          vs invested principal ({{ formatCurrency(investedPrincipalTotal, currency) }})
        </p>
      </div>

      <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
        <p class="font-semibold text-slate-800 dark:text-slate-100">
          Liabilities:
          {{ formatCurrency(liabilitiesTotal, currency) }}
        </p>
      </div>

      <div class="rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800">
        <p class="font-semibold text-slate-800 dark:text-slate-100">
          Net:
          {{ formatCurrency(netAssetsTotal, currency) }}
          <span :class="toneClass(netReturnPct)">({{ formatSignedPercent(netReturnPct) }}, {{ formatSignedCurrency(netProfitTotal, currency) }})</span>
        </p>
        <p class="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
          vs principal - debt ({{ formatCurrency(principalMinusDebtTotal, currency) }})
        </p>
      </div>
    </div>

    <p v-if="asOf" class="mt-3 text-[11px] text-slate-500 dark:text-slate-400">as_of: {{ asOf }}</p>
  </article>
</template>

