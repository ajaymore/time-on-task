import { combineEpics } from 'redux-observable';
import { userLogin, userLogout } from './auth.epic';
import { searchUser } from './search.epic';

export default combineEpics(userLogin, userLogout, searchUser);
