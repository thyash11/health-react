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

  // 16-Jul-2026
  { id: "log-142", date: "2026-07-16", meal: "Breakfast", time: "10:30 AM", foodItem: "Idli", category: "Breakfast", quantityGrams: 250, calories: 300, protein: 10, carbs: 60, fat: 2, fiber: 3, waterMl: 0, walkKm: 0, notes: "4 small–medium idlis crushed and prepared as plain upma; turmeric used; oil not reported" },
  { id: "log-143", date: "2026-07-16", meal: "Breakfast", time: "10:30 AM", foodItem: "Split Bengal gram (chana dal), dry", category: "Protein", quantityGrams: 10, calories: 36.4, protein: 1.9, carbs: 6.1, fat: 0.6, fiber: 1.7, waterMl: 500, walkKm: 0, notes: "10g split Bengal gram added to idli upma" },
  { id: "log-144", date: "2026-07-16", meal: "Lunch", time: "3:00 PM", foodItem: "Ragi kali / ragi mudde, cooked", category: "Grain", quantityGrams: 500, calories: 600, protein: 12.5, carbs: 125, fat: 2.5, fiber: 13.5, waterMl: 0, walkKm: 0, notes: "500g ragi kali / ragi mudde" },
  { id: "log-145", date: "2026-07-16", meal: "Lunch", time: "3:00 PM", foodItem: "Pulicha keerai thokku", category: "Vegetable", quantityGrams: 80, calories: 96, protein: 2, carbs: 9.6, fat: 5.6, fiber: 3.2, waterMl: 0, walkKm: 0, notes: "80g pulicha keerai thokku; nutrition estimated" },
  { id: "log-146", date: "2026-07-16", meal: "Lunch", time: "3:00 PM", foodItem: "Tirunelveli-style puli ilai kuzhambu", category: "Dal/Curry", quantityGrams: 230, calories: 161, protein: 4.6, carbs: 23, fat: 5.8, fiber: 4.6, waterMl: 1000, walkKm: 0, notes: "230g Tirunelveli-style puli ilai kuzhambu; recipe estimate" },
  { id: "log-147", date: "2026-07-16", meal: "Drink", time: "7:00 PM", foodItem: "Watermelon juice, moderate sugar", category: "Beverage", quantityGrams: 600, calories: 240, protein: 2.4, carbs: 60, fat: 0.6, fiber: 1.2, waterMl: 0, walkKm: 0, notes: "600 mL; moderate amount of added sugar; estimated" },
  { id: "log-148", date: "2026-07-16", meal: "Dinner", time: "10:30 PM", foodItem: "Cooked white rice", category: "Grain", quantityGrams: 180, calories: 234, protein: 4.3, carbs: 50.4, fat: 0.5, fiber: 0.7, waterMl: 0, walkKm: 0, notes: "Cooked rice, full serving eaten" },
  { id: "log-149", date: "2026-07-16", meal: "Dinner", time: "10:30 PM", foodItem: "Low fat Paneer, shallow-fried", category: "Protein", quantityGrams: 130, calories: 350, protein: 32.5, carbs: 7.8, fat: 11.7, fiber: 0, waterMl: 0, walkKm: 0, notes: "130 g shallow-fried paneer, full serving eaten" },
  { id: "log-150", date: "2026-07-16", meal: "Dinner", time: "10:30 PM", foodItem: "Mixed vegetable mash", category: "Vegetable", quantityGrams: 300, calories: 81.3, protein: 3.4, carbs: 15, fat: 0.9, fiber: 9.4, waterMl: 0, walkKm: 0, notes: "350 g vegetable mash eaten" },
  { id: "log-151", date: "2026-07-16", meal: "Dinner", time: "10:30 PM", foodItem: "Paneer mayonnaise dressing", category: "Other", quantityGrams: 21, calories: 60, protein: 4, carbs: 1.3, fat: 4.2, fiber: 0.1, waterMl: 0, walkKm: 0, notes: "Approximately 70% of the prepared paneer mayonnaise serving" },
  { id: "log-152", date: "2026-07-16", meal: "Dinner", time: "10:30 PM", foodItem: "Cashewnuts", category: "Protein", quantityGrams: 4, calories: 22.1, protein: 0.7, carbs: 1.2, fat: 1.8, fiber: 0.1, waterMl: 0, walkKm: 0 },
  { id: "log-153", date: "2026-07-16", meal: "Dinner", time: "10:30 PM", foodItem: "Oil", category: "Added Fat", quantityGrams: 7.5, calories: 66.3, protein: 0, carbs: 0, fat: 7.5, fiber: 0, waterMl: 1500, walkKm: 0 },

  // 17-Jul-2026
  { id: "log-154", date: "2026-07-17", meal: "Breakfast", time: "10:30 AM", foodItem: "Plain dosa", category: "Breakfast", quantityGrams: 200, calories: 336, protein: 8, carbs: 56, fat: 8, fiber: 2, waterMl: 0, walkKm: 0, notes: "3 average dosas; combined cooked weight 200g" },
  { id: "log-155", date: "2026-07-17", meal: "Breakfast", time: "10:30 AM", foodItem: "Vegetable kurma, South Indian", category: "Dal/Curry", quantityGrams: 250, calories: 350, protein: 7.5, carbs: 30, fat: 22.5, fiber: 7.5, waterMl: 0, walkKm: 0, notes: "250g kurma; estimated because coconut and oil amounts were not measured" },
  { id: "log-156", date: "2026-07-17", meal: "Drink", time: "12:00 PM", foodItem: "Mixed fruit juice, sweetened", category: "Beverage", quantityGrams: 250, calories: 225, protein: 1.5, carbs: 52.5, fat: 0.5, fiber: 1.5, waterMl: 0, walkKm: 0, notes: "250 mL cup at 12 PM; shop-style estimate" },
  { id: "log-157", date: "2026-07-17", meal: "Drink", time: "2:00 PM", foodItem: "Sugarcane juice", category: "Beverage", quantityGrams: 250, calories: 185, protein: 0.5, carbs: 45.5, fat: 0.25, fiber: 0, waterMl: 0, walkKm: 0, notes: "250 mL at 2 PM; no extra sugar assumed" },
  { id: "log-158", date: "2026-07-17", meal: "Lunch", time: "4:00 PM", foodItem: "Sambar rice", category: "Dal/Curry", quantityGrams: 375, calories: 420, protein: 12, carbs: 75, fat: 8, fiber: 6, waterMl: 0, walkKm: 0, notes: "1.5 cups at 4 PM; function-day estimate" },
  { id: "log-159", date: "2026-07-17", meal: "Lunch", time: "4:00 PM", foodItem: "Vendakkai poriyal", category: "Vegetable", quantityGrams: 150, calories: 160, protein: 4, carbs: 18, fat: 8, fiber: 6, waterMl: 0, walkKm: 0, notes: "1 cup; estimated" },
  { id: "log-160", date: "2026-07-17", meal: "Other", time: "9:00 PM", foodItem: "Celebration cake", category: "Dessert", quantityGrams: 220, calories: 700, protein: 8, carbs: 100, fat: 30, fiber: 2, waterMl: 0, walkKm: 0, notes: "2 large cake slices at 9 PM; estimated" },
  { id: "log-161", date: "2026-07-17", meal: "Dinner", time: "10:00 PM", foodItem: "Vegetable kichadi", category: "Other", quantityGrams: 350, calories: 420, protein: 10, carbs: 70, fat: 12, fiber: 8, waterMl: 0, walkKm: 0, notes: "350 g at night; estimated" },
  { id: "log-162", date: "2026-07-17", meal: "Dinner", time: "10:00 PM", foodItem: "Poori", category: "Bakery", quantityGrams: 120, calories: 240, protein: 6, carbs: 32, fat: 10, fiber: 3, waterMl: 0, walkKm: 0, notes: "2 pooris" },
  { id: "log-163", date: "2026-07-17", meal: "Dinner", time: "10:00 PM", foodItem: "Medhu vadai", category: "Snack", quantityGrams: 70, calories: 150, protein: 5, carbs: 18, fat: 7, fiber: 3, waterMl: 0, walkKm: 0, notes: "1 medhu vadai" },
  { id: "log-164", date: "2026-07-17", meal: "Dinner", time: "10:00 PM", foodItem: "Peanut chutney", category: "Chutney", quantityGrams: 35, calories: 70, protein: 3, carbs: 4, fat: 5, fiber: 1, waterMl: 0, walkKm: 0, notes: "Matching portion; estimated" },
  { id: "log-165", date: "2026-07-17", meal: "Dinner", time: "10:00 PM", foodItem: "Sambar", category: "Dal/Curry", quantityGrams: 75, calories: 40, protein: 2, carbs: 6, fat: 1, fiber: 1, waterMl: 0, walkKm: 0, notes: "Small matching portion; estimated" },
  { id: "log-166", date: "2026-07-17", meal: "Dinner", time: "10:00 PM", foodItem: "Andhra chutney", category: "Chutney", quantityGrams: 30, calories: 40, protein: 1, carbs: 4, fat: 2, fiber: 1, waterMl: 0, walkKm: 0, notes: "Small matching portion; estimated" },
  { id: "log-167", date: "2026-07-17", meal: "Other", time: "1:00 AM", foodItem: "Water and function activity", category: "Beverage", quantityGrams: 1500, calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0, waterMl: 1500, walkKm: 3, notes: "1.5 L water; about 3 km walking plus moderate function work" },

  // 18-Jul-2026
  { id: "log-168", date: "2026-07-18", meal: "Breakfast", time: "10:30 AM", foodItem: "Idli", category: "Breakfast", quantityGrams: 240, calories: 240, protein: 8, carbs: 48, fat: 2, fiber: 4, waterMl: 0, walkKm: 0, notes: "4 idlis; estimated 240 g" },
  { id: "log-169", date: "2026-07-18", meal: "Breakfast", time: "10:30 AM", foodItem: "Peanut chutney", category: "Chutney", quantityGrams: 100, calories: 240, protein: 10, carbs: 12, fat: 20, fiber: 4, waterMl: 0, walkKm: 0, notes: "About twice the usual required amount" },
  { id: "log-170", date: "2026-07-18", meal: "Drink", time: "11:00 AM", foodItem: "Nannari drink", category: "Beverage", quantityGrams: 250, calories: 120, protein: 0, carbs: 30, fat: 0, fiber: 0, waterMl: 0, walkKm: 0, notes: "1 glass at 11 AM; sweetened estimate" },
  { id: "log-171", date: "2026-07-18", meal: "Lunch", time: "2:00 PM", foodItem: "Cooked white rice", category: "Grain", quantityGrams: 400, calories: 520, protein: 10, carbs: 112, fat: 1.2, fiber: 1.6, waterMl: 0, walkKm: 0, notes: "2 cups at 2 PM; estimated 400 g" },
  { id: "log-172", date: "2026-07-18", meal: "Lunch", time: "2:00 PM", foodItem: "Vegetable kurma, South Indian", category: "Dal/Curry", quantityGrams: 150, calories: 200, protein: 5, carbs: 22, fat: 12, fiber: 5, waterMl: 0, walkKm: 0, notes: "Matching lunch portion; estimated" },
  { id: "log-173", date: "2026-07-18", meal: "Lunch", time: "2:00 PM", foodItem: "Vazhakkai poriyal", category: "Vegetable", quantityGrams: 150, calories: 180, protein: 3, carbs: 30, fat: 6, fiber: 5, waterMl: 0, walkKm: 0, notes: "1 cup; estimated" },
  { id: "log-174", date: "2026-07-18", meal: "Evening Snack", time: "5:00 PM", foodItem: "Coffee with milk and sugar", category: "Beverage", quantityGrams: 150, calories: 50, protein: 1, carbs: 8, fat: 2, fiber: 0, waterMl: 0, walkKm: 0, notes: "1 coffee; estimated" },
  { id: "log-175", date: "2026-07-18", meal: "Evening Snack", time: "5:00 PM", foodItem: "NutriChoice biscuits", category: "Snack", quantityGrams: 64, calories: 280, protein: 5, carbs: 48, fat: 8, fiber: 6, waterMl: 0, walkKm: 0, notes: "8 biscuits; estimated" },
  { id: "log-176", date: "2026-07-18", meal: "Dinner", time: "9:00 PM", foodItem: "Chapathi", category: "Grain", quantityGrams: 200, calories: 400, protein: 12, carbs: 72, fat: 8, fiber: 10, waterMl: 0, walkKm: 0, notes: "4 chapathis; estimated" },
  { id: "log-177", date: "2026-07-18", meal: "Dinner", time: "9:00 PM", foodItem: "Vegetable kurma, South Indian", category: "Dal/Curry", quantityGrams: 120, calories: 160, protein: 4, carbs: 18, fat: 10, fiber: 4, waterMl: 0, walkKm: 0, notes: "Matching dinner portion; estimated" },

  // 19-Jul-2026
  { id: "log-178", date: "2026-07-19", meal: "Breakfast", time: "9:00 AM", foodItem: "Upma", category: "Breakfast", quantityGrams: 280, calories: 364, protein: 9.8, carbs: 64.4, fat: 8.4, fiber: 5.6, waterMl: 0, walkKm: 0, notes: "280 g; estimated" },
  { id: "log-179", date: "2026-07-19", meal: "Breakfast", time: "9:00 AM", foodItem: "Coconut chutney", category: "Chutney", quantityGrams: 100, calories: 220, protein: 3, carbs: 9, fat: 20, fiber: 5, waterMl: 0, walkKm: 0, notes: "100 g" },
  { id: "log-180", date: "2026-07-19", meal: "Lunch", time: "2:00 PM", foodItem: "Cooked white rice", category: "Grain", quantityGrams: 200, calories: 260, protein: 4.8, carbs: 56, fat: 0.6, fiber: 0.8, waterMl: 0, walkKm: 0, notes: "1 cup; estimated 200 g" },
  { id: "log-181", date: "2026-07-19", meal: "Lunch", time: "2:00 PM", foodItem: "Sheela fish, raw weight", category: "Protein", quantityGrams: 300, calories: 285, protein: 60, carbs: 0, fat: 3, fiber: 0, waterMl: 0, walkKm: 0, notes: "300 g raw before frying; estimate excludes added oil" },
  { id: "log-182", date: "2026-07-19", meal: "Lunch", time: "2:00 PM", foodItem: "Cooking oil", category: "Added Fat", quantityGrams: 30, calories: 240, protein: 0, carbs: 0, fat: 27.2, fiber: 0, waterMl: 0, walkKm: 0, notes: "2 tbsp used for frying; counted as consumed" },
  { id: "log-183", date: "2026-07-19", meal: "Lunch", time: "2:00 PM", foodItem: "Vazhakkai poriyal", category: "Vegetable", quantityGrams: 20, calories: 24, protein: 0.4, carbs: 4, fat: 0.8, fiber: 0.7, waterMl: 0, walkKm: 0, notes: "1 tbsp; estimated" },
  { id: "log-184", date: "2026-07-19", meal: "Lunch", time: "2:00 PM", foodItem: "Drumstick curry", category: "Dal/Curry", quantityGrams: 20, calories: 20, protein: 0.5, carbs: 3, fat: 0.6, fiber: 0.8, waterMl: 0, walkKm: 0, notes: "1 tbsp; estimated" },
  { id: "log-185", date: "2026-07-19", meal: "Drink", time: "5:00 PM", foodItem: "Sugarcane juice", category: "Beverage", quantityGrams: 250, calories: 185, protein: 0.5, carbs: 45.5, fat: 0.3, fiber: 0, waterMl: 0, walkKm: 0, notes: "250 ml" },
  { id: "log-186", date: "2026-07-19", meal: "Dinner", time: "9:00 PM", foodItem: "Poori", category: "Bakery", quantityGrams: 125, calories: 250, protein: 6, carbs: 35, fat: 10, fiber: 3, waterMl: 0, walkKm: 0, notes: "2.5 small pooris; estimated weight" },
  { id: "log-187", date: "2026-07-19", meal: "Dinner", time: "9:00 PM", foodItem: "Plain dosa", category: "Breakfast", quantityGrams: 150, calories: 150, protein: 4, carbs: 30, fat: 2, fiber: 1.5, waterMl: 0, walkKm: 0, notes: "1.5 small dosas; estimated weight" },
  { id: "log-188", date: "2026-07-19", meal: "Dinner", time: "9:00 PM", foodItem: "Vegetable kichadi", category: "Other", quantityGrams: 300, calories: 360, protein: 8.6, carbs: 60, fat: 10.3, fiber: 6.9, waterMl: 0, walkKm: 0, notes: "300 g" },
  { id: "log-189", date: "2026-07-19", meal: "Dinner", time: "9:00 PM", foodItem: "Coconut chutney", category: "Chutney", quantityGrams: 100, calories: 220, protein: 3, carbs: 9, fat: 20, fiber: 5, waterMl: 0, walkKm: 0, notes: "100 g" },
  { id: "log-190", date: "2026-07-19", meal: "Dinner", time: "9:00 PM", foodItem: "Sambar", category: "Dal/Curry", quantityGrams: 150, calories: 90, protein: 4.5, carbs: 13.5, fat: 2.25, fiber: 3.75, waterMl: 0, walkKm: 0, notes: "150 g" },
  { id: "log-191", date: "2026-07-19", meal: "Dinner", time: "9:00 PM", foodItem: "Bonda", category: "Snack", quantityGrams: 60, calories: 140, protein: 3, carbs: 20, fat: 6, fiber: 2, waterMl: 0, walkKm: 0, notes: "1 small bonda; estimated 60 g" },
  { id: "log-192", date: "2026-07-19", meal: "Other", time: "10:00 PM", foodItem: "Nut-filled sweet", category: "Dessert", quantityGrams: 70, calories: 320, protein: 5, carbs: 35, fat: 18, fiber: 2, waterMl: 0, walkKm: 0, notes: "Estimated from photo; about 70 g" },

  // 20-Jul-2026
  { id: "log-193", date: "2026-07-20", meal: "Breakfast", time: "9:00 AM", foodItem: "Hotel parotta", category: "Bakery", quantityGrams: 240, calories: 780, protein: 18, carbs: 108, fat: 30, fiber: 5, waterMl: 0, walkKm: 0, notes: "2 parottas, about 120 g each" },
  { id: "log-194", date: "2026-07-20", meal: "Breakfast", time: "9:00 AM", foodItem: "Vegetable kurma, hotel", category: "Dal/Curry", quantityGrams: 100, calories: 150, protein: 3.5, carbs: 15, fat: 9, fiber: 3, waterMl: 0, walkKm: 0, notes: "Matching portion; estimated 100 g" },
  { id: "log-195", date: "2026-07-20", meal: "Other", time: "1:00 PM", foodItem: "Balkova", category: "Dessert", quantityGrams: 80, calories: 340, protein: 8, carbs: 45, fat: 14, fiber: 0, waterMl: 0, walkKm: 0, notes: "User estimated 340 kcal; weight estimated 80 g" },
  { id: "log-196", date: "2026-07-20", meal: "Lunch", time: "2:00 PM", foodItem: "Ragi kali", category: "Grain", quantityGrams: 480, calories: 550, protein: 13, carbs: 110, fat: 4, fiber: 12, waterMl: 0, walkKm: 0, notes: "480 g" },
  { id: "log-197", date: "2026-07-20", meal: "Lunch", time: "2:00 PM", foodItem: "Peanut chutney", category: "Chutney", quantityGrams: 120, calories: 300, protein: 12, carbs: 15, fat: 24, fiber: 5, waterMl: 0, walkKm: 0, notes: "120 g" },
  { id: "log-198", date: "2026-07-20", meal: "Evening Snack", time: "7:00 PM", foodItem: "Murukku", category: "Snack", quantityGrams: 70, calories: 370, protein: 6, carbs: 42, fat: 20, fiber: 3, waterMl: 0, walkKm: 0, notes: "70 g at 7 PM" },
  { id: "log-199", date: "2026-07-20", meal: "Evening Snack", time: "7:00 PM", foodItem: "Sweet somasu", category: "Dessert", quantityGrams: 50, calories: 230, protein: 3, carbs: 30, fat: 11, fiber: 1, waterMl: 0, walkKm: 0, notes: "50 g at 7 PM; estimated" },
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
