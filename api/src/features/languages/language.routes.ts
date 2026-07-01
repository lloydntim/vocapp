import { Router } from 'express';
import authenticate from '../../middleware/authenticate.js';
import languageController from './language.controller.js';
const router = Router();

/**
 * @openapi
 * /languages:
 *   get:
 *     summary: Get supported Google languages
 *     tags:
 *       - Languages
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: q
 *         schema:
 *           type: string
 *         description: Optional search query
 *     responses:
 *       200:
 *         description: Supported languages successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       code:
 *                         type: string
 *                         example: fr
 *                       name:
 *                         type: string
 *                         example: French
 *       401:
 *         description: Missing or invalid access token
 */
router.get('/', authenticate, languageController.getGoogleSupportedLanguages);

export default router;
