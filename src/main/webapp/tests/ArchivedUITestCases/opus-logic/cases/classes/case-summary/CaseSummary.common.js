import {assert} from 'chai';
import {get, difference, keys} from 'lodash';

import * as util from '../../../../../opus-logic/common/helpers';


/**
*
* @desc - Ensures values from dataSource are overlaid into fieldData
* @param {Object} Logic -
* @param {Object} fieldData -
* @param {Object} dataSource -
* @return {Object} proposedStatus -
*
**/
export function addValuesToFieldData(Logic, fieldData = {}, dataSource = {}) {
  //Loop through fieldData and ensure extracted values are same
  for(let name in fieldData) {
    //Get paths to extract the data
    let {attributeProperties} = fieldData[name];
    let {pathToFieldValue} = attributeProperties;

    //Extract value...generally in the modals
    let testValue = get(dataSource, pathToFieldValue);
    let {value} = fieldData[name];
    assert.equal(value, testValue, `${name} doesn't have correct value`);
  }

  return fieldData;
}

/**
*
* @desc - Ensures values from dataSource are overlaid into fieldData
* @param {Object} Logic -
* @param {Object} fieldData -
* @param {Object} dataSource -
* @return {Object} proposedStatus -
*
**/
export function getVisibleFieldData(Logic, fieldData) {
  //These fields visibility flag should be true
  let visibleFieldData = Logic.getVisibleFieldData(fieldData);

  for(let name in visibleFieldData) {
    assert.isTrue(visibleFieldData[name].visibility);
  }

  //Get all the fields that are not present in "visibleFieldData"
  let invisibleFieldNames = difference(keys(fieldData), keys(visibleFieldData));

  //These fields visibility flag should not be true
  for(let name of invisibleFieldNames) {
    assert.isFalse(fieldData[name].visibility);
  }

  return visibleFieldData;
}

/**
*
* @desc - getActionTypeFromActionData() gets actionType i.e. "3-1" or "2-7"
* @param {Object} Logic -
* @param {Object} actionData -
* @return {Object} proposedStatus -
*
**/
export function getActionTypeFromActionData(Logic, actionData) {
  //From Logic class
  let actionType = Logic.getActionTypeFromActionData(actionData);

  //For testing
  let {actionTypeInfo: {actionCategoryId, actionTypeId}} = actionData;
  let testActionType = `${actionCategoryId}-${actionTypeId}`;

  assert.equal(actionType, testActionType);
}
