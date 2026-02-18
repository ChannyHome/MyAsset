import { importShared } from './__federation_fn_import-B1auV5c8.js';

const {defineComponent:_defineComponent$2} = await importShared('vue');

const {toDisplayString:_toDisplayString$2,createElementVNode:_createElementVNode$2,openBlock:_openBlock$2,createElementBlock:_createElementBlock$2,createCommentVNode:_createCommentVNode$2,normalizeStyle:_normalizeStyle$1,renderList:_renderList$1,Fragment:_Fragment$1,normalizeClass:_normalizeClass$1} = await importShared('vue');

const _hoisted_1$2 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2$2 = { class: "flex items-start justify-between gap-2" };
const _hoisted_3$2 = { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4$2 = {
  key: 0,
  class: "mt-0.5 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_5$2 = { class: "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_6$2 = {
  key: 0,
  class: "mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_7$2 = {
  key: 1,
  class: "mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_8$2 = {
  key: 2,
  class: "mt-4 grid min-h-[180px] grid-cols-[192px_minmax(0,1fr)] items-start gap-3"
};
const _hoisted_9$2 = { class: "relative mx-auto h-[12rem] w-[12rem]" };
const _hoisted_10$2 = ["data-donut-stops", "data-donut-start-angle"];
const _hoisted_11$2 = { class: "absolute left-1/2 top-1/2 flex h-[6rem] w-[6rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-slate-200 bg-white px-1 text-center text-[12px] font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200" };
const _hoisted_12$2 = { class: "flex min-w-0 items-center gap-2" };
const _hoisted_13$2 = { class: "truncate text-slate-700 dark:text-slate-200" };
const _hoisted_14$1 = { class: "shrink-0 font-semibold text-slate-700 dark:text-slate-200" };
const _hoisted_15$1 = {
  key: 0,
  class: "rounded-lg bg-slate-50 px-2 py-2 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-400"
};
const {computed: computed$1,onBeforeUnmount,onMounted,ref} = await importShared('vue');

const _sfc_main$2 = /* @__PURE__ */ _defineComponent$2({
  __name: "AllocationDonutCard",
  props: {
    title: {},
    subtitle: { default: "" },
    currency: {},
    total: {},
    items: {},
    startPosition: { default: "TOP" },
    loading: { type: Boolean, default: false },
    error: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const palette = [
      "#0ea5e9",
      "#10b981",
      "#f59e0b",
      "#8b5cf6",
      "#ef4444",
      "#14b8a6",
      "#ec4899",
      "#a3e635",
      "#f97316",
      "#6366f1"
    ];
    const normalizedItems = computed$1(
      () => props.items.filter((item) => Number.isFinite(item.value) && item.ratioPct > 0).map((item, index) => ({
        ...item,
        color: palette[index % palette.length]
      }))
    );
    const viewportWidth = ref(typeof window !== "undefined" ? window.innerWidth : 1280);
    function updateViewportWidth() {
      viewportWidth.value = window.innerWidth;
    }
    onMounted(() => {
      window.addEventListener("resize", updateViewportWidth, { passive: true });
    });
    onBeforeUnmount(() => {
      window.removeEventListener("resize", updateViewportWidth);
    });
    const listScrollThreshold = computed$1(() => {
      if (viewportWidth.value >= 1536) return 16;
      if (viewportWidth.value >= 1280) return 14;
      if (viewportWidth.value >= 1024) return 12;
      if (viewportWidth.value >= 768) return 10;
      return 8;
    });
    const shouldEnableListScroll = computed$1(() => normalizedItems.value.length > listScrollThreshold.value);
    const startAngle = computed$1(() => {
      if (props.startPosition === "RIGHT") return 90;
      if (props.startPosition === "LEFT") return 270;
      return 0;
    });
    const donutExportStops = computed$1(
      () => normalizedItems.value.map((item) => `${Math.max(0, Math.min(100, item.ratioPct)).toFixed(6)}:${item.color}`).join("|")
    );
    const donutStyle = computed$1(() => {
      if (normalizedItems.value.length === 0) {
        return { background: "conic-gradient(#334155 0% 100%)" };
      }
      let cursor = 0;
      const stops = normalizedItems.value.map((item) => {
        const ratio = Math.max(0, Math.min(100, item.ratioPct));
        const start = cursor;
        const end = Math.min(100, cursor + ratio);
        cursor = end;
        return `${item.color} ${start.toFixed(3)}% ${end.toFixed(3)}%`;
      }).join(", ");
      return { background: `conic-gradient(from ${startAngle.value}deg, ${stops})` };
    });
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    function formatPercent(value) {
      return `${value.toFixed(2)}%`;
    }
    return (_ctx, _cache) => {
      return _openBlock$2(), _createElementBlock$2("article", _hoisted_1$2, [
        _createElementVNode$2("div", _hoisted_2$2, [
          _createElementVNode$2("div", null, [
            _createElementVNode$2("h3", _hoisted_3$2, _toDisplayString$2(__props.title), 1),
            __props.subtitle ? (_openBlock$2(), _createElementBlock$2("p", _hoisted_4$2, _toDisplayString$2(__props.subtitle), 1)) : _createCommentVNode$2("", true)
          ]),
          _createElementVNode$2("span", _hoisted_5$2, _toDisplayString$2(__props.currency), 1)
        ]),
        __props.loading ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_6$2, " Loading... ")) : __props.error ? (_openBlock$2(), _createElementBlock$2("div", _hoisted_7$2, _toDisplayString$2(__props.error), 1)) : (_openBlock$2(), _createElementBlock$2("div", _hoisted_8$2, [
          _createElementVNode$2("div", _hoisted_9$2, [
            _createElementVNode$2("div", {
              class: "absolute inset-0 rounded-full shadow-[inset_0_0_0_1px_rgba(15,23,42,0.2)]",
              style: _normalizeStyle$1(donutStyle.value),
              "data-export-donut": "1",
              "data-donut-stops": donutExportStops.value,
              "data-donut-start-angle": String(startAngle.value)
            }, null, 12, _hoisted_10$2),
            _createElementVNode$2("div", _hoisted_11$2, [
              _createElementVNode$2("span", null, _toDisplayString$2(formatCurrency(__props.total, __props.currency)), 1)
            ])
          ]),
          _createElementVNode$2("ul", {
            class: _normalizeClass$1([
              "space-y-1 pr-1",
              shouldEnableListScroll.value ? "max-h-[10rem] overflow-y-auto md:max-h-[11rem] lg:max-h-[12rem] xl:max-h-[13rem]" : ""
            ])
          }, [
            (_openBlock$2(true), _createElementBlock$2(_Fragment$1, null, _renderList$1(normalizedItems.value, (item) => {
              return _openBlock$2(), _createElementBlock$2("li", {
                key: item.key,
                class: "flex items-center justify-between gap-2 rounded-lg bg-slate-50 px-2 py-1 text-xs dark:bg-slate-800"
              }, [
                _createElementVNode$2("span", _hoisted_12$2, [
                  _createElementVNode$2("span", {
                    class: "h-2.5 w-2.5 rounded-full",
                    style: _normalizeStyle$1({ backgroundColor: item.color })
                  }, null, 4),
                  _createElementVNode$2("span", _hoisted_13$2, _toDisplayString$2(item.label), 1)
                ]),
                _createElementVNode$2("span", _hoisted_14$1, _toDisplayString$2(formatPercent(item.ratioPct)), 1)
              ]);
            }), 128)),
            normalizedItems.value.length === 0 ? (_openBlock$2(), _createElementBlock$2("li", _hoisted_15$1, " No allocation data. ")) : _createCommentVNode$2("", true)
          ], 2)
        ]))
      ]);
    };
  }
});

