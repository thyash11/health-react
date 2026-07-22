import React, { useEffect, useRef } from "react";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Activity, 
  TrendingUp, 
  BookOpen, 
  HeartPulse, 
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useTracker } from "../context/TrackerContext";
import { FormattedDateInput } from "./FormattedDateInput";

export type TabType = "dashboard" | "foodlog" | "habits" | "analytics" | "library" | "health" | "categories" | "settings";

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { selectedDate, setSelectedDate } = useTracker();
  const navRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Partial<Record<TabType, HTMLButtonElement | null>>>({});

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "foodlog", label: "Daily Food Log", icon: UtensilsCrossed },
    { id: "habits", label: "Habits & Activity", icon: Activity },
    { id: "analytics", label: "Trends & Analytics", icon: TrendingUp },
    { id: "library", label: "Food Library", icon: BookOpen },
    { id: "health", label: "Health & Labs", icon: HeartPulse },
  ] as const;

  const shiftSelectedDate = (days: number) => {
    const [year, month, day] = selectedDate.split("-").map(Number);
    const date = new Date(year, month - 1, day);
    date.setDate(date.getDate() + days);
    const nextYear = date.getFullYear();
    const nextMonth = String(date.getMonth() + 1).padStart(2, "0");
    const nextDay = String(date.getDate()).padStart(2, "0");
    setSelectedDate(`${nextYear}-${nextMonth}-${nextDay}`);
  };

  useEffect(() => {
    const nav = navRef.current;
    const activeButton = tabRefs.current[activeTab];
    if (!nav || !activeButton) return;

    const centeredLeft = activeButton.offsetLeft - (nav.clientWidth - activeButton.offsetWidth) / 2;
    nav.scrollTo({ left: Math.max(0, centeredLeft), behavior: "smooth" });
  }, [activeTab]);

  return (
    <header className="bg-white text-slate-900 shadow-sm border-b border-slate-200 sticky top-0 z-50">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-3.5 gap-2 sm:gap-3">
          
          {/* Logo & Title */}
          <div className="flex min-w-0 items-center space-x-2 sm:space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                NutriMetric
                <span className="mt-1 rounded-md border border-blue-300 font-extrabold bg-blue-50/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wider text-blue-700">
                  Pro
                </span>
              </h1>
            </div>
          </div>

          {/* Quick Actions & Date Picker */}
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            {/* Selected Date Picker */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-2 sm:px-3 py-1.5 text-xs text-slate-700">
            <button
                type="button"
                onClick={() => shiftSelectedDate(-1)}
                aria-label="Previous day"
                title="Previous day"
                className="mr-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xs transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <FormattedDateInput
                value={selectedDate}
                onChange={setSelectedDate}
                ariaLabel="Select active date"
                className="bg-transparent border-none text-slate-900 text-xs font-semibold rounded-md"
              />
              <button
                type="button"
                onClick={() => shiftSelectedDate(1)}
                aria-label="Next day"
                title="Next day"
                className="ml-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 shadow-xs transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>

          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <nav ref={navRef} className="flex space-x-1.5 overflow-x-auto scrollbar-none py-2 border-t border-slate-100 text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                ref={(element) => {
                  tabRefs.current[item.id] = element;
                }}
                onClick={() => setActiveTab(item.id as TabType)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-blue-50 text-blue-700 border border-blue-200/80 font-semibold shadow-xs"
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? "text-blue-600" : "text-slate-400"}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
