<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import { getAssets, type AssetOut } from "../api/assets";
import {
  getLiabilities,
  rebaselineLiability,
  type LiabilityOut,
  updateLiability,
} from "../api/liabilities";
import { getHoldings, rebaselineHolding, type HoldingOut } from "../api/holdings";
import { getPortfolios, rebaselinePortfolio, type PortfolioOut } from "../api/portfolios";
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
import { formatDateTimeSeoul, seoulDateToUtcNaiveIso, toDateTimeLocalSeoul } from "../utils/datetime";

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
const setActionsCollapsed = ref(false);
const setActionTab = ref<"PORTFOLIO" | "HOLDING" | "LIABILITY" | "CASH">("PORTFOLIO");
const journalCollapsed = ref(false);
const TRADE_COLLAPSE_STORAGE_KEY = "myasset:trade:collapse-state";
const TRADE_CARD_ORDER_STORAGE_KEY = "myasset:trade:card-order";
const TRADE_SET_ACTION_LOGS_STORAGE_KEY = "myasset:trade:set-action-logs";
const AUTO_SEARCH_DEBOUNCE_MS = 450;
let journalSearchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const journalAutoSearchPending = ref(false);
const suspendJournalAutoSearch = ref(false);
const setActionSaving = ref(false);
type TradeCardKey = "SET" | "TRANSFER" | "ENTRY";
const DEFAULT_TRADE_CARD_ORDER: TradeCardKey[] = ["SET", "TRANSFER", "ENTRY"];
const tradeCardOrder = ref<TradeCardKey[]>([...DEFAULT_TRADE_CARD_ORDER]);
const tradeCardDraggingKey = ref<TradeCardKey | null>(null);
type SetActionKey = "PORTFOLIO" | "HOLDING" | "LIABILITY" | "CASH";
const setActionLogs = reactive<Record<SetActionKey, string[]>>({
  PORTFOLIO: [],
  HOLDING: [],
  LIABILITY: [],
  CASH: [],
});

const portfolios = ref<PortfolioOut[]>([]);
const assets = ref<AssetOut[]>([]);
const liabilities = ref<LiabilityOut[]>([]);
const holdings = ref<HoldingOut[]>([]);
const tradeTypes: TransactionType[] = [
  "BUY",
  "SELL",
  "DEPOSIT",
  "WITHDRAW",
  "DIVIDEND",
  "FEE",
  "ADJUSTMENT",
  "BALANCE_SET",
  "LOAN_BORROW",
  "LOAN_REPAY",
  "LOAN_INTEREST",
];
const tradeTypeLabelMap: Record<TransactionType, string> = {
  BUY: "BUY",
  SELL: "SELL",
  DEPOSIT: "DEPOSIT",
  WITHDRAW: "WITHDRAW",
  DIVIDEND: "DIVIDEND",
  FEE: "FEE",
  ADJUSTMENT: "ADJUSTMENT",
  BALANCE_SET: "BALANCE_SET (Set Cash Balance)",
  LOAN_BORROW: "LOAN_BORROW",
  LOAN_REPAY: "LOAN_REPAY",
  LOAN_INTEREST: "LOAN_INTEREST",
};
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

const setPortfolioForm = reactive({
  portfolio_id: "",
  effective_at: "",
  rebaseline_all_history: true,
  auto_apply_cash_holding: false,
  cumulative_deposit_amount: "",
  cumulative_withdrawal_amount: "",
  reason: "",
});

const setHoldingForm = reactive({
  portfolio_id: "",
  holding_id: "",
  effective_at: "",
  rebaseline_all_history: true,
  auto_apply_cash_holding: false,
  quantity: "",
  avg_cost: "",
  avg_cost_currency: "KRW",
  cost_basis_total: "",
  cost_basis_currency: "KRW",
  reason: "",
});

const setLiabilityForm = reactive({
  portfolio_id: "",
  liability_id: "",
  effective_at: "",
  rebaseline_all_history: true,
  auto_apply_cash_holding: false,
  outstanding_balance: "",
  interest_rate: "",
  reason: "",
});

