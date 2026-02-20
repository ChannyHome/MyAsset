import { importShared } from './__federation_fn_import-B1auV5c8.js';
import { h as http } from './datetime-BbzyLRcb.js';

async function getMySettings() {
  const { data } = await http.get("/users/me/settings");
  return data;
}
async function updateMySettings(payload) {
  const { data } = await http.patch("/users/me/settings", payload);
  return data;
}

const {computed,ref} = await importShared('vue');
const STORAGE_KEY = "myasset.display_currency.v1";
const DISPLAY_CURRENCY_EVENT = "myasset:display-currency-changed";
const _displayCurrency = ref("KRW");
const _ready = ref(false);
const _loading = ref(false);
const _saving = ref(false);
const _error = ref("");
let _listenersAttached = false;
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
function broadcastCurrency(value) {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(
    new CustomEvent(DISPLAY_CURRENCY_EVENT, {
      detail: { value }
    })
  );
}
function setLocalCurrency(value) {
  if (_displayCurrency.value === value) {
    return;
  }
  _displayCurrency.value = value;
  writeCachedCurrency(value);
}
function onStorage(event) {
  if (event.key !== STORAGE_KEY) {
    return;
  }
  const next = normalizeCurrency(event.newValue);
  setLocalCurrency(next);
}
function onCurrencyBroadcast(event) {
  const custom = event;
  const next = normalizeCurrency(custom.detail?.value ?? readCachedCurrency());
  setLocalCurrency(next);
}
function attachListeners() {
  if (typeof window === "undefined" || _listenersAttached) {
    return;
  }
  window.addEventListener("storage", onStorage);
  window.addEventListener(DISPLAY_CURRENCY_EVENT, onCurrencyBroadcast);
  _listenersAttached = true;
}
function useDisplayCurrency() {
  attachListeners();
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
        setLocalCurrency(value);
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
    setLocalCurrency(next);
    broadcastCurrency(next);
    _saving.value = true;
    _error.value = "";
    try {
      await updateMySettings({ display_currency: next });
    } catch (error) {
      setLocalCurrency(prev);
      broadcastCurrency(prev);
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

export { useDisplayCurrency as u };
