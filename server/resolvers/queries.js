import User from '../models/user.model';
import { AuthenticationRequiredError } from './index';
import School from '../models/school.model';
import Classroom from '../models/classroom.model';

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
