import { http } from "./http";
import type { SortOrder } from "./assets";
import type { RebaselineOut } from "./portfolios";

export type EntityType = "ASSET" | "PORTFOLIO" | "HOLDING" | "LIABILITY";
export type EntityHistorySortBy =
  | "created_at"
  | "entity_type"
  | "entity_id"
  | "action"
  | "owner_user_id"
  | "actor_user_id";

export type EntityHistoryItemOut = {
  id: number;
  entity_type: string;
  entity_id: number;
  owner_user_id: number;
  action: string;
  before_json: string | null;
  after_json: string | null;
  changed_fields_json: string | null;
  reason: string | null;
  actor_user_id: number | null;
  actor_email: string | null;
  request_id: string | null;
  created_at: string;
  before?: Record<string, unknown> | null;
  after?: Record<string, unknown> | null;
  changed_fields?: string[] | null;
};

export type EntityHistoryPageOut = {
  items: EntityHistoryItemOut[];
  total: number;
  page: number;
  page_size: number;
  sort_by: EntityHistorySortBy;
  sort_order: SortOrder;
};

export type EntityHistoryQuery = {
  entity_type?: EntityType;
  entity_id?: number;
  owner_user_id?: number;
  actor_user_id?: number;
  action?: string;
  from?: string;
  to?: string;
  sort_by?: EntityHistorySortBy;
  sort_order?: SortOrder;
  page?: number;
  page_size?: number;
};

export type EntityHistoryRevertOut = {
  history_id: number;
  entity_type: string;
  entity_id: number;
  reverted_with: string;
  rebaseline: RebaselineOut | null;
};

export async function getEntityHistory(params: EntityHistoryQuery): Promise<EntityHistoryPageOut> {
  const { data } = await http.get<EntityHistoryPageOut>("/admin/entity-history", { params });
  return data;
}

export async function revertEntityHistory(historyId: number): Promise<EntityHistoryRevertOut> {
  const { data } = await http.post<EntityHistoryRevertOut>(`/admin/entity-history/${historyId}/revert`);
  return data;
}
