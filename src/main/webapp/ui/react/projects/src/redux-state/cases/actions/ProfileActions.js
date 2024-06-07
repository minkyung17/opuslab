
export const RELOAD_API_DATA = 'RELOAD_API_DATA';
export function onSetReloadSignalInGlobalState(reloadProfileDataFromAPI) {
  return {
    type: RELOAD_API_DATA,
    reloadProfileDataFromAPI
  };
}

export const SET_PROFILE_API_DATA = 'SET_PROFILE_API_DATA';
export function onSetPersonProfileApiDataInGlobalState(profileAPIData) {
  return {
    type: SET_PROFILE_API_DATA,
    profileAPIData
  };
}

export const SET_PATH_JOB_API_DATA = 'SET_PATH_JOB_API_DATA';
export function onSetPersonPathJobApiDataInGlobalState(pathJobAPIData) {
  return {
    type: SET_PATH_JOB_API_DATA,
    pathJobAPIData
  };
}

export const SET_DELETE_APPOINTMENT_PROMISE = 'SET_DELETE_APPOINTMENT_PROMISE';
export function onSetDeleteAppointmentPromiseInGlobalState(deleteAppointmentPromise) {
  return {
    type: SET_DELETE_APPOINTMENT_PROMISE,
    deleteAppointmentPromise
  };
}
