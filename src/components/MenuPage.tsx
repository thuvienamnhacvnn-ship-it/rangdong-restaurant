"use client";
import { Fragment, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Frame, GICON } from "@/components/Frame";
import { useLang } from "@/components/LangProvider";
import { FLAT, GROUPS, lowestPrice, type GroupId, type Item, type Opt } from "@/lib/menu";
import { U } from "@/lib/ui";
import CartBar from "@/components/CartBar";
import { change, eur, parsePrice, useCart } from "@/lib/cart";
import "@/app/menu-cart.css";

const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();
const INDEX = FLAT.map((x) => ({ ...x, hay: norm([x.i.name, x.i.n, x.i.de, x.i.en, x.i.vi, x.i.opts?.map((o) => o.de + " " + (o.en ?? "")).join(" ")].filter(Boolean).join(" ")) }));

type L = "de" | "vi";
const desc = (i: Item, lang: L) => (lang === "vi" ? i.vi ?? i.en ?? i.de : i.de ?? i.vi ?? i.en);

function Codes({ a, label }: { a?: string; label: string }) {
  if (!a) return null;
  return <sup className="ms-a" title={`${label}: ${a}`} aria-label={`${label}: ${a}`}>{a}</sup>;
}

const Leaf = ({ label }: { label: string }) => (
  <svg className="ms-ic veg" viewBox="0 0 24 24" role="img" aria-label={label}><title>{label}</title><path fill="currentColor" d="M20.5 3.5C10 3 4.5 8.5 4.5 15c0 1.6.4 3 1.2 4.1C7.2 13.8 11 10.6 16 9.6c-4.1 1.9-7.2 5-8.8 9.7 1 .8 2.3 1.2 3.8 1.2 6.4 0 9.8-6.1 9.5-17z" /></svg>
);
const Chili = ({ label }: { label: string }) => (
  <svg className="ms-ic hot" viewBox="0 0 24 24" role="img" aria-label={label}><title>{label}</title><path fill="currentColor" d="M5 6.5c2.5-2.3 6.3-1.6 8.6 1.5 1.7 2.3 3.8 3.6 6.4 4.2-.8 3.5-4 6.2-8 5.7C6.2 17.2 3.2 11.5 5 6.5z" /><path fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" d="M5 6.5c.6-1.7 1.5-2.7 2.7-3.5" /></svg>
);

/** Preis(e): "6.50 € / 11.90 €" -> "6.50 / 11.90 €" mit Einheitenzeile. */
function Pr({ i }: { i: Item }) {
  if (i.prices) {
    const vals = i.prices.map(([, p]) => p.replace(/\s?€$/, ""));
    return <span className="ms-pr"><b>{vals.join(" / ")} €</b>{i.prices.length > 1 && <small>{i.prices.map(([u]) => u).join(" · ")}</small>}</span>;
  }
  if (i.price) return <span className="ms-pr"><b>{i.price}</b></span>;
  return null;
}

interface Var { key: string; name: string; label?: string; price: number }
/** Bestellbare Varianten eines Gerichts (nur mit eindeutigem Preis) */
function slashVars(i: Item, mam: boolean): Var[] | null {
  const pr = i.price?.trim();
  if (!pr) return null;
  const per = pr.match(/^(\d+(?:[.,]\d+)?)\s*€\s*\/\s*(\S+)$/);
  if (per) return [{ key: i.id, name: i.name, label: `/ ${per[2].toLowerCase()}`, price: parseFloat(per[1].replace(",", ".")) }];
  const m = pr.match(/^(\d+(?:[.,]\d+)?(?:\s*\/\s*\d+(?:[.,]\d+)?)+)\s*€$/);
  if (!m) return null;
  const nums = m[1].split("/").map((x) => parseFloat(x.trim().replace(",", ".")));
  const labels = mam && nums.length === 3 ? ["Mâm 6", "Mâm 8", "Mâm 10"] : nums.map((_, k) => `Mức ${k + 1}`);
  return nums.map((n, k) => ({ key: `${i.id}:${k}`, name: i.name, label: labels[k], price: n }));
}
function variants(i: Item, choices?: Opt[], mam = false): Var[] {
  if (!i.opts && !i.prices) { const sv = slashVars(i, mam); if (sv) return sv; }
  if (i.opts?.some((o) => o.price)) return i.opts.flatMap((o) => { const p = parsePrice(o.price); return p == null ? [] : [{ key: `${i.id}:${o.k}`, name: i.name, label: `${o.k} ${o.de}`, price: p }]; });
  if (i.prices) return i.prices.flatMap(([u, pr]) => { const p = parsePrice(pr); return p == null ? [] : [{ key: `${i.id}:${u}`, name: i.name, label: u, price: p }]; });
  if (i.price) { const p = parsePrice(i.price); return p == null ? [] : [{ key: i.id, name: i.name, price: p }]; }
  if (choices) return choices.flatMap((o) => { const p = parsePrice(o.price); return p == null ? [] : [{ key: `${i.id}:${o.k}`, name: i.name, label: `${o.k} ${o.de}`, price: p }]; });
  return [];
}

