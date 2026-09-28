"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useIsMobile } from "@/hooks/useIsMobile";

// Dynamically import AccordionGallery to avoid SSR issues with gsap
const AccordionGallery = dynamic(
  () => import("@/components/AccordionGallery"),
  { ssr: false, loading: () => null }
);

const FUN_EVENTS = [
  {
    image: "https://picsum.photos/id/1015/900/1200",
    label: "Flash Mob",
    link: "#",
  },
  {
    image: "https://picsum.photos/id/1018/900/1200",
    label: "Cosplay Carnival",
    link: "#",
  },
  {
    image: "https://picsum.photos/id/1039/900/1200",
    label: "Meme War",
    link: "#",
  },
  {
    image: "https://picsum.photos/id/1043/900/1200",
    label: "Beat Boxing",
    link: "#",
  },
  {
    image: "https://picsum.photos/id/1044/900/1200",
    label: "Improv Night",
    link: "#",
  },
  {
    image: "https://picsum.photos/id/1050/900/1200",
    label: "Paper Dance",
    link: "#",
  },
];

export default function FunEvents() {
  const isMobile = useIsMobile();

  return (
    <section className="relative w-full min-h-screen py-24 flex flex-col items-center justify-center overflow-hidden z-20 bg-transparent">
      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <h3
          className="text-fuchsia-400 text-xs md:text-sm tracking-[0.4em] mb-4 uppercase"
          style={{ fontFamily: "var(--font-exo2), sans-serif" }}
        >
          Unwind &amp; Unleash
        </h3>
        <h2
          className="text-4xl md:text-6xl font-bold tracking-widest text-white drop-shadow-[0_0_15px_rgba(232,121,249,0.5)]"
          style={{ fontFamily: "var(--font-exo2), sans-serif" }}
        >
          FUN EVENTS
        </h2>
        <div className="w-24 h-[2px] bg-fuchsia-400 mx-auto mt-6" />
        <p className="mt-6 max-w-xl mx-auto text-sm md:text-base text-slate-400 leading-relaxed">
          Beyond the competition — let loose with wild challenges, surprise
          performances, and pure campus chaos.
        </p>
      </div>

      {/* Accordion Gallery */}
      <div className="w-full max-w-6xl px-4 md:px-8 relative z-10">
        <AccordionGallery
          items={FUN_EVENTS}
          defaultIndex={2}
          expandRatio={isMobile ? 0.7 : 0.52}
          trigger={isMobile ? "click" : "hover"}
          height={isMobile ? 600 : 480}
          orientation={isMobile ? "vertical" : "horizontal"}
          accentColor="#e879f9"
          overlayColor="#0a0020"
          grayscale={true}
          radius={20}
          gap={12}
        />
      </div>
    </section>
  );
}
