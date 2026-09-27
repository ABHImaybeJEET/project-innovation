import { Suspense } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import ParticipantDetailsForm from "@/components/auth/ParticipantDetailsForm";

export const metadata = {
  title: "Participant Credentials | INNOVISION 2026",
  description: "Enter your official participant details for INNOVISION 2026 registration",
};

function DetailsLoadingFallback() {
  return (
    <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/30 via-teal-500/15 to-amber-500/25 border border-[#fbbf24]/40 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.9)]">
      <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-12 text-center flex flex-col items-center justify-center space-y-4 border border-white/10">
        <Loader2 className="w-8 h-8 animate-spin text-amber-400" />
        <p className="text-xs tracking-[0.25em] text-slate-400 uppercase font-mono">
          Loading Participant Form...
        </p>
      </div>
    </div>
  );
}

export default function DetailsPage() {
  return (
    <main className="relative min-h-screen w-full bg-[#020712] text-white flex flex-col items-center justify-center px-4 py-12 sm:py-24 overflow-hidden select-none">
      {/* Background Deep Space Cosmic Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-[#03091e]/90 to-[#020712] pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-amber-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-1000" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Top Floating Header Controls */}
      <div className="absolute top-6 left-4 sm:left-12 z-50">
        <Link
          href="/"
          className="group flex items-center gap-2 px-4 py-2.5 rounded-full border border-amber-500/30 bg-[#020712]/90 backdrop-blur-md text-amber-200 text-xs tracking-widest uppercase hover:border-amber-400 hover:text-white hover:shadow-[0_0_20px_rgba(245,158,11,0.25)] transition-all duration-300 shadow-[0_0_15px_rgba(245,158,11,0.15)] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform text-amber-400" />
          <span className="font-semibold">Back to Home</span>
        </Link>
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-xl my-auto">
        <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/30 via-teal-500/15 to-amber-500/25 border border-[#fbbf24]/40 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(251,191,36,0.2)]">
          <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-10 border border-white/10">
            <Suspense fallback={<DetailsLoadingFallback />}>
              <ParticipantDetailsForm />
            </Suspense>
          </div>
        </div>
      </div>
    </main>
  );
}
