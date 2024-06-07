
export const RELOAD_API_DATA = 'RELOAD_API_DATA';
export function onSetReloadSignalInGlobalState(reloadPermissionsDataFromAPI) {
  return {
    type: RELOAD_API_DATA,
    reloadPermissionsDataFromAPI
  };
}

export const SET_PermissionsByUser_API_DATA = 'SET_PermissionsByUser_API_DATA';
export function onSetUserPermissionsApiDataInGlobalState(permissionsByUserAPIData) {
  return {
    type: SET_PermissionsByUser_API_DATA,
    permissionsByUserAPIData
  };
}
