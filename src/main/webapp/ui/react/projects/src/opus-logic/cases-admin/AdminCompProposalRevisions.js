import Cases from '../datatables/classes/Cases';
import {postJson, jsonToUrlArgs} from '../common/helpers/index';
import * as util from "../common/helpers";
import {constants} from '../cases/constants/admin-comp-summary/AdminCompSummaryConstants.js'
import { string } from 'prop-types';
/******************************************************************************
 * 
 *
 * @desc - RE-498 Admin Comp Proposal Revisions Logic
 *
 ******************************************************************************/
export default class AdminCompProposalRevisions extends Cases {
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
   * @desc - RE-498
   * @param {Object} clonedAdminCompSummaryData - specific persons clonedAdminCompSummaryData
   * @return {Boolean} boolean value that determines if they can see the edit icon for the revision modal
   *
   **/
  canReviseProposal(clonedAdminCompSummaryData) {
    let canReviseProposal = false;
    if(clonedAdminCompSummaryData.acPropComp && 
      // Can only revise if OA or APO:
      (this.CasesAdminPermissions.isOA || this.CasesAdminPermissions.isAPO || this.CasesAdminPermissions.isAPOAdmin)
      ){
        canReviseProposal = true;
      }
    return canReviseProposal;
  }


  /**
   *
   * @desc - RE-498
   * @param {Object} clonedAdminCompSummaryData - specific persons clonedAdminCompSummaryData
   * @return {Boolean} boolean value that determines if they can open the revision modal
   *
   **/
  canOpenRevisionModal(clonedAdminCompSummaryData) {
    let canOpenRevisionModal = false;
    if(clonedAdminCompSummaryData.acPropComp && 
      // Can only open modal if status is Submitted (2) or Under Review (3):
      (clonedAdminCompSummaryData.acPropComp.statusId === 2 || clonedAdminCompSummaryData.acPropComp.statusId === 3)
      ){
        canOpenRevisionModal = true;
      }
    return canOpenRevisionModal;
  }


  /**
   *
   * @desc - get the reopenCase parameters and leave them in an object
   * @param {Object} rowData - specific persons rowData
   * @return {Object} args - arguments needed for call
   *
   **/
  retrieveRevisionParameters() {
    let {adminData} = this;
    let loggedInOpusId = adminData.adminOpusId;
    let loggedFirstName = adminData.adminFirstName;
    let loggedLastName = adminData.adminLastName;
    let loggedEmail = adminData.adminEmail;
    return {loggedInOpusId, loggedFirstName, loggedLastName, loggedEmail};
  }

  /**
   *
   * @desc -
   * @param {Object} reopenCaseParams - data for specific person
   * @return {String} - full reopen url
   *
   **/
  formatRevisionUrl(reviseParams = {}) {
    let {access_token} = this;
    let args = jsonToUrlArgs({...reviseParams});
    let reviseUrl = constants.urls.saveACProposalRevisionUrl;
    reviseUrl = this.addAccessTokenAndGrouperToUrl(reviseUrl, access_token,
      {addGrouper: false});
    let url = `${reviseUrl}&${args}`;
    return url;
  }

  /**
   *
   * @desc
   * @param {Object} rowData - formatted url with all args for reopen
   * @return {Promise} reopenCasePromise - promise request
   *
   **/
  async saveRevision(clonedAdminCompSummaryData = {}, revisionData) {
    if(revisionData.comments!==""){
      clonedAdminCompSummaryData.acPropComp.comments = revisionData.comments;
    }
    let reviseParams = this.retrieveRevisionParameters();
    let url = this.formatRevisionUrl(reviseParams);
    let apiObject = {
      adminCompProposalId: clonedAdminCompSummaryData.acPropComp.adminCompProposalId,
      comments: clonedAdminCompSummaryData.acPropComp.comments,
      emplName: clonedAdminCompSummaryData.acPropComp.emplName,
      titleCodeDescription: clonedAdminCompSummaryData.acPropComp.titleCodeDescription,
      organizationName: clonedAdminCompSummaryData.acPropComp.organizationName,
    }
    let stringified = JSON.stringify(apiObject);
    // console.log(url)
    // console.log(apiObject)
    return util.jqueryPostJson(url, stringified);
  }

}
