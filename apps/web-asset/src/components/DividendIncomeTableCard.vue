<script setup lang="ts">
import { computed, reactive, ref } from "vue";

import type { DividendReceiptCreateIn, DividendTableOut, DividendTableRowOut } from "../api/dividends";

const props = defineProps<{
  title: string;
  subtitle: string;
  expanded: boolean;
  loading: boolean;
  table: DividendTableOut | null;
  maskAmounts: boolean;
  canUpdate: boolean;
  updateRunning: boolean;
  updateProgressText: string;
  lastResultLabel: string;
  schedulerStatusLabel: string;
  schedulerMissedLabel: string;
  receiptSaving: boolean;
}>();

const emit = defineEmits<{
  (e: "toggle"): void;
  (e: "update-now"): void;
  (e: "create-receipt", payload: DividendReceiptCreateIn): void;
}>();

type DividendViewMode = "EXPECTED" | "RECEIVED" | "BOTH";
type DividendAmountBasis = "GROSS" | "NET";
type DividendKindFilter = "ALL" | "DIVIDEND" | "DISTRIBUTION";
type DividendExpectedMode = "FORECAST" | "CONFIRMED";

const viewMode = ref<DividendViewMode>("EXPECTED");
const amountBasis = ref<DividendAmountBasis>("NET");
const kindFilter = ref<DividendKindFilter>("ALL");
const expectedMode = ref<DividendExpectedMode>("FORECAST");
const showReceiptForm = ref(false);

const receiptForm = reactive({
  portfolio_id: "",
  asset_id: "",
  received_date: new Date().toISOString().slice(0, 10),
  currency: "KRW",
  gross_amount: "",
  withholding_tax: "0",
  net_amount: "",
  tax_rate_pct: "",
  tax_country: "",
  memo: "",
});

const rows = computed(() => props.table?.rows ?? []);
const filteredRows = computed(() =>
  rows.value.filter((row) => kindFilter.value === "ALL" || (row.income_kind || "DIVIDEND") === kindFilter.value),
);
const snapshot = computed(() => props.table?.snapshot ?? null);
const displayCurrency = computed(() => props.table?.display_currency || "KRW");
const dividendYear = computed(() => props.table?.dividend_year ?? new Date().getFullYear());
const isConfigured = computed(() => Boolean(props.table?.configured && snapshot.value));
const maskStyle = computed(() => (props.maskAmounts ? { filter: "blur(6px)" } : undefined));

const portfolioOptions = computed(() => {
  const seen = new Set<number>();
  return rows.value
    .filter((row) => row.portfolio_id != null && !seen.has(Number(row.portfolio_id)) && seen.add(Number(row.portfolio_id)))
    .map((row) => ({
      id: Number(row.portfolio_id),
      label: row.portfolio_name,
    }));
});

const assetOptions = computed(() => {
  const selectedPortfolioId = Number(receiptForm.portfolio_id || 0);
  const seen = new Set<number>();
  return rows.value
    .filter((row) => row.asset_id != null)
    .filter((row) => !selectedPortfolioId || Number(row.portfolio_id) === selectedPortfolioId)
    .filter((row) => !seen.has(Number(row.asset_id)) && seen.add(Number(row.asset_id)))
    .map((row) => ({
      id: Number(row.asset_id),
      label: row.symbol ? `${row.asset_name} (${row.symbol})` : row.asset_name,
    }));
});

const sortedRows = computed(() => {
  return [...filteredRows.value].sort((a, b) => {
    const aValue = viewMode.value === "RECEIVED" ? rowReceivedAmount(a) : rowExpectedAmount(a);
    const bValue = viewMode.value === "RECEIVED" ? rowReceivedAmount(b) : rowExpectedAmount(b);
    return bValue - aValue;
  });
});

