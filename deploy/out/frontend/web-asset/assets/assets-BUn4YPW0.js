import { h as http } from './datetime-BbzyLRcb.js';

async function getAssets() {
  const { data } = await http.get("/assets");
  return data;
}
async function getAssetsTable(params = {}) {
  const { data } = await http.get("/assets/table", { params });
  return data;
}
async function createAsset(payload) {
  const { data } = await http.post("/assets", payload);
  return data;
}
async function updateAsset(assetId, payload) {
  const { data } = await http.patch(`/assets/${assetId}`, payload);
  return data;
}
async function deleteAsset(assetId) {
  await http.delete(`/assets/${assetId}`);
}

export { getAssets as a, createAsset as c, deleteAsset as d, getAssetsTable as g, updateAsset as u };
