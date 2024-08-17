import s3 from './aws-config.js';
import dotenv from 'dotenv';
import fs from "fs";
import Download from './../schemas/download.js';

dotenv.config();

const downloadFile = async (document, download_user_id, upload_user_id) => {
  
  const params = {
    Bucket: process.env.PDF_BUCKET_NAME,
    Key: document.key
  };

  const downloadPath = `./${document.filename}`;

  try {
    const file = fs.createWriteStream(downloadPath);

    const download = new Download({
        upload_user_id : upload_user_id,
        download_user_id : download_user_id,
        document_id : document._id
    })

    s3.getObject(params)
        .createReadStream()
        .on('error', function(err) {
        console.error('Error downloading file:', err);
        })
        .pipe(file)
        .on('close', function() {
        console.log('File downloaded successfully to', downloadPath);
        })
    
        await download.save();

  } catch (error) {
    console.error(error);
    throw new Error('Error downloading file');
  }
};

export default downloadFile;
