<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, onMounted, reactive, ref, watch } from "vue";

import { getAssets, type AssetOut } from "../api/assets";
import { getPortfolios, type PortfolioOut } from "../api/portfolios";
import {
  createTrade,
  getTrades,
  rebuildTrades,
  updateTrade,
  voidTrade,
  type TradeCreateIn,
  type TradeRowOut,
  type TradeSortBy,
  type TransactionStatus,
  type TransactionType,
} from "../api/trades";

const loading = ref(false);
const saving = ref(false);
const rebuilding = ref(false);
const errorMessage = ref("");
const successMessage = ref("");
const trades = ref<TradeRowOut[]>([]);
const total = ref(0);
const page = ref(1);
const pageSize = ref(20);
const editingId = ref<number | null>(null);
const sortBy = ref<TradeSortBy>("executed_at");
const sortOrder = ref<"asc" | "desc">("desc");

const portfolios = ref<PortfolioOut[]>([]);
const assets = ref<AssetOut[]>([]);
const tradeTypes: TransactionType[] = ["BUY", "SELL", "DEPOSIT", "WITHDRAW", "DIVIDEND", "FEE", "ADJUSTMENT"];
const statusOptions: TransactionStatus[] = ["POSTED", "VOID"];

const form = reactive({
  portfolio_id: "",
  txn_type: "BUY" as TransactionType,
  asset_id: "",
  quantity: "",
  unit_price: "",
  amount: "",
  currency: "KRW",
  memo: "",
  source_type: "MANUAL" as "MANUAL" | "AUTO",
  auto_apply_cash_holding: true,
  auto_apply_portfolio_cashflow: false,
});

const filters = reactive({
  q: "",
  portfolio_id: "",
  asset_id: "",
  txn_type: "" as "" | TransactionType,
  status: "" as "" | TransactionStatus,
  from: "",
  to: "",
});

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const isBuySell = computed(() => form.txn_type === "BUY" || form.txn_type === "SELL");

function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = (error.response?.data as { detail?: string } | undefined)?.detail;
    if (detail) return detail;
  }
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function toOptionalNumber(value: string): number | undefined {
  const raw = value.trim();
  if (!raw) return undefined;
  const parsed = Number(raw.replace(/,/g, ""));
  return Number.isFinite(parsed) ? parsed : undefined;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("ko-KR");
}

function formatNumber(value: string | number | null | undefined, digits = 2): string {
  if (value === null || value === undefined || value === "") return "-";
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return String(value);
  return numeric.toLocaleString("ko-KR", { maximumFractionDigits: digits });
}

function toggleSort(next: TradeSortBy) {
  if (sortBy.value === next) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortBy.value = next;
    sortOrder.value = "desc";
  }
  page.value = 1;
  void loadTrades();
}

function sortIndicator(next: TradeSortBy): string {
  if (sortBy.value !== next) return "";
  return sortOrder.value === "asc" ? "▲" : "▼";
}

function resetForm() {
  editingId.value = null;
  form.portfolio_id = portfolios.value[0] ? String(portfolios.value[0].id) : "";
  form.txn_type = "BUY";
  form.asset_id = "";
  form.quantity = "";
  form.unit_price = "";
  form.amount = "";
  form.currency = "KRW";
  form.memo = "";
  form.source_type = "MANUAL";
  form.auto_apply_cash_holding = true;
  form.auto_apply_portfolio_cashflow = false;
}

function applyEdit(row: TradeRowOut) {
  editingId.value = row.id;
  form.portfolio_id = String(row.portfolio_id);
  form.txn_type = row.txn_type;
  form.asset_id = row.asset_id ? String(row.asset_id) : "";
  form.quantity = row.quantity == null ? "" : String(row.quantity);
  form.unit_price = row.unit_price == null ? "" : String(row.unit_price);
  form.amount = String(row.amount);
  form.currency = row.currency;
  form.memo = row.memo ?? "";
  form.source_type = row.source_type;
  form.auto_apply_cash_holding = row.auto_apply_cash_holding;
  form.auto_apply_portfolio_cashflow = row.auto_apply_portfolio_cashflow;
}

