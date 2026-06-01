import { describe, it, expect } from "vitest";
import { generateSQL, generateMongo } from "@/lib/query-tree/generators";
import { GroupNode } from "@/lib/query-tree/types";

const simpleTree: GroupNode = {
  id: "root",
  type: "group",
  logic: "AND",
  children: [
    { id: "r1", type: "rule", field: "age",    operator: "gt",  value: 18 },
    { id: "r2", type: "rule", field: "status", operator: "eq",  value: "active" },
  ],
};

const nestedTree: GroupNode = {
  id: "root",
  type: "group",
  logic: "AND",
  children: [
    { id: "r1", type: "rule", field: "age", operator: "gte", value: 18 },
    {
      id: "g1",
      type: "group",
      logic: "OR",
      children: [
        { id: "r2", type: "rule", field: "country", operator: "eq",       value: "Nigeria" },
        { id: "r3", type: "rule", field: "status",  operator: "eq",       value: "active"  },
      ],
    },
  ],
};

describe("generateSQL", () => {
  it("produces SELECT * FROM table for empty root", () => {
    const empty: GroupNode = { id: "root", type: "group", logic: "AND", children: [] };
    expect(generateSQL(empty)).toBe("SELECT * FROM table");
  });

  it("generates correct SQL for a flat AND group", () => {
    const sql = generateSQL(simpleTree);
    expect(sql).toContain("WHERE");
    expect(sql).toContain("`age` > 18");
    expect(sql).toContain("`status` = 'active'");
    expect(sql).toContain("AND");
  });

  it("wraps nested OR group in parens", () => {
    const sql = generateSQL(nestedTree);
    expect(sql).toContain("(");
    expect(sql).toContain("OR");
  });

  it("handles contains operator with LIKE", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "name", operator: "contains", value: "john" }],
    };
    expect(generateSQL(tree)).toContain("LIKE '%john%'");
  });

  it("handles is_empty with IS NULL", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "email", operator: "is_empty", value: null }],
    };
    expect(generateSQL(tree)).toContain("IS NULL");
  });

  it("handles between operator", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "age", operator: "between", value: [18, 30] }],
    };
    expect(generateSQL(tree)).toContain("BETWEEN 18 AND 30");
  });
});

describe("generateMongo", () => {
  it("returns empty object for empty root", () => {
    const empty: GroupNode = { id: "root", type: "group", logic: "AND", children: [] };
    expect(JSON.parse(generateMongo(empty))).toEqual({});
  });

  it("uses $and for AND group", () => {
    const parsed = JSON.parse(generateMongo(simpleTree));
    expect(parsed).toHaveProperty("$and");
  });

  it("uses $gt for gt operator", () => {
    const parsed = JSON.parse(generateMongo(simpleTree));
    const ageRule = parsed.$and.find((r: Record<string, unknown>) => r.age);
    expect(ageRule.age).toEqual({ $gt: 18 });
  });

  it("uses $or inside nested group", () => {
    const parsed = JSON.parse(generateMongo(nestedTree));
    const orGroup = parsed.$and.find((r: Record<string, unknown>) => r.$or);
    expect(orGroup).toBeDefined();
  });

  it("handles regex for contains", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "name", operator: "contains", value: "ali" }],
    };
    const parsed = JSON.parse(generateMongo(tree));
    // single rule — returned directly, not wrapped in $and
    expect(parsed.name).toHaveProperty("$regex");
  });
});
