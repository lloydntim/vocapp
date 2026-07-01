import { Router } from 'express';
import {
  authRateLimit,
  passwordResetRateLimit,
  sessionRateLimit,
} from '../../middleware/rateLimit.js';
import validate from '../../middleware/validate.js';
import { createUserSchema } from '../users/user.schema.js';
import authController from './auth.controller.js';
import {
  forgotPasswordSchema,
  loginUserSchema,
  resetPasswordSchema,
  verifyUserSchema,
} from './auth.schema.js';

const router = Router();

/**
 * @openapi
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *               - username
 *               - password
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: John
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: s3cur3P@ssword
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User registered successfully
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *       409:
 *         description: Email or username already in use
 */
router.post('/register', authRateLimit, validate(createUserSchema), authController.register);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Log in with username and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: s3cur3P@ssword
 *     responses:
 *       200:
 *         description: Login successful — access token returned, refresh token set as HttpOnly cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Account not verified
 */
router.post('/login', authRateLimit, validate(loginUserSchema), authController.login);

/**
 * @openapi
 * /auth/forgotpassword:
 *   post:
 *     summary: Request a password reset email
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent if the address is registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset email sent
 *       400:
 *         description: Validation error
 */
router.post(
  '/forgotpassword',
  passwordResetRateLimit,
  validate(forgotPasswordSchema),
  authController.forgotPassword,
);

/**
 * @openapi
 * /auth/resetpassword:
 *   post:
 *     summary: Reset password using a token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *               - password
 *             properties:
 *               token:
 *                 type: string
 *                 example: abc123resettoken
 *               password:
 *                 type: string
 *                 minLength: 8
 *                 example: newS3cur3P@ss
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Password reset successfully
 *       400:
 *         description: Validation error or invalid/expired token
 */
router.post(
  '/resetpassword',
  passwordResetRateLimit,
  validate(resetPasswordSchema),
  authController.resetPassword,
);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refresh the access token
 *     description: Uses the HttpOnly refresh token cookie to issue a new access token.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Access token refreshed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Missing or invalid refresh token
 */
router.post('/refresh', sessionRateLimit, authController.refresh);

/**
 * @openapi
 * /auth/verify:
 *   post:
 *     summary: Verify a user's email address
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - token
 *             properties:
 *               token:
 *                 type: string
 *                 example: abc123verifytoken
 *     responses:
 *       200:
 *         description: Email verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Email verified successfully
 *       400:
 *         description: Invalid or expired token
 */
router.post('/verify', authRateLimit, validate(verifyUserSchema), authController.verify);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Log out the current user
 *     description: Revokes the refresh token cookie and invalidates the session.
 *     tags:
 *       - Auth
 *     responses:
 *       200:
 *         description: Logged out successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Logged out successfully
 */
router.post('/logout', sessionRateLimit, authController.logout);

export default router;
