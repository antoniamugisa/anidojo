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
    // Set user immediately with basic info from auth, then enhance with profile data
    const basicUserData: User = {
      id: supabaseUser.id,
      username: supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'user',
      email: supabaseUser.email || '',
      avatar_url: null,
      bio: null,
    };
    setUser(basicUserData);

    try {
      // Fetch profile from database with timeout
      const profilePromise = supabase
        .from('profiles')
        .select('username, avatar_url, bio')
        .eq('id', supabaseUser.id)
        .single();

      const timeoutPromise = new Promise((resolve) => 
        setTimeout(() => resolve({ data: null, error: { code: 'TIMEOUT', message: 'Profile fetch timeout' } }), 3000)
      );

      const { data: profile, error } = await Promise.race([
        profilePromise,
        timeoutPromise
      ]) as any;

      // Handle timeout - just use basic user data, profile will load later if needed
      if (error && error.code === 'TIMEOUT') {
        console.warn('Profile fetch timed out, using basic user info');
        // User already set with basic info, just return
        return;
      }

      // If profile doesn't exist, create it (but don't wait)
      if (error && error.code === 'PGRST116') {
        const username = supabaseUser.user_metadata?.username || supabaseUser.email?.split('@')[0] || 'user';
        // Create profile in background, don't wait for it
        supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            username: username,
          })
          .then(() => {
            // Update user once profile is created
            setUser({
              ...basicUserData,
              username: username,
            });
          })
          .catch((insertError) => {
            console.error('Error creating profile:', insertError);
          });
        return;
      }

      if (error) {
        console.error('Error loading profile:', error);
        // User already set with basic info, just return
        return;
      }

      // Update user with profile data
      const userData: User = {
        id: supabaseUser.id,
        username: profile?.username || basicUserData.username,
        email: supabaseUser.email || '',
        avatar_url: profile?.avatar_url || null,
        bio: profile?.bio || null,
      };

      console.log('AuthContext: User profile loaded', userData);
      setUser(userData);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // User already set with basic info, no need to set again
    }
  };

  const signIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setLoading(true);
      const startTime = Date.now();
      console.log('SignIn: Starting authentication...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      console.log(`SignIn: Auth completed in ${Date.now() - startTime}ms`, { hasUser: !!data?.user, error });

      if (error) {
        setLoading(false);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Set user immediately with basic info, then load profile in background
        const basicUserData: User = {
          id: data.user.id,
          username: data.user.user_metadata?.username || data.user.email?.split('@')[0] || 'user',
          email: data.user.email || '',
          avatar_url: null,
          bio: null,
        };
        setUser(basicUserData);
        setLoading(false); // Set loading to false immediately after auth succeeds
        
        // Load profile in background - don't block sign-in
        loadUserProfile(data.user).catch(err => {
          console.error('Error loading profile after sign-in:', err);
        });
        
        console.log(`SignIn: Completed in ${Date.now() - startTime}ms`);
        return { success: true };
      }

      setLoading(false);
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      setLoading(false);
      return { success: false, error: 'An unexpected error occurred' };
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
