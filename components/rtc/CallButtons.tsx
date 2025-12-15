"use client";

import { Phone, Video } from "lucide-react";

interface CallButtonsProps {
  conversationId: number;
  onAudioCall: () => void;
  onVideoCall: () => void;
  disabled?: boolean;
}

export default function CallButtons({
  conversationId,
  onAudioCall,
  onVideoCall,
  disabled = false,
}: CallButtonsProps) {
  if (!conversationId) return null;

  return (
    <div className="flex items-center gap-2">
      {/* Audio Call Button */}
      <button
        onClick={(e) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CallButtons.tsx:onClick:audio',message:'Audio call button clicked',data:{conversationId: conversationId, disabled: disabled},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'1'})}).catch(()=>{});
          // #endregion
          console.log('[CALL] Audio button clicked', { conversationId, disabled });
          onAudioCall();
        }}
        disabled={disabled}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Sesli arama başlat"
        title="Sesli Arama"
      >
        <Phone className="h-5 w-5 text-slate-600" />
      </button>

      {/* Video Call Button */}
      <button
        onClick={(e) => {
          // #region agent log
          fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'CallButtons.tsx:onClick:video',message:'Video call button clicked',data:{conversationId: conversationId, disabled: disabled},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'1'})}).catch(()=>{});
          // #endregion
          console.log('[CALL] Video button clicked', { conversationId, disabled });
          onVideoCall();
        }}
        disabled={disabled}
        className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        aria-label="Video arama başlat"
        title="Video Arama"
      >
        <Video className="h-5 w-5 text-slate-600" />
      </button>
    </div>
  );
}




