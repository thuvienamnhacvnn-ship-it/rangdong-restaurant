"use client";
import { useEffect, useRef, useState } from "react";
import { useLang } from "@/components/LangProvider";
import type { Dict } from "@/lib/i18n";

interface Msg { who: "bot" | "user"; text: string }

function reply(str: string, r: Dict["guide"]["r"]) {
  const s = str.toLowerCase();
  if (/allerg|gluten|nuss|laktose|erdnuss|dị ứng/.test(s)) return r.allergy;
  if (/sushi|maki|nigiri|sashimi|japan|nhật/.test(s)) return r.sushi;
  if (/vegetar|vegan|gemüse|chay|rau/.test(s)) return r.veg;
  if (/warm|heiß|heiss|pho|phở|suppe|wok|nóng|xào|súp|canh/.test(s)) return r.warm;
  if (/feier|fest|party|gruppe|geburtstag|tiệc|nhóm|sinh nhật/.test(s)) return r.party;
  if (/trink|getränk|wein|bier|cocktail|tee|kaffee|đồ uống|rượu|trà|cà phê/.test(s)) return r.drinks;
  return r.other;
}

export default function FoodGuide() {
  const { t, lang } = useLang();
  const g = t.guide;
  const [msgs, setMsgs] = useState<Msg[]>([{ who: "bot", text: g.welcome }]);
  const [val, setVal] = useState("");
  const box = useRef<HTMLDivElement>(null);
  useEffect(() => { setMsgs([{ who: "bot", text: g.welcome }]); }, [lang, g.welcome]);
  useEffect(() => { box.current?.scrollTo({ top: box.current.scrollHeight }); }, [msgs]);
  const ask = (q: string) => setMsgs((m) => [...m, { who: "user", text: q }, { who: "bot", text: reply(q, g.r) }]);
  return (
    <div className="chat-panel glass">
      <div className="chat-title"><strong>{g.ask}</strong><span><span className="glow-dot" /> &nbsp; {g.hint}</span></div>
      <div ref={box} className="chat-messages" aria-live="polite">
        {msgs.map((m, i) => <div key={i} className={`bubble${m.who === "user" ? " user" : ""}`}>{m.text}</div>)}
      </div>
      <div className="quick-prompts">
        {g.q.map(([l, q]) => (
          <button key={l} type="button" onClick={() => ask(q)}>{l}</button>
        ))}
      </div>
      <form className="chat-send" onSubmit={(e) => { e.preventDefault(); if (val.trim()) ask(val.trim()); setVal(""); }}>
        <input value={val} onChange={(e) => setVal(e.target.value)} placeholder={g.ph} autoComplete="off" aria-label={g.ph} />
        <button type="submit">{g.send} ↗</button>
      </form>
    </div>
  );
}
