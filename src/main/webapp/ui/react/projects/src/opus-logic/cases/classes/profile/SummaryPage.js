import moment from 'moment';
import {pick, set, get, omit} from 'lodash';

//My imports
import Profile from './Profile';
import * as util from '../../../common/helpers/';
import SalaryToggle from '../toggles/SalaryToggle';
import ProfileToggle from '../toggles/ProfileToggle.js';
import Validator from '../../../common/modules/Validate';
import FieldData from '../../../common/modules/FieldData';
import Permissions from '../../../common/modules/Permissions';
import {fieldsInAPI} from '../../constants/profile/ProfileFieldDataConstants';
import {urls} from '../../constants/CasesConstants';
import {profileValidations} from '../../constants/profile/ProfileValidations';
import {text, urlConfig, profileSaveTemplate, profileConstants} from '../../constants/profile/ProfileConstants';

/**
*
* @classdesc Opus Logic class for Profile. Extends Cases subclass
* @class Profile
* @extends Cases
*
**/
export default class SummaryPage extends Profile {

  /**
   *
   * @desc - Initializes data for Profile Logic Layer
   * @param {Object} data - startup data
   * @return {void}
   *
   **/
  constructor(data = {}) {
    super(data);
    this.startLogic(data);
  }

  /**
   *
   * @desc - Initializes data for Profile Logic Layer
   * @param {Object} attributeProperties -
   * @return {Object} - array of objects with names, labels, and opusPersonIds
   *
   **/
  startLogic({adminData, globalData, access_token} = {}) {
    this.Permissions = new Permissions(adminData);

    //Make lists to use to get options
    let formattedCommonCallLists = this.getFormattedListsFromCommonCallData(
      {adminData, globalData});

    //Get grouperPathText to save data
    const grouperPathText = this.getGrouperPathText(adminData);

    //Get slimmed logged in user info
    let loggedInUserInfo = this.getLoggedInUserInfo(adminData);

    this.setClassData({adminData, grouperPathText, globalData, access_token,
      formattedCommonCallLists, loggedInUserInfo});
  }

  /**
  *
  * @desc - Get grouperPathText from adminData via profile constants
  * @param {Object} adminData -
  * @return {String} grouperPathText -
  *
  **/
  getGrouperPathText(adminData) {
    const permissions_text = profileConstants.view_permissions;
    const permissions = adminData.resourceMap[permissions_text];
    const grouperPathText = permissions.formattedGrouperPathTexts;

    return grouperPathText;
  }

  /**
  *
  * @desc - Get loggedInUserInfo without heavy adminDepartments
  * @param {Object} adminData -
  * @return {Object} loggedInUserInfo -
  *
  **/
  getLoggedInUserInfo(adminData = this.adminData) {
    let loggedInUserInfo = util.cloneObject(adminData);
    delete loggedInUserInfo.adminDepartments;
    return loggedInUserInfo;
  }


  /**
  *
  * @desc - gets profile summary data
  * @param {String} opusPersonId -
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
  getProfileSummaryDataByOpusIdUrl(opusPersonId, {access_token} = this) {
    return urlConfig.getProfileSummaryDataByOpusIdUrl({opusPersonId, access_token});
  }

  /**
  * @desc - gets profile summary data
  * @param {Object} opusPersonId -
  * @return {Promise} -
  *
  **/
  getProfileSummaryDataByOpusId(opusPersonId) {
    let url = this.getProfileSummaryDataByOpusIdUrl(opusPersonId);
    return util.fetchJson(url);
  }


  isOAOrAPO(){
    return this.Permissions.isOAOrAPO();
  }

  /*****************************************************************************
  *
  * @desc - Having to do with opus status
  *
  *****************************************************************************/

  /**
  *
  * @desc - Setup for opusStatus
  * @param {String} status -
  * @return {Object} - Opus status field
  *
  **/
  setUpProfileSummaryDisplayInfo(appointeeInfo) {
    let opusStatus = this.createOpusStatusField(appointeeInfo.opusStatus);
    let startingOpusStatusField = util.cloneObject(opusStatus);
    let profileSummaryDisplayInfo = {
      opusStatus: opusStatus,
      startingOpusStatusField: startingOpusStatusField,
      firstName: {value: appointeeInfo.firstName, error: null},
      middleName: {value: appointeeInfo.middleName, error: null},
      lastName: {value: appointeeInfo.lastName, error: null},
      officialEmail: {value: appointeeInfo.officialEmail, error: null}
    }
    let startingProfileSummaryDisplayInfo = util.cloneObject(profileSummaryDisplayInfo);
    return {profileSummaryDisplayInfo, startingProfileSummaryDisplayInfo};
  }

