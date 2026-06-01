"use client";

import { useMemo, useState, useTransition, useCallback, useEffect, useRef } from "react";
import { Play, RotateCcw, Undo2, Redo2, Download, Upload, Save, AlertCircle } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { validateTree } from "@/lib/validation/validate";
import { executeQuery } from "@/lib/execution/execute";
import { MOCK_DATA } from "@/lib/mock-data";
import { exportQueryJSON, importQueryJSON, saveToHistory } from "@/lib/query-history";
import { GroupNode } from "./GroupNode";
import { QueryPresets } from "./QueryPresets";
import { QueryHistory } from "./QueryHistory";

export function QueryBuilder() {
  const root       = useQueryStore((s) => s.root);
  const schema     = useQueryStore((s) => s.schema);
  const resetTree  = useQueryStore((s) => s.resetTree);
  const importTree = useQueryStore((s) => s.importTree);

  const [results, setResults]        = useState(MOCK_DATA);
  const [hasRun, setHasRun]          = useState(false);
  const [isPending, startTransition] = useTransition();
  const [saveMsg, setSaveMsg]        = useState("");
  const fileInputRef                 = useRef<HTMLInputElement>(null);

  const errors = useMemo(() => validateTree(root, schema), [root, schema]);

  const run = useCallback(() => {
    startTransition(() => {
      setResults(executeQuery(root, MOCK_DATA));
      setHasRun(true);
    });
  }, [root]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "Enter")                         { e.preventDefault(); if (!errors.length) run(); }
      if (mod && e.key === "z" && !e.shiftKey)             { e.preventDefault(); useQueryStore.temporal.getState().undo(); }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); useQueryStore.temporal.getState().redo(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, errors]);

  function handleSave() {
    saveToHistory(root);
    setSaveMsg("Saved!");
    setTimeout(() => setSaveMsg(""), 2000);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try { importTree(await importQueryJSON(file)); }
    catch (err) { alert(err instanceof Error ? err.message : "Import failed"); }
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-4 h-full">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 flex-wrap bg-[var(--card)] border border-[var(--border)] rounded-xl px-3 py-2 shadow-sm">

        <button onClick={run} disabled={errors.length > 0}
          className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]
            text-sm font-semibold hover:opacity-90 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
          title="Run query (⌘ Enter)">
          <Play size={13} fill="currentColor" /> Run Query
        </button>

        <div className="w-px h-5 bg-[var(--border)]" />

        <ToolBtn onClick={() => useQueryStore.temporal.getState().undo()} title="Undo (⌘Z)"><Undo2 size={13} /></ToolBtn>
        <ToolBtn onClick={() => useQueryStore.temporal.getState().redo()} title="Redo (⌘⇧Z)"><Redo2 size={13} /></ToolBtn>
        <ToolBtn onClick={resetTree}><RotateCcw size={13} /><span>Reset</span></ToolBtn>

        <div className="w-px h-5 bg-[var(--border)]" />

        <ToolBtn onClick={handleSave}><Save size={13} /><span>{saveMsg || "Save"}</span></ToolBtn>
        <QueryPresets />
        <QueryHistory />

        <div className="w-px h-5 bg-[var(--border)]" />

        <ToolBtn onClick={() => exportQueryJSON(root)}><Download size={13} /><span>Export</span></ToolBtn>
        <ToolBtn onClick={() => fileInputRef.current?.click()}><Upload size={13} /><span>Import</span></ToolBtn>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

        {errors.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 ml-1">
            <AlertCircle size={12} />
            <span>{errors.length} issue{errors.length > 1 ? "s" : ""}</span>
          </div>
        )}

        <span className="ml-auto text-[10px] text-[var(--muted-foreground)] hidden lg:block tracking-wide">
          ⌘↵ run &nbsp;·&nbsp; ⌘Z undo &nbsp;·&nbsp; ⌘⇧Z redo
        </span>
      </div>

      {/* ── Builder tree ── */}
      <GroupNode group={root} schema={schema} errors={errors} isRoot depth={0} />

      {/* ── Results (shown after run) ── */}
      {hasRun && (
        <ResultsSection results={results} loading={isPending} total={MOCK_DATA.length} />
      )}
    </div>
  );
}

/* ── Tiny helper components ── */

function ToolBtn({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title}
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs text-[var(--muted-foreground)]
        hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors font-medium">
      {children}
    </button>
  );
}

function ResultsSection({ results, loading, total }: { results: ReturnType<typeof executeQuery>; loading: boolean; total: number }) {
  const COLS = ["name", "age", "status", "country", "verified"] as const;
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)] bg-[var(--muted)]/40">
        <span className="text-sm font-semibold text-[var(--foreground)]">Results</span>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium
          ${loading ? "text-[var(--muted-foreground)]" : results.length === 0
            ? "bg-red-50 text-red-600 dark:bg-red-950/30 dark:text-red-400"
            : "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"}`}>
          {loading ? "running…" : `${results.length} / ${total} records`}
        </span>
      </div>

      {loading ? (
        <div className="py-12 flex items-center justify-center gap-2 text-sm text-[var(--muted-foreground)]">
          <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
          Executing query…
        </div>
      ) : results.length === 0 ? (
        <div className="py-12 text-center text-sm text-[var(--muted-foreground)]">
          No records match this query.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)]">
                {COLS.map((c) => (
                  <th key={c} className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--muted-foreground)]">
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)]/40 transition-colors">
                  <td className="px-4 py-2.5 font-medium">{row.name}</td>
                  <td className="px-4 py-2.5 text-[var(--muted-foreground)]">{row.age}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${row.status === "active"  ? "bg-green-50  text-green-700  dark:bg-green-950/30  dark:text-green-400"
                      : row.status === "pending" ? "bg-amber-50  text-amber-700  dark:bg-amber-950/30  dark:text-amber-400"
                      :                           "bg-gray-100   text-gray-600   dark:bg-gray-800     dark:text-gray-400"}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-[var(--muted-foreground)]">{row.country}</td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${row.verified ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
                                    : "bg-gray-100  text-gray-500 dark:bg-gray-800    dark:text-gray-400"}`}>
                      {row.verified ? "verified" : "unverified"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
