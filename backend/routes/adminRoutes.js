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

// localhost/admin/documents

// Gives all the documents
router.get(
  '/documents',
  // isLoggedIn, isAdmin,
  getAllDocumentsController
);

// To view a single document
router.get('/documents/:id', isLoggedIn, isAdmin, viewDocumentController);

// To delete a single document
router.delete('/documents/:id', isLoggedIn, isAdmin, deleteDocumentController);

// To get all the pending approval documents
router.get(
  '/documents?approved=false',
  isLoggedIn,
  isAdmin,
  pendingApprovalDocumentsController
);

// To Approve a particular document
router.put(
  '/documents/:id/approve',
  // isLoggedIn,
  // isAdmin,
  approveDocumentController
);

// To get all the users
router.get('/users', isLoggedIn, isAdmin, getAllUsersController);

// localhost/user/id

// TODO: Bit More complex -> Already done, just take care in frontend.
router.get('/users/:id', isLoggedIn, isAdmin, viewUserController);

// To delete a user
router.delete('/users/:id', isLoggedIn, isAdmin, deleteUserController);

export default router;
