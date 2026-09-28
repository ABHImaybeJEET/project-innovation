import Image from "next/image";
import Link from "next/link";
import MouseParallaxContainer from "@/components/layout/MouseParallaxContainer";

import ClientConstellationsCanvas from "@/components/home/ClientConstellationsCanvas";

export default function Home() {
  return (
    <MouseParallaxContainer className="w-full flex flex-col min-h-screen overflow-x-hidden bg-[#020712]">
      
      {/* FIXED COSMIC BACKGROUND LAYER */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 1. Deep Space Background - Subtle smooth reverse parallax */}
        <div
          data-parallax="-12"
          data-parallax-scale="1.08"
          className="absolute -inset-12 select-none"
          style={{ transform: "translate3d(0px, 0px, 0) scale(1.08)" }}
        >
          <Image
            src="/bg.png"
            alt="Space Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>
        
        {/* 2. Deep Space 3D Constellations & Full-Page Shooting Stars Canvas */}
        <ClientConstellationsCanvas />
      </div>

      <main className="hero-bg relative w-full h-screen shrink-0 overflow-hidden z-10">
        
        {/* 4. Artistic Floating Astronaut - Zero Gravity Parallax Floating Element */}
        <div
          data-parallax="42"
          className="absolute bottom-[20%] sm:-bottom-[7%] right-[4%] sm:right-[7%] w-[38vw] sm:w-[28vw] md:w-[22vw] max-w-[340px] aspect-[0.7] pointer-events-none select-none z-[25]"
        >
          <div className="relative w-full h-full animate-astro-float">
            {/* Subtle Ambient Cosmic Backlight Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 via-amber-400/15 to-purple-600/20 blur-2xl opacity-70" />

            {/* Floating Astronaut Asset with Clean Removed Background */}
            <Image
              src="/astronaut.png"
              alt="Artistic Floating Astronaut"
              fill
              sizes="(max-width: 768px) 38vw, 22vw"
              loading="lazy"
              className="object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(56,189,248,0.4)]"
            />
          </div>
        </div>

        {/* 4b. Secondary Floating Astronaut (Top-Left Zero Gravity Element) */}
        <div
          data-parallax="-38"
          className="absolute top-[22%] sm:top-[2%] left-[3%] sm:left-[6%] w-[35vw] sm:w-[25vw] md:w-[20vw] max-w-[310px] aspect-[0.75] pointer-events-none select-none z-[25]"
        >
          <div className="relative w-full h-full animate-astro-float-reverse">
            {/* Ambient Cosmic Backlight Glow */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-400/20 via-purple-600/15 to-cyan-500/20 blur-2xl opacity-65" />

            {/* Second Floating Astronaut Asset with Clean Removed Background */}
            <Image
              src="/astronaut2.png"
              alt="Second Floating Astronaut"
              fill
              sizes="(max-width: 768px) 35vw, 20vw"
              loading="lazy"
              className="object-contain filter drop-shadow-[0_15px_35px_rgba(0,0,0,0.85)] drop-shadow-[0_0_20px_rgba(251,191,36,0.4)]"
            />
          </div>
        </div>

        {/* 5. Center Hero Title & High-End Theme-Matched CTA Button */}
        <div
          data-parallax="35"
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none z-30 px-4"
        >
          <div className="relative -translate-y-6 sm:-translate-y-10 w-[98vw] sm:w-[90vw] max-w-[1200px] h-[75vh] sm:h-[65vh] md:h-[75vh] lg:h-[95vh] flex items-center justify-center">

            {/* Celestial Subtitle Header above INNOVISION */}
            <div className="absolute top-[35%] sm:top-[30%] md:top-[30%] lg:top-[32%] pointer-events-none z-40 flex items-center gap-3">
              <span className="text-amber-300/80 text-xs sm:text-xl md:text-base font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
              <h2 className="text-xs sm:text-base md:text-xl lg:text-2xl font-bold tracking-[0.4em] sm:tracking-[0.5em] uppercase font-[family-name:var(--font-cinzel)] text-amber-200 bg-[url('/celestial-text-bg-inverted.png')] bg-cover bg-center bg-clip-text text-transparent filter drop-shadow-[0_0_18px_rgba(251,191,36,0.75)] drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                NIT ROURKELA&apos;S
              </h2>
              <span className="text-amber-300/80 text-xs sm:text-sm md:text-base font-serif drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">✦</span>
            </div>

            <Image
              src="/innovision_transparent.png"
              alt="INNOVISION"
              fill
              priority
              className="relative z-30 object-contain filter drop-shadow-[0_8px_30px_rgba(0,0,0,0.95)] drop-shadow-[0_0_16px_rgba(251,191,36,0.6)]"
            />

            {/* Register Button */}
            <div className="absolute bottom-[30%] sm:bottom-[14%] md:bottom-[18%] lg:bottom-[22%] pointer-events-auto z-40">
              <Link
                href="/register"
                className="group relative inline-flex items-center justify-center p-1 sm:p-1.5 rounded-full bg-[#020712]/80 border border-white/20 backdrop-blur-2xl shadow-[0_12px_35px_rgba(0,0,0,0.9)] hover:border-white/50 transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] hover:scale-105 active:scale-95 cursor-pointer"
              >
                {/* Double-Bezel Inner Core */}
                <div className="relative flex items-center gap-3.5 sm:gap-4.5 rounded-full px-7 sm:px-9 py-3.5 sm:py-4 bg-[#03091e]/90 border border-white/10 shadow-[inset_0_1px_2px_rgba(255,255,255,0.2)] overflow-hidden">
                  {/* Celestial Constellation Texture Overlay */}
                  <div className="absolute inset-0 bg-[url('/celestial-text-bg.png')] bg-cover bg-center opacity-20 mix-blend-screen pointer-events-none group-hover:opacity-35 transition-opacity duration-500" />

                  {/* Micro Glint Sweep Effect on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                  {/* Celestial Text Label */}
                  <div className="relative z-10 flex items-center gap-2">
                    <span className="text-[10px] text-cyan-300/80 font-serif">✦</span>
                    <span className="text-sm sm:text-base md:text-lg font-black tracking-[0.35em] uppercase text-white font-serif">
                      REGISTER
                    </span>
                    <span className="text-[10px] text-cyan-300/80 font-serif">✦</span>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </MouseParallaxContainer>
  );
}
