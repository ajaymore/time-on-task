'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Observation = exports.Classroom = exports.School = exports.User = undefined;

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

var _school = require('../models/school.model');

var _school2 = _interopRequireDefault(_school);

var _classroom = require('../models/classroom.model');

var _classroom2 = _interopRequireDefault(_classroom);

var _observation = require('../models/observation.model');

var _observation2 = _interopRequireDefault(_observation);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var fromMongo = function fromMongo(item) {
  return (0, _assign2.default)(item, { id: item._id.toString() });
};

var User = exports.User = {
  id: function id(user) {
    return user._id;
  },
  sharedSchools: function sharedSchools(user) {
    var _this = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee() {
      return _regenerator2.default.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _school2.default.find({
                _id: {
                  $in: user.sharedSchools
                }
              });

            case 2:
              return _context.abrupt('return', _context.sent);

            case 3:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, _this);
    }))();
  },
  contributions: function contributions(user) {
    var _this2 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
      return _regenerator2.default.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return _school2.default.find({
                _id: {
                  $in: user.contributions
                }
              });

            case 2:
              return _context2.abrupt('return', _context2.sent);

            case 3:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, _this2);
    }))();
  },
  ownership: function ownership(user) {
    var _this3 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3() {
      return _regenerator2.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return _school2.default.find({
                _id: {
                  $in: user.ownership
                }
              });

            case 2:
              return _context3.abrupt('return', _context3.sent);

            case 3:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, _this3);
    }))();
  }
};

var School = exports.School = {
  id: function id(school) {
    return school._id;
  },
  owner: function owner(school, args, ctx) {
    var _this4 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
      return _regenerator2.default.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              _context4.next = 2;
              return _user2.default.findOne({ _id: school.owner }, 'id email');

            case 2:
              return _context4.abrupt('return', _context4.sent);

            case 3:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this4);
    }))();
  },
  sharedWith: function sharedWith(school, args, ctx) {
    var _this5 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee5() {
      return _regenerator2.default.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              _context5.next = 2;
              return _user2.default.find({
                _id: {
                  $in: school.sharedWith
                }
              }, 'id email');

            case 2:
              return _context5.abrupt('return', _context5.sent);

            case 3:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this5);
    }))();
  },
  contributors: function contributors(school, args, ctx) {
    var _this6 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
      return _regenerator2.default.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              _context6.next = 2;
              return _user2.default.find({
                _id: {
                  $in: school.contributors
                }
              }, 'id email');

            case 2:
              return _context6.abrupt('return', _context6.sent);

            case 3:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this6);
    }))();
  },
  classrooms: function classrooms(school, args, ctx) {
    var _this7 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee7() {
      return _regenerator2.default.wrap(function _callee7$(_context7) {
        while (1) {
          switch (_context7.prev = _context7.next) {
            case 0:
              _context7.next = 2;
              return _classroom2.default.find({
                _id: {
                  $in: school.classrooms
                }
              });

            case 2:
              return _context7.abrupt('return', _context7.sent);

            case 3:
            case 'end':
              return _context7.stop();
          }
        }
      }, _callee7, _this7);
    }))();
  }
};

var Classroom = exports.Classroom = {
  observations: function observations(classroom, args, ctx) {
    var _this8 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
      return _regenerator2.default.wrap(function _callee8$(_context8) {
        while (1) {
          switch (_context8.prev = _context8.next) {
            case 0:
              _context8.next = 2;
              return _observation2.default.find({
                _id: {
                  $in: classroom.observations
                }
              });

            case 2:
              return _context8.abrupt('return', _context8.sent);

            case 3:
            case 'end':
              return _context8.stop();
          }
        }
      }, _callee8, _this8);
    }))();
  },
  school: function school(classroom, args, ctx) {
    var _this9 = this;

    return (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee9() {
      return _regenerator2.default.wrap(function _callee9$(_context9) {
        while (1) {
          switch (_context9.prev = _context9.next) {
            case 0:
              _context9.next = 2;
              return _school2.default.findOne({ _id: classroom.school });

            case 2:
              return _context9.abrupt('return', _context9.sent);

            case 3:
            case 'end':
              return _context9.stop();
          }
        }
      }, _callee9, _this9);
    }))();
  }
};

var Observation = exports.Observation = {
  readings: function readings(observation) {
    var ds = {
      One: [],
      Two: [],
      Three: [],
      Four: [],
      'Total -': [],
      'Total 0-1': [],
      'Total 2': [],
      'Total 3-6': []
    };
    var values = JSON.parse(observation.readings);
    values.forEach(function (val) {
      var minute = val.minuteValue - 1;
      var ratings = val.ratings;
      ratings.forEach(function (rat) {
        ds[rat.title][minute] = rat.givenRating === 7 ? '-' : rat.givenRating;
        if (rat.givenRating === 7) {
          ds['Total -'][minute] = ds['Total -'][minute] ? ds['Total -'][minute] + 1 : 1;
        } else if (rat.givenRating === 0 || rat.givenRating === 1) {
          ds['Total 0-1'][minute] = ds['Total 0-1'][minute] ? ds['Total 0-1'][minute] + 1 : 1;
        } else if (rat.givenRating === 2) {
          ds['Total 2'][minute] = ds['Total 2'][minute] ? ds['Total 2'][minute] + 1 : 1;
        } else if (rat.givenRating >= 3 && rat.givenRating <= 6) {
          ds['Total 3-6'][minute] = ds['Total 3-6'][minute] ? ds['Total 3-6'][minute] + 1 : 1;
        }
      });
    });
    return (0, _stringify2.default)(ds);
  }
};