import type { Metadata } from "next";
import FoodGuide from "@/components/FoodGuide";
import { Btn, BottomNote, Page, SectionTop } from "@/components/Page";
import { SITE } from "@/lib/site";
import { getServerT } from "@/lib/lang";

export const metadata: Metadata = { title: "Food Guide" };

export default async function FoodGuidePage() {
  const { t } = await getServerT();
  const g = t.guide;
  return (
    <Page>
      <SectionTop k={g.k} title={g.title} sub={g.sub} extra={<span className="tag">{g.tag}</span>} />
      <div className="ai-layout">
        <div className="assistant-visual glass">
          <div className="orbit"><div className="monogram">東</div></div>
          <h2>{g.h2}</h2>
          <p>{g.p}</p>
        </div>
        <FoodGuide />
      </div>
      <div className="ai-footer glass">
        <div><b>Rạng Đông · Berlin</b><p>{SITE.street} · {SITE.city}</p></div>
        <div className="footer-actions">
          <a className="btn-ghost" href={SITE.mapsSearch} target="_blank" rel="noopener noreferrer">↗ {g.maps}</a>
          <Btn href="/kontakt">{g.contact}</Btn>
        </div>
      </div>
      <BottomNote />
    </Page>
  );
}
