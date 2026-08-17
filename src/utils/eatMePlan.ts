import { createDefaultEatMePlan } from "../data/defaultEatMePlan";
import {
  EatMeFoodGroup,
  EatMeImportPreview,
  EatMePlan,
  EatMePlanFood,
  EatMePlanSection,
} from "../types/eatMe";

export const normalizeEatMeText = (value: string) => value
  .normalize("NFKD")
  .toLowerCase()
  .replace(/&/g, " and ")
  .replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, " ")
  .replace(/\s+/g, " ")
  .trim();

export const eatMeSlug = (value: string) => normalizeEatMeText(value).replace(/\s+/g, "-");

const aliasesFor = (name: string) => {
  const values = new Set<string>([name]);
  if (/\bwith\b/i.test(name)) return [...values];
  name.split("/").forEach((part) => values.add(part.trim()));
  name.split(" - ").forEach((part) => values.add(part.trim()));
  return [...values].filter((value) => normalizeEatMeText(value).length >= 3);
};

const pageGroup = (page: number, heading: string): { group: EatMeFoodGroup; intent: "encourage" | "limit" } | null => {
  const upper = heading.toUpperCase();
  if (page === 2) return { group: "leafy", intent: "encourage" };
  if (page === 3 || page === 4) return { group: "vegetable", intent: "encourage" };
  if (page === 5) return { group: "fruit", intent: "encourage" };
  if (page === 6) return upper.includes("REFINED") ? { group: "limit", intent: "limit" } : { group: "grain", intent: "encourage" };
  if (page === 7) return { group: "legume", intent: "encourage" };
  if (page === 8) return upper.includes("COCONUT") || upper.includes("FAT")
    ? { group: "healthyFat", intent: "encourage" }
    : { group: "nutsSeeds", intent: "encourage" };
  if (page === 9) return upper.includes("FERMENTED")
    ? { group: "fermented", intent: "encourage" }
    : { group: "dairyCalcium", intent: "encourage" };
  if (page === 10) return upper.includes("AVOID")
    ? { group: "limit", intent: "limit" }
    : { group: "naturalProtein", intent: "encourage" };
  if (page === 11) return upper.includes("DRINK")
    ? { group: "healthyDrink", intent: "encourage" }
    : { group: "herbSpice", intent: "encourage" };
  if (page === 12) return { group: "limit", intent: "limit" };
  return null;
};

const servingFor = (group: EatMeFoodGroup) => ({
  leafy: 85,
  vegetable: 90,
  fruit: 125,
  grain: 150,
  legume: 150,
  nutsSeeds: 25,
  dairyCalcium: 225,
  fermented: 150,
  naturalProtein: 100,
}[group]);

const rangeInText = (text: string, pattern: RegExp) => {
  const match = pattern.exec(text);
  return match ? { minimum: Number(match[1]), maximum: Number(match[2]) } : null;
};

const applyImportedTargets = (plan: EatMePlan, text: string) => {
  const targetPatterns: Record<string, RegExp> = {
    "frequency-vegetables": /Vegetables overall[^\d]*(\d+)\s*[-–]\s*(\d+)/i,
    "frequency-leafy": /Green leafy vegetables[^\d]*(\d+)\s*[-–]\s*(\d+)/i,
    "frequency-fruit": /Whole fruits[^\d]*(\d+)\s*[-–]\s*(\d+)/i,
    "frequency-legumes": /Dal\/pulses\/whole legumes[^\d]*(\d+)\s*[-–]\s*(\d+)/i,
    "frequency-grains": /Whole\/minimally processed grain[^\d]*(\d+)\s*[-–]\s*(\d+)/i,
    "frequency-fermented": /Fermented foods[^\d]*(\d+)\s*[-–]\s*(\d+)/i,
  };
  plan.goals = plan.goals.map((goal) => {
    const range = targetPatterns[goal.id] ? rangeInText(text, targetPatterns[goal.id]) : null;
    return range ? { ...goal, ...range } : goal;
  });
};

