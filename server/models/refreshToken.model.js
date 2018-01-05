import mongoose from 'mongoose';
import moment from 'moment';
import user from './user.model';

let RefreshTokenSchema = new mongoose.Schema({
  refreshToken: {
    type: String,
    required: true
  },
  uid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

RefreshTokenSchema.pre('remove', async (doc, next) => {
  await User.findByIdAndUpdate(doc.uid, {
    $pullAll: {
      $pullAll: {
        refreshTokens: [doc._id]
      }
    }
  });

  next(null, doc);
});

export default mongoose.model('RefreshToken', RefreshTokenSchema);
