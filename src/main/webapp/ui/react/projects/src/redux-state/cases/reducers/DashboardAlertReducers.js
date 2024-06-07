import {combineReducers} from 'redux';

export let initialStateDashboardAlert = {
  reloadDashboardAlertDataFromAPI: false
};

export function onSetDashboardAlertDataInGlobalState(state = initialStateDashboardAlert, action) {
  switch (action.type) {
  case 'RELOAD_API_DATA':
    return {
      ...state,
      reloadDashboardAlertDataFromAPI: action.reloadDashboardAlertDataFromAPI
    };
  default:
    return state;
  }
}

export const dashboardAlertReducer = combineReducers({
  onSetDashboardAlertDataInGlobalState
});
