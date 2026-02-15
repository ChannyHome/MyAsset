import { http } from "./http";

export interface LoginIn {
  email: string;
  password: string;
}

export interface LoginOut {
  access_token: string;
  token_type: string;
}

export interface MeOut {
  id: number;
  email: string;
  display_name: string;
}

export async function login(payload: LoginIn): Promise<LoginOut> {
  const { data } = await http.post<LoginOut>("/auth/login", payload);
  return data;
}

export async function getMe(): Promise<MeOut> {
  const { data } = await http.get<MeOut>("/auth/me");
  return data;
}

