import { http } from "./http";

export type DividendProvider = "DATA_GO_KR" | "ALPHA_VANTAGE";
export type DividendMarket = "KR" | "US";

export type DividendEventOut = {
  provider: DividendProvider;
  provider_event_id: string;
  market: DividendMarket;
  symbol: string | null;
  isin_code: string | null;
  crno: string | null;
  asset_name: string | null;
  dividend_type: string | null;
  declaration_date: string | null;
  ex_dividend_date: string | null;
  record_date: string | null;
  payment_date: string | null;
  dividend_base_date: string | null;
  fiscal_year: number | null;
  dividend_currency: string;
  dividend_per_share_gross: string | number;
  tax_rate_pct: string | number;
  withholding_tax_amount_per_share: string | number;
  dividend_per_share_net_estimated: string | number;
  raw: Record<string, unknown> | null;
};

export type DividendLookupOut = {
  provider: DividendProvider;
  source: string;
  market: DividendMarket;
  symbol: string | null;
  asset_id: number | null;
  asset_name: string | null;
  display_name: string | null;
  currency: string;
  tax_rate_pct: string | number;
  total_count: number;
  returned_count: number;
  year: number | null;
  items: DividendEventOut[];
  warnings: string[];
};

export type DividendUpdateJobStartOut = {
  job_id: string;
  status: string;
  created_at: string;
  total_assets: number;
};

export type DividendUpdateJobStatusOut = {
  job_id: string;
  status: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  total_assets: number;
  processed_assets: number;
  updated_count: number;
  skipped_count: number;
  failed_count: number;
  errors: string[];
  snapshot_collected: boolean;
  snapshot_currency: string | null;
  snapshot_date: string | null;
  snapshot_user_scopes: number;
  snapshot_error: string | null;
};

export type DividendSchedulerStatusOut = {
  enabled: boolean;
  running: boolean;
  job_id: string;
  interval_hours: number | null;
  misfire_grace_seconds: number | null;
  coalesce: boolean;
  max_instances: number;
  job_running: boolean;
  next_run_at: string | null;
  last_event: string | null;
  last_started_at: string | null;
  last_finished_at: string | null;
  last_duration_seconds: number | null;
  last_success_at: string | null;
  last_failure_at: string | null;
  last_error: string | null;
  last_summary: Record<string, unknown> | null;
  last_snapshot_collected: boolean | null;
  last_snapshot_error: string | null;
  run_count: number;
  success_count: number;
  failure_count: number;
  missed_count: number;
  max_instances_missed_count: number;
  last_missed_at: string | null;
  last_missed_scheduled_run_at: string | null;
};

export type DividendSnapshotSummaryOut = {
  id: number;
  scope_type: string;
  scope_id: number;
  display_currency: string;
  dividend_year: number;
  snapshot_date: string;
  as_of: string;
  expected_annual_gross: string | number;
  expected_annual_tax: string | number;
  expected_annual_net: string | number;
  received_ytd_gross: string | number;
  received_ytd_tax: string | number;
  received_ytd_net: string | number;
  source: string;
};

export type DividendTableRowOut = {
  portfolio_id: number | null;
  portfolio_name: string;
  asset_id: number | null;
  asset_name: string;
  symbol: string | null;
  income_kind: "DIVIDEND" | "DISTRIBUTION" | string;
  quantity: string | number;
  currency: string;
  confirmed_annual_gross: string | number;
  confirmed_annual_tax: string | number;
  confirmed_annual_net: string | number;
  estimated_annual_gross: string | number;
  estimated_annual_tax: string | number;
  estimated_annual_net: string | number;
  expected_annual_gross: string | number;
  expected_annual_tax: string | number;
  expected_annual_net: string | number;
  received_ytd_gross: string | number;
  received_ytd_tax: string | number;
  received_ytd_net: string | number;
  dividend_yield_pct: string | number | null;
  tax_rate_pct: string | number | null;
  tax_profile: string | null;
  payment_months: number[];
  estimate_method: string | null;
  confidence: string | null;
  missing_reason: string | null;
  confirmed_event_count: number;
  estimated_event_count: number;
  status: string;
};

export type DividendTableOut = {
  configured: boolean;
  display_currency: string;
  dividend_year: number;
  snapshot: DividendSnapshotSummaryOut | null;
  rows: DividendTableRowOut[];
  portfolio_rows: Record<string, unknown>[];
  as_of: string | null;
};

