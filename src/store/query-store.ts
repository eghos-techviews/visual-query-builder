import { create } from "zustand";
import { temporal } from "zundo";
import { GroupNode, FieldSchema, RuleNode } from "@/lib/query-tree/types";
import {
  addRule,
  addGroup,
  removeNode,
  updateRule,
  toggleLogic,
  reorderChildren,
  makeRootGroup,
} from "@/lib/query-tree/operations";
import { DEFAULT_SCHEMA } from "@/lib/schema/default-schema";

// ─── Store Shape ──────────────────────────────────────────────────────────────

type QueryState = {
  root: GroupNode;
  schema: FieldSchema[];

  // Query tree mutations
  addRule: (parentId: string) => void;
  addGroup: (parentId: string) => void;
  removeNode: (nodeId: string) => void;
  updateRule: (nodeId: string, patch: Partial<Omit<RuleNode, "id" | "type">>) => void;
  toggleLogic: (groupId: string) => void;
  reorderChildren: (groupId: string, fromIndex: number, toIndex: number) => void;
  resetTree: () => void;
  importTree: (tree: GroupNode) => void;

  // Schema mutations
  addField: (field: FieldSchema) => void;
  removeField: (fieldName: string) => void;
  updateField: (fieldName: string, patch: Partial<FieldSchema>) => void;
};

// ─── Store ────────────────────────────────────────────────────────────────────

export const useQueryStore = create<QueryState>()(
  temporal(
    (set, get) => ({
      root: makeRootGroup(),
      schema: DEFAULT_SCHEMA,

      addRule: (parentId) => {
        const firstField = get().schema[0]?.name ?? "field";
        set((s) => ({ root: addRule(s.root, parentId, firstField) }));
      },

      addGroup: (parentId) =>
        set((s) => ({ root: addGroup(s.root, parentId) })),

      removeNode: (nodeId) =>
        set((s) => ({ root: removeNode(s.root, nodeId) })),

      updateRule: (nodeId, patch) =>
        set((s) => ({ root: updateRule(s.root, nodeId, patch) })),

      toggleLogic: (groupId) =>
        set((s) => ({ root: toggleLogic(s.root, groupId) })),

      reorderChildren: (groupId, from, to) =>
        set((s) => ({ root: reorderChildren(s.root, groupId, from, to) })),

      resetTree: () => set({ root: makeRootGroup() }),
      importTree: (tree) => set({ root: tree }),

      addField: (field) =>
        set((s) => ({ schema: [...s.schema, field] })),

      removeField: (fieldName) =>
        set((s) => ({ schema: s.schema.filter((f) => f.name !== fieldName) })),

      updateField: (fieldName, patch) =>
        set((s) => ({
          schema: s.schema.map((f) => (f.name === fieldName ? { ...f, ...patch } : f)),
        })),
    }),
    // zundo tracks root + schema changes for undo — schema mutations are rarely
    // undone but it's simpler to track everything than to be selective
    { partialize: (s) => ({ root: s.root, schema: s.schema }) }
  )
);

// Use useQueryStore.temporal.getState().undo() / .redo() to navigate history
