"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useLang } from "@/components/LangProvider";
import LogoSlot, { type Logo3D } from "@/components/LogoSlot";

const I = (d: string[]) => (
  <svg className="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    {d.map((x, i) => <path key={i} d={x} />)}
  </svg>
);
const ICONS = {
  home: I(["M3 10.5 12 3l9 7.5", "M5 9.5V21h5v-6h4v6h5V9.5"]),
  menu: I(["M5 3v7a2 2 0 0 0 2 2v9", "M9 3v7a2 2 0 0 1-2 2", "M7 3v5", "M18 21V3c-2.5 1.5-3.5 4.5-3.5 8 0 1.7.8 2.5 2 2.5h1.5"]),
  signature: I(["M12 3l2.1 5.4L20 9.2l-4.4 3.8 1.4 5.7L12 15.5 7 18.7l1.4-5.7L4 9.2l5.9-.8z"]),
  video: I(["M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z", "M10 8.5v7l5.5-3.5z"]),
  booking: I(["M7 3v3M17 3v3", "M4 8h16v12H4z", "M4 11.5h16", "M8 15h2M12 15h2"]),
  events: I(["M9 11a3.2 3.2 0 1 0 0-6.4A3.2 3.2 0 0 0 9 11z", "M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20", "M16 4.8a3 3 0 0 1 0 5.8", "M17.5 14.2A4 4 0 0 1 21 18v2"]),
  ambience: I(["M3 9l1.5-5h15L21 9", "M4 9a2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0 2.5 2.5 0 0 0 5 0", "M5 12v8h14v-8", "M10 20v-5h4v5"]),
  contact: I(["M5 3.5h3.5L10 8 8 9.5a11 11 0 0 0 6.5 6.5L16 14l4.5 1.5V19a2 2 0 0 1-2 2A16 16 0 0 1 3 5.5a2 2 0 0 1 2-2z"]),
};

type Key = keyof typeof ICONS;
const HIT: Record<string, [number, number]> = { home: [57, 205], menu: [216, 355], signature: [366, 508], video: [519, 637], booking: [1036, 1160], events: [1172, 1322], ambience: [1333, 1480], contact: [1491, 1618] };
const LEFT: [Key, string][] = [["home", "/"], ["menu", "/speisekarte"], ["signature", "/signature"], ["video", "/video"]];
const RIGHT: [Key, string][] = [["booking", "/reservierung"], ["events", "/events"], ["ambience", "/ambiente"], ["contact", "/kontakt"]];

