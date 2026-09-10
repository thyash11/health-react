import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  PersonalTargets, 
  UserProfile, 
  FoodItem, 
  DailyLogEntry, 
  HealthMetric, 
  LabTestRecord, 
  PeriodicCheckItem,
  TargetHistoryEntry,
} from "../types";
import { 
  initialTargets, 
  initialProfile, 
  initialFoodLibrary, 
  initialDailyLogs, 
  initialHealthMetrics, 
  initialLabTests, 
  initialPeriodicChecks 
} from "../data/initialData";
import { FOOD_CATEGORIES } from "../constants/foodOptions";
import { formatDateForDisplay } from "../utils/nutritionCalculator";
import { sortDailyLogs } from "../utils/logSorting";
import { createDefaultEatMePlan } from "../data/defaultEatMePlan";
import { EatMeFoodMapping, EatMePlan, EatMeRawTick } from "../types/eatMe";
import { getLatestWeightGoalRevisionDate, resolveTargetsForDate, upsertTargetRevision } from "../utils/targetHistory";
import { getTrackerStorageBackend, persistStorageValue, readStorageValues } from "../utils/browserStorage";

interface TrackerContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  targets: PersonalTargets;
  updateTargets: (newTargets: Partial<PersonalTargets>) => void;
  getTargetsForDate: (date: string) => PersonalTargets;
  getWeightGoalRevisionDateForDate: (date: string) => string | undefined;
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  foodLibrary: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, "id">) => boolean;
  addBatchFoodItems: (items: Omit<FoodItem, "id">[]) => boolean;
  updateFoodItem: (id: string, item: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleFavoriteFood: (id: string) => void;
  dailyLogs: DailyLogEntry[];
  addLogEntry: (entry: Omit<DailyLogEntry, "id">) => boolean;
  addBatchLogEntries: (entries: Omit<DailyLogEntry, "id">[]) => boolean;
  updateLogEntry: (id: string, entry: Partial<DailyLogEntry>) => void;
  deleteLogEntry: (id: string) => void;
  clearDateLogs: (date: string) => void;
  healthMetrics: HealthMetric[];
  addHealthMetric: (metric: Omit<HealthMetric, "id">) => boolean;
  deleteHealthMetric: (id: string) => void;
  labTests: LabTestRecord[];
  addLabTest: (test: Omit<LabTestRecord, "id">) => boolean;
  updateLabTest: (id: string, test: Partial<LabTestRecord>) => void;
  deleteLabTest: (id: string) => void;
  periodicChecks: PeriodicCheckItem[];
  foodCategories: string[];
  addFoodCategory: (name: string) => boolean;
  renameFoodCategory: (currentName: string, newName: string) => void;
  deleteFoodCategory: (name: string) => void;
  eatMePlan: EatMePlan;
  eatMeMappings: EatMeFoodMapping[];
  eatMeRawTicks: EatMeRawTick[];
  toggleEatMeRawTick: (month: string, itemId: string, week: number) => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TARGETS: "health_tracker_targets_v1",
  PROFILE: "health_tracker_profile_v1",
  FOOD_LIBRARY: "health_tracker_food_lib_v1",
  DAILY_LOGS: "health_tracker_logs_v1",
  HEALTH_METRICS: "health_tracker_health_metrics_v1",
  LAB_TESTS: "health_tracker_lab_tests_v1",
  SELECTED_DATE: "health_tracker_selected_date_v1",
  FOOD_CATEGORIES: "health_tracker_food_categories_v1",
  EAT_ME_PLAN: "health_tracker_eat_me_plan_v1",
  EAT_ME_MAPPINGS: "health_tracker_eat_me_mappings_v1",
  EAT_ME_RAW_TICKS: "health_tracker_eat_me_raw_ticks_v1",
  TARGET_HISTORY: "health_tracker_target_history_v1",
};

