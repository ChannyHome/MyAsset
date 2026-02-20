<script setup lang="ts">
import { computed, onMounted, reactive, ref, watch } from "vue";

import {
  collectSnapshots,
  getAllocation,
  getNetworthSeries,
  getSummary,
  type AnalyticsAllocationOut,
  type AnalyticsNetworthSeriesOut,
  type AnalyticsSummaryV2Out,
} from "../api/analytics";
import { getHoldingsPerformance, type HoldingPerformanceOut } from "../api/holdings";
import { getLiabilities, type LiabilityOut } from "../api/liabilities";
import {
  getPortfolios,
  getPortfoliosTable,
  type PortfolioOut,
  type PortfolioTableRowOut,
} from "../api/portfolios";
import DisplayCurrencyToggle from "../components/DisplayCurrencyToggle.vue";
import AllocationDonutCard from "../components/AllocationDonutCard.vue";
import AllocationTreemapCard from "../components/AllocationTreemapCard.vue";
import NetworthTrendCard from "../components/NetworthTrendCard.vue";
import KpiSummaryCard from "../components/KpiSummaryCard.vue";
import { useDisplayCurrency } from "../composables/useDisplayCurrency";
import type { DisplayCurrency } from "../api/userSettings";
import { formatDateTimeSeoul } from "../utils/datetime";

type WidgetType =
  | "kpi_summary"
  | "donut_allocation"
  | "treemap_holdings"
  | "networth_line"
  | "dividend_bar_monthly"
  | "market_board";

type ToolboxItem = {
  type: WidgetType;
  label: string;
  description: string;
};

type CanvasWidget = {
  id: number;
  type: WidgetType;
  label: string;
};

type DashboardPreset = {
  id: string;
  name: string;
  widgets: WidgetType[];
  note: string;
};

type AllocationUiItem = {
  key: string;
  label: string;
  value: number;
  ratioPct: number;
  returnPct?: number | null;
};

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatDateTime(value: string | null | undefined): string {
  return formatDateTimeSeoul(value);
}

const toolboxSections: Array<{ title: string; items: ToolboxItem[] }> = [
  {
    title: "Core",
    items: [
      { type: "kpi_summary", label: "KPI Summary", description: "Gross / Net / Liabilities" },
      { type: "market_board", label: "Market Board", description: "Indexes and crypto strip (MVP stub)" },
    ],
  },
  {
    title: "Charts",
    items: [
      { type: "donut_allocation", label: "Donut Allocation", description: "Gross / liabilities / net allocation" },
      { type: "treemap_holdings", label: "Treemap Holdings", description: "Holdings allocation blocks" },
      { type: "networth_line", label: "Networth Line", description: "valuation_snapshots trend line" },
      { type: "dividend_bar_monthly", label: "Dividend Bar", description: "Monthly dividend (MVP stub)" },
    ],
  },
];

const dashboardPresets: DashboardPreset[] = [
  {
    id: "default-main",
    name: "Default Main",
    widgets: ["kpi_summary", "donut_allocation", "treemap_holdings", "networth_line"],
    note: "Balanced default dashboard",
  },
  {
    id: "allocation-focus",
    name: "Allocation Focus",
    widgets: ["kpi_summary", "donut_allocation", "treemap_holdings", "market_board"],
    note: "Allocation and composition focus",
  },
  {
    id: "trend-focus",
    name: "Trend Focus",
    widgets: ["kpi_summary", "networth_line", "donut_allocation"],
    note: "Snapshot trend and KPI focus",
  },
];

const widgetDictionary = new Map<WidgetType, ToolboxItem>(
  toolboxSections.flatMap((section) => section.items).map((item) => [item.type, item]),
);

