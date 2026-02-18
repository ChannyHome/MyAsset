<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, onMounted, reactive, ref, watch } from "vue";

import {
  getAdminHistory,
  type AdminHistoryItemOut,
  type AdminHistoryMethod,
  type AdminHistoryQuery,
} from "../api/adminHistory";

const loading = ref(false);
const errorMessage = ref("");
const items = ref<AdminHistoryItemOut[]>([]);
const total = ref(0);
const selectedItem = ref<AdminHistoryItemOut | null>(null);

const filters = reactive({
  from: "",
  to: "",
  userId: "",
  method: "" as "" | AdminHistoryMethod,
  pathContains: "",
  statusCode: "",
});

const pagination = reactive({
  page: 1,
  pageSize: 20,
});

const methodOptions: AdminHistoryMethod[] = ["GET", "POST", "PUT", "PATCH", "DELETE"];
const pageSizeOptions = [20, 50, 100];

const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pagination.pageSize)));
const hasRows = computed(() => items.value.length > 0);

function formatDateTime(value: string): string {
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString("ko-KR");
}

function actorText(item: AdminHistoryItemOut): string {
  if (!item.user_id) return "anonymous";
  const role = item.role ? ` (${item.role})` : "";
  return `#${item.user_id}${role}`;
}

function endpointText(item: AdminHistoryItemOut): string {
  if (!item.query) return item.path;
  return `${item.path}?${item.query}`;
}

function statusClass(statusCode: number): string {
  if (statusCode >= 500) {
    return "border-rose-300 bg-rose-50 text-rose-700 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-200";
  }
  if (statusCode >= 400) {
    return "border-amber-300 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200";
  }
  return "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-200";
}

function buildQuery(): AdminHistoryQuery {
  const params: AdminHistoryQuery = {
    page: pagination.page,
    page_size: pagination.pageSize,
  };
  if (filters.from.trim()) params.from = filters.from.trim();
  if (filters.to.trim()) params.to = filters.to.trim();
  if (filters.pathContains.trim()) params.path_contains = filters.pathContains.trim();
  if (filters.method) params.method = filters.method;

  if (filters.userId.trim()) {
    const userId = Number(filters.userId.trim());
    if (Number.isInteger(userId) && userId > 0) {
      params.user_id = userId;
    }
  }
  if (filters.statusCode.trim()) {
    const statusCode = Number(filters.statusCode.trim());
    if (Number.isInteger(statusCode) && statusCode >= 100 && statusCode <= 599) {
      params.status_code = statusCode;
    }
  }
  return params;
}

function parseApiError(error: unknown): string {
  if (error instanceof AxiosError) {
    const detail = (error.response?.data as { detail?: string } | undefined)?.detail;
    if (detail) return detail;
    if (error.response?.status === 403) return "권한이 없습니다. Maintainer/Admin 계정으로 확인해 주세요.";
  }
  if (error instanceof Error) return error.message;
  return "Unknown error";
}

async function loadHistory(): Promise<void> {
  loading.value = true;
  errorMessage.value = "";
  try {
    const out = await getAdminHistory(buildQuery());
    items.value = out.items;
    total.value = out.total;
  } catch (error) {
    items.value = [];
    total.value = 0;
    errorMessage.value = `Failed to load history: ${parseApiError(error)}`;
  } finally {
    loading.value = false;
  }
}

async function applyFilters(): Promise<void> {
  pagination.page = 1;
  await loadHistory();
}

async function resetFilters(): Promise<void> {
  filters.from = "";
  filters.to = "";
  filters.userId = "";
  filters.method = "";
  filters.pathContains = "";
  filters.statusCode = "";
  pagination.page = 1;
  await loadHistory();
}

async function movePage(nextPage: number): Promise<void> {
  const clamped = Math.min(Math.max(1, nextPage), totalPages.value);
  if (clamped === pagination.page) return;
  pagination.page = clamped;
  await loadHistory();
}

watch(
  () => pagination.pageSize,
  async () => {
    pagination.page = 1;
    await loadHistory();
  },
);