export default function Header({ logo3d }: { logo3d?: Logo3D }) {
  const path = usePathname();
  const mode = useSearchParams().get("mode");
  const { lang, t, setLang } = useLang();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [path, mode]);

  const isActive = (k: Key, href: string) => {
    if (k === "home") return path === "/" && mode !== "video";
    if (k === "video") return path === "/video" || (path === "/" && mode === "video");
    if (k === "menu") return path === "/speisekarte" || path === "/food-guide";
    if (k === "events") return path === "/events" || path === "/party-technik";
    return path === href;
  };
  const pill = ([k, href]: [Key, string]) => {
    const on = isActive(k, href);
    return (
      <Link key={k} href={href} className={`pill${on ? " on" : ""}`} aria-current={on ? "page" : undefined} style={{ ["--x0" as string]: `${(HIT[k][0] / 1672) * 100}%`, ["--w" as string]: `${((HIT[k][1] - HIT[k][0]) / 1672) * 100}%` }}>
        {ICONS[k]}<span>{t.nav[k]}</span>
      </Link>
    );
  };
  const langSwitch = (
    <div className="lang" role="group" aria-label="Sprache / Ngôn ngữ">
      <button type="button" className={lang === "de" ? "cur" : ""} aria-pressed={lang === "de"} onClick={() => setLang("de")}>DE</button>
      <span aria-hidden>|</span>
      <button type="button" className={lang === "vi" ? "cur" : ""} aria-pressed={lang === "vi"} onClick={() => setLang("vi")}>VI</button>
    </div>
  );

  return (
    <div className="hdr-wrap" role="banner">
      <div className="topline" />
      <div className="hdr shell">
        <svg className="hdr-art" viewBox="0 0 1672 310" aria-hidden preserveAspectRatio="xMidYMin meet">
          <defs>
            <linearGradient id="ga" x1="0" x2="1"><stop offset="0" stopColor="#c58a2e" stopOpacity="0" /><stop offset=".18" stopColor="#d9a64a" /><stop offset=".5" stopColor="#ffe9a8" /><stop offset=".82" stopColor="#d9a64a" /><stop offset="1" stopColor="#c58a2e" stopOpacity="0" /></linearGradient>
            <filter id="gb" filterUnits="userSpaceOnUse" x="0" y="0" width="1672" height="310"><feGaussianBlur stdDeviation="6" /></filter>
            <filter id="gg" filterUnits="userSpaceOnUse" x="0" y="0" width="1672" height="310"><feGaussianBlur stdDeviation="2.2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
          </defs>
          <g fill="url(#ga)">
            <rect x="90" y="111" width="560" height="2" /><rect x="1022" y="111" width="560" height="2" />
            <rect x="60" y="213.2" width="530" height="1.8" /><rect x="1082" y="213.2" width="530" height="1.8" />
          </g>
          <g fill="none" strokeLinecap="round" className="gold-run" stroke="#fff6d2" strokeWidth="2">
            <path pathLength="1000" d="M90 112H650" /><path pathLength="1000" d="M1582 112H1022" style={{ animationDelay: "-3s" }} />
            <path pathLength="1000" d="M60 214H590" style={{ animationDelay: "-5s" }} /><path pathLength="1000" d="M1612 214H1082" style={{ animationDelay: "-1.5s" }} />
          </g>
        </svg>
        <div className="hdr-line hdr-line-l" /><div className="hdr-line hdr-line-r" />
        <div className="hdr-low hdr-low-l" /><div className="hdr-low hdr-low-r" />
        <svg className="hdr-curve" viewBox="0 0 660 60" preserveAspectRatio="none" aria-hidden>
          <defs><linearGradient id="hg" x1="0" x2="1"><stop offset="0" stopColor="#8f6a32" /><stop offset=".5" stopColor="#f1cf83" /><stop offset="1" stopColor="#8f6a32" /></linearGradient></defs>
          <path d="M0 1 H48 C98 1 98 60 148 60 H512 C562 60 562 1 612 1 H660" fill="none" stroke="url(#hg)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        </svg>
        <nav className="hnav hnav-l" aria-label="Hauptnavigation">{LEFT.map(pill)}</nav>
        <nav className="hnav hnav-r" aria-label="Weitere Navigation">{RIGHT.map(pill)}</nav>
        <Link href="/" className="brand" aria-label="Rạng Đông – Home">
          <svg className="ring ring-back" viewBox="0 0 200 80" aria-hidden><defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#c58a2e"/><stop offset=".5" stopColor="#ffe3a0"/><stop offset="1" stopColor="#c58a2e"/></linearGradient></defs><ellipse cx="100" cy="40" rx="97" ry="35" fill="none" stroke="url(#rg)" strokeWidth="3.2"/></svg>
          <svg className="ring ring-back" viewBox="0 0 200 80" aria-hidden><defs><linearGradient id="rg" x1="0" x2="1"><stop offset="0" stopColor="#c58a2e"/><stop offset=".5" stopColor="#ffe9a8"/><stop offset="1" stopColor="#c58a2e"/></linearGradient></defs><ellipse cx="100" cy="40" rx="97" ry="35" fill="none" stroke="url(#rg)" strokeWidth="3.2"/></svg>
          <LogoSlot logo3d={logo3d} />
          <svg className="ring ring-front" viewBox="0 0 200 80" aria-hidden><path d="M3 40A97 35 0 0 0 197 40" fill="none" stroke="url(#rg)" strokeWidth="3.2"/></svg>
          <svg className="ring ring-front" viewBox="0 0 200 80" aria-hidden><path d="M3 40A97 35 0 0 0 197 40" fill="none" stroke="url(#rg)" strokeWidth="3.2"/></svg>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="name-png" src="/brand/rang-dong-name.png" srcSet="/brand/rang-dong-name.png 1x, /brand/rang-dong-name@2x.png 2x" alt="Rạng Đông" width="1400" height="396" />
          <span className="tag-line">{t.tagline}</span>
          <div className="hdr-title" aria-hidden>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/fx/title.png" alt="" width="1526" height="484" />
            <span className="shine" />
            <i className="spk s1" /><i className="spk s2" /><i className="spk s3" />
          </div>
          <svg className="lotus" viewBox="0 0 120 16" aria-hidden>
            <path d="M6 8H48M72 8H114" stroke="#c9984d" strokeWidth=".8" />
            <path d="M60 2c-3 3-3 7 0 11 3-4 3-8 0-11zM52 5c0 4 3 7 8 8-1-4-3-7-8-8zM68 5c0 4-3 7-8 8 1-4 3-7 8-8z" fill="none" stroke="#e5b963" strokeWidth=".9" strokeLinejoin="round" />
          </svg>
        </Link>
        <div className="hdr-lang">{langSwitch}</div>
        <button className="hmenu" aria-label={t.menuBtn} aria-expanded={open} aria-controls="drawer" onClick={() => { if (!open) window.scrollTo(0, 0); setOpen(!open); }}>{open ? "✕" : "☰"}</button>
      </div>
      <div className={`drawer${open ? " open" : ""}`} id="drawer">
        <div className="drawer-in shell">
          {[...LEFT, ...RIGHT].map(pill)}
          <div className="drawer-foot">
            {langSwitch}
            <Link href="/impressum">{t.common.legal[0]}</Link>
            <Link href="/datenschutz">{t.common.legal[1]}</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
