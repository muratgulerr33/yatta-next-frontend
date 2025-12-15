"use client";

import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import { Search, Send, MoreVertical, ChevronLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/lib/hooks/use-toast";
import { 
  getConversations, 
  getMessages, 
  sendMessage, 
  getChatWsUrl,
  getInboxWsUrl,
  type Conversation as ApiConversation,
  type Message as ApiMessage
} from "@/lib/api/chat";
import { getLivekitToken } from "@/lib/api/rtc";
import VideoCallModal from "@/components/rtc/VideoCallModal";
import IncomingCallOverlay from "@/components/rtc/IncomingCallOverlay";
import CallButtons from "@/components/rtc/CallButtons";

interface ProfilMesajlarClientProps {
  initialConversationId?: string;
}

export default function ProfilMesajlarClient({ initialConversationId }: ProfilMesajlarClientProps = {}) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [conversations, setConversations] = useState<ApiConversation[]>([]);
  // initialConversationId'yi başlangıç state'inde kullan
  const [selectedConversationId, setSelectedConversationId] = useState<number | null>(
    initialConversationId ? Number(initialConversationId) : null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [isMobileDetailOpen, setIsMobileDetailOpen] = useState(false);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ApiMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const inboxSocketRef = useRef<WebSocket | null>(null);
  const notificationAudioRef = useRef<HTMLAudioElement | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  // Call state
  const [callStatus, setCallStatus] = useState<'idle' | 'ringing' | 'incoming' | 'connecting' | 'in_call'>('idle');
  
  // Call status değişimlerini logla (acemi dostu debug)
  useEffect(() => {
    console.log('📊 [CALL STATUS] Değişti:', callStatus);
  }, [callStatus]);
  const [activeCall, setActiveCall] = useState<{
    conversationId: number;
    callId: string;
    callType: 'audio' | 'video';
    fromUser?: {
      id: number;
      email: string;
      username: string;
    };
  } | null>(null);
  const [callModalOpen, setCallModalOpen] = useState(false);
  const [callToken, setCallToken] = useState<{
    livekitUrl: string;
    token: string;
    room: string;
  } | null>(null);

  // Backend response'unu her zaman diziye normalize et
  const conversationList: ApiConversation[] = useMemo(() => {
    // Eğer zaten dizi ise
    if (Array.isArray(conversations)) {
      return conversations;
    }
    
    // Eğer paginated response formatında ise ({results: [...]})
    if (conversations && typeof conversations === 'object' && 'results' in conversations) {
      const paginated = conversations as { results: ApiConversation[] };
      return Array.isArray(paginated.results) ? paginated.results : [];
    }
    
    // Diğer tüm durumlarda boş dizi
    return [];
  }, [conversations]);

  // Get other participant from conversation
  const getOtherParticipant = (conv: ApiConversation) => {
    if (!user) return null;
    return conv.participants.find((p) => p.id !== user.id) || conv.participants[0];
  };

  // Filtered conversations
  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversationList;
    return conversationList.filter((conv) => {
      const other = getOtherParticipant(conv);
      const participantName = other?.username || "";
      const lastMessageText = conv.last_message?.text || "";
      return (
        participantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lastMessageText.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [conversationList, searchTerm, user]);

  // Active conversation
  const activeConversation = useMemo(() => {
    if (!selectedConversationId) return null;
    
    // Önce listede ara
    const found = conversationList.find((c) => c.id === selectedConversationId);
    if (found) return found;
    
    // Listedeki conversation bulunamadıysa (0 mesajlı yeni conversation)
    // null döndür ama selectedConversationId korunur
    return null;
  }, [conversationList, selectedConversationId]);

  // Active messages
  const activeMessages = useMemo(() => {
    if (!selectedConversationId) return [];

    // Güvenlik: messages her zaman array olsun
    // Eğer messages bir obje ise (paginated response gibi), boş array dön
    if (!Array.isArray(messages)) {
      console.warn("[ProfilMesajlarClient] messages is not an array:", typeof messages, messages);
      return [];
    }

    const list = messages;

    // Conversation field'ını normalize et (string/number karışıklığını önle)
    const filtered = list.filter((m) => {
      const msgConv = typeof m.conversation === 'string' ? Number(m.conversation) : m.conversation;
      const selectedConv = typeof selectedConversationId === 'string' ? Number(selectedConversationId) : selectedConversationId;
      return msgConv === selectedConv;
    });
    
    // #region agent log
    if (filtered.length !== list.length && list.length > 0) {
      console.log(`[ProfilMesajlarClient] Filtered messages: ${filtered.length} of ${list.length}`, {
        selectedConversationId,
        sampleMessage: list[0],
        filteredSample: filtered[0]
      });
    }
    // #endregion
    
    return filtered;
  }, [selectedConversationId, messages]);

  // Check if message is from current user
  const isMyMessage = (message: ApiMessage): boolean => {
    return message.sender.id === user?.id;
  };

  // initialConversationId değiştiğinde selectedConversationId'yi güncelle
  useEffect(() => {
    if (initialConversationId) {
      const convId = Number(initialConversationId);
      if (!isNaN(convId) && convId > 0) {
        setSelectedConversationId(convId);
        setIsMobileDetailOpen(true);
      }
    }
  }, [initialConversationId]);

  // Load conversations on mount
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoading(true);
        const convs = await getConversations();
        // Ek güvenlik kontrolü
        const safeConvs = Array.isArray(convs) ? convs : [];
        setConversations(safeConvs);

        // Query param yoksa ve selectedConversationId de null ise ilk conversation'ı seç
        if (!initialConversationId && !selectedConversationId && safeConvs.length > 0) {
          setSelectedConversationId(safeConvs[0].id);
        }
      } catch (error) {
        console.error("Failed to load conversations", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadConversations();
  }, []);

  // Refresh conversations list
  const refreshConversations = useCallback(async () => {
    try {
      const convs = await getConversations();
      const safeConvs = Array.isArray(convs) ? convs : [];
      setConversations(safeConvs);
    } catch (error) {
      console.error("Failed to refresh conversations", error);
    }
  }, []);

  // Periyodik olarak conversation listesini refresh et (fallback - inbox WS yoksa)
  // Inbox WS bağlı olduğunda polling devre dışı kalır
  useEffect(() => {
    // Inbox WS bağlıysa polling'i başlatma
    if (inboxSocketRef.current?.readyState === WebSocket.OPEN) {
      // #region agent log
      const logDebug = (location: string, message: string, data: any) => {
        fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            location,
            message,
            data,
            timestamp: Date.now(),
            sessionId: 'debug-session',
            runId: 'run1'
          })
        }).catch(() => {});
      };
      logDebug('ProfilMesajlarClient.tsx:polling', 'Polling disabled: inbox WS connected', {});
      // #endregion
      return; // Inbox WS bağlı, polling gerekmez
    }

    // Conversation seçilmemişse veya sayfa görünürse refresh et
    if (!selectedConversationId && user) {
      const interval = setInterval(() => {
        // Sayfa görünürse refresh et
        if (document.visibilityState === 'visible') {
          void refreshConversations();
        }
      }, 5000); // Her 5 saniyede bir

      pollingIntervalRef.current = interval;

      // Sayfa görünür hale geldiğinde de refresh et
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          void refreshConversations();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
          pollingIntervalRef.current = null;
        }
        document.removeEventListener('visibilitychange', handleVisibilityChange);
      };
    }
  }, [selectedConversationId, user, refreshConversations, inboxSocketRef.current?.readyState]);

  // Load messages when conversation changes
  useEffect(() => {
    if (!selectedConversationId) return;

    const loadMessages = async () => {
      try {
        const msgs = await getMessages(selectedConversationId);
        // Ekstra emniyet: getMessages zaten array döndürüyor ama yine de kontrol et
        setMessages(Array.isArray(msgs) ? msgs : []);
      } catch (error) {
        console.error("Failed to load messages", error);
        // Hata durumunda state'i boş array olarak koru
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedConversationId]);

  // Play notification sound using Web Audio API
  const playBeepSound = async () => {
    // #region agent log
    const logDebug = (location: string, message: string, data: any) => {
      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          message,
          data,
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'C'
        })
      }).catch(() => {});
    };
    // #endregion
    
    try {
      // Web Audio API requires user interaction in some browsers (especially incognito)
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // #region agent log
      logDebug('ProfilMesajlarClient.tsx:playBeepSound', 'Web Audio API context created', {
        state: audioContext.state,
        sampleRate: audioContext.sampleRate
      });
      // #endregion
      
      // Resume audio context if suspended (required after user interaction)
      // ÖNEMLİ: resume() await edilmeli, aksi halde ses çalmaz
      if (audioContext.state === 'suspended') {
        // #region agent log
        logDebug('ProfilMesajlarClient.tsx:playBeepSound', 'Audio context suspended, attempting resume', {
          state: audioContext.state
        });
        // #endregion
        try {
          await audioContext.resume();
          // #region agent log
          logDebug('ProfilMesajlarClient.tsx:playBeepSound', 'Audio context resumed successfully', {
            newState: audioContext.state
          });
          // #endregion
          console.log("[Notification] Audio context resumed");
        } catch (error) {
          // #region agent log
          logDebug('ProfilMesajlarClient.tsx:playBeepSound', 'Audio context resume failed', {
            error: String(error),
            state: audioContext.state
          });
          // #endregion
          console.warn("[Notification] Audio context suspended, cannot play sound:", error);
          return;
        }
      }
      
      // Audio context'in running olmasını garanti et
      if (audioContext.state !== 'running') {
        // #region agent log
        logDebug('ProfilMesajlarClient.tsx:playBeepSound', 'Audio context not running, attempting resume', {
          state: audioContext.state
        });
        // #endregion
        try {
          await audioContext.resume();
        } catch (error) {
          // #region agent log
          logDebug('ProfilMesajlarClient.tsx:playBeepSound', 'Audio context resume failed (second attempt)', {
            error: String(error),
            state: audioContext.state
          });
          // #endregion
          console.warn("[Notification] Audio context resume failed:", error);
          return;
        }
      }
      
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.2);
      
      // #region agent log
      logDebug('ProfilMesajlarClient.tsx:playBeepSound', 'Web Audio beep started', {
        frequency: oscillator.frequency.value,
        duration: 0.2,
        contextState: audioContext.state
      });
      // #endregion
      
      console.log("[Notification] Web Audio beep started");
    } catch (error) {
      // #region agent log
      logDebug('ProfilMesajlarClient.tsx:playBeepSound', 'Web Audio API error', {
        error: String(error),
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : 'Unknown'
      });
      // #endregion
      console.warn("[Notification] Web Audio API error:", error);
    }
  };

  const playNotificationSound = useCallback(() => {
    // #region agent log
    const logDebug = (location: string, message: string, data: any) => {
      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          message,
          data,
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          hypothesisId: 'C'
        })
      }).catch(() => {});
    };
    // #endregion
    
    // #region agent log
    logDebug('ProfilMesajlarClient.tsx:playNotificationSound', 'playNotificationSound called', {
      hasAudioRef: !!notificationAudioRef.current,
      audioRefState: notificationAudioRef.current?.readyState,
      userAgent: navigator.userAgent,
      timestamp: Date.now()
    });
    // #endregion
    
    console.log("[Notification] Attempting to play sound...");
    
    // Web Audio API'yi direkt kullan (HTML5 Audio genelde çalışmıyor)
    // Tarayıcılar autoplay policy nedeniyle HTML5 Audio'yu engelliyor
    // ÖNEMLİ: playBeepSound() async, await etmeliyiz
    playBeepSound().then(() => {
      // #region agent log
      logDebug('ProfilMesajlarClient.tsx:playNotificationSound', 'Web Audio API completed successfully', {});
      // #endregion
      console.log("[Notification] Sound playback completed");
    }).catch((error) => {
      // #region agent log
      logDebug('ProfilMesajlarClient.tsx:playNotificationSound', 'Sound playback error', {
        error: String(error),
        errorName: error instanceof Error ? error.name : 'Unknown',
        errorMessage: error instanceof Error ? error.message : 'Unknown'
      });
      // #endregion
      console.warn("[Notification] Sound playback error:", error);
    });
  }, []);

  // WebSocket connection
  useEffect(() => {
    // #region agent log
    const logDebug = (location: string, message: string, data: any, hypothesisId?: string) => {
      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          message,
          data,
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          ...(hypothesisId && { hypothesisId })
        })
      }).catch(() => {});
    };
    // #endregion

    if (!selectedConversationId || !user) {
      // Eğer conversation veya user yoksa, mevcut socket'i kapat
      if (socketRef.current) {
        // #region agent log
        logDebug('ProfilMesajlarClient.tsx:210', 'Closing socket: no conversation or user', {
          selectedConversationId,
          userId: user?.id
        });
        // #endregion
        console.log("[WS] Closing socket: no conversation or user");
        socketRef.current.close();
        socketRef.current = null;
      }
      return;
    }

    const wsUrl = getChatWsUrl(selectedConversationId);
    
    // #region agent log
    logDebug('ProfilMesajlarClient.tsx:218', 'Opening WS connection', {
      conversationId: selectedConversationId,
      wsUrl,
      userId: user.id
    }, 'A');
    // #endregion
    
    console.log(`[WS] Opening connection to conversation ${selectedConversationId}`);
    
    // Eski socket varsa kapat (cleanup önce çalışmış olabilir)
    const previousSocket = socketRef.current;
    if (previousSocket) {
      console.log("[WS] Closing previous socket");
      // Cleanup sırasında kapanmış olabilir, kontrol et
      if (previousSocket.readyState === WebSocket.OPEN || previousSocket.readyState === WebSocket.CONNECTING) {
        previousSocket.close(1000, "New connection opening");
      }
      socketRef.current = null;
    }

    const socket = new WebSocket(wsUrl);
    let isIntentionallyClosed = false;

    socket.onopen = () => {
      // #region agent log
      logDebug('ProfilMesajlarClient.tsx:232', 'WS connection opened', {
        conversationId: selectedConversationId,
        wsUrl,
        userId: user.id,
        readyState: socket.readyState
      }, 'D');
      // #endregion
      console.log(`[WS] Connected to conversation ${selectedConversationId}`);
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        // #region agent log
        console.log('[WS] Received event:', payload); // Debug log
        fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilMesajlarClient.tsx:socket.onmessage',message:'WS event received',data:{type: payload?.type, payload: payload},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'WS_EVENT'})}).catch(()=>{});
        // #endregion
        
        // Call events
        if (payload?.type === "call_invite_sent") {
          console.log('🟢 [CALL STATUS] Event geldi: call_invite_sent, Mevcut status:', callStatus);
          setCallStatus('ringing');
          console.log('🟡 [CALL STATUS] Ringing yapıldı (event sonrası), yeni status:', 'ringing');
          setActiveCall({
            conversationId: selectedConversationId!,
            callId: payload.call_id,
            callType: payload.call_type,
          });
        } else if (payload?.type === "call_accept") {
          // Token al ve modal aç
          handleCallAccept(payload).catch((err) => {
            console.error("[CALL] Failed to accept call:", err);
          });
        } else if (payload?.type === "call_reject") {
          setCallStatus('idle');
          setActiveCall(null);
          setCallModalOpen(false);
        } else if (payload?.type === "call_end") {
          setCallStatus('idle');
          setActiveCall(null);
          setCallModalOpen(false);
        } else if (payload?.type === "message" && payload.message) {
          const incoming = payload.message as ApiMessage;
          
          // #region agent log
          logDebug('ProfilMesajlarClient.tsx:238', 'WS message received', {
            conversationId: selectedConversationId,
            messageId: incoming.id,
            senderId: incoming.sender.id,
            userId: user.id,
            incomingConversation: incoming.conversation,
            incomingConversationType: typeof incoming.conversation,
            selectedConversationIdType: typeof selectedConversationId
          });
          // #endregion
          
          // Conversation field'ını normalize et (string -> number)
          const normalizedMessage: ApiMessage = {
            ...incoming,
            conversation: typeof incoming.conversation === 'string' 
              ? Number(incoming.conversation) 
              : incoming.conversation || selectedConversationId
          };
          
          // #region agent log
          logDebug('ProfilMesajlarClient.tsx:302', 'Normalized message', {
            conversationId: selectedConversationId,
            messageId: normalizedMessage.id,
            normalizedConversation: normalizedMessage.conversation,
            willMatch: normalizedMessage.conversation === selectedConversationId
          });
          // #endregion
          
          setMessages((prev) => {
            // Güvenlik: prev her zaman array olsun
            const list = Array.isArray(prev) ? prev : [];
            
            // Avoid duplicates
            if (list.some((m) => m.id === normalizedMessage.id)) {
              return list;
            }
            return [...list, normalizedMessage];
          });
          
          // Yeni mesaj geldiğinde conversation listesini refresh et
          void refreshConversations();
          
          // Ses bildirimi: Sadece kendi mesajı değilse VE farklı conversation'dan geliyorsa
          const isMyMessage = normalizedMessage.sender.id === user?.id;
          const isFromActiveConversation = normalizedMessage.conversation === selectedConversationId;
          
          // Ses çalma koşulları:
          // 1. Kendi mesajı değil
          // 2. VE farklı conversation'dan geliyor (aktif conversation'dan değil)
          // Not: Aktif conversation'da mesaj geldiğinde ses çalmaz (zaten görüyorsun)
          if (!isMyMessage && !isFromActiveConversation) {
            // #region agent log
            logDebug('ProfilMesajlarClient.tsx:355', 'Playing notification sound', {
              conversationId: selectedConversationId,
              messageId: normalizedMessage.id,
              senderId: normalizedMessage.sender.id,
              userId: user.id,
              isMyMessage,
              isFromActiveConversation,
              messageConversation: normalizedMessage.conversation
            });
            // #endregion
            playNotificationSound();
          } else {
            // #region agent log
            logDebug('ProfilMesajlarClient.tsx:365', 'Skipping notification sound', {
              conversationId: selectedConversationId,
              messageId: normalizedMessage.id,
              senderId: normalizedMessage.sender.id,
              userId: user.id,
              isMyMessage,
              isFromActiveConversation,
              reason: isMyMessage ? 'my_message' : 'active_conversation'
            });
            // #endregion
          }
        }
      } catch (error) {
        // #region agent log
        logDebug('ProfilMesajlarClient.tsx:263', 'WS message parse error', {
          conversationId: selectedConversationId,
          error: String(error)
        });
        // #endregion
        console.error("[WS] Failed to parse message", error);
      }
    };

    socket.onerror = (error) => {
      // #region agent log
      logDebug('ProfilMesajlarClient.tsx:265', 'WS error occurred', {
        conversationId: selectedConversationId,
        wsUrl,
        readyState: socket.readyState,
        userId: user.id,
        isIntentionallyClosed
      }, 'A');
      // #endregion
      // Sadece intentional olmayan kapanmalarda error logla
      if (!isIntentionallyClosed) {
      console.error(`[WS] Error for conversation ${selectedConversationId}:`, error);
      console.error("[WS] Socket state:", socket.readyState);
      console.error("[WS] Socket URL:", wsUrl);
      }
    };

    socket.onclose = (event) => {
      // #region agent log
      logDebug('ProfilMesajlarClient.tsx:272', 'WS connection closed', {
        conversationId: selectedConversationId,
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        wsUrl,
        userId: user.id,
        isIntentionallyClosed
      }, 'A');
      // #endregion
      
      // Sadece beklenmeyen kapanmalarda logla
      if (!isIntentionallyClosed && event.code !== 1000 && event.code !== 1001) {
        console.log(`[WS] Disconnected from conversation ${selectedConversationId}`, {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean
      });
        console.log("[WS] Unexpected close, may attempt reconnect");
      } else if (isIntentionallyClosed) {
        console.log(`[WS] Cleanly disconnected from conversation ${selectedConversationId}`);
      }
    };

    socketRef.current = socket;

    return () => {
      console.log(`[WS] Cleanup: closing socket for conversation ${selectedConversationId}`);
      isIntentionallyClosed = true;
      // Cleanup sadece bu socket için çalışmalı, yeni socket açılmadan önce eski socket kapanmamalı
      if (socketRef.current && socketRef.current === socket) {
        // Socket henüz açılmamışsa (CONNECTING state'de) biraz bekle
        if (socketRef.current.readyState === WebSocket.CONNECTING) {
          // Socket açılmasını bekle (max 1 saniye)
          const timeout = setTimeout(() => {
            if (socketRef.current === socket && socketRef.current.readyState === WebSocket.CONNECTING) {
              socketRef.current.close(1000, "Cleanup timeout");
              socketRef.current = null;
            }
          }, 1000);
          socket.addEventListener('open', () => {
            clearTimeout(timeout);
            if (socketRef.current === socket) {
              socketRef.current.close(1000, "Component unmounting or conversation changed");
              socketRef.current = null;
            }
          }, { once: true });
        } else if (socketRef.current.readyState === WebSocket.OPEN) {
          socketRef.current.close(1000, "Component unmounting or conversation changed");
          socketRef.current = null;
        } else {
          socketRef.current = null;
        }
      }
    };
  }, [selectedConversationId, user?.id, playNotificationSound, refreshConversations]);

  // Inbox WebSocket connection (kullanıcı bazlı - tüm conversation'lar için)
  useEffect(() => {
    // #region agent log
    const logDebug = (location: string, message: string, data: any, hypothesisId?: string) => {
      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location,
          message,
          data,
          timestamp: Date.now(),
          sessionId: 'debug-session',
          runId: 'run1',
          ...(hypothesisId && { hypothesisId })
        })
      }).catch(() => {});
    };
    // #endregion

    if (!user) {
      // User yoksa inbox socket'i kapat
      if (inboxSocketRef.current) {
        logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Closing inbox socket: no user', {});
        console.log("[INBOX WS] Closing socket: no user");
        inboxSocketRef.current.close();
        inboxSocketRef.current = null;
      }
      return;
    }

    const wsUrl = getInboxWsUrl();
    
    logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Opening inbox WS connection', {
      wsUrl,
      userId: user.id
    }, 'A');
    
    console.log(`[INBOX WS] Opening connection for user ${user.id}`);
    
    // Eski socket varsa kapat
    const previousSocket = inboxSocketRef.current;
    if (previousSocket) {
      console.log("[INBOX WS] Closing previous socket");
      if (previousSocket.readyState === WebSocket.OPEN || previousSocket.readyState === WebSocket.CONNECTING) {
        previousSocket.close(1000, "New connection opening");
      }
      inboxSocketRef.current = null;
    }

    const socket = new WebSocket(wsUrl);
    let isIntentionallyClosed = false;

    socket.onopen = () => {
      logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Inbox WS connection opened', {
        wsUrl,
        userId: user.id,
        readyState: socket.readyState
      }, 'A');
      console.log(`[INBOX WS] Connected for user ${user.id}`);
      
      // Inbox WS bağlandığında polling'i durdur
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
        pollingIntervalRef.current = null;
        console.log("[INBOX WS] Polling disabled: inbox WS connected");
      }
    };

    socket.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        
        // Call incoming event
        if (payload?.type === "call_incoming") {
          setCallStatus('incoming');
          setActiveCall({
            conversationId: payload.conversation_id,
            callId: payload.call_id,
            callType: payload.call_type,
            fromUser: payload.from_user,
          });
          playNotificationSound(); // Arama sesi çal
        } else if (payload?.type === "call_busy") {
          // Receiver meşgul
          console.log("[CALL] User is busy:", payload);
          toast({
            title: "Kullanıcı meşgul",
            description: "Kullanıcı şu anda başka bir aramada",
            variant: "destructive",
          });
          setCallStatus('idle');
          setActiveCall(null);
        } else if (payload?.type === "inbox_event") {
          logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Inbox event received', {
            event: payload.event,
            conversationId: payload.conversation_id,
            messageId: payload.message_id,
            selectedConversationId
          }, 'A');
          
          console.log(`[INBOX WS] Event received:`, payload);
          
          // Conversation listesini refresh et
          void refreshConversations();
          
          // Eğer event gelen conversation seçili değilse ses çal
          const eventConversationId = payload.conversation_id;
          // Type normalization: string/number karışıklığını önle
          const normalizedEventConvId = typeof eventConversationId === 'string' ? Number(eventConversationId) : eventConversationId;
          const normalizedSelectedConvId = typeof selectedConversationId === 'string' ? Number(selectedConversationId) : selectedConversationId;
          const isFromActiveConversation = normalizedEventConvId === normalizedSelectedConvId;
          
          // #region agent log
          logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Checking notification sound condition', {
            eventConversationId,
            eventConversationIdType: typeof eventConversationId,
            normalizedEventConvId,
            selectedConversationId,
            selectedConversationIdType: typeof selectedConversationId,
            normalizedSelectedConvId,
            isFromActiveConversation,
            willPlaySound: !isFromActiveConversation
          }, 'B');
          // #endregion
          
          if (!isFromActiveConversation) {
            logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Playing notification sound (not active conversation)', {
              eventConversationId: normalizedEventConvId,
              selectedConversationId: normalizedSelectedConvId
            }, 'B');
            console.log(`[INBOX WS] Playing notification sound - conversation ${normalizedEventConvId} is not active (selected: ${normalizedSelectedConvId})`);
            playNotificationSound();
          } else {
            logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Skipping notification sound (active conversation)', {
              eventConversationId: normalizedEventConvId,
              selectedConversationId: normalizedSelectedConvId
            }, 'B');
            console.log(`[INBOX WS] Skipping notification sound - conversation ${normalizedEventConvId} is active`);
          }
        }
      } catch (error) {
        logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Inbox event parse error', {
          error: String(error)
        }, 'A');
        console.error("[INBOX WS] Failed to parse message", error);
      }
    };

    socket.onerror = (error) => {
      logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Inbox WS error occurred', {
        wsUrl,
        readyState: socket.readyState,
        userId: user.id,
        isIntentionallyClosed
      }, 'A');
      if (!isIntentionallyClosed) {
        console.error(`[INBOX WS] Error:`, error);
      }
    };

    socket.onclose = (event) => {
      logDebug('ProfilMesajlarClient.tsx:inbox_ws', 'Inbox WS connection closed', {
        code: event.code,
        reason: event.reason,
        wasClean: event.wasClean,
        wsUrl,
        userId: user.id,
        isIntentionallyClosed
      }, 'A');
      
      if (!isIntentionallyClosed && event.code !== 1000 && event.code !== 1001) {
        console.log(`[INBOX WS] Disconnected`, {
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean
        });
        console.log("[INBOX WS] Unexpected close, may attempt reconnect");
      } else if (isIntentionallyClosed) {
        console.log(`[INBOX WS] Cleanly disconnected`);
      }
    };

    inboxSocketRef.current = socket;

    return () => {
      console.log(`[INBOX WS] Cleanup: closing inbox socket`);
      isIntentionallyClosed = true;
      if (inboxSocketRef.current && inboxSocketRef.current === socket) {
        if (inboxSocketRef.current.readyState === WebSocket.OPEN || inboxSocketRef.current.readyState === WebSocket.CONNECTING) {
          inboxSocketRef.current.close(1000, "Component unmounting");
        }
        inboxSocketRef.current = null;
      }
    };
  }, [user?.id, refreshConversations, playNotificationSound, selectedConversationId]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeMessages]);

  // Refresh/reconnect handling: Sayfa refresh olursa call state'i sıfırla
  useEffect(() => {
    const handleBeforeUnload = () => {
      // Sayfa kapanırken call state'i temizle
      if (callStatus !== 'idle') {
        // LocalStorage'a kaydet (opsiyonel, şimdilik sadece temizle)
        localStorage.removeItem('activeCall');
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Component mount olduğunda call state'i kontrol et
    // SADECE 'in_call' durumunda ve modal kapalıysa reset et
    // 'ringing' durumunda reset etme (arama başlatılmış, bekleniyor)
    if (callStatus === 'in_call' && !callModalOpen) {
      // Modal kapandı, arama bitmiş demektir
      setCallStatus('idle');
      setActiveCall(null);
      setCallToken(null);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [callStatus, callModalOpen]);

  // Call handlers
  const handleCallStart = async (callType: 'audio' | 'video') => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilMesajlarClient.tsx:handleCallStart:entry',message:'handleCallStart called',data:{callType: callType, selectedConversationId: selectedConversationId, hasSocket: !!socketRef.current, socketReadyState: socketRef.current?.readyState, callStatus: callStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'2'})}).catch(()=>{});
    // #endregion
    console.log('🔵 [CALL STATUS] Başlangıç:', callStatus);
    console.log('[CALL] handleCallStart called', { callType, selectedConversationId, socketReady: socketRef.current?.readyState });
    
    if (!selectedConversationId || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilMesajlarClient.tsx:handleCallStart:early_exit',message:'Early exit: missing conversation or socket not ready',data:{selectedConversationId: selectedConversationId, hasSocket: !!socketRef.current, socketReadyState: socketRef.current?.readyState},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'2'})}).catch(()=>{});
      // #endregion
      console.error("[CALL] Cannot start call: no conversation or socket not ready");
      return;
    }

    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilMesajlarClient.tsx:handleCallStart:before_send',message:'About to send call_invite via WS',data:{callType: callType, conversationId: selectedConversationId},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'3'})}).catch(()=>{});
    // #endregion
    
    setCallStatus('ringing');
    console.log('🟡 [CALL STATUS] Ringing yapıldı, yeni status:', 'ringing');
    const callId = `cs_${Date.now()}`;
    
    try {
      socketRef.current.send(JSON.stringify({
        type: 'call_invite',
        conversation_id: selectedConversationId,
        call_type: callType,
        client_request_id: callId,
      }));
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilMesajlarClient.tsx:handleCallStart:after_send',message:'call_invite sent successfully',data:{callId: callId, callType: callType},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'3'})}).catch(()=>{});
      // #endregion
      console.log('[CALL] call_invite sent', { callId, callType });
    } catch (error) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilMesajlarClient.tsx:handleCallStart:send_error',message:'Error sending call_invite',data:{error: String(error)},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'3'})}).catch(()=>{});
      // #endregion
      console.error('[CALL] Error sending call_invite', error);
      return;
    }

    setActiveCall({
      conversationId: selectedConversationId,
      callId,
      callType,
    });
  };

  const handleCallAccept = async (payload?: { call_id: string; room: string }) => {
    if (!activeCall) return;

    try {
      setCallStatus('connecting');
      
      // Token al
      const tokenData = await getLivekitToken({
        conversation_id: activeCall.conversationId,
        call_type: activeCall.callType,
        call_id: activeCall.callId,
      });

      setCallToken({
        livekitUrl: tokenData.livekit_url,
        token: tokenData.token,
        room: payload?.room || tokenData.room,
      });

      setCallStatus('in_call');
      setCallModalOpen(true);

      // WS'ye accept gönder (eğer payload yoksa, yani incoming call ise)
      if (!payload && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({
          type: 'call_accept',
          call_id: activeCall.callId,
        }));
      }
    } catch (error) {
      console.error("[CALL] Failed to get token:", error);
      setCallStatus('idle');
      setActiveCall(null);
    }
  };

  const handleCallReject = () => {
    if (!activeCall || !socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setCallStatus('idle');
      setActiveCall(null);
      return;
    }

    socketRef.current.send(JSON.stringify({
      type: 'call_reject',
      call_id: activeCall.callId,
    }));

    setCallStatus('idle');
    setActiveCall(null);
  };

  const handleCallEnd = () => {
    if (activeCall && socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'call_end',
        call_id: activeCall.callId,
      }));
    }

    setCallStatus('idle');
    setActiveCall(null);
    setCallModalOpen(false);
    setCallToken(null);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim() || !selectedConversationId) return;

    const text = draft.trim();
    setDraft("");

    try {
      // Try WebSocket first
      const wsReady = socketRef.current && socketRef.current.readyState === WebSocket.OPEN;
      
      if (wsReady) {
        socketRef.current.send(
          JSON.stringify({
            type: "message",
            text: text,
          })
        );
      } else {
        // Fallback to REST API
        const newMessage = await sendMessage(selectedConversationId, text);
        setMessages((prev) => [...prev, newMessage]);
      }
      
      // Conversation listesini refresh et
      await refreshConversations();
    } catch (error) {
      console.error("Failed to send message", error);
      alert("Mesaj gönderilemedi. Lütfen tekrar deneyin.");
    }
  };

  const handleConversationSelect = (id: number) => {
    setSelectedConversationId(id);
    setIsMobileDetailOpen(true);
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Şimdi";
    if (diffMins < 60) return `${diffMins} dk önce`;
    if (diffHours < 24) return `${diffHours} saat önce`;
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  };

  const formatLastMessageTime = (isoString: string | null | undefined): string => {
    if (!isoString) return "";
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) {
      const hours = Math.floor(diffMins / 60);
      const mins = diffMins % 60;
      return hours > 0 ? `${hours}:${mins.toString().padStart(2, "0")}` : `${mins} dk`;
    }
    if (diffHours < 24) {
      return date.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" });
    }
    if (diffDays === 1) return "Dün";
    if (diffDays < 7) return `${diffDays} gün önce`;
    return date.toLocaleDateString("tr-TR", { day: "numeric", month: "short" });
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="flex h-[calc(100vh-80px)] w-full max-w-full rounded-2xl border border-slate-200 bg-white overflow-hidden overflow-x-hidden">
      {/* Hidden audio element for notification sound */}
      <audio
        ref={notificationAudioRef}
        preload="auto"
        style={{ display: 'none' }}
      >
        {/* Fallback: If audio file exists, it will be used, otherwise Web Audio API will be used */}
      </audio>
      {/* Sol: Sohbet listesi */}
      <div
        className={`w-full lg:w-1/3 min-w-0 border-r border-slate-100 flex flex-col ${
          isMobileDetailOpen ? "hidden lg:flex" : "flex"
        }`}
      >
        {/* Search Bar */}
        <div className="p-3 border-b border-slate-100">
          <div className="flex items-center gap-2 rounded-full bg-slate-50 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400 shrink-0" />
            <input
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-slate-400"
              placeholder="Sohbetlerde ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Conversation List */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {isLoading ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Yükleniyor...
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-4 text-center text-sm text-slate-500">
              Sohbet bulunamadı
            </div>
          ) : (
            filteredConversations.map((conv) => {
              const other = getOtherParticipant(conv);
              const participantName = other?.username || "Bilinmeyen";
              const lastMessageText = conv.last_message?.text || "";
              return (
                <button
                  key={conv.id}
                  onClick={() => handleConversationSelect(conv.id)}
                  className={`w-full text-left p-3 hover:bg-slate-50 transition-colors ${
                    selectedConversationId === conv.id ? "bg-blue-50" : ""
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium shrink-0">
                      {getInitials(participantName)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-sm font-medium truncate text-slate-900">
                          {participantName}
                        </span>
                        <span className="text-xs text-slate-400 shrink-0">
                          {formatLastMessageTime(conv.last_message_at || conv.updated_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs truncate text-slate-500">
                          {lastMessageText}
                        </p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Sağ: Sohbet detayı (Desktop + Mobil) */}
      {selectedConversationId && (() => {
        // activeConversation varsa onu kullan, yoksa selectedConversationId'den participant bilgisini çek
        const other = activeConversation 
          ? getOtherParticipant(activeConversation)
          : null;
        const participantName = other?.username || "Yeni sohbet";
        
        return (
          <div
            className={`${
              isMobileDetailOpen ? "flex" : "hidden"
            } lg:flex flex-1 min-w-0 flex-col`}
          >
            {/* Header */}
            <div className="border-b border-slate-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Mobil geri butonu */}
                <button
                  onClick={() => setIsMobileDetailOpen(false)}
                  className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Geri"
                >
                  <ChevronLeft className="h-5 w-5 text-slate-600" />
                </button>

                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">
                  {getInitials(participantName)}
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900">
                    {participantName}
                  </h3>
                  <p className="text-xs text-slate-500">Online</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Call Buttons (Seçenek B - 3 noktanın soluna) */}
                {(() => {
                  // #region agent log
                  fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilMesajlarClient.tsx:CallButtons:render',message:'CallButtons rendering',data:{selectedConversationId: selectedConversationId, callStatus: callStatus, disabled: callStatus !== 'idle'},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'4'})}).catch(()=>{});
                  // #endregion
                  return (
                    <CallButtons
                      conversationId={selectedConversationId || 0}
                      onAudioCall={() => {
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilMesajlarClient.tsx:CallButtons:onAudioCall',message:'onAudioCall wrapper called',data:{selectedConversationId: selectedConversationId, callStatus: callStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'1'})}).catch(()=>{});
                        // #endregion
                        handleCallStart('audio');
                      }}
                      onVideoCall={() => {
                        // #region agent log
                        fetch('http://127.0.0.1:7242/ingest/96103151-ea00-4d53-9606-72d5f67c958f',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'ProfilMesajlarClient.tsx:CallButtons:onVideoCall',message:'onVideoCall wrapper called',data:{selectedConversationId: selectedConversationId, callStatus: callStatus},timestamp:Date.now(),sessionId:'debug-session',runId:'run1',hypothesisId:'1'})}).catch(()=>{});
                        // #endregion
                        handleCallStart('video');
                      }}
                      disabled={callStatus !== 'idle'}
                    />
                  );
                })()}

                <button
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  aria-label="Daha fazla"
                >
                  <MoreVertical className="h-5 w-5 text-slate-600" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
              {activeMessages.length === 0 ? (
                <div className="text-center text-sm text-slate-500 py-8">
                  Henüz mesaj yok. İlk mesajı sen gönder!
                </div>
              ) : (
                <>
                  {activeMessages.map((msg) => {
                    const isMe = isMyMessage(msg);
                    return (
                      <div
                        key={msg.id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-xl ${
                            isMe
                              ? "bg-blue-600 text-white"
                              : "bg-slate-100 text-slate-900"
                          }`}
                        >
                          <div className="text-sm break-words">{msg.text}</div>
                          <div
                            className={`text-[10px] mt-1 ${
                              isMe
                                ? "text-blue-100"
                                : "text-slate-400"
                            }`}
                          >
                            {formatTime(msg.created_at)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-100 p-3">
              <form
                className="flex items-end gap-2 rounded-2xl bg-slate-50 px-3 py-2"
                onSubmit={handleSendMessage}
              >
                <textarea
                  className="flex-1 resize-none bg-transparent text-sm outline-none max-h-32 placeholder:text-slate-400"
                  rows={1}
                  placeholder="Mesaj yaz..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(e);
                    }
                  }}
                />
                <button
                  type="submit"
                  disabled={!draft.trim()}
                  className="p-2 hover:bg-slate-200 rounded-lg transition-colors shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label="Gönder"
                >
                  <Send className="h-5 w-5 text-blue-600" />
                </button>
              </form>
            </div>
          </div>
        );
      })()}

      {/* Mobil: Boş durum (sadece liste görünürken) */}
      {!isMobileDetailOpen && !selectedConversationId && (
        <div className="lg:hidden flex-1 flex items-center justify-center p-8">
          <div className="text-center">
            <p className="text-sm text-slate-500">
              Bir sohbet seçin
            </p>
          </div>
        </div>
      )}

      {/* Incoming Call Overlay */}
      {callStatus === 'incoming' && activeCall && (
        <IncomingCallOverlay
          incomingCall={{
            conversation_id: activeCall.conversationId,
            call_id: activeCall.callId,
            call_type: activeCall.callType,
            from_user: activeCall.fromUser || { id: 0, email: '', username: '' },
          }}
          onAccept={() => handleCallAccept()}
          onReject={handleCallReject}
        />
      )}

      {/* Video Call Modal */}
      {callModalOpen && callToken && activeCall && (
        <VideoCallModal
          open={callModalOpen}
          onClose={() => {
            setCallModalOpen(false);
            handleCallEnd();
          }}
          livekitUrl={callToken.livekitUrl}
          token={callToken.token}
          callType={activeCall.callType}
          roomName={callToken.room}
          onEndCall={handleCallEnd}
        />
      )}
    </div>
  );
}
