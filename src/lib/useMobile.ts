"use client";
import { useEffect, useState } from "react";
export function useMobile(max = 700) {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width:${max}px)`);
    const f = () => setM(mq.matches);
    f(); mq.addEventListener("change", f);
    return () => mq.removeEventListener("change", f);
  }, [max]);
  return m;
}
