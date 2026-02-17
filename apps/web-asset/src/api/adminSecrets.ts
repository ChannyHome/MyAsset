import { http } from "./http";

export type AppSecretOut = {
  id: number;
  provider: string;
  key_name: string;
  masked_value: string;
  description: string | null;
  is_active: boolean;
  created_by_user_id: number | null;
  updated_by_user_id: number | null;
  created_at: string;
  updated_at: string;
};

export type AppSecretCreateIn = {
  provider: string;
  key_name: string;
  secret_value: string;
  description?: string | null;
};

export type AppSecretUpdateIn = {
  secret_value?: string;
  description?: string | null;
  is_active?: boolean;
};

export async function listAppSecrets(params?: { provider?: string; key_name?: string }): Promise<AppSecretOut[]> {
  const { data } = await http.get<AppSecretOut[]>("/admin/secrets", { params });
  return data;
}

export async function createAppSecret(payload: AppSecretCreateIn): Promise<AppSecretOut> {
  const { data } = await http.post<AppSecretOut>("/admin/secrets", payload);
  return data;
}

export async function updateAppSecret(secretId: number, payload: AppSecretUpdateIn): Promise<AppSecretOut> {
  const { data } = await http.patch<AppSecretOut>(`/admin/secrets/${secretId}`, payload);
  return data;
}

export async function deactivateAppSecret(secretId: number): Promise<AppSecretOut> {
  const { data } = await http.delete<AppSecretOut>(`/admin/secrets/${secretId}`);
  return data;
}
