import moment from 'moment';
import {pick, set, get, omit} from 'lodash';

//My imports
import * as util from '../../../common/helpers';
import Permissions from '../../../common/modules/Permissions';
import {constants, editEndowedChairConstants, endowedChairConstants, endowedChairValidationFields, modalErrorMessage} from '../../constants/endowed-chairs/EndowedChairSummaryConstants';
import CasesDossier from "../CasesDossier";

/**
*
* @classdesc Opus Logic class for Endowed Chair Summary.
* @class Profile
*
**/
export default class EndowedChairSummary extends CasesDossier {

  /**
   *
   * @desc - Initializes data for EndowedChairSummary Logic Layer
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
   * @desc - Initializes data for EndowedChairSummary Logic Layer
   * @param {Object} attributeProperties -
   * @return {Object} - array of objects with names, labels, and opusPersonIds
   *
   **/
  startLogic({adminData, globalData, access_token} = {}) {
    this.Permissions = new Permissions(adminData);

    //Get slimmed logged in user info
    let loggedInUserInfo = this.getLoggedInUserInfo(adminData);

    this.setClassData({adminData, globalData, access_token, loggedInUserInfo});
  }

  /**
  *
  * @desc - Get Endowed chair summary data
  * @param {String} endowedChairId - api results
  * @param {String} access_token -
  * @return {Object} data - API Promise for endowed chair summary data
  *
  **/
      async getEndowedChairSummaryData(endowedChairId, access_token = this.access_token) {
        let endowedChairSummaryUrl = this.getEndowedChairSummaryDataAPIUrl(access_token);
        let endowedChairSummaryArgs = this.getEndowedChairSummaryDataAPIArgs(endowedChairId);
        let data = await util.fetchJson(endowedChairSummaryUrl, endowedChairSummaryArgs);
        return data;
    }


  /**
  *
  * @desc - Get just the url w/ the access_token appended
  * @param {String} access_token -
  * @return {String} url - complete url with access token
  *
  **/
    getEndowedChairSummaryDataAPIUrl(access_token = this.access_token) {
      let url = `${constants.urls.getEndowedChairSummary}${access_token}`;
      return url;
  }

