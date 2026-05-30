import React, { createContext, useState, useContext, useEffect, useRef, ReactNode } from "react";
import { Session, User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "./supabase";

export type User = {
  id: string;
  email: string;
  mobile?: string;
  username?: string;
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (identifier: string, password: string) => Promise<void>;
  register: (email: string, mobile: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const ignoreSessionChange = useRef(false);

  useEffect(() => {
    // Load session on startup
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && !ignoreSessionChange.current) {
        mapSupabaseUser(session.user);
      }
      setLoading(false);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (ignoreSessionChange.current) {
        return;
      }
      if (session?.user) {
        mapSupabaseUser(session.user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const mapSupabaseUser = (supabaseUser: SupabaseUser) => {
    setUser({
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      mobile: supabaseUser.user_metadata?.mobile,
      username: supabaseUser.user_metadata?.username,
    });
  };

  const login = async (email: string, password: string) => {
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      throw new Error(signInError.message);
    }
  };

  const register = async (email: string, mobile: string, password: string) => {
    try {
      ignoreSessionChange.current = true;
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            mobile,
          },
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      // Supabase's signUp automatically creates a session if email confirmation is disabled.
      // We immediately sign out to prevent auto-logging in the user upon registration.
      await supabase.auth.signOut();
    } finally {
      // Delay resetting the ignore flag to allow auth events to settle
      setTimeout(() => {
        ignoreSessionChange.current = false;
      }, 800);
    }
  };

  const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Logout error", error);
    } else {
      setUser(null);
    }
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "researchmateai://reset-password",
    });
    if (error) {
      throw new Error(error.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
