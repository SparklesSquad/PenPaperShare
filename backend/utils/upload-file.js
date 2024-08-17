import s3 from './aws-config.js';
import Document from './../schemas/document.js';
import Upload from './../schemas/upload.js';
import dotenv from 'dotenv';

dotenv.config();

const uploadFile = async (documentData, user_id) => {
  const file = documentData.file;
  const { originalname, buffer } = file;
  const MAX_SIZE_BYTES = 50 * 1024 * 1024;

  if (buffer.length > MAX_SIZE_BYTES) {
    return 'File size cannot be greater then 50MB!';
  }
  const params = {
    Bucket: process.env.PDF_BUCKET_NAME,
    Key: `uploads/${Date.now()}-${originalname}`,
    Body: buffer,
    ContentType: file.mimetype,
  };

  try {
    const { Location } = await s3.upload(params).promise();

    const document = new Document({
      filename: originalname,
      title: documentData.title,
      url: Location,
      size: buffer.length,
      user_id: user_id,
      country: documentData.country,
      description: documentData.description,
      subject: documentData.subject,
      institute: documentData.institute,
      major: documentData.country,
      educationLevel: documentData.educationLevel,
      key: params.Key,
      approved: false,
    });

    const upload = new Upload({
      user_id: user_id,
      document_id: document._id,
    });

    await document.save();
    await upload.save();
    return document;
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Error uploading file');
  }
};

export default uploadFile;
