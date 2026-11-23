import type { Metadata } from "next";
import { Suspense } from "react";
import MenuPage from "@/components/MenuPage";
import { BottomNote, Page } from "@/components/Page";

export const metadata: Metadata = { title: "Speisekarte" };

export default function Speisekarte() {
  return (
    <Page className="sub">
      <Suspense fallback={null}><MenuPage /></Suspense>
      <BottomNote />
    </Page>
  );
}
