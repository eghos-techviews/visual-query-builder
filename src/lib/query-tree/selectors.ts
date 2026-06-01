import { GroupNode, QueryNode } from "./types";

// Count total nodes in the tree (rules + groups)
export function countNodes(node: QueryNode): number {
  if (node.type === "rule") return 1;
  return 1 + node.children.reduce((sum, c) => sum + countNodes(c), 0);
}

// Get max nesting depth
export function getDepth(node: QueryNode, current = 0): number {
  if (node.type === "rule") return current;
  if (node.children.length === 0) return current;
  return Math.max(...node.children.map((c) => getDepth(c, current + 1)));
}

// Find a node by id — returns null if not found
export function findNode(root: QueryNode, id: string): QueryNode | null {
  if (root.id === id) return root;
  if (root.type === "rule") return null;
  for (const child of root.children) {
    const found = findNode(child, id);
    if (found) return found;
  }
  return null;
}

// Check if tree has any rules with non-empty values
export function hasActiveRules(root: GroupNode): boolean {
  for (const child of root.children) {
    if (child.type === "rule" && child.value !== "" && child.value !== null) return true;
    if (child.type === "group" && hasActiveRules(child)) return true;
  }
  return false;
}
