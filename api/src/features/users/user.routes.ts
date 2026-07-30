import { Router } from 'express';
import { UserRole } from '../../generated/prisma/enums.js';
import authenticate from '../../middleware/authenticate.js';
import authorize from '../../middleware/authorize.js';
import authorizeOwner from '../../middleware/authorizeOwner.js';
import validate from '../../middleware/validate.js';
import audioController from '../audio/audio.controller.js';
import { getItemAudioSchema } from '../audio/audio.schema.js';
import listItemController from '../lists/items/item.controller.js';
import {
  addUserListItemSchema,
  updateUserListItemStatusSchema,
} from '../lists/items/item.schema.js';
import listController from '../lists/list.controller.js';
import { addUserListSchema, updateUserListSchema } from '../lists/list.schema.js';
import resultController from '../lists/sessions/results/result.controller.js';
import { addResultsSchema } from '../lists/sessions/results/result.schema.js';
import sessionController from '../lists/sessions/session.controller.js';
import { endSessionSchema, startSessionSchema } from '../lists/sessions/session.schema.js';
import userController from './user.controller.js';
import {
  updateUserSchema,
  userIdParamSchema,
  userListItemParamsSchema,
  userListParamsSchema,
} from './user.schema.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Users
 *     description: User account endpoints
 */

/**
 * @openapi
 * /users:
 *   get:
 *     summary: List all users
 *     description: Admin-only endpoint that returns all users.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Users successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – admin role required
 */
router.get('/', authenticate, authorize(UserRole.ADMIN), userController.getUsers);

/**
 * @openapi
 * /users/me:
 *   get:
 *     summary: Get current user
 *     description: Returns the authenticated user's profile.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid access token
 */
router.get('/me', authenticate, userController.getMe);

/**
 * @openapi
 * /users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     description: Returns a single user by UUID.
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 8b74a4f2-6b85-4f94-8d19-85fcb49b733e
 *     responses:
 *       200:
 *         description: User successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully retrieved
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid access token
 *       404:
 *         description: User not found
 */
router.get(
  '/:userId',
  authenticate,
  validate(userIdParamSchema),
  authorizeOwner,
  userController.getUserById,
);

/**
 * @openapi
 * /users/{userId}:
 *   patch:
 *     summary: Update a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 8b74a4f2-6b85-4f94-8d19-85fcb49b733e
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: jane@example.com
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Missing or invalid access token
 *       404:
 *         description: User not found
 */
router.patch(
  '/:userId',
  authenticate,
  validate(updateUserSchema),
  authorizeOwner,
  userController.updateUser,
);

/**
 * @openapi
 * /users/{userId}:
 *   delete:
 *     summary: Delete a user
 *     tags:
 *       - Users
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 8b74a4f2-6b85-4f94-8d19-85fcb49b733e
 *     responses:
 *       204:
 *         description: User deleted successfully
 *       401:
 *         description: Missing or invalid access token
 *       404:
 *         description: User not found
 */
router.delete(
  '/:userId',
  authenticate,
  validate(userIdParamSchema),
  authorizeOwner,
  userController.deleteUser,
);

/**
 * @openapi
 * /users/{userId}/lists:
 *   get:
 *     summary: Get a user's vocabulary lists
 *     description: Returns all vocabulary lists belonging to the specified user.
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
 *     responses:
 *       200:
 *         description: Vocabulary lists successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vocabulary lists successfully retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VocabularyListWithStats'
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – cannot access another user's lists
 *       404:
 *         description: User not found
 */
router.get(
  '/:userId/lists',
  authenticate,
  validate(userIdParamSchema),
  authorizeOwner,
  listController.getVocabListsByUser,
);

/**
 * @openapi
 * /users/{userId}/lists:
 *   post:
 *     summary: Create a vocabulary list for a user
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - sourceLanguageCode
 *               - targetLanguageCode
 *               - name
 *             properties:
 *               sourceLanguageCode:
 *                 type: string
 *                 example: en
 *               targetLanguageCode:
 *                 type: string
 *                 example: fr
 *               name:
 *                 type: string
 *                 example: French Vocabulary Notes
 *     responses:
 *       201:
 *         description: Vocabulary list created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vocabulary List has been created successfully
 *                 data:
 *                   $ref: '#/components/schemas/VocabularyList'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – cannot create a list for another user
 */
