<script setup lang="ts">
import { AxiosError } from "axios";
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from "vue";

import {
  getAllocation,
  getNetworthSeries,
  getSummary,
  type AnalyticsSummaryV2Out,
  type NetworthTrendBucket,
  type NetworthTrendRange,
} from "../api/analytics";
import KpiBreakdownCards from "../components/KpiBreakdownCards.vue";
import AllocationDonutCard from "../components/AllocationDonutCard.vue";
import AllocationTreemapCard from "../components/AllocationTreemapCard.vue";
import NetworthTrendCard from "../components/NetworthTrendCard.vue";
import KpiSummaryCard from "../components/KpiSummaryCard.vue";
import KpiPortfolioSummaryCard from "../components/KpiPortfolioSummaryCard.vue";
import DashboardPanelContainer from "../components/DashboardPanelContainer.vue";
import PortfolioStatusTableCard from "../components/PortfolioStatusTableCard.vue";
import HoldingsStatusTableCard from "../components/HoldingsStatusTableCard.vue";
import LiabilitiesStatusTableCard from "../components/LiabilitiesStatusTableCard.vue";
import QuickInsightPanel from "../components/QuickInsightPanel.vue";
import GoalProgressForecastCard from "../components/GoalProgressForecastCard.vue";
import CompositionStackedCard from "../components/CompositionStackedCard.vue";
import type {
  HoldingStatusRow,
  LiabilityStatusRow,
  PortfolioOption,
  PortfolioStatusRow,
  SortOrder as TableSortOrder,
} from "../components/statusTableTypes";
import { getHoldingsPerformance, getHoldingsTable, type HoldingPerformanceOut, type HoldingTableRowOut } from "../api/holdings";
import { getLiabilitiesTable, type LiabilityTableRowOut } from "../api/liabilities";
import { getPortfoliosTable, type PortfolioTableRowOut } from "../api/portfolios";
import { getReleaseNotes, type ReleaseNoteOut } from "../api/releaseNotes";
import { getMe, type AuthMeOut } from "../api/auth";
import {
  getQuoteSchedulerStatus,
  getQuoteUpdateJobStatus,
  updateQuotesNow,
  type QuoteSchedulerStatusOut,
} from "../api/quotes";
import { useDisplayCurrency } from "../composables/useDisplayCurrency";
import {
  useDashboardDataAdapter,
  type DashboardAllocationVm,
} from "../composables/useDashboardDataAdapter";
import type { ReleaseNoteItem } from "../data/releaseNotes";
import { formatDateTimeSeoul } from "../utils/datetime";

const LIVE_MASK_STORAGE_KEY = "myasset:home:live-mask-amounts";
const LIVE_TREND_PREF_STORAGE_KEY = "myasset:home:live-trend-pref";
const LIVE_PORTFOLIO_NET_BASIS_STORAGE_KEY = "myasset:home:portfolio-net-basis";
const HOME_TABLE_SECTION_STORAGE_KEY = "myasset:home:table-sections";
const HOME_QUOTE_UPDATE_META_STORAGE_KEY = "myasset:home:quote-update-meta";
const HOME_CARD_ORDER_STORAGE_KEY = "myasset:home:card-order";
const HOME_QUOTE_UPDATE_POLL_MS = 1500;
const HOME_QUOTE_UPDATE_POLL_TIMEOUT_MS = 180000;
const HOME_TREND_ASSET_TOP_N = 5;

type HomePortfolioSortKey = "portfolio" | "current" | "invested_principal" | "portfolio_profit" | "return";
type HomeHoldingSortKey = "portfolio" | "asset" | "price" | "avg_cost" | "evaluated" | "cost_basis" | "profit" | "return" | "symbol";
type HomeLiabilitySortKey = "portfolio" | "liability" | "balance" | "type";
type HomeTrendMode = "SUMMARY" | "PORTFOLIO" | "ASSET";
type HomeTrendLine = { key: string; label: string; points: Array<{ snapshot_date: string; value: number }> };
type HomeTrendAssetMover = {
  key: string;
  label: string;
  current_value: number;
  baseline_value: number;
  delta_value: number;
  current_profit: number;
  baseline_profit: number;
  delta_profit: number;
  current_return_pct: number | null;
  baseline_return_pct: number | null;
  delta_return_pct: number | null;
  current_cost_basis: number;
  baseline_cost_basis: number;
  delta_cost_basis: number;
  status: "NEW" | "REMOVED" | null;
};
type HomeTrendAssetMovers = {
  top_gainers: HomeTrendAssetMover[];
  top_losers: HomeTrendAssetMover[];
};
type HomeTrendPortfolioMover = {
  portfolio_id: number | null;
  portfolio_name: string;
  portfolio_type: string | null;
  current_value: number;
  baseline_value: number;
  delta_value: number;
  current_net: number;
  baseline_net: number;
  delta_net: number;
  current_liabilities: number;
  baseline_liabilities: number;
  delta_liabilities: number;
  current_invested: number;
  baseline_invested: number;
  delta_invested: number;
  current_profit: number;
  baseline_profit: number;
  delta_profit: number;
  current_return_pct: number | null;
  baseline_return_pct: number | null;
  delta_return_pct: number | null;
  driver_type: "CAPITAL_LED" | "PERFORMANCE_LED" | "WITHDRAWAL_LED" | "LIABILITY_LED" | "MIXED" | "NEUTRAL";
  status: "NEW" | "REMOVED" | null;
};
type HomeTrendPortfolioMovers = {
  top_gainers: HomeTrendPortfolioMover[];
  top_losers: HomeTrendPortfolioMover[];
};
type HomeCardKey =
  | "LIVE_DASHBOARD"
  | "GOAL_PROGRESS"
  | "PORTFOLIOS_TABLE"
  | "HOLDINGS_TABLE"
  | "LIABILITIES_TABLE"
  | "REPORT_PANEL"
  | "QUICK_INSIGHT"
  | "RELEASE_NOTES";

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

function toNullableNumber(value: string | number | null | undefined): number | null {
  if (value == null) return null;
  const num = typeof value === "number" ? value : Number(value);
  return Number.isFinite(num) ? num : null;
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
  return formatDateTimeSeoul(value);
}

function getHomeTablePageSize(): number {
  if (typeof window === "undefined") return 10;
  return window.matchMedia("(max-width: 768px)").matches ? 6 : 10;
}

function getDefaultTrendRange(): NetworthTrendRange {
  if (typeof window === "undefined") return "3M";
  return window.matchMedia("(max-width: 768px)").matches ? "1M" : "3M";
}

function todayDateString(): string {
  return new Date().toISOString().slice(0, 10);
}

function oneMonthBeforeDateString(baseDate: string): string {
  const date = baseDate ? new Date(`${baseDate}T00:00:00`) : new Date();
  date.setMonth(date.getMonth() - 1);
  return date.toISOString().slice(0, 10);
}

function ensureHomeTrendCustomDates(): void {
  const end = homeTrendCustomEndDate.value || homeTrendRangeEndDate.value || todayDateString();
  homeTrendCustomEndDate.value = end;
  homeTrendCustomStartDate.value = homeTrendCustomStartDate.value || homeTrendRangeStartDate.value || oneMonthBeforeDateString(end);
}

function homeTrendRangeQuery() {
  if (homeTrendRange.value !== "CUSTOM") {
    return { range: homeTrendRange.value };
  }
  ensureHomeTrendCustomDates();
  return {
    range: homeTrendRange.value,
    start_date: homeTrendCustomStartDate.value,
    end_date: homeTrendCustomEndDate.value,
  };
}

function toHomePortfolioSortBy(key: HomePortfolioSortKey) {
  if (key === "portfolio") return "name" as const;
  if (key === "current") return "gross_assets_total" as const;
  if (key === "invested_principal") return "net_contribution_total" as const;
  if (key === "portfolio_profit") return "portfolio_profit_total" as const;
  return "total_return_pct" as const;
}

function toHomeHoldingSortBy(key: HomeHoldingSortKey) {
  if (key === "portfolio") return "portfolio_name" as const;
  if (key === "asset") return "asset_name" as const;
  if (key === "price") return "current_price" as const;
  if (key === "avg_cost") return "avg_price" as const;
  if (key === "evaluated") return "evaluated_amount" as const;
  if (key === "cost_basis") return "invested_amount" as const;
  if (key === "profit") return "evaluated_amount" as const;
  if (key === "return") return "pnl_pct" as const;
  return "asset_symbol" as const;
}

function toHomeLiabilitySortBy(key: HomeLiabilitySortKey) {
  if (key === "portfolio") return "portfolio_name" as const;
  if (key === "liability") return "name" as const;
  if (key === "balance") return "outstanding_balance" as const;
  return "liability_type" as const;
}

