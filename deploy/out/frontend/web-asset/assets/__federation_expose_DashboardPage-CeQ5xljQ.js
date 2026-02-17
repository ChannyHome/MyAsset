import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { g as getSummary } from './analytics-CM2txNIY.js';
import { g as getHoldingsPerformance, a as getLiabilities } from './liabilities-Ca_kTHXz.js';

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,normalizeClass:_normalizeClass,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,vModelText:_vModelText,withDirectives:_withDirectives,renderList:_renderList,Fragment:_Fragment,withModifiers:_withModifiers,vModelSelect:_vModelSelect} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_4 = { class: "flex gap-2" };
const _hoisted_5 = { class: "mt-3 flex flex-wrap items-center gap-2 text-xs" };
const _hoisted_6 = { class: "rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_7 = { class: "rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_8 = { class: "rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_9 = {
  key: 0,
  class: "mt-2 text-xs text-rose-600 dark:text-rose-300"
};
const _hoisted_10 = { class: "mt-3 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_11 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]" };
const _hoisted_12 = { class: "rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-lg" };
const _hoisted_13 = { class: "border-b border-slate-700 p-3" };
const _hoisted_14 = { class: "max-h-[60vh] overflow-y-auto p-3" };
const _hoisted_15 = { class: "mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300" };
const _hoisted_16 = { class: "space-y-1" };
const _hoisted_17 = ["onDragstart", "onDblclick"];
const _hoisted_18 = { class: "block text-sm font-medium text-slate-100" };
const _hoisted_19 = { class: "block text-xs text-slate-400" };
const _hoisted_20 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_21 = {
  key: 0,
  class: "flex h-[360px] items-center justify-center text-sm text-slate-500 dark:text-slate-400"
};
const _hoisted_22 = {
  key: 1,
  class: "grid grid-cols-1 gap-3 md:grid-cols-2"
};
const _hoisted_23 = { class: "mb-3 flex items-center justify-between" };
const _hoisted_24 = { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_25 = ["onClick"];
const _hoisted_26 = {
  key: 0,
  class: "space-y-1 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800"
};
const _hoisted_27 = {
  key: 1,
  class: "space-y-1 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800"
};
const _hoisted_28 = { key: 0 };
const _hoisted_29 = {
  key: 2,
  class: "space-y-1 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800"
};
const _hoisted_30 = { key: 0 };
const _hoisted_31 = {
  key: 3,
  class: "rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800"
};
const _hoisted_32 = {
  key: 4,
  class: "rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800"
};
const _hoisted_33 = {
  key: 5,
  class: "rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800"
};
const _hoisted_34 = { class: "w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_35 = { class: "mb-3 flex items-center justify-between" };
const _hoisted_36 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2" };
const _hoisted_37 = { class: "block text-sm" };
const _hoisted_38 = ["value"];
const _hoisted_39 = { class: "block text-sm" };
const _hoisted_40 = ["value"];
const _hoisted_41 = { class: "mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700" };
const _hoisted_42 = { class: "w-full min-w-[420px] text-left text-sm" };
const _hoisted_43 = { class: "px-3 py-2" };
const _hoisted_44 = { class: "px-3 py-2" };
const _hoisted_45 = { class: "px-3 py-2" };
const _hoisted_46 = { class: "mt-4 flex flex-wrap justify-end gap-2" };
const {computed,onMounted,reactive,ref} = await importShared('vue');
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "DashboardPage",
  setup(__props) {
    function toNumber(value) {
      if (value == null) return 0;
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
      if (value == null || !Number.isFinite(value)) return "-";
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    function formatDateTime(value) {
      if (!value) return "-";
      const dt = new Date(value);
      if (Number.isNaN(dt.getTime())) return value;
      return dt.toLocaleString("ko-KR");
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
          { type: "donut_allocation", label: "Donut Allocation", description: "Top holdings allocation" },
          { type: "treemap_holdings", label: "Treemap Holdings", description: "Size=value, color=PnL%" },
          { type: "networth_line", label: "Networth Line", description: "Snapshot trend (MVP stub)" },
          { type: "dividend_bar_monthly", label: "Dividend Bar", description: "Monthly dividend (MVP stub)" }
        ]
      }
    ];
    const dashboardPresets = [
      {
        id: "default-main",
        name: "Default Main",
        widgets: ["kpi_summary", "donut_allocation", "treemap_holdings", "market_board"],
        note: "Balanced default dashboard"
      },
      {
        id: "income-focus",
        name: "Income Focus",
        widgets: ["kpi_summary", "dividend_bar_monthly", "networth_line", "market_board"],
        note: "Cashflow and trend focus"
      },
      {
        id: "risk-focus",
        name: "Risk Focus",
        widgets: ["kpi_summary", "treemap_holdings", "networth_line"],
        note: "Volatility/weight monitor"
      }
    ];
    const widgetDictionary = new Map(
      toolboxSections.flatMap((section) => section.items).map((item) => [item.type, item])
    );
    const search = ref("");
    const canvasWidgets = ref([
      { id: 1, type: "kpi_summary", label: "KPI Summary" },
      { id: 2, type: "donut_allocation", label: "Donut Allocation" },
      { id: 3, type: "treemap_holdings", label: "Treemap Holdings" }
    ]);
    const nextWidgetId = ref(4);
    const activeDashboardName = ref("Default Main");
    const compareModalOpen = ref(false);
    const compare = reactive({
      left: "default-main",
      right: "income-focus"
    });
    const dataLoading = ref(false);
    const dataError = ref("");
    const summary = ref(null);
    const holdings = ref([]);
    const liabilities = ref([]);
    const displayCurrency = computed(() => summary.value?.display_currency ?? "KRW");
    const topHoldings = computed(
      () => [...holdings.value].sort((a, b) => toNumber(b.evaluated_amount) - toNumber(a.evaluated_amount))
    );
    const top4 = computed(() => topHoldings.value.slice(0, 4));
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
        const [summaryOut, holdingsOut, liabilitiesOut] = await Promise.all([
          getSummary(),
          getHoldingsPerformance(),
          getLiabilities()
        ]);
        summary.value = summaryOut;
        holdings.value = holdingsOut;
        liabilities.value = liabilitiesOut;
      } catch (error) {
        dataError.value = error instanceof Error ? error.message : "Failed to load dashboard data";
      } finally {
        dataLoading.value = false;
      }
    }
    onMounted(loadDashboardData);
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[10] || (_cache[10] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300" }, "Dashboard"),
              _createElementVNode("h1", { class: "mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Dashboard Builder"),
              _createElementVNode("p", { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" }, " WPF toolbox style editing with live asset data connection. ")
            ], -1)),
            _createElementVNode("div", _hoisted_4, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: loadDashboardData
              }, _toDisplayString(dataLoading.value ? "Loading..." : "Refresh Data"), 1),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                onClick: _cache[0] || (_cache[0] = ($event) => compareModalOpen.value = true)
              }, " Compare "),
              _cache[9] || (_cache[9] = _createElementVNode("button", {
                type: "button",
                class: "rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
              }, " Save ", -1))
            ])
          ]),
          _createElementVNode("div", _hoisted_5, [
            _createElementVNode("span", {
              class: _normalizeClass([
                "rounded-full px-2 py-1 font-semibold",
                connectionStatus.value === "connected" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" : connectionStatus.value === "error" ? "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
              ])
            }, " Data: " + _toDisplayString(connectionStatus.value), 3),
            _createElementVNode("span", _hoisted_6, " Holdings: " + _toDisplayString(holdings.value.length), 1),
            _createElementVNode("span", _hoisted_7, " Liabilities: " + _toDisplayString(liabilities.value.length), 1),
            _createElementVNode("span", _hoisted_8, " as_of: " + _toDisplayString(formatDateTime(summary.value?.as_of || null)), 1)
          ]),
          dataError.value ? (_openBlock(), _createElementBlock("p", _hoisted_9, "Error: " + _toDisplayString(dataError.value), 1)) : _createCommentVNode("", true),
          _createElementVNode("p", _hoisted_10, "Current editing dashboard: " + _toDisplayString(activeDashboardName.value), 1)
        ]),
        _createElementVNode("div", _hoisted_11, [
          _createElementVNode("aside", _hoisted_12, [
            _cache[12] || (_cache[12] = _createElementVNode("div", { class: "border-b border-slate-700 px-4 py-3" }, [
              _createElementVNode("p", { class: "text-sm font-semibold" }, "Toolbox"),
              _createElementVNode("p", { class: "mt-0.5 text-xs text-slate-400" }, "Double-click or drag widgets to canvas")
            ], -1)),
            _createElementVNode("div", _hoisted_13, [
              _withDirectives(_createElementVNode("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => search.value = $event),
                type: "text",
                placeholder: "Search toolbox",
                class: "w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 transition focus:ring-2"
              }, null, 512), [
                [_vModelText, search.value]
              ])
            ]),
            _createElementVNode("div", _hoisted_14, [
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(filteredSections.value, (section) => {
                return _openBlock(), _createElementBlock("section", {
                  key: section.title,
                  class: "mb-4"
                }, [
                  _createElementVNode("h2", _hoisted_15, _toDisplayString(section.title), 1),
                  _createElementVNode("div", _hoisted_16, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(section.items, (item) => {
                      return _openBlock(), _createElementBlock("button", {
                        key: item.type,
                        type: "button",
                        draggable: "true",
                        class: "flex w-full items-start gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-left hover:border-indigo-400 hover:bg-slate-800",
                        onDragstart: ($event) => onDragStart($event, item),
                        onDblclick: ($event) => addWidget(item)
                      }, [
                        _cache[11] || (_cache[11] = _createElementVNode("span", { class: "mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded border border-slate-600 text-[10px] text-slate-300" }, " + ", -1)),
                        _createElementVNode("span", null, [
                          _createElementVNode("span", _hoisted_18, _toDisplayString(item.label), 1),
                          _createElementVNode("span", _hoisted_19, _toDisplayString(item.description), 1)
                        ])
                      ], 40, _hoisted_17);
                    }), 128))
                  ])
                ]);
              }), 128))
            ])
          ]),
          _createElementVNode("article", _hoisted_20, [
            _createElementVNode("div", {
              class: "min-h-[420px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/40",
              onDragover: _cache[2] || (_cache[2] = _withModifiers(() => {
              }, ["prevent"])),
              onDrop: _withModifiers(onDropCanvas, ["prevent"])
            }, [
              canvasWidgets.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_21, " Drag widgets from toolbox or double-click to add. ")) : (_openBlock(), _createElementBlock("div", _hoisted_22, [
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(canvasWidgets.value, (widget) => {
                  return _openBlock(), _createElementBlock("div", {
                    key: widget.id,
                    class: "rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
                  }, [
                    _createElementVNode("div", _hoisted_23, [
                      _createElementVNode("p", _hoisted_24, _toDisplayString(widget.label), 1),
                      _createElementVNode("button", {
                        type: "button",
                        class: "rounded-md border border-rose-300 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:border-rose-800 dark:text-rose-300",
                        onClick: ($event) => removeWidget(widget.id)
                      }, " Remove ", 8, _hoisted_25)
                    ]),
                    widget.type === "kpi_summary" ? (_openBlock(), _createElementBlock("div", _hoisted_26, [
                      _createElementVNode("p", null, "Gross: " + _toDisplayString(formatCurrency(toNumber(summary.value?.gross_assets_total), displayCurrency.value)), 1),
                      _createElementVNode("p", null, "Liabilities: " + _toDisplayString(formatCurrency(toNumber(summary.value?.liabilities_total), displayCurrency.value)), 1),
                      _createElementVNode("p", null, "Net: " + _toDisplayString(formatCurrency(toNumber(summary.value?.net_assets_total), displayCurrency.value)), 1)
                    ])) : widget.type === "donut_allocation" ? (_openBlock(), _createElementBlock("div", _hoisted_27, [
                      _cache[13] || (_cache[13] = _createElementVNode("p", { class: "font-semibold" }, "Top allocation", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(top4.value, (item) => {
                        return _openBlock(), _createElementBlock("p", {
                          key: item.holding_id
                        }, _toDisplayString(item.asset_symbol || item.asset_name) + ": " + _toDisplayString(formatPercent(toNumber(item.evaluated_amount) / Math.max(toNumber(summary.value?.net_assets_total), 1) * 100)), 1);
                      }), 128)),
                      top4.value.length === 0 ? (_openBlock(), _createElementBlock("p", _hoisted_28, "No data")) : _createCommentVNode("", true)
                    ])) : widget.type === "treemap_holdings" ? (_openBlock(), _createElementBlock("div", _hoisted_29, [
                      _cache[14] || (_cache[14] = _createElementVNode("p", { class: "font-semibold" }, "Top holdings (value / PnL)", -1)),
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(top4.value, (item) => {
                        return _openBlock(), _createElementBlock("p", {
                          key: item.holding_id
                        }, _toDisplayString(item.asset_symbol || item.asset_name) + " / " + _toDisplayString(formatPercent(toNumber(item.pnl_pct))), 1);
                      }), 128)),
                      top4.value.length === 0 ? (_openBlock(), _createElementBlock("p", _hoisted_30, "No data")) : _createCommentVNode("", true)
                    ])) : widget.type === "networth_line" ? (_openBlock(), _createElementBlock("div", _hoisted_31, " Networth snapshot line will be connected to valuation snapshots API. ")) : widget.type === "dividend_bar_monthly" ? (_openBlock(), _createElementBlock("div", _hoisted_32, " Dividend monthly widget is a planned MVP+ item. ")) : (_openBlock(), _createElementBlock("div", _hoisted_33, " Market board widget is ready for market API binding. "))
                  ]);
                }), 128))
              ]))
            ], 32)
          ])
        ]),
        compareModalOpen.value ? (_openBlock(), _createElementBlock("div", {
          key: 0,
          class: "fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4",
          onClick: _cache[8] || (_cache[8] = _withModifiers(($event) => compareModalOpen.value = false, ["self"]))
        }, [
          _createElementVNode("section", _hoisted_34, [
            _createElementVNode("div", _hoisted_35, [
              _cache[15] || (_cache[15] = _createElementVNode("h2", { class: "text-lg font-semibold text-slate-900 dark:text-slate-100" }, "Dashboard Compare", -1)),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700",
                onClick: _cache[3] || (_cache[3] = ($event) => compareModalOpen.value = false)
              }, " Close ")
            ]),
            _createElementVNode("div", _hoisted_36, [
              _createElementVNode("label", _hoisted_37, [
                _cache[16] || (_cache[16] = _createElementVNode("span", { class: "mb-1 block font-medium text-slate-700 dark:text-slate-200" }, "Left", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => compare.left = $event),
                  class: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(dashboardPresets, (preset) => {
                    return _createElementVNode("option", {
                      key: preset.id,
                      value: preset.id
                    }, _toDisplayString(preset.name), 9, _hoisted_38);
                  }), 64))
                ], 512), [
                  [_vModelSelect, compare.left]
                ])
              ]),
              _createElementVNode("label", _hoisted_39, [
                _cache[17] || (_cache[17] = _createElementVNode("span", { class: "mb-1 block font-medium text-slate-700 dark:text-slate-200" }, "Right", -1)),
                _withDirectives(_createElementVNode("select", {
                  "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => compare.right = $event),
                  class: "w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
                }, [
                  (_openBlock(), _createElementBlock(_Fragment, null, _renderList(dashboardPresets, (preset) => {
                    return _createElementVNode("option", {
                      key: preset.id,
                      value: preset.id
                    }, _toDisplayString(preset.name), 9, _hoisted_40);
                  }), 64))
                ], 512), [
                  [_vModelSelect, compare.right]
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_41, [
              _createElementVNode("table", _hoisted_42, [
                _cache[18] || (_cache[18] = _createElementVNode("thead", { class: "bg-slate-50 dark:bg-slate-800" }, [
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
                      _createElementVNode("td", _hoisted_43, _toDisplayString(row.type), 1),
                      _createElementVNode("td", _hoisted_44, _toDisplayString(row.left ? "O" : "-"), 1),
                      _createElementVNode("td", _hoisted_45, _toDisplayString(row.right ? "O" : "-"), 1)
                    ]);
                  }), 128))
                ])
              ])
            ]),
            _createElementVNode("div", _hoisted_46, [
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700",
                onClick: _cache[6] || (_cache[6] = ($event) => {
                  buildWidgetsFromPreset(compare.left);
                  compareModalOpen.value = false;
                })
              }, " Apply Left "),
              _createElementVNode("button", {
                type: "button",
                class: "rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500",
                onClick: _cache[7] || (_cache[7] = ($event) => {
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
