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
