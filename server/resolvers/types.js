import UserModel from '../models/user';
import assign from 'lodash/assign';
import SchoolModel from '../models/school';
import ClassroomModel from '../models/classroom';
import ObservationModel from '../models/observation';

const fromMongo = item => {
  return assign(item, { id: item._id.toString() });
};

export const User = {
  id(user) {
    return user._id;
  },
  async sharedSchools(user) {
    return await SchoolModel.find({
      _id: {
        $in: user.sharedSchools
      }
    });
  },
  async contributions(user) {
    return await SchoolModel.find({
      _id: {
        $in: user.contributions
      }
    });
  },
  async ownership(user) {
    return await SchoolModel.find({
      _id: {
        $in: user.ownership
      }
    });
  }
};

export const School = {
  id(school) {
    return school._id;
  },
  async owner(school, args, ctx) {
    return await UserModel.findOne({ _id: school.owner }, 'id email');
  },
  async sharedWith(school, args, ctx) {
    return await UserModel.find(
      {
        _id: {
          $in: school.sharedWith
        }
      },
      'id email'
    );
  },
  async contributors(school, args, ctx) {
    return await UserModel.find(
      {
        _id: {
          $in: school.contributors
        }
      },
      'id email'
    );
  },
  async classrooms(school, args, ctx) {
    return await ClassroomModel.find({
      _id: {
        $in: school.classrooms
      }
    });
  }
};

export const Classroom = {
  async observations(classroom, args, ctx) {
    return await ObservationModel.find({
      _id: {
        $in: classroom.observations
      }
    });
  },
  async school(classroom, args, ctx) {
    return await SchoolModel.findOne({ _id: classroom.school });
  }
};
