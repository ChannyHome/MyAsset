import { http } from "./http";

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
  created_at: string;
  updated_at: string;
};

export type LiabilitiesQuery = {
  include_hidden?: boolean;
  include_excluded?: boolean;
};

export async function getLiabilities(params: LiabilitiesQuery = {}): Promise<LiabilityOut[]> {
  const { data } = await http.get<LiabilityOut[]>("/liabilities", { params });
  return data;
}

