import User from './../schemas/user.js';
import uploadFile from './../utils/upload-file.js';
import Document from './../schemas/document.js';
import downloadFile from '../utils/download-file.js';

export const getAllDocumentsController = async (req, res) => {
  try {
    const documents = await Document.find({ approved: true });
    return res.status(200).json({
      data: documents,
      message: 'Fetched all documents successfully !!',
      count: documents.length,
    });
  } catch (error) {
    console.log('Error while fetching documents in the server !!');
    console.log(error);
    return res
      .status(500)
      .send('Error while fetching documents in the server !!');
  }
};

//To upload the document
export const uploadDocumentController = async (req, res) => {
  const { file } = req;
  const { title, description, subject, institute } = req.body;

  const documentData = { file, title, description, subject, institute };

  const user_id = req.user.id;

  if (!file || !user_id) {
    return res.status(400).json({ message: 'File and user_id are required' });
  }

  try {
    // Ensure user exists
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload file to S3 and save metadata
    const fileMetadata = await uploadFile(documentData, user_id, res);
    if (fileMetadata === 'File size cannot be greater then 50MB!') {
      return res.status(500).send('File size cannot be greater then 50MB!');
    }
    return res.status(200).json('Document Uploaded Successfully');
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Error uploading file', error });
  }
};

//To view or fetch the document
export const viewDocumentController = async (req, res) => {
  try {
    const { document_id } = req.body;
    const document = await Document.findById(document_id);
    if (!document) {
      return res.status(404).json({ message: 'Document not Found' });
    }
    return res
      .status(200)
      .json({ document, message: 'Document fetched Successfully' });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'Error while fetching Document', error });
  }
};

//To doenload the Document
export const downloadDocumentController = async (req, res) => {
  try {
    const { document_id } = req.body;
    const document = await Document.findById(document_id);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }

    await downloadFile(document, req.user.id, document.user_id);
    res.status(200).json('Document downloaded Successfully');
  } catch (error) {
    console.log(error);
    res
      .status(404)
      .json({ message: 'Error while Downloading Document', error });
  }
};
