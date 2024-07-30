import express from 'express';
import {
  getAllDocumentsController,
  deleteDocumentController,
} from '../controller/adminController.js';
import isLoggedIn from '../middleware/isLoggedIn.js';

const router = express.Router();

router.get('/get-all-documents', isLoggedIn, getAllDocumentsController);

router.delete('/delete-document', isLoggedIn, deleteDocumentController);

export default router;
