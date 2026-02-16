import { http } from "./http";

export interface LoginIn {
  email: string;
  password: string;
}

export interface SignupIn {
  email: string;
  display_name: string;
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
  role: "ADMIN" | "MAINTAINER" | "SUPERUSER" | "USER" | "GUEST";
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  must_change_password: boolean;
}

export async function signup(payload: SignupIn): Promise<LoginOut> {
  const { data } = await http.post<LoginOut>("/auth/signup", payload);
  return data;
}

export async function login(payload: LoginIn): Promise<LoginOut> {
  const { data } = await http.post<LoginOut>("/auth/login", payload);
  return data;
}

export async function getMe(): Promise<MeOut> {
  const { data } = await http.get<MeOut>("/auth/me");
  return data;
}