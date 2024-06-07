import {get} from 'lodash';
import {assert} from 'chai';

import * as util from '../../../../opus-logic/common/helpers';


/**
*
* @desc - Ensures display values from in fieldData are correctly formatted
* @param {Object} Logic -
* @param {Object} fieldData -
* @param {Object} dataSource -
* @param {Object} invalidValues -
* @return {Object} proposedStatus -
*
**/
export function reformatDisplayValuesBasedOnViewType(Logic, fieldData = {},
  dataSource = {}, invalidValues = {null: true, '': true, undefined: true}) {
  //Iterate through each field to compare their values with the text they should be
  for(let name in fieldData) {
    let {attributeProperties: {pathToFieldDisplayText}} = fieldData[name];

    //Get value straight from source
    let originalDisplayValue = get(dataSource, pathToFieldDisplayText);

    //If the value is undefined or null then it should not be formatted
    if(originalDisplayValue in invalidValues) {
      continue;
    }

    //Extract formatted value or "displayValue"
    let {displayType, displayValue, displayText = displayValue} = fieldData[name];

    //Compare various forms of the displayText
    if(displayType === 'money') {
      let testValue = util.reformatToMoneyDisplayValue(originalDisplayValue);
      assert.equal(testValue, displayText, `${name} not correct`);
    } else if(displayType === 'percent') {
      let testValue = originalDisplayValue + '%';
      assert.equal(testValue, displayText, `${name} not correct`);
    } else { //If there are any other tranforms this will catch the mismatch
      assert.equal(originalDisplayValue, displayText, `${name} not correct`);
    }
  }


  return fieldData;
}

/**
*
* @desc - Ensures display values from in fieldData are correctly formatted
* @param {Object} Logic -
* @param {Object} fieldData -
* @param {Object} ignore -
* @return {Object} proposedStatus -
*
**/
export function addOptionsListToFieldData(Logic, fieldData = {}, ignore = {
  step: true, apuCode: true}) {
  let {formattedCommonCallLists} = Logic;

  for(let name in fieldData) {
    //Are we dealing with options(dropdown/select)
    //Step is special and should not be tested
    if(fieldData[name].dataType === 'options' && !(name in ignore)) {
      //Extract the name of the set of options
      let {options, optionsInfo: {formattedListName}} = fieldData[name];

      //Get correct options from common call lists
      let testOptions = formattedCommonCallLists[formattedListName];

      //Ensure the options are in fieldData[name]
      assert.deepEqual(options, testOptions, `${name} options incorrect`);
    }
  }
  return fieldData;
}

/**
*
* @desc - Ensures display values from in fieldData are correctly formatted
* @param {Object} Logic -
* @param {Object} fieldData -
* @return {Object} proposedStatus -
*
**/
export function addStepOptionsByTitleCodeValue(Logic, fieldData = {}) {
  if(!fieldData.titleCode || !fieldData.step) {
    return;
  }
  //Extracted set of lists
  let {formattedCommonCallLists: {titleCodeIdToStepOptions}} = Logic;

  //TitleCode value used to extract step options
  let {value} = fieldData.titleCode;
  assert.deepEqual(fieldData.step.options, titleCodeIdToStepOptions[value]);

  return;
}


/**
*
* @desc - Make sure all the fields in loggedInUserInfo match those in adminData
* @param {Object} Logic -
* @return {void}
*
**/
export function populateLoggedInUserInfoWithAdminData(Logic) {
  let loggedInUserInfo = Logic.populateLoggedInUserInfoWithAdminData();

  let {adminData} = Logic;
  assert.equal(loggedInUserInfo.adminEmail, adminData.adminEmail);
  assert.equal(loggedInUserInfo.adminFirstName, adminData.adminFirstName);
  assert.equal(loggedInUserInfo.adminName, adminData.adminName);
  assert.equal(loggedInUserInfo.adminOpusId, adminData.adminOpusId);
  assert.deepEqual(loggedInUserInfo.adminRoles, adminData.adminRoles);
  assert.equal(loggedInUserInfo.adminUclaLogon, adminData.adminUclaLogon);

  return loggedInUserInfo;
}


/**
*
* @desc - Ensures values from dataSource are overlaid into fieldData
* @param {Object} Logic -
* @param {Object} fieldData -
* @param {Object} appointment -
* @return {void}
*
**/
export function addAHPathAndDeptCodeToApptFromFieldData(Logic, fieldData, appointment) {
  //This is a valid ahPath and valid deptCode
  let startAhPathId = 20;
  let ahPathToDeptCodeDummyValues = {[startAhPathId]: '135000'};

  //Wipe out "academicHierarchyPathId"
  appointment.academicHierarchyInfo.academicHierarchyPathId = null;
  appointment.academicHierarchyInfo.departmentCode = null;

  //"departmentCode" should be in "academicHierarchyInfo.departmentCode"
  assert.isNull(appointment.academicHierarchyInfo.academicHierarchyPathId);
  assert.isNull(appointment.academicHierarchyInfo.departmentCode);

  //Wipe value so we know what they are before checking for them
  fieldData.departmentCode.value = startAhPathId;

  //Get AHPath in deptCode & use that to get deptCode from commonCallList
  let {value: ahPathId} = fieldData.departmentCode;
  let deptCodeFromAhPathId = Logic.formattedCommonCallLists.aHPathIdsToDeptCode[ahPathId];

  //Extra check that "formattedCommonCallLists.aHPathIdsToDeptCode" is correct
  assert.equal(deptCodeFromAhPathId, ahPathToDeptCodeDummyValues[startAhPathId]);

  //Make sure these values are not there before testing
  assert.isFinite(ahPathId);
  assert.notExists(appointment.academicHierarchyPathId);

  //Perform operation on "academicHierarchyPathId" & "departmentCode"
  Logic.addAHPathAndDeptCodeToApptFromFieldData(fieldData, appointment);

  //ahPathId should be "academicHierarchyPathId"
  assert.equal(appointment.academicHierarchyInfo.academicHierarchyPathId, startAhPathId);

  //"departmentCode" should be in "academicHierarchyInfo.departmentCode"
  assert.equal(appointment.academicHierarchyInfo.departmentCode,
    deptCodeFromAhPathId);
}

/**
*
* @desc - Ensures appt apuId is the same as fieldData
* @param {Object} Logic -
* @param {Object} fieldData -
* @param {Object} appointment -
* @return {void}
*
**/
export function addApuCodeToApptByFieldDataApuId(Logic, fieldData, appointment) {
  // let apuCode = fieldData.apuCode.value;
  // let apuId = Logic.formattedCommonCallLists.apuCodeToId[apuCode];
  // assert.equal(appointment.salaryInfo.academicProgramUnit.apuId, apuId);

  //Lets create an apuValue and get the apuId from apuValue
  let apuId = 7167;

  //Copy appointment so a new one is created each test run
  let clonedAppt = util.cloneObject(appointment);

  //Make sure out appointment is not equal to the apuCodeValue for testing
  assert.notEqual(apuId, clonedAppt.salaryInfo.academicProgramUnit.apuId);

  //Set fieldData to apuCodeValue before we run the function
  fieldData.apuCode.value = apuId;

  let apuCodeFromApuId = Logic.formattedCommonCallLists.apuIdToCodeWithPast[apuId];

  //Now we run the function to see if it updated appointments apuId
  Logic.addApuCodeToApptByFieldDataApuId(fieldData, clonedAppt);

  //Lets check if our appt's apuId was updated;
  assert.equal(clonedAppt.salaryInfo.academicProgramUnit.apuCode,
    apuCodeFromApuId);
}