function buildPayload(): TradeCreateIn {
  const payload: TradeCreateIn = {
    portfolio_id: Number(form.portfolio_id),
    txn_type: form.txn_type,
    currency: form.currency.trim().toUpperCase(),
    memo: form.memo.trim() || null,
    source_type: form.source_type,
    auto_apply_cash_holding: form.auto_apply_cash_holding,
    auto_apply_portfolio_cashflow: form.auto_apply_portfolio_cashflow,
  };
  if (isBuySell.value) {
    payload.asset_id = Number(form.asset_id);
    payload.quantity = toOptionalNumber(form.quantity) ?? null;
    payload.unit_price = toOptionalNumber(form.unit_price) ?? null;
    payload.amount = toOptionalNumber(form.amount) ?? null;
  } else {
    payload.asset_id = null;
    payload.amount = toOptionalNumber(form.amount) ?? null;
  }
  return payload;
}

async function loadTrades() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const out = await getTrades({
      page: page.value,
      page_size: pageSize.value,
      q: filters.q.trim() || undefined,
      portfolio_id: toOptionalNumber(filters.portfolio_id),
      asset_id: toOptionalNumber(filters.asset_id),
      txn_type: filters.txn_type || undefined,
      status: filters.status || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
      sort_by: sortBy.value,
      sort_order: sortOrder.value,
    });
    trades.value = out.items;
    total.value = out.total;
  } catch (error) {
    errorMessage.value = `Failed to load trades: ${parseApiError(error)}`;
  } finally {
    loading.value = false;
  }
}

async function submit() {
  if (!form.portfolio_id) {
    errorMessage.value = "Portfolio is required.";
    return;
  }
  if (isBuySell.value && !form.asset_id) {
    errorMessage.value = "Asset is required for BUY/SELL.";
    return;
  }
  if (!window.confirm(editingId.value ? "Update this trade?" : "Create this trade?")) return;

  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    const payload = buildPayload();
    if (editingId.value) {
      await updateTrade(editingId.value, payload);
      successMessage.value = `Trade #${editingId.value} updated.`;
    } else {
      const created = await createTrade(payload);
      successMessage.value = `Trade #${created.id} created.`;
    }
    await loadTrades();
    resetForm();
  } catch (error) {
    errorMessage.value = parseApiError(error);
  } finally {
    saving.value = false;
  }
}

async function onVoid(row: TradeRowOut) {
  if (row.status === "VOID") return;
  if (!window.confirm(`Void trade #${row.id}?`)) return;
  try {
    await voidTrade(row.id);
    successMessage.value = `Trade #${row.id} voided.`;
    await loadTrades();
  } catch (error) {
    errorMessage.value = parseApiError(error);
  }
}

async function onRebuild() {
  if (!window.confirm("Rebuild holdings/portfolios from posted trades?")) return;
  rebuilding.value = true;
  try {
    const result = await rebuildTrades({ portfolio_id: toOptionalNumber(filters.portfolio_id) ?? null });
    successMessage.value = `Rebuild done. portfolios=${result.affected_portfolios}, holdings=${result.affected_holdings}`;
    await loadTrades();
  } catch (error) {
    errorMessage.value = parseApiError(error);
  } finally {
    rebuilding.value = false;
  }
}

async function applyFilters() {
  page.value = 1;
  await loadTrades();
}

async function resetFilters() {
  filters.q = "";
  filters.portfolio_id = "";
  filters.asset_id = "";
  filters.txn_type = "";
  filters.status = "";
  filters.from = "";
  filters.to = "";
  page.value = 1;
  await loadTrades();
}

watch(
  () => form.txn_type,
  (next) => {
    if (next === "DEPOSIT" || next === "WITHDRAW") {
      form.asset_id = "";
      form.auto_apply_portfolio_cashflow = true;
    } else {
      form.auto_apply_portfolio_cashflow = false;
    }
  },
);

watch([page, pageSize], () => void loadTrades());

