import { computed, ref, type Ref } from "vue";

export type DashboardTarget = "GROSS" | "LIABILITIES" | "NET" | "HOLDINGS";

export type DashboardSummaryVm = {
  gross: number;
  liabilities: number;
  net: number;
  invested: number;
  debtAdjusted: number;
  asOf: string | null;
};

export type DashboardAllocationVm = {
  key: string;
  label: string;
  value: number;
  ratioPct: number;
  returnPct?: number | null;
};

export type DashboardTrendPointVm = {
  label: string;
  gross: number;
  liabilities: number;
  net: number;
};

type LoadSummaryFn = (displayCurrency: string) => Promise<DashboardSummaryVm | null>;
type LoadAllocationFn = (args: {
  target: DashboardTarget;
  portfolioId?: number;
  displayCurrency: string;
}) => Promise<{ total: number; items: DashboardAllocationVm[] }>;
type LoadTrendFn = (displayCurrency: string) => Promise<DashboardTrendPointVm[]>;
type ResolveReturnPctFn = (
  rawReturnPct: number | null | undefined,
  target: DashboardTarget,
  key: string,
) => number | null;

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

function parsePortfolioId(key: string): number | undefined {
  if (key === "ALL") return undefined;
  const parsed = Number(key);
  return Number.isFinite(parsed) ? parsed : undefined;
}

export function useDashboardDataAdapter(options: {
  target: Ref<DashboardTarget>;
  portfolioKey: Ref<string>;
  displayCurrency: Ref<string>;
  loadSummary: LoadSummaryFn;
  loadAllocation: LoadAllocationFn;
  loadTrend?: LoadTrendFn;
  resolveReturnPct?: ResolveReturnPctFn;
}) {
  const summary = ref<DashboardSummaryVm | null>(null);

  const donutItems = ref<DashboardAllocationVm[]>([]);
  const donutTotal = ref(0);
  const donutLoading = ref(false);
  const donutError = ref("");

  const treemapItems = ref<DashboardAllocationVm[]>([]);
  const treemapLoading = ref(false);
  const treemapError = ref("");

  const trendPoints = ref<DashboardTrendPointVm[]>([]);
  const trendLoading = ref(false);
  const trendError = ref("");

  const kpiGrossProfit = computed(() =>
    summary.value ? summary.value.gross - summary.value.invested : 0,
  );
  const kpiNetProfit = computed(() =>
    summary.value ? summary.value.net - summary.value.debtAdjusted : 0,
  );
  const kpiGrossReturn = computed(() =>
    summary.value && summary.value.invested > 0
      ? ((summary.value.gross - summary.value.invested) / summary.value.invested) * 100
      : null,
  );
  const kpiNetReturn = computed(() =>
    summary.value && summary.value.debtAdjusted > 0
      ? ((summary.value.net - summary.value.debtAdjusted) / summary.value.debtAdjusted) * 100
      : null,
  );

  async function refreshSummary(): Promise<void> {
    summary.value = await options.loadSummary(options.displayCurrency.value);
  }

  async function refreshAllocation(): Promise<void> {
    donutLoading.value = true;
    treemapLoading.value = true;
    donutError.value = "";
    treemapError.value = "";
    try {
      const portfolioId = parsePortfolioId(options.portfolioKey.value);
      const out = await options.loadAllocation({
        target: options.target.value,
        portfolioId,
        displayCurrency: options.displayCurrency.value,
      });
      donutTotal.value = toNumber(out.total);
      const mapped = out.items.map((item) => {
        const rawReturn = toNullable(item.returnPct);
        const resolved = options.resolveReturnPct
          ? options.resolveReturnPct(rawReturn, options.target.value, item.key)
          : rawReturn;
        return {
          key: item.key,
          label: item.label,
          value: toNumber(item.value),
          ratioPct: toNumber(item.ratioPct),
          returnPct: resolved,
        } satisfies DashboardAllocationVm;
      });
      donutItems.value = mapped;
      treemapItems.value = mapped;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to load allocation";
      donutError.value = message;
      treemapError.value = message;
      donutItems.value = [];
      treemapItems.value = [];
      donutTotal.value = 0;
    } finally {
      donutLoading.value = false;
      treemapLoading.value = false;
    }
  }

  async function refreshTrend(): Promise<void> {
    if (!options.loadTrend) {
      trendPoints.value = [];
      trendError.value = "";
      return;
    }
    trendLoading.value = true;
    trendError.value = "";
    try {
      trendPoints.value = await options.loadTrend(options.displayCurrency.value);
    } catch (error) {
      trendPoints.value = [];
      trendError.value = error instanceof Error ? error.message : "Failed to load trend";
    } finally {
      trendLoading.value = false;
    }
  }

  async function refreshAllDashboard(): Promise<void> {
    await refreshSummary();
    await Promise.all([refreshAllocation(), refreshTrend()]);
  }

  return {
    summary,
    donutItems,
    donutTotal,
    donutLoading,
    donutError,
    treemapItems,
    treemapLoading,
    treemapError,
    trendPoints,
    trendLoading,
    trendError,
    kpiGrossProfit,
    kpiNetProfit,
    kpiGrossReturn,
    kpiNetReturn,
    refreshSummary,
    refreshAllocation,
    refreshTrend,
    refreshAllDashboard,
  };
}

