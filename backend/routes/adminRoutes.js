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
} from '../controller/adminController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';
import isAdmin from '../middleware/isAdmin.js';

const router = express.Router();

router.get(
  '/get-all-documents',
  isLoggedIn,
  isAdmin,
  getAllDocumentsController
);

router.get('/view-document', isLoggedIn, isAdmin, viewDocumentController);

// TODO: When deleting a document, all the things linked with the document should be deleted.
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

// TODO: BIt More complex
router.get('/view-user', isLoggedIn, isAdmin, viewUserController);

router.delete('/delete-user', isLoggedIn, isAdmin, deleteUserController);

export default router;