const {defineComponent:_defineComponent$1} = await importShared('vue');

const {toDisplayString:_toDisplayString$1,createElementVNode:_createElementVNode$1,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1,createCommentVNode:_createCommentVNode$1,renderList:_renderList,Fragment:_Fragment,createTextVNode:_createTextVNode$1,normalizeStyle:_normalizeStyle} = await importShared('vue');

const _hoisted_1$1 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2$1 = { class: "flex items-start justify-between gap-2" };
const _hoisted_3$1 = { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4$1 = {
  key: 0,
  class: "mt-0.5 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_5$1 = { class: "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_6$1 = {
  key: 0,
  class: "mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_7$1 = {
  key: 1,
  class: "mt-4 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_8$1 = {
  key: 2,
  class: "mt-4 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_9$1 = {
  key: 3,
  class: "mt-4 space-y-3"
};
const _hoisted_10$1 = { class: "flex min-h-[180px] flex-wrap gap-1.5 rounded-xl bg-slate-950/95 p-1.5" };
const _hoisted_11$1 = { class: "truncate font-semibold" };
const _hoisted_12$1 = { class: "text-[11px] text-white/90" };
const _hoisted_13$1 = {
  key: 0,
  class: "text-[11px] text-slate-500 dark:text-slate-400"
};
const {computed} = await importShared('vue');

const _sfc_main$1 = /* @__PURE__ */ _defineComponent$1({
  __name: "AllocationTreemapCard",
  props: {
    title: {},
    subtitle: { default: "" },
    currency: {},
    items: {},
    loading: { type: Boolean, default: false },
    error: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const palette = [
      "hsl(160, 65%, 36%)",
      "hsl(196, 75%, 36%)",
      "hsl(232, 62%, 40%)",
      "hsl(36, 78%, 42%)",
      "hsl(286, 62%, 42%)",
      "hsl(176, 72%, 34%)",
      "hsl(348, 65%, 38%)"
    ];
    function normalize(min, max, value) {
      const denom = max - min;
      if (!Number.isFinite(denom) || denom === 0) {
        return 1;
      }
      return Math.max(0, Math.min(1, (value - min) / denom));
    }
    function colorForReturn(returnPct, index, range) {
      if (returnPct == null || !Number.isFinite(returnPct)) {
        return palette[index % palette.length] ?? "hsl(215, 14%, 38%)";
      }
      if (returnPct === 0) {
        return "hsl(215, 14%, 38%)";
      }
      if (!range.hasRange) {
        return returnPct > 0 ? "hsl(145, 68%, 32%)" : "hsl(2, 70%, 36%)";
      }
      if (returnPct > 0) {
        const intensity2 = range.max <= 0 ? 0 : range.min >= 0 ? normalize(range.min, range.max, returnPct) : normalize(0, range.max, returnPct);
        const saturation2 = 52 + intensity2 * 34;
        const lightness2 = 44 - intensity2 * 16;
        return `hsl(145, ${saturation2}%, ${lightness2}%)`;
      }
      const intensity = range.min >= 0 ? 0 : range.max <= 0 ? 1 - normalize(range.min, range.max, returnPct) : 1 - normalize(range.min, 0, returnPct);
      const saturation = 54 + intensity * 32;
      const lightness = 46 - intensity * 16;
      return `hsl(2, ${saturation}%, ${lightness}%)`;
    }
    const returnRange = computed(() => {
      const values = props.items.map((item) => item.returnPct).filter((value) => value != null && Number.isFinite(value));
      if (values.length === 0) {
        return { hasRange: false, min: 0, max: 0 };
      }
      return {
        hasRange: true,
        min: Math.min(...values),
        max: Math.max(...values)
      };
    });
    const normalizedItems = computed(
      () => props.items.filter((item) => Number.isFinite(item.value) && item.ratioPct > 0).map((item, index) => ({
        ...item,
        backgroundColor: colorForReturn(item.returnPct, index, returnRange.value),
        weight: Math.max(1, Math.round(item.ratioPct * 100))
      }))
    );
    const returnRangeLabel = computed(() => {
      if (!returnRange.value.hasRange) {
        return null;
      }
      return `${formatSignedPercent(returnRange.value.min)} ~ ${formatSignedPercent(returnRange.value.max)}`;
    });
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    function formatPercent(value) {
      return `${value.toFixed(2)}%`;
    }
    function formatSignedPercent(value) {
      if (value == null || !Number.isFinite(value)) return "-";
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    return (_ctx, _cache) => {
      return _openBlock$1(), _createElementBlock$1("article", _hoisted_1$1, [
        _createElementVNode$1("div", _hoisted_2$1, [
          _createElementVNode$1("div", null, [
            _createElementVNode$1("h3", _hoisted_3$1, _toDisplayString$1(__props.title), 1),
            __props.subtitle ? (_openBlock$1(), _createElementBlock$1("p", _hoisted_4$1, _toDisplayString$1(__props.subtitle), 1)) : _createCommentVNode$1("", true)
          ]),
          _createElementVNode$1("span", _hoisted_5$1, _toDisplayString$1(__props.currency), 1)
        ]),
        __props.loading ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_6$1, " Loading... ")) : __props.error ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_7$1, _toDisplayString$1(__props.error), 1)) : normalizedItems.value.length === 0 ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_8$1, " No holdings allocation data. ")) : (_openBlock$1(), _createElementBlock$1("div", _hoisted_9$1, [
          _createElementVNode$1("div", _hoisted_10$1, [
            (_openBlock$1(true), _createElementBlock$1(_Fragment, null, _renderList(normalizedItems.value, (item) => {
              return _openBlock$1(), _createElementBlock$1("div", {
                key: item.key,
                class: "flex min-h-[64px] min-w-[110px] flex-col justify-between rounded-lg p-2 text-xs text-white",
                style: _normalizeStyle({ flexGrow: item.weight, flexBasis: `${Math.max(18, item.ratioPct)}%`, backgroundColor: item.backgroundColor })
              }, [
                _createElementVNode$1("p", _hoisted_11$1, _toDisplayString$1(item.label), 1),
                _createElementVNode$1("div", _hoisted_12$1, [
                  _createElementVNode$1("p", null, [
                    _createTextVNode$1(_toDisplayString$1(formatPercent(item.ratioPct)) + " ", 1),
                    item.returnPct != null ? (_openBlock$1(), _createElementBlock$1(_Fragment, { key: 0 }, [
                      _createTextVNode$1("| " + _toDisplayString$1(formatSignedPercent(item.returnPct)), 1)
                    ], 64)) : _createCommentVNode$1("", true)
                  ]),
                  _createElementVNode$1("p", null, _toDisplayString$1(formatCurrency(item.value, __props.currency)), 1)
                ])
              ], 4);
            }), 128))
          ]),
          _cache[0] || (_cache[0] = _createElementVNode$1("p", { class: "text-[11px] text-slate-500 dark:text-slate-400" }, " Treemap blocks are sized by allocation ratio. Color represents return (green gain, red loss). ", -1)),
          returnRangeLabel.value ? (_openBlock$1(), _createElementBlock$1("p", _hoisted_13$1, " Return range: " + _toDisplayString$1(returnRangeLabel.value), 1)) : _createCommentVNode$1("", true)
        ]))
      ]);
    };
  }
});

