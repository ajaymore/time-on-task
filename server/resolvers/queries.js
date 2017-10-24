import User from '../models/user';
import { AuthenticationRequiredError } from './index';
import School from '../models/school';
import Classroom from '../models/classroom';

export const getUser = async (root, args, ctx) => {
  if (!ctx.user) throw AuthenticationRequiredError;

  return await User.findById(ctx.user.id);
};

export const getSchool = async (root, { schoolId }, ctx) => {
  if (!ctx.user) throw AuthenticationRequiredError;

  return await School.findById(schoolId);
};

export const getClassroom = async (root, { classroomId }, ctx) => {
  if (!ctx.user) throw AuthenticationRequiredError;

  return await Classroom.findById(classroomId);
};