onMounted(async () => {
  const [portfolioData, assetData] = await Promise.all([getPortfolios(), getAssets()]);
  portfolios.value = portfolioData;
  assets.value = assetData;
  resetForm();
  await loadTrades();
});
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Trade</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Manual Trade Ledger</h1>
    </header>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Portfolio
          <select v-model="form.portfolio_id" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
            <option value="">Select</option>
            <option v-for="p in portfolios" :key="p.id" :value="String(p.id)">#{{ p.id }} {{ p.name }}</option>
          </select>
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Type
          <select v-model="form.txn_type" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
            <option v-for="type in tradeTypes" :key="type" :value="type">{{ type }}</option>
          </select>
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Asset
          <select v-model="form.asset_id" :disabled="!isBuySell" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950">
            <option value="">Select</option>
            <option v-for="a in assets" :key="a.id" :value="String(a.id)">#{{ a.id }} {{ a.name }}</option>
          </select>
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Currency
          <input v-model="form.currency" maxlength="3" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950" />
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Quantity
          <input v-model="form.quantity" :disabled="!isBuySell" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950" />
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Unit Price
          <input v-model="form.unit_price" :disabled="!isBuySell" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950" />
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Amount
          <input v-model="form.amount" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Source
          <select v-model="form.source_type" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
            <option value="MANUAL">MANUAL</option>
            <option value="AUTO">AUTO</option>
          </select>
        </label>
      </div>

      <label class="mt-3 block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Memo
        <input v-model="form.memo" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
      </label>
      <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
          <input v-model="form.auto_apply_cash_holding" type="checkbox" class="h-4 w-4" />
          <span>Auto apply to cash holding</span>
        </label>
        <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
          <input v-model="form.auto_apply_portfolio_cashflow" type="checkbox" class="h-4 w-4" />
          <span>Auto apply to portfolio principal</span>
        </label>
      </div>
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60" :disabled="saving" @click="submit">
          {{ saving ? "Saving..." : editingId ? "Update Trade" : "Create Trade" }}
        </button>
        <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="resetForm">Reset</button>
        <button type="button" class="rounded-lg border border-cyan-300 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 disabled:opacity-60 dark:border-cyan-800 dark:text-cyan-300 dark:hover:bg-cyan-900/30" :disabled="rebuilding" @click="onRebuild">
          {{ rebuilding ? "Rebuilding..." : "Rebuild Ledger Sync" }}
        </button>
      </div>
    </article>

    <article v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">{{ errorMessage }}</article>
    <article v-if="successMessage" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">{{ successMessage }}</article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="mb-3 grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-7">
        <input
          v-model="filters.q"
          placeholder="Search..."
          class="rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          v-model="filters.portfolio_id"
          type="number"
          min="1"
          placeholder="Portfolio ID"
          class="rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <input
          v-model="filters.asset_id"
          type="number"
          min="1"
          placeholder="Asset ID"
          class="rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
        />
        <select v-model="filters.txn_type" class="rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
          <option value="">ALL TYPES</option>
          <option v-for="type in tradeTypes" :key="type" :value="type">{{ type }}</option>
        </select>
        <select v-model="filters.status" class="rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
          <option value="">ALL STATUS</option>
          <option v-for="status in statusOptions" :key="status" :value="status">{{ status }}</option>
        </select>
        <input v-model="filters.from" type="datetime-local" class="rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        <input v-model="filters.to" type="datetime-local" class="rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
      </div>
      <div class="mb-3 flex items-center gap-2">
        <button type="button" class="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-500" @click="applyFilters">
          Search
        </button>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="resetFilters"
        >
          Reset
        </button>
      </div>

      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead class="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              <th class="px-2 py-2 text-left">
                <button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('id')">
                  # <span class="opacity-70">{{ sortIndicator("id") }}</span>
                </button>
              </th>
              <th class="px-2 py-2 text-left">
                <button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('executed_at')">
                  Time <span class="opacity-70">{{ sortIndicator("executed_at") }}</span>
                </button>
              </th>
              <th class="px-2 py-2 text-left">
                <button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('txn_type')">
                  Type <span class="opacity-70">{{ sortIndicator("txn_type") }}</span>
                </button>
              </th>
              <th class="px-2 py-2 text-left">
                <button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('portfolio_name')">
                  Portfolio <span class="opacity-70">{{ sortIndicator("portfolio_name") }}</span>
                </button>
              </th>
              <th class="px-2 py-2 text-left">
                <button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('asset_name')">
                  Asset <span class="opacity-70">{{ sortIndicator("asset_name") }}</span>
                </button>
              </th>
              <th class="px-2 py-2 text-right">
                <button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('amount')">
                  Amount <span class="opacity-70">{{ sortIndicator("amount") }}</span>
                </button>
              </th>
              <th class="px-2 py-2 text-right">
                <button
                  type="button"
                  class="inline-flex items-center gap-1 hover:underline"
                  @click="toggleSort('amount_in_portfolio_currency')"
                >
                  Amount(Base) <span class="opacity-70">{{ sortIndicator("amount_in_portfolio_currency") }}</span>
                </button>
              </th>
              <th class="px-2 py-2 text-center">Auto Cash</th>
              <th class="px-2 py-2 text-center">Auto Principal</th>
              <th class="px-2 py-2 text-center">
                <button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('status')">
                  Status <span class="opacity-70">{{ sortIndicator("status") }}</span>
                </button>
              </th>
              <th class="px-2 py-2 text-center">Action</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-if="!loading && trades.length === 0">
              <td colspan="11" class="px-2 py-6 text-center text-slate-500 dark:text-slate-400">No trades</td>
            </tr>
            <tr v-for="row in trades" :key="row.id" class="hover:bg-slate-50/70 dark:hover:bg-slate-800/40">
              <td class="px-2 py-2">#{{ row.id }}</td>
              <td class="px-2 py-2 whitespace-nowrap">{{ formatDateTime(row.executed_at) }}</td>
              <td class="px-2 py-2">{{ row.txn_type }}</td>
              <td class="px-2 py-2">#{{ row.portfolio_id }} {{ row.portfolio_name ?? "-" }}</td>
              <td class="px-2 py-2">
                <span v-if="row.asset_id">#{{ row.asset_id }} {{ row.asset_name ?? "-" }}</span>
                <span v-else>-</span>
              </td>
              <td class="px-2 py-2 text-right">{{ formatNumber(row.amount) }} {{ row.currency }}</td>
              <td class="px-2 py-2 text-right">{{ formatNumber(row.amount_in_portfolio_currency) }}</td>
              <td class="px-2 py-2 text-center">{{ row.auto_apply_cash_holding ? "ON" : "OFF" }}</td>
              <td class="px-2 py-2 text-center">{{ row.auto_apply_portfolio_cashflow ? "ON" : "OFF" }}</td>
              <td class="px-2 py-2 text-center">
                <span
                  class="rounded-full px-2 py-0.5 text-xs font-semibold"
                  :class="
                    row.status === 'VOID'
                      ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300'
                      : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                  "
                >
                  {{ row.status }}
                </span>
              </td>
              <td class="px-2 py-2 text-center">
                <div class="inline-flex gap-1">
                  <button
                    type="button"
                    class="rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                    @click="applyEdit(row)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30"
                    :disabled="row.status === 'VOID'"
                    @click="onVoid(row)"
                  >
                    Void
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-3 flex items-center justify-between text-xs">
        <p class="text-slate-500 dark:text-slate-400">total: {{ total }}</p>
        <div class="inline-flex items-center gap-2">
          <button type="button" class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50 dark:border-slate-700" :disabled="page <= 1" @click="page -= 1">Prev</button>
          <span>page {{ page }} / {{ totalPages }}</span>
          <button type="button" class="rounded border border-slate-300 px-2 py-1 disabled:opacity-50 dark:border-slate-700" :disabled="page >= totalPages" @click="page += 1">Next</button>
          <select v-model.number="pageSize" class="rounded border border-slate-300 px-1 py-1 dark:border-slate-700 dark:bg-slate-950">
            <option :value="20">20</option><option :value="50">50</option><option :value="100">100</option>
          </select>
        </div>
      </div>
    </article>
  </section>
</template>
