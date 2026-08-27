import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createDefaultEatMePlan } from "../src/data/defaultEatMePlan";
import {
  deriveAutomaticEatMeRawTicks,
  matchEatMeRawFood,
  matchEatMeRawFoodAndIngredients,
} from "../src/utils/eatMeRawMatching";
import { exportEatMePlan, parseEatMeChecklistText, parseEatMePlanJson } from "../src/utils/eatMePlan";
import { DailyLogEntry } from "../src/types";

const plan = createDefaultEatMePlan();
const vendakkai = matchEatMeRawFood("Vendakkai thokku", plan, []);
assert.ok(vendakkai.itemIds.some((id) => id.includes("vendakkai")), "Vendakkai thokku must match the vendakkai checklist item.");
assert.equal(vendakkai.confidence, "exact-alias");

const sambar = matchEatMeRawFood("Homemade sambar", plan, []);
assert.equal(sambar.itemIds.length, 0, "Generic sambar must not claim a specific ingredient.");

const ingredientMatchedSambar = matchEatMeRawFoodAndIngredients(
  "Homemade sambar",
  ["Vendakkai"],
  plan,
  [],
);
assert.ok(
  ingredientMatchedSambar.itemIds.some((id) => id.includes("vendakkai")),
  "An explicitly recorded primary ingredient must match its checklist food.",
);

const baseLog = (overrides: Partial<DailyLogEntry>): DailyLogEntry => ({
  id: "log",
  date: "2026-08-01",
  meal: "Lunch",
  time: "2:00 PM",
  foodItem: "Vendakkai thokku",
  category: "Vegetable",
  quantityGrams: 90,
  calories: 80,
  protein: 2,
  carbs: 10,
  fat: 3,
  fiber: 4,
  waterMl: 0,
  walkKm: 0,
  ...overrides,
});

const logs = [
  baseLog({ id: "w1", date: "2026-08-07" }),
  baseLog({ id: "w2", date: "2026-08-08" }),
  baseLog({ id: "sambar", date: "2026-08-08", foodItem: "Homemade sambar", category: "Dal/Curry" }),
];
const weeklyTicks = deriveAutomaticEatMeRawTicks({
  month: "2026-08",
  plan,
  logs,
  foodLibrary: [],
  mappings: [],
});
const vendakkaiTick = weeklyTicks.find((tick) => tick.itemId.includes("vendakkai"));
assert.deepEqual(vendakkaiTick?.weeks, [1, 2], "Days 7 and 8 must produce separate W1 and W2 checks.");

const automaticTicks = deriveAutomaticEatMeRawTicks({
  month: "2026-08",
  logs: [baseLog({ id: "ingredient-sambar", date: "2026-08-08", foodItem: "Homemade sambar", category: "Dal/Curry", primaryIngredients: ["Vendakkai"] })],
  plan,
  mappings: [],
});
assert.ok(
  automaticTicks.some((tick) => tick.itemId.includes("vendakkai") && tick.weeks.includes(2)),
  "A primary ingredient eaten on day 8 must automatically tick W2.",
);
const legacyLogTicks = deriveAutomaticEatMeRawTicks({
  month: "2026-08",
  logs: [baseLog({ id: "legacy-sambar", date: "2026-08-15", foodItem: "Homemade sambar", category: "Dal/Curry" })],
  plan,
  mappings: [],
  foodLibrary: [{
    id: "sambar-library",
    name: "Homemade sambar",
    category: "Dal/Curry",
    primaryIngredients: ["Vendakkai"],
    defaultServingGrams: 200,
    caloriesPer100g: 80,
    proteinPer100g: 4,
    carbsPer100g: 10,
    fatPer100g: 2,
    fiberPer100g: 3,
  }],
});
assert.ok(
  legacyLogTicks.some((tick) => tick.itemId.includes("vendakkai") && tick.weeks.includes(3)),
  "Legacy logs must use the matching Food Library recipe when they have no ingredient snapshot.",
);

const sambarMapped = matchEatMeRawFood("Homemade sambar", plan, [{
  normalizedFoodName: "homemade sambar",
  checklistItemIds: [plan.sections.find((section) => section.id === "legumes")!.foods[0].id],
  ignored: false,
  updatedAt: new Date().toISOString(),
}]);
assert.equal(sambarMapped.confidence, "manual");
assert.equal(sambarMapped.itemIds.length, 1);

const jsonPreview = parseEatMePlanJson(exportEatMePlan(plan));
assert.equal(jsonPreview.foodCount, plan.sections.reduce((sum, section) => sum + section.foods.length, 0));

const checklistPath = process.argv[2];
if (checklistPath) {
  const textPreview = parseEatMeChecklistText(readFileSync(checklistPath, "utf8"));
  assert.ok(textPreview.sectionCount >= 8);
  assert.ok(textPreview.foodCount >= 80);
}

console.log("Eat Me self-tests passed.");
