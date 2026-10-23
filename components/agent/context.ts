"use client";
// components/agent/context.ts — shared state of the agent app, provided by AgentApp.

import { createContext, useContext } from "react";
import type { AgentCopy } from "@/lib/agent/i18n";
import type { Access, AgentStatus, Application, Job, PackageKey, Profile, Usage } from "@/lib/agent/types";
import type { SavedSearch } from "@/lib/agent/store";
import type { Match } from "@/lib/agent/score";

export type View = "overview" | "profile" | "jobs" | "apps" | "interview" | "data";
export type Lang = "en" | "fr" | "ar";

export interface Scored { job: Job; match: Match }

export interface AgentState {
  lang: Lang;
  t: AgentCopy;
  ready: boolean;
  persistent: boolean;
  status: AgentStatus | null;
  profile: Profile;
  saveProfile: (p: Profile) => Promise<void>;
  apps: Application[];
  upsertApp: (a: Application) => Promise<void>;
  removeApp: (jobId: string) => Promise<void>;
  /** Saves a job as an application (status "saved") if it isn't one already. */
  saveJob: (s: Scored) => Promise<Application>;
  search: SavedSearch | null;
  scored: Scored[];
  searching: boolean;
  searchError: string | null;
  /** Searches with the profile's roles and countries; `related` overrides the profile's choice for this search. */
  runSearch: (opts?: { related?: boolean }) => Promise<void>;
  hidden: string[];
  hideJob: (id: string) => Promise<void>;
  access: Access | null;
  usage: { drafts: Usage; sends: Usage } | null;
  verifyAccess: (proof: string) => Promise<string | null>;
  forgetAccess: () => Promise<void>;
  setUsage: (u: Partial<{ drafts: Usage; sends: Usage }>) => void;
  consent: boolean;
  giveConsent: () => Promise<void>;
  go: (view: View, appId?: string) => void;
  /** Opens the interview coach, set up for a saved job. */
  practise: (jobId: string) => void;
  view: View;
  appId: string | null;
  /** The saved job to practise an interview for (#interview=<jobId>). */
  ivJob: string | null;
  countryLabel: (code: string) => string;
  /** Package names in the current language: one package, and the lists that include the coach and Pro. */
  pkg: { name: (k: PackageKey) => string; coach: string; pro: string };
  reload: () => Promise<void>;
}

export const AgentContext = createContext<AgentState | null>(null);

export function useAgent(): AgentState {
  const v = useContext(AgentContext);
  if (!v) throw new Error("useAgent must be used inside AgentApp");
  return v;
}
