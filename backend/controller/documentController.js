import User from './../schemas/user.js';
import uploadFile from './../utils/upload-file.js';
import Document from './../schemas/document.js';
import downloadFile from '../utils/download-file.js';

export const getAllDocumentsController = async (req, res) => {
  try {
    const documents = await Document.find({ approved: true });

    if (documents.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'No Documents Found',
        count: 0,
      });
    }

    return res.status(200).json({
      data: documents,
      message: 'Fetched all documents successfully !!',
      count: documents.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while fetching documents in the server !!',
      error,
    });
  }
};

//To upload the document
export const uploadDocumentController = async (req, res) => {
  const { file } = req;
  const { title, description, subject, institute } = req.body;

  if (!file) {
    return res.status(400).json({
      success: false,
      message: 'File is requried',
    });
  }

  if (!title || !description || !subject || !institute) {
    return res.status(400).json({
      success: false,
      message: 'Missing Input !! All fields are required',
    });
  }
  const documentData = { file, title, description, subject, institute };

  const user_id = req.user.id;

  if (!user_id) {
    return res
      .status(401)
      .json({ success: false, message: 'User is not logged in' });
  }

  try {
    // Ensure user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Upload file to S3 and save metadata
    const fileMetadata = await uploadFile(documentData, user_id, res);
    if (fileMetadata === 'File size cannot be greater then 50MB!') {
      return res.status(413).json({
        success: false,
        message: 'File size cannot be greater then 50MB!',
      });
    }
    return res
      .status(200)
      .json({ success: true, message: 'Document Uploaded Successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error uploading file', error });
  }
};

//To view or fetch the document
export const viewDocumentController = async (req, res) => {
  try {
    const { document_id } = req.body;

    if (!document_id) {
      return res.status(400).json({
        success: false,
        message: 'Document Id cannot be empty',
      });
    }

    const document = await Document.findById(document_id);

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not Found' });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: document,
        message: 'Document fetched Successfully',
      });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Error while fetching Document',
        error,
      });
  }
};

//To doenload the Document
export const downloadDocumentController = async (req, res) => {
  try {
    const { document_id } = req.body;

    if (!document_id) {
      return res.status(400).json({
        success: false,
        message: 'Document Id cannot be empty',
      });
    }

    const document = await Document.findById(document_id);
    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not Found' });
    }

    await downloadFile(document, req.user.id, document.user_id);

    res
      .status(200)
      .json({ success: true, message: 'Document downloaded Successfully' });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: 'Error while Downloading Document',
        error,
      });
  }
};
