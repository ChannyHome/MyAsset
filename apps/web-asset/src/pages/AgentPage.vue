<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import {
  createAsset,
  deleteAsset,
  getAssets,
  getAssetsTable,
  updateAsset,
  type AssetCreateIn,
  type AssetOut,
  type AssetTableRowOut,
  type AssetTableSortBy,
  type SortOrder,
} from "../api/assets";
import { getMe, type AuthMeOut } from "../api/auth";
import { useDisplayCurrency } from "../composables/useDisplayCurrency";
import {
  createHolding,
  deleteHolding,
  getHoldingsTable,
  rebaselineHolding,
  updateHolding,
  type HoldingRebaselineIn,
  type HoldingTableRowOut,
  type HoldingTableSortBy,
} from "../api/holdings";
import {
  createLiability,
  deleteLiability,
  getLiabilitiesTable,
  rebaselineLiability,
  updateLiability,
  type LiabilityRebaselineIn,
  type LiabilityTableRowOut,
  type LiabilityTableSortBy,
} from "../api/liabilities";
import {
  createPortfolio,
  deletePortfolio,
  getPortfolioCashAccounts,
  getPortfolios,
  getPortfoliosTable,
  rebaselinePortfolio,
  setPortfolioCashAccount,
  updatePortfolio,
  type EditMode,
  type PortfolioRebaselineIn,
  type PortfolioCashAccountOut,
  type PortfolioOut,
  type PortfolioTableRowOut,
  type PortfolioTableSortBy,
} from "../api/portfolios";
import {
  getLatestUsdKrwFxRate,
  getQuoteUpdateJobStatus,
  testQuoteForAsset,
  updateQuotesNow,
  upsertManualQuote,
  type FxRateLatestOut,
  type ManualQuoteUpsertIn,
  type QuoteLatestOut,
  type QuoteUpdateJobStatusOut,
} from "../api/quotes";
import { getFxStaleMinutes } from "../api/settings";
import {
  createAppSecret,
  deactivateAppSecret,
  listAppSecrets,
  updateAppSecret,
  type AppSecretOut,
} from "../api/adminSecrets";
import {
  createReleaseNote,
  getReleaseNotes,
  unpublishReleaseNote,
  updateReleaseNote,
  type ReleaseNoteOut,
} from "../api/releaseNotes";
import {
  getEntityHistory,
  revertEntityHistory,
  type EntityHistoryItemOut,
  type EntityType,
} from "../api/entityHistory";
import { formatDateTimeSeoul, toDateTimeLocalSeoul } from "../utils/datetime";

type LogStatus = "SUCCESS" | "ERROR" | "INFO";
type AssetModalMode = "CREATE" | "EDIT";
type QuoteJobStatus = "IDLE" | "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED";
type ActionLog = { id: number; at: string; action: string; status: LogStatus; message: string };
type TableQueryState<TSort extends string> = {
  page: number;
  pageSize: number;
  total: number;
  sortBy: TSort;
  sortOrder: SortOrder;
  q: string;
};
type CollapseState = {
  quoteActionsCollapsed: boolean;
  secretsVaultCollapsed: boolean;
  releaseNotesSectionCollapsed: boolean;
  assetsSectionCollapsed: boolean;
  portfoliosSectionCollapsed: boolean;
  holdingsSectionCollapsed: boolean;
  liabilitiesSectionCollapsed: boolean;
};

const COLLAPSE_STATE_STORAGE_KEY = "myasset.agent.collapse.v1";

function loadCollapseState(): Partial<CollapseState> {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(COLLAPSE_STATE_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Partial<CollapseState>;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    return parsed;
  } catch {
    return {};
  }
}

function saveCollapseState(next: CollapseState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(COLLAPSE_STATE_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // ignore storage errors (private mode/quota/etc.)
  }
}

const initialCollapseState = loadCollapseState();

const loading = reactive({ data: false, action: false, confirm: false });
const me = ref<AuthMeOut | null>(null);
const assets = ref<AssetTableRowOut[]>([]);
const holdingAssetOptions = ref<AssetOut[]>([]);
const holdingPortfolioOptions = ref<PortfolioOut[]>([]);
const portfolioRows = ref<PortfolioTableRowOut[]>([]);
const holdingRows = ref<HoldingTableRowOut[]>([]);
const liabilityRows = ref<LiabilityTableRowOut[]>([]);
const portfolioCashAccounts = ref<PortfolioCashAccountOut[]>([]);
const appSecrets = ref<AppSecretOut[]>([]);
const releaseNotes = ref<ReleaseNoteOut[]>([]);
const usdKrwFx = ref<FxRateLatestOut | null>(null);
const logs = ref<ActionLog[]>([]);
const { displayCurrency, ensureInitialized } = useDisplayCurrency();
let nextLogId = 1;
const assetsQuery = reactive<TableQueryState<AssetTableSortBy>>({
  page: 1,
  pageSize: 20,
  total: 0,
  sortBy: "updated_at",
  sortOrder: "desc",
  q: "",
});
const portfolioQuery = reactive<TableQueryState<PortfolioTableSortBy>>({
  page: 1,
  pageSize: 10,
  total: 0,
  sortBy: "updated_at",
  sortOrder: "desc",
  q: "",
});
const holdingQuery = reactive<TableQueryState<HoldingTableSortBy>>({
  page: 1,
  pageSize: 10,
  total: 0,
  sortBy: "updated_at",
  sortOrder: "desc",
  q: "",
});
const liabilityQuery = reactive<TableQueryState<LiabilityTableSortBy>>({
  page: 1,
  pageSize: 10,
  total: 0,
  sortBy: "updated_at",
  sortOrder: "desc",
  q: "",
});

const confirmModal = reactive({ open: false, title: "", message: "" });
const pendingAction = ref<null | (() => Promise<void>)>(null);

const assetModal = reactive({ open: false, mode: "CREATE" as AssetModalMode });
const portfolioEditModal = reactive({ open: false });
const holdingEditModal = reactive({ open: false });
const liabilityEditModal = reactive({ open: false });
const entityHistoryModal = reactive({ open: false });
const quoteActionsCollapsed = ref(initialCollapseState.quoteActionsCollapsed ?? true);
const secretsVaultCollapsed = ref(initialCollapseState.secretsVaultCollapsed ?? true);
const releaseNotesSectionCollapsed = ref(initialCollapseState.releaseNotesSectionCollapsed ?? true);
const quoteTestingAssetId = ref<number | null>(null);
const assetsSectionCollapsed = ref(initialCollapseState.assetsSectionCollapsed ?? true);
const portfoliosSectionCollapsed = ref(initialCollapseState.portfoliosSectionCollapsed ?? true);
const holdingsSectionCollapsed = ref(initialCollapseState.holdingsSectionCollapsed ?? true);
const liabilitiesSectionCollapsed = ref(initialCollapseState.liabilitiesSectionCollapsed ?? true);
const quickCreatePortfolioOpen = ref(false);
const quickCreateHoldingOpen = ref(false);
const quickCreateLiabilityOpen = ref(false);
const cashAccountLookupLoading = ref(false);
const lookupLoading = ref(false);

const assetForm = reactive({
  id: "",
  asset_class: "",
  symbol: "",
  name: "",
  currency: "",
  quote_mode: "",
  exchange_code: "",
  is_trade_supported: true,
  meta_json_text: "",
});

const manualQuoteForm = reactive({
  asset_id: "",
  price: "",
  currency: "KRW",
  as_of: "",
  source: "MANUAL",
});
const fxStaleMinutesForm = ref("30");
const fxStaleSource = ref("env");
const portfolioForm = reactive({
  name: "",
  type: "ETC",
  base_currency: "KRW",
  exchange_code: "",
  category: "ETC",
  cashflow_source_type: "MANUAL",
  memo: "",
});
const holdingForm = reactive({
  portfolio_id: "",
  asset_id: "",
  quantity: "",
  avg_price: "",
  avg_price_currency: "KRW",
  invested_amount: "",
  invested_amount_currency: "KRW",
  source_type: "MANUAL",
  memo: "",
});
const portfolioCashMapForm = reactive({
  portfolio_id: "",
  currency: "KRW",
  asset_id: "",
});
const liabilityForm = reactive({
  portfolio_id: "",
  name: "",
  liability_type: "ETC",
  currency: "KRW",
  outstanding_balance: "",
  interest_rate: "",
  monthly_payment: "",
  source_type: "MANUAL",
  memo: "",
});
const portfolioEditForm = reactive({
  id: "",
  name: "",
  type: "ETC",
  base_currency: "KRW",
  exchange_code: "",
  category: "",
  cashflow_source_type: "MANUAL",
  cumulative_deposit_amount: "0",
  cumulative_withdrawal_amount: "0",
  is_included: true,
  is_hidden: false,
  memo: "",
  edit_mode: "SAFE" as EditMode,
  effective_at: "",
  reason: "",
});
const holdingEditForm = reactive({
  id: "",
  portfolio_id: "",
  asset_id: "",
  quantity: "",
  avg_price: "",
  avg_price_currency: "KRW",
  invested_amount: "",
  invested_amount_currency: "KRW",
  source_type: "MANUAL",
  is_hidden: false,
  memo: "",
  edit_mode: "SAFE" as EditMode,
  effective_at: "",
  reason: "",
  original_portfolio_id: "",
  original_asset_id: "",
});
const liabilityEditForm = reactive({
  id: "",
  portfolio_id: "",
  name: "",
  liability_type: "ETC",
  currency: "KRW",
  outstanding_balance: "",
  interest_rate: "",
  monthly_payment: "",
  source_type: "MANUAL",
  is_included: true,
  is_hidden: false,
  memo: "",
  edit_mode: "SAFE" as EditMode,
  effective_at: "",
  reason: "",
  original_portfolio_id: "",
  original_currency: "KRW",
});
const entityHistoryState = reactive({
  entity_type: "HOLDING" as EntityType,
  entity_id: 0,
  title: "",
  loading: false,
  reverting_id: 0,
  items: [] as EntityHistoryItemOut[],
});
const secretForm = reactive({
  id: "",
  provider: "DATA_GO_KR",
  key_name: "",
  secret_value: "",
  description: "",
  is_active: true,
});
const releaseNoteForm = reactive({
  id: "",
  released_at: "",
  title: "",
  summary: "",
  is_published: true,
});

const canManageAssets = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
const canManageQuotes = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
const canManageAppSecrets = computed(() => me.value?.role === "ADMIN");
const canManageReleaseNotes = computed(() => me.value?.role === "ADMIN");
const canHardEdit = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
const canManageEntityHistory = computed(() => canHardEdit.value);
const isBusy = computed(() => loading.data || loading.action || loading.confirm);
const selectedAssetForQuote = computed(() => assets.value.find((item) => String(item.id) === manualQuoteForm.asset_id) ?? null);
const assetClassOptions = ["STOCK", "CRYPTO", "REAL_ESTATE", "DEPOSIT_SAVING", "BOND", "ETC"] as const;
const quoteModeOptions = ["AUTO", "MANUAL"] as const;
const holdingSourceTypeOptions = ["MANUAL", "AUTO"] as const;
const holdingCurrencyOptions = ["KRW", "USD"] as const;
const portfolioTypeOptions = ["BROKER", "EXCHANGE", "BANK", "CASH", "ETC"] as const;
const portfolioCategoryOptions = ["KR_STOCK", "US_STOCK", "CRYPTO", "REAL_ESTATE", "BOND", "CASH", "DEPOSIT_SAVING", "ETC"] as const;
const portfolioCashflowSourceTypeOptions = ["MANUAL", "AUTO"] as const;
const liabilityTypeOptions = ["MORTGAGE", "CREDIT_LOAN", "CARD", "ETC"] as const;
const liabilitySourceTypeOptions = ["MANUAL", "AUTO"] as const;
const totalPages = computed(() => Math.max(1, Math.ceil(assetsQuery.total / assetsQuery.pageSize)));
const portfolioTotalPages = computed(() => Math.max(1, Math.ceil(portfolioQuery.total / portfolioQuery.pageSize)));
const holdingTotalPages = computed(() => Math.max(1, Math.ceil(holdingQuery.total / holdingQuery.pageSize)));
const liabilityTotalPages = computed(() => Math.max(1, Math.ceil(liabilityQuery.total / liabilityQuery.pageSize)));
const sortedHoldingAssetOptions = computed(() =>
  [...holdingAssetOptions.value].sort((a, b) => {
    const byName = a.name.localeCompare(b.name, "ko");
    if (byName !== 0) return byName;
    const byExchange = (a.exchange_code || "").localeCompare(b.exchange_code || "", "ko");
    if (byExchange !== 0) return byExchange;
    return a.id - b.id;
  }),
);
const sortedHoldingPortfolioOptions = computed(() =>
  [...holdingPortfolioOptions.value].sort((a, b) => {
    const byName = a.name.localeCompare(b.name, "ko");
    if (byName !== 0) return byName;
    return a.id - b.id;
  }),
);
const cashBalanceAssetOptions = computed(() =>
  sortedHoldingAssetOptions.value.filter((asset) => isCashBalanceAssetOption(asset)),
);
const cashMapAssetOptions = computed(() => {
  const currency = normalizeUpper(portfolioCashMapForm.currency || "KRW");
  return cashBalanceAssetOptions.value.filter((asset) => normalizeUpper(asset.currency) === currency);
});
const AUTO_SEARCH_DEBOUNCE_MS = 450;
const QUOTE_UPDATE_POLL_MS = 1500;
const QUOTE_UPDATE_POLL_TIMEOUT_MS = 5 * 60 * 1000;
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let portfolioSearchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let holdingSearchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let liabilitySearchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let quoteUpdatePollTimer: ReturnType<typeof setTimeout> | null = null;
let refreshSequence = 0;
const quoteUpdatePolling = ref(false);
const quoteUpdateJobId = ref("");
const quoteUpdateLastProcessed = ref<number>(-1);
const quoteUpdateJobStatus = ref<QuoteJobStatus>("IDLE");
const quoteUpdateProcessed = ref(0);
const quoteUpdateTotal = ref(0);
const quoteUpdateStatusLabel = computed(() => {
  if (quoteUpdatePolling.value) {
    const progress = quoteUpdateTotal.value > 0 ? ` ${quoteUpdateProcessed.value}/${quoteUpdateTotal.value}` : "";
    return `${quoteUpdateJobStatus.value}${progress}`;
  }
  return quoteUpdateJobStatus.value;
});
const quoteUpdateStatusClass = computed(() => {
  switch (quoteUpdateJobStatus.value) {
    case "QUEUED":
      return "border-amber-300 text-amber-700 bg-amber-50 dark:border-amber-800 dark:text-amber-200 dark:bg-amber-900/20";
    case "RUNNING":
      return "border-sky-300 text-sky-700 bg-sky-50 dark:border-sky-800 dark:text-sky-200 dark:bg-sky-900/20";
    case "COMPLETED":
      return "border-emerald-300 text-emerald-700 bg-emerald-50 dark:border-emerald-800 dark:text-emerald-200 dark:bg-emerald-900/20";
    case "FAILED":
      return "border-rose-300 text-rose-700 bg-rose-50 dark:border-rose-800 dark:text-rose-200 dark:bg-rose-900/20";
    default:
      return "border-slate-300 text-slate-600 bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:bg-slate-800/40";
  }
});
const realEstateMetaJsonExample = `{
  "jibun": "1046-1",
  "area_m2": 119.871,
  "lawd_cd": "41117",
  "apt_name": "청명마을삼성",
  "lookback_months": 12
}`;
const assetMetaJsonPlaceholder = `예시 (부동산) :
${realEstateMetaJsonExample}`;

function formatDateTime(value: string | null | undefined): string {
  return formatDateTimeSeoul(value);
}

function formatDateTimeLocalInput(value: string | null | undefined): string {
  return toDateTimeLocalSeoul(value);
}

function nowDateTimeLocalInput(): string {
  return toDateTimeLocalSeoul(new Date().toISOString());
}

function normalizeUpper(value: string): string {
  return value.trim().toUpperCase();
}

function toPositiveInt(value: string): number {
  const num = Number(value.trim());
  if (!Number.isInteger(num) || num <= 0) throw new Error("ID must be a positive integer");
  return num;
}

function parseMetaJson(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const parsed = JSON.parse(trimmed) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("meta_json must be object");
  return parsed as Record<string, unknown>;
}

