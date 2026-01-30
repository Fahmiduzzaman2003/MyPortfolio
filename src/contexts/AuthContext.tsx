import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi, twoFactorApi } from '@/lib/api';

interface User {
  id: string | number;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null; requiresTwoFactor?: boolean }>;
  signInWith2FA: (email: string, twoFactorCode: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing user data on load
    const userData = localStorage.getItem('user_data');
    if (userData) {
      try {
        const user = JSON.parse(userData);
        setUser(user);
      } catch {
        localStorage.removeItem('user_data');
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const response = await authApi.login(email, password);
      
      if (response.requiresTwoFactor) {
        // Don't set user yet, wait for 2FA verification
        return { error: null, requiresTwoFactor: true };
      }
      
      if (response.user) {
        localStorage.setItem('user_data', JSON.stringify(response.user));
        setUser(response.user);
      }
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signInWith2FA = async (email: string, twoFactorCode: string) => {
    try {
      const { user } = await authApi.loginWith2FA(email, twoFactorCode);
      localStorage.setItem('user_data', JSON.stringify(user));
      setUser(user);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors
    }
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin, signIn, signInWith2FA, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
