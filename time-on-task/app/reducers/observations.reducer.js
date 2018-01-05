import {
  NEW_ENTRY,
  ADD_UNIT_OBSERVATION,
  OBSERVATION_SYNCED
} from '../ActionTypes';
import moment from 'moment';

export default (state = [], action) => {
  switch (action.type) {
    case NEW_ENTRY: {
      return [
        ...state,
        {
          uuid: action.payload.uuid,
          readings: [],
          classId: action.payload.classId,
          starttime: moment().valueOf()
        }
      ];
    }
    case ADD_UNIT_OBSERVATION: {
      return state.map(item => {
        if (action.payload.uuid === item.uuid) {
          return {
            ...item,
            readings: [...item.readings, action.payload.newUnitObservation],
            endtime: moment().valueOf()
          };
        }
        return item;
      });
    }
    case OBSERVATION_SYNCED: {
      return state.filter(item => item.uuid !== action.payload);
    }
    default:
      return state;
  }
};
