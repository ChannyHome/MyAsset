<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";

import {
  getAllocation,
  getNetworthSeries,
  getSummary,
  type AnalyticsAllocationOut,
  type AnalyticsNetworthSeriesOut,
  type AnalyticsSummaryV2Out,
} from "../api/analytics";
import KpiBreakdownCards from "../components/KpiBreakdownCards.vue";
import DisplayCurrencyToggle from "../components/DisplayCurrencyToggle.vue";
import AllocationDonutCard from "../components/AllocationDonutCard.vue";
import AllocationTreemapCard from "../components/AllocationTreemapCard.vue";
import NetworthTrendCard from "../components/NetworthTrendCard.vue";
import KpiSummaryCard from "../components/KpiSummaryCard.vue";
import { getHoldingsPerformance, type HoldingPerformanceOut } from "../api/holdings";
import { getLiabilitiesTable, type LiabilityTableRowOut } from "../api/liabilities";
import { getPortfoliosTable, type PortfolioTableRowOut } from "../api/portfolios";
import { getReleaseNotes, type ReleaseNoteOut } from "../api/releaseNotes";
import { useDisplayCurrency } from "../composables/useDisplayCurrency";
import type { DisplayCurrency } from "../api/userSettings";
import type { ReleaseNoteItem } from "../data/releaseNotes";

type AllocationUiItem = {
  key: string;
  label: string;
  value: number;
  ratioPct: number;
  returnPct?: number | null;
};

const LIVE_MASK_STORAGE_KEY = "myasset:home:live-mask-amounts";

type Html2CanvasFn = (
  element: HTMLElement,
  options?: {
    backgroundColor?: string | null;
    scale?: number;
    useCORS?: boolean;
    foreignObjectRendering?: boolean;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    windowWidth?: number;
    windowHeight?: number;
    scrollX?: number;
    scrollY?: number;
    onclone?: (clonedDocument: Document) => void;
  },
) => Promise<HTMLCanvasElement>;

declare global {
  interface Window {
    html2canvas?: Html2CanvasFn;
  }
}

function toNumber(value: string | number | null | undefined): number {
  if (value == null) {
    return 0;
  }
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

function formatSignedCurrency(value: number, currency = "KRW"): string {
  const absText = formatCurrency(Math.abs(value), currency);
  if (value > 0) return `+${absText}`;
  if (value < 0) return `-${absText}`;
  return absText;
}

function formatOptionalCurrency(value: string | number | null | undefined, currency = "KRW"): string {
  if (value == null) {
    return "-";
  }
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num)) {
    return "-";
  }
  return formatCurrency(num, currency);
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) {
    return "-";
  }
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatDateTime(value: string | null | undefined): string {
  if (!value) {
    return "-";
  }
  const dt = new Date(value);
  if (Number.isNaN(dt.getTime())) {
    return value;
  }
  return dt.toLocaleString("ko-KR");
}

const loading = ref(false);
const errorMessage = ref("");
const summary = ref<AnalyticsSummaryV2Out | null>(null);
const holdings = ref<HoldingPerformanceOut[]>([]);
const liabilities = ref<LiabilityTableRowOut[]>([]);
const portfolios = ref<PortfolioTableRowOut[]>([]);
const releaseNoteItems = ref<ReleaseNoteItem[]>([]);
const liveDashboardExpanded = ref(false);
const reportPanelExpanded = ref(false);
const releaseNotesExpanded = ref(false);
const exportingImage = ref(false);
const liveDonutTarget = ref<"GROSS" | "LIABILITIES" | "NET" | "PORTFOLIOS">("GROSS");
const liveDonutStartPosition = ref<"TOP" | "RIGHT" | "LEFT">("TOP");
const liveTreemapTarget = ref<"GROSS" | "PORTFOLIOS">("GROSS");
const liveMaskAmounts = ref(false);
const livePortfolioKey = ref("ALL");
const liveDashboardRef = ref<HTMLElement | null>(null);
const allocationGross = ref<AnalyticsAllocationOut | null>(null);
const allocationLiabilities = ref<AnalyticsAllocationOut | null>(null);
const allocationNet = ref<AnalyticsAllocationOut | null>(null);
const allocationHoldings = ref<AnalyticsAllocationOut | null>(null);
const networthSeries = ref<AnalyticsNetworthSeriesOut | null>(null);
const { displayCurrency, settingsSaving, ensureInitialized, setDisplayCurrency } = useDisplayCurrency();