const search = ref("");
const canvasWidgets = ref<CanvasWidget[]>([
  { id: 1, type: "kpi_summary", label: "KPI Summary" },
  { id: 2, type: "donut_allocation", label: "Donut Allocation" },
  { id: 3, type: "treemap_holdings", label: "Treemap Holdings" },
  { id: 4, type: "networth_line", label: "Networth Line" },
]);
const nextWidgetId = ref(5);
const activeDashboardName = ref("Default Main");

const compareModalOpen = ref(false);
const compare = reactive({
  left: "default-main",
  right: "allocation-focus",
});

const donutTarget = ref<"GROSS" | "LIABILITIES" | "NET" | "PORTFOLIOS">("GROSS");
const donutStartPosition = ref<"TOP" | "RIGHT" | "LEFT">("TOP");
const treemapTarget = ref<"GROSS" | "PORTFOLIOS">("GROSS");
const collectingSnapshot = ref(false);

const dataLoading = ref(false);
const dataError = ref("");
const summary = ref<AnalyticsSummaryV2Out | null>(null);
const holdings = ref<HoldingPerformanceOut[]>([]);
const liabilities = ref<LiabilityOut[]>([]);
const portfolios = ref<PortfolioOut[]>([]);
const portfolioStats = ref<PortfolioTableRowOut[]>([]);
const allocationGross = ref<AnalyticsAllocationOut | null>(null);
const allocationLiabilities = ref<AnalyticsAllocationOut | null>(null);
const allocationNet = ref<AnalyticsAllocationOut | null>(null);
const allocationHoldings = ref<AnalyticsAllocationOut | null>(null);
const networthSeries = ref<AnalyticsNetworthSeriesOut | null>(null);
const treemapPortfolioKey = ref("ALL");
const { displayCurrency, settingsSaving, ensureInitialized, setDisplayCurrency } = useDisplayCurrency();

const summaryDisplayCurrency = computed(() => summary.value?.display_currency ?? displayCurrency.value);

const filteredSections = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  if (!keyword) return toolboxSections;

  return toolboxSections
    .map((section) => ({
      title: section.title,
      items: section.items.filter((item) =>
        `${item.label} ${item.description} ${item.type}`.toLowerCase().includes(keyword),
      ),
    }))
    .filter((section) => section.items.length > 0);
});

const compareRows = computed(() => {
  const left = dashboardPresets.find((item) => item.id === compare.left);
  const right = dashboardPresets.find((item) => item.id === compare.right);
  if (!left || !right) return [];

  const allTypes = Array.from(new Set([...left.widgets, ...right.widgets]));
  return allTypes.map((type) => ({
    type,
    left: left.widgets.includes(type),
    right: right.widgets.includes(type),
  }));
});

const connectionStatus = computed(() => {
  if (dataLoading.value) return "loading";
  if (dataError.value) return "error";
  if (summary.value) return "connected";
  return "idle";
});

const donutData = computed(() => {
  if (donutTarget.value === "GROSS") return allocationGross.value;
  if (donutTarget.value === "LIABILITIES") return allocationLiabilities.value;
  if (donutTarget.value === "NET") return allocationNet.value;
  return allocationHoldings.value;
});

const donutItems = computed<AllocationUiItem[]>(() =>
  (donutData.value?.items ?? []).map((item) => ({
    key: item.key,
    label: item.label,
    value: toNumber(item.value),
    ratioPct: toNumber(item.ratio_pct),
    returnPct: null,
  })),
);

const portfolioReturnById = computed(() => {
  const map = new Map<number, number>();
  for (const item of portfolioStats.value) {
    const pct = toNumber(item.total_return_pct);
    if (Number.isFinite(pct)) {
      map.set(item.id, pct);
    }
  }
  return map;
});

