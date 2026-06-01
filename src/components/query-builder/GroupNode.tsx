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

const DEPTH_COLORS = [
  { border: "#6b3a1f", badge: "bg-[#6b3a1f]/10 text-[#6b3a1f] border-[#6b3a1f]/30 hover:bg-[#6b3a1f]/20 dark:bg-[#c9965a]/10 dark:text-[#c9965a] dark:border-[#c9965a]/30" },
  { border: "#d97706", badge: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800" },
  { border: "#059669", badge: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800" },
  { border: "#7c3aed", badge: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100 dark:bg-violet-950/30 dark:text-violet-400 dark:border-violet-800" },
];

export const GroupNode = memo(function GroupNode({ group, schema, errors, depth = 0, isRoot = false }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const addRule         = useQueryStore((s) => s.addRule);
  const addGroup        = useQueryStore((s) => s.addGroup);
  const removeNode      = useQueryStore((s) => s.removeNode);
  const toggleLogic     = useQueryStore((s) => s.toggleLogic);
  const reorderChildren = useQueryStore((s) => s.reorderChildren);

  const sensors    = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const color      = DEPTH_COLORS[depth % DEPTH_COLORS.length];
  const hasError   = errors.some((e) => e.nodeId === group.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: group.id, disabled: isRoot });

  const sortableStyle = isRoot
    ? {}
    : { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids  = group.children.map((c) => c.id);
    const from = ids.indexOf(String(active.id));
    const to   = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderChildren(group.id, from, to);
  }

  return (
    <div ref={!isRoot ? setNodeRef : undefined} style={sortableStyle} className={depth > 0 ? "ml-8 mt-1" : ""}>
      <div
        className={`rounded-xl border bg-[var(--card)] overflow-hidden transition-shadow
          ${hasError ? "border-red-300 dark:border-red-800 shadow-sm shadow-red-50" : "border-[var(--border)] shadow-sm"}`}
        style={{ borderLeftColor: color.border, borderLeftWidth: "4px" }}
      >
        {/* ── Header ── */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)]/30">

          {!isRoot && (
            <button {...attributes} {...listeners} tabIndex={-1}
              className="text-[var(--border)] hover:text-[var(--muted-foreground)] cursor-grab active:cursor-grabbing touch-none shrink-0">
              <GripVertical size={14} />
            </button>
          )}

          <button onClick={() => setCollapsed((v) => !v)}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors shrink-0">
            {collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
          </button>

          {/* AND / OR — click to toggle */}
          <button
            onClick={() => toggleLogic(group.id)}
            className={`text-xs font-bold px-3 py-1 rounded-md border transition-colors shrink-0 ${color.badge}`}
          >
            {group.logic}
          </button>

          <span className="text-xs text-[var(--muted-foreground)] flex-1 min-w-0 truncate">
            {collapsed
              ? `${group.children.length} condition${group.children.length !== 1 ? "s" : ""} hidden`
              : group.children.length === 0
                ? "no conditions yet"
                : `${group.children.length} condition${group.children.length !== 1 ? "s" : ""}`}
          </span>

          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => addRule(group.id)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                border border-[var(--border)] text-[var(--muted-foreground)]
                hover:text-[var(--foreground)] hover:bg-[var(--card)] hover:border-[var(--accent)] transition-colors">
              <Plus size={12} /> Rule
            </button>
            <button onClick={() => addGroup(group.id)}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg
                border border-[var(--border)] text-[var(--muted-foreground)]
                hover:text-[var(--foreground)] hover:bg-[var(--card)] hover:border-[var(--accent)] transition-colors">
              <Layers size={12} /> Group
            </button>
            {!isRoot && (
              <button onClick={() => removeNode(group.id)}
                className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* ── Children ── */}
        {!collapsed && (
          <div className="p-4 flex flex-col gap-3">
            {group.children.length === 0 ? (
              <div className="py-8 flex flex-col items-center gap-3 text-[var(--muted-foreground)]">
                <div className="w-10 h-10 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center">
                  <Plus size={16} className="opacity-40" />
                </div>
                <p className="text-xs">This group is empty</p>
                <button onClick={() => addRule(group.id)}
                  className="text-xs font-medium text-[var(--primary)] hover:underline">
                  + Add first rule
                </button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={group.children.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  {group.children.map((child) =>
                    child.type === "rule" ? (
                      <RuleNode key={child.id} rule={child} schema={schema} errors={errors} />
                    ) : (
                      <GroupNode key={child.id} group={child as GroupNodeType}
                        schema={schema} errors={errors} depth={depth + 1} />
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
