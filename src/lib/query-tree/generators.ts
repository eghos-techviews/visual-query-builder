import { GroupNode, QueryNode, RuleNode, OPERATOR_DEFS } from "./types";

// ─── SQL Generator ────────────────────────────────────────────────────────────

function ruleToSQL(rule: RuleNode): string {
  const op = OPERATOR_DEFS[rule.operator];
  const field = `\`${rule.field}\``;

  if (op.noValue) {
    if (rule.operator === "is_empty")     return `${field} IS NULL`;
    if (rule.operator === "is_not_empty") return `${field} IS NOT NULL`;
    if (rule.operator === "is_true")      return `${field} = true`;
    if (rule.operator === "is_false")     return `${field} = false`;
  }

  if (op.rangeValue && Array.isArray(rule.value)) {
    return `${field} BETWEEN ${formatSQL(rule.value[0])} AND ${formatSQL(rule.value[1])}`;
  }

  const val = formatSQL(rule.value as string | number);

  switch (rule.operator) {
    case "eq":           return `${field} = ${val}`;
    case "neq":          return `${field} != ${val}`;
    case "gt":           return `${field} > ${val}`;
    case "gte":          return `${field} >= ${val}`;
    case "lt":           return `${field} < ${val}`;
    case "lte":          return `${field} <= ${val}`;
    case "contains":     return `${field} LIKE ${formatSQL(`%${rule.value}%`)}`;
    case "not_contains": return `${field} NOT LIKE ${formatSQL(`%${rule.value}%`)}`;
    case "starts_with":  return `${field} LIKE ${formatSQL(`${rule.value}%`)}`;
    case "ends_with":    return `${field} LIKE ${formatSQL(`%${rule.value}`)}`;
    case "before":       return `${field} < ${val}`;
    case "after":        return `${field} > ${val}`;
    default:             return `${field} = ${val}`;
  }
}

function formatSQL(val: string | number | null): string {
  if (val === null || val === "") return "NULL";
  if (typeof val === "number") return String(val);
  return `'${val}'`;
}

function groupToSQL(group: GroupNode, depth = 0): string {
  if (group.children.length === 0) return "";

  const parts = group.children
    .map((child) => nodeToSQL(child, depth + 1))
    .filter(Boolean);

  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];

  const joined = parts.join(`\n${" ".repeat(depth * 2)}${group.logic} `);
  return depth > 0 ? `(\n${" ".repeat(depth * 2)}${joined}\n${" ".repeat((depth - 1) * 2)})` : joined;
}

function nodeToSQL(node: QueryNode, depth = 0): string {
  return node.type === "rule" ? ruleToSQL(node) : groupToSQL(node as GroupNode, depth);
}

export function generateSQL(root: GroupNode): string {
  const where = groupToSQL(root, 0);
  if (!where) return "SELECT * FROM table";
  return `SELECT *\nFROM table\nWHERE ${where}`;
}

// ─── MongoDB Generator ────────────────────────────────────────────────────────

function ruleToMongo(rule: RuleNode): Record<string, unknown> {
  const op = OPERATOR_DEFS[rule.operator];

  if (op.noValue) {
    if (rule.operator === "is_empty")     return { [rule.field]: null };
    if (rule.operator === "is_not_empty") return { [rule.field]: { $ne: null } };
    if (rule.operator === "is_true")      return { [rule.field]: true };
    if (rule.operator === "is_false")     return { [rule.field]: false };
  }

  if (op.rangeValue && Array.isArray(rule.value)) {
    return { [rule.field]: { $gte: rule.value[0], $lte: rule.value[1] } };
  }

  switch (rule.operator) {
    case "eq":           return { [rule.field]: rule.value };
    case "neq":          return { [rule.field]: { $ne: rule.value } };
    case "gt":           return { [rule.field]: { $gt: rule.value } };
    case "gte":          return { [rule.field]: { $gte: rule.value } };
    case "lt":           return { [rule.field]: { $lt: rule.value } };
    case "lte":          return { [rule.field]: { $lte: rule.value } };
    case "contains":     return { [rule.field]: { $regex: rule.value, $options: "i" } };
    case "not_contains": return { [rule.field]: { $not: { $regex: rule.value } } };
    case "starts_with":  return { [rule.field]: { $regex: `^${rule.value}`, $options: "i" } };
    case "ends_with":    return { [rule.field]: { $regex: `${rule.value}$`, $options: "i" } };
    case "before":       return { [rule.field]: { $lt: rule.value } };
    case "after":        return { [rule.field]: { $gt: rule.value } };
    default:             return { [rule.field]: rule.value };
  }
}

function groupToMongo(group: GroupNode): Record<string, unknown> {
  if (group.children.length === 0) return {};

  const parts = group.children
    .map((child) => nodeToMongo(child))
    .filter((p) => Object.keys(p).length > 0);

  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0];

  const key = group.logic === "AND" ? "$and" : "$or";
  return { [key]: parts };
}

function nodeToMongo(node: QueryNode): Record<string, unknown> {
  return node.type === "rule" ? ruleToMongo(node) : groupToMongo(node as GroupNode);
}

export function generateMongo(root: GroupNode): string {
  const obj = groupToMongo(root);
  return JSON.stringify(obj, null, 2);
}
