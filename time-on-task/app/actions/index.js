import * as ActionTypes from '../ActionTypes';

export const loginUser = accessToken => {
  return {
    type: ActionTypes.LOGIN_IN_PROGRESS,
    payload: {
      accessToken
    }
  };
};

export const loginSuccess = (accessToken, refreshToken) => {
  return {
    type: ActionTypes.LOGIN_COMPLETE,
    payload: {
      accessToken,
      refreshToken
    }
  };
};

export const loggingOut = (accessToken, refreshToken) => {
  console.log(accessToken, refreshToken);
  return {
    type: ActionTypes.LOGOUT_IN_PROGRESS,
    payload: {
      refreshToken,
      accessToken
    }
  };
};

export const loggedOutUser = () => {
  return {
    type: ActionTypes.LOGGED_OUT,
    payload: {}
  };
};

export const tokenRefreshed = (accessToken, tokenRefreshed) => {
  return {
    type: ActionTypes.TOKEN_REFRESHED,
    payload: {
      accessToken,
      tokenRefreshed
    }
  };
};
