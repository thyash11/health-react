import React, { useState } from "react";
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
  Filter 
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { FoodItem, FoodCategory } from "../../types";

export const FoodLibraryView: React.FC = () => {
  const { 
    foodLibrary, 
    addFoodItem, 
    updateFoodItem, 
    deleteFoodItem, 
    toggleFavoriteFood, 
    addLogEntry, 
    selectedDate 
  } = useTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [showAddModal, setShowAddModal] = useState(false);

  // New Item State
  const [name, setName] = useState("");
  const [category, setCategory] = useState<FoodCategory>("Breakfast");
  const [serving, setServing] = useState(100);
  const [cal100, setCal100] = useState(150);
  const [p100, setP100] = useState(5);
  const [c100, setC100] = useState(20);
  const [f100, setF100] = useState(3);
  const [fib100, setFib100] = useState(2);

  const categoriesList: FoodCategory[] = [
    "Breakfast", "Chutney", "Grain", "Protein", "Dessert", "Snack", 
    "Bakery", "Added Sugar", "Fruit", "Dal/Curry", "Sugary Drink", "Added Fat", "Vegetable", "Beverage", "Other"
  ];

  const handleCreateFood = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addFoodItem({
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

    setName("");
    setShowAddModal(false);
  };

  const quickLogFood = (item: FoodItem) => {
    const factor = item.defaultServingGrams / 100;
    addLogEntry({
      date: selectedDate,
      meal: item.category === "Breakfast" ? "Breakfast" : item.category === "Protein" ? "Lunch" : "Evening Snack",
      time: "12:00 PM",
      foodItem: item.name,
      category: item.category,
      quantityGrams: item.defaultServingGrams,
      calories: Math.round(item.caloriesPer100g * factor),
      protein: Math.round(item.proteinPer100g * factor * 10) / 10,
      carbs: Math.round(item.carbsPer100g * factor * 10) / 10,
      fat: Math.round(item.fatPer100g * factor * 10) / 10,
      fiber: Math.round(item.fiberPer100g * factor * 10) / 10,
      waterMl: 0,
      walkKm: 0,
      notes: `Logged from Food Library (${item.defaultServingGrams}g)`,
    });
    alert(`Logged ${item.name} (${item.defaultServingGrams}g) for ${selectedDate}!`);
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
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            Nutritional Food Library ({foodLibrary.length} items)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Database of food items with macro density per 100g and default portion sizes
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Food</span>
        </button>
      </div>

      {/* Add Custom Food Modal */}
      {showAddModal && (
        <form
          onSubmit={handleCreateFood}
          className="bg-white border border-blue-200 rounded-2xl p-5 shadow-xl space-y-4 text-xs"
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
                {categoriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Default Portion (g/ml)</label>
              <input
                type="number"
                value={serving}
                onChange={(e) => setServing(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 font-bold"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Calories / 100g</label>
              <input
                type="number"
                value={cal100}
                onChange={(e) => setCal100(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-amber-600 font-bold rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Protein / 100g (g)</label>
              <input
                type="number"
                step="0.1"
                value={p100}
                onChange={(e) => setP100(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-emerald-600 font-bold rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Carbs / 100g (g)</label>
              <input
                type="number"
                step="0.1"
                value={c100}
                onChange={(e) => setC100(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Fat / 100g (g)</label>
              <input
                type="number"
                step="0.1"
                value={f100}
                onChange={(e) => setF100(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Fiber / 100g (g)</label>
              <input
                type="number"
                step="0.1"
                value={fib100}
                onChange={(e) => setFib100(Number(e.target.value))}
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
          {["All", ...categoriesList].map((cat) => (
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
                  <span>Log To {selectedDate.slice(5)}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
