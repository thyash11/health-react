import { DailyLogEntry, FoodItem } from "../types";
import {
  EatMeFoodGroup,
  EatMeFoodMapping,
  EatMeGoalProgress,
  EatMeManualCheckIn,
  EatMeMatchedLog,
  EatMeMonthlyAnalysis,
  EatMePlan,
  EatMePlanFood,
  EatMeRecommendation,
  EatMeReviewFood,
  EatMeScoreBucket,
} from "../types/eatMe";
import { normalizeEatMeText } from "./eatMePlan";

export const EAT_ME_GROUP_LABELS: Record<EatMeFoodGroup, string> = {
  leafy: "Leafy greens",
  vegetable: "Vegetables",
  fruit: "Whole fruits",
  grain: "Whole grains & millets",
  legume: "Dals & legumes",
  nutsSeeds: "Nuts & seeds",
  dairyCalcium: "Dairy & calcium",
  fermented: "Fermented foods",
  naturalProtein: "Natural protein",
  healthyFat: "Healthy fats",
  herbSpice: "Herbs & spices",
  healthyDrink: "Healthy drinks",
  limit: "Foods to limit",
};

const GROUP_SERVING_GRAMS: Partial<Record<EatMeFoodGroup, number>> = {
  leafy: 85,
  vegetable: 90,
  fruit: 125,
  grain: 150,
  legume: 150,
  nutsSeeds: 25,
  dairyCalcium: 225,
  fermented: 150,
  naturalProtein: 100,
};

const CATEGORY_GROUPS: Record<string, EatMeFoodGroup[]> = {
  breakfast: ["grain"],
  grain: ["grain"],
  protein: ["naturalProtein"],
  fruit: ["fruit"],
  vegetable: ["vegetable"],
  "dal/curry": ["legume"],
  "added fat": ["healthyFat"],
  "sugary drink": ["limit"],
};

const STOP_ALIASES = new Set(["fresh", "optional", "protein", "small", "medium", "moderate", "other", "cooked", "home cooked"]);
const PLANT_GROUPS = new Set<EatMeFoodGroup>(["leafy", "vegetable", "fruit", "grain", "legume", "nutsSeeds"]);
const BUCKET_WEIGHTS: Record<EatMeScoreBucket, number> = {
  foundations: 30,
  frequency: 25,
  variety: 25,
  rotation: 10,
  limits: 10,
};

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsAlias = (foodName: string, aliasValue: string) => {
  const alias = normalizeEatMeText(aliasValue);
  if (alias.length < 3 || STOP_ALIASES.has(alias)) return false;
  return foodName === alias || new RegExp(`(?:^| )${escapeRegex(alias)}(?:$| )`).test(foodName);
};

const candidateSimilarity = (left: string, right: string) => {
  const a = new Set(normalizeEatMeText(left).split(" ").filter((token) => token.length > 2));
  const b = new Set(normalizeEatMeText(right).split(" ").filter((token) => token.length > 2));
  if (!a.size || !b.size) return 0;
  const intersection = [...a].filter((token) => b.has(token)).length;
  return intersection / new Set([...a, ...b]).size;
};

const flattenFoods = (plan: EatMePlan) => plan.sections.flatMap((section) => section.foods);

const expandGroups = (groups: EatMeFoodGroup[]) => {
  const expanded = new Set(groups);
  if (expanded.has("leafy")) expanded.add("vegetable");
  return [...expanded];
};

export const matchEatMeFood = (
  foodName: string,
  category: string,
  plan: EatMePlan,
  mappings: EatMeFoodMapping[],
) => {
  const normalizedFoodName = normalizeEatMeText(foodName);
  const allFoods = flattenFoods(plan);
  const foodsById = new Map(allFoods.map((food) => [food.id, food]));
  const mapping = mappings.find((item) => item.normalizedFoodName === normalizedFoodName);
  if (mapping?.ignored) return { itemIds: [] as string[], groups: CATEGORY_GROUPS[category.toLowerCase()] || [], confidence: "unmatched" as const, candidates: [] as string[] };

  if (mapping && mapping.checklistItemIds.length > 0) {
    const mappedFoods = mapping.checklistItemIds.map((id) => foodsById.get(id)).filter(Boolean) as EatMePlanFood[];
    return {
      itemIds: mappedFoods.map((food) => food.id),
      groups: expandGroups([...mappedFoods.map((food) => food.group), ...(CATEGORY_GROUPS[category.toLowerCase()] || [])]),
      confidence: "manual" as const,
      candidates: [] as string[],
    };
  }

  const exactMatches = allFoods.filter((food) => food.aliases.some((alias) => containsAlias(normalizedFoodName, alias)));
  if (exactMatches.length > 0) {
    return {
      itemIds: exactMatches.map((food) => food.id),
      groups: expandGroups([...exactMatches.map((food) => food.group), ...(CATEGORY_GROUPS[category.toLowerCase()] || [])]),
      confidence: "exact-alias" as const,
      candidates: [] as string[],
    };
  }

  const categoryGroups = CATEGORY_GROUPS[category.toLowerCase()] || [];
  const candidates = allFoods
    .map((food) => ({ id: food.id, score: Math.max(...food.aliases.map((alias) => candidateSimilarity(normalizedFoodName, alias))) }))
    .filter((item) => item.score >= 0.25)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .map((item) => item.id);

  return {
    itemIds: [] as string[],
    groups: expandGroups(categoryGroups),
    confidence: categoryGroups.length ? "category-only" as const : "unmatched" as const,
    candidates,
  };
};

