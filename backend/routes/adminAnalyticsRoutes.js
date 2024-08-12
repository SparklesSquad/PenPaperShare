import express from 'express';
import {
  getTopFiveDownloadedDocumentsController,
  getUsersGrowthControlller,
  getTotalCountsController,
} from '../controller/adminAnalyticsController.js';

import isLoggedIn from './../middleware/isLoggedIn.js';
import isAdmin from './../middleware/isAdmin.js';

const router = express.Router();

// Get the analytics
// Gives the total counts of the documents, users, uploads, downloads, and Pending Documents for the admin Dashboard
router.get('/get-total-counts', isLoggedIn, isAdmin, getTotalCountsController);

// Gives data for the graphs such as top 5 documents, top 5 users, top 5 subjects for the admin dashboard
router.get(
  '/top-5-analysis',
  isLoggedIn,
  isAdmin,
  getTopFiveDownloadedDocumentsController
);

// Gives the users data on how they are increasing for the admin dashboard.
router.get(
  '/get-users-growth/:year',
  isLoggedIn,
  isAdmin,
  getUsersGrowthControlller
);

export default router;
