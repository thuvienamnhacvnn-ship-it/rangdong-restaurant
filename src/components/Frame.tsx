import type { ReactNode } from "react";

const Cloud = ({ flip }: { flip?: boolean }) => (
  <svg className={`gf-cloud${flip ? " r" : ""}`} viewBox="0 0 120 30" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden>
    <path d="M0 11H64c10 0 15-7 10-10-5-3-11 2-7 6 4 3 9 0 7-3" />
    <path d="M30 22H86c8 0 11 5 7 7-4 2-8-2-5-4" />
  </svg>
);

export function Seal() {
  return <span className="gf-seal" aria-hidden>東</span>;
}

export function Title({ title, sub, seal = true, className = "" }: { title: string; sub?: string; seal?: boolean; className?: string }) {
  return (
    <div className={`gf-head ${className}`}>
      <div className="gf-title"><Cloud /><h1>{title}</h1><Cloud flip /></div>
      {sub && <p className="gf-sub">{sub}</p>}
      {seal && <Seal />}
    </div>
  );
}

/** Goldrahmen mit Titel + Wolken-Ornament + rotem Siegel (Muster). */
export function Frame({ title, sub, children, className = "", seal = true, head = true }: { title: string; sub?: string; children: ReactNode; className?: string; seal?: boolean; head?: boolean }) {
  return (
    <section className={`gf ${className}`}>
      <div className="gf-wave" aria-hidden />
      {head && <Title title={title} sub={sub} seal={seal} />}
      {children}
    </section>
  );
}

const P = (d: string[]) => (
  <svg className="gi" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{d.map((x, i) => <path key={i} d={x} />)}</svg>
);
export const GICON: Record<string, ReactNode> = {
  vor: P(["M3 12h18a8 8 0 0 1-8 8h-2a8 8 0 0 1-8-8z", "M8 8c0-2 2-2 2-4M13 8c0-2 2-2 2-4"]),
  haupt: P(["M4 17h16", "M5 17a7 7 0 0 1 14 0", "M12 7V5", "M10.5 5h3"]),
  sushi: P(["M12 20c4.4 0 8-1.8 8-4V9c0-2.2-3.6-4-8-4S4 6.8 4 9v7c0 2.2 3.6 4 8 4z", "M4 9c0 2.2 3.6 4 8 4s8-1.8 8-4", "M12 5v8"]),
  drinks: P(["M7 8h10l-1.2 11a1 1 0 0 1-1 .9H9.2a1 1 0 0 1-1-.9z", "M6 8h12", "M12 8l3-5h3"]),
  vn: P(["M4 12h16a8 8 0 0 1-16 0z", "M9 4c0 2 2 2 2 4M14 4c0 2 2 2 2 4"]),
  fest: P(["M3 18h18", "M4 18a8 8 0 0 1 16 0", "M12 10V8", "M10.5 8h3"]),
};
