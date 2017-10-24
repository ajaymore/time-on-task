import mongoose from 'mongoose';
import moment from 'moment';
import bCrypt from 'bcrypt';
import Group from './group';
import { fromMongo, toMongo } from '../utils';

let UserSchema = new mongoose.Schema({
  email: { type: String, lowercase: true, required: true },
  userName: { type: String },
  blocked: { type: Boolean, default: false },
  picture: { type: String },
  groups: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Group' }],
  refreshTokens: [
    { type: mongoose.Schema.Types.ObjectId, ref: 'RefreshToken' }
  ],
  createdAt: { type: Date, default: moment().valueOf() },
  updatedAt: { type: Date, default: moment().valueOf() },
  sharedSchools: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }],
  contributions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }],
  ownership: [{ type: mongoose.Schema.Types.ObjectId, ref: 'School' }]
});

UserSchema.statics.generateHash = password => {
  return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
};

UserSchema.statics.validPassword = (user, password) => {
  return bCrypt.compareSync(password, user.password);
};

UserSchema.post('remove', async (doc, next) => {
  await doc.groups.forEach(async group => {
    await Group.findByIdAndUpdate(group, {
      $pullAll: {
        users: [doc._id]
      }
    });
  });

  next(null, doc);
});

UserSchema.post('save', async (doc, next) => {
  await doc.groups.forEach(async group => {
    await Group.findByIdAndUpdate(
      group,
      {
        $addToSet: {
          users: doc._id
        }
      },
      {
        safe: true,
        upsert: true,
        new: true
      }
    );
  });

  next(null, doc);
});

export default mongoose.model('User', UserSchema);