function formatMoney(value: string | number, currency: string): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return String(value);

  try {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: normalizeUpper(currency),
      minimumFractionDigits: 0,
      maximumFractionDigits: normalizeUpper(currency) === "KRW" ? 0 : 8,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("ko-KR")} ${currency}`;
  }
}

function formatQuantity(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return String(value);
  const fixed = amount.toFixed(8);
  const trimmed = fixed.replace(/\.?0+$/, "");
  const normalized = trimmed === "-0" ? "0" : trimmed;
  const [intPart, fracPart] = normalized.split(".");
  const grouped = Number(intPart).toLocaleString("ko-KR");
  return fracPart ? `${grouped}.${fracPart}` : grouped;
}

function formatPct(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "-";
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return String(value);
  return `${amount.toFixed(2)}%`;
}

function formatFxRate(value: string | number): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return String(value);
  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(amount);
}

function holdingCurrencyCode(item: HoldingTableRowOut): string {
  return normalizeUpper(item.current_price_currency || item.asset_currency || "KRW");
}

function quotePriceText(item: AssetTableRowOut): string {
  if (item.quote_price === null || item.quote_price === undefined || !item.quote_currency) return "-";
  return formatMoney(item.quote_price, item.quote_currency);
}

function quoteAsOfText(item: AssetTableRowOut): string {
  return formatDateTime(item.quote_as_of);
}

function quoteSourceText(item: AssetTableRowOut): string {
  return item.quote_source || "-";
}

function isCashBalanceAssetOption(asset: AssetOut): boolean {
  const symbol = normalizeUpper(asset.symbol || "");
  if (symbol.startsWith("CASH_")) return true;
  const meta = asset.meta_json;
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return false;
  return normalizeUpper(String((meta as Record<string, unknown>).asset_subtype || "")) === "CASH_BALANCE";
}

function normalizeQuoteJobStatus(value: string | null | undefined): QuoteJobStatus {
  const upper = String(value || "").toUpperCase();
  if (upper === "QUEUED" || upper === "RUNNING" || upper === "COMPLETED" || upper === "FAILED") {
    return upper;
  }
  return "RUNNING";
}

function clearQuoteUpdatePolling(): void {
  if (quoteUpdatePollTimer) {
    clearTimeout(quoteUpdatePollTimer);
    quoteUpdatePollTimer = null;
  }
  quoteUpdatePolling.value = false;
}

function applyQuoteUpdateJobResult(result: QuoteUpdateJobStatusOut): void {
  pushLog(
    "Quote Update",
    "SUCCESS",
    `updated=${result.updated_count}, skipped=${result.skipped_count}, failed=${result.failed_count}`,
  );
  if (result.fx_rate) {
    usdKrwFx.value = result.fx_rate;
    pushLog(
      "FX Update",
      "INFO",
      `${result.fx_rate.base_currency}/${result.fx_rate.quote_currency}=${formatFxRate(result.fx_rate.rate)} @ ${formatDateTime(result.fx_rate.as_of)}`,
    );
  } else if (result.fx_error) {
    pushLog("FX Update", "ERROR", result.fx_error);
  }
}

function formatPortfolioPrincipalNet(item: PortfolioTableRowOut): string {
  const aliased = Number(item.net_contribution_total);
  if (Number.isFinite(aliased)) {
    return formatMoney(aliased, item.base_currency);
  }

  const deposit = typeof item.cumulative_deposit_amount === "number"
    ? item.cumulative_deposit_amount
    : Number(item.cumulative_deposit_amount);
  const withdrawal = typeof item.cumulative_withdrawal_amount === "number"
    ? item.cumulative_withdrawal_amount
    : Number(item.cumulative_withdrawal_amount);

  if (!Number.isFinite(deposit) || !Number.isFinite(withdrawal)) return "-";
  return formatMoney(deposit - withdrawal, item.base_currency);
}

async function pollQuoteUpdateJob(jobId: string, startedAtMs: number): Promise<void> {
  try {
    const result = await getQuoteUpdateJobStatus(jobId);
    quoteUpdateJobStatus.value = normalizeQuoteJobStatus(result.status);
    const processed = Number(result.processed_assets || 0);
    const total = Number(result.total_assets || 0);
    quoteUpdateProcessed.value = processed;
    quoteUpdateTotal.value = total;

    if (processed !== quoteUpdateLastProcessed.value) {
      quoteUpdateLastProcessed.value = processed;
      pushLog("Quote Update", "INFO", `progress ${processed}/${total}`);
    }

    if (result.status === "COMPLETED") {
      clearQuoteUpdatePolling();
      applyQuoteUpdateJobResult(result);
      await refreshData({ logRefresh: false });
      return;
    }

    if (result.status === "FAILED") {
      clearQuoteUpdatePolling();
      const message =
        result.errors.length > 0 ? (result.errors[result.errors.length - 1] ?? "Quote update job failed") : "Quote update job failed";
      pushLog("Quote Update", "ERROR", message);
      return;
    }

    if (Date.now() - startedAtMs > QUOTE_UPDATE_POLL_TIMEOUT_MS) {
      clearQuoteUpdatePolling();
      quoteUpdateJobStatus.value = "FAILED";
      pushLog("Quote Update", "ERROR", "Polling timeout. Check job status manually.");
      return;
    }

    quoteUpdatePollTimer = setTimeout(() => {
      void pollQuoteUpdateJob(jobId, startedAtMs);
    }, QUOTE_UPDATE_POLL_MS);
  } catch (error) {
    clearQuoteUpdatePolling();
    quoteUpdateJobStatus.value = "FAILED";
    pushLog("Quote Update", "ERROR", getErrorMessage(error));
  }
}

function applyQuoteToAssetRow(assetId: number, quote: QuoteLatestOut): void {
  const index = assets.value.findIndex((item) => item.id === assetId);
  if (index < 0) return;

  const current = assets.value[index];
  if (!current) return;
  assets.value[index] = {
    ...current,
    quote_price: quote.price,
    quote_currency: quote.currency,
    quote_as_of: quote.as_of,
    quote_source: quote.source,
  };
}

function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((item) => String(item?.msg ?? item)).join(", ");
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function pushLog(action: string, status: LogStatus, message: string): void {
  logs.value.unshift({ id: nextLogId++, at: new Date().toISOString(), action, status, message });
  if (logs.value.length > 100) logs.value = logs.value.slice(0, 100);
}

function resetAssetFormForCreate(): void {
  assetForm.id = "";
  assetForm.asset_class = "";
  assetForm.symbol = "";
  assetForm.name = "";
  assetForm.currency = "";
  assetForm.quote_mode = "";
  assetForm.exchange_code = "";
  assetForm.is_trade_supported = true;
  assetForm.meta_json_text = "";
}

function fillAssetForm(item: AssetTableRowOut): void {
  assetForm.id = String(item.id);
  assetForm.asset_class = item.asset_class;
  assetForm.symbol = item.symbol ?? "";
  assetForm.name = item.name;
  assetForm.currency = item.currency;
  assetForm.quote_mode = item.quote_mode;
  assetForm.exchange_code = item.exchange_code;
  assetForm.is_trade_supported = item.is_trade_supported;
  assetForm.meta_json_text = item.meta_json ? JSON.stringify(item.meta_json, null, 2) : "";
}

function openCreateAssetModal(): void {
  if (!canManageAssets.value) {
    pushLog("Asset Create", "ERROR", "Admin/Maintainer only");
    return;
  }
  resetAssetFormForCreate();
  assetModal.mode = "CREATE";
  assetModal.open = true;
}

function openEditAssetModal(item: AssetTableRowOut): void {
  if (!canManageAssets.value) {
    pushLog("Asset Edit", "ERROR", "Admin/Maintainer only");
    return;
  }
  fillAssetForm(item);
  assetModal.mode = "EDIT";
  assetModal.open = true;
}

function selectAssetForQuote(item: AssetTableRowOut): void {
  manualQuoteForm.asset_id = String(item.id);
  manualQuoteForm.currency = normalizeUpper(item.currency || "KRW");
}

function closeAssetModal(): void {
  if (loading.action || loading.confirm) return;
  assetModal.open = false;
}

function askConfirm(title: string, message: string, action: () => Promise<void>): void {
  confirmModal.open = true;
  confirmModal.title = title;
  confirmModal.message = message;
  pendingAction.value = action;
}

function closeConfirm(): void {
  if (loading.confirm) return;
  confirmModal.open = false;
  pendingAction.value = null;
}

async function executeConfirm(): Promise<void> {
  if (!pendingAction.value) return;
  loading.confirm = true;
  try {
    await pendingAction.value();
  } finally {
    loading.confirm = false;
    closeConfirm();
  }
}

function runAction(
  action: string,
  title: string,
  message: string,
  task: () => Promise<void>,
  hooks?: { onStart?: () => void; onFinally?: () => void },
): void {
  askConfirm(title, message, async () => {
    hooks?.onStart?.();
    loading.action = true;
    try {
      await task();
      pushLog(action, "SUCCESS", "Completed");
      await refreshData();
    } catch (error) {
      pushLog(action, "ERROR", getErrorMessage(error));
    } finally {
      loading.action = false;
      hooks?.onFinally?.();
    }
  });
}

function buildAssetPayload(): AssetCreateIn {
  const name = assetForm.name.trim();
  if (!name) throw new Error("Name is required");

  const assetClass = assetForm.asset_class.trim();
  if (!assetClass) throw new Error("Class is required");

  const currency = normalizeUpper(assetForm.currency);
  if (!currency) throw new Error("Currency is required");
  if (currency.length !== 3) throw new Error("Currency must be 3 letters");

  const quoteMode = assetForm.quote_mode.trim();
  if (!quoteMode) throw new Error("Quote mode is required");

  const exchangeCode = normalizeUpper(assetForm.exchange_code);
  if (!exchangeCode) throw new Error("Exchange code is required");

  return {
    asset_class: assetClass,
    symbol: normalizeUpper(assetForm.symbol) || null,
    name,
    currency,
    quote_mode: quoteMode as "AUTO" | "MANUAL",
    exchange_code: exchangeCode,
    is_trade_supported: assetForm.is_trade_supported,
    meta_json: parseMetaJson(assetForm.meta_json_text),
  };
}

function submitAssetForm(): void {
  if (!canManageAssets.value) {
    pushLog("Asset Form", "ERROR", "Admin/Maintainer only");
    return;
  }

  try {
    const payload = buildAssetPayload();

    if (assetModal.mode === "CREATE") {
      closeAssetModal();
      runAction("Asset Create", "Create Asset", "새 자산을 생성할까요?", async () => {
        await createAsset(payload);
      });
      return;
    }

    const assetId = toPositiveInt(assetForm.id);
    closeAssetModal();
    runAction("Asset Update", "Apply Asset Update", `Asset #${assetId} 정보를 수정할까요?`, async () => {
      await updateAsset(assetId, payload);
    });
  } catch (error) {
    pushLog("Asset Form", "ERROR", getErrorMessage(error));
  }
}

function askDeleteAsset(item: AssetTableRowOut): void {
  if (!canManageAssets.value) {
    pushLog("Asset Delete", "ERROR", "Admin/Maintainer only");
    return;
  }
  runAction("Asset Delete", "Delete Asset", `Asset #${item.id} (${item.name}) 를 삭제할까요?`, async () => {
    await deleteAsset(item.id);
  });
}

function askUpdateQuotesNow(): void {
  if (!canManageQuotes.value) {
    pushLog("Quote Update", "ERROR", "Admin/Maintainer only");
    return;
  }
  if (quoteUpdatePolling.value) {
    pushLog("Quote Update", "INFO", `Already running (job=${quoteUpdateJobId.value || "-"})`);
    return;
  }
  runAction("Quote Update", "Update Quotes", "AUTO 모드의 모든 자산 시세를 즉시 갱신합니다.", async () => {
    const job = await updateQuotesNow();
    quoteUpdateJobId.value = job.job_id;
    quoteUpdateJobStatus.value = normalizeQuoteJobStatus(job.status);
    quoteUpdateProcessed.value = 0;
    quoteUpdateTotal.value = Number(job.total_assets || 0);
    quoteUpdatePolling.value = true;
    quoteUpdateLastProcessed.value = -1;
    pushLog("Quote Update", "INFO", `Job started: ${job.job_id} (assets=${job.total_assets})`);
    void pollQuoteUpdateJob(job.job_id, Date.now());
  });
}

function askQuoteTestAsset(item: AssetTableRowOut): void {
  if (!canManageQuotes.value) {
    pushLog("Quote Test", "ERROR", "Admin/Maintainer only");
    return;
  }
  if (item.quote_mode !== "AUTO") {
    pushLog("Quote Test", "ERROR", "Quote Test is available only for AUTO mode assets");
    return;
  }

  selectAssetForQuote(item);
  runAction(
    "Quote Test",
    "Quote Test",
    `${item.name} (${item.exchange_code}) 현재가를 단건 테스트 갱신할까요?`,
    async () => {
      const result = await testQuoteForAsset(item.id);
      applyQuoteToAssetRow(item.id, result);
      pushLog("Quote Test", "INFO", `${item.name}: ${formatMoney(result.price, result.currency)} @ ${formatDateTime(result.as_of)}`);
    },
    {
      onStart: () => {
        quoteTestingAssetId.value = item.id;
      },
      onFinally: () => {
        quoteTestingAssetId.value = null;
      },
    },
  );
}

function askApplyManualQuote(): void {
  if (!canManageQuotes.value) {
    pushLog("Manual Quote", "ERROR", "Admin/Maintainer only");
    return;
  }

  if (!manualQuoteForm.asset_id.trim()) {
    pushLog("Manual Quote", "ERROR", "Asset is required");
    return;
  }

  const normalizedPrice = manualQuoteForm.price.trim().replace(/,/g, "");
  const parsedPrice = Number(normalizedPrice);
  if (!normalizedPrice || !Number.isFinite(parsedPrice)) {
    pushLog("Manual Quote", "ERROR", "Price must be a valid number");
    return;
  }
  if (parsedPrice < 0) {
    pushLog("Manual Quote", "ERROR", "Price must be 0 or greater");
    return;
  }

  const normalizedCurrency = normalizeUpper(manualQuoteForm.currency);
  if (!normalizedCurrency || normalizedCurrency.length !== 3) {
    pushLog("Manual Quote", "ERROR", "Currency must be 3 letters");
    return;
  }

  runAction("Manual Quote", "Manual Quote", "수동 시세를 반영할까요?", async () => {
    const payload: ManualQuoteUpsertIn = {
      asset_id: toPositiveInt(manualQuoteForm.asset_id),
      price: normalizedPrice,
      currency: normalizedCurrency,
      as_of: manualQuoteForm.as_of.trim() || null,
      source: manualQuoteForm.source.trim() || null,
    };
    const result = await upsertManualQuote(payload);
    applyQuoteToAssetRow(result.asset_id, result);
  });
}

function resetSecretForm(): void {
  secretForm.id = "";
  secretForm.provider = "DATA_GO_KR";
  secretForm.key_name = "";
  secretForm.secret_value = "";
  secretForm.description = "";
  secretForm.is_active = true;
}

function fillSecretForm(item: AppSecretOut): void {
  secretForm.id = String(item.id);
  secretForm.provider = item.provider;
  secretForm.key_name = item.key_name;
  secretForm.secret_value = "";
  secretForm.description = item.description || "";
  secretForm.is_active = item.is_active;
}

function submitSecretForm(): void {
  if (!canManageAppSecrets.value) {
    pushLog("Secret Vault", "ERROR", "ADMIN only");
    return;
  }

  try {
    const provider = normalizeUpper(secretForm.provider);
    const keyName = normalizeUpper(secretForm.key_name);
    const secretValue = secretForm.secret_value.trim();
    const description = secretForm.description.trim() || null;

    if (!provider) throw new Error("Provider is required");
    if (!keyName) throw new Error("Key name is required");

    if (!secretForm.id) {
      if (!secretValue) throw new Error("Secret value is required");
      runAction("Secret Create", "Create Secret", `Create ${provider}/${keyName}?`, async () => {
        await createAppSecret({
          provider,
          key_name: keyName,
          secret_value: secretValue,
          description,
        });
        resetSecretForm();
      });
      return;
    }

    const secretId = toPositiveInt(secretForm.id);
    runAction("Secret Update", "Update Secret", `Update secret #${secretId}?`, async () => {
      await updateAppSecret(secretId, {
        secret_value: secretValue || undefined,
        description,
        is_active: secretForm.is_active,
      });
      resetSecretForm();
    });
  } catch (error) {
    pushLog("Secret Vault", "ERROR", getErrorMessage(error));
  }
}

function askDeactivateSecret(item: AppSecretOut): void {
  if (!canManageAppSecrets.value) {
    pushLog("Secret Vault", "ERROR", "ADMIN only");
    return;
  }

  runAction("Secret Deactivate", "Deactivate Secret", `Deactivate ${item.provider}/${item.key_name}?`, async () => {
    await deactivateAppSecret(item.id);
    if (secretForm.id === String(item.id)) {
      resetSecretForm();
    }
  });
}

