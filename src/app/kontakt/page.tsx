import type { Metadata } from "next";
import ContactPage from "@/components/ContactPage";
import { BottomNote, Page } from "@/components/Page";

export const metadata: Metadata = { title: "Kontakt & Anfahrt" };

export default function Kontakt() {
  return (
    <Page className="sub">
      <ContactPage />
      <BottomNote />
    </Page>
  );
}
