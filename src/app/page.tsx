import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { ArrowRight, Layers, Zap, Code2, History, Moon, Database } from "lucide-react";

/* ─── Static data ──────────────────────────────────────────────────────────── */

const SCHEMAS = [
  { id: "jobs",       name: "Jobs",       desc: "Open roles, salary ranges, job types, remote options",      color: "blue",    count: "20 records", icon: "💼", fields: "title · salary · type · remote · status" },
  { id: "companies",  name: "Companies",  desc: "Employer profiles, industries, ratings, headcount",         color: "violet",  count: "20 records", icon: "🏢", fields: "name · industry · rating · size · country" },
  { id: "applicants", name: "Applicants", desc: "Candidate profiles, skills, experience, pipeline status",   color: "emerald", count: "20 records", icon: "👤", fields: "name · skills · experience · status" },
  { id: "users",      name: "Users",      desc: "User accounts, verification, purchase history",            color: "amber",   count: "20 records", icon: "🗂️", fields: "email · verified · plan · createdAt" },
];

const FEATURES = [
  { icon: Layers,   title: "Nested AND / OR groups", desc: "Unlimited levels of condition nesting. Drag and drop to reorder any rule or group." },
  { icon: Code2,    title: "3 output formats",       desc: "Generated SQL, MongoDB, and Hasura GraphQL update in real time as you build." },
  { icon: Zap,      title: "Instant execution",      desc: "Run queries against live mock datasets and see filtered results immediately." },
  { icon: History,  title: "Undo / redo history",    desc: "Full undo/redo powered by Zustand temporal state — press ⌘Z from anywhere." },
  { icon: Database, title: "Schema-driven fields",   desc: "Operators and inputs automatically adapt to each field's data type." },
  { icon: Moon,     title: "Dark mode",              desc: "Respects system preference, manually toggleable — no flash on load." },
];

const STEPS = [
  { n: "01", title: "Pick a schema",    desc: "Choose from Jobs, Companies, Applicants, or Users — each pre-loaded with 20 real sample records." },
  { n: "02", title: "Build conditions", desc: "Drag rules into AND/OR groups. Nest them as deep as your query needs. No empty fields required to run." },
  { n: "03", title: "Copy the query",   desc: "Your filter is instantly translated into SQL, MongoDB, or Hasura GraphQL. One click to copy." },
];

