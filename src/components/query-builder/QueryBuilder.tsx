"use client";

import { useMemo, useState, useTransition, useCallback, useEffect, useRef } from "react";
import { Play, RotateCcw, Undo2, Redo2, Download, Upload, Save } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { validateTree } from "@/lib/validation/validate";
import { executeQuery } from "@/lib/execution/execute";
import { MOCK_DATA } from "@/lib/mock-data";
import { exportQueryJSON, importQueryJSON, saveToHistory } from "@/lib/query-history";
import { GroupNode } from "./GroupNode";
import { QueryPreview } from "@/components/query-preview/QueryPreview";
import { ResultsTable } from "@/components/query-preview/ResultsTable";
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
      const r = executeQuery(root, MOCK_DATA);
      setResults(r);
      setHasRun(true);
    });
  }, [root]);

  // keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "Enter") { e.preventDefault(); if (errors.length === 0) run(); }
      if (mod && e.key === "z" && !e.shiftKey) { e.preventDefault(); useQueryStore.temporal.getState().undo(); }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); useQueryStore.temporal.getState().redo(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, errors]);

  function handleSave() {
    saveToHistory(root);
    setSaveMsg("Saved!");
    setTimeout(() => setSaveMsg(""), 1500);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const tree = await importQueryJSON(file);
      importTree(tree);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Import failed");
    }
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={run}
          disabled={errors.length > 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]
            text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          title="Run query (⌘ Enter)"
        >
          <Play size={14} fill="currentColor" /> Run Query
        </button>

        <button onClick={resetTree}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)]
            text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
          <RotateCcw size={13} /> Reset
        </button>

        <button onClick={() => useQueryStore.temporal.getState().undo()}
          className="px-3 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--muted-foreground)]
            hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors" title="Undo (⌘Z)">
          <Undo2 size={13} />
        </button>

        <button onClick={() => useQueryStore.temporal.getState().redo()}
          className="px-3 py-2 rounded-lg border border-[var(--border)] text-sm text-[var(--muted-foreground)]
            hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors" title="Redo (⌘⇧Z)">
          <Redo2 size={13} />
        </button>

        <button onClick={handleSave}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)]
            text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
          <Save size={13} /> {saveMsg || "Save"}
        </button>

        <QueryHistory />

        <button onClick={() => exportQueryJSON(root)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)]
            text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
          <Download size={13} /> Export
        </button>

        <button onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)]
            text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
          <Upload size={13} /> Import
        </button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

        {errors.length > 0 && (
          <span className="text-xs text-red-500 ml-1">{errors.length} error{errors.length > 1 ? "s" : ""}</span>
        )}

        <span className="ml-auto text-xs text-[var(--muted-foreground)] hidden sm:block">
          ⌘↵ run · ⌘Z undo · ⌘⇧Z redo
        </span>
      </div>

      <GroupNode group={root} schema={schema} errors={errors} isRoot depth={0} />

      <div className="h-64">
        <QueryPreview root={root} />
      </div>

      {hasRun && (
        <ResultsTable results={results} loading={isPending} total={MOCK_DATA.length} />
      )}
    </div>
  );
}
