import { h as http } from './datetime-BbzyLRcb.js';
import { importShared } from './__federation_fn_import-B1auV5c8.js';

async function getSummary(params = {}) {
  const { data } = await http.get("/analytics/summary", { params });
  return data;
}
async function getAllocation(params = {}) {
  const { data } = await http.get("/analytics/allocation", { params });
  return data;
}
async function getNetworthSeries(params = {}) {
  const { data } = await http.get("/analytics/networth-series", { params });
  return data;
}
async function collectSnapshots(params = {}) {
  const { data } = await http.post("/analytics/snapshots/collect", null, { params });
  return data;
}

const {defineStore} = await importShared('pinia');

const {ref,watch} = await importShared('vue');

const NAME_CLAMP_STORAGE_KEY = "myasset:ui:name-clamp";
const NAME_CLAMP_EVENT = "myasset:ui:name-clamp-changed";
const useUiStore = defineStore("asset-ui", () => {
  const nameClampEnabled = ref(true);
  const initialized = ref(false);
  let listenersAttached = false;
  function readStoredClamp() {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(NAME_CLAMP_STORAGE_KEY) !== "0";
  }
  function writeStoredClamp(value) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(NAME_CLAMP_STORAGE_KEY, value ? "1" : "0");
  }
  function broadcastClamp(value) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent(NAME_CLAMP_EVENT, {
        detail: { enabled: value }
      })
    );
  }
  function onStorage(event) {
    if (event.key !== NAME_CLAMP_STORAGE_KEY) return;
    const next = event.newValue !== "0";
    if (nameClampEnabled.value !== next) {
      nameClampEnabled.value = next;
    }
  }
  function onBroadcast(event) {
    const custom = event;
    const next = custom.detail?.enabled ?? readStoredClamp();
    if (nameClampEnabled.value !== next) {
      nameClampEnabled.value = next;
      writeStoredClamp(next);
    }
  }
  function attachListeners() {
    if (typeof window === "undefined" || listenersAttached) return;
    window.addEventListener("storage", onStorage);
    window.addEventListener(NAME_CLAMP_EVENT, onBroadcast);
    listenersAttached = true;
  }
  function init() {
    if (initialized.value) return;
    attachListeners();
    nameClampEnabled.value = readStoredClamp();
    initialized.value = true;
  }
  function setNameClampEnabled(value) {
    nameClampEnabled.value = value;
    if (!initialized.value) return;
    writeStoredClamp(value);
    broadcastClamp(value);
  }
  function toggleNameClamp() {
    setNameClampEnabled(!nameClampEnabled.value);
  }
  watch(nameClampEnabled, (next) => {
    if (!initialized.value) return;
    writeStoredClamp(next);
  });
  return {
    nameClampEnabled,
    init,
    setNameClampEnabled,
    toggleNameClamp
  };
});

const {defineComponent:_defineComponent} = await importShared('vue');

const {toDisplayString:_toDisplayString,createElementVNode:_createElementVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,renderList:_renderList,Fragment:_Fragment,createTextVNode:_createTextVNode,normalizeStyle:_normalizeStyle} = await importShared('vue');

