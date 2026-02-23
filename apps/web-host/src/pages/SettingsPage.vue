<script setup lang="ts">
import { onMounted, ref } from "vue";
import { storeToRefs } from "pinia";

import { getMySettings, updateMySettings } from "../api/userSettings";
import { useNameClampStore } from "../stores/nameClamp";
import { useDisplayCurrencyStore } from "../stores/displayCurrency";

const nameClampStore = useNameClampStore();
const displayCurrencyStore = useDisplayCurrencyStore();
const { enabled: nameClampEnabled, mobileAllocationTopN } = storeToRefs(nameClampStore);
const { displayCurrency } = storeToRefs(displayCurrencyStore);
const topNOptions = [5, 6, 8, 10, 12] as const;

const loading = ref(false);
const saving = ref(false);
const message = ref("");
const error = ref("");

function setMessage(text: string): void {
  message.value = text;
  error.value = "";
}

function setError(text: string): void {
  error.value = text;
  message.value = "";
}

async function loadSettings(): Promise<void> {
  loading.value = true;
  try {
    await displayCurrencyStore.initialize();
    nameClampStore.initialize();
    const settings = await getMySettings();
    nameClampStore.setEnabled(Boolean(settings.name_clamp_enabled));
    nameClampStore.setMobileAllocationTopN(Number(settings.mobile_allocation_top_n ?? 6));
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load settings");
  } finally {
    loading.value = false;
  }
}

async function toggleNameClamp(next: boolean): Promise<void> {
  const prev = nameClampEnabled.value;
  nameClampStore.setEnabled(next);
  saving.value = true;
  try {
    await updateMySettings({ name_clamp_enabled: next });
    setMessage(`Name clamp ${next ? "enabled" : "disabled"}`);
  } catch (err) {
    nameClampStore.setEnabled(prev);
    setError(err instanceof Error ? err.message : "Failed to save name clamp setting");
  } finally {
    saving.value = false;
  }
}

async function updateMobileTopN(next: number): Promise<void> {
  const prev = mobileAllocationTopN.value;
  nameClampStore.setMobileAllocationTopN(next);
  saving.value = true;
  try {
    await updateMySettings({ mobile_allocation_top_n: next });
    setMessage(`Mobile donut Top N set to ${next}`);
  } catch (err) {
    nameClampStore.setMobileAllocationTopN(prev);
    setError(err instanceof Error ? err.message : "Failed to save mobile donut Top N");
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  void loadSettings();
});
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-100">User Settings</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        개인 화면 표시 옵션을 설정합니다.
      </p>
    </header>

    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Display Options</h2>
      <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <p class="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Display Currency</p>
          <p class="mt-2 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ displayCurrency }}</p>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Top Bar KRW/USD 토글에서 변경됩니다.</p>
        </div>

        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <p class="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Name Clamp</p>
          <div class="mt-2 flex items-center justify-between gap-3">
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {{ nameClampEnabled ? "ON" : "OFF" }}
            </p>
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
              :disabled="loading || saving"
              @click="toggleNameClamp(!nameClampEnabled)"
            >
              {{ saving ? "Saving..." : nameClampEnabled ? "Turn OFF" : "Turn ON" }}
            </button>
          </div>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            긴 포트폴리오/종목명을 2줄로 제한할지 선택합니다.
          </p>
        </div>

        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <p class="text-xs uppercase tracking-[0.14em] text-slate-500 dark:text-slate-400">Mobile Donut Top N</p>
          <div class="mt-2 flex items-center justify-between gap-3">
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
              Top {{ mobileAllocationTopN }}
            </p>
            <select
              class="rounded-lg border border-slate-300 bg-white px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800"
              :disabled="loading || saving"
              :value="mobileAllocationTopN"
              @change="updateMobileTopN(Number(($event.target as HTMLSelectElement).value))"
            >
              <option v-for="n in topNOptions" :key="`mobile-top-n-${n}`" :value="n">
                {{ n }}
              </option>
            </select>
          </div>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            모바일 Donut 범례에서 Top N만 표시하고 나머지는 Others로 합칩니다. (최대 12)
          </p>
        </div>
      </div>

      <p v-if="loading" class="mt-4 text-xs text-slate-500 dark:text-slate-400">Loading settings...</p>
      <p v-else-if="error" class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
        {{ error }}
      </p>
      <p v-else-if="message" class="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
        {{ message }}
      </p>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Household Management (Planned)</h2>
      <ul class="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-600 dark:text-slate-300">
        <li>구성원 추가</li>
        <li>대표(OWNER) 권한 지정/변경</li>
        <li>대표 권한 사용자만 수정 가능</li>
      </ul>
    </article>
  </section>
</template>
