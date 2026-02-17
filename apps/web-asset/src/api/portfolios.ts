import { http } from "./http";
import type { SortOrder } from "./assets";

export type PortfolioCategory =
  | "KR_STOCK"
  | "US_STOCK"
  | "CRYPTO"
  | "REAL_ESTATE"
  | "BOND"
  | "CASH"
  | "DEPOSIT_SAVING"
  | "ETC";

export type PortfolioOut = {
  id: number;
  owner_user_id: number;
  name: string;
  type: string;
  base_currency: string;
  exchange_code: string | null;
  category: PortfolioCategory | null;
  memo: string | null;
  is_included: boolean;
  is_hidden: boolean;
  cumulative_deposit_amount: string | number;
  cumulative_withdrawal_amount: string | number;
  cashflow_source_type: string;
  created_at: string;
  updated_at: string;
};

export type PortfolioTableSortBy =
  | "id"
  | "name"
  | "type"
  | "base_currency"
  | "exchange_code"
  | "category"
  | "is_included"
  | "is_hidden"
  | "cumulative_deposit_amount"
  | "cumulative_withdrawal_amount"
  | "gross_assets_total"
  | "liabilities_total"
  | "net_assets_total"
  | "principal_minus_debt_total"
  | "net_assets_profit_total"
  | "net_assets_return_pct"
  | "total_pnl_amount"
  | "total_return_pct"
  | "cashflow_source_type"
  | "updated_at"
  | "holding_count"
  | "liability_count";

export type PortfolioTableRowOut = PortfolioOut & {
  holding_count: number;
  liability_count: number;
  gross_assets_total: string | number;
  liabilities_total: string | number;
  net_assets_total: string | number;
  principal_minus_debt_total: string | number;
  net_assets_profit_total: string | number;
  net_assets_return_pct: string | number | null;
  total_pnl_amount: string | number;
  total_return_pct: string | number | null;
};

export type PortfolioTablePageOut = {
  items: PortfolioTableRowOut[];
  total: number;
  page: number;
  page_size: number;
  sort_by: PortfolioTableSortBy;
  sort_order: SortOrder;
  q: string | null;
};

export type PortfoliosTableQuery = {
  page?: number;
  page_size?: number;
  sort_by?: PortfolioTableSortBy;
  sort_order?: SortOrder;
  q?: string;
  include_hidden?: boolean;
  include_excluded?: boolean;
};

export type PortfolioCreateIn = {
  name: string;
  type?: string;
  base_currency?: string;
  exchange_code?: string | null;
  category?: PortfolioCategory | null;
  memo?: string | null;
  is_included?: boolean;
  is_hidden?: boolean;
  cumulative_deposit_amount?: string | number;
  cumulative_withdrawal_amount?: string | number;
  cashflow_source_type?: string;
};

export type PortfolioUpdateIn = Partial<PortfolioCreateIn>;

export async function getPortfolios(): Promise<PortfolioOut[]> {
  const { data } = await http.get<PortfolioOut[]>("/portfolios");
  return data;
}

export async function getPortfoliosTable(params: PortfoliosTableQuery = {}): Promise<PortfolioTablePageOut> {
  const { data } = await http.get<PortfolioTablePageOut>("/portfolios/table", { params });
  return data;
}

export async function createPortfolio(payload: PortfolioCreateIn): Promise<PortfolioOut> {
  const { data } = await http.post<PortfolioOut>("/portfolios", payload);
  return data;
}

export async function updatePortfolio(portfolioId: number, payload: PortfolioUpdateIn): Promise<PortfolioOut> {
  const { data } = await http.patch<PortfolioOut>(`/portfolios/${portfolioId}`, payload);
  return data;
}

export async function deletePortfolio(portfolioId: number): Promise<void> {
  await http.delete(`/portfolios/${portfolioId}`);
}
