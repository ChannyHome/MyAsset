import { http } from "./http";

export type DividendProvider = "DATA_GO_KR" | "ALPHA_VANTAGE";
export type DividendMarket = "KR" | "US";

export type DividendEventOut = {
  provider: DividendProvider;
  provider_event_id: string;
  market: DividendMarket;
  symbol: string | null;
  isin_code: string | null;
  crno: string | null;
  asset_name: string | null;
  dividend_type: string | null;
  declaration_date: string | null;
  ex_dividend_date: string | null;
  record_date: string | null;
  payment_date: string | null;
  dividend_base_date: string | null;
  fiscal_year: number | null;
  dividend_currency: string;
  dividend_per_share_gross: string | number;
  tax_rate_pct: string | number;
  withholding_tax_amount_per_share: string | number;
  dividend_per_share_net_estimated: string | number;
  raw: Record<string, unknown> | null;
};

export type DividendLookupOut = {
  provider: DividendProvider;
  source: string;
  market: DividendMarket;
  symbol: string | null;
  asset_id: number | null;
  asset_name: string | null;
  display_name: string | null;
  currency: string;
  tax_rate_pct: string | number;
  total_count: number;
  returned_count: number;
  year: number | null;
  items: DividendEventOut[];
  warnings: string[];
};

export type DataGoKrDividendQuery = {
  stock_name?: string;
  crno?: string;
  isin_code?: string;
  bas_dt?: string;
  year?: number;
  page?: number;
  page_size?: number;
  max_pages?: number;
  tax_rate_pct?: string | number;
  include_raw?: boolean;
};

export type AlphaVantageDividendQuery = {
  symbol: string;
  year?: number;
  tax_rate_pct?: string | number;
  include_raw?: boolean;
};

export type AssetDividendQuery = {
  year?: number;
  tax_rate_pct?: string | number;
  include_raw?: boolean;
};

export async function getDataGoKrStockDividends(query: DataGoKrDividendQuery): Promise<DividendLookupOut> {
  const { data } = await http.get<DividendLookupOut>("/dividends/providers/data-go-kr/stock", { params: query });
  return data;
}

export async function getAlphaVantageStockDividends(query: AlphaVantageDividendQuery): Promise<DividendLookupOut> {
  const { data } = await http.get<DividendLookupOut>("/dividends/providers/alpha-vantage/stock", { params: query });
  return data;
}

export async function getAssetDividendEvents(assetId: number, query: AssetDividendQuery = {}): Promise<DividendLookupOut> {
  const { data } = await http.get<DividendLookupOut>(`/dividends/assets/${assetId}/events`, { params: query });
  return data;
}

