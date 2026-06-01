import { QueryBuilder } from "@/components/query-builder/QueryBuilder";
import { SchemaEditor } from "@/components/schema-editor/SchemaEditor";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* header */}
      <header className="border-b border-[var(--border)] bg-[var(--card)] px-6 py-3 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-lg font-bold text-[var(--primary)]">Visual Query Builder</h1>
          <p className="text-xs text-[var(--muted-foreground)]">build queries without writing syntax</p>
        </div>
        <ThemeToggle />
      </header>

      {/* body — side panel layout */}
      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* left: builder + results */}
        <main className="flex-1 overflow-y-auto p-6">
          <QueryBuilder />
        </main>

        {/* right: schema editor */}
        <aside className="w-72 border-l border-[var(--border)] bg-[var(--card)] overflow-y-auto shrink-0">
          <SchemaEditor />
        </aside>
      </div>
    </div>
  );
}
