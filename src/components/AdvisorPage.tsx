"use client";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { Frame } from "@/components/Frame";
import { useLang } from "@/components/LangProvider";
import { FLAT, lowestPrice, type Item } from "@/lib/menu";
import "@/app/advisor.css";

/* ===== Wissensbasis: der Berater "lernt" jedes Gericht der Karte (Name, Beschreibung DE/EN/VI, Preis, vegetarisch/scharf, Zutaten-Tags) ===== */
const norm = (s: string) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D").toLowerCase();

const TAGS: Record<string, RegExp> = {
  beef: /\b(rind\w*|beef|bo|steak)\b/, chicken: /\b(huhn\w*|hahn\w*|chicken|ga)\b/, duck: /\b(ente|duck|vit|ngan)\b/,
  shrimp: /\b(garnel\w*|shrimp\w*|prawn\w*|tom)\b/, salmon: /\b(lachs|salmon|ca hoi)\b/, tuna: /\b(thunfisch|tuna)\b/,
  fish: /\b(fisch\w*|fish|ca|lachs|salmon|thunfisch|tuna|forelle|dorade)\b/, pork: /\b(schwein\w*|pork|heo|ba chi)\b/,
  goat: /\b(ziege|lamm|goat|lamb|de|cuu)\b/, tofu: /\b(tofu|dau hu|dau phu)\b/,
  soup: /\b(suppe|soup|pho|sup|canh|bun rieu|bun bo)\b/, noodle: /\b(nudel\w*|noodle\w*|bun|mi|udon|ramen|hu tieu|pho)\b/,
  rice: /\b(reis|rice|com|xoi)\b/, fried: /\b(frittiert\w*|fried|tempura|gebacken\w*|crispy|knusprig|kross\w*|chien|gion)\b/,
  salad: /\b(salat\w*|salad)\b/, grill: /\b(gegrillt\w*|grill\w*|nuong|bbq)\b/, wok: /\b(wok|xao)\b/, hotpot: /\b(lau|hotpot|fondue)\b/,
  seafood: /\b(garnel\w*|shrimp|muschel\w*|tintenfisch|squid|oc|muc|krabbe\w*|crab)\b/,
};
type Cat = "starter" | "soup" | "main" | "vn" | "sushi" | "drink" | "dessert" | "kids" | "fest";
interface K { gid: string; sid: string; i: Item; hay: string; price: number | null; cat: Cat; tags: Set<string> }
const catOf = (gid: string, sid: string): Cat =>
  gid === "sushi" ? "sushi" : gid === "drinks" ? "drink" : gid === "fest" ? "fest" : gid === "vn" ? "vn" : sid === "dessert" ? "dessert" : sid === "kids" ? "kids" : sid === "suppen" ? "soup" : gid === "vor" ? "starter" : "main";

function buildKB(): K[] {
  return FLAT.map(({ g, s, i }) => {
    const hay = norm([i.name, i.de, i.en, i.vi, i.opts?.map((o) => o.de + " " + (o.en ?? "")).join(" "), s.de, s.vi].filter(Boolean).join(" "));
    const tags = new Set<string>();
    (Object.keys(TAGS) as string[]).forEach((k) => { if (TAGS[k].test(hay)) tags.add(k); });
    const p = parseFloat(lowestPrice(i) ?? "");
    return { gid: g.id, sid: s.id, i, hay, price: isNaN(p) ? null : p, cat: catOf(g.id, s.id), tags };
  });
}

