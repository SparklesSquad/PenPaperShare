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

//To delete the document in entire database
export const deleteDocumentController = async (req, res) => {
  try {
    const { document_id } = req.body;

    // Deletes the document in MongoDB - Document Schema
    const document = await Document.findByIdAndDelete(document_id);

    // Deletes the document in MongoDB - Upload Schema
    await Upload.deleteOne({ document_id: document_id });

    // Deletes the document in MongoDB - Download Schema
    await Download.deleteMany({ document_id: document_id });

    // Deletes the document in MongoDB - Rating Schema
    await Rating.deleteMany({ document_id: document_id });

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

//To get the documents pending for approval
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

//To approve the document
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

//To get all the users
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

export const deleteUserController = async (req, res) => {
  try {
    const { user_id } = req.body;

    //To delete all the document tree
    const documents = await Document.find({ user_id: user_id });

    console.log(documents);
    for (let i = 0; i < documents.length; i++) {
      //req.body.document_id = documents[i]._id;
      const document_id = documents[i]._id;
      //await deleteDocumentController(req, res);
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

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: 'Error while Deleting User', error });
  }
};

// Analytics

export const getTotalCountsController = async (req, res) => {
  try {
    // total users
    const users = await User.countDocuments();
    const docs = await Document.countDocuments();
    const ratings = await Rating.countDocuments();
    const downloads = await Download.countDocuments();
    const pending = await Document.countDocuments({ approved: false });
    res.status(200).json({
      users,
      docs,
      ratings,
      downloads,
      pending,
      message: 'Fetched Successfully',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error while fetching documents',
    });
  }
};

export const getTopDownloadedDocumentsController = async (req, res) => {
  try {
    const topFiveDocuments = await Download.aggregate([
      {
        $group: {
          _id: '$document_id',
          count: { $sum: 1 },
        },
      },
      {
        $limit: 5,
      },
    ]);

    const ids = topFiveDocuments.map((doc) => {
      return doc._id;
    });

    console.log(ids);

    const docs = await Document.find({ _id: { $in: ids } });

    console.log(docs);
    res.status(200).json({
      docs,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: 'Error while fetching documents',
    });
  }
};
