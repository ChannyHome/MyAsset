<script setup lang="ts">
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";

import { getAllocation, getNetworthSeries, getSummary, type AnalyticsSummaryV2Out } from "../api/analytics";
import { getHoldingsTable, type HoldingTableRowOut, type HoldingTableSortBy } from "../api/holdings";
import { getLiabilitiesTable, type LiabilityTableRowOut, type LiabilityTableSortBy } from "../api/liabilities";
import { getPortfoliosTable, type PortfolioTableRowOut, type PortfolioTableSortBy } from "../api/portfolios";
import {
  captureSnapshot,
  deleteSnapshots,
  exportSnapshotCsv,
  getSnapshotAllocation,
  getSnapshotHoldingsTable,
  getSnapshotLiabilitiesTable,
  getSnapshotPortfoliosTable,
  getSnapshots,
  getSnapshotSeries,
  getSnapshotSummary,
  previewSnapshotCsv,
  type SnapshotCsvPreviewOut,
  type SnapshotHoldingRowOut,
  type SnapshotHoldingSortBy,
  type SnapshotLiabilityRowOut,
  type SnapshotLiabilitySortBy,
  type SnapshotListItemOut,
  type SnapshotPortfolioRowOut,
  type SnapshotPortfolioSortBy,
  type SnapshotSummaryOut,
} from "../api/snapshots";
import type { SortOrder } from "../api/assets";
import AllocationDonutCard from "../components/AllocationDonutCard.vue";
import AllocationTreemapCard from "../components/AllocationTreemapCard.vue";
import KpiPortfolioSummaryCard from "../components/KpiPortfolioSummaryCard.vue";
import KpiSummaryCard from "../components/KpiSummaryCard.vue";
import { useDisplayCurrency } from "../composables/useDisplayCurrency";
import { formatDateTimeSeoul } from "../utils/datetime";

type DisplayCurrency = "KRW" | "USD";
type SourceType = "LIVE" | "SNAPSHOT" | "CSV_PREVIEW";
type KpiMode = "SUMMARY" | "PORTFOLIOS";
type TrendMode = "SUMMARY" | "PORTFOLIO_RETURN";

type SummaryVm = {
  gross: number;
  liabilities: number;
  net: number;
  invested: number;
  debtAdjusted: number;
  asOf: string | null;
};

type PortfolioVm = {
  id: number;
  portfolioId: number | null;
  name: string;
  type: string | null;
  current: number;
  invested: number;
  profit: number;
  returnPct: number | null;
  liabilities: number;
  net: number;
  debtAdjusted: number;
};

type HoldingVm = {
  id: number;
  portfolioId: number | null;
  portfolioName: string;
  assetName: string;
  symbol: string | null;
  price: number;
  priceCurrency: string;
  avgCost: number;
  avgCostCurrency: string;
  evaluated: number;
  costBasis: number;
  profit: number;
  returnPct: number | null;
};

type LiabilityVm = {
  id: number;
  portfolioId: number | null;
  portfolioName: string;
  name: string;
  type: string;
  balance: number;
  balanceCurrency: string;
};

type AllocationVm = {
  key: string;
  label: string;
  value: number;
  ratioPct: number;
  returnPct?: number | null;
};

type TrendPoint = { snapshotId: number; label: string; gross: number; liabilities: number; net: number };
type TrendLine = { key: string; label: string; values: Array<{ snapshotId: number; value: number }> };