function Qty({ v, vi }: { v: Var; vi: boolean }) {
  const lines = useCart();
  const q = lines.find((l) => l.key === v.key)?.qty ?? 0;
  const line = { key: v.key, name: v.name, label: v.label, price: v.price };
  if (!q) return <button type="button" className="qty-add" onClick={() => change(line, 1)} aria-label={`${vi ? "Thêm" : "Hinzufügen"}: ${v.name}`}>+</button>;
  return (
    <span className="qty">
      <button type="button" onClick={() => change(line, -1)} aria-label="−">−</button>
      <span>{q}</span>
      <button type="button" onClick={() => change(line, 1)} aria-label="+">+</button>
    </span>
  );
}

function OptRow({ o, lang, cart }: { o: Opt; lang: L; cart?: { id: string; name: string } }) {
  const main = lang === "vi" && o.en ? o.en : o.de;
  const p = cart ? parsePrice(o.price) : null;
  const alt = lang === "de" && o.en && o.en !== o.de ? o.en : "";
  return (
    <li>
      <b className="ms-k">{o.k}</b>
      <span className="ms-on">{main}{o.a && <sup>{o.a}</sup>}{alt && <em> / {alt}</em>}</span>
      {o.price && <><i className="ms-lead" /><span className="ms-pr"><b>{o.price}</b></span></>}
      {cart && p != null && <Qty vi={lang === "vi"} v={{ key: `${cart.id}:${o.k}`, name: cart.name, label: `${o.k} ${o.de}`, price: p }} />}
    </li>
  );
}

function Row({ i, lang, u, tag, choices, mam }: { i: Item; lang: L; u: (typeof U)["de"]["menu"]; tag?: string; choices?: Opt[]; mam?: boolean }) {
  const vi = lang === "vi";
  const d = desc(i, lang);
  const d2 = !vi && i.en && i.de && i.en !== i.de ? i.en : "";
  const ch = !i.opts && !i.price && !i.prices ? choices : undefined;
  const from = ch ? Math.min(...ch.map((o) => parseFloat(o.price))).toFixed(2) + " €" : undefined;
  const hasOptPrice = i.opts?.some((o) => o.price);
  const vs = variants(i, ch, !!mam);
  const single = vs.length === 1 && !i.opts;
  const multi = vs.length > 1 && !i.opts;
  const cls = `ms-i${i.veg ? " veg" : ""}${i.hot ? " hot" : ""}${i.opts ? " has-o" : ""}`;
  const vegL = vi ? "Món chay" : "Vegetarisch";
  const hotL = vi ? "Món cay" : "Scharf";
  return (
    <article className={cls}>
      {tag && <div className="ms-tag">{tag}</div>}
      <span className="ms-n">{i.n ?? ""}</span>
      <div className="ms-b">
        <div className="ms-h">
          <h3>{i.name}</h3>
          <Codes a={i.a} label={u.cardLegend} />
          {i.veg && <Leaf label={vegL} />}
          {i.hot && <Chili label={hotL} />}
          {!i.opts && (i.price || i.prices || ch) && <i className="ms-lead" />}
          {ch ? <span className="ms-pr"><small className="ms-from">{u.from}</small><b>{from}</b></span> : !i.opts && <Pr i={i} />}
          {single && <Qty v={vs[0]} vi={vi} />}
        </div>
        {d && <p className="ms-d">{d}</p>}
        {d2 && <p className="ms-e">{d2}</p>}
        {multi && (
          <ul className="ms-vars">
            {vs.map((v) => <li key={v.key}><span>{v.label}</span><b>{eur(v.price)}</b><Qty v={v} vi={vi} /></li>)}
          </ul>
        )}
        {i.opts && <ul className="ms-o" aria-label={u.opts}>{i.opts.map((o) => <OptRow key={o.k} o={o} lang={lang} cart={{ id: i.id, name: i.name }} />)}</ul>}
        {i.opts && !hasOptPrice && !ch && <p className="ms-req">{u.onRequest}</p>}
        {!i.opts && !i.price && !i.prices && !ch && <p className="ms-req">{u.onRequest}</p>}
      </div>
    </article>
  );
}

