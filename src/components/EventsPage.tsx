"use client";
import Link from "next/link";
import { Frame } from "@/components/Frame";
import { useLang } from "@/components/LangProvider";
import { U } from "@/lib/ui";

const FI = [
  ["M4 9v6h4l5 4V5L8 9z", "M16.5 8.5a5 5 0 0 1 0 7", "M19 6a8.5 8.5 0 0 1 0 12"],
  ["M12 3a5 5 0 0 0-3 9v3h6v-3a5 5 0 0 0-3-9z", "M10 18h4M10.5 21h3"],
  ["M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11z", "M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20", "M16 4.8a3 3 0 0 1 0 5.8", "M17.5 14.2A4 4 0 0 1 21 18v2"],
  ["M12 3l2.1 5.4L20 9.2l-4.4 3.8 1.4 5.7L12 15.5 7 18.7l1.4-5.7L4 9.2l5.9-.8z"],
];
const CARD_IMG: [string, string][] = [["/assets/room-interior-b.jpg", "50% 40%"], ["/assets/room-interior-a.jpg", "30% 55%"], ["/img/food/p33.webp", "50% 50%"], ["/assets/room-interior-a.jpg", "88% 75%"]];

export default function EventsPage() {
  const { lang } = useLang();
  const e = U[lang].events;
  return (
    <Frame title="" className="ev-frame" head={false}>
      <div className="ev-hero">
        <div className="ev-copy">
          <p className="ev-kick"><span />{e.kick}<span /></p>
          <h1><em>{e.h1}</em><strong>{e.h2}</strong></h1>
          <p className="ev-p">{e.p}</p>
          <ul className="ev-feats">
            {e.feats.map((f, i) => (
              <li key={f}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{FI[i].map((d, k) => <path key={k} d={d} />)}</svg><span>{f}</span></li>
            ))}
          </ul>
          <div className="ev-cta">
            <Link href="/reservierung" className="gbtn gold">{e.btn} ›</Link>
            <Link href="/party-technik" className="gbtn">{e.more}</Link>
          </div>
        </div>
        <div className="ev-pic">{/* eslint-disable-next-line @next/next/no-img-element */}<img src="/assets/room-interior-a.jpg" alt="" /></div>
      </div>
      <div className="ev-cards">
        {e.cards.map(([h, p], i) => (
          <Link key={h} href={i === 2 ? "/speisekarte?g=fest" : "/reservierung"} className="ev-card">
            <div className="ev-cpic">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={CARD_IMG[i][0]} alt="" style={{ objectPosition: CARD_IMG[i][1] }} loading="lazy" /></div>
            <div className="ev-ctxt"><h2>{h}</h2><p>{p}</p></div>
            <span className="ev-go" aria-label={e.ask}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 6 6 6-6 6" /></svg></span>
          </Link>
        ))}
      </div>
    </Frame>
  );
}
