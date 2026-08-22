import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Plus,
  Scale,
  Trash2,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTracker } from "../../context/TrackerContext";
import { formatDateForDisplay } from "../../utils/nutritionCalculator";
import { getWeightMetricsChronological } from "../../utils/weightMetrics";
import { FormattedDateInput } from "../FormattedDateInput";

const today = () => new Date().toLocaleDateString("en-CA");

export const WeightTrackingPanel: React.FC = () => {
  const {
    healthMetrics,
    addHealthMetric,
    deleteHealthMetric,
    targets,
  } = useTracker();
  const [showAddWeight, setShowAddWeight] = useState(false);
  const [date, setDate] = useState(today);
  const [weight, setWeight] = useState("");
  const [waist, setWaist] = useState("");
  const [systolic, setSystolic] = useState("");
  const [diastolic, setDiastolic] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [notes, setNotes] = useState("");

  const weightMetrics = useMemo(
    () => getWeightMetricsChronological(healthMetrics),
    [healthMetrics],
  );
  const latest = weightMetrics.length > 0 ? weightMetrics[weightMetrics.length - 1] : undefined;
  const previous = weightMetrics.length > 1 ? weightMetrics[weightMetrics.length - 2] : undefined;
  const latestChange = latest && previous
    ? Math.round((latest.weightKg - previous.weightKg) * 10) / 10
    : null;
  const goalGap = latest && targets.goalWeightKg > 0
    ? Math.round((latest.weightKg - targets.goalWeightKg) * 10) / 10
    : null;
  const chartData = weightMetrics.map((metric) => ({
    date: formatDateForDisplay(metric.date),
    weight: metric.weightKg,
  }));

  useEffect(() => {
    if (!showAddWeight) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowAddWeight(false);
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.style.overflow = "";
    };
  }, [showAddWeight]);

  const openRecorder = () => {
    setDate(today());
    setWeight(latest ? String(latest.weightKg) : "");
    setWaist("");
    setSystolic("");
    setDiastolic("");
    setHeartRate("");
    setNotes("");
    setShowAddWeight(true);
  };

  const submitWeight = (event: React.FormEvent) => {
    event.preventDefault();
    const weightKg = Number(weight);
    if (!date || !Number.isFinite(weightKg) || weightKg <= 0) return;

    const added = addHealthMetric({
      date,
      weightKg,
      waistInch: Number(waist) || 0,
      bloodPressureSys: Number(systolic) || undefined,
      bloodPressureDia: Number(diastolic) || undefined,
      restingHeartRate: Number(heartRate) || undefined,
      notes: notes.trim() || undefined,
    });
    if (added) setShowAddWeight(false);
  };

  return (
    <>
      <section className="space-y-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div>
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
              <Scale className="h-4 w-4 text-violet-600" />
              Weight Tracking
            </h3>
            <p className="mt-0.5 text-xs text-slate-500">Dated measurements are stored locally and used automatically across the app.</p>
          </div>
          <button
            type="button"
            onClick={openRecorder}
            className="flex shrink-0 items-center gap-1.5 rounded-xl bg-violet-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-violet-700"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Record Weight</span>
            <span className="sm:hidden">Record</span>
          </button>
        </div>

        {latest ? (
          <>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl border border-violet-100 bg-violet-50/70 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-violet-600">Latest weight</p>
                <p className="mt-1 text-xl font-black text-slate-950">{latest.weightKg} kg</p>
                <p className="text-[10px] text-slate-500">{formatDateForDisplay(latest.date)}</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Previous change</p>
                <p className={`mt-1 flex items-center gap-1 text-xl font-black ${latestChange === null || latestChange === 0 ? "text-slate-800" : latestChange < 0 ? "text-emerald-600" : "text-amber-600"}`}>
                  {latestChange !== null && latestChange < 0
                    ? <TrendingDown className="h-4 w-4" />
                    : latestChange !== null && latestChange > 0
                      ? <TrendingUp className="h-4 w-4" />
                      : <Activity className="h-4 w-4" />}
                  {latestChange === null ? "—" : `${latestChange > 0 ? "+" : ""}${latestChange} kg`}
                </p>
                <p className="text-[10px] text-slate-500">Compared with prior record</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Goal weight</p>
                <p className="mt-1 text-xl font-black text-slate-950">{targets.goalWeightKg > 0 ? `${targets.goalWeightKg} kg` : "—"}</p>
                <p className="text-[10px] text-slate-500">Configured health target</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-slate-500">Distance to goal</p>
                <p className="mt-1 text-xl font-black text-slate-950">{goalGap === null ? "—" : `${Math.abs(goalGap)} kg`}</p>
                <p className="text-[10px] text-slate-500">{goalGap === null ? "Set a goal weight" : goalGap === 0 ? "Goal reached" : goalGap > 0 ? "Above goal" : "Below goal"}</p>
              </div>
            </div>

            <div className="h-72 w-full rounded-xl border border-slate-200 bg-slate-50/40 p-2 sm:p-4">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 12, right: 16, left: -12, bottom: 4 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#64748b" fontSize={10} />
                  <YAxis
                    unit=" kg"
                    stroke="#64748b"
                    fontSize={10}
                    domain={[
                      (minimum: number) => Math.floor(minimum - 2),
                      (maximum: number) => Math.ceil(maximum + 2),
                    ]}
                  />
                  <Tooltip
                    formatter={(value: number) => [`${value} kg`, "Weight"]}
                    contentStyle={{ backgroundColor: "#ffffff", borderColor: "#e2e8f0", borderRadius: "12px", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}
                  />
                  {targets.goalWeightKg > 0 && (
                    <ReferenceLine
                      y={targets.goalWeightKg}
                      stroke="#f59e0b"
                      strokeDasharray="5 4"
                      ifOverflow="extendDomain"
                      label={{ value: `Goal ${targets.goalWeightKg} kg`, fill: "#b45309", fontSize: 10 }}
                    />
                  )}
                  <Line
                    type="monotone"
                    dataKey="weight"
                    name="Weight"
                    stroke="#7c3aed"
                    strokeWidth={3}
                    dot={{ fill: "#7c3aed", strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full min-w-[560px] text-left text-xs">
                <thead className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wide text-slate-500">
                  <tr>
                    <th className="px-3 py-2.5">Date</th>
                    <th className="px-3 py-2.5 text-right">Weight</th>
                    <th className="px-3 py-2.5 text-right">Waist</th>
                    <th className="px-3 py-2.5">Notes</th>
                    <th className="px-3 py-2.5 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {weightMetrics.slice().reverse().map((metric) => (
                    <tr key={metric.id} className="hover:bg-slate-50">
                      <td className="px-3 py-2.5 font-medium">{formatDateForDisplay(metric.date)}</td>
                      <td className="px-3 py-2.5 text-right font-bold text-violet-700">{metric.weightKg} kg</td>
                      <td className="px-3 py-2.5 text-right">{metric.waistInch > 0 ? `${metric.waistInch} in` : "—"}</td>
                      <td className="max-w-64 truncate px-3 py-2.5 text-slate-500">{metric.notes || "—"}</td>
                      <td className="px-3 py-2.5 text-center">
                        <button
                          type="button"
                          onClick={() => deleteHealthMetric(metric.id)}
                          aria-label={`Delete weight recorded on ${formatDateForDisplay(metric.date)}`}
                          className="rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-10 text-center">
            <Scale className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2 text-sm font-bold text-slate-700">No weight measurements yet</p>
            <p className="mt-1 text-xs text-slate-500">Record your first weight to start the history and trend graph.</p>
          </div>
        )}
      </section>

      {showAddWeight && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="record-weight-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowAddWeight(false);
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
        >
          <form onSubmit={submitWeight} className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5 text-xs shadow-2xl sm:p-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 id="record-weight-title" className="text-base font-bold text-slate-900">Record Health Measurement</h4>
                <p className="mt-0.5 text-xs text-slate-500">Weight is required; the other measurements are optional.</p>
              </div>
              <button type="button" onClick={() => setShowAddWeight(false)} aria-label="Close weight recorder" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <div>
                <label className="mb-1 block text-slate-500">Date *</label>
                <FormattedDateInput value={date} onChange={setDate} ariaLabel="Select measurement date" className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900" />
              </div>
              <div>
                <label className="mb-1 block text-slate-500">Weight (kg) *</label>
                <input type="number" step="0.1" min="1" value={weight} onChange={(event) => setWeight(event.target.value)} required autoFocus className="w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-violet-700" />
              </div>
              <div>
                <label className="mb-1 block text-slate-500">Waist (inch)</label>
                <input type="number" step="0.1" min="0" value={waist} onChange={(event) => setWaist(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900" />
              </div>
              <div>
                <label className="mb-1 block text-slate-500">BP systolic</label>
                <input type="number" min="0" value={systolic} onChange={(event) => setSystolic(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900" />
              </div>
              <div>
                <label className="mb-1 block text-slate-500">BP diastolic</label>
                <input type="number" min="0" value={diastolic} onChange={(event) => setDiastolic(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900" />
              </div>
              <div>
                <label className="mb-1 block text-slate-500">Resting heart rate</label>
                <input type="number" min="0" value={heartRate} onChange={(event) => setHeartRate(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900" />
              </div>
              <div className="col-span-2 sm:col-span-3">
                <label className="mb-1 block text-slate-500">Notes</label>
                <input type="text" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="e.g. Morning, before breakfast" className="w-full rounded-xl border border-slate-200 bg-white p-2.5 text-slate-900" />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button type="button" onClick={() => setShowAddWeight(false)} className="rounded-xl bg-slate-100 px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-200">Cancel</button>
              <button type="submit" className="rounded-xl bg-violet-600 px-4 py-2.5 font-bold text-white shadow-xs hover:bg-violet-700">Save Measurement</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
};
