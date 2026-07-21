import React, { useState, useEffect } from "react";
import { 
  Activity, 
  Moon, 
  Footprints, 
  Droplets, 
  Smile, 
  Apple, 
  AlertCircle, 
  Award, 
  Save, 
  Sparkles, 
  Flame 
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { DayType, DailyHabitRecord } from "../../types";
import { calculateDailyHealthScore, aggregateDailySummary, getScoreColor } from "../../utils/nutritionCalculator";

export const HabitsView: React.FC = () => {
  const { selectedDate, habits, updateHabitRecord, dailyLogs, targets } = useTracker();

  // Find or initialize habit record for selectedDate
  const currentRecord = habits.find((h) => h.date === selectedDate);
  const daySummary = aggregateDailySummary(selectedDate, dailyLogs, habits, targets);

  const [dayType, setDayType] = useState<DayType>(currentRecord?.dayType || "Normal");
  const [weightKg, setWeightKg] = useState<number | "">(currentRecord?.weightKg || "");
  const [waistInch, setWaistInch] = useState<number | "">(currentRecord?.waistInch || "");
  const [sleepStart, setSleepStart] = useState(currentRecord?.sleepStart || "11:30 PM");
  const [wakeTime, setWakeTime] = useState(currentRecord?.wakeTime || "06:30 AM");
  const [sleepHours, setSleepHours] = useState<number>(currentRecord?.sleepHours || 7.0);
  const [sleepQuality, setSleepQuality] = useState<DailyHabitRecord["sleepQuality"]>(currentRecord?.sleepQuality || "Good");
  const [walkKm, setWalkKm] = useState<number>(currentRecord?.walkKm || daySummary.totalWalkKm || 0);
  const [waterMl, setWaterMl] = useState<number>(currentRecord?.waterMl || daySummary.totalWater || 2000);
  const [stressLevel, setStressLevel] = useState<DailyHabitRecord["stressLevel"]>(currentRecord?.stressLevel || "Medium");
  const [fruitEntries, setFruitEntries] = useState<number>(currentRecord?.fruitEntries || 0);
  const [vegLegumeEntries, setVegLegumeEntries] = useState<number>(currentRecord?.vegLegumeEntries || 1);
  const [treatEntries, setTreatEntries] = useState<number>(currentRecord?.treatEntries || 1);
  const [sugaryDrinksEntries, setSugaryDrinksEntries] = useState<number>(currentRecord?.sugaryDrinksEntries || 0);

  useEffect(() => {
    const rec = habits.find((h) => h.date === selectedDate);
    if (rec) {
      setDayType(rec.dayType || "Normal");
      setWeightKg(rec.weightKg || "");
      setWaistInch(rec.waistInch || "");
      setSleepStart(rec.sleepStart || "11:30 PM");
      setWakeTime(rec.wakeTime || "06:30 AM");
      setSleepHours(rec.sleepHours || 7.0);
      setSleepQuality(rec.sleepQuality || "Good");
      setWalkKm(rec.walkKm || 0);
      setWaterMl(rec.waterMl || 0);
      setStressLevel(rec.stressLevel || "Medium");
      setFruitEntries(rec.fruitEntries || 0);
      setVegLegumeEntries(rec.vegLegumeEntries || 1);
      setTreatEntries(rec.treatEntries || 0);
      setSugaryDrinksEntries(rec.sugaryDrinksEntries || 0);
    }
  }, [selectedDate, habits]);

  // Calculated score preview
  const calculatedScore = calculateDailyHealthScore(
    daySummary.totalCalories,
    daySummary.totalProtein,
    daySummary.totalFiber,
    waterMl,
    walkKm,
    treatEntries,
    sugaryDrinksEntries,
    targets
  );

  const handleSaveHabits = (e: React.FormEvent) => {
    e.preventDefault();
    updateHabitRecord({
      date: selectedDate,
      dayType,
      weightKg: weightKg === "" ? undefined : Number(weightKg),
      waistInch: waistInch === "" ? undefined : Number(waistInch),
      sleepStart,
      wakeTime,
      sleepHours: Number(sleepHours),
      sleepQuality,
      walkKm: Number(walkKm),
      waterMl: Number(waterMl),
      stressLevel,
      fruitEntries: Number(fruitEntries),
      vegLegumeEntries: Number(vegLegumeEntries),
      treatEntries: Number(treatEntries),
      sugaryDrinksEntries: Number(sugaryDrinksEntries),
      dailyScore: calculatedScore,
    });
    alert(`Habit & Health parameters saved for ${selectedDate}!`);
  };

  const scoreInfo = getScoreColor(calculatedScore);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Title */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Daily Habits & Score Tracker ({selectedDate})
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Record sleep, activity, hydration, day context, and habit metrics to update daily health score
          </p>
        </div>

        <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
          <div>
            <span className="text-[10px] text-slate-500 font-semibold uppercase block">Calculated Score</span>
            <span className={`text-xl font-extrabold ${scoreInfo.text}`}>{calculatedScore}%</span>
          </div>
          <Award className={`w-6 h-6 ${calculatedScore >= 70 ? "text-emerald-600" : "text-amber-600"}`} />
        </div>
      </div>

      <form onSubmit={handleSaveHabits} className="space-y-6">
        
        {/* Day Context & Measurements Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Smile className="w-4 h-4 text-blue-600" />
            Day Context & Body Measurements
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            
            {/* Day Type */}
            <div>
              <label className="text-slate-500 block mb-1">Day Type</label>
              <select
                value={dayType}
                onChange={(e) => setDayType(e.target.value as DayType)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Normal">Normal</option>
                <option value="Travel">Travel</option>
                <option value="Ritual / Festival">Ritual / Festival</option>
                <option value="Rest Day">Rest Day</option>
              </select>
            </div>

            {/* Weight */}
            <div>
              <label className="text-slate-500 block mb-1">Body Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value ? Number(e.target.value) : "")}
                placeholder="e.g. 98.5"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Waist */}
            <div>
              <label className="text-slate-500 block mb-1">Waist (inches)</label>
              <input
                type="number"
                step="0.5"
                value={waistInch}
                onChange={(e) => setWaistInch(e.target.value ? Number(e.target.value) : "")}
                placeholder="e.g. 40.0"
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-semibold rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              />
            </div>

            {/* Stress */}
            <div>
              <label className="text-slate-500 block mb-1">Stress Level</label>
              <select
                value={stressLevel}
                onChange={(e) => setStressLevel(e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

          </div>
        </div>

        {/* Sleep & Activity Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Sleep Card */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Moon className="w-4 h-4 text-indigo-600" />
              Sleep Tracking
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div>
                <label className="text-slate-500 block mb-1">Sleep Start</label>
                <input
                  type="text"
                  value={sleepStart}
                  onChange={(e) => setSleepStart(e.target.value)}
                  placeholder="11:30 PM"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Wake Time</label>
                <input
                  type="text"
                  value={wakeTime}
                  onChange={(e) => setWakeTime(e.target.value)}
                  placeholder="06:30 AM"
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Total Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleepHours}
                  onChange={(e) => setSleepHours(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-indigo-600 font-bold rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1">Quality</label>
                <select
                  value={sleepQuality}
                  onChange={(e) => setSleepQuality(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5"
                >
                  <option value="Poor">Poor</option>
                  <option value="Average">Average</option>
                  <option value="Good">Good</option>
                  <option value="Excellent">Excellent</option>
                </select>
              </div>
            </div>
          </div>

          {/* Hydration & Walking Activity */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
              <Footprints className="w-4 h-4 text-cyan-600" />
              Activity & Hydration
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-500 font-medium">Water Intake (ml)</label>
                  <span className="text-cyan-600 font-bold">{waterMl} / {targets.waterMl} ml</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="4000"
                  step="100"
                  value={waterMl}
                  onChange={(e) => setWaterMl(Number(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex gap-2 mt-2">
                  {[500, 1000, 2000, 2700, 3000].map((val) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setWaterMl(val)}
                      className="px-2.5 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-lg text-[11px] border border-slate-200 font-medium"
                    >
                      {val} ml
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-1">
                  <label className="text-slate-500 font-medium">Walk Distance (km)</label>
                  <span className="text-indigo-600 font-bold">{walkKm} / {targets.walkKm} km</span>
                </div>
                <input
                  type="number"
                  step="0.5"
                  value={walkKm}
                  onChange={(e) => setWalkKm(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl p-2.5"
                />
              </div>
            </div>
          </div>

        </div>

        {/* Quality Habits & Treats Counters */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 shadow-sm">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2">
            <Apple className="w-4 h-4 text-emerald-600" />
            Food Quality & Treat Frequency Counters
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            
            {/* Fruit Entries */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <label className="text-slate-500 block mb-1 font-medium">Fruit Portions</label>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setFruitEntries(Math.max(0, fruitEntries - 1))}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 shadow-xs"
                >
                  -
                </button>
                <span className="text-lg font-bold text-emerald-600">{fruitEntries}</span>
                <button
                  type="button"
                  onClick={() => setFruitEntries(fruitEntries + 1)}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Veg / Legume Entries */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <label className="text-slate-500 block mb-1 font-medium">Veg / Legume Portions</label>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setVegLegumeEntries(Math.max(0, vegLegumeEntries - 1))}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 shadow-xs"
                >
                  -
                </button>
                <span className="text-lg font-bold text-teal-600">{vegLegumeEntries}</span>
                <button
                  type="button"
                  onClick={() => setVegLegumeEntries(vegLegumeEntries + 1)}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Treat Entries */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <label className="text-slate-500 block mb-1 font-medium">Treat / Snack Entries</label>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setTreatEntries(Math.max(0, treatEntries - 1))}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 shadow-xs"
                >
                  -
                </button>
                <span className={`text-lg font-bold ${treatEntries > 1 ? "text-rose-600" : "text-amber-600"}`}>
                  {treatEntries}
                </span>
                <button
                  type="button"
                  onClick={() => setTreatEntries(treatEntries + 1)}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sugary Drinks */}
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <label className="text-slate-500 block mb-1 font-medium">Sugary Drinks</label>
              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSugaryDrinksEntries(Math.max(0, sugaryDrinksEntries - 1))}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 shadow-xs"
                >
                  -
                </button>
                <span className={`text-lg font-bold ${sugaryDrinksEntries > 0 ? "text-rose-600" : "text-slate-700"}`}>
                  {sugaryDrinksEntries}
                </span>
                <button
                  type="button"
                  onClick={() => setSugaryDrinksEntries(sugaryDrinksEntries + 1)}
                  className="w-8 h-8 bg-white hover:bg-slate-100 text-slate-800 rounded-lg font-bold border border-slate-200 shadow-xs"
                >
                  +
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>Save Habits & Health Log</span>
          </button>
        </div>

      </form>

    </div>
  );
};
