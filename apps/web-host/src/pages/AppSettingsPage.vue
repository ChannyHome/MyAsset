<script setup lang="ts">
import { onMounted, ref } from "vue";

import { getTokenRefreshEnabled, updateTokenRefreshEnabled } from "../api/settings";

const loading = ref(false);
const saving = ref(false);
const tokenRefreshEnabled = ref(true);
const source = ref("env");
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

async function loadAppSettings(): Promise<void> {
  loading.value = true;
  try {
    const out = await getTokenRefreshEnabled();
    tokenRefreshEnabled.value = Boolean(out.enabled);
    source.value = out.source;
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load app settings");
  } finally {
    loading.value = false;
  }
}

async function applyTokenRefresh(next: boolean): Promise<void> {
  const prev = tokenRefreshEnabled.value;
  tokenRefreshEnabled.value = next;
  saving.value = true;
  try {
    const out = await updateTokenRefreshEnabled(next);
    tokenRefreshEnabled.value = Boolean(out.enabled);
    source.value = out.source;
    setMessage(`Token refresh ${out.enabled ? "enabled" : "disabled"}`);
  } catch (err) {
    tokenRefreshEnabled.value = prev;
    setError(err instanceof Error ? err.message : "Failed to update token refresh setting");
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  void loadAppSettings();
});
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h1 class="text-xl font-semibold text-slate-900 dark:text-slate-100">App Settings</h1>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
        Admin 전용 시스템 설정입니다.
      </p>
    </header>

    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Token Refresh</h2>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Access Token 만료 시 Refresh Token으로 자동 갱신할지 설정합니다.
      </p>

      <div class="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <div class="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">
              {{ tokenRefreshEnabled ? "ON" : "OFF" }}
            </p>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
              source: {{ source }}
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
            :disabled="loading || saving"
            @click="applyTokenRefresh(!tokenRefreshEnabled)"
          >
            {{ saving ? "Saving..." : tokenRefreshEnabled ? "Turn OFF" : "Turn ON" }}
          </button>
        </div>
      </div>

      <p v-if="loading" class="mt-4 text-xs text-slate-500 dark:text-slate-400">Loading app settings...</p>
      <p v-else-if="error" class="mt-4 rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
        {{ error }}
      </p>
      <p v-else-if="message" class="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
        {{ message }}
      </p>
    </article>
  </section>
</template>

