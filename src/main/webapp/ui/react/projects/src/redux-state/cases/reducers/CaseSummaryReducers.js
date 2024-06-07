import {combineReducers} from 'redux';

export let initialStateCaseSummary = {
  caseSummaryDataFromAPI: null
};

export function onSetCaseSummaryDataInGlobalState(state = initialStateCaseSummary,
  action) {
  switch (action.type) {
  case 'CASE_SUMMARY_API_DATA':
    return {
      ...state,
      caseSummaryDataFromAPI: action.data
    };
  case 'CASE_RECOMMENDATIONS_API_DATA':
    return {
      ...state,
      caseRecommendationsAPIData: action.data
    };
  default:
    return state;
  }
}

export const caseSummaryReducer = combineReducers({
  onSetCaseSummaryDataInGlobalState
});
