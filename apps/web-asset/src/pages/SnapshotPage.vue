<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";

import {
  getNetworthSeries,
  type NetworthTrendBucket,
  type NetworthTrendRange,
} from "../api/analytics";
import { getQuoteUpdateJobStatus, updateQuotesNow } from "../api/quotes";
import {
  exportValuationSnapshotCsv,
  getValuationSnapshot,
  getValuationSnapshots,
  type ValuationSnapshotDetailOut,
  type ValuationSnapshotListItemOut,
} from "../api/valuationSnapshots";
import AllocationDonutCard from "../components/AllocationDonutCard.vue";
import AllocationTreemapCard from "../components/AllocationTreemapCard.vue";
import KpiPortfolioSummaryCard from "../components/KpiPortfolioSummaryCard.vue";
import KpiSummaryCard from "../components/KpiSummaryCard.vue";
import NetworthTrendCard from "../components/NetworthTrendCard.vue";
import { useDisplayCurrency } from "../composables/useDisplayCurrency";
import { formatDateTimeSeoul } from "../utils/datetime";
import type { PortfolioTableRowOut } from "../api/portfolios";

type TrendPoint = { label: string; gross: number; liabilities: number; net: number };

const AMOUNT_MASK_STORAGE_KEY = "myasset:home:live-mask-amounts";
const SNAPSHOT_SELECTED_STORAGE_KEY = "myasset:snapshot:selected-valuation-id";
const SNAPSHOT_TREND_PREF_STORAGE_KEY = "myasset:snapshot:networth-trend-pref";

const { displayCurrency, ensureInitialized, setDisplayCurrency } = useDisplayCurrency();

const loading = ref(false);
const errorMessage = ref("");
const actionMessage = ref("");
const snapshots = ref<ValuationSnapshotListItemOut[]>([]);
const selectedSnapshotId = ref<number | null>(null);
const detail = ref<ValuationSnapshotDetailOut | null>(null);
const amountMaskEnabled = ref(false);
const trendRange = ref<NetworthTrendRange>("3M");
const trendBucket = ref<NetworthTrendBucket>("DAY");
const trendRangeStartDate = ref<string | null>(null);
const trendRangeEndDate = ref<string | null>(null);
const trendCustomStartDate = ref("");
const trendCustomEndDate = ref("");
const trendPoints = ref<TrendPoint[]>([]);
const trendLoading = ref(false);
const trendError = ref("");
const quoteUpdateJobId = ref("");
const quoteUpdateStatus = ref<"IDLE" | "RUNNING" | "COMPLETED" | "FAILED">("IDLE");
let quotePollTimer: ReturnType<typeof setTimeout> | null = null;

const selectedSnapshot = computed(() => snapshots.value.find((item) => item.id === selectedSnapshotId.value) ?? null);
const summary = computed(() => detail.value?.summary ?? null);
const allocationItems = computed(() =>
  (detail.value?.allocation || []).map((item) => ({
    key: item.key,
    label: item.label,
    value: toNumber(item.value),
    ratioPct: toNumber(item.ratio_pct),
  })),
);
const allocationTotal = computed(() => toNumber(summary.value?.gross_assets_total));
const portfolioRows = computed(() => (detail.value?.portfolios || []).map(mapPortfolioRow));
const topHoldings = computed(() => [...(detail.value?.holdings || [])].slice(0, 8));
const topLiabilities = computed(() => [...(detail.value?.liabilities || [])].slice(0, 8));
const appliedLabel = computed(() => {
  if (!selectedSnapshot.value) return "Latest valuation snapshot";
  return `${selectedSnapshot.value.snapshot_date} · ${formatCurrency(toNumber(selectedSnapshot.value.gross), selectedSnapshot.value.display_currency)}`;
});

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("ko-KR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value);
}

