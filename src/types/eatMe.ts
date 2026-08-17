export type EatMeFoodGroup =
  | "leafy"
  | "vegetable"
  | "fruit"
  | "grain"
  | "legume"
  | "nutsSeeds"
  | "dairyCalcium"
  | "fermented"
  | "naturalProtein"
  | "healthyFat"
  | "herbSpice"
  | "healthyDrink"
  | "limit";

export type EatMeScoreBucket =
  | "foundations"
  | "frequency"
  | "variety"
  | "rotation"
  | "limits";

export interface EatMePlanFood {
  id: string;
  name: string;
  aliases: string[];
  sectionId: string;
  group: EatMeFoodGroup;
  intent: "encourage" | "limit";
  servingGrams?: number;
}

export interface EatMePlanSection {
  id: string;
  title: string;
  group: EatMeFoodGroup;
  intent: "encourage" | "limit";
  foods: EatMePlanFood[];
}

export interface EatMePlanGoal {
  id: string;
  label: string;
  bucket: EatMeScoreBucket;
  metric: "days" | "servings" | "variety" | "meals" | "occasions" | "weeklyPresence";
  mode: "minimum" | "range" | "maximum";
  minimum?: number;
  maximum?: number;
  group?: EatMeFoodGroup;
  manual?: boolean;
  description?: string;
}

export interface EatMePlan {
  id: string;
  version: 1;
  name: string;
  description: string;
  source: "default" | "txt-import" | "json-import";
  updatedAt: string;
  sections: EatMePlanSection[];
  goals: EatMePlanGoal[];
}

export interface EatMeFoodMapping {
  normalizedFoodName: string;
  checklistItemIds: string[];
  ignored: boolean;
  updatedAt: string;
}

export interface EatMeManualCheckIn {
  date: string;
  goalId: string;
  completed: boolean;
}

export interface EatMeRawTick {
  month: string;
  itemId: string;
  weeks: number[];
}

export interface EatMeImportPreview {
  plan: EatMePlan;
  sectionCount: number;
  foodCount: number;
  goalCount: number;
  warnings: string[];
}

export interface EatMeMatchedLog {
  logId: string;
  foodName: string;
  date: string;
  meal: string;
  quantityGrams: number;
  groupMatches: EatMeFoodGroup[];
  itemIds: string[];
  confidence: "manual" | "exact-alias" | "category-only" | "unmatched";
}

export interface EatMeReviewFood {
  normalizedFoodName: string;
  displayName: string;
  occurrences: number;
  candidateItemIds: string[];
}

export interface EatMeGoalProgress extends EatMePlanGoal {
  value: number;
  expectedToDate: number;
  projected: number;
  progressPercent: number;
  status: "on-track" | "behind" | "complete" | "over-limit" | "unknown";
  estimated: boolean;
}

export interface EatMeRecommendation {
  id: string;
  label: string;
  reason: string;
  group: EatMeFoodGroup;
  source: "library" | "discovery";
  priority: number;
}

export interface EatMeMonthlyAnalysis {
  month: string;
  monthLabel: string;
  daysInMonth: number;
  elapsedDays: number;
  logCount: number;
  score: number | null;
  projectionScore: number | null;
  matchCoverage: number;
  matchedLogs: EatMeMatchedLog[];
  reviewFoods: EatMeReviewFood[];
  goals: EatMeGoalProgress[];
  bucketScores: Record<EatMeScoreBucket, number | null>;
  weeklyCoverage: Array<{ week: number; startDay: number; endDay: number; covered: number; total: number }>;
  groupVariety: Array<{ group: EatMeFoodGroup; label: string; count: number; target: number }>;
  mostEaten: Array<{ label: string; count: number }>;
  todayRecommendations: EatMeRecommendation[];
  discoveryRecommendations: EatMeRecommendation[];
  weeklyPriorities: EatMeRecommendation[];
}
