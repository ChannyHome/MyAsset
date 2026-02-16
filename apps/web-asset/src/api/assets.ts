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

export type AssetTableSortBy =
  | "id"
  | "name"
  | "symbol"
  | "price"
  | "currency"
  | "asset_class"
  | "updated_at"
  | "quote_mode"
  | "quote_as_of"
  | "exchange_code"
  | "source"
  | "trade";

export type SortOrder = "asc" | "desc";

export type AssetTableRowOut = AssetOut & {
  quote_price: string | number | null;
  quote_currency: string | null;
  quote_as_of: string | null;
  quote_source: string | null;
};

export type AssetTablePageOut = {
  items: AssetTableRowOut[];
  total: number;
  page: number;
  page_size: number;
  sort_by: AssetTableSortBy;
  sort_order: SortOrder;
  q: string | null;
};

export type AssetTableQuery = {
  page?: number;
  page_size?: number;
  sort_by?: AssetTableSortBy;
  sort_order?: SortOrder;
  q?: string;
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

export async function getAssetsTable(params: AssetTableQuery = {}): Promise<AssetTablePageOut> {
  const { data } = await http.get<AssetTablePageOut>("/assets/table", { params });
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
