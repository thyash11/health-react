import React, { useState } from "react";
import { 
  HeartPulse, 
  Target, 
  UserCheck, 
  FileText, 
  Calendar, 
  Plus, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles, 
  Trash2, 
  Save 
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { LabTestRecord, HealthMetric } from "../../types";

export const HealthLabsView: React.FC = () => {
  const { 
    targets, 
    updateTargets, 
    profile, 
    updateProfile, 
    labTests, 
    addLabTest, 
    deleteLabTest, 
    healthMetrics, 
    addHealthMetric, 
    deleteHealthMetric, 
    periodicChecks,
    dailyLogs,
    habits
  } = useTracker();

  // Targets state
  const [calTarget, setCalTarget] = useState(targets.dailyCalories);
  const [pTarget, setPTarget] = useState(targets.proteinGrams);
  const [fibTarget, setFibTarget] = useState(targets.fiberGrams);
  const [waterTarget, setWaterTarget] = useState(targets.waterMl);
  const [walkTarget, setWalkTarget] = useState(targets.walkKm);
  const [goalWeight, setGoalWeight] = useState(targets.goalWeightKg);

  // New Lab Test Form
  const [showAddLab, setShowAddLab] = useState(false);
  const [testDate, setTestDate] = useState(new Date().toISOString().slice(0, 10));
  const [testName, setTestName] = useState("");
  const [testResult, setTestResult] = useState<number | "">("");
  const [testUnit, setTestUnit] = useState("mg/dL");
  const [testTarget, setTestTarget] = useState("< 200");
  const [testStatus, setTestStatus] = useState<LabTestRecord["status"]>("Normal");
  const [testNotes, setTestNotes] = useState("");

  // AI Health Coach State
  const [aiAnalysis, setAiAnalysis] = useState<any>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    updateTargets({
      dailyCalories: Number(calTarget),
      proteinGrams: Number(pTarget),
      fiberGrams: Number(fibTarget),
      waterMl: Number(waterTarget),
      walkKm: Number(walkTarget),
      goalWeightKg: Number(goalWeight),
    });
    alert("Personal nutrition and health targets updated!");
  };

  const handleCreateLabTest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testName || testResult === "") return;

    addLabTest({
      date: testDate,
      testName,
      resultValue: Number(testResult),
      unit: testUnit,
      targetRange: testTarget,
      status: testStatus,
      notes: testNotes,
    });

    setTestName("");
    setTestResult("");
    setShowAddLab(false);
  };

  const generateAiInsights = async () => {
    setLoadingAi(true);
    try {
      const res = await fetch("/api/health-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userProfile: profile,
          targets,
          recentLogs: dailyLogs.slice(-15),
          labTests,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setAiAnalysis(data.data);
      } else {
        alert("Unable to generate AI analysis. Check API key configuration.");
      }
    } catch (err) {
      console.error(err);
      alert("Error calling AI analysis server endpoint.");
    } finally {
      setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-blue-600" />
            Personal Health Settings, Risk Profile & Clinical Lab Tests
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage goals, track lipid profiles, HbA1c, and view scheduled health checks
          </p>
        </div>

        <button
          onClick={generateAiInsights}
          disabled={loadingAi}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-all"
        >
          <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
          <span>{loadingAi ? "Analyzing Data..." : "AI Health Analysis"}</span>
        </button>
      </div>

      {/* AI Health Insights Output Box */}
      {aiAnalysis && (
        <div className="bg-white border border-blue-200 rounded-2xl p-5 space-y-4 shadow-lg">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              AI Medical Nutrition Analysis & Recommendations
            </h3>
            <button onClick={() => setAiAnalysis(null)} className="text-xs text-slate-400 hover:text-slate-600">
              Dismiss
            </button>
          </div>

          <p className="text-xs text-blue-900 font-medium leading-relaxed bg-blue-50/80 p-3 rounded-xl border border-blue-100">
            {aiAnalysis.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
            {aiAnalysis.recommendations?.map((rec: any, idx: number) => (
              <div key={idx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/80 space-y-1.5">
                <span className="text-[10px] uppercase font-bold text-blue-600 block">{rec.category}</span>
                <h4 className="font-bold text-slate-900">{rec.title}</h4>
                <p className="text-slate-600 text-[11px] leading-normal">{rec.advice}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Grid: Personal Targets + User Context */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Nutrition & Activity Targets Form */}
        <form onSubmit={handleSaveTargets} className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Target className="w-4 h-4 text-amber-600" />
              Nutrition & Daily Goals Configuration
            </h3>
            <button
              type="submit"
              className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center gap-1 shadow-xs"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save</span>
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div>
              <label className="text-slate-500 block mb-1">Daily Calories (kcal)</label>
              <input
                type="number"
                value={calTarget}
                onChange={(e) => setCalTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-amber-600 font-bold rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Protein Target (g)</label>
              <input
                type="number"
                value={pTarget}
                onChange={(e) => setPTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-emerald-600 font-bold rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Fiber Target (g)</label>
              <input
                type="number"
                value={fibTarget}
                onChange={(e) => setFibTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-teal-600 font-bold rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Water Target (ml)</label>
              <input
                type="number"
                value={waterTarget}
                onChange={(e) => setWaterTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-cyan-600 font-bold rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Walk Target (km)</label>
              <input
                type="number"
                step="0.5"
                value={walkTarget}
                onChange={(e) => setWalkTarget(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-indigo-600 font-bold rounded-xl p-2.5"
              />
            </div>

            <div>
              <label className="text-slate-500 block mb-1">Goal Weight (kg)</label>
              <input
                type="number"
                step="0.5"
                value={goalWeight}
                onChange={(e) => setGoalWeight(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-2.5"
              />
            </div>
          </div>
        </form>

        {/* User Profile & Risk Context */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <UserCheck className="w-4 h-4 text-blue-600" />
            Profile & Clinical Risk Context
          </h3>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 font-medium">Age & Gender</span>
              <span className="text-slate-900 font-bold">{profile.age} yrs • Male</span>
            </div>

            <div className="flex justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
              <span className="text-slate-500 font-medium">Occupation</span>
              <span className="text-slate-900 font-bold">{profile.occupation}</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-500 font-medium block">Family Health History</span>
              <span className="text-amber-700 font-semibold">{profile.familyHistory}</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-500 font-medium block">Main Health Goals</span>
              <span className="text-emerald-700 font-semibold">{profile.mainGoals}</span>
            </div>

            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 space-y-1">
              <span className="text-slate-500 font-medium block">Meal Pattern Target</span>
              <span className="text-slate-700">{profile.mealPattern}</span>
            </div>
          </div>
        </div>

      </div>

      {/* Lab Tests Table (Matching TEST SHEET in screenshot 4) */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-teal-600" />
              Clinical Lab Tests & Lipid Profile History
            </h3>
            <p className="text-xs text-slate-500">Track cholesterol, glucose, HbA1c, and vitamin levels</p>
          </div>

          <button
            onClick={() => setShowAddLab(!showAddLab)}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-xl flex items-center gap-1.5 transition-colors border border-slate-200"
          >
            <Plus className="w-4 h-4" />
            <span>Add Lab Test</span>
          </button>
        </div>

        {/* Add Lab Form */}
        {showAddLab && (
          <form onSubmit={handleCreateLabTest} className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 text-xs">New Clinical Test Record</h4>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-slate-500 block mb-1">Date</label>
                <input
                  type="date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Test Name *</label>
                <input
                  type="text"
                  value={testName}
                  onChange={(e) => setTestName(e.target.value)}
                  placeholder="e.g. Total Cholesterol, HbA1c"
                  required
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Result Value *</label>
                <input
                  type="number"
                  step="0.1"
                  value={testResult}
                  onChange={(e) => setTestResult(Number(e.target.value))}
                  placeholder="390"
                  required
                  className="w-full bg-white border border-slate-200 text-amber-600 font-bold rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Unit</label>
                <input
                  type="text"
                  value={testUnit}
                  onChange={(e) => setTestUnit(e.target.value)}
                  placeholder="mg/dL"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Reference Range</label>
                <input
                  type="text"
                  value={testTarget}
                  onChange={(e) => setTestTarget(e.target.value)}
                  placeholder="< 200"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Status</label>
                <select
                  value={testStatus}
                  onChange={(e) => setTestStatus(e.target.value as any)}
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5"
                >
                  <option value="Normal">Normal</option>
                  <option value="Elevated">Elevated</option>
                  <option value="High">High</option>
                  <option value="Low">Low</option>
                  <option value="User-reported">User-reported</option>
                </select>
              </div>

              <div className="col-span-2">
                <label className="text-slate-500 block mb-1">Notes</label>
                <input
                  type="text"
                  value={testNotes}
                  onChange={(e) => setTestNotes(e.target.value)}
                  placeholder="e.g. Full report date not recorded"
                  className="w-full bg-white border border-slate-200 text-slate-900 rounded-xl p-2.5"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddLab(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 font-medium rounded-xl"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs"
              >
                Save Record
              </button>
            </div>
          </form>
        )}

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase">
                <th className="p-3">Date</th>
                <th className="p-3">Test Name</th>
                <th className="p-3 text-right">Result</th>
                <th className="p-3">Unit</th>
                <th className="p-3">Reference Target</th>
                <th className="p-3">Status Flag</th>
                <th className="p-3">Notes</th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {labTests.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 font-medium text-slate-600">{t.date}</td>
                  <td className="p-3 font-bold text-slate-900">{t.testName}</td>
                  <td className="p-3 text-right font-black text-amber-600 text-sm">{t.resultValue}</td>
                  <td className="p-3 text-slate-500">{t.unit}</td>
                  <td className="p-3 text-slate-700 font-medium">{t.targetRange}</td>
                  <td className="p-3">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold ${
                      t.status === "High"
                        ? "bg-rose-50 text-rose-700 border border-rose-200"
                        : t.status === "Elevated"
                        ? "bg-amber-50 text-amber-700 border border-amber-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="p-3 text-slate-500 text-[11px]">{t.notes || "—"}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => deleteLabTest(t.id)}
                      className="p-1 hover:bg-slate-100 text-slate-400 hover:text-rose-600 rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Periodic Health Check Reminders */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-3 shadow-sm">
        <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
          <Calendar className="w-4 h-4 text-blue-600" />
          Recommended Periodic Check Schedule
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-xs">
          {periodicChecks.map((item) => (
            <div key={item.id} className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-1">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{item.checkName}</span>
                <span className="px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200 text-[10px]">
                  {item.frequency}
                </span>
              </div>
              <p className="text-slate-500 text-[11px]">Last Recorded: <span className="text-slate-800 font-semibold">{item.lastDate}</span></p>
              <p className="text-slate-400 text-[10px]">{item.notes}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
