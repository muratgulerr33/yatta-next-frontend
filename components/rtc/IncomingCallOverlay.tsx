"use client";

import { Phone, PhoneOff } from "lucide-react";

interface IncomingCallOverlayProps {
  incomingCall: {
    conversation_id: number;
    call_id: string;
    call_type: "audio" | "video";
    from_user: {
      id: number;
      email: string;
      username: string;
    };
  };
  onAccept: () => void;
  onReject: () => void;
}

export default function IncomingCallOverlay({
  incomingCall,
  onAccept,
  onReject,
}: IncomingCallOverlayProps) {
  const { from_user, call_type } = incomingCall;
  const userName = from_user.username || from_user.email || "Bilinmeyen";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full mx-4">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4">
            {userName.charAt(0).toUpperCase()}
          </div>
          <h3 className="text-xl font-semibold text-slate-900 mb-1">{userName}</h3>
          <p className="text-sm text-slate-500">
            {call_type === "video" ? "Video araması" : "Sesli arama"}
          </p>
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={onReject}
            className="p-4 rounded-full bg-red-600 hover:bg-red-700 text-white transition-colors shadow-lg"
            aria-label="Reddet"
          >
            <PhoneOff className="w-6 h-6" />
          </button>

          <button
            onClick={onAccept}
            className="p-4 rounded-full bg-green-600 hover:bg-green-700 text-white transition-colors shadow-lg"
            aria-label="Kabul Et"
          >
            <Phone className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
}




