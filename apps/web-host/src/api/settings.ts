import { http } from "./http";

export type QuoteIntervalOut = {
  minutes: number;
  source: string;
};

export type FxStaleMinutesOut = {
  minutes: number;
  source: string;
};

export type TokenRefreshEnabledOut = {
  enabled: boolean;
  source: string;
};

export async function getQuoteInterval(): Promise<QuoteIntervalOut> {
  const { data } = await http.get<QuoteIntervalOut>("/settings/quote-interval");
  return data;
}

export async function updateQuoteInterval(minutes: number): Promise<QuoteIntervalOut> {
  const { data } = await http.put<QuoteIntervalOut>("/settings/quote-interval", { minutes });
  return data;
}

export async function getFxStaleMinutes(): Promise<FxStaleMinutesOut> {
  const { data } = await http.get<FxStaleMinutesOut>("/settings/fx-stale-minutes");
  return data;
}

export async function updateFxStaleMinutes(minutes: number): Promise<FxStaleMinutesOut> {
  const { data } = await http.put<FxStaleMinutesOut>("/settings/fx-stale-minutes", { minutes });
  return data;
}

export async function getTokenRefreshEnabled(): Promise<TokenRefreshEnabledOut> {
  const { data } = await http.get<TokenRefreshEnabledOut>("/settings/token-refresh");
  return data;
}

export async function updateTokenRefreshEnabled(enabled: boolean): Promise<TokenRefreshEnabledOut> {
  const { data } = await http.put<TokenRefreshEnabledOut>("/settings/token-refresh", { enabled });
  return data;
}
