import mongoose from 'mongoose';

const MAX_SIZE_BYTES = 50 * 1024 * 1024;

const document = mongoose.Schema(
  {
    url: { type: String, required: true },
    size: { type: Number, required: true, max: MAX_SIZE_BYTES },
    title: { type: String, required: true },
    filename: { type: String, required: true },
    description: { type: String, required: true },
    subject: { type: String, required: true },
    institute: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    key: { type: String, required: true },
    approved: { type: Boolean, default: false, required: true },
    createdAt: { type: Date, default: Date.now, required: true },
  },
  { collection: 'Document' }
);

export default mongoose.model('Document', document);