/* ===== Absicht aus freiem Text lesen ===== */
interface Intent { people?: number; budget?: number; veg: boolean; hot: boolean; mild: boolean; cat?: Cat; tags: string[]; words: string[]; group: boolean; surprise: boolean }
function parse(raw: string): Intent {
  const q = norm(raw);
  const pm = q.match(/(\d+)\s*(nguoi|person\w*|pers\b|leute|gast\w*|erwachsene|pax)/) ?? q.match(/(?:fuer|cho|for)\s*(\d+)\b/);
  const people = pm ? Math.min(60, parseInt(pm[1], 10)) : /zu zweit|hai nguoi|cap doi|date/.test(q) ? 2 : undefined;
  const bm = q.match(/(?:unter|bis|duoi|toi da|max\w*|under|below|<)\s*(\d+(?:[.,]\d+)?)/) ?? q.match(/(\d+(?:[.,]\d+)?)\s*(?:€|euro|eur)\s*(?:pro|moi|\/)?/);
  const budget = bm ? parseFloat(bm[1].replace(",", ".")) : undefined;
  const group = /tiec|feier|party|gruppe|geburtstag|sinh nhat|hochzeit|dam cuoi|firmen|catering|mam\b/.test(q) || (people ?? 0) >= 7;
  const tags = (Object.keys(TAGS) as string[]).filter((k) => TAGS[k].test(q));
  let cat: Cat | undefined;
  if (/sushi|maki|nigiri|sashimi|roll/.test(q)) cat = "sushi";
  else if (/getrank|drink|trink|uong|bier|wein|cocktail|\btee\b|kaffee|ca phe|nuoc|saft/.test(q)) cat = "drink";
  else if (/dessert|nachtisch|trang mieng|kuchen|\beis\b/.test(q)) cat = "dessert";
  else if (/kinder|kid|tre em|\bbe\b/.test(q)) cat = "kids";
  else if (/vorspeise|starter|khai vi/.test(q)) cat = "starter";
  else if (/vietnam|viet\b|mon viet|dac san/.test(q)) cat = "vn";
  const words = q.split(/[^a-z0-9]+/).filter((w) => w.length >= 4 && !/^(mich|cho|toi|eine?|oder|und|dass|gern\w*|moechte|will|muon|mon|nguoi|person\w*|unter|nicht)$/.test(w));
  return { people, budget, veg: /vegetar|vegan|chay|veggie/.test(q), hot: /scharf|\bcay\b|spicy|\bhot\b/.test(q) && !/nicht scharf|khong cay|ko cay|nicht so scharf/.test(q), mild: /nicht (so )?scharf|mild|khong cay|ko cay|nicht pikant/.test(q), cat, tags, words, group, surprise: /ueberrasch|goi y|empfehl|tuy|beliebt|signature|bestseller|was soll/.test(q) };
}

interface Pick { k: K; why: string[]; score?: number }
function recommend(kb: K[], it: Intent): Pick[] {
  const out: Pick[] = [];
  for (const k of kb) {
    if (it.veg && !k.i.veg) continue;
    if (it.mild && k.i.hot) continue;
    if (it.hot && !k.i.hot) continue;
    if (it.cat === "sushi" && /bowl/i.test(k.i.name)) continue;
    if (it.budget && k.price === null) continue;
    if (it.budget && k.price !== null && k.price > it.budget) continue;
    if (it.cat ? k.cat !== it.cat : ["drink", "dessert", "kids", "fest"].includes(k.cat)) continue;
    let score = 0; const why: string[] = [];
    it.tags.forEach((t) => { if (k.tags.has(t)) { score += 3; why.push(t); } });
    it.words.forEach((w) => { if (k.hay.includes(w)) score += 1; });
    if (it.hot && k.i.hot) { score += 3; why.push("hot"); }
    if (it.veg) { score += 1; why.push("veg"); }
    if (it.cat) score += 1;
    if (it.tags.length && !why.some((w) => it.tags.includes(w)) && !it.words.some((w) => k.hay.includes(w))) continue;
    if (!score && !(it.surprise || it.veg || it.cat || it.budget || it.hot || it.mild)) continue;
    if (!it.cat && ["main", "vn", "starter", "soup"].includes(k.cat)) score += 1;
    out.push({ k, why, score });
  }
  out.sort((a, b) => ((b.score ?? 0) - (a.score ?? 0)) || ((a.k.price ?? 99) - (b.k.price ?? 99)));
  // Vielfalt: höchstens 2 Treffer je Rubrik
  const per: Record<string, number> = {};
  return out.filter((p) => { per[p.k.sid] = (per[p.k.sid] ?? 0) + 1; return per[p.k.sid] <= 2; });
}

