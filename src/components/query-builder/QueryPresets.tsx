"use client";

import { useState, useEffect, useRef } from "react";
import { Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import { loadHistory, HistoryEntry } from "@/lib/query-history";
import { useQueryStore } from "@/store/query-store";

export function QueryPresets() {
  const [open, setOpen] = useState(false);
  const [saved, setSaved] = useState<HistoryEntry[]>([]);
  const importTree = useQueryStore((s) => s.importTree);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setSaved(loadHistory());
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  function load(entry: HistoryEntry) {
    importTree(entry.tree);
    setOpen(false);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)]
          text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
      >
        <Sparkles size={13} />
        Presets
        {saved.length > 0 && (
          <span className="text-xs bg-[var(--primary)] text-white rounded-full px-1.5 py-0.5 leading-none">
            {saved.length}
          </span>
        )}
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 rounded-xl border border-[var(--border)]
          bg-[var(--card)] shadow-lg z-20 overflow-hidden">
          <div className="px-5 py-3 border-b border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)]">
            Your saved queries
          </div>
          {saved.length === 0 ? (
            <p className="px-5 py-6 text-xs text-[var(--muted-foreground)] text-center">
              No saved queries yet. Click Save to create one.
            </p>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {saved.map((entry) => (
                <li key={entry.id}>
                  <button
                    onClick={() => load(entry)}
                    className="w-full text-left px-5 py-3 hover:bg-[var(--muted)] transition-colors border-b border-[var(--border)] last:border-0"
                  >
                    <p className="text-sm font-medium text-[var(--foreground)]">{entry.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)] mt-1">
                      {new Date(entry.savedAt).toLocaleString()}
                    </p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
