import mongoose, { mongo } from 'mongoose';

const upload = mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  document_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Document' }
},
{ collection: 'Upload' }
);

export default mongoose.model('Upload', upload);
