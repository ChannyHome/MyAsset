import { http } from "./http";

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
