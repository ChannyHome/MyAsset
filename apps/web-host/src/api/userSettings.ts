import { http } from "./http";

export type DisplayCurrency = "KRW" | "USD";

type UserSettingsOut = {
  display_currency: DisplayCurrency;
  name_clamp_enabled: boolean;
  mobile_allocation_top_n: number;
};

export async function getMySettings(): Promise<UserSettingsOut> {
  const { data } = await http.get<UserSettingsOut>("/users/me/settings");
  return data;
}

export type UserSettingsUpdateIn = {
  display_currency?: DisplayCurrency;
  name_clamp_enabled?: boolean;
  mobile_allocation_top_n?: number;
};

export async function updateMySettings(payload: UserSettingsUpdateIn): Promise<UserSettingsOut> {
  const { data } = await http.patch<UserSettingsOut>("/users/me/settings", payload);
  return data;
}
