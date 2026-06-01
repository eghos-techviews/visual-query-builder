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
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}>
      <div className={`flex items-stretch rounded-lg border bg-[var(--card)] overflow-hidden transition-all group
        ${error ? "border-red-300 dark:border-red-800" : "border-[var(--border)] hover:border-[var(--accent)]"}`}>

        {/* drag handle */}
        <button {...attributes} {...listeners}
          className="px-2 flex items-center text-[var(--border)] hover:text-[var(--muted-foreground)] cursor-grab active:cursor-grabbing touch-none border-r border-[var(--border)] bg-[var(--muted)]/40 hover:bg-[var(--muted)] transition-colors"
          tabIndex={-1}
        >
          <GripVertical size={13} />
        </button>

        {/* field */}
        <Cell label="Field" className="min-w-[120px] border-r border-[var(--border)]">
          <select value={rule.field} onChange={(e) => handleFieldChange(e.target.value)}
            className="bg-transparent text-sm font-medium text-[var(--foreground)] cursor-pointer outline-none w-full">
            {schema.map((f) => <option key={f.name} value={f.name}>{f.label}</option>)}
          </select>
        </Cell>

        {/* operator */}
        <Cell label="Operator" className="min-w-[145px] border-r border-[var(--border)]">
          <select value={rule.operator} onChange={(e) => handleOperatorChange(e.target.value as OperatorId)}
            className="bg-transparent text-sm text-[var(--foreground)] cursor-pointer outline-none w-full">
            {allowedOps.map((op) => <option key={op} value={op}>{OPERATOR_DEFS[op].label}</option>)}
          </select>
        </Cell>

        {/* value */}
        <Cell label="Value" className="flex-1">
          {opDef?.noValue ? (
            <span className="text-sm text-[var(--muted-foreground)] italic">—</span>
          ) : opDef?.rangeValue ? (
            <div className="flex items-center gap-2">
              <input type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                placeholder="from"
                value={Array.isArray(rule.value) ? String(rule.value[0]) : ""}
                onChange={(e) => { const c = Array.isArray(rule.value) ? rule.value : ["",""]; updateRule(rule.id, { value: [e.target.value, c[1]] }); }}
                className="bg-transparent outline-none text-sm w-24 border-b border-[var(--border)] focus:border-[var(--accent)] pb-0.5 transition-colors" />
              <span className="text-xs text-[var(--muted-foreground)]">to</span>
              <input type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                placeholder="to"
                value={Array.isArray(rule.value) ? String(rule.value[1]) : ""}
                onChange={(e) => { const c = Array.isArray(rule.value) ? rule.value : ["",""]; updateRule(rule.id, { value: [c[0], e.target.value] }); }}
                className="bg-transparent outline-none text-sm w-24 border-b border-[var(--border)] focus:border-[var(--accent)] pb-0.5 transition-colors" />
            </div>
          ) : field?.type === "enum" ? (
            <select value={String(rule.value ?? "")} onChange={(e) => updateRule(rule.id, { value: e.target.value })}
              className="bg-transparent text-sm text-[var(--foreground)] cursor-pointer outline-none w-full">
              <option value="">select…</option>
              {field.enumValues?.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          ) : (
            <input
              type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
              placeholder="enter value…"
              value={rule.value === null ? "" : String(rule.value)}
              onChange={(e) => updateRule(rule.id, { value: field?.type === "number" ? Number(e.target.value) : e.target.value })}
              className="bg-transparent outline-none text-sm w-full border-b border-transparent focus:border-[var(--accent)] pb-0.5 transition-colors placeholder:text-[var(--border)]"
            />
          )}
        </Cell>

        {/* actions */}
        <div className="flex items-center gap-1 px-2 border-l border-[var(--border)]">
          {error && <span className="text-[10px] text-red-500 max-w-[100px] hidden sm:block truncate" title={error.message}>!</span>}
          <button onClick={() => removeNode(rule.id)}
            className="p-1.5 rounded text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors opacity-0 group-hover:opacity-100">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1 ml-3">{error.message}</p>}
    </div>
  );
});

function Cell({ label, children, className = "" }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`px-3 py-2.5 flex flex-col justify-center ${className}`}>
      <span className="text-[9px] uppercase tracking-widest text-[var(--muted-foreground)] font-semibold mb-1">{label}</span>
      {children}
    </div>
  );
}
