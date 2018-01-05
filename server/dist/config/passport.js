'use strict';

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _passportGoogleOauth = require('passport-google-oauth20');

var _passportCustom = require('passport-custom');

var _passportCustom2 = _interopRequireDefault(_passportCustom);

var _nodeFetch = require('node-fetch');

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _casual = require('casual');

var _casual2 = _interopRequireDefault(_casual);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_passport2.default.use(new _passportGoogleOauth.Strategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.APP_URL + '/auth/google/callback'
}, function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(accessToken, refreshToken, profile, done) {
    var user, newUser;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _user2.default.findOne({
              email: profile.emails[0].value
            }).populate('groups');

          case 3:
            user = _context.sent;

            if (!user) {
              _context.next = 8;
              break;
            }

            done(null, user);
            _context.next = 13;
            break;

          case 8:
            newUser = new _user2.default();

            newUser.email = profile.emails[0].value;
            // newUser.userName = user.name;
            // newUser.picture = user.picture;
            _context.next = 12;
            return newUser.save();

          case 12:
            done(null, newUser);

          case 13:
            _context.next = 18;
            break;

          case 15:
            _context.prev = 15;
            _context.t0 = _context['catch'](0);

            done(_context.t0);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 15]]);
  }));

  return function (_x, _x2, _x3, _x4) {
    return _ref.apply(this, arguments);
  };
}()));

_passport2.default.use(new _passportCustom2.default(function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, done) {
    var response, user, savedUser, newUser;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            if (!req.body.accessToken) {
              done({ error: 'token not found!' });
            }
            _context2.prev = 1;
            _context2.next = 4;
            return (0, _nodeFetch2.default)('https://www.googleapis.com/oauth2/v3/userinfo?alt=json&access_token=' + req.body.accessToken);

          case 4:
            response = _context2.sent;
            _context2.next = 7;
            return response.json();

          case 7:
            user = _context2.sent;
            _context2.next = 10;
            return _user2.default.findOne({
              email: user.email
            }).populate('groups');

          case 10:
            savedUser = _context2.sent;

            if (!savedUser) {
              _context2.next = 15;
              break;
            }

            done(null, savedUser);
            _context2.next = 22;
            break;

          case 15:
            newUser = new _user2.default();

            newUser.email = user.email;
            newUser.userName = user.name;
            newUser.picture = user.picture;
            _context2.next = 21;
            return newUser.save();

          case 21:
            done(null, newUser);

          case 22:
            _context2.next = 28;
            break;

          case 24:
            _context2.prev = 24;
            _context2.t0 = _context2['catch'](1);

            console.log(_context2.t0);
            done(_context2.t0);

          case 28:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[1, 24]]);
  }));

  return function (_x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}()));

_passport2.default.serializeUser(function (user, done) {
  done(null, user._id);
});

_passport2.default.deserializeUser(function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(id, done) {
    var user;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _user2.default.findById(id).populate('groups', 'id groupName');

          case 3:
            user = _context3.sent;

            if (user) {
              done(null, {
                id: user._id,
                email: user.email,
                groups: user.groups,
                blocked: user.blocked
              });
            } else {
              done(true, null);
            }
            _context3.next = 10;
            break;

          case 7:
            _context3.prev = 7;
            _context3.t0 = _context3['catch'](0);

            done(_context3.t0);

          case 10:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 7]]);
  }));

  return function (_x7, _x8) {
    return _ref3.apply(this, arguments);
  };
}());