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

export const initialTargets: PersonalTargets = {
  dailyCalories: 2000,
  proteinGrams: 120,
  fiberGrams: 30,
  waterMl: 2700,
  walkKm: 3,
  sleepHours: 7.5,
  goalWeightKg: 75,
  currentWeightKg: 98.5,
  heightCm: 173,
  waistInch: 40,
};

export const initialProfile: UserProfile = {
  age: 33,
  occupation: "Desk job / WFH",
  familyHistory: "Father: Diabetes + Heart attack; Mother: Breast cancer at 51",
  smokingAlcohol: "None",
  mainGoals: "Sleep quality, walking, fat loss & metabolic health",
  mealPattern: "10:30 AM / 3:00 PM / 9:00 PM (gradually shift dinner earlier)",
  notes: "Work shift: 6 AM - 1 PM. completion can vary.",
};

export const initialFoodLibrary: FoodItem[] = [
  { id: "f1", name: "Idli", category: "Breakfast", defaultServingGrams: 200, caloriesPer100g: 120, proteinPer100g: 4.0, carbsPer100g: 24.0, fatPer100g: 0.8, fiberPer100g: 1.2, isFavorite: true },
  { id: "f2", name: "Coconut Chutney", category: "Chutney", defaultServingGrams: 60, caloriesPer100g: 220, proteinPer100g: 3.0, carbsPer100g: 9.0, fatPer100g: 20.0, fiberPer100g: 8.3, isFavorite: true },
  { id: "f3", name: "Cooked White Rice", category: "Grain", defaultServingGrams: 350, caloriesPer100g: 130, proteinPer100g: 2.4, carbsPer100g: 28.0, fatPer100g: 0.3, fiberPer100g: 0.4, isFavorite: true },
  { id: "f4", name: "Sea Bass / Koduva Fish", category: "Protein", defaultServingGrams: 250, caloriesPer100g: 170, proteinPer100g: 20.0, carbsPer100g: 0.0, fatPer100g: 9.0, fiberPer100g: 0.0, isFavorite: true },
  { id: "f5", name: "Pista Ice Cream", category: "Dessert", defaultServingGrams: 55, caloriesPer100g: 220, proteinPer100g: 4.0, carbsPer100g: 28.0, fatPer100g: 11.0, fiberPer100g: 0.5 },
  { id: "f6", name: "Karasev", category: "Snack", defaultServingGrams: 40, caloriesPer100g: 520, proteinPer100g: 11.0, carbsPer100g: 50.0, fatPer100g: 31.0, fiberPer100g: 4.0 },
  { id: "f7", name: "Plain Cake Slice", category: "Bakery", defaultServingGrams: 80, caloriesPer100g: 360, proteinPer100g: 5.0, carbsPer100g: 50.0, fatPer100g: 16.0, fiberPer100g: 1.0 },
  { id: "f8", name: "Plain Dosa", category: "Breakfast", defaultServingGrams: 200, caloriesPer100g: 168, proteinPer100g: 4.0, carbsPer100g: 28.0, fatPer100g: 4.0, fiberPer100g: 1.0, isFavorite: true },
  { id: "f9", name: "Fermented Curd Porridge", category: "Breakfast", defaultServingGrams: 300, caloriesPer100g: 60, proteinPer100g: 2.2, carbsPer100g: 9.0, fatPer100g: 1.8, fiberPer100g: 0.5 },
  { id: "f10", name: "Upma", category: "Breakfast", defaultServingGrams: 250, caloriesPer100g: 140, proteinPer100g: 3.5, carbsPer100g: 23.0, fatPer100g: 4.0, fiberPer100g: 2.0 },
  { id: "f11", name: "Sugar", category: "Added Sugar", defaultServingGrams: 8, caloriesPer100g: 400, proteinPer100g: 0.0, carbsPer100g: 100.0, fatPer100g: 0.0, fiberPer100g: 0.0 },
  { id: "f12", name: "Peanut Chutney", category: "Chutney", defaultServingGrams: 15, caloriesPer100g: 240, proteinPer100g: 9.3, carbsPer100g: 13.3, fatPer100g: 18.0, fiberPer100g: 4.0 },
  { id: "f13", name: "Litchi", category: "Fruit", defaultServingGrams: 40, caloriesPer100g: 66, proteinPer100g: 0.8, carbsPer100g: 17.0, fatPer100g: 0.4, fiberPer100g: 1.3 },
  { id: "f14", name: "Mangosteen", category: "Fruit", defaultServingGrams: 50, caloriesPer100g: 73, proteinPer100g: 0.4, carbsPer100g: 18.0, fatPer100g: 0.6, fiberPer100g: 1.8 },
  { id: "f15", name: "Paruppu Keerai", category: "Dal/Curry", defaultServingGrams: 450, caloriesPer100g: 90, proteinPer100g: 5.0, carbsPer100g: 12.0, fatPer100g: 2.5, fiberPer100g: 4.0 },
  { id: "f16", name: "Fried Vathal", category: "Snack", defaultServingGrams: 20, caloriesPer100g: 450, proteinPer100g: 4.0, carbsPer100g: 58.0, fatPer100g: 22.0, fiberPer100g: 3.0 },
  { id: "f17", name: "Lemon Soft Drink", category: "Sugary Drink", defaultServingGrams: 150, caloriesPer100g: 40, proteinPer100g: 0.0, carbsPer100g: 10.0, fatPer100g: 0.0, fiberPer100g: 0.0 },
  { id: "f18", name: "Ghee Podi Idli", category: "Breakfast", defaultServingGrams: 160, caloriesPer100g: 240, proteinPer100g: 6.0, carbsPer100g: 30.0, fatPer100g: 10.0, fiberPer100g: 2.0 },
  { id: "f19", name: "Sambar", category: "Dal/Curry", defaultServingGrams: 150, caloriesPer100g: 60, proteinPer100g: 3.0, carbsPer100g: 9.0, fatPer100g: 1.5, fiberPer100g: 2.5, isFavorite: true },
  { id: "f20", name: "Appam with Sweet Coconut Milk", category: "Breakfast", defaultServingGrams: 670, caloriesPer100g: 150, proteinPer100g: 3.0, carbsPer100g: 25.0, fatPer100g: 4.5, fiberPer100g: 1.2 },
  { id: "f21", name: "Ghee", category: "Added Fat", defaultServingGrams: 10, caloriesPer100g: 900, proteinPer100g: 0.0, carbsPer100g: 0.0, fatPer100g: 100.0, fiberPer100g: 0.0 },
  { id: "f22", name: "Siru Keerai Poriyal", category: "Vegetable", defaultServingGrams: 100, caloriesPer100g: 80, proteinPer100g: 3.0, carbsPer100g: 10.0, fatPer100g: 3.5, fiberPer100g: 4.0, isFavorite: true },
  { id: "f23", name: "Vazhakkai Poriyal", category: "Vegetable", defaultServingGrams: 100, caloriesPer100g: 150, proteinPer100g: 2.0, carbsPer100g: 25.0, fatPer100g: 5.0, fiberPer100g: 3.0 },
];

