import { http } from "./http";

export type AssetQuoteMode = "AUTO" | "MANUAL";

export type AssetOut = {
  id: number;
  asset_class: string;
  symbol: string | null;
  name: string;
  currency: string;
  quote_mode: AssetQuoteMode;
  exchange_code: string;
  is_trade_supported: boolean;
  meta_json: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
};

export type AssetCreateIn = {
  asset_class: string;
  symbol?: string | null;
  name: string;
  currency?: string;
  quote_mode?: AssetQuoteMode;
  exchange_code?: string;
  is_trade_supported?: boolean;
  meta_json?: Record<string, unknown> | null;
};

export type AssetUpdateIn = Partial<AssetCreateIn>;

export async function getAssets(): Promise<AssetOut[]> {
  const { data } = await http.get<AssetOut[]>("/assets");
  return data;
}

export async function createAsset(payload: AssetCreateIn): Promise<AssetOut> {
  const { data } = await http.post<AssetOut>("/assets", payload);
  return data;
}

export async function updateAsset(assetId: number, payload: AssetUpdateIn): Promise<AssetOut> {
  const { data } = await http.patch<AssetOut>(`/assets/${assetId}`, payload);
  return data;
}

export async function deleteAsset(assetId: number): Promise<void> {
  await http.delete(`/assets/${assetId}`);
}
