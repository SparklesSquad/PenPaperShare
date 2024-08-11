import mongoose from 'mongoose';

const upload = mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    document_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  { collection: 'Upload' }
);

export default mongoose.model('Upload', upload);
