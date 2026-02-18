import { http } from "./http";

export type ReleaseNoteOut = {
  id: number;
  released_at: string;
  title: string;
  summary: string;
  is_published: boolean;
  created_by_user_id: number | null;
  updated_by_user_id: number | null;
  created_at: string;
  updated_at: string;
};

export type ReleaseNotesQuery = {
  limit?: number;
  offset?: number;
  include_unpublished?: boolean;
};

export type ReleaseNoteCreateIn = {
  released_at?: string | null;
  title: string;
  summary: string;
  is_published?: boolean;
};

export type ReleaseNoteUpdateIn = {
  released_at?: string | null;
  title?: string;
  summary?: string;
  is_published?: boolean;
};

export async function getReleaseNotes(params: ReleaseNotesQuery = {}): Promise<ReleaseNoteOut[]> {
  const { data } = await http.get<ReleaseNoteOut[]>("/release-notes", { params });
  return data;
}

export async function createReleaseNote(payload: ReleaseNoteCreateIn): Promise<ReleaseNoteOut> {
  const { data } = await http.post<ReleaseNoteOut>("/release-notes", payload);
  return data;
}

export async function updateReleaseNote(releaseNoteId: number, payload: ReleaseNoteUpdateIn): Promise<ReleaseNoteOut> {
  const { data } = await http.patch<ReleaseNoteOut>(`/release-notes/${releaseNoteId}`, payload);
  return data;
}

export async function unpublishReleaseNote(releaseNoteId: number): Promise<ReleaseNoteOut> {
  const { data } = await http.delete<ReleaseNoteOut>(`/release-notes/${releaseNoteId}`);
  return data;
}
