import Document from '../schemas/document.js';
import User from '../schemas/user.js';
import Upload from '../schemas/upload.js';
import Rating from '../schemas/rating.js';
import Download from '../schemas/download.js';
import deleteFile from '../utils/delete-file.js';

//To get all the documents
export const getAllDocumentsController = async (req, res) => {
  try {
    const documents = await Document.find({ approved: true });

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

//To view or fetch the document
export const viewDocumentController = async (req, res) => {
  try {
    const { document_id } = req.body;

    if (!document_id) {
      return res.status(400).json({
        success: false,
        message: 'The Document Id is Invalid',
      });
    }

    const document = await Document.findById(document_id);

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

// 200 OK: Successful GET or PUT requests.
// 201 Created: Successful POST request (resource created).
// 204 No Content: Successful request with no data to return.
// 400 Bad Request: Invalid request due to client error.
// 401 Unauthorized: Authentication failure.
// 403 Forbidden: Insufficient permissions.
// 404 Not Found: Resource not found.
// 409 Conflict: Conflict with current resource state.
// 500 Internal Server Error: Generic server error.
// 503 Service Unavailable: Server is down or overloaded.

//To delete the document in entire database
export const deleteDocumentController = async (req, res) => {
  try {
    const { document_id } = req.body;

    if (!document_id) {
      return res.status(400).json({
        success: false,
        message: 'The Document Id is Invalid',
      });
    }

    // Deletes the document in MongoDB - Document Schema
    const document = await Document.findByIdAndDelete(document_id);

    // Deletes the document in MongoDB - Upload Schema
    await Upload.deleteOne({ document_id: document_id });

    // Deletes the document in MongoDB - Download Schema
    await Download.deleteMany({ document_id: document_id });

    // Deletes the document in MongoDB - Rating Schema
    await Rating.deleteMany({ document_id: document_id });

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
    const documents = await Document.find({ approved: false });
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
    const { document_id } = req.body;

    if (!document_id) {
      return res.status(400).json({
        success: false,
        message: 'The Document Id is Invalid',
      });
    }

    const document = await Document.findByIdAndUpdate(document_id, {
      approved: true,
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
    const { user_id } = req.body;
    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'The User Id is Invalid',
      });
    }
    const user = await User.findById(user_id);
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
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'The User Id is Invalid',
      });
    }

    //To delete all the document tree
    const documents = await Document.find({ user_id: user_id });

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
    await User.findByIdAndDelete(user_id);
    await Upload.deleteMany({ upload_user_id: user_id });
    await Download.deleteMany({ download_user_id: user_id });
    await Rating.deleteMany({ download_user_id: user_id });

    return res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: 'Error while Deleting User', error });
  }
};

// Analytics
// For Admin Dashboard
export const getTotalCountsController = async (req, res) => {
  try {
    // total users
    const usersQuery = User.countDocuments();
    const docsQuery = Document.countDocuments();
    const ratingsQuery = Rating.countDocuments();
    const downloadsQuery = Download.countDocuments();
    const pendingQuery = Document.countDocuments({ approved: false });

    const [users, docs, ratings, downloads, pending] = await Promise.all([
      usersQuery,
      docsQuery,
      ratingsQuery,
      downloadsQuery,
      pendingQuery,
    ]);

    return res.status(200).json({
      success: true,
      data: [users, docs, ratings, downloads, pending],
      message: 'All analytics Fetched Successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error while fetching the analytics',
      error,
    });
  }
};