const setCashForm = reactive({
  portfolio_id: "",
  currency: "KRW",
  target_balance: "",
  effective_at: "",
  memo: "",
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
const isBalanceSet = computed(() => form.txn_type === "BALANCE_SET");
const isLoanTxn = computed(
  () => form.txn_type === "LOAN_BORROW" || form.txn_type === "LOAN_REPAY" || form.txn_type === "LOAN_INTEREST",
);
const canSelectAsset = computed(() => isBuySell.value || form.txn_type === "DIVIDEND");
const portfolioById = computed(() => new Map(portfolios.value.map((item) => [item.id, item])));
const assetById = computed(() => new Map(assets.value.map((item) => [item.id, item])));
const holdingsWithMeta = computed(() =>
  holdings.value
    .filter((item) => item.portfolio_id !== null)
    .map((item) => {
      const portfolio = item.portfolio_id === null ? undefined : portfolioById.value.get(item.portfolio_id);
      const asset = assetById.value.get(item.asset_id);
      const assetSymbol = (asset?.symbol || "").toUpperCase();
      const assetName = asset?.name || `#${item.asset_id}`;
      const isAutoCash = assetSymbol.startsWith("CASH_") || assetName.toUpperCase().includes("AUTO CASH BALANCE");
      return {
        ...item,
        portfolio_name: portfolio?.name || `#${item.portfolio_id}`,
        asset_name: assetName,
        asset_symbol: asset?.symbol || null,
        asset_currency: (asset?.currency || item.avg_price_currency || "KRW").toUpperCase(),
        is_auto_cash: isAutoCash,
      };
    }),
);
const filteredSetHoldings = computed(() => {
  const selectedPortfolioId = toOptionalNumber(setHoldingForm.portfolio_id);
  const visible = holdingsWithMeta.value.filter((item) => !item.is_auto_cash);
  if (selectedPortfolioId === undefined) return visible;
  return visible.filter((item) => item.portfolio_id === selectedPortfolioId);
});
const selectedSetHolding = computed(() => {
  const holdingId = toOptionalNumber(setHoldingForm.holding_id);
  if (holdingId === undefined) return undefined;
  return holdingsWithMeta.value.find((item) => item.id === holdingId);
});
const filteredSetLiabilities = computed(() => {
  const selectedPortfolioId = toOptionalNumber(setLiabilityForm.portfolio_id);
  if (selectedPortfolioId === undefined) return liabilities.value;
  return liabilities.value.filter((item) => item.portfolio_id === selectedPortfolioId);
});
const supportedCurrencies = computed(() => {
  const values = new Set<string>(["KRW", "USD"]);
  for (const row of portfolios.value) {
    if (row.base_currency) values.add(String(row.base_currency).toUpperCase());
  }
  for (const row of assets.value) {
    if (row.currency) values.add(String(row.currency).toUpperCase());
  }
  for (const row of liabilities.value) {
    if (row.currency) values.add(String(row.currency).toUpperCase());
  }
  for (const row of holdings.value) {
    if (row.avg_price_currency) values.add(String(row.avg_price_currency).toUpperCase());
    if (row.invested_amount_currency) values.add(String(row.invested_amount_currency).toUpperCase());
  }
  const ordered = [...values].filter((item) => item !== "KRW" && item !== "USD").sort();
  return ["KRW", "USD", ...ordered];
});
const autoCashBalanceByPortfolioCurrency = computed(() => {
  const out = new Map<string, number>();
  for (const item of holdingsWithMeta.value) {
    if (item.portfolio_id === null || !item.is_auto_cash) continue;
    const currency = (item.avg_price_currency || item.asset_currency || "KRW").toUpperCase();
    const key = `${item.portfolio_id}:${currency}`;
    const amount = item.invested_amount == null
      ? toFiniteNumber(item.quantity) * toFiniteNumber(item.avg_price)
      : toFiniteNumber(item.invested_amount);
    out.set(key, (out.get(key) || 0) + amount);
  }
  return out;
});
const amountLabel = computed(() => (isBalanceSet.value ? "Target Balance" : "Amount"));
const amountHint = computed(() =>
  isBalanceSet.value
    ? "Set Cash Balance: 입력한 값이 해당 포트폴리오/통화의 현금 잔액으로 맞춰집니다."
    : "",
);
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

function toFiniteNumber(value: string | number | null | undefined): number {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : 0;
}

function toNumericInputString(value: number): string {
  if (!Number.isFinite(value)) return "0";
  if (Number.isInteger(value)) return String(value);
  return String(Number(value.toFixed(8)));
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
      setActionsCollapsed?: unknown;
      setActionTab?: unknown;
      journalCollapsed?: unknown;
    };
    if (typeof parsed.transferCollapsed === "boolean") {
      transferCollapsed.value = parsed.transferCollapsed;
    }
    if (typeof parsed.entryCollapsed === "boolean") {
      entryCollapsed.value = parsed.entryCollapsed;
    }
    if (typeof parsed.setActionsCollapsed === "boolean") {
      setActionsCollapsed.value = parsed.setActionsCollapsed;
    }
    if (
      parsed.setActionTab === "PORTFOLIO"
      || parsed.setActionTab === "HOLDING"
      || parsed.setActionTab === "LIABILITY"
      || parsed.setActionTab === "CASH"
    ) {
      setActionTab.value = parsed.setActionTab;
    }
    if (typeof parsed.journalCollapsed === "boolean") {
      journalCollapsed.value = parsed.journalCollapsed;
    }
  } catch {
    // ignore malformed or unavailable localStorage
  }
}

function restoreSetActionLogs() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(TRADE_SET_ACTION_LOGS_STORAGE_KEY);
    if (!raw) return;
    const parsed = JSON.parse(raw) as Partial<Record<SetActionKey, unknown>>;
    const keys: SetActionKey[] = ["PORTFOLIO", "HOLDING", "LIABILITY", "CASH"];
    for (const key of keys) {
      const value = parsed[key];
      if (!Array.isArray(value)) continue;
      const logs = value.filter((line): line is string => typeof line === "string").slice(0, 2);
      setActionLogs[key].splice(0, setActionLogs[key].length, ...logs);
    }
  } catch {
    // ignore malformed or unavailable localStorage
  }
}

function normalizeTradeCardOrder(value: unknown): TradeCardKey[] {
  if (!Array.isArray(value)) return [...DEFAULT_TRADE_CARD_ORDER];
  const allowed = new Set<TradeCardKey>(DEFAULT_TRADE_CARD_ORDER);
  const next: TradeCardKey[] = [];
  for (const item of value) {
    if ((item === "SET" || item === "TRANSFER" || item === "ENTRY") && !next.includes(item)) {
      next.push(item);
    }
  }
  for (const key of DEFAULT_TRADE_CARD_ORDER) {
    if (allowed.has(key) && !next.includes(key)) {
      next.push(key);
    }
  }
  return next;
}

function restoreTradeCardOrder() {
  if (typeof window === "undefined") return;
  try {
    const raw = window.localStorage.getItem(TRADE_CARD_ORDER_STORAGE_KEY);
    if (!raw) return;
    tradeCardOrder.value = normalizeTradeCardOrder(JSON.parse(raw));
  } catch {
    // ignore malformed or unavailable localStorage
  }
}

function getTradeCardOrder(key: TradeCardKey): number {
  const index = tradeCardOrder.value.indexOf(key);
  return index === -1 ? DEFAULT_TRADE_CARD_ORDER.indexOf(key) : index;
}

function onTradeCardDragStart(key: TradeCardKey, event: DragEvent) {
  tradeCardDraggingKey.value = key;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", key);
  }
}

