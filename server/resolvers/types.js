import UserModel from '../models/user.model';
import assign from 'lodash/assign';
import SchoolModel from '../models/school.model';
import ClassroomModel from '../models/classroom.model';
import ObservationModel from '../models/observation.model';

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

export const Observation = {
  readings(observation) {
    let ds = {
      One: [],
      Two: [],
      Three: [],
      Four: [],
      'Total -': [],
      'Total 0-1': [],
      'Total 2': [],
      'Total 3-6': []
    };
    let values = JSON.parse(observation.readings);
    values.forEach(val => {
      const minute = val.minuteValue - 1;
      const ratings = val.ratings;
      ratings.forEach(rat => {
        ds[rat.title][minute] = rat.givenRating === 7 ? '-' : rat.givenRating;
        if (rat.givenRating === 7) {
          ds['Total -'][minute] = ds['Total -'][minute]
            ? ds['Total -'][minute] + 1
            : 1;
        } else if (rat.givenRating === 0 || rat.givenRating === 1) {
          ds['Total 0-1'][minute] = ds['Total 0-1'][minute]
            ? ds['Total 0-1'][minute] + 1
            : 1;
        } else if (rat.givenRating === 2) {
          ds['Total 2'][minute] = ds['Total 2'][minute]
            ? ds['Total 2'][minute] + 1
            : 1;
        } else if (rat.givenRating >= 3 && rat.givenRating <= 6) {
          ds['Total 3-6'][minute] = ds['Total 3-6'][minute]
            ? ds['Total 3-6'][minute] + 1
            : 1;
        }
      });
    });
    return JSON.stringify(ds);
  }
};
