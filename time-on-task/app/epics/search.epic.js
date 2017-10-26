import * as ActionTypes from '../ActionTypes';
import { searchUserSuccess } from '../actions';
import { BASE_URL } from '../../App';

export const searchUser = (action$, store) => {
  return action$
    .ofType(ActionTypes.SEARCH_USER)
    .map(action => action.payload.search)
    .debounceTime(200)
    .switchMap(search => {
      return fetch(`${BASE_URL}search-user`, {
        method: 'POST',
        body: JSON.stringify({ search }),
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${store.getState().auth.accessToken}`
        }
      })
        .then(res => res.json())
        .then(data => data)
        .catch(err => console.log(err));
    })
    .map(result => {
      console.log(result);
      if (result && result.length) {
        return searchUserSuccess(result);
      } else {
        return searchUserSuccess([]);
      }
    });
};
