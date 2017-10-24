import mongoose from 'mongoose';
import moment from 'moment';
import Classroom from './classroom';

let ObservationSchema = new mongoose.Schema({
  readings: { type: String, required: true },
  endtime: { type: Date, required: true },
  starttime: { type: Date, required: true },
  createdAt: { type: Date, default: moment().valueOf() },
  updatedAt: { type: Date, default: moment().valueOf() },
  classroom: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

ObservationSchema.post('remove', async (doc, next) => {
  await Classroom.findByIdAndUpdate(doc.classroom, {
    $pullAll: {
      observations: [doc._id]
    }
  });

  next(null, doc);
});

ObservationSchema.post('save', async (doc, next) => {
  await Classroom.findByIdAndUpdate(
    doc.classroom,
    {
      $addToSet: {
        observations: doc._id
      }
    },
    {
      safe: true,
      upsert: true,
      new: true
    }
  );

  next(null, doc);
});

export default mongoose.model('Observation', ObservationSchema);
