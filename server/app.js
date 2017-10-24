import './config/env';
import express from 'express';
import { graphiqlExpress, graphqlExpress } from 'apollo-server-express';
import bodyParser from 'body-parser';
import { createServer } from 'http';
import { SubscriptionServer } from 'subscriptions-transport-ws';
import { execute, subscribe } from 'graphql';
import expressJwt from 'express-jwt';
import jsonwebtoken from 'jsonwebtoken';
import favicon from 'serve-favicon';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { makeExecutableSchema } from 'graphql-tools';
import passport from 'passport';
import path from 'path';
import mongoose from 'mongoose';
import flash from 'connect-flash';
import { getSubscriptionDetails } from './socket';
import auth from './routes/auth';
import mailer from './routes/mailer';
import typeDefs from './schema';
import resolvers from './resolvers';
import assign from 'lodash/assign';

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

if (process.env.ENVIRONMENT === 'development') {
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true
    })
  );
}

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  require('express-session')({
    secret: 'keyboard cat is such a regular secret',
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(flash());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

require('./config/passport');
app.use('/mailer', mailer);
app.use('/auth', auth);
app.use('/', require('./routes/home'));

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_CONNECTION_URL, { useMongoClient: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', function() {
  console.log('mongo connected!!');
  if (process.env.ENVIRONMENT === 'development') {
    // dbseed();
  }
});

// graphql

const executableSchema = makeExecutableSchema({
  typeDefs,
  resolvers
});

const GRAPHQL_PORT = 8000;
const GRAPHQL_PATH = '/graphql';
const SUBSCRIPTIONS_PATH = '/subscriptions';

app.use(
  '/graphql',
  bodyParser.json(),
  expressJwt({
    secret: process.env.JWT_AUTH_SECRET,
    credentialsRequired: false
  }),
  graphqlExpress(req => ({
    schema: executableSchema,
    context: {
      user: req.user,
      fromMongo: item => {
        return assign(item, { id: item._id.toString() });
      },
      toMongo: item => {
        return assign(item, {
          _id: ObjectID(item.id)
        });
      }
    }
  }))
);

app.use(
  '/graphiql',
  graphiqlExpress({
    endpointURL: GRAPHQL_PATH,
    subscriptionsEndpoint: `ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`
  })
);
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use((err, req, res, next) => {
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

const debug = require('debug')('merida:server');
var port = normalizePort(process.env.PORT || GRAPHQL_PORT);

app.set('port', port);
const graphQLServer = createServer(app);

graphQLServer.listen(port, () => {
  new SubscriptionServer(
    {
      execute,
      subscribe,
      schema: executableSchema
    },
    {
      server: graphQLServer,
      path: SUBSCRIPTIONS_PATH
    }
  );
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
  debug(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}${GRAPHQL_PATH}`
  );
  debug(
    `GraphQL Subscriptions are now running on ws://localhost:${GRAPHQL_PORT}${SUBSCRIPTIONS_PATH}`
  );
}
