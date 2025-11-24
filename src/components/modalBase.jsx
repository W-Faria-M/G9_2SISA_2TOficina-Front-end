import React, { useEffect } from "react";
import "./modalBase.css";

export default function TransientModal({ isOpen, message = "", duration = 2000, onClose = () => {} }) {
  useEffect(() => {
    if (!isOpen) return;
    const t = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(t);
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="tm-overlay" role="alertdialog" aria-live="polite" aria-modal="true">
      <div className="tm-box">
        <div className="tm-content">{message}</div>
      </div>
    </div>
  );
}