const monthParts = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  const daysInMonth = new Date(year, monthNumber, 0).getDate();
  return { year, monthNumber, daysInMonth };
};

const getElapsedDays = (month: string, today: string, daysInMonth: number) => {
  const todayMonth = today.slice(0, 7);
  if (month < todayMonth) return daysInMonth;
  if (month > todayMonth) return 0;
  return Math.min(daysInMonth, Number(today.slice(8, 10)));
};

const weekIndexForDate = (date: string) => Math.min(5, Math.ceil(Number(date.slice(8, 10)) / 7));
const unique = <T,>(values: T[]) => [...new Set(values)];

const isProtein = (groups: EatMeFoodGroup[]) => groups.some((group) => ["naturalProtein", "legume", "dairyCalcium", "nutsSeeds"].includes(group));
const isSugaryDrink = (log: DailyLogEntry) => log.category === "Sugary Drink" || /\b(soft drink|energy drink|sweetened|sugarcane juice|packaged juice|malt drink)\b/i.test(`${log.foodItem} ${log.notes || ""}`);

const limitKindCount = (goalId: string, logs: DailyLogEntry[], matched: EatMeMatchedLog[], foodsById: Map<string, EatMePlanFood>) => {
  const relevantNames = logs.map((log) => `${log.foodItem} ${log.notes || ""}`.toLowerCase());
  if (goalId === "limit-sugary-drinks") return logs.filter(isSugaryDrink).length;
  if (goalId === "limit-deep-fried") return relevantNames.filter((name) => /\b(deep fried|murukku|mixture|chips|bajji|bonda|vada|poori|puri)\b/.test(name)).length;
  if (goalId === "limit-sweets") return logs.filter((log, index) => ["Dessert", "Added Sugar"].includes(log.category) || /\b(sweet|cake|ice cream|chocolate|candy|halwa|laddu|mysore pak)\b/.test(relevantNames[index])).length;
  if (goalId === "limit-restaurant") return relevantNames.filter((name) => /\b(restaurant|hotel|fast food|pizza|burger|biryani|fried rice)\b/.test(name)).length;
  return matched.filter((entry) => entry.itemIds.some((id) => foodsById.get(id)?.intent === "limit")).length;
};

const statusFor = (goal: EatMeGoalProgress) => {
  if (goal.mode === "maximum") {
    if (goal.maximum === undefined) return "unknown" as const;
    return goal.value > goal.maximum ? "over-limit" as const : "on-track" as const;
  }
  if (goal.minimum === undefined) return "unknown" as const;
  if (goal.value >= goal.minimum) return "complete" as const;
  return goal.value >= goal.expectedToDate ? "on-track" as const : "behind" as const;
};

const scoreGoal = (goal: EatMeGoalProgress, projection = false) => {
  const value = projection ? goal.projected : goal.value;
  const target = projection ? (goal.minimum ?? goal.maximum ?? 0) : goal.expectedToDate;
  if (goal.mode === "maximum") {
    const maximum = projection ? (goal.maximum ?? 0) : target;
    if (maximum === 0) return value === 0 ? 100 : 0;
    return value <= maximum ? 100 : Math.max(0, 100 - ((value - maximum) / maximum) * 100);
  }
  if (target <= 0) return null;
  return Math.min(100, (value / target) * 100);
};

const weightedScore = (bucketScores: Record<EatMeScoreBucket, number | null>) => {
  const available = (Object.keys(BUCKET_WEIGHTS) as EatMeScoreBucket[]).filter((bucket) => bucketScores[bucket] !== null);
  if (!available.length) return null;
  const weight = available.reduce((sum, bucket) => sum + BUCKET_WEIGHTS[bucket], 0);
  return Math.round(available.reduce((sum, bucket) => sum + (bucketScores[bucket] || 0) * BUCKET_WEIGHTS[bucket], 0) / weight);
};