export type DividendReceiptCreateIn = {
  portfolio_id: number;
  asset_id?: number | null;
  received_date: string;
  currency: string;
  gross_amount: string | number;
  withholding_tax?: string | number;
  net_amount?: string | number | null;
  tax_rate_pct?: string | number | null;
  tax_country?: string | null;
  memo?: string | null;
};

export type DividendReceiptOut = {
  id: number;
  owner_user_id: number;
  portfolio_id: number;
  portfolio_name: string | null;
  asset_id: number | null;
  asset_name: string | null;
  symbol: string | null;
  transaction_id: number | null;
  received_date: string;
  currency: string;
  gross_amount: string | number;
  withholding_tax: string | number;
  net_amount: string | number;
  tax_rate_pct: string | number | null;
  tax_country: string | null;
  status: string;
  source_type: string;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

export type AssetProviderIdentifierOut = {
  id: number;
  asset_id: number;
  provider: string;
  identifier_type: string;
  identifier_value: string;
  market: string | null;
  is_primary: boolean;
  created_at: string;
  updated_at: string;
};

export type AssetProviderIdentifierIn = {
  asset_id: number;
  provider: string;
  identifier_type: string;
  identifier_value: string;
  market?: string | null;
  is_primary?: boolean;
};

export type AssetDividendSettingUpdateIn = {
  is_enabled: boolean;
  tax_rate_pct?: string | number | null;
  tax_country?: string | null;
  dividend_currency?: string | null;
  manual_annual_dividend_per_share?: string | number | null;
  manual_frequency?: string | null;
  payment_months?: number[];
  note?: string | null;
};

export type AssetDividendSettingOut = AssetDividendSettingUpdateIn & {
  id: number;
  asset_id: number;
  created_at: string;
  updated_at: string;
};

export type DividendStatusRowOut = {
  portfolio_id: number | null;
  portfolio_name: string;
  asset_id: number | null;
  asset_name: string;
  symbol: string | null;
  income_kind: "DIVIDEND" | "DISTRIBUTION" | string;
  asset_currency: string | null;
  quantity: string | number;
  dividend_currency: string | null;
  expected_annual_gross: string | number;
  expected_annual_tax: string | number;
  expected_annual_net: string | number;
  received_ytd_gross: string | number;
  received_ytd_tax: string | number;
  received_ytd_net: string | number;
  dividend_yield_pct: string | number | null;
  tax_rate_pct: string | number | null;
  tax_profile: string | null;
  payment_months: number[];
  estimate_method: string | null;
  confidence: string | null;
  missing_reason: string | null;
  confirmed_event_count: number;
  estimated_event_count: number;
  status: string;
  source: string;
  provider_identifiers: AssetProviderIdentifierOut[];
  identifier_summary: string | null;
  event_count: number;
  last_event_date: string | null;
  last_updated_at: string | null;
  warnings: string[];
};

export type DividendStatusSummaryOut = {
  configured: boolean;
  display_currency: string;
  dividend_year: number;
  snapshot: DividendSnapshotSummaryOut | null;
  expected_annual_gross: string | number;
  expected_annual_tax: string | number;
  expected_annual_net: string | number;
  received_ytd_gross: string | number;
  received_ytd_tax: string | number;
  received_ytd_net: string | number;
  total_assets: number;
  covered_assets: number;
  missing_identifier_assets: number;
  no_event_assets: number;
  disabled_assets: number;
  as_of: string | null;
};

export type DividendStatusOut = {
  summary: DividendStatusSummaryOut;
  scheduler: DividendSchedulerStatusOut | null;
  rows: DividendStatusRowOut[];
};

export type DividendUpdateRunOut = {
  id: number;
  run_type: string;
  status: string;
  scheduled_run_at: string | null;
  started_at: string | null;
  finished_at: string | null;
  duration_seconds: string | number | null;
  total_assets: number;
  processed_assets: number;
  updated_count: number;
  skipped_count: number;
  failed_count: number;
  errors: string[];
  snapshot_collected: boolean;
  snapshot_error: string | null;
  error_message: string | null;
  created_at: string;
};

export type DividendUpdateRunPageOut = {
  items: DividendUpdateRunOut[];
  total: number;
};

export type AssetDividendHistoryOut = {
  asset_id: number;
  asset_name: string;
  symbol: string | null;
  setting: AssetDividendSettingOut | null;
  identifiers: AssetProviderIdentifierOut[];
  events: DividendEventOut[];
  receipts: DividendReceiptOut[];
};

export type DataGoKrDividendQuery = {
  stock_name?: string;
  crno?: string;
  isin_code?: string;
  bas_dt?: string;
  year?: number;
  page?: number;
  page_size?: number;
  max_pages?: number;
  tax_rate_pct?: string | number;
  include_raw?: boolean;
};

export type AlphaVantageDividendQuery = {
  symbol: string;
  year?: number;
  tax_rate_pct?: string | number;
  include_raw?: boolean;
};

export type AssetDividendQuery = {
  year?: number;
  tax_rate_pct?: string | number;
  include_raw?: boolean;
};

export async function getDataGoKrStockDividends(query: DataGoKrDividendQuery): Promise<DividendLookupOut> {
  const { data } = await http.get<DividendLookupOut>("/dividends/providers/data-go-kr/stock", { params: query });
  return data;
}

export async function getAlphaVantageStockDividends(query: AlphaVantageDividendQuery): Promise<DividendLookupOut> {
  const { data } = await http.get<DividendLookupOut>("/dividends/providers/alpha-vantage/stock", { params: query });
  return data;
}

export async function getAssetDividendEvents(assetId: number, query: AssetDividendQuery = {}): Promise<DividendLookupOut> {
  const { data } = await http.get<DividendLookupOut>(`/dividends/assets/${assetId}/events`, { params: query });
  return data;
}

export async function refreshAssetDividends(assetId: number, query: AssetDividendQuery = {}): Promise<DividendLookupOut> {
  const { data } = await http.post<DividendLookupOut>(`/dividends/assets/${assetId}/refresh`, null, { params: query });
  return data;
}

export async function updateDividendsNow(): Promise<DividendUpdateJobStartOut> {
  const { data } = await http.post<DividendUpdateJobStartOut>("/dividends/update-now");
  return data;
}

export async function getDividendUpdateJobStatus(jobId: string): Promise<DividendUpdateJobStatusOut> {
  const { data } = await http.get<DividendUpdateJobStatusOut>(`/dividends/update-jobs/${jobId}`);
  return data;
}

export async function getDividendSchedulerStatus(): Promise<DividendSchedulerStatusOut> {
  const { data } = await http.get<DividendSchedulerStatusOut>("/dividends/scheduler/status");
  return data;
}

export async function getDividendStatus(params: { display_currency?: string; year?: number } = {}): Promise<DividendStatusOut> {
  const { data } = await http.get<DividendStatusOut>("/dividends/status", { params });
  return data;
}

export async function getDividendCoverage(params: { display_currency?: string; year?: number } = {}): Promise<DividendStatusOut> {
  const { data } = await http.get<DividendStatusOut>("/dividends/coverage", { params });
  return data;
}

export async function getDividendUpdateRuns(params: { page?: number; page_size?: number } = {}): Promise<DividendUpdateRunPageOut> {
  const { data } = await http.get<DividendUpdateRunPageOut>("/dividends/update-runs", { params });
  return data;
}

export async function upsertAssetProviderIdentifier(payload: AssetProviderIdentifierIn): Promise<AssetProviderIdentifierOut> {
  const { data } = await http.put<AssetProviderIdentifierOut>("/dividends/identifiers", payload);
  return data;
}

export async function updateAssetDividendSetting(assetId: number, payload: AssetDividendSettingUpdateIn): Promise<AssetDividendSettingOut> {
  const { data } = await http.put<AssetDividendSettingOut>(`/dividends/assets/${assetId}/settings`, payload);
  return data;
}

export async function deleteAssetDividendMetadata(assetId: number): Promise<void> {
  await http.delete(`/dividends/assets/${assetId}/metadata`);
}

export async function getAssetDividendHistory(assetId: number, params: { year?: number } = {}): Promise<AssetDividendHistoryOut> {
  const { data } = await http.get<AssetDividendHistoryOut>(`/dividends/assets/${assetId}/history`, { params });
  return data;
}

export async function getDividendTable(params: { display_currency?: string; year?: number } = {}): Promise<DividendTableOut> {
  const { data } = await http.get<DividendTableOut>("/dividends/table", { params });
  return data;
}

export async function createDividendReceipt(payload: DividendReceiptCreateIn): Promise<DividendReceiptOut> {
  const { data } = await http.post<DividendReceiptOut>("/dividends/receipts", payload);
  return data;
}
