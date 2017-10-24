import mongoose from 'mongoose';
import moment from 'moment';
import User from './user'

let SchoolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30
  },
  address: { type: String, required: true },
  town: { type: String, required: true },
  createdAt: { type: Date, default: moment().valueOf() },
  updatedAt: { type: Date, default: moment().valueOf() },
  classrooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Classroom' }],
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sharedWith: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  contributors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

SchoolSchema.post('remove', async (doc, next) => {
    await User.findByIdAndUpdate(doc.owner, {
      $pullAll: {
        ownership: [doc._id]
      }
    });

  next(null, doc);
});

SchoolSchema.post('save', async (doc, next) => {
  await User.findByIdAndUpdate(doc.owner, {
        $addToSet: {
          ownership: doc._id
        }
      },
      {
        safe: true,
        upsert: true,
        new: true
      })

  next(null, doc);
});

export default mongoose.model('School', SchoolSchema);
