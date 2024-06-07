import {actionTypesCloseableBySA, actionTypesConditionallyCloseableBySABySeriesAndRank,
  actionTypesCloseableByDA, actionTypesCloseableByDASA, actionTypesConditionallyCloseableBySAByActionType,
  seriesCloseableBySA, seriesAndRanks} from "../../cases/constants/CasesConstants";
import Permissions from "./Permissions";
import * as ActionCategoryType from "../../cases/constants/ActionCategoryType";


/**
*
* @classdesc Allows certain permissions to complete and reopen cases
* @author - Moses Jung
* @class CasesAdminPermissions
*
**/
export default class CasesAdminPermissions extends Permissions {

  /**
  *
  * @desc - Get multiple permissions we use to make more permissions
  * @param {Object} adminData - adminData
  * @return {Object} - object w/ isOAOrAPO, isSchAdmin, caseIsCompleted
  *
  **/
    getFieldPermissionArgs(adminData = this.adminData) {
    //Is it school administrator
        let {isSA, isLibrarySA, isDA, isVCAP, isCAP, isAA, isChair, isDivisionAdmin} = this;

    //Do we have a globally viewable role like is Opus Admin or Admin Director
        let isOAOrAPO = this.isOAOrAPO(adminData);

        return {isOAOrAPO, isSchAdmin: isSA, isLibrarySchAdmin: isLibrarySA,
      isDeptAdmin: isDA, isVCAP, isCAP, isAreaAdmin: isAA, isChair, isSA, isDivisionAdmin};
    }

  /**
  *
  * @desc - Permissions for seeing the Case button if your role is
  * SA (for certain actions), OA, or APO
  * @param {Object} actionDataInfo -
  * @param {Object} adminData -
  * @return {Boolean} hideCaseButton - Permission saying if case button is hidden
  *
  **/
    getCaseButtonPermissions(actionDataInfo = {}, adminData = this.adminData) {
    // Find out the actionCategoryId and actionTypeId from actionDataInfo
        let {actionTypeInfo: {actionCategoryId, actionTypeId}} = actionDataInfo;
        let actionType = `${actionCategoryId}-${actionTypeId}`;

    //Extract if you are an OA or APO, school admin
        let {isOAOrAPO, isSchAdmin, isLibrarySchAdmin, isDeptAdmin} = this.getFieldPermissionArgs(adminData);
        let isRegularSA = isSchAdmin && !isLibrarySchAdmin;
        let isDASA = false;
        let isClosableByDASA = false;

        if (isRegularSA || isDeptAdmin) {
      // if(true){
            let isClosableBySA = false;
            let isClosableByDA = false;
            isDASA = true;

      //Get series and rank info
            let {proposedAppointmentInfo: {titleInformation: {series}}} = actionDataInfo;
            let {proposedAppointmentInfo: {titleInformation: {rank: {rankTypeDisplayText: rank}}}}
        = actionDataInfo;

      // Both DA and SA conditions:
            isClosableByDASA = this.closeableConditionallyForDASA(actionType, series);

      // SA Specific Conditions:
            if(!isClosableByDASA && isRegularSA){
        //Basic check to see if the case is closable by an SA
                isClosableBySA = actionType in actionTypesCloseableBySA;

        //Do extra exception logic if the actionType happens to be one where an SA
        //can close the case based upon certain series and ranks 
        // 12/7/2022 IOK-547 or by action type
                if (!isClosableBySA && actionType in actionTypesConditionallyCloseableBySABySeriesAndRank) {
                  let isConditionallyCloseableBySA = this.closeableConditionallyBySeriesAndRank(actionType, series, rank);
                  isClosableBySA = isConditionallyCloseableBySA;
                }else if(!isClosableBySA && actionType in actionTypesConditionallyCloseableBySAByActionType){
                  let isConditionallyCloseableBySA = this.closeableConditionallyByActionType(actionType, series, rank);
                  isClosableBySA = isConditionallyCloseableBySA;
                }

      // DA Specific Conditions:
            }else if(!isClosableByDASA){
        //Basic check to see if the case is closable by an DA
                isClosableByDA = actionType in actionTypesCloseableByDA;
            }


            if(isClosableBySA || isClosableByDA){
                isClosableByDASA = true;
            }
        }

        let hideCaseButton = !(isOAOrAPO || isLibrarySchAdmin || (isDASA && isClosableByDASA));

        return hideCaseButton;
    }

  /**
  *
  * @desc - BRule-119 DAs & SAs can close Emeritus appointments
  * @desc - Tests if an action type is closeable for a DA or SA role based upon series
  * @param {String} actionType -
  * @param {String} series -
  * @param {String} rank -
  * @return {Boolean} isConditionallyCloseableByDASA - Permission saying if case is closeable
  *
  **/
    closeableConditionallyForDASA(actionType, series){
        let invalid = {null: true, "": true};
        if (series in invalid) {
      //Return immediately
            return false;
        }
        let isClosableByDASA = actionType in actionTypesCloseableByDASA;
        let isConditionallyCloseableByDASA = false;
        if(isClosableByDASA && series==="Emeritus"){
            isConditionallyCloseableByDASA = true;
        }
        return isConditionallyCloseableByDASA;
    }

  /**
  *
  * @desc - Tests if an action type is closeable for an SA role based upon series/rank
  * @param {String} actionType -
  * @param {String} series -
  * @param {String} rank -
  * @return {Boolean} isCloseable - Permission saying if case is closeable
  *
  **/
    closeableConditionallyBySeriesAndRank(actionType, series, rank) {
        let invalid = {null: true, "": true};
        let isCloseable = false;

        if (series in invalid && rank in invalid) {
      //Return immediately
            return false;
        }
        if (actionType === ActionCategoryType.JOINT_APPOINTMENT) {
            if (rank in seriesAndRanks.assistantRank) {
                isCloseable = true;
            }
        }
        if (actionType === ActionCategoryType.APPOINTMENT) {
            if (series in seriesAndRanks.visitingSeries || rank
        in seriesAndRanks.instructorRank || (series in seriesAndRanks.special
          && rank in seriesAndRanks.assistantRank)) {
                isCloseable = true;
            }
        }
        return isCloseable;
    }

     /**
  *
  * @desc - Tests if an action type is closeable for an SA role based upon action type
  * @param {String} actionType -
  * @param {String} series -
  * @param {String} rank -
  * @return {Boolean} isCloseable - Permission saying if case is closeable
  *
  **/
      closeableConditionallyByActionType(actionType, series, rank) {
        let invalid = {null: true, "": true};
        let isCloseable = false;

        if (series in invalid && rank in invalid) {
      //Return immediately
            return false;
        }
        if (actionType === ActionCategoryType.PROMOTION) {
            if (series in seriesCloseableBySA) {
                isCloseable = true;
            }
        }
        return isCloseable;
    }
}