function amountStyle() {
  return amountMaskEnabled.value ? { filter: "blur(6px)" } : undefined;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return "Request failed";
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function oneMonthBeforeDateString(baseDate: string): string {
  const date = baseDate ? new Date(`${baseDate}T00:00:00`) : new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().slice(0, 10);
}

function ensureCustomDates(): void {
  const end = trendCustomEndDate.value || selectedSnapshot.value?.snapshot_date || trendRangeEndDate.value || todayDateString();
  trendCustomEndDate.value = end;
  trendCustomStartDate.value = trendCustomStartDate.value || trendRangeStartDate.value || oneMonthBeforeDateString(end);
}

function trendRangeQuery() {
  if (trendRange.value !== "CUSTOM") {
    return { range: trendRange.value, anchor_snapshot_id: selectedSnapshotId.value || undefined };
  }
  ensureCustomDates();
  return {
    range: trendRange.value,
    start_date: trendCustomStartDate.value,
    end_date: trendCustomEndDate.value,
    anchor_snapshot_id: selectedSnapshotId.value || undefined,
  };
}

function mapPortfolioRow(row: ValuationSnapshotDetailOut["portfolios"][number]): PortfolioTableRowOut {
  const id = row.portfolio_id || 0;
  return {
    id,
    owner_user_id: 0,
    name: row.portfolio_name,
    type: row.portfolio_type || "ETC",
    base_currency: row.base_currency || summary.value?.display_currency || displayCurrency.value,
    exchange_code: null,
    category: null,
    memo: null,
    is_included: true,
    is_hidden: false,
    cumulative_deposit_amount: row.net_contribution_total,
    cumulative_withdrawal_amount: 0,
    cashflow_source_type: "SNAPSHOT",
    created_at: summary.value?.as_of || "",
    updated_at: summary.value?.as_of || "",
    holding_count: 0,
    liability_count: 0,
    gross_assets_total: row.gross_assets_total,
    liabilities_total: row.liabilities_total,
    net_assets_total: row.net_assets_total,
    net_contribution_total: row.net_contribution_total,
    principal_minus_debt_total: row.debt_adjusted_principal_total,
    debt_adjusted_principal_total: row.debt_adjusted_principal_total,
    net_assets_profit_total: row.portfolio_profit_total,
    net_assets_return_pct: row.return_pct,
    total_pnl_amount: row.portfolio_profit_total,
    portfolio_profit_total: row.portfolio_profit_total,
    total_return_pct: row.return_pct,
  } as PortfolioTableRowOut;
}

function persistPrefs(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SNAPSHOT_TREND_PREF_STORAGE_KEY, JSON.stringify({ range: trendRange.value, bucket: trendBucket.value, customStartDate: trendCustomStartDate.value, customEndDate: trendCustomEndDate.value }));
}

function restorePrefs(): void {
  if (typeof window === "undefined") return;
  amountMaskEnabled.value = window.localStorage.getItem(AMOUNT_MASK_STORAGE_KEY) === "1";
  const raw = window.localStorage.getItem(SNAPSHOT_TREND_PREF_STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw);
    if (["1M", "3M", "6M", "1Y", "CUSTOM"].includes(parsed.range)) trendRange.value = parsed.range;
    if (["DAY", "WEEK", "MONTH"].includes(parsed.bucket)) trendBucket.value = parsed.bucket;
    if (typeof parsed.customStartDate === "string") trendCustomStartDate.value = parsed.customStartDate;
    if (typeof parsed.customEndDate === "string") trendCustomEndDate.value = parsed.customEndDate;
  } catch {
    // ignore malformed storage
  }
}

async function loadSnapshotList(preferredId?: number | null): Promise<void> {
  const out = await getValuationSnapshots({ display_currency: displayCurrency.value, limit: 100 });
  snapshots.value = out.items;
  const storedId = typeof window !== "undefined" ? Number(window.localStorage.getItem(SNAPSHOT_SELECTED_STORAGE_KEY) || 0) : 0;
  const nextId = preferredId || (storedId && out.items.some((item) => item.id === storedId) ? storedId : out.items[0]?.id) || null;
  selectedSnapshotId.value = nextId;
}

async function loadSelectedSnapshot(): Promise<void> {
  if (!selectedSnapshotId.value) {
    detail.value = null;
    trendPoints.value = [];
    return;
  }
  loading.value = true;
  errorMessage.value = "";
  try {
    detail.value = await getValuationSnapshot(selectedSnapshotId.value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(SNAPSHOT_SELECTED_STORAGE_KEY, String(selectedSnapshotId.value));
    }
    await loadTrend();
  } catch (error) {
    errorMessage.value = getErrorMessage(error);
  } finally {
    loading.value = false;
  }
}

