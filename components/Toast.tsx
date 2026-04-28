
import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`fixed bottom-8 right-8 z-50 px-6 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce-in border ${
      type === 'success' 
        ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-900/90 dark:text-emerald-100 dark:border-emerald-800' 
        : 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-900/90 dark:text-rose-100 dark:border-rose-800'
    }`}>
      <span>{type === 'success' ? '✅' : '❌'}</span>
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70">✕</button>
    </div>
  );
};

export default Toast;
