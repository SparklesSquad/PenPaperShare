import mongoose from 'mongoose';

const download = mongoose.Schema(
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
  },
  { collection: 'Download' }
);

export default mongoose.model('Download', download);
