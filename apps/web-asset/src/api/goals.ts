import { http } from "./http";

export type GoalScopeType = "USER" | "HOUSEHOLD";
export type GoalBasis = "GROSS" | "NET";
export type GoalDisplayCurrency = "KRW" | "USD";

export type GoalTargetOut = {
  configured: boolean;
  scope_type: GoalScopeType;
  scope_id: number;
  display_currency: GoalDisplayCurrency;
  amount_currency: GoalDisplayCurrency;
  target_amount: string | number | null;
  annual_return_rate_pct: string | number | null;
  monthly_invest_amount: string | number | null;
  created_at: string | null;
  updated_at: string | null;
};

export type GoalTargetUpdateIn = {
  scope_type: GoalScopeType;
  scope_id?: number;
  display_currency: GoalDisplayCurrency;
  target_amount: string | number;
  annual_return_rate_pct: string | number;
  monthly_invest_amount: string | number;
};

export type AnalyticsGoalProgressOut = {
  configured: boolean;
  scope_type: GoalScopeType;
  scope_id: number;
  basis: GoalBasis;
  display_currency: GoalDisplayCurrency;
  current_amount: string | number;
  target_amount: string | number | null;
  progress_ratio_pct: string | number | null;
  remaining_amount: string | number | null;
  over_target_amount: string | number | null;
  reached: boolean;
  projected_reach_date: string | null;
  projected_months_to_goal: number | null;
  projection_3y: string | number | null;
  projection_5y: string | number | null;
  projection_10y: string | number | null;
  recent_actual_annualized_return_pct: string | number | null;
  recent_actual_window_days: number | null;
  comparison_tone: "AHEAD" | "BEHIND" | "MATCHED" | "UNAVAILABLE";
  as_of: string;
};

export type GoalTargetQuery = {
  scope_type: GoalScopeType;
  scope_id?: number;
  display_currency: GoalDisplayCurrency;
};

export type GoalProgressQuery = GoalTargetQuery & {
  basis?: GoalBasis;
};

export async function getMyGoalTarget(params: GoalTargetQuery): Promise<GoalTargetOut> {
  const { data } = await http.get<GoalTargetOut>("/users/me/goal-target", { params });
  return data;
}

export async function updateMyGoalTarget(payload: GoalTargetUpdateIn): Promise<GoalTargetOut> {
  const { data } = await http.put<GoalTargetOut>("/users/me/goal-target", payload);
  return data;
}

export async function getGoalProgress(params: GoalProgressQuery): Promise<AnalyticsGoalProgressOut> {
  const { data } = await http.get<AnalyticsGoalProgressOut>("/analytics/goal-progress", { params });
  return data;
}
