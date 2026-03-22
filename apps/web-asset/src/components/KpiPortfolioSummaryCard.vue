<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
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
    useNetBasis?: boolean;
    storageKey?: string;
  }>(),
  {
    maskAmounts: false,
    title: "KPI Portfolios",
    subtitle: "",
    useNetBasis: false,
    storageKey: "",
  },
);

const uiStore = useUiStore();
const { nameClampEnabled } = storeToRefs(uiStore);
const expanded = ref(true);
const infoOpen = ref(false);

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

function currentValue(row: PortfolioTableRowOut): number {
  if (props.useNetBasis) {
    return toNumber(row.net_assets_total);
  }
  return toNumber(row.gross_assets_total);
}

function principalValue(row: PortfolioTableRowOut): number {
  if (props.useNetBasis) {
    return toNumber(row.debt_adjusted_principal_total ?? row.principal_minus_debt_total);
  }
  return netContribution(row);
}

function profitValue(row: PortfolioTableRowOut): number {
  if (props.useNetBasis) {
    const explicit = row.net_assets_profit_total;
    if (explicit != null) return toNumber(explicit);
    return currentValue(row) - principalValue(row);
  }
  return toNumber(row.portfolio_profit_total ?? row.total_pnl_amount);
}

function returnValue(row: PortfolioTableRowOut): number {
  if (props.useNetBasis) {
    const explicit = row.net_assets_return_pct;
    if (explicit != null) return toNumber(explicit);
    const base = principalValue(row);
    if (base > 0) {
      return ((currentValue(row) - base) / base) * 100;
    }
    return 0;
  }
  return toNumber(row.total_return_pct ?? null);
}

const currentColumnLabel = computed(() => (props.useNetBasis ? "Current (Net)" : "Current Value"));
const principalColumnLabel = computed(() => (props.useNetBasis ? "Debt-Adjusted Principal" : "Principal"));
const profitColumnLabel = computed(() => (props.useNetBasis ? "Net Profit" : "Profit"));
const returnColumnLabel = computed(() => (props.useNetBasis ? "Net Return" : "Return"));

type SortKey = "portfolio" | "current" | "principal" | "profit" | "return";
type SortOrder = "asc" | "desc";

const sortBy = ref<SortKey>("current");
const sortOrder = ref<SortOrder>("desc");

function toggleSort(key: SortKey): void {
  if (sortBy.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
    return;
  }
  sortBy.value = key;
  sortOrder.value = key === "portfolio" ? "asc" : "desc";
}

function sortIndicator(key: SortKey): string {
  if (sortBy.value !== key) return "↕";
  return sortOrder.value === "asc" ? "↑" : "↓";
}

const rows = computed(() => {
  const base = [...props.portfolios];
  base.sort((a, b) => {
    if (sortBy.value === "portfolio") {
      const byName = (a.name || "").localeCompare(b.name || "", "ko");
      if (byName !== 0) return byName;
      return Number(a.id) - Number(b.id);
    }
    if (sortBy.value === "current") {
      return currentValue(a) - currentValue(b);
    }
    if (sortBy.value === "principal") {
      return principalValue(a) - principalValue(b);
    }
    if (sortBy.value === "profit") {
      return profitValue(a) - profitValue(b);
    }
    return returnValue(a) - returnValue(b);
  });
  if (sortOrder.value === "desc") {
    base.reverse();
  }
  return base;
});

const collapsedSummary = computed(() => {
  const topRow = rows.value[0];
  if (!topRow) return "No portfolio KPI data.";
  return `Top portfolio · ${topRow.name} · ${formatCurrency(currentValue(topRow), topRow.base_currency || props.currency)}`;
});

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
  if (typeof uiStore.init === "function") {
    uiStore.init();
  }
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
            :aria-label="infoOpen ? 'Hide KPI Portfolios info' : 'Show KPI Portfolios info'"
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
      <p>KPI Portfolios compares current value, principal, profit, and return across portfolios.</p>
      <p class="mt-1">When Net basis is enabled, current, principal, profit, and return switch to debt-adjusted portfolio metrics.</p>
    </div>

    <div
      v-if="!expanded"
      class="mt-4 rounded-xl border border-slate-200 bg-slate-50 px-3 py-3 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
    >
      <p class="font-medium text-slate-700 dark:text-slate-200">Collapsed. Click Expand to preview KPI portfolios.</p>
      <p class="mt-1" :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">{{ collapsedSummary }}</p>
    </div>

    <div
      v-else-if="rows.length === 0"
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
              <button
                type="button"
                class="inline-flex items-center gap-1 font-semibold text-inherit hover:text-slate-900 dark:hover:text-slate-100"
                @click="toggleSort('portfolio')"
              >
                Portfolio
                <span class="text-[11px] opacity-80">{{ sortIndicator("portfolio") }}</span>
              </button>
            </th>
            <th class="px-3 py-2 text-right">
              <button
                type="button"
                class="inline-flex items-center gap-1 font-semibold text-inherit hover:text-slate-900 dark:hover:text-slate-100"
                @click="toggleSort('current')"
              >
                {{ currentColumnLabel }}
                <span class="text-[11px] opacity-80">{{ sortIndicator("current") }}</span>
              </button>
            </th>
            <th class="px-3 py-2 text-right">
              <button
                type="button"
                class="inline-flex items-center gap-1 font-semibold text-inherit hover:text-slate-900 dark:hover:text-slate-100"
                @click="toggleSort('principal')"
              >
                {{ principalColumnLabel }}
                <span class="text-[11px] opacity-80">{{ sortIndicator("principal") }}</span>
              </button>
            </th>
            <th class="px-3 py-2 text-right">
              <button
                type="button"
                class="inline-flex items-center gap-1 font-semibold text-inherit hover:text-slate-900 dark:hover:text-slate-100"
                @click="toggleSort('profit')"
              >
                {{ profitColumnLabel }}
                <span class="text-[11px] opacity-80">{{ sortIndicator("profit") }}</span>
              </button>
            </th>
            <th class="px-3 py-2 text-right">
              <button
                type="button"
                class="inline-flex items-center gap-1 font-semibold text-inherit hover:text-slate-900 dark:hover:text-slate-100"
                @click="toggleSort('return')"
              >
                {{ returnColumnLabel }}
                <span class="text-[11px] opacity-80">{{ sortIndicator("return") }}</span>
              </button>
            </th>
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
                {{ formatCurrency(currentValue(row), row.base_currency || currency) }}
              </span>
            </td>
            <td class="px-3 py-2 text-right text-slate-700 dark:text-slate-300">
              <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
                {{ formatCurrency(principalValue(row), row.base_currency || currency) }}
              </span>
            </td>
            <td
              class="px-3 py-2 text-right font-semibold"
              :class="signedClass(profitValue(row))"
            >
              <span :style="props.maskAmounts ? { filter: 'blur(6px)' } : undefined">
                {{ formatSignedCurrency(profitValue(row), row.base_currency || currency) }}
              </span>
            </td>
            <td class="px-3 py-2 text-right font-semibold" :class="signedClass(returnValue(row))">
              {{ formatPercent(returnValue(row)) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </article>
</template>
