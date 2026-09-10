import React, { useRef, useState } from "react";
import { Database, Download, FileJson, LoaderCircle, Upload } from "lucide-react";
import {
  BACKUP_FILE_NAME,
  downloadTrackerBackup,
  getTrackerStorageBackend,
  importTrackerBackup,
  migrateTrackerStorageToIndexedDb,
} from "../../utils/trackerBackup";

export const SettingsView: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<string>();
  const [error, setError] = useState<string>();
  const [storageBackend, setStorageBackend] = useState(getTrackerStorageBackend);
  const [migrating, setMigrating] = useState(false);

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    try {
      await importTrackerBackup(await file.text());
      setError(undefined);
      setMessage("Backup imported. Reloading your tracker…");
      window.setTimeout(() => window.location.reload(), 500);
    } catch (importError) {
      setMessage(undefined);
      setError(importError instanceof Error ? importError.message : "Import failed.");
    }
  };

  const handleMigration = async () => {
    if (storageBackend === "indexeddb" || migrating) return;
    if (!window.confirm(
      "Migrate all NutriMetric data to IndexedDB? The localStorage copy will be removed only after the IndexedDB copy is verified.",
    )) return;

    setMigrating(true);
    setMessage(undefined);
    setError(undefined);
    try {
      const result = await migrateTrackerStorageToIndexedDb();
      const size = result.bytesMoved < 1024 * 1024
        ? `${Math.max(1, Math.round(result.bytesMoved / 1024))} KB`
        : `${(result.bytesMoved / (1024 * 1024)).toFixed(1)} MB`;
      setStorageBackend("indexeddb");
      setMessage(
        `Migrated and verified ${result.valuesMoved} data sets (${size}). IndexedDB is now active${
          result.persistentStorageGranted === true ? " with persistent-storage protection" : ""
        }.`,
      );
    } catch (migrationError) {
      setError(migrationError instanceof Error ? migrationError.message : "Migration failed. Your localStorage data was left unchanged.");
    } finally {
      setMigrating(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl pb-12">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-slate-900">Settings</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage browser storage and back up or restore all NutriMetric data.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-blue-50 p-2.5 text-blue-600">
            <FileJson className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">JSON backup</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Export creates one file named <span className="font-medium text-slate-700">{BACKUP_FILE_NAME}</span>.
              Import replaces the tracker data currently stored in this browser.
            </p>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={async () => {
              try {
                await downloadTrackerBackup();
                setError(undefined);
                setMessage("Backup downloaded successfully.");
              } catch (exportError) {
                setMessage(undefined);
                setError(exportError instanceof Error ? exportError.message : "Export failed.");
              }
            }}
            className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Download className="h-4 w-4" />
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
          >
            <Upload className="h-4 w-4" />
            Import JSON
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="application/json,.json"
            onChange={handleImport}
            className="hidden"
          />
        </div>

        {message && <p className="mt-4 text-sm font-medium text-emerald-700">{message}</p>}
        {error && <p role="alert" className="mt-4 text-sm font-medium text-red-700">{error}</p>}
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
        <div className="mb-5 flex items-start gap-3">
          <div className="rounded-xl bg-violet-50 p-2.5 text-violet-600">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Browser database</h3>
            <p className="mt-1 text-sm leading-6 text-slate-500">
              Current storage: <span className="font-semibold text-slate-700">{storageBackend === "indexeddb" ? "IndexedDB" : "localStorage"}</span>.
              IndexedDB provides more room for future food logs while keeping all data on this device.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleMigration}
          disabled={storageBackend === "indexeddb" || migrating}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-violet-700 disabled:cursor-default disabled:bg-emerald-100 disabled:text-emerald-700"
        >
          {migrating ? <LoaderCircle className="h-4 w-4 animate-spin" /> : <Database className="h-4 w-4" />}
          {migrating ? "Migrating and verifying…" : storageBackend === "indexeddb" ? "Using IndexedDB" : "Migrate to IndexedDB"}
        </button>
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Migration does not replace JSON backups. Clearing this app’s browser data can still remove IndexedDB data.
        </p>
      </div>

    </section>
  );
};
