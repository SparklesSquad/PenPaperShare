import Document from '../schemas/document.js';
import User from '../schemas/user.js';
import deleteFile from '../utils/delete-file.js';

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

export const deleteDocumentController = async (req, res) => {
  try {
    const { document_id } = req.body;

    // Deletes the document in MongoDB
    const document = await Document.findByIdAndDelete(document_id);

    // Deletes the document in AWS
    const awsResponse = await deleteFile(document);

    console.log(awsResponse);

    res.status(200).json({
      message: 'Document Deleted Successfully!!',
    });
  } catch (error) {
    console.log('Error while deleting document in the server !!');
    console.log(error);
    return res
      .status(500)
      .send('Error while deleting document in the server !!');
  }
};

export const pendingApprovalDocumentsController = async (req, res) => {
  try {
    const documents = await Document.find({ approved: false });
    return res.status(200).json({
      data: documents,
      message: 'Fetched all Pending Approval documents successfully !!',
      count: documents.length,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send('Error while fetching Pending Approval documents in the server !!');
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

export const approveDocumentController = async (req, res) => {
  try {
    const { document_id } = req.body;

    const document = await Document.findByIdAndUpdate(document_id, {
      approved: true,
    });
    return res.status(200).json({
      data: document,
      message: 'Approved the document successfully !',
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send('Error while approving the documents in the server !!');
  }
};

export const getAllUsersController = async (req, res) => {
  try {
    const users = await User.find();
    return res.status(200).json({
      data: users,
      message: 'Fetched all users successfully !!',
      count: users.length,
    });
  } catch (error) {
    console.log('Error while fetching users in the server !!');
    console.log(error);
    return res.status(500).send('Error while fetching users in the server !!');
  }
};

export const viewUserController = async (req, res) => {
  try {
    const { user_id } = req.body;
    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: 'User not Found' });
    }
    return res.status(200).json({ user, message: 'User fetched Successfully' });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'Error while fetching User', error });
  }
};
