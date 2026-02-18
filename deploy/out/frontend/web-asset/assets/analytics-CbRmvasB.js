import { h as http } from './liabilities-C9jGBx8W.js';

async function getSummary(params = {}) {
  const { data } = await http.get("/analytics/summary", { params });
  return data;
}

export { getSummary as g };
