<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";

import { getLatestUsdKrwFxRate, type FxRateLatestOut } from "../api/quotes";
import { getFxStaleMinutes } from "../api/settings";
import { type DisplayCurrency } from "../api/userSettings";

const props = withDefaults(
  defineProps<{
    modelValue: DisplayCurrency;
    disabled?: boolean;
    loading?: boolean;
  }>(),
  {
    disabled: false,
    loading: false,
  },
);

const emit = defineEmits<{
  (event: "update:modelValue", value: DisplayCurrency): void;
}>();

function selectCurrency(value: DisplayCurrency): void {
  if (props.disabled || props.modelValue === value) return;
  emit("update:modelValue", value);
}

const fxRate = ref<FxRateLatestOut | null>(null);
const fxError = ref("");
const nowTs = ref(Date.now());
const staleMinutes = ref(30);
const staleThresholdMs = computed(() => staleMinutes.value * 60 * 1000);
let staleTimer: ReturnType<typeof setInterval> | null = null;

function formatAsOf(value: string | null | undefined): string {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString("ko-KR");
}

function formatRate(value: string | number | null | undefined): string {
  if (value == null) return "-";
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) return String(value);
  return new Intl.NumberFormat("ko-KR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(num);
}

async function loadFxRate(): Promise<void> {
  fxError.value = "";
  try {
    fxRate.value = await getLatestUsdKrwFxRate();
  } catch (error) {
    fxRate.value = null;
    fxError.value = error instanceof Error ? error.message : "Failed to load FX";
  }
}

async function loadStaleMinutes(): Promise<void> {
  try {
    const out = await getFxStaleMinutes();
    if (Number.isFinite(out.minutes) && out.minutes > 0) {
      staleMinutes.value = out.minutes;
    }
  } catch {
    // Keep local default when API is unavailable.
  }
}

const fxIsStale = computed(() => {
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
  }, 60_000);
});

onBeforeUnmount(() => {
  if (staleTimer) {
    clearInterval(staleTimer);
    staleTimer = null;
  }
});
</script>

<template>
  <div class="inline-flex flex-col items-start gap-1">
    <div class="inline-flex items-center gap-1 rounded-xl border border-slate-300 p-1 dark:border-slate-700">
      <button
        type="button"
        class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
        :class="
          modelValue === 'KRW'
            ? 'bg-emerald-600 text-white'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        "
        :disabled="disabled"
        @click="selectCurrency('KRW')"
      >
        KRW
      </button>
      <button
        type="button"
        class="rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors"
        :class="
          modelValue === 'USD'
            ? 'bg-emerald-600 text-white'
            : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
        "
        :disabled="disabled"
        @click="selectCurrency('USD')"
      >
        USD
      </button>
      <span v-if="loading" class="pl-1 text-[11px] text-slate-500 dark:text-slate-400">Saving...</span>
    </div>

    <p class="text-[11px] text-slate-500 dark:text-slate-400">
      <template v-if="fxRate">
        as_of: {{ formatAsOf(fxRate.as_of) }} · USD/KRW: {{ formatRate(fxRate.rate) }}
        <span
          v-if="fxIsStale"
          class="ml-1 inline-flex rounded-md border border-amber-300 bg-amber-50 px-1.5 py-0.5 text-[10px] font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
        >
          stale {{ staleMinutes }}m
        </span>
      </template>
      <template v-else-if="fxError">
        FX info unavailable
      </template>
      <template v-else>
        as_of: -
      </template>
    </p>
  </div>
</template>
