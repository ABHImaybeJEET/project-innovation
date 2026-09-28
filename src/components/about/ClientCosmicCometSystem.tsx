"use client";
import dynamic from "next/dynamic";

const CosmicCometSystem = dynamic(() => import("@/components/about/CosmicCometSystem"), { ssr: false, loading: () => null });

export default function ClientCosmicCometSystem() {
  return <CosmicCometSystem />;
}
