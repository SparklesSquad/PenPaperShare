import express from 'express';
import isLoggedIn from '../middleware/isLoggedIn.js';
import {
  getDownloadsController,
  getGivenRatingsController,
  getReceivedRatingsController,
  getUploadsController,
} from '../controller/analyticsController.js';

const router = express.Router();

router.get('/uploads', isLoggedIn, getUploadsController);
router.get('/downloads', isLoggedIn, getDownloadsController);
router.get('/given-ratings', isLoggedIn, getGivenRatingsController);
router.get('/received-ratings', isLoggedIn, getReceivedRatingsController);

export default router;