function resetReleaseNoteForm(): void {
  releaseNoteForm.id = "";
  releaseNoteForm.released_at = "";
  releaseNoteForm.title = "";
  releaseNoteForm.summary = "";
  releaseNoteForm.is_published = true;
}

function fillReleaseNoteForm(item: ReleaseNoteOut): void {
  releaseNoteForm.id = String(item.id);
  releaseNoteForm.released_at = formatDateTimeLocalInput(item.released_at);
  releaseNoteForm.title = item.title;
  releaseNoteForm.summary = item.summary;
  releaseNoteForm.is_published = item.is_published;
}

function submitReleaseNoteForm(): void {
  if (!canManageReleaseNotes.value) {
    pushLog("Release Note", "ERROR", "ADMIN only");
    return;
  }

  try {
    const title = releaseNoteForm.title.trim();
    const summary = releaseNoteForm.summary.trim();
    if (!title) throw new Error("Title is required");
    if (!summary) throw new Error("Summary is required");

    const releasedAt = releaseNoteForm.released_at.trim();
    const payload = {
      released_at: releasedAt ? new Date(releasedAt).toISOString() : null,
      title,
      summary,
      is_published: releaseNoteForm.is_published,
    };

    if (!releaseNoteForm.id) {
      runAction("Release Note Create", "Create Release Note", "새 Release Note를 생성할까요?", async () => {
        await createReleaseNote(payload);
        resetReleaseNoteForm();
      });
      return;
    }

    const releaseNoteId = toPositiveInt(releaseNoteForm.id);
    runAction("Release Note Update", "Update Release Note", `Release Note #${releaseNoteId}를 수정할까요?`, async () => {
      await updateReleaseNote(releaseNoteId, payload);
      resetReleaseNoteForm();
    });
  } catch (error) {
    pushLog("Release Note", "ERROR", getErrorMessage(error));
  }
}

function askUnpublishReleaseNote(item: ReleaseNoteOut): void {
  if (!canManageReleaseNotes.value) {
    pushLog("Release Note", "ERROR", "ADMIN only");
    return;
  }

  runAction("Release Note Unpublish", "Unpublish Release Note", `Release Note #${item.id}를 비공개 처리할까요?`, async () => {
    await unpublishReleaseNote(item.id);
    if (releaseNoteForm.id === String(item.id)) {
      resetReleaseNoteForm();
    }
  });
}

function parseRequiredDecimal(value: string, field: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error(`${field} is required`);
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) throw new Error(`${field} must be a number`);
  return trimmed;
}

function parseOptionalDecimal(value: string): string | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  const parsed = Number(trimmed);
  if (!Number.isFinite(parsed)) throw new Error("Invalid number");
  return trimmed;
}

function parseOptionalInt(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) return null;
  return toPositiveInt(trimmed);
}

function parseEffectiveAt(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) throw new Error("effective_at is required");
  const parsed = new Date(trimmed);
  if (Number.isNaN(parsed.getTime())) throw new Error("effective_at is invalid");
  return parsed.toISOString();
}

async function loadHoldingLookupOptions(force = false): Promise<void> {
  if (lookupLoading.value) return;
  if (!force && holdingAssetOptions.value.length > 0 && holdingPortfolioOptions.value.length > 0) return;
  lookupLoading.value = true;
  try {
    const [assetsOut, portfoliosOut] = await Promise.all([getAssets(), getPortfolios()]);
    holdingAssetOptions.value = assetsOut;
    holdingPortfolioOptions.value = portfoliosOut;
    if (holdingForm.asset_id && !assetsOut.some((item) => String(item.id) === holdingForm.asset_id)) {
      holdingForm.asset_id = "";
    }
    if (holdingForm.portfolio_id && !portfoliosOut.some((item) => String(item.id) === holdingForm.portfolio_id)) {
      holdingForm.portfolio_id = "";
    }
  } catch (error) {
    pushLog("Holding Lookup", "ERROR", getErrorMessage(error));
  } finally {
    lookupLoading.value = false;
  }
}

function toggleQuickCreateHolding(): void {
  quickCreateHoldingOpen.value = !quickCreateHoldingOpen.value;
  if (quickCreateHoldingOpen.value) {
    void loadHoldingLookupOptions(true);
  }
}

function toggleQuickCreateLiability(): void {
  quickCreateLiabilityOpen.value = !quickCreateLiabilityOpen.value;
  if (quickCreateLiabilityOpen.value) {
    void loadHoldingLookupOptions(true);
  }
}

function submitPortfolioCreate(): void {
  if (!canManageAssets.value) {
    pushLog("Portfolio Create", "ERROR", "Admin/Maintainer only");
    return;
  }
  try {
    const name = portfolioForm.name.trim();
    if (!name) throw new Error("Portfolio name is required");
    const baseCurrency = normalizeUpper(portfolioForm.base_currency);
    if (baseCurrency.length !== 3) throw new Error("Base currency must be 3 letters");

    runAction("Portfolio Create", "Create Portfolio", "새 포트폴리오를 생성할까요?", async () => {
      await createPortfolio({
        name,
        type: portfolioForm.type.trim() || "ETC",
        base_currency: baseCurrency,
        exchange_code: normalizeUpper(portfolioForm.exchange_code) || null,
        category: (portfolioForm.category.trim() || null) as
          | "KR_STOCK"
          | "US_STOCK"
          | "CRYPTO"
          | "REAL_ESTATE"
          | "BOND"
          | "CASH"
          | "DEPOSIT_SAVING"
          | "ETC"
          | null,
        cashflow_source_type: portfolioForm.cashflow_source_type.trim() || "MANUAL",
        memo: portfolioForm.memo.trim() || null,
      });
      portfolioForm.name = "";
      portfolioForm.type = "ETC";
      portfolioForm.base_currency = "KRW";
      portfolioForm.category = "ETC";
      portfolioForm.cashflow_source_type = "MANUAL";
      portfolioForm.memo = "";
      portfolioForm.exchange_code = "";
      quickCreatePortfolioOpen.value = false;
    });
  } catch (error) {
    pushLog("Portfolio Create", "ERROR", getErrorMessage(error));
  }
}

function fillPortfolioEditForm(item: PortfolioTableRowOut): void {
  portfolioEditForm.id = String(item.id);
  portfolioEditForm.name = item.name;
  portfolioEditForm.type = item.type || "ETC";
  portfolioEditForm.base_currency = item.base_currency || "KRW";
  portfolioEditForm.exchange_code = item.exchange_code || "";
  portfolioEditForm.category = item.category || "";
  portfolioEditForm.cashflow_source_type = item.cashflow_source_type || "MANUAL";
  portfolioEditForm.cumulative_deposit_amount = String(item.cumulative_deposit_amount ?? "0");
  portfolioEditForm.cumulative_withdrawal_amount = String(item.cumulative_withdrawal_amount ?? "0");
  portfolioEditForm.is_included = item.is_included;
  portfolioEditForm.is_hidden = item.is_hidden;
  portfolioEditForm.memo = item.memo || "";
  portfolioEditForm.edit_mode = "SAFE";
  portfolioEditForm.effective_at = nowDateTimeLocalInput();
  portfolioEditForm.reason = "";
}

function openEditPortfolioModal(item: PortfolioTableRowOut): void {
  if (!canManageAssets.value) {
    pushLog("Portfolio Edit", "ERROR", "Admin/Maintainer only");
    return;
  }
  fillPortfolioEditForm(item);
  portfolioEditModal.open = true;
}

function closePortfolioEditModal(): void {
  if (loading.action || loading.confirm) return;
  portfolioEditModal.open = false;
}

function submitPortfolioEdit(): void {
  if (!canManageAssets.value) {
    pushLog("Portfolio Edit", "ERROR", "Admin/Maintainer only");
    return;
  }
  try {
    const portfolioId = toPositiveInt(portfolioEditForm.id);
    const name = portfolioEditForm.name.trim();
    if (!name) throw new Error("Portfolio name is required");
    const baseCurrency = normalizeUpper(portfolioEditForm.base_currency);
    if (baseCurrency.length !== 3) throw new Error("Base currency must be 3 letters");
    const deposit = parseRequiredDecimal(portfolioEditForm.cumulative_deposit_amount, "Cumulative deposit");
    const withdrawal = parseRequiredDecimal(portfolioEditForm.cumulative_withdrawal_amount, "Cumulative withdrawal");
    const editMode = portfolioEditForm.edit_mode;
    if (editMode === "HARD" && !canHardEdit.value) {
      throw new Error("HARD edit requires MAINTAINER+");
    }

    closePortfolioEditModal();
    runAction(
      "Portfolio Update",
      "Apply Portfolio Update",
      editMode === "SAFE"
        ? `Portfolio #${portfolioId}를 Rebaseline 기준으로 수정할까요? (기준일 이전 DEPOSIT/WITHDRAW VOID)`
        : `Portfolio #${portfolioId}를 HARD 모드로 수정할까요? (다음 sync/rebuild에서 덮어써질 수 있음)`,
      async () => {
	        if (editMode === "SAFE") {
	          const rebaselinePayload: PortfolioRebaselineIn = {
	            effective_at: parseEffectiveAt(portfolioEditForm.effective_at),
	            cumulative_deposit_amount: deposit,
	            cumulative_withdrawal_amount: withdrawal,
	            reason: portfolioEditForm.reason.trim() || null,
	          };
	          const rebased = await rebaselinePortfolio(portfolioId, rebaselinePayload);
	          pushLog(
	            "Portfolio Rebaseline",
	            "INFO",
	            `voided=${rebased.voided_transactions}, baseline=${rebased.baseline_transaction_ids.join(",") || "-"}`,
	          );
	          await updatePortfolio(
	            portfolioId,
	            {
              name,
              type: portfolioEditForm.type.trim() || "ETC",
              base_currency: baseCurrency,
              exchange_code: normalizeUpper(portfolioEditForm.exchange_code) || null,
              category: (portfolioEditForm.category.trim() || null) as
                | "KR_STOCK"
                | "US_STOCK"
                | "CRYPTO"
                | "REAL_ESTATE"
                | "BOND"
                | "CASH"
                | "DEPOSIT_SAVING"
                | "ETC"
                | null,
              cashflow_source_type: portfolioEditForm.cashflow_source_type.trim() || "MANUAL",
              is_included: portfolioEditForm.is_included,
              is_hidden: portfolioEditForm.is_hidden,
              memo: portfolioEditForm.memo.trim() || null,
            },
            { edit_mode: "SAFE" },
          );
          return;
        }
        await updatePortfolio(
          portfolioId,
          {
            name,
            type: portfolioEditForm.type.trim() || "ETC",
            base_currency: baseCurrency,
            exchange_code: normalizeUpper(portfolioEditForm.exchange_code) || null,
            category: (portfolioEditForm.category.trim() || null) as
              | "KR_STOCK"
              | "US_STOCK"
              | "CRYPTO"
              | "REAL_ESTATE"
              | "BOND"
              | "CASH"
              | "DEPOSIT_SAVING"
              | "ETC"
              | null,
            cashflow_source_type: portfolioEditForm.cashflow_source_type.trim() || "MANUAL",
            cumulative_deposit_amount: deposit,
            cumulative_withdrawal_amount: withdrawal,
            is_included: portfolioEditForm.is_included,
            is_hidden: portfolioEditForm.is_hidden,
            memo: portfolioEditForm.memo.trim() || null,
          },
          { edit_mode: "HARD" },
        );
      },
    );
  } catch (error) {
    pushLog("Portfolio Edit", "ERROR", getErrorMessage(error));
  }
}

function askDeletePortfolio(item: PortfolioTableRowOut): void {
  runAction("Portfolio Delete", "Delete Portfolio", `Portfolio #${item.id} (${item.name}) 를 삭제할까요?`, async () => {
    await deletePortfolio(item.id);
  });
}

function togglePortfolioIncluded(item: PortfolioTableRowOut): void {
  runAction(
    "Portfolio Included",
    "Toggle Included",
    `Portfolio #${item.id} 집계 포함 값을 ${item.is_included ? "OFF" : "ON"}로 변경할까요?`,
    async () => {
      await updatePortfolio(item.id, { is_included: !item.is_included });
    },
  );
}

function togglePortfolioHidden(item: PortfolioTableRowOut): void {
  runAction(
    "Portfolio Hidden",
    "Toggle Hidden",
    `Portfolio #${item.id} 숨김 값을 ${item.is_hidden ? "OFF" : "ON"}로 변경할까요?`,
    async () => {
      await updatePortfolio(item.id, { is_hidden: !item.is_hidden });
    },
  );
}

async function loadPortfolioCashAccounts(): Promise<void> {
  const portfolioId = parseOptionalInt(portfolioCashMapForm.portfolio_id);
  if (!portfolioId) {
    portfolioCashAccounts.value = [];
    portfolioCashMapForm.asset_id = "";
    return;
  }
  cashAccountLookupLoading.value = true;
  try {
    await loadHoldingLookupOptions();
    const rows = await getPortfolioCashAccounts(portfolioId);
    portfolioCashAccounts.value = rows;
    const byCurrency = rows.find((row) => normalizeUpper(row.currency) === normalizeUpper(portfolioCashMapForm.currency));
    portfolioCashMapForm.asset_id = byCurrency ? String(byCurrency.asset_id) : "";
  } catch (error) {
    pushLog("Cash Mapping", "ERROR", getErrorMessage(error));
  } finally {
    cashAccountLookupLoading.value = false;
  }
}

function submitPortfolioCashMapping(): void {
  if (!canManageAssets.value) {
    pushLog("Cash Mapping", "ERROR", "Admin/Maintainer only");
    return;
  }
  try {
    const portfolioId = toPositiveInt(portfolioCashMapForm.portfolio_id);
    const currency = normalizeUpper(portfolioCashMapForm.currency);
    if (!currency) throw new Error("Currency is required");
    if (currency.length !== 3) throw new Error("Currency must be 3 letters");
    const assetId = toPositiveInt(portfolioCashMapForm.asset_id);
    runAction(
      "Cash Mapping",
      "Apply Cash Mapping",
      `Portfolio #${portfolioId} ${currency} 대표 cash asset을 #${assetId}로 변경할까요?`,
      async () => {
        await setPortfolioCashAccount(portfolioId, currency, { asset_id: assetId });
        await loadPortfolioCashAccounts();
      },
    );
  } catch (error) {
    pushLog("Cash Mapping", "ERROR", getErrorMessage(error));
  }
}

function submitHoldingCreate(): void {
  try {
    const assetId = toPositiveInt(holdingForm.asset_id.trim());
    const quantity = parseRequiredDecimal(holdingForm.quantity, "Quantity");
    const avgPrice = parseRequiredDecimal(holdingForm.avg_price, "Avg cost");

    runAction("Holding Create", "Create Holding", "새 보유자산을 생성할까요?", async () => {
      await createHolding({
        portfolio_id: parseOptionalInt(holdingForm.portfolio_id),
        asset_id: assetId,
        quantity,
        avg_price: avgPrice,
        avg_price_currency: normalizeUpper(holdingForm.avg_price_currency) || "KRW",
        invested_amount: parseOptionalDecimal(holdingForm.invested_amount),
        invested_amount_currency: normalizeUpper(holdingForm.invested_amount_currency) || "KRW",
        source_type: holdingForm.source_type.trim() || "MANUAL",
        memo: holdingForm.memo.trim() || null,
      });
      holdingForm.asset_id = "";
      holdingForm.quantity = "";
      holdingForm.avg_price = "";
      holdingForm.avg_price_currency = "KRW";
      holdingForm.invested_amount = "";
      holdingForm.invested_amount_currency = "KRW";
      holdingForm.memo = "";
      quickCreateHoldingOpen.value = false;
    });
  } catch (error) {
    pushLog("Holding Create", "ERROR", getErrorMessage(error));
  }
}

function fillHoldingEditForm(item: HoldingTableRowOut): void {
  holdingEditForm.id = String(item.id);
  holdingEditForm.portfolio_id = item.portfolio_id === null ? "" : String(item.portfolio_id);
  holdingEditForm.asset_id = String(item.asset_id);
  holdingEditForm.quantity = String(item.quantity);
  holdingEditForm.avg_price = String(item.avg_price);
  holdingEditForm.avg_price_currency = item.avg_price_currency || "KRW";
  holdingEditForm.invested_amount = item.invested_amount === null ? "" : String(item.invested_amount);
  holdingEditForm.invested_amount_currency = item.invested_amount_currency || "KRW";
  holdingEditForm.source_type = item.source_type || "MANUAL";
  holdingEditForm.is_hidden = item.is_hidden;
  holdingEditForm.memo = item.memo || "";
  holdingEditForm.edit_mode = "SAFE";
  holdingEditForm.effective_at = nowDateTimeLocalInput();
  holdingEditForm.reason = "";
  holdingEditForm.original_portfolio_id = item.portfolio_id === null ? "" : String(item.portfolio_id);
  holdingEditForm.original_asset_id = String(item.asset_id);
}

