<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import {
  createAsset,
  deleteAsset,
  getAssetsTable,
  updateAsset,
  type AssetCreateIn,
  type AssetTableRowOut,
  type AssetTableSortBy,
  type SortOrder,
} from "../api/assets";
import { getMe, type AuthMeOut } from "../api/auth";
import { updateQuotesNow, upsertManualQuote, type ManualQuoteUpsertIn } from "../api/quotes";

type LogStatus = "SUCCESS" | "ERROR" | "INFO";
type AssetModalMode = "CREATE" | "EDIT";
type ActionLog = { id: number; at: string; action: string; status: LogStatus; message: string };
type AssetsQueryState = {
  page: number;
  pageSize: number;
  total: number;
  sortBy: AssetTableSortBy;
  sortOrder: SortOrder;
  q: string;
};

const loading = reactive({ data: false, action: false, confirm: false });
const me = ref<AuthMeOut | null>(null);
const assets = ref<AssetTableRowOut[]>([]);
const logs = ref<ActionLog[]>([]);
let nextLogId = 1;
const assetsQuery = reactive<AssetsQueryState>({
  page: 1,
  pageSize: 20,
  total: 0,
  sortBy: "updated_at",
  sortOrder: "desc",
  q: "",
});

const confirmModal = reactive({ open: false, title: "", message: "" });
const pendingAction = ref<null | (() => Promise<void>)>(null);

const assetModal = reactive({ open: false, mode: "CREATE" as AssetModalMode });
const quoteActionsCollapsed = ref(true);

const assetForm = reactive({
  id: "",
  asset_class: "",
  symbol: "",
  name: "",
  currency: "",
  quote_mode: "",
  exchange_code: "",
  is_trade_supported: true,
  meta_json_text: "",
});

const manualQuoteForm = reactive({
  asset_id: "",
  price: "",
  currency: "KRW",
  as_of: "",
  source: "MANUAL",
});

const canManageAssets = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
const canManageQuotes = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");
const isBusy = computed(() => loading.data || loading.action || loading.confirm);
const selectedAssetForQuote = computed(() => assets.value.find((item) => String(item.id) === manualQuoteForm.asset_id) ?? null);
const assetClassOptions = ["STOCK", "CRYPTO", "REAL_ESTATE", "DEPOSIT_SAVING", "BOND", "ETC"] as const;
const quoteModeOptions = ["AUTO", "MANUAL"] as const;
const totalPages = computed(() => Math.max(1, Math.ceil(assetsQuery.total / assetsQuery.pageSize)));
const AUTO_SEARCH_DEBOUNCE_MS = 450;
let searchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let refreshSequence = 0;

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString("ko-KR");
}

function normalizeUpper(value: string): string {
  return value.trim().toUpperCase();
}

function toPositiveInt(value: string): number {
  const num = Number(value.trim());
  if (!Number.isInteger(num) || num <= 0) throw new Error("ID must be a positive integer");
  return num;
}

function parseMetaJson(text: string): Record<string, unknown> | null {
  const trimmed = text.trim();
  if (!trimmed) return null;
  const parsed = JSON.parse(trimmed) as unknown;
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("meta_json must be object");
  return parsed as Record<string, unknown>;
}

function formatMoney(value: string | number, currency: string): string {
  const amount = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(amount)) return String(value);

  try {
    return new Intl.NumberFormat("ko-KR", {
      style: "currency",
      currency: normalizeUpper(currency),
      minimumFractionDigits: 0,
      maximumFractionDigits: normalizeUpper(currency) === "KRW" ? 0 : 8,
    }).format(amount);
  } catch {
    return `${amount.toLocaleString("ko-KR")} ${currency}`;
  }
}

function quotePriceText(item: AssetTableRowOut): string {
  if (item.quote_price === null || item.quote_price === undefined || !item.quote_currency) return "-";
  return formatMoney(item.quote_price, item.quote_currency);
}

function quoteAsOfText(item: AssetTableRowOut): string {
  return formatDateTime(item.quote_as_of);
}

function quoteSourceText(item: AssetTableRowOut): string {
  return item.quote_source || "-";
}

