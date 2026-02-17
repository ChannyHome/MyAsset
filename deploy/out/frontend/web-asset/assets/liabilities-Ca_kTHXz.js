import { h as http } from './http-DqETRxcr.js';

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

async function getLiabilities(params = {}) {
  const { data } = await http.get("/liabilities", { params });
  return data;
}
async function getLiabilitiesTable(params = {}) {
  const { data } = await http.get("/liabilities/table", { params });
  return data;
}
async function createLiability(payload) {
  const { data } = await http.post("/liabilities", payload);
  return data;
}
async function updateLiability(liabilityId, payload) {
  const { data } = await http.patch(`/liabilities/${liabilityId}`, payload);
  return data;
}
async function deleteLiability(liabilityId) {
  await http.delete(`/liabilities/${liabilityId}`);
}

export { getLiabilities as a, createLiability as b, createHolding as c, getHoldingsTable as d, getLiabilitiesTable as e, deleteHolding as f, getHoldingsPerformance as g, deleteLiability as h, updateLiability as i, updateHolding as u };
