"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Plus, ArrowRight } from "lucide-react";

// Mock workspaces - in a real app, these would come from a database
const AVAILABLE_WORKSPACES = [
  {
    id: "users-qa",
    name: "User Testing",
    description: "QA testing for user data and conditions",
    icon: "👥",
    lastOpened: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
  },
];

export default function Home() {
  const [workspaces] = useState(AVAILABLE_WORKSPACES);

  const recentWorkspaces = useMemo(() => {
    return [...workspaces].sort((a, b) => b.lastOpened.getTime() - a.lastOpened.getTime());
  }, [workspaces]);

  const hasWorkspaces = recentWorkspaces.length > 0;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f1117]">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27]">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="6" fill="#3b82f6" />
              <path d="M8 10L16 22L24 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100">Visual Query Builder</h1>
          </div>
          <ThemeToggle />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {!hasWorkspaces ? (
          // Empty State
          <div className="flex flex-col items-center justify-center py-24">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">Home</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-12">Create your first workspace to get started</p>

              <div className="mb-12">
                <div className="w-16 h-16 mx-auto mb-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">You don't have any workspaces</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-8">Create a workspace to start building queries</p>

                <Link href="/workspace/users-qa">
                  <button className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors">
                    <Plus size={18} />
                    Create a workspace
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ) : (
          // Workspaces View
          <>
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-8">Home</h2>

              {/* Opened anytime section */}
              <div>
                <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide mb-4">Opened anytime</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {recentWorkspaces.map((workspace) => (
                    <Link key={workspace.id} href={`/workspace/${workspace.id}`}>
                      <div className="block p-4 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-[#1a1d27] hover:shadow-md dark:hover:shadow-lg/20 hover:border-gray-300 dark:hover:border-gray-700 transition-all cursor-pointer group">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="text-3xl">{workspace.icon}</div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {workspace.name}
                            </h4>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                              Opened {formatTimeAgo(workspace.lastOpened)}
                            </p>
                          </div>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{workspace.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}
