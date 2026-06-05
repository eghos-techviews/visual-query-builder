/**
 * Query Execution Engine
 * Evaluates query trees against datasets
 */

import { GroupNode, RuleNode, QueryNode } from "../query-tree/types";

type DataRecord = Record<string, unknown>;

export function executeQuery(queryTree: GroupNode, dataset: DataRecord[]): DataRecord[] {
  return dataset.filter((record) => evaluateNode(queryTree, record));
}

function evaluateNode(node: QueryNode, record: DataRecord): boolean {
  if (node.type === "rule") {
    return evaluateRule(node, record);
  }

  if (node.type === "group") {
    return evaluateGroup(node, record);
  }

  return true;
}

/**
 * Evaluate a group (AND/OR logic)
 */
function evaluateGroup(group: GroupNode, record: DataRecord): boolean {
  if (group.children.length === 0) {
    return true; // Empty group always matches
  }

  if (group.logic === "AND") {
    return group.children.every((child) => evaluateNode(child, record));
  } else {
    // OR
    return group.children.some((child) => evaluateNode(child, record));
  }
}

/**
 * Evaluate a single rule
 */
function evaluateRule(rule: RuleNode, record: DataRecord): boolean {
  const value = record[rule.field];

  switch (rule.operator) {
    case "eq":
      return String(value).toLowerCase() === String(rule.value).toLowerCase();

    case "neq":
      return String(value).toLowerCase() !== String(rule.value).toLowerCase();

    case "gt":
      return Number(value) > Number(rule.value);

    case "gte":
      return Number(value) >= Number(rule.value);

    case "lt":
      return Number(value) < Number(rule.value);

    case "lte":
      return Number(value) <= Number(rule.value);

    case "contains":
      return String(value).toLowerCase().includes(String(rule.value).toLowerCase());

    case "not_contains":
      return !String(value).toLowerCase().includes(String(rule.value).toLowerCase());

    case "starts_with":
      return String(value).toLowerCase().startsWith(String(rule.value).toLowerCase());

    case "ends_with":
      return String(value).toLowerCase().endsWith(String(rule.value).toLowerCase());

    case "is_empty":
      return value === null || value === undefined || value === "";

    case "is_not_empty":
      return value !== null && value !== undefined && value !== "";

    case "is_true":
      return value === true;

    case "is_false":
      return value === false;

    case "before":
      try {
        return new Date(String(value)) < new Date(String(rule.value));
      } catch {
        return false;
      }

    case "after":
      try {
        return new Date(String(value)) > new Date(String(rule.value));
      } catch {
        return false;
      }

    case "between":
      try {
        if (Array.isArray(rule.value) && rule.value.length === 2) {
          const num = Number(value);
          const min = Number(rule.value[0]);
          const max = Number(rule.value[1]);
          return num >= min && num <= max;
        }
        return false;
      } catch {
        return false;
      }

    default:
      return true;
  }
}

/**
 * Get readable query description
 */
export function getQueryDescription(node: QueryNode): string {
  if (node.type === "rule") {
    return `${node.field} ${node.operator} ${node.value}`;
  }

  if (node.type === "group") {
    if (node.children.length === 0) {
      return "(empty group)";
    }

    const descriptions = node.children.map((child) =>
      getQueryDescription(child)
    );
    const connector = ` ${node.logic} `;
    return `(${descriptions.join(connector)})`;
  }

  return "";
}
