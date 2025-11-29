'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { HelinMessage, HelinChatResponse, HelinSessionContext } from '@/types/helin';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY_SESSION = 'helin_session_id';
const STORAGE_KEY_MESSAGES = 'helin_messages';
const STORAGE_KEY_CONTEXT = 'helin_session_context';

interface HelinChatContextType {
  isOpen: boolean;
  toggleChat: () => void;
  messages: HelinMessage[];
  sendMessage: (text: string, productContext?: any) => Promise<void>;
  isLoading: boolean;
  hasUnread: boolean;
  sessionContext?: HelinSessionContext;
}

const HelinChatContext = createContext<HelinChatContextType | undefined>(undefined);

export function HelinChatProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [messages, setMessages] = useState<HelinMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);
  const [sessionContext, setSessionContext] = useState<HelinSessionContext | undefined>();

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

    // 3. Session Context
    const storedContext = localStorage.getItem(STORAGE_KEY_CONTEXT);
    if (storedContext) {
      try {
        setSessionContext(JSON.parse(storedContext));
      } catch (e) {
        console.error('Failed to parse stored context', e);
        setSessionContext({ mode: 'INFO', greetingCount: 0, handoffCount: 0 });
      }
    } else {
      setSessionContext({ mode: 'INFO', greetingCount: 0, handoffCount: 0 });
    }
  }, []);

  // Persist messages
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    }
  }, [messages]);

  // Persist session context
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

    // İstek başlangıç zamanını kaydet
    const requestStartTime = Date.now();
    const MIN_RESPONSE_DELAY = 3000; // Minimum 3 saniye bekleme süresi

    try {
      const res = await fetch('/api/helin-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          message: text,
          sessionContext,
          productContext
        })
      });

      if (!res.ok) throw new Error('Network response was not ok');

      const data: HelinChatResponse = await res.json();

      // İstek süresini hesapla
      const requestDuration = Date.now() - requestStartTime;
      const remainingDelay = Math.max(0, MIN_RESPONSE_DELAY - requestDuration);

      // Eğer istek 3 saniyeden kısa sürdüyse, kalan süreyi bekle
      if (remainingDelay > 0) {
        await new Promise(resolve => setTimeout(resolve, remainingDelay));
      }

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
  }, [sessionId, sessionContext, isOpen]);

  return (
    <HelinChatContext.Provider
      value={{
        isOpen,
        toggleChat,
        messages,
        sendMessage,
        isLoading,
        hasUnread,
        sessionContext
      }}
    >
      {children}
    </HelinChatContext.Provider>
  );
}

export function useHelinChatContext() {
  const context = useContext(HelinChatContext);
  if (context === undefined) {
    throw new Error('useHelinChatContext must be used within a HelinChatProvider');
  }
  return context;
}

