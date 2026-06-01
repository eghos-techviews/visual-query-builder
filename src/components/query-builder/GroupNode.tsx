"use client";

import { memo, useState } from "react";
import { ChevronDown, ChevronRight, Plus, Layers, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GroupNode as GroupNodeType, QueryNode, FieldSchema } from "@/lib/query-tree/types";
import { useQueryStore } from "@/store/query-store";
import { RuleNode } from "./RuleNode";
import { ValidationError } from "@/lib/query-tree/types";

type Props = {
  group: GroupNodeType;
  schema: FieldSchema[];
  errors: ValidationError[];
  depth?: number;
  isRoot?: boolean;
};

// depth → background tint cycling
const DEPTH_STYLES = [
  "bg-[var(--group-0)]",
  "bg-[var(--group-1)]",
  "bg-[var(--group-2)]",
  "bg-[var(--group-3)]",
];

export const GroupNode = memo(function GroupNode({
  group,
  schema,
  errors,
  depth = 0,
  isRoot = false,
}: Props) {
  const [collapsed, setCollapsed] = useState(false);
  const addRule = useQueryStore((s) => s.addRule);
  const addGroup = useQueryStore((s) => s.addGroup);
  const removeNode = useQueryStore((s) => s.removeNode);
  const toggleLogic = useQueryStore((s) => s.toggleLogic);
  const reorderChildren = useQueryStore((s) => s.reorderChildren);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const bgClass = DEPTH_STYLES[depth % DEPTH_STYLES.length];
  const hasError = errors.some((e) => e.nodeId === group.id);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: group.id, disabled: isRoot });

  const style = isRoot ? {} : {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const ids = group.children.map((c) => c.id);
    const from = ids.indexOf(String(active.id));
    const to   = ids.indexOf(String(over.id));
    if (from !== -1 && to !== -1) reorderChildren(group.id, from, to);
  }

  return (
    <div
      ref={!isRoot ? setNodeRef : undefined}
      style={style}
      className={`rounded-xl border border-[var(--border)] ${bgClass} transition-all
        ${hasError ? "border-red-400" : ""}
        ${depth > 0 ? "ml-4" : ""}
      `}
    >
      {/* group header */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-[var(--border)]">
        {/* drag handle for nested groups */}
        {!isRoot && (
          <button
            {...attributes}
            {...listeners}
            className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-grab active:cursor-grabbing touch-none"
            tabIndex={-1}
          >
            <GripVertical size={14} />
          </button>
        )}

        {/* collapse toggle */}
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
        >
          {collapsed ? <ChevronRight size={15} /> : <ChevronDown size={15} />}
        </button>

        {/* logic dropdown */}
        <select
          value={group.logic}
          onChange={() => toggleLogic(group.id)}
          className="text-xs font-bold px-2 py-0.5 rounded-md border border-[var(--border)]
            bg-[var(--secondary)] text-[var(--secondary-foreground)] cursor-pointer outline-none"
        >
          <option value="AND">AND</option>
          <option value="OR">OR</option>
        </select>

        <span className="text-xs text-[var(--muted-foreground)] flex-1">
          {group.children.length === 0
            ? "empty group"
            : `${group.children.length} condition${group.children.length !== 1 ? "s" : ""}`}
        </span>

        {/* add rule */}
        <button
          onClick={() => addRule(group.id)}
          className="flex items-center gap-1 text-xs text-[var(--primary)] hover:text-[var(--foreground)]
            transition-colors font-medium px-2 py-1 rounded-md hover:bg-[var(--muted)]"
          title="Add rule"
        >
          <Plus size={13} /> rule
        </button>

        {/* add group */}
        <button
          onClick={() => addGroup(group.id)}
          className="flex items-center gap-1 text-xs text-[var(--primary)] hover:text-[var(--foreground)]
            transition-colors font-medium px-2 py-1 rounded-md hover:bg-[var(--muted)]"
          title="Add nested group"
        >
          <Layers size={13} /> group
        </button>

        {/* remove group (not root) */}
        {!isRoot && (
          <button
            onClick={() => removeNode(group.id)}
            className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors p-1 rounded-md hover:bg-red-50 dark:hover:bg-red-950/20"
            title="Remove group"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>

      {/* children */}
      {!collapsed && (
        <div className="p-3 flex flex-col gap-2">
          {group.children.length === 0 ? (
            <p className="text-xs text-[var(--muted-foreground)] italic px-2">
              No conditions yet — add a rule or group above.
            </p>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext
                items={group.children.map((c) => c.id)}
                strategy={verticalListSortingStrategy}
              >
                {group.children.map((child) =>
                  child.type === "rule" ? (
                    <RuleNode key={child.id} rule={child} schema={schema} errors={errors} />
                  ) : (
                    // Recursive — GroupNode renders GroupNode
                    <GroupNode
                      key={child.id}
                      group={child as GroupNodeType}
                      schema={schema}
                      errors={errors}
                      depth={depth + 1}
                    />
                  )
                )}
              </SortableContext>
            </DndContext>
          )}
        </div>
      )}
    </div>
  );
});
