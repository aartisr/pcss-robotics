import React from 'react';
import { ToastMessage } from '../types';
import { CheckCircle2, Info, Sparkles, X } from 'lucide-react';

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div 
      aria-live="polite"
      aria-atomic="true"
      className="fixed bottom-20 sm:bottom-6 sm:right-6 left-4 right-4 sm:left-auto z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
    >
      {toasts.map((toast) => {
        let borderClass = 'border-cyan-500/50 bg-slate-950/90 text-white shadow-cyan-950/50';
        let icon = <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />;

        if (toast.type === 'purple') {
          borderClass = 'border-purple-500/50 bg-slate-950/90 text-white shadow-purple-950/50';
          icon = <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />;
        } else if (toast.type === 'success') {
          borderClass = 'border-emerald-500/50 bg-slate-950/90 text-white shadow-emerald-950/50';
          icon = <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />;
        } else if (toast.type === 'info') {
          borderClass = 'border-blue-500/50 bg-slate-950/90 text-white shadow-blue-950/50';
          icon = <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-2xl border backdrop-blur-xl shadow-2xl flex items-start justify-between gap-3 text-xs transition-all duration-300 animate-in fade-in slide-in-from-bottom-2 ${borderClass}`}
          >
            <div className="flex items-start gap-2.5">
              {icon}
              <div className="space-y-0.5">
                <div className="font-bold tracking-tight text-white">{toast.title}</div>
                {toast.message && (
                  <div className="text-[11px] text-slate-300 leading-relaxed">{toast.message}</div>
                )}
              </div>
            </div>
            <button
              onClick={() => onDismiss(toast.id)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              aria-label="Dismiss alert"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
