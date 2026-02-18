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

export async function getReleaseNotes(params: ReleaseNotesQuery = {}): Promise<ReleaseNoteOut[]> {
  const { data } = await http.get<ReleaseNoteOut[]>("/release-notes", { params });
  return data;
}
