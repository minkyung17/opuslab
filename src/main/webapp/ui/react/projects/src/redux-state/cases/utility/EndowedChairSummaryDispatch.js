import {endowedChairSummaryStore as store} from '../stores';
import * as actions from '../actions/EndowedChairActions';

export let endowedChairSummaryMapStateToProps = function (state) {
  let {onSetEndowedChairSummaryDataInGlobalState} = state;
  let {endowedChairSummaryDataFromAPI}
    = onSetEndowedChairSummaryDataInGlobalState;

  return {endowedChairSummaryDataFromAPI,
    ...onSetEndowedChairSummaryDataInGlobalState};
};


/**
*
* @desc -
* @param {Object} dispatch -
* @return {Object} - object of functions
*
**/
export const endowedChairSummaryDispatchMethods = function (dispatch = store.dispatch) {
  
  return {
    setEndowedChairDataAPIInGlobalState: (data)=>{
      dispatch(actions.onSetEndowedChairSummaryDataInGlobalState(data));
    }
  };
};
