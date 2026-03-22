import { http } from "./http";

export type ChatRole = "USER" | "ASSISTANT" | "SYSTEM";
export type ChatScopeType = "USER" | "HOUSEHOLD";
export type DisplayCurrency = "KRW" | "USD";

export type ChatSourceCard = {
  title: string;
  as_of?: string | null;
  scope?: string | null;
  summary?: string | null;
  data?: Record<string, unknown> | null;
};

export type ChatToolTrace = {
  tool_name: string;
  status: "ok" | "partial" | "error";
  summary?: string | null;
  error?: string | null;
  payload?: Record<string, unknown> | null;
};

export type ChatSessionOut = {
  id: number;
  owner_user_id: number;
  household_id?: number | null;
  title: string;
  status: "ACTIVE" | "ARCHIVED";
  model_name: string;
  created_at: string;
  updated_at: string;
  last_message_at?: string | null;
};

export type ChatMessageOut = {
  id: number;
  session_id: number;
  role: ChatRole;
  content_text: string;
  source_cards_json: ChatSourceCard[];
  tool_calls_json: ChatToolTrace[];
  usage_json?: Record<string, unknown> | null;
  latency_ms?: number | null;
  created_at: string;
};

export type ChatStatusOut = {
  available: boolean;
  enabled: boolean;
  source: "db" | "env" | "none";
  message: string;
  default_model: string;
};

export async function getChatStatus(): Promise<ChatStatusOut> {
  const { data } = await http.get<ChatStatusOut>("/chat/status");
  return data;
}

export async function getChatSessions(): Promise<ChatSessionOut[]> {
  const { data } = await http.get<ChatSessionOut[]>("/chat/sessions");
  return data;
}

export async function createChatSession(title?: string): Promise<ChatSessionOut> {
  const { data } = await http.post<ChatSessionOut>("/chat/sessions", { title });
  return data;
}

export async function updateChatSession(
  sessionId: number,
  payload: { title?: string; status?: "ACTIVE" | "ARCHIVED" },
): Promise<ChatSessionOut> {
  const { data } = await http.patch<ChatSessionOut>(`/chat/sessions/${sessionId}`, payload);
  return data;
}

export async function getChatMessages(sessionId: number): Promise<ChatMessageOut[]> {
  const { data } = await http.get<ChatMessageOut[]>(`/chat/sessions/${sessionId}/messages`);
  return data;
}

export async function createChatMessage(
  sessionId: number,
  payload: {
    content_text: string;
    scope_type?: ChatScopeType;
    scope_id?: number;
    display_currency?: DisplayCurrency;
  },
): Promise<ChatMessageOut[]> {
  const { data } = await http.post<ChatMessageOut[]>(`/chat/sessions/${sessionId}/messages`, payload);
  return data;
}
