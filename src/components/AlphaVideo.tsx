"use client";
import { useEffect, useRef, useState } from "react";

/* Transparentes Video: Chrome/Firefox/Edge spielen WebM mit Alpha. Safari/iOS kann das nicht (schwarzer Hintergrund),
   dort läuft ein H.264-MP4 mit gestapeltem Alpha (oben Farbe, unten Alpha-Maske), das per WebGL auf ein Canvas gezeichnet wird. */
const isApple = () => {
  if (new URLSearchParams(location.search).get("alpha") === "canvas") return true;
  const ua = navigator.userAgent;
  if (/iP(hone|ad|od)/.test(ua)) return true;
  if (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1) return true;
  return /Safari/.test(ua) && !/Chrome|Chromium|Edg|Android|OPR|Firefox/.test(ua);
};

const VS = "attribute vec2 p;varying vec2 u;void main(){u=vec2(p.x*.5+.5,.5-p.y*.5);gl_Position=vec4(p,0.,1.);}";
const FS = "precision mediump float;varying vec2 u;uniform sampler2D t;void main(){vec3 c=texture2D(t,vec2(u.x,u.y*.5)).rgb;float a=texture2D(t,vec2(u.x,.5+u.y*.5)).r;gl_FragColor=vec4(c*a,a);}";

export default function AlphaVideo({ webm, stack, poster, className, w, h }: { webm: string; stack: string; poster?: string; className?: string; w: number; h: number }) {
  const [mode, setMode] = useState<"init" | "native" | "canvas">("init");
  const [drawn, setDrawn] = useState(false);
  const cv = useRef<HTMLCanvasElement>(null);
  const vd = useRef<HTMLVideoElement>(null);

  useEffect(() => { setMode(isApple() ? "canvas" : "native"); }, []);

  useEffect(() => {
    if (mode !== "canvas") return;
    const canvas = cv.current, video = vd.current;
    if (!canvas || !video) return;
    const gl = canvas.getContext("webgl", { premultipliedAlpha: true, alpha: true });
    if (!gl) return;
    const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram()!;
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr); gl.useProgram(pr);
    const buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const tex = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR); gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.viewport(0, 0, canvas.width, canvas.height);
    let stop = false, raf = 0, shown = false;
    const draw = () => {
      if (stop) return;
      if (video.readyState >= 2) {
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, video);
        gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        if (!shown) { shown = true; setDrawn(true); }
      }
      raf = requestAnimationFrame(draw);
    };
    const start = () => { video.play().catch(() => {}); };
    video.addEventListener("loadeddata", start);
    start();
    raf = requestAnimationFrame(draw);
    const onVis = () => { if (!document.hidden) start(); };
    document.addEventListener("visibilitychange", onVis);
    return () => { stop = true; cancelAnimationFrame(raf); video.removeEventListener("loadeddata", start); document.removeEventListener("visibilitychange", onVis); };
  }, [mode]);

  if (mode === "init") {
    // eslint-disable-next-line @next/next/no-img-element
    return poster ? <img className={className} src={poster} alt="" aria-hidden /> : null;
  }
  if (mode === "native") {
    return (
      <video className={className} autoPlay loop muted playsInline preload="auto" poster={poster} aria-hidden>
        <source src={webm} type="video/webm" />
      </video>
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      {poster && !drawn && <img className={className} src={poster} alt="" aria-hidden />}
      <canvas ref={cv} className={className} width={w} height={h} aria-hidden />
      <video ref={vd} src={stack} muted loop playsInline autoPlay preload="auto" aria-hidden style={{ position: "fixed", left: -9999, top: 0, width: 2, height: 2, opacity: 0, pointerEvents: "none" }} />
    </>
  );
}
