import {omit} from 'lodash';

//My imports
import CaseFlow from './CaseFlow';
import ActionType from './ActionType';
import * as util from '../../../common/helpers/';
import FieldData from '../../../common/modules/FieldData';
import BulkActionsToggle from '../toggles/BulkActionsToggle';
import {fieldsInAPI} from '../../constants/FieldDataConstants';
import {urls} from '../../constants/CasesConstants';
import {bulkActionsConfig} from '../../../datatables/constants/BulkActionsConstants';
import {bulkActionsTemplate} from '../../constants/CasesTemplates.js';
import * as ActionCategoryType from '../../../cases/constants/ActionCategoryType';

/**********************************************************************
*
* @desc -
*
*
************************************************************************/
export default class BulkActions extends CaseFlow {
  ActionType = null;
  selectedAppointment = [];
  FieldData = new FieldData();
  FieldDataToggle = new BulkActionsToggle();
  invalidValues = {null: true, '': true, undefined: true};

  /**
  *
  * @desc - On start get commonCall lists & init other Logic files used later
  * @param {Object} - input
  * @return {String} - url to get cases attributes
  *
  **/
  constructor({adminData, globalData, ...args} = {}) {
    super({adminData, globalData, ...args});

    //Create formatted lists for the UI side
    this.formattedCommonCallLists = this.getFormattedListsFromCommonCallData(
      {adminData, globalData});

    //Create ActionType class to get directions of how to create fieldData
    this.ActionType = new ActionType({adminData, globalData, ...args});
  }

  /******* Section: Get AttributeProperties and create Field Data ***********/
  /**
  *
  * @desc - Get url that returns attributeProperties
  * @param {Object} actionCategoryType - action type to use
  * @return {String} - url to get cases attributes
  *
  **/
  getCaseAttrDataUrl(actionCategoryType, {access_token = this.access_token} = {}) {
    return urls.getCaseAttrData({actionCategoryType, access_token});
  }

  /**
  *
  * @desc -
  * @param {Object} actionCategoryType - actionType to use to get attribute properties
  * @param {String} prependUrl - if we need to prepend a string to the url
  * @return {Object} attrProps -
  *
  **/
  async getAttributePropertiesByActionTypeFromAPI(actionCategoryType =
    this.selectedActionType, prependUrl = '') {
    let url = prependUrl + this.getCaseAttrDataUrl(actionCategoryType);
    let attrProps = await util.fetchJson(url);
    return attrProps;
  }

  /**
  *
  * @desc - 1. Gets Attribute Properties. Renders Field Data from attr props
  * @param {String} actionType - actionType to use to get attribute properties
  * @param {String} prependUrl - prepend URL if needed
  * @return {Object} -
  *
  **/
  async getFieldData(actionType = this.selectedActionType, prependUrl = '') {
    //Get attributes to create blank field data
    let attrProps = await this.getAttributePropertiesByActionTypeFromAPI(actionType, prependUrl);

    //Create blank fieldData from attributeProperties received from the API
    let fieldData = this.FieldData.createFieldDataByAttributeProperties(attrProps,
      {fieldDataOptions: fieldsInAPI});

    //Add value options for dropdowns.  No longer using generic addOptionsListToFieldData function
    //because APU dropdowns have to be manually swapped out because of filtering.  However, this particular
    //use case is not filtered because we open up the entire list for bulk actions.
    this.FieldDataToggle.updateCasesAPUOptionsFromGlobalData(fieldData, 'All', this.formattedCommonCallLists);

    return {fieldData};
  }

  /**
   *
   * @description - Determines what fields to delete from fieldData based upon
   * actionType
   * @param {Object} fieldData - fieldData
   * @param {String} actionType - The selected action type
   * @return {Object} fieldData
   *
   **/
  configureFormFields(fieldData, actionType) {
    let updatedFieldData = {};
    
    if (actionType === ActionCategoryType.REAPPOINTMENT
      || actionType === ActionCategoryType.RENEWAL) {
      updatedFieldData = omit(fieldData, ['actionType']);
    }
    if (actionType === ActionCategoryType.END_APPOINTMENT) {
      updatedFieldData = omit(fieldData, ['actionType', 'proposedEffectiveDt']);
    }
    if (actionType === ActionCategoryType.CHANGE_APU) {
      updatedFieldData = omit(fieldData, ['actionType', 'hscpAddBaseIncrement',
        'hscpScale0', 'hscpBaseScale', 'rank', 'salary', 'series', 'step', 'titleCode']);
      this.updateAPUFieldVisibility(updatedFieldData);
    }
    return updatedFieldData;
  }

