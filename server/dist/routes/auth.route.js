'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _user = require('../models/user.model');

var _user2 = _interopRequireDefault(_user);

var _refreshToken = require('../models/refreshToken.model');

var _refreshToken2 = _interopRequireDefault(_refreshToken);

var _group = require('../models/group.model');

var _group2 = _interopRequireDefault(_group);

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var serializeUserAndGenerateTokens = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(req, res, next) {
    var user, refreshToken;
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return _user2.default.findOne({ email: req.user.email }).populate('groups');

          case 3:
            user = _context.sent;

            if (!user) {
              _context.next = 19;
              break;
            }

            req.user = {
              id: req.user._id,
              email: req.user.email,
              groups: user.groups
            };

            refreshToken = new _refreshToken2.default();

            refreshToken.refreshToken = _crypto2.default.randomBytes(40).toString('hex');
            refreshToken.uid = req.user.id;
            user.refreshTokens.push(refreshToken._id);

            _context.next = 12;
            return refreshToken.save();

          case 12:
            _context.next = 14;
            return refreshToken.save();

          case 14:

            req.refreshToken = refreshToken.refreshToken;
            req.accessToken = jwtTokenGenerator(req.user);
            next();
            _context.next = 20;
            break;

          case 19:
            res.status(400).json({ message: 'User not found!' });

          case 20:
            _context.next = 26;
            break;

          case 22:
            _context.prev = 22;
            _context.t0 = _context['catch'](0);

            console.log(_context.t0);
            res.status(400).json(_context.t0);

          case 26:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 22]]);
  }));

  return function serializeUserAndGenerateTokens(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

var destroyToken = function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
    var refreshToken, refreshTokenItem;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            refreshToken = req.body.refreshToken;

            if (refreshToken) {
              _context2.next = 5;
              break;
            }

            res.status(200).json({ message: 'success' });
            _context2.next = 16;
            break;

          case 5:
            _context2.prev = 5;
            _context2.next = 8;
            return _refreshToken2.default.findOne({
              refreshToken: refreshToken
            });

          case 8:
            refreshTokenItem = _context2.sent;

            refreshTokenItem.remove();
            res.status(200).json({ message: 'success' });
            _context2.next = 16;
            break;

          case 13:
            _context2.prev = 13;
            _context2.t0 = _context2['catch'](5);

            res.status(401).json(_context2.t0);

          case 16:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined, [[5, 13]]);
  }));

  return function destroyToken(_x4, _x5, _x6) {
    return _ref2.apply(this, arguments);
  };
}();

var jwtTokenGenerator = function jwtTokenGenerator(payload) {
  return _jsonwebtoken2.default.sign(payload, process.env.JWT_AUTH_SECRET, {
    // expiresIn: '2h'
  });
};

var generateNewToken = function () {
  var _ref3 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee3(req, res, next) {
    var refreshToken, user;
    return _regenerator2.default.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.prev = 0;
            _context3.next = 3;
            return _refreshToken2.default.findOne({
              refreshToken: req.body.refreshToken
            }).populate('uid', '_id email groups').populate('group');

          case 3:
            refreshToken = _context3.sent;
            user = {
              id: refreshToken.uid._id,
              email: refreshToken.uid.email
            };
            _context3.next = 7;
            return _group2.default.find({ _id: { $in: refreshToken.uid.groups } });

          case 7:
            user.groups = _context3.sent;

            res.status(200).json({ accessToken: jwtTokenGenerator(user) });
            _context3.next = 14;
            break;

          case 11:
            _context3.prev = 11;
            _context3.t0 = _context3['catch'](0);

            res.status(401).json(_context3.t0);

          case 14:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined, [[0, 11]]);
  }));

  return function generateNewToken(_x7, _x8, _x9) {
    return _ref3.apply(this, arguments);
  };
}();

router.post('/device-logout', destroyToken);
router.post('/renew-token', generateNewToken);
router.post('/device-login', _passport2.default.authenticate('custom', {
  session: false,
  failWithError: true
}), serializeUserAndGenerateTokens, function (req, res, next) {
  console.log('received form request...');
  res.status(200).json({
    user: (0, _extends3.default)({}, req.user, {
      accessToken: req.accessToken,
      refreshToken: req.refreshToken
    })
  });
});

router.get('/', function (req, res) {
  res.render('index', { user: req.user });
});

router.get('/login', function (req, res) {
  res.render('login', { user: req.user, error: req.flash('error') });
});

router.get('/logout', function (req, res, next) {
  req.logout();
  req.session.save(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/auth/login');
  });
});

router.get('/google', _passport2.default.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', _passport2.default.authenticate('google', {
  failureRedirect: process.env.ENVIRONMENT === 'production' ? '/auth/login' : 'http://localhost:3000/login.html',
  failureFlash: true
}), function (req, res, next) {
  console.log('redirecting...');
  req.session.save(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect(process.env.ENVIRONMENT === 'production' ? process.env.APP_URL : 'http://localhost:3000/');
  });
});

exports.default = router;