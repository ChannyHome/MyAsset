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

export type AnalyticsNetworthSeriesOptionOut = {
  key: string;
  label: string;
};

export type AnalyticsNetworthSeriesAssetMoverOut = {
  key: string;
  label: string;
  current_value: string | number;
  baseline_value: string | number;
  delta_value: string | number;
  current_profit: string | number;
  baseline_profit: string | number;
  delta_profit: string | number;
  current_return_pct: string | number | null;
  baseline_return_pct: string | number | null;
  delta_return_pct: string | number | null;
  current_cost_basis: string | number;
  baseline_cost_basis: string | number;
  delta_cost_basis: string | number;
  status: "NEW" | "REMOVED" | null;
};

export type AnalyticsNetworthSeriesAssetMoversOut = {
  top_gainers: AnalyticsNetworthSeriesAssetMoverOut[];
  top_losers: AnalyticsNetworthSeriesAssetMoverOut[];
};

export type AnalyticsNetworthSeriesPortfolioMoverOut = {
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
  driver_type: "CAPITAL_LED" | "PERFORMANCE_LED" | "WITHDRAWAL_LED" | "LIABILITY_LED" | "MIXED" | "NEUTRAL";
  status: "NEW" | "REMOVED" | null;
};

export type AnalyticsNetworthSeriesPortfolioMoversOut = {
  top_gainers: AnalyticsNetworthSeriesPortfolioMoverOut[];
  top_losers: AnalyticsNetworthSeriesPortfolioMoverOut[];
};

export type AnalyticsNetworthSeriesOut = {
  scope_type: string;
  scope_id: number;
  display_currency: string;
  mode: "SUMMARY" | "PORTFOLIO_RETURN" | "ASSET_TREND";
  range: NetworthTrendRange | null;
  range_start_date: string | null;
  range_end_date: string | null;
  bucket: NetworthTrendBucket;
  points: AnalyticsNetworthSeriesPointOut[];
  portfolio_lines: AnalyticsNetworthSeriesLineOut[];
  asset_lines: AnalyticsNetworthSeriesLineOut[];
  asset_options: AnalyticsNetworthSeriesOptionOut[];
  asset_movers: AnalyticsNetworthSeriesAssetMoversOut | null;
  portfolio_movers: AnalyticsNetworthSeriesPortfolioMoversOut | null;
};

export type NetworthTrendRange = "1M" | "3M" | "6M" | "1Y" | "CUSTOM";
export type NetworthTrendBucket = "DAY" | "WEEK" | "MONTH";

export type AnalyticsCompositionChartKind = "AMOUNT" | "ALLOCATION";
export type AnalyticsCompositionTab = "GROSS_COMPOSITION" | "CAPITAL_STRUCTURE" | "LIABILITY_BREAKDOWN";
export type AnalyticsCompositionMode = "SUMMARY" | "PORTFOLIO";
export type AnalyticsCompositionGroupBy = "ASSET_CLASS" | "PORTFOLIO" | "LIABILITY_TYPE" | "ASSET";
export type AnalyticsCompositionBucket = "DAY" | "WEEK" | "MONTH";

export type AnalyticsCompositionLegendItemOut = {
  key: string;
  label: string;
  color_token: string;
};

export type AnalyticsCompositionSegmentOut = {
  key: string;
  label: string;
  amount: string | number;
  ratio_pct: string | number;
};

export type AnalyticsCompositionPointOut = {
  bucket_label: string;
  snapshot_date: string;
  total_amount: string | number;
  segments: AnalyticsCompositionSegmentOut[];
};

export type AnalyticsCompositionSeriesOut = {
  scope_type: string;
  scope_id: number;
  display_currency: string;
  chart_kind: AnalyticsCompositionChartKind;
  tab: AnalyticsCompositionTab;
  mode: AnalyticsCompositionMode;
  group_by: AnalyticsCompositionGroupBy;
  bucket: AnalyticsCompositionBucket;
  limit: number;
  legend: AnalyticsCompositionLegendItemOut[];
  points: AnalyticsCompositionPointOut[];
  as_of: string;
  has_data: boolean;
};

export type AnalyticsSnapshotCollectOut = {
  snapshot_date: string;
  display_currency: string;
  user_scopes_collected: number;
  household_scopes_collected: number;
  upserted_rows: number;
};

export type QuickInsightPeriod = "1D" | "7D" | "30D" | "CUSTOM";
export type QuickInsightCompareMode = "PRESET" | "CUSTOM";
export type QuickInsightPreset = "1D" | "7D" | "30D";

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
  driver_label?: string | null;
  driver_key?: string | null;
  driver_target?: "GROSS_DRIVERS" | "NET_DRIVERS" | null;
};

export type AnalyticsQuickInsightOut = {
  period: QuickInsightPeriod;
  compare_mode?: QuickInsightCompareMode | null;
  requested_current_date?: string | null;
  requested_compare_date?: string | null;
  matched_current_snapshot_date?: string | null;
  matched_compare_snapshot_date?: string | null;
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
  mode?: "SUMMARY" | "PORTFOLIO_RETURN" | "ASSET_TREND";
  portfolio_metric?: "RETURN" | "PROFIT" | "CURRENT" | "CURRENT_NET";
  portfolio_mover_basis?: "GROSS" | "NET" | "LIABILITIES";
  asset_metric?: "CURRENT" | "PROFIT" | "RETURN";
  asset_key?: string;
  portfolio_id?: number;
  top_n?: number;
  bucket?: NetworthTrendBucket;
  range?: NetworthTrendRange;
  start_date?: string;
  end_date?: string;
  anchor_snapshot_id?: number;
  limit?: number;
};

export type CompositionSeriesQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  display_currency?: "KRW" | "USD";
  chart_kind?: AnalyticsCompositionChartKind;
  tab?: AnalyticsCompositionTab;
  mode?: AnalyticsCompositionMode;
  group_by?: AnalyticsCompositionGroupBy;
  portfolio_id?: number;
  bucket?: AnalyticsCompositionBucket;
  limit?: number;
  top_n?: number;
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
  period?: QuickInsightPreset;
  mode?: QuickInsightCompareMode;
  preset?: QuickInsightPreset;
  current_date?: string;
  compare_date?: string;
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

export async function getCompositionSeries(
  params: CompositionSeriesQuery = {},
): Promise<AnalyticsCompositionSeriesOut> {
  const { data } = await http.get<AnalyticsCompositionSeriesOut>("/analytics/composition-series", { params });
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
