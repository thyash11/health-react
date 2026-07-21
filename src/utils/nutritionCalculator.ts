import { DailyLogEntry, DailyHabitRecord, PersonalTargets, DailyNutritionSummary } from "../types";

export function calculateDailyHealthScore(
  calories: number,
  protein: number,
  fiber: number,
  waterMl: number,
  walkKm: number,
  treatEntries: number = 0,
  sugaryDrinks: number = 0,
  targets: PersonalTargets
): number {
  if (calories === 0 && protein === 0) return 0;

  let score = 0;

  // 1. Calorie Adherence (Max 25 pts)
  const calRatio = calories / targets.dailyCalories;
  if (calRatio >= 0.9 && calRatio <= 1.05) {
    score += 25;
  } else if (calRatio > 1.05 && calRatio <= 1.2) {
    score += 18;
  } else if (calRatio > 1.2 && calRatio <= 1.4) {
    score += 10;
  } else if (calRatio < 0.9 && calRatio >= 0.7) {
    score += 20;
  } else {
    score += 5;
  }

  // 2. Protein Target (Max 25 pts)
  const proteinRatio = Math.min(1.2, protein / targets.proteinGrams);
  score += Math.round(Math.min(1, proteinRatio) * 25);

  // 3. Fiber Target (Max 20 pts)
  const fiberRatio = Math.min(1.2, fiber / targets.fiberGrams);
  score += Math.round(Math.min(1, fiberRatio) * 20);

  // 4. Hydration (Max 15 pts)
  const waterRatio = Math.min(1, waterMl / targets.waterMl);
  score += Math.round(waterRatio * 15);

  // 5. Activity Walk (Max 15 pts)
  const walkRatio = Math.min(1, walkKm / targets.walkKm);
  score += Math.round(walkRatio * 15);

  // Penalties for treats & sugary drinks
  if (treatEntries > 1) {
    score -= (treatEntries - 1) * 4;
  }
  if (sugaryDrinks > 0) {
    score -= sugaryDrinks * 8;
  }

  return Math.max(0, Math.min(100, score));
}

export function aggregateDailySummary(
  dateStr: string,
  logs: DailyLogEntry[],
  habits: DailyHabitRecord[],
  targets: PersonalTargets
): DailyNutritionSummary {
  const dayLogs = logs.filter(l => l.date === dateStr);
  const dayHabit = habits.find(h => h.date === dateStr);

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalWater = dayHabit?.waterMl || 0;
  let totalWalkKm = dayHabit?.walkKm || 0;
  let treatEntries = dayHabit?.treatEntries || 0;
  let sugaryDrinks = dayHabit?.sugaryDrinksEntries || 0;

  dayLogs.forEach(item => {
    totalCalories += item.calories || 0;
    totalProtein += item.protein || 0;
    totalCarbs += item.carbs || 0;
    totalFat += item.fat || 0;
    totalFiber += item.fiber || 0;
    totalWater += item.waterMl || 0;
    if (item.walkKm && item.walkKm > totalWalkKm) {
      totalWalkKm = item.walkKm;
    }
    if (item.category === 'Dessert' || item.category === 'Snack' || item.category === 'Bakery') {
      treatEntries = Math.max(treatEntries, 1);
    }
    if (item.category === 'Sugary Drink') {
      sugaryDrinks = Math.max(sugaryDrinks, 1);
    }
  });

  // Calculate score
  const score = dayHabit?.dailyScore || calculateDailyHealthScore(
    totalCalories,
    totalProtein,
    totalFiber,
    totalWater,
    totalWalkKm,
    treatEntries,
    sugaryDrinks,
    targets
  );

  return {
    date: dateStr,
    totalCalories: Math.round(totalCalories * 10) / 10,
    totalProtein: Math.round(totalProtein * 10) / 10,
    totalCarbs: Math.round(totalCarbs * 10) / 10,
    totalFat: Math.round(totalFat * 10) / 10,
    totalFiber: Math.round(totalFiber * 10) / 10,
    totalWater: Math.round(totalWater),
    totalWalkKm: Math.round(totalWalkKm * 10) / 10,
    score,
    treatEntries,
    sugaryDrinks,
    entriesCount: dayLogs.length,
  };
}

export function formatDateForDisplay(dateStr: string): string {
  if (!dateStr) return "";

  // Parse date-only values locally so UTC conversion cannot move the date by a day.
  const dateOnlyMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateStr);
  const date = dateOnlyMatch
    ? new Date(
        Number(dateOnlyMatch[1]),
        Number(dateOnlyMatch[2]) - 1,
        Number(dateOnlyMatch[3])
      )
    : new Date(dateStr);

  if (Number.isNaN(date.getTime())) return dateStr;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function getScoreColor(score: number): { text: string; bg: string; badge: string } {
  if (score >= 70) {
    return { text: "text-emerald-700", bg: "bg-emerald-50", badge: "bg-emerald-100 text-emerald-800" };
  } else if (score >= 45) {
    return { text: "text-amber-700", bg: "bg-amber-50", badge: "bg-amber-100 text-amber-800" };
  } else {
    return { text: "text-rose-700", bg: "bg-rose-50", badge: "bg-rose-100 text-rose-800" };
  }
}