const _hoisted_1 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2 = { class: "flex items-start justify-between gap-2" };
const _hoisted_3 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4 = { class: "mt-0.5 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_5 = { class: "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_6 = {
  key: 0,
  class: "mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_7 = {
  key: 1,
  class: "mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_8 = {
  key: 2,
  class: "mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_9 = {
  key: 3,
  class: "mt-3 space-y-3"
};
const _hoisted_10 = { class: "overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700" };
const _hoisted_11 = ["viewBox"];
const _hoisted_12 = ["y1", "y2"];
const _hoisted_13 = ["d"];
const _hoisted_14 = ["d"];
const _hoisted_15 = ["d"];
const _hoisted_16 = { class: "grid grid-cols-1 gap-2 text-xs md:grid-cols-3" };
const _hoisted_17 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_18 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_19 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_20 = { class: "text-[11px] text-slate-500 dark:text-slate-400" };
const {computed} = await importShared('vue');

const chartWidth = 640;
const chartHeight = 220;
const chartPadding = 18;
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "NetworthTrendCard",
  props: {
    title: { default: "Networth Trend" },
    subtitle: { default: "valuation_snapshots" },
    currency: {},
    points: {},
    maskAmounts: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    error: { default: "" }
  },
  setup(__props) {
    const props = __props;
    const allValues = computed(() => {
      const rows = props.points.flatMap((point) => [point.gross, point.liabilities, point.net]);
      if (rows.length === 0) return [0, 1];
      const min = Math.min(...rows);
      const max = Math.max(...rows);
      if (min === max) {
        return [min - 1, max + 1];
      }
      return [min, max];
    });
    const firstPoint = computed(() => props.points.length > 0 ? props.points[0] : null);
    const lastPoint = computed(() => props.points.length > 0 ? props.points[props.points.length - 1] : null);
    function toX(index, total) {
      if (total <= 1) return chartPadding;
      const usable = chartWidth - chartPadding * 2;
      return chartPadding + usable * index / (total - 1);
    }
    function toY(value) {
      const [min, max] = allValues.value;
      const usable = chartHeight - chartPadding * 2;
      const ratio = (value - min) / (max - min || 1);
      return chartHeight - chartPadding - usable * ratio;
    }
    function buildPath(values) {
      if (values.length === 0) return "";
      return values.map((value, index) => `${index === 0 ? "M" : "L"} ${toX(index, values.length)} ${toY(value)}`).join(" ");
    }
    const grossPath = computed(() => buildPath(props.points.map((point) => point.gross)));
    const liabilitiesPath = computed(() => buildPath(props.points.map((point) => point.liabilities)));
    const netPath = computed(() => buildPath(props.points.map((point) => point.net)));
    const ticks = computed(() => {
      const [min, max] = allValues.value;
      const step = (max - min) / 3;
      return [0, 1, 2, 3].map((index) => {
        const value = min + step * index;
        return {
          y: toY(value),
          value
        };
      });
    });
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("article", _hoisted_1, [
        _createElementVNode("div", _hoisted_2, [
          _createElementVNode("div", null, [
            _createElementVNode("h3", _hoisted_3, _toDisplayString(__props.title), 1),
            _createElementVNode("p", _hoisted_4, _toDisplayString(__props.subtitle), 1)
          ]),
          _createElementVNode("span", _hoisted_5, _toDisplayString(__props.currency), 1)
        ]),
        __props.loading ? (_openBlock(), _createElementBlock("div", _hoisted_6, " Loading trend... ")) : __props.error ? (_openBlock(), _createElementBlock("div", _hoisted_7, _toDisplayString(__props.error), 1)) : __props.points.length <= 1 ? (_openBlock(), _createElementBlock("div", _hoisted_8, " Need at least 2 snapshot points to draw trend line. ")) : (_openBlock(), _createElementBlock("div", _hoisted_9, [
          _createElementVNode("div", _hoisted_10, [
            (_openBlock(), _createElementBlock("svg", {
              viewBox: `0 0 ${chartWidth} ${chartHeight}`,
              class: "h-56 w-full min-w-[540px] bg-slate-50 dark:bg-slate-950/40"
            }, [
              _createElementVNode("g", null, [
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(ticks.value, (tick) => {
                  return _openBlock(), _createElementBlock("line", {
                    key: `tick-${tick.y}`,
                    x1: "0",
                    y1: tick.y,
                    x2: chartWidth,
                    y2: tick.y,
                    stroke: "rgba(148, 163, 184, 0.28)",
                    "stroke-width": "1"
                  }, null, 8, _hoisted_12);
                }), 128))
              ]),
              _createElementVNode("path", {
                d: grossPath.value,
                fill: "none",
                stroke: "#0ea5e9",
                "stroke-width": "2.5"
              }, null, 8, _hoisted_13),
              _createElementVNode("path", {
                d: liabilitiesPath.value,
                fill: "none",
                stroke: "#f59e0b",
                "stroke-width": "2.5"
              }, null, 8, _hoisted_14),
              _createElementVNode("path", {
                d: netPath.value,
                fill: "none",
                stroke: "#10b981",
                "stroke-width": "3"
              }, null, 8, _hoisted_15)
            ], 8, _hoisted_11))
          ]),
          _createElementVNode("div", _hoisted_16, [
            _createElementVNode("div", _hoisted_17, [
              _cache[0] || (_cache[0] = _createElementVNode("p", { class: "flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200" }, [
                _createElementVNode("span", { class: "h-2.5 w-2.5 rounded-full bg-sky-500" }),
                _createTextVNode(" Gross ")
              ], -1)),
              _createElementVNode("p", {
                class: "mt-1 text-slate-600 dark:text-slate-300",
                style: _normalizeStyle(props.maskAmounts ? { filter: "blur(6px)" } : void 0)
              }, _toDisplayString(formatCurrency(lastPoint.value?.gross ?? 0, __props.currency)), 5)
            ]),
            _createElementVNode("div", _hoisted_18, [
              _cache[1] || (_cache[1] = _createElementVNode("p", { class: "flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200" }, [
                _createElementVNode("span", { class: "h-2.5 w-2.5 rounded-full bg-amber-500" }),
                _createTextVNode(" Liabilities ")
              ], -1)),
              _createElementVNode("p", {
                class: "mt-1 text-slate-600 dark:text-slate-300",
                style: _normalizeStyle(props.maskAmounts ? { filter: "blur(6px)" } : void 0)
              }, _toDisplayString(formatCurrency(lastPoint.value?.liabilities ?? 0, __props.currency)), 5)
            ]),
            _createElementVNode("div", _hoisted_19, [
              _cache[2] || (_cache[2] = _createElementVNode("p", { class: "flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200" }, [
                _createElementVNode("span", { class: "h-2.5 w-2.5 rounded-full bg-emerald-500" }),
                _createTextVNode(" Net ")
              ], -1)),
              _createElementVNode("p", {
                class: "mt-1 text-slate-600 dark:text-slate-300",
                style: _normalizeStyle(props.maskAmounts ? { filter: "blur(6px)" } : void 0)
              }, _toDisplayString(formatCurrency(lastPoint.value?.net ?? 0, __props.currency)), 5)
            ])
          ]),
          _createElementVNode("p", _hoisted_20, " Range: " + _toDisplayString(firstPoint.value?.label ?? "-") + " -> " + _toDisplayString(lastPoint.value?.label ?? "-"), 1)
        ]))
      ]);
    };
  }
});

export { _sfc_main as _, getAllocation as a, getNetworthSeries as b, collectSnapshots as c, getSummary as g, useUiStore as u };
