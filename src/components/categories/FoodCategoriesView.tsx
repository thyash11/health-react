import React, { useState } from "react";
import { Check, Pencil, Plus, Tags, Trash2, X } from "lucide-react";
import { useTracker } from "../../context/TrackerContext";

export const FoodCategoriesView: React.FC = () => {
  const {
    foodCategories,
    foodLibrary,
    dailyLogs,
    addFoodCategory,
    renameFoodCategory,
    deleteFoodCategory,
  } = useTracker();
  const [newName, setNewName] = useState("");
  const [editing, setEditing] = useState<string>();
  const [editName, setEditName] = useState("");
  const [error, setError] = useState<string>();

  const runAction = (action: () => void | boolean) => {
    try {
      const result = action();
      if (result === false) return false;
      setError(undefined);
      return true;
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Could not update category.");
      return false;
    }
  };

  const handleAdd = (event: React.FormEvent) => {
    event.preventDefault();
    if (runAction(() => addFoodCategory(newName))) setNewName("");
  };

  const handleRename = (currentName: string) => {
    if (runAction(() => renameFoodCategory(currentName, editName))) setEditing(undefined);
  };

  return (
    <section className="mx-auto max-w-3xl pb-12">
      <div className="mb-6">
        <h2 className="flex items-center gap-2 text-2xl font-bold text-slate-900">
          <Tags className="h-6 w-6 text-blue-600" /> Food Categories
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Categories are saved locally and included in JSON backups. Renaming also updates existing records.
        </p>
      </div>

      <form onSubmit={handleAdd} className="mb-5 flex gap-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <input
          value={newName}
          onChange={(event) => setNewName(event.target.value)}
          placeholder="New category name"
          aria-label="New category name"
          className="min-w-0 flex-1 rounded-xl border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button type="submit" className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus className="h-4 w-4" /> Add
        </button>
      </form>

      {error && <p role="alert" className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p>}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {foodCategories.map((category, index) => {
          const foodCount = foodLibrary.filter((item) => item.category === category).length;
          const logCount = dailyLogs.filter((item) => item.category === category).length;
          const usageCount = foodCount + logCount;
          const isEditing = editing === category;

          return (
            <div key={category} className={`flex items-center gap-3 p-4 ${index ? "border-t border-slate-100" : ""}`}>
              <div className="min-w-0 flex-1">
                {isEditing ? (
                  <input
                    value={editName}
                    onChange={(event) => setEditName(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") handleRename(category);
                      if (event.key === "Escape") setEditing(undefined);
                    }}
                    autoFocus
                    className="w-full rounded-lg border border-blue-400 px-2.5 py-1.5 text-sm font-semibold outline-none ring-2 ring-blue-100"
                  />
                ) : (
                  <p className="truncate text-sm font-semibold text-slate-900">{category}</p>
                )}
                <p className="mt-1 text-xs text-slate-500">
                  {foodCount} library {foodCount === 1 ? "item" : "items"} · {logCount} log {logCount === 1 ? "entry" : "entries"}
                </p>
              </div>

              {isEditing ? (
                <>
                  <button type="button" onClick={() => handleRename(category)} aria-label={`Save ${category}`} className="rounded-lg p-2 text-emerald-600 hover:bg-emerald-50"><Check className="h-4 w-4" /></button>
                  <button type="button" onClick={() => setEditing(undefined)} aria-label="Cancel rename" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-4 w-4" /></button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => { setEditing(category); setEditName(category); setError(undefined); }}
                    aria-label={`Rename ${category}`}
                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                  ><Pencil className="h-4 w-4" /></button>
                  {usageCount === 0 && (
                    <button
                      type="button"
                      onClick={() => runAction(() => deleteFoodCategory(category))}
                      aria-label={`Delete ${category}`}
                      className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                    ><Trash2 className="h-4 w-4" /></button>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