const summaryDisplayCurrency = computed(() => summary.value?.display_currency ?? displayCurrency.value);
const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
const investedPrincipalTotal = computed(() => toNumber(summary.value?.invested_principal_total));
const principalMinusDebtTotal = computed(() => toNumber(summary.value?.principal_minus_debt_total));
const netAssetsReturnPct = computed(() => toNumber(summary.value?.net_assets_return_pct ?? null));
const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
const principalProfitTotal = computed(() => toNumber(summary.value?.principal_profit_total ?? grossAssetsTotal.value - investedPrincipalTotal.value));
const netAssetsProfitTotal = computed(() => toNumber(summary.value?.net_assets_profit_total ?? netAssetsTotal.value - principalMinusDebtTotal.value));
const asOf = computed(() => formatDateTime(summary.value?.as_of));

const livePortfolioId = computed<number | undefined>(() => {
  if (livePortfolioKey.value === "ALL") return undefined;
  const parsed = Number(livePortfolioKey.value);
  return Number.isFinite(parsed) ? parsed : undefined;
});

const livePortfolioLabel = computed(() => {
  if (livePortfolioId.value == null) return "All portfolios";
  const target = portfolios.value.find((item) => item.id === livePortfolioId.value);
  return target ? target.name : `Portfolio #${livePortfolioId.value}`;
});

