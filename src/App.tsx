import React, { useEffect, useState } from "react";
import { TrackerProvider } from "./context/TrackerContext";
import { Navigation, TabType } from "./components/Navigation";
import { DashboardView } from "./components/dashboard/DashboardView";
import { DailyFoodLogView } from "./components/foodlog/DailyFoodLogView";
import { HabitsView } from "./components/habits/HabitsView";
import { AnalyticsView } from "./components/analytics/AnalyticsView";
import { FoodLibraryView } from "./components/foodlibrary/FoodLibraryView";
import { HealthLabsView } from "./components/health/HealthLabsView";
import { SettingsView } from "./components/settings/SettingsView";
import { FoodCategoriesView } from "./components/categories/FoodCategoriesView";
import { Settings, Tags } from "lucide-react";
import { FoodItem } from "./types";

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [foodLogDraft, setFoodLogDraft] = useState<FoodItem | null>(null);

  useEffect(() => {
    localStorage.removeItem("nutrimetric_openai_settings_v1");
    sessionStorage.removeItem("nutrimetric_openai_key_session_v1");
    localStorage.removeItem("health_tracker_habits_v1");
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Navigation Header */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "dashboard" && (
          <DashboardView
            onNavigateToFoodLog={() => setActiveTab("foodlog")}
          />
        )}

        {activeTab === "foodlog" && (
          <DailyFoodLogView
            prefillFood={foodLogDraft}
            onPrefillConsumed={() => setFoodLogDraft(null)}
          />
        )}

        {activeTab === "habits" && <HabitsView />}

        {activeTab === "analytics" && <AnalyticsView />}

        {activeTab === "library" && (
          <FoodLibraryView
            onLogFood={(food) => {
              setFoodLogDraft(food);
              setActiveTab("foodlog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeTab === "health" && <HealthLabsView />}

        {activeTab === "settings" && <SettingsView />}

        {activeTab === "categories" && <FoodCategoriesView />}
      </main>

      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl justify-end gap-2 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => {
              setActiveTab("categories");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
              activeTab === "categories" ? "bg-blue-50 text-blue-700" : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Tags className="h-4 w-4" />
            <span>Food Categories</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("settings");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            aria-label="Open settings"
            title="Settings"
            className={`flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
              activeTab === "settings"
                ? "bg-blue-50 text-blue-700"
                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
            }`}
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </button>
        </div>
      </footer>

    </div>
  );
}

export default function App() {
  return (
    <TrackerProvider>
      <MainApp />
    </TrackerProvider>
  );
}
