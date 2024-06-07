//My imports
import Opus from "../../../common/classes/Opus";
import {urls, reviewProcessTemplate, messages} from "../../constants/review-process/ReviewProcessConstants";
import {stringNotBlank} from "../../../common/helpers/validations";

import Permissions from "../../../common/modules/Permissions";
import * as util from "../../../common/helpers/";

/*******************************************************************************
*
* @desc - Class dealing with Review Process page and its functionality
*
*******************************************************************************/
export default class ReviewProcess extends Opus {
  /**
   *
   * @desc - Class Variables
   *
   **/
    Permissions = null;

    constructor({adminData, access_token, globalData} = {}) {
        super({adminData, access_token, globalData});
        this.initReviewProcess({adminData, access_token, globalData});
        this.Permissions = new Permissions(adminData);
    }

    initReviewProcess({adminData, access_token, globalData}) {
    //Set this data in this Logic file for easy use
        this.setClassData({adminData, access_token, globalData});
    }

  /**
  *
  * @desc - Is it opusAdmin or apoDirector
  * @param {Object} adminData - adminData
  * @return {Boolean} - if its viewable by being and opusAdmin or apo director
  *
  **/
    isOAOrAPO() {
        let {isOA, isAPO, isAPOAdmin} = this.Permissions;
        let isOAOrAPO = isOA || isAPO || isAPOAdmin;
        console.log(isOAOrAPO);
        return isOAOrAPO;
    }
 
  /**
  *
  * @desc - Is it SchoolAdmin or DepartmentAdmin
  * @param {Object} adminData - adminData
  * @return {Boolean} - if its viewable by being and SchoolAdmin or DepartmentAdmin
  *
  **/
    isSAOrDA() {
        let {isSA, isDA, isDivisionAdmin, isAA, isSpecAdmin} = this.Permissions;
        let isSAOrDA = isSA || isDA || isDivisionAdmin || isAA || isSpecAdmin;
        console.log(isSAOrDA);
        return isSAOrDA;
    }

  /**
  *
  * @desc - Figure out if the case already exists in Interfolio
  * @param {Object} opusCaseInfo - contains the bycPacketId and packetTypeId
  * @return {boolean} - boolean representing if the case exists in Interfolio
  *
  **/
    hasExistingCaseInByC({opusCaseInfo = {}, ...options} = {}) {
        let {bycPacketId, packetTypeId} = opusCaseInfo;
        return bycPacketId && packetTypeId ? true : false;
    }

  /**
   * @desc - Get the associated templates for this case
   * @param {String} bycUnitId - the bycUnitId
   * @param {String} url - the url
   * @returns {Object} templates
   **/
    getTemplates({bycUnitId = null,...options} = {},
    url = urls.getTemplates, {access_token} = this) {
        return util.fetchJson(url + access_token, {unitId: bycUnitId});
    }

  /**
   *
   * @desc - Get ByC unitId
   * @param {Object} actionDataInfo - actionDataInfo object
   * @return {String} bycUnitId
   *
   **/
    getByCUnitId({actionDataInfo = [], ...options} = {}) {
        let {length} = actionDataInfo;
        let bycUnitId = null;
        if (length === 1) {
            bycUnitId = actionDataInfo[0].appointmentInfo.academicHierarchyInfo.byCUnitId;
        }
        else {
            actionDataInfo.map(actionData => {
                if (actionData.appointmentInfo.affiliationType.affiliation === "Primary") {
                    bycUnitId = actionData.appointmentInfo.academicHierarchyInfo.byCUnitId;
                }
            });
        }

        return bycUnitId;
    }

  /**
   *
   * @desc - Unlink Interfolio case
   * @param {Integer} caseId - case ID
   * @param {String} user - user
   * @param {String} prependUrl - for testing purposes
   * @return {Promise}
   *
   **/
    unlinkInterfolioCase({caseId = null, user = null, prependUrl = ""} = {}) {
        let unlinkParams = {caseId, user};
        let url = this.formatUnlinkCaseUrl(unlinkParams, prependUrl);
        let unlinkCasePromise = util.postJson(url);
        return unlinkCasePromise;
    }

  /**
  *
  * @desc - Check to see if packetID entered is valid
  * @param {String} packetID - The user entered packetID
  * @param {String} prependUrl - prepend URL if needed
  * @return {Object} - Returns an object representing the person if valid
  *
  **/
    async checkPacketID(packetID, prependUrl = "") {
        let url = this.getCheckPacketIDUrl(packetID, prependUrl);
        let result = await util.fetchJson(url);
        return result;
    }

  /**
  *
  * @desc - Get check packetID url with access_token
  * @param {String} packetID - The user entered packetID
  * @param {String} prependUrl - prepend URL if needed
  * @param {Number} access_token - access_token
  * @return {String} - the url
  *
  **/
    getCheckPacketIDUrl(packetID, prependUrl = "", {access_token} = this) {
        return prependUrl + urls.getPacketIDInfo({packetID, access_token});
    }

  /**
   * @desc - update the case in opus
   * @param {Object} reviewProcessTemplate - review process template
   * @return {Promise} - json request
   **/
    updateCaseInOpus({reviewProcessTemplate = null, access_token = null,
    url = urls.updateCaseInOpus} = {}) {
        return util.jqueryPostJson(url + access_token, JSON.stringify(reviewProcessTemplate));
    }

  /**
  *
  * @desc - Determine if packetID entered was valid
  * @param {string} casePackeId - mergeOpusId flag
  * @return {boolean} - true/false if packetID is valid or not
  *
  **/
  // getValidPacketID(bycPacketId) {
  //   let invalid = {null: true, '': true};
  //   let packetIDResult = bycPacketId in invalid ? false : true;
  //   return packetIDResult;
  // }