const donutData = computed(() => {
  if (liveDonutTarget.value === "GROSS") return allocationGross.value;
  if (liveDonutTarget.value === "LIABILITIES") return allocationLiabilities.value;
  if (liveDonutTarget.value === "NET") return allocationNet.value;
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
  for (const item of portfolios.value) {
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

const liveTreemapItems = computed<AllocationUiItem[]>(() =>
  (
    liveTreemapTarget.value === "GROSS" ? allocationGross.value?.items ?? [] : allocationHoldings.value?.items ?? []
  ).map((item) => ({
    key: item.key,
    label: item.label,
    value: toNumber(item.value),
    ratioPct: toNumber(item.ratio_pct),
    returnPct:
      liveTreemapTarget.value === "GROSS"
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
  toNumber(summary.value?.net_assets_profit_total ?? toNumber(summary.value?.net_assets_total) - toNumber(summary.value?.principal_minus_debt_total)),
);

const topHoldings = computed(() =>
  [...holdings.value]
    .sort((a, b) => toNumber(b.evaluated_amount) - toNumber(a.evaluated_amount))
    .slice(0, 6),
);

const topPortfolios = computed(() =>
  [...portfolios.value]
    .sort((a, b) => toNumber(b.gross_assets_total) - toNumber(a.gross_assets_total))
    .slice(0, 6),
);

const topLiabilities = computed(() =>
  [...liabilities.value]
    .sort((a, b) => toNumber(b.outstanding_balance) - toNumber(a.outstanding_balance))
    .slice(0, 6),
);

const topPnlAssets = computed(() =>
  [...holdings.value]
    .filter((item) => item.pnl_pct != null)
    .sort((a, b) => toNumber(b.pnl_pct) - toNumber(a.pnl_pct))
    .slice(0, 3),
);

function mapReleaseNotes(notes: ReleaseNoteOut[]): ReleaseNoteItem[] {
  return notes.map((note) => ({
    id: String(note.id),
    releasedAt: note.released_at,
    title: note.title,
    summary: note.summary,
  }));
}

async function loadHomeData() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const [
      summaryOut,
      holdingsOut,
      liabilitiesOut,
      portfoliosOut,
      grossAllocationOut,
      liabilitiesAllocationOut,
      netAllocationOut,
      holdingsAllocationOut,
      networthSeriesOut,
    ] = await Promise.all([
      getSummary({ display_currency: displayCurrency.value }),
      getHoldingsPerformance({ display_currency: displayCurrency.value }),
      getLiabilitiesTable({
        page: 1,
        page_size: 200,
        sort_by: "outstanding_balance",
        sort_order: "desc",
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded: false,
      }),
      getPortfoliosTable({
        page: 1,
        page_size: 200,
        sort_by: "gross_assets_total",
        sort_order: "desc",
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded: false,
      }),
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
        top_n: 10,
        portfolio_id: livePortfolioId.value,
        display_currency: displayCurrency.value,
      }),
      getNetworthSeries({
        display_currency: displayCurrency.value,
        bucket: "DAY",
        limit: 90,
      }),
    ]);

    summary.value = summaryOut;
    holdings.value = holdingsOut;
    liabilities.value = liabilitiesOut.items;
    portfolios.value = portfoliosOut.items;
    allocationGross.value = grossAllocationOut;
    allocationLiabilities.value = liabilitiesAllocationOut;
    allocationNet.value = netAllocationOut;
    allocationHoldings.value = holdingsAllocationOut;
    networthSeries.value = networthSeriesOut;
    if (livePortfolioKey.value !== "ALL" && !portfoliosOut.items.some((item) => String(item.id) === livePortfolioKey.value)) {
      livePortfolioKey.value = "ALL";
    }
    try {
      const noteRows = await getReleaseNotes({ limit: 20 });
      const mapped = mapReleaseNotes(noteRows);
      releaseNoteItems.value = mapped;
    } catch {
      releaseNoteItems.value = [];
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to load dashboard data: ${message}`;
  } finally {
    loading.value = false;
  }
}

async function onChangeDisplayCurrency(value: DisplayCurrency) {
  try {
    await setDisplayCurrency(value);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to update display currency: ${message}`;
  }
}

function toggleLiveDashboard() {
  liveDashboardExpanded.value = !liveDashboardExpanded.value;
}

function toggleReportPanel() {
  reportPanelExpanded.value = !reportPanelExpanded.value;
}

function toggleReleaseNotesPanel() {
  releaseNotesExpanded.value = !releaseNotesExpanded.value;
}

function printLiveDashboard() {
  window.print();
}

function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  if (canvas.width === 0 || canvas.height === 0) {
    return true;
  }
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return true;
  }
  const sampleW = Math.min(canvas.width, 128);
  const sampleH = Math.min(canvas.height, 128);
  const pixels = ctx.getImageData(0, 0, sampleW, sampleH).data;
  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] !== 0) {
      return false;
    }
  }
  return true;
}

function drawDonutForExport(documentRef: Document): void {
  const donutNodes = documentRef.querySelectorAll<HTMLElement>("[data-export-donut='1']");
  donutNodes.forEach((node) => {
    const rawStops = node.dataset.donutStops ?? "";
    const startAngleDeg = Number(node.dataset.donutStartAngle ?? "0");
    const segments = rawStops
      .split("|")
      .map((token) => token.trim())
      .filter((token) => token.length > 0)
      .map((token) => {
        const [ratioText, color] = token.split(":");
        const ratio = Number(ratioText);
        return {
          ratioPct: Number.isFinite(ratio) ? Math.max(0, Math.min(100, ratio)) : 0,
          color: color || "#334155",
        };
      })
      .filter((item) => item.ratioPct > 0);

    const rect = node.getBoundingClientRect();
    const width = Math.max(1, Math.floor(node.clientWidth || rect.width || 1));
    const height = Math.max(1, Math.floor(node.clientHeight || rect.height || 1));
    const size = Math.max(1, Math.min(width, height));
    const canvas = documentRef.createElement("canvas");
    canvas.width = size * 2;
    canvas.height = size * 2;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.display = "block";
    canvas.style.borderRadius = "9999px";
    const ctx = canvas.getContext("2d");
    if (!ctx) {
      return;
    }
    ctx.scale(2, 2);
    const center = size / 2;
    const outerRadius = center;
    const innerRadius = center * 0.5;
    let cursor = ((startAngleDeg - 90) * Math.PI) / 180;
    if (segments.length === 0) {
      ctx.beginPath();
      ctx.arc(center, center, outerRadius, 0, Math.PI * 2);
      ctx.fillStyle = "#334155";
      ctx.fill();
    } else {
      for (const segment of segments) {
        const angle = (segment.ratioPct / 100) * Math.PI * 2;
        const next = cursor + angle;
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, outerRadius, cursor, next);
        ctx.closePath();
        ctx.fillStyle = segment.color;
        ctx.fill();
        cursor = next;
      }
    }
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(center, center, innerRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalCompositeOperation = "source-over";

    node.style.background = "none";
    node.replaceChildren(canvas);
  });
}