  /**
   *
   * @description - Exception case for APU field visibility
   * @param {Object} fieldData - fieldData
   * @return {Object} fieldData
   *
   **/
  updateAPUFieldVisibility(fieldData) {
    fieldData['apuCode'].visibility = true;
    fieldData['hscpScale1to9'].visibility = true;
    return fieldData;
  }

  /**
   * @desc - Toggle the fields for Bulk Action
   * @param {Object} fieldData -
   * @param {Object} nameOfChangedField -
   * @return {Object} - fieldData
   **/
  updateBulkActionFieldDataByToggle(fieldData, nameOfChangedField) {
    let formattedCommonCallLists = this.getCachedCommonCallLists();

    if(nameOfChangedField === 'apuCode') {
      if(!fieldData.apuCode) {
        return fieldData;
      }
      this.FieldDataToggle.updateHSCPFromAPU(fieldData, formattedCommonCallLists);
    }
    return fieldData;
  }

  /**
  *
  * @desc - Get the relevant field values to display in appt. sets
  * @param {Object} proposedActionFields -
  * @param {Object} proposedStatusFieldsByApptId -
  * @param {Object} appointments -
  * @param {Object} - mergeOpusId, mergeOpusIdFlag, selectedUIDPersonAppointeeInfo
  * @return {Promise} - save promise
  *
  **/
  saveActions(fieldData = {}, {actionType, selectedRowList, ...options} = {}) {
    //Create the template to be saved
    let template = this.populateBulkActionsTemplate(fieldData, actionType,
      selectedRowList);

    //For Debugging purposes print template being sent to api
    console.log('New Bulk Actions Data', template);

    //Now save it and return the promise
    return this.saveBulkActionsToAPI(template);
  }

  /**
  *
  * @desc - Populated bulkActionsTemplate
  * @param {Object} fieldData -
  * @param {String} actionType -
  * @param {Object} selectedRowList -
  * @return {Object} - template
  *
  **/
  populateBulkActionsTemplate(fieldData, actionType, selectedRowList) {

    let concatenatedRowList = Object.keys(selectedRowList).join(',');

    let template = this.getNewBulkActionsTemplate();
    template.apptIds = concatenatedRowList;
    template.actionType = actionType;
    template.effectiveDt = fieldData.proposedEffectiveDt
      ? fieldData.proposedEffectiveDt.value : null;
    template.appointmentEndDt = fieldData.appointmentEndDt ?
      fieldData.appointmentEndDt.value : null;
    template.apuCode = fieldData.apuCode
      ? this.concatenateAPU(fieldData) : null;
    template.user = this.adminData.adminName;
    return template;
  }

  /**
  *
  * @desc - concatenate apuId and apuCode, which is an exception
  * for Bulk Actions.  Other APU fields do not use this concatenated form
  * @param {Object} fieldData - fieldData
  * @return {String} - the concatenated value
  *
  **/
  concatenateAPU(fieldData) {
    //Extract list that maps APU id to code
    let {apuIdToCode} = this.formattedCommonCallLists;

    /*
      Extract apuCode field.  Remember that the config file
      (opus-logic/cases/constants/FieldDataConstants.js) is pointing apuCode
      to the backend value of apuId since the code value was changing every year,
      and thus there wasn't a code value to use on the front-end.  So the name of
      the field is defined as apuCode while the pathsInAPI value is apuId.
      Let's rename it here to avoid confusion.
    */
    let {value: apuId} = fieldData.apuCode;

    //Determine associated apuCode value
    let apuCode = apuIdToCode[apuId];

    //Return the concatenation of the two APU values
    return apuCode + '-' + apuId;
  }

  /**
  *
  * @desc - Get blank bulkActionsTemplate
  * @return {Object} -
  *
  **/
  getNewBulkActionsTemplate() {
    return {...util.cloneObject(bulkActionsTemplate)};
  }

  /**
  *
  * @desc - Stringify template and send to API.  Note that for some API
  * calls, we have to send in saveHeaders to override the application/json
  * header with application/x-www-form-urlencoded.  Has to do with how the API
  * takes in the data.
  * @param {Object} template -
  * @return {Promise} - promise to be resolved
  *
  **/
  saveBulkActionsToAPI(template) {
    let formattedUrl = this.formatSaveBulkActionsURL();
    let saveArgs = this.getSaveHeaders();
    return util.jqueryPostJson(formattedUrl, template, saveArgs);
  }

  /**
  *
  * @desc - format URL
  * @param {Object} url -
  * @param {Object} access_token -
  * @return {String} - formatted URL
  *
  **/
  formatSaveBulkActionsURL(url = bulkActionsConfig.saveDataUrl, {access_token} = this) {
    return url + '?access_token=' + access_token;
  }
}
