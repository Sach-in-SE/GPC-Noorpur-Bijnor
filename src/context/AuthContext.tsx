
import React, { createContext, useContext, useState, useEffect } from "react";
import { Session, User } from "@supabase/supabase-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

// Define user types - removing teacher and student roles
export type UserRole = "admin" | null;

export interface UserProfile {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
  contact_number?: string;
}

// Define context types
interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isLoading: boolean;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch user profile from Supabase
  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }

      if (data) {
        return data as UserProfile;
      }

      return null;
    } catch (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const profileData = await fetchUserProfile(user.id);
      if (profileData) {
        setProfile(profileData);
      }
    }
  };

  // Check if user is already logged in when component mounts
  useEffect(() => {
    // First set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        setSession(currentSession);
        const currentUser = currentSession?.user || null;
        setUser(currentUser);

        if (currentUser) {
          // Defer Supabase calls with setTimeout
          setTimeout(async () => {
            const profileData = await fetchUserProfile(currentUser.id);
            
            // If user is not an admin, log them out
            if (profileData && profileData.role !== "admin") {
              await supabase.auth.signOut();
              setUser(null);
              setProfile(null);
              setSession(null);
              toast({
                variant: "destructive",
                title: "Access denied",
                description: "Only administrators can access this portal.",
              });
            } else {
              setProfile(profileData);
            }
            setIsLoading(false);
          }, 0);
        } else {
          setProfile(null);
          setIsLoading(false);
        }
      }
    );

    // Then check for existing session
    const initializeAuth = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
      
      if (currentSession?.user) {
        setUser(currentSession.user);
        const profileData = await fetchUserProfile(currentSession.user.id);
        
        // If user is not an admin, log them out
        if (profileData && profileData.role !== "admin") {
          await supabase.auth.signOut();
          setUser(null);
          setProfile(null);
          setSession(null);
          toast({
            variant: "destructive",
            title: "Access denied",
            description: "Only administrators can access this portal.",
          });
        } else {
          setProfile(profileData);
        }
      }
      
      setIsLoading(false);
    };

    initializeAuth();
    
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Update last_login timestamp whenever the user logs in
  useEffect(() => {
    if (user && profile) {
      try {
        supabase
          .from("profiles")
          .update({ last_login: new Date().toISOString() })
          .eq("id", user.id)
          .then(({ error }) => {
            if (error) console.error("Error updating last login:", error);
          });
      } catch (error) {
        console.error("Error updating last login:", error);
      }
    }
  }, [user, profile]);

  // Login function - only for admin
  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Login error:", error);
        toast({
          variant: "destructive",
          title: "Login failed",
          description: error.message || "Invalid credentials. Please check your email and password.",
        });
        setIsLoading(false);
        return false;
      }

      if (data.user) {
        // Fetch user profile to check role
        const profileData = await fetchUserProfile(data.user.id);
        
        if (!profileData) {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "User profile not found.",
          });
          await supabase.auth.signOut();
          setIsLoading(false);
          return false;
        }

        // Check if role is admin
        if (profileData.role !== "admin") {
          toast({
            variant: "destructive",
            title: "Login failed",
            description: "Only administrators can access this portal.",
          });
          await supabase.auth.signOut();
          setIsLoading(false);
          return false;
        }

        setProfile(profileData);
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: "Login error",
        description: "An unexpected error occurred. Please try again.",
      });
      setIsLoading(false);
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      navigate("/login");
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        variant: "destructive",
        title: "Logout error",
        description: "An error occurred while logging out.",
      });
    }
  };

  const value = {
    user,
    profile,
    session,
    login,
    logout,
    isAuthenticated: !!user,
    isLoading,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
