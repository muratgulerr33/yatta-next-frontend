import { useRef, useEffect } from 'react';
import { HelinMessage } from '@/types/helin';
import { HelinMessageBubble } from './HelinMessageBubble';
import { HelinTypingIndicator } from './HelinTypingIndicator';

interface HelinMessageListProps {
  messages: HelinMessage[];
  isLoading: boolean;
}

export function HelinMessageList({ messages, isLoading }: HelinMessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-slate-50/50">
      {messages.map((msg) => (
        <HelinMessageBubble key={msg.id} message={msg} />
      ))}
      
      {isLoading && (
        <div className="flex justify-start w-full mb-4">
             <div className="flex max-w-[85%] flex-row">
                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mx-2 mt-1 bg-gradient-to-br from-[#004aad] to-blue-600 shadow-sm">
                    H
                </div>
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-none border border-slate-100 shadow-sm">
                    <HelinTypingIndicator />
                </div>
             </div>
        </div>
      )}
      
      <div ref={bottomRef} />
    </div>
  );
}

