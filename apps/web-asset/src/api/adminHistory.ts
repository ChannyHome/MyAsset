import { http } from "./http";

export type AdminHistoryMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type AdminHistoryItemOut = {
  id: number;
  timestamp: string;
  user_id: number | null;
  role: string | null;
  actor_email: string | null;
  method: string;
  path: string;
  query: string | null;
  status_code: number;
  duration_ms: number;
  client_ip: string | null;
  user_agent: string | null;
  action_name: string | null;
  resource_type: string | null;
  resource_id: number | null;
  result: string | null;
  request_body_masked: string | null;
  response_body_masked: string | null;
};

export type AdminHistoryPageOut = {
  items: AdminHistoryItemOut[];
  total: number;
  page: number;
  page_size: number;
};

export type AdminHistoryQuery = {
  from?: string;
  to?: string;
  user_id?: number;
  method?: AdminHistoryMethod;
  path_contains?: string;
  status_code?: number;
  page?: number;
  page_size?: number;
};

export async function getAdminHistory(params: AdminHistoryQuery): Promise<AdminHistoryPageOut> {
  const { data } = await http.get<AdminHistoryPageOut>("/admin/history", { params });
  return data;
}
