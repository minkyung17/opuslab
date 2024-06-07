import CaseFlow from './CaseFlow';
import {urls, constants} from '../../constants/CasesConstants';
import * as util from '../../../common/helpers/';

export default class Recruit extends CaseFlow {
  /**
  *
  * @desc - Search based on job number
  * @param {String} jobNumber - Job number
  * @param {String} prependUrl - prepend URL if needed
  * @return {Object} - Job search results
  *
  **/
  async searchJobNumber(jobNumber, prependUrl = '') {
    let args = this.getJobSearchAPIArgs(jobNumber);
    let url = this.getJobSearchUrl(prependUrl);
    let data = await util.jqueryPostJson(url, args);
    return data;
  }

  /**
  *
  * @desc - Get job search url with access_token
  * @param {String} prependUrl - prepend URL if needed
  * @param {Number} access_token - access_token
  * @return {String} - the url
  *
  **/
  getJobSearchUrl(prependUrl = '', {access_token} = this) {
    return prependUrl + urls.getRecruitNames + access_token;
  }

  /**
  *
  * @desc - Get only the args needed for jobSearch
  * @param {String} jobNumber - jobNumber
  * @return {String} - the arguments for jobSearch
  *
  **/
  getJobSearchAPIArgs(jobNumber, {adminData} = this) {
    let adminDataClone = util.cloneObject(adminData);
    delete adminDataClone.adminDepartments;
    let args = JSON.stringify({adminData: adminDataClone, jobNumber});
    return args;
  }

  /**
  *
  * @desc - Format job results
  * @param {Object} results - The initial unformatted job search results
  * @return {Object} - Formatted results
  *
  **/
  getFormattedJobSearchResults(results) {
    let nameToDataOptions = util.arrayOfObjectsToObjectByKey(results, 'fullName');
    return nameToDataOptions;
  }

  /**
  * @desc - Determine instruction text for modal
  * @param {Object} results - Initial job search results (could be formatted
  * or not depending on the calling function)
  * @return {String} - Recruit instruction text
  *
  **/
  getRecruitInstructionText(results) {
    let recruitInstructionText = results.length > 0
      ? 'Please choose a person:' :
      'No results for this job number.';
    return recruitInstructionText;
  }

  /**
  *
  * @desc - Check to see if UID entered is valid
  * @param {String} uid - The user entered UID
  * @param {String} prependUrl - prepend URL if needed
  * @return {Object} - Returns an object representing the person if valid
  *
  **/
  async checkUID(uid, prependUrl = '') {
    let url = this.getCheckUIDUrl(uid, prependUrl);
    let result = await util.fetchJson(url);
    return result;
  }

  /**
  *
  * @desc - Get check UID url with access_token
  * @param {String} uid - The user entered UID
  * @param {String} prependUrl - prepend URL if needed
  * @param {Number} access_token - access_token
  * @return {String} - the url
  *
  **/
  getCheckUIDUrl(uid, prependUrl = '', {access_token} = this) {
    return prependUrl + urls.getUIDInfo({uid, access_token});
  }

  /**
  *
  * @desc - Extract appointeeInfo
  * @param {Object} result - Result of checkUID function
  * @return {Object} - appointeeInfo object
  *
  **/
  getAppointeeInfo(result) {
    return result.appointeeInfo || {};
  }

  /**
  *
  * @desc - Determine if UID entered was valid
  * @param {string} mergeOpusId - mergeOpusId flag
  * @return {boolean} - true/false if UID is valid or not
  *
  **/
  getValidUID(mergeOpusId) {
    let invalid = {null: true, '': true};
    let uidResult = mergeOpusId in invalid ? false : true;
    return uidResult;
  }

  /**
  *
  * @desc - Determine what the status text should display
  * @param {boolean} uidResult - uidResult boolean
  * @return {String} - Status text
  *
  **/
  getUIDStatusText(uidResult) {
    let statusText = uidResult ? 'UID found' :
      `We have no record of an Opus appointment with this UID. Opus will
      associate this UID with the appointment you\'re creating for integration with
      other campus systems.`;
    return statusText;
  }

  /**
  *
  * @desc - Call the function in the Cases superclass to get the appointment details
  * @param {Object} appointmentInfo - appointmentInfo
  * @return {Object} - The appointment blocks
  *
  **/
  getAppointmentBlocks(appointmentInfo) {
    return this.getDisplayFieldsFromAppointments(appointmentInfo);
  }
}
