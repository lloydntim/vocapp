# RouteContext and the Type-Check Script

## Quick summary

The web app now has this script in `web/package.json`:

```json
"typecheck": "next typegen && tsc --noEmit"
```

This script prepares Next.js route types and then checks the TypeScript code for errors. It does not produce a build.

## The problem

A Next.js Route Handler receives route parameters in its second argument. For example, a route stored at:

```text
app/api/users/[userId]/lists/[listId]/route.ts
```

currently types its parameters by hand:

```ts
{ params }: {
  params: Promise<{
    userId: string
    listId: string
  }>
}
```

This works, but the type is separate from the actual folder structure. If `[listId]` is renamed, TypeScript may still accept the old hand-written type even though it is no longer accurate.

## The Next.js alternative

Next.js provides a generated `RouteContext` type:

```ts
RouteContext<'/api/users/[userId]/lists/[listId]'>
```

It reads the expected parameters from the route path. This keeps the handler's types connected to the real routes in the project.

For example:

```ts
export async function GET(
  request: Request,
  { params }: RouteContext<'/api/users/[userId]/lists/[listId]'>
) {
  const { userId, listId } = await params
}
```

No import is required because Next.js declares `RouteContext` globally.

## Why `next typegen` is needed

`RouteContext` is not a permanent type included directly in the `next` package. Next.js generates it after scanning the application's `app/` directory.

The generated declarations are written to locations such as:

```text
.next/types/routes.d.ts
.next/dev/types/routes.d.ts
```

Commands such as `next dev` and `next build` generate these route types automatically. However, a fresh checkout or a CI job might run `tsc --noEmit` before either command has run. In that situation, TypeScript would not know what `RouteContext` means.

Running `next typegen` first solves this without requiring a complete build.

## What the new script does

```text
next typegen  →  tsc --noEmit
```

1. `next typegen` scans the routes and generates the Next.js types.
2. `tsc --noEmit` checks the TypeScript code without creating JavaScript files.

This makes the command self-contained:

```bash
pnpm run typecheck
```

It can run successfully on a clean checkout even when the `.next` generated types do not exist yet.

## Why this is useful

- Route parameter types stay connected to the actual folder structure.
- Renaming a route segment causes a useful compile-time error.
- Local checks and CI do not depend on someone having run development mode or a build first.
- Type checking remains lighter than running a full production build.

## Current status

Completed:

- Added the `typecheck` script to `web/package.json`.
- Confirmed that the script regenerates deleted route types.
- Confirmed that TypeScript checking succeeds after generation.

Still to do:

- Replace the hand-written parameter types in `lists/[listId]/route.ts` and related Route Handlers with the appropriate `RouteContext<'...'>` types.

## In one sentence

The new script generates route-aware Next.js types before running TypeScript, making `RouteContext` reliable on both developer machines and clean CI environments.
