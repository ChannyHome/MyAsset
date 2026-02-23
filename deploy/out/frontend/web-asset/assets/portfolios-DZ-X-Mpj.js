import { h as http } from './datetime-D3NoeBy6.js';

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

async function getPortfolios() {
  const { data } = await http.get("/portfolios");
  return data;
}
async function getPortfoliosTable(params = {}) {
  const { data } = await http.get("/portfolios/table", { params });
  return data;
}
async function createPortfolio(payload) {
  const { data } = await http.post("/portfolios", payload);
  return data;
}
async function updatePortfolio(portfolioId, payload) {
  const { data } = await http.patch(`/portfolios/${portfolioId}`, payload);
  return data;
}
async function deletePortfolio(portfolioId) {
  await http.delete(`/portfolios/${portfolioId}`);
}
async function getPortfolioCashAccounts(portfolioId) {
  const { data } = await http.get(`/portfolios/${portfolioId}/cash-accounts`);
  return data;
}
async function setPortfolioCashAccount(portfolioId, currency, payload) {
  const normalizedCurrency = currency.trim().toUpperCase();
  const { data } = await http.put(
    `/portfolios/${portfolioId}/cash-accounts/${normalizedCurrency}`,
    payload
  );
  return data;
}

export { getPortfoliosTable as a, getLiabilities as b, getPortfolios as c, createPortfolio as d, getPortfolioCashAccounts as e, createLiability as f, getLiabilitiesTable as g, updateLiability as h, deletePortfolio as i, deleteLiability as j, setPortfolioCashAccount as s, updatePortfolio as u };
