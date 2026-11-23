"use client";
import { useEffect, useRef } from "react";

/* Fallende Kirschblütenblätter (Canvas, ohne Bibliothek): Wind, Flattern (Blatt kippt), Drehung, sanftes Ausblenden. */
type P = { x: number; y: number; s: number; vy: number; ph: number; fl: number; fs: number; rot: number; vr: number; sp: number; tint: number; life: number; max: number };

function sprite(c0: string, c1: string, c2: string) {
  const w = 64, h = 64, cv = document.createElement("canvas");
  cv.width = w; cv.height = h;
  const g = cv.getContext("2d")!;
  g.translate(w / 2, h / 2);
  g.beginPath();
  g.moveTo(0, 26);
  g.bezierCurveTo(-26, 14, -22, -18, -7, -26);
  g.lineTo(0, -19);            // Einkerbung an der Spitze
  g.lineTo(7, -26);
  g.bezierCurveTo(22, -18, 26, 14, 0, 26);
  g.closePath();
  const gr = g.createRadialGradient(0, 18, 2, 0, 0, 30);
  gr.addColorStop(0, c0); gr.addColorStop(.55, c1); gr.addColorStop(1, c2);
  g.fillStyle = gr; g.fill();
  g.strokeStyle = "rgba(190,90,110,.28)"; g.lineWidth = 1;
  g.beginPath(); g.moveTo(0, 22); g.quadraticCurveTo(0, 4, 0, -14); g.stroke();
  return cv;
}

export default function Petals() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const cv = ref.current!;
    const ctx = cv.getContext("2d")!;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;
    const sprites = [
      sprite("#fff1f3", "#ffc6d2", "#f59ab0"),
      sprite("#ffe6ec", "#f8aabd", "#e97d98"),
      sprite("#fff8f8", "#ffd9e1", "#f7b2c3"),
    ];
    let W = 0, H = 0, dpr = 1, raf = 0, last = performance.now(), run = true;
    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      W = window.innerWidth; H = window.innerHeight;
      cv.width = W * dpr; cv.height = H * dpr;
      cv.style.width = W + "px"; cv.style.height = H + "px";
    };
    resize();
    window.addEventListener("resize", resize);
    const max = () => (W < 700 ? 26 : 26);
    const list: P[] = [];
    let lane = 0;
    const spawn = (initial = false): P => {
      const side = Math.random();
      // meist unter den beiden Zweigen (links/rechts oben), manche mittig
      const x = W < 700 ? (((lane++ * 7) % 13) + Math.random()) / 13 * W : side < .46 ? Math.random() * W * .26 : side < .92 ? W * (.74 + Math.random() * .26) : W * (.26 + Math.random() * .48);
      const y = initial ? Math.random() * H : -20 - Math.random() * 40 + (side < .92 ? Math.random() * H * .08 : 0);
      const s = (W < 700 ? .55 : .8) * (.55 + Math.random() * .75);
      return { x, y, s, vy: 26 + Math.random() * 34, ph: Math.random() * 6.28, fl: Math.random() * 6.28, fs: 1.4 + Math.random() * 2, rot: Math.random() * 6.28, vr: (Math.random() - .5) * 1.6, sp: .6 + Math.random() * .9, tint: (Math.random() * 3) | 0, life: 0, max: 14 + Math.random() * 10 };
    };
    for (let i = 0; i < max(); i++) list.push(spawn(true));
    const onVis = () => { run = !document.hidden; last = performance.now(); if (run) raf = requestAnimationFrame(frame); };
    document.addEventListener("visibilitychange", onVis);
    function frame(now: number) {
      if (!run) return;
      const dt = Math.min(.05, (now - last) / 1000); last = now;
      const t = now / 1000;
      const wind = (W < 700 ? .2 : 1) * (18 + Math.sin(t * .35) * 16 + Math.sin(t * .9 + 1) * 7);       // Grundwind, böig
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (let i = 0; i < list.length; i++) {
        const p = list[i];
        p.life += dt; p.ph += dt * p.sp; p.fl += dt * p.fs; p.rot += dt * p.vr;
        p.y += (p.vy + Math.sin(p.ph * 1.7) * 9) * dt;
        p.x += (wind * (.55 + p.s * .4) + Math.sin(p.ph) * 26) * dt;
        const fade = Math.min(1, p.life / 1.2) * Math.min(1, Math.max(0, (p.max - p.life) / 2));
        if (p.y > H + 30 || p.x > W + 40 || p.life > p.max) { list[i] = spawn(); continue; }
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot + Math.sin(p.ph) * .5);
        ctx.scale(Math.max(.18, Math.abs(Math.cos(p.fl))) * p.s * .55 + .12 * p.s, p.s * .55 * (.85 + .15 * Math.sin(p.fl * .7)));
        ctx.globalAlpha = .9 * fade;
        ctx.drawImage(sprites[p.tint], -32, -32);
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => { run = false; cancelAnimationFrame(raf); window.removeEventListener("resize", resize); document.removeEventListener("visibilitychange", onVis); };
  }, []);
  return <canvas ref={ref} className="petals" aria-hidden />;
}
