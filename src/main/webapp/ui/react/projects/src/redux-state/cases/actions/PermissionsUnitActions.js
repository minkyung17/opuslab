
export const RELOAD_API_DATA = 'RELOAD_API_DATA';
export function onSetReloadSignalInGlobalState(reloadPermissionsDataFromAPI) {
  return {
    type: RELOAD_API_DATA,
    reloadPermissionsDataFromAPI
  };
}

export const SET_PermissionsByUnit_API_DATA = 'SET_PermissionsByUnit_API_DATA';
export function onSetUnitPermissionsApiDataInGlobalState(permissionsByUnitAPIData) {
  return {
    type: SET_PermissionsByUnit_API_DATA,
    permissionsByUnitAPIData
  };
}