function applyAmountMaskForExport(documentRef: Document): void {
  const maskedNodes = documentRef.querySelectorAll<HTMLElement>("[style*='blur(6px)']");

  const calcMaskWidthCh = (text: string): number => {
    const compactLength = text.replace(/\s+/g, "").length;
    if (compactLength <= 0) return 6;
    return Math.max(6, Math.min(24, Math.round(compactLength * 0.65)));
  };

  maskedNodes.forEach((node) => {
    const original = node.textContent ?? "";
    const maskWidth = calcMaskWidthCh(original);
    const maskBlock = documentRef.createElement("span");
    maskBlock.style.display = "inline-block";
    maskBlock.style.width = `${maskWidth}ch`;
    maskBlock.style.height = "1em";
    maskBlock.style.verticalAlign = "middle";
    maskBlock.style.borderRadius = "0.35em";
    maskBlock.style.background = "linear-gradient(180deg, rgba(148,163,184,0.62), rgba(100,116,139,0.58))";
    maskBlock.style.boxShadow = "inset 0 0 0 1px rgba(15,23,42,0.22), 0 1px 6px rgba(15,23,42,0.22)";
    maskBlock.style.filter = "blur(0.35px)";
    maskBlock.setAttribute("aria-hidden", "true");

    node.replaceChildren(maskBlock);
    node.style.filter = "none";
    node.style.webkitFilter = "none";
  });
}

async function ensureHtml2Canvas(): Promise<Html2CanvasFn> {
  if (window.html2canvas) {
    return window.html2canvas;
  }
  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-myasset-html2canvas="1"]');
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener("error", () => reject(new Error("Failed to load html2canvas")), { once: true });
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/html2canvas-pro@1.5.8/dist/html2canvas-pro.min.js";
    script.async = true;
    script.dataset.myassetHtml2canvas = "1";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load html2canvas"));
    document.head.appendChild(script);
  });
  if (!window.html2canvas) {
    throw new Error("html2canvas not available");
  }
  return window.html2canvas;
}

async function exportLiveDashboardImage() {
  if (!liveDashboardRef.value) return;
  exportingImage.value = true;
  try {
    await nextTick();
    const target = liveDashboardRef.value;
    const rect = target.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      throw new Error("Live dashboard panel is not visible.");
    }

    const html2canvas = await ensureHtml2Canvas();
    const baseOptions = {
      backgroundColor: "#020617",
      scale: 2,
      useCORS: true,
      windowWidth: Math.max(document.documentElement.clientWidth, Math.ceil(rect.width)),
      windowHeight: Math.max(document.documentElement.clientHeight, Math.ceil(rect.height)),
    };

    const onClone = (clonedDocument: Document) => {
      drawDonutForExport(clonedDocument);
      if (liveMaskAmounts.value) {
        applyAmountMaskForExport(clonedDocument);
      }
    };

    let canvas: HTMLCanvasElement;
    try {
      canvas = await html2canvas(target, {
        ...baseOptions,
        foreignObjectRendering: false,
        onclone: onClone,
      });
    } catch {
      canvas = await html2canvas(target, {
        ...baseOptions,
        foreignObjectRendering: true,
        onclone: onClone,
      });
    }

    if (isCanvasBlank(canvas)) {
      throw new Error("Captured image is blank. Retry after keeping panel fully visible.");
    }

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `myasset-live-dashboard-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
    link.click();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to export image: ${message}. Try Print as fallback.`;
  } finally {
    exportingImage.value = false;
  }
}

