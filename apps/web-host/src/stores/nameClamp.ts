import { defineStore } from "pinia";
import { ref } from "vue";

const NAME_CLAMP_STORAGE_KEY = "myasset:ui:name-clamp";
const NAME_CLAMP_EVENT = "myasset:ui:name-clamp-changed";

export const useNameClampStore = defineStore("name-clamp", () => {
  const enabled = ref(true);
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

  function broadcast(value: boolean): void {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent<{ enabled: boolean }>(NAME_CLAMP_EVENT, {
        detail: { enabled: value },
      }),
    );
  }

  function onStorage(event: StorageEvent): void {
    if (event.key !== NAME_CLAMP_STORAGE_KEY) return;
    const next = event.newValue !== "0";
    if (enabled.value !== next) {
      enabled.value = next;
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

  function attachListeners(): void {
    if (typeof window === "undefined" || listenersAttached) return;
    window.addEventListener("storage", onStorage);
    window.addEventListener(NAME_CLAMP_EVENT, onBroadcast as EventListener);
    listenersAttached = true;
  }

  function initialize(): void {
    if (initialized.value) return;
    attachListeners();
    enabled.value = readStored();
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

  return {
    enabled,
    initialize,
    setEnabled,
    toggle,
  };
});
