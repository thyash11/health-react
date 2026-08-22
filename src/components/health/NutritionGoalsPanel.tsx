import React, { useMemo, useState } from "react";
import {
  Calculator,
  Gauge,
  RotateCcw,
  Save,
  Scale,
  Target,
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import {
  calculateNutritionGoalPreset,
  GOAL_INTENSITY_OPTIONS,
  GoalIntensity,
  NutritionGoalPreset,
} from "../../utils/nutritionGoals";
import { getLatestWeightMetric } from "../../utils/weightMetrics";
import { formatDateForDisplay } from "../../utils/nutritionCalculator";

const inputClass = "mt-1 w-full rounded-xl border border-slate-200 bg-white p-2.5 font-bold text-slate-900 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-100";

export const NutritionGoalsPanel: React.FC = () => {
  const { targets, updateTargets, healthMetrics } = useTracker();
  const latestWeightMetric = useMemo(() => getLatestWeightMetric(healthMetrics), [healthMetrics]);
  const currentWeight = latestWeightMetric?.weightKg || targets.currentWeightKg || 0;
  const effectiveDate = new Date().toLocaleDateString("en-CA");
  const initialIntensity = targets.goalIntensity || "easy";
  const initialPreset = calculateNutritionGoalPreset(currentWeight, initialIntensity);

  const [intensity, setIntensity] = useState<GoalIntensity>(initialIntensity);
  const [calories, setCalories] = useState(targets.dailyCalories || initialPreset?.dailyCalories || 0);
  const [protein, setProtein] = useState(targets.proteinGrams || initialPreset?.proteinGrams || 0);
  const [carbs, setCarbs] = useState(targets.carbsGrams || initialPreset?.carbsGrams || 0);
  const [fat, setFat] = useState(targets.fatGrams || initialPreset?.fatGrams || 0);
  const [fiber, setFiber] = useState(targets.fiberGrams || initialPreset?.fiberGrams || 0);
  const [water, setWater] = useState(targets.waterMl || initialPreset?.waterMl || 0);
  const [walk, setWalk] = useState(targets.walkKm || initialPreset?.walkKm || 0);
  const [goalWeight, setGoalWeight] = useState(targets.goalWeightKg || 0);

  const activeIndex = Math.max(0, GOAL_INTENSITY_OPTIONS.findIndex((option) => option.id === intensity));
  const activeOption = GOAL_INTENSITY_OPTIONS[activeIndex];
  const basisIsMissing = currentWeight > 0
    && targets.goalBasisWeightKg <= 0
    && targets.dailyCalories > 0;
  const basisIsStale = currentWeight > 0
    && targets.goalBasisWeightKg > 0
    && currentWeight !== targets.goalBasisWeightKg;

  const applyPreset = (nextIntensity: GoalIntensity) => {
    setIntensity(nextIntensity);
    const preset = calculateNutritionGoalPreset(currentWeight, nextIntensity);
    if (!preset) return;
    setCalories(preset.dailyCalories);
    setProtein(preset.proteinGrams);
    setCarbs(preset.carbsGrams);
    setFat(preset.fatGrams);
    setFiber(preset.fiberGrams);
    setWater(preset.waterMl);
    setWalk(preset.walkKm);
  };

  const saveTargets = (event: React.FormEvent) => {
    event.preventDefault();
    updateTargets({
      dailyCalories: Number(calories),
      proteinGrams: Number(protein),
      carbsGrams: Number(carbs),
      fatGrams: Number(fat),
      fiberGrams: Number(fiber),
      waterMl: Number(water),
      walkKm: Number(walk),
      goalWeightKg: Number(goalWeight),
      currentWeightKg: currentWeight,
      goalIntensity: intensity,
      goalBasisWeightKg: currentWeight,
    });
    window.alert("Personal nutrition and health targets updated!");
  };

  const goalFields: Array<{
    id: keyof NutritionGoalPreset;
    label: string;
    unit: string;
    value: number;
    step?: number;
    color: string;
    setValue: (value: number) => void;
  }> = [
    { id: "dailyCalories", label: "Daily limit", unit: "kcal", value: calories, color: "text-amber-600", setValue: setCalories },
    { id: "proteinGrams", label: "Protein target", unit: "g", value: protein, color: "text-emerald-600", setValue: setProtein },
    { id: "carbsGrams", label: "Carb limit", unit: "g", value: carbs, color: "text-blue-600", setValue: setCarbs },
    { id: "fatGrams", label: "Fat maximum", unit: "g", value: fat, color: "text-rose-600", setValue: setFat },
    { id: "fiberGrams", label: "Fiber target", unit: "g", value: fiber, color: "text-teal-600", setValue: setFiber },
    { id: "waterMl", label: "Water target", unit: "ml", value: water, color: "text-cyan-600", setValue: setWater },
    { id: "walkKm", label: "Walk target", unit: "km", value: walk, step: 0.5, color: "text-indigo-600", setValue: setWalk },
  ];

  return (
    <form onSubmit={saveTargets} className="space-y-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex flex-col gap-3 border-b border-slate-100 pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <Target className="h-4 w-4 text-violet-600" />
            Nutrition & Daily Goals Configuration
          </h3>
          <p className="mt-0.5 text-xs text-slate-500">Generate practical daily limits from your newest recorded weight, then edit anything you need.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-xs font-bold ${basisIsStale || basisIsMissing ? "border-amber-200 bg-amber-50 text-amber-700" : "border-violet-200 bg-violet-50 text-violet-700"}`}>
            <Scale className="h-3.5 w-3.5" />
            {currentWeight > 0 ? `${currentWeight} kg latest` : "No weight recorded"}
          </div>
          <button type="submit" className="flex items-center gap-1.5 rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white shadow-xs transition-colors hover:bg-blue-700">
            <Save className="h-3.5 w-3.5" />
            Save
          </button>
        </div>
      </div>

      <section className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 p-4 sm:p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2 text-sm font-black text-violet-950">
              <Gauge className="h-4 w-4 text-violet-600" />
              Goal intensity
            </div>
            <p className="mt-1 text-xs text-violet-700">{activeOption.description}</p>
          </div>
          <button
            type="button"
            onClick={() => applyPreset(intensity)}
            disabled={currentWeight <= 0}
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-violet-200 bg-white px-3 py-2 text-[11px] font-bold text-violet-700 shadow-xs transition-colors hover:bg-violet-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Recalculate
          </button>
        </div>

        <div className="mt-5 px-1">
          <input
            type="range"
            min={0}
            max={2}
            step={1}
            value={activeIndex}
            disabled={currentWeight <= 0}
            onChange={(event) => applyPreset(GOAL_INTENSITY_OPTIONS[Number(event.target.value)].id)}
            aria-label="Goal intensity"
            className="h-2 w-full cursor-pointer accent-violet-600 disabled:cursor-not-allowed disabled:opacity-50"
          />
          <div className="mt-2 grid grid-cols-3 gap-2">
            {GOAL_INTENSITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                disabled={currentWeight <= 0}
                onClick={() => applyPreset(option.id)}
                className={`rounded-xl px-2 py-2 text-center transition-all disabled:cursor-not-allowed ${intensity === option.id ? "bg-violet-600 text-white shadow-md" : "bg-white/80 text-violet-700 hover:bg-white"}`}
              >
                <span className="block text-xs font-black">{option.label}</span>
                <span className={`mt-0.5 block text-[9px] ${intensity === option.id ? "text-violet-100" : "text-violet-500"}`}>
                  {option.calorieFactor} kcal/kg
                </span>
              </button>
            ))}
          </div>
        </div>

        {currentWeight <= 0 && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
            Record your current weight below before using automatic goal intensity.
          </p>
        )}
        {basisIsStale && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
            Your latest weight changed from {targets.goalBasisWeightKg} kg to {currentWeight} kg. Recalculate and save to refresh these limits.
          </p>
        )}
        {basisIsMissing && (
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
            Your existing targets have no recorded weight basis. Recalculate and save to connect them to the latest {currentWeight} kg measurement.
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Calculator className="h-4 w-4 text-slate-500" />
          <div>
            <h4 className="text-xs font-black uppercase tracking-wide text-slate-700">Generated daily limits</h4>
            <p className="text-[10px] text-slate-500">All values remain editable before saving.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {goalFields.map((field) => (
            <label key={field.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] text-slate-500">
              <span className="flex items-center justify-between gap-2">
                <span>{field.label}</span>
                <span className="text-[9px] font-bold uppercase text-slate-400">{field.unit}</span>
              </span>
              <input
                type="number"
                min={0}
                step={field.step || 1}
                value={field.value}
                onChange={(event) => field.setValue(Number(event.target.value))}
                className={`${inputClass} ${field.color}`}
              />
            </label>
          ))}
          <label className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-[11px] text-amber-700">
            <span className="flex items-center justify-between gap-2">
              <span>Goal weight</span>
              <span className="text-[9px] font-bold uppercase text-amber-500">kg</span>
            </span>
            <input
              type="number"
              min={0}
              step={0.5}
              value={goalWeight}
              onChange={(event) => setGoalWeight(Number(event.target.value))}
              className={`${inputClass} text-amber-700`}
            />
          </label>
        </div>
      </section>

      <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-[10px] leading-4 text-slate-500">
        Saving creates the target revision effective {formatDateForDisplay(effectiveDate)}. It applies to that day and future dates; targets already saved for earlier dates remain unchanged.
        <br />
        Presets use the latest weight with transparent planning factors: calories {activeOption.calorieFactor} kcal/kg, protein {activeOption.proteinFactor} g/kg, fat up to 30% of energy, carbs from the remaining energy, fiber 14 g/1,000 kcal, and water 35 ml/kg. These are general planning estimates, not medical prescriptions.
      </div>
    </form>
  );
};
