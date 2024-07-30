import Document from '../schemas/document.js';
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
