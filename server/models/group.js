import mongoose from 'mongoose';
import moment from 'moment';

let GroupSchema = new mongoose.Schema({
  groupName: { type: String, required: true },
  createdAt: { type: Date, default: moment().valueOf() },
  updatedAt: { type: Date, default: moment().valueOf() },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

export default mongoose.model('Group', GroupSchema);
