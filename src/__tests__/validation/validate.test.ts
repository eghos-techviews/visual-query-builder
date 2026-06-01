import { describe, it, expect } from "vitest";
import { validateTree } from "@/lib/validation/validate";
import { GroupNode, FieldSchema } from "@/lib/query-tree/types";

const schema: FieldSchema[] = [
  { name: "name",   label: "Name",   type: "string" },
  { name: "age",    label: "Age",    type: "number" },
  { name: "status", label: "Status", type: "enum", enumValues: ["active", "inactive"] },
];

describe("validateTree", () => {
  it("returns no errors for a valid rule", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "age", operator: "gt", value: 18 }],
    };
    expect(validateTree(tree, schema)).toHaveLength(0);
  });

  it("flags an empty group", () => {
    const tree: GroupNode = { id: "root", type: "group", logic: "AND", children: [] };
    const errors = validateTree(tree, schema);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].message).toMatch(/empty/i);
  });

  it("flags a rule with empty value", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "name", operator: "eq", value: "" }],
    };
    const errors = validateTree(tree, schema);
    expect(errors.some((e) => e.nodeId === "r1")).toBe(true);
  });

  it("flags invalid operator for field type — contains on number", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "age", operator: "contains", value: "10" }],
    };
    const errors = validateTree(tree, schema);
    expect(errors.some((e) => e.nodeId === "r1")).toBe(true);
    expect(errors[0].message).toMatch(/not valid/i);
  });

  it("does not flag noValue operators even with null value", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "name", operator: "is_empty", value: null }],
    };
    expect(validateTree(tree, schema)).toHaveLength(0);
  });

  it("flags between operator with missing range values", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "age", operator: "between", value: ["", ""] }],
    };
    const errors = validateTree(tree, schema);
    expect(errors.some((e) => e.nodeId === "r1")).toBe(true);
  });

  it("validates nested groups recursively", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "age", operator: "gt", value: 18 },
        { id: "g1", type: "group", logic: "OR", children: [] }, // empty nested group
      ],
    };
    const errors = validateTree(tree, schema);
    expect(errors.some((e) => e.nodeId === "g1")).toBe(true);
  });
});
