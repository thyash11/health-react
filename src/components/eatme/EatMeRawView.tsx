import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  CheckSquare2,
  ChevronLeft,
  ChevronRight,
  ListTree,
  X,
} from "lucide-react";
import { useTracker } from "../../context/TrackerContext";
import { deriveAutomaticEatMeRawTicks } from "../../utils/eatMeRawMatching";
import { useBrowserBackDismiss } from "../../hooks/useBrowserBackDismiss";

interface EatMeRawViewProps {
  onBack: () => void;
}

const RAW_MONTH_SESSION_KEY = "nutrimetric_eat_me_raw_month_session_v1";

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
    eatMeMappings,
    eatMeRawTicks,
    dailyLogs,
    foodLibrary,
    toggleEatMeRawTick,
  } = useTracker();
  const [month, setMonth] = useState(() =>
    sessionStorage.getItem(RAW_MONTH_SESSION_KEY) || selectedDate.slice(0, 7)
  );
  const [showSections, setShowSections] = useState(false);

  useBrowserBackDismiss(showSections, () => setShowSections(false));

  useEffect(() => {
    sessionStorage.setItem(RAW_MONTH_SESSION_KEY, month);
  }, [month]);

  useEffect(() => {
    if (!showSections) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setShowSections(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [showSections]);

  const manualTicksForMonth = useMemo(
    () => new Map(
      eatMeRawTicks
        .filter((tick) => tick.month === month)
        .map((tick) => [tick.itemId, new Set(tick.weeks)]),
    ),
    [eatMeRawTicks, month],
  );
  const automaticTicksForMonth = useMemo(
    () => new Map(
      deriveAutomaticEatMeRawTicks({
        month,
        logs: dailyLogs,
        plan: eatMePlan,
        mappings: eatMeMappings,
        foodLibrary,
      }).map((tick) => [tick.itemId, new Set(tick.weeks)]),
    ),
    [dailyLogs, eatMeMappings, eatMePlan, foodLibrary, month],
  );
  const ticksForMonth = useMemo(() => {
    const combined = new Map<string, Set<number>>();
    [...manualTicksForMonth, ...automaticTicksForMonth].forEach(([itemId, weeks]) => {
      if (!combined.has(itemId)) combined.set(itemId, new Set());
      weeks.forEach((week) => combined.get(itemId)!.add(week));
    });
    return combined;
  }, [automaticTicksForMonth, manualTicksForMonth]);
  const automaticCheckedBoxes = useMemo(
    () => [...automaticTicksForMonth.values()].reduce((total, weeks) => total + weeks.size, 0),
    [automaticTicksForMonth],
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

  const goToSection = (sectionIndex: number) => {
    setShowSections(false);
    document.getElementById(`eat-me-raw-section-${sectionIndex}`)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <div className="mx-auto max-w-5xl space-y-5 pb-24 sm:pb-8">
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
              Food logs auto-check confident dish and primary-ingredient matches. You can still tick anything else manually.
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
          <p>2. Blue AUTO boxes come from Food Log and follow changes to those logs.</p>
          <p>3. Tick unchecked boxes manually; each month keeps its own manual checks.</p>
          <p>4. Only explicit primary ingredients are used—the app never guesses a cooked recipe.</p>
          <p>5. Rotate suitable seasonal, affordable and locally available foods.</p>
          <p className="mt-3 font-semibold text-slate-800">WEEKLY BOX KEY: [ ] W1&nbsp;&nbsp; [ ] W2&nbsp;&nbsp; [ ] W3&nbsp;&nbsp; [ ] W4&nbsp;&nbsp; [ ] W5</p>
          <p className="mt-1 font-semibold text-blue-700">AUTO FROM FOOD LOG: {automaticCheckedBoxes} weekly check{automaticCheckedBoxes === 1 ? "" : "s"}</p>
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
            <section
              key={section.id}
              id={`eat-me-raw-section-${sectionIndex}`}
              className="scroll-mt-36"
            >
              <div className="mb-3 border-y-2 border-slate-800 py-2 text-center font-mono">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
                  Section {String(sectionIndex + 1).padStart(2, "0")}
                </p>
                <h3 className="text-sm font-black uppercase text-slate-950 sm:text-base">{section.title}</h3>
              </div>

              <div className="overflow-hidden rounded-lg border border-slate-300 bg-white sm:hidden">
                {section.foods.map((food) => (
                  <div key={food.id} className="border-b border-slate-200 last:border-b-0">
                    <div className="bg-white px-3 py-2.5 font-mono text-sm leading-5 text-slate-800">
                      {food.name}
                    </div>
                    <div className="grid grid-cols-5 border-t border-slate-100 bg-slate-50/80">
                      {[1, 2, 3, 4, 5].map((week) => {
                        const checked = ticksForMonth.get(food.id)?.has(week) ?? false;
                        const automatic = automaticTicksForMonth.get(food.id)?.has(week) ?? false;
                        return (
                          <label
                            key={week}
                            className={`flex min-h-12 flex-col items-center justify-center gap-1 border-r border-slate-200 py-1.5 font-mono text-[10px] font-bold last:border-r-0 ${automatic ? "cursor-default bg-blue-50 text-blue-700" : "cursor-pointer text-slate-500"}`}
                          >
                            W{week}
                            <input
                              type="checkbox"
                              checked={checked}
                              disabled={automatic}
                              onChange={() => toggleEatMeRawTick(month, food.id, week)}
                              aria-label={`${food.name}, week ${week}, ${formatMonth(month)}${automatic ? ", automatically checked from food log" : ""}`}
                              className={`h-4 w-4 accent-emerald-600 ${automatic ? "cursor-default accent-blue-600" : "cursor-pointer"}`}
                            />
                            {automatic && <span className="text-[8px] font-black tracking-wide">AUTO</span>}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>

              <div className="hidden overflow-x-auto rounded-lg border border-slate-300 bg-white sm:block">
                <table className="w-full min-w-[560px] border-collapse font-mono text-sm">
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
                          const automatic = automaticTicksForMonth.get(food.id)?.has(week) ?? false;
                          return (
                            <td key={week} className={`px-2 py-2 text-center ${automatic ? "bg-blue-50/70" : ""}`}>
                              <label className={`inline-flex min-h-9 min-w-9 flex-col items-center justify-center rounded-md ${automatic ? "cursor-default text-blue-700" : "cursor-pointer hover:bg-emerald-100"}`}>
                                <input
                                  type="checkbox"
                                  checked={checked}
                                  disabled={automatic}
                                  onChange={() => toggleEatMeRawTick(month, food.id, week)}
                                  aria-label={`${food.name}, week ${week}, ${formatMonth(month)}${automatic ? ", automatically checked from food log" : ""}`}
                                  className={`h-4 w-4 accent-emerald-600 ${automatic ? "cursor-default accent-blue-600" : "cursor-pointer"}`}
                                />
                                {automatic && <span className="mt-0.5 text-[7px] font-black tracking-wide">AUTO</span>}
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

      {showSections && (
        <button
          type="button"
          aria-label="Close section navigator"
          onClick={() => setShowSections(false)}
          className="fixed inset-0 z-[55] cursor-default bg-slate-950/10"
        />
      )}

      <div className="fixed bottom-5 right-4 z-[60] flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
        {showSections && (
          <div
            id="eat-me-raw-section-menu"
            className="w-[calc(100vw-2rem)] max-w-xs overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-slate-200 bg-emerald-50 px-4 py-3">
              <div>
                <p className="text-sm font-black text-emerald-950">Jump to section</p>
                <p className="text-[11px] text-emerald-700">{eatMePlan.sections.length} checklist sections</p>
              </div>
              <button
                type="button"
                onClick={() => setShowSections(false)}
                aria-label="Close section list"
                className="flex h-8 w-8 items-center justify-center rounded-full text-emerald-700 transition-colors hover:bg-emerald-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <nav aria-label="Eat Me Raw sections" className="max-h-[60vh] overflow-y-auto p-2">
              {eatMePlan.sections.map((section, sectionIndex) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => goToSection(sectionIndex)}
                  className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-emerald-50"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-[10px] font-black text-slate-600">
                    {String(sectionIndex + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-800">{section.title}</span>
                  <span className="shrink-0 text-[10px] text-slate-400">{section.foods.length}</span>
                </button>
              ))}
            </nav>
          </div>
        )}

        <button
          type="button"
          onClick={() => setShowSections((visible) => !visible)}
          aria-label={showSections ? "Close section navigator" : "Open section navigator"}
          aria-expanded={showSections}
          aria-controls="eat-me-raw-section-menu"
          title="Jump to a food section"
          className="flex h-14 w-14 items-center justify-center rounded-full border-4 border-white bg-emerald-600 text-white shadow-xl transition-all hover:bg-emerald-700 active:scale-95"
        >
          {showSections ? <X className="h-6 w-6" /> : <ListTree className="h-6 w-6" />}
        </button>
      </div>
    </div>
  );
};
