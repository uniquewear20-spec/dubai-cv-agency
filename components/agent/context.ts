"use client";
// components/agent/context.ts — shared state of the agent app, provided by AgentApp.

import { createContext, useContext } from "react";
import type { AgentCopy } from "@/lib/agent/i18n";
import type { Access, AgentStatus, Application, Job, Profile, Usage } from "@/lib/agent/types";
import type { SavedSearch } from "@/lib/agent/store";
import type { Match } from "@/lib/agent/score";

export type View = "overview" | "profile" | "jobs" | "apps" | "data";
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
  runSearch: () => Promise<void>;
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
  view: View;
  appId: string | null;
  countryLabel: (code: string) => string;
  reload: () => Promise<void>;
}

export const AgentContext = createContext<AgentState | null>(null);

export function useAgent(): AgentState {
  const v = useContext(AgentContext);
  if (!v) throw new Error("useAgent must be used inside AgentApp");
  return v;
}
