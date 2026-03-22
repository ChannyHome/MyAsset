import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http, f as formatDateTimeSeoul, A as AxiosError } from './datetime-D3NoeBy6.js';
import { g as getSummary, a as getNetworthSeries, b as getAllocation } from './ui-DnZ8IxrZ.js';
import { _ as _sfc_main$b } from './KpiBreakdownCards.vue_vue_type_script_setup_true_lang-8Ho99rjW.js';
import { _ as _sfc_main$3, a as _sfc_main$4, b as _sfc_main$5, c as _sfc_main$6 } from './KpiPortfolioSummaryCard.vue_vue_type_script_setup_true_lang-DcBqJiKv.js';
import { _ as _sfc_main$7 } from './NetworthTrendCard.vue_vue_type_script_setup_true_lang-DwR4Hfe0.js';
import { u as useDashboardDataAdapter, _ as _sfc_main$2, a as _sfc_main$8, b as _sfc_main$9, c as _sfc_main$a, d as _sfc_main$c } from './useDashboardDataAdapter-JUoP73Tx.js';
import { g as getHoldingsPerformance, a as getHoldingsTable } from './holdings-D-iv7-uK.js';
import { g as getLiabilitiesTable, a as getPortfoliosTable } from './portfolios-r6VxmkS0.js';
import { u as updateQuotesNow, g as getMe, a as getReleaseNotes, b as getQuoteUpdateJobStatus } from './quotes-OIhGiauY.js';
import { u as useDisplayCurrency } from './useDisplayCurrency-HdS6Uz1W.js';

async function getMyGoalTarget(params) {
  const { data } = await http.get("/users/me/goal-target", { params });
  return data;
}
async function updateMyGoalTarget(payload) {
  const { data } = await http.put("/users/me/goal-target", payload);
  return data;
}
async function getGoalProgress(params) {
  const { data } = await http.get("/analytics/goal-progress", { params });
  return data;
}

const {defineComponent:_defineComponent$1} = await importShared('vue');

const {toDisplayString:_toDisplayString$1,createElementVNode:_createElementVNode$1,openBlock:_openBlock$1,createElementBlock:_createElementBlock$1,createCommentVNode:_createCommentVNode$1,vModelCheckbox:_vModelCheckbox$1,withDirectives:_withDirectives$1,normalizeStyle:_normalizeStyle$1,normalizeClass:_normalizeClass$1,createTextVNode:_createTextVNode$1,renderList:_renderList$1,Fragment:_Fragment$1,vModelText:_vModelText} = await importShared('vue');

