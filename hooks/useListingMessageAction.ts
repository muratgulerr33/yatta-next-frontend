"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { startOrGetConversation } from "@/lib/api/chat";

export function useListingMessageAction(ownerId?: number | null) {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const handleMessageClick = useCallback(async () => {
    if (!ownerId) {
      console.error("Listing owner id not found");
      return;
    }

    if (!isAuthenticated) {
      router.push("/login?next=" + encodeURIComponent(window.location.pathname));
      return;
    }

    try {
      const conversation = await startOrGetConversation(ownerId);
      router.push(`/profil/mesajlar?conversation=${conversation.id}`);
    } catch (error) {
      console.error("Failed to start or get conversation", error);
      alert(error instanceof Error ? error.message : "Mesajlaşma başlatılamadı. Lütfen tekrar deneyin.");
    }
  }, [ownerId, isAuthenticated, router]);

  return { handleMessageClick };
}
