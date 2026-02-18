<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import { getSummary, type AnalyticsSummaryV2Out } from "../api/analytics";
import KpiBreakdownCards from "../components/KpiBreakdownCards.vue";
import DisplayCurrencyToggle from "../components/DisplayCurrencyToggle.vue";
import { getHoldingsPerformance, type HoldingPerformanceOut } from "../api/holdings";
import { getLiabilitiesTable, type LiabilityTableRowOut } from "../api/liabilities";
import { getPortfoliosTable, type PortfolioTableRowOut } from "../api/portfolios";
import { useDisplayCurrency } from "../composables/useDisplayCurrency";
import type { DisplayCurrency } from "../api/userSettings";
import { releaseNotes } from "../data/releaseNotes";

function toNumber(value: string | number | null | undefined): number {
  if (value == null) {
    return 0;
  }
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

function formatOptionalCurrency(value: string | number | null | undefined, currency = "KRW"): string {
  if (value == null) {
    return "-";
  }
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) {
    return "-";
  }
  return formatCurrency(num, currency);
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return "-";
  }
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return value;
  }
  return dt.toLocaleString("ko-KR");
}

const loading = ref(false);
const errorMessage = ref("");
const summary = ref<AnalyticsSummaryV2Out | null>(null);
const holdings = ref<HoldingPerformanceOut[]>([]);
const liabilities = ref<LiabilityTableRowOut[]>([]);
const portfolios = ref<PortfolioTableRowOut[]>([]);
const { displayCurrency, settingsSaving, ensureInitialized, setDisplayCurrency } = useDisplayCurrency();

const summaryDisplayCurrency = computed(() => summary.value?.display_currency ?? displayCurrency.value);
const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
const investedPrincipalTotal = computed(() => toNumber(summary.value?.invested_principal_total));
const principalMinusDebtTotal = computed(() => toNumber(summary.value?.principal_minus_debt_total));
const netAssetsReturnPct = computed(() => toNumber(summary.value?.net_assets_return_pct ?? null));
const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
const principalProfitTotal = computed(() => toNumber(summary.value?.principal_profit_total ?? grossAssetsTotal.value - investedPrincipalTotal.value));
const netAssetsProfitTotal = computed(() => toNumber(summary.value?.net_assets_profit_total ?? netAssetsTotal.value - principalMinusDebtTotal.value));
const asOf = computed(() => formatDateTime(summary.value?.as_of));

const topHoldings = computed(() =>
  [...holdings.value]
    .sort((a, b) => toNumber(b.evaluated_amount) - toNumber(a.evaluated_amount))
    .slice(0, 6),
);

const topPortfolios = computed(() =>
  [...portfolios.value]
    .sort((a, b) => toNumber(b.gross_assets_total) - toNumber(a.gross_assets_total))
    .slice(0, 6),
);

const topLiabilities = computed(() =>
  [...liabilities.value]
    .sort((a, b) => toNumber(b.outstanding_balance) - toNumber(a.outstanding_balance))
    .slice(0, 6),
);

const topPnlAssets = computed(() =>
  [...holdings.value]
    .filter((item) => item.pnl_pct != null)
    .sort((a, b) => toNumber(b.pnl_pct) - toNumber(a.pnl_pct))
    .slice(0, 3),
);

async function loadHomeData() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const [summaryOut, holdingsOut, liabilitiesOut, portfoliosOut] = await Promise.all([
      getSummary({ display_currency: displayCurrency.value }),
      getHoldingsPerformance({ display_currency: displayCurrency.value }),
      getLiabilitiesTable({
        page: 1,
        page_size: 200,
        sort_by: "outstanding_balance",
        sort_order: "desc",
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded: false,
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
    ]);

    summary.value = summaryOut;
    holdings.value = holdingsOut;
    liabilities.value = liabilitiesOut.items;
    portfolios.value = portfoliosOut.items;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to load dashboard data: ${message}`;
  } finally {
    loading.value = false;
  }
}

async function onChangeDisplayCurrency(value: DisplayCurrency) {
  try {
    await setDisplayCurrency(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to update display currency: ${message}`;
  }
}

onMounted(async () => {
  await ensureInitialized();
  await loadHomeData();
});

