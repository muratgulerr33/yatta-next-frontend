interface HelinChatTriggerProps {
  onClick: () => void;
  isOpen: boolean;
  hasUnread: boolean;
}

export function HelinChatTrigger({ onClick, isOpen, hasUnread }: HelinChatTriggerProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-6 right-6 z-50 p-0 w-14 h-14 sm:w-16 sm:h-16 rounded-full shadow-xl transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-300 ${
        isOpen ? 'bg-slate-800 rotate-90' : 'bg-[#004aad]'
      }`}
      aria-label={isOpen ? 'Chati kapat' : 'Chati aç'}
    >
      {/* Icon Container */}
      <div className="relative w-full h-full flex items-center justify-center text-white">
        {isOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="-rotate-90">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
             <path fillRule="evenodd" d="M4.804 21.644A6.707 6.707 0 006 21.75a6.721 6.721 0 003.583-1.029c.774.182 1.584.279 2.417.279 5.322 0 9.75-3.97 9.75-9 0-5.03-4.428-9-9.75-9s-9.75 3.97-9.75 9c0 2.409 1.025 4.587 2.73 6.119.228.626.633 1.687 1.25 2.803a.75.75 0 001.324-.278z" clipRule="evenodd" />
          </svg>
        )}
        
        {/* Unread Indicator */}
        {!isOpen && hasUnread && (
           <span className="absolute top-0 right-0 block h-4 w-4 rounded-full ring-2 ring-white bg-red-500 transform translate-x-[-25%] translate-y-[25%] animate-bounce"></span>
        )}
      </div>
    </button>
  );
}

