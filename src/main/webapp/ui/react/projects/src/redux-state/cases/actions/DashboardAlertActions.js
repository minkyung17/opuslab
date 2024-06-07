
export const RELOAD_API_DATA = 'RELOAD_API_DATA';
export function onSetReloadSignalInGlobalState(reloadDashboardAlertDataFromAPI) {
  return {
    type: RELOAD_API_DATA,
    reloadDashboardAlertDataFromAPI
  };
}

export const SET_DashboardAlert_API_DATA = 'SET_DashboardAlert_API_DATA';
export function onSetDashboardAlertApiDataInGlobalState(dashboardAlertAPIData) {
  return {
    type: SET_DashboardAlert_API_DATA,
    dashboardAlertAPIData
  };
}
