import { http } from "./http";

export type FxRateLatestOut = {
  base_currency: string;
  quote_currency: string;
  rate: string | number;
  as_of: string;
  source: string;
};

export async function getLatestUsdKrwFxRate(): Promise<FxRateLatestOut> {
  const { data } = await http.get<FxRateLatestOut>("/quotes/fx/usd-krw/latest");
  return data;
}
