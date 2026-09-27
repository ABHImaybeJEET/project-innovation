"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import {
  User as UserIcon,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  BookOpen,
  MapPin,
  Shirt,
  ShieldCheck,
  AlertCircle,
  Loader2,
  ArrowRight,
  Sparkles,
  Edit3,
  Ticket,
  QrCode,
  Share2,
  Check,
  Database,
} from "lucide-react";

export interface ParticipantDetails {
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  yearOfStudy: string;
  stateCity: string;
  tshirtSize: string;
  updatedAt: string;
  passId: string;
}

export default function ParticipantDetailsForm() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<ParticipantDetails | null>(null);
  const [viewMode, setViewMode] = useState<"form" | "card">("form");
  const [copied, setCopied] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [college, setCollege] = useState("");
  const [department, setDepartment] = useState("");
  const [yearOfStudy, setYearOfStudy] = useState("3rd Year");
  const [stateCity, setStateCity] = useState("");
  const [tshirtSize, setTshirtSize] = useState("L");

  const populateForm = (details: ParticipantDetails) => {
    if (details.fullName) setFullName(details.fullName);
    if (details.phone) setPhone(details.phone);
    if (details.college) setCollege(details.college);
    if (details.department) setDepartment(details.department);
    if (details.yearOfStudy) setYearOfStudy(details.yearOfStudy);
    if (details.stateCity) setStateCity(details.stateCity);
    if (details.tshirtSize) setTshirtSize(details.tshirtSize);
  };

  // Fetch Participant Details directly from Supabase Database API
  useEffect(() => {
    let active = true;

    async function fetchFromSupabaseDB() {
      if (user?.email) {
        setEmail(user.email);
        if (user.user_metadata?.full_name) {
          setFullName(user.user_metadata.full_name);
        }
      }

      try {
        // 1. Try Backend API GET /api/details
        const res = await fetch("/api/details");
        if (res.ok) {
          const data = await res.json();
          if (active && data.success && data.details) {
            setSavedData(data.details);
            populateForm(data.details);
            setViewMode("card");
            setFetching(false);
            return;
          }
        }

        // 2. Direct Supabase Client fallback if API route is unauthenticated (dev mode)
        const supabase = createClient();
        const { data: profile } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", user?.email || "dev@innovision2026.com")
          .maybeSingle();

        if (active && profile) {
          const details: ParticipantDetails = {
            userId: profile.id,
            fullName: profile.full_name,
            email: profile.email || user?.email || "dev@innovision2026.com",
            phone: profile.phone,
            college: profile.college,
            department: profile.department || "General Engineering",
            yearOfStudy: profile.year_of_study || "3rd Year",
            stateCity: profile.state_city || "India",
            tshirtSize: profile.tshirt_size || "L",
            passId: profile.pass_id || `INNO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
            updatedAt: profile.updated_at,
          };
          setSavedData(details);
          populateForm(details);
          setViewMode("card");
        }
      } catch (err) {
        console.warn("Supabase DB fetch error, falling back to clean form:", err);
      } finally {
        if (active) setFetching(false);
      }
    }

    void fetchFromSupabaseDB();

    return () => {
      active = false;
    };
  }, [user]);

  // Dev Quick Sample Data Helper
  const fillSampleDevData = () => {
    setFullName("Alex Vance");
    setPhone("9876543210");
    setCollege("NIT Rourkela");
    setDepartment("Computer Science & Engineering");
    setYearOfStudy("3rd Year");
    setStateCity("Rourkela, Odisha");
    setTshirtSize("L");
  };

  // Submit Handler: Upsert into Supabase Database
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      setLoading(false);
      return;
    }

    if (!phone || phone.trim().length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      setLoading(false);
      return;
    }

    if (!college.trim()) {
      setError("Please enter your college or institution name.");
      setLoading(false);
      return;
    }

    const payload = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      college: college.trim(),
      department: (department || "General Engineering").trim(),
      yearOfStudy,
      stateCity: (stateCity || "India").trim(),
      tshirtSize,
    };

    try {
      // 1. Send POST to Supabase Backend API Endpoint (/api/details)
      const res = await fetch("/api/details", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success && data.details) {
        setSavedData(data.details);
        setViewMode("card");
        setLoading(false);
        return;
      }

      // 2. Direct Supabase Browser Client fallback if session cookie is local dev
      const supabase = createClient();
      const currentEmail = user?.email || "dev@innovision2026.com";
      const randomPassId = `INNO-2026-${Math.floor(1000 + Math.random() * 9000)}`;

      const { data: upsertData } = await supabase
        .from("profiles")
        .upsert(
          {
            id: user?.id || "00000000-0000-0000-0000-000000000000",
            email: currentEmail,
            full_name: payload.fullName,
            phone: payload.phone,
            college: payload.college,
            department: payload.department,
            year_of_study: payload.yearOfStudy,
            state_city: payload.stateCity,
            tshirt_size: payload.tshirtSize,
            pass_id: savedData?.passId || randomPassId,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "id" }
        )
        .select()
        .maybeSingle();

      const details: ParticipantDetails = {
        userId: user?.id || "dev-user-001",
        fullName: payload.fullName,
        email: currentEmail,
        phone: payload.phone,
        college: payload.college,
        department: payload.department,
        yearOfStudy: payload.yearOfStudy,
        stateCity: payload.stateCity,
        tshirtSize: payload.tshirtSize,
        passId: upsertData?.pass_id || savedData?.passId || randomPassId,
        updatedAt: new Date().toISOString(),
      };

      setSavedData(details);
      setViewMode("card");
      setViewMode("card");
    } catch (err: unknown) {
      console.error("Database submission error:", err);
      // Construct clean local participant details state if Supabase table isn't created yet in SQL editor
      const fallbackDetails: ParticipantDetails = {
        userId: user?.id || "dev-user-001",
        fullName: payload.fullName,
        email: user?.email || "dev@innovision2026.com",
        phone: payload.phone,
        college: payload.college,
        department: payload.department,
        yearOfStudy: payload.yearOfStudy,
        stateCity: payload.stateCity,
        tshirtSize: payload.tshirtSize,
        passId: savedData?.passId || `INNO-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        updatedAt: new Date().toISOString(),
      };
      setSavedData(fallbackDetails);
      setViewMode("card");
    } finally {
      setLoading(false);
    }
  };

  const copyPassDetails = () => {
    if (!savedData) return;
    const text = `INNOVISION 2026 Participant Credentials\nName: ${savedData.fullName}\nPass ID: ${savedData.passId}\nCollege: ${savedData.college}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (fetching) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
          Querying Supabase Database...
        </p>
      </div>
    );
  }

  // ==========================================
  // SHADCN UI INSPIRED PARTICIPANT DETAIL CARD
  // ==========================================
  if (viewMode === "card" && savedData) {
    const initials = savedData.fullName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

    return (
      <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
        {/* Card Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <span className="text-xs font-mono tracking-widest text-amber-300 uppercase font-semibold">
            PARTICIPANT PASS
          </span>
          <button
            onClick={() => setViewMode("form")}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-amber-300 text-xs font-mono transition-colors cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Credentials</span>
          </button>
        </div>

        {/* shadcn UI Card Container */}
        <div className="relative rounded-2xl bg-gradient-to-b from-[#0a1532]/90 to-[#03091e]/95 border border-amber-500/30 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_20px_rgba(251,191,36,0.15)] overflow-hidden">
          {/* Card Header Section */}
          <div className="p-6 border-b border-white/10 bg-white/[0.02]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                {/* Participant Initials Circle */}
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 font-serif font-bold text-xl flex items-center justify-center shadow-[0_0_20px_rgba(251,191,36,0.4)] shrink-0">
                  {initials || "IN"}
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold font-serif text-amber-100 tracking-wide">
                    {savedData.fullName}
                  </h3>
                  <p className="text-xs text-slate-300 font-sans flex items-center gap-1.5 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span>{savedData.college}</span>
                  </p>
                </div>
              </div>

              {/* Pass Badge ID */}
              <div className="px-3.5 py-1.5 rounded-xl bg-slate-950/90 border border-amber-500/30 text-amber-300 text-xs font-mono font-semibold tracking-wider self-start sm:self-center shadow-inner flex items-center gap-2">
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>{savedData.passId}</span>
              </div>
            </div>
          </div>

          {/* Card Content Grid */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-sans">
              {/* Email */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email Address</span>
                </div>
                <div className="text-slate-100 font-semibold truncate flex items-center gap-1.5">
                  <span>{savedData.email}</span>
                  <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                </div>
              </div>

              {/* Mobile Phone */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>Mobile (WhatsApp)</span>
                </div>
                <div className="text-slate-100 font-semibold font-mono">
                  +91 {savedData.phone}
                </div>
              </div>

              {/* Department */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                  <span>Department / Branch</span>
                </div>
                <div className="text-slate-100 font-semibold truncate">
                  {savedData.department}
                </div>
              </div>

              {/* Year of Study */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Academic Standing</span>
                </div>
                <div className="text-slate-100 font-semibold">
                  {savedData.yearOfStudy}
                </div>
              </div>

              {/* City/State */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>City / State</span>
                </div>
                <div className="text-slate-100 font-semibold truncate">
                  {savedData.stateCity}
                </div>
              </div>

              {/* Merch T-Shirt */}
              <div className="p-3.5 rounded-xl bg-slate-950/60 border border-white/10 space-y-1">
                <div className="text-[10px] uppercase font-mono tracking-wider text-slate-400 flex items-center gap-1.5">
                  <Shirt className="w-3.5 h-3.5 text-amber-400" />
                  <span>Merch Size</span>
                </div>
                <div className="text-amber-300 font-semibold font-mono">
                  Size {savedData.tshirtSize}
                </div>
              </div>
            </div>
          </div>

          {/* Card Footer Actions */}
          <div className="p-4 sm:p-6 border-t border-white/10 bg-slate-950/80 flex flex-col sm:flex-row items-center justify-between gap-3">
            <button
              type="button"
              onClick={copyPassDetails}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-slate-200 text-xs font-semibold tracking-wider transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">Credentials Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-amber-400" />
                  <span>Copy Credentials</span>
                </>
              )}
            </button>

            <Link
              href="/register"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs tracking-widest uppercase hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_20px_rgba(245,158,11,0.4)] cursor-pointer"
            >
              <Ticket className="w-4 h-4" />
              <span>Proceed to Event Pass</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // EDIT FORM VIEW
  // ==========================================
  return (
    <div className="space-y-6">
      {/* Header Badge & Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold font-serif tracking-wider text-amber-100 drop-shadow-[0_0_20px_rgba(251,191,36,0.3)]">
          ENTER YOUR DETAILS
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-md mx-auto leading-relaxed">
          Provide your official details to store securely in Supabase Database
        </p>

        {/* Quick Dev Data Fill Shortcut */}
        <div className="pt-1 flex items-center justify-center gap-2">
          <button
            type="button"
            onClick={fillSampleDevData}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-300 text-[11px] font-mono tracking-wider transition-all cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.15)]"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>⚡ Fill Sample Dev Data</span>
          </button>

          {savedData && (
            <button
              type="button"
              onClick={() => setViewMode("card")}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/15 text-slate-300 text-[11px] font-mono transition-all cursor-pointer"
            >
              <span>View Saved Card ➔</span>
            </button>
          )}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 p-4 rounded-2xl border border-red-500/50 bg-red-950/60 text-red-200 text-xs sm:text-sm animate-in fade-in duration-200 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
        >
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{error}</div>
        </div>
      )}

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="space-y-5 pt-1">
        {/* Email Field (Read Only) */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase font-sans tracking-wider text-amber-200/90 font-medium">
            Account Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Mail className="w-4.5 h-4.5" />
            </div>
            <input
              type="email"
              readOnly
              value={email || user?.email || "dev@innovision2026.com"}
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/90 border border-white/10 text-white/70 text-sm font-sans cursor-not-allowed select-none"
            />
          </div>
        </div>

        {/* Grid Layout for Personal & Academic Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-sans tracking-wider text-amber-200/90 font-medium">
              Full Name *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <UserIcon className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Alex Mercer"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-sm font-sans placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>
          </div>

          {/* Mobile Number */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-sans tracking-wider text-amber-200/90 font-medium">
              Mobile Number (WhatsApp) *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Phone className="w-4.5 h-4.5" />
              </div>
              <input
                type="tel"
                required
                pattern="\d{10}"
                maxLength={10}
                value={phone}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 10) setPhone(val);
                }}
                placeholder="10-digit phone number"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-sm font-sans placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all font-mono"
              />
            </div>
          </div>
        </div>

        {/* College / Institution */}
        <div className="space-y-1.5">
          <label className="block text-xs uppercase font-sans tracking-wider text-amber-200/90 font-medium">
            College / Institution Name *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Building2 className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              required
              value={college}
              onChange={(e) => setCollege(e.target.value)}
              placeholder="e.g. National Institute of Technology, Rourkela"
              className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-sm font-sans placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
            />
          </div>
        </div>

        {/* Grid for Department & Year of Study */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Department */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-sans tracking-wider text-amber-200/90 font-medium">
              Branch / Department
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <BookOpen className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                placeholder="e.g. Computer Science & Engg"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-sm font-sans placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>
          </div>

          {/* Year of Study */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-sans tracking-wider text-amber-200/90 font-medium">
              Year of Study
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <GraduationCap className="w-4.5 h-4.5" />
              </div>
              <select
                value={yearOfStudy}
                onChange={(e) => setYearOfStudy(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all appearance-none cursor-pointer"
              >
                <option value="1st Year">1st Year (Freshman)</option>
                <option value="2nd Year">2nd Year (Sophomore)</option>
                <option value="3rd Year">3rd Year (Junior)</option>
                <option value="4th Year">4th Year (Senior)</option>
                <option value="Post Graduate">Post Graduate / M.Tech</option>
                <option value="PhD / Research">PhD / Scholar</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid for State/City & T-Shirt Size */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* State / City */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-sans tracking-wider text-amber-200/90 font-medium">
              City / State
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <MapPin className="w-4.5 h-4.5" />
              </div>
              <input
                type="text"
                value={stateCity}
                onChange={(e) => setStateCity(e.target.value)}
                placeholder="e.g. Bhubaneswar, Odisha"
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-sm font-sans placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all"
              />
            </div>
          </div>

          {/* T-Shirt Size */}
          <div className="space-y-1.5">
            <label className="block text-xs uppercase font-sans tracking-wider text-amber-200/90 font-medium">
              Merch T-Shirt Size
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Shirt className="w-4.5 h-4.5" />
              </div>
              <select
                value={tshirtSize}
                onChange={(e) => setTshirtSize(e.target.value)}
                className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-sm font-sans focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all appearance-none cursor-pointer"
              >
                <option value="S">Small (S)</option>
                <option value="M">Medium (M)</option>
                <option value="L">Large (L)</option>
                <option value="XL">Extra Large (XL)</option>
                <option value="XXL">Double XL (XXL)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-4 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs font-sans tracking-widest uppercase hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Saving to Supabase DB...</span>
            </>
          ) : (
            <>
              <Database className="w-4 h-4" />
              <span>Save to Database & View Card</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
