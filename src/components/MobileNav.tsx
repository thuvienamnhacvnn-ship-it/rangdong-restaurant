"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";

const I = (d: string[]) => (
  <svg className="mnic" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d.map((x, i) => <path key={i} d={x} />)}
  </svg>
);
const IC = {
  home: I(["M3 10.5 12 3l9 7.5", "M5 9.5V21h5v-6h4v6h5V9.5"]),
  menu: I(["M5 3v7a2 2 0 0 0 2 2v9", "M9 3v7a2 2 0 0 1-2 2", "M7 3v5", "M18 21V3c-2.5 1.5-3.5 4.5-3.5 8 0 1.7.8 2.5 2 2.5h1.5"]),
  video: I(["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M10 8.5v7l5.5-3.5z"]),
  booking: I(["M7 3v3M17 3v3", "M4 8h16v12H4z", "M4 11.5h16", "M8 15h2M12 15h2"]),
  more: I(["M5 12h.01M12 12h.01M19 12h.01"]),
  signature: I(["M12 3l2.1 5.4L20 9.2l-4.4 3.8 1.4 5.7L12 15.5 7 18.7l1.4-5.7L4 9.2l5.9-.8z"]),
  events: I(["M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11z", "M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20", "M16 4.8a3 3 0 0 1 0 5.8", "M17.5 14.2A4 4 0 0 1 21 18v2"]),
  ambience: I(["M3 9l1.5-5h15L21 9", "M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0", "M5 12v8h14v-8", "M10 20v-5h4v5"]),
  contact: I(["M5 3.5h3.5L10 8 8 9.5a11 11 0 0 0 6.5 6.5L16 14l4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5.5a2 2 0 0 1 2-2z"]),
  guide: I(["M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21.5z", "M4 5.5V21.5", "M9 8h7"]),
  party: I(["M3 18.5h18", "M5 18.5a7 7 0 0 1 14 0", "M12 11.5V9", "M12 7.2a1 1 0 1 0 0 .01"]),
};

/* App-Navigation (nur Handy, ≤700 px): untere Tab-Leiste + "Mehr"-Sheet */
export default function MobileNav() {
  const path = usePathname();
  const mode = useSearchParams().get("mode");
  const { lang, t, setLang } = useLang();
  const [more, setMore] = useState(false);
  useEffect(() => setMore(false), [path, mode]);

  const vi = lang === "vi";
  const tabs: { k: keyof typeof IC; href: string; label: string; on: boolean }[] = [
    { k: "home", href: "/", label: t.nav.home, on: path === "/" && mode !== "video" },
    { k: "menu", href: "/speisekarte", label: t.nav.menu, on: path === "/speisekarte" || path === "/food-guide" },
    { k: "video", href: "/video", label: t.nav.video, on: path === "/video" || (path === "/" && mode === "video") },
    { k: "booking", href: "/reservierung", label: t.nav.booking, on: path === "/reservierung" },
  ];
  const moreOn = ["/signature", "/events", "/party-technik", "/ambiente", "/kontakt", "/food-guide", "/impressum", "/datenschutz"].includes(path) && path !== "/food-guide";
  const items: { k: keyof typeof IC; href: string; label: string }[] = [
    { k: "signature", href: "/signature", label: t.nav.signature },
    { k: "events", href: "/events", label: t.nav.events },
    { k: "ambience", href: "/ambiente", label: t.nav.ambience },
    { k: "contact", href: "/kontakt", label: t.nav.contact },
    { k: "guide", href: "/food-guide", label: "Food Guide" },
    { k: "party", href: "/party-technik", label: "Party & Technik" },
  ];

  return (
    <>
      <div className={`msheet-bg${more ? " open" : ""}`} onClick={() => setMore(false)} aria-hidden />
      <div className={`msheet${more ? " open" : ""}`} role="dialog" aria-label={vi ? "Thêm" : "Mehr"} aria-hidden={!more}>
        <i className="grab" aria-hidden />
        <div className="mgrid">
          {items.map((x) => (
            <Link key={x.href} href={x.href} className={path === x.href ? "on" : ""} tabIndex={more ? 0 : -1}>{IC[x.k]}<span>{x.label}</span></Link>
          ))}
        </div>
        <div className="mfoot">
          <div className="mlang" role="group" aria-label="Sprache / Ngôn ngữ">
            <button type="button" className={lang === "de" ? "cur" : ""} onClick={() => setLang("de")}>DE</button>
            <button type="button" className={lang === "vi" ? "cur" : ""} onClick={() => setLang("vi")}>VI</button>
          </div>
          <Link href="/impressum" tabIndex={more ? 0 : -1}>{t.common.legal[0]}</Link>
          <Link href="/datenschutz" tabIndex={more ? 0 : -1}>{t.common.legal[1]}</Link>
        </div>
      </div>
      <nav className="mnav" aria-label={vi ? "Điều hướng chính" : "Hauptnavigation"}>
        {tabs.map((x) => (
          <Link key={x.k} href={x.href} className={x.on ? "on" : ""} aria-current={x.on ? "page" : undefined}>{IC[x.k]}<span>{x.label}</span></Link>
        ))}
        <button type="button" className={more || moreOn ? "on" : ""} aria-expanded={more} onClick={() => setMore(!more)}>{IC.more}<span>{vi ? "Thêm" : "Mehr"}</span></button>
      </nav>
    </>
  );
}