watch(
  () => displayCurrency.value,
  (next, prev) => {
    if (summary.value && prev && next !== prev) {
      void loadHomeData();
    }
  },
);
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Home</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Live Dashboard</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            This page now uses real API data from summary, holdings performance, and liabilities.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <DisplayCurrencyToggle
            :model-value="displayCurrency"
            :disabled="loading || settingsSaving"
            :loading="settingsSaving"
            @update:model-value="onChangeDisplayCurrency"
          />
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="loading"
            @click="loadHomeData"
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
      <p>{{ errorMessage }}</p>
      <button
        type="button"
        class="mt-2 rounded-lg border border-rose-300 px-3 py-1 text-xs font-semibold transition-colors hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/60"
        @click="loadHomeData"
      >
        Retry
      </button>
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
      :portfolios="portfolios"
      :liabilities="liabilities"
    />

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Top Portfolios</h2>
        <span class="text-xs text-slate-500 dark:text-slate-400">By gross assets</span>
      </div>
      <div
        v-if="topPortfolios.length === 0"
        class="rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
      >
        No portfolio data.
      </div>
      <ul v-else class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
        <li
          v-for="item in topPortfolios"
          :key="item.id"
          class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
        >
          <div class="flex items-center justify-between gap-2">
            <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
              {{ item.name }}
              <span class="text-xs font-normal text-slate-500">{{ item.type }}</span>
            </p>
            <p
              class="text-xs font-semibold"
              :class="item.total_return_pct == null ? 'text-slate-500' : toNumber(item.total_return_pct) >= 0 ? 'text-emerald-600' : 'text-rose-500'"
            >
              {{ formatPercent(item.total_return_pct == null ? null : toNumber(item.total_return_pct)) }}
            </p>
          </div>
          <div class="mt-1 text-xs text-slate-600 dark:text-slate-300">
            {{ formatCurrency(toNumber(item.gross_assets_total), item.base_currency || summaryDisplayCurrency) }}
            /
            {{ formatCurrency(toNumber(item.cumulative_deposit_amount), item.base_currency || summaryDisplayCurrency) }}
          </div>
          <div class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
            Net {{ formatCurrency(toNumber(item.net_assets_total), item.base_currency || summaryDisplayCurrency) }}
            ·
            PnL {{ formatSignedCurrency(toNumber(item.total_pnl_amount), item.base_currency || summaryDisplayCurrency) }}
          </div>
        </li>
      </ul>
    </article>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Top Holdings</h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">By evaluated amount</span>
        </div>
        <div v-if="topHoldings.length === 0" class="rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300">
          No holdings data.
        </div>
        <ul v-else class="space-y-2">
          <li
            v-for="item in topHoldings"
            :key="item.holding_id"
            class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
          >
            <div class="flex items-center justify-between gap-2">
              <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                {{ item.asset_name }}
                <span class="text-xs font-normal text-slate-500">{{ item.asset_symbol || "-" }}</span>
              </p>
              <p class="text-xs font-semibold" :class="toNumber(item.pnl_pct) >= 0 ? 'text-emerald-600' : 'text-rose-500'">
                {{ formatPercent(toNumber(item.pnl_pct)) }}
              </p>
            </div>
            <div class="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {{ formatOptionalCurrency(item.current_price, item.current_price_currency || summaryDisplayCurrency) }}
              /
              {{ formatOptionalCurrency(item.avg_price, item.current_price_currency || summaryDisplayCurrency) }}
              
            </div>
          </li>
        </ul>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Top Liabilities</h2>
          <span class="text-xs text-slate-500 dark:text-slate-400">By outstanding balance</span>
        </div>
        <div
          v-if="topLiabilities.length === 0"
          class="rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
        >
          No liabilities data.
        </div>
        <ul v-else class="space-y-2">
          <li
            v-for="item in topLiabilities"
            :key="item.id"
            class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
          >
            <div class="flex items-center justify-between gap-2">
              <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{{ item.name }}</p>
              <p class="text-xs text-slate-500">{{ item.liability_type }}</p>
            </div>
            <div class="mt-1 text-xs text-slate-600 dark:text-slate-300">
              {{ formatCurrency(toNumber(item.outstanding_balance), item.currency || summaryDisplayCurrency) }}
            </div>
          </li>
        </ul>
      </article>
    </div>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Quick Insight</h2>
      <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        <li class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          Scope: {{ summary?.scope_type || "-" }} (users: {{ summary?.user_count || 0 }})
        </li>
        <li class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          Best PnL assets: {{ topPnlAssets.map((item) => item.asset_symbol || item.asset_name).join(", ") || "-" }}
        </li>
      </ul>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Release Notes</h2>
        <span class="text-xs text-slate-500 dark:text-slate-400">Latest first</span>
      </div>
      <ul class="space-y-2">
        <li
          v-for="note in releaseNotes"
          :key="note.id"
          class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
        >
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(note.releasedAt) }}</p>
          <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ note.title }}</p>
          <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">{{ note.summary }}</p>
        </li>
      </ul>
    </article>
  </section>
</template>

