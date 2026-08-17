import React, { useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Leaf,
  RotateCcw,
  Settings2,
  ShieldCheck,
  Sparkles,
  Target,
  TrendingUp,
  Upload,
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useTracker } from "../../context/TrackerContext";
import { analyzeEatMeMonth, EAT_ME_GROUP_LABELS } from "../../utils/eatMeAnalysis";
import { exportEatMePlan, parseEatMeChecklistText, parseEatMePlanJson } from "../../utils/eatMePlan";
import { EatMeFoodMapping, EatMeImportPreview, EatMeScoreBucket } from "../../types/eatMe";
import { formatDateForDisplay } from "../../utils/nutritionCalculator";

interface EatMeViewProps {
  onBack: () => void;
}

const BUCKET_LABELS: Record<EatMeScoreBucket, string> = {
  foundations: "Foundations",
  frequency: "Frequency",
  variety: "Variety",
  rotation: "Rotation",
  limits: "Limits",
};

const statusStyle = {
  "on-track": "bg-emerald-50 text-emerald-700 border-emerald-200",
  complete: "bg-blue-50 text-blue-700 border-blue-200",
  behind: "bg-amber-50 text-amber-700 border-amber-200",
  "over-limit": "bg-red-50 text-red-700 border-red-200",
  unknown: "bg-slate-50 text-slate-600 border-slate-200",
};

