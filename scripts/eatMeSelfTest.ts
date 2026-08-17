import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createDefaultEatMePlan } from "../src/data/defaultEatMePlan";
import { analyzeEatMeMonth, matchEatMeFood } from "../src/utils/eatMeAnalysis";
import { exportEatMePlan, parseEatMeChecklistText, parseEatMePlanJson } from "../src/utils/eatMePlan";
import { DailyLogEntry } from "../src/types";

const plan = createDefaultEatMePlan();
const vendakkai = matchEatMeFood("Vendakkai thokku", "Vegetable", plan, []);
assert.ok(vendakkai.itemIds.some((id) => id.includes("vendakkai")), "Vendakkai thokku must match the vendakkai checklist item.");
assert.equal(vendakkai.confidence, "exact-alias");

const sambar = matchEatMeFood("Homemade sambar", "Dal/Curry", plan, []);
assert.equal(sambar.itemIds.length, 0, "Generic sambar must not claim a specific ingredient.");
assert.ok(sambar.groups.includes("legume"), "The explicit Dal/Curry category may support broad group analysis.");

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
const analysis = analyzeEatMeMonth({
  month: "2026-08",
  today: "2026-08-18",
  plan,
  logs,
  foodLibrary: [],
  mappings: [],
  manualCheckIns: [],
});
assert.ok(analysis.weeklyCoverage[0].covered >= 1 && analysis.weeklyCoverage[1].covered >= 1, "W1 and W2 must be separate fixed month blocks.");
assert.ok(analysis.reviewFoods.some((food) => food.normalizedFoodName.includes("sambar")), "Unmatched sambar must be sent to review.");

const sambarMapped = matchEatMeFood("Homemade sambar", "Dal/Curry", plan, [{
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
