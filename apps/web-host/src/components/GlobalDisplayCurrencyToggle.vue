<script setup lang="ts">
import { storeToRefs } from "pinia";

import type { DisplayCurrency } from "../api/userSettings";
import { useDisplayCurrencyStore } from "../stores/displayCurrency";

const currencyStore = useDisplayCurrencyStore();
const { displayCurrency, saving } = storeToRefs(currencyStore);

function selectCurrency(value: DisplayCurrency): void {
  if (saving.value || displayCurrency.value === value) {
    return;
  }
  void currencyStore.setDisplayCurrency(value);
}
</script>

<template>
  <div class="inline-flex items-center gap-1 rounded-lg border border-slate-300 p-1 dark:border-slate-700">
    <button
      type="button"
      class="rounded-md px-2 py-1 text-xs font-semibold transition-colors"
      :class="
        displayCurrency === 'KRW'
          ? 'bg-emerald-600 text-white'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      "
      :disabled="saving"
      @click="selectCurrency('KRW')"
    >
      KRW
    </button>
    <button
      type="button"
      class="rounded-md px-2 py-1 text-xs font-semibold transition-colors"
      :class="
        displayCurrency === 'USD'
          ? 'bg-emerald-600 text-white'
          : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
      "
      :disabled="saving"
      @click="selectCurrency('USD')"
    >
      USD
    </button>
  </div>
</template>
