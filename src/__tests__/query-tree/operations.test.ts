import { describe, it, expect } from "vitest";
import {
  makeRootGroup,
  makeGroup,
  makeRule,
  addRule,
  addGroup,
  removeNode,
  updateRule,
  toggleLogic,
  reorderChildren,
} from "@/lib/query-tree/operations";
import { GroupNode } from "@/lib/query-tree/types";

function makeTestTree(): GroupNode {
  const root = makeRootGroup();
  // root has one child rule by default
  return root;
}

describe("addRule", () => {
  it("adds a rule to the target group", () => {
    const tree = makeTestTree();
    const result = addRule(tree, "root", "age");
    expect(result.children).toHaveLength(2);
    expect(result.children[1]).toMatchObject({ type: "rule", field: "age" });
  });

  it("adds a rule to a nested group", () => {
    let tree = makeTestTree();
    tree = addGroup(tree, "root");
    const nestedGroupId = (tree.children[1] as GroupNode).id;

    tree = addRule(tree, nestedGroupId, "name");
    const nestedGroup = tree.children[1] as GroupNode;
    expect(nestedGroup.children).toHaveLength(1);
    expect(nestedGroup.children[0]).toMatchObject({ type: "rule", field: "name" });
  });
});

describe("addGroup", () => {
  it("adds a child group to the target group", () => {
    const tree = makeTestTree();
    const result = addGroup(tree, "root");
    expect(result.children).toHaveLength(2);
    expect(result.children[1]).toMatchObject({ type: "group", logic: "AND" });
  });
});

describe("removeNode", () => {
  it("removes a rule by id", () => {
    const tree = makeTestTree();
    const ruleId = tree.children[0].id;
    const result = removeNode(tree, ruleId);
    expect(result.children).toHaveLength(0);
  });

  it("removes a nested group by id", () => {
    let tree = makeTestTree();
    tree = addGroup(tree, "root");
    const groupId = (tree.children[1] as GroupNode).id;
    const result = removeNode(tree, groupId);
    expect(result.children).toHaveLength(1);
  });

  it("does not mutate the original tree", () => {
    const tree = makeTestTree();
    const ruleId = tree.children[0].id;
    const originalLength = tree.children.length;
    removeNode(tree, ruleId);
    expect(tree.children).toHaveLength(originalLength);
  });
});

describe("updateRule", () => {
  it("patches an existing rule", () => {
    const tree = makeTestTree();
    const ruleId = tree.children[0].id;
    const result = updateRule(tree, ruleId, { operator: "gt", value: 30 });
    expect(result.children[0]).toMatchObject({ operator: "gt", value: 30 });
  });

  it("preserves unchanged fields", () => {
    const tree = makeTestTree();
    const ruleId = tree.children[0].id;
    const result = updateRule(tree, ruleId, { value: "Alice" });
    expect(result.children[0]).toMatchObject({ field: "name" });
  });
});

describe("toggleLogic", () => {
  it("switches AND to OR", () => {
    const tree = makeTestTree(); // root is AND
    const result = toggleLogic(tree, "root");
    expect(result.logic).toBe("OR");
  });

  it("switches OR back to AND", () => {
    const tree = { ...makeTestTree(), logic: "OR" as const };
    const result = toggleLogic(tree, "root");
    expect(result.logic).toBe("AND");
  });
});

describe("reorderChildren", () => {
  it("moves a child from one index to another", () => {
    let tree = makeTestTree();
    tree = addRule(tree, "root", "age");
    const firstId = tree.children[0].id;
    const secondId = tree.children[1].id;

    const result = reorderChildren(tree, "root", 0, 1);
    expect(result.children[0].id).toBe(secondId);
    expect(result.children[1].id).toBe(firstId);
  });
});
