import {
  DailyLogEntry,
  FoodItem,
  HealthMetric,
  LabTestRecord,
  PeriodicCheckItem,
  PersonalTargets,
  UserProfile,
} from "../types";

// A fresh browser starts empty. Users can configure targets and profile details
// in Health & Labs or restore a previously exported JSON backup in Settings.
export const initialTargets: PersonalTargets = {
  dailyCalories: 0,
  proteinGrams: 0,
  fiberGrams: 0,
  waterMl: 0,
  walkKm: 0,
  sleepHours: 0,
  goalWeightKg: 0,
  currentWeightKg: 0,
  heightCm: 0,
  waistInch: 0,
};

export const initialProfile: UserProfile = {
  age: 0,
  occupation: "",
  familyHistory: "",
  smokingAlcohol: "",
  mainGoals: "",
  mealPattern: "",
  notes: "",
};

export const initialFoodLibrary: FoodItem[] = [];
export const initialDailyLogs: DailyLogEntry[] = [];
export const initialHealthMetrics: HealthMetric[] = [];
export const initialLabTests: LabTestRecord[] = [];
export const initialPeriodicChecks: PeriodicCheckItem[] = [
  {
    id: "pc-1",
    checkName: "Weight",
    lastDate: "2026-07-15",
    frequency: "Weekly",
    notes: "Same conditions (fasted morning)",
  },
  {
    id: "pc-2",
    checkName: "Waist Circumference",
    lastDate: "2026-07-15",
    frequency: "Monthly",
    notes: "Measure around navel level",
  },
  {
    id: "pc-3",
    checkName: "Blood Pressure",
    lastDate: "2026-07-15",
    frequency: "Monthly",
    notes: "Track when measured at clinic/home",
  },
  {
    id: "pc-4",
    checkName: "HbA1c / Fasting Glucose",
    lastDate: "2026-07-15",
    frequency: "Quarterly",
    notes: "Enter from formal lab report",
  },
  {
    id: "pc-5",
    checkName: "Full Lipid Profile",
    lastDate: "2026-07-15",
    frequency: "Bi-annually",
    notes: "Enter LDL and triglycerides when available",
  },
  {
    id: "pc-6",
    checkName: "Vitamin D / B12",
    lastDate: "2026-07-15",
    frequency: "Annually",
    notes: "Only when tested",
  },
];
