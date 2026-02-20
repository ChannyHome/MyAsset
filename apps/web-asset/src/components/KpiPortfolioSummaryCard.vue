<script setup lang="ts">
import { computed, onMounted } from "vue";
import { storeToRefs } from "pinia";

import type { PortfolioTableRowOut } from "../api/portfolios";
import { useUiStore } from "../stores/ui";

const props = withDefaults(
  defineProps<{
    currency: string;
    portfolios: PortfolioTableRowOut[];
    maskAmounts?: boolean;
    title?: string;
    subtitle?: string;
  }>(),
  {
    maskAmounts: false,
    title: "KPI Portfolios",
    subtitle: "",
  },
);

const uiStore = useUiStore();
const { nameClampEnabled } = storeToRefs(uiStore);

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatSignedCurrency(value: number, currency: string): string {
  const absText = formatCurrency(Math.abs(value), currency);
  if (value > 0) return `+${absText}`;
  if (value < 0) return `-${absText}`;
  return absText;
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function signedClass(value: number): string {
  if (value >= 0) return "text-emerald-500 dark:text-emerald-400";
  return "text-rose-500 dark:text-rose-400";
}

function netContribution(row: PortfolioTableRowOut): number {
  const explicitNet = row.net_contribution_total;
  if (explicitNet != null) {
    return toNumber(explicitNet);
  }
  return toNumber(row.cumulative_deposit_amount) - toNumber(row.cumulative_withdrawal_amount);
}

const rows = computed(() =>
  [...props.portfolios].sort((a, b) => Number(a.id) - Number(b.id)),
);

onMounted(() => {
  if (typeof uiStore.init === "function") {
    uiStore.init();
  }
});
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

    <div
      v-if="rows.length === 0"
      class="mt-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
    >
      No portfolio KPI data.
    </div>

    <div v-else class="mt-3 max-h-[24rem] overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
      <table class="min-w-[860px] text-left text-xs">
        <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          <tr>
            <th
              class="sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 dark:bg-slate-800"
            >
              Portfolio
            </th>
            <th class="px-3 py-2 text-right">Current Value</th>
            <th class="px-3 py-2 text-right">Principal</th>
            <th class="px-3 py-2 text-right">Profit</th>
            <th class="px-3 py-2 text-right">Return</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.id" class="border-t border-slate-200 dark:border-slate-800">
            <td
              class="sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900"
            >
              <p
                :title="`#${row.id} ${row.name}`"
                class="font-semibold text-slate-900 dark:text-slate-100"
                :class="nameClampEnabled ? 'name-clamp-2' : undefined"
              >
                #{{ row.id }} {{ row.name }}
              </p>
              <p :title="row.type" class="text-[11px] text-slate-500 dark:text-slate-400">{{ row.type }}</p>
            </td>
            <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">
              <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
                {{ formatCurrency(toNumber(row.gross_assets_total), row.base_currency || currency) }}
              </span>
            </td>
            <td class="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
              <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
                {{ formatCurrency(netContribution(row), row.base_currency || currency) }}
              </span>
            </td>
            <td
              class="px-3 py-2 text-right font-semibold"
              :class="signedClass(toNumber(row.portfolio_profit_total ?? row.total_pnl_amount))"
            >
              <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
                {{ formatSignedCurrency(toNumber(row.portfolio_profit_total ?? row.total_pnl_amount), row.base_currency || currency) }}
              </span>
            </td>
            <td class="px-3 py-2 text-right font-semibold" :class="signedClass(toNumber(row.total_return_pct ?? 0))">
              {{ formatPercent(toNumber(row.total_return_pct ?? null)) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