const {defineComponent:_defineComponent} = await importShared('vue');

const {toDisplayString:_toDisplayString,createElementVNode:_createElementVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,normalizeClass:_normalizeClass,createTextVNode:_createTextVNode} = await importShared('vue');

const _hoisted_1 = { class: "rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2 = { class: "flex items-start justify-between gap-2" };
const _hoisted_3 = { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4 = {
  key: 0,
  class: "mt-0.5 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_5 = { class: "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_6 = { class: "mt-4 space-y-3 text-sm" };
const _hoisted_7 = { class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_8 = { class: "font-semibold text-slate-800 dark:text-slate-100" };
const _hoisted_9 = { class: "mt-0.5 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_10 = { class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_11 = { class: "font-semibold text-slate-800 dark:text-slate-100" };
const _hoisted_12 = { class: "rounded-xl bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_13 = { class: "font-semibold text-slate-800 dark:text-slate-100" };
const _hoisted_14 = { class: "mt-0.5 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_15 = {
  key: 0,
  class: "mt-3 text-[11px] text-slate-500 dark:text-slate-400"
};
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "KpiSummaryCard",
  props: {
    currency: {},
    grossAssetsTotal: {},
    liabilitiesTotal: {},
    netAssetsTotal: {},
    investedPrincipalTotal: {},
    principalMinusDebtTotal: {},
    grossReturnPct: { default: null },
    netReturnPct: { default: null },
    grossProfitTotal: {},
    netProfitTotal: {},
    asOf: { default: "" },
    title: { default: "KPI Summary" },
    subtitle: { default: "" }
  },
  setup(__props) {
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(value);
    }
    function formatSignedCurrency(value, currency) {
      const abs = formatCurrency(Math.abs(value), currency);
      if (value > 0) return `+${abs}`;
      if (value < 0) return `-${abs}`;
      return abs;
    }
    function formatSignedPercent(value) {
      if (value == null || !Number.isFinite(value)) return "-";
      const num = Number(value);
      return `${num >= 0 ? "+" : ""}${num.toFixed(2)}%`;
    }
    function toneClass(value) {
      if (value == null || !Number.isFinite(value)) return "text-slate-400";
      if (value > 0) return "text-emerald-400";
      if (value < 0) return "text-rose-400";
      return "text-slate-300";
    }
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("article", _hoisted_1, [
        _createElementVNode("div", _hoisted_2, [
          _createElementVNode("div", null, [
            _createElementVNode("h3", _hoisted_3, _toDisplayString(__props.title), 1),
            __props.subtitle ? (_openBlock(), _createElementBlock("p", _hoisted_4, _toDisplayString(__props.subtitle), 1)) : _createCommentVNode("", true)
          ]),
          _createElementVNode("span", _hoisted_5, _toDisplayString(__props.currency), 1)
        ]),
        _createElementVNode("div", _hoisted_6, [
          _createElementVNode("div", _hoisted_7, [
            _createElementVNode("p", _hoisted_8, [
              _createTextVNode(" Gross: " + _toDisplayString(formatCurrency(__props.grossAssetsTotal, __props.currency)) + " ", 1),
              _createElementVNode("span", {
                class: _normalizeClass(toneClass(__props.grossReturnPct))
              }, "(" + _toDisplayString(formatSignedPercent(__props.grossReturnPct)) + ", " + _toDisplayString(formatSignedCurrency(__props.grossProfitTotal, __props.currency)) + ")", 3)
            ]),
            _createElementVNode("p", _hoisted_9, " vs invested principal (" + _toDisplayString(formatCurrency(__props.investedPrincipalTotal, __props.currency)) + ") ", 1)
          ]),
          _createElementVNode("div", _hoisted_10, [
            _createElementVNode("p", _hoisted_11, " Liabilities: " + _toDisplayString(formatCurrency(__props.liabilitiesTotal, __props.currency)), 1)
          ]),
          _createElementVNode("div", _hoisted_12, [
            _createElementVNode("p", _hoisted_13, [
              _createTextVNode(" Net: " + _toDisplayString(formatCurrency(__props.netAssetsTotal, __props.currency)) + " ", 1),
              _createElementVNode("span", {
                class: _normalizeClass(toneClass(__props.netReturnPct))
              }, "(" + _toDisplayString(formatSignedPercent(__props.netReturnPct)) + ", " + _toDisplayString(formatSignedCurrency(__props.netProfitTotal, __props.currency)) + ")", 3)
            ]),
            _createElementVNode("p", _hoisted_14, " vs principal - debt (" + _toDisplayString(formatCurrency(__props.principalMinusDebtTotal, __props.currency)) + ") ", 1)
          ])
        ]),
        __props.asOf ? (_openBlock(), _createElementBlock("p", _hoisted_15, "as_of: " + _toDisplayString(__props.asOf), 1)) : _createCommentVNode("", true)
      ]);
    };
  }
});

export { _sfc_main as _, _sfc_main$2 as a, _sfc_main$1 as b };
