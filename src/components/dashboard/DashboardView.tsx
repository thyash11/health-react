import React from "react";
import { 
  Flame, 
  Dumbbell, 
  Wheat, 
  Droplets, 
  Footprints, 
  Target, 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Utensils, 
  Sparkles 
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { aggregateDailySummary, getScoreColor, formatDateForDisplay } from "../../utils/nutritionCalculator";
import { MealType } from "../../types";

interface DashboardViewProps {
  onNavigateToFoodLog: () => void;
  onOpenAiAssistant: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToFoodLog,
  onOpenAiAssistant,
}) => {
  const { selectedDate, setSelectedDate, dailyLogs, habits, targets, profile } = useTracker();

  // Aggregate selected date
  const summary = aggregateDailySummary(selectedDate, dailyLogs, habits, targets);
  const dayHabit = habits.find((h) => h.date === selectedDate);

  // Filter logs for selected date
  const dayLogs = dailyLogs.filter((l) => l.date === selectedDate);

  // Meals grouping
  const mealsList: MealType[] = ["Breakfast", "Lunch", "Evening Snack", "Mid snack", "Dinner", "Drink", "Other"];
  const mealBreakdown = mealsList.map((meal) => {
    const items = dayLogs.filter((l) => l.meal === meal);
    const calories = items.reduce((acc, i) => acc + (i.calories || 0), 0);
    const protein = items.reduce((acc, i) => acc + (i.protein || 0), 0);
    const carbs = items.reduce((acc, i) => acc + (i.carbs || 0), 0);
    const fat = items.reduce((acc, i) => acc + (i.fat || 0), 0);
    const fiber = items.reduce((acc, i) => acc + (i.fiber || 0), 0);
    return { meal, items, calories, protein, carbs, fat, fiber };
  });

  // Calculate percentage of targets
  const calPct = Math.round((summary.totalCalories / targets.dailyCalories) * 100);
  const proteinPct = Math.round((summary.totalProtein / targets.proteinGrams) * 100);
  const fiberPct = Math.round((summary.totalFiber / targets.fiberGrams) * 100);
  const waterPct = Math.round((summary.totalWater / targets.waterMl) * 100);
  const walkPct = Math.round((summary.totalWalkKm / targets.walkKm) * 100);

  const scoreInfo = getScoreColor(summary.score);

  // Date Shift Helpers
  const shiftDate = (days: number) => {
    const d = new Date(selectedDate);
    d.setDate(d.getDate() + days);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    setSelectedDate(`${year}-${month}-${day}`);
  };

  // Recent 10 dates list for summary table
  const uniqueDates = Array.from(
    new Set([...dailyLogs.map((l) => l.date), ...habits.map((h) => h.date)])
  ).sort().reverse().slice(0, 10);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner: Date Switcher & Day Score */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => shiftDate(-1)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Previous Day"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {formatDateForDisplay(selectedDate)}
              </h2>
              {dayHabit?.dayType && (
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200/80">
                  {dayHabit.dayType}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Target: {targets.dailyCalories} kcal • {targets.proteinGrams}g Protein • {targets.fiberGrams}g Fiber
            </p>
          </div>

          <button
            onClick={() => shiftDate(1)}
            className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
            title="Next Day"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Daily Score Meter */}
        <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">Daily Health Score</span>
            <span className={`text-2xl font-black ${summary.score >= 70 ? "text-emerald-600" : summary.score >= 45 ? "text-amber-600" : "text-rose-600"}`}>
              {summary.score}%
            </span>
          </div>

          <div className="w-14 h-14 relative flex items-center justify-center">
            <svg className="w-14 h-14 transform -rotate-90">
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="5"
                className="text-slate-200"
                fill="transparent"
              />
              <circle
                cx="28"
                cy="28"
                r="22"
                stroke="currentColor"
                strokeWidth="5"
                className={summary.score >= 70 ? "text-emerald-500" : summary.score >= 45 ? "text-amber-500" : "text-rose-500"}
                fill="transparent"
                strokeDasharray={138}
                strokeDashoffset={138 - (138 * summary.score) / 100}
                strokeLinecap="round"
              />
            </svg>
            <Sparkles className="w-4 h-4 text-amber-500 absolute" />
          </div>

          <button
            onClick={onOpenAiAssistant}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>Log Meals</span>
          </button>
        </div>
      </div>

      {/* Target Metrics Grid Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Calories Card */}
        <div className={`p-4 rounded-2xl border shadow-sm ${calPct > 105 ? "bg-rose-50/50 border-rose-200" : "bg-white border-slate-200/80"}`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Calories</span>
            <Flame className={`w-4 h-4 ${calPct > 100 ? "text-rose-500" : "text-amber-500"}`} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{summary.totalCalories}</span>
            <span className="text-xs text-slate-400">/ {targets.dailyCalories}</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${calPct > 105 ? "bg-rose-500" : "bg-amber-500"}`}
              style={{ width: `${Math.min(100, calPct)}%` }}
            />
          </div>
          <span className={`text-[11px] font-semibold mt-1.5 inline-block ${calPct > 100 ? "text-rose-600" : "text-emerald-600"}`}>
            {calPct}% of target
          </span>
        </div>

        {/* Protein Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Protein</span>
            <Dumbbell className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{summary.totalProtein}g</span>
            <span className="text-xs text-slate-400">/ {targets.proteinGrams}g</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all"
              style={{ width: `${Math.min(100, proteinPct)}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold mt-1.5 inline-block text-emerald-600">
            {proteinPct}% of target
          </span>
        </div>

        {/* Fiber Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Fiber</span>
            <Wheat className="w-4 h-4 text-teal-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{summary.totalFiber}g</span>
            <span className="text-xs text-slate-400">/ {targets.fiberGrams}g</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all"
              style={{ width: `${Math.min(100, fiberPct)}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold mt-1.5 inline-block text-teal-600">
            {fiberPct}% of target
          </span>
        </div>

        {/* Water Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Water</span>
            <Droplets className="w-4 h-4 text-cyan-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{summary.totalWater} ml</span>
            <span className="text-xs text-slate-400">/ {targets.waterMl}</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-cyan-500 transition-all"
              style={{ width: `${Math.min(100, waterPct)}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold mt-1.5 inline-block text-cyan-600">
            {waterPct}% of target
          </span>
        </div>

        {/* Walk Activity Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Walk</span>
            <Footprints className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{summary.totalWalkKm} km</span>
            <span className="text-xs text-slate-400">/ {targets.walkKm} km</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-indigo-500 transition-all"
              style={{ width: `${Math.min(100, walkPct)}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold mt-1.5 inline-block text-indigo-600">
            {walkPct}% of target
          </span>
        </div>

        {/* Goal Weight Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Weight Goal</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{targets.currentWeightKg} kg</span>
            <span className="text-xs text-slate-400">Goal: {targets.goalWeightKg}</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all"
              style={{ width: "65%" }}
            />
          </div>
          <span className="text-[11px] font-semibold mt-1.5 inline-block text-slate-600">
            {(targets.currentWeightKg - targets.goalWeightKg).toFixed(1)} kg to lose
          </span>
        </div>

      </div>

      {/* Main Grid: Meals Breakdown + Daily Log History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Meals Breakdown for Selected Date */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-blue-600" />
              Meal Breakdown ({summary.entriesCount} entries logged)
            </h3>
            <button
              onClick={onNavigateToFoodLog}
              className="text-xs text-blue-600 hover:text-blue-700 font-semibold underline"
            >
              Manage Food Log →
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {mealBreakdown.map(({ meal, items, calories, protein, carbs, fat, fiber }) => {
              if (items.length === 0) {
                return (
                  <div
                    key={meal}
                    className="bg-slate-50/50 border border-dashed border-slate-200 rounded-2xl p-3.5 flex items-center justify-between text-slate-500 text-xs"
                  >
                    <div>
                      <span className="font-semibold text-slate-700 block">{meal}</span>
                      <span className="text-slate-400">No items logged yet</span>
                    </div>
                    <button
                      onClick={onNavigateToFoodLog}
                      className="px-2.5 py-1 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg text-[11px] font-medium shadow-xs"
                    >
                      + Add
                    </button>
                  </div>
                );
              }

              return (
                <div key={meal} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                    <div>
                      <span className="font-bold text-slate-900 text-sm block">{meal}</span>
                      <span className="text-xs text-slate-400">{items.length} food entries</span>
                    </div>
                    <div className="text-right">
                      <span className="text-base font-bold text-amber-600">{Math.round(calories)} kcal</span>
                    </div>
                  </div>

                  {/* Food Items List */}
                  <div className="space-y-1.5 text-xs">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-slate-700 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <div>
                          <span className="font-medium text-slate-900">{item.foodItem}</span>
                          <span className="text-[11px] text-slate-500 block">{item.quantityGrams}g/ml {item.notes ? `• ${item.notes}` : ""}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-semibold text-slate-900">{item.calories} kcal</span>
                          <span className="text-[10px] text-emerald-600 block font-medium">{item.protein}g P | {item.carbs}g C | {item.fat}g F</span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Meal Macros Summary */}
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 font-medium">
                    <span>P: <strong className="text-emerald-600">{protein.toFixed(1)}g</strong></span>
                    <span>C: <strong className="text-amber-600">{carbs.toFixed(1)}g</strong></span>
                    <span>F: <strong className="text-rose-600">{fat.toFixed(1)}g</strong></span>
                    <span>Fib: <strong className="text-teal-600">{fiber.toFixed(1)}g</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column (1 Col): Daily Summary History Table */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              Daily Log Summary
            </h3>
            <span className="text-[11px] text-slate-500">Target: 2000 kcal</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 font-semibold">
                  <th className="pb-2">Date</th>
                  <th className="pb-2 text-right">Calories</th>
                  <th className="pb-2 text-right">Protein</th>
                  <th className="pb-2 text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {uniqueDates.map((dateStr) => {
                  const daySum = aggregateDailySummary(dateStr, dailyLogs, habits, targets);
                  const isSelected = dateStr === selectedDate;
                  const isOverCal = daySum.totalCalories > targets.dailyCalories;

                  return (
                    <tr
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                        isSelected ? "bg-blue-50/80 font-bold text-blue-900" : ""
                      }`}
                    >
                      <td className="py-2.5 text-slate-700">
                        {dateStr.slice(5)}
                      </td>
                      <td className={`py-2.5 text-right font-medium ${isOverCal ? "text-rose-600 font-semibold" : "text-slate-800"}`}>
                        {daySum.totalCalories}
                      </td>
                      <td className="py-2.5 text-right text-emerald-600 font-medium">
                        {daySum.totalProtein}g
                      </td>
                      <td className="py-2.5 text-right">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          daySum.score >= 70
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : daySum.score >= 45
                            ? "bg-amber-50 text-amber-700 border border-amber-200"
                            : "bg-rose-50 text-rose-700 border border-rose-200"
                        }`}>
                          {daySum.score}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60 text-xs text-slate-600 space-y-1">
            <span className="font-semibold text-slate-800 block text-xs">💡 Quick Insights:</span>
            <p>Red calorie numbers indicate intake above target limit (2000 kcal).</p>
            <p>Score reflects combined nutrition, protein, fiber, hydration & walk distance.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
