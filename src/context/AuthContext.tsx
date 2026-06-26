"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { User, Session } from "@supabase/supabase-js";

interface DbUser {
  id: string;
  email: string;
  name: string;
  phone: string | null;
  avatar: string | null;
  tier: string;
  memberNo: string;
  joinedDate: string;
  role: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  dbUser: DbUser | null;
  session: Session | null;
  isAdmin: boolean;
  isLoading: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [dbUser, setDbUser] = useState<DbUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async (token?: string) => {
    try {
      const headers: Record<string, string> = {};
      if (token) {
        headers["Authorization"] = `Bearer ${token}`;
      }
      const res = await fetch("/api/auth/me", {
        headers,
        cache: "no-store"
      });
      if (res.ok) {
        const data = await res.json();
        if (data && data.user) {
          setDbUser(data.user);
          localStorage.setItem("kwest_user", JSON.stringify(data.user));
          if (data.user.role === "admin") {
            sessionStorage.setItem("kwest_admin", "authenticated");
          } else {
            sessionStorage.removeItem("kwest_admin");
          }
          return;
        } else {
          // Explicitly signed out or invalid session from server
          setDbUser(null);
          localStorage.removeItem("kwest_user");
          sessionStorage.removeItem("kwest_admin");
        }
      } else if (res.status === 401 || res.status === 403) {
        // Explicitly unauthorized/expired session
        setDbUser(null);
        localStorage.removeItem("kwest_user");
        sessionStorage.removeItem("kwest_admin");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      // Ignore network exceptions to preserve local session resilience during transient downtime
    }
  };

  useEffect(() => {
    // 1. Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchMe(session.access_token).finally(() => setIsLoading(false));
      } else {
        setDbUser(null);
        localStorage.removeItem("kwest_user");
        sessionStorage.removeItem("kwest_admin");
        setIsLoading(false);
      }
    });

    // 2. Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        setIsLoading(true);
        await fetchMe(newSession.access_token);
        setIsLoading(false);
      } else {
        setDbUser(null);
        localStorage.removeItem("kwest_user");
        sessionStorage.removeItem("kwest_admin");
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    try {
      await fetch("/api/auth/signout", { method: "POST" });
    } catch (err) {
      console.error("Error calling signout API:", err);
    }
    setSession(null);
    setUser(null);
    setDbUser(null);
    localStorage.removeItem("kwest_user");
    sessionStorage.removeItem("kwest_admin");
    setIsLoading(false);
  };

  const refreshUser = async () => {
    const currentSession = session || (await supabase.auth.getSession()).data.session;
    await fetchMe(currentSession?.access_token);
  };

  const isAdmin = !!dbUser?.isAdmin || dbUser?.role === "admin" || user?.email === "admin@kwestliquor.co.ke";

  return (
    <AuthContext.Provider value={{ user, dbUser, session, isAdmin, isLoading, signOut, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
