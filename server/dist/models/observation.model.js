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

var _classroom = require('./classroom.model');

var _classroom2 = _interopRequireDefault(_classroom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ObservationSchema = new _mongoose2.default.Schema({
  readings: { type: String, required: true },
  endtime: { type: Date, required: true },
  starttime: { type: Date, required: true },
  createdAt: { type: Date, default: (0, _moment2.default)().valueOf() },
  updatedAt: { type: Date, default: (0, _moment2.default)().valueOf() },
  classroom: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'Classroom',
    required: true
  },
  createdBy: {
    type: _mongoose2.default.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
});

ObservationSchema.post('remove', function () {
  var _ref = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee(doc, next) {
    return _regenerator2.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _classroom2.default.findByIdAndUpdate(doc.classroom, {
              $pullAll: {
                observations: [doc._id]
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

ObservationSchema.post('save', function () {
  var _ref2 = (0, _asyncToGenerator3.default)( /*#__PURE__*/_regenerator2.default.mark(function _callee2(doc, next) {
    return _regenerator2.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _classroom2.default.findByIdAndUpdate(doc.classroom, {
              $addToSet: {
                observations: doc._id
              }
            }, {
              safe: true,
              upsert: true,
              new: true
            });

          case 2:

            next(null, doc);

          case 3:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}());

exports.default = _mongoose2.default.model('Observation', ObservationSchema);