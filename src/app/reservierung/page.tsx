import type { Metadata } from "next";
import BookingPage from "@/components/BookingPage";
import { BottomNote, Page } from "@/components/Page";

export const metadata: Metadata = { title: "Reservierung" };

export default function Reservierung() {
  return (
    <Page className="sub">
      <BookingPage />
      <BottomNote />
    </Page>
  );
}
