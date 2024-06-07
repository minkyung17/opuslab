import {dashboardAlertStore as store} from '../stores';
import * as actions from '../actions/DashboardAlertActions';

export let dashboardAlertMapStateToProps = function (state) {
  let {onSetDashboardAlertDataInGlobalState} = state;
  let {dashboardAlertAPIData, reloadDashboardAlertDataFromAPI}
    = onSetDashboardAlertDataInGlobalState;

  return {dashboardAlertAPIData, reloadDashboardAlertDataFromAPI,
    ...onSetDashboardAlertDataInGlobalState};
};


export const dashboardAlertDispatchMethods = function (dispatch = store.dispatch) {
  return {
    setReloadSignalInGlobalState: (shouldReload) => {
      dispatch(actions.onSetReloadSignalInGlobalState(shouldReload));
    },
    setDashboardAlertApiDataInGlobalState: (dashboardAlertAPIData) => {
      dispatch(actions.onSetDashboardAlertApiDataInGlobalState(dashboardAlertAPIData));
    }
  };
};
