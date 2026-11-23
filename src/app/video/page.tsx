import type { Metadata } from "next";
import VideoPage from "@/components/VideoPage";
import { BottomNote, Page } from "@/components/Page";

export const metadata: Metadata = { title: "Video" };

export default function Video() {
  return (
    <Page className="sub">
      <VideoPage />
      <BottomNote />
    </Page>
  );
}
