import { http } from "./http";
import type { SortOrder } from "./assets";

export type TransactionType = "BUY" | "SELL" | "DEPOSIT" | "WITHDRAW" | "DIVIDEND" | "FEE" | "ADJUSTMENT";
export type TransactionStatus = "POSTED" | "VOID";

export type TradeSortBy =
  | "id"
  | "executed_at"
  | "txn_type"
  | "portfolio_id"
  | "portfolio_name"
  | "asset_id"
  | "asset_name"
  | "amount"
  | "amount_in_portfolio_currency"
  | "currency"
  | "status"
  | "updated_at";

export type TradeOut = {
  id: number;
  owner_user_id: number;
  portfolio_id: number;
  asset_id: number | null;
  txn_type: TransactionType;
  quantity: string | number | null;
  unit_price: string | number | null;
  amount: string | number;
  currency: string;
  amount_in_portfolio_currency: string | number;
  fx_rate_used: string | number | null;
  fx_as_of: string | null;
  fx_source: string | null;
  executed_at: string;
  memo: string | null;
  source_type: "MANUAL" | "AUTO";
  auto_apply_cash_holding: boolean;
  auto_apply_portfolio_cashflow: boolean;
  status: TransactionStatus;
  created_at: string;
  updated_at: string;
};

export type TradeRowOut = TradeOut & {
  portfolio_name: string | null;
  asset_name: string | null;
  asset_symbol: string | null;
};

export type TradePageOut = {
  items: TradeRowOut[];
  total: number;
  page: number;
  page_size: number;
  sort_by: TradeSortBy;
  sort_order: SortOrder;
  q: string | null;
};

export type TradeCreateIn = {
  portfolio_id: number;
  txn_type: TransactionType;
  asset_id?: number | null;
  quantity?: string | number | null;
  unit_price?: string | number | null;
  amount?: string | number | null;
  currency?: string;
  executed_at?: string | null;
  memo?: string | null;
  source_type?: "MANUAL" | "AUTO";
  auto_apply_cash_holding?: boolean;
  auto_apply_portfolio_cashflow?: boolean | null;
};

export type TradeUpdateIn = Partial<TradeCreateIn>;

export type TradeRebuildIn = {
  portfolio_id?: number | null;
  asset_id?: number | null;
};

export type TradeRebuildOut = {
  owner_user_id: number;
  portfolio_id: number | null;
  asset_id: number | null;
  affected_portfolios: number;
  affected_holdings: number;
};

export type TradesQuery = {
  page?: number;
  page_size?: number;
  sort_by?: TradeSortBy;
  sort_order?: SortOrder;
  q?: string;
  portfolio_id?: number;
  asset_id?: number;
  txn_type?: TransactionType;
  status?: TransactionStatus;
  from?: string;
  to?: string;
};

export async function getTrades(params: TradesQuery = {}): Promise<TradePageOut> {
  const { data } = await http.get<TradePageOut>("/trades", { params });
  return data;
}

export async function createTrade(payload: TradeCreateIn): Promise<TradeOut> {
  const { data } = await http.post<TradeOut>("/trades", payload);
  return data;
}

export async function updateTrade(tradeId: number, payload: TradeUpdateIn): Promise<TradeOut> {
  const { data } = await http.patch<TradeOut>(`/trades/${tradeId}`, payload);
  return data;
}

export async function voidTrade(tradeId: number): Promise<TradeOut> {
  const { data } = await http.post<TradeOut>(`/trades/${tradeId}/void`);
  return data;
}

export async function rebuildTrades(payload: TradeRebuildIn): Promise<TradeRebuildOut> {
  const { data } = await http.post<TradeRebuildOut>("/trades/rebuild", payload);
  return data;
}