onMounted(async () => {
  await loadHistory();
});
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">History</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">API Audit History</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            사용자 액션, 엔드포인트 호출 결과, 마스킹된 요청/응답을 조회합니다.
          </p>
        </div>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          :disabled="loading"
          @click="loadHistory"
        >
          {{ loading ? "Loading..." : "Refresh" }}
        </button>
      </div>
    </header>

    <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
          From
          <input
            v-model="filters.from"
            type="datetime-local"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
          To
          <input
            v-model="filters.to"
            type="datetime-local"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
          User ID
          <input
            v-model="filters.userId"
            type="number"
            min="1"
            placeholder="e.g. 1"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
          Method
          <select
            v-model="filters.method"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
          >
            <option value="">ALL</option>
            <option v-for="method in methodOptions" :key="method" :value="method">{{ method }}</option>
          </select>
        </label>

        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
          Path Contains
          <input
            v-model="filters.pathContains"
            type="text"
            placeholder="/holdings"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
          />
        </label>

        <label class="text-xs font-semibold uppercase tracking-[0.08em] text-slate-600 dark:text-slate-300">
          Status Code
          <input
            v-model="filters.statusCode"
            type="number"
            min="100"
            max="599"
            placeholder="200"
            class="mt-1 w-full rounded-lg border border-slate-300 px-2 py-2 text-sm font-normal dark:border-slate-700 dark:bg-slate-950"
          />
        </label>
      </div>

      <div class="mt-3 flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <button
            type="button"
            class="rounded-lg bg-cyan-600 px-3 py-2 text-sm font-semibold text-white transition-colors hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-70"
            :disabled="loading"
            @click="applyFilters"
          >
            Search
          </button>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="loading"
            @click="resetFilters"
          >
            Reset
          </button>
        </div>

        <label class="inline-flex items-center gap-2 text-xs text-slate-600 dark:text-slate-300">
          <span>Page Size</span>
          <select
            v-model.number="pagination.pageSize"
            class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700 dark:bg-slate-950"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">{{ size }}</option>
          </select>
        </label>
      </div>
    </article>

    <article
      v-if="errorMessage"
      class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
    >
      {{ errorMessage }}
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-slate-200 text-sm dark:divide-slate-800">
          <thead class="bg-slate-50 dark:bg-slate-800/80">
            <tr>
              <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Time</th>
              <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Actor</th>
              <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Action</th>
              <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Endpoint</th>
              <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">Status</th>
              <th class="px-3 py-2 text-right font-semibold text-slate-600 dark:text-slate-300">Latency</th>
              <th class="px-3 py-2 text-left font-semibold text-slate-600 dark:text-slate-300">IP</th>
              <th class="px-3 py-2 text-center font-semibold text-slate-600 dark:text-slate-300">Detail</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100 dark:divide-slate-800">
            <tr v-if="!loading && !hasRows">
              <td colspan="8" class="px-3 py-6 text-center text-sm text-slate-500 dark:text-slate-400">
                조회 결과가 없습니다.
              </td>
            </tr>

            <tr v-for="item in items" :key="item.id" class="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
              <td class="px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-200">
                {{ formatDateTime(item.timestamp) }}
              </td>
              <td class="px-3 py-2 text-slate-700 dark:text-slate-200">
                <p class="whitespace-nowrap">{{ actorText(item) }}</p>
                <p class="mt-0.5 max-w-[16rem] truncate text-[11px] text-slate-500 dark:text-slate-400">
                  {{ item.actor_email || "-" }}
                </p>
              </td>
              <td class="px-3 py-2 text-slate-700 dark:text-slate-200">{{ item.action_name || "-" }}</td>
              <td class="px-3 py-2 max-w-[30rem] truncate text-slate-700 dark:text-slate-200" :title="endpointText(item)">
                {{ endpointText(item) }}
              </td>
              <td class="px-3 py-2 whitespace-nowrap">
                <span
                  class="inline-flex rounded-full border px-2 py-0.5 text-xs font-semibold"
                  :class="statusClass(item.status_code)"
                >
                  {{ item.status_code }}
                </span>
              </td>
              <td class="px-3 py-2 text-right whitespace-nowrap text-slate-700 dark:text-slate-200">{{ item.duration_ms }} ms</td>
              <td class="px-3 py-2 whitespace-nowrap text-slate-700 dark:text-slate-200">{{ item.client_ip || "-" }}</td>
              <td class="px-3 py-2 text-center">
                <button
                  type="button"
                  class="rounded-md border border-slate-300 px-2 py-1 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                  @click="selectedItem = item"
                >
                  View
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-4 py-3 text-xs dark:border-slate-800">
        <p class="text-slate-500 dark:text-slate-400">
          total: <span class="font-semibold text-slate-700 dark:text-slate-200">{{ total }}</span>
        </p>
        <div class="inline-flex items-center gap-2">
          <button
            type="button"
            class="rounded-md border border-slate-300 px-2 py-1 font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="loading || pagination.page <= 1"
            @click="movePage(pagination.page - 1)"
          >
            Prev
          </button>
          <span class="text-slate-600 dark:text-slate-300">page {{ pagination.page }} / {{ totalPages }}</span>
          <button
            type="button"
            class="rounded-md border border-slate-300 px-2 py-1 font-semibold text-slate-700 transition-colors hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="loading || pagination.page >= totalPages"
            @click="movePage(pagination.page + 1)"
          >
            Next
          </button>
        </div>
      </div>
    </article>

    <div
      v-if="selectedItem"
      class="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/55 p-3 md:items-center"
      @click.self="selectedItem = null"
    >
      <section class="w-full max-w-4xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-start justify-between gap-3">
          <div>
            <p class="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700 dark:text-cyan-300">History Detail</p>
            <h2 class="mt-2 text-lg font-bold text-slate-900 dark:text-slate-100">
              #{{ selectedItem.id }} {{ selectedItem.method }} {{ selectedItem.path }}
            </h2>
            <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(selectedItem.timestamp) }}</p>
          </div>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="selectedItem = null"
          >
            Close
          </button>
        </div>

        <div class="mt-4 grid grid-cols-1 gap-3 text-xs md:grid-cols-2">
          <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p class="font-semibold text-slate-700 dark:text-slate-200">Actor</p>
            <p class="mt-1 text-slate-600 dark:text-slate-300">{{ actorText(selectedItem) }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p class="font-semibold text-slate-700 dark:text-slate-200">Result</p>
            <p class="mt-1 text-slate-600 dark:text-slate-300">{{ selectedItem.result || "-" }}</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p class="font-semibold text-slate-700 dark:text-slate-200">Status / Latency</p>
            <p class="mt-1 text-slate-600 dark:text-slate-300">{{ selectedItem.status_code }} / {{ selectedItem.duration_ms }} ms</p>
          </div>
          <div class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <p class="font-semibold text-slate-700 dark:text-slate-200">IP / Agent</p>
            <p class="mt-1 break-all text-slate-600 dark:text-slate-300">{{ selectedItem.client_ip || "-" }}</p>
            <p class="mt-1 break-all text-slate-500 dark:text-slate-400">{{ selectedItem.user_agent || "-" }}</p>
          </div>
        </div>

        <div class="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
          <article class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <h3 class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">Request (masked)</h3>
            <pre class="mt-2 max-h-60 overflow-auto rounded bg-slate-900 p-3 text-[11px] text-slate-100">{{
              selectedItem.request_body_masked || "-"
            }}</pre>
          </article>
          <article class="rounded-lg border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
            <h3 class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600 dark:text-slate-300">Response (masked)</h3>
            <pre class="mt-2 max-h-60 overflow-auto rounded bg-slate-900 p-3 text-[11px] text-slate-100">{{
              selectedItem.response_body_masked || "-"
            }}</pre>
          </article>
        </div>
      </section>
    </div>
  </section>
</template>
