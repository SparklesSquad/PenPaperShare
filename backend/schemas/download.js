import mongoose, { mongo } from 'mongoose';

const download = mongoose.Schema({
  upload_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  download_user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' },
},
{ collection: 'Download' }
);

export default mongoose.model('Download', download);
