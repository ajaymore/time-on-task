'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

var _group = require('./group.model');

var _group2 = _interopRequireDefault(_group);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var UserSchema = new _mongoose2.default.Schema({
  email: { type: String, lowercase: true, required: true },
  userName: { type: String },
  blocked: { type: Boolean, default: false },
  picture: { type: String },
  groups: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'Group' }],
  refreshTokens: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'RefreshToken' }],
  createdAt: { type: Date, default: (0, _moment2.default)().valueOf() },
  updatedAt: { type: Date, default: (0, _moment2.default)().valueOf() },
  sharedSchools: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'School' }],
  contributions: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'School' }],
  ownership: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'School' }]
});

UserSchema.statics.generateHash = function (password) {
  return _bcrypt2.default.hashSync(password, _bcrypt2.default.genSaltSync(10), null);
};

UserSchema.statics.validPassword = function (user, password) {
  return _bcrypt2.default.compareSync(password, user.password);
};

UserSchema.post('remove', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(doc, next) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return doc.groups.forEach(function () {
              var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(group) {
                return _regenerator2.default.wrap(function _callee$(_context) {
                  while (1) {
                    switch (_context.prev = _context.next) {
                      case 0:
                        _context.next = 2;
                        return _group2.default.findByIdAndUpdate(group, {
                          $pullAll: {
                            users: [doc._id]
                          }
                        });

                      case 2:
                      case 'end':
                        return _context.stop();
                    }
                  }
                }, _callee, undefined);
              }));

              return function (_x3) {
                return _ref2.apply(this, arguments);
              };
            }());

          case 2:

            next(null, doc);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

UserSchema.post('save', function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee4(doc, next) {
    return _regenerator2.default.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return doc.groups.forEach(function () {
              var _ref4 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(group) {
                return _regenerator2.default.wrap(function _callee3$(_context3) {
                  while (1) {
                    switch (_context3.prev = _context3.next) {
                      case 0:
                        _context3.next = 2;
                        return _group2.default.findByIdAndUpdate(group, {
                          $addToSet: {
                            users: doc._id
                          }
                        }, {
                          safe: true,
                          upsert: true,
                          new: true
                        });

                      case 2:
                      case 'end':
                        return _context3.stop();
                    }
                  }
                }, _callee3, undefined);
              }));

              return function (_x6) {
                return _ref4.apply(this, arguments);
              };
            }());

          case 2:

            next(null, doc);

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x4, _x5) {
    return _ref3.apply(this, arguments);
  };
}());

exports.default = _mongoose2.default.model('User', UserSchema);