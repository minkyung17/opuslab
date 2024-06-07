import {combineReducers} from 'redux';

export let initialStateProfile = {
  reloadProfileDataFromAPI: false
};

export function onSetProfileDataInGlobalState(state = initialStateProfile, action) {
  switch (action.type) {
  case 'SET_DELETE_APPOINTMENT_PROMISE':
    return {
      ...state,
      deleteAppointmentPromise: action.deleteAppointmentPromise
    };
  case 'RELOAD_API_DATA':
    return {
      ...state,
      reloadProfileDataFromAPI: action.reloadProfileDataFromAPI
    };
  case 'SET_PROFILE_API_DATA':
    return {
      ...state,
      profileAPIData: action.profileAPIData
    };
  case 'SET_PATH_JOB_API_DATA':
    return {
      ...state,
      pathJobAPIData: action.pathJobAPIData
    };
  default:
    return state;
  }
}

export const profileReducer = combineReducers({
  onSetProfileDataInGlobalState
});