export const initialDailyLogs: DailyLogEntry[] = [
  // 12-Jul-2026
  { id: "log-101", date: "2026-07-12", meal: "Breakfast", time: "10:30 AM", foodItem: "Idli", category: "Breakfast", quantityGrams: 250, calories: 300, protein: 10.0, carbs: 60.0, fat: 2.0, fiber: 3.0, waterMl: 0, walkKm: 0, notes: "5 idlis" },
  { id: "log-102", date: "2026-07-12", meal: "Breakfast", time: "10:30 AM", foodItem: "Coconut Chutney", category: "Chutney", quantityGrams: 60, calories: 132, protein: 1.8, carbs: 5.4, fat: 12.0, fiber: 3.0, waterMl: 500, walkKm: 0, notes: "Less chutney" },
  { id: "log-103", date: "2026-07-12", meal: "Lunch", time: "3:00 PM", foodItem: "Cooked White Rice", category: "Grain", quantityGrams: 350, calories: 455, protein: 8.4, carbs: 98.0, fat: 1.1, fiber: 1.4, waterMl: 0, walkKm: 0, notes: "About 1 cup" },
  { id: "log-104", date: "2026-07-12", meal: "Lunch", time: "3:00 PM", foodItem: "Sea Bass / Koduva", category: "Protein", quantityGrams: 250, calories: 425, protein: 50.0, carbs: 0.0, fat: 22.5, fiber: 0.0, waterMl: 800, walkKm: 0, notes: "Nei koduva; 250g reported" },
  { id: "log-105", date: "2026-07-12", meal: "Evening Snack", time: "4:00 PM", foodItem: "Pista Ice Cream", category: "Dessert", quantityGrams: 55, calories: 121, protein: 2.2, carbs: 15.4, fat: 6.1, fiber: 0.3, waterMl: 0, walkKm: 0 },
  { id: "log-106", date: "2026-07-12", meal: "Evening Snack", time: "6:00 PM", foodItem: "Karasev", category: "Snack", quantityGrams: 40, calories: 208, protein: 4.4, carbs: 20.0, fat: 12.4, fiber: 1.6, waterMl: 0, walkKm: 3.0, notes: "3 km walk" },
  { id: "log-107", date: "2026-07-12", meal: "Evening Snack", time: "6:00 PM", foodItem: "Plain Cake Slice", category: "Bakery", quantityGrams: 80, calories: 288, protein: 4.0, carbs: 40.0, fat: 12.8, fiber: 0.8, waterMl: 500, walkKm: 0, notes: "2 slices" },
  { id: "log-108", date: "2026-07-12", meal: "Dinner", time: "9:30 PM", foodItem: "Plain Dosa", category: "Breakfast", quantityGrams: 200, calories: 336, protein: 8.0, carbs: 56.0, fat: 8.0, fiber: 2.0, waterMl: 0, walkKm: 0, notes: "2 medium dosas" },
  { id: "log-109", date: "2026-07-12", meal: "Dinner", time: "3:00 PM", foodItem: "Sea Bass / Koduva", category: "Protein", quantityGrams: 250, calories: 425, protein: 50.0, carbs: 0.0, fat: 22.5, fiber: 0.0, waterMl: 1000, walkKm: 0, notes: "Dinner portion" },

  // 13-Jul-2026
  { id: "log-110", date: "2026-07-13", meal: "Breakfast", time: "10:00 AM", foodItem: "Fermented Curd Porridge", category: "Breakfast", quantityGrams: 300, calories: 180, protein: 6.6, carbs: 27.0, fat: 5.4, fiber: 1.5, waterMl: 0, walkKm: 0 },
  { id: "log-111", date: "2026-07-13", meal: "Breakfast", time: "11:45 AM", foodItem: "Upma", category: "Breakfast", quantityGrams: 250, calories: 350, protein: 8.8, carbs: 57.5, fat: 10.0, fiber: 5.0, waterMl: 0, walkKm: 0 },
  { id: "log-112", date: "2026-07-13", meal: "Breakfast", time: "11:45 AM", foodItem: "Sugar", category: "Added Sugar", quantityGrams: 8, calories: 32, protein: 0.0, carbs: 8.0, fat: 0.0, fiber: 0.0, waterMl: 0, walkKm: 0, notes: "2 tsp sugar" },
  { id: "log-113", date: "2026-07-13", meal: "Breakfast", time: "1:00 PM", foodItem: "Idli", category: "Breakfast", quantityGrams: 50, calories: 60, protein: 2.0, carbs: 12.0, fat: 0.4, fiber: 0.6, waterMl: 0, walkKm: 0, notes: "1 idli" },
  { id: "log-114", date: "2026-07-13", meal: "Breakfast", time: "1:00 PM", foodItem: "Peanut Chutney", category: "Chutney", quantityGrams: 15, calories: 36, protein: 1.4, carbs: 2.0, fat: 2.7, fiber: 0.6, waterMl: 500, walkKm: 0 },
  { id: "log-115", date: "2026-07-13", meal: "Mid snack", time: "2:00 PM", foodItem: "Litchi", category: "Fruit", quantityGrams: 40, calories: 26.4, protein: 0.3, carbs: 6.8, fat: 0.2, fiber: 0.5, waterMl: 0, walkKm: 0 },
  { id: "log-116", date: "2026-07-13", meal: "Mid snack", time: "2:00 PM", foodItem: "Mangosteen", category: "Fruit", quantityGrams: 50, calories: 36.5, protein: 0.2, carbs: 9.0, fat: 0.3, fiber: 0.9, waterMl: 0, walkKm: 0 },
  { id: "log-117", date: "2026-07-13", meal: "Lunch", time: "3:00 PM", foodItem: "Cooked White Rice", category: "Grain", quantityGrams: 350, calories: 455, protein: 8.4, carbs: 98.0, fat: 1.1, fiber: 1.4, waterMl: 0, walkKm: 0 },
  { id: "log-118", date: "2026-07-13", meal: "Lunch", time: "3:00 PM", foodItem: "Paruppu Keerai", category: "Dal/Curry", quantityGrams: 450, calories: 405, protein: 22.5, carbs: 54.0, fat: 11.3, fiber: 18.0, waterMl: 0, walkKm: 0 },
  { id: "log-119", date: "2026-07-13", meal: "Lunch", time: "3:00 PM", foodItem: "Karasev", category: "Snack", quantityGrams: 50, calories: 260, protein: 5.5, carbs: 25.0, fat: 15.5, fiber: 2.0, waterMl: 0, walkKm: 0 },
  { id: "log-120", date: "2026-07-13", meal: "Lunch", time: "3:00 PM", foodItem: "Fried Vathal", category: "Snack", quantityGrams: 20, calories: 90, protein: 0.8, carbs: 11.6, fat: 4.4, fiber: 0.6, waterMl: 1000, walkKm: 0 },
  { id: "log-121", date: "2026-07-13", meal: "Evening Snack", time: "5:00 PM", foodItem: "Lemon Soft Drink", category: "Sugary Drink", quantityGrams: 150, calories: 60, protein: 0.0, carbs: 15.0, fat: 0.0, fiber: 0.0, waterMl: 500, walkKm: 0 },
  { id: "log-122", date: "2026-07-13", meal: "Evening Snack", time: "6:00 PM", foodItem: "Karasev", category: "Snack", quantityGrams: 40, calories: 208, protein: 4.4, carbs: 20.0, fat: 12.4, fiber: 1.6, waterMl: 0, walkKm: 3.0 },
  { id: "log-123", date: "2026-07-13", meal: "Evening Snack", time: "6:00 PM", foodItem: "Plain Cake Slice", category: "Bakery", quantityGrams: 80, calories: 288, protein: 4.0, carbs: 40.0, fat: 12.8, fiber: 0.8, waterMl: 0, walkKm: 0 },
  { id: "log-124", date: "2026-07-13", meal: "Dinner", time: "9:00 PM", foodItem: "Ghee Podi Idli", category: "Breakfast", quantityGrams: 160, calories: 384, protein: 9.6, carbs: 48.0, fat: 16.0, fiber: 3.2, waterMl: 0, walkKm: 0 },
  { id: "log-125", date: "2026-07-13", meal: "Dinner", time: "9:00 PM", foodItem: "Sambar", category: "Dal/Curry", quantityGrams: 150, calories: 90, protein: 4.5, carbs: 13.5, fat: 2.3, fiber: 3.8, waterMl: 0, walkKm: 0 },
  { id: "log-126", date: "2026-07-13", meal: "Dinner", time: "9:00 PM", foodItem: "Coconut Chutney", category: "Chutney", quantityGrams: 30, calories: 66, protein: 0.9, carbs: 2.7, fat: 6.0, fiber: 1.5, waterMl: 1000, walkKm: 0 },

  // 14-Jul-2026
  { id: "log-127", date: "2026-07-14", meal: "Breakfast", time: "10:30 AM", foodItem: "Appam with Sweet Coconut", category: "Breakfast", quantityGrams: 670, calories: 1005, protein: 20.1, carbs: 167.5, fat: 30.2, fiber: 8.0, waterMl: 500, walkKm: 0, notes: "Amavasai ritual day" },
  { id: "log-128", date: "2026-07-14", meal: "Lunch", time: "3:00 PM", foodItem: "Cooked White Rice", category: "Grain", quantityGrams: 500, calories: 650, protein: 12.0, carbs: 140.0, fat: 1.5, fiber: 2.0, waterMl: 0, walkKm: 0 },
  { id: "log-129", date: "2026-07-14", meal: "Lunch", time: "3:00 PM", foodItem: "Sambar", category: "Dal/Curry", quantityGrams: 250, calories: 150, protein: 7.5, carbs: 22.5, fat: 3.8, fiber: 6.3, waterMl: 0, walkKm: 0 },
  { id: "log-130", date: "2026-07-14", meal: "Lunch", time: "3:00 PM", foodItem: "Ghee", category: "Added Fat", quantityGrams: 10, calories: 90, protein: 0.0, carbs: 0.0, fat: 10.0, fiber: 0.0, waterMl: 0, walkKm: 0 },
  { id: "log-131", date: "2026-07-14", meal: "Lunch", time: "3:00 PM", foodItem: "Siru Keerai Poriyal", category: "Vegetable", quantityGrams: 100, calories: 80, protein: 3.0, carbs: 10.0, fat: 3.5, fiber: 4.0, waterMl: 0, walkKm: 0 },
  { id: "log-132", date: "2026-07-14", meal: "Lunch", time: "3:00 PM", foodItem: "Vazhakkai Poriyal", category: "Vegetable", quantityGrams: 100, calories: 150, protein: 2.0, carbs: 25.0, fat: 5.0, fiber: 3.0, waterMl: 700, walkKm: 0 },

  // 15-Jul-2026 (Selected Date in screenshot 1)
  { id: "log-133", date: "2026-07-15", meal: "Breakfast", time: "10:30 AM", foodItem: "Ghee Podi Idli", category: "Breakfast", quantityGrams: 200, calories: 480, protein: 12.0, carbs: 60.0, fat: 20.0, fiber: 4.0, waterMl: 500, walkKm: 0 },
  { id: "log-134", date: "2026-07-15", meal: "Breakfast", time: "10:30 AM", foodItem: "Sambar", category: "Dal/Curry", quantityGrams: 150, calories: 162, protein: 6.0, carbs: 31.5, fat: 5.5, fiber: 5.0, waterMl: 0, walkKm: 0 },
  { id: "log-135", date: "2026-07-15", meal: "Lunch", time: "3:00 PM", foodItem: "Cooked White Rice", category: "Grain", quantityGrams: 350, calories: 455, protein: 8.4, carbs: 89.3, fat: 1.1, fiber: 1.2, waterMl: 0, walkKm: 0 },
  { id: "log-136", date: "2026-07-15", meal: "Lunch", time: "3:00 PM", foodItem: "Sea Bass / Koduva", category: "Protein", quantityGrams: 200, calories: 241.3, protein: 42.0, carbs: 0.0, fat: 17.3, fiber: 0.0, waterMl: 700, walkKm: 0 },
  { id: "log-137", date: "2026-07-15", meal: "Evening Snack", time: "6:00 PM", foodItem: "Karasev", category: "Snack", quantityGrams: 30, calories: 156, protein: 3.3, carbs: 15.0, fat: 9.3, fiber: 1.2, waterMl: 0, walkKm: 0 },
  { id: "log-138", date: "2026-07-15", meal: "Evening Snack", time: "6:00 PM", foodItem: "Litchi", category: "Fruit", quantityGrams: 60, calories: 42, protein: 0.5, carbs: 10.0, fat: 0.3, fiber: 1.0, waterMl: 0, walkKm: 0 },
  { id: "log-139", date: "2026-07-15", meal: "Dinner", time: "9:00 PM", foodItem: "Plain Dosa", category: "Breakfast", quantityGrams: 300, calories: 504, protein: 12.0, carbs: 84.0, fat: 12.0, fiber: 3.0, waterMl: 0, walkKm: 0 },
  { id: "log-140", date: "2026-07-15", meal: "Dinner", time: "9:00 PM", foodItem: "Paruppu Keerai", category: "Dal/Curry", quantityGrams: 300, calories: 270, protein: 15.0, carbs: 36.0, fat: 7.5, fiber: 7.5, waterMl: 1000, walkKm: 0 },
  { id: "log-141", date: "2026-07-15", meal: "Dinner", time: "9:00 PM", foodItem: "Coconut Chutney", category: "Chutney", quantityGrams: 100, calories: 220, protein: 3.0, carbs: 9.0, fat: 20.0, fiber: 8.3, waterMl: 0, walkKm: 0 },
];

