"use client";

import { useState } from "react";
import { Sparkles, ChevronDown, ChevronRight } from "lucide-react";
import { PRESETS } from "@/lib/presets";
import { useQueryStore } from "@/store/query-store";

export function QueryPresets() {
  const [open, setOpen] = useState(false);
  const importTree = useQueryStore((s) => s.importTree);

  function load(presetId: string) {
    const preset = PRESETS.find((p) => p.id === presetId);
    if (!preset) return;
    importTree(preset.tree);
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)]
          text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
      >
        <Sparkles size={13} />
        Presets
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-64 rounded-xl border border-[var(--border)]
          bg-[var(--card)] shadow-lg z-20 overflow-hidden">
          <div className="px-3 py-2 border-b border-[var(--border)] text-xs font-semibold text-[var(--muted-foreground)]">
            Sample queries
          </div>
          <ul>
            {PRESETS.map((preset) => (
              <li key={preset.id}>
                <button
                  onClick={() => load(preset.id)}
                  className="w-full text-left px-3 py-2.5 hover:bg-[var(--muted)] transition-colors border-b border-[var(--border)] last:border-0"
                >
                  <p className="text-sm font-medium text-[var(--foreground)]">{preset.label}</p>
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{preset.description}</p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
