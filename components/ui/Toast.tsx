'use client';

import { Toast as ToastType } from '@/lib/hooks/use-toast';

interface ToastProps {
  toast: ToastType;
  onClose: () => void;
}

export function Toast({ toast, onClose }: ToastProps) {
  const variantStyles = {
    default: 'bg-white border-gray-200 text-gray-900',
    destructive: 'bg-red-50 border-red-200 text-red-900',
    success: 'bg-green-50 border-green-200 text-green-900',
  };

  return (
    <div
      className={`rounded-lg border p-4 shadow-lg min-w-[300px] max-w-[500px] ${variantStyles[toast.variant || 'default']}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-sm">{toast.title}</h4>
          {toast.description && (
            <p className="text-sm mt-1 opacity-90">{toast.description}</p>
          )}
        </div>
        <button
          onClick={onClose}
          className="ml-4 text-gray-400 hover:text-gray-600"
          aria-label="Kapat"
        >
          ×
        </button>
      </div>
    </div>
  );
}

