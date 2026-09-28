"use client";
import dynamic from "next/dynamic";

const StarConstellationCanvas = dynamic(
  () => import("@/components/events/StarConstellationCanvas"),
  { ssr: false, loading: () => null }
);

export default function ClientStarConstellationCanvas() {
  return <StarConstellationCanvas />;
}
