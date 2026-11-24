import type { Metadata } from "next";
import PartyPage from "@/components/PartyPage";
import { BottomNote, Page } from "@/components/Page";

export const metadata: Metadata = { title: "Party & Technik" };

export default function PartyTechnik() {
  return (
    <Page className="sub">
      <PartyPage />
      <BottomNote />
    </Page>
  );
}
