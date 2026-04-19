import { h as http } from './datetime-D3NoeBy6.js';

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

async function getMe() {
  const { data } = await http.get("/auth/me");
  return data;
}

async function updateQuotesNow() {
  const { data } = await http.post("/quotes/update-now");
  return data;
}
async function getQuoteUpdateJobStatus(jobId) {
  const { data } = await http.get(`/quotes/update-jobs/${jobId}`);
  return data;
}
async function getQuoteSchedulerStatus() {
  const { data } = await http.get("/quotes/scheduler/status");
  return data;
}
async function testQuoteForAsset(assetId) {
  const { data } = await http.post(`/quotes/test/${assetId}`);
  return data;
}
async function upsertManualQuote(payload) {
  const { data } = await http.post("/quotes/manual", payload);
  return data;
}
async function getLatestUsdKrwFxRate() {
  const { data } = await http.get("/quotes/fx/usd-krw/latest");
  return data;
}

export { getMe as a, getReleaseNotes as b, getQuoteUpdateJobStatus as c, createReleaseNote as d, updateReleaseNote as e, getLatestUsdKrwFxRate as f, getQuoteSchedulerStatus as g, upsertManualQuote as h, unpublishReleaseNote as i, testQuoteForAsset as t, updateQuotesNow as u };
