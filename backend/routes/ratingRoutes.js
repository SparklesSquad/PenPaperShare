import { documentRatingController } from '../controller/ratingController.js';
import { Router } from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';

const router = Router();

router.post('/rateDocument', isLoggedIn, documentRatingController);

export default router;