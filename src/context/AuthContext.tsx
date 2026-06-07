'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: string;
}

interface AuthContextType {
  user: UserSession | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  setMockUser: (user: UserSession | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Validate session on mount
  useEffect(() => {
    async function checkSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = await res.json();
          if (data.user) {
            setUser(data.user);
          }
        } else {
          // Check localStorage as fallback for demo offline mode
          const localUser = localStorage.getItem('careermate_user');
          if (localUser) {
            setUser(JSON.parse(localUser));
          }
        }
      } catch (err) {
        console.warn('Session check failed, trying LocalStorage fallback');
        const localUser = localStorage.getItem('careermate_user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
      } finally {
        setLoading(false);
      }
    }
    checkSession();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch('/api/api-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('careermate_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Invalid credentials' };
      }
    } catch (err) {
      // Mock Login Fallback (Ensure the application is robustly mockable if DB is not setup)
      console.warn('API error, executing Mock Login fallback');
      if (email && password) {
        const mockUser: UserSession = {
          userId: 'mock-user-id-john-doe',
          email: email,
          name: email.split('@')[0].toUpperCase(),
          role: email.includes('admin') ? 'ADMIN' : 'USER',
        };
        setUser(mockUser);
        localStorage.setItem('careermate_user', JSON.stringify(mockUser));
        
        // Write mock token cookie manually for middleware compatibility
        document.cookie = `token=mock-jwt-token-value; path=/; max-age=${7 * 24 * 60 * 60}`;
        return { success: true };
      }
      return { success: false, error: 'Network error occurred.' };
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch('/api/api-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'register', name, email, password }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUser(data.user);
        localStorage.setItem('careermate_user', JSON.stringify(data.user));
        return { success: true };
      } else {
        return { success: false, error: data.error || 'Registration failed' };
      }
    } catch (err) {
      // Mock Register Fallback
      console.warn('API error, executing Mock Signup fallback');
      const mockUser: UserSession = {
        userId: 'mock-user-id-' + Math.random().toString(36).substring(2, 9),
        email: email,
        name: name,
        role: email.includes('admin') ? 'ADMIN' : 'USER',
      };
      setUser(mockUser);
      localStorage.setItem('careermate_user', JSON.stringify(mockUser));
      document.cookie = `token=mock-jwt-token-value; path=/; max-age=${7 * 24 * 60 * 60}`;
      return { success: true };
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/api-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout' }),
      });
    } catch (err) {
      console.warn('API logout failed, clearing local session');
    } finally {
      setUser(null);
      localStorage.removeItem('careermate_user');
      // Clear token cookie
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
      router.push('/login');
    }
  };

  const setMockUser = (mockUser: UserSession | null) => {
    setUser(mockUser);
    if (mockUser) {
      localStorage.setItem('careermate_user', JSON.stringify(mockUser));
      document.cookie = `token=mock-jwt-token-value; path=/; max-age=${7 * 24 * 60 * 60}`;
    } else {
      localStorage.removeItem('careermate_user');
      document.cookie = 'token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, setMockUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
