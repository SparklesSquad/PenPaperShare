import express from 'express';
import User from './../schemas/user.js';
import uploadFile from './../utils/upload-file.js';
import Document from './../schemas/document.js';
import downloadFile from '../utils/download-file.js';


//To upload the document
export const uploadDocumentController = async (req, res) => {
  const { file } = req;
  const { userId } = req.body;

  if (!file || !userId) {
    return res.status(400).json({ message: 'File and userId are required' });
  }

  try {
    // Ensure user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Upload file to S3 and save metadata
    const fileMetadata = await uploadFile(file, userId, res);
    res.status(200).json('Document Uploaded Successfully');
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error uploading file', error });
  }
};

//To view or fetch the document
export const viewDocumentController = async (req, res) => {
  try {
    const {docId} = req.body;
    const document = await Document.findById(docId);
    if(!document){
      return res.status(404).json({ message: 'Document not Found' });
    }
    return res.status(200).json({document, message : "Document fetched Successfully"});
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error while fetching Document", error });
  }
};

//To doenload the Document
export const downloadDocumentController = async (req, res) => {
  try {
    const {docId, download_user_id} = req.body;
    const document = await Document.findById(docId);
    if (!document) {
      return res.status(404).json({ message: 'Document not found' });
    }
    
    await downloadFile(document, download_user_id, document.user_id);
    res.status(200).json('Document downloaded Successfully');
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Error while Downloading Document", error });
  }
};