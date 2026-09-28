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
  CheckCircle2,
  Phone,
  Flame,
  ChevronRight,
} from "lucide-react";

export interface FestivalEvent {
  id: string;
  title: string;
  category: "Technical" | "Cultural" | "Gaming" | "Informals" | "Workshops";
  day: "Day 1" | "Day 2" | "Day 3" | "Day 4";
  time: string;
  venue: string;
  prizePool: string;
  teamSize: string;
  image: string;
  shortDesc: string;
  fullDesc: string;
  rules: string[];
  coordinators: { name: string; phone: string }[];
  isRegistrationOpen: boolean;
  featured?: boolean;
}

const FESTIVAL_EVENTS: FestivalEvent[] = [
  {
    id: "hack-sprint",
    title: "WEB3 & AI INNOVATION SPRINT",
    category: "Technical",
    day: "Day 2",
    time: "10:00 AM - 06:00 PM",
    venue: "CS Department Lab 3",
    prizePool: "₹40,000",
    teamSize: "2 - 4 Members",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    shortDesc: "8-hour rapid prototyping sprint building decentralised apps or autonomous AI agents solving real-world challenges.",
    fullDesc: "An intense innovation sprint targeting actionable challenges in decentralized data, local LLMs, and student utilities. Mentorship sessions provided by alumni and tech industry leaders.",
    rules: [
      "All code must be written within the 8-hour sprint window.",
      "Open-source libraries and APIs are permitted; pre-built templates are not.",
      "Final pitch includes a 3-minute live demonstration and 2-minute Q&A.",
      "GitHub repo with commit history must be submitted for validation.",
    ],
    coordinators: [
      { name: "Arjun Mehta", phone: "+91 95432 10987" },
      { name: "Neha Gupta", phone: "+91 95432 10988" },
    ],
    isRegistrationOpen: true,
    featured: true,
  },
  {
    id: "lan-gaming",
    title: "LAN GAMING: VALORANT & BGMI",
    category: "Gaming",
    day: "Day 3",
    time: "10:00 AM - 08:00 PM",
    venue: "Central Computer Center",
    prizePool: "₹35,000",
    teamSize: "5 Members (Valorant) / 4 (BGMI)",
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&auto=format&fit=crop&q=80",
    shortDesc: "Compete in adrenaline-pumping esports tournaments. High refresh-rate rigs, low-ping local server, zero compromise.",
    fullDesc: "The premier collegiate gaming battleground. Teams face off in knockout brackets on tournament-grade PC setups and custom low-latency mobile lobbies with live casting, spectator arena, and hype shoutcasting.",
    rules: [
      "Standard competitive tournament rules and map pool apply.",
      "Any third-party software or exploits lead to instant DQ.",
      "Players may bring their own mice, keyboards, and headsets.",
      "Check-in 30 minutes before match start time is mandatory.",
    ],
    coordinators: [
      { name: "Kunal Verma", phone: "+91 99001 23456" },
      { name: "Devansh Roy", phone: "+91 99001 23457" },
    ],
    isRegistrationOpen: true,
    featured: true,
  },
  {
    id: "robo-soccer",
    title: "ROBO SOCCER ARENA",
    category: "Technical",
    day: "Day 1",
    time: "01:00 PM - 06:00 PM",
    venue: "Student Activity Center (SAC Grounds)",
    prizePool: "₹25,000",
    teamSize: "2 - 4 Members",
    image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    shortDesc: "Manual wireless bots clashing in a mini-pitch arena. Dribble, tackle, and strike goals for championship glory.",
    fullDesc: "Bring your custom wireless bots to the specialized astro-turf arena. Maneuver across obstacles, out-dribble rival machines, and score past opposing defenders in high-speed matches filled with strategic gameplay.",
    rules: [
      "Bot dimensions must fit within 30cm x 30cm x 30cm bounding box.",
      "Maximum bot weight is 5kg (excluding external battery if wired).",
      "Wireless control frequency must not interfere with standard 2.4GHz bands.",
      "Matches consist of two 4-minute halves with a 1-minute halftime.",
    ],
    coordinators: [
      { name: "Manish Kumar", phone: "+91 96543 21098" },
      { name: "Siddharth Roy", phone: "+91 96543 21099" },
    ],
    isRegistrationOpen: true,
  },
  {
    id: "tech-quiz",
    title: "TECH QUIZ SHOWDOWN",
    category: "Technical",
    day: "Day 2",
    time: "02:00 PM - 05:00 PM",
    venue: "Lecture Hall Complex (LH-2)",
    prizePool: "₹20,000",
    teamSize: "1 - 2 Members",
    image: "/images/tech_quiz.jpg",
    shortDesc: "Battle of wits testing your knowledge in modern tech, space history, AI revolutions, and engineering trivia.",
    fullDesc: "A high-octane quiz conducted by renowned quizmasters. Features a written preliminary screening round followed by an on-stage buzzer finale with audiovisual questions, rapid-fire rounds, and risk-reward betting rounds.",
    rules: [
      "Preliminary round consists of 25 objective and written questions.",
      "Top 6 teams advance to the live stage finals.",
      "Use of electronic gadgets during rounds is strictly forbidden.",
      "Quizmaster's ruling is final and binding.",
    ],
    coordinators: [
      { name: "Rohan Das", phone: "+91 98123 45678" },
      { name: "Sneha Nair", phone: "+91 98123 45679" },
    ],
    isRegistrationOpen: true,
  },
  {
    id: "treasure-hunt",
    title: "TREASURE HUNT",
    category: "Informals",
    day: "Day 1",
    time: "11:00 AM - 03:00 PM",
    venue: "Campus Wide (Starting at SAC)",
    prizePool: "₹15,000",
    teamSize: "2 - 4 Members",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    shortDesc: "Decode celestial riddles, explore hidden corners of the campus, and race against time to claim the lost artifact.",
    fullDesc: "The ultimate campus-wide mystery challenge. Teams will receive encrypted clue cards requiring logic, campus trivia, and keen observation. Each checkpoint unlocks a coordinate leading to the grand final treasure vault.",
    rules: [
      "All team members must carry valid institute/government ID cards.",
      "Strictly no motorized vehicles permitted during the hunt.",
      "Clues must not be damaged or altered at checkpoints.",
      "Fastest verified team with all checkpoint stamps wins.",
    ],
    coordinators: [
      { name: "Aarav Sharma", phone: "+91 98765 43210" },
      { name: "Pooja Patel", phone: "+91 98765 43211" },
    ],
    isRegistrationOpen: true,
  },
  {
    id: "escape-room",
    title: "COSMIC ESCAPE ROOM",
    category: "Informals",
    day: "Day 3",
    time: "12:00 PM - 07:00 PM",
    venue: "Mechanical Workshop Complex",
    prizePool: "₹15,000",
    teamSize: "3 - 5 Members",
    image: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&auto=format&fit=crop&q=80",
    shortDesc: "Trapped in a malfunctioning deep-space station. Solve mechanical locks and laser puzzles within 30 minutes.",
    fullDesc: "Step into an immersive physical puzzle room equipped with reactive LEDs, pressure plates, cipher decoders, and sound cues. Your crew must work collaboratively under time pressure to reboot the spacecraft reactor before the countdown ends.",
    rules: [
      "30 minutes time limit per team.",
      "No physical damage to room equipment or props is permitted.",
      "Two clue hints can be requested during the game with a 2-minute penalty.",
      "Teams are ranked by total escape time and fewer hints taken.",
    ],
    coordinators: [
      { name: "Kartik Soni", phone: "+91 94321 09876" },
      { name: "Shreya Sen", phone: "+91 94321 09877" },
    ],
    isRegistrationOpen: true,
  },
  {
    id: "open-mic",
    title: "OPEN MIC: CELESTIAL ACOUSTICS",
    category: "Cultural",
    day: "Day 4",
    time: "05:00 PM - 08:30 PM",
    venue: "Open Air Amphitheatre",
    prizePool: "₹12,000",
    teamSize: "Solo / Duo",
    image: "/images/open_mic.jpg",
    shortDesc: "An intimate stage under the open night sky for soulful poetry, acoustic jams, standup comedy, and storytelling.",
    fullDesc: "Step into the spotlight at the open-air amphitheater. Whether you sing original indie tracks, deliver sharp comedic timing, or recite powerful verse, this is your platform to move the audience with your voice.",
    rules: [
      "Time limit: Maximum 5 minutes per performance.",
      "Content must be original and respectful; vulgarity is strictly prohibited.",
      "Acoustic guitars and basic backing tracks via aux are permitted.",
      "Pre-registration is required; walk-in slots are subject to availability.",
    ],
    coordinators: [
      { name: "Isha Sen", phone: "+91 97654 32100" },
      { name: "Tanmay Sen", phone: "+91 97654 32101" },
    ],
    isRegistrationOpen: true,
  },
  {
    id: "photo-walks",
    title: "PHOTO WALKS & PERSPECTIVES",
    category: "Cultural",
    day: "Day 2",
    time: "07:00 AM - 12:00 PM",
    venue: "Main Campus Grounds & Architecture Complex",
    prizePool: "₹12,000",
    teamSize: "Solo",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80",
    shortDesc: "Capture raw aesthetics, golden hour shadows, and the pulse of INNOVISION through your camera lens.",
    fullDesc: "Guided morning photowalk across architectural landmarks and hidden spots of NIT Rourkela. Themes will be revealed on the spot. Entries are judged by professional photographers on composition, storytelling, and lighting.",
    rules: [
      "Both DSLR and smartphone photography categories are evaluated.",
      "Basic color correction is allowed; manipulation/AI generation is disqualified.",
      "EXIF data must be retained on submitted raw/JPEG files.",
      "Submission deadline is 2:00 PM on Day 2.",
    ],
    coordinators: [
      { name: "Vikram Rathore", phone: "+91 98321 65490" },
      { name: "Aditi Rao", phone: "+91 98321 65491" },
    ],
    isRegistrationOpen: true,
  },
  {
    id: "stargazing-workshop",
    title: "STARGAZING & ASTROPHYSICS LAB",
    category: "Workshops",
    day: "Day 1",
    time: "07:30 PM - 10:30 PM",
    venue: "Terrace Observatory, Main Building",
    prizePool: "Certificates & Kit",
    teamSize: "Open for All",
    image: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?w=800&auto=format&fit=crop&q=80",
    shortDesc: "Peer into planetary rings and lunar craters through high-powered Cassegrain telescopes guided by astrophysicists.",
    fullDesc: "An enchanting hands-on astronomy session under the dark skies. Includes astrophotography tips, deep-sky object tracking, and an interactive Q&A session on cosmological frontiers and exoplanet detection.",
    rules: [
      "Open to all registered INNOVISION pass holders.",
      "Entry on first-come-first-serve batch schedule.",
      "Handle astronomical telescopes and equipment with care.",
      "Special certificates of participation awarded to attendees.",
    ],
    coordinators: [
      { name: "Dr. K. Swaminathan", phone: "+91 93210 98765" },
      { name: "Ritika Roy", phone: "+91 93210 98766" },
    ],
    isRegistrationOpen: true,
  },
];

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
                priority
                className="object-cover object-center opacity-30 group-hover:scale-105 group-hover:opacity-40 transition-all duration-700 filter brightness-75"
                unoptimized
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
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {DAYS.map((day) => (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono uppercase tracking-wider whitespace-nowrap transition-all cursor-pointer ${
                    selectedDay === day
                      ? "bg-cyan-500 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                      : "bg-[#020712] text-slate-300 border border-white/10 hover:border-cyan-400/50 hover:text-white"
                  }`}
                >
                  {day}
                </button>
              ))}
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
                        unoptimized={evt.image.startsWith("http")}
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
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActiveModalEvent(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#03091e] border border-cyan-500/40 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.9)] space-y-6 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Close Button */}
            <button
              onClick={() => setActiveModalEvent(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer z-10"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header */}
            <div className="space-y-2 pr-8">
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  {activeModalEvent.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {activeModalEvent.day}
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black uppercase text-white font-serif leading-tight">
                {activeModalEvent.title}
              </h3>
            </div>

            {/* Metadata Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-white/5 border border-white/10 text-xs font-mono">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Prize Pool</span>
                <span className="font-bold text-emerald-400">{activeModalEvent.prizePool}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Venue</span>
                <span className="font-semibold text-slate-200">{activeModalEvent.venue}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Time</span>
                <span className="font-semibold text-slate-200">{activeModalEvent.time}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase">Team Size</span>
                <span className="font-semibold text-slate-200">{activeModalEvent.teamSize}</span>
              </div>
            </div>

            {/* Full Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                Overview
              </h4>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-light">
                {activeModalEvent.fullDesc}
              </p>
            </div>

            {/* Rules Checklist */}
            <div className="space-y-3">
              <h4 className="text-xs font-mono uppercase tracking-widest text-cyan-300 font-bold">
                Official Rules & Guidelines
              </h4>
              <ul className="space-y-2">
                {activeModalEvent.rules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Event Coordinators */}
            <div className="space-y-3 pt-2 border-t border-white/10">
              <h4 className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                Event Coordinators
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {activeModalEvent.coordinators.map((c, idx) => (
                  <a
                    key={idx}
                    href={`tel:${c.phone}`}
                    className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-400/50 transition-colors"
                  >
                    <div>
                      <p className="text-xs font-bold text-white">{c.name}</p>
                      <p className="text-[11px] font-mono text-cyan-300">{c.phone}</p>
                    </div>
                    <Phone className="w-4 h-4 text-cyan-400" />
                  </a>
                ))}
              </div>
            </div>

            {/* Modal Sticky Footer CTA */}
            <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
              <button
                onClick={() => setActiveModalEvent(null)}
                className="px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Close
              </button>

              <Link
                href="/register"
                className="px-7 py-2.5 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-cyan-500 to-teal-400 text-slate-950 hover:brightness-110 shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Register Pass</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
