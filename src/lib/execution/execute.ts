import { GroupNode, QueryNode, RuleNode } from "@/lib/query-tree/types";
import { MockRecord } from "@/lib/mock-data";

export function executeQuery(root: GroupNode, data: MockRecord[]): MockRecord[] {
  return data.filter((record) => evaluateGroup(root, record));
}

function evaluateGroup(group: GroupNode, record: MockRecord): boolean {
  if (group.children.length === 0) return true;

  if (group.logic === "AND") {
    return group.children.every((child) => evaluateNode(child, record));
  } else {
    return group.children.some((child) => evaluateNode(child, record));
  }
}

function evaluateNode(node: QueryNode, record: MockRecord): boolean {
  if (node.type === "group") return evaluateGroup(node as GroupNode, record);
  return evaluateRule(node as RuleNode, record);
}

function evaluateRule(rule: RuleNode, record: MockRecord): boolean {
  const raw = record[rule.field as keyof MockRecord];
  const val = rule.value;

  switch (rule.operator) {
    case "eq":           return String(raw).toLowerCase() === String(val).toLowerCase();
    case "neq":          return String(raw).toLowerCase() !== String(val).toLowerCase();
    case "gt":           return Number(raw) > Number(val);
    case "gte":          return Number(raw) >= Number(val);
    case "lt":           return Number(raw) < Number(val);
    case "lte":          return Number(raw) <= Number(val);
    case "contains":     return String(raw).toLowerCase().includes(String(val).toLowerCase());
    case "not_contains": return !String(raw).toLowerCase().includes(String(val).toLowerCase());
    case "starts_with":  return String(raw).toLowerCase().startsWith(String(val).toLowerCase());
    case "ends_with":    return String(raw).toLowerCase().endsWith(String(val).toLowerCase());
    case "is_empty":     return raw === null || raw === "" || raw === undefined;
    case "is_not_empty": return raw !== null && raw !== "" && raw !== undefined;
    case "is_true":      return raw === true;
    case "is_false":     return raw === false;
    case "before":       return new Date(String(raw)) < new Date(String(val));
    case "after":        return new Date(String(raw)) > new Date(String(val));
    case "between": {
      if (Array.isArray(val)) return Number(raw) >= Number(val[0]) && Number(raw) <= Number(val[1]);
      return false;
    }
    default: return true;
  }
}
