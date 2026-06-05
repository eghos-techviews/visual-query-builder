"use client";

import { useMemo, useRef, useState } from "react";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ResultsTable } from "@/components/results/ResultsTable";
import { FilterPanel } from "@/components/workspace/FilterPanel";
import { useQueryStore, switchSchema } from "@/store/query-store";
import { executeQuery } from "@/lib/query-engine/executor";
import { SCHEMA_REGISTRY, getSchemaConfig } from "@/lib/schema/schemas";
import { generateSQL } from "@/lib/query-tree/generators";
import Link from "next/link";
import { Play, Download, ChevronRight, Code2, Database, ChevronDown, Check } from "lucide-react";

interface WorkspaceClientProps {
  workspaceId: string;
}

export function WorkspaceClient({ workspaceId }: WorkspaceClientProps) {
  const root             = useQueryStore((s) => s.root);
  const schema           = useQueryStore((s) => s.schema);
  const activeSchemaId   = useQueryStore((s) => s.activeSchemaId);

  const [schemaOpen, setSchemaOpen] = useState(false);
  const [copied, setCopied]         = useState(false);
  const dropdownRef                 = useRef<HTMLDivElement>(null);

  const activeConfig = useMemo(() => getSchemaConfig(activeSchemaId), [activeSchemaId]);
  const allData      = useMemo(() => activeConfig.getData(), [activeConfig]);
  const results      = useMemo(() => executeQuery(root, allData), [root, allData]);
  const sql          = useMemo(() => generateSQL(root, activeConfig.tableName), [root, activeConfig]);

  const workspaceName = workspaceId === "users-qa" ? "User Testing" : "Workspace";

  function handleCopySQL() {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function handleSchemaSelect(id: string) {
    switchSchema(id);
    setSchemaOpen(false);
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1117] flex flex-col">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27]">
        <div className="flex items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100">
              <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="6" fill="#3b82f6" />
                <path d="M8 10L16 22L24 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </Link>
            <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{workspaceName}</span>
            <ChevronRight size={16} className="text-gray-300 dark:text-gray-600" />

            {/* Schema selector */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setSchemaOpen((v) => !v)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#0f1117] text-sm font-medium text-gray-800 dark:text-gray-200 hover:border-blue-400 dark:hover:border-blue-500 transition-colors"
              >
                <Database size={14} className="text-blue-500" />
                {activeConfig.label}
                <ChevronDown size={14} className={`text-gray-400 transition-transform ${schemaOpen ? "rotate-180" : ""}`} />
              </button>

              {schemaOpen && (
                <div className="absolute top-full left-0 mt-1 w-56 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-[#1a1d27] shadow-lg z-50 overflow-hidden">
                  {SCHEMA_REGISTRY.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleSchemaSelect(s.id)}
                      className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <Database size={14} className="mt-0.5 text-blue-500 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{s.label}</span>
                          {s.id === activeSchemaId && <Check size={13} className="text-blue-500" />}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{s.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors">
              <Play size={14} />
              Run Query
            </button>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Body: 3-column layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT: Schema fields */}
        <aside className="w-60 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] overflow-y-auto">
          <div className="p-4 space-y-5">
            <div>
              <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                Fields
              </p>
              <div className="space-y-0.5">
                {schema.map((field) => (
                  <div
                    key={field.name}
                    className="flex items-center justify-between px-2 py-1.5 rounded-md text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800/60 transition-colors cursor-default"
                  >
                    <span className="font-medium text-gray-800 dark:text-gray-200">{field.label}</span>
                    <span className="text-[10px] font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded">
                      {field.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-100 dark:border-gray-800 pt-4">
              <p className="text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-2 px-1">
                Results
              </p>
              <div className="px-2 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <p className="text-lg font-bold text-blue-600 dark:text-blue-400">{results.length}</p>
                <p className="text-xs text-blue-500 dark:text-blue-300">records matched</p>
              </div>
            </div>
          </div>
        </aside>

        {/* CENTER: Query Builder + Results */}
        <main className="flex-1 flex flex-col overflow-hidden bg-gray-50 dark:bg-[#0f1117]">
          <div className="flex-1 overflow-auto border-b border-gray-200 dark:border-gray-800">
            <div className="p-5">
              <div className="bg-white dark:bg-[#1a1d27] rounded-xl border border-gray-200 dark:border-gray-800">
                <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                  <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Query Builder</h2>
                </div>
                <div className="p-4">
                  <FilterPanel schema={schema} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden p-5">
            <div className="bg-white dark:bg-[#1a1d27] rounded-xl border border-gray-200 dark:border-gray-800 h-full overflow-hidden flex flex-col">
              <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">Results</p>
              </div>
              <div className="flex-1 overflow-hidden">
                <ResultsTable results={results} isLoading={false} />
              </div>
            </div>
          </div>
        </main>

        {/* RIGHT: SQL Preview */}
        <aside className="w-80 shrink-0 border-l border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center gap-2">
              <Code2 size={15} className="text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">SQL Preview</h3>
            </div>
          </div>

          <div className="flex-1 overflow-auto p-4">
            <pre className="text-xs font-mono leading-relaxed text-purple-400 dark:text-purple-300 whitespace-pre-wrap break-words">
              {sql}
            </pre>
          </div>

          <div className="p-4 border-t border-gray-100 dark:border-gray-800">
            <button
              onClick={handleCopySQL}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-lg transition-colors"
            >
              {copied ? <Check size={14} /> : <Download size={14} />}
              {copied ? "Copied!" : "Copy SQL"}
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
