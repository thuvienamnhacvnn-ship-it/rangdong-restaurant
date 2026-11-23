"use client";
import { useState } from "react";
import { Frame } from "@/components/Frame";
import { useLang } from "@/components/LangProvider";
import { Ico, IC } from "@/components/BookingPage";
import { SITE } from "@/lib/site";
import { U } from "@/lib/ui";

function MapSvg({ label }: { label: string }) {
  return (
    <svg className="ct-map" viewBox="0 0 800 520" preserveAspectRatio="xMidYMid slice" role="img" aria-label={label}>
      <defs>
        <linearGradient id="mg" x1="0" x2="1"><stop offset="0" stopColor="#8f6a32" /><stop offset=".5" stopColor="#f1cf83" /><stop offset="1" stopColor="#8f6a32" /></linearGradient>
      </defs>
      <rect width="800" height="520" fill="#120b08" />
      {/* Blöcke */}
      <g fill="#241610" stroke="#3b2616" strokeWidth="1">
        <rect x="30" y="30" width="150" height="110" rx="6" /><rect x="200" y="20" width="130" height="90" rx="6" /><rect x="350" y="40" width="120" height="70" rx="6" />
        <rect x="520" y="30" width="110" height="100" rx="6" /><rect x="660" y="40" width="110" height="80" rx="6" />
        <rect x="40" y="170" width="120" height="90" rx="6" /><rect x="200" y="150" width="100" height="70" rx="6" />
        <rect x="560" y="170" width="90" height="70" rx="6" /><rect x="680" y="190" width="90" height="90" rx="6" />
        <rect x="360" y="330" width="130" height="80" rx="6" /><rect x="520" y="360" width="120" height="100" rx="6" /><rect x="180" y="420" width="140" height="80" rx="6" />
      </g>
      {/* Park + Wasser */}
      <rect x="60" y="300" width="250" height="150" rx="14" fill="#16281a" opacity=".9" />
      <ellipse cx="190" cy="400" rx="46" ry="22" fill="#12253a" />
      <g fill="#2b4a2e"><circle cx="100" cy="330" r="12" /><circle cx="135" cy="345" r="10" /><circle cx="230" cy="330" r="12" /><circle cx="270" cy="360" r="10" /><circle cx="110" cy="420" r="10" /><circle cx="280" cy="425" r="9" /></g>
      {/* Straßen */}
      <g stroke="#3a2815" strokeWidth="16" strokeLinecap="round" fill="none"><path d="M0 150H800M0 285H800M0 480H800" /><path d="M190 0V520M340 0V520M500 0V520M650 0V520" /></g>
      <g stroke="#b8893f" strokeWidth="1.2" fill="none" opacity=".6"><path d="M0 150H800M0 285H800M0 480H800M190 0V520M340 0V520M500 0V520M650 0V520" /></g>
      {/* Hauptstraße */}
      <path d="M-20 420 L820 110" stroke="#5a3d17" strokeWidth="30" strokeLinecap="round" />
      <path d="M-20 420 L820 110" stroke="url(#mg)" strokeWidth="2.5" />
      {/* Berg + Sonne */}
      <circle cx="660" cy="470" r="52" fill="#a8221d" opacity=".9" />
      <path d="M520 520 L640 400 L700 450 L760 520 Z" fill="#241610" stroke="url(#mg)" strokeWidth="2" />
      <path d="M622 420 L640 400 L658 421 L646 414 L640 424 L632 414 Z" fill="#f1cf83" />
      {/* Pin */}
      <g transform="translate(420 215)">
        <ellipse cx="0" cy="46" rx="26" ry="8" fill="none" stroke="#e8c47d" strokeWidth="1.5" opacity=".7" />
        <path d="M0 44 C-26 18 -28 -4 -28 -12 A28 28 0 0 1 28 -12 C28 -4 26 18 0 44z" fill="#a8221d" stroke="#f1cf83" strokeWidth="2.5" />
        <path d="M-9 -10c3 -2 6 -2 9 0 3 -2 6 -2 9 0-3 6-6 9-9 9-3 0-6-3-9-9z" fill="#f1cf83" />
      </g>
    </svg>
  );
}

