import { http } from "./http";

export type AnalyticsSummaryV2Out = {
  scope_type: string;
  scope_id: number;
  user_count: number;
  display_currency: string;
  gross_assets_total: string | number;
  liabilities_total: string | number;
  net_assets_total: string | number;
  principal_minus_debt_total: string | number;
  debt_adjusted_principal_total: string | number;
  net_assets_profit_total: string | number;
  net_assets_return_pct: string | number | null;
  invested_principal_total: string | number;
  withdrawn_total: string | number;
  net_contribution_total: string | number;
  principal_profit_total: string | number;
  principal_return_pct: string | number | null;
  as_of: string;
};

export type AnalyticsAllocationTarget = "GROSS" | "LIABILITIES" | "NET" | "HOLDINGS";

export type AnalyticsAllocationGroupBy =
  | "PORTFOLIO"
  | "ASSET_CLASS"
  | "ASSET"
  | "LIABILITY_TYPE";

export type AnalyticsAllocationItemOut = {
  key: string;
  label: string;
  value: string | number;
  ratio_pct: string | number;
  return_pct?: string | number | null;
};

export type AnalyticsAllocationOut = {
  target: AnalyticsAllocationTarget;
  group_by: AnalyticsAllocationGroupBy;
  scope_type: string;
  scope_id: number;
  display_currency: string;
  total: string | number;
  items: AnalyticsAllocationItemOut[];
  as_of: string;
};

export type AnalyticsNetworthSeriesPointOut = {
  snapshot_date: string;
  gross_assets_total: string | number;
  liabilities_total: string | number;
  net_assets_total: string | number;
  as_of: string;
  source: string;
};

export type AnalyticsNetworthSeriesLinePointOut = {
  snapshot_date: string;
  value: string | number;
};

export type AnalyticsNetworthSeriesLineOut = {
  key: string;
  label: string;
  points: AnalyticsNetworthSeriesLinePointOut[];
};

export type AnalyticsNetworthSeriesOut = {
  scope_type: string;
  scope_id: number;
  display_currency: string;
  mode: "SUMMARY" | "PORTFOLIO_RETURN";
  points: AnalyticsNetworthSeriesPointOut[];
  portfolio_lines: AnalyticsNetworthSeriesLineOut[];
};

export type AnalyticsSnapshotCollectOut = {
  snapshot_date: string;
  display_currency: string;
  user_scopes_collected: number;
  household_scopes_collected: number;
  upserted_rows: number;
};

export type QuickInsightPeriod = "1D" | "7D" | "30D";

export type AnalyticsQuickInsightDeltaItemOut = {
  entity_type: "HOLDING" | "LIABILITY" | "PORTFOLIO";
  key: string;
  label: string;
  portfolio_name?: string | null;
  delta_amount?: string | number | null;
  delta_return_pct?: string | number | null;
  current_value?: string | number | null;
  baseline_value?: string | number | null;
  delta_cost_basis?: string | number | null;
  current_cost_basis?: string | number | null;
  baseline_cost_basis?: string | number | null;
  current_return_pct?: string | number | null;
  baseline_return_pct?: string | number | null;
  status?: "NEW" | "REMOVED" | null;
  asset_class?: string | null;
  display_class?: string | null;
};

export type AnalyticsQuickInsightDriverGroupOut = {
  top_gainers: AnalyticsQuickInsightDeltaItemOut[];
  top_losers: AnalyticsQuickInsightDeltaItemOut[];
};

export type AnalyticsQuickInsightRankedGroupOut = {
  top_gainers: AnalyticsQuickInsightDeltaItemOut[];
  top_losers: AnalyticsQuickInsightDeltaItemOut[];
};

export type AnalyticsQuickInsightPortfolioChangesOut = {
  top_current_value_changes: AnalyticsQuickInsightDeltaItemOut[];
  top_net_value_changes: AnalyticsQuickInsightDeltaItemOut[];
};

