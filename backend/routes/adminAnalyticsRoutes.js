import express from 'express';
import {
  getTopFiveDownloadedDocuments,
  getUsersGrowth,
} from '../controller/adminAnalyticsController.js';

const router = express.Router();

// These are for user dashboard

router.get('/top-5-documents', getTopFiveDownloadedDocuments);
router.get('/getUsersGrowth', getUsersGrowth);

export default router;
