'use client';

import { useHelinChat } from '@/hooks/useHelinChat';
import { HelinChatTrigger } from './HelinChatTrigger';
import { HelinChatWindow } from './HelinChatWindow';

export function HelinChatRoot() {
  const { 
    isOpen, 
    toggleChat, 
    messages, 
    sendMessage, 
    isLoading, 
    hasUnread 
  } = useHelinChat();

  return (
    <>
      <HelinChatWindow 
        isOpen={isOpen}
        onClose={toggleChat}
        messages={messages}
        onSendMessage={sendMessage}
        isLoading={isLoading}
      />
      <HelinChatTrigger 
        onClick={toggleChat} 
        isOpen={isOpen} 
        hasUnread={hasUnread}
      />
    </>
  );
}

