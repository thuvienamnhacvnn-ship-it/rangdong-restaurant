import { Suspense } from "react";
import HomeStage from "@/components/HomeStage";
import { Page } from "@/components/Page";

export default async function Home({ searchParams }: { searchParams: Promise<{ mode?: string }> }) {
  const { mode } = await searchParams;
  return (
    <Page className="home">
      <Suspense fallback={null}>
        <HomeStage initialMode={mode === "still" ? "still" : "video"} />
      </Suspense>
    </Page>
  );
}
