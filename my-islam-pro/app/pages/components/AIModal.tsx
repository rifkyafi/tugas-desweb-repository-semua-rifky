"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Bot, Sparkles, X, MessageCircle } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { ConfirmPopup } from "./ConfirmPopup";
import { useScrollLock, useEscapeKey } from "@/lib/hooks";
import { CHAT_HISTORY_KEY, MAX_CHAT_HISTORY } from "@/lib/constants";
import type { Message } from "../types";

export type { Message };

const starterQuestions = [
  "Apa itu hadits?", "Berikan nasihat tentang sabar", "Pentingnya shalat berjamaah",
  "Adab menuntut ilmu", "Nasihat saat sedih", "Kisah singkat Rasulullah ﷺ",
  "Apa itu ikhlas?", "Keutamaan membaca Al-Qur'an", "Bagaimana cara bertaubat?",
  "Manfaat silaturahmi", "Zakat dan sedekah", "Puasa di bulan Ramadhan"
];

function getRandomQuestions() {
  const shuffled = [...starterQuestions];
  for (let currentIndex = shuffled.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [shuffled[currentIndex], shuffled[randomIndex]] = [shuffled[randomIndex], shuffled[currentIndex]];
  }
  return shuffled.slice(0, 3);
}

function QuestionItem({ question, onSelect }: { question: string; onSelect: (q: string) => void }) {
  function handleSelect() {
    onSelect(question);
  }

  return (
    <button
      onClick={handleSelect}
      className="text-[0.75rem] px-4 py-2 rounded-full border border-[var(--accent-border-light)] bg-[var(--accent)]/5 text-[var(--text-secondary)] hover:bg-[var(--accent)]/15 hover:border-[var(--accent-border)] transition-all"
    >
      {question}
    </button>
  );
}

function StarterQuestions({ onSelect }: { onSelect: (question: string) => void }) {
  const randomQuestions = useMemo(getRandomQuestions, []);

  function renderQuestionItem(question: string) {
    return <QuestionItem key={question} question={question} onSelect={onSelect} />;
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {randomQuestions.map(renderQuestionItem)}
    </div>
  );
}

function EmptyState({ onSelect }: { onSelect: (q: string) => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center py-20">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="w-20 h-20 rounded-2xl bg-[var(--accent)]/5 flex items-center justify-center mb-6 border border-[var(--accent-border-light)]"
      >
        <Sparkles className="w-10 h-10 text-[var(--text-accent)]/40" />
      </motion.div>
      <h3 className="text-[var(--text-accent)] font-cormorant text-2xl mb-2">Ahlan wa Sahlan</h3>
      <p className="text-[var(--text-muted)] text-sm max-w-[300px] leading-relaxed mb-8">
        Tanyakan hal seputar Islam, adab, atau bimbingan ibadah.
      </p>
      <StarterQuestions onSelect={onSelect} />
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-4">
      <div className="w-9 h-9 rounded-xl bg-[var(--bg-elevated)] border border-[var(--accent-border)] text-[var(--text-accent)] flex items-center justify-center shadow-lg">
        <Bot className="w-5 h-5 animate-pulse" />
      </div>
      <div className="px-5 py-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--accent-border-light)] text-[var(--text-primary)]/85 rounded-tl-none animate-pulse flex gap-1 items-center">
        <span className="w-1 h-1 bg-[var(--text-accent)] rounded-full animate-bounce" />
        <span className="w-1 h-1 bg-[var(--text-accent)] rounded-full animate-bounce [animation-delay:0.2s]" />
        <span className="w-1 h-1 bg-[var(--text-accent)] rounded-full animate-bounce [animation-delay:0.4s]" />
      </div>
    </div>
  );
}

