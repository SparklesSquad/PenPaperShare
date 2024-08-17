import AWS from 'aws-sdk';
import pdfpoppler from 'pdf-poppler';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import dotenv from 'dotenv';
import Document from './../schemas/document.js';

dotenv.config();

const S3 = new AWS.S3();
const writeFile = promisify(fs.writeFile);
const readFile = promisify(fs.readFile);
const unlink = promisify(fs.unlink);



export async function processAndUploadFirstPage(pdfKey, pdfName, id) {
    
    const pathName = './';

    const tempPdfPath = path.join(pathName, 'temp.pdf');
    const tempImagePath = path.join(pathName, 'first-page-1.png');

  try {
    // Step 1: Download the PDF from S3
    const params = { Bucket: process.env.PDF_BUCKET_NAME, Key: pdfKey };
    const { Body: pdfBuffer } = await S3.getObject(params).promise();
    
    // Save the PDF buffer to a temporary file
    await writeFile(tempPdfPath, pdfBuffer);

    // Step 2: Convert the first page of the PDF to an image
    const options = {
      format: 'png',
      out_dir: pathName,
      out_prefix: 'first-page',
      page: 1 // Convert only the first page
    };

    //Adds -1 to the filename by deafult
    await pdfpoppler.convert(tempPdfPath, options);

    // Step 3: Upload the image to S3
    const imageBytes = await readFile(tempImagePath);

    const uploadParams = {
      Bucket: process.env.IMAGE_BUCKET_NAME,
      Key: `images/${Date.now()}-${pdfName}`,
      Body: imageBytes,
      ContentType: 'image/png'
    };
    await S3.upload(uploadParams).promise();

    //To update imageKey in the database
    const document = await Document.findByIdAndUpdate(id, {
        imageKey : uploadParams.Key,
      });

    return document;
  } catch (error) {
    console.error('Error processing PDF and uploading image:', error);
    throw error;
  } finally {
    // Step 4: Clean up temporary files
    try {
      await unlink(tempPdfPath);
      await unlink(tempImagePath);
    } catch (cleanupError) {
      console.error('Error cleaning up temporary files:', cleanupError);
    }
  }
}


