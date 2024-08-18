import AWS from 'aws-sdk';
import { PDFDocument } from 'pdf-lib';
import { fromBuffer } from 'pdf2pic';
import dotenv from 'dotenv';
import fs from 'fs';
import fsPromises from 'fs/promises';
import Document from './../schemas/document.js';

dotenv.config();

const S3 = new AWS.S3();

export async function processAndUploadFirstPage(pdfKey, documentId) {
  // This is just a temporary fix, to let the finally block access the file path.
  let tempfilepath = '';

  try {
    // Getting the details of the bucket
    const params = { Bucket: process.env.PDF_BUCKET_NAME, Key: pdfKey };

    // Downloading the pdf from the bucket.
    const { Body: pdfBuffer } = await S3.getObject(params).promise();

    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Creating a new empty pdf document
    const newPdfDoc = await PDFDocument.create();

    // we are just copying the reference of the pages into the new document.
    const [pages1] = await newPdfDoc.copyPages(pdfDoc, [0]);

    // Copying the pages into the new document
    newPdfDoc.addPage(pages1);

    // Serialize the new PDF document to a buffer
    const newPdfBytes = await newPdfDoc.save();

    // Convert the first page of the PDF to an image using pdf2pic
    const converter = fromBuffer(newPdfBytes, {
      density: 300, // Resolution (DPI)
      format: 'png', // Image format (jpeg, png, etc.)
      saveFilename: Date.now() + '-image',
      savePath: './tempimages/',
      width: 1024, // Width of the output image
      height: 1024, // Height of the output image
    });

    // Convert the first page and save it to a specific path
    const image = await converter(1);

    // Temp fix
    tempfilepath = image.path;

    // Reading the image inorder to store it to s3
    const realImage = fs.readFileSync(image.path);

    // Declaring the AWS Parameters
    const awsParams = {
      Bucket: process.env.IMAGE_BUCKET_NAME,
      Key: `images/${Date.now()}-image`,
      Body: realImage,
      ContentType: 'image/png',
    };

    // Getting the S3 URL of the image
    const { Location } = await S3.upload(awsParams).promise();

    // Updating the document with the image key and URL
    await Document.findByIdAndUpdate(documentId, {
      imageURL: Location,
      imageKey: awsParams.Key,
      approved: 'APPROVED',
    });
  } finally {
    // Step 4: Clean up temporary files
    await fsPromises.unlink(tempfilepath);
  }
}
