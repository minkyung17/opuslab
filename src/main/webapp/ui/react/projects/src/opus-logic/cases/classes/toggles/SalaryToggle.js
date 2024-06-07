import {get, intersection, keys, pick} from 'lodash';


//My imports
import * as util from '../../../common/helpers/';
import {urls} from '../../constants/CasesConstants';
import FieldData from '../../../common/modules/FieldData';

/**
*
* @classdesc Handles calls for changing salary field data
* @author Leon Aburime
* @module SalaryToggle
*
**/
export default class SalaryToggle {
  FieldData = new FieldData();
  invalidValues = {null: true, '': true, undefined: true};

  /**
  *
  * @desc - Used to update dependent fields values only
  * @param {Object} fieldData - all fields
  * @param {Object} template - place to get data from
  * @param {Array} arrayOfPathsToDisplayValue - array of dependent fields
  * @return {Object} fieldData - update fieldData
  *
  **/
  updateValuesOfDependentFields(fieldData, template, pathsToDisplayValue) {
    //Get the fields that are common to dependent fields and fieldData
    let commonFields = intersection(keys(fieldData), keys(pathsToDisplayValue));

    //Iterate and update the value by extracting from the template path
    for(let name of commonFields) {
      let {pathsInAPI: {appointment: {value}}} = fieldData[name];
      fieldData[name].value = get(template, value);
    }

    return fieldData;
  }

  /**
  *
  * @desc - Gets url to make salary api call
  * @param {Object} access_token -
  * @return {String} - salary url
  *
  **/
  getSalaryInfoUrl(access_token = this.access_token) {
    return urls.getSalaryInfo + access_token;
  }

  /**
  *
  * @desc - Makes the API call
  * @param {Object} salaryArgs - args needed to make api work
  * @param {Object} access_token -
  * @return {Promise} - promise to await on
  *
  **/
  getSalaryInfoFromAPI(salaryArgs = {}, access_token = this.access_token) {
    let url = this.getSalaryInfoUrl(access_token);
    return util.jqueryGetJson(url, salaryArgs);
  }

  /**
  *
  * @desc - If any of the fields extracted below are missing then dont make call
  * @param {Object} fieldData - fields passed in
  * @return {Boolean} - if we should attempt to extract the values to check
  *   if we should make the call.
  * @tag - DO NOT include "salary"!!
  *
  **/
  shouldGetSalaryArgs(fieldData = {}) {
    let {departmentCode = {}, step = {}, titleCode = {}, apuCode = {},
      salary, currentSalaryAmt = salary, scaleType = {}} = fieldData;

    return !!(departmentCode && step && titleCode && apuCode && currentSalaryAmt
      && scaleType);
  }


  /**
  *
  * @desc - Extract field values from fieldData to set up salary args
  * @param {Object} fieldData -
  * @param {Object} appointment -
  * @param {Object} options - callingApi
  * @return {Object} salaryAPIOptions -
  *
  **/
  formatSalaryAPIArgsFromApptandFields(fieldData = {}, appointment = {},
    actionId, typeOfReq, {callingApi = 'cases'} = {}) {
    let {departmentCode = {}, step = {}, titleCode = {}, apuCode = {},
      salary, currentSalaryAmt = salary, scaleType = {}} = fieldData;

    let {appointmentId = null, academicHierarchyInfo = {}} = appointment;
    let {academicHierarchyPathId: ahPathIdDefault = null} = academicHierarchyInfo;

    //Gather Salary options variables
    let ahPathId = Number(departmentCode.value) || ahPathIdDefault;
    let titleCodeId = Number(titleCode.value) || null;
    let stepTypeId = step.visibility ? this.getValidNumericalValue(step.value) : 0;
    let salaryAmt = currentSalaryAmt.value in this.invalidValues ? null :
      Number(currentSalaryAmt.value);
    // let apuNum = apuCode.visibility || apuCode.value ? apuCode.value : null;
    // let apuId = apuCodeToId[apuNum] || null;
    //let apuId = apuCode.visibility || apuCode.value ? apuCode.value : null;
    let apuId = apuCode.visibility ? apuCode.value : null;
    let scaleTypeId = scaleType.visibility ? (Number(scaleType.value) || null)
      : null;

    // Find Salary Effective Date
    let salaryScaleEffectiveDt = null;
    if(fieldData.salaryEffectiveDt &&  fieldData.salaryEffectiveDt.value){
      salaryScaleEffectiveDt = fieldData.salaryEffectiveDt.value;
    }

    //Ids and options to send
    let salaryAPIOptions = {ahPathId, stepTypeId, titleCodeId, apuId, salaryAmt,
      appointmentId, actionId, typeOfReq, salaryScaleEffectiveDt, callingApi, scaleTypeId};

    return salaryAPIOptions;
  }

