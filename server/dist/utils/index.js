'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.toMongo = exports.fromMongo = undefined;

var _lodash = require('lodash');

var fromMongo = exports.fromMongo = function fromMongo(item) {
	return (0, _lodash.assign)(item, { id: item._id.toString() });
};

var toMongo = exports.toMongo = function toMongo(item) {
	return (0, _lodash.assign)(item, {
		_id: ObjectID(item.id)
	});
};