const parseStoredJson = <T,>(storedValue: string | null | undefined, fallback: T): T => {
  try {
    return storedValue ? JSON.parse(storedValue) as T : fallback;
  } catch {
    return fallback;
  }
};

const loadJson = <T,>(key: string, fallback: T): T => (
  getTrackerStorageBackend() === "indexeddb"
    ? fallback
    : parseStoredJson(localStorage.getItem(key), fallback)
);

const loadFoodCategories = () => {
  if (getTrackerStorageBackend() === "indexeddb") return [...FOOD_CATEGORIES];
  const saved = localStorage.getItem(STORAGE_KEYS.FOOD_CATEGORIES);
  if (saved) {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed) && parsed.every((value) => typeof value === "string")) return parsed;
  }

  const discovered = new Set<string>(FOOD_CATEGORIES);
  [STORAGE_KEYS.FOOD_LIBRARY, STORAGE_KEYS.DAILY_LOGS].forEach((key) => {
    try {
      const records = JSON.parse(localStorage.getItem(key) || "[]");
      if (Array.isArray(records)) records.forEach((record) => {
        if (typeof record?.category === "string") discovered.add(record.category);
      });
    } catch {
      // Invalid stored records are handled by their existing loaders.
    }
  });
  return [...discovered];
};

const currentLocalDate = () => new Date().toLocaleDateString("en-CA");

