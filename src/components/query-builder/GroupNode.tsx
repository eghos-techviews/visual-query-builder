"use client";

import { memo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Layers, Trash2, GripVertical } from "lucide-react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GroupNode as GroupNodeType, QueryNode, FieldSchema, ValidationError } from "@/lib/query-tree/types";
import { useQueryStore } from "@/store/query-store";
import { RuleNode } from "./RuleNode";

type Props = { group: GroupNodeType; schema: FieldSchema[]; errors: ValidationError[]; depth?: number; isRoot?: boolean };

const DEPTH_COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706"];

export const GroupNode = memo(function GroupNode({ group, schema, errors, depth = 0, isRoot = false }: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const addRule         = useQueryStore((s) => s.addRule);
  const addGroup        = useQueryStore((s) => s.addGroup);
  const removeNode      = useQueryStore((s) => s.removeNode);
  const toggleLogic     = useQueryStore((s) => s.toggleLogic);
  const reorderChildren = useQueryStore((s) => s.reorderChildren);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }));
  const accentColor = DEPTH_COLORS[depth % DEPTH_COLORS.length];
  const hasError = errors.some((e) => e.nodeId === group.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: group.id, disabled: isRoot });

  const style = isRoot ? {} : { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.35 : 1 };

  function handleDragEnd(e: DragEndEvent) {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    const ids = group.children.map((c) => c.id);
    const from = ids.indexOf(String(active.id));
    const to   = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderChildren(group.id, from, to);
  }

  return (
    <div ref={!isRoot ? setNodeRef : undefined} style={style} className={depth > 0 ? "ml-8" : ""}>
      <div
        className={`rounded-lg border bg-[var(--card)] overflow-hidden shadow-sm transition-all
          ${hasError ? "border-red-300" : "border-[var(--border)]"}`}
        style={{ borderLeftColor: accentColor, borderLeftWidth: "3px" }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--panel)] border-b border-[var(--border)]">
          {!isRoot && (
            <button {...attributes} {...listeners} tabIndex={-1}
              className="text-[var(--border)] hover:text-[var(--muted-foreground)] cursor-grab touch-none shrink-0">
              <GripVertical size={14} />
            </button>
          )}

          <button onClick={() => setCollapsed((v) => !v)}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors shrink-0">
            {collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
          </button>

          {/* AND / OR */}
          <button onClick={() => toggleLogic(group.id)}
            className="text-xs font-bold px-3 py-1 rounded-lg border transition-all shrink-0"
            style={{
              background: group.logic === "AND" ? `${accentColor}15` : "#7c3aed15",
              color: group.logic === "AND" ? accentColor : "#7c3aed",
              borderColor: group.logic === "AND" ? `${accentColor}40` : "#7c3aed40",
            }}>
            {group.logic}
          </button>

          <span className="text-xs text-[var(--muted-foreground)] flex-1">
            {collapsed
              ? `${group.children.length} condition${group.children.length !== 1 ? "s" : ""} — click to expand`
              : group.children.length === 0 ? "No conditions yet"
              : `${group.children.length} condition${group.children.length !== 1 ? "s" : ""}`}
          </span>

          <div className="flex items-center gap-1.5 shrink-0">
            <button onClick={() => addRule(group.id)}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all">
              <Plus size={12} /> Rule
            </button>
            <button onClick={() => addGroup(group.id)}
              className="flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded border border-[var(--border)] text-[var(--muted-foreground)] hover:text-[var(--primary)] hover:border-[var(--primary)] hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all">
              <Layers size={12} /> Group
            </button>
            {!isRoot && (
              <button onClick={() => removeNode(group.id)}
                className="p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <Trash2 size={13} />
              </button>
            )}
          </div>
        </div>

        {/* Children */}
        {!collapsed && (
          <div className="p-3 flex flex-col gap-2">
            {group.children.length === 0 ? (
              <div className="py-4 flex flex-col items-center gap-2 text-[var(--muted-foreground)]">
                <p className="text-xs">No conditions yet</p>
                <button onClick={() => addRule(group.id)}
                  className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
                  + Add first rule
                </button>
              </div>
            ) : (
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={group.children.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                  {group.children.map((child) =>
                    child.type === "rule"
                      ? <RuleNode key={child.id} rule={child} schema={schema} errors={errors} />
                      : <GroupNode key={child.id} group={child as GroupNodeType} schema={schema} errors={errors} depth={depth + 1} />
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
