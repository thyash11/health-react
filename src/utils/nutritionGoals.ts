import { PersonalTargets } from "../types";

export type GoalIntensity = PersonalTargets["goalIntensity"];

export interface NutritionGoalPreset {
  dailyCalories: number;
  proteinGrams: number;
  carbsGrams: number;
  fatGrams: number;
  fiberGrams: number;
  waterMl: number;
  walkKm: number;
}

export const GOAL_INTENSITY_OPTIONS: Array<{
  id: GoalIntensity;
  label: string;
  description: string;
  calorieFactor: number;
  proteinFactor: number;
  walkKm: number;
  weeklyWeightChangeKg: number;
}> = [
  {
    id: "easy",
    label: "Easy",
    description: "Gentle limits that are easier to sustain",
    calorieFactor: 28,
    proteinFactor: 1,
    walkKm: 3,
    weeklyWeightChangeKg: 0.25,
  },
  {
    id: "medium",
    label: "Medium",
    description: "Balanced limits for steady progress",
    calorieFactor: 25,
    proteinFactor: 1.2,
    walkKm: 5,
    weeklyWeightChangeKg: 0.5,
  },
  {
    id: "hard",
    label: "Hard",
    description: "Tighter limits requiring closer tracking",
    calorieFactor: 22,
    proteinFactor: 1.4,
    walkKm: 7,
    weeklyWeightChangeKg: 0.75,
  },
];

const roundTo = (value: number, step: number) => Math.round(value / step) * step;

export const calculateNutritionGoalPreset = (
  weightKg: number,
  intensity: GoalIntensity,
): NutritionGoalPreset | null => {
  if (!Number.isFinite(weightKg) || weightKg <= 0) return null;
  const option = GOAL_INTENSITY_OPTIONS.find((item) => item.id === intensity) || GOAL_INTENSITY_OPTIONS[0];

  // A conservative floor avoids generating an extreme low-energy plan from a simple weight-only estimate.
  const dailyCalories = Math.max(1500, roundTo(weightKg * option.calorieFactor, 10));
  const proteinGrams = Math.round(weightKg * option.proteinFactor);
  const fatGrams = Math.round((dailyCalories * 0.3) / 9);
  const proteinCalories = proteinGrams * 4;
  const fatCalories = fatGrams * 9;
  const carbsGrams = Math.max(0, Math.round((dailyCalories - proteinCalories - fatCalories) / 4));

  return {
    dailyCalories,
    proteinGrams,
    carbsGrams,
    fatGrams,
    fiberGrams: Math.max(25, Math.round((dailyCalories / 1000) * 14)),
    waterMl: roundTo(weightKg * 35, 50),
    walkKm: option.walkKm,
  };
};
