<script setup lang="ts">
import { computed, ref } from "vue";

import type { LiabilityTableRowOut } from "../api/liabilities";
import type { PortfolioTableRowOut } from "../api/portfolios";

const props = defineProps<{
  displayCurrency: string;
  grossAssetsTotal: number;
  liabilitiesTotal: number;
  netAssetsTotal: number;
  investedPrincipalTotal: number;
  principalMinusDebtTotal: number;
  principalReturnPct: number | null;
  netAssetsReturnPct: number | null;
  principalProfitTotal: number;
  netAssetsProfitTotal: number;
  portfolios: PortfolioTableRowOut[];
  liabilities: LiabilityTableRowOut[];
}>();

const grossCollapsed = ref(true);
const liabilitiesCollapsed = ref(true);
const netCollapsed = ref(true);

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : 0;
}

function toOptionalNumber(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
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

function signedValueClass(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return "text-slate-500 dark:text-slate-400";
  }
  return value >= 0 ? "text-emerald-600" : "text-rose-500";
}

const grossPortfolioRows = computed(() =>
  [...props.portfolios].sort((a, b) => toNumber(b.gross_assets_total) - toNumber(a.gross_assets_total)),
);

const netPortfolioRows = computed(() =>
  [...props.portfolios].sort((a, b) => toNumber(b.net_assets_total) - toNumber(a.net_assets_total)),
);

const sortedLiabilityRows = computed(() =>
  [...props.liabilities].sort((a, b) => toNumber(b.outstanding_balance) - toNumber(a.outstanding_balance)),
);
</script>

