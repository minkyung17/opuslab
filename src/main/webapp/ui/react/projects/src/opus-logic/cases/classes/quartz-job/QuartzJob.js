//My imports
import {Cases} from '../Cases';
import * as util from '../../../common/helpers/';
import Permissions from '../../../common/modules/Permissions';
import {urlConfig, quartzConstants} from
  '../../constants/quartz-job/QuartzJobConstants';

/**
*
* @classdesc Opus Logic class for DashboardAlert. Extends Cases subclass
* @class DashboardAlert
* @extends Cases
*
**/
export default class QuartzJob extends Cases {

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
    const permissions_text = quartzConstants.view_permissions;
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
  * @desc - gets quartz job data
  * @return {Promise} -
  *
  **/
  getQuartzJobInfo() {
    let url = this.getQuartzJobUrl();
    return util.fetchJson(url);
  }

  /**
  *
  * @desc - gets quartz job data
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
  getQuartzJobUrl({access_token} = this) {
    let quartzJobUrl = urlConfig.getQuartzJobInfoUrl(access_token);
    quartzJobUrl = encodeURI(quartzJobUrl);
    return quartzJobUrl;
  }

  /**
  *
  * @desc - saveAlerts to db
  * @param {Object} - dashboardAlertDisplays
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
  turnJobOnOff = async (quartzJob, access_token) => {
    let loggedInUserInfo = this.getLoggedInUserInfo();
    console.log(loggedInUserInfo);
    let jobId = quartzJob.jobId;
    let jobName = quartzJob.jobDisplayName;
    let jobFrequency = quartzJob.jobFrequency;
    let jobScheduleTime = quartzJob.jobScheduleTime;
    let jobOnOff = quartzJob.jobOnOff;
    let loggedInUserName = loggedInUserInfo.adminName;
    let loggedInUserFirstName = loggedInUserInfo.adminFirstName;
    let loggedInUserEmail = loggedInUserInfo.adminEmail;
    let url = urlConfig.updateJobOnOffUrl({access_token, jobId, jobName, jobFrequency, jobScheduleTime,
              jobOnOff, loggedInUserName, loggedInUserFirstName, loggedInUserEmail});
    return util.postJson(url);
  }

  /**
  *
  * @desc - Stringify whatever this function is given
  * @param {Object} data -
  * @return {String} - stringified data
  *
  **/
  stringify = (data = {}) => JSON.stringify(data)
}
