import { http } from "./http";

export interface HouseholdOut {
  id: number;
  name: string;
}

export async function getHouseholds(): Promise<HouseholdOut[]> {
  const { data } = await http.get<HouseholdOut[]>("/households");
  return data;
}

