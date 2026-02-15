import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { g as getSummary, a as getHoldingsPerformance, b as getLiabilities } from './liabilities-D0kItOXj.js';

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,normalizeClass:_normalizeClass,renderList:_renderList,Fragment:_Fragment,createTextVNode:_createTextVNode} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_4 = ["disabled"];
const _hoisted_5 = { class: "mt-3 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_6 = {
  key: 0,
  class: "rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_7 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-3" };
const _hoisted_8 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_9 = { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" };
const _hoisted_10 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_11 = { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" };
const _hoisted_12 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_13 = { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" };
const _hoisted_14 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-2" };
const _hoisted_15 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_16 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_17 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_18 = { class: "flex items-center justify-between gap-2" };
const _hoisted_19 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_20 = { class: "text-xs font-normal text-slate-500" };
const _hoisted_21 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_22 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_23 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_24 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_25 = { class: "flex items-center justify-between gap-2" };
const _hoisted_26 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_27 = { class: "text-xs text-slate-500" };
const _hoisted_28 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_29 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_30 = { class: "mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200" };
const _hoisted_31 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_32 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const {computed,onMounted,ref} = await importShared('vue');
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
    function formatPercent(value) {
      if (value == null || !Number.isFinite(value)) {
        return "-";
      }
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    function formatDateTime(value) {
      if (!value) {
        return "-";
      }
      const dt = new Date(value);
      if (Number.isNaN(dt.getTime())) {
        return value;
      }
      return dt.toLocaleString("ko-KR");
    }
    const loading = ref(false);
    const errorMessage = ref("");
    const summary = ref(null);
    const holdings = ref([]);
    const liabilities = ref([]);
    const displayCurrency = computed(() => summary.value?.display_currency ?? "KRW");
    const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
    const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
    const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
    const grossAssetsReturnPct = computed(() => toNumber(summary.value?.gross_assets_return_pct ?? null));
    const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
    const asOf = computed(() => formatDateTime(summary.value?.as_of));
    const topHoldings = computed(
      () => [...holdings.value].sort((a, b) => toNumber(b.evaluated_amount) - toNumber(a.evaluated_amount)).slice(0, 6)
    );
    const topLiabilities = computed(
      () => [...liabilities.value].sort((a, b) => toNumber(b.outstanding_balance) - toNumber(a.outstanding_balance)).slice(0, 6)
    );
    const topPnlAssets = computed(
      () => [...holdings.value].filter((item) => item.pnl_pct != null).sort((a, b) => toNumber(b.pnl_pct) - toNumber(a.pnl_pct)).slice(0, 3)
    );
    async function loadHomeData() {
      loading.value = true;
      errorMessage.value = "";
      try {
        const [summaryOut, holdingsOut, liabilitiesOut] = await Promise.all([
          getSummary(),
          getHoldingsPerformance(),
          getLiabilities()
        ]);
        summary.value = summaryOut;
        holdings.value = holdingsOut;
        liabilities.value = liabilitiesOut;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errorMessage.value = `Failed to load dashboard data: ${message}`;
      } finally {
        loading.value = false;
      }
    }
    onMounted(loadHomeData);
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[0] || (_cache[0] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300" }, "Home"),
              _createElementVNode("h1", { class: "mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Live Dashboard"),
              _createElementVNode("p", { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" }, " This page now uses real API data from summary, holdings performance, and liabilities. ")
            ], -1)),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              disabled: loading.value,
              onClick: loadHomeData
            }, _toDisplayString(loading.value ? "Loading..." : "Refresh"), 9, _hoisted_4)
          ]),
          _createElementVNode("p", _hoisted_5, "as_of: " + _toDisplayString(asOf.value), 1)
        ]),
        errorMessage.value ? (_openBlock(), _createElementBlock("article", _hoisted_6, [
          _createElementVNode("p", null, _toDisplayString(errorMessage.value), 1),
          _createElementVNode("button", {
            type: "button",
            class: "mt-2 rounded-lg border border-rose-300 px-3 py-1 text-xs font-semibold transition-colors hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/60",
            onClick: loadHomeData
          }, " Retry ")
        ])) : _createCommentVNode("", true),
        _createElementVNode("div", _hoisted_7, [
          _createElementVNode("article", _hoisted_8, [
            _cache[1] || (_cache[1] = _createElementVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Gross Assets (assets + liabilities)", -1)),
            _createElementVNode("p", _hoisted_9, _toDisplayString(formatCurrency(grossAssetsTotal.value, displayCurrency.value)), 1),
            _createElementVNode("p", {
              class: _normalizeClass(["mt-2 text-sm font-semibold", grossAssetsReturnPct.value >= 0 ? "text-emerald-600" : "text-rose-500"])
            }, _toDisplayString(formatPercent(grossAssetsReturnPct.value)) + " vs principal + debt ", 3)
          ]),
          _createElementVNode("article", _hoisted_10, [
            _cache[2] || (_cache[2] = _createElementVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Net Assets", -1)),
            _createElementVNode("p", _hoisted_11, _toDisplayString(formatCurrency(netAssetsTotal.value, displayCurrency.value)), 1),
            _createElementVNode("p", {
              class: _normalizeClass(["mt-2 text-sm font-semibold", principalReturnPct.value >= 0 ? "text-emerald-600" : "text-rose-500"])
            }, _toDisplayString(formatPercent(principalReturnPct.value)) + " vs invested principal ", 3)
          ]),
          _createElementVNode("article", _hoisted_12, [
            _cache[3] || (_cache[3] = _createElementVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Liabilities", -1)),
            _createElementVNode("p", _hoisted_13, _toDisplayString(formatCurrency(liabilitiesTotal.value, displayCurrency.value)), 1),
            _cache[4] || (_cache[4] = _createElementVNode("p", { class: "mt-2 text-sm text-slate-600 dark:text-slate-300" }, "Included liabilities only", -1))
          ])
        ]),
        _createElementVNode("div", _hoisted_14, [
          _createElementVNode("article", _hoisted_15, [
            _cache[5] || (_cache[5] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
              _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Holdings"),
              _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By evaluated amount")
            ], -1)),
            topHoldings.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_16, " No holdings data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_17, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topHoldings.value, (item) => {
                return _openBlock(), _createElementBlock("li", {
                  key: item.holding_id,
                  class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                }, [
                  _createElementVNode("div", _hoisted_18, [
                    _createElementVNode("p", _hoisted_19, [
                      _createTextVNode(_toDisplayString(item.asset_name) + " ", 1),
                      _createElementVNode("span", _hoisted_20, _toDisplayString(item.asset_symbol || "-"), 1)
                    ]),
                    _createElementVNode("p", {
                      class: _normalizeClass(["text-xs font-semibold", toNumber(item.pnl_pct) >= 0 ? "text-emerald-600" : "text-rose-500"])
                    }, _toDisplayString(formatPercent(toNumber(item.pnl_pct))), 3)
                  ]),
                  _createElementVNode("div", _hoisted_21, _toDisplayString(formatCurrency(toNumber(item.evaluated_amount), displayCurrency.value)), 1)
                ]);
              }), 128))
            ]))
          ]),
          _createElementVNode("article", _hoisted_22, [
            _cache[6] || (_cache[6] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
              _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Liabilities"),
              _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By outstanding balance")
            ], -1)),
            topLiabilities.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_23, " No liabilities data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_24, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topLiabilities.value, (item) => {
                return _openBlock(), _createElementBlock("li", {
                  key: item.id,
                  class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                }, [
                  _createElementVNode("div", _hoisted_25, [
                    _createElementVNode("p", _hoisted_26, _toDisplayString(item.name), 1),
                    _createElementVNode("p", _hoisted_27, _toDisplayString(item.liability_type), 1)
                  ]),
                  _createElementVNode("div", _hoisted_28, _toDisplayString(formatCurrency(toNumber(item.outstanding_balance), item.currency || displayCurrency.value)), 1)
                ]);
              }), 128))
            ]))
          ])
        ]),
        _createElementVNode("article", _hoisted_29, [
          _cache[7] || (_cache[7] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Quick Insight", -1)),
          _createElementVNode("ul", _hoisted_30, [
            _createElementVNode("li", _hoisted_31, " Scope: " + _toDisplayString(summary.value?.scope_type || "-") + " (users: " + _toDisplayString(summary.value?.user_count || 0) + ") ", 1),
            _createElementVNode("li", _hoisted_32, " Best PnL assets: " + _toDisplayString(topPnlAssets.value.map((item) => item.asset_symbol || item.asset_name).join(", ") || "-"), 1)
          ])
        ])
      ]);
    };
  }
});

export { _sfc_main as default };
