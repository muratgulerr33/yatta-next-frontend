'use client';

import { useHelinChatContext } from '@/contexts/HelinChatContext';
import { HelinChatTrigger } from './HelinChatTrigger';
import { HelinChatWindow } from './HelinChatWindow';

interface HelinChatRootProps {
  hideOnMobile?: boolean;
}

export function HelinChatRoot({ hideOnMobile = false }: HelinChatRootProps) {
  const { 
    isOpen, 
    toggleChat, 
    messages, 
    sendMessage, 
    isLoading, 
    hasUnread 
  } = useHelinChatContext();

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
        hideOnMobile={hideOnMobile}
      />
    </>
  );
}

