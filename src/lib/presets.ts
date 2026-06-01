import { GroupNode } from "./query-tree/types";

export type Preset = {
  id: string;
  label: string;
  description: string;
  tree: GroupNode;
};

export const PRESETS: Preset[] = [
  {
    id: "active-adults",
    label: "Active adults",
    description: "age > 18 AND status = active",
    tree: {
      id: "root", type: "group", logic: "AND",
      children: [
        { id: "p1r1", type: "rule", field: "age",    operator: "gt", value: 18       },
        { id: "p1r2", type: "rule", field: "status", operator: "eq", value: "active" },
      ],
    },
  },
  {
    id: "nigeria-or-ghana",
    label: "Nigeria or Ghana",
    description: "verified users from Nigeria or Ghana",
    tree: {
      id: "root", type: "group", logic: "AND",
      children: [
        { id: "p2r1", type: "rule", field: "verified", operator: "is_true", value: null },
        {
          id: "p2g1", type: "group", logic: "OR",
          children: [
            { id: "p2r2", type: "rule", field: "country", operator: "eq", value: "Nigeria" },
            { id: "p2r3", type: "rule", field: "country", operator: "eq", value: "Ghana"   },
          ],
        },
      ],
    },
  },
  {
    id: "young-pending",
    label: "Young & pending",
    description: "age between 18–25 AND status = pending",
    tree: {
      id: "root", type: "group", logic: "AND",
      children: [
        { id: "p3r1", type: "rule", field: "age",    operator: "between", value: [18, 25]    },
        { id: "p3r2", type: "rule", field: "status", operator: "eq",      value: "pending"   },
      ],
    },
  },
  {
    id: "name-search",
    label: "Name search",
    description: "name contains 'a'",
    tree: {
      id: "root", type: "group", logic: "AND",
      children: [
        { id: "p4r1", type: "rule", field: "name", operator: "contains", value: "a" },
      ],
    },
  },
];
