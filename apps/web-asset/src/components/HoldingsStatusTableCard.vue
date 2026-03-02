<script setup lang="ts">
import { computed } from "vue";

import type { HoldingStatusRow, SortOrder } from "./statusTableTypes";

const props = defineProps<{
  title: string;
  subtitle: string;
  expanded: boolean;
  loading: boolean;
  rows: HoldingStatusRow[];
  total: number;
  page: number;
  pageSize: number;
  sortBy: string;
  sortOrder: SortOrder;
  searchTerm: string;
  maskAmounts: boolean;
  displayCurrency: string;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "sort", key: string): void;
  (e: "set-page", page: number): void;
  (e: "update:search-term", value: string): void;
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
      <div class="flex flex-wrap items-center gap-2">
        <input
          v-if="expanded"
          :value="searchTerm"
          type="text"
          placeholder="Search holdings..."
          class="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-400/60 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          @input="emit('update:search-term', ($event.target as HTMLInputElement).value)"
        />
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
        <table class="min-w-[1180px] text-xs">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'portfolio')">
                  Portfolio {{ sortMark("portfolio") }}
                </button>
              </th>
              <th class="px-3 py-2 text-left"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'asset')">Asset {{ sortMark("asset") }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'price')">Price {{ sortMark("price") }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'avg_cost')">Avg Cost {{ sortMark("avg_cost") }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'evaluated')">Evaluated {{ sortMark("evaluated") }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'cost_basis')">Cost Basis {{ sortMark("cost_basis") }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'profit')">Profit {{ sortMark("profit") }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'return')">Return {{ sortMark("return") }}</button></th>
              <th class="px-3 py-2 text-left"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="emit('sort', 'symbol')">Symbol {{ sortMark("symbol") }}</button></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="9" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">Loading holdings...</td></tr>
            <tr v-else-if="rows.length === 0"><td colspan="9" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">No holding rows.</td></tr>
            <tr v-for="row in rows" :key="`h-${row.id}`" class="border-t border-slate-200 dark:border-slate-800">
              <td class="sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900">{{ row.portfolioName }}</td>
              <td class="px-3 py-2">{{ row.assetName }}</td>
              <td class="px-3 py-2 text-right"><span :style="maskStyle">{{ formatCurrency(row.price, row.priceCurrency) }}</span></td>
              <td class="px-3 py-2 text-right"><span :style="maskStyle">{{ formatCurrency(row.avgCost, row.avgCostCurrency) }}</span></td>
              <td class="px-3 py-2 text-right font-semibold"><span :style="maskStyle">{{ formatCurrency(row.evaluated, displayCurrency) }}</span></td>
              <td class="px-3 py-2 text-right"><span :style="maskStyle">{{ formatCurrency(row.costBasis, displayCurrency) }}</span></td>
              <td class="px-3 py-2 text-right font-semibold" :class="row.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                <span :style="maskStyle">{{ row.profit >= 0 ? "+" : "" }}{{ formatCurrency(row.profit, displayCurrency) }}</span>
              </td>
              <td class="px-3 py-2 text-right font-semibold" :class="(row.returnPct ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'">{{ formatPercent(row.returnPct) }}</td>
              <td class="px-3 py-2">{{ row.symbol || "-" }}</td>
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
    <p v-else class="mt-3 text-sm text-slate-500 dark:text-slate-400">Collapsed. Click Expand to open Holdings Table.</p>
  </article>
</template>

