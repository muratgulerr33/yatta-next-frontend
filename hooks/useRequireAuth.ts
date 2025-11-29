'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

/**
 * Hook that redirects to login if user is not authenticated
 * @param redirectTo Optional path to redirect back after login
 */
export function useRequireAuth(redirectTo?: string) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;
    
    if (!isAuthenticated) {
      const redirectPath = redirectTo || pathname;
      router.push(`/login?next=${encodeURIComponent(redirectPath)}`);
    }
  }, [isAuthenticated, isLoading, router, pathname, redirectTo]);

  return { isAuthenticated, isLoading };
}