  /**
  *
  * @desc - Return the numerical value (used because if the numerical value was 0,
  * the falsy value was causing inaccuracies in the ternary operator above)
  * @param {Object} value - initial value
  * @param {Object} invalid - invalid values
  * @param {Object} defaultVal - default value
  * @return {Integer} numericalValue
  *
  **/
  getValidNumericalValue(value, invalid = {'': true, null: true, undefined: true},
    defaultVal = null) {
    if (value in invalid) {
      return defaultVal;
    }
    return Number(value);
  }

  /**
  *
  * @desc - Must have ahPathId or departmentCode, titleCodeId, and step
  * @param {Object} args - args needed to make api work
  * @param {Object} invalidValues - Whether its in an invalid values
  * @return {Boolean} makeSalaryCall - whether the salary call should be made
  *
  **/
  shouldMakeSalaryAPICall({titleCodeId, stepTypeId, ahPathId, salaryScaleEffectiveDt} = {},
    {invalidValues} = this) {
    let makeSalaryCall = (!(titleCodeId in invalidValues) &&
      !(stepTypeId in invalidValues) && !(ahPathId in invalidValues));
    return makeSalaryCall;
  }

  /**
  *
  * @desc - Salary toggle should not edit dentistryBaseSupplement. Delete from
  *   whatever object it is in.
  * @param {Object} data - fieldData
  * @return {Object} data - fieldData passed in
  *
  **/
  omitDentistryBaseSupplement(data = {}) {
    delete data.dentistryBaseSupplement;
    return data;
  }

  /**
  *
  * @desc - For DSB need the attrProps of editability and visibility. DO NOT
  *  change value for DSB from this salary call as it will always be null.
  * @param {Object} fieldData -
  * @param {Object} attributeProperties -
  * @return {Object} data - fieldData passed in
  *
  **/
  handleDentistryBaseSupplementException(fieldData, attributeProperties) {
    if(!fieldData.dentistryBaseSupplement) {
      return fieldData;
    }

    //Get just dentistryBaseSupplement attributeProperties
    let {dentistryBaseSupplement} = attributeProperties;
    let singleAttributeProperty = {dentistryBaseSupplement};

    //Update editability and visibilty of fields
    this.FieldData.updateFieldDataByAttributeProperties(fieldData, singleAttributeProperty);

    return fieldData;
  }

  /**
  *
  * @desc - Simply wipes salary scale value
  * @param {Object} fieldData - all field data
  * @return {Object} fieldData - update fieldData
  *
  **/
  wipeFSPHSalaryScaleIfInvisible(fieldData) {
    //If scaleType is here always wipe value
    if(fieldData.scaleType && fieldData.scaleType.visibility === false) {
      fieldData.scaleType.value = null;
    }
  }

  /**
  *
  * @desc - Wipes DSB values if this field is invisible
  * @param {Object} fieldData - all field data
  * @return {void}
  *
  **/
  wipeDentistryBaseSupplementValueIfInvisible(fieldData = {}) {
    let {dentistryBaseSupplement} = fieldData;
    if(dentistryBaseSupplement && dentistryBaseSupplement.visibility === false) {
      dentistryBaseSupplement.value = null;
    }
  }

  /**
  *
  * @desc - Wipes off scale percent value if less than or equal to 0
  * @param {Object} fieldData - all field data
  * @return {void}
  *
  **/
  wipeOffScalePercentIfLessThanOrEqualTo0(fieldData = {}) {
    let {offScalePercent} = fieldData;
    if(offScalePercent && offScalePercent.value<=0){
      offScalePercent.value = null;
    }
  }

  /**
  *
  * @desc - Sets new dropdown options for salary effective date
  * @param {Object} fieldData - all field data
  * @param {Object} salaryAPI - salary API Data returned from salary api call
  * @return {void}
  *
  **/
  setSalaryEffectiveDateDropdownOptions(fieldData = {}, salaryAPI = {}, callingApi) {
    if(callingApi!=='profile' && salaryAPI.salaryEffectiveDtList && fieldData.salaryEffectiveDt){
      fieldData.salaryEffectiveDt.dataType = 'options';
      fieldData.salaryEffectiveDt.options = salaryAPI.salaryEffectiveDtList;
    }
    return fieldData;
  }

