"use client";

import { useState, useRef, useEffect } from "react";
import { signOut } from "next-auth/react";
import { useCopyToClipboard } from "@/lib/useCopyToClipboard";
import { getInitials, getAvatarColor } from "@/lib/getInitials";
import MarkdownText from "./MarkdownText";
import {
  FiChevronLeft,
  FiChevronRight,
  FiCheck,
  FiDownload,
  FiSun,
  FiMoon,
  FiChevronUp,
  FiChevronDown,
  FiLogOut,
  FiCpu,
  FiZap,
  FiUser,
  FiCopy,
  FiRefreshCw,
  FiSend,
  FiFileText,
  FiFile,
  FiDatabase,
} from "react-icons/fi";

function formatTime(ts) {
  return new Date(ts).toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function SkeletonCard() {
  return (
    <div className="bg-[var(--ai-bg)] border border-[var(--border)] rounded-3xl p-3">
      <span className="block h-[11px] rounded w-[55%] mb-2 bg-gradient-to-r from-[rgba(234,234,234,0.08)] via-[rgba(234,234,234,0.14)] to-[rgba(234,234,234,0.08)] bg-[length:200%_100%] animate-shimmer" />
      <span className="block h-[11px] rounded w-[85%] bg-gradient-to-r from-[rgba(234,234,234,0.08)] via-[rgba(234,234,234,0.14)] to-[rgba(234,234,234,0.08)] bg-[length:200%_100%] animate-shimmer" />
    </div>
  );
}

function TypingDot() {
  return (
    <span className="inline-flex gap-1 items-center py-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] animate-blink"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </span>
  );
}

function ExportMenu({ onExport }) {
  const [open, setOpen] = useState(false);

  const formats = [
    { id: "markdown", label: "Markdown (.md)", desc: "Notion, Obsidian", icon: <FiFileText size={12} /> },
    { id: "txt", label: "Plain Text (.txt)", desc: "Paling universal", icon: <FiFile size={12} /> },
    { id: "json", label: "JSON (.json)", desc: "Backup / developer", icon: <FiDatabase size={12} /> },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="Export chat"
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-2xl text-xs text-[var(--text-dim)] border border-[var(--border)] bg-[var(--ai-bg)] hover:border-[var(--border-bright)] hover:text-[var(--text)] transition-all"
      >
        <FiDownload size={14} /> Export
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-[9]" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+6px)] right-0 w-52 bg-[var(--surface)] border border-[var(--border)] rounded-3xl z-10 overflow-hidden shadow-[0_24px_40px_rgba(0,0,0,0.24)] animate-dropIn">
            <p className="text-[9px] font-semibold text-[var(--text-dim)] uppercase tracking-widest px-3 pt-3 pb-1">
              Pilih format
            </p>
            {formats.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  onExport(f.id);
                  setOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-[var(--surface2)] transition-colors border-none bg-transparent cursor-pointer"
              >
                <span className="text-[var(--text-dim)]">{f.icon}</span>
                <div className="flex-1">
                  <span className="text-[12px] text-[var(--text)] block">
                    {f.label}
                  </span>
                  <span className="text-[10px] text-[var(--text-muted)]">
                    {f.desc}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default function ChatMain({
  sidebarOpen,
  setSidebarOpen,
  isDark,
  setIsDark,
  activeChat,
  showSystemBadge,
  exportChat,
  session,
  loadingSuggestions,
  suggestions,
  startChatWithSuggestion,
  isLoading,
  regenerateLast,
  inputRef,
  input,
  setInput,
  sendMessage,
}) {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { copiedId, copy } = useCopyToClipboard();
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages]);

  const isLastMsgAI =
    activeChat?.messages?.length > 0 &&
    activeChat.messages[activeChat.messages.length - 1].role === "assistant" &&
    activeChat.messages[activeChat.messages.length - 1].content !== "";

  return (
    <main className="flex flex-col flex-1 overflow-hidden bg-[var(--bg)]">
      {/* Topbar */}
      <div className="h-[56px] flex items-center gap-3 px-[22px] border-b border-[var(--border)] flex-shrink-0 bg-[var(--bg)] backdrop-blur-md">
        <button
          onClick={() => setSidebarOpen((s) => !s)}
          title="Toggle sidebar"
          className="w-8 h-8 flex items-center justify-center rounded-2xl border border-[var(--border)] text-[var(--text-dim)] text-sm cursor-pointer flex-shrink-0 bg-[var(--ai-bg)] transition-all hover:text-[var(--text)] hover:border-[var(--border-bright)]"
        >
          {sidebarOpen ? <FiChevronLeft size={14} /> : <FiChevronRight size={14} />}
        </button>

        <div
          className="flex-1 text-[15px] font-medium whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            color: !activeChat ? "var(--text-dim)" : "var(--text)",
            fontStyle: !activeChat ? "italic" : "normal",
          }}
        >
          {activeChat ? activeChat.title : "Pilih atau buat chat baru"}
        </div>

        {showSystemBadge && (
          <span
            className="text-[11px] font-mono text-[var(--accent)] bg-[var(--surface2)] border border-[var(--border)] rounded-full px-3 py-0.5 whitespace-nowrap flex items-center gap-1"
            style={{ animation: "slideIn 0.2s ease" }}
          >
            <FiCheck size={10} /> System prompt tersimpan
          </span>
        )}

        {activeChat && activeChat.messages.length > 0 && (
          <ExportMenu onExport={(format) => exportChat(activeChat, format)} />
        )}

        <span className="font-mono text-[11px] text-[var(--text-dim)] bg-[var(--ai-bg)] border border-[var(--border)] rounded-full px-3 py-0.5 whitespace-nowrap flex-shrink-0">
          llama-3.3-70b
        </span>

        <button
          onClick={() => setIsDark(!isDark)}
          className="w-8 h-8 flex items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-dim)] text-sm cursor-pointer flex-shrink-0 bg-transparent transition-all hover:text-[var(--text)] hover:border-[var(--border-bright)] hover:scale-110"
          title="Toggle theme"
        >
          {isDark ? <FiSun size={14} /> : <FiMoon size={14} />}
        </button>

        {/* User menu */}
        <div className="relative flex-shrink-0">
          <button
            onClick={() => setShowUserMenu((v) => !v)}
            className="flex items-center gap-2 bg-[var(--ai-bg)] border border-[var(--border)] rounded-2xl pl-[5px] pr-2.5 py-1 cursor-pointer transition-all hover:border-[var(--border-bright)] hover:bg-[var(--surface2)]"
          >
            <div
              className={`w-[30px] h-[30px] rounded-full flex items-center justify-center text-[11px] font-bold text-white bg-gradient-to-br ${getAvatarColor(session?.user?.name)}`}
            >
              {getInitials(session?.user?.name)}
            </div>
            <span className="text-sm text-[var(--text-dim)] whitespace-nowrap max-w-[90px] overflow-hidden text-ellipsis">
              {session?.user?.name?.split(" ")[0]}
            </span>
            <span className="text-[10px] text-[var(--text-dim)]">
              {showUserMenu ? <FiChevronUp size={10} /> : <FiChevronDown size={10} />}
            </span>
          </button>

          {showUserMenu && (
            <>
              <div
                className="fixed inset-0 z-[9]"
                onClick={() => setShowUserMenu(false)}
              />
              <div className="animate-dropIn absolute top-[calc(100%+8px)] right-0 w-60 bg-[var(--surface)] border border-[var(--border)] rounded-3xl overflow-hidden z-10 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
                <div className="flex items-center gap-3 p-4">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-white bg-gradient-to-br ${getAvatarColor(session?.user?.name)} flex-shrink-0`}
                  >
                    {getInitials(session?.user?.name)}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[var(--text)]">
                      {session?.user?.name}
                    </div>
                    <div className="text-xs text-[var(--text-dim)] mt-0.5 break-all">
                      {session?.user?.email}
                    </div>
                  </div>
                </div>
                <div className="h-px bg-[var(--border)]" />
                <button
                  onClick={() => {
                    setShowUserMenu(false);
                    signOut({ callbackUrl: "/login" });
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-3 bg-transparent border-none text-sm text-[var(--text-dim)] cursor-pointer text-left transition-all hover:bg-[rgba(251,113,133,0.1)] hover:text-[var(--danger)]"
                >
                  <FiLogOut size={14} /> Keluar
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto pt-6 pb-2 thin-scroll">
        {!activeChat ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 px-10 text-center">
            <div className="w-14 h-14 bg-[var(--surface2)] border border-[var(--border)] rounded-3xl flex items-center justify-center text-[var(--accent)]">
              <FiCpu size={26} />
            </div>
            <div className="text-[24px] font-semibold text-[var(--text)] tracking-tight">
              Halo! Apa yang bisa dibantu?
            </div>
            <div className="text-[15px] text-[var(--text-dim)] max-w-[320px] leading-relaxed">
              Mulai percakapan baru atau pilih chat dari sidebar.
            </div>
            <div className="grid grid-cols-2 gap-2.5 max-w-[480px] w-full">
              {loadingSuggestions
                ? [0, 1, 2, 3].map((i) => <SkeletonCard key={i} />)
                : suggestions.map((sg) => (
                    <button
                      key={sg.s}
                      onClick={() => startChatWithSuggestion(sg.s)}
                      disabled={isLoading}
                      className="bg-[var(--ai-bg)] border border-[var(--border)] rounded-3xl p-3 cursor-pointer text-left transition-all hover:border-[var(--border-bright)] hover:bg-[var(--surface2)] disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <p className="text-[13px] text-[var(--text-dim)] m-0">
                        {sg.p}
                      </p>
                      <span className="text-xs text-[var(--text)] mt-1 block">
                        {sg.s}
                      </span>
                    </button>
                  ))}
            </div>
          </div>
        ) : activeChat.messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center gap-5 px-10 text-center">
            <div className="w-14 h-14 bg-[var(--surface2)] border border-[var(--border)] rounded-3xl flex items-center justify-center text-[var(--accent)]">
              <FiZap size={26} />
            </div>
            <div className="text-[24px] font-semibold text-[var(--text)] tracking-tight">
              Chat baru siap!
            </div>
            <div className="text-[15px] text-[var(--text-dim)] max-w-[320px] leading-relaxed">
              Tulis pesan pertamamu di bawah untuk memulai.
            </div>
          </div>
        ) : (
          <>
            {activeChat.messages.map((msg) => (
              <div
                key={msg.id}
                className="animate-msg-in max-w-[760px] mx-auto px-6 py-1.5 group"
              >
                <div
                  className={`flex gap-3 items-start ${
                    msg.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className="w-[34px] h-[34px] rounded-xl flex items-center justify-center text-sm flex-shrink-0 mt-0.5"
                    style={{
                      background:
                        msg.role === "user" ? "var(--user-bg)" : "var(--ai-bg)",
                      border:
                        msg.role === "user"
                          ? "1px solid var(--border-bright)"
                          : "1px solid var(--border)",
                    }}
                  >
                    {msg.role === "user" ? <FiUser size={16} /> : <FiCpu size={16} />}
                  </div>

                  <div className={`flex-1 min-w-0 ${msg.role === "user" ? "text-right" : ""}`}>
                    <div className="flex items-center justify-end gap-2 mb-1.5 text-xs text-[var(--text-dim)]">
                      <span className="font-semibold text-[var(--text)]">
                        {msg.role === "user" ? "Kamu" : "Asisten"}
                      </span>
                      <span>{formatTime(msg.ts)}</span>

                      {msg.content && (
                        <button
                          onClick={() => copy(msg.content, msg.id)}
                          title="Copy pesan"
                          className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-md border border-[var(--border)] bg-[var(--ai-bg)] hover:border-[var(--border-bright)] hover:text-[var(--accent)] text-[var(--text-dim)]"
                        >
                          {copiedId === msg.id ? (
                            <><FiCheck size={10} /> Tersalin</>
                          ) : (
                            <><FiCopy size={10} /> Copy</>
                          )}
                        </button>
                      )}
                    </div>

                    {msg.role === "user" ? (
                      <div className="inline-block max-w-full bg-[var(--user-bg)] border border-[var(--border)] rounded-[14px] px-5 py-3.5 text-[15px] leading-[1.8] text-[var(--text)] whitespace-pre-wrap break-words shadow-[0_8px_20px_rgba(0,0,0,0.08)]">
                        {msg.content}
                      </div>
                    ) : (
                      <div className="inline-block max-w-full bg-[var(--ai-bg)] border border-[var(--border)] rounded-[14px] px-5 py-3.5 text-[15px] leading-[1.8] text-[var(--text)] break-words shadow-[0_8px_20px_rgba(0,0,0,0.06)]">
                        {msg.content === "" ? <TypingDot /> : <MarkdownText content={msg.content} />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {isLastMsgAI && !isLoading && (
              <div className="max-w-[760px] mx-auto px-5 py-2 flex items-center gap-3">
                <div className="h-px flex-1 bg-[var(--border-bright)]" />
                <button
                  onClick={regenerateLast}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs text-[var(--text-dim)] border border-[var(--border)] bg-[var(--ai-bg)] hover:border-[var(--border-bright)] hover:text-[var(--text)] transition-all"
                  title="Minta jawaban baru"
                >
                  <FiRefreshCw size={14} /> Regenerate
                </button>
                <div className="h-px flex-1 bg-[var(--border-bright)]" />
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="px-8 pt-4 pb-5 border-t border-[var(--border)] bg-[var(--bg)] flex-shrink-0 backdrop-blur-md">
        <div className="max-w-[760px] mx-auto flex gap-2.5 bg-[var(--ai-bg)] border border-[var(--border)] rounded-[20px] px-4 py-3 transition-all focus-within:border-[var(--border-bright)] focus-within:shadow-[0_0_0_3px_var(--accent-glow)]">
          <textarea
            ref={inputRef}
            rows={1}
            placeholder="Ketik pesan... (Enter kirim, Shift+Enter baris baru)"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = "auto";
              e.target.style.height =
                Math.min(e.target.scrollHeight, 160) + "px";
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 bg-transparent border-none outline-none text-[var(--text)] text-[15px] leading-relaxed resize-none min-h-[26px] max-h-[160px] py-0.5 placeholder-[var(--text-dim)]"
          />
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || isLoading}
            title="Kirim"
            className="w-10 h-10 bg-[var(--accent)] rounded-2xl text-[var(--bg)] flex items-center justify-center self-end flex-shrink-0 border-none transition-all hover:scale-105 disabled:opacity-45 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="w-4 h-4 border-2 border-[var(--bg)] border-t-transparent rounded-full animate-spin" />
            ) : (
              <FiSend size={16} />
            )}
          </button>
        </div>
        <div className="max-w-[760px] mx-auto mt-2 text-center text-xs text-[var(--text-dim)]">
          Powered by Groq · llama-3.3-70b-versatile · Free tier
        </div>
      </div>
    </main>
  );
}
