import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, f as formatDateTimeSeoul, A as AxiosError } from './datetime-D3NoeBy6.js';
import { d as getQuickInsight } from './ui-DnZ8IxrZ.js';

const {defineComponent:_defineComponent$4} = await importShared('vue');

const {toDisplayString:_toDisplayString$4,createElementVNode:_createElementVNode$4,renderSlot:_renderSlot,openBlock:_openBlock$4,createElementBlock:_createElementBlock$4,createCommentVNode:_createCommentVNode$4} = await importShared('vue');

const _hoisted_1$4 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2$4 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_3$4 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4$4 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_5$4 = {
  key: 0,
  class: "mt-4 space-y-3"
};
const _hoisted_6$4 = {
  key: 1,
  class: "mt-3 text-xs text-slate-500 dark:text-slate-400"
};
const _sfc_main$4 = /* @__PURE__ */ _defineComponent$4({
  __name: "DashboardPanelContainer",
  props: {
    title: {},
    description: {},
    sourceMode: { default: "LIVE" },
    expanded: { type: Boolean },
    collapsedMessage: { default: "Collapsed. Click Expand to preview dashboard widgets." }
  },
  emits: ["toggle"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    return (_ctx, _cache) => {
      return _openBlock$4(), _createElementBlock$4("article", _hoisted_1$4, [
        _createElementVNode$4("div", _hoisted_2$4, [
          _createElementVNode$4("div", null, [
            _createElementVNode$4("h2", _hoisted_3$4, _toDisplayString$4(props.title), 1),
            _createElementVNode$4("p", _hoisted_4$4, _toDisplayString$4(props.description), 1)
          ]),
          _createElementVNode$4("button", {
            type: "button",
            class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
            onClick: _cache[0] || (_cache[0] = ($event) => emit("toggle"))
          }, _toDisplayString$4(props.expanded ? "Collapse" : "Expand"), 1)
        ]),
        props.expanded ? (_openBlock$4(), _createElementBlock$4("div", _hoisted_5$4, [
          _renderSlot(_ctx.$slots, "controls"),
          _renderSlot(_ctx.$slots, "default")
        ])) : (_openBlock$4(), _createElementBlock$4("p", _hoisted_6$4, _toDisplayString$4(props.collapsedMessage), 1))
      ]);
    };
  }
});

const {defineComponent:_defineComponent$3} = await importShared('vue');

const {toDisplayString:_toDisplayString$3,createElementVNode:_createElementVNode$3,openBlock:_openBlock$3,createElementBlock:_createElementBlock$3,createCommentVNode:_createCommentVNode$3,renderList:_renderList$3,Fragment:_Fragment$3,normalizeStyle:_normalizeStyle$3,normalizeClass:_normalizeClass$2} = await importShared('vue');

