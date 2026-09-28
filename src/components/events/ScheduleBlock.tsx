"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Calendar, Sparkles } from "lucide-react";
import RubberSegment from "../ui/RubberSegment";

interface ScheduleItem {
  id: string;
  name: string;
  time: string;
  location: string;
}

const SCHEDULE_DATA: Record<string, ScheduleItem[]> = {
  "Day 1": [
    { id: "d1-1", name: "Opening Ceremony", time: "09:00 AM - 10:30 AM", location: "BBA (Auditorium)" },
    { id: "d1-2", name: "Hack Sprint: Web3 & AI", time: "11:00 AM - 05:00 PM", location: "CS Lab 3" },
    { id: "d1-3", name: "Guest Lecture: Tech Horizons", time: "11:30 AM - 01:00 PM", location: "LA (Lecture Hall)" },
    { id: "d1-4", name: "Robo Soccer Arena", time: "01:00 PM - 04:00 PM", location: "DTS (Ground)" },
    { id: "d1-5", name: "UI/UX Design Workshop", time: "02:00 PM - 04:00 PM", location: "LA (Lecture Hall)" },
    { id: "d1-6", name: "Treasure Hunt", time: "03:00 PM - 05:30 PM", location: "Campus Wide" },
    { id: "d1-7", name: "Standup Comedy Show", time: "06:00 PM - 07:30 PM", location: "BBA (Auditorium)" },
    { id: "d1-8", name: "EDM DJ Night", time: "08:00 PM - 10:30 PM", location: "DTS (Ground)" },
  ],
  "Day 2": [
    { id: "d2-1", name: "Tech Quiz Showdown", time: "10:00 AM - 12:30 PM", location: "LA (Lecture Hall)" },
    { id: "d2-2", name: "Bridge Building Challenge", time: "10:30 AM - 01:30 PM", location: "Civil Dept" },
    { id: "d2-3", name: "AI in Robotics Workshop", time: "11:00 AM - 01:00 PM", location: "BBA (Auditorium)" },
    { id: "d2-4", name: "LAN Gaming: Valorant Prelims", time: "12:00 PM - 05:00 PM", location: "Computer Center" },
    { id: "d2-5", name: "Pitch Fest (Startup Ideas)", time: "02:00 PM - 04:30 PM", location: "LA (Lecture Hall)" },
    { id: "d2-6", name: "Drone Racing League", time: "03:00 PM - 05:00 PM", location: "DTS (Ground)" },
    { id: "d2-7", name: "Musical Performance: Indie Band", time: "06:30 PM - 08:30 PM", location: "BBA (Auditorium)" },
    { id: "d2-8", name: "Midnight Coding Challenge", time: "10:00 PM - 12:00 AM", location: "CS Lab" },
  ],
  "Day 3": [
    { id: "d3-1", name: "LAN Gaming: Finals", time: "10:00 AM - 01:00 PM", location: "Computer Center" },
    { id: "d3-2", name: "Capture The Flag (Security)", time: "10:30 AM - 02:30 PM", location: "LA (Lecture Hall)" },
    { id: "d3-3", name: "Rocket Propulsion Workshop", time: "11:00 AM - 01:00 PM", location: "BBA (Auditorium)" },
    { id: "d3-4", name: "Rubik's Cube Championship", time: "01:00 PM - 03:00 PM", location: "Student Activity Center" },
    { id: "d3-5", name: "Open Mic & Poetry", time: "03:00 PM - 05:00 PM", location: "LA (Lecture Hall)" },
    { id: "d3-6", name: "Prize Distribution Ceremony", time: "05:30 PM - 07:00 PM", location: "BBA (Auditorium)" },
    { id: "d3-7", name: "Cultural Dance Showcase", time: "07:30 PM - 09:00 PM", location: "DTS (Ground)" },
    { id: "d3-8", name: "Grand DJ Night Finale", time: "09:00 PM - 11:30 PM", location: "DTS (Ground)" },
  ],
};

const DAYS = ["Day 1", "Day 2", "Day 3"];

export default function ScheduleBlock() {
  const [activeDay, setActiveDay] = useState("Day 1");

  return (
    <section className="relative w-full py-24 px-4 sm:px-6 lg:px-12 bg-[#020712] text-white z-20">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.05),_rgba(2,7,18,0.98),_#020712)] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs tracking-[0.25em] uppercase font-mono shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>EVENT TIMELINE</span>
          </div>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] font-serif">
            Innovision Schedule
          </h2>
          <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent mx-auto shadow-[0_0_8px_#fbbf24]" />
        </div>

        {/* Day Filters */}
        <div className="flex items-center justify-center font-mono tracking-widest uppercase">
          <RubberSegment
            items={DAYS.map(day => ({
              value: day,
              label: day,
              icon: <Calendar className="w-4 h-4" />
            }))}
            value={activeDay}
            onChange={(value) => setActiveDay(value)}
            trackColor="rgba(255, 255, 255, 0.05)"
            thumbColor="#22d3ee"
            textColor="#94a3b8"
            activeTextColor="#020712"
            size="lg"
            radius={16}
            equalSlots={false}
          />
        </div>

        {/* Schedule List */}
        <div className="relative rounded-3xl bg-[#050d26]/80 border border-cyan-500/20 backdrop-blur-xl p-4 sm:p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_0_30px_rgba(6,182,212,0.05)] overflow-hidden min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeDay}
              initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {SCHEDULE_DATA[activeDay].map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05, duration: 0.3 }}
                  className="group relative flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-white/5 border border-white/5 hover:bg-cyan-950/30 hover:border-cyan-500/30 transition-all duration-300 hover:shadow-[0_4px_20px_rgba(6,182,212,0.15)]"
                >
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-0 bg-cyan-400 rounded-r-full transition-all duration-300 group-hover:h-3/4 shadow-[0_0_8px_#22d3ee]" />
                  
                  <div className="flex-1 pl-2">
                    <h3 className="text-lg sm:text-xl font-black text-white tracking-wide uppercase font-sans drop-shadow-md group-hover:text-cyan-100 transition-colors">
                      {event.name}
                    </h3>
                  </div>

                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-8 shrink-0 pl-2 sm:pl-0 text-sm font-mono text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-400" />
                      <span className="group-hover:text-emerald-300 transition-colors">{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 w-[160px]">
                      <MapPin className="w-4 h-4 text-amber-400" />
                      <span className="group-hover:text-amber-300 transition-colors truncate">{event.location}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
