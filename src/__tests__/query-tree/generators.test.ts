import { describe, it, expect } from "vitest";
import { generateSQL, generateMongo, generateGraphQL } from "@/lib/query-tree/generators";
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

describe("generateGraphQL", () => {
  it("returns a bare query with no where clause for an empty root", () => {
    const empty: GroupNode = { id: "root", type: "group", logic: "AND", children: [] };
    const gql = generateGraphQL(empty, "users");
    expect(gql).toContain("query {");
    expect(gql).toContain("users");
    expect(gql).not.toContain("where:");
  });

  it("uses the provided tableName", () => {
    const empty: GroupNode = { id: "root", type: "group", logic: "AND", children: [] };
    expect(generateGraphQL(empty, "jobs")).toContain("jobs");
    expect(generateGraphQL(empty, "companies")).toContain("companies");
  });

  it("wraps multiple rules in _and for an AND group", () => {
    const gql = generateGraphQL(simpleTree);
    expect(gql).toContain("where:");
    expect(gql).toContain("_and:");
  });

  it("wraps multiple rules in _or for an OR group", () => {
    const orTree: GroupNode = {
      id: "root", type: "group", logic: "OR",
      children: [
        { id: "r1", type: "rule", field: "country", operator: "eq", value: "Nigeria" },
        { id: "r2", type: "rule", field: "status",  operator: "eq", value: "active" },
      ],
    };
    expect(generateGraphQL(orTree)).toContain("_or:");
  });

  it("uses _gt for gt operator", () => {
    expect(generateGraphQL(simpleTree)).toContain("_gt:");
  });

  it("uses _eq for eq operator", () => {
    expect(generateGraphQL(simpleTree)).toContain("_eq:");
  });

  it("uses _ilike with % wildcards for contains", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "name", operator: "contains", value: "ali" }],
    };
    const gql = generateGraphQL(tree);
    expect(gql).toContain("_ilike:");
    expect(gql).toContain("%ali%");
  });

  it("uses _is_null: true for is_empty", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "email", operator: "is_empty", value: null }],
    };
    expect(generateGraphQL(tree)).toContain("_is_null");
    expect(generateGraphQL(tree)).toContain("true");
  });

  it("uses _is_null: false for is_not_empty", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "email", operator: "is_not_empty", value: null }],
    };
    expect(generateGraphQL(tree)).toContain("_is_null");
    expect(generateGraphQL(tree)).toContain("false");
  });

  it("emits _gte and _lte for between operator", () => {
    const tree: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "age", operator: "between", value: [18, 30] }],
    };
    const gql = generateGraphQL(tree);
    expect(gql).toContain("_gte:");
    expect(gql).toContain("_lte:");
  });

  it("handles nested groups (AND containing OR)", () => {
    const gql = generateGraphQL(nestedTree);
    expect(gql).toContain("_and:");
    expect(gql).toContain("_or:");
  });

  it("does not double-wrap a single-child group", () => {
    const single: GroupNode = {
      id: "root", type: "group", logic: "AND",
      children: [{ id: "r1", type: "rule", field: "age", operator: "gt", value: 18 }],
    };
    const gql = generateGraphQL(single);
    // Single rule should not be wrapped in _and
    expect(gql).not.toContain("_and:");
    expect(gql).toContain("_gt:");
  });
});
