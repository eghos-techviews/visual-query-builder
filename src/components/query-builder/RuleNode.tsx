"use client";

import { memo } from "react";
import { GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  RuleNode as RuleNodeType, FieldSchema,
  OPERATORS_BY_TYPE, OPERATOR_DEFS, OperatorId, ValidationError,
} from "@/lib/query-tree/types";
import { useQueryStore } from "@/store/query-store";

type Props = { rule: RuleNodeType; schema: FieldSchema[]; errors: ValidationError[] };

export const RuleNode = memo(function RuleNode({ rule, schema, errors }: Props) {
  const updateRule = useQueryStore((s) => s.updateRule);
  const removeNode = useQueryStore((s) => s.removeNode);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: rule.id });

  const field      = schema.find((f) => f.name === rule.field);
  const allowedOps = field ? OPERATORS_BY_TYPE[field.type] : [];
  const opDef      = OPERATOR_DEFS[rule.operator];
  const error      = errors.find((e) => e.nodeId === rule.id);

  function handleFieldChange(newField: string) {
    const s = schema.find((f) => f.name === newField);
    if (!s) return;
    updateRule(rule.id, { field: newField, operator: OPERATORS_BY_TYPE[s.type][0], value: "" });
  }

  function handleOperatorChange(op: OperatorId) {
    updateRule(rule.id, { operator: op, value: OPERATOR_DEFS[op].noValue ? null : "" });
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}
    >
      <div className={`flex items-stretch rounded-lg border bg-[var(--card)] overflow-hidden transition-all group
        ${error ? "border-red-300 dark:border-red-800" : "border-[var(--border)] hover:border-[var(--accent)]"}`}
      >
        {/* drag */}
        <button {...attributes} {...listeners} tabIndex={-1}
          className="w-8 flex items-center justify-center shrink-0 text-[var(--border)] hover:text-[var(--muted-foreground)] cursor-grab active:cursor-grabbing touch-none border-r border-[var(--border)] bg-[var(--muted)]/30 hover:bg-[var(--muted)] transition-colors">
          <GripVertical size={13} />
        </button>

        {/* field */}
        <div className="w-36 shrink-0 border-r border-[var(--border)] px-4 py-3 flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest font-semibold text-[var(--muted-foreground)]">Field</span>
          <select value={rule.field} onChange={(e) => handleFieldChange(e.target.value)}
            className="bg-transparent text-sm font-medium text-[var(--foreground)] cursor-pointer outline-none">
            {schema.map((f) => <option key={f.name} value={f.name}>{f.label}</option>)}
          </select>
        </div>

        {/* operator */}
        <div className="w-44 shrink-0 border-r border-[var(--border)] px-4 py-3 flex flex-col gap-1">
          <span className="text-[9px] uppercase tracking-widest font-semibold text-[var(--muted-foreground)]">Operator</span>
          <select value={rule.operator} onChange={(e) => handleOperatorChange(e.target.value as OperatorId)}
            className="bg-transparent text-sm text-[var(--foreground)] cursor-pointer outline-none">
            {allowedOps.map((op) => <option key={op} value={op}>{OPERATOR_DEFS[op].label}</option>)}
          </select>
        </div>

        {/* value */}
        <div className="flex-1 px-4 py-3 flex flex-col gap-1 min-w-0">
          <span className="text-[9px] uppercase tracking-widest font-semibold text-[var(--muted-foreground)]">Value</span>
          {opDef?.noValue ? (
            <span className="text-sm text-[var(--muted-foreground)] italic">no value needed</span>
          ) : opDef?.rangeValue ? (
            <div className="flex items-center gap-3">
              <input type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                placeholder="from"
                value={Array.isArray(rule.value) ? String(rule.value[0]) : ""}
                onChange={(e) => { const c = Array.isArray(rule.value) ? rule.value : ["", ""]; updateRule(rule.id, { value: [e.target.value, c[1]] }); }}
                className="bg-transparent outline-none text-sm w-28 border-b border-[var(--border)] focus:border-[var(--accent)] pb-0.5 transition-colors placeholder:text-[var(--border)]" />
              <span className="text-xs text-[var(--muted-foreground)] shrink-0">to</span>
              <input type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                placeholder="to"
                value={Array.isArray(rule.value) ? String(rule.value[1]) : ""}
                onChange={(e) => { const c = Array.isArray(rule.value) ? rule.value : ["", ""]; updateRule(rule.id, { value: [c[0], e.target.value] }); }}
                className="bg-transparent outline-none text-sm w-28 border-b border-[var(--border)] focus:border-[var(--accent)] pb-0.5 transition-colors placeholder:text-[var(--border)]" />
            </div>
          ) : field?.type === "enum" ? (
            <select value={String(rule.value ?? "")} onChange={(e) => updateRule(rule.id, { value: e.target.value })}
              className="bg-transparent text-sm text-[var(--foreground)] cursor-pointer outline-none">
              <option value="">select…</option>
              {field.enumValues?.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          ) : (
            <input
              type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
              placeholder="enter a value…"
              value={rule.value === null ? "" : String(rule.value)}
              onChange={(e) => updateRule(rule.id, { value: field?.type === "number" ? Number(e.target.value) : e.target.value })}
              className="bg-transparent outline-none text-sm border-b border-transparent focus:border-[var(--accent)] pb-0.5 transition-colors placeholder:text-[var(--border)] w-full"
            />
          )}
        </div>

        {/* delete */}
        <div className="w-12 shrink-0 flex items-center justify-center border-l border-[var(--border)]">
          <button onClick={() => removeNode(rule.id)}
            className="p-2 rounded-md text-[var(--border)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {error && (
        <p className="text-[11px] text-red-500 mt-1 ml-4">{error.message}</p>
      )}
    </div>
  );
});
