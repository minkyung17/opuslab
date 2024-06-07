import {caseSummaryStore as store} from '../stores';
import * as actions from '../actions/CaseSummaryActions';

export let caseSummaryMapStateToProps = function (state) {
  let {onSetCaseSummaryDataInGlobalState} = state;
  let {caseSummaryDataFromAPI, caseRecommendationsAPIData}
    = onSetCaseSummaryDataInGlobalState;

  return {caseSummaryDataFromAPI, caseRecommendationsAPIData,
    ...onSetCaseSummaryDataInGlobalState};
};


/**
*
* @desc -
* @param {Object} dispatch -
* @return {Object} - object of functions
*
**/
export const caseSummaryDispatchMethods = function (dispatch = store.dispatch) {
  return {
    setCaseSummaryDataAPIInGlobalState: (data)=>{
      dispatch(actions.onSetCaseSummaryDataInGlobalState(data));
    },
    setCaseRecommendationsAPIDataInGlobalState: (data)=>{
      dispatch(actions.onSetCaseRecommendationsDataInGlobalState(data));
    }
  };
};
