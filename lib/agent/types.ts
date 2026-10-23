// lib/agent/types.ts — shared types for the Zenith AI job-application agent (client and server).

export type SourceId = "workable" | "himalayas" | "remotive" | "jobicy" | "arbeitnow" | "adzuna" | "jooble" | "manual";

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
  /** When the listing's own page was last loaded and still open (sources that allow checking), ISO date. */
  checkedAt?: string | null;
  /** The same job (title and employer) posted for other cities of the same country, shown as one listing. */
  alsoAt?: { location: string; url: string }[];
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
  /** Listings the source returned that were a different job (a chef listing on a bartender search), not shown. */
  unrelated?: number;
  /** Listings that had closed by the time they were checked, not shown. */
  closed?: number;
  /** Listings shown once because another listing was the same job (same title, employer and city). */
  duplicates?: number;
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
  /** Also search neighbouring titles (head bartender, barback… for "bartender"). */
  related?: boolean;
}

/** How one target role was searched: spelling fixed, other titles for the same job, neighbours. */
export interface RoleSearch {
  input: string;
  /** What was searched for (the input with likely typos fixed). */
  role: string;
  corrected: boolean;
  /** The job as the agent understood it, e.g. "Bartender", or null when it isn't a job it knows. */
  job: string | null;
  /** Other titles for the same job that were searched or matched. */
  sameTitles: string[];
  /** Neighbouring jobs the candidate can include. */
  related: string[];
}

export interface SearchResponse {
  jobs: Job[];
  sources: SourceReport[];
  fetchedAt: string;
  /** One per target role (absent in searches saved before 23 Oct 2026). */
  roles?: RoleSearch[];
}

/** A job from the candidate's work history, as read from the CV and confirmed by them. */
export interface WorkEntry {
  title: string;
  employer: string;
  /** YYYY-MM, or YYYY when only the year is known. */
  start: string | null;
  end: string | null;
  current: boolean;
  /** False when a date has no month or the end is missing: shown to the candidate to check. */
  datesSure: boolean;
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
  /** Also search neighbouring titles (optional: profiles saved before 23 Oct 2026 don't have it). */
  relatedTitles?: boolean;
  salaryMin: number | null;
  salaryCurrency: string;
  salaryPeriod: "month" | "year";
  languages: string[]; // canonical language names, see LANGUAGES
  skills: string[];
  excludeCompanies: string[];
  cvText: string;
  cvFileName: string | null;
  /** Read from the CV and confirmed by the candidate (absent in profiles saved before 23 Oct 2026). */
  location?: string;
  experience?: WorkEntry[];
  yearsExperience?: number | null;
  education?: string[];
  certifications?: string[];
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
