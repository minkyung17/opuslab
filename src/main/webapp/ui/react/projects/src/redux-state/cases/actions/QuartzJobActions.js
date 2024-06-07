
export const RELOAD_API_DATA = 'RELOAD_API_DATA';
export function onSetReloadSignalInGlobalState(reloadQuartzJobDataFromAPI) {
  return {
    type: RELOAD_API_DATA,
    reloadQuartzJobDataFromAPI
  };
}

export const SET_QuartzJob_API_DATA = 'SET_QuartzJob_API_DATA';
export function onSetQuartzJobApiDataInGlobalState(quartzJobAPIData) {
  return {
    type: SET_QuartzJob_API_DATA,
    quartzJobAPIData
  };
}