const loading = ref(false);
const errorMessage = ref("");
const summary = ref<AnalyticsSummaryV2Out | null>(null);
const holdings = ref<HoldingPerformanceOut[]>([]);
const liabilities = ref<LiabilityTableRowOut[]>([]);
const portfolios = ref<PortfolioTableRowOut[]>([]);
const releaseNoteItems = ref<ReleaseNoteItem[]>([]);
const me = ref<AuthMeOut | null>(null);
const liveDashboardExpanded = ref(false);
const homePortfoliosExpanded = ref(false);
const homeHoldingsExpanded = ref(false);
const homeLiabilitiesExpanded = ref(false);
const reportPanelExpanded = ref(false);
const releaseNotesExpanded = ref(false);
const exportingImage = ref(false);
const liveDashboardTarget = ref<"GROSS" | "LIABILITIES" | "NET" | "HOLDINGS">("GROSS");
const liveDonutStartPosition = ref<"TOP" | "RIGHT" | "LEFT">("TOP");
const liveKpiTarget = ref<"SUMMARY" | "PORTFOLIOS">("SUMMARY");
const livePortfolioNetBasis = ref(false);
const liveMaskAmounts = ref(false);
const homeTrendMode = ref<HomeTrendMode>("SUMMARY");
const homeTrendPortfolioMetric = ref<"CURRENT_VALUE" | "CURRENT_NET" | "RETURN" | "PROFIT">("RETURN");
const homeTrendAssetMetric = ref<"CURRENT_VALUE" | "RETURN" | "PROFIT">("CURRENT_VALUE");
const homeTrendRange = ref<NetworthTrendRange>("3M");
const homeTrendBucket = ref<NetworthTrendBucket>("DAY");
const homeTrendRangeStartDate = ref<string | null>(null);
const homeTrendRangeEndDate = ref<string | null>(null);
const homeTrendCustomStartDate = ref("");
const homeTrendCustomEndDate = ref("");
const liveTrendVisibility = reactive({
  gross: true,
  liabilities: true,
  net: true,
});
const homeTrendPortfolioKey = ref("ALL");
const homePortfolioTrendPoints = ref<Array<{ label: string; gross: number; liabilities: number; net: number }>>([]);
const homeTrendPortfolioLines = ref<HomeTrendLine[]>([]);
const homeTrendPortfolioMovers = ref<HomeTrendPortfolioMovers | null>(null);
const homeTrendAssetLines = ref<HomeTrendLine[]>([]);
const homeTrendAssetOptions = ref<Array<{ key: string; label: string }>>([]);
const homeTrendAssetKey = ref("TOP_MOVERS");
const homeTrendAssetMovers = ref<HomeTrendAssetMovers | null>(null);
const homeTrendLoading = ref(false);
const homeTrendError = ref("");
const quoteUpdateJobId = ref("");
const quoteUpdateStatus = ref<"IDLE" | "QUEUED" | "RUNNING" | "COMPLETED" | "FAILED">("IDLE");
const quoteUpdatePolling = ref(false);
const quoteUpdateProcessed = ref(0);
const quoteUpdateTotal = ref(0);
const quoteUpdateLastProcessed = ref(-1);
const quoteUpdateLastResultStatus = ref<"COMPLETED" | "FAILED" | "">("");
const quoteUpdateLastFinishedAt = ref("");
const quoteUpdateLastSummary = ref("");
const quoteSchedulerStatus = ref<QuoteSchedulerStatusOut | null>(null);
const quoteSchedulerStatusError = ref("");
const homeActionToast = ref<{ kind: "INFO" | "SUCCESS" | "ERROR"; message: string } | null>(null);
const livePortfolioKey = ref("ALL");
const homePortfolioKey = ref("ALL");
const homePortfolioRows = ref<PortfolioStatusRow[]>([]);
const homeHoldingRows = ref<HoldingStatusRow[]>([]);
const homeLiabilityRows = ref<LiabilityStatusRow[]>([]);
const homeHoldingSearchTerm = ref("");
const homeLiabilitySearchTerm = ref("");
let homeHoldingSearchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let homeLiabilitySearchDebounceTimer: ReturnType<typeof setTimeout> | null = null;
let homeActionToastTimer: ReturnType<typeof setTimeout> | null = null;
let quoteUpdatePollTimer: ReturnType<typeof setTimeout> | null = null;
const homePortfolioTable = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  sortBy: "current" as HomePortfolioSortKey,
  sortOrder: "desc" as TableSortOrder,
  loading: false,
});

const homeHoldingTable = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  sortBy: "evaluated" as HomeHoldingSortKey,
  sortOrder: "desc" as TableSortOrder,
  q: "",
  loading: false,
});

const homeLiabilityTable = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  sortBy: "balance" as HomeLiabilitySortKey,
  sortOrder: "desc" as TableSortOrder,
  q: "",
  loading: false,
});
const DEFAULT_HOME_CARD_ORDER: HomeCardKey[] = [
  "LIVE_DASHBOARD",
  "GOAL_PROGRESS",
  "PORTFOLIOS_TABLE",
  "HOLDINGS_TABLE",
  "LIABILITIES_TABLE",
  "REPORT_PANEL",
  "QUICK_INSIGHT",
  "RELEASE_NOTES",
];
const homeCardOrder = ref<HomeCardKey[]>([...DEFAULT_HOME_CARD_ORDER]);
const homeCardDraggingKey = ref<HomeCardKey | null>(null);

const liveDashboardRef = ref<HTMLElement | null>(null);
const { displayCurrency, ensureInitialized } = useDisplayCurrency();
const canManageQuoteUpdates = computed(() => me.value?.role === "ADMIN" || me.value?.role === "MAINTAINER");

const summaryDisplayCurrency = computed(() => summary.value?.display_currency ?? displayCurrency.value);
const homeGoalScopeType = computed<"USER" | "HOUSEHOLD" | null>(() =>
  summary.value?.scope_type === "HOUSEHOLD" ? "HOUSEHOLD" : summary.value?.scope_type === "USER" ? "USER" : null,
);
const homeGoalScopeId = computed<number | null>(() => (summary.value?.scope_id != null ? Number(summary.value.scope_id) : null));
const quickInsightDisplayCurrency = computed<"KRW" | "USD">(() =>
  summaryDisplayCurrency.value === "USD" ? "USD" : "KRW",
);
const grossAssetsTotal = computed(() => toNumber(summary.value?.gross_assets_total));
const netAssetsTotal = computed(() => toNumber(summary.value?.net_assets_total));
const liabilitiesTotal = computed(() => toNumber(summary.value?.liabilities_total));
const investedPrincipalTotal = computed(() => toNumber(summary.value?.invested_principal_total));
const principalMinusDebtTotal = computed(() =>
  toNumber(summary.value?.debt_adjusted_principal_total ?? summary.value?.principal_minus_debt_total),
);
const netAssetsReturnPct = computed(() => toNumber(summary.value?.net_assets_return_pct ?? null));
const principalReturnPct = computed(() => toNumber(summary.value?.principal_return_pct ?? null));
const principalProfitTotal = computed(() => toNumber(summary.value?.principal_profit_total ?? grossAssetsTotal.value - investedPrincipalTotal.value));
const netAssetsProfitTotal = computed(() => toNumber(summary.value?.net_assets_profit_total ?? netAssetsTotal.value - principalMinusDebtTotal.value));
const asOf = computed(() => formatDateTime(summary.value?.as_of));
const quoteUpdateProgressText = computed(() => {
  const total = Number(quoteUpdateTotal.value || 0);
  const processed = Number(quoteUpdateProcessed.value || 0);
  if (total <= 0) return "0/0";
  return `${processed}/${total}`;
});

const quoteUpdateLastResultLabel = computed(() => {
  if (!quoteUpdateLastFinishedAt.value) return "";
  const status = quoteUpdateLastResultStatus.value || "COMPLETED";
  const summary = quoteUpdateLastSummary.value || "-";
  return `Manual last run: ${quoteUpdateLastFinishedAt.value} · ${status} · ${summary}`;
});

const quoteSchedulerStatusLabel = computed(() => {
  if (!canManageQuoteUpdates.value) return "";
  if (quoteSchedulerStatusError.value) return `Auto scheduler: ${quoteSchedulerStatusError.value}`;
  const status = quoteSchedulerStatus.value;
  if (!status) return "";
  if (!status.enabled) return "Auto scheduler: disabled";
  if (!status.running) return "Auto scheduler: stopped";

  const nextRun = formatDateTime(status.next_run_at);
  const lastSuccess = formatDateTime(status.last_success_at);
  const suffix = status.job_running ? " · running now" : "";
  return `Auto scheduler: next ${nextRun || "-"} · last success ${lastSuccess || "-"}${suffix}`;
});

const quoteSchedulerMissedLabel = computed(() => {
  if (!canManageQuoteUpdates.value || !quoteSchedulerStatus.value) return "";
  const missed = Number(quoteSchedulerStatus.value.missed_count || 0);
  const maxInstanceMissed = Number(quoteSchedulerStatus.value.max_instances_missed_count || 0);
  const failure = Number(quoteSchedulerStatus.value.failure_count || 0);
  const parts = [`Missed: ${missed}`];
  if (maxInstanceMissed > 0) parts.push(`Overlap skipped: ${maxInstanceMissed}`);
  if (failure > 0) parts.push(`Failures: ${failure}`);
  return parts.join(" · ");
});

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

const liveKpiPortfolioRows = computed(() => {
  if (livePortfolioKey.value === "ALL") return portfolios.value;
  const parsed = Number(livePortfolioKey.value);
  if (!Number.isFinite(parsed)) return portfolios.value;
  return portfolios.value.filter((item) => Number(item.id) === parsed);
});

const homeTrendPortfolioId = computed<number | undefined>(() => {
  if (homeTrendPortfolioKey.value === "ALL") return undefined;
  const parsed = Number(homeTrendPortfolioKey.value);
  return Number.isFinite(parsed) ? parsed : undefined;
});

const homeTrendPortfolioMoverBasis = computed<"GROSS" | "NET" | "LIABILITIES">(() => {
  if (liveTrendVisibility.gross) return "GROSS";
  if (liveTrendVisibility.net) return "NET";
  if (liveTrendVisibility.liabilities) return "LIABILITIES";
  return "GROSS";
});

const homePortfolioId = computed<number | undefined>(() => {
  if (homePortfolioKey.value === "ALL") return undefined;
  const parsed = Number(homePortfolioKey.value);
  return Number.isFinite(parsed) ? parsed : undefined;
});

const homePortfolioOptions = computed<PortfolioOption[]>(() =>
  portfolios.value.map((item) => ({ key: String(item.id), label: item.name })),
);

const homeTrendPortfolioOptions = computed<PortfolioOption[]>(() => [
  { key: "ALL", label: "All portfolios" },
  ...homePortfolioOptions.value,
]);

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

function resolveLiveAllocationReturnPct(
  rawReturnPct: number | null | undefined,
  target: "GROSS" | "LIABILITIES" | "NET" | "HOLDINGS",
  key: string,
): number | null {
  if (rawReturnPct != null && Number.isFinite(rawReturnPct)) {
    return rawReturnPct;
  }
  if (target === "GROSS" || target === "NET") {
    const match = key.match(/^portfolio:(\d+)$/);
    if (!match) return null;
    return portfolioReturnById.value.get(Number(match[1])) ?? null;
  }
  if (target === "HOLDINGS") {
    const match = key.match(/^asset:(\d+)$/);
    if (!match) return null;
    return holdingReturnByAssetId.value.get(Number(match[1])) ?? null;
  }
  return null;
}

