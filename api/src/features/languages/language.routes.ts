import { Router } from 'express';
import authenticate from '../../middleware/authenticate.js';
import validate from '../../middleware/validate.js';
import languageController from './language.controller.js';
import { getLanguagesSchema, getTranslationsSchema } from './language.schema.js';
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
router.get(
  '/',
  authenticate,
  validate(getLanguagesSchema),
  languageController.getGoogleSupportedLanguages,
);
/**
 * @openapi
 * /languages/translation:
 *   post:
 *     summary: Translate text between two languages
 *     tags:
 *       - Languages
 *       - Translations
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
 *               - sourceText
 *             properties:
 *               sourceLanguageCode:
 *                 type: string
 *                 example: en
 *               targetLanguageCode:
 *                 type: string
 *                 example: fr
 *               sourceText:
 *                 type: string
 *                 example: She has a car
 *     responses:
 *       200:
 *         description: Translation successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     translations:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Translation'
 *       400:
 *         description: Validation error, or the word/phrase could not be translated
 *       401:
 *         description: Missing or invalid access token
 *       429:
 *         description: Translation quota exceeded, please try again later
 *       500:
 *         description: Translation service is currently unavailable
 */
router.post('/', authenticate, validate(getTranslationsSchema), languageController.getTranslations);

export default router;
