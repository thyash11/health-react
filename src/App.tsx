import React, { useState } from "react";
import { TrackerProvider } from "./context/TrackerContext";
import { Navigation, TabType } from "./components/Navigation";
import { DashboardView } from "./components/dashboard/DashboardView";
import { DailyFoodLogView } from "./components/foodlog/DailyFoodLogView";
import { HabitsView } from "./components/habits/HabitsView";
import { AnalyticsView } from "./components/analytics/AnalyticsView";
import { FoodLibraryView } from "./components/foodlibrary/FoodLibraryView";
import { HealthLabsView } from "./components/health/HealthLabsView";
import { AiMealAssistantModal } from "./components/AiMealAssistantModal";

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans antialiased selection:bg-blue-600 selection:text-white">
      
      {/* Navigation Header */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAiAssistant={() => setIsAiModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === "dashboard" && (
          <DashboardView
            onNavigateToFoodLog={() => setActiveTab("foodlog")}
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
          />
        )}

        {activeTab === "foodlog" && (
          <DailyFoodLogView
            onOpenAiAssistant={() => setIsAiModalOpen(true)}
          />
        )}

        {activeTab === "habits" && <HabitsView />}

        {activeTab === "analytics" && <AnalyticsView />}

        {activeTab === "library" && <FoodLibraryView />}

        {activeTab === "health" && <HealthLabsView />}
      </main>

      {/* AI Natural Language Meal Parser Popup Modal */}
      <AiMealAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
      />

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
