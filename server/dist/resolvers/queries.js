'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getClassroom = exports.getSchool = exports.getUser = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _index = require('./index');

var _school = require('../models/school.model');

var _school2 = _interopRequireDefault(_school);

var _classroom = require('../models/classroom.model');

var _classroom2 = _interopRequireDefault(_classroom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var getUser = exports.getUser = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(root, args, ctx) {
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
            _context.next = 4;
            return _user2.default.findById(ctx.user.id);

          case 4:
            return _context.abrupt('return', _context.sent);

          case 5:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function getUser(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var getSchool = exports.getSchool = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(root, _ref3, ctx) {
    var schoolId = _ref3.schoolId;
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
            return _school2.default.findById(schoolId);

          case 4:
            return _context2.abrupt('return', _context2.sent);

          case 5:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function getSchool(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var getClassroom = exports.getClassroom = function () {
  var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(root, _ref5, ctx) {
    var classroomId = _ref5.classroomId;
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
            return _classroom2.default.findById(classroomId);

          case 4:
            return _context3.abrupt('return', _context3.sent);

          case 5:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function getClassroom(_x7, _x8, _x9) {
    return _ref4.apply(this, arguments);
  };
}();