import { h as http } from './useDisplayCurrency-BZ-Ikfwn.js';

async function getSummary(params = {}) {
  const { data } = await http.get("/analytics/summary", { params });
  return data;
}

export { getSummary as g };
