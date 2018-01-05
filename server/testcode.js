var fs = require('fs');
var path = require('path');
var { makeExecutableSchema } = require('graphql-tools');
var typeDefs = require('./schema');
console.log(makeExecutableSchema({ typeDefs }));
