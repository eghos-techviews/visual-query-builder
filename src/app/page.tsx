import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowRight, Layers, Zap, Code2, History, Moon, Database } from "lucide-react";

const SCHEMAS = [
  {
    id: "jobs",
    name: "Jobs",
    description: "Open roles, salary ranges, job types, remote options",
    color: "blue",
    count: "20 records",
  },
  {
    id: "companies",
    name: "Companies",
    description: "Employer profiles, industries, ratings, headcount",
    color: "violet",
    count: "20 records",
  },
  {
    id: "applicants",
    name: "Applicants",
    description: "Candidate profiles, skills, experience, status",
    color: "emerald",
    count: "20 records",
  },
  {
    id: "users",
    name: "Users",
    description: "User accounts, verification status, purchase history",
    color: "amber",
    count: "20 records",
  },
];

const FEATURES = [
  {
    icon: Layers,
    title: "Recursive condition groups",
    description: "Nest AND/OR groups to any depth. Drag and drop to reorder. Collapse groups to focus on what matters.",
  },
  {
    icon: Code2,
    title: "3 output formats",
    description: "Every query generates live SQL, MongoDB, and Hasura-style GraphQL output — copy with one click.",
  },
  {
    icon: Zap,
    title: "Instant execution",
    description: "Run queries against live mock datasets and see results in a sortable, exportable table instantly.",
  },
  {
    icon: History,
    title: "Query history & presets",
    description: "Save queries by name, reload them from the sidebar, export to JSON and re-import across sessions.",
  },
  {
    icon: Database,
    title: "Schema-driven",
    description: "Fields, operators, and value inputs adapt automatically to the active schema and field type.",
  },
  {
    icon: Moon,
    title: "Dark mode",
    description: "Full dark/light mode with smooth transitions. Looks great on any display.",
  },
];

const COLOR_MAP: Record<string, { bg: string; border: string; badge: string; dot: string }> = {
  blue:   { bg: "bg-blue-50 dark:bg-blue-900/10",    border: "border-blue-200 dark:border-blue-800",   badge: "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300",   dot: "bg-blue-500"    },
  violet: { bg: "bg-violet-50 dark:bg-violet-900/10", border: "border-violet-200 dark:border-violet-800", badge: "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300", dot: "bg-violet-500" },
  emerald:{ bg: "bg-emerald-50 dark:bg-emerald-900/10", border: "border-emerald-200 dark:border-emerald-800", badge: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300", dot: "bg-emerald-500" },
  amber:  { bg: "bg-amber-50 dark:bg-amber-900/10",   border: "border-amber-200 dark:border-amber-800",  badge: "bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300",   dot: "bg-amber-500"  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1117]">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-[#0f1117]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-3.5">
          <div className="flex items-center gap-2.5">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#3b82f6" />
              <path d="M8 10L16 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-base font-bold text-gray-900 dark:text-white tracking-tight">QueryBuilder</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              href="/workspace/jobs"
              className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Open Builder
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
          Job Listings · Companies · Applicants · Users
        </div>

        <h1 className="text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight mb-5">
          Build queries visually.<br />
          <span className="text-blue-600 dark:text-blue-400">No SQL required.</span>
        </h1>

        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          A schema-aware query builder that generates SQL, MongoDB, and GraphQL in real time.
          Drag, nest, validate, and execute — all in one panel.
        </p>

        <div className="flex items-center justify-center gap-3 flex-wrap">
          <Link
            href="/workspace/jobs"
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-blue-500/20"
          >
            Try it now
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/workspace/applicants"
            className="flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600 font-semibold rounded-xl transition-colors"
          >
            Browse schemas
          </Link>
        </div>
      </section>

      {/* Schema quick-launch */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Pick a dataset</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Four schemas to explore. Each opens a fully functional query workspace.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SCHEMAS.map((s) => {
            const c = COLOR_MAP[s.color];
            return (
              <Link key={s.id} href={`/workspace/${s.id}`}>
                <div className={`group h-full p-5 rounded-xl border ${c.border} ${c.bg} hover:shadow-md transition-all cursor-pointer`}>
                  <div className="flex items-center justify-between mb-3">
                    <div className={`w-2 h-2 rounded-full ${c.dot}`} />
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>{s.count}</span>
                  </div>
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {s.name}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{s.description}</p>
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
                    Open workspace <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Everything you need</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Built for engineers who want to explore data without writing boilerplate.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="p-5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-[#1a1d27] hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center mb-4">
                  <Icon size={18} className="text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-1.5">{f.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA banner */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="rounded-2xl bg-blue-600 dark:bg-blue-700 px-10 py-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Ready to build?</h2>
          <p className="text-blue-100 text-sm mb-7">Open the builder, choose a schema, and start filtering in seconds.</p>
          <Link
            href="/workspace/jobs"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-700 hover:bg-blue-50 font-bold rounded-xl transition-colors shadow-lg"
          >
            Launch Builder
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#3b82f6" />
              <path d="M8 10L16 22L24 10" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span>QueryBuilder</span>
          </div>
          <span>Visual query builder with live SQL · MongoDB · GraphQL output</span>
        </div>
      </footer>
    </div>
  );
}
