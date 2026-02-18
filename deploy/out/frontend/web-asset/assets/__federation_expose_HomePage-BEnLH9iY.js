import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { g as getSummary } from './analytics-nG83f7RO.js';
import { _ as _sfc_main$2 } from './KpiBreakdownCards.vue_vue_type_script_setup_true_lang-Dopz1oEc.js';
import { u as useDisplayCurrency, _ as _sfc_main$1, g as getLiabilitiesTable } from './useDisplayCurrency-BZ-Ikfwn.js';
import { g as getHoldingsPerformance } from './holdings-0W50Tt_V.js';
import { g as getPortfoliosTable } from './portfolios-BgDo5vhb.js';
import { g as getReleaseNotes } from './releaseNotes-BlDYVT2V.js';

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,unref:_unref,createVNode:_createVNode,toDisplayString:_toDisplayString,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,renderList:_renderList,Fragment:_Fragment,createTextVNode:_createTextVNode,normalizeClass:_normalizeClass} = await importShared('vue');

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
const _hoisted_8 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_9 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_10 = {
  key: 1,
  class: "grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3"
};
const _hoisted_11 = { class: "flex items-center justify-between gap-2" };
const _hoisted_12 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_13 = { class: "text-xs font-normal text-slate-500" };
const _hoisted_14 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_15 = { class: "mt-1 text-[11px] text-slate-500 dark:text-slate-400" };
const _hoisted_16 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-2" };
const _hoisted_17 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_18 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_19 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_20 = { class: "flex items-center justify-between gap-2" };
const _hoisted_21 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_22 = { class: "text-xs font-normal text-slate-500" };
const _hoisted_23 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_24 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_25 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_26 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_27 = { class: "flex items-center justify-between gap-2" };
const _hoisted_28 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_29 = { class: "text-xs text-slate-500" };
const _hoisted_30 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_31 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_32 = { class: "mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200" };
const _hoisted_33 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_34 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_35 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_36 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_37 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_38 = { class: "text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_39 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_40 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const {computed,onMounted,ref,watch} = await importShared('vue');
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
    const portfolios = ref([]);
    const releaseNoteItems = ref([]);
    const { displayCurrency, settingsSaving, ensureInitialized, setDisplayCurrency } = useDisplayCurrency();
    const summaryDisplayCurrency = computed(() => summary.value?.display_currency ?? displayCurrency.value);
    const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
    const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
    const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
    const investedPrincipalTotal = computed(() => toNumber(summary.value?.invested_principal_total));
    const principalMinusDebtTotal = computed(() => toNumber(summary.value?.principal_minus_debt_total));
    const netAssetsReturnPct = computed(() => toNumber(summary.value?.net_assets_return_pct ?? null));
    const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
    const principalProfitTotal = computed(() => toNumber(summary.value?.principal_profit_total ?? grossAssetsTotal.value - investedPrincipalTotal.value));
    const netAssetsProfitTotal = computed(() => toNumber(summary.value?.net_assets_profit_total ?? netAssetsTotal.value - principalMinusDebtTotal.value));
    const asOf = computed(() => formatDateTime(summary.value?.as_of));
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
        const [summaryOut, holdingsOut, liabilitiesOut, portfoliosOut] = await Promise.all([
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
        try {
          const noteRows = await getReleaseNotes({ limit: 20 });
          const mapped = mapReleaseNotes(noteRows);
          releaseNoteItems.value = mapped;
        } catch {
          releaseNoteItems.value = [];
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errorMessage.value = `Failed to load dashboard data: ${message}`;
      } finally {
        loading.value = false;
      }
    }
    async function onChangeDisplayCurrency(value) {
      try {
        await setDisplayCurrency(value);
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errorMessage.value = `Failed to update display currency: ${message}`;
      }
    }
    onMounted(async () => {
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
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[0] || (_cache[0] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300" }, "Home"),
              _createElementVNode("h1", { class: "mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Live Dashboard"),
              _createElementVNode("p", { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" }, " This page now uses real API data from summary, holdings performance, and liabilities. ")
            ], -1)),
            _createElementVNode("div", _hoisted_4, [
              _createVNode(_sfc_main$1, {
                "model-value": _unref(displayCurrency),
                disabled: loading.value || _unref(settingsSaving),
                loading: _unref(settingsSaving),
                "onUpdate:modelValue": onChangeDisplayCurrency
              }, null, 8, ["model-value", "disabled", "loading"]),
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
        _createVNode(_sfc_main$2, {
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
          liabilities: liabilities.value
        }, null, 8, ["display-currency", "gross-assets-total", "liabilities-total", "net-assets-total", "invested-principal-total", "principal-minus-debt-total", "principal-return-pct", "net-assets-return-pct", "principal-profit-total", "net-assets-profit-total", "portfolios", "liabilities"]),
        _createElementVNode("article", _hoisted_8, [
          _cache[1] || (_cache[1] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
            _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Portfolios"),
            _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By gross assets")
          ], -1)),
          topPortfolios.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_9, " No portfolio data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_10, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topPortfolios.value, (item) => {
              return _openBlock(), _createElementBlock("li", {
                key: item.id,
                class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
              }, [
                _createElementVNode("div", _hoisted_11, [
                  _createElementVNode("p", _hoisted_12, [
                    _createTextVNode(_toDisplayString(item.name) + " ", 1),
                    _createElementVNode("span", _hoisted_13, _toDisplayString(item.type), 1)
                  ]),
                  _createElementVNode("p", {
                    class: _normalizeClass(["text-xs font-semibold", item.total_return_pct == null ? "text-slate-500" : toNumber(item.total_return_pct) >= 0 ? "text-emerald-600" : "text-rose-500"])
                  }, _toDisplayString(formatPercent(item.total_return_pct == null ? null : toNumber(item.total_return_pct))), 3)
                ]),
                _createElementVNode("div", _hoisted_14, _toDisplayString(formatCurrency(toNumber(item.gross_assets_total), item.base_currency || summaryDisplayCurrency.value)) + " / " + _toDisplayString(formatCurrency(toNumber(item.cumulative_deposit_amount), item.base_currency || summaryDisplayCurrency.value)), 1),
                _createElementVNode("div", _hoisted_15, " Net " + _toDisplayString(formatCurrency(toNumber(item.net_assets_total), item.base_currency || summaryDisplayCurrency.value)) + " · PnL " + _toDisplayString(formatSignedCurrency(toNumber(item.total_pnl_amount), item.base_currency || summaryDisplayCurrency.value)), 1)
              ]);
            }), 128))
          ]))
        ]),
        _createElementVNode("div", _hoisted_16, [
          _createElementVNode("article", _hoisted_17, [
            _cache[2] || (_cache[2] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
              _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Holdings"),
              _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By evaluated amount")
            ], -1)),
            topHoldings.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_18, " No holdings data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_19, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topHoldings.value, (item) => {
                return _openBlock(), _createElementBlock("li", {
                  key: item.holding_id,
                  class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                }, [
                  _createElementVNode("div", _hoisted_20, [
                    _createElementVNode("p", _hoisted_21, [
                      _createTextVNode(_toDisplayString(item.asset_name) + " ", 1),
                      _createElementVNode("span", _hoisted_22, _toDisplayString(item.asset_symbol || "-"), 1)
                    ]),
                    _createElementVNode("p", {
                      class: _normalizeClass(["text-xs font-semibold", toNumber(item.pnl_pct) >= 0 ? "text-emerald-600" : "text-rose-500"])
                    }, _toDisplayString(formatPercent(toNumber(item.pnl_pct))), 3)
                  ]),
                  _createElementVNode("div", _hoisted_23, _toDisplayString(formatOptionalCurrency(item.current_price, item.current_price_currency || summaryDisplayCurrency.value)) + " / " + _toDisplayString(formatOptionalCurrency(item.avg_price, item.current_price_currency || summaryDisplayCurrency.value)), 1)
                ]);
              }), 128))
            ]))
          ]),
          _createElementVNode("article", _hoisted_24, [
            _cache[3] || (_cache[3] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
              _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Liabilities"),
              _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By outstanding balance")
            ], -1)),
            topLiabilities.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_25, " No liabilities data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_26, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topLiabilities.value, (item) => {
                return _openBlock(), _createElementBlock("li", {
                  key: item.id,
                  class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                }, [
                  _createElementVNode("div", _hoisted_27, [
                    _createElementVNode("p", _hoisted_28, _toDisplayString(item.name), 1),
                    _createElementVNode("p", _hoisted_29, _toDisplayString(item.liability_type), 1)
                  ]),
                  _createElementVNode("div", _hoisted_30, _toDisplayString(formatCurrency(toNumber(item.outstanding_balance), item.currency || summaryDisplayCurrency.value)), 1)
                ]);
              }), 128))
            ]))
          ])
        ]),
        _createElementVNode("article", _hoisted_31, [
          _cache[4] || (_cache[4] = _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Quick Insight", -1)),
          _createElementVNode("ul", _hoisted_32, [
            _createElementVNode("li", _hoisted_33, " Scope: " + _toDisplayString(summary.value?.scope_type || "-") + " (users: " + _toDisplayString(summary.value?.user_count || 0) + ") ", 1),
            _createElementVNode("li", _hoisted_34, " Best PnL assets: " + _toDisplayString(topPnlAssets.value.map((item) => item.asset_symbol || item.asset_name).join(", ") || "-"), 1)
          ])
        ]),
        _createElementVNode("article", _hoisted_35, [
          _cache[5] || (_cache[5] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
            _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Release Notes"),
            _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Latest first")
          ], -1)),
          releaseNoteItems.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_36, " No release notes yet. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_37, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(releaseNoteItems.value, (note) => {
              return _openBlock(), _createElementBlock("li", {
                key: note.id,
                class: "rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
              }, [
                _createElementVNode("p", _hoisted_38, _toDisplayString(formatDateTime(note.releasedAt)), 1),
                _createElementVNode("p", _hoisted_39, _toDisplayString(note.title), 1),
                _createElementVNode("p", _hoisted_40, _toDisplayString(note.summary), 1)
              ]);
            }), 128))
          ]))
        ])
      ]);
    };
  }
});

export { _sfc_main as default };
