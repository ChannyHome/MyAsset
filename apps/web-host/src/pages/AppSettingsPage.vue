<script setup lang="ts">
import { onMounted, ref } from "vue";

import {
  getFinancialIncomeTaxableLimit,
  getOpenAIConfig,
  getTokenRefreshEnabled,
  testOpenAIConnection,
  updateFinancialIncomeTaxableLimit,
  updateOpenAIConfig,
  updateTokenRefreshEnabled,
  type FinancialIncomeTaxableLimitOut,
  type OpenAIAdminConfigOut,
  type OpenAIAdminTestOut,
} from "../api/settings";

const loading = ref(false);
const savingTokenRefresh = ref(false);
const testingOpenAI = ref(false);
const savingOpenAI = ref(false);
const savingTaxableLimit = ref(false);

const tokenRefreshEnabled = ref(true);
const tokenRefreshSource = ref("env");

const openAIConfig = ref<OpenAIAdminConfigOut | null>(null);
const openAIKeyInput = ref("");
const taxableLimit = ref<FinancialIncomeTaxableLimitOut | null>(null);
const taxableLimitInput = ref("20000000");

const message = ref("");
const error = ref("");
const openAITestResult = ref<OpenAIAdminTestOut | null>(null);

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
    const [tokenRefreshOut, openAIOut] = await Promise.all([
      getTokenRefreshEnabled(),
      getOpenAIConfig(),
    ]);
    const taxableLimitOut = await getFinancialIncomeTaxableLimit();
    tokenRefreshEnabled.value = Boolean(tokenRefreshOut.enabled);
    tokenRefreshSource.value = tokenRefreshOut.source;
    openAIConfig.value = openAIOut;
    taxableLimit.value = taxableLimitOut;
    taxableLimitInput.value = String(taxableLimitOut.amount_krw);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to load app settings");
  } finally {
    loading.value = false;
  }
}

async function saveTaxableLimit(): Promise<void> {
  const amount = Number(taxableLimitInput.value.replace(/,/g, "").trim());
  if (!Number.isFinite(amount) || amount < 0) {
    setError("Financial income taxable limit must be a non-negative KRW amount");
    return;
  }
  savingTaxableLimit.value = true;
  try {
    const out = await updateFinancialIncomeTaxableLimit(Math.round(amount));
    taxableLimit.value = out;
    taxableLimitInput.value = String(out.amount_krw);
    setMessage("Financial income taxable limit saved");
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to update financial income taxable limit");
  } finally {
    savingTaxableLimit.value = false;
  }
}

async function applyTokenRefresh(next: boolean): Promise<void> {
  const prev = tokenRefreshEnabled.value;
  tokenRefreshEnabled.value = next;
  savingTokenRefresh.value = true;
  try {
    const out = await updateTokenRefreshEnabled(next);
    tokenRefreshEnabled.value = Boolean(out.enabled);
    tokenRefreshSource.value = out.source;
    setMessage(`Token refresh ${out.enabled ? "enabled" : "disabled"}`);
  } catch (err) {
    tokenRefreshEnabled.value = prev;
    setError(err instanceof Error ? err.message : "Failed to update token refresh setting");
  } finally {
    savingTokenRefresh.value = false;
  }
}

async function saveOpenAIConfig(payload: { enabled?: boolean; apiKey?: string; disableApiKey?: boolean }, successMessage: string): Promise<void> {
  savingOpenAI.value = true;
  try {
    const out = await updateOpenAIConfig({
      enabled: payload.enabled,
      api_key: payload.apiKey,
      disable_api_key: payload.disableApiKey ?? false,
    });
    openAIConfig.value = out;
    if (payload.apiKey) {
      openAIKeyInput.value = "";
    }
    openAITestResult.value = null;
    setMessage(successMessage);
  } catch (err) {
    setError(err instanceof Error ? err.message : "Failed to update OpenAI settings");
  } finally {
    savingOpenAI.value = false;
  }
}

