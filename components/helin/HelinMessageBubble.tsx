import { HelinMessage } from '@/types/helin';
import clsx from 'clsx';

interface HelinMessageBubbleProps {
  message: HelinMessage;
}

export function HelinMessageBubble({ message }: HelinMessageBubbleProps) {
  const isBot = message.role === 'bot';
  const isSystem = message.role === 'system';

  if (isSystem) {
    return (
      <div className="flex justify-center my-2">
        <span className="text-xs text-slate-400 bg-slate-50 px-2 py-1 rounded">{message.content}</span>
      </div>
    );
  }

  return (
    <div className={clsx('flex w-full mb-4', isBot ? 'justify-start' : 'justify-end')}>
      <div className={clsx(
        'flex max-w-[85%] md:max-w-[75%]',
        isBot ? 'flex-row' : 'flex-row-reverse'
      )}>
        {/* Avatar Placeholder */}
        <div className={clsx(
          'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white mx-2 mt-1 shadow-sm',
          isBot ? 'bg-gradient-to-br from-[#004aad] to-blue-600' : 'bg-slate-400'
        )}>
          {isBot ? 'H' : 'S'}
        </div>

        {/* Message Content */}
        <div className={clsx(
          'px-4 py-2.5 shadow-sm text-sm leading-relaxed break-words',
          isBot 
            ? 'bg-white rounded-2xl rounded-tl-none text-slate-700 border border-slate-100' 
            : 'bg-[#004aad] rounded-2xl rounded-tr-none text-white'
        )}>
          {message.content}
          
          {/* Timestamp (Optional) */}
          <div className={clsx(
            'text-[10px] mt-1 opacity-70 text-right',
            isBot ? 'text-slate-400' : 'text-blue-100'
          )}>
            {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  );
}