const earliestTrackedDate = () => {
  const dates: string[] = [];
  [STORAGE_KEYS.DAILY_LOGS, STORAGE_KEYS.HEALTH_METRICS].forEach((key) => {
    const records = loadJson<Array<{ date?: unknown }>>(key, []);
    records.forEach((record) => {
      if (typeof record.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(record.date)) dates.push(record.date);
    });
  });
  return dates.sort()[0] || currentLocalDate();
};

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usesIndexedDb] = useState(() => getTrackerStorageBackend() === "indexeddb");
  const [storageReady, setStorageReady] = useState(!usesIndexedDb);
  const [storageLoadError, setStorageLoadError] = useState<string>();
  const [selectedDate, setSelectedDateState] = useState<string>(currentLocalDate);

  const [targets, setTargets] = useState<PersonalTargets>(() => {
    const saved = loadJson<Partial<PersonalTargets>>(STORAGE_KEYS.TARGETS, {});
    return { ...initialTargets, ...saved };
  });

  const [targetHistory, setTargetHistory] = useState<TargetHistoryEntry[]>(() => {
    const saved = loadJson<TargetHistoryEntry[]>(STORAGE_KEYS.TARGET_HISTORY, []);
    const valid = saved
      .filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry?.effectiveDate) && typeof entry?.targets === "object")
      .map((entry) => ({ ...entry, targets: { ...initialTargets, ...entry.targets } }))
      .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
    return valid.length > 0
      ? valid
      : [{ effectiveDate: earliestTrackedDate(), targets }];
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    return loadJson(STORAGE_KEYS.PROFILE, initialProfile);
  });

  const [foodLibrary, setFoodLibrary] = useState<FoodItem[]>(() => {
    return loadJson(STORAGE_KEYS.FOOD_LIBRARY, initialFoodLibrary);
  });

  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>(() => {
    return sortDailyLogs(loadJson(STORAGE_KEYS.DAILY_LOGS, initialDailyLogs));
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(() => {
    return loadJson(STORAGE_KEYS.HEALTH_METRICS, initialHealthMetrics);
  });

  const [labTests, setLabTests] = useState<LabTestRecord[]>(() => {
    return loadJson(STORAGE_KEYS.LAB_TESTS, initialLabTests);
  });

  const [periodicChecks] = useState<PeriodicCheckItem[]>(initialPeriodicChecks);
  const [foodCategories, setFoodCategories] = useState<string[]>(loadFoodCategories);
  const [eatMePlan, setEatMePlan] = useState<EatMePlan>(() => loadJson(STORAGE_KEYS.EAT_ME_PLAN, createDefaultEatMePlan()));
  const [eatMeMappings, setEatMeMappings] = useState<EatMeFoodMapping[]>(() => loadJson(STORAGE_KEYS.EAT_ME_MAPPINGS, []));
  const [eatMeRawTicks, setEatMeRawTicks] = useState<EatMeRawTick[]>(() => loadJson(STORAGE_KEYS.EAT_ME_RAW_TICKS, []));

  useEffect(() => {
    if (!usesIndexedDb) return;
    let cancelled = false;

    const hydrateFromIndexedDb = async () => {
      try {
        const stored = await readStorageValues(Object.values(STORAGE_KEYS));
        const nextTargets = {
          ...initialTargets,
          ...parseStoredJson<Partial<PersonalTargets>>(stored[STORAGE_KEYS.TARGETS], {}),
        };
        const nextFoodLibrary = parseStoredJson<FoodItem[]>(stored[STORAGE_KEYS.FOOD_LIBRARY], initialFoodLibrary);
        const nextDailyLogs = sortDailyLogs(
          parseStoredJson<DailyLogEntry[]>(stored[STORAGE_KEYS.DAILY_LOGS], initialDailyLogs),
        );
        const nextHealthMetrics = parseStoredJson<HealthMetric[]>(
          stored[STORAGE_KEYS.HEALTH_METRICS],
          initialHealthMetrics,
        );
        const storedCategories = parseStoredJson<unknown>(stored[STORAGE_KEYS.FOOD_CATEGORIES], null);
        const discoveredCategories = new Set<string>(FOOD_CATEGORIES);
        [...nextFoodLibrary, ...nextDailyLogs].forEach((record) => {
          if (typeof record.category === "string") discoveredCategories.add(record.category);
        });
        const nextFoodCategories = Array.isArray(storedCategories) &&
          storedCategories.every((value) => typeof value === "string")
          ? storedCategories
          : [...discoveredCategories];
        const storedTargetHistory = parseStoredJson<TargetHistoryEntry[]>(stored[STORAGE_KEYS.TARGET_HISTORY], []);
        const validTargetHistory = storedTargetHistory
          .filter((entry) => /^\d{4}-\d{2}-\d{2}$/.test(entry?.effectiveDate) && typeof entry?.targets === "object")
          .map((entry) => ({ ...entry, targets: { ...initialTargets, ...entry.targets } }))
          .sort((a, b) => a.effectiveDate.localeCompare(b.effectiveDate));
        const earliestDate = [...nextDailyLogs, ...nextHealthMetrics]
          .map((record) => record.date)
          .filter((date) => /^\d{4}-\d{2}-\d{2}$/.test(date))
          .sort()[0] || currentLocalDate();

        if (cancelled) return;
        setTargets(nextTargets);
        setTargetHistory(validTargetHistory.length > 0
          ? validTargetHistory
          : [{ effectiveDate: earliestDate, targets: nextTargets }]);
        setProfile(parseStoredJson<UserProfile>(stored[STORAGE_KEYS.PROFILE], initialProfile));
        setFoodLibrary(nextFoodLibrary);
        setDailyLogs(nextDailyLogs);
        setHealthMetrics(nextHealthMetrics);
        setLabTests(parseStoredJson<LabTestRecord[]>(stored[STORAGE_KEYS.LAB_TESTS], initialLabTests));
        setFoodCategories(nextFoodCategories);
        setEatMePlan(parseStoredJson<EatMePlan>(stored[STORAGE_KEYS.EAT_ME_PLAN], createDefaultEatMePlan()));
        setEatMeMappings(parseStoredJson<EatMeFoodMapping[]>(stored[STORAGE_KEYS.EAT_ME_MAPPINGS], []));
        setEatMeRawTicks(parseStoredJson<EatMeRawTick[]>(stored[STORAGE_KEYS.EAT_ME_RAW_TICKS], []));
        setStorageReady(true);
      } catch (error) {
        if (!cancelled) {
          setStorageLoadError(error instanceof Error ? error.message : "Could not load IndexedDB data.");
        }
      }
    };

    void hydrateFromIndexedDb();
    return () => {
      cancelled = true;
    };
  }, [usesIndexedDb]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.SELECTED_DATE, selectedDate);
  }, [selectedDate, storageReady]);

  useEffect(() => {
    let lastVisibleDate = currentLocalDate();
    const syncDateAfterDayChange = () => {
      if (document.visibilityState !== "visible") return;
      const today = currentLocalDate();
      if (today === lastVisibleDate) return;
      lastVisibleDate = today;
      setSelectedDateState(today);
    };

    document.addEventListener("visibilitychange", syncDateAfterDayChange);
    return () => document.removeEventListener("visibilitychange", syncDateAfterDayChange);
  }, []);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
  }, [storageReady, targets]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.TARGET_HISTORY, JSON.stringify(targetHistory));
  }, [storageReady, targetHistory]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.FOOD_LIBRARY, JSON.stringify(foodLibrary));
  }, [foodLibrary, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(dailyLogs));
  }, [dailyLogs, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.HEALTH_METRICS, JSON.stringify(healthMetrics));
  }, [healthMetrics, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.LAB_TESTS, JSON.stringify(labTests));
  }, [labTests, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.FOOD_CATEGORIES, JSON.stringify(foodCategories));
  }, [foodCategories, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.EAT_ME_PLAN, JSON.stringify(eatMePlan));
  }, [eatMePlan, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.EAT_ME_MAPPINGS, JSON.stringify(eatMeMappings));
  }, [eatMeMappings, storageReady]);

  useEffect(() => {
    if (!storageReady) return;
    persistStorageValue(STORAGE_KEYS.EAT_ME_RAW_TICKS, JSON.stringify(eatMeRawTicks));
  }, [eatMeRawTicks, storageReady]);

  const setSelectedDate = (date: string) => {
    setSelectedDateState(date);
  };

  const updateTargets = (newTargets: Partial<PersonalTargets>) => {
    const nextTargets = { ...targets, ...newTargets };
    const effectiveDate = new Date().toLocaleDateString("en-CA");
    setTargets(nextTargets);
    setTargetHistory((previous) => upsertTargetRevision(previous, effectiveDate, nextTargets));
  };

  const getTargetsForDate = (date: string) => {
    return { ...initialTargets, ...resolveTargetsForDate(targetHistory, date, targets) };
  };

  const getWeightGoalRevisionDateForDate = (date: string) => {
    return getLatestWeightGoalRevisionDate(targetHistory, date);
  };

  const updateProfile = (newProfile: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...newProfile }));
  };

  const addFoodItem = (item: Omit<FoodItem, "id">) => {
    if (!window.confirm(`Add “${item.name}” to the Food Library?`)) return false;
    const newItem: FoodItem = {
      ...item,
      id: "food-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    };
    setFoodLibrary((prev) => [...prev, newItem]);
    return true;
  };

  const addBatchFoodItems = (items: Omit<FoodItem, "id">[]) => {
    if (!window.confirm(`Add ${items.length} food-library ${items.length === 1 ? "item" : "items"}?`)) return false;
    const timestamp = Date.now();
    const newItems: FoodItem[] = items.map((item, index) => ({
      ...item,
      id: `food-${timestamp}-${index}-${Math.random().toString(36).substring(2, 6)}`,
    }));
    setFoodLibrary((previous) => [...previous, ...newItems]);
    return true;
  };

  const updateFoodItem = (id: string, item: Partial<FoodItem>) => {
    setFoodLibrary((prev) => prev.map((f) => (f.id === id ? { ...f, ...item } : f)));
  };

  const deleteFoodItem = (id: string) => {
    const item = foodLibrary.find((food) => food.id === id);
    if (!window.confirm(`Delete ${item?.name || "this food item"}? This action cannot be undone.`)) return;
    setFoodLibrary((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleFavoriteFood = (id: string) => {
    setFoodLibrary((prev) => prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)));
  };

  const addLogEntry = (entry: Omit<DailyLogEntry, "id">) => {
    if (!window.confirm(`Add ${entry.foodItem} to ${formatDateForDisplay(entry.date)}?`)) return false;
    const newEntry: DailyLogEntry = {
      ...entry,
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    };
    setDailyLogs((prev) => sortDailyLogs([...prev, newEntry]));
    return true;
  };

  const addBatchLogEntries = (entries: Omit<DailyLogEntry, "id">[]) => {
    const dates = [...new Set(entries.map((entry) => formatDateForDisplay(entry.date)))];
    const dateDescription = dates.length === 1 ? dates[0] : `${dates.length} different dates`;
    if (!window.confirm(`Import ${entries.length} food-log ${entries.length === 1 ? "entry" : "entries"} for ${dateDescription}?`)) return false;
    const newEntries: DailyLogEntry[] = entries.map((entry, idx) => ({
      ...entry,
      id: "log-" + Date.now() + "-" + idx + "-" + Math.random().toString(36).substring(2, 6),
    }));
    setDailyLogs((prev) => sortDailyLogs([...prev, ...newEntries]));
    return true;
  };

  const updateLogEntry = (id: string, entry: Partial<DailyLogEntry>) => {
    setDailyLogs((prev) => sortDailyLogs(prev.map((l) => (l.id === id ? { ...l, ...entry } : l))));
  };

  const deleteLogEntry = (id: string) => {
    const entry = dailyLogs.find((log) => log.id === id);
    const description = entry ? `${entry.foodItem} from ${formatDateForDisplay(entry.date)}` : "this food-log entry";
    if (!window.confirm(`Delete ${description}? This action cannot be undone.`)) return;
    setDailyLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const clearDateLogs = (date: string) => {
    if (!window.confirm(`Delete every food-log entry for ${formatDateForDisplay(date)}? This action cannot be undone.`)) return;
    setDailyLogs((prev) => prev.filter((l) => l.date !== date));
  };

  const addHealthMetric = (metric: Omit<HealthMetric, "id">) => {
    if (!window.confirm(`Add the health measurement for ${formatDateForDisplay(metric.date)}?`)) return false;
    const newMetric: HealthMetric = {
      ...metric,
      id: "hm-" + Date.now(),
    };
    setHealthMetrics((prev) => [newMetric, ...prev]);
    return true;
  };

  const deleteHealthMetric = (id: string) => {
    const metric = healthMetrics.find((item) => item.id === id);
    if (!window.confirm(`Delete the health measurement${metric ? ` from ${formatDateForDisplay(metric.date)}` : ""}? This action cannot be undone.`)) return;
    setHealthMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  const addLabTest = (test: Omit<LabTestRecord, "id">) => {
    if (!window.confirm(`Add ${test.testName} for ${formatDateForDisplay(test.date)}?`)) return false;
    const newTest: LabTestRecord = {
      ...test,
      id: "lt-" + Date.now(),
    };
    setLabTests((prev) => [newTest, ...prev]);
    return true;
  };

  const updateLabTest = (id: string, test: Partial<LabTestRecord>) => {
    setLabTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...test } : t)));
  };

  const deleteLabTest = (id: string) => {
    const test = labTests.find((item) => item.id === id);
    const description = test ? `${test.testName} from ${formatDateForDisplay(test.date)}` : "this lab-test record";
    if (!window.confirm(`Delete ${description}? This action cannot be undone.`)) return;
    setLabTests((prev) => prev.filter((t) => t.id !== id));
  };

  const normalizedCategoryName = (name: string) => name.trim().replace(/\s+/g, " ");

  const addFoodCategory = (name: string) => {
    const normalized = normalizedCategoryName(name);
    if (!normalized) throw new Error("Category name is required.");
    if (foodCategories.some((item) => item.toLowerCase() === normalized.toLowerCase())) {
      throw new Error("That category already exists.");
    }
    if (!window.confirm(`Add the “${normalized}” food category?`)) return false;
    setFoodCategories((previous) => [...previous, normalized]);
    return true;
  };

  const renameFoodCategory = (currentName: string, newName: string) => {
    const normalized = normalizedCategoryName(newName);
    if (!normalized) throw new Error("Category name is required.");
    if (foodCategories.some((item) => item !== currentName && item.toLowerCase() === normalized.toLowerCase())) {
      throw new Error("That category already exists.");
    }
    setFoodCategories((previous) => previous.map((item) => item === currentName ? normalized : item));
    setFoodLibrary((previous) => previous.map((item) => item.category === currentName ? { ...item, category: normalized } : item));
    setDailyLogs((previous) => previous.map((item) => item.category === currentName ? { ...item, category: normalized } : item));
  };

  const deleteFoodCategory = (name: string) => {
    const isUsed = foodLibrary.some((item) => item.category === name) || dailyLogs.some((item) => item.category === name);
    if (isUsed) throw new Error("This category is in use and cannot be deleted.");
    if (!window.confirm(`Delete the “${name}” category? This action cannot be undone.`)) return;
    setFoodCategories((previous) => previous.filter((item) => item !== name));
  };

  const toggleEatMeRawTick = (month: string, itemId: string, week: number) => {
    if (week < 1 || week > 5) return;
    setEatMeRawTicks((previous) => {
      const existing = previous.find((item) => item.month === month && item.itemId === itemId);
      if (!existing) return [...previous, { month, itemId, weeks: [week] }];
      const weeks = existing.weeks.includes(week)
        ? existing.weeks.filter((value) => value !== week)
        : [...existing.weeks, week].sort();
      return weeks.length
        ? previous.map((item) => item === existing ? { ...item, weeks } : item)
        : previous.filter((item) => item !== existing);
    });
  };

  if (storageLoadError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-center">
        <div className="max-w-md rounded-2xl border border-red-200 bg-white p-6 shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">Could not open NutriMetric data</h1>
          <p className="mt-2 text-sm text-red-700">{storageLoadError}</p>
          <p className="mt-3 text-xs leading-5 text-slate-500">Close other NutriMetric windows and reload the app. Your migrated data has not been reset.</p>
        </div>
      </div>
    );
  }

  if (!storageReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-6 text-sm font-medium text-slate-600">
        Opening NutriMetric data…
      </div>
    );
  }

  return (
    <TrackerContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        targets,
        updateTargets,
        getTargetsForDate,
        getWeightGoalRevisionDateForDate,
        profile,
        updateProfile,
        foodLibrary,
        addFoodItem,
        addBatchFoodItems,
        updateFoodItem,
        deleteFoodItem,
        toggleFavoriteFood,
        dailyLogs,
        addLogEntry,
        addBatchLogEntries,
        updateLogEntry,
        deleteLogEntry,
        clearDateLogs,
        healthMetrics,
        addHealthMetric,
        deleteHealthMetric,
        labTests,
        addLabTest,
        updateLabTest,
        deleteLabTest,
        periodicChecks,
        foodCategories,
        addFoodCategory,
        renameFoodCategory,
        deleteFoodCategory,
        eatMePlan,
        eatMeMappings,
        eatMeRawTicks,
        toggleEatMeRawTick,
      }}
    >
      {children}
    </TrackerContext.Provider>
  );
};

export const useTracker = () => {
  const context = useContext(TrackerContext);
  if (!context) {
    throw new Error("useTracker must be used within a TrackerProvider");
  }
  return context;
};
