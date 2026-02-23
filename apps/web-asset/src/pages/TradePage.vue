<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import { getAssets, type AssetOut } from "../api/assets";
import { getLiabilities, type LiabilityOut } from "../api/liabilities";
import { getPortfolios, type PortfolioOut } from "../api/portfolios";
import {
  createTrade,
  getTrades,
  rebuildTrades,
  type TradeOut,
  updateTrade,
  voidTrade,
  type TradeCreateIn,
  type TradeRowOut,
  type TradeSortBy,
  type TransactionStatus,
  type TransactionType,
} from "../api/trades";
import { formatDateTimeSeoul, seoulDateToUtcNaiveIso } from "../utils/datetime";

const loading = ref(false);
const saving = ref(false);
const transferSaving = ref(false);
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
const quickGroup = ref<"ALL" | "LOAN" | "CASHFLOW" | "BUYSELL">("ALL");
const transferCollapsed = ref(false);
const entryCollapsed = ref(false);
const journalCollapsed = ref(false);
const TRADE_COLLAPSE_STORAGE_KEY = "myasset:trade:collapse-state";
const AUTO_SEARCH_DEBOUNCE_MS = 450;
let journalSearchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const journalAutoSearchPending = ref(false);
const suspendJournalAutoSearch = ref(false);

const portfolios = ref<PortfolioOut[]>([]);
const assets = ref<AssetOut[]>([]);
const liabilities = ref<LiabilityOut[]>([]);
const tradeTypes: TransactionType[] = [
  "BUY",
  "SELL",
  "DEPOSIT",
  "WITHDRAW",
  "DIVIDEND",
  "FEE",
  "ADJUSTMENT",
  "LOAN_BORROW",
  "LOAN_REPAY",
  "LOAN_INTEREST",
];
const statusOptions: TransactionStatus[] = ["POSTED", "VOID"];
const rebuildHintLines = [
  "DB/HeidiSQL에서 값 직접 수정 후 집계 복구",
  "거래 대량 입력/수정 후 holdings, portfolio, liability 재정렬",
  "Auto apply 설정 변경 후 전체 값 재계산",
  "수치 불일치 의심 시 강제 정합성 복구",
];

const form = reactive({
  portfolio_id: "",
  txn_type: "BUY" as TransactionType,
  asset_id: "",
  liability_id: "",
  quantity: "",
  unit_price: "",
  amount: "",
  fee_amount: "",
  currency: "KRW",
  memo: "",
  source_type: "MANUAL" as "MANUAL" | "AUTO",
  auto_apply_cash_holding: true,
  auto_apply_portfolio_cashflow: false,
});

const transferForm = reactive({
  from_portfolio_id: "",
  to_portfolio_id: "",
  amount: "",
  currency: "KRW",
  executed_at: "",
  memo: "",
  auto_apply_cash_holding: true,
  auto_apply_portfolio_cashflow: true,
});

const filters = reactive({
  q: "",
  portfolio_id: "",
  asset_id: "",
  liability_id: "",
  txn_type: "" as "" | TransactionType,
  status: "" as "" | TransactionStatus,
  from: "",
  to: "",
});

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
const isBuySell = computed(() => form.txn_type === "BUY" || form.txn_type === "SELL");
const isLoanTxn = computed(
  () => form.txn_type === "LOAN_BORROW" || form.txn_type === "LOAN_REPAY" || form.txn_type === "LOAN_INTEREST",
);
const canSelectAsset = computed(() => isBuySell.value || form.txn_type === "DIVIDEND");
const selectableLoanLiabilities = computed(() => {
  const selectedPortfolioId = toOptionalNumber(form.portfolio_id);
  return liabilities.value.filter(
    (row) => selectedPortfolioId === undefined || row.portfolio_id === selectedPortfolioId,
  );
});

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
  return formatDateTimeSeoul(value);
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

function restoreCollapseState() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(TRADE_COLLAPSE_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as {
      transferCollapsed?: unknown;
      entryCollapsed?: unknown;
      journalCollapsed?: unknown;
    };
    if (typeof parsed.transferCollapsed === "boolean") {
      transferCollapsed.value = parsed.transferCollapsed;
    }
    if (typeof parsed.entryCollapsed === "boolean") {
      entryCollapsed.value = parsed.entryCollapsed;
    }
    if (typeof parsed.journalCollapsed === "boolean") {
      journalCollapsed.value = parsed.journalCollapsed;
    }
  } catch {
    // ignore malformed or unavailable localStorage
  }
}

