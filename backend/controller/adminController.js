import Document from '../schemas/document.js';
import User from '../schemas/user.js';
import Upload from '../schemas/upload.js';
import Rating from '../schemas/rating.js';
import Download from '../schemas/download.js';
import deleteFile from '../utils/delete-file.js';
import nodemailer from 'nodemailer';
import { emailGeneralTemplate } from '../utils/email-template.js';
import { processAndUploadFirstPage } from './../utils/page-extractor.js';

const transporter = nodemailer.createTransport({
  service: 'gmail', // You can use other services like SendGrid, Mailgun, etc.
  auth: {
    user: 'penpapershare@gmail.com', // Your email
    pass: 'dolj cinb pgxg ynld', // Your email password
  },
});

//To get all the documents
export const getAllDocumentsController = async (req, res) => {
  try {
    const { approved } = req.query;

    // Getting the status counts such as Approved : 1, Rejected : 2
    const statusCounts = await Document.aggregate([
      {
        $group: {
          _id: '$approved',
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    let filter = {};

    if (approved) {
      filter = { approved };
    }
    // Getting all the documents
    const documents = await Document.find(filter);

    // If the documents are empty
    if (documents.length === 0) {
      return res.status(200).json({
        success: true,
        data: documents,
        message: 'No Documents Found !!',
        count: documents.length,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        statusCounts,
        documents,
      },
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

//To view or fetch the document
export const viewDocumentController = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'The Document Id is Invalid',
      });
    }

    const document = await Document.findById(id);

    if (!document) {
      return res
        .status(404)
        .json({ success: false, message: 'Document not Found' });
    }
    return res.status(200).json({
      success: true,
      data: document,
      message: 'Document fetched Successfully',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while fetching Document',
      error,
    });
  }
};

//To delete the document in entire database
export const deleteDocumentController = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'The Document Id is Invalid',
      });
    }

    // Deletes the document in MongoDB - Document Schema
    const document = await Document.findByIdAndDelete(id);

    // Deletes the document in MongoDB - Upload Schema
    await Upload.deleteOne({ document_id: id });

    // Deletes the document in MongoDB - Download Schema
    await Download.deleteMany({ document_id: id });

    // Deletes the document in MongoDB - Rating Schema
    await Rating.deleteMany({ document_id: id });

    // Deletes the document in AWS
    await deleteFile(document);

    res.status(200).json({
      success: true,
      message: 'Document Deleted Successfully!!',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while deleting document in the server !!',
      error,
    });
  }
};

//To get the documents pending for approval
export const pendingApprovalDocumentsController = async (req, res) => {
  try {
    const documents = await Document.find({ approved: 'PENDING' });
    return res.status(200).json({
      success: true,
      data: documents,
      message: 'Fetched all Pending Approval documents successfully !!',
      count: documents.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message:
        'Error while fetching Pending Approval documents in the server !!',
      error,
    });
  }
};

//To approve the document
export const approveDocumentController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'The Document Id is Invalid',
      });
    }

    // Get the document to get the URL of the pdf
    const document = await Document.findById(id);

    //
    await processAndUploadFirstPage(document.key, id)
      .then(() => console.log('Operation completed successfully'))
      .catch((error) => console.error('Operation failed:', error));

    const user = await User.findById(document.user_id);

    await transporter.sendMail({
      from: 'penpapershare@gmail.com',
      to: user.email,
      subject: 'Document Approved',
      html: emailGeneralTemplate(user.username),
    });

    return res.status(200).json({
      success: true,
      data: document,
      message: 'Approved the document successfully !',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while approving the documents in the server !!',
      error,
    });
  }
};

export const rejectDocumentController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'The Document Id is Invalid',
      });
    }

    await Document.findByIdAndUpdate(id, {
      approved: 'REJECTED',
    });

    return res.status(200).json({
      success: true,
      message: 'Document has been rejected !',
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while rejecting the documents in the server !!',
      error,
    });
  }
};

//To get all the users
export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find();

    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        data: users,
        message: 'No users Found !!',
        count: 0,
      });
    }

    return res.status(200).json({
      success: true,
      data: users,
      message: 'Fetched all users successfully !!',
      count: users.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Error while fetching users in the server !!',
      error,
    });
  }
};

export const viewUserController = async (req, res) => {
  try {
    const { id } = req.query;
    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'The User Id is Invalid',
      });
    }
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not Found' });
    }
    return res.status(200).json({
      success: true,
      data: user,
      message: 'User fetched Successfully',
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error while fetching User', error });
  }
};

export const deleteUserController = async (req, res) => {
  try {
    const { id } = req.query;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: 'The User Id is Invalid',
      });
    }

    //To delete all the document tree
    const documents = await Document.find({ user_id: id });

    // For every document, delete the user and all his documents and his whole history
    for (let i = 0; i < documents.length; i++) {
      const document_id = documents[i]._id;
      const document = await Document.findByIdAndDelete(document_id);
      await Upload.deleteOne({ document_id: document_id });
      await Download.deleteMany({ document_id: document_id });
      await Rating.deleteMany({ document_id: document_id });

      // Deletes the document in AWS
      await deleteFile(document);
    }

    //To delete all the user download/uploads/ratings
    await User.findByIdAndDelete(id);
    await Upload.deleteMany({ upload_user_id: id });
    await Download.deleteMany({ download_user_id: id });
    await Rating.deleteMany({ download_user_id: id });

    return res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error while Deleting User', error });
  }
};
