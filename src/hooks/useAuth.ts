"use client";

import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session, AuthError } from "@supabase/supabase-js";
import {
  signInWithGoogle as clientSignInWithGoogle,
  signInWithEmailOtp as clientSignInWithEmailOtp,
  verifyEmailOtp as clientVerifyEmailOtp,
  signOutUser,
} from "@/lib/auth/client";

interface UseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInAsDevUser: () => void;
  signInWithGoogle: (redirectTo?: string) => Promise<{ error: AuthError | null }>;
  signInWithEmailOtp: (email: string, redirectTo?: string) => Promise<{ error: AuthError | null }>;
  verifyEmailOtp: (
    email: string,
    token: string
  ) => Promise<{ session: Session | null; user: User | null; error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
}

/**
 * React hook providing Supabase Auth state and authentication actions.
 * Exclusively supports Google OAuth and Passwordless Email OTP.
 * Tokens are managed automatically by Supabase and synchronized with SSR cookies.
 */
export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    const stored = localStorage.getItem("innovision_dev_user");
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(() => {
    if (typeof window !== "undefined" && localStorage.getItem("innovision_dev_user")) {
      return false;
    }
    return true;
  });

  // Safety fallback: Ensure loading never hangs indefinitely
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    let authListener: { unsubscribe: () => void } | null = null;

    async function initAuth() {
      // If dev user is stored in localStorage, use it immediately
      const storedDev = typeof window !== "undefined" ? localStorage.getItem("innovision_dev_user") : null;
      if (storedDev) {
        try {
          const parsed = JSON.parse(storedDev);
          if (mounted) {
            setUser(parsed);
            setLoading(false);
            return;
          }
        } catch {
          // fallback
        }
      }

      try {
        const supabase = createClient();

        // Retrieve initial session
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (mounted) {
          setSession(session);
          setUser(session?.user ?? null);
          setLoading(false);
        }

        // Listen for auth state changes (sign in, sign out, token refresh)
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
          if (mounted && !localStorage.getItem("innovision_dev_user")) {
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
          }
        });

        authListener = subscription;
      } catch (err) {
        console.warn("Supabase auth client not yet configured:", err);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void initAuth();

    return () => {
      mounted = false;
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  /**
   * Fast frontend development sign in bypass.
   */
  const signInAsDevUser = useCallback(() => {
    const mock: User = {
      id: "dev-user-001",
      email: "dev@innovision2026.com",
      app_metadata: { provider: "email" },
      user_metadata: { full_name: "Frontend Developer", avatar_url: "" },
      aud: "authenticated",
      created_at: new Date().toISOString(),
      role: "authenticated",
      updated_at: new Date().toISOString(),
    } as unknown as User;

    localStorage.setItem("innovision_dev_user", JSON.stringify(mock));
    setUser(mock);
    setLoading(false);
  }, []);

  /**
   * Initiates Google OAuth flow.
   * Redirects user to Google sign-in and returns to /auth/callback.
   */
  const signInWithGoogle = useCallback(
    async (redirectTo?: string): Promise<{ error: AuthError | null }> => {
      return await clientSignInWithGoogle(redirectTo);
    },
    []
  );

  /**
   * Initiates passwordless email login (sends 6-digit OTP code or magic link).
   */
  const signInWithEmailOtp = useCallback(
    async (email: string, redirectTo?: string): Promise<{ error: AuthError | null }> => {
      return await clientSignInWithEmailOtp(email, redirectTo);
    },
    []
  );

  /**
   * Verifies the 6-digit OTP token received by the user via email.
   */
  const verifyEmailOtp = useCallback(
    async (
      email: string,
      token: string
    ): Promise<{ session: Session | null; user: User | null; error: AuthError | null }> => {
      const { session: newSession, user: newUser, error } = await clientVerifyEmailOtp(email, token);

      if (!error && newSession) {
        setSession(newSession);
        setUser(newUser);
      }

      return { session: newSession, user: newUser, error };
    },
    []
  );

  /**
   * Signs out the user and clears session tokens.
   */
  const signOut = useCallback(async (): Promise<{ error: AuthError | null }> => {
    localStorage.removeItem("innovision_dev_user");
    const { error } = await signOutUser();
    setUser(null);
    setSession(null);
    return { error };
  }, []);

  return {
    user,
    session,
    loading,
    signInAsDevUser,
    signInWithGoogle,
    signInWithEmailOtp,
    verifyEmailOtp,
    signOut,
  };
}

