import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  PersonalTargets, 
  UserProfile, 
  FoodItem, 
  DailyLogEntry, 
  DailyHabitRecord, 
  HealthMetric, 
  LabTestRecord, 
  PeriodicCheckItem 
} from "../types";
import { 
  initialTargets, 
  initialProfile, 
  initialFoodLibrary, 
  initialDailyLogs, 
  initialHabits, 
  initialHealthMetrics, 
  initialLabTests, 
  initialPeriodicChecks 
} from "../data/initialData";

interface TrackerContextType {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  targets: PersonalTargets;
  updateTargets: (newTargets: Partial<PersonalTargets>) => void;
  profile: UserProfile;
  updateProfile: (newProfile: Partial<UserProfile>) => void;
  foodLibrary: FoodItem[];
  addFoodItem: (item: Omit<FoodItem, "id">) => void;
  updateFoodItem: (id: string, item: Partial<FoodItem>) => void;
  deleteFoodItem: (id: string) => void;
  toggleFavoriteFood: (id: string) => void;
  dailyLogs: DailyLogEntry[];
  addLogEntry: (entry: Omit<DailyLogEntry, "id">) => void;
  addBatchLogEntries: (entries: Omit<DailyLogEntry, "id">[]) => void;
  updateLogEntry: (id: string, entry: Partial<DailyLogEntry>) => void;
  deleteLogEntry: (id: string) => void;
  clearDateLogs: (date: string) => void;
  habits: DailyHabitRecord[];
  updateHabitRecord: (record: DailyHabitRecord) => void;
  healthMetrics: HealthMetric[];
  addHealthMetric: (metric: Omit<HealthMetric, "id">) => void;
  deleteHealthMetric: (id: string) => void;
  labTests: LabTestRecord[];
  addLabTest: (test: Omit<LabTestRecord, "id">) => void;
  updateLabTest: (id: string, test: Partial<LabTestRecord>) => void;
  deleteLabTest: (id: string) => void;
  periodicChecks: PeriodicCheckItem[];
  resetToSampleData: () => void;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TARGETS: "health_tracker_targets_v1",
  PROFILE: "health_tracker_profile_v1",
  FOOD_LIBRARY: "health_tracker_food_lib_v1",
  DAILY_LOGS: "health_tracker_logs_v1",
  HABITS: "health_tracker_habits_v1",
  HEALTH_METRICS: "health_tracker_health_metrics_v1",
  LAB_TESTS: "health_tracker_lab_tests_v1",
  SELECTED_DATE: "health_tracker_selected_date_v1",
};

export const TrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedDate, setSelectedDateState] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEYS.SELECTED_DATE) || "2026-07-15";
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

  const [habits, setHabits] = useState<DailyHabitRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.HABITS);
    return saved ? JSON.parse(saved) : initialHabits;
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
    localStorage.setItem(STORAGE_KEYS.HABITS, JSON.stringify(habits));
  }, [habits]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.HEALTH_METRICS, JSON.stringify(healthMetrics));
  }, [healthMetrics]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LAB_TESTS, JSON.stringify(labTests));
  }, [labTests]);

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
    const newItem: FoodItem = {
      ...item,
      id: "food-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    };
    setFoodLibrary((prev) => [...prev, newItem]);
  };

  const updateFoodItem = (id: string, item: Partial<FoodItem>) => {
    setFoodLibrary((prev) => prev.map((f) => (f.id === id ? { ...f, ...item } : f)));
  };

  const deleteFoodItem = (id: string) => {
    setFoodLibrary((prev) => prev.filter((f) => f.id !== id));
  };

  const toggleFavoriteFood = (id: string) => {
    setFoodLibrary((prev) => prev.map((f) => (f.id === id ? { ...f, isFavorite: !f.isFavorite } : f)));
  };

  const addLogEntry = (entry: Omit<DailyLogEntry, "id">) => {
    const newEntry: DailyLogEntry = {
      ...entry,
      id: "log-" + Date.now() + "-" + Math.random().toString(36).substring(2, 6),
    };
    setDailyLogs((prev) => [...prev, newEntry]);
  };

  const addBatchLogEntries = (entries: Omit<DailyLogEntry, "id">[]) => {
    const newEntries: DailyLogEntry[] = entries.map((entry, idx) => ({
      ...entry,
      id: "log-" + Date.now() + "-" + idx + "-" + Math.random().toString(36).substring(2, 6),
    }));
    setDailyLogs((prev) => [...prev, ...newEntries]);
  };

  const updateLogEntry = (id: string, entry: Partial<DailyLogEntry>) => {
    setDailyLogs((prev) => prev.map((l) => (l.id === id ? { ...l, ...entry } : l)));
  };

  const deleteLogEntry = (id: string) => {
    setDailyLogs((prev) => prev.filter((l) => l.id !== id));
  };

  const clearDateLogs = (date: string) => {
    setDailyLogs((prev) => prev.filter((l) => l.date !== date));
  };

  const updateHabitRecord = (record: DailyHabitRecord) => {
    setHabits((prev) => {
      const idx = prev.findIndex((h) => h.date === record.date);
      if (idx >= 0) {
        const updated = [...prev];
        updated[idx] = { ...updated[idx], ...record };
        return updated;
      }
      return [...prev, record];
    });
  };

  const addHealthMetric = (metric: Omit<HealthMetric, "id">) => {
    const newMetric: HealthMetric = {
      ...metric,
      id: "hm-" + Date.now(),
    };
    setHealthMetrics((prev) => [newMetric, ...prev]);
  };

  const deleteHealthMetric = (id: string) => {
    setHealthMetrics((prev) => prev.filter((m) => m.id !== id));
  };

  const addLabTest = (test: Omit<LabTestRecord, "id">) => {
    const newTest: LabTestRecord = {
      ...test,
      id: "lt-" + Date.now(),
    };
    setLabTests((prev) => [newTest, ...prev]);
  };

  const updateLabTest = (id: string, test: Partial<LabTestRecord>) => {
    setLabTests((prev) => prev.map((t) => (t.id === id ? { ...t, ...test } : t)));
  };

  const deleteLabTest = (id: string) => {
    setLabTests((prev) => prev.filter((t) => t.id !== id));
  };

  const resetToSampleData = () => {
    setSelectedDateState("2026-07-15");
    setTargets(initialTargets);
    setProfile(initialProfile);
    setFoodLibrary(initialFoodLibrary);
    setDailyLogs(initialDailyLogs);
    setHabits(initialHabits);
    setHealthMetrics(initialHealthMetrics);
    setLabTests(initialLabTests);
    localStorage.clear();
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
        updateFoodItem,
        deleteFoodItem,
        toggleFavoriteFood,
        dailyLogs,
        addLogEntry,
        addBatchLogEntries,
        updateLogEntry,
        deleteLogEntry,
        clearDateLogs,
        habits,
        updateHabitRecord,
        healthMetrics,
        addHealthMetric,
        deleteHealthMetric,
        labTests,
        addLabTest,
        updateLabTest,
        deleteLabTest,
        periodicChecks,
        resetToSampleData,
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