const holdingReturnByAssetId = computed(() => {
  const agg = new Map<number, { invested: number; pnl: number; fallbackPct: number }>();
  for (const row of holdings.value) {
    const assetId = row.asset_id;
    const invested = toNumber(row.invested_amount);
    const pnl = toNumber(row.pnl_amount);
    const fallbackPct = toNumber(row.pnl_pct);
    const prev = agg.get(assetId);
    if (!prev) {
      agg.set(assetId, {
        invested: Math.max(0, invested),
        pnl,
        fallbackPct,
      });
      continue;
    }
    prev.invested += Math.max(0, invested);
    prev.pnl += pnl;
    prev.fallbackPct = Number.isFinite(prev.fallbackPct) ? prev.fallbackPct : fallbackPct;
  }
  const map = new Map<number, number>();
  for (const [assetId, value] of agg.entries()) {
    if (value.invested > 0) {
      map.set(assetId, (value.pnl / value.invested) * 100);
    } else if (Number.isFinite(value.fallbackPct)) {
      map.set(assetId, value.fallbackPct);
    }
  }
  return map;
});

const holdingsTreemapItems = computed<AllocationUiItem[]>(() =>
  (
    treemapTarget.value === "GROSS" ? allocationGross.value?.items ?? [] : allocationHoldings.value?.items ?? []
  ).map((item) => ({
    key: item.key,
    label: item.label,
    value: toNumber(item.value),
    ratioPct: toNumber(item.ratio_pct),
    returnPct:
      treemapTarget.value === "GROSS"
        ? (() => {
            const match = item.key.match(/^portfolio:(\d+)$/);
            if (!match) return null;
            return portfolioReturnById.value.get(Number(match[1])) ?? null;
          })()
        : (() => {
            const match = item.key.match(/^asset:(\d+)$/);
            if (!match) return null;
            return holdingReturnByAssetId.value.get(Number(match[1])) ?? null;
          })(),
  })),
);

const treemapPortfolioId = computed<number | undefined>(() => {
  if (treemapPortfolioKey.value === "ALL") return undefined;
  const parsed = Number(treemapPortfolioKey.value);
  return Number.isFinite(parsed) ? parsed : undefined;
});

const treemapPortfolioLabel = computed(() => {
  if (treemapPortfolioId.value == null) return "All portfolios";
  const target = portfolios.value.find((item) => item.id === treemapPortfolioId.value);
  return target ? target.name : `Portfolio #${treemapPortfolioId.value}`;
});

const trendPoints = computed(() =>
  (networthSeries.value?.points ?? []).map((point) => ({
    label: point.snapshot_date,
    gross: toNumber(point.gross_assets_total),
    liabilities: toNumber(point.liabilities_total),
    net: toNumber(point.net_assets_total),
  })),
);

const kpiGrossReturnPct = computed(() => (summary.value?.principal_return_pct == null ? null : toNumber(summary.value.principal_return_pct)));
const kpiNetReturnPct = computed(() => (summary.value?.net_assets_return_pct == null ? null : toNumber(summary.value.net_assets_return_pct)));
const kpiGrossProfitTotal = computed(() =>
  toNumber(summary.value?.principal_profit_total ?? toNumber(summary.value?.gross_assets_total) - toNumber(summary.value?.invested_principal_total)),
);
const kpiNetProfitTotal = computed(() =>
  toNumber(
    summary.value?.net_assets_profit_total ??
      toNumber(summary.value?.net_assets_total) -
        toNumber(summary.value?.debt_adjusted_principal_total ?? summary.value?.principal_minus_debt_total),
  ),
);

function buildWidgetsFromPreset(presetId: string) {
  const preset = dashboardPresets.find((item) => item.id === presetId);
  if (!preset) return;

  canvasWidgets.value = preset.widgets.map((type) => {
    const item = widgetDictionary.get(type);
    return {
      id: nextWidgetId.value++,
      type,
      label: item?.label ?? type,
    };
  });
  activeDashboardName.value = preset.name;
}

function addWidget(item: ToolboxItem) {
  canvasWidgets.value.push({
    id: nextWidgetId.value++,
    type: item.type,
    label: item.label,
  });
}

