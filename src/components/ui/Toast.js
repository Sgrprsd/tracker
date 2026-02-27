"use client";

import { createContext, useContext, useState, useCallback } from "react";
import styles from "./Toast.module.css";

const ToastContext = createContext(null);

const icons = {
  success: "✓",
  error: "✕",
  info: "ℹ",
  warning: "⚠",
};

const variantClass = {
  success: styles.toastSuccess,
  error: styles.toastError,
  info: styles.toastInfo,
  warning: styles.toastWarning,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, variant = "info") => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, variant }]);

    // Auto-remove after 3s
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    {
      success: (msg) => addToast(msg, "success"),
      error: (msg) => addToast(msg, "error"),
      info: (msg) => addToast(msg, "info"),
      warning: (msg) => addToast(msg, "warning"),
    },
    [addToast],
  );

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className={styles.toastContainer}>
        {toasts.map((t) => (
          <div key={t.id} className={variantClass[t.variant] || styles.toast}>
            <span className={styles.toastIcon}>{icons[t.variant]}</span>
            <span className={styles.toastMessage}>{t.message}</span>
            <button
              className={styles.toastClose}
              onClick={() => removeToast(t.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
}