function openEditHoldingModal(item: HoldingTableRowOut): void {
  fillHoldingEditForm(item);
  holdingEditModal.open = true;
  void loadHoldingLookupOptions(true);
}

function closeHoldingEditModal(): void {
  if (loading.action || loading.confirm) return;
  holdingEditModal.open = false;
}

function submitHoldingEdit(): void {
  try {
    const holdingId = toPositiveInt(holdingEditForm.id);
    const assetId = toPositiveInt(holdingEditForm.asset_id);
    const quantity = parseRequiredDecimal(holdingEditForm.quantity, "Quantity");
    const avgPrice = parseRequiredDecimal(holdingEditForm.avg_price, "Avg cost");
    const editMode = holdingEditForm.edit_mode;
    if (editMode === "HARD" && !canHardEdit.value) {
      throw new Error("HARD edit requires MAINTAINER+");
    }
    const nextPortfolioId = holdingEditForm.portfolio_id.trim();
    if (editMode === "SAFE" && nextPortfolioId !== holdingEditForm.original_portfolio_id) {
      throw new Error("SAFE(Rebaseline) mode에서는 portfolio 변경이 불가합니다. 구조 변경은 HARD 모드를 사용하세요.");
    }
    if (editMode === "SAFE" && String(assetId) !== holdingEditForm.original_asset_id) {
      throw new Error("SAFE(Rebaseline) mode에서는 asset 변경이 불가합니다. 구조 변경은 HARD 모드를 사용하세요.");
    }

    closeHoldingEditModal();
    runAction(
      "Holding Update",
      "Apply Holding Update",
      editMode === "SAFE"
        ? `Holding #${holdingId}를 Rebaseline 기준으로 수정할까요? (기준일 이전 BUY/SELL VOID)`
        : `Holding #${holdingId}를 HARD 모드로 수정할까요? (다음 sync/rebuild에서 덮어써질 수 있음)`,
      async () => {
	        if (editMode === "SAFE") {
	          const rebaselinePayload: HoldingRebaselineIn = {
	            effective_at: parseEffectiveAt(holdingEditForm.effective_at),
	            quantity,
	            avg_price: avgPrice,
	            avg_price_currency: normalizeUpper(holdingEditForm.avg_price_currency) || "KRW",
	            invested_amount: parseOptionalDecimal(holdingEditForm.invested_amount),
	            invested_amount_currency: normalizeUpper(holdingEditForm.invested_amount_currency) || "KRW",
	            reason: holdingEditForm.reason.trim() || null,
	          };
	          const rebased = await rebaselineHolding(holdingId, rebaselinePayload);
	          pushLog(
	            "Holding Rebaseline",
	            "INFO",
	            `voided=${rebased.voided_transactions}, baseline=${rebased.baseline_transaction_ids.join(",") || "-"}`,
	          );
	          await updateHolding(
	            holdingId,
	            {
              is_hidden: holdingEditForm.is_hidden,
              memo: holdingEditForm.memo.trim() || null,
            },
            { edit_mode: "SAFE" },
          );
          return;
        }

        await updateHolding(
          holdingId,
          {
            portfolio_id: parseOptionalInt(holdingEditForm.portfolio_id),
            asset_id: assetId,
            quantity,
            avg_price: avgPrice,
            avg_price_currency: normalizeUpper(holdingEditForm.avg_price_currency) || "KRW",
            invested_amount: parseOptionalDecimal(holdingEditForm.invested_amount),
            invested_amount_currency: normalizeUpper(holdingEditForm.invested_amount_currency) || "KRW",
            source_type: holdingEditForm.source_type.trim() || "MANUAL",
            is_hidden: holdingEditForm.is_hidden,
            memo: holdingEditForm.memo.trim() || null,
          },
          { edit_mode: "HARD" },
        );
      },
    );
  } catch (error) {
    pushLog("Holding Edit", "ERROR", getErrorMessage(error));
  }
}

function askDeleteHolding(item: HoldingTableRowOut): void {
  runAction("Holding Delete", "Delete Holding", `Holding #${item.id} (${item.asset_name}) 를 삭제할까요?`, async () => {
    await deleteHolding(item.id);
  });
}

function toggleHoldingHidden(item: HoldingTableRowOut): void {
  runAction(
    "Holding Hidden",
    "Toggle Hidden",
    `Holding #${item.id} 숨김 값을 ${item.is_hidden ? "OFF" : "ON"}로 변경할까요?`,
    async () => {
      await updateHolding(item.id, { is_hidden: !item.is_hidden });
    },
  );
}

function submitLiabilityCreate(): void {
  try {
    const name = liabilityForm.name.trim();
    if (!name) throw new Error("Liability name is required");
    const balance = parseRequiredDecimal(liabilityForm.outstanding_balance, "Outstanding balance");
    const currency = normalizeUpper(liabilityForm.currency);
    if (currency.length !== 3) throw new Error("Currency must be 3 letters");

    runAction("Liability Create", "Create Liability", "새 부채를 생성할까요?", async () => {
      const created = await createLiability({
        portfolio_id: parseOptionalInt(liabilityForm.portfolio_id),
        name,
        liability_type: liabilityForm.liability_type.trim() || "ETC",
        currency,
        outstanding_balance: balance,
        interest_rate: parseOptionalDecimal(liabilityForm.interest_rate),
        monthly_payment: parseOptionalDecimal(liabilityForm.monthly_payment),
        source_type: liabilityForm.source_type.trim() || "MANUAL",
        memo: liabilityForm.memo.trim() || null,
      });
      if (created.auto_cash_holding_created) {
        pushLog(
          "Auto Cash Holding",
          "INFO",
          `Auto cash holding created (${currency}) for portfolio #${created.portfolio_id ?? "-"}.`,
        );
      }
      liabilityForm.portfolio_id = "";
      liabilityForm.name = "";
      liabilityForm.liability_type = "ETC";
      liabilityForm.currency = "KRW";
      liabilityForm.outstanding_balance = "";
      liabilityForm.interest_rate = "";
      liabilityForm.monthly_payment = "";
      liabilityForm.source_type = "MANUAL";
      liabilityForm.memo = "";
      quickCreateLiabilityOpen.value = false;
    });
  } catch (error) {
    pushLog("Liability Create", "ERROR", getErrorMessage(error));
  }
}

function fillLiabilityEditForm(item: LiabilityTableRowOut): void {
  liabilityEditForm.id = String(item.id);
  liabilityEditForm.portfolio_id = item.portfolio_id === null ? "" : String(item.portfolio_id);
  liabilityEditForm.name = item.name;
  liabilityEditForm.liability_type = item.liability_type || "ETC";
  liabilityEditForm.currency = item.currency || "KRW";
  liabilityEditForm.outstanding_balance = String(item.outstanding_balance);
  liabilityEditForm.interest_rate = item.interest_rate === null ? "" : String(item.interest_rate);
  liabilityEditForm.monthly_payment = item.monthly_payment === null ? "" : String(item.monthly_payment);
  liabilityEditForm.source_type = item.source_type || "MANUAL";
  liabilityEditForm.is_included = item.is_included;
  liabilityEditForm.is_hidden = item.is_hidden;
  liabilityEditForm.memo = item.memo || "";
  liabilityEditForm.edit_mode = "SAFE";
  liabilityEditForm.effective_at = nowDateTimeLocalInput();
  liabilityEditForm.reason = "";
  liabilityEditForm.original_portfolio_id = item.portfolio_id === null ? "" : String(item.portfolio_id);
  liabilityEditForm.original_currency = item.currency || "KRW";
}

function openEditLiabilityModal(item: LiabilityTableRowOut): void {
  fillLiabilityEditForm(item);
  liabilityEditModal.open = true;
  void loadHoldingLookupOptions(true);
}

function closeLiabilityEditModal(): void {
  if (loading.action || loading.confirm) return;
  liabilityEditModal.open = false;
}

function submitLiabilityEdit(): void {
  try {
    const liabilityId = toPositiveInt(liabilityEditForm.id);
    const name = liabilityEditForm.name.trim();
    if (!name) throw new Error("Liability name is required");
    const balance = parseRequiredDecimal(liabilityEditForm.outstanding_balance, "Outstanding balance");
    const currency = normalizeUpper(liabilityEditForm.currency);
    if (currency.length !== 3) throw new Error("Currency must be 3 letters");
    const editMode = liabilityEditForm.edit_mode;
    if (editMode === "HARD" && !canHardEdit.value) {
      throw new Error("HARD edit requires MAINTAINER+");
    }
    if (editMode === "SAFE" && liabilityEditForm.portfolio_id.trim() !== liabilityEditForm.original_portfolio_id) {
      throw new Error("SAFE(Rebaseline) mode에서는 portfolio 변경이 불가합니다. 구조 변경은 HARD 모드를 사용하세요.");
    }
    if (editMode === "SAFE" && currency !== normalizeUpper(liabilityEditForm.original_currency)) {
      throw new Error("SAFE(Rebaseline) mode에서는 currency 변경이 불가합니다. 구조 변경은 HARD 모드를 사용하세요.");
    }

    closeLiabilityEditModal();
    runAction(
      "Liability Update",
      "Apply Liability Update",
      editMode === "SAFE"
        ? `Liability #${liabilityId}를 Rebaseline 기준으로 수정할까요? (기준일 이전 LOAN_BORROW/LOAN_REPAY VOID)`
        : `Liability #${liabilityId}를 HARD 모드로 수정할까요? (다음 sync/rebuild에서 덮어써질 수 있음)`,
      async () => {
	        if (editMode === "SAFE") {
	          const rebaselinePayload: LiabilityRebaselineIn = {
	            effective_at: parseEffectiveAt(liabilityEditForm.effective_at),
	            outstanding_balance: balance,
	            reason: liabilityEditForm.reason.trim() || null,
	          };
	          const rebased = await rebaselineLiability(liabilityId, rebaselinePayload);
	          pushLog(
	            "Liability Rebaseline",
	            "INFO",
	            `voided=${rebased.voided_transactions}, baseline=${rebased.baseline_transaction_ids.join(",") || "-"}`,
	          );
	          const updatedSafe = await updateLiability(
	            liabilityId,
	            {
              name,
              liability_type: liabilityEditForm.liability_type.trim() || "ETC",
              interest_rate: parseOptionalDecimal(liabilityEditForm.interest_rate),
              monthly_payment: parseOptionalDecimal(liabilityEditForm.monthly_payment),
              source_type: liabilityEditForm.source_type.trim() || "MANUAL",
              is_included: liabilityEditForm.is_included,
              is_hidden: liabilityEditForm.is_hidden,
              memo: liabilityEditForm.memo.trim() || null,
            },
            { edit_mode: "SAFE" },
          );
          if (updatedSafe.auto_cash_holding_created) {
            pushLog(
              "Auto Cash Holding",
              "INFO",
              `Auto cash holding created (${currency}) for portfolio #${updatedSafe.portfolio_id ?? "-"}.`,
            );
          }
          return;
        }

        const updatedHard = await updateLiability(
          liabilityId,
          {
            portfolio_id: parseOptionalInt(liabilityEditForm.portfolio_id),
            name,
            liability_type: liabilityEditForm.liability_type.trim() || "ETC",
            currency,
            outstanding_balance: balance,
            interest_rate: parseOptionalDecimal(liabilityEditForm.interest_rate),
            monthly_payment: parseOptionalDecimal(liabilityEditForm.monthly_payment),
            source_type: liabilityEditForm.source_type.trim() || "MANUAL",
            is_included: liabilityEditForm.is_included,
            is_hidden: liabilityEditForm.is_hidden,
            memo: liabilityEditForm.memo.trim() || null,
          },
          { edit_mode: "HARD" },
        );
        if (updatedHard.auto_cash_holding_created) {
          pushLog(
            "Auto Cash Holding",
            "INFO",
            `Auto cash holding created (${currency}) for portfolio #${updatedHard.portfolio_id ?? "-"}.`,
          );
        }
      },
    );
  } catch (error) {
    pushLog("Liability Edit", "ERROR", getErrorMessage(error));
  }
}

function askDeleteLiability(item: LiabilityTableRowOut): void {
  runAction("Liability Delete", "Delete Liability", `Liability #${item.id} (${item.name}) 를 삭제할까요?`, async () => {
    await deleteLiability(item.id);
  });
}

function toggleLiabilityIncluded(item: LiabilityTableRowOut): void {
  runAction(
    "Liability Included",
    "Toggle Included",
    `Liability #${item.id} 순자산 포함 값을 ${item.is_included ? "OFF" : "ON"}로 변경할까요?`,
    async () => {
      await updateLiability(item.id, { is_included: !item.is_included });
    },
  );
}

function toggleLiabilityHidden(item: LiabilityTableRowOut): void {
  runAction(
    "Liability Hidden",
    "Toggle Hidden",
    `Liability #${item.id} 숨김 값을 ${item.is_hidden ? "OFF" : "ON"}로 변경할까요?`,
    async () => {
      await updateLiability(item.id, { is_hidden: !item.is_hidden });
    },
  );
}

async function loadEntityHistory(entityType: EntityType, entityId: number, title: string): Promise<void> {
  entityHistoryState.entity_type = entityType;
  entityHistoryState.entity_id = entityId;
  entityHistoryState.title = title;
  entityHistoryState.loading = true;
  try {
    const page = await getEntityHistory({
      entity_type: entityType,
      entity_id: entityId,
      page: 1,
      page_size: 30,
      sort_by: "created_at",
      sort_order: "desc",
    });
    entityHistoryState.items = page.items;
  } catch (error) {
    pushLog("Entity History", "ERROR", getErrorMessage(error));
    entityHistoryState.items = [];
  } finally {
    entityHistoryState.loading = false;
  }
}

function openEntityHistory(entityType: EntityType, entityId: number, title: string): void {
  entityHistoryModal.open = true;
  void loadEntityHistory(entityType, entityId, title);
}

function closeEntityHistory(): void {
  if (loading.action || loading.confirm) return;
  entityHistoryModal.open = false;
  entityHistoryState.reverting_id = 0;
}

function askRevertEntityHistory(item: EntityHistoryItemOut): void {
  runAction(
    "Entity Revert",
    "Revert Change",
    `History #${item.id} 변경을 원복할까요?`,
    async () => {
      entityHistoryState.reverting_id = item.id;
      await revertEntityHistory(item.id);
      await loadEntityHistory(
        entityHistoryState.entity_type,
        entityHistoryState.entity_id,
        entityHistoryState.title,
      );
    },
    {
      onFinally: () => {
        entityHistoryState.reverting_id = 0;
      },
    },
  );
}

