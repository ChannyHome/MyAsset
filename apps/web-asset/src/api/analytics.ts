import { http } from "./http";

export type AnalyticsSummaryV2Out = {
  scope_type: string;
  scope_id: number;
  user_count: number;
  display_currency: string;
  owned_assets_total: string | number;
  liabilities_total: string | number;
  gross_assets_total: string | number;
  net_assets_total: string | number;
  invested_principal_total: string | number;
  withdrawn_total: string | number;
  principal_profit_total: string | number;
  principal_return_pct: string | number | null;
  principal_plus_debt_total: string | number;
  gross_assets_profit_total: string | number;
  gross_assets_return_pct: string | number | null;
  as_of: string;
};

export type SummaryQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  include_hidden?: boolean;
  include_excluded_portfolios?: boolean;
  include_excluded_liabilities?: boolean;
};

export async function getSummary(params: SummaryQuery = {}): Promise<AnalyticsSummaryV2Out> {
  const { data } = await http.get<AnalyticsSummaryV2Out>("/analytics/summary", { params });
  return data;
}

