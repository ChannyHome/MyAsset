import { http } from "./http";

export type DisplayCurrency = "KRW" | "USD";

type UserSettingsOut = {
  display_currency: DisplayCurrency;
};

export async function getMySettings(): Promise<UserSettingsOut> {
  const { data } = await http.get<UserSettingsOut>("/users/me/settings");
  return data;
}

export async function updateMySettings(displayCurrency: DisplayCurrency): Promise<UserSettingsOut> {
  const { data } = await http.patch<UserSettingsOut>("/users/me/settings", {
    display_currency: displayCurrency,
  });
  return data;
}
