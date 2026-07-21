import React, { useState } from "react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  Legend, 
  CartesianGrid 
} from "recharts";
import { TrendingUp, Calendar, Flame, Dumbbell, Droplets, Footprints, Award, PieChart as PieIcon } from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { aggregateDailySummary, formatDateForDisplay } from "../../utils/nutritionCalculator";

type TimeframeMode = "week" | "month" | "all";

export const AnalyticsView: React.FC = () => {
  const { dailyLogs, habits, targets } = useTracker();
  const [timeframe, setTimeframe] = useState<TimeframeMode>("week");

  // Get all unique dates in dataset
  const allDates = Array.from(
    new Set([...dailyLogs.map((l) => l.date), ...habits.map((h) => h.date)])
  ).sort();

  // Filter dates according to timeframe
  let selectedDates = [...allDates];
  if (timeframe === "week" && allDates.length > 7) {
    selectedDates = allDates.slice(-7);
  } else if (timeframe === "month" && allDates.length > 30) {
    selectedDates = allDates.slice(-30);
  }

  // Generate daily summaries for chart
  const chartData = selectedDates.map((dateStr) => {
    const summary = aggregateDailySummary(dateStr, dailyLogs, habits, targets);
    return {
      date: formatDateForDisplay(dateStr),
      fullDate: dateStr,
      calories: summary.totalCalories,
      protein: summary.totalProtein,
      carbs: summary.totalCarbs,
      fat: summary.totalFat,
      fiber: summary.totalFiber,
      water: summary.totalWater,
      walk: summary.totalWalkKm,
      score: summary.score,
    };
  });

  // Category Breakdown for Pie Chart
  const categoryCounts: Record<string, number> = {};
  dailyLogs.forEach((log) => {
    if (selectedDates.includes(log.date)) {
      categoryCounts[log.category] = (categoryCounts[log.category] || 0) + log.calories;
    }
  });

  const pieData = Object.entries(categoryCounts).map(([name, value]) => ({
    name,
    value: Math.round(value),
  }));

  const PIE_COLORS = [
    "#10b981", "#3b82f6", "#f59e0b", "#ec4899", 
    "#8b5cf6", "#06b6d4", "#f97316", "#14b8a6", "#6366f1"
  ];

  // Key Aggregated Metrics
  const avgCal = chartData.length > 0 
    ? Math.round(chartData.reduce((acc, d) => acc + d.calories, 0) / chartData.length) 
    : 0;
  const avgProtein = chartData.length > 0 
    ? Math.round(chartData.reduce((acc, d) => acc + d.protein, 0) / chartData.length) 
    : 0;
  const avgFiber = chartData.length > 0 
    ? Math.round((chartData.reduce((acc, d) => acc + d.fiber, 0) / chartData.length) * 10) / 10 
    : 0;
  const avgScore = chartData.length > 0 
    ? Math.round(chartData.reduce((acc, d) => acc + d.score, 0) / chartData.length) 
    : 0;

  const daysMetCalTarget = chartData.filter((d) => d.calories <= targets.dailyCalories && d.calories > 0).length;
  const calAdherencePct = chartData.length > 0 ? Math.round((daysMetCalTarget / chartData.length) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title & Timeframe Selector */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Nutritional Intake Trends & Performance Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Visualize macro intake trends, calorie compliance, and daily performance metrics over time
          </p>
        </div>

        {/* Timeframe selector tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 text-xs font-semibold">
          <button
            onClick={() => setTimeframe("week")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              timeframe === "week"
                ? "bg-white text-blue-700 border border-blue-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Last 7 Days (Week)
          </button>
          <button
            onClick={() => setTimeframe("month")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              timeframe === "month"
                ? "bg-white text-blue-700 border border-blue-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Last 30 Days (Month)
          </button>
          <button
            onClick={() => setTimeframe("all")}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              timeframe === "all"
                ? "bg-white text-blue-700 border border-blue-200 shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            All Available Data
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Avg Daily Calories</span>
            <Flame className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-black text-slate-900">{avgCal} kcal</div>
          <span className="text-[11px] text-slate-500">Target: {targets.dailyCalories} kcal</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Avg Protein</span>
            <Dumbbell className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600">{avgProtein}g</div>
          <span className="text-[11px] text-slate-500">Target: {targets.proteinGrams}g</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Avg Fiber</span>
            <Flame className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-black text-teal-600">{avgFiber}g</div>
          <span className="text-[11px] text-slate-500">Target: {targets.fiberGrams}g</span>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 space-y-1 shadow-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase">Calorie Compliance</span>
            <Award className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900">{calAdherencePct}%</div>
          <span className="text-[11px] text-slate-500">{daysMetCalTarget} of {chartData.length} days under limit</span>
        </div>

      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Chart 1: Daily Calorie Intake vs Target Line */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Flame className="w-4 h-4 text-amber-500" />
              Daily Calorie Intake vs Target ({targets.dailyCalories} kcal)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  formatter={(value: any) => [`${value} kcal`, "Calories"]}
                />
                <ReferenceLine y={targets.dailyCalories} stroke="#f43f5e" strokeDasharray="4 4" label={{ value: `Target ${targets.dailyCalories}`, fill: "#f43f5e", fontSize: 10 }} />
                <Bar dataKey="calories" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Macronutrient Breakdown (Protein, Carbs, Fat) */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Dumbbell className="w-4 h-4 text-emerald-600" />
              Macronutrient Intake Trends (g)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "8px" }} />
                <Bar dataKey="protein" name="Protein (g)" fill="#10b981" stackId="a" radius={[2, 2, 0, 0]} />
                <Bar dataKey="carbs" name="Carbs (g)" fill="#3b82f6" stackId="a" />
                <Bar dataKey="fat" name="Fat (g)" fill="#f43f5e" stackId="a" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 3: Daily Health Performance Score Line */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-600" />
              Daily Health Performance Score Trend (0-100%)
            </h3>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="date" stroke="#64748b" fontSize={11} />
                <YAxis domain={[0, 100]} stroke="#64748b" fontSize={11} />
                <Tooltip contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                <Line type="monotone" dataKey="score" name="Health Score %" stroke="#2563eb" strokeWidth={3} dot={{ fill: "#2563eb", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Calorie Distribution by Food Category Pie */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-600" />
              Calorie Breakdown by Food Category
            </h3>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {pieData.length === 0 ? (
              <p className="text-slate-400 text-xs">No food log data for this range</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", color: "#0f172a", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                    formatter={(val: any) => [`${val} kcal`, "Total Calories"]}
                  />
                  <Legend wrapperStyle={{ fontSize: "11px" }} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
