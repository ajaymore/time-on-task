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

export const searchUser = search => {
  return {
    type: ActionTypes.SEARCH_USER,
    payload: {
      search
    }
  };
};

export const searchUserSuccess = results => {
  return {
    type: ActionTypes.SEARCH_USER_SUCCESS,
    payload: results
  };
};

export const newEntry = (uuid, classId) => {
  return {
    type: ActionTypes.NEW_ENTRY,
    payload: {
      uuid,
      classId
    }
  };
};

export const addUnitObservation = (uuid, newUnitObservation) => {
  return {
    type: ActionTypes.ADD_UNIT_OBSERVATION,
    payload: {
      uuid,
      newUnitObservation
    }
  };
};

export const observationSynced = uuid => {
  return {
    type: ActionTypes.OBSERVATION_SYNCED,
    payload: uuid
  };
};
