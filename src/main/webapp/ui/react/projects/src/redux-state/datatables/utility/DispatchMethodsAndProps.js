import {isArray} from 'lodash';

import {store} from '../stores';
import * as actions from '../actions';


export const dataTableDispatchMethods = (dispatch = store.dispatch) => {
  return {
    setDataTableConfiguration: (dataTableConfig) => {
      dispatch(actions.onUpdateDatatableConfiguration(dataTableConfig));
    },
    setOriginalRowData: (originalRowData) => {
      dispatch(actions.onUpdateOriginalRowData(originalRowData));
    },
    setFormattedRowData: (formattedRowData) => {
      dispatch(actions.onUpdateFormattedRowData(formattedRowData));
    },
    setFilteredRowData: (filteredRowData) => {
      dispatch(actions.onUpdateFilteredRowData(filteredRowData));
    }
  };
};

export const dispatchMethods = function (dispatch = store.dispatch) {
  return {
    ...dataTableDispatchMethods(dispatch)
  };
};

/**
 * getDispatchMethodsByName()
 *
 * @desc - Takes a string or array of method names and returns them from
 *    dispatchMethods
 * @param - methods {Array | String} - methods names
 * @return - {Object}
 *
 **/
export function getDispatchMethodsByName(methods = [], dispatch = store.dispatch) {
  //If methods isnt array make it an array
  //let validMethods = (typeof methods !== 'undefined' && methods instanceof Array) ?
  let validMethods = isArray(methods) ? methods : [methods];

  let methodCollection = {};//Save our methods
  let listOfMethods = dispatchMethods(dispatch);

  for(let methodName of validMethods) {
    methodCollection[methodName] = listOfMethods[methodName];
  }

  return methodCollection;
}

export const allDispatchMethodNames = Object.keys(dispatchMethods());


/**
 * getAllDispatchMethods()
 *
 * @desc - Does exactly what it says by getting all the methods
 * @param - methods {Array} - methods names
 * @return - {Object}
 *
 **/
export function getAllDispatchMethods(methods = allDispatchMethodNames,
  dispatch = store.dispatch) {
  return getDispatchMethodsByName(methods, dispatch);
}


export let defaultMapStateToProps = function (state) {
  let {updateGlobalData} = state;
  let {dataTableConfiguration, originalRowData, formattedRowData,
    filteredRowData} = updateGlobalData;
  return {dataTableConfiguration, originalRowData, formattedRowData,
    filteredRowData};
};

export let defaultMapDispatchToProps = state => getAllDispatchMethods();
