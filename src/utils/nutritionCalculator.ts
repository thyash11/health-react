import { DailyLogEntry, PersonalTargets, DailyNutritionSummary } from "../types";

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
  if (
    targets.dailyCalories <= 0 ||
    targets.proteinGrams <= 0 ||
    targets.fiberGrams <= 0 ||
    targets.waterMl <= 0 ||
    targets.walkKm <= 0
  ) return 0;

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
  targets: PersonalTargets
): DailyNutritionSummary {
  const dayLogs = logs.filter(l => l.date === dateStr);

  let totalCalories = 0;
  let totalProtein = 0;
  let totalCarbs = 0;
  let totalFat = 0;
  let totalFiber = 0;
  let totalWater = 0;
  let totalWalkKm = 0;
  let fruitEntries = 0;
  let vegLegumeEntries = 0;
  let treatEntries = 0;
  let sugaryDrinks = 0;

  dayLogs.forEach(item => {
    totalCalories += item.calories || 0;
    totalProtein += item.protein || 0;
    totalCarbs += item.carbs || 0;
    totalFat += item.fat || 0;
    totalFiber += item.fiber || 0;
    totalWater += item.waterMl || 0;
    totalWalkKm = Math.max(totalWalkKm, item.walkKm || 0);

    const searchableText = `${item.foodItem} ${item.notes || ""}`.toLowerCase();
    if (item.category === "Fruit") fruitEntries += 1;
    if (
      item.category === "Vegetable" ||
      item.category === "Dal/Curry" ||
      /\b(dal|lentil|legume|bean|chana|gram|keerai|poriyal)\b/.test(searchableText)
    ) vegLegumeEntries += 1;
    if (["Dessert", "Snack", "Bakery", "Added Sugar"].includes(item.category)) {
      treatEntries += 1;
    }
    if (
      item.category === "Sugary Drink" ||
      (item.category === "Beverage" && /\b(sugar|sweetened|sugarcane|soft drink|nannari)\b/.test(searchableText))
    ) sugaryDrinks += 1;
  });

  const score = calculateDailyHealthScore(
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
    fruitEntries,
    vegLegumeEntries,
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
