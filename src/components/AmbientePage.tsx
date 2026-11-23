"use client";
import Link from "next/link";
import { Frame } from "@/components/Frame";
import { useLang } from "@/components/LangProvider";
import { U } from "@/lib/ui";

const IMG: [string, string, string][] = [
  ["/assets/room-interior-a.jpg", "Warm beleuchteter Gastraum / Không gian nhà hàng", "50% 50%"],
  ["/assets/room-interior-b.jpg", "Lounge", "50% 20%"],
  ["/img/food/p35.webp", "Festtafel / Mâm tiệc", "50% 50%"],
];

export default function AmbientePage() {
  const { lang } = useLang();
  const a = U[lang].amb;
  return (
    <Frame title={a.title} sub={a.sub} className="amb-frame">
      <div className="am-grid">
        {a.cards.map(([h, p], i) => (
          <figure key={h} className={`am-card c${i}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={IMG[i][0]} alt={IMG[i][1]} style={{ objectPosition: IMG[i][2] }} loading={i ? "lazy" : "eager"} />
            <figcaption><h2>{h}</h2><p>{p}</p></figcaption>
          </figure>
        ))}
      </div>
      <div className="am-foot"><Link href="/food-guide" className="gbtn">{a.guide} ›</Link></div>
    </Frame>
  );
}