export const parseEatMeChecklistText = (text: string): EatMeImportPreview => {
  if (!/SOUTH INDIAN MONTHLY HEALTHY FOOD CHECKLIST/i.test(text)) {
    throw new Error("The TXT file must contain the South Indian Monthly Healthy Food Checklist title.");
  }
  if (!/WEEKLY BOX KEY/i.test(text)) {
    throw new Error("The checklist is missing its W1-W5 weekly-box definition.");
  }

  const lines = text.replace(/\r/g, "").split("\n");
  const sections = new Map<string, EatMePlanSection>();
  let page = 0;
  let heading = "Checklist foods";
  const warnings: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const pageMatch = /^PAGE\s+(\d+)\s+-\s+(.+)$/i.exec(line.trim());
    if (pageMatch) {
      page = Number(pageMatch[1]);
      heading = pageMatch[2].trim();
      continue;
    }
    if (/^[A-Z][A-Z0-9 &,/'()\-]+$/.test(line.trim()) && line.trim().length > 3 && !line.includes("====")) {
      heading = line.trim();
    }

    const foodMatch = /^(.+?)\s{2,}\[\s*\](?:\s+\[\s*\]){2,}/.exec(line);
    if (!foodMatch || foodMatch[1].includes("____")) continue;
    const name = foodMatch[1].trim().replace(/^\d+\.\s*/, "");
    const groupInfo = pageGroup(page, heading);
    if (!groupInfo || !name || /^Food$/i.test(name)) continue;

    const sectionId = `page-${page}-${eatMeSlug(heading) || "foods"}`;
    if (!sections.has(sectionId)) {
      sections.set(sectionId, {
        id: sectionId,
        title: heading.replace(/\s+-\s+.+$/, "").replace(/_/g, " "),
        group: groupInfo.group,
        intent: groupInfo.intent,
        foods: [],
      });
    }
    const targetSection = sections.get(sectionId)!;
    const food: EatMePlanFood = {
      id: `${sectionId}-${eatMeSlug(name)}`,
      name,
      aliases: aliasesFor(name),
      sectionId,
      group: groupInfo.group,
      intent: groupInfo.intent,
      servingGrams: servingFor(groupInfo.group),
    };
    if (!targetSection.foods.some((item) => item.id === food.id)) targetSection.foods.push(food);
  }

  const foodCount = [...sections.values()].reduce((total, item) => total + item.foods.length, 0);
  if (sections.size < 8 || foodCount < 80) {
    throw new Error(`Only ${foodCount} checklist foods across ${sections.size} sections were recognized. The file was not replaced.`);
  }
  const pageCount = new Set([...text.matchAll(/^PAGE\s+(\d+)/gim)].map((match) => match[1])).size;
  if (pageCount < 10) warnings.push(`Only ${pageCount} numbered pages were recognized.`);

  const plan = createDefaultEatMePlan();
  plan.id = `eat-me-import-${Date.now()}`;
  plan.name = "Imported South Indian Monthly Healthy Food Checklist";
  plan.source = "txt-import";
  plan.updatedAt = new Date().toISOString();
  plan.sections = [...sections.values()].filter((item) => item.foods.length > 0);
  applyImportedTargets(plan, text);

  return { plan, sectionCount: plan.sections.length, foodCount, goalCount: plan.goals.length, warnings };
};

const isPlan = (value: unknown): value is EatMePlan => {
  if (!value || typeof value !== "object") return false;
  const plan = value as Partial<EatMePlan>;
  return plan.version === 1 && typeof plan.name === "string" && Array.isArray(plan.sections) && Array.isArray(plan.goals);
};

export const parseEatMePlanJson = (contents: string): EatMeImportPreview => {
  let parsed: unknown;
  try {
    parsed = JSON.parse(contents);
  } catch {
    throw new Error("The selected file is not valid JSON.");
  }
  if (!isPlan(parsed)) throw new Error("This JSON is not a supported Eat Me plan.");
  const ids = new Set<string>();
  let foodCount = 0;
  parsed.sections.forEach((section) => {
    if (!section.id || !section.title || !Array.isArray(section.foods)) throw new Error("A plan section is malformed.");
    section.foods.forEach((food) => {
      if (!food.id || !food.name || !Array.isArray(food.aliases) || ids.has(food.id)) throw new Error(`Invalid or duplicate food in ${section.title}.`);
      ids.add(food.id);
      foodCount += 1;
    });
  });
  if (parsed.sections.length === 0 || foodCount === 0 || parsed.goals.length === 0) throw new Error("The plan cannot be empty.");
  const plan: EatMePlan = { ...parsed, source: "json-import", updatedAt: new Date().toISOString() };
  return { plan, sectionCount: plan.sections.length, foodCount, goalCount: plan.goals.length, warnings: [] };
};

export const exportEatMePlan = (plan: EatMePlan) => JSON.stringify(plan, null, 2);
