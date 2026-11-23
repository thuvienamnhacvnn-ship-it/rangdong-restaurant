"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CATS } from "@/lib/site";
import { useLang } from "@/components/LangProvider";

type Mode = "still" | "video";
const AUTO_MS = 12000;

function fmt(t: number) {
  const s = Math.max(0, Math.floor(t || 0));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

const Svg = ({ children, size = 22 }: { children: React.ReactNode; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>{children}</svg>
);
const CAT_ICON = {
  hot: <Svg size={34}><path d="M3.5 12.5h17a8.5 8.5 0 0 1-17 0z" /><path d="M8 9c0-1.6 1.4-1.6 1.4-3.2M12 9c0-1.6 1.4-1.6 1.4-3.2M16 9c0-1.6 1.4-1.6 1.4-3.2" /><path d="M9 21h6" /></Svg>,
  sushi: <Svg size={34}><ellipse cx="12" cy="8" rx="7" ry="3" /><path d="M5 8v8c0 1.7 3.1 3 7 3s7-1.3 7-3V8" /><circle cx="12" cy="8" r="1.4" /></Svg>,
  viet: <Svg size={34}><path d="M4 12h16a8 8 0 0 1-16 0z" /><path d="M9 8l5-5M12 8l5-5" /><path d="M8 20h8" /></Svg>,
  party: <Svg size={34}><path d="M3 18.5h18" /><path d="M5 18.5a7 7 0 0 1 14 0" /><path d="M12 11.5V9" /><circle cx="12" cy="8" r="1" /></Svg>,
};


function Slides({ imgs, delay = 0, every = 3800 }: { imgs: string[]; delay?: number; every?: number }) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t: ReturnType<typeof setInterval> | undefined;
    const st = setTimeout(() => { t = setInterval(() => setI((v) => (v + 1) % imgs.length), every); }, delay);
    return () => { clearTimeout(st); if (t) clearInterval(t); };
  }, [imgs.length, delay, every]);
  return (
    <span className="slides" aria-hidden>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img key={imgs[i]} src={imgs[i]} alt="" className="on" />
    </span>
  );
}

