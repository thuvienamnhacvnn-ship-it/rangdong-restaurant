"use client";
import AlphaVideo from "@/components/AlphaVideo";
// Slot für das 3D-Logo (Huschen oben in der Mitte).
// Dateien in public/logo3d/ ablegen: logo3d.webm (mit Alpha) und/oder logo3d.mp4 und/oder poster.png.
// layout.tsx erkennt sie beim Rendern automatisch. Solange nichts da ist, bleibt der Platz leer (kein Platzhalter-Emblem).
export interface Logo3D { webm?: boolean; mp4?: boolean; poster?: boolean }
export const hasLogo3D = (l?: Logo3D) => !!l && !!(l.webm || l.mp4 || l.poster);

export default function LogoSlot({ logo3d }: { logo3d?: Logo3D }) {
  if (!logo3d || !hasLogo3D(logo3d)) return null;
  if (logo3d.webm || logo3d.mp4) {
    return <AlphaVideo className="logo-slot is-3d" webm="/logo3d/logo3d.webm" stack="/logo3d/logo3d.stack.mp4" poster={logo3d.poster ? "/logo3d/poster.png" : undefined} w={540} h={540} />;
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img className="logo-slot is-3d" src="/logo3d/poster.png" alt="" aria-hidden />;
}
