"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Gallery from "@/components/Gallery";
import SpacecraftCursor from "@/components/about/SpacecraftCursor";

export default function GalleryPage() {
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    const updateParallax = () => {
      const m = mouseRef.current;
      m.currentX += (m.targetX - m.currentX) * 0.08;
      m.currentY += (m.targetY - m.currentY) * 0.08;

      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${m.currentX * -12}px, ${m.currentY * -12}px, 0) scale(1.05)`;
      }

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    animationFrameId = requestAnimationFrame(updateParallax);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <main className="relative min-h-screen text-white overflow-hidden">
      <SpacecraftCursor />

      <div className="fixed inset-0 z-0 pointer-events-none">
        <div
          ref={bgRef}
          className="absolute -inset-8 will-change-transform"
          style={{
            transform: `translate3d(0px, 0px, 0) scale(1.05)`,
          }}
        >
          <Image
            src="/bg.png"
            alt="Space Background"
            fill
            priority
            className="object-cover object-center opacity-95"
          />
        </div>
      </div>
      <div className="relative z-10 w-full h-full">
        <Gallery />
      </div>
    </main>
  );
}
