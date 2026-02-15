<script setup lang="ts">
import { computed, onMounted, ref } from "vue";

import { getSummary, type AnalyticsSummaryV2Out } from "../api/analytics";
import { getHoldingsPerformance, type HoldingPerformanceOut } from "../api/holdings";
import { getLiabilities, type LiabilityOut } from "../api/liabilities";

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
const liabilities = ref<LiabilityOut[]>([]);

const displayCurrency = computed(() => summary.value?.display_currency ?? "KRW");
const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
const grossAssetsReturnPct = computed(() => toNumber(summary.value?.gross_assets_return_pct ?? null));
const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
const asOf = computed(() => formatDateTime(summary.value?.as_of));

const topHoldings = computed(() =>
  [...holdings.value]
    .sort((a, b) => toNumber(b.evaluated_amount) - toNumber(a.evaluated_amount))
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
    const [summaryOut, holdingsOut, liabilitiesOut] = await Promise.all([
      getSummary(),
      getHoldingsPerformance(),
      getLiabilities(),
    ]);

    summary.value = summaryOut;
    holdings.value = holdingsOut;
    liabilities.value = liabilitiesOut;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to load dashboard data: ${message}`;
  } finally {
    loading.value = false;
  }
}

onMounted(loadHomeData);
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
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :disabled="loading"
          @click="loadHomeData"
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
      <p>{{ errorMessage }}</p>
      <button
        type="button"
        class="mt-2 rounded-lg border border-rose-300 px-3 py-1 text-xs font-semibold transition-colors hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/60"
        @click="loadHomeData"
      >
        Retry
      </button>
    </article>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs text-slate-500 dark:text-slate-400">Gross Assets (assets + liabilities)</p>
        <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {{ formatCurrency(grossAssetsTotal, displayCurrency) }}
        </p>
        <p class="mt-2 text-sm font-semibold" :class="grossAssetsReturnPct >= 0 ? 'text-emerald-600' : 'text-rose-500'">
          {{ formatPercent(grossAssetsReturnPct) }} vs principal + debt
        </p>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p class="text-xs text-slate-500 dark:text-slate-400">Net Assets</p>
        <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
          {{ formatCurrency(netAssetsTotal, displayCurrency) }}
        </p>
        <p class="mt-2 text-sm font-semibold" :class="principalReturnPct >= 0 ? 'text-emerald-600' : 'text-rose-500'">
          {{ formatPercent(principalReturnPct) }} vs invested principal
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
              {{ formatCurrency(toNumber(item.evaluated_amount), displayCurrency) }}
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
              {{ formatCurrency(toNumber(item.outstanding_balance), item.currency || displayCurrency) }}
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
  </section>
</template>

