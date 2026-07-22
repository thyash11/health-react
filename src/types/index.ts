import { MEAL_TYPES } from "../constants/foodOptions";

export type MealType = (typeof MEAL_TYPES)[number];
export type FoodCategory = string;

export interface FoodItem {
  id: string;
  name: string;
  category: FoodCategory;
  defaultServingGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
  fiberPer100g: number;
  waterPer100g?: number;
  isFavorite?: boolean;
}

export interface DailyLogEntry {
  id: string;
  date: string; // YYYY-MM-DD or DD-MMM-YYYY format
  meal: MealType;
  time: string; // e.g., "10:30 AM"
  foodItem: string;
  category: FoodCategory;
  quantityGrams: number; // g or ml
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  waterMl: number;
  walkKm: number;
  notes?: string;
}

export interface HealthMetric {
  id: string;
  date: string;
  weightKg: number;
  waistInch: number;
  bloodPressureSys?: number;
  bloodPressureDia?: number;
  restingHeartRate?: number;
  notes?: string;
}

export interface LabTestRecord {
  id: string;
  date: string;
  testName: string;
  resultValue: number;
  unit: string;
  targetRange: string;
  status: 'Normal' | 'Elevated' | 'High' | 'Low' | 'User-reported';
  notes?: string;
}

export interface PersonalTargets {
  dailyCalories: number;
  proteinGrams: number;
  fiberGrams: number;
  waterMl: number;
  walkKm: number;
  sleepHours: number;
  goalWeightKg: number;
  currentWeightKg: number;
  heightCm: number;
  waistInch: number;
}

export interface UserProfile {
  age: number;
  occupation: string;
  familyHistory: string;
  smokingAlcohol: string;
  mainGoals: string;
  mealPattern: string;
  notes?: string;
}

export interface PeriodicCheckItem {
  id: string;
  checkName: string;
  lastDate: string;
  nextDate?: string;
  frequency: string;
  notes: string;
}

export interface DailyNutritionSummary {
  date: string;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  totalFiber: number;
  totalWater: number;
  totalWalkKm: number;
  score: number;
  fruitEntries: number;
  vegLegumeEntries: number;
  treatEntries: number;
  sugaryDrinks: number;
  entriesCount: number;
}
