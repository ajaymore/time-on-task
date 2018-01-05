'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.messageAdded = undefined;

var _socket = require('../socket');

var _graphqlSubscriptions = require('graphql-subscriptions');

var MESSAGE_ADDED_TOPIC = 'messageAdded';

var messageAdded = exports.messageAdded = {
  resolve: function resolve(payload) {
    console.log('payload======', payload);
    return {
      id: 1
    };
  },
  subscribe: function subscribe() {
    return _socket.pubsub.asyncIterator(MESSAGE_ADDED_TOPIC);
  }
};