import { http } from "./http";
import type { SortOrder } from "./assets";

export type EditMode = "SAFE" | "HARD";

export type RebaselineOut = {
  entity_type: string;
  entity_id: number;
  voided_transactions: number;
  baseline_transaction_ids: number[];
  affected_scope: string;
};

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
  | "principal_net"
  | "net_contribution_total"
  | "gross_assets_total"
  | "liabilities_total"
  | "net_assets_total"
  | "principal_minus_debt_total"
  | "debt_adjusted_principal_total"
  | "net_assets_profit_total"
  | "net_assets_return_pct"
  | "total_pnl_amount"
  | "portfolio_profit_total"
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
  net_contribution_total: string | number;
  principal_minus_debt_total: string | number;
  debt_adjusted_principal_total: string | number;
  net_assets_profit_total: string | number;
  net_assets_return_pct: string | number | null;
  total_pnl_amount: string | number;
  portfolio_profit_total: string | number;
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
  portfolio_id?: number;
  display_currency?: "KRW" | "USD";
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

export type PortfolioRebaselineIn = {
  effective_at: string;
  rebaseline_all_history?: boolean;
  cumulative_deposit_amount: string | number;
  cumulative_withdrawal_amount: string | number;
  reason?: string | null;
};

export type PortfolioCashAccountOut = {
  id: number;
  owner_user_id: number;
  portfolio_id: number;
  currency: string;
  asset_id: number;
  asset_name: string | null;
  asset_symbol: string | null;
  created_at: string;
  updated_at: string;
};

export type PortfolioCashAccountSetIn = {
  asset_id: number;
};

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

export async function updatePortfolio(
  portfolioId: number,
  payload: PortfolioUpdateIn,
  options?: { edit_mode?: EditMode },
): Promise<PortfolioOut> {
  const { data } = await http.patch<PortfolioOut>(`/portfolios/${portfolioId}`, payload, {
    params: options?.edit_mode ? { edit_mode: options.edit_mode } : undefined,
  });
  return data;
}

export async function rebaselinePortfolio(
  portfolioId: number,
  payload: PortfolioRebaselineIn,
): Promise<RebaselineOut> {
  const { data } = await http.post<RebaselineOut>(`/portfolios/${portfolioId}/rebaseline`, payload);
  return data;
}

export async function deletePortfolio(portfolioId: number): Promise<void> {
  await http.delete(`/portfolios/${portfolioId}`);
}

export async function getPortfolioCashAccounts(portfolioId: number): Promise<PortfolioCashAccountOut[]> {
  const { data } = await http.get<PortfolioCashAccountOut[]>(`/portfolios/${portfolioId}/cash-accounts`);
  return data;
}

export async function setPortfolioCashAccount(
  portfolioId: number,
  currency: string,
  payload: PortfolioCashAccountSetIn,
): Promise<PortfolioCashAccountOut> {
  const normalizedCurrency = currency.trim().toUpperCase();
  const { data } = await http.put<PortfolioCashAccountOut>(
    `/portfolios/${portfolioId}/cash-accounts/${normalizedCurrency}`,
    payload,
  );
  return data;
}
