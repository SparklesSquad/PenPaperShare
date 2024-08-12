import express from 'express';
import {
  uploadDocumentController,
  downloadDocumentController,
  viewDocumentController,
  getAllDocumentsController,
} from '../controller/documentController.js';
import multer from 'multer';
import isLoggedIn from '../middleware/isLoggedIn.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use middleware in your route

const router = express.Router();

router.get('/', getAllDocumentsController);

router.post(
  '/upload-document',
  isLoggedIn,
  upload.single('file'),
  uploadDocumentController
);

router.get('/:id/download-document', isLoggedIn, downloadDocumentController);
router.get('/:id', viewDocumentController);

export default router;
