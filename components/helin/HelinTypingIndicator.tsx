export function HelinTypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-2 text-xs text-slate-400 animate-pulse">
      <span>Helin Hanım yazıyor</span>
      <span className="flex gap-0.5">
        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-0"></span>
        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-150"></span>
        <span className="w-1 h-1 bg-slate-400 rounded-full animate-bounce delay-300"></span>
      </span>
    </div>
  );
}

