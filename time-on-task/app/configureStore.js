import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { createLogger } from 'redux-logger';
import { createEpicMiddleware } from 'redux-observable';
import { persistStore, autoRehydrate } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import rootReducer from './reducers';
import rootEpic from './epics';
import { INITIALIZE, LOGGED_OUT, LOGIN_COMPLETE } from './ActionTypes';

const epicMiddleware = createEpicMiddleware(rootEpic);

const loggerMiddleware = createLogger({
  predicate: (getState, action) => __DEV__
});

export default function configureStore(client) {
  const store = createStore(
    combineReducers({ ...rootReducer, apollo: client.reducer() }),
    undefined,
    compose(
      applyMiddleware(client.middleware(), epicMiddleware, loggerMiddleware),
      autoRehydrate()
    )
  );
  persistStore(store, { storage: AsyncStorage }, () => {
    console.log(store.getState().auth.status);
    if (store.getState().auth.status !== LOGIN_COMPLETE) {
      store.dispatch({
        type: LOGGED_OUT,
        payload: {}
      });
    }
  });

  return store;
}