function onTradeCardDragOver(event: DragEvent) {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

function onTradeCardDrop(targetKey: TradeCardKey, event: DragEvent) {
  event.preventDefault();
  const sourceKey = (tradeCardDraggingKey.value
    || event.dataTransfer?.getData("text/plain")) as TradeCardKey | null;
  if (!sourceKey || sourceKey === targetKey) {
    tradeCardDraggingKey.value = null;
    return;
  }
  const current = [...tradeCardOrder.value];
  const fromIndex = current.indexOf(sourceKey);
  const toIndex = current.indexOf(targetKey);
  if (fromIndex === -1 || toIndex === -1) {
    tradeCardDraggingKey.value = null;
    return;
  }
  current.splice(fromIndex, 1);
  current.splice(toIndex, 0, sourceKey);
  tradeCardOrder.value = normalizeTradeCardOrder(current);
  tradeCardDraggingKey.value = null;
}

function onTradeCardDragEnd() {
  tradeCardDraggingKey.value = null;
}

watch([transferCollapsed, entryCollapsed, setActionsCollapsed, setActionTab, journalCollapsed], ([transfer, entry, setCollapsed, tab, journal]) => {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      TRADE_COLLAPSE_STORAGE_KEY,
      JSON.stringify({
        transferCollapsed: transfer,
        entryCollapsed: entry,
        setActionsCollapsed: setCollapsed,
        setActionTab: tab,
        journalCollapsed: journal,
      }),
    );
  } catch {
    // ignore storage write failure (private mode, quota, etc.)
  }
});

watch(
  () => ({
    PORTFOLIO: [...setActionLogs.PORTFOLIO],
    HOLDING: [...setActionLogs.HOLDING],
    LIABILITY: [...setActionLogs.LIABILITY],
    CASH: [...setActionLogs.CASH],
  }),
  (next) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(TRADE_SET_ACTION_LOGS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore storage write failure
    }
  },
  { deep: false },
);

watch(
  tradeCardOrder,
  (next) => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(TRADE_CARD_ORDER_STORAGE_KEY, JSON.stringify(normalizeTradeCardOrder(next)));
    } catch {
      // ignore storage write failure
    }
  },
  { deep: true },
);

function nowDateTimeLocalInput(): string {
  return toDateTimeLocalSeoul(new Date());
}

function parseEffectiveAt(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("effective_at is required");
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) throw new Error("effective_at is invalid");
  return parsed.toISOString();
}

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

function resetSetPortfolioForm(): void {
  const first = portfolios.value[0];
  setPortfolioForm.portfolio_id = first ? String(first.id) : "";
  setPortfolioForm.effective_at = nowDateTimeLocalInput();
  setPortfolioForm.rebaseline_all_history = true;
  setPortfolioForm.auto_apply_cash_holding = false;
  setPortfolioForm.cumulative_deposit_amount = first ? String(first.cumulative_deposit_amount) : "0";
  setPortfolioForm.cumulative_withdrawal_amount = first ? String(first.cumulative_withdrawal_amount) : "0";
  setPortfolioForm.reason = "";
}

function resetSetHoldingForm(): void {
  const firstPortfolio = portfolios.value[0];
  setHoldingForm.portfolio_id = firstPortfolio ? String(firstPortfolio.id) : "";
  setHoldingForm.holding_id = "";
  setHoldingForm.effective_at = nowDateTimeLocalInput();
  setHoldingForm.rebaseline_all_history = true;
  setHoldingForm.auto_apply_cash_holding = false;
  setHoldingForm.quantity = "";
  setHoldingForm.avg_cost = "";
  setHoldingForm.avg_cost_currency = "KRW";
  setHoldingForm.cost_basis_total = "";
  setHoldingForm.cost_basis_currency = "KRW";
  setHoldingForm.reason = "";
}

function resetSetLiabilityForm(): void {
  const firstPortfolio = portfolios.value[0];
  setLiabilityForm.portfolio_id = firstPortfolio ? String(firstPortfolio.id) : "";
  setLiabilityForm.liability_id = "";
  setLiabilityForm.effective_at = nowDateTimeLocalInput();
  setLiabilityForm.rebaseline_all_history = true;
  setLiabilityForm.auto_apply_cash_holding = false;
  setLiabilityForm.outstanding_balance = "";
  setLiabilityForm.interest_rate = "";
  setLiabilityForm.reason = "";
}

function resetSetCashForm(): void {
  const firstPortfolio = portfolios.value[0];
  setCashForm.portfolio_id = firstPortfolio ? String(firstPortfolio.id) : "";
  setCashForm.currency = (firstPortfolio?.base_currency || "KRW").toUpperCase();
  setCashForm.target_balance = "0";
  setCashForm.effective_at = nowDateTimeLocalInput();
  setCashForm.memo = "";
}

