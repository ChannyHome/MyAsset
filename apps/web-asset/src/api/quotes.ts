import { http } from "./http";

export type QuoteUpdateResult = {
  updated_count: number;
  skipped_count: number;
  failed_count: number;
  errors: string[];
};

export type ManualQuoteUpsertIn = {
  asset_id: number;
  price: string | number;
  currency?: string;
  as_of?: string | null;
  source?: string | null;
};

export type QuoteLatestOut = {
  asset_id: number;
  symbol: string | null;
  name: string;
  price: string | number;
  currency: string;
  change_value: string | number | null;
  change_pct: string | number | null;
  as_of: string;
  source: string;
};

export async function getLatestQuotes(): Promise<QuoteLatestOut[]> {
  const { data } = await http.get<QuoteLatestOut[]>("/quotes/latest");
  return data;
}

export async function updateQuotesNow(): Promise<QuoteUpdateResult> {
  const { data } = await http.post<QuoteUpdateResult>("/quotes/update-now");
  return data;
}

export async function upsertManualQuote(payload: ManualQuoteUpsertIn): Promise<QuoteLatestOut> {
  const { data } = await http.post<QuoteLatestOut>("/quotes/manual", payload);
  return data;
}
