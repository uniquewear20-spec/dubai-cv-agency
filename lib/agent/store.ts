// lib/agent/store.ts — browser only. Everything the agent keeps lives here, in this browser's
// IndexedDB ("zenith-agent"). Nothing is sent to Zenith to be stored. When IndexedDB isn't
// available (some private windows), data lives in memory for this tab only.

import type { Access, Application, Profile, SearchQuery, SearchRequest, SearchResponse } from "./types";
import type { IvActive, IvPrefs, IvRecord } from "./interview/types";

const DB = "zenith-agent";
const VERSION = 1;

export interface SavedSearch { request: SearchRequest; response: SearchResponse; at: string }

/** The CV file as the candidate uploaded it, kept in this browser so they can download it again. */
export interface StoredCv { name: string; type: string; size: number; at: string; data: Blob }

export interface KV {
  profile: Profile;
  /** Not part of exports (a file, possibly large); deleted with the CV or with everything. */
  "cv-file": StoredCv;
  access: Access;
  "ai-consent": { at: string };
  search: SavedSearch;
  /** The search form as last used. */
  "search-query": SearchQuery;
  hidden: string[];
  /** Interview coach: finished interviews with their reports, newest first (at most 50). */
  interviews: IvRecord[];
  /** Interview coach: the interview in progress. Not part of exports. */
  "interview-active": IvActive;
  /** Interview coach: the last setup choices. */
  "interview-prefs": IvPrefs;
}

export interface ExportFile {
  format: "zenith-agent-export";
  version: 1;
  exportedAt: string;
  kv: Partial<KV>;
  applications: Application[];
}

let dbPromise: Promise<IDBDatabase | null> | null = null;
const memKV = new Map<string, unknown>();
const memApps = new Map<string, Application>();

function open(): Promise<IDBDatabase | null> {
  if (!dbPromise) {
    dbPromise = new Promise(resolve => {
      try {
        if (typeof indexedDB === "undefined") return resolve(null);
        const req = indexedDB.open(DB, VERSION);
        // Some iPhone browsers never answer the first open: after 2.5 s, use this tab's memory.
        const late = window.setTimeout(() => resolve(null), 2500);
        const done = (db: IDBDatabase | null) => { window.clearTimeout(late); resolve(db); };
        req.onupgradeneeded = () => {
          const db = req.result;
          if (!db.objectStoreNames.contains("kv")) db.createObjectStore("kv");
          if (!db.objectStoreNames.contains("apps")) db.createObjectStore("apps", { keyPath: "jobId" });
        };
        req.onsuccess = () => done(req.result);
        req.onerror = () => done(null);
        req.onblocked = () => done(null);
      } catch {
        resolve(null);
      }
    });
  }
  return dbPromise;
}

export async function persistent(): Promise<boolean> {
  return (await open()) !== null;
}

function run<T>(db: IDBDatabase, store: string, mode: IDBTransactionMode, fn: (s: IDBObjectStore) => IDBRequest<T> | void): Promise<T | undefined> {
  return new Promise(resolve => {
    // A storage call that fails or never answers must not leave the agent loading forever.
    const late = window.setTimeout(() => resolve(undefined), 4000);
    const finish = (v: T | undefined) => { window.clearTimeout(late); resolve(v); };
    try {
      const tx = db.transaction(store, mode);
      const s = tx.objectStore(store);
      const r = fn(s);
      let value: T | undefined;
      if (r) r.onsuccess = () => { value = r.result; };
      tx.oncomplete = () => finish(value);
      tx.onerror = () => { console.warn("[agent/store]", tx.error?.name); finish(undefined); };
      tx.onabort = () => finish(undefined);
    } catch (err) {
      console.warn("[agent/store]", err instanceof Error ? err.name : err);
      finish(undefined);
    }
  });
}

export async function getKV<K extends keyof KV>(key: K): Promise<KV[K] | undefined> {
  const db = await open();
  if (!db) return memKV.get(key) as KV[K] | undefined;
  return (await run<KV[K]>(db, "kv", "readonly", s => s.get(key) as IDBRequest<KV[K]>)) ?? undefined;
}

export async function setKV<K extends keyof KV>(key: K, value: KV[K]): Promise<void> {
  const db = await open();
  if (!db) { memKV.set(key, value); return; }
  await run(db, "kv", "readwrite", s => { s.put(value, key); });
}

export async function delKV(key: keyof KV): Promise<void> {
  const db = await open();
  if (!db) { memKV.delete(key); return; }
  await run(db, "kv", "readwrite", s => { s.delete(key); });
}

export async function allApps(): Promise<Application[]> {
  const db = await open();
  const list = db ? ((await run<Application[]>(db, "apps", "readonly", s => s.getAll() as IDBRequest<Application[]>)) ?? []) : [...memApps.values()];
  return list.sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function putApp(app: Application): Promise<void> {
  const db = await open();
  if (!db) { memApps.set(app.jobId, app); return; }
  await run(db, "apps", "readwrite", s => { s.put(app); });
}

export async function delApp(jobId: string): Promise<void> {
  const db = await open();
  if (!db) { memApps.delete(jobId); return; }
  await run(db, "apps", "readwrite", s => { s.delete(jobId); });
}

const KV_KEYS: (keyof KV)[] = ["profile", "access", "ai-consent", "search", "hidden", "interviews", "interview-prefs"];

export async function exportAll(): Promise<ExportFile> {
  const kv: Partial<KV> = {};
  for (const k of KV_KEYS) {
    const v = await getKV(k);
    if (v !== undefined) (kv as Record<string, unknown>)[k] = v;
  }
  return { format: "zenith-agent-export", version: 1, exportedAt: new Date().toISOString(), kv, applications: await allApps() };
}

export function isExport(x: unknown): x is ExportFile {
  const e = x as ExportFile;
  return Boolean(e && e.format === "zenith-agent-export" && e.version === 1 && Array.isArray(e.applications) && typeof e.kv === "object");
}

export async function importAll(file: ExportFile): Promise<void> {
  await wipeAll(false);
  for (const k of KV_KEYS) {
    const v = file.kv[k];
    if (v !== undefined) await setKV(k, v as never);
  }
  for (const a of file.applications) if (a && typeof a.jobId === "string" && a.job) await putApp(a);
}

/** Deletes everything the agent stored in this browser. */
export async function wipeAll(dropDatabase = true): Promise<void> {
  memKV.clear();
  memApps.clear();
  const db = await open();
  if (!db) return;
  await run(db, "kv", "readwrite", s => { s.clear(); });
  await run(db, "apps", "readwrite", s => { s.clear(); });
  if (dropDatabase) {
    db.close();
    dbPromise = null;
    await new Promise<void>(resolve => {
      try {
        const r = indexedDB.deleteDatabase(DB);
        r.onsuccess = r.onerror = r.onblocked = () => resolve();
      } catch {
        resolve();
      }
    });
  }
}
