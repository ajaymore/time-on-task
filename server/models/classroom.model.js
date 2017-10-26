import mongoose from 'mongoose';
import moment from 'moment';
import School from './school.model';

let ClassroomSchema = new mongoose.Schema({
  type: { type: String, required: true },
  grade: { type: String, required: true },
  totalStudents: { type: Number, required: true, min: 2, max: 100 },
  teacher: { type: String, required: true },
  subject: { type: String, required: true },
  createdAt: { type: Date, default: moment().valueOf() },
  updatedAt: { type: Date, default: moment().valueOf() },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true
  },
  observations: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Observation' }]
});

ClassroomSchema.post('remove', async (doc, next) => {
  await School.findByIdAndUpdate(doc.school, {
    $pullAll: {
      classrooms: [doc._id]
    }
  });

  next(null, doc);
});

ClassroomSchema.post('save', async (doc, next) => {
  await School.findByIdAndUpdate(
    doc.school,
    {
      $addToSet: {
        classrooms: doc._id
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

export default mongoose.model('Classroom', ClassroomSchema);