router.post(
  '/:userId/lists',
  authenticate,
  validate(addUserListSchema),
  authorizeOwner,
  listController.addVocabList,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}:
 *   get:
 *     summary: Get a user's vocabulary list
 *     description: Returns a single vocabulary list belonging to the specified user.
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
 *     responses:
 *       200:
 *         description: Vocabulary list successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vocabulary list successfully retrieved
 *                 data:
 *                   $ref: '#/components/schemas/VocabularyListWithStats'
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Vocabulary list not found
 */
router.get(
  '/:userId/lists/:listId',
  authenticate,
  validate(userListParamsSchema),
  authorizeOwner,
  listController.getVocabListByUser,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}:
 *   patch:
 *     summary: Update a user's vocabulary list
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
 *             properties:
 *               sourceLanguageCode:
 *                 type: string
 *                 example: en
 *               targetLanguageCode:
 *                 type: string
 *                 example: fr
 *               name:
 *                 type: string
 *                 example: French Vocabulary Notes – Updated
 *     responses:
 *       200:
 *         description: Vocabulary list updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vocabulary list updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/VocabularyList'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Vocabulary list not found
 */
router.patch(
  '/:userId/lists/:listId',
  authenticate,
  validate(updateUserListSchema),
  authorizeOwner,
  listController.updateVocabListByUser,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}:
 *   delete:
 *     summary: Delete a user's vocabulary list
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
 *     responses:
 *       200:
 *         description: Vocabulary list deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vocabulary list deleted successfully
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Vocabulary list not found
 */
router.delete(
  '/:userId/lists/:listId',
  authenticate,
  validate(userListParamsSchema),
  authorizeOwner,
  listController.deleteVocabListByUser,
);

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
  validate(addUserListItemSchema),
  listItemController.addVocabListItem,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/items:
 *   get:
 *     summary: Get items in a user's vocabulary list
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
 *     responses:
 *       200:
 *         description: Vocabulary list items successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vocabulary list items successfully retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VocabularyListItem'
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Vocabulary list not found
 */
