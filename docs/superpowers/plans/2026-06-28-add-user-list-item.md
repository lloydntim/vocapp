# Add Item to User's Vocabulary List — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add `POST /users/:userId/lists/:listId/items` so a caller can append a vocabulary item to one of their lists, with `position` auto-assigned by the service.

**Architecture:** Schema validates `sourceText` and `targetText`. The service verifies list ownership via the list repository, computes `position = existingItemCount + 1`, then delegates creation to the item repository (which already has `addVocabListItem`). The controller is a thin HTTP adapter. All new code follows TDD — tests first.

**Tech Stack:** Express 5, TypeScript, Prisma, Zod (validation), Vitest + Supertest (tests), pnpm.

---

## File Map

| File | Change |
|---|---|
| `api/src/features/lists/items/item.schema.ts` | Create — `addItemSchema`, `AddItemInput` type |
| `api/src/features/lists/items/__tests__/item.service.test.ts` | Create — service unit tests |
| `api/src/features/lists/items/item.service.ts` | Modify — add `addVocabListItem` |
| `api/src/features/lists/items/__tests__/item.routes.test.ts` | Create — route integration tests |
| `api/src/features/lists/items/item.controller.ts` | Modify — add `addVocabListItem` handler |
| `api/src/features/users/user.routes.ts` | Modify — add POST route + OpenAPI doc |

The item repository (`item.repository.ts`) already has `addVocabListItem` — **do not modify it**.

---

## Task 1: Add `addItemSchema`

**Files:**
- Create: `api/src/features/lists/items/item.schema.ts`

- [ ] **Step 1: Write the schema**

Replace the empty file at `api/src/features/lists/items/item.schema.ts` with:

```ts
import z from 'zod';

export const addItemSchema = z.object({
  body: z.object({
    sourceText: z.string().min(1).max(255),
    targetText: z.string().min(1).max(255),
  }),
});

export type AddItemInput = z.infer<typeof addItemSchema>['body'];
```

- [ ] **Step 2: Commit**

```bash
git add api/src/features/lists/items/item.schema.ts
git commit -m "feat(items): add addItemSchema with sourceText and targetText validation"
```

---

## Task 2: Add `addVocabListItem` to the service (TDD)

**Files:**
- Create: `api/src/features/lists/items/__tests__/item.service.test.ts`
- Modify: `api/src/features/lists/items/item.service.ts`

**Context:** The list repository exports `findVocabListByUser(id, userId)`. The item repository exports `findVocabListItemsByListId(listId)` and `addVocabListItem({ listId, sourceText, targetText, position })`.

- [ ] **Step 1: Write the failing service tests**

Create `api/src/features/lists/items/__tests__/item.service.test.ts`:

```ts
import { describe, expect, it, vi } from 'vitest';
import { NotFoundError } from '../../../../errors/NotFoundError.js';
import listRepository from '../../list.repository.js';
import listItemRepository from '../item.repository.js';
import listItemService from '../item.service.js';

vi.mock('../../list.repository.js', () => ({
  default: {
    findVocabListByUser: vi.fn(),
  },
}));

vi.mock('../item.repository.js', () => ({
  default: {
    findVocabListItemsByListId: vi.fn(),
    findVocabListItemByListId: vi.fn(),
    findVocabListItemById: vi.fn(),
    addVocabListItem: vi.fn(),
    updateVocabListItem: vi.fn(),
    deleteVocabListItem: vi.fn(),
  },
}));

const mockList = {
  id: 'list-id-001',
  userId: 'user-id-001',
  name: 'Test List',
  sourceLanguageId: null,
  targetLanguageId: null,
  sourceLanguageCode: 'en',
  targetLanguageCode: 'de',
  deletedAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const mockItem = {
  id: 'item-id-001',
  listId: 'list-id-001',
  sourceText: 'apple',
  targetText: 'Apfel',
  position: 1,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('listItemService.addVocabListItem', () => {
  it('creates item at position 1 when list is empty', async () => {
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemsByListId).mockResolvedValueOnce([]);
    vi.mocked(listItemRepository.addVocabListItem).mockResolvedValueOnce(mockItem);

    const result = await listItemService.addVocabListItem('user-id-001', 'list-id-001', {
      sourceText: 'apple',
      targetText: 'Apfel',
    });

    expect(listItemRepository.addVocabListItem).toHaveBeenCalledWith({
      listId: mockList.id,
      sourceText: 'apple',
      targetText: 'Apfel',
      position: 1,
    });
    expect(result).toMatchObject({ id: mockItem.id, position: 1 });
  });

  it('creates item at position count + 1 when items already exist', async () => {
    const existingItems = [
      mockItem,
      { ...mockItem, id: 'item-id-002', position: 2 },
    ];
    vi.mocked(listRepository.findVocabListByUser).mockResolvedValueOnce(mockList);
    vi.mocked(listItemRepository.findVocabListItemsByListId).mockResolvedValueOnce(existingItems);
    vi.mocked(listItemRepository.addVocabListItem).mockResolvedValueOnce({
      ...mockItem,
      id: 'item-id-003',
      position: 3,
    });

    await listItemService.addVocabListItem('user-id-001', 'list-id-001', {
      sourceText: 'book',
      targetText: 'Buch',
    });

    expect(listItemRepository.addVocabListItem).toHaveBeenCalledWith({
      listId: mockList.id,
      sourceText: 'book',
      targetText: 'Buch',
      position: 3,
    });
  });

  it('throws when list does not belong to user', async () => {
    vi.mocked(listRepository.findVocabListByUser).mockRejectedValueOnce(
      new NotFoundError('Vocabulary List for this User does not exist'),
    );

    await expect(
      listItemService.addVocabListItem('other-user-id', 'list-id-001', {
        sourceText: 'apple',
        targetText: 'Apfel',
      }),
    ).rejects.toThrow('Vocabulary List for this User does not exist');
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd api && pnpm test -- run src/features/lists/items/__tests__/item.service.test.ts
```

