import { QueryBuilder } from "@/components/query-builder/QueryBuilder";
import { SchemaEditor } from "@/components/schema-editor/SchemaEditor";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export default function Home() {
  return (
    /* outer page — subtle background with top padding */
    <div className="min-h-screen bg-[#e8eaf0] dark:bg-[#0f1117] flex flex-col p-5">

      {/* ── The entire app lives inside this one container ── */}
      <div className="flex-1 w-full rounded-2xl border border-white/60 dark:border-gray-700 bg-white dark:bg-[#1a1d27] shadow-xl overflow-hidden flex flex-col"
        style={{ minHeight: "calc(100vh - 40px)" }}>

        {/* Header */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-[#141720] shrink-0">
          <div className="flex items-center gap-3">
            {/* SVG Logo — cleaner than VQ */}
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
              <rect width="32" height="32" rx="6" fill="#2563eb"/>
              <path d="M8 10L16 22L24 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div>
              <h1 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">Visual Query Builder</h1>
              <p className="text-[10px] text-gray-400 dark:text-gray-500 leading-tight">Build queries visually</p>
            </div>
          </div>
          <ThemeToggle />
        </header>

        {/* Body — sidebar + content side by side */}
        <div className="flex flex-1 overflow-hidden">

          {/* Sidebar — always visible, clean border on the right */}
          <aside className="w-56 shrink-0 border-r border-gray-100 dark:border-gray-800 bg-white dark:bg-[#141720] overflow-y-auto">
            <SchemaEditor />
          </aside>

          {/* Main — scrollable content area */}
          <main className="flex-1 overflow-y-auto bg-[#f7f8fa] dark:bg-[#0f1117] p-6">
            <QueryBuilder />
          </main>

        </div>
      </div>
    </div>
  );
}
