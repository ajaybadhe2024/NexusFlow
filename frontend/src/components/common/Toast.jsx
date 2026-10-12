import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

export const Toast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (duration) {
      const timer = setTimeout(() => {
        if (onClose) onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400" />,
    error: <AlertCircle className="w-5 h-5 text-rose-400" />,
    info: <Info className="w-5 h-5 text-cyan-400" />
  };

  const borderStyles = {
    success: 'border-emerald-500/40 bg-slate-900/90 text-emerald-200',
    warning: 'border-amber-500/40 bg-slate-900/90 text-amber-200',
    error: 'border-rose-500/40 bg-slate-900/90 text-rose-200',
    info: 'border-cyan-500/40 bg-slate-900/90 text-cyan-200'
  };

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-xl backdrop-blur-md transition-all ${borderStyles[type] || borderStyles.info}`}>
      {icons[type] || icons.info}
      <span className="text-sm font-medium text-slate-100">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-auto text-slate-400 hover:text-slate-200 transition-colors p-0.5"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
