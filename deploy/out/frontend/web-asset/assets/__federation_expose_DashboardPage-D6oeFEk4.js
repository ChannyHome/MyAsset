import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { _ as _sfc_main$5, g as getSummary, a as getAllocation, b as getNetworthSeries, c as collectSnapshots } from './NetworthTrendCard.vue_vue_type_script_setup_true_lang-DHTjWqU8.js';
import { g as getHoldingsPerformance } from './holdings-8qgM-Yg8.js';
import { b as getLiabilities, c as getPortfolios, a as getPortfoliosTable } from './portfolios-De0w93tc.js';
import { _ as _sfc_main$1, a as _sfc_main$2, b as _sfc_main$3, c as _sfc_main$4 } from './KpiPortfolioSummaryCard.vue_vue_type_script_setup_true_lang-BjkCKIwg.js';
import { u as useDisplayCurrency } from './useDisplayCurrency-ArDju8z7.js';
import { f as formatDateTimeSeoul } from './datetime-BbzyLRcb.js';

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,normalizeClass:_normalizeClass,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,vModelText:_vModelText,withDirectives:_withDirectives,renderList:_renderList,Fragment:_Fragment,vModelSelect:_vModelSelect,createBlock:_createBlock,createVNode:_createVNode,withModifiers:_withModifiers} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_4 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_5 = ["disabled"];
const _hoisted_6 = { class: "mt-3 flex flex-wrap items-center gap-2 text-xs" };
const _hoisted_7 = { class: "rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_8 = { class: "rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_9 = { class: "rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_10 = {
  key: 0,
  class: "mt-2 text-xs text-rose-600 dark:text-rose-300"
};
const _hoisted_11 = { class: "mt-3 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_12 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]" };
const _hoisted_13 = { class: "rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-lg" };
const _hoisted_14 = { class: "border-b border-slate-700 p-3" };
const _hoisted_15 = { class: "max-h-[60vh] overflow-y-auto p-3" };
const _hoisted_16 = { class: "mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300" };
const _hoisted_17 = { class: "space-y-1" };
const _hoisted_18 = ["onDragstart", "onDblclick"];
const _hoisted_19 = { class: "block text-sm font-medium text-slate-100" };
const _hoisted_20 = { class: "block text-xs text-slate-400" };
const _hoisted_21 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_22 = {
  key: 0,
  class: "flex h-[360px] items-center justify-center text-sm text-slate-500 dark:text-slate-400"
};
const _hoisted_23 = {
  key: 1,
  class: "grid grid-cols-1 gap-3 md:grid-cols-2"
};
const _hoisted_24 = { class: "mb-3 flex items-center justify-between" };
const _hoisted_25 = { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_26 = ["onClick"];
const _hoisted_27 = {
  key: 0,
  class: "space-y-2"
};
const _hoisted_28 = { class: "flex flex-wrap items-center gap-1" };
const _hoisted_29 = ["onClick"];
const _hoisted_30 = {
  key: 0,
  class: "flex items-center gap-2"
};
const _hoisted_31 = ["value"];
const _hoisted_32 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_33 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_34 = { class: "flex flex-wrap items-center gap-1" };
const _hoisted_35 = ["onClick"];
const _hoisted_36 = { class: "flex flex-wrap items-center gap-1" };
const _hoisted_37 = ["onClick"];
const _hoisted_38 = {
  key: 0,
  class: "mb-1 flex items-center gap-2"
};
const _hoisted_39 = ["value"];
const _hoisted_40 = { key: 2 };
const _hoisted_41 = { class: "mb-2 flex flex-wrap items-center gap-2" };
const _hoisted_42 = { class: "flex items-center gap-1" };
const _hoisted_43 = ["onClick"];
const _hoisted_44 = ["value"];
const _hoisted_45 = { key: 3 };
const _hoisted_46 = {
  key: 4,
  class: "rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800"
};
const _hoisted_47 = {
  key: 5,
  class: "rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800"
};
const _hoisted_48 = { class: "w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_49 = { class: "mb-3 flex items-center justify-between" };
const _hoisted_50 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2" };
const _hoisted_51 = { class: "block text-sm" };
const _hoisted_52 = ["value"];
const _hoisted_53 = { class: "block text-sm" };
const _hoisted_54 = ["value"];
const _hoisted_55 = { class: "mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700" };
const _hoisted_56 = { class: "w-full min-w-[420px] text-left text-sm" };
const _hoisted_57 = { class: "px-3 py-2" };
const _hoisted_58 = { class: "px-3 py-2" };
const _hoisted_59 = { class: "px-3 py-2" };
const _hoisted_60 = { class: "mt-4 flex flex-wrap justify-end gap-2" };
const {computed,onMounted,reactive,ref,watch} = await importShared('vue');
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "DashboardPage",
  setup(__props) {
    function toNumber(value) {
      if (value == null) return 0;
      const num = typeof value === "number" ? value : Number(value);
      return Number.isFinite(num) ? num : 0;
    }
    function formatDateTime(value) {
      return formatDateTimeSeoul(value);
    }
    const toolboxSections = [
      {
        title: "Core",
        items: [
          { type: "kpi_summary", label: "KPI Summary", description: "Gross / Net / Liabilities" },
          { type: "market_board", label: "Market Board", description: "Indexes and crypto strip (MVP stub)" }
        ]
      },
      {
        title: "Charts",
        items: [
          { type: "donut_allocation", label: "Donut Allocation", description: "Gross / liabilities / net allocation" },
          { type: "treemap_holdings", label: "Treemap Holdings", description: "Holdings allocation blocks" },
          { type: "networth_line", label: "Networth Line", description: "valuation_snapshots trend line" },
          { type: "dividend_bar_monthly", label: "Dividend Bar", description: "Monthly dividend (MVP stub)" }
        ]
      }
    ];
    const dashboardPresets = [
      {
        id: "default-main",
        name: "Default Main",
        widgets: ["kpi_summary", "donut_allocation", "treemap_holdings", "networth_line"],
        note: "Balanced default dashboard"
      },
      {
        id: "allocation-focus",
        name: "Allocation Focus",
        widgets: ["kpi_summary", "donut_allocation", "treemap_holdings", "market_board"],
        note: "Allocation and composition focus"
      },
      {
        id: "trend-focus",
        name: "Trend Focus",
        widgets: ["kpi_summary", "networth_line", "donut_allocation"],
        note: "Snapshot trend and KPI focus"
      }
    ];
    const widgetDictionary = new Map(
      toolboxSections.flatMap((section) => section.items).map((item) => [item.type, item])
    );
    const search = ref("");
    const canvasWidgets = ref([
      { id: 1, type: "kpi_summary", label: "KPI Summary" },
      { id: 2, type: "donut_allocation", label: "Donut Allocation" },
      { id: 3, type: "treemap_holdings", label: "Treemap Holdings" },
      { id: 4, type: "networth_line", label: "Networth Line" }
    ]);
    const nextWidgetId = ref(5);
    const activeDashboardName = ref("Default Main");
    const compareModalOpen = ref(false);
    const compare = reactive({
      left: "default-main",
      right: "allocation-focus"
    });
    const donutTarget = ref("GROSS");
    const donutStartPosition = ref("TOP");
    const treemapTarget = ref("GROSS");
    const kpiTarget = ref("SUMMARY");
    const kpiPortfolioKey = ref("ALL");
    const collectingSnapshot = ref(false);
    const dataLoading = ref(false);
    const dataError = ref("");
    const summary = ref(null);
    const holdings = ref([]);
    const liabilities = ref([]);
    const portfolios = ref([]);
    const portfolioStats = ref([]);
    const allocationGross = ref(null);
    const allocationLiabilities = ref(null);
    const allocationNet = ref(null);
    const allocationHoldings = ref(null);
    const networthSeries = ref(null);
    const treemapPortfolioKey = ref("ALL");
    const { displayCurrency, ensureInitialized } = useDisplayCurrency();
    const summaryDisplayCurrency = computed(() => summary.value?.display_currency ?? displayCurrency.value);
    const filteredSections = computed(() => {
      const keyword = search.value.trim().toLowerCase();
      if (!keyword) return toolboxSections;
      return toolboxSections.map((section) => ({
        title: section.title,
        items: section.items.filter(
          (item) => `${item.label} ${item.description} ${item.type}`.toLowerCase().includes(keyword)
        )
      })).filter((section) => section.items.length > 0);
    });
    const compareRows = computed(() => {
      const left = dashboardPresets.find((item) => item.id === compare.left);
      const right = dashboardPresets.find((item) => item.id === compare.right);
      if (!left || !right) return [];
      const allTypes = Array.from(/* @__PURE__ */ new Set([...left.widgets, ...right.widgets]));
      return allTypes.map((type) => ({
        type,
        left: left.widgets.includes(type),
        right: right.widgets.includes(type)
      }));
    });
    const connectionStatus = computed(() => {
      if (dataLoading.value) return "loading";
      if (dataError.value) return "error";
      if (summary.value) return "connected";
      return "idle";
    });
    const donutData = computed(() => {
      if (donutTarget.value === "GROSS") return allocationGross.value;
      if (donutTarget.value === "LIABILITIES") return allocationLiabilities.value;
      if (donutTarget.value === "NET") return allocationNet.value;
      return allocationHoldings.value;
    });
    const donutItems = computed(
      () => (donutData.value?.items ?? []).map((item) => ({
        key: item.key,
        label: item.label,
        value: toNumber(item.value),
        ratioPct: toNumber(item.ratio_pct),
        returnPct: null
      }))
    );
    const portfolioReturnById = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const item of portfolioStats.value) {
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
    const holdingsTreemapItems = computed(
      () => (treemapTarget.value === "GROSS" ? allocationGross.value?.items ?? [] : allocationHoldings.value?.items ?? []).map((item) => ({
        key: item.key,
        label: item.label,
        value: toNumber(item.value),
        ratioPct: toNumber(item.ratio_pct),
        returnPct: treemapTarget.value === "GROSS" ? (() => {
          const match = item.key.match(/^portfolio:(\d+)$/);
          if (!match) return null;
          return portfolioReturnById.value.get(Number(match[1])) ?? null;
        })() : (() => {
          const match = item.key.match(/^asset:(\d+)$/);
          if (!match) return null;
          return holdingReturnByAssetId.value.get(Number(match[1])) ?? null;
        })()
      }))
    );
    const treemapPortfolioId = computed(() => {
      if (treemapPortfolioKey.value === "ALL") return void 0;
      const parsed = Number(treemapPortfolioKey.value);
      return Number.isFinite(parsed) ? parsed : void 0;
    });
    const treemapPortfolioLabel = computed(() => {
      if (treemapPortfolioId.value == null) return "All portfolios";
      const target = portfolios.value.find((item) => item.id === treemapPortfolioId.value);
      return target ? target.name : `Portfolio #${treemapPortfolioId.value}`;
    });
    const kpiPortfolioRows = computed(() => {
      if (kpiPortfolioKey.value === "ALL") return portfolioStats.value;
      const parsed = Number(kpiPortfolioKey.value);
      if (!Number.isFinite(parsed)) return portfolioStats.value;
      return portfolioStats.value.filter((item) => Number(item.id) === parsed);
    });
    const trendPoints = computed(
      () => (networthSeries.value?.points ?? []).map((point) => ({
        label: point.snapshot_date,
        gross: toNumber(point.gross_assets_total),
        liabilities: toNumber(point.liabilities_total),
        net: toNumber(point.net_assets_total)
      }))
    );
    const kpiGrossReturnPct = computed(() => summary.value?.principal_return_pct == null ? null : toNumber(summary.value.principal_return_pct));
    const kpiNetReturnPct = computed(() => summary.value?.net_assets_return_pct == null ? null : toNumber(summary.value.net_assets_return_pct));
    const kpiGrossProfitTotal = computed(
      () => toNumber(summary.value?.principal_profit_total ?? toNumber(summary.value?.gross_assets_total) - toNumber(summary.value?.invested_principal_total))
    );
    const kpiNetProfitTotal = computed(
      () => toNumber(
        summary.value?.net_assets_profit_total ?? toNumber(summary.value?.net_assets_total) - toNumber(summary.value?.debt_adjusted_principal_total ?? summary.value?.principal_minus_debt_total)
      )
    );
    function buildWidgetsFromPreset(presetId) {
      const preset = dashboardPresets.find((item) => item.id === presetId);
      if (!preset) return;
      canvasWidgets.value = preset.widgets.map((type) => {
        const item = widgetDictionary.get(type);
        return {
          id: nextWidgetId.value++,
          type,
          label: item?.label ?? type
        };
      });
      activeDashboardName.value = preset.name;
    }
    function addWidget(item) {
      canvasWidgets.value.push({
        id: nextWidgetId.value++,
        type: item.type,
        label: item.label
      });
    }
    function removeWidget(id) {
      canvasWidgets.value = canvasWidgets.value.filter((item) => item.id !== id);
    }
    function onDragStart(event, item) {
      if (!event.dataTransfer) return;
      event.dataTransfer.setData("application/myasset-widget", item.type);
      event.dataTransfer.effectAllowed = "copy";
    }
    function onDropCanvas(event) {
      const type = event.dataTransfer?.getData("application/myasset-widget");
      if (!type) return;
      const item = widgetDictionary.get(type);
      if (item) addWidget(item);
    }
    async function loadDashboardData() {
      dataLoading.value = true;
      dataError.value = "";
      try {
        const [
          summaryOut,
          holdingsOut,
          liabilitiesOut,
          grossAllocationOut,
          liabilitiesAllocationOut,
          netAllocationOut,
          holdingsAllocationOut,
          networthSeriesOut,
          portfoliosOut,
          portfoliosTableOut
        ] = await Promise.all([
          getSummary({ display_currency: displayCurrency.value }),
          getHoldingsPerformance({ display_currency: displayCurrency.value }),
          getLiabilities({ display_currency: displayCurrency.value }),
          getAllocation({
            target: "GROSS",
            group_by: "PORTFOLIO",
            top_n: 10,
            display_currency: displayCurrency.value
          }),
          getAllocation({
            target: "LIABILITIES",
            group_by: "PORTFOLIO",
            top_n: 10,
            display_currency: displayCurrency.value
          }),
          getAllocation({
            target: "NET",
            group_by: "PORTFOLIO",
            top_n: 10,
            display_currency: displayCurrency.value
          }),
          getAllocation({
            target: "HOLDINGS",
            group_by: "ASSET",
            top_n: 12,
            portfolio_id: treemapPortfolioId.value,
            display_currency: displayCurrency.value
          }),
          getNetworthSeries({
            display_currency: displayCurrency.value,
            bucket: "DAY",
            limit: 90
          }),
          getPortfolios(),
          getPortfoliosTable({
            page: 1,
            page_size: 200,
            sort_by: "id",
            sort_order: "asc",
            display_currency: displayCurrency.value,
            include_hidden: false,
            include_excluded: false
          })
        ]);
        summary.value = summaryOut;
        holdings.value = holdingsOut;
        liabilities.value = liabilitiesOut;
        allocationGross.value = grossAllocationOut;
        allocationLiabilities.value = liabilitiesAllocationOut;
        allocationNet.value = netAllocationOut;
        allocationHoldings.value = holdingsAllocationOut;
        networthSeries.value = networthSeriesOut;
        portfolios.value = portfoliosOut;
        portfolioStats.value = portfoliosTableOut.items;
        if (treemapPortfolioKey.value !== "ALL" && !portfoliosOut.some((item) => String(item.id) === treemapPortfolioKey.value)) {
          treemapPortfolioKey.value = "ALL";
        }
        if (kpiPortfolioKey.value !== "ALL" && !portfoliosOut.some((item) => String(Number(item.id)) === kpiPortfolioKey.value)) {
          kpiPortfolioKey.value = "ALL";
        }
      } catch (error) {
        dataError.value = error instanceof Error ? error.message : "Failed to load dashboard data";
      } finally {
        dataLoading.value = false;
      }
    }
    async function collectSnapshotNow() {
      collectingSnapshot.value = true;
      try {
        await collectSnapshots({ display_currency: displayCurrency.value });
        await loadDashboardData();
      } catch (error) {
        dataError.value = error instanceof Error ? error.message : "Failed to collect valuation snapshot";
      } finally {
        collectingSnapshot.value = false;
      }
    }
    onMounted(async () => {
      await ensureInitialized();
      await loadDashboardData();
    });
    watch(
      () => displayCurrency.value,
      (next, prev) => {
        if (summary.value && prev && next !== prev) {
          void loadDashboardData();
        }
      }
    );
    watch(
      () => treemapPortfolioKey.value,
      (next, prev) => {
        if (!summary.value) return;
        if (next !== prev) {
          void loadDashboardData();
        }
      }
    );
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[13] || (_cache[13] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300" }, "Dashboard"),
              _createElementVNode("h1", { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Dashboard Builder"),
              _createElementVNode("p", { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" }, " Allocation widgets + valuation snapshot trend are now connected to live analytics APIs. ")
            ], -1)),
            _createElementVNode("div", _hoisted_4, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: loadDashboardData
              }, _toDisplayString(dataLoading.value ? "Loading..." : "Refresh Data"), 1),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20",
                disabled: collectingSnapshot.value,
                onClick: collectSnapshotNow
              }, _toDisplayString(collectingSnapshot.value ? "Collecting..." : "Collect Snapshot"), 9, _hoisted_5),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[0] || (_cache[0] = ($event) => compareModalOpen.value = true)
              }, " Compare "),
              _cache[12] || (_cache[12] = _createElementVNode("button", {
                type: "button",
                class: "rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              }, " Save ", -1))
            ])
          ]),
          _createElementVNode("div", _hoisted_6, [
            _createElementVNode("span", {
              class: _normalizeClass([
                "rounded-full px-2 py-1 font-semibold",
                connectionStatus.value === "connected" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : connectionStatus.value === "error" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              ])
            }, " Data: " + _toDisplayString(connectionStatus.value), 3),
            _createElementVNode("span", _hoisted_7, " Holdings: " + _toDisplayString(holdings.value.length), 1),
            _createElementVNode("span", _hoisted_8, " Liabilities: " + _toDisplayString(liabilities.value.length), 1),
            _createElementVNode("span", _hoisted_9, " as_of: " + _toDisplayString(formatDateTime(summary.value?.as_of || null)), 1)
          ]),
          dataError.value ? (_openBlock(), _createElementBlock("p", _hoisted_10, "Error: " + _toDisplayString(dataError.value), 1)) : _createCommentVNode("", true),
          _createElementVNode("p", _hoisted_11, "Current editing dashboard: " + _toDisplayString(activeDashboardName.value), 1)
        ]),
        _createElementVNode("div", _hoisted_12, [
          _createElementVNode("aside", _hoisted_13, [
            _cache[15] || (_cache[15] = _createElementVNode("div", { class: "border-b border-slate-700 px-4 py-3" }, [
              _createElementVNode("p", { class: "text-sm font-semibold" }, "Toolbox"),
              _createElementVNode("p", { class: "mt-0.5 text-xs text-slate-400" }, "Double-click or drag widgets to canvas")
            ], -1)),
            _createElementVNode("div", _hoisted_14, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => search.value = $event),
                type: "text",
                placeholder: "Search toolbox",
                class: "w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 transition focus:ring-2"
              }, null, 512), [
                [_vModelText, search.value]
              ])
            ]),
            _createElementVNode("div", _hoisted_15, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(filteredSections.value, (section) => {
                return _openBlock(), _createElementBlock("section", {
                  key: section.title,
                  class: "mb-4"
                }, [
                  _createElementVNode("h2", _hoisted_16, _toDisplayString(section.title), 1),
                  _createElementVNode("div", _hoisted_17, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(section.items, (item) => {
                      return _openBlock(), _createElementBlock("button", {
                        key: item.type,
                        type: "button",
                        draggable: "true",
                        class: "flex w-full items-start gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-left hover:border-indigo-400 hover:bg-slate-800",
                        onDragstart: ($event) => onDragStart($event, item),
                        onDblclick: ($event) => addWidget(item)
                      }, [
                        _cache[14] || (_cache[14] = _createElementVNode("span", { class: "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded border border-slate-600 text-[10px] text-slate-300" }, " + ", -1)),
                        _createElementVNode("span", null, [
                          _createElementVNode("span", _hoisted_19, _toDisplayString(item.label), 1),
                          _createElementVNode("span", _hoisted_20, _toDisplayString(item.description), 1)
                        ])
                      ], 40, _hoisted_18);
                    }), 128))
                  ])
                ]);
              }), 128))
            ])
          ]),
          _createElementVNode("article", _hoisted_21, [
            _createElementVNode("div", {
              class: "min-h-[420px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/40",
              onDragover: _cache[5] || (_cache[5] = _withModifiers(() => {
              }, ["prevent"])),
              onDrop: _withModifiers(onDropCanvas, ["prevent"])
            }, [
              canvasWidgets.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_22, " Drag widgets from toolbox or double-click to add. ")) : (_openBlock(), _createElementBlock("div", _hoisted_23, [
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(canvasWidgets.value, (widget) => {
                  return _openBlock(), _createElementBlock("div", {
                    key: widget.id,
                    class: "rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  }, [
                    _createElementVNode("div", _hoisted_24, [
                      _createElementVNode("p", _hoisted_25, _toDisplayString(widget.label), 1),
                      _createElementVNode("button", {
                        type: "button",
                        class: "rounded-md border border-rose-300 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:border-rose-800 dark:text-rose-300",
                        onClick: ($event) => removeWidget(widget.id)
                      }, " Remove ", 8, _hoisted_26)
                    ]),
                    widget.type === "kpi_summary" ? (_openBlock(), _createElementBlock("div", _hoisted_27, [
                      _createElementVNode("div", _hoisted_28, [
                        _cache[16] || (_cache[16] = _createElementVNode("span", { class: "mr-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400" }, "KPI", -1)),
                        (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["SUMMARY", "PORTFOLIOS"], (mode) => {
                          return _createElementVNode("button", {
                            key: `dashboard-kpi-${mode}`,
                            type: "button",
                            class: _normalizeClass([
                              "rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors",
                              kpiTarget.value === mode ? "border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300" : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                            ]),
                            onClick: ($event) => kpiTarget.value = mode
                          }, _toDisplayString(mode), 11, _hoisted_29);
                        }), 64))
                      ]),
                      kpiTarget.value === "PORTFOLIOS" ? (_openBlock(), _createElementBlock("div", _hoisted_30, [
                        _cache[18] || (_cache[18] = _createElementVNode("label", { class: "text-[11px] font-semibold text-slate-600 dark:text-slate-300" }, "Portfolio", -1)),
                        _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => kpiPortfolioKey.value = $event),
                          class: "rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        }, [
                          _cache[17] || (_cache[17] = _createElementVNode("option", { value: "ALL" }, "All", -1)),
                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (item) => {
                            return _openBlock(), _createElementBlock("option", {
                              key: `dashboard-kpi-portfolio-${item.id}`,
                              value: String(item.id)
                            }, _toDisplayString(item.name), 9, _hoisted_31);
                          }), 128))
                        ], 512), [
                          [_vModelSelect, kpiPortfolioKey.value]
                        ])
                      ])) : _createCommentVNode("", true),
                      kpiTarget.value === "SUMMARY" ? (_openBlock(), _createBlock(_sfc_main$1, {
                        key: 1,
                        title: "KPI Summary",
                        subtitle: "Gross / Liabilities / Net",
                        currency: summaryDisplayCurrency.value,
                        "gross-assets-total": toNumber(summary.value?.gross_assets_total),
                        "liabilities-total": toNumber(summary.value?.liabilities_total),
                        "net-assets-total": toNumber(summary.value?.net_assets_total),
                        "invested-principal-total": toNumber(summary.value?.invested_principal_total),
                        "principal-minus-debt-total": toNumber(summary.value?.debt_adjusted_principal_total ?? summary.value?.principal_minus_debt_total),
                        "gross-return-pct": kpiGrossReturnPct.value,
                        "net-return-pct": kpiNetReturnPct.value,
                        "gross-profit-total": kpiGrossProfitTotal.value,
                        "net-profit-total": kpiNetProfitTotal.value,
                        "as-of": formatDateTime(summary.value?.as_of || null)
                      }, null, 8, ["currency", "gross-assets-total", "liabilities-total", "net-assets-total", "invested-principal-total", "principal-minus-debt-total", "gross-return-pct", "net-return-pct", "gross-profit-total", "net-profit-total", "as-of"])) : (_openBlock(), _createBlock(_sfc_main$2, {
                        key: 2,
                        title: "KPI Portfolios",
                        subtitle: "Per portfolio snapshot",
                        currency: summaryDisplayCurrency.value,
                        portfolios: kpiPortfolioRows.value
                      }, null, 8, ["currency", "portfolios"]))
                    ])) : widget.type === "donut_allocation" ? (_openBlock(), _createElementBlock("div", _hoisted_32, [
                      _createElementVNode("div", _hoisted_33, [
                        _createElementVNode("div", _hoisted_34, [
                          (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["GROSS", "LIABILITIES", "NET", "PORTFOLIOS"], (mode) => {
                            return _createElementVNode("button", {
                              key: mode,
                              type: "button",
                              class: _normalizeClass([
                                "rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors",
                                donutTarget.value === mode ? "border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300" : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                              ]),
                              onClick: ($event) => donutTarget.value = mode
                            }, _toDisplayString(mode), 11, _hoisted_35);
                          }), 64))
                        ]),
                        _cache[20] || (_cache[20] = _createElementVNode("div", { class: "mx-1 hidden h-4 w-px bg-slate-300 dark:bg-slate-700 sm:block" }, null, -1)),
                        _createElementVNode("div", _hoisted_36, [
                          _cache[19] || (_cache[19] = _createElementVNode("span", { class: "mr-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400" }, "Start", -1)),
                          (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["TOP", "RIGHT", "LEFT"], (pos) => {
                            return _createElementVNode("button", {
                              key: `donut-start-${pos}`,
                              type: "button",
                              class: _normalizeClass([
                                "rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors",
                                donutStartPosition.value === pos ? "border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300" : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                              ]),
                              onClick: ($event) => donutStartPosition.value = pos
                            }, _toDisplayString(pos), 11, _hoisted_37);
                          }), 64))
                        ])
                      ]),
                      donutTarget.value === "PORTFOLIOS" ? (_openBlock(), _createElementBlock("div", _hoisted_38, [
                        _cache[22] || (_cache[22] = _createElementVNode("label", { class: "text-[11px] font-semibold text-slate-600 dark:text-slate-300" }, "Portfolio", -1)),
                        _withDirectives(_createElementVNode("select", {
                          "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => treemapPortfolioKey.value = $event),
                          class: "rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                        }, [
                          _cache[21] || (_cache[21] = _createElementVNode("option", { value: "ALL" }, "All", -1)),
                          (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (item) => {
                            return _openBlock(), _createElementBlock("option", {
                              key: `donut-${item.id}`,
                              value: String(item.id)
                            }, _toDisplayString(item.name), 9, _hoisted_39);
                          }), 128))
                        ], 512), [
                          [_vModelSelect, treemapPortfolioKey.value]
                        ])
                      ])) : _createCommentVNode("", true),
                      _createVNode(_sfc_main$3, {
                        title: `Allocation | ${donutTarget.value}`,
                        subtitle: donutTarget.value === "PORTFOLIOS" ? `HOLDINGS by ${treemapPortfolioLabel.value}` : "Top N + Others (grouped by Portfolio)",
                        currency: summaryDisplayCurrency.value,
                        total: toNumber(donutData.value?.total),
                        items: donutItems.value,
                        "start-position": donutStartPosition.value
                      }, null, 8, ["title", "subtitle", "currency", "total", "items", "start-position"])
                    ])) : widget.type === "treemap_holdings" ? (_openBlock(), _createElementBlock("div", _hoisted_40, [
                      _createElementVNode("div", _hoisted_41, [
                        _createElementVNode("div", _hoisted_42, [
                          (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["GROSS", "PORTFOLIOS"], (mode) => {
                            return _createElementVNode("button", {
                              key: `treemap-${mode}`,
                              type: "button",
                              class: _normalizeClass([
                                "rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors",
                                treemapTarget.value === mode ? "border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300" : "border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
                              ]),
                              onClick: ($event) => treemapTarget.value = mode
                            }, _toDisplayString(mode), 11, _hoisted_43);
                          }), 64))
                        ]),
                        treemapTarget.value === "PORTFOLIOS" ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
                          _cache[24] || (_cache[24] = _createElementVNode("label", { class: "text-[11px] font-semibold text-slate-600 dark:text-slate-300" }, "Portfolio", -1)),
                          _withDirectives(_createElementVNode("select", {
                            "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => treemapPortfolioKey.value = $event),
                            class: "rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                          }, [
                            _cache[23] || (_cache[23] = _createElementVNode("option", { value: "ALL" }, "All", -1)),
                            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (item) => {
                              return _openBlock(), _createElementBlock("option", {
                                key: item.id,
                                value: String(item.id)
                              }, _toDisplayString(item.name), 9, _hoisted_44);
                            }), 128))
                          ], 512), [
                            [_vModelSelect, treemapPortfolioKey.value]
                          ])
                        ], 64)) : _createCommentVNode("", true)
                      ]),
                      _createVNode(_sfc_main$4, {
                        title: "Holdings Treemap",
                        subtitle: treemapTarget.value === "GROSS" ? "Target=GROSS | group_by=PORTFOLIO" : `Target=HOLDINGS | group_by=ASSET | ${treemapPortfolioLabel.value}`,
                        currency: summaryDisplayCurrency.value,
                        items: holdingsTreemapItems.value
                      }, null, 8, ["subtitle", "currency", "items"])
                    ])) : widget.type === "networth_line" ? (_openBlock(), _createElementBlock("div", _hoisted_45, [
                      _createVNode(_sfc_main$5, {
                        title: "Networth Line",
                        subtitle: "valuation_snapshots | bucket=DAY",
                        currency: summaryDisplayCurrency.value,
                        points: trendPoints.value
                      }, null, 8, ["currency", "points"])
                    ])) : widget.type === "dividend_bar_monthly" ? (_openBlock(), _createElementBlock("div", _hoisted_46, " Dividend monthly widget is a planned MVP+ item. ")) : (_openBlock(), _createElementBlock("div", _hoisted_47, " Market board widget is ready for market API binding. "))
                  ]);
                }), 128))
              ]))
            ], 32)
          ])
        ]),
        compareModalOpen.value ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _cache[11] || (_cache[11] = _withModifiers(($event) => compareModalOpen.value = false, ["self"]))
        }, [
          _createElementVNode("section", _hoisted_48, [
            _createElementVNode("div", _hoisted_49, [
              _cache[25] || (_cache[25] = _createElementVNode("h2", { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Dashboard Compare", -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700",
                onClick: _cache[6] || (_cache[6] = ($event) => compareModalOpen.value = false)
              }, " Close ")
            ]),
            _createElementVNode("div", _hoisted_50, [
              _createElementVNode("label", _hoisted_51, [
                _cache[26] || (_cache[26] = _createElementVNode("span", { class: "mb-1 block font-medium text-slate-700 dark:text-slate-200" }, "Left", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => compare.left = $event),
                  class: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(dashboardPresets, (preset) => {
                    return _createElementVNode("option", {
                      key: preset.id,
                      value: preset.id
                    }, _toDisplayString(preset.name), 9, _hoisted_52);
                  }), 64))
                ], 512), [
                  [_vModelSelect, compare.left]
                ])
              ]),
              _createElementVNode("label", _hoisted_53, [
                _cache[27] || (_cache[27] = _createElementVNode("span", { class: "mb-1 block font-medium text-slate-700 dark:text-slate-200" }, "Right", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => compare.right = $event),
                  class: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(dashboardPresets, (preset) => {
                    return _createElementVNode("option", {
                      key: preset.id,
                      value: preset.id
                    }, _toDisplayString(preset.name), 9, _hoisted_54);
                  }), 64))
                ], 512), [
                  [_vModelSelect, compare.right]
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_55, [
              _createElementVNode("table", _hoisted_56, [
                _cache[28] || (_cache[28] = _createElementVNode("thead", { class: "bg-slate-50 dark:bg-slate-800" }, [
                  _createElementVNode("tr", null, [
                    _createElementVNode("th", { class: "px-3 py-2" }, "Widget"),
                    _createElementVNode("th", { class: "px-3 py-2" }, "Left"),
                    _createElementVNode("th", { class: "px-3 py-2" }, "Right")
                  ])
                ], -1)),
                _createElementVNode("tbody", null, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(compareRows.value, (row) => {
                    return _openBlock(), _createElementBlock("tr", {
                      key: row.type,
                      class: "border-t border-slate-200 dark:border-slate-700"
                    }, [
                      _createElementVNode("td", _hoisted_57, _toDisplayString(row.type), 1),
                      _createElementVNode("td", _hoisted_58, _toDisplayString(row.left ? "O" : "-"), 1),
                      _createElementVNode("td", _hoisted_59, _toDisplayString(row.right ? "O" : "-"), 1)
                    ]);
                  }), 128))
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_60, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700",
                onClick: _cache[9] || (_cache[9] = ($event) => {
                  buildWidgetsFromPreset(compare.left);
                  compareModalOpen.value = false;
                })
              }, " Apply Left "),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500",
                onClick: _cache[10] || (_cache[10] = ($event) => {
                  buildWidgetsFromPreset(compare.right);
                  compareModalOpen.value = false;
                })
              }, " Apply Right ")
            ])
          ])
        ])) : _createCommentVNode("", true)
      ]);
    };
  }
});

export { _sfc_main as default };
