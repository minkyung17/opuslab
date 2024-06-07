import Cases from '../datatables/classes/Cases';
import {postJson, jsonToUrlArgs} from '../common/helpers/index';
import {urls as casesConstants} from '../cases/constants/CasesConstants'
/******************************************************************************
 * Cases
 *
 * @desc - Handles all the logic for the Active and Completed cases section
 *
 ******************************************************************************/
export default class DeleteOrWithdrawCase extends Cases {
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

  formatActionsLinkedToByCCase(actions){
    let splitData = actions.split('|');
    splitData = splitData.join(",").split(',');
    let linkedActions = []
    for(let i = 0; i<splitData.length; i+=4){
      let splitDataObject = {
        action: splitData[i],
        effectiveDate: splitData[i+1],
        proposedEffectiveDate: splitData[i+2],
        status: splitData[i+3]
      }
      linkedActions.push(splitDataObject);
     }
     return linkedActions;
  }

  /**
   *
   * @desc - get the DeleteOrWithdrawCase parameters and leave them in an object
   * @param {Object} rowData - specific persons rowData
   * @return {Object} args - arguments needed for call
   *
   **/
  retrieveDeleteOrWithdrawCaseParameters(rowData = {},
    DeleteOrWithdrawCaseInterfolioCaseSelection, DeleteOrWithdrawSelection, comments) {
    let bycId = '';
    if(DeleteOrWithdrawCaseInterfolioCaseSelection==="yes"){
      bycId = rowData.originalData.bycPacketId;
    }
    let {originalData: {caseId}} = rowData;
    return {caseId, bycPacketId: bycId, typeOfReq: DeleteOrWithdrawSelection};
  }

  /**
   *
   * @desc -
   * @param {Object} deleteOrWithdrawCaseParams - data for specific person
   * @return {String} - full delete or withdraw url
   *
   **/
  formatDeleteOrWithdrawCaseUrl(deleteOrWithdrawCaseParams = {}, comments) {
    let {access_token, adminData: {adminName: user, adminFirstName:userFirstName}} = this;
    let args = jsonToUrlArgs({access_token, user, userFirstName, comments, ...deleteOrWithdrawCaseParams});
    let {deleteOrWithdrawCaseUrl} = this.dataTableConfiguration;
    if(!deleteOrWithdrawCaseUrl) {
      deleteOrWithdrawCaseUrl = casesConstants.deleteOrWithdrawCaseUrl;
    }
    let url = `${deleteOrWithdrawCaseUrl}${args}`;
    return url;
  }

  /**
   *
   * @desc
   * @param {Object} rowData - formatted url with all args for deleting or withdrawing
   * @param {String} DeleteOrWithdrawInterfolioCaseSelection - string indicating if deleting/withdrawing interfolio case ("yes" or "no")
   * @param {String} DeleteOrWithdrawSelection - string indicating if deleting or withdrawing ("delete" or "withdraw")
   * @return {Promise} deleteOrWithdrawCasePromise - promise request
   *
   **/
  deleteOrWithdrawCase(rowData = {}, DeleteOrWithdrawInterfolioCaseSelection, DeleteOrWithdrawSelection, comments) {
    let deleteOrWithdrawParams = this.retrieveDeleteOrWithdrawCaseParameters(rowData,
      DeleteOrWithdrawInterfolioCaseSelection, DeleteOrWithdrawSelection);
    let url = this.formatDeleteOrWithdrawCaseUrl(deleteOrWithdrawParams, comments);
    let deleteOrWithdrawCasePromise = postJson(url);
    return deleteOrWithdrawCasePromise;
  }

}
