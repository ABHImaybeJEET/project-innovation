"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, AlertCircle, Loader2, Send, ShieldCheck, Sparkles, ArrowLeft } from "lucide-react";

export default function GenericRegistrationForm({ userEmail }: { userEmail: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [collegeName, setCollegeName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [turnstileToken] = useState<string>("XXXX.DUMMY.PASS.XXXX");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mobileNumber.length !== 10) {
      setError("Mobile number must be exactly 10 digits.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          college: collegeName,
          phone: mobileNumber,
          turnstile_token: turnstileToken,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setError(data.error || "Registration failed. Please try again.");
      } else {
        setSubmitted(true);
        setTimeout(() => {
          router.push("/my-registration");
          router.refresh();
        }, 2000);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "A network connection error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center text-center py-8 space-y-6">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-400 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-serif text-amber-100 tracking-wider uppercase">
          REGISTRATION CONFIRMED!
        </h2>
        <p className="text-sm text-slate-300 max-w-md">
          Welcome aboard the Celestial Odyssey. Your ticket confirmation has been generated. Redirecting...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-300/80 hover:text-amber-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>BACK</span>
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[10px] uppercase tracking-[0.2em] font-mono">
          <Sparkles className="w-3 h-3 text-amber-400" />
          <span>INNOVISION 2026</span>
        </div>
      </div>

      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-wider text-amber-100 font-serif uppercase">
          REGISTER
        </h1>
        <div className="w-full h-px bg-gradient-to-r from-amber-500/40 via-amber-400/20 to-transparent" />
        <p className="text-xs sm:text-sm text-slate-400 font-light">
          Fill in your details to complete registration.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 pt-2">
        {error && (
          <div role="alert" className="flex items-start gap-3 p-3.5 rounded-xl border border-red-500/40 bg-red-950/40 text-red-200 text-xs sm:text-sm">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Full Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-100/90">
            Name (as on government ID)
          </label>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="e.g. Alex Vance"
            className="w-full px-4 py-3 rounded-xl bg-[#081028]/90 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
          />
        </div>

        {/* Email Address (Pre-filled from session) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-100/90">
            Email
          </label>
          <div className="relative flex items-center">
            <input
              type="email"
              readOnly
              value={userEmail}
              className="w-full px-4 py-3 rounded-xl bg-[#060c20]/95 border border-white/10 text-white/80 text-sm cursor-not-allowed select-all"
            />
            <div className="absolute right-3 flex items-center gap-1 px-2 py-0.5 rounded bg-teal-500/10 border border-teal-500/30 text-[10px] text-teal-300 font-mono">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              Verified
            </div>
          </div>
          <p className="text-[11px] text-slate-500 pl-1">
            This is the email you signed in with.
          </p>
        </div>

        {/* Mobile Number */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-100/90">
            Phone number
          </label>
          <div className="relative flex items-center">
            <input
              type="tel"
              required
              pattern="\d{10}"
              title="Mobile number must be exactly 10 digits"
              value={mobileNumber}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 10) setMobileNumber(val);
              }}
              placeholder="10-digit mobile"
              className="w-full px-4 py-3 rounded-xl bg-[#081028]/90 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
            />
            <div className="absolute right-3 text-[10px] font-mono text-slate-400">
              {mobileNumber.length}/10
            </div>
          </div>
        </div>

        {/* College Name */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-amber-100/90">
            College
          </label>
          <input
            type="text"
            required
            value={collegeName}
            onChange={(e) => setCollegeName(e.target.value)}
            placeholder="e.g. NIT Rourkela"
            className="w-full px-4 py-3 rounded-xl bg-[#081028]/90 border border-white/15 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/30 transition-all shadow-[inset_0_2px_4px_rgba(0,0,0,0.4)]"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs sm:text-sm uppercase tracking-[0.25em] hover:brightness-110 hover:shadow-[0_0_30px_rgba(245,158,11,0.5)] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Complete Registration</span>
              <Send className="w-4 h-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}