watch([transferCollapsed, entryCollapsed, journalCollapsed], ([transfer, entry, journal]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      TRADE_COLLAPSE_STORAGE_KEY,
      JSON.stringify({
        transferCollapsed: transfer,
        entryCollapsed: entry,
        journalCollapsed: journal,
      }),
    );
  } catch {
    // ignore storage write failure (private mode, quota, etc.)
  }
});

function resetForm() {
  editingId.value = null;
  form.portfolio_id = portfolios.value[0] ? String(portfolios.value[0].id) : "";
  form.txn_type = "BUY";
  form.asset_id = "";
  form.liability_id = "";
  form.quantity = "";
  form.unit_price = "";
  form.amount = "";
  form.fee_amount = "";
  form.currency = "KRW";
  form.memo = "";
  form.source_type = "MANUAL";
  form.auto_apply_cash_holding = true;
  form.auto_apply_portfolio_cashflow = false;
}

function resetTransferForm() {
  const fromId = portfolios.value[0]?.id;
  const toId = portfolios.value.find((item) => item.id !== fromId)?.id;
  transferForm.from_portfolio_id = fromId ? String(fromId) : "";
  transferForm.to_portfolio_id = toId ? String(toId) : "";
  transferForm.amount = "";
  transferForm.currency = "KRW";
  transferForm.executed_at = "";
  transferForm.memo = "";
  transferForm.auto_apply_cash_holding = true;
  transferForm.auto_apply_portfolio_cashflow = true;
}

function getPortfolioName(portfolioId: number | undefined): string {
  if (!portfolioId) return `#${portfolioId ?? "-"}`;
  const row = portfolios.value.find((item) => item.id === portfolioId);
  return row ? row.name : `#${portfolioId}`;
}

function applyEdit(row: TradeRowOut) {
  editingId.value = row.id;
  form.portfolio_id = String(row.portfolio_id);
  form.txn_type = row.txn_type;
  form.asset_id = row.asset_id ? String(row.asset_id) : "";
  form.liability_id = row.liability_id ? String(row.liability_id) : "";
  form.quantity = row.quantity == null ? "" : String(row.quantity);
  form.unit_price = row.unit_price == null ? "" : String(row.unit_price);
  form.amount = String(row.amount);
  form.fee_amount = "";
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
    payload.liability_id = null;
    payload.quantity = toOptionalNumber(form.quantity) ?? null;
    payload.unit_price = toOptionalNumber(form.unit_price) ?? null;
    payload.amount = toOptionalNumber(form.amount) ?? null;
  } else if (isLoanTxn.value) {
    payload.asset_id = null;
    payload.liability_id = Number(form.liability_id);
    payload.amount = toOptionalNumber(form.amount) ?? null;
  } else if (form.txn_type === "DIVIDEND") {
    payload.asset_id = toOptionalNumber(form.asset_id) ?? null;
    payload.liability_id = null;
    payload.amount = toOptionalNumber(form.amount) ?? null;
  } else {
    payload.asset_id = null;
    payload.liability_id = null;
    payload.amount = toOptionalNumber(form.amount) ?? null;
  }
  return payload;
}