const liveDashboardData = useDashboardDataAdapter({
  target: liveDashboardTarget,
  portfolioKey: livePortfolioKey,
  displayCurrency,
  loadSummary: async () => ({
    gross: grossAssetsTotal.value,
    liabilities: liabilitiesTotal.value,
    net: netAssetsTotal.value,
    invested: investedPrincipalTotal.value,
    debtAdjusted: principalMinusDebtTotal.value,
    asOf: summary.value?.as_of ?? null,
  }),
  loadAllocation: async ({ target, portfolioId, displayCurrency: targetCurrency }) => {
    const normalizedCurrency = targetCurrency === "USD" ? "USD" : "KRW";
    const out = await getAllocation({
      target,
      group_by: target === "HOLDINGS" ? "ASSET" : "PORTFOLIO",
      top_n: 10,
      portfolio_id: portfolioId,
      display_currency: normalizedCurrency,
    });
    return {
      total: toNumber(out.total),
      items: out.items.map((item) => ({
        key: item.key,
        label: item.label,
        value: toNumber(item.value),
        ratioPct: toNumber(item.ratio_pct),
        returnPct: item.return_pct == null ? null : toNumber(item.return_pct),
      })),
    };
  },
  loadTrend: async (targetCurrency) => {
    const normalizedCurrency = targetCurrency === "USD" ? "USD" : "KRW";
	    const out = await getNetworthSeries({
	      display_currency: normalizedCurrency,
	      portfolio_mover_basis: homeTrendPortfolioMoverBasis.value,
	      bucket: homeTrendBucket.value,
	      ...homeTrendRangeQuery(),
	    });
    homeTrendRangeStartDate.value = out.range_start_date;
    homeTrendRangeEndDate.value = out.range_end_date;
    homeTrendPortfolioMovers.value = out.portfolio_movers
      ? {
          top_gainers: (out.portfolio_movers.top_gainers || []).map(mapHomeTrendPortfolioMover),
          top_losers: (out.portfolio_movers.top_losers || []).map(mapHomeTrendPortfolioMover),
        }
      : null;
    return out.points.map((point) => ({
      label: point.snapshot_date,
      gross: toNumber(point.gross_assets_total),
      liabilities: toNumber(point.liabilities_total),
      net: toNumber(point.net_assets_total),
    }));
  },
  resolveReturnPct: resolveLiveAllocationReturnPct,
});