const recommendationReason = (group: EatMeFoodGroup, deficit: number, recent: boolean) =>
  `${EAT_ME_GROUP_LABELS[group]} are ${Math.max(1, Math.round(deficit))} ${deficit > 1 ? "servings" : "serving"} behind pace${recent ? "; rotate from recently eaten choices" : ""}.`;

export const analyzeEatMeMonth = ({
  month,
  today,
  plan,
  logs,
  foodLibrary,
  mappings,
  manualCheckIns,
}: {
  month: string;
  today: string;
  plan: EatMePlan;
  logs: DailyLogEntry[];
  foodLibrary: FoodItem[];
  mappings: EatMeFoodMapping[];
  manualCheckIns: EatMeManualCheckIn[];
}): EatMeMonthlyAnalysis => {
  const { year, monthNumber, daysInMonth } = monthParts(month);
  const elapsedDays = getElapsedDays(month, today, daysInMonth);
  const monthLogs = logs.filter((log) => log.date.startsWith(`${month}-`));
  const allFoods = flattenFoods(plan);
  const foodsById = new Map(allFoods.map((food) => [food.id, food]));

  const matchedLogs: EatMeMatchedLog[] = monthLogs.map((log) => {
    const match = matchEatMeFood(log.foodItem, log.category, plan, mappings);
    return {
      logId: log.id,
      foodName: log.foodItem,
      date: log.date,
      meal: log.meal,
      quantityGrams: log.quantityGrams,
      groupMatches: match.groups,
      itemIds: match.itemIds,
      confidence: match.confidence,
    };
  });

  const reviewMap = new Map<string, EatMeReviewFood>();
  monthLogs.forEach((log, index) => {
    const matched = matchedLogs[index];
    if (matched.itemIds.length > 0 || mappings.some((mapping) => mapping.normalizedFoodName === normalizeEatMeText(log.foodItem) && mapping.ignored)) return;
    const normalizedFoodName = normalizeEatMeText(log.foodItem);
    const match = matchEatMeFood(log.foodItem, log.category, plan, mappings);
    const existing = reviewMap.get(normalizedFoodName);
    if (existing) existing.occurrences += 1;
    else reviewMap.set(normalizedFoodName, { normalizedFoodName, displayName: log.foodItem, occurrences: 1, candidateItemIds: match.candidates });
  });

  const datesWithLogs = unique(monthLogs.map((log) => log.date));
  const mealsByDate = new Map<string, Map<string, EatMeMatchedLog[]>>();
  matchedLogs.forEach((entry) => {
    if (!mealsByDate.has(entry.date)) mealsByDate.set(entry.date, new Map());
    const day = mealsByDate.get(entry.date)!;
    if (!day.has(entry.meal)) day.set(entry.meal, []);
    day.get(entry.meal)!.push(entry);
  });

  const groupEntries = (group: EatMeFoodGroup) => matchedLogs.filter((entry) => entry.groupMatches.includes(group));
  const distinctItems = (group?: EatMeFoodGroup) => unique(matchedLogs.flatMap((entry) => entry.itemIds).filter((id) => !group || foodsById.get(id)?.group === group));
  const servingTotal = (group: EatMeFoodGroup) => groupEntries(group).reduce((total, entry) => {
    const exactItem = entry.itemIds.map((id) => foodsById.get(id)).find((food) => food?.group === group || (group === "vegetable" && food?.group === "leafy"));
    const serving = exactItem?.servingGrams || GROUP_SERVING_GRAMS[group];
    return total + (exactItem && serving && entry.quantityGrams > 0 ? entry.quantityGrams / serving : 1);
  }, 0);
  const groupEstimated = (group: EatMeFoodGroup) => groupEntries(group).some((entry) => !entry.itemIds.some((id) => {
    const food = foodsById.get(id);
    return food?.group === group || (group === "vegetable" && food?.group === "leafy");
  }));

  const veggieTwoMealDays = [...mealsByDate.entries()].filter(([, meals]) => [...meals.values()].filter((entries) => entries.some((entry) => entry.groupMatches.includes("vegetable"))).length >= 2).length;
  const proteinTwoMealDays = [...mealsByDate.entries()].filter(([, meals]) => [...meals.values()].filter((entries) => entries.some((entry) => isProtein(entry.groupMatches))).length >= 2).length;
  const manualValue = (goalId: string) => unique(manualCheckIns.filter((item) => item.goalId === goalId && item.completed && item.date.startsWith(`${month}-`)).map((item) => item.date)).length;
  const weeksElapsed = Math.max(1, Math.min(5, Math.ceil(Math.max(1, elapsedDays) / 7)));
  const weeklySets = Array.from({ length: 5 }, () => new Set<string>());
  matchedLogs.forEach((entry) => entry.itemIds.filter((id) => foodsById.get(id)?.intent === "encourage").forEach((id) => {
    const food = foodsById.get(id);
    if (food) weeklySets[weekIndexForDate(entry.date) - 1].add(normalizeEatMeText(food.name));
  }));
  const weeklyCoverage = weeklySets.map((set, index) => ({ week: index + 1, startDay: index * 7 + 1, endDay: Math.min(daysInMonth, (index + 1) * 7), covered: set.size, total: 12 }));

  const plantVariety = unique(matchedLogs
    .flatMap((entry) => entry.itemIds)
    .filter((id) => PLANT_GROUPS.has(foodsById.get(id)?.group as EatMeFoodGroup))
    .map((id) => normalizeEatMeText(foodsById.get(id)?.name || id))).length;
  const fishIds = new Set(allFoods.filter((food) => food.group === "naturalProtein" && /fish|sardine|mackerel|salmon|rawas|vanjaram|pomfret|anchovy|nethili|rohu|catla|tuna|prawn|shrimp|crab|squid|mussel|clam/i.test(food.name)).map((food) => food.id));
  const fishMeals = unique(matchedLogs.filter((entry) => entry.itemIds.some((id) => fishIds.has(id))).map((entry) => `${entry.date}|${entry.meal}`)).length;

  const rawGoals: EatMeGoalProgress[] = plan.goals.map((goal) => {
    let value = 0;
    let estimated = false;
    if (goal.manual) value = manualValue(goal.id);
    else if (goal.id === "foundation-vegetables-two-meals") value = veggieTwoMealDays;
    else if (goal.id === "foundation-protein-two-meals") value = proteinTwoMealDays;
    else if (goal.id === "foundation-no-sugary-drink") value = datesWithLogs.filter((date) => !monthLogs.some((log) => log.date === date && isSugaryDrink(log))).length;
    else if (goal.metric === "days" && goal.group) value = unique(groupEntries(goal.group).map((entry) => entry.date)).length;
    else if (goal.metric === "servings" && goal.group) { value = servingTotal(goal.group); estimated = groupEstimated(goal.group); }
    else if (goal.id === "frequency-fish-protein") value = fishMeals;
    else if (goal.metric === "meals" && goal.group) value = unique(groupEntries(goal.group).map((entry) => `${entry.date}|${entry.meal}`)).length;
    else if (goal.metric === "variety" && goal.id === "variety-plants") value = plantVariety;
    else if (goal.metric === "variety") value = distinctItems(goal.group).length;
    else if (goal.metric === "weeklyPresence") value = weeklyCoverage.slice(0, weeksElapsed).reduce((sum, week) => sum + Math.min(1, week.covered / week.total), 0);
    else if (goal.metric === "occasions") value = limitKindCount(goal.id, monthLogs, matchedLogs, foodsById);

    value = Math.round(value * 10) / 10;
    const fullTarget = goal.minimum ?? goal.maximum ?? 0;
    const expectedToDate = goal.mode === "maximum"
      ? fullTarget * (elapsedDays / daysInMonth)
      : fullTarget * (elapsedDays / daysInMonth);
    const projected = elapsedDays > 0 ? value / elapsedDays * daysInMonth : 0;
    const progressPercent = goal.mode === "maximum"
      ? (value <= (goal.maximum ?? 0) ? 100 : Math.max(0, 100 - value * 10))
      : fullTarget > 0 ? Math.min(100, value / fullTarget * 100) : 0;
    const progress: EatMeGoalProgress = { ...goal, value, expectedToDate: Math.round(expectedToDate * 10) / 10, projected: Math.round(projected * 10) / 10, progressPercent: Math.round(progressPercent), status: "unknown", estimated };
    progress.status = statusFor(progress);
    return progress;
  });

  const noEvidence = monthLogs.length === 0 && !manualCheckIns.some((item) => item.date.startsWith(`${month}-`) && item.completed);
  const bucketScores = (Object.keys(BUCKET_WEIGHTS) as EatMeScoreBucket[]).reduce((result, bucket) => {
    const goals = rawGoals.filter((goal) => goal.bucket === bucket && (!goal.manual || goal.value > 0));
    const scores = goals.map((goal) => scoreGoal(goal)).filter((score): score is number => score !== null);
    result[bucket] = noEvidence || !scores.length ? null : Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    return result;
  }, {} as Record<EatMeScoreBucket, number | null>);
  const projectionBuckets = (Object.keys(BUCKET_WEIGHTS) as EatMeScoreBucket[]).reduce((result, bucket) => {
    const goals = rawGoals.filter((goal) => goal.bucket === bucket && (!goal.manual || goal.value > 0));
    const scores = goals.map((goal) => scoreGoal(goal, true)).filter((score): score is number => score !== null);
    result[bucket] = noEvidence || !scores.length ? null : Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length);
    return result;
  }, {} as Record<EatMeScoreBucket, number | null>);

  const frequencyDeficits = rawGoals
    .filter((goal) => goal.bucket === "frequency" && goal.group && goal.minimum)
    .map((goal) => ({ group: goal.group!, deficit: Math.max(0, goal.expectedToDate - goal.value) }))
    .filter((item) => item.deficit > 0)
    .sort((a, b) => b.deficit - a.deficit);
  const recentCutoff = `${month}-${String(Math.max(1, Math.min(daysInMonth, elapsedDays) - 3)).padStart(2, "0")}`;
  const recentIds = new Set(matchedLogs.filter((entry) => entry.date >= recentCutoff).flatMap((entry) => entry.itemIds));

  const libraryRecommendations: EatMeRecommendation[] = [];
  foodLibrary.forEach((libraryFood) => {
    const match = matchEatMeFood(libraryFood.name, libraryFood.category, plan, mappings);
    const groupGap = frequencyDeficits.find((gap) => match.groups.includes(gap.group));
    const item = match.itemIds.map((id) => foodsById.get(id)).find((food) => food?.intent === "encourage");
    if (!groupGap || !item) return;
    const recent = match.itemIds.some((id) => recentIds.has(id));
    libraryRecommendations.push({ id: `library-${libraryFood.id}`, label: libraryFood.name, reason: recommendationReason(groupGap.group, groupGap.deficit, recent), group: groupGap.group, source: "library", priority: groupGap.deficit * 10 + (recent ? 0 : 4) });
  });

  const eatenIds = new Set(matchedLogs.flatMap((entry) => entry.itemIds));
  const libraryItemIds = new Set(foodLibrary.flatMap((food) => matchEatMeFood(food.name, food.category, plan, mappings).itemIds));
  const discoveryRecommendations = allFoods
    .filter((food) => food.intent === "encourage" && !eatenIds.has(food.id) && !libraryItemIds.has(food.id) && frequencyDeficits.some((gap) => gap.group === food.group || (gap.group === "vegetable" && food.group === "leafy")))
    .slice(0, 6)
    .map<EatMeRecommendation>((food, index) => ({ id: `discover-${food.id}`, label: food.name, reason: `Adds ${EAT_ME_GROUP_LABELS[food.group].toLowerCase()} variety missing this month.`, group: food.group, source: "discovery", priority: 20 - index }));

  const countMap = new Map<string, number>();
  monthLogs.forEach((log) => countMap.set(log.foodItem, (countMap.get(log.foodItem) || 0) + 1));
  const groupVarietyTargets: Partial<Record<EatMeFoodGroup, number>> = { leafy: 4, vegetable: 12, fruit: 6, legume: 5, grain: 3, nutsSeeds: 4, naturalProtein: 4 };

  return {
    month,
    monthLabel: new Intl.DateTimeFormat("en-US", { month: "long", year: "numeric" }).format(new Date(year, monthNumber - 1, 1)),
    daysInMonth,
    elapsedDays,
    logCount: monthLogs.length,
    score: weightedScore(bucketScores),
    projectionScore: weightedScore(projectionBuckets),
    matchCoverage: monthLogs.length ? Math.round(matchedLogs.filter((entry) => ["manual", "exact-alias"].includes(entry.confidence)).length / monthLogs.length * 100) : 0,
    matchedLogs,
    reviewFoods: [...reviewMap.values()].sort((a, b) => b.occurrences - a.occurrences),
    goals: rawGoals,
    bucketScores,
    weeklyCoverage,
    groupVariety: Object.entries(groupVarietyTargets).map(([group, target]) => ({ group: group as EatMeFoodGroup, label: EAT_ME_GROUP_LABELS[group as EatMeFoodGroup], count: distinctItems(group as EatMeFoodGroup).length, target: target! })),
    mostEaten: [...countMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([label, count]) => ({ label, count })),
    todayRecommendations: libraryRecommendations.sort((a, b) => b.priority - a.priority).slice(0, 5),
    discoveryRecommendations,
    weeklyPriorities: [...libraryRecommendations, ...discoveryRecommendations].sort((a, b) => b.priority - a.priority).slice(0, 8),
  };
};
