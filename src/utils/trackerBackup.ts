export const TRACKER_STORAGE_KEYS = {
  selectedDate: "health_tracker_selected_date_v1",
  targets: "health_tracker_targets_v1",
  profile: "health_tracker_profile_v1",
  foodLibrary: "health_tracker_food_lib_v1",
  dailyLogs: "health_tracker_logs_v1",
  healthMetrics: "health_tracker_health_metrics_v1",
  labTests: "health_tracker_lab_tests_v1",
  foodCategories: "health_tracker_food_categories_v1",
} as const;

export const BACKUP_FILE_NAME = "nutrimetric-backup.json";

type BackupData = Record<keyof typeof TRACKER_STORAGE_KEYS, unknown>;

interface TrackerBackup {
  app: "NutriMetric";
  version: 1;
  exportedAt: string;
  data: BackupData;
}

export function createTrackerBackup(): TrackerBackup {
  const data = Object.fromEntries(
    Object.entries(TRACKER_STORAGE_KEYS).map(([name, storageKey]) => {
      const storedValue = localStorage.getItem(storageKey);
      if (storedValue === null) return [name, null];

      try {
        return [name, JSON.parse(storedValue)];
      } catch {
        return [name, storedValue];
      }
    }),
  ) as BackupData;

  return {
    app: "NutriMetric",
    version: 1,
    exportedAt: new Date().toISOString(),
    data,
  };
}

export function downloadTrackerBackup() {
  const backup = createTrackerBackup();
  const blob = new Blob([JSON.stringify(backup, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = BACKUP_FILE_NAME;
  link.click();
  URL.revokeObjectURL(url);
}

export function importTrackerBackup(contents: string) {
  let backup: unknown;

  try {
    backup = JSON.parse(contents);
  } catch {
    throw new Error("This file is not valid JSON.");
  }

  if (
    typeof backup !== "object" ||
    backup === null ||
    (backup as Partial<TrackerBackup>).app !== "NutriMetric" ||
    (backup as Partial<TrackerBackup>).version !== 1 ||
    typeof (backup as Partial<TrackerBackup>).data !== "object" ||
    (backup as Partial<TrackerBackup>).data === null
  ) {
    throw new Error("This is not a supported NutriMetric backup file.");
  }

  const data = (backup as TrackerBackup).data;
  const missingFields = Object.keys(TRACKER_STORAGE_KEYS).filter(
    (name) => name !== "foodCategories"
  ).filter(
    (name) => !(name in data),
  );

  if (missingFields.length > 0) {
    throw new Error(`Backup is incomplete: missing ${missingFields.join(", ")}.`);
  }

  Object.entries(TRACKER_STORAGE_KEYS).forEach(([name, storageKey]) => {
    if (!(name in data)) return;
    const value = data[name as keyof BackupData];
    if (value === null) {
      localStorage.removeItem(storageKey);
    } else {
      localStorage.setItem(
        storageKey,
        typeof value === "string" && name === "selectedDate"
          ? value
          : JSON.stringify(value),
      );
    }
  });
}

export function deleteAllTrackerData() {
  Object.values(TRACKER_STORAGE_KEYS).forEach((storageKey) => {
    localStorage.removeItem(storageKey);
  });
}
