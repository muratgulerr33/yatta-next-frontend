import { HelinMessage } from '@/types/helin';
import { HelinMessageList } from './HelinMessageList';
import { HelinMessageInput } from './HelinMessageInput';

interface HelinChatWindowProps {
  isOpen: boolean;
  onClose: () => void;
  messages: HelinMessage[];
  onSendMessage: (text: string) => void;
  isLoading: boolean;
}

export function HelinChatWindow({ 
  isOpen, 
  onClose, 
  messages, 
  onSendMessage, 
  isLoading 
}: HelinChatWindowProps) {
  
  if (!isOpen) return null;

  return (
    <div className="fixed bottom-[90px] right-4 sm:right-6 w-[calc(100%-32px)] sm:w-[380px] max-h-[70vh] h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col border border-slate-100 overflow-hidden z-50 animate-in slide-in-from-bottom-5 fade-in duration-300 origin-bottom-right">
      {/* Header */}
      <div className="bg-[#004aad] p-4 flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="relative">
             <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold border border-white/20">
               H
             </div>
             <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-[#004aad] rounded-full"></span>
          </div>
          <div>
            <h3 className="text-white font-bold text-sm">Helin Hanım</h3>
            <p className="text-blue-100 text-xs opacity-90">Dijital Satış Asistanı</p>
          </div>
        </div>
        
        <button 
          onClick={onClose}
          className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          aria-label="Kapat"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Message Area */}
      <HelinMessageList messages={messages} isLoading={isLoading} />

      {/* Input Area */}
      <HelinMessageInput onSend={onSendMessage} isLoading={isLoading} />
    </div>
  );
}

