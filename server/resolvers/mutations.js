import { pubsub } from '../socket';
const MESSAGE_ADDED_TOPIC = 'messageAdded';
import School from '../models/school.model';
import Classroom from '../models/classroom.model';
import Observation from '../models/observation.model';
import User from '../models/user.model';
import { GraphQLError } from 'graphql';
import moment from 'moment';
import { AuthenticationRequiredError } from './index';

// export const createMessage = (_, args, ctx) => {
//   // return messageLogic.createMessage(_, args, ctx).then(message => {
//   //   // Publish subscription notification with message
//   //   pubsub.publish(MESSAGE_ADDED_TOPIC, { [MESSAGE_ADDED_TOPIC]: message });
//   //   return message;
//   // });
//   console.log(args, ctx);
//   pubsub.publish(MESSAGE_ADDED_TOPIC, {
//     [MESSAGE_ADDED_TOPIC]: {
//       id: 1
//     }
//   });
//   return {
//     id: 1
//   };
// };

// export const createUser = () => {
//   pubsub.publish(MESSAGE_ADDED_TOPIC, {
//     [MESSAGE_ADDED_TOPIC]: {
//       id: 1
//     }
//   });
//   return {
//     id: 1
//   };
// };

export const createSchool = async (
  root,
  { input: { name, address, town } },
  ctx
) => {
  if (!ctx.user) throw AuthenticationRequiredError;
  let newSchool = new School();
  newSchool.name = name;
  newSchool.address = address;
  newSchool.town = town;
  newSchool.owner = ctx.user.id;
  const savedEntry = await newSchool.save();
  return savedEntry;
};

export const createClassroom = async (
  root,
  { input: { type, grade, totalStudents, school, subject, teacher } },
  ctx
) => {
  if (!ctx.user) throw AuthenticationRequiredError;

  const record = await School.findById(school);
  if (ctx.user.id !== record.owner.toString()) {
    return new GraphQLError('Only owner can add a class entry');
  }

  let newClassrom = new Classroom();
  newClassrom.type = type;
  newClassrom.grade = grade;
  newClassrom.totalStudents = totalStudents;
  newClassrom.school = school;
  newClassrom.subject = subject;
  newClassrom.teacher = teacher;
  const savedEntry = await newClassrom.save();
  return savedEntry;
};

export const addCollborator = async (
  root,
  { schoolId, userId, collaborationType },
  ctx
) => {
  if (!ctx.user) throw AuthenticationRequiredError;
  const record = await School.findById(schoolId);
  if (userId === record.owner.toString()) {
    return new GraphQLError('Owner already has full access to this school');
  }

  const schoolRecord = await School.findByIdAndUpdate(
    schoolId,
    {
      $addToSet:
        collaborationType === 'SHARED'
          ? {
              sharedWith: userId
            }
          : {
              contributors: userId
            }
    },
    {
      safe: true,
      upsert: true,
      new: true
    }
  );

  const userRecord = await User.findByIdAndUpdate(
    userId,
    {
      $addToSet:
        collaborationType === 'SHARED'
          ? {
              sharedSchools: schoolId
            }
          : {
              contributions: schoolId
            }
    },
    {
      safe: true,
      upsert: true,
      new: true
    }
  );

  return schoolRecord;
};

export const removeCollboration = async (
  root,
  { schoolId, userId, collaborationType },
  ctx
) => {
  if (!ctx.user) throw AuthenticationRequiredError;
  const schoolRecord = await School.findByIdAndUpdate(
    schoolId,
    {
      $pullAll:
        collaborationType === 'SHARED'
          ? {
              sharedWith: [userId]
            }
          : {
              contributors: [userId]
            }
    },
    {
      safe: true,
      upsert: true,
      new: true
    }
  );

  const userRecord = await User.findByIdAndUpdate(
    userId,
    {
      $pullAll:
        collaborationType === 'SHARED'
          ? {
              sharedSchools: [schoolId]
            }
          : {
              contributions: [schoolId]
            }
    },
    {
      safe: true,
      upsert: true,
      new: true
    }
  );

  return schoolRecord;
};

export const editSchool = async (
  root,
  { input: { address, town, name }, schoolId },
  ctx
) => {
  if (!ctx.user) throw AuthenticationRequiredError;
  return await School.findByIdAndUpdate(
    schoolId,
    { $set: { address, town, name } },
    { new: true }
  );
};

export const editClassroom = async (root, { input, classroomId }, ctx) => {
  if (!ctx.user) throw AuthenticationRequiredError;
  return await Classroom.findByIdAndUpdate(
    classroomId,
    { $set: input },
    { new: true }
  );
};

export const deleteSchool = async (root, { schoolId }, ctx) => {
  if (!ctx.user) throw AuthenticationRequiredError;
  const school = await School.findById(schoolId);
  if (school.classrooms.length !== 0) {
    return new GraphQLError(
      'Please remove all associated classes before deleting the school'
    );
  }
  if (ctx.user.id !== school.owner.toString()) {
    return new GraphQLError('Only owner can remove a school entry');
  }
  await school.remove();
  return 'Done';
};

export const deleteClassroom = async (root, { classroomId }, ctx) => {
  if (!ctx.user) throw AuthenticationRequiredError;

  const classRecord = await Classroom.findById(classroomId);
  const record = await School.findById(classRecord.school);
  if (ctx.user.id !== record.owner.toString()) {
    return new GraphQLError('Only owner can remove a class entry');
  }

  const classroom = await Classroom.findById(classroomId);
  if (classroom.observations.length !== 0) {
    return new GraphQLError(
      'Please remove all associated observations before deleting the class'
    );
  }
  await classroom.remove();
  return 'Done';
};

export const addObservation = async (
  root,
  { input: { endtime, starttime, readings }, classroomId },
  ctx
) => {
  if (!ctx.user) throw AuthenticationRequiredError;
  let newObservation = new Observation();
  newObservation.endtime = endtime;
  newObservation.starttime = starttime;
  newObservation.readings = readings;
  newObservation.classroom = classroomId;
  newObservation.createdBy = ctx.user.id;
  const savedEntry = await newObservation.save();
  return savedEntry;
};

export const removeObservation = async (root, { observationId }, ctx) => {
  if (!ctx.user) throw AuthenticationRequiredError;
  const observation = await Observation.findById(observationId);
  const associatedClass = await Classroom.findById(observation.classroom);
  const associatedSchool = await School.findById(associatedClass.school);
  if (associatedSchool.owner.toString() !== ctx.user.id) {
    return new GraphQLError('You are not authorized to delete the observation');
  }
  await observation.remove();
  return 'Done';
};
