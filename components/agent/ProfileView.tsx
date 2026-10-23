"use client";
// components/agent/ProfileView.tsx — the candidate's profile and CV. The CV file is read on the
// device (lib/agent/extract.ts) and its details are found there too (lib/agent/cvparse.ts); the
// candidate reviews them before anything is copied into the profile. Only this browser keeps them.

import { useEffect, useId, useMemo, useState, type ReactNode } from "react";
import { Download, FileUp, Plus, Trash2, X } from "lucide-react";
import { useAgent } from "./context";
import { ChipsInput, Notice } from "./parts";
import { extractCv } from "@/lib/agent/extract";
import { parseCv, type CvFacts } from "@/lib/agent/cvparse";
import { COUNTRIES, parseCountry } from "@/lib/agent/countries";
import { delKV, getKV, setKV, type StoredCv } from "@/lib/agent/store";
import { download } from "@/lib/agent/links";
import { LANGUAGES, extractSkills, norm, parseLanguages } from "@/lib/agent/text";
import type { Profile, WorkEntry } from "@/lib/agent/types";

const CURRENCIES = ["AED", "SAR", "QAR", "KWD", "BHD", "OMR", "USD", "EUR", "GBP", "CHF", "CAD", "MAD", "INR"];
const LANG_CODES: Record<string, string> = {
  English: "en", Arabic: "ar", French: "fr", German: "de", Spanish: "es", Italian: "it", Portuguese: "pt", Dutch: "nl", Russian: "ru",
  Mandarin: "zh", Hindi: "hi", Urdu: "ur", Tagalog: "tl", Turkish: "tr", Persian: "fa", Japanese: "ja", Korean: "ko", Polish: "pl", Swedish: "sv",
};
const DATE_RE = /^(19|20)\d{2}(-(0[1-9]|1[0-2]))?$/;

/** "2021-03" → "Mar 2021"; "2016" → "2016". */
function fmtMonth(d: string | null, lang: string): string {
  if (!d) return "";
  const [y, m] = d.split("-").map(Number);
  if (!m) return String(y);
  try { return new Date(Date.UTC(y, m - 1, 15)).toLocaleDateString(lang === "ar" ? "ar-AE" : lang === "fr" ? "fr-FR" : "en-GB", { month: "short", year: "numeric" }); }
  catch { return d; }
}

