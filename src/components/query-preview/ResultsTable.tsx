"use client";

import { MockRecord } from "@/lib/mock-data";

type Props = {
  results: MockRecord[];
  loading: boolean;
  total: number;
};

const COLS: (keyof MockRecord)[] = ["name", "age", "status", "country", "verified"];

export function ResultsTable({ results, loading, total }: Props) {
  return (
    <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden flex flex-col">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[var(--border)]">
        <span className="text-sm font-semibold">Results</span>
        <span className="text-xs text-[var(--muted-foreground)]">
          {loading ? "running..." : `${results.length} of ${total} records`}
        </span>
      </div>

      {loading ? (
        <div className="p-8 text-center text-sm text-[var(--muted-foreground)] animate-pulse">
          Executing query...
        </div>
      ) : results.length === 0 ? (
        <div className="p-8 text-center text-sm text-[var(--muted-foreground)]">
          No records match this query.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--border)] bg-[var(--muted)]">
                {COLS.map((col) => (
                  <th key={col} className="text-left px-4 py-2 text-xs font-semibold text-[var(--muted-foreground)] uppercase tracking-wide">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((row) => (
                <tr key={row.id} className="border-b border-[var(--border)] hover:bg-[var(--muted)] transition-colors">
                  {COLS.map((col) => (
                    <td key={col} className="px-4 py-2.5 text-[var(--foreground)]">
                      {col === "verified" ? (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                          ${row.verified ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"}`}>
                          {row.verified ? "yes" : "no"}
                        </span>
                      ) : col === "status" ? (
                        <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium
                          ${row.status === "active" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : row.status === "pending" ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"}`}>
                          {String(row[col])}
                        </span>
                      ) : (
                        String(row[col])
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
