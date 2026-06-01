import { GroupNode, QueryNode, RuleNode, OperatorId } from "./types";
import { nanoid } from "nanoid";

// ─── Factories ────────────────────────────────────────────────────────────────

export function makeRule(field: string, operator: OperatorId = "eq"): RuleNode {
  return { id: nanoid(), type: "rule", field, operator, value: "" };
}

export function makeGroup(logic: "AND" | "OR" = "AND"): GroupNode {
  return { id: nanoid(), type: "group", logic, children: [] };
}

export function makeRootGroup(): GroupNode {
  const rule = makeRule("name");
  return { id: "root", type: "group", logic: "AND", children: [rule] };
}

// ─── Recursive Helpers ────────────────────────────────────────────────────────

// Walk the tree and apply `transform` to the node with the matching id.
// Returns a new tree (immutable — original is never mutated).
function mapNode(
  node: QueryNode,
  targetId: string,
  transform: (n: QueryNode) => QueryNode | null
): QueryNode | null {
  if (node.id === targetId) return transform(node);
  if (node.type !== "group") return node;

  const newChildren: QueryNode[] = [];
  for (const child of node.children) {
    const result = mapNode(child, targetId, transform);
    if (result !== null) newChildren.push(result);
  }
  return { ...node, children: newChildren };
}

// ─── Operations ───────────────────────────────────────────────────────────────

export function addRule(root: GroupNode, parentId: string, defaultField: string): GroupNode {
  const rule = makeRule(defaultField);
  return mapNode(root, parentId, (node) => {
    if (node.type !== "group") return node;
    return { ...node, children: [...node.children, rule] };
  }) as GroupNode;
}

export function addGroup(root: GroupNode, parentId: string): GroupNode {
  const group = makeGroup("AND");
  return mapNode(root, parentId, (node) => {
    if (node.type !== "group") return node;
    return { ...node, children: [...node.children, group] };
  }) as GroupNode;
}

// Returns null when the root itself is removed (caller should guard against this)
export function removeNode(root: GroupNode, nodeId: string): GroupNode {
  return mapNode(root, root.id, (node) => {
    if (node.type !== "group") return node;
    return {
      ...node,
      children: node.children
        .filter((c) => c.id !== nodeId)
        .map((c) =>
          c.type === "group" ? (removeNode(c, nodeId) as GroupNode) : c
        ),
    };
  }) as GroupNode;
}

export function updateRule(root: GroupNode, nodeId: string, patch: Partial<Omit<RuleNode, "id" | "type">>): GroupNode {
  return mapNode(root, nodeId, (node) => {
    if (node.type !== "rule") return node;
    return { ...node, ...patch };
  }) as GroupNode;
}

export function toggleLogic(root: GroupNode, groupId: string): GroupNode {
  return mapNode(root, groupId, (node) => {
    if (node.type !== "group") return node;
    return { ...node, logic: node.logic === "AND" ? "OR" : "AND" };
  }) as GroupNode;
}

export function reorderChildren(root: GroupNode, groupId: string, fromIndex: number, toIndex: number): GroupNode {
  return mapNode(root, groupId, (node) => {
    if (node.type !== "group") return node;
    const children = [...node.children];
    const [moved] = children.splice(fromIndex, 1);
    children.splice(toIndex, 0, moved);
    return { ...node, children };
  }) as GroupNode;
}
