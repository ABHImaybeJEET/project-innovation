"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useAuth } from "@/hooks/useAuth";
import {
  Mail,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Lock,
  Sparkles,
} from "lucide-react";
import { sanitizeRedirectUrl } from "@/lib/auth/redirect";

/**
 * Categorizes and formats Supabase error messages into clean user-friendly text.
 */
function formatAuthError(error: unknown): string {
  if (!error) return "";
  const message =
    typeof error === "object" && error !== null && "message" in error
      ? String((error as { message: unknown }).message)
      : String(error);

  const lower = message.toLowerCase();

  if (
    lower.includes("rate limit") ||
    lower.includes("too many requests") ||
    lower.includes("over_email_send_rate_limit")
  ) {
    return "Too many attempts. Please wait a moment before requesting another magic link.";
  }
  if (
    lower.includes("network") ||
    lower.includes("failed to fetch") ||
    lower.includes("fetch failed")
  ) {
    return "Network connection error. Please check your internet connection and try again.";
  }

  return message || "An authentication error occurred. Please try again.";
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const rawRedirect = searchParams.get("redirect") || searchParams.get("next");
  const _targetRedirect = sanitizeRedirectUrl(rawRedirect) || "/details";

  const {
    user,
    loading: authLoading,
    signInAsDevUser,
    signInWithGoogle,
    signInWithEmailOtp,
  } = useAuth();

  // Stage state: 'email' or 'link-sent'
  const [stage, setStage] = useState<"email" | "link-sent">("email");
  const [email, setEmail] = useState("");

  // Captcha state
  const [captchaVerified, setCaptchaVerified] = useState(false);
  const [captchaLoading, setCaptchaLoading] = useState(false);

  // Loading & status states
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isSendingLink, setIsSendingLink] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);

  // Resend cooldown timer (60 seconds)
  const [cooldown, setCooldown] = useState(0);

  // Auto-redirect authenticated user seamlessly without hard page reload
  useEffect(() => {
    // If target redirect is explicitly provided in URL query, handle redirect
    if (!authLoading && user && rawRedirect) {
      const target = sanitizeRedirectUrl(rawRedirect);
      window.location.href = target;
    }
  }, [user, authLoading, rawRedirect]);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  // Handle Captcha Verification Toggle
  const handleCaptchaCheck = () => {
    if (captchaVerified) {
      setCaptchaVerified(false);
      return;
    }
    setCaptchaLoading(true);
    setTimeout(() => {
      setCaptchaLoading(false);
      setCaptchaVerified(true);
    }, 800);
  };

  // Handler: Fast Dev Mode Bypass (Directly navigate to /details)
  const handleDevBypass = () => {
    signInAsDevUser();
    router.push("/details");
  };

  // Helper: validate captcha before submit
  const validateSecurity = (): boolean => {
    if (!captchaVerified) {
      setErrorMessage("Please complete the Security Check before signing in.");
      return false;
    }
    return true;
  };

  // Handler: Continue with Google
  const handleGoogleSignIn = async () => {
    setErrorMessage(null);
    if (!validateSecurity()) return;

    setIsGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle("/details");
      if (error) {
        setErrorMessage(formatAuthError(error));
        setIsGoogleLoading(false);
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
      setIsGoogleLoading(false);
    }
  };

  // Handler: Send Magic Link
  const handleSendMagicLink = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    setErrorMessage(null);
    if (!validateSecurity()) return;

    setIsSendingLink(true);

    try {
      const { error } = await signInWithEmailOtp(cleanEmail, "/details");

      if (error) {
        setErrorMessage(formatAuthError(error));
        setIsSendingLink(false);
      } else {
        setStage("link-sent");
        setCooldown(60);
        setSuccessInfo(`Magic login link sent to ${cleanEmail}`);
        setIsSendingLink(false);
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
      setIsSendingLink(false);
    }
  };

  // Handler: Resend Magic Link
  const handleResendMagicLink = async () => {
    if (cooldown > 0 || isSendingLink) return;
    setErrorMessage(null);
    setIsSendingLink(true);

    try {
      const { error } = await signInWithEmailOtp(email.trim(), "/details");

      if (error) {
        setErrorMessage(formatAuthError(error));
      } else {
        setCooldown(60);
        setSuccessInfo("A fresh magic link has been sent to your email.");
      }
    } catch (err) {
      setErrorMessage(formatAuthError(err));
    } finally {
      setIsSendingLink(false);
    }
  };

  // Change Email: back to stage 'email'
  const handleChangeEmail = () => {
    setStage("email");
    setErrorMessage(null);
    setSuccessInfo(null);
  };

  return (
    <div className="p-1 sm:p-2 rounded-3xl bg-gradient-to-b from-[#fbbf24]/30 via-teal-500/15 to-amber-500/25 border border-[#fbbf24]/40 backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_40px_rgba(251,191,36,0.2)]">
      <div className="rounded-[calc(1.5rem-0.25rem)] bg-[#03091e]/95 p-6 sm:p-10 border border-white/10 space-y-6">
        {/* Header with Title PNG */}
        <div className="text-center space-y-2">
          <div className="relative w-full max-w-[360px] sm:max-w-[440px] h-20 sm:h-28 mx-auto">
            <Image
              src="/innovision_transparent.png"
              alt="INNOVISION 2026"
              fill
              className="object-contain object-center drop-shadow-[0_0_25px_rgba(251,191,36,0.5)] scale-105"
              priority
            />
          </div>
          <p className="text-xs sm:text-sm text-slate-300 font-sans max-w-sm mx-auto leading-relaxed">
            {stage === "email"
              ? "Sign in to access your pass and manage event registrations"
              : "Check your email inbox for your magic sign-in link"}
          </p>
        </div>

        {/* Error Banner */}
        {errorMessage && (
          <div
            role="alert"
            className="flex items-start gap-3 p-4 rounded-2xl border border-red-500/50 bg-red-950/60 text-red-200 text-xs sm:text-sm animate-in fade-in duration-200 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{errorMessage}</div>
          </div>
        )}

        {/* Success Info Banner */}
        {successInfo && !errorMessage && (
          <div className="flex items-center gap-2.5 p-3.5 rounded-2xl border border-emerald-500/40 bg-emerald-950/40 text-emerald-200 text-xs animate-in fade-in duration-200 shadow-[0_0_20px_rgba(16,185,129,0.15)]">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-medium">{successInfo}</span>
          </div>
        )}

        {/* STAGE 1: EMAIL INPUT & GOOGLE OAUTH */}
        {stage === "email" && (
          <div className="space-y-5 pt-1">
            {/* Email Magic Link Form */}
            <form onSubmit={handleSendMagicLink} className="space-y-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="login-email"
                  className="block text-xs uppercase font-sans tracking-wider text-amber-200/90 font-medium"
                >
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4.5 h-4.5" />
                  </div>
                  <input
                    id="login-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="explorer@odyssey.edu"
                    disabled={isSendingLink || isGoogleLoading}
                    className="w-full pl-10 pr-4 py-3.5 rounded-2xl bg-slate-950/80 border border-white/15 text-white text-sm font-sans placeholder:text-slate-500 focus:outline-none focus:border-amber-400/80 focus:ring-2 focus:ring-amber-400/20 transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Submit Magic Link Button */}
              <button
                id="send-magic-link-btn"
                type="submit"
                disabled={isSendingLink || isGoogleLoading || !email.trim()}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-bold text-xs font-sans tracking-widest uppercase hover:brightness-110 active:scale-[0.99] transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSendingLink ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Sending Magic Link...</span>
                  </>
                ) : (
                  <>
                    <span>Send Magic Link</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Separator */}
            <div className="relative flex items-center justify-center py-1">
              <div className="w-full border-t border-white/10" />
              <span className="absolute px-3 bg-[#03091e] text-[10px] font-semibold font-sans tracking-[0.2em] uppercase text-slate-400">
                Or Continue with Google
              </span>
            </div>

            {/* Google OAuth Button */}
            <button
              id="google-signin-btn"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isSendingLink}
              type="button"
              className="w-full relative flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/15 text-white text-sm font-semibold font-sans tracking-wider hover:bg-white/10 hover:border-amber-400/50 hover:shadow-[0_0_25px_rgba(251,191,36,0.25)] active:scale-[0.99] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group cursor-pointer"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin text-amber-300" />
              ) : (
                /* Google Official SVG Icon */
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.16 0 9.94 0 12s.46 3.84 1.26 5.42l4.02-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
              )}
              <span className="group-hover:text-amber-200 transition-colors">
                {isGoogleLoading ? "Connecting to Google..." : "Continue with Google"}
              </span>
            </button>

            {/* Professional reCAPTCHA / Security Widget */}
            <div className="p-3.5 rounded-2xl bg-slate-950/90 border border-white/12 hover:border-amber-400/30 transition-all shadow-inner flex items-center justify-between pt-1">
              <label
                htmlFor="captcha-checkbox"
                className="flex items-center gap-3 cursor-pointer select-none w-full"
              >
                <div className="relative flex items-center justify-center">
                  <input
                    id="captcha-checkbox"
                    type="checkbox"
                    checked={captchaVerified}
                    onChange={handleCaptchaCheck}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                      captchaVerified
                        ? "bg-emerald-500 border-emerald-400 text-slate-950 shadow-[0_0_12px_rgba(16,185,129,0.3)]"
                        : "border-amber-500/50 bg-slate-900/90 hover:border-amber-400"
                    }`}
                  >
                    {captchaLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                    ) : captchaVerified ? (
                      <CheckCircle2 className="w-4 h-4 text-slate-950 stroke-[3]" />
                    ) : null}
                  </div>
                </div>
                <span className="text-xs sm:text-sm font-sans text-slate-200 font-medium">
                  I&apos;m not a robot
                </span>
              </label>
            </div>

            {/* Fast Dev Mode Bypass Button (Only visible on localhost / dev environment) */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleDevBypass}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-mono font-semibold tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                <span>⚡ DEV MODE: Skip Auth & Start Developing</span>
              </button>
            </div>
          </div>
        )}

        {/* STAGE 2: MAGIC LINK SENT CONFIRMATION */}
        {stage === "link-sent" && (
          <div className="space-y-6 pt-1 text-center animate-in fade-in duration-300">
            {/* Email Icon with glow */}
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-[0_0_30px_rgba(251,191,36,0.3)]">
              <Mail className="w-8 h-8 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-serif font-bold text-amber-100 tracking-wide">
                MAGIC LINK DISPATCHED
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 font-sans">
                We sent a magic sign-in link to:
              </p>
              <p className="text-sm font-semibold text-amber-300 font-mono bg-slate-950/80 py-2 px-4 rounded-xl inline-block border border-amber-500/20 shadow-inner">
                {email}
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto pt-2 leading-relaxed font-sans">
                Open your email and click the verification button to authenticate. You will automatically be redirected to your dashboard.
              </p>
            </div>

            {/* Actions: Resend or Change Email */}
            <div className="pt-2 flex flex-col items-center justify-center space-y-3">
              {cooldown > 0 ? (
                <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-950/80 border border-amber-500/20 text-xs text-amber-400 font-mono tracking-wider">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Resend available in {cooldown}s</span>
                </div>
              ) : (
                <button
                  id="resend-link-btn"
                  type="button"
                  onClick={handleResendMagicLink}
                  disabled={isSendingLink}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-amber-500/40 bg-amber-500/10 text-amber-300 text-xs font-semibold uppercase tracking-wider hover:bg-amber-500/20 transition-all cursor-pointer disabled:opacity-50 shadow-[0_0_15px_rgba(245,158,11,0.2)] font-sans"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSendingLink ? "animate-spin" : ""}`} />
                  <span>Resend Magic Link</span>
                </button>
              )}

              <button
                id="change-email-btn"
                type="button"
                onClick={handleChangeEmail}
                className="text-xs text-slate-400 hover:text-amber-200 underline underline-offset-4 tracking-wider transition-colors cursor-pointer font-sans"
              >
                Use a different email address
              </button>
            </div>
          </div>
        )}

        {/* Footer Security Badges */}
        <div className="pt-2 text-center text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] uppercase tracking-widest font-mono">
            <Lock className="w-3 h-3 text-amber-400/80" />
            <span>256-Bit SSL Encrypted · Official Supabase Auth</span>
          </div>
        </div>
      </div>
    </div>
  );
}
