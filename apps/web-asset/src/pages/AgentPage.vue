<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, onMounted, reactive, ref } from "vue";

import { getMe } from "../api/auth";
import { createAsset, deleteAsset, getAssets, updateAsset } from "../api/assets";
import { createHolding, deleteHolding, getHoldings, updateHolding } from "../api/holdings";
import { createLiability, deleteLiability, getLiabilities, updateLiability } from "../api/liabilities";
import { createPortfolio, deletePortfolio, getPortfolios, updatePortfolio } from "../api/portfolios";
import { updateQuotesNow, upsertManualQuote } from "../api/quotes";

type LogStatus = "SUCCESS" | "ERROR" | "INFO";

type ActionLog = {
  id: number;
  at: string;
  action: string;
  status: LogStatus;
  message: string;
};

const loading = reactive({ data: false, run: false, confirm: false });
const me = reactive({ email: "", role: "USER" });
const counts = reactive({ portfolios: 0, assets: 0, holdings: 0, liabilities: 0 });

const logs = ref<ActionLog[]>([]);
let nextLogId = 1;

const confirm = reactive({ open: false, title: "", message: "" });
const pendingAction = ref<null | (() => Promise<void>)>(null);

const portfolioPayload = ref('{"name":"Agent Portfolio","type":"BROKER","base_currency":"KRW","category":"ETC"}');
const portfolioUpdateId = ref("");
const portfolioDeleteId = ref("");

const assetPayload = ref('{"asset_class":"CRYPTO","symbol":"BTC","name":"Bitcoin (UPBIT)","currency":"KRW","quote_mode":"AUTO","exchange_code":"UPBIT","is_trade_supported":true}');
const assetUpdateId = ref("");
const assetDeleteId = ref("");

const holdingPayload = ref('{"portfolio_id":null,"asset_id":1,"quantity":"1","avg_price":"1000","invested_amount":"1000","source_type":"MANUAL","is_hidden":false}');
const holdingUpdateId = ref("");
const holdingDeleteId = ref("");

const liabilityPayload = ref('{"portfolio_id":null,"name":"Agent Liability","liability_type":"ETC","currency":"KRW","outstanding_balance":"100000","source_type":"MANUAL","is_included":true,"is_hidden":false}');
const liabilityUpdateId = ref("");
const liabilityDeleteId = ref("");

const manualQuotePayload = ref('{"asset_id":1,"price":"810000000","currency":"KRW","as_of":null,"source":"MANUAL"}');

const canManageAssets = computed(() => me.role === "ADMIN" || me.role === "MAINTAINER");
const canManageQuotes = computed(() => me.role === "ADMIN" || me.role === "MAINTAINER");
const isBusy = computed(() => loading.data || loading.run || loading.confirm);

function formatDateTime(value: string): string {
  const dt = new Date(value);
  return Number.isNaN(dt.getTime()) ? value : dt.toLocaleString("ko-KR");
}

function parsePayload(text: string): Record<string, unknown> {
  const parsed = JSON.parse(text) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    throw new Error("Payload must be a JSON object");
  }
  return parsed as Record<string, unknown>;
}

function parseId(text: string): number {
  const id = Number(text.trim());
  if (!Number.isInteger(id) || id <= 0) throw new Error("ID must be a positive integer");
  return id;
}

function errorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = error.response?.data?.detail;
    if (typeof detail === "string") return detail;
    if (Array.isArray(detail)) return detail.map((item) => String(item?.msg ?? item)).join(", ");
    return error.message;
  }
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

function pushLog(action: string, status: LogStatus, message: string): void {
  logs.value.unshift({ id: nextLogId++, at: new Date().toISOString(), action, status, message });
  if (logs.value.length > 120) logs.value = logs.value.slice(0, 120);
}

async function refreshData(): Promise<void> {
  loading.data = true;
  try {
    const [meOut, p, a, h, l] = await Promise.all([
      getMe(),
      getPortfolios(),
      getAssets(),
      getHoldings({ include_hidden: true, include_excluded_portfolios: true }),
      getLiabilities({ include_hidden: true, include_excluded: true }),
    ]);
    me.email = meOut.email;
    me.role = meOut.role;
    counts.portfolios = p.length;
    counts.assets = a.length;
    counts.holdings = h.length;
    counts.liabilities = l.length;
    pushLog("Refresh", "INFO", "Agent data refreshed");
  } catch (error) {
    pushLog("Refresh", "ERROR", errorMessage(error));
  } finally {
    loading.data = false;
  }
}

