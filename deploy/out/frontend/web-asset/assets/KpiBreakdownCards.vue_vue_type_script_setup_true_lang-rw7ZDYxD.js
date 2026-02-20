import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { u as useUiStore } from './NetworthTrendCard.vue_vue_type_script_setup_true_lang-DHTjWqU8.js';

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,normalizeClass:_normalizeClass,createTextVNode:_createTextVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,renderList:_renderList,Fragment:_Fragment,unref:_unref} = await importShared('vue');

const _hoisted_1 = { class: "space-y-2" };
const _hoisted_2 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-3" };
const _hoisted_3 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_4 = { class: "flex items-start justify-between gap-2" };
const _hoisted_5 = { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" };
const _hoisted_6 = { class: "mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300" };
const _hoisted_7 = {
  key: 0,
  class: "mt-4 border-t border-slate-200 pt-3 dark:border-slate-700"
};
const _hoisted_8 = {
  key: 0,
  class: "text-sm text-slate-500 dark:text-slate-400"
};
const _hoisted_9 = {
  key: 1,
  class: "max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700"
};
const _hoisted_10 = { class: "min-w-[860px] text-left text-xs" };
const _hoisted_11 = { class: "sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900" };
const _hoisted_12 = ["title"];
const _hoisted_13 = ["title"];
const _hoisted_14 = { class: "px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_15 = { class: "px-3 py-2 text-right text-slate-700 dark:text-slate-300" };
const _hoisted_16 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_17 = { class: "flex items-start justify-between gap-2" };
const _hoisted_18 = { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" };
const _hoisted_19 = {
  key: 0,
  class: "mt-4 border-t border-slate-200 pt-3 dark:border-slate-700"
};
const _hoisted_20 = {
  key: 0,
  class: "text-sm text-slate-500 dark:text-slate-400"
};
const _hoisted_21 = {
  key: 1,
  class: "max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700"
};
const _hoisted_22 = { class: "min-w-[860px] text-left text-xs" };
const _hoisted_23 = { class: "sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 font-semibold text-slate-900 dark:bg-slate-900 dark:text-slate-100" };
const _hoisted_24 = ["title"];
const _hoisted_25 = { class: "px-3 py-2 text-slate-700 dark:text-slate-300" };
const _hoisted_26 = { class: "px-3 py-2 text-slate-700 dark:text-slate-300" };
const _hoisted_27 = { class: "px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_28 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_29 = { class: "flex items-start justify-between gap-2" };
const _hoisted_30 = { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" };
const _hoisted_31 = { class: "mt-2 text-sm font-semibold text-slate-600 dark:text-slate-300" };
const _hoisted_32 = {
  key: 0,
  class: "mt-4 border-t border-slate-200 pt-3 dark:border-slate-700"
};
const _hoisted_33 = {
  key: 0,
  class: "text-sm text-slate-500 dark:text-slate-400"
};
const _hoisted_34 = {
  key: 1,
  class: "max-h-72 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700"
};
const _hoisted_35 = { class: "min-w-[860px] text-left text-xs" };
const _hoisted_36 = { class: "sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900" };
const _hoisted_37 = ["title"];
const _hoisted_38 = ["title"];
const _hoisted_39 = { class: "px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_40 = { class: "px-3 py-2 text-right text-slate-700 dark:text-slate-300" };
const {computed,onMounted,ref} = await importShared('vue');

const {storeToRefs} = await importShared('pinia');
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "KpiBreakdownCards",
  props: {
    displayCurrency: {},
    grossAssetsTotal: {},
    liabilitiesTotal: {},
    netAssetsTotal: {},
    investedPrincipalTotal: {},
    principalMinusDebtTotal: {},
    principalReturnPct: {},
    netAssetsReturnPct: {},
    principalProfitTotal: {},
    netAssetsProfitTotal: {},
    portfolios: {},
    liabilities: {},
    maskAmounts: { type: Boolean }
  },
  setup(__props) {
    const props = __props;
    const grossCollapsed = ref(true);
    const liabilitiesCollapsed = ref(true);
    const netCollapsed = ref(true);
    const uiStore = useUiStore();
    const { nameClampEnabled } = storeToRefs(uiStore);
    function toNumber(value) {
      if (value == null) return 0;
      const num = typeof value === "number" ? value : Number(value);
      return Number.isFinite(num) ? num : 0;
    }
    function toOptionalNumber(value) {
      if (value == null) return null;
      const num = typeof value === "number" ? value : Number(value);
      return Number.isFinite(num) ? num : null;
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
    function formatPercent(value) {
      if (value == null || !Number.isFinite(value)) return "-";
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    function signedValueClass(value) {
      if (value == null || !Number.isFinite(value)) {
        return "text-slate-500 dark:text-slate-400";
      }
      return value >= 0 ? "text-emerald-600" : "text-rose-500";
    }
    const grossPortfolioRows = computed(
      () => [...props.portfolios].sort((a, b) => toNumber(b.gross_assets_total) - toNumber(a.gross_assets_total))
    );
    const netPortfolioRows = computed(
      () => [...props.portfolios].sort((a, b) => toNumber(b.net_assets_total) - toNumber(a.net_assets_total))
    );
    const sortedLiabilityRows = computed(
      () => [...props.liabilities].sort((a, b) => toNumber(b.outstanding_balance) - toNumber(a.outstanding_balance))
    );
    const amountMaskClass = computed(() => props.maskAmounts ? "amount-mask" : void 0);
    onMounted(() => {
      if (typeof uiStore.init === "function") {
        uiStore.init();
      }
    });
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("div", _hoisted_1, [
        _createElementVNode("div", _hoisted_2, [
          _createElementVNode("article", _hoisted_3, [
            _createElementVNode("div", _hoisted_4, [
              _cache[3] || (_cache[3] = _createElementVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Gross Assets (owned assets only)", -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[0] || (_cache[0] = ($event) => grossCollapsed.value = !grossCollapsed.value)
              }, _toDisplayString(grossCollapsed.value ? "Expand" : "Collapse"), 1)
            ]),
            _createElementVNode("p", _hoisted_5, [
              _createElementVNode("span", {
                class: _normalizeClass(amountMaskClass.value)
              }, _toDisplayString(formatCurrency(__props.grossAssetsTotal, __props.displayCurrency)), 3),
              _createElementVNode("span", {
                class: _normalizeClass(["text-base font-semibold", (__props.principalReturnPct ?? 0) >= 0 ? "text-emerald-600" : "text-rose-500"])
              }, [
                _createTextVNode(" ( " + _toDisplayString(formatPercent(__props.principalReturnPct)) + ", ", 1),
                _createElementVNode("span", {
                  class: _normalizeClass(amountMaskClass.value)
                }, _toDisplayString(formatSignedCurrency(__props.principalProfitTotal, __props.displayCurrency)), 3),
                _cache[4] || (_cache[4] = _createTextVNode(" ) ", -1))
              ], 2)
            ]),
            _createElementVNode("p", _hoisted_6, [
              _cache[5] || (_cache[5] = _createTextVNode(" vs invested principal ", -1)),
              _createElementVNode("span", {
                class: _normalizeClass(amountMaskClass.value)
              }, "(" + _toDisplayString(formatCurrency(__props.investedPrincipalTotal, __props.displayCurrency)) + ")", 3)
            ]),
            !grossCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_7, [
              _cache[7] || (_cache[7] = _createElementVNode("p", { class: "mb-2 text-xs text-slate-500 dark:text-slate-400" }, "Sorted by Current (desc)", -1)),
              grossPortfolioRows.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_8, "No portfolio data.")) : (_openBlock(), _createElementBlock("div", _hoisted_9, [
                _createElementVNode("table", _hoisted_10, [
                  _cache[6] || (_cache[6] = _createElementVNode("thead", { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" }, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", { class: "sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 dark:bg-slate-800" }, " Portfolio "),
                      _createElementVNode("th", { class: "px-3 py-2 text-right" }, "Current"),
                      _createElementVNode("th", { class: "px-3 py-2 text-right" }, "Invested Principal"),
                      _createElementVNode("th", { class: "px-3 py-2 text-right" }, "Portfolio Profit"),
                      _createElementVNode("th", { class: "px-3 py-2 text-right" }, "Return")
                    ])
                  ], -1)),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(grossPortfolioRows.value, (row) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: `gross-${row.id}`,
                        class: "border-t border-slate-200 dark:border-slate-800"
                      }, [
                        _createElementVNode("td", _hoisted_11, [
                          _createElementVNode("p", {
                            title: row.name,
                            class: _normalizeClass(["font-semibold text-slate-900 dark:text-slate-100", _unref(nameClampEnabled) ? "name-clamp-2" : void 0])
                          }, _toDisplayString(row.name), 11, _hoisted_12),
                          _createElementVNode("p", {
                            title: row.type,
                            class: "text-[11px] text-slate-500 dark:text-slate-400"
                          }, _toDisplayString(row.type), 9, _hoisted_13)
                        ]),
                        _createElementVNode("td", _hoisted_14, [
                          _createElementVNode("span", {
                            class: _normalizeClass(amountMaskClass.value)
                          }, _toDisplayString(formatCurrency(toNumber(row.gross_assets_total), row.base_currency || __props.displayCurrency)), 3)
                        ]),
                        _createElementVNode("td", _hoisted_15, [
                          _createElementVNode("span", {
                            class: _normalizeClass(amountMaskClass.value)
                          }, _toDisplayString(formatCurrency(toNumber(row.cumulative_deposit_amount), row.base_currency || __props.displayCurrency)), 3)
                        ]),
                        _createElementVNode("td", {
                          class: _normalizeClass(["px-3 py-2 text-right font-semibold", signedValueClass(toNumber(row.portfolio_profit_total ?? row.total_pnl_amount))])
                        }, [
                          _createElementVNode("span", {
                            class: _normalizeClass(amountMaskClass.value)
                          }, _toDisplayString(formatSignedCurrency(toNumber(row.portfolio_profit_total ?? row.total_pnl_amount), row.base_currency || __props.displayCurrency)), 3)
                        ], 2),
                        _createElementVNode("td", {
                          class: _normalizeClass(["px-3 py-2 text-right font-semibold", signedValueClass(toOptionalNumber(row.total_return_pct))])
                        }, _toDisplayString(formatPercent(toOptionalNumber(row.total_return_pct))), 3)
                      ]);
                    }), 128))
                  ])
                ])
              ]))
            ])) : _createCommentVNode("", true)
          ]),
          _createElementVNode("article", _hoisted_16, [
            _createElementVNode("div", _hoisted_17, [
              _cache[8] || (_cache[8] = _createElementVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Liabilities", -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[1] || (_cache[1] = ($event) => liabilitiesCollapsed.value = !liabilitiesCollapsed.value)
              }, _toDisplayString(liabilitiesCollapsed.value ? "Expand" : "Collapse"), 1)
            ]),
            _createElementVNode("p", _hoisted_18, [
              _createElementVNode("span", {
                class: _normalizeClass(amountMaskClass.value)
              }, _toDisplayString(formatCurrency(__props.liabilitiesTotal, __props.displayCurrency)), 3)
            ]),
            _cache[11] || (_cache[11] = _createElementVNode("p", { class: "mt-2 text-sm text-slate-600 dark:text-slate-300" }, "Included liabilities only", -1)),
            !liabilitiesCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_19, [
              _cache[10] || (_cache[10] = _createElementVNode("p", { class: "mb-2 text-xs text-slate-500 dark:text-slate-400" }, "Sorted by Balance (desc)", -1)),
              sortedLiabilityRows.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_20, "No liabilities data.")) : (_openBlock(), _createElementBlock("div", _hoisted_21, [
                _createElementVNode("table", _hoisted_22, [
                  _cache[9] || (_cache[9] = _createElementVNode("thead", { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" }, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", { class: "sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 dark:bg-slate-800" }, " Liability "),
                      _createElementVNode("th", { class: "px-3 py-2" }, "Type"),
                      _createElementVNode("th", { class: "px-3 py-2" }, "Portfolio"),
                      _createElementVNode("th", { class: "px-3 py-2 text-right" }, "Balance")
                    ])
                  ], -1)),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(sortedLiabilityRows.value, (row) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: `liability-${row.id}`,
                        class: "border-t border-slate-200 dark:border-slate-800"
                      }, [
                        _createElementVNode("td", _hoisted_23, [
                          _createElementVNode("span", {
                            title: row.name,
                            class: _normalizeClass(_unref(nameClampEnabled) ? "name-clamp-2" : void 0)
                          }, _toDisplayString(row.name), 11, _hoisted_24)
                        ]),
                        _createElementVNode("td", _hoisted_25, _toDisplayString(row.liability_type), 1),
                        _createElementVNode("td", _hoisted_26, _toDisplayString(row.portfolio_name || "-"), 1),
                        _createElementVNode("td", _hoisted_27, [
                          _createElementVNode("span", {
                            class: _normalizeClass(amountMaskClass.value)
                          }, _toDisplayString(formatCurrency(toNumber(row.outstanding_balance), row.currency || __props.displayCurrency)), 3)
                        ])
                      ]);
                    }), 128))
                  ])
                ])
              ]))
            ])) : _createCommentVNode("", true)
          ]),
          _createElementVNode("article", _hoisted_28, [
            _createElementVNode("div", _hoisted_29, [
              _cache[12] || (_cache[12] = _createElementVNode("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, "Net Assets (assets - liabilities)", -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[2] || (_cache[2] = ($event) => netCollapsed.value = !netCollapsed.value)
              }, _toDisplayString(netCollapsed.value ? "Expand" : "Collapse"), 1)
            ]),
            _createElementVNode("p", _hoisted_30, [
              _createElementVNode("span", {
                class: _normalizeClass(amountMaskClass.value)
              }, _toDisplayString(formatCurrency(__props.netAssetsTotal, __props.displayCurrency)), 3),
              _createElementVNode("span", {
                class: _normalizeClass(["text-base font-semibold", (__props.netAssetsReturnPct ?? 0) >= 0 ? "text-emerald-600" : "text-rose-500"])
              }, [
                _createTextVNode(" ( " + _toDisplayString(formatPercent(__props.netAssetsReturnPct)) + ", ", 1),
                _createElementVNode("span", {
                  class: _normalizeClass(amountMaskClass.value)
                }, _toDisplayString(formatSignedCurrency(__props.netAssetsProfitTotal, __props.displayCurrency)), 3),
                _cache[13] || (_cache[13] = _createTextVNode(" ) ", -1))
              ], 2)
            ]),
            _createElementVNode("p", _hoisted_31, [
              _cache[14] || (_cache[14] = _createTextVNode(" vs debt-adjusted principal ", -1)),
              _createElementVNode("span", {
                class: _normalizeClass(amountMaskClass.value)
              }, "(" + _toDisplayString(formatCurrency(__props.principalMinusDebtTotal, __props.displayCurrency)) + ")", 3)
            ]),
            !netCollapsed.value ? (_openBlock(), _createElementBlock("div", _hoisted_32, [
              _cache[16] || (_cache[16] = _createElementVNode("p", { class: "mb-2 text-xs text-slate-500 dark:text-slate-400" }, "Sorted by Net Current (desc)", -1)),
              netPortfolioRows.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_33, "No portfolio data.")) : (_openBlock(), _createElementBlock("div", _hoisted_34, [
                _createElementVNode("table", _hoisted_35, [
                  _cache[15] || (_cache[15] = _createElementVNode("thead", { class: "bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300" }, [
                    _createElementVNode("tr", null, [
                      _createElementVNode("th", { class: "sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 dark:bg-slate-800" }, " Portfolio "),
                      _createElementVNode("th", { class: "px-3 py-2 text-right" }, "Net Current"),
                      _createElementVNode("th", { class: "px-3 py-2 text-right" }, "Debt-Adjusted Principal"),
                      _createElementVNode("th", { class: "px-3 py-2 text-right" }, "Net Profit"),
                      _createElementVNode("th", { class: "px-3 py-2 text-right" }, "Return")
                    ])
                  ], -1)),
                  _createElementVNode("tbody", null, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(netPortfolioRows.value, (row) => {
                      return _openBlock(), _createElementBlock("tr", {
                        key: `net-${row.id}`,
                        class: "border-t border-slate-200 dark:border-slate-800"
                      }, [
                        _createElementVNode("td", _hoisted_36, [
                          _createElementVNode("p", {
                            title: row.name,
                            class: _normalizeClass(["font-semibold text-slate-900 dark:text-slate-100", _unref(nameClampEnabled) ? "name-clamp-2" : void 0])
                          }, _toDisplayString(row.name), 11, _hoisted_37),
                          _createElementVNode("p", {
                            title: row.type,
                            class: "text-[11px] text-slate-500 dark:text-slate-400"
                          }, _toDisplayString(row.type), 9, _hoisted_38)
                        ]),
                        _createElementVNode("td", _hoisted_39, [
                          _createElementVNode("span", {
                            class: _normalizeClass(amountMaskClass.value)
                          }, _toDisplayString(formatCurrency(toNumber(row.net_assets_total), row.base_currency || __props.displayCurrency)), 3)
                        ]),
                        _createElementVNode("td", _hoisted_40, [
                          _createElementVNode("span", {
                            class: _normalizeClass(amountMaskClass.value)
                          }, _toDisplayString(formatCurrency(toNumber(row.debt_adjusted_principal_total ?? row.principal_minus_debt_total), row.base_currency || __props.displayCurrency)), 3)
                        ]),
                        _createElementVNode("td", {
                          class: _normalizeClass(["px-3 py-2 text-right font-semibold", signedValueClass(toNumber(row.net_assets_profit_total))])
                        }, [
                          _createElementVNode("span", {
                            class: _normalizeClass(amountMaskClass.value)
                          }, _toDisplayString(formatSignedCurrency(toNumber(row.net_assets_profit_total), row.base_currency || __props.displayCurrency)), 3)
                        ], 2),
                        _createElementVNode("td", {
                          class: _normalizeClass(["px-3 py-2 text-right font-semibold", signedValueClass(toOptionalNumber(row.net_assets_return_pct))])
                        }, _toDisplayString(formatPercent(toOptionalNumber(row.net_assets_return_pct))), 3)
                      ]);
                    }), 128))
                  ])
                ])
              ]))
            ])) : _createCommentVNode("", true)
          ])
        ])
      ]);
    };
  }
});

export { _sfc_main as _ };
