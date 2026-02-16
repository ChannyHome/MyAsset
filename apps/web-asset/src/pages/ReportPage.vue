<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { getSummary, type AnalyticsSummaryV2Out } from "../api/analytics";

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(value: number, currency = "KRW"): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedCurrency(value: number, currency = "KRW"): string {
  const absText = formatCurrency(Math.abs(value), currency);
  if (value > 0) return `+${absText}`;
  if (value < 0) return `-${absText}`;
  return absText;
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString("ko-KR");
}

const loading = ref(false);
const errorMessage = ref("");
const summary = ref<AnalyticsSummaryV2Out | null>(null);

const displayCurrency = computed(() => summary.value?.display_currency ?? "KRW");
const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
const investedPrincipalTotal = computed(() => toNumber(summary.value?.invested_principal_total));
const principalMinusDebtTotal = computed(() => toNumber(summary.value?.principal_minus_debt_total));
const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
const netAssetsReturnPct = computed(() => toNumber(summary.value?.net_assets_return_pct ?? null));
const principalProfitTotal = computed(
  () => toNumber(summary.value?.principal_profit_total ?? grossAssetsTotal.value - investedPrincipalTotal.value),
);
const netAssetsProfitTotal = computed(
  () => toNumber(summary.value?.net_assets_profit_total ?? netAssetsTotal.value - principalMinusDebtTotal.value),
);
const asOf = computed(() => formatDateTime(summary.value?.as_of));

async function loadReportData(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";
  try {
    summary.value = await getSummary();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to load report data: ${message}`;
  } finally {
    loading.value = false;
  }
}

onMounted(loadReportData);
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Report</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">자산 분석 (기본)</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Home과 동일한 기준으로 Gross/Net/부채 및 수익률을 요약 표시합니다.
          </p>
        </div>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :disabled="loading"
          @click="loadReportData"
        >
          {{ loading ? "Loading..." : "Refresh" }}
        </button>
      </div>
      <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">as_of: {{ asOf }}</p>
    </header>

    <article
      v-if="errorMessage"
      class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
    >
      {{ errorMessage }}
    </article>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs text-slate-500 dark:text-slate-400">Gross Assets (owned assets only)</p>
        <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {{ formatCurrency(grossAssetsTotal, displayCurrency) }}
          <span class="text-base font-semibold" :class="principalReturnPct >= 0 ? 'text-emerald-600' : 'text-rose-500'">
            ({{ formatPercent(principalReturnPct) }}, {{ formatSignedCurrency(principalProfitTotal, displayCurrency) }})
          </span>
        </p>
        <p class="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          vs invested principal ({{ formatCurrency(investedPrincipalTotal, displayCurrency) }})
        </p>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs text-slate-500 dark:text-slate-400">Net Assets (assets - liabilities)</p>
        <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {{ formatCurrency(netAssetsTotal, displayCurrency) }}
          <span class="text-base font-semibold" :class="netAssetsReturnPct >= 0 ? 'text-emerald-600' : 'text-rose-500'">
            ({{ formatPercent(netAssetsReturnPct) }}, {{ formatSignedCurrency(netAssetsProfitTotal, displayCurrency) }})
          </span>
        </p>
        <p class="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
          vs principal - debt ({{ formatCurrency(principalMinusDebtTotal, displayCurrency) }})
        </p>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs text-slate-500 dark:text-slate-400">Liabilities</p>
        <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {{ formatCurrency(liabilitiesTotal, displayCurrency) }}
        </p>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Included liabilities only</p>
      </article>
    </div>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">상승률 상위</h2>
        <ul class="mt-3 space-y-2 text-sm">
          <li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>NVDA</span>
            <span class="font-semibold text-emerald-600">+3.82%</span>
          </li>
          <li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>SCHD</span>
            <span class="font-semibold text-emerald-600">+1.11%</span>
          </li>
          <li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>삼성전자</span>
            <span class="font-semibold text-emerald-600">+0.77%</span>
          </li>
        </ul>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">하락률 상위</h2>
        <ul class="mt-3 space-y-2 text-sm">
          <li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>BTC</span>
            <span class="font-semibold text-rose-600">-2.10%</span>
          </li>
          <li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>하이닉스</span>
            <span class="font-semibold text-rose-600">-1.43%</span>
          </li>
          <li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>QQQ</span>
            <span class="font-semibold text-rose-600">-0.56%</span>
          </li>
        </ul>
      </article>
    </div>
  </section>
</template>
