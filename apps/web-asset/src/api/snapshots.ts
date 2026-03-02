import { http } from "./http";
import type { SortOrder } from "./assets";

export type SnapshotSourceType = "MANUAL" | "CSV_PREVIEW";
export type SnapshotMode = "SUMMARY" | "PORTFOLIO_RETURN";
export type SnapshotDisplayCurrency = "KRW" | "USD";

export type SnapshotListSortBy = "captured_at" | "gross" | "net" | "liabilities";
export type SnapshotAllocationTarget = "GROSS" | "LIABILITIES" | "NET" | "HOLDINGS";
export type SnapshotAllocationGroupBy =
  | "PORTFOLIO"
  | "ASSET_CLASS"
  | "ASSET"
  | "LIABILITY_TYPE";

export type SnapshotSummaryOut = {
  id: number;
  owner_user_id: number;
  name: string | null;
  source_type: SnapshotSourceType;
  note: string | null;
  captured_at: string;
  as_of: string;
  display_currency_at_capture: string;
  fx_usd_krw_rate: string | number | null;
  fx_as_of: string | null;
  fx_source: string | null;
  gross_assets_krw: string | number;
  gross_assets_usd: string | number;
  liabilities_krw: string | number;
  liabilities_usd: string | number;
  net_assets_krw: string | number;
  net_assets_usd: string | number;
  invested_principal_krw: string | number;
  invested_principal_usd: string | number;
  debt_adjusted_principal_krw: string | number;
  debt_adjusted_principal_usd: string | number;
  created_at: string;
  warning_count: number;
};

export type SnapshotListItemOut = Omit<SnapshotSummaryOut, "warning_count">;

export type SnapshotListPageOut = {
  items: SnapshotListItemOut[];
  total: number;
  page: number;
  page_size: number;
  q: string | null;
  sort_by: SnapshotListSortBy;
  sort_order: SortOrder;
};

export type SnapshotAllocationItemOut = {
  key: string;
  label: string;
  value: string | number;
  ratio_pct: string | number;
  return_pct?: string | number | null;
};

export type SnapshotAllocationOut = {
  snapshot_id: number;
  target: SnapshotAllocationTarget;
  group_by: SnapshotAllocationGroupBy;
  display_currency: string;
  total: string | number;
  items: SnapshotAllocationItemOut[];
  as_of: string;
};

export type SnapshotPortfolioSortBy =
  | "portfolio"
  | "current"
  | "invested_principal"
  | "portfolio_profit"
  | "return";

export type SnapshotPortfolioRowOut = {
  id: number;
  snapshot_id: number;
  portfolio_id: number | null;
  portfolio_name: string;
  portfolio_type: string | null;
  base_currency: string | null;
  current: string | number;
  invested_principal: string | number;
  portfolio_profit: string | number;
  return_pct: string | number | null;
  net_contribution: string | number;
  liabilities: string | number;
  net_assets: string | number;
  debt_adjusted_principal: string | number;
};

export type SnapshotPortfolioTablePageOut = {
  items: SnapshotPortfolioRowOut[];
  total: number;
  page: number;
  page_size: number;
  sort_by: SnapshotPortfolioSortBy;
  sort_order: SortOrder;
  portfolio_id: number | null;
};

export type SnapshotHoldingSortBy =
  | "portfolio"
  | "asset"
  | "price"
  | "avg_cost"
  | "evaluated"
  | "cost_basis"
  | "profit"
  | "return"
  | "symbol";

export type SnapshotHoldingRowOut = {
  id: number;
  snapshot_id: number;
  portfolio_id: number | null;
  portfolio_name: string;
  asset_id: number | null;
  asset_name: string;
  symbol: string | null;
  asset_class: string;
  asset_currency: string;
  quantity: string | number;
  price: string | number;
  price_currency: string;
  avg_cost: string | number;
  avg_cost_currency: string;
  evaluated: string | number;
  cost_basis: string | number;
  profit: string | number;
  return_pct: string | number | null;
  quote_as_of: string | null;
  quote_source: string | null;
};

export type SnapshotHoldingTablePageOut = {
  items: SnapshotHoldingRowOut[];
  total: number;
  page: number;
  page_size: number;
  sort_by: SnapshotHoldingSortBy;
  sort_order: SortOrder;
  portfolio_id: number | null;
  q: string | null;
};

export type SnapshotLiabilitySortBy = "portfolio" | "liability" | "balance" | "type";

export type SnapshotLiabilityRowOut = {
  id: number;
  snapshot_id: number;
  portfolio_id: number | null;
  portfolio_name: string;
  liability_id: number | null;
  liability_name: string;
  liability_type: string;
  balance: string | number;
  balance_currency: string;
};

export type SnapshotLiabilityTablePageOut = {
  items: SnapshotLiabilityRowOut[];
  total: number;
  page: number;
  page_size: number;
  sort_by: SnapshotLiabilitySortBy;
  sort_order: SortOrder;
  portfolio_id: number | null;
  q: string | null;
};

export type SnapshotSeriesPointOut = {
  snapshot_id: number;
  label: string;
  captured_at: string;
  gross: string | number;
  liabilities: string | number;
  net: string | number;
};

export type SnapshotSeriesLinePointOut = {
  snapshot_id: number;
  value: string | number;
};

