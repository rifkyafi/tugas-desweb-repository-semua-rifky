"use client";

import ReactMarkdown from "react-markdown";

function CodeBlock({ node, inline, className, children, ...props }) {
  if (inline) {
    return (
      <code
        className="bg-[var(--accent-glow)] text-[var(--accent)] px-1.5 py-0.5 rounded-md text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  }

  return (
    <div className="relative my-3 rounded-xl overflow-hidden border border-[var(--border)]">
      <div className="flex items-center justify-between px-4 py-2 bg-[rgba(255,255,255,0.04)] border-b border-[var(--border)]">
        <span className="text-[10px] font-mono text-[var(--text-dim)] uppercase tracking-wider">
          code
        </span>
      </div>
      <pre className="bg-[rgba(0,0,0,0.3)] p-4 overflow-x-auto">
        <code
          className="text-sm font-mono text-[var(--text)] leading-relaxed"
          {...props}
        >
          {children}
        </code>
      </pre>
    </div>
  );
}

export default function MarkdownText({ content }) {
  return (
    <ReactMarkdown
      components={{
        code: CodeBlock,
        p: ({ children }) => (
          <p className="mb-3 last:mb-0 leading-[1.8] text-justify">{children}</p>
        ),
        strong: ({ children }) => (
          <strong className="font-semibold text-[var(--text)]">{children}</strong>
        ),
        em: ({ children }) => (
          <em className="italic">{children}</em>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 mb-3 space-y-1 marker:text-[var(--accent)]">
            {children}
          </ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 mb-3 space-y-1 marker:text-[var(--accent)]">
            {children}
          </ol>
        ),
        li: ({ children }) => (
          <li className="leading-[1.8]">{children}</li>
        ),
        h1: ({ children }) => (
          <h1 className="text-xl font-bold mt-4 mb-2 text-[var(--text)]">{children}</h1>
        ),
        h2: ({ children }) => (
          <h2 className="text-lg font-bold mt-4 mb-2 text-[var(--text)]">{children}</h2>
        ),
        h3: ({ children }) => (
          <h3 className="text-base font-bold mt-3 mb-1.5 text-[var(--text)]">{children}</h3>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-3 border-[var(--accent)] pl-4 my-3 text-[var(--text-dim)] italic bg-[var(--accent-glow)] py-2 pr-3 rounded-r-xl">
            {children}
          </blockquote>
        ),
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--accent)] underline decoration-[var(--accent)] decoration-1 underline-offset-2 hover:text-[var(--accent-bright)] transition-colors"
          >
            {children}
          </a>
        ),
        hr: () => (
          <hr className="my-4 border-t border-[var(--border)]" />
        ),
        table: ({ children }) => (
          <div className="my-3 overflow-x-auto rounded-xl border border-[var(--border)]">
            <table className="w-full text-sm border-collapse">{children}</table>
          </div>
        ),
        thead: ({ children }) => (
          <thead className="bg-[rgba(255,255,255,0.04)] border-b border-[var(--border)]">
            {children}
          </thead>
        ),
        th: ({ children }) => (
          <th className="px-4 py-2.5 text-left font-semibold text-[var(--text)] text-xs uppercase tracking-wider">
            {children}
          </th>
        ),
        td: ({ children }) => (
          <td className="px-4 py-2.5 border-t border-[var(--border)] text-[var(--text-dim)]">
            {children}
          </td>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