  /**
  *
  * @desc - Determine what the status text should display
  * @param {boolean} packetInfo - packetInfo object
  * @return {String} - Status text
  *
  **/
    getPacketIDStatusText(packetInfo) {
        let statusText = "";
        if (packetInfo.bycPacketId === null) {
            statusText = "There are no packets with that ID in Interfolio.";
        } else {
            statusText = "Packet ID " + packetInfo.bycPacketId + " is associated with " + packetInfo.fullName + ". This packet is " + packetInfo.packetStatus + " in Interfolio. If this is correct, click the Submit button.";
        }


        return statusText;
    }

  /**
  *
  * @desc - Extract packetInfo
  * @param {Object} result - Result of checkPacketID function
  * @return {Object} - packetInfo object
  *
  **/
  // getPacketInfo(result) {
  //   return result.packetInfo || {};
  // }

  /**
   *
   * @desc - Format unlink URL
   * @param {Object} unlinkParams - all unlink parameters
   * @param {String} prependUrl - for testing purposes
   * @return {String} url - the URL
   *
   **/
    formatUnlinkCaseUrl(unlinkParams = {}, prependUrl) {
        let {access_token} = this;
        let args = util.jsonToUrlArgs({access_token, ...unlinkParams});
        let unlinkCasesUrl = prependUrl + urls.unlinkInterfolioCase;
        let url = `${unlinkCasesUrl}${args}`;
        return url;
    }

  /**
   * @desc - Save the case in ByC
   * @param {Object} reviewProcessTemplate - review process template
   * @return {Promise} - json request
   **/
    saveCaseInByC({reviewProcessTemplate = null, access_token = null,
    url = urls.saveCaseInByC} = {}) {
        return util.jqueryPostJson(url + access_token, JSON.stringify(reviewProcessTemplate));
    }

  /**
   * @desc - Format template
   * @param {Object} invalid - invalid options
   * @return {Object} - save template
   **/
    formatTemplateForSaveCaseInByC({selectedTemplate = "", selectedTemplateDisplayText = "",
    selectedPacketTypeName = "", selectedExistingBycCase = "", linkWithExistingCase = false,
    bycUnitId = null, appointeeInfo = {}, caseId = null, bycPacketId = null, adminName = "", emailFieldStatus} = {},
    invalid = {null: true, undefined: true}) {
        let newReviewProcessTemplate = util.cloneObject(reviewProcessTemplate);

    //Accomodate both paths - can come from either choosing a new template, or selecting
    //an existing ByC case to link to
        let newTemplateId = null;
        let newPacketTypeId = null;
        let newBycPacketId = bycPacketId;
        if (!(selectedTemplate in invalid)) {
      //Then we are creating a new ByC case from the selected template
            [newTemplateId, newPacketTypeId] = selectedTemplate.split("-");
        }
        else if (!(selectedExistingBycCase in invalid)) {
      //Then we are tying to an existing ByC case
            [newBycPacketId, newPacketTypeId] = selectedExistingBycCase.split("-");
        }

        newReviewProcessTemplate = {
            template: {
                templateId: newTemplateId,
                packetTypeId: newPacketTypeId,
                packetTypeName: selectedPacketTypeName,
                templateName: selectedTemplateDisplayText
            },
            tieWithExistingCase: linkWithExistingCase,
            appointeeInfo,
            bycUnitId,
            caseId,
            bycPacketId: newBycPacketId,
            adminName,
            emailFieldStatus
        };
        console.log(newReviewProcessTemplate);
        return newReviewProcessTemplate;
    }

  /**
   * @desc - Format template
   * @param {Object} invalid - invalid options
   * @return {Object} - save template
   **/
    formatTemplateForUpdateCaseInOpus({caseId = null, bycPacketId = null, bycPacketTypeId = null,
    adminName = null, bycCaseCreateDt} = {},
    invalid = {null: true, undefined: true}) {
        let newReviewProcessTemplate = util.cloneObject(reviewProcessTemplate);

        newReviewProcessTemplate = {
            caseId,
            bycPacketId,
            bycPacketTypeId,
            adminName,
            bycCaseCreateDt
        };
        console.log(newReviewProcessTemplate);
        return newReviewProcessTemplate;
    }



  /**
  *
  * @desc - validates if email is blank
  * @param {String} email - entered email
  * @return {Boolean} - boolean value if email is blank or not
  *
  **/
    validateIfEmailIsBlank(email){
        let isValid = stringNotBlank(email, true);
        isValid.message = messages.blankEmailError;
        return isValid;
    }

  /**
  *
  * @desc - gets the promise to validate if email is unique and valid
  * @param {String} email - entered email
  * @return {Promise} - promise with get url
  *
  **/
    getEmailValidationPromise = async (email, opusPersonId) => {
        let {access_token, adminData: {adminName: user}} = this;
        let args = util.jsonToUrlArgs({access_token, user, emailId: email, opusPersonId});
        let url = `${urls.emailValidationURL}${args}`;
        let uniqueEmailPromise = util.fetchJson(url);
        return uniqueEmailPromise;
    }

  /**
  *
  * @desc - Too lazy to import proposed fields constants file to proposed fields modal file
  * @return {Object} - object of email error messages
  *
  **/
    getEmailErrorMessages(){
        let emailErrorMessagesObject = {
            isNotUnique: messages.uniqueEmailError,
            isInvalid: messages.invalidEmailError,
            isBlank: messages.blankEmailError
        };
        return emailErrorMessagesObject;
    }

}
