import { importShared } from './__federation_fn_import-B1auV5c8.js';

const {defineComponent:_defineComponent} = await importShared('vue');

const {toDisplayString:_toDisplayString,createElementVNode:_createElementVNode,normalizeClass:_normalizeClass,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,renderList:_renderList,Fragment:_Fragment,vModelSelect:_vModelSelect,withDirectives:_withDirectives,createTextVNode:_createTextVNode,vShow:_vShow,normalizeStyle:_normalizeStyle} = await importShared('vue');

const _hoisted_1 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2 = { class: "flex items-start justify-between gap-2" };
const _hoisted_3 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_4 = { class: "mt-0.5 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_5 = { class: "rounded-full bg-slate-100 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-800 dark:text-slate-300" };
const _hoisted_6 = {
  key: 0,
  class: "mt-3 flex flex-wrap items-center gap-2"
};
const _hoisted_7 = {
  key: 0,
  class: "flex items-center gap-2"
};
const _hoisted_8 = ["value"];
const _hoisted_9 = {
  key: 1,
  class: "mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_10 = {
  key: 2,
  class: "mt-3 rounded-xl bg-rose-50 p-3 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200"
};
const _hoisted_11 = {
  key: 3,
  class: "mt-3 rounded-xl bg-slate-100 p-3 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_12 = {
  key: 4,
  class: "mt-3 space-y-3"
};
const _hoisted_13 = {
  key: 0,
  class: "flex flex-wrap items-center gap-4 text-xs"
};
const _hoisted_14 = { class: "inline-flex items-center gap-2" };
const _hoisted_15 = ["checked"];
const _hoisted_16 = { class: "inline-flex items-center gap-2" };
const _hoisted_17 = ["checked"];
const _hoisted_18 = { class: "inline-flex items-center gap-2" };
const _hoisted_19 = ["checked"];
const _hoisted_20 = { class: "grid gap-1 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300" };
const _hoisted_21 = {
  key: 1,
  class: "overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700"
};
const _hoisted_22 = ["viewBox"];
const _hoisted_23 = ["y1", "y2"];
const _hoisted_24 = ["y"];
const _hoisted_25 = ["x1", "x2"];
const _hoisted_26 = ["x", "y"];
const _hoisted_27 = ["d", "stroke"];
const _hoisted_28 = ["cx", "cy", "fill", "onMouseenter", "onClick"];
const _hoisted_29 = {
  key: 2,
  class: "rounded-xl border border-slate-200 bg-slate-100 p-3 text-xs text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_30 = {
  key: 3,
  class: "flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300"
};
const _hoisted_31 = {
  key: 5,
  class: "grid grid-cols-1 gap-2 text-xs md:grid-cols-3"
};
const _hoisted_32 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_33 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_34 = { class: "rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800" };
const _hoisted_35 = {
  key: 6,
  class: "text-[11px] text-slate-500 dark:text-slate-400"
};
const {computed,ref} = await importShared('vue');

const chartWidth = 760;
const chartHeight = 240;
const chartPadding = 56;
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "NetworthTrendCard",
  props: {
    title: { default: "Networth Trend" },
    subtitle: { default: "valuation_snapshots" },
    currency: {},
    points: {},
    maskAmounts: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    error: { default: "" },
    showGross: { type: Boolean, default: true },
    showLiabilities: { type: Boolean, default: true },
    showNet: { type: Boolean, default: true },
    showVisibilityControls: { type: Boolean, default: true },
    mode: { default: "SUMMARY" },
    portfolioMetric: { default: "RETURN" },
    showModeToggle: { type: Boolean, default: true },
    portfolioLines: { default: () => [] },
    portfolioOptions: { default: () => [] },
    portfolioKey: { default: "ALL" },
    showPortfolioSelector: { type: Boolean, default: true }
  },
  emits: ["update:showGross", "update:showLiabilities", "update:showNet", "update:mode", "update:portfolioMetric", "update:portfolioKey"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    const inspectText = ref("");
    const showGrossModel = computed({
      get: () => props.showGross,
      set: (value) => emit("update:showGross", value)
    });
    const showLiabilitiesModel = computed({
      get: () => props.showLiabilities,
      set: (value) => emit("update:showLiabilities", value)
    });
    const showNetModel = computed({
      get: () => props.showNet,
      set: (value) => emit("update:showNet", value)
    });
    const modeModel = computed({
      get: () => props.mode,
      set: (value) => emit("update:mode", value)
    });
    const portfolioMetricModel = computed({
      get: () => props.portfolioMetric,
      set: (value) => emit("update:portfolioMetric", value)
    });
    const portfolioKeyModel = computed({
      get: () => props.portfolioKey,
      set: (value) => emit("update:portfolioKey", value)
    });
    const portfolioPalette = [
      "#a78bfa",
      "#22c55e",
      "#0ea5e9",
      "#f59e0b",
      "#ef4444",
      "#14b8a6",
      "#8b5cf6",
      "#eab308",
      "#f97316",
      "#94a3b8"
    ];
    const renderLines = computed(() => {
      if (props.mode === "PORTFOLIO") {
        const labels = props.points.map((item) => item.label);
        return props.portfolioLines.map((line, index) => {
          const valueByLabel = /* @__PURE__ */ new Map();
          for (const point of line.points) {
            valueByLabel.set(point.snapshot_date, point.value);
          }
          return {
            key: line.key,
            label: line.label,
            color: portfolioPalette[index % portfolioPalette.length] ?? "#94a3b8",
            values: labels.map((label) => valueByLabel.get(label) ?? null)
          };
        });
      }
      const lines = [];
      if (props.showGross) {
        lines.push({
          key: "gross",
          label: "Gross",
          color: "#22c55e",
          values: props.points.map((point) => point.gross)
        });
      }
      if (props.showLiabilities) {
        lines.push({
          key: "liabilities",
          label: "Liabilities",
          color: "#ef4444",
          values: props.points.map((point) => point.liabilities)
        });
      }
      if (props.showNet) {
        lines.push({
          key: "net",
          label: "Net",
          color: "#0ea5e9",
          values: props.points.map((point) => point.net)
        });
      }
      return lines;
    });
    const allValues = computed(() => {
      const rows = renderLines.value.flatMap(
        (line) => line.values.filter((value) => value != null && Number.isFinite(value))
      );
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
      const segments = [];
      let hasStarted = false;
      values.forEach((value, index) => {
        if (value == null || !Number.isFinite(value)) {
          hasStarted = false;
          return;
        }
        const prefix = hasStarted ? "L" : "M";
        segments.push(`${prefix} ${toX(index, values.length)} ${toY(value)}`);
        hasStarted = true;
      });
      return segments.join(" ");
    }
    const linePaths = computed(
      () => renderLines.value.map((line) => ({
        ...line,
        path: buildPath(line.values)
      }))
    );
    function setSummaryMetric(metric, checked) {
      if (metric === "gross") emit("update:showGross", checked);
      if (metric === "liabilities") emit("update:showLiabilities", checked);
      if (metric === "net") emit("update:showNet", checked);
    }
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
    const xTicks = computed(() => {
      const total = props.points.length;
      if (total <= 1) return [];
      const raw = [
        0,
        Math.floor((total - 1) * 0.25),
        Math.floor((total - 1) * 0.5),
        Math.floor((total - 1) * 0.75),
        total - 1
      ];
      const unique = Array.from(new Set(raw)).filter((index) => index >= 0 && index < total);
      return unique.map((index) => ({
        index,
        x: toX(index, total),
        label: props.points[index]?.label ?? ""
      }));
    });
    function pointX(index) {
      return toX(index, props.points.length);
    }
    function formatAxisValue(value) {
      const isAmountAxis = props.mode === "SUMMARY" || props.mode === "PORTFOLIO" && props.portfolioMetric !== "RETURN";
      if (props.maskAmounts && isAmountAxis) {
        return "•••";
      }
      if (props.mode === "PORTFOLIO" && props.portfolioMetric === "RETURN") {
        return `${value.toFixed(1)}%`;
      }
      if ((props.currency || "KRW").toUpperCase() === "KRW") {
        const abs = Math.abs(value);
        const sign = value < 0 ? "-" : "";
        const trim = (num) => num.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
        if (abs >= 1e12) {
          return `${sign}${trim(abs / 1e12)}조`;
        }
        if (abs >= 1e8) {
          return `${sign}${trim(abs / 1e8)}억`;
        }
        if (abs >= 1e4) {
          return `${sign}${trim(abs / 1e4)}만`;
        }
        return `${sign}${Math.round(abs).toLocaleString("ko-KR")}`;
      }
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: props.currency,
        maximumFractionDigits: 2,
        notation: "compact"
      }).format(value || 0);
    }
    function formatCurrency(value, currency) {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    function formatPercent(value) {
      return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
    }
    function formatXAxisLabel(label) {
      const normalized = (label || "").trim();
      if (/^\d{4}-\d{2}-\d{2}$/.test(normalized)) {
        return normalized.slice(5);
      }
      return normalized;
    }
    function inspectPoint(lineLabel, pointLabel, value) {
      inspectText.value = `${lineLabel} · ${pointLabel || "-"} · ${props.mode === "PORTFOLIO" && props.portfolioMetric === "RETURN" ? formatPercent(value) : formatCurrency(value, props.currency)}`;
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
        __props.showModeToggle ? (_openBlock(), _createElementBlock("div", _hoisted_6, [
          _createElementVNode("button", {
            type: "button",
            class: _normalizeClass([
              "rounded-lg border px-3 py-1.5 text-xs font-semibold",
              modeModel.value === "SUMMARY" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            ]),
            onClick: _cache[0] || (_cache[0] = ($event) => modeModel.value = "SUMMARY")
          }, " Summary ", 2),
          _createElementVNode("button", {
            type: "button",
            class: _normalizeClass([
              "rounded-lg border px-3 py-1.5 text-xs font-semibold",
              modeModel.value === "PORTFOLIO" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            ]),
            onClick: _cache[1] || (_cache[1] = ($event) => modeModel.value = "PORTFOLIO")
          }, " Portfolio ", 2),
          modeModel.value === "PORTFOLIO" ? (_openBlock(), _createElementBlock("div", _hoisted_7, [
            _createElementVNode("button", {
              type: "button",
              class: _normalizeClass([
                "rounded-lg border px-3 py-1.5 text-xs font-semibold",
                portfolioMetricModel.value === "CURRENT_VALUE" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              ]),
              onClick: _cache[2] || (_cache[2] = ($event) => portfolioMetricModel.value = "CURRENT_VALUE")
            }, " Current Value ", 2),
            _createElementVNode("button", {
              type: "button",
              class: _normalizeClass([
                "rounded-lg border px-3 py-1.5 text-xs font-semibold",
                portfolioMetricModel.value === "CURRENT_NET" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              ]),
              onClick: _cache[3] || (_cache[3] = ($event) => portfolioMetricModel.value = "CURRENT_NET")
            }, " Current Net ", 2),
            _createElementVNode("button", {
              type: "button",
              class: _normalizeClass([
                "rounded-lg border px-3 py-1.5 text-xs font-semibold",
                portfolioMetricModel.value === "PROFIT" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              ]),
              onClick: _cache[4] || (_cache[4] = ($event) => portfolioMetricModel.value = "PROFIT")
            }, " Profit ", 2),
            _createElementVNode("button", {
              type: "button",
              class: _normalizeClass([
                "rounded-lg border px-3 py-1.5 text-xs font-semibold",
                portfolioMetricModel.value === "RETURN" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              ]),
              onClick: _cache[5] || (_cache[5] = ($event) => portfolioMetricModel.value = "RETURN")
            }, " Return ", 2)
          ])) : _createCommentVNode("", true),
          modeModel.value === "PORTFOLIO" && __props.showPortfolioSelector ? _withDirectives((_openBlock(), _createElementBlock("select", {
            key: 1,
            "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => portfolioKeyModel.value = $event),
            class: "rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
          }, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(__props.portfolioOptions, (item) => {
              return _openBlock(), _createElementBlock("option", {
                key: `trend-portfolio-${item.key}`,
                value: item.key
              }, _toDisplayString(item.label), 9, _hoisted_8);
            }), 128))
          ], 512)), [
            [_vModelSelect, portfolioKeyModel.value]
          ]) : _createCommentVNode("", true)
        ])) : _createCommentVNode("", true),
        __props.loading ? (_openBlock(), _createElementBlock("div", _hoisted_9, " Loading trend... ")) : __props.error ? (_openBlock(), _createElementBlock("div", _hoisted_10, _toDisplayString(__props.error), 1)) : __props.points.length <= 1 ? (_openBlock(), _createElementBlock("div", _hoisted_11, " Need at least 2 snapshot points to draw trend line. ")) : (_openBlock(), _createElementBlock("div", _hoisted_12, [
          modeModel.value === "SUMMARY" && __props.showVisibilityControls ? (_openBlock(), _createElementBlock("div", _hoisted_13, [
            _createElementVNode("label", _hoisted_14, [
              _createElementVNode("input", {
                checked: showGrossModel.value,
                type: "checkbox",
                class: "h-4 w-4 rounded",
                onChange: _cache[7] || (_cache[7] = ($event) => setSummaryMetric("gross", $event.target.checked))
              }, null, 40, _hoisted_15),
              _cache[10] || (_cache[10] = _createTextVNode(" Gross ", -1))
            ]),
            _createElementVNode("label", _hoisted_16, [
              _createElementVNode("input", {
                checked: showLiabilitiesModel.value,
                type: "checkbox",
                class: "h-4 w-4 rounded",
                onChange: _cache[8] || (_cache[8] = ($event) => setSummaryMetric("liabilities", $event.target.checked))
              }, null, 40, _hoisted_17),
              _cache[11] || (_cache[11] = _createTextVNode(" Liabilities ", -1))
            ]),
            _createElementVNode("label", _hoisted_18, [
              _createElementVNode("input", {
                checked: showNetModel.value,
                type: "checkbox",
                class: "h-4 w-4 rounded",
                onChange: _cache[9] || (_cache[9] = ($event) => setSummaryMetric("net", $event.target.checked))
              }, null, 40, _hoisted_19),
              _cache[12] || (_cache[12] = _createTextVNode(" Net ", -1))
            ])
          ])) : _createCommentVNode("", true),
          _createElementVNode("div", _hoisted_20, [
            _cache[14] || (_cache[14] = _createElementVNode("p", null, [
              _createElementVNode("span", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "X-axis:"),
              _createTextVNode(" Snapshot date (valuation history) ")
            ], -1)),
            _createElementVNode("p", null, [
              _cache[13] || (_cache[13] = _createElementVNode("span", { class: "font-semibold text-slate-700 dark:text-slate-200" }, "Y-axis:", -1)),
              _createTextVNode(" " + _toDisplayString(modeModel.value === "SUMMARY" ? `Amount (${__props.currency})` : portfolioMetricModel.value === "RETURN" ? "Return (%)" : portfolioMetricModel.value === "CURRENT_VALUE" ? `Current Value (${__props.currency})` : portfolioMetricModel.value === "CURRENT_NET" ? `Current Net (${__props.currency})` : `Profit (${__props.currency})`), 1)
            ])
          ]),
          linePaths.value.length > 0 ? (_openBlock(), _createElementBlock("div", _hoisted_21, [
            (_openBlock(), _createElementBlock("svg", {
              viewBox: `0 0 ${chartWidth} ${chartHeight}`,
              class: "h-64 w-full min-w-[560px] bg-slate-50 dark:bg-slate-950/40"
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
                  }, null, 8, _hoisted_23);
                }), 128)),
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(ticks.value, (tick) => {
                  return _openBlock(), _createElementBlock("text", {
                    key: `tick-label-${tick.y}`,
                    x: "6",
                    y: tick.y - 2,
                    "text-anchor": "start",
                    "font-size": "10",
                    fill: "rgba(148, 163, 184, 0.95)"
                  }, _toDisplayString(formatAxisValue(tick.value)), 9, _hoisted_24);
                }), 128))
              ]),
              _createElementVNode("g", null, [
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(xTicks.value, (tick) => {
                  return _openBlock(), _createElementBlock("line", {
                    key: `x-grid-${tick.index}`,
                    x1: tick.x,
                    y1: "0",
                    x2: tick.x,
                    y2: chartHeight,
                    stroke: "rgba(148, 163, 184, 0.12)",
                    "stroke-width": "1"
                  }, null, 8, _hoisted_25);
                }), 128)),
                (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(xTicks.value, (tick) => {
                  return _openBlock(), _createElementBlock("text", {
                    key: `x-label-${tick.index}`,
                    x: tick.x,
                    y: chartHeight - 4,
                    "text-anchor": "middle",
                    "font-size": "10",
                    fill: "rgba(148, 163, 184, 0.95)"
                  }, _toDisplayString(formatXAxisLabel(tick.label)), 9, _hoisted_26);
                }), 128))
              ]),
              (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(linePaths.value, (line) => {
                return _openBlock(), _createElementBlock("g", {
                  key: `line-${line.key}`
                }, [
                  _createElementVNode("path", {
                    d: line.path,
                    fill: "none",
                    stroke: line.color,
                    "stroke-width": "2.5"
                  }, null, 8, _hoisted_27),
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(line.values, (value, idx) => {
                    return _withDirectives((_openBlock(), _createElementBlock("circle", {
                      key: `point-${line.key}-${idx}`,
                      cx: pointX(idx),
                      cy: toY(Number(value ?? 0)),
                      r: "3.5",
                      fill: line.color,
                      class: "cursor-pointer",
                      onMouseenter: ($event) => inspectPoint(line.label, __props.points[idx]?.label ?? "-", Number(value ?? 0)),
                      onClick: ($event) => inspectPoint(line.label, __props.points[idx]?.label ?? "-", Number(value ?? 0))
                    }, null, 40, _hoisted_28)), [
                      [_vShow, value != null]
                    ]);
                  }), 128))
                ]);
              }), 128))
            ], 8, _hoisted_22))
          ])) : (_openBlock(), _createElementBlock("div", _hoisted_29, " Not enough points. ")),
          linePaths.value.length > 0 ? (_openBlock(), _createElementBlock("div", _hoisted_30, [
            (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(linePaths.value, (line) => {
              return _openBlock(), _createElementBlock("span", {
                key: `legend-${line.key}`,
                class: "inline-flex items-center gap-1"
              }, [
                _createElementVNode("span", {
                  class: "h-2.5 w-2.5 rounded-full",
                  style: _normalizeStyle({ backgroundColor: line.color })
                }, null, 4),
                _createTextVNode(" " + _toDisplayString(line.label), 1)
              ]);
            }), 128))
          ])) : _createCommentVNode("", true),
          linePaths.value.length > 0 ? (_openBlock(), _createElementBlock("p", {
            key: 4,
            class: "text-xs text-slate-500 dark:text-slate-400",
            style: _normalizeStyle(props.maskAmounts ? { filter: "blur(6px)" } : void 0)
          }, _toDisplayString(inspectText.value || "Hover/click a point to inspect value."), 5)) : _createCommentVNode("", true),
          modeModel.value === "SUMMARY" && linePaths.value.length > 0 ? (_openBlock(), _createElementBlock("div", _hoisted_31, [
            _createElementVNode("div", _hoisted_32, [
              _cache[15] || (_cache[15] = _createElementVNode("p", { class: "flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200" }, [
                _createElementVNode("span", { class: "h-2.5 w-2.5 rounded-full bg-green-500" }),
                _createTextVNode(" Gross ")
              ], -1)),
              _createElementVNode("p", {
                class: "mt-1 text-slate-600 dark:text-slate-300",
                style: _normalizeStyle(props.maskAmounts ? { filter: "blur(6px)" } : void 0)
              }, _toDisplayString(formatCurrency(lastPoint.value?.gross ?? 0, __props.currency)), 5)
            ]),
            _createElementVNode("div", _hoisted_33, [
              _cache[16] || (_cache[16] = _createElementVNode("p", { class: "flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200" }, [
                _createElementVNode("span", { class: "h-2.5 w-2.5 rounded-full bg-rose-500" }),
                _createTextVNode(" Liabilities ")
              ], -1)),
              _createElementVNode("p", {
                class: "mt-1 text-slate-600 dark:text-slate-300",
                style: _normalizeStyle(props.maskAmounts ? { filter: "blur(6px)" } : void 0)
              }, _toDisplayString(formatCurrency(lastPoint.value?.liabilities ?? 0, __props.currency)), 5)
            ]),
            _createElementVNode("div", _hoisted_34, [
              _cache[17] || (_cache[17] = _createElementVNode("p", { class: "flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200" }, [
                _createElementVNode("span", { class: "h-2.5 w-2.5 rounded-full bg-sky-500" }),
                _createTextVNode(" Net ")
              ], -1)),
              _createElementVNode("p", {
                class: "mt-1 text-slate-600 dark:text-slate-300",
                style: _normalizeStyle(props.maskAmounts ? { filter: "blur(6px)" } : void 0)
              }, _toDisplayString(formatCurrency(lastPoint.value?.net ?? 0, __props.currency)), 5)
            ])
          ])) : _createCommentVNode("", true),
          linePaths.value.length > 0 ? (_openBlock(), _createElementBlock("p", _hoisted_35, " Range: " + _toDisplayString(firstPoint.value?.label ?? "-") + " -> " + _toDisplayString(lastPoint.value?.label ?? "-"), 1)) : _createCommentVNode("", true)
        ]))
      ]);
    };
  }
});

export { _sfc_main as _ };
