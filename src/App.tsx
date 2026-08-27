import React, { useEffect, useRef, useState } from "react";
import { TrackerProvider } from "./context/TrackerContext";
import { Navigation, PRIMARY_NAV_TABS, TabType } from "./components/Navigation";
import { DashboardView } from "./components/dashboard/DashboardView";
import { DailyFoodLogView } from "./components/foodlog/DailyFoodLogView";
import { HabitsView } from "./components/habits/HabitsView";
import { AnalyticsView } from "./components/analytics/AnalyticsView";
import { FoodLibraryView } from "./components/foodlibrary/FoodLibraryView";
import { HealthLabsView } from "./components/health/HealthLabsView";
import { SettingsView } from "./components/settings/SettingsView";
import { FoodCategoriesView } from "./components/categories/FoodCategoriesView";
import { ListChecks, Settings, Tags } from "lucide-react";
import { FoodItem } from "./types";
import { EatMeRawView } from "./components/eatme/EatMeRawView";
import { shouldSkipPageBackForOverlay } from "./hooks/useBrowserBackDismiss";
import { useSwipeNavigation } from "./hooks/useSwipeNavigation";

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard");
  const [foodLogDraft, setFoodLogDraft] = useState<FoodItem | null>(null);
  const [openFoodLogRequest, setOpenFoodLogRequest] = useState<number | null>(null);
  const activeTabRef = useRef<TabType>("dashboard");
  const hasDashboardHistoryEntry = useRef(false);
  const dashboardScrollPosition = useRef(0);
  const rawScrollPosition = useRef(0);
  const [pendingScrollRestore, setPendingScrollRestore] = useState<number | null>(null);

  const openTab = (tab: Exclude<TabType, "dashboard">) => {
    const currentTab = activeTabRef.current;

    if (currentTab === "eatmeraw") {
      rawScrollPosition.current = window.scrollY;
    }

    if (currentTab === "dashboard") {
      dashboardScrollPosition.current = window.scrollY;
      window.history.pushState(
        { ...window.history.state, nutrimetricTab: tab },
        "",
        window.location.href,
      );
      hasDashboardHistoryEntry.current = true;
    } else {
      window.history.replaceState(
        { ...window.history.state, nutrimetricTab: tab },
        "",
        window.location.href,
      );
    }

    activeTabRef.current = tab;
    setActiveTab(tab);
  };

  const goToDashboard = () => {
    if (activeTabRef.current === "dashboard") return;

    if (activeTabRef.current === "eatmeraw") {
      rawScrollPosition.current = window.scrollY;
    }

    activeTabRef.current = "dashboard";
    setActiveTab("dashboard");
    setPendingScrollRestore(dashboardScrollPosition.current);

    if (hasDashboardHistoryEntry.current) {
      hasDashboardHistoryEntry.current = false;
      window.history.back();
    } else {
      window.history.replaceState(
        { ...window.history.state, nutrimetricTab: "dashboard" },
        "",
        window.location.href,
      );
    }
  };

  const openFoodLogForm = () => {
    setFoodLogDraft(null);
    setOpenFoodLogRequest(Date.now());
    openTab("foodlog");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openEatMeRaw = () => {
    openTab("eatmeraw");
    setPendingScrollRestore(rawScrollPosition.current);
  };

  const closeEatMeRaw = () => {
    goToDashboard();
  };

  const navigateToTab = (tab: TabType) => {
    if (tab === "dashboard") {
      goToDashboard();
      return;
    }

    const leavingEatMeRaw = activeTabRef.current === "eatmeraw";
    openTab(tab);
    if (leavingEatMeRaw) setPendingScrollRestore(0);
  };

  const swipeToAdjacentNavigationTab = (offset: -1 | 1) => {
    const currentIndex = PRIMARY_NAV_TABS.findIndex((tab) => tab === activeTabRef.current);
    if (currentIndex < 0) return;

    const nextTab = PRIMARY_NAV_TABS[currentIndex + offset];
    if (!nextTab) return;

    navigateToTab(nextTab);
    if (nextTab !== "dashboard") {
      window.scrollTo({ top: 0, behavior: "auto" });
    }
  };

  const swipeNavigationHandlers = useSwipeNavigation({
    enabled: PRIMARY_NAV_TABS.some((tab) => tab === activeTab),
    onSwipeLeft: () => swipeToAdjacentNavigationTab(1),
    onSwipeRight: () => swipeToAdjacentNavigationTab(-1),
  });

  useEffect(() => {
    if (pendingScrollRestore === null) return;
    const frame = window.requestAnimationFrame(() => {
      window.scrollTo({ top: pendingScrollRestore, behavior: "auto" });
      setPendingScrollRestore(null);
    });
    return () => window.cancelAnimationFrame(frame);
  }, [activeTab, pendingScrollRestore]);

  useEffect(() => {
    window.history.replaceState(
      { ...window.history.state, nutrimetricTab: "dashboard" },
      "",
      window.location.href,
    );

    const handleBrowserBack = () => {
      if (shouldSkipPageBackForOverlay()) return;

      if (activeTabRef.current === "eatmeraw") {
        rawScrollPosition.current = window.scrollY;
      }

      activeTabRef.current = "dashboard";
      hasDashboardHistoryEntry.current = false;
      setActiveTab("dashboard");
      setPendingScrollRestore(dashboardScrollPosition.current);

      if (window.history.state?.nutrimetricTab !== "dashboard") {
        window.history.replaceState(
          { ...window.history.state, nutrimetricTab: "dashboard" },
          "",
          window.location.href,
        );
      }
    };

    window.addEventListener("popstate", handleBrowserBack);
    return () => window.removeEventListener("popstate", handleBrowserBack);
  }, []);

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
        setActiveTab={navigateToTab}
      />

      {/* Main Content Area */}
      <main
        {...swipeNavigationHandlers}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6"
      >
        {activeTab === "dashboard" && (
          <DashboardView
            onNavigateToFoodLog={openFoodLogForm}
          />
        )}

        {activeTab === "foodlog" && (
          <DailyFoodLogView
            prefillFood={foodLogDraft}
            onPrefillConsumed={() => setFoodLogDraft(null)}
            openAddRequest={openFoodLogRequest}
            onOpenAddConsumed={() => setOpenFoodLogRequest(null)}
          />
        )}

        {activeTab === "habits" && <HabitsView />}

        {activeTab === "analytics" && <AnalyticsView />}

        {activeTab === "library" && (
          <FoodLibraryView
            onLogFood={(food) => {
              setFoodLogDraft(food);
              openTab("foodlog");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
          />
        )}

        {activeTab === "health" && <HealthLabsView />}

        {activeTab === "settings" && <SettingsView />}

        {activeTab === "categories" && <FoodCategoriesView />}

        {activeTab === "eatmeraw" && (
          <EatMeRawView onBack={closeEatMeRaw} />
        )}
      </main>

      {activeTab !== "eatmeraw" && (
        <button
          type="button"
          onClick={openEatMeRaw}
          aria-label="Open Eat Me Raw"
          title="Eat Me Raw"
          className={`fixed right-4 z-50 flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500 bg-emerald-600 text-white shadow-xl shadow-emerald-950/20 transition hover:bg-emerald-700 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-emerald-200 sm:right-6 ${
            activeTab === "dashboard" ? "bottom-[104px] sm:bottom-28" : "bottom-5 sm:bottom-6"
          }`}
        >
          <ListChecks className="h-6 w-6" />
        </button>
      )}

      <footer className="mt-8 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl justify-end gap-2 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => {
              navigateToTab("categories");
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
              navigateToTab("settings");
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
