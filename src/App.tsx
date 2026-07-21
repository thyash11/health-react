import React, { useEffect, useState } from "react";
import { TrackerProvider } from "./context/TrackerContext";
import { Navigation, TabType } from "./components/Navigation";
import { DashboardView } from "./components/dashboard/DashboardView";
import { DailyFoodLogView } from "./components/foodlog/DailyFoodLogView";
import { HabitsView } from "./components/habits/HabitsView";
import { AnalyticsView } from "./components/analytics/AnalyticsView";
import { FoodLibraryView } from "./components/foodlibrary/FoodLibraryView";
import { HealthLabsView } from "./components/health/HealthLabsView";

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");

  useEffect(() => {
    localStorage.removeItem("nutrimetric_openai_settings_v1");
    sessionStorage.removeItem("nutrimetric_openai_key_session_v1");
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
          <DailyFoodLogView />
        )}

        {activeTab === "habits" && <HabitsView />}

        {activeTab === "analytics" && <AnalyticsView />}

        {activeTab === "library" && <FoodLibraryView />}

        {activeTab === "health" && <HealthLabsView />}
      </main>

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
