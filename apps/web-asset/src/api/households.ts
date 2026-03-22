import { http } from "./http";

export type HouseholdOut = {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
};

export async function getHouseholds(): Promise<HouseholdOut[]> {
  const { data } = await http.get<HouseholdOut[]>("/households");
  return data;
}
