import { http } from "./http";

export type ValuationSnapshotListItemOut = {
  id: number;
  scope_type: string;
  scope_id: number;
  display_currency: string;
  snapshot_date: string;
  created_at: string;
  as_of: string;
  gross: string | number;
  net: string | number;
  liabilities: string | number;
  source: string;
};

export type ValuationSnapshotListOut = {
  items: ValuationSnapshotListItemOut[];
};

export type ValuationSnapshotSummaryOut = {
  id: number;
  scope_type: string;
  scope_id: number;
  display_currency: string;
  snapshot_date: string;
  as_of: string;
  source: string;
  gross_assets_total: string | number;
  liabilities_total: string | number;
  net_assets_total: string | number;
  invested_principal_total: string | number;
  debt_adjusted_principal_total: string | number;
  principal_profit_total: string | number;
  principal_return_pct: string | number | null;
  net_assets_profit_total: string | number;
  net_assets_return_pct: string | number | null;
};

export type ValuationSnapshotPortfolioRowOut = {
  portfolio_id: number | null;
  portfolio_name: string;
  portfolio_type: string | null;
  base_currency: string | null;
  gross_assets_total: string | number;
  liabilities_total: string | number;
  net_assets_total: string | number;
  invested_principal_total: string | number;
  debt_adjusted_principal_total: string | number;
  net_contribution_total: string | number;
  portfolio_profit_total: string | number;
  return_pct: string | number | null;
};

export type ValuationSnapshotHoldingRowOut = {
  portfolio_id: number | null;
  portfolio_name: string | null;
  asset_id: number | null;
  asset_name: string;
  symbol: string | null;
  asset_class: string;
  evaluated_amount: string | number;
  cost_basis_total: string | number;
  profit_total: string | number;
  return_pct: string | number | null;
};

export type ValuationSnapshotLiabilityRowOut = {
  portfolio_id: number | null;
  portfolio_name: string | null;
  liability_id: number | null;
  liability_name: string;
  liability_type: string | null;
  balance_total: string | number;
};

export type ValuationSnapshotAllocationItemOut = {
  key: string;
  label: string;
  value: string | number;
  ratio_pct: string | number;
};

export type ValuationSnapshotDetailOut = {
  summary: ValuationSnapshotSummaryOut;
  portfolios: ValuationSnapshotPortfolioRowOut[];
  holdings: ValuationSnapshotHoldingRowOut[];
  liabilities: ValuationSnapshotLiabilityRowOut[];
  allocation: ValuationSnapshotAllocationItemOut[];
};

export async function getValuationSnapshots(params: {
  scope_type?: string;
  scope_id?: number;
  display_currency?: string;
  limit?: number;
} = {}): Promise<ValuationSnapshotListOut> {
  const { data } = await http.get<ValuationSnapshotListOut>("/valuation-snapshots", { params });
  return data;
}

export async function getValuationSnapshot(id: number): Promise<ValuationSnapshotDetailOut> {
  const { data } = await http.get<ValuationSnapshotDetailOut>(`/valuation-snapshots/${id}`);
  return data;
}

export async function exportValuationSnapshotCsv(id: number): Promise<Blob> {
  const { data } = await http.get(`/valuation-snapshots/${id}/export.csv`, { responseType: "blob" });
  return data;
}
