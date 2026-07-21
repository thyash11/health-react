import React, { useState } from "react";
import { 
  Plus, 
  Search, 
  Trash2, 
  Edit3, 
  UtensilsCrossed, 
  Filter, 
  Calendar, 
  X, 
  Check, 
  Info 
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { DailyLogEntry, MealType, FoodCategory } from "../../types";
import { formatDateForDisplay } from "../../utils/nutritionCalculator";

export const DailyFoodLogView: React.FC = () => {
  const { 
    selectedDate, 
    setSelectedDate, 
    dailyLogs, 
    addLogEntry, 
    updateLogEntry, 
    deleteLogEntry, 
    foodLibrary 
  } = useTracker();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMealFilter, setSelectedMealFilter] = useState<string>("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [formMeal, setFormMeal] = useState<MealType>("Breakfast");
  const [formTime, setFormTime] = useState("10:30 AM");
  const [formFoodName, setFormFoodName] = useState("");
  const [formCategory, setFormCategory] = useState<FoodCategory>("Breakfast");
  const [formQuantity, setFormQuantity] = useState<number>(100);
  const [formCalories, setFormCalories] = useState<number>(150);
  const [formProtein, setFormProtein] = useState<number>(5);
  const [formCarbs, setFormCarbs] = useState<number>(20);
  const [formFat, setFormFat] = useState<number>(3);
  const [formFiber, setFormFiber] = useState<number>(2);
  const [formWater, setFormWater] = useState<number>(0);
  const [formWalk, setFormWalk] = useState<number>(0);
  const [formNotes, setFormNotes] = useState("");

  const mealsList: MealType[] = ["Breakfast", "Lunch", "Evening Snack", "Mid snack", "Dinner", "Drink", "Other"];
  const categoriesList: FoodCategory[] = [
    "Breakfast", "Chutney", "Grain", "Protein", "Dessert", "Snack", 
    "Bakery", "Added Sugar", "Fruit", "Dal/Curry", "Sugary Drink", "Added Fat", "Vegetable", "Beverage", "Other"
  ];

  // Auto-calculate macros when food is chosen from Library
  const handleSelectLibraryItem = (item: typeof foodLibrary[0]) => {
    setFormFoodName(item.name);
    setFormCategory(item.category);
    const qty = item.defaultServingGrams || 100;
    setFormQuantity(qty);
    const factor = qty / 100;
    setFormCalories(Math.round(item.caloriesPer100g * factor));
    setFormProtein(Math.round(item.proteinPer100g * factor * 10) / 10);
    setFormCarbs(Math.round(item.carbsPer100g * factor * 10) / 10);
    setFormFat(Math.round(item.fatPer100g * factor * 10) / 10);
    setFormFiber(Math.round(item.fiberPer100g * factor * 10) / 10);
  };

  const handleQuantityChange = (newQty: number) => {
    setFormQuantity(newQty);
    // Find matching food item in library to rescale
    const match = foodLibrary.find((f) => f.name.toLowerCase() === formFoodName.toLowerCase());
    if (match && newQty > 0) {
      const factor = newQty / 100;
      setFormCalories(Math.round(match.caloriesPer100g * factor));
      setFormProtein(Math.round(match.proteinPer100g * factor * 10) / 10);
      setFormCarbs(Math.round(match.carbsPer100g * factor * 10) / 10);
      setFormFat(Math.round(match.fatPer100g * factor * 10) / 10);
      setFormFiber(Math.round(match.fiberPer100g * factor * 10) / 10);
    }
  };

  const handleSaveEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formFoodName.trim()) return;

    if (editingId) {
      updateLogEntry(editingId, {
        date: selectedDate,
        meal: formMeal,
        time: formTime,
        foodItem: formFoodName,
        category: formCategory,
        quantityGrams: Number(formQuantity),
        calories: Number(formCalories),
        protein: Number(formProtein),
        carbs: Number(formCarbs),
        fat: Number(formFat),
        fiber: Number(formFiber),
        waterMl: Number(formWater),
        walkKm: Number(formWalk),
        notes: formNotes,
      });
      setEditingId(null);
    } else {
      addLogEntry({
        date: selectedDate,
        meal: formMeal,
        time: formTime,
        foodItem: formFoodName,
        category: formCategory,
        quantityGrams: Number(formQuantity),
        calories: Number(formCalories),
        protein: Number(formProtein),
        carbs: Number(formCarbs),
        fat: Number(formFat),
        fiber: Number(formFiber),
        waterMl: Number(formWater),
        walkKm: Number(formWalk),
        notes: formNotes,
      });
    }

    // Reset form
    setFormFoodName("");
    setFormNotes("");
    setShowAddForm(false);
  };

  const startEdit = (entry: DailyLogEntry) => {
    setEditingId(entry.id);
    setSelectedDate(entry.date);
    setFormMeal(entry.meal);
    setFormTime(entry.time || "10:30 AM");
    setFormFoodName(entry.foodItem);
    setFormCategory(entry.category);
    setFormQuantity(entry.quantityGrams);
    setFormCalories(entry.calories);
    setFormProtein(entry.protein);
    setFormCarbs(entry.carbs);
    setFormFat(entry.fat);
    setFormFiber(entry.fiber);
    setFormWater(entry.waterMl || 0);
    setFormWalk(entry.walkKm || 0);
    setFormNotes(entry.notes || "");
    setShowAddForm(true);
  };

  // Filter logs by date, search query and meal
  const filteredLogs = dailyLogs.filter((log) => {
    const dateMatch = log.date === selectedDate;
    const searchMatch =
      log.foodItem.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.notes && log.notes.toLowerCase().includes(searchQuery.toLowerCase()));
    const mealMatch = selectedMealFilter === "All" || log.meal === selectedMealFilter;
    return dateMatch && searchMatch && mealMatch;
  });

  // Calculate totals
  const totalCal = filteredLogs.reduce((acc, l) => acc + (l.calories || 0), 0);
  const totalProtein = filteredLogs.reduce((acc, l) => acc + (l.protein || 0), 0);
  const totalCarbs = filteredLogs.reduce((acc, l) => acc + (l.carbs || 0), 0);
  const totalFat = filteredLogs.reduce((acc, l) => acc + (l.fat || 0), 0);
  const totalFiber = filteredLogs.reduce((acc, l) => acc + (l.fiber || 0), 0);
  const totalWater = filteredLogs.reduce((acc, l) => acc + (l.waterMl || 0), 0);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header Controls Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-sm">
        
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <UtensilsCrossed className="w-5 h-5 text-blue-600" />
            Daily Food Log Editor
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log meals, scale food quantities, and auto-calculate calories & macros
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Add Food Entry Button */}
          <button
            onClick={() => {
              setEditingId(null);
              setShowAddForm(!showAddForm);
            }}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs px-3.5 py-2 rounded-xl transition-colors border border-slate-200"
          >
            {showAddForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{showAddForm ? "Close Form" : "Add Food"}</span>
          </button>
        </div>

      </div>

      {/* Manual Entry Form */}
      {showAddForm && (
        <form
          onSubmit={handleSaveEntry}
          className="bg-white border border-blue-200 rounded-2xl p-5 shadow-lg space-y-4 animate-in fade-in duration-200"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-blue-600" />
              {editingId ? "Edit Food Entry" : "New Food Entry"} for {formatDateForDisplay(selectedDate)}
            </h3>
            <span className="text-xs text-slate-500">Auto-calculates from food library presets</span>
          </div>

          {/* Quick Library Picker Suggestion Chips */}
          <div className="space-y-1.5">
            <label className="text-xs text-slate-500 font-medium">Quick Pick from Food Library:</label>
            <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
              {foodLibrary.slice(0, 14).map((f) => (
                <button
                  type="button"
                  key={f.id}
                  onClick={() => handleSelectLibraryItem(f)}
                  className="px-2.5 py-1 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-blue-700 text-xs rounded-lg transition-colors border border-slate-200/80 font-medium"
                >
                  {f.name} ({f.defaultServingGrams}g)
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            
            {/* Meal */}
            <div>
              <label className="text-slate-500 block mb-1">Meal Type</label>
              <select
                value={formMeal}
                onChange={(e) => setFormMeal(e.target.value as MealType)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {mealsList.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            {/* Time */}
            <div>
              <label className="text-slate-500 block mb-1">Time</label>
              <input
                type="text"
                value={formTime}
                onChange={(e) => setFormTime(e.target.value)}
                placeholder="10:30 AM"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Food Name */}
            <div className="col-span-2">
              <label className="text-slate-500 block mb-1">Food Item Name *</label>
              <input
                type="text"
                value={formFoodName}
                onChange={(e) => setFormFoodName(e.target.value)}
                placeholder="e.g. Cooked White Rice, Ghee Podi Idli"
                required
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Category */}
            <div>
              <label className="text-slate-500 block mb-1">Category</label>
              <select
                value={formCategory}
                onChange={(e) => setFormCategory(e.target.value as FoodCategory)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                {categoriesList.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Quantity */}
            <div>
              <label className="text-slate-500 block mb-1">Quantity (g / ml)</label>
              <input
                type="number"
                value={formQuantity}
                onChange={(e) => handleQuantityChange(Number(e.target.value))}
                min={1}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Calories */}
            <div>
              <label className="text-slate-500 block mb-1">Calories (kcal)</label>
              <input
                type="number"
                value={formCalories}
                onChange={(e) => setFormCalories(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-amber-600 font-bold rounded-xl p-2.5"
              />
            </div>

            {/* Protein */}
            <div>
              <label className="text-slate-500 block mb-1">Protein (g)</label>
              <input
                type="number"
                step="0.1"
                value={formProtein}
                onChange={(e) => setFormProtein(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-emerald-600 font-bold rounded-xl p-2.5"
              />
            </div>

            {/* Carbs */}
            <div>
              <label className="text-slate-500 block mb-1">Carbs (g)</label>
              <input
                type="number"
                step="0.1"
                value={formCarbs}
                onChange={(e) => setFormCarbs(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5"
              />
            </div>

            {/* Fat */}
            <div>
              <label className="text-slate-500 block mb-1">Fat (g)</label>
              <input
                type="number"
                step="0.1"
                value={formFat}
                onChange={(e) => setFormFat(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5"
              />
            </div>

            {/* Fiber */}
            <div>
              <label className="text-slate-500 block mb-1">Fiber (g)</label>
              <input
                type="number"
                step="0.1"
                value={formFiber}
                onChange={(e) => setFormFiber(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-teal-600 font-bold rounded-xl p-2.5"
              />
            </div>

            {/* Water */}
            <div>
              <label className="text-slate-500 block mb-1">Water (ml)</label>
              <input
                type="number"
                value={formWater}
                onChange={(e) => setFormWater(Number(e.target.value))}
                placeholder="0"
                className="w-full bg-slate-50 border border-slate-200 text-cyan-600 rounded-xl p-2.5"
              />
            </div>

            {/* Walk */}
            <div>
              <label className="text-slate-500 block mb-1">Walk Distance (km)</label>
              <input
                type="number"
                step="0.1"
                value={formWalk}
                onChange={(e) => setFormWalk(Number(e.target.value))}
                placeholder="0.0"
                className="w-full bg-slate-50 border border-slate-200 text-indigo-600 rounded-xl p-2.5"
              />
            </div>

            {/* Notes */}
            <div className="col-span-2">
              <label className="text-slate-500 block mb-1">Notes / Portions</label>
              <input
                type="text"
                value={formNotes}
                onChange={(e) => setFormNotes(e.target.value)}
                placeholder="e.g. 2 medium dosas, 250g reported"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl p-2.5"
              />
            </div>

          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>{editingId ? "Update Entry" : "Save Entry"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs shadow-sm">
        
        {/* Search */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search food item, category or notes..."
            className="w-full bg-slate-50 border border-slate-200/80 pl-9 pr-3 py-2 text-slate-900 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Meal Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 scrollbar-none">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 shrink-0" />
          {["All", ...mealsList].map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMealFilter(m)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                selectedMealFilter === m
                  ? "bg-blue-50 text-blue-700 font-semibold border border-blue-200"
                  : "bg-slate-100/80 text-slate-600 hover:text-slate-900"
              }`}
            >
              {m}
            </button>
          ))}
        </div>

      </div>

      {/* Food Log Table (Direct Spreadsheet Match) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1280px] text-left text-xs border-separate border-spacing-0">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase tracking-wider">
                <th className="sticky left-0 z-30 w-32 min-w-32 bg-slate-50 p-3">Meal</th>
                <th className="sticky left-32 z-30 w-64 min-w-64 border-r border-slate-200 bg-slate-50 p-3 shadow-[5px_0_8px_-8px_rgba(15,23,42,0.45)]">Food Item</th>
                <th className="p-3">Time</th>
                <th className="p-3">Category</th>
                <th className="p-3 text-right">Qty</th>
                <th className="p-3 text-right text-amber-600">Calories</th>
                <th className="p-3 text-right text-emerald-600">Protein</th>
                <th className="p-3 text-right">Carbs</th>
                <th className="p-3 text-right">Fat</th>
                <th className="p-3 text-right text-teal-600">Fiber</th>
                <th className="p-3 text-right text-cyan-600">Water</th>
                <th className="p-3">Notes</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={13} className="text-center py-12 text-slate-400">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <UtensilsCrossed className="w-8 h-8 text-slate-300" />
                      <p className="font-medium text-slate-600">No food items logged for {formatDateForDisplay(selectedDate)}</p>
                      <p className="text-xs text-slate-400">Click "Add Food" to log a meal</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="group hover:bg-slate-50/80 transition-colors">
                    <td className="sticky left-0 z-20 w-32 min-w-32 bg-white p-3 font-semibold text-slate-900 transition-colors group-hover:bg-slate-50">{log.meal}</td>
                    <td className="sticky left-32 z-20 w-64 min-w-64 border-r border-slate-200 bg-white p-3 font-medium text-slate-900 shadow-[5px_0_8px_-8px_rgba(15,23,42,0.45)] transition-colors group-hover:bg-slate-50">{log.foodItem}</td>
                    <td className="p-3 text-slate-400 text-[11px] whitespace-nowrap">{log.time || "—"}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {log.category}
                      </span>
                    </td>
                    <td className="p-3 text-right font-medium">{log.quantityGrams}g</td>
                    <td className={`p-3 text-right font-bold ${log.calories > 400 ? "text-rose-600" : "text-amber-600"}`}>
                      {log.calories}
                    </td>
                    <td className="p-3 text-right font-bold text-emerald-600">{log.protein}g</td>
                    <td className="p-3 text-right">{log.carbs}g</td>
                    <td className="p-3 text-right">{log.fat}g</td>
                    <td className="p-3 text-right font-medium text-teal-600">{log.fiber}g</td>
                    <td className="p-3 text-right text-cyan-600">{log.waterMl ? `${log.waterMl}ml` : "—"}</td>
                    <td className="p-3 text-slate-500 text-[11px] max-w-xs truncate">{log.notes || "—"}</td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => startEdit(log)}
                          className="p-1 hover:bg-slate-100 text-slate-500 hover:text-blue-600 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => deleteLogEntry(log.id)}
                          className="p-1 hover:bg-slate-100 text-slate-500 hover:text-rose-600 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

            {/* Summary Totals Footer Row */}
            {filteredLogs.length > 0 && (
              <tfoot>
                <tr className="bg-slate-50 font-bold text-slate-900 border-t border-slate-200 text-xs">
                  <td colSpan={4} className="p-3 text-slate-600 uppercase tracking-wider">
                    Total Daily Intake ({filteredLogs.length} items)
                  </td>
                  <td className="p-3 text-right text-slate-400">—</td>
                  <td className="p-3 text-right text-amber-600 text-sm">{Math.round(totalCal)} kcal</td>
                  <td className="p-3 text-right text-emerald-600 text-sm">{totalProtein.toFixed(1)}g</td>
                  <td className="p-3 text-right text-slate-800">{totalCarbs.toFixed(1)}g</td>
                  <td className="p-3 text-right text-slate-800">{totalFat.toFixed(1)}g</td>
                  <td className="p-3 text-right text-teal-600">{totalFiber.toFixed(1)}g</td>
                  <td className="p-3 text-right text-cyan-600">{totalWater} ml</td>
                  <td colSpan={2} className="p-3"></td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

    </div>
  );
};