const kb = (n: number) => (n >= 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export default function ProfileView() {
  const { t, lang, profile, saveProfile, countryLabel, go } = useAgent();
  const [p, setP] = useState<Profile>(profile);
  const [reading, setReading] = useState(false);
  const [fileNote, setFileNote] = useState<{ tone: "ok" | "warn" | "error"; text: string } | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const [facts, setFacts] = useState<CvFacts | null>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [storedFile, setStoredFile] = useState<StoredCv | null>(null);
  const ids = { name: useId(), email: useId(), phone: useId(), headline: useId(), cv: useId(), file: useId(), salary: useId(), cur: useId(), per: useId(), where: useId(), years: useId() };

  useEffect(() => { void getKV("cv-file").then(f => setStoredFile(f ?? null)).catch(() => undefined); }, []);

  const dirty = JSON.stringify({ ...p, updatedAt: null }) !== JSON.stringify({ ...profile, updatedAt: null }) || Boolean(pendingFile);
  const set = <K extends keyof Profile>(k: K, v: Profile[K]) => { setP(prev => ({ ...prev, [k]: v })); setJustSaved(false); };

  const langName = useMemo(() => {
    let dn: Intl.DisplayNames | null = null;
    try { dn = new Intl.DisplayNames([lang], { type: "language" }); } catch { /* old browser */ }
    return (name: string) => (dn && LANG_CODES[name] ? dn.of(LANG_CODES[name]) ?? name : name);
  }, [lang]);

  const cvSkills = useMemo(() => (p.cvText ? extractSkills(p.cvText) : []), [p.cvText]);
  const newSkills = cvSkills.filter(s => !p.skills.some(x => norm(x) === norm(s)));

  const onFile = async (file: File | undefined) => {
    if (!file) return;
    setReading(true);
    setFileNote(null);
    setFacts(null);
    const r = await extractCv(file);
    setReading(false);
    if (r.ok) {
      setP(prev => ({ ...prev, cvText: r.text, cvFileName: file.name }));
      setPendingFile(file);
      setFileNote({ tone: "ok", text: t.profile.read(r.text.length, file.name) });
      setFacts(parseCv(r.text));
    } else {
      const text = r.reason === "too-big" ? t.profile.tooBig : r.reason === "old-doc" ? t.profile.oldDoc : r.reason === "scanned" ? t.profile.scanned
        : r.reason === "not-cv" ? t.profile.notCv : t.profile.readError;
      setFileNote({ tone: r.reason === "too-big" || r.reason === "not-cv" ? "error" : "warn", text });
    }
  };

  const save = async () => {
    if (pendingFile) {
      const stored: StoredCv = { name: pendingFile.name, type: pendingFile.type || "application/octet-stream", size: pendingFile.size, at: new Date().toISOString(), data: pendingFile };
      try { await setKV("cv-file", stored); setStoredFile(stored); } catch { /* storage full or blocked: the text is still saved */ }
      setPendingFile(null);
    }
    await saveProfile(p);
    setJustSaved(true);
  };

  const deleteFile = async () => {
    await delKV("cv-file");
    setStoredFile(null);
    setPendingFile(null);
  };

  const ready = p.name.trim() && p.roles.length && p.cvText.trim().length >= 200;
  const file = pendingFile ? { name: pendingFile.name, size: pendingFile.size, data: pendingFile as Blob } : storedFile;
  const hasFacts = Boolean(p.location || p.yearsExperience || p.experience?.length || p.education?.length || p.certifications?.length || facts);

  return (
    <div className="za-stack">
      <header>
        <h1 className="za-h1">{t.profile.h}</h1>
        <p className="za-lede">{t.profile.intro}</p>
      </header>

      <section className="za-panel" aria-labelledby={`${ids.cv}-h`}>
        <h2 id={`${ids.cv}-h`} className="za-h2">{t.profile.cvH}</h2>
        <div className="za-drop">
          <label htmlFor={ids.file} className="z-btn z-btn-quiet">
            <FileUp size={18} aria-hidden /> {reading ? t.profile.reading : t.profile.upload}
          </label>
          <input
            id={ids.file}
            type="file"
            className="z-sr"
            accept=".pdf,.docx,.txt,.doc,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
            onChange={e => { void onFile(e.target.files?.[0]); e.target.value = ""; }}
            disabled={reading}
          />
          <p className="za-hint">{t.profile.uploadHint}</p>
        </div>
        {fileNote && <Notice tone={fileNote.tone}>{fileNote.text}</Notice>}
        {facts && <CvReview facts={facts} p={p} onApply={next => { setP(next); setJustSaved(false); }} onClose={() => setFacts(null)} />}
        {file && (
          <p className="za-file-row">
            <span>{t.cv.file(file.name, kb(file.size))}</span>
            <button type="button" className="za-textlink" onClick={() => download(file.data, file.name)}><Download size={14} aria-hidden /> {t.cv.download}</button>
            <button type="button" className="za-textlink" onClick={() => void deleteFile()}><Trash2 size={14} aria-hidden /> {t.cv.deleteFile}</button>
          </p>
        )}
        <div className="za-field">
          <label htmlFor={ids.cv}>{t.profile.cvText}</label>
          <textarea id={ids.cv} className="za-textarea za-cv" value={p.cvText} onChange={e => set("cvText", e.target.value.slice(0, 30000))} aria-describedby={`${ids.cv}-hint`} dir="auto" />
          <p id={`${ids.cv}-hint`} className="za-hint">{t.profile.cvTextHint}</p>
        </div>
        {newSkills.length > 0 && (
          <div className="za-found">
            <p className="za-label-sm">{t.profile.found}</p>
            <ul className="za-chips">
              {newSkills.map(s => (
                <li key={s}><button type="button" className="za-chip za-chip-add-btn" onClick={() => set("skills", [...p.skills, s])}>+ {s}</button></li>
              ))}
            </ul>
            <button type="button" className="za-textlink" onClick={() => set("skills", [...p.skills, ...newSkills].slice(0, 40))}>{t.profile.addAll}</button>
          </div>
        )}
      </section>

      <section className="za-panel">
        <div className="za-grid-2">
          <div className="za-field">
            <label htmlFor={ids.name}>{t.profile.name}</label>
            <input id={ids.name} className="za-input" value={p.name} onChange={e => set("name", e.target.value.slice(0, 120))} autoComplete="name" dir="auto" />
          </div>
          <div className="za-field">
            <label htmlFor={ids.email}>{t.profile.email}</label>
            <input id={ids.email} type="email" className="za-input" value={p.email} onChange={e => set("email", e.target.value.slice(0, 160))} autoComplete="email" dir="ltr" />
          </div>
          <div className="za-field">
            <label htmlFor={ids.phone}>{t.profile.phone}</label>
            <input id={ids.phone} type="tel" className="za-input" value={p.phone} onChange={e => set("phone", e.target.value.slice(0, 40))} autoComplete="tel" dir="ltr" />
          </div>
          <div className="za-field">
            <label htmlFor={ids.headline}>{t.profile.headline}</label>
            <input id={ids.headline} className="za-input" value={p.headline} onChange={e => set("headline", e.target.value.slice(0, 200))} aria-describedby={`${ids.headline}-h`} dir="auto" />
            <p id={`${ids.headline}-h`} className="za-hint">{t.profile.headlineHint}</p>
          </div>
        </div>
      </section>

      <section className="za-panel">
        <div className="za-grid-2">
          <ChipsInput label={t.profile.roles} hint={t.profile.rolesHint} values={p.roles} onChange={v => set("roles", v)} max={3} addLabel={t.profile.add} removeLabel={t.profile.remove} />
          <ChipsInput
            label={t.profile.countries}
            hint={t.profile.countriesHint}
            values={p.countries}
            onChange={v => set("countries", v)}
            max={5}
            addLabel={t.profile.add}
            removeLabel={t.profile.remove}
            parse={parseCountry}
            invalidText={t.profile.countryUnknown}
            display={countryLabel}
            list={COUNTRIES.map(c => c[lang])}
          />
        </div>
        <fieldset className="za-fieldset">
          <legend>{t.profile.work}</legend>
          <label className="za-check"><input type="checkbox" checked={p.remoteOk} onChange={e => set("remoteOk", e.target.checked)} /> {t.profile.remote}</label>
          <label className="za-check"><input type="checkbox" checked={p.onsiteOk} onChange={e => set("onsiteOk", e.target.checked)} /> {t.profile.onsite}</label>
        </fieldset>
        <div className="za-field">
          <label htmlFor={ids.salary}>{t.profile.salary}</label>
          <div className="za-inline">
            <input
              id={ids.salary}
              type="number"
              inputMode="numeric"
              min={0}
              className="za-input za-input-num"
              value={p.salaryMin ?? ""}
              onChange={e => set("salaryMin", e.target.value ? Math.max(0, Math.round(Number(e.target.value))) : null)}
              aria-describedby={`${ids.salary}-h`}
              dir="ltr"
            />
            <select id={ids.cur} className="za-select" value={p.salaryCurrency} onChange={e => set("salaryCurrency", e.target.value)} aria-label={t.profile.salary}>
              {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <select id={ids.per} className="za-select" value={p.salaryPeriod} onChange={e => set("salaryPeriod", e.target.value === "year" ? "year" : "month")} aria-label={t.profile.salary}>
              <option value="month">{t.profile.perMonth}</option>
              <option value="year">{t.profile.perYear}</option>
            </select>
          </div>
          <p id={`${ids.salary}-h`} className="za-hint">{t.profile.salaryHint}</p>
        </div>
      </section>

      <section className="za-panel">
        <div className="za-grid-2">
          <ChipsInput
            label={t.profile.languages}
            values={p.languages}
            onChange={v => set("languages", v)}
            max={10}
            addLabel={t.profile.add}
            removeLabel={t.profile.remove}
            parse={raw => parseLanguages(raw)[0] ?? (raw.trim() ? raw.trim().slice(0, 40) : null)}
            display={langName}
            list={LANGUAGES.map(l => langName(l.name))}
          />
          <ChipsInput label={t.profile.skills} hint={t.profile.skillsHint} values={p.skills} onChange={v => set("skills", v)} max={40} addLabel={t.profile.add} removeLabel={t.profile.remove} />
          <ChipsInput label={t.profile.exclude} values={p.excludeCompanies} onChange={v => set("excludeCompanies", v)} max={30} addLabel={t.profile.add} removeLabel={t.profile.remove} />
        </div>
      </section>

      {hasFacts && (
        <section className="za-panel" aria-labelledby={`${ids.where}-h`}>
          <h2 id={`${ids.where}-h`} className="za-h2">{t.cv.factsH}</h2>
          <p className="za-body-text">{t.cv.factsIntro}</p>
          <div className="za-grid-2 za-facts-top">
            <div className="za-field">
              <label htmlFor={ids.where}>{t.cv.where}</label>
              <input id={ids.where} className="za-input" value={p.location ?? ""} onChange={e => set("location", e.target.value.slice(0, 80))} dir="auto" />
            </div>
            <div className="za-field">
              <label htmlFor={ids.years}>{t.cv.yearsLabel}</label>
              <input id={ids.years} type="number" inputMode="decimal" min={0} max={60} step={0.5} className="za-input za-input-num" value={p.yearsExperience ?? ""}
                onChange={e => set("yearsExperience", e.target.value ? Math.min(60, Math.max(0, Number(e.target.value))) : null)} dir="ltr" />
            </div>
          </div>
          <WorkHistory jobs={p.experience ?? []} onChange={v => set("experience", v)} />
          <div className="za-grid-2 za-facts-lists">
            <ChipsInput label={t.cv.educationLabel} values={p.education ?? []} onChange={v => set("education", v)} max={10} addLabel={t.profile.add} removeLabel={t.profile.remove} split={false} parse={raw => raw.trim().slice(0, 160) || null} />
            <ChipsInput label={t.cv.certificationsLabel} values={p.certifications ?? []} onChange={v => set("certifications", v)} max={12} addLabel={t.profile.add} removeLabel={t.profile.remove} split={false} parse={raw => raw.trim().slice(0, 160) || null} />
          </div>
        </section>
      )}

      <div className="za-savebar" role="region" aria-label={t.profile.save}>
        {!ready && <p className="za-muted">{t.profile.needed}</p>}
        <p className="za-save-state" aria-live="polite">{dirty ? t.profile.unsaved : justSaved || profile.updatedAt ? t.profile.saved : ""}</p>
        <button type="button" className="z-btn z-btn-primary" onClick={() => void save()} disabled={!dirty}>{t.profile.save}</button>
        {!dirty && p.roles.length > 0 && <button type="button" className="z-btn z-btn-quiet" onClick={() => go("jobs")}>{t.overview.find}</button>}
      </div>
    </div>
  );
}

/**
 * What the agent read in the CV, for the candidate to tick before anything reaches the profile.
 * Each item says whether it is written in the CV or worked out by the agent, and when to check it.
 * Contacts are ticked only where the profile is empty; target roles and countries are never ticked
 * for the candidate.
 */
function CvReview({ facts, p, onApply, onClose }: { facts: CvFacts; p: Profile; onApply: (next: Profile) => void; onClose: () => void }) {
  const { t, lang, countryLabel } = useAgent();
  const c = t.cv;
  const id = useId();
  const [sel, setSel] = useState<Record<string, boolean>>(() => {
    const s: Record<string, boolean> = {
      name: Boolean(facts.name && !p.name.trim()),
      email: Boolean(facts.email && !p.email.trim()),
      phone: Boolean(facts.phone && !p.phone.trim()),
      headline: Boolean(facts.headline && !p.headline.trim()),
      location: Boolean(facts.location && !p.location?.trim()),
      country: false,
      languages: Boolean(facts.languages),
      skills: Boolean(facts.skills),
      jobs: Boolean(facts.jobs),
      years: Boolean(facts.years),
      education: Boolean(facts.education),
      certifications: Boolean(facts.certifications),
    };
    for (const r of facts.roles?.value ?? []) s[`role:${r}`] = false;
    return s;
  });
  const [done, setDone] = useState(false);
  const toggle = (k: string) => { setSel(prev => ({ ...prev, [k]: !prev[k] })); setDone(false); };
  const country = facts.location?.value.country ?? null;
  const any = Object.keys(facts).some(k => k !== "achievements" && k !== "leadership");

  const apply = () => {
    const next: Profile = { ...p };
    if (sel.name && facts.name) next.name = facts.name.value;
    if (sel.email && facts.email) next.email = facts.email.value;
    if (sel.phone && facts.phone) next.phone = facts.phone.value;
    if (sel.headline && facts.headline) next.headline = facts.headline.value.slice(0, 200);
    if (sel.location && facts.location) next.location = facts.location.value.text;
    if (sel.country && country && !next.countries.includes(country) && next.countries.length < 5) next.countries = [...next.countries, country];
    for (const r of facts.roles?.value ?? []) {
      if (sel[`role:${r}`] && next.roles.length < 3 && !next.roles.some(x => norm(x) === norm(r))) next.roles = [...next.roles, r];
    }
    if (sel.languages && facts.languages) {
      const names = facts.languages.value.map(l => l.name);
      next.languages = [...next.languages, ...names.filter(n => !next.languages.includes(n))].slice(0, 10);
    }
    if (sel.skills && facts.skills) next.skills = [...next.skills, ...facts.skills.value.filter(s => !next.skills.some(x => norm(x) === norm(s)))].slice(0, 40);
    if (sel.jobs && facts.jobs) next.experience = facts.jobs.value;
    if (sel.years && facts.years) next.yearsExperience = facts.years.value;
    if (sel.education && facts.education) next.education = facts.education.value;
    if (sel.certifications && facts.certifications) next.certifications = facts.certifications.value;
    onApply(next);
    setDone(true);
  };

  // Plain functions, not components, so the checkboxes keep their focus when the list re-renders.
  const tags = (source: "cv" | "worked-out", sure: boolean) => (
    <span className="za-rev-tags">
      <span className="za-rev-tag" data-kind={source}>{source === "cv" ? c.fromCv : c.workedOut}</span>
      {!sure && <span className="za-rev-tag" data-kind="check">{c.check}</span>}
    </span>
  );
  const row = (k: string, label: string, value: ReactNode, f: { source: "cv" | "worked-out"; sure: boolean }) => (
    <li className="za-rev" key={k}>
      <label className="za-check za-rev-pick"><input type="checkbox" checked={Boolean(sel[k])} onChange={() => toggle(k)} /> <span>{label}</span></label>
      {value !== null && <div className="za-rev-v" dir="auto">{value}</div>}
      {tags(f.source, f.sure)}
    </li>
  );

  return (
    <div className="za-cvr" role="group" aria-labelledby={`${id}-h`}>
      <div className="za-cvr-head">
        <h3 id={`${id}-h`} className="za-h3">{c.reviewH}</h3>
        <button type="button" className="za-icon-btn" onClick={onClose} aria-label={c.close}><X size={17} aria-hidden /></button>
      </div>
      {!any ? <p className="za-body-text">{c.nothing}</p> : (
        <>
          <p className="za-body-text">{c.reviewIntro}</p>
          <ul className="za-revs">
            {facts.name && row("name", c.name, facts.name.value, facts.name)}
            {facts.email && row("email", c.email, <span dir="ltr">{facts.email.value}</span>, facts.email)}
            {facts.phone && row("phone", c.phone, <span dir="ltr">{facts.phone.value}</span>, facts.phone)}
            {facts.headline && row("headline", c.headline, facts.headline.value, facts.headline)}
            {facts.location && row("location", c.where, c.location(facts.location.value.text), facts.location)}
            {facts.location && country && !p.countries.includes(country) && row("country", c.addCountry(countryLabel(country)), null, { source: "worked-out", sure: false })}
            {facts.roles && (
              <li className="za-rev">
                <p className="za-rev-k">{c.roles}</p>
                <p className="za-hint">{c.rolesHint}</p>
                <div className="za-rev-roles">
                  {facts.roles.value.map(r => (
                    <label key={r} className="za-check"><input type="checkbox" checked={Boolean(sel[`role:${r}`])} onChange={() => toggle(`role:${r}`)} disabled={!sel[`role:${r}`] && p.roles.length >= 3} /> <span dir="auto">{r}</span></label>
                  ))}
                </div>
                {tags("worked-out", false)}
              </li>
            )}
            {facts.jobs && row("jobs", c.jobs(facts.jobs.value.length), (
                <ul className="za-rev-jobs">
                  {facts.jobs.value.map((j, i) => (
                    <li key={i}>
                      <strong>{j.title || "—"}</strong>{j.employer && <> · {j.employer}</>}
                      <span className="za-muted"> · {fmtMonth(j.start, lang)} – {j.current ? c.now : fmtMonth(j.end, lang)}</span>
                      {!j.datesSure && <span className="za-rev-warn"> ({c.checkDates})</span>}
                    </li>
                  ))}
                </ul>
              ), facts.jobs)}
            {facts.years && row("years", c.years(facts.years.value), null, facts.years)}
            {facts.languages && row("languages", c.languages, facts.languages.value.map(l => (l.level ? `${l.name} (${c.level[l.level] ?? l.level})` : l.name)).join(", "), facts.languages)}
            {facts.skills && row("skills", c.skills(facts.skills.value.length), facts.skills.value.join(", "), facts.skills)}
            {facts.education && row("education", c.education, <ul className="za-rev-list">{facts.education.value.map(e => <li key={e}>{e}</li>)}</ul>, facts.education)}
            {facts.certifications && row("certifications", c.certifications, <ul className="za-rev-list">{facts.certifications.value.map(e => <li key={e}>{e}</li>)}</ul>, facts.certifications)}
          </ul>
          <div className="za-actions">
            <button type="button" className="z-btn z-btn-primary z-btn-small" onClick={apply}>{c.apply}</button>
            {done && <p className="za-muted" role="status">{c.applied}</p>}
          </div>
        </>
      )}
    </div>
  );
}

/** The work history read from the CV, each job editable; dates as YYYY-MM or a year. */
function WorkHistory({ jobs, onChange }: { jobs: WorkEntry[]; onChange: (v: WorkEntry[]) => void }) {
  const { t } = useAgent();
  const c = t.cv;
  const id = useId();
  const update = (i: number, patch: Partial<WorkEntry>) => onChange(jobs.map((j, k) => {
    if (k !== i) return j;
    const n = { ...j, ...patch };
    const okStart = !n.start || DATE_RE.test(n.start);
    const okEnd = n.current || !n.end || DATE_RE.test(n.end);
    // Dates the candidate typed with a month count as checked.
    return { ...n, datesSure: okStart && okEnd && /-\d\d$/.test(n.start ?? "") && (n.current || /-\d\d$/.test(n.end ?? "")) };
  }));
  return (
    <div className="za-field za-jobs-edit">
      <p className="za-label-strong" id={`${id}-h`}>{c.jobsLabel}</p>
      <ul aria-labelledby={`${id}-h`}>
        {jobs.map((j, i) => (
          <li key={i} className="za-job-edit">
            <div className="za-grid-2">
              <div className="za-field"><label htmlFor={`${id}-${i}-t`}>{c.jobTitle}</label><input id={`${id}-${i}-t`} className="za-input" value={j.title} onChange={e => update(i, { title: e.target.value.slice(0, 120) })} dir="auto" /></div>
              <div className="za-field"><label htmlFor={`${id}-${i}-e`}>{c.employer}</label><input id={`${id}-${i}-e`} className="za-input" value={j.employer} onChange={e => update(i, { employer: e.target.value.slice(0, 120) })} dir="auto" /></div>
            </div>
            <div className="za-job-dates">
              <div className="za-field"><label htmlFor={`${id}-${i}-s`}>{c.from}</label><input id={`${id}-${i}-s`} className="za-input za-input-date" value={j.start ?? ""} placeholder={c.dateHint} onChange={e => update(i, { start: e.target.value.trim().slice(0, 7) || null })} dir="ltr" aria-invalid={j.start && !DATE_RE.test(j.start) ? true : undefined} /></div>
              <div className="za-field"><label htmlFor={`${id}-${i}-n`}>{c.to}</label><input id={`${id}-${i}-n`} className="za-input za-input-date" value={j.current ? "" : j.end ?? ""} placeholder={c.dateHint} disabled={j.current} onChange={e => update(i, { end: e.target.value.trim().slice(0, 7) || null })} dir="ltr" aria-invalid={!j.current && j.end && !DATE_RE.test(j.end) ? true : undefined} /></div>
              <label className="za-check"><input type="checkbox" checked={j.current} onChange={e => update(i, { current: e.target.checked, end: e.target.checked ? null : j.end })} /> {c.current}</label>
              <button type="button" className="za-icon-btn" onClick={() => onChange(jobs.filter((_, k) => k !== i))} aria-label={c.removeJob(j.title)}><Trash2 size={16} aria-hidden /></button>
            </div>
            {!j.datesSure && <p className="za-rev-warn za-hint">{c.checkDates}</p>}
          </li>
        ))}
      </ul>
      <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => onChange([...jobs, { title: "", employer: "", start: null, end: null, current: false, datesSure: false }].slice(0, 15))}>
        <Plus size={15} aria-hidden /> {c.addJob}
      </button>
    </div>
  );
}
