"use client";

import { useMemo, useState, useTransition, useCallback } from "react";
import { Play, RotateCcw, Undo2 } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { validateTree } from "@/lib/validation/validate";
import { executeQuery } from "@/lib/execution/execute";
import { MOCK_DATA } from "@/lib/mock-data";
import { GroupNode } from "./GroupNode";
import { QueryPreview } from "@/components/query-preview/QueryPreview";
import { ResultsTable } from "@/components/query-preview/ResultsTable";

export function QueryBuilder() {
  const root      = useQueryStore((s) => s.root);
  const schema    = useQueryStore((s) => s.schema);
  const resetTree = useQueryStore((s) => s.resetTree);

  const [results, setResults] = useState(MOCK_DATA);
  const [hasRun, setHasRun]   = useState(false);
  const [isPending, startTransition] = useTransition();

  const errors = useMemo(() => validateTree(root, schema), [root, schema]);

  const run = useCallback(() => {
    startTransition(() => {
      const r = executeQuery(root, MOCK_DATA);
      setResults(r);
      setHasRun(true);
    });
  }, [root]);

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* toolbar */}
      <div className="flex items-center gap-2 flex-wrap">
        <button
          onClick={run}
          disabled={errors.length > 0}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]
            text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Play size={14} fill="currentColor" /> Run Query
        </button>

        <button
          onClick={resetTree}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)]
            text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
        >
          <RotateCcw size={13} /> Reset
        </button>

        <button
          onClick={() => useQueryStore.temporal.getState().undo()}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[var(--border)]
            text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors"
          title="Undo last change"
        >
          <Undo2 size={13} /> Undo
        </button>

        {errors.length > 0 && (
          <span className="text-xs text-red-500 ml-2">
            {errors.length} validation error{errors.length > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {/* main builder */}
      <GroupNode group={root} schema={schema} errors={errors} isRoot depth={0} />

      {/* query preview */}
      <div className="h-64">
        <QueryPreview root={root} />
      </div>

      {/* results */}
      {hasRun && (
        <ResultsTable results={results} loading={isPending} total={MOCK_DATA.length} />
      )}
    </div>
  );
}