const downloadText = (contents: string, filename: string, type: string) => {
  const blob = new Blob([contents], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const EatMeView: React.FC<EatMeViewProps> = ({ onBack }) => {
  const {
    selectedDate,
    dailyLogs,
    foodLibrary,
    eatMePlan,
    eatMeMappings,
    eatMeManualCheckIns,
    replaceEatMePlan,
    resetEatMePlan,
    saveEatMeMapping,
    setEatMeManualCheckIn,
  } = useTracker();
  const today = new Date().toLocaleDateString("en-CA");
  const [month, setMonth] = useState(selectedDate.slice(0, 7));
  const [checkInDate, setCheckInDate] = useState(() => selectedDate.startsWith(`${selectedDate.slice(0, 7)}-`) ? selectedDate : today);
  const [showTools, setShowTools] = useState(false);
  const [importPreview, setImportPreview] = useState<EatMeImportPreview>();
  const [importError, setImportError] = useState<string>();
  const [mappingDrafts, setMappingDrafts] = useState<Record<string, string[]>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const analysis = useMemo(() => analyzeEatMeMonth({
    month,
    today,
    plan: eatMePlan,
    logs: dailyLogs,
    foodLibrary,
    mappings: eatMeMappings,
    manualCheckIns: eatMeManualCheckIns,
  }), [month, today, eatMePlan, dailyLogs, foodLibrary, eatMeMappings, eatMeManualCheckIns]);

  const allPlanFoods = useMemo(() => eatMePlan.sections.flatMap((section) => section.foods), [eatMePlan]);
  const foodsById = useMemo(() => new Map(allPlanFoods.map((food) => [food.id, food])), [allPlanFoods]);
  const manualGoals = eatMePlan.goals.filter((goal) => goal.manual);

  const shiftMonth = (amount: number) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const shifted = new Date(year, monthNumber - 1 + amount, 1);
    const nextMonth = `${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, "0")}`;
    setMonth(nextMonth);
    const maxDay = new Date(shifted.getFullYear(), shifted.getMonth() + 1, 0).getDate();
    setCheckInDate(`${nextMonth}-${String(Math.min(Number(checkInDate.slice(8, 10)) || 1, maxDay)).padStart(2, "0")}`);
  };

  const handlePlanFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const contents = await file.text();
      const preview = file.name.toLowerCase().endsWith(".json")
        ? parseEatMePlanJson(contents)
        : parseEatMeChecklistText(contents);
      setImportPreview(preview);
      setImportError(undefined);
    } catch (error) {
      setImportPreview(undefined);
      setImportError(error instanceof Error ? error.message : "The plan could not be imported.");
    }
  };

  const selectedMappingIds = (normalizedName: string, candidates: string[]) => mappingDrafts[normalizedName] ?? candidates;
  const toggleMappingId = (normalizedName: string, candidates: string[], itemId: string) => {
    const current = selectedMappingIds(normalizedName, candidates);
    setMappingDrafts((previous) => ({
      ...previous,
      [normalizedName]: current.includes(itemId) ? current.filter((id) => id !== itemId) : [...current, itemId],
    }));
  };

  const saveReviewMapping = (normalizedFoodName: string, candidateIds: string[], ignored = false) => {
    const mapping: EatMeFoodMapping = {
      normalizedFoodName,
      checklistItemIds: ignored ? [] : selectedMappingIds(normalizedFoodName, candidateIds),
      ignored,
      updatedAt: new Date().toISOString(),
    };
    if (!ignored && mapping.checklistItemIds.length === 0) return;
    saveEatMeMapping(mapping);
    setMappingDrafts((previous) => {
      const next = { ...previous };
      delete next[normalizedFoodName];
      return next;
    });
  };

  const chartData = analysis.goals
    .filter((goal) => goal.bucket === "frequency")
    .map((goal) => ({ name: goal.label.replace(" servings", "").replace(" meals", ""), actual: goal.value, expected: Math.round(goal.expectedToDate * 10) / 10 }));

  return (
    <div className="space-y-6 pb-14">
      <section className="overflow-hidden rounded-3xl border border-emerald-200 bg-gradient-to-br from-emerald-950 via-emerald-900 to-teal-800 text-white shadow-lg">
        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <button type="button" onClick={onBack} className="mb-4 flex items-center gap-1.5 text-xs font-semibold text-emerald-100 hover:text-white">
                <ArrowLeft className="h-4 w-4" /> Back to Dashboard
              </button>
              <div className="flex items-center gap-2">
                <div className="rounded-xl bg-white/10 p-2"><Leaf className="h-6 w-6 text-emerald-200" /></div>
                <div>
                  <h2 className="text-2xl font-black tracking-tight">Eat Me</h2>
                  <p className="text-sm text-emerald-100">Monthly food intelligence and practical rotation planner</p>
                </div>
              </div>
            </div>
            <button type="button" onClick={() => setShowTools((value) => !value)} className="flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-semibold hover:bg-white/15">
              <Settings2 className="h-4 w-4" /> Plan & matching tools
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between rounded-2xl bg-black/15 p-2">
            <button type="button" onClick={() => shiftMonth(-1)} aria-label="Previous month" className="rounded-xl p-2 hover:bg-white/10"><ChevronLeft className="h-5 w-5" /></button>
            <div className="text-center">
              <p className="text-base font-bold">{analysis.monthLabel}</p>
              <p className="text-[11px] text-emerald-100">{analysis.elapsedDays} of {analysis.daysInMonth} days assessed</p>
            </div>
            <button type="button" onClick={() => shiftMonth(1)} aria-label="Next month" className="rounded-xl p-2 hover:bg-white/10"><ChevronRight className="h-5 w-5" /></button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">Expected-to-date</p>
              <p className="mt-1 text-3xl font-black">{analysis.score === null ? "—" : `${analysis.score}%`}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">Month projection</p>
              <p className="mt-1 text-3xl font-black">{analysis.projectionScore === null ? "—" : `${analysis.projectionScore}%`}</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">Confidently matched</p>
              <p className="mt-1 text-3xl font-black">{analysis.matchCoverage}%</p>
            </div>
            <div className="rounded-2xl bg-white/10 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-100">Logs analysed</p>
              <p className="mt-1 text-3xl font-black">{analysis.logCount}</p>
            </div>
          </div>
        </div>
      </section>

      {showTools && (
        <section className="grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:grid-cols-2">
          <div>
            <h3 className="font-bold text-slate-900">Active monthly plan</h3>
            <p className="mt-1 text-sm font-semibold text-emerald-700">{eatMePlan.name}</p>
            <p className="mt-1 text-xs leading-5 text-slate-500">{eatMePlan.sections.length} sections · {allPlanFoods.length} foods · {eatMePlan.goals.length} goals. Reused every month until replaced.</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button type="button" onClick={() => fileInputRef.current?.click()} className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2 text-xs font-semibold text-white hover:bg-blue-700"><Upload className="h-4 w-4" /> Import TXT / JSON</button>
              <button type="button" onClick={() => downloadText(exportEatMePlan(eatMePlan), "nutrimetric-eat-me-plan.json", "application/json")} className="flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"><Download className="h-4 w-4" /> Export plan</button>
              <button type="button" onClick={() => resetEatMePlan()} className="flex items-center gap-1.5 rounded-xl border border-amber-200 px-3 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50"><RotateCcw className="h-4 w-4" /> Reset default</button>
              <input ref={fileInputRef} type="file" accept=".txt,.json,text/plain,application/json" onChange={handlePlanFile} className="hidden" />
            </div>
            {importError && <p role="alert" className="mt-3 rounded-xl bg-red-50 p-3 text-xs font-medium text-red-700">{importError}</p>}
            {importPreview && (
              <div className="mt-3 rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
                <p className="font-bold">Import preview: {importPreview.plan.name}</p>
                <p className="mt-1">{importPreview.sectionCount} sections · {importPreview.foodCount} foods · {importPreview.goalCount} goals</p>
                {importPreview.warnings.map((warning) => <p key={warning} className="mt-1 text-amber-700">{warning}</p>)}
                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={() => { if (replaceEatMePlan(importPreview.plan)) setImportPreview(undefined); }} className="rounded-lg bg-blue-600 px-3 py-1.5 font-semibold text-white">Replace active plan</button>
                  <button type="button" onClick={() => setImportPreview(undefined)} className="rounded-lg bg-white px-3 py-1.5 font-semibold text-slate-600">Cancel</button>
                </div>
              </div>
            )}
          </div>

          <div>
            <h3 className="font-bold text-slate-900">Manual evidence for {formatDateForDisplay(checkInDate)}</h3>
            <p className="mt-1 text-xs leading-5 text-slate-500">Only use these when the food log cannot prove the behavior. Manual evidence is labeled separately.</p>
            <input type="date" value={checkInDate} min={`${month}-01`} max={`${month}-${String(analysis.daysInMonth).padStart(2, "0")}`} onChange={(event) => setCheckInDate(event.target.value)} className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs" />
            <div className="mt-3 space-y-2">
              {manualGoals.map((goal) => {
                const checked = eatMeManualCheckIns.some((item) => item.date === checkInDate && item.goalId === goal.id && item.completed);
                return (
                  <label key={goal.id} className="flex cursor-pointer items-center justify-between rounded-xl border border-slate-200 p-3 text-sm hover:bg-slate-50">
                    <span className="font-medium text-slate-700">{goal.label}</span>
                    <input type="checkbox" checked={checked} onChange={(event) => setEatMeManualCheckIn({ date: checkInDate, goalId: goal.id, completed: event.target.checked })} className="h-4 w-4 accent-emerald-600" />
                  </label>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-emerald-600" /><h3 className="font-bold text-slate-900">Eat today</h3></div>
          <p className="mt-1 text-xs text-slate-500">Practical priorities from foods already in your library.</p>
          <div className="mt-4 space-y-3">
            {analysis.todayRecommendations.length ? analysis.todayRecommendations.map((item, index) => (
              <div key={item.id} className="flex gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-xs font-bold text-white">{index + 1}</span>
                <div><p className="text-sm font-bold text-slate-900">{item.label}</p><p className="mt-0.5 text-xs leading-5 text-slate-500">{item.reason}</p></div>
              </div>
            )) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-500">Map Food Library items in the review area to unlock practical suggestions.</p>}
          </div>
        </section>

        <section className="rounded-2xl border border-blue-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2"><CalendarDays className="h-5 w-5 text-blue-600" /><h3 className="font-bold text-slate-900">Plan this week</h3></div>
          <p className="mt-1 text-xs text-slate-500">Close monthly gaps while rotating foods rather than repeating one choice.</p>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {analysis.weeklyPriorities.slice(0, 6).map((item) => (
              <div key={item.id} className="rounded-xl border border-slate-100 p-3">
                <p className="truncate text-sm font-semibold text-slate-900">{item.label}</p>
                <p className="mt-1 text-[10px] font-medium text-blue-600">{EAT_ME_GROUP_LABELS[item.group]}</p>
              </div>
            ))}
          </div>
          {analysis.discoveryRecommendations.length > 0 && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Discover beyond your library</p>
              <div className="mt-2 flex flex-wrap gap-1.5">{analysis.discoveryRecommendations.slice(0, 4).map((item) => <span key={item.id} className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-blue-700">{item.label}</span>)}</div>
            </div>
          )}
        </section>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div><h3 className="font-bold text-slate-900">Monthly evidence dashboard</h3><p className="mt-1 text-xs text-slate-500">Progress is judged against where the month should be today; projection estimates month end.</p></div>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(analysis.bucketScores) as EatMeScoreBucket[]).map((bucket) => <span key={bucket} className="rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-600">{BUCKET_LABELS[bucket]}: {analysis.bucketScores[bucket] ?? "—"}%</span>)}
          </div>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          <div className="h-72 min-w-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 55 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="name" angle={-35} textAnchor="end" interval={0} tick={{ fontSize: 9 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="expected" name="Expected by today" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="actual" name="Actual / estimated" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {analysis.groupVariety.map((item) => {
              const percent = Math.min(100, item.count / item.target * 100);
              return <div key={item.group} className="rounded-xl border border-slate-100 p-3"><div className="flex justify-between gap-2 text-xs"><span className="font-semibold text-slate-700">{item.label}</span><span className="font-bold text-slate-900">{item.count}/{item.target}</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-emerald-500" style={{ width: `${percent}%` }} /></div></div>;
            })}
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 font-bold text-slate-900"><Target className="h-5 w-5 text-amber-600" /> Goals and limits</h3>
          <div className="mt-4 space-y-3">
            {analysis.goals.map((goal) => (
              <div key={goal.id} className="rounded-xl border border-slate-100 p-3">
                <div className="flex items-start justify-between gap-3">
                  <div><p className="text-sm font-semibold text-slate-800">{goal.label}</p><p className="mt-0.5 text-[11px] text-slate-500">{goal.value}{goal.estimated ? " estimated" : ""} · expected {goal.expectedToDate} · projected {goal.projected}</p></div>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${statusStyle[goal.status]}`}>{goal.status.replace("-", " ")}</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className={`h-full rounded-full ${goal.status === "over-limit" ? "bg-red-500" : goal.status === "behind" ? "bg-amber-500" : "bg-emerald-500"}`} style={{ width: `${goal.progressPercent}%` }} /></div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-6">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-slate-900"><TrendingUp className="h-5 w-5 text-blue-600" /> W1–W5 rotation</h3>
            <div className="mt-4 grid grid-cols-5 gap-2">
              {analysis.weeklyCoverage.map((week) => <div key={week.week} className={`rounded-xl border p-2 text-center ${week.covered >= week.total ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-slate-50"}`}><p className="text-[10px] font-bold text-slate-500">W{week.week}</p><p className="mt-1 text-lg font-black text-slate-900">{week.covered}</p><p className="text-[9px] text-slate-400">of {week.total}</p></div>)}
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="font-bold text-slate-900">Most logged this month</h3>
            <div className="mt-3 space-y-2">{analysis.mostEaten.length ? analysis.mostEaten.map((item, index) => <div key={item.label} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-xs"><span className="truncate text-slate-700">{index + 1}. {item.label}</span><span className="font-bold text-slate-900">{item.count}×</span></div>) : <p className="text-sm text-slate-500">No food logs in this month.</p>}</div>
          </section>
        </div>
      </div>

      <section className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div><h3 className="flex items-center gap-2 font-bold text-slate-900"><Eye className="h-5 w-5 text-amber-600" /> Match review</h3><p className="mt-1 text-xs text-slate-500">Uncertain foods are excluded from item variety until you confirm them. Broad logged categories can still support group-level analysis.</p></div>
          <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700">{analysis.reviewFoods.length} to review</span>
        </div>
        <div className="mt-4 space-y-3">
          {analysis.reviewFoods.length ? analysis.reviewFoods.map((review) => {
            const draftIds = selectedMappingIds(review.normalizedFoodName, review.candidateItemIds);
            return (
              <div key={review.normalizedFoodName} className="rounded-xl border border-slate-200 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2"><div><p className="font-semibold text-slate-900">{review.displayName}</p><p className="text-[11px] text-slate-500">{review.occurrences} logged occurrence{review.occurrences === 1 ? "" : "s"}</p></div><button type="button" onClick={() => saveReviewMapping(review.normalizedFoodName, review.candidateItemIds, true)} className="text-xs font-semibold text-slate-500 hover:text-slate-800">Ignore this food</button></div>
                {review.candidateItemIds.length > 0 && <div className="mt-3 flex flex-wrap gap-2">{review.candidateItemIds.map((id) => { const food = foodsById.get(id); if (!food) return null; const selected = draftIds.includes(id); return <button type="button" key={id} onClick={() => toggleMappingId(review.normalizedFoodName, review.candidateItemIds, id)} className={`rounded-full border px-2.5 py-1 text-[11px] font-medium ${selected ? "border-blue-300 bg-blue-50 text-blue-700" : "border-slate-200 text-slate-600"}`}>{selected && <Check className="mr-1 inline h-3 w-3" />}{food.name}</button>; })}</div>}
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <select defaultValue="" onChange={(event) => { if (event.target.value) toggleMappingId(review.normalizedFoodName, review.candidateItemIds, event.target.value); event.target.value = ""; }} className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs"><option value="">Add another checklist match…</option>{allPlanFoods.map((food) => <option key={food.id} value={food.id}>{food.name} — {EAT_ME_GROUP_LABELS[food.group]}</option>)}</select>
                  <button type="button" disabled={!draftIds.length} onClick={() => saveReviewMapping(review.normalizedFoodName, review.candidateItemIds)} className="rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:opacity-40">Save mapping</button>
                </div>
              </div>
            );
          }) : <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-4 text-sm font-medium text-emerald-700"><CheckCircle2 className="h-5 w-5" /> No unmatched foods need review for this month.</div>}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-xs leading-5 text-slate-500">
        <div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" /><p><strong className="text-slate-700">General wellness guidance:</strong> Eat Me analyzes your own logs against a reusable variety checklist. It is not a medical prescription. Diabetes, kidney disease, allergies, pregnancy, treatment diets and other conditions require guidance from your doctor or dietitian.</p></div>
      </section>
    </div>
  );
};
