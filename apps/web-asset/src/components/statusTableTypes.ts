export type SortOrder = "asc" | "desc";

export type PortfolioStatusRow = {
  id: number;
  name: string;
  type: string | null;
  current: number;
  invested: number;
  profit: number;
  returnPct: number | null;
};

export type HoldingStatusRow = {
  id: number;
  portfolioName: string;
  assetName: string;
  symbol: string | null;
  price: number;
  priceCurrency: string;
  avgCost: number;
  avgCostCurrency: string;
  evaluated: number;
  costBasis: number;
  profit: number;
  returnPct: number | null;
};

export type LiabilityStatusRow = {
  id: number;
  portfolioName: string;
  name: string;
  type: string;
  balance: number;
  balanceCurrency: string;
};

export type PortfolioOption = {
  key: string;
  label: string;
};

