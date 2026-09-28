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

export const FESTIVAL_EVENTS: FestivalEvent[] = [
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
