'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _asyncToGenerator2 = require('babel-runtime/helpers/asyncToGenerator');

var _asyncToGenerator3 = _interopRequireDefault(_asyncToGenerator2);

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _xoauth = require('xoauth2');

var _xoauth2 = _interopRequireDefault(_xoauth);

var _nodemailer = require('nodemailer');

var _nodemailer2 = _interopRequireDefault(_nodemailer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

var transporter = _nodemailer2.default.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    type: 'OAuth2',
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET
  }
});

var promisFn = function promisFn(x) {
  return new _promise2.default(function (resolve) {
    setTimeout(function () {
      resolve({ data: x });
    }, 1000);
  });
};

var fetchData = function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(query) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return promisFn('Hello World!!');

          case 3:
            return _context.abrupt('return', _context.sent);

          case 6:
            _context.prev = 6;
            _context.t0 = _context['catch'](0);
            return _context.abrupt('return', _context.t0);

          case 9:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined, [[0, 6]]);
  }));

  return function fetchData(_x) {
    return _ref.apply(this, arguments);
  };
}();

/* GET users listing. */
router.get('/', require('connect-ensure-login').ensureLoggedIn('/auth/login'), function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(req, res, next) {
    var arr, data;
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            arr = ['react', 'angular', 'vue'];

            // Correct

            if (!arr.includes('react')) {
              _context2.next = 8;
              break;
            }

            _context2.next = 4;
            return fetchData();

          case 4:
            data = _context2.sent;

            // transporter.sendMail({
            // 	from: 'ajay.more15@apu.edu.in',
            // 	to: 'ajmore.biz@gmail.com',
            // 	subject: 'Message',
            // 	text: 'I hope this message gets through!',
            // 	auth: {
            // 		user: 'ajay.more15@apu.edu.in',
            // 		refreshToken: process.env.MAIL_CLIENT_REFRESH_TOKEN
            // 	}
            // });
            res.render('home', { title: 'Express' });
            _context2.next = 9;
            break;

          case 8:
            res.send('Does not work!!');

          case 9:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x2, _x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

exports.default = router;