import { Router } from 'express';
import authenticate from '../../middleware/authenticate.js';
import userController from './user.controller.js';

const router = Router();

router.get('/', authenticate, userController.getUsers);

router.get('/:userId', authenticate, userController.getUserById);

export default router;
