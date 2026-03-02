import { importShared } from './__federation_fn_import-B1auV5c8.js';

const {defineComponent:_defineComponent$3} = await importShared('vue');

const {toDisplayString:_toDisplayString$3,createElementVNode:_createElementVNode$3,renderSlot:_renderSlot,openBlock:_openBlock$3,createElementBlock:_createElementBlock$3,createCommentVNode:_createCommentVNode$3} = await importShared('vue');

const _hoisted_1$3 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2$3 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_3$3 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4$3 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_5$3 = {
  key: 0,
  class: "mt-4 space-y-3"
};
const _hoisted_6$3 = {
  key: 1,
  class: "mt-3 text-xs text-slate-500 dark:text-slate-400"
};
const _sfc_main$3 = /* @__PURE__ */ _defineComponent$3({
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
      return _openBlock$3(), _createElementBlock$3("article", _hoisted_1$3, [
        _createElementVNode$3("div", _hoisted_2$3, [
          _createElementVNode$3("div", null, [
            _createElementVNode$3("h2", _hoisted_3$3, _toDisplayString$3(props.title), 1),
            _createElementVNode$3("p", _hoisted_4$3, _toDisplayString$3(props.description), 1)
          ]),
          _createElementVNode$3("button", {
            type: "button",
            class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
            onClick: _cache[0] || (_cache[0] = ($event) => emit("toggle"))
          }, _toDisplayString$3(props.expanded ? "Collapse" : "Expand"), 1)
        ]),
        props.expanded ? (_openBlock$3(), _createElementBlock$3("div", _hoisted_5$3, [
          _renderSlot(_ctx.$slots, "controls"),
          _renderSlot(_ctx.$slots, "default")
        ])) : (_openBlock$3(), _createElementBlock$3("p", _hoisted_6$3, _toDisplayString$3(props.collapsedMessage), 1))
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
const _hoisted_5$2 = { class: "flex flex-wrap items-center gap-2 text-xs" };
const _hoisted_6$2 = {
  key: 0,
  class: "inline-flex items-center gap-1 text-slate-600 dark:text-slate-300"
};
const _hoisted_7$2 = ["checked"];
const _hoisted_8$2 = ["value"];
const _hoisted_9$2 = ["value"];
const _hoisted_10$2 = { class: "mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700" };
const _hoisted_11$2 = { class: "min-w-[880px] text-xs" };
const _hoisted_12$2 = { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_13$2 = { class: "sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800" };
const _hoisted_14$2 = { class: "px-3 py-2 text-right" };
const _hoisted_15$2 = { class: "px-3 py-2 text-right" };
const _hoisted_16$2 = { class: "px-3 py-2 text-right" };
const _hoisted_17$2 = { class: "px-3 py-2 text-right" };
const _hoisted_18$2 = { key: 0 };
const _hoisted_19$2 = { key: 1 };
const _hoisted_20$2 = { class: "sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900" };
const _hoisted_21$2 = { class: "font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_22$2 = { class: "text-[11px] text-slate-500 dark:text-slate-400" };
const _hoisted_23$2 = { class: "px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_24$2 = { class: "px-3 py-2 text-right text-slate-700 dark:text-slate-300" };
const _hoisted_25$1 = { class: "mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_26$1 = { class: "inline-flex items-center gap-2" };
const _hoisted_27$1 = ["disabled"];
const _hoisted_28$1 = ["disabled"];
const _hoisted_29$1 = {
  key: 1,
  class: "mt-3 text-sm text-slate-500 dark:text-slate-400"
};
const {computed: computed$3} = await importShared('vue');

const _sfc_main$2 = /* @__PURE__ */ _defineComponent$2({
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
            __props.showFilter && __props.expanded ? (_openBlock$2(), _createElementBlock$2("label", _hoisted_6$2, [
              _createElementVNode$2("input", {
                type: "checkbox",
                checked: __props.portfolioKey === "ALL",
                class: "h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500",
                onChange: _cache[0] || (_cache[0] = ($event) => emit("select-all"))
              }, null, 40, _hoisted_7$2),
              _cache[10] || (_cache[10] = _createElementVNode$2("span", null, "All", -1))
            ])) : _createCommentVNode$2("", true),
            __props.showFilter && __props.expanded ? (_openBlock$2(), _createElementBlock$2("select", {
              key: 1,
              value: __props.portfolioKey,
              class: "rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
              onChange: _cache[1] || (_cache[1] = ($event) => emit("set-portfolio-key", $event.target.value))
            }, [
              _cache[11] || (_cache[11] = _createElementVNode$2("option", { value: "ALL" }, "All portfolios", -1)),
              (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(__props.portfolioOptions, (item) => {
                return _openBlock$2(), _createElementBlock$2("option", {
                  key: `table-portfolio-${item.key}`,
                  value: item.key
                }, _toDisplayString$2(item.label), 9, _hoisted_9$2);
              }), 128))
            ], 40, _hoisted_8$2)) : _createCommentVNode$2("", true),
            _createElementVNode$2("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              onClick: _cache[2] || (_cache[2] = ($event) => emit("toggle"))
            }, _toDisplayString$2(__props.expanded ? "Collapse" : "Expand"), 1)
          ])
        ]),
        __props.expanded ? (_openBlock$2(), _createElementBlock$2(_Fragment$2, { key: 0 }, [
          _createElementVNode$2("div", _hoisted_10$2, [
            _createElementVNode$2("table", _hoisted_11$2, [
              _createElementVNode$2("thead", _hoisted_12$2, [
                _createElementVNode$2("tr", null, [
                  _createElementVNode$2("th", _hoisted_13$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[3] || (_cache[3] = ($event) => emit("sort", "portfolio"))
                    }, " Portfolio " + _toDisplayString$2(sortMark("portfolio")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_14$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[4] || (_cache[4] = ($event) => emit("sort", "current"))
                    }, " Current " + _toDisplayString$2(sortMark("current")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_15$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[5] || (_cache[5] = ($event) => emit("sort", "invested_principal"))
                    }, " Invested " + _toDisplayString$2(sortMark("invested_principal")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_16$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[6] || (_cache[6] = ($event) => emit("sort", "portfolio_profit"))
                    }, " Profit " + _toDisplayString$2(sortMark("portfolio_profit")), 1)
                  ]),
                  _createElementVNode$2("th", _hoisted_17$2, [
                    _createElementVNode$2("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[7] || (_cache[7] = ($event) => emit("sort", "return"))
                    }, " Return " + _toDisplayString$2(sortMark("return")), 1)
                  ])
                ])
              ]),
              _createElementVNode$2("tbody", null, [
                __props.loading ? (_openBlock$2(), _createElementBlock$2("tr", _hoisted_18$2, [..._cache[12] || (_cache[12] = [
                  _createElementVNode$2("td", {
                    colspan: "5",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "Loading portfolios...", -1)
                ])])) : __props.rows.length === 0 ? (_openBlock$2(), _createElementBlock$2("tr", _hoisted_19$2, [..._cache[13] || (_cache[13] = [
                  _createElementVNode$2("td", {
                    colspan: "5",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "No portfolio rows.", -1)
                ])])) : _createCommentVNode$2("", true),
                (_openBlock$2(true), _createElementBlock$2(_Fragment$2, null, _renderList$2(__props.rows, (row) => {
                  return _openBlock$2(), _createElementBlock$2("tr", {
                    key: `p-${row.id}`,
                    class: "border-t border-slate-200 dark:border-slate-800"
                  }, [
                    _createElementVNode$2("td", _hoisted_20$2, [
                      _createElementVNode$2("p", _hoisted_21$2, _toDisplayString$2(row.name), 1),
                      _createElementVNode$2("p", _hoisted_22$2, _toDisplayString$2(row.type || "-"), 1)
                    ]),
                    _createElementVNode$2("td", _hoisted_23$2, [
                      _createElementVNode$2("span", {
                        style: _normalizeStyle$2(maskStyle.value)
                      }, _toDisplayString$2(formatCurrency(row.current, __props.currency)), 5)
                    ]),
                    _createElementVNode$2("td", _hoisted_24$2, [
                      _createElementVNode$2("span", {
                        style: _normalizeStyle$2(maskStyle.value)
                      }, _toDisplayString$2(formatCurrency(row.invested, __props.currency)), 5)
                    ]),
                    _createElementVNode$2("td", {
                      class: _normalizeClass$1(["px-3 py-2 text-right font-semibold", row.profit >= 0 ? "text-emerald-500" : "text-rose-500"])
                    }, [
                      _createElementVNode$2("span", {
                        style: _normalizeStyle$2(maskStyle.value)
                      }, _toDisplayString$2(row.profit >= 0 ? "+" : "") + _toDisplayString$2(formatCurrency(row.profit, __props.currency)), 5)
                    ], 2),
                    _createElementVNode$2("td", {
                      class: _normalizeClass$1(["px-3 py-2 text-right font-semibold", (row.returnPct ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"])
                    }, _toDisplayString$2(formatPercent(row.returnPct)), 3)
                  ]);
                }), 128))
              ])
            ])
          ]),
          _createElementVNode$2("div", _hoisted_25$1, [
            _createElementVNode$2("p", null, "Total: " + _toDisplayString$2(__props.total), 1),
            _createElementVNode$2("div", _hoisted_26$1, [
              _createElementVNode$2("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page <= 1,
                onClick: _cache[8] || (_cache[8] = ($event) => emit("set-page", __props.page - 1))
              }, " Prev ", 8, _hoisted_27$1),
              _createElementVNode$2("span", null, "Page " + _toDisplayString$2(__props.page) + " / " + _toDisplayString$2(maxPage.value), 1),
              _createElementVNode$2("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page >= maxPage.value,
                onClick: _cache[9] || (_cache[9] = ($event) => emit("set-page", __props.page + 1))
              }, " Next ", 8, _hoisted_28$1)
            ])
          ])
        ], 64)) : (_openBlock$2(), _createElementBlock$2("p", _hoisted_29$1, "Collapsed. Click Expand to open Portfolios Table."))
      ]);
    };
  }
});