router.get(
  '/:userId/lists/:listId/items',
  authenticate,
  validate(userListParamsSchema),
  authorizeOwner,
  listItemController.getVocabListItemsByUserList,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/items/{itemId}:
 *   get:
 *     summary: Get a single item from a user's vocabulary list
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
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 770e8400-e29b-41d4-a716-446655440002
 *     responses:
 *       200:
 *         description: Vocabulary list item successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vocabulary list item successfully retrieved
 *                 data:
 *                   $ref: '#/components/schemas/VocabularyListItem'
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Item not found
 */
router.get(
  '/:userId/lists/:listId/items/:itemId',
  authenticate,
  validate(userListItemParamsSchema),
  authorizeOwner,
  listItemController.getVocabListItemByUserList,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/items/{itemId}/status:
 *   patch:
 *     summary: Update a vocabulary list item's status
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
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 770e8400-e29b-41d4-a716-446655440002
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [LEARNING, MASTERED]
 *                 example: MASTERED
 *     responses:
 *       200:
 *         description: Vocabulary list item status updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Vocabulary list item status updated successfully
 *                 data:
 *                   $ref: '#/components/schemas/VocabularyListItem'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Item not found
 */
router.patch(
  '/:userId/lists/:listId/items/:itemId/status',
  authenticate,
  validate(updateUserListItemStatusSchema),
  authorizeOwner,
  listItemController.updateVocabListItemStatus,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/items/{itemId}:
 *   delete:
 *     summary: Delete a vocabulary list item
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
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 770e8400-e29b-41d4-a716-446655440002
 *     responses:
 *       204:
 *         description: Vocabulary list item deleted successfully
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Item not found
 */
router.delete(
  '/:userId/lists/:listId/items/:itemId',
  authenticate,
  validate(userListItemParamsSchema),
  authorizeOwner,
  listItemController.deleteVocabListItem,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/items/{itemId}/audio:
 *   get:
 *     summary: Get a text-to-speech audio clip for a vocabulary list item
 *     description: >
 *       Returns a time-limited, presigned URL for the source or target text audio clip.
 *       Clips are cached in S3 by a hash of the text and language code, so repeat requests
 *       for the same text/language pair reuse the existing clip instead of resynthesizing it.
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
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 770e8400-e29b-41d4-a716-446655440002
 *       - in: query
 *         name: field
 *         required: true
 *         schema:
 *           type: string
 *           enum: [source, target]
 *         description: Whether to return audio for the item's source or target text
 *     responses:
 *       200:
 *         description: Audio clip retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Audio clip retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/AudioClip'
 *       400:
 *         description: Validation error – field must be "source" or "target"
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Item not found
 */
router.get(
  '/:userId/lists/:listId/items/:itemId/audio',
  // authenticate,
  validate(getItemAudioSchema),
  // authorizeOwner,
  audioController.getVocabListItemAudio,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/sessions:
 *   get:
 *     summary: Get practice sessions for a user's vocabulary list
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
 *     responses:
 *       200:
 *         description: Practice sessions successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Practice sessions successfully retrieved
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/PracticeSession'
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Vocabulary list not found
 */
router.get(
  '/:userId/lists/:listId/sessions',
  authenticate,
  authorizeOwner,
  sessionController.getSessionsByUserList,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/sessions/{sessionId}:
 *   get:
 *     summary: Get a single practice session
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
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 880e8400-e29b-41d4-a716-446655440003
 *     responses:
 *       200:
 *         description: Practice session successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Practice session successfully retrieved
 *                 data:
 *                   $ref: '#/components/schemas/PracticeSession'
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – session belongs to another user
 *       404:
 *         description: Practice session not found
 */
router.get(
  '/:userId/lists/:listId/sessions/:sessionId',
  authenticate,
  authorizeOwner,
  sessionController.getSessionByUserList,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/sessions:
 *   post:
 *     summary: Start a practice session
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
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique key that lets a retried request safely reuse the original result instead of starting a duplicate session.
 *         example: 8cd338ef-e764-4660-92b6-9b4194d90e70
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startedAt
 *             properties:
 *               startedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-15T10:00:00.000Z"
 *     responses:
 *       200:
 *         description: Idempotency key matched an already-completed session; the existing session is returned instead of creating a new one
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Practice retrieved successfully
 *                 data:
 *                   $ref: '#/components/schemas/PracticeSession'
 *       201:
 *         description: Practice session started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Practice session created successfully
 *                 data:
 *                   $ref: '#/components/schemas/PracticeSession'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Vocabulary list not found
 *       409:
 *         description: A request with the same idempotency key is already being processed
 */
router.post(
  '/:userId/lists/:listId/sessions',
  authenticate,
  validate(startSessionSchema),
  authorizeOwner,
  sessionController.startSession,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/sessions/{sessionId}:
 *   patch:
 *     summary: End a practice session
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
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 880e8400-e29b-41d4-a716-446655440003
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - completedAt
 *               - totalHints
 *               - totalErrors
 *               - totalSkipped
 *             properties:
 *               completedAt:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-01-15T10:15:00.000Z"
 *               totalHints:
 *                 type: integer
 *                 minimum: 0
 *                 example: 3
 *               totalErrors:
 *                 type: integer
 *                 minimum: 0
 *                 example: 1
 *               totalSkipped:
 *                 type: integer
 *                 minimum: 0
 *                 example: 0
 *     responses:
 *       200:
 *         description: Practice session ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Practice session ended successfully
 *                 data:
 *                   $ref: '#/components/schemas/PracticeSession'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – session belongs to another user
 *       404:
 *         description: Practice session not found
 */
router.patch(
  '/:userId/lists/:listId/sessions/:sessionId',
  authenticate,
  validate(endSessionSchema),
  authorizeOwner,
  sessionController.endSession,
);

/**
 * @openapi
 * /users/{userId}/lists/{listId}/sessions/{sessionId}/results/batch:
 *   post:
 *     summary: Add a batch of practice results to a session
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
 *       - in: path
 *         name: sessionId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 880e8400-e29b-41d4-a716-446655440003
 *       - in: header
 *         name: Idempotency-Key
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Unique key that lets a retried request safely resubmit the same batch without creating duplicate results.
 *         example: 8cd338ef-e764-4660-92b6-9b4194d90e70
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - results
 *             properties:
 *               results:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - sourceText
 *                     - targetText
 *                     - startedAt
 *                   properties:
 *                     sourceText:
 *                       type: string
 *                       example: apple
 *                     targetText:
 *                       type: string
 *                       example: la pomme
 *                     startedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T10:01:00.000Z"
 *                     completedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-15T10:01:05.000Z"
 *                     hints:
 *                       type: integer
 *                       minimum: 0
 *                       example: 1
 *                     errors:
 *                       type: integer
 *                       minimum: 0
 *                       example: 0
 *                     skipped:
 *                       type: boolean
 *                       example: false
 *     responses:
 *       201:
 *         description: Practice results created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Practice results created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – session belongs to another user
 *       404:
 *         description: Practice session not found
 */
router.post(
  '/:userId/lists/:listId/sessions/:sessionId/results/batch',
  authenticate,
  validate(addResultsSchema),
  authorizeOwner,
  resultController.addResults,
);

export default router;