function removeWidget(id: number) {
  canvasWidgets.value = canvasWidgets.value.filter((item) => item.id !== id);
}

function onDragStart(event: DragEvent, item: ToolboxItem) {
  if (!event.dataTransfer) return;
  event.dataTransfer.setData("application/myasset-widget", item.type);
  event.dataTransfer.effectAllowed = "copy";
}

function onDropCanvas(event: DragEvent) {
  const type = event.dataTransfer?.getData("application/myasset-widget") as WidgetType;
  if (!type) return;
  const item = widgetDictionary.get(type);
  if (item) addWidget(item);
}

async function loadDashboardData() {
  dataLoading.value = true;
  dataError.value = "";
  try {
    const [
      summaryOut,
      holdingsOut,
      liabilitiesOut,
      grossAllocationOut,
      liabilitiesAllocationOut,
      netAllocationOut,
      holdingsAllocationOut,
      networthSeriesOut,
      portfoliosOut,
      portfoliosTableOut,
    ] = await Promise.all([
      getSummary({ display_currency: displayCurrency.value }),
      getHoldingsPerformance({ display_currency: displayCurrency.value }),
      getLiabilities({ display_currency: displayCurrency.value }),
      getAllocation({
        target: "GROSS",
        group_by: "PORTFOLIO",
        top_n: 10,
        display_currency: displayCurrency.value,
      }),
      getAllocation({
        target: "LIABILITIES",
        group_by: "PORTFOLIO",
        top_n: 10,
        display_currency: displayCurrency.value,
      }),
      getAllocation({
        target: "NET",
        group_by: "PORTFOLIO",
        top_n: 10,
        display_currency: displayCurrency.value,
      }),
      getAllocation({
        target: "HOLDINGS",
        group_by: "ASSET",
        top_n: 12,
        portfolio_id: treemapPortfolioId.value,
        display_currency: displayCurrency.value,
      }),
      getNetworthSeries({
        display_currency: displayCurrency.value,
        bucket: "DAY",
        limit: 90,
      }),
      getPortfolios(),
      getPortfoliosTable({
        page: 1,
        page_size: 200,
        sort_by: "id",
        sort_order: "asc",
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded: false,
      }),
    ]);

    summary.value = summaryOut;
    holdings.value = holdingsOut;
    liabilities.value = liabilitiesOut;
    allocationGross.value = grossAllocationOut;
    allocationLiabilities.value = liabilitiesAllocationOut;
    allocationNet.value = netAllocationOut;
    allocationHoldings.value = holdingsAllocationOut;
    networthSeries.value = networthSeriesOut;
    portfolios.value = portfoliosOut;
    portfolioStats.value = portfoliosTableOut.items;
    if (treemapPortfolioKey.value !== "ALL" && !portfoliosOut.some((item) => String(item.id) === treemapPortfolioKey.value)) {
      treemapPortfolioKey.value = "ALL";
    }
  } catch (error) {
    dataError.value = error instanceof Error ? error.message : "Failed to load dashboard data";
  } finally {
    dataLoading.value = false;
  }
}

async function collectSnapshotNow() {
  collectingSnapshot.value = true;
  try {
    await collectSnapshots({ display_currency: displayCurrency.value });
    await loadDashboardData();
  } catch (error) {
    dataError.value = error instanceof Error ? error.message : "Failed to collect valuation snapshot";
  } finally {
    collectingSnapshot.value = false;
  }
}

