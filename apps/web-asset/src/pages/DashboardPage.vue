<script setup lang="ts">
import { computed, onMounted, reactive, ref } from "vue";

import { getSummary, type AnalyticsSummaryV2Out } from "../api/analytics";
import { getHoldingsPerformance, type HoldingPerformanceOut } from "../api/holdings";
import { getLiabilities, type LiabilityOut } from "../api/liabilities";

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

function toNumber(value: string | number | null | undefined): number {
  if (value == null) return 0;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : 0;
}

function formatCurrency(value: number, currency = "KRW"): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) return "-";
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) return value;
  return dt.toLocaleString("ko-KR");
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
      { type: "donut_allocation", label: "Donut Allocation", description: "Top holdings allocation" },
      { type: "treemap_holdings", label: "Treemap Holdings", description: "Size=value, color=PnL%" },
      { type: "networth_line", label: "Networth Line", description: "Snapshot trend (MVP stub)" },
      { type: "dividend_bar_monthly", label: "Dividend Bar", description: "Monthly dividend (MVP stub)" },
    ],
  },
];

const dashboardPresets: DashboardPreset[] = [
  {
    id: "default-main",
    name: "Default Main",
    widgets: ["kpi_summary", "donut_allocation", "treemap_holdings", "market_board"],
    note: "Balanced default dashboard",
  },
  {
    id: "income-focus",
    name: "Income Focus",
    widgets: ["kpi_summary", "dividend_bar_monthly", "networth_line", "market_board"],
    note: "Cashflow and trend focus",
  },
  {
    id: "risk-focus",
    name: "Risk Focus",
    widgets: ["kpi_summary", "treemap_holdings", "networth_line"],
    note: "Volatility/weight monitor",
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
]);
const nextWidgetId = ref(4);
const activeDashboardName = ref("Default Main");

const compareModalOpen = ref(false);
const compare = reactive({
  left: "default-main",
  right: "income-focus",
});

const dataLoading = ref(false);
const dataError = ref("");
const summary = ref<AnalyticsSummaryV2Out | null>(null);
const holdings = ref<HoldingPerformanceOut[]>([]);
const liabilities = ref<LiabilityOut[]>([]);

const displayCurrency = computed(() => summary.value?.display_currency ?? "KRW");
const topHoldings = computed(() =>
  [...holdings.value].sort((a, b) => toNumber(b.evaluated_amount) - toNumber(a.evaluated_amount)),
);
const top4 = computed(() => topHoldings.value.slice(0, 4));

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
    const [summaryOut, holdingsOut, liabilitiesOut] = await Promise.all([
      getSummary(),
      getHoldingsPerformance(),
      getLiabilities(),
    ]);
    summary.value = summaryOut;
    holdings.value = holdingsOut;
    liabilities.value = liabilitiesOut;
  } catch (error) {
    dataError.value = error instanceof Error ? error.message : "Failed to load dashboard data";
  } finally {
    dataLoading.value = false;
  }
}

onMounted(loadDashboardData);
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-700 dark:text-indigo-300">Dashboard</p>
          <h1 class="mt-1 text-2xl font-bold text-slate-900 dark:text-slate-100">Dashboard Builder</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            WPF toolbox style editing with live asset data connection.
          </p>
        </div>
        <div class="flex gap-2">
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="loadDashboardData"
          >
            {{ dataLoading ? "Loading..." : "Refresh Data" }}
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

              <div v-if="widget.type === 'kpi_summary'" class="space-y-1 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800">
                <p>Gross: {{ formatCurrency(toNumber(summary?.gross_assets_total), displayCurrency) }}</p>
                <p>Liabilities: {{ formatCurrency(toNumber(summary?.liabilities_total), displayCurrency) }}</p>
                <p>Net: {{ formatCurrency(toNumber(summary?.net_assets_total), displayCurrency) }}</p>
              </div>

              <div v-else-if="widget.type === 'donut_allocation'" class="space-y-1 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800">
                <p class="font-semibold">Top allocation</p>
                <p v-for="item in top4" :key="item.holding_id">
                  {{ item.asset_symbol || item.asset_name }}:
                  {{ formatPercent((toNumber(item.evaluated_amount) / Math.max(toNumber(summary?.net_assets_total), 1)) * 100) }}
                </p>
                <p v-if="top4.length === 0">No data</p>
              </div>

              <div v-else-if="widget.type === 'treemap_holdings'" class="space-y-1 rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800">
                <p class="font-semibold">Top holdings (value / PnL)</p>
                <p v-for="item in top4" :key="item.holding_id">
                  {{ item.asset_symbol || item.asset_name }} / {{ formatPercent(toNumber(item.pnl_pct)) }}
                </p>
                <p v-if="top4.length === 0">No data</p>
              </div>

              <div v-else-if="widget.type === 'networth_line'" class="rounded-lg bg-slate-100 p-3 text-xs dark:bg-slate-800">
                Networth snapshot line will be connected to valuation snapshots API.
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
