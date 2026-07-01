import { Router } from 'express';
import { UserRole } from '../../generated/prisma/enums.js';
import authenticate from '../../middleware/authenticate.js';
import authorize from '../../middleware/authorize.js';
import validate from '../../middleware/validate.js';
import listController from './list.controller.js';
import { addListSchema, deleteListSchema, getListSchema, updateListSchema } from './list.schema.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Lists
 *     description: Vocabulary list endpoints
 */

/**
 * @openapi
 * /lists:
 *   get:
 *     summary: List all vocabulary lists
 *     description: Admin-only endpoint that returns all vocabulary lists.
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vocabulary lists successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/VocabularyList'
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – admin role required
 */
router.get('/', authenticate, authorize(UserRole.ADMIN), listController.getVocabLists);

/**
 * @openapi
 * /lists/{id}:
 *   get:
 *     summary: Get a vocabulary list by ID
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 550e8400-e29b-41d4-a716-446655440000
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
 *                   $ref: '#/components/schemas/VocabularyList'
 *       401:
 *         description: Missing or invalid access token
 *       403:
 *         description: Forbidden – list belongs to another user
 *       404:
 *         description: Vocabulary list not found
 */
router.get('/:listId', authenticate, validate(getListSchema), listController.getVocabListById);

/**
 * @openapi
 * /lists:
 *   post:
 *     summary: Create a vocabulary list
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
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
 *                   example: Vocabulary list created successfully
 *                 data:
 *                   $ref: '#/components/schemas/VocabularyList'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Missing or invalid access token
 */
router.post('/', authenticate, validate(addListSchema), listController.addVocabList);

/**
 * @openapi
 * /lists/{id}:
 *   patch:
 *     summary: Update a vocabulary list
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
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
router.patch('/:listId', authenticate, validate(updateListSchema), listController.updateVocabList);

/**
 * @openapi
 * /lists/{id}:
 *   delete:
 *     summary: Delete a vocabulary list
 *     tags:
 *       - Lists
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         example: 550e8400-e29b-41d4-a716-446655440000
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
router.delete('/:listId', authenticate, validate(deleteListSchema), listController.deleteVocabList);

export default router;
