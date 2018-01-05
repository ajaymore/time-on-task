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

var _user = require('./user.model');

var _user2 = _interopRequireDefault(_user);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var RefreshTokenSchema = new _mongoose2.default.Schema({
  refreshToken: {
    type: String,
    required: true
  },
  uid: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User'
  }
});

RefreshTokenSchema.pre('remove', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(doc, next) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return User.findByIdAndUpdate(doc.uid, {
              $pullAll: {
                $pullAll: {
                  refreshTokens: [doc._id]
                }
              }
            });

          case 2:

            next(null, doc);

          case 3:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function (_x, _x2) {
    return _ref.apply(this, arguments);
  };
}());

exports.default = _mongoose2.default.model('RefreshToken', RefreshTokenSchema);