import { Router } from 'express';
import authenticate from '../../../../middleware/authenticate.js';
import validate from '../../../../middleware/validate.js';
import resultController from './result.controller.js';
import { addResultSchema, getResultSchema, getResultsSchema } from './result.schema.js';

const router = Router({ mergeParams: true });

router.get('/', authenticate, validate(getResultsSchema), resultController.getResultsByUserListSession);
router.get('/:id', authenticate, validate(getResultSchema), resultController.getResultByUserListSession);
router.post('/', authenticate, validate(addResultSchema), resultController.addResult);

export default router;
