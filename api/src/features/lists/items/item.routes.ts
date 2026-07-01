import { Router } from 'express';
import authenticate from '../../../middleware/authenticate.js';
import listIemController from './item.controller.js';

const router = Router();

router.get('/', authenticate, listIemController.getVocabListItems);

export default router;