export const initialHabits: DailyHabitRecord[] = [
  { date: "2026-07-12", dayType: "Normal", walkKm: 3.0, waterMl: 2800, fruitEntries: 0, vegLegumeEntries: 0, treatEntries: 3, sugaryDrinksEntries: 0, dailyScore: 51 },
  { date: "2026-07-13", dayType: "Travel", walkKm: 3.0, waterMl: 3000, fruitEntries: 2, vegLegumeEntries: 0, treatEntries: 4, sugaryDrinksEntries: 1, dailyScore: 58 },
  { date: "2026-07-14", dayType: "Ritual / Festival", walkKm: 0.0, waterMl: 2200, fruitEntries: 0, vegLegumeEntries: 2, treatEntries: 3, sugaryDrinksEntries: 0, dailyScore: 36 },
  { date: "2026-07-15", dayType: "Normal", weightKg: 98.5, waistInch: 40.0, sleepHours: 7.0, sleepQuality: "Good", walkKm: 0.0, waterMl: 2200, stressLevel: "Medium", fruitEntries: 1, vegLegumeEntries: 1, treatEntries: 2, sugaryDrinksEntries: 0, dailyScore: 45 },
  { date: "2026-07-16", dayType: "Normal", walkKm: 0.0, waterMl: 3000, fruitEntries: 0, vegLegumeEntries: 3, treatEntries: 0, sugaryDrinksEntries: 0, dailyScore: 53 },
  { date: "2026-07-17", dayType: "Normal", walkKm: 3.0, waterMl: 1500, fruitEntries: 0, vegLegumeEntries: 1, treatEntries: 1, sugaryDrinksEntries: 0, dailyScore: 54 },
  { date: "2026-07-18", dayType: "Normal", walkKm: 0.0, waterMl: 0, fruitEntries: 0, vegLegumeEntries: 1, treatEntries: 1, sugaryDrinksEntries: 0, dailyScore: 45 },
  { date: "2026-07-19", dayType: "Normal", walkKm: 0.0, waterMl: 0, fruitEntries: 0, vegLegumeEntries: 1, treatEntries: 1, sugaryDrinksEntries: 0, dailyScore: 44 },
  { date: "2026-07-20", dayType: "Normal", walkKm: 0.0, waterMl: 0, fruitEntries: 0, vegLegumeEntries: 0, treatEntries: 3, sugaryDrinksEntries: 0, dailyScore: 30 },
];

