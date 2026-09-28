"use client";
import dynamic from "next/dynamic";

const FloatingAstronauts = dynamic(() => import("@/components/about/FloatingAstronauts"), { ssr: false, loading: () => null });

export default function ClientFloatingAstronauts() {
  return <FloatingAstronauts />;
}