/* Menü-Vorschlag für n Personen: Vorspeise zum Teilen + Hauptgerichte + Sushi-Menü, Richtwert pro Person */
function plan(kb: K[], n: number, veg: boolean): { picks: K[]; perPerson: number } {
  const ok = (k: K) => (!veg || k.i.veg) && k.price !== null;
  const byCat = (c: Cat) => kb.filter((k) => k.cat === c && ok(k)).sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
  const mid = (l: K[], off = 0) => l[Math.max(0, Math.min(l.length - 1, Math.floor(l.length / 2) + off))];
  const picks: K[] = [];
  const st = mid(byCat("starter")); if (st) picks.push(st);
  const mains = byCat("main").filter((k) => veg || (k.sid !== "veg" && k.sid !== "kids"));
  const mc = Math.max(1, Math.ceil(n / 2));
  for (let j = 0; j < Math.min(mc, 4) && mains.length; j++) { const m = mid(mains, j - 1); if (m && !picks.includes(m)) picks.push(m); }
  if (!veg) { const su = byCat("sushi").filter((k) => k.sid === "menus" || k.sid === "party"); const s = mid(su); if (s) picks.push(s); }
  const total = picks.reduce((a, k) => a + (k.price ?? 0), 0);
  return { picks, perPerson: total / Math.max(1, n) };
}

