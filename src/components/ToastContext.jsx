import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

let idCounter = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback(({ type = 'info', message, duration = 5000 }) => {
    const id = ++idCounter;
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => {
      setToasts((t) => t.filter((x) => x.id !== id));
    }, duration);
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  const removeAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, removeToast, removeAll }}>
      {children}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`w-full px-4 py-3 rounded shadow-lg border relative flex items-start justify-between ${
              t.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : t.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-white border-gray-200 text-gray-800'
            }`}>
            <div className="pr-6">{t.message}</div>
            <button
              aria-label="Close toast"
              onClick={() => removeToast(t.id)}
              className="absolute top-1 right-2 text-sm text-gray-500 hover:text-gray-700">
              ×
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

export default ToastContext;
