'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { User as SupabaseUser } from '@supabase/supabase-js';
import type { Profile } from '@/types/database';

interface User {
  id: string;
  username: string;
  email: string;
  avatar_url?: string | null;
  bio?: string | null;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (username: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    // Get initial session
    const getSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log('AuthContext: Session check', { hasSession: !!session, hasUser: !!session?.user, error });
        if (session?.user) {
          console.log('AuthContext: Loading user profile for', session.user.id);
          await loadUserProfile(session.user);
        } else {
          console.log('AuthContext: No session found');
        }
      } catch (error) {
        console.error('Error getting session:', error);
      } finally {
        setLoading(false);
      }
    };

    getSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          await loadUserProfile(session.user);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      // Fetch profile from database
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      // If profile doesn't exist, create it
      if (error && error.code === 'PGRST116') {
        // Profile doesn't exist, create it
        const username = supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'user';
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            username: username,
          });

        if (insertError) {
          console.error('Error creating profile:', insertError);
        }

        // Set user even if profile creation fails
        const userData: User = {
          id: supabaseUser.id,
          username: username,
          email: supabaseUser.email || '',
          avatar_url: null,
          bio: null,
        };
        setUser(userData);
        return;
      }

      if (error) {
        console.error('Error loading profile:', error);
        // Still set user with basic info even if profile load fails
        const userData: User = {
          id: supabaseUser.id,
          username: supabaseUser.email?.split('@')[0] || 'user',
          email: supabaseUser.email || '',
          avatar_url: null,
          bio: null,
        };
        setUser(userData);
        return;
      }

      const userData: User = {
        id: supabaseUser.id,
        username: profile?.username || supabaseUser.email?.split('@')[0] || 'user',
        email: supabaseUser.email || '',
        avatar_url: profile?.avatar_url || null,
        bio: profile?.bio || null,
      };

      console.log('AuthContext: User profile loaded', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // Set user with basic info even on error
      const userData: User = {
        id: supabaseUser.id,
        username: supabaseUser.email?.split('@')[0] || 'user',
        email: supabaseUser.email || '',
        avatar_url: null,
        bio: null,
      };
      console.log('AuthContext: Setting user with basic info', userData);
      setUser(userData);
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        await loadUserProfile(data.user);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            username: username,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      // Profile will be created automatically by the database trigger
      // But we can also ensure it exists here
      if (data.user) {
        // Wait a bit for the trigger to create the profile
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check if profile exists, if not create it
        const { data: existingProfile } = await supabase
          .from('profiles')
          .select('id')
          .eq('id', data.user.id)
          .single();

        if (!existingProfile) {
          // Profile doesn't exist, create it
          const { error: profileError } = await supabase
            .from('profiles')
            .insert({
              id: data.user.id,
              username: username,
            });

          if (profileError) {
            console.error('Error creating profile:', profileError);
            // Don't fail signup if profile creation fails - user can still use the app
          }
        } else {
          // Profile exists, just update username if needed
          const { error: updateError } = await supabase
            .from('profiles')
            .update({ username: username })
            .eq('id', data.user.id);

          if (updateError) {
            console.error('Error updating profile:', updateError);
          }
        }

        await loadUserProfile(data.user);
      }

      return { success: true };
    } catch (error) {
      console.error('Sign up error:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    signIn,
    signUp,
    signOut,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
