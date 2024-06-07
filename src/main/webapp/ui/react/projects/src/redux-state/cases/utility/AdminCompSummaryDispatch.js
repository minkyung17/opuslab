import {adminCompSummaryStore as store} from '../stores';
import * as actions from '../actions/AdminCompActions';

export let adminCompSummaryMapStateToProps = function (state) {
  let {onSetAdminCompSummaryDataInGlobalState} = state;
  let {adminCompSummaryDataFromAPI}
    = onSetAdminCompSummaryDataInGlobalState;

  return {adminCompSummaryDataFromAPI,
    ...onSetAdminCompSummaryDataInGlobalState};
};


/**
*
* @desc -
* @param {Object} dispatch -
* @return {Object} - object of functions
*
**/
export const adminCompSummaryDispatchMethods = function (dispatch = store.dispatch) {
  
  return {
    setAdminCompDataAPIInGlobalState: (data)=>{
      dispatch(actions.onSetAdminCompSummaryDataInGlobalState(data));
    }
  };
};
