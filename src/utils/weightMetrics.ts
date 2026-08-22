import { HealthMetric, PersonalTargets } from "../types";
import { GOAL_INTENSITY_OPTIONS } from "./nutritionGoals";

export const getWeightMetricsChronological = (metrics: HealthMetric[]) => metrics
  .filter((metric) => Number.isFinite(metric.weightKg) && metric.weightKg > 0)
  .slice()
  .sort((a, b) => a.date.localeCompare(b.date) || a.id.localeCompare(b.id));

export const getLatestWeightMetric = (metrics: HealthMetric[]) => {
  const sorted = getWeightMetricsChronological(metrics);
  return sorted.length > 0 ? sorted[sorted.length - 1] : undefined;
};

export const calculateWeightGoalProgress = (
  currentWeight: number,
  startingWeight: number,
  goalWeight: number,
) => {
  if (currentWeight <= 0 || goalWeight <= 0) return 0;
  if (currentWeight === goalWeight) return 100;
  if (startingWeight <= 0 || startingWeight === goalWeight) return 0;

  const progress = goalWeight < startingWeight
    ? ((startingWeight - currentWeight) / (startingWeight - goalWeight)) * 100
    : ((currentWeight - startingWeight) / (goalWeight - startingWeight)) * 100;
  return Math.max(0, Math.min(100, Math.round(progress)));
};

const dateToUtcTime = (date: string) => {
  const [year, month, day] = date.split("-").map(Number);
  if (!year || !month || !day) return Number.NaN;
  return Date.UTC(year, month - 1, day);
};

export const calculateWeightGoalDaysLeft = ({
  currentWeight,
  goalWeight,
  intensity,
  anchorDate,
  viewedDate,
}: {
  currentWeight: number;
  goalWeight: number;
  intensity: PersonalTargets["goalIntensity"];
  anchorDate: string;
  viewedDate: string;
}) => {
  if (currentWeight <= 0 || goalWeight <= 0) return null;
  if (currentWeight === goalWeight) return 0;

  const intensityOption = GOAL_INTENSITY_OPTIONS.find((option) => option.id === intensity);
  const weeklyWeightChangeKg = intensityOption?.weeklyWeightChangeKg;
  const anchorTime = dateToUtcTime(anchorDate);
  const viewedTime = dateToUtcTime(viewedDate);
  if (!weeklyWeightChangeKg || !Number.isFinite(anchorTime) || !Number.isFinite(viewedTime)) return null;

  const projectedDays = Math.ceil((Math.abs(currentWeight - goalWeight) / weeklyWeightChangeKg) * 7);
  const elapsedDays = Math.max(0, Math.floor((viewedTime - anchorTime) / 86_400_000));
  return Math.max(0, projectedDays - elapsedDays);
};