const donutItems = computed<DashboardAllocationVm[]>(() => liveDashboardData.donutItems.value);
const donutTotal = computed(() => liveDashboardData.donutTotal.value);
const liveTreemapItems = computed<DashboardAllocationVm[]>(() => liveDashboardData.treemapItems.value);
const trendPoints = computed(() =>
  homeTrendMode.value === "SUMMARY" ? liveDashboardData.trendPoints.value : homePortfolioTrendPoints.value,
);
const kpiGrossReturnPct = computed(() => liveDashboardData.kpiGrossReturn.value);
const kpiNetReturnPct = computed(() => liveDashboardData.kpiNetReturn.value);
const kpiGrossProfitTotal = computed(() => liveDashboardData.kpiGrossProfit.value);
const kpiNetProfitTotal = computed(() => liveDashboardData.kpiNetProfit.value);
const dashboardDonutLoading = computed(() => loading.value || liveDashboardData.donutLoading.value);
const dashboardDonutError = computed(() => liveDashboardData.donutError.value || errorMessage.value);
const dashboardTreemapLoading = computed(() => loading.value || liveDashboardData.treemapLoading.value);
const dashboardTreemapError = computed(() => liveDashboardData.treemapError.value || errorMessage.value);
const dashboardTrendLoading = computed(() =>
  loading.value || (homeTrendMode.value === "SUMMARY" ? liveDashboardData.trendLoading.value : homeTrendLoading.value),
);
const dashboardTrendError = computed(() =>
  homeTrendMode.value === "SUMMARY"
    ? liveDashboardData.trendError.value || errorMessage.value
    : homeTrendError.value || errorMessage.value,
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

function mapReleaseNotes(notes: ReleaseNoteOut[]): ReleaseNoteItem[] {
  return notes.map((note) => ({
    id: String(note.id),
    releasedAt: note.released_at,
    title: note.title,
    summary: note.summary,
  }));
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

function showHomeActionToast(kind: "INFO" | "SUCCESS" | "ERROR", message: string): void {
  homeActionToast.value = { kind, message };
  if (homeActionToastTimer) {
    clearTimeout(homeActionToastTimer);
  }
  homeActionToastTimer = setTimeout(() => {
    homeActionToast.value = null;
    homeActionToastTimer = null;
  }, 5000);
}

function saveQuoteUpdateMeta(): void {
  if (typeof window === "undefined") return;
  const payload = {
    status: quoteUpdateLastResultStatus.value,
    finishedAt: quoteUpdateLastFinishedAt.value,
    summary: quoteUpdateLastSummary.value,
  };
  window.localStorage.setItem(HOME_QUOTE_UPDATE_META_STORAGE_KEY, JSON.stringify(payload));
}

function loadQuoteUpdateMeta(): void {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(HOME_QUOTE_UPDATE_META_STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Partial<{ status: string; finishedAt: string; summary: string }>;
    if (parsed.status === "COMPLETED" || parsed.status === "FAILED") {
      quoteUpdateLastResultStatus.value = parsed.status;
    }
    if (typeof parsed.finishedAt === "string") {
      quoteUpdateLastFinishedAt.value = parsed.finishedAt;
    }
    if (typeof parsed.summary === "string") {
      quoteUpdateLastSummary.value = parsed.summary;
    }
  } catch {
    // ignore malformed storage values
  }
}

function clearQuoteUpdatePolling(): void {
  if (quoteUpdatePollTimer) {
    clearTimeout(quoteUpdatePollTimer);
    quoteUpdatePollTimer = null;
  }
  quoteUpdatePolling.value = false;
}

async function pollHomeQuoteUpdateJob(jobId: string, startedAtMs: number): Promise<void> {
  try {
    const result = await getQuoteUpdateJobStatus(jobId);
    const normalizedStatus = String(result.status || "").toUpperCase();
    quoteUpdateStatus.value = normalizedStatus === "FAILED" ? "FAILED" : normalizedStatus === "COMPLETED" ? "COMPLETED" : "RUNNING";
    quoteUpdateProcessed.value = Number(result.processed_assets || 0);
    quoteUpdateTotal.value = Number(result.total_assets || 0);

    if (quoteUpdateProcessed.value !== quoteUpdateLastProcessed.value) {
      quoteUpdateLastProcessed.value = quoteUpdateProcessed.value;
      showHomeActionToast("INFO", `Quote update running... ${quoteUpdateProgressText.value}`);
    }

    if (normalizedStatus === "COMPLETED") {
      clearQuoteUpdatePolling();
      quoteUpdateStatus.value = "COMPLETED";
      quoteUpdateLastResultStatus.value = "COMPLETED";
      quoteUpdateLastFinishedAt.value = formatDateTime(result.finished_at || new Date().toISOString());
      quoteUpdateLastSummary.value = `updated=${result.updated_count}, skipped=${result.skipped_count}, failed=${result.failed_count}`;
      saveQuoteUpdateMeta();
      showHomeActionToast("SUCCESS", "Quote update completed. Refreshing Home data...");
      void refreshQuoteSchedulerStatus();
      await loadHomeData();
      return;
    }

    if (normalizedStatus === "FAILED") {
      clearQuoteUpdatePolling();
      quoteUpdateStatus.value = "FAILED";
      const lastError = Array.isArray(result.errors) && result.errors.length > 0 ? String(result.errors[result.errors.length - 1]) : "";
      quoteUpdateLastResultStatus.value = "FAILED";
      quoteUpdateLastFinishedAt.value = formatDateTime(result.finished_at || new Date().toISOString());
      quoteUpdateLastSummary.value = lastError || "Quote update job failed";
      saveQuoteUpdateMeta();
      void refreshQuoteSchedulerStatus();
      showHomeActionToast("ERROR", lastError || "Quote update job failed.");
      return;
    }

    if (Date.now() - startedAtMs > HOME_QUOTE_UPDATE_POLL_TIMEOUT_MS) {
      clearQuoteUpdatePolling();
      quoteUpdateStatus.value = "FAILED";
      quoteUpdateLastResultStatus.value = "FAILED";
      quoteUpdateLastFinishedAt.value = formatDateTime(new Date().toISOString());
      quoteUpdateLastSummary.value = "Polling timed out";
      saveQuoteUpdateMeta();
      void refreshQuoteSchedulerStatus();
      showHomeActionToast("ERROR", "Quote update polling timed out.");
      return;
    }

    quoteUpdatePollTimer = setTimeout(() => {
      void pollHomeQuoteUpdateJob(jobId, startedAtMs);
    }, HOME_QUOTE_UPDATE_POLL_MS);
  } catch (error) {
    clearQuoteUpdatePolling();
    quoteUpdateStatus.value = "FAILED";
    quoteUpdateLastResultStatus.value = "FAILED";
    quoteUpdateLastFinishedAt.value = formatDateTime(new Date().toISOString());
    quoteUpdateLastSummary.value = getErrorMessage(error);
    saveQuoteUpdateMeta();
    void refreshQuoteSchedulerStatus();
    showHomeActionToast("ERROR", getErrorMessage(error));
  }
}

async function runHomeUpdateQuotesNow(): Promise<void> {
  if (!canManageQuoteUpdates.value || quoteUpdatePolling.value || loading.value) {
    return;
  }
  quoteUpdateStatus.value = "QUEUED";
  quoteUpdateProcessed.value = 0;
  quoteUpdateTotal.value = 0;
  quoteUpdateLastProcessed.value = -1;

  try {
    const job = await updateQuotesNow();
    quoteUpdateJobId.value = job.job_id;
    quoteUpdateTotal.value = Number(job.total_assets || 0);
    quoteUpdatePolling.value = true;
    quoteUpdateStatus.value = "RUNNING";
    showHomeActionToast("INFO", `Quote update started (${quoteUpdateProgressText.value})`);
    void refreshQuoteSchedulerStatus();
    void pollHomeQuoteUpdateJob(job.job_id, Date.now());
  } catch (error) {
    clearQuoteUpdatePolling();
    quoteUpdateStatus.value = "FAILED";
    void refreshQuoteSchedulerStatus();
    showHomeActionToast("ERROR", getErrorMessage(error));
  }
}

async function refreshQuoteSchedulerStatus(): Promise<void> {
  if (!canManageQuoteUpdates.value) {
    quoteSchedulerStatus.value = null;
    quoteSchedulerStatusError.value = "";
    return;
  }

  try {
    quoteSchedulerStatus.value = await getQuoteSchedulerStatus();
    quoteSchedulerStatusError.value = "";
  } catch (error) {
    quoteSchedulerStatus.value = null;
    quoteSchedulerStatusError.value = getErrorMessage(error);
  }
}

async function loadHomeData() {
  loading.value = true;
  errorMessage.value = "";
  try {
    const mePromise = getMe().catch(() => null);
    const [
      summaryOut,
      holdingsOut,
      liabilitiesOut,
      portfoliosOut,
      meOut,
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
      mePromise,
    ]);

    summary.value = summaryOut;
    holdings.value = holdingsOut;
    liabilities.value = liabilitiesOut.items;
    portfolios.value = portfoliosOut.items;
    me.value = meOut;
    void refreshQuoteSchedulerStatus();
    if (
      homeTrendPortfolioKey.value !== "ALL" &&
      !portfoliosOut.items.some((item) => String(item.id) === homeTrendPortfolioKey.value)
    ) {
      homeTrendPortfolioKey.value = "ALL";
    }
    await liveDashboardData.refreshAllDashboard();
    if (livePortfolioKey.value !== "ALL" && !portfoliosOut.items.some((item) => String(item.id) === livePortfolioKey.value)) {
      livePortfolioKey.value = "ALL";
    }
    if (homePortfolioKey.value !== "ALL" && !portfoliosOut.items.some((item) => String(item.id) === homePortfolioKey.value)) {
      homePortfolioKey.value = "ALL";
    }
    try {
      const noteRows = await getReleaseNotes({ limit: 20 });
      const mapped = mapReleaseNotes(noteRows);
      releaseNoteItems.value = mapped;
    } catch {
      releaseNoteItems.value = [];
    }
    if (homePortfoliosExpanded.value) {
      void loadHomePortfolioTable();
    }
    if (homeHoldingsExpanded.value) {
      void loadHomeHoldingTable();
    }
    if (homeLiabilitiesExpanded.value) {
      void loadHomeLiabilityTable();
    }
    if (homeTrendMode.value === "PORTFOLIO") {
      void loadHomePortfolioTrend();
    } else if (homeTrendMode.value === "ASSET") {
      void loadHomeAssetTrend();
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    errorMessage.value = `Failed to load dashboard data: ${message}`;
  } finally {
    loading.value = false;
  }
}

async function loadHomePortfolioTrend(): Promise<void> {
  homeTrendLoading.value = true;
  homeTrendError.value = "";
  try {
    const out = await getNetworthSeries({
      display_currency: displayCurrency.value,
      mode: "PORTFOLIO_RETURN",
      portfolio_metric:
        homeTrendPortfolioMetric.value === "CURRENT_VALUE"
          ? "CURRENT"
          : homeTrendPortfolioMetric.value === "CURRENT_NET"
            ? "CURRENT_NET"
            : homeTrendPortfolioMetric.value,
	      portfolio_id: homeTrendPortfolioId.value,
	      bucket: homeTrendBucket.value,
	      ...homeTrendRangeQuery(),
	    });
    homeTrendRangeStartDate.value = out.range_start_date;
    homeTrendRangeEndDate.value = out.range_end_date;
    homePortfolioTrendPoints.value = out.points.map((point) => ({
      label: point.snapshot_date,
      gross: toNumber(point.gross_assets_total),
      liabilities: toNumber(point.liabilities_total),
      net: toNumber(point.net_assets_total),
    }));
    homeTrendPortfolioLines.value = (out.portfolio_lines || []).map((line) => ({
      key: line.key,
      label: line.label,
      points: (line.points || []).map((point) => ({
        snapshot_date: point.snapshot_date,
        value: toNumber(point.value),
      })),
    }));
  } catch (error) {
    homePortfolioTrendPoints.value = [];
    homeTrendPortfolioLines.value = [];
    homeTrendError.value = error instanceof Error ? error.message : "Failed to load portfolio trend";
  } finally {
    homeTrendLoading.value = false;
  }
}

function mapHomeTrendLine(line: { key: string; label: string; points: Array<{ snapshot_date: string; value: string | number }> }): HomeTrendLine {
  return {
    key: line.key,
    label: line.label,
    points: (line.points || []).map((point) => ({
      snapshot_date: point.snapshot_date,
      value: toNumber(point.value),
    })),
  };
}

function mapHomeTrendPortfolioMover(mover: {
  portfolio_id: number | null;
  portfolio_name: string;
  portfolio_type: string | null;
  current_value: string | number;
  baseline_value: string | number;
  delta_value: string | number;
  current_net: string | number;
  baseline_net: string | number;
  delta_net: string | number;
  current_liabilities: string | number;
  baseline_liabilities: string | number;
  delta_liabilities: string | number;
  current_invested: string | number;
  baseline_invested: string | number;
  delta_invested: string | number;
  current_profit: string | number;
  baseline_profit: string | number;
  delta_profit: string | number;
  current_return_pct: string | number | null;
  baseline_return_pct: string | number | null;
  delta_return_pct: string | number | null;
  driver_type: HomeTrendPortfolioMover["driver_type"];
  status: "NEW" | "REMOVED" | null;
}): HomeTrendPortfolioMover {
  return {
    portfolio_id: mover.portfolio_id,
    portfolio_name: mover.portfolio_name,
    portfolio_type: mover.portfolio_type,
    current_value: toNumber(mover.current_value),
    baseline_value: toNumber(mover.baseline_value),
    delta_value: toNumber(mover.delta_value),
    current_net: toNumber(mover.current_net),
    baseline_net: toNumber(mover.baseline_net),
    delta_net: toNumber(mover.delta_net),
    current_liabilities: toNumber(mover.current_liabilities),
    baseline_liabilities: toNumber(mover.baseline_liabilities),
    delta_liabilities: toNumber(mover.delta_liabilities),
    current_invested: toNumber(mover.current_invested),
    baseline_invested: toNumber(mover.baseline_invested),
    delta_invested: toNumber(mover.delta_invested),
    current_profit: toNumber(mover.current_profit),
    baseline_profit: toNumber(mover.baseline_profit),
    delta_profit: toNumber(mover.delta_profit),
    current_return_pct: toNullableNumber(mover.current_return_pct),
    baseline_return_pct: toNullableNumber(mover.baseline_return_pct),
    delta_return_pct: toNullableNumber(mover.delta_return_pct),
    driver_type: mover.driver_type,
    status: mover.status,
  };
}

async function loadHomeAssetTrend(): Promise<void> {
  homeTrendLoading.value = true;
  homeTrendError.value = "";
  try {
    const out = await getNetworthSeries({
      display_currency: displayCurrency.value,
      mode: "ASSET_TREND",
      asset_metric:
        homeTrendAssetMetric.value === "CURRENT_VALUE"
          ? "CURRENT"
          : homeTrendAssetMetric.value,
      asset_key: homeTrendAssetKey.value,
      portfolio_id: homeTrendPortfolioId.value,
	      top_n: HOME_TREND_ASSET_TOP_N,
	      bucket: homeTrendBucket.value,
	      ...homeTrendRangeQuery(),
	    });
    homeTrendRangeStartDate.value = out.range_start_date;
    homeTrendRangeEndDate.value = out.range_end_date;
    homePortfolioTrendPoints.value = out.points.map((point) => ({
      label: point.snapshot_date,
      gross: toNumber(point.gross_assets_total),
      liabilities: toNumber(point.liabilities_total),
      net: toNumber(point.net_assets_total),
    }));
    homeTrendAssetLines.value = (out.asset_lines || []).map(mapHomeTrendLine);
    homeTrendAssetOptions.value = out.asset_options || [];
    homeTrendAssetMovers.value = out.asset_movers
      ? {
          top_gainers: (out.asset_movers.top_gainers || []).map((mover) => ({
            key: mover.key,
            label: mover.label,
            current_value: toNumber(mover.current_value),
            baseline_value: toNumber(mover.baseline_value),
            delta_value: toNumber(mover.delta_value),
            current_profit: toNumber(mover.current_profit),
            baseline_profit: toNumber(mover.baseline_profit),
            delta_profit: toNumber(mover.delta_profit),
            current_return_pct: toNullableNumber(mover.current_return_pct),
            baseline_return_pct: toNullableNumber(mover.baseline_return_pct),
            delta_return_pct: toNullableNumber(mover.delta_return_pct),
            current_cost_basis: toNumber(mover.current_cost_basis),
            baseline_cost_basis: toNumber(mover.baseline_cost_basis),
            delta_cost_basis: toNumber(mover.delta_cost_basis),
            status: mover.status,
          })),
          top_losers: (out.asset_movers.top_losers || []).map((mover) => ({
            key: mover.key,
            label: mover.label,
            current_value: toNumber(mover.current_value),
            baseline_value: toNumber(mover.baseline_value),
            delta_value: toNumber(mover.delta_value),
            current_profit: toNumber(mover.current_profit),
            baseline_profit: toNumber(mover.baseline_profit),
            delta_profit: toNumber(mover.delta_profit),
            current_return_pct: toNullableNumber(mover.current_return_pct),
            baseline_return_pct: toNullableNumber(mover.baseline_return_pct),
            delta_return_pct: toNullableNumber(mover.delta_return_pct),
            current_cost_basis: toNumber(mover.current_cost_basis),
            baseline_cost_basis: toNumber(mover.baseline_cost_basis),
            delta_cost_basis: toNumber(mover.delta_cost_basis),
            status: mover.status,
          })),
        }
      : null;
  } catch (error) {
    homePortfolioTrendPoints.value = [];
    homeTrendAssetLines.value = [];
    homeTrendAssetOptions.value = [];
    homeTrendAssetMovers.value = null;
    homeTrendError.value = error instanceof Error ? error.message : "Failed to load asset trend";
  } finally {
    homeTrendLoading.value = false;
  }
}

async function refreshHomeNetworthTrend(): Promise<void> {
  if (homeTrendMode.value === "PORTFOLIO") {
    await loadHomePortfolioTrend();
    return;
  }
  if (homeTrendMode.value === "ASSET") {
    await loadHomeAssetTrend();
    return;
  }
  await liveDashboardData.refreshTrend();
}

async function applyHomeTrendCustomRange(): Promise<void> {
  homeTrendRange.value = "CUSTOM";
  ensureHomeTrendCustomDates();
  await refreshHomeNetworthTrend();
}

async function resetHomeTrendCustomRange(): Promise<void> {
  homeTrendCustomEndDate.value = homeTrendRangeEndDate.value || todayDateString();
  homeTrendCustomStartDate.value = oneMonthBeforeDateString(homeTrendCustomEndDate.value);
  homeTrendRange.value = getDefaultTrendRange();
  await refreshHomeNetworthTrend();
}

function mapHomePortfolioRow(row: PortfolioTableRowOut): PortfolioStatusRow {
  return {
    id: row.id,
    name: row.name,
    type: row.type,
    current: toNumber(row.gross_assets_total),
    invested: toNumber(row.net_contribution_total),
    profit: toNumber(row.portfolio_profit_total ?? row.total_pnl_amount),
    returnPct: row.total_return_pct == null ? null : toNumber(row.total_return_pct),
  };
}

function mapHomeHoldingRow(row: HoldingTableRowOut): HoldingStatusRow {
  return {
    id: row.id,
    portfolioName: row.portfolio_name || "Unassigned",
    assetName: row.asset_name,
    symbol: row.asset_symbol,
    price: toNumber(row.current_price),
    priceCurrency: row.current_price_currency || summaryDisplayCurrency.value || "KRW",
    avgCost: toNumber(row.avg_cost),
    avgCostCurrency: row.avg_cost_currency || summaryDisplayCurrency.value || "KRW",
    evaluated: toNumber(row.evaluated_amount),
    costBasis: toNumber(row.cost_basis_total),
    profit: toNumber(row.pnl_amount),
    returnPct: row.pnl_pct == null ? null : toNumber(row.pnl_pct),
  };
}

function mapHomeLiabilityRow(row: LiabilityTableRowOut): LiabilityStatusRow {
  return {
    id: row.id,
    portfolioName: row.portfolio_name || "Unassigned",
    name: row.name,
    type: row.liability_type,
    balance: toNumber(row.outstanding_balance),
    balanceCurrency: row.currency || summaryDisplayCurrency.value || "KRW",
  };
}

function toggleHomeSort<T extends { sortBy: string; sortOrder: TableSortOrder; page: number }>(state: T, key: string): void {
  if (state.sortBy === key) {
    state.sortOrder = state.sortOrder === "asc" ? "desc" : "asc";
  } else {
    state.sortBy = key;
    state.sortOrder = "desc";
  }
  state.page = 1;
}

function toggleHomePortfolioSort(key: string): void {
  toggleHomeSort(homePortfolioTable, key as HomePortfolioSortKey);
}

function toggleHomeHoldingSort(key: string): void {
  toggleHomeSort(homeHoldingTable, key as HomeHoldingSortKey);
}

function toggleHomeLiabilitySort(key: string): void {
  toggleHomeSort(homeLiabilityTable, key as HomeLiabilitySortKey);
}

function selectHomeAllPortfolios(): void {
  if (homePortfolioKey.value === "ALL") {
    return;
  }
  homePortfolioKey.value = "ALL";
}

function loadHomeTableSectionState(): void {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(HOME_TABLE_SECTION_STORAGE_KEY);
  if (!raw) return;
  try {
    const parsed = JSON.parse(raw) as Partial<
      Record<
        "live_dashboard" | "report_panel" | "release_notes" | "portfolios" | "holdings" | "liabilities",
        boolean
      >
    >;
    if (typeof parsed.live_dashboard === "boolean") liveDashboardExpanded.value = parsed.live_dashboard;
    if (typeof parsed.report_panel === "boolean") reportPanelExpanded.value = parsed.report_panel;
    if (typeof parsed.release_notes === "boolean") releaseNotesExpanded.value = parsed.release_notes;
    if (typeof parsed.portfolios === "boolean") homePortfoliosExpanded.value = parsed.portfolios;
    if (typeof parsed.holdings === "boolean") homeHoldingsExpanded.value = parsed.holdings;
    if (typeof parsed.liabilities === "boolean") homeLiabilitiesExpanded.value = parsed.liabilities;
  } catch {
    // ignore malformed storage values
  }
}

function saveHomeTableSectionState(): void {
  if (typeof window === "undefined") return;
  const payload = {
    live_dashboard: liveDashboardExpanded.value,
    report_panel: reportPanelExpanded.value,
    release_notes: releaseNotesExpanded.value,
    portfolios: homePortfoliosExpanded.value,
    holdings: homeHoldingsExpanded.value,
    liabilities: homeLiabilitiesExpanded.value,
  };
  window.localStorage.setItem(HOME_TABLE_SECTION_STORAGE_KEY, JSON.stringify(payload));
}

function normalizeHomeCardOrder(value: unknown): HomeCardKey[] {
  if (!Array.isArray(value)) return [...DEFAULT_HOME_CARD_ORDER];
  const next: HomeCardKey[] = [];
  for (const item of value) {
    if (
      (item === "LIVE_DASHBOARD"
        || item === "GOAL_PROGRESS"
        || item === "PORTFOLIOS_TABLE"
        || item === "HOLDINGS_TABLE"
        || item === "LIABILITIES_TABLE"
        || item === "REPORT_PANEL"
        || item === "QUICK_INSIGHT"
        || item === "RELEASE_NOTES")
      && !next.includes(item)
    ) {
      next.push(item);
    }
  }
  for (const key of DEFAULT_HOME_CARD_ORDER) {
    if (!next.includes(key)) next.push(key);
  }
  return next;
}

function restoreHomeCardOrder(): void {
  if (typeof window === "undefined") return;
  const raw = window.localStorage.getItem(HOME_CARD_ORDER_STORAGE_KEY);
  if (!raw) return;
  try {
    homeCardOrder.value = normalizeHomeCardOrder(JSON.parse(raw));
  } catch {
    // ignore malformed storage values
  }
}

function getHomeCardOrder(key: HomeCardKey): number {
  const index = homeCardOrder.value.indexOf(key);
  return index >= 0 ? index : DEFAULT_HOME_CARD_ORDER.indexOf(key);
}

function onHomeCardDragStart(key: HomeCardKey, event: DragEvent): void {
  homeCardDraggingKey.value = key;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", key);
  }
}

function onHomeCardDragOver(event: DragEvent): void {
  event.preventDefault();
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = "move";
  }
}

