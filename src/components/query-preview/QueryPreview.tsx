"use client";

import { useState, useMemo } from "react";
import { Copy, Check } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { generateSQL, generateMongo } from "@/lib/query-tree/generators";

export function QueryPreview() {
  const root  = useQueryStore((s) => s.root);
  const [tab, setTab]       = useState<"sql" | "mongo">("sql");
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
    <div className="flex flex-col h-full overflow-hidden">

      {/* sidebar header — matches SchemaEditor */}
      <div className="px-5 py-4 border-b border-[var(--border)] shrink-0">
        <p className="text-[10px] uppercase tracking-widest font-semibold text-[var(--muted-foreground)] mb-1">Output</p>
        <h2 className="text-sm font-bold text-[var(--foreground)]">Query Preview</h2>
        <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">updates live as you build</p>
      </div>

      {/* tab bar */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] shrink-0">
        <div className="flex rounded-lg overflow-hidden border border-[var(--border)] text-[11px]">
          {(["sql", "mongo"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-3 py-1.5 font-semibold uppercase tracking-wide transition-colors
                ${tab === t
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"}`}>
              {t}
            </button>
          ))}
        </div>
        <button onClick={copy}
          className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] px-2.5 py-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors">
          {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>

      {/* code output */}
      <pre className="flex-1 overflow-auto p-5 text-xs font-mono leading-relaxed whitespace-pre-wrap text-[var(--foreground)]"
        style={{ background: "var(--background)" }}>
        {output || "// build a query above\n// to see the output here"}
      </pre>

      {/* footer */}
      <div className="px-5 py-3 border-t border-[var(--border)] shrink-0 bg-[var(--muted)]/30">
        <p className="text-[10px] text-[var(--muted-foreground)]">
          Switch between SQL and Mongo formats above
        </p>
      </div>

    </div>
  );
}
