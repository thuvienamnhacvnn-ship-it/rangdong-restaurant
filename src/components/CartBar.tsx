"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { change, clearCart, count, eur, total, useCart } from "@/lib/cart";
import { SITE } from "@/lib/site";

const TX = {
  de: { open: "Warenkorb", title: "Ihre Auswahl", empty: "Noch nichts gewählt. Tippen Sie bei einem Gericht auf +.", sum: "Summe", call: "Jetzt anrufen & bestellen", copy: "Bestellung kopieren", copied: "Kopiert ✓", clear: "Leeren", close: "Schließen", note: "Preise laut Speisekarte. Bestellung und Zahlung bestätigen wir am Telefon.", head: "Bestellung / Đơn đặt món – Rạng Đông", sumTxt: "Summe" },
  vi: { open: "Giỏ hàng", title: "Món đã chọn", empty: "Chưa chọn món nào. Bấm + ở món bạn muốn.", sum: "Tổng cộng", call: "Gọi điện đặt món ngay", copy: "Sao chép đơn", copied: "Đã chép ✓", clear: "Xóa hết", close: "Đóng", note: "Giá theo thực đơn. Nhà hàng xác nhận đơn và thanh toán qua điện thoại.", head: "Bestellung / Đơn đặt món – Rạng Đông", sumTxt: "Tổng" },
};

export default function CartBar({ lang }: { lang: "de" | "vi" }) {
  const T = TX[lang];
  const lines = useCart();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const n = count(lines), sum = total(lines);
  useEffect(() => { if (!n) setOpen(false); }, [n]);
  useEffect(() => {
    if (!open) return;
    const k = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open]);

  const text = () => [T.head, ...lines.map((l) => `${l.qty}× ${l.name}${l.label ? ` (${l.label})` : ""} – ${eur(l.price * l.qty)}`), `${T.sumTxt}: ${eur(sum)}`].join("\n");
  const doCopy = async () => {
    try { await navigator.clipboard.writeText(text()); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  if (!mounted) return null;
  return createPortal(
    <>
      {n > 0 && !open && (
        <button type="button" className="cart-fab" onClick={() => setOpen(true)} aria-label={`${T.open}: ${n}`}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M3 4h2.5l2 11h10l2-8H7" /><circle cx="9.5" cy="19.5" r="1.4" /><circle cx="17" cy="19.5" r="1.4" /></svg>
          <span className="cart-fab-n">{n}</span>
          <b>{eur(sum)}</b>
        </button>
      )}
      <div className={`cart-bg${open ? " open" : ""}`} onClick={() => setOpen(false)} />
      <aside className={`cart-panel${open ? " open" : ""}`} aria-hidden={!open} aria-label={T.title}>
        <header>
          <h2>{T.title}</h2>
          <button type="button" className="cart-x" onClick={() => setOpen(false)} aria-label={T.close}>×</button>
        </header>
        <div className="cart-lines">
          {lines.length === 0 && <p className="cart-empty">{T.empty}</p>}
          {lines.map((l) => (
            <div key={l.key} className="cart-line">
              <div className="cart-nm"><b>{l.name}</b>{l.label && <small>{l.label}</small>}<small>{eur(l.price)}</small></div>
              <div className="qty">
                <button type="button" onClick={() => change(l, -1)} aria-label="−">−</button>
                <span>{l.qty}</span>
                <button type="button" onClick={() => change(l, 1)} aria-label="+">+</button>
              </div>
              <div className="cart-lt">{eur(l.price * l.qty)}</div>
            </div>
          ))}
        </div>
        <footer>
          <div className="cart-sum"><span>{T.sum}</span><b>{eur(sum)}</b></div>
          <a className="cart-call" href={`tel:${SITE.phoneTel}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z" /></svg>
            {T.call} · {SITE.phoneDisplay}
          </a>
          <div className="cart-sec">
            <button type="button" onClick={doCopy}>{copied ? T.copied : T.copy}</button>
            <button type="button" onClick={() => clearCart()}>{T.clear}</button>
          </div>
          <p className="cart-note">{T.note}</p>
        </footer>
      </aside>
    </>,
    document.body,
  );
}