function onHomeCardDrop(targetKey: HomeCardKey, event: DragEvent): void {
  event.preventDefault();
  const sourceKey = (homeCardDraggingKey.value || event.dataTransfer?.getData("text/plain")) as HomeCardKey | null;
  if (!sourceKey || sourceKey === targetKey) {
    homeCardDraggingKey.value = null;
    return;
  }
  const next = [...homeCardOrder.value];
  const fromIndex = next.indexOf(sourceKey);
  const toIndex = next.indexOf(targetKey);
  if (fromIndex < 0 || toIndex < 0) {
    homeCardDraggingKey.value = null;
    return;
  }
  next.splice(fromIndex, 1);
  next.splice(toIndex, 0, sourceKey);
  homeCardOrder.value = normalizeHomeCardOrder(next);
  homeCardDraggingKey.value = null;
}

function onHomeCardDragEnd(): void {
  homeCardDraggingKey.value = null;
}

async function loadHomePortfolioTable(): Promise<void> {
  homePortfolioTable.loading = true;
  try {
    const out = await getPortfoliosTable({
      page: homePortfolioTable.page,
      page_size: homePortfolioTable.pageSize,
      sort_by: toHomePortfolioSortBy(homePortfolioTable.sortBy),
      sort_order: homePortfolioTable.sortOrder,
      portfolio_id: homePortfolioId.value,
      display_currency: displayCurrency.value,
      include_hidden: false,
      include_excluded: false,
    });
    homePortfolioRows.value = out.items.map(mapHomePortfolioRow);
    homePortfolioTable.total = out.total;
  } finally {
    homePortfolioTable.loading = false;
  }
}

async function loadHomeHoldingTable(): Promise<void> {
  homeHoldingTable.loading = true;
  try {
    const out = await getHoldingsTable({
      page: homeHoldingTable.page,
      page_size: homeHoldingTable.pageSize,
      sort_by: toHomeHoldingSortBy(homeHoldingTable.sortBy),
      sort_order: homeHoldingTable.sortOrder,
      q: homeHoldingTable.q || undefined,
      portfolio_id: homePortfolioId.value,
      display_currency: displayCurrency.value,
      include_hidden: false,
      include_excluded_portfolios: false,
    });
    homeHoldingRows.value = out.items.map(mapHomeHoldingRow);
    homeHoldingTable.total = out.total;
  } finally {
    homeHoldingTable.loading = false;
  }
}

