'use client';

// /home/yatta/apps/frontend/components/layout/MobileNavWrapper.tsx
import { useAuth } from '@/contexts/AuthContext';
import MobileBottomNav from '@/components/layout/MobileBottomNav';
import { HelinChatRoot } from '@/components/helin/HelinChatRoot';

export default function MobileNavWrapper() {
  const { user } = useAuth();
  
  // KRİTİK: Sadece role === 'member' iken görünür, isAuthenticated fallback YOK
  const isMember = user?.role === 'member';

  // Şimdilik unreadCount kaynağı yoksa 0 bırak
  const unreadCount = 0;

  if (!isMember) return null;

  return (
    <>
      <HelinChatRoot hideOnMobile={isMember} />
      <MobileBottomNav unreadCount={unreadCount} />
    </>
  );
}

