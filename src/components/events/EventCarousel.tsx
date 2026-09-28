"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";

const EventGlobe = dynamic(() => import("./EventGlobe"), { ssr: false });

const EVENTS = [
  {
    id: "robowars",
    title: "ROBO WARS",
    subtitle: "FLAGSHIP EVENT",
    description:
      "Witness the ultimate clash of steel and circuits. Design, build, and battle your robots in an arena of pure mechanical fury. Registration opens soon — gear up for glory!",
    textureUrl: "/planets/robowars.jpg",
    prevLabel: "HACKINNOVISION",
    nextLabel: "STELLAR NIGHT",
  },
  {
    id: "stellarnight",
    title: "STELLAR NIGHT",
    subtitle: "FLAGSHIP EVENT",
    description:
      "An evening of celestial wonder — live performances, immersive light shows, and cosmic vibes under the stars. The night sky comes alive with music, art, and unforgettable energy.",
    textureUrl: "/planets/stellarnight.jpg",
    prevLabel: "ROBO WARS",
    nextLabel: "HACKINNOVISION",
  },
  {
    id: "hackinnovision",
    title: "HACK INNOVISION",
    subtitle: "FLAGSHIP EVENT",
    description:
      "A 24-hour hackathon where brilliant minds converge to build the future. Code, collaborate, and compete for glory. Push the boundaries of innovation — one commit at a time.",
    textureUrl: "/planets/hackinnovision.jpg",
    prevLabel: "STELLAR NIGHT",
    nextLabel: "ROBO WARS",
  },
];

const textures = EVENTS.map(e => e.textureUrl);

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 200 : -200,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? 200 : -200,
    opacity: 0,
  }),
};

export default function EventCarousel({ isActive = true }: { isActive?: boolean }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const isScrollingRef = React.useRef(false);

  // Mobile Touch Swipe detection
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchEndX, setTouchEndX] = useState<number | null>(null);
  const minSwipeDistance = 45;

  const currentEvent = EVENTS[currentIndex];

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex(prev => {
      const next = prev + newDirection;
      if (next < 0) return EVENTS.length - 1;
      if (next >= EVENTS.length) return 0;
      return next;
    });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEndX(null);
    setTouchStartX(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEndX(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStartX || !touchEndX) return;
    const distance = touchStartX - touchEndX;
    if (distance > minSwipeDistance) {
      paginate(1); // Swiped Left -> go to Next
    } else if (distance < -minSwipeDistance) {
      paginate(-1); // Swiped Right -> go to Prev
    }
  };

  React.useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        if (isScrollingRef.current) return;
        isScrollingRef.current = true;
        paginate(1);
        setTimeout(() => { isScrollingRef.current = false; }, 500);
      } else if (e.key === "ArrowLeft") {
        if (isScrollingRef.current) return;
        isScrollingRef.current = true;
        paginate(-1);
        setTimeout(() => { isScrollingRef.current = false; }, 500);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive, currentIndex]);

  const handleScrollDown = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("all-events");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div 
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative h-screen w-full text-white flex flex-col selection:bg-white/30 bg-transparent select-none overflow-hidden touch-pan-y"
      style={{ fontFamily: "var(--font-inter), sans-serif" }}
    >
      
      {/* ===== 3D PLANET CAROUSEL (Background Layer - scrolls naturally with section) ===== */}
      <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
        <EventGlobe textures={textures} currentIndex={currentIndex} className="w-full h-full pointer-events-auto" />
      </div>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-grow flex flex-col items-center justify-start pt-[14vh] md:pt-[18vh] relative z-20 px-4 pointer-events-none">
        
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="flex flex-col items-center text-center max-w-3xl pointer-events-auto"
          >
            {/* Subtitle */}
            <h2 className="text-[10px] md:text-sm uppercase tracking-[0.5em] text-cyan-300 mb-4 font-medium drop-shadow-[0_0_18px_rgba(34,211,238,0.7)]" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
              {currentEvent.subtitle}
            </h2>

            {/* Title */}
            <h1 className="text-3xl md:text-6xl lg:text-[6.8rem] whitespace-normal sm:whitespace-nowrap leading-[0.9] tracking-[0.08em] mb-5 drop-shadow-[0_12px_30px_rgba(0,0,0,0.85)] font-semibold" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
              {currentEvent.title}
            </h1>

            {/* Teal accent line */}
            <div className="w-12 h-[2px] bg-cyan-400 mb-6" />

            {/* Description */}
            <p className="text-sm md:text-base leading-relaxed text-slate-100/90 max-w-xl mx-auto drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-6" style={{ fontFamily: "var(--font-lora), serif" }}>
              {currentEvent.description}
            </p>
            
            {/* Actions & Navigation Controls Row */}
            <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2">
              {/* Prev Button */}
              <button
                type="button"
                onClick={() => paginate(-1)}
                aria-label={`Previous: ${currentEvent.prevLabel}`}
                className="w-10 h-10 rounded-full bg-slate-950/70 border border-cyan-400/40 hover:border-cyan-300 hover:bg-cyan-500/20 text-cyan-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              {/* Main CTA Pass Button */}
              <Link 
                href="/register"
                className="px-8 sm:px-10 py-3 rounded-full bg-cyan-500/10 border border-cyan-400/60 text-white font-bold text-[10px] md:text-xs tracking-[0.28em] hover:bg-cyan-400 hover:text-slate-950 transition-all duration-300 backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.25)]" 
                style={{ fontFamily: "var(--font-exo2), sans-serif" }}
              >
                REGISTER FOR PASS
              </Link>

              {/* Next Button */}
              <button
                type="button"
                onClick={() => paginate(1)}
                aria-label={`Next: ${currentEvent.nextLabel}`}
                className="w-10 h-10 rounded-full bg-slate-950/70 border border-cyan-400/40 hover:border-cyan-300 hover:bg-cyan-500/20 text-cyan-300 hover:text-white flex items-center justify-center transition-all duration-200 active:scale-95 shadow-[0_0_15px_rgba(6,182,212,0.25)] cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>

            {/* Pagination Indicators & Counter */}
            <div className="flex items-center gap-2 mt-4">
              {EVENTS.map((evt, idx) => (
                <button
                  key={evt.id}
                  onClick={() => {
                    setDirection(idx > currentIndex ? 1 : -1);
                    setCurrentIndex(idx);
                  }}
                  aria-label={`Go to ${evt.title}`}
                  className={`transition-all duration-300 rounded-full cursor-pointer ${
                    idx === currentIndex
                      ? "w-6 h-1.5 bg-gradient-to-r from-cyan-400 to-teal-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]"
                      : "w-1.5 h-1.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
              <span className="text-[10px] font-mono tracking-widest text-cyan-300/80 ml-2">
                0{currentIndex + 1} / 0{EVENTS.length}
              </span>
            </div>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Down Scroll Indicator to All Events */}
      <button 
        onClick={handleScrollDown}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1 text-slate-400 hover:text-cyan-300 transition-colors pointer-events-auto cursor-pointer group"
        aria-label="Scroll to explore all festival events"
      >
        <span className="text-[10px] font-mono tracking-widest uppercase opacity-70 group-hover:opacity-100 transition-opacity">
          EXPLORE ALL EVENTS
        </span>
        <ChevronDown className="w-4 h-4 animate-bounce" />
      </button>

      {/* Smooth Soft Vignette at base of hero section */}
      <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-b from-transparent to-[#020712] pointer-events-none z-20" />
    </div>
  );
}
