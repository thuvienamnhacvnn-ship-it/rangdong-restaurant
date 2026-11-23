import type { Metadata } from "next";
import AmbientePage from "@/components/AmbientePage";
import { BottomNote, Page } from "@/components/Page";

export const metadata: Metadata = { title: "Ambiente" };

export default function Ambiente() {
  return (
    <Page className="sub">
      <AmbientePage />
      <BottomNote />
    </Page>
  );
}
