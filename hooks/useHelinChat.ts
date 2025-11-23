import { useState, useCallback, useEffect } from 'react';
import { HelinMessage, HelinChatResponse, HelinSessionContext } from '@/types/helin';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_SESSION = 'helin_session_id';
const STORAGE_KEY_MESSAGES = 'helin_messages';
const STORAGE_KEY_CONTEXT = 'helin_session_context'; // V1.1: Session context storage

export function useHelinChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<HelinMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [sessionContext, setSessionContext] = useState<HelinSessionContext | undefined>(); // V1.1

  // Initialize session
  useEffect(() => {
    // 1. Session ID
    let storedSession = localStorage.getItem(STORAGE_KEY_SESSION);
    if (!storedSession) {
      storedSession = uuidv4();
      localStorage.setItem(STORAGE_KEY_SESSION, storedSession);
    }
    setSessionId(storedSession);

    // 2. Messages
    const storedMessages = localStorage.getItem(STORAGE_KEY_MESSAGES);
    if (storedMessages) {
      try {
        setMessages(JSON.parse(storedMessages));
      } catch (e) {
        console.error('Failed to parse stored messages', e);
      }
    } else {
      // Initial greeting if no messages
      const initialMsg: HelinMessage = {
        id: uuidv4(),
        role: 'bot',
        content: 'Merhaba! Ben Helin, Yatta dijital satış asistanınızım. Size nasıl yardımcı olabilirim?',
        timestamp: Date.now()
      };
      setMessages([initialMsg]);
    }

    // 3. V1.1: Session Context
    const storedContext = localStorage.getItem(STORAGE_KEY_CONTEXT);
    if (storedContext) {
      try {
        setSessionContext(JSON.parse(storedContext));
      } catch (e) {
        console.error('Failed to parse stored context', e);
        // Varsayılan context
        setSessionContext({ mode: 'INFO', greetingCount: 0, handoffCount: 0 });
      }
    } else {
      // Varsayılan context
      setSessionContext({ mode: 'INFO', greetingCount: 0, handoffCount: 0 });
    }
  }, []);

  // Persist messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  // V1.1: Persist session context
  useEffect(() => {
    if (sessionContext) {
      localStorage.setItem(STORAGE_KEY_CONTEXT, JSON.stringify(sessionContext));
    }
  }, [sessionContext]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) setHasUnread(false);
      return !prev;
    });
  }, []);

  const sendMessage = useCallback(async (text: string, productContext?: any) => {
    if (!text.trim()) return;

    const userMsg: HelinMessage = {
      id: uuidv4(),
      role: 'user',
      content: text,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      // V1.1: Session context'i API'ye gönder
      const res = await fetch('/api/helin-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          sessionContext, // V1.1: Context'i gönder
          productContext
        })
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data: HelinChatResponse = await res.json();

      const botMsg: HelinMessage = {
        id: uuidv4(),
        role: 'bot',
        content: data.reply,
        timestamp: Date.now(),
        intent: data.intent,
        metadata: {
          needsHuman: data.needsHuman,
          matchedFaqId: data.matchedFaqId
        }
      };

      setMessages(prev => [...prev, botMsg]);
      if (!isOpen) setHasUnread(true);

      // V1.1: Session patch varsa context'i güncelle
      if (data.sessionPatch) {
        setSessionContext(prev => ({
          ...prev,
          ...data.sessionPatch
        } as HelinSessionContext));
      }

    } catch (error) {
      console.error('Helin chat error:', error);
      const errorMsg: HelinMessage = {
        id: uuidv4(),
        role: 'system',
        content: 'Üzgünüm, bir bağlantı hatası oluştu. Lütfen tekrar deneyin.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  }, [sessionId, sessionContext, isOpen]); // V1.1: sessionContext dependency eklendi

  return {
    isOpen,
    toggleChat,
    messages,
    sendMessage,
    isLoading,
    hasUnread,
    sessionContext // V1.1: Context'i expose et (debug için)
  };
}
