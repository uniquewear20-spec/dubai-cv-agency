// lib/agent/types.ts — shared types for the Zenith AI job-application agent (client and server).

export type SourceId = "himalayas" | "remotive" | "jobicy" | "arbeitnow" | "adzuna" | "jooble" | "manual";

export interface SalaryRange {
  min: number | null;
  max: number | null;
  currency: string | null; // ISO 4217, e.g. "USD"
  period: "year" | "month" | "day" | "hour" | null;
}

export interface Job {
  /** Stable id: `${source}:${source's own id}` */
  id: string;
  source: SourceId;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  /** The listing's own URL. Every source's terms require linking back to it. */
  url: string;
  /** Plain text (HTML removed), trimmed to a safe length. */
  description: string;
  postedAt: string | null; // ISO date
  salary: string | null;   // as listed, for display
  salaryRange: SalaryRange | null;
  tags: string[];
  /** An application email address published in the listing, if any. */
  applyEmail: string | null;
}

export interface SourceReport {
  id: SourceId;
  name: string;
  ok: boolean;
  count: number;
  /** False when the source needs a key that this site doesn't have. */
  configured: boolean;
  /** Not asked this time (for example a Germany-only source on a UAE search). */
  skipped?: boolean;
  note?: string;
  attribution: string;
  home: string;
}

export interface SearchRequest {
  roles: string[];
  countries: string[]; // ISO 3166-1 alpha-2 codes
  remote: boolean;     // include remote jobs
  onsite: boolean;     // include on-site / hybrid jobs
  keywords: string[];
}

export interface SearchResponse {
  jobs: Job[];
  sources: SourceReport[];
  fetchedAt: string;
}

export interface Profile {
  name: string;
  email: string;
  phone: string;
  headline: string;
  roles: string[];
  countries: string[]; // ISO codes
  remoteOk: boolean;
  onsiteOk: boolean;
  salaryMin: number | null;
  salaryCurrency: string;
  salaryPeriod: "month" | "year";
  languages: string[]; // canonical language names, see LANGUAGES
  skills: string[];
  excludeCompanies: string[];
  cvText: string;
  cvFileName: string | null;
  updatedAt: string | null;
}

export type AppStatus = "saved" | "prepared" | "submitted" | "interview" | "offer" | "rejected" | "withdrawn";

export interface Draft {
  kind: "ai" | "template";
  lang: "en" | "fr" | "ar";
  createdAt: string;
  fitSummary: string;
  tailoredSummary: string;
  /** Each highlight carries the CV sentence it comes from. */
  highlights: { text: string; evidence: string }[];
  coverLetter: string;
  /** Requirements of the job that the CV doesn't show. */
  gaps: string[];
  keywords: string[];
  /** Things the candidate must check before using the draft. */
  warnings: DraftWarning[];
}

export interface DraftWarning {
  /** figures: numbers that are in neither the CV nor the listing; skills: skills the CV doesn't show. */
  kind: "figures" | "skills";
  items: string[];
}

export interface Application {
  jobId: string;
  job: Job;
  status: AppStatus;
  score: number;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  followUpOn: string | null; // YYYY-MM-DD
  notes: string;
  draft: Draft | null;
  /** How it was submitted, as confirmed by the candidate. */
  channel: "employer site" | "email" | "zenith email" | "other" | null;
  history: { at: string; status: AppStatus }[];
}

export type Plan = "career-automation" | "executive-suite";

export interface Access {
  kind: "paypal" | "gumroad";
  /** PayPal order id or Gumroad license key. Kept only in this browser. */
  proof: string;
  plan: Plan;
  ref: string;
  verifiedAt: string;
}

export interface Usage {
  used: number;
  limit: number;
  period: "order" | "day";
}

export interface AgentStatus {
  ai: boolean;
  model: string | null;
  /** "shared" when usage is counted in a shared store; "per-instance" otherwise. */
  limits: "shared" | "per-instance";
  email: boolean;
  sources: { id: SourceId; name: string; configured: boolean }[];
  plans: { plan: Plan; drafts: number; period: Usage["period"]; sends: number }[];
}

export interface TailorRequest {
  access: Pick<Access, "kind" | "proof">;
  lang: "en" | "fr" | "ar";
  profile: Pick<Profile, "name" | "headline" | "roles" | "languages" | "skills">;
  cvText: string;
  job: Pick<Job, "title" | "company" | "location" | "description" | "url">;
}

export interface TailorResponse {
  draft: Draft;
  usage: Usage;
  /** Highlights removed because their quoted evidence isn't in the CV. */
  dropped: number;
}

export type AccessErrorCode =
  | "not-found" | "not-paid" | "pending" | "not-eligible" | "refunded"
  | "unavailable" | "not-configured" | "limit" | "ai-off" | "invalid";
