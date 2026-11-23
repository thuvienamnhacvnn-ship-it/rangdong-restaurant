import type { Metadata } from "next";
import AdvisorPage from "@/components/AdvisorPage";
import { BottomNote, Page } from "@/components/Page";

export const metadata: Metadata = { title: "Berater / Tư vấn món" };

export default function Advisor() {
  return (
    <Page className="sub">
      <AdvisorPage />
      <BottomNote />
    </Page>
  );
}
