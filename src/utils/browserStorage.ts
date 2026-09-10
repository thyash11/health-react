export type TrackerStorageBackend = "localstorage" | "indexeddb";

const STORAGE_BACKEND_KEY = "nutrimetric_storage_backend_v1";
const DATABASE_NAME = "nutrimetric-tracker";
const DATABASE_VERSION = 1;
const DATA_STORE = "app-data";

type StoredValues = Record<string, string | null>;
let indexedDbWriteQueue = Promise.resolve();

export const getTrackerStorageBackend = (): TrackerStorageBackend =>
  localStorage.getItem(STORAGE_BACKEND_KEY) === "indexeddb" ? "indexeddb" : "localstorage";

export const isIndexedDbSupported = () => typeof window !== "undefined" && "indexedDB" in window;

const openTrackerDatabase = () => new Promise<IDBDatabase>((resolve, reject) => {
  if (!isIndexedDbSupported()) {
    reject(new Error("IndexedDB is not supported by this browser."));
    return;
  }

  const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
  request.onupgradeneeded = () => {
    const database = request.result;
    if (!database.objectStoreNames.contains(DATA_STORE)) database.createObjectStore(DATA_STORE);
  };
  request.onsuccess = () => resolve(request.result);
  request.onerror = () => reject(request.error || new Error("Could not open IndexedDB."));
  request.onblocked = () => reject(new Error("IndexedDB is blocked by another open NutriMetric window."));
});

const transactionFinished = (transaction: IDBTransaction) => new Promise<void>((resolve, reject) => {
  transaction.oncomplete = () => resolve();
  transaction.onerror = () => reject(transaction.error || new Error("IndexedDB transaction failed."));
  transaction.onabort = () => reject(transaction.error || new Error("IndexedDB transaction was cancelled."));
});

const readIndexedDbValues = async (keys: readonly string[]): Promise<StoredValues> => {
  const database = await openTrackerDatabase();
  try {
    const transaction = database.transaction(DATA_STORE, "readonly");
    const finished = transactionFinished(transaction);
    const store = transaction.objectStore(DATA_STORE);
    const entries = await Promise.all(keys.map((key) => new Promise<[string, string | null]>((resolve, reject) => {
      const request = store.get(key);
      request.onsuccess = () => resolve([key, typeof request.result === "string" ? request.result : null]);
      request.onerror = () => reject(request.error || new Error(`Could not read ${key} from IndexedDB.`));
    })));
    await finished;
    return Object.fromEntries(entries);
  } finally {
    database.close();
  }
};

const writeIndexedDbValues = async (values: StoredValues) => {
  const database = await openTrackerDatabase();
  try {
    const transaction = database.transaction(DATA_STORE, "readwrite");
    const finished = transactionFinished(transaction);
    const store = transaction.objectStore(DATA_STORE);
    Object.entries(values).forEach(([key, value]) => {
      if (value === null) store.delete(key);
      else store.put(value, key);
    });
    await finished;
  } finally {
    database.close();
  }
};

const queueIndexedDbWrite = (values: StoredValues) => {
  const operation = indexedDbWriteQueue.then(() => writeIndexedDbValues(values));
  indexedDbWriteQueue = operation.catch(() => undefined);
  return operation;
};

const readLocalStorageValues = (keys: readonly string[]): StoredValues => Object.fromEntries(
  keys.map((key) => [key, localStorage.getItem(key)]),
);

export const readStorageValues = async (keys: readonly string[]) => {
  if (getTrackerStorageBackend() === "indexeddb") {
    await indexedDbWriteQueue;
    return readIndexedDbValues(keys);
  }
  return readLocalStorageValues(keys);
};

export const writeStorageValues = async (values: StoredValues) => {
  if (getTrackerStorageBackend() === "indexeddb") {
    await queueIndexedDbWrite(values);
    return;
  }

  Object.entries(values).forEach(([key, value]) => {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  });
};

export const persistStorageValue = (key: string, value: string) => {
  if (getTrackerStorageBackend() === "indexeddb") {
    void queueIndexedDbWrite({ [key]: value }).catch((error) => {
      console.error(`Could not persist ${key} to IndexedDB.`, error);
    });
    return;
  }

  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Could not persist ${key} to localStorage.`, error);
  }
};

export interface StorageMigrationResult {
  bytesMoved: number;
  valuesMoved: number;
  persistentStorageGranted: boolean | null;
}

export const migrateStorageToIndexedDb = async (
  keys: readonly string[],
): Promise<StorageMigrationResult> => {
  if (!isIndexedDbSupported()) throw new Error("IndexedDB is not supported by this browser.");
  if (getTrackerStorageBackend() === "indexeddb") throw new Error("NutriMetric is already using IndexedDB.");

  const persistenceRequest = navigator.storage?.persist
    ? navigator.storage.persist().catch(() => false)
    : Promise.resolve<boolean | null>(null);
  const snapshot = readLocalStorageValues(keys);

  await writeIndexedDbValues(snapshot);
  const verification = await readIndexedDbValues(keys);
  const verificationFailed = keys.some((key) => verification[key] !== snapshot[key]);
  if (verificationFailed) {
    throw new Error("IndexedDB verification failed. Your localStorage data was left unchanged.");
  }

  localStorage.setItem(STORAGE_BACKEND_KEY, "indexeddb");
  keys.forEach((key) => localStorage.removeItem(key));

  return {
    bytesMoved: Object.values(snapshot).reduce((total, value) => total + (value ? new Blob([value]).size : 0), 0),
    valuesMoved: Object.values(snapshot).filter((value) => value !== null).length,
    persistentStorageGranted: await persistenceRequest,
  };
};
