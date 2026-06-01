import { QueryBuilder } from "@/components/query-builder/QueryBuilder";
import { QueryPreview } from "@/components/query-preview/QueryPreview";
import { SchemaEditor } from "@/components/schema-editor/SchemaEditor";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[var(--background)]">

      {/* ── Header ── */}
      <header className="flex items-center justify-between px-8 py-4 border-b border-[var(--border)] bg-[var(--card)] shrink-0 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-[11px] font-bold shrink-0 shadow-sm"
            style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>
            VQ
          </div>
          <div>
            <h1 className="text-sm font-bold text-[var(--foreground)] leading-snug tracking-tight">Visual Query Builder</h1>
            <p className="text-[11px] text-[var(--muted-foreground)] leading-snug">build queries visually — no syntax needed</p>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-5 text-[11px] text-[var(--muted-foreground)]">
          <span>∞ nesting depth</span>
          <span className="opacity-30">|</span>
          <span>live SQL + Mongo preview</span>
          <span className="opacity-30">|</span>
          <span>schema-driven rendering</span>
        </div>

        <ThemeToggle />
      </header>

      {/* ── 3-panel body ── */}
      <div className="flex flex-1 overflow-hidden gap-5 p-5 px-6">

        {/* Schema sidebar — card with rounded corners and gap from edges */}
        <aside className="w-60 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-y-auto shrink-0 hidden lg:block shadow-sm">
          <SchemaEditor />
        </aside>

        {/* Main builder — breathing room all around */}
        <main className="flex-1 overflow-y-auto min-w-0 rounded-xl">
          <QueryBuilder />
        </main>

        {/* Preview sidebar — card with rounded corners */}
        <aside className="w-80 rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden shrink-0 hidden xl:flex flex-col shadow-sm">
          <QueryPreview />
        </aside>

      </div>
    </div>
  );
}
