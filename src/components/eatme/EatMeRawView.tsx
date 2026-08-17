import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";

interface EatMeRawViewProps {
  onBack: () => void;
}

const formatMonth = (month: string) => {
  const [year, monthNumber] = month.split("-").map(Number);
  return new Intl.DateTimeFormat("en-IN", {
    month: "long",
    year: "numeric",
  }).format(new Date(year, monthNumber - 1, 1));
};

export const EatMeRawView: React.FC<EatMeRawViewProps> = ({ onBack }) => {
  const {
    selectedDate,
    eatMePlan,
    eatMeRawTicks,
    toggleEatMeRawTick,
  } = useTracker();
  const [month, setMonth] = useState(selectedDate.slice(0, 7));

  const ticksForMonth = useMemo(
    () => new Map(
      eatMeRawTicks
        .filter((tick) => tick.month === month)
        .map((tick) => [tick.itemId, new Set(tick.weeks)]),
    ),
    [eatMeRawTicks, month],
  );

  const totalFoods = useMemo(
    () => eatMePlan.sections.reduce((total, section) => total + section.foods.length, 0),
    [eatMePlan.sections],
  );
  const checkedFoods = useMemo(
    () => eatMePlan.sections.reduce(
      (total, section) => total + section.foods.filter((food) => (ticksForMonth.get(food.id)?.size ?? 0) > 0).length,
      0,
    ),
    [eatMePlan.sections, ticksForMonth],
  );
  const checkedBoxes = useMemo(
    () => eatMePlan.sections.reduce(
      (total, section) => total + section.foods.reduce(
        (sectionTotal, food) => sectionTotal + (ticksForMonth.get(food.id)?.size ?? 0),
        0,
      ),
      0,
    ),
    [eatMePlan.sections, ticksForMonth],
  );

  const shiftMonth = (amount: number) => {
    const [year, monthNumber] = month.split("-").map(Number);
    const shifted = new Date(year, monthNumber - 1 + amount, 1);
    setMonth(`${shifted.getFullYear()}-${String(shifted.getMonth() + 1).padStart(2, "0")}`);
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-8">
      <header className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to dashboard
        </button>

        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
              <CheckSquare2 className="h-4 w-4" />
              Monthly variety checklist
            </div>
            <h1 className="text-2xl font-black text-slate-950 sm:text-3xl">Eat Me Raw</h1>
            <p className="mt-1 max-w-xl text-sm text-slate-600">
              Tick a food once when you eat it during W1–W5. Each month keeps its own checklist.
            </p>
          </div>

          <div className="w-full sm:w-auto">
            <label htmlFor="eat-me-raw-month" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Month and year
            </label>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => shiftMonth(-1)}
                aria-label="Previous month"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="relative min-w-0 flex-1 sm:w-48">
                <CalendarDays className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="eat-me-raw-month"
                  type="month"
                  value={month}
                  onChange={(event) => event.target.value && setMonth(event.target.value)}
                  className="h-10 w-full rounded-xl border border-slate-200 bg-white pl-9 pr-3 text-sm font-semibold text-slate-800 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                />
              </div>
              <button
                type="button"
                onClick={() => shiftMonth(1)}
                aria-label="Next month"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition-colors hover:border-emerald-300 hover:text-emerald-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="overflow-hidden rounded-2xl border border-emerald-200 bg-[#fffef8] shadow-sm">
        <div className="border-b border-emerald-200 bg-emerald-50/70 px-4 py-5 text-center sm:px-6">
          <h2 className="font-mono text-base font-bold uppercase tracking-wide text-slate-950 sm:text-lg">
            {eatMePlan.name}
          </h2>
          <p className="mt-1 font-mono text-sm text-slate-600">{formatMonth(month)}</p>
        </div>

        <div className="border-b border-slate-200 px-4 py-4 font-mono text-xs leading-5 text-slate-600 sm:px-6 sm:text-sm">
          <p className="font-bold text-slate-800">HOW TO USE</p>
          <p>1. A box means: I ate this food at least once during that week.</p>
          <p>2. Tick only one box per week for each food, even if you ate it many times.</p>
          <p>3. Rotate suitable seasonal, affordable and locally available foods.</p>
          <p className="mt-3 font-semibold text-slate-800">WEEKLY BOX KEY: [ ] W1&nbsp;&nbsp; [ ] W2&nbsp;&nbsp; [ ] W3&nbsp;&nbsp; [ ] W4&nbsp;&nbsp; [ ] W5</p>
        </div>

        <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 bg-white font-mono text-center">
          <div className="px-2 py-3">
            <span className="block text-lg font-black text-slate-900">{checkedFoods}</span>
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Foods tried</span>
          </div>
          <div className="px-2 py-3">
            <span className="block text-lg font-black text-slate-900">{checkedBoxes}</span>
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Weekly ticks</span>
          </div>
          <div className="px-2 py-3">
            <span className="block text-lg font-black text-slate-900">{totalFoods}</span>
            <span className="text-[10px] uppercase tracking-wide text-slate-500">Plan foods</span>
          </div>
        </div>

        <div className="space-y-8 px-3 py-6 sm:px-6">
          {eatMePlan.sections.map((section, sectionIndex) => (
            <section key={section.id}>
              <div className="mb-3 border-y-2 border-slate-800 py-2 text-center font-mono">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Section {String(sectionIndex + 1).padStart(2, "0")}
                </p>
                <h3 className="text-sm font-black uppercase text-slate-950 sm:text-base">{section.title}</h3>
              </div>

              <div className="overflow-x-auto rounded-lg border border-slate-300 bg-white">
                <table className="w-full min-w-[560px] border-collapse font-mono text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-700 bg-slate-50 text-slate-800">
                      <th scope="col" className="sticky left-0 z-10 min-w-[300px] border-r border-slate-300 bg-slate-50 px-3 py-2 text-left font-bold">
                        Food
                      </th>
                      {[1, 2, 3, 4, 5].map((week) => (
                        <th key={week} scope="col" className="w-12 px-2 py-2 text-center font-bold">
                          W{week}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.foods.map((food) => (
                      <tr key={food.id} className="border-b border-slate-200 last:border-b-0 hover:bg-emerald-50/40">
                        <th
                          scope="row"
                          className="sticky left-0 z-10 border-r border-slate-200 bg-white px-3 py-2.5 text-left font-normal leading-5 text-slate-800"
                        >
                          {food.name}
                        </th>
                        {[1, 2, 3, 4, 5].map((week) => {
                          const checked = ticksForMonth.get(food.id)?.has(week) ?? false;
                          return (
                            <td key={week} className="px-2 py-2 text-center">
                              <label className="inline-flex h-7 w-7 cursor-pointer items-center justify-center rounded-md hover:bg-emerald-100">
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  onChange={() => toggleEatMeRawTick(month, food.id, week)}
                                  aria-label={`${food.name}, week ${week}, ${formatMonth(month)}`}
                                  className="h-4 w-4 cursor-pointer accent-emerald-600"
                                />
                              </label>
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <div className="border-t border-slate-200 px-4 py-4 text-center font-mono text-[11px] leading-5 text-slate-500 sm:px-6">
          This is a variety checklist, not a calorie plan or treatment diet. Portions must suit your health needs.
        </div>
      </section>
    </div>
  );
};
