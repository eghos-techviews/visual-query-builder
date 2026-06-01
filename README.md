# Visual Query Builder

A web app that lets you build complex database queries visually — no syntax required. Think Supabase filters or Postman query builder, but with deeply nestable logic groups, live query preview, and a simulated execution engine.

Live demo: _coming soon (Vercel)_

---

## What it does

- Build filter conditions visually with field / operator / value chips
- Nest groups inside groups — unlimited depth, AND/OR logic per group
- Edit the schema on the fly — add or remove fields, the UI adapts
- See SQL and MongoDB query output update in real time as you build
- Run the query against a mock dataset and inspect matching results
- Drag and drop to reorder rules and groups
- Undo any change, collapse groups, export/import queries as JSON
- Dark and light mode

---

## Architecture

### Query tree

Everything is a recursive tree of two node types:

```ts
type RuleNode  = { id, type: "rule",  field, operator, value }
type GroupNode = { id, type: "group", logic: "AND"|"OR", children: QueryNode[] }
type QueryNode = RuleNode | GroupNode
```

The root is always a `GroupNode`. Groups can contain rules or other groups — that's where the unlimited nesting comes from. TypeScript's discriminated union on `type` means you never need to cast: `if (node.type === "group")` gives you `GroupNode` automatically.

### Recursive rendering strategy

`GroupNode.tsx` renders its `children` array. When a child is itself a group, it renders another `GroupNode` — so the component calls itself. This is the core recursive pattern. Depth is tracked as a prop to apply visual tinting at each nesting level.

```
<GroupNode depth={0}>        ← root, cream background
  <RuleNode />
  <GroupNode depth={1}>      ← nested, slightly darker tint
    <RuleNode />
    <GroupNode depth={2}>    ← deeper still
      ...
    </GroupNode>
  </GroupNode>
</GroupNode>
```

### State management

Zustand store is intentionally thin — it holds the tree and calls pure functions from `lib/query-tree/operations.ts`. Those functions take a tree and return a new tree (immutable). The store just does `set({ root: addRule(state.root, parentId) })`.

This separation means all the tree logic is testable without React or Zustand. `zundo` middleware wraps the store for undo/redo without any manual snapshot management.

### Query generation

`lib/query-tree/generators.ts` walks the tree recursively and produces SQL-like or MongoDB-style output. Pure function — takes a `GroupNode`, returns a string. Zero side effects, easy to test.

### Validation engine

`lib/validation/validate.ts` walks the tree and returns a flat array of `{ nodeId, message }` errors. Components look up their own node id in that array to show inline errors. Run Query is disabled while errors exist.

### Performance

- All tree operations are immutable — React only re-renders components whose props actually changed
- `memo()` on `RuleNode` and `GroupNode` — a deep change doesn't re-render the whole tree
- SQL/Mongo output computed with `useMemo` — only recalculates when root changes
- `useTransition` on query execution — keeps the UI responsive while filtering

---

## Folder structure

```
src/
├── app/                      # Next.js App Router
├── components/
│   ├── query-builder/        # GroupNode, RuleNode, QueryBuilder orchestrator
│   ├── query-preview/        # SQL/Mongo preview, results table
│   ├── schema-editor/        # Editable field list
│   └── ui/                   # Shadcn + ThemeToggle
├── lib/
│   ├── query-tree/           # types, operations (pure), generators
│   ├── schema/               # default schema
│   ├── validation/           # validation engine
│   └── execution/            # mock data filter engine
└── store/
    └── query-store.ts        # Zustand + zundo
```

---

## Trade-offs

- **Flat errors array vs inline state** — validation errors live outside the tree (flat array keyed by nodeId) rather than embedded in each node. Simpler to compute and clear, but requires a lookup per component render.
- **Mock dataset is hardcoded** — intentional. The execution engine is schema-agnostic so wiring up a real API endpoint is straightforward.
- **No URL persistence** — query state lives in memory. Export/import JSON covers the save use case without needing URL serialization.

---

## Running locally

```bash
npm install
npm run dev
```

Tests:

```bash
npm test
```

---

## Tech stack

- Next.js 16 (App Router) + TypeScript
- TailwindCSS + Shadcn/UI
- Zustand + zundo (undo/redo)
- DnD Kit (drag and drop)
- Vitest + React Testing Library