export default function ContactPage() {
  const { lang } = useLang();
  const c = U[lang].contact;
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [out, setOut] = useState<{ mailto: string; wa: string } | null>(null);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const er: Record<string, string> = {};
    if (!d.name || d.name.trim().length < 2) er.name = c.eName;
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email || "")) er.email = c.eMail;
    if (!d.message || d.message.trim().length < 3) er.message = c.eMsg;
    setErrs(er);
    if (Object.keys(er).length) { setOut(null); return; }
    const body = `Nachricht über die Website\n\nName: ${d.name}\nE-Mail: ${d.email}\n${d.phone ? `Telefon: ${d.phone}\n` : ""}\n${d.message}`;
    const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(`Kontaktanfrage – ${d.name}`)}&body=${encodeURIComponent(body)}`;
    const wa = `${SITE.whatsappUrl}?text=${encodeURIComponent(body)}`;
    setOut({ mailto, wa });
    window.location.href = mailto;
  }
  const ar = (k: string) => ({ "aria-invalid": errs[k] ? true : undefined, "aria-describedby": errs[k] ? `ce-${k}` : undefined }) as const;
  const Err = ({ k }: { k: string }) => (errs[k] ? <span className="err" id={`ce-${k}`}>{errs[k]}</span> : null);

  return (
    <Frame title={c.title} className="ct-frame" seal={false}>
      <div className="ct-grid">
        <div className="ct-left">
          <div className="ct-info">
            <div className="ct-brand">
              <h2>Rạng Đông</h2>
              <p className="ct-tag">{c.tagline}</p>
              <p className="ct-intro">{c.intro}</p>
              <div className="ct-btns">
                <a className="gbtn red" href={`tel:${SITE.phoneTel}`}><Ico d={IC.phone} />{c.call}</a>
                <a className="gbtn" href={SITE.mapsDir} target="_blank" rel="noopener noreferrer"><Ico d={IC.send} />{c.route}</a>
                <a className="gbtn" href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer"><Ico d={IC.wa} />WhatsApp</a>
              </div>
            </div>
            <dl className="ct-lines">
              <div><dt><Ico d={IC.pin} />{c.address}</dt><dd>{SITE.street} · {SITE.city}</dd></div>
              <div><dt><Ico d={IC.clock} />{c.hours}</dt><dd>{lang === "vi" ? "Vui lòng hỏi nhà hàng" : "Auf Anfrage"}</dd></div>
              <div><dt><Ico d={IC.phone} />{c.phone}</dt><dd><a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a></dd></div>
              <div><dt><Ico d={IC.mail} />{c.mail}</dt><dd><a href={`mailto:${SITE.email}`}>{SITE.email}</a></dd></div>
              <div><dt><Ico d={IC.wa} />{c.wa}</dt><dd><a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">{SITE.whatsappDisplay}</a></dd></div>
            </dl>
          </div>
          <form className="ct-form" onSubmit={submit} noValidate>
            <h3>{c.formT}</h3>
            <label className="fld"><Ico d={IC.user} /><span><b className="sr">{c.name}</b><input name="name" placeholder={c.name} autoComplete="name" {...ar("name")} /><Err k="name" /></span></label>
            <label className="fld"><Ico d={IC.mail} /><span><b className="sr">{c.email}</b><input name="email" type="email" placeholder={c.email} autoComplete="email" {...ar("email")} /><Err k="email" /></span></label>
            <label className="fld"><Ico d={IC.phone} /><span><b className="sr">{c.phoneF}</b><input name="phone" type="tel" placeholder={c.phoneF} autoComplete="tel" /></span></label>
            <label className="fld grow"><Ico d={IC.note} /><span><b className="sr">{c.msg}</b><textarea name="message" rows={3} placeholder={c.msg} {...ar("message")} /><Err k="message" /></span></label>
            <button className="bk-send" type="submit"><Ico d={IC.send} />{c.send}</button>
            <div className={`bk-notice${out ? " show" : ""}`} role="status">
              {out && (<>{c.notice}<div className="row"><a className="gbtn" href={out.mailto}>{c.openMail}</a><a className="gbtn" href={out.wa} target="_blank" rel="noopener noreferrer">{c.sendWa}</a></div></>)}
            </div>
          </form>
        </div>
        <div className="ct-mapwrap">
          <MapSvg label={c.mapLabel} />
          <span className="ct-street" aria-hidden>Marzahner Chaussee</span>
          <div className="ct-plabel"><b>Rạng Đông</b><small>{SITE.street} · {SITE.city}</small></div>
          <div className="ct-mapbar"><span>{c.schem}</span><a className="gbtn gold" href={SITE.mapsSearch} target="_blank" rel="noopener noreferrer">{c.openMaps} ↗</a></div>
        </div>
      </div>
    </Frame>
  );
}