async function loadHomeLiabilityTable(): Promise<void> {
  homeLiabilityTable.loading = true;
  try {
    const out = await getLiabilitiesTable({
      page: homeLiabilityTable.page,
      page_size: homeLiabilityTable.pageSize,
      sort_by: toHomeLiabilitySortBy(homeLiabilityTable.sortBy),
      sort_order: homeLiabilityTable.sortOrder,
      q: homeLiabilityTable.q || undefined,
      portfolio_id: homePortfolioId.value,
      display_currency: displayCurrency.value,
      include_hidden: false,
      include_excluded: false,
    });
    homeLiabilityRows.value = out.items.map(mapHomeLiabilityRow);
    homeLiabilityTable.total = out.total;
  } finally {
    homeLiabilityTable.loading = false;
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
    const savedPortfolioBasis = window.localStorage.getItem(LIVE_PORTFOLIO_NET_BASIS_STORAGE_KEY);
    if (savedPortfolioBasis === "1" || savedPortfolioBasis === "true") {
      livePortfolioNetBasis.value = true;
    } else if (savedPortfolioBasis === "0" || savedPortfolioBasis === "false") {
      livePortfolioNetBasis.value = false;
    }
    const savedTrendPref = window.localStorage.getItem(LIVE_TREND_PREF_STORAGE_KEY);
    if (savedTrendPref) {
      try {
        const parsed = JSON.parse(savedTrendPref) as Partial<{
          gross: boolean;
          liabilities: boolean;
          net: boolean;
          mode: "SUMMARY" | "PORTFOLIO" | "PORTFOLIO_RETURN" | "ASSET";
          portfolioMetric: "CURRENT_VALUE" | "CURRENT_NET" | "RETURN" | "PROFIT";
          assetMetric: "CURRENT_VALUE" | "RETURN" | "PROFIT";
          portfolioKey: string;
	          assetKey: string;
	          range: NetworthTrendRange;
	          bucket: NetworthTrendBucket;
	          customStartDate: string;
	          customEndDate: string;
	        }>;
        if (typeof parsed.gross === "boolean") liveTrendVisibility.gross = parsed.gross;
        if (typeof parsed.liabilities === "boolean") liveTrendVisibility.liabilities = parsed.liabilities;
        if (typeof parsed.net === "boolean") liveTrendVisibility.net = parsed.net;
        if (parsed.mode === "SUMMARY" || parsed.mode === "PORTFOLIO" || parsed.mode === "ASSET") {
          homeTrendMode.value = parsed.mode;
        } else if (parsed.mode === "PORTFOLIO_RETURN") {
          homeTrendMode.value = "PORTFOLIO";
        }
        if (
          parsed.portfolioMetric === "RETURN" ||
          parsed.portfolioMetric === "PROFIT" ||
          parsed.portfolioMetric === "CURRENT_VALUE" ||
          parsed.portfolioMetric === "CURRENT_NET"
        ) {
          homeTrendPortfolioMetric.value = parsed.portfolioMetric;
        }
        if (typeof parsed.portfolioKey === "string" && parsed.portfolioKey.length > 0) {
          homeTrendPortfolioKey.value = parsed.portfolioKey;
        }
        if (parsed.assetMetric === "RETURN" || parsed.assetMetric === "PROFIT" || parsed.assetMetric === "CURRENT_VALUE") {
          homeTrendAssetMetric.value = parsed.assetMetric;
        }
        if (typeof parsed.assetKey === "string" && parsed.assetKey.length > 0) {
          homeTrendAssetKey.value = parsed.assetKey;
        }
        if (parsed.range === "1M" || parsed.range === "3M" || parsed.range === "6M" || parsed.range === "1Y" || parsed.range === "CUSTOM") {
          homeTrendRange.value = parsed.range;
        }
        if (typeof parsed.customStartDate === "string") {
          homeTrendCustomStartDate.value = parsed.customStartDate;
        }
        if (typeof parsed.customEndDate === "string") {
          homeTrendCustomEndDate.value = parsed.customEndDate;
        }
        if (parsed.bucket === "DAY" || parsed.bucket === "WEEK" || parsed.bucket === "MONTH") {
          homeTrendBucket.value = parsed.bucket;
        }
      } catch {
        // ignore malformed storage values
      }
    } else {
      homeTrendRange.value = getDefaultTrendRange();
    }
    loadQuoteUpdateMeta();
    loadHomeTableSectionState();
    restoreHomeCardOrder();
  }
  const pageSize = getHomeTablePageSize();
  homePortfolioTable.pageSize = pageSize;
  homeHoldingTable.pageSize = pageSize;
  homeLiabilityTable.pageSize = pageSize;
  await ensureInitialized();
  await loadHomeData();
});

