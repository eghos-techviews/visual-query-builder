import { FieldSchema } from "@/lib/query-tree/types";

export const DEFAULT_SCHEMA: FieldSchema[] = [
  { name: "name",      label: "Name",       type: "string" },
  { name: "age",       label: "Age",        type: "number" },
  { name: "email",     label: "Email",      type: "string" },
  { name: "status",    label: "Status",     type: "enum",   enumValues: ["active", "inactive", "pending"] },
  { name: "country",   label: "Country",    type: "enum",   enumValues: ["Nigeria", "Ghana", "Kenya", "South Africa", "Egypt"] },
  { name: "createdAt", label: "Created At", type: "date" },
  { name: "verified",  label: "Verified",   type: "boolean" },
];
