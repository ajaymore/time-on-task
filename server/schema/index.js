var fs = require('fs');
var path = require('path');

const mutations = fs.readFileSync(
  path.join(__dirname, 'mutations.graphql'),
  'utf8'
);
const queries = fs.readFileSync(
  path.join(__dirname, 'queries.graphql'),
  'utf8'
);
const types = fs.readFileSync(path.join(__dirname, 'types.graphql'), 'utf8');
const subscriptions = fs.readFileSync(
  path.join(__dirname, 'subscriptions.graphql'),
  'utf8'
);
const inputs = fs.readFileSync(path.join(__dirname, 'inputs.graphql'), 'utf8');

export default [types, inputs, queries, mutations, subscriptions];
