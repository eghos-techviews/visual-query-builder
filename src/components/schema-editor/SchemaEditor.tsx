"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronDown, ChevronRight } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { FieldType, FieldSchema } from "@/lib/query-tree/types";

const FIELD_TYPES: FieldType[] = ["string", "number", "boolean", "date", "enum"];

const TYPE_COLORS: Record<FieldType, string> = {
  string:  "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  number:  "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  boolean: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  date:    "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  enum:    "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
};

export function SchemaEditor() {
  const schema      = useQueryStore((s) => s.schema);
  const addField    = useQueryStore((s) => s.addField);
  const removeField = useQueryStore((s) => s.removeField);
  const updateField = useQueryStore((s) => s.updateField);

  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const [newField, setNewField] = useState<Partial<FieldSchema>>({ type: "string" });

  function handleAdd() {
    if (!newField.name?.trim() || !newField.label?.trim()) return;
    addField({
      name:       newField.name.trim().replace(/\s+/g, "_").toLowerCase(),
      label:      newField.label.trim(),
      type:       newField.type ?? "string",
      enumValues: newField.type === "enum" ? (newField.enumValues ?? []) : undefined,
    });
    setNewField({ type: "string" });
    setAdding(false);
  }

  return (
    <div className="p-4 flex flex-col gap-3">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-semibold text-[var(--foreground)] w-full"
      >
        {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        Schema Fields
        <span className="ml-auto text-xs text-[var(--muted-foreground)] font-normal">{schema.length} fields</span>
      </button>

      {open && (
        <div className="flex flex-col gap-2">
          {schema.map((field) => (
            <div key={field.name} className="flex items-center gap-2 rounded-lg border border-[var(--border)] px-3 py-2 bg-[var(--background)]">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{field.label}</p>
                <p className="text-xs text-[var(--muted-foreground)] truncate">{field.name}</p>
              </div>
              <span className={`text-xs px-1.5 py-0.5 rounded font-medium shrink-0 ${TYPE_COLORS[field.type]}`}>
                {field.type}
              </span>
              <button
                onClick={() => removeField(field.name)}
                className="text-[var(--muted-foreground)] hover:text-red-500 transition-colors shrink-0"
              >
                <Trash2 size={13} />
              </button>
            </div>
          ))}

          {adding ? (
            <div className="flex flex-col gap-2 rounded-lg border border-[var(--primary)] p-3 bg-[var(--background)]">
              <input
                placeholder="Field name (e.g. email)"
                value={newField.name ?? ""}
                onChange={(e) => setNewField((f) => ({ ...f, name: e.target.value }))}
                className="text-sm border-b border-[var(--border)] bg-transparent outline-none pb-1"
              />
              <input
                placeholder="Label (e.g. Email)"
                value={newField.label ?? ""}
                onChange={(e) => setNewField((f) => ({ ...f, label: e.target.value }))}
                className="text-sm border-b border-[var(--border)] bg-transparent outline-none pb-1"
              />
              <select
                value={newField.type}
                onChange={(e) => setNewField((f) => ({ ...f, type: e.target.value as FieldType }))}
                className="text-sm bg-[var(--muted)] rounded px-2 py-1 outline-none border border-[var(--border)]"
              >
                {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {newField.type === "enum" && (
                <input
                  placeholder="Values, comma separated"
                  onChange={(e) => setNewField((f) => ({ ...f, enumValues: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }))}
                  className="text-sm border-b border-[var(--border)] bg-transparent outline-none pb-1"
                />
              )}
              <div className="flex gap-2 mt-1">
                <button
                  onClick={handleAdd}
                  className="flex-1 text-xs py-1.5 rounded-md bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90"
                >
                  Add Field
                </button>
                <button
                  onClick={() => { setAdding(false); setNewField({ type: "string" }); }}
                  className="flex-1 text-xs py-1.5 rounded-md border border-[var(--border)] text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setAdding(true)}
              className="flex items-center gap-2 text-xs text-[var(--primary)] hover:text-[var(--foreground)] transition-colors px-1 py-1"
            >
              <Plus size={13} /> Add field
            </button>
          )}
        </div>
      )}
    </div>
  );
}