function getErrorMessage(error: unknown): string {
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
  if (logs.value.length > 100) logs.value = logs.value.slice(0, 100);
}

function resetAssetFormForCreate(): void {
  assetForm.id = "";
  assetForm.asset_class = "";
  assetForm.symbol = "";
  assetForm.name = "";
  assetForm.currency = "";
  assetForm.quote_mode = "";
  assetForm.exchange_code = "";
  assetForm.is_trade_supported = true;
  assetForm.meta_json_text = "";
}

function fillAssetForm(item: AssetTableRowOut): void {
  assetForm.id = String(item.id);
  assetForm.asset_class = item.asset_class;
  assetForm.symbol = item.symbol ?? "";
  assetForm.name = item.name;
  assetForm.currency = item.currency;
  assetForm.quote_mode = item.quote_mode;
  assetForm.exchange_code = item.exchange_code;
  assetForm.is_trade_supported = item.is_trade_supported;
  assetForm.meta_json_text = item.meta_json ? JSON.stringify(item.meta_json, null, 2) : "";
}

function openCreateAssetModal(): void {
  if (!canManageAssets.value) {
    pushLog("Asset Create", "ERROR", "Admin/Maintainer only");
    return;
  }
  resetAssetFormForCreate();
  assetModal.mode = "CREATE";
  assetModal.open = true;
}

function openEditAssetModal(item: AssetTableRowOut): void {
  if (!canManageAssets.value) {
    pushLog("Asset Edit", "ERROR", "Admin/Maintainer only");
    return;
  }
  fillAssetForm(item);
  assetModal.mode = "EDIT";
  assetModal.open = true;
}

function selectAssetForQuote(item: AssetTableRowOut): void {
  manualQuoteForm.asset_id = String(item.id);
}

function closeAssetModal(): void {
  if (loading.action || loading.confirm) return;
  assetModal.open = false;
}

function askConfirm(title: string, message: string, action: () => Promise<void>): void {
  confirmModal.open = true;
  confirmModal.title = title;
  confirmModal.message = message;
  pendingAction.value = action;
}

function closeConfirm(): void {
  if (loading.confirm) return;
  confirmModal.open = false;
  pendingAction.value = null;
}

async function executeConfirm(): Promise<void> {
  if (!pendingAction.value) return;
  loading.confirm = true;
  try {
    await pendingAction.value();
  } finally {
    loading.confirm = false;
    closeConfirm();
  }
}

function runAction(action: string, title: string, message: string, task: () => Promise<void>): void {
  askConfirm(title, message, async () => {
    loading.action = true;
    try {
      await task();
      pushLog(action, "SUCCESS", "Completed");
      await refreshData();
    } catch (error) {
      pushLog(action, "ERROR", getErrorMessage(error));
    } finally {
      loading.action = false;
    }
  });
}

function buildAssetPayload(): AssetCreateIn {
  const name = assetForm.name.trim();
  if (!name) throw new Error("Name is required");

  const assetClass = assetForm.asset_class.trim();
  if (!assetClass) throw new Error("Class is required");

  const currency = normalizeUpper(assetForm.currency);
  if (!currency) throw new Error("Currency is required");
  if (currency.length !== 3) throw new Error("Currency must be 3 letters");

  const quoteMode = assetForm.quote_mode.trim();
  if (!quoteMode) throw new Error("Quote mode is required");

  const exchangeCode = normalizeUpper(assetForm.exchange_code);
  if (!exchangeCode) throw new Error("Exchange code is required");

  return {
    asset_class: assetClass,
    symbol: normalizeUpper(assetForm.symbol) || null,
    name,
    currency,
    quote_mode: quoteMode as "AUTO" | "MANUAL",
    exchange_code: exchangeCode,
    is_trade_supported: assetForm.is_trade_supported,
    meta_json: parseMetaJson(assetForm.meta_json_text),
  };
}

