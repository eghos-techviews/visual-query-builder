"use client";

import { useMemo, useRef, useState, useEffect, useCallback } from "react";
import {
  Play, RotateCcw, Undo2, Redo2, Download, Upload, Save,
  Copy, Check, ChevronDown, ChevronRight, Database, Code2,
  Sparkles, Trash2, ChevronUp, AlertTriangle,
} from "lucide-react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ResultsTable } from "@/components/results/ResultsTable";
import { GroupNode } from "@/components/query-builder/GroupNode";
import { ShortcutsHelp } from "@/components/workspace/ShortcutsHelp";
import { useQueryStore, switchSchema } from "@/store/query-store";
import { validateTree } from "@/lib/validation/validate";
import { executeQuery } from "@/lib/query-engine/executor";
import { SCHEMA_REGISTRY, getSchemaConfig } from "@/lib/schema/schemas";
import { generateSQL, generateMongo, generateGraphQL } from "@/lib/query-tree/generators";
import {
  exportQueryJSON,
  importQueryJSON,
  saveToHistory,
  loadHistory,
  deleteFromHistory,
  HistoryEntry,
} from "@/lib/query-history";
import Link from "next/link";

interface WorkspaceClientProps {
  workspaceId: string;
  initialSchemaId?: string;
  workspaceName?: string;
}

type OutputTab = "sql" | "mongo" | "gql";