const _hoisted_1$1 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_2$1 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_3$1 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_4$1 = { class: "text-base font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_5$1 = ["aria-expanded"];
const _hoisted_6$1 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_7$1 = {
  key: 0,
  class: "mt-3 max-w-xl rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
};
const _hoisted_8$1 = { class: "flex items-center gap-3" };
const _hoisted_9$1 = { class: "inline-flex items-center gap-2 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200" };
const _hoisted_10$1 = {
  key: 0,
  class: "mt-3 space-y-1"
};
const _hoisted_11$1 = { class: "text-sm font-medium text-slate-700 dark:text-slate-200" };
const _hoisted_12$1 = {
  key: 1,
  class: "mt-4 space-y-4"
};
const _hoisted_13$1 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_14$1 = {
  key: 1,
  class: "rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-100"
};
const _hoisted_15$1 = {
  key: 2,
  class: "rounded-xl bg-slate-50 p-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_16$1 = {
  key: 3,
  class: "space-y-4"
};
const _hoisted_17$1 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-[minmax(0,360px)_minmax(0,1fr)]" };
const _hoisted_18$1 = { class: "rounded-2xl border border-slate-700 bg-slate-950/90 p-4" };
const _hoisted_19$1 = { class: "mx-auto max-w-[360px]" };
const _hoisted_20$1 = ["d"];
const _hoisted_21$1 = ["d"];
const _hoisted_22$1 = ["x2", "y2"];
const _hoisted_23$1 = ["cx", "cy"];
const _hoisted_24$1 = { class: "-mt-3 text-center" };
const _hoisted_25$1 = { class: "text-[11px] uppercase tracking-[0.28em] text-slate-400" };
const _hoisted_26$1 = { class: "mt-1 text-sm text-slate-300" };
const _hoisted_27$1 = { class: "mt-3 text-xs text-slate-400" };
const _hoisted_28$1 = { class: "space-y-4" };
const _hoisted_29$1 = {
  key: 0,
  class: "rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600 dark:border-slate-700 dark:bg-slate-800/70 dark:text-slate-300"
};
const _hoisted_30$1 = { class: "grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4" };
const _hoisted_31$1 = { class: "rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800" };
const _hoisted_32$1 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_33$1 = { class: "rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800" };
const _hoisted_34$1 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_35$1 = { class: "rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800" };
const _hoisted_36$1 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_37$1 = { class: "rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800" };
const _hoisted_38$1 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_39$1 = { class: "rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/70" };
const _hoisted_40$1 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_41$1 = { class: "rounded-full bg-slate-200 px-2 py-0.5 text-[11px] text-slate-600 dark:bg-slate-700 dark:text-slate-300" };
const _hoisted_42$1 = { class: "mt-4 grid grid-cols-1 gap-3 md:grid-cols-3" };
const _hoisted_43$1 = { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" };
const _hoisted_44$1 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_45$1 = { class: "mt-4 text-sm text-slate-700 dark:text-slate-200" };
const _hoisted_46$1 = { class: "rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900" };
const _hoisted_47$1 = { class: "flex flex-wrap items-center justify-between gap-3" };
const _hoisted_48$1 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_49$1 = ["aria-expanded"];
const _hoisted_50$1 = { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_51$1 = { class: "flex flex-wrap items-center gap-2" };
const _hoisted_52$1 = ["disabled"];
const _hoisted_53$1 = {
  key: 0,
  class: "mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-300"
};
const _hoisted_54$1 = {
  key: 1,
  class: "mt-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100"
};
const _hoisted_55$1 = {
  key: 2,
  class: "mt-4 grid grid-cols-1 gap-3 md:grid-cols-3"
};
const _hoisted_56$1 = { class: "space-y-1 text-sm" };
const _hoisted_57$1 = { class: "space-y-1 text-sm" };
const _hoisted_58$1 = { class: "space-y-1 text-sm" };
const _hoisted_59$1 = {
  key: 3,
  class: "mt-4 grid grid-cols-1 gap-3 md:grid-cols-3"
};
const _hoisted_60$1 = { class: "rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800" };
const _hoisted_61 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_62 = { class: "rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800" };
const _hoisted_63 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_64 = { class: "rounded-xl bg-slate-50 px-4 py-3 dark:bg-slate-800" };
const _hoisted_65 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const {computed: computed$1,onMounted: onMounted$1,reactive: reactive$1,ref: ref$1,watch: watch$1} = await importShared('vue');
const gaugeViewBox = "0 0 360 240";
const _sfc_main$1 = /* @__PURE__ */ _defineComponent$1({
  __name: "GoalProgressForecastCard",
  props: {
    title: { default: "Goal Progress and Forecast" },
    subtitle: { default: "Track progress toward your target wealth." },
    displayCurrency: {},
    scopeType: { default: null },
    scopeId: { default: null },
    amountMask: { type: Boolean, default: false },
    storageKeyPrefix: {}
  },
  setup(__props) {
    const props = __props;
    const loading = ref$1(false);
    const saving = ref$1(false);
    const errorMessage = ref$1("");
    const successMessage = ref$1("");
    const target = ref$1(null);
    const progress = ref$1(null);
    const editMode = ref$1(false);
    const infoOpen = ref$1(false);
    const assumptionsInfoOpen = ref$1(false);
    const form = reactive$1({
      targetAmount: "",
      annualReturnRatePct: "",
      monthlyInvestAmount: ""
    });
    function todayUiState() {
      return {
        expanded: true,
        useNet: false
      };
    }
    const expanded = ref$1(todayUiState().expanded);
    const useNet = ref$1(todayUiState().useNet);
    function loadUiState() {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(`${props.storageKeyPrefix}:ui`);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed.expanded === "boolean") expanded.value = parsed.expanded;
        if (typeof parsed.useNet === "boolean") useNet.value = parsed.useNet;
      } catch {
      }
    }
    function saveUiState() {
      if (typeof window === "undefined") return;
      window.localStorage.setItem(
        `${props.storageKeyPrefix}:ui`,
        JSON.stringify({
          expanded: expanded.value,
          useNet: useNet.value
        })
      );
    }
    function toNumber(value) {
      if (value == null) return 0;
      const parsed = typeof value === "number" ? value : Number(value);
      return Number.isFinite(parsed) ? parsed : 0;
    }
    function formatCurrency(value, currency = "KRW") {
      return new Intl.NumberFormat("ko-KR", {
        style: "currency",
        currency,
        maximumFractionDigits: 0
      }).format(value || 0);
    }
    function formatSignedCurrency(value, currency = "KRW") {
      const absolute = formatCurrency(Math.abs(value), currency);
      if (value > 0) return `+${absolute}`;
      if (value < 0) return `-${absolute}`;
      return absolute;
    }
    function formatPercent(value) {
      if (value == null) return "-";
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return "-";
      return `${parsed >= 0 ? "+" : ""}${parsed.toFixed(2)}%`;
    }
    function formatRatio(value) {
      if (value == null) return "-";
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return "-";
      return `${Math.max(0, parsed).toFixed(1)}%`;
    }
    function formatProjectedDate(value) {
      if (!value) return "-";
      return value;
    }
    function formatAsOf(value) {
      return formatDateTimeSeoul(value);
    }
    function amountMaskStyle() {
      return props.amountMask ? { filter: "blur(6px)" } : void 0;
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
    function populateForm(next) {
      form.targetAmount = next?.configured && next.target_amount != null ? String(toNumber(next.target_amount)) : "";
      form.annualReturnRatePct = next?.configured && next.annual_return_rate_pct != null ? String(toNumber(next.annual_return_rate_pct)) : "";
      form.monthlyInvestAmount = next?.configured && next.monthly_invest_amount != null ? String(toNumber(next.monthly_invest_amount)) : "";
    }
    const canLoad = computed$1(() => Boolean(props.scopeType && props.scopeId != null));
    const basis = computed$1(() => useNet.value ? "NET" : "GROSS");
    const currentAmount = computed$1(() => toNumber(progress.value?.current_amount));
    const targetAmount = computed$1(() => toNumber(progress.value?.target_amount));
    const progressRatioPct = computed$1(() => {
      const raw = toNumber(progress.value?.progress_ratio_pct);
      return Math.max(0, Math.min(100, raw));
    });
    const remainingAmount = computed$1(() => toNumber(progress.value?.remaining_amount));
    const overTargetAmount = computed$1(() => toNumber(progress.value?.over_target_amount));
    const annualReturnInputValue = computed$1(() => toNumber(target.value?.annual_return_rate_pct));
    const basisLabel = computed$1(() => basis.value === "NET" ? "Net" : "Gross");
    async function refreshCard() {
      if (!canLoad.value || !props.scopeType || props.scopeId == null) {
        target.value = null;
        progress.value = null;
        return;
      }
      loading.value = true;
      errorMessage.value = "";
      successMessage.value = "";
      try {
        const preserveEditState = editMode.value && !saving.value;
        const [targetOut, progressOut] = await Promise.all([
          getMyGoalTarget({
            scope_type: props.scopeType,
            scope_id: props.scopeId,
            display_currency: props.displayCurrency
          }),
          getGoalProgress({
            scope_type: props.scopeType,
            scope_id: props.scopeId,
            display_currency: props.displayCurrency,
            basis: basis.value
          })
        ]);
        target.value = targetOut;
        progress.value = progressOut;
        if (!preserveEditState) {
          populateForm(targetOut);
        }
        editMode.value = targetOut.configured ? preserveEditState : true;
      } catch (error) {
        errorMessage.value = getErrorMessage(error);
      } finally {
        loading.value = false;
      }
    }
    function validateForm() {
      const targetAmountValue = Number(form.targetAmount);
      const annualReturnValue = Number(form.annualReturnRatePct);
      const monthlyInvestValue = Number(form.monthlyInvestAmount);
      if (!Number.isFinite(targetAmountValue) || targetAmountValue <= 0) {
        return "Target amount must be greater than 0.";
      }
      if (!Number.isFinite(annualReturnValue) || annualReturnValue < 0 || annualReturnValue > 100) {
        return "Annual return rate must be between 0 and 100.";
      }
      if (!Number.isFinite(monthlyInvestValue) || monthlyInvestValue < 0) {
        return "Monthly invest amount must be 0 or greater.";
      }
      return "";
    }
    async function saveTarget() {
      if (!props.scopeType || props.scopeId == null) return;
      const validation = validateForm();
      if (validation) {
        errorMessage.value = validation;
        successMessage.value = "";
        return;
      }
      saving.value = true;
      errorMessage.value = "";
      successMessage.value = "";
      try {
        await updateMyGoalTarget({
          scope_type: props.scopeType,
          scope_id: props.scopeId,
          display_currency: props.displayCurrency,
          target_amount: Number(form.targetAmount),
          annual_return_rate_pct: Number(form.annualReturnRatePct),
          monthly_invest_amount: Number(form.monthlyInvestAmount)
        });
        await refreshCard();
        editMode.value = false;
        successMessage.value = "Goal settings saved.";
      } catch (error) {
        errorMessage.value = getErrorMessage(error);
      } finally {
        saving.value = false;
      }
    }
    function resetForm() {
      populateForm(target.value);
      errorMessage.value = "";
      successMessage.value = "";
    }
    function cancelEdit() {
      resetForm();
      if (target.value?.configured) {
        editMode.value = false;
      }
    }
    function toggleExpanded() {
      expanded.value = !expanded.value;
    }
    function polarToCartesian(cx, cy, radius, angleInDegrees) {
      const angleInRadians = angleInDegrees * Math.PI / 180;
      return {
        x: cx + radius * Math.cos(angleInRadians),
        y: cy - radius * Math.sin(angleInRadians)
      };
    }
    function describeArc(cx, cy, radius, startAngle, endAngle) {
      const start = polarToCartesian(cx, cy, radius, endAngle);
      const end = polarToCartesian(cx, cy, radius, startAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return ["M", start.x, start.y, "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y].join(" ");
    }
    const gaugeTrackPath = computed$1(() => describeArc(180, 180, 118, 180, 0));
    const gaugeProgressPath = computed$1(() => {
      const ratio = progressRatioPct.value / 100;
      const endAngle = 180 - 180 * ratio;
      return describeArc(180, 180, 118, 180, endAngle);
    });
    const gaugeNeedleEnd = computed$1(() => {
      const ratio = progressRatioPct.value / 100;
      const angle = 180 - 180 * ratio;
      return polarToCartesian(180, 180, 96, angle);
    });
    const currentMarker = computed$1(() => {
      const ratio = progressRatioPct.value / 100;
      const angle = 180 - 180 * ratio;
      return polarToCartesian(180, 180, 118, angle);
    });
    const progressToneClass = computed$1(() => {
      if (!progress.value?.configured) return "text-slate-300";
      if (progress.value.reached) return "text-emerald-300";
      if (progressRatioPct.value >= 75) return "text-emerald-300";
      if (progressRatioPct.value >= 35) return "text-indigo-300";
      return "text-amber-300";
    });
    const projectedReachLabel = computed$1(() => {
      if (!progress.value?.configured) return "Set a goal to start forecasting.";
      if (progress.value.reached) {
        return `Goal reached. ${formatSignedCurrency(overTargetAmount.value, props.displayCurrency)} above target.`;
      }
      if (progress.value.projected_reach_date && progress.value.projected_months_to_goal != null) {
        return `Estimated reach: ${formatProjectedDate(progress.value.projected_reach_date)} (${formatMonths(progress.value.projected_months_to_goal)}).`;
      }
      return "Not projected to reach the goal within 50 years under current assumptions.";
    });
    const comparisonComment = computed$1(() => {
      if (!progress.value?.configured) return "Save target assumptions to compare them with recent realized growth.";
      if (progress.value.recent_actual_annualized_return_pct == null || progress.value.recent_actual_window_days == null) {
        return "Recent actual growth is unavailable because snapshot history is too short.";
      }
      const actualText = formatPercent(progress.value.recent_actual_annualized_return_pct);
      const assumedText = formatPercent(target.value?.annual_return_rate_pct);
      const base = `Recent actual annualized growth over ${progress.value.recent_actual_window_days} days was ${actualText}.`;
      if (progress.value.comparison_tone === "AHEAD") {
        return `${base} That's above your assumed ${assumedText}.`;
      }
      if (progress.value.comparison_tone === "BEHIND") {
        return `${base} That's below your assumed ${assumedText}.`;
      }
      return `${base} That's broadly in line with your assumed ${assumedText}.`;
    });
    const collapsedSummary = computed$1(() => {
      if (loading.value) return "Loading goal progress...";
      if (!canLoad.value) return "Waiting for Home scope...";
      if (errorMessage.value) return errorMessage.value;
      if (!progress.value?.configured) return "No goal configured yet. Click Expand to set your target.";
      const progressText = formatRatio(progress.value.progress_ratio_pct);
      const basisText = basisLabel.value;
      const targetText = formatCurrency(targetAmount.value, props.displayCurrency);
      if (progress.value.reached) {
        return `${basisText} progress ${progressText}. Goal reached above ${targetText}.`;
      }
      if (progress.value.projected_reach_date) {
        return `${basisText} progress ${progressText}. Estimated reach ${progress.value.projected_reach_date}.`;
      }
      return `${basisText} progress ${progressText}. Goal not projected within 50 years.`;
    });
    function formatMonths(value) {
      if (!Number.isFinite(value) || value < 0) return "-";
      const total = Math.trunc(value);
      const years = Math.floor(total / 12);
      const months = total % 12;
      if (years <= 0) return `${months}m`;
      if (months <= 0) return `${years}y`;
      return `${years}y ${months}m`;
    }
    const milestoneRows = computed$1(() => {
      if (!progress.value?.configured) return [];
      return [
        { label: "3y", amount: toNumber(progress.value.projection_3y) },
        { label: "5y", amount: toNumber(progress.value.projection_5y) },
        { label: "10y", amount: toNumber(progress.value.projection_10y) }
      ];
    });
    const canSave = computed$1(() => validateForm() === "" && !saving.value);
    watch$1(
      () => [expanded.value, useNet.value],
      () => {
        saveUiState();
      },
      { deep: true }
    );
    watch$1(
      () => [props.scopeType, props.scopeId, props.displayCurrency, basis.value],
      () => {
        void refreshCard();
      }
    );
    onMounted$1(() => {
      loadUiState();
      void refreshCard();
    });
    return (_ctx, _cache) => {
      return _openBlock$1(), _createElementBlock$1("article", _hoisted_1$1, [
        _createElementVNode$1("div", _hoisted_2$1, [
          _createElementVNode$1("div", null, [
            _createElementVNode$1("div", _hoisted_3$1, [
              _createElementVNode$1("h2", _hoisted_4$1, _toDisplayString$1(__props.title), 1),
              _createElementVNode$1("button", {
                type: "button",
                class: "inline-flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                "aria-expanded": infoOpen.value,
                "aria-label": "Goal progress help",
                onClick: _cache[0] || (_cache[0] = ($event) => infoOpen.value = !infoOpen.value)
              }, " i ", 8, _hoisted_5$1)
            ]),
            _createElementVNode$1("p", _hoisted_6$1, _toDisplayString$1(__props.subtitle), 1),
            infoOpen.value ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_7$1, " Tracks how close your current Gross or Net amount is to the saved target. Turn on Net to measure progress against net assets instead of gross assets. Forecast milestones use simple monthly compounding, and the monthly invest amount is added at month-end in each simulated month. ")) : _createCommentVNode$1("", true)
          ]),
          _createElementVNode$1("div", _hoisted_8$1, [
            _createElementVNode$1("label", _hoisted_9$1, [
              _withDirectives$1(_createElementVNode$1("input", {
                "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => useNet.value = $event),
                type: "checkbox",
                class: "h-4 w-4 rounded border-slate-400 bg-transparent text-indigo-500 focus:ring-indigo-400"
              }, null, 512), [
                [_vModelCheckbox$1, useNet.value]
              ]),
              _cache[7] || (_cache[7] = _createElementVNode$1("span", null, "Net", -1))
            ]),
            _createElementVNode$1("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              onClick: toggleExpanded
            }, _toDisplayString$1(expanded.value ? "Collapse" : "Expand"), 1)
          ])
        ]),
        !expanded.value ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_10$1, [
          _cache[8] || (_cache[8] = _createElementVNode$1("p", { class: "text-xs text-slate-500 dark:text-slate-400" }, " Collapsed. Click Expand to preview goal progress and forecast. ", -1)),
          _createElementVNode$1("p", _hoisted_11$1, _toDisplayString$1(collapsedSummary.value), 1)
        ])) : (_openBlock$1(), _createElementBlock$1("div", _hoisted_12$1, [
          loading.value ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_13$1, " Loading goal progress... ")) : errorMessage.value ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_14$1, _toDisplayString$1(errorMessage.value), 1)) : !canLoad.value ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_15$1, " Waiting for Home scope... ")) : (_openBlock$1(), _createElementBlock$1("div", _hoisted_16$1, [
            _createElementVNode$1("div", _hoisted_17$1, [
              _createElementVNode$1("section", _hoisted_18$1, [
                _createElementVNode$1("div", _hoisted_19$1, [
                  (_openBlock$1(), _createElementBlock$1("svg", {
                    viewBox: gaugeViewBox,
                    class: "w-full"
                  }, [
                    _cache[9] || (_cache[9] = _createElementVNode$1("defs", null, [
                      _createElementVNode$1("linearGradient", {
                        id: "goal-gauge-progress",
                        x1: "0%",
                        x2: "100%",
                        y1: "0%",
                        y2: "0%"
                      }, [
                        _createElementVNode$1("stop", {
                          offset: "0%",
                          "stop-color": "#6366f1"
                        }),
                        _createElementVNode$1("stop", {
                          offset: "60%",
                          "stop-color": "#4f46e5"
                        }),
                        _createElementVNode$1("stop", {
                          offset: "100%",
                          "stop-color": "#10b981"
                        })
                      ])
                    ], -1)),
                    _createElementVNode$1("path", {
                      d: gaugeTrackPath.value,
                      fill: "none",
                      stroke: "rgba(100,116,139,0.28)",
                      "stroke-linecap": "round",
                      "stroke-width": "22"
                    }, null, 8, _hoisted_20$1),
                    progress.value && progress.value.configured ? (_openBlock$1(), _createElementBlock$1("path", {
                      key: 0,
                      d: gaugeProgressPath.value,
                      fill: "none",
                      stroke: "url(#goal-gauge-progress)",
                      "stroke-linecap": "round",
                      "stroke-width": "22"
                    }, null, 8, _hoisted_21$1)) : _createCommentVNode$1("", true),
                    _createElementVNode$1("line", {
                      x1: 180,
                      y1: 180,
                      x2: gaugeNeedleEnd.value.x,
                      y2: gaugeNeedleEnd.value.y,
                      stroke: "#cbd5f5",
                      "stroke-linecap": "round",
                      "stroke-width": "6"
                    }, null, 8, _hoisted_22$1),
                    _cache[10] || (_cache[10] = _createElementVNode$1("circle", {
                      cx: "180",
                      cy: "180",
                      r: "14",
                      fill: "#0f172a",
                      stroke: "#a5b4fc",
                      "stroke-width": "6"
                    }, null, -1)),
                    _createElementVNode$1("circle", {
                      cx: currentMarker.value.x,
                      cy: currentMarker.value.y,
                      r: "6",
                      fill: "#f8fafc",
                      stroke: "#34d399",
                      "stroke-width": "2"
                    }, null, 8, _hoisted_23$1),
                    _cache[11] || (_cache[11] = _createElementVNode$1("text", {
                      x: "36",
                      y: "198",
                      fill: "#94a3b8",
                      "font-size": "12",
                      "font-weight": "700"
                    }, "0%", -1)),
                    _cache[12] || (_cache[12] = _createElementVNode$1("text", {
                      x: "296",
                      y: "198",
                      fill: "#94a3b8",
                      "font-size": "12",
                      "font-weight": "700"
                    }, "100%", -1)),
                    _cache[13] || (_cache[13] = _createElementVNode$1("text", {
                      x: "180",
                      y: "98",
                      "text-anchor": "middle",
                      fill: "#a5b4fc",
                      "font-size": "12",
                      "font-weight": "800"
                    }, "TARGET", -1))
                  ]))
                ]),
                _createElementVNode$1("div", _hoisted_24$1, [
                  _createElementVNode$1("p", _hoisted_25$1, _toDisplayString$1(basisLabel.value) + " progress", 1),
                  _createElementVNode$1("p", {
                    class: _normalizeClass$1(["mt-2 text-2xl font-semibold", progressToneClass.value])
                  }, [
                    _createElementVNode$1("span", {
                      style: _normalizeStyle$1(amountMaskStyle())
                    }, _toDisplayString$1(formatCurrency(currentAmount.value, __props.displayCurrency)), 5)
                  ], 2),
                  _createElementVNode$1("p", _hoisted_26$1, [
                    _cache[14] || (_cache[14] = _createTextVNode$1(" Target ", -1)),
                    _createElementVNode$1("span", {
                      style: _normalizeStyle$1(amountMaskStyle())
                    }, _toDisplayString$1(target.value?.configured ? formatCurrency(targetAmount.value, __props.displayCurrency) : "-"), 5),
                    _createTextVNode$1(" · " + _toDisplayString$1(formatRatio(progress.value?.progress_ratio_pct ?? null)), 1)
                  ]),
                  _createElementVNode$1("p", _hoisted_27$1, _toDisplayString$1(projectedReachLabel.value), 1)
                ])
              ]),
              _createElementVNode$1("section", _hoisted_28$1, [
                !progress.value?.configured ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_29$1, " No goal is configured for this Home scope yet. Set a target amount, annual return, and monthly invest amount to start forecasting. ")) : _createCommentVNode$1("", true),
                _createElementVNode$1("div", _hoisted_30$1, [
                  _createElementVNode$1("div", _hoisted_31$1, [
                    _cache[15] || (_cache[15] = _createElementVNode$1("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "Remaining", -1)),
                    _createElementVNode$1("p", _hoisted_32$1, [
                      _createElementVNode$1("span", {
                        style: _normalizeStyle$1(amountMaskStyle())
                      }, _toDisplayString$1(progress.value?.configured ? formatCurrency(remainingAmount.value, __props.displayCurrency) : "-"), 5)
                    ])
                  ]),
                  _createElementVNode$1("div", _hoisted_33$1, [
                    _cache[16] || (_cache[16] = _createElementVNode$1("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "Estimated reach", -1)),
                    _createElementVNode$1("p", _hoisted_34$1, _toDisplayString$1(progress.value?.configured ? formatProjectedDate(progress.value.projected_reach_date) : "-"), 1)
                  ]),
                  _createElementVNode$1("div", _hoisted_35$1, [
                    _cache[17] || (_cache[17] = _createElementVNode$1("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "Time to goal", -1)),
                    _createElementVNode$1("p", _hoisted_36$1, _toDisplayString$1(progress.value?.configured && progress.value.projected_months_to_goal != null ? formatMonths(progress.value.projected_months_to_goal) : "-"), 1)
                  ]),
                  _createElementVNode$1("div", _hoisted_37$1, [
                    _cache[18] || (_cache[18] = _createElementVNode$1("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "Recent actual", -1)),
                    _createElementVNode$1("p", _hoisted_38$1, _toDisplayString$1(progress.value?.configured && progress.value.recent_actual_annualized_return_pct != null ? formatPercent(progress.value.recent_actual_annualized_return_pct) : "-"), 1)
                  ])
                ]),
                _createElementVNode$1("div", _hoisted_39$1, [
                  _createElementVNode$1("div", _hoisted_40$1, [
                    _cache[19] || (_cache[19] = _createElementVNode$1("div", null, [
                      _createElementVNode$1("h3", { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" }, "Forecast milestones"),
                      _createElementVNode$1("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Simple compounding with month-end contributions.")
                    ], -1)),
                    _createElementVNode$1("span", _hoisted_41$1, " as_of " + _toDisplayString$1(formatAsOf(progress.value?.as_of)), 1)
                  ]),
                  _createElementVNode$1("div", _hoisted_42$1, [
                    (_openBlock$1(true), _createElementBlock$1(_Fragment$1, null, _renderList$1(milestoneRows.value, (row) => {
                      return _openBlock$1(), _createElementBlock$1("div", {
                        key: row.label,
                        class: "rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-700 dark:bg-slate-900"
                      }, [
                        _createElementVNode$1("p", _hoisted_43$1, _toDisplayString$1(row.label), 1),
                        _createElementVNode$1("p", _hoisted_44$1, [
                          _createElementVNode$1("span", {
                            style: _normalizeStyle$1(amountMaskStyle())
                          }, _toDisplayString$1(formatCurrency(row.amount, __props.displayCurrency)), 5)
                        ])
                      ]);
                    }), 128))
                  ]),
                  _createElementVNode$1("p", _hoisted_45$1, _toDisplayString$1(comparisonComment.value), 1)
                ]),
                _createElementVNode$1("div", _hoisted_46$1, [
                  _createElementVNode$1("div", _hoisted_47$1, [
                    _createElementVNode$1("div", null, [
                      _createElementVNode$1("div", _hoisted_48$1, [
                        _cache[20] || (_cache[20] = _createElementVNode$1("h3", { class: "text-sm font-semibold text-slate-900 dark:text-slate-100" }, "Goal assumptions", -1)),
                        _createElementVNode$1("button", {
                          type: "button",
                          class: "inline-flex h-6 w-6 items-center justify-center rounded-full border border-slate-300 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                          "aria-expanded": assumptionsInfoOpen.value,
                          "aria-label": "Goal assumptions help",
                          onClick: _cache[2] || (_cache[2] = ($event) => assumptionsInfoOpen.value = !assumptionsInfoOpen.value)
                        }, " i ", 8, _hoisted_49$1)
                      ]),
                      _createElementVNode$1("p", _hoisted_50$1, "Stored in " + _toDisplayString$1(__props.displayCurrency) + " for the current Home scope.", 1)
                    ]),
                    _createElementVNode$1("div", _hoisted_51$1, [
                      !editMode.value ? (_openBlock$1(), _createElementBlock$1("button", {
                        key: 0,
                        type: "button",
                        class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                        onClick: _cache[3] || (_cache[3] = ($event) => editMode.value = true)
                      }, " Edit ")) : (_openBlock$1(), _createElementBlock$1(_Fragment$1, { key: 1 }, [
                        _createElementVNode$1("button", {
                          type: "button",
                          class: "rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50",
                          disabled: !canSave.value,
                          onClick: saveTarget
                        }, _toDisplayString$1(saving.value ? "Saving..." : "Save"), 9, _hoisted_52$1),
                        _createElementVNode$1("button", {
                          type: "button",
                          class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                          onClick: resetForm
                        }, " Reset "),
                        target.value?.configured ? (_openBlock$1(), _createElementBlock$1("button", {
                          key: 0,
                          type: "button",
                          class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                          onClick: cancelEdit
                        }, " Cancel ")) : _createCommentVNode$1("", true)
                      ], 64))
                    ])
                  ]),
                  assumptionsInfoOpen.value ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_53$1, " Target amount is the wealth goal for this Home scope. Annual return is the assumed yearly growth rate, and monthly invest amount is added at month-end using monthly compounding in the forecast simulation. ")) : _createCommentVNode$1("", true),
                  successMessage.value ? (_openBlock$1(), _createElementBlock$1("p", _hoisted_54$1, _toDisplayString$1(successMessage.value), 1)) : _createCommentVNode$1("", true),
                  editMode.value ? (_openBlock$1(), _createElementBlock$1("div", _hoisted_55$1, [
                    _createElementVNode$1("label", _hoisted_56$1, [
                      _cache[21] || (_cache[21] = _createElementVNode$1("span", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400" }, "목표자산", -1)),
                      _withDirectives$1(_createElementVNode$1("input", {
                        "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.targetAmount = $event),
                        type: "number",
                        min: "0",
                        step: "1",
                        class: "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      }, null, 512), [
                        [_vModelText, form.targetAmount]
                      ])
                    ]),
                    _createElementVNode$1("label", _hoisted_57$1, [
                      _cache[22] || (_cache[22] = _createElementVNode$1("span", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400" }, "연수익률", -1)),
                      _withDirectives$1(_createElementVNode$1("input", {
                        "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.annualReturnRatePct = $event),
                        type: "number",
                        min: "0",
                        max: "100",
                        step: "0.1",
                        class: "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      }, null, 512), [
                        [_vModelText, form.annualReturnRatePct]
                      ])
                    ]),
                    _createElementVNode$1("label", _hoisted_58$1, [
                      _cache[23] || (_cache[23] = _createElementVNode$1("span", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400" }, "월투자금액", -1)),
                      _withDirectives$1(_createElementVNode$1("input", {
                        "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.monthlyInvestAmount = $event),
                        type: "number",
                        min: "0",
                        step: "1",
                        class: "w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                      }, null, 512), [
                        [_vModelText, form.monthlyInvestAmount]
                      ])
                    ])
                  ])) : (_openBlock$1(), _createElementBlock$1("div", _hoisted_59$1, [
                    _createElementVNode$1("div", _hoisted_60$1, [
                      _cache[24] || (_cache[24] = _createElementVNode$1("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "목표자산", -1)),
                      _createElementVNode$1("p", _hoisted_61, [
                        _createElementVNode$1("span", {
                          style: _normalizeStyle$1(amountMaskStyle())
                        }, _toDisplayString$1(target.value?.configured ? formatCurrency(targetAmount.value, __props.displayCurrency) : "-"), 5)
                      ])
                    ]),
                    _createElementVNode$1("div", _hoisted_62, [
                      _cache[25] || (_cache[25] = _createElementVNode$1("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "연수익률", -1)),
                      _createElementVNode$1("p", _hoisted_63, _toDisplayString$1(target.value?.configured ? formatPercent(annualReturnInputValue.value) : "-"), 1)
                    ]),
                    _createElementVNode$1("div", _hoisted_64, [
                      _cache[26] || (_cache[26] = _createElementVNode$1("p", { class: "text-[11px] uppercase tracking-[0.22em] text-slate-500 dark:text-slate-400" }, "월투자금액", -1)),
                      _createElementVNode$1("p", _hoisted_65, [
                        _createElementVNode$1("span", {
                          style: _normalizeStyle$1(amountMaskStyle())
                        }, _toDisplayString$1(target.value?.configured ? formatCurrency(toNumber(target.value?.monthly_invest_amount), __props.displayCurrency) : "-"), 5)
                      ])
                    ])
                  ]))
                ])
              ])
            ])
          ]))
        ]))
      ]);
    };
  }
});

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,normalizeClass:_normalizeClass,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,renderList:_renderList,Fragment:_Fragment,vModelSelect:_vModelSelect,withDirectives:_withDirectives,vModelCheckbox:_vModelCheckbox,createTextVNode:_createTextVNode,createBlock:_createBlock,createVNode:_createVNode,withCtx:_withCtx,normalizeStyle:_normalizeStyle} = await importShared('vue');

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
const _hoisted_8 = { class: "flex flex-col gap-4" };
const _hoisted_9 = { class: "rounded-2xl border border-slate-200 p-2.5 sm:p-3 dark:border-slate-700" };
const _hoisted_10 = { class: "grid gap-2 sm:gap-3 text-sm md:grid-cols-[auto_1fr] md:items-center" };
const _hoisted_11 = { class: "flex flex-wrap items-center gap-1.5 sm:gap-2" };
const _hoisted_12 = { class: "flex flex-wrap items-center gap-1.5 sm:gap-2" };
const _hoisted_13 = ["onClick"];
const _hoisted_14 = { class: "flex flex-wrap items-center gap-1.5 sm:gap-2" };
const _hoisted_15 = ["onClick"];
const _hoisted_16 = { class: "flex flex-wrap items-center gap-1.5 sm:gap-2" };
const _hoisted_17 = ["value"];
const _hoisted_18 = { class: "inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 sm:text-xs dark:border-slate-700 dark:text-slate-200" };
const _hoisted_19 = { class: "flex w-full flex-wrap items-center gap-1.5 sm:gap-2 sm:justify-end" };
const _hoisted_20 = ["disabled"];
const _hoisted_21 = ["disabled"];
const _hoisted_22 = {
  key: 2,
  class: "w-full text-[11px] text-slate-500 dark:text-slate-400 sm:text-right"
};
const _hoisted_23 = { class: "xl:col-span-2" };
const _hoisted_24 = { class: "xl:col-span-2" };
const _hoisted_25 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_26 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_27 = {
  key: 0,
  class: "mt-4 space-y-4"
};
const _hoisted_28 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_29 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_30 = {
  key: 1,
  class: "grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3"
};
const _hoisted_31 = { class: "flex items-center justify-between gap-2" };
const _hoisted_32 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_33 = { class: "text-xs font-normal text-slate-500" };
const _hoisted_34 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_35 = { class: "mt-1 text-[11px] text-slate-500 dark:text-slate-400" };
const _hoisted_36 = { class: "grid grid-cols-1 gap-4 xl:grid-cols-2" };
const _hoisted_37 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_38 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_39 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_40 = { class: "flex items-center justify-between gap-2" };
const _hoisted_41 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_42 = { class: "text-xs font-normal text-slate-500" };
const _hoisted_43 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_44 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_45 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_46 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_47 = { class: "flex items-center justify-between gap-2" };
const _hoisted_48 = { class: "truncate text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_49 = { class: "text-xs text-slate-500" };
const _hoisted_50 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_51 = {
  key: 1,
  class: "mt-3 text-xs text-slate-500 dark:text-slate-400"
};
const _hoisted_52 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_53 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_54 = {
  key: 0,
  class: "mt-4"
};
const _hoisted_55 = {
  key: 0,
  class: "rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
};
const _hoisted_56 = {
  key: 1,
  class: "space-y-2"
};
const _hoisted_57 = { class: "text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_58 = { class: "mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100" };
const _hoisted_59 = { class: "mt-1 text-xs text-slate-600 dark:text-slate-300" };
const _hoisted_60 = {
  key: 1,
  class: "mt-3 text-xs text-slate-500 dark:text-slate-400"
};
const {computed,nextTick,onBeforeUnmount,onMounted,reactive,ref,watch} = await importShared('vue');
const LIVE_MASK_STORAGE_KEY = "myasset:home:live-mask-amounts";
const LIVE_TREND_PREF_STORAGE_KEY = "myasset:home:live-trend-pref";
const LIVE_PORTFOLIO_NET_BASIS_STORAGE_KEY = "myasset:home:portfolio-net-basis";
const HOME_TABLE_SECTION_STORAGE_KEY = "myasset:home:table-sections";
const HOME_QUOTE_UPDATE_META_STORAGE_KEY = "myasset:home:quote-update-meta";
const HOME_CARD_ORDER_STORAGE_KEY = "myasset:home:card-order";
const HOME_QUOTE_UPDATE_POLL_MS = 1500;
const HOME_QUOTE_UPDATE_POLL_TIMEOUT_MS = 18e4;
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
      return formatDateTimeSeoul(value);
    }
    function getHomeTablePageSize() {
      if (typeof window === "undefined") return 10;
      return window.matchMedia("(max-width: 768px)").matches ? 6 : 10;
    }
    function toHomePortfolioSortBy(key) {
      if (key === "portfolio") return "name";
      if (key === "current") return "gross_assets_total";
      if (key === "invested_principal") return "net_contribution_total";
      if (key === "portfolio_profit") return "portfolio_profit_total";
      return "total_return_pct";
    }
    function toHomeHoldingSortBy(key) {
      if (key === "portfolio") return "portfolio_name";
      if (key === "asset") return "asset_name";
      if (key === "price") return "current_price";
      if (key === "avg_cost") return "avg_price";
      if (key === "evaluated") return "evaluated_amount";
      if (key === "cost_basis") return "invested_amount";
      if (key === "profit") return "evaluated_amount";
      if (key === "return") return "pnl_pct";
      return "asset_symbol";
    }
    function toHomeLiabilitySortBy(key) {
      if (key === "portfolio") return "portfolio_name";
      if (key === "liability") return "name";
      if (key === "balance") return "outstanding_balance";
      return "liability_type";
    }
    const loading = ref(false);
    const errorMessage = ref("");
    const summary = ref(null);
    const holdings = ref([]);
    const liabilities = ref([]);
    const portfolios = ref([]);
    const releaseNoteItems = ref([]);
    const me = ref(null);
    const liveDashboardExpanded = ref(false);
    const homePortfoliosExpanded = ref(false);
    const homeHoldingsExpanded = ref(false);
    const homeLiabilitiesExpanded = ref(false);
    const reportPanelExpanded = ref(false);
    const releaseNotesExpanded = ref(false);
    const exportingImage = ref(false);
    const liveDashboardTarget = ref("GROSS");
    const liveDonutStartPosition = ref("TOP");
    const liveKpiTarget = ref("SUMMARY");
    const livePortfolioNetBasis = ref(false);
    const liveMaskAmounts = ref(false);
    const homeTrendMode = ref("SUMMARY");
    const homeTrendPortfolioMetric = ref("RETURN");
    const liveTrendVisibility = reactive({
      gross: true,
      liabilities: true,
      net: true
    });
    const homeTrendPortfolioKey = ref("ALL");
    const homePortfolioTrendPoints = ref([]);
    const homeTrendPortfolioLines = ref([]);
    const homeTrendLoading = ref(false);
    const homeTrendError = ref("");
    const quoteUpdateJobId = ref("");
    const quoteUpdateStatus = ref("IDLE");
    const quoteUpdatePolling = ref(false);
    const quoteUpdateProcessed = ref(0);
    const quoteUpdateTotal = ref(0);
    const quoteUpdateLastProcessed = ref(-1);
    const quoteUpdateLastResultStatus = ref("");
    const quoteUpdateLastFinishedAt = ref("");
    const quoteUpdateLastSummary = ref("");
    const homeActionToast = ref(null);
    const livePortfolioKey = ref("ALL");
    const homePortfolioKey = ref("ALL");
    const homePortfolioRows = ref([]);
    const homeHoldingRows = ref([]);
    const homeLiabilityRows = ref([]);
    const homeHoldingSearchTerm = ref("");
    const homeLiabilitySearchTerm = ref("");
    let homeHoldingSearchDebounceTimer = null;
    let homeLiabilitySearchDebounceTimer = null;
    let homeActionToastTimer = null;
    let quoteUpdatePollTimer = null;
    const homePortfolioTable = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "current",
      sortOrder: "desc",
      loading: false
    });
    const homeHoldingTable = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "evaluated",
      sortOrder: "desc",
      q: "",
      loading: false
    });
    const homeLiabilityTable = reactive({
      page: 1,
      pageSize: 10,
      total: 0,
      sortBy: "balance",
      sortOrder: "desc",
      q: "",
      loading: false
    });
    const DEFAULT_HOME_CARD_ORDER = [
      "LIVE_DASHBOARD",
      "GOAL_PROGRESS",
      "PORTFOLIOS_TABLE",
      "HOLDINGS_TABLE",
      "LIABILITIES_TABLE",
      "REPORT_PANEL",
      "QUICK_INSIGHT",
      "RELEASE_NOTES"
    ];
    const homeCardOrder = ref([...DEFAULT_HOME_CARD_ORDER]);
    const homeCardDraggingKey = ref(null);
    const liveDashboardRef = ref(null);
    const { displayCurrency, ensureInitialized } = useDisplayCurrency();
    const canManageQuoteUpdates = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
    const summaryDisplayCurrency = computed(() => summary.value?.display_currency ?? displayCurrency.value);
    const homeGoalScopeType = computed(
      () => summary.value?.scope_type === "HOUSEHOLD" ? "HOUSEHOLD" : summary.value?.scope_type === "USER" ? "USER" : null
    );
    const homeGoalScopeId = computed(() => summary.value?.scope_id != null ? Number(summary.value.scope_id) : null);
    const quickInsightDisplayCurrency = computed(
      () => summaryDisplayCurrency.value === "USD" ? "USD" : "KRW"
    );
    const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
    const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
    const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
    const investedPrincipalTotal = computed(() => toNumber(summary.value?.invested_principal_total));
    const principalMinusDebtTotal = computed(
      () => toNumber(summary.value?.debt_adjusted_principal_total ?? summary.value?.principal_minus_debt_total)
    );
    const netAssetsReturnPct = computed(() => toNumber(summary.value?.net_assets_return_pct ?? null));
    const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
    const principalProfitTotal = computed(() => toNumber(summary.value?.principal_profit_total ?? grossAssetsTotal.value - investedPrincipalTotal.value));
    const netAssetsProfitTotal = computed(() => toNumber(summary.value?.net_assets_profit_total ?? netAssetsTotal.value - principalMinusDebtTotal.value));
    const asOf = computed(() => formatDateTime(summary.value?.as_of));
    const quoteUpdateProgressText = computed(() => {
      const total = Number(quoteUpdateTotal.value || 0);
      const processed = Number(quoteUpdateProcessed.value || 0);
      if (total <= 0) return "0/0";
      return `${processed}/${total}`;
    });
    const quoteUpdateLastResultLabel = computed(() => {
      if (!quoteUpdateLastFinishedAt.value) return "";
      const status = quoteUpdateLastResultStatus.value || "COMPLETED";
      const summary2 = quoteUpdateLastSummary.value || "-";
      return `Last run: ${quoteUpdateLastFinishedAt.value} · ${status} · ${summary2}`;
    });
    const livePortfolioId = computed(() => {
      if (livePortfolioKey.value === "ALL") return void 0;
      const parsed = Number(livePortfolioKey.value);
      return Number.isFinite(parsed) ? parsed : void 0;
    });
    const livePortfolioLabel = computed(() => {
      if (livePortfolioId.value == null) return "All portfolios";
      const target = portfolios.value.find((item) => item.id === livePortfolioId.value);
      return target ? target.name : `Portfolio #${livePortfolioId.value}`;
    });
    const liveKpiPortfolioRows = computed(() => {
      if (livePortfolioKey.value === "ALL") return portfolios.value;
      const parsed = Number(livePortfolioKey.value);
      if (!Number.isFinite(parsed)) return portfolios.value;
      return portfolios.value.filter((item) => Number(item.id) === parsed);
    });
    const homeTrendPortfolioId = computed(() => {
      if (homeTrendPortfolioKey.value === "ALL") return void 0;
      const parsed = Number(homeTrendPortfolioKey.value);
      return Number.isFinite(parsed) ? parsed : void 0;
    });
    const homePortfolioId = computed(() => {
      if (homePortfolioKey.value === "ALL") return void 0;
      const parsed = Number(homePortfolioKey.value);
      return Number.isFinite(parsed) ? parsed : void 0;
    });
    const homePortfolioOptions = computed(
      () => portfolios.value.map((item) => ({ key: String(item.id), label: item.name }))
    );
    const homeTrendPortfolioOptions = computed(() => [
      { key: "ALL", label: "All portfolios" },
      ...homePortfolioOptions.value
    ]);
    const portfolioReturnById = computed(() => {
      const map = /* @__PURE__ */ new Map();
      for (const item of portfolios.value) {
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
    function resolveLiveAllocationReturnPct(rawReturnPct, target, key) {
      if (rawReturnPct != null && Number.isFinite(rawReturnPct)) {
        return rawReturnPct;
      }
      if (target === "GROSS" || target === "NET") {
        const match = key.match(/^portfolio:(\d+)$/);
        if (!match) return null;
        return portfolioReturnById.value.get(Number(match[1])) ?? null;
      }
      if (target === "HOLDINGS") {
        const match = key.match(/^asset:(\d+)$/);
        if (!match) return null;
        return holdingReturnByAssetId.value.get(Number(match[1])) ?? null;
      }
      return null;
    }
    const liveDashboardData = useDashboardDataAdapter({
      target: liveDashboardTarget,
      portfolioKey: livePortfolioKey,
      displayCurrency,
      loadSummary: async () => ({
        gross: grossAssetsTotal.value,
        liabilities: liabilitiesTotal.value,
        net: netAssetsTotal.value,
        invested: investedPrincipalTotal.value,
        debtAdjusted: principalMinusDebtTotal.value,
        asOf: summary.value?.as_of ?? null
      }),
      loadAllocation: async ({ target, portfolioId, displayCurrency: targetCurrency }) => {
        const normalizedCurrency = targetCurrency === "USD" ? "USD" : "KRW";
        const out = await getAllocation({
          target,
          group_by: target === "HOLDINGS" ? "ASSET" : "PORTFOLIO",
          top_n: 10,
          portfolio_id: portfolioId,
          display_currency: normalizedCurrency
        });
        return {
          total: toNumber(out.total),
          items: out.items.map((item) => ({
            key: item.key,
            label: item.label,
            value: toNumber(item.value),
            ratioPct: toNumber(item.ratio_pct),
            returnPct: item.return_pct == null ? null : toNumber(item.return_pct)
          }))
        };
      },
      loadTrend: async (targetCurrency) => {
        const normalizedCurrency = targetCurrency === "USD" ? "USD" : "KRW";
        const out = await getNetworthSeries({
          display_currency: normalizedCurrency,
          bucket: "DAY",
          limit: 90
        });
        return out.points.map((point) => ({
          label: point.snapshot_date,
          gross: toNumber(point.gross_assets_total),
          liabilities: toNumber(point.liabilities_total),
          net: toNumber(point.net_assets_total)
        }));
      },
      resolveReturnPct: resolveLiveAllocationReturnPct
    });
    const donutItems = computed(() => liveDashboardData.donutItems.value);
    const donutTotal = computed(() => liveDashboardData.donutTotal.value);
    const liveTreemapItems = computed(() => liveDashboardData.treemapItems.value);
    const trendPoints = computed(
      () => homeTrendMode.value === "SUMMARY" ? liveDashboardData.trendPoints.value : homePortfolioTrendPoints.value
    );
    const kpiGrossReturnPct = computed(() => liveDashboardData.kpiGrossReturn.value);
    const kpiNetReturnPct = computed(() => liveDashboardData.kpiNetReturn.value);
    const kpiGrossProfitTotal = computed(() => liveDashboardData.kpiGrossProfit.value);
    const kpiNetProfitTotal = computed(() => liveDashboardData.kpiNetProfit.value);
    const dashboardDonutLoading = computed(() => loading.value || liveDashboardData.donutLoading.value);
    const dashboardDonutError = computed(() => liveDashboardData.donutError.value || errorMessage.value);
    const dashboardTreemapLoading = computed(() => loading.value || liveDashboardData.treemapLoading.value);
    const dashboardTreemapError = computed(() => liveDashboardData.treemapError.value || errorMessage.value);
    const dashboardTrendLoading = computed(
      () => loading.value || (homeTrendMode.value === "SUMMARY" ? liveDashboardData.trendLoading.value : homeTrendLoading.value)
    );
    const dashboardTrendError = computed(
      () => homeTrendMode.value === "SUMMARY" ? liveDashboardData.trendError.value || errorMessage.value : homeTrendError.value || errorMessage.value
    );
    const topHoldings = computed(
      () => [...holdings.value].sort((a, b) => toNumber(b.evaluated_amount) - toNumber(a.evaluated_amount)).slice(0, 6)
    );
    const topPortfolios = computed(
      () => [...portfolios.value].sort((a, b) => toNumber(b.gross_assets_total) - toNumber(a.gross_assets_total)).slice(0, 6)
    );
    const topLiabilities = computed(
      () => [...liabilities.value].sort((a, b) => toNumber(b.outstanding_balance) - toNumber(a.outstanding_balance)).slice(0, 6)
    );
    function mapReleaseNotes(notes) {
      return notes.map((note) => ({
        id: String(note.id),
        releasedAt: note.released_at,
        title: note.title,
        summary: note.summary
      }));
    }
    function getErrorMessage(error) {
      if (error instanceof AxiosError) {
        const detail = error.response?.data?.detail;
        if (typeof detail === "string") return detail;
        if (Array.isArray(detail)) return detail.map((item) => String(item?.msg ?? item)).join(", ");
        return error.message;
      }
      if (error instanceof Error) return error.message;
      return "Unknown error";
    }
    function showHomeActionToast(kind, message) {
      homeActionToast.value = { kind, message };
      if (homeActionToastTimer) {
        clearTimeout(homeActionToastTimer);
      }
      homeActionToastTimer = setTimeout(() => {
        homeActionToast.value = null;
        homeActionToastTimer = null;
      }, 5e3);
    }
    function saveQuoteUpdateMeta() {
      if (typeof window === "undefined") return;
      const payload = {
        status: quoteUpdateLastResultStatus.value,
        finishedAt: quoteUpdateLastFinishedAt.value,
        summary: quoteUpdateLastSummary.value
      };
      window.localStorage.setItem(HOME_QUOTE_UPDATE_META_STORAGE_KEY, JSON.stringify(payload));
    }
    function loadQuoteUpdateMeta() {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(HOME_QUOTE_UPDATE_META_STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (parsed.status === "COMPLETED" || parsed.status === "FAILED") {
          quoteUpdateLastResultStatus.value = parsed.status;
        }
        if (typeof parsed.finishedAt === "string") {
          quoteUpdateLastFinishedAt.value = parsed.finishedAt;
        }
        if (typeof parsed.summary === "string") {
          quoteUpdateLastSummary.value = parsed.summary;
        }
      } catch {
      }
    }
    function clearQuoteUpdatePolling() {
      if (quoteUpdatePollTimer) {
        clearTimeout(quoteUpdatePollTimer);
        quoteUpdatePollTimer = null;
      }
      quoteUpdatePolling.value = false;
    }
    async function pollHomeQuoteUpdateJob(jobId, startedAtMs) {
      try {
        const result = await getQuoteUpdateJobStatus(jobId);
        const normalizedStatus = String(result.status || "").toUpperCase();
        quoteUpdateStatus.value = normalizedStatus === "FAILED" ? "FAILED" : normalizedStatus === "COMPLETED" ? "COMPLETED" : "RUNNING";
        quoteUpdateProcessed.value = Number(result.processed_assets || 0);
        quoteUpdateTotal.value = Number(result.total_assets || 0);
        if (quoteUpdateProcessed.value !== quoteUpdateLastProcessed.value) {
          quoteUpdateLastProcessed.value = quoteUpdateProcessed.value;
          showHomeActionToast("INFO", `Quote update running... ${quoteUpdateProgressText.value}`);
        }
        if (normalizedStatus === "COMPLETED") {
          clearQuoteUpdatePolling();
          quoteUpdateStatus.value = "COMPLETED";
          quoteUpdateLastResultStatus.value = "COMPLETED";
          quoteUpdateLastFinishedAt.value = formatDateTime(result.finished_at || (/* @__PURE__ */ new Date()).toISOString());
          quoteUpdateLastSummary.value = `updated=${result.updated_count}, skipped=${result.skipped_count}, failed=${result.failed_count}`;
          saveQuoteUpdateMeta();
          showHomeActionToast("SUCCESS", "Quote update completed. Refreshing Home data...");
          await loadHomeData();
          return;
        }
        if (normalizedStatus === "FAILED") {
          clearQuoteUpdatePolling();
          quoteUpdateStatus.value = "FAILED";
          const lastError = Array.isArray(result.errors) && result.errors.length > 0 ? String(result.errors[result.errors.length - 1]) : "";
          quoteUpdateLastResultStatus.value = "FAILED";
          quoteUpdateLastFinishedAt.value = formatDateTime(result.finished_at || (/* @__PURE__ */ new Date()).toISOString());
          quoteUpdateLastSummary.value = lastError || "Quote update job failed";
          saveQuoteUpdateMeta();
          showHomeActionToast("ERROR", lastError || "Quote update job failed.");
          return;
        }
        if (Date.now() - startedAtMs > HOME_QUOTE_UPDATE_POLL_TIMEOUT_MS) {
          clearQuoteUpdatePolling();
          quoteUpdateStatus.value = "FAILED";
          quoteUpdateLastResultStatus.value = "FAILED";
          quoteUpdateLastFinishedAt.value = formatDateTime((/* @__PURE__ */ new Date()).toISOString());
          quoteUpdateLastSummary.value = "Polling timed out";
          saveQuoteUpdateMeta();
          showHomeActionToast("ERROR", "Quote update polling timed out.");
          return;
        }
        quoteUpdatePollTimer = setTimeout(() => {
          void pollHomeQuoteUpdateJob(jobId, startedAtMs);
        }, HOME_QUOTE_UPDATE_POLL_MS);
      } catch (error) {
        clearQuoteUpdatePolling();
        quoteUpdateStatus.value = "FAILED";
        quoteUpdateLastResultStatus.value = "FAILED";
        quoteUpdateLastFinishedAt.value = formatDateTime((/* @__PURE__ */ new Date()).toISOString());
        quoteUpdateLastSummary.value = getErrorMessage(error);
        saveQuoteUpdateMeta();
        showHomeActionToast("ERROR", getErrorMessage(error));
      }
    }
    async function runHomeUpdateQuotesNow() {
      if (!canManageQuoteUpdates.value || quoteUpdatePolling.value || loading.value) {
        return;
      }
      quoteUpdateStatus.value = "QUEUED";
      quoteUpdateProcessed.value = 0;
      quoteUpdateTotal.value = 0;
      quoteUpdateLastProcessed.value = -1;
      try {
        const job = await updateQuotesNow();
        quoteUpdateJobId.value = job.job_id;
        quoteUpdateTotal.value = Number(job.total_assets || 0);
        quoteUpdatePolling.value = true;
        quoteUpdateStatus.value = "RUNNING";
        showHomeActionToast("INFO", `Quote update started (${quoteUpdateProgressText.value})`);
        void pollHomeQuoteUpdateJob(job.job_id, Date.now());
      } catch (error) {
        clearQuoteUpdatePolling();
        quoteUpdateStatus.value = "FAILED";
        showHomeActionToast("ERROR", getErrorMessage(error));
      }
    }
    async function loadHomeData() {
      loading.value = true;
      errorMessage.value = "";
      try {
        const mePromise = getMe().catch(() => null);
        const [
          summaryOut,
          holdingsOut,
          liabilitiesOut,
          portfoliosOut,
          meOut
        ] = await Promise.all([
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
          }),
          mePromise
        ]);
        summary.value = summaryOut;
        holdings.value = holdingsOut;
        liabilities.value = liabilitiesOut.items;
        portfolios.value = portfoliosOut.items;
        me.value = meOut;
        if (homeTrendPortfolioKey.value !== "ALL" && !portfoliosOut.items.some((item) => String(item.id) === homeTrendPortfolioKey.value)) {
          homeTrendPortfolioKey.value = "ALL";
        }
        await liveDashboardData.refreshAllDashboard();
        if (livePortfolioKey.value !== "ALL" && !portfoliosOut.items.some((item) => String(item.id) === livePortfolioKey.value)) {
          livePortfolioKey.value = "ALL";
        }
        if (homePortfolioKey.value !== "ALL" && !portfoliosOut.items.some((item) => String(item.id) === homePortfolioKey.value)) {
          homePortfolioKey.value = "ALL";
        }
        try {
          const noteRows = await getReleaseNotes({ limit: 20 });
          const mapped = mapReleaseNotes(noteRows);
          releaseNoteItems.value = mapped;
        } catch {
          releaseNoteItems.value = [];
        }
        if (homePortfoliosExpanded.value) {
          void loadHomePortfolioTable();
        }
        if (homeHoldingsExpanded.value) {
          void loadHomeHoldingTable();
        }
        if (homeLiabilitiesExpanded.value) {
          void loadHomeLiabilityTable();
        }
        if (homeTrendMode.value === "PORTFOLIO") {
          void loadHomePortfolioTrend();
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errorMessage.value = `Failed to load dashboard data: ${message}`;
      } finally {
        loading.value = false;
      }
    }
    async function loadHomePortfolioTrend() {
      homeTrendLoading.value = true;
      homeTrendError.value = "";
      try {
        const out = await getNetworthSeries({
          display_currency: displayCurrency.value,
          mode: "PORTFOLIO_RETURN",
          portfolio_metric: homeTrendPortfolioMetric.value === "CURRENT_VALUE" ? "CURRENT" : homeTrendPortfolioMetric.value === "CURRENT_NET" ? "CURRENT_NET" : homeTrendPortfolioMetric.value,
          portfolio_id: homeTrendPortfolioId.value,
          bucket: "DAY",
          limit: 90
        });
        homePortfolioTrendPoints.value = out.points.map((point) => ({
          label: point.snapshot_date,
          gross: toNumber(point.gross_assets_total),
          liabilities: toNumber(point.liabilities_total),
          net: toNumber(point.net_assets_total)
        }));
        homeTrendPortfolioLines.value = (out.portfolio_lines || []).map((line) => ({
          key: line.key,
          label: line.label,
          points: (line.points || []).map((point) => ({
            snapshot_date: point.snapshot_date,
            value: toNumber(point.value)
          }))
        }));
      } catch (error) {
        homePortfolioTrendPoints.value = [];
        homeTrendPortfolioLines.value = [];
        homeTrendError.value = error instanceof Error ? error.message : "Failed to load portfolio trend";
      } finally {
        homeTrendLoading.value = false;
      }
    }
    function mapHomePortfolioRow(row) {
      return {
        id: row.id,
        name: row.name,
        type: row.type,
        current: toNumber(row.gross_assets_total),
        invested: toNumber(row.net_contribution_total),
        profit: toNumber(row.portfolio_profit_total ?? row.total_pnl_amount),
        returnPct: row.total_return_pct == null ? null : toNumber(row.total_return_pct)
      };
    }
    function mapHomeHoldingRow(row) {
      return {
        id: row.id,
        portfolioName: row.portfolio_name || "Unassigned",
        assetName: row.asset_name,
        symbol: row.asset_symbol,
        price: toNumber(row.current_price),
        priceCurrency: row.current_price_currency || summaryDisplayCurrency.value || "KRW",
        avgCost: toNumber(row.avg_cost),
        avgCostCurrency: row.avg_cost_currency || summaryDisplayCurrency.value || "KRW",
        evaluated: toNumber(row.evaluated_amount),
        costBasis: toNumber(row.cost_basis_total),
        profit: toNumber(row.pnl_amount),
        returnPct: row.pnl_pct == null ? null : toNumber(row.pnl_pct)
      };
    }
    function mapHomeLiabilityRow(row) {
      return {
        id: row.id,
        portfolioName: row.portfolio_name || "Unassigned",
        name: row.name,
        type: row.liability_type,
        balance: toNumber(row.outstanding_balance),
        balanceCurrency: row.currency || summaryDisplayCurrency.value || "KRW"
      };
    }
    function toggleHomeSort(state, key) {
      if (state.sortBy === key) {
        state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
      } else {
        state.sortBy = key;
        state.sortOrder = "desc";
      }
      state.page = 1;
    }
    function toggleHomePortfolioSort(key) {
      toggleHomeSort(homePortfolioTable, key);
    }
    function toggleHomeHoldingSort(key) {
      toggleHomeSort(homeHoldingTable, key);
    }
    function toggleHomeLiabilitySort(key) {
      toggleHomeSort(homeLiabilityTable, key);
    }
    function selectHomeAllPortfolios() {
      if (homePortfolioKey.value === "ALL") {
        return;
      }
      homePortfolioKey.value = "ALL";
    }
    function loadHomeTableSectionState() {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(HOME_TABLE_SECTION_STORAGE_KEY);
      if (!raw) return;
      try {
        const parsed = JSON.parse(raw);
        if (typeof parsed.live_dashboard === "boolean") liveDashboardExpanded.value = parsed.live_dashboard;
        if (typeof parsed.report_panel === "boolean") reportPanelExpanded.value = parsed.report_panel;
        if (typeof parsed.release_notes === "boolean") releaseNotesExpanded.value = parsed.release_notes;
        if (typeof parsed.portfolios === "boolean") homePortfoliosExpanded.value = parsed.portfolios;
        if (typeof parsed.holdings === "boolean") homeHoldingsExpanded.value = parsed.holdings;
        if (typeof parsed.liabilities === "boolean") homeLiabilitiesExpanded.value = parsed.liabilities;
      } catch {
      }
    }
    function saveHomeTableSectionState() {
      if (typeof window === "undefined") return;
      const payload = {
        live_dashboard: liveDashboardExpanded.value,
        report_panel: reportPanelExpanded.value,
        release_notes: releaseNotesExpanded.value,
        portfolios: homePortfoliosExpanded.value,
        holdings: homeHoldingsExpanded.value,
        liabilities: homeLiabilitiesExpanded.value
      };
      window.localStorage.setItem(HOME_TABLE_SECTION_STORAGE_KEY, JSON.stringify(payload));
    }
    function normalizeHomeCardOrder(value) {
      if (!Array.isArray(value)) return [...DEFAULT_HOME_CARD_ORDER];
      const next = [];
      for (const item of value) {
        if ((item === "LIVE_DASHBOARD" || item === "GOAL_PROGRESS" || item === "PORTFOLIOS_TABLE" || item === "HOLDINGS_TABLE" || item === "LIABILITIES_TABLE" || item === "REPORT_PANEL" || item === "QUICK_INSIGHT" || item === "RELEASE_NOTES") && !next.includes(item)) {
          next.push(item);
        }
      }
      for (const key of DEFAULT_HOME_CARD_ORDER) {
        if (!next.includes(key)) next.push(key);
      }
      return next;
    }
    function restoreHomeCardOrder() {
      if (typeof window === "undefined") return;
      const raw = window.localStorage.getItem(HOME_CARD_ORDER_STORAGE_KEY);
      if (!raw) return;
      try {
        homeCardOrder.value = normalizeHomeCardOrder(JSON.parse(raw));
      } catch {
      }
    }
    function getHomeCardOrder(key) {
      const index = homeCardOrder.value.indexOf(key);
      return index >= 0 ? index : DEFAULT_HOME_CARD_ORDER.indexOf(key);
    }
    function onHomeCardDragStart(key, event) {
      homeCardDraggingKey.value = key;
      if (event.dataTransfer) {
        event.dataTransfer.effectAllowed = "move";
        event.dataTransfer.setData("text/plain", key);
      }
    }
    function onHomeCardDragOver(event) {
      event.preventDefault();
      if (event.dataTransfer) {
        event.dataTransfer.dropEffect = "move";
      }
    }
    function onHomeCardDrop(targetKey, event) {
      event.preventDefault();
      const sourceKey = homeCardDraggingKey.value || event.dataTransfer?.getData("text/plain");
      if (!sourceKey || sourceKey === targetKey) {
        homeCardDraggingKey.value = null;
        return;
      }
      const next = [...homeCardOrder.value];
      const fromIndex = next.indexOf(sourceKey);
      const toIndex = next.indexOf(targetKey);
      if (fromIndex < 0 || toIndex < 0) {
        homeCardDraggingKey.value = null;
        return;
      }
      next.splice(fromIndex, 1);
      next.splice(toIndex, 0, sourceKey);
      homeCardOrder.value = normalizeHomeCardOrder(next);
      homeCardDraggingKey.value = null;
    }
    function onHomeCardDragEnd() {
      homeCardDraggingKey.value = null;
    }
    async function loadHomePortfolioTable() {
      homePortfolioTable.loading = true;
      try {
        const out = await getPortfoliosTable({
          page: homePortfolioTable.page,
          page_size: homePortfolioTable.pageSize,
          sort_by: toHomePortfolioSortBy(homePortfolioTable.sortBy),
          sort_order: homePortfolioTable.sortOrder,
          portfolio_id: homePortfolioId.value,
          display_currency: displayCurrency.value,
          include_hidden: false,
          include_excluded: false
        });
        homePortfolioRows.value = out.items.map(mapHomePortfolioRow);
        homePortfolioTable.total = out.total;
      } finally {
        homePortfolioTable.loading = false;
      }
    }
    async function loadHomeHoldingTable() {
      homeHoldingTable.loading = true;
      try {
        const out = await getHoldingsTable({
          page: homeHoldingTable.page,
          page_size: homeHoldingTable.pageSize,
          sort_by: toHomeHoldingSortBy(homeHoldingTable.sortBy),
          sort_order: homeHoldingTable.sortOrder,
          q: homeHoldingTable.q || void 0,
          portfolio_id: homePortfolioId.value,
          display_currency: displayCurrency.value,
          include_hidden: false,
          include_excluded_portfolios: false
        });
        homeHoldingRows.value = out.items.map(mapHomeHoldingRow);
        homeHoldingTable.total = out.total;
      } finally {
        homeHoldingTable.loading = false;
      }
    }
    async function loadHomeLiabilityTable() {
      homeLiabilityTable.loading = true;
      try {
        const out = await getLiabilitiesTable({
          page: homeLiabilityTable.page,
          page_size: homeLiabilityTable.pageSize,
          sort_by: toHomeLiabilitySortBy(homeLiabilityTable.sortBy),
          sort_order: homeLiabilityTable.sortOrder,
          q: homeLiabilityTable.q || void 0,
          portfolio_id: homePortfolioId.value,
          display_currency: displayCurrency.value,
          include_hidden: false,
          include_excluded: false
        });
        homeLiabilityRows.value = out.items.map(mapHomeLiabilityRow);
        homeLiabilityTable.total = out.total;
      } finally {
        homeLiabilityTable.loading = false;
      }
    }
    function toggleLiveDashboard() {
      liveDashboardExpanded.value = !liveDashboardExpanded.value;
    }
    function toggleReportPanel() {
      reportPanelExpanded.value = !reportPanelExpanded.value;
    }
    function toggleReleaseNotesPanel() {
      releaseNotesExpanded.value = !releaseNotesExpanded.value;
    }
    function printLiveDashboard() {
      window.print();
    }
    function isCanvasBlank(canvas) {
      if (canvas.width === 0 || canvas.height === 0) {
        return true;
      }
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        return true;
      }
      const sampleW = Math.min(canvas.width, 128);
      const sampleH = Math.min(canvas.height, 128);
      const pixels = ctx.getImageData(0, 0, sampleW, sampleH).data;
      for (let i = 0; i < pixels.length; i += 4) {
        if (pixels[i + 3] !== 0) {
          return false;
        }
      }
      return true;
    }
    function drawDonutForExport(documentRef) {
      const donutNodes = documentRef.querySelectorAll("[data-export-donut='1']");
      donutNodes.forEach((node) => {
        const rawStops = node.dataset.donutStops ?? "";
        const startAngleDeg = Number(node.dataset.donutStartAngle ?? "0");
        const segments = rawStops.split("|").map((token) => token.trim()).filter((token) => token.length > 0).map((token) => {
          const [ratioText, color] = token.split(":");
          const ratio = Number(ratioText);
          return {
            ratioPct: Number.isFinite(ratio) ? Math.max(0, Math.min(100, ratio)) : 0,
            color: color || "#334155"
          };
        }).filter((item) => item.ratioPct > 0);
        const rect = node.getBoundingClientRect();
        const width = Math.max(1, Math.floor(node.clientWidth || rect.width || 1));
        const height = Math.max(1, Math.floor(node.clientHeight || rect.height || 1));
        const size = Math.max(1, Math.min(width, height));
        const canvas = documentRef.createElement("canvas");
        canvas.width = size * 2;
        canvas.height = size * 2;
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.style.display = "block";
        canvas.style.borderRadius = "9999px";
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          return;
        }
        ctx.scale(2, 2);
        const center = size / 2;
        const outerRadius = center;
        const innerRadius = center * 0.5;
        let cursor = (startAngleDeg - 90) * Math.PI / 180;
        if (segments.length === 0) {
          ctx.beginPath();
          ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
          ctx.fillStyle = "#334155";
          ctx.fill();
        } else {
          for (const segment of segments) {
            const angle = segment.ratioPct / 100 * Math.PI * 2;
            const next = cursor + angle;
            ctx.beginPath();
            ctx.moveTo(center, center);
            ctx.arc(center, center, outerRadius, cursor, next);
            ctx.closePath();
            ctx.fillStyle = segment.color;
            ctx.fill();
            cursor = next;
          }
        }
        ctx.globalCompositeOperation = "destination-out";
        ctx.beginPath();
        ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalCompositeOperation = "source-over";
        node.style.background = "none";
        node.replaceChildren(canvas);
      });
    }
    function applyAmountMaskForExport(documentRef) {
      const maskedNodes = documentRef.querySelectorAll("[style*='blur(6px)']");
      const calcMaskWidthCh = (text) => {
        const compactLength = text.replace(/\s+/g, "").length;
        if (compactLength <= 0) return 6;
        return Math.max(6, Math.min(24, Math.round(compactLength * 0.65)));
      };
      maskedNodes.forEach((node) => {
        const original = node.textContent ?? "";
        const maskWidth = calcMaskWidthCh(original);
        const maskBlock = documentRef.createElement("span");
        maskBlock.style.display = "inline-block";
        maskBlock.style.width = `${maskWidth}ch`;
        maskBlock.style.height = "1em";
        maskBlock.style.verticalAlign = "middle";
        maskBlock.style.borderRadius = "0.35em";
        maskBlock.style.background = "linear-gradient(180deg, rgba(148,163,184,0.62), rgba(100,116,139,0.58))";
        maskBlock.style.boxShadow = "inset 0 0 0 1px rgba(15,23,42,0.22), 0 1px 6px rgba(15,23,42,0.22)";
        maskBlock.style.filter = "blur(0.35px)";
        maskBlock.setAttribute("aria-hidden", "true");
        node.replaceChildren(maskBlock);
        node.style.filter = "none";
        node.style.webkitFilter = "none";
      });
    }
    async function ensureHtml2Canvas() {
      if (window.html2canvas) {
        return window.html2canvas;
      }
      await new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-myasset-html2canvas="1"]');
        if (existing) {
          existing.addEventListener("load", () => resolve(), { once: true });
          existing.addEventListener("error", () => reject(new Error("Failed to load html2canvas")), { once: true });
          return;
        }
        const script = document.createElement("script");
        script.src = "https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js";
        script.async = true;
        script.dataset.myassetHtml2canvas = "1";
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load html2canvas"));
        document.head.appendChild(script);
      });
      if (!window.html2canvas) {
        throw new Error("html2canvas not available");
      }
      return window.html2canvas;
    }
    async function exportLiveDashboardImage() {
      if (!liveDashboardRef.value) return;
      exportingImage.value = true;
      try {
        await nextTick();
        const target = liveDashboardRef.value;
        const rect = target.getBoundingClientRect();
        if (rect.width < 2 || rect.height < 2) {
          throw new Error("Live dashboard panel is not visible.");
        }
        const html2canvas = await ensureHtml2Canvas();
        const baseOptions = {
          backgroundColor: "#020617",
          scale: 2,
          useCORS: true,
          windowWidth: Math.max(document.documentElement.clientWidth, Math.ceil(rect.width)),
          windowHeight: Math.max(document.documentElement.clientHeight, Math.ceil(rect.height))
        };
        const onClone = (clonedDocument) => {
          drawDonutForExport(clonedDocument);
          if (liveMaskAmounts.value) {
            applyAmountMaskForExport(clonedDocument);
          }
        };
        let canvas;
        try {
          canvas = await html2canvas(target, {
            ...baseOptions,
            foreignObjectRendering: false,
            onclone: onClone
          });
        } catch {
          canvas = await html2canvas(target, {
            ...baseOptions,
            foreignObjectRendering: true,
            onclone: onClone
          });
        }
        if (isCanvasBlank(canvas)) {
          throw new Error("Captured image is blank. Retry after keeping panel fully visible.");
        }
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `myasset-live-dashboard-${(/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-")}.png`;
        link.click();
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errorMessage.value = `Failed to export image: ${message}. Try Print as fallback.`;
      } finally {
        exportingImage.value = false;
      }
    }
    onMounted(async () => {
      if (typeof window !== "undefined") {
        const saved = window.localStorage.getItem(LIVE_MASK_STORAGE_KEY);
        if (saved === "1" || saved === "true") {
          liveMaskAmounts.value = true;
        } else if (saved === "0" || saved === "false") {
          liveMaskAmounts.value = false;
        }
        const savedPortfolioBasis = window.localStorage.getItem(LIVE_PORTFOLIO_NET_BASIS_STORAGE_KEY);
        if (savedPortfolioBasis === "1" || savedPortfolioBasis === "true") {
          livePortfolioNetBasis.value = true;
        } else if (savedPortfolioBasis === "0" || savedPortfolioBasis === "false") {
          livePortfolioNetBasis.value = false;
        }
        const savedTrendPref = window.localStorage.getItem(LIVE_TREND_PREF_STORAGE_KEY);
        if (savedTrendPref) {
          try {
            const parsed = JSON.parse(savedTrendPref);
            if (typeof parsed.gross === "boolean") liveTrendVisibility.gross = parsed.gross;
            if (typeof parsed.liabilities === "boolean") liveTrendVisibility.liabilities = parsed.liabilities;
            if (typeof parsed.net === "boolean") liveTrendVisibility.net = parsed.net;
            if (parsed.mode === "SUMMARY" || parsed.mode === "PORTFOLIO") {
              homeTrendMode.value = parsed.mode;
            } else if (parsed.mode === "PORTFOLIO_RETURN") {
              homeTrendMode.value = "PORTFOLIO";
            }
            if (parsed.portfolioMetric === "RETURN" || parsed.portfolioMetric === "PROFIT" || parsed.portfolioMetric === "CURRENT_VALUE" || parsed.portfolioMetric === "CURRENT_NET") {
              homeTrendPortfolioMetric.value = parsed.portfolioMetric;
            }
            if (typeof parsed.portfolioKey === "string" && parsed.portfolioKey.length > 0) {
              homeTrendPortfolioKey.value = parsed.portfolioKey;
            }
          } catch {
          }
        }
        loadQuoteUpdateMeta();
        loadHomeTableSectionState();
        restoreHomeCardOrder();
      }
      const pageSize = getHomeTablePageSize();
      homePortfolioTable.pageSize = pageSize;
      homeHoldingTable.pageSize = pageSize;
      homeLiabilityTable.pageSize = pageSize;
      await ensureInitialized();
      await loadHomeData();
    });
    onBeforeUnmount(() => {
      clearQuoteUpdatePolling();
      if (homeActionToastTimer) {
        clearTimeout(homeActionToastTimer);
        homeActionToastTimer = null;
      }
    });
    watch(
      () => displayCurrency.value,
      (next, prev) => {
        if (summary.value && prev && next !== prev) {
          void loadHomeData();
        }
      }
    );
    watch(
      () => [liveDashboardTarget.value, livePortfolioKey.value],
      ([nextTarget, nextPortfolio], [prevTarget, prevPortfolio]) => {
        if (!summary.value) return;
        if (nextTarget !== prevTarget || nextPortfolio !== prevPortfolio) {
          void liveDashboardData.refreshAllocation();
        }
      }
    );
    watch(
      () => liveMaskAmounts.value,
      (next) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(LIVE_MASK_STORAGE_KEY, next ? "1" : "0");
      }
    );
    watch(
      () => livePortfolioNetBasis.value,
      (next) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(LIVE_PORTFOLIO_NET_BASIS_STORAGE_KEY, next ? "1" : "0");
      }
    );
    watch(
      () => [
        liveTrendVisibility.gross,
        liveTrendVisibility.liabilities,
        liveTrendVisibility.net,
        homeTrendMode.value,
        homeTrendPortfolioMetric.value,
        homeTrendPortfolioKey.value
      ],
      ([gross, liabilities2, net, mode, portfolioMetric, portfolioKey]) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(
          LIVE_TREND_PREF_STORAGE_KEY,
          JSON.stringify({ gross, liabilities: liabilities2, net, mode, portfolioMetric, portfolioKey })
        );
      }
    );
    watch(
      () => [homeTrendMode.value, homeTrendPortfolioMetric.value, homeTrendPortfolioKey.value],
      ([mode], [prevMode]) => {
        if (!summary.value) return;
        if (mode === "PORTFOLIO") {
          void loadHomePortfolioTrend();
        } else if (prevMode === "PORTFOLIO") {
          homeTrendError.value = "";
        }
      }
    );
    watch(
      () => [
        liveDashboardExpanded.value,
        reportPanelExpanded.value,
        releaseNotesExpanded.value,
        homePortfoliosExpanded.value,
        homeHoldingsExpanded.value,
        homeLiabilitiesExpanded.value
      ],
      ([
        _nextLiveDashboard,
        _nextReportPanel,
        _nextReleaseNotes,
        nextPortfolios,
        nextHoldings,
        nextLiabilities
      ], [
        _prevLiveDashboard,
        _prevReportPanel,
        _prevReleaseNotes,
        prevPortfolios,
        prevHoldings,
        prevLiabilities
      ]) => {
        saveHomeTableSectionState();
        if (nextPortfolios && !prevPortfolios) {
          void loadHomePortfolioTable();
        }
        if (nextHoldings && !prevHoldings) {
          void loadHomeHoldingTable();
        }
        if (nextLiabilities && !prevLiabilities) {
          void loadHomeLiabilityTable();
        }
      }
    );
    watch(
      homeCardOrder,
      (next) => {
        if (typeof window === "undefined") return;
        window.localStorage.setItem(HOME_CARD_ORDER_STORAGE_KEY, JSON.stringify(normalizeHomeCardOrder(next)));
      },
      { deep: true }
    );
    watch(
      () => homePortfolioKey.value,
      () => {
        homePortfolioTable.page = 1;
        homeHoldingTable.page = 1;
        homeLiabilityTable.page = 1;
        if (homePortfoliosExpanded.value) {
          void loadHomePortfolioTable();
        }
        if (homeHoldingsExpanded.value) {
          void loadHomeHoldingTable();
        }
        if (homeLiabilitiesExpanded.value) {
          void loadHomeLiabilityTable();
        }
      }
    );
    watch(
      () => [
        homePortfolioTable.page,
        homePortfolioTable.pageSize,
        homePortfolioTable.sortBy,
        homePortfolioTable.sortOrder,
        displayCurrency.value
      ],
      () => {
        if (!homePortfoliosExpanded.value) return;
        void loadHomePortfolioTable();
      }
    );
    watch(
      () => [
        homeHoldingTable.page,
        homeHoldingTable.pageSize,
        homeHoldingTable.sortBy,
        homeHoldingTable.sortOrder,
        homeHoldingTable.q,
        displayCurrency.value
      ],
      () => {
        if (!homeHoldingsExpanded.value) return;
        void loadHomeHoldingTable();
      }
    );
    watch(
      () => [
        homeLiabilityTable.page,
        homeLiabilityTable.pageSize,
        homeLiabilityTable.sortBy,
        homeLiabilityTable.sortOrder,
        homeLiabilityTable.q,
        displayCurrency.value
      ],
      () => {
        if (!homeLiabilitiesExpanded.value) return;
        void loadHomeLiabilityTable();
      }
    );
    watch(
      () => homeHoldingSearchTerm.value,
      (next) => {
        if (homeHoldingSearchDebounceTimer) {
          clearTimeout(homeHoldingSearchDebounceTimer);
        }
        homeHoldingSearchDebounceTimer = setTimeout(() => {
          homeHoldingTable.q = next.trim();
          homeHoldingTable.page = 1;
          homeHoldingSearchDebounceTimer = null;
        }, 300);
      }
    );
    watch(
      () => homeLiabilitySearchTerm.value,
      (next) => {
        if (homeLiabilitySearchDebounceTimer) {
          clearTimeout(homeLiabilitySearchDebounceTimer);
        }
        homeLiabilitySearchDebounceTimer = setTimeout(() => {
          homeLiabilityTable.q = next.trim();
          homeLiabilityTable.page = 1;
          homeLiabilitySearchDebounceTimer = null;
        }, 300);
      }
    );
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[36] || (_cache[36] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300" }, "Home"),
              _createElementVNode("h1", { class: "mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "Live Dashboard"),
              _createElementVNode("p", { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" }, " This page now uses real API data from summary, holdings performance, and liabilities. ")
            ], -1)),
            _createElementVNode("div", _hoisted_4, [
              _createElementVNode("button", {
                type: "button",
                class: _normalizeClass([
                  "rounded-xl border px-3 py-2 text-sm font-semibold transition-colors",
                  liveMaskAmounts.value ? "border-amber-400 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                ]),
                onClick: _cache[0] || (_cache[0] = ($event) => liveMaskAmounts.value = !liveMaskAmounts.value)
              }, " Amount Blur " + _toDisplayString(liveMaskAmounts.value ? "ON" : "OFF"), 3),
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
        homeActionToast.value ? (_openBlock(), _createElementBlock("article", {
          key: 1,
          class: _normalizeClass([
            "rounded-2xl border p-3 text-sm shadow-sm",
            homeActionToast.value.kind === "ERROR" ? "border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200" : homeActionToast.value.kind === "SUCCESS" ? "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200" : "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200"
          ])
        }, _toDisplayString(homeActionToast.value.message), 3)) : _createCommentVNode("", true),
        _createElementVNode("div", _hoisted_8, [
          _createElementVNode("div", {
            class: _normalizeClass(["rounded-2xl", homeCardDraggingKey.value === "LIVE_DASHBOARD" ? "ring-2 ring-indigo-400/70" : ""]),
            draggable: "true",
            style: _normalizeStyle({ order: getHomeCardOrder("LIVE_DASHBOARD") }),
            onDragstart: _cache[11] || (_cache[11] = ($event) => onHomeCardDragStart("LIVE_DASHBOARD", $event)),
            onDragover: onHomeCardDragOver,
            onDrop: _cache[12] || (_cache[12] = ($event) => onHomeCardDrop("LIVE_DASHBOARD", $event)),
            onDragend: onHomeCardDragEnd
          }, [
            _createVNode(_sfc_main$2, {
              title: "Live Dashboard Panel",
              description: "Default is collapsed. Expand to preview dashboard widgets and export image.",
              "source-mode": "LIVE",
              expanded: liveDashboardExpanded.value,
              "collapsed-message": "Collapsed. Click Expand to preview and export.",
              onToggle: toggleLiveDashboard
            }, {
              controls: _withCtx(() => [
                _createElementVNode("div", _hoisted_9, [
                  _createElementVNode("div", _hoisted_10, [
                    _cache[39] || (_cache[39] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "KPI", -1)),
                    _createElementVNode("div", _hoisted_11, [
                      _createElementVNode("button", {
                        type: "button",
                        class: _normalizeClass(["rounded-lg border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs", liveKpiTarget.value === "SUMMARY" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                        onClick: _cache[1] || (_cache[1] = ($event) => liveKpiTarget.value = "SUMMARY")
                      }, " Summary ", 2),
                      _createElementVNode("button", {
                        type: "button",
                        class: _normalizeClass(["rounded-lg border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs", liveKpiTarget.value === "PORTFOLIOS" ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                        onClick: _cache[2] || (_cache[2] = ($event) => liveKpiTarget.value = "PORTFOLIOS")
                      }, " Portfolios ", 2)
                    ]),
                    _cache[40] || (_cache[40] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Target", -1)),
                    _createElementVNode("div", _hoisted_12, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["GROSS", "LIABILITIES", "NET", "HOLDINGS"], (target) => {
                        return _createElementVNode("button", {
                          key: `home-target-${target}`,
                          type: "button",
                          class: _normalizeClass(["rounded-lg border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs", liveDashboardTarget.value === target ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                          onClick: ($event) => liveDashboardTarget.value = target
                        }, _toDisplayString(target), 11, _hoisted_13);
                      }), 64))
                    ]),
                    _cache[41] || (_cache[41] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Start", -1)),
                    _createElementVNode("div", _hoisted_14, [
                      (_openBlock(), _createElementBlock(_Fragment, null, _renderList(["TOP", "RIGHT", "LEFT"], (pos) => {
                        return _createElementVNode("button", {
                          key: `home-donut-start-${pos}`,
                          type: "button",
                          class: _normalizeClass(["rounded-lg border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs", liveDonutStartPosition.value === pos ? "border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : "border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"]),
                          onClick: ($event) => liveDonutStartPosition.value = pos
                        }, _toDisplayString(pos), 11, _hoisted_15);
                      }), 64))
                    ]),
                    _cache[42] || (_cache[42] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Portfolio", -1)),
                    _createElementVNode("div", _hoisted_16, [
                      _withDirectives(_createElementVNode("select", {
                        "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => livePortfolioKey.value = $event),
                        class: "w-full min-w-0 rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 sm:w-auto sm:min-w-[12rem] sm:py-1.5 sm:text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
                      }, [
                        _cache[37] || (_cache[37] = _createElementVNode("option", { value: "ALL" }, "All", -1)),
                        (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(portfolios.value, (item) => {
                          return _openBlock(), _createElementBlock("option", {
                            key: `home-live-portfolio-${item.id}`,
                            value: String(item.id)
                          }, _toDisplayString(item.name), 9, _hoisted_17);
                        }), 128))
                      ], 512), [
                        [_vModelSelect, livePortfolioKey.value]
                      ]),
                      _createElementVNode("label", _hoisted_18, [
                        _withDirectives(_createElementVNode("input", {
                          "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => livePortfolioNetBasis.value = $event),
                          type: "checkbox",
                          class: "h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                        }, null, 512), [
                          [_vModelCheckbox, livePortfolioNetBasis.value]
                        ]),
                        _cache[38] || (_cache[38] = _createTextVNode(" Net ", -1))
                      ])
                    ]),
                    _cache[43] || (_cache[43] = _createElementVNode("span", { class: "text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400" }, "Actions", -1)),
                    _createElementVNode("div", _hoisted_19, [
                      canManageQuoteUpdates.value ? (_openBlock(), _createElementBlock("button", {
                        key: 0,
                        type: "button",
                        class: "min-w-[10rem] grow rounded-lg border border-emerald-300 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-60 sm:grow-0 sm:px-3 sm:py-1.5 sm:text-xs dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20",
                        disabled: quoteUpdatePolling.value || loading.value,
                        onClick: runHomeUpdateQuotesNow
                      }, _toDisplayString(quoteUpdatePolling.value ? `Update Quotes Running... ${quoteUpdateProgressText.value}` : "Update Quotes Now"), 9, _hoisted_20)) : _createCommentVNode("", true),
                      canManageQuoteUpdates.value && (quoteUpdatePolling.value || quoteUpdateStatus.value === "COMPLETED" || quoteUpdateStatus.value === "FAILED") ? (_openBlock(), _createElementBlock("span", {
                        key: 1,
                        class: _normalizeClass([
                          "rounded-full px-2 py-1 text-[11px] font-semibold",
                          quoteUpdatePolling.value ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200" : quoteUpdateStatus.value === "COMPLETED" ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200" : "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200"
                        ])
                      }, _toDisplayString(quoteUpdatePolling.value ? `${quoteUpdateStatus.value} ${quoteUpdateProgressText.value}` : quoteUpdateStatus.value), 3)) : _createCommentVNode("", true),
                      _createElementVNode("button", {
                        type: "button",
                        class: "min-w-[8rem] grow rounded-lg border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:grow-0 sm:px-3 sm:py-1.5 sm:text-xs dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                        onClick: printLiveDashboard
                      }, " Print "),
                      _createElementVNode("button", {
                        type: "button",
                        class: "min-w-[8rem] grow rounded-lg border border-emerald-300 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-60 sm:grow-0 sm:px-3 sm:py-1.5 sm:text-xs dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20",
                        disabled: exportingImage.value || loading.value || !liveDashboardExpanded.value,
                        onClick: exportLiveDashboardImage
                      }, _toDisplayString(exportingImage.value ? "Exporting..." : "Export PNG"), 9, _hoisted_21),
                      canManageQuoteUpdates.value && quoteUpdateLastResultLabel.value ? (_openBlock(), _createElementBlock("p", _hoisted_22, _toDisplayString(quoteUpdateLastResultLabel.value), 1)) : _createCommentVNode("", true)
                    ])
                  ])
                ])
              ]),
              default: _withCtx(() => [
                _createElementVNode("div", {
                  ref_key: "liveDashboardRef",
                  ref: liveDashboardRef,
                  class: "grid grid-cols-1 gap-3 xl:grid-cols-2"
                }, [
                  _createElementVNode("div", _hoisted_23, [
                    liveKpiTarget.value === "SUMMARY" ? (_openBlock(), _createBlock(_sfc_main$3, {
                      key: 0,
                      title: "KPI Summary",
                      subtitle: "Included in print/snapshot",
                      currency: summaryDisplayCurrency.value,
                      "gross-assets-total": grossAssetsTotal.value,
                      "liabilities-total": liabilitiesTotal.value,
                      "net-assets-total": netAssetsTotal.value,
                      "invested-principal-total": investedPrincipalTotal.value,
                      "principal-minus-debt-total": principalMinusDebtTotal.value,
                      "gross-return-pct": kpiGrossReturnPct.value,
                      "net-return-pct": kpiNetReturnPct.value,
                      "gross-profit-total": kpiGrossProfitTotal.value,
                      "net-profit-total": kpiNetProfitTotal.value,
                      "as-of": asOf.value,
                      "mask-amounts": liveMaskAmounts.value
                    }, null, 8, ["currency", "gross-assets-total", "liabilities-total", "net-assets-total", "invested-principal-total", "principal-minus-debt-total", "gross-return-pct", "net-return-pct", "gross-profit-total", "net-profit-total", "as-of", "mask-amounts"])) : (_openBlock(), _createBlock(_sfc_main$4, {
                      key: 1,
                      title: "KPI Portfolios",
                      subtitle: `Per portfolio | ${livePortfolioNetBasis.value ? "Net basis" : "Gross basis"} | Included in print/snapshot`,
                      currency: summaryDisplayCurrency.value,
                      portfolios: liveKpiPortfolioRows.value,
                      "mask-amounts": liveMaskAmounts.value,
                      "use-net-basis": livePortfolioNetBasis.value
                    }, null, 8, ["subtitle", "currency", "portfolios", "mask-amounts", "use-net-basis"]))
                  ]),
                  _createVNode(_sfc_main$5, {
                    title: `Allocation | ${liveDashboardTarget.value}`,
                    subtitle: `Top N + Others (${livePortfolioKey.value === "ALL" ? "all portfolios" : "filtered portfolio"})`,
                    currency: summaryDisplayCurrency.value,
                    total: donutTotal.value,
                    items: donutItems.value,
                    "start-position": liveDonutStartPosition.value,
                    "mask-amounts": liveMaskAmounts.value,
                    loading: dashboardDonutLoading.value,
                    error: dashboardDonutError.value
                  }, null, 8, ["title", "subtitle", "currency", "total", "items", "start-position", "mask-amounts", "loading", "error"]),
                  _createVNode(_sfc_main$6, {
                    title: `Treemap | ${liveDashboardTarget.value}`,
                    subtitle: liveDashboardTarget.value === "HOLDINGS" ? `Target=HOLDINGS | group_by=ASSET | color=return ${livePortfolioKey.value === "ALL" ? "" : `| ${livePortfolioLabel.value}`}` : `Target=${liveDashboardTarget.value} | group_by=PORTFOLIO | color=return`,
                    currency: summaryDisplayCurrency.value,
                    items: liveTreemapItems.value,
                    "mask-amounts": liveMaskAmounts.value,
                    loading: dashboardTreemapLoading.value,
                    error: dashboardTreemapError.value
                  }, null, 8, ["title", "subtitle", "currency", "items", "mask-amounts", "loading", "error"]),
                  _createElementVNode("div", _hoisted_24, [
                    _createVNode(_sfc_main$7, {
                      title: "Networth Trend",
                      subtitle: "valuation_snapshots | bucket=DAY",
                      currency: summaryDisplayCurrency.value,
                      points: trendPoints.value,
                      "mask-amounts": liveMaskAmounts.value,
                      loading: dashboardTrendLoading.value,
                      error: dashboardTrendError.value,
                      "show-gross": liveTrendVisibility.gross,
                      "show-liabilities": liveTrendVisibility.liabilities,
                      "show-net": liveTrendVisibility.net,
                      mode: homeTrendMode.value,
                      "portfolio-metric": homeTrendPortfolioMetric.value,
                      "portfolio-lines": homeTrendPortfolioLines.value,
                      "portfolio-options": homeTrendPortfolioOptions.value,
                      "portfolio-key": homeTrendPortfolioKey.value,
                      "onUpdate:showGross": _cache[5] || (_cache[5] = ($event) => liveTrendVisibility.gross = $event),
                      "onUpdate:showLiabilities": _cache[6] || (_cache[6] = ($event) => liveTrendVisibility.liabilities = $event),
                      "onUpdate:showNet": _cache[7] || (_cache[7] = ($event) => liveTrendVisibility.net = $event),
                      "onUpdate:mode": _cache[8] || (_cache[8] = ($event) => homeTrendMode.value = $event),
                      "onUpdate:portfolioMetric": _cache[9] || (_cache[9] = ($event) => homeTrendPortfolioMetric.value = $event),
                      "onUpdate:portfolioKey": _cache[10] || (_cache[10] = ($event) => homeTrendPortfolioKey.value = $event)
                    }, null, 8, ["currency", "points", "mask-amounts", "loading", "error", "show-gross", "show-liabilities", "show-net", "mode", "portfolio-metric", "portfolio-lines", "portfolio-options", "portfolio-key"])
                  ])
                ], 512)
              ]),
              _: 1
            }, 8, ["expanded"])
          ], 38),
          _createElementVNode("div", {
            class: _normalizeClass(["rounded-2xl", homeCardDraggingKey.value === "GOAL_PROGRESS" ? "ring-2 ring-indigo-400/70" : ""]),
            draggable: "true",
            style: _normalizeStyle({ order: getHomeCardOrder("GOAL_PROGRESS") }),
            onDragstart: _cache[13] || (_cache[13] = ($event) => onHomeCardDragStart("GOAL_PROGRESS", $event)),
            onDragover: onHomeCardDragOver,
            onDrop: _cache[14] || (_cache[14] = ($event) => onHomeCardDrop("GOAL_PROGRESS", $event)),
            onDragend: onHomeCardDragEnd
          }, [
            _createVNode(_sfc_main$1, {
              title: "Goal Progress and Forecast",
              subtitle: "Track how close your current wealth is to the target and when it may be reached.",
              "display-currency": summaryDisplayCurrency.value === "USD" ? "USD" : "KRW",
              "scope-type": homeGoalScopeType.value,
              "scope-id": homeGoalScopeId.value,
              "amount-mask": liveMaskAmounts.value,
              "storage-key-prefix": "myasset:home:goal-progress"
            }, null, 8, ["display-currency", "scope-type", "scope-id", "amount-mask"])
          ], 38),
          _createElementVNode("div", {
            class: _normalizeClass(["rounded-2xl", homeCardDraggingKey.value === "PORTFOLIOS_TABLE" ? "ring-2 ring-indigo-400/70" : ""]),
            draggable: "true",
            style: _normalizeStyle({ order: getHomeCardOrder("PORTFOLIOS_TABLE") }),
            onDragstart: _cache[18] || (_cache[18] = ($event) => onHomeCardDragStart("PORTFOLIOS_TABLE", $event)),
            onDragover: onHomeCardDragOver,
            onDrop: _cache[19] || (_cache[19] = ($event) => onHomeCardDrop("PORTFOLIOS_TABLE", $event)),
            onDragend: onHomeCardDragEnd
          }, [
            _createVNode(_sfc_main$8, {
              title: "Portfolios Table",
              subtitle: "Portfolio / Current / Invested Principal / Profit / Return",
              expanded: homePortfoliosExpanded.value,
              loading: homePortfolioTable.loading,
              rows: homePortfolioRows.value,
              total: homePortfolioTable.total,
              page: homePortfolioTable.page,
              "page-size": homePortfolioTable.pageSize,
              "sort-by": homePortfolioTable.sortBy,
              "sort-order": homePortfolioTable.sortOrder,
              currency: summaryDisplayCurrency.value,
              "mask-amounts": liveMaskAmounts.value,
              "show-filter": true,
              "portfolio-key": homePortfolioKey.value,
              "portfolio-options": homePortfolioOptions.value,
              onToggle: _cache[15] || (_cache[15] = ($event) => homePortfoliosExpanded.value = !homePortfoliosExpanded.value),
              onSort: toggleHomePortfolioSort,
              onSetPage: _cache[16] || (_cache[16] = ($event) => homePortfolioTable.page = $event),
              onSelectAll: selectHomeAllPortfolios,
              onSetPortfolioKey: _cache[17] || (_cache[17] = ($event) => homePortfolioKey.value = $event)
            }, null, 8, ["expanded", "loading", "rows", "total", "page", "page-size", "sort-by", "sort-order", "currency", "mask-amounts", "portfolio-key", "portfolio-options"])
          ], 38),
          _createElementVNode("div", {
            class: _normalizeClass(["rounded-2xl", homeCardDraggingKey.value === "HOLDINGS_TABLE" ? "ring-2 ring-indigo-400/70" : ""]),
            draggable: "true",
            style: _normalizeStyle({ order: getHomeCardOrder("HOLDINGS_TABLE") }),
            onDragstart: _cache[23] || (_cache[23] = ($event) => onHomeCardDragStart("HOLDINGS_TABLE", $event)),
            onDragover: onHomeCardDragOver,
            onDrop: _cache[24] || (_cache[24] = ($event) => onHomeCardDrop("HOLDINGS_TABLE", $event)),
            onDragend: onHomeCardDragEnd
          }, [
            _createVNode(_sfc_main$9, {
              title: "Holdings Table",
              subtitle: "Portfolio / Asset / Price / Avg Cost / Evaluated / Cost Basis / Profit / Return / Symbol",
              expanded: homeHoldingsExpanded.value,
              loading: homeHoldingTable.loading,
              rows: homeHoldingRows.value,
              total: homeHoldingTable.total,
              page: homeHoldingTable.page,
              "page-size": homeHoldingTable.pageSize,
              "sort-by": homeHoldingTable.sortBy,
              "sort-order": homeHoldingTable.sortOrder,
              "search-term": homeHoldingSearchTerm.value,
              "mask-amounts": liveMaskAmounts.value,
              "display-currency": summaryDisplayCurrency.value,
              onToggle: _cache[20] || (_cache[20] = ($event) => homeHoldingsExpanded.value = !homeHoldingsExpanded.value),
              onSort: toggleHomeHoldingSort,
              onSetPage: _cache[21] || (_cache[21] = ($event) => homeHoldingTable.page = $event),
              "onUpdate:searchTerm": _cache[22] || (_cache[22] = ($event) => homeHoldingSearchTerm.value = $event)
            }, null, 8, ["expanded", "loading", "rows", "total", "page", "page-size", "sort-by", "sort-order", "search-term", "mask-amounts", "display-currency"])
          ], 38),
          _createElementVNode("div", {
            class: _normalizeClass(["rounded-2xl", homeCardDraggingKey.value === "LIABILITIES_TABLE" ? "ring-2 ring-indigo-400/70" : ""]),
            draggable: "true",
            style: _normalizeStyle({ order: getHomeCardOrder("LIABILITIES_TABLE") }),
            onDragstart: _cache[28] || (_cache[28] = ($event) => onHomeCardDragStart("LIABILITIES_TABLE", $event)),
            onDragover: onHomeCardDragOver,
            onDrop: _cache[29] || (_cache[29] = ($event) => onHomeCardDrop("LIABILITIES_TABLE", $event)),
            onDragend: onHomeCardDragEnd
          }, [
            _createVNode(_sfc_main$a, {
              title: "Liabilities Table",
              subtitle: "Portfolio / Liability / Balance / Type",
              expanded: homeLiabilitiesExpanded.value,
              loading: homeLiabilityTable.loading,
              rows: homeLiabilityRows.value,
              total: homeLiabilityTable.total,
              page: homeLiabilityTable.page,
              "page-size": homeLiabilityTable.pageSize,
              "sort-by": homeLiabilityTable.sortBy,
              "sort-order": homeLiabilityTable.sortOrder,
              "search-term": homeLiabilitySearchTerm.value,
              "mask-amounts": liveMaskAmounts.value,
              onToggle: _cache[25] || (_cache[25] = ($event) => homeLiabilitiesExpanded.value = !homeLiabilitiesExpanded.value),
              onSort: toggleHomeLiabilitySort,
              onSetPage: _cache[26] || (_cache[26] = ($event) => homeLiabilityTable.page = $event),
              "onUpdate:searchTerm": _cache[27] || (_cache[27] = ($event) => homeLiabilitySearchTerm.value = $event)
            }, null, 8, ["expanded", "loading", "rows", "total", "page", "page-size", "sort-by", "sort-order", "search-term", "mask-amounts"])
          ], 38),
          _createElementVNode("div", {
            class: _normalizeClass(["rounded-2xl", homeCardDraggingKey.value === "REPORT_PANEL" ? "ring-2 ring-indigo-400/70" : ""]),
            draggable: "true",
            style: _normalizeStyle({ order: getHomeCardOrder("REPORT_PANEL") }),
            onDragstart: _cache[30] || (_cache[30] = ($event) => onHomeCardDragStart("REPORT_PANEL", $event)),
            onDragover: onHomeCardDragOver,
            onDrop: _cache[31] || (_cache[31] = ($event) => onHomeCardDrop("REPORT_PANEL", $event)),
            onDragend: onHomeCardDragEnd
          }, [
            _createElementVNode("article", _hoisted_25, [
              _createElementVNode("div", _hoisted_26, [
                _cache[44] || (_cache[44] = _createElementVNode("div", null, [
                  _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Report Panel"),
                  _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, " Gross/Liabilities/Net plus Top cards grouped together. ")
                ], -1)),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  onClick: toggleReportPanel
                }, _toDisplayString(reportPanelExpanded.value ? "Collapse" : "Expand"), 1)
              ]),
              reportPanelExpanded.value ? (_openBlock(), _createElementBlock("div", _hoisted_27, [
                _createVNode(_sfc_main$b, {
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
                  liabilities: liabilities.value,
                  "mask-amounts": liveMaskAmounts.value
                }, null, 8, ["display-currency", "gross-assets-total", "liabilities-total", "net-assets-total", "invested-principal-total", "principal-minus-debt-total", "principal-return-pct", "net-assets-return-pct", "principal-profit-total", "net-assets-profit-total", "portfolios", "liabilities", "mask-amounts"]),
                _createElementVNode("article", _hoisted_28, [
                  _cache[49] || (_cache[49] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
                    _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Portfolios"),
                    _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By gross assets")
                  ], -1)),
                  topPortfolios.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_29, " No portfolio data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_30, [
                    (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topPortfolios.value, (item) => {
                      return _openBlock(), _createElementBlock("li", {
                        key: item.id,
                        class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                      }, [
                        _createElementVNode("div", _hoisted_31, [
                          _createElementVNode("p", _hoisted_32, [
                            _createTextVNode(_toDisplayString(item.name) + " ", 1),
                            _createElementVNode("span", _hoisted_33, _toDisplayString(item.type), 1)
                          ]),
                          _createElementVNode("p", {
                            class: _normalizeClass(["text-xs font-semibold", item.total_return_pct == null ? "text-slate-500" : toNumber(item.total_return_pct) >= 0 ? "text-emerald-600" : "text-rose-500"])
                          }, _toDisplayString(formatPercent(item.total_return_pct == null ? null : toNumber(item.total_return_pct))), 3)
                        ]),
                        _createElementVNode("div", _hoisted_34, [
                          _cache[45] || (_cache[45] = _createTextVNode(" Gross ", -1)),
                          _createElementVNode("span", {
                            style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                          }, _toDisplayString(formatCurrency(toNumber(item.gross_assets_total), item.base_currency || summaryDisplayCurrency.value)), 5),
                          _cache[46] || (_cache[46] = _createTextVNode(" / Debt-Adjusted Principal ", -1)),
                          _createElementVNode("span", {
                            style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                          }, _toDisplayString(formatCurrency(
                            toNumber(item.debt_adjusted_principal_total ?? item.principal_minus_debt_total),
                            item.base_currency || summaryDisplayCurrency.value
                          )), 5)
                        ]),
                        _createElementVNode("div", _hoisted_35, [
                          _cache[47] || (_cache[47] = _createTextVNode(" Net ", -1)),
                          _createElementVNode("span", {
                            style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                          }, _toDisplayString(formatCurrency(toNumber(item.net_assets_total), item.base_currency || summaryDisplayCurrency.value)), 5),
                          _cache[48] || (_cache[48] = _createTextVNode(" · Portfolio Profit ", -1)),
                          _createElementVNode("span", {
                            style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                          }, _toDisplayString(formatSignedCurrency(
                            toNumber(item.portfolio_profit_total ?? item.total_pnl_amount),
                            item.base_currency || summaryDisplayCurrency.value
                          )), 5)
                        ])
                      ]);
                    }), 128))
                  ]))
                ]),
                _createElementVNode("div", _hoisted_36, [
                  _createElementVNode("article", _hoisted_37, [
                    _cache[51] || (_cache[51] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
                      _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Holdings"),
                      _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By evaluated amount")
                    ], -1)),
                    topHoldings.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_38, " No holdings data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_39, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topHoldings.value, (item) => {
                        return _openBlock(), _createElementBlock("li", {
                          key: item.holding_id,
                          class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                        }, [
                          _createElementVNode("div", _hoisted_40, [
                            _createElementVNode("p", _hoisted_41, [
                              _createTextVNode(_toDisplayString(item.asset_name) + " ", 1),
                              _createElementVNode("span", _hoisted_42, _toDisplayString(item.asset_symbol || "-"), 1)
                            ]),
                            _createElementVNode("p", {
                              class: _normalizeClass(["text-xs font-semibold", toNumber(item.pnl_pct) >= 0 ? "text-emerald-600" : "text-rose-500"])
                            }, _toDisplayString(formatPercent(toNumber(item.pnl_pct))), 3)
                          ]),
                          _createElementVNode("div", _hoisted_43, [
                            _createElementVNode("span", {
                              style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                            }, _toDisplayString(formatOptionalCurrency(item.current_price, item.current_price_currency || summaryDisplayCurrency.value)), 5),
                            _cache[50] || (_cache[50] = _createTextVNode(" / ", -1)),
                            _createElementVNode("span", {
                              style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                            }, _toDisplayString(formatOptionalCurrency(item.avg_price, item.current_price_currency || summaryDisplayCurrency.value)), 5)
                          ])
                        ]);
                      }), 128))
                    ]))
                  ]),
                  _createElementVNode("article", _hoisted_44, [
                    _cache[52] || (_cache[52] = _createElementVNode("div", { class: "mb-4 flex items-center justify-between" }, [
                      _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Top Liabilities"),
                      _createElementVNode("span", { class: "text-xs text-slate-500 dark:text-slate-400" }, "By outstanding balance")
                    ], -1)),
                    topLiabilities.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_45, " No liabilities data. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_46, [
                      (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(topLiabilities.value, (item) => {
                        return _openBlock(), _createElementBlock("li", {
                          key: item.id,
                          class: "rounded-xl border border-slate-200 p-3 dark:border-slate-700"
                        }, [
                          _createElementVNode("div", _hoisted_47, [
                            _createElementVNode("p", _hoisted_48, _toDisplayString(item.name), 1),
                            _createElementVNode("p", _hoisted_49, _toDisplayString(item.liability_type), 1)
                          ]),
                          _createElementVNode("div", _hoisted_50, [
                            _createElementVNode("span", {
                              style: _normalizeStyle(liveMaskAmounts.value ? { filter: "blur(6px)" } : void 0)
                            }, _toDisplayString(formatCurrency(toNumber(item.outstanding_balance), item.currency || summaryDisplayCurrency.value)), 5)
                          ])
                        ]);
                      }), 128))
                    ]))
                  ])
                ])
              ])) : (_openBlock(), _createElementBlock("p", _hoisted_51, [..._cache[53] || (_cache[53] = [
                _createTextVNode(" Collapsed. Click ", -1),
                _createElementVNode("span", { class: "font-semibold" }, "Expand", -1),
                _createTextVNode(" to preview report cards. ", -1)
              ])]))
            ])
          ], 38),
          _createElementVNode("div", {
            class: _normalizeClass(["rounded-2xl", homeCardDraggingKey.value === "QUICK_INSIGHT" ? "ring-2 ring-indigo-400/70" : ""]),
            draggable: "true",
            style: _normalizeStyle({ order: getHomeCardOrder("QUICK_INSIGHT") }),
            onDragstart: _cache[32] || (_cache[32] = ($event) => onHomeCardDragStart("QUICK_INSIGHT", $event)),
            onDragover: onHomeCardDragOver,
            onDrop: _cache[33] || (_cache[33] = ($event) => onHomeCardDrop("QUICK_INSIGHT", $event)),
            onDragend: onHomeCardDragEnd
          }, [
            _createVNode(_sfc_main$c, {
              title: "Quick Insight",
              description: "Valuation snapshot delta analysis",
              "source-mode": "LIVE",
              "display-currency": quickInsightDisplayCurrency.value,
              "amount-mask": liveMaskAmounts.value,
              "allow-custom-compare": true,
              "storage-key-prefix": "myasset:home:quick-insight"
            }, null, 8, ["display-currency", "amount-mask"])
          ], 38),
          _createElementVNode("div", {
            class: _normalizeClass(["rounded-2xl", homeCardDraggingKey.value === "RELEASE_NOTES" ? "ring-2 ring-indigo-400/70" : ""]),
            draggable: "true",
            style: _normalizeStyle({ order: getHomeCardOrder("RELEASE_NOTES") }),
            onDragstart: _cache[34] || (_cache[34] = ($event) => onHomeCardDragStart("RELEASE_NOTES", $event)),
            onDragover: onHomeCardDragOver,
            onDrop: _cache[35] || (_cache[35] = ($event) => onHomeCardDrop("RELEASE_NOTES", $event)),
            onDragend: onHomeCardDragEnd
          }, [
            _createElementVNode("article", _hoisted_52, [
              _createElementVNode("div", _hoisted_53, [
                _cache[54] || (_cache[54] = _createElementVNode("div", null, [
                  _createElementVNode("h2", { class: "text-base font-semibold text-slate-900 dark:text-slate-100" }, "Release Notes"),
                  _createElementVNode("p", { class: "mt-1 text-xs text-slate-500 dark:text-slate-400" }, "Latest first")
                ], -1)),
                _createElementVNode("button", {
                  type: "button",
                  class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                  onClick: toggleReleaseNotesPanel
                }, _toDisplayString(releaseNotesExpanded.value ? "Collapse" : "Expand"), 1)
              ]),
              releaseNotesExpanded.value ? (_openBlock(), _createElementBlock("div", _hoisted_54, [
                releaseNoteItems.value.length === 0 ? (_openBlock(), _createElementBlock("div", _hoisted_55, " No release notes yet. ")) : (_openBlock(), _createElementBlock("ul", _hoisted_56, [
                  (_openBlock(true), _createElementBlock(_Fragment, null, _renderList(releaseNoteItems.value, (note) => {
                    return _openBlock(), _createElementBlock("li", {
                      key: note.id,
                      class: "rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
                    }, [
                      _createElementVNode("p", _hoisted_57, _toDisplayString(formatDateTime(note.releasedAt)), 1),
                      _createElementVNode("p", _hoisted_58, _toDisplayString(note.title), 1),
                      _createElementVNode("p", _hoisted_59, _toDisplayString(note.summary), 1)
                    ]);
                  }), 128))
                ]))
              ])) : (_openBlock(), _createElementBlock("p", _hoisted_60, [..._cache[55] || (_cache[55] = [
                _createTextVNode(" Collapsed. Click ", -1),
                _createElementVNode("span", { class: "font-semibold" }, "Expand", -1),
                _createTextVNode(" to view release notes. ", -1)
              ])]))
            ])
          ], 38)
        ])
      ]);
    };
  }
});

export { _sfc_main as default };