async function refreshData(options?: { logRefresh?: boolean }): Promise<void> {
  const refreshId = ++refreshSequence;
  const shouldLogRefresh = options?.logRefresh ?? true;
  loading.data = true;
  try {
    const meOut = await getMe();

    const [assetsOut, portfoliosOut, holdingsOut, liabilitiesOut, fxOut, staleOut, secretsOut, releaseNotesOut] = await Promise.all([
      getAssetsTable({
        page: assetsQuery.page,
        page_size: assetsQuery.pageSize,
        sort_by: assetsQuery.sortBy,
        sort_order: assetsQuery.sortOrder,
        q: assetsQuery.q.trim() || undefined,
      }),
      getPortfoliosTable({
        page: portfolioQuery.page,
        page_size: portfolioQuery.pageSize,
        sort_by: portfolioQuery.sortBy,
        sort_order: portfolioQuery.sortOrder,
        display_currency: displayCurrency.value,
        q: portfolioQuery.q.trim() || undefined,
      }),
      getHoldingsTable({
        page: holdingQuery.page,
        page_size: holdingQuery.pageSize,
        sort_by: holdingQuery.sortBy,
        sort_order: holdingQuery.sortOrder,
        display_currency: displayCurrency.value,
        q: holdingQuery.q.trim() || undefined,
      }),
      getLiabilitiesTable({
        page: liabilityQuery.page,
        page_size: liabilityQuery.pageSize,
        sort_by: liabilityQuery.sortBy,
        sort_order: liabilityQuery.sortOrder,
        display_currency: displayCurrency.value,
        q: liabilityQuery.q.trim() || undefined,
      }),
      getLatestUsdKrwFxRate().catch(() => null),
      getFxStaleMinutes().catch(() => null),
      meOut.role === "ADMIN" ? listAppSecrets() : Promise.resolve([] as AppSecretOut[]),
      meOut.role === "ADMIN"
        ? getReleaseNotes({ limit: 100, offset: 0, include_unpublished: true })
        : Promise.resolve([] as ReleaseNoteOut[]),
    ]);

    if (refreshId !== refreshSequence) return;

    me.value = meOut;
    assets.value = assetsOut.items;
    portfolioRows.value = portfoliosOut.items;
    holdingRows.value = holdingsOut.items;
    liabilityRows.value = liabilitiesOut.items;
    usdKrwFx.value = fxOut;
    if (staleOut) {
      fxStaleMinutesForm.value = String(staleOut.minutes);
      fxStaleSource.value = staleOut.source;
    }
    appSecrets.value = secretsOut;
    releaseNotes.value = releaseNotesOut;

    assetsQuery.total = assetsOut.total;
    portfolioQuery.total = portfoliosOut.total;
    holdingQuery.total = holdingsOut.total;
    liabilityQuery.total = liabilitiesOut.total;

    if (
      portfolioCashMapForm.portfolio_id &&
      !portfoliosOut.items.some((item) => String(item.id) === portfolioCashMapForm.portfolio_id)
    ) {
      portfolioCashMapForm.portfolio_id = "";
      portfolioCashAccounts.value = [];
      portfolioCashMapForm.asset_id = "";
    }
    const firstPortfolio = portfoliosOut.items[0];
    if (!portfolioCashMapForm.portfolio_id && firstPortfolio) {
      portfolioCashMapForm.portfolio_id = String(firstPortfolio.id);
    }
    if (!portfolioCashMapForm.currency) {
      portfolioCashMapForm.currency = "KRW";
    }

    const selectedStillExists = assetsOut.items.some((item) => String(item.id) === manualQuoteForm.asset_id);
    if (!selectedStillExists) {
      manualQuoteForm.asset_id = assetsOut.items[0] ? String(assetsOut.items[0].id) : "";
    }

    if (meOut.role !== "ADMIN") {
      resetSecretForm();
      resetReleaseNoteForm();
    }

    if (shouldLogRefresh) {
      const adminInfo = meOut.role === "ADMIN" ? `, secrets=${secretsOut.length}, release_notes=${releaseNotesOut.length}` : "";
      pushLog(
        "Refresh",
        "INFO",
        `Agent data loaded (assets=${assetsOut.total}, portfolios=${portfoliosOut.total}, holdings=${holdingsOut.total}, liabilities=${liabilitiesOut.total}${adminInfo})`,
      );
    }
  } catch (error) {
    pushLog("Refresh", "ERROR", getErrorMessage(error));
  } finally {
    loading.data = false;
  }
}

function sortIndicatorFor<TSort extends string>(query: TableQueryState<TSort>, key: TSort): string {
  if (query.sortBy !== key) return "↕";
  return query.sortOrder === "asc" ? "↑" : "↓";
}

async function toggleSortFor<TSort extends string>(query: TableQueryState<TSort>, key: TSort): Promise<void> {
  if (query.sortBy === key) {
    query.sortOrder = query.sortOrder === "asc" ? "desc" : "asc";
  } else {
    query.sortBy = key;
    query.sortOrder = "asc";
  }
  query.page = 1;
  await refreshData();
}

async function movePageFor<TSort extends string>(query: TableQueryState<TSort>, totalPagesCount: number, delta: number): Promise<void> {
  const next = query.page + delta;
  if (next < 1 || next > totalPagesCount) return;
  query.page = next;
  await refreshData();
}

const sortIndicator = (key: AssetTableSortBy): string => sortIndicatorFor(assetsQuery, key);
const portfolioSortIndicator = (key: PortfolioTableSortBy): string => sortIndicatorFor(portfolioQuery, key);
const holdingSortIndicator = (key: HoldingTableSortBy): string => sortIndicatorFor(holdingQuery, key);
const liabilitySortIndicator = (key: LiabilityTableSortBy): string => sortIndicatorFor(liabilityQuery, key);

const toggleSort = async (key: AssetTableSortBy): Promise<void> => toggleSortFor(assetsQuery, key);
const togglePortfolioSort = async (key: PortfolioTableSortBy): Promise<void> => toggleSortFor(portfolioQuery, key);
const toggleHoldingSort = async (key: HoldingTableSortBy): Promise<void> => toggleSortFor(holdingQuery, key);
const toggleLiabilitySort = async (key: LiabilityTableSortBy): Promise<void> => toggleSortFor(liabilityQuery, key);

const movePage = async (delta: number): Promise<void> => movePageFor(assetsQuery, totalPages.value, delta);
const movePortfolioPage = async (delta: number): Promise<void> => movePageFor(portfolioQuery, portfolioTotalPages.value, delta);
const moveHoldingPage = async (delta: number): Promise<void> => movePageFor(holdingQuery, holdingTotalPages.value, delta);
const moveLiabilityPage = async (delta: number): Promise<void> => movePageFor(liabilityQuery, liabilityTotalPages.value, delta);

async function applySearch(): Promise<void> {
  clearSearchDebounce();
  assetsQuery.page = 1;
  await refreshData();
}

async function clearSearch(): Promise<void> {
  clearSearchDebounce();
  if (!assetsQuery.q) return;
  assetsQuery.q = "";
  assetsQuery.page = 1;
  await refreshData();
}

function clearSearchDebounce(): void {
  if (!searchDebounceTimer) return;
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = null;
}

async function applyPortfolioSearch(): Promise<void> {
  clearPortfolioSearchDebounce();
  portfolioQuery.page = 1;
  await refreshData();
}

async function clearPortfolioSearch(): Promise<void> {
  clearPortfolioSearchDebounce();
  if (!portfolioQuery.q) return;
  portfolioQuery.q = "";
  portfolioQuery.page = 1;
  await refreshData();
}

function clearPortfolioSearchDebounce(): void {
  if (!portfolioSearchDebounceTimer) return;
  clearTimeout(portfolioSearchDebounceTimer);
  portfolioSearchDebounceTimer = null;
}

async function applyHoldingSearch(): Promise<void> {
  clearHoldingSearchDebounce();
  holdingQuery.page = 1;
  await refreshData();
}

async function clearHoldingSearch(): Promise<void> {
  clearHoldingSearchDebounce();
  if (!holdingQuery.q) return;
  holdingQuery.q = "";
  holdingQuery.page = 1;
  await refreshData();
}

function clearHoldingSearchDebounce(): void {
  if (!holdingSearchDebounceTimer) return;
  clearTimeout(holdingSearchDebounceTimer);
  holdingSearchDebounceTimer = null;
}

async function applyLiabilitySearch(): Promise<void> {
  clearLiabilitySearchDebounce();
  liabilityQuery.page = 1;
  await refreshData();
}

async function clearLiabilitySearch(): Promise<void> {
  clearLiabilitySearchDebounce();
  if (!liabilityQuery.q) return;
  liabilityQuery.q = "";
  liabilityQuery.page = 1;
  await refreshData();
}

function clearLiabilitySearchDebounce(): void {
  if (!liabilitySearchDebounceTimer) return;
  clearTimeout(liabilitySearchDebounceTimer);
  liabilitySearchDebounceTimer = null;
}

watch(
  () => assetsQuery.q,
  () => {
    clearSearchDebounce();
    searchDebounceTimer = setTimeout(async () => {
      assetsQuery.page = 1;
      await refreshData({ logRefresh: false });
    }, AUTO_SEARCH_DEBOUNCE_MS);
  },
);
watch(
  () => portfolioQuery.q,
  () => {
    clearPortfolioSearchDebounce();
    portfolioSearchDebounceTimer = setTimeout(async () => {
      portfolioQuery.page = 1;
      await refreshData({ logRefresh: false });
    }, AUTO_SEARCH_DEBOUNCE_MS);
  },
);
watch(
  () => holdingQuery.q,
  () => {
    clearHoldingSearchDebounce();
    holdingSearchDebounceTimer = setTimeout(async () => {
      holdingQuery.page = 1;
      await refreshData({ logRefresh: false });
    }, AUTO_SEARCH_DEBOUNCE_MS);
  },
);
watch(
  () => liabilityQuery.q,
  () => {
    clearLiabilitySearchDebounce();
    liabilitySearchDebounceTimer = setTimeout(async () => {
      liabilityQuery.page = 1;
      await refreshData({ logRefresh: false });
    }, AUTO_SEARCH_DEBOUNCE_MS);
  },
);
watch(
  () => portfolioCashMapForm.portfolio_id,
  () => {
    void loadPortfolioCashAccounts();
  },
);
watch(
  () => portfolioCashMapForm.currency,
  () => {
    const byCurrency = portfolioCashAccounts.value.find(
      (row) => normalizeUpper(row.currency) === normalizeUpper(portfolioCashMapForm.currency),
    );
    portfolioCashMapForm.asset_id = byCurrency ? String(byCurrency.asset_id) : "";
  },
);
watch(
  () => manualQuoteForm.asset_id,
  (next) => {
    if (!next) return;
    const selected = assets.value.find((item) => String(item.id) === next);
    if (!selected) return;
    manualQuoteForm.currency = normalizeUpper(selected.currency || "KRW");
  },
);
watch(
  [
    quoteActionsCollapsed,
    secretsVaultCollapsed,
    releaseNotesSectionCollapsed,
    assetsSectionCollapsed,
    portfoliosSectionCollapsed,
    holdingsSectionCollapsed,
    liabilitiesSectionCollapsed,
  ],
  (values) => {
    const [
      nextQuoteActionsCollapsed,
      nextSecretsVaultCollapsed,
      nextReleaseNotesSectionCollapsed,
      nextAssetsSectionCollapsed,
      nextPortfoliosSectionCollapsed,
      nextHoldingsSectionCollapsed,
      nextLiabilitiesSectionCollapsed,
    ] = values;
    saveCollapseState({
      quoteActionsCollapsed: nextQuoteActionsCollapsed,
      secretsVaultCollapsed: nextSecretsVaultCollapsed,
      releaseNotesSectionCollapsed: nextReleaseNotesSectionCollapsed,
      assetsSectionCollapsed: nextAssetsSectionCollapsed,
      portfoliosSectionCollapsed: nextPortfoliosSectionCollapsed,
      holdingsSectionCollapsed: nextHoldingsSectionCollapsed,
      liabilitiesSectionCollapsed: nextLiabilitiesSectionCollapsed,
    });
  },
);

watch(
  () => displayCurrency.value,
  (next, prev) => {
    if (me.value && prev && next !== prev) {
      void refreshData({ logRefresh: false });
    }
  },
);

