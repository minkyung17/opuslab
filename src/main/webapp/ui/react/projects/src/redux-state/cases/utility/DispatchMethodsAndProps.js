import {isArray} from 'lodash';

import {store} from '../stores';
import {caseFlowDispatchMethods} from './CaseFlowDispatch';
import {caseSummaryDispatchMethods} from './CaseSummaryDispatch';


/**
 *
 * @desc - Combines all dispatch methods to later pick and choose from
 * @param {Object} dispatch - methods {Array | String} - methods names
 * @return {Object} -
 *
 **/
export const dispatchMethods = function (dispatch = store.dispatch) {
  return {
    ...caseSummaryDispatchMethods(dispatch),
    ...caseFlowDispatchMethods(dispatch)
  };
};

export const allDispatchMethodNames = Object.keys(dispatchMethods());

/**
 *
 * @name getDispatchMethodsByName
 * @desc - Takes a string or array of method names and returns them from
 *    dispatchMethods
 * @param {Array | String} methods - methods names
 * @param {Object} dispatch -
 * @return {Object} methodCollection -
 *
 **/
export function getDispatchMethodsByName(methods = [], dispatch = store.dispatch) {
  //If methods isnt array make it an array
  //methods = ( typeof methods != 'undefined' && methods instanceof Array ) ?
  let formattedMethodList = isArray(methods) ? methods : [methods];

  let methodCollection = {};//Save our methods
  let listOfMethods = dispatchMethods(dispatch);

  for(let methodName of formattedMethodList) {
    methodCollection[methodName] = listOfMethods[methodName];
  }

  return methodCollection;
}

/**
 *
 * @name getDispatchMethodsByName
 * @desc - Takes a string or array of method names and returns them from
 *    dispatchMethods
 * @param {Array | String} methods - methods names
 * @param {Object} dispatch -
 * @return {Object} methodCollection -
 *
 **/
export function getAllDispatchMethods(methods = allDispatchMethodNames,
  dispatch = store.dispatch) {
  return getDispatchMethodsByName(methods, dispatch);
}

export let defaultMapDispatchToProps = state => getAllDispatchMethods();
