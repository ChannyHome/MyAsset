import { defineStore } from "pinia";
import { ref, watch } from "vue";

const NAME_CLAMP_STORAGE_KEY = "myasset:ui:name-clamp";
const NAME_CLAMP_EVENT = "myasset:ui:name-clamp-changed";

export const useUiStore = defineStore("asset-ui", () => {
  const nameClampEnabled = ref(true);
  const initialized = ref(false);
  let listenersAttached = false;

  function readStoredClamp(): boolean {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(NAME_CLAMP_STORAGE_KEY) !== "0";
  }

  function writeStoredClamp(value: boolean): void {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(NAME_CLAMP_STORAGE_KEY, value ? "1" : "0");
  }

  function broadcastClamp(value: boolean): void {
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
    if (nameClampEnabled.value !== next) {
      nameClampEnabled.value = next;
    }
  }

  function onBroadcast(event: Event): void {
    const custom = event as CustomEvent<{ enabled?: boolean }>;
    const next = custom.detail?.enabled ?? readStoredClamp();
    if (nameClampEnabled.value !== next) {
      nameClampEnabled.value = next;
      writeStoredClamp(next);
    }
  }

  function attachListeners(): void {
    if (typeof window === "undefined" || listenersAttached) return;
    window.addEventListener("storage", onStorage);
    window.addEventListener(NAME_CLAMP_EVENT, onBroadcast as EventListener);
    listenersAttached = true;
  }

  function init(): void {
    if (initialized.value) return;
    attachListeners();
    nameClampEnabled.value = readStoredClamp();
    initialized.value = true;
  }

  function setNameClampEnabled(value: boolean): void {
    nameClampEnabled.value = value;
    if (!initialized.value) return;
    writeStoredClamp(value);
    broadcastClamp(value);
  }

  function toggleNameClamp(): void {
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
    toggleNameClamp,
  };
});
