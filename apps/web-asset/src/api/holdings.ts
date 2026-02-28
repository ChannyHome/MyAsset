import { http } from "./http";
import type { SortOrder } from "./assets";
import type { EditMode, RebaselineOut } from "./portfolios";

export type HoldingOut = {
  id: number;
  owner_user_id: number;
  portfolio_id: number | null;
  asset_id: number;
  quantity: string | number;
  avg_price: string | number;
  avg_price_currency: string;
  invested_amount: string | number | null;
  invested_amount_currency: string;
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
  avg_price_currency: string;
  avg_cost: string | number;
  avg_cost_currency: string;
  invested_amount: string | number;
  invested_amount_currency: string;
  cost_basis_total: string | number;
  cost_basis_currency: string;
  current_price: string | number | null;
  current_price_currency: string | null;
  evaluated_amount: string | number | null;
  pnl_amount: string | number | null;
  pnl_pct: string | number | null;
  quote_as_of: string | null;
};

export type HoldingTableSortBy =
  | "id"
  | "portfolio_name"
  | "asset_name"
  | "asset_symbol"
  | "quantity"
  | "avg_price"
  | "invested_amount"
  | "current_price"
  | "evaluated_amount"
  | "pnl_pct"
  | "source_type"
  | "is_hidden"
  | "updated_at"
  | "quote_as_of";

export type HoldingTableRowOut = HoldingOut & {
  portfolio_name: string | null;
  asset_name: string;
  asset_symbol: string | null;
  asset_class: string;
  asset_currency: string;
  current_price: string | number | null;
  current_price_currency: string | null;
  avg_cost: string | number;
  avg_cost_currency: string;
  cost_basis_total: string | number;
  cost_basis_currency: string;
  evaluated_amount: string | number;
  pnl_amount: string | number;
  pnl_pct: string | number | null;
  quote_as_of: string | null;
  quote_source: string | null;
};

export type HoldingTablePageOut = {
  items: HoldingTableRowOut[];
  total: number;
  page: number;
  page_size: number;
  sort_by: HoldingTableSortBy;
  sort_order: SortOrder;
  q: string | null;
};

export type HoldingsPerformanceQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  display_currency?: "KRW" | "USD";
  include_hidden?: boolean;
  include_excluded_portfolios?: boolean;
};

export type HoldingsQuery = {
  scope_type?: "USER" | "HOUSEHOLD";
  scope_id?: number;
  include_hidden?: boolean;
  include_excluded_portfolios?: boolean;
};

export type HoldingsTableQuery = {
  page?: number;
  page_size?: number;
  sort_by?: HoldingTableSortBy;
  sort_order?: SortOrder;
  q?: string;
  display_currency?: "KRW" | "USD";
  include_hidden?: boolean;
  include_excluded_portfolios?: boolean;
};

export type HoldingCreateIn = {
  portfolio_id?: number | null;
  asset_id: number;
  quantity: string | number;
  avg_price: string | number;
  avg_price_currency?: string;
  invested_amount?: string | number | null;
  invested_amount_currency?: string;
  source_type?: string;
  is_hidden?: boolean;
  memo?: string | null;
};

export type HoldingUpdateIn = Partial<HoldingCreateIn>;

export type HoldingRebaselineIn = {
  effective_at: string;
  quantity: string | number;
  avg_price: string | number;
  avg_price_currency?: string;
  invested_amount?: string | number | null;
  invested_amount_currency?: string | null;
  reason?: string | null;
};

export async function getHoldings(params: HoldingsQuery = {}): Promise<HoldingOut[]> {
  const { data } = await http.get<HoldingOut[]>("/holdings", { params });
  return data;
}

export async function getHoldingsTable(params: HoldingsTableQuery = {}): Promise<HoldingTablePageOut> {
  const { data } = await http.get<HoldingTablePageOut>("/holdings/table", { params });
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

export async function updateHolding(
  holdingId: number,
  payload: HoldingUpdateIn,
  options?: { edit_mode?: EditMode },
): Promise<HoldingOut> {
  const { data } = await http.patch<HoldingOut>(`/holdings/${holdingId}`, payload, {
    params: options?.edit_mode ? { edit_mode: options.edit_mode } : undefined,
  });
  return data;
}

export async function rebaselineHolding(holdingId: number, payload: HoldingRebaselineIn): Promise<RebaselineOut> {
  const { data } = await http.post<RebaselineOut>(`/holdings/${holdingId}/rebaseline`, payload);
  return data;
}

export async function deleteHolding(holdingId: number): Promise<void> {
  await http.delete(`/holdings/${holdingId}`);
}
