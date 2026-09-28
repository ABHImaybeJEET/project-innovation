"use client";
import dynamic from "next/dynamic";

const AboutConstellations = dynamic(() => import("@/components/about/AboutConstellations"), { ssr: false, loading: () => null });

export default function ClientAboutConstellations() {
  return <AboutConstellations />;
}
