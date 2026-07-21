import React from "react";
import { Activity, Apple, Award, Cookie, Droplets, Footprints, Leaf, ShieldCheck } from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { aggregateDailySummary, formatDateForDisplay, getScoreColor } from "../../utils/nutritionCalculator";

export const HabitsView: React.FC = () => {
  const { selectedDate, dailyLogs, targets } = useTracker();
  const summary = aggregateDailySummary(selectedDate, dailyLogs, targets);
  const scoreInfo = getScoreColor(summary.score);

  const metrics = [
    { label: "Water", value: `${summary.totalWater} ml`, target: `${targets.waterMl} ml target`, icon: Droplets, color: "text-cyan-600", bg: "bg-cyan-50" },
    { label: "Walking", value: `${summary.totalWalkKm} km`, target: `${targets.walkKm} km target`, icon: Footprints, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Fruit portions", value: summary.fruitEntries, target: "Detected from food categories", icon: Apple, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Veg / legumes", value: summary.vegLegumeEntries, target: "Detected from foods and categories", icon: Leaf, color: "text-teal-600", bg: "bg-teal-50" },
    { label: "Treat entries", value: summary.treatEntries, target: "Dessert, snack, bakery or sugar", icon: Cookie, color: summary.treatEntries > 1 ? "text-rose-600" : "text-amber-600", bg: summary.treatEntries > 1 ? "bg-rose-50" : "bg-amber-50" },
    { label: "Sugary drinks", value: summary.sugaryDrinks, target: "Detected from drink name/category", icon: ShieldCheck, color: summary.sugaryDrinks > 0 ? "text-rose-600" : "text-slate-600", bg: summary.sugaryDrinks > 0 ? "bg-rose-50" : "bg-slate-50" },
  ];

  return (
    <div className="space-y-6 pb-12">

      {summary.entriesCount === 0 ? (
        <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center shadow-sm">
          <Activity className="w-9 h-9 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">No daily log entries for this date</p>
          <p className="text-xs text-slate-400 mt-1">Add food, water, or walking information in Daily Food Log to generate this view.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {metrics.map(({ label, value, target, icon: Icon, color, bg }) => (
              <div key={label} className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm">
                <div className={`w-9 h-9 ${bg} ${color} rounded-xl flex items-center justify-center mb-3`}>
                  <Icon className="w-4.5 h-4.5" />
                </div>
                <p className="text-[11px] uppercase tracking-wide font-semibold text-slate-500">{label}</p>
                <p className={`text-xl font-extrabold mt-1 ${color}`}>{value}</p>
                <p className="text-[10px] text-slate-400 mt-1">{target}</p>
              </div>
            ))}
          </div>

          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Score inputs calculated from the daily log</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><span className="text-slate-500 block">Calories</span><strong className="text-slate-900">{summary.totalCalories} kcal</strong></div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><span className="text-slate-500 block">Protein</span><strong className="text-emerald-700">{summary.totalProtein} g</strong></div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><span className="text-slate-500 block">Fiber</span><strong className="text-teal-700">{summary.totalFiber} g</strong></div>
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-3"><span className="text-slate-500 block">Log entries</span><strong className="text-blue-700">{summary.entriesCount}</strong></div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
