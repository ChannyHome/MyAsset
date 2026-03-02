import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { g as getSummary, a as getNetworthSeries, b as getAllocation } from './ui-CcTyauVO.js';
import { _ as _sfc_main$a } from './KpiBreakdownCards.vue_vue_type_script_setup_true_lang-Dg7ojstE.js';
import { _ as _sfc_main$2, a as _sfc_main$3, b as _sfc_main$4, c as _sfc_main$5 } from './KpiPortfolioSummaryCard.vue_vue_type_script_setup_true_lang-DME2THZa.js';
import { _ as _sfc_main$6 } from './NetworthTrendCard.vue_vue_type_script_setup_true_lang-a69ZjeEA.js';
import { u as useDashboardDataAdapter, _ as _sfc_main$1, a as _sfc_main$7, b as _sfc_main$8, c as _sfc_main$9 } from './useDashboardDataAdapter-BDktnABs.js';
import { g as getHoldingsPerformance, a as getHoldingsTable } from './holdings-CZxu3Df1.js';
import { g as getLiabilitiesTable, a as getPortfoliosTable } from './portfolios-r6VxmkS0.js';
import { g as getReleaseNotes } from './releaseNotes-CR0dehqN.js';
import { u as useDisplayCurrency } from './useDisplayCurrency-HdS6Uz1W.js';
import { f as formatDateTimeSeoul } from './datetime-D3NoeBy6.js';

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,normalizeClass:_normalizeClass,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,renderList:_renderList,Fragment:_Fragment,vModelSelect:_vModelSelect,withDirectives:_withDirectives,createBlock:_createBlock,createVNode:_createVNode,withCtx:_withCtx,createTextVNode:_createTextVNode,normalizeStyle:_normalizeStyle} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_4 = { class: "flex items-center gap-2" };
const _hoisted_5 = ["disabled"];
const _hoisted_6 = { class: "mt-3 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_7 = {
  key: 0,
  class: "rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_8 = { class: "rounded-2xl border border-slate-200 p-3 dark:border-slate-700" };
const _hoisted_9 = { class: "flex flex-wrap items-center gap-3 text-sm" };
const _hoisted_10 = { class: "inline-flex items-center gap-2" };
const _hoisted_11 = { class: "inline-flex items-center gap-2" };
const _hoisted_12 = ["onClick"];
const _hoisted_13 = { class: "inline-flex items-center gap-2" };
const _hoisted_14 = ["onClick"];
const _hoisted_15 = { class: "inline-flex items-center gap-2" };
const _hoisted_16 = ["value"];
const _hoisted_17 = { class: "ml-auto flex flex-wrap items-center gap-2" };
const _hoisted_18 = ["disabled"];
const _hoisted_19 = { class: "xl:col-span-2" };
const _hoisted_20 = { class: "xl:col-span-2" };
const _hoisted_21 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_22 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_23 = {
  key: 0,
  class: "mt-4 space-y-4"
};
const _hoisted_24 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_25 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_26 = {
  key: 1,
  class: "grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3"
};
const _hoisted_27 = { class: "flex items-center justify-between gap-2" };
const _hoisted_28 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_29 = { class: "text-xs font-normal text-slate-500" };
const _hoisted_30 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_31 = { class: "mt-1 text-[11px] text-slate-500 dark:text-slate-400" };
const _hoisted_32 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-2" };
const _hoisted_33 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_34 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_35 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_36 = { class: "flex items-center justify-between gap-2" };
const _hoisted_37 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_38 = { class: "text-xs font-normal text-slate-500" };
const _hoisted_39 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_40 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_41 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_42 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_43 = { class: "flex items-center justify-between gap-2" };
const _hoisted_44 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_45 = { class: "text-xs text-slate-500" };
const _hoisted_46 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_47 = {
  key: 1,
  class: "mt-3 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_48 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_49 = { class: "mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200" };
const _hoisted_50 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_51 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_52 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_53 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_54 = {
  key: 0,
  class: "mt-4"
};
const _hoisted_55 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_56 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_57 = { class: "text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_58 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_59 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_60 = {
  key: 1,
  class: "mt-3 text-xs text-slate-500 dark:text-slate-400"
};
const {computed,nextTick,onMounted,reactive,ref,watch} = await importShared('vue');
const LIVE_MASK_STORAGE_KEY = "myasset:home:live-mask-amounts";
const HOME_TABLE_SECTION_STORAGE_KEY = "myasset:home:table-sections";
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "HomePage",
  setup(__props) {
    function toNumber(value) {
      if (value == null) {
        return 0;
      }
      const num = typeof value === "number" ? value : Number(value);
      return Number.isFinite(num) ? num : 0;
    }
    function formatCurrency(value, currency = "KRW") {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(value);
    }
    function formatSignedCurrency(value, currency = "KRW") {
      const absText = formatCurrency(Math.abs(value), currency);
      if (value > 0) return `+${absText}`;
      if (value < 0) return `-${absText}`;
      return absText;
    }
    function formatOptionalCurrency(value, currency = "KRW") {
      if (value == null) {
        return "-";
      }
      const num = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(num)) {
        return "-";
      }
      return formatCurrency(num, currency);
    }
    function formatPercent(value) {
      if (value == null || !Number.isFinite(value)) {
        return "-";
      }
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    function formatDateTime(value) {
      return formatDateTimeSeoul(value);
    }
    function getHomeTablePageSize() {
      if (typeof window === "undefined") return 10;
      return window.matchMedia("(max-width: 768px)").matches ? 6 : 10;
    }
    function toHomePortfolioSortBy(key) {
      if (key === "portfolio") return "name";
      if (key === "current") return "gross_assets_total";
      if (key === "invested_principal") return "net_contribution_total";
      if (key === "portfolio_profit") return "portfolio_profit_total";
      return "total_return_pct";
    }
    function toHomeHoldingSortBy(key) {
      if (key === "portfolio") return "portfolio_name";
      if (key === "asset") return "asset_name";
      if (key === "price") return "current_price";
      if (key === "avg_cost") return "avg_price";
      if (key === "evaluated") return "evaluated_amount";
      if (key === "cost_basis") return "invested_amount";
      if (key === "profit") return "evaluated_amount";
      if (key === "return") return "pnl_pct";
      return "asset_symbol";
    }
    function toHomeLiabilitySortBy(key) {
      if (key === "portfolio") return "portfolio_name";
      if (key === "liability") return "name";
      if (key === "balance") return "outstanding_balance";
      return "liability_type";
    }
    const loading = ref(false);
    const errorMessage = ref("");
    const summary = ref(null);
    const holdings = ref([]);
    const liabilities = ref([]);
    const portfolios = ref([]);
    const releaseNoteItems = ref([]);
    const liveDashboardExpanded = ref(false);
    const homePortfoliosExpanded = ref(false);
    const homeHoldingsExpanded = ref(false);
    const homeLiabilitiesExpanded = ref(false);
    const reportPanelExpanded = ref(false);
    const releaseNotesExpanded = ref(false);
    const exportingImage = ref(false);
    const liveDashboardTarget = ref("GROSS");
    const liveDonutStartPosition = ref("TOP");
    const liveKpiTarget = ref("SUMMARY");
    const liveMaskAmounts = ref(false);
    const livePortfolioKey = ref("ALL");
    const homePortfolioKey = ref("ALL");
    const homePortfolioRows = ref([]);
    const homeHoldingRows = ref([]);
    const homeLiabilityRows = ref([]);
    const homeHoldingSearchTerm = ref("");
    const homeLiabilitySearchTerm = ref("");
    let homeHoldingSearchDebounceTimer = null;
    let homeLiabilitySearchDebounceTimer = null;
    const homePortfolioTable = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "current",
      sortOrder: "desc",
      loading: false
    });
    const homeHoldingTable = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "evaluated",
      sortOrder: "desc",
      q: "",
      loading: false
    });
    const homeLiabilityTable = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "balance",
      sortOrder: "desc",
      q: "",
      loading: false
    });
    const liveDashboardRef = ref(null);
    const { displayCurrency, ensureInitialized } = useDisplayCurrency();
    const summaryDisplayCurrency = computed(() => summary.value?.display_currency ?? displayCurrency.value);
    const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
    const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
    const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
    const investedPrincipalTotal = computed(() => toNumber(summary.value?.invested_principal_total));
    const principalMinusDebtTotal = computed(
      () => toNumber(summary.value?.debt_adjusted_principal_total ?? summary.value?.principal_minus_debt_total)
    );
    const netAssetsReturnPct = computed(() => toNumber(summary.value?.net_assets_return_pct ?? null));
    const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
    const principalProfitTotal = computed(() => toNumber(summary.value?.principal_profit_total ?? grossAssetsTotal.value - investedPrincipalTotal.value));
    const netAssetsProfitTotal = computed(() => toNumber(summary.value?.net_assets_profit_total ?? netAssetsTotal.value - principalMinusDebtTotal.value));
    const asOf = computed(() => formatDateTime(summary.value?.as_of));
    const livePortfolioId = computed(() => {
      if (livePortfolioKey.value === "ALL") return void 0;
      const parsed = Number(livePortfolioKey.value);
      return Number.isFinite(parsed) ? parsed : void 0;
    });
    const livePortfolioLabel = computed(() => {
      if (livePortfolioId.value == null) return "All portfolios";
      const target = portfolios.value.find((item) => item.id === livePortfolioId.value);
      return target ? target.name : `Portfolio #${livePortfolioId.value}`;
    });
    const liveKpiPortfolioRows = computed(() => {
      if (livePortfolioKey.value === "ALL") return portfolios.value;
      const parsed = Number(livePortfolioKey.value);
      if (!Number.isFinite(parsed)) return portfolios.value;
      return portfolios.value.filter((item) => Number(item.id) === parsed);
    });
    const homePortfolioId = computed(() => {
      if (homePortfolioKey.value === "ALL") return void 0;
      const parsed = Number(homePortfolioKey.value);
      return Number.isFinite(parsed) ? parsed : void 0;
    });
    const homePortfolioOptions = computed(
      () => portfolios.value.map((item) => ({ key: String(item.id), label: item.name }))
    );
    const portfolioReturnById = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const item of portfolios.value) {
        const pct = toNumber(item.total_return_pct);
        if (Number.isFinite(pct)) {
          map.set(item.id, pct);
        }
      }
      return map;
    });
    const holdingReturnByAssetId = computed(() => {
      const agg = /* @__PURE__ */ new Map();
      for (const row of holdings.value) {
        const assetId = row.asset_id;
        const invested = toNumber(row.invested_amount);
        const pnl = toNumber(row.pnl_amount);
        const fallbackPct = toNumber(row.pnl_pct);
        const prev = agg.get(assetId);
        if (!prev) {
          agg.set(assetId, {
            invested: Math.max(0, invested),
            pnl,
            fallbackPct
          });
          continue;
        }
        prev.invested += Math.max(0, invested);
        prev.pnl += pnl;
        prev.fallbackPct = Number.isFinite(prev.fallbackPct) ? prev.fallbackPct : fallbackPct;
      }
      const map = /* @__PURE__ */ new Map();
      for (const [assetId, value] of agg.entries()) {
        if (value.invested > 0) {
          map.set(assetId, value.pnl / value.invested * 100);
        } else if (Number.isFinite(value.fallbackPct)) {
          map.set(assetId, value.fallbackPct);
        }
      }
      return map;
    });
    function resolveLiveAllocationReturnPct(rawReturnPct, target, key) {
      if (rawReturnPct != null && Number.isFinite(rawReturnPct)) {
        return rawReturnPct;
      }
      if (target === "GROSS" || target === "NET") {
        const match = key.match(/^portfolio:(\d+)$/);
        if (!match) return null;
        return portfolioReturnById.value.get(Number(match[1])) ?? null;
      }
      if (target === "HOLDINGS") {
        const match = key.match(/^asset:(\d+)$/);
        if (!match) return null;
        return holdingReturnByAssetId.value.get(Number(match[1])) ?? null;
      }
      return null;
    }
    const liveDashboardData = useDashboardDataAdapter({
      target: liveDashboardTarget,
      portfolioKey: livePortfolioKey,
      displayCurrency,
      loadSummary: async () => ({
        gross: grossAssetsTotal.value,
        liabilities: liabilitiesTotal.value,
        net: netAssetsTotal.value,
        invested: investedPrincipalTotal.value,
        debtAdjusted: principalMinusDebtTotal.value,
        asOf: summary.value?.as_of ?? null
      }),
      loadAllocation: async ({ target, portfolioId, displayCurrency: targetCurrency }) => {
        const normalizedCurrency = targetCurrency === "USD" ? "USD" : "KRW";
        const out = await getAllocation({
          target,
          group_by: target === "HOLDINGS" ? "ASSET" : "PORTFOLIO",
          top_n: 10,
          portfolio_id: portfolioId,
          display_currency: normalizedCurrency
        });
        return {
          total: toNumber(out.total),
          items: out.items.map((item) => ({
            key: item.key,
            label: item.label,
            value: toNumber(item.value),
            ratioPct: toNumber(item.ratio_pct),
            returnPct: item.return_pct == null ? null : toNumber(item.return_pct)
          }))
        };
      },
      loadTrend: async (targetCurrency) => {
        const normalizedCurrency = targetCurrency === "USD" ? "USD" : "KRW";
        const out = await getNetworthSeries({
          display_currency: normalizedCurrency,
          bucket: "DAY",
          limit: 90
        });
        return out.points.map((point) => ({
          label: point.snapshot_date,
          gross: toNumber(point.gross_assets_total),
          liabilities: toNumber(point.liabilities_total),
          net: toNumber(point.net_assets_total)
        }));
      },
      resolveReturnPct: resolveLiveAllocationReturnPct
    });
    const donutItems = computed(() => liveDashboardData.donutItems.value);
    const donutTotal = computed(() => liveDashboardData.donutTotal.value);
    const liveTreemapItems = computed(() => liveDashboardData.treemapItems.value);
    const trendPoints = computed(() => liveDashboardData.trendPoints.value);
    const kpiGrossReturnPct = computed(() => liveDashboardData.kpiGrossReturn.value);
    const kpiNetReturnPct = computed(() => liveDashboardData.kpiNetReturn.value);
    const kpiGrossProfitTotal = computed(() => liveDashboardData.kpiGrossProfit.value);
    const kpiNetProfitTotal = computed(() => liveDashboardData.kpiNetProfit.value);
    const dashboardDonutLoading = computed(() => loading.value || liveDashboardData.donutLoading.value);
    const dashboardDonutError = computed(() => liveDashboardData.donutError.value || errorMessage.value);
    const dashboardTreemapLoading = computed(() => loading.value || liveDashboardData.treemapLoading.value);
    const dashboardTreemapError = computed(() => liveDashboardData.treemapError.value || errorMessage.value);
    const dashboardTrendLoading = computed(() => loading.value || liveDashboardData.trendLoading.value);
    const dashboardTrendError = computed(() => liveDashboardData.trendError.value || errorMessage.value);
    const topHoldings = computed(
      () => [...holdings.value].sort((a, b) => toNumber(b.evaluated_amount) - toNumber(a.evaluated_amount)).slice(0, 6)
    );
    const topPortfolios = computed(
      () => [...portfolios.value].sort((a, b) => toNumber(b.gross_assets_total) - toNumber(a.gross_assets_total)).slice(0, 6)
    );
    const topLiabilities = computed(
      () => [...liabilities.value].sort((a, b) => toNumber(b.outstanding_balance) - toNumber(a.outstanding_balance)).slice(0, 6)
    );
    const topPnlAssets = computed(
      () => [...holdings.value].filter((item) => item.pnl_pct != null).sort((a, b) => toNumber(b.pnl_pct) - toNumber(a.pnl_pct)).slice(0, 3)
    );
    function mapReleaseNotes(notes) {
      return notes.map((note) => ({
        id: String(note.id),
        releasedAt: note.released_at,
        title: note.title,
        summary: note.summary
      }));
    }
    async function loadHomeData() {
      loading.value = true;
      errorMessage.value = "";
      try {
        const [
          summaryOut,
          holdingsOut,
          liabilitiesOut,
          portfoliosOut
        ] = await Promise.all([
          getSummary({ display_currency: displayCurrency.value }),
          getHoldingsPerformance({ display_currency: displayCurrency.value }),
          getLiabilitiesTable({
            page: 1,
            page_size: 200,
            sort_by: "outstanding_balance",
            sort_order: "desc",
            display_currency: displayCurrency.value,
            include_hidden: false,
            include_excluded: false
          }),
          getPortfoliosTable({
            page: 1,
            page_size: 200,
            sort_by: "gross_assets_total",
            sort_order: "desc",
            display_currency: displayCurrency.value,
            include_hidden: false,
            include_excluded: false
          })
        ]);
        summary.value = summaryOut;
        holdings.value = holdingsOut;
        liabilities.value = liabilitiesOut.items;
        portfolios.value = portfoliosOut.items;
        await liveDashboardData.refreshAllDashboard();
        if (livePortfolioKey.value !== "ALL" && !portfoliosOut.items.some((item) => String(item.id) === livePortfolioKey.value)) {
          livePortfolioKey.value = "ALL";
        }
        if (homePortfolioKey.value !== "ALL" && !portfoliosOut.items.some((item) => String(item.id) === homePortfolioKey.value)) {
          homePortfolioKey.value = "ALL";
        }
        try {
          const noteRows = await getReleaseNotes({ limit: 20 });
          const mapped = mapReleaseNotes(noteRows);
          releaseNoteItems.value = mapped;
        } catch {
          releaseNoteItems.value = [];
        }
        if (homePortfoliosExpanded.value) {
          void loadHomePortfolioTable();
        }
        if (homeHoldingsExpanded.value) {
          void loadHomeHoldingTable();
        }
        if (homeLiabilitiesExpanded.value) {
          void loadHomeLiabilityTable();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errorMessage.value = `Failed to load dashboard data: ${message}`;
      } finally {
        loading.value = false;
      }
    }
    function mapHomePortfolioRow(row) {
      return {
        id: row.id,
        name: row.name,
        type: row.type,
        current: toNumber(row.gross_assets_total),
        invested: toNumber(row.net_contribution_total),
        profit: toNumber(row.portfolio_profit_total ?? row.total_pnl_amount),
        returnPct: row.total_return_pct == null ? null : toNumber(row.total_return_pct)
      };
    }
    function mapHomeHoldingRow(row) {
      return {
        id: row.id,
        portfolioName: row.portfolio_name || "Unassigned",
        assetName: row.asset_name,
        symbol: row.asset_symbol,
        price: toNumber(row.current_price),
        priceCurrency: row.current_price_currency || summaryDisplayCurrency.value || "KRW",
        avgCost: toNumber(row.avg_cost),
        avgCostCurrency: row.avg_cost_currency || summaryDisplayCurrency.value || "KRW",
        evaluated: toNumber(row.evaluated_amount),
        costBasis: toNumber(row.cost_basis_total),
        profit: toNumber(row.pnl_amount),
        returnPct: row.pnl_pct == null ? null : toNumber(row.pnl_pct)
      };
    }
    function mapHomeLiabilityRow(row) {
      return {
        id: row.id,
        portfolioName: row.portfolio_name || "Unassigned",
        name: row.name,
        type: row.liability_type,
        balance: toNumber(row.outstanding_balance),
        balanceCurrency: row.currency || summaryDisplayCurrency.value || "KRW"
      };
    }
    function toggleHomeSort(state, key) {
      if (state.sortBy === key) {
        state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
      } else {
        state.sortBy = key;
        state.sortOrder = "desc";
      }
      state.page = 1;
    }
    function toggleHomePortfolioSort(key) {
      toggleHomeSort(homePortfolioTable, key);
    }
    function toggleHomeHoldingSort(key) {
      toggleHomeSort(homeHoldingTable, key);
    }
    function toggleHomeLiabilitySort(key) {
      toggleHomeSort(homeLiabilityTable, key);
    }
    function selectHomeAllPortfolios() {
      if (homePortfolioKey.value === "ALL") {
        return;
      }
      homePortfolioKey.value = "ALL";
    }
    function loadHomeTableSectionState() {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(HOME_TABLE_SECTION_STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed.portfolios === "boolean") homePortfoliosExpanded.value = parsed.portfolios;
        if (typeof parsed.holdings === "boolean") homeHoldingsExpanded.value = parsed.holdings;
        if (typeof parsed.liabilities === "boolean") homeLiabilitiesExpanded.value = parsed.liabilities;
      } catch {
      }
    }
    function saveHomeTableSectionState() {
      if (typeof window === "undefined") return;
      const payload = {
        portfolios: homePortfoliosExpanded.value,
        holdings: homeHoldingsExpanded.value,
        liabilities: homeLiabilitiesExpanded.value
      };
      window.localStorage.setItem(HOME_TABLE_SECTION_STORAGE_KEY, JSON.stringify(payload));
    }
    async function loadHomePortfolioTable() {
      homePortfolioTable.loading = true;
      try {
        const out = await getPortfoliosTable({
          page: homePortfolioTable.page,
          page_size: homePortfolioTable.pageSize,
          sort_by: toHomePortfolioSortBy(homePortfolioTable.sortBy),
          sort_order: homePortfolioTable.sortOrder,
          portfolio_id: homePortfolioId.value,
          display_currency: displayCurrency.value,
          include_hidden: false,
          include_excluded: false
        });
        homePortfolioRows.value = out.items.map(mapHomePortfolioRow);
        homePortfolioTable.total = out.total;
      } finally {
        homePortfolioTable.loading = false;
      }
    }
    async function loadHomeHoldingTable() {
      homeHoldingTable.loading = true;
      try {
        const out = await getHoldingsTable({
          page: homeHoldingTable.page,
          page_size: homeHoldingTable.pageSize,
          sort_by: toHomeHoldingSortBy(homeHoldingTable.sortBy),
          sort_order: homeHoldingTable.sortOrder,
          q: homeHoldingTable.q || void 0,
          portfolio_id: homePortfolioId.value,
          display_currency: displayCurrency.value,
          include_hidden: false,
          include_excluded_portfolios: false
        });
        homeHoldingRows.value = out.items.map(mapHomeHoldingRow);
        homeHoldingTable.total = out.total;
      } finally {
        homeHoldingTable.loading = false;
      }
    }
    async function loadHomeLiabilityTable() {
      homeLiabilityTable.loading = true;
      try {
        const out = await getLiabilitiesTable({
          page: homeLiabilityTable.page,
          page_size: homeLiabilityTable.pageSize,
          sort_by: toHomeLiabilitySortBy(homeLiabilityTable.sortBy),
          sort_order: homeLiabilityTable.sortOrder,
          q: homeLiabilityTable.q || void 0,
          portfolio_id: homePortfolioId.value,
          display_currency: displayCurrency.value,
          include_hidden: false,
          include_excluded: false
        });
        homeLiabilityRows.value = out.items.map(mapHomeLiabilityRow);
        homeLiabilityTable.total = out.total;
      } finally {
        homeLiabilityTable.loading = false;
      }
    }
    function toggleLiveDashboard() {
      liveDashboardExpanded.value = !liveDashboardExpanded.value;
    }
    function toggleReportPanel() {
      reportPanelExpanded.value = !reportPanelExpanded.value;
    }
    function toggleReleaseNotesPanel() {
      releaseNotesExpanded.value = !releaseNotesExpanded.value;
    }
    function printLiveDashboard() {
      window.print();
    }
    function isCanvasBlank(canvas) {
      if (canvas.width === 0 || canvas.height === 0) {
        return true;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return true;
      }
      const sampleW = Math.min(canvas.width, 128);
      const sampleH = Math.min(canvas.height, 128);
      const pixels = ctx.getImageData(0, 0, sampleW, sampleH).data;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] !== 0) {
          return false;
        }
      }
      return true;
    }
    function drawDonutForExport(documentRef) {
      const donutNodes = documentRef.querySelectorAll("[data-export-donut='1']");
      donutNodes.forEach((node) => {
        const rawStops = node.dataset.donutStops ?? "";
        const startAngleDeg = Number(node.dataset.donutStartAngle ?? "0");
        const segments = rawStops.split("|").map((token) => token.trim()).filter((token) => token.length > 0).map((token) => {
          const [ratioText, color] = token.split(":");
          const ratio = Number(ratioText);
          return {
            ratioPct: Number.isFinite(ratio) ? Math.max(0, Math.min(100, ratio)) : 0,
            color: color || "#334155"
          };
        }).filter((item) => item.ratioPct > 0);
        const rect = node.getBoundingClientRect();
        const width = Math.max(1, Math.floor(node.clientWidth || rect.width || 1));
        const height = Math.max(1, Math.floor(node.clientHeight || rect.height || 1));
        const size = Math.max(1, Math.min(width, height));
        const canvas = documentRef.createElement("canvas");
        canvas.width = size * 2;
        canvas.height = size * 2;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        canvas.style.borderRadius = "9999px";
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }
        ctx.scale(2, 2);
        const center = size / 2;
        const outerRadius = center;
        const innerRadius = center * 0.5;
        let cursor = (startAngleDeg - 90) * Math.PI / 180;
        if (segments.length === 0) {
          ctx.beginPath();
          ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
          ctx.fillStyle = "#334155";
          ctx.fill();
        } else {
          for (const segment of segments) {
            const angle = segment.ratioPct / 100 * Math.PI * 2;
            const next = cursor + angle;
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, outerRadius, cursor, next);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            cursor = next;
          }
        }
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        node.style.background = "none";
        node.replaceChildren(canvas);
      });
    }
    function applyAmountMaskForExport(documentRef) {
      const maskedNodes = documentRef.querySelectorAll("[style*='blur(6px)']");
      const calcMaskWidthCh = (text) => {
        const compactLength = text.replace(/\s+/g, "").length;
        if (compactLength <= 0) return 6;
        return Math.max(6, Math.min(24, Math.round(compactLength * 0.65)));
      };
      maskedNodes.forEach((node) => {
        const original = node.textContent ?? "";
        const maskWidth = calcMaskWidthCh(original);
        const maskBlock = documentRef.createElement("span");
        maskBlock.style.display = "inline-block";
        maskBlock.style.width = `${maskWidth}ch`;
        maskBlock.style.height = "1em";
        maskBlock.style.verticalAlign = "middle";
        maskBlock.style.borderRadius = "0.35em";
        maskBlock.style.background = "linear-gradient(180deg, rgba(148,163,184,0.62), rgba(100,116,139,0.58))";
        maskBlock.style.boxShadow = "inset 0 0 0 1px rgba(15,23,42,0.22), 0 1px 6px rgba(15,23,42,0.22)";
        maskBlock.style.filter = "blur(0.35px)";
        maskBlock.setAttribute("aria-hidden", "true");
        node.replaceChildren(maskBlock);
        node.style.filter = "none";
        node.style.webkitFilter = "none";
      });
    }
    async function ensureHtml2Canvas() {
      if (window.html2canvas) {
        return window.html2canvas;
      }
      await new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-myasset-html2canvas="1"]');
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("Failed to load html2canvas")), { once: true });
          return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js";
        script.async = true;
        script.dataset.myassetHtml2canvas = "1";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load html2canvas"));
        document.head.appendChild(script);
      });
      if (!window.html2canvas) {
        throw new Error("html2canvas not available");
      }
      return window.html2canvas;
    }
    async function exportLiveDashboardImage() {
      if (!liveDashboardRef.value) return;
      exportingImage.value = true;
      try {
        await nextTick();
        const target = liveDashboardRef.value;
        const rect = target.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) {
          throw new Error("Live dashboard panel is not visible.");
        }
        const html2canvas = await ensureHtml2Canvas();
        const baseOptions = {
          backgroundColor: "#020617",
          scale: 2,
          useCORS: true,
          windowWidth: Math.max(document.documentElement.clientWidth, Math.ceil(rect.width)),
          windowHeight: Math.max(document.documentElement.clientHeight, Math.ceil(rect.height))
        };
        const onClone = (clonedDocument) => {
          drawDonutForExport(clonedDocument);
          if (liveMaskAmounts.value) {
            applyAmountMaskForExport(clonedDocument);
          }
        };
        let canvas;
        try {
          canvas = await html2canvas(target, {
            ...baseOptions,
            foreignObjectRendering: false,
            onclone: onClone
          });
        } catch {
          canvas = await html2canvas(target, {
            ...baseOptions,
            foreignObjectRendering: true,
            onclone: onClone
          });
        }
        if (isCanvasBlank(canvas)) {
          throw new Error("Captured image is blank. Retry after keeping panel fully visible.");
        }
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `myasset-live-dashboard-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.png`;
        link.click();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errorMessage.value = `Failed to export image: ${message}. Try Print as fallback.`;
      } finally {
        exportingImage.value = false;
      }
    }
    onMounted(async () => {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(LIVE_MASK_STORAGE_KEY);
        if (saved === "1" || saved === "true") {
          liveMaskAmounts.value = true;
        } else if (saved === "0" || saved === "false") {
          liveMaskAmounts.value = false;
        }
        loadHomeTableSectionState();
      }
      const pageSize = getHomeTablePageSize();
      homePortfolioTable.pageSize = pageSize;
      homeHoldingTable.pageSize = pageSize;
      homeLiabilityTable.pageSize = pageSize;
      await ensureInitialized();
      await loadHomeData();
    });
    watch(
      () => displayCurrency.value,
      (next, prev) => {
        if (summary.value && prev && next !== prev) {
          void loadHomeData();
        }
      }
    );
    watch(
      () => [liveDashboardTarget.value, livePortfolioKey.value],
      ([nextTarget, nextPortfolio], [prevTarget, prevPortfolio]) => {
        if (!summary.value) return;
        if (nextTarget !== prevTarget || nextPortfolio !== prevPortfolio) {
          void liveDashboardData.refreshAllocation();
        }
      }
    );
    watch(
      () => liveMaskAmounts.value,
      (next) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(LIVE_MASK_STORAGE_KEY, next ? "1" : "0");
      }
    );
    watch(
      () => [homePortfoliosExpanded.value, homeHoldingsExpanded.value, homeLiabilitiesExpanded.value],
      ([nextPortfolios, nextHoldings, nextLiabilities], [prevPortfolios, prevHoldings, prevLiabilities]) => {
        saveHomeTableSectionState();
        if (nextPortfolios && !prevPortfolios) {
          void loadHomePortfolioTable();
        }
        if (nextHoldings && !prevHoldings) {
          void loadHomeHoldingTable();
        }
        if (nextLiabilities && !prevLiabilities) {
          void loadHomeLiabilityTable();
        }
      }
    );
    watch(
      () => homePortfolioKey.value,
      () => {
        homePortfolioTable.page = 1;
        homeHoldingTable.page = 1;
        homeLiabilityTable.page = 1;
        if (homePortfoliosExpanded.value) {
          void loadHomePortfolioTable();
        }
        if (homeHoldingsExpanded.value) {
          void loadHomeHoldingTable();
        }
        if (homeLiabilitiesExpanded.value) {
          void loadHomeLiabilityTable();
        }
      }
    );
    watch(
      () => [
        homePortfolioTable.page,
        homePortfolioTable.pageSize,
        homePortfolioTable.sortBy,
        homePortfolioTable.sortOrder,
        displayCurrency.value
      ],
      () => {
        if (!homePortfoliosExpanded.value) return;
        void loadHomePortfolioTable();
      }
    );
    watch(
      () => [
        homeHoldingTable.page,
        homeHoldingTable.pageSize,
        homeHoldingTable.sortBy,
        homeHoldingTable.sortOrder,
        homeHoldingTable.q,
        displayCurrency.value
      ],
      () => {
        if (!homeHoldingsExpanded.value) return;
        void loadHomeHoldingTable();
      }
    );
    watch(
      () => [
        homeLiabilityTable.page,
        homeLiabilityTable.pageSize,
        homeLiabilityTable.sortBy,
        homeLiabilityTable.sortOrder,
        homeLiabilityTable.q,
        displayCurrency.value
      ],
      () => {
        if (!homeLiabilitiesExpanded.value) return;
        void loadHomeLiabilityTable();
      }
    );
    watch(
      () => homeHoldingSearchTerm.value,
      (next) => {
        if (homeHoldingSearchDebounceTimer) {
          clearTimeout(homeHoldingSearchDebounceTimer);
        }
        homeHoldingSearchDebounceTimer = setTimeout(() => {
          homeHoldingTable.q = next.trim();
          homeHoldingTable.page = 1;
          homeHoldingSearchDebounceTimer = null;
        }, 300);
      }
    );
    watch(
      () => homeLiabilitySearchTerm.value,
      (next) => {
        if (homeLiabilitySearchDebounceTimer) {
          clearTimeout(homeLiabilitySearchDebounceTimer);
        }
        homeLiabilitySearchDebounceTimer = setTimeout(() => {
          homeLiabilityTable.q = next.trim();
          homeLiabilityTable.page = 1;
          homeLiabilitySearchDebounceTimer = null;
        }, 300);
      }
    );
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[13] || (_cache[13] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300" }, "Home"),
              _createElementVNode("h1", { class: "mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Live Dashboard"),
              _createElementVNode("p", { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" }, " This page now uses real API data from summary, holdings performance, and liabilities. ")
            ], -1)),
            _createElementVNode("div", _hoisted_4, [
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass([
                  "rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
                  liveMaskAmounts.value ? "border-amber-400 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                ]),
                onClick: _cache[0] || (_cache[0] = ($event) => liveMaskAmounts.value = !liveMaskAmounts.value)
              }, " Amount Blur " + _toDisplayString(liveMaskAmounts.value ? "ON" : "OFF"), 3),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: loading.value,
                onClick: loadHomeData
              }, _toDisplayString(loading.value ? "Loading..." : "Refresh"), 9, _hoisted_5)
            ])
          ]),
          _createElementVNode("p", _hoisted_6, "as_of: " + _toDisplayString(asOf.value), 1)
        ]),
        errorMessage.value ? (_openBlock(), _createElementBlock("article", _hoisted_7, [
          _createElementVNode("p", null, _toDisplayString(errorMessage.value), 1),
          _createElementVNode("button", {
            type: "button",
            class: "mt-2 rounded-lg border border-rose-300 px-3 py-1 text-xs font-semibold transition-colors hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/60",
            onClick: loadHomeData
          }, " Retry ")
        ])) : _createCommentVNode("", true),
        _createVNode(_sfc_main$1, {
          title: "Live Dashboard Panel",
          description: "Default is collapsed. Expand to preview dashboard widgets and export image.",
          "source-mode": "LIVE",
          expanded: liveDashboardExpanded.value,
          "collapsed-message": "Collapsed. Click Expand to preview and export.",
          onToggle: toggleLiveDashboard
        }, {
          controls: _withCtx(() => [
            _createElementVNode("div", _hoisted_8, [
              _createElementVNode("div", _hoisted_9, [
                _createElementVNode("div", _hoisted_10, [
                  _cache[14] || (_cache[14] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "KPI", -1)),
                  _createElementVNode("button", {
                    type: "button",
                    class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", liveKpiTarget.value === "SUMMARY" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                    onClick: _cache[1] || (_cache[1] = ($event) => liveKpiTarget.value = "SUMMARY")
                  }, " Summary ", 2),
                  _createElementVNode("button", {
                    type: "button",
                    class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", liveKpiTarget.value === "PORTFOLIOS" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                    onClick: _cache[2] || (_cache[2] = ($event) => liveKpiTarget.value = "PORTFOLIOS")
                  }, " Portfolios ", 2)
                ]),
                _createElementVNode("div", _hoisted_11, [
                  _cache[15] || (_cache[15] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Target", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["GROSS", "LIABILITIES", "NET", "HOLDINGS"], (target) => {
                    return _createElementVNode("button", {
                      key: `home-target-${target}`,
                      type: "button",
                      class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", liveDashboardTarget.value === target ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                      onClick: ($event) => liveDashboardTarget.value = target
                    }, _toDisplayString(target), 11, _hoisted_12);
                  }), 64))
                ]),
                _createElementVNode("div", _hoisted_13, [
                  _cache[16] || (_cache[16] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Start", -1)),
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["TOP", "RIGHT", "LEFT"], (pos) => {
                    return _createElementVNode("button", {
                      key: `home-donut-start-${pos}`,
                      type: "button",
                      class: _normalizeClass(["rounded-lg border px-3 py-1.5 text-xs font-semibold", liveDonutStartPosition.value === pos ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                      onClick: ($event) => liveDonutStartPosition.value = pos
                    }, _toDisplayString(pos), 11, _hoisted_14);
                  }), 64))
                ]),
                _createElementVNode("div", _hoisted_15, [
                  _cache[18] || (_cache[18] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Portfolio", -1)),
                  _withDirectives(_createElementVNode("select", {
                    "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => livePortfolioKey.value = $event),
                    class: "rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                  }, [
                    _cache[17] || (_cache[17] = _createElementVNode("option", { value: "ALL" }, "All", -1)),
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (item) => {
                      return _openBlock(), _createElementBlock("option", {
                        key: `home-live-portfolio-${item.id}`,
                        value: String(item.id)
                      }, _toDisplayString(item.name), 9, _hoisted_16);
                    }), 128))
                  ], 512), [
                    [_vModelSelect, livePortfolioKey.value]
                  ])
                ]),
                _createElementVNode("div", _hoisted_17, [
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                    onClick: printLiveDashboard
                  }, " Print "),
                  _createElementVNode("button", {
                    type: "button",
                    class: "rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-60 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20",
                    disabled: exportingImage.value || loading.value || !liveDashboardExpanded.value,
                    onClick: exportLiveDashboardImage
                  }, _toDisplayString(exportingImage.value ? "Exporting..." : "Export PNG"), 9, _hoisted_18)
                ])
              ])
            ])
          ]),
          default: _withCtx(() => [
            _createElementVNode("div", {
              ref_key: "liveDashboardRef",
              ref: liveDashboardRef,
              class: "grid grid-cols-1 gap-3 xl:grid-cols-2"
            }, [
              _createElementVNode("div", _hoisted_19, [
                liveKpiTarget.value === "SUMMARY" ? (_openBlock(), _createBlock(_sfc_main$2, {
                  key: 0,
                  title: "KPI Summary",
                  subtitle: "Included in print/snapshot",
                  currency: summaryDisplayCurrency.value,
                  "gross-assets-total": grossAssetsTotal.value,
                  "liabilities-total": liabilitiesTotal.value,
                  "net-assets-total": netAssetsTotal.value,
                  "invested-principal-total": investedPrincipalTotal.value,
                  "principal-minus-debt-total": principalMinusDebtTotal.value,
                  "gross-return-pct": kpiGrossReturnPct.value,
                  "net-return-pct": kpiNetReturnPct.value,
                  "gross-profit-total": kpiGrossProfitTotal.value,
                  "net-profit-total": kpiNetProfitTotal.value,
                  "as-of": asOf.value,
                  "mask-amounts": liveMaskAmounts.value
                }, null, 8, ["currency", "gross-assets-total", "liabilities-total", "net-assets-total", "invested-principal-total", "principal-minus-debt-total", "gross-return-pct", "net-return-pct", "gross-profit-total", "net-profit-total", "as-of", "mask-amounts"])) : (_openBlock(), _createBlock(_sfc_main$3, {
                  key: 1,
                  title: "KPI Portfolios",
                  subtitle: "Per portfolio | Included in print/snapshot",
                  currency: summaryDisplayCurrency.value,
                  portfolios: liveKpiPortfolioRows.value,
                  "mask-amounts": liveMaskAmounts.value
                }, null, 8, ["currency", "portfolios", "mask-amounts"]))
              ]),
              _createVNode(_sfc_main$4, {
                title: `Allocation | ${liveDashboardTarget.value}`,
                subtitle: `Top N + Others (${livePortfolioKey.value === "ALL" ? "all portfolios" : "filtered portfolio"})`,
                currency: summaryDisplayCurrency.value,
                total: donutTotal.value,
                items: donutItems.value,
                "start-position": liveDonutStartPosition.value,
                "mask-amounts": liveMaskAmounts.value,
                loading: dashboardDonutLoading.value,
                error: dashboardDonutError.value
              }, null, 8, ["title", "subtitle", "currency", "total", "items", "start-position", "mask-amounts", "loading", "error"]),
              _createVNode(_sfc_main$5, {
                title: `Treemap | ${liveDashboardTarget.value}`,
                subtitle: liveDashboardTarget.value === "HOLDINGS" ? `Target=HOLDINGS | group_by=ASSET | color=return ${livePortfolioKey.value === "ALL" ? "" : `| ${livePortfolioLabel.value}`}` : `Target=${liveDashboardTarget.value} | group_by=PORTFOLIO | color=return`,
                currency: summaryDisplayCurrency.value,
                items: liveTreemapItems.value,
                "mask-amounts": liveMaskAmounts.value,
                loading: dashboardTreemapLoading.value,
                error: dashboardTreemapError.value
              }, null, 8, ["title", "subtitle", "currency", "items", "mask-amounts", "loading", "error"]),
              _createElementVNode("div", _hoisted_20, [
                _createVNode(_sfc_main$6, {
                  title: "Networth Trend",
                  subtitle: "valuation_snapshots | bucket=DAY",
                  currency: summaryDisplayCurrency.value,
                  points: trendPoints.value,
                  "mask-amounts": liveMaskAmounts.value,
                  loading: dashboardTrendLoading.value,
                  error: dashboardTrendError.value
                }, null, 8, ["currency", "points", "mask-amounts", "loading", "error"])
              ])
            ], 512)
          ]),
          _: 1
        }, 8, ["expanded"]),
        _createVNode(_sfc_main$7, {
          title: "Portfolios Table",
          subtitle: "Portfolio / Current / Invested Principal / Profit / Return",
          expanded: homePortfoliosExpanded.value,
          loading: homePortfolioTable.loading,
          rows: homePortfolioRows.value,
          total: homePortfolioTable.total,
          page: homePortfolioTable.page,
          "page-size": homePortfolioTable.pageSize,
          "sort-by": homePortfolioTable.sortBy,
          "sort-order": homePortfolioTable.sortOrder,
          currency: summaryDisplayCurrency.value,
          "mask-amounts": liveMaskAmounts.value,
          "show-filter": true,
          "portfolio-key": homePortfolioKey.value,
          "portfolio-options": homePortfolioOptions.value,
          onToggle: _cache[4] || (_cache[4] = ($event) => homePortfoliosExpanded.value = !homePortfoliosExpanded.value),
          onSort: toggleHomePortfolioSort,
          onSetPage: _cache[5] || (_cache[5] = ($event) => homePortfolioTable.page = $event),
          onSelectAll: selectHomeAllPortfolios,
          onSetPortfolioKey: _cache[6] || (_cache[6] = ($event) => homePortfolioKey.value = $event)
        }, null, 8, ["expanded", "loading", "rows", "total", "page", "page-size", "sort-by", "sort-order", "currency", "mask-amounts", "portfolio-key", "portfolio-options"]),
        _createVNode(_sfc_main$8, {
          title: "Holdings Table",
          subtitle: "Portfolio / Asset / Price / Avg Cost / Evaluated / Cost Basis / Profit / Return / Symbol",
          expanded: homeHoldingsExpanded.value,
          loading: homeHoldingTable.loading,
          rows: homeHoldingRows.value,
          total: homeHoldingTable.total,
          page: homeHoldingTable.page,
          "page-size": homeHoldingTable.pageSize,
          "sort-by": homeHoldingTable.sortBy,
          "sort-order": homeHoldingTable.sortOrder,
          "search-term": homeHoldingSearchTerm.value,
          "mask-amounts": liveMaskAmounts.value,
          "display-currency": summaryDisplayCurrency.value,
          onToggle: _cache[7] || (_cache[7] = ($event) => homeHoldingsExpanded.value = !homeHoldingsExpanded.value),
          onSort: toggleHomeHoldingSort,
          onSetPage: _cache[8] || (_cache[8] = ($event) => homeHoldingTable.page = $event),
          "onUpdate:searchTerm": _cache[9] || (_cache[9] = ($event) => homeHoldingSearchTerm.value = $event)
        }, null, 8, ["expanded", "loading", "rows", "total", "page", "page-size", "sort-by", "sort-order", "search-term", "mask-amounts", "display-currency"]),
        _createVNode(_sfc_main$9, {
          title: "Liabilities Table",
          subtitle: "Portfolio / Liability / Balance / Type",
          expanded: homeLiabilitiesExpanded.value,
          loading: homeLiabilityTable.loading,
          rows: homeLiabilityRows.value,
          total: homeLiabilityTable.total,
          page: homeLiabilityTable.page,
          "page-size": homeLiabilityTable.pageSize,
          "sort-by": homeLiabilityTable.sortBy,
          "sort-order": homeLiabilityTable.sortOrder,
          "search-term": homeLiabilitySearchTerm.value,
          "mask-amounts": liveMaskAmounts.value,
          onToggle: _cache[10] || (_cache[10] = ($event) => homeLiabilitiesExpanded.value = !homeLiabilitiesExpanded.value),
          onSort: toggleHomeLiabilitySort,
          onSetPage: _cache[11] || (_cache[11] = ($event) => homeLiabilityTable.page = $event),
          "onUpdate:searchTerm": _cache[12] || (_cache[12] = ($event) => homeLiabilitySearchTerm.value = $event)
        }, null, 8, ["expanded", "loading", "rows", "total", "page", "page-size", "sort-by", "sort-order", "search-term", "mask-amounts"]),
        _createElementVNode("article", _hoisted_21, [
          _createElementVNode("div", _hoisted_22, [
            _cache[19] || (_cache[19] = _createElementVNode("div", null, [
              _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Report Panel"),
              _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, " Gross/Liabilities/Net plus Top cards grouped together. ")
            ], -1)),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              onClick: toggleReportPanel
            }, _toDisplayString(reportPanelExpanded.value ? "Collapse" : "Expand"), 1)
          ]),
          reportPanelExpanded.value ? (_openBlock(), _createElementBlock("div", _hoisted_23, [
            _createVNode(_sfc_main$a, {
              "display-currency": summaryDisplayCurrency.value,
              "gross-assets-total": grossAssetsTotal.value,
              "liabilities-total": liabilitiesTotal.value,
              "net-assets-total": netAssetsTotal.value,
              "invested-principal-total": investedPrincipalTotal.value,
              "principal-minus-debt-total": principalMinusDebtTotal.value,
              "principal-return-pct": principalReturnPct.value,
              "net-assets-return-pct": netAssetsReturnPct.value,
              "principal-profit-total": principalProfitTotal.value,
              "net-assets-profit-total": netAssetsProfitTotal.value,
              portfolios: portfolios.value,
              liabilities: liabilities.value,
              "mask-amounts": liveMaskAmounts.value
            }, null, 8, ["display-currency", "gross-assets-total", "liabilities-total", "net-assets-total", "invested-principal-total", "principal-minus-debt-total", "principal-return-pct", "net-assets-return-pct", "principal-profit-total", "net-assets-profit-total", "portfolios", "liabilities", "mask-amounts"]),
            _createElementVNode("article", _hoisted_24, [
              _cache[24] || (_cache[24] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
                _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Portfolios"),
                _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By gross assets")
              ], -1)),
              topPortfolios.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_25, " No portfolio data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_26, [
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topPortfolios.value, (item) => {
                  return _openBlock(), _createElementBlock("li", {
                    key: item.id,
                    class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                  }, [
                    _createElementVNode("div", _hoisted_27, [
                      _createElementVNode("p", _hoisted_28, [
                        _createTextVNode(_toDisplayString(item.name) + " ", 1),
                        _createElementVNode("span", _hoisted_29, _toDisplayString(item.type), 1)
                      ]),
                      _createElementVNode("p", {
                        class: _normalizeClass(["text-xs font-semibold", item.total_return_pct == null ? "text-slate-500" : toNumber(item.total_return_pct) >= 0 ? "text-emerald-600" : "text-rose-500"])
                      }, _toDisplayString(formatPercent(item.total_return_pct == null ? null : toNumber(item.total_return_pct))), 3)
                    ]),
                    _createElementVNode("div", _hoisted_30, [
                      _cache[20] || (_cache[20] = _createTextVNode(" Gross ", -1)),
                      _createElementVNode("span", {
                        style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                      }, _toDisplayString(formatCurrency(toNumber(item.gross_assets_total), item.base_currency || summaryDisplayCurrency.value)), 5),
                      _cache[21] || (_cache[21] = _createTextVNode(" / Debt-Adjusted Principal ", -1)),
                      _createElementVNode("span", {
                        style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                      }, _toDisplayString(formatCurrency(
                        toNumber(item.debt_adjusted_principal_total ?? item.principal_minus_debt_total),
                        item.base_currency || summaryDisplayCurrency.value
                      )), 5)
                    ]),
                    _createElementVNode("div", _hoisted_31, [
                      _cache[22] || (_cache[22] = _createTextVNode(" Net ", -1)),
                      _createElementVNode("span", {
                        style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                      }, _toDisplayString(formatCurrency(toNumber(item.net_assets_total), item.base_currency || summaryDisplayCurrency.value)), 5),
                      _cache[23] || (_cache[23] = _createTextVNode(" · Portfolio Profit ", -1)),
                      _createElementVNode("span", {
                        style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                      }, _toDisplayString(formatSignedCurrency(
                        toNumber(item.portfolio_profit_total ?? item.total_pnl_amount),
                        item.base_currency || summaryDisplayCurrency.value
                      )), 5)
                    ])
                  ]);
                }), 128))
              ]))
            ]),
            _createElementVNode("div", _hoisted_32, [
              _createElementVNode("article", _hoisted_33, [
                _cache[26] || (_cache[26] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
                  _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Holdings"),
                  _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By evaluated amount")
                ], -1)),
                topHoldings.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_34, " No holdings data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_35, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topHoldings.value, (item) => {
                    return _openBlock(), _createElementBlock("li", {
                      key: item.holding_id,
                      class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                    }, [
                      _createElementVNode("div", _hoisted_36, [
                        _createElementVNode("p", _hoisted_37, [
                          _createTextVNode(_toDisplayString(item.asset_name) + " ", 1),
                          _createElementVNode("span", _hoisted_38, _toDisplayString(item.asset_symbol || "-"), 1)
                        ]),
                        _createElementVNode("p", {
                          class: _normalizeClass(["text-xs font-semibold", toNumber(item.pnl_pct) >= 0 ? "text-emerald-600" : "text-rose-500"])
                        }, _toDisplayString(formatPercent(toNumber(item.pnl_pct))), 3)
                      ]),
                      _createElementVNode("div", _hoisted_39, [
                        _createElementVNode("span", {
                          style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                        }, _toDisplayString(formatOptionalCurrency(item.current_price, item.current_price_currency || summaryDisplayCurrency.value)), 5),
                        _cache[25] || (_cache[25] = _createTextVNode(" / ", -1)),
                        _createElementVNode("span", {
                          style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                        }, _toDisplayString(formatOptionalCurrency(item.avg_price, item.current_price_currency || summaryDisplayCurrency.value)), 5)
                      ])
                    ]);
                  }), 128))
                ]))
              ]),
              _createElementVNode("article", _hoisted_40, [
                _cache[27] || (_cache[27] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
                  _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Liabilities"),
                  _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By outstanding balance")
                ], -1)),
                topLiabilities.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_41, " No liabilities data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_42, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topLiabilities.value, (item) => {
                    return _openBlock(), _createElementBlock("li", {
                      key: item.id,
                      class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                    }, [
                      _createElementVNode("div", _hoisted_43, [
                        _createElementVNode("p", _hoisted_44, _toDisplayString(item.name), 1),
                        _createElementVNode("p", _hoisted_45, _toDisplayString(item.liability_type), 1)
                      ]),
                      _createElementVNode("div", _hoisted_46, [
                        _createElementVNode("span", {
                          style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                        }, _toDisplayString(formatCurrency(toNumber(item.outstanding_balance), item.currency || summaryDisplayCurrency.value)), 5)
                      ])
                    ]);
                  }), 128))
                ]))
              ])
            ])
          ])) : (_openBlock(), _createElementBlock("p", _hoisted_47, [..._cache[28] || (_cache[28] = [
            _createTextVNode(" Collapsed. Click ", -1),
            _createElementVNode("span", { class: "font-semibold" }, "Expand", -1),
            _createTextVNode(" to preview report cards. ", -1)
          ])]))
        ]),
        _createElementVNode("article", _hoisted_48, [
          _cache[29] || (_cache[29] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Quick Insight", -1)),
          _createElementVNode("ul", _hoisted_49, [
            _createElementVNode("li", _hoisted_50, " Scope: " + _toDisplayString(summary.value?.scope_type || "-") + " (users: " + _toDisplayString(summary.value?.user_count || 0) + ") ", 1),
            _createElementVNode("li", _hoisted_51, " Best Profit assets: " + _toDisplayString(topPnlAssets.value.map((item) => item.asset_symbol || item.asset_name).join(", ") || "-"), 1)
          ])
        ]),
        _createElementVNode("article", _hoisted_52, [
          _createElementVNode("div", _hoisted_53, [
            _cache[30] || (_cache[30] = _createElementVNode("div", null, [
              _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Release Notes"),
              _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Latest first")
            ], -1)),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              onClick: toggleReleaseNotesPanel
            }, _toDisplayString(releaseNotesExpanded.value ? "Collapse" : "Expand"), 1)
          ]),
          releaseNotesExpanded.value ? (_openBlock(), _createElementBlock("div", _hoisted_54, [
            releaseNoteItems.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_55, " No release notes yet. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_56, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(releaseNoteItems.value, (note) => {
                return _openBlock(), _createElementBlock("li", {
                  key: note.id,
                  class: "rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                }, [
                  _createElementVNode("p", _hoisted_57, _toDisplayString(formatDateTime(note.releasedAt)), 1),
                  _createElementVNode("p", _hoisted_58, _toDisplayString(note.title), 1),
                  _createElementVNode("p", _hoisted_59, _toDisplayString(note.summary), 1)
                ]);
              }), 128))
            ]))
          ])) : (_openBlock(), _createElementBlock("p", _hoisted_60, [..._cache[31] || (_cache[31] = [
            _createTextVNode(" Collapsed. Click ", -1),
            _createElementVNode("span", { class: "font-semibold" }, "Expand", -1),
            _createTextVNode(" to view release notes. ", -1)
          ])]))
        ])
      ]);
    };
  }
});

export { _sfc_main as default };