onMounted(async () => {
  await ensureInitialized();
  await refreshData();
});
onBeforeUnmount(() => {
  clearSearchDebounce();
  clearPortfolioSearchDebounce();
  clearHoldingSearchDebounce();
  clearLiabilitySearchDebounce();
  clearQuoteUpdatePolling();
});
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Agent</p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Asset Control Console</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Role: {{ me?.role || "-" }} / {{ me?.email || "-" }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="isBusy"
            @click="refreshData()"
          >
            {{ loading.data ? "Loading..." : "Refresh Data" }}
          </button>
        </div>
      </div>
    </header>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Secrets Vault (Admin)</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Manage exchange/broker/bank/API credentials by provider+key. List values are masked.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-if="canManageAppSecrets && !secretsVaultCollapsed"
            type="button"
            class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            :disabled="isBusy"
            @click="resetSecretForm"
          >
            Reset Form
          </button>
          <button
            v-if="canManageAppSecrets"
            type="button"
            class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            :disabled="isBusy"
            @click="secretsVaultCollapsed = !secretsVaultCollapsed"
          >
            {{ secretsVaultCollapsed ? "Expand" : "Collapse" }}
          </button>
        </div>
      </div>

      <p v-if="!canManageAppSecrets" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Only ADMIN can view/create/update/deactivate secrets.
      </p>
      <p v-else-if="secretsVaultCollapsed" class="mt-2 text-xs text-slate-500 dark:text-slate-400">섹션이 접혀 있습니다. Expand 버튼으로 열어주세요.</p>
      <template v-else>
        <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <label class="text-xs"
            >Provider
            <input
              v-model="secretForm.provider"
              placeholder="e.g. DATA_GO_KR / UPBIT / KIWOOM / KORBANK"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs"
            >Key Name
            <input
              v-model="secretForm.key_name"
              placeholder="e.g. SERVICE_KEY / ACCESS_TOKEN"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs md:col-span-2"
            >Secret Value {{ secretForm.id ? "(leave blank to keep current value)" : "" }}
            <input
              v-model="secretForm.secret_value"
              type="password"
              placeholder="actual token/key"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs md:col-span-2"
            >Description
            <input
              v-model="secretForm.description"
              placeholder="description (optional)"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs md:col-span-2">
            <input v-model="secretForm.is_active" type="checkbox" />
            <span class="ml-1">Active</span>
          </label>
        </div>

        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            :disabled="isBusy"
            @click="submitSecretForm"
          >
            {{ secretForm.id ? "Update Secret" : "Create Secret" }}
          </button>
          <span v-if="secretForm.id" class="text-xs text-slate-500 dark:text-slate-400">Editing #{{ secretForm.id }}</span>
        </div>

        <div class="mt-3 overflow-x-auto">
          <table class="w-full min-w-[980px] text-left text-xs leading-tight">
            <thead class="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th class="px-2 py-1.5 whitespace-nowrap">ID</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Provider</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Key</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Masked</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Active</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Updated</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in appSecrets" :key="item.id" class="border-t border-slate-200 dark:border-slate-700">
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.id }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.provider }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.key_name }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.masked_value }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.is_active ? "Y" : "N" }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(item.updated_at) }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <button
                      type="button"
                      class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
                      :disabled="isBusy"
                      @click="fillSecretForm(item)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700"
                      :disabled="isBusy || !item.is_active"
                      @click="askDeactivateSecret(item)"
                    >
                      Disable
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="appSecrets.length === 0">
                <td colspan="7" class="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">No secrets registered</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Current Assets Status</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">현재 등록된 자산 목록과 상태입니다. 행 클릭 시 Quote Actions와 동기화됩니다.</p>
        </div>
        <div class="ml-auto flex flex-wrap items-center gap-2">
          <button
            v-if="canManageQuotes"
            type="button"
            class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
            :disabled="isBusy || quoteUpdatePolling"
            @click="askUpdateQuotesNow"
          >
            {{ quoteUpdatePolling ? "Update Quotes Running..." : "Update Quotes Now" }}
          </button>
          <span
            v-if="canManageQuotes"
            class="inline-flex items-center rounded-full border px-2 py-1 text-[11px] font-semibold"
            :class="quoteUpdateStatusClass"
          >
            {{ quoteUpdateStatusLabel }}
          </span>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="isBusy"
            @click="assetsSectionCollapsed = !assetsSectionCollapsed"
          >
            {{ assetsSectionCollapsed ? "Expand" : "Collapse" }}
          </button>
        </div>
      </div>
      <template v-if="!assetsSectionCollapsed">
      <p v-if="canManageQuotes" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        AUTO mode인 모든 Asset 시세를 즉시 갱신합니다. Action 컬럼의 Quote 버튼으로 단건 테스트도 가능합니다.
      </p>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        <template v-if="usdKrwFx">
          {{ formatDateTime(usdKrwFx.as_of) }} 기준 USD/KRW {{ formatFxRate(usdKrwFx.rate) }} (source: {{ usdKrwFx.source }})
        </template>
        <template v-else>
          USD/KRW 환율 정보가 아직 없습니다. Update Quotes Now 실행 시 갱신됩니다.
        </template>
      </p>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <input
          v-model="assetsQuery.q"
          type="text"
          placeholder="Search name/symbol/exchange"
          class="w-64 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
          @keyup.enter="applySearch"
        />
        <button
          type="button"
          class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          :disabled="isBusy"
          @click="applySearch"
        >
          Search
        </button>
        <button
          type="button"
          class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          :disabled="isBusy"
          @click="clearSearch"
        >
          Clear
        </button>
      </div>

      <div class="mt-3 overflow-x-auto">
        <table class="w-full min-w-[2120px] text-left text-xs leading-tight">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('id')">ID <span class="opacity-70">{{ sortIndicator("id") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('name')">Name <span class="opacity-70">{{ sortIndicator("name") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('symbol')">Symbol <span class="opacity-70">{{ sortIndicator("symbol") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('price')">Price <span class="opacity-70">{{ sortIndicator("price") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('currency')">Currency <span class="opacity-70">{{ sortIndicator("currency") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('asset_class')">Class <span class="opacity-70">{{ sortIndicator("asset_class") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('updated_at')">Updated <span class="opacity-70">{{ sortIndicator("updated_at") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('quote_mode')">Quote <span class="opacity-70">{{ sortIndicator("quote_mode") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('quote_as_of')">Quote As Of <span class="opacity-70">{{ sortIndicator("quote_as_of") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('exchange_code')">Exchange <span class="opacity-70">{{ sortIndicator("exchange_code") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('source')">Source <span class="opacity-70">{{ sortIndicator("source") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('trade')">Trade <span class="opacity-70">{{ sortIndicator("trade") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in assets"
              :key="item.id"
              class="cursor-pointer border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40"
              :class="String(item.id) === manualQuoteForm.asset_id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''"
              @click="selectAssetForQuote(item)"
            >
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.id }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.name }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.symbol || "-" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ quotePriceText(item) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.currency }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.asset_class }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(item.updated_at) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.quote_mode }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ quoteAsOfText(item) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.exchange_code }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ quoteSourceText(item) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.is_trade_supported ? "Y" : "N" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">
                <div class="flex min-w-max flex-nowrap gap-1">
	                  <button
	                    type="button"
	                    class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
	                    :disabled="!canManageAssets || isBusy"
	                    @click.stop="openEditAssetModal(item)"
	                  >
	                    Edit
	                  </button>
	                  <button
	                    v-if="canManageEntityHistory"
	                    type="button"
	                    class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
	                    :disabled="isBusy"
	                    @click.stop="openEntityHistory('ASSET', item.id, `Asset #${item.id} ${item.name}`)"
	                  >
	                    History
	                  </button>
	                  <button
	                    v-if="item.quote_mode === 'AUTO'"
	                    type="button"
                    class="rounded border border-sky-300 px-2 py-0.5 text-sky-700 transition hover:bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-sky-800 dark:text-sky-300 dark:hover:bg-sky-900/20 dark:focus:ring-sky-700"
                    :disabled="!canManageQuotes || isBusy"
                    @click.stop="askQuoteTestAsset(item)"
                  >
                    <span class="inline-flex items-center gap-1">
                      <span
                        v-if="quoteTestingAssetId === item.id && loading.action"
                        class="inline-block h-3 w-3 animate-spin rounded-full border border-current border-t-transparent"
                      />
                      <span>{{ quoteTestingAssetId === item.id && loading.action ? "Testing..." : "Quote" }}</span>
                    </span>
                  </button>
                  <button
                    type="button"
                    class="rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700"
                    :disabled="!canManageAssets || isBusy"
                    @click.stop="askDeleteAsset(item)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="assets.length === 0">
              <td colspan="13" class="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">No assets found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span>Total: {{ assetsQuery.total }}</span>
          <span>|</span>
          <span>Page {{ assetsQuery.page }} / {{ totalPages }}</span>
          <span>|</span>
          <label>
            Size
            <select
              v-model.number="assetsQuery.pageSize"
              class="ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950"
              @change="assetsQuery.page = 1; refreshData()"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </label>
          <button
            type="button"
            class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            :disabled="isBusy || assetsQuery.page <= 1"
            @click="movePage(-1)"
          >
            Prev
          </button>
          <button
            type="button"
            class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            :disabled="isBusy || assetsQuery.page >= totalPages"
            @click="movePage(1)"
          >
            Next
          </button>
        </div>

        <button
          type="button"
          class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!canManageAssets || isBusy"
          @click="openCreateAssetModal"
        >
          Create Asset
        </button>
      </div>
      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Create/Edit/Delete는 Admin/Maintainer 전용입니다.</p>
      <p
        v-if="!canManageAssets"
        class="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
      >
        USER/SUPERUSER는 Asset 생성/수정/삭제 권한이 없습니다. Admin/Maintainer에게 요청하세요.
      </p>
      </template>
      <p v-else class="mt-2 text-xs text-slate-500 dark:text-slate-400">섹션이 접혀 있습니다. Expand 버튼으로 열어주세요.</p>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Quote Actions (Admin/Maintainer)</h2>
        <button
          v-if="canManageQuotes"
          type="button"
          class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :disabled="isBusy"
          @click="quoteActionsCollapsed = !quoteActionsCollapsed"
        >
          {{ quoteActionsCollapsed ? "Expand" : "Collapse" }}
        </button>
      </div>

      <p v-if="selectedAssetForQuote" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Selected: {{ selectedAssetForQuote.name }} ({{ selectedAssetForQuote.exchange_code }})
      </p>

      <p v-if="!canManageQuotes" class="mt-2 text-xs text-slate-500 dark:text-slate-400">권한이 없어 조회만 가능합니다.</p>
      <p v-else-if="quoteActionsCollapsed" class="mt-2 text-xs text-slate-500 dark:text-slate-400">폼이 접혀 있습니다. Expand 버튼으로 열어주세요.</p>
      <template v-else>
        <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <label class="text-xs"
            >Asset
            <select
              v-model="manualQuoteForm.asset_id"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Select</option>
              <option v-for="item in assets" :key="item.id" :value="String(item.id)">{{ item.id }} - {{ item.name }} ({{ item.exchange_code }})</option>
            </select>
          </label>
          <label class="text-xs"
            >Price
            <input
              v-model="manualQuoteForm.price"
              placeholder="예: 810000000"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs"
            >Currency
            <input
              v-model="manualQuoteForm.currency"
              maxlength="3"
              placeholder="KRW"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs"
            >As Of
            <input
              v-model="manualQuoteForm.as_of"
              type="datetime-local"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        </div>
        <div class="mt-3">
          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
            :disabled="isBusy"
            @click="askApplyManualQuote"
          >
            Apply Manual Quote
          </button>
        </div>
      </template>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Release Notes (Admin)</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Home 하단 Release Notes 카드를 Agent에서 직접 관리합니다.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            v-if="canManageReleaseNotes && !releaseNotesSectionCollapsed"
            type="button"
            class="rounded border border-slate-300 px-2.5 py-1.5 text-xs transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
            :disabled="isBusy"
            @click="resetReleaseNoteForm"
          >
            Reset Form
          </button>
          <button
            v-if="canManageReleaseNotes"
            type="button"
            class="rounded border border-slate-300 px-2.5 py-1.5 text-xs transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
            :disabled="isBusy"
            @click="releaseNotesSectionCollapsed = !releaseNotesSectionCollapsed"
          >
            {{ releaseNotesSectionCollapsed ? "Expand" : "Collapse" }}
          </button>
        </div>
      </div>

      <p v-if="!canManageReleaseNotes" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        Only ADMIN can view/create/update/unpublish release notes.
      </p>
      <p v-else-if="releaseNotesSectionCollapsed" class="mt-2 text-xs text-slate-500 dark:text-slate-400">
        섹션이 접혀 있습니다. Expand 버튼으로 열어주세요.
      </p>
      <template v-else>
        <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <label class="text-xs"
            >Released At (optional)
            <input
              v-model="releaseNoteForm.released_at"
              type="datetime-local"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs"
            >Title
            <input
              v-model="releaseNoteForm.title"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs md:col-span-2"
            >Summary
            <textarea
              v-model="releaseNoteForm.summary"
              rows="3"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs md:col-span-2">
            <input v-model="releaseNoteForm.is_published" type="checkbox" />
            <span class="ml-1">Published</span>
          </label>
        </div>
        <div class="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white transition hover:bg-indigo-500"
            :disabled="isBusy"
            @click="submitReleaseNoteForm"
          >
            {{ releaseNoteForm.id ? "Update Release Note" : "Create Release Note" }}
          </button>
          <span v-if="releaseNoteForm.id" class="text-xs text-slate-500 dark:text-slate-400">Editing #{{ releaseNoteForm.id }}</span>
        </div>

        <div class="mt-3 overflow-x-auto">
          <table class="w-full min-w-[980px] text-left text-xs leading-tight">
            <thead class="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th class="px-2 py-1.5 whitespace-nowrap">ID</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Released At</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Title</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Summary</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Published</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Updated</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in releaseNotes" :key="item.id" class="border-t border-slate-200 dark:border-slate-700">
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.id }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(item.released_at) }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.title }}</td>
                <td class="px-2 py-1.5">{{ item.summary }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.is_published ? "Y" : "N" }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(item.updated_at) }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">
                  <div class="flex flex-wrap gap-1">
                    <button
                      type="button"
                      class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
                      :disabled="isBusy"
                      @click="fillReleaseNoteForm(item)"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      class="rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700"
                      :disabled="isBusy || !item.is_published"
                      @click="askUnpublishReleaseNote(item)"
                    >
                      Unpublish
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="releaseNotes.length === 0">
                <td colspan="7" class="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">No release notes</td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Portfolios Status</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Server-side sort/pagination/search 적용</p>
        </div>
        <div class="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!canManageAssets || isBusy"
            @click="quickCreatePortfolioOpen = !quickCreatePortfolioOpen"
          >
            {{ quickCreatePortfolioOpen ? "Close Create" : "Quick Create Portfolio" }}
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="isBusy"
            @click="portfoliosSectionCollapsed = !portfoliosSectionCollapsed"
          >
            {{ portfoliosSectionCollapsed ? "Expand" : "Collapse" }}
          </button>
        </div>
      </div>
      <template v-if="!portfoliosSectionCollapsed">
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <input
          v-model="portfolioQuery.q"
          type="text"
          placeholder="Search portfolio name/type/exchange"
          class="w-64 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
          @keyup.enter="applyPortfolioSearch"
        />
        <button type="button" class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy" @click="applyPortfolioSearch">Search</button>
        <button type="button" class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy" @click="clearPortfolioSearch">Clear</button>
      </div>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full min-w-[1220px] text-left text-xs leading-tight">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('id')">ID <span class="opacity-70">{{ portfolioSortIndicator("id") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('name')">Name <span class="opacity-70">{{ portfolioSortIndicator("name") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('type')">Type <span class="opacity-70">{{ portfolioSortIndicator("type") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('category')">Category <span class="opacity-70">{{ portfolioSortIndicator("category") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('exchange_code')">Exchange <span class="opacity-70">{{ portfolioSortIndicator("exchange_code") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('base_currency')">Currency <span class="opacity-70">{{ portfolioSortIndicator("base_currency") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap">Included</th>
              <th class="px-2 py-1.5 whitespace-nowrap">Hidden</th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('cumulative_deposit_amount')">Deposit <span class="opacity-70">{{ portfolioSortIndicator("cumulative_deposit_amount") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('cumulative_withdrawal_amount')">Withdrawal <span class="opacity-70">{{ portfolioSortIndicator("cumulative_withdrawal_amount") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('principal_net')">Net Contribution <span class="opacity-70">{{ portfolioSortIndicator("principal_net") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('gross_assets_total')">Gross Assets <span class="opacity-70">{{ portfolioSortIndicator("gross_assets_total") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('liabilities_total')">Liabilities <span class="opacity-70">{{ portfolioSortIndicator("liabilities_total") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('net_assets_total')">Net Assets <span class="opacity-70">{{ portfolioSortIndicator("net_assets_total") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('debt_adjusted_principal_total')">Debt-Adjusted Principal <span class="opacity-70">{{ portfolioSortIndicator("debt_adjusted_principal_total") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('net_assets_profit_total')">Net Profit <span class="opacity-70">{{ portfolioSortIndicator("net_assets_profit_total") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('net_assets_return_pct')">Net Return% <span class="opacity-70">{{ portfolioSortIndicator("net_assets_return_pct") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('portfolio_profit_total')">Portfolio Profit <span class="opacity-70">{{ portfolioSortIndicator("portfolio_profit_total") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('total_return_pct')">Return% <span class="opacity-70">{{ portfolioSortIndicator("total_return_pct") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('holding_count')">Holdings <span class="opacity-70">{{ portfolioSortIndicator("holding_count") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('liability_count')">Liabilities <span class="opacity-70">{{ portfolioSortIndicator("liability_count") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="togglePortfolioSort('updated_at')">Updated <span class="opacity-70">{{ portfolioSortIndicator("updated_at") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in portfolioRows" :key="item.id" class="border-t border-slate-200 dark:border-slate-700">
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.id }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.name }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.type }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.category || "-" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.exchange_code || "-" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.base_currency }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.is_included ? "Y" : "N" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.is_hidden ? "Y" : "N" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.cumulative_deposit_amount, item.base_currency) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.cumulative_withdrawal_amount, item.base_currency) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatPortfolioPrincipalNet(item) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.gross_assets_total, item.base_currency) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.liabilities_total, item.base_currency) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.net_assets_total, item.base_currency) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.debt_adjusted_principal_total ?? item.principal_minus_debt_total, item.base_currency) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.net_assets_profit_total, item.base_currency) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatPct(item.net_assets_return_pct) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.portfolio_profit_total ?? item.total_pnl_amount, item.base_currency) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatPct(item.total_return_pct) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.holding_count }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.liability_count }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(item.updated_at) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">
                <div class="flex min-w-max flex-nowrap gap-1">
	                  <button
	                    type="button"
	                    class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
	                    :disabled="!canManageAssets || isBusy"
	                    @click="openEditPortfolioModal(item)"
	                  >
	                    Edit
	                  </button>
	                  <button
	                    v-if="canManageEntityHistory"
	                    type="button"
	                    class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
	                    :disabled="isBusy"
	                    @click="openEntityHistory('PORTFOLIO', item.id, `Portfolio #${item.id} ${item.name}`)"
	                  >
	                    History
	                  </button>
	                  <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="!canManageAssets || isBusy" @click="togglePortfolioIncluded(item)">{{ item.is_included ? "Exclude" : "Include" }}</button>
                  <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="!canManageAssets || isBusy" @click="togglePortfolioHidden(item)">{{ item.is_hidden ? "Unhide" : "Hide" }}</button>
                  <button type="button" class="rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20" :disabled="!canManageAssets || isBusy" @click="askDeletePortfolio(item)">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="portfolioRows.length === 0">
              <td colspan="23" class="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">No portfolios found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div class="flex flex-wrap items-center gap-2">
          <span>Total: {{ portfolioQuery.total }}</span>
          <span>|</span>
          <span>Page {{ portfolioQuery.page }} / {{ portfolioTotalPages }}</span>
          <span>|</span>
          <label>Size <select v-model.number="portfolioQuery.pageSize" class="ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950" @change="portfolioQuery.page = 1; refreshData()"><option :value="10">10</option><option :value="20">20</option><option :value="50">50</option></select></label>
          <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy || portfolioQuery.page <= 1" @click="movePortfolioPage(-1)">Prev</button>
          <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy || portfolioQuery.page >= portfolioTotalPages" @click="movePortfolioPage(1)">Next</button>
        </div>
      </div>
      <div class="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        <div class="flex flex-wrap items-start justify-between gap-2">
          <div>
            <h3 class="text-sm font-semibold text-slate-900 dark:text-slate-100">Representative Cash Mapping</h3>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Portfolio + Currency 별 대표 cash asset을 고정합니다. (입출금/Auto Cash Flow 시 이 매핑 우선)
            </p>
          </div>
        </div>
        <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-4">
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Portfolio
            <select
              v-model="portfolioCashMapForm.portfolio_id"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
              :disabled="lookupLoading || isBusy || cashAccountLookupLoading"
            >
              <option value="">Select</option>
              <option v-for="item in sortedHoldingPortfolioOptions" :key="`cash-map-${item.id}`" :value="String(item.id)">
                {{ item.id }} - {{ item.name }}
              </option>
            </select>
          </label>
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Currency
            <input
              v-model="portfolioCashMapForm.currency"
              maxlength="3"
              placeholder="KRW"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950"
              :disabled="isBusy || cashAccountLookupLoading"
            />
          </label>
          <label class="text-xs text-slate-600 dark:text-slate-300 md:col-span-2">
            Cash Asset
            <select
              v-model="portfolioCashMapForm.asset_id"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
              :disabled="isBusy || cashAccountLookupLoading"
            >
              <option value="">Select</option>
              <option v-for="item in cashMapAssetOptions" :key="`cash-asset-${item.id}`" :value="String(item.id)">
                {{ item.id }} - {{ item.name }} ({{ item.currency }})
              </option>
            </select>
          </label>
        </div>
        <div class="mt-2">
          <button
            type="button"
            class="rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="!canManageAssets || isBusy || cashAccountLookupLoading"
            @click="submitPortfolioCashMapping"
          >
            Set Representative Cash
          </button>
        </div>
        <div class="mt-3 overflow-x-auto">
          <table class="w-full min-w-[560px] text-left text-xs leading-tight">
            <thead class="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th class="px-2 py-1.5 whitespace-nowrap">Currency</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Asset ID</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Asset</th>
                <th class="px-2 py-1.5 whitespace-nowrap">Updated</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in portfolioCashAccounts" :key="item.id" class="border-t border-slate-200 dark:border-slate-700">
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.currency }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.asset_id }}</td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ item.asset_name || "-" }} <span class="opacity-70">{{ item.asset_symbol || "" }}</span></td>
                <td class="px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(item.updated_at) }}</td>
              </tr>
              <tr v-if="portfolioCashAccounts.length === 0">
                <td colspan="4" class="px-3 py-3 text-center text-xs text-slate-500 dark:text-slate-400">No cash mapping</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div v-if="quickCreatePortfolioOpen" class="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
          <input v-model="portfolioForm.name" placeholder="Portfolio name" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Type
            <select v-model="portfolioForm.type" class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950">
              <option v-for="opt in portfolioTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>
          <input v-model="portfolioForm.base_currency" placeholder="Base currency" maxlength="3" class="rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950" />
          <input v-model="portfolioForm.exchange_code" placeholder="Exchange code" class="rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950" />
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Category
            <select v-model="portfolioForm.category" class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950">
              <option v-for="opt in portfolioCategoryOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Cashflow Source
            <select v-model="portfolioForm.cashflow_source_type" class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950">
              <option v-for="opt in portfolioCashflowSourceTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>
          <input v-model="portfolioForm.memo" placeholder="Memo" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3" />
        </div>
        <div class="mt-2">
          <button type="button" class="rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500" :disabled="!canManageAssets || isBusy" @click="submitPortfolioCreate">Create Portfolio</button>
        </div>
      </div>
      </template>
      <p v-else class="mt-2 text-xs text-slate-500 dark:text-slate-400">섹션이 접혀 있습니다. Expand 버튼으로 열어주세요.</p>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Holdings Status</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Server-side sort/pagination/search 적용</p>
        </div>
        <div class="ml-auto flex flex-wrap items-center gap-2">
          <button type="button" class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60" :disabled="isBusy" @click="toggleQuickCreateHolding">{{ quickCreateHoldingOpen ? "Close Create" : "Quick Create Holding" }}</button>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="isBusy"
            @click="holdingsSectionCollapsed = !holdingsSectionCollapsed"
          >
            {{ holdingsSectionCollapsed ? "Expand" : "Collapse" }}
          </button>
        </div>
      </div>
      <template v-if="!holdingsSectionCollapsed">
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <input v-model="holdingQuery.q" type="text" placeholder="Search asset/portfolio/symbol" class="w-64 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" @keyup.enter="applyHoldingSearch" />
        <button type="button" class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy" @click="applyHoldingSearch">Search</button>
        <button type="button" class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy" @click="clearHoldingSearch">Clear</button>
      </div>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full min-w-[1220px] text-left text-xs leading-tight">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('id')">ID <span class="opacity-70">{{ holdingSortIndicator("id") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('portfolio_name')">Portfolio <span class="opacity-70">{{ holdingSortIndicator("portfolio_name") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('asset_name')">Asset <span class="opacity-70">{{ holdingSortIndicator("asset_name") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('asset_symbol')">Symbol <span class="opacity-70">{{ holdingSortIndicator("asset_symbol") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('quantity')">Qty <span class="opacity-70">{{ holdingSortIndicator("quantity") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('avg_price')">Avg Cost <span class="opacity-70">{{ holdingSortIndicator("avg_price") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('invested_amount')">Cost Basis <span class="opacity-70">{{ holdingSortIndicator("invested_amount") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('current_price')">Price <span class="opacity-70">{{ holdingSortIndicator("current_price") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('evaluated_amount')">Evaluated <span class="opacity-70">{{ holdingSortIndicator("evaluated_amount") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('pnl_pct')">Profit % <span class="opacity-70">{{ holdingSortIndicator("pnl_pct") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap">Hidden</th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleHoldingSort('updated_at')">Updated <span class="opacity-70">{{ holdingSortIndicator("updated_at") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in holdingRows" :key="item.id" class="border-t border-slate-200 dark:border-slate-700">
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.id }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.portfolio_name || "-" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.asset_name }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.asset_symbol || "-" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatQuantity(item.quantity) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.avg_cost ?? item.avg_price, holdingCurrencyCode(item)) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">
                {{
                  item.cost_basis_total === null || item.cost_basis_total === undefined
                    ? (item.invested_amount === null ? "-" : formatMoney(item.invested_amount, holdingCurrencyCode(item)))
                    : formatMoney(item.cost_basis_total, holdingCurrencyCode(item))
                }}
              </td>
              <td class="px-2 py-1.5 whitespace-nowrap">
                {{ item.current_price === null ? "-" : formatMoney(item.current_price, holdingCurrencyCode(item)) }}
              </td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.evaluated_amount, holdingCurrencyCode(item)) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.pnl_pct === null ? "-" : `${Number(item.pnl_pct).toFixed(2)}%` }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.is_hidden ? "Y" : "N" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(item.updated_at) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
	                  <button
	                    type="button"
	                    class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
	                    :disabled="isBusy"
	                    @click="openEditHoldingModal(item)"
	                  >
	                    Edit
	                  </button>
	                  <button
	                    v-if="canManageEntityHistory"
	                    type="button"
	                    class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
	                    :disabled="isBusy"
	                    @click="openEntityHistory('HOLDING', item.id, `Holding #${item.id} ${item.asset_name}`)"
	                  >
	                    History
	                  </button>
	                  <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy" @click="toggleHoldingHidden(item)">{{ item.is_hidden ? "Unhide" : "Hide" }}</button>
                  <button type="button" class="rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20" :disabled="isBusy" @click="askDeleteHolding(item)">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="holdingRows.length === 0">
              <td colspan="13" class="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">No holdings found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div class="flex flex-wrap items-center gap-2">
          <span>Total: {{ holdingQuery.total }}</span>
          <span>|</span>
          <span>Page {{ holdingQuery.page }} / {{ holdingTotalPages }}</span>
          <span>|</span>
          <label>Size <select v-model.number="holdingQuery.pageSize" class="ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950" @change="holdingQuery.page = 1; refreshData()"><option :value="10">10</option><option :value="20">20</option><option :value="50">50</option></select></label>
          <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy || holdingQuery.page <= 1" @click="moveHoldingPage(-1)">Prev</button>
          <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy || holdingQuery.page >= holdingTotalPages" @click="moveHoldingPage(1)">Next</button>
        </div>
      </div>
      <div v-if="quickCreateHoldingOpen" class="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Portfolio (optional)
            <select
              v-model="holdingForm.portfolio_id"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
              :disabled="lookupLoading || isBusy"
            >
              <option value="">Unassigned</option>
              <option v-for="item in sortedHoldingPortfolioOptions" :key="item.id" :value="String(item.id)">
                {{ item.id }} - {{ item.name }}
              </option>
            </select>
          </label>
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Asset
            <select
              v-model="holdingForm.asset_id"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
              :disabled="lookupLoading || isBusy"
            >
              <option value="">Select Asset</option>
              <option v-for="item in sortedHoldingAssetOptions" :key="item.id" :value="String(item.id)">
                {{ item.id }} - {{ item.name }} ({{ item.exchange_code }})
              </option>
            </select>
          </label>
          <input v-model="holdingForm.quantity" placeholder="Quantity" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
          <input v-model="holdingForm.avg_price" placeholder="Avg Cost" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Avg Cost Currency
            <select
              v-model="holdingForm.avg_price_currency"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
              :disabled="isBusy"
            >
              <option v-for="opt in holdingCurrencyOptions" :key="`holding-create-avg-${opt}`" :value="opt">{{ opt }}</option>
            </select>
          </label>
          <input v-model="holdingForm.invested_amount" placeholder="Cost Basis (optional)" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Cost Basis Currency
            <select
              v-model="holdingForm.invested_amount_currency"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
              :disabled="isBusy"
            >
              <option v-for="opt in holdingCurrencyOptions" :key="`holding-create-invested-${opt}`" :value="opt">{{ opt }}</option>
            </select>
          </label>
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Source Type
            <select
              v-model="holdingForm.source_type"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
            >
              <option v-for="opt in holdingSourceTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>
          <input v-model="holdingForm.memo" placeholder="Memo" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3" />
        </div>
        <div class="mt-2">
          <button type="button" class="rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500" :disabled="isBusy" @click="submitHoldingCreate">Create Holding</button>
        </div>
      </div>
      </template>
      <p v-else class="mt-2 text-xs text-slate-500 dark:text-slate-400">섹션이 접혀 있습니다. Expand 버튼으로 열어주세요.</p>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Liabilities Status</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Server-side sort/pagination/search 적용</p>
        </div>
        <div class="ml-auto flex flex-wrap items-center gap-2">
          <button type="button" class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60" :disabled="isBusy" @click="toggleQuickCreateLiability">{{ quickCreateLiabilityOpen ? "Close Create" : "Quick Create Liability" }}</button>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="isBusy"
            @click="liabilitiesSectionCollapsed = !liabilitiesSectionCollapsed"
          >
            {{ liabilitiesSectionCollapsed ? "Expand" : "Collapse" }}
          </button>
        </div>
      </div>
      <template v-if="!liabilitiesSectionCollapsed">
      <div class="mt-3 flex flex-wrap items-center gap-2">
        <input v-model="liabilityQuery.q" type="text" placeholder="Search liability/portfolio/type" class="w-64 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" @keyup.enter="applyLiabilitySearch" />
        <button type="button" class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy" @click="applyLiabilitySearch">Search</button>
        <button type="button" class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy" @click="clearLiabilitySearch">Clear</button>
      </div>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full min-w-[1100px] text-left text-xs leading-tight">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleLiabilitySort('id')">ID <span class="opacity-70">{{ liabilitySortIndicator("id") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleLiabilitySort('portfolio_name')">Portfolio <span class="opacity-70">{{ liabilitySortIndicator("portfolio_name") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleLiabilitySort('name')">Name <span class="opacity-70">{{ liabilitySortIndicator("name") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleLiabilitySort('liability_type')">Type <span class="opacity-70">{{ liabilitySortIndicator("liability_type") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleLiabilitySort('outstanding_balance')">Balance <span class="opacity-70">{{ liabilitySortIndicator("outstanding_balance") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap">Currency</th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleLiabilitySort('interest_rate')">Rate <span class="opacity-70">{{ liabilitySortIndicator("interest_rate") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleLiabilitySort('monthly_payment')">Monthly <span class="opacity-70">{{ liabilitySortIndicator("monthly_payment") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap">Included</th>
              <th class="px-2 py-1.5 whitespace-nowrap">Hidden</th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleLiabilitySort('updated_at')">Updated <span class="opacity-70">{{ liabilitySortIndicator("updated_at") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in liabilityRows" :key="item.id" class="border-t border-slate-200 dark:border-slate-700">
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.id }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.portfolio_name || "-" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.name }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.liability_type }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatMoney(item.outstanding_balance, item.currency) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.currency }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.interest_rate ?? "-" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">
                {{ item.monthly_payment === null ? "-" : formatMoney(item.monthly_payment, item.currency) }}
              </td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.is_included ? "Y" : "N" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.is_hidden ? "Y" : "N" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(item.updated_at) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
	                  <button
	                    type="button"
	                    class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
	                    :disabled="isBusy"
	                    @click="openEditLiabilityModal(item)"
	                  >
	                    Edit
	                  </button>
	                  <button
	                    v-if="canManageEntityHistory"
	                    type="button"
	                    class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
	                    :disabled="isBusy"
	                    @click="openEntityHistory('LIABILITY', item.id, `Liability #${item.id} ${item.name}`)"
	                  >
	                    History
	                  </button>
	                  <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy" @click="toggleLiabilityIncluded(item)">{{ item.is_included ? "Exclude" : "Include" }}</button>
                  <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy" @click="toggleLiabilityHidden(item)">{{ item.is_hidden ? "Unhide" : "Hide" }}</button>
                  <button type="button" class="rounded border border-rose-300 px-2 py-0.5 text-rose-600 hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20" :disabled="isBusy" @click="askDeleteLiability(item)">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="liabilityRows.length === 0">
              <td colspan="12" class="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">No liabilities found</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-300">
        <div class="flex flex-wrap items-center gap-2">
          <span>Total: {{ liabilityQuery.total }}</span>
          <span>|</span>
          <span>Page {{ liabilityQuery.page }} / {{ liabilityTotalPages }}</span>
          <span>|</span>
          <label>Size <select v-model.number="liabilityQuery.pageSize" class="ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950" @change="liabilityQuery.page = 1; refreshData()"><option :value="10">10</option><option :value="20">20</option><option :value="50">50</option></select></label>
          <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy || liabilityQuery.page <= 1" @click="moveLiabilityPage(-1)">Prev</button>
          <button type="button" class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800" :disabled="isBusy || liabilityQuery.page >= liabilityTotalPages" @click="moveLiabilityPage(1)">Next</button>
        </div>
      </div>
      <div v-if="quickCreateLiabilityOpen" class="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
        <div class="grid grid-cols-1 gap-2 md:grid-cols-3">
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Portfolio (optional)
            <select
              v-model="liabilityForm.portfolio_id"
              class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
              :disabled="lookupLoading || isBusy"
            >
              <option value="">Unassigned</option>
              <option v-for="item in sortedHoldingPortfolioOptions" :key="item.id" :value="String(item.id)">
                {{ item.id }} - {{ item.name }}
              </option>
            </select>
          </label>
          <input v-model="liabilityForm.name" placeholder="Liability name" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Type
            <select v-model="liabilityForm.liability_type" class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950">
              <option v-for="opt in liabilityTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>
          <input v-model="liabilityForm.outstanding_balance" placeholder="Outstanding balance" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
          <input v-model="liabilityForm.currency" placeholder="Currency" maxlength="3" class="rounded border border-slate-300 px-2 py-1.5 text-xs uppercase dark:border-slate-700 dark:bg-slate-950" />
          <input v-model="liabilityForm.interest_rate" placeholder="Interest rate (optional)" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
          <input v-model="liabilityForm.monthly_payment" placeholder="Monthly payment (optional)" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950" />
          <label class="text-xs text-slate-600 dark:text-slate-300">
            Source Type
            <select v-model="liabilityForm.source_type" class="mt-1 w-full rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950">
              <option v-for="opt in liabilitySourceTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
            </select>
          </label>
          <input v-model="liabilityForm.memo" placeholder="Memo" class="rounded border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950 md:col-span-3" />
        </div>
        <div class="mt-2">
          <button type="button" class="rounded bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-indigo-500" :disabled="isBusy" @click="submitLiabilityCreate">Create Liability</button>
        </div>
      </div>
      </template>
      <p v-else class="mt-2 text-xs text-slate-500 dark:text-slate-400">섹션이 접혀 있습니다. Expand 버튼으로 열어주세요.</p>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Execution Log</h2>
      <ul class="mt-3 max-h-72 space-y-2 overflow-y-auto">
        <li
          v-for="item in logs"
          :key="item.id"
          class="rounded-lg border px-3 py-2 text-xs"
          :class="
            item.status === 'SUCCESS'
              ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30'
              : item.status === 'ERROR'
                ? 'border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/30'
                : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40'
          "
        >
          <p class="font-semibold">{{ item.action }} · {{ item.status }}</p>
          <p class="mt-0.5">{{ item.message }}</p>
          <p class="mt-0.5 opacity-70">{{ formatDateTime(item.at) }}</p>
        </li>
      </ul>
    </article>
  </section>

  <div v-if="assetModal.open" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4" @click.self="closeAssetModal">
    <section class="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {{ assetModal.mode === "CREATE" ? "Create Asset" : `Edit Asset #${assetForm.id}` }}
      </h3>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">필수 입력: Name, Class, Currency, Quote Mode, Exchange</p>

      <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <label class="text-xs"
          >Name
          <input
            v-model="assetForm.name"
            placeholder="예: 삼성전자"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs"
          >Class
          <select
            v-model="assetForm.asset_class"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="" disabled>Select class</option>
            <option v-for="item in assetClassOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>

        <label class="text-xs"
          >Symbol
          <input
            v-model="assetForm.symbol"
            placeholder="예: 005930 또는 BTC"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs"
          >Currency
          <input
            v-model="assetForm.currency"
            maxlength="3"
            placeholder="예: KRW"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs"
          >Quote Mode
          <select
            v-model="assetForm.quote_mode"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="" disabled>Select quote mode</option>
            <option v-for="item in quoteModeOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>

        <label class="text-xs"
          >Exchange
          <input
            v-model="assetForm.exchange_code"
            placeholder="예: KRX / UPBIT / KORBIT"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs md:col-span-2">
          <input v-model="assetForm.is_trade_supported" type="checkbox" />
          <span class="ml-1">Trade Supported</span>
        </label>

        <label class="text-xs md:col-span-2"
          >Meta JSON
          <textarea
            v-model="assetForm.meta_json_text"
            rows="4"
            :placeholder="assetMetaJsonPlaceholder"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
          :disabled="loading.action || loading.confirm"
          @click="closeAssetModal"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          :disabled="loading.action || loading.confirm"
          @click="submitAssetForm"
        >
          {{ assetModal.mode === "CREATE" ? "Create" : "Apply" }}
        </button>
      </div>
    </section>
  </div>

  <div v-if="portfolioEditModal.open" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4" @click.self="closePortfolioEditModal">
    <section class="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
	      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit Portfolio #{{ portfolioEditForm.id }}</h3>
	      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">핵심 운영값(집계 포함/숨김/입출금 누적/메모)을 수정할 수 있습니다.</p>
	      <div class="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
	        <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Edit Mode</p>
	        <div class="mt-2 flex flex-wrap items-center gap-4 text-xs">
	          <label class="inline-flex items-center gap-2">
	            <input v-model="portfolioEditForm.edit_mode" type="radio" value="SAFE" />
	            <span>Rebaseline (Recommended)</span>
	          </label>
	          <label class="inline-flex items-center gap-2">
	            <input
	              v-model="portfolioEditForm.edit_mode"
	              type="radio"
	              value="HARD"
	              :disabled="!canHardEdit || loading.action || loading.confirm"
	            />
	            <span>Edit(Hard)</span>
	          </label>
	        </div>
	        <p v-if="!canHardEdit" class="mt-2 text-[11px] text-amber-600 dark:text-amber-300">
	          HARD 모드는 MAINTAINER+ 권한이 필요합니다.
	        </p>
	        <template v-if="portfolioEditForm.edit_mode === 'SAFE'">
	          <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
	            <label class="text-xs">
	              Effective At (KST)
	              <input
	                v-model="portfolioEditForm.effective_at"
	                type="datetime-local"
	                class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	              />
	            </label>
	            <label class="text-xs">
	              Reason (optional)
	              <input
	                v-model="portfolioEditForm.reason"
	                placeholder="예: 월말 정산 기준점 보정"
	                class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	              />
	            </label>
	          </div>
	          <p class="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
	            SAFE는 기준일 이전 DEPOSIT/WITHDRAW 거래를 VOID하고 baseline을 생성합니다.
	          </p>
	        </template>
	        <p v-else class="mt-2 text-[11px] text-rose-600 dark:text-rose-300">
	          HARD는 임시 강제값입니다. 이후 sync/rebuild에서 원장값으로 덮어써질 수 있습니다.
	        </p>
	      </div>

	      <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <label class="text-xs"
          >Name
          <input
            v-model="portfolioEditForm.name"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Type
          <select
            v-model="portfolioEditForm.type"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option v-for="opt in portfolioTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>
        <label class="text-xs"
          >Base Currency
          <input
            v-model="portfolioEditForm.base_currency"
            maxlength="3"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Exchange Code
          <input
            v-model="portfolioEditForm.exchange_code"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Category
          <select
            v-model="portfolioEditForm.category"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">(none)</option>
            <option v-for="opt in portfolioCategoryOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>
        <label class="text-xs"
          >Cashflow Source
          <select
            v-model="portfolioEditForm.cashflow_source_type"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option v-for="opt in portfolioCashflowSourceTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>
        <label class="text-xs"
          >Cumulative Deposit
          <input
            v-model="portfolioEditForm.cumulative_deposit_amount"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Cumulative Withdrawal
          <input
            v-model="portfolioEditForm.cumulative_withdrawal_amount"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs md:col-span-2"
          >Memo
          <input
            v-model="portfolioEditForm.memo"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs md:col-span-2 flex flex-wrap items-center gap-4">
          <span><input v-model="portfolioEditForm.is_included" type="checkbox" /> <span class="ml-1">Included</span></span>
          <span><input v-model="portfolioEditForm.is_hidden" type="checkbox" /> <span class="ml-1">Hidden</span></span>
        </label>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
          :disabled="loading.action || loading.confirm"
          @click="closePortfolioEditModal"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          :disabled="loading.action || loading.confirm"
          @click="submitPortfolioEdit"
        >
          Apply
        </button>
      </div>
    </section>
  </div>

  <div v-if="holdingEditModal.open" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4" @click.self="closeHoldingEditModal">
    <section class="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
	      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit Holding #{{ holdingEditForm.id }}</h3>
	      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Asset/포트폴리오/수량/평단/투입금/숨김/메모를 수정합니다.</p>
	      <div class="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
	        <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Edit Mode</p>
	        <div class="mt-2 flex flex-wrap items-center gap-4 text-xs">
	          <label class="inline-flex items-center gap-2">
	            <input v-model="holdingEditForm.edit_mode" type="radio" value="SAFE" />
	            <span>Rebaseline (Recommended)</span>
	          </label>
	          <label class="inline-flex items-center gap-2">
	            <input
	              v-model="holdingEditForm.edit_mode"
	              type="radio"
	              value="HARD"
	              :disabled="!canHardEdit || loading.action || loading.confirm"
	            />
	            <span>Edit(Hard)</span>
	          </label>
	        </div>
	        <p v-if="!canHardEdit" class="mt-2 text-[11px] text-amber-600 dark:text-amber-300">
	          HARD 모드는 MAINTAINER+ 권한이 필요합니다.
	        </p>
	        <template v-if="holdingEditForm.edit_mode === 'SAFE'">
	          <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
	            <label class="text-xs">
	              Effective At (KST)
	              <input
	                v-model="holdingEditForm.effective_at"
	                type="datetime-local"
	                class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	              />
	            </label>
	            <label class="text-xs">
	              Reason (optional)
	              <input
	                v-model="holdingEditForm.reason"
	                placeholder="예: 과거 수동 입력 정합화"
	                class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	              />
	            </label>
	          </div>
	          <p class="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
	            SAFE는 기준일 이전 BUY/SELL 거래를 VOID하고 baseline BUY를 생성합니다. SAFE에서는 Asset/Portfolio 구조 변경이 불가합니다.
	          </p>
	        </template>
	        <p v-else class="mt-2 text-[11px] text-rose-600 dark:text-rose-300">
	          HARD는 임시 강제값입니다. 이후 sync/rebuild에서 원장값으로 덮어써질 수 있습니다.
	        </p>
	      </div>

	      <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <label class="text-xs"
          >Asset
	          <select
	            v-model="holdingEditForm.asset_id"
	            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	            :disabled="lookupLoading || loading.action || loading.confirm || holdingEditForm.edit_mode === 'SAFE'"
	          >
            <option value="">Select Asset</option>
            <option v-for="item in sortedHoldingAssetOptions" :key="item.id" :value="String(item.id)">
              {{ item.id }} - {{ item.name }} ({{ item.exchange_code }})
            </option>
          </select>
        </label>
        <label class="text-xs"
          >Portfolio (optional)
	          <select
	            v-model="holdingEditForm.portfolio_id"
	            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	            :disabled="lookupLoading || loading.action || loading.confirm || holdingEditForm.edit_mode === 'SAFE'"
	          >
            <option value="">Unassigned</option>
            <option v-for="item in sortedHoldingPortfolioOptions" :key="item.id" :value="String(item.id)">
              {{ item.id }} - {{ item.name }}
            </option>
          </select>
        </label>
        <label class="text-xs"
          >Quantity
          <input
            v-model="holdingEditForm.quantity"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Avg Cost
          <input
            v-model="holdingEditForm.avg_price"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Avg Cost Currency
          <select
            v-model="holdingEditForm.avg_price_currency"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option v-for="opt in holdingCurrencyOptions" :key="`holding-edit-avg-${opt}`" :value="opt">{{ opt }}</option>
          </select>
        </label>
        <label class="text-xs"
          >Cost Basis (optional)
          <input
            v-model="holdingEditForm.invested_amount"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Cost Basis Currency
          <select
            v-model="holdingEditForm.invested_amount_currency"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option v-for="opt in holdingCurrencyOptions" :key="`holding-edit-invested-${opt}`" :value="opt">{{ opt }}</option>
          </select>
        </label>
        <label class="text-xs"
          >Source Type
	          <select
	            v-model="holdingEditForm.source_type"
	            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	            :disabled="holdingEditForm.edit_mode === 'SAFE'"
	          >
            <option v-for="opt in holdingSourceTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>
        <label class="text-xs md:col-span-2"
          >Memo
          <input
            v-model="holdingEditForm.memo"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs md:col-span-2">
          <input v-model="holdingEditForm.is_hidden" type="checkbox" />
          <span class="ml-1">Hidden</span>
        </label>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
          :disabled="loading.action || loading.confirm"
          @click="closeHoldingEditModal"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          :disabled="loading.action || loading.confirm"
          @click="submitHoldingEdit"
        >
          Apply
        </button>
      </div>
    </section>
  </div>

	  <div v-if="liabilityEditModal.open" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4" @click.self="closeLiabilityEditModal">
    <section class="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
	      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Edit Liability #{{ liabilityEditForm.id }}</h3>
	      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">부채 메타/잔액/금리/월납입/포함/숨김 상태를 수정합니다.</p>
	      <div class="mt-3 rounded-lg border border-slate-200 p-3 dark:border-slate-700">
	        <p class="text-xs font-semibold text-slate-700 dark:text-slate-200">Edit Mode</p>
	        <div class="mt-2 flex flex-wrap items-center gap-4 text-xs">
	          <label class="inline-flex items-center gap-2">
	            <input v-model="liabilityEditForm.edit_mode" type="radio" value="SAFE" />
	            <span>Rebaseline (Recommended)</span>
	          </label>
	          <label class="inline-flex items-center gap-2">
	            <input
	              v-model="liabilityEditForm.edit_mode"
	              type="radio"
	              value="HARD"
	              :disabled="!canHardEdit || loading.action || loading.confirm"
	            />
	            <span>Edit(Hard)</span>
	          </label>
	        </div>
	        <p v-if="!canHardEdit" class="mt-2 text-[11px] text-amber-600 dark:text-amber-300">
	          HARD 모드는 MAINTAINER+ 권한이 필요합니다.
	        </p>
	        <template v-if="liabilityEditForm.edit_mode === 'SAFE'">
	          <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
	            <label class="text-xs">
	              Effective At (KST)
	              <input
	                v-model="liabilityEditForm.effective_at"
	                type="datetime-local"
	                class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	              />
	            </label>
	            <label class="text-xs">
	              Reason (optional)
	              <input
	                v-model="liabilityEditForm.reason"
	                placeholder="예: 대출잔액 재기준점"
	                class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	              />
	            </label>
	          </div>
	          <p class="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
	            SAFE는 기준일 이전 LOAN_BORROW/LOAN_REPAY를 VOID하고 baseline LOAN_BORROW를 생성합니다. LOAN_INTEREST는 원금 비영향으로 유지됩니다.
	          </p>
	        </template>
	        <p v-else class="mt-2 text-[11px] text-rose-600 dark:text-rose-300">
	          HARD는 임시 강제값입니다. 이후 sync/rebuild에서 원장값으로 덮어써질 수 있습니다.
	        </p>
	      </div>

	      <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <label class="text-xs"
          >Portfolio (optional)
	          <select
	            v-model="liabilityEditForm.portfolio_id"
	            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
	            :disabled="lookupLoading || loading.action || loading.confirm || liabilityEditForm.edit_mode === 'SAFE'"
	          >
            <option value="">Unassigned</option>
            <option v-for="item in sortedHoldingPortfolioOptions" :key="item.id" :value="String(item.id)">
              {{ item.id }} - {{ item.name }}
            </option>
          </select>
        </label>
        <label class="text-xs"
          >Name
          <input
            v-model="liabilityEditForm.name"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Type
          <select
            v-model="liabilityEditForm.liability_type"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option v-for="opt in liabilityTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>
        <label class="text-xs"
          >Currency
	          <input
	            v-model="liabilityEditForm.currency"
	            maxlength="3"
	            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
	            :disabled="liabilityEditForm.edit_mode === 'SAFE'"
	          />
        </label>
        <label class="text-xs"
          >Outstanding Balance
          <input
            v-model="liabilityEditForm.outstanding_balance"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Interest Rate (optional)
          <input
            v-model="liabilityEditForm.interest_rate"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Monthly Payment (optional)
          <input
            v-model="liabilityEditForm.monthly_payment"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs"
          >Source Type
          <select
            v-model="liabilityEditForm.source_type"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option v-for="opt in liabilitySourceTypeOptions" :key="opt" :value="opt">{{ opt }}</option>
          </select>
        </label>
        <label class="text-xs md:col-span-2"
          >Memo
          <input
            v-model="liabilityEditForm.memo"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
        <label class="text-xs md:col-span-2 flex flex-wrap items-center gap-4">
          <span><input v-model="liabilityEditForm.is_included" type="checkbox" /> <span class="ml-1">Included</span></span>
          <span><input v-model="liabilityEditForm.is_hidden" type="checkbox" /> <span class="ml-1">Hidden</span></span>
        </label>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
          :disabled="loading.action || loading.confirm"
          @click="closeLiabilityEditModal"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          :disabled="loading.action || loading.confirm"
          @click="submitLiabilityEdit"
        >
          Apply
        </button>
      </div>
	    </section>
	  </div>

	  <div v-if="entityHistoryModal.open" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4" @click.self="closeEntityHistory">
	    <section class="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
	      <div class="flex flex-wrap items-start justify-between gap-2">
	        <div>
	          <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Entity History</h3>
	          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
	            {{ entityHistoryState.title }} · {{ entityHistoryState.entity_type }} #{{ entityHistoryState.entity_id }}
	          </p>
	        </div>
	        <button
	          type="button"
	          class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
	          :disabled="loading.action || loading.confirm"
	          @click="closeEntityHistory"
	        >
	          Close
	        </button>
	      </div>
	      <div v-if="entityHistoryState.loading" class="mt-4 rounded-lg border border-slate-200 px-3 py-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
	        Loading history...
	      </div>
	      <div v-else-if="entityHistoryState.items.length === 0" class="mt-4 rounded-lg border border-slate-200 px-3 py-4 text-xs text-slate-500 dark:border-slate-700 dark:text-slate-400">
	        No history found.
	      </div>
	      <div v-else class="mt-4 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
	        <article
	          v-for="item in entityHistoryState.items"
	          :key="item.id"
	          class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
	        >
	          <div class="flex flex-wrap items-center justify-between gap-2">
	            <div class="text-xs text-slate-600 dark:text-slate-300">
	              <span class="font-semibold text-slate-900 dark:text-slate-100">#{{ item.id }} {{ item.action }}</span>
	              <span class="mx-1">·</span>
	              <span>{{ formatDateTime(item.created_at) }}</span>
	              <span class="mx-1">·</span>
	              <span>{{ item.actor_email || "-" }}</span>
	            </div>
	            <button
	              type="button"
	              class="rounded border border-rose-300 px-2 py-0.5 text-xs text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700"
	              :disabled="isBusy || entityHistoryState.reverting_id === item.id"
	              @click="askRevertEntityHistory(item)"
	            >
	              {{ entityHistoryState.reverting_id === item.id ? "Reverting..." : "Revert" }}
	            </button>
	          </div>
	          <p v-if="item.reason" class="mt-1 text-xs text-slate-500 dark:text-slate-400">reason: {{ item.reason }}</p>
	          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
	            changed:
	            <span class="font-medium text-slate-700 dark:text-slate-200">
	              {{ item.changed_fields && item.changed_fields.length > 0 ? item.changed_fields.join(", ") : "-" }}
	            </span>
	          </p>
	          <div class="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2">
	            <div>
	              <p class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">before</p>
	              <pre class="mt-1 max-h-40 overflow-auto rounded-lg bg-slate-50 p-2 text-[11px] leading-tight text-slate-700 dark:bg-slate-950 dark:text-slate-200">{{
	                JSON.stringify(item.before ?? {}, null, 2)
	              }}</pre>
	            </div>
	            <div>
	              <p class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">after</p>
	              <pre class="mt-1 max-h-40 overflow-auto rounded-lg bg-slate-50 p-2 text-[11px] leading-tight text-slate-700 dark:bg-slate-950 dark:text-slate-200">{{
	                JSON.stringify(item.after ?? {}, null, 2)
	              }}</pre>
	            </div>
	          </div>
	        </article>
	      </div>
	    </section>
	  </div>

	  <div v-if="confirmModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4" @click.self="closeConfirm">
    <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ confirmModal.title }}</h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ confirmModal.message }}</p>
      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
          :disabled="loading.confirm"
          @click="closeConfirm"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          :disabled="loading.confirm"
          @click="executeConfirm"
        >
          {{ loading.confirm ? "Running..." : "Confirm" }}
        </button>
      </div>
    </section>
  </div>
</template>



