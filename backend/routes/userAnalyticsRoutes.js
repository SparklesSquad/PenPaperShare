import express from 'express';
import {
  getDownloadsController,
  getGivenRatingsController,
  getReceivedRatingsController,
  getUploadsController,
} from '../controller/userAnalyticsController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

const router = express.Router();

router.get('/uploads', isLoggedIn, getUploadsController);
router.get('/downloads', isLoggedIn, getDownloadsController);
router.get('/given-ratings', isLoggedIn, getGivenRatingsController);
router.get('/received-ratings', isLoggedIn, getReceivedRatingsController);

export default router;
