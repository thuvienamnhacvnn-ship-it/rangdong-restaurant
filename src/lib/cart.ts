"use client";
import { useSyncExternalStore } from "react";

/* Warenkorb (Speisekarte): im Browser gespeichert, keine Bezahlung – Summe anzeigen und per Telefon bestellen. */
export interface Line { key: string; name: string; label?: string; price: number; qty: number }

const KEY = "rd-cart-v1";
const EMPTY: Line[] = [];
let lines: Line[] = EMPTY;
let inited = false;
const subs = new Set<() => void>();

function load(): Line[] {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) || "[]");
    return Array.isArray(raw) ? raw.filter((l) => l && typeof l.key === "string" && typeof l.price === "number" && l.qty > 0) : EMPTY;
  } catch { return EMPTY; }
}
function commit(next: Line[]) {
  lines = next.length ? next : EMPTY;
  try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  subs.forEach((f) => f());
}
const snap = () => { if (!inited && typeof window !== "undefined") { inited = true; lines = load(); } return lines; };
const sub = (f: () => void) => {
  subs.add(f);
  const onStorage = (e: StorageEvent) => { if (e.key === KEY) { lines = load(); subs.forEach((g) => g()); } };
  window.addEventListener("storage", onStorage);
  return () => { subs.delete(f); window.removeEventListener("storage", onStorage); };
};

export const useCart = () => useSyncExternalStore(sub, snap, () => EMPTY);

export function change(line: Omit<Line, "qty">, delta: number) {
  const cur = snap();
  const i = cur.findIndex((l) => l.key === line.key);
  if (i < 0) { if (delta > 0) commit([...cur, { ...line, qty: delta }]); return; }
  const qty = cur[i].qty + delta;
  commit(qty <= 0 ? cur.filter((_, k) => k !== i) : cur.map((l, k) => (k === i ? { ...l, qty: Math.min(99, qty) } : l)));
}
export const clearCart = () => commit([]);
export const total = (ls: Line[]) => ls.reduce((s, l) => s + l.price * l.qty, 0);
export const count = (ls: Line[]) => ls.reduce((s, l) => s + l.qty, 0);
export const eur = (n: number) => n.toFixed(2).replace(".", ",") + " €";

/** "12,90 €" / "6.50" -> 12.9 ; mehrdeutige Werte ("6.50 / 11.90") -> null (nicht bestellbar) */
export function parsePrice(s?: string): number | null {
  if (!s) return null;
  const m = s.trim().match(/^(\d+(?:[.,]\d{1,2})?)\s*€?$/);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}
