import {
  LOGIN_COMPLETE,
  LOGIN_IN_PROGRESS,
  LOGGED_OUT,
  LOGOUT_IN_PROGRESS,
  TOKEN_REFRESHED,
  INITIALIZE
} from '../ActionTypes';
import moment from 'moment';

export default (
  state = {
    accessToken: null,
    refreshToken: null,
    status: INITIALIZE,
    tokenRefreshed: null
  },
  action
) => {
  switch (action.type) {
    case LOGIN_IN_PROGRESS:
      return { ...state, status: LOGIN_IN_PROGRESS };
    case LOGIN_COMPLETE:
      return {
        ...state,
        status: LOGIN_COMPLETE,
        accessToken: action.payload.accessToken,
        refreshToken: action.payload.refreshToken,
        tokenRefreshed: moment().valueOf()
      };
    case LOGOUT_IN_PROGRESS: {
      return {
        ...state,
        status: LOGOUT_IN_PROGRESS
      };
    }
    case TOKEN_REFRESHED: {
      return {
        ...state,
        accessToken: action.payload.accessToken,
        tokenRefreshed: action.payload.tokenRefreshed
      };
    }
    case LOGGED_OUT:
      return {
        accessToken: null,
        refreshToken: null,
        tokenRefreshed: null,
        status: LOGGED_OUT
      };
    default:
      return state;
  }
};
