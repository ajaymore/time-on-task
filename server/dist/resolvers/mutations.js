'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.removeObservation = exports.addObservation = exports.deleteClassroom = exports.deleteSchool = exports.editClassroom = exports.editSchool = exports.removeCollboration = exports.addCollborator = exports.createClassroom = exports.createSchool = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _socket = require('../socket');

var _school = require('../models/school.model');

var _school2 = _interopRequireDefault(_school);

var _classroom = require('../models/classroom.model');

var _classroom2 = _interopRequireDefault(_classroom);

var _observation = require('../models/observation.model');

var _observation2 = _interopRequireDefault(_observation);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _graphql = require('graphql');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _index = require('./index');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MESSAGE_ADDED_TOPIC = 'messageAdded';


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

var createSchool = exports.createSchool = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(root, _ref2, ctx) {
    var _ref2$input = _ref2.input,
        name = _ref2$input.name,
        address = _ref2$input.address,
        town = _ref2$input.town;
    var newSchool, savedEntry;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            if (ctx.user) {
              _context.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            newSchool = new _school2.default();

            newSchool.name = name;
            newSchool.address = address;
            newSchool.town = town;
            newSchool.owner = ctx.user.id;
            _context.next = 9;
            return newSchool.save();

          case 9:
            savedEntry = _context.sent;
            return _context.abrupt('return', savedEntry);

          case 11:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createSchool(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var createClassroom = exports.createClassroom = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(root, _ref4, ctx) {
    var _ref4$input = _ref4.input,
        type = _ref4$input.type,
        grade = _ref4$input.grade,
        totalStudents = _ref4$input.totalStudents,
        school = _ref4$input.school,
        subject = _ref4$input.subject,
        teacher = _ref4$input.teacher;
    var record, newClassrom, savedEntry;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (ctx.user) {
              _context2.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            _context2.next = 4;
            return _school2.default.findById(school);

          case 4:
            record = _context2.sent;

            if (!(ctx.user.id !== record.owner.toString())) {
              _context2.next = 7;
              break;
            }

            return _context2.abrupt('return', new _graphql.GraphQLError('Only owner can add a class entry'));

          case 7:
            newClassrom = new _classroom2.default();

            newClassrom.type = type;
            newClassrom.grade = grade;
            newClassrom.totalStudents = totalStudents;
            newClassrom.school = school;
            newClassrom.subject = subject;
            newClassrom.teacher = teacher;
            _context2.next = 16;
            return newClassrom.save();

          case 16:
            savedEntry = _context2.sent;
            return _context2.abrupt('return', savedEntry);

          case 18:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function createClassroom(_x4, _x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}();

var addCollborator = exports.addCollborator = function () {
  var _ref5 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(root, _ref6, ctx) {
    var schoolId = _ref6.schoolId,
        userId = _ref6.userId,
        collaborationType = _ref6.collaborationType;
    var record, schoolRecord, userRecord;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            if (ctx.user) {
              _context3.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            _context3.next = 4;
            return _school2.default.findById(schoolId);

          case 4:
            record = _context3.sent;

            if (!(userId === record.owner.toString())) {
              _context3.next = 7;
              break;
            }

            return _context3.abrupt('return', new _graphql.GraphQLError('Owner already has full access to this school'));

          case 7:
            _context3.next = 9;
            return _school2.default.findByIdAndUpdate(schoolId, {
              $addToSet: collaborationType === 'SHARED' ? {
                sharedWith: userId
              } : {
                contributors: userId
              }
            }, {
              safe: true,
              upsert: true,
              new: true
            });

          case 9:
            schoolRecord = _context3.sent;
            _context3.next = 12;
            return _user2.default.findByIdAndUpdate(userId, {
              $addToSet: collaborationType === 'SHARED' ? {
                sharedSchools: schoolId
              } : {
                contributions: schoolId
              }
            }, {
              safe: true,
              upsert: true,
              new: true
            });

          case 12:
            userRecord = _context3.sent;
            return _context3.abrupt('return', schoolRecord);

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function addCollborator(_x7, _x8, _x9) {
    return _ref5.apply(this, arguments);
  };
}();

var removeCollboration = exports.removeCollboration = function () {
  var _ref7 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(root, _ref8, ctx) {
    var schoolId = _ref8.schoolId,
        userId = _ref8.userId,
        collaborationType = _ref8.collaborationType;
    var schoolRecord, userRecord;
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            if (ctx.user) {
              _context4.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            _context4.next = 4;
            return _school2.default.findByIdAndUpdate(schoolId, {
              $pullAll: collaborationType === 'SHARED' ? {
                sharedWith: [userId]
              } : {
                contributors: [userId]
              }
            }, {
              safe: true,
              upsert: true,
              new: true
            });

          case 4:
            schoolRecord = _context4.sent;
            _context4.next = 7;
            return _user2.default.findByIdAndUpdate(userId, {
              $pullAll: collaborationType === 'SHARED' ? {
                sharedSchools: [schoolId]
              } : {
                contributions: [schoolId]
              }
            }, {
              safe: true,
              upsert: true,
              new: true
            });

          case 7:
            userRecord = _context4.sent;
            return _context4.abrupt('return', schoolRecord);

          case 9:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function removeCollboration(_x10, _x11, _x12) {
    return _ref7.apply(this, arguments);
  };
}();

var editSchool = exports.editSchool = function () {
  var _ref9 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5(root, _ref10, ctx) {
    var _ref10$input = _ref10.input,
        address = _ref10$input.address,
        town = _ref10$input.town,
        name = _ref10$input.name,
        schoolId = _ref10.schoolId;
    return _regenerator2.default.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            if (ctx.user) {
              _context5.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            _context5.next = 4;
            return _school2.default.findByIdAndUpdate(schoolId, { $set: { address: address, town: town, name: name } }, { new: true });

          case 4:
            return _context5.abrupt('return', _context5.sent);

          case 5:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function editSchool(_x13, _x14, _x15) {
    return _ref9.apply(this, arguments);
  };
}();

var editClassroom = exports.editClassroom = function () {
  var _ref11 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6(root, _ref12, ctx) {
    var input = _ref12.input,
        classroomId = _ref12.classroomId;
    return _regenerator2.default.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            if (ctx.user) {
              _context6.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            _context6.next = 4;
            return _classroom2.default.findByIdAndUpdate(classroomId, { $set: input }, { new: true });

          case 4:
            return _context6.abrupt('return', _context6.sent);

          case 5:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function editClassroom(_x16, _x17, _x18) {
    return _ref11.apply(this, arguments);
  };
}();

var deleteSchool = exports.deleteSchool = function () {
  var _ref13 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7(root, _ref14, ctx) {
    var schoolId = _ref14.schoolId;
    var school;
    return _regenerator2.default.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            if (ctx.user) {
              _context7.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            _context7.next = 4;
            return _school2.default.findById(schoolId);

          case 4:
            school = _context7.sent;

            if (!(school.classrooms.length !== 0)) {
              _context7.next = 7;
              break;
            }

            return _context7.abrupt('return', new _graphql.GraphQLError('Please remove all associated classes before deleting the school'));

          case 7:
            if (!(ctx.user.id !== school.owner.toString())) {
              _context7.next = 9;
              break;
            }

            return _context7.abrupt('return', new _graphql.GraphQLError('Only owner can remove a school entry'));

          case 9:
            _context7.next = 11;
            return school.remove();

          case 11:
            return _context7.abrupt('return', 'Done');

          case 12:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function deleteSchool(_x19, _x20, _x21) {
    return _ref13.apply(this, arguments);
  };
}();

var deleteClassroom = exports.deleteClassroom = function () {
  var _ref15 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8(root, _ref16, ctx) {
    var classroomId = _ref16.classroomId;
    var classRecord, record, classroom;
    return _regenerator2.default.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            if (ctx.user) {
              _context8.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            _context8.next = 4;
            return _classroom2.default.findById(classroomId);

          case 4:
            classRecord = _context8.sent;
            _context8.next = 7;
            return _school2.default.findById(classRecord.school);

          case 7:
            record = _context8.sent;

            if (!(ctx.user.id !== record.owner.toString())) {
              _context8.next = 10;
              break;
            }

            return _context8.abrupt('return', new _graphql.GraphQLError('Only owner can remove a class entry'));

          case 10:
            _context8.next = 12;
            return _classroom2.default.findById(classroomId);

          case 12:
            classroom = _context8.sent;

            if (!(classroom.observations.length !== 0)) {
              _context8.next = 15;
              break;
            }

            return _context8.abrupt('return', new _graphql.GraphQLError('Please remove all associated observations before deleting the class'));

          case 15:
            _context8.next = 17;
            return classroom.remove();

          case 17:
            return _context8.abrupt('return', 'Done');

          case 18:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function deleteClassroom(_x22, _x23, _x24) {
    return _ref15.apply(this, arguments);
  };
}();

var addObservation = exports.addObservation = function () {
  var _ref17 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9(root, _ref18, ctx) {
    var _ref18$input = _ref18.input,
        endtime = _ref18$input.endtime,
        starttime = _ref18$input.starttime,
        readings = _ref18$input.readings,
        classroomId = _ref18.classroomId;
    var newObservation, savedEntry;
    return _regenerator2.default.wrap(function _callee9$(_context9) {
      while (1) {
        switch (_context9.prev = _context9.next) {
          case 0:
            if (ctx.user) {
              _context9.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            newObservation = new _observation2.default();

            newObservation.endtime = endtime;
            newObservation.starttime = starttime;
            newObservation.readings = readings;
            newObservation.classroom = classroomId;
            newObservation.createdBy = ctx.user.id;
            _context9.next = 10;
            return newObservation.save();

          case 10:
            savedEntry = _context9.sent;
            return _context9.abrupt('return', savedEntry);

          case 12:
          case 'end':
            return _context9.stop();
        }
      }
    }, _callee9, undefined);
  }));

  return function addObservation(_x25, _x26, _x27) {
    return _ref17.apply(this, arguments);
  };
}();

var removeObservation = exports.removeObservation = function () {
  var _ref19 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee10(root, _ref20, ctx) {
    var observationId = _ref20.observationId;
    var observation, associatedClass, associatedSchool;
    return _regenerator2.default.wrap(function _callee10$(_context10) {
      while (1) {
        switch (_context10.prev = _context10.next) {
          case 0:
            if (ctx.user) {
              _context10.next = 2;
              break;
            }

            throw _index.AuthenticationRequiredError;

          case 2:
            _context10.next = 4;
            return _observation2.default.findById(observationId);

          case 4:
            observation = _context10.sent;
            _context10.next = 7;
            return _classroom2.default.findById(observation.classroom);

          case 7:
            associatedClass = _context10.sent;
            _context10.next = 10;
            return _school2.default.findById(associatedClass.school);

          case 10:
            associatedSchool = _context10.sent;

            if (!(associatedSchool.owner.toString() !== ctx.user.id)) {
              _context10.next = 13;
              break;
            }

            return _context10.abrupt('return', new _graphql.GraphQLError('You are not authorized to delete the observation'));

          case 13:
            _context10.next = 15;
            return observation.remove();

          case 15:
            return _context10.abrupt('return', 'Done');

          case 16:
          case 'end':
            return _context10.stop();
        }
      }
    }, _callee10, undefined);
  }));

  return function removeObservation(_x28, _x29, _x30) {
    return _ref19.apply(this, arguments);
  };
}();