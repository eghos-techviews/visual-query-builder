# Visual Query Builder

A schema-aware, visual query builder that generates **SQL**, **MongoDB**, and **GraphQL** (Hasura-style) filter output in real time. Built with Next.js, Zustand, and dnd-kit.

## Features

| Feature | Details |
|---|---|
| Recursive condition groups | Unlimited nesting of AND/OR groups |
| Schema-driven rendering | Fields, operators, and value inputs adapt to field type |
| Live query output | SQL · MongoDB · GraphQL updated on every keystroke |
| Query execution | Runs against mock datasets, shows results in a sortable table |
| Drag and drop | Reorder rules and groups with dnd-kit |
| Undo / Redo | Full undo history via Zustand + zundo temporal middleware |
| Query history | Save, reload, and delete named queries (localStorage) |
| Export / Import | Download query trees as JSON, re-import from file |
| Dark mode | System preference detected, manually toggleable |
| Keyboard shortcuts | `⌘↵` run · `⌘Z` undo · `⌘⇧Z` redo · `?` shortcuts modal |
| Validation | Inline errors per rule (empty value, wrong operator for type) |

## Schemas

Four mock datasets, each with 20 records:

- **Jobs** — Job listings (title, salary, type, level, remote, status)
- **Companies** — Employer profiles (industry, size, rating, verified)
- **Applicants** — Candidate profiles (experience, skills, status, source)
- **Users** — User accounts (age, country, status, isVerified)

## Tech Stack

- **Next.js 16** (App Router, TypeScript)
- **Zustand 5** + **zundo** — state management with temporal undo/redo
- **dnd-kit** — drag-and-drop condition reordering
- **Tailwind CSS 4** — styling
- **Vitest** — unit tests

## Getting Started

```bash
npm install
npm run dev        # http://localhost:3000
npm test           # run 89 unit tests
npm run build      # production build
```

## Project Structure

```
src/
├── app/
│   ├── page.tsx                    # Landing page
│   └── workspace/[id]/page.tsx     # Workspace route
├── components/
│   ├── query-builder/
│   │   ├── GroupNode.tsx           # Recursive group with DnD context
│   │   └── RuleNode.tsx            # Single rule row (field/operator/value)
│   ├── results/
│   │   └── ResultsTable.tsx        # Sortable results table with skeleton
│   └── workspace/
│       ├── WorkspaceClient.tsx     # 3-column workspace layout
│       └── ShortcutsHelp.tsx       # Keyboard shortcuts popover
├── lib/
│   ├── mock-data/                  # Jobs, Companies, Applicants, Users datasets
│   ├── query-engine/
│   │   └── executor.ts             # Generic query executor (DataRecord[])
│   ├── query-history.ts            # Save/load/export/import query trees
│   ├── query-tree/
│   │   ├── generators.ts           # SQL · MongoDB · GraphQL generators
│   │   ├── operations.ts           # Immutable tree mutations
│   │   ├── selectors.ts            # Tree introspection helpers
│   │   └── types.ts                # GroupNode · RuleNode · FieldSchema · operators
│   ├── schema/
│   │   ├── default-schema.ts       # User schema definition
│   │   └── schemas.ts              # SchemaRegistry + getSchemaConfig()
│   └── validation/
│       └── validate.ts             # Per-rule validation (field type + operator + value)
└── store/
    └── query-store.ts              # Zustand store + switchSchema()
```

## Architecture Notes

**Schema registry pattern** — `SchemaConfig` maps an ID to a `FieldSchema[]` and a `getData()` function. Switching schemas via `switchSchema()` is a structural operation outside the undo stack; it clears temporal history so undo does not reach across schema boundaries.

**Generic executor** — `executeQuery(root, DataRecord[])` is fully generic with no reference to any specific data model. Every rule operator maps to a predicate function; groups recurse with AND (`every`) or OR (`some`).

**GraphQL output** — Uses a custom `gqlStringify()` serializer (no commas between array items, unquoted keys) to produce valid Hasura-style GraphQL argument syntax following the `{ _and: [...] }` / `{ field: { _eq: value } }` filter schema.

**Undo/Redo** — `zundo` wraps the Zustand store. Only `root` and `schema` are tracked in the temporal snapshot. `switchSchema()` calls `temporal.getState().clear()` so history resets on schema change.

## PR History

| PR | Branch | Description |
|---|---|---|
| #9  | `feat/multi-schema`         | Multi-schema support — Jobs, Companies, Applicants datasets |
| #10 | `feat/graphql-generator`    | GraphQL (Hasura-style) query generator + 12 tests |
| #11 | `feat/workspace-rebuild`    | 3-column workspace with tabbed SQL/MongoDB/GraphQL output |
| #12 | `feat/landing-page`         | Product landing page with schema quick-launch cards |
| #13 | `feat/interactions-polish`  | Animated transitions, skeleton loader, keyboard shortcuts modal |
| #14 | `feat/tests-readme`         | 29 new unit tests (89 total) + README |

## Tests

```
src/__tests__/
├── execution/
│   ├── execute.test.ts             # Basic executor tests
│   └── executor-advanced.test.ts   # String · numeric · boolean · nested logic (28 tests)
├── query-tree/
│   ├── generators.test.ts          # SQL · MongoDB · GraphQL (23 tests)
│   ├── operations.test.ts          # Tree mutations (11 tests)
│   └── selectors.test.ts           # Tree introspection (12 tests)
├── schema/
│   └── schemas.test.ts             # Schema registry + field types (12 tests)
└── validation/
    └── validate.test.ts            # Validation rules (7 tests)
```
