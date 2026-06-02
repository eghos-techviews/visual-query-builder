"use client";

import { useState } from "react";
import { Plus, Trash2, Database } from "lucide-react";
import { useQueryStore } from "@/store/query-store";
import { FieldType, FieldSchema } from "@/lib/query-tree/types";

const FIELD_TYPES: FieldType[] = ["string", "number", "boolean", "date", "enum"];

const TYPE_BADGE: Record<FieldType, string> = {
  string:  "text-blue-500",
  number:  "text-orange-500",
  boolean: "text-purple-500",
  date:    "text-green-500",
  enum:    "text-pink-500",
};

export function SchemaEditor() {
  const schema      = useQueryStore((s) => s.schema);
  const addField    = useQueryStore((s) => s.addField);
  const removeField = useQueryStore((s) => s.removeField);
  const [adding, setAdding]     = useState(false);
  const [newField, setNewField] = useState<Partial<FieldSchema>>({ type: "string" });

  function handleAdd() {
    if (!newField.name?.trim() || !newField.label?.trim()) return;
    addField({
      name: newField.name.trim().replace(/\s+/g, "_").toLowerCase(),
      label: newField.label.trim(),
      type: newField.type ?? "string",
      enumValues: newField.type === "enum" ? (newField.enumValues ?? []) : undefined,
    });
    setNewField({ type: "string" });
    setAdding(false);
  }

  const inputCls = "w-full text-sm bg-[var(--input)] border border-[var(--border)] rounded-lg px-3 py-2 outline-none focus:border-[var(--primary)] text-[var(--foreground)] placeholder:text-[var(--muted-foreground)] transition-colors";

  return (
    <div className="flex flex-col h-full">

      {/* ── Header ── */}
      <div className="px-8 pt-6 pb-5 border-b border-gray-100 dark:border-gray-800">
        <h2 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-tight">Schema Fields</h2>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">{schema.length} fields available</p>
      </div>

      {/* ── Field list ── */}
      <div className="flex-1 overflow-y-auto py-4">

        {/* Fields with proper spacing */}
        {schema.map((field) => (
          <div key={field.name}
            className="flex items-center gap-6 pl-8 pr-5 py-3 mb-3 group hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-default">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{field.label}</p>
            </div>
            <span className={`text-xs font-bold shrink-0 ml-auto ${TYPE_BADGE[field.type]}`}>
              {field.type}
            </span>
            <button onClick={() => removeField(field.name)}
              className="shrink-0 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 ml-auto">
              <Trash2 size={12} />
            </button>
          </div>
        ))}

        {/* Add field button/form with proper spacing */}
        <div className="px-6 pr-5 mt-8">
          {adding ? (
            <div className="flex flex-col gap-2.5 rounded-xl border border-blue-100 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 p-4">
              <p className="text-[10px] uppercase tracking-widest font-bold text-blue-600 dark:text-blue-400">New Field</p>
              <input placeholder="Field name (e.g. email)" value={newField.name ?? ""}
                onChange={(e) => setNewField((f) => ({ ...f, name: e.target.value }))} className={inputCls} />
              <input placeholder="Display label (e.g. Email)" value={newField.label ?? ""}
                onChange={(e) => setNewField((f) => ({ ...f, label: e.target.value }))} className={inputCls} />
              <select value={newField.type}
                onChange={(e) => setNewField((f) => ({ ...f, type: e.target.value as FieldType }))}
                className={inputCls + " cursor-pointer"}>
                {FIELD_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </select>
              {newField.type === "enum" && (
                <input placeholder="Values, comma separated"
                  onChange={(e) => setNewField((f) => ({ ...f, enumValues: e.target.value.split(",").map((v) => v.trim()).filter(Boolean) }))}
                  className={inputCls} />
              )}
              <div className="flex gap-2 mt-1">
                <button onClick={handleAdd}
                  className="flex-1 text-xs py-2 rounded-lg bg-[var(--primary)] text-white font-semibold hover:opacity-90 transition-opacity">
                  Add Field
                </button>
                <button onClick={() => { setAdding(false); setNewField({ type: "string" }); }}
                  className="flex-1 text-xs py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button onClick={() => setAdding(true)}
              className="flex items-center justify-center gap-2 w-full text-xs font-semibold text-white bg-blue-500 hover:bg-blue-600 py-2 rounded-lg transition-colors">
              <Plus size={13} /> Add field
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-8 py-3 border-t border-gray-100 dark:border-gray-800">
        <p className="text-[10px] text-gray-500 dark:text-gray-400">Fields control operators, inputs & validation</p>
      </div>

    </div>
  );
}
