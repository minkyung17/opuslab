import {permissionsByUserStore as store} from '../stores';
import * as actions from '../actions/PermissionsActions';

export let permissionsByUserMapStateToProps = function (state) {
  let {onSetPermissionsDataInGlobalState} = state;
  let {permissionsByUserAPIData, reloadPermissionsDataFromAPI}
    = onSetPermissionsDataInGlobalState;

  return {permissionsByUserAPIData, reloadPermissionsDataFromAPI,
    ...onSetPermissionsDataInGlobalState};
};


export const permissionsByUserDispatchMethods = function (dispatch = store.dispatch) {
  return {
    setReloadSignalInGlobalState: (shouldReload) => {
      dispatch(actions.onSetReloadSignalInGlobalState(shouldReload));
    },
    setUserPermissionsApiDataInGlobalState: (permissionsByUserAPIData) => {
      dispatch(actions.onSetUserPermissionsApiDataInGlobalState(permissionsByUserAPIData));
    }
  };
};
