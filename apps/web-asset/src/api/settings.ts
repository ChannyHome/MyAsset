import { http } from "./http";

export type FxStaleMinutesOut = {
  minutes: number;
  source: string;
};

export type FxStaleMinutesUpdateIn = {
  minutes: number;
};

export async function getFxStaleMinutes(): Promise<FxStaleMinutesOut> {
  const { data } = await http.get<FxStaleMinutesOut>("/settings/fx-stale-minutes");
  return data;
}

export async function updateFxStaleMinutes(payload: FxStaleMinutesUpdateIn): Promise<FxStaleMinutesOut> {
  const { data } = await http.put<FxStaleMinutesOut>("/settings/fx-stale-minutes", payload);
  return data;
}
