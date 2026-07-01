# Add Item to a User's Vocabulary List — Design Spec

**Date:** 2026-06-28
**Scope:** `api/src/features/lists/items/` and `api/src/features/users/user.routes.ts`

---

## Context

The API already exposes GET endpoints for reading items from a user's vocabulary list:

- `GET /users/:userId/lists/:listId/items`
- `GET /users/:userId/lists/:listId/items/:itemId`

The corresponding **POST** endpoint to create an item is missing across all layers: route, controller, service, schema, and tests.

The repository layer already has `addVocabListItem` implemented.

---

## Endpoint

```
POST /users/:userId/lists/:listId/items
```

**Auth:** Bearer token required (`authenticate` middleware)

**Request body:**
```json
{
  "sourceText": "apple",
  "targetText": "la pomme"
}
```

**Success response — 201:**
```json
{
  "message": "Vocabulary list item added successfully",
  "data": {
    "id": "...",
    "listId": "...",
    "sourceText": "apple",
    "targetText": "la pomme",
    "position": 1,
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

## Architecture

### Schema — `item.schema.ts`

Add `addItemSchema` validating:
- `sourceText`: non-empty string, max 255 chars
- `targetText`: non-empty string, max 255 chars

Export `AddItemInput` type inferred from schema body.

### Service — `item.service.ts`

Add `addVocabListItem(userId: string, listId: string, data: AddItemInput): Promise<VocabularyListItem>`:

1. Call `listRepository.findVocabListByUserId(listId, userId)` — reuses the existing ownership check pattern; throws `NotFoundError` / `ForbiddenError` if the list doesn't exist or belongs to a different user.
2. Call `prisma.vocabularyListItem.count({ where: { listId: vocabList.id } })` to get the current item count.
3. Derive `position = count + 1`.
4. Call `listItemRepository.addVocabListItem({ listId: vocabList.id, sourceText, targetText, position })`.
5. Return the created item.

### Controller — `item.controller.ts`

Add `addVocabListItem` handler:
- Extracts `userId`, `listId` from `req.params` and `sourceText`, `targetText` from `req.body`.
- Delegates to `listItemService.addVocabListItem`.
- Returns `201` with message and data.

### Route — `user.routes.ts`

Add before the existing GET items routes (or after — order doesn't affect Express matching here):

```ts
router.post(
  '/:userId/lists/:listId/items',
  authenticate,
  validate(addItemSchema),
  listItemController.addVocabListItem,
);
```

With full OpenAPI JSDoc matching the existing route documentation style.

---

## Position assignment

`position` is auto-assigned by the service as `COUNT(items where listId) + 1`.

- The `VocabularyListItem` schema enforces `UNIQUE(listId, position)`, so caller-supplied positions would be error-prone.
- Auto-assignment keeps the API surface minimal and avoids conflicts.
- At current scale, a count query per insert is negligible. If needed later, a `MAX(position)` query or a sequence can replace it without changing the API contract.

---

## Error cases

| Condition | HTTP status | Error class |
|---|---|---|
| Missing / invalid `sourceText` or `targetText` | 400 | `BadRequestError` (via `validate`) |
| No auth token | 401 | `UnauthorizedError` |
| List not found or belongs to another user | 403 / 404 | thrown by `findVocabListByUserId` |

---

## Tests

### `item.routes.test.ts`

`describe('POST /users/:userId/lists/:listId/items')`:

- `201` — valid body, mocked service returns item
- `400` — missing `sourceText`
- `400` — missing `targetText`
- `401` — authenticate middleware throws `UnauthorizedError`
- `404` — service throws `NotFoundError` (list not found)

### `item.service.test.ts`

`describe('addVocabListItem')`:

- Creates item at `position = 1` when list is empty
- Creates item at `position = count + 1` when items already exist
- Throws when list does not belong to user (propagates from `findVocabListByUserId`)

---

## Files changed

| File | Change |
|---|---|
| `api/src/features/lists/items/item.schema.ts` | Add `addItemSchema` and `AddItemInput` type |
| `api/src/features/lists/items/item.service.ts` | Add `addVocabListItem` |
| `api/src/features/lists/items/item.controller.ts` | Add `addVocabListItem` handler |
| `api/src/features/users/user.routes.ts` | Add POST route with OpenAPI doc |
| `api/src/features/lists/items/__tests__/item.routes.test.ts` | Route integration tests |
| `api/src/features/lists/items/__tests__/item.service.test.ts` | Service unit tests |

No repository changes needed — `addVocabListItem` is already implemented.