const _hoisted_1$3 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2$3 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_3$3 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4$3 = { class: "text-sm text-slate-500 dark:text-slate-400" };
const _hoisted_5$3 = { class: "flex flex-wrap items-center gap-2 text-xs" };
const _hoisted_6$3 = {
  key: 0,
  class: "inline-flex items-center gap-1 text-slate-600 dark:text-slate-300"
};
const _hoisted_7$3 = ["checked"];
const _hoisted_8$3 = ["value"];
const _hoisted_9$3 = ["value"];
const _hoisted_10$3 = { class: "mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700" };
const _hoisted_11$3 = { class: "min-w-[880px] text-xs" };
const _hoisted_12$3 = { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_13$3 = { class: "sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800" };
const _hoisted_14$3 = { class: "px-3 py-2 text-right" };
const _hoisted_15$3 = { class: "px-3 py-2 text-right" };
const _hoisted_16$3 = { class: "px-3 py-2 text-right" };
const _hoisted_17$3 = { class: "px-3 py-2 text-right" };
const _hoisted_18$3 = { key: 0 };
const _hoisted_19$3 = { key: 1 };
const _hoisted_20$3 = { class: "sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900" };
const _hoisted_21$3 = { class: "font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_22$3 = { class: "text-[11px] text-slate-500 dark:text-slate-400" };
const _hoisted_23$3 = { class: "px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_24$3 = { class: "px-3 py-2 text-right text-slate-700 dark:text-slate-300" };
const _hoisted_25$2 = { class: "mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_26$2 = { class: "inline-flex items-center gap-2" };
const _hoisted_27$2 = ["disabled"];
const _hoisted_28$2 = ["disabled"];
const _hoisted_29$2 = {
  key: 1,
  class: "mt-3 text-sm text-slate-500 dark:text-slate-400"
};
const {computed: computed$4} = await importShared('vue');

const _sfc_main$3 = /* @__PURE__ */ _defineComponent$3({
  __name: "PortfolioStatusTableCard",
  props: {
    title: {},
    subtitle: {},
    expanded: { type: Boolean },
    loading: { type: Boolean },
    rows: {},
    total: {},
    page: {},
    pageSize: {},
    sortBy: {},
    sortOrder: {},
    currency: {},
    maskAmounts: { type: Boolean },
    showFilter: { type: Boolean, default: false },
    portfolioKey: { default: "ALL" },
    portfolioOptions: { default: () => [] }
  },
  emits: ["toggle", "sort", "set-page", "select-all", "set-portfolio-key"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: (currency || "KRW").toUpperCase(),
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    function formatPercent(value) {
      if (value == null || !Number.isFinite(value)) return "-";
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    function sortMark(key) {
      if (props.sortBy !== key) return "↕";
      return props.sortOrder === "asc" ? "↑" : "↓";
    }
    const maxPage = computed$4(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
    const maskStyle = computed$4(() => props.maskAmounts ? { filter: "blur(6px)" } : void 0);
    return (_ctx, _cache) => {
      return _openBlock$3(), _createElementBlock$3("article", _hoisted_1$3, [
        _createElementVNode$3("div", _hoisted_2$3, [
          _createElementVNode$3("div", null, [
            _createElementVNode$3("h2", _hoisted_3$3, _toDisplayString$3(__props.title), 1),
            _createElementVNode$3("p", _hoisted_4$3, _toDisplayString$3(__props.subtitle), 1)
          ]),
          _createElementVNode$3("div", _hoisted_5$3, [
            __props.showFilter && __props.expanded ? (_openBlock$3(), _createElementBlock$3("label", _hoisted_6$3, [
              _createElementVNode$3("input", {
                type: "checkbox",
                checked: __props.portfolioKey === "ALL",
                class: "h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500",
                onChange: _cache[0] || (_cache[0] = ($event) => emit("select-all"))
              }, null, 40, _hoisted_7$3),
              _cache[10] || (_cache[10] = _createElementVNode$3("span", null, "All", -1))
            ])) : _createCommentVNode$3("", true),
            __props.showFilter && __props.expanded ? (_openBlock$3(), _createElementBlock$3("select", {
              key: 1,
              value: __props.portfolioKey,
              class: "rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
              onChange: _cache[1] || (_cache[1] = ($event) => emit("set-portfolio-key", $event.target.value))
            }, [
              _cache[11] || (_cache[11] = _createElementVNode$3("option", { value: "ALL" }, "All portfolios", -1)),
              (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(__props.portfolioOptions, (item) => {
                return _openBlock$3(), _createElementBlock$3("option", {
                  key: `table-portfolio-${item.key}`,
                  value: item.key
                }, _toDisplayString$3(item.label), 9, _hoisted_9$3);
              }), 128))
            ], 40, _hoisted_8$3)) : _createCommentVNode$3("", true),
            _createElementVNode$3("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              onClick: _cache[2] || (_cache[2] = ($event) => emit("toggle"))
            }, _toDisplayString$3(__props.expanded ? "Collapse" : "Expand"), 1)
          ])
        ]),
        __props.expanded ? (_openBlock$3(), _createElementBlock$3(_Fragment$3, { key: 0 }, [
          _createElementVNode$3("div", _hoisted_10$3, [
            _createElementVNode$3("table", _hoisted_11$3, [
              _createElementVNode$3("thead", _hoisted_12$3, [
                _createElementVNode$3("tr", null, [
                  _createElementVNode$3("th", _hoisted_13$3, [
                    _createElementVNode$3("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[3] || (_cache[3] = ($event) => emit("sort", "portfolio"))
                    }, " Portfolio " + _toDisplayString$3(sortMark("portfolio")), 1)
                  ]),
                  _createElementVNode$3("th", _hoisted_14$3, [
                    _createElementVNode$3("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[4] || (_cache[4] = ($event) => emit("sort", "current"))
                    }, " Current " + _toDisplayString$3(sortMark("current")), 1)
                  ]),
                  _createElementVNode$3("th", _hoisted_15$3, [
                    _createElementVNode$3("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[5] || (_cache[5] = ($event) => emit("sort", "invested_principal"))
                    }, " Invested " + _toDisplayString$3(sortMark("invested_principal")), 1)
                  ]),
                  _createElementVNode$3("th", _hoisted_16$3, [
                    _createElementVNode$3("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[6] || (_cache[6] = ($event) => emit("sort", "portfolio_profit"))
                    }, " Profit " + _toDisplayString$3(sortMark("portfolio_profit")), 1)
                  ]),
                  _createElementVNode$3("th", _hoisted_17$3, [
                    _createElementVNode$3("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[7] || (_cache[7] = ($event) => emit("sort", "return"))
                    }, " Return " + _toDisplayString$3(sortMark("return")), 1)
                  ])
                ])
              ]),
              _createElementVNode$3("tbody", null, [
                __props.loading ? (_openBlock$3(), _createElementBlock$3("tr", _hoisted_18$3, [..._cache[12] || (_cache[12] = [
                  _createElementVNode$3("td", {
                    colspan: "5",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "Loading portfolios...", -1)
                ])])) : __props.rows.length === 0 ? (_openBlock$3(), _createElementBlock$3("tr", _hoisted_19$3, [..._cache[13] || (_cache[13] = [
                  _createElementVNode$3("td", {
                    colspan: "5",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "No portfolio rows.", -1)
                ])])) : _createCommentVNode$3("", true),
                (_openBlock$3(true), _createElementBlock$3(_Fragment$3, null, _renderList$3(__props.rows, (row) => {
                  return _openBlock$3(), _createElementBlock$3("tr", {
                    key: `p-${row.id}`,
                    class: "border-t border-slate-200 dark:border-slate-800"
                  }, [
                    _createElementVNode$3("td", _hoisted_20$3, [
                      _createElementVNode$3("p", _hoisted_21$3, _toDisplayString$3(row.name), 1),
                      _createElementVNode$3("p", _hoisted_22$3, _toDisplayString$3(row.type || "-"), 1)
                    ]),
                    _createElementVNode$3("td", _hoisted_23$3, [
                      _createElementVNode$3("span", {
                        style: _normalizeStyle$3(maskStyle.value)
                      }, _toDisplayString$3(formatCurrency(row.current, __props.currency)), 5)
                    ]),
                    _createElementVNode$3("td", _hoisted_24$3, [
                      _createElementVNode$3("span", {
                        style: _normalizeStyle$3(maskStyle.value)
                      }, _toDisplayString$3(formatCurrency(row.invested, __props.currency)), 5)
                    ]),
                    _createElementVNode$3("td", {
                      class: _normalizeClass$2(["px-3 py-2 text-right font-semibold", row.profit >= 0 ? "text-emerald-500" : "text-rose-500"])
                    }, [
                      _createElementVNode$3("span", {
                        style: _normalizeStyle$3(maskStyle.value)
                      }, _toDisplayString$3(row.profit >= 0 ? "+" : "") + _toDisplayString$3(formatCurrency(row.profit, __props.currency)), 5)
                    ], 2),
                    _createElementVNode$3("td", {
                      class: _normalizeClass$2(["px-3 py-2 text-right font-semibold", (row.returnPct ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"])
                    }, _toDisplayString$3(formatPercent(row.returnPct)), 3)
                  ]);
                }), 128))
              ])
            ])
          ]),
          _createElementVNode$3("div", _hoisted_25$2, [
            _createElementVNode$3("p", null, "Total: " + _toDisplayString$3(__props.total), 1),
            _createElementVNode$3("div", _hoisted_26$2, [
              _createElementVNode$3("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page <= 1,
                onClick: _cache[8] || (_cache[8] = ($event) => emit("set-page", __props.page - 1))
              }, " Prev ", 8, _hoisted_27$2),
              _createElementVNode$3("span", null, "Page " + _toDisplayString$3(__props.page) + " / " + _toDisplayString$3(maxPage.value), 1),
              _createElementVNode$3("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page >= maxPage.value,
                onClick: _cache[9] || (_cache[9] = ($event) => emit("set-page", __props.page + 1))
              }, " Next ", 8, _hoisted_28$2)
            ])
          ])
        ], 64)) : (_openBlock$3(), _createElementBlock$3("p", _hoisted_29$2, "Collapsed. Click Expand to open Portfolios Table."))
      ]);
    };
  }
});

const {defineComponent:_defineComponent$2} = await importShared('vue');

const {toDisplayString:_toDisplayString$2,createElementVNode:_createElementVNode$2,openBlock:_openBlock$2,createElementBlock:_createElementBlock$2,createCommentVNode:_createCommentVNode$2,renderList:_renderList$2,Fragment:_Fragment$2,normalizeStyle:_normalizeStyle$2,normalizeClass:_normalizeClass$1} = await importShared('vue');

const _hoisted_1$2 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2$2 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_3$2 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4$2 = { class: "text-sm text-slate-500 dark:text-slate-400" };
const _hoisted_5$2 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_6$2 = ["value"];
const _hoisted_7$2 = { class: "mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700" };
const _hoisted_8$2 = { class: "min-w-[1180px] text-xs" };
const _hoisted_9$2 = { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_10$2 = { class: "sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800" };
const _hoisted_11$2 = { class: "px-3 py-2 text-left" };
const _hoisted_12$2 = { class: "px-3 py-2 text-right" };
const _hoisted_13$2 = { class: "px-3 py-2 text-right" };
const _hoisted_14$2 = { class: "px-3 py-2 text-right" };
const _hoisted_15$2 = { class: "px-3 py-2 text-right" };
const _hoisted_16$2 = { class: "px-3 py-2 text-right" };
const _hoisted_17$2 = { class: "px-3 py-2 text-right" };
const _hoisted_18$2 = { class: "px-3 py-2 text-left" };
const _hoisted_19$2 = { key: 0 };
const _hoisted_20$2 = { key: 1 };
const _hoisted_21$2 = { class: "sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900" };
const _hoisted_22$2 = { class: "px-3 py-2" };
const _hoisted_23$2 = { class: "px-3 py-2 text-right" };
const _hoisted_24$2 = { class: "px-3 py-2 text-right" };
const _hoisted_25$1 = { class: "px-3 py-2 text-right font-semibold" };
const _hoisted_26$1 = { class: "px-3 py-2 text-right" };
const _hoisted_27$1 = { class: "px-3 py-2" };
const _hoisted_28$1 = { class: "mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_29$1 = { class: "inline-flex items-center gap-2" };
const _hoisted_30$1 = ["disabled"];
const _hoisted_31$1 = ["disabled"];
const _hoisted_32$1 = {
  key: 1,
  class: "mt-3 text-sm text-slate-500 dark:text-slate-400"
};
const {computed: computed$3} = await importShared('vue');

const _sfc_main$2 = /* @__PURE__ */ _defineComponent$2({
  __name: "HoldingsStatusTableCard",
  props: {
    title: {},
    subtitle: {},
    expanded: { type: Boolean },
    loading: { type: Boolean },
    rows: {},
    total: {},
    page: {},
    pageSize: {},
    sortBy: {},
    sortOrder: {},
    searchTerm: {},
    maskAmounts: { type: Boolean },
    displayCurrency: {}
  },
  emits: ["toggle", "sort", "set-page", "update:search-term"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: (currency || "KRW").toUpperCase(),
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    function formatPercent(value) {
      if (value == null || !Number.isFinite(value)) return "-";
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    function sortMark(key) {
      if (props.sortBy !== key) return "↕";
      return props.sortOrder === "asc" ? "↑" : "↓";
    }
    const maxPage = computed$3(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
    const maskStyle = computed$3(() => props.maskAmounts ? { filter: "blur(6px)" } : void 0);
    return (_ctx, _cache) => {
      return _openBlock$2(), _createElementBlock$2("article", _hoisted_1$2, [
        _createElementVNode$2("div", _hoisted_2$2, [
          _createElementVNode$2("div", null, [
            _createElementVNode$2("h2", _hoisted_3$2, _toDisplayString$2(__props.title), 1),
            _createElementVNode$2("p", _hoisted_4$2, _toDisplayString$2(__props.subtitle), 1)
          ]),
          _createElementVNode$2("div", _hoisted_5$2, [
            __props.expanded ? (_openBlock$2(), _createElementBlock$2("input", {
              key: 0,
              value: __props.searchTerm,
              type: "text",
              placeholder: "Search holdings...",
              class: "w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-400/60 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
              onInput: _cache[0] || (_cache[0] = ($event) => emit("update:search-term", $event.target.value))
            }, null, 40, _hoisted_6$2)) : _createCommentVNode$2("", true),
            _createElementVNode$2("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              onClick: _cache[1] || (_cache[1] = ($event) => emit("toggle"))
            }, _toDisplayString$2(__props.expanded ? "Collapse" : "Expand"), 1)
          ])
        ]),
        __props.expanded ? (_openBlock$2(), _createElementBlock$2(_Fragment$2, { key: 0 }, [
          _createElementVNode$2("div", _hoisted_7$2, [
            _createElementVNode$2("table", _hoisted_8$2, [
              _createElementVNode$2("thead", _hoisted_9$2, [
                _createElementVNode$2("tr", null, [
                  _createElementVNode$2("th", _hoisted_10$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[2] || (_cache[2] = ($event) => emit("sort", "portfolio"))
                    }, " Portfolio " + _toDisplayString$2(sortMark("portfolio")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_11$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[3] || (_cache[3] = ($event) => emit("sort", "asset"))
                    }, "Asset " + _toDisplayString$2(sortMark("asset")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_12$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[4] || (_cache[4] = ($event) => emit("sort", "price"))
                    }, "Price " + _toDisplayString$2(sortMark("price")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_13$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[5] || (_cache[5] = ($event) => emit("sort", "avg_cost"))
                    }, "Avg Cost " + _toDisplayString$2(sortMark("avg_cost")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_14$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[6] || (_cache[6] = ($event) => emit("sort", "evaluated"))
                    }, "Evaluated " + _toDisplayString$2(sortMark("evaluated")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_15$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[7] || (_cache[7] = ($event) => emit("sort", "cost_basis"))
                    }, "Cost Basis " + _toDisplayString$2(sortMark("cost_basis")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_16$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[8] || (_cache[8] = ($event) => emit("sort", "profit"))
                    }, "Profit " + _toDisplayString$2(sortMark("profit")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_17$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[9] || (_cache[9] = ($event) => emit("sort", "return"))
                    }, "Return " + _toDisplayString$2(sortMark("return")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_18$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[10] || (_cache[10] = ($event) => emit("sort", "symbol"))
                    }, "Symbol " + _toDisplayString$2(sortMark("symbol")), 1)
                  ])
                ])
              ]),
              _createElementVNode$2("tbody", null, [
                __props.loading ? (_openBlock$2(), _createElementBlock$2("tr", _hoisted_19$2, [..._cache[13] || (_cache[13] = [
                  _createElementVNode$2("td", {
                    colspan: "9",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "Loading holdings...", -1)
                ])])) : __props.rows.length === 0 ? (_openBlock$2(), _createElementBlock$2("tr", _hoisted_20$2, [..._cache[14] || (_cache[14] = [
                  _createElementVNode$2("td", {
                    colspan: "9",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "No holding rows.", -1)
                ])])) : _createCommentVNode$2("", true),
                (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(__props.rows, (row) => {
                  return _openBlock$2(), _createElementBlock$2("tr", {
                    key: `h-${row.id}`,
                    class: "border-t border-slate-200 dark:border-slate-800"
                  }, [
                    _createElementVNode$2("td", _hoisted_21$2, _toDisplayString$2(row.portfolioName), 1),
                    _createElementVNode$2("td", _hoisted_22$2, _toDisplayString$2(row.assetName), 1),
                    _createElementVNode$2("td", _hoisted_23$2, [
                      _createElementVNode$2("span", {
                        style: _normalizeStyle$2(maskStyle.value)
                      }, _toDisplayString$2(formatCurrency(row.price, row.priceCurrency)), 5)
                    ]),
                    _createElementVNode$2("td", _hoisted_24$2, [
                      _createElementVNode$2("span", {
                        style: _normalizeStyle$2(maskStyle.value)
                      }, _toDisplayString$2(formatCurrency(row.avgCost, row.avgCostCurrency)), 5)
                    ]),
                    _createElementVNode$2("td", _hoisted_25$1, [
                      _createElementVNode$2("span", {
                        style: _normalizeStyle$2(maskStyle.value)
                      }, _toDisplayString$2(formatCurrency(row.evaluated, __props.displayCurrency)), 5)
                    ]),
                    _createElementVNode$2("td", _hoisted_26$1, [
                      _createElementVNode$2("span", {
                        style: _normalizeStyle$2(maskStyle.value)
                      }, _toDisplayString$2(formatCurrency(row.costBasis, __props.displayCurrency)), 5)
                    ]),
                    _createElementVNode$2("td", {
                      class: _normalizeClass$1(["px-3 py-2 text-right font-semibold", row.profit >= 0 ? "text-emerald-500" : "text-rose-500"])
                    }, [
                      _createElementVNode$2("span", {
                        style: _normalizeStyle$2(maskStyle.value)
                      }, _toDisplayString$2(row.profit >= 0 ? "+" : "") + _toDisplayString$2(formatCurrency(row.profit, __props.displayCurrency)), 5)
                    ], 2),
                    _createElementVNode$2("td", {
                      class: _normalizeClass$1(["px-3 py-2 text-right font-semibold", (row.returnPct ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"])
                    }, _toDisplayString$2(formatPercent(row.returnPct)), 3),
                    _createElementVNode$2("td", _hoisted_27$1, _toDisplayString$2(row.symbol || "-"), 1)
                  ]);
                }), 128))
              ])
            ])
          ]),
          _createElementVNode$2("div", _hoisted_28$1, [
            _createElementVNode$2("p", null, "Total: " + _toDisplayString$2(__props.total), 1),
            _createElementVNode$2("div", _hoisted_29$1, [
              _createElementVNode$2("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page <= 1,
                onClick: _cache[11] || (_cache[11] = ($event) => emit("set-page", __props.page - 1))
              }, " Prev ", 8, _hoisted_30$1),
              _createElementVNode$2("span", null, "Page " + _toDisplayString$2(__props.page) + " / " + _toDisplayString$2(maxPage.value), 1),
              _createElementVNode$2("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page >= maxPage.value,
                onClick: _cache[12] || (_cache[12] = ($event) => emit("set-page", __props.page + 1))
              }, " Next ", 8, _hoisted_31$1)
            ])
          ])
        ], 64)) : (_openBlock$2(), _createElementBlock$2("p", _hoisted_32$1, "Collapsed. Click Expand to open Holdings Table."))
      ]);
    };
  }
});

const {defineComponent:_defineComponent$1} = await importShared('vue');

const {toDisplayString:_toDisplayString$1,createElementVNode:_createElementVNode$1,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1,createCommentVNode:_createCommentVNode$1,renderList:_renderList$1,Fragment:_Fragment$1,normalizeStyle:_normalizeStyle$1} = await importShared('vue');

const _hoisted_1$1 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2$1 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_3$1 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4$1 = { class: "text-sm text-slate-500 dark:text-slate-400" };
const _hoisted_5$1 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_6$1 = ["value"];
const _hoisted_7$1 = { class: "mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700" };
const _hoisted_8$1 = { class: "min-w-[780px] text-xs" };
const _hoisted_9$1 = { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_10$1 = { class: "sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800" };
const _hoisted_11$1 = { class: "px-3 py-2 text-left" };
const _hoisted_12$1 = { class: "px-3 py-2 text-right" };
const _hoisted_13$1 = { class: "px-3 py-2 text-left" };
const _hoisted_14$1 = { key: 0 };
const _hoisted_15$1 = { key: 1 };
const _hoisted_16$1 = { class: "sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900" };
const _hoisted_17$1 = { class: "px-3 py-2" };
const _hoisted_18$1 = { class: "px-3 py-2 text-right font-semibold" };
const _hoisted_19$1 = { class: "px-3 py-2" };
const _hoisted_20$1 = { class: "mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_21$1 = { class: "inline-flex items-center gap-2" };
const _hoisted_22$1 = ["disabled"];
const _hoisted_23$1 = ["disabled"];
const _hoisted_24$1 = {
  key: 1,
  class: "mt-3 text-sm text-slate-500 dark:text-slate-400"
};
const {computed: computed$2} = await importShared('vue');

const _sfc_main$1 = /* @__PURE__ */ _defineComponent$1({
  __name: "LiabilitiesStatusTableCard",
  props: {
    title: {},
    subtitle: {},
    expanded: { type: Boolean },
    loading: { type: Boolean },
    rows: {},
    total: {},
    page: {},
    pageSize: {},
    sortBy: {},
    sortOrder: {},
    searchTerm: {},
    maskAmounts: { type: Boolean }
  },
  emits: ["toggle", "sort", "set-page", "update:search-term"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency: (currency || "KRW").toUpperCase(),
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    function sortMark(key) {
      if (props.sortBy !== key) return "↕";
      return props.sortOrder === "asc" ? "↑" : "↓";
    }
    const maxPage = computed$2(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
    const maskStyle = computed$2(() => props.maskAmounts ? { filter: "blur(6px)" } : void 0);
    return (_ctx, _cache) => {
      return _openBlock$1(), _createElementBlock$1("article", _hoisted_1$1, [
        _createElementVNode$1("div", _hoisted_2$1, [
          _createElementVNode$1("div", null, [
            _createElementVNode$1("h2", _hoisted_3$1, _toDisplayString$1(__props.title), 1),
            _createElementVNode$1("p", _hoisted_4$1, _toDisplayString$1(__props.subtitle), 1)
          ]),
          _createElementVNode$1("div", _hoisted_5$1, [
            __props.expanded ? (_openBlock$1(), _createElementBlock$1("input", {
              key: 0,
              value: __props.searchTerm,
              type: "text",
              placeholder: "Search liabilities...",
              class: "w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-400/60 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
              onInput: _cache[0] || (_cache[0] = ($event) => emit("update:search-term", $event.target.value))
            }, null, 40, _hoisted_6$1)) : _createCommentVNode$1("", true),
            _createElementVNode$1("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              onClick: _cache[1] || (_cache[1] = ($event) => emit("toggle"))
            }, _toDisplayString$1(__props.expanded ? "Collapse" : "Expand"), 1)
          ])
        ]),
        __props.expanded ? (_openBlock$1(), _createElementBlock$1(_Fragment$1, { key: 0 }, [
          _createElementVNode$1("div", _hoisted_7$1, [
            _createElementVNode$1("table", _hoisted_8$1, [
              _createElementVNode$1("thead", _hoisted_9$1, [
                _createElementVNode$1("tr", null, [
                  _createElementVNode$1("th", _hoisted_10$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[2] || (_cache[2] = ($event) => emit("sort", "portfolio"))
                    }, " Portfolio " + _toDisplayString$1(sortMark("portfolio")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_11$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[3] || (_cache[3] = ($event) => emit("sort", "liability"))
                    }, " Liability " + _toDisplayString$1(sortMark("liability")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_12$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[4] || (_cache[4] = ($event) => emit("sort", "balance"))
                    }, " Balance " + _toDisplayString$1(sortMark("balance")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_13$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[5] || (_cache[5] = ($event) => emit("sort", "type"))
                    }, " Type " + _toDisplayString$1(sortMark("type")), 1)
                  ])
                ])
              ]),
              _createElementVNode$1("tbody", null, [
                __props.loading ? (_openBlock$1(), _createElementBlock$1("tr", _hoisted_14$1, [..._cache[8] || (_cache[8] = [
                  _createElementVNode$1("td", {
                    colspan: "4",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "Loading liabilities...", -1)
                ])])) : __props.rows.length === 0 ? (_openBlock$1(), _createElementBlock$1("tr", _hoisted_15$1, [..._cache[9] || (_cache[9] = [
                  _createElementVNode$1("td", {
                    colspan: "4",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "No liability rows.", -1)
                ])])) : _createCommentVNode$1("", true),
                (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(__props.rows, (row) => {
                  return _openBlock$1(), _createElementBlock$1("tr", {
                    key: `l-${row.id}`,
                    class: "border-t border-slate-200 dark:border-slate-800"
                  }, [
                    _createElementVNode$1("td", _hoisted_16$1, _toDisplayString$1(row.portfolioName), 1),
                    _createElementVNode$1("td", _hoisted_17$1, _toDisplayString$1(row.name), 1),
                    _createElementVNode$1("td", _hoisted_18$1, [
                      _createElementVNode$1("span", {
                        style: _normalizeStyle$1(maskStyle.value)
                      }, _toDisplayString$1(formatCurrency(row.balance, row.balanceCurrency)), 5)
                    ]),
                    _createElementVNode$1("td", _hoisted_19$1, _toDisplayString$1(row.type), 1)
                  ]);
                }), 128))
              ])
            ])
          ]),
          _createElementVNode$1("div", _hoisted_20$1, [
            _createElementVNode$1("p", null, "Total: " + _toDisplayString$1(__props.total), 1),
            _createElementVNode$1("div", _hoisted_21$1, [
              _createElementVNode$1("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page <= 1,
                onClick: _cache[6] || (_cache[6] = ($event) => emit("set-page", __props.page - 1))
              }, " Prev ", 8, _hoisted_22$1),
              _createElementVNode$1("span", null, "Page " + _toDisplayString$1(__props.page) + " / " + _toDisplayString$1(maxPage.value), 1),
              _createElementVNode$1("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page >= maxPage.value,
                onClick: _cache[7] || (_cache[7] = ($event) => emit("set-page", __props.page + 1))
              }, " Next ", 8, _hoisted_23$1)
            ])
          ])
        ], 64)) : (_openBlock$1(), _createElementBlock$1("p", _hoisted_24$1, "Collapsed. Click Expand to open Liabilities Table."))
      ]);
    };
  }
});

async function captureSnapshot(payload = {}) {
  const { data } = await http.post("/snapshots/capture", payload);
  return data;
}
async function getSnapshots(params = {}) {
  const { data } = await http.get("/snapshots", { params });
  return data;
}
async function getSnapshotSummary(snapshotId) {
  const { data } = await http.get(`/snapshots/${snapshotId}/summary`);
  return data;
}
async function getSnapshotAllocation(snapshotId, params = {}) {
  const { data } = await http.get(`/snapshots/${snapshotId}/allocation`, { params });
  return data;
}
async function getSnapshotPortfoliosTable(snapshotId, params = {}) {
  const { data } = await http.get(`/snapshots/${snapshotId}/portfolios/table`, { params });
  return data;
}
async function getSnapshotHoldingsTable(snapshotId, params = {}) {
  const { data } = await http.get(`/snapshots/${snapshotId}/holdings/table`, { params });
  return data;
}
async function getSnapshotLiabilitiesTable(snapshotId, params = {}) {
  const { data } = await http.get(`/snapshots/${snapshotId}/liabilities/table`, { params });
  return data;
}
async function getSnapshotQuickInsight(snapshotId, params = {}) {
  const { data } = await http.get(`/snapshots/${snapshotId}/quick-insight`, { params });
  return data;
}
async function getSnapshotPreviewQuickInsight(payload, params = {}) {
  const { data } = await http.post("/snapshots/quick-insight/preview", payload, { params });
  return data;
}
async function getSnapshotSeries(params = {}) {
  const { data } = await http.get("/snapshots/series", { params });
  return data;
}
async function exportSnapshotCsv(snapshotId) {
  const response = await http.get(`/snapshots/${snapshotId}/export.csv`, { responseType: "blob" });
  return response.data;
}
async function previewSnapshotCsv(file) {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await http.post("/snapshots/csv/preview", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
  return data;
}
async function deleteSnapshots(ids) {
  const { data } = await http.post("/snapshots/delete", { ids });
  return data;
}

const {defineComponent:_defineComponent} = await importShared('vue');

const {toDisplayString:_toDisplayString,createElementVNode:_createElementVNode,renderList:_renderList,Fragment:_Fragment,openBlock:_openBlock,createElementBlock:_createElementBlock,normalizeClass:_normalizeClass,vModelCheckbox:_vModelCheckbox,withDirectives:_withDirectives,createTextVNode:_createTextVNode,createCommentVNode:_createCommentVNode,normalizeStyle:_normalizeStyle} = await importShared('vue');

const _hoisted_1 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_3 = { class: "min-w-0" };
const _hoisted_4 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_5 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_6 = { class: "flex flex-wrap items-center justify-end gap-2" };
const _hoisted_7 = { class: "inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1 dark:border-slate-700 dark:bg-slate-800" };
const _hoisted_8 = ["onClick"];
const _hoisted_9 = { class: "inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_10 = {
  key: 0,
  class: "mt-4"
};
const _hoisted_11 = {
  key: 0,
  class: "rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_12 = {
  key: 1,
  class: "rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-500 dark:text-rose-300"
};
const _hoisted_13 = {
  key: 2,
  class: "space-y-4"
};
const _hoisted_14 = { class: "flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_15 = { class: "text-sm font-semibold [overflow-wrap:anywhere]" };
const _hoisted_16 = { class: "mt-3 grid gap-3 md:grid-cols-3" };
const _hoisted_17 = { class: "rounded-xl bg-white/40 px-3 py-3 dark:bg-slate-900/30" };
const _hoisted_18 = { class: "rounded-xl bg-white/40 px-3 py-3 dark:bg-slate-900/30" };
const _hoisted_19 = { class: "rounded-xl bg-white/40 px-3 py-3 dark:bg-slate-900/30" };
const _hoisted_20 = { class: "rounded-2xl border border-slate-200 p-4 dark:border-slate-700" };
const _hoisted_21 = { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_22 = { class: "mt-3 grid gap-3 md:grid-cols-2" };
const _hoisted_23 = { class: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300" };
const _hoisted_24 = {
  key: 0,
  class: "mt-2 space-y-2"
};
const _hoisted_25 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_26 = { class: "min-w-0 flex-1" };
const _hoisted_27 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_28 = { class: "text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" };
const _hoisted_29 = { class: "mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400" };
const _hoisted_30 = { class: "text-left text-sm font-semibold text-emerald-600 sm:text-right dark:text-emerald-300" };
const _hoisted_31 = {
  key: 1,
  class: "mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_32 = { class: "text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 dark:text-rose-300" };
const _hoisted_33 = {
  key: 0,
  class: "mt-2 space-y-2"
};
const _hoisted_34 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_35 = { class: "min-w-0 flex-1" };
const _hoisted_36 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_37 = { class: "text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" };
const _hoisted_38 = { class: "mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400" };
const _hoisted_39 = { class: "text-left text-sm font-semibold text-rose-500 sm:text-right dark:text-rose-300" };
const _hoisted_40 = {
  key: 1,
  class: "mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_41 = { class: "grid gap-4 xl:grid-cols-2" };
const _hoisted_42 = { class: "rounded-2xl border border-slate-200 p-4 dark:border-slate-700" };
const _hoisted_43 = { class: "mt-3 grid gap-3 md:grid-cols-2" };
const _hoisted_44 = {
  key: 0,
  class: "mt-2 space-y-2"
};
const _hoisted_45 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_46 = { class: "min-w-0 flex-1" };
const _hoisted_47 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_48 = { class: "text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" };
const _hoisted_49 = { class: "mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400" };
const _hoisted_50 = { class: "text-left text-sm font-semibold text-emerald-600 sm:text-right dark:text-emerald-300" };
const _hoisted_51 = {
  key: 1,
  class: "mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_52 = {
  key: 0,
  class: "mt-2 space-y-2"
};
const _hoisted_53 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_54 = { class: "min-w-0 flex-1" };
const _hoisted_55 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_56 = { class: "text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" };
const _hoisted_57 = { class: "mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400" };
const _hoisted_58 = { class: "text-left text-sm font-semibold text-rose-500 sm:text-right dark:text-rose-300" };
const _hoisted_59 = {
  key: 1,
  class: "mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_60 = { class: "rounded-2xl border border-slate-200 p-4 dark:border-slate-700" };
const _hoisted_61 = { class: "mt-3 grid gap-3 md:grid-cols-2" };
const _hoisted_62 = {
  key: 0,
  class: "mt-2 space-y-2"
};
const _hoisted_63 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_64 = { class: "min-w-0 flex-1" };
const _hoisted_65 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_66 = { class: "text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" };
const _hoisted_67 = { class: "mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400" };
const _hoisted_68 = { class: "text-left text-sm font-semibold text-emerald-600 sm:text-right dark:text-emerald-300" };
const _hoisted_69 = {
  key: 1,
  class: "mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_70 = {
  key: 0,
  class: "mt-2 space-y-2"
};
const _hoisted_71 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_72 = { class: "min-w-0 flex-1" };
const _hoisted_73 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_74 = { class: "text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" };
const _hoisted_75 = { class: "mt-1 text-xs text-slate-500 [overflow-wrap:anywhere] dark:text-slate-400" };
const _hoisted_76 = { class: "text-left text-sm font-semibold text-rose-500 sm:text-right dark:text-rose-300" };
const _hoisted_77 = {
  key: 1,
  class: "mt-2 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_78 = { class: "grid gap-4 xl:grid-cols-[minmax(0,2fr),minmax(0,1fr)]" };
const _hoisted_79 = { class: "rounded-2xl border border-slate-200 p-4 dark:border-slate-700" };
const _hoisted_80 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_81 = {
  key: 0,
  class: "mt-3 space-y-2"
};
const _hoisted_82 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_83 = { class: "min-w-0 flex-1" };
const _hoisted_84 = { class: "text-sm font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" };
const _hoisted_85 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_86 = {
  key: 1,
  class: "mt-3 rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_87 = { class: "rounded-2xl border border-slate-200 p-4 dark:border-slate-700" };
const _hoisted_88 = { class: "mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300" };
const _hoisted_89 = { class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_90 = { class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_91 = { class: "flex flex-wrap items-center justify-between gap-3" };
const _hoisted_92 = {
  key: 0,
  class: "mt-2 space-y-2 border-t border-slate-200 pt-2 text-xs dark:border-slate-700"
};
const _hoisted_93 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_94 = { class: "min-w-0 flex-1" };
const _hoisted_95 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_96 = { class: "font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" };
const _hoisted_97 = { class: "mt-0.5 [overflow-wrap:anywhere] text-slate-500 dark:text-slate-400" };
const _hoisted_98 = { key: 0 };
const _hoisted_99 = { class: "text-slate-500 dark:text-slate-400" };
const _hoisted_100 = { class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_101 = { class: "flex flex-wrap items-center justify-between gap-3" };
const _hoisted_102 = {
  key: 0,
  class: "mt-2 space-y-2 border-t border-slate-200 pt-2 text-xs dark:border-slate-700"
};
const _hoisted_103 = { class: "flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between" };
const _hoisted_104 = { class: "min-w-0 flex-1" };
const _hoisted_105 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_106 = { class: "font-semibold text-slate-900 [overflow-wrap:anywhere] dark:text-slate-100" };
const _hoisted_107 = { class: "mt-0.5 [overflow-wrap:anywhere] text-slate-500 dark:text-slate-400" };
const _hoisted_108 = { key: 0 };
const _hoisted_109 = {
  key: 1,
  class: "mt-3 text-xs text-slate-500 dark:text-slate-400"
};
const {computed: computed$1,ref: ref$1,watch} = await importShared('vue');
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "QuickInsightPanel",
  props: {
    title: { default: "Quick Insight" },
    description: { default: "Snapshot delta analysis" },
    sourceMode: {},
    displayCurrency: {},
    amountMask: { type: Boolean, default: false },
    storageKeyPrefix: {},
    scopeType: { default: "USER" },
    scopeId: { default: null },
    snapshotId: { default: null },
    previewPayload: { default: null }
  },
  setup(__props) {
    const props = __props;
    const DEFAULT_UI_STATE = {
      expanded: true,
      period: "1D",
      netDrivers: false,
      manualExpanded: false,
      missingExpanded: false
    };
    const quickInsight = ref$1(null);
    const loading = ref$1(false);
    const errorMessage = ref$1("");
    const panelExpanded = ref$1(DEFAULT_UI_STATE.expanded);
    const period = ref$1(DEFAULT_UI_STATE.period);
    const showNetDrivers = ref$1(DEFAULT_UI_STATE.netDrivers);
    const manualQuotesExpanded = ref$1(DEFAULT_UI_STATE.manualExpanded);
    const missingQuotesExpanded = ref$1(DEFAULT_UI_STATE.missingExpanded);
    function toNumber(value) {
      if (value == null) return 0;
      const parsed = typeof value === "number" ? value : Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    function formatSignedCurrency(value, currency) {
      const absText = formatCurrency(Math.abs(value), currency);
      if (value > 0) return `+${absText}`;
      if (value < 0) return `-${absText}`;
      return absText;
    }
    function formatPercentPoint(value) {
      if (value == null || !Number.isFinite(value)) return "-";
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%p`;
    }
    function formatDateTime(value) {
      return formatDateTimeSeoul(value);
    }
    function getErrorMessage(error) {
      if (error instanceof AxiosError) {
        return error.response?.data?.detail || error.message;
      }
      if (error instanceof Error) {
        return error.message;
      }
      return "Unknown error";
    }
    function insightSeverityClass(severity) {
      if (severity === "positive") return "border-emerald-500/40 bg-emerald-500/10 text-emerald-100";
      if (severity === "negative") return "border-rose-500/40 bg-rose-500/10 text-rose-100";
      return "border-slate-700 bg-slate-800/60 text-slate-100";
    }
    function insightDeltaClass(value) {
      if (value == null) return "text-slate-200";
      if (value > 0) return "text-emerald-300";
      if (value < 0) return "text-rose-300";
      return "text-slate-200";
    }
    function insightStatusBadgeClass(status) {
      if (status === "NEW") return "bg-emerald-500/15 text-emerald-200";
      if (status === "REMOVED") return "bg-rose-500/15 text-rose-200";
      return "bg-slate-700 text-slate-200";
    }
    function displayClassLabel(displayClass) {
      const normalized = (displayClass || "").toUpperCase();
      if (!normalized) return "UNKNOWN";
      if (normalized === "REAL_ESTATE") return "REAL ESTATE";
      if (normalized === "DEPOSIT_SAVING") return "DEPOSIT";
      return normalized.replace(/_/g, " ");
    }
    function displayClassBadgeClass(displayClass) {
      const normalized = (displayClass || "").toUpperCase();
      if (normalized === "CASH") return "bg-amber-500/15 text-amber-200 ring-1 ring-amber-500/30";
      if (normalized === "LIABILITY") return "bg-rose-500/15 text-rose-200 ring-1 ring-rose-500/30";
      if (normalized === "REAL_ESTATE") return "bg-emerald-500/15 text-emerald-200 ring-1 ring-emerald-500/30";
      if (normalized === "CRYPTO") return "bg-cyan-500/15 text-cyan-200 ring-1 ring-cyan-500/30";
      if (normalized === "STOCK") return "bg-indigo-500/15 text-indigo-200 ring-1 ring-indigo-500/30";
      if (normalized === "DEPOSIT_SAVING") return "bg-teal-500/15 text-teal-200 ring-1 ring-teal-500/30";
      if (normalized === "BOND") return "bg-fuchsia-500/15 text-fuchsia-200 ring-1 ring-fuchsia-500/30";
      return "bg-slate-700 text-slate-200 ring-1 ring-slate-600";
    }
    function normalizeUiState(raw) {
      if (!raw || typeof raw !== "object") {
        return { ...DEFAULT_UI_STATE };
      }
      const parsed = raw;
      return {
        expanded: typeof parsed.expanded === "boolean" ? parsed.expanded : DEFAULT_UI_STATE.expanded,
        period: parsed.period === "1D" || parsed.period === "7D" || parsed.period === "30D" ? parsed.period : DEFAULT_UI_STATE.period,
        netDrivers: typeof parsed.netDrivers === "boolean" ? parsed.netDrivers : DEFAULT_UI_STATE.netDrivers,
        manualExpanded: typeof parsed.manualExpanded === "boolean" ? parsed.manualExpanded : DEFAULT_UI_STATE.manualExpanded,
        missingExpanded: typeof parsed.missingExpanded === "boolean" ? parsed.missingExpanded : DEFAULT_UI_STATE.missingExpanded
      };
    }
    function loadUiState() {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(`${props.storageKeyPrefix}:ui`);
      if (!raw) return;
      try {
        const parsed = normalizeUiState(JSON.parse(raw));
        panelExpanded.value = parsed.expanded;
        period.value = parsed.period;
        showNetDrivers.value = parsed.netDrivers;
        manualQuotesExpanded.value = parsed.manualExpanded;
        missingQuotesExpanded.value = parsed.missingExpanded;
      } catch {
      }
    }
    function saveUiState() {
      if (typeof window === "undefined") return;
      const payload = {
        expanded: panelExpanded.value,
        period: period.value,
        netDrivers: showNetDrivers.value,
        manualExpanded: manualQuotesExpanded.value,
        missingExpanded: missingQuotesExpanded.value
      };
      window.localStorage.setItem(`${props.storageKeyPrefix}:ui`, JSON.stringify(payload));
    }
    if (typeof window !== "undefined") {
      loadUiState();
    }
    const driverCardTitle = computed$1(() => showNetDrivers.value ? "Top Net Drivers" : "Top Gross Drivers");
    const driverPositiveLabel = computed$1(() => showNetDrivers.value ? "Top Boosters" : "Top Gainers");
    const driverNegativeLabel = computed$1(() => showNetDrivers.value ? "Top Drags" : "Top Losers");
    const driverPositiveItems = computed$1(
      () => showNetDrivers.value ? quickInsight.value?.net_drivers.top_gainers ?? [] : quickInsight.value?.gross_drivers.top_gainers ?? []
    );
    const driverNegativeItems = computed$1(
      () => showNetDrivers.value ? quickInsight.value?.net_drivers.top_losers ?? [] : quickInsight.value?.gross_drivers.top_losers ?? []
    );
    const portfolioChangeTitle = computed$1(() => showNetDrivers.value ? "Current Net Delta" : "Current Value Delta");
    const portfolioChangeItems = computed$1(
      () => showNetDrivers.value ? quickInsight.value?.portfolio_changes.top_net_value_changes ?? [] : quickInsight.value?.portfolio_changes.top_current_value_changes ?? []
    );
    const baselineLabel = computed$1(() => {
      if (!quickInsight.value) return "-";
      return quickInsight.value.baseline_snapshot_date || `No ${quickInsight.value.period} snapshot baseline`;
    });
    function amountMaskStyle() {
      return props.amountMask ? { filter: "blur(6px)" } : void 0;
    }
    async function loadQuickInsight() {
      loading.value = true;
      errorMessage.value = "";
      try {
        if (props.sourceMode === "LIVE") {
          quickInsight.value = await getQuickInsight({
            scope_type: props.scopeType,
            scope_id: props.scopeId ?? void 0,
            display_currency: props.displayCurrency,
            period: period.value
          });
          return;
        }
        if (props.sourceMode === "SNAPSHOT") {
          if (!props.snapshotId) {
            quickInsight.value = null;
            return;
          }
          quickInsight.value = await getSnapshotQuickInsight(props.snapshotId, {
            display_currency: props.displayCurrency,
            period: period.value
          });
          return;
        }
        if (!props.previewPayload) {
          quickInsight.value = null;
          return;
        }
        quickInsight.value = await getSnapshotPreviewQuickInsight(props.previewPayload, {
          display_currency: props.displayCurrency,
          period: period.value
        });
      } catch (error) {
        quickInsight.value = null;
        errorMessage.value = getErrorMessage(error);
      } finally {
        loading.value = false;
      }
    }
    watch(
      () => [props.sourceMode, props.displayCurrency, props.scopeType, props.scopeId, props.snapshotId, props.previewPayload, period.value],
      () => {
        void loadQuickInsight();
      },
      { immediate: true }
    );
    watch(
      () => [panelExpanded.value, period.value, showNetDrivers.value, manualQuotesExpanded.value, missingQuotesExpanded.value],
      () => {
        saveUiState();
      }
    );
    function renderAmount(value) {
      return formatSignedCurrency(value, props.displayCurrency);
    }
    function renderReturn(value) {
      return formatPercentPoint(toNumber(value));
    }
    function toggleExpanded() {
      panelExpanded.value = !panelExpanded.value;
    }
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("article", _hoisted_1, [
        _createElementVNode("div", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _createElementVNode("h2", _hoisted_4, _toDisplayString(__props.title), 1),
            _createElementVNode("p", _hoisted_5, _toDisplayString(__props.description), 1)
          ]),
          _createElementVNode("div", _hoisted_6, [
            _createElementVNode("div", _hoisted_7, [
              (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["1D", "7D", "30D"], (option) => {
                return _createElementVNode("button", {
                  key: option,
                  type: "button",
                  class: _normalizeClass(["rounded-lg px-3 py-1.5 text-xs font-semibold transition", period.value === option ? "bg-indigo-600 text-white shadow-sm" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-700"]),
                  onClick: ($event) => period.value = option
                }, _toDisplayString(option), 11, _hoisted_8);
              }), 64))
            ]),
            _createElementVNode("label", _hoisted_9, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => showNetDrivers.value = $event),
                type: "checkbox",
                class: "h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
              }, null, 512), [
                [_vModelCheckbox, showNetDrivers.value]
              ]),
              _cache[3] || (_cache[3] = _createTextVNode(" Net ", -1))
            ]),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              onClick: toggleExpanded
            }, _toDisplayString(panelExpanded.value ? "Collapse" : "Expand"), 1)
          ])
        ]),
        panelExpanded.value ? (_openBlock(), _createElementBlock("div", _hoisted_10, [
          loading.value ? (_openBlock(), _createElementBlock("div", _hoisted_11, "Loading snapshot delta insight...")) : errorMessage.value ? (_openBlock(), _createElementBlock("div", _hoisted_12, _toDisplayString(errorMessage.value), 1)) : quickInsight.value ? (_openBlock(), _createElementBlock("div", _hoisted_13, [
            _createElementVNode("div", _hoisted_14, [
              _createElementVNode("span", null, "Current as_of: " + _toDisplayString(formatDateTime(quickInsight.value.current_as_of)), 1),
              _createElementVNode("span", null, "Baseline: " + _toDisplayString(baselineLabel.value), 1)
            ]),
            _createElementVNode("section", {
              class: _normalizeClass(["rounded-2xl border px-4 py-4", insightSeverityClass(quickInsight.value.summary_alert.severity)])
            }, [
              _createElementVNode("p", _hoisted_15, _toDisplayString(quickInsight.value.summary_alert.comment), 1),
              _createElementVNode("div", _hoisted_16, [
                _createElementVNode("div", _hoisted_17, [
                  _cache[4] || (_cache[4] = _createElementVNode("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "Gross", -1)),
                  _createElementVNode("p", {
                    class: _normalizeClass(["mt-1 text-sm font-semibold", insightDeltaClass(toNumber(quickInsight.value.summary_alert.gross_delta))])
                  }, [
                    _createElementVNode("span", {
                      style: _normalizeStyle(amountMaskStyle())
                    }, _toDisplayString(renderAmount(toNumber(quickInsight.value.summary_alert.gross_delta))), 5)
                  ], 2)
                ]),
                _createElementVNode("div", _hoisted_18, [
                  _cache[5] || (_cache[5] = _createElementVNode("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "Net", -1)),
                  _createElementVNode("p", {
                    class: _normalizeClass(["mt-1 text-sm font-semibold", insightDeltaClass(toNumber(quickInsight.value.summary_alert.net_delta))])
                  }, [
                    _createElementVNode("span", {
                      style: _normalizeStyle(amountMaskStyle())
                    }, _toDisplayString(renderAmount(toNumber(quickInsight.value.summary_alert.net_delta))), 5)
                  ], 2)
                ]),
                _createElementVNode("div", _hoisted_19, [
                  _cache[6] || (_cache[6] = _createElementVNode("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "Liabilities", -1)),
                  _createElementVNode("p", {
                    class: _normalizeClass(["mt-1 text-sm font-semibold", insightDeltaClass(toNumber(quickInsight.value.summary_alert.liabilities_delta) * -1)])
                  }, [
                    _createElementVNode("span", {
                      style: _normalizeStyle(amountMaskStyle())
                    }, _toDisplayString(renderAmount(toNumber(quickInsight.value.summary_alert.liabilities_delta))), 5)
                  ], 2)
                ])
              ])
            ], 2),
            _createElementVNode("section", _hoisted_20, [
              _createElementVNode("h3", _hoisted_21, _toDisplayString(driverCardTitle.value), 1),
              _createElementVNode("div", _hoisted_22, [
                _createElementVNode("div", null, [
                  _createElementVNode("p", _hoisted_23, _toDisplayString(driverPositiveLabel.value), 1),
                  driverPositiveItems.value.length ? (_openBlock(), _createElementBlock("ul", _hoisted_24, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(driverPositiveItems.value, (item) => {
                      return _openBlock(), _createElementBlock("li", {
                        key: `driver-positive-${item.key}`,
                        class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800"
                      }, [
                        _createElementVNode("div", _hoisted_25, [
                          _createElementVNode("div", _hoisted_26, [
                            _createElementVNode("div", _hoisted_27, [
                              _createElementVNode("p", _hoisted_28, _toDisplayString(item.label), 1),
                              item.display_class ? (_openBlock(), _createElementBlock("span", {
                                key: 0,
                                class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", displayClassBadgeClass(item.display_class)])
                              }, _toDisplayString(displayClassLabel(item.display_class)), 3)) : _createCommentVNode("", true),
                              item.status ? (_openBlock(), _createElementBlock("span", {
                                key: 1,
                                class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", insightStatusBadgeClass(item.status)])
                              }, _toDisplayString(item.status), 3)) : _createCommentVNode("", true)
                            ]),
                            _createElementVNode("p", _hoisted_29, _toDisplayString(item.portfolio_name || "-"), 1)
                          ]),
                          _createElementVNode("p", _hoisted_30, [
                            _createElementVNode("span", {
                              style: _normalizeStyle(amountMaskStyle())
                            }, _toDisplayString(renderAmount(toNumber(item.delta_amount))), 5)
                          ])
                        ])
                      ]);
                    }), 128))
                  ])) : (_openBlock(), _createElementBlock("p", _hoisted_31, _toDisplayString(showNetDrivers.value ? "No boosters." : "No gainers."), 1))
                ]),
                _createElementVNode("div", null, [
                  _createElementVNode("p", _hoisted_32, _toDisplayString(driverNegativeLabel.value), 1),
                  driverNegativeItems.value.length ? (_openBlock(), _createElementBlock("ul", _hoisted_33, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(driverNegativeItems.value, (item) => {
                      return _openBlock(), _createElementBlock("li", {
                        key: `driver-negative-${item.key}`,
                        class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800"
                      }, [
                        _createElementVNode("div", _hoisted_34, [
                          _createElementVNode("div", _hoisted_35, [
                            _createElementVNode("div", _hoisted_36, [
                              _createElementVNode("p", _hoisted_37, _toDisplayString(item.label), 1),
                              item.display_class ? (_openBlock(), _createElementBlock("span", {
                                key: 0,
                                class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", displayClassBadgeClass(item.display_class)])
                              }, _toDisplayString(displayClassLabel(item.display_class)), 3)) : _createCommentVNode("", true),
                              item.status ? (_openBlock(), _createElementBlock("span", {
                                key: 1,
                                class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", insightStatusBadgeClass(item.status)])
                              }, _toDisplayString(item.status), 3)) : _createCommentVNode("", true)
                            ]),
                            _createElementVNode("p", _hoisted_38, _toDisplayString(item.portfolio_name || "-"), 1)
                          ]),
                          _createElementVNode("p", _hoisted_39, [
                            _createElementVNode("span", {
                              style: _normalizeStyle(amountMaskStyle())
                            }, _toDisplayString(renderAmount(toNumber(item.delta_amount))), 5)
                          ])
                        ])
                      ]);
                    }), 128))
                  ])) : (_openBlock(), _createElementBlock("p", _hoisted_40, _toDisplayString(showNetDrivers.value ? "No drags." : "No losers."), 1))
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_41, [
              _createElementVNode("section", _hoisted_42, [
                _cache[9] || (_cache[9] = _createElementVNode("h3", { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" }, "Profit Delta Movers", -1)),
                _createElementVNode("div", _hoisted_43, [
                  _createElementVNode("div", null, [
                    _cache[7] || (_cache[7] = _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300" }, "Top 3", -1)),
                    quickInsight.value.profit_movers.top_gainers.length ? (_openBlock(), _createElementBlock("ul", _hoisted_44, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(quickInsight.value.profit_movers.top_gainers, (item) => {
                        return _openBlock(), _createElementBlock("li", {
                          key: `profit-gain-${item.key}`,
                          class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800"
                        }, [
                          _createElementVNode("div", _hoisted_45, [
                            _createElementVNode("div", _hoisted_46, [
                              _createElementVNode("div", _hoisted_47, [
                                _createElementVNode("p", _hoisted_48, _toDisplayString(item.label), 1),
                                item.display_class ? (_openBlock(), _createElementBlock("span", {
                                  key: 0,
                                  class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", displayClassBadgeClass(item.display_class)])
                                }, _toDisplayString(displayClassLabel(item.display_class)), 3)) : _createCommentVNode("", true)
                              ]),
                              _createElementVNode("p", _hoisted_49, _toDisplayString(item.portfolio_name || "-"), 1)
                            ]),
                            _createElementVNode("p", _hoisted_50, [
                              _createElementVNode("span", {
                                style: _normalizeStyle(amountMaskStyle())
                              }, _toDisplayString(renderAmount(toNumber(item.delta_amount))), 5)
                            ])
                          ])
                        ]);
                      }), 128))
                    ])) : (_openBlock(), _createElementBlock("p", _hoisted_51, "No movers yet."))
                  ]),
                  _createElementVNode("div", null, [
                    _cache[8] || (_cache[8] = _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 dark:text-rose-300" }, "Bottom 3", -1)),
                    quickInsight.value.profit_movers.top_losers.length ? (_openBlock(), _createElementBlock("ul", _hoisted_52, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(quickInsight.value.profit_movers.top_losers, (item) => {
                        return _openBlock(), _createElementBlock("li", {
                          key: `profit-loss-${item.key}`,
                          class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800"
                        }, [
                          _createElementVNode("div", _hoisted_53, [
                            _createElementVNode("div", _hoisted_54, [
                              _createElementVNode("div", _hoisted_55, [
                                _createElementVNode("p", _hoisted_56, _toDisplayString(item.label), 1),
                                item.display_class ? (_openBlock(), _createElementBlock("span", {
                                  key: 0,
                                  class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", displayClassBadgeClass(item.display_class)])
                                }, _toDisplayString(displayClassLabel(item.display_class)), 3)) : _createCommentVNode("", true)
                              ]),
                              _createElementVNode("p", _hoisted_57, _toDisplayString(item.portfolio_name || "-"), 1)
                            ]),
                            _createElementVNode("p", _hoisted_58, [
                              _createElementVNode("span", {
                                style: _normalizeStyle(amountMaskStyle())
                              }, _toDisplayString(renderAmount(toNumber(item.delta_amount))), 5)
                            ])
                          ])
                        ]);
                      }), 128))
                    ])) : (_openBlock(), _createElementBlock("p", _hoisted_59, "No losers yet."))
                  ])
                ])
              ]),
              _createElementVNode("section", _hoisted_60, [
                _cache[12] || (_cache[12] = _createElementVNode("h3", { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" }, "Return Delta Movers", -1)),
                _createElementVNode("div", _hoisted_61, [
                  _createElementVNode("div", null, [
                    _cache[10] || (_cache[10] = _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600 dark:text-emerald-300" }, "Top 3", -1)),
                    quickInsight.value.return_movers.top_gainers.length ? (_openBlock(), _createElementBlock("ul", _hoisted_62, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(quickInsight.value.return_movers.top_gainers, (item) => {
                        return _openBlock(), _createElementBlock("li", {
                          key: `return-gain-${item.key}`,
                          class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800"
                        }, [
                          _createElementVNode("div", _hoisted_63, [
                            _createElementVNode("div", _hoisted_64, [
                              _createElementVNode("div", _hoisted_65, [
                                _createElementVNode("p", _hoisted_66, _toDisplayString(item.label), 1),
                                item.display_class ? (_openBlock(), _createElementBlock("span", {
                                  key: 0,
                                  class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", displayClassBadgeClass(item.display_class)])
                                }, _toDisplayString(displayClassLabel(item.display_class)), 3)) : _createCommentVNode("", true)
                              ]),
                              _createElementVNode("p", _hoisted_67, _toDisplayString(item.portfolio_name || "-"), 1)
                            ]),
                            _createElementVNode("p", _hoisted_68, _toDisplayString(renderReturn(item.delta_return_pct)), 1)
                          ])
                        ]);
                      }), 128))
                    ])) : (_openBlock(), _createElementBlock("p", _hoisted_69, "No movers yet."))
                  ]),
                  _createElementVNode("div", null, [
                    _cache[11] || (_cache[11] = _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-rose-500 dark:text-rose-300" }, "Bottom 3", -1)),
                    quickInsight.value.return_movers.top_losers.length ? (_openBlock(), _createElementBlock("ul", _hoisted_70, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(quickInsight.value.return_movers.top_losers, (item) => {
                        return _openBlock(), _createElementBlock("li", {
                          key: `return-loss-${item.key}`,
                          class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800"
                        }, [
                          _createElementVNode("div", _hoisted_71, [
                            _createElementVNode("div", _hoisted_72, [
                              _createElementVNode("div", _hoisted_73, [
                                _createElementVNode("p", _hoisted_74, _toDisplayString(item.label), 1),
                                item.display_class ? (_openBlock(), _createElementBlock("span", {
                                  key: 0,
                                  class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", displayClassBadgeClass(item.display_class)])
                                }, _toDisplayString(displayClassLabel(item.display_class)), 3)) : _createCommentVNode("", true)
                              ]),
                              _createElementVNode("p", _hoisted_75, _toDisplayString(item.portfolio_name || "-"), 1)
                            ]),
                            _createElementVNode("p", _hoisted_76, _toDisplayString(renderReturn(item.delta_return_pct)), 1)
                          ])
                        ]);
                      }), 128))
                    ])) : (_openBlock(), _createElementBlock("p", _hoisted_77, "No losers yet."))
                  ])
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_78, [
              _createElementVNode("section", _hoisted_79, [
                _cache[13] || (_cache[13] = _createElementVNode("h3", { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" }, "Portfolio Changes", -1)),
                _createElementVNode("p", _hoisted_80, _toDisplayString(portfolioChangeTitle.value), 1),
                portfolioChangeItems.value.length ? (_openBlock(), _createElementBlock("ul", _hoisted_81, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolioChangeItems.value, (item) => {
                    return _openBlock(), _createElementBlock("li", {
                      key: `portfolio-change-${item.key}`,
                      class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800"
                    }, [
                      _createElementVNode("div", _hoisted_82, [
                        _createElementVNode("div", _hoisted_83, [
                          _createElementVNode("p", _hoisted_84, _toDisplayString(item.label), 1),
                          _createElementVNode("p", _hoisted_85, [
                            item.status ? (_openBlock(), _createElementBlock("span", {
                              key: 0,
                              class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", insightStatusBadgeClass(item.status)])
                            }, _toDisplayString(item.status), 3)) : _createCommentVNode("", true)
                          ])
                        ]),
                        _createElementVNode("p", {
                          class: _normalizeClass(["text-left text-sm font-semibold sm:text-right", insightDeltaClass(toNumber(item.delta_amount))])
                        }, [
                          _createElementVNode("span", {
                            style: _normalizeStyle(amountMaskStyle())
                          }, _toDisplayString(renderAmount(toNumber(item.delta_amount))), 5)
                        ], 2)
                      ])
                    ]);
                  }), 128))
                ])) : (_openBlock(), _createElementBlock("p", _hoisted_86, "No portfolio changes yet."))
              ]),
              _createElementVNode("section", _hoisted_87, [
                _cache[15] || (_cache[15] = _createElementVNode("h3", { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" }, "Warnings", -1)),
                _createElementVNode("ul", _hoisted_88, [
                  _createElementVNode("li", _hoisted_89, "Stale quotes: " + _toDisplayString(quickInsight.value.warnings.stale_quote_count), 1),
                  _createElementVNode("li", _hoisted_90, [
                    _createElementVNode("div", _hoisted_91, [
                      _createElementVNode("span", null, "Manual quotes: " + _toDisplayString(quickInsight.value.warnings.manual_quote_count), 1),
                      quickInsight.value.warnings.manual_quote_count > 0 ? (_openBlock(), _createElementBlock("button", {
                        key: 0,
                        type: "button",
                        class: "rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700",
                        onClick: _cache[1] || (_cache[1] = ($event) => manualQuotesExpanded.value = !manualQuotesExpanded.value)
                      }, _toDisplayString(manualQuotesExpanded.value ? "Collapse" : "Expand"), 1)) : _createCommentVNode("", true)
                    ]),
                    manualQuotesExpanded.value && quickInsight.value.warnings.manual_quotes.length ? (_openBlock(), _createElementBlock("ul", _hoisted_92, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(quickInsight.value.warnings.manual_quotes, (item) => {
                        return _openBlock(), _createElementBlock("li", {
                          key: `manual-quote-${item.key}`,
                          class: "rounded-lg bg-white/70 px-2 py-2 dark:bg-slate-900/40"
                        }, [
                          _createElementVNode("div", _hoisted_93, [
                            _createElementVNode("div", _hoisted_94, [
                              _createElementVNode("div", _hoisted_95, [
                                _createElementVNode("p", _hoisted_96, _toDisplayString(item.label), 1),
                                item.display_class ? (_openBlock(), _createElementBlock("span", {
                                  key: 0,
                                  class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", displayClassBadgeClass(item.display_class)])
                                }, _toDisplayString(displayClassLabel(item.display_class)), 3)) : _createCommentVNode("", true)
                              ]),
                              _createElementVNode("p", _hoisted_97, [
                                _createTextVNode(_toDisplayString(item.portfolio_name || "-"), 1),
                                item.symbol ? (_openBlock(), _createElementBlock("span", _hoisted_98, " · " + _toDisplayString(item.symbol), 1)) : _createCommentVNode("", true)
                              ])
                            ]),
                            _createElementVNode("p", _hoisted_99, _toDisplayString(formatDateTime(item.quote_as_of)), 1)
                          ])
                        ]);
                      }), 128))
                    ])) : _createCommentVNode("", true)
                  ]),
                  _createElementVNode("li", _hoisted_100, [
                    _createElementVNode("div", _hoisted_101, [
                      _createElementVNode("span", null, "Missing quotes: " + _toDisplayString(quickInsight.value.warnings.missing_quote_count), 1),
                      quickInsight.value.warnings.missing_quote_count > 0 ? (_openBlock(), _createElementBlock("button", {
                        key: 0,
                        type: "button",
                        class: "rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700",
                        onClick: _cache[2] || (_cache[2] = ($event) => missingQuotesExpanded.value = !missingQuotesExpanded.value)
                      }, _toDisplayString(missingQuotesExpanded.value ? "Collapse" : "Expand"), 1)) : _createCommentVNode("", true)
                    ]),
                    missingQuotesExpanded.value && quickInsight.value.warnings.missing_quotes.length ? (_openBlock(), _createElementBlock("ul", _hoisted_102, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(quickInsight.value.warnings.missing_quotes, (item) => {
                        return _openBlock(), _createElementBlock("li", {
                          key: `missing-quote-${item.key}`,
                          class: "rounded-lg bg-white/70 px-2 py-2 dark:bg-slate-900/40"
                        }, [
                          _createElementVNode("div", _hoisted_103, [
                            _createElementVNode("div", _hoisted_104, [
                              _createElementVNode("div", _hoisted_105, [
                                _createElementVNode("p", _hoisted_106, _toDisplayString(item.label), 1),
                                item.display_class ? (_openBlock(), _createElementBlock("span", {
                                  key: 0,
                                  class: _normalizeClass(["inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold", displayClassBadgeClass(item.display_class)])
                                }, _toDisplayString(displayClassLabel(item.display_class)), 3)) : _createCommentVNode("", true)
                              ]),
                              _createElementVNode("p", _hoisted_107, [
                                _createTextVNode(_toDisplayString(item.portfolio_name || "-"), 1),
                                item.symbol ? (_openBlock(), _createElementBlock("span", _hoisted_108, " · " + _toDisplayString(item.symbol), 1)) : _createCommentVNode("", true)
                              ]),
                              _cache[14] || (_cache[14] = _createElementVNode("p", { class: "mt-0.5 text-slate-500 dark:text-slate-400" }, "No current quote available", -1))
                            ])
                          ])
                        ]);
                      }), 128))
                    ])) : _createCommentVNode("", true)
                  ])
                ])
              ])
            ])
          ])) : _createCommentVNode("", true)
        ])) : (_openBlock(), _createElementBlock("p", _hoisted_109, [..._cache[16] || (_cache[16] = [
          _createTextVNode(" Collapsed. Click ", -1),
          _createElementVNode("span", { class: "font-semibold" }, "Expand", -1),
          _createTextVNode(" to view snapshot delta insight. ", -1)
        ])]))
      ]);
    };
  }
});

const {computed,ref} = await importShared('vue');

function toNumber(value) {
  if (value == null) return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}
function toNullable(value) {
  if (value == null) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}
function parsePortfolioId(key) {
  if (key === "ALL") return void 0;
  const parsed = Number(key);
  return Number.isFinite(parsed) ? parsed : void 0;
}
function useDashboardDataAdapter(options) {
  const summary = ref(null);
  const donutItems = ref([]);
  const donutTotal = ref(0);
  const donutLoading = ref(false);
  const donutError = ref("");
  const treemapItems = ref([]);
  const treemapLoading = ref(false);
  const treemapError = ref("");
  const trendPoints = ref([]);
  const trendLoading = ref(false);
  const trendError = ref("");
  const kpiGrossProfit = computed(
    () => summary.value ? summary.value.gross - summary.value.invested : 0
  );
  const kpiNetProfit = computed(
    () => summary.value ? summary.value.net - summary.value.debtAdjusted : 0
  );
  const kpiGrossReturn = computed(
    () => summary.value && summary.value.invested > 0 ? (summary.value.gross - summary.value.invested) / summary.value.invested * 100 : null
  );
  const kpiNetReturn = computed(
    () => summary.value && summary.value.debtAdjusted > 0 ? (summary.value.net - summary.value.debtAdjusted) / summary.value.debtAdjusted * 100 : null
  );
  async function refreshSummary() {
    summary.value = await options.loadSummary(options.displayCurrency.value);
  }
  async function refreshAllocation() {
    donutLoading.value = true;
    treemapLoading.value = true;
    donutError.value = "";
    treemapError.value = "";
    try {
      const portfolioId = parsePortfolioId(options.portfolioKey.value);
      const out = await options.loadAllocation({
        target: options.target.value,
        portfolioId,
        displayCurrency: options.displayCurrency.value
      });
      donutTotal.value = toNumber(out.total);
      const mapped = out.items.map((item) => {
        const rawReturn = toNullable(item.returnPct);
        const resolved = options.resolveReturnPct ? options.resolveReturnPct(rawReturn, options.target.value, item.key) : rawReturn;
        return {
          key: item.key,
          label: item.label,
          value: toNumber(item.value),
          ratioPct: toNumber(item.ratioPct),
          returnPct: resolved
        };
      });
      donutItems.value = mapped;
      treemapItems.value = mapped;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load allocation";
      donutError.value = message;
      treemapError.value = message;
      donutItems.value = [];
      treemapItems.value = [];
      donutTotal.value = 0;
    } finally {
      donutLoading.value = false;
      treemapLoading.value = false;
    }
  }
  async function refreshTrend() {
    if (!options.loadTrend) {
      trendPoints.value = [];
      trendError.value = "";
      return;
    }
    trendLoading.value = true;
    trendError.value = "";
    try {
      trendPoints.value = await options.loadTrend(options.displayCurrency.value);
    } catch (error) {
      trendPoints.value = [];
      trendError.value = error instanceof Error ? error.message : "Failed to load trend";
    } finally {
      trendLoading.value = false;
    }
  }
  async function refreshAllDashboard() {
    await refreshSummary();
    await Promise.all([refreshAllocation(), refreshTrend()]);
  }
  return {
    summary,
    donutItems,
    donutTotal,
    donutLoading,
    donutError,
    treemapItems,
    treemapLoading,
    treemapError,
    trendPoints,
    trendLoading,
    trendError,
    kpiGrossProfit,
    kpiNetProfit,
    kpiGrossReturn,
    kpiNetReturn,
    refreshSummary,
    refreshAllocation,
    refreshTrend,
    refreshAllDashboard
  };
}

export { _sfc_main$4 as _, _sfc_main$3 as a, _sfc_main$2 as b, _sfc_main$1 as c, _sfc_main as d, getSnapshotHoldingsTable as e, getSnapshotLiabilitiesTable as f, getSnapshotPortfoliosTable as g, getSnapshotSeries as h, captureSnapshot as i, getSnapshots as j, exportSnapshotCsv as k, deleteSnapshots as l, getSnapshotAllocation as m, getSnapshotSummary as n, previewSnapshotCsv as p, useDashboardDataAdapter as u };
