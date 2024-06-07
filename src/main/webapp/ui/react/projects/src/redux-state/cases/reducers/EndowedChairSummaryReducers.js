import {combineReducers} from 'redux';

export let initialStateEndowedChairSummary = {
  endowedChairSummaryDataFromAPI: null
};

export function onSetEndowedChairSummaryDataInGlobalState(state = initialStateEndowedChairSummary,
  action) {
  switch (action.type) {
  case 'ENDOWED_CHAIR_SUMMARY_API_DATA':
    return {
      ...state,
      endowedChairSummaryDataFromAPI: action.data
    };
  default:
    return state;
  }
}

export const endowedChairSummaryReducer = combineReducers({
  onSetEndowedChairSummaryDataInGlobalState
});
