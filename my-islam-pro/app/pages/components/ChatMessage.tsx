'use client';

import { motion } from 'motion/react';
import { Bot, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useRouter } from 'next/navigation';
import { CopyButton } from './CopyButton';
import { linkifyReferences } from '@/lib/linkify-references';
import type { Message } from './AIModal';

interface ChatMessageProps {
  message: Message;
  onLinkClick: () => void;
}

export function ChatMessage({ message, onLinkClick }: ChatMessageProps) {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-4 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-lg ${
          message.role === 'user'
            ? 'bg-[var(--accent)] text-[var(--text-on-accent)]'
            : 'bg-[var(--bg-elevated)] border border-[var(--accent-border)] text-[var(--text-accent)]'
        }`}
      >
        {message.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
      </div>
      <div
        className={`group/msg max-w-[85%] md:max-w-[75%] px-5 py-4 rounded-2xl text-[0.95rem] leading-relaxed ${
          message.role === 'user'
            ? 'bg-[var(--accent)]/10 border border-[var(--accent-border)] text-[var(--text-primary)] rounded-tr-none'
            : 'bg-[var(--bg-elevated)] border border-[var(--accent-border-light)] text-[var(--text-primary)]/85 rounded-tl-none'
        }`}
      >
        <div className="prose prose-invert prose-sm max-w-none prose-p:leading-relaxed prose-pre:bg-[var(--bg-primary)] prose-pre:border prose-pre:border-[var(--accent-border-light)]">
          <ReactMarkdown
            components={{
              a: function renderLink({ href, children }) {
                function handleLinkClick() {
                  if (href) {
                    onLinkClick();
                    router.push(href);
                  }
                }

                return (
                  <button
                    onClick={handleLinkClick}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-[var(--accent)]/10 border border-[var(--accent-border)] text-[var(--text-accent)] rounded-md text-[0.75rem] no-underline hover:bg-[var(--accent)]/20 transition-all mt-2 font-medium group/link cursor-pointer"
                  >
                    {children}
                    <svg className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </button>
                );
              },
            }}
          >
            {linkifyReferences(message.content || '')}
          </ReactMarkdown>
        </div>

        {message.role === 'assistant' && (
          <div className="mt-3 pt-3 border-t border-[#D48C46]/10 flex justify-start opacity-0 group-hover/msg:opacity-100 transition-opacity">
            <CopyButton textToCopy={message.content} />
          </div>
        )}
      </div>
    </motion.div>
  );
}