const COLORS = {
  blue:    { border: "border-blue-200/70 dark:border-blue-800/40",    hover: "hover:border-blue-400/60 dark:hover:border-blue-600/60",    iconBg: "bg-blue-50 dark:bg-blue-950",    tag: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400" },
  violet:  { border: "border-violet-200/70 dark:border-violet-800/40", hover: "hover:border-violet-400/60 dark:hover:border-violet-600/60", iconBg: "bg-violet-50 dark:bg-violet-950",  tag: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400" },
  emerald: { border: "border-emerald-200/70 dark:border-emerald-800/40", hover: "hover:border-emerald-400/60 dark:hover:border-emerald-600/60", iconBg: "bg-emerald-50 dark:bg-emerald-950", tag: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400" },
  amber:   { border: "border-amber-200/70 dark:border-amber-800/40",  hover: "hover:border-amber-400/60 dark:hover:border-amber-600/60",  iconBg: "bg-amber-50 dark:bg-amber-950",   tag: "bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400" },
};

/* ─── Component ────────────────────────────────────────────────────────────── */

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#09090b] text-gray-900 dark:text-gray-100">

      {/* ── Nav ─────────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-gray-100 dark:border-white/[0.06] bg-white/90 dark:bg-[#09090b]/90 backdrop-blur-md">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ViewsQLogo size={26} />
            <span className="font-bold text-sm tracking-tight">ViewsQ</span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#schemas" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors hidden sm:block">
              Schemas
            </a>
            <a href="#features" className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors hidden sm:block">
              Features
            </a>
            <ThemeToggle />
            <Link
              href="/workspace/jobs"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-sm font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-700 dark:hover:bg-gray-100 transition-colors"
            >
              Open Builder <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 dark:border-white/[0.06]">
        {/* atmospheric glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(37,99,235,0.09) 0%, transparent 60%)" }}
        />
        {/* dot grid */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ backgroundImage: "radial-gradient(circle, #d1d5db 1px, transparent 1px)", backgroundSize: "24px 24px", opacity: 0.35 }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-0 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-8 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0" />
            Live demo — no sign-up required
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.05] mb-5">
            Compose queries.{" "}
            <span className="text-blue-600 dark:text-blue-400">
              Not code.
            </span>
          </h1>

          <p className="text-lg text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-9 leading-relaxed">
            Drag-and-drop condition builder that generates SQL, MongoDB, and GraphQL from any job listing schema — in real time.
          </p>

          <div className="flex items-center justify-center gap-3 flex-wrap mb-12">
            <Link
              href="/workspace/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-lg shadow-blue-500/20 transition-all hover:-translate-y-px"
            >
              Try it now <ArrowRight size={15} />
            </Link>
            <a
              href="#schemas"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-200 dark:border-white/10 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 font-semibold rounded-lg transition-colors"
            >
              Browse schemas
            </a>
          </div>

          {/* ── Product preview ─────────────────────────────────────────────── */}
          <div className="relative max-w-4xl mx-auto">
            <div className="rounded-t-xl overflow-hidden border border-b-0 border-gray-200 dark:border-white/[0.08] shadow-[0_32px_80px_-10px_rgba(0,0,0,0.12)] dark:shadow-[0_32px_80px_-10px_rgba(0,0,0,0.6)] text-left">
              {/* browser chrome */}
              <div className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 dark:bg-[#1a1d27] border-b border-gray-200 dark:border-white/[0.06]">
                <div className="w-2.5 h-2.5 rounded-full bg-red-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-green-400/80" />
                <div className="ml-3 flex-1 max-w-xs h-5 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-white/10 flex items-center px-2.5">
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">viewsq.app/workspace/jobs</span>
                </div>
                <div className="ml-auto">
                  <span className="text-[10px] font-semibold text-white bg-blue-600 px-2.5 py-1 rounded-md">▶ Run Query</span>
                </div>
              </div>

              {/* three-column app layout */}
              <div className="flex bg-white dark:bg-[#0f1117]" style={{ height: "230px" }}>
                {/* left — fields */}
                <div className="w-36 shrink-0 border-r border-gray-100 dark:border-white/[0.05] bg-white dark:bg-[#13161f] p-3">
                  <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2 pl-0.5">Fields</p>
                  {[
                    { l: "Title",    t: "str",  c: "emerald" },
                    { l: "Salary",   t: "num",  c: "blue" },
                    { l: "Type",     t: "enum", c: "pink" },
                    { l: "Remote",   t: "bool", c: "violet" },
                    { l: "Location", t: "str",  c: "emerald" },
                  ].map((f) => (
                    <div key={f.l} className="flex items-center justify-between px-1 py-1">
                      <span className="text-[9.5px] text-gray-600 dark:text-gray-400">{f.l}</span>
                      <span className={`text-[7.5px] font-mono font-bold px-1 py-px rounded ${
                        f.c === "emerald" ? "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/20" :
                        f.c === "blue"    ? "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-900/20" :
                        f.c === "pink"    ? "text-pink-600 bg-pink-50 dark:text-pink-400 dark:bg-pink-900/20" :
                                            "text-violet-600 bg-violet-50 dark:text-violet-400 dark:bg-violet-900/20"
                      }`}>{f.t}</span>
                    </div>
                  ))}
                </div>

                {/* center — query builder */}
                <div className="flex-1 p-3 bg-gray-50 dark:bg-[#0f1117]">
                  <div className="bg-white dark:bg-[#1a1d27] rounded-lg border border-gray-200 dark:border-gray-800">
                    <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800">
                      <span className="text-[10px] font-semibold text-gray-700 dark:text-gray-300">Query Builder</span>
                      <span className="text-[9px] text-gray-400">2 conditions</span>
                    </div>
                    <div className="p-3">
                      <div className="border-l-2 border-blue-400 rounded-r-lg p-2.5 bg-blue-50/30 dark:bg-blue-900/10">
                        <div className="flex items-center gap-1.5 mb-2.5">
                          <span className="text-[8.5px] font-bold bg-blue-600 text-white px-1.5 py-0.5 rounded">AND</span>
                          <span className="text-[8.5px] text-blue-500 font-medium">+ Rule</span>
                        </div>
                        <div className="space-y-1.5">
                          {[
                            { f: "salary", op: "≥", v: "50,000",      vc: "text-blue-600 dark:text-blue-400" },
                            { f: "type",   op: "=", v: '"full-time"', vc: "text-green-600 dark:text-green-400" },
                          ].map((r, i) => (
                            <div key={i} className="flex items-center gap-2 bg-white dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 rounded px-2.5 py-1.5 text-[9.5px]">
                              <span className="font-medium text-gray-600 dark:text-gray-400">{r.f}</span>
                              <span className="text-gray-300 dark:text-gray-600 font-mono">{r.op}</span>
                              <span className={`font-medium ${r.vc}`}>{r.v}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* right — SQL output */}
                <div className="w-44 shrink-0 bg-gray-950 dark:bg-[#0d1117] border-l border-white/[0.04] p-3">
                  <div className="flex gap-1 mb-2.5">
                    <span className="text-[8.5px] font-semibold text-blue-400 bg-blue-900/40 border border-blue-800/40 px-1.5 py-0.5 rounded">SQL</span>
                    <span className="text-[8.5px] text-gray-600 px-1 py-0.5">MongoDB</span>
                    <span className="text-[8.5px] text-gray-600 px-1 py-0.5">GraphQL</span>
                  </div>
                  <pre className="text-[9px] font-mono text-gray-300 leading-relaxed">{`SELECT *\nFROM jobs\nWHERE\n  salary >= 50000\n  AND type =\n  'full-time'`}</pre>
                  <div className="mt-3 flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[8.5px] text-green-400 font-medium">8 records matched</span>
                  </div>
                </div>
              </div>
            </div>

            {/* gradient fade */}
            <div className="h-20 bg-gradient-to-b from-transparent to-white dark:to-[#09090b]" />
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Simple workflow</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Three steps. Zero boilerplate.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.n} className="flex gap-4">
              <span className="text-3xl font-black text-blue-100 dark:text-blue-950 leading-none shrink-0 select-none">{s.n}</span>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1.5">{s.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Schema cards ────────────────────────────────────────────────────── */}
      <section id="schemas" className="bg-gray-50 dark:bg-[#0f0f11] border-t border-gray-100 dark:border-white/[0.05]">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">Sample datasets</p>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Pick a schema to explore</h2>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-1.5">Each opens a fully functional workspace with live data.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {SCHEMAS.map((s) => {
              const c = COLORS[s.color as keyof typeof COLORS];
              return (
                <Link
                  key={s.id}
                  href={`/workspace/${s.id}`}
                  className={`group flex flex-col p-5 rounded-xl bg-white dark:bg-gray-950 border ${c.border} ${c.hover} hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5`}
                >
                  <div className="flex items-start justify-between mb-5">
                    <span className={`w-11 h-11 rounded-xl ${c.iconBg} flex items-center justify-center text-xl flex-shrink-0`}>{s.icon}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.tag}`}>{s.count}</span>
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white mb-1.5 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{s.name}</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3 flex-1">{s.desc}</p>
                  <p className="text-[10px] font-mono text-gray-300 dark:text-gray-600 truncate mb-4">{s.fields}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-gray-400 dark:text-gray-500 group-hover:text-blue-500 transition-colors">
                    Open workspace <ArrowRight size={11} />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────────────── */}
      <section id="features" className="max-w-5xl mx-auto px-6 py-16">
        <div className="mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-1.5">What&apos;s included</p>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Everything you need</h2>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-1.5">Built for engineers who want to explore data without writing boilerplate.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="p-5 rounded-xl bg-white dark:bg-gray-950 border border-gray-100 dark:border-white/[0.06] hover:border-blue-200 dark:hover:border-blue-900/60 hover:shadow-md transition-all duration-200"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-100 dark:border-blue-900/40 flex items-center justify-center mb-4">
                  <Icon size={16} className="text-blue-600 dark:text-blue-400" />
                </div>
                <p className="font-semibold text-sm text-gray-900 dark:text-white mb-1.5">{f.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div
          className="relative overflow-hidden rounded-2xl text-center px-10 py-14 bg-gray-950 dark:bg-black"
        >
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white mb-2">Ready to build?</h2>
            <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
              Choose a schema and start composing queries — no account, no install.
            </p>
            <Link
              href="/workspace/jobs"
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-lg shadow-blue-500/20 transition-colors"
            >
              Launch Builder <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 dark:border-white/[0.06]">
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ViewsQLogo size={20} />
            <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">ViewsQ</span>
          </div>
          <span className="text-xs text-gray-400 dark:text-gray-500 hidden sm:block">
            SQL · MongoDB · GraphQL — visual query builder
          </span>
        </div>
      </footer>
    </div>
  );
}

/* ─── ViewsQ Logo ──────────────────────────────────────────────────────────── */
// Descending filter bars — represents data being narrowed by query conditions
function ViewsQLogo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="7" fill="#2563eb" />
      <rect x="7" y="9"    width="18" height="2.5" rx="1.25" fill="white" />
      <rect x="9" y="14.5" width="14" height="2.5" rx="1.25" fill="white" fillOpacity="0.8" />
      <rect x="12" y="20"  width="8"  height="2.5" rx="1.25" fill="white" fillOpacity="0.6" />
      <rect x="14.5" y="25.5" width="3" height="2.5" rx="1.25" fill="white" fillOpacity="0.4" />
    </svg>
  );
}
