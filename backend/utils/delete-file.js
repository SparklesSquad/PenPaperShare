import dotenv from 'dotenv';
import s3 from './aws-config.js';

dotenv.config();

const deleteFile = async (document) => {
  const params = {
    Bucket: process.env.PDF_BUCKET_NAME,
    Key: document.key,
  };

  try {
    const deletedObject = await s3.deleteObject(params).promise();

    return deletedObject;
  } catch (error) {
    console.error('Error While Deleting the document in AWS :', error);
    throw new Error('Error While Deleting the document in AWS');
  }
};

export default deleteFile;
