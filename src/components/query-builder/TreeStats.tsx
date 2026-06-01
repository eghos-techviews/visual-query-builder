"use client";

import { memo, useMemo } from "react";
import { GroupNode } from "@/lib/query-tree/types";
import { countNodes, getDepth } from "@/lib/query-tree/selectors";

type Props = { root: GroupNode };

export const TreeStats = memo(function TreeStats({ root }: Props) {
  const total = useMemo(() => countNodes(root), [root]);
  const depth = useMemo(() => getDepth(root), [root]);
  // count only rules (not group nodes)
  const ruleCount = useMemo(() => total - (depth + 1), [total, depth]);

  return (
    <div className="flex items-center gap-4 text-xs text-[var(--muted-foreground)] px-1">
      <span>{ruleCount} rule{ruleCount !== 1 ? "s" : ""}</span>
      <span>·</span>
      <span>depth {depth}</span>
    </div>
  );
});
