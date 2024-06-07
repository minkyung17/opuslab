import Cases from '../datatables/classes/Cases';
import {postJson, jsonToUrlArgs} from '../common/helpers/index';
import {urls as casesConstants} from '../cases/constants/CasesConstants'
/******************************************************************************
 * Cases
 *
 * @desc - Handles all the logic for the Active and Completed cases section
 *
 ******************************************************************************/
export default class ReopenCase extends Cases {
  startingDataTableConfiguration = null;

  /**
   *
   * @desc - init class with datatable params
   * @param {Object} args - config for class
   * @return {void}
   *
   **/
  constructor(args = {}) {
    super(args);
  }


  /**
   *
   * @desc - get the reopenCase parameters and return a true or false
   * Jira #2828, 2890 Made changes in condition
   * @param {Object} actionDataInfo - specific persons actionDataInfo
   * @return {Boolean} boolean value that determines if they can reopen a case
   *
   **/
  reopenCasePermissions(actionDataInfo = {}) {
    let canReopenCase = false;
    // If case is completed (both numbers being 2), then you can reopen the case
    if(actionDataInfo.actionStatusId === 2){
      canReopenCase = true;
    }else if(actionDataInfo.actionStatusId === 3){
      canReopenCase = true;
    }
    return canReopenCase;
  }


  /**
   *
   * @desc - get the reopenCase parameters and leave them in an object
   * @param {Object} rowData - specific persons rowData
   * @return {Object} args - arguments needed for call
   *
   **/
  retrieveReopenCaseParameters(rowData = {}, reopenInterfolioCaseSelection,
  userComment) {
    let bycId = '';
    if(reopenInterfolioCaseSelection==="yes"){
      bycId = rowData.originalData.bycPacketId;
    }
    let uc = '';
    if(userComment && userComment.length>0){
      uc = userComment;
    }
    let {originalData: {caseId}} = rowData;
    return {caseId, bycPacketId: bycId, userComment: uc};
  }

  /**
   *
   * @desc -
   * @param {Object} reopenCaseParams - data for specific person
   * @return {String} - full reopen url
   *
   **/
  formatReopenCaseUrl(reopenCaseParams = {}) {
    let {access_token, adminData: {adminName: user}} = this;
    let args = jsonToUrlArgs({access_token, user, ...reopenCaseParams});
    let {reopenCasesUrl} = this.dataTableConfiguration;
    if(!reopenCasesUrl) {
      reopenCasesUrl = casesConstants.reopenCaseUrl;
    }
    let url = `${reopenCasesUrl}${args}`;
    return url;
  }

  /**
   *
   * @desc
   * @param {Object} rowData - formatted url with all args for reopen
   * @return {Promise} reopenCasePromise - promise request
   *
   **/
  reopenCase(rowData = {}, ReopenInterfolioCaseSelection, userComment) {
    let reopenParams = this.retrieveReopenCaseParameters(rowData, ReopenInterfolioCaseSelection, userComment);
    let url = this.formatReopenCaseUrl(reopenParams);
    let reopenCasePromise = postJson(url);
    return reopenCasePromise;
  }

}
