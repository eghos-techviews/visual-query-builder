"use client";

import { memo } from "react";
import { GripVertical, X } from "lucide-react";
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
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: rule.id });

  const field      = schema.find((f) => f.name === rule.field);
  const allowedOps = field ? OPERATORS_BY_TYPE[field.type] : [];
  const opDef      = OPERATOR_DEFS[rule.operator];
  const error      = errors.find((e) => e.nodeId === rule.id);

  function handleFieldChange(v: string) {
    const s = schema.find((f) => f.name === v);
    if (!s) return;
    updateRule(rule.id, { field: v, operator: OPERATORS_BY_TYPE[s.type][0], value: "" });
  }
  function handleOperatorChange(op: OperatorId) {
    updateRule(rule.id, { operator: op, value: OPERATOR_DEFS[op].noValue ? null : "" });
  }

  const inputCls = "text-xs bg-[var(--input)] border border-[var(--border)] rounded px-2.5 py-1.5 outline-none focus:border-[var(--primary)] transition-colors w-full";

  return (
    <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.4 : 1 }}>
      <div className={`flex items-end gap-2 px-3 py-3 rounded-lg border border-[var(--border)] bg-[var(--card)] shadow-sm transition-all group hover:border-[var(--primary)]/50 hover:shadow-md`}>

        <button {...attributes} {...listeners} tabIndex={-1}
          className="mb-2 text-[var(--border)] hover:text-[var(--muted-foreground)] cursor-grab touch-none shrink-0">
          <GripVertical size={14} />
        </button>

        {/* Field */}
        <div className="flex flex-col gap-1 min-w-[120px]">
          <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Field</label>
          <select value={rule.field} onChange={(e) => handleFieldChange(e.target.value)} className={inputCls + " cursor-pointer"}>
            {schema.map((f) => <option key={f.name} value={f.name}>{f.label}</option>)}
          </select>
        </div>

        {/* Operator */}
        <div className="flex flex-col gap-1 min-w-[140px]">
          <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Operator</label>
          <select value={rule.operator} onChange={(e) => handleOperatorChange(e.target.value as OperatorId)} className={inputCls + " cursor-pointer"}>
            {allowedOps.map((op) => <option key={op} value={op}>{OPERATOR_DEFS[op].label}</option>)}
          </select>
        </div>

        {/* Value */}
        <div className="flex flex-col gap-1 flex-1 min-w-0">
          <label className="text-[9px] font-bold uppercase tracking-wider text-[var(--muted-foreground)]">Value</label>
          {opDef?.noValue ? (
            <div className={inputCls + " text-[var(--muted-foreground)] italic"}>Not required</div>
          ) : opDef?.rangeValue ? (
            <div className="flex items-center gap-2">
              <input type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"} placeholder="From"
                value={Array.isArray(rule.value) ? String(rule.value[0]) : ""}
                onChange={(e) => { const c = Array.isArray(rule.value) ? rule.value : ["",""]; updateRule(rule.id, { value: [e.target.value, c[1]] }); }}
                className={inputCls + " placeholder:text-[var(--border)]"} />
              <span className="text-[var(--muted-foreground)] shrink-0 text-sm">to</span>
              <input type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"} placeholder="To"
                value={Array.isArray(rule.value) ? String(rule.value[1]) : ""}
                onChange={(e) => { const c = Array.isArray(rule.value) ? rule.value : ["",""]; updateRule(rule.id, { value: [c[0], e.target.value] }); }}
                className={inputCls + " placeholder:text-[var(--border)]"} />
            </div>
          ) : field?.type === "enum" ? (
            <select value={String(rule.value ?? "")} onChange={(e) => updateRule(rule.id, { value: e.target.value })} className={inputCls + " cursor-pointer"}>
              <option value="">Select a value…</option>
              {field.enumValues?.map((v) => <option key={v} value={v}>{v}</option>)}
            </select>
          ) : (
            <input type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
              placeholder="Enter value…"
              value={rule.value === null ? "" : String(rule.value)}
              onChange={(e) => updateRule(rule.id, { value: field?.type === "number" ? Number(e.target.value) : e.target.value })}
              className={inputCls + " placeholder:text-[var(--border)]"} />
          )}
        </div>

        <button onClick={() => removeNode(rule.id)}
          className="mb-2 p-1.5 rounded-lg text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100 shrink-0">
          <X size={14} />
        </button>
      </div>
      {error && <p className="text-[11px] text-red-500 mt-1.5 ml-4">{error.message}</p>}
    </div>
  );
});
