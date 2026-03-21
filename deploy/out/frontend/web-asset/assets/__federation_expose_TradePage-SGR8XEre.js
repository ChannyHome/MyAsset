import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, f as formatDateTimeSeoul, s as seoulDateToUtcNaiveIso, A as AxiosError, t as toDateTimeLocalSeoul } from './datetime-D3NoeBy6.js';
import { a as getAssets } from './assets-RV6m6tbW.js';
import { c as getPortfolios, b as getLiabilities, r as rebaselinePortfolio, h as rebaselineLiability, i as updateLiability } from './portfolios-r6VxmkS0.js';
import { b as getHoldings, r as rebaselineHolding } from './holdings-D-iv7-uK.js';

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

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,normalizeClass:_normalizeClass,renderList:_renderList,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock,vModelSelect:_vModelSelect,withDirectives:_withDirectives,createTextVNode:_createTextVNode,vModelText:_vModelText,vModelCheckbox:_vModelCheckbox,createCommentVNode:_createCommentVNode,normalizeStyle:_normalizeStyle} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "flex flex-col gap-4" };
const _hoisted_3 = ["aria-expanded"];
const _hoisted_4 = {
  key: 0,
  class: "mt-3 space-y-3"
};
const _hoisted_5 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_6 = {
  key: 0,
  class: "space-y-3"
};
const _hoisted_7 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" };
const _hoisted_8 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_9 = ["value"];
const _hoisted_10 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_11 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_12 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_13 = { class: "block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_14 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_15 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_16 = ["disabled"];
const _hoisted_17 = { class: "rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950/50" };
const _hoisted_18 = { class: "flex items-center justify-between gap-2" };
const _hoisted_19 = {
  key: 0,
  class: "mt-1 space-y-1 text-slate-700 dark:text-slate-200"
};
const _hoisted_20 = {
  key: 1,
  class: "mt-1 text-slate-500 dark:text-slate-400"
};
const _hoisted_21 = {
  key: 1,
  class: "space-y-3"
};
const _hoisted_22 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" };
const _hoisted_23 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_24 = ["value"];
const _hoisted_25 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_26 = ["value"];
const _hoisted_27 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_28 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_29 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_30 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_31 = ["value"];
const _hoisted_32 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_33 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_34 = ["value"];
const _hoisted_35 = {
  key: 0,
  class: "rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-700 dark:bg-amber-900/20 dark:text-amber-300"
};
const _hoisted_36 = { class: "block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_37 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_38 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_39 = ["disabled"];
const _hoisted_40 = { class: "rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950/50" };
const _hoisted_41 = { class: "flex items-center justify-between gap-2" };
const _hoisted_42 = {
  key: 0,
  class: "mt-1 space-y-1 text-slate-700 dark:text-slate-200"
};
const _hoisted_43 = {
  key: 1,
  class: "mt-1 text-slate-500 dark:text-slate-400"
};
const _hoisted_44 = {
  key: 2,
  class: "space-y-3"
};
const _hoisted_45 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" };
const _hoisted_46 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_47 = ["value"];
const _hoisted_48 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_49 = ["value"];
const _hoisted_50 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_51 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_52 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_53 = { class: "block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_54 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_55 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_56 = ["disabled"];
const _hoisted_57 = { class: "rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950/50" };
const _hoisted_58 = { class: "flex items-center justify-between gap-2" };
const _hoisted_59 = {
  key: 0,
  class: "mt-1 space-y-1 text-slate-700 dark:text-slate-200"
};
const _hoisted_60 = {
  key: 1,
  class: "mt-1 text-slate-500 dark:text-slate-400"
};
const _hoisted_61 = {
  key: 3,
  class: "space-y-3"
};
const _hoisted_62 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" };
const _hoisted_63 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_64 = ["value"];
const _hoisted_65 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_66 = ["value"];
const _hoisted_67 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_68 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_69 = { class: "block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_70 = ["disabled"];
const _hoisted_71 = { class: "rounded-lg border border-slate-300 bg-slate-50/70 px-3 py-2 text-xs dark:border-slate-700 dark:bg-slate-950/50" };
const _hoisted_72 = { class: "flex items-center justify-between gap-2" };
const _hoisted_73 = {
  key: 0,
  class: "mt-1 space-y-1 text-slate-700 dark:text-slate-200"
};
const _hoisted_74 = {
  key: 1,
  class: "mt-1 text-slate-500 dark:text-slate-400"
};
const _hoisted_75 = ["aria-expanded"];
const _hoisted_76 = {
  key: 0,
  class: "mt-3 space-y-3"
};
const _hoisted_77 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" };
const _hoisted_78 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_79 = ["value"];
const _hoisted_80 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_81 = ["value"];
const _hoisted_82 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_83 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_84 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300 md:col-span-2" };
const _hoisted_85 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300 md:col-span-2" };
const _hoisted_86 = { class: "grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_87 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_88 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_89 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_90 = ["disabled"];
const _hoisted_91 = ["disabled"];
const _hoisted_92 = ["aria-expanded"];
const _hoisted_93 = {
  key: 0,
  class: "mt-3 space-y-3"
};
const _hoisted_94 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" };
const _hoisted_95 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_96 = ["value"];
const _hoisted_97 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_98 = ["value"];
const _hoisted_99 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_100 = ["disabled"];
const _hoisted_101 = ["value"];
const _hoisted_102 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_103 = ["disabled"];
const _hoisted_104 = ["value"];
const _hoisted_105 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_106 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_107 = ["disabled"];
const _hoisted_108 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_109 = ["disabled"];
const _hoisted_110 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_111 = ["placeholder"];
const _hoisted_112 = {
  key: 0,
  class: "mt-1 text-[11px] normal-case text-slate-500 dark:text-slate-400"
};
const _hoisted_113 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_114 = ["disabled"];
const _hoisted_115 = { class: "text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_116 = { class: "block text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" };
const _hoisted_117 = { class: "grid grid-cols-1 gap-2 md:grid-cols-2" };
const _hoisted_118 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_119 = ["disabled"];
const _hoisted_120 = { class: "inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" };
const _hoisted_121 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_122 = ["disabled"];
const _hoisted_123 = { class: "group relative inline-flex items-center gap-1" };
const _hoisted_124 = ["disabled"];
const _hoisted_125 = { class: "pointer-events-none absolute left-0 top-full z-20 mt-2 hidden w-[24rem] rounded-xl border border-slate-200 bg-white/95 p-3 text-xs text-slate-700 shadow-xl backdrop-blur-sm group-hover:block group-focus-within:block dark:border-slate-700 dark:bg-slate-900/95 dark:text-slate-200" };
const _hoisted_126 = { class: "mt-2 list-disc space-y-1 pl-4" };
const _hoisted_127 = {
  key: 0,
  class: "rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_128 = {
  key: 1,
  class: "rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200"
};
const _hoisted_129 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_130 = { class: "flex items-start justify-between gap-3" };
const _hoisted_131 = ["aria-expanded"];
const _hoisted_132 = {
  key: 0,
  class: "mt-3 space-y-3"
};
const _hoisted_133 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_134 = { class: "grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-8" };
const _hoisted_135 = ["value"];
const _hoisted_136 = ["value"];
const _hoisted_137 = { class: "flex items-center gap-2" };
const _hoisted_138 = {
  key: 0,
  class: "inline-flex items-center gap-1 rounded-md border border-cyan-400/60 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-700 dark:border-cyan-700 dark:bg-cyan-900/25 dark:text-cyan-300"
};
const _hoisted_139 = { class: "overflow-x-auto" };
const _hoisted_140 = { class: "min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800" };
const _hoisted_141 = { class: "bg-slate-50 dark:bg-slate-800/80" };
const _hoisted_142 = { class: "px-2 py-2 text-left" };
const _hoisted_143 = { class: "opacity-70" };
const _hoisted_144 = { class: "px-2 py-2 text-left" };
const _hoisted_145 = { class: "opacity-70" };
const _hoisted_146 = { class: "px-2 py-2 text-left" };
const _hoisted_147 = { class: "opacity-70" };
const _hoisted_148 = { class: "px-2 py-2 text-left" };
const _hoisted_149 = { class: "opacity-70" };
const _hoisted_150 = { class: "px-2 py-2 text-left" };
const _hoisted_151 = { class: "opacity-70" };
const _hoisted_152 = { class: "px-2 py-2 text-left" };
const _hoisted_153 = { class: "opacity-70" };
const _hoisted_154 = { class: "px-2 py-2 text-right" };
const _hoisted_155 = { class: "opacity-70" };
const _hoisted_156 = { class: "px-2 py-2 text-right" };
const _hoisted_157 = { class: "opacity-70" };
const _hoisted_158 = { class: "px-2 py-2 text-center" };
const _hoisted_159 = { class: "opacity-70" };
const _hoisted_160 = { class: "divide-y divide-slate-100 dark:divide-slate-800" };
const _hoisted_161 = { key: 0 };
const _hoisted_162 = { class: "px-2 py-2" };
const _hoisted_163 = { class: "px-2 py-2 whitespace-nowrap" };
const _hoisted_164 = { class: "px-2 py-2" };
const _hoisted_165 = { class: "px-2 py-2" };
const _hoisted_166 = { class: "px-2 py-2" };
const _hoisted_167 = { key: 0 };
const _hoisted_168 = { key: 1 };
const _hoisted_169 = { class: "px-2 py-2" };
const _hoisted_170 = { key: 0 };
const _hoisted_171 = { key: 1 };
const _hoisted_172 = { class: "px-2 py-2 text-right" };
const _hoisted_173 = { class: "px-2 py-2 text-right" };
const _hoisted_174 = { class: "px-2 py-2 text-center" };
const _hoisted_175 = { class: "px-2 py-2 text-center" };
const _hoisted_176 = { class: "px-2 py-2 text-center" };
const _hoisted_177 = { class: "px-2 py-2 text-center" };
const _hoisted_178 = { class: "inline-flex gap-1" };
const _hoisted_179 = ["onClick"];
const _hoisted_180 = ["disabled", "onClick"];
const _hoisted_181 = { class: "flex items-center justify-between text-xs" };
const _hoisted_182 = { class: "text-slate-500 dark:text-slate-400" };
const _hoisted_183 = { class: "inline-flex items-center gap-2" };
const _hoisted_184 = ["disabled"];
const _hoisted_185 = ["disabled"];
const {computed,onBeforeUnmount,onMounted,reactive,ref,watch} = await importShared('vue');
const TRADE_COLLAPSE_STORAGE_KEY = "myasset:trade:collapse-state";
const TRADE_CARD_ORDER_STORAGE_KEY = "myasset:trade:card-order";
const TRADE_SET_ACTION_LOGS_STORAGE_KEY = "myasset:trade:set-action-logs";
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
    const setActionsCollapsed = ref(false);
    const setActionTab = ref("PORTFOLIO");
    const journalCollapsed = ref(false);
    let journalSearchDebounceTimer = null;
    const journalAutoSearchPending = ref(false);
    const suspendJournalAutoSearch = ref(false);
    const setActionSaving = ref(false);
    const DEFAULT_TRADE_CARD_ORDER = ["SET", "TRANSFER", "ENTRY"];
    const tradeCardOrder = ref([...DEFAULT_TRADE_CARD_ORDER]);
    const tradeCardDraggingKey = ref(null);
    const setActionLogs = reactive({
      PORTFOLIO: [],
      HOLDING: [],
      LIABILITY: [],
      CASH: []
    });
    const portfolios = ref([]);
    const assets = ref([]);
    const liabilities = ref([]);
    const holdings = ref([]);
    const tradeTypes = [
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
      "LOAN_INTEREST"
    ];
    const tradeTypeLabelMap = {
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
      LOAN_INTEREST: "LOAN_INTEREST"
    };
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
    const setPortfolioForm = reactive({
      portfolio_id: "",
      effective_at: "",
      rebaseline_all_history: true,
      auto_apply_cash_holding: false,
      cumulative_deposit_amount: "",
      cumulative_withdrawal_amount: "",
      reason: ""
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
      reason: ""
    });
    const setLiabilityForm = reactive({
      portfolio_id: "",
      liability_id: "",
      effective_at: "",
      rebaseline_all_history: true,
      auto_apply_cash_holding: false,
      outstanding_balance: "",
      interest_rate: "",
      reason: ""
    });
    const setCashForm = reactive({
      portfolio_id: "",
      currency: "KRW",
      target_balance: "",
      effective_at: "",
      memo: ""
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
    const isBalanceSet = computed(() => form.txn_type === "BALANCE_SET");
    const isLoanTxn = computed(
      () => form.txn_type === "LOAN_BORROW" || form.txn_type === "LOAN_REPAY" || form.txn_type === "LOAN_INTEREST"
    );
    const canSelectAsset = computed(() => isBuySell.value || form.txn_type === "DIVIDEND");
    const portfolioById = computed(() => new Map(portfolios.value.map((item) => [item.id, item])));
    const assetById = computed(() => new Map(assets.value.map((item) => [item.id, item])));
    const holdingsWithMeta = computed(
      () => holdings.value.filter((item) => item.portfolio_id !== null).map((item) => {
        const portfolio = item.portfolio_id === null ? void 0 : portfolioById.value.get(item.portfolio_id);
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
          is_auto_cash: isAutoCash
        };
      })
    );
    const filteredSetHoldings = computed(() => {
      const selectedPortfolioId = toOptionalNumber(setHoldingForm.portfolio_id);
      const visible = holdingsWithMeta.value.filter((item) => !item.is_auto_cash);
      if (selectedPortfolioId === void 0) return visible;
      return visible.filter((item) => item.portfolio_id === selectedPortfolioId);
    });
    const selectedSetHolding = computed(() => {
      const holdingId = toOptionalNumber(setHoldingForm.holding_id);
      if (holdingId === void 0) return void 0;
      return holdingsWithMeta.value.find((item) => item.id === holdingId);
    });
    const filteredSetLiabilities = computed(() => {
      const selectedPortfolioId = toOptionalNumber(setLiabilityForm.portfolio_id);
      if (selectedPortfolioId === void 0) return liabilities.value;
      return liabilities.value.filter((item) => item.portfolio_id === selectedPortfolioId);
    });
    const supportedCurrencies = computed(() => {
      const values = /* @__PURE__ */ new Set(["KRW", "USD"]);
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
      const out = /* @__PURE__ */ new Map();
      for (const item of holdingsWithMeta.value) {
        if (item.portfolio_id === null || !item.is_auto_cash) continue;
        const currency = (item.avg_price_currency || item.asset_currency || "KRW").toUpperCase();
        const key = `${item.portfolio_id}:${currency}`;
        const amount = item.invested_amount == null ? toFiniteNumber(item.quantity) * toFiniteNumber(item.avg_price) : toFiniteNumber(item.invested_amount);
        out.set(key, (out.get(key) || 0) + amount);
      }
      return out;
    });
    const amountLabel = computed(() => isBalanceSet.value ? "Target Balance" : "Amount");
    const amountHint = computed(
      () => isBalanceSet.value ? "Set Cash Balance: 입력한 값이 해당 포트폴리오/통화의 현금 잔액으로 맞춰집니다." : ""
    );
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
    function toFiniteNumber(value) {
      const numeric = Number(value);
      return Number.isFinite(numeric) ? numeric : 0;
    }
    function toNumericInputString(value) {
      if (!Number.isFinite(value)) return "0";
      if (Number.isInteger(value)) return String(value);
      return String(Number(value.toFixed(8)));
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
        if (typeof parsed.setActionsCollapsed === "boolean") {
          setActionsCollapsed.value = parsed.setActionsCollapsed;
        }
        if (parsed.setActionTab === "PORTFOLIO" || parsed.setActionTab === "HOLDING" || parsed.setActionTab === "LIABILITY" || parsed.setActionTab === "CASH") {
          setActionTab.value = parsed.setActionTab;
        }
        if (typeof parsed.journalCollapsed === "boolean") {
          journalCollapsed.value = parsed.journalCollapsed;
        }
      } catch {
      }
    }
    function restoreSetActionLogs() {
      if (typeof window === "undefined") return;
      try {
        const raw = window.localStorage.getItem(TRADE_SET_ACTION_LOGS_STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        const keys = ["PORTFOLIO", "HOLDING", "LIABILITY", "CASH"];
        for (const key of keys) {
          const value = parsed[key];
          if (!Array.isArray(value)) continue;
          const logs = value.filter((line) => typeof line === "string").slice(0, 2);
          setActionLogs[key].splice(0, setActionLogs[key].length, ...logs);
        }
      } catch {
      }
    }
    function normalizeTradeCardOrder(value) {
      if (!Array.isArray(value)) return [...DEFAULT_TRADE_CARD_ORDER];
      const allowed = new Set(DEFAULT_TRADE_CARD_ORDER);
      const next = [];
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
      }
    }
    function getTradeCardOrder(key) {
      const index = tradeCardOrder.value.indexOf(key);
      return index === -1 ? DEFAULT_TRADE_CARD_ORDER.indexOf(key) : index;
    }
    function onTradeCardDragStart(key, event) {
      tradeCardDraggingKey.value = key;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", key);
      }
    }
    function onTradeCardDragOver(event) {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
    function onTradeCardDrop(targetKey, event) {
      event.preventDefault();
      const sourceKey = tradeCardDraggingKey.value || event.dataTransfer?.getData("text/plain");
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
            journalCollapsed: journal
          })
        );
      } catch {
      }
    });
    watch(
      () => ({
        PORTFOLIO: [...setActionLogs.PORTFOLIO],
        HOLDING: [...setActionLogs.HOLDING],
        LIABILITY: [...setActionLogs.LIABILITY],
        CASH: [...setActionLogs.CASH]
      }),
      (next) => {
        if (typeof window === "undefined") return;
        try {
          window.localStorage.setItem(TRADE_SET_ACTION_LOGS_STORAGE_KEY, JSON.stringify(next));
        } catch {
        }
      },
      { deep: false }
    );
    watch(
      tradeCardOrder,
      (next) => {
        if (typeof window === "undefined") return;
        try {
          window.localStorage.setItem(TRADE_CARD_ORDER_STORAGE_KEY, JSON.stringify(normalizeTradeCardOrder(next)));
        } catch {
        }
      },
      { deep: true }
    );
    function nowDateTimeLocalInput() {
      return toDateTimeLocalSeoul(/* @__PURE__ */ new Date());
    }
    function parseEffectiveAt(value) {
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
    function resetSetPortfolioForm() {
      const first = portfolios.value[0];
      setPortfolioForm.portfolio_id = first ? String(first.id) : "";
      setPortfolioForm.effective_at = nowDateTimeLocalInput();
      setPortfolioForm.rebaseline_all_history = true;
      setPortfolioForm.auto_apply_cash_holding = false;
      setPortfolioForm.cumulative_deposit_amount = first ? String(first.cumulative_deposit_amount) : "0";
      setPortfolioForm.cumulative_withdrawal_amount = first ? String(first.cumulative_withdrawal_amount) : "0";
      setPortfolioForm.reason = "";
    }
    function resetSetHoldingForm() {
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
    function resetSetLiabilityForm() {
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
    function resetSetCashForm() {
      const firstPortfolio = portfolios.value[0];
      setCashForm.portfolio_id = firstPortfolio ? String(firstPortfolio.id) : "";
      setCashForm.currency = (firstPortfolio?.base_currency || "KRW").toUpperCase();
      setCashForm.target_balance = "0";
      setCashForm.effective_at = nowDateTimeLocalInput();
      setCashForm.memo = "";
    }
    function resetSetForms() {
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
    async function loadReferenceData() {
      const [portfolioData, assetData, liabilityData, holdingData] = await Promise.all([
        getPortfolios(),
        getAssets(),
        getLiabilities({ include_hidden: true, include_excluded: true }),
        getHoldings({ include_hidden: true, include_excluded_portfolios: true })
      ]);
      portfolios.value = portfolioData;
      assets.value = assetData;
      liabilities.value = liabilityData;
      holdings.value = holdingData;
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
    function formatBaselineInfo(ids) {
      return ids.length ? ids.join(",") : "-";
    }
    function parseNonNegativeNumber(raw, fieldName) {
      const parsed = toOptionalNumber(raw);
      if (parsed === void 0) throw new Error(`${fieldName} is required.`);
      if (parsed < 0) throw new Error(`${fieldName} must be >= 0.`);
      return parsed;
    }
    function appendSetActionLog(action, status, message) {
      const stamp = formatDateTimeSeoul((/* @__PURE__ */ new Date()).toISOString());
      setActionLogs[action].unshift(`${stamp} [${status}] ${message}`);
      if (setActionLogs[action].length > 2) setActionLogs[action].length = 2;
    }
    function clearSetActionLogs(action) {
      setActionLogs[action].splice(0, setActionLogs[action].length);
    }
    function getSetCashCurrentBalance(portfolioId, currency) {
      const key = `${portfolioId}:${currency.trim().toUpperCase()}`;
      const current = autoCashBalanceByPortfolioCurrency.value.get(key);
      return current === void 0 ? 0 : current;
    }
    function syncSetCashTargetFromCurrent() {
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
    async function submitPortfolioSet() {
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
        const confirmMessage = allHistory ? "Apply Portfolio Net Contribution Set? (전체 과거 DEPOSIT/WITHDRAW 거래를 VOID 후 기준점 재생성)" : "Apply Portfolio Net Contribution Set? (기준시각 이전 DEPOSIT/WITHDRAW 거래를 VOID 후 기준점 재생성)";
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
          reason: setPortfolioForm.reason.trim() || null
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
    async function submitHoldingSet() {
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
        if (costBasisRaw !== void 0 && costBasisRaw < 0) throw new Error("Cost basis must be >= 0.");
        const costBasisCurrency = setHoldingForm.cost_basis_currency.trim().toUpperCase();
        if (costBasisRaw !== void 0 && costBasisCurrency.length !== 3) {
          throw new Error("Cost basis currency must be 3 letters.");
        }
        const effectiveAt = parseEffectiveAt(setHoldingForm.effective_at);
        const allHistory = !!setHoldingForm.rebaseline_all_history;
        const confirmMessage = allHistory ? "Apply Holding Position Set? (전체 과거 BUY/SELL 거래를 VOID 후 기준점 재생성)" : "Apply Holding Position Set? (기준시각 이전 BUY/SELL 거래를 VOID 후 기준점 재생성)";
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
          invested_amount_currency: costBasisRaw === void 0 ? null : costBasisCurrency,
          reason: setHoldingForm.reason.trim() || null
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
    async function submitLiabilitySet() {
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
        if (interestRateRaw !== void 0 && interestRateRaw < 0) throw new Error("Interest rate must be >= 0.");
        const effectiveAt = parseEffectiveAt(setLiabilityForm.effective_at);
        const allHistory = !!setLiabilityForm.rebaseline_all_history;
        const confirmMessage = allHistory ? "Apply Liability Balance Set? (전체 과거 LOAN_BORROW/LOAN_REPAY 거래를 VOID 후 기준점 재생성)" : "Apply Liability Balance Set? (기준시각 이전 LOAN_BORROW/LOAN_REPAY 거래를 VOID 후 기준점 재생성)";
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
          reason: setLiabilityForm.reason.trim() || null
        });
        if (interestRateRaw !== void 0) {
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
    async function submitCashSet() {
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
          auto_apply_portfolio_cashflow: false
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
      }
    );
    watch(
      () => setPortfolioForm.portfolio_id,
      (next) => {
        const portfolioId = toOptionalNumber(next);
        if (portfolioId === void 0) return;
        const row = portfolioById.value.get(portfolioId);
        if (!row) return;
        setPortfolioForm.cumulative_deposit_amount = String(row.cumulative_deposit_amount);
        setPortfolioForm.cumulative_withdrawal_amount = String(row.cumulative_withdrawal_amount);
      }
    );
    watch(
      () => setHoldingForm.portfolio_id,
      () => {
        const selectedHoldingId = toOptionalNumber(setHoldingForm.holding_id);
        if (selectedHoldingId === void 0) return;
        const stillValid = filteredSetHoldings.value.some((item) => item.id === selectedHoldingId);
        if (!stillValid) {
          setHoldingForm.holding_id = "";
        }
      }
    );
    watch(
      () => setHoldingForm.holding_id,
      (next) => {
        const holdingId = toOptionalNumber(next);
        if (holdingId === void 0) return;
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
      }
    );
    watch(
      () => setLiabilityForm.portfolio_id,
      () => {
        const selectedLiabilityId = toOptionalNumber(setLiabilityForm.liability_id);
        if (selectedLiabilityId === void 0) return;
        const stillValid = filteredSetLiabilities.value.some((item) => item.id === selectedLiabilityId);
        if (!stillValid) {
          setLiabilityForm.liability_id = "";
        }
      }
    );
    watch(
      () => setLiabilityForm.liability_id,
      (next) => {
        const liabilityId = toOptionalNumber(next);
        if (liabilityId === void 0) return;
        const row = liabilities.value.find((item) => item.id === liabilityId);
        if (!row) return;
        if (row.portfolio_id !== null) {
          setLiabilityForm.portfolio_id = String(row.portfolio_id);
        }
        setLiabilityForm.outstanding_balance = String(row.outstanding_balance);
        setLiabilityForm.interest_rate = row.interest_rate == null ? "" : String(row.interest_rate);
      }
    );
    watch(
      () => setCashForm.portfolio_id,
      (next) => {
        const portfolioId = toOptionalNumber(next);
        if (portfolioId === void 0) {
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
      }
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
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _cache[187] || (_cache[187] = _createElementVNode("header", { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" }, [
          _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300" }, "Trade"),
          _createElementVNode("h1", { class: "mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Manual Trade Ledger")
        ], -1)),
        _createElementVNode("div", _hoisted_2, [
          _createElementVNode("article", {
            class: _normalizeClass(["rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900", tradeCardDraggingKey.value === "SET" ? "opacity-75 ring-2 ring-violet-400/40" : ""]),
            style: _normalizeStyle({ order: getTradeCardOrder("SET") }),
            onDragover: onTradeCardDragOver,
            onDrop: _cache[41] || (_cache[41] = ($event) => onTradeCardDrop("SET", $event))
          }, [
            _createElementVNode("div", {
              class: "flex cursor-move items-start justify-between gap-3",
              draggable: "true",
              onDragstart: _cache[1] || (_cache[1] = ($event) => onTradeCardDragStart("SET", $event)),
              onDragend: onTradeCardDragEnd
            }, [
              _cache[94] || (_cache[94] = _createElementVNode("div", null, [
                _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.08em] text-violet-700 dark:text-violet-300" }, "Set Actions"),
                _createElementVNode("h2", { class: "mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Rebaseline-Based Set Actions"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Agent 편집을 Trade에서 빠르게 실행합니다. 실행 시 기준 거래를 재생성합니다.")
              ], -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                "aria-expanded": !setActionsCollapsed.value,
                onClick: _cache[0] || (_cache[0] = ($event) => setActionsCollapsed.value = !setActionsCollapsed.value)
              }, _toDisplayString(setActionsCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_3)
            ], 32),
            !setActionsCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_4, [
              _createElementVNode("div", _hoisted_5, [
                _createElementVNode("button", {
                  type: "button",
                  class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", setActionTab.value === "PORTFOLIO" ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                  onClick: _cache[2] || (_cache[2] = ($event) => setActionTab.value = "PORTFOLIO")
                }, " Portfolio Net Contribution Set ", 2),
                _createElementVNode("button", {
                  type: "button",
                  class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", setActionTab.value === "HOLDING" ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                  onClick: _cache[3] || (_cache[3] = ($event) => setActionTab.value = "HOLDING")
                }, " Holding Position Set ", 2),
                _createElementVNode("button", {
                  type: "button",
                  class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", setActionTab.value === "LIABILITY" ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                  onClick: _cache[4] || (_cache[4] = ($event) => setActionTab.value = "LIABILITY")
                }, " Liability Balance Set ", 2),
                _createElementVNode("button", {
                  type: "button",
                  class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", setActionTab.value === "CASH" ? "border-violet-500 bg-violet-50 text-violet-700 dark:border-violet-600 dark:bg-violet-900/30 dark:text-violet-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                  onClick: _cache[5] || (_cache[5] = ($event) => setActionTab.value = "CASH")
                }, " Auto Cash Balance Set ", 2)
              ]),
              setActionTab.value === "PORTFOLIO" ? (_openBlock(), _createElementBlock("div", _hoisted_6, [
                _createElementVNode("div", _hoisted_7, [
                  _createElementVNode("label", _hoisted_8, [
                    _cache[96] || (_cache[96] = _createTextVNode("Portfolio ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => setPortfolioForm.portfolio_id = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      _cache[95] || (_cache[95] = _createElementVNode("option", { value: "" }, "Select", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `set-pf-${p.id}`,
                          value: String(p.id)
                        }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_9);
                      }), 128))
                    ], 512), [
                      [_vModelSelect, setPortfolioForm.portfolio_id]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_10, [
                    _cache[97] || (_cache[97] = _createTextVNode("Effective At (KST) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => setPortfolioForm.effective_at = $event),
                      type: "datetime-local",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setPortfolioForm.effective_at]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_11, [
                    _cache[98] || (_cache[98] = _createTextVNode("Cumulative Deposit ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => setPortfolioForm.cumulative_deposit_amount = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setPortfolioForm.cumulative_deposit_amount]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_12, [
                    _cache[99] || (_cache[99] = _createTextVNode("Cumulative Withdrawal ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => setPortfolioForm.cumulative_withdrawal_amount = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setPortfolioForm.cumulative_withdrawal_amount]
                    ])
                  ])
                ]),
                _createElementVNode("label", _hoisted_13, [
                  _cache[100] || (_cache[100] = _createTextVNode("Reason (optional) ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => setPortfolioForm.reason = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, setPortfolioForm.reason]
                  ])
                ]),
                _createElementVNode("label", _hoisted_14, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => setPortfolioForm.rebaseline_all_history = $event),
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 512), [
                    [_vModelCheckbox, setPortfolioForm.rebaseline_all_history]
                  ]),
                  _cache[101] || (_cache[101] = _createElementVNode("span", null, "Rebaseline all history (기준시각 무시)", -1))
                ]),
                _createElementVNode("label", _hoisted_15, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => setPortfolioForm.auto_apply_cash_holding = $event),
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 512), [
                    [_vModelCheckbox, setPortfolioForm.auto_apply_cash_holding]
                  ]),
                  _cache[102] || (_cache[102] = _createElementVNode("span", null, "Auto apply to cash holding (optional)", -1))
                ]),
                _createElementVNode("div", null, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60",
                    disabled: setActionSaving.value,
                    onClick: submitPortfolioSet
                  }, _toDisplayString(setActionSaving.value ? "Applying..." : "Apply Portfolio Net Contribution Set"), 9, _hoisted_16)
                ]),
                _createElementVNode("div", _hoisted_17, [
                  _createElementVNode("div", _hoisted_18, [
                    _cache[103] || (_cache[103] = _createElementVNode("p", { class: "font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" }, "Recent Logs", -1)),
                    _createElementVNode("button", {
                      type: "button",
                      class: "rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                      onClick: _cache[13] || (_cache[13] = ($event) => clearSetActionLogs("PORTFOLIO"))
                    }, " Clear ")
                  ]),
                  setActionLogs.PORTFOLIO.length ? (_openBlock(), _createElementBlock("ul", _hoisted_19, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(setActionLogs.PORTFOLIO, (line) => {
                      return _openBlock(), _createElementBlock("li", {
                        key: `set-log-portfolio-${line}`
                      }, _toDisplayString(line), 1);
                    }), 128))
                  ])) : (_openBlock(), _createElementBlock("p", _hoisted_20, "No executions yet."))
                ])
              ])) : setActionTab.value === "HOLDING" ? (_openBlock(), _createElementBlock("div", _hoisted_21, [
                _createElementVNode("div", _hoisted_22, [
                  _createElementVNode("label", _hoisted_23, [
                    _cache[105] || (_cache[105] = _createTextVNode("Portfolio (filter) ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => setHoldingForm.portfolio_id = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      _cache[104] || (_cache[104] = _createElementVNode("option", { value: "" }, "All", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `set-h-pf-${p.id}`,
                          value: String(p.id)
                        }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_24);
                      }), 128))
                    ], 512), [
                      [_vModelSelect, setHoldingForm.portfolio_id]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_25, [
                    _cache[107] || (_cache[107] = _createTextVNode("Holding ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => setHoldingForm.holding_id = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      _cache[106] || (_cache[106] = _createElementVNode("option", { value: "" }, "Select", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(filteredSetHoldings.value, (h) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `set-h-${h.id}`,
                          value: String(h.id)
                        }, " #" + _toDisplayString(h.id) + " " + _toDisplayString(h.portfolio_name) + " / " + _toDisplayString(h.asset_name) + _toDisplayString(h.asset_symbol ? ` (${h.asset_symbol})` : ""), 9, _hoisted_26);
                      }), 128))
                    ], 512), [
                      [_vModelSelect, setHoldingForm.holding_id]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_27, [
                    _cache[108] || (_cache[108] = _createTextVNode("Effective At (KST) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[16] || (_cache[16] = ($event) => setHoldingForm.effective_at = $event),
                      type: "datetime-local",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setHoldingForm.effective_at]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_28, [
                    _cache[109] || (_cache[109] = _createTextVNode("Quantity ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[17] || (_cache[17] = ($event) => setHoldingForm.quantity = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setHoldingForm.quantity]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_29, [
                    _cache[110] || (_cache[110] = _createTextVNode("Avg Cost ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[18] || (_cache[18] = ($event) => setHoldingForm.avg_cost = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setHoldingForm.avg_cost]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_30, [
                    _cache[111] || (_cache[111] = _createTextVNode("Avg Cost Currency ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[19] || (_cache[19] = ($event) => setHoldingForm.avg_cost_currency = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(supportedCurrencies.value, (currency) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `set-h-avg-${currency}`,
                          value: currency
                        }, _toDisplayString(currency), 9, _hoisted_31);
                      }), 128))
                    ], 512), [
                      [_vModelSelect, setHoldingForm.avg_cost_currency]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_32, [
                    _cache[112] || (_cache[112] = _createTextVNode("Cost Basis (optional) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[20] || (_cache[20] = ($event) => setHoldingForm.cost_basis_total = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setHoldingForm.cost_basis_total]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_33, [
                    _cache[113] || (_cache[113] = _createTextVNode("Cost Basis Currency ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[21] || (_cache[21] = ($event) => setHoldingForm.cost_basis_currency = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(supportedCurrencies.value, (currency) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `set-h-cost-${currency}`,
                          value: currency
                        }, _toDisplayString(currency), 9, _hoisted_34);
                      }), 128))
                    ], 512), [
                      [_vModelSelect, setHoldingForm.cost_basis_currency]
                    ])
                  ])
                ]),
                selectedSetHolding.value?.is_auto_cash ? (_openBlock(), _createElementBlock("p", _hoisted_35, " Auto Cash Balance는 ledger-derived입니다. Trade의 BALANCE_SET/DEPOSIT/WITHDRAW/ADJUSTMENT를 사용하세요. ")) : _createCommentVNode("", true),
                _createElementVNode("label", _hoisted_36, [
                  _cache[114] || (_cache[114] = _createTextVNode("Reason (optional) ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[22] || (_cache[22] = ($event) => setHoldingForm.reason = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, setHoldingForm.reason]
                  ])
                ]),
                _createElementVNode("label", _hoisted_37, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[23] || (_cache[23] = ($event) => setHoldingForm.rebaseline_all_history = $event),
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 512), [
                    [_vModelCheckbox, setHoldingForm.rebaseline_all_history]
                  ]),
                  _cache[115] || (_cache[115] = _createElementVNode("span", null, "Rebaseline all history (기준시각 무시)", -1))
                ]),
                _createElementVNode("label", _hoisted_38, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[24] || (_cache[24] = ($event) => setHoldingForm.auto_apply_cash_holding = $event),
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 512), [
                    [_vModelCheckbox, setHoldingForm.auto_apply_cash_holding]
                  ]),
                  _cache[116] || (_cache[116] = _createElementVNode("span", null, "Auto apply to cash holding (optional)", -1))
                ]),
                _createElementVNode("div", null, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60",
                    disabled: setActionSaving.value || !!selectedSetHolding.value?.is_auto_cash,
                    onClick: submitHoldingSet
                  }, _toDisplayString(setActionSaving.value ? "Applying..." : "Apply Holding Position Set"), 9, _hoisted_39)
                ]),
                _createElementVNode("div", _hoisted_40, [
                  _createElementVNode("div", _hoisted_41, [
                    _cache[117] || (_cache[117] = _createElementVNode("p", { class: "font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" }, "Recent Logs", -1)),
                    _createElementVNode("button", {
                      type: "button",
                      class: "rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                      onClick: _cache[25] || (_cache[25] = ($event) => clearSetActionLogs("HOLDING"))
                    }, " Clear ")
                  ]),
                  setActionLogs.HOLDING.length ? (_openBlock(), _createElementBlock("ul", _hoisted_42, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(setActionLogs.HOLDING, (line) => {
                      return _openBlock(), _createElementBlock("li", {
                        key: `set-log-holding-${line}`
                      }, _toDisplayString(line), 1);
                    }), 128))
                  ])) : (_openBlock(), _createElementBlock("p", _hoisted_43, "No executions yet."))
                ])
              ])) : setActionTab.value === "LIABILITY" ? (_openBlock(), _createElementBlock("div", _hoisted_44, [
                _createElementVNode("div", _hoisted_45, [
                  _createElementVNode("label", _hoisted_46, [
                    _cache[119] || (_cache[119] = _createTextVNode("Portfolio (filter) ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[26] || (_cache[26] = ($event) => setLiabilityForm.portfolio_id = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      _cache[118] || (_cache[118] = _createElementVNode("option", { value: "" }, "All", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `set-l-pf-${p.id}`,
                          value: String(p.id)
                        }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_47);
                      }), 128))
                    ], 512), [
                      [_vModelSelect, setLiabilityForm.portfolio_id]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_48, [
                    _cache[121] || (_cache[121] = _createTextVNode("Liability ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[27] || (_cache[27] = ($event) => setLiabilityForm.liability_id = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      _cache[120] || (_cache[120] = _createElementVNode("option", { value: "" }, "Select", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(filteredSetLiabilities.value, (l) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `set-l-${l.id}`,
                          value: String(l.id)
                        }, " #" + _toDisplayString(l.id) + " " + _toDisplayString(l.name) + " (" + _toDisplayString(l.currency) + ") ", 9, _hoisted_49);
                      }), 128))
                    ], 512), [
                      [_vModelSelect, setLiabilityForm.liability_id]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_50, [
                    _cache[122] || (_cache[122] = _createTextVNode("Effective At (KST) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[28] || (_cache[28] = ($event) => setLiabilityForm.effective_at = $event),
                      type: "datetime-local",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setLiabilityForm.effective_at]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_51, [
                    _cache[123] || (_cache[123] = _createTextVNode("Outstanding Balance ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[29] || (_cache[29] = ($event) => setLiabilityForm.outstanding_balance = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setLiabilityForm.outstanding_balance]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_52, [
                    _cache[124] || (_cache[124] = _createTextVNode("Interest Rate (optional) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[30] || (_cache[30] = ($event) => setLiabilityForm.interest_rate = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setLiabilityForm.interest_rate]
                    ])
                  ])
                ]),
                _createElementVNode("label", _hoisted_53, [
                  _cache[125] || (_cache[125] = _createTextVNode("Reason (optional) ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[31] || (_cache[31] = ($event) => setLiabilityForm.reason = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, setLiabilityForm.reason]
                  ])
                ]),
                _createElementVNode("label", _hoisted_54, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[32] || (_cache[32] = ($event) => setLiabilityForm.rebaseline_all_history = $event),
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 512), [
                    [_vModelCheckbox, setLiabilityForm.rebaseline_all_history]
                  ]),
                  _cache[126] || (_cache[126] = _createElementVNode("span", null, "Rebaseline all history (기준시각 무시)", -1))
                ]),
                _createElementVNode("label", _hoisted_55, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[33] || (_cache[33] = ($event) => setLiabilityForm.auto_apply_cash_holding = $event),
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 512), [
                    [_vModelCheckbox, setLiabilityForm.auto_apply_cash_holding]
                  ]),
                  _cache[127] || (_cache[127] = _createElementVNode("span", null, "Auto apply to cash holding (optional)", -1))
                ]),
                _createElementVNode("div", null, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60",
                    disabled: setActionSaving.value,
                    onClick: submitLiabilitySet
                  }, _toDisplayString(setActionSaving.value ? "Applying..." : "Apply Liability Balance Set"), 9, _hoisted_56)
                ]),
                _createElementVNode("div", _hoisted_57, [
                  _createElementVNode("div", _hoisted_58, [
                    _cache[128] || (_cache[128] = _createElementVNode("p", { class: "font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" }, "Recent Logs", -1)),
                    _createElementVNode("button", {
                      type: "button",
                      class: "rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                      onClick: _cache[34] || (_cache[34] = ($event) => clearSetActionLogs("LIABILITY"))
                    }, " Clear ")
                  ]),
                  setActionLogs.LIABILITY.length ? (_openBlock(), _createElementBlock("ul", _hoisted_59, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(setActionLogs.LIABILITY, (line) => {
                      return _openBlock(), _createElementBlock("li", {
                        key: `set-log-liability-${line}`
                      }, _toDisplayString(line), 1);
                    }), 128))
                  ])) : (_openBlock(), _createElementBlock("p", _hoisted_60, "No executions yet."))
                ])
              ])) : (_openBlock(), _createElementBlock("div", _hoisted_61, [
                _createElementVNode("div", _hoisted_62, [
                  _createElementVNode("label", _hoisted_63, [
                    _cache[130] || (_cache[130] = _createTextVNode("Portfolio ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[35] || (_cache[35] = ($event) => setCashForm.portfolio_id = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      _cache[129] || (_cache[129] = _createElementVNode("option", { value: "" }, "Select", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `set-c-pf-${p.id}`,
                          value: String(p.id)
                        }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_64);
                      }), 128))
                    ], 512), [
                      [_vModelSelect, setCashForm.portfolio_id]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_65, [
                    _cache[131] || (_cache[131] = _createTextVNode("Currency ", -1)),
                    _withDirectives(_createElementVNode("select", {
                      "onUpdate:modelValue": _cache[36] || (_cache[36] = ($event) => setCashForm.currency = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                    }, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(supportedCurrencies.value, (currency) => {
                        return _openBlock(), _createElementBlock("option", {
                          key: `set-c-currency-${currency}`,
                          value: currency
                        }, _toDisplayString(currency), 9, _hoisted_66);
                      }), 128))
                    ], 512), [
                      [_vModelSelect, setCashForm.currency]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_67, [
                    _cache[132] || (_cache[132] = _createTextVNode("Target Balance ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[37] || (_cache[37] = ($event) => setCashForm.target_balance = $event),
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setCashForm.target_balance]
                    ])
                  ]),
                  _createElementVNode("label", _hoisted_68, [
                    _cache[133] || (_cache[133] = _createTextVNode("Effective At (KST) ", -1)),
                    _withDirectives(_createElementVNode("input", {
                      "onUpdate:modelValue": _cache[38] || (_cache[38] = ($event) => setCashForm.effective_at = $event),
                      type: "datetime-local",
                      class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                    }, null, 512), [
                      [_vModelText, setCashForm.effective_at]
                    ])
                  ])
                ]),
                _createElementVNode("label", _hoisted_69, [
                  _cache[134] || (_cache[134] = _createTextVNode("Memo (optional) ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[39] || (_cache[39] = ($event) => setCashForm.memo = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, setCashForm.memo]
                  ])
                ]),
                _cache[136] || (_cache[136] = _createElementVNode("p", { class: "rounded-lg border border-cyan-300 bg-cyan-50 px-3 py-2 text-xs text-cyan-800 dark:border-cyan-700 dark:bg-cyan-900/20 dark:text-cyan-300" }, " Manual Trade Entry의 BALANCE_SET과 동일 로직입니다. Portfolio/Currency 선택 시 현재 Auto Cash Balance가 Target Balance에 기본 채움됩니다. ", -1)),
                _createElementVNode("div", null, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded-lg bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-500 disabled:opacity-60",
                    disabled: setActionSaving.value,
                    onClick: submitCashSet
                  }, _toDisplayString(setActionSaving.value ? "Applying..." : "Apply Auto Cash Balance Set"), 9, _hoisted_70)
                ]),
                _createElementVNode("div", _hoisted_71, [
                  _createElementVNode("div", _hoisted_72, [
                    _cache[135] || (_cache[135] = _createElementVNode("p", { class: "font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300" }, "Recent Logs", -1)),
                    _createElementVNode("button", {
                      type: "button",
                      class: "rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                      onClick: _cache[40] || (_cache[40] = ($event) => clearSetActionLogs("CASH"))
                    }, " Clear ")
                  ]),
                  setActionLogs.CASH.length ? (_openBlock(), _createElementBlock("ul", _hoisted_73, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(setActionLogs.CASH, (line) => {
                      return _openBlock(), _createElementBlock("li", {
                        key: `set-log-cash-${line}`
                      }, _toDisplayString(line), 1);
                    }), 128))
                  ])) : (_openBlock(), _createElementBlock("p", _hoisted_74, "No executions yet."))
                ])
              ]))
            ])) : _createCommentVNode("", true)
          ], 38),
          _createElementVNode("article", {
            class: _normalizeClass(["rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900", tradeCardDraggingKey.value === "TRANSFER" ? "opacity-75 ring-2 ring-violet-400/40" : ""]),
            style: _normalizeStyle({ order: getTradeCardOrder("TRANSFER") }),
            onDragover: onTradeCardDragOver,
            onDrop: _cache[52] || (_cache[52] = ($event) => onTradeCardDrop("TRANSFER", $event))
          }, [
            _createElementVNode("div", {
              class: "flex cursor-move items-start justify-between gap-3",
              draggable: "true",
              onDragstart: _cache[43] || (_cache[43] = ($event) => onTradeCardDragStart("TRANSFER", $event)),
              onDragend: onTradeCardDragEnd
            }, [
              _cache[137] || (_cache[137] = _createElementVNode("div", null, [
                _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.08em] text-cyan-700 dark:text-cyan-300" }, "Transfer"),
                _createElementVNode("h2", { class: "mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Portfolio To Portfolio Transfer"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "한 번 입력하면 WITHDRAW + DEPOSIT 두 거래를 자동 생성합니다.")
              ], -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                "aria-expanded": !transferCollapsed.value,
                onClick: _cache[42] || (_cache[42] = ($event) => transferCollapsed.value = !transferCollapsed.value)
              }, _toDisplayString(transferCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_75)
            ], 32),
            !transferCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_76, [
              _createElementVNode("div", _hoisted_77, [
                _createElementVNode("label", _hoisted_78, [
                  _cache[139] || (_cache[139] = _createTextVNode("From Portfolio ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[44] || (_cache[44] = ($event) => transferForm.from_portfolio_id = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, [
                    _cache[138] || (_cache[138] = _createElementVNode("option", { value: "" }, "Select", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: `from-${p.id}`,
                        value: String(p.id)
                      }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_79);
                    }), 128))
                  ], 512), [
                    [_vModelSelect, transferForm.from_portfolio_id]
                  ])
                ]),
                _createElementVNode("label", _hoisted_80, [
                  _cache[141] || (_cache[141] = _createTextVNode("To Portfolio ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[45] || (_cache[45] = ($event) => transferForm.to_portfolio_id = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, [
                    _cache[140] || (_cache[140] = _createElementVNode("option", { value: "" }, "Select", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: `to-${p.id}`,
                        value: String(p.id)
                      }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_81);
                    }), 128))
                  ], 512), [
                    [_vModelSelect, transferForm.to_portfolio_id]
                  ])
                ]),
                _createElementVNode("label", _hoisted_82, [
                  _cache[142] || (_cache[142] = _createTextVNode("Amount ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[46] || (_cache[46] = ($event) => transferForm.amount = $event),
                    placeholder: "1000000",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, transferForm.amount]
                  ])
                ]),
                _createElementVNode("label", _hoisted_83, [
                  _cache[143] || (_cache[143] = _createTextVNode("Currency ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[47] || (_cache[47] = ($event) => transferForm.currency = $event),
                    maxlength: "3",
                    placeholder: "KRW",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, transferForm.currency]
                  ])
                ]),
                _createElementVNode("label", _hoisted_84, [
                  _cache[144] || (_cache[144] = _createTextVNode("Executed At (optional) ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[48] || (_cache[48] = ($event) => transferForm.executed_at = $event),
                    type: "datetime-local",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, transferForm.executed_at]
                  ])
                ]),
                _createElementVNode("label", _hoisted_85, [
                  _cache[145] || (_cache[145] = _createTextVNode("Memo (optional) ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[49] || (_cache[49] = ($event) => transferForm.memo = $event),
                    placeholder: "예: Toss -> Upbit transfer",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, transferForm.memo]
                  ])
                ])
              ]),
              _createElementVNode("div", _hoisted_86, [
                _createElementVNode("label", _hoisted_87, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[50] || (_cache[50] = ($event) => transferForm.auto_apply_cash_holding = $event),
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 512), [
                    [_vModelCheckbox, transferForm.auto_apply_cash_holding]
                  ]),
                  _cache[146] || (_cache[146] = _createElementVNode("span", null, "Auto apply to cash holding", -1))
                ]),
                _createElementVNode("label", _hoisted_88, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[51] || (_cache[51] = ($event) => transferForm.auto_apply_portfolio_cashflow = $event),
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 512), [
                    [_vModelCheckbox, transferForm.auto_apply_portfolio_cashflow]
                  ]),
                  _cache[147] || (_cache[147] = _createElementVNode("span", null, "Auto apply to net contribution", -1))
                ])
              ]),
              _createElementVNode("div", _hoisted_89, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-cyan-600 px-4 py-2 text-sm font-semibold text-white hover:bg-cyan-500 disabled:opacity-60",
                  disabled: transferSaving.value,
                  onClick: submitTransfer
                }, _toDisplayString(transferSaving.value ? "Transferring..." : "Create Transfer"), 9, _hoisted_90),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  disabled: transferSaving.value,
                  onClick: resetTransferForm
                }, " Reset Transfer ", 8, _hoisted_91)
              ])
            ])) : _createCommentVNode("", true)
          ], 38),
          _createElementVNode("article", {
            class: _normalizeClass(["rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900", tradeCardDraggingKey.value === "ENTRY" ? "opacity-75 ring-2 ring-violet-400/40" : ""]),
            style: _normalizeStyle({ order: getTradeCardOrder("ENTRY") }),
            onDragover: onTradeCardDragOver,
            onDrop: _cache[68] || (_cache[68] = ($event) => onTradeCardDrop("ENTRY", $event))
          }, [
            _createElementVNode("div", {
              class: "flex cursor-move items-start justify-between gap-3",
              draggable: "true",
              onDragstart: _cache[54] || (_cache[54] = ($event) => onTradeCardDragStart("ENTRY", $event)),
              onDragend: onTradeCardDragEnd
            }, [
              _cache[148] || (_cache[148] = _createElementVNode("div", null, [
                _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.08em] text-emerald-700 dark:text-emerald-300" }, "Entry"),
                _createElementVNode("h2", { class: "mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Manual Trade Entry"),
                _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "수동 거래를 입력하고 holdings, portfolio, liability 집계에 반영합니다.")
              ], -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                "aria-expanded": !entryCollapsed.value,
                onClick: _cache[53] || (_cache[53] = ($event) => entryCollapsed.value = !entryCollapsed.value)
              }, _toDisplayString(entryCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_92)
            ], 32),
            !entryCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_93, [
              _createElementVNode("div", _hoisted_94, [
                _createElementVNode("label", _hoisted_95, [
                  _cache[150] || (_cache[150] = _createTextVNode("Portfolio ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[55] || (_cache[55] = ($event) => form.portfolio_id = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, [
                    _cache[149] || (_cache[149] = _createElementVNode("option", { value: "" }, "Select", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (p) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: p.id,
                        value: String(p.id)
                      }, "#" + _toDisplayString(p.id) + " " + _toDisplayString(p.name), 9, _hoisted_96);
                    }), 128))
                  ], 512), [
                    [_vModelSelect, form.portfolio_id]
                  ])
                ]),
                _createElementVNode("label", _hoisted_97, [
                  _cache[151] || (_cache[151] = _createTextVNode("Type ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[56] || (_cache[56] = ($event) => form.txn_type = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, [
                    (_openBlock(), _createElementBlock(_Fragment, null, _renderList(tradeTypes, (type) => {
                      return _createElementVNode("option", {
                        key: type,
                        value: type
                      }, _toDisplayString(tradeTypeLabelMap[type]), 9, _hoisted_98);
                    }), 64))
                  ], 512), [
                    [_vModelSelect, form.txn_type]
                  ])
                ]),
                _createElementVNode("label", _hoisted_99, [
                  _cache[153] || (_cache[153] = _createTextVNode("Asset ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[57] || (_cache[57] = ($event) => form.asset_id = $event),
                    disabled: !canSelectAsset.value,
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                  }, [
                    _cache[152] || (_cache[152] = _createElementVNode("option", { value: "" }, "Select", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(assets.value, (a) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: a.id,
                        value: String(a.id)
                      }, "#" + _toDisplayString(a.id) + " " + _toDisplayString(a.name), 9, _hoisted_101);
                    }), 128))
                  ], 8, _hoisted_100), [
                    [_vModelSelect, form.asset_id]
                  ])
                ]),
                _createElementVNode("label", _hoisted_102, [
                  _cache[155] || (_cache[155] = _createTextVNode("Liability ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[58] || (_cache[58] = ($event) => form.liability_id = $event),
                    disabled: !isLoanTxn.value,
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                  }, [
                    _cache[154] || (_cache[154] = _createElementVNode("option", { value: "" }, "Select", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(selectableLoanLiabilities.value, (l) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: l.id,
                        value: String(l.id)
                      }, "#" + _toDisplayString(l.id) + " " + _toDisplayString(l.name), 9, _hoisted_104);
                    }), 128))
                  ], 8, _hoisted_103), [
                    [_vModelSelect, form.liability_id]
                  ]),
                  _cache[156] || (_cache[156] = _createElementVNode("p", { class: "mt-1 text-[11px] normal-case text-slate-500 dark:text-slate-400" }, "Shows liabilities linked to selected portfolio.", -1))
                ]),
                _createElementVNode("label", _hoisted_105, [
                  _cache[157] || (_cache[157] = _createTextVNode("Currency ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[59] || (_cache[59] = ($event) => form.currency = $event),
                    maxlength: "3",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
                  }, null, 512), [
                    [_vModelText, form.currency]
                  ])
                ]),
                _createElementVNode("label", _hoisted_106, [
                  _cache[158] || (_cache[158] = _createTextVNode("Quantity ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[60] || (_cache[60] = ($event) => form.quantity = $event),
                    disabled: !isBuySell.value,
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                  }, null, 8, _hoisted_107), [
                    [_vModelText, form.quantity]
                  ])
                ]),
                _createElementVNode("label", _hoisted_108, [
                  _cache[159] || (_cache[159] = _createTextVNode("Unit Price ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[61] || (_cache[61] = ($event) => form.unit_price = $event),
                    disabled: !isBuySell.value,
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                  }, null, 8, _hoisted_109), [
                    [_vModelText, form.unit_price]
                  ])
                ]),
                _createElementVNode("label", _hoisted_110, [
                  _createTextVNode(_toDisplayString(amountLabel.value) + " ", 1),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[62] || (_cache[62] = ($event) => form.amount = $event),
                    placeholder: isBalanceSet.value ? "e.g. 20000" : "",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, null, 8, _hoisted_111), [
                    [_vModelText, form.amount]
                  ]),
                  amountHint.value ? (_openBlock(), _createElementBlock("p", _hoisted_112, _toDisplayString(amountHint.value), 1)) : _createCommentVNode("", true)
                ]),
                _createElementVNode("label", _hoisted_113, [
                  _cache[160] || (_cache[160] = _createTextVNode("Fee (optional) ", -1)),
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[63] || (_cache[63] = ($event) => form.fee_amount = $event),
                    disabled: !isBuySell.value || !!editingId.value,
                    placeholder: "0",
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950"
                  }, null, 8, _hoisted_114), [
                    [_vModelText, form.fee_amount]
                  ]),
                  _cache[161] || (_cache[161] = _createElementVNode("p", { class: "mt-1 text-[11px] normal-case text-slate-500 dark:text-slate-400" }, " BUY/SELL create 시 fee > 0 이면 FEE 거래가 추가로 생성됩니다. ", -1))
                ]),
                _createElementVNode("label", _hoisted_115, [
                  _cache[163] || (_cache[163] = _createTextVNode("Source ", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[64] || (_cache[64] = ($event) => form.source_type = $event),
                    class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                  }, [..._cache[162] || (_cache[162] = [
                    _createElementVNode("option", { value: "MANUAL" }, "MANUAL", -1),
                    _createElementVNode("option", { value: "AUTO" }, "AUTO", -1)
                  ])], 512), [
                    [_vModelSelect, form.source_type]
                  ])
                ])
              ]),
              _createElementVNode("label", _hoisted_116, [
                _cache[164] || (_cache[164] = _createTextVNode("Memo ", -1)),
                _withDirectives(_createElementVNode("input", {
                  "onUpdate:modelValue": _cache[65] || (_cache[65] = ($event) => form.memo = $event),
                  class: "mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
                }, null, 512), [
                  [_vModelText, form.memo]
                ])
              ]),
              _createElementVNode("div", _hoisted_117, [
                _createElementVNode("label", _hoisted_118, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[66] || (_cache[66] = ($event) => form.auto_apply_cash_holding = $event),
                    disabled: isBalanceSet.value,
                    type: "checkbox",
                    class: "h-4 w-4 disabled:opacity-60"
                  }, null, 8, _hoisted_119), [
                    [_vModelCheckbox, form.auto_apply_cash_holding]
                  ]),
                  _cache[165] || (_cache[165] = _createElementVNode("span", null, "Auto apply to cash holding", -1))
                ]),
                _createElementVNode("label", _hoisted_120, [
                  _withDirectives(_createElementVNode("input", {
                    "onUpdate:modelValue": _cache[67] || (_cache[67] = ($event) => form.auto_apply_portfolio_cashflow = $event),
                    type: "checkbox",
                    class: "h-4 w-4"
                  }, null, 512), [
                    [_vModelCheckbox, form.auto_apply_portfolio_cashflow]
                  ]),
                  _cache[166] || (_cache[166] = _createElementVNode("span", null, "Auto apply to net contribution", -1))
                ])
              ]),
              _createElementVNode("div", _hoisted_121, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-60",
                  disabled: saving.value,
                  onClick: submit
                }, _toDisplayString(saving.value ? "Saving..." : editingId.value ? "Update Trade" : "Create Trade"), 9, _hoisted_122),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  onClick: resetForm
                }, "Reset"),
                _createElementVNode("div", _hoisted_123, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded-lg border border-cyan-300 px-4 py-2 text-sm font-semibold text-cyan-700 hover:bg-cyan-50 disabled:opacity-60 dark:border-cyan-800 dark:text-cyan-300 dark:hover:bg-cyan-900/30",
                    disabled: rebuilding.value,
                    onClick: onRebuild
                  }, _toDisplayString(rebuilding.value ? "Rebuilding..." : "Rebuild Ledger Sync"), 9, _hoisted_124),
                  _cache[168] || (_cache[168] = _createElementVNode("button", {
                    type: "button",
                    "aria-label": "Rebuild usage guide",
                    class: "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-xs font-bold text-slate-600 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                  }, " i ", -1)),
                  _createElementVNode("div", _hoisted_125, [
                    _cache[167] || (_cache[167] = _createElementVNode("p", { class: "font-semibold text-slate-900 dark:text-slate-100" }, "Rebuild Ledger Sync 사용 가이드", -1)),
                    _createElementVNode("ul", _hoisted_126, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(rebuildHintLines, (line) => {
                        return _createElementVNode("li", { key: line }, _toDisplayString(line), 1);
                      }), 64))
                    ])
                  ])
                ])
              ])
            ])) : _createCommentVNode("", true)
          ], 38)
        ]),
        errorMessage.value ? (_openBlock(), _createElementBlock("article", _hoisted_127, _toDisplayString(errorMessage.value), 1)) : _createCommentVNode("", true),
        successMessage.value ? (_openBlock(), _createElementBlock("article", _hoisted_128, _toDisplayString(successMessage.value), 1)) : _createCommentVNode("", true),
        _createElementVNode("article", _hoisted_129, [
          _createElementVNode("div", _hoisted_130, [
            _cache[169] || (_cache[169] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.08em] text-indigo-700 dark:text-indigo-300" }, "Journal"),
              _createElementVNode("h2", { class: "mt-1 text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Trade Journal"),
              _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "필터/정렬/페이지네이션으로 거래 이력을 조회하고 편집/무효화합니다.")
            ], -1)),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              "aria-expanded": !journalCollapsed.value,
              onClick: _cache[69] || (_cache[69] = ($event) => journalCollapsed.value = !journalCollapsed.value)
            }, _toDisplayString(journalCollapsed.value ? "Expand" : "Collapse"), 9, _hoisted_131)
          ]),
          !journalCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_132, [
            _createElementVNode("div", _hoisted_133, [
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", quickGroup.value === "ALL" ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[70] || (_cache[70] = ($event) => setQuickGroup("ALL"))
              }, " ALL ", 2),
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", quickGroup.value === "LOAN" ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[71] || (_cache[71] = ($event) => setQuickGroup("LOAN"))
              }, " LOAN ", 2),
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", quickGroup.value === "CASHFLOW" ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[72] || (_cache[72] = ($event) => setQuickGroup("CASHFLOW"))
              }, " CASHFLOW ", 2),
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold transition", quickGroup.value === "BUYSELL" ? "border-cyan-500 bg-cyan-50 text-cyan-700 dark:border-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-300" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                onClick: _cache[73] || (_cache[73] = ($event) => setQuickGroup("BUYSELL"))
              }, " BUYSELL ", 2)
            ]),
            _createElementVNode("div", _hoisted_134, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[74] || (_cache[74] = ($event) => filters.q = $event),
                placeholder: "Search...",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.q]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[75] || (_cache[75] = ($event) => filters.portfolio_id = $event),
                type: "number",
                min: "1",
                placeholder: "Portfolio ID",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.portfolio_id]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[76] || (_cache[76] = ($event) => filters.asset_id = $event),
                type: "number",
                min: "1",
                placeholder: "Asset ID",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.asset_id]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[77] || (_cache[77] = ($event) => filters.liability_id = $event),
                type: "number",
                min: "1",
                placeholder: "Liability ID",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.liability_id]
              ]),
              _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": _cache[78] || (_cache[78] = ($event) => filters.txn_type = $event),
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, [
                _cache[170] || (_cache[170] = _createElementVNode("option", { value: "" }, "ALL TYPES", -1)),
                (_openBlock(), _createElementBlock(_Fragment, null, _renderList(tradeTypes, (type) => {
                  return _createElementVNode("option", {
                    key: type,
                    value: type
                  }, _toDisplayString(tradeTypeLabelMap[type]), 9, _hoisted_135);
                }), 64))
              ], 512), [
                [_vModelSelect, filters.txn_type]
              ]),
              _withDirectives(_createElementVNode("select", {
                "onUpdate:modelValue": _cache[79] || (_cache[79] = ($event) => filters.status = $event),
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, [
                _cache[171] || (_cache[171] = _createElementVNode("option", { value: "" }, "ALL STATUS", -1)),
                (_openBlock(), _createElementBlock(_Fragment, null, _renderList(statusOptions, (status) => {
                  return _createElementVNode("option", {
                    key: status,
                    value: status
                  }, _toDisplayString(status), 9, _hoisted_136);
                }), 64))
              ], 512), [
                [_vModelSelect, filters.status]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[80] || (_cache[80] = ($event) => filters.from = $event),
                type: "date",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.from]
              ]),
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[81] || (_cache[81] = ($event) => filters.to = $event),
                type: "date",
                class: "rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
              }, null, 512), [
                [_vModelText, filters.to]
              ])
            ]),
            _createElementVNode("div", _hoisted_137, [
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
              journalAutoSearchPending.value ? (_openBlock(), _createElementBlock("span", _hoisted_138, [..._cache[172] || (_cache[172] = [
                _createElementVNode("span", { class: "h-2.5 w-2.5 animate-pulse rounded-full bg-cyan-500 dark:bg-cyan-400" }, null, -1),
                _createTextVNode(" Searching while typing... ", -1)
              ])])) : _createCommentVNode("", true)
            ]),
            _createElementVNode("div", _hoisted_139, [
              _createElementVNode("table", _hoisted_140, [
                _createElementVNode("thead", _hoisted_141, [
                  _createElementVNode("tr", null, [
                    _createElementVNode("th", _hoisted_142, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[82] || (_cache[82] = ($event) => toggleSort("id"))
                      }, [
                        _cache[173] || (_cache[173] = _createTextVNode(" # ", -1)),
                        _createElementVNode("span", _hoisted_143, _toDisplayString(sortIndicator("id")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_144, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[83] || (_cache[83] = ($event) => toggleSort("executed_at"))
                      }, [
                        _cache[174] || (_cache[174] = _createTextVNode(" Time ", -1)),
                        _createElementVNode("span", _hoisted_145, _toDisplayString(sortIndicator("executed_at")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_146, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[84] || (_cache[84] = ($event) => toggleSort("txn_type"))
                      }, [
                        _cache[175] || (_cache[175] = _createTextVNode(" Type ", -1)),
                        _createElementVNode("span", _hoisted_147, _toDisplayString(sortIndicator("txn_type")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_148, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[85] || (_cache[85] = ($event) => toggleSort("portfolio_name"))
                      }, [
                        _cache[176] || (_cache[176] = _createTextVNode(" Portfolio ", -1)),
                        _createElementVNode("span", _hoisted_149, _toDisplayString(sortIndicator("portfolio_name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_150, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[86] || (_cache[86] = ($event) => toggleSort("asset_name"))
                      }, [
                        _cache[177] || (_cache[177] = _createTextVNode(" Asset ", -1)),
                        _createElementVNode("span", _hoisted_151, _toDisplayString(sortIndicator("asset_name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_152, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[87] || (_cache[87] = ($event) => toggleSort("liability_name"))
                      }, [
                        _cache[178] || (_cache[178] = _createTextVNode(" Liability ", -1)),
                        _createElementVNode("span", _hoisted_153, _toDisplayString(sortIndicator("liability_name")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_154, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[88] || (_cache[88] = ($event) => toggleSort("amount"))
                      }, [
                        _cache[179] || (_cache[179] = _createTextVNode(" Amount ", -1)),
                        _createElementVNode("span", _hoisted_155, _toDisplayString(sortIndicator("amount")), 1)
                      ])
                    ]),
                    _createElementVNode("th", _hoisted_156, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[89] || (_cache[89] = ($event) => toggleSort("amount_in_portfolio_currency"))
                      }, [
                        _cache[180] || (_cache[180] = _createTextVNode(" Amount(Base) ", -1)),
                        _createElementVNode("span", _hoisted_157, _toDisplayString(sortIndicator("amount_in_portfolio_currency")), 1)
                      ])
                    ]),
                    _cache[182] || (_cache[182] = _createElementVNode("th", { class: "px-2 py-2 text-center" }, "Auto Cash", -1)),
                    _cache[183] || (_cache[183] = _createElementVNode("th", { class: "px-2 py-2 text-center" }, "Auto Net Contribution", -1)),
                    _createElementVNode("th", _hoisted_158, [
                      _createElementVNode("button", {
                        type: "button",
                        class: "inline-flex items-center gap-1 hover:underline",
                        onClick: _cache[90] || (_cache[90] = ($event) => toggleSort("status"))
                      }, [
                        _cache[181] || (_cache[181] = _createTextVNode(" Status ", -1)),
                        _createElementVNode("span", _hoisted_159, _toDisplayString(sortIndicator("status")), 1)
                      ])
                    ]),
                    _cache[184] || (_cache[184] = _createElementVNode("th", { class: "px-2 py-2 text-center" }, "Action", -1))
                  ])
                ]),
                _createElementVNode("tbody", _hoisted_160, [
                  !loading.value && trades.value.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_161, [..._cache[185] || (_cache[185] = [
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
                      _createElementVNode("td", _hoisted_162, "#" + _toDisplayString(row.id), 1),
                      _createElementVNode("td", _hoisted_163, _toDisplayString(formatDateTime(row.executed_at)), 1),
                      _createElementVNode("td", _hoisted_164, _toDisplayString(row.txn_type), 1),
                      _createElementVNode("td", _hoisted_165, "#" + _toDisplayString(row.portfolio_id) + " " + _toDisplayString(row.portfolio_name ?? "-"), 1),
                      _createElementVNode("td", _hoisted_166, [
                        row.asset_id ? (_openBlock(), _createElementBlock("span", _hoisted_167, "#" + _toDisplayString(row.asset_id) + " " + _toDisplayString(row.asset_name ?? "-"), 1)) : (_openBlock(), _createElementBlock("span", _hoisted_168, "-"))
                      ]),
                      _createElementVNode("td", _hoisted_169, [
                        row.liability_id ? (_openBlock(), _createElementBlock("span", _hoisted_170, "#" + _toDisplayString(row.liability_id) + " " + _toDisplayString(row.liability_name ?? "-"), 1)) : (_openBlock(), _createElementBlock("span", _hoisted_171, "-"))
                      ]),
                      _createElementVNode("td", _hoisted_172, _toDisplayString(formatNumber(row.amount)) + " " + _toDisplayString(row.currency), 1),
                      _createElementVNode("td", _hoisted_173, _toDisplayString(formatNumber(row.amount_in_portfolio_currency)), 1),
                      _createElementVNode("td", _hoisted_174, _toDisplayString(row.auto_apply_cash_holding ? "ON" : "OFF"), 1),
                      _createElementVNode("td", _hoisted_175, _toDisplayString(row.auto_apply_portfolio_cashflow ? "ON" : "OFF"), 1),
                      _createElementVNode("td", _hoisted_176, [
                        _createElementVNode("span", {
                          class: _normalizeClass([
                            "rounded-full px-2 py-0.5 text-xs font-semibold",
                            row.status === "VOID" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300" : "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                          ])
                        }, _toDisplayString(row.status), 3)
                      ]),
                      _createElementVNode("td", _hoisted_177, [
                        _createElementVNode("div", _hoisted_178, [
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-slate-300 px-2 py-1 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800",
                            onClick: ($event) => applyEdit(row)
                          }, " Edit ", 8, _hoisted_179),
                          _createElementVNode("button", {
                            type: "button",
                            class: "rounded border border-rose-300 px-2 py-1 text-xs text-rose-700 hover:bg-rose-50 disabled:opacity-60 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/30",
                            disabled: row.status === "VOID",
                            onClick: ($event) => onVoid(row)
                          }, " Void ", 8, _hoisted_180)
                        ])
                      ])
                    ]);
                  }), 128))
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_181, [
              _createElementVNode("p", _hoisted_182, "total: " + _toDisplayString(total.value), 1),
              _createElementVNode("div", _hoisted_183, [
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-1 disabled:opacity-50 dark:border-slate-700",
                  disabled: page.value <= 1,
                  onClick: _cache[91] || (_cache[91] = ($event) => page.value -= 1)
                }, "Prev", 8, _hoisted_184),
                _createElementVNode("span", null, "page " + _toDisplayString(page.value) + " / " + _toDisplayString(totalPages.value), 1),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded border border-slate-300 px-2 py-1 disabled:opacity-50 dark:border-slate-700",
                  disabled: page.value >= totalPages.value,
                  onClick: _cache[92] || (_cache[92] = ($event) => page.value += 1)
                }, "Next", 8, _hoisted_185),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[93] || (_cache[93] = ($event) => pageSize.value = $event),
                  class: "rounded border border-slate-300 px-1 py-1 dark:border-slate-700 dark:bg-slate-950"
                }, [..._cache[186] || (_cache[186] = [
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
