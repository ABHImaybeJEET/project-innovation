"use client";

import { useEffect, useRef, ReactNode } from "react";

interface MouseParallaxContainerProps {
  children: ReactNode;
  className?: string;
}

export default function MouseParallaxContainer({ children, className = "" }: MouseParallaxContainerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ targetX: 0, targetY: 0, currentX: 0, currentY: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      if (innerWidth < 768) return; // Disable on mobile
      const x = (e.clientX / innerWidth - 0.5) * 2;
      const y = (e.clientY / innerHeight - 0.5) * 2;
      mouseRef.current.targetX = x;
      mouseRef.current.targetY = y;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    let animationFrameId: number;
    let isActive = window.innerWidth >= 768;

    const updateParallax = () => {
      if (!isActive) return;

      const m = mouseRef.current;
      m.currentX += (m.targetX - m.currentX) * 0.08;
      m.currentY += (m.targetY - m.currentY) * 0.08;

      if (containerRef.current) {
        // Query elements with data-parallax
        const elements = containerRef.current.querySelectorAll<HTMLElement>("[data-parallax]");
        for (let i = 0; i < elements.length; i++) {
          const el = elements[i];
          const multiplier = parseFloat(el.getAttribute("data-parallax") || "0");
          const scale = el.getAttribute("data-parallax-scale");
          
          let transform = `translate3d(${m.currentX * multiplier}px, ${m.currentY * multiplier}px, 0)`;
          if (scale) {
            transform += ` scale(${scale})`;
          }
          el.style.transform = transform;
        }
      }

      animationFrameId = requestAnimationFrame(updateParallax);
    };

    if (isActive) {
      animationFrameId = requestAnimationFrame(updateParallax);
    }

    const handleResize = () => {
      const wasActive = isActive;
      isActive = window.innerWidth >= 768;
      if (isActive && !wasActive) {
        animationFrameId = requestAnimationFrame(updateParallax);
      } else if (!isActive && wasActive) {
        cancelAnimationFrame(animationFrameId);
        // Reset transforms if resizing to mobile
        if (containerRef.current) {
          const elements = containerRef.current.querySelectorAll<HTMLElement>("[data-parallax]");
          for (let i = 0; i < elements.length; i++) {
            const el = elements[i];
            const scale = el.getAttribute("data-parallax-scale");
            el.style.transform = scale ? `scale(${scale})` : "none";
          }
        }
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
}
