'use client';

import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle } from 'lucide-react';

interface ConfirmPopupProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmPopup({
  isOpen,
  title,
  message,
  confirmLabel = 'Hapus',
  cancelLabel = 'Batal',
  onConfirm,
  onCancel,
}: ConfirmPopupProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="absolute inset-0 z-[1100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-md"
            onClick={onCancel}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-[340px] bg-[var(--bg-elevated)] border border-[#FF4B4B]/30 rounded-2xl p-6 shadow-2xl text-center"
          >
            <div className="w-14 h-14 rounded-full bg-[#FF4B4B]/10 flex items-center justify-center mx-auto mb-4 border border-[#FF4B4B]/20">
              <AlertCircle className="w-8 h-8 text-[#FF4B4B]" />
            </div>
            <h4 className="text-lg font-semibold text-[var(--text-primary)] mb-2">{title}</h4>
            <p className="text-sm text-[var(--text-muted)] mb-6 leading-relaxed">{message}</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={onCancel}
                className="px-4 py-2.5 rounded-xl border border-[var(--accent-border)] text-[var(--text-secondary)] hover:bg-[#D48C46]/10 transition-all text-sm"
              >
                {cancelLabel}
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2.5 rounded-xl bg-[#FF4B4B] text-white hover:bg-[#D43B3B] transition-all shadow-lg text-sm font-semibold"
              >
                {confirmLabel}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