export function WorkspaceClient({ workspaceId, initialSchemaId, workspaceName = "Workspace" }: WorkspaceClientProps) {
  const root           = useQueryStore((s) => s.root);
  const schema         = useQueryStore((s) => s.schema);
  const activeSchemaId = useQueryStore((s) => s.activeSchemaId);
  const resetTree      = useQueryStore((s) => s.resetTree);
  const importTree     = useQueryStore((s) => s.importTree);

  const [schemaOpen, setSchemaOpen]     = useState(false);
  const [outputTab, setOutputTab]       = useState<OutputTab>("sql");
  const [copied, setCopied]             = useState(false);
  const [showResults, setShowResults]   = useState(false);
  const [isRunning, setIsRunning]       = useState(false);
  const [saveMsg, setSaveMsg]           = useState("");
  const [savedPresets, setSavedPresets] = useState<HistoryEntry[]>([]);
  const [results, setResults]           = useState<Record<string, unknown>[]>([]);

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const schemaDropRef = useRef<HTMLDivElement>(null);

  // Auto-select schema when navigating to a schema-specific workspace URL
  useEffect(() => {
    if (initialSchemaId && initialSchemaId !== activeSchemaId) {
      switchSchema(initialSchemaId);
    }
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeConfig = useMemo(() => getSchemaConfig(activeSchemaId), [activeSchemaId]);
  const errors       = useMemo(() => validateTree(root, schema), [root, schema]);
  const sql          = useMemo(() => generateSQL(root, activeConfig.tableName), [root, activeConfig]);
  const mongo        = useMemo(() => generateMongo(root), [root]);
  const gql          = useMemo(() => generateGraphQL(root, activeConfig.tableName), [root, activeConfig]);

  const outputCode = outputTab === "sql" ? sql : outputTab === "mongo" ? mongo : gql;


  // Load presets on mount
  useEffect(() => {
    setSavedPresets(loadHistory());
  }, []);

  // Close schema dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (schemaDropRef.current && !schemaDropRef.current.contains(e.target as Node)) {
        setSchemaOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key === "z" && !e.shiftKey) { e.preventDefault(); useQueryStore.temporal.getState().undo(); }
      if (mod && (e.key === "y" || (e.key === "z" && e.shiftKey))) { e.preventDefault(); useQueryStore.temporal.getState().redo(); }
      if (mod && e.key === "Enter") { e.preventDefault(); handleRunQuery(); }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [root, activeConfig]);

  const handleRunQuery = useCallback(() => {
    if (errors.length > 0) return;
    setIsRunning(true);
    setTimeout(() => {
      const data = activeConfig.getData();
      setResults(executeQuery(root, data));
      setShowResults(true);
      setIsRunning(false);
    }, 120);
  }, [errors.length, activeConfig, root]);

  const handleSchemaSelect = useCallback((id: string) => {
    switchSchema(id);
    setSchemaOpen(false);
    setShowResults(false);
    setResults([]);
  }, []);

  const handleCopyOutput = useCallback(() => {
    navigator.clipboard.writeText(outputCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [outputCode]);

  const handleSave = useCallback(() => {
    const name = prompt("Give this query a name:", `Query ${new Date().toLocaleTimeString()}`);
    if (!name?.trim()) return;
    saveToHistory(root, name.trim());
    setSavedPresets(loadHistory());
    setSaveMsg("Saved!");
    setTimeout(() => setSaveMsg(""), 2000);
  }, [root]);

  const handleDeletePreset = useCallback((id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFromHistory(id);
    setSavedPresets(loadHistory());
  }, []);

  const handleLoadPreset = useCallback((entry: HistoryEntry) => {
    importTree(entry.tree);
    setShowResults(false);
    setResults([]);
  }, [importTree]);

  const handleImport = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      importTree(await importQueryJSON(file));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Import failed");
    }
    e.target.value = "";
  }, [importTree]);

  return (
    <div className="h-screen bg-white dark:bg-[#0f1117] flex flex-col overflow-hidden">

      {/* ── Header ── */}
      <header className="shrink-0 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27]">
        <div className="flex items-center justify-between px-5 py-2.5">

          {/* Left: Logo + breadcrumb + schema picker */}
          <div className="flex items-center gap-2.5">
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors">
              <svg width="26" height="26" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#3b82f6" />
                <path d="M8 10L16 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{workspaceName}</span>
            <ChevronRight size={14} className="text-gray-300 dark:text-gray-600" />

            {/* Schema picker */}
            <div className="relative" ref={schemaDropRef}>
              <button
                onClick={() => setSchemaOpen((v) => !v)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1117] text-sm font-medium text-gray-800 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <Database size={13} className="text-blue-500" />
                {activeConfig.label}
                <ChevronDown size={13} className={`text-gray-400 transition-transform ${schemaOpen ? "rotate-180" : ""}`} />
              </button>

              {schemaOpen && (
                <div className="absolute top-full left-0 mt-1 w-60 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d27] shadow-xl z-50 overflow-hidden">
                  {SCHEMA_REGISTRY.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSchemaSelect(s.id)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Database size={13} className="mt-0.5 text-blue-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.label}</span>
                          {s.id === activeSchemaId && <Check size={12} className="text-blue-500" />}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{s.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right: actions */}
          <div className="flex items-center gap-2">
            {errors.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400 font-medium px-2 py-1 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <AlertTriangle size={12} />
                {errors.length} issue{errors.length !== 1 ? "s" : ""}
              </span>
            )}
            <button
              onClick={handleRunQuery}
              disabled={isRunning || errors.length > 0}
              title="Run Query (⌘↵)"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-lg transition-colors"
            >
              <Play size={13} className={isRunning ? "animate-pulse" : ""} />
              {isRunning ? "Running…" : "Run Query"}
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* ── 3-column body ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ── LEFT: Schema fields + Presets ── */}
        <aside className="w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] flex flex-col overflow-hidden">

          {/* Fields */}
          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
              Fields
            </p>
            <div className="space-y-0.5">
              {schema.map((field) => (
                <div
                  key={field.name}
                  className="flex items-center justify-between px-2.5 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-default"
                >
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{field.label}</span>
                  <TypeBadge type={field.type} />
                </div>
              ))}
            </div>
          </div>

          {/* Presets */}
          <div className="border-t border-gray-100 dark:border-gray-800 shrink-0">
            <div className="flex items-center justify-between px-3 py-2.5">
              <div className="flex items-center gap-1.5">
                <Sparkles size={12} className="text-amber-500" />
                <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest">
                  Saved Queries
                </p>
              </div>
              {savedPresets.length > 0 && (
                <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-full">
                  {savedPresets.length}
                </span>
              )}
            </div>

            <div className="max-h-44 overflow-y-auto">
              {savedPresets.length === 0 ? (
                <p className="px-3 pb-3 text-[11px] text-gray-400 dark:text-gray-500 text-center">
                  Save a query to see it here
                </p>
              ) : (
                <ul className="space-y-0.5 px-2 pb-2">
                  {savedPresets.map((entry) => (
                    <li key={entry.id}>
                      <button
                        onClick={() => handleLoadPreset(entry)}
                        className="w-full flex items-start justify-between gap-1 px-2 py-1.5 rounded-md text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors group"
                      >
                        <div className="min-w-0">
                          <p className="text-xs font-medium text-gray-700 dark:text-gray-300 truncate">{entry.label}</p>
                          <p className="text-[10px] text-gray-400 dark:text-gray-500 mt-0.5">
                            {new Date(entry.savedAt).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => handleDeletePreset(entry.id, e)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded text-gray-400 hover:text-red-500 transition"
                        >
                          <Trash2 size={11} />
                        </button>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </aside>

        {/* ── CENTER: Toolbar + Builder + Results ── */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0f1117]">

          {/* Toolbar */}
          <div className="shrink-0 flex items-center gap-1 px-4 py-2 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] flex-wrap">
            <ToolbarBtn onClick={resetTree} icon={<RotateCcw size={13} />} label="Reset" />
            <ToolbarBtn onClick={() => useQueryStore.temporal.getState().undo()} icon={<Undo2 size={13} />} title="Undo ⌘Z" />
            <ToolbarBtn onClick={() => useQueryStore.temporal.getState().redo()} icon={<Redo2 size={13} />} title="Redo ⌘⇧Z" />

            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

            <ToolbarBtn
              onClick={handleSave}
              icon={<Save size={13} />}
              label={saveMsg || "Save"}
              className={saveMsg ? "text-green-600 dark:text-green-400" : ""}
            />

            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />

            <ToolbarBtn onClick={() => exportQueryJSON(root)} icon={<Download size={13} />} label="Export" />
            <ToolbarBtn onClick={() => fileInputRef.current?.click()} icon={<Upload size={13} />} label="Import" />
            <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImport} />

            <div className="ml-auto">
              <ShortcutsHelp />
            </div>
          </div>

          {/* Query Builder */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="bg-white dark:bg-[#1a1d27] rounded-xl border border-gray-200 dark:border-gray-800">
              <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
                <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Query Builder</h2>
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {countRules(root)} condition{countRules(root) !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="p-4">
                <GroupNode group={root} schema={schema} errors={errors} isRoot depth={0} />
              </div>
            </div>
          </div>

          {/* Results Panel */}
          {showResults && (
            <div className="shrink-0 border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] animate-slide-up" style={{ height: "280px" }}>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-100 dark:border-gray-800">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">Results</span>
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-2 py-0.5 rounded-full">
                    {results.length} record{results.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <button
                  onClick={() => setShowResults(false)}
                  className="p-1 rounded text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ChevronDown size={15} />
                </button>
              </div>
              <div className="h-[calc(100%-44px)] overflow-hidden">
                <ResultsTable
                  results={results}
                  onExport={(data) => {
                    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `results-${Date.now()}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }}
                />
              </div>
            </div>
          )}

          {/* Collapsed results hint */}
          {!showResults && results.length > 0 && (
            <div className="shrink-0 border-t border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setShowResults(true)}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <ChevronUp size={13} />
                Show {results.length} result{results.length !== 1 ? "s" : ""}
              </button>
            </div>
          )}
        </main>

        {/* ── RIGHT: Tabbed output ── */}
        <aside className="w-80 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] flex flex-col">

          {/* Tab bar */}
          <div className="flex items-center border-b border-gray-100 dark:border-gray-800 shrink-0">
            {(["sql", "mongo", "gql"] as OutputTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => setOutputTab(tab)}
                className={`flex-1 py-2.5 text-[11px] font-semibold uppercase tracking-wide transition-colors border-b-2 ${
                  outputTab === tab
                    ? "border-blue-500 text-blue-600 dark:text-blue-400"
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                }`}
              >
                {tab === "gql" ? "GraphQL" : tab === "mongo" ? "MongoDB" : "SQL"}
              </button>
            ))}
          </div>

          {/* Output */}
          <div className="flex-1 overflow-auto p-4">
            <pre className="text-[11px] font-mono leading-relaxed whitespace-pre-wrap break-words text-purple-500 dark:text-purple-300">
              {outputCode}
            </pre>
          </div>

          {/* Copy + status footer */}
          <div className="shrink-0 p-3 border-t border-gray-100 dark:border-gray-800 space-y-2">
            {showResults && (
              <div className="flex items-center gap-2 px-2 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                <span className="text-xs text-green-700 dark:text-green-400 font-medium">
                  {results.length} record{results.length !== 1 ? "s" : ""} matched
                </span>
              </div>
            )}
            <button
              onClick={handleCopyOutput}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
            >
              {copied ? <Check size={13} /> : <Copy size={13} />}
              {copied ? "Copied!" : `Copy ${outputTab === "gql" ? "GraphQL" : outputTab.toUpperCase()}`}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

// ── Small helpers ──────────────────────────────────────────────────────────────

interface ToolbarBtnProps {
  onClick: () => void;
  icon: React.ReactNode;
  label?: string;
  title?: string;
  className?: string;
}
function ToolbarBtn({ onClick, icon, label, title, className = "" }: ToolbarBtnProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors ${className}`}
    >
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

function TypeBadge({ type }: { type: string }) {
  const colors: Record<string, string> = {
    string:  "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20",
    number:  "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20",
    boolean: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20",
    date:    "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20",
    enum:    "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/20",
  };
  return (
    <span className={`text-[9px] font-mono font-semibold px-1.5 py-0.5 rounded uppercase ${colors[type] ?? "text-gray-400 bg-gray-100 dark:bg-gray-800"}`}>
      {type}
    </span>
  );
}

function countRules(node: import("@/lib/query-tree/types").QueryNode): number {
  if (node.type === "rule") return 1;
  return (node as import("@/lib/query-tree/types").GroupNode).children.reduce(
    (sum, child) => sum + countRules(child),
    0
  );
}
