import * as typeResolvers from './types';
import * as queryResolvlers from './queries';
import * as mutationResolvers from './mutations';
import * as subscriptionResolvers from './subscriptions';
import { GraphQLError } from 'graphql';
import moment from 'moment';

export const AuthenticationRequiredError = new GraphQLError({
  name: 'AuthenticationRequiredError',
  text: 'You must be logged in to do this'
});

const DateTime = {
  parseValue(value) {
    return value;
  },
  serialize(value) {
    return value;
  },
  parseLiteral(ast) {
    return null;
  }
};

export default {
  DateTime,
  Query: {
    ...queryResolvlers
  },
  Mutation: {
    ...mutationResolvers
  },
  Subscription: {
    ...subscriptionResolvers
  },
  ...typeResolvers
};