function resetSetForms(): void {
  resetSetPortfolioForm();
  resetSetHoldingForm();
  resetSetLiabilityForm();
  resetSetCashForm();
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

async function loadReferenceData(): Promise<void> {
  const [portfolioData, assetData, liabilityData, holdingData] = await Promise.all([
    getPortfolios(),
    getAssets(),
    getLiabilities({ include_hidden: true, include_excluded: true }),
    getHoldings({ include_hidden: true, include_excluded_portfolios: true }),
  ]);
  portfolios.value = portfolioData;
  assets.value = assetData;
  liabilities.value = liabilityData;
  holdings.value = holdingData;
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

function formatBaselineInfo(ids: number[]): string {
  return ids.length ? ids.join(",") : "-";
}

function parseNonNegativeNumber(raw: string, fieldName: string): number {
  const parsed = toOptionalNumber(raw);
  if (parsed === undefined) throw new Error(`${fieldName} is required.`);
  if (parsed < 0) throw new Error(`${fieldName} must be >= 0.`);
  return parsed;
}

function appendSetActionLog(action: SetActionKey, status: "OK" | "ERROR", message: string): void {
  const stamp = formatDateTimeSeoul(new Date().toISOString());
  setActionLogs[action].unshift(`${stamp} [${status}] ${message}`);
  if (setActionLogs[action].length > 2) setActionLogs[action].length = 2;
}

function clearSetActionLogs(action: SetActionKey): void {
  setActionLogs[action].splice(0, setActionLogs[action].length);
}

function getSetCashCurrentBalance(portfolioId: number, currency: string): number {
  const key = `${portfolioId}:${currency.trim().toUpperCase()}`;
  const current = autoCashBalanceByPortfolioCurrency.value.get(key);
  return current === undefined ? 0 : current;
}

function syncSetCashTargetFromCurrent(): void {
  const portfolioId = toOptionalNumber(setCashForm.portfolio_id);
  if (!portfolioId) {
    setCashForm.target_balance = "0";
    return;
  }
  const currency = setCashForm.currency.trim().toUpperCase();
  if (currency.length !== 3) {
    setCashForm.target_balance = "0";
    return;
  }
  const current = getSetCashCurrentBalance(portfolioId, currency);
  setCashForm.target_balance = toNumericInputString(current);
}

async function submitPortfolioSet(): Promise<void> {
  const portfolioId = toOptionalNumber(setPortfolioForm.portfolio_id);
  if (!portfolioId) {
    const message = "Portfolio is required for Portfolio Net Contribution Set.";
    errorMessage.value = message;
    appendSetActionLog("PORTFOLIO", "ERROR", message);
    return;
  }
  let startedAt = 0;
  try {
    const deposit = parseNonNegativeNumber(setPortfolioForm.cumulative_deposit_amount, "Cumulative deposit");
    const withdraw = parseNonNegativeNumber(setPortfolioForm.cumulative_withdrawal_amount, "Cumulative withdrawal");
    const effectiveAt = parseEffectiveAt(setPortfolioForm.effective_at);
    const allHistory = !!setPortfolioForm.rebaseline_all_history;
    const confirmMessage = allHistory
      ? "Apply Portfolio Net Contribution Set? (전체 과거 DEPOSIT/WITHDRAW 거래를 VOID 후 기준점 재생성)"
      : "Apply Portfolio Net Contribution Set? (기준시각 이전 DEPOSIT/WITHDRAW 거래를 VOID 후 기준점 재생성)";
    if (!window.confirm(confirmMessage)) return;

    startedAt = performance.now();
    setActionSaving.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    const out = await rebaselinePortfolio(portfolioId, {
      effective_at: effectiveAt,
      rebaseline_all_history: allHistory,
      auto_apply_cash_holding: !!setPortfolioForm.auto_apply_cash_holding,
      cumulative_deposit_amount: deposit,
      cumulative_withdrawal_amount: withdraw,
      reason: setPortfolioForm.reason.trim() || null,
    });
    await loadReferenceData();
    await loadTrades();
    const elapsedMs = Math.max(0, Math.round(performance.now() - startedAt));
    const message = `Portfolio Net Contribution Set applied. voided=${out.voided_transactions}, baseline=${formatBaselineInfo(out.baseline_transaction_ids)}. (${elapsedMs}ms)`;
    successMessage.value = message;
    appendSetActionLog("PORTFOLIO", "OK", message);
  } catch (error) {
    const baseMessage = parseApiError(error);
    const elapsedMs = startedAt > 0 ? Math.max(0, Math.round(performance.now() - startedAt)) : null;
    const message = elapsedMs === null ? baseMessage : `${baseMessage} (${elapsedMs}ms)`;
    errorMessage.value = message;
    appendSetActionLog("PORTFOLIO", "ERROR", message);
  } finally {
    setActionSaving.value = false;
  }
}

async function submitHoldingSet(): Promise<void> {
  const holdingId = toOptionalNumber(setHoldingForm.holding_id);
  if (!holdingId) {
    const message = "Holding is required for Holding Position Set.";
    errorMessage.value = message;
    appendSetActionLog("HOLDING", "ERROR", message);
    return;
  }
  const selectedHolding = selectedSetHolding.value;
  if (!selectedHolding) {
    const message = "Selected holding not found.";
    errorMessage.value = message;
    appendSetActionLog("HOLDING", "ERROR", message);
    return;
  }
  if (selectedHolding.is_auto_cash) {
    const message = "Auto Cash Balance는 Holding Position Set 대상이 아닙니다. BALANCE_SET/DEPOSIT/WITHDRAW/ADJUSTMENT를 사용하세요.";
    errorMessage.value = message;
    appendSetActionLog("HOLDING", "ERROR", message);
    return;
  }

  let startedAt = 0;
  try {
    const quantity = parseNonNegativeNumber(setHoldingForm.quantity, "Quantity");
    const avgCost = parseNonNegativeNumber(setHoldingForm.avg_cost, "Avg cost");
    const avgCostCurrency = setHoldingForm.avg_cost_currency.trim().toUpperCase();
    if (avgCostCurrency.length !== 3) throw new Error("Avg cost currency must be 3 letters.");
    const costBasisRaw = toOptionalNumber(setHoldingForm.cost_basis_total);
    if (costBasisRaw !== undefined && costBasisRaw < 0) throw new Error("Cost basis must be >= 0.");
    const costBasisCurrency = setHoldingForm.cost_basis_currency.trim().toUpperCase();
    if (costBasisRaw !== undefined && costBasisCurrency.length !== 3) {
      throw new Error("Cost basis currency must be 3 letters.");
    }
    const effectiveAt = parseEffectiveAt(setHoldingForm.effective_at);
    const allHistory = !!setHoldingForm.rebaseline_all_history;
    const confirmMessage = allHistory
      ? "Apply Holding Position Set? (전체 과거 BUY/SELL 거래를 VOID 후 기준점 재생성)"
      : "Apply Holding Position Set? (기준시각 이전 BUY/SELL 거래를 VOID 후 기준점 재생성)";
    if (!window.confirm(confirmMessage)) return;

    startedAt = performance.now();
    setActionSaving.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    const out = await rebaselineHolding(holdingId, {
      effective_at: effectiveAt,
      rebaseline_all_history: allHistory,
      auto_apply_cash_holding: !!setHoldingForm.auto_apply_cash_holding,
      quantity,
      avg_price: avgCost,
      avg_price_currency: avgCostCurrency,
      invested_amount: costBasisRaw ?? null,
      invested_amount_currency: costBasisRaw === undefined ? null : costBasisCurrency,
      reason: setHoldingForm.reason.trim() || null,
    });
    await loadReferenceData();
    await loadTrades();
    const elapsedMs = Math.max(0, Math.round(performance.now() - startedAt));
    const message = `Holding Position Set applied. voided=${out.voided_transactions}, baseline=${formatBaselineInfo(out.baseline_transaction_ids)}. (${elapsedMs}ms)`;
    successMessage.value = message;
    appendSetActionLog("HOLDING", "OK", message);
  } catch (error) {
    const baseMessage = parseApiError(error);
    const elapsedMs = startedAt > 0 ? Math.max(0, Math.round(performance.now() - startedAt)) : null;
    const message = elapsedMs === null ? baseMessage : `${baseMessage} (${elapsedMs}ms)`;
    errorMessage.value = message;
    appendSetActionLog("HOLDING", "ERROR", message);
  } finally {
    setActionSaving.value = false;
  }
}

async function submitLiabilitySet(): Promise<void> {
  const liabilityId = toOptionalNumber(setLiabilityForm.liability_id);
  if (!liabilityId) {
    const message = "Liability is required for Liability Balance Set.";
    errorMessage.value = message;
    appendSetActionLog("LIABILITY", "ERROR", message);
    return;
  }

  let startedAt = 0;
  try {
    const balance = parseNonNegativeNumber(setLiabilityForm.outstanding_balance, "Outstanding balance");
    const interestRateRaw = toOptionalNumber(setLiabilityForm.interest_rate);
    if (interestRateRaw !== undefined && interestRateRaw < 0) throw new Error("Interest rate must be >= 0.");
    const effectiveAt = parseEffectiveAt(setLiabilityForm.effective_at);
    const allHistory = !!setLiabilityForm.rebaseline_all_history;
    const confirmMessage = allHistory
      ? "Apply Liability Balance Set? (전체 과거 LOAN_BORROW/LOAN_REPAY 거래를 VOID 후 기준점 재생성)"
      : "Apply Liability Balance Set? (기준시각 이전 LOAN_BORROW/LOAN_REPAY 거래를 VOID 후 기준점 재생성)";
    if (!window.confirm(confirmMessage)) return;

    startedAt = performance.now();
    setActionSaving.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    const out = await rebaselineLiability(liabilityId, {
      effective_at: effectiveAt,
      rebaseline_all_history: allHistory,
      auto_apply_cash_holding: !!setLiabilityForm.auto_apply_cash_holding,
      outstanding_balance: balance,
      reason: setLiabilityForm.reason.trim() || null,
    });
    if (interestRateRaw !== undefined) {
      await updateLiability(liabilityId, { interest_rate: interestRateRaw });
    }
    await loadReferenceData();
    await loadTrades();
    const elapsedMs = Math.max(0, Math.round(performance.now() - startedAt));
    const message = `Liability Balance Set applied. voided=${out.voided_transactions}, baseline=${formatBaselineInfo(out.baseline_transaction_ids)}. (${elapsedMs}ms)`;
    successMessage.value = message;
    appendSetActionLog("LIABILITY", "OK", message);
  } catch (error) {
    const baseMessage = parseApiError(error);
    const elapsedMs = startedAt > 0 ? Math.max(0, Math.round(performance.now() - startedAt)) : null;
    const message = elapsedMs === null ? baseMessage : `${baseMessage} (${elapsedMs}ms)`;
    errorMessage.value = message;
    appendSetActionLog("LIABILITY", "ERROR", message);
  } finally {
    setActionSaving.value = false;
  }
}

async function submitCashSet(): Promise<void> {
  const portfolioId = toOptionalNumber(setCashForm.portfolio_id);
  if (!portfolioId) {
    const message = "Portfolio is required for Auto Cash Balance Set.";
    errorMessage.value = message;
    appendSetActionLog("CASH", "ERROR", message);
    return;
  }

  let startedAt = 0;
  try {
    const targetBalance = parseNonNegativeNumber(setCashForm.target_balance, "Target balance");
    const currency = setCashForm.currency.trim().toUpperCase();
    if (currency.length !== 3) throw new Error("Currency must be 3 letters.");
    const executedAt = parseEffectiveAt(setCashForm.effective_at);
    if (!window.confirm("Apply Auto Cash Balance Set? (선택 포트폴리오/통화의 현금 잔액을 입력값으로 맞춥니다.)")) return;

    startedAt = performance.now();
    setActionSaving.value = true;
    errorMessage.value = "";
    successMessage.value = "";
    const out = await createTrade({
      portfolio_id: portfolioId,
      txn_type: "BALANCE_SET",
      amount: targetBalance,
      currency,
      executed_at: executedAt,
      memo: setCashForm.memo.trim() || null,
      source_type: "MANUAL",
      auto_apply_cash_holding: true,
      auto_apply_portfolio_cashflow: false,
    });
    await loadReferenceData();
    await loadTrades();
    const elapsedMs = Math.max(0, Math.round(performance.now() - startedAt));
    const message = `Auto Cash Balance Set applied. trade_id=${out.id}, amount=${formatNumber(out.amount)} ${out.currency}. (${elapsedMs}ms)`;
    successMessage.value = message;
    appendSetActionLog("CASH", "OK", message);
  } catch (error) {
    const baseMessage = parseApiError(error);
    const elapsedMs = startedAt > 0 ? Math.max(0, Math.round(performance.now() - startedAt)) : null;
    const message = elapsedMs === null ? baseMessage : `${baseMessage} (${elapsedMs}ms)`;
    errorMessage.value = message;
    appendSetActionLog("CASH", "ERROR", message);
  } finally {
    setActionSaving.value = false;
  }
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
  if (isBalanceSet.value) {
    payload.auto_apply_cash_holding = true;
    payload.auto_apply_portfolio_cashflow = false;
  }
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
    } else if (next === "ADJUSTMENT" || next === "BALANCE_SET") {
      form.asset_id = "";
      form.liability_id = "";
      form.auto_apply_portfolio_cashflow = false;
      form.auto_apply_cash_holding = true;
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

watch(
  () => setPortfolioForm.portfolio_id,
  (next) => {
    const portfolioId = toOptionalNumber(next);
    if (portfolioId === undefined) return;
    const row = portfolioById.value.get(portfolioId);
    if (!row) return;
    setPortfolioForm.cumulative_deposit_amount = String(row.cumulative_deposit_amount);
    setPortfolioForm.cumulative_withdrawal_amount = String(row.cumulative_withdrawal_amount);
  },
);

watch(
  () => setHoldingForm.portfolio_id,
  () => {
    const selectedHoldingId = toOptionalNumber(setHoldingForm.holding_id);
    if (selectedHoldingId === undefined) return;
    const stillValid = filteredSetHoldings.value.some((item) => item.id === selectedHoldingId);
    if (!stillValid) {
      setHoldingForm.holding_id = "";
    }
  },
);

watch(
  () => setHoldingForm.holding_id,
  (next) => {
    const holdingId = toOptionalNumber(next);
    if (holdingId === undefined) return;
    const row = holdingsWithMeta.value.find((item) => item.id === holdingId);
    if (!row) return;
    if (row.portfolio_id !== null) {
      setHoldingForm.portfolio_id = String(row.portfolio_id);
    }
    setHoldingForm.quantity = String(row.quantity);
    setHoldingForm.avg_cost = String(row.avg_price);
    setHoldingForm.avg_cost_currency = (row.avg_price_currency || "KRW").toUpperCase();
    setHoldingForm.cost_basis_total = row.invested_amount == null ? "" : String(row.invested_amount);
    setHoldingForm.cost_basis_currency = (row.invested_amount_currency || row.avg_price_currency || "KRW").toUpperCase();
  },
);

watch(
  () => setLiabilityForm.portfolio_id,
  () => {
    const selectedLiabilityId = toOptionalNumber(setLiabilityForm.liability_id);
    if (selectedLiabilityId === undefined) return;
    const stillValid = filteredSetLiabilities.value.some((item) => item.id === selectedLiabilityId);
    if (!stillValid) {
      setLiabilityForm.liability_id = "";
    }
  },
);

watch(
  () => setLiabilityForm.liability_id,
  (next) => {
    const liabilityId = toOptionalNumber(next);
    if (liabilityId === undefined) return;
    const row = liabilities.value.find((item) => item.id === liabilityId);
    if (!row) return;
    if (row.portfolio_id !== null) {
      setLiabilityForm.portfolio_id = String(row.portfolio_id);
    }
    setLiabilityForm.outstanding_balance = String(row.outstanding_balance);
    setLiabilityForm.interest_rate = row.interest_rate == null ? "" : String(row.interest_rate);
  },
);

watch(
  () => setCashForm.portfolio_id,
  (next) => {
    const portfolioId = toOptionalNumber(next);
    if (portfolioId === undefined) {
      setCashForm.target_balance = "0";
      return;
    }
    const row = portfolioById.value.get(portfolioId);
    if (!row) return;
    const baseCurrency = (row.base_currency || "KRW").toUpperCase();
    if (supportedCurrencies.value.includes(baseCurrency)) {
      setCashForm.currency = baseCurrency;
    } else {
      setCashForm.currency = supportedCurrencies.value[0] ?? "KRW";
    }
    syncSetCashTargetFromCurrent();
  },
);

watch(
  () => setCashForm.currency,
  (next) => {
    const normalized = next.trim().toUpperCase();
    if (normalized !== next) {
      setCashForm.currency = normalized;
      return;
    }
    syncSetCashTargetFromCurrent();
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
  restoreTradeCardOrder();
  restoreSetActionLogs();
  await loadReferenceData();
  resetForm();
  resetTransferForm();
  resetSetForms();
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

    <div class="flex flex-col gap-4">
    <article
      class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      :class="tradeCardDraggingKey === 'SET' ? 'opacity-75 ring-2 ring-violet-400/40' : ''"
      :style="{ order: getTradeCardOrder('SET') }"
      @dragover="onTradeCardDragOver"
      @drop="onTradeCardDrop('SET', $event)"
    >
      <div
        class="flex cursor-move items-start justify-between gap-3"
        draggable="true"
        @dragstart="onTradeCardDragStart('SET', $event)"
        @dragend="onTradeCardDragEnd"
      >
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 dark:text-violet-300">Set Actions</p>
          <h2 class="mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100">Rebaseline-Based Set Actions</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Agent 편집을 Trade에서 빠르게 실행합니다. 실행 시 기준 거래를 재생성합니다.</p>
        </div>
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :aria-expanded="!setActionsCollapsed"
          @click="setActionsCollapsed = !setActionsCollapsed"
        >
          {{ setActionsCollapsed ? "Expand" : "Collapse" }}
        </button>
      </div>

      <div v-if="!setActionsCollapsed" class="mt-3 space-y-3">
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="setActionTab === 'PORTFOLIO' ? 'border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-300' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="setActionTab = 'PORTFOLIO'"
          >
            Portfolio Net Contribution Set
          </button>
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="setActionTab === 'HOLDING' ? 'border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-300' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="setActionTab = 'HOLDING'"
          >
            Holding Position Set
          </button>
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="setActionTab === 'LIABILITY' ? 'border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-300' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="setActionTab = 'LIABILITY'"
          >
            Liability Balance Set
          </button>
          <button
            type="button"
            class="rounded-lg border px-3 py-1.5 text-xs font-semibold transition"
            :class="setActionTab === 'CASH' ? 'border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-300' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
            @click="setActionTab = 'CASH'"
          >
            Auto Cash Balance Set
          </button>
        </div>

        <div v-if="setActionTab === 'PORTFOLIO'" class="space-y-3">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Portfolio
              <select v-model="setPortfolioForm.portfolio_id" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="">Select</option>
                <option v-for="p in portfolios" :key="`set-pf-${p.id}`" :value="String(p.id)">#{{ p.id }} {{ p.name }}</option>
              </select>
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Effective At (KST)
              <input v-model="setPortfolioForm.effective_at" type="datetime-local" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Cumulative Deposit
              <input v-model="setPortfolioForm.cumulative_deposit_amount" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Cumulative Withdrawal
              <input v-model="setPortfolioForm.cumulative_withdrawal_amount" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
          </div>
          <label class="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Reason (optional)
            <input v-model="setPortfolioForm.reason" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            <input v-model="setPortfolioForm.rebaseline_all_history" type="checkbox" class="h-4 w-4" />
            <span>Rebaseline all history (기준시각 무시)</span>
          </label>
          <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            <input v-model="setPortfolioForm.auto_apply_cash_holding" type="checkbox" class="h-4 w-4" />
            <span>Auto apply to cash holding (optional)</span>
          </label>
          <div>
            <button
              type="button"
              class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
              :disabled="setActionSaving"
              @click="submitPortfolioSet"
            >
              {{ setActionSaving ? "Applying..." : "Apply Portfolio Net Contribution Set" }}
            </button>
          </div>
          <div class="rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950/50">
            <div class="flex items-center justify-between gap-2">
              <p class="font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Recent Logs</p>
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="clearSetActionLogs('PORTFOLIO')"
              >
                Clear
              </button>
            </div>
            <ul v-if="setActionLogs.PORTFOLIO.length" class="mt-1 space-y-1 text-slate-700 dark:text-slate-200">
              <li v-for="line in setActionLogs.PORTFOLIO" :key="`set-log-portfolio-${line}`">{{ line }}</li>
            </ul>
            <p v-else class="mt-1 text-slate-500 dark:text-slate-400">No executions yet.</p>
          </div>
        </div>

        <div v-else-if="setActionTab === 'HOLDING'" class="space-y-3">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Portfolio (filter)
              <select v-model="setHoldingForm.portfolio_id" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="">All</option>
                <option v-for="p in portfolios" :key="`set-h-pf-${p.id}`" :value="String(p.id)">#{{ p.id }} {{ p.name }}</option>
              </select>
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Holding
              <select v-model="setHoldingForm.holding_id" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="">Select</option>
                <option v-for="h in filteredSetHoldings" :key="`set-h-${h.id}`" :value="String(h.id)">
                  #{{ h.id }} {{ h.portfolio_name }} / {{ h.asset_name }}{{ h.asset_symbol ? ` (${h.asset_symbol})` : "" }}
                </option>
              </select>
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Effective At (KST)
              <input v-model="setHoldingForm.effective_at" type="datetime-local" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Quantity
              <input v-model="setHoldingForm.quantity" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Avg Cost
              <input v-model="setHoldingForm.avg_cost" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Avg Cost Currency
              <select v-model="setHoldingForm.avg_cost_currency" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950">
                <option v-for="currency in supportedCurrencies" :key="`set-h-avg-${currency}`" :value="currency">{{ currency }}</option>
              </select>
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Cost Basis (optional)
              <input v-model="setHoldingForm.cost_basis_total" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Cost Basis Currency
              <select v-model="setHoldingForm.cost_basis_currency" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950">
                <option v-for="currency in supportedCurrencies" :key="`set-h-cost-${currency}`" :value="currency">{{ currency }}</option>
              </select>
            </label>
          </div>
          <p
            v-if="selectedSetHolding?.is_auto_cash"
            class="rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
          >
            Auto Cash Balance는 ledger-derived입니다. Trade의 BALANCE_SET/DEPOSIT/WITHDRAW/ADJUSTMENT를 사용하세요.
          </p>
          <label class="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Reason (optional)
            <input v-model="setHoldingForm.reason" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            <input v-model="setHoldingForm.rebaseline_all_history" type="checkbox" class="h-4 w-4" />
            <span>Rebaseline all history (기준시각 무시)</span>
          </label>
          <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            <input v-model="setHoldingForm.auto_apply_cash_holding" type="checkbox" class="h-4 w-4" />
            <span>Auto apply to cash holding (optional)</span>
          </label>
          <div>
            <button
              type="button"
              class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
              :disabled="setActionSaving || !!selectedSetHolding?.is_auto_cash"
              @click="submitHoldingSet"
            >
              {{ setActionSaving ? "Applying..." : "Apply Holding Position Set" }}
            </button>
          </div>
          <div class="rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950/50">
            <div class="flex items-center justify-between gap-2">
              <p class="font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Recent Logs</p>
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="clearSetActionLogs('HOLDING')"
              >
                Clear
              </button>
            </div>
            <ul v-if="setActionLogs.HOLDING.length" class="mt-1 space-y-1 text-slate-700 dark:text-slate-200">
              <li v-for="line in setActionLogs.HOLDING" :key="`set-log-holding-${line}`">{{ line }}</li>
            </ul>
            <p v-else class="mt-1 text-slate-500 dark:text-slate-400">No executions yet.</p>
          </div>
        </div>

        <div v-else-if="setActionTab === 'LIABILITY'" class="space-y-3">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Portfolio (filter)
              <select v-model="setLiabilityForm.portfolio_id" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="">All</option>
                <option v-for="p in portfolios" :key="`set-l-pf-${p.id}`" :value="String(p.id)">#{{ p.id }} {{ p.name }}</option>
              </select>
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Liability
              <select v-model="setLiabilityForm.liability_id" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="">Select</option>
                <option v-for="l in filteredSetLiabilities" :key="`set-l-${l.id}`" :value="String(l.id)">
                  #{{ l.id }} {{ l.name }} ({{ l.currency }})
                </option>
              </select>
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Effective At (KST)
              <input v-model="setLiabilityForm.effective_at" type="datetime-local" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Outstanding Balance
              <input v-model="setLiabilityForm.outstanding_balance" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Interest Rate (optional)
              <input v-model="setLiabilityForm.interest_rate" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
          </div>
          <label class="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Reason (optional)
            <input v-model="setLiabilityForm.reason" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            <input v-model="setLiabilityForm.rebaseline_all_history" type="checkbox" class="h-4 w-4" />
            <span>Rebaseline all history (기준시각 무시)</span>
          </label>
          <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700">
            <input v-model="setLiabilityForm.auto_apply_cash_holding" type="checkbox" class="h-4 w-4" />
            <span>Auto apply to cash holding (optional)</span>
          </label>
          <div>
            <button
              type="button"
              class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
              :disabled="setActionSaving"
              @click="submitLiabilitySet"
            >
              {{ setActionSaving ? "Applying..." : "Apply Liability Balance Set" }}
            </button>
          </div>
          <div class="rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950/50">
            <div class="flex items-center justify-between gap-2">
              <p class="font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Recent Logs</p>
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="clearSetActionLogs('LIABILITY')"
              >
                Clear
              </button>
            </div>
            <ul v-if="setActionLogs.LIABILITY.length" class="mt-1 space-y-1 text-slate-700 dark:text-slate-200">
              <li v-for="line in setActionLogs.LIABILITY" :key="`set-log-liability-${line}`">{{ line }}</li>
            </ul>
            <p v-else class="mt-1 text-slate-500 dark:text-slate-400">No executions yet.</p>
          </div>
        </div>

        <div v-else class="space-y-3">
          <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Portfolio
              <select v-model="setCashForm.portfolio_id" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950">
                <option value="">Select</option>
                <option v-for="p in portfolios" :key="`set-c-pf-${p.id}`" :value="String(p.id)">#{{ p.id }} {{ p.name }}</option>
              </select>
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Currency
              <select v-model="setCashForm.currency" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950">
                <option v-for="currency in supportedCurrencies" :key="`set-c-currency-${currency}`" :value="currency">{{ currency }}</option>
              </select>
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Target Balance
              <input v-model="setCashForm.target_balance" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
            <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Effective At (KST)
              <input v-model="setCashForm.effective_at" type="datetime-local" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
            </label>
          </div>
          <label class="block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Memo (optional)
            <input v-model="setCashForm.memo" class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" />
          </label>
          <p class="rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-xs text-cyan-800 dark:border-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300">
            Manual Trade Entry의 BALANCE_SET과 동일 로직입니다. Portfolio/Currency 선택 시 현재 Auto Cash Balance가 Target Balance에 기본 채움됩니다.
          </p>
          <div>
            <button
              type="button"
              class="rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60"
              :disabled="setActionSaving"
              @click="submitCashSet"
            >
              {{ setActionSaving ? "Applying..." : "Apply Auto Cash Balance Set" }}
            </button>
          </div>
          <div class="rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950/50">
            <div class="flex items-center justify-between gap-2">
              <p class="font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">Recent Logs</p>
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="clearSetActionLogs('CASH')"
              >
                Clear
              </button>
            </div>
            <ul v-if="setActionLogs.CASH.length" class="mt-1 space-y-1 text-slate-700 dark:text-slate-200">
              <li v-for="line in setActionLogs.CASH" :key="`set-log-cash-${line}`">{{ line }}</li>
            </ul>
            <p v-else class="mt-1 text-slate-500 dark:text-slate-400">No executions yet.</p>
          </div>
        </div>
      </div>
    </article>



    <article
      class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      :class="tradeCardDraggingKey === 'TRANSFER' ? 'opacity-75 ring-2 ring-violet-400/40' : ''"
      :style="{ order: getTradeCardOrder('TRANSFER') }"
      @dragover="onTradeCardDragOver"
      @drop="onTradeCardDrop('TRANSFER', $event)"
    >
      <div
        class="flex cursor-move items-start justify-between gap-3"
        draggable="true"
        @dragstart="onTradeCardDragStart('TRANSFER', $event)"
        @dragend="onTradeCardDragEnd"
      >
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

    <article
      class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      :class="tradeCardDraggingKey === 'ENTRY' ? 'opacity-75 ring-2 ring-violet-400/40' : ''"
      :style="{ order: getTradeCardOrder('ENTRY') }"
      @dragover="onTradeCardDragOver"
      @drop="onTradeCardDrop('ENTRY', $event)"
    >
      <div
        class="flex cursor-move items-start justify-between gap-3"
        draggable="true"
        @dragstart="onTradeCardDragStart('ENTRY', $event)"
        @dragend="onTradeCardDragEnd"
      >
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
              <option v-for="type in tradeTypes" :key="type" :value="type">{{ tradeTypeLabelMap[type] }}</option>
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
          <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">{{ amountLabel }}
            <input
              v-model="form.amount"
              :placeholder="isBalanceSet ? 'e.g. 20000' : ''"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
            <p v-if="amountHint" class="mt-1 text-[11px] normal-case text-slate-500 dark:text-slate-400">
              {{ amountHint }}
            </p>
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
            <input v-model="form.auto_apply_cash_holding" :disabled="isBalanceSet" type="checkbox" class="h-4 w-4 disabled:opacity-60" />
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
    </div>

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
            <option v-for="type in tradeTypes" :key="type" :value="type">{{ tradeTypeLabelMap[type] }}</option>
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