async function loadTrend(): Promise<void> {
  trendLoading.value = true;
  trendError.value = "";
  try {
    const out = await getNetworthSeries({
      display_currency: displayCurrency.value,
      bucket: trendBucket.value,
      ...trendRangeQuery(),
    });
    trendRangeStartDate.value = out.range_start_date;
    trendRangeEndDate.value = out.range_end_date;
    trendPoints.value = out.points.map((point) => ({
      label: point.snapshot_date,
      gross: toNumber(point.gross_assets_total),
      liabilities: toNumber(point.liabilities_total),
      net: toNumber(point.net_assets_total),
    }));
  } catch (error) {
    trendPoints.value = [];
    trendError.value = getErrorMessage(error);
  } finally {
    trendLoading.value = false;
  }
}

async function refreshSnapshotWorkspace(): Promise<void> {
  actionMessage.value = "";
  await loadSnapshotList(selectedSnapshotId.value);
  await loadSelectedSnapshot();
}

async function backToLatest(): Promise<void> {
  selectedSnapshotId.value = snapshots.value[0]?.id ?? null;
  await loadSelectedSnapshot();
}

async function exportCsv(): Promise<void> {
  if (!selectedSnapshotId.value) return;
  const blob = await exportValuationSnapshotCsv(selectedSnapshotId.value);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `valuation-snapshot-${selectedSnapshot.value?.snapshot_date || selectedSnapshotId.value}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
}

async function applyCustomRange(): Promise<void> {
  trendRange.value = "CUSTOM";
  ensureCustomDates();
  await loadTrend();
}

async function resetCustomRange(): Promise<void> {
  trendRange.value = "3M";
  trendCustomEndDate.value = selectedSnapshot.value?.snapshot_date || todayDateString();
  trendCustomStartDate.value = oneMonthBeforeDateString(trendCustomEndDate.value);
  await loadTrend();
}

function clearQuotePoll(): void {
  if (quotePollTimer) {
    clearTimeout(quotePollTimer);
    quotePollTimer = null;
  }
}

async function pollQuoteUpdate(jobId: string): Promise<void> {
  clearQuotePoll();
  try {
    const status = await getQuoteUpdateJobStatus(jobId);
    const normalized = String(status.status || "").toUpperCase();
    if (normalized === "COMPLETED") {
      quoteUpdateStatus.value = "COMPLETED";
      actionMessage.value = `Quote update completed · updated=${status.updated_count}, skipped=${status.skipped_count}, failed=${status.failed_count}`;
      await loadSnapshotList(null);
      await backToLatest();
      return;
    }
    if (normalized === "FAILED") {
      quoteUpdateStatus.value = "FAILED";
      actionMessage.value = status.errors?.[0] || "Quote update failed";
      return;
    }
    quotePollTimer = setTimeout(() => void pollQuoteUpdate(jobId), 1500);
  } catch (error) {
    quoteUpdateStatus.value = "FAILED";
    actionMessage.value = getErrorMessage(error);
  }
}

async function updateQuotesNowFromSnapshot(): Promise<void> {
  if (quoteUpdateStatus.value === "RUNNING") return;
  quoteUpdateStatus.value = "RUNNING";
  actionMessage.value = "Quote update started. A valuation snapshot will appear after the quote job finishes.";
  try {
    const job = await updateQuotesNow();
    quoteUpdateJobId.value = job.job_id;
    await pollQuoteUpdate(job.job_id);
  } catch (error) {
    quoteUpdateStatus.value = "FAILED";
    actionMessage.value = getErrorMessage(error);
  }
}

watch(amountMaskEnabled, (value) => {
  if (typeof window !== "undefined") window.localStorage.setItem(AMOUNT_MASK_STORAGE_KEY, value ? "1" : "0");
});

watch([trendRange, trendBucket, trendCustomStartDate, trendCustomEndDate], persistPrefs);

watch(displayCurrency, async () => {
  await loadSnapshotList(selectedSnapshotId.value);
  await loadSelectedSnapshot();
});

onMounted(async () => {
  restorePrefs();
  await ensureInitialized();
  await loadSnapshotList(null);
  await loadSelectedSnapshot();
});

onBeforeUnmount(() => clearQuotePoll());
</script>

<template>
  <main class="mx-auto max-w-[1600px] space-y-6 px-4 py-6 text-slate-900 dark:text-slate-100 sm:px-6 lg:px-8">
    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.24em] text-emerald-500">Snapshot</p>
          <h1 class="mt-1 text-2xl font-bold">Snapshot Workspace</h1>
          <p class="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Valuation snapshot 기반의 고정 시점 분석 화면입니다. Refresh는 조회만 하고, 새 snapshot은 Update Quotes Now가 완료될 때만 생성됩니다.
          </p>
        </div>
        <div class="flex items-center gap-2 rounded-xl border border-slate-200 p-1 text-sm font-semibold dark:border-slate-700">
          <button type="button" class="rounded-lg px-3 py-1.5" :class="displayCurrency === 'KRW' ? 'bg-emerald-500 text-white' : 'text-slate-500'" @click="setDisplayCurrency('KRW')">KRW</button>
          <button type="button" class="rounded-lg px-3 py-1.5" :class="displayCurrency === 'USD' ? 'bg-emerald-500 text-white' : 'text-slate-500'" @click="setDisplayCurrency('USD')">USD</button>
        </div>
      </div>
    </section>

    <section class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 class="text-lg font-semibold">Snapshot Control</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Load, freeze, refresh, and export valuation snapshots.</p>
          <p class="mt-3 text-sm"><span class="text-slate-500 dark:text-slate-400">Applied:</span> {{ appliedLabel }}</p>
          <p v-if="summary" class="text-xs text-slate-500 dark:text-slate-400">as_of: {{ formatDateTimeSeoul(summary.as_of) }}</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="rounded-xl border border-emerald-500 bg-emerald-500 px-4 py-2 text-sm font-semibold text-white disabled:opacity-50" :disabled="quoteUpdateStatus === 'RUNNING'" @click="updateQuotesNowFromSnapshot">
            {{ quoteUpdateStatus === 'RUNNING' ? 'Updating Quotes...' : 'Update Quotes Now' }}
          </button>
          <select v-model.number="selectedSnapshotId" class="rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-950" @change="loadSelectedSnapshot">
            <option v-for="item in snapshots" :key="item.id" :value="item.id">
              {{ item.snapshot_date }} · {{ formatCurrency(toNumber(item.gross), item.display_currency) }}
            </option>
          </select>
          <button type="button" class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700" @click="backToLatest">Back to Latest</button>
          <button type="button" class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700" :disabled="!selectedSnapshotId" @click="exportCsv">Export CSV</button>
          <button type="button" class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700" @click="refreshSnapshotWorkspace">Refresh</button>
          <button type="button" class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold dark:border-slate-700" @click="amountMaskEnabled = !amountMaskEnabled">
            Amount Blur {{ amountMaskEnabled ? 'ON' : 'OFF' }}
          </button>
        </div>
      </div>
      <p v-if="actionMessage" class="mt-3 rounded-xl bg-slate-100 px-3 py-2 text-sm text-slate-600 dark:bg-slate-800 dark:text-slate-300">{{ actionMessage }}</p>
      <p v-if="errorMessage" class="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">{{ errorMessage }}</p>
    </section>

    <section v-if="loading" class="rounded-2xl border border-slate-200 bg-white p-5 text-sm text-slate-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
      Loading valuation snapshot...
    </section>

    <template v-if="summary && detail">
      <div class="grid gap-4 xl:grid-cols-2">
        <KpiSummaryCard
          :currency="summary.display_currency"
          :gross-assets-total="toNumber(summary.gross_assets_total)"
          :liabilities-total="toNumber(summary.liabilities_total)"
          :net-assets-total="toNumber(summary.net_assets_total)"
          :invested-principal-total="toNumber(summary.invested_principal_total)"
          :principal-minus-debt-total="toNumber(summary.debt_adjusted_principal_total)"
          :gross-return-pct="summary.principal_return_pct == null ? null : toNumber(summary.principal_return_pct)"
          :net-return-pct="summary.net_assets_return_pct == null ? null : toNumber(summary.net_assets_return_pct)"
          :gross-profit-total="toNumber(summary.principal_profit_total)"
          :net-profit-total="toNumber(summary.net_assets_profit_total)"
          :as-of="summary.as_of"
          title="KPI Summary"
          subtitle="Selected valuation snapshot"
          :mask-amounts="amountMaskEnabled"
          storage-key="myasset:snapshot:kpi-summary:expanded"
        />
        <KpiPortfolioSummaryCard
          :currency="summary.display_currency"
          :portfolios="portfolioRows"
          title="KPI Portfolios"
          subtitle="Portfolio rows from selected valuation snapshot"
          :mask-amounts="amountMaskEnabled"
          storage-key="myasset:snapshot:kpi-portfolios:expanded"
        />
      </div>

      <NetworthTrendCard
        title="Networth Trend"
        :subtitle="`valuation_snapshots | range=${trendRange} | bucket=${trendBucket}`"
        storage-key="myasset:snapshot:networth-trend:expanded"
        :currency="displayCurrency"
        :points="trendPoints"
        :mask-amounts="amountMaskEnabled"
        :loading="trendLoading"
        :error="trendError"
        :show-mode-toggle="false"
        :show-refresh-control="true"
        :range="trendRange"
        :bucket="trendBucket"
        :range-start-date="trendRangeStartDate"
        :range-end-date="trendRangeEndDate"
        :custom-start-date="trendCustomStartDate"
        :custom-end-date="trendCustomEndDate"
        @update:range="trendRange = $event"
        @update:bucket="trendBucket = $event"
        @update:custom-start-date="trendCustomStartDate = $event"
        @update:custom-end-date="trendCustomEndDate = $event"
        @apply-custom-range="applyCustomRange"
        @reset-custom-range="resetCustomRange"
        @refresh="loadTrend"
      />

      <div class="grid gap-4 xl:grid-cols-2">
        <AllocationDonutCard
          title="Allocation | GROSS"
          subtitle="Portfolio composition at selected snapshot"
          :currency="summary.display_currency"
          :total="allocationTotal"
          :items="allocationItems"
          :mask-amounts="amountMaskEnabled"
          storage-key="myasset:snapshot:allocation-donut:expanded"
        />
        <AllocationTreemapCard
          title="Treemap | GROSS"
          subtitle="Portfolio area by selected snapshot value"
          :currency="summary.display_currency"
          :items="allocationItems"
          :mask-amounts="amountMaskEnabled"
          storage-key="myasset:snapshot:allocation-treemap:expanded"
        />
      </div>

      <section class="grid gap-4 xl:grid-cols-2">
        <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-lg font-semibold">Top Holdings</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Holding rows from selected valuation snapshot.</p>
          <div class="mt-3 divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <div v-for="row in topHoldings" :key="`${row.portfolio_id}-${row.asset_id}-${row.asset_name}`" class="grid grid-cols-[1fr_auto] gap-3 py-2">
              <div>
                <p class="font-semibold">{{ row.asset_name }} <span v-if="row.symbol" class="text-slate-400">({{ row.symbol }})</span></p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ row.portfolio_name || '-' }} · {{ row.asset_class }}</p>
              </div>
              <div class="text-right" :style="amountStyle()">
                <p class="font-semibold">{{ formatCurrency(toNumber(row.evaluated_amount), summary.display_currency) }}</p>
                <p class="text-xs" :class="toNumber(row.profit_total) >= 0 ? 'text-emerald-400' : 'text-rose-400'">{{ formatCurrency(toNumber(row.profit_total), summary.display_currency) }}</p>
              </div>
            </div>
          </div>
        </article>
        <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 class="text-lg font-semibold">Top Liabilities</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Liability rows from selected valuation snapshot.</p>
          <div class="mt-3 divide-y divide-slate-200 text-sm dark:divide-slate-800">
            <div v-for="row in topLiabilities" :key="`${row.portfolio_id}-${row.liability_id}-${row.liability_name}`" class="grid grid-cols-[1fr_auto] gap-3 py-2">
              <div>
                <p class="font-semibold">{{ row.liability_name }}</p>
                <p class="text-xs text-slate-500 dark:text-slate-400">{{ row.portfolio_name || '-' }} · {{ row.liability_type || '-' }}</p>
              </div>
              <p class="font-semibold" :style="amountStyle()">{{ formatCurrency(toNumber(row.balance_total), summary.display_currency) }}</p>
            </div>
          </div>
        </article>
      </section>
    </template>
  </main>
</template>