  /**
  *
  * @desc - Create initial opusStatus field
  * @param {String} opusStatus -
  * @return {Object} - Opus status field
  *
  **/
  createOpusStatusField(opusStatus) {
    let options = this.getOpusStatusOptions();

    return {
      options,
      visibility: true,
      editable: true,
      dataType: 'options',
      name: 'opusStatus',
      displayName: 'Opus Status',
      value: opusStatus,
      displayText: opusStatus
    };
  }

  /**
  *
  * @desc - Get opusStatus options
  * @return {Array} opusStatus - Sorted array of opus status
  *
  **/
  getOpusStatusOptions() {
    let opusStatusOptions = [
      {Active: 'Active'},
      {Inactive: 'Inactive'}
    ];
    return opusStatusOptions;
  }

  /**
  *
  * @desc - Saves data for opus status
  * @param {String} opusStatus -
  * @param {String} opusPersonId -
  * @return {Promise} - save request
  *
  **/
  saveProfileSummary(profileSummaryDisplayInfo, opusPersonId) {
    let saveArgs = this.getSaveHeaders();
    let urlArgs = this.getsaveProfileSummaryArgs(profileSummaryDisplayInfo, opusPersonId);
    let url = urlConfig.saveProfileSummaryUrl({access_token: urlArgs.access_token});
    return util.jqueryPostJson(url, JSON.stringify(urlArgs.SaveCaseInByC))
  }

  /**
  *
  * @desc - Extract and formats args to save opus status
  * @param {String} opusStatus -
  * @param {String} opusPersonId -
  * @return {Promise} - json request
  *
  **/
  getsaveProfileSummaryArgs(profileSummaryDisplayInfo, opusPersonId, {access_token, adminData} = this) {

    // Configure object to send
    let SaveCaseInByC = {
      appointeeInfo:{
        opusPersonId,
        firstName: profileSummaryDisplayInfo.firstName.value,
        middleName: profileSummaryDisplayInfo.middleName.value,
        lastName: profileSummaryDisplayInfo.lastName.value,
        opusEmail: profileSummaryDisplayInfo.officialEmail.value,
        opusStatus: profileSummaryDisplayInfo.opusStatus.value
      },
      adminName: adminData.adminName,
      template: {},
      tieWithExistingCase: null,
      bycUnitId: null,
      caseId: null,
      bycPacketId: null
    }
    let urlArgs = {access_token, SaveCaseInByC};
    return urlArgs;
  }

  validateProfileData = async (profileSummaryDisplayInfo, editable, opusPersonId) => {
    let errors = false;
    let data = profileSummaryDisplayInfo;
    if(data.firstName.value===''){
      data.firstName.error = 'Please fill out this required field.';
      errors = true;
    }else{
      data.firstName.error = null;
    }
    if(data.lastName.value===''){
      data.lastName.error = 'Please fill out this required field.';
      errors = true;
    }else{
      data.lastName.error = null;
    }
    if(data.officialEmail.value==='' && editable===true){
      data.officialEmail.error = `This field is required. If you do not know the email address,
        enter a unique address such as JPF1234Bruin@ucla.edu. This address will be overwritten once the
        candidate has an official email`;
      errors = true;
    }else if(editable===true){
      let {access_token, adminData: {adminName: user}} = this;
      let args = util.jsonToUrlArgs({access_token, user, emailId: data.officialEmail.value,
        opusPersonId});
      let url = `${urls.checkIfEmailIsUniqueAndValid}${args}`;
      let uniqueEmailPromise = util.fetchJson(url);

      let response = await uniqueEmailPromise;
      if(response === 'Found Match'
        || response === 'Not A Valid Email'){
        errors = true;
        // only 2 responses coming in ('Found Match' || 'Not A Valid Email')
        if(response === 'Found Match'){
          data.officialEmail.error = `The email address you entered is not unique.
            If you do not know the email address, enter a unique address such as JPF1234Bruin@ucla.edu.
            This address will be overwritten once the candidate has an official email.`;
        }else{
          data.officialEmail.error = `The email address you entered is not valid.
            If you do not know the email address, enter a unique address such as JPF1234Bruin@ucla.edu.
            This address will be overwritten once the candidate has an official email.`;
        }
      }else{
        data.officialEmail.error = null;
      }
    }else{
      data.officialEmail.error = null;
    }
    return {profileSummaryDisplayInfo: data, hasErrors: errors}
  }

}