const Flourish = () => (
  <svg className="ms-orn" viewBox="0 0 320 28" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden>
    <path d="M4 14h104M212 14h104" opacity=".7" />
    <path d="M108 14c8 0 10-8 18-8 6 0 8 6 4 8M212 14c-8 0-10-8-18-8-6 0-8 6-4 8" />
    <path d="M108 14c8 0 10 8 18 8 6 0 8-6 4-8M212 14c-8 0-10 8-18 8-6 0-8-6-4-8" />
    <circle cx="160" cy="14" r="5" fill="currentColor" stroke="none" opacity=".9" />
    <circle cx="160" cy="14" r="9" opacity=".6" />
  </svg>
);

export default function MenuPage() {
  const { lang } = useLang();
  const u = U[lang].menu;
  const vi = lang === "vi";
  const sp = useSearchParams();
  const g0 = GROUPS.find((g) => g.id === sp.get("g")) ?? GROUPS[0];
  const [gid, setGid] = useState<GroupId>(g0.id);
  const [sid, setSid] = useState<string>(g0.secs.find((s) => s.id === sp.get("s"))?.id ?? g0.secs[0].id);
  const [q, setQ] = useState("");
  const g = GROUPS.find((x) => x.id === gid)!;
  const sec = g.secs.find((s) => s.id === sid) ?? g.secs[0];
  const nq = norm(q.trim());
  const hits = useMemo(() => (nq ? INDEX.filter((x) => x.hay.includes(nq)) : []), [nq]);
  const searching = nq.length > 0;

  const pickGroup = (id: GroupId) => { setGid(id); setSid(GROUPS.find((x) => x.id === id)!.secs[0].id); };

  return (
    <Frame title={u.title} className="menu-frame">
      <div className="mv-tabs" role="tablist" aria-label={u.groupsLabel}>
        {GROUPS.map((x) => (
          <button key={x.id} role="tab" aria-selected={!searching && x.id === gid} className={!searching && x.id === gid ? "on" : ""} onClick={() => { setQ(""); pickGroup(x.id); }}>
            {GICON[x.id]}<span>{vi ? x.shortVi : x.short}</span>
          </button>
        ))}
      </div>

      <div className="mv-sub">
        <div className="mv-chips" role="tablist" aria-label={u.sectionsLabel}>
          {searching ? <span className="mv-res">{u.results(hits.length)}</span> : g.secs.length > 1 && g.secs.map((s) => (
            <button key={s.id} role="tab" aria-selected={s.id === sec.id} className={s.id === sec.id ? "on" : ""} onClick={() => setSid(s.id)}>{vi ? s.vi : s.de}</button>
          ))}
        </div>
        <label className="mv-search">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4.5 4.5" /></svg>
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={u.search} aria-label={u.searchLabel} />
        </label>
      </div>

      <div className={`mv-body${searching ? " searching" : ""}`}>
        {!searching && (
          <aside className="mv-side">
            <div className="mv-pic">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={sec.img} alt="" loading="lazy" />
            </div>
            <div className="mv-side-in">
              <p className="mv-k">{g.roman} · {vi ? g.vi : g.de}</p>
              <h2>{vi ? sec.vi : sec.de}</h2>
              <div className="mv-meta"><span>{u.count(sec.items.length)}</span>{sec.unit && <span>{sec.unit}</span>}</div>
            </div>
          </aside>
        )}
        <div className="mv-list" tabIndex={0} aria-label={vi ? sec.vi : sec.de}>
          <div className={`ms-sheet${searching ? " srch" : ""}`}>
            {!searching && (
              <div className="ms-head">
                <h2>{vi ? sec.vi : sec.de}</h2>
                {sec.kicker && <p>{sec.kicker}</p>}
                <Flourish />
              </div>
            )}
            {!searching && sec.choices && (
              <div className="ms-choice">
                <h4>{u.choiceHead}</h4>
                <ul>{sec.choices.map((o) => <OptRow key={o.k} o={o} lang={lang} />)}</ul>
              </div>
            )}
            <div className="ms-cols">
              {searching
                ? hits.length ? hits.map(({ g: gg, s, i }) => <Row key={i.id} i={i} lang={lang} u={u} choices={s.choices} mam={s.id === "tiec"} tag={`${vi ? gg.shortVi : gg.short} · ${vi ? s.vi : s.de}`} />) : <div className="mv-empty">{u.empty}</div>
                : sec.items.map((i) => (
                  <Fragment key={i.id}>
                    {i.sub && <h4 className="ms-sub"><span>{i.sub}</span></h4>}
                    <Row i={i} lang={lang} u={u} choices={sec.choices} mam={sec.id === "tiec"} />
                  </Fragment>
                ))}
            </div>
          </div>
        </div>
      </div>
      <p className="mv-legend">{u.legend}</p>
      <CartBar lang={lang} />
    </Frame>
  );
}

export { lowestPrice };
