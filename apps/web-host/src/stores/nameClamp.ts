import { defineStore } from "pinia";
import { ref } from "vue";

const NAME_CLAMP_STORAGE_KEY = "myasset:ui:name-clamp";
const NAME_CLAMP_EVENT = "myasset:ui:name-clamp-changed";
const MOBILE_DONUT_TOPN_STORAGE_KEY = "myasset:ui:mobile-donut-topn";
const MOBILE_DONUT_TOPN_EVENT = "myasset:ui:mobile-donut-topn-changed";

function normalizeMobileTopN(value: unknown): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 6;
  if (parsed < 3) return 3;
  if (parsed > 12) return 12;
  return Math.trunc(parsed);
}

export const useNameClampStore = defineStore("name-clamp", () => {
  const enabled = ref(true);
  const mobileAllocationTopN = ref(6);
  const initialized = ref(false);
  let listenersAttached = false;

  function readStored(): boolean {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(NAME_CLAMP_STORAGE_KEY) !== "0";
  }

  function writeStored(value: boolean): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(NAME_CLAMP_STORAGE_KEY, value ? "1" : "0");
  }

  function readStoredTopN(): number {
    if (typeof window === "undefined") return 6;
    return normalizeMobileTopN(window.localStorage.getItem(MOBILE_DONUT_TOPN_STORAGE_KEY));
  }

  function writeStoredTopN(value: number): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MOBILE_DONUT_TOPN_STORAGE_KEY, String(normalizeMobileTopN(value)));
  }

  function broadcast(value: boolean): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent<{ enabled: boolean }>(NAME_CLAMP_EVENT, {
        detail: { enabled: value },
      }),
    );
  }

  function broadcastTopN(value: number): void {
    if (typeof window === "undefined") return;
    const normalized = normalizeMobileTopN(value);
    window.dispatchEvent(
      new CustomEvent<{ value: number }>(MOBILE_DONUT_TOPN_EVENT, {
        detail: { value: normalized },
      }),
    );
  }

  function onStorage(event: StorageEvent): void {
    if (event.key === NAME_CLAMP_STORAGE_KEY) {
      const next = event.newValue !== "0";
      if (enabled.value !== next) {
        enabled.value = next;
      }
      return;
    }
    if (event.key === MOBILE_DONUT_TOPN_STORAGE_KEY) {
      const next = normalizeMobileTopN(event.newValue);
      if (mobileAllocationTopN.value !== next) {
        mobileAllocationTopN.value = next;
      }
    }
  }

  function onBroadcast(event: Event): void {
    const custom = event as CustomEvent<{ enabled?: boolean }>;
    const next = custom.detail?.enabled ?? readStored();
    if (enabled.value !== next) {
      enabled.value = next;
      writeStored(next);
    }
  }

  function onBroadcastTopN(event: Event): void {
    const custom = event as CustomEvent<{ value?: number }>;
    const next = normalizeMobileTopN(custom.detail?.value ?? readStoredTopN());
    if (mobileAllocationTopN.value !== next) {
      mobileAllocationTopN.value = next;
      writeStoredTopN(next);
    }
  }

  function attachListeners(): void {
    if (typeof window === "undefined" || listenersAttached) return;
    window.addEventListener("storage", onStorage);
    window.addEventListener(NAME_CLAMP_EVENT, onBroadcast as EventListener);
    window.addEventListener(MOBILE_DONUT_TOPN_EVENT, onBroadcastTopN as EventListener);
    listenersAttached = true;
  }

  function initialize(): void {
    if (initialized.value) return;
    attachListeners();
    enabled.value = readStored();
    mobileAllocationTopN.value = readStoredTopN();
    initialized.value = true;
  }

  function setEnabled(value: boolean): void {
    enabled.value = value;
    writeStored(value);
    broadcast(value);
  }

  function toggle(): void {
    setEnabled(!enabled.value);
  }

  function setMobileAllocationTopN(value: number): void {
    const normalized = normalizeMobileTopN(value);
    mobileAllocationTopN.value = normalized;
    writeStoredTopN(normalized);
    broadcastTopN(normalized);
  }

  return {
    enabled,
    mobileAllocationTopN,
    initialize,
    setEnabled,
    toggle,
    setMobileAllocationTopN,
  };
});
