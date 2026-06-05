import { FieldSchema } from "@/lib/query-tree/types";
import { DEFAULT_SCHEMA } from "./default-schema";
import { MOCK_USERS } from "@/lib/mock-data";
import { MOCK_JOBS } from "@/lib/mock-data/jobs";
import { MOCK_COMPANIES } from "@/lib/mock-data/companies";
import { MOCK_APPLICANTS } from "@/lib/mock-data/applicants";

export const JOBS_SCHEMA: FieldSchema[] = [
  { name: "id",             label: "ID",              type: "string" },
  { name: "title",          label: "Title",           type: "string" },
  { name: "company",        label: "Company",         type: "string" },
  { name: "location",       label: "Location",        type: "string" },
  { name: "type",           label: "Job Type",        type: "enum",   enumValues: ["full-time", "part-time", "contract", "internship"] },
  { name: "level",          label: "Level",           type: "enum",   enumValues: ["junior", "mid", "senior", "lead"] },
  { name: "salary",         label: "Salary",          type: "number" },
  { name: "remote",         label: "Remote",          type: "boolean" },
  { name: "status",         label: "Status",          type: "enum",   enumValues: ["open", "closed", "paused"] },
  { name: "postedAt",       label: "Posted At",       type: "date" },
  { name: "applicantCount", label: "Applicant Count", type: "number" },
];

export const COMPANIES_SCHEMA: FieldSchema[] = [
  { name: "id",         label: "ID",          type: "string" },
  { name: "name",       label: "Name",        type: "string" },
  { name: "industry",   label: "Industry",    type: "enum", enumValues: ["Fintech", "Banking", "Tech Talent", "Media", "Open Finance", "Data & Analytics", "HR Tech", "Health Tech", "Communication APIs", "Crypto", "Agritech", "Lifestyle"] },
  { name: "size",       label: "Company Size", type: "enum", enumValues: ["1-10", "11-50", "51-200", "201-500", "500+"] },
  { name: "location",   label: "Location",    type: "string" },
  { name: "country",    label: "Country",     type: "string" },
  { name: "rating",     label: "Rating",      type: "number" },
  { name: "openRoles",  label: "Open Roles",  type: "number" },
  { name: "founded",    label: "Founded",     type: "number" },
  { name: "remote",     label: "Remote",      type: "boolean" },
  { name: "verified",   label: "Verified",    type: "boolean" },
];

export const APPLICANTS_SCHEMA: FieldSchema[] = [
  { name: "id",                 label: "ID",                 type: "string" },
  { name: "name",               label: "Name",               type: "string" },
  { name: "email",              label: "Email",              type: "string" },
  { name: "role",               label: "Role",               type: "string" },
  { name: "experience",         label: "Experience (yrs)",   type: "number" },
  { name: "skills",             label: "Skills",             type: "string" },
  { name: "location",           label: "Location",           type: "string" },
  { name: "status",             label: "Status",             type: "enum", enumValues: ["applied", "screening", "interview", "offer", "rejected"] },
  { name: "source",             label: "Source",             type: "enum", enumValues: ["linkedin", "referral", "direct", "job-board"] },
  { name: "appliedAt",          label: "Applied At",         type: "date" },
  { name: "salaryExpectation",  label: "Salary Expectation", type: "number" },
  { name: "available",          label: "Available",          type: "boolean" },
];

export interface SchemaConfig {
  id: string;
  label: string;
  description: string;
  tableName: string;
  schema: FieldSchema[];
  getData: () => Record<string, unknown>[];
}

export const SCHEMA_REGISTRY: SchemaConfig[] = [
  {
    id: "users",
    label: "Users Database",
    description: "User accounts and profiles",
    tableName: "users",
    schema: DEFAULT_SCHEMA,
    getData: () => MOCK_USERS as unknown as Record<string, unknown>[],
  },
  {
    id: "jobs",
    label: "Jobs",
    description: "Job listings and postings",
    tableName: "jobs",
    schema: JOBS_SCHEMA,
    getData: () => MOCK_JOBS as unknown as Record<string, unknown>[],
  },
  {
    id: "companies",
    label: "Companies",
    description: "Employer profiles and details",
    tableName: "companies",
    schema: COMPANIES_SCHEMA,
    getData: () => MOCK_COMPANIES as unknown as Record<string, unknown>[],
  },
  {
    id: "applicants",
    label: "Applicants",
    description: "Job applicant profiles",
    tableName: "applicants",
    schema: APPLICANTS_SCHEMA,
    getData: () => MOCK_APPLICANTS as unknown as Record<string, unknown>[],
  },
];

export function getSchemaConfig(id: string): SchemaConfig {
  return SCHEMA_REGISTRY.find((s) => s.id === id) ?? SCHEMA_REGISTRY[0];
}
