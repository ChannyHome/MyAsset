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
  refresh_token?: string | null;
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

export async function logout(): Promise<void> {
  await http.post("/auth/logout");
}

export async function refresh(refreshToken: string): Promise<LoginOut> {
  const { data } = await http.post<LoginOut>("/auth/refresh", {
    refresh_token: refreshToken,
  });
  return data;
}
