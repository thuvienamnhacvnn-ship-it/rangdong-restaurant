import type { Metadata } from "next";
import EventsPage from "@/components/EventsPage";
import { BottomNote, Page } from "@/components/Page";

export const metadata: Metadata = { title: "Events" };

export default function Events() {
  return (
    <Page className="sub">
      <EventsPage />
      <BottomNote />
    </Page>
  );
}
