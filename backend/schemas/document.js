import express from 'express';
import mongoose from 'mongoose';

const document = mongoose.Schema(
  {
    id: Number,
    url: { type: String, required: true },
    size: { type: Number },
    filename: { type: String },
    description: { type: String },
    subject: { type: String },
    institute: { type: String },
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    key : {type : String, required : true}
  },
  { collection: 'Document' }
);

export default mongoose.model('Document', document);
