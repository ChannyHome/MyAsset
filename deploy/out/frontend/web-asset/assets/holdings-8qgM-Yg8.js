import { h as http } from './datetime-BbzyLRcb.js';

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
async function updateHolding(holdingId, payload) {
  const { data } = await http.patch(`/holdings/${holdingId}`, payload);
  return data;
}
async function deleteHolding(holdingId) {
  await http.delete(`/holdings/${holdingId}`);
}

export { getHoldingsTable as a, createHolding as c, deleteHolding as d, getHoldingsPerformance as g, updateHolding as u };
