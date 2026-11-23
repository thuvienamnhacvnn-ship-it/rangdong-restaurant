"use client";
import { useEffect } from "react";

/* Desktop: feste Bühne 1672×941, die proportional in das Fenster skaliert wird →
   Header, Titel, Logo und jede Seite passen immer ohne Scrollen in einen Bildschirm. */
export default function Stage({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const fit = () => {
      const s = Math.min(window.innerWidth / 1672, window.innerHeight / 941);
      document.documentElement.style.setProperty("--s", String(s));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return <div className="stage">{children}</div>;
}
