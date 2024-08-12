import { documentRatingController } from '../controller/ratingController.js';
import { Router } from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';

const router = Router();

router.post('/document/:id', isLoggedIn, documentRatingController);

export default router;
