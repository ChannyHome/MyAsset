<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import { getNetworthSeries, getSummary, type AnalyticsNetworthSeriesOut, type AnalyticsSummaryV2Out } from "../api/analytics";
import { getLiabilitiesTable, type LiabilityTableRowOut } from "../api/liabilities";
import { getPortfoliosTable, type PortfolioTableRowOut } from "../api/portfolios";
import KpiBreakdownCards from "../components/KpiBreakdownCards.vue";
import NetworthTrendCard from "../components/NetworthTrendCard.vue";
import { useDisplayCurrency } from "../composables/useDisplayCurrency";
import { formatDateTimeSeoul } from "../utils/datetime";

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatDateTime(value: string | null | undefined): string {
  return formatDateTimeSeoul(value);
}

const loading = ref(false);
const errorMessage = ref("");
const summary = ref<AnalyticsSummaryV2Out | null>(null);
const networthSeries = ref<AnalyticsNetworthSeriesOut | null>(null);
const portfolioRows = ref<PortfolioTableRowOut[]>([]);
const liabilityRows = ref<LiabilityTableRowOut[]>([]);
const { displayCurrency, ensureInitialized } = useDisplayCurrency();

const summaryDisplayCurrency = computed(() => summary.value?.display_currency ?? displayCurrency.value);
const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
const investedPrincipalTotal = computed(() => toNumber(summary.value?.invested_principal_total));
const principalMinusDebtTotal = computed(() =>
  toNumber(summary.value?.debt_adjusted_principal_total ?? summary.value?.principal_minus_debt_total),
);
const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
const netAssetsReturnPct = computed(() => toNumber(summary.value?.net_assets_return_pct ?? null));
const principalProfitTotal = computed(
  () => toNumber(summary.value?.principal_profit_total ?? grossAssetsTotal.value - investedPrincipalTotal.value),
);
const netAssetsProfitTotal = computed(
  () => toNumber(summary.value?.net_assets_profit_total ?? netAssetsTotal.value - principalMinusDebtTotal.value),
);
const asOf = computed(() => formatDateTime(summary.value?.as_of));

const trendPoints = computed(() =>
  (networthSeries.value?.points ?? []).map((point) => ({
    label: point.snapshot_date,
    gross: toNumber(point.gross_assets_total),
    liabilities: toNumber(point.liabilities_total),
    net: toNumber(point.net_assets_total),
  })),
);

async function loadReportData(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";
  try {
    const [summaryOut, seriesOut, portfoliosOut, liabilitiesOut] = await Promise.all([
      getSummary({ display_currency: displayCurrency.value }),
      getNetworthSeries({
        display_currency: displayCurrency.value,
        bucket: "DAY",
        limit: 90,
      }),
      getPortfoliosTable({
        page: 1,
        page_size: 200,
        sort_by: "gross_assets_total",
        sort_order: "desc",
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded: false,
      }),
      getLiabilitiesTable({
        page: 1,
        page_size: 200,
        sort_by: "outstanding_balance",
        sort_order: "desc",
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded: false,
      }),
    ]);

    summary.value = summaryOut;
    networthSeries.value = seriesOut;
    portfolioRows.value = portfoliosOut.items;
    liabilityRows.value = liabilitiesOut.items;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to load report data: ${message}`;
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  await ensureInitialized();
  await loadReportData();
});

watch(
  () => displayCurrency.value,
  (next, prev) => {
    if (summary.value && prev && next !== prev) {
      void loadReportData();
    }
  },
);
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">Report</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Asset Report (Core)</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            KPI breakdown + valuation snapshot trend connected to analytics APIs.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="loading"
            @click="loadReportData"
          >
            {{ loading ? "Loading..." : "Refresh" }}
          </button>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">as_of: {{ asOf }}</p>
    </header>

    <article
      v-if="errorMessage"
      class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
    >
      {{ errorMessage }}
    </article>

    <KpiBreakdownCards
      :display-currency="summaryDisplayCurrency"
      :gross-assets-total="grossAssetsTotal"
      :liabilities-total="liabilitiesTotal"
      :net-assets-total="netAssetsTotal"
      :invested-principal-total="investedPrincipalTotal"
      :principal-minus-debt-total="principalMinusDebtTotal"
      :principal-return-pct="principalReturnPct"
      :net-assets-return-pct="netAssetsReturnPct"
      :principal-profit-total="principalProfitTotal"
      :net-assets-profit-total="netAssetsProfitTotal"
      :portfolios="portfolioRows"
      :liabilities="liabilityRows"
    />

    <NetworthTrendCard
      title="Networth Trend"
      subtitle="Connected to valuation_snapshots (bucket=DAY)"
      :currency="summaryDisplayCurrency"
      :points="trendPoints"
      :loading="loading"
      :error="errorMessage"
    />

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Top Gainers (sample)</h2>
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
            <span>005930</span>
            <span class="font-semibold text-emerald-600">+0.77%</span>
          </li>
        </ul>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Top Losers (sample)</h2>
        <ul class="mt-3 space-y-2 text-sm">
          <li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>BTC</span>
            <span class="font-semibold text-rose-600">-2.10%</span>
          </li>
          <li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
            <span>TSLA</span>
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