function submitAssetForm(): void {
  if (!canManageAssets.value) {
    pushLog("Asset Form", "ERROR", "Admin/Maintainer only");
    return;
  }

  try {
    const payload = buildAssetPayload();

    if (assetModal.mode === "CREATE") {
      closeAssetModal();
      runAction("Asset Create", "Create Asset", "새 자산을 생성할까요?", async () => {
        await createAsset(payload);
      });
      return;
    }

    const assetId = toPositiveInt(assetForm.id);
    closeAssetModal();
    runAction("Asset Update", "Apply Asset Update", `Asset #${assetId} 정보를 수정할까요?`, async () => {
      await updateAsset(assetId, payload);
    });
  } catch (error) {
    pushLog("Asset Form", "ERROR", getErrorMessage(error));
  }
}

function askDeleteAsset(item: AssetTableRowOut): void {
  if (!canManageAssets.value) {
    pushLog("Asset Delete", "ERROR", "Admin/Maintainer only");
    return;
  }
  runAction("Asset Delete", "Delete Asset", `Asset #${item.id} (${item.name}) 를 삭제할까요?`, async () => {
    await deleteAsset(item.id);
  });
}

function askUpdateQuotesNow(): void {
  if (!canManageQuotes.value) {
    pushLog("Quote Update", "ERROR", "Admin/Maintainer only");
    return;
  }
  runAction("Quote Update", "Update Quotes", "AUTO 모드의 모든 자산 시세를 즉시 갱신합니다.", async () => {
    const result = await updateQuotesNow();
    pushLog("Quote Update", "INFO", `updated=${result.updated_count}, skipped=${result.skipped_count}, failed=${result.failed_count}`);
  });
}

function askApplyManualQuote(): void {
  if (!canManageQuotes.value) {
    pushLog("Manual Quote", "ERROR", "Admin/Maintainer only");
    return;
  }

  runAction("Manual Quote", "Manual Quote", "수동 시세를 반영할까요?", async () => {
    const payload: ManualQuoteUpsertIn = {
      asset_id: toPositiveInt(manualQuoteForm.asset_id),
      price: manualQuoteForm.price.trim(),
      currency: normalizeUpper(manualQuoteForm.currency),
      as_of: manualQuoteForm.as_of.trim() || null,
      source: manualQuoteForm.source.trim() || null,
    };
    await upsertManualQuote(payload);
  });
}

async function refreshData(options?: { logRefresh?: boolean }): Promise<void> {
  const refreshId = ++refreshSequence;
  const shouldLogRefresh = options?.logRefresh ?? true;
  loading.data = true;
  try {
    const [meOut, assetsOut] = await Promise.all([
      getMe(),
      getAssetsTable({
        page: assetsQuery.page,
        page_size: assetsQuery.pageSize,
        sort_by: assetsQuery.sortBy,
        sort_order: assetsQuery.sortOrder,
        q: assetsQuery.q.trim() || undefined,
      }),
    ]);
    if (refreshId !== refreshSequence) return;
    me.value = meOut;
    assets.value = assetsOut.items;
    assetsQuery.total = assetsOut.total;

    const selectedStillExists = assetsOut.items.some((item) => String(item.id) === manualQuoteForm.asset_id);
    if (!selectedStillExists) {
      manualQuoteForm.asset_id = assetsOut.items[0] ? String(assetsOut.items[0].id) : "";
    }

    if (shouldLogRefresh) {
      pushLog("Refresh", "INFO", `Agent data loaded (page=${assetsOut.page}, total=${assetsOut.total})`);
    }
  } catch (error) {
    pushLog("Refresh", "ERROR", getErrorMessage(error));
  } finally {
    loading.data = false;
  }
}

function sortIndicator(key: AssetTableSortBy): string {
  if (assetsQuery.sortBy !== key) return "↕";
  return assetsQuery.sortOrder === "asc" ? "↑" : "↓";
}

async function toggleSort(key: AssetTableSortBy): Promise<void> {
  if (assetsQuery.sortBy === key) {
    assetsQuery.sortOrder = assetsQuery.sortOrder === "asc" ? "desc" : "asc";
  } else {
    assetsQuery.sortBy = key;
    assetsQuery.sortOrder = "asc";
  }
  assetsQuery.page = 1;
  await refreshData();
}

async function movePage(delta: number): Promise<void> {
  const next = assetsQuery.page + delta;
  if (next < 1 || next > totalPages.value) return;
  assetsQuery.page = next;
  await refreshData();
}

