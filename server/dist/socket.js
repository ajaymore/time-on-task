'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pubsub = undefined;
exports.getSubscriptionDetails = getSubscriptionDetails;

var _graphqlSubscriptions = require('graphql-subscriptions');

var _graphql = require('graphql');

var _values = require('graphql/execution/values');

function getSubscriptionDetails(_ref) {
  var baseParams = _ref.baseParams,
      schema = _ref.schema;

  var parsedQuery = (0, _graphql.parse)(baseParams.query);
  var args = {};
  // operationName is the name of the only root field in the
  // subscription document
  var subscriptionName = '';
  parsedQuery.definitions.forEach(function (definition) {
    if (definition.kind === 'OperationDefinition') {
      // only one root field is allowed on subscription.
      // No fragments for now.
      var rootField = definition.selectionSet.selections[0];
      subscriptionName = rootField.name.value;
      var fields = schema.getSubscriptionType().getFields();
      args = (0, _values.getArgumentValues)(fields[subscriptionName], rootField, baseParams.variables);
    }
  });

  return { args: args, subscriptionName: subscriptionName };
}

var pubsub = exports.pubsub = new _graphqlSubscriptions.PubSub();