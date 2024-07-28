import express from 'express';
import {
  uploadDocumentController,
  downloadDocumentController,
  viewDocumentController
} from '../controller/documentController.js';
import multer from 'multer';
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Use middleware in your route
// app.post('/upload', upload.single('file'), uploadDocumentController);

const router = express.Router();

router.post(
  '/upload-document',
  upload.single('file'),
  uploadDocumentController
);
router.get('/download-document', downloadDocumentController);
router.get('/view-document', viewDocumentController);


export default router;
