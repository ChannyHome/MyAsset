<script setup lang="ts">
import { computed } from "vue";

import type { PortfolioOption, PortfolioStatusRow, SortOrder } from "./statusTableTypes";

const props = withDefaults(
  defineProps<{
    title: string;
    subtitle: string;
    expanded: boolean;
    loading: boolean;
    rows: PortfolioStatusRow[];
    total: number;
    page: number;
    pageSize: number;
    sortBy: string;
    sortOrder: SortOrder;
    currency: string;
    maskAmounts: boolean;
    showFilter?: boolean;
    portfolioKey?: string;
    portfolioOptions?: PortfolioOption[];
  }>(),
  {
    showFilter: false,
    portfolioKey: "ALL",
    portfolioOptions: () => [],
  },
);

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "sort", key: string): void;
  (e: "set-page", page: number): void;
  (e: "select-all"): void;
  (e: "set-portfolio-key", key: string): void;
}>();

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: (currency || "KRW").toUpperCase(),
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function sortMark(key: string): string {
  if (props.sortBy !== key) return "↕";
  return props.sortOrder === "asc" ? "↑" : "↓";
}

const maxPage = computed(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
const maskStyle = computed(() => (props.maskAmounts ? { filter: "blur(6px)" } : undefined));
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
      </div>
      <div class="flex flex-wrap items-center gap-2 text-xs">
        <label v-if="showFilter && expanded" class="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
          <input
            type="checkbox"
            :checked="portfolioKey === 'ALL'"
            class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            @change="emit('select-all')"
          />
          <span>All</span>
        </label>
        <select
          v-if="showFilter && expanded"
          :value="portfolioKey"
          class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          @change="emit('set-portfolio-key', ($event.target as HTMLSelectElement).value)"
        >
          <option value="ALL">All portfolios</option>
          <option v-for="item in portfolioOptions" :key="`table-portfolio-${item.key}`" :value="item.key">
            {{ item.label }}
          </option>
        </select>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="emit('toggle')"
        >
          {{ expanded ? "Collapse" : "Expand" }}
        </button>
      </div>
    </div>

    <template v-if="expanded">
      <div class="mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table class="min-w-[880px] text-xs">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'portfolio')">
                  Portfolio {{ sortMark("portfolio") }}
                </button>
              </th>
              <th class="px-3 py-2 text-right">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'current')">
                  Current {{ sortMark("current") }}
                </button>
              </th>
              <th class="px-3 py-2 text-right">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'invested_principal')">
                  Invested {{ sortMark("invested_principal") }}
                </button>
              </th>
              <th class="px-3 py-2 text-right">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'portfolio_profit')">
                  Profit {{ sortMark("portfolio_profit") }}
                </button>
              </th>
              <th class="px-3 py-2 text-right">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'return')">
                  Return {{ sortMark("return") }}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">Loading portfolios...</td>
            </tr>
            <tr v-else-if="rows.length === 0">
              <td colspan="5" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">No portfolio rows.</td>
            </tr>
            <tr v-for="row in rows" :key="`p-${row.id}`" class="border-t border-slate-200 dark:border-slate-800">
              <td class="sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900">
                <p class="font-semibold text-slate-900 dark:text-slate-100">{{ row.name }}</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ row.type || "-" }}</p>
              </td>
              <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100">
                <span :style="maskStyle">{{ formatCurrency(row.current, currency) }}</span>
              </td>
              <td class="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
                <span :style="maskStyle">{{ formatCurrency(row.invested, currency) }}</span>
              </td>
              <td class="px-3 py-2 text-right font-semibold" :class="row.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                <span :style="maskStyle">{{ row.profit >= 0 ? "+" : "" }}{{ formatCurrency(row.profit, currency) }}</span>
              </td>
              <td class="px-3 py-2 text-right font-semibold" :class="(row.returnPct ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                {{ formatPercent(row.returnPct) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <p>Total: {{ total }}</p>
        <div class="inline-flex items-center gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="page <= 1"
            @click="emit('set-page', page - 1)"
          >
            Prev
          </button>
          <span>Page {{ page }} / {{ maxPage }}</span>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="page >= maxPage"
            @click="emit('set-page', page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </template>
    <p v-else class="mt-3 text-sm text-slate-500 dark:text-slate-400">Collapsed. Click Expand to open Portfolios Table.</p>
  </article>
</template>

