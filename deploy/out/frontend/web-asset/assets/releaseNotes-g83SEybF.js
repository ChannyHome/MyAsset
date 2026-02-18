import { h as http } from './http-nYGPWehe.js';

async function getReleaseNotes(params = {}) {
  const { data } = await http.get("/release-notes", { params });
  return data;
}
async function createReleaseNote(payload) {
  const { data } = await http.post("/release-notes", payload);
  return data;
}
async function updateReleaseNote(releaseNoteId, payload) {
  const { data } = await http.patch(`/release-notes/${releaseNoteId}`, payload);
  return data;
}
async function unpublishReleaseNote(releaseNoteId) {
  const { data } = await http.delete(`/release-notes/${releaseNoteId}`);
  return data;
}

export { unpublishReleaseNote as a, createReleaseNote as c, getReleaseNotes as g, updateReleaseNote as u };
