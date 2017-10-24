import { pubsub } from '../socket';
import { withFilter } from 'graphql-subscriptions';
const MESSAGE_ADDED_TOPIC = 'messageAdded';

export const messageAdded = {
  resolve: payload => {
    console.log('payload======', payload);
    return {
      id: 1
    };
  },
  subscribe: () => pubsub.asyncIterator(MESSAGE_ADDED_TOPIC)
};
