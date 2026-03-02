import { h as http } from './datetime-D3NoeBy6.js';
import { importShared } from './__federation_fn_import-B1auV5c8.js';

async function getSummary(params = {}) {
  const { data } = await http.get("/analytics/summary", { params });
  return data;
}
async function getAllocation(params = {}) {
  const { data } = await http.get("/analytics/allocation", { params });
  return data;
}
async function getNetworthSeries(params = {}) {
  const { data } = await http.get("/analytics/networth-series", { params });
  return data;
}
async function collectSnapshots(params = {}) {
  const { data } = await http.post("/analytics/snapshots/collect", null, { params });
  return data;
}

const {defineStore} = await importShared('pinia');

const {ref,watch} = await importShared('vue');

const NAME_CLAMP_STORAGE_KEY = "myasset:ui:name-clamp";
const NAME_CLAMP_EVENT = "myasset:ui:name-clamp-changed";
const MOBILE_DONUT_TOPN_STORAGE_KEY = "myasset:ui:mobile-donut-topn";
const MOBILE_DONUT_TOPN_EVENT = "myasset:ui:mobile-donut-topn-changed";
function normalizeMobileTopN(value) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 6;
  if (parsed < 3) return 3;
  if (parsed > 12) return 12;
  return Math.trunc(parsed);
}
const useUiStore = defineStore("asset-ui", () => {
  const nameClampEnabled = ref(true);
  const mobileAllocationTopN = ref(6);
  const initialized = ref(false);
  let listenersAttached = false;
  function readStoredClamp() {
    if (typeof window === "undefined") return true;
    return window.localStorage.getItem(NAME_CLAMP_STORAGE_KEY) !== "0";
  }
  function writeStoredClamp(value) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(NAME_CLAMP_STORAGE_KEY, value ? "1" : "0");
  }
  function readStoredTopN() {
    if (typeof window === "undefined") return 6;
    return normalizeMobileTopN(window.localStorage.getItem(MOBILE_DONUT_TOPN_STORAGE_KEY));
  }
  function writeStoredTopN(value) {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(MOBILE_DONUT_TOPN_STORAGE_KEY, String(normalizeMobileTopN(value)));
  }
  function broadcastClamp(value) {
    if (typeof window === "undefined") return;
    window.dispatchEvent(
      new CustomEvent(NAME_CLAMP_EVENT, {
        detail: { enabled: value }
      })
    );
  }
  function broadcastTopN(value) {
    if (typeof window === "undefined") return;
    const normalized = normalizeMobileTopN(value);
    window.dispatchEvent(
      new CustomEvent(MOBILE_DONUT_TOPN_EVENT, {
        detail: { value: normalized }
      })
    );
  }
  function onStorage(event) {
    if (event.key === NAME_CLAMP_STORAGE_KEY) {
      const next = event.newValue !== "0";
      if (nameClampEnabled.value !== next) {
        nameClampEnabled.value = next;
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
  function onBroadcast(event) {
    const custom = event;
    const next = custom.detail?.enabled ?? readStoredClamp();
    if (nameClampEnabled.value !== next) {
      nameClampEnabled.value = next;
      writeStoredClamp(next);
    }
  }
  function onBroadcastTopN(event) {
    const custom = event;
    const next = normalizeMobileTopN(custom.detail?.value ?? readStoredTopN());
    if (mobileAllocationTopN.value !== next) {
      mobileAllocationTopN.value = next;
      writeStoredTopN(next);
    }
  }
  function attachListeners() {
    if (typeof window === "undefined" || listenersAttached) return;
    window.addEventListener("storage", onStorage);
    window.addEventListener(NAME_CLAMP_EVENT, onBroadcast);
    window.addEventListener(MOBILE_DONUT_TOPN_EVENT, onBroadcastTopN);
    listenersAttached = true;
  }
  function init() {
    if (initialized.value) return;
    attachListeners();
    nameClampEnabled.value = readStoredClamp();
    mobileAllocationTopN.value = readStoredTopN();
    initialized.value = true;
  }
  function setNameClampEnabled(value) {
    nameClampEnabled.value = value;
    if (!initialized.value) return;
    writeStoredClamp(value);
    broadcastClamp(value);
  }
  function toggleNameClamp() {
    setNameClampEnabled(!nameClampEnabled.value);
  }
  function setMobileAllocationTopN(value) {
    const normalized = normalizeMobileTopN(value);
    mobileAllocationTopN.value = normalized;
    if (!initialized.value) return;
    writeStoredTopN(normalized);
    broadcastTopN(normalized);
  }
  watch(nameClampEnabled, (next) => {
    if (!initialized.value) return;
    writeStoredClamp(next);
  });
  watch(mobileAllocationTopN, (next) => {
    if (!initialized.value) return;
    writeStoredTopN(next);
  });
  return {
    nameClampEnabled,
    mobileAllocationTopN,
    init,
    setNameClampEnabled,
    toggleNameClamp,
    setMobileAllocationTopN
  };
});

export { getNetworthSeries as a, getAllocation as b, collectSnapshots as c, getSummary as g, useUiStore as u };
