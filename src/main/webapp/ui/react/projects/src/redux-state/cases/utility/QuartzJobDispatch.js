import {quartzJobStore as store} from '../stores';
import * as actions from '../actions/QuartzJobActions';

export let quartzJobMapStateToProps = function (state) {
  let {onSetQuartzJobDataInGlobalState} = state;
  let {quartzJobAPIData, reloadQuartzJobDataFromAPI}
    = onSetQuartzJobDataInGlobalState;

  return {quartzJobAPIData, reloadQuartzJobDataFromAPI,
    ...onSetQuartzJobDataInGlobalState};
};


export const quartzJobDispatchMethods = function (dispatch = store.dispatch) {
  return {
    setReloadSignalInGlobalState: (shouldReload) => {
      dispatch(actions.onSetReloadSignalInGlobalState(shouldReload));
    },
    setQuartzJobApiDataInGlobalState: (quartzJobAPIData) => {
      dispatch(actions.onSetQuartzJobApiDataInGlobalState(quartzJobAPIData));
    }
  };
};