  /**
  *
  * @desc - Get only the args needed for ecSummary
  * @param {String} endowedChairId - api results
  * @return {Object} - endowedChairId in an object
  *
  **/
    getEndowedChairSummaryDataAPIArgs(endowedChairId) {
      return {endowedChairId: endowedChairId};
  }
  /**
  *
  * @desc - Check if user can edit EC
  * @param {Object} adminData - has edit resource
  * @return {Object} - can edit ec
  *
  **/
  canEditEndowedChair() {
    let {resourceMap} = this.adminData;
    let accessGranted = false;
    if(resourceMap[editEndowedChairConstants.name]
        && resourceMap[editEndowedChairConstants.name].action === editEndowedChairConstants.action) {
        accessGranted = true;
    }
    return  accessGranted;
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

  isOAOrAPO(){
    return this.Permissions.isOAOrAPO();
  }

     /******************************************************************************
 *
 * @desc - Modal functions and components
 *
 ******************************************************************************/
    getValidationFields = () => {
      return endowedChairValidationFields;
    }

    getModalErrorMessage = () => {
      return modalErrorMessage;
    }

    getErrorMessage = () => {
      return "This cannot be blank on save.";
    }
      /**
  *
  * @desc - Get grouperPathText from adminData via profile constants
  * @param {Object} adminData -
  * @return {String} grouperPathText -
  *
  **/
  getGrouperPathText(adminData) {
    const permissions_text = endowedChairConstants.view_permissions;
    const permissions = adminData.resourceMap[permissions_text];
    const grouperPathText = permissions.formattedGrouperPathTexts;

    return grouperPathText;
  }

  getEndowedChairObject = (endowedChairStatusId) => {
    let {access_token} = this;
    let url = constants.urls.newEndowedChairObjectUrl;
    url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
    url = `${url}&endowedChairStatusId=${endowedChairStatusId}`;
    let resultsPromise = util.fetchJson(url);
    return resultsPromise;
}

  /**
  *
  * @desc - Get comments from backend
  * @param {String} primaryKeyValue - adminCompId
  * @param {Object} access_token - get Comments
  * @return {Promise} - Promise to be resolved in comments
  *
  **/
    getEndowedChairComments = async (primaryKeyValue, {access_token} = this)  => {
        let url = constants.urls.getEndowedChairCommentsURL({primaryKeyValue, access_token});
        let comments = await util.getJson(url);
        return comments;
    }

   /**
   *
   * @desc - Search unit
   * @param {Promise}  - promise
   *  OPUSDEV-3487 Added access_token, grouperPathText
   *
   **/
   async onSearchUnit(value) {
    let {access_token} = this;
    //Get grouperPathText to pass to the search url
    const grouperPathText = this.getGrouperPathText(this.adminData);

    let unitSearchUrl = "/restServices/rest/admincomp/unitSearch/"+value.toString();
    unitSearchUrl = this.addAccessTokenAndGrouperToUrl(unitSearchUrl, access_token,
      {grouperPathText, addGrouper: true});
    let resultsPromise = util.fetchJson(unitSearchUrl);
    return resultsPromise;
  }

  // Save Functions
    /**
   *ss
   * @desc - add url and parameters
   * @param {Object}  - addData
   * OPUSDEV-3487 Added access_token, grouperPathText, and loggedInOpusId
   *
   **/
    async saveEndowedChairData(adminCompInfo) {
      let {grouperPathText, access_token, adminData} = this;
      let loggedInOpusId = adminData.adminOpusId;
      console.log("save endowed chair data being sent to backend:");
      console.log(adminCompInfo);

      let stringified = JSON.stringify(adminCompInfo);
      let saveUrl = constants.urls.saveUrl;
      saveUrl = this.addAccessTokenAndGrouperToUrl(saveUrl, access_token,
        {grouperPathText, addGrouper: false});
      saveUrl = saveUrl+"&loggedInUserId="+loggedInOpusId
      // IOK-49 Added logged in user first name and last name to populate email content
        +"&loggedFirstName="+adminData.adminFirstName+"&loggedLastName="+adminData.adminLastName;
      console.log("Save Endowed Chair URL:");
      console.log(saveUrl);

      return util.jqueryPostJson(saveUrl, stringified);
  }

  /**
  *
  * @desc - Get add comment url from backend for both proposed and approved
  * @return {Promise} - json request
  *
  **/
    getAddEndowedChairCommentUrl({access_token} = this) {
        return constants.urls.addEndowedChairCommentsURL({access_token});
    }

  /**
  *
  * @desc - Save comment to backend
  * @param {Object} commentsText - String text
  * @param {Object} primaryKeyValue - adminComp from backend
  * @param {Object} commentAPIData - Previously created comment if not new
  * @return {Promise} - json request
  *
  **/
    getSaveCommentArgs(commentsText, primaryKeyValue) {

        let commentUrl = this.getAddEndowedChairCommentUrl();

        return {entityKeyColumnValue: primaryKeyValue, commentUrl};
    }

    /**
    *
    * @desc - Save comment to backend
    * @param {Object} commentsText - String text
    * @param {Object} entityKeyColumnValue - adminCompId
    * @param {Object} commentAPIData - Previously created comment if not new
    * @return {Promise} - json request
    *
    **/
     formatSaveEnddowedChairCommentTemplate(commentsText, entityKeyColumnValue, commentAPIData = {}) {
         let {adminData: {adminOpusId}} = this;

         let template = {
             commentsText,
             endowedChairId: entityKeyColumnValue,
             loggedInUserName: adminOpusId
         };
         return template;
     }

  /**
  *
  * @desc - Save comment to backend
  * @param {Object} commentsText - String text
  * @param {Object} adminCompSummaryData - adminCompSummary from backend
  * @param {Object} commentAPIData - Previously created comment if not new
  * @return {Promise} - json request
  *
  **/
    async saveEndowedChairComment(commentsText, endowedChairSummaryData = {}) {

        let {access_token, adminData, grouperPathText} = this;
        let loggedInOpusId = adminData.adminOpusId;
        // let args = this.getSaveCommentArgs(commentsText, endowedChairSummaryData);
        // let {entityKeyColumnValue} = args;
        // let commentUrl = this.getAddEndowedChairCommentUrl();

        let commnetTemplate = this.formatSaveEnddowedChairCommentTemplate(commentsText, endowedChairSummaryData);

        let stringified = JSON.stringify(commnetTemplate);
        let saveUrl = constants.urls.addEndowedChairCommentsURL;
        saveUrl = this.addAccessTokenAndGrouperToUrl(saveUrl, access_token,
          {grouperPathText, addGrouper: false});
        saveUrl = saveUrl+"&loggedInUserId="+loggedInOpusId;
        console.log("Endowed Chair comments sent to back:");

        let didSaveComment = await util.jqueryPostJson(saveUrl, stringified);

        return didSaveComment;
    }
}
