//My imports
import {Cases} from '../Cases';
import * as util from '../../../common/helpers/';
import Permissions from '../../../common/modules/Permissions';
import {urlConfig, dashboardConstants} from
  '../../constants/dashboard-alert/DashboardAlertConstants';

/**
*
* @classdesc Opus Logic class for DashboardAlert. Extends Cases subclass
* @class DashboardAlert
* @extends Cases
*
**/
export default class DashboardAlert extends Cases {

  /**
   *
   * @desc - Class Variables
   *
   **/
  Permissions = null;

  /**
   *
   * @desc - Initializes data for DashboardAlert Logic Layer
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
   * @param {Object} adminData, globalData, access_token -
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
    const permissions_text = dashboardConstants.view_permissions;
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
  * @desc - gets dashboard alert data
  * @return {Promise} -
  *
  **/
  getDashboardAlerts() {
    let url = this.getDashboardAlertsUrl();
    return util.fetchJson(url);
  }

  /**
  *
  * @desc - gets dashboard alerts data
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
  getDashboardAlertsUrl({access_token} = this) {
    let alertsUrl = urlConfig.getAlertsUrl(access_token);
    alertsUrl = encodeURI(alertsUrl);
    return alertsUrl;
  }

  /**
  *
  * @desc - Stringify whatever this function is given
  * @param {Object} data -
  * @return {String} - stringified data
  *
  **/
  stringify = (data = {}) => JSON.stringify(data)

  /**
  *
  * @desc - saveAlerts to db
  * @param {Object} - dashboardAlertDisplays
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
  saveDashboardAlertsUrl= async (dashboardAlertDisplays, access_token) => {
    let template = {dashboardAlertList: dashboardAlertDisplays};

    //Stringify the template to save
    let stringifiedTemplate = this.stringify(template);
    console.log(stringifiedTemplate);
    //Get appointment set save url
    let url = urlConfig.saveAlertUrl(access_token);
    //Send the promise back
    console.log(dashboardAlertDisplays);
    return util.jqueryPostJson(url, stringifiedTemplate);
  }
}
