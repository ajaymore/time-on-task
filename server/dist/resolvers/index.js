'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AuthenticationRequiredError = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _types = require('./types');

var typeResolvers = _interopRequireWildcard(_types);

var _queries = require('./queries');

var queryResolvlers = _interopRequireWildcard(_queries);

var _mutations = require('./mutations');

var mutationResolvers = _interopRequireWildcard(_mutations);

var _subscriptions = require('./subscriptions');

var subscriptionResolvers = _interopRequireWildcard(_subscriptions);

var _graphql = require('graphql');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var AuthenticationRequiredError = exports.AuthenticationRequiredError = new _graphql.GraphQLError({
  name: 'AuthenticationRequiredError',
  text: 'You must be logged in to do this'
});

var DateTime = {
  parseValue: function parseValue(value) {
    return value;
  },
  serialize: function serialize(value) {
    return value;
  },
  parseLiteral: function parseLiteral(ast) {
    return null;
  }
};

exports.default = (0, _extends3.default)({
  DateTime: DateTime,
  Query: (0, _extends3.default)({}, queryResolvlers),
  Mutation: (0, _extends3.default)({}, mutationResolvers),
  Subscription: (0, _extends3.default)({}, subscriptionResolvers)
}, typeResolvers);