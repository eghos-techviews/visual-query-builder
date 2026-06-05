"use client";

import { useState, useEffect, useRef } from "react";
import { Keyboard, X } from "lucide-react";

const SHORTCUTS = [
  { keys: ["⌘", "↵"],      label: "Run Query" },
  { keys: ["⌘", "Z"],      label: "Undo last change" },
  { keys: ["⌘", "⇧", "Z"], label: "Redo" },
  { keys: ["⌘", "S"],      label: "Save query (browser)" },
  { keys: ["Tab"],          label: "Move between fields" },
  { keys: ["Esc"],          label: "Close dropdowns" },
];

export function ShortcutsHelp() {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "?" && !["INPUT", "SELECT", "TEXTAREA"].includes((e.target as HTMLElement).tagName)) {
        setOpen((v) => !v);
      }
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onOutside);
    return () => document.removeEventListener("mousedown", onOutside);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((v) => !v)}
        title="Keyboard shortcuts (?)"
        className="flex items-center justify-center w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 transition-colors text-xs font-bold"
      >
        <Keyboard size={13} />
      </button>

      {open && (
        <div className="absolute bottom-full right-0 mb-2 w-64 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d27] shadow-xl z-50 overflow-hidden animate-fade-in">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">Keyboard shortcuts</span>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
              <X size={13} />
            </button>
          </div>
          <ul className="p-2">
            {SHORTCUTS.map((s) => (
              <li key={s.label} className="flex items-center justify-between px-2 py-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                <span className="text-xs text-gray-600 dark:text-gray-400">{s.label}</span>
                <div className="flex items-center gap-1">
                  {s.keys.map((k) => (
                    <kbd key={k} className="inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] font-semibold rounded border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 min-w-[20px]">
                      {k}
                    </kbd>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          <div className="px-4 py-2.5 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40">
            <p className="text-[10px] text-gray-400 dark:text-gray-500">Press <kbd className="px-1 py-0.5 text-[10px] rounded border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">?</kbd> to toggle this panel</p>
          </div>
        </div>
      )}
    </div>
  );
}
