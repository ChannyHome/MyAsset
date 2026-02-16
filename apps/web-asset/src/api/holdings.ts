import { http } from "./http";

export type HoldingOut = {
  id: number;
  owner_user_id: number;
  portfolio_id: number | null;
  asset_id: number;
  quantity: string | number;
  avg_price: string | number;
  invested_amount: string | number | null;
  source_type: string;
  is_hidden: boolean;
  memo: string | null;
  created_at: string;
  updated_at: string;
};

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

export type HoldingsQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  include_hidden?: boolean;
  include_excluded_portfolios?: boolean;
};

export type HoldingCreateIn = {
  portfolio_id?: number | null;
  asset_id: number;
  quantity: string | number;
  avg_price: string | number;
  invested_amount?: string | number | null;
  source_type?: string;
  is_hidden?: boolean;
  memo?: string | null;
};

export type HoldingUpdateIn = Partial<HoldingCreateIn>;

export async function getHoldings(params: HoldingsQuery = {}): Promise<HoldingOut[]> {
  const { data } = await http.get<HoldingOut[]>("/holdings", { params });
  return data;
}

export async function getHoldingsPerformance(
  params: HoldingsPerformanceQuery = {},
): Promise<HoldingPerformanceOut[]> {
  const { data } = await http.get<HoldingPerformanceOut[]>("/holdings/performance", { params });
  return data;
}

export async function createHolding(payload: HoldingCreateIn): Promise<HoldingOut> {
  const { data } = await http.post<HoldingOut>("/holdings", payload);
  return data;
}

export async function updateHolding(holdingId: number, payload: HoldingUpdateIn): Promise<HoldingOut> {
  const { data } = await http.patch<HoldingOut>(`/holdings/${holdingId}`, payload);
  return data;
}

export async function deleteHolding(holdingId: number): Promise<void> {
  await http.delete(`/holdings/${holdingId}`);
}
