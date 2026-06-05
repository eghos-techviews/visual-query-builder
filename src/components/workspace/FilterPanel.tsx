"use client";

import { useQueryStore } from "@/store/query-store";
import { FieldSchema } from "@/lib/query-tree/types";
import { GroupNode } from "@/components/query-builder/GroupNode";

interface FilterPanelProps {
  schema: FieldSchema[];
}

export function FilterPanel({ schema }: FilterPanelProps) {
  const root = useQueryStore((s) => s.root);

  return (
    <div className="space-y-3">
      <div className="bg-gray-50 dark:bg-gray-900/30 rounded-lg border border-gray-200 dark:border-gray-800 p-4">
        <GroupNode group={root} schema={schema} errors={[]} isRoot depth={0} />
      </div>
    </div>
  );
}
