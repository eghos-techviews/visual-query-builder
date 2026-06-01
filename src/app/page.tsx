import { QueryBuilder } from "@/components/query-builder/QueryBuilder";
import { QueryPreview } from "@/components/query-preview/QueryPreview";
import { SchemaEditor } from "@/components/schema-editor/SchemaEditor";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { QueryStoreRoot } from "@/components/QueryStoreRoot";

export default function Home() {
  return (
    <QueryStoreRoot>
      <div className="h-screen flex flex-col overflow-hidden">

        {/* ── Header ── */}
        <header className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] bg-[var(--card)] shrink-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}>VQ</div>
            <div>
              <h1 className="text-sm font-bold leading-tight text-[var(--foreground)]">Visual Query Builder</h1>
              <p className="text-[11px] text-[var(--muted-foreground)] leading-tight">build queries visually, no syntax needed</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-5 text-[11px] text-[var(--muted-foreground)]">
            <span>∞ nesting depth</span>
            <span>·</span>
            <span>live SQL + Mongo</span>
            <span>·</span>
            <span>schema-driven</span>
          </nav>

          <ThemeToggle />
        </header>

        {/* ── Body: 3 panels ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* Left — Schema */}
          <aside className="w-64 border-r border-[var(--border)] bg-[var(--card)] overflow-y-auto shrink-0 hidden lg:block">
            <SchemaEditor />
          </aside>

          {/* Centre — Builder */}
          <main className="flex-1 overflow-y-auto p-5 min-w-0">
            <QueryBuilder />
          </main>

          {/* Right — Preview */}
          <aside className="w-80 border-l border-[var(--border)] bg-[var(--card)] overflow-y-auto shrink-0 hidden xl:flex flex-col">
            <QueryPreview />
          </aside>

        </div>
      </div>
    </QueryStoreRoot>
  );
}
