"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  MapPin,
  Trophy,
  Users,
  ArrowRight,
  Clock,
  Sparkles,
  X,
  Flame,
  ChevronRight,
} from "lucide-react";
import RubberSegment from "../ui/RubberSegment";
import EventModal from "./EventModal";

import { FESTIVAL_EVENTS, type FestivalEvent } from '@/lib/data/events';

const CATEGORIES = [
  "All",
  "Technical",
  "Cultural",
  "Gaming",
  "Informals",
  "Workshops",
] as const;

const DAYS = ["All Days", "Day 1", "Day 2", "Day 3", "Day 4"] as const;

export default function MainEvents() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedDay, setSelectedDay] = useState<string>("All Days");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModalEvent, setActiveModalEvent] = useState<FestivalEvent | null>(null);

  // Category counts mapping
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: FESTIVAL_EVENTS.length };
    FESTIVAL_EVENTS.forEach((evt) => {
      counts[evt.category] = (counts[evt.category] || 0) + 1;
    });
    return counts;
  }, []);

  // Filter events based on Category, Day, and Search term
  const filteredEvents = useMemo(() => {
    return FESTIVAL_EVENTS.filter((evt) => {
      const matchesCategory =
        selectedCategory === "All" || evt.category === selectedCategory;
      const matchesDay = selectedDay === "All Days" || evt.day === selectedDay;
      const query = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !query ||
        evt.title.toLowerCase().includes(query) ||
        evt.venue.toLowerCase().includes(query) ||
        evt.shortDesc.toLowerCase().includes(query);

      return matchesCategory && matchesDay && matchesSearch;
    });
  }, [selectedCategory, selectedDay, searchQuery]);

  const spotlightEvent = FESTIVAL_EVENTS[0]; // Web3 & AI Sprint

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Technical":
        return {
          border: "border-cyan-500/30 group-hover:border-cyan-400/70",
          glow: "group-hover:shadow-[0_15px_35px_rgba(6,182,212,0.2)]",
          badge: "bg-cyan-500/10 text-cyan-300 border-cyan-500/30",
          accent: "#22d3ee",
        };
      case "Gaming":
        return {
          border: "border-emerald-500/30 group-hover:border-emerald-400/70",
          glow: "group-hover:shadow-[0_15px_35px_rgba(16,185,129,0.2)]",
          badge: "bg-emerald-500/10 text-emerald-300 border-emerald-500/30",
          accent: "#34d399",
        };
      case "Cultural":
        return {
          border: "border-pink-500/30 group-hover:border-pink-400/70",
          glow: "group-hover:shadow-[0_15px_35px_rgba(244,114,182,0.2)]",
          badge: "bg-pink-500/10 text-pink-300 border-pink-500/30",
          accent: "#f472b6",
        };
      case "Informals":
        return {
          border: "border-amber-500/30 group-hover:border-amber-400/70",
          glow: "group-hover:shadow-[0_15px_35px_rgba(245,158,11,0.2)]",
          badge: "bg-amber-500/10 text-amber-300 border-amber-500/30",
          accent: "#fbbf24",
        };
      default:
        return {
          border: "border-purple-500/30 group-hover:border-purple-400/70",
          glow: "group-hover:shadow-[0_15px_35px_rgba(168,85,247,0.2)]",
          badge: "bg-purple-500/10 text-purple-300 border-purple-500/30",
          accent: "#c084fc",
        };
    }
  };

  return (
    <section
      id="all-events"
      className="relative w-full min-h-screen pt-24 pb-28 px-4 sm:px-6 lg:px-12 bg-[#020712] text-white z-20"
    >
      {/* Background Ambience */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-cyan-950/20 via-transparent to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(6,182,212,0.08),_rgba(2,7,18,0.98),_#020712)] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs tracking-[0.25em] uppercase font-mono shadow-[0_0_20px_rgba(6,182,212,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>INNOVISION 2026 SCHEDULE</span>
          </div>

          <h2
            className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-wider text-white drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] font-serif"
          >
            FESTIVAL EVENTS & COMPETITIONS
          </h2>

          <div className="w-28 h-[2px] bg-gradient-to-r from-transparent via-[#fbbf24] to-transparent mx-auto shadow-[0_0_8px_#fbbf24]" />

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto font-light">
            Step onto the galactic proving grounds. Compete across technical hackathons, LAN championships, cultural stages, and cosmic campus quests.
          </p>
        </div>

        {/* ── MEGA SPOTLIGHT EVENT BANNER ───────────────────────────────────── */}
        {spotlightEvent && (
          <div className="relative rounded-3xl overflow-hidden border border-cyan-500/30 bg-[#050d26]/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(6,182,212,0.15)] group transition-all duration-500 hover:border-cyan-400/60">
            {/* Background Image with Ambient Glow */}
            <div className="absolute inset-0 z-0">
              <Image
                src={spotlightEvent.image}
                alt={spotlightEvent.title}
                fill
                sizes="(max-width: 1024px) 100vw, 100vw"
                className="object-cover object-center opacity-30 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#020712] via-[#050d26]/90 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020712] via-transparent to-transparent" />
            </div>

            <div className="relative z-10 p-6 sm:p-10 lg:p-12 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
              <div className="max-w-2xl space-y-4">
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.3)]">
                    <Flame className="w-3 h-3 text-amber-400 fill-amber-400" />
                    HEADLINER SPOTLIGHT
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    {spotlightEvent.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-semibold bg-slate-900/80 text-slate-300 border border-white/10">
                    {spotlightEvent.day}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase text-white tracking-wide font-serif leading-tight drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]">
                  {spotlightEvent.title}
                </h3>

                <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                  {spotlightEvent.fullDesc}
                </p>

                <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs text-slate-300 font-mono">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-cyan-400" />
                    <span>{spotlightEvent.venue}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-cyan-400" />
                    <span>{spotlightEvent.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-cyan-400" />
                    <span>{spotlightEvent.teamSize}</span>
                  </div>
                </div>
              </div>

              {/* Right Action Callout */}
              <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 p-5 rounded-2xl bg-[#03091e]/90 border border-cyan-500/30 shadow-2xl backdrop-blur-md">
                <div className="text-left sm:text-right">
                  <span className="text-[10px] font-mono tracking-widest uppercase text-slate-400 block">
                    TOTAL CASH POOL
                  </span>
                  <div className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono flex items-center gap-1.5">
                    <Trophy className="w-6 h-6 text-emerald-400" />
                    {spotlightEvent.prizePool}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2.5 w-full">
                  <button
                    onClick={() => setActiveModalEvent(spotlightEvent)}
                    className="px-4 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-200 border border-white/20 hover:border-cyan-400 hover:text-cyan-300 transition-all cursor-pointer text-center"
                  >
                    View Rulebook
                  </button>

                  <Link
                    href="/register"
                    className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Register Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── FILTER & SEARCH TOOLBAR ────────────────────────────────────────── */}
        <div className="rounded-3xl bg-[#03091e]/90 border border-white/10 p-4 sm:p-6 backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.7)] space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-cyan-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search events by title, venue, or keywords..."
                className="w-full pl-11 pr-10 py-3 rounded-2xl bg-[#020712]/80 border border-white/15 text-white text-xs sm:text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/30 transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Day Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none font-mono tracking-wider uppercase">
              <RubberSegment
                items={[...DAYS]}
                value={selectedDay}
                onChange={(value: string) => setSelectedDay(value)}
                trackColor="rgba(2, 7, 18, 0.8)"
                thumbColor="#22d3ee"
                textColor="#cbd5e1"
                activeTextColor="#020712"
                size="sm"
                radius={12}
                equalSlots={false}
              />
            </div>
          </div>

          {/* Category Filter Pills with Live Counts */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2 border-t border-white/5">
            {CATEGORIES.map((category) => {
              const isSelected = selectedCategory === category;
              const count = categoryCounts[category] || 0;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 font-black shadow-[0_0_20px_rgba(34,211,238,0.4)] scale-105"
                      : "bg-[#020712]/90 text-slate-300 border border-white/10 hover:border-cyan-400/40 hover:text-white"
                  }`}
                >
                  <span>{category}</span>
                  <span
                    className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                      isSelected
                        ? "bg-slate-950/30 text-slate-950 font-bold"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Counter Bar */}
        <div className="flex items-center justify-between text-xs text-slate-400 px-2 font-mono">
          <span>
            Showing <strong className="text-cyan-300 font-bold">{filteredEvents.length}</strong> events
            {selectedCategory !== "All" && ` in ${selectedCategory}`}
            {selectedDay !== "All Days" && ` on ${selectedDay}`}
          </span>
          {(selectedCategory !== "All" || selectedDay !== "All Days" || searchQuery) && (
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDay("All Days");
                setSearchQuery("");
              }}
              className="text-cyan-400 hover:underline uppercase tracking-wider cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>

        {/* ── EVENT CARDS GRID ──────────────────────────────────────────────── */}
        {filteredEvents.length === 0 ? (
          <div className="rounded-3xl bg-[#03091e]/80 border border-white/10 p-16 text-center space-y-4">
            <p className="text-lg text-slate-300 font-medium">No events found matching your filter criteria.</p>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedDay("All Days");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 rounded-full bg-cyan-500 text-slate-950 font-bold text-xs uppercase tracking-widest hover:brightness-110 cursor-pointer"
            >
              View All Events
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredEvents.map((evt) => {
              const theme = getCategoryColor(evt.category);
              return (
                <div
                  key={evt.id}
                  className={`group relative rounded-3xl bg-[#03091e]/90 border ${theme.border} overflow-hidden flex flex-col justify-between transition-all duration-400 hover:-translate-y-2 ${theme.glow} shadow-xl`}
                >
                  <div>
                    {/* Image Banner */}
                    <div className="relative w-full h-52 bg-slate-950 overflow-hidden">
                      <Image
                        src={evt.image}
                        alt={evt.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-108 transition-transform duration-700 filter brightness-90 group-hover:brightness-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#03091e] via-[#03091e]/30 to-black/40" />

                      {/* Top Badges */}
                      <div className="absolute top-3 left-3 flex items-center gap-2">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-widest font-bold border backdrop-blur-md ${theme.badge}`}>
                          {evt.category}
                        </span>
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-slate-950/80 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                          {evt.day}
                        </span>
                      </div>

                      {/* Prize Pill on Image */}
                      <div className="absolute bottom-3 right-3">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold bg-slate-950/90 text-emerald-300 border border-emerald-500/40 backdrop-blur-md shadow-lg">
                          <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                          {evt.prizePool}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-5 sm:p-6 space-y-4">
                      <h4 className="text-lg sm:text-xl font-black uppercase tracking-wide text-white group-hover:text-cyan-300 transition-colors font-serif leading-snug">
                        {evt.title}
                      </h4>

                      <p className="text-xs text-slate-300 leading-relaxed font-light line-clamp-3">
                        {evt.shortDesc}
                      </p>

                      {/* Metadata Chips */}
                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/5 text-[11px] font-mono text-slate-400">
                        <div className="flex items-center gap-1.5 truncate" title={evt.venue}>
                          <MapPin className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{evt.venue}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate" title={evt.time}>
                          <Clock className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{evt.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate col-span-2" title={evt.teamSize}>
                          <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{evt.teamSize}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Footer */}
                  <div className="p-5 sm:p-6 pt-0 flex items-center gap-2">
                    <button
                      onClick={() => setActiveModalEvent(evt)}
                      className="flex-1 py-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-cyan-400/50 text-slate-200 text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-center"
                    >
                      Rulebook
                    </button>

                    <Link
                      href="/register"
                      className="flex-1 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Register</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── EVENT DETAILS & RULEBOOK MODAL ─────────────────────────────────── */}
      {activeModalEvent && (
        <EventModal
          event={activeModalEvent}
          onClose={() => setActiveModalEvent(null)}
        />
      )}
    </section>
  );
}