export default function HomeStage({ initialMode = "video" }: { initialMode?: Mode }) {
  const { t } = useLang();
  const sp = useSearchParams().get("mode");
  const [mode, setMode] = useState<Mode>(initialMode);
  const [idx, setIdx] = useState(0);
  const [sub, setSub] = useState(0);
  const [mob, setMob] = useState(false);
  const played = useRef(0);
  const visits = useRef<number[]>([0, 0, 0, 0]);
  const [hover, setHover] = useState(false);
  const [reduced, setReduced] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(true);
  const [time, setTime] = useState(0);
  const [dur, setDur] = useState(6);
  const [videoOk, setVideoOk] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const touchX = useRef<number | null>(null);
  const cat = CATS[idx];

  useEffect(() => {
    const mq = window.matchMedia("(max-width:700px)");
    const f = () => setMob(mq.matches);
    f(); mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, []);
  useEffect(() => { setMode(sp === "still" ? "still" : "video"); }, [sp]);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const h = () => setReduced(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);

  const select = useCallback((i: number) => {
    const n = ((i % CATS.length) + CATS.length) % CATS.length;
    setIdx(n);
    setSub(visits.current[n]++ % 2);
    played.current = 0;
    setTime(0);
    setVideoOk(true);
  }, []);

  // Autoplay: Gruppe alle ~12 s weiterschalten (nicht bei reduced-motion / Hover)
  useEffect(() => {
    if (reduced || hover || (mode === "video" && videoOk)) return;
    const tm = setInterval(() => select(idx + 1), AUTO_MS);
    return () => clearInterval(tm);
  }, [idx, reduced, hover, select, mode, videoOk]);

  // Video-Modus: nach jedem 10-s-Clip der Gruppe der nächste Clip, danach die nächste Gruppe
  const onEnded = () => {
    setPaused(false);
    if (played.current < cat.videos.length - 1) { played.current++; setSub((sub + 1) % cat.videos.length); setTime(0); }
    else select(idx + 1);
  };

  function toggle() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) v.play().catch(() => {});
    else v.pause();
  }

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement;
      if (el && /^(INPUT|TEXTAREA|SELECT|BUTTON)$/.test(el.tagName)) return;
      if (e.key === "ArrowRight") select(idx + 1);
      else if (e.key === "ArrowLeft") select(idx - 1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [idx, select]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || mode !== "video") return;
    v.muted = muted;
    if (reduced) { v.pause(); setPaused(true); return; }
    v.play().then(() => setPaused(false)).catch(() => setPaused(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, sub, mode, reduced, videoOk]);

  const mark = (m: Mode) => {
    setMode(m);
    try { history.replaceState(null, "", m === "still" ? "/?mode=still" : "/?mode=video"); } catch {}
  };

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) select(idx + (dx < 0 ? 1 : -1));
  };

  const cards = (
    <div className="category-row" role="tablist" aria-label={t.home.worlds}>
      {CATS.map((x, i) => (
        <button key={x.id} role="tab" aria-selected={i === idx} className={`cat-card${i === idx ? " selected" : ""}`} onClick={() => select(i)} aria-label={t.cats[x.id].name} >
          <Slides imgs={mob ? x.stillsM : x.thumbs} delay={i * 900} every={3200} />
          <span className="cat-ico" aria-hidden>{CAT_ICON[x.id]}</span>
          </button>
      ))}
    </div>
  );

  const pct = Math.min(100, (time / (dur || 6)) * 100);
  const toggleBtn = (
    <button className="view-toggle" onClick={() => mark(mode === "video" ? "still" : "video")}>
      {mode === "video" ? "▧" : "▷"} &nbsp; {mode === "video" ? t.home.still : t.home.video}
    </button>
  );

  return (
    <>
      <h1 className="sr-only">Rạng Đông – Japanese &amp; Vietnamese Cuisine, Berlin-Marzahn</h1>
      <div id="home-content" onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {mode === "video" ? (
          <>
            <div className="video-wrap">
              <div className="video-frame" ref={frameRef}>
                <div className="video-poster" style={{ backgroundImage: `url('${(mob ? cat.postersM : cat.posters)[sub]}')` }} aria-hidden />
                {videoOk && (
                  <video
                    key={cat.id + sub + (mob ? "m" : "d")}
                    ref={videoRef}
                    poster={(mob ? cat.postersM : cat.posters)[sub]}
                    playsInline
                    muted
                    onEnded={onEnded}
                    preload="metadata"
                    aria-label={`${t.cats[cat.id].name} – Video`}
                    onError={() => setVideoOk(false)}
                    onTimeUpdate={(e) => { setTime(e.currentTarget.currentTime); if (e.currentTarget.duration) setDur(e.currentTarget.duration); }}
                    onLoadedMetadata={(e) => setDur(e.currentTarget.duration || 6)}
                    onPlay={() => setPaused(false)}
                    onPause={() => setPaused(true)}
                  >
                    <source src={(mob ? cat.videosM : cat.videos)[sub]} type="video/mp4" />
                  </video>
                )}
                <div className="hero-title" aria-hidden>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/brand/rang-dong-name.png" srcSet="/brand/rang-dong-name.png 1x, /brand/rang-dong-name@2x.png 2x" alt="" width="1400" height="396" />
                  <svg viewBox="0 0 120 16"><path d="M6 8H48M72 8H114" stroke="#c9984d" strokeWidth=".8" /><path d="M60 2c-3 3-3 7 0 11 3-4 3-8 0-11zM52 5c0 4 3 7 8 8-1-4-3-7-8-8zM68 5c0 4-3 7-8 8 1-4 3-7 8-8z" fill="none" stroke="#e5b963" strokeWidth=".9" strokeLinejoin="round" /></svg>
                  <span>{t.tagline}</span>
                </div>
                {toggleBtn}
                <button hidden={!paused} className={`video-bigplay${paused ? "" : " is-playing"}`} onClick={toggle} aria-label={paused ? t.home.play : t.home.pause}>
                  <Svg size={34}><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" /></Svg>
                </button>
                <div className="video-controls">
                  <button onClick={toggle} aria-label={paused ? t.home.play : t.home.pause}>
                    {paused ? <Svg><path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" /></Svg> : <Svg><path d="M8 5v14M16 5v14" strokeWidth="2.6" /></Svg>}
                  </button>
                  <span className="timecode">{fmt(time)} / {fmt(dur)}</span>
                  <div
                    className="seek"
                    role="slider"
                    aria-label="Position"
                    aria-valuemin={0}
                    aria-valuemax={Math.floor(dur)}
                    aria-valuenow={Math.floor(time)}
                    tabIndex={0}
                    onClick={(e) => {
                      const v = videoRef.current;
                      if (v && v.duration) v.currentTime = ((e.clientX - e.currentTarget.getBoundingClientRect().left) / e.currentTarget.clientWidth) * v.duration;
                    }}
                    onKeyDown={(e) => {
                      const v = videoRef.current;
                      if (!v) return;
                      if (e.key === "ArrowRight") { e.stopPropagation(); v.currentTime += 1; }
                      if (e.key === "ArrowLeft") { e.stopPropagation(); v.currentTime -= 1; }
                    }}
                  >
                    <i style={{ width: `${pct}%` }} />
                  </div>
                  <button onClick={() => { const v = videoRef.current; if (v) { v.muted = !v.muted; setMuted(v.muted); } }} aria-label={muted ? t.home.unmute : t.home.mute}>
                    {muted ? <Svg><path d="M4 9.5v5h4l5 4v-13l-5 4z" /><path d="M17 9.5l4 5M21 9.5l-4 5" /></Svg> : <Svg><path d="M4 9.5v5h4l5 4v-13l-5 4z" /><path d="M16.5 9a4 4 0 0 1 0 6M19 6.5a8 8 0 0 1 0 11" /></Svg>}
                  </button>
                  <button onClick={() => { const f = frameRef.current; if (document.fullscreenElement) document.exitFullscreen?.(); else f?.requestFullscreen?.(); }} aria-label={t.home.full}>
                    <Svg><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5" /></Svg>
                  </button>
                </div>
              </div>
              <svg className="frame-art" viewBox="0 0 1672 500" aria-hidden preserveAspectRatio="none">
                <defs>
                  <linearGradient id="fg" x1="0" x2="1" y1="0" y2="1"><stop offset="0" stopColor="#b9822c" /><stop offset=".3" stopColor="#ffe6a0" /><stop offset=".55" stopColor="#d9a24a" /><stop offset=".8" stopColor="#ffe6a0" /><stop offset="1" stopColor="#b9822c" /></linearGradient>
                  <filter id="fgb" x="-5%" y="-15%" width="110%" height="130%"><feGaussianBlur stdDeviation="9" /></filter>
                  <filter id="fgl" x="-3%" y="-10%" width="106%" height="120%"><feGaussianBlur stdDeviation="3" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
                </defs>
                <g fill="none">
                  <path d="M66 10H540C572 10 580 60 616 60H1056C1092 60 1100 10 1132 10H1604A28 28 0 0 1 1632 38V465A28 28 0 0 1 1604 493H66A28 28 0 0 1 38 465V38A28 28 0 0 1 66 10Z" stroke="url(#fg)" strokeWidth="3" vectorEffect="non-scaling-stroke" />
                  <path d="M66 18H540C572 18 582 68 616 68H1056C1090 68 1100 18 1132 18H1604A20 20 0 0 1 1624 38V465A20 20 0 0 1 1604 485H66A20 20 0 0 1 46 465V38A20 20 0 0 1 66 18Z" stroke="#e2b763" strokeOpacity=".55" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                </g>
                <path className="frame-run" pathLength="1000" d="M66 10H540C572 10 580 60 616 60H1056C1092 60 1100 10 1132 10H1604A28 28 0 0 1 1632 38V465A28 28 0 0 1 1604 493H66A28 28 0 0 1 38 465V38A28 28 0 0 1 66 10Z" fill="none" stroke="#fff6d2" strokeWidth="3.6" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
              </svg>
              <svg width="0" height="0" style={{ position: "absolute" }} aria-hidden><clipPath id="vclip" clipPathUnits="objectBoundingBox"><path d="M0 0H.313C.333 0 .343 .107 .361 .107H.64C.658 .107 .668 0 .688 0H1V1H0Z" /></clipPath></svg>
            </div>
            {cards}
          </>
        ) : (
          <>
            <div className="still-hero still4">
              {CATS.map((x, i) => (
                <button key={x.id} className={`still-cell${i === idx ? " selected" : ""}`} onClick={() => select(i)}>
                  <Slides imgs={mob ? x.stillsM : x.stills} delay={i * 700} every={3600} />
                  <span className="stilllabel"><small>{String(i + 1).padStart(2, "0")} / {t.home.gal}</small><strong>{t.cats[x.id].name}</strong><em>{t.cats[x.id].desc}</em></span>
                </button>
              ))}
              {toggleBtn}
            </div>
            {cards}
          </>
        )}
      </div>
      <div className="homefooter"><span className="hf-text">{t.home.footer[0]} &nbsp; <span className="dot" /> {t.home.footer[1]} &nbsp; <span className="dot" /> {t.home.footer[2]}</span><span className="hf-links"><a href="/impressum">{t.common.legal[0]}</a><a href="/datenschutz">{t.common.legal[1]}</a></span></div>
    </>
  );
}
