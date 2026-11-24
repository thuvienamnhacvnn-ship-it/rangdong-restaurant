import AlphaVideo from "@/components/AlphaVideo";
import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Lato, Noto_Serif, Noto_Sans, Tinos } from "next/font/google";
import "./globals.css";
import "./hdr.css";
import "./sub.css";
import "./menu-sheet.css";
import "./mobile-app.css";
import Header from "@/components/Header";
import Petals from "@/components/Petals";
import MobileNav from "@/components/MobileNav";
import Stage from "@/components/Stage";
import { LangProvider } from "@/components/LangProvider";
import { getLang } from "@/lib/lang";

const lato = Lato({ subsets: ["latin", "latin-ext"], weight: ["400", "700"], variable: "--font-lato", display: "swap" });
const serif = Noto_Serif({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-serif", display: "swap" });
const times = Tinos({ subsets: ["latin", "latin-ext", "vietnamese"], weight: ["400", "700"], variable: "--font-times", display: "swap" });
const sans = Noto_Sans({ subsets: ["latin", "latin-ext", "vietnamese"], variable: "--font-sans", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Rạng Đông · Japanese & Vietnamese Cuisine · Berlin", template: "%s · Rạng Đông Berlin" },
  description: "Rạng Đông – Japanese & Vietnamese Cuisine in Berlin-Marzahn. Warme Küche, Sushi und vietnamesische Festmenüs. Marzahner Chaussee 205, 12681 Berlin.",
  metadataBase: new URL("http://localhost:3520"),
};
export const viewport: Viewport = { themeColor: "#120b09", width: "device-width", initialScale: 1 };

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  // Dateien liegen im Repo (public/logo3d); auf Vercel ist existsSync zur Laufzeit unzuverlässig
  const logo3d = { webm: true, mp4: false, poster: true };
  return (
    <html lang={lang} className={`${lato.variable} ${serif.variable} ${sans.variable} ${times.variable}`}>
      <body>
        <LangProvider initial={lang}>
          <a className="skip" href="#main">{lang === "vi" ? "Chuyển đến nội dung" : "Zum Inhalt springen"}</a>
          <div className="ambient" />
          <Petals />
          <div className="noise" />
          <AlphaVideo className="blossom" webm="/fx/branchL.webm" stack="/fx/branchL.stack.mp4" poster="/fx/branchL.png" w={920} h={246} />
          <AlphaVideo className="blossom blossom-r" webm="/fx/branchR.webm" stack="/fx/branchR.stack.mp4" poster="/fx/branchR.png" w={920} h={281} />
          <Stage>
            <Suspense fallback={null}><Header logo3d={logo3d} /></Suspense>
            {children}
          </Stage>
          <Suspense fallback={null}><MobileNav /></Suspense>
        </LangProvider>
      </body>
    </html>
  );
}
