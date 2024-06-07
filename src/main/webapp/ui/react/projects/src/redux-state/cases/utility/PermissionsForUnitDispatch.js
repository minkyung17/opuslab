import {permissionsByUnitStore as store} from '../stores';
import * as actions from '../actions/PermissionsUnitActions';

export let permissionsByUnitMapStateToProps = function (state) {
  let {onSetPermissionsDataInGlobalState} = state;
  let {permissionsByUnitAPIData, reloadPermissionsDataFromAPI}
    = onSetPermissionsDataInGlobalState;

  return {permissionsByUnitAPIData, reloadPermissionsDataFromAPI,
    ...onSetPermissionsDataInGlobalState};
};


export const permissionsByUnitDispatchMethods = function (dispatch = store.dispatch) {
  return {
    setReloadSignalInGlobalState: (shouldReload) => {
      dispatch(actions.onSetReloadSignalInGlobalState(shouldReload));
    },
    setUnitPermissionsApiDataInGlobalState: (permissionsByUnitAPIData) => {
      dispatch(actions.onSetUnitPermissionsApiDataInGlobalState(permissionsByUnitAPIData));
    }
  };
};
