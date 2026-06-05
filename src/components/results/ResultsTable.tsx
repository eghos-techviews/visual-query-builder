"use client";

import { ChevronDown, Download } from "lucide-react";
import { useState, useMemo } from "react";

function downloadCSV(data: DataRecord[], columns: string[], filename: string) {
  const header = columns.map((c) => `"${formatColumnLabel(c)}"`).join(",");
  const rows = data.map((row) =>
    columns.map((col) => {
      const v = row[col];
      if (v === null || v === undefined) return "";
      return `"${String(v).replace(/"/g, '""')}"`;
    }).join(",")
  );
  const csv = [header, ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

type DataRecord = Record<string, unknown>;

interface ResultsTableProps {
  results: DataRecord[];
  isLoading?: boolean;
  onExport?: (data: DataRecord[]) => void;
}

export function ResultsTable({ results, isLoading = false, onExport }: ResultsTableProps) {
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDesc, setSortDesc]   = useState(false);

  const columns = useMemo(() => {
    if (results.length === 0) return [];
    return Object.keys(results[0]);
  }, [results]);

  const sortedResults = useMemo(() => {
    if (!sortField) return results;
    return [...results].sort((a, b) => {
      const av = a[sortField];
      const bv = b[sortField];
      if (av === bv) return 0;
      const less = av == null || av < (bv ?? "");
      return (less ? -1 : 1) * (sortDesc ? -1 : 1);
    });
  }, [results, sortField, sortDesc]);

  function handleSort(field: string) {
    if (sortField === field) setSortDesc((d) => !d);
    else { setSortField(field); setSortDesc(false); }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#141720] shrink-0">
          <div className="skeleton h-3 w-20 rounded" />
        </div>
        <div className="flex-1 overflow-hidden p-4 space-y-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex gap-3">
              <div className="skeleton h-7 flex-1 rounded" style={{ opacity: 1 - i * 0.12 }} />
              <div className="skeleton h-7 w-24 rounded" style={{ opacity: 1 - i * 0.12 }} />
              <div className="skeleton h-7 w-32 rounded" style={{ opacity: 1 - i * 0.12 }} />
              <div className="skeleton h-7 w-20 rounded" style={{ opacity: 1 - i * 0.12 }} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 dark:text-gray-500">
        <p className="text-sm">No records matched</p>
        <p className="text-xs">Adjust your query conditions</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 py-2.5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50 dark:bg-[#141720] shrink-0">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {results.length} record{results.length !== 1 ? "s" : ""}
        </p>
        {onExport && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => downloadCSV(sortedResults, columns, `results-${Date.now()}.csv`)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Download as CSV (opens in Excel)"
            >
              <Download size={11} />
              CSV
            </button>
            <button
              onClick={() => onExport(sortedResults)}
              className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded transition-colors"
              title="Download as JSON"
            >
              <Download size={11} />
              JSON
            </button>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full text-sm border-collapse">
          <thead className="sticky top-0 z-10">
            <tr>
              {columns.map((col) => (
                <th
                  key={col}
                  onClick={() => handleSort(col)}
                  className="px-4 py-2.5 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-[#141720] border-b border-gray-200 dark:border-gray-800 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 select-none whitespace-nowrap"
                >
                  <div className="flex items-center gap-1.5">
                    <span>{formatColumnLabel(col)}</span>
                    {sortField === col && (
                      <ChevronDown size={12} className={`transition-transform ${sortDesc ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedResults.map((record, idx) => (
              <tr
                key={String(record.id ?? idx)}
                className={`border-b border-gray-100 dark:border-gray-800/60 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-colors ${
                  idx % 2 === 0 ? "" : "bg-gray-50/40 dark:bg-gray-900/10"
                }`}
              >
                {columns.map((col) => (
                  <td key={col} className="px-4 py-2 text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {formatCell(record[col])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-2 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#141720] text-xs text-gray-400 dark:text-gray-500 shrink-0">
        Showing {sortedResults.length} of {results.length} records
      </div>
    </div>
  );
}

function formatColumnLabel(col: string): string {
  return col.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()).trim();
}

function formatCell(value: unknown): React.ReactNode {
  if (value === null || value === undefined) {
    return <span className="text-gray-300 dark:text-gray-600">—</span>;
  }
  if (typeof value === "boolean") {
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
        value
          ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
          : "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400"
      }`}>
        {value ? "Yes" : "No"}
      </span>
    );
  }
  const str = String(value);
  const statusColors: Record<string, string> = {
    active:     "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    open:       "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400",
    offer:      "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    interview:  "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400",
    pending:    "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    screening:  "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    paused:     "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400",
    inactive:   "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
    closed:     "bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400",
    rejected:   "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400",
    applied:    "bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400",
  };
  if (statusColors[str]) {
    return (
      <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium capitalize ${statusColors[str]}`}>
        {str}
      </span>
    );
  }
  return str;
}
