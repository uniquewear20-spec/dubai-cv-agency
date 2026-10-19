// app/api/agent/search/route.ts — job search for the Zenith AI agent.
// Receives only the search terms (roles, countries, keywords): never the CV. Matching against
// the CV happens in the visitor's browser. Open to everyone; rate-limited per visitor.

import type { NextRequest } from "next/server";
import { searchJobs } from "@/lib/agent/sources";
import { allow, clientIp } from "@/lib/agent/limits";
import { countryByCode } from "@/lib/agent/countries";
import { fail, ok, readJson, strings } from "@/lib/agent/http";

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  if (!allow("search", clientIp(req.headers), 12, 60_000)) return fail("Too many searches. Wait a minute and try again.", 429);
  const body = await readJson<Record<string, unknown>>(req, 10_000);
  if (!body) return fail("Invalid request.", 400);

  const roles = strings(body.roles, 3, 80);
  const keywords = strings(body.keywords, 6, 40);
  const countries = strings(body.countries, 5, 2).map(c => c.toUpperCase()).filter(c => countryByCode(c));
  const remote = body.remote !== false;
  const onsite = body.onsite !== false;
  if (!roles.length) return fail("Add at least one target role.", 400);
  if (!remote && !onsite) return fail("Choose remote, on-site or both.", 400);

  const result = await searchJobs({ roles, keywords, countries, remote, onsite });
  return ok(result);
}

export async function GET() {
  return fail("Method not allowed.", 405);
}