function askConfirm(title: string, message: string, action: () => Promise<void>): void {
  confirm.open = true;
  confirm.title = title;
  confirm.message = message;
  pendingAction.value = action;
}

function closeConfirm(): void {
  if (loading.confirm) return;
  confirm.open = false;
  confirm.title = "";
  confirm.message = "";
  pendingAction.value = null;
}

async function runConfirmed(): Promise<void> {
  if (!pendingAction.value) return;
  loading.confirm = true;
  try {
    await pendingAction.value();
  } finally {
    loading.confirm = false;
    closeConfirm();
  }
}

function runTask(action: string, title: string, message: string, task: () => Promise<void>): void {
  askConfirm(title, message, async () => {
    loading.run = true;
    try {
      await task();
      pushLog(action, "SUCCESS", "Completed");
      await refreshData();
    } catch (error) {
      pushLog(action, "ERROR", errorMessage(error));
    } finally {
      loading.run = false;
    }
  });
}

onMounted(refreshData);
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Agent</p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Approval Action Cards</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">현재 역할: {{ me.role }} ({{ me.email || "-" }})</p>
        </div>
        <button type="button" class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" :disabled="isBusy" @click="refreshData">
          {{ loading.data ? "Loading..." : "Refresh Data" }}
        </button>
      </div>
      <div class="mt-3 flex flex-wrap gap-2 text-xs">
        <span class="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">Portfolios: {{ counts.portfolios }}</span>
        <span class="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">Assets: {{ counts.assets }}</span>
        <span class="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">Holdings: {{ counts.holdings }}</span>
        <span class="rounded-full bg-slate-100 px-2 py-1 dark:bg-slate-800">Liabilities: {{ counts.liabilities }}</span>
      </div>
    </header>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
      <article
        v-if="canManageQuotes"
        class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
      >
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Quote</h2>
        <div class="mt-3 flex flex-wrap gap-2">
          <button type="button" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500" :disabled="isBusy" @click="runTask('Quote Update', 'Update Quotes', '자동 시세를 즉시 갱신합니다.', async () => { const result = await updateQuotesNow(); pushLog('Quote Update', 'INFO', `updated=${result.updated_count}, skipped=${result.skipped_count}, failed=${result.failed_count}`); })">Update Now</button>
          <button type="button" class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500" :disabled="isBusy" @click="runTask('Manual Quote', 'Manual Quote', '수동 시세를 반영합니다.', async () => { await upsertManualQuote(parsePayload(manualQuotePayload) as never); })">Manual Upsert</button>
        </div>
        <textarea v-model="manualQuotePayload" rows="6" class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950" />
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Execution Log</h2>
        <ul class="mt-3 max-h-[320px] space-y-2 overflow-y-auto">
          <li v-for="item in logs" :key="item.id" class="rounded-lg border px-3 py-2 text-xs" :class="item.status === 'SUCCESS' ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30' : item.status === 'ERROR' ? 'border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/30' : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40'">
            <p class="font-semibold">{{ item.action }} · {{ item.status }}</p>
            <p class="mt-0.5">{{ item.message }}</p>
            <p class="mt-0.5 opacity-70">{{ formatDateTime(item.at) }}</p>
          </li>
        </ul>
      </article>
    </div>

    <div class="grid grid-cols-1 gap-4 2xl:grid-cols-2">
      <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Portfolio CRUD</h2>
        <textarea v-model="portfolioPayload" rows="6" class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950" />
        <div class="mt-2 flex flex-wrap gap-2"><input v-model="portfolioUpdateId" placeholder="update id" class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950" /><input v-model="portfolioDeleteId" placeholder="delete id" class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950" /></div>
        <div class="mt-2 flex flex-wrap gap-2">
          <button type="button" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500" :disabled="isBusy" @click="runTask('Portfolio Create', 'Create Portfolio', '포트폴리오를 생성합니다.', async () => { await createPortfolio(parsePayload(portfolioPayload) as never); })">Create</button>
          <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700" :disabled="isBusy" @click="runTask('Portfolio Update', 'Update Portfolio', '포트폴리오를 수정합니다.', async () => { await updatePortfolio(parseId(portfolioUpdateId), parsePayload(portfolioPayload) as never); })">Update</button>
          <button type="button" class="rounded-lg border border-rose-300 px-3 py-2 text-xs text-rose-600 dark:border-rose-800 dark:text-rose-300" :disabled="isBusy" @click="runTask('Portfolio Delete', 'Delete Portfolio', '포트폴리오를 삭제합니다.', async () => { await deletePortfolio(parseId(portfolioDeleteId)); })">Delete</button>
        </div>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Asset CRUD</h2>
        <p v-if="!canManageAssets" class="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200">
          USER/SUPERUSER는 자산 생성/수정/삭제 권한이 없습니다. Asset VOC는 Admin/Maintainer에게 요청해 주세요.
        </p>
        <template v-else>
          <textarea v-model="assetPayload" rows="6" class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950" />
          <div class="mt-2 flex flex-wrap gap-2"><input v-model="assetUpdateId" placeholder="update id" class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950" /><input v-model="assetDeleteId" placeholder="delete id" class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950" /></div>
          <div class="mt-2 flex flex-wrap gap-2">
            <button type="button" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500" :disabled="isBusy" @click="runTask('Asset Create', 'Create Asset', '자산을 생성합니다.', async () => { await createAsset(parsePayload(assetPayload) as never); })">Create</button>
            <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700" :disabled="isBusy" @click="runTask('Asset Update', 'Update Asset', '자산을 수정합니다.', async () => { await updateAsset(parseId(assetUpdateId), parsePayload(assetPayload) as never); })">Update</button>
            <button type="button" class="rounded-lg border border-rose-300 px-3 py-2 text-xs text-rose-600 dark:border-rose-800 dark:text-rose-300" :disabled="isBusy" @click="runTask('Asset Delete', 'Delete Asset', '자산을 삭제합니다.', async () => { await deleteAsset(parseId(assetDeleteId)); })">Delete</button>
          </div>
        </template>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Holding CRUD</h2>
        <textarea v-model="holdingPayload" rows="6" class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950" />
        <div class="mt-2 flex flex-wrap gap-2"><input v-model="holdingUpdateId" placeholder="update id" class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950" /><input v-model="holdingDeleteId" placeholder="delete id" class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950" /></div>
        <div class="mt-2 flex flex-wrap gap-2">
          <button type="button" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500" :disabled="isBusy" @click="runTask('Holding Create', 'Create Holding', '홀딩을 생성합니다.', async () => { await createHolding(parsePayload(holdingPayload) as never); })">Create</button>
          <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700" :disabled="isBusy" @click="runTask('Holding Update', 'Update Holding', '홀딩을 수정합니다.', async () => { await updateHolding(parseId(holdingUpdateId), parsePayload(holdingPayload) as never); })">Update</button>
          <button type="button" class="rounded-lg border border-rose-300 px-3 py-2 text-xs text-rose-600 dark:border-rose-800 dark:text-rose-300" :disabled="isBusy" @click="runTask('Holding Delete', 'Delete Holding', '홀딩을 삭제합니다.', async () => { await deleteHolding(parseId(holdingDeleteId)); })">Delete</button>
        </div>
      </article>

      <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Liability CRUD</h2>
        <textarea v-model="liabilityPayload" rows="6" class="mt-2 w-full rounded-lg border border-slate-300 px-3 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950" />
        <div class="mt-2 flex flex-wrap gap-2"><input v-model="liabilityUpdateId" placeholder="update id" class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950" /><input v-model="liabilityDeleteId" placeholder="delete id" class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950" /></div>
        <div class="mt-2 flex flex-wrap gap-2">
          <button type="button" class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500" :disabled="isBusy" @click="runTask('Liability Create', 'Create Liability', '부채를 생성합니다.', async () => { await createLiability(parsePayload(liabilityPayload) as never); })">Create</button>
          <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-xs dark:border-slate-700" :disabled="isBusy" @click="runTask('Liability Update', 'Update Liability', '부채를 수정합니다.', async () => { await updateLiability(parseId(liabilityUpdateId), parsePayload(liabilityPayload) as never); })">Update</button>
          <button type="button" class="rounded-lg border border-rose-300 px-3 py-2 text-xs text-rose-600 dark:border-rose-800 dark:text-rose-300" :disabled="isBusy" @click="runTask('Liability Delete', 'Delete Liability', '부채를 삭제합니다.', async () => { await deleteLiability(parseId(liabilityDeleteId)); })">Delete</button>
        </div>
      </article>
    </div>
  </section>

  <div v-if="confirm.open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4" @click.self="closeConfirm">
    <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ confirm.title }}</h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ confirm.message }}</p>
      <div class="mt-4 flex justify-end gap-2">
        <button type="button" class="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700" :disabled="loading.confirm" @click="closeConfirm">Cancel</button>
        <button type="button" class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500" :disabled="loading.confirm" @click="runConfirmed">{{ loading.confirm ? "Running..." : "Confirm" }}</button>
      </div>
    </section>
  </div>
</template>
