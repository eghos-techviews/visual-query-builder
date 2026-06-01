"use client";

import { memo } from "react";
import { X, GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { RuleNode as RuleNodeType, FieldSchema, OPERATORS_BY_TYPE, OPERATOR_DEFS, OperatorId } from "@/lib/query-tree/types";
import { useQueryStore } from "@/store/query-store";
import { ValidationError } from "@/lib/query-tree/types";

type Props = {
  rule: RuleNodeType;
  schema: FieldSchema[];
  errors: ValidationError[];
};

export const RuleNode = memo(function RuleNode({ rule, schema, errors }: Props) {
  const updateRule = useQueryStore((s) => s.updateRule);
  const removeNode = useQueryStore((s) => s.removeNode);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: rule.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  const field = schema.find((f) => f.name === rule.field);
  const allowedOps = field ? OPERATORS_BY_TYPE[field.type] : [];
  const opDef = OPERATOR_DEFS[rule.operator];
  const hasError = errors.some((e) => e.nodeId === rule.id);
  const errorMsg = errors.find((e) => e.nodeId === rule.id)?.message;

  function handleFieldChange(newField: string) {
    const newSchema = schema.find((f) => f.name === newField);
    if (!newSchema) return;
    const firstOp = OPERATORS_BY_TYPE[newSchema.type][0];
    updateRule(rule.id, { field: newField, operator: firstOp, value: "" });
  }

  function handleOperatorChange(op: OperatorId) {
    const def = OPERATOR_DEFS[op];
    updateRule(rule.id, { operator: op, value: def.noValue ? null : "" });
  }

  return (
    <div ref={setNodeRef} style={style} className="group/rule">
      <div
        className={`flex items-center gap-1.5 flex-wrap rounded-full px-3 py-1.5 border text-sm transition-all
          ${hasError
            ? "border-red-400 bg-red-50 dark:bg-red-950/20"
            : "border-[var(--border)] bg-[var(--card)] hover:border-[var(--accent)]"
          }`}
      >
        {/* drag handle */}
        <button
          {...attributes}
          {...listeners}
          className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] cursor-grab active:cursor-grabbing touch-none"
          tabIndex={-1}
        >
          <GripVertical size={14} />
        </button>

        {/* field selector */}
        <select
          value={rule.field}
          onChange={(e) => handleFieldChange(e.target.value)}
          className="bg-transparent border-none outline-none font-medium text-[var(--primary)] cursor-pointer text-sm"
        >
          {schema.map((f) => (
            <option key={f.name} value={f.name}>{f.label}</option>
          ))}
        </select>

        <span className="text-[var(--muted-foreground)] text-xs">·</span>

        {/* operator selector */}
        <select
          value={rule.operator}
          onChange={(e) => handleOperatorChange(e.target.value as OperatorId)}
          className="bg-transparent border-none outline-none text-[var(--foreground)] cursor-pointer text-sm"
        >
          {allowedOps.map((op) => (
            <option key={op} value={op}>{OPERATOR_DEFS[op].label}</option>
          ))}
        </select>

        {/* value input */}
        {!opDef?.noValue && (
          <>
            <span className="text-[var(--muted-foreground)] text-xs">·</span>
            {opDef?.rangeValue ? (
              <div className="flex items-center gap-1">
                <input
                  type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                  placeholder="from"
                  value={Array.isArray(rule.value) ? String(rule.value[0]) : ""}
                  onChange={(e) => {
                    const cur = Array.isArray(rule.value) ? rule.value : ["", ""];
                    updateRule(rule.id, { value: [e.target.value, cur[1]] });
                  }}
                  className="bg-transparent border-b border-[var(--border)] outline-none w-20 text-sm px-1"
                />
                <span className="text-xs text-[var(--muted-foreground)]">–</span>
                <input
                  type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                  placeholder="to"
                  value={Array.isArray(rule.value) ? String(rule.value[1]) : ""}
                  onChange={(e) => {
                    const cur = Array.isArray(rule.value) ? rule.value : ["", ""];
                    updateRule(rule.id, { value: [cur[0], e.target.value] });
                  }}
                  className="bg-transparent border-b border-[var(--border)] outline-none w-20 text-sm px-1"
                />
              </div>
            ) : field?.type === "enum" ? (
              <select
                value={String(rule.value ?? "")}
                onChange={(e) => updateRule(rule.id, { value: e.target.value })}
                className="bg-transparent border-none outline-none cursor-pointer text-sm"
              >
                <option value="">pick one</option>
                {field.enumValues?.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            ) : field?.type === "boolean" ? null : (
              <input
                type={field?.type === "number" ? "number" : field?.type === "date" ? "date" : "text"}
                placeholder="value"
                value={rule.value === null ? "" : String(rule.value)}
                onChange={(e) => {
                  const v = field?.type === "number" ? Number(e.target.value) : e.target.value;
                  updateRule(rule.id, { value: v });
                }}
                className="bg-transparent border-b border-[var(--border)] outline-none min-w-[80px] max-w-[160px] text-sm px-1"
              />
            )}
          </>
        )}

        {/* remove */}
        <button
          onClick={() => removeNode(rule.id)}
          className="ml-1 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
          title="Remove rule"
        >
          <X size={14} />
        </button>
      </div>

      {hasError && (
        <p className="text-red-500 text-xs mt-1 ml-3">{errorMsg}</p>
      )}
    </div>
  );
});