  /**
  *
  * @desc - Updates all fields necessary for the correctness of fieldData
  *   after the salaryAPI data has returned
  * @param {Object} fieldData -
  * @param {Object} salaryAPI -
  * @return {Object} - fieldData passed in
  *
  **/
  updateFieldDataFromSalaryResults(fieldData = {}, salaryAPI = {}, callingApi) {
    let mockAppointment = {salaryInfo: salaryAPI};
    let allAttributeProperties = this.extractSalaryInfoAttributeProps(salaryAPI);

    //Dont want to get DSB value from call, only edit & visible
    this.handleDentistryBaseSupplementException(fieldData, allAttributeProperties);
    this.omitDentistryBaseSupplement(allAttributeProperties);

    //Update editability and visibilty of fields
    this.FieldData.updateFieldDataByAttributeProperties(fieldData, allAttributeProperties);

    this.updateValuesOfDependentFields(fieldData, mockAppointment, allAttributeProperties);

    this.wipeFSPHSalaryScaleIfInvisible(fieldData);
    this.wipeDentistryBaseSupplementValueIfInvisible(fieldData);
    // OPUSDEV-2736 Should not display off scale percent if less than or equal to 0
    this.wipeOffScalePercentIfLessThanOrEqualTo0(fieldData)

    // RE-319 Set new salary effective date dropdown options
    this.setSalaryEffectiveDateDropdownOptions(fieldData, salaryAPI, callingApi)

    return fieldData;
  }


  /**
  *
  * @desc - Gets a flattened object with attributeProperties
  * @param {Object} salaryInfo - salaryAPI data
  * @return {Object} salaryAttrProps - attributeProperties from salaryAPI call
  *
  **/
  extractSalaryInfoAttributeProps(salaryInfo = {}) {
    let {attributeProperties = {}, academicProgramUnit} = salaryInfo;
    let {attributeProperties: apuAttrProps = {}} = academicProgramUnit;
    let salaryAttrProps = {...attributeProperties, ...apuAttrProps};

    return salaryAttrProps;
  }

  /**
  *
  * @desc - Takes care of getting and updating salary API data if we should
  *  make the salary call
  * @param {Object} fieldData - all fields
  * @param {Object} appointment - appointment to get backup data from
  * @param {Array} - callingApi, access_token
  * @return {Object} fieldData - fieldData passed in
  *
  **/
  updateFieldDataBySalaryAPI = async (fieldData = {}, appointment = {},
    actionId, typeOfReq, {callingApi = 'cases', access_token} = {}) => {
    //Do we have all the fields to even make the salary call? If not go back
    let shouldGetSalaryArgs = this.shouldGetSalaryArgs(fieldData);
    if(!shouldGetSalaryArgs) {
      return fieldData;
    }

    //Format salary args from appointment and fieldData
    let salaryAPIArgs = this.formatSalaryAPIArgsFromApptandFields(fieldData,
      appointment, actionId, typeOfReq, {callingApi});
    console.log('Salary Args to API ', salaryAPIArgs);

    //Check values to see if we should make salary API call
    let makeSalaryCall = this.shouldMakeSalaryAPICall(salaryAPIArgs);

    // RE-319 Salary Effective Date can now trigger salary api call
    if(fieldData.salaryEffectiveDt && fieldData.salaryEffectiveDt.visibility
      && !(fieldData.salaryEffectiveDt.value in this.invalidValues)){
      makeSalaryCall = true;
    }
    
    // OPUSDEV-3773
    console.log("Should we make a salary api call? "+makeSalaryCall)

    if(makeSalaryCall) {
      let salaryAPIData = await this.getSalaryInfoFromAPI(salaryAPIArgs,
        access_token);

      console.log('Salary Data from API ', salaryAPIData);

      // Jira #3188 Set hscpScale1to9 inside hscpScale0 fieldData
      if(fieldData.hscpScale0 && salaryAPIData.hscpScale1to9){
        fieldData.hscpScale0.hscpScale1to9 = salaryAPIData.hscpScale1to9;
      }else if(fieldData.hscpScale0){
        fieldData.hscpScale0.hscpScale1to9 = null;
      }

      this.updateFieldDataFromSalaryResults(fieldData, salaryAPIData, callingApi);
    }
    return fieldData;
  }

}
