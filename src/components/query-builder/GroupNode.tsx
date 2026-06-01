"use client";

import { memo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Layers, Trash2, GripVertical } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GroupNode as GroupNodeType, QueryNode, FieldSchema, ValidationError } from "@/lib/query-tree/types";
import { useQueryStore } from "@/store/query-store";
import { RuleNode } from "./RuleNode";

type Props = {
  group: GroupNodeType;
  schema: FieldSchema[];
  errors: ValidationError[];
  depth?: number;
  isRoot?: boolean;
};

// Left border accent colour per nesting depth
const DEPTH_ACCENT = ["var(--depth-0)", "var(--depth-1)", "var(--depth-2)", "var(--depth-3)"];

// Logic badge colours
const LOGIC_STYLE: Record<string, string> = {
  AND: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  OR:  "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300 dark:border-purple-800",
};

export const GroupNode = memo(function GroupNode({ group, schema, errors, depth = 0, isRoot = false }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const addRule        = useQueryStore((s) => s.addRule);
  const addGroup       = useQueryStore((s) => s.addGroup);
  const removeNode     = useQueryStore((s) => s.removeNode);
  const toggleLogic    = useQueryStore((s) => s.toggleLogic);
  const reorderChildren = useQueryStore((s) => s.reorderChildren);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const accentColor = DEPTH_ACCENT[depth % DEPTH_ACCENT.length];
  const hasError = errors.some((e) => e.nodeId === group.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: group.id, disabled: isRoot });

  const style = isRoot ? {} : { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = group.children.map((c) => c.id);
    const from = ids.indexOf(String(active.id));
    const to   = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderChildren(group.id, from, to);
  }

  return (
    <div ref={!isRoot ? setNodeRef : undefined} style={style} className={depth > 0 ? "ml-6" : ""}>
      <div
        className={`rounded-xl border bg-[var(--card)] overflow-hidden shadow-sm transition-all
          ${hasError ? "border-red-300 dark:border-red-800" : "border-[var(--border)]"}`}
        style={{ borderLeftColor: accentColor, borderLeftWidth: "3px" }}
      >
        {/* ── Group header ── */}
        <div className="flex items-center gap-2 px-3 py-2 bg-[var(--muted)]/50 border-b border-[var(--border)]">

          {/* drag handle for nested groups */}
          {!isRoot && (
            <button {...attributes} {...listeners}
              className="text-[var(--border)] hover:text-[var(--muted-foreground)] cursor-grab active:cursor-grabbing touch-none"
              tabIndex={-1}><GripVertical size={13} /></button>
          )}

          {/* collapse */}
          <button onClick={() => setCollapsed((v) => !v)}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            {collapsed ? <ChevronRight size={14} /> : <ChevronDown size={14} />}
          </button>

          {/* AND / OR toggle */}
          <button
            onClick={() => toggleLogic(group.id)}
            className={`text-xs font-bold px-2.5 py-1 rounded-md border transition-colors ${LOGIC_STYLE[group.logic]}`}
          >
            {group.logic}
          </button>

          <span className="text-xs text-[var(--muted-foreground)] flex-1">
            {collapsed
              ? `${group.children.length} condition${group.children.length !== 1 ? "s" : ""} (collapsed)`
              : group.children.length === 0
                ? "empty — add a rule below"
                : `${group.children.length} condition${group.children.length !== 1 ? "s" : ""}`}
          </span>

          {/* add rule */}
          <button onClick={() => addRule(group.id)}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border border-[var(--border)]
              text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors">
            <Plus size={12} /> Rule
          </button>

          {/* add group */}
          <button onClick={() => addGroup(group.id)}
            className="flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-md border border-[var(--border)]
              text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--card)] transition-colors">
            <Layers size={12} /> Group
          </button>

          {/* remove (not root) */}
          {!isRoot && (
            <button onClick={() => removeNode(group.id)}
              className="p-1.5 rounded-md text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
              <Trash2 size={13} />
            </button>
          )}
        </div>

        {/* ── Children ── */}
        {!collapsed && (
          <div className="p-3 flex flex-col gap-2">
            {group.children.length === 0 ? (
              <div className="py-6 flex flex-col items-center gap-2 text-[var(--muted-foreground)]">
                <Layers size={22} className="opacity-30" />
                <p className="text-xs">No conditions yet</p>
                <button onClick={() => addRule(group.id)}
                  className="text-xs text-[var(--primary)] hover:underline font-medium">+ add your first rule</button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={group.children.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  {group.children.map((child) =>
                    child.type === "rule" ? (
                      <RuleNode key={child.id} rule={child} schema={schema} errors={errors} />
                    ) : (
                      <GroupNode key={child.id} group={child as GroupNodeType} schema={schema}
                        errors={errors} depth={depth + 1} />
                    )
                  )}
                </SortableContext>
              </DndContext>
            )}
          </div>
        )}
      </div>
    </div>
  );
});
