"use client";
import Link from "next/link";
import { Frame } from "@/components/Frame";
import { useLang } from "@/components/LangProvider";
import { GROUPS, lowestPrice, type Item } from "@/lib/menu";
import { U } from "@/lib/ui";

const pick = (sec: string, name: string): Item => GROUPS.flatMap((g) => g.secs).find((s) => s.id === sec)!.items.find((i) => i.name.toLowerCase().startsWith(name))!;
const Arrow = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m9 6 6 6-6 6" /></svg>;

function Feat({ i, img, href, big, lang, from }: { i: Item; img: string; href: string; big?: boolean; lang: "de" | "vi"; from?: boolean }) {
  const u = U[lang].sig;
  const d = lang === "vi" ? i.en ?? i.de : i.de;
  return (
    <article className={`sg-card${big ? " big" : ""}`}>
      <div className="sg-pic">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={img} alt="" loading="lazy" /></div>
      <div className="sg-txt">
        <span className="sg-badge">{big ? u.badge : u.badge2}</span>
        <h2>{i.name}</h2>
        {d && <p>{d}</p>}
        <div className="sg-foot">
          <div className="sg-price">
            {i.prices ? i.prices.map(([k, p]) => <span key={k}><small>{k}</small>{p}</span>) : <span>{from && <small>{lang === "vi" ? "từ" : "ab"}</small>}{lowestPrice(i)}</span>}
          </div>
          <Link href={href} className="sg-btn" aria-label={`${u.more}: ${i.name}`}>{big ? <>{u.more}<Arrow /></> : <Arrow />}</Link>
        </div>
      </div>
    </article>
  );
}

export default function SignaturePage() {
  const { lang } = useLang();
  const u = U[lang].sig;
  const dragon = pick("special", "rang dong dragon");
  const red = pick("special", "red dragon");
  const pho = pick("vnspez", "pho ha noi");
  const imgs = ["/img/food/p13.webp", "/img/food/p05.webp", "/img/food/p24.webp", "/img/food/p16.webp", "/img/food/p33.webp"];
  return (
    <Frame title={u.title} sub={u.sub} className="sig-frame">
      <div className="sg-grid">
        <Feat i={dragon} img={imgs[0]} href="/speisekarte?g=sushi&s=special" big lang={lang} />
        <Feat i={red} img={imgs[3]} href="/speisekarte?g=sushi&s=special" lang={lang} />
        <Feat i={pho} img={imgs[1]} href="/speisekarte?g=haupt&s=vnspez" lang={lang} from />
        <div className="sg-tiles">
          {u.tiles.map(([h, p, g, s], n) => (
            <Link key={h} href={`/speisekarte?g=${g}&s=${s}`} className="sg-tile">
              <div className="sg-tpic">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={[imgs[3], imgs[2], imgs[4]][n]} alt="" loading="lazy" /></div>
              <div className="sg-ttxt"><h3>{h}</h3><p>{n === 1 ? "Bò Xào Lúc Lắc · Ducky Duck" : p}</p></div>
              <span className="sg-go"><Arrow /></span>
            </Link>
          ))}
        </div>
      </div>
    </Frame>
  );
}
