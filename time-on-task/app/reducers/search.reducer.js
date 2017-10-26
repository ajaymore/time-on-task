import { SEARCH_USER, SEARCH_USER_SUCCESS } from '../ActionTypes';

export default (state = [], action) => {
  switch (action.type) {
    case SEARCH_USER: {
      return state;
    }
    case SEARCH_USER_SUCCESS: {
      return action.payload;
    }
    default: {
      return state;
    }
  }
};