export type AnalyticsQuickInsightWarningItemOut = {
  key: string;
  label: string;
  portfolio_name?: string | null;
  symbol?: string | null;
  asset_class?: string | null;
  display_class?: string | null;
  quote_source?: string | null;
  quote_as_of?: string | null;
};

export type AnalyticsQuickInsightWarningsOut = {
  missing_snapshot: boolean;
  stale_quote_count: number;
  manual_quote_count: number;
  missing_quote_count: number;
  manual_quotes: AnalyticsQuickInsightWarningItemOut[];
  missing_quotes: AnalyticsQuickInsightWarningItemOut[];
};

export type AnalyticsQuickInsightSummaryAlertOut = {
  gross_delta?: string | number | null;
  net_delta?: string | number | null;
  liabilities_delta?: string | number | null;
  severity: "positive" | "negative" | "neutral";
  comment: string;
};

export type AnalyticsQuickInsightOut = {
  period: QuickInsightPeriod;
  baseline_snapshot_date?: string | null;
  current_as_of: string;
  has_baseline: boolean;
  summary_alert: AnalyticsQuickInsightSummaryAlertOut;
  gross_drivers: AnalyticsQuickInsightDriverGroupOut;
  net_drivers: AnalyticsQuickInsightDriverGroupOut;
  profit_movers: AnalyticsQuickInsightRankedGroupOut;
  return_movers: AnalyticsQuickInsightRankedGroupOut;
  portfolio_changes: AnalyticsQuickInsightPortfolioChangesOut;
  warnings: AnalyticsQuickInsightWarningsOut;
};

export type SummaryQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  display_currency?: "KRW" | "USD";
  include_hidden?: boolean;
  include_excluded_portfolios?: boolean;
  include_excluded_liabilities?: boolean;
};

export type AllocationQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  target?: AnalyticsAllocationTarget;
  group_by?: AnalyticsAllocationGroupBy;
  top_n?: number;
  others_label?: string;
  portfolio_id?: number;
  include_hidden?: boolean;
  include_excluded_portfolios?: boolean;
  include_excluded_liabilities?: boolean;
  display_currency?: "KRW" | "USD";
};

export type NetworthSeriesQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  display_currency?: "KRW" | "USD";
  mode?: "SUMMARY" | "PORTFOLIO_RETURN";
  portfolio_metric?: "RETURN" | "PROFIT" | "CURRENT" | "CURRENT_NET";
  portfolio_id?: number;
  bucket?: "DAY" | "WEEK" | "MONTH";
  limit?: number;
};

export type SnapshotCollectQuery = {
  display_currency?: "KRW" | "USD";
  snapshot_date?: string;
  include_users?: boolean;
  include_households?: boolean;
};

export type QuickInsightQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  display_currency?: "KRW" | "USD";
  period?: QuickInsightPeriod;
};

export async function getSummary(params: SummaryQuery = {}): Promise<AnalyticsSummaryV2Out> {
  const { data } = await http.get<AnalyticsSummaryV2Out>("/analytics/summary", { params });
  return data;
}

export async function getAllocation(params: AllocationQuery = {}): Promise<AnalyticsAllocationOut> {
  const { data } = await http.get<AnalyticsAllocationOut>("/analytics/allocation", { params });
  return data;
}

export async function getNetworthSeries(params: NetworthSeriesQuery = {}): Promise<AnalyticsNetworthSeriesOut> {
  const { data } = await http.get<AnalyticsNetworthSeriesOut>("/analytics/networth-series", { params });
  return data;
}

export async function getQuickInsight(params: QuickInsightQuery = {}): Promise<AnalyticsQuickInsightOut> {
  const { data } = await http.get<AnalyticsQuickInsightOut>("/analytics/quick-insight", { params });
  return data;
}

export async function collectSnapshots(params: SnapshotCollectQuery = {}): Promise<AnalyticsSnapshotCollectOut> {
  const { data } = await http.post<AnalyticsSnapshotCollectOut>("/analytics/snapshots/collect", null, { params });
  return data;
}
