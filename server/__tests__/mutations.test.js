import {
  createClassroom,
  createSchool,
  editSchool,
  editClassroom,
  deleteSchool,
  deleteClassroom,
  addObservation,
  removeObservation
} from '../resolvers/mutations';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
import Classroom from '../models/classroom';
import School from '../models/school';
import Observation from '../models/observation';
import User from '../models/user';
import casual from 'casual';
import moment from 'moment';

const waitForConnection = () => {
  return new Promise((res, rej) => {
    try {
      mongoose.connection.once('open', () => {
        res('done');
      });
    } catch (err) {
      console.log(err);
      rej(err);
    }
  });
};

describe('Test all mutations', function() {
  let schoolId = null;
  let schooldata = null;
  let userId = null;
  let userdata = null;
  let clasroomdata = null;
  let todeleteSchool = null;
  let observationdata = null;
  beforeAll(async () => {
    console.log('======================Tests Started======================');
    mongoose.connect('mongodb://localhost:27017/alberta-test', {
      useMongoClient: true
    });
    const result = await waitForConnection();

    await User.remove({});
    await School.remove({});
    await Classroom.remove({});
    await Observation.remove({});

    let newUser = new User();
    newUser.email = casual.email;
    newUser.userName = casual.username;
    newUser.picture = casual.url;
    await newUser.save();

    todeleteSchool = new School();
    todeleteSchool.name = casual.name;
    todeleteSchool.address = casual.address;
    todeleteSchool.town = casual.city;
    todeleteSchool.owner = newUser._id;
    await todeleteSchool.save();

    let newSchool = new School();
    newSchool.name = casual.name;
    newSchool.address = casual.address;
    newSchool.town = casual.city;
    newSchool.owner = newUser._id;
    await newSchool.save();

    let newClassroom = new Classroom();
    newClassroom.type = casual.word;
    newClassroom.grade = casual.integer(1, 10);
    newClassroom.totalStudents = casual.integer(30, 60);
    newClassroom.school = newSchool._id;
    newClassroom.subject = 'eng';
    newClassroom.teacher = casual.full_name;
    await newClassroom.save();

    newSchool.classrooms = [newClassroom._id];
    await newSchool.save();

    clasroomdata = newClassroom;
    schooldata = newSchool;
    schoolId = newSchool._id.toString();
    userId = newUser._id.toString();

    observationdata = new Observation();
    observationdata.endtime = moment().valueOf();
    observationdata.starttime = moment().valueOf();
    observationdata.classroom = clasroomdata._id;
    observationdata.readings = JSON.stringify([1, 2, 3, 4, 5, 6]);
    observationdata.createdBy = userId;
    await observationdata.save();
  });

  beforeEach(() => {});

  test('it should create the school', async () => {
    const input = {
      name: casual.name,
      address: casual.address,
      town: casual.city
    };
    const newSchool = await createSchool(
      {},
      {
        input
      },
      {
        user: {
          id: userId
        }
      }
    );
    expect(newSchool.name).toEqual(input.name);
    expect(newSchool.address).toEqual(input.address);
    expect(newSchool.town).toEqual(input.town);
  });

  test('it should create a classroom object and add its refrence to school object', async () => {
    const input = {
      type: casual.word,
      grade: casual.integer(1, 10),
      totalStudents: casual.integer(30, 60),
      school: schoolId,
      subject: 'eng',
      teacher: casual.full_name
    };
    const classroom = await createClassroom(
      {},
      {
        input
      },
      {}
    );
    expect(classroom.type).toEqual(input.type);
    expect(parseInt(classroom.grade, 10)).toEqual(input.grade);
    expect(parseInt(classroom.totalStudents, 10)).toEqual(input.totalStudents);
    expect(classroom.school.toString()).toEqual(input.school);
    expect(classroom.subject).toEqual(input.subject);
    expect(classroom.teacher).toEqual(input.teacher);
  });

  test('it should edit the existing school entry #mutation(editSchool)', async () => {
    const input = {
      address: casual.address,
      town: casual.city,
      name: schooldata.name
    };
    const editedSchool = await editSchool(
      {},
      {
        input,
        schoolId
      },
      {
        user: {
          id: userId
        }
      }
    );
    expect(editedSchool.name).toEqual(schooldata.name);
    expect(editedSchool.address).toEqual(input.address);
    expect(editedSchool.town).toEqual(input.town);
    expect(editedSchool._id.toString()).toEqual(schoolId);
  });
  test('it should edit the existing classroom entry #mutation(editClassroom)', async () => {
    const input = {
      type: casual.word,
      grade: casual.integer(1, 10),
      totalStudents: casual.integer(30, 60),
      subject: 'eng',
      teacher: clasroomdata.teacher
    };
    const editedClassroom = await editClassroom(
      {},
      {
        input,
        classroomId: clasroomdata._id
      },
      {
        user: {
          id: userId
        }
      }
    );
    expect(editedClassroom.subject).toEqual(input.subject);
    expect(editedClassroom.type).toEqual(input.type);
    expect(editedClassroom.teacher).toEqual(clasroomdata.teacher);
    expect(parseInt(editedClassroom.grade, 10)).toEqual(input.grade);
    expect(parseInt(editedClassroom.totalStudents)).toEqual(
      input.totalStudents
    );
  });

  test('it should delete the school if classrooms are not present', async () => {
    const deleteMessage = await deleteSchool(
      {},
      { schoolId: todeleteSchool._id },
      {
        user: {
          id: userId
        }
      }
    );
    expect(deleteMessage).toEqual('Done');
  });

  test('it should NOT delete the school if classrooms are associated', async () => {
    const schoolDeleteMessage = await deleteSchool(
      {},
      { schoolId },
      {
        user: {
          id: userId
        }
      }
    );
    expect(schoolDeleteMessage).not.toEqual('Done');
  });

  // test('it should delete the classroom if observations are not present', async () => {
  //   const deleteMessage = await deleteClassroom(
  //     {},
  //     { classroomId: clasroomdata._id },
  //     {
  //       user: {
  //         id: userId
  //       }
  //     }
  //   );
  //   expect(deleteMessage).toEqual('Done');
  // });

  test('it should NOT delete the school if classrooms are associated', async () => {
    const schoolDeleteMessage = await deleteSchool(
      {},
      { schoolId },
      {
        user: {
          id: userId
        }
      }
    );
    expect(schoolDeleteMessage).not.toEqual('Done');
  });

  test('it should create a new observation', async () => {
    const input = {
      endtime: moment().valueOf(),
      starttime: moment().valueOf(),
      readings: JSON.stringify([1, 2, 3, 4, 5, 6])
    };
    const newObservation = await addObservation(
      {},
      {
        input,
        classroomId: clasroomdata._id
      },
      {
        user: {
          id: userId
        }
      }
    );
    expect(moment(newObservation.endtime).valueOf()).toEqual(input.endtime);
    expect(moment(newObservation.starttime).valueOf()).toEqual(input.starttime);
    expect(newObservation.readings).toEqual(input.readings);
    expect(newObservation.createdBy.toString()).toEqual(userId);
  });

  test('it should remove the observation if user is same as creator, else it should not allow', async () => {
    let deleteMessage = await removeObservation(
      {},
      { observationId: observationdata._id },
      {
        user: {
          id: userId + '123'
        }
      }
    );
    expect(deleteMessage).not.toEqual('Done');

    deleteMessage = await removeObservation(
      {},
      { observationId: observationdata._id },
      {
        user: {
          id: userId
        }
      }
    );
    expect(deleteMessage).toEqual('Done');
  });

  afterEach(() => {});

  afterAll(done => {
    mongoose.disconnect(done);
    console.log('======================Tests Complete======================');
  });
});
