import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http } from './http-nYGPWehe.js';

async function updateQuotesNow() {
  const { data } = await http.post("/quotes/update-now");
  return data;
}
async function getQuoteUpdateJobStatus(jobId) {
  const { data } = await http.get(`/quotes/update-jobs/${jobId}`);
  return data;
}
async function testQuoteForAsset(assetId) {
  const { data } = await http.post(`/quotes/test/${assetId}`);
  return data;
}
async function upsertManualQuote(payload) {
  const { data } = await http.post("/quotes/manual", payload);
  return data;
}
async function getLatestUsdKrwFxRate() {
  const { data } = await http.get("/quotes/fx/usd-krw/latest");
  return data;
}

async function getFxStaleMinutes() {
  const { data } = await http.get("/settings/fx-stale-minutes");
  return data;
}

async function getMySettings() {
  const { data } = await http.get("/users/me/settings");
  return data;
}
async function updateMySettings(payload) {
  const { data } = await http.patch("/users/me/settings", payload);
  return data;
}

const {defineComponent:_defineComponent} = await importShared('vue');

const {normalizeClass:_normalizeClass,createElementVNode:_createElementVNode,openBlock:_openBlock,createElementBlock:_createElementBlock,createCommentVNode:_createCommentVNode,toDisplayString:_toDisplayString,createTextVNode:_createTextVNode,Fragment:_Fragment} = await importShared('vue');

const _hoisted_1 = { class: "inline-flex flex-col items-start gap-1" };
const _hoisted_2 = { class: "inline-flex items-center gap-1 rounded-xl border border-slate-300 p-1 dark:border-slate-700" };
const _hoisted_3 = ["disabled"];
const _hoisted_4 = ["disabled"];
const _hoisted_5 = {
  key: 0,
  class: "pl-1 text-[11px] text-slate-500 dark:text-slate-400"
};
const _hoisted_6 = { class: "text-[11px] text-slate-500 dark:text-slate-400" };
const _hoisted_7 = {
  key: 0,
  class: "ml-1 inline-flex rounded-md border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
};
const {computed: computed$1,onBeforeUnmount,onMounted,ref: ref$1} = await importShared('vue');
const _sfc_main = /* @__PURE__ */ _defineComponent({
  __name: "DisplayCurrencyToggle",
  props: {
    modelValue: {},
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
  },
  emits: ["update:modelValue"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const emit = __emit;
    function selectCurrency(value) {
      if (props.disabled || props.modelValue === value) return;
      emit("update:modelValue", value);
    }
    const fxRate = ref$1(null);
    const fxError = ref$1("");
    const nowTs = ref$1(Date.now());
    const staleMinutes = ref$1(30);
    const staleThresholdMs = computed$1(() => staleMinutes.value * 60 * 1e3);
    let staleTimer = null;
    function formatAsOf(value) {
      if (!value) return "-";
      const dt = new Date(value);
      if (Number.isNaN(dt.getTime())) return value;
      return dt.toLocaleString("ko-KR");
    }
    function formatRate(value) {
      if (value == null) return "-";
      const num = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(num)) return String(value);
      return new Intl.NumberFormat("ko-KR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
      }).format(num);
    }
    async function loadFxRate() {
      fxError.value = "";
      try {
        fxRate.value = await getLatestUsdKrwFxRate();
      } catch (error) {
        fxRate.value = null;
        fxError.value = error instanceof Error ? error.message : "Failed to load FX";
      }
    }
    async function loadStaleMinutes() {
      try {
        const out = await getFxStaleMinutes();
        if (Number.isFinite(out.minutes) && out.minutes > 0) {
          staleMinutes.value = out.minutes;
        }
      } catch {
      }
    }
    const fxIsStale = computed$1(() => {
      if (!fxRate.value?.as_of) return false;
      const asOfTs = new Date(fxRate.value.as_of).getTime();
      if (!Number.isFinite(asOfTs)) return false;
      return nowTs.value - asOfTs > staleThresholdMs.value;
    });
    onMounted(() => {
      void loadFxRate();
      void loadStaleMinutes();
      staleTimer = setInterval(() => {
        nowTs.value = Date.now();
      }, 6e4);
    });
    onBeforeUnmount(() => {
      if (staleTimer) {
        clearInterval(staleTimer);
        staleTimer = null;
      }
    });
    return (_ctx, _cache) => {
      return _openBlock(), _createElementBlock("div", _hoisted_1, [
        _createElementVNode("div", _hoisted_2, [
          _createElementVNode("button", {
            type: "button",
            class: _normalizeClass([
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              __props.modelValue === "KRW" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            ]),
            disabled: __props.disabled,
            onClick: _cache[0] || (_cache[0] = ($event) => selectCurrency("KRW"))
          }, " KRW ", 10, _hoisted_3),
          _createElementVNode("button", {
            type: "button",
            class: _normalizeClass([
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              __props.modelValue === "USD" ? "bg-emerald-600 text-white" : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            ]),
            disabled: __props.disabled,
            onClick: _cache[1] || (_cache[1] = ($event) => selectCurrency("USD"))
          }, " USD ", 10, _hoisted_4),
          __props.loading ? (_openBlock(), _createElementBlock("span", _hoisted_5, "Saving...")) : _createCommentVNode("", true)
        ]),
        _createElementVNode("p", _hoisted_6, [
          fxRate.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 0 }, [
            _createTextVNode(" as_of: " + _toDisplayString(formatAsOf(fxRate.value.as_of)) + " · USD/KRW: " + _toDisplayString(formatRate(fxRate.value.rate)) + " ", 1),
            fxIsStale.value ? (_openBlock(), _createElementBlock("span", _hoisted_7, " stale " + _toDisplayString(staleMinutes.value) + "m ", 1)) : _createCommentVNode("", true)
          ], 64)) : fxError.value ? (_openBlock(), _createElementBlock(_Fragment, { key: 1 }, [
            _createTextVNode(" FX info unavailable ")
          ], 64)) : (_openBlock(), _createElementBlock(_Fragment, { key: 2 }, [
            _createTextVNode(" as_of: - ")
          ], 64))
        ])
      ]);
    };
  }
});

