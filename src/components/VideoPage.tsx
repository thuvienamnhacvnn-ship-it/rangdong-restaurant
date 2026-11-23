"use client";
import { useEffect, useRef, useState } from "react";
import { Frame } from "@/components/Frame";
import { useLang } from "@/components/LangProvider";
import { CATS, type Cat, type CatId } from "@/lib/site";
import { U } from "@/lib/ui";
import { useMobile } from "@/lib/useMobile";
import { GICON } from "@/components/Frame";

const ICON: Record<CatId, string> = { hot: "vn", sushi: "sushi", party: "fest", viet: "vn" };
const TITLE: Record<CatId, [string, string]> = { sushi: ["Sushi-Auswahl", "Tuyển chọn Sushi"], hot: ["Heiße Spezialitäten", "Món nóng đặc sắc"], party: ["Vietnamesisches Festmenü", "Thực đơn tiệc Việt Nam"], viet: ["Vietnamesische Küche", "Món Việt"] };
const fmt = (s: number) => (isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00");

export default function VideoPage() {
  const { lang } = useLang();
  const mob = useMobile();
  const u = U[lang].video;
  const [filter, setFilter] = useState<"all" | CatId>("all");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [cur, setCur] = useState<CatId>("sushi");
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [t, setT] = useState(0);
  const [dur, setDur] = useState(0);
  const ref = useRef<HTMLVideoElement>(null);
  const list = CATS.filter((c) => filter === "all" || c.id === filter);
  const feat = CATS.find((c) => c.id === cur) as Cat;
  const name = (c: Cat) => (lang === "vi" ? c.vi : c.de);

  useEffect(() => { setPlaying(false); setT(0); setDur(0); }, [cur]);
  const toggle = () => { const v = ref.current; if (!v) return; if (v.paused) void v.play(); else v.pause(); };
  const choose = (id: CatId) => { setCur(id); };
  const applyFilter = (f: "all" | CatId) => { setFilter(f); if (f !== "all") setCur(f); };

  return (
    <Frame title={u.title} sub={u.sub} className="vid-frame">
      <div className="vd-bar">
        <span className="vd-lab"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 5h16l-6 8v6l-4-2v-4z" /></svg>{u.filter}:</span>
        <div className="vd-chips">
          <button className={filter === "all" ? "on" : ""} aria-pressed={filter === "all"} onClick={() => applyFilter("all")}>{u.all}</button>
          {CATS.map((c) => <button key={c.id} className={filter === c.id ? "on" : ""} aria-pressed={filter === c.id} onClick={() => applyFilter(c.id)}>{GICON[ICON[c.id]]}{name(c)}</button>)}
        </div>
        <span className="vd-sep" aria-hidden />
        <span className="vd-lab">{u.view}:</span>
        <div className="vd-chips">
          <button className={view === "grid" ? "on" : ""} aria-pressed={view === "grid"} onClick={() => setView("grid")}>{u.grid}</button>
          <button className={view === "list" ? "on" : ""} aria-pressed={view === "list"} onClick={() => setView("list")}>{u.list}</button>
        </div>
      </div>

      <div className="vd-player">
        <div className="vd-info">
          <span className="vd-badge">{u.featured}</span>
          <h2>{TITLE[feat.id][lang === "vi" ? 1 : 0]}</h2>
          <span className="vd-cat">{GICON[ICON[feat.id]]}{name(feat)}</span>
        </div>
        <div className="vd-stage">
        <video key={feat.id} ref={ref} src={mob ? feat.videosM[0] : feat.video} poster={mob ? feat.postersM[0] : feat.poster} muted={muted} loop playsInline preload="metadata"
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onTimeUpdate={(e) => setT(e.currentTarget.currentTime)} onLoadedMetadata={(e) => setDur(e.currentTarget.duration)} />
        {!playing && <button className="vd-big" onClick={toggle} aria-label={u.play}><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg></button>}
        <div className="vd-ctl">
          <button onClick={toggle} aria-label={playing ? u.pause : u.play}>{playing ? <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg> : <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M8 5v14l11-7z" /></svg>}</button>
          <span className="vd-time">{fmt(t)} / {fmt(dur)}</span>
          <input type="range" min={0} max={dur || 1} step={0.1} value={t} aria-label="Position" onChange={(e) => { if (ref.current) ref.current.currentTime = +e.target.value; }} />
          <button onClick={() => setMuted(!muted)} aria-label={muted ? u.unmute : u.mute}>{muted
            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 9v6h4l5 4V5L8 9zM17 9l4 6M21 9l-4 6" /></svg>
            : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="M4 9v6h4l5 4V5L8 9zM16.5 8.5a5 5 0 0 1 0 7M19 6a8.5 8.5 0 0 1 0 12" /></svg>}</button>
          <button onClick={() => ref.current?.requestFullscreen?.()} aria-label={u.full}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></svg></button>
        </div>
        </div>
      </div>

      <div className={`vd-thumbs ${view}`}>
        {list.map((c) => (
          <button key={c.id} className={`vd-th${c.id === cur ? " on" : ""}`} onClick={() => choose(c.id)} aria-label={`${u.play}: ${TITLE[c.id][lang === "vi" ? 1 : 0]}`}>
            <span className="vd-tpic">{/* eslint-disable-next-line @next/next/no-img-element */}<img src={c.poster} alt="" loading="lazy" /><i aria-hidden><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z" /></svg></i></span>
            <span className="vd-ttxt"><b>{TITLE[c.id][lang === "vi" ? 1 : 0]}</b><small>{GICON[ICON[c.id]]}{name(c)}</small></span>
          </button>
        ))}
      </div>
    </Frame>
  );
}
