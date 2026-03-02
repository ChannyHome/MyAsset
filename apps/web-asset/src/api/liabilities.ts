import { http } from "./http";
import type { SortOrder } from "./assets";
import type { EditMode, RebaselineOut } from "./portfolios";

export type LiabilityOut = {
  id: number;
  owner_user_id: number;
  portfolio_id: number | null;
  name: string;
  liability_type: string;
  currency: string;
  outstanding_balance: string | number;
  interest_rate: string | number | null;
  monthly_payment: string | number | null;
  source_type: string;
  is_included: boolean;
  is_hidden: boolean;
  memo: string | null;
  auto_cash_holding_created?: boolean;
  created_at: string;
  updated_at: string;
};

export type LiabilityTableSortBy =
  | "id"
  | "name"
  | "portfolio_name"
  | "liability_type"
  | "currency"
  | "outstanding_balance"
  | "interest_rate"
  | "monthly_payment"
  | "is_included"
  | "is_hidden"
  | "updated_at";

export type LiabilityTableRowOut = LiabilityOut & {
  portfolio_name: string | null;
};

export type LiabilityTablePageOut = {
  items: LiabilityTableRowOut[];
  total: number;
  page: number;
  page_size: number;
  sort_by: LiabilityTableSortBy;
  sort_order: SortOrder;
  q: string | null;
};

export type LiabilitiesQuery = {
  display_currency?: "KRW" | "USD";
  include_hidden?: boolean;
  include_excluded?: boolean;
};

export type LiabilitiesTableQuery = {
  page?: number;
  page_size?: number;
  sort_by?: LiabilityTableSortBy;
  sort_order?: SortOrder;
  q?: string;
  portfolio_id?: number;
  display_currency?: "KRW" | "USD";
  include_hidden?: boolean;
  include_excluded?: boolean;
};

export type LiabilityCreateIn = {
  portfolio_id?: number | null;
  name: string;
  liability_type?: string;
  currency?: string;
  outstanding_balance?: string | number;
  interest_rate?: string | number | null;
  monthly_payment?: string | number | null;
  source_type?: string;
  is_included?: boolean;
  is_hidden?: boolean;
  memo?: string | null;
};

export type LiabilityUpdateIn = Partial<LiabilityCreateIn>;

export type LiabilityRebaselineIn = {
  effective_at: string;
  rebaseline_all_history?: boolean;
  outstanding_balance: string | number;
  reason?: string | null;
};

export async function getLiabilities(params: LiabilitiesQuery = {}): Promise<LiabilityOut[]> {
  const { data } = await http.get<LiabilityOut[]>("/liabilities", { params });
  return data;
}

export async function getLiabilitiesTable(params: LiabilitiesTableQuery = {}): Promise<LiabilityTablePageOut> {
  const { data } = await http.get<LiabilityTablePageOut>("/liabilities/table", { params });
  return data;
}

export async function createLiability(payload: LiabilityCreateIn): Promise<LiabilityOut> {
  const { data } = await http.post<LiabilityOut>("/liabilities", payload);
  return data;
}

export async function updateLiability(
  liabilityId: number,
  payload: LiabilityUpdateIn,
  options?: { edit_mode?: EditMode },
): Promise<LiabilityOut> {
  const { data } = await http.patch<LiabilityOut>(`/liabilities/${liabilityId}`, payload, {
    params: options?.edit_mode ? { edit_mode: options.edit_mode } : undefined,
  });
  return data;
}

export async function rebaselineLiability(
  liabilityId: number,
  payload: LiabilityRebaselineIn,
): Promise<RebaselineOut> {
  const { data } = await http.post<RebaselineOut>(`/liabilities/${liabilityId}/rebaseline`, payload);
  return data;
}

export async function deleteLiability(liabilityId: number): Promise<void> {
  await http.delete(`/liabilities/${liabilityId}`);
}