async function onChangeDisplayCurrency(value: DisplayCurrency) {
  try {
    await setDisplayCurrency(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update display currency";
    dataError.value = message;
  }
}

onMounted(async () => {
  await ensureInitialized();
  await loadDashboardData();
});

watch(
  () => displayCurrency.value,
  (next, prev) => {
    if (summary.value && prev && next !== prev) {
      void loadDashboardData();
    }
  },
);

watch(
  () => treemapPortfolioKey.value,
  (next, prev) => {
    if (!summary.value) return;
    if (next !== prev) {
      void loadDashboardData();
    }
  },
);
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Dashboard</p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard Builder</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            Allocation widgets + valuation snapshot trend are now connected to live analytics APIs.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <DisplayCurrencyToggle
            :model-value="displayCurrency"
            :disabled="dataLoading || settingsSaving"
            :loading="settingsSaving"
            @update:model-value="onChangeDisplayCurrency"
          />
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="loadDashboardData"
          >
            {{ dataLoading ? "Loading..." : "Refresh Data" }}
          </button>
          <button
            type="button"
            class="rounded-xl border border-emerald-300 px-3 py-2 text-sm font-semibold text-emerald-700 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            :disabled="collectingSnapshot"
            @click="collectSnapshotNow"
          >
            {{ collectingSnapshot ? "Collecting..." : "Collect Snapshot" }}
          </button>
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="compareModalOpen = true"
          >
            Compare
          </button>
          <button type="button" class="rounded-xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500">
            Save
          </button>
        </div>
      </div>

      <div class="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span
          class="rounded-full px-2 py-1 font-semibold"
          :class="
            connectionStatus === 'connected'
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
              : connectionStatus === 'error'
                ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
          "
        >
          Data: {{ connectionStatus }}
        </span>
        <span class="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Holdings: {{ holdings.length }}
        </span>
        <span class="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          Liabilities: {{ liabilities.length }}
        </span>
        <span class="rounded-full bg-slate-100 px-2 py-1 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
          as_of: {{ formatDateTime(summary?.as_of || null) }}
        </span>
      </div>
      <p v-if="dataError" class="mt-2 text-xs text-rose-600 dark:text-rose-300">Error: {{ dataError }}</p>
      <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">Current editing dashboard: {{ activeDashboardName }}</p>
    </header>

    <div class="grid grid-cols-1 gap-4 xl:grid-cols-[320px_minmax(0,1fr)]">
      <aside class="rounded-2xl border border-slate-700 bg-slate-950 text-slate-100 shadow-lg">
        <div class="border-b border-slate-700 px-4 py-3">
          <p class="text-sm font-semibold">Toolbox</p>
          <p class="mt-0.5 text-xs text-slate-400">Double-click or drag widgets to canvas</p>
        </div>

        <div class="border-b border-slate-700 p-3">
          <input
            v-model="search"
            type="text"
            placeholder="Search toolbox"
            class="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none ring-indigo-400 transition focus:ring-2"
          />
        </div>

        <div class="max-h-[60vh] overflow-y-auto p-3">
          <section v-for="section in filteredSections" :key="section.title" class="mb-4">
            <h2 class="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-indigo-300">{{ section.title }}</h2>
            <div class="space-y-1">
              <button
                v-for="item in section.items"
                :key="item.type"
                type="button"
                draggable="true"
                class="flex w-full items-start gap-2 rounded-lg border border-slate-700 bg-slate-900 px-2 py-2 text-left hover:border-indigo-400 hover:bg-slate-800"
                @dragstart="onDragStart($event, item)"
                @dblclick="addWidget(item)"
              >
                <span class="mt-0.5 inline-flex h-5 w-5 items-center justify-center rounded border border-slate-600 text-[10px] text-slate-300">
                  +
                </span>
                <span>
                  <span class="block text-sm font-medium text-slate-100">{{ item.label }}</span>
                  <span class="block text-xs text-slate-400">{{ item.description }}</span>
                </span>
              </button>
            </div>
          </section>
        </div>
      </aside>

      <article class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div
          class="min-h-[420px] rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-950/40"
          @dragover.prevent
          @drop.prevent="onDropCanvas"
        >
          <div v-if="canvasWidgets.length === 0" class="flex h-[360px] items-center justify-center text-sm text-slate-500 dark:text-slate-400">
            Drag widgets from toolbox or double-click to add.
          </div>

          <div v-else class="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div
              v-for="widget in canvasWidgets"
              :key="widget.id"
              class="rounded-xl border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-700 dark:bg-slate-900"
            >
              <div class="mb-3 flex items-center justify-between">
                <p class="text-sm font-semibold text-slate-900 dark:text-slate-100">{{ widget.label }}</p>
                <button
                  type="button"
                  class="rounded-md border border-rose-300 px-2 py-0.5 text-xs font-semibold text-rose-600 dark:border-rose-800 dark:text-rose-300"
                  @click="removeWidget(widget.id)"
                >
                  Remove
                </button>
              </div>

              <KpiSummaryCard
                v-if="widget.type === 'kpi_summary'"
                title="KPI Summary"
                subtitle="Gross / Liabilities / Net"
                :currency="summaryDisplayCurrency"
                :gross-assets-total="toNumber(summary?.gross_assets_total)"
                :liabilities-total="toNumber(summary?.liabilities_total)"
                :net-assets-total="toNumber(summary?.net_assets_total)"
                :invested-principal-total="toNumber(summary?.invested_principal_total)"
                :principal-minus-debt-total="
                  toNumber(summary?.debt_adjusted_principal_total ?? summary?.principal_minus_debt_total)
                "
                :gross-return-pct="kpiGrossReturnPct"
                :net-return-pct="kpiNetReturnPct"
                :gross-profit-total="kpiGrossProfitTotal"
                :net-profit-total="kpiNetProfitTotal"
                :as-of="formatDateTime(summary?.as_of || null)"
              />

              <div v-else-if="widget.type === 'donut_allocation'" class="space-y-2">
                <div class="flex flex-wrap items-center gap-2">
                  <div class="flex flex-wrap items-center gap-1">
                    <button
                      v-for="mode in ['GROSS', 'LIABILITIES', 'NET', 'PORTFOLIOS']"
                      :key="mode"
                      type="button"
                      class="rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors"
                      :class="
                        donutTarget === mode
                          ? 'border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      "
                      @click="donutTarget = mode as 'GROSS' | 'LIABILITIES' | 'NET' | 'PORTFOLIOS'"
                    >
                      {{ mode }}
                    </button>
                  </div>
                  <div class="mx-1 hidden h-4 w-px bg-slate-300 dark:bg-slate-700 sm:block" />
                  <div class="flex flex-wrap items-center gap-1">
                    <span class="mr-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Start</span>
                    <button
                      v-for="pos in ['TOP', 'RIGHT', 'LEFT']"
                      :key="`donut-start-${pos}`"
                      type="button"
                      class="rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors"
                      :class="
                        donutStartPosition === pos
                          ? 'border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      "
                      @click="donutStartPosition = pos as 'TOP' | 'RIGHT' | 'LEFT'"
                    >
                      {{ pos }}
                    </button>
                  </div>
                </div>
                <div v-if="donutTarget === 'PORTFOLIOS'" class="mb-1 flex items-center gap-2">
                  <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Portfolio</label>
                  <select
                    v-model="treemapPortfolioKey"
                    class="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="ALL">All</option>
                    <option v-for="item in portfolios" :key="`donut-${item.id}`" :value="String(item.id)">
                      {{ item.name }}
                    </option>
                  </select>
                </div>
                <AllocationDonutCard
                  :title="`Allocation | ${donutTarget}`"
                  :subtitle="
                    donutTarget === 'PORTFOLIOS'
                      ? `HOLDINGS by ${treemapPortfolioLabel}`
                      : 'Top N + Others (grouped by Portfolio)'
                  "
                  :currency="summaryDisplayCurrency"
                  :total="toNumber(donutData?.total)"
                  :items="donutItems"
                  :start-position="donutStartPosition"
                />
              </div>

              <div v-else-if="widget.type === 'treemap_holdings'">
                <div class="mb-2 flex flex-wrap items-center gap-2">
                  <div class="flex items-center gap-1">
                    <button
                      v-for="mode in ['GROSS', 'PORTFOLIOS']"
                      :key="`treemap-${mode}`"
                      type="button"
                      class="rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors"
                      :class="
                        treemapTarget === mode
                          ? 'border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300'
                          : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
                      "
                      @click="treemapTarget = mode as 'GROSS' | 'PORTFOLIOS'"
                    >
                      {{ mode }}
                    </button>
                  </div>
                  <template v-if="treemapTarget === 'PORTFOLIOS'">
                    <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Portfolio</label>
                    <select
                      v-model="treemapPortfolioKey"
                      class="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
                    >
                      <option value="ALL">All</option>
                      <option v-for="item in portfolios" :key="item.id" :value="String(item.id)">
                        {{ item.name }}
                      </option>
                    </select>
                  </template>
                </div>
                <AllocationTreemapCard
                  title="Holdings Treemap"
                  :subtitle="
                    treemapTarget === 'GROSS'
                      ? 'Target=GROSS | group_by=PORTFOLIO'
                      : `Target=HOLDINGS | group_by=ASSET | ${treemapPortfolioLabel}`
                  "
                  :currency="summaryDisplayCurrency"
                  :items="holdingsTreemapItems"
                />
              </div>

              <div v-else-if="widget.type === 'networth_line'">
                <NetworthTrendCard
                  title="Networth Line"
                  subtitle="valuation_snapshots | bucket=DAY"
                  :currency="summaryDisplayCurrency"
                  :points="trendPoints"
                />
              </div>

              <div v-else-if="widget.type === 'dividend_bar_monthly'" class="rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800">
                Dividend monthly widget is a planned MVP+ item.
              </div>

              <div v-else class="rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800">
                Market board widget is ready for market API binding.
              </div>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div
      v-if="compareModalOpen"
      class="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/55 px-4"
      @click.self="compareModalOpen = false"
    >
      <section class="w-full max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div class="mb-3 flex items-center justify-between">
          <h2 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Dashboard Compare</h2>
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-2 py-1 text-xs dark:border-slate-700"
            @click="compareModalOpen = false"
          >
            Close
          </button>
        </div>

        <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
          <label class="block text-sm">
            <span class="mb-1 block font-medium text-slate-700 dark:text-slate-200">Left</span>
            <select v-model="compare.left" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
              <option v-for="preset in dashboardPresets" :key="preset.id" :value="preset.id">{{ preset.name }}</option>
            </select>
          </label>
          <label class="block text-sm">
            <span class="mb-1 block font-medium text-slate-700 dark:text-slate-200">Right</span>
            <select v-model="compare.right" class="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950">
              <option v-for="preset in dashboardPresets" :key="preset.id" :value="preset.id">{{ preset.name }}</option>
            </select>
          </label>
        </div>

        <div class="mt-4 overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
          <table class="w-full min-w-[420px] text-left text-sm">
            <thead class="bg-slate-50 dark:bg-slate-800">
              <tr>
                <th class="px-3 py-2">Widget</th>
                <th class="px-3 py-2">Left</th>
                <th class="px-3 py-2">Right</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in compareRows" :key="row.type" class="border-t border-slate-200 dark:border-slate-700">
                <td class="px-3 py-2">{{ row.type }}</td>
                <td class="px-3 py-2">{{ row.left ? "O" : "-" }}</td>
                <td class="px-3 py-2">{{ row.right ? "O" : "-" }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-2 text-sm dark:border-slate-700"
            @click="buildWidgetsFromPreset(compare.left); compareModalOpen = false"
          >
            Apply Left
          </button>
          <button
            type="button"
            class="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-500"
            @click="buildWidgetsFromPreset(compare.right); compareModalOpen = false"
          >
            Apply Right
          </button>
        </div>
      </section>
    </div>
  </section>
</template>
