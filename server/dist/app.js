'use strict';

require('./config/env');

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _apolloServerExpress = require('apollo-server-express');

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _http = require('http');

var _subscriptionsTransportWs = require('subscriptions-transport-ws');

var _graphql = require('graphql');

var _expressJwt = require('express-jwt');

var _expressJwt2 = _interopRequireDefault(_expressJwt);

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _serveFavicon = require('serve-favicon');

var _serveFavicon2 = _interopRequireDefault(_serveFavicon);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _cookieParser = require('cookie-parser');

var _cookieParser2 = _interopRequireDefault(_cookieParser);

var _cors = require('cors');

var _cors2 = _interopRequireDefault(_cors);

var _graphqlTools = require('graphql-tools');

var _passport = require('passport');

var _passport2 = _interopRequireDefault(_passport);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _connectFlash = require('connect-flash');

var _connectFlash2 = _interopRequireDefault(_connectFlash);

var _socket = require('./socket');

var _auth = require('./routes/auth.route');

var _auth2 = _interopRequireDefault(_auth);

var _mailer = require('./routes/mailer.route');

var _mailer2 = _interopRequireDefault(_mailer);

var _schema = require('./schema');

var _schema2 = _interopRequireDefault(_schema);

var _resolvers = require('./resolvers');

var _resolvers2 = _interopRequireDefault(_resolvers);

var _assign = require('lodash/assign');

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var app = (0, _express2.default)();

// view engine setup
app.set('views', _path2.default.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (process.env.ENVIRONMENT === 'development') {
  app.use((0, _cors2.default)({
    origin: 'http://localhost:3000',
    credentials: true
  }));
}

app.use((0, _serveFavicon2.default)(_path2.default.join(__dirname, 'public', 'favicon.ico')));
app.use((0, _morgan2.default)('dev'));
app.use(_bodyParser2.default.json());
app.use(_bodyParser2.default.urlencoded({ extended: false }));
app.use((0, _cookieParser2.default)());
app.use(require('express-session')({
  secret: 'keyboard cat is such a regular secret',
  resave: false,
  saveUninitialized: false
}));
app.use(_passport2.default.initialize());
app.use((0, _connectFlash2.default)());
app.use(_passport2.default.session());
app.use(_express2.default.static(_path2.default.join(__dirname, 'public')));

require('./config/passport');
app.use('/mailer', _mailer2.default);
app.use('/auth', _auth2.default);
app.use('/', require('./routes/home.route'));

_mongoose2.default.Promise = global.Promise;
_mongoose2.default.connect(process.env.MONGO_CONNECTION_URL, { useMongoClient: true });
var db = _mongoose2.default.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function () {
  console.log('mongo connected!!');
  if (process.env.ENVIRONMENT === 'development') {
    // dbseed();
  }
});

// graphql

var executableSchema = (0, _graphqlTools.makeExecutableSchema)({
  typeDefs: _schema2.default,
  resolvers: _resolvers2.default
});

var GRAPHQL_PORT = 8000;
var GRAPHQL_PATH = '/graphql';
var SUBSCRIPTIONS_PATH = '/subscriptions';

app.use('/graphql', _bodyParser2.default.json(), (0, _expressJwt2.default)({
  secret: process.env.JWT_AUTH_SECRET,
  credentialsRequired: false
}), (0, _apolloServerExpress.graphqlExpress)(function (req) {
  return {
    schema: executableSchema,
    context: {
      user: req.user,
      fromMongo: function fromMongo(item) {
        return (0, _assign2.default)(item, { id: item._id.toString() });
      },
      toMongo: function toMongo(item) {
        return (0, _assign2.default)(item, {
          _id: ObjectID(item.id)
        });
      }
    }
  };
}));

app.use('/graphiql', (0, _apolloServerExpress.graphiqlExpress)({
  endpointURL: GRAPHQL_PATH,
  subscriptionsEndpoint: 'ws://localhost:' + GRAPHQL_PORT + SUBSCRIPTIONS_PATH
}));
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({
    status: err.status,
    message: err.message
  });
});

var debug = require('debug')('merida:server');
var port = normalizePort(process.env.PORT || GRAPHQL_PORT);

app.set('port', port);
var graphQLServer = (0, _http.createServer)(app);

graphQLServer.listen(port, function () {
  new _subscriptionsTransportWs.SubscriptionServer({
    execute: _graphql.execute,
    subscribe: _graphql.subscribe,
    schema: executableSchema
  }, {
    server: graphQLServer,
    path: SUBSCRIPTIONS_PATH
  });
});
graphQLServer.on('error', onError);
graphQLServer.on('listening', onListening);

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

function onListening() {
  var addr = graphQLServer.address();
  var bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
  debug('GraphQL Server is now running on http://localhost:' + GRAPHQL_PORT + GRAPHQL_PATH);
  debug('GraphQL Subscriptions are now running on ws://localhost:' + GRAPHQL_PORT + SUBSCRIPTIONS_PATH);
}