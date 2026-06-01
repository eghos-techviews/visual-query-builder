import { GroupNode, QueryNode, RuleNode, ValidationError, FieldSchema, OPERATORS_BY_TYPE, OPERATOR_DEFS } from "@/lib/query-tree/types";

export function validateTree(root: GroupNode, schema: FieldSchema[]): ValidationError[] {
  const errors: ValidationError[] = [];
  validateNode(root, schema, errors);
  return errors;
}

function validateNode(node: QueryNode, schema: FieldSchema[], errors: ValidationError[]) {
  if (node.type === "group") {
    if (node.children.length === 0) {
      errors.push({ nodeId: node.id, message: "Group is empty — add at least one rule." });
    }
    node.children.forEach((c) => validateNode(c, schema, errors));
    return;
  }
  validateRule(node, schema, errors);
}

function validateRule(rule: RuleNode, schema: FieldSchema[], errors: ValidationError[]) {
  const field = schema.find((f) => f.name === rule.field);
  if (!field) {
    errors.push({ nodeId: rule.id, message: `Unknown field "${rule.field}".` });
    return;
  }

  const allowed = OPERATORS_BY_TYPE[field.type];
  if (!allowed.includes(rule.operator)) {
    errors.push({ nodeId: rule.id, message: `Operator "${rule.operator}" is not valid for a ${field.type} field.` });
    return;
  }

  const opDef = OPERATOR_DEFS[rule.operator];
  if (opDef.noValue) return; // no value needed

  if (opDef.rangeValue) {
    if (!Array.isArray(rule.value) || rule.value[0] === "" || rule.value[1] === "") {
      errors.push({ nodeId: rule.id, message: "Both values are required for a range." });
    }
    return;
  }

  if (rule.value === "" || rule.value === null) {
    errors.push({ nodeId: rule.id, message: "Value is required." });
  }
}
