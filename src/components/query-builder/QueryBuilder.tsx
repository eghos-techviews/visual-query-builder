"use client";

import { useMemo, useState, useCallback, useEffect, useRef } from "react";
import { Play, RotateCcw, Undo2, Redo2, Download, Upload, Save, Copy, Check, ChevronDown } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { validateTree } from "@/lib/validation/validate";
import { executeQuery } from "@/lib/query-engine/executor";
import { getAllUsers } from "@/lib/mock-data";
import { exportQueryJSON, importQueryJSON, saveToHistory } from "@/lib/query-history";
import { generateSQL, generateMongo } from "@/lib/query-tree/generators";
import { GroupNode } from "./GroupNode";
import { QueryPresets } from "./QueryPresets";
import { QueryHistory } from "./QueryHistory";
import { ResultsTable } from "@/components/results/ResultsTable";

export function QueryBuilder() {
  const root = useQueryStore((s) => s.root);
  const schema = useQueryStore((s) => s.schema);
  const resetTree = useQueryStore((s) => s.resetTree);
  const importTree = useQueryStore((s) => s.importTree);

  const [saveMsg, setSaveMsg] = useState("");
  const [previewTab, setPreviewTab] = useState<"sql" | "mongo">("sql");
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const allData = useMemo(() => getAllUsers() as unknown as Record<string, unknown>[], []);
  const errors = useMemo(() => validateTree(root, schema), [root, schema]);
  const results = useMemo(() => executeQuery(root, allData), [root, allData]);
  const sql = useMemo(() => generateSQL(root), [root]);
  const mongo = useMemo(() => generateMongo(root), [root]);
  const preview = previewTab === "sql" ? sql : mongo;

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        useQueryStore.temporal.getState().undo();
      }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) {
        e.preventDefault();
        useQueryStore.temporal.getState().redo();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  function handleSave() {
    const name = prompt("Give this query a name:", `Query ${new Date().toLocaleTimeString()}`);
    if (name === null) return;
    if (!name.trim()) {
      alert("Please enter a name");
      return;
    }
    saveToHistory(root, name.trim());
    setSaveMsg("✓ Saved!");
    setTimeout(() => setSaveMsg(""), 2500);
  }

  function handleCopy() {
    navigator.clipboard.writeText(preview);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      importTree(await importQueryJSON(file));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Import failed");
    }
    e.target.value = "";
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-[#0f1117]">

      {/* ── Toolbar ── */}
      <div className="flex items-center gap-2 flex-wrap px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] shrink-0">
        <button
          onClick={resetTree}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <RotateCcw size={13} />
          Reset
        </button>

        <button
          onClick={() => useQueryStore.temporal.getState().undo()}
          title="Undo ⌘Z"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <Undo2 size={13} />
        </button>

        <button
          onClick={() => useQueryStore.temporal.getState().redo()}
          title="Redo ⌘⇧Z"
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <Redo2 size={13} />
        </button>

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <Save size={13} />
          {saveMsg || "Save"}
        </button>

        <QueryPresets />
        <QueryHistory />

        <div className="w-px h-5 bg-gray-200 dark:bg-gray-700" />

        <button
          onClick={() => exportQueryJSON(root)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <Download size={13} />
          Export
        </button>

        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
        >
          <Upload size={13} />
          Import
        </button>
        <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors ml-auto"
        >
          <ChevronDown size={13} className={`transition-transform ${showPreview ? "rotate-180" : ""}`} />
          Query
        </button>

        {errors.length > 0 && (
          <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">⚠ {errors.length} issue{errors.length > 1 ? "s" : ""}</span>
        )}
      </div>

      {/* ── Query Preview (Optional) ── */}
      {showPreview && (
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] shrink-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 text-[11px]">
              {(["sql", "mongo"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setPreviewTab(t)}
                  className={`px-3 py-1.5 font-semibold uppercase tracking-wide transition-colors ${
                    previewTab === t
                      ? "bg-blue-500 text-white"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 bg-gray-50 dark:bg-gray-800"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 text-xs text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 px-2.5 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <pre className="p-3 text-xs font-mono leading-5 bg-gray-100 dark:bg-gray-900 rounded overflow-auto max-h-32 text-gray-800 dark:text-gray-200">
            {preview || "// Build a query — output appears here"}
          </pre>
        </div>
      )}

      {/* ── Query Builder Panel ── */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] shrink-0">
        <GroupNode group={root} schema={schema} errors={errors} isRoot depth={0} />
      </div>

      {/* ── Results Table (Scrollable) ── */}
      <div className="flex-1 overflow-hidden px-6 py-4">
        <ResultsTable
          results={results}
          isLoading={false}
          onExport={(data) => {
            const json = JSON.stringify(data, null, 2);
            const blob = new Blob([json], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `query-results-${new Date().toISOString()}.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
        />
      </div>
    </div>
  );
}
