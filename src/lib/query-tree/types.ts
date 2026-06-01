// ─── Field Types ─────────────────────────────────────────────────────────────
// These map to what kind of input/operators a field gets.
export type FieldType = "string" | "number" | "boolean" | "date" | "enum";

export type FieldSchema = {
  name: string;           // e.g. "age"
  label: string;          // e.g. "Age"
  type: FieldType;
  enumValues?: string[];  // only when type === "enum"
};

// ─── Operators ───────────────────────────────────────────────────────────────
export type OperatorId =
  | "eq"
  | "neq"
  | "gt"
  | "gte"
  | "lt"
  | "lte"
  | "contains"
  | "not_contains"
  | "starts_with"
  | "ends_with"
  | "is_empty"
  | "is_not_empty"
  | "is_true"
  | "is_false"
  | "before"
  | "after"
  | "between";

export type OperatorDef = {
  id: OperatorId;
  label: string;
  // When true, no value input is shown (e.g. "is empty")
  noValue?: boolean;
  // When true, value input expects two values (e.g. "between")
  rangeValue?: boolean;
};

// Which operators are valid for each field type
export const OPERATORS_BY_TYPE: Record<FieldType, OperatorId[]> = {
  string:  ["eq", "neq", "contains", "not_contains", "starts_with", "ends_with", "is_empty", "is_not_empty"],
  number:  ["eq", "neq", "gt", "gte", "lt", "lte", "between", "is_empty", "is_not_empty"],
  boolean: ["is_true", "is_false"],
  date:    ["eq", "neq", "before", "after", "between", "is_empty", "is_not_empty"],
  enum:    ["eq", "neq", "is_empty", "is_not_empty"],
};

export const OPERATOR_DEFS: Record<OperatorId, OperatorDef> = {
  eq:           { id: "eq",           label: "equals" },
  neq:          { id: "neq",          label: "not equals" },
  gt:           { id: "gt",           label: "greater than" },
  gte:          { id: "gte",          label: "greater than or equal" },
  lt:           { id: "lt",           label: "less than" },
  lte:          { id: "lte",          label: "less than or equal" },
  contains:     { id: "contains",     label: "contains" },
  not_contains: { id: "not_contains", label: "does not contain" },
  starts_with:  { id: "starts_with",  label: "starts with" },
  ends_with:    { id: "ends_with",    label: "ends with" },
  is_empty:     { id: "is_empty",     label: "is empty",     noValue: true },
  is_not_empty: { id: "is_not_empty", label: "is not empty", noValue: true },
  is_true:      { id: "is_true",      label: "is true",      noValue: true },
  is_false:     { id: "is_false",     label: "is false",     noValue: true },
  before:       { id: "before",       label: "before" },
  after:        { id: "after",        label: "after" },
  between:      { id: "between",      label: "between",      rangeValue: true },
};

// ─── Query Tree Nodes ─────────────────────────────────────────────────────────

export type RuleValue = string | number | boolean | null | [string | number, string | number];

export type RuleNode = {
  id: string;
  type: "rule";
  field: string;         // matches FieldSchema.name
  operator: OperatorId;
  value: RuleValue;
};

export type GroupNode = {
  id: string;
  type: "group";
  logic: "AND" | "OR";
  children: QueryNode[];
};

// The discriminated union — TypeScript will narrow automatically
export type QueryNode = RuleNode | GroupNode;

// ─── Validation ───────────────────────────────────────────────────────────────
export type ValidationError = {
  nodeId: string;
  message: string;
};
