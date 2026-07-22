export const MEAL_TYPES = [
  "Breakfast",
  "Mid Snack",
  "Lunch",
  "Evening Snack",
  "Dinner",
  "Drink",
  "Other",
] as const;

export const FOOD_CATEGORIES = [
  "Breakfast",
  "Chutney",
  "Grain",
  "Protein",
  "Dessert",
  "Snack",
  "Bakery",
  "Added Sugar",
  "Fruit",
  "Dal/Curry",
  "Sugary Drink",
  "Added Fat",
  "Vegetable",
  "Beverage",
  "Other",
] as const;

export const isMealType = (value: unknown): value is (typeof MEAL_TYPES)[number] =>
  typeof value === "string" && (MEAL_TYPES as readonly string[]).includes(value);

export const isFoodCategory = (value: unknown): value is (typeof FOOD_CATEGORIES)[number] =>
  typeof value === "string" && (FOOD_CATEGORIES as readonly string[]).includes(value);
