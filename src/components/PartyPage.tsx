"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Frame } from "@/components/Frame";
import { useLang } from "@/components/LangProvider";
import "@/app/events-media.css";

const FI = [
  ["M4 9v6h4l5 4V5L8 9z", "M16.5 8.5a5 5 0 0 1 0 7", "M19 6a8.5 8.5 0 0 1 0 12"],
  ["M12 3a5 5 0 0 0-3 9v3h6v-3a5 5 0 0 0-3-9z", "M10 18h4M10.5 21h3"],
  ["M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11z", "M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20", "M16 4.8a3 3 0 0 1 0 5.8", "M17.5 14.2A4 4 0 0 1 21 18v2"],
  ["M12 3l2.1 5.4L20 9.2l-4.4 3.8 1.4 5.7L12 15.5 7 18.7l1.4-5.7L4 9.2l5.9-.8z"],
];
const VIDS = [3, 5, 4, 2, 1];

export default function PartyPage() {
  const { t, lang } = useLang();
  const p = t.party;
  const [v, setV] = useState(0);
  const vr = useRef<HTMLVideoElement>(null);
  useEffect(() => { vr.current?.play().catch(() => {}); }, [v]);
  const go = (d: number) => setV((x) => (x + d + VIDS.length) % VIDS.length);
  const [l1, l2] = p.h2.split("<br/>");
  return (
    <Frame title="" className="ev-frame pt-frame" head={false}>
      <div className="ev-hero">
        <div className="ev-copy">
          <p className="ev-kick"><span />{p.kick}<span /></p>
          <h1><em>{l1}</em><strong>{l2}</strong></h1>
          <p className="ev-p">{p.p}</p>
          <ul className="ev-feats">
            {p.pts.map(([b, d], i) => (
              <li key={b}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{FI[i].map((x, k) => <path key={k} d={x} />)}</svg><span>{d}</span></li>
            ))}
          </ul>
          <div className="ev-cta">
            <Link href="/reservierung" className="gbtn gold">{p.btn} ›</Link>
            <Link href="/events" className="gbtn">{lang === "de" ? "Events" : "Tiệc & Sự kiện"}</Link>
          </div>
        </div>
        <div className="ev-pic">
          <div className="ev-media">
            <div className="evm-stage vid">
              <video ref={vr} key={v} src={`/events/v${VIDS[v]}.mp4`} poster={`/events/v${VIDS[v]}.jpg`} controls autoPlay muted playsInline preload="metadata" onEnded={() => go(1)} />
              <button type="button" className="evm-nav prev" aria-label="Prev" onClick={() => go(-1)}>‹</button>
              <button type="button" className="evm-nav next" aria-label="Next" onClick={() => go(1)}>›</button>
              <span className="evm-count">{v + 1} / {VIDS.length}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="pt-thumbs">
        {VIDS.map((n, i) => (
          <button key={n} type="button" className={`pt-th${i === v ? " on" : ""}`} onClick={() => setV(i)} aria-label={`Video ${i + 1}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={`/events/v${n}.jpg`} alt="" loading="lazy" />
            <span className="pt-play" aria-hidden><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg></span>
            <b>Video {i + 1}</b>
          </button>
        ))}
      </div>
    </Frame>
  );
}