export const initialHealthMetrics: HealthMetric[] = [
  { id: "hm-1", date: "2026-07-15", weightKg: 98.5, waistInch: 40.0, bloodPressureSys: 120, bloodPressureDia: 80, restingHeartRate: 72, notes: "Baseline starting point" },
];

export const initialLabTests: LabTestRecord[] = [
  { id: "lt-1", date: "2026-07-15", testName: "Total Cholesterol", resultValue: 390, unit: "mg/dL", targetRange: "< 200", status: "High", notes: "User-reported baseline from health test sheet" },
  { id: "lt-2", date: "2026-07-15", testName: "HDL Cholesterol", resultValue: 50, unit: "mg/dL", targetRange: "> 40", status: "Normal", notes: "User-reported date" },
  { id: "lt-3", date: "2026-07-15", testName: "HbA1c", resultValue: 5.8, unit: "%", targetRange: "< 5.7%", status: "Elevated", notes: "Borderline glucose control" },
  { id: "lt-4", date: "2026-07-15", testName: "Vitamin D3", resultValue: 22, unit: "ng/mL", targetRange: "30-100", status: "Low", notes: "Consider supplementation" },
];

export const initialPeriodicChecks: PeriodicCheckItem[] = [
  { id: "pc-1", checkName: "Weight", lastDate: "2026-07-15", frequency: "Weekly", notes: "Same conditions (fasted morning)" },
  { id: "pc-2", checkName: "Waist Circumference", lastDate: "2026-07-15", frequency: "Monthly", notes: "Measure around navel level" },
  { id: "pc-3", checkName: "Blood Pressure", lastDate: "2026-07-15", frequency: "Monthly", notes: "Track when measured at clinic/home" },
  { id: "pc-4", checkName: "HbA1c / Fasting Glucose", lastDate: "2026-07-15", frequency: "Quarterly", notes: "Enter from formal lab report" },
  { id: "pc-5", checkName: "Full Lipid Profile", lastDate: "2026-07-15", frequency: "Bi-annually", notes: "Enter LDL and triglycerides when available" },
  { id: "pc-6", checkName: "Vitamin D / B12", lastDate: "2026-07-15", frequency: "Annually", notes: "Only when tested" },
];
