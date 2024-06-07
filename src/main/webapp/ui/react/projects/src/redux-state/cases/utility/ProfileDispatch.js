import {profileStore as store} from '../stores';
import * as actions from '../actions/ProfileActions';

export let profileMapStateToProps = function (state) {
  let {onSetProfileDataInGlobalState} = state;
  let {profileAPIData, pathJobAPIData, reloadProfileDataFromAPI}
    = onSetProfileDataInGlobalState;

  return {profileAPIData, pathJobAPIData, reloadProfileDataFromAPI,
    ...onSetProfileDataInGlobalState};
};


export const profileDispatchMethods = function (dispatch = store.dispatch) {
  return {
    setReloadSignalInGlobalState: (shouldReload) => {
      dispatch(actions.onSetReloadSignalInGlobalState(shouldReload));
    },
    setPersonProfileApiDataInGlobalState: (profileApptData) => {
      dispatch(actions.onSetPersonProfileApiDataInGlobalState(profileApptData));
    },
    setPersonPathJobApiDataInGlobalState: (pathJobAPIData) => {
      dispatch(actions.onSetPersonPathJobApiDataInGlobalState(pathJobAPIData));
    },
    setDeleteAppointmentPromiseInGlobalState: (deletePromise) => {
      dispatch(actions.onSetDeleteAppointmentPromiseInGlobalState(deletePromise));
    }
  };
};