const {defineComponent:_defineComponent$1} = await importShared('vue');

const {toDisplayString:_toDisplayString$1,createElementVNode:_createElementVNode$1,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1,createCommentVNode:_createCommentVNode$1,renderList:_renderList$1,Fragment:_Fragment$1,normalizeStyle:_normalizeStyle$1,normalizeClass:_normalizeClass} = await importShared('vue');

const _hoisted_1$1 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2$1 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_3$1 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4$1 = { class: "text-sm text-slate-500 dark:text-slate-400" };
const _hoisted_5$1 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_6$1 = ["value"];
const _hoisted_7$1 = { class: "mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700" };
const _hoisted_8$1 = { class: "min-w-[1180px] text-xs" };
const _hoisted_9$1 = { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_10$1 = { class: "sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800" };
const _hoisted_11$1 = { class: "px-3 py-2 text-left" };
const _hoisted_12$1 = { class: "px-3 py-2 text-right" };
const _hoisted_13$1 = { class: "px-3 py-2 text-right" };
const _hoisted_14$1 = { class: "px-3 py-2 text-right" };
const _hoisted_15$1 = { class: "px-3 py-2 text-right" };
const _hoisted_16$1 = { class: "px-3 py-2 text-right" };
const _hoisted_17$1 = { class: "px-3 py-2 text-right" };
const _hoisted_18$1 = { class: "px-3 py-2 text-left" };
const _hoisted_19$1 = { key: 0 };
const _hoisted_20$1 = { key: 1 };
const _hoisted_21$1 = { class: "sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900" };
const _hoisted_22$1 = { class: "px-3 py-2" };
const _hoisted_23$1 = { class: "px-3 py-2 text-right" };
const _hoisted_24$1 = { class: "px-3 py-2 text-right" };
const _hoisted_25 = { class: "px-3 py-2 text-right font-semibold" };
const _hoisted_26 = { class: "px-3 py-2 text-right" };
const _hoisted_27 = { class: "px-3 py-2" };
const _hoisted_28 = { class: "mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_29 = { class: "inline-flex items-center gap-2" };
const _hoisted_30 = ["disabled"];
const _hoisted_31 = ["disabled"];
const _hoisted_32 = {
  key: 1,
  class: "mt-3 text-sm text-slate-500 dark:text-slate-400"
};
const {computed: computed$2} = await importShared('vue');

const _sfc_main$1 = /* @__PURE__ */ _defineComponent$1({
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
              placeholder: "Search holdings...",
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
                      onClick: _cache[3] || (_cache[3] = ($event) => emit("sort", "asset"))
                    }, "Asset " + _toDisplayString$1(sortMark("asset")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_12$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[4] || (_cache[4] = ($event) => emit("sort", "price"))
                    }, "Price " + _toDisplayString$1(sortMark("price")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_13$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[5] || (_cache[5] = ($event) => emit("sort", "avg_cost"))
                    }, "Avg Cost " + _toDisplayString$1(sortMark("avg_cost")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_14$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[6] || (_cache[6] = ($event) => emit("sort", "evaluated"))
                    }, "Evaluated " + _toDisplayString$1(sortMark("evaluated")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_15$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[7] || (_cache[7] = ($event) => emit("sort", "cost_basis"))
                    }, "Cost Basis " + _toDisplayString$1(sortMark("cost_basis")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_16$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[8] || (_cache[8] = ($event) => emit("sort", "profit"))
                    }, "Profit " + _toDisplayString$1(sortMark("profit")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_17$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[9] || (_cache[9] = ($event) => emit("sort", "return"))
                    }, "Return " + _toDisplayString$1(sortMark("return")), 1)
                  ]),
                  _createElementVNode$1("th", _hoisted_18$1, [
                    _createElementVNode$1("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[10] || (_cache[10] = ($event) => emit("sort", "symbol"))
                    }, "Symbol " + _toDisplayString$1(sortMark("symbol")), 1)
                  ])
                ])
              ]),
              _createElementVNode$1("tbody", null, [
                __props.loading ? (_openBlock$1(), _createElementBlock$1("tr", _hoisted_19$1, [..._cache[13] || (_cache[13] = [
                  _createElementVNode$1("td", {
                    colspan: "9",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "Loading holdings...", -1)
                ])])) : __props.rows.length === 0 ? (_openBlock$1(), _createElementBlock$1("tr", _hoisted_20$1, [..._cache[14] || (_cache[14] = [
                  _createElementVNode$1("td", {
                    colspan: "9",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "No holding rows.", -1)
                ])])) : _createCommentVNode$1("", true),
                (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(__props.rows, (row) => {
                  return _openBlock$1(), _createElementBlock$1("tr", {
                    key: `h-${row.id}`,
                    class: "border-t border-slate-200 dark:border-slate-800"
                  }, [
                    _createElementVNode$1("td", _hoisted_21$1, _toDisplayString$1(row.portfolioName), 1),
                    _createElementVNode$1("td", _hoisted_22$1, _toDisplayString$1(row.assetName), 1),
                    _createElementVNode$1("td", _hoisted_23$1, [
                      _createElementVNode$1("span", {
                        style: _normalizeStyle$1(maskStyle.value)
                      }, _toDisplayString$1(formatCurrency(row.price, row.priceCurrency)), 5)
                    ]),
                    _createElementVNode$1("td", _hoisted_24$1, [
                      _createElementVNode$1("span", {
                        style: _normalizeStyle$1(maskStyle.value)
                      }, _toDisplayString$1(formatCurrency(row.avgCost, row.avgCostCurrency)), 5)
                    ]),
                    _createElementVNode$1("td", _hoisted_25, [
                      _createElementVNode$1("span", {
                        style: _normalizeStyle$1(maskStyle.value)
                      }, _toDisplayString$1(formatCurrency(row.evaluated, __props.displayCurrency)), 5)
                    ]),
                    _createElementVNode$1("td", _hoisted_26, [
                      _createElementVNode$1("span", {
                        style: _normalizeStyle$1(maskStyle.value)
                      }, _toDisplayString$1(formatCurrency(row.costBasis, __props.displayCurrency)), 5)
                    ]),
                    _createElementVNode$1("td", {
                      class: _normalizeClass(["px-3 py-2 text-right font-semibold", row.profit >= 0 ? "text-emerald-500" : "text-rose-500"])
                    }, [
                      _createElementVNode$1("span", {
                        style: _normalizeStyle$1(maskStyle.value)
                      }, _toDisplayString$1(row.profit >= 0 ? "+" : "") + _toDisplayString$1(formatCurrency(row.profit, __props.displayCurrency)), 5)
                    ], 2),
                    _createElementVNode$1("td", {
                      class: _normalizeClass(["px-3 py-2 text-right font-semibold", (row.returnPct ?? 0) >= 0 ? "text-emerald-500" : "text-rose-500"])
                    }, _toDisplayString$1(formatPercent(row.returnPct)), 3),
                    _createElementVNode$1("td", _hoisted_27, _toDisplayString$1(row.symbol || "-"), 1)
                  ]);
                }), 128))
              ])
            ])
          ]),
          _createElementVNode$1("div", _hoisted_28, [
            _createElementVNode$1("p", null, "Total: " + _toDisplayString$1(__props.total), 1),
            _createElementVNode$1("div", _hoisted_29, [
              _createElementVNode$1("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page <= 1,
                onClick: _cache[11] || (_cache[11] = ($event) => emit("set-page", __props.page - 1))
              }, " Prev ", 8, _hoisted_30),
              _createElementVNode$1("span", null, "Page " + _toDisplayString$1(__props.page) + " / " + _toDisplayString$1(maxPage.value), 1),
              _createElementVNode$1("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page >= maxPage.value,
                onClick: _cache[12] || (_cache[12] = ($event) => emit("set-page", __props.page + 1))
              }, " Next ", 8, _hoisted_31)
            ])
          ])
        ], 64)) : (_openBlock$1(), _createElementBlock$1("p", _hoisted_32, "Collapsed. Click Expand to open Holdings Table."))
      ]);
    };
  }
});