const expectedTotal = computed(() => filteredRows.value.reduce((total, row) => total + rowExpectedAmount(row), 0));
const confirmedTotal = computed(() => filteredRows.value.reduce((total, row) => total + rowConfirmedAmount(row), 0));
const estimatedTotal = computed(() => filteredRows.value.reduce((total, row) => total + rowEstimatedAmount(row), 0));
const receivedTotal = computed(() => filteredRows.value.reduce((total, row) => total + rowReceivedAmount(row), 0));
const taxTotal = computed(() => {
  if (viewMode.value === "RECEIVED") {
    return filteredRows.value.reduce((total, row) => total + toNumber(row.received_ytd_tax), 0);
  }
  return filteredRows.value.reduce(
    (total, row) =>
      total +
      (expectedMode.value === "CONFIRMED"
        ? amountBasis.value === "GROSS"
          ? toNumber(row.confirmed_annual_tax)
          : toNumber(row.confirmed_annual_tax)
        : toNumber(row.expected_annual_tax)),
    0,
  );
});

function toNumber(value: unknown): number {
  if (value == null || value === "") return 0;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatCurrency(value: unknown, currency = displayCurrency.value): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: (currency || "KRW").toUpperCase(),
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}

function formatPercent(value: unknown): string {
  if (value == null || value === "") return "-";
  const parsed = toNumber(value);
  return `${parsed >= 0 ? "" : "-"}${Math.abs(parsed).toFixed(2)}%`;
}

function formatQuantity(value: unknown): string {
  return new Intl.NumberFormat("ko-KR", {
    maximumFractionDigits: 6,
  }).format(toNumber(value));
}

function paymentMonthLabel(months: number[]): string {
  if (!months || months.length === 0) return "-";
  return [...months].sort((a, b) => a - b).join(", ");
}

function rowExpectedAmount(row: DividendTableRowOut): number {
  if (expectedMode.value === "CONFIRMED") {
    return rowConfirmedAmount(row);
  }
  return amountBasis.value === "GROSS" ? toNumber(row.expected_annual_gross) : toNumber(row.expected_annual_net);
}

function rowConfirmedAmount(row: DividendTableRowOut): number {
  return amountBasis.value === "GROSS" ? toNumber(row.confirmed_annual_gross) : toNumber(row.confirmed_annual_net);
}

function rowEstimatedAmount(row: DividendTableRowOut): number {
  return amountBasis.value === "GROSS" ? toNumber(row.estimated_annual_gross) : toNumber(row.estimated_annual_net);
}

function rowReceivedAmount(row: DividendTableRowOut): number {
  return amountBasis.value === "GROSS" ? toNumber(row.received_ytd_gross) : toNumber(row.received_ytd_net);
}

function kindLabel(kind: string | null | undefined): string {
  return kind === "DISTRIBUTION" ? "Distribution" : "Dividend";
}

function statusHint(row: DividendTableRowOut): string {
  return row.missing_reason || row.estimate_method || row.status || "-";
}

function beginReceiptForm(): void {
  if (!showReceiptForm.value) {
    const first = rows.value[0];
    receiptForm.portfolio_id = first?.portfolio_id != null ? String(first.portfolio_id) : "";
    receiptForm.asset_id = first?.asset_id != null ? String(first.asset_id) : "";
    receiptForm.currency = first?.currency || displayCurrency.value;
  }
  showReceiptForm.value = !showReceiptForm.value;
}

function submitReceipt(): void {
  const gross = toNumber(receiptForm.gross_amount);
  const tax = toNumber(receiptForm.withholding_tax);
  const net = receiptForm.net_amount === "" ? gross - tax : toNumber(receiptForm.net_amount);
  if (!receiptForm.portfolio_id || gross < 0 || tax < 0 || net < 0) return;
  emit("create-receipt", {
    portfolio_id: Number(receiptForm.portfolio_id),
    asset_id: receiptForm.asset_id ? Number(receiptForm.asset_id) : null,
    received_date: receiptForm.received_date,
    currency: receiptForm.currency.toUpperCase(),
    gross_amount: gross,
    withholding_tax: tax,
    net_amount: net,
    tax_rate_pct: receiptForm.tax_rate_pct === "" ? null : toNumber(receiptForm.tax_rate_pct),
    tax_country: receiptForm.tax_country || null,
    memo: receiptForm.memo || null,
  });
}
</script>

