import { Router } from 'express';
import authController from './auth.controller.js';

const router = Router();

router.post('/register', authController.register);

router.post('/login', authController.login);

router.post('/forgotpassword', authController.forgotPassword);

router.post('/resetpassword', authController.resetPassword);

router.post('/refresh', authController.refresh);

router.post('/verify', authController.verify);

router.post('/logout', authController.logout);

export default router;
