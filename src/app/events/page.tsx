import Image from "next/image";
import EventCarousel from "@/components/events/EventCarousel";
import ScheduleBlock from "@/components/events/ScheduleBlock";
import FunEvents from "@/components/events/FunEvents";
import MouseParallaxContainer from "@/components/layout/MouseParallaxContainer";

import ClientStarConstellationCanvas from "@/components/events/ClientStarConstellationCanvas";

export default function EventsPage() {
  return (
    <MouseParallaxContainer className="hero-bg relative w-full min-h-screen bg-[#020712] text-white">
      {/* --- FIXED CONTINUOUS BACKGROUND --- */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0">
        {/* 1. Deep Space Background - Subtle smooth reverse parallax */}
        <div
          data-parallax="-12"
          data-parallax-scale="1.08"
          className="absolute -inset-12 select-none pointer-events-none"
          style={{ transform: "translate3d(0px, 0px, 0) scale(1.08)" }}
        >
          <Image
            src="/events-bg.jpg"
            alt="Space Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* 2. Interactive Prominent Stars & User Cursor Constellation Drawer */}
        <div data-parallax="6" className="absolute inset-0 pointer-events-none">
          <ClientStarConstellationCanvas />
        </div>
      </div>

      {/* --- SCROLLABLE CONTENT --- */}
      {/* SECTION 1: Flagship Events Hero */}
      <section className="relative w-full h-screen z-10">
        {/* 3. Event Carousel and Interactive Content */}
        <div className="relative w-full h-full">
          <EventCarousel />
        </div>
      </section>

      {/* SECTION 2: Innovision Schedule */}
      <ScheduleBlock />

      {/* SECTION 3: Fun Events */}
      <FunEvents />
    </MouseParallaxContainer>
  );
}
