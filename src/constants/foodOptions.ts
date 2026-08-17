export const MEAL_TYPES = [
  "Breakfast",
  "Mid Snack",
  "Lunch",
  "Evening Snack",
  "Dinner",
  "Drink",
  "Other",
] as const;

export const MEAL_DEFAULT_TIMES: Partial<Record<(typeof MEAL_TYPES)[number], string>> = {
  Breakfast: "10:30 AM",
  "Mid Snack": "1:30 PM",
  Lunch: "2:00 PM",
  "Evening Snack": "6:30 PM",
  Dinner: "10:00 PM",
};

export const FOOD_CATEGORIES = [
  "Rice Dishes",
  "Millet Dishes",
  "Batter Foods",
  "Indian Breads",
  "Savoury Grains",

  "Pulses",
  "Dal Curries",

  "Poriyal",
  "Vegetable Curries",
  "Kuzhambu",
  "Chutneys",

  "Seafood",
  "Dairy",
  "Nuts",

  "Fried Snacks",
  "Fryums",
  "Bakery",
  "Sweets",
  "Frozen Desserts",

  "Fruits",
  "Sweet Drinks",
  "Hot Drinks",

  "Sweeteners",
  "Cooking Fats",
  "Dressings",
  "Water",
  "Other"
] as const;

export const isMealType = (value: unknown): value is (typeof MEAL_TYPES)[number] =>
  typeof value === "string" && (MEAL_TYPES as readonly string[]).includes(value);

export const isFoodCategory = (value: unknown): value is (typeof FOOD_CATEGORIES)[number] =>
  typeof value === "string" && (FOOD_CATEGORIES as readonly string[]).includes(value);
