import React from "react";
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Activity, 
  TrendingUp, 
  BookOpen, 
  HeartPulse, 
  RotateCcw,
  Calendar,
} from "lucide-react";
import { useTracker } from "../context/TrackerContext";
import { FormattedDateInput } from "./FormattedDateInput";

export type TabType = "dashboard" | "foodlog" | "habits" | "analytics" | "library" | "health";

interface NavigationProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
}) => {
  const { selectedDate, setSelectedDate, resetToSampleData } = useTracker();

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "foodlog", label: "Daily Food Log", icon: UtensilsCrossed },
    { id: "habits", label: "Habits & Activity", icon: Activity },
    { id: "analytics", label: "Trends & Analytics", icon: TrendingUp },
    { id: "library", label: "Food Library", icon: BookOpen },
    { id: "health", label: "Health & Labs", icon: HeartPulse },
  ] as const;

  return (
    <header className="bg-white text-slate-900 shadow-sm border-b border-slate-200 sticky top-0 z-30">
      {/* Top Banner Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between py-3.5 gap-3">
          
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
              <Activity className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
                NutriMetric <span className="text-xs px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-semibold border border-blue-200">Pro</span>
              </h1>
              <p className="text-xs text-slate-500 hidden sm:block">
                Health, Nutrition & Performance Dashboard
              </p>
            </div>
          </div>

          {/* Quick Actions & Date Picker */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Selected Date Picker */}
            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-700">
              <Calendar className="w-3.5 h-3.5 mr-1.5 text-blue-600 shrink-0" />
              <span className="font-medium mr-2 text-slate-500 hidden sm:inline">Active Date:</span>
              <FormattedDateInput
                value={selectedDate}
                onChange={setSelectedDate}
                ariaLabel="Select active date"
                className="bg-transparent border-none text-slate-900 text-xs font-semibold rounded-md"
              />
            </div>

            {/* Reset Sample Data */}
            <button
              onClick={() => {
                if (confirm("Reset to default sample dataset from Excel sheets?")) {
                  resetToSampleData();
                }
              }}
              title="Reset sample data"
              className="p-2 text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl text-xs transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Navigation Navigation Bar */}
        <nav className="flex space-x-1.5 overflow-x-auto scrollbar-none py-2 border-t border-slate-100 text-xs font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
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
