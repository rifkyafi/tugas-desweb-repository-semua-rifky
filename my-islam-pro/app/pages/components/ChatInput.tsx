'use client';

import { Send, Trash2 } from 'lucide-react';

interface ChatInputProps {
  input: string;
  setInput: (value: string) => void;
  onSend: () => void;
  isLoading: boolean;
  hasMessages: boolean;
  onClearClick: () => void;
}

export function ChatInput({ input, setInput, onSend, isLoading, hasMessages, onClearClick }: ChatInputProps) {
  return (
    <div className="p-4 md:p-6 bg-[var(--bg-secondary)] border-t border-[var(--accent-border-light)]">
      <div className="flex gap-3 items-center max-w-[700px] mx-auto">
        <button
          onClick={onClearClick}
          disabled={!hasMessages}
          className="p-3 rounded-xl bg-[var(--accent)]/5 border border-[var(--accent-border-light)] text-[var(--text-muted)] hover:text-[#FF4B4B] hover:bg-[#FF4B4B]/10 hover:border-[#FF4B4B]/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
          title="Hapus Percakapan"
        >
          <Trash2 className="w-5 h-5" />
        </button>
        <div className="flex-1 relative">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                if (input.trim() && !isLoading) {
                  onSend();
                }
              }
            }}
            placeholder="Ketik pesan di sini... (Enter untuk kirim, Shift+Enter untuk baris baru)"
            rows={1}
            className="w-full bg-[var(--bg-elevated)] border border-[var(--accent-border)] rounded-xl px-5 py-3.5 pr-14 text-[0.95rem] focus:outline-none focus:border-[var(--text-accent)] focus:ring-1 focus:ring-[var(--accent)]/30 transition-all placeholder:text-[var(--text-muted)]/40 text-[var(--text-primary)] resize-none overflow-y-auto max-h-40"
          />
          <button
            onClick={onSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2.5 rounded-lg bg-[var(--accent)] text-[var(--text-on-accent)] hover:bg-[var(--accent-light)] transition-all disabled:opacity-40 disabled:grayscale disabled:cursor-not-allowed shadow-lg"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="text-center mt-3">
        <span className="text-[0.6rem] text-[var(--text-muted)]/40 uppercase tracking-[2px]">
          Tetap Tanyakan Ke Guru untuk meyakinkan
        </span>
      </div>
    </div>
  );
}
