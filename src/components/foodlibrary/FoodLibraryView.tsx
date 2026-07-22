import React, { useRef, useState } from "react";
import { 
  BookOpen, 
  Search, 
  Plus, 
  Star, 
  Trash2, 
  Edit, 
  Utensils, 
  X, 
  Check, 
  Filter,
  Download,
  Upload,
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { FoodItem, FoodCategory } from "../../types";
import { formatDateForDisplay } from "../../utils/nutritionCalculator";

interface FoodLibraryViewProps {
  onLogFood: (food: FoodItem) => void;
}

export const FoodLibraryView: React.FC<FoodLibraryViewProps> = ({ onLogFood }) => {
  type NumericDraft = number | "";
  const { 
    foodLibrary, 
    addFoodItem, 
    addBatchFoodItems,
    updateFoodItem, 
    deleteFoodItem, 
    toggleFavoriteFood, 
    selectedDate,
    foodCategories,
  } = useTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);
  const importInputRef = useRef<HTMLInputElement>(null);
  const [importMessage, setImportMessage] = useState<{ type: "success" | "error"; text: string }>();

  // New Item State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodCategory>("Breakfast");
  const [serving, setServing] = useState<NumericDraft>("");
  const [cal100, setCal100] = useState<NumericDraft>("");
  const [p100, setP100] = useState<NumericDraft>("");
  const [c100, setC100] = useState<NumericDraft>("");
  const [f100, setF100] = useState<NumericDraft>("");
  const [fib100, setFib100] = useState<NumericDraft>("");

  const numericDraft = (value: string): NumericDraft => value === "" ? "" : Number(value);

  const downloadFoodLibraryTemplate = () => {
    const template = {
      app: "NutriMetric",
      purpose: "Food Library import template",
      instructions: "Ask ChatGPT to replace the example or add more objects inside foods. Keep the same field names and return valid JSON only.",
      allowedCategories: foodCategories,
      foods: [
        {
          name: "Example food",
          category: foodCategories[0] || "Other",
          defaultServingGrams: 100,
          caloriesPer100g: 100,
          proteinPer100g: 5,
          carbsPer100g: 15,
          fatPer100g: 2,
          fiberPer100g: 3,
        },
      ],
    };
    const blob = new Blob([JSON.stringify(template, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "nutrimetric-food-library-template.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importFoodLibraryJson = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      const parsed: unknown = JSON.parse(await file.text());
      const rawFoods = Array.isArray(parsed)
        ? parsed
        : parsed && typeof parsed === "object" && Array.isArray((parsed as { foods?: unknown }).foods)
          ? (parsed as { foods: unknown[] }).foods
          : null;
      if (!rawFoods || rawFoods.length === 0) throw new Error("The JSON must contain a non-empty foods array.");

      const numberField = (value: unknown, field: string, row: number, mustBePositive = false) => {
        const number = Number(value);
        if (!Number.isFinite(number) || number < 0 || (mustBePositive && number <= 0)) {
          throw new Error(`Food ${row}: ${field} must be ${mustBePositive ? "greater than zero" : "zero or greater"}.`);
        }
        return number;
      };

      const seenNames = new Set(foodLibrary.map((item) => item.name.trim().toLowerCase()));
      const foods: Omit<FoodItem, "id">[] = rawFoods.map((rawFood, index) => {
        const row = index + 1;
        if (!rawFood || typeof rawFood !== "object" || Array.isArray(rawFood)) throw new Error(`Food ${row} must be an object.`);
        const value = rawFood as Record<string, unknown>;
        const foodName = typeof value.name === "string" ? value.name.trim() : "";
        if (!foodName) throw new Error(`Food ${row}: name is required.`);
        if (seenNames.has(foodName.toLowerCase())) throw new Error(`Food ${row}: “${foodName}” is duplicated or already exists.`);
        seenNames.add(foodName.toLowerCase());
        if (typeof value.category !== "string" || !foodCategories.includes(value.category)) {
          throw new Error(`Food ${row}: category must be one of ${foodCategories.join(", ")}.`);
        }

        return {
          name: foodName,
          category: value.category,
          defaultServingGrams: numberField(value.defaultServingGrams, "defaultServingGrams", row, true),
          caloriesPer100g: numberField(value.caloriesPer100g, "caloriesPer100g", row),
          proteinPer100g: numberField(value.proteinPer100g, "proteinPer100g", row),
          carbsPer100g: numberField(value.carbsPer100g, "carbsPer100g", row),
          fatPer100g: numberField(value.fatPer100g, "fatPer100g", row),
          fiberPer100g: numberField(value.fiberPer100g, "fiberPer100g", row),
          isFavorite: false,
        };
      });

      if (!addBatchFoodItems(foods)) return;
      setImportMessage({ type: "success", text: `Imported ${foods.length} food ${foods.length === 1 ? "item" : "items"}.` });
    } catch (error) {
      setImportMessage({ type: "error", text: error instanceof Error ? error.message : "Could not import this JSON file." });
    }
  };

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || serving === "" || serving <= 0) return;

    const added = addFoodItem({
      name,
      category,
      defaultServingGrams: Number(serving),
      caloriesPer100g: Number(cal100),
      proteinPer100g: Number(p100),
      carbsPer100g: Number(c100),
      fatPer100g: Number(f100),
      fiberPer100g: Number(fib100),
      isFavorite: false,
    });
    if (!added) return;

    setName("");
    setServing("");
    setCal100("");
    setP100("");
    setC100("");
    setF100("");
    setFib100("");
    setShowAddModal(false);
  };

  const quickLogFood = (item: FoodItem) => {
    onLogFood(item);
  };

  const filteredItems = foodLibrary.filter((item) => {
    const searchMatch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    const catMatch = selectedCategory === "All" || item.category === selectedCategory;
    return searchMatch && catMatch;
  });

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Bar */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <BookOpen className="w-5 h-5 text-blue-600" />
          Nutritional Food Library ({foodLibrary.length} items)
        </h2>
        <div className="mt-1 flex items-center justify-between gap-3">
          <p className="text-xs text-slate-500 mt-0.5">
            Database of food items with macro density per 100g and default portion sizes
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={downloadFoodLibraryTemplate}
              title="Download JSON template for ChatGPT"
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Sample JSON</span>
            </button>
            <button
              type="button"
              onClick={() => importInputRef.current?.click()}
              title="Import Food Library JSON"
              className="flex items-center gap-1.5 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700 transition-colors hover:bg-blue-100"
            >
              <Upload className="h-4 w-4" />
              <span className="hidden sm:inline">Import JSON</span>
            </button>
            <input
              ref={importInputRef}
              type="file"
              accept="application/json,.json"
              onChange={importFoodLibraryJson}
              className="hidden"
            />
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white shadow-xs transition-colors hover:bg-blue-700 sm:px-4"
            >
              <Plus className="w-4 h-4" />
              <span>Add Custom Food</span>
            </button>
          </div>
        </div>
        {importMessage && (
          <p className={`mt-3 rounded-lg px-3 py-2 text-xs font-medium ${
            importMessage.type === "success" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"
          }`}>
            {importMessage.text}
          </p>
        )}
      </div>

      {/* Add Custom Food Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-3 backdrop-blur-xs sm:p-4">
          <form
            onSubmit={handleCreateFood}
            className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-blue-200 bg-white p-4 text-xs shadow-2xl space-y-4 sm:p-5"
          >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm">Add New Item to Food Library</h3>
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="col-span-2">
              <label className="text-slate-500 block mb-1">Food Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Parotta, Masala Dosa"
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as FoodCategory)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5"
              >
                {foodCategories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Default Portion (g/ml)</label>
              <input
                type="number"
                value={serving}
                onChange={(e) => setServing(numericDraft(e.target.value))}
                onFocus={(e) => e.currentTarget.select()}
                min={1}
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 font-bold"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Calories / 100g</label>
              <input
                type="number"
                value={cal100}
                onChange={(e) => setCal100(numericDraft(e.target.value))}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full bg-slate-50 border border-slate-200 text-amber-600 font-bold rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Protein / 100g (g)</label>
              <input
                type="number"
                step="0.1"
                value={p100}
                onChange={(e) => setP100(numericDraft(e.target.value))}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full bg-slate-50 border border-slate-200 text-emerald-600 font-bold rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Carbs / 100g (g)</label>
              <input
                type="number"
                step="0.1"
                value={c100}
                onChange={(e) => setC100(numericDraft(e.target.value))}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Fat / 100g (g)</label>
              <input
                type="number"
                step="0.1"
                value={f100}
                onChange={(e) => setF100(numericDraft(e.target.value))}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Fiber / 100g (g)</label>
              <input
                type="number"
                step="0.1"
                value={fib100}
                onChange={(e) => setFib100(numericDraft(e.target.value))}
                onFocus={(e) => e.currentTarget.select()}
                className="w-full bg-slate-50 border border-slate-200 text-teal-600 font-bold rounded-xl p-2.5"
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddModal(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
            >
              Save to Library
            </button>
          </div>
          </form>
        </div>
      )}

      {/* Search & Category Filter */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food library..."
            className="w-full bg-slate-50 border border-slate-200/80 pl-9 pr-3 py-2 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto scrollbar-none pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {["All", ...foodCategories].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                  : "bg-slate-100/80 text-slate-600 hover:text-slate-900"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.map((item) => {
          const factor = item.defaultServingGrams / 100;
          const cal = Math.round(item.caloriesPer100g * factor);
          const prot = (item.proteinPer100g * factor).toFixed(1);
          const carbs = (item.carbsPer100g * factor).toFixed(1);
          const fat = (item.fatPer100g * factor).toFixed(1);
          const fib = (item.fiberPer100g * factor).toFixed(1);

          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200/80 hover:border-blue-200 rounded-2xl p-4 space-y-3 transition-all flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200 inline-block mt-1">
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleFavoriteFood(item.id)}
                    className="text-slate-400 hover:text-amber-500 transition-colors"
                  >
                    <Star
                      className={`w-4 h-4 ${
                        item.isFavorite ? "fill-amber-400 text-amber-500" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Serving Macros Breakdown */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-1">
                  <div className="flex justify-between text-xs font-bold">
                    <span className="text-slate-700">Portion: {item.defaultServingGrams}g</span>
                    <span className="text-amber-600">{cal} kcal</span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-200/60">
                    <span>P: <strong className="text-emerald-600">{prot}g</strong></span>
                    <span>C: <strong className="text-slate-800">{carbs}g</strong></span>
                    <span>F: <strong className="text-slate-800">{fat}g</strong></span>
                    <span>Fib: <strong className="text-teal-600">{fib}g</strong></span>
                  </div>
                </div>

                <p className="text-[10px] text-slate-400">
                  Per 100g: {item.caloriesPer100g} kcal | {item.proteinPer100g}g P | {item.carbsPer100g}g C | {item.fatPer100g}g F | {item.fiberPer100g}g Fib
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                <button
                  onClick={() => deleteFoodItem(item.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors rounded-lg hover:bg-slate-100"
                  title="Delete Item"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => quickLogFood(item)}
                  className="flex items-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-xs px-3 py-1.5 rounded-xl border border-blue-200 transition-colors"
                >
                  <Utensils className="w-3.5 h-3.5" />
                  <span>Log To {formatDateForDisplay(selectedDate)}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
