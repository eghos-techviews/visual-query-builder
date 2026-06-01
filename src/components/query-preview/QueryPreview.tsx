"use client";

import { useState, useMemo } from "react";
import { Copy, Check, Code2 } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { generateSQL, generateMongo } from "@/lib/query-tree/generators";

export function QueryPreview() {
  const root = useQueryStore((s) => s.root);
  const [tab, setTab] = useState<"sql" | "mongo">("sql");
  const [copied, setCopied] = useState(false);

  const sql    = useMemo(() => generateSQL(root),   [root]);
  const mongo  = useMemo(() => generateMongo(root), [root]);
  const output = tab === "sql" ? sql : mongo;

  function copy() {
    navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="flex flex-col h-full">
      {/* header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] shrink-0">
        <div className="flex items-center gap-2">
          <Code2 size={14} className="text-[var(--muted-foreground)]" />
          <span className="text-sm font-semibold">Query Preview</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex rounded-md overflow-hidden border border-[var(--border)] text-[11px]">
            {(["sql", "mongo"] as const).map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-2.5 py-1 font-semibold uppercase tracking-wide transition-colors
                  ${tab === t ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                              : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"}`}>
                {t}
              </button>
            ))}
          </div>
          <button onClick={copy}
            className="p-1.5 rounded-md hover:bg-[var(--muted)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
            title="Copy to clipboard">
            {copied ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
          </button>
        </div>
      </div>

      {/* code output */}
      <pre className="flex-1 p-4 text-xs font-mono overflow-auto leading-relaxed whitespace-pre-wrap"
        style={{ color: "var(--foreground)", background: "var(--background)" }}>
        {output || "// build a query to see the output"}
      </pre>

      {/* footer hint */}
      <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--muted)]/40 shrink-0">
        <p className="text-[10px] text-[var(--muted-foreground)]">
          Updates live as you build · click tabs to switch format
        </p>
      </div>
    </div>
  );
}
