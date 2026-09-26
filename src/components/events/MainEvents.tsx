"use client";

import React from "react";
import { CoverflowCarousel } from "@/components/ui/coverflow-carousel";

const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=640&h=640&fit=crop&q=70&auto=format`;

const MAIN_EVENTS_SLIDES = [
  {
    src: UNSPLASH("1511512578047-dfb367046420"), // placeholder gaming/tech
    alt: "Treasure Hunt",
    title: "TREASURE HUNT",
    subtitle: "Decode clues. Explore the campus. Find the treasure.",
    meta: [
      { label: "Date", value: "Day 1" },
      { label: "Venue", value: "Campus Wide" },
    ],
  },
  {
    src: UNSPLASH("1516035069371-29a1b244cc32"), // placeholder camera/photo
    alt: "Photo Walks",
    title: "PHOTO WALKS",
    subtitle: "Capture perspectives. Explore the campus. Create stories.",
    meta: [
      { label: "Date", value: "Day 2" },
      { label: "Venue", value: "Main Grounds" },
    ],
  },
  {
    src: UNSPLASH("1542751371-adc38448a05e"), // gaming
    alt: "LAN Gaming",
    title: "LAN GAMING",
    subtitle: "Compete. Collaborate. Game on.",
    meta: [
      { label: "Date", value: "Day 3" },
      { label: "Venue", value: "Computer Center" },
    ],
  },
  {
    src: "/images/open_mic.jpg",
    alt: "Open Mic",
    title: "OPEN MIC",
    subtitle: "A stage for every story.",
    meta: [
      { label: "Date", value: "Day 4" },
      { label: "Venue", value: "Amphitheatre" },
    ],
  },
  {
    src: "/images/tech_quiz.jpg",
    alt: "Tech Quiz",
    title: "TECH QUIZ",
    subtitle: "Test your knowledge. Battle of wits.",
    meta: [
      { label: "Date", value: "Day 2" },
      { label: "Venue", value: "Lecture Hall 2" },
    ],
  },
];

export default function MainEvents() {
  return (
    <section className="relative w-full min-h-screen py-24 flex flex-col items-center justify-center overflow-hidden z-20 bg-transparent">
      {/* Header */}
      <div className="text-center mb-16 relative z-10">
        <h3 className="text-cyan-400 text-xs md:text-sm tracking-[0.4em] mb-4 uppercase" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
          More Than Just Competition
        </h3>
        <h2 className="text-4xl md:text-6xl font-bold tracking-widest text-white drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
          MAIN EVENTS
        </h2>
        <div className="w-24 h-[2px] bg-cyan-400 mx-auto mt-6" />
      </div>

      {/* Coverflow Carousel */}
      <div className="w-full relative z-10">
        <CoverflowCarousel 
          slides={MAIN_EVENTS_SLIDES} 
          showCaption 
          showPagination 
          showNavigation 
          cardWidth="clamp(220px, 25vw, 320px)"
        />
      </div>
    </section>
  );
}
