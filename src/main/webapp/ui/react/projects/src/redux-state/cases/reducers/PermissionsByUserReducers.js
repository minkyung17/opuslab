import {combineReducers} from 'redux';

export let initialStatePermissionsByUser = {
  reloadPermissionsDataFromAPI: false
};

export function onSetPermissionsDataInGlobalState(state = initialStatePermissionsByUser, action) {
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

export const permissionsByUserReducer = combineReducers({
  onSetPermissionsDataInGlobalState
});
