"use client";
import dynamic from "next/dynamic";

const ConstellationsCanvas = dynamic(() => import("@/components/home/ConstellationsCanvas"), { ssr: false });

export default function HomeClientConstellations() {
  return <ConstellationsCanvas />;
}