<template>
  <div class="grid grid-cols-1 gap-4 xl:grid-cols-3">
    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-2">
        <p class="text-xs text-slate-500 dark:text-slate-400">Gross Assets (owned assets only)</p>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="grossCollapsed = !grossCollapsed"
        >
          {{ grossCollapsed ? "Expand" : "Collapse" }}
        </button>
      </div>
      <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {{ formatCurrency(grossAssetsTotal, displayCurrency) }}
        <span class="text-base font-semibold" :class="(principalReturnPct ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-500'">
          ({{ formatPercent(principalReturnPct) }}, {{ formatSignedCurrency(principalProfitTotal, displayCurrency) }})
        </span>
      </p>
      <p class="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        vs invested principal ({{ formatCurrency(investedPrincipalTotal, displayCurrency) }})
      </p>

      <div v-if="!grossCollapsed" class="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
        <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">Sorted by Current (desc)</p>
        <div v-if="grossPortfolioRows.length === 0" class="text-sm text-slate-500 dark:text-slate-400">No portfolio data.</div>
        <div v-else class="max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table class="min-w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th class="px-3 py-2">Portfolio</th>
                <th class="px-3 py-2 text-right">Current</th>
                <th class="px-3 py-2 text-right">Principal</th>
                <th class="px-3 py-2 text-right">Profit</th>
                <th class="px-3 py-2 text-right">Return</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in grossPortfolioRows" :key="`gross-${row.id}`" class="border-t border-slate-200 dark:border-slate-800">
                <td class="px-3 py-2">
                  <p class="font-semibold text-slate-900 dark:text-slate-100">{{ row.name }}</p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ row.type }}</p>
                </td>
                <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {{ formatCurrency(toNumber(row.gross_assets_total), row.base_currency || displayCurrency) }}
                </td>
                <td class="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                  {{ formatCurrency(toNumber(row.cumulative_deposit_amount), row.base_currency || displayCurrency) }}
                </td>
                <td class="px-3 py-2 text-right font-semibold" :class="signedValueClass(toNumber(row.total_pnl_amount))">
                  {{ formatSignedCurrency(toNumber(row.total_pnl_amount), row.base_currency || displayCurrency) }}
                </td>
                <td class="px-3 py-2 text-right font-semibold" :class="signedValueClass(toOptionalNumber(row.total_return_pct))">
                  {{ formatPercent(toOptionalNumber(row.total_return_pct)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-2">
        <p class="text-xs text-slate-500 dark:text-slate-400">Liabilities</p>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="liabilitiesCollapsed = !liabilitiesCollapsed"
        >
          {{ liabilitiesCollapsed ? "Expand" : "Collapse" }}
        </button>
      </div>
      <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {{ formatCurrency(liabilitiesTotal, displayCurrency) }}
      </p>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">Included liabilities only</p>

      <div v-if="!liabilitiesCollapsed" class="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
        <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">Sorted by Balance (desc)</p>
        <div v-if="sortedLiabilityRows.length === 0" class="text-sm text-slate-500 dark:text-slate-400">No liabilities data.</div>
        <div v-else class="max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table class="min-w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th class="px-3 py-2">Liability</th>
                <th class="px-3 py-2">Type</th>
                <th class="px-3 py-2">Portfolio</th>
                <th class="px-3 py-2 text-right">Balance</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in sortedLiabilityRows" :key="`liability-${row.id}`" class="border-t border-slate-200 dark:border-slate-800">
                <td class="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">{{ row.name }}</td>
                <td class="px-3 py-2 text-slate-700 dark:text-slate-300">{{ row.liability_type }}</td>
                <td class="px-3 py-2 text-slate-700 dark:text-slate-300">{{ row.portfolio_name || "-" }}</td>
                <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {{ formatCurrency(toNumber(row.outstanding_balance), row.currency || displayCurrency) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-2">
        <p class="text-xs text-slate-500 dark:text-slate-400">Net Assets (assets - liabilities)</p>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="netCollapsed = !netCollapsed"
        >
          {{ netCollapsed ? "Expand" : "Collapse" }}
        </button>
      </div>
      <p class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">
        {{ formatCurrency(netAssetsTotal, displayCurrency) }}
        <span class="text-base font-semibold" :class="(netAssetsReturnPct ?? 0) >= 0 ? 'text-emerald-600' : 'text-rose-500'">
          ({{ formatPercent(netAssetsReturnPct) }}, {{ formatSignedCurrency(netAssetsProfitTotal, displayCurrency) }})
        </span>
      </p>
      <p class="mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        vs principal - debt ({{ formatCurrency(principalMinusDebtTotal, displayCurrency) }})
      </p>

      <div v-if="!netCollapsed" class="mt-4 border-t border-slate-200 pt-3 dark:border-slate-700">
        <p class="mb-2 text-xs text-slate-500 dark:text-slate-400">Sorted by Net Current (desc)</p>
        <div v-if="netPortfolioRows.length === 0" class="text-sm text-slate-500 dark:text-slate-400">No portfolio data.</div>
        <div v-else class="max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table class="min-w-full text-left text-xs">
            <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <tr>
                <th class="px-3 py-2">Portfolio</th>
                <th class="px-3 py-2 text-right">Net Current</th>
                <th class="px-3 py-2 text-right">Net Principal</th>
                <th class="px-3 py-2 text-right">Profit</th>
                <th class="px-3 py-2 text-right">Return</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in netPortfolioRows" :key="`net-${row.id}`" class="border-t border-slate-200 dark:border-slate-800">
                <td class="px-3 py-2">
                  <p class="font-semibold text-slate-900 dark:text-slate-100">{{ row.name }}</p>
                  <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ row.type }}</p>
                </td>
                <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">
                  {{ formatCurrency(toNumber(row.net_assets_total), row.base_currency || displayCurrency) }}
                </td>
                <td class="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                  {{ formatCurrency(toNumber(row.principal_minus_debt_total), row.base_currency || displayCurrency) }}
                </td>
                <td class="px-3 py-2 text-right font-semibold" :class="signedValueClass(toNumber(row.net_assets_profit_total))">
                  {{ formatSignedCurrency(toNumber(row.net_assets_profit_total), row.base_currency || displayCurrency) }}
                </td>
                <td class="px-3 py-2 text-right font-semibold" :class="signedValueClass(toOptionalNumber(row.net_assets_return_pct))">
                  {{ formatPercent(toOptionalNumber(row.net_assets_return_pct)) }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </article>
  </div>
</template>