Expected: FAIL — `listItemService.addVocabListItem is not a function`

- [ ] **Step 3: Implement `addVocabListItem` in the service**

Open `api/src/features/lists/items/item.service.ts` and add the import and new function. The full file should become:

```ts
import { VocabularyListItem } from '../../../generated/prisma/client.js';
import listRepository from '../list.repository.js';
import listItemRepository from './item.repository.js';
import type { AddItemInput } from './item.schema.js';

async function getVocabListItems(listId: string) {
  const vocabListItems = await listItemRepository.findVocabListItemsByListId(listId);

  return vocabListItems;
}

async function getVocabListItemsByUserList(
  userId: string,
  listId: string,
): Promise<VocabularyListItem[]> {
  const vocabList = await listRepository.findVocabListByUser(listId, userId);
  const vocabListItems = await listItemRepository.findVocabListItemsByListId(vocabList.id);

  return vocabListItems;
}

async function getVocabListItemByUserList(
  userId: string,
  listId: string,
  listItemId: string,
): Promise<VocabularyListItem> {
  const vocabList = await listRepository.findVocabListByUser(listId, userId);

  const vocabListItem = await listItemRepository.findVocabListItemByListId(
    listItemId,
    vocabList.id,
  );

  return vocabListItem;
}

async function addVocabListItem(
  userId: string,
  listId: string,
  data: AddItemInput,
): Promise<VocabularyListItem> {
  const vocabList = await listRepository.findVocabListByUser(listId, userId);
  const existingItems = await listItemRepository.findVocabListItemsByListId(vocabList.id);
  const position = existingItems.length + 1;

  return listItemRepository.addVocabListItem({
    listId: vocabList.id,
    sourceText: data.sourceText,
    targetText: data.targetText,
    position,
  });
}

export default {
  getVocabListItems,
  getVocabListItemsByUserList,
  getVocabListItemByUserList,
  addVocabListItem,
};
```

> **Note:** The existing `getVocabListItemsByUserList` and `getVocabListItemByUserList` called `listRepository.findVocabListByUserId` which does not exist on the repository. This is corrected to `findVocabListByUser` (the actual export) in the file above.

- [ ] **Step 4: Run tests to confirm they pass**

```bash
cd api && pnpm test -- run src/features/lists/items/__tests__/item.service.test.ts
```

Expected: PASS — 3 tests passing

- [ ] **Step 5: Commit**

```bash
git add api/src/features/lists/items/__tests__/item.service.test.ts api/src/features/lists/items/item.service.ts
git commit -m "feat(items): add addVocabListItem service method with auto-assigned position"
```

---

## Task 3: Add controller handler, route, and route tests (TDD)

**Files:**
- Create: `api/src/features/lists/items/__tests__/item.routes.test.ts`
- Modify: `api/src/features/lists/items/item.controller.ts`
- Modify: `api/src/features/users/user.routes.ts`

**Context:** Routes are mounted under `/users` in `app.ts`. The route test imports `app` directly and hits it with Supertest. The `validate` middleware reads the Zod schema and returns 400 on failure. The `errorHandler` middleware converts thrown errors to JSON responses with `message` and `code` fields.

- [ ] **Step 1: Write the failing route tests**

