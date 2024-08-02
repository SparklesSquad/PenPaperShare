import mongoose from 'mongoose';

const Rating = mongoose.Schema(
  {
    upload_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    download_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    document_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Document',
      required: true,
    },
    rating: { type: Number, required: true, max: 5 },
  },
  { collection: 'Rating' }
);

export default mongoose.model('Rating', Rating);
