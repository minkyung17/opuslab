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
import {profileValidations} from '../../constants/profile/ProfileValidations';
import {text, urlConfig, profileSaveTemplate, profileConstants, viewAppointmentSetConstants, editAppointmentSetConstants} from '../../constants/profile/ProfileConstants';

/**
*
* @classdesc Opus Logic class for Profile. Extends Cases subclass
* @class Profile
* @extends Cases
*
**/
export default class AppointmentSets extends Profile {

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
    const permissions_text = viewAppointmentSetConstants.name;
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

  getCategoryDropdownList = (affiliationTypeList) => {
    let categoryList = [];
    for(let each in affiliationTypeList){
      if(affiliationTypeList[each].appointmentCategory){
        let categoryObject = {};
        categoryObject[affiliationTypeList[each].appointmentCategoryId] = affiliationTypeList[each].appointmentCategory;
        categoryList.push(categoryObject);
      }
    }
    return categoryList;
  }

  getAppointmentSetData = async (opusPersonId, access_token) => {
    let url = urlConfig.getAppointmentSetUrl({opusPersonId, access_token})
    let results = await util.getJson(url);
    return results;
  }

  getAppointmentSetDropdownOptionsFromAPI = async (opusPersonId, access_token) => {
    let url = urlConfig.getAppointmentSetDropdownOptionsUrl({opusPersonId, access_token})
    let results = await util.getJson(url);
    return results;
  }

  updateAppointmentSet = async (appointmentSet, access_token, adminName) => {
    let template = {appointmentInfoList: appointmentSet, loggedInUserInfo: {adminName}};

    //Stringify the template to save
    let stringifiedTemplate = this.stringify(template);

    //Get appointment set save url
    let url = urlConfig.updateAppointmentSetUrl({access_token, adminName});
    //Send the promise back
    return util.jqueryPostJson(url, stringifiedTemplate);
  }

  saveAppointmentSet = async (appointmentSet, access_token, adminName) => {
    let template = {appointmentInfoList: appointmentSet, loggedInUserInfo: {adminName}};

    //Stringify the template to save
    let stringifiedTemplate = this.stringify(template);

    //Get appointment set save url
    let url = urlConfig.saveAppointmentSetUrl({access_token, adminName});
    //Send the promise back
    return util.jqueryPostJson(url, stringifiedTemplate);
  }

}