<template>
  <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
    <div class="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">{{ title }}</h2>
        <p class="text-sm text-slate-500 dark:text-slate-400">{{ subtitle }}</p>
        <p v-if="snapshot" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
          as_of {{ snapshot.as_of }} · {{ dividendYear }} expected dividend snapshot
        </p>
      </div>
      <div class="flex flex-wrap items-center gap-2">
        <button
          v-if="canUpdate"
          type="button"
          class="rounded-xl border border-emerald-500/40 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-50 dark:text-emerald-300 dark:hover:bg-emerald-500/10"
          :disabled="updateRunning"
          @click="emit('update-now')"
        >
          {{ updateRunning ? `Updating ${updateProgressText}` : "Update Dividend Now" }}
        </button>
        <button
          v-if="expanded"
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="beginReceiptForm"
        >
          {{ showReceiptForm ? "Close Receipt Form" : "Add Received Dividend" }}
        </button>
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
      <div class="mt-3 grid gap-2 md:grid-cols-5">
        <div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800/80">
          <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Expected Annual</p>
          <p class="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100" :style="maskStyle">
            {{ formatCurrency(expectedTotal) }}
          </p>
        </div>
        <div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800/80">
          <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Confirmed</p>
          <p class="mt-1 text-lg font-bold text-emerald-700 dark:text-emerald-300" :style="maskStyle">
            {{ formatCurrency(confirmedTotal) }}
          </p>
        </div>
        <div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800/80">
          <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Estimated</p>
          <p class="mt-1 text-lg font-bold text-amber-700 dark:text-amber-300" :style="maskStyle">
            {{ formatCurrency(estimatedTotal) }}
          </p>
        </div>
        <div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800/80">
          <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Received YTD</p>
          <p class="mt-1 text-lg font-bold text-slate-900 dark:text-slate-100" :style="maskStyle">
            {{ formatCurrency(receivedTotal) }}
          </p>
        </div>
        <div class="rounded-xl bg-slate-100 p-3 dark:bg-slate-800/80">
          <p class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Tax</p>
          <p class="mt-1 text-lg font-bold text-rose-600 dark:text-rose-300" :style="maskStyle">
            {{ formatCurrency(taxTotal) }}
          </p>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <span class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Type</span>
        <button
          v-for="kind in ['ALL', 'DIVIDEND', 'DISTRIBUTION']"
          :key="kind"
          type="button"
          class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition"
          :class="kindFilter === kind ? 'border-amber-400 bg-amber-600/15 text-amber-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
          @click="kindFilter = kind as DividendKindFilter"
        >
          {{ kind === "ALL" ? "All" : kind === "DIVIDEND" ? "Dividend" : "Distribution" }}
        </button>
        <span class="text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">View</span>
        <button
          v-for="mode in ['EXPECTED', 'RECEIVED', 'BOTH']"
          :key="mode"
          type="button"
          class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition"
          :class="viewMode === mode ? 'border-indigo-400 bg-indigo-600/15 text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
          @click="viewMode = mode as DividendViewMode"
        >
          {{ mode === "EXPECTED" ? "Expected" : mode === "RECEIVED" ? "Received" : "Both" }}
        </button>
        <span class="ml-0 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 md:ml-3">Basis</span>
        <button
          v-for="basis in ['GROSS', 'NET']"
          :key="basis"
          type="button"
          class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition"
          :class="amountBasis === basis ? 'border-emerald-400 bg-emerald-600/15 text-emerald-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
          @click="amountBasis = basis as DividendAmountBasis"
        >
          {{ basis === "GROSS" ? "Gross" : "Net" }}
        </button>
        <span class="ml-0 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 md:ml-3">Estimate</span>
        <button
          v-for="mode in ['FORECAST', 'CONFIRMED']"
          :key="mode"
          type="button"
          class="rounded-xl border px-3 py-1.5 text-xs font-semibold transition"
          :class="expectedMode === mode ? 'border-sky-400 bg-sky-600/15 text-sky-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
          @click="expectedMode = mode as DividendExpectedMode"
        >
          {{ mode === "FORECAST" ? "Forecast" : "Confirmed only" }}
        </button>
      </div>

      <form
        v-if="showReceiptForm"
        class="mt-3 grid gap-2 rounded-2xl border border-slate-200 p-3 dark:border-slate-700"
        @submit.prevent="submitReceipt"
      >
        <div class="grid gap-2 md:grid-cols-4">
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Portfolio
            <select v-model="receiptForm.portfolio_id" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
              <option value="">Select portfolio</option>
              <option v-for="option in portfolioOptions" :key="option.id" :value="String(option.id)">{{ option.label }}</option>
            </select>
          </label>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Asset
            <select v-model="receiptForm.asset_id" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
              <option value="">Cash only</option>
              <option v-for="option in assetOptions" :key="option.id" :value="String(option.id)">{{ option.label }}</option>
            </select>
          </label>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Received date
            <input v-model="receiptForm.received_date" type="date" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Currency
            <input v-model="receiptForm.currency" maxlength="3" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Gross amount
            <input v-model="receiptForm.gross_amount" type="number" min="0" step="0.01" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Withholding tax
            <input v-model="receiptForm.withholding_tax" type="number" min="0" step="0.01" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Net amount
            <input v-model="receiptForm.net_amount" type="number" min="0" step="0.01" placeholder="auto gross-tax" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Tax rate %
            <input v-model="receiptForm.tax_rate_pct" type="number" min="0" max="100" step="0.01" placeholder="15.4" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
        </div>
        <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
          Memo
          <input v-model="receiptForm.memo" type="text" class="mt-1 w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        </label>
        <div class="flex justify-end">
          <button
            type="submit"
            class="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            :disabled="receiptSaving || !receiptForm.portfolio_id || !receiptForm.gross_amount"
          >
            {{ receiptSaving ? "Saving..." : "Save Received Dividend" }}
          </button>
        </div>
      </form>

      <div class="mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table class="min-w-[1560px] text-xs">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="px-3 py-2 text-left">Portfolio</th>
              <th class="px-3 py-2 text-left">Asset</th>
              <th class="px-3 py-2 text-left">Type</th>
              <th class="px-3 py-2 text-right">Quantity</th>
              <th class="px-3 py-2 text-left">Currency</th>
              <th class="px-3 py-2 text-left">Tax Profile</th>
              <th v-if="viewMode !== 'RECEIVED'" class="px-3 py-2 text-right">Confirmed</th>
              <th v-if="viewMode !== 'RECEIVED'" class="px-3 py-2 text-right">Estimated</th>
              <th v-if="viewMode !== 'RECEIVED'" class="px-3 py-2 text-right">Expected Annual</th>
              <th v-if="viewMode !== 'RECEIVED'" class="px-3 py-2 text-right">Expected Tax</th>
              <th v-if="viewMode !== 'EXPECTED'" class="px-3 py-2 text-right">Received YTD</th>
              <th v-if="viewMode !== 'EXPECTED'" class="px-3 py-2 text-right">Received Tax</th>
              <th class="px-3 py-2 text-right">Yield</th>
              <th class="px-3 py-2 text-left">Payment Months</th>
              <th class="px-3 py-2 text-left">Confidence</th>
              <th class="px-3 py-2 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading"><td colspan="16" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">Loading dividends...</td></tr>
            <tr v-else-if="!isConfigured"><td colspan="16" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">No dividend snapshot yet. Click Update Dividend Now.</td></tr>
            <tr v-else-if="sortedRows.length === 0"><td colspan="16" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">No dividend rows.</td></tr>
            <tr v-for="row in sortedRows" :key="`${row.portfolio_id}-${row.asset_id}-${row.asset_name}`" class="border-t border-slate-200 dark:border-slate-800">
              <td class="px-3 py-2 font-semibold">{{ row.portfolio_name }}</td>
              <td class="px-3 py-2">
                <span class="font-semibold">{{ row.asset_name }}</span>
                <span v-if="row.symbol" class="ml-1 text-slate-500 dark:text-slate-400">({{ row.symbol }})</span>
              </td>
              <td class="px-3 py-2">
                <span class="rounded-full border px-2 py-0.5 text-[0.65rem] font-bold uppercase" :class="row.income_kind === 'DISTRIBUTION' ? 'border-amber-400/50 text-amber-300' : 'border-emerald-400/50 text-emerald-300'">
                  {{ kindLabel(row.income_kind) }}
                </span>
              </td>
              <td class="px-3 py-2 text-right">{{ formatQuantity(row.quantity) }}</td>
              <td class="px-3 py-2">{{ row.currency }}</td>
              <td class="px-3 py-2">{{ row.tax_profile || "-" }}</td>
              <td v-if="viewMode !== 'RECEIVED'" class="px-3 py-2 text-right font-semibold text-emerald-700 dark:text-emerald-300" :style="maskStyle">{{ formatCurrency(rowConfirmedAmount(row)) }}</td>
              <td v-if="viewMode !== 'RECEIVED'" class="px-3 py-2 text-right font-semibold text-amber-700 dark:text-amber-300" :style="maskStyle">{{ formatCurrency(rowEstimatedAmount(row)) }}</td>
              <td v-if="viewMode !== 'RECEIVED'" class="px-3 py-2 text-right font-semibold" :style="maskStyle">{{ formatCurrency(rowExpectedAmount(row)) }}</td>
              <td v-if="viewMode !== 'RECEIVED'" class="px-3 py-2 text-right text-rose-600 dark:text-rose-300" :style="maskStyle">{{ formatCurrency(row.expected_annual_tax) }}</td>
              <td v-if="viewMode !== 'EXPECTED'" class="px-3 py-2 text-right font-semibold" :style="maskStyle">{{ formatCurrency(rowReceivedAmount(row)) }}</td>
              <td v-if="viewMode !== 'EXPECTED'" class="px-3 py-2 text-right text-rose-600 dark:text-rose-300" :style="maskStyle">{{ formatCurrency(row.received_ytd_tax) }}</td>
              <td class="px-3 py-2 text-right">{{ formatPercent(row.dividend_yield_pct) }}</td>
              <td class="px-3 py-2">{{ paymentMonthLabel(row.payment_months) }}</td>
              <td class="px-3 py-2">
                <span class="rounded-full border border-slate-300 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  {{ row.confidence || "-" }}
                </span>
              </td>
              <td class="px-3 py-2">
                <span class="rounded-full border border-slate-300 px-2 py-0.5 text-[0.65rem] font-bold uppercase text-slate-600 dark:border-slate-700 dark:text-slate-300">
                  {{ row.status }}
                </span>
                <p v-if="statusHint(row) !== row.status" class="mt-1 max-w-[220px] truncate text-[0.65rem] text-slate-500 dark:text-slate-400" :title="statusHint(row)">
                  {{ statusHint(row) }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-2 space-y-1 text-xs text-slate-500 dark:text-slate-400">
        <p v-if="lastResultLabel">{{ lastResultLabel }}</p>
        <p v-if="schedulerStatusLabel">{{ schedulerStatusLabel }}</p>
        <p v-if="schedulerMissedLabel">{{ schedulerMissedLabel }}</p>
      </div>
    </template>
    <p v-else class="mt-3 text-sm text-slate-500 dark:text-slate-400">
      Collapsed. Expected annual {{ amountBasis === "GROSS" ? "gross" : "net" }} dividend:
      <span class="font-semibold text-slate-900 dark:text-slate-100" :style="maskStyle">{{ formatCurrency(expectedTotal) }}</span>
    </p>
  </article>
</template>
