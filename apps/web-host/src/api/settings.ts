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

export type FinancialIncomeTaxableLimitOut = {
  amount_krw: number;
  source: string;
};

export type OpenAIAdminConfigOut = {
  enabled: boolean;
  enabled_source: string;
  source: "db" | "env" | "none";
  masked_api_key?: string | null;
  default_model: string;
  heavy_model: string;
  project_id?: string | null;
  organization_id?: string | null;
  timeout_seconds: number;
};

export type OpenAIAdminConfigUpdateIn = {
  enabled?: boolean;
  api_key?: string;
  disable_api_key?: boolean;
};

export type OpenAIAdminTestOut = {
  ok: boolean;
  source: "db" | "env" | "none";
  model_name: string;
  latency_ms: number;
  output_text?: string | null;
  detail?: string | null;
  status_code?: number | null;
  error_code?: string | null;
  error_category?: "quota" | "rate_limit" | "project_limit" | "config" | "unknown" | null;
  hint?: string | null;
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

export async function getFinancialIncomeTaxableLimit(): Promise<FinancialIncomeTaxableLimitOut> {
  const { data } = await http.get<FinancialIncomeTaxableLimitOut>("/settings/financial-income-taxable-limit");
  return data;
}

export async function updateFinancialIncomeTaxableLimit(amountKrw: number): Promise<FinancialIncomeTaxableLimitOut> {
  const { data } = await http.put<FinancialIncomeTaxableLimitOut>("/settings/financial-income-taxable-limit", {
    amount_krw: amountKrw,
  });
  return data;
}

export async function getOpenAIConfig(): Promise<OpenAIAdminConfigOut> {
  const { data } = await http.get<OpenAIAdminConfigOut>("/admin/llm/openai/config");
  return data;
}

export async function updateOpenAIConfig(payload: OpenAIAdminConfigUpdateIn): Promise<OpenAIAdminConfigOut> {
  const { data } = await http.put<OpenAIAdminConfigOut>("/admin/llm/openai/config", payload);
  return data;
}

export async function testOpenAIConnection(): Promise<OpenAIAdminTestOut> {
  const { data } = await http.post<OpenAIAdminTestOut>("/admin/llm/openai/test");
  return data;
}