async function getLiabilities(params = {}) {
  const { data } = await http.get("/liabilities", { params });
  return data;
}
async function getLiabilitiesTable(params = {}) {
  const { data } = await http.get("/liabilities/table", { params });
  return data;
}
async function createLiability(payload) {
  const { data } = await http.post("/liabilities", payload);
  return data;
}
async function updateLiability(liabilityId, payload) {
  const { data } = await http.patch(`/liabilities/${liabilityId}`, payload);
  return data;
}
async function deleteLiability(liabilityId) {
  await http.delete(`/liabilities/${liabilityId}`);
}

async function getPortfolios() {
  const { data } = await http.get("/portfolios");
  return data;
}
async function getPortfoliosTable(params = {}) {
  const { data } = await http.get("/portfolios/table", { params });
  return data;
}
async function createPortfolio(payload) {
  const { data } = await http.post("/portfolios", payload);
  return data;
}
async function updatePortfolio(portfolioId, payload) {
  const { data } = await http.patch(`/portfolios/${portfolioId}`, payload);
  return data;
}
async function deletePortfolio(portfolioId) {
  await http.delete(`/portfolios/${portfolioId}`);
}

const {computed,ref} = await importShared('vue');
const STORAGE_KEY = "myasset.display_currency.v1";
const _displayCurrency = ref("KRW");
const _ready = ref(false);
const _loading = ref(false);
const _saving = ref(false);
const _error = ref("");
let _initPromise = null;
function normalizeCurrency(value) {
  return String(value || "").toUpperCase() === "USD" ? "USD" : "KRW";
}
function readCachedCurrency() {
  if (typeof window === "undefined") {
    return "KRW";
  }
  return normalizeCurrency(window.localStorage.getItem(STORAGE_KEY));
}
function writeCachedCurrency(value) {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, value);
}
function useDisplayCurrency() {
  async function ensureInitialized() {
    if (_ready.value) {
      return;
    }
    if (_initPromise) {
      return _initPromise;
    }
    _initPromise = (async () => {
      _displayCurrency.value = readCachedCurrency();
      _loading.value = true;
      _error.value = "";
      try {
        const settings = await getMySettings();
        const value = normalizeCurrency(settings.display_currency);
        _displayCurrency.value = value;
        writeCachedCurrency(value);
      } catch (error) {
        _error.value = error instanceof Error ? error.message : "Failed to load user settings";
      } finally {
        _loading.value = false;
        _ready.value = true;
      }
    })();
    try {
      await _initPromise;
    } finally {
      _initPromise = null;
    }
  }
  async function setDisplayCurrency(value) {
    const next = normalizeCurrency(value);
    if (_displayCurrency.value === next) {
      return;
    }
    const prev = _displayCurrency.value;
    _displayCurrency.value = next;
    writeCachedCurrency(next);
    _saving.value = true;
    _error.value = "";
    try {
      await updateMySettings({ display_currency: next });
    } catch (error) {
      _displayCurrency.value = prev;
      writeCachedCurrency(prev);
      _error.value = error instanceof Error ? error.message : "Failed to save user settings";
      throw error;
    } finally {
      _saving.value = false;
    }
  }
  return {
    displayCurrency: computed(() => _displayCurrency.value),
    settingsReady: computed(() => _ready.value),
    settingsLoading: computed(() => _loading.value),
    settingsSaving: computed(() => _saving.value),
    settingsError: computed(() => _error.value),
    ensureInitialized,
    setDisplayCurrency
  };
}

export { _sfc_main as _, getPortfoliosTable as a, getLiabilities as b, getPortfolios as c, createPortfolio as d, updatePortfolio as e, createLiability as f, getLiabilitiesTable as g, updateLiability as h, getLatestUsdKrwFxRate as i, getFxStaleMinutes as j, updateQuotesNow as k, upsertManualQuote as l, deletePortfolio as m, deleteLiability as n, getQuoteUpdateJobStatus as o, testQuoteForAsset as t, useDisplayCurrency as u };
