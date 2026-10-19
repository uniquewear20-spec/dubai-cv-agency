"use client";
// components/agent/DataView.tsx — what the agent keeps and where, with export, import and delete.

import { useId, useState } from "react";
import Link from "next/link";
import { Download, Trash2, Upload } from "lucide-react";
import { useAgent } from "./context";
import { Modal, Notice, fmtDate } from "./parts";
import { exportAll, importAll, isExport, wipeAll } from "@/lib/agent/store";
import { download } from "@/lib/agent/links";

export default function DataView() {
  const { t, lang, profile, apps, search, access, reload, saveProfile } = useAgent();
  const [confirm, setConfirm] = useState(false);
  const [msg, setMsg] = useState<{ tone: "ok" | "error"; text: string } | null>(null);
  const id = useId();
  const drafts = apps.filter(a => a.draft).length;

  const doExport = async () => {
    const data = await exportAll();
    download(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }), `zenith-agent-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const doImport = async (file: File | undefined) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!isExport(parsed)) { setMsg({ tone: "error", text: t.data.importBad }); return; }
      await importAll(parsed);
      await reload();
      setMsg({ tone: "ok", text: t.data.imported });
    } catch {
      setMsg({ tone: "error", text: t.data.importBad });
    }
  };

  const deleteCv = async () => {
    await saveProfile({ ...profile, cvText: "", cvFileName: null });
    setMsg({ tone: "ok", text: t.data.deleted });
  };

  const deleteAll = async () => {
    await wipeAll();
    await reload();
    setConfirm(false);
    setMsg({ tone: "ok", text: t.data.deleted });
  };

  return (
    <div className="za-stack">
      <header>
        <h1 className="za-h1">{t.data.h}</h1>
        <p className="za-lede">{t.data.intro}</p>
      </header>

      <section className="za-panel">
        <table className="za-table">
          <thead><tr><th scope="col">{t.data.what}</th><th scope="col">{t.data.where}</th></tr></thead>
          <tbody>
            {t.data.rows.map(([what, where]) => <tr key={what}><th scope="row">{what}</th><td>{where}</td></tr>)}
          </tbody>
        </table>
        <p className="za-hint"><Link href="/privacy/" className="za-textlink">{t.data.policy}</Link></p>
      </section>

      <section className="za-panel" aria-labelledby={`${id}-h`}>
        <h2 id={`${id}-h`} className="za-h2">{t.data.stored}</h2>
        <ul className="za-bullets">
          <li>{t.data.profile(Boolean(profile.updatedAt), fmtDate(profile.updatedAt, lang))}</li>
          <li>{t.data.cv(profile.cvText.length)}</li>
          <li>{t.data.appsN(apps.length)} · {t.data.draftsN(drafts)}</li>
          <li>{t.data.searchAt(search ? fmtDate(search.at, lang) : null)}</li>
          <li>{t.data.accessOn(Boolean(access))}</li>
        </ul>
        {msg && <Notice tone={msg.tone}>{msg.text}</Notice>}
        <div className="za-actions">
          <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => void doExport()}><Download size={15} aria-hidden /> {t.data.export}</button>
          <label htmlFor={`${id}-imp`} className="z-btn z-btn-quiet z-btn-small"><Upload size={15} aria-hidden /> {t.data.import}</label>
          <input id={`${id}-imp`} type="file" accept="application/json,.json" className="z-sr" onChange={e => { void doImport(e.target.files?.[0]); e.target.value = ""; }} />
        </div>
        <p className="za-hint">{t.data.exportHint} {t.data.importHint}</p>
        <div className="za-actions za-danger-zone">
          <button type="button" className="z-btn z-btn-quiet z-btn-small" onClick={() => void deleteCv()} disabled={!profile.cvText}><Trash2 size={15} aria-hidden /> {t.data.deleteCv}</button>
          <button type="button" className="z-btn z-btn-quiet z-btn-small za-danger" onClick={() => setConfirm(true)}><Trash2 size={15} aria-hidden /> {t.data.deleteAll}</button>
        </div>
      </section>

      <Modal open={confirm} onClose={() => setConfirm(false)} title={t.data.deleteAll} closeLabel={t.common.close}>
        <p className="za-body-text">{t.data.deleteAllConfirm}</p>
        <div className="za-actions">
          <button type="button" className="z-btn z-btn-quiet" onClick={() => setConfirm(false)}>{t.common.cancel}</button>
          <button type="button" className="z-btn z-btn-primary" onClick={() => void deleteAll()}>{t.data.deleteAll}</button>
        </div>
      </Modal>
    </div>
  );
}
