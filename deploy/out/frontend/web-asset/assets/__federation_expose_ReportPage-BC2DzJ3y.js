import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { g as getSummary } from './analytics-CbRmvasB.js';
import { g as getLiabilitiesTable } from './liabilities-C9jGBx8W.js';
import { g as getPortfoliosTable } from './portfolios-DH2MjKkA.js';
import { _ as _sfc_main$1 } from './KpiBreakdownCards.vue_vue_type_script_setup_true_lang-CB7SW8tJ.js';

const {defineComponent:_defineComponent} = await importShared('vue');

const {createElementVNode:_createElementVNode,toDisplayString:_toDisplayString,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,createVNode:_createVNode,createStaticVNode:_createStaticVNode} = await importShared('vue');

const _hoisted_1 = { class: "space-y-4" };
const _hoisted_2 = { class: "rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900" };
const _hoisted_3 = { class: "flex flex-wrap items-start justify-between gap-3" };
const _hoisted_4 = ["disabled"];
const _hoisted_5 = { class: "mt-3 text-xs text-slate-500 dark:text-slate-400" };
const _hoisted_6 = {
  key: 0,
  class: "rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
};
const {computed,onMounted,ref} = await importShared('vue');
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "ReportPage",
  setup(__props) {
    function toNumber(value) {
      if (value == null) return 0;
      const num = typeof value === "number" ? value : Number(value);
      return Number.isFinite(num) ? num : 0;
    }
    function formatDateTime(value) {
      if (!value) return "-";
      const dt = new Date(value);
      if (Number.isNaN(dt.getTime())) return value;
      return dt.toLocaleString("ko-KR");
    }
    const loading = ref(false);
    const errorMessage = ref("");
    const summary = ref(null);
    const portfolioRows = ref([]);
    const liabilityRows = ref([]);
    const displayCurrency = computed(() => summary.value?.display_currency ?? "KRW");
    const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
    const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
    const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
    const investedPrincipalTotal = computed(() => toNumber(summary.value?.invested_principal_total));
    const principalMinusDebtTotal = computed(() => toNumber(summary.value?.principal_minus_debt_total));
    const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
    const netAssetsReturnPct = computed(() => toNumber(summary.value?.net_assets_return_pct ?? null));
    const principalProfitTotal = computed(
      () => toNumber(summary.value?.principal_profit_total ?? grossAssetsTotal.value - investedPrincipalTotal.value)
    );
    const netAssetsProfitTotal = computed(
      () => toNumber(summary.value?.net_assets_profit_total ?? netAssetsTotal.value - principalMinusDebtTotal.value)
    );
    const asOf = computed(() => formatDateTime(summary.value?.as_of));
    async function loadReportData() {
      loading.value = true;
      errorMessage.value = "";
      try {
        const [summaryOut, portfoliosOut, liabilitiesOut] = await Promise.all([
          getSummary(),
          getPortfoliosTable({
            page: 1,
            page_size: 200,
            sort_by: "gross_assets_total",
            sort_order: "desc",
            include_hidden: false,
            include_excluded: false
          }),
          getLiabilitiesTable({
            page: 1,
            page_size: 200,
            sort_by: "outstanding_balance",
            sort_order: "desc",
            include_hidden: false,
            include_excluded: false
          })
        ]);
        summary.value = summaryOut;
        portfolioRows.value = portfoliosOut.items;
        liabilityRows.value = liabilitiesOut.items;
      } catch (error) {
        const message = error instanceof Error ? error.message : "Unknown error";
        errorMessage.value = `Failed to load report data: ${message}`;
      } finally {
        loading.value = false;
      }
    }
    onMounted(loadReportData);
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("section", _hoisted_1, [
        _createElementVNode("header", _hoisted_2, [
          _createElementVNode("div", _hoisted_3, [
            _cache[0] || (_cache[0] = _createElementVNode("div", null, [
              _createElementVNode("p", { class: "text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300" }, "Report"),
              _createElementVNode("h1", { class: "mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100" }, "자산 분석 (기본)"),
              _createElementVNode("p", { class: "mt-1 text-sm text-slate-600 dark:text-slate-300" }, " Home과 동일한 기준으로 Gross/Net/부채 및 수익률을 요약 표시합니다. ")
            ], -1)),
            _createElementVNode("button", {
              type: "button",
              class: "rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
              disabled: loading.value,
              onClick: loadReportData
            }, _toDisplayString(loading.value ? "Loading..." : "Refresh"), 9, _hoisted_4)
          ]),
          _createElementVNode("p", _hoisted_5, "as_of: " + _toDisplayString(asOf.value), 1)
        ]),
        errorMessage.value ? (_openBlock(), _createElementBlock("article", _hoisted_6, _toDisplayString(errorMessage.value), 1)) : _createCommentVNode("", true),
        _createVNode(_sfc_main$1, {
          "display-currency": displayCurrency.value,
          "gross-assets-total": grossAssetsTotal.value,
          "liabilities-total": liabilitiesTotal.value,
          "net-assets-total": netAssetsTotal.value,
          "invested-principal-total": investedPrincipalTotal.value,
          "principal-minus-debt-total": principalMinusDebtTotal.value,
          "principal-return-pct": principalReturnPct.value,
          "net-assets-return-pct": netAssetsReturnPct.value,
          "principal-profit-total": principalProfitTotal.value,
          "net-assets-profit-total": netAssetsProfitTotal.value,
          portfolios: portfolioRows.value,
          liabilities: liabilityRows.value
        }, null, 8, ["display-currency", "gross-assets-total", "liabilities-total", "net-assets-total", "invested-principal-total", "principal-minus-debt-total", "principal-return-pct", "net-assets-return-pct", "principal-profit-total", "net-assets-profit-total", "portfolios", "liabilities"]),
        _cache[1] || (_cache[1] = _createStaticVNode('<div class="grid grid-cols-1 gap-4 xl:grid-cols-2"><article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">상승률 상위</h2><ul class="mt-3 space-y-2 text-sm"><li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"><span>NVDA</span><span class="font-semibold text-emerald-600">+3.82%</span></li><li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"><span>SCHD</span><span class="font-semibold text-emerald-600">+1.11%</span></li><li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"><span>삼성전자</span><span class="font-semibold text-emerald-600">+0.77%</span></li></ul></article><article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"><h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">하락률 상위</h2><ul class="mt-3 space-y-2 text-sm"><li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"><span>BTC</span><span class="font-semibold text-rose-600">-2.10%</span></li><li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"><span>하이닉스</span><span class="font-semibold text-rose-600">-1.43%</span></li><li class="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800"><span>QQQ</span><span class="font-semibold text-rose-600">-0.56%</span></li></ul></article></div>', 1))
      ]);
    };
  }
});

export { _sfc_main as default };
