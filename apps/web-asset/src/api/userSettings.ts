import { http } from "./http";

export type DisplayCurrency = "KRW" | "USD";

export type UserSettingsOut = {
  user_id: number;
  home_dashboard_id: number | null;
  default_scope_type: "USER" | "HOUSEHOLD";
  default_scope_id: number | null;
  hide_values: boolean;
  name_clamp_enabled: boolean;
  mobile_allocation_top_n: number;
  hide_small_assets: boolean;
  small_asset_threshold: string | number;
  display_currency: DisplayCurrency;
  created_at: string;
  updated_at: string;
};

export type UserSettingsUpdateIn = {
  display_currency?: DisplayCurrency;
  name_clamp_enabled?: boolean;
  mobile_allocation_top_n?: number;
};

export async function getMySettings(): Promise<UserSettingsOut> {
  const { data } = await http.get<UserSettingsOut>("/users/me/settings");
  return data;
}

export async function updateMySettings(payload: UserSettingsUpdateIn): Promise<UserSettingsOut> {
  const { data } = await http.patch<UserSettingsOut>("/users/me/settings", payload);
  return data;
}
