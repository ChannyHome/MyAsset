import { http } from "./http";

export type QuoteUpdateJobStartOut = {
  job_id: string;
  status: string;
  created_at: string;
  total_assets: number;
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

export type FxRateLatestOut = {
  base_currency: string;
  quote_currency: string;
  rate: string | number;
  as_of: string;
  source: string;
};

export type QuoteUpdateJobStatusOut = {
  job_id: string;
  status: string;
  created_at: string;
  started_at: string | null;
  finished_at: string | null;
  total_assets: number;
  processed_assets: number;
  updated_count: number;
  skipped_count: number;
  failed_count: number;
  errors: string[];
  fx_updated: boolean;
  fx_rate: FxRateLatestOut | null;
  fx_error: string | null;
};

export type QuoteSchedulerStatusOut = {
  enabled: boolean;
  running: boolean;
  job_id: string;
  interval_minutes: number | null;
  misfire_grace_seconds: number | null;
  coalesce: boolean;
  max_instances: number;
  job_running: boolean;
  next_run_at: string | null;
  last_event: string | null;
  last_started_at: string | null;
  last_finished_at: string | null;
  last_duration_seconds: number | null;
  last_success_at: string | null;
  last_failure_at: string | null;
  last_error: string | null;
  last_summary: Record<string, unknown> | null;
  last_fx_updated: boolean | null;
  last_fx_error: string | null;
  last_snapshot_collected: boolean | null;
  last_snapshot_error: string | null;
  run_count: number;
  success_count: number;
  failure_count: number;
  missed_count: number;
  max_instances_missed_count: number;
  last_missed_at: string | null;
  last_missed_scheduled_run_at: string | null;
};

export async function getLatestQuotes(): Promise<QuoteLatestOut[]> {
  const { data } = await http.get<QuoteLatestOut[]>("/quotes/latest");
  return data;
}

export async function updateQuotesNow(): Promise<QuoteUpdateJobStartOut> {
  const { data } = await http.post<QuoteUpdateJobStartOut>("/quotes/update-now");
  return data;
}

export async function getQuoteUpdateJobStatus(jobId: string): Promise<QuoteUpdateJobStatusOut> {
  const { data } = await http.get<QuoteUpdateJobStatusOut>(`/quotes/update-jobs/${jobId}`);
  return data;
}

export async function getQuoteSchedulerStatus(): Promise<QuoteSchedulerStatusOut> {
  const { data } = await http.get<QuoteSchedulerStatusOut>("/quotes/scheduler/status");
  return data;
}

export async function testQuoteForAsset(assetId: number): Promise<QuoteLatestOut> {
  const { data } = await http.post<QuoteLatestOut>(`/quotes/test/${assetId}`);
  return data;
}

export async function upsertManualQuote(payload: ManualQuoteUpsertIn): Promise<QuoteLatestOut> {
  const { data } = await http.post<QuoteLatestOut>("/quotes/manual", payload);
  return data;
}

export async function getLatestUsdKrwFxRate(): Promise<FxRateLatestOut> {
  const { data } = await http.get<FxRateLatestOut>("/quotes/fx/usd-krw/latest");
  return data;
}