Create `api/src/features/lists/items/__tests__/item.routes.test.ts`:

```ts
import request from 'supertest';
import { describe, expect, it, vi } from 'vitest';
import app from '../../../../app.js';
import { NotFoundError } from '../../../../errors/NotFoundError.js';
import { UnauthorizedError } from '../../../../errors/UnauthorizedError.js';
import authenticate from '../../../../middleware/authenticate.js';
import listItemService from '../item.service.js';

vi.mock('../../../../middleware/authenticate.js', () => ({
  default: vi.fn((req, _res, next) => {
    req.user = { sub: 'user-id-001', email: 'jdoe@mail.com', role: 'USER' };
    next();
  }),
}));

vi.mock('../../../../middleware/authorize.js', () => ({
  default: vi.fn(() => (_req: unknown, _res: unknown, next: () => void) => next()),
}));

vi.mock('../item.service.js', () => ({
  default: {
    getVocabListItems: vi.fn(),
    getVocabListItemsByUserList: vi.fn(),
    getVocabListItemByUserList: vi.fn(),
    addVocabListItem: vi.fn(),
  },
}));

const USER_ID = 'user-id-001';
const LIST_ID = '660e8400-e29b-41d4-a716-446655440001';

const mockItem = {
  id: 'item-id-001',
  listId: LIST_ID,
  sourceText: 'apple',
  targetText: 'Apfel',
  position: 1,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

describe('ITEM ROUTES', () => {
  describe('POST /users/:userId/lists/:listId/items', () => {
    it('returns 201 with the created item', async () => {
      vi.mocked(listItemService.addVocabListItem).mockResolvedValueOnce(mockItem);

      const response = await request(app)
        .post(`/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ sourceText: 'apple', targetText: 'Apfel' });

      expect(response.status).toEqual(201);
      expect(response.body.message).toEqual('Vocabulary list item added successfully');
      expect(response.body.data).toMatchObject({ id: mockItem.id, sourceText: 'apple' });
    });

    it('returns 400 when sourceText is missing', async () => {
      const response = await request(app)
        .post(`/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ targetText: 'Apfel' });

      expect(response.status).toEqual(400);
    });

    it('returns 400 when targetText is missing', async () => {
      const response = await request(app)
        .post(`/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ sourceText: 'apple' });

      expect(response.status).toEqual(400);
    });

    it('returns 401 when not authenticated', async () => {
      vi.mocked(authenticate).mockImplementationOnce((_req, _res, next) => {
        next(new UnauthorizedError('No token provided'));
      });

      const response = await request(app)
        .post(`/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ sourceText: 'apple', targetText: 'Apfel' });

      expect(response.status).toEqual(401);
    });

    it('returns 404 when list is not found', async () => {
      vi.mocked(listItemService.addVocabListItem).mockRejectedValueOnce(
        new NotFoundError('Vocabulary List for this User does not exist'),
      );

      const response = await request(app)
        .post(`/users/${USER_ID}/lists/${LIST_ID}/items`)
        .send({ sourceText: 'apple', targetText: 'Apfel' });

      expect(response.status).toEqual(404);
    });
  });
});
```

- [ ] **Step 2: Run tests to confirm they fail**

```bash
cd api && pnpm test -- run src/features/lists/items/__tests__/item.routes.test.ts
```

Expected: FAIL — 404 returned for `POST /users/.../items` (route does not exist yet)

- [ ] **Step 3: Add `addVocabListItem` handler to the controller**

Open `api/src/features/lists/items/item.controller.ts`. Replace its full contents with:

```ts
import { Request, Response } from 'express';
import { VocabularyListItem } from '../../../generated/prisma/client.js';
import listItemRepository from './item.repository.js';
import listItemService from './item.service.js';

type VocabListItemResponse = {
  message: string;
  data: VocabularyListItem | VocabularyListItem[];
};

async function getVocabListItems(listId: string) {
  const vocabListItems = await listItemRepository.findVocabListItemsByListId(listId);

  return vocabListItems;
}

async function getVocabListItemsByUserList(
  req: Request<{ userId: string; listId: string }, VocabListItemResponse>,
  res: Response<VocabListItemResponse>,
) {
  const { userId, listId } = req.params;
  const vocabListItems = await listItemService.getVocabListItemsByUserList(userId, listId);

  res.status(200).json({
    message: 'Vocab List Items retrieved successfully',
    data: vocabListItems,
  });
}

async function getVocabListItemByUserList(
  req: Request<{ userId: string; listId: string; itemId: string }, VocabListItemResponse>,
  res: Response<VocabListItemResponse>,
) {
  const { userId, listId, itemId } = req.params;
  const vocabListItem = await listItemService.getVocabListItemByUserList(userId, listId, itemId);

  res.status(200).json({
    message: 'Vocab List Items retrieved successfully',
    data: vocabListItem,
  });
}

async function addVocabListItem(
  req: Request<
    { userId: string; listId: string },
    VocabListItemResponse,
    { sourceText: string; targetText: string }
  >,
  res: Response<VocabListItemResponse>,
) {
  const { userId, listId } = req.params;
  const { sourceText, targetText } = req.body;
  const item = await listItemService.addVocabListItem(userId, listId, { sourceText, targetText });

  res.status(201).json({
    message: 'Vocabulary list item added successfully',
    data: item,
  });
}

export default {
  getVocabListItems,
  getVocabListItemsByUserList,
  getVocabListItemByUserList,
  addVocabListItem,
};
```

- [ ] **Step 4: Add the POST route to `user.routes.ts`**

Open `api/src/features/users/user.routes.ts`.

Add `addItemSchema` to the imports at the top (after the existing `list.schema.js` import):

```ts
import { addItemSchema } from '../lists/items/item.schema.js';
```

Then add the following block **before** the existing `router.get('/:userId/lists/:listId/items', ...)` (line 433), so the POST sits alongside its GET sibling:

```ts
/**
 * @openapi
 * /users/{userId}/lists/{listId}/items:
 *   post:
 *     summary: Add an item to a user's vocabulary list
 *     tags:
 *       - Users
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 550e8400-e29b-41d4-a716-446655440000
 *       - in: path
 *         name: listId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 660e8400-e29b-41d4-a716-446655440001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceText
 *               - targetText
 *             properties:
 *               sourceText:
 *                 type: string
 *                 example: apple
 *               targetText:
 *                 type: string
 *                 example: Apfel
 *     responses:
 *       201:
 *         description: Vocabulary list item added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vocabulary list item added successfully
 *                 data:
 *                   $ref: '#/components/schemas/VocabularyListItem'
 *       400:
 *         description: Validation error – sourceText or targetText missing or invalid
 *       401:
 *         description: Missing or invalid access token
 *       404:
 *         description: Vocabulary list not found
 */
router.post(
  '/:userId/lists/:listId/items',
  authenticate,
  validate(addItemSchema),
  listItemController.addVocabListItem,
);
```

- [ ] **Step 5: Run tests to confirm they pass**

```bash
cd api && pnpm test -- run src/features/lists/items/__tests__/item.routes.test.ts
```

Expected: PASS — 5 tests passing

- [ ] **Step 6: Run the full test suite to check for regressions**

```bash
cd api && pnpm test -- run
```

Expected: all tests passing

- [ ] **Step 7: Commit**

```bash
git add \
  api/src/features/lists/items/__tests__/item.routes.test.ts \
  api/src/features/lists/items/item.controller.ts \
  api/src/features/users/user.routes.ts
git commit -m "feat(items): add POST /users/:userId/lists/:listId/items route with controller"
```

---

## Self-Review

**Spec coverage:**
- ✅ Route `POST /users/:userId/lists/:listId/items` — Task 3, Step 4
- ✅ Schema validation (`sourceText`, `targetText`, non-empty, max 255) — Task 1
- ✅ List ownership check via `findVocabListByUser` — Task 2, Step 3
- ✅ `position = existingItems.length + 1` — Task 2, Step 3
- ✅ Delegates to `listItemRepository.addVocabListItem` — Task 2, Step 3
- ✅ Returns 201 + message + data — Task 3, Step 3
- ✅ Error cases: 400, 401, 404 — Task 3, Step 1 (tests) + validate/errorHandler middleware
- ✅ OpenAPI doc block — Task 3, Step 4
- ✅ Tests: service (3 cases) + routes (5 cases) — Tasks 2 and 3

**Placeholder scan:** No TBDs, TODOs, or "similar to task N" references. Every step contains complete code.

**Type consistency:**
- `AddItemInput` defined in `item.schema.ts` (Task 1), imported as type in `item.service.ts` (Task 2), used inline in `item.controller.ts` (Task 3) — consistent.
- `listRepository.findVocabListByUser` — same name in service implementation (Task 2) and service test mock (Task 2). ✅
- `listItemRepository.addVocabListItem` — same name in service test assertion (Task 2) and repository (not modified). ✅
- `listItemService.addVocabListItem` — same name in route test mock (Task 3) and service export (Task 2). ✅
- Response message `'Vocabulary list item added successfully'` — same in controller (Task 3, Step 3) and route test assertion (Task 3, Step 1). ✅
