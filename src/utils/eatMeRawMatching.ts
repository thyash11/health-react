import { DailyLogEntry, FoodItem } from "../types";
import { EatMeFoodMapping, EatMePlan, EatMePlanFood } from "../types/eatMe";
import { normalizeEatMeText } from "./eatMePlan";

const STOP_ALIASES = new Set([
  "fresh",
  "optional",
  "protein",
  "small",
  "medium",
  "moderate",
  "other",
  "cooked",
  "home cooked",
]);

const unique = <T,>(values: T[]) => [...new Set(values)];
const flattenFoods = (plan: EatMePlan) => plan.sections.flatMap((section) => section.foods);
const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const containsAlias = (foodName: string, aliasValue: string) => {
  const alias = normalizeEatMeText(aliasValue);
  if (alias.length < 3 || STOP_ALIASES.has(alias)) return false;
  return foodName === alias || new RegExp(`(?:^| )${escapeRegex(alias)}(?:$| )`).test(foodName);
};

export const matchEatMeRawFood = (
  foodName: string,
  plan: EatMePlan,
  mappings: EatMeFoodMapping[],
) => {
  const normalizedFoodName = normalizeEatMeText(foodName);
  const allFoods = flattenFoods(plan);
  const foodsById = new Map(allFoods.map((food) => [food.id, food]));
  const mapping = mappings.find((item) => item.normalizedFoodName === normalizedFoodName);

  if (mapping?.ignored) return { itemIds: [] as string[], confidence: "unmatched" as const };
  if (mapping?.checklistItemIds.length) {
    const mappedFoods = mapping.checklistItemIds
      .map((id) => foodsById.get(id))
      .filter(Boolean) as EatMePlanFood[];
    return { itemIds: mappedFoods.map((food) => food.id), confidence: "manual" as const };
  }

  const exactMatches = allFoods.filter((food) =>
    food.aliases.some((alias) => containsAlias(normalizedFoodName, alias))
  );
  return exactMatches.length
    ? { itemIds: exactMatches.map((food) => food.id), confidence: "exact-alias" as const }
    : { itemIds: [] as string[], confidence: "unmatched" as const };
};

export const matchEatMeRawFoodAndIngredients = (
  foodName: string,
  primaryIngredients: string[] | undefined,
  plan: EatMePlan,
  mappings: EatMeFoodMapping[],
) => {
  const directMatch = matchEatMeRawFood(foodName, plan, mappings);
  const ingredientMatches = (primaryIngredients || []).map((ingredient) =>
    matchEatMeRawFood(ingredient, plan, mappings)
  );
  return {
    itemIds: unique([
      ...directMatch.itemIds,
      ...ingredientMatches.flatMap((match) => match.itemIds),
    ]),
  };
};

export const weekIndexForDate = (date: string) =>
  Math.min(5, Math.max(1, Math.ceil(Number(date.slice(8, 10)) / 7)));

const ingredientsForLog = (log: DailyLogEntry, foodLibrary: FoodItem[]) =>
  log.primaryIngredients ?? foodLibrary.find((food) =>
    normalizeEatMeText(food.name) === normalizeEatMeText(log.foodItem)
  )?.primaryIngredients;

export const deriveAutomaticEatMeRawTicks = ({
  month,
  logs,
  plan,
  mappings,
  foodLibrary = [],
}: {
  month: string;
  logs: DailyLogEntry[];
  plan: EatMePlan;
  mappings: EatMeFoodMapping[];
  foodLibrary?: FoodItem[];
}) => {
  const weeksByItem = new Map<string, Set<number>>();
  logs.filter((log) => log.date.startsWith(`${month}-`)).forEach((log) => {
    const match = matchEatMeRawFoodAndIngredients(
      log.foodItem,
      ingredientsForLog(log, foodLibrary),
      plan,
      mappings,
    );
    match.itemIds.forEach((itemId) => {
      if (!weeksByItem.has(itemId)) weeksByItem.set(itemId, new Set());
      weeksByItem.get(itemId)!.add(weekIndexForDate(log.date));
    });
  });
  return [...weeksByItem].map(([itemId, weeks]) => ({
    month,
    itemId,
    weeks: [...weeks].sort((a, b) => a - b),
  }));
};
