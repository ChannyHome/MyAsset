import { http } from "./http";

export type HoldingPerformanceOut = {
  holding_id: number;
  owner_user_id: number;
  portfolio_id: number | null;
  asset_id: number;
  asset_symbol: string | null;
  asset_name: string;
  asset_class: string;
  quantity: string | number;
  avg_price: string | number;
  invested_amount: string | number;
  current_price: string | number | null;
  current_price_currency: string | null;
  evaluated_amount: string | number | null;
  pnl_amount: string | number | null;
  pnl_pct: string | number | null;
  quote_as_of: string | null;
};

export type HoldingsPerformanceQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  include_hidden?: boolean;
  include_excluded_portfolios?: boolean;
};

export async function getHoldingsPerformance(
  params: HoldingsPerformanceQuery = {},
): Promise<HoldingPerformanceOut[]> {
  const { data } = await http.get<HoldingPerformanceOut[]>("/holdings/performance", { params });
  return data;
}

