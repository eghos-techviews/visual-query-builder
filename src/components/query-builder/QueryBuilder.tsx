"use client";

import { useMemo, useState, useTransition, useCallback, useEffect, useRef } from "react";
import { Play, RotateCcw, Undo2, Redo2, Download, Upload, Save, Terminal, Copy, Check } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { validateTree } from "@/lib/validation/validate";
import { executeQuery } from "@/lib/execution/execute";
import { MOCK_DATA } from "@/lib/mock-data";
import { exportQueryJSON, importQueryJSON, saveToHistory } from "@/lib/query-history";
import { generateSQL, generateMongo } from "@/lib/query-tree/generators";
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
  const [previewTab, setPreviewTab]  = useState<"sql"|"mongo">("sql");
  const [copied, setCopied]          = useState(false);
  const fileInputRef                 = useRef<HTMLInputElement>(null);

  const errors  = useMemo(() => validateTree(root, schema), [root, schema]);
  const sql     = useMemo(() => generateSQL(root), [root]);
  const mongo   = useMemo(() => generateMongo(root), [root]);
  const preview = previewTab === "sql" ? sql : mongo;

  const run = useCallback(() => {
    startTransition(() => { setResults(executeQuery(root, MOCK_DATA)); setHasRun(true); });
  }, [root]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "Enter") { e.preventDefault(); if (!errors.length) run(); }
      if (mod && e.key === "z" && !e.shiftKey) { e.preventDefault(); useQueryStore.temporal.getState().undo(); }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); useQueryStore.temporal.getState().redo(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run, errors]);

  function handleSave() {
    const name = prompt("Give this query a name:", `Query ${new Date().toLocaleTimeString()}`);
    if (name === null) return; // cancelled
    if (!name.trim()) { alert("Please enter a name"); return; }
    saveToHistory(root, name.trim());
    setSaveMsg("✓ Saved!");
    setTimeout(() => setSaveMsg(""), 2500);
  }
  function handleCopy() { navigator.clipboard.writeText(preview); setCopied(true); setTimeout(() => setCopied(false), 1500); }
  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    try { importTree(await importQueryJSON(file)); } catch (err) { alert(err instanceof Error ? err.message : "Import failed"); }
    e.target.value = "";
  }

  return (
    <div className="flex flex-col gap-4">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 flex-wrap bg-[var(--card)] border border-[var(--border)] rounded-xl px-5 py-3 shadow-sm">
        <button onClick={run} disabled={errors.length > 0}
          className="flex items-center gap-2 px-5 py-2 rounded-lg bg-[var(--primary)] text-white text-sm font-semibold hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-sm">
          <Play size={13} fill="currentColor" /> Run Query
        </button>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <Btn onClick={() => useQueryStore.temporal.getState().undo()} title="Undo ⌘Z"><Undo2 size={13} /></Btn>
        <Btn onClick={() => useQueryStore.temporal.getState().redo()} title="Redo ⌘⇧Z"><Redo2 size={13} /></Btn>
        <Btn onClick={resetTree}><RotateCcw size={13} /><span>Reset</span></Btn>

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <Btn onClick={handleSave}><Save size={13} /><span>{saveMsg || "Save"}</span></Btn>
        <QueryPresets />
        <QueryHistory />

        <div className="w-px h-5 bg-[var(--border)] mx-1" />

        <Btn onClick={() => exportQueryJSON(root)}><Download size={13} /><span>Export</span></Btn>
        <Btn onClick={() => fileInputRef.current?.click()}><Upload size={13} /><span>Import</span></Btn>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

        {errors.length > 0 && (
          <span className="text-xs text-amber-600 font-medium ml-1">⚠ {errors.length} issue{errors.length > 1 ? "s" : ""}</span>
        )}
        <span className="ml-auto text-[10px] text-[var(--muted-foreground)] hidden lg:block tracking-wide">
          ⌘↵ run · ⌘Z undo · ⌘⇧Z redo
        </span>
      </div>

      {/* ── Builder ── */}
      <GroupNode group={root} schema={schema} errors={errors} isRoot depth={0} />

      {/* ── Query Preview — dark code panel like Dribbble ref ── */}
      <div className="rounded-xl overflow-hidden border border-[var(--border)] shadow-sm">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10" style={{ background: "#1e2433" }}>
          <div className="flex items-center gap-2">
            <Terminal size={14} className="text-slate-400" />
            <span className="text-sm font-semibold text-slate-200">Query Output</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg overflow-hidden border border-white/10 text-[11px]">
              {(["sql", "mongo"] as const).map((t) => (
                <button key={t} onClick={() => setPreviewTab(t)}
                  className={`px-3 py-1.5 font-semibold uppercase tracking-wide transition-colors
                    ${previewTab === t ? "bg-[var(--primary)] text-white" : "text-slate-400 hover:text-slate-200 hover:bg-white/5"}`}>
                  {t}
                </button>
              ))}
            </div>
            <button onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 px-2.5 py-1.5 rounded-lg hover:bg-white/5 transition-colors">
              {copied ? <Check size={12} className="text-green-400" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <pre className="p-5 text-sm font-mono leading-6 overflow-auto whitespace-pre-wrap min-h-[120px]"
          style={{ background: "#1e2433", color: "#e2e8f0" }}>
          {preview || "// Build a query above — output appears here in real time"}
        </pre>
      </div>

      {/* ── Results ── */}
      {hasRun && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--panel)]">
            <div>
              <span className="text-sm font-semibold text-[var(--foreground)]">Results</span>
              {!isPending && (
                <p className="text-[11px] text-[var(--muted-foreground)] mt-0.5">
                  Query returned {results.length} of {MOCK_DATA.length} records
                </p>
              )}
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full
              ${isPending ? "bg-[var(--muted)] text-[var(--muted-foreground)]"
              : results.length === 0 ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400"
              : "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"}`}>
              {isPending ? "Running…" : `${results.length} rows`}
            </span>
          </div>

          {isPending ? (
            <div className="py-12 flex items-center justify-center gap-3 text-[var(--muted-foreground)]">
              <div className="w-4 h-4 border-2 border-[var(--primary)] border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Executing query…</span>
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-sm text-[var(--muted-foreground)]">No records match this query.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)] bg-[var(--panel)]">
                    {["Name", "Age", "Status", "Country", "Verified"].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-[var(--muted-foreground)]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {results.map((row) => (
                    <tr key={row.id} className="border-b border-[var(--border)] hover:bg-[var(--panel)] transition-colors">
                      <td className="px-5 py-3 font-medium text-[var(--foreground)]">{row.name}</td>
                      <td className="px-5 py-3 text-[var(--muted-foreground)]">{row.age}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                          ${row.status === "active" ? "bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400"
                          : row.status === "pending" ? "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-[var(--muted-foreground)]">{row.country}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold
                          ${row.verified ? "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400"
                          : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"}`}>
                          {row.verified ? "Verified" : "Unverified"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function Btn({ children, onClick, title }: { children: React.ReactNode; onClick?: () => void; title?: string }) {
  return (
    <button onClick={onClick} title={title}
      className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
      {children}
    </button>
  );
}
