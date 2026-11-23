"use client";
import { useState } from "react";
import { Frame, Title } from "@/components/Frame";
import { useLang } from "@/components/LangProvider";
import { SITE } from "@/lib/site";
import { U } from "@/lib/ui";

interface Out { mailto: string; wa: string }
export const Ico = ({ d }: { d: string[] }) => <svg className="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d.map((x, i) => <path key={i} d={x} />)}</svg>;
export const IC = {
  user: ["M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8z", "M4 20a8 8 0 0 1 16 0"],
  phone: ["M5 3.5h3.5L10 8 8 9.5a11 11 0 0 0 6.5 6.5L16 14l4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5.5a2 2 0 0 1 2-2z"],
  cal: ["M7 3v3M17 3v3", "M4 8h16v12H4z", "M4 11.5h16"],
  clock: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 7v5l3 2"],
  people: ["M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11z", "M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20", "M16 4.8a3 3 0 0 1 0 5.8", "M17.5 14.2A4 4 0 0 1 21 18v2"],
  mail: ["M4 6h16v12H4z", "m4 7 8 6 8-6"],
  note: ["M4 20h4L19 9a2.5 2.5 0 0 0-4-4L4 16z", "M13.5 6.5l4 4"],
  pin: ["M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21z", "M12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z"],
  wa: ["M3.5 20.5 5 16A8.5 8.5 0 1 1 8 19z", "M9 9c0 3.5 2.5 6 6 6l1-1.5-2-1-1 .8a4 4 0 0 1-2-2l.8-1-1-2z"],
  info: ["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M12 11v5M12 8h.01"],
  send: ["M21 3 3 10l7 3 3 7z", "m10 13 11-10"],
};

export default function BookingPage() {
  const { lang } = useLang();
  const b = U[lang].book;
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [out, setOut] = useState<Out | null>(null);
  const today = new Date().toISOString().slice(0, 10);
  const opts = [1, 2, 3, 4, 5].map((n) => (n === 1 ? b.p1 : `${n} ${b.pN}`)).concat([`6+ ${b.pN}`]);

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const er: Record<string, string> = {};
    if (!d.name || d.name.trim().length < 2) er.name = b.eName;
    if (!d.phone || d.phone.replace(/\D/g, "").length < 6) er.phone = b.ePhone;
    const m = /^(\d{1,2})[./-](\d{1,2})[./-](\d{4})$/.exec((d.date || "").trim());
    let iso = "";
    if (m) { iso = `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`; const t = new Date(iso); if (isNaN(+t) || t.getDate() !== +m[1]) iso = ""; }
    if (!iso) er.date = b.eDate; else if (iso < today) er.date = b.ePast;
    setErrs(er);
    if (Object.keys(er).length) { setOut(null); return; }
    const [yy, mm, dd] = iso.split("-");
    const dt = `${dd}.${mm}.${yy}`;
    // Text an das (deutsche) Restaurant bleibt Deutsch.
    const body = `Reservierungsanfrage\n\nName: ${d.name}\nTelefon: ${d.phone}\nPersonen: ${d.persons}\nDatum: ${dt}\nWunschzeit: ${d.time || "-"}\n${d.email ? `E-Mail: ${d.email}\n` : ""}${d.message ? `Hinweise: ${d.message}\n` : ""}\nBitte um Bestätigung. Vielen Dank!`;
    const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent(`Reservierungsanfrage ${dt} – ${d.name}`)}&body=${encodeURIComponent(body)}`;
    const wa = `${SITE.whatsappUrl}?text=${encodeURIComponent(body)}`;
    setOut({ mailto, wa });
    window.location.href = mailto;
  }
  const ar = (k: string) => ({ "aria-invalid": errs[k] ? true : undefined, "aria-describedby": errs[k] ? `e-${k}` : undefined }) as const;
  const Err = ({ k }: { k: string }) => (errs[k] ? <span className="err" id={`e-${k}`}>{errs[k]}</span> : null);

  return (
    <Frame title={b.title} className="book-frame" head={false}>
      <div className="bk-grid">
        <form className="bk-form" onSubmit={submit} noValidate id="reservation-form">
          <Title title={b.title} sub={b.sub} seal={false} className="left" />
          <div className="bk-fields">
            <label className="fld"><Ico d={IC.user} /><span><b>{b.name} <i>*</i></b><input name="name" placeholder={b.namePh} autoComplete="name" {...ar("name")} /><Err k="name" /></span></label>
            <label className="fld"><Ico d={IC.phone} /><span><b>{b.phone} <i>*</i></b><input name="phone" type="tel" placeholder={b.phonePh} autoComplete="tel" {...ar("phone")} /><Err k="phone" /></span></label>
            <label className="fld"><Ico d={IC.cal} /><span><b>{b.date} <i>*</i></b><input name="date" inputMode="numeric" placeholder={lang === "vi" ? "dd.mm.yyyy" : "TT.MM.JJJJ"} autoComplete="off" {...ar("date")} /><Err k="date" /></span></label>
            <label className="fld"><Ico d={IC.clock} /><span><b>{b.time}</b><input name="time" placeholder={b.timePh} autoComplete="off" /></span></label>
            <label className="fld"><Ico d={IC.people} /><span><b>{b.persons} <i>*</i></b>
              <select name="persons" defaultValue={opts[1]} key={opts[1]}>{opts.map((o) => <option key={o}>{o}</option>)}</select></span></label>
            <label className="fld"><Ico d={IC.mail} /><span><b>{b.email}</b><input name="email" type="email" placeholder="name@example.com" autoComplete="email" /></span></label>
            <label className="fld wide"><Ico d={IC.note} /><span><b>{b.note}</b><textarea name="message" rows={2} placeholder={b.notePh} /></span></label>
          </div>
          <button className="bk-send" type="submit">{b.send}<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m7 6 6 6-6 6M13 6l6 6-6 6" /></svg></button>
          <div className={`bk-notice${out ? " show" : ""}`} role="status">
            {out && (<>{b.notice}<div className="row"><a className="gbtn" href={out.mailto}>{b.openMail}</a><a className="gbtn" href={out.wa} target="_blank" rel="noopener noreferrer">{b.sendWa}</a></div></>)}
          </div>
        </form>

        <aside className="bk-side">
          <div className="bk-photo">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/room-interior-a.jpg" alt={b.roomAlt} /></div>
          <dl className="bk-info">
            <div><dt><Ico d={IC.clock} />{b.hours}</dt><dd>{lang === "vi" ? "Vui lòng hỏi nhà hàng" : "Auf Anfrage"}</dd></div>
            <div><dt><Ico d={IC.pin} />{b.address}</dt><dd>{SITE.street} · {SITE.city}</dd></div>
            <div><dt><Ico d={IC.phone} />{b.hotline}</dt><dd><a href={`tel:${SITE.phoneTel}`}>{SITE.phoneDisplay}</a></dd></div>
            <div className="wa"><dt><Ico d={IC.wa} />{b.wa}</dt><dd><a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">{SITE.whatsappDisplay}</a></dd>
              <a className="gbtn" href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer">{b.viaWa} →</a></div>
          </dl>
          <div className="bk-tips"><h3><Ico d={IC.info} />{b.tipsT}</h3><ul>{b.tips.map((x) => <li key={x}>{x}</li>)}</ul></div>
        </aside>
      </div>
    </Frame>
  );
}
