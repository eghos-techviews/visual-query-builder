"use client";

import { useState, useEffect } from "react";
import { Clock, Trash2, RotateCcw, ChevronDown, ChevronRight } from "lucide-react";
import { HistoryEntry, loadHistory, deleteFromHistory } from "@/lib/query-history";
import { useQueryStore } from "@/store/query-store";

export function QueryHistory() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const importTree = useQueryStore((s) => s.importTree);

  useEffect(() => {
    setHistory(loadHistory());
  }, [open]);

  function restore(entry: HistoryEntry) {
    importTree(entry.tree);
    setOpen(false);
  }

  function remove(id: string) {
    setHistory(deleteFromHistory(id));
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)]
          text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
      >
        <Clock size={13} />
        History
        {history.length > 0 && (
          <span className="text-xs bg-[var(--primary)] text-[var(--primary-foreground)] rounded-full px-1.5 py-0.5 leading-none">
            {history.length}
          </span>
        )}
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-72 rounded-xl border border-[var(--border)]
          bg-[var(--card)] shadow-lg z-20 overflow-hidden">
          <div className="px-3 py-2 border-b border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)]">
            Saved queries
          </div>
          {history.length === 0 ? (
            <p className="px-4 py-6 text-xs text-[var(--muted-foreground)] text-center">
              No saved queries yet. Save one from the toolbar.
            </p>
          ) : (
            <ul className="max-h-64 overflow-y-auto">
              {history.map((entry) => (
                <li key={entry.id} className="flex items-center gap-2 px-3 py-2.5 hover:bg-[var(--muted)] group border-b border-[var(--border)] last:border-0">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{entry.label}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {new Date(entry.savedAt).toLocaleString()}
                    </p>
                  </div>
                  <button onClick={() => restore(entry)} title="Restore" className="text-[var(--primary)] hover:opacity-70">
                    <RotateCcw size={13} />
                  </button>
                  <button onClick={() => remove(entry.id)} title="Delete" className="text-[var(--muted-foreground)] hover:text-red-500">
                    <Trash2 size={13} />
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
