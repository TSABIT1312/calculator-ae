import React from 'react';
import { Check, X, AlertCircle } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast || !toast.show) return null;

  const { title, message, type = 'success' } = toast;

  let bgClass = 'bg-emerald-500';
  let IconComponent = Check;

  if (type === 'error') {
    bgClass = 'bg-rose-500';
    IconComponent = X;
  } else if (type === 'warning') {
    bgClass = 'bg-amber-500';
    IconComponent = AlertCircle;
  }

  return (
    <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 max-w-sm w-full px-4 animate-in fade-in slide-in-from-top-4 duration-300">
      <div className="bg-white rounded-xl shadow-xl border border-slate-100 p-4 flex items-start gap-3">
        <div className={`p-2 rounded-lg text-white ${bgClass} shrink-0`}>
          <IconComponent className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-slate-800 text-sm">{title}</h4>
          <p className="text-xs text-slate-500 mt-0.5 break-words">{message}</p>
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1"
          type="button"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

