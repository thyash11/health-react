import React from "react";
import { 
  Flame, 
  Dumbbell, 
  Wheat, 
  ChartPie,
  Footprints, 
  Target, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Utensils,
  Leaf,
  ListChecks,
  ChevronRight,
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { aggregateDailySummary, getScoreColor, formatDateForDisplay } from "../../utils/nutritionCalculator";
import { MEAL_TYPES } from "../../constants/foodOptions";
import {
  calculateWeightGoalDaysLeft,
  calculateWeightGoalProgress,
  getWeightMetricsChronological,
} from "../../utils/weightMetrics";

interface DashboardViewProps {
  onNavigateToFoodLog: () => void;
  onNavigateToEatMe: () => void;
  onNavigateToEatMeRaw: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onNavigateToFoodLog,
  onNavigateToEatMe,
  onNavigateToEatMeRaw,
}) => {
  const {
    selectedDate,
    setSelectedDate,
    dailyLogs,
    profile,
    healthMetrics,
    getTargetsForDate,
    getWeightGoalRevisionDateForDate,
  } = useTracker();
  const dayTargets = getTargetsForDate(selectedDate);

  // Aggregate selected date
  const summary = aggregateDailySummary(selectedDate, dailyLogs, dayTargets);

  // Filter logs for selected date
  const dayLogs = dailyLogs.filter((l) => l.date === selectedDate);

  // Meals grouping
  const mealBreakdown = MEAL_TYPES.map((meal) => {
    const items = dayLogs.filter((l) => l.meal === meal);
    const calories = items.reduce((acc, i) => acc + (i.calories || 0), 0);
    const protein = items.reduce((acc, i) => acc + (i.protein || 0), 0);
    const carbs = items.reduce((acc, i) => acc + (i.carbs || 0), 0);
    const fat = items.reduce((acc, i) => acc + (i.fat || 0), 0);
    const fiber = items.reduce((acc, i) => acc + (i.fiber || 0), 0);
    return { meal, items, calories, protein, carbs, fat, fiber };
  });

  // Calculate percentage of targets
  const percentOf = (value: number, target: number) =>
    target > 0 ? Math.round((value / target) * 100) : 0;
  const calPct = percentOf(summary.totalCalories, dayTargets.dailyCalories);
  const proteinPct = percentOf(summary.totalProtein, dayTargets.proteinGrams);
  const fiberPct = percentOf(summary.totalFiber, dayTargets.fiberGrams);
  const walkPct = percentOf(summary.totalWalkKm, dayTargets.walkKm);
  const fatTargetGrams = dayTargets.fatGrams > 0
    ? dayTargets.fatGrams
    : dayTargets.dailyCalories > 0
      ? Math.round((dayTargets.dailyCalories * 0.3) / 9)
      : 0;
  const fatPct = percentOf(summary.totalFat, fatTargetGrams);
  const fatOverMax = fatTargetGrams > 0 && summary.totalFat > fatTargetGrams;
  const weightHistory = getWeightMetricsChronological(healthMetrics).filter((metric) => metric.date <= selectedDate);
  const latestWeightMetric = weightHistory.length > 0 ? weightHistory[weightHistory.length - 1] : undefined;
  const startingWeight = weightHistory.length > 0 ? weightHistory[0].weightKg : dayTargets.currentWeightKg;
  const currentWeight = latestWeightMetric?.weightKg || dayTargets.currentWeightKg;
  const weightGoalProgress = calculateWeightGoalProgress(currentWeight, startingWeight, dayTargets.goalWeightKg);
  const weightGoalGap = currentWeight > 0 && dayTargets.goalWeightKg > 0
    ? Math.round((currentWeight - dayTargets.goalWeightKg) * 10) / 10
    : null;
  const weightGoalRevisionDate = getWeightGoalRevisionDateForDate(selectedDate);
  const weightGoalProjectionAnchor = [latestWeightMetric?.date, weightGoalRevisionDate]
    .filter((date): date is string => Boolean(date))
    .sort()
    .at(-1);
  const weightGoalDaysLeft = weightGoalProjectionAnchor
    ? calculateWeightGoalDaysLeft({
        currentWeight,
        goalWeight: dayTargets.goalWeightKg,
        intensity: dayTargets.goalIntensity,
        anchorDate: weightGoalProjectionAnchor,
        viewedDate: selectedDate,
      })
    : null;

  const scoreInfo = getScoreColor(summary.score);

  // Recent 10 dates list for summary table
  const uniqueDates = Array.from(
    new Set(dailyLogs.map((l) => l.date))
  ).sort().reverse().slice(0, 10);

  return (
    <div className="space-y-6 pb-12">
      
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
            <span className="text-xs text-slate-400">/ {dayTargets.dailyCalories}</span>
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
            <span className="text-xs text-slate-400">/ {dayTargets.proteinGrams}g</span>
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
            <span className="text-xs text-slate-400">/ {dayTargets.fiberGrams}g</span>
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

        {/* Fat Card */}
        <div className={`p-4 rounded-2xl border shadow-sm ${fatOverMax ? "bg-rose-50/50 border-rose-200" : "bg-white border-slate-200/80"}`}>
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Fat</span>
            <ChartPie className={`w-4 h-4 ${fatOverMax ? "text-red-600" : "text-rose-600"}`} />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{summary.totalFat}g</span>
            <span className="text-xs text-slate-400">/ {fatTargetGrams}g max</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all ${fatOverMax ? "bg-red-500" : fatPct >= 90 ? "bg-amber-500" : "bg-rose-500"}`}
              style={{ width: `${Math.min(100, fatPct)}%` }}
            />
          </div>
          <span className={`text-[11px] font-semibold mt-1.5 inline-block ${fatOverMax ? "text-red-600" : fatPct >= 90 ? "text-amber-600" : "text-rose-600"}`}>
            {fatTargetGrams <= 0
              ? "Set a calorie target"
              : `${fatPct}% of target`}
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
            <span className="text-xs text-slate-400">/ {dayTargets.walkKm} km</span>
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

        {/* Weight Goal Card */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Weight</span>
            <Target className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline justify-between">
            <span className="text-xl font-bold text-slate-900">{currentWeight || 0} kg</span>
            <span className="text-xs text-slate-400">Goal: {dayTargets.goalWeightKg || 0} kg</span>
          </div>
          <div className="mt-2.5 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-500 transition-all"
              style={{ width: `${weightGoalProgress}%` }}
            />
          </div>
          <span className="text-[11px] font-semibold mt-1.5 inline-block text-slate-600">
            {weightGoalGap === null
              ? "Record weight and set a goal"
              : weightGoalGap === 0
                ? "Goal reached"
                : weightGoalDaysLeft === null
                  ? "Set a goal intensity"
                  : `${weightGoalDaysLeft} days left`}
          </span>
        </div>

      </div>

      {/* Full-width Daily Health Score */}
      <div className="w-full flex items-center justify-between gap-4 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm">
        <div>
          <span className="text-xs text-slate-500 font-medium block">Daily Health Score</span>
          <span className={`text-3xl font-black ${summary.score >= 70 ? "text-emerald-600" : summary.score >= 45 ? "text-amber-600" : "text-rose-600"}`}>
            {summary.score}%
          </span>
        </div>

        <div className="w-16 h-16 relative flex shrink-0 items-center justify-center">
          <svg className="w-16 h-16 transform -rotate-90">
            <circle cx="32" cy="32" r="25" stroke="currentColor" strokeWidth="5" className="text-slate-200" fill="transparent" />
            <circle
              cx="32"
              cy="32"
              r="25"
              stroke="currentColor"
              strokeWidth="5"
              className={summary.score >= 70 ? "text-emerald-500" : summary.score >= 45 ? "text-amber-500" : "text-rose-500"}
              fill="transparent"
              strokeDasharray={157}
              strokeDashoffset={157 - (157 * summary.score) / 100}
              strokeLinecap="round"
            />
          </svg>
          <CheckCircle2 className="w-5 h-5 text-emerald-500 absolute" />
        </div>
      </div>

      <button
        type="button"
        onClick={onNavigateToEatMe}
        className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 text-left shadow-sm transition-all hover:border-emerald-300 hover:shadow-md sm:p-5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-sm">
            <Leaf className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <span className="block text-sm font-bold text-emerald-950">Eat Me · Monthly Food Intelligence</span>
            <span className="mt-0.5 block text-xs text-emerald-700">See what your month is missing and plan what to eat today and this week.</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-emerald-600 transition-transform group-hover:translate-x-1" />
      </button>

      <button
        type="button"
        onClick={onNavigateToEatMeRaw}
        className="group flex w-full items-center justify-between gap-4 rounded-2xl border border-teal-200 bg-white p-4 text-left shadow-sm transition-all hover:border-teal-300 hover:bg-teal-50/50 hover:shadow-md sm:p-5"
      >
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-teal-200 bg-teal-50 text-teal-700">
            <ListChecks className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <span className="block text-sm font-bold text-slate-900">Eat Me Raw · W1–W5 Checklist</span>
            <span className="mt-0.5 block text-xs text-slate-600">Open the original-style monthly list and tick every food week by week.</span>
          </div>
        </div>
        <ChevronRight className="h-5 w-5 shrink-0 text-teal-600 transition-transform group-hover:translate-x-1" />
      </button>

      {/* Main Grid: Meals Breakdown + Daily Log History Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column (2 Cols): Meals Breakdown for Selected Date */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Utensils className="w-4 h-4 text-blue-600" />
              Meal Breakdown ({summary.entriesCount} entries logged)
            </h3>
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
            <span className="text-[11px] text-slate-500">Targets follow each date</span>
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
                  const historicalTargets = getTargetsForDate(dateStr);
                  const daySum = aggregateDailySummary(dateStr, dailyLogs, historicalTargets);
                  const isSelected = dateStr === selectedDate;
                  const isOverCal = daySum.totalCalories > historicalTargets.dailyCalories;

                  return (
                    <tr
                      key={dateStr}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`cursor-pointer hover:bg-slate-50 transition-colors ${
                        isSelected ? "bg-blue-50/80 font-bold text-blue-900" : ""
                      }`}
                    >
                      <td className="py-2.5 text-slate-700">
                        {formatDateForDisplay(dateStr)}
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
            <p>Red calorie numbers indicate intake above the target saved for that date.</p>
            <p>Score reflects combined nutrition, protein, fiber, hydration & walk distance.</p>
          </div>
        </div>

      </div>

    </div>
  );
};