async function submitTransfer() {
  const fromPortfolioId = toOptionalNumber(transferForm.from_portfolio_id);
  const toPortfolioId = toOptionalNumber(transferForm.to_portfolio_id);
  const amount = toOptionalNumber(transferForm.amount);
  const currency = transferForm.currency.trim().toUpperCase();
  const memo = transferForm.memo.trim();
  const executedAt = transferForm.executed_at.trim();

  if (!fromPortfolioId) {
    errorMessage.value = "From portfolio is required.";
    return;
  }
  if (!toPortfolioId) {
    errorMessage.value = "To portfolio is required.";
    return;
  }
  if (fromPortfolioId === toPortfolioId) {
    errorMessage.value = "From and To portfolios must be different.";
    return;
  }
  if (!amount || amount <= 0) {
    errorMessage.value = "Transfer amount must be > 0.";
    return;
  }
  if (currency.length !== 3) {
    errorMessage.value = "Currency must be 3 letters.";
    return;
  }
  if (!window.confirm("Create transfer (WITHDRAW + DEPOSIT) now?")) return;

  transferSaving.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  let withdrawTradeId: number | null = null;
  try {
    const fromName = getPortfolioName(fromPortfolioId);
    const toName = getPortfolioName(toPortfolioId);
    const baseMemo = memo || `${fromName} -> ${toName}`;
    const timeMemo = new Date().toISOString();

    const withdrawPayload: TradeCreateIn = {
      portfolio_id: fromPortfolioId,
      txn_type: "WITHDRAW",
      amount,
      currency,
      executed_at: executedAt || null,
      memo: `[TRANSFER OUT] ${baseMemo} (${timeMemo})`,
      source_type: "MANUAL",
      auto_apply_cash_holding: transferForm.auto_apply_cash_holding,
      auto_apply_portfolio_cashflow: transferForm.auto_apply_portfolio_cashflow,
    };

    const withdrawTx = await createTrade(withdrawPayload);
    withdrawTradeId = withdrawTx.id;

    const depositPayload: TradeCreateIn = {
      portfolio_id: toPortfolioId,
      txn_type: "DEPOSIT",
      amount,
      currency,
      executed_at: executedAt || null,
      memo: `[TRANSFER IN] ${baseMemo} (${timeMemo})`,
      source_type: "MANUAL",
      auto_apply_cash_holding: transferForm.auto_apply_cash_holding,
      auto_apply_portfolio_cashflow: transferForm.auto_apply_portfolio_cashflow,
    };

    const depositTx = await createTrade(depositPayload);
    successMessage.value = `Transfer created. withdraw=#${withdrawTx.id}, deposit=#${depositTx.id}`;
    await loadTrades();
    resetTransferForm();
  } catch (error) {
    if (withdrawTradeId !== null) {
      try {
        await voidTrade(withdrawTradeId);
        errorMessage.value = `Transfer failed on deposit leg. Withdraw #${withdrawTradeId} was voided. (${parseApiError(error)})`;
      } catch (rollbackError) {
        errorMessage.value = `Transfer failed and rollback failed for withdraw #${withdrawTradeId}. ${parseApiError(error)} / rollback: ${parseApiError(rollbackError)}`;
      }
    } else {
      errorMessage.value = `Transfer failed: ${parseApiError(error)}`;
    }
  } finally {
    transferSaving.value = false;
  }
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
      liability_id: toOptionalNumber(filters.liability_id),
      txn_type: filters.txn_type || undefined,
      txn_group: quickGroup.value === "ALL" ? undefined : quickGroup.value,
      status: filters.status || undefined,
      from: seoulDateToUtcNaiveIso(filters.from, false),
      to: seoulDateToUtcNaiveIso(filters.to, true),
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
  if (isLoanTxn.value && !form.liability_id) {
    errorMessage.value = "Liability is required for LOAN_BORROW/LOAN_REPAY/LOAN_INTEREST.";
    return;
  }
  const feeAmount = isBuySell.value && !editingId.value ? toOptionalNumber(form.fee_amount) ?? 0 : 0;
  if (feeAmount < 0) {
    errorMessage.value = "Fee must be >= 0.";
    return;
  }
  const confirmMessage = editingId.value
    ? "Update this trade?"
    : feeAmount > 0
      ? "Create BUY/SELL trade + FEE trade?"
      : "Create this trade?";
  if (!window.confirm(confirmMessage)) return;

  saving.value = true;
  errorMessage.value = "";
  successMessage.value = "";
  try {
    const payload = buildPayload();
    if (editingId.value) {
      await updateTrade(editingId.value, payload);
      successMessage.value = `Trade #${editingId.value} updated.`;
    } else {
      let createdMain: TradeOut | null = null;
      let createdFee: TradeOut | null = null;
      try {
        createdMain = await createTrade(payload);
        if (isBuySell.value && feeAmount > 0) {
          const feePayload: TradeCreateIn = {
            portfolio_id: Number(form.portfolio_id),
            txn_type: "FEE",
            asset_id: null,
            liability_id: null,
            amount: feeAmount,
            currency: form.currency.trim().toUpperCase(),
            memo: form.memo.trim()
              ? `[AUTO_FEE for #${createdMain.id}] ${form.memo.trim()}`
              : `[AUTO_FEE for #${createdMain.id}]`,
            source_type: form.source_type,
            auto_apply_cash_holding: form.auto_apply_cash_holding,
            auto_apply_portfolio_cashflow: false,
          };
          createdFee = await createTrade(feePayload);
        }
      } catch (error) {
        if (createdFee) {
          try {
            await voidTrade(createdFee.id);
          } catch {
            // keep original error handling below
          }
        }
        if (createdMain) {
          try {
            await voidTrade(createdMain.id);
          } catch {
            // keep original error handling below
          }
        }
        throw error;
      }
      if (createdMain && createdFee) {
        successMessage.value = `Trades created. main=#${createdMain.id}, fee=#${createdFee.id}`;
      } else if (createdMain) {
        successMessage.value = `Trade #${createdMain.id} created.`;
      }
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
    const result = await rebuildTrades({
      portfolio_id: toOptionalNumber(filters.portfolio_id) ?? null,
      asset_id: toOptionalNumber(filters.asset_id) ?? null,
      liability_id: toOptionalNumber(filters.liability_id) ?? null,
    });
    successMessage.value =
      `Rebuild done. portfolios=${result.affected_portfolios}, holdings=${result.affected_holdings}, liabilities=${result.affected_liabilities}`;
    await loadTrades();
  } catch (error) {
    errorMessage.value = parseApiError(error);
  } finally {
    rebuilding.value = false;
  }
}

async function applyFilters() {
  suspendJournalAutoSearch.value = true;
  try {
    clearJournalSearchDebounce();
    page.value = 1;
    await loadTrades();
  } finally {
    suspendJournalAutoSearch.value = false;
  }
}

async function resetFilters() {
  suspendJournalAutoSearch.value = true;
  try {
    clearJournalSearchDebounce();
    filters.q = "";
    filters.portfolio_id = "";
    filters.asset_id = "";
    filters.liability_id = "";
    filters.txn_type = "";
    filters.status = "";
    filters.from = "";
    filters.to = "";
    quickGroup.value = "ALL";
    page.value = 1;
    await loadTrades();
  } finally {
    suspendJournalAutoSearch.value = false;
  }
}

async function setQuickGroup(next: "ALL" | "LOAN" | "CASHFLOW" | "BUYSELL") {
  suspendJournalAutoSearch.value = true;
  try {
    clearJournalSearchDebounce();
    quickGroup.value = next;
    page.value = 1;
    await loadTrades();
  } finally {
    suspendJournalAutoSearch.value = false;
  }
}

function clearJournalSearchDebounce(): void {
  if (!journalSearchDebounceTimer) return;
  clearTimeout(journalSearchDebounceTimer);
  journalSearchDebounceTimer = null;
  journalAutoSearchPending.value = false;
}

async function applyJournalFiltersDebounced(): Promise<void> {
  try {
    if (page.value !== 1) {
      page.value = 1;
      return;
    }
    await loadTrades();
  } finally {
    journalAutoSearchPending.value = false;
  }
}

function queueJournalSearch(): void {
  clearJournalSearchDebounce();
  journalAutoSearchPending.value = true;
  journalSearchDebounceTimer = setTimeout(() => {
    journalSearchDebounceTimer = null;
    void applyJournalFiltersDebounced();
  }, AUTO_SEARCH_DEBOUNCE_MS);
}

watch(
  () => form.txn_type,
  (next) => {
    if (next === "DEPOSIT" || next === "WITHDRAW") {
      form.asset_id = "";
      form.liability_id = "";
      form.auto_apply_portfolio_cashflow = true;
    } else if (next === "LOAN_BORROW" || next === "LOAN_REPAY" || next === "LOAN_INTEREST") {
      form.asset_id = "";
      form.auto_apply_portfolio_cashflow = false;
    } else {
      form.liability_id = "";
      form.auto_apply_portfolio_cashflow = false;
    }
    if (next !== "BUY" && next !== "SELL") {
      form.fee_amount = "";
    }
  },
);

watch([page, pageSize], () => void loadTrades());
watch(
  [
    () => filters.q,
    () => filters.portfolio_id,
    () => filters.asset_id,
    () => filters.liability_id,
    () => filters.txn_type,
    () => filters.status,
    () => filters.from,
    () => filters.to,
  ],
  () => {
    if (suspendJournalAutoSearch.value) return;
    queueJournalSearch();
  },
);
watch(
  [() => form.portfolio_id, selectableLoanLiabilities],
  () => {
    if (!form.liability_id) return;
    const selected = Number(form.liability_id);
    const allowed = selectableLoanLiabilities.value.some((row) => row.id === selected);
    if (!allowed) {
      form.liability_id = "";
    }
  },
  { deep: true },
);

onMounted(async () => {
  restoreCollapseState();
  const [portfolioData, assetData, liabilityData] = await Promise.all([
    getPortfolios(),
    getAssets(),
    getLiabilities({ include_hidden: true, include_excluded: true }),
  ]);
  portfolios.value = portfolioData;
  assets.value = assetData;
  liabilities.value = liabilityData;
  resetForm();
  resetTransferForm();
  await loadTrades();
  journalAutoSearchPending.value = false;
});

onBeforeUnmount(() => {
  clearJournalSearchDebounce();
});
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Trade</p>
      <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Manual Trade Ledger</h1>
    </header>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.08em] text-cyan-700 dark:text-cyan-300">Transfer</p>
          <h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Portfolio To Portfolio Transfer</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">한 번 입력하면 WITHDRAW + DEPOSIT 두 거래를 자동 생성합니다.</p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :aria-expanded="!transferCollapsed"
          @click="transferCollapsed = !transferCollapsed"
        >
          {{ transferCollapsed ? "Expand" : "Collapse" }}
        </button>
      </div>

      <div v-if="!transferCollapsed" class="mt-3 space-y-3">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300"
          >From Portfolio
          <select
            v-model="transferForm.from_portfolio_id"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">Select</option>
            <option v-for="p in portfolios" :key="`from-${p.id}`" :value="String(p.id)">#{{ p.id }} {{ p.name }}</option>
          </select>
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300"
          >To Portfolio
          <select
            v-model="transferForm.to_portfolio_id"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">Select</option>
            <option v-for="p in portfolios" :key="`to-${p.id}`" :value="String(p.id)">#{{ p.id }} {{ p.name }}</option>
          </select>
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300"
          >Amount
          <input
            v-model="transferForm.amount"
            placeholder="1000000"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300"
          >Currency
          <input
            v-model="transferForm.currency"
            maxlength="3"
            placeholder="KRW"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300 md:col-span-2"
          >Executed At (optional)
          <input
            v-model="transferForm.executed_at"
            type="datetime-local"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300 md:col-span-2"
          >Memo (optional)
          <input
            v-model="transferForm.memo"
            placeholder="예: Toss -> Upbit transfer"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>

      <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
        <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
          <input v-model="transferForm.auto_apply_cash_holding" type="checkbox" class="h-4 w-4" />
          <span>Auto apply to cash holding</span>
        </label>
        <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
          <input v-model="transferForm.auto_apply_portfolio_cashflow" type="checkbox" class="h-4 w-4" />
          <span>Auto apply to net contribution</span>
        </label>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <button
          type="button"
          class="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60"
          :disabled="transferSaving"
          @click="submitTransfer"
        >
          {{ transferSaving ? "Transferring..." : "Create Transfer" }}
        </button>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :disabled="transferSaving"
          @click="resetTransferForm"
        >
          Reset Transfer
        </button>
      </div>
      </div>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-300">Entry</p>
          <h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Manual Trade Entry</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">수동 거래를 입력하고 holdings, portfolio, liability 집계에 반영합니다.</p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :aria-expanded="!entryCollapsed"
          @click="entryCollapsed = !entryCollapsed"
        >
          {{ entryCollapsed ? "Expand" : "Collapse" }}
        </button>
      </div>

      <div v-if="!entryCollapsed" class="mt-3 space-y-3">
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
            <select v-model="form.asset_id" :disabled="!canSelectAsset" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950">
              <option value="">Select</option>
              <option v-for="a in assets" :key="a.id" :value="String(a.id)">#{{ a.id }} {{ a.name }}</option>
            </select>
          </label>
          <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Liability
            <select v-model="form.liability_id" :disabled="!isLoanTxn" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950">
              <option value="">Select</option>
              <option v-for="l in selectableLoanLiabilities" :key="l.id" :value="String(l.id)">#{{ l.id }} {{ l.name }}</option>
            </select>
            <p class="mt-1 text-[11px] normal-case text-slate-500 dark:text-slate-400">Shows liabilities linked to selected portfolio.</p>
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
          <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Fee (optional)
            <input
              v-model="form.fee_amount"
              :disabled="!isBuySell || !!editingId"
              placeholder="0"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
            />
            <p class="mt-1 text-[11px] normal-case text-slate-500 dark:text-slate-400">
              BUY/SELL create 시 fee > 0 이면 FEE 거래가 추가로 생성됩니다.
            </p>
          </label>
          <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Source
            <select v-model="form.source_type" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
              <option value="MANUAL">MANUAL</option>
              <option value="AUTO">AUTO</option>
            </select>
          </label>
        </div>

        <label class="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Memo
          <input v-model="form.memo" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        </label>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-2">
          <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            <input v-model="form.auto_apply_cash_holding" type="checkbox" class="h-4 w-4" />
            <span>Auto apply to cash holding</span>
          </label>
          <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            <input v-model="form.auto_apply_portfolio_cashflow" type="checkbox" class="h-4 w-4" />
            <span>Auto apply to net contribution</span>
          </label>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60" :disabled="saving" @click="submit">
            {{ saving ? "Saving..." : editingId ? "Update Trade" : "Create Trade" }}
          </button>
          <button type="button" class="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="resetForm">Reset</button>
          <div class="group relative inline-flex items-center gap-1">
            <button
              type="button"
              class="rounded-lg border border-cyan-300 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 disabled:opacity-60 dark:border-cyan-800 dark:text-cyan-300 dark:hover:bg-cyan-900/30"
              :disabled="rebuilding"
              @click="onRebuild"
            >
              {{ rebuilding ? "Rebuilding..." : "Rebuild Ledger Sync" }}
            </button>
            <button
              type="button"
              aria-label="Rebuild usage guide"
              class="inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              i
            </button>
            <div
              class="pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-[24rem] rounded-xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 shadow-xl backdrop-blur-sm group-hover:block group-focus-within:block dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200"
            >
              <p class="font-semibold text-slate-900 dark:text-slate-100">Rebuild Ledger Sync 사용 가이드</p>
              <ul class="mt-2 list-disc space-y-1 pl-4">
                <li v-for="line in rebuildHintLines" :key="line">{{ line }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </article>

    <article v-if="errorMessage" class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">{{ errorMessage }}</article>
    <article v-if="successMessage" class="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">{{ successMessage }}</article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:text-indigo-300">Journal</p>
          <h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Trade Journal</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">필터/정렬/페이지네이션으로 거래 이력을 조회하고 편집/무효화합니다.</p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :aria-expanded="!journalCollapsed"
          @click="journalCollapsed = !journalCollapsed"
        >
          {{ journalCollapsed ? "Expand" : "Collapse" }}
        </button>
      </div>

      <div v-if="!journalCollapsed" class="mt-3 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="quickGroup === 'ALL' ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="setQuickGroup('ALL')"
          >
            ALL
          </button>
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="quickGroup === 'LOAN' ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="setQuickGroup('LOAN')"
          >
            LOAN
          </button>
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="quickGroup === 'CASHFLOW' ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="setQuickGroup('CASHFLOW')"
          >
            CASHFLOW
          </button>
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="quickGroup === 'BUYSELL' ? 'border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="setQuickGroup('BUYSELL')"
          >
            BUYSELL
          </button>
        </div>
        <div class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-8">
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
          <input
            v-model="filters.liability_id"
            type="number"
            min="1"
            placeholder="Liability ID"
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
          <input v-model="filters.from" type="date" class="rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          <input v-model="filters.to" type="date" class="rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
        </div>
        <div class="flex items-center gap-2">
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
          <span
            v-if="journalAutoSearchPending"
            class="inline-flex items-center gap-1 rounded-md border border-cyan-400/60 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-700 dark:bg-cyan-900/25 dark:text-cyan-300"
          >
            <span class="h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-500 dark:bg-cyan-400"></span>
            Searching while typing...
          </span>
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
                <th class="px-2 py-2 text-left">
                  <button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('liability_name')">
                    Liability <span class="opacity-70">{{ sortIndicator("liability_name") }}</span>
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
                <th class="px-2 py-2 text-center">Auto Net Contribution</th>
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
                <td colspan="12" class="px-2 py-6 text-center text-slate-500 dark:text-slate-400">No trades</td>
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
                <td class="px-2 py-2">
                  <span v-if="row.liability_id">#{{ row.liability_id }} {{ row.liability_name ?? "-" }}</span>
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
        <div class="flex items-center justify-between text-xs">
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
      </div>
    </article>
  </section>
</template>
