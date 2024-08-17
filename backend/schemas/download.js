import mongoose from 'mongoose';

const download = mongoose.Schema(
  {
    upload_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index : true
    },
    download_user_id: {
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
  { collection: 'Download', timestamps : true}
);

export default mongoose.model('Download', download);
