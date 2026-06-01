import { QueryBuilder } from "@/components/query-builder/QueryBuilder";
import { SchemaEditor } from "@/components/schema-editor/SchemaEditor";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-3 flex items-center justify-between sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-lg bg-[var(--primary)] flex items-center justify-center text-[var(--primary-foreground)] text-xs font-bold">
            VQ
          </div>
          <div>
            <h1 className="text-base font-bold text-[var(--foreground)] leading-tight">Visual Query Builder</h1>
            <p className="text-xs text-[var(--muted-foreground)] leading-tight">build queries without writing syntax</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden md:flex items-center gap-4 text-xs text-[var(--muted-foreground)]">
            <span>nest groups infinitely</span>
            <span>·</span>
            <span>live SQL + Mongo preview</span>
            <span>·</span>
            <span>simulate on real data</span>
          </span>
          <ThemeToggle />
        </div>
      </header>

      {/* body — builder left, schema right */}
      <div className="flex flex-1 overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6 min-w-0">
          <QueryBuilder />
        </main>

        <aside className="w-72 border-l border-[var(--border)] bg-[var(--card)] overflow-y-auto shrink-0 hidden md:block">
          <SchemaEditor />
        </aside>
      </div>
    </div>
  );
}
