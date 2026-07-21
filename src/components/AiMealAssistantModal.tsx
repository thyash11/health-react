import React, { useState } from "react";
import { Sparkles, X, Check, Utensils, AlertCircle, Loader2 } from "lucide-react";
import { useTracker } from "../context/TrackerContext";
import { DailyLogEntry, MealType, FoodCategory } from "../types";

interface AiMealAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiMealAssistantModal: React.FC<AiMealAssistantModalProps> = ({ isOpen, onClose }) => {
  const { selectedDate, addBatchLogEntries } = useTracker();

  const [description, setDescription] = useState("");
  const [mealType, setMealType] = useState<MealType>("Breakfast");
  const [isParsing, setIsParsing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [parsedItems, setParsedItems] = useState<any[] | null>(null);

  if (!isOpen) return null;

  const samplePrompts = [
    "2 ghee podi idlis with 1 bowl sambar and 2 tbsp coconut chutney for breakfast at 10:30 AM",
    "350g cooked white rice, 250g sea bass fish fry, and 1 cup curds for lunch",
    "1 cup tea with 2 biscuits and 40g karasev snack at 6:00 PM",
  ];

  const handleParseMeal = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!description.trim()) return;

    setIsParsing(true);
    setErrorMessage("");
    setParsedItems(null);

    try {
      const response = await fetch("/api/parse-meal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: description,
          mealType,
          logDate: selectedDate,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.error || "Failed to parse meal with Gemini AI");
      }

      if (result.data && Array.isArray(result.data.items)) {
        setParsedItems(result.data.items);
        if (result.data.suggestedMeal) {
          setMealType(result.data.suggestedMeal as MealType);
        }
      } else {
        throw new Error("Invalid response structure from AI parser");
      }
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || "Something went wrong while connecting to Gemini AI.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleConfirmAndAdd = () => {
    if (!parsedItems || parsedItems.length === 0) return;

    const entriesToBatch: Omit<DailyLogEntry, "id">[] = parsedItems.map((item) => ({
      date: selectedDate,
      meal: mealType,
      time: item.time || "10:30 AM",
      foodItem: item.foodItem || "Unknown Food",
      category: (item.category as FoodCategory) || "Other",
      quantityGrams: Number(item.quantity) || 100,
      calories: Number(item.calories) || 0,
      protein: Number(item.protein) || 0,
      carbs: Number(item.carbs) || 0,
      fat: Number(item.fat) || 0,
      fiber: Number(item.fiber) || 0,
      waterMl: Number(item.water) || 0,
      walkKm: 0,
      notes: item.notes || "AI Natural Language Quick Log",
    }));

    addBatchLogEntries(entriesToBatch);
    alert(`Added ${entriesToBatch.length} food items to log for ${selectedDate}!`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200/90 rounded-2xl max-w-lg w-full p-6 shadow-xl space-y-5 text-xs animate-in fade-in zoom-in duration-150">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200">
              <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">AI Quick Meal Logger</h3>
              <p className="text-[11px] text-slate-500">Describe what you ate in plain text for automatic parsing</p>
            </div>
          </div>

          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-600 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Input Form */}
        <form onSubmit={handleParseMeal} className="space-y-3">
          <div>
            <label className="text-slate-700 font-medium block mb-1">
              Select Meal Category
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value as MealType)}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-2.5 font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Evening Snack">Evening Snack</option>
              <option value="Mid snack">Mid snack</option>
              <option value="Dinner">Dinner</option>
              <option value="Drink">Drink</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="text-slate-700 font-medium block mb-1">
              Describe your meal (quantities, items, notes)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g. 2 dosas with coconut chutney and 1 cup sambar for dinner..."
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none"
            />
          </div>

          {/* Sample prompts */}
          <div className="space-y-1">
            <span className="text-[10px] text-slate-500 font-semibold block">Try an example:</span>
            <div className="space-y-1">
              {samplePrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setDescription(prompt)}
                  className="block w-full text-left bg-slate-50 hover:bg-slate-100 p-2 rounded-xl text-[11px] text-slate-700 transition-colors border border-slate-200/80 truncate"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={isParsing || !description.trim()}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold rounded-xl shadow-xs flex items-center justify-center gap-2 transition-all"
          >
            {isParsing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-amber-300" />
                <span>Parsing with Gemini AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Parse Meal Details</span>
              </>
            )}
          </button>
        </form>

        {/* Error Message */}
        {errorMessage && (
          <div className="bg-rose-50 border border-rose-200 text-rose-700 p-3 rounded-xl flex items-center gap-2 text-xs">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Parsed Items Preview */}
        {parsedItems && parsedItems.length > 0 && (
          <div className="bg-blue-50/60 border border-blue-200 p-4 rounded-xl space-y-3">
            <h4 className="font-bold text-blue-900 text-xs flex items-center gap-1.5">
              <Check className="w-4 h-4 text-emerald-600" />
              Parsed {parsedItems.length} Food Item(s)
            </h4>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {parsedItems.map((item, idx) => (
                <div key={idx} className="bg-white p-2.5 rounded-xl border border-blue-100 flex justify-between items-center text-xs shadow-2xs">
                  <div>
                    <span className="font-bold text-slate-900 block">{item.foodItem} ({item.quantity}g)</span>
                    <span className="text-[10px] text-slate-500">{item.category} • {item.notes || "Auto-parsed"}</span>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-amber-600 block">{item.calories} kcal</span>
                    <span className="text-[10px] text-emerald-600">{item.protein}g P | {item.carbs}g C | {item.fat}g F</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleConfirmAndAdd}
              className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Confirm & Add All to Daily Log ({selectedDate})</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