async function handleSaveOpenAI(): Promise<void> {
  await saveOpenAIConfig(
    {
      enabled: openAIConfig.value?.enabled ?? true,
      apiKey: openAIKeyInput.value.trim() || undefined,
    },
    "OpenAI settings saved",
  );
}

async function handleDisableOpenAI(): Promise<void> {
  await saveOpenAIConfig(
    {
      enabled: false,
      disableApiKey: true,
    },
    "OpenAI integration disabled",
  );
}

async function handleToggleOpenAI(enabled: boolean): Promise<void> {
  await saveOpenAIConfig(
    {
      enabled,
      apiKey: openAIKeyInput.value.trim() || undefined,
    },
    `OpenAI chat ${enabled ? "enabled" : "disabled"}`,
  );
}

async function runOpenAITest(): Promise<void> {
  testingOpenAI.value = true;
  try {
    const out = await testOpenAIConnection();
    openAITestResult.value = out;
    if (out.ok) {
      setMessage(`OpenAI test succeeded (${out.model_name}, ${out.latency_ms}ms)`);
    } else {
      setError(out.detail || "OpenAI test failed");
    }
  } catch (err) {
    openAITestResult.value = null;
    setError(err instanceof Error ? err.message : "Failed to test OpenAI connection");
  } finally {
    testingOpenAI.value = false;
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
        Admin 전용 시스템 설정입니다. Chat/OpenAI는 DB secret vault를 우선 사용하고, env는 fallback으로만 동작합니다.
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
              source: {{ tokenRefreshSource }}
            </p>
          </div>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
            :disabled="loading || savingTokenRefresh"
            @click="applyTokenRefresh(!tokenRefreshEnabled)"
          >
            {{ savingTokenRefresh ? "Saving..." : tokenRefreshEnabled ? "Turn OFF" : "Turn ON" }}
          </button>
        </div>
      </div>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Dividend Taxable Limit</h2>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Dividend taxable summary에서 사용할 금융소득 과세 기준 금액입니다. 기본값은 KRW 20,000,000입니다.
      </p>
      <div class="mt-4 rounded-xl border border-slate-200 p-4 dark:border-slate-700">
        <div class="grid gap-3 md:grid-cols-[1fr_auto]">
          <label class="text-xs font-semibold text-slate-600 dark:text-slate-300">
            Financial income taxable limit (KRW)
            <input
              v-model="taxableLimitInput"
              type="number"
              min="0"
              step="100000"
              class="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            />
          </label>
          <div class="flex items-end gap-2">
            <button
              type="button"
              class="rounded-lg border border-emerald-300 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
              :disabled="loading || savingTaxableLimit"
              @click="saveTaxableLimit"
            >
              {{ savingTaxableLimit ? "Saving..." : "Save" }}
            </button>
          </div>
        </div>
        <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
          source: {{ taxableLimit?.source ?? "-" }} · portfolio tax profile은 각 Portfolio Edit에서 관리합니다.
        </p>
      </div>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">OpenAI Chat</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Chat v1은 Responses API + gpt-5.4-mini 기반 read-only 설명 모드입니다. 실제 secret은 DB 암호화 저장을 권장합니다.
          </p>
        </div>
        <div class="rounded-xl border border-slate-200 px-3 py-2 text-xs dark:border-slate-700">
          <p class="font-semibold text-slate-900 dark:text-slate-100">
            {{ openAIConfig?.enabled ? "ON" : "OFF" }}
          </p>
          <p class="mt-1 text-slate-500 dark:text-slate-400">
            secret source: {{ openAIConfig?.source ?? "-" }}
          </p>
        </div>
      </div>

      <div class="mt-4 grid gap-4 lg:grid-cols-2">
        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">Runtime</p>
          <dl class="mt-3 space-y-2 text-xs text-slate-600 dark:text-slate-300">
            <div class="flex justify-between gap-3">
              <dt>Enabled source</dt>
              <dd>{{ openAIConfig?.enabled_source ?? "-" }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt>Default model</dt>
              <dd>{{ openAIConfig?.default_model ?? "-" }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt>Heavy model</dt>
              <dd>{{ openAIConfig?.heavy_model ?? "-" }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt>Project ID</dt>
              <dd class="truncate">{{ openAIConfig?.project_id || "-" }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt>Organization ID</dt>
              <dd class="truncate">{{ openAIConfig?.organization_id || "-" }}</dd>
            </div>
            <div class="flex justify-between gap-3">
              <dt>Timeout</dt>
              <dd>{{ openAIConfig?.timeout_seconds ?? "-" }}s</dd>
            </div>
          </dl>
        </div>

        <div class="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
          <label class="block text-sm font-semibold text-slate-900 dark:text-slate-100">
            Stored API Key
            <span class="mt-1 block text-xs font-normal text-slate-500 dark:text-slate-400">
              masked: {{ openAIConfig?.masked_api_key || "-" }}
            </span>
          </label>
          <input
            v-model="openAIKeyInput"
            type="password"
            class="mt-3 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
            placeholder="sk-..."
          />
          <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">
            `APP_SECRETS_MASTER_KEY`가 설정되어 있어야 DB secret 저장/복호화가 정상 동작합니다.
          </p>

          <div class="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              class="rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-500/15 disabled:cursor-not-allowed disabled:opacity-60 dark:text-emerald-200"
              :disabled="savingOpenAI"
              @click="handleSaveOpenAI()"
            >
              {{ savingOpenAI ? "Saving..." : "Save" }}
            </button>
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
              :disabled="savingOpenAI || testingOpenAI"
              @click="runOpenAITest()"
            >
              {{ testingOpenAI ? "Testing..." : "Test connection" }}
            </button>
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-2 text-xs font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
              :disabled="savingOpenAI || !openAIConfig"
              @click="handleToggleOpenAI(!(openAIConfig?.enabled ?? false))"
            >
              {{ openAIConfig?.enabled ? "Turn OFF" : "Turn ON" }}
            </button>
            <button
              type="button"
              class="rounded-lg border border-rose-300 px-3 py-2 text-xs font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
              :disabled="savingOpenAI"
              @click="handleDisableOpenAI()"
            >
              Disable
            </button>
          </div>

          <div
            v-if="openAITestResult"
            class="mt-4 rounded-xl border px-3 py-3 text-xs"
            :class="
              openAITestResult.ok
                ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
                : 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200'
            "
          >
            <p class="font-semibold">
              {{ openAITestResult.ok ? "Connection OK" : "Connection Failed" }}
            </p>
            <p class="mt-1">
              model: {{ openAITestResult.model_name }} · source: {{ openAITestResult.source }} · latency:
              {{ openAITestResult.latency_ms }}ms
            </p>
            <p v-if="openAITestResult.output_text" class="mt-1 break-words">
              response: {{ openAITestResult.output_text }}
            </p>
            <p v-if="openAITestResult.detail" class="mt-1 break-words">
              detail: {{ openAITestResult.detail }}
            </p>
            <p v-if="openAITestResult.status_code" class="mt-1 break-words">
              status: {{ openAITestResult.status_code }}
              <span v-if="openAITestResult.error_category">· category: {{ openAITestResult.error_category }}</span>
              <span v-if="openAITestResult.error_code">· code: {{ openAITestResult.error_code }}</span>
            </p>
            <p v-if="openAITestResult.hint" class="mt-1 break-words">
              hint: {{ openAITestResult.hint }}
            </p>
          </div>
        </div>
      </div>
    </article>

    <p v-if="loading" class="text-xs text-slate-500 dark:text-slate-400">Loading app settings...</p>
    <p
      v-else-if="error"
      class="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200"
    >
      {{ error }}
    </p>
    <p
      v-else-if="message"
      class="rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200"
    >
      {{ message }}
    </p>
  </section>
</template>
