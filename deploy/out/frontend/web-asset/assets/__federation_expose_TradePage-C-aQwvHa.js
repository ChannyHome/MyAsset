import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, f as formatDateTimeSeoul, s as seoulDateToUtcNaiveIso, A as AxiosError } from './datetime-D3NoeBy6.js';
import { a as getAssets } from './assets-RV6m6tbW.js';
import { c as getPortfolios, b as getLiabilities } from './portfolios-r6VxmkS0.js';

async function getTrades(params = {}) {
  const { data } = await http.get("/trades", { params });
  return data;
}
async function createTrade(payload) {
  const { data } = await http.post("/trades", payload);
  return data;
}
async function updateTrade(tradeId, payload) {
  const { data } = await http.patch(`/trades/${tradeId}`, payload);
  return data;
}
async function voidTrade(tradeId) {
  const { data } = await http.post(`/trades/${tradeId}/void`);
  return data;
}
async function rebuildTrades(payload) {
  const { data } = await http.post("/trades/rebuild", payload);
  return data;
}

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,renderList:_renderList,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock,vModelSelect:_vModelSelect,withDirectives:_withDirectives,createTextVNode:_createTextVNode,vModelText:_vModelText,vModelCheckbox:_vModelCheckbox,createCommentVNode:_createCommentVNode,normalizeClass:_normalizeClass} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex items-start justify-between gap-3" };
const _hoisted_4 = ["aria-expanded"];
const _hoisted_5 = {
  key: 0,
  class: "mt-3 space-y-3"
};
const _hoisted_6 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" };
const _hoisted_7 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_8 = ["value"];
const _hoisted_9 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_10 = ["value"];
const _hoisted_11 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_12 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_13 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300 md:col-span-2" };
const _hoisted_14 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300 md:col-span-2" };
const _hoisted_15 = { class: "grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_16 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_17 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_18 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_19 = ["disabled"];
const _hoisted_20 = ["disabled"];
const _hoisted_21 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_22 = { class: "flex items-start justify-between gap-3" };
const _hoisted_23 = ["aria-expanded"];
const _hoisted_24 = {
  key: 0,
  class: "mt-3 space-y-3"
};
const _hoisted_25 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" };
const _hoisted_26 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_27 = ["value"];
const _hoisted_28 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_29 = ["value"];
const _hoisted_30 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_31 = ["disabled"];
const _hoisted_32 = ["value"];
const _hoisted_33 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_34 = ["disabled"];
const _hoisted_35 = ["value"];
const _hoisted_36 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_37 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_38 = ["disabled"];
const _hoisted_39 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_40 = ["disabled"];
const _hoisted_41 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_42 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_43 = ["disabled"];
const _hoisted_44 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_45 = { class: "block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_46 = { class: "grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_47 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_48 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_49 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_50 = ["disabled"];
const _hoisted_51 = { class: "group relative inline-flex items-center gap-1" };
const _hoisted_52 = ["disabled"];
const _hoisted_53 = { class: "pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-[24rem] rounded-xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 shadow-xl backdrop-blur-sm group-hover:block group-focus-within:block dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200" };
const _hoisted_54 = { class: "mt-2 list-disc space-y-1 pl-4" };
const _hoisted_55 = {
  key: 0,
  class: "rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_56 = {
  key: 1,
  class: "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
};
const _hoisted_57 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_58 = { class: "flex items-start justify-between gap-3" };
const _hoisted_59 = ["aria-expanded"];
const _hoisted_60 = {
  key: 0,
  class: "mt-3 space-y-3"
};
const _hoisted_61 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_62 = { class: "grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-8" };
const _hoisted_63 = ["value"];
const _hoisted_64 = ["value"];
const _hoisted_65 = { class: "flex items-center gap-2" };
const _hoisted_66 = {
  key: 0,
  class: "inline-flex items-center gap-1 rounded-md border border-cyan-400/60 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-700 dark:bg-cyan-900/25 dark:text-cyan-300"
};
const _hoisted_67 = { class: "overflow-x-auto" };
const _hoisted_68 = { class: "min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800" };
const _hoisted_69 = { class: "bg-slate-50 dark:bg-slate-800/80" };
const _hoisted_70 = { class: "px-2 py-2 text-left" };
const _hoisted_71 = { class: "opacity-70" };
const _hoisted_72 = { class: "px-2 py-2 text-left" };
const _hoisted_73 = { class: "opacity-70" };
const _hoisted_74 = { class: "px-2 py-2 text-left" };
const _hoisted_75 = { class: "opacity-70" };
const _hoisted_76 = { class: "px-2 py-2 text-left" };
const _hoisted_77 = { class: "opacity-70" };
const _hoisted_78 = { class: "px-2 py-2 text-left" };
const _hoisted_79 = { class: "opacity-70" };
const _hoisted_80 = { class: "px-2 py-2 text-left" };
const _hoisted_81 = { class: "opacity-70" };
const _hoisted_82 = { class: "px-2 py-2 text-right" };
const _hoisted_83 = { class: "opacity-70" };
const _hoisted_84 = { class: "px-2 py-2 text-right" };
const _hoisted_85 = { class: "opacity-70" };
const _hoisted_86 = { class: "px-2 py-2 text-center" };
const _hoisted_87 = { class: "opacity-70" };
const _hoisted_88 = { class: "divide-y divide-slate-100 dark:divide-slate-800" };
const _hoisted_89 = { key: 0 };
const _hoisted_90 = { class: "px-2 py-2" };
const _hoisted_91 = { class: "px-2 py-2 whitespace-nowrap" };
const _hoisted_92 = { class: "px-2 py-2" };
const _hoisted_93 = { class: "px-2 py-2" };
const _hoisted_94 = { class: "px-2 py-2" };
const _hoisted_95 = { key: 0 };
const _hoisted_96 = { key: 1 };
const _hoisted_97 = { class: "px-2 py-2" };
const _hoisted_98 = { key: 0 };
const _hoisted_99 = { key: 1 };
const _hoisted_100 = { class: "px-2 py-2 text-right" };
const _hoisted_101 = { class: "px-2 py-2 text-right" };
const _hoisted_102 = { class: "px-2 py-2 text-center" };
const _hoisted_103 = { class: "px-2 py-2 text-center" };
const _hoisted_104 = { class: "px-2 py-2 text-center" };
const _hoisted_105 = { class: "px-2 py-2 text-center" };
const _hoisted_106 = { class: "inline-flex gap-1" };
const _hoisted_107 = ["onClick"];
const _hoisted_108 = ["disabled", "onClick"];
const _hoisted_109 = { class: "flex items-center justify-between text-xs" };
const _hoisted_110 = { class: "text-slate-500 dark:text-slate-400" };
const _hoisted_111 = { class: "inline-flex items-center gap-2" };
const _hoisted_112 = ["disabled"];
const _hoisted_113 = ["disabled"];
const {computed,onBeforeUnmount,onMounted,reactive,ref,watch} = await importShared('vue');
const TRADE_COLLAPSE_STORAGE_KEY = "myasset:trade:collapse-state";
const AUTO_SEARCH_DEBOUNCE_MS = 450;
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "TradePage",
  setup(__props) {
    const loading = ref(false);
    const saving = ref(false);
    const transferSaving = ref(false);
    const rebuilding = ref(false);
    const errorMessage = ref("");
    const successMessage = ref("");
    const trades = ref([]);
    const total = ref(0);
    const page = ref(1);
    const pageSize = ref(20);
    const editingId = ref(null);
    const sortBy = ref("executed_at");
    const sortOrder = ref("desc");
    const quickGroup = ref("ALL");
    const transferCollapsed = ref(false);
    const entryCollapsed = ref(false);
    const journalCollapsed = ref(false);
    let journalSearchDebounceTimer = null;
    const journalAutoSearchPending = ref(false);
    const suspendJournalAutoSearch = ref(false);
    const portfolios = ref([]);
    const assets = ref([]);
    const liabilities = ref([]);
    const tradeTypes = [
      "BUY",
      "SELL",
      "DEPOSIT",
      "WITHDRAW",
      "DIVIDEND",
      "FEE",
      "ADJUSTMENT",
      "LOAN_BORROW",
      "LOAN_REPAY",
      "LOAN_INTEREST"
    ];
    const statusOptions = ["POSTED", "VOID"];
    const rebuildHintLines = [
      "DB/HeidiSQL에서 값 직접 수정 후 집계 복구",
      "거래 대량 입력/수정 후 holdings, portfolio, liability 재정렬",
      "Auto apply 설정 변경 후 전체 값 재계산",
      "수치 불일치 의심 시 강제 정합성 복구"
    ];
    const form = reactive({
      portfolio_id: "",
      txn_type: "BUY",
      asset_id: "",
      liability_id: "",
      quantity: "",
      unit_price: "",
      amount: "",
      fee_amount: "",
      currency: "KRW",
      memo: "",
      source_type: "MANUAL",
      auto_apply_cash_holding: true,
      auto_apply_portfolio_cashflow: false
    });
    const transferForm = reactive({
      from_portfolio_id: "",
      to_portfolio_id: "",
      amount: "",
      currency: "KRW",
      executed_at: "",
      memo: "",
      auto_apply_cash_holding: true,
      auto_apply_portfolio_cashflow: true
    });
    const filters = reactive({
      q: "",
      portfolio_id: "",
      asset_id: "",
      liability_id: "",
      txn_type: "",
      status: "",
      from: "",
      to: ""
    });
    const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)));
    const isBuySell = computed(() => form.txn_type === "BUY" || form.txn_type === "SELL");
    const isLoanTxn = computed(
      () => form.txn_type === "LOAN_BORROW" || form.txn_type === "LOAN_REPAY" || form.txn_type === "LOAN_INTEREST"
    );
    const canSelectAsset = computed(() => isBuySell.value || form.txn_type === "DIVIDEND");
    const selectableLoanLiabilities = computed(() => {
      const selectedPortfolioId = toOptionalNumber(form.portfolio_id);
      return liabilities.value.filter(
        (row) => selectedPortfolioId === void 0 || row.portfolio_id === selectedPortfolioId
      );
    });
    function parseApiError(error) {
      if (error instanceof AxiosError) {
        const detail = error.response?.data?.detail;
        if (detail) return detail;
      }
      if (error instanceof Error) return error.message;
      return "Unknown error";
    }
    function toOptionalNumber(value) {
      const raw = value.trim();
      if (!raw) return void 0;
      const parsed = Number(raw.replace(/,/g, ""));
      return Number.isFinite(parsed) ? parsed : void 0;
    }
    function formatDateTime(value) {
      return formatDateTimeSeoul(value);
    }
    function formatNumber(value, digits = 2) {
      if (value === null || value === void 0 || value === "") return "-";
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return String(value);
      return numeric.toLocaleString("ko-KR", { maximumFractionDigits: digits });
    }
    function toggleSort(next) {
      if (sortBy.value === next) {
        sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
      } else {
        sortBy.value = next;
        sortOrder.value = "desc";
      }
      page.value = 1;
      void loadTrades();
    }
    function sortIndicator(next) {
      if (sortBy.value !== next) return "";
      return sortOrder.value === "asc" ? "▲" : "▼";
    }
    function restoreCollapseState() {
      if (typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem(TRADE_COLLAPSE_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
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
            journalCollapsed: journal
          })
        );
      } catch {
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
    function getPortfolioName(portfolioId) {
      if (!portfolioId) return `#${portfolioId ?? "-"}`;
      const row = portfolios.value.find((item) => item.id === portfolioId);
      return row ? row.name : `#${portfolioId}`;
    }
    function applyEdit(row) {
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
    function buildPayload() {
      const payload = {
        portfolio_id: Number(form.portfolio_id),
        txn_type: form.txn_type,
        currency: form.currency.trim().toUpperCase(),
        memo: form.memo.trim() || null,
        source_type: form.source_type,
        auto_apply_cash_holding: form.auto_apply_cash_holding,
        auto_apply_portfolio_cashflow: form.auto_apply_portfolio_cashflow
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
      let withdrawTradeId = null;
      try {
        const fromName = getPortfolioName(fromPortfolioId);
        const toName = getPortfolioName(toPortfolioId);
        const baseMemo = memo || `${fromName} -> ${toName}`;
        const timeMemo = (/* @__PURE__ */ new Date()).toISOString();
        const withdrawPayload = {
          portfolio_id: fromPortfolioId,
          txn_type: "WITHDRAW",
          amount,
          currency,
          executed_at: executedAt || null,
          memo: `[TRANSFER OUT] ${baseMemo} (${timeMemo})`,
          source_type: "MANUAL",
          auto_apply_cash_holding: transferForm.auto_apply_cash_holding,
          auto_apply_portfolio_cashflow: transferForm.auto_apply_portfolio_cashflow
        };
        const withdrawTx = await createTrade(withdrawPayload);
        withdrawTradeId = withdrawTx.id;
        const depositPayload = {
          portfolio_id: toPortfolioId,
          txn_type: "DEPOSIT",
          amount,
          currency,
          executed_at: executedAt || null,
          memo: `[TRANSFER IN] ${baseMemo} (${timeMemo})`,
          source_type: "MANUAL",
          auto_apply_cash_holding: transferForm.auto_apply_cash_holding,
          auto_apply_portfolio_cashflow: transferForm.auto_apply_portfolio_cashflow
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
          q: filters.q.trim() || void 0,
          portfolio_id: toOptionalNumber(filters.portfolio_id),
          asset_id: toOptionalNumber(filters.asset_id),
          liability_id: toOptionalNumber(filters.liability_id),
          txn_type: filters.txn_type || void 0,
          txn_group: quickGroup.value === "ALL" ? void 0 : quickGroup.value,
          status: filters.status || void 0,
          from: seoulDateToUtcNaiveIso(filters.from, false),
          to: seoulDateToUtcNaiveIso(filters.to, true),
          sort_by: sortBy.value,
          sort_order: sortOrder.value
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
      const confirmMessage = editingId.value ? "Update this trade?" : feeAmount > 0 ? "Create BUY/SELL trade + FEE trade?" : "Create this trade?";
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
          let createdMain = null;
          let createdFee = null;
          try {
            createdMain = await createTrade(payload);
            if (isBuySell.value && feeAmount > 0) {
              const feePayload = {
                portfolio_id: Number(form.portfolio_id),
                txn_type: "FEE",
                asset_id: null,
                liability_id: null,
                amount: feeAmount,
                currency: form.currency.trim().toUpperCase(),
                memo: form.memo.trim() ? `[AUTO_FEE for #${createdMain.id}] ${form.memo.trim()}` : `[AUTO_FEE for #${createdMain.id}]`,
                source_type: form.source_type,
                auto_apply_cash_holding: form.auto_apply_cash_holding,
                auto_apply_portfolio_cashflow: false
              };
              createdFee = await createTrade(feePayload);
            }
          } catch (error) {
            if (createdFee) {
              try {
                await voidTrade(createdFee.id);
              } catch {
              }
            }
            if (createdMain) {
              try {
                await voidTrade(createdMain.id);
              } catch {
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
    async function onVoid(row) {
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
          liability_id: toOptionalNumber(filters.liability_id) ?? null
        });
        successMessage.value = `Rebuild done. portfolios=${result.affected_portfolios}, holdings=${result.affected_holdings}, liabilities=${result.affected_liabilities}`;
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
    async function setQuickGroup(next) {
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
    function clearJournalSearchDebounce() {
      if (!journalSearchDebounceTimer) return;
      clearTimeout(journalSearchDebounceTimer);
      journalSearchDebounceTimer = null;
      journalAutoSearchPending.value = false;
    }
    async function applyJournalFiltersDebounced() {
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
    function queueJournalSearch() {
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
      }
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
        () => filters.to
      ],
      () => {
        if (suspendJournalAutoSearch.value) return;
        queueJournalSearch();
      }
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
      { deep: true }
    );
    onMounted(async () => {
      restoreCollapseState();
      const [portfolioData, assetData, liabilityData] = await Promise.all([
        getPortfolios(),
        getAssets(),
        getLiabilities({ include_hidden: true, include_excluded: true })
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
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _cache[99] || (_cache[99] = _createElementVNode("header", { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" }, [
          _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300" }, "Trade"),
          _createElementVNode("h1", { class: "mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Manual Trade Ledger")
        ], -1)),
        _createElementVNode("article", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[48] || (_cache[48] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.08em] text-cyan-700 dark:text-cyan-300" }, "Transfer"),
              _createElementVNode("h2", { class: "mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Portfolio To Portfolio Transfer"),
              _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "한 번 입력하면 WITHDRAW + DEPOSIT 두 거래를 자동 생성합니다.")
            ], -1)),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              "aria-expanded": !transferCollapsed.value,
              onClick: _cache[0] || (_cache[0] = ($event) => transferCollapsed.value = !transferCollapsed.value)
            }, _toDisplayString(transferCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_4)
          ]),
          !transferCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_5, [
            _createElementVNode("div", _hoisted_6, [
              _createElementVNode("label", _hoisted_7, [
                _cache[50] || (_cache[50] = _createTextVNode("From Portfolio ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => transferForm.from_portfolio_id = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[49] || (_cache[49] = _createElementVNode("option", { value: "" }, "Select", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: `from-${p.id}`,
                      value: String(p.id)
                    }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_8);
                  }), 128))
                ], 512), [
                  [_vModelSelect, transferForm.from_portfolio_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_9, [
                _cache[52] || (_cache[52] = _createTextVNode("To Portfolio ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => transferForm.to_portfolio_id = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[51] || (_cache[51] = _createElementVNode("option", { value: "" }, "Select", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: `to-${p.id}`,
                      value: String(p.id)
                    }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_10);
                  }), 128))
                ], 512), [
                  [_vModelSelect, transferForm.to_portfolio_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_11, [
                _cache[53] || (_cache[53] = _createTextVNode("Amount ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => transferForm.amount = $event),
                  placeholder: "1000000",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, transferForm.amount]
                ])
              ]),
              _createElementVNode("label", _hoisted_12, [
                _cache[54] || (_cache[54] = _createTextVNode("Currency ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => transferForm.currency = $event),
                  maxlength: "3",
                  placeholder: "KRW",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, transferForm.currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_13, [
                _cache[55] || (_cache[55] = _createTextVNode("Executed At (optional) ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => transferForm.executed_at = $event),
                  type: "datetime-local",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, transferForm.executed_at]
                ])
              ]),
              _createElementVNode("label", _hoisted_14, [
                _cache[56] || (_cache[56] = _createTextVNode("Memo (optional) ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => transferForm.memo = $event),
                  placeholder: "예: Toss -> Upbit transfer",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, transferForm.memo]
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_15, [
              _createElementVNode("label", _hoisted_16, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => transferForm.auto_apply_cash_holding = $event),
                  type: "checkbox",
                  class: "h-4 w-4"
                }, null, 512), [
                  [_vModelCheckbox, transferForm.auto_apply_cash_holding]
                ]),
                _cache[57] || (_cache[57] = _createElementVNode("span", null, "Auto apply to cash holding", -1))
              ]),
              _createElementVNode("label", _hoisted_17, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => transferForm.auto_apply_portfolio_cashflow = $event),
                  type: "checkbox",
                  class: "h-4 w-4"
                }, null, 512), [
                  [_vModelCheckbox, transferForm.auto_apply_portfolio_cashflow]
                ]),
                _cache[58] || (_cache[58] = _createElementVNode("span", null, "Auto apply to net contribution", -1))
              ])
            ]),
            _createElementVNode("div", _hoisted_18, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60",
                disabled: transferSaving.value,
                onClick: submitTransfer
              }, _toDisplayString(transferSaving.value ? "Transferring..." : "Create Transfer"), 9, _hoisted_19),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: transferSaving.value,
                onClick: resetTransferForm
              }, " Reset Transfer ", 8, _hoisted_20)
            ])
          ])) : _createCommentVNode("", true)
        ]),
        _createElementVNode("article", _hoisted_21, [
          _createElementVNode("div", _hoisted_22, [
            _cache[59] || (_cache[59] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-300" }, "Entry"),
              _createElementVNode("h2", { class: "mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Manual Trade Entry"),
              _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "수동 거래를 입력하고 holdings, portfolio, liability 집계에 반영합니다.")
            ], -1)),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              "aria-expanded": !entryCollapsed.value,
              onClick: _cache[9] || (_cache[9] = ($event) => entryCollapsed.value = !entryCollapsed.value)
            }, _toDisplayString(entryCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_23)
          ]),
          !entryCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_24, [
            _createElementVNode("div", _hoisted_25, [
              _createElementVNode("label", _hoisted_26, [
                _cache[61] || (_cache[61] = _createTextVNode("Portfolio ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.portfolio_id = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[60] || (_cache[60] = _createElementVNode("option", { value: "" }, "Select", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: p.id,
                      value: String(p.id)
                    }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_27);
                  }), 128))
                ], 512), [
                  [_vModelSelect, form.portfolio_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_28, [
                _cache[62] || (_cache[62] = _createTextVNode("Type ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.txn_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(tradeTypes, (type) => {
                    return _createElementVNode("option", {
                      key: type,
                      value: type
                    }, _toDisplayString(type), 9, _hoisted_29);
                  }), 64))
                ], 512), [
                  [_vModelSelect, form.txn_type]
                ])
              ]),
              _createElementVNode("label", _hoisted_30, [
                _cache[64] || (_cache[64] = _createTextVNode("Asset ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.asset_id = $event),
                  disabled: !canSelectAsset.value,
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[63] || (_cache[63] = _createElementVNode("option", { value: "" }, "Select", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(assets.value, (a) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: a.id,
                      value: String(a.id)
                    }, "#" + _toDisplayString(a.id) + " " + _toDisplayString(a.name), 9, _hoisted_32);
                  }), 128))
                ], 8, _hoisted_31), [
                  [_vModelSelect, form.asset_id]
                ])
              ]),
              _createElementVNode("label", _hoisted_33, [
                _cache[66] || (_cache[66] = _createTextVNode("Liability ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.liability_id = $event),
                  disabled: !isLoanTxn.value,
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                }, [
                  _cache[65] || (_cache[65] = _createElementVNode("option", { value: "" }, "Select", -1)),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(selectableLoanLiabilities.value, (l) => {
                    return _openBlock(), _createElementBlock("option", {
                      key: l.id,
                      value: String(l.id)
                    }, "#" + _toDisplayString(l.id) + " " + _toDisplayString(l.name), 9, _hoisted_35);
                  }), 128))
                ], 8, _hoisted_34), [
                  [_vModelSelect, form.liability_id]
                ]),
                _cache[67] || (_cache[67] = _createElementVNode("p", { class: "mt-1 text-[11px] normal-case text-slate-500 dark:text-slate-400" }, "Shows liabilities linked to selected portfolio.", -1))
              ]),
              _createElementVNode("label", _hoisted_36, [
                _cache[68] || (_cache[68] = _createTextVNode("Currency ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.currency = $event),
                  maxlength: "3",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, form.currency]
                ])
              ]),
              _createElementVNode("label", _hoisted_37, [
                _cache[69] || (_cache[69] = _createTextVNode("Quantity ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.quantity = $event),
                  disabled: !isBuySell.value,
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                }, null, 8, _hoisted_38), [
                  [_vModelText, form.quantity]
                ])
              ]),
              _createElementVNode("label", _hoisted_39, [
                _cache[70] || (_cache[70] = _createTextVNode("Unit Price ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => form.unit_price = $event),
                  disabled: !isBuySell.value,
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                }, null, 8, _hoisted_40), [
                  [_vModelText, form.unit_price]
                ])
              ]),
              _createElementVNode("label", _hoisted_41, [
                _cache[71] || (_cache[71] = _createTextVNode("Amount ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => form.amount = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, form.amount]
                ])
              ]),
              _createElementVNode("label", _hoisted_42, [
                _cache[72] || (_cache[72] = _createTextVNode("Fee (optional) ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => form.fee_amount = $event),
                  disabled: !isBuySell.value || !!editingId.value,
                  placeholder: "0",
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                }, null, 8, _hoisted_43), [
                  [_vModelText, form.fee_amount]
                ]),
                _cache[73] || (_cache[73] = _createElementVNode("p", { class: "mt-1 text-[11px] normal-case text-slate-500 dark:text-slate-400" }, " BUY/SELL create 시 fee > 0 이면 FEE 거래가 추가로 생성됩니다. ", -1))
              ]),
              _createElementVNode("label", _hoisted_44, [
                _cache[75] || (_cache[75] = _createTextVNode("Source ", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => form.source_type = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, [..._cache[74] || (_cache[74] = [
                  _createElementVNode("option", { value: "MANUAL" }, "MANUAL", -1),
                  _createElementVNode("option", { value: "AUTO" }, "AUTO", -1)
                ])], 512), [
                  [_vModelSelect, form.source_type]
                ])
              ])
            ]),
            _createElementVNode("label", _hoisted_45, [
              _cache[76] || (_cache[76] = _createTextVNode("Memo ", -1)),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => form.memo = $event),
                class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, form.memo]
              ])
            ]),
            _createElementVNode("div", _hoisted_46, [
              _createElementVNode("label", _hoisted_47, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => form.auto_apply_cash_holding = $event),
                  type: "checkbox",
                  class: "h-4 w-4"
                }, null, 512), [
                  [_vModelCheckbox, form.auto_apply_cash_holding]
                ]),
                _cache[77] || (_cache[77] = _createElementVNode("span", null, "Auto apply to cash holding", -1))
              ]),
              _createElementVNode("label", _hoisted_48, [
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => form.auto_apply_portfolio_cashflow = $event),
                  type: "checkbox",
                  class: "h-4 w-4"
                }, null, 512), [
                  [_vModelCheckbox, form.auto_apply_portfolio_cashflow]
                ]),
                _cache[78] || (_cache[78] = _createElementVNode("span", null, "Auto apply to net contribution", -1))
              ])
            ]),
            _createElementVNode("div", _hoisted_49, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60",
                disabled: saving.value,
                onClick: submit
              }, _toDisplayString(saving.value ? "Saving..." : editingId.value ? "Update Trade" : "Create Trade"), 9, _hoisted_50),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: resetForm
              }, "Reset"),
              _createElementVNode("div", _hoisted_51, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-cyan-300 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 disabled:opacity-60 dark:border-cyan-800 dark:text-cyan-300 dark:hover:bg-cyan-900/30",
                  disabled: rebuilding.value,
                  onClick: onRebuild
                }, _toDisplayString(rebuilding.value ? "Rebuilding..." : "Rebuild Ledger Sync"), 9, _hoisted_52),
                _cache[80] || (_cache[80] = _createElementVNode("button", {
                  type: "button",
                  "aria-label": "Rebuild usage guide",
                  class: "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                }, " i ", -1)),
                _createElementVNode("div", _hoisted_53, [
                  _cache[79] || (_cache[79] = _createElementVNode("p", { class: "font-semibold text-slate-900 dark:text-slate-100" }, "Rebuild Ledger Sync 사용 가이드", -1)),
                  _createElementVNode("ul", _hoisted_54, [
                    (_openBlock(), _createElementBlock(_Fragment, null, _renderList(rebuildHintLines, (line) => {
                      return _createElementVNode("li", { key: line }, _toDisplayString(line), 1);
                    }), 64))
                  ])
                ])
              ])
            ])
          ])) : _createCommentVNode("", true)
        ]),
        errorMessage.value ? (_openBlock(), _createElementBlock("article", _hoisted_55, _toDisplayString(errorMessage.value), 1)) : _createCommentVNode("", true),
        successMessage.value ? (_openBlock(), _createElementBlock("article", _hoisted_56, _toDisplayString(successMessage.value), 1)) : _createCommentVNode("", true),
        _createElementVNode("article", _hoisted_57, [
          _createElementVNode("div", _hoisted_58, [
            _cache[81] || (_cache[81] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:text-indigo-300" }, "Journal"),
              _createElementVNode("h2", { class: "mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Trade Journal"),
              _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "필터/정렬/페이지네이션으로 거래 이력을 조회하고 편집/무효화합니다.")
            ], -1)),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              "aria-expanded": !journalCollapsed.value,
              onClick: _cache[23] || (_cache[23] = ($event) => journalCollapsed.value = !journalCollapsed.value)
            }, _toDisplayString(journalCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_59)
          ]),
          !journalCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_60, [
            _createElementVNode("div", _hoisted_61, [
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", quickGroup.value === "ALL" ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[24] || (_cache[24] = ($event) => setQuickGroup("ALL"))
              }, " ALL ", 2),
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", quickGroup.value === "LOAN" ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[25] || (_cache[25] = ($event) => setQuickGroup("LOAN"))
              }, " LOAN ", 2),
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", quickGroup.value === "CASHFLOW" ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[26] || (_cache[26] = ($event) => setQuickGroup("CASHFLOW"))
              }, " CASHFLOW ", 2),
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", quickGroup.value === "BUYSELL" ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[27] || (_cache[27] = ($event) => setQuickGroup("BUYSELL"))
              }, " BUYSELL ", 2)
            ]),
            _createElementVNode("div", _hoisted_62, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => filters.q = $event),
                placeholder: "Search...",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.q]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => filters.portfolio_id = $event),
                type: "number",
                min: "1",
                placeholder: "Portfolio ID",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.portfolio_id]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[30] || (_cache[30] = ($event) => filters.asset_id = $event),
                type: "number",
                min: "1",
                placeholder: "Asset ID",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.asset_id]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event) => filters.liability_id = $event),
                type: "number",
                min: "1",
                placeholder: "Liability ID",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.liability_id]
              ]),
              _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => filters.txn_type = $event),
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, [
                _cache[82] || (_cache[82] = _createElementVNode("option", { value: "" }, "ALL TYPES", -1)),
                (_openBlock(), _createElementBlock(_Fragment, null, _renderList(tradeTypes, (type) => {
                  return _createElementVNode("option", {
                    key: type,
                    value: type
                  }, _toDisplayString(type), 9, _hoisted_63);
                }), 64))
              ], 512), [
                [_vModelSelect, filters.txn_type]
              ]),
              _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event) => filters.status = $event),
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, [
                _cache[83] || (_cache[83] = _createElementVNode("option", { value: "" }, "ALL STATUS", -1)),
                (_openBlock(), _createElementBlock(_Fragment, null, _renderList(statusOptions, (status) => {
                  return _createElementVNode("option", {
                    key: status,
                    value: status
                  }, _toDisplayString(status), 9, _hoisted_64);
                }), 64))
              ], 512), [
                [_vModelSelect, filters.status]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[34] || (_cache[34] = ($event) => filters.from = $event),
                type: "date",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.from]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => filters.to = $event),
                type: "date",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.to]
              ])
            ]),
            _createElementVNode("div", _hoisted_65, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white hover:bg-cyan-500",
                onClick: applyFilters
              }, " Search "),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: resetFilters
              }, " Reset "),
              journalAutoSearchPending.value ? (_openBlock(), _createElementBlock("span", _hoisted_66, [..._cache[84] || (_cache[84] = [
                _createElementVNode("span", { class: "h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-500 dark:bg-cyan-400" }, null, -1),
                _createTextVNode(" Searching while typing... ", -1)
              ])])) : _createCommentVNode("", true)
            ]),
            _createElementVNode("div", _hoisted_67, [
              _createElementVNode("table", _hoisted_68, [
                _createElementVNode("thead", _hoisted_69, [
                  _createElementVNode("tr", null, [
                    _createElementVNode("th", _hoisted_70, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[36] || (_cache[36] = ($event) => toggleSort("id"))
                      }, [
                        _cache[85] || (_cache[85] = _createTextVNode(" # ", -1)),
                        _createElementVNode("span", _hoisted_71, _toDisplayString(sortIndicator("id")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_72, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[37] || (_cache[37] = ($event) => toggleSort("executed_at"))
                      }, [
                        _cache[86] || (_cache[86] = _createTextVNode(" Time ", -1)),
                        _createElementVNode("span", _hoisted_73, _toDisplayString(sortIndicator("executed_at")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_74, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[38] || (_cache[38] = ($event) => toggleSort("txn_type"))
                      }, [
                        _cache[87] || (_cache[87] = _createTextVNode(" Type ", -1)),
                        _createElementVNode("span", _hoisted_75, _toDisplayString(sortIndicator("txn_type")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_76, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[39] || (_cache[39] = ($event) => toggleSort("portfolio_name"))
                      }, [
                        _cache[88] || (_cache[88] = _createTextVNode(" Portfolio ", -1)),
                        _createElementVNode("span", _hoisted_77, _toDisplayString(sortIndicator("portfolio_name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_78, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[40] || (_cache[40] = ($event) => toggleSort("asset_name"))
                      }, [
                        _cache[89] || (_cache[89] = _createTextVNode(" Asset ", -1)),
                        _createElementVNode("span", _hoisted_79, _toDisplayString(sortIndicator("asset_name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_80, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[41] || (_cache[41] = ($event) => toggleSort("liability_name"))
                      }, [
                        _cache[90] || (_cache[90] = _createTextVNode(" Liability ", -1)),
                        _createElementVNode("span", _hoisted_81, _toDisplayString(sortIndicator("liability_name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_82, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[42] || (_cache[42] = ($event) => toggleSort("amount"))
                      }, [
                        _cache[91] || (_cache[91] = _createTextVNode(" Amount ", -1)),
                        _createElementVNode("span", _hoisted_83, _toDisplayString(sortIndicator("amount")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_84, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[43] || (_cache[43] = ($event) => toggleSort("amount_in_portfolio_currency"))
                      }, [
                        _cache[92] || (_cache[92] = _createTextVNode(" Amount(Base) ", -1)),
                        _createElementVNode("span", _hoisted_85, _toDisplayString(sortIndicator("amount_in_portfolio_currency")), 1)
                      ])
                    ]),
                    _cache[94] || (_cache[94] = _createElementVNode("th", { class: "px-2 py-2 text-center" }, "Auto Cash", -1)),
                    _cache[95] || (_cache[95] = _createElementVNode("th", { class: "px-2 py-2 text-center" }, "Auto Net Contribution", -1)),
                    _createElementVNode("th", _hoisted_86, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[44] || (_cache[44] = ($event) => toggleSort("status"))
                      }, [
                        _cache[93] || (_cache[93] = _createTextVNode(" Status ", -1)),
                        _createElementVNode("span", _hoisted_87, _toDisplayString(sortIndicator("status")), 1)
                      ])
                    ]),
                    _cache[96] || (_cache[96] = _createElementVNode("th", { class: "px-2 py-2 text-center" }, "Action", -1))
                  ])
                ]),
                _createElementVNode("tbody", _hoisted_88, [
                  !loading.value && trades.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_89, [..._cache[97] || (_cache[97] = [
                    _createElementVNode("td", {
                      colspan: "12",
                      class: "px-2 py-6 text-center text-slate-500 dark:text-slate-400"
                    }, "No trades", -1)
                  ])])) : _createCommentVNode("", true),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(trades.value, (row) => {
                    return _openBlock(), _createElementBlock("tr", {
                      key: row.id,
                      class: "hover:bg-slate-50/70 dark:hover:bg-slate-800/40"
                    }, [
                      _createElementVNode("td", _hoisted_90, "#" + _toDisplayString(row.id), 1),
                      _createElementVNode("td", _hoisted_91, _toDisplayString(formatDateTime(row.executed_at)), 1),
                      _createElementVNode("td", _hoisted_92, _toDisplayString(row.txn_type), 1),
                      _createElementVNode("td", _hoisted_93, "#" + _toDisplayString(row.portfolio_id) + " " + _toDisplayString(row.portfolio_name ?? "-"), 1),
                      _createElementVNode("td", _hoisted_94, [
                        row.asset_id ? (_openBlock(), _createElementBlock("span", _hoisted_95, "#" + _toDisplayString(row.asset_id) + " " + _toDisplayString(row.asset_name ?? "-"), 1)) : (_openBlock(), _createElementBlock("span", _hoisted_96, "-"))
                      ]),
                      _createElementVNode("td", _hoisted_97, [
                        row.liability_id ? (_openBlock(), _createElementBlock("span", _hoisted_98, "#" + _toDisplayString(row.liability_id) + " " + _toDisplayString(row.liability_name ?? "-"), 1)) : (_openBlock(), _createElementBlock("span", _hoisted_99, "-"))
                      ]),
                      _createElementVNode("td", _hoisted_100, _toDisplayString(formatNumber(row.amount)) + " " + _toDisplayString(row.currency), 1),
                      _createElementVNode("td", _hoisted_101, _toDisplayString(formatNumber(row.amount_in_portfolio_currency)), 1),
                      _createElementVNode("td", _hoisted_102, _toDisplayString(row.auto_apply_cash_holding ? "ON" : "OFF"), 1),
                      _createElementVNode("td", _hoisted_103, _toDisplayString(row.auto_apply_portfolio_cashflow ? "ON" : "OFF"), 1),
                      _createElementVNode("td", _hoisted_104, [
                        _createElementVNode("span", {
                          class: _normalizeClass([
                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                            row.status === "VOID" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          ])
                        }, _toDisplayString(row.status), 3)
                      ]),
                      _createElementVNode("td", _hoisted_105, [
                        _createElementVNode("div", _hoisted_106, [
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                            onClick: ($event) => applyEdit(row)
                          }, " Edit ", 8, _hoisted_107),
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30",
                            disabled: row.status === "VOID",
                            onClick: ($event) => onVoid(row)
                          }, " Void ", 8, _hoisted_108)
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_109, [
              _createElementVNode("p", _hoisted_110, "total: " + _toDisplayString(total.value), 1),
              _createElementVNode("div", _hoisted_111, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-1 disabled:opacity-50 dark:border-slate-700",
                  disabled: page.value <= 1,
                  onClick: _cache[45] || (_cache[45] = ($event) => page.value -= 1)
                }, "Prev", 8, _hoisted_112),
                _createElementVNode("span", null, "page " + _toDisplayString(page.value) + " / " + _toDisplayString(totalPages.value), 1),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-1 disabled:opacity-50 dark:border-slate-700",
                  disabled: page.value >= totalPages.value,
                  onClick: _cache[46] || (_cache[46] = ($event) => page.value += 1)
                }, "Next", 8, _hoisted_113),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[47] || (_cache[47] = ($event) => pageSize.value = $event),
                  class: "rounded border border-slate-300 px-1 py-1 dark:border-slate-700 dark:bg-slate-950"
                }, [..._cache[98] || (_cache[98] = [
                  _createElementVNode("option", { value: 20 }, "20", -1),
                  _createElementVNode("option", { value: 50 }, "50", -1),
                  _createElementVNode("option", { value: 100 }, "100", -1)
                ])], 512), [
                  [
                    _vModelSelect,
                    pageSize.value,
                    void 0,
                    { number: true }
                  ]
                ])
              ])
            ])
          ])) : _createCommentVNode("", true)
        ])
      ]);
    };
  }
});

export { _sfc_main as default };
