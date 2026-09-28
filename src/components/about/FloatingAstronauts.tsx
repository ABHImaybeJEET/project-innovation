"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";

export default function FloatingAstronauts() {
  const ufoRef = useRef<HTMLDivElement>(null);
  const astroRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });

  useEffect(() => {

    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth < 768) return;
      mouseRef.current.targetX = (e.clientX / innerWidth - 0.5) * 2; // -1 to 1
      mouseRef.current.targetY = (e.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    const updateTransforms = () => {
      const m = mouseRef.current;
      m.currentX += (m.targetX - m.currentX) * 0.08;
      m.currentY += (m.targetY - m.currentY) * 0.08;

      if (ufoRef.current) {
        ufoRef.current.style.transform = `translate3d(${m.currentX * -18}px, ${m.currentY * -14}px, 0)`;
      }
      if (astroRef.current) {
        astroRef.current.style.transform = `translate3d(${m.currentX * 16}px, ${m.currentY * 14}px, 0)`;
      }

      animationFrameId = requestAnimationFrame(updateTransforms);
    };

    animationFrameId = requestAnimationFrame(updateTransforms);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-25 overflow-hidden select-none">
      {/* 1. LEFT FLOATING UFO SPACESHIP (Top on Mobile) */}
      <div
        ref={ufoRef}
        className="absolute left-1/2 sm:left-[3%] lg:left-[4%] xl:left-[6%] top-[16%] sm:top-[32%] lg:top-[36%] -translate-x-1/2 sm:translate-x-0 sm:-translate-y-1/2 w-[140px] sm:w-[190px] md:w-[230px] lg:w-[275px] xl:w-[315px] aspect-[1501/871] will-change-transform transition-opacity duration-700"
      >
        <div className="relative w-full h-full filter drop-shadow-[0_0_30px_rgba(251,191,36,0.45)] drop-shadow-[0_0_60px_rgba(56,189,248,0.25)] animate-float-slow">
          <Image
            src="/ufo.png"
            alt="Alien UFO Spaceship Floating in Deep Space"
            fill
            priority
            sizes="(max-width: 768px) 190px, (max-width: 1200px) 275px, 315px"
            className="object-contain"
          />
        </div>
      </div>

      {/* 2. RIGHT WAVING ASTRONAUT (Bottom on Mobile) */}
      <div
        ref={astroRef}
        className="absolute left-1/2 sm:left-auto right-auto sm:right-[3%] lg:right-[5%] xl:right-[7%] top-auto sm:top-[31%] lg:top-[33%] bottom-[8%] sm:bottom-auto -translate-x-1/2 sm:translate-x-0 sm:-translate-y-1/2 w-[100px] sm:w-[135px] md:w-[165px] lg:w-[195px] xl:w-[225px] aspect-[402/509] will-change-transform transition-opacity duration-700"
      >
        <div className="relative w-full h-full filter drop-shadow-[0_0_35px_rgba(56,189,248,0.35)] drop-shadow-[0_0_70px_rgba(251,191,36,0.2)] animate-float-reverse">
          <Image
            src="/astronaut-waving.png"
            alt="Cosmic Astronaut Waving in Space"
            fill
            priority
            sizes="(max-width: 768px) 100px, (max-width: 1200px) 195px, 225px"
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
}
