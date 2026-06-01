"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { GroupNode } from "@/lib/query-tree/types";
import { generateSQL, generateMongo } from "@/lib/query-tree/generators";

type Props = { root: GroupNode };

export function QueryPreview({ root }: Props) {
  const [tab, setTab] = useState<"sql" | "mongo">("sql");
  const [copied, setCopied] = useState(false);

  const sql   = useMemo(() => generateSQL(root),   [root]);
  const mongo = useMemo(() => generateMongo(root), [root]);
  const output = tab === "sql" ? sql : mongo;

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden h-full flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)]">
        <span className="text-sm font-semibold text-[var(--foreground)]">Query Preview</span>
        <div className="flex items-center gap-2">
          <div className="flex rounded-lg overflow-hidden border border-[var(--border)] text-xs">
            {(["sql", "mongo"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 font-medium transition-colors
                  ${tab === t
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-transparent text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  }`}
              >
                {t.toUpperCase()}
              </button>
            ))}
          </div>
          <button
            onClick={copy}
            className="p-1.5 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] transition-colors"
            title="Copy"
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </div>
      </div>
      <pre className="flex-1 p-4 text-xs font-mono text-[var(--foreground)] overflow-auto whitespace-pre-wrap leading-relaxed">
        {output}
      </pre>
    </div>
  );
}
