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

export type AnalyticsNetworthSeriesOut = {
  scope_type: string;
  scope_id: number;
  display_currency: string;
  points: AnalyticsNetworthSeriesPointOut[];
};

export type AnalyticsSnapshotCollectOut = {
  snapshot_date: string;
  display_currency: string;
  user_scopes_collected: number;
  household_scopes_collected: number;
  upserted_rows: number;
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
  bucket?: "DAY" | "WEEK" | "MONTH";
  limit?: number;
};

export type SnapshotCollectQuery = {
  display_currency?: "KRW" | "USD";
  snapshot_date?: string;
  include_users?: boolean;
  include_households?: boolean;
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

export async function collectSnapshots(params: SnapshotCollectQuery = {}): Promise<AnalyticsSnapshotCollectOut> {
  const { data } = await http.post<AnalyticsSnapshotCollectOut>("/analytics/snapshots/collect", null, { params });
  return data;
}
