'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var fs = require('fs');
var path = require('path');

var mutations = fs.readFileSync(path.join(__dirname, 'mutations.graphql'), 'utf8');
var queries = fs.readFileSync(path.join(__dirname, 'queries.graphql'), 'utf8');
var types = fs.readFileSync(path.join(__dirname, 'types.graphql'), 'utf8');
var subscriptions = fs.readFileSync(path.join(__dirname, 'subscriptions.graphql'), 'utf8');
var inputs = fs.readFileSync(path.join(__dirname, 'inputs.graphql'), 'utf8');

exports.default = [types, inputs, queries, mutations, subscriptions];