const AMOUNT_MASK_STORAGE_KEY = "myasset:home:live-mask-amounts";

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
  if (value == null) return 0;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toNullable(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatCurrency(value: number, currency: string): string {
  return new Intl.NumberFormat("ko-KR", {
    style: "currency",
    currency: (currency || "KRW").toUpperCase(),
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatPercent(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return `${value >= 0 ? "+" : ""}${value.toFixed(2)}%`;
}

function formatDateTime(value: string | null | undefined): string {
  return formatDateTimeSeoul(value);
}

function toLivePortfolioSortBy(
  sortBy: SnapshotPortfolioSortBy | PortfolioTableSortBy,
): PortfolioTableSortBy {
  switch (sortBy) {
    case "portfolio":
      return "name";
    case "current":
      return "gross_assets_total";
    case "invested_principal":
      return "net_contribution_total";
    case "portfolio_profit":
      return "portfolio_profit_total";
    case "return":
      return "total_return_pct";
    default:
      return sortBy as PortfolioTableSortBy;
  }
}

function toLiveHoldingSortBy(sortBy: SnapshotHoldingSortBy | HoldingTableSortBy): HoldingTableSortBy {
  switch (sortBy) {
    case "portfolio":
      return "portfolio_name";
    case "asset":
      return "asset_name";
    case "price":
      return "current_price";
    case "avg_cost":
      return "avg_price";
    case "evaluated":
      return "evaluated_amount";
    case "cost_basis":
      return "invested_amount";
    case "profit":
      return "evaluated_amount";
    case "return":
      return "pnl_pct";
    case "symbol":
      return "asset_symbol";
    default:
      return sortBy as HoldingTableSortBy;
  }
}

function toLiveLiabilitySortBy(
  sortBy: SnapshotLiabilitySortBy | LiabilityTableSortBy,
): LiabilityTableSortBy {
  switch (sortBy) {
    case "portfolio":
      return "portfolio_name";
    case "liability":
      return "name";
    case "balance":
      return "outstanding_balance";
    case "type":
      return "liability_type";
    default:
      return sortBy as LiabilityTableSortBy;
  }
}

function toCsvIds(values: number[]): string {
  return values.filter((item) => Number.isFinite(item) && item > 0).join(",");
}

function downloadBlob(blob: Blob, fileName: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function printSnapshotDashboard(): void {
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
  const maskedNodes = documentRef.querySelectorAll<HTMLElement>(".amount-mask");

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

async function exportSnapshotDashboardImage(): Promise<void> {
  if (!snapshotDashboardRef.value) return;
  exportingDashboardImage.value = true;
  try {
    await nextTick();
    const target = snapshotDashboardRef.value;
    const rect = target.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) {
      throw new Error("Snapshot dashboard panel is not visible.");
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
      if (amountMaskEnabled.value) {
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
    link.download = `myasset-snapshot-dashboard-${new Date().toISOString().replace(/[:.]/g, "-")}.png`;
    link.click();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to export image: ${message}. Try Print as fallback.`;
  } finally {
    exportingDashboardImage.value = false;
  }
}

function topNWithOthers(items: AllocationVm[], topN = 10): AllocationVm[] {
  if (items.length <= topN) return items;
  const sorted = [...items].sort((a, b) => b.value - a.value);
  const head = sorted.slice(0, topN);
  const tail = sorted.slice(topN);
  const others = tail.reduce(
    (acc, item) => ({
      value: acc.value + item.value,
      ratio: acc.ratio + item.ratioPct,
    }),
    { value: 0, ratio: 0 },
  );
  if (others.value <= 0) return head;
  return [...head, { key: "others", label: "Others", value: others.value, ratioPct: others.ratio }];
}

const { displayCurrency, ensureInitialized, settingsSaving, setDisplayCurrency } = useDisplayCurrency();

const sourceType = ref<SourceType>("LIVE");
const appliedSnapshotId = ref<number | null>(null);
const appliedCsvPreview = ref<SnapshotCsvPreviewOut | null>(null);

const loading = ref(false);
const errorMessage = ref("");
const toastMessage = ref("");
const captureLoading = ref(false);
const dashboardExpanded = ref(true);
const amountMaskEnabled = ref(false);
const exportingDashboardImage = ref(false);
const snapshotDashboardRef = ref<HTMLElement | null>(null);

const kpiMode = ref<KpiMode>("SUMMARY");
const kpiPortfolioKey = ref("ALL");
const donutTarget = ref<"GROSS" | "LIABILITIES" | "NET" | "HOLDINGS">("GROSS");
const donutStart = ref<"TOP" | "RIGHT" | "LEFT">("TOP");
const treemapTarget = ref<"GROSS" | "HOLDINGS">("GROSS");
const holdingsPortfolioKey = ref("ALL");

const summaryVm = ref<SummaryVm | null>(null);
const snapshotSummary = ref<SnapshotSummaryOut | null>(null);

const portfolioRows = ref<PortfolioVm[]>([]);
const holdingRows = ref<HoldingVm[]>([]);
const liabilityRows = ref<LiabilityVm[]>([]);

const portfolioTable = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  sortBy: "current" as SnapshotPortfolioSortBy | PortfolioTableSortBy,
  sortOrder: "desc" as SortOrder,
  loading: false,
});
const holdingTable = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  sortBy: "evaluated" as SnapshotHoldingSortBy | HoldingTableSortBy,
  sortOrder: "desc" as SortOrder,
  q: "",
  loading: false,
});
const liabilityTable = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  sortBy: "balance" as SnapshotLiabilitySortBy | LiabilityTableSortBy,
  sortOrder: "desc" as SortOrder,
  q: "",
  loading: false,
});

const tablePortfolioKey = ref("ALL");
const tablePortfolioId = computed<number | undefined>(() => {
  if (tablePortfolioKey.value === "ALL") return undefined;
  const parsed = Number(tablePortfolioKey.value);
  return Number.isFinite(parsed) ? parsed : undefined;
});

const donutItems = ref<AllocationVm[]>([]);
const donutTotal = ref(0);
const donutLoading = ref(false);
const donutError = ref("");
const treemapItems = ref<AllocationVm[]>([]);
const treemapLoading = ref(false);
const treemapError = ref("");

const trendMode = ref<TrendMode>("SUMMARY");
const trendSettingsOpen = ref(false);
const trendVisibility = reactive({ gross: true, liabilities: true, net: true });
const trendSnapshotIds = ref<number[]>([]);
const trendPortfolioKey = ref("ALL");
const trendHoldingIds = ref<number[]>([]);
const trendPoints = ref<TrendPoint[]>([]);
const trendPortfolioLines = ref<TrendLine[]>([]);
const trendHoldingLines = ref<TrendLine[]>([]);
const trendLoading = ref(false);
const trendError = ref("");
const trendInspect = ref("");

const snapshotCatalog = ref<SnapshotListItemOut[]>([]);

const modalOpen = ref(false);
const modalRows = ref<SnapshotListItemOut[]>([]);
const modalLoading = ref(false);
const modalTotal = ref(0);
const modalSelectedId = ref<number | null>(null);
const modalCheckedIds = ref<number[]>([]);
const modalDeleteConfirmOpen = ref(false);
const modalDeleteTargetIds = ref<number[]>([]);
const modalDeleting = ref(false);
const modalQuery = reactive({
  page: 1,
  pageSize: 10,
  q: "",
  from: "",
  to: "",
  sortBy: "captured_at" as "captured_at" | "gross" | "net" | "liabilities",
  sortOrder: "desc" as SortOrder,
});
const csvPreviewLoading = ref(false);
const csvPreviewError = ref("");
const csvPreviewData = ref<SnapshotCsvPreviewOut | null>(null);
const csvFileName = ref("");

const modalAllChecked = computed(
  () =>
    modalRows.value.length > 0 &&
    modalRows.value.every((row) => modalCheckedIds.value.includes(row.id)),
);

const appliedLabel = computed(() => {
  if (sourceType.value === "LIVE") return "Applied: Live data";
  if (sourceType.value === "SNAPSHOT") {
    return `Applied: Snapshot #${appliedSnapshotId.value ?? "-"} @ ${formatDateTime(snapshotSummary.value?.captured_at ?? null)}`;
  }
  return `Applied: CSV Preview (${appliedCsvPreview.value?.file_name || "-"})`;
});

const summaryCurrency = computed<DisplayCurrency>(() => (displayCurrency.value === "USD" ? "USD" : "KRW"));
const kpiGrossProfit = computed(() => (summaryVm.value ? summaryVm.value.gross - summaryVm.value.invested : 0));
const kpiNetProfit = computed(() => (summaryVm.value ? summaryVm.value.net - summaryVm.value.debtAdjusted : 0));
const kpiGrossReturn = computed(() =>
  summaryVm.value && summaryVm.value.invested > 0
    ? ((summaryVm.value.gross - summaryVm.value.invested) / summaryVm.value.invested) * 100
    : null,
);
const kpiNetReturn = computed(() =>
  summaryVm.value && summaryVm.value.debtAdjusted > 0
    ? ((summaryVm.value.net - summaryVm.value.debtAdjusted) / summaryVm.value.debtAdjusted) * 100
    : null,
);
const asOfText = computed(() => formatDateTime(summaryVm.value?.asOf ?? null));

const portfolioOptions = computed(() => {
  const map = new Map<string, string>();
  for (const row of portfolioRows.value) {
    const key = row.portfolioId == null ? "UNASSIGNED" : String(row.portfolioId);
    if (!map.has(key)) map.set(key, row.name);
  }
  return Array.from(map.entries()).map(([key, label]) => ({ key, label }));
});

const kpiPortfolioRows = computed(() => {
  if (kpiPortfolioKey.value === "ALL") return portfolioRows.value;
  const pid = Number(kpiPortfolioKey.value);
  if (!Number.isFinite(pid)) return portfolioRows.value;
  return portfolioRows.value.filter((item) => item.portfolioId === pid);
});
const kpiPortfolioCardRows = computed<PortfolioTableRowOut[]>(() =>
  kpiPortfolioRows.value.map((item) => ({
    id: item.id,
    owner_user_id: 0,
    name: item.name,
    type: item.type || "ETC",
    base_currency: summaryCurrency.value,
    exchange_code: null,
    category: null,
    memo: null,
    is_included: true,
    is_hidden: false,
    cumulative_deposit_amount: item.invested,
    cumulative_withdrawal_amount: 0,
    cashflow_source_type: "MANUAL",
    created_at: "",
    updated_at: "",
    holding_count: 0,
    liability_count: 0,
    gross_assets_total: item.current,
    liabilities_total: item.liabilities,
    net_assets_total: item.net,
    net_contribution_total: item.invested,
    principal_minus_debt_total: item.debtAdjusted,
    debt_adjusted_principal_total: item.debtAdjusted,
    net_assets_profit_total: item.net - item.debtAdjusted,
    net_assets_return_pct: item.debtAdjusted > 0 ? ((item.net - item.debtAdjusted) / item.debtAdjusted) * 100 : null,
    total_pnl_amount: item.profit,
    portfolio_profit_total: item.profit,
    total_return_pct: item.returnPct,
  })),
);

const trendSnapshotOptions = computed(() =>
  snapshotCatalog.value.map((row) => ({
    id: row.id,
    label: `${formatDateTime(row.captured_at)} · ${row.name || `Snapshot #${row.id}`}`,
  })),
);
const trendPortfolioOptions = computed(() =>
  portfolioOptions.value.filter((item) => item.key !== "UNASSIGNED"),
);
const maskedClass = computed(() => (amountMaskEnabled.value ? "amount-mask" : ""));

function loadMaskFromStorage(): void {
  if (typeof window === "undefined") return;
  amountMaskEnabled.value = window.localStorage.getItem(AMOUNT_MASK_STORAGE_KEY) === "1";
}

function saveMaskToStorage(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AMOUNT_MASK_STORAGE_KEY, amountMaskEnabled.value ? "1" : "0");
}

function mapSummaryFromLive(row: AnalyticsSummaryV2Out): SummaryVm {
  return {
    gross: toNumber(row.gross_assets_total),
    liabilities: toNumber(row.liabilities_total),
    net: toNumber(row.net_assets_total),
    invested: toNumber(row.net_contribution_total),
    debtAdjusted: toNumber(row.debt_adjusted_principal_total ?? row.principal_minus_debt_total),
    asOf: row.as_of,
  };
}

function mapSummaryFromSnapshot(row: SnapshotSummaryOut, currency: DisplayCurrency): SummaryVm {
  return {
    gross: currency === "USD" ? toNumber(row.gross_assets_usd) : toNumber(row.gross_assets_krw),
    liabilities: currency === "USD" ? toNumber(row.liabilities_usd) : toNumber(row.liabilities_krw),
    net: currency === "USD" ? toNumber(row.net_assets_usd) : toNumber(row.net_assets_krw),
    invested: currency === "USD" ? toNumber(row.invested_principal_usd) : toNumber(row.invested_principal_krw),
    debtAdjusted:
      currency === "USD" ? toNumber(row.debt_adjusted_principal_usd) : toNumber(row.debt_adjusted_principal_krw),
    asOf: row.as_of,
  };
}

function mapPortfolioFromLive(row: PortfolioTableRowOut): PortfolioVm {
  return {
    id: row.id,
    portfolioId: row.id,
    name: row.name,
    type: row.type,
    current: toNumber(row.gross_assets_total),
    invested: toNumber(row.net_contribution_total),
    profit: toNumber(row.portfolio_profit_total ?? row.total_pnl_amount),
    returnPct: toNullable(row.total_return_pct),
    liabilities: toNumber(row.liabilities_total),
    net: toNumber(row.net_assets_total),
    debtAdjusted: toNumber(row.debt_adjusted_principal_total ?? row.principal_minus_debt_total),
  };
}

function mapPortfolioFromSnapshot(row: SnapshotPortfolioRowOut): PortfolioVm {
  return {
    id: row.id,
    portfolioId: row.portfolio_id,
    name: row.portfolio_name,
    type: row.portfolio_type,
    current: toNumber(row.current),
    invested: toNumber(row.invested_principal),
    profit: toNumber(row.portfolio_profit),
    returnPct: toNullable(row.return_pct),
    liabilities: toNumber(row.liabilities),
    net: toNumber(row.net_assets),
    debtAdjusted: toNumber(row.debt_adjusted_principal),
  };
}

function mapHoldingFromLive(row: HoldingTableRowOut): HoldingVm {
  return {
    id: row.id,
    portfolioId: row.portfolio_id,
    portfolioName: row.portfolio_name || "Unassigned",
    assetName: row.asset_name,
    symbol: row.asset_symbol,
    price: toNumber(row.current_price),
    priceCurrency: row.current_price_currency || "KRW",
    avgCost: toNumber(row.avg_cost),
    avgCostCurrency: row.avg_cost_currency || "KRW",
    evaluated: toNumber(row.evaluated_amount),
    costBasis: toNumber(row.cost_basis_total),
    profit: toNumber(row.pnl_amount),
    returnPct: toNullable(row.pnl_pct),
  };
}

function mapHoldingFromSnapshot(row: SnapshotHoldingRowOut): HoldingVm {
  return {
    id: row.id,
    portfolioId: row.portfolio_id,
    portfolioName: row.portfolio_name,
    assetName: row.asset_name,
    symbol: row.symbol,
    price: toNumber(row.price),
    priceCurrency: row.price_currency,
    avgCost: toNumber(row.avg_cost),
    avgCostCurrency: row.avg_cost_currency,
    evaluated: toNumber(row.evaluated),
    costBasis: toNumber(row.cost_basis),
    profit: toNumber(row.profit),
    returnPct: toNullable(row.return_pct),
  };
}

function mapLiabilityFromLive(row: LiabilityTableRowOut): LiabilityVm {
  return {
    id: row.id,
    portfolioId: row.portfolio_id,
    portfolioName: row.portfolio_name || "Unassigned",
    name: row.name,
    type: row.liability_type,
    balance: toNumber(row.outstanding_balance),
    balanceCurrency: row.currency || "KRW",
  };
}

function mapLiabilityFromSnapshot(row: SnapshotLiabilityRowOut): LiabilityVm {
  return {
    id: row.id,
    portfolioId: row.portfolio_id,
    portfolioName: row.portfolio_name,
    name: row.liability_name,
    type: row.liability_type,
    balance: toNumber(row.balance),
    balanceCurrency: row.balance_currency,
  };
}

function localAllocation(
  target: "GROSS" | "LIABILITIES" | "NET" | "HOLDINGS",
  portfolioFilter?: number,
): { total: number; items: AllocationVm[] } {
  const map = new Map<string, AllocationVm>();
  if (target === "GROSS" || target === "HOLDINGS") {
    const rows = holdingRows.value.filter((item) =>
      target === "HOLDINGS" && portfolioFilter != null ? item.portfolioId === portfolioFilter : true,
    );
    for (const row of rows) {
      const key = target === "HOLDINGS" ? `${row.assetName}:${row.symbol || "-"}` : `portfolio:${row.portfolioId ?? 0}`;
      const label = target === "HOLDINGS" ? `${row.assetName}${row.symbol ? ` (${row.symbol})` : ""}` : row.portfolioName;
      const prev = map.get(key);
      if (prev) {
        prev.value += row.evaluated;
      } else {
        map.set(key, {
          key,
          label,
          value: row.evaluated,
          ratioPct: 0,
          returnPct: target === "HOLDINGS" ? row.returnPct : null,
        });
      }
    }
  } else if (target === "LIABILITIES") {
    for (const row of liabilityRows.value) {
      const key = `portfolio:${row.portfolioId ?? 0}`;
      const prev = map.get(key);
      if (prev) {
        prev.value += row.balance;
      } else {
        map.set(key, { key, label: row.portfolioName, value: row.balance, ratioPct: 0 });
      }
    }
  } else {
    for (const row of portfolioRows.value) {
      const key = `portfolio:${row.portfolioId ?? 0}`;
      map.set(key, { key, label: row.name, value: row.net, ratioPct: 0, returnPct: row.returnPct });
    }
  }
  const items = Array.from(map.values()).sort((a, b) => b.value - a.value);
  const total = items.reduce((sum, item) => sum + item.value, 0);
  for (const item of items) {
    item.ratioPct = total > 0 ? (item.value / total) * 100 : 0;
  }
  return { total, items: topNWithOthers(items, 10) };
}

async function loadSummary(): Promise<void> {
  if (sourceType.value === "LIVE") {
    const out = await getSummary({ display_currency: displayCurrency.value });
    summaryVm.value = mapSummaryFromLive(out);
    snapshotSummary.value = null;
    return;
  }
  if (sourceType.value === "SNAPSHOT") {
    if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
    const out = await getSnapshotSummary(appliedSnapshotId.value);
    snapshotSummary.value = out;
    summaryVm.value = mapSummaryFromSnapshot(out, summaryCurrency.value);
    return;
  }
  if (!appliedCsvPreview.value) throw new Error("CSV preview not applied");
  snapshotSummary.value = appliedCsvPreview.value.summary;
  summaryVm.value = mapSummaryFromSnapshot(appliedCsvPreview.value.summary, summaryCurrency.value);
}

function applyCsvPortfolioTable(): void {
  if (!appliedCsvPreview.value) {
    portfolioRows.value = [];
    portfolioTable.total = 0;
    return;
  }
  let rows = appliedCsvPreview.value.portfolio_rows.map(mapPortfolioFromSnapshot);
  if (tablePortfolioId.value != null) {
    rows = rows.filter((item) => item.portfolioId === tablePortfolioId.value);
  }
  const key = portfolioTable.sortBy;
  rows.sort((a, b) => {
    if (key === "portfolio") return a.name.localeCompare(b.name, "ko");
    if (key === "invested_principal") return a.invested - b.invested;
    if (key === "portfolio_profit") return a.profit - b.profit;
    if (key === "return") return (a.returnPct ?? -999999) - (b.returnPct ?? -999999);
    return a.current - b.current;
  });
  if (portfolioTable.sortOrder === "desc") rows.reverse();
  portfolioTable.total = rows.length;
  const start = (portfolioTable.page - 1) * portfolioTable.pageSize;
  portfolioRows.value = rows.slice(start, start + portfolioTable.pageSize);
}

function applyCsvHoldingTable(): void {
  if (!appliedCsvPreview.value) {
    holdingRows.value = [];
    holdingTable.total = 0;
    return;
  }
  let rows = appliedCsvPreview.value.holding_rows.map(mapHoldingFromSnapshot);
  if (tablePortfolioId.value != null) {
    rows = rows.filter((item) => item.portfolioId === tablePortfolioId.value);
  }
  const q = holdingTable.q.trim().toLowerCase();
  if (q) {
    rows = rows.filter((item) => `${item.portfolioName} ${item.assetName} ${item.symbol || ""}`.toLowerCase().includes(q));
  }
  const key = holdingTable.sortBy;
  rows.sort((a, b) => {
    if (key === "portfolio" || key === "portfolio_name") return a.portfolioName.localeCompare(b.portfolioName, "ko");
    if (key === "asset" || key === "asset_name") return a.assetName.localeCompare(b.assetName, "ko");
    if (key === "price" || key === "current_price") return a.price - b.price;
    if (key === "avg_cost" || key === "avg_price") return a.avgCost - b.avgCost;
    if (key === "cost_basis" || key === "invested_amount") return a.costBasis - b.costBasis;
    if (key === "profit") return a.profit - b.profit;
    if (key === "return" || key === "pnl_pct") return (a.returnPct ?? -999999) - (b.returnPct ?? -999999);
    if (key === "symbol" || key === "asset_symbol") return (a.symbol || "").localeCompare(b.symbol || "", "ko");
    return a.evaluated - b.evaluated;
  });
  if (holdingTable.sortOrder === "desc") rows.reverse();
  holdingTable.total = rows.length;
  const start = (holdingTable.page - 1) * holdingTable.pageSize;
  holdingRows.value = rows.slice(start, start + holdingTable.pageSize);
}

function applyCsvLiabilityTable(): void {
  if (!appliedCsvPreview.value) {
    liabilityRows.value = [];
    liabilityTable.total = 0;
    return;
  }
  let rows = appliedCsvPreview.value.liability_rows.map(mapLiabilityFromSnapshot);
  if (tablePortfolioId.value != null) {
    rows = rows.filter((item) => item.portfolioId === tablePortfolioId.value);
  }
  const q = liabilityTable.q.trim().toLowerCase();
  if (q) {
    rows = rows.filter((item) => `${item.portfolioName} ${item.name} ${item.type}`.toLowerCase().includes(q));
  }
  const key = liabilityTable.sortBy;
  rows.sort((a, b) => {
    if (key === "portfolio" || key === "portfolio_name") return a.portfolioName.localeCompare(b.portfolioName, "ko");
    if (key === "liability" || key === "name") return a.name.localeCompare(b.name, "ko");
    if (key === "type" || key === "liability_type") return a.type.localeCompare(b.type, "ko");
    return a.balance - b.balance;
  });
  if (liabilityTable.sortOrder === "desc") rows.reverse();
  liabilityTable.total = rows.length;
  const start = (liabilityTable.page - 1) * liabilityTable.pageSize;
  liabilityRows.value = rows.slice(start, start + liabilityTable.pageSize);
}

async function loadPortfolioTable(): Promise<void> {
  portfolioTable.loading = true;
  try {
    if (sourceType.value === "LIVE") {
      const out = await getPortfoliosTable({
        page: portfolioTable.page,
        page_size: portfolioTable.pageSize,
        sort_by: toLivePortfolioSortBy(portfolioTable.sortBy),
        sort_order: portfolioTable.sortOrder,
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded: false,
      });
      const mapped = out.items.map(mapPortfolioFromLive);
      portfolioRows.value = tablePortfolioId.value == null ? mapped : mapped.filter((item) => item.portfolioId === tablePortfolioId.value);
      portfolioTable.total = out.total;
      return;
    }
    if (sourceType.value === "SNAPSHOT") {
      if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
      const out = await getSnapshotPortfoliosTable(appliedSnapshotId.value, {
        page: portfolioTable.page,
        page_size: portfolioTable.pageSize,
        sort_by: portfolioTable.sortBy as SnapshotPortfolioSortBy,
        sort_order: portfolioTable.sortOrder,
        portfolio_id: tablePortfolioId.value,
        display_currency: displayCurrency.value,
      });
      portfolioRows.value = out.items.map(mapPortfolioFromSnapshot);
      portfolioTable.total = out.total;
      return;
    }
    applyCsvPortfolioTable();
  } finally {
    portfolioTable.loading = false;
  }
}

async function loadHoldingTable(): Promise<void> {
  holdingTable.loading = true;
  try {
    if (sourceType.value === "LIVE") {
      const out = await getHoldingsTable({
        page: holdingTable.page,
        page_size: holdingTable.pageSize,
        sort_by: toLiveHoldingSortBy(holdingTable.sortBy),
        sort_order: holdingTable.sortOrder,
        q: holdingTable.q || undefined,
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded_portfolios: false,
      });
      let mapped = out.items.map(mapHoldingFromLive);
      if (tablePortfolioId.value != null) {
        mapped = mapped.filter((item) => item.portfolioId === tablePortfolioId.value);
      }
      holdingRows.value = mapped;
      holdingTable.total = out.total;
      return;
    }
    if (sourceType.value === "SNAPSHOT") {
      if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
      const out = await getSnapshotHoldingsTable(appliedSnapshotId.value, {
        page: holdingTable.page,
        page_size: holdingTable.pageSize,
        sort_by: holdingTable.sortBy as SnapshotHoldingSortBy,
        sort_order: holdingTable.sortOrder,
        q: holdingTable.q || undefined,
        portfolio_id: tablePortfolioId.value,
        display_currency: displayCurrency.value,
      });
      holdingRows.value = out.items.map(mapHoldingFromSnapshot);
      holdingTable.total = out.total;
      return;
    }
    applyCsvHoldingTable();
  } finally {
    holdingTable.loading = false;
  }
}

async function loadLiabilityTable(): Promise<void> {
  liabilityTable.loading = true;
  try {
    if (sourceType.value === "LIVE") {
      const out = await getLiabilitiesTable({
        page: liabilityTable.page,
        page_size: liabilityTable.pageSize,
        sort_by: toLiveLiabilitySortBy(liabilityTable.sortBy),
        sort_order: liabilityTable.sortOrder,
        q: liabilityTable.q || undefined,
        display_currency: displayCurrency.value,
        include_hidden: false,
        include_excluded: false,
      });
      let mapped = out.items.map(mapLiabilityFromLive);
      if (tablePortfolioId.value != null) {
        mapped = mapped.filter((item) => item.portfolioId === tablePortfolioId.value);
      }
      liabilityRows.value = mapped;
      liabilityTable.total = out.total;
      return;
    }
    if (sourceType.value === "SNAPSHOT") {
      if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
      const out = await getSnapshotLiabilitiesTable(appliedSnapshotId.value, {
        page: liabilityTable.page,
        page_size: liabilityTable.pageSize,
        sort_by: liabilityTable.sortBy as SnapshotLiabilitySortBy,
        sort_order: liabilityTable.sortOrder,
        q: liabilityTable.q || undefined,
        portfolio_id: tablePortfolioId.value,
        display_currency: displayCurrency.value,
      });
      liabilityRows.value = out.items.map(mapLiabilityFromSnapshot);
      liabilityTable.total = out.total;
      return;
    }
    applyCsvLiabilityTable();
  } finally {
    liabilityTable.loading = false;
  }
}

async function loadAllocations(): Promise<void> {
  donutLoading.value = true;
  donutError.value = "";
  try {
    const holdingsPortfolio =
      holdingsPortfolioKey.value === "ALL" ? undefined : Number.isFinite(Number(holdingsPortfolioKey.value)) ? Number(holdingsPortfolioKey.value) : undefined;
    if (sourceType.value === "LIVE") {
      const out = await getAllocation({
        target: donutTarget.value === "HOLDINGS" ? "HOLDINGS" : donutTarget.value,
        group_by: donutTarget.value === "HOLDINGS" ? "ASSET" : "PORTFOLIO",
        top_n: 10,
        portfolio_id: holdingsPortfolio,
        display_currency: displayCurrency.value,
      });
      donutTotal.value = toNumber(out.total);
      donutItems.value = out.items.map((item) => ({
        key: item.key,
        label: item.label,
        value: toNumber(item.value),
        ratioPct: toNumber(item.ratio_pct),
      }));
      return;
    }
    if (sourceType.value === "SNAPSHOT") {
      if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
      const out = await getSnapshotAllocation(appliedSnapshotId.value, {
        target: donutTarget.value,
        group_by: donutTarget.value === "HOLDINGS" ? "ASSET" : "PORTFOLIO",
        top_n: 10,
        portfolio_id: holdingsPortfolio,
        display_currency: displayCurrency.value,
      });
      donutTotal.value = toNumber(out.total);
      donutItems.value = out.items.map((item) => ({
        key: item.key,
        label: item.label,
        value: toNumber(item.value),
        ratioPct: toNumber(item.ratio_pct),
      }));
      return;
    }
    const local = localAllocation(donutTarget.value, holdingsPortfolio);
    donutTotal.value = local.total;
    donutItems.value = local.items;
  } catch (error) {
    donutError.value = error instanceof Error ? error.message : "Failed to load allocation";
    donutItems.value = [];
    donutTotal.value = 0;
  } finally {
    donutLoading.value = false;
  }
}

async function loadTreemap(): Promise<void> {
  treemapLoading.value = true;
  treemapError.value = "";
  try {
    const holdingsPortfolio =
      holdingsPortfolioKey.value === "ALL" ? undefined : Number.isFinite(Number(holdingsPortfolioKey.value)) ? Number(holdingsPortfolioKey.value) : undefined;
    if (sourceType.value === "LIVE") {
      const out = await getAllocation({
        target: treemapTarget.value === "HOLDINGS" ? "HOLDINGS" : "GROSS",
        group_by: treemapTarget.value === "HOLDINGS" ? "ASSET" : "PORTFOLIO",
        top_n: 10,
        portfolio_id: holdingsPortfolio,
        display_currency: displayCurrency.value,
      });
      treemapItems.value = out.items.map((item) => ({
        key: item.key,
        label: item.label,
        value: toNumber(item.value),
        ratioPct: toNumber(item.ratio_pct),
      }));
      return;
    }
    if (sourceType.value === "SNAPSHOT") {
      if (!appliedSnapshotId.value) throw new Error("Snapshot id is missing");
      const out = await getSnapshotAllocation(appliedSnapshotId.value, {
        target: treemapTarget.value === "HOLDINGS" ? "HOLDINGS" : "GROSS",
        group_by: treemapTarget.value === "HOLDINGS" ? "ASSET" : "PORTFOLIO",
        top_n: 10,
        portfolio_id: holdingsPortfolio,
        display_currency: displayCurrency.value,
      });
      treemapItems.value = out.items.map((item) => ({
        key: item.key,
        label: item.label,
        value: toNumber(item.value),
        ratioPct: toNumber(item.ratio_pct),
      }));
      return;
    }
    const local = localAllocation(treemapTarget.value === "HOLDINGS" ? "HOLDINGS" : "GROSS", holdingsPortfolio);
    treemapItems.value = local.items;
  } catch (error) {
    treemapError.value = error instanceof Error ? error.message : "Failed to load treemap";
    treemapItems.value = [];
  } finally {
    treemapLoading.value = false;
  }
}

async function loadSnapshotCatalog(): Promise<void> {
  const out = await getSnapshots({
    page: 1,
    page_size: 200,
    sort_by: "captured_at",
    sort_order: "desc",
    display_currency: displayCurrency.value,
  });
  snapshotCatalog.value = out.items;
  if (!trendSnapshotIds.value.length) {
    trendSnapshotIds.value = out.items.map((item) => item.id);
  }
}

async function loadTrend(): Promise<void> {
  trendLoading.value = true;
  trendError.value = "";
  try {
    if (sourceType.value === "LIVE") {
      if (trendMode.value === "PORTFOLIO_RETURN") {
        trendPoints.value = [];
        trendPortfolioLines.value = [];
        trendHoldingLines.value = [];
        trendError.value = "Portfolio/Holdings trend requires an applied snapshot.";
        return;
      }
      const out = await getNetworthSeries({ display_currency: displayCurrency.value, bucket: "DAY", limit: 90 });
      trendPoints.value = out.points.map((item, index) => ({
        snapshotId: index + 1,
        label: item.snapshot_date,
        gross: toNumber(item.gross_assets_total),
        liabilities: toNumber(item.liabilities_total),
        net: toNumber(item.net_assets_total),
      }));
      trendPortfolioLines.value = [];
      trendHoldingLines.value = [];
      return;
    }
    if (sourceType.value === "CSV_PREVIEW") {
      if (!appliedCsvPreview.value) return;
      const s = appliedCsvPreview.value.summary;
      trendPoints.value = [
        {
          snapshotId: s.id || 1,
          label: formatDateTime(s.captured_at),
          gross: summaryCurrency.value === "USD" ? toNumber(s.gross_assets_usd) : toNumber(s.gross_assets_krw),
          liabilities: summaryCurrency.value === "USD" ? toNumber(s.liabilities_usd) : toNumber(s.liabilities_krw),
          net: summaryCurrency.value === "USD" ? toNumber(s.net_assets_usd) : toNumber(s.net_assets_krw),
        },
      ];
      trendPortfolioLines.value = [];
      trendHoldingLines.value = [];
      return;
    }
    const selectedIds = trendSnapshotIds.value.length ? trendSnapshotIds.value : snapshotCatalog.value.map((item) => item.id);
    const out = await getSnapshotSeries({
      mode: trendMode.value,
      snapshot_ids: toCsvIds(selectedIds),
      portfolio_id:
        trendMode.value === "PORTFOLIO_RETURN" && trendPortfolioKey.value !== "ALL"
          ? Number(trendPortfolioKey.value)
          : undefined,
      holding_ids: trendMode.value === "PORTFOLIO_RETURN" ? toCsvIds(trendHoldingIds.value) : undefined,
      display_currency: displayCurrency.value,
    });
    trendPoints.value = out.points.map((item) => ({
      snapshotId: item.snapshot_id,
      label: item.label,
      gross: toNumber(item.gross),
      liabilities: toNumber(item.liabilities),
      net: toNumber(item.net),
    }));
    trendPortfolioLines.value = out.portfolio_lines.map((line) => ({
      key: line.key,
      label: line.label,
      values: line.points.map((point) => ({ snapshotId: point.snapshot_id, value: toNumber(point.value) })),
    }));
    trendHoldingLines.value = out.holding_lines.map((line) => ({
      key: line.key,
      label: line.label,
      values: line.points.map((point) => ({ snapshotId: point.snapshot_id, value: toNumber(point.value) })),
    }));
  } catch (error) {
    trendPoints.value = [];
    trendPortfolioLines.value = [];
    trendHoldingLines.value = [];
    trendError.value = error instanceof Error ? error.message : "Failed to load trend";
  } finally {
    trendLoading.value = false;
  }
}

async function reloadAll(options?: { preserveToast?: boolean }): Promise<void> {
  if (!options?.preserveToast) {
    toastMessage.value = "";
  }
  loading.value = true;
  errorMessage.value = "";
  try {
    await loadSummary();
    await Promise.all([loadPortfolioTable(), loadHoldingTable(), loadLiabilityTable()]);
    await Promise.all([loadAllocations(), loadTreemap()]);
    if (sourceType.value !== "CSV_PREVIEW") {
      await loadSnapshotCatalog();
    }
    await loadTrend();
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Failed to load snapshot page";
  } finally {
    loading.value = false;
  }
}

async function takeSnapshotNow(): Promise<void> {
  captureLoading.value = true;
  errorMessage.value = "";
  try {
    const created = await captureSnapshot({});
    sourceType.value = "SNAPSHOT";
    appliedSnapshotId.value = created.id;
    appliedCsvPreview.value = null;
    snapshotSummary.value = created;
    toastMessage.value = `Snapshot #${created.id} captured.`;
    await reloadAll({ preserveToast: true });
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Failed to capture snapshot";
  } finally {
    captureLoading.value = false;
  }
}

async function openLoadModal(): Promise<void> {
  toastMessage.value = "";
  modalOpen.value = true;
  modalSelectedId.value = null;
  modalCheckedIds.value = [];
  csvPreviewData.value = null;
  csvFileName.value = "";
  await loadModalList();
}

function closeLoadModal(): void {
  modalOpen.value = false;
  modalDeleteConfirmOpen.value = false;
  modalDeleteTargetIds.value = [];
}

async function loadModalList(): Promise<void> {
  modalLoading.value = true;
  try {
    const out = await getSnapshots({
      page: modalQuery.page,
      page_size: modalQuery.pageSize,
      q: modalQuery.q || undefined,
      from: modalQuery.from ? `${modalQuery.from}:00` : undefined,
      to: modalQuery.to ? `${modalQuery.to}:59` : undefined,
      sort_by: modalQuery.sortBy,
      sort_order: modalQuery.sortOrder,
      display_currency: displayCurrency.value,
    });
    modalRows.value = out.items;
    modalTotal.value = out.total;
  } finally {
    modalLoading.value = false;
  }
}

async function applySelectedSnapshot(): Promise<void> {
  if (!modalSelectedId.value) return;
  const selectedId = modalSelectedId.value;
  toastMessage.value = "";
  sourceType.value = "SNAPSHOT";
  appliedSnapshotId.value = selectedId;
  appliedCsvPreview.value = null;
  closeLoadModal();
  toastMessage.value = `Applied Snapshot #${selectedId}.`;
  await reloadAll();
}

async function onCsvFileInput(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;
  csvPreviewLoading.value = true;
  csvPreviewError.value = "";
  try {
    const preview = await previewSnapshotCsv(file);
    csvPreviewData.value = preview;
    csvFileName.value = file.name;
  } catch (error) {
    csvPreviewError.value = error instanceof Error ? error.message : "Failed to parse CSV";
  } finally {
    csvPreviewLoading.value = false;
  }
}

async function applyCsvPreviewNow(): Promise<void> {
  if (!csvPreviewData.value) return;
  toastMessage.value = "";
  sourceType.value = "CSV_PREVIEW";
  appliedCsvPreview.value = csvPreviewData.value;
  appliedSnapshotId.value = null;
  toastMessage.value = `Applied CSV Preview (${csvPreviewData.value.file_name || "file"}).`;
  closeLoadModal();
  await reloadAll();
}

async function backToLive(): Promise<void> {
  toastMessage.value = "";
  sourceType.value = "LIVE";
  appliedSnapshotId.value = null;
  appliedCsvPreview.value = null;
  toastMessage.value = "Switched to Live data.";
  await reloadAll();
}

async function exportAppliedSnapshotCsv(): Promise<void> {
  if (sourceType.value !== "SNAPSHOT" || !appliedSnapshotId.value) return;
  const blob = await exportSnapshotCsv(appliedSnapshotId.value);
  downloadBlob(blob, `snapshot_${appliedSnapshotId.value}.csv`);
}

function toggleModalChecked(id: number, checked: boolean): void {
  const set = new Set(modalCheckedIds.value);
  if (checked) set.add(id);
  else set.delete(id);
  modalCheckedIds.value = Array.from(set);
}

function toggleModalAll(checked: boolean): void {
  if (checked) {
    modalCheckedIds.value = modalRows.value.map((row) => row.id);
    return;
  }
  modalCheckedIds.value = [];
}

function askDeleteSnapshots(ids: number[]): void {
  const uniqueIds = Array.from(new Set(ids.filter((id) => Number.isFinite(id) && id > 0)));
  if (!uniqueIds.length) return;
  modalDeleteTargetIds.value = uniqueIds;
  modalDeleteConfirmOpen.value = true;
}

function askDeleteSelectedSnapshots(): void {
  askDeleteSnapshots(modalCheckedIds.value);
}

function askDeleteSingleSnapshot(snapshotId: number): void {
  askDeleteSnapshots([snapshotId]);
}

function closeDeleteConfirm(): void {
  if (modalDeleting.value) return;
  modalDeleteConfirmOpen.value = false;
  modalDeleteTargetIds.value = [];
}

async function confirmDeleteSnapshots(): Promise<void> {
  if (!modalDeleteTargetIds.value.length) return;
  modalDeleting.value = true;
  try {
    const targetIds = [...modalDeleteTargetIds.value];
    const out = await deleteSnapshots(targetIds);
    const deletedSet = new Set(out.deleted_ids);
    modalCheckedIds.value = modalCheckedIds.value.filter((id) => !deletedSet.has(id));
    if (modalSelectedId.value != null && deletedSet.has(modalSelectedId.value)) {
      modalSelectedId.value = null;
    }
    if (appliedSnapshotId.value && deletedSet.has(appliedSnapshotId.value)) {
      sourceType.value = "LIVE";
      appliedSnapshotId.value = null;
      appliedCsvPreview.value = null;
      toastMessage.value = `Deleted ${out.deleted} snapshot(s). Applied snapshot was removed, switched to Live data.`;
    } else {
      toastMessage.value = `Deleted ${out.deleted} snapshot(s).`;
    }
    closeDeleteConfirm();
    await loadModalList();
    await reloadAll({ preserveToast: true });
  } catch (error) {
    errorMessage.value = error instanceof Error ? error.message : "Failed to delete snapshots";
  } finally {
    modalDeleting.value = false;
  }
}

function toggleSort(target: { sortBy: string; sortOrder: SortOrder; page: number }, key: string): void {
  if (target.sortBy === key) {
    target.sortOrder = target.sortOrder === "asc" ? "desc" : "asc";
  } else {
    target.sortBy = key;
    target.sortOrder = key === "portfolio" || key === "asset" || key === "liability" || key === "symbol" ? "asc" : "desc";
  }
  target.page = 1;
}

function sortMark(sortBy: string, key: string, sortOrder: SortOrder): string {
  if (sortBy !== key) return "↕";
  return sortOrder === "asc" ? "↑" : "↓";
}

function setTablePortfolioKey(value: string): void {
  tablePortfolioKey.value = value;
  portfolioTable.page = 1;
  holdingTable.page = 1;
  liabilityTable.page = 1;
}

function selectAllPortfoliosForTables(): void {
  setTablePortfolioKey("ALL");
}

function lineColor(key: string): string {
  const normalized = key.toLowerCase();
  if (normalized === "gross") return "#22c55e";
  if (normalized === "liabilities") return "#ef4444";
  if (normalized === "net") return "#0ea5e9";
  if (normalized.startsWith("portfolio:")) return "#a78bfa";
  if (normalized.startsWith("holding:")) return "#f59e0b";
  return "#94a3b8";
}

const chartWidth = 860;
const chartHeight = 260;
const chartPadding = 28;

const chartLines = computed(() => {
  if (trendMode.value === "SUMMARY") {
    const lines: TrendLine[] = [];
    if (trendVisibility.gross) {
      lines.push({ key: "gross", label: "Gross", values: trendPoints.value.map((p) => ({ snapshotId: p.snapshotId, value: p.gross })) });
    }
    if (trendVisibility.liabilities) {
      lines.push({ key: "liabilities", label: "Liabilities", values: trendPoints.value.map((p) => ({ snapshotId: p.snapshotId, value: p.liabilities })) });
    }
    if (trendVisibility.net) {
      lines.push({ key: "net", label: "Net", values: trendPoints.value.map((p) => ({ snapshotId: p.snapshotId, value: p.net })) });
    }
    return lines;
  }
  return [...trendPortfolioLines.value, ...trendHoldingLines.value];
});

const chartRange = computed(() => {
  const values = chartLines.value.flatMap((line) => line.values.map((point) => point.value));
  if (!values.length) return { min: -1, max: 1 };
  const min = Math.min(...values);
  const max = Math.max(...values);
  return min === max ? { min: min - 1, max: max + 1 } : { min, max };
});

function chartX(index: number): number {
  const total = trendPoints.value.length;
  if (total <= 1) return chartPadding;
  const usable = chartWidth - chartPadding * 2;
  return chartPadding + (usable * index) / (total - 1);
}

function chartY(value: number): number {
  const usable = chartHeight - chartPadding * 2;
  const ratio = (value - chartRange.value.min) / (chartRange.value.max - chartRange.value.min || 1);
  return chartHeight - chartPadding - usable * ratio;
}

function linePath(values: Array<{ snapshotId: number; value: number }>): string {
  const ids = trendPoints.value.map((item) => item.snapshotId);
  const byId = new Map(values.map((item) => [item.snapshotId, item.value]));
  const pairs = ids
    .map((id, index) => ({ id, index, value: byId.get(id) }))
    .filter((item): item is { id: number; index: number; value: number } => item.value != null);
  return pairs
    .map((item, idx) => `${idx === 0 ? "M" : "L"} ${chartX(item.index)} ${chartY(item.value)}`)
    .join(" ");
}

function pointX(snapshotId: number): number {
  const idx = trendPoints.value.findIndex((item) => item.snapshotId === snapshotId);
  return chartX(idx < 0 ? 0 : idx);
}

function inspectPoint(lineLabel: string, snapshotId: number, value: number): void {
  const point = trendPoints.value.find((item) => item.snapshotId === snapshotId);
  trendInspect.value = `${lineLabel} · ${point?.label || "-"} · ${
    trendMode.value === "SUMMARY" ? formatCurrency(value, summaryCurrency.value) : formatPercent(value)
  }`;
}

function toggleTrendSnapshot(id: number, checked: boolean): void {
  const set = new Set(trendSnapshotIds.value);
  if (checked) set.add(id);
  else set.delete(id);
  trendSnapshotIds.value = Array.from(set);
}

onMounted(async () => {
  loadMaskFromStorage();
  await ensureInitialized();
  await reloadAll();
});

watch(
  () => amountMaskEnabled.value,
  () => saveMaskToStorage(),
);
watch(
  () => displayCurrency.value,
  async (next, prev) => {
    if (next === prev) return;
    await reloadAll();
  },
);
watch(
  () => [donutTarget.value, holdingsPortfolioKey.value, sourceType.value],
  () => void loadAllocations(),
);
watch(
  () => [treemapTarget.value, holdingsPortfolioKey.value, sourceType.value],
  () => void loadTreemap(),
);
watch(
  () => [portfolioTable.page, portfolioTable.pageSize, portfolioTable.sortBy, portfolioTable.sortOrder, tablePortfolioKey.value, sourceType.value],
  () => void loadPortfolioTable(),
);
watch(
  () => [holdingTable.page, holdingTable.pageSize, holdingTable.sortBy, holdingTable.sortOrder, holdingTable.q, tablePortfolioKey.value, sourceType.value],
  () => void loadHoldingTable(),
);
watch(
  () => [liabilityTable.page, liabilityTable.pageSize, liabilityTable.sortBy, liabilityTable.sortOrder, liabilityTable.q, tablePortfolioKey.value, sourceType.value],
  () => void loadLiabilityTable(),
);
watch(
  () => [trendMode.value, trendPortfolioKey.value, trendHoldingIds.value.join(","), trendSnapshotIds.value.join(","), sourceType.value],
  () => void loadTrend(),
);
watch(
  () => [modalOpen.value, modalQuery.page, modalQuery.pageSize, modalQuery.q, modalQuery.from, modalQuery.to, modalQuery.sortBy, modalQuery.sortOrder, displayCurrency.value],
  () => {
    if (!modalOpen.value) return;
    void loadModalList();
  },
);
</script>
<template>
  <main class="flex flex-col gap-6 p-4 md:p-6">
    <header class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-600 dark:text-emerald-300">Snapshot</p>
          <h1 class="text-2xl font-bold text-slate-900 dark:text-slate-100">Snapshot Workspace</h1>
          <p class="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Preview-only analysis mode. Live Home/Report/Dashboard data is not modified.
          </p>
        </div>
        <div class="inline-flex rounded-xl border border-slate-300 p-1 dark:border-slate-700">
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-sm font-semibold"
            :class="displayCurrency === 'KRW' ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
            :disabled="settingsSaving"
            @click="setDisplayCurrency('KRW')"
          >
            KRW
          </button>
          <button
            type="button"
            class="rounded-lg px-3 py-1.5 text-sm font-semibold"
            :class="displayCurrency === 'USD' ? 'bg-emerald-500 text-white' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'"
            :disabled="settingsSaving"
            @click="setDisplayCurrency('USD')"
          >
            USD
          </button>
        </div>
      </div>
    </header>

    <article class="order-1 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Snapshot Control</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Take, load, preview and export snapshot datasets.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            :disabled="captureLoading"
            @click="takeSnapshotNow()"
          >
            {{ captureLoading ? "Capturing..." : "Take Snapshot" }}
          </button>
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="openLoadModal()"
          >
            Load Snapshot
          </button>
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="sourceType === 'LIVE'"
            @click="backToLive()"
          >
            Back to Live
          </button>
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="sourceType !== 'SNAPSHOT'"
            @click="exportAppliedSnapshotCsv()"
          >
            Export CSV
          </button>
          <button
            type="button"
            class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            @click="reloadAll()"
          >
            Refresh
          </button>
          <button
            type="button"
            class="rounded-xl border border-emerald-300 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
            :disabled="exportingDashboardImage || loading || !dashboardExpanded"
            @click="exportSnapshotDashboardImage"
          >
            {{ exportingDashboardImage ? "Exporting..." : "Export Dashboard PNG" }}
          </button>
        </div>
      </div>
      <p class="mt-3 text-sm text-slate-600 dark:text-slate-300">{{ appliedLabel }}</p>
      <p class="mt-1 text-xs text-slate-500 dark:text-slate-400">as_of: {{ asOfText }}</p>
      <p v-if="toastMessage" class="mt-2 rounded-xl bg-emerald-50 px-3 py-2 text-xs text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-200">
        {{ toastMessage }}
      </p>
      <p v-if="errorMessage" class="mt-2 rounded-xl bg-rose-50 px-3 py-2 text-xs text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
        {{ errorMessage }}
      </p>
    </article>
    <article class="order-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Snapshot Trend</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Summary or portfolio return series over selected snapshots.</p>
          <p v-if="sourceType === 'LIVE'" class="mt-1 text-xs text-amber-600 dark:text-amber-300">
            Live mode uses valuation snapshot history. Snapshot filter is applied only when a snapshot/CSV preview is loaded.
          </p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <button type="button" class="rounded-lg border px-3 py-1.5 text-xs font-semibold" :class="trendMode === 'SUMMARY' ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'" @click="trendMode = 'SUMMARY'">Summary</button>
          <button type="button" class="rounded-lg border px-3 py-1.5 text-xs font-semibold" :class="trendMode === 'PORTFOLIO_RETURN' ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'" @click="trendMode = 'PORTFOLIO_RETURN'">Portfolio Return</button>
          <button type="button" class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="trendSettingsOpen = !trendSettingsOpen">{{ trendSettingsOpen ? "Hide Settings" : "Settings" }}</button>
        </div>
      </div>
      <div v-if="trendMode === 'SUMMARY'" class="mt-3 flex flex-wrap items-center gap-4 text-xs">
        <label class="inline-flex items-center gap-2"><input v-model="trendVisibility.gross" type="checkbox" class="h-4 w-4 rounded" /> Gross</label>
        <label class="inline-flex items-center gap-2"><input v-model="trendVisibility.liabilities" type="checkbox" class="h-4 w-4 rounded" /> Liabilities</label>
        <label class="inline-flex items-center gap-2"><input v-model="trendVisibility.net" type="checkbox" class="h-4 w-4 rounded" /> Net</label>
      </div>
      <div v-else class="mt-3 flex flex-wrap items-center gap-2 text-xs">
        <span class="font-semibold text-slate-600 dark:text-slate-300">Portfolio</span>
        <select v-model="trendPortfolioKey" class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
          <option value="ALL">All</option>
          <option v-for="item in trendPortfolioOptions" :key="`trend-${item.key}`" :value="item.key">{{ item.label }}</option>
        </select>
      </div>
      <div v-if="trendSettingsOpen" class="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800/40">
        <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Snapshot Filter</p>
        <div class="grid gap-2 md:grid-cols-2">
          <label v-for="item in trendSnapshotOptions" :key="`snap-filter-${item.id}`" class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-2 py-1 text-xs text-slate-700 dark:border-slate-700 dark:text-slate-200">
            <input type="checkbox" class="h-4 w-4 rounded" :checked="trendSnapshotIds.includes(item.id)" @change="toggleTrendSnapshot(item.id, ($event.target as HTMLInputElement).checked)" />
            {{ item.label }}
          </label>
        </div>
      </div>
      <div class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900/60">
        <div class="mb-3 grid gap-1 rounded-lg border border-slate-200 bg-white/70 px-3 py-2 text-[11px] text-slate-600 dark:border-slate-700 dark:bg-slate-900/40 dark:text-slate-300">
          <p>
            <span class="font-semibold text-slate-700 dark:text-slate-200">X-axis:</span>
            Snapshot captured time (selected snapshots)
          </p>
          <p>
            <span class="font-semibold text-slate-700 dark:text-slate-200">Y-axis:</span>
            {{ trendMode === "SUMMARY" ? `Amount (${summaryCurrency})` : "Return (%)" }}
          </p>
        </div>
        <div v-if="trendLoading" class="text-sm text-slate-500 dark:text-slate-400">Loading trend...</div>
        <div v-else-if="trendError" class="text-sm text-rose-600 dark:text-rose-300">{{ trendError }}</div>
        <div v-else-if="trendPoints.length < 1 || chartLines.length < 1" class="text-sm text-slate-500 dark:text-slate-400">Not enough points.</div>
        <div v-else class="space-y-2">
          <svg :viewBox="`0 0 ${chartWidth} ${chartHeight}`" class="h-[18rem] w-full rounded-xl bg-slate-950/95 p-2">
            <g v-for="line in chartLines" :key="`line-${line.key}`">
              <path :d="linePath(line.values)" fill="none" :stroke="lineColor(line.key)" stroke-width="2.25" />
              <circle v-for="point in line.values" :key="`point-${line.key}-${point.snapshotId}`" :cx="pointX(point.snapshotId)" :cy="chartY(point.value)" r="4" :fill="lineColor(line.key)" class="cursor-pointer" @mouseenter="inspectPoint(line.label, point.snapshotId, point.value)" @click="inspectPoint(line.label, point.snapshotId, point.value)" />
            </g>
          </svg>
          <div class="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-300">
            <span v-for="line in chartLines" :key="`legend-${line.key}`" class="inline-flex items-center gap-1">
              <span class="h-2.5 w-2.5 rounded-full" :style="{ backgroundColor: lineColor(line.key) }" />
              {{ line.label }}
            </span>
          </div>
          <p class="text-xs text-slate-500 dark:text-slate-400">{{ trendInspect || "Hover/click a point to inspect value." }}</p>
        </div>
      </div>
    </article>

    <div v-if="modalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4">
      <div class="max-h-[90vh] w-full max-w-5xl overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-lg font-semibold text-slate-900 dark:text-slate-100">Load Snapshot</h3>
            <p class="text-sm text-slate-500 dark:text-slate-400">Select DB snapshot or CSV preview then apply.</p>
          </div>
          <button type="button" class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" @click="closeLoadModal()">Close</button>
        </div>
        <div class="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">DB Snapshot List</p>
          <div class="grid gap-2 md:grid-cols-4">
            <input v-model="modalQuery.q" type="text" placeholder="Search name/note..." class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 md:col-span-2" />
            <input v-model="modalQuery.from" type="datetime-local" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
            <input v-model="modalQuery.to" type="datetime-local" class="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100" />
          </div>
          <div class="mt-3 overflow-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table class="min-w-[720px] text-xs">
              <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                <tr>
                  <th class="px-3 py-2 text-left">
                    <label class="inline-flex items-center gap-2">
                      <input
                        type="checkbox"
                        class="h-4 w-4 rounded"
                        :checked="modalAllChecked"
                        @change="toggleModalAll(($event.target as HTMLInputElement).checked)"
                      />
                      <span>All</span>
                    </label>
                  </th>
                  <th class="px-3 py-2 text-left">ID</th>
                  <th class="px-3 py-2 text-left">Captured At</th>
                  <th class="px-3 py-2 text-left">Name</th>
                  <th class="px-3 py-2 text-left">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr v-if="modalLoading"><td colspan="5" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">Loading snapshots...</td></tr>
                <tr v-else-if="modalRows.length === 0"><td colspan="5" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">No snapshots found.</td></tr>
                <tr v-for="row in modalRows" :key="`modal-${row.id}`" class="cursor-pointer border-t border-slate-200 dark:border-slate-800" :class="modalSelectedId === row.id ? 'bg-indigo-50 dark:bg-indigo-900/20' : ''" @click="modalSelectedId = row.id" @dblclick="modalSelectedId = row.id; applySelectedSnapshot()">
                  <td class="px-3 py-2" @click.stop>
                    <input
                      type="checkbox"
                      class="h-4 w-4 rounded"
                      :checked="modalCheckedIds.includes(row.id)"
                      @change="toggleModalChecked(row.id, ($event.target as HTMLInputElement).checked)"
                    />
                  </td>
                  <td class="px-3 py-2">#{{ row.id }}</td>
                  <td class="px-3 py-2">{{ formatDateTime(row.captured_at) }}</td>
                  <td class="px-3 py-2">{{ row.name || "-" }}</td>
                  <td class="px-3 py-2" @click.stop>
                    <button
                      type="button"
                      class="rounded border border-rose-300 px-2 py-0.5 text-rose-600 transition hover:bg-rose-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20"
                      @click="askDeleteSingleSnapshot(row.id)"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="mt-2 flex flex-wrap items-center gap-2">
            <button type="button" class="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50" :disabled="!modalSelectedId" @click="applySelectedSnapshot()">Apply Selected Snapshot</button>
            <button
              type="button"
              class="rounded-xl border border-rose-300 px-4 py-2 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-800 dark:text-rose-300 dark:hover:bg-rose-900/20"
              :disabled="modalCheckedIds.length === 0 || modalDeleting"
              @click="askDeleteSelectedSnapshots()"
            >
              Delete Checked ({{ modalCheckedIds.length }})
            </button>
          </div>
        </div>
        <div class="mt-4 rounded-xl border border-slate-200 p-3 dark:border-slate-700">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">CSV Preview</p>
          <div class="flex flex-wrap items-center gap-2">
            <input type="file" accept=".csv,text/csv" class="text-xs text-slate-600 file:mr-2 file:rounded-lg file:border-0 file:bg-slate-200 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 dark:text-slate-300 dark:file:bg-slate-700 dark:file:text-slate-100" @change="onCsvFileInput" />
            <span v-if="csvFileName" class="text-xs text-slate-600 dark:text-slate-300">{{ csvFileName }}</span>
            <button type="button" class="rounded-xl bg-indigo-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-600 disabled:cursor-not-allowed disabled:opacity-50" :disabled="!csvPreviewData || csvPreviewLoading" @click="applyCsvPreviewNow()">Apply CSV Preview</button>
          </div>
          <p v-if="csvPreviewLoading" class="mt-2 text-xs text-slate-500 dark:text-slate-400">Parsing CSV...</p>
          <p v-if="csvPreviewError" class="mt-2 text-xs text-rose-600 dark:text-rose-300">{{ csvPreviewError }}</p>
        </div>
      </div>
    </div>
    <div v-if="modalDeleteConfirmOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4">
      <div class="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-4 shadow-xl dark:border-slate-800 dark:bg-slate-900">
        <h3 class="text-base font-semibold text-slate-900 dark:text-slate-100">Delete Snapshots</h3>
        <p class="mt-2 text-sm text-slate-600 dark:text-slate-300">
          Selected snapshot {{ modalDeleteTargetIds.length }}건을 삭제할까요? 이 작업은 되돌릴 수 없습니다.
        </p>
        <div class="mt-4 flex justify-end gap-2">
          <button
            type="button"
            class="rounded-lg border border-slate-300 px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
            :disabled="modalDeleting"
            @click="closeDeleteConfirm()"
          >
            Cancel
          </button>
          <button
            type="button"
            class="rounded-lg border border-rose-300 bg-rose-50 px-3 py-1.5 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-rose-800 dark:bg-rose-900/20 dark:text-rose-300 dark:hover:bg-rose-900/30"
            :disabled="modalDeleting"
            @click="confirmDeleteSnapshots()"
          >
            {{ modalDeleting ? "Deleting..." : "Delete" }}
          </button>
        </div>
      </div>
    </div>
    <article class="order-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Holdings Table</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Portfolio / Asset / Price / Avg Cost / Evaluated / Cost Basis / Profit / Return / Symbol</p>
        </div>
        <input
          v-model="holdingTable.q"
          type="text"
          placeholder="Search holdings..."
          class="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-400/60 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <div class="mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table class="min-w-[1180px] text-xs">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(holdingTable, 'portfolio')">
                  Portfolio {{ sortMark(holdingTable.sortBy, 'portfolio', holdingTable.sortOrder) }}
                </button>
              </th>
              <th class="px-3 py-2 text-left"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(holdingTable, 'asset')">Asset {{ sortMark(holdingTable.sortBy, 'asset', holdingTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(holdingTable, 'price')">Price {{ sortMark(holdingTable.sortBy, 'price', holdingTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(holdingTable, 'avg_cost')">Avg Cost {{ sortMark(holdingTable.sortBy, 'avg_cost', holdingTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(holdingTable, 'evaluated')">Evaluated {{ sortMark(holdingTable.sortBy, 'evaluated', holdingTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(holdingTable, 'cost_basis')">Cost Basis {{ sortMark(holdingTable.sortBy, 'cost_basis', holdingTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(holdingTable, 'profit')">Profit {{ sortMark(holdingTable.sortBy, 'profit', holdingTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(holdingTable, 'return')">Return {{ sortMark(holdingTable.sortBy, 'return', holdingTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-left"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(holdingTable, 'symbol')">Symbol {{ sortMark(holdingTable.sortBy, 'symbol', holdingTable.sortOrder) }}</button></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="holdingTable.loading"><td colspan="9" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">Loading holdings...</td></tr>
            <tr v-else-if="holdingRows.length === 0"><td colspan="9" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">No holding rows.</td></tr>
            <tr v-for="row in holdingRows" :key="`h-${row.id}`" class="border-t border-slate-200 dark:border-slate-800">
              <td class="sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900">{{ row.portfolioName }}</td>
              <td class="px-3 py-2">{{ row.assetName }}</td>
              <td class="px-3 py-2 text-right"><span :class="maskedClass">{{ formatCurrency(row.price, row.priceCurrency) }}</span></td>
              <td class="px-3 py-2 text-right"><span :class="maskedClass">{{ formatCurrency(row.avgCost, row.avgCostCurrency) }}</span></td>
              <td class="px-3 py-2 text-right font-semibold"><span :class="maskedClass">{{ formatCurrency(row.evaluated, summaryCurrency) }}</span></td>
              <td class="px-3 py-2 text-right"><span :class="maskedClass">{{ formatCurrency(row.costBasis, summaryCurrency) }}</span></td>
              <td class="px-3 py-2 text-right font-semibold" :class="row.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'"><span :class="maskedClass">{{ row.profit >= 0 ? "+" : "" }}{{ formatCurrency(row.profit, summaryCurrency) }}</span></td>
              <td class="px-3 py-2 text-right font-semibold" :class="(row.returnPct ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'">{{ formatPercent(row.returnPct) }}</td>
              <td class="px-3 py-2">{{ row.symbol || "-" }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <p>Total: {{ holdingTable.total }}</p>
        <div class="inline-flex items-center gap-2">
          <button type="button" class="rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" :disabled="holdingTable.page <= 1" @click="holdingTable.page -= 1">Prev</button>
          <span>Page {{ holdingTable.page }} / {{ Math.max(1, Math.ceil(holdingTable.total / holdingTable.pageSize)) }}</span>
          <button type="button" class="rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" :disabled="holdingTable.page >= Math.max(1, Math.ceil(holdingTable.total / holdingTable.pageSize))" @click="holdingTable.page += 1">Next</button>
        </div>
      </div>
    </article>

    <article class="order-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Liabilities Table</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Portfolio / Liability / Balance / Type</p>
        </div>
        <input
          v-model="liabilityTable.q"
          type="text"
          placeholder="Search liabilities..."
          class="w-full max-w-xs rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none ring-emerald-400/60 focus:ring dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
        />
      </div>
      <div class="mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table class="min-w-[780px] text-xs">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(liabilityTable, 'portfolio')">Portfolio {{ sortMark(liabilityTable.sortBy, 'portfolio', liabilityTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-left"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(liabilityTable, 'liability')">Liability {{ sortMark(liabilityTable.sortBy, 'liability', liabilityTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-right"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(liabilityTable, 'balance')">Balance {{ sortMark(liabilityTable.sortBy, 'balance', liabilityTable.sortOrder) }}</button></th>
              <th class="px-3 py-2 text-left"><button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(liabilityTable, 'type')">Type {{ sortMark(liabilityTable.sortBy, 'type', liabilityTable.sortOrder) }}</button></th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="liabilityTable.loading"><td colspan="4" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">Loading liabilities...</td></tr>
            <tr v-else-if="liabilityRows.length === 0"><td colspan="4" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">No liability rows.</td></tr>
            <tr v-for="row in liabilityRows" :key="`l-${row.id}`" class="border-t border-slate-200 dark:border-slate-800">
              <td class="sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900">{{ row.portfolioName }}</td>
              <td class="px-3 py-2">{{ row.name }}</td>
              <td class="px-3 py-2 text-right font-semibold"><span :class="maskedClass">{{ formatCurrency(row.balance, row.balanceCurrency) }}</span></td>
              <td class="px-3 py-2">{{ row.type }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <p>Total: {{ liabilityTable.total }}</p>
        <div class="inline-flex items-center gap-2">
          <button type="button" class="rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" :disabled="liabilityTable.page <= 1" @click="liabilityTable.page -= 1">Prev</button>
          <span>Page {{ liabilityTable.page }} / {{ Math.max(1, Math.ceil(liabilityTable.total / liabilityTable.pageSize)) }}</span>
          <button type="button" class="rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" :disabled="liabilityTable.page >= Math.max(1, Math.ceil(liabilityTable.total / liabilityTable.pageSize))" @click="liabilityTable.page += 1">Next</button>
        </div>
      </div>
    </article>

    <article class="order-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex items-center justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Snapshot Dashboard Panel</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">KPI, Donut, Treemap from the applied snapshot dataset.</p>
        </div>
        <button
          type="button"
          class="rounded-xl border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          @click="dashboardExpanded = !dashboardExpanded"
        >
          {{ dashboardExpanded ? "Collapse" : "Expand" }}
        </button>
      </div>

      <div v-if="dashboardExpanded" class="mt-4 space-y-4">
        <div class="rounded-2xl border border-slate-200 p-3 dark:border-slate-700">
          <div class="flex flex-wrap items-center gap-3 text-sm">
            <div class="inline-flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">KPI</span>
              <button
                type="button"
                class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                :class="kpiMode === 'SUMMARY' ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="kpiMode = 'SUMMARY'"
              >
                Summary
              </button>
              <button
                type="button"
                class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                :class="kpiMode === 'PORTFOLIOS' ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="kpiMode = 'PORTFOLIOS'"
              >
                Portfolios
              </button>
              <select
                v-if="kpiMode === 'PORTFOLIOS'"
                v-model="kpiPortfolioKey"
                class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="ALL">All</option>
                <option v-for="item in portfolioOptions" :key="`kpi-${item.key}`" :value="item.key">
                  {{ item.label }}
                </option>
              </select>
            </div>
            <div class="inline-flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Donut</span>
              <button
                v-for="target in (['GROSS', 'LIABILITIES', 'NET', 'HOLDINGS'] as const)"
                :key="target"
                type="button"
                class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                :class="donutTarget === target ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="donutTarget = target"
              >
                {{ target }}
              </button>
            </div>
            <div class="inline-flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Start</span>
              <button
                v-for="start in (['TOP', 'RIGHT', 'LEFT'] as const)"
                :key="start"
                type="button"
                class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                :class="donutStart === start ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="donutStart = start"
              >
                {{ start }}
              </button>
            </div>
            <div class="inline-flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Treemap</span>
              <button
                v-for="target in (['GROSS', 'HOLDINGS'] as const)"
                :key="target"
                type="button"
                class="rounded-lg border px-3 py-1.5 text-xs font-semibold"
                :class="treemapTarget === target ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="treemapTarget = target"
              >
                {{ target }}
              </button>
            </div>
            <div class="inline-flex items-center gap-2">
              <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Portfolio</span>
              <select
                v-model="holdingsPortfolioKey"
                class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="ALL">All</option>
                <option v-for="item in portfolioOptions" :key="`holdings-${item.key}`" :value="item.key">
                  {{ item.label }}
                </option>
              </select>
            </div>
            <div class="ml-auto flex flex-wrap items-center gap-2">
              <label class="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 dark:border-slate-700 dark:text-slate-200">
                <input v-model="amountMaskEnabled" type="checkbox" class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                Amount Blur
              </label>
              <button
                type="button"
                class="rounded-lg border border-slate-300 px-3 py-1.5 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="printSnapshotDashboard"
              >
                Print
              </button>
              <button
                type="button"
                class="rounded-lg border border-emerald-300 px-3 py-1.5 text-xs font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-60 dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
                :disabled="exportingDashboardImage || loading || !dashboardExpanded"
                @click="exportSnapshotDashboardImage"
              >
                {{ exportingDashboardImage ? "Exporting..." : "Export PNG" }}
              </button>
            </div>
          </div>
        </div>
        <div ref="snapshotDashboardRef" class="space-y-4">
          <KpiSummaryCard
            v-if="kpiMode === 'SUMMARY' && summaryVm"
            :currency="summaryCurrency"
            :gross-assets-total="summaryVm.gross"
            :liabilities-total="summaryVm.liabilities"
            :net-assets-total="summaryVm.net"
            :invested-principal-total="summaryVm.invested"
            :principal-minus-debt-total="summaryVm.debtAdjusted"
            :gross-return-pct="kpiGrossReturn"
            :net-return-pct="kpiNetReturn"
            :gross-profit-total="kpiGrossProfit"
            :net-profit-total="kpiNetProfit"
            :as-of="asOfText"
            title="KPI Summary"
            subtitle="Included in snapshot analysis"
            :mask-amounts="amountMaskEnabled"
          />
          <KpiPortfolioSummaryCard
            v-if="kpiMode === 'PORTFOLIOS'"
            :currency="summaryCurrency"
            :portfolios="kpiPortfolioCardRows"
            :mask-amounts="amountMaskEnabled"
            title="KPI Portfolios"
            subtitle="Portfolio-level KPI for the applied source"
          />
          <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <AllocationDonutCard
              :title="`Allocation | ${donutTarget}`"
              :subtitle="`Top N + Others (${holdingsPortfolioKey === 'ALL' ? 'all portfolios' : 'filtered portfolio'})`"
              :currency="summaryCurrency"
              :total="donutTotal"
              :items="donutItems"
              :start-position="donutStart"
              :mask-amounts="amountMaskEnabled"
              :loading="donutLoading"
              :error="donutError"
            />
            <AllocationTreemapCard
              :title="`Treemap | ${treemapTarget}`"
              :subtitle="`Target=${treemapTarget} ${holdingsPortfolioKey === 'ALL' ? '| all portfolios' : '| filtered portfolio'}`"
              :currency="summaryCurrency"
              :items="treemapItems"
              :mask-amounts="amountMaskEnabled"
              :loading="treemapLoading"
              :error="treemapError"
            />
          </div>
        </div>
      </div>
      <p v-else class="mt-3 text-sm text-slate-500 dark:text-slate-400">Collapsed. Click Expand to preview snapshot dashboard.</p>
    </article>

    <article class="order-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 class="text-base font-semibold text-slate-900 dark:text-slate-100">Portfolios Table</h2>
          <p class="text-sm text-slate-500 dark:text-slate-400">Portfolio / Current / Invested Principal / Profit / Return</p>
        </div>
        <div class="flex items-center gap-2 text-xs">
          <label class="inline-flex items-center gap-1 text-slate-600 dark:text-slate-300">
            <input
              type="checkbox"
              :checked="tablePortfolioKey === 'ALL'"
              class="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              @change="selectAllPortfoliosForTables()"
            />
            All
          </label>
          <select
            :value="tablePortfolioKey"
            class="rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-xs text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
            @change="setTablePortfolioKey(($event.target as HTMLSelectElement).value)"
          >
            <option value="ALL">All portfolios</option>
            <option v-for="item in portfolioOptions" :key="`table-portfolio-${item.key}`" :value="item.key">
              {{ item.label }}
            </option>
          </select>
        </div>
      </div>
      <div class="mt-3 overflow-auto rounded-xl border border-slate-200 dark:border-slate-700">
        <table class="min-w-[880px] text-xs">
          <thead class="bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            <tr>
              <th class="sticky-col-head sticky-col-width sticky left-0 z-20 bg-slate-50 px-3 py-2 text-left dark:bg-slate-800">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(portfolioTable, 'portfolio')">
                  Portfolio {{ sortMark(portfolioTable.sortBy, 'portfolio', portfolioTable.sortOrder) }}
                </button>
              </th>
              <th class="px-3 py-2 text-right">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(portfolioTable, 'current')">
                  Current {{ sortMark(portfolioTable.sortBy, 'current', portfolioTable.sortOrder) }}
                </button>
              </th>
              <th class="px-3 py-2 text-right">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(portfolioTable, 'invested_principal')">
                  Invested {{ sortMark(portfolioTable.sortBy, 'invested_principal', portfolioTable.sortOrder) }}
                </button>
              </th>
              <th class="px-3 py-2 text-right">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(portfolioTable, 'portfolio_profit')">
                  Profit {{ sortMark(portfolioTable.sortBy, 'portfolio_profit', portfolioTable.sortOrder) }}
                </button>
              </th>
              <th class="px-3 py-2 text-right">
                <button type="button" class="inline-flex items-center gap-1 font-semibold" @click="toggleSort(portfolioTable, 'return')">
                  Return {{ sortMark(portfolioTable.sortBy, 'return', portfolioTable.sortOrder) }}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="portfolioTable.loading">
              <td colspan="5" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">Loading portfolios...</td>
            </tr>
            <tr v-else-if="portfolioRows.length === 0">
              <td colspan="5" class="px-3 py-4 text-center text-slate-500 dark:text-slate-400">No portfolio rows.</td>
            </tr>
            <tr v-for="row in portfolioRows" :key="`p-${row.id}`" class="border-t border-slate-200 dark:border-slate-800">
              <td class="sticky-col-cell sticky-col-width sticky left-0 z-10 bg-white px-3 py-2 dark:bg-slate-900">
                <p class="font-semibold text-slate-900 dark:text-slate-100">{{ row.name }}</p>
                <p class="text-[11px] text-slate-500 dark:text-slate-400">{{ row.type || "-" }}</p>
              </td>
              <td class="px-3 py-2 text-right font-semibold text-slate-900 dark:text-slate-100"><span :class="maskedClass">{{ formatCurrency(row.current, summaryCurrency) }}</span></td>
              <td class="px-3 py-2 text-right text-slate-700 dark:text-slate-300"><span :class="maskedClass">{{ formatCurrency(row.invested, summaryCurrency) }}</span></td>
              <td class="px-3 py-2 text-right font-semibold" :class="row.profit >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                <span :class="maskedClass">{{ row.profit >= 0 ? "+" : "" }}{{ formatCurrency(row.profit, summaryCurrency) }}</span>
              </td>
              <td class="px-3 py-2 text-right font-semibold" :class="(row.returnPct ?? 0) >= 0 ? 'text-emerald-500' : 'text-rose-500'">
                {{ formatPercent(row.returnPct) }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
        <p>Total: {{ portfolioTable.total }}</p>
        <div class="inline-flex items-center gap-2">
          <button type="button" class="rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" :disabled="portfolioTable.page <= 1" @click="portfolioTable.page -= 1">Prev</button>
          <span>Page {{ portfolioTable.page }} / {{ Math.max(1, Math.ceil(portfolioTable.total / portfolioTable.pageSize)) }}</span>
          <button type="button" class="rounded-lg border border-slate-300 px-2 py-1 text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800" :disabled="portfolioTable.page >= Math.max(1, Math.ceil(portfolioTable.total / portfolioTable.pageSize))" @click="portfolioTable.page += 1">Next</button>
        </div>
      </div>
    </article>
  </main>
</template>
