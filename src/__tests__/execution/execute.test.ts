import { describe, it, expect } from "vitest";
import { executeQuery } from "@/lib/query-engine/executor";
import { MOCK_USERS } from "@/lib/mock-data";
import { GroupNode } from "@/lib/query-tree/types";

const MOCK_DATA = MOCK_USERS as unknown as Record<string, unknown>[];

describe("executeQuery", () => {
  it("returns all records when root group is empty", () => {
    const tree: GroupNode = { id: "root", type: "group", logic: "AND", children: [] };
    expect(executeQuery(tree, MOCK_DATA)).toHaveLength(MOCK_DATA.length);
  });

  it("filters by age > 18", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "age", operator: "gt", value: 18 }],
    };
    const results = executeQuery(tree, MOCK_DATA);
    expect(results.every((r) => r.age > 18)).toBe(true);
  });

  it("filters by status equals active", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "status", operator: "eq", value: "active" }],
    };
    const results = executeQuery(tree, MOCK_DATA);
    expect(results.every((r) => r.status === "active")).toBe(true);
  });

  it("applies AND logic — age > 18 AND country = Nigeria", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "age",     operator: "gt", value: 18        },
        { id: "r2", type: "rule", field: "country", operator: "eq", value: "Nigeria" },
      ],
    };
    const results = executeQuery(tree, MOCK_DATA);
    expect(results.every((r) => r.age > 18 && r.country === "Nigeria")).toBe(true);
  });

  it("applies OR logic — status = active OR status = pending", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "OR",
      children: [
        { id: "r1", type: "rule", field: "status", operator: "eq", value: "active"  },
        { id: "r2", type: "rule", field: "status", operator: "eq", value: "pending" },
      ],
    };
    const results = executeQuery(tree, MOCK_DATA);
    expect(results.every((r) => r.status === "active" || r.status === "pending")).toBe(true);
  });

  it("handles nested group logic correctly", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [
        { id: "r1", type: "rule", field: "age", operator: "gt", value: 18 },
        {
          id: "g1", type: "group", logic: "OR",
          children: [
            { id: "r2", type: "rule", field: "country", operator: "eq", value: "Nigeria" },
            { id: "r3", type: "rule", field: "country", operator: "eq", value: "Ghana"   },
          ],
        },
      ],
    };
    const results = executeQuery(tree, MOCK_DATA);
    expect(results.every((r) => r.age > 18 && (r.country === "Nigeria" || r.country === "Ghana"))).toBe(true);
  });

  it("filters isVerified = true with is_true operator", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "isVerified", operator: "is_true", value: null }],
    };
    const results = executeQuery(tree, MOCK_DATA);
    expect(results.every((r) => r.isVerified === true)).toBe(true);
  });

  it("returns empty array when no records match", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "age", operator: "gt", value: 999 }],
    };
    expect(executeQuery(tree, MOCK_DATA)).toHaveLength(0);
  });
});
