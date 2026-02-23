import { defineStore } from "pinia";
import { ref } from "vue";

import { getMySettings, updateMySettings, type DisplayCurrency } from "../api/userSettings";

const STORAGE_KEY = "myasset.display_currency.v1";
const DISPLAY_CURRENCY_EVENT = "myasset:display-currency-changed";

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

export const useDisplayCurrencyStore = defineStore("display-currency", () => {
  const displayCurrency = ref<DisplayCurrency>("KRW");
  const initialized = ref(false);
  const loading = ref(false);
  const saving = ref(false);
  const error = ref("");
  let listenersAttached = false;

  function setLocal(value: DisplayCurrency): void {
    displayCurrency.value = value;
    writeCachedCurrency(value);
  }

  function broadcast(value: DisplayCurrency): void {
    if (typeof window === "undefined") {
      return;
    }
    window.dispatchEvent(
      new CustomEvent<{ value: DisplayCurrency }>(DISPLAY_CURRENCY_EVENT, {
        detail: { value },
      }),
    );
  }

  function onStorage(event: StorageEvent): void {
    if (event.key !== STORAGE_KEY) {
      return;
    }
    const next = normalizeCurrency(event.newValue);
    if (displayCurrency.value !== next) {
      displayCurrency.value = next;
    }
  }

  function onBroadcast(event: Event): void {
    const custom = event as CustomEvent<{ value?: string }>;
    const next = normalizeCurrency(custom.detail?.value ?? readCachedCurrency());
    if (displayCurrency.value !== next) {
      displayCurrency.value = next;
      writeCachedCurrency(next);
    }
  }

  function attachListeners(): void {
    if (typeof window === "undefined" || listenersAttached) {
      return;
    }
    window.addEventListener("storage", onStorage);
    window.addEventListener(DISPLAY_CURRENCY_EVENT, onBroadcast as EventListener);
    listenersAttached = true;
  }

  async function initialize(): Promise<void> {
    if (initialized.value) {
      return;
    }
    attachListeners();
    setLocal(readCachedCurrency());
    loading.value = true;
    error.value = "";
    try {
      const settings = await getMySettings();
      const next = normalizeCurrency(settings.display_currency);
      setLocal(next);
      broadcast(next);
    } catch (err) {
      error.value = err instanceof Error ? err.message : "Failed to load display currency";
    } finally {
      loading.value = false;
      initialized.value = true;
    }
  }

  async function setDisplayCurrency(value: DisplayCurrency): Promise<void> {
    const next = normalizeCurrency(value);
    if (displayCurrency.value === next) {
      return;
    }
    const prev = displayCurrency.value;
    setLocal(next);
    broadcast(next);
    saving.value = true;
    error.value = "";
    try {
      await updateMySettings({ display_currency: next });
    } catch (err) {
      setLocal(prev);
      broadcast(prev);
      error.value = err instanceof Error ? err.message : "Failed to save display currency";
      throw err;
    } finally {
      saving.value = false;
    }
  }

  return {
    displayCurrency,
    initialized,
    loading,
    saving,
    error,
    initialize,
    setDisplayCurrency,
  };
});
