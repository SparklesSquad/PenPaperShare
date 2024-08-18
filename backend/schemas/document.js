import mongoose from 'mongoose';

const MAX_SIZE_BYTES = 50 * 1024 * 1024;

const document = mongoose.Schema(
  {
    url: { type: String, required: true },
    size: { type: Number, required: true, max: MAX_SIZE_BYTES },
    title: { type: String, required: true },
    filename: { type: String, required: true },
    country: { type: String, required: true },
    institute: { type: String, required: true },
    educationLevel: { type: String, required: true },
    major: { type: String, required: true },
    subject: { type: String, required: true },
    description: { type: String, required: true },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    key: { type: String, required: true },
    imageKey: { type: String },
    approved: {
      type: String,
      enum: ['APPROVED', 'REJECTED', 'PENDING'],
      default: 'PENDING',
      required: true,
    },
  },
  { collection: 'Document', timestamps: true }
);

document.index({ title: 'text', subject: 'text', institute: 'text' });
document.index({ subject: 1, institute: 1 });

export default mongoose.model('Document', document);