onBeforeUnmount(() => {
  clearQuoteUpdatePolling();
  if (homeActionToastTimer) {
    clearTimeout(homeActionToastTimer);
    homeActionToastTimer = null;
  }
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
  () => [liveDashboardTarget.value, livePortfolioKey.value] as const,
  ([nextTarget, nextPortfolio], [prevTarget, prevPortfolio]) => {
    if (!summary.value) return;
    if (nextTarget !== prevTarget || nextPortfolio !== prevPortfolio) {
      void liveDashboardData.refreshAllocation();
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

watch(
  () => livePortfolioNetBasis.value,
  (next) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(LIVE_PORTFOLIO_NET_BASIS_STORAGE_KEY, next ? "1" : "0");
  },
);

watch(
  () =>
    [
      liveTrendVisibility.gross,
      liveTrendVisibility.liabilities,
      liveTrendVisibility.net,
      homeTrendMode.value,
      homeTrendPortfolioMetric.value,
      homeTrendAssetMetric.value,
      homeTrendPortfolioKey.value,
      homeTrendAssetKey.value,
	      homeTrendRange.value,
	      homeTrendBucket.value,
	      homeTrendCustomStartDate.value,
	      homeTrendCustomEndDate.value,
	    ] as const,
	  ([gross, liabilities, net, mode, portfolioMetric, assetMetric, portfolioKey, assetKey, range, bucket, customStartDate, customEndDate]) => {
	    if (typeof window === "undefined") return;
	    window.localStorage.setItem(
	      LIVE_TREND_PREF_STORAGE_KEY,
	      JSON.stringify({ gross, liabilities, net, mode, portfolioMetric, assetMetric, portfolioKey, assetKey, range, bucket, customStartDate, customEndDate }),
	    );
	  },
	);

watch(
  () => [liveTrendVisibility.gross, liveTrendVisibility.net, liveTrendVisibility.liabilities] as const,
  () => {
    if (!summary.value || homeTrendMode.value !== "SUMMARY") return;
    void liveDashboardData.refreshTrend();
  },
);

watch(
  () => [
    homeTrendMode.value,
    homeTrendPortfolioMetric.value,
    homeTrendAssetMetric.value,
    homeTrendPortfolioKey.value,
    homeTrendAssetKey.value,
  ] as const,
  ([mode], [prevMode]) => {
    if (!summary.value) return;
    if (mode === "PORTFOLIO") {
      void loadHomePortfolioTrend();
    } else if (mode === "ASSET") {
      void loadHomeAssetTrend();
    } else if (prevMode === "PORTFOLIO" || prevMode === "ASSET") {
      homeTrendError.value = "";
    }
  },
);

watch(
  () => [homeTrendRange.value, homeTrendBucket.value] as const,
  () => {
    if (!summary.value) return;
    if (homeTrendMode.value === "PORTFOLIO") {
      void loadHomePortfolioTrend();
    } else if (homeTrendMode.value === "ASSET") {
      void loadHomeAssetTrend();
    } else {
      void liveDashboardData.refreshTrend();
    }
  },
);

watch(
  () => [
    liveDashboardExpanded.value,
    reportPanelExpanded.value,
    releaseNotesExpanded.value,
    homePortfoliosExpanded.value,
    homeHoldingsExpanded.value,
    homeLiabilitiesExpanded.value,
  ],
  (
    [
      _nextLiveDashboard,
      _nextReportPanel,
      _nextReleaseNotes,
      nextPortfolios,
      nextHoldings,
      nextLiabilities,
    ],
    [
      _prevLiveDashboard,
      _prevReportPanel,
      _prevReleaseNotes,
      prevPortfolios,
      prevHoldings,
      prevLiabilities,
    ],
  ) => {
    saveHomeTableSectionState();
    if (nextPortfolios && !prevPortfolios) {
      void loadHomePortfolioTable();
    }
    if (nextHoldings && !prevHoldings) {
      void loadHomeHoldingTable();
    }
    if (nextLiabilities && !prevLiabilities) {
      void loadHomeLiabilityTable();
    }
  },
);

watch(
  homeCardOrder,
  (next) => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(HOME_CARD_ORDER_STORAGE_KEY, JSON.stringify(normalizeHomeCardOrder(next)));
  },
  { deep: true },
);

watch(
  () => homePortfolioKey.value,
  () => {
    homePortfolioTable.page = 1;
    homeHoldingTable.page = 1;
    homeLiabilityTable.page = 1;
    if (homePortfoliosExpanded.value) {
      void loadHomePortfolioTable();
    }
    if (homeHoldingsExpanded.value) {
      void loadHomeHoldingTable();
    }
    if (homeLiabilitiesExpanded.value) {
      void loadHomeLiabilityTable();
    }
  },
);

watch(
  () => [
    homePortfolioTable.page,
    homePortfolioTable.pageSize,
    homePortfolioTable.sortBy,
    homePortfolioTable.sortOrder,
    displayCurrency.value,
  ],
  () => {
    if (!homePortfoliosExpanded.value) return;
    void loadHomePortfolioTable();
  },
);

watch(
  () => [
    homeHoldingTable.page,
    homeHoldingTable.pageSize,
    homeHoldingTable.sortBy,
    homeHoldingTable.sortOrder,
    homeHoldingTable.q,
    displayCurrency.value,
  ],
  () => {
    if (!homeHoldingsExpanded.value) return;
    void loadHomeHoldingTable();
  },
);

watch(
  () => [
    homeLiabilityTable.page,
    homeLiabilityTable.pageSize,
    homeLiabilityTable.sortBy,
    homeLiabilityTable.sortOrder,
    homeLiabilityTable.q,
    displayCurrency.value,
  ],
  () => {
    if (!homeLiabilitiesExpanded.value) return;
    void loadHomeLiabilityTable();
  },
);

watch(
  () => homeHoldingSearchTerm.value,
  (next) => {
    if (homeHoldingSearchDebounceTimer) {
      clearTimeout(homeHoldingSearchDebounceTimer);
    }
    homeHoldingSearchDebounceTimer = setTimeout(() => {
      homeHoldingTable.q = next.trim();
      homeHoldingTable.page = 1;
      homeHoldingSearchDebounceTimer = null;
    }, 300);
  },
);

watch(
  () => homeLiabilitySearchTerm.value,
  (next) => {
    if (homeLiabilitySearchDebounceTimer) {
      clearTimeout(homeLiabilitySearchDebounceTimer);
    }
    homeLiabilitySearchDebounceTimer = setTimeout(() => {
      homeLiabilityTable.q = next.trim();
      homeLiabilityTable.page = 1;
      homeLiabilitySearchDebounceTimer = null;
    }, 300);
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

    <article
      v-if="homeActionToast"
      class="rounded-2xl border p-3 text-sm shadow-sm"
      :class="
        homeActionToast.kind === 'ERROR'
          ? 'border-rose-200 bg-rose-50 text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200'
          : homeActionToast.kind === 'SUCCESS'
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200'
            : 'border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-900 dark:bg-indigo-950/30 dark:text-indigo-200'
      "
    >
      {{ homeActionToast.message }}
    </article>

    <div class="flex flex-col gap-4">
      <div
        class="rounded-2xl"
        :class="homeCardDraggingKey === 'LIVE_DASHBOARD' ? 'ring-2 ring-indigo-400/70' : ''"
        draggable="true"
        :style="{ order: getHomeCardOrder('LIVE_DASHBOARD') }"
        @dragstart="onHomeCardDragStart('LIVE_DASHBOARD', $event)"
        @dragover="onHomeCardDragOver"
        @drop="onHomeCardDrop('LIVE_DASHBOARD', $event)"
        @dragend="onHomeCardDragEnd"
      >
        <DashboardPanelContainer
      title="Live Dashboard Panel"
      description="Default is collapsed. Expand to preview dashboard widgets and export image."
      source-mode="LIVE"
      :expanded="liveDashboardExpanded"
      collapsed-message="Collapsed. Click Expand to preview and export."
      @toggle="toggleLiveDashboard"
        >
      <template #controls>
        <div class="rounded-2xl border border-slate-200 p-2.5 sm:p-3 dark:border-slate-700">
          <div class="grid gap-2 sm:gap-3 text-sm md:grid-cols-[auto_1fr] md:items-center">
            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">KPI</span>
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                type="button"
                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs"
                :class="liveKpiTarget === 'SUMMARY' ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="liveKpiTarget = 'SUMMARY'"
              >
                Summary
              </button>
              <button
                type="button"
                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs"
                :class="liveKpiTarget === 'PORTFOLIOS' ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="liveKpiTarget = 'PORTFOLIOS'"
              >
                Portfolios
              </button>
            </div>

            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Target</span>
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                v-for="target in (['GROSS', 'LIABILITIES', 'NET', 'HOLDINGS'] as const)"
                :key="`home-target-${target}`"
                type="button"
                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs"
                :class="liveDashboardTarget === target ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="liveDashboardTarget = target"
              >
                {{ target }}
              </button>
            </div>

            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Start</span>
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <button
                v-for="pos in (['TOP', 'RIGHT', 'LEFT'] as const)"
                :key="`home-donut-start-${pos}`"
                type="button"
                class="rounded-lg border px-2.5 py-1 text-[11px] font-semibold sm:px-3 sm:py-1.5 sm:text-xs"
                :class="liveDonutStartPosition === pos ? 'border-indigo-400 bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200' : 'border-slate-300 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800'"
                @click="liveDonutStartPosition = pos"
              >
                {{ pos }}
              </button>
            </div>

            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Portfolio</span>
            <div class="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <select
                v-model="livePortfolioKey"
                class="w-full min-w-0 rounded-lg border border-slate-300 bg-white px-2 py-1 text-[11px] text-slate-700 sm:w-auto sm:min-w-[12rem] sm:py-1.5 sm:text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="ALL">All</option>
                <option v-for="item in portfolios" :key="`home-live-portfolio-${item.id}`" :value="String(item.id)">
                  {{ item.name }}
                </option>
              </select>
              <label class="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-2 py-1 text-[11px] font-semibold text-slate-700 sm:text-xs dark:border-slate-700 dark:text-slate-200">
                <input
                  v-model="livePortfolioNetBasis"
                  type="checkbox"
                  class="h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                />
                Net
              </label>
            </div>

            <span class="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500 dark:text-slate-400">Actions</span>
            <div class="flex w-full flex-wrap items-center gap-1.5 sm:gap-2 sm:justify-end">
              <button
                v-if="canManageQuoteUpdates"
                type="button"
                class="min-w-[10rem] grow rounded-lg border border-emerald-300 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-60 sm:grow-0 sm:px-3 sm:py-1.5 sm:text-xs dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
                :disabled="quoteUpdatePolling || loading"
                @click="runHomeUpdateQuotesNow"
              >
                {{ quoteUpdatePolling ? `Update Quotes Running... ${quoteUpdateProgressText}` : "Update Quotes Now" }}
              </button>
              <span
                v-if="canManageQuoteUpdates && (quoteUpdatePolling || quoteUpdateStatus === 'COMPLETED' || quoteUpdateStatus === 'FAILED')"
                class="rounded-full px-2 py-1 text-[11px] font-semibold"
                :class="
                  quoteUpdatePolling
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-200'
                    : quoteUpdateStatus === 'COMPLETED'
                      ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200'
                      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-200'
                "
              >
                {{
                  quoteUpdatePolling
                    ? `${quoteUpdateStatus} ${quoteUpdateProgressText}`
                    : quoteUpdateStatus
                }}
              </span>
              <button
                type="button"
                class="min-w-[8rem] grow rounded-lg border border-slate-300 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition-colors hover:bg-slate-100 sm:grow-0 sm:px-3 sm:py-1.5 sm:text-xs dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                @click="printLiveDashboard"
              >
                Print
              </button>
              <button
                type="button"
                class="min-w-[8rem] grow rounded-lg border border-emerald-300 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 transition-colors hover:bg-emerald-50 disabled:opacity-60 sm:grow-0 sm:px-3 sm:py-1.5 sm:text-xs dark:border-emerald-800 dark:text-emerald-300 dark:hover:bg-emerald-900/20"
                :disabled="exportingImage || loading || !liveDashboardExpanded"
                @click="exportLiveDashboardImage"
              >
                {{ exportingImage ? "Exporting..." : "Export PNG" }}
              </button>
              <div
                v-if="canManageQuoteUpdates && (quoteUpdateLastResultLabel || quoteSchedulerStatusLabel)"
                class="w-full space-y-0.5 text-[11px] text-slate-500 dark:text-slate-400 sm:text-right"
              >
                <p v-if="quoteUpdateLastResultLabel">
                  {{ quoteUpdateLastResultLabel }}
                </p>
                <p v-if="quoteSchedulerStatusLabel">
                  {{ quoteSchedulerStatusLabel }}
                </p>
                <p v-if="quoteSchedulerMissedLabel" class="text-slate-400 dark:text-slate-500">
                  {{ quoteSchedulerMissedLabel }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </template>

      <div ref="liveDashboardRef" class="grid grid-cols-1 gap-3 xl:grid-cols-2">
        <div class="xl:col-span-2">
          <KpiSummaryCard
            v-if="liveKpiTarget === 'SUMMARY'"
            title="KPI Summary"
            subtitle="Included in print/snapshot"
            storage-key="myasset:home:live-dashboard:kpi-panel:expanded"
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
          <KpiPortfolioSummaryCard
            v-else
            title="KPI Portfolios"
            storage-key="myasset:home:live-dashboard:kpi-panel:expanded"
            :subtitle="`Per portfolio | ${livePortfolioNetBasis ? 'Net basis' : 'Gross basis'} | Included in print/snapshot`"
            :currency="summaryDisplayCurrency"
            :portfolios="liveKpiPortfolioRows"
            :mask-amounts="liveMaskAmounts"
            :use-net-basis="livePortfolioNetBasis"
          />
        </div>

        <AllocationDonutCard
          :title="`Allocation | ${liveDashboardTarget}`"
          :subtitle="`Top N + Others (${livePortfolioKey === 'ALL' ? 'all portfolios' : 'filtered portfolio'})`"
          storage-key="myasset:home:live-dashboard:allocation-donut:expanded"
          :currency="summaryDisplayCurrency"
          :total="donutTotal"
          :items="donutItems"
          :start-position="liveDonutStartPosition"
          :mask-amounts="liveMaskAmounts"
          :loading="dashboardDonutLoading"
          :error="dashboardDonutError"
        />

        <AllocationTreemapCard
          :title="`Treemap | ${liveDashboardTarget}`"
          storage-key="myasset:home:live-dashboard:allocation-treemap:expanded"
          :subtitle="
            liveDashboardTarget === 'HOLDINGS'
              ? `Target=HOLDINGS | group_by=ASSET | color=return ${livePortfolioKey === 'ALL' ? '' : `| ${livePortfolioLabel}`}`
              : `Target=${liveDashboardTarget} | group_by=PORTFOLIO | color=return`
          "
          :currency="summaryDisplayCurrency"
          :items="liveTreemapItems"
          :mask-amounts="liveMaskAmounts"
          :loading="dashboardTreemapLoading"
          :error="dashboardTreemapError"
        />

        <div class="xl:col-span-2">
          <NetworthTrendCard
            title="Networth Trend"
            :subtitle="`valuation_snapshots | range=${homeTrendRange} | bucket=${homeTrendBucket}`"
            storage-key="myasset:home:live-dashboard:networth-trend:expanded"
            :currency="summaryDisplayCurrency"
            :points="trendPoints"
            :mask-amounts="liveMaskAmounts"
            :loading="dashboardTrendLoading"
            :error="dashboardTrendError"
            :show-gross="liveTrendVisibility.gross"
            :show-liabilities="liveTrendVisibility.liabilities"
            :show-net="liveTrendVisibility.net"
            :mode="homeTrendMode"
            :portfolio-metric="homeTrendPortfolioMetric"
            :asset-metric="homeTrendAssetMetric"
            :portfolio-lines="homeTrendPortfolioLines"
            :asset-lines="homeTrendAssetLines"
            :portfolio-options="homeTrendPortfolioOptions"
            :asset-options="homeTrendAssetOptions"
            :portfolio-key="homeTrendPortfolioKey"
            :asset-key="homeTrendAssetKey"
            :portfolio-movers="homeTrendPortfolioMovers"
            :portfolio-mover-basis="homeTrendPortfolioMoverBasis"
            :asset-movers="homeTrendAssetMovers"
            :range="homeTrendRange"
            :bucket="homeTrendBucket"
            :range-start-date="homeTrendRangeStartDate"
            :range-end-date="homeTrendRangeEndDate"
            :custom-start-date="homeTrendCustomStartDate"
            :custom-end-date="homeTrendCustomEndDate"
            :show-refresh-control="true"
            @update:show-gross="liveTrendVisibility.gross = $event"
            @update:show-liabilities="liveTrendVisibility.liabilities = $event"
            @update:show-net="liveTrendVisibility.net = $event"
            @update:mode="homeTrendMode = $event"
            @update:portfolio-metric="homeTrendPortfolioMetric = $event"
            @update:asset-metric="homeTrendAssetMetric = $event"
            @update:portfolio-key="homeTrendPortfolioKey = $event"
            @update:asset-key="homeTrendAssetKey = $event"
            @update:range="homeTrendRange = $event"
            @update:bucket="homeTrendBucket = $event"
            @update:custom-start-date="homeTrendCustomStartDate = $event"
            @update:custom-end-date="homeTrendCustomEndDate = $event"
            @apply-custom-range="applyHomeTrendCustomRange"
            @reset-custom-range="resetHomeTrendCustomRange"
            @refresh="refreshHomeNetworthTrend"
          />
        </div>

        <div class="xl:col-span-2">
          <CompositionStackedCard
            title="Amount Breakdown"
            description="Actual amount changes over time, including total size and component movement."
            chart-kind="AMOUNT"
            :display-currency="summaryDisplayCurrency === 'USD' ? 'USD' : 'KRW'"
            :scope-type="homeGoalScopeType"
            :scope-id="homeGoalScopeId"
            :amount-mask="liveMaskAmounts"
            :portfolio-options="homePortfolioOptions"
            storage-key-prefix="myasset:home:amount-breakdown"
          />
        </div>

        <div class="xl:col-span-2">
          <CompositionStackedCard
            title="Allocation Trend"
            description="100% normalized composition changes over time, separated from total size."
            chart-kind="ALLOCATION"
            :display-currency="summaryDisplayCurrency === 'USD' ? 'USD' : 'KRW'"
            :scope-type="homeGoalScopeType"
            :scope-id="homeGoalScopeId"
            :amount-mask="liveMaskAmounts"
            :portfolio-options="homePortfolioOptions"
            storage-key-prefix="myasset:home:allocation-trend"
          />
        </div>
      </div>
        </DashboardPanelContainer>
      </div>

      <div
        class="rounded-2xl"
        :class="homeCardDraggingKey === 'GOAL_PROGRESS' ? 'ring-2 ring-indigo-400/70' : ''"
        draggable="true"
        :style="{ order: getHomeCardOrder('GOAL_PROGRESS') }"
        @dragstart="onHomeCardDragStart('GOAL_PROGRESS', $event)"
        @dragover="onHomeCardDragOver"
        @drop="onHomeCardDrop('GOAL_PROGRESS', $event)"
        @dragend="onHomeCardDragEnd"
      >
        <GoalProgressForecastCard
          title="Goal Progress and Forecast"
          subtitle="Track how close your current wealth is to the target and when it may be reached."
          :display-currency="summaryDisplayCurrency === 'USD' ? 'USD' : 'KRW'"
          :scope-type="homeGoalScopeType"
          :scope-id="homeGoalScopeId"
          :amount-mask="liveMaskAmounts"
          storage-key-prefix="myasset:home:goal-progress"
        />
      </div>

      <div
        class="rounded-2xl"
        :class="homeCardDraggingKey === 'PORTFOLIOS_TABLE' ? 'ring-2 ring-indigo-400/70' : ''"
        draggable="true"
        :style="{ order: getHomeCardOrder('PORTFOLIOS_TABLE') }"
        @dragstart="onHomeCardDragStart('PORTFOLIOS_TABLE', $event)"
        @dragover="onHomeCardDragOver"
        @drop="onHomeCardDrop('PORTFOLIOS_TABLE', $event)"
        @dragend="onHomeCardDragEnd"
      >
        <PortfolioStatusTableCard
      title="Portfolios Table"
      subtitle="Portfolio / Current / Invested Principal / Profit / Return"
      :expanded="homePortfoliosExpanded"
      :loading="homePortfolioTable.loading"
      :rows="homePortfolioRows"
      :total="homePortfolioTable.total"
      :page="homePortfolioTable.page"
      :page-size="homePortfolioTable.pageSize"
      :sort-by="homePortfolioTable.sortBy"
      :sort-order="homePortfolioTable.sortOrder"
      :currency="summaryDisplayCurrency"
      :mask-amounts="liveMaskAmounts"
      :show-filter="true"
      :portfolio-key="homePortfolioKey"
      :portfolio-options="homePortfolioOptions"
      @toggle="homePortfoliosExpanded = !homePortfoliosExpanded"
      @sort="toggleHomePortfolioSort"
      @set-page="homePortfolioTable.page = $event"
      @select-all="selectHomeAllPortfolios"
      @set-portfolio-key="homePortfolioKey = $event"
        />
      </div>

      <div
        class="rounded-2xl"
        :class="homeCardDraggingKey === 'HOLDINGS_TABLE' ? 'ring-2 ring-indigo-400/70' : ''"
        draggable="true"
        :style="{ order: getHomeCardOrder('HOLDINGS_TABLE') }"
        @dragstart="onHomeCardDragStart('HOLDINGS_TABLE', $event)"
        @dragover="onHomeCardDragOver"
        @drop="onHomeCardDrop('HOLDINGS_TABLE', $event)"
        @dragend="onHomeCardDragEnd"
      >
        <HoldingsStatusTableCard
      title="Holdings Table"
      subtitle="Portfolio / Asset / Price / Avg Cost / Evaluated / Cost Basis / Profit / Return / Symbol"
      :expanded="homeHoldingsExpanded"
      :loading="homeHoldingTable.loading"
      :rows="homeHoldingRows"
      :total="homeHoldingTable.total"
      :page="homeHoldingTable.page"
      :page-size="homeHoldingTable.pageSize"
      :sort-by="homeHoldingTable.sortBy"
      :sort-order="homeHoldingTable.sortOrder"
      :search-term="homeHoldingSearchTerm"
      :mask-amounts="liveMaskAmounts"
      :display-currency="summaryDisplayCurrency"
      @toggle="homeHoldingsExpanded = !homeHoldingsExpanded"
      @sort="toggleHomeHoldingSort"
      @set-page="homeHoldingTable.page = $event"
      @update:search-term="homeHoldingSearchTerm = $event"
        />
      </div>

      <div
        class="rounded-2xl"
        :class="homeCardDraggingKey === 'LIABILITIES_TABLE' ? 'ring-2 ring-indigo-400/70' : ''"
        draggable="true"
        :style="{ order: getHomeCardOrder('LIABILITIES_TABLE') }"
        @dragstart="onHomeCardDragStart('LIABILITIES_TABLE', $event)"
        @dragover="onHomeCardDragOver"
        @drop="onHomeCardDrop('LIABILITIES_TABLE', $event)"
        @dragend="onHomeCardDragEnd"
      >
        <LiabilitiesStatusTableCard
      title="Liabilities Table"
      subtitle="Portfolio / Liability / Balance / Type"
      :expanded="homeLiabilitiesExpanded"
      :loading="homeLiabilityTable.loading"
      :rows="homeLiabilityRows"
      :total="homeLiabilityTable.total"
      :page="homeLiabilityTable.page"
      :page-size="homeLiabilityTable.pageSize"
      :sort-by="homeLiabilityTable.sortBy"
      :sort-order="homeLiabilityTable.sortOrder"
      :search-term="homeLiabilitySearchTerm"
      :mask-amounts="liveMaskAmounts"
      @toggle="homeLiabilitiesExpanded = !homeLiabilitiesExpanded"
      @sort="toggleHomeLiabilitySort"
      @set-page="homeLiabilityTable.page = $event"
      @update:search-term="homeLiabilitySearchTerm = $event"
        />
      </div>

      <div
        class="rounded-2xl"
        :class="homeCardDraggingKey === 'REPORT_PANEL' ? 'ring-2 ring-indigo-400/70' : ''"
        draggable="true"
        :style="{ order: getHomeCardOrder('REPORT_PANEL') }"
        @dragstart="onHomeCardDragStart('REPORT_PANEL', $event)"
        @dragover="onHomeCardDragOver"
        @drop="onHomeCardDrop('REPORT_PANEL', $event)"
        @dragend="onHomeCardDragEnd"
      >
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
                Gross
                <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                  {{ formatCurrency(toNumber(item.gross_assets_total), item.base_currency || summaryDisplayCurrency) }}
                </span>
                /
                Debt-Adjusted Principal
                <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                  {{
                    formatCurrency(
                      toNumber(item.debt_adjusted_principal_total ?? item.principal_minus_debt_total),
                      item.base_currency || summaryDisplayCurrency,
                    )
                  }}
                </span>
              </div>
              <div class="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                Net
                <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                  {{ formatCurrency(toNumber(item.net_assets_total), item.base_currency || summaryDisplayCurrency) }}
                </span>
                ·
                Portfolio Profit
                <span :style="liveMaskAmounts ? { filter: 'blur(6px)' } : undefined">
                  {{
                    formatSignedCurrency(
                      toNumber(item.portfolio_profit_total ?? item.total_pnl_amount),
                      item.base_currency || summaryDisplayCurrency,
                    )
                  }}
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
      </div>

      <div
        class="rounded-2xl"
        :class="homeCardDraggingKey === 'QUICK_INSIGHT' ? 'ring-2 ring-indigo-400/70' : ''"
        draggable="true"
        :style="{ order: getHomeCardOrder('QUICK_INSIGHT') }"
        @dragstart="onHomeCardDragStart('QUICK_INSIGHT', $event)"
        @dragover="onHomeCardDragOver"
        @drop="onHomeCardDrop('QUICK_INSIGHT', $event)"
        @dragend="onHomeCardDragEnd"
      >
        <QuickInsightPanel
          title="Quick Insight"
          description="Valuation snapshot delta analysis"
          source-mode="LIVE"
          :display-currency="quickInsightDisplayCurrency"
          :amount-mask="liveMaskAmounts"
          :allow-custom-compare="true"
          storage-key-prefix="myasset:home:quick-insight"
        />
      </div>

      <div
        class="rounded-2xl"
        :class="homeCardDraggingKey === 'RELEASE_NOTES' ? 'ring-2 ring-indigo-400/70' : ''"
        draggable="true"
        :style="{ order: getHomeCardOrder('RELEASE_NOTES') }"
        @dragstart="onHomeCardDragStart('RELEASE_NOTES', $event)"
        @dragover="onHomeCardDragOver"
        @drop="onHomeCardDrop('RELEASE_NOTES', $event)"
        @dragend="onHomeCardDragEnd"
      >
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
      </div>
    </div>
  </section>
</template>

