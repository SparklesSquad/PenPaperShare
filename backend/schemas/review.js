import mongoose, { mongo } from 'mongoose';

const review = mongoose.Schema({
  upload_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  download_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
  rating: { type: Number, required: true },
},
{ collection: 'Review' }
);

export default mongoose.model('Review', review);
