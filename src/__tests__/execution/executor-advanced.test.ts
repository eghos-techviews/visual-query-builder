import { describe, it, expect } from "vitest";
import { executeQuery } from "@/lib/query-engine/executor";
import { GroupNode } from "@/lib/query-tree/types";

type R = Record<string, unknown>;

const DATA: R[] = [
  { id: "1", name: "Alice",   age: 28, country: "Nigeria", status: "active",   score: 88,  tags: "dev,react" },
  { id: "2", name: "Bob",     age: 17, country: "Ghana",   status: "inactive", score: 55,  tags: "design"    },
  { id: "3", name: "Charlie", age: 34, country: "Nigeria", status: "pending",  score: 72,  tags: "dev,node"  },
  { id: "4", name: "Diana",   age: 22, country: "Kenya",   status: "active",   score: 91,  tags: "pm"        },
  { id: "5", name: "Eve",     age: 16, country: "Ghana",   status: "inactive", score: 40,  tags: "dev"       },
];

function tree(children: GroupNode["children"], logic: "AND" | "OR" = "AND"): GroupNode {
  return { id: "root", type: "group", logic, children };
}
function rule(id: string, field: string, operator: string, value: unknown) {
  return { id, type: "rule" as const, field, operator, value } as import("@/lib/query-tree/types").RuleNode;
}

describe("executeQuery — string operators", () => {
  it("contains: matches substring case-insensitively", () => {
    const results = executeQuery(tree([rule("r1", "name", "contains", "ali")]), DATA);
    expect(results.map((r) => r.name)).toEqual(["Alice"]);
  });

  it("not_contains: excludes rows with substring", () => {
    const results = executeQuery(tree([rule("r1", "country", "not_contains", "Ghana")]), DATA);
    expect(results.every((r) => r.country !== "Ghana")).toBe(true);
  });

  it("starts_with: matches prefix", () => {
    const results = executeQuery(tree([rule("r1", "name", "starts_with", "C")]), DATA);
    expect(results.map((r) => r.name)).toEqual(["Charlie"]);
  });

  it("ends_with: matches suffix", () => {
    const results = executeQuery(tree([rule("r1", "name", "ends_with", "a")]), DATA);
    expect(results.map((r) => r.name)).toEqual(["Diana"]);
  });

  it("neq: excludes exact match", () => {
    const results = executeQuery(tree([rule("r1", "status", "neq", "active")]), DATA);
    expect(results.every((r) => r.status !== "active")).toBe(true);
  });
});

describe("executeQuery — numeric operators", () => {
  it("gte: age >= 22", () => {
    const results = executeQuery(tree([rule("r1", "age", "gte", 22)]), DATA);
    expect(results.every((r) => (r.age as number) >= 22)).toBe(true);
    expect(results.length).toBe(3);
  });

  it("lt: age < 20", () => {
    const results = executeQuery(tree([rule("r1", "age", "lt", 20)]), DATA);
    expect(results.every((r) => (r.age as number) < 20)).toBe(true);
  });

  it("lte: score <= 72", () => {
    const results = executeQuery(tree([rule("r1", "score", "lte", 72)]), DATA);
    expect(results.every((r) => (r.score as number) <= 72)).toBe(true);
  });

  it("between: age between 20 and 30", () => {
    const results = executeQuery(tree([rule("r1", "age", "between", [20, 30])]), DATA);
    expect(results.every((r) => (r.age as number) >= 20 && (r.age as number) <= 30)).toBe(true);
    expect(results.length).toBe(2); // Alice(28) and Diana(22)
  });
});

describe("executeQuery — null / boolean operators", () => {
  const dataWithNulls: R[] = [
    { id: "1", email: "a@test.com", active: true  },
    { id: "2", email: null,         active: false },
    { id: "3", email: "",           active: true  },
  ];

  it("is_empty: matches null values", () => {
    const results = executeQuery(tree([rule("r1", "email", "is_empty", null)]), dataWithNulls);
    expect(results.some((r) => r.id === "2")).toBe(true);
  });

  it("is_not_empty: excludes null values", () => {
    const results = executeQuery(tree([rule("r1", "email", "is_not_empty", null)]), dataWithNulls);
    expect(results.every((r) => r.email !== null)).toBe(true);
  });

  it("is_true: matches boolean true", () => {
    const results = executeQuery(tree([rule("r1", "active", "is_true", null)]), dataWithNulls);
    expect(results.every((r) => r.active === true)).toBe(true);
    expect(results.length).toBe(2);
  });

  it("is_false: matches boolean false", () => {
    const results = executeQuery(tree([rule("r1", "active", "is_false", null)]), dataWithNulls);
    expect(results.every((r) => r.active === false)).toBe(true);
    expect(results.length).toBe(1);
  });
});

describe("executeQuery — logic combinations", () => {
  it("OR logic returns union of matching rows", () => {
    const results = executeQuery(
      tree([rule("r1", "country", "eq", "Kenya"), rule("r2", "age", "lt", 18)], "OR"),
      DATA
    );
    expect(results.length).toBe(3); // Diana + Bob + Eve
  });

  it("deeply nested AND inside OR", () => {
    const q: GroupNode = {
      id: "root", type: "group", logic: "OR",
      children: [
        rule("r1", "country", "eq", "Kenya"),
        {
          id: "g1", type: "group", logic: "AND",
          children: [
            rule("r2", "country", "eq", "Nigeria"),
            rule("r3", "age",     "gt", 30),
          ],
        },
      ],
    };
    const results = executeQuery(q, DATA);
    // Diana (Kenya) + Charlie (Nigeria AND age>30)
    expect(results.length).toBe(2);
    expect(results.map((r) => r.name).sort()).toEqual(["Charlie", "Diana"]);
  });

  it("returns all records when root is empty", () => {
    expect(executeQuery(tree([]), DATA)).toHaveLength(DATA.length);
  });

  it("returns empty array when nothing matches", () => {
    expect(executeQuery(tree([rule("r1", "age", "gt", 999)]), DATA)).toHaveLength(0);
  });
});
