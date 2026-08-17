import {
  EatMeFoodGroup,
  EatMePlan,
  EatMePlanFood,
  EatMePlanGoal,
  EatMePlanSection,
} from "../types/eatMe";

const slugify = (value: string) => value
  .toLowerCase()
  .replace(/['’]/g, "")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const aliasesFor = (name: string) => {
  const aliases = new Set<string>([name]);
  if (/\bwith\b/i.test(name)) return [...aliases];
  name.split("/").forEach((part) => aliases.add(part.trim()));
  name.split(" - ").forEach((part) => aliases.add(part.trim()));
  return [...aliases].filter(Boolean);
};

const GROUP_SERVINGS: Partial<Record<EatMeFoodGroup, number>> = {
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

const foods = (sectionId: string, group: EatMeFoodGroup, intent: "encourage" | "limit", names: string[]) =>
  names.map<EatMePlanFood>((name) => ({
    id: `${sectionId}-${slugify(name)}`,
    name,
    aliases: aliasesFor(name),
    sectionId,
    group,
    intent,
    servingGrams: GROUP_SERVINGS[group],
  }));

const section = (
  id: string,
  title: string,
  group: EatMeFoodGroup,
  names: string,
  intent: "encourage" | "limit" = "encourage",
): EatMePlanSection => ({
  id,
  title,
  group,
  intent,
  foods: foods(id, group, intent, names.split("|").map((name) => name.trim()).filter(Boolean)),
});

export const DEFAULT_EAT_ME_SECTIONS: EatMePlanSection[] = [
  section("leafy-greens", "Green leafy vegetables and herbs", "leafy",
    "Amaranth / mulai keerai|Arai keerai|Sirukeerai|Agathi keerai|Murungai keerai / drumstick leaves|Manathakkali keerai|Ponnanganni keerai|Mudakathan keerai|Vallarai keerai|Vendhaya keerai / methi leaves|Palak / spinach|Paruppu keerai / purslane|Thandu keerai / amaranth stems|Radish leaves|Beetroot leaves|Turnip leaves|Colocasia leaves / seppankizhangu leaves|Mustard greens|Coriander leaves|Curry leaves|Mint / pudina|Dill leaves|Spring onion greens"),
  section("vegetables", "Everyday, colourful, root and traditional vegetables", "vegetable",
    "Bottle gourd / sorakkai|Ridge gourd / peerkangai|Snake gourd / pudalangai|Ash gourd / poosanikai|Pumpkin / parangikai|Bitter gourd / pavakkai|Ivy gourd / kovakkai|Chow chow / chayote|Yellow cucumber / dosakai|Cucumber|Zucchini|French beans|Cluster beans / kothavarangai|Broad beans / avarakkai|Yard-long beans / karamani|Fresh green peas|Drumstick / murungakkai|Banana flower / vazhaipoo|Agathi flower|Tomato|Brinjal - purple|Brinjal - green / white / striped|Capsicum - green|Capsicum - red / yellow|Ladies' finger / vendakkai|Raw banana / vazhakkai|Green chilli|Cabbage - green|Cabbage - red / purple|Cauliflower|Broccoli|Knol-khol / noolkol|Turnip|Radish|Carrot|Beetroot|Sweet potato / sakkaravalli kizhangu|Yam / senai kizhangu|Colocasia / seppankizhangu|Tapioca / maravalli kizhangu|Potato|Elephant-foot yam|Onion|Small onion / shallots|Garlic|Ginger|Raw mango|Breadfruit|Banana stem / vazhaithandu|Jackfruit - unripe|Mushroom|Corn - fresh"),
  section("fruits", "Whole fruits", "fruit",
    "Guava|Papaya|Orange / sweet lime|Amla / Indian gooseberry|Banana - small / medium|Watermelon|Muskmelon|Pomegranate|Pineapple|Sapota / chikoo|Mango|Grapes|Apple|Pear|Custard apple|Jackfruit - ripe|Indian jujube / elantha pazham|Jamun / naval pazham|Wood apple / vilampazham|Bael fruit|Star fruit|Dragon fruit|Kiwi|Strawberry / berries|Tender coconut flesh"),
  section("grains", "Whole and minimally processed grains and millets", "grain",
    "Regular parboiled rice / puzhungal arisi|Hand-pounded rice|Brown rice|Red rice / Kerala matta rice|Black rice / kavuni rice|Unpolished local rice|Flattened rice / aval|Rice flakes with vegetables / protein|Rice noodles / idiyappam|Whole wheat chapati / phulka|Broken wheat / samba rava|Whole wheat dosa|Barley|Oats|Whole maize / makka / cholam|Finger millet / ragi / kezhvaragu|Pearl millet / bajra / kambu|Sorghum / jowar / cholam|Foxtail millet / thinai|Little millet / samai|Kodo millet / varagu|Barnyard millet / kuthiraivali|Proso millet / panivaragu"),
  section("legumes", "Dals, pulses, legumes and soy", "legume",
    "Toor dal / thuvaram paruppu|Yellow moong dal / pasi paruppu|Split green moong|Masoor dal / red lentil|Urad dal / ulutham paruppu|Chana dal / kadalai paruppu|Horse gram / kollu|Whole green gram / pachai payaru|Black chana / kondakadalai|White chickpea / kabuli chana|Cowpea / karamani / thatta payaru|Rajma / kidney beans|Field beans / mochai|Dry peas|Moth beans|Double beans / lima beans|Fresh hyacinth beans|Mixed sprouts|Soybeans|Tofu|Soy chunks|Tempeh|Roasted gram / pottukadalai|Groundnut sundal"),
  section("nuts-seeds", "Nuts and seeds", "nutsSeeds",
    "Groundnuts / peanuts|Almonds|Walnuts|Cashews|Pistachios|Hazelnuts|Sesame - white|Sesame - black|Flaxseed|Pumpkin seeds|Sunflower seeds|Chia seeds|Watermelon seeds|Garden cress / aliv / halim seeds"),
  section("dairy-calcium", "Dairy and calcium-rich foods", "dairyCalcium",
    "Milk - unsweetened|Curd / yogurt - unsweetened|Buttermilk - little salt|Paneer - moderate portion|Calcium-set tofu|Ragi dish|Sesame-based chutney / podi|Fortified unsweetened soy milk"),
  section("fermented", "Balanced fermented foods", "fermented",
    "Idli with sambar / protein|Dosa / adai with sambar / protein|Uthappam with vegetables and protein|Appam with vegetable / protein side|Ragi / kambu koozh|Curd rice with vegetables / protein|Homemade fermented pickle"),
  section("natural-protein", "Eggs, fish, seafood and lean meat", "naturalProtein",
    "Whole boiled / steamed egg|Egg omelette with vegetables|Egg curry|Sardine / mathi|Mackerel / ayala|Indian salmon / rawas|Seer fish / vanjaram|Pomfret|Anchovy / nethili|Rohu / catla|Tuna|Prawn / shrimp|Crab|Squid / cuttlefish|Mussels / clams|Chicken - lean / home-cooked|Turkey|Mutton / goat|Beef / pork"),
  section("healthy-fats", "Traditional fats in moderate portions", "healthyFat",
    "Fresh coconut|Unsweetened coconut chutney|Groundnut oil|Sesame oil|Rice-bran oil|Mustard oil|Sunflower oil|Ghee - small quantity"),
  section("herbs-spices", "Spices and aromatics", "herbSpice",
    "Turmeric|Cumin / jeera|Black pepper|Coriander seed|Mustard seed|Fenugreek / vendhayam|Fennel / sombu|Ajwain / omam|Cinnamon|Clove|Cardamom|Garlic|Ginger|Tamarind|Lemon / lime"),
  section("healthy-drinks", "Healthier drinks", "healthyDrink",
    "Plain water|Unsweetened lemon water|Thin buttermilk|Unsweetened tea / coffee|Tender coconut water"),
  section("foods-to-limit", "Foods to limit", "limit",
    "White bread / bun|Maida parotta / puri|Bakery biscuits / cakes|Refined noodles / pasta|Sausage / salami / bacon|Nuggets / processed meat|Deep-fried fish / chicken|Murukku / mixture / chips|Bajji / bonda / vada|Poori / parotta|Bakery biscuits / cake / puffs|Laddu / halwa / mysore pak / sweets|Ice cream / sweetened dessert|Chocolate / candy|Sugary tea / coffee|Soft drink / energy drink|Packaged fruit juice|Sweetened health / malt drink|Instant noodles|Fast food / pizza / burger|Restaurant biryani / fried rice|Pickle in more than a small portion|Appalam / papad|Salted packaged nuts|Processed meat|Alcohol", "limit"),
];

export const DEFAULT_EAT_ME_GOALS: EatMePlanGoal[] = [
  { id: "foundation-vegetables-two-meals", label: "Vegetables at 2+ meals", bucket: "foundations", metric: "days", mode: "minimum", minimum: 25, group: "vegetable", description: "Days with vegetables across at least two meals." },
  { id: "foundation-fruit-days", label: "Whole fruit days", bucket: "foundations", metric: "days", mode: "minimum", minimum: 25, group: "fruit" },
  { id: "foundation-protein-two-meals", label: "Protein at 2+ meals", bucket: "foundations", metric: "days", mode: "minimum", minimum: 25, group: "naturalProtein" },
  { id: "foundation-calcium-days", label: "Milk, curd or calcium alternative days", bucket: "foundations", metric: "days", mode: "minimum", minimum: 25, group: "dairyCalcium" },
  { id: "foundation-nuts-days", label: "Nuts or seeds days", bucket: "foundations", metric: "days", mode: "minimum", minimum: 25, group: "nutsSeeds" },
  { id: "foundation-no-sugary-drink", label: "Logged days without sugary drinks", bucket: "foundations", metric: "days", mode: "minimum", minimum: 25, group: "healthyDrink" },
  { id: "manual-salt-moderate", label: "Salt kept moderate", bucket: "foundations", metric: "days", mode: "minimum", minimum: 25, manual: true },
  { id: "manual-balanced-plate", label: "Balanced main-meal portions", bucket: "foundations", metric: "days", mode: "minimum", minimum: 25, manual: true },
  { id: "frequency-vegetables", label: "Vegetable servings", bucket: "frequency", metric: "servings", mode: "range", minimum: 60, maximum: 90, group: "vegetable" },
  { id: "frequency-leafy", label: "Green leafy vegetable servings", bucket: "frequency", metric: "servings", mode: "range", minimum: 12, maximum: 20, group: "leafy" },
  { id: "frequency-fruit", label: "Whole-fruit servings", bucket: "frequency", metric: "servings", mode: "range", minimum: 30, maximum: 60, group: "fruit" },
  { id: "frequency-legumes", label: "Dal and legume servings", bucket: "frequency", metric: "servings", mode: "range", minimum: 30, maximum: 60, group: "legume" },
  { id: "frequency-grains", label: "Whole or minimally processed grain meals", bucket: "frequency", metric: "meals", mode: "range", minimum: 30, maximum: 60, group: "grain" },
  { id: "frequency-fermented", label: "Balanced fermented-food meals", bucket: "frequency", metric: "meals", mode: "range", minimum: 8, maximum: 20, group: "fermented" },
  { id: "frequency-fish-protein", label: "Fish and seafood meals", bucket: "frequency", metric: "meals", mode: "range", minimum: 8, maximum: 12, group: "naturalProtein" },
  { id: "variety-leafy", label: "Different leafy vegetables", bucket: "variety", metric: "variety", mode: "minimum", minimum: 4, group: "leafy" },
  { id: "variety-vegetables", label: "Different non-leafy vegetables", bucket: "variety", metric: "variety", mode: "minimum", minimum: 12, group: "vegetable" },
  { id: "variety-fruits", label: "Different whole fruits", bucket: "variety", metric: "variety", mode: "minimum", minimum: 6, group: "fruit" },
  { id: "variety-legumes", label: "Different dals and legumes", bucket: "variety", metric: "variety", mode: "minimum", minimum: 5, group: "legume" },
  { id: "variety-grains", label: "Different whole grains and millets", bucket: "variety", metric: "variety", mode: "minimum", minimum: 3, group: "grain" },
  { id: "variety-nuts", label: "Different nuts and seeds", bucket: "variety", metric: "variety", mode: "minimum", minimum: 4, group: "nutsSeeds" },
  { id: "variety-natural-protein", label: "Different natural protein foods", bucket: "variety", metric: "variety", mode: "minimum", minimum: 4, group: "naturalProtein" },
  { id: "variety-plants", label: "Different plant foods overall", bucket: "variety", metric: "variety", mode: "minimum", minimum: 20 },
  { id: "rotation-weekly", label: "Weekly food rotation", bucket: "rotation", metric: "weeklyPresence", mode: "minimum", minimum: 1 },
  { id: "limit-sugary-drinks", label: "Sugary drinks", bucket: "limits", metric: "occasions", mode: "maximum", maximum: 0, group: "limit" },
  { id: "limit-deep-fried", label: "Deep-fried snacks", bucket: "limits", metric: "occasions", mode: "maximum", maximum: 4, group: "limit" },
  { id: "limit-sweets", label: "Sweets and desserts", bucket: "limits", metric: "occasions", mode: "maximum", maximum: 4, group: "limit" },
  { id: "limit-restaurant", label: "Restaurant and fast-food meals", bucket: "limits", metric: "occasions", mode: "maximum", maximum: 4, group: "limit" },
];

export const createDefaultEatMePlan = (): EatMePlan => ({
  id: "south-indian-monthly-healthy-food-checklist",
  version: 1,
  name: "South Indian Monthly Healthy Food Checklist",
  description: "A reusable monthly variety and frequency checklist for a generally healthy adult.",
  source: "default",
  updatedAt: "2026-08-18T00:00:00.000Z",
  sections: DEFAULT_EAT_ME_SECTIONS.map((item) => ({ ...item, foods: item.foods.map((food) => ({ ...food, aliases: [...food.aliases] })) })),
  goals: DEFAULT_EAT_ME_GOALS.map((goal) => ({ ...goal })),
});
