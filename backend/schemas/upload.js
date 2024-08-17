import mongoose from 'mongoose';

const upload = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index : true
    },
    document_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
      index : true
    },
  },
  { collection: 'Upload', timestamps : true }
);

export default mongoose.model('Upload', upload);
