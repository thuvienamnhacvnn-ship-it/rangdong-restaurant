import type { Metadata } from "next";
import SignaturePage from "@/components/SignaturePage";
import { BottomNote, Page } from "@/components/Page";

export const metadata: Metadata = { title: "Signature" };

export default function Signature() {
  return (
    <Page className="sub">
      <SignaturePage />
      <BottomNote />
    </Page>
  );
}
