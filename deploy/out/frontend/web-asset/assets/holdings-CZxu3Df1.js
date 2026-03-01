import { h as http } from './datetime-D3NoeBy6.js';

async function getHoldingsTable(params = {}) {
  const { data } = await http.get("/holdings/table", { params });
  return data;
}
async function getHoldingsPerformance(params = {}) {
  const { data } = await http.get("/holdings/performance", { params });
  return data;
}
async function createHolding(payload) {
  const { data } = await http.post("/holdings", payload);
  return data;
}
async function updateHolding(holdingId, payload, options) {
  const { data } = await http.patch(`/holdings/${holdingId}`, payload, {
    params: options?.edit_mode ? { edit_mode: options.edit_mode } : void 0
  });
  return data;
}
async function rebaselineHolding(holdingId, payload) {
  const { data } = await http.post(`/holdings/${holdingId}/rebaseline`, payload);
  return data;
}
async function deleteHolding(holdingId) {
  await http.delete(`/holdings/${holdingId}`);
}

export { getHoldingsTable as a, createHolding as c, deleteHolding as d, getHoldingsPerformance as g, rebaselineHolding as r, updateHolding as u };
