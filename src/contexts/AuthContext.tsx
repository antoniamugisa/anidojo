'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<boolean>;
  signUp: (username: string, email: string, password: string) => Promise<boolean>;
  signOut: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in (check localStorage or make API call)
    const savedUser = localStorage.getItem('anidojo_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, _password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        username: email.split('@')[0],
        email: email
      };
      
      setUser(mockUser);
      localStorage.setItem('anidojo_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Sign in error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (username: string, email: string, _password: string): Promise<boolean> => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      const mockUser: User = {
        id: '1',
        username: username,
        email: email
      };
      
      setUser(mockUser);
      localStorage.setItem('anidojo_user', JSON.stringify(mockUser));
      return true;
    } catch (error) {
      console.error('Sign up error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem('anidojo_user');
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
