// lib/zenith-ai/contracts.ts
// The integration boundary for a future Zenith AI backend. NOTHING HERE IS IMPLEMENTED YET.
//
// The homepage only describes the service and collects launch-list requests (through /api/contact). These types
// fix the rules the real system must keep, so the front end and any backend agree on them from the start:
//   - "submitted" is a state reached only with a receipt from the sending channel, never because text was generated;
//   - discovery, preparation, submission and employer responses are separate records;
//   - email access is an OAuth grant held server-side, revocable, and never a password;
//   - CAPTCHAs, assessments and account logins are handed back to the candidate, never bypassed;
//   - allowances count confirmed submissions only.
// See docs/zenith-ai-career-automation.md for the infrastructure each part needs.

import type { ZenithAIPlanId } from "./plans";

/** An opening found in a supported source and scored against the candidate's profile. Not an application. */
export interface JobOpportunity {
  id: string;
  sourceId: string;            // which JobSourceAdapter found it
  url: string;
  title: string;
  employer: string;
  location: string;
  relevance: number;           // 0..1, from the candidate's own criteria
  duplicateOf?: string;        // set when the same opening was already seen in another source
  applyChannel: "email" | "portal_api" | "candidate_only";
}

export type ApplicationStatus =
  | "prepared"            // materials drafted for one opening
  | "awaiting_approval"   // the candidate asked to review before anything is sent
  | "approved"            // approved by the candidate, or by their own rule within their limits
  | "queued"              // waiting for a send window or the weekly limit
  | "submitted"           // ONLY with a SubmissionReceipt from the channel
  | "needs_candidate"     // CAPTCHA, assessment, login or extra verification: the candidate completes it
  | "failed"
  | "withdrawn";

/** Proof from the sending channel that the application was accepted. */
export interface SubmissionReceipt {
  channel: "email" | "portal_api";
  providerMessageId?: string;  // e.g. the email provider's message id
  portalReference?: string;    // e.g. the employer system's application reference
  confirmedAt: string;         // ISO time the channel confirmed it
}

export interface EmployerResponse { receivedAt: string; kind: "acknowledgement" | "rejection" | "interview_request" | "other"; detectedBy: "email_thread" | "portal" | "candidate" }
export interface InterviewEvent { scheduledFor: string; loggedBy: "candidate" | "calendar_integration" }

export interface ApplicationRecord {
  id: string;
  candidateId: string;
  opportunityId: string;
  status: ApplicationStatus;
  preparedAt: string;
  approvedAt?: string;
  receipt?: SubmissionReceipt; // required when status is "submitted"
  responses: EmployerResponse[];
  interviews: InterviewEvent[];
}

/** The candidate's own rules for a campaign. */
export interface CampaignSettings {
  targetRoles: string[];
  countries: string[];
  industries: string[];
  salary?: { min?: number; max?: number; currency: string };
  excludedEmployers: string[];
  weeklyLimit: number;
  reviewBeforeSend: boolean;
  responseTracking: boolean;   // reading replies needs its own, separate consent
  paused: boolean;
}

/** An email provider grant. The token itself lives encrypted on the server and never reaches the browser. */
export interface EmailAuthorization {
  provider: "google" | "microsoft" | "other_oauth";
  address: string;
  scopes: string[];            // the narrowest scopes that allow sending (and reading replies only if enabled)
  grantedAt: string;
  revokedAt?: string;
  tokenRef: string;            // reference to a server-side secret, never the token
}

export interface PlanEntitlement {
  planId: ZenithAIPlanId;
  submissionsIncluded: number | null; // null for a service-period plan (Gold), once its terms are approved
  submissionsUsed: number;            // confirmed submissions only
  servicePeriod?: { start: string; end: string };
}

/** A source of openings whose terms permit this use. */
export interface JobSourceAdapter {
  id: string;
  termsReviewedAt: string;
  search(criteria: Pick<CampaignSettings, "targetRoles" | "countries" | "industries">): Promise<JobOpportunity[]>;
}

/** A channel that can submit an application and prove it did. */
export interface SubmissionChannel {
  id: "email" | "portal_api";
  canSubmit(opportunity: JobOpportunity): boolean;
  submit(record: ApplicationRecord): Promise<SubmissionReceipt>;
}

/** The only application states that use a plan's allowance. */
export function countsTowardAllowance(record: ApplicationRecord): boolean {
  return record.status === "submitted" && record.receipt !== undefined;
}