/* ===== Texte ===== */
const TXT = {
  de: {
    title: "Berater", sub: "Ihr Gericht-Berater – kennt jedes Gericht unserer Karte",
    hi: (n: number) => `Hallo! Ich habe alle ${n} Gerichte und Getränke von Rạng Đông gelernt – Zutaten, Schärfe, Preis, vegetarisch. Sagen Sie mir, worauf Sie Lust haben (z. B. „Rind, nicht scharf, unter 14 €“), oder tippen Sie unten auf eine Frage.`,
    role: "KI-Berater · Küchenchef",
    ph: "Was möchten Sie essen? z. B. „vegetarisch, scharf“", send: "Senden",
    chips: [["Für 2 Personen", "Empfehlung für 2 Personen"], ["Vegetarisch", "vegetarisch"], ["Etwas Scharfes", "scharf"], ["Sushi", "Sushi Empfehlung"], ["Unter 12 €", "unter 12 €"], ["Geburtstag, 8 Personen", "Feier für 8 Personen"], ["Mit Rind", "Rind"], ["Suppe & Nudeln", "Suppe Nudeln"], ["Kinder", "Kinder"], ["Überrasch mich", "Überrasch mich"]],
    none: "Dazu habe ich in unserer Karte nichts Passendes gefunden. Versuchen Sie es mit einer Zutat (Rind, Huhn, Garnelen, Tofu …), einer Vorliebe (scharf, vegetarisch) oder einem Budget („unter 12 €“).",
    found: (n: number) => `Das passt zu Ihnen – ${n} Vorschläge aus unserer Karte:`,
    planFor: (n: number, pp: number) => `Mein Vorschlag für ${n} ${n === 1 ? "Person" : "Personen"} zum Teilen – Richtwert ca. ${pp.toFixed(0)} € pro Person (Preise laut Karte):`,
    group: "Für Feiern und größere Gruppen empfehlen wir unsere Festmenüs (Mâm für 6 / 8 / 10 Personen) – gern persönlich abgestimmt:",
    cta: "Tisch reservieren", ctaMenu: "Zur Speisekarte", ctaEv: "Feiern bei uns",
    from: "ab", veg: "vegetarisch", hot: "scharf", nr: "Nr.", why: { beef: "Rind", chicken: "Huhn", duck: "Ente", shrimp: "Garnelen", salmon: "Lachs", tuna: "Thunfisch", fish: "Fisch", pork: "Schwein", goat: "Ziege/Lamm", tofu: "Tofu", soup: "Suppe", noodle: "Nudeln", rice: "Reis", fried: "knusprig", salad: "Salat", grill: "gegrillt", wok: "Wok", hotpot: "Lẩu", seafood: "Meeresfrüchte", veg: "vegetarisch", hot: "scharf" } as Record<string, string>,
    note: "Empfehlungen aus der aktuellen Speisekarte. Bei Allergien bitte unser Team fragen.",
  },
  vi: {
    title: "Tư vấn món", sub: "Trợ lý tư vấn – đã học toàn bộ món ăn của nhà hàng",
    hi: (n: number) => `Xin chào! Em đã học toàn bộ ${n} món ăn và đồ uống của Rạng Đông: nguyên liệu, độ cay, giá, món chay. Anh/chị cứ nói mình thích gì (ví dụ “món bò, không cay, dưới 14 €”) hoặc bấm một câu hỏi bên dưới.`,
    role: "Chuyên viên tư vấn AI",
    ph: "Anh/chị muốn ăn gì? ví dụ “món chay, cay”", send: "Gửi",
    chips: [["Gợi ý cho 2 người", "gợi ý cho 2 người"], ["Món chay", "món chay"], ["Món cay", "món cay"], ["Sushi", "sushi"], ["Dưới 12 €", "dưới 12 €"], ["Sinh nhật 8 người", "tiệc cho 8 người"], ["Món bò", "bò"], ["Phở & bún", "phở bún"], ["Cho trẻ em", "trẻ em"], ["Gợi ý bất kỳ", "gợi ý cho tôi"]],
    none: "Em chưa tìm thấy món phù hợp trong thực đơn. Anh/chị thử nói một nguyên liệu (bò, gà, tôm, đậu hũ…), sở thích (cay, chay) hoặc ngân sách (“dưới 12 €”) nhé.",
    found: (n: number) => `Những món hợp ý anh/chị – ${n} gợi ý từ thực đơn:`,
    planFor: (n: number, pp: number) => `Em gợi ý bộ món cho ${n} người ăn chung – khoảng ${pp.toFixed(0)} € mỗi người (giá theo thực đơn):`,
    group: "Với tiệc và nhóm đông, nhà hàng có thực đơn tiệc (mâm 6 / 8 / 10 người), có thể trao đổi riêng:",
    cta: "Đặt bàn", ctaMenu: "Xem thực đơn", ctaEv: "Tổ chức tiệc",
    from: "từ", veg: "món chay", hot: "cay", nr: "Số", why: { beef: "bò", chicken: "gà", duck: "vịt", shrimp: "tôm", salmon: "cá hồi", tuna: "cá ngừ", fish: "cá", pork: "heo", goat: "dê/cừu", tofu: "đậu hũ", soup: "súp/phở", noodle: "bún/mì", rice: "cơm", fried: "giòn", salad: "salad", grill: "nướng", wok: "xào", hotpot: "lẩu", seafood: "hải sản", veg: "chay", hot: "cay" } as Record<string, string>,
    note: "Gợi ý dựa trên thực đơn hiện tại. Nếu dị ứng, vui lòng hỏi nhân viên.",
  },
} as const;

type Msg = { lg?: "de" | "vi"; who: "bot" | "user"; text: string; dishes?: { k: K; why: string[] }[]; cta?: ("book" | "menu" | "events")[] };

