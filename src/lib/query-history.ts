import { GroupNode } from "./query-tree/types";

export type HistoryEntry = {
  id: string;
  label: string;
  tree: GroupNode;
  savedAt: string;
};

const STORAGE_KEY = "vqb_history";

export function loadHistory(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveToHistory(tree: GroupNode, label?: string): HistoryEntry[] {
  const history = loadHistory();
  const entry: HistoryEntry = {
    id: Date.now().toString(),
    label: label ?? `Query ${new Date().toLocaleTimeString()}`,
    tree,
    savedAt: new Date().toISOString(),
  };
  const updated = [entry, ...history].slice(0, 20); // keep last 20
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteFromHistory(id: string): HistoryEntry[] {
  const updated = loadHistory().filter((e) => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function exportQueryJSON(tree: GroupNode): void {
  const blob = new Blob([JSON.stringify(tree, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `query-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importQueryJSON(file: File): Promise<GroupNode> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        // basic sanity check
        if (Array.isArray(parsed)) {
          reject(new Error('This looks like a results export (data rows). Use the toolbar "Export" button to export your query, then import that file.'));
          return;
        }
        if (parsed.type !== "group" || !Array.isArray(parsed.children)) {
          reject(new Error("Invalid query file — use the toolbar Export button to create a compatible file."));
          return;
        }
        resolve(parsed as GroupNode);
      } catch {
        reject(new Error("Could not parse JSON file."));
      }
    };
    reader.readAsText(file);
  });
}
