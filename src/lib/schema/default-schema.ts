import { FieldSchema } from "@/lib/query-tree/types";

export const DEFAULT_SCHEMA: FieldSchema[] = [
  { name: "id",            label: "ID",              type: "string" },
  { name: "name",          label: "Name",            type: "string" },
  { name: "email",         label: "Email",           type: "string" },
  { name: "age",           label: "Age",             type: "number" },
  { name: "status",        label: "Status",          type: "enum",     enumValues: ["active", "inactive", "pending"] },
  { name: "country",       label: "Country",         type: "enum",     enumValues: ["Nigeria", "USA", "Canada", "UK", "Australia"] },
  { name: "createdAt",     label: "Created At",      type: "date" },
  { name: "isVerified",    label: "Is Verified",     type: "boolean" },
  { name: "purchaseCount", label: "Purchase Count",  type: "number" },
];
