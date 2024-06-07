import {combineReducers} from 'redux';

export let initialStateAdminCompSummary = {
  adminCompSummaryDataFromAPI: null
};

export function onSetAdminCompSummaryDataInGlobalState(state = initialStateAdminCompSummary,
  action) {
  switch (action.type) {
  case 'ADMIN_COMP_SUMMARY_API_DATA':
    return {
      ...state,
      adminCompSummaryDataFromAPI: action.data
    };
  default:
    return state;
  }
}

export const adminCompSummaryReducer = combineReducers({
  onSetAdminCompSummaryDataInGlobalState
});