export default function AdvisorPage() {
  const { lang } = useLang();
  const T = TXT[lang];
  const kb = useMemo(buildKB, []);
  const [msgs, setMsgs] = useState<Msg[]>([{ who: "bot", text: T.hi(kb.length) }]);
  const [val, setVal] = useState("");
  const log = useRef<HTMLDivElement>(null);
  useEffect(() => { setMsgs([{ who: "bot", text: TXT[lang].hi(kb.length) }]); }, [lang, kb.length]);
  useEffect(() => { log.current?.scrollTo({ top: log.current.scrollHeight, behavior: "smooth" }); }, [msgs]);

  const answer = (q: string): Msg => {
    const de = !/[ăâêôơưđàáạảãèéẹẻẽìíòóọỏõùúụủũỳýỵỷỹ]/i.test(q) && /[äöüß]|\b(ich|und|oder|mit|ohne|unter|scharf|vegetarisch|vegan|für|fur|rind\w*|huhn|hähnchen|empfehl\w*|personen|suppe|nicht|gericht\w*|bitte|hallo|feier|kinder|getränk\w*|vorspeise)\b/i.test(q);
    const lg: "de" | "vi" = de ? "de" : lang;
    const T = TXT[lg];
    const it = parse(q);
    if (it.group) {
      const fest = kb.filter((k) => k.cat === "fest").slice(0, 4).map((k) => ({ k, why: [] as string[] }));
      return { lg, who: "bot", text: T.group, dishes: fest, cta: ["book", "events"] };
    }
    if (it.people && !it.cat && !it.tags.length) {
      const p = plan(kb, it.people, it.veg);
      return { lg, who: "bot", text: T.planFor(it.people, p.perPerson), dishes: p.picks.map((k) => ({ k, why: [] })), cta: ["book", "menu"] };
    }
    const res = recommend(kb, it).slice(0, 4);
    if (!res.length) return { lg, who: "bot", text: T.none, cta: ["menu"] };
    return { lg, who: "bot", text: T.found(res.length), dishes: res, cta: ["menu", "book"] };
  };
  const ask = (q: string) => setMsgs((m) => [...m, { who: "user", text: q }, answer(q)]);
  const dsc = (i: Item, lg: "de" | "vi") => (lg === "vi" ? i.vi ?? i.en ?? i.de : i.de ?? i.vi ?? i.en);

  return (
    <Frame title={T.title} sub={T.sub}>
      <div className="adv">
        <aside className="adv-chef"><img key={msgs.length} src="/advisor/chef.webp" alt="" width={354} height={473} /><b>{T.role}</b></aside>
        <div className="adv-main">
        <div ref={log} className="adv-log" aria-live="polite">
          {msgs.map((m, n) => (
            <div key={n} className={`adv-row${m.who === "user" ? " me" : ""}`}>
              <div className="adv-b">{m.text}</div>
              {m.dishes && (
                <div className="adv-cards">
                  {m.dishes.map(({ k, why }) => {
                    const L = m.lg ?? lang; const T = TXT[L];
                    const pr = lowestPrice(k.i);
                    const d = dsc(k.i, L);
                    return (
                      <Link key={k.i.id} href={`/speisekarte?g=${k.gid}&s=${k.sid}`} className="adv-card">
                        <div className="adv-h"><b>{k.i.name}</b>{pr && <span className="adv-pr">{k.i.opts ? <small>{T.from} </small> : null}{pr}</span>}</div>
                        {d && <p>{d}</p>}
                        <div className="adv-tags">
                          {k.i.n && <i>{T.nr} {k.i.n}</i>}
                          {k.i.veg && <i className="v">{T.veg}</i>}
                          {k.i.hot && <i className="h">{T.hot}</i>}
                          {why.filter((w) => w !== "veg" && w !== "hot").slice(0, 3).map((w) => <i key={w}>{T.why[w] ?? w}</i>)}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
              {m.cta && <div className="adv-cta">{m.cta.map((c) => { const l2 = { book: ["/reservierung", TXT[m.lg ?? lang].cta], menu: ["/speisekarte", TXT[m.lg ?? lang].ctaMenu], events: ["/events", TXT[m.lg ?? lang].ctaEv] } as const; return <Link key={c} href={l2[c][0]}>{l2[c][1]}</Link>; })}</div>}
            </div>
          ))}
          {msgs.length === 1 && <div className="adv-hero" aria-hidden>{["p01", "p12", "p24", "p30"].map((f) => <img key={f} src={`/img/food/${f}.webp`} alt="" />)}</div>}
        </div>
        <div className="adv-chips">{T.chips.map(([l, q]) => <button key={l} type="button" onClick={() => ask(q)}>{l}</button>)}</div>
        <form className="adv-form" onSubmit={(e) => { e.preventDefault(); const q = val.trim(); if (q) ask(q); setVal(""); }}>
          <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={T.ph} aria-label={T.ph} autoComplete="off" />
          <button type="submit">{T.send}</button>
        </form>
        <p className="adv-note">{T.note}</p>
        </div>
      </div>
    </Frame>
  );
}