async function applySearch(): Promise<void> {
  clearSearchDebounce();
  assetsQuery.page = 1;
  await refreshData();
}

async function clearSearch(): Promise<void> {
  clearSearchDebounce();
  if (!assetsQuery.q) return;
  assetsQuery.q = "";
  assetsQuery.page = 1;
  await refreshData();
}

function clearSearchDebounce(): void {
  if (!searchDebounceTimer) return;
  clearTimeout(searchDebounceTimer);
  searchDebounceTimer = null;
}

watch(
  () => assetsQuery.q,
  () => {
    clearSearchDebounce();
    searchDebounceTimer = setTimeout(async () => {
      assetsQuery.page = 1;
      await refreshData({ logRefresh: false });
    }, AUTO_SEARCH_DEBOUNCE_MS);
  },
);

onMounted(refreshData);
onBeforeUnmount(() => {
  clearSearchDebounce();
});
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Agent</p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Asset Control Console</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">Role: {{ me?.role || "-" }} / {{ me?.email || "-" }}</p>
        </div>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :disabled="isBusy"
          @click="refreshData()"
        >
          {{ loading.data ? "Loading..." : "Refresh Data" }}
        </button>
      </div>
    </header>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Current Assets Status</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">현재 등록된 자산 목록과 상태입니다. 행 클릭 시 Quote Actions와 동기화됩니다.</p>
        </div>
        <button
          v-if="canManageQuotes"
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500"
          :disabled="isBusy"
          @click="askUpdateQuotesNow"
        >
          Update Quotes Now
        </button>
      </div>
      <p v-if="canManageQuotes" class="mt-1 text-xs text-slate-500 dark:text-slate-400">AUTO mode인 모든 Asset 시세를 즉시 갱신합니다.</p>

      <div class="mt-3 flex flex-wrap items-center gap-2">
        <input
          v-model="assetsQuery.q"
          type="text"
          placeholder="Search name/symbol/exchange"
          class="w-64 rounded-lg border border-slate-300 px-2 py-1.5 text-xs dark:border-slate-700 dark:bg-slate-950"
          @keyup.enter="applySearch"
        />
        <button
          type="button"
          class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          :disabled="isBusy"
          @click="applySearch"
        >
          Search
        </button>
        <button
          type="button"
          class="rounded border border-slate-300 px-2.5 py-1.5 text-xs hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
          :disabled="isBusy"
          @click="clearSearch"
        >
          Clear
        </button>
      </div>

      <div class="mt-3 overflow-x-auto">
        <table class="w-full min-w-[1220px] text-left text-xs leading-tight">
          <thead class="bg-slate-50 dark:bg-slate-800">
            <tr>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('id')">ID <span class="opacity-70">{{ sortIndicator("id") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('name')">Name <span class="opacity-70">{{ sortIndicator("name") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('symbol')">Symbol <span class="opacity-70">{{ sortIndicator("symbol") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('price')">Price <span class="opacity-70">{{ sortIndicator("price") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('currency')">Currency <span class="opacity-70">{{ sortIndicator("currency") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('asset_class')">Class <span class="opacity-70">{{ sortIndicator("asset_class") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('updated_at')">Updated <span class="opacity-70">{{ sortIndicator("updated_at") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('quote_mode')">Quote <span class="opacity-70">{{ sortIndicator("quote_mode") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('quote_as_of')">Quote As Of <span class="opacity-70">{{ sortIndicator("quote_as_of") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('exchange_code')">Exchange <span class="opacity-70">{{ sortIndicator("exchange_code") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('source')">Source <span class="opacity-70">{{ sortIndicator("source") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap"><button type="button" class="inline-flex items-center gap-1 hover:underline" @click="toggleSort('trade')">Trade <span class="opacity-70">{{ sortIndicator("trade") }}</span></button></th>
              <th class="px-2 py-1.5 whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="item in assets"
              :key="item.id"
              class="cursor-pointer border-t border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800/40"
              :class="String(item.id) === manualQuoteForm.asset_id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''"
              @click="selectAssetForQuote(item)"
            >
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.id }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.name }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.symbol || "-" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ quotePriceText(item) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.currency }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.asset_class }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ formatDateTime(item.updated_at) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.quote_mode }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ quoteAsOfText(item) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.exchange_code }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ quoteSourceText(item) }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">{{ item.is_trade_supported ? "Y" : "N" }}</td>
              <td class="px-2 py-1.5 whitespace-nowrap">
                <div class="flex flex-wrap gap-1">
                  <button
                    type="button"
                    class="rounded border border-slate-300 px-2 py-0.5 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
                    :disabled="!canManageAssets || isBusy"
                    @click.stop="openEditAssetModal(item)"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    class="rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 focus:outline-none focus:ring-2 focus:ring-rose-300 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20 dark:focus:ring-rose-700"
                    :disabled="!canManageAssets || isBusy"
                    @click.stop="askDeleteAsset(item)"
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr v-if="assets.length === 0">
              <td colspan="13" class="px-3 py-4 text-center text-xs text-slate-500 dark:text-slate-400">No assets found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex flex-wrap items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span>Total: {{ assetsQuery.total }}</span>
          <span>|</span>
          <span>Page {{ assetsQuery.page }} / {{ totalPages }}</span>
          <span>|</span>
          <label>
            Size
            <select
              v-model.number="assetsQuery.pageSize"
              class="ml-1 rounded border border-slate-300 px-1 py-0.5 dark:border-slate-700 dark:bg-slate-950"
              @change="assetsQuery.page = 1; refreshData()"
            >
              <option :value="10">10</option>
              <option :value="20">20</option>
              <option :value="50">50</option>
              <option :value="100">100</option>
            </select>
          </label>
          <button
            type="button"
            class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            :disabled="isBusy || assetsQuery.page <= 1"
            @click="movePage(-1)"
          >
            Prev
          </button>
          <button
            type="button"
            class="rounded border border-slate-300 px-2 py-0.5 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
            :disabled="isBusy || assetsQuery.page >= totalPages"
            @click="movePage(1)"
          >
            Next
          </button>
        </div>

        <button
          type="button"
          class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
          :disabled="!canManageAssets || isBusy"
          @click="openCreateAssetModal"
        >
          Create Asset
        </button>
      </div>
      <p class="mt-2 text-xs text-slate-500 dark:text-slate-400">Create/Edit/Delete는 Admin/Maintainer 전용입니다.</p>
      <p
        v-if="!canManageAssets"
        class="mt-2 rounded-lg border border-amber-300 bg-amber-50 px-3 py-2 text-xs text-amber-900 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-200"
      >
        USER/SUPERUSER는 Asset 생성/수정/삭제 권한이 없습니다. Admin/Maintainer에게 요청하세요.
      </p>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Quote Actions (Admin/Maintainer)</h2>
        <button
          v-if="canManageQuotes"
          type="button"
          class="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :disabled="isBusy"
          @click="quoteActionsCollapsed = !quoteActionsCollapsed"
        >
          {{ quoteActionsCollapsed ? "Expand" : "Collapse" }}
        </button>
      </div>

      <p v-if="selectedAssetForQuote" class="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Selected: {{ selectedAssetForQuote.name }} ({{ selectedAssetForQuote.exchange_code }})
      </p>

      <p v-if="!canManageQuotes" class="mt-2 text-xs text-slate-500 dark:text-slate-400">권한이 없어 조회만 가능합니다.</p>
      <p v-else-if="quoteActionsCollapsed" class="mt-2 text-xs text-slate-500 dark:text-slate-400">폼이 접혀 있습니다. Expand 버튼으로 열어주세요.</p>
      <template v-else>
        <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
          <label class="text-xs"
            >Asset
            <select
              v-model="manualQuoteForm.asset_id"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            >
              <option value="">Select</option>
              <option v-for="item in assets" :key="item.id" :value="String(item.id)">{{ item.id }} - {{ item.name }} ({{ item.exchange_code }})</option>
            </select>
          </label>
          <label class="text-xs"
            >Price
            <input
              v-model="manualQuoteForm.price"
              placeholder="예: 810000000"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs"
            >Currency
            <input
              v-model="manualQuoteForm.currency"
              maxlength="3"
              placeholder="KRW"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
          <label class="text-xs"
            >As Of
            <input
              v-model="manualQuoteForm.as_of"
              type="datetime-local"
              class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
            />
          </label>
        </div>
        <div class="mt-3">
          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-500"
            :disabled="isBusy"
            @click="askApplyManualQuote"
          >
            Apply Manual Quote
          </button>
        </div>
      </template>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Execution Log</h2>
      <ul class="mt-3 max-h-72 space-y-2 overflow-y-auto">
        <li
          v-for="item in logs"
          :key="item.id"
          class="rounded-lg border px-3 py-2 text-xs"
          :class="
            item.status === 'SUCCESS'
              ? 'border-emerald-300 bg-emerald-50 dark:border-emerald-900 dark:bg-emerald-900/30'
              : item.status === 'ERROR'
                ? 'border-rose-300 bg-rose-50 dark:border-rose-900 dark:bg-rose-900/30'
                : 'border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/40'
          "
        >
          <p class="font-semibold">{{ item.action }} · {{ item.status }}</p>
          <p class="mt-0.5">{{ item.message }}</p>
          <p class="mt-0.5 opacity-70">{{ formatDateTime(item.at) }}</p>
        </li>
      </ul>
    </article>
  </section>

  <div v-if="assetModal.open" class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/55 px-4" @click.self="closeAssetModal">
    <section class="w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">
        {{ assetModal.mode === "CREATE" ? "Create Asset" : `Edit Asset #${assetForm.id}` }}
      </h3>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">필수 입력: Name, Class, Currency, Quote Mode, Exchange</p>

      <div class="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <label class="text-xs"
          >Name
          <input
            v-model="assetForm.name"
            placeholder="예: 삼성전자"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs"
          >Class
          <select
            v-model="assetForm.asset_class"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="" disabled>Select class</option>
            <option v-for="item in assetClassOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>

        <label class="text-xs"
          >Symbol
          <input
            v-model="assetForm.symbol"
            placeholder="예: 005930 또는 BTC"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs"
          >Currency
          <input
            v-model="assetForm.currency"
            maxlength="3"
            placeholder="예: KRW"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs"
          >Quote Mode
          <select
            v-model="assetForm.quote_mode"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="" disabled>Select quote mode</option>
            <option v-for="item in quoteModeOptions" :key="item" :value="item">{{ item }}</option>
          </select>
        </label>

        <label class="text-xs"
          >Exchange
          <input
            v-model="assetForm.exchange_code"
            placeholder="예: KRX / UPBIT / KORBIT"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm uppercase dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs md:col-span-2">
          <input v-model="assetForm.is_trade_supported" type="checkbox" />
          <span class="ml-1">Trade Supported</span>
        </label>

        <label class="text-xs md:col-span-2"
          >Meta JSON
          <textarea
            v-model="assetForm.meta_json_text"
            rows="4"
            placeholder='예: {"address":"경기 수원시 영통구 청명북로 33"}'
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 font-mono text-xs dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>

      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
          :disabled="loading.action || loading.confirm"
          @click="closeAssetModal"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          :disabled="loading.action || loading.confirm"
          @click="submitAssetForm"
        >
          {{ assetModal.mode === "CREATE" ? "Create" : "Apply" }}
        </button>
      </div>
    </section>
  </div>

  <div v-if="confirmModal.open" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4" @click.self="closeConfirm">
    <section class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
      <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">{{ confirmModal.title }}</h3>
      <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">{{ confirmModal.message }}</p>
      <div class="mt-4 flex justify-end gap-2">
        <button
          type="button"
          class="rounded-lg border border-slate-300 px-3 py-2 text-sm transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:focus:ring-slate-600"
          :disabled="loading.confirm"
          @click="closeConfirm"
        >
          Cancel
        </button>
        <button
          type="button"
          class="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
          :disabled="loading.confirm"
          @click="executeConfirm"
        >
          {{ loading.confirm ? "Running..." : "Confirm" }}
        </button>
      </div>
    </section>
  </div>
</template>