export type SnapshotSeriesLineOut = {
  key: string;
  label: string;
  points: SnapshotSeriesLinePointOut[];
};

export type SnapshotSeriesOut = {
  mode: SnapshotMode;
  display_currency: string;
  points: SnapshotSeriesPointOut[];
  portfolio_lines: SnapshotSeriesLineOut[];
  holding_lines: SnapshotSeriesLineOut[];
};

export type SnapshotCsvPreviewOut = {
  file_name: string;
  summary: SnapshotSummaryOut;
  portfolio_rows: SnapshotPortfolioRowOut[];
  holding_rows: SnapshotHoldingRowOut[];
  liability_rows: SnapshotLiabilityRowOut[];
};

export type SnapshotDeleteOut = {
  requested: number;
  deleted: number;
  deleted_ids: number[];
};

export type SnapshotListQuery = {
  page?: number;
  page_size?: number;
  q?: string;
  from?: string;
  to?: string;
  sort_by?: SnapshotListSortBy;
  sort_order?: SortOrder;
  display_currency?: SnapshotDisplayCurrency;
};

export type SnapshotAllocationQuery = {
  target?: SnapshotAllocationTarget;
  group_by?: SnapshotAllocationGroupBy;
  portfolio_id?: number;
  top_n?: number;
  others_label?: string;
  display_currency?: SnapshotDisplayCurrency;
};

export type SnapshotPortfolioTableQuery = {
  page?: number;
  page_size?: number;
  sort_by?: SnapshotPortfolioSortBy;
  sort_order?: SortOrder;
  portfolio_id?: number;
  display_currency?: SnapshotDisplayCurrency;
};

export type SnapshotHoldingTableQuery = {
  page?: number;
  page_size?: number;
  sort_by?: SnapshotHoldingSortBy;
  sort_order?: SortOrder;
  portfolio_id?: number;
  q?: string;
  display_currency?: SnapshotDisplayCurrency;
};

export type SnapshotLiabilityTableQuery = {
  page?: number;
  page_size?: number;
  sort_by?: SnapshotLiabilitySortBy;
  sort_order?: SortOrder;
  portfolio_id?: number;
  q?: string;
  display_currency?: SnapshotDisplayCurrency;
};

export type SnapshotSeriesQuery = {
  mode?: SnapshotMode;
  snapshot_ids?: string;
  portfolio_id?: number;
  holding_ids?: string;
  display_currency?: SnapshotDisplayCurrency;
};

export async function captureSnapshot(payload: { name?: string; note?: string } = {}): Promise<SnapshotSummaryOut> {
  const { data } = await http.post<SnapshotSummaryOut>("/snapshots/capture", payload);
  return data;
}

export async function getSnapshots(params: SnapshotListQuery = {}): Promise<SnapshotListPageOut> {
  const { data } = await http.get<SnapshotListPageOut>("/snapshots", { params });
  return data;
}

export async function getSnapshotSummary(snapshotId: number): Promise<SnapshotSummaryOut> {
  const { data } = await http.get<SnapshotSummaryOut>(`/snapshots/${snapshotId}/summary`);
  return data;
}

export async function getSnapshotAllocation(
  snapshotId: number,
  params: SnapshotAllocationQuery = {},
): Promise<SnapshotAllocationOut> {
  const { data } = await http.get<SnapshotAllocationOut>(`/snapshots/${snapshotId}/allocation`, { params });
  return data;
}

export async function getSnapshotPortfoliosTable(
  snapshotId: number,
  params: SnapshotPortfolioTableQuery = {},
): Promise<SnapshotPortfolioTablePageOut> {
  const { data } = await http.get<SnapshotPortfolioTablePageOut>(`/snapshots/${snapshotId}/portfolios/table`, { params });
  return data;
}

export async function getSnapshotHoldingsTable(
  snapshotId: number,
  params: SnapshotHoldingTableQuery = {},
): Promise<SnapshotHoldingTablePageOut> {
  const { data } = await http.get<SnapshotHoldingTablePageOut>(`/snapshots/${snapshotId}/holdings/table`, { params });
  return data;
}

export async function getSnapshotLiabilitiesTable(
  snapshotId: number,
  params: SnapshotLiabilityTableQuery = {},
): Promise<SnapshotLiabilityTablePageOut> {
  const { data } = await http.get<SnapshotLiabilityTablePageOut>(`/snapshots/${snapshotId}/liabilities/table`, { params });
  return data;
}

export async function getSnapshotSeries(params: SnapshotSeriesQuery = {}): Promise<SnapshotSeriesOut> {
  const { data } = await http.get<SnapshotSeriesOut>("/snapshots/series", { params });
  return data;
}

export async function exportSnapshotCsv(snapshotId: number): Promise<Blob> {
  const response = await http.get(`/snapshots/${snapshotId}/export.csv`, { responseType: "blob" });
  return response.data as Blob;
}

export async function previewSnapshotCsv(file: File): Promise<SnapshotCsvPreviewOut> {
  const formData = new FormData();
  formData.append("file", file);
  const { data } = await http.post<SnapshotCsvPreviewOut>("/snapshots/csv/preview", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function deleteSnapshots(ids: number[]): Promise<SnapshotDeleteOut> {
  const { data } = await http.post<SnapshotDeleteOut>("/snapshots/delete", { ids });
  return data;
}
