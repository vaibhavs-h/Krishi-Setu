"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/utils/supabase/client";

export interface User {
  id?: string;
  username: string;
  email?: string;
  name: string;
  state: string;
  district: string;
  landArea: string;
  income: string;
  crops: string[];
  age?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: { username: string; password?: string }) => Promise<void>;
  register: (userData: User, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  deleteProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // Helper to construct proxy email
  const getEmail = (username: string) => `${username.toLowerCase().replace(/\s+/g, '')}@agriscroll.net`;

  const fetchProfileAndSetUser = async (sessionUser: any, retryCount = 0) => {
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();

      if (profile && !profileError) {
        setUser({
          id: sessionUser.id,
          email: sessionUser.email || "",
          username: profile.username || sessionUser.user_metadata?.username || "",
          name: profile.name || sessionUser.user_metadata?.name || "",
          state: profile.location?.split(',')[1]?.trim() || "",
          district: profile.location?.split(',')[0]?.trim() || "",
          landArea: profile.land_area?.toString() || "",
          income: profile.income?.toString() || "",
          crops: Array.isArray(profile.crops) ? profile.crops : [],
        });
      } else if (retryCount < 3) {
        // If profile not found, it might be a race condition with the DB trigger
        // Wait 1 second and try again
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchProfileAndSetUser(sessionUser, retryCount + 1);
      } else {
        // Session exists but profile is missing after retries (e.g. user deleted from DB)
        // Force sign out to clear the stale session from the browser
        await supabase.auth.signOut();
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setUser(null);
    }
  };

  const refreshProfile = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      await fetchProfileAndSetUser(session.user);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          if (!sessionStorage.getItem('tab_session')) {
            // If the tab doesn't have a session flag (e.g. newly opened tab), forcefully log out
            await supabase.auth.signOut();
            setUser(null);
          } else {
            await fetchProfileAndSetUser(session.user);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') && session?.user) {
        sessionStorage.setItem('tab_session', 'active');
        await fetchProfileAndSetUser(session.user);
      } else if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('tab_session');
        setUser(null);
      }
      // Note: we don't necessarily set isLoading to false here to avoid conflicting with initializeAuth
      // unless it's a transition that requires it. SIGNED_IN/OUT usually happens after init.
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async ({ username, password }: { username: string; password?: string }) => {
    if (!username || !password) throw new Error("Username and password required");

    const email = getEmail(username);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    sessionStorage.setItem('tab_session', 'active');
  };

  const register = async (userData: User, password?: string) => {
    if (!userData.username || !password) throw new Error("Username and password required");

    const email = getEmail(userData.username);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: userData.username,
          name: userData.name,
          district: userData.district,
          state: userData.state,
          landArea: userData.landArea,
          income: userData.income,
          crops: userData.crops,
          age: userData.age,
        },
      },
    });

    if (authError) throw authError;

    sessionStorage.setItem('tab_session', 'active');

    // Manual profile insert removed! Handled by database trigger 'on_auth_user_created'
  };

  const logout = async () => {
    sessionStorage.removeItem('tab_session');
    await supabase.auth.signOut();
    setUser(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('skipIntro', 'true');
    }
    router.refresh(); // Clear server component cache
    router.replace("/"); // Use replace to prevent back navigation
  };

  const deleteProfile = async () => {
    // Calling the custom RPC function to delete the auth.users record
    const { error } = await supabase.rpc('delete_user');
    if (error) throw error;
    // Log out locally and clean up
    sessionStorage.removeItem('tab_session');
    setUser(null);
    if (typeof window !== 'undefined') {
      window.sessionStorage.setItem('skipIntro', 'true');
    }
    router.refresh();
    router.replace("/");
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, refreshProfile, deleteProfile }}>
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
