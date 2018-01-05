'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var GroupSchema = new _mongoose2.default.Schema({
  groupName: { type: String, required: true },
  createdAt: { type: Date, default: (0, _moment2.default)().valueOf() },
  updatedAt: { type: Date, default: (0, _moment2.default)().valueOf() },
  users: [{ type: _mongoose2.default.Schema.Types.ObjectId, ref: 'User' }]
});

exports.default = _mongoose2.default.model('Group', GroupSchema);