const {defineComponent:_defineComponent} = await importShared('vue');

const {toDisplayString:_toDisplayString,createElementVNode:_createElementVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,renderList:_renderList,Fragment:_Fragment,normalizeStyle:_normalizeStyle} = await importShared('vue');

const _hoisted_1 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2 = { class: "flex flex-wrap items-center justify-between gap-2" };
const _hoisted_3 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4 = { class: "text-sm text-slate-500 dark:text-slate-400" };
const _hoisted_5 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_6 = ["value"];
const _hoisted_7 = { class: "mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700" };
const _hoisted_8 = { class: "min-w-[780px] text-xs" };
const _hoisted_9 = { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_10 = { class: "sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800" };
const _hoisted_11 = { class: "px-3 py-2 text-left" };
const _hoisted_12 = { class: "px-3 py-2 text-right" };
const _hoisted_13 = { class: "px-3 py-2 text-left" };
const _hoisted_14 = { key: 0 };
const _hoisted_15 = { key: 1 };
const _hoisted_16 = { class: "sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900" };
const _hoisted_17 = { class: "px-3 py-2" };
const _hoisted_18 = { class: "px-3 py-2 text-right font-semibold" };
const _hoisted_19 = { class: "px-3 py-2" };
const _hoisted_20 = { class: "mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_21 = { class: "inline-flex items-center gap-2" };
const _hoisted_22 = ["disabled"];
const _hoisted_23 = ["disabled"];
const _hoisted_24 = {
  key: 1,
  class: "mt-3 text-sm text-slate-500 dark:text-slate-400"
};
const {computed: computed$1} = await importShared('vue');

const _sfc_main = /* @__PURE__ */ _defineComponent({
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
    const maxPage = computed$1(() => Math.max(1, Math.ceil(props.total / props.pageSize)));
    const maskStyle = computed$1(() => props.maskAmounts ? { filter: "blur(6px)" } : void 0);
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("article", _hoisted_1, [
        _createElementVNode("div", _hoisted_2, [
          _createElementVNode("div", null, [
            _createElementVNode("h2", _hoisted_3, _toDisplayString(__props.title), 1),
            _createElementVNode("p", _hoisted_4, _toDisplayString(__props.subtitle), 1)
          ]),
          _createElementVNode("div", _hoisted_5, [
            __props.expanded ? (_openBlock(), _createElementBlock("input", {
              key: 0,
              value: __props.searchTerm,
              type: "text",
              placeholder: "Search liabilities...",
              class: "w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-400/60 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100",
              onInput: _cache[0] || (_cache[0] = ($event) => emit("update:search-term", $event.target.value))
            }, null, 40, _hoisted_6)) : _createCommentVNode("", true),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              onClick: _cache[1] || (_cache[1] = ($event) => emit("toggle"))
            }, _toDisplayString(__props.expanded ? "Collapse" : "Expand"), 1)
          ])
        ]),
        __props.expanded ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
          _createElementVNode("div", _hoisted_7, [
            _createElementVNode("table", _hoisted_8, [
              _createElementVNode("thead", _hoisted_9, [
                _createElementVNode("tr", null, [
                  _createElementVNode("th", _hoisted_10, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[2] || (_cache[2] = ($event) => emit("sort", "portfolio"))
                    }, " Portfolio " + _toDisplayString(sortMark("portfolio")), 1)
                  ]),
                  _createElementVNode("th", _hoisted_11, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[3] || (_cache[3] = ($event) => emit("sort", "liability"))
                    }, " Liability " + _toDisplayString(sortMark("liability")), 1)
                  ]),
                  _createElementVNode("th", _hoisted_12, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[4] || (_cache[4] = ($event) => emit("sort", "balance"))
                    }, " Balance " + _toDisplayString(sortMark("balance")), 1)
                  ]),
                  _createElementVNode("th", _hoisted_13, [
                    _createElementVNode("button", {
                      type: "button",
                      class: "inline-flex items-center gap-1 font-semibold",
                      onClick: _cache[5] || (_cache[5] = ($event) => emit("sort", "type"))
                    }, " Type " + _toDisplayString(sortMark("type")), 1)
                  ])
                ])
              ]),
              _createElementVNode("tbody", null, [
                __props.loading ? (_openBlock(), _createElementBlock("tr", _hoisted_14, [..._cache[8] || (_cache[8] = [
                  _createElementVNode("td", {
                    colspan: "4",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "Loading liabilities...", -1)
                ])])) : __props.rows.length === 0 ? (_openBlock(), _createElementBlock("tr", _hoisted_15, [..._cache[9] || (_cache[9] = [
                  _createElementVNode("td", {
                    colspan: "4",
                    class: "px-3 py-4 text-center text-slate-500 dark:text-slate-400"
                  }, "No liability rows.", -1)
                ])])) : _createCommentVNode("", true),
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.rows, (row) => {
                  return _openBlock(), _createElementBlock("tr", {
                    key: `l-${row.id}`,
                    class: "border-t border-slate-200 dark:border-slate-800"
                  }, [
                    _createElementVNode("td", _hoisted_16, _toDisplayString(row.portfolioName), 1),
                    _createElementVNode("td", _hoisted_17, _toDisplayString(row.name), 1),
                    _createElementVNode("td", _hoisted_18, [
                      _createElementVNode("span", {
                        style: _normalizeStyle(maskStyle.value)
                      }, _toDisplayString(formatCurrency(row.balance, row.balanceCurrency)), 5)
                    ]),
                    _createElementVNode("td", _hoisted_19, _toDisplayString(row.type), 1)
                  ]);
                }), 128))
              ])
            ])
          ]),
          _createElementVNode("div", _hoisted_20, [
            _createElementVNode("p", null, "Total: " + _toDisplayString(__props.total), 1),
            _createElementVNode("div", _hoisted_21, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page <= 1,
                onClick: _cache[6] || (_cache[6] = ($event) => emit("set-page", __props.page - 1))
              }, " Prev ", 8, _hoisted_22),
              _createElementVNode("span", null, "Page " + _toDisplayString(__props.page) + " / " + _toDisplayString(maxPage.value), 1),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                disabled: __props.page >= maxPage.value,
                onClick: _cache[7] || (_cache[7] = ($event) => emit("set-page", __props.page + 1))
              }, " Next ", 8, _hoisted_23)
            ])
          ])
        ], 64)) : (_openBlock(), _createElementBlock("p", _hoisted_24, "Collapsed. Click Expand to open Liabilities Table."))
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

export { _sfc_main$3 as _, _sfc_main$2 as a, _sfc_main$1 as b, _sfc_main as c, useDashboardDataAdapter as u };
