import { describe, it, expect } from "vitest";
import { countNodes, getDepth, findNode, hasActiveRules } from "@/lib/query-tree/selectors";
import { GroupNode } from "@/lib/query-tree/types";

const flat: GroupNode = {
  id: "root", type: "group", logic: "AND",
  children: [
    { id: "r1", type: "rule", field: "age",  operator: "gt", value: 18 },
    { id: "r2", type: "rule", field: "name", operator: "eq", value: "Alice" },
  ],
};

const nested: GroupNode = {
  id: "root", type: "group", logic: "AND",
  children: [
    { id: "r1", type: "rule", field: "age", operator: "gt", value: 18 },
    {
      id: "g1", type: "group", logic: "OR",
      children: [
        { id: "r2", type: "rule", field: "country", operator: "eq", value: "Nigeria" },
      ],
    },
  ],
};

describe("countNodes", () => {
  it("counts rules and groups", () => {
    expect(countNodes(flat)).toBe(3); // root + 2 rules
  });
  it("counts nested nodes", () => {
    expect(countNodes(nested)).toBe(4); // root + g1 + r1 + r2
  });
});

describe("getDepth", () => {
  it("returns 0 for empty root", () => {
    const empty: GroupNode = { id: "root", type: "group", logic: "AND", children: [] };
    expect(getDepth(empty)).toBe(0);
  });
  it("returns 1 for flat group with rules", () => {
    expect(getDepth(flat)).toBe(1); // root(0) -> rules counted at depth 1
  });
  it("returns 2 for one level of nesting", () => {
    expect(getDepth(nested)).toBe(2); // root(0) -> g1(1) -> r2(2)
  });
});

describe("findNode", () => {
  it("finds root by id", () => {
    expect(findNode(nested, "root")).toBeTruthy();
  });
  it("finds nested rule", () => {
    expect(findNode(nested, "r2")).toMatchObject({ id: "r2", field: "country" });
  });
  it("returns null for missing id", () => {
    expect(findNode(nested, "doesnotexist")).toBeNull();
  });
});

describe("hasActiveRules", () => {
  it("returns true when rules have values", () => {
    expect(hasActiveRules(flat)).toBe(true);
  });
  it("returns false for empty root", () => {
    const empty: GroupNode = { id: "root", type: "group", logic: "AND", children: [] };
    expect(hasActiveRules(empty)).toBe(false);
  });
  it("returns false when all values are empty string", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "name", operator: "eq", value: "" }],
    };
    expect(hasActiveRules(tree)).toBe(false);
  });
});
