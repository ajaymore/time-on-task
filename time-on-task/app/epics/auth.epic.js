import * as ActionTypes from '../ActionTypes';
import { loginSuccess, loggedOutUser } from '../actions';
import { BASE_URL } from '../../App';

export const userLogin = action$ => {
  return action$
    .ofType(ActionTypes.LOGIN_IN_PROGRESS)
    .map(action => action.payload.accessToken)
    .debounceTime(1000)
    .mergeMap(accessToken => {
      return fetch(`${BASE_URL}auth/device-login`, {
        method: 'POST',
        body: JSON.stringify({ accessToken }),
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      })
        .then(res => res.json())
        .then(data => data.user)
        .catch(err => console.log(err));
    })
    .map(user => {
      if (!user) {
        return loggedOutUser();
      }
      return loginSuccess(user.accessToken, user.refreshToken);
    });
};

export const userLogout = action$ => {
  return action$
    .ofType(ActionTypes.LOGOUT_IN_PROGRESS)
    .map(async action => {
      return {
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken
      };
    })
    .mergeMap(({ accessToken, refreshToken }) => {
      return fetch(`${BASE_URL}/auth/device-logout`, {
        method: 'POST',
        body: JSON.stringify({ refreshToken, accessToken }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => {
          return data;
        })
        .catch(err => {
          console.log(err);
          loggedOutUser();
        });
    })
    .map(loggedOutUser);
};