export function AIModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useScrollLock(isOpen);

  function handleEscape() {
    setIsOpen(false);
  }

  useEscapeKey(handleEscape);

  function scrollToBottomAction() {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  const scrollToBottom = useCallback(scrollToBottomAction, []);

  function loadMessagesFromStorage() {
    try {
      const saved = localStorage.getItem(CHAT_HISTORY_KEY);
      setMessages(saved ? JSON.parse(saved) : []);
    } catch {
      setMessages([]);
    }
  }

  const loadMessages = useCallback(loadMessagesFromStorage, []);

  function delayedLoadMessages() {
    loadMessages();
  }

  function handleStorageChange(event: StorageEvent) {
    if (event.key === CHAT_HISTORY_KEY) {
      loadMessages();
    }
  }

  function registerStorageListener() {
    setTimeout(delayedLoadMessages, 0);
    window.addEventListener("storage", handleStorageChange);

    return function cleanupStorageListener() {
      window.removeEventListener("storage", handleStorageChange);
    };
  }

  useEffect(registerStorageListener, [loadMessages]);

  function persistMessagesAndScroll() {
    if (messages.length > 0) {
      localStorage.setItem(CHAT_HISTORY_KEY, JSON.stringify(messages.slice(-MAX_CHAT_HISTORY)));
    }
    scrollToBottom();
  }

  useEffect(persistMessagesAndScroll, [messages, scrollToBottom]);

  async function handleSend(overrideInput?: string) {
    const textToSend = overrideInput || input;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };

    function appendUserMessage(previousMessages: Message[]) {
      return [...previousMessages, userMessage];
    }

    setMessages(appendUserMessage);
    if (!overrideInput) setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages.slice(-10), userMessage] }),
      });

      if (!response.ok) {
        let errorMessage = "Gagal menghubungi AI";
        try {
          const jsonError = await response.json();
          errorMessage = jsonError.error || errorMessage;
        } catch {
          /* ignore */
        }
        throw new Error(errorMessage);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Gagal membaca respon AI");
      const streamReader = reader;

      function appendEmptyAssistantMessage(previousMessages: Message[]): Message[] {
        return [...previousMessages, { role: "assistant", content: "" }];
      }

      setMessages(appendEmptyAssistantMessage);

      async function readStream() {
        while (true) {
          const { done, value } = await streamReader.read();
          if (done) break;
          const chunk = new TextDecoder().decode(value);

          function appendStreamChunk(previousMessages: Message[]) {
            const newMessages = [...previousMessages];
            const lastIndex = newMessages.length - 1;
            if (newMessages[lastIndex].role === "assistant") {
              newMessages[lastIndex] = {
                ...newMessages[lastIndex],
                content: newMessages[lastIndex].content + chunk,
              };
            }
            return newMessages;
          }

          setMessages(appendStreamChunk);
        }
      }

      await readStream();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Maaf, terjadi kesalahan. Silakan coba lagi nanti.";

      function appendErrorMessage(previousMessages: Message[]): Message[] {
        return [...previousMessages, { role: "assistant", content: errorMessage }];
      }

      setMessages(appendErrorMessage);
    } finally {
      setIsLoading(false);
    }
  }

  function clearChat() {
    setMessages([]);
    localStorage.removeItem(CHAT_HISTORY_KEY);
    setShowAlert(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function onQuestionSelect(question: string) {
    handleSend(question);
  }

  function sendCurrentMessage() {
    handleSend();
  }

  function showClearAlert() {
    setShowAlert(true);
  }

  function hideClearAlert() {
    setShowAlert(false);
  }

  function renderMessage(message: Message, index: number) {
    return <ChatMessage key={index} message={message} onLinkClick={closeModal} />;
  }

  return (
    <>
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={openModal}
        className="fixed bottom-6 right-6 z-[999] w-14 h-14 bg-[var(--accent)] text-[var(--text-on-accent)] rounded-full shadow-[0_8px_32px_rgba(212,140,70,0.3)] flex items-center justify-center border border-[var(--accent)]/20 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent,rgba(255,255,255,0.2),transparent)] translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        <MessageCircle className="w-7 h-7" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[var(--bg-overlay)] backdrop-blur-md"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-[800px] h-[85vh] bg-[var(--bg-secondary)] border border-[var(--accent-border)] rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-[var(--accent-border-light)] flex items-center justify-between bg-[var(--bg-secondary)]/80 backdrop-blur-sm sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center border border-[var(--accent-border)]">
                    <Bot className="w-6 h-6 text-[var(--text-accent)]" />
                  </div>
                  <div>
                    <h2 className="font-cormorant text-xl font-semibold text-[var(--text-accent)] leading-none mb-1">Ulama virtual</h2>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[0.65rem] text-[var(--text-muted)] uppercase tracking-wider">Online</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg hover:bg-[var(--accent)]/10 text-[var(--text-muted)] hover:text-[var(--text-accent)] transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-5 md:p-8 space-y-6 scrollbar-thin scrollbar-thumb-[#D48C46]/20 scrollbar-track-transparent">
                {messages.length === 0 ? (
                  <EmptyState onSelect={onQuestionSelect} />
                ) : (
                  messages.map(renderMessage)
                )}
                {isLoading && <TypingIndicator />}
                <div ref={messagesEndRef} className="h-4" />
              </div>

              <ChatInput
                input={input}
                setInput={setInput}
                onSend={sendCurrentMessage}
                isLoading={isLoading}
                hasMessages={messages.length > 0}
                onClearClick={showClearAlert}
              />

              <ConfirmPopup
                isOpen={showAlert}
                title="Hapus Percakapan?"
                message="Seluruh riwayat chat dengan asisten AI akan dihapus secara permanen."
                onConfirm={clearChat}
                onCancel={hideClearAlert}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