onMounted(async () => {
  if (typeof window !== "undefined") {
    const saved = window.localStorage.getItem(LIVE_MASK_STORAGE_KEY);
    if (saved === "1" || saved === "true") {
      liveMaskAmounts.value = true;
    } else if (saved === "0" || saved === "false") {
      liveMaskAmounts.value = false;
    }
  }
  await ensureInitialized();
  await loadHomeData();
});

watch(
  () => displayCurrency.value,
  (next, prev) => {
    if (summary.value && prev && next !== prev) {
      void loadHomeData();
    }
  },
);

watch(
  () => livePortfolioKey.value,
  (next, prev) => {
    if (!summary.value) return;
    if (next !== prev) {
      void loadHomeData();
    }
  },
);

watch(
  () => liveMaskAmounts.value,
  (next) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LIVE_MASK_STORAGE_KEY, next ? "1" : "0");
  },
);
</script>

<template>
  <section class="space-y-4">
    <header class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-700 dark:text-emerald-300">Home</p>
          <h1 class="mt-2 text-2xl font-bold text-slate-900 dark:text-slate-100">Live Dashboard</h1>
          <p class="mt-1 text-sm text-slate-600 dark:text-slate-300">
            This page now uses real API data from summary, holdings performance, and liabilities.
          </p>
        </div>
        <div class="flex items-center gap-2">
          <DisplayCurrencyToggle
            :model-value="displayCurrency"
            :disabled="loading || settingsSaving"
            :loading="settingsSaving"
            @update:model-value="onChangeDisplayCurrency"
          />
          <button
            type="button"
            class="rounded-xl border px-3 py-2 text-sm font-semibold transition-colors"
            :class="
              liveMaskAmounts
                ? 'border-amber-400 bg-amber-100 text-amber-700 hover:bg-amber-200 dark:border-amber-700 dark:bg-amber-900/30 dark:text-amber-300 dark:hover:bg-amber-900/50'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'
            "
            @click="liveMaskAmounts = !liveMaskAmounts"
          >
            Amount Blur {{ liveMaskAmounts ? "ON" : "OFF" }}
          </button>
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="loading"
            @click="loadHomeData"
          >
            {{ loading ? "Loading..." : "Refresh" }}
          </button>
        </div>
      </div>
      <p class="mt-3 text-xs text-slate-500 dark:text-slate-400">as_of: {{ asOf }}</p>
    </header>

    <article
      v-if="errorMessage"
      class="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200"
    >
      <p>{{ errorMessage }}</p>
      <button
        type="button"
        class="mt-2 rounded-lg border border-rose-300 px-3 py-1 text-xs font-semibold transition-colors hover:bg-rose-100 dark:border-rose-800 dark:hover:bg-rose-900/60"
        @click="loadHomeData"
      >
        Retry
      </button>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Live Dashboard Panel</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Default is collapsed. Expand to preview dashboard widgets and export image.
          </p>
        </div>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="toggleLiveDashboard"
        >
          {{ liveDashboardExpanded ? "Collapse" : "Expand" }}
        </button>
      </div>

      <div v-if="liveDashboardExpanded" class="mt-4 space-y-3">
        <div class="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/50">
          <div class="flex items-center gap-1">
            <span class="mr-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Donut</span>
            <button
              v-for="mode in ['GROSS', 'LIABILITIES', 'NET', 'PORTFOLIOS']"
              :key="`home-donut-${mode}`"
              type="button"
              class="rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors"
              :class="
                liveDonutTarget === mode
                  ? 'border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              "
              @click="liveDonutTarget = mode as 'GROSS' | 'LIABILITIES' | 'NET' | 'PORTFOLIOS'"
            >
              {{ mode }}
            </button>
          </div>
          <div class="mx-1 hidden h-5 w-px bg-slate-300 dark:bg-slate-700 sm:block" />
          <div class="flex items-center gap-1">
            <span class="mr-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Start</span>
            <button
              v-for="pos in ['TOP', 'RIGHT', 'LEFT']"
              :key="`home-donut-start-${pos}`"
              type="button"
              class="rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors"
              :class="
                liveDonutStartPosition === pos
                  ? 'border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              "
              @click="liveDonutStartPosition = pos as 'TOP' | 'RIGHT' | 'LEFT'"
            >
              {{ pos }}
            </button>
          </div>

          <div v-if="liveDonutTarget === 'PORTFOLIOS'" class="flex items-center gap-2">
            <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Portfolio</label>
            <select
              v-model="livePortfolioKey"
              class="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="ALL">All</option>
              <option v-for="item in portfolios" :key="`home-donut-portfolio-${item.id}`" :value="String(item.id)">
                {{ item.name }}
              </option>
            </select>
          </div>

          <div class="mx-2 h-5 w-px bg-slate-300 dark:bg-slate-700" />

          <div class="flex items-center gap-1">
            <span class="mr-1 text-[11px] font-semibold text-slate-500 dark:text-slate-400">Treemap</span>
            <button
              v-for="mode in ['GROSS', 'PORTFOLIOS']"
              :key="`home-treemap-${mode}`"
              type="button"
              class="rounded-md border px-2 py-1 text-[11px] font-semibold transition-colors"
              :class="
                liveTreemapTarget === mode
                  ? 'border-indigo-500 bg-indigo-100 text-indigo-700 dark:border-indigo-400 dark:bg-indigo-500/20 dark:text-indigo-300'
                  : 'border-slate-300 text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800'
              "
              @click="liveTreemapTarget = mode as 'GROSS' | 'PORTFOLIOS'"
            >
              {{ mode }}
            </button>
          </div>

          <div v-if="liveTreemapTarget === 'PORTFOLIOS'" class="flex items-center gap-2">
            <label class="text-[11px] font-semibold text-slate-600 dark:text-slate-300">Portfolio</label>
            <select
              v-model="livePortfolioKey"
              class="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
            >
              <option value="ALL">All</option>
              <option v-for="item in portfolios" :key="`home-treemap-portfolio-${item.id}`" :value="String(item.id)">
                {{ item.name }}
              </option>
            </select>
          </div>

          <div class="ml-auto flex items-center gap-2">
            <button
              type="button"
              class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
              @click="printLiveDashboard"
            >
              Print
            </button>
            <button
              type="button"
              class="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-60 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
              :disabled="exportingImage || loading"
              @click="exportLiveDashboardImage"
            >
              {{ exportingImage ? "Exporting..." : "Export PNG" }}
            </button>
          </div>
        </div>

        <div ref="liveDashboardRef" class="grid grid-cols-1 gap-3 xl:grid-cols-2">
          <div class="xl:col-span-2">
            <KpiSummaryCard
              title="KPI Summary"
              subtitle="Included in print/snapshot"
              :currency="summaryDisplayCurrency"
              :gross-assets-total="grossAssetsTotal"
              :liabilities-total="liabilitiesTotal"
              :net-assets-total="netAssetsTotal"
              :invested-principal-total="investedPrincipalTotal"
              :principal-minus-debt-total="principalMinusDebtTotal"
              :gross-return-pct="kpiGrossReturnPct"
              :net-return-pct="kpiNetReturnPct"
              :gross-profit-total="kpiGrossProfitTotal"
              :net-profit-total="kpiNetProfitTotal"
              :as-of="asOf"
              :mask-amounts="liveMaskAmounts"
            />
          </div>

          <AllocationDonutCard
            :title="`Allocation | ${liveDonutTarget}`"
            :subtitle="
              liveDonutTarget === 'PORTFOLIOS'
                ? `HOLDINGS by ${livePortfolioLabel}`
                : 'Top N + Others (grouped by Portfolio)'
            "
            :currency="summaryDisplayCurrency"
            :total="toNumber(donutData?.total)"
            :items="donutItems"
            :start-position="liveDonutStartPosition"
            :mask-amounts="liveMaskAmounts"
            :loading="loading"
            :error="errorMessage"
          />

          <AllocationTreemapCard
            title="Treemap Holdings"
            :subtitle="
              liveTreemapTarget === 'GROSS'
                ? 'Target=GROSS | group_by=PORTFOLIO | color=return'
                : `Target=HOLDINGS | group_by=ASSET | ${livePortfolioLabel} | color=return`
            "
            :currency="summaryDisplayCurrency"
            :items="liveTreemapItems"
            :mask-amounts="liveMaskAmounts"
            :loading="loading"
            :error="errorMessage"
          />

          <div class="xl:col-span-2">
            <NetworthTrendCard
              title="Networth Trend"
              subtitle="valuation_snapshots | bucket=DAY"
              :currency="summaryDisplayCurrency"
              :points="trendPoints"
              :mask-amounts="liveMaskAmounts"
              :loading="loading"
              :error="errorMessage"
            />
          </div>
        </div>
      </div>

      <p v-else class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Collapsed. Click <span class="font-semibold">Expand</span> to preview and export.
      </p>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Report Panel</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Gross/Liabilities/Net plus Top cards grouped together.
          </p>
        </div>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="toggleReportPanel"
        >
          {{ reportPanelExpanded ? "Collapse" : "Expand" }}
        </button>
      </div>

      <div v-if="reportPanelExpanded" class="mt-4 space-y-4">
        <KpiBreakdownCards
          :display-currency="summaryDisplayCurrency"
          :gross-assets-total="grossAssetsTotal"
          :liabilities-total="liabilitiesTotal"
          :net-assets-total="netAssetsTotal"
          :invested-principal-total="investedPrincipalTotal"
          :principal-minus-debt-total="principalMinusDebtTotal"
          :principal-return-pct="principalReturnPct"
          :net-assets-return-pct="netAssetsReturnPct"
          :principal-profit-total="principalProfitTotal"
          :net-assets-profit-total="netAssetsProfitTotal"
          :portfolios="portfolios"
          :liabilities="liabilities"
          :mask-amounts="liveMaskAmounts"
        />

        <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div class="mb-4 flex items-center justify-between">
            <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Top Portfolios</h2>
            <span class="text-xs text-slate-500 dark:text-slate-400">By gross assets</span>
          </div>
          <div
            v-if="topPortfolios.length === 0"
            class="rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
          >
            No portfolio data.
          </div>
          <ul v-else class="grid grid-cols-1 gap-2 md:grid-cols-2 xl:grid-cols-3">
            <li
              v-for="item in topPortfolios"
              :key="item.id"
              class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
            >
              <div class="flex items-center justify-between gap-2">
                <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {{ item.name }}
                  <span class="text-xs font-normal text-slate-500">{{ item.type }}</span>
                </p>
                <p
                  class="text-xs font-semibold"
                  :class="item.total_return_pct == null ? 'text-slate-500' : toNumber(item.total_return_pct) >= 0 ? 'text-emerald-600' : 'text-rose-500'"
                >
                  {{ formatPercent(item.total_return_pct == null ? null : toNumber(item.total_return_pct)) }}
                </p>
              </div>
              <div class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                  {{ formatCurrency(toNumber(item.gross_assets_total), item.base_currency || summaryDisplayCurrency) }}
                </span>
                /
                <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                  {{ formatCurrency(toNumber(item.cumulative_deposit_amount), item.base_currency || summaryDisplayCurrency) }}
                </span>
              </div>
              <div class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Net
                <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                  {{ formatCurrency(toNumber(item.net_assets_total), item.base_currency || summaryDisplayCurrency) }}
                </span>
                ·
                PnL
                <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                  {{ formatSignedCurrency(toNumber(item.total_pnl_amount), item.base_currency || summaryDisplayCurrency) }}
                </span>
              </div>
            </li>
          </ul>
        </article>

        <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Top Holdings</h2>
              <span class="text-xs text-slate-500 dark:text-slate-400">By evaluated amount</span>
            </div>
            <div
              v-if="topHoldings.length === 0"
              class="rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
            >
              No holdings data.
            </div>
            <ul v-else class="space-y-2">
              <li
                v-for="item in topHoldings"
                :key="item.holding_id"
                class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
              >
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">
                    {{ item.asset_name }}
                    <span class="text-xs font-normal text-slate-500">{{ item.asset_symbol || "-" }}</span>
                  </p>
                  <p class="text-xs font-semibold" :class="toNumber(item.pnl_pct) >= 0 ? 'text-emerald-600' : 'text-rose-500'">
                    {{ formatPercent(toNumber(item.pnl_pct)) }}
                  </p>
                </div>
                <div class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                    {{ formatOptionalCurrency(item.current_price, item.current_price_currency || summaryDisplayCurrency) }}
                  </span>
                  /
                  <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                    {{ formatOptionalCurrency(item.avg_price, item.current_price_currency || summaryDisplayCurrency) }}
                  </span>
                </div>
              </li>
            </ul>
          </article>

          <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div class="mb-4 flex items-center justify-between">
              <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Top Liabilities</h2>
              <span class="text-xs text-slate-500 dark:text-slate-400">By outstanding balance</span>
            </div>
            <div
              v-if="topLiabilities.length === 0"
              class="rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
            >
              No liabilities data.
            </div>
            <ul v-else class="space-y-2">
              <li
                v-for="item in topLiabilities"
                :key="item.id"
                class="rounded-xl border border-slate-200 p-3 dark:border-slate-700"
              >
                <div class="flex items-center justify-between gap-2">
                  <p class="truncate text-sm font-semibold text-slate-900 dark:text-slate-100">{{ item.name }}</p>
                  <p class="text-xs text-slate-500">{{ item.liability_type }}</p>
                </div>
                <div class="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                    {{ formatCurrency(toNumber(item.outstanding_balance), item.currency || summaryDisplayCurrency) }}
                  </span>
                </div>
              </li>
            </ul>
          </article>
        </div>
      </div>

      <p v-else class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Collapsed. Click <span class="font-semibold">Expand</span> to preview report cards.
      </p>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Quick Insight</h2>
      <ul class="mt-3 space-y-2 text-sm text-slate-700 dark:text-slate-200">
        <li class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          Scope: {{ summary?.scope_type || "-" }} (users: {{ summary?.user_count || 0 }})
        </li>
        <li class="rounded-lg bg-slate-50 px-3 py-2 dark:bg-slate-800">
          Best PnL assets: {{ topPnlAssets.map((item) => item.asset_symbol || item.asset_name).join(", ") || "-" }}
        </li>
      </ul>
    </article>

    <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Release Notes</h2>
          <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">Latest first</p>
        </div>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="toggleReleaseNotesPanel"
        >
          {{ releaseNotesExpanded ? "Collapse" : "Expand" }}
        </button>
      </div>

      <div v-if="releaseNotesExpanded" class="mt-4">
        <div
          v-if="releaseNoteItems.length === 0"
          class="rounded-xl bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-300"
        >
          No release notes yet.
        </div>
        <ul v-else class="space-y-2">
          <li
            v-for="note in releaseNoteItems"
            :key="note.id"
            class="rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800"
          >
            <p class="text-xs text-slate-500 dark:text-slate-400">{{ formatDateTime(note.releasedAt) }}</p>
            <p class="mt-1 text-sm font-semibold text-slate-900 dark:text-slate-100">{{ note.title }}</p>
            <p class="mt-1 text-xs text-slate-600 dark:text-slate-300">{{ note.summary }}</p>
          </li>
        </ul>
      </div>

      <p v-else class="mt-3 text-xs text-slate-500 dark:text-slate-400">
        Collapsed. Click <span class="font-semibold">Expand</span> to view release notes.
      </p>
    </article>
  </section>
</template>

