import { combineEpics } from 'redux-observable';
import { userLogin, userLogout } from './auth.epic';

export default combineEpics(userLogin, userLogout);
