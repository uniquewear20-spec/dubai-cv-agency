"use client";
// components/agent/ProfileView.tsx — the candidate's profile and CV. The CV file is read on the
// device (lib/agent/extract.ts); only the text is kept, in this browser.

import { useId, useMemo, useState } from "react";
import { FileUp } from "lucide-react";
import { useAgent } from "./context";
import { ChipsInput, Notice } from "./parts";
import { extractCv } from "@/lib/agent/extract";
import { COUNTRIES, parseCountry } from "@/lib/agent/countries";
import { LANGUAGES, extractSkills, norm, parseLanguages } from "@/lib/agent/text";
import type { Profile } from "@/lib/agent/types";

const CURRENCIES = ["AED", "SAR", "QAR", "KWD", "BHD", "OMR", "USD", "EUR", "GBP", "CHF", "CAD", "MAD", "INR"];
const LANG_CODES: Record<string, string> = {
  English: "en", Arabic: "ar", French: "fr", German: "de", Spanish: "es", Italian: "it", Portuguese: "pt", Dutch: "nl", Russian: "ru",
  Mandarin: "zh", Hindi: "hi", Urdu: "ur", Tagalog: "tl", Turkish: "tr", Persian: "fa", Japanese: "ja", Korean: "ko", Polish: "pl", Swedish: "sv",
};

export default function ProfileView() {
  const { t, lang, profile, saveProfile, countryLabel, go } = useAgent();
  const [p, setP] = useState<Profile>(profile);
  const [reading, setReading] = useState(false);
  const [fileNote, setFileNote] = useState<{ tone: "ok" | "warn" | "error"; text: string } | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const ids = { name: useId(), email: useId(), phone: useId(), headline: useId(), cv: useId(), file: useId(), salary: useId(), cur: useId(), per: useId() };

  const dirty = JSON.stringify({ ...p, updatedAt: null }) !== JSON.stringify({ ...profile, updatedAt: null });
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
    const r = await extractCv(file);
    setReading(false);
    if (r.ok) {
      setP(prev => ({ ...prev, cvText: r.text, cvFileName: file.name }));
      setFileNote({ tone: "ok", text: t.profile.read(r.text.length, file.name) });
    } else {
      const text = r.reason === "too-big" ? t.profile.tooBig : r.reason === "old-doc" ? t.profile.oldDoc : r.reason === "scanned" ? t.profile.scanned : t.profile.readError;
      setFileNote({ tone: r.reason === "too-big" ? "error" : "warn", text });
    }
  };

  const save = async () => {
    await saveProfile(p);
    setJustSaved(true);
  };

  const ready = p.name.trim() && p.roles.length && p.cvText.trim().length >= 200;

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
            <input id={ids.name} className="za-input" value={p.name} onChange={e => set("name", e.target.value.slice(0, 120))} autoComplete="name" />
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
            <input id={ids.headline} className="za-input" value={p.headline} onChange={e => set("headline", e.target.value.slice(0, 200))} aria-describedby={`${ids.headline}-h`} />
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

      <div className="za-savebar" role="region" aria-label={t.profile.save}>
        {!ready && <p className="za-muted">{t.profile.needed}</p>}
        <p className="za-save-state" aria-live="polite">{dirty ? t.profile.unsaved : justSaved || profile.updatedAt ? t.profile.saved : ""}</p>
        <button type="button" className="z-btn z-btn-primary" onClick={() => void save()} disabled={!dirty}>{t.profile.save}</button>
        {!dirty && ready && <button type="button" className="z-btn z-btn-quiet" onClick={() => go("jobs")}>{t.overview.find}</button>}
      </div>
    </div>
  );
}
