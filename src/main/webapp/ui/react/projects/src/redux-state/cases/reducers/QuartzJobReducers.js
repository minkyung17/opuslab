import {combineReducers} from 'redux';

export let initialStateQuartzJob = {
  reloadQuartzJobDataFromAPI: false
};

export function onSetQuartzJobDataInGlobalState(state = initialStateQuartzJob, action) {
  switch (action.type) {
  case 'RELOAD_API_DATA':
    return {
      ...state,
      reloadQuartzJobDataFromAPI: action.reloadQuartzJobDataFromAPI
    };
  default:
    return state;
  }
}

export const quartzJobReducer = combineReducers({
  onSetQuartzJobDataInGlobalState
});
