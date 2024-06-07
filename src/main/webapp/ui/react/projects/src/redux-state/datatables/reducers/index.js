import {combineReducers} from 'redux';
import * as actions from '../actions';

let initialState = {
  dataTableConfiguration: {},
  originalRowData: [], //Original row results from API
  formattedRowData: [], //After I transformed dates, flattened it, etc
  filteredRowData: [] //After its gone through various filters
};


export function updateGlobalData(state = initialState, action) {
  switch(action.type) {
  case actions.UPDATE_DATATABLE_CONFIG: {
    return {
      ...state,
      ...action.dataTableConfiguration
    };
  }
  case actions.UPDATE_ORIGINAL_ROWDATA: {
    return {
      ...state,
      ...action.originalRowData
    };
  }
  case actions.UPDATE_FORMATTED_ROWDATA: {
    return {
      ...state,
      ...action.formattedRowData
    };
  }
  case actions.UPDATE_FILTERED_ROWDATA: {
    return {
      ...state,
      ...action.filteredRowData
    };
  }
  default:
    return state;
  }
}


export const rootReducer = combineReducers({
  updateGlobalData
});
