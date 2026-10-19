"use client";
// components/site/useAgentStatus.ts — what the AI job agent can do right now on this server
// (/api/agent/status), fetched once per page. Until it arrives, callers show the cautious wording.

import { useEffect, useState } from "react";
import type { AgentStatus } from "@/lib/agent/types";

let request: Promise<AgentStatus | null> | null = null;

export function useAgentStatus(): AgentStatus | null {
  const [status, setStatus] = useState<AgentStatus | null>(null);
  useEffect(() => {
    let alive = true;
    request ??= fetch("/api/agent/status/").then(r => (r.ok ? (r.json() as Promise<AgentStatus>) : null)).catch(() => null);
    request.then(s => { if (alive) setStatus(s); });
    return () => { alive = false; };
  }, []);
  return status;
}
