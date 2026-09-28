"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import dynamic from "next/dynamic";

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

const textures = EVENTS.map((e) => e.textureUrl);

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
  const isCooldownRef = useRef(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollY } = useScroll();
  const globeOpacity = useTransform(scrollY, [0, 500], [1, 0]);

  const currentEvent = EVENTS[currentIndex];
  const prevEvent = EVENTS[(currentIndex - 1 + EVENTS.length) % EVENTS.length];
  const nextEvent = EVENTS[(currentIndex + 1) % EVENTS.length];

  const setCooldown = (ms = 450) => {
    isCooldownRef.current = true;
    setTimeout(() => {
      isCooldownRef.current = false;
    }, ms);
  };

  const paginate = useCallback((newDirection: number) => {
    if (isCooldownRef.current) return;
    setCooldown();
    setDirection(newDirection);
    setCurrentIndex((prev) => {
      const next = prev + newDirection;
      if (next < 0) return EVENTS.length - 1;
      if (next >= EVENTS.length) return 0;
      return next;
    });
  }, []);

  const goToIndex = (targetIndex: number) => {
    if (isCooldownRef.current || targetIndex === currentIndex) return;
    setCooldown();
    setDirection(targetIndex > currentIndex ? 1 : -1);
    setCurrentIndex(targetIndex);
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isActive) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;
      if (e.key === "ArrowRight") {
        e.preventDefault();
        paginate(1);
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        paginate(-1);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isActive, paginate]);

  // Touch & Wheel & Pointer handling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let wheelAccumulator = 0;
    let wheelTimeout: NodeJS.Timeout | null = null;
    let touchStartX = 0;
    let touchStartY = 0;
    let touchStartTime = 0;
    let isPointerDown = false;
    let pointerStartX = 0;
    let pointerStartY = 0;
    let hasMoved = false;

    // Wheel handling (touchpad sidescroll)
    const handleWheel = (e: WheelEvent) => {
      // Only handle if in view
      if (window.scrollY > window.innerHeight * 0.5) return;
      const absX = Math.abs(e.deltaX);
      const absY = Math.abs(e.deltaY);

      if (absX > absY && absX > 8) {
        if (e.cancelable) e.preventDefault();
        if (isCooldownRef.current) return;

        wheelAccumulator += e.deltaX;
        if (wheelTimeout) clearTimeout(wheelTimeout);
        wheelTimeout = setTimeout(() => {
          wheelAccumulator = 0;
        }, 200);

        if (wheelAccumulator > 35) {
          wheelAccumulator = 0;
          paginate(1);
        } else if (wheelAccumulator < -35) {
          wheelAccumulator = 0;
          paginate(-1);
        }
      }
    };

    // Touch handling (mobile swipe)
    const handleTouchStart = (e: TouchEvent) => {
      if (window.scrollY > window.innerHeight * 0.5) return;
      if (e.touches.length !== 1) return;
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
      touchStartTime = Date.now();
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (window.scrollY > window.innerHeight * 0.5) return;
      if (e.touches.length !== 1) return;
      const deltaX = e.touches[0].clientX - touchStartX;
      const deltaY = e.touches[0].clientY - touchStartY;
      if (Math.abs(deltaX) > 12 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
        if (e.cancelable) e.preventDefault(); // Prevent horizontal overscroll navigation
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (window.scrollY > window.innerHeight * 0.5) return;
      if (!e.changedTouches || e.changedTouches.length === 0) return;
      
      const deltaX = e.changedTouches[0].clientX - touchStartX;
      const deltaY = e.changedTouches[0].clientY - touchStartY;
      const duration = Date.now() - touchStartTime;
      const velocity = Math.abs(deltaX) / (duration || 1);

      const isQuickSwipe = Math.abs(deltaX) > 25 && velocity > 0.25;
      const isLongSwipe = Math.abs(deltaX) > 40;

      if ((isQuickSwipe || isLongSwipe) && Math.abs(deltaX) > Math.abs(deltaY) * 1.1) {
        if (deltaX < 0) paginate(1);
        else paginate(-1);
      }
    };

    // Pointer handling (desktop drag)
    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || window.scrollY > window.innerHeight * 0.5) return;
      if ((e.target as HTMLElement)?.closest("button, a")) return;
      isPointerDown = true;
      hasMoved = false;
      pointerStartX = e.clientX;
      pointerStartY = e.clientY;
      container.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isPointerDown) return;
      const deltaX = e.clientX - pointerStartX;
      const deltaY = e.clientY - pointerStartY;
      if (Math.abs(deltaX) > 8 || Math.abs(deltaY) > 8) hasMoved = true;
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      container.releasePointerCapture(e.pointerId);
      if (!hasMoved) return;

      const deltaX = e.clientX - pointerStartX;
      const deltaY = e.clientY - pointerStartY;

      if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) paginate(1);
        else paginate(-1);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });
    container.addEventListener("touchend", handleTouchEnd, { passive: true });
    container.addEventListener("pointerdown", handlePointerDown);
    container.addEventListener("pointermove", handlePointerMove);
    container.addEventListener("pointerup", handlePointerUp);
    container.addEventListener("pointercancel", handlePointerUp);

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
      container.removeEventListener("touchend", handleTouchEnd);
      container.removeEventListener("pointerdown", handlePointerDown);
      container.removeEventListener("pointermove", handlePointerMove);
      container.removeEventListener("pointerup", handlePointerUp);
      container.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [paginate]);

  return (
    <div 
      ref={containerRef}
      className="relative h-screen w-full text-white flex flex-col selection:bg-white/30 bg-transparent select-none touch-pan-y"
      style={{ fontFamily: "var(--font-inter), sans-serif", touchAction: "pan-y" }}
    >
      
      {/* ===== 3D PLANET CAROUSEL (Background Layer) ===== */}
      <motion.div 
        style={{ opacity: globeOpacity }}
        className="fixed inset-0 w-full h-screen z-10 pointer-events-none"
      >
        <EventGlobe textures={textures} currentIndex={currentIndex} className="w-full h-full pointer-events-none" />
        {/* Soft overlay to ensure text readability against the bright background */}
        <div className="absolute top-0 left-0 w-full h-[75vh] bg-gradient-to-b from-[#020712]/90 via-[#020712]/50 to-transparent pointer-events-none" />
      </motion.div>

      {/* ===== ARROW NAVIGATION ===== */}
      <button
        type="button"
        onClick={() => paginate(-1)}
        className="group absolute left-3 sm:left-6 md:left-10 top-1/2 -translate-y-1/2 z-30 flex items-center gap-3 p-2.5 md:p-3.5 rounded-full bg-slate-950/40 hover:bg-cyan-950/60 border border-cyan-400/30 hover:border-cyan-300 backdrop-blur-md transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95"
        aria-label={`Previous: ${prevEvent.title}`}
      >
        <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-cyan-300 group-hover:text-cyan-100 group-hover:-translate-x-0.5 transition-transform" />
        <div className="hidden lg:flex flex-col items-start pr-2 text-left opacity-70 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] tracking-[0.25em] uppercase text-cyan-400 font-medium" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>PREV</span>
          <span className="text-xs font-semibold tracking-wider text-white whitespace-nowrap">{prevEvent.title}</span>
        </div>
      </button>

      <button
        type="button"
        onClick={() => paginate(1)}
        className="group absolute right-3 sm:right-6 md:right-10 top-1/2 -translate-y-1/2 z-30 flex items-center gap-3 p-2.5 md:p-3.5 rounded-full bg-slate-950/40 hover:bg-cyan-950/60 border border-cyan-400/30 hover:border-cyan-300 backdrop-blur-md transition-all duration-300 shadow-[0_0_15px_rgba(0,0,0,0.5)] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] active:scale-95"
        aria-label={`Next: ${nextEvent.title}`}
      >
        <div className="hidden lg:flex flex-col items-end pl-2 text-right opacity-70 group-hover:opacity-100 transition-opacity">
          <span className="text-[9px] tracking-[0.25em] uppercase text-cyan-400 font-medium" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>NEXT</span>
          <span className="text-xs font-semibold tracking-wider text-white whitespace-nowrap">{nextEvent.title}</span>
        </div>
        <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-cyan-300 group-hover:text-cyan-100 group-hover:translate-x-0.5 transition-transform" />
      </button>

      {/* ===== DOT INDICATORS ===== */}
      <div className="absolute bottom-16 md:bottom-20 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-950/40 border border-cyan-500/20 backdrop-blur-md">
        {EVENTS.map((event, idx) => {
          const isActivePlanet = idx === currentIndex;
          return (
            <button
              key={event.id}
              type="button"
              onClick={() => goToIndex(idx)}
              aria-label={`Go to ${event.title}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                isActivePlanet 
                  ? "w-8 bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.9)]" 
                  : "w-2 bg-white/30 hover:bg-white/60 hover:scale-125"
              }`}
            />
          );
        })}
      </div>

      {/* Mobile Swipe Hint */}
      <div className="md:hidden absolute bottom-[5.5rem] left-1/2 -translate-x-1/2 z-20 pointer-events-none text-[9px] tracking-[0.25em] uppercase text-cyan-300/70 font-medium flex items-center gap-1.5 whitespace-nowrap">
        <span>‹</span>
        <span>Swipe to Explore</span>
        <span>›</span>
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
            className="flex flex-col items-center text-center max-w-3xl pointer-events-auto mt-4 md:mt-0 px-8"
          >
            {/* Subtitle */}
            <h2 className="text-[10px] md:text-sm uppercase tracking-[0.5em] text-cyan-300 mb-4 font-medium drop-shadow-[0_0_18px_rgba(34,211,238,0.7)]" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
              {currentEvent.subtitle}
            </h2>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl lg:text-[6.8rem] whitespace-normal sm:whitespace-nowrap leading-[1.1] md:leading-[0.9] tracking-[0.08em] mb-5 font-semibold text-white" style={{ fontFamily: "var(--font-exo2), sans-serif", textShadow: "0 8px 24px rgba(0,0,0,0.95), 0 2px 10px rgba(0,0,0,0.9)" }}>
              {currentEvent.title}
            </h1>

            {/* Teal accent line */}
            <div className="w-12 h-[2px] bg-cyan-400 mb-6" />

            {/* Description */}
            <p className="text-xs md:text-base leading-relaxed text-slate-100/95 max-w-xl mx-auto mb-8 font-medium" style={{ fontFamily: "var(--font-lora), serif", textShadow: "0 2px 8px rgba(0,0,0,0.95), 0 1px 3px rgba(0,0,0,0.8)" }}>
              {currentEvent.description}
            </p>
            
            {/* CTA Button */}
            <button className="border border-cyan-400/60 text-white px-8 md:px-10 py-2.5 md:py-3 rounded-full font-bold text-[10px] md:text-xs tracking-[0.28em] hover:bg-cyan-300 hover:text-slate-950 transition-all duration-300 backdrop-blur-sm shadow-[0_0_20px_rgba(34,211,238,0.18)]" style={{ fontFamily: "var(--font-exo2), sans-serif" }}>
              GET STARTED
            </button>
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Down Arrow */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 animate-bounce pointer-events-none">
        <ChevronDown className="w-5 h-5 md:w-6 md:h-6 text-gray-400" />
      </div>
    </div>
  );
}
