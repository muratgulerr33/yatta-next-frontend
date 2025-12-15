'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getMe, apiLogout, type AuthResponse } from '@/lib/api/auth';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string | null;
  groups: string[];
  phone: string;
  city: string;
  district: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const result = await getMe();
      if (result && result.success && result.user) {
        // User interface'ine uygun hale getir
        setUser({
          ...result.user,
          first_name: result.user.first_name || '',
          last_name: result.user.last_name || '',
          phone: result.user.phone || '',
          city: result.user.city || '',
          district: result.user.district || '',
        });
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = useCallback((userData: User) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiLogout(); // Backend'e logout isteği gönder
    } catch (error) {
      // Backend logout başarısız olsa bile local temizliği yapmaya devam et
      console.error('logout error', error);
    }

    // HttpOnly olmayan yardımcı cookie'ler varsa temizle
    document.cookie = 'yatta_access=; Max-Age=0; path=/';
    document.cookie = 'yatta_refresh=; Max-Age=0; path=/';

    // Auth state'i sıfırla
    setUser(null);

    // Ana sayfaya yönlendir
    router.push('/');
  }, [router]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        refreshUser,
      }}
    >
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

