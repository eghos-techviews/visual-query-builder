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

export function generateSQL(root: GroupNode, tableName = "table"): string {
  const where = groupToSQL(root, 0);
  if (!where) return `SELECT * FROM ${tableName}`;
  return `SELECT *\nFROM ${tableName}\nWHERE ${where}`;
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

// ─── GraphQL Generator (Hasura-style where filters) ───────────────────────────

function ruleToGQL(rule: RuleNode): Record<string, unknown> {
  const op = OPERATOR_DEFS[rule.operator];

  if (op.noValue) {
    if (rule.operator === "is_empty")     return { [rule.field]: { _is_null: true } };
    if (rule.operator === "is_not_empty") return { [rule.field]: { _is_null: false } };
    if (rule.operator === "is_true")      return { [rule.field]: { _eq: true } };
    if (rule.operator === "is_false")     return { [rule.field]: { _eq: false } };
  }

  if (op.rangeValue && Array.isArray(rule.value)) {
    return { [rule.field]: { _gte: rule.value[0], _lte: rule.value[1] } };
  }

  switch (rule.operator) {
    case "eq":           return { [rule.field]: { _eq:    rule.value } };
    case "neq":          return { [rule.field]: { _neq:   rule.value } };
    case "gt":           return { [rule.field]: { _gt:    rule.value } };
    case "gte":          return { [rule.field]: { _gte:   rule.value } };
    case "lt":           return { [rule.field]: { _lt:    rule.value } };
    case "lte":          return { [rule.field]: { _lte:   rule.value } };
    case "contains":     return { [rule.field]: { _ilike: `%${rule.value}%` } };
    case "not_contains": return { [rule.field]: { _nilike: `%${rule.value}%` } };
    case "starts_with":  return { [rule.field]: { _ilike: `${rule.value}%` } };
    case "ends_with":    return { [rule.field]: { _ilike: `%${rule.value}` } };
    case "before":       return { [rule.field]: { _lt:    rule.value } };
    case "after":        return { [rule.field]: { _gt:    rule.value } };
    default:             return { [rule.field]: { _eq:    rule.value } };
  }
}

function groupToGQL(group: GroupNode): Record<string, unknown> {
  if (group.children.length === 0) return {};

  const parts = group.children
    .map((child) => nodeToGQL(child))
    .filter((p) => Object.keys(p).length > 0);

  if (parts.length === 0) return {};
  if (parts.length === 1) return parts[0];

  const key = group.logic === "AND" ? "_and" : "_or";
  return { [key]: parts };
}

function nodeToGQL(node: QueryNode): Record<string, unknown> {
  return node.type === "rule" ? ruleToGQL(node) : groupToGQL(node as GroupNode);
}

// Serializes an object into GraphQL argument syntax (no quotes on keys, no commas)
function gqlStringify(val: unknown, depth = 0): string {
  const pad  = "  ".repeat(depth);
  const ipad = "  ".repeat(depth + 1);

  if (val === null || val === undefined) return "null";
  if (typeof val === "boolean")          return String(val);
  if (typeof val === "number")           return String(val);
  if (typeof val === "string")           return `"${val}"`;

  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    const items = (val as unknown[]).map((v) => `${ipad}${gqlStringify(v, depth + 1)}`).join("\n");
    return `[\n${items}\n${pad}]`;
  }

  if (typeof val === "object") {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines = entries.map(([k, v]) => `${ipad}${k}: ${gqlStringify(v, depth + 1)}`);
    return `{\n${lines.join("\n")}\n${pad}}`;
  }

  return String(val);
}

export function generateGraphQL(root: GroupNode, tableName = "table"): string {
  const filter = groupToGQL(root);
  const empty  = Object.keys(filter).length === 0;

  if (empty) return `query {\n  ${tableName} {\n    # select fields\n  }\n}`;

  const where = gqlStringify(filter, 2);
  return `query {\n  ${tableName}(\n    where: ${where}\n  ) {\n    # select fields\n  }\n}`;
}
