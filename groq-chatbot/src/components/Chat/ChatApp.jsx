"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiCpu } from "react-icons/fi";

// ── Hooks & Services ──
import { useTheme } from "./hooks/useTheme";
import { useSystemPrompt } from "./hooks/useSystemPrompt";
import { useSuggestions } from "./hooks/useSuggestions";
import { useChatManager } from "./hooks/useChatManager";
import { useExportChat } from "@/lib/useExportChat";

// ── Sub-components ──
import SystemPromptModal from "./SystemPromptModal";
import ChatSidebar from "./ChatSidebar";
import ChatMain from "./ChatMain";

import "./ChatApp.css";

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ChatApp() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
    if (session?.user?.deleted) {
      signOut({ callbackUrl: "/login", redirect: true });
    }
  }, [status, session, router]);

  // ── Logic Hooks ──
  const [isDark, setIsDark] = useTheme();
  const {
    systemPrompt,
    showSystemModal,
    setShowSystemModal,
    showSystemBadge,
    updateSystemPrompt,
  } = useSystemPrompt();

  const { suggestions, loadingSuggestions } = useSuggestions();
  const {
    chats,
    activeChatId,
    setActiveChatId,
    activeChat,
    hydrated,
    isLoading,
    input,
    setInput,
    inputRef,
    createNewChat,
    deleteChat,
    renameChat,
    sendMessage,
    regenerateLast,
    startChatWithSuggestion,
  } = useChatManager(session?.user?.email, systemPrompt);

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { exportChat } = useExportChat();

  // ── Guard ──
  if (status === "loading" || !hydrated) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--bg)] text-[#6b6b7d] text-sm">
        <FiCpu size={36} className="text-[var(--accent)]" />
        <span className="animate-pulse">Memuat sesi...</span>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-[var(--bg)] text-[#6b6b7d] text-sm">
        <FiCpu size={36} className="text-[var(--accent)]" />
        <span>Mengarahkan ke login...</span>
      </div>
    );
  }

  return (
    <>
      {/* ── System Prompt Modal ── */}
      <SystemPromptModal
        isOpen={showSystemModal}
        onClose={() => setShowSystemModal(false)}
        value={systemPrompt}
        onChange={updateSystemPrompt}
      />

      <div
        className="flex h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]"
        suppressHydrationWarning
      >
        <ChatSidebar
          sidebarOpen={sidebarOpen}
          createNewChat={createNewChat}
          setShowSystemModal={setShowSystemModal}
          systemPrompt={systemPrompt}
          chats={chats}
          activeChatId={activeChatId}
          setActiveChatId={setActiveChatId}
          onRenameChat={renameChat}
          onDeleteChat={deleteChat}
        />

        <ChatMain
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          isDark={isDark}
          setIsDark={setIsDark}
          activeChat={activeChat}
          showSystemBadge={showSystemBadge}
          exportChat={exportChat}
          session={session}
          loadingSuggestions={loadingSuggestions}
          suggestions={suggestions}
          startChatWithSuggestion={startChatWithSuggestion}
          isLoading={isLoading}
          regenerateLast={regenerateLast}
          inputRef={inputRef}
          input={input}
          setInput={setInput}
          sendMessage={() => sendMessage()}
        />
      </div>
    </>
  );
}
