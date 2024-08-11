import express from 'express';
import {
  getAllDocumentsController,
  deleteDocumentController,
  pendingApprovalDocumentsController,
  approveDocumentController,
  getAllUsersController,
  viewDocumentController,
  viewUserController,
  deleteUserController,
  getTotalCountsController,
  getTopDownloadedDocumentsController,
} from '../controller/adminController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.get('/get-total-counts', getTotalCountsController);

router.get(
  '/get-top-downloaded-documents',
  getTopDownloadedDocumentsController
);

router.get(
  '/get-all-documents',
  isLoggedIn,
  isAdmin,
  getAllDocumentsController
);

router.get('/view-document', isLoggedIn, isAdmin, viewDocumentController);

router.delete(
  '/delete-document',
  isLoggedIn,
  isAdmin,
  deleteDocumentController
);

router.get(
  '/pending-approval-documents',
  isLoggedIn,
  isAdmin,
  pendingApprovalDocumentsController
);

router.put('/approve-document', isLoggedIn, isAdmin, approveDocumentController);

router.get('/get-all-users', isLoggedIn, isAdmin, getAllUsersController);

// TODO: Bit More complex
router.get('/view-user', isLoggedIn, isAdmin, viewUserController);

router.delete('/delete-user', isLoggedIn, isAdmin, deleteUserController);

export default router;
