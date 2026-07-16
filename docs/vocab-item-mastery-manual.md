# Vocab item mastery implementation manual

This manual adds a reversible mastery state to each vocabulary item across PostgreSQL, Prisma, the REST API, and the web app.

## Decision and behaviour

Use two states:

- `LEARNING`: the default for new and existing items.
- `MASTERED`: explicitly selected through **Mark as mastered**.

The action must be reversible through **Mark as learning** (or **Undo mastery**). The API, rather than the browser, is the source of truth.

Do not add a `NEW` state until the product distinguishes an unpractised item from an item being learned. Do not store both a `status` and an `isMastered` boolean; they can contradict each other.

## API contract

Add this authenticated endpoint:

```http
PATCH /api/v1/users/{userId}/lists/{listId}/items/{itemId}/status
Content-Type: application/json
Authorization: Bearer <token>

{
  "status": "MASTERED"
}
```

Successful response (`200`):

```json
{
  "message": "Vocabulary list item status updated successfully",
  "data": {
    "id": "...",
    "listId": "...",
    "position": 1,
    "sourceText": "apple",
    "targetText": "la pomme",
    "status": "MASTERED",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

Only `LEARNING` and `MASTERED` are valid. Return `400` for any other value, `401` for an unauthenticated request, `403` when the URL's `userId` is not the authenticated user, and `404` when the list/item relationship does not exist.

Use an explicit status endpoint instead of allowing arbitrary item fields to be patched. This keeps the mastery action narrow and prevents clients from modifying `listId`, `position`, or timestamps.

## 1. Database and Prisma

Edit `api/prisma/schema.prisma` and add the enum:

```prisma
enum VocabularyItemStatus {
  LEARNING
  MASTERED
}
```

Add this field to `VocabularyListItem`:

```prisma
status VocabularyItemStatus @default(LEARNING)
```

The default safely backfills existing rows as `LEARNING` and ensures callers do not have to supply a status when creating an item.

From the repository root, run:

```bash
pnpm --filter @vocapp/api db:migrate --name add_vocab_item_status
pnpm --filter @vocapp/api db:generate
```

Inspect the generated SQL under `api/prisma/migrations/`. It should create the PostgreSQL enum, add a non-null `status` column, and set its default to `LEARNING`. Do not edit the existing migration files.

For production, commit the generated migration and run Prisma's deployment command in the deployment pipeline:

```bash
pnpm --filter @vocapp/api exec prisma migrate deploy
```

Deploy the database migration before or together with the compatible API. The old API remains compatible because the database supplies the default.

## 2. Request validation

In `api/src/features/lists/items/item.schema.ts`:

1. Import `VocabularyItemStatus` from the generated Prisma enums module.
2. Add params containing `userId`, `listId`, and `itemId`, all UUIDs (reuse/extend the existing parameter schemas where practical).
3. Add a schema for the status body.

Suggested shape:

```ts
body: z.object({
  status: z.nativeEnum(VocabularyItemStatus),
})
```

Export the inferred body type, for example `UpdateItemStatusInput`.

Keep creation unchanged: `POST .../items` should omit `status`, allowing every new item to start as `LEARNING`. This also prevents a creation client from bypassing the intended mastery action.

## 3. Repository

In `api/src/features/lists/items/item.repository.ts`, add a narrowly typed function:

```ts
async function updateVocabListItemStatus(
  itemId: string,
  listId: string,
  status: VocabularyItemStatus,
): Promise<VocabularyListItem>
```

Update with a compound ownership condition, not `itemId` alone:

```ts
prisma.vocabularyListItem.update({
  where: { id: itemId, listId },
  data: { status },
})
```

Map Prisma `P2025` to the existing item-not-found message. Including `listId` prevents an item from another list being updated through a mismatched URL.

Export the new function from the repository's default object.

## 4. Service and authorization

In `api/src/features/lists/items/item.service.ts`, add:

```ts
updateVocabListItemStatus(userId, listId, itemId, data)
```

The service must:

1. Call `listRepository.findVocabListByUser(listId, userId)` to establish that the list belongs to the user.
2. Call the new repository method with `itemId`, the verified list ID, and `data.status`.
3. Return the updated item.

Do not update by `itemId` directly from the controller. Both list ownership and item membership must be established server-side.

Export the service method.

## 5. Controller and route

In `api/src/features/lists/items/item.controller.ts`, add a handler that reads the three route params and validated status body, calls the service, and returns the `200` response shown above.

In `api/src/features/users/user.routes.ts`, register:

```ts
router.patch(
  '/:userId/lists/:listId/items/:itemId/status',
  authenticate,
  validate(updateItemStatusSchema),
  authorizeOwner,
  listItemController.updateVocabListItemStatus,
);
```

Add OpenAPI JSDoc for the endpoint. Also update the `VocabularyListItem` schema in `api/src/docs/swagger.ts`:

```ts
status: {
  type: 'string',
  enum: ['LEARNING', 'MASTERED'],
  example: 'LEARNING',
},
```

## 6. List mastery counts

The current web mocks store `mastered` independently on a list. Once real API data is used, calculate this from items so the count cannot drift:

```ts
const mastered = items.filter((item) => item.status === 'MASTERED').length;
const total = items.length;
const masteryPercent = total === 0 ? 0 : Math.round((mastered / total) * 100);
```

At the current scale, deriving this after fetching list items is sufficient. If list-summary endpoints later need these values without loading all items, add a Prisma `_count` query filtered by `MASTERED`; do not introduce a manually maintained counter unless updates are transactional.

## 7. Frontend types, mocks, and action

In `web/src/features/vocab-items/types.ts`, add:

```ts
export type VocabItemStatus = 'LEARNING' | 'MASTERED';
```

Then add `status: VocabItemStatus` to `VocabListItem`.

The current type declares `createdAt` and `updatedAt` as `Date`, while the mocks and JSON API use ISO strings and bypass checking with `as unknown as`. Prefer representing API values honestly:

```ts
createdAt: string;
updatedAt: string;
```

Update every entry in `web/src/features/vocab-items/mocks/mockItems.ts` with a mixture of `LEARNING` and `MASTERED`, then remove `as unknown as VocabListItem[]` in favour of:

```ts
] satisfies VocabListItem[];
```

This makes missing or invalid statuses fail at compile time.

The button behaviour should be:

```ts
const nextStatus = item.status === 'MASTERED' ? 'LEARNING' : 'MASTERED';
```

On click:

1. Disable the action while the request is pending.
2. Send the `PATCH` request with `nextStatus`.
3. Replace the local/cache item with the returned item.
4. Recalculate or invalidate the list mastery summary.
5. On failure, retain/restore the old value and show an error.

An optimistic update is optional. Start with updating after a successful response unless the UI already has a consistent cache and rollback mechanism.

Display labels should be user-facing sentence case (`Learning`, `Mastered`); the uppercase values are transport and database values.

## 8. Tests

Update existing item fixtures in:

- `api/src/features/lists/items/__tests__/item.routes.test.ts`
- `api/src/features/lists/items/__tests__/item.service.test.ts`

Add `status: VocabularyItemStatus.LEARNING` to mocks because the generated `VocabularyListItem` type will require it.

Add service tests for:

- changing `LEARNING` to `MASTERED`;
- changing `MASTERED` back to `LEARNING`;
- rejecting a list not owned by the user;
- rejecting an item that is not in the verified list.

Add route tests for:

- `200` with `MASTERED`;
- `200` with `LEARNING` (reversal);
- `400` for a missing or invalid status;
- `401` without authentication;
- `403` when `authorizeOwner` rejects the user;
- `404` for a missing list or item.

Add frontend tests, if the item control has a component test suite, confirming the label changes, one request is issued, double clicks are prevented while pending, and an API failure preserves the previous state.

## 9. Verification checklist

Run from the repository root:

```bash
pnpm --filter @vocapp/api build
pnpm --filter @vocapp/api test
pnpm --filter @vocapp/api db:status
pnpm --filter ./web lint
pnpm --filter ./web test
```

Adjust the web filter only if the workspace package name differs; `web/package.json` is authoritative.

Then manually verify:

1. Existing database items return `status: "LEARNING"`.
2. Newly created items return `status: "LEARNING"` without sending it in the POST body.
3. **Mark as mastered** changes the item and the list's mastered count.
4. **Mark as learning** reverses both.
5. Refreshing the page preserves the state.
6. A user cannot update another user's item.
7. An item ID paired with the wrong list ID returns `404` and remains unchanged.

## Files expected to change

| Layer | File |
|---|---|
| Database | `api/prisma/schema.prisma` |
| Migration | `api/prisma/migrations/<timestamp>_add_vocab_item_status/migration.sql` |
| Validation | `api/src/features/lists/items/item.schema.ts` |
| Repository | `api/src/features/lists/items/item.repository.ts` |
| Service | `api/src/features/lists/items/item.service.ts` |
| Controller | `api/src/features/lists/items/item.controller.ts` |
| Routes/OpenAPI | `api/src/features/users/user.routes.ts` |
| Shared OpenAPI schema | `api/src/docs/swagger.ts` |
| API tests | `api/src/features/lists/items/__tests__/item.routes.test.ts` |
| API tests | `api/src/features/lists/items/__tests__/item.service.test.ts` |
| Web type | `web/src/features/vocab-items/types.ts` |
| Web mocks | `web/src/features/vocab-items/mocks/mockItems.ts` |
| Web UI/API integration | The component or data layer that owns the item action |

## Future extension

If practice results later determine mastery automatically, keep `status` as the effective user-facing value but first decide whether a manual override must win over the algorithm. At that point, fields such as `masteredAt`, `masteryScore`, or `statusOverride` may be warranted. They are unnecessary for the current manual toggle.
