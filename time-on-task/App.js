import 'rxjs';
import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';
import {
  ApolloClient,
  createNetworkInterface,
  ApolloProvider
} from 'react-apollo';
import moment from 'moment';
import extend from 'lodash/extend';
import configureStore from './app/configureStore';
import { tokenRefreshed, loggingOut } from './app/actions';
import Root from './app/components/Root';
import { INITIALIZE } from './app/ActionTypes';
export const BASE_URL = 'http://192.168.1.20:8000/';

const networkInterface = createNetworkInterface({
  uri: `${BASE_URL}graphql`
});

const client = new ApolloClient({
  networkInterface: networkInterface
});
const store = configureStore(client);

networkInterface.use([
  {
    applyMiddleware(req, next) {
      let auth = store.getState().auth;
      if (auth.status === 'LOGGED_OUT') return;
      var duration = moment.duration(
        moment().diff(moment(auth.tokenRefreshed))
      );
      if (duration.asHours() >= 2) {
        fetch(`${BASE_URL}auth/renew-token`, {
          method: 'POST',
          body: JSON.stringify({ refreshToken: auth.refreshToken }),
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${auth.accessToken}`
          }
        })
          .then(res => res.json())
          .then(data => {
            store.dispatch(
              tokenRefreshed(data.accessToken, moment().valueOf())
            );
          })
          .catch(err => console.log(err));
      } else {
        req.options.headers = extend(req.options.headers, {
          authorization: `Bearer ${auth.accessToken}`
        });
      }
      next();
    }
  }
]);

networkInterface.useAfter([
  {
    applyAfterware({ response }, next) {
      if (response.status === 401) {
        store.dispatch(loggingOut());
      }
      next();
    }
  }
]);

export default class App extends Component {
  render() {
    return (
      <ApolloProvider store={store} client={client}>
        <Root />
      </ApolloProvider>
    );
  }
}
