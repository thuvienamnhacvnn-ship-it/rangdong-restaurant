"use client";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { useLang } from "@/components/LangProvider";

export function BottomNote() {
  const { t } = useLang();
  return (
    <div className="bottom-note">
      <span>RẠNG ĐÔNG &nbsp; · &nbsp; {SITE.street.toUpperCase()}, {SITE.city.toUpperCase()}</span>
      <span className="links">
        <Link href="/party-technik">{t.common.more[0]}</Link>
        <Link href="/tu-van">{t.common.more[1]}</Link>
        <Link href="/impressum">{t.common.legal[0]}</Link>
        <Link href="/datenschutz">{t.common.legal[1]}</Link>
      </span>
    </div>
  );
}

export function SectionTop({ k, title, sub, extra }: { k: string; title: string; sub: string; extra?: React.ReactNode }) {
  return (
    <div className="section-top">
      <div><p className="eyebrow">{k}</p><h1>{title}</h1><div className="sub">{sub}</div></div>
      {extra}
    </div>
  );
}

export function Btn({ href, children, ghost }: { href: string; children: React.ReactNode; ghost?: boolean }) {
  return <Link className={ghost ? "btn-ghost" : "btn-gold"} href={href}>{children} &nbsp; ↗</Link>;
}

export function Page({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <main id="main" className={`page shell ${className}`}>{children}</main>;
}

export function Lines({ s }: { s: string }) {
  const parts = s.split("<br/>");
  return <>{parts.map((x, i) => <span key={i}>{x}{i < parts.length - 1 && <br />}</span>)}</>;
}
