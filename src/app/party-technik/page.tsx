import type { Metadata } from "next";
import { Lines, Btn, BottomNote, Page, SectionTop } from "@/components/Page";
import { getServerT } from "@/lib/lang";

export const metadata: Metadata = { title: "Party & Technik" };

export default async function PartyTechnik() {
  const { t } = await getServerT();
  const p = t.party;
  return (
    <Page>
      <SectionTop k={p.k} title={p.title} sub={p.sub} extra={<span className="tag">{p.tag}</span>} />
      <div className="party-layout">
        <div className="production-copy glass">
          <div className="eyebrow">{p.kick}</div>
          <h2><Lines s={p.h2} /></h2>
          <p>{p.p}</p>
          <div className="production-points">
            {p.pts.map(([b, d]) => (<div key={b}><b>{b}</b>{d}</div>))}
          </div>
          <Btn href="/reservierung">{p.btn}</Btn>
        </div>
        <div className="prod-stage" aria-hidden>
          <div className="stage-truss">{Array.from({ length: 6 }, (_, i) => <div key={i} className="stage-lamp" />)}</div>
          <div className="beam" style={{ left: "12%", transform: "rotate(8deg)" }} />
          <div className="beam" style={{ left: "47%", transform: "rotate(-5deg)" }} />
          <div className="light-spot" style={{ left: "27%" }} />
          <div className="stage-title">RẠNG ĐÔNG<br /><small>CELEBRATE THE NIGHT</small></div>
          <div className="visual-equalizer">{Array.from({ length: 34 }, (_, i) => <span key={i} style={{ ["--d" as string]: `${(i % 7) * -0.12}s` }} />)}</div>
        </div>
      </div>
      <BottomNote />
    </Page>
  );
}
