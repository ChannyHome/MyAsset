import { computed, ref } from "vue";

import { getMySettings, updateMySettings, type DisplayCurrency } from "../api/userSettings";

const STORAGE_KEY = "myasset.display_currency.v1";

const _displayCurrency = ref<DisplayCurrency>("KRW");
const _ready = ref(false);
const _loading = ref(false);
const _saving = ref(false);
const _error = ref("");

let _initPromise: Promise<void> | null = null;

function normalizeCurrency(value: string | null | undefined): DisplayCurrency {
  return String(value || "").toUpperCase() === "USD" ? "USD" : "KRW";
}

function readCachedCurrency(): DisplayCurrency {
  if (typeof window === "undefined") {
    return "KRW";
  }
  return normalizeCurrency(window.localStorage.getItem(STORAGE_KEY));
}

function writeCachedCurrency(value: DisplayCurrency): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, value);
}

export function useDisplayCurrency() {
  async function ensureInitialized(): Promise<void> {
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

  async function setDisplayCurrency(value: DisplayCurrency): Promise<void> {
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
    setDisplayCurrency,
  };
}
