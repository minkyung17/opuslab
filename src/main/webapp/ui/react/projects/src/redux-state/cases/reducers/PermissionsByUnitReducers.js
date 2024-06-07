import {combineReducers} from 'redux';

export let initialStatePermissionsByUnit = {
  reloadPermissionsDataFromAPI: false
};

export function onSetPermissionsDataInGlobalState(state = initialStatePermissionsByUnit, action) {
  switch (action.type) {
  case 'RELOAD_API_DATA':
    return {
      ...state,
      reloadPermissionsDataFromAPI: action.reloadPermissionsDataFromAPI
    };
  default:
    return state;
  }
}

export const permissionsByUnitReducer = combineReducers({
  onSetPermissionsDataInGlobalState
});
