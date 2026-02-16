import { http } from "./http";

export type AuthMeOut = {
  id: number;
  email: string;
  display_name: string;
  role: "ADMIN" | "MAINTAINER" | "SUPERUSER" | "USER" | "GUEST";
  status: "ACTIVE" | "SUSPENDED" | "DEACTIVATED";
  is_active: boolean;
  must_change_password: boolean;
};

export async function getMe(): Promise<AuthMeOut> {
  const { data } = await http.get<AuthMeOut>("/auth/me");
  return data;
}
