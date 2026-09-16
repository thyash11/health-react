import { FoodItem } from "../types";
import { cleanPrimaryIngredients } from "./primaryIngredients";

export const parseFoodLibraryJson = (
  contents: string,
  existingFoods: readonly FoodItem[],
  foodCategories: readonly string[],
): Omit<FoodItem, "id">[] => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(contents);
  } catch {
    throw new Error("This Food Library file is not valid JSON.");
  }

  const rawFoods = Array.isArray(parsed)
    ? parsed
    : parsed && typeof parsed === "object" && Array.isArray((parsed as { foods?: unknown }).foods)
      ? (parsed as { foods: unknown[] }).foods
      : null;
  if (!rawFoods || rawFoods.length === 0) {
    throw new Error("The JSON must contain a non-empty foods array.");
  }

  const numberField = (value: unknown, field: string, row: number, mustBePositive = false) => {
    const number = Number(value);
    if (!Number.isFinite(number) || number < 0 || (mustBePositive && number <= 0)) {
      throw new Error(`Food ${row}: ${field} must be ${mustBePositive ? "greater than zero" : "zero or greater"}.`);
    }
    return number;
  };

  const seenNames = new Set(existingFoods.map((item) => item.name.trim().toLowerCase()));
  return rawFoods.map((rawFood, index) => {
    const row = index + 1;
    if (!rawFood || typeof rawFood !== "object" || Array.isArray(rawFood)) {
      throw new Error(`Food ${row} must be an object.`);
    }

    const value = rawFood as Record<string, unknown>;
    const foodName = typeof value.name === "string" ? value.name.trim() : "";
    if (!foodName) throw new Error(`Food ${row}: name is required.`);
    if (seenNames.has(foodName.toLowerCase())) {
      throw new Error(`Food ${row}: “${foodName}” is duplicated or already exists.`);
    }
    seenNames.add(foodName.toLowerCase());

    if (typeof value.category !== "string" || !foodCategories.includes(value.category)) {
      throw new Error(`Food ${row}: category must be one of ${foodCategories.join(", ")}.`);
    }

    const rawPrimaryIngredients = value.primaryIngredients;
    if (rawPrimaryIngredients !== undefined && !Array.isArray(rawPrimaryIngredients)) {
      throw new Error(`Food ${row}: primaryIngredients must be an array of ingredient names.`);
    }
    const primaryIngredients = cleanPrimaryIngredients(
      (Array.isArray(rawPrimaryIngredients) ? rawPrimaryIngredients : []).map((ingredient) => {
        if (typeof ingredient !== "string") {
          throw new Error(`Food ${row}: every primary ingredient must be text.`);
        }
        return ingredient;
      }),
    );

    return {
      name: foodName,
      category: value.category,
      primaryIngredients,
      defaultServingGrams: numberField(value.defaultServingGrams, "defaultServingGrams", row, true),
      caloriesPer100g: numberField(value.caloriesPer100g, "caloriesPer100g", row),
      proteinPer100g: numberField(value.proteinPer100g, "proteinPer100g", row),
      carbsPer100g: numberField(value.carbsPer100g, "carbsPer100g", row),
      fatPer100g: numberField(value.fatPer100g, "fatPer100g", row),
      fiberPer100g: numberField(value.fiberPer100g, "fiberPer100g", row),
      isFavorite: false,
    };
  });
};
