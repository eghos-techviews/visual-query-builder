import { describe, it, expect } from "vitest";
import { SCHEMA_REGISTRY, getSchemaConfig, JOBS_SCHEMA, COMPANIES_SCHEMA, APPLICANTS_SCHEMA } from "@/lib/schema/schemas";

describe("SCHEMA_REGISTRY", () => {
  it("contains at least 4 schemas", () => {
    expect(SCHEMA_REGISTRY.length).toBeGreaterThanOrEqual(4);
  });

  it("every schema has required fields", () => {
    for (const s of SCHEMA_REGISTRY) {
      expect(s).toHaveProperty("id");
      expect(s).toHaveProperty("label");
      expect(s).toHaveProperty("tableName");
      expect(s.schema.length).toBeGreaterThan(0);
      expect(typeof s.getData).toBe("function");
    }
  });

  it("getData() returns a non-empty array for every schema", () => {
    for (const s of SCHEMA_REGISTRY) {
      const data = s.getData();
      expect(Array.isArray(data)).toBe(true);
      expect(data.length).toBeGreaterThan(0);
    }
  });
});

describe("getSchemaConfig", () => {
  it("returns the correct schema for a known id", () => {
    expect(getSchemaConfig("jobs").id).toBe("jobs");
    expect(getSchemaConfig("companies").id).toBe("companies");
    expect(getSchemaConfig("applicants").id).toBe("applicants");
    expect(getSchemaConfig("users").id).toBe("users");
  });

  it("falls back to the first schema for an unknown id", () => {
    const fallback = getSchemaConfig("does-not-exist");
    expect(fallback).toBeDefined();
    expect(SCHEMA_REGISTRY[0].id).toBe(fallback.id);
  });
});

describe("JOBS_SCHEMA", () => {
  it("has a salary field typed as number", () => {
    const f = JOBS_SCHEMA.find((f) => f.name === "salary");
    expect(f?.type).toBe("number");
  });

  it("has a status enum with open/closed/paused", () => {
    const f = JOBS_SCHEMA.find((f) => f.name === "status");
    expect(f?.type).toBe("enum");
    expect(f?.enumValues).toContain("open");
    expect(f?.enumValues).toContain("closed");
    expect(f?.enumValues).toContain("paused");
  });

  it("has a remote boolean field", () => {
    const f = JOBS_SCHEMA.find((f) => f.name === "remote");
    expect(f?.type).toBe("boolean");
  });
});

describe("COMPANIES_SCHEMA", () => {
  it("has a rating field typed as number", () => {
    const f = COMPANIES_SCHEMA.find((f) => f.name === "rating");
    expect(f?.type).toBe("number");
  });

  it("has a verified boolean field", () => {
    const f = COMPANIES_SCHEMA.find((f) => f.name === "verified");
    expect(f?.type).toBe("boolean");
  });
});

describe("APPLICANTS_SCHEMA", () => {
  it("has a status enum with interview and offer stages", () => {
    const f = APPLICANTS_SCHEMA.find((f) => f.name === "status");
    expect(f?.enumValues).toContain("interview");
    expect(f?.enumValues).toContain("offer");
  });

  it("has an experience field typed as number", () => {
    const f = APPLICANTS_SCHEMA.find((f) => f.name === "experience");
    expect(f?.type).toBe("number");
  });
});
