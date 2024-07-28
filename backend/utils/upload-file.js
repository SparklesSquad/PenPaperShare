import s3 from './aws-config.js';
import Document from './../schemas/document.js';
import Upload from './../schemas/upload.js';
import dotenv from 'dotenv';

dotenv.config();

const uploadFile = async (file, userId, res) => {
  const { originalname, buffer } = file;

  const params = {
    Bucket: process.env.BUCKET_NAME,
    Key: `uploads/${Date.now()}-${originalname}`,
    Body: buffer,
    ContentType: file.mimetype,
  };

  try {
    const { Location, Key } = await s3.upload(params).promise();

    const document = new Document({
      filename: originalname,
      url: Location,
      size: buffer.length,
      user_id: userId,
      key : params.Key
    });

    const upload = new Upload({
      user_id : userId,
      document_id : document._id
    })

    await document.save();
    await upload.save();
    return document;
    // return res.status(200).send('Document Uploaded Successfully');
  } catch (error) {
    console.error('Error uploading file to S3:', error);
    throw new Error('Error uploading file');
    // return res.status(500).send('Document Uploaded Unsuccessfully');
  }
};

export default uploadFile;
