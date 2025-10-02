import { Router } from 'express';
import * as keywordController from './controllers/KeywordController.ts';

const router = Router();

// The applicant needs to connect these routes to the controller functions.
// Example: router.post('/', keywordController.createKeyword);

router.post('/', keywordController.createKeyword);
router.get('/', keywordController.getKeywords);
router.get('/:id', keywordController.getKeywordById);
router.put('/:id', keywordController.updateKeyword);
router.patch('/:id/status', keywordController.updateKeywordStatus);
router.delete('/:id', keywordController.deleteKeyword);


export default router;
