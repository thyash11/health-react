import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  PersonalTargets, 
  UserProfile, 
  FoodItem, 
  DailyLogEntry, 
  HealthMetric, 
  LabTestRecord, 
  PeriodicCheckItem 
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

interface TrackerContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  targets: PersonalTargets;
  updateTargets: (newTargets: Partial<PersonalTargets>) => void;
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
};

const loadFoodCategories = () => {
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

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDateState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_DATE) || new Date().toLocaleDateString("en-CA");
  });

  const [targets, setTargets] = useState<PersonalTargets>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TARGETS);
    return saved ? JSON.parse(saved) : initialTargets;
  });

  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [foodLibrary, setFoodLibrary] = useState<FoodItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOOD_LIBRARY);
    return saved ? JSON.parse(saved) : initialFoodLibrary;
  });

  const [dailyLogs, setDailyLogs] = useState<DailyLogEntry[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DAILY_LOGS);
    return saved ? JSON.parse(saved) : initialDailyLogs;
  });

  const [healthMetrics, setHealthMetrics] = useState<HealthMetric[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HEALTH_METRICS);
    return saved ? JSON.parse(saved) : initialHealthMetrics;
  });

  const [labTests, setLabTests] = useState<LabTestRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LAB_TESTS);
    return saved ? JSON.parse(saved) : initialLabTests;
  });

  const [periodicChecks] = useState<PeriodicCheckItem[]>(initialPeriodicChecks);
  const [foodCategories, setFoodCategories] = useState<string[]>(loadFoodCategories);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SELECTED_DATE, selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TARGETS, JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOD_LIBRARY, JSON.stringify(foodLibrary));
  }, [foodLibrary]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DAILY_LOGS, JSON.stringify(dailyLogs));
  }, [dailyLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HEALTH_METRICS, JSON.stringify(healthMetrics));
  }, [healthMetrics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAB_TESTS, JSON.stringify(labTests));
  }, [labTests]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOOD_CATEGORIES, JSON.stringify(foodCategories));
  }, [foodCategories]);

  const setSelectedDate = (date: string) => {
    setSelectedDateState(date);
  };

  const updateTargets = (newTargets: Partial<PersonalTargets>) => {
    setTargets((prev) => ({ ...prev, ...newTargets }));
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
    setDailyLogs((prev) => [...prev, newEntry]);
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
    setDailyLogs((prev) => [...prev, ...newEntries]);
    return true;
  };

  const updateLogEntry = (id: string, entry: Partial<DailyLogEntry>) => {
    setDailyLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...entry } : l)));
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

  return (
    <TrackerContext.Provider
      value={{
        selectedDate,
        setSelectedDate,
        targets,
        updateTargets,
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
