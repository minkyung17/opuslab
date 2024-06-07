import {keys, set} from "lodash";


import CaseSummary from "./CaseSummary";
import ProposedFields from "./ProposedFields";
import * as util from "../../../common/helpers/";
import {fieldsInAPI} from "../../constants/FieldDataConstants";
import {constants} from "../../constants/case-summary/CaseSummaryConstants";
import {urls, constants as caseConstants} from "../../constants/CasesConstants";
import {finalDecisionValidations} from
  "../../constants/case-summary/CaseSummaryFieldDataValidations";

/**
*
* @classdesc Saves Comments, saves and completes cases
* @author - Leon Aburime
* @class FinalDecision
* @extends CaseSummary
*
**/
export default class FinalDecision extends CaseSummary {
    approvedFields = {
        caseLocation: {},
        finalDecision: {},
        finalDecisionMain: {},
        finalDecisionPopup: {}
    }
    validateFieldNames = finalDecisionValidations;
    Proposed = null;

  /**
  *
  * @desc - Adds input data to class
  * @param {Object} - input args
  * @return {void}
  *
  **/
    constructor({adminData, globalData, access_token, ...args} = {}) {
        super({adminData, globalData, access_token, ...args});

        this.Proposed = new ProposedFields({adminData, globalData, access_token});
        this.setClassData({adminData, globalData, access_token});
    }

  /**
  *
  * @desc -  Creates fields, copies them for table and starts, sets in state
  * @param {Object} caseSummaryDataFromAPI -
  * @return {void}
  *
  **/
    initFinalDecisionFromAPIData(caseSummaryDataFromAPI) {
    //Format this class's validations and toggles based on actionType
        this.configureClassFromActionType(
      caseSummaryDataFromAPI.actionDataInfo[0].actionTypeInfo);

        let fieldData = this.createFinalDecisionFieldsFromCaseSummaryAPIData(
      caseSummaryDataFromAPI);

    //Key actionDataInfo by appointmentId
        let {actionDataInfo, casesProposedAttrMap, opusCaseInfo} = caseSummaryDataFromAPI;

        let proposedStatusFieldsByApptId = this.createProposedStatusFields(
      actionDataInfo, casesProposedAttrMap);

        this.editVisibilityOfMainFieldsByActionOutcomeStatus(fieldData);

    //TODO delete after refactor and Sonys attribute fixes
        let actionDataInfoByApptId = this.keyActionDataByApptId(actionDataInfo);
        this.updateFieldsByIdOnStart_special(actionDataInfoByApptId,
      fieldData.finalDecisionByApptId);

    //Clone these fields so table data isnt updating alongside modalData
        let tableData = util.cloneObject(fieldData);

    //Need pristine fieldData from which to draw from later on
        let startingFieldData = util.cloneObject(fieldData);

    //Get completed case status
        let showCompleteCaseButton = this.showCompleteCaseButton(actionDataInfo[0]);

    //Get action type display text to show in the modal
        let {actionTypeDisplayText} = actionDataInfo[0].actionTypeInfo;

        let caseCommentCount = opusCaseInfo.caseCommentCount;

    //Get appt display data and fields to show in the modal
        let apptIdsForCase = this.getApptIdsForCase(caseSummaryDataFromAPI, "caseSummary");
        let unarchivedAppts = this.getActiveApptsFromCasesData(caseSummaryDataFromAPI.apptDetailsList.appointmentInfo);
        let apptBlockData = this.AppointmentBlock.getDisplayFieldsFromAppointmentsForDisplayLayout(apptIdsForCase, unarchivedAppts);
        let endowedChairData = actionDataInfo[0].endowedChairInfo;

        let endowedChairBlockData = this.EndowedChairBlock.getDisplayFieldsFromEndowedChairForDisplayLayout(endowedChairData);

    //BA's will want tables to show up in order of affiliation
        let actionDataSortedByAffiliation = this.sortActionDataByAffiliationTypeId(
      actionDataInfo);

    //Making it apparent what fields were created
        let {finalDecisionMain, finalDecisionByApptId, finalDecisionPopup} = fieldData;

        return {fieldData, startingFieldData, showCompleteCaseButton, actionTypeDisplayText,
      finalDecisionMain, finalDecisionByApptId, finalDecisionPopup, apptBlockData, endowedChairBlockData,
      actionDataSortedByAffiliation, tableData, actionDataInfoByApptId, caseCommentCount,
      proposedStatusFieldsByApptId};
    }


  /**
  *
  * @desc - Creates proposedFields and runs the toggles on start
  * @param {Array} actionDataInfo - array of actionData
  * @param {Object} casesProposedAttrMap -
  * @return {Object} proposedStatusByApptId - proposed fields keyed by appt id
  *
  **/
    createProposedStatusFields(actionDataInfo, casesProposedAttrMap) {
        let proposedStatusByApptId = this.Proposed.createProposedStatusFieldDataByApptId(
      actionDataInfo, casesProposedAttrMap);

        let actionDataInfoByApptId = this.keyActionDataByApptId(actionDataInfo);

        this.Proposed.updateProposedFieldsByIdOnStart_special(actionDataInfoByApptId,
      proposedStatusByApptId);

        return proposedStatusByApptId;
    }

  /**
  *
  * @desc - Returns if action outcome is disapproved. If it is you should not
  * show final decision status fields in popup
  * @param {Object} actionOutcome -
  * @param {Object} appointment - appointment from backend
  * @return {Boolean} - if value in action outcome equals the value associated
  *   with "Disapproved"
  *
  **/
    isActionOutcomeDisapproved(actionOutcome = {}, {disapprovedOutcomeOptions} = constants) {
        let isActionOutcomeDisapproved = false;
        for(let each in disapprovedOutcomeOptions){
            if(Number(actionOutcome.value) === disapprovedOutcomeOptions[each].value){
                isActionOutcomeDisapproved = true;
                break;
            }
        }
        return isActionOutcomeDisapproved;
    }

  /**
  *
  * @desc - Fields should be hidden if the actionOutcome is disapproved except
  *   if actionType is "8 Year Limit Prelim Assessment"
  *   or "8 Yr Limit Reconsideration "
  * @param {Object} actionOutcome -
  * @param {Object} actionData - appointment from backend
  * @param {Object} showFieldsInActionType - If actionOutcome is disapproved
  *   I should show the fields instaed of hiding them like I regularly do
  * @return {Boolean} shouldHideFields - whether we should hide the fields if
  *   actionOutcome is disapproved
  *
  **/
    shouldFinalStatusFieldsBeHiddenByActionOutcomeStatus(actionOutcome = {}, actionData,
    showFieldsInActionType = {"3-23": "8 Year Limit Prelim Assessment",
      "3-24": "8 Year Limit Reconsideration"}) {
        let shouldHideFields = this.isActionOutcomeDisapproved(actionOutcome);
        let actionType = this.getActionTypeFromActionData(actionData);

        if(actionType in showFieldsInActionType) {
            shouldHideFields = !shouldHideFields;
        }

        return shouldHideFields;
    }

  /**
  *
  * @desc - All fields should be hidden except "approvedEffectiveDate" and
  *   "approvedOutcome"
  * @param {Object} actionOutcome -
  * @param {Object} fieldData -
  * @param {Object} alwaysShowFields -
  * @return {Boolean} shouldHideFields - whether we should hide the fields if
  *   actionOutcome is disapproved
  *
  **/
    editFieldPropsByOutcomeStatus(actionOutcome, fieldData, alwaysShowFields = {
        approvedEffectiveDate: true, approvedOutcome: true}) {
    //If actionOutcome is disapproved fields should NOT be visible
        let outcomeIsDisapproved = this.isActionOutcomeDisapproved(actionOutcome);
        let fieldsAreVisible = !outcomeIsDisapproved;

    //Hide fields if "fieldIsVisible" is false & field isnt in "alwaysShowFields"
        for(let name in fieldData) {
            if(name in alwaysShowFields) {
                continue;
            }

            fieldData[name].visibility = fieldsAreVisible;
        }

        return fieldData;
    }

  /**
  *
  * @desc - The frustration I have with arbitrarily hiding these random fields
  *   for no good reason and the subsequent problems they cause is gonna make
  *   me explode
  * @param {Object} allFields - Holds all three sets of fields
  * @return {Object} allFields
  *
  **/
    editVisibilityOfMainFieldsByActionOutcomeStatus(allFields = {}) {
    //May need to hide fields that are not "approvedOutcome" or "approvedEffectiveDate"
        let {finalDecisionMain, finalDecisionPopup, finalDecisionPopup: {approvedOutcome}}
      = allFields;
    //Must hide all fields except approvedOutcome and effectiveData if approvedOutcome
    //is disapproved
        this.editFieldPropsByOutcomeStatus(approvedOutcome, finalDecisionPopup);
        this.editFieldPropsByOutcomeStatus(approvedOutcome, finalDecisionMain,
      {approvedOutcomeName: true, approvedEffectiveDateName: true});

        return allFields;
    }

  /**
  *
  * @desc - Get comments from backend
  * @param {Object} id - String text
  * @param {Object} args -
  * @return {Promise} - json request
  *
  **/
    async getCommentsById(id, ...args) {
        let comments = await super.getCommentsById(id, ...args);
        return comments;
    }

  /**
  *
  * @desc - Get actionType text to actionTypeCode
  * @param {Object} outCome - Outcome fieldData
  * @param {Object} actionDataInfo - 2-7, 3-1, etc
  * @return {Object} outCome - actionType number representation
  *
  **/
    addOutcomeOptionList(outCome, actionDataInfo) {
    //Get actionType to decide with which outcome list to use
        let actionType = this.getActionTypeFromActionData(actionDataInfo);

    //Extract outcome list
        let {actionTypesToOutcomeSortedOptions} = this.formattedCommonCallLists;

    //Match up actionTypeOutcome list to outcome field
        outCome.options = actionTypesToOutcomeSortedOptions[actionType];

        return outCome;
    }

  /**
   *
   * @desc - Get visible versions of finalDecision, finalDecisionMain, and
   *  finalDecisionPopup
   * @param {Object} finalDecisionMain -
   * @param {Object} finalDecisionPopup -
   * @param {Object} finalDecisionByApptId -
   * @return {Object}
   *
   **/
  // getVisibleFinalDecisionFields({finalDecisionMain, finalDecisionPopup, finalDecisionByApptId}
  //   = {}) {
  //   //Get only visible fields from finalDecisionMain
  //   let visibleFinalDecisionMain = this.getVisibleFieldData(finalDecisionMain);
  //
  //   //Get only visible fields from finalDecisionPopup
  //   let visibleFinalDecisionPopup = this.getVisibleFieldData(finalDecisionPopup);
  //
  //   //Get only visible fields from finalDecisionPopup
  //   let visibleFinalDecisionByApptId = this.getVisibleFieldDataOfObject(
  //     finalDecisionByApptId);
  //
  //   return {visibleFinalDecisionMain, visibleFinalDecisionPopup, visibleFinalDecisionByApptId};
  // }

  /**
   *
   * @desc - Create all the fields finalDecision, finalDecisionMain, and
   *  finalDecisionPopup
   * @param {Object} caseSummaryDataFromAPI - Main case summary data straight
   *  from API
   * @return {Object}
   *
   **/
    createFinalDecisionFieldsFromCaseSummaryAPIData(caseSummaryDataFromAPI = {}) {
        let {casesApprovedAttrMap, actionDataInfo} = caseSummaryDataFromAPI;

    //Create the blank fields from the attribute properties
        let finalDecisionFields = this.createApprovedFieldsFromAttrProps(casesApprovedAttrMap);

    //Extract the main three fields
        let {finalDecision, finalDecisionMain, finalDecisionPopup} = finalDecisionFields;

    //Create main or "body" fields by appointmentID
        let finalDecisionByApptId = this.getFinalDecisionFieldsByApptIdFromActionData(
      finalDecision, actionDataInfo);

    //Get data from actionDataInfo and overlay it onto finalDecisionMain
        this.formatFinalDecisionDataByActionData(finalDecisionMain, actionDataInfo[0]);

    //Get data from actionDataInfo and overlay it onto finalDecisionMain
        this.formatFinalDecisionDataByActionData(finalDecisionPopup, actionDataInfo[0]);

    //Add outcome options decided by actionType
        this.addOutcomeOptionList(finalDecisionPopup.approvedOutcome, actionDataInfo[0]);

        // IOK-596 Need a count value to correctly set multiple locations from actionDataInfo
        let count = 0;
        for(let each in finalDecisionByApptId){
      // RE-319 Find salary effective date dropdown options
            this.addSalaryEffDateOptions(finalDecisionByApptId[each], caseSummaryDataFromAPI);

      // Find N/A Value in Step for lecturer series reference data changes
            this.checkStepValueForLecturerSeries(actionDataInfo[0], finalDecisionByApptId[each], "approved");

            // Find multiple locations
            this.setMultipleLocations(finalDecisionByApptId[each], actionDataInfo[count], "caseSummary", "approved");

            // IOK-1064 For endowed chair cases, toggle visibility to false for endowed chair name search
            if(finalDecisionByApptId[each].endowedChair && finalDecisionByApptId[each].endowedChair.visibility){
                finalDecisionByApptId[each].endowedChair.visibility = false;
            }
            count++;
        }

    //Now return all these fields
        return {finalDecisionMain, finalDecisionPopup, finalDecisionByApptId};
    }

  /**
   *
   * @desc - Create new fields from from approved attributed propoeries
   * @param {Object} casesApprovedAttrMap - attribute map for approved fields
   * @param {Object} fieldNames - specific names in case not all fields are needed
   * @return {Object} this.approvedFields - fields that were created
   *
   **/
    createApprovedFieldsFromAttrProps(casesApprovedAttrMap = {}, fieldNames =
    keys(casesApprovedAttrMap)) {
    //Create the actual fields
        let approvedStatusFields = this.FieldData.createFieldDataByAttributeProperties(
      casesApprovedAttrMap, {fieldNames, fieldDataOptions: fieldsInAPI});

    //Separate fields - Case Location & Final Decision and FD table
        for(let field in approvedStatusFields) {
      //Extract sectionName to separate fields by
            let {sectionName} = approvedStatusFields[field].attributeProperties;

      //Set this field in specific section by its sectionName
            this.approvedFields[sectionName][field] = approvedStatusFields[field];
        }

        return this.approvedFields;
    }

  /**
   *
   * @desc - Clone finalDecision fields for each actionDataInfo
   * @param {Object} finalDecision - blank finalDecision fields
   * @param {Object} actionDataInfo - actionData from which to get info
   * @return {Object} finalDecisionByApptId - final decision fields keyed by apptId
   *
   **/
    getFinalDecisionFieldsByApptIdFromActionData(finalDecision, actionDataInfo) {
        return this.getFieldsByApptIdFromActionData(finalDecision, actionDataInfo);
    }

  /**
   *
   * @desc - Clone finalDecision fields for each actionDataInfo
   * @param {Object} fieldData - blank finalDecision fields
   * @param {Object} actionDataInfo - actionData from which to get info
   * @return {Object} fieldDataByApptId - final decision fields keyed by apptId
   *
   **/
    getFieldsByApptIdFromActionData(fieldData, actionDataInfo) {
    //Create final decision fields and copy them for each appointment by ID
        let fieldDataByApptId = {};

    //Iterate through the actionData to create the fields
        for(let actionData of actionDataInfo) {
      //Clone the fields for each appointment
            let clonedFinalDecision = util.cloneObject(fieldData);

      //Get appointmentId to key fieldDataFields by
            let {appointmentId} = actionData.appointmentInfo;

      //Add values to fieldData fields from actionData
            fieldDataByApptId[appointmentId] = this.formatFinalDecisionDataByActionData(
        clonedFinalDecision, actionData);
        }

        return fieldDataByApptId;
    }

  /**
   *
   * @desc - Add values from actionDataInfo appointment to fieldData
   * @param {Object} finalDecision - final decision fields
   * @param {Object} actionDataInfo - single appointment with which to get data
   * @return {Object} this.approvedFields - fields that were created
   *
   **/
    formatFinalDecisionDataByActionData(finalDecision, actionDataInfo) {
    //Add display values and fieldData values to finalDecision
        this.addValuesToFieldData(finalDecision, actionDataInfo);

    //If percent or money add that symbol
        this.reformatDisplayValuesBasedOnViewType(finalDecision);

    //Add value or 'select' options
        this.addOptionsListToFieldData(finalDecision, this.formattedCommonCallLists);

    //After adding titleCode then add step options from titleCode's value
        this.addStepOptionsByTitleCodeValue(finalDecision, this.formattedCommonCallLists);

    //Hide step if options are basically blank
        this.FieldDataToggle.updateStepVisibilityIfOptionsAreBlankAndNA(finalDecision);

    //Lets update the endowedChairType
        this.FieldDataToggle.updateFieldDataByEndowedChairType(finalDecision, "finalDecision");

    //Let's update the apu, if applicable
        let {aHPathIdsToDeptCode} = this.formattedCommonCallLists;
        let {approvedAppointmentInfo, appointmentInfo: currentAppointmentInfo} = actionDataInfo;
        let deptCode = this.getDeptCodeForAPUList(aHPathIdsToDeptCode, approvedAppointmentInfo, currentAppointmentInfo);

        this.FieldDataToggle.updateCasesAPUOptionsFromGlobalData(finalDecision, deptCode, this.formattedCommonCallLists);

    //Get default values for affiliation
        let actionType = this.getActionTypeFromActionData(actionDataInfo);

        this.handleJointSplitAffiliationException(finalDecision, actionType);

        this.formatFinalDecisionStatusFields(finalDecision, actionDataInfo, actionType);

        return finalDecision;
    }

    formatFinalDecisionStatusFields(statusFields = {}, actionDataInfo, actionType) {
    //let {titleCode} = statusFields;
        if(!statusFields.titleCode) {
            return;
        }

    //Take care of multiple exception cases
        let {proposedAppointmentInfo} = actionDataInfo;
        this.editFieldsForActionTypeExceptions(statusFields, proposedAppointmentInfo,
      actionType, actionDataInfo);
    }

  /**
  *
  * @desc - Check if final decision fields have errors
  * @param {Object} finalDecisionPopup - popup fields at the top of UI generally
  * @param {Object} finalDecisionByApptId - Fields by different appt ids
  * @param {Object} actionDataInfo - actionDataInfo object
  * @return {Bool} hasErrors - will return true if any field has an error
  *
  **/
    doFinalDecisionFieldsHaveErrors(finalDecisionPopup, finalDecisionByApptId,
    actionDataInfo = {}) {
    //Do top action fields have errors
        let hasErrors = this.doFieldsHaveErrors(finalDecisionPopup);

    //Do we validate finalDecisionApptId fields?
        let {approvedOutcome} = finalDecisionPopup;
        let fieldsAreHidden = this.shouldFinalStatusFieldsBeHiddenByActionOutcomeStatus(
      approvedOutcome, actionDataInfo);

    //If outcome is disapproved dont validate the bottom rows
        if(fieldsAreHidden) {
            return hasErrors;
        }

    //Do status fields have errors? && = 'and' to find out
        for(let [, fieldData] of Object.entries(finalDecisionByApptId)) {
            hasErrors = hasErrors || this.doFieldsHaveErrors(fieldData);
        }

    //Return if all fields have passed validations
        return hasErrors;
    }


  /**
  *
  * @desc - Create and format template for Profile Save
  * @param {Object} allFieldData - appointment to send to API
  * @param {Object} validateFieldNames - key value pair of fieldName to validation
  *  type.
  * @return {Object} allFieldData - fieldData
  *
  **/
    validateAllFieldDataOnSave(allFieldData = {}) {
        super.validateAllFieldDataOnSave(allFieldData, this.validateFieldNames);
        return allFieldData;
    }

  /**
  *
  * @desc - Create and format template for Profile Save
  * @param {Object} fieldData - appointment to send to API
  * @param {Object} validateFieldNames - validations specific to finalDecision
  * @return {Object} allFieldData - fieldData
  *
  **/
    validateFieldOnUpdate(fieldData = {}, validateFieldNames = this.validateFieldNames) {
        super.validateFieldOnUpdate(fieldData, validateFieldNames);
        return fieldData;
    }

  /**
  *
  * @desc - validate FieldData OnBlur
  * @param {Object} allFieldData - appointment to send to API
  * @param {Object} validateFieldNames - validations specific to finalDecision
  * @return {Object} fieldData - fieldData
  *
  **/
    validateFieldOnBlur(fieldData = {}, validateFieldNames = this.validateFieldNames) {
        super.validateFieldOnBlur(fieldData, validateFieldNames);
        return fieldData;
    }

  /**
  *
  * @desc - Check if final decision fields have errors
  * @param {Object} finalDecisionByApptId - Fields by different appt ids
  * @return {Bool} hasErrors - will return true if any field has an error
  *
  **/
  // validateFinalDecisionByApptIdFields(finalDecisionByApptId) {
  //   //Do status fields have errors? && = 'and' to find out
  //   return super.validateKeyedFieldsOnSave(finalDecisionByApptId);
  // }

  /**
  *
  * @desc - Set values of approved fields from proposed fields. Usually from
  *   prepopulate button; OPUSDEV-2475
  * @param {Object} approvedFields - Fields by different appt ids
  * @param {Object} proposedFields - Fields by different appt ids
  * @return {Object} approvedFields -
  *
  **/
    setApprovedValuesFromProposedFieldData(approvedFields = {}, proposedFields = {}) {
        for(let name in proposedFields) {
      //Extract fields from proposedFields
            let {value, editable, visibility, options, optionsInfo} = proposedFields[name];

      //Now overlay them onto finalDecision
            Object.assign(approvedFields[name], {value, editable, visibility, options,
        optionsInfo});
        }
        this.formatSalaryException(approvedFields);
        return approvedFields;
    }

  /**
  *
  * @desc - Set values of effective date, years accelerated, years deferred
  *   approved fields from proposed fields from
  *   prepopulate button
  * @param {Object} approvedFields - Fields by different appt ids
  * @param {Object} proposedFields - Fields by different appt ids
  * @return {Object} approvedFields -
  *
  **/
    setFinalDecisionPopUpValuesFromProposedFieldData(caseSummaryDataFromAPI = {}, approvedFields = {}) {

        if(approvedFields.approvedEffectiveDate){
            approvedFields.approvedEffectiveDate.value = caseSummaryDataFromAPI.actionDataInfo[0].proposedEffectiveDt;
        }
        if(approvedFields.approvedYearsAcceleratedCnt){
            approvedFields.approvedYearsAcceleratedCnt.value = caseSummaryDataFromAPI.actionDataInfo[0].proposedYearsAcceleratedCnt;
        }
        if(approvedFields.approvedYearsDeferredCnt){
            approvedFields.approvedYearsDeferredCnt.value = caseSummaryDataFromAPI.actionDataInfo[0].proposedYearsDeferredCnt;
        }

        return approvedFields;
    }

  /**
  *
  * @desc - Handles the exception case for when salary is null.  Reset to blank
  * so that the value on prepopulate will clear.  OPUSDEV-2327
  * @param {Object} approvedFields - Fields by different appt ids
  * @return {Object} approvedFields -
  *
  **/
    formatSalaryException(approvedFields) {
        if (!approvedFields.salary) {
            return approvedFields;
        }
        let invalidValues = {null: true, undefined: true};
        if (approvedFields.salary.value in invalidValues) {
            approvedFields.salary.value = "";
        }
        return approvedFields;
    }

  /**
  *
  * @desc - Get the message to show for errors
  * @param {Boolean} fieldsHaveErrors - if fields have errors
  * @param {Boolean} commentIsValid - if comment is valid
  * @return {String} - message if there is an error
  *
  **/
    getErrorMessage(fieldsHaveErrors, commentIsValid) {
        let errorMessage = null;

        if(fieldsHaveErrors) {
            errorMessage = "Sorry, there was a problem. Please check the form for errors.";
        } else if(!commentIsValid) {
            errorMessage = "Please add a comment to save.";
        }

        return errorMessage;
    }

  /**
  *
  * @desc - Get comments args
  * @param {Object} commentsPage - args to make salary call
  * @return {Object} - args to make salary call
  *
  **/
    getSaveCommentArgs() {
    //Extract header information
        let {saveOptions: {urlEncodedHeaders}} = caseConstants;

    //Format comment url with access_token
        let commentUrl = urls.addComment(this.access_token);

    //Return all args for save
        return {commentUrl, urlEncodedHeaders, screenName: "case"};
    }

  /**
  *
  * @desc - Get comments args
  * @param {Object} commentsText - String text
  * @param {Object} caseId - appointment from backend
  * @param {Object} commentAPIData - Previously created comment if not new
  * @return {Object} - args to make salary call
  *
  **/
    async saveComments(commentsText, caseId, commentAPIData = {}) {
        let {commentUrl, urlEncodedHeaders, screenName} = this.getSaveCommentArgs();

        let template = this.formatSaveCommentTemplate(commentsText, caseId, screenName);
        return util.jqueryPostJson(commentUrl, template, urlEncodedHeaders);
    }

  /**
  *
  * @desc - Comment is valid if there is text. But if its saveComplete dont need
  *   commentsText
  * @param {Object} commentsText - String text
  * @param {Object} saveCompleted - default if finalDecision is completed
  * @return {Booloean} - tells if comment is valid
  *
  **/
    isCommentValid(commentsText = "", {saveCompleted = false} = {}) {
    //Force to boolean to get comment status. Is false for "falsey" values
        let isCommentValid = !!commentsText;

    //If completeCase comment status irrelevant. If not return isCommentValid
        let validateComment = saveCompleted ? isCommentValid : true;

    //Return boolean
        return validateComment;
    }


  /**
  *
  * @desc - Set outcome and outcome text name
  * @param {Object} fieldDataOutcome - outcome from fieldData
  * @param {Object} actionDataOutcome - outcome in actionsData
  * @param {Object} actionType - '2-7', 3-1', etc
  * @return {Object} actionDataOutcome - reformatted actionDataOutcome
  *
  **/
    setFinalDecisionOutComeData(fieldDataOutcome, actionDataOutcome, actionType) {
    //Extract value of approvedOutcome and rename it code
        let {value: code} = fieldDataOutcome;

    //Set it to outCome thats in actionData template
        actionDataOutcome.code = code;

    //Get Hash to use to use to map code to text name
        let {actionTypesToOutcomeOptions} = this.formattedCommonCallLists;
        let actionOutcomeName = actionTypesToOutcomeOptions[actionType][code];

    //Set name 'Approved', 'Disapproved' etc
        actionDataOutcome.name = actionOutcomeName;

    //Return
        return actionDataOutcome;
    }

  /**
  * @desc - Add opusCase and actionData constants actionsDataTemplate
  * @param {Object} actionsDataTemplate - template to be saved
  * @param {Object} caseId - caseId from url
  * @param {Object} saveType - saveActive, saveComplete, or completeCase
  * @return {Object} actionsDataTemplate - reformatted actionDataOutcome
  *
  **/
    addSaveConstantsToDataTemplate(actionsDataTemplate, {caseId, saveType}, opusCaseInfo) {
    //Static constants that are always the same
        let opusCase = this.getOpusCaseSaveConstants(saveType);

    //Constants that need
        let actionDataFunc = this.getActionDataSaveFunc(saveType);

    //RE-473 Made exception to include boxFolderId, userFolderId and bycPacketId to send to backend on save
        actionsDataTemplate.opusCase = {...opusCase, caseId, boxFolderId: opusCaseInfo.boxFolderId,
      userFolderId: opusCaseInfo.userFolderId, bycPacketId: opusCaseInfo.bycPacketId};

    //Save constants for each actionDataInfo
        for(let eachActionData of actionsDataTemplate.actionsData) {
            let actionDataConstants = actionDataFunc(eachActionData);
            Object.assign(eachActionData, actionDataConstants);
        }

        return actionsDataTemplate;
    }

  /**
  *
  * @desc - Get Opus Case Save Constants for this save type
  * @param {Object} saveType - saveActive, saveComplete, or completeCase
  * @return {Object} opusCaseConstants - isNewCase, isTrackingDatesChanged,
  *   isDeptDatesChanged
  *
  **/
    getOpusCaseSaveConstants({saveActive, saveCompleted, completeCase} = {}) {
        let {opusCase} = constants.finalDecisionSaveConstants;
        let opusCaseConstants = {};

    //Get constants by selecting the saveType
        if(saveActive) {
            opusCaseConstants = opusCase.saveActive;
        } else if(saveCompleted) {
            opusCaseConstants = opusCase.saveCompleted;
        } else if(completeCase) {
            opusCaseConstants = opusCase.completeCase;
        }

        return opusCaseConstants;
    }


  /**
  *
  * @desc - Get Opus Case Save Constants for this save type
  * @param {Object} saveType - saveActive, saveComplete, or completeCase
  * @return {Object} opusCaseConstants - pageName, sectionName, rowStatusId,
  *   actionStatusId
  *
  **/
    getActionDataSaveFunc({saveActive, saveCompleted, completeCase} = {}) {
        let {actionDataFunc} = constants.finalDecisionSaveConstants;
        let invokeActionDataFunc = null;
        if(saveActive) {
            invokeActionDataFunc = actionDataFunc.saveActive;
        } else if(saveCompleted) {
            invokeActionDataFunc = actionDataFunc.saveCompleted;
        } else if(completeCase) {
            invokeActionDataFunc = actionDataFunc.completeCase;
        }

        return invokeActionDataFunc;
    }

  /**
  *
  * @desc - Takes whatever path you get and attaches 'approvedAppointmentInfo.'
  *   to the it for save
  * @param {String} path - proposedStatus fieldData keyed by apptId
  * @return {String} -
  *
  **/
    getReformattedFinalDecisionPathForSave(path) {
        return path.replace("appointmentInfo.", "approvedAppointmentInfo.");
    }

  /**
  *
  * @desc - In some cases such as when actionOutcome is disapproved we may want
  *   to wipe values of all fields that are editable
  * @param {Object} fieldData -
  * @param {Any} wipeValue - default value that if its not editable set value as
  *   "wipeValue"
  * @return {Object} fieldData -
  *
  **/
    wipeValuesOfEditableFields(fieldData = {}, wipeValue = null) {
        for(let name in fieldData) {
            if(fieldData[name].editable === true) {
                fieldData[name].value = wipeValue;
            }
        }
        return fieldData;
    }

  /**
  *
  * @desc - For saving final decision fields must make sure the path in attribute
  *   properties has 'approvedAppointmentInfo' at the beginning
  * @param {String} fieldData - proposedStatus fieldData keyed by apptId
  * @param {Object} actionData - actionType to use to get attribute properties
  * @return {Object} actionData -
  *
  **/
    addStatusFieldsToActionData(fieldData, actionData) {
    //Set values from fieldData into actionData by path in statusCaseFields
        for(let name in fieldData) {
            let {attributeProperties: {pathToFieldValue}} = fieldData[name];

      //Format 'approvedAppointmentInfo' onto the beginning of this path
            let approvedPath = this.getReformattedFinalDecisionPathForSave(pathToFieldValue);

      //Set value in the template from the new reformatted path
            set(actionData, approvedPath, fieldData[name].value);
        }
        return actionData;
    }

  /**
   *
   * @desc - Change title code using title code id
   * @param {Object} fieldData -
   * @param {Object} actionData -
   * @return {Object} actionData
   *
   **/
    setTitleCode(fieldData, actionData){
        let value = fieldData.titleCode.value;
        let options = fieldData.titleCode.options;
        for(let each in options){
            if(options[each][value]){
                actionData.approvedAppointmentInfo.titleInformation.titleCode = options[each][value];
                break;
            }
        }
        return actionData;
    }

  /**
  *
  * @desc - Format template for all actionDatas that are keyed by apptId
  * @param {String} fieldDataByApptId -
  * @param {Object} fieldDataMain -
  * @param {Object} actionDataInfo - actionType to use to get attribute properties
  * @return {Object} - object with {actionsData, appointeeInfo, loggedInUserInfo}
  *
  **/
    formatFinalDecisionTemplate(fieldDataByApptId, fieldDataMain, actionDataInfo = [],
    {opusCaseInfo, appointeeInfo, commentsText: userComments} = {}) {

        let actionDataInfoByApptId = this.keyActionDataByApptId(actionDataInfo);
        let actionsData = [];

    //Dont want values saving if theyre not visible
        this.wipeValuesOfInvisibleFieldData(fieldDataMain);

        let isActionOutcomeDisapproved = this.isActionOutcomeDisapproved(
      fieldDataMain.approvedOutcome);

        for(let apptId in actionDataInfoByApptId) {
      //Get fieldData for each appointment
            let fieldData = fieldDataByApptId[apptId];

      //Get each actionData
            let actionDataById = actionDataInfoByApptId[apptId];

      //Dont want values saving if theyre not visible
            this.wipeValuesOfInvisibleFieldData(fieldData);

      // OPUSDEV-2688: If actionOutcome is disapproved wipe editable fields
      // unless action is 8 Year Lmt Prelim/Assess & 8 Year Lmt Recon
            let actionCategoryId = actionDataById.actionTypeInfo.actionCategoryId;
            let actionTypeId = actionDataById.actionTypeInfo.actionTypeId;
            let wipeEditableFields = true;
            if(actionCategoryId===3 && (actionTypeId===23 || actionTypeId===24)){
                wipeEditableFields = false;
            }
            if(isActionOutcomeDisapproved && wipeEditableFields) {
                this.wipeValuesOfEditableFields(fieldData);
            }

      //Setting step to zero must be AFTER "wipeValuesOfInvisibleFieldData"
            this.editStepValueByVisibility(fieldData);

      //Create actionDataTemplate
            let actionData = this.formatActionDataTemplate(actionDataById, opusCaseInfo,
        {sectionName: "approved"});

      //Add Status fields actionData template
            this.addStatusFieldsToActionData(fieldData, actionData);

      //Extract the appointment to format
            let {approvedAppointmentInfo} = actionData;

      //Add AHPathId and departmentCode
            this.addAHPathAndDeptCodeToAppointment(fieldData, approvedAppointmentInfo);

      //Add the ApudId to "salaryInfo"
            this.addApuCodeToApptByFieldDataApuId(fieldData, approvedAppointmentInfo);

      //Setting APUId to 0 and APUCode to N/A must be AFTER "addApuCodeToApptByFieldDataApuId"
            this.editAPUValueByVisibility(fieldData, approvedAppointmentInfo);

      // Removed as of Jira #3122
      // Clear apuDesc
      // this.wipeApuDesc(actionData, 'case-summary-approved');

      //Add Popup (top section non apptId)fields actionData template
            this.addFieldValuesToActionData(fieldDataMain, actionData);

      //Add only visible fields actionData template. This is for scaleType as its
      //overwritten by the disabled or invisible hscpScale0-9
            this.addVisibleFieldValuesToActionData(fieldData, actionData);

      //Set Outcome
            let actionType = this.getActionTypeFromActionData(actionDataById);
            this.setFinalDecisionOutComeData(fieldDataMain.approvedOutcome,
        actionData.approvedActionOutcome, actionType);

      //Add comment to actionsData template
            actionData.userComments = userComments;

        // Set multiple location fields
        // OPUSDEV-4238 Only when outcome is not disapproved
            if(!isActionOutcomeDisapproved){
                this.setLocationForSave(fieldData, approvedAppointmentInfo);
            }else{
                this.wipeLocationFields(approvedAppointmentInfo);
            }

      //Sets scale type id to -1 if not editable and visible #scaleTypeId=-1
      // Jira #3048 #3050
            if(fieldData.scaleType && !fieldData.scaleType.visibility){
                actionData.approvedAppointmentInfo.salaryInfo.academicProgramUnit.scaleTypeId = -1;
            }

            // jira OPUSDEV-4108
            let offScalePercentValue = actionData.approvedAppointmentInfo.salaryInfo.offScalePercent;
            if (offScalePercentValue !== null) {
                if (offScalePercentValue.toString().includes("%")) {
                    actionData.approvedAppointmentInfo.salaryInfo.offScalePercent = offScalePercentValue.substr(0, offScalePercentValue.length - 1);
                }
            }

            // IOK-1115 fields are called proposedTermEndDate and approvedTermEndDate in the API but called termEndDate for both fields in the ui
            if(fieldData.termEndDate && fieldData.termEndDate.visibility){
                actionData.approvedTermEndDate = fieldData.termEndDate.value;
            }

      //Add to array to save
            actionsData.push(actionData);
        }

    //Create loggedInUserInfo
        let loggedInUserInfo = this.populateLoggedInUserInfoWithAdminData();

    //Format and return  approved status template
        return {actionsData, appointeeInfo, loggedInUserInfo};
    }

    wipeLocationFields = (approvedAppointmentInfo) => {
        for(let each of [1,2,3,4,5] ){
            let locNum = each.toString();
            // let fdLocation = fieldData["locationDisplayText"+locNum];
            approvedAppointmentInfo["locationId"+locNum] = 0;
            approvedAppointmentInfo["locPercentTime"+locNum] = null;
        }
        return approvedAppointmentInfo;
    }

  /**
  *
  * @desc - Get save case url
  * @return {String} - formatted completeCase url w/ access_token attached
  *
  **/
    getSaveCaseUrl() {
        return caseConstants.urls.saveCase + this.access_token;
    }

  /**
  *
  * @desc - Gets formatted url w/ access_token to complete the case
  * @return {String} - formatted completeCase url w/ access_token attached
  *
  **/
    getCompleteByCCaseUrl() {
        return constants.urls.completeCaseCloseByCPacket + this.access_token;
    }

  /**
  *
  * @desc -
  * @param {Object} fieldDataByApptId -
  * @param {Object} fieldDataMain -
  * @param {Object} actionDataInfo -
  * @param {Object} - multiple data needs and save parameters
  * @return {Promise} -
  *
  **/
    saveFinalDecision(fieldDataByApptId, fieldDataMain, actionDataInfo = [],
    {caseId, opusCaseInfo, appointeeInfo, commentsText, saveType} = {}) {
    //Create approvedStatusTemplate
        let approvedStatusTemplate = this.formatFinalDecisionTemplate(fieldDataByApptId,
      fieldDataMain, actionDataInfo, {opusCaseInfo, appointeeInfo, commentsText});

    //Add save constants depending on saveType
        this.addSaveConstantsToDataTemplate(approvedStatusTemplate, {caseId, saveType}, opusCaseInfo);

    //Must stringify template before sending for save
        let stringifiedTemplate = this.stringify(approvedStatusTemplate);

    //Getting save case url with the access token
        let url = this.getSaveCaseUrl();

    //Print this for devs who want to check code
        console.log("Final Decision template for Save", approvedStatusTemplate);

    //Send off the promise
        return util.jqueryPostJson(url, stringifiedTemplate);
    }

  /**
  *
  * @desc - Save current case and then complete the case
  * @param {Object} opusCaseInfo - opusCaseInfo from caseSummaryDataFromAPI
  * @return {Promise} - promise from save
  *
  **/
    async completeCase(opusCaseInfo = {}) {
    //Get closeCaseUrl, stringify template, send to API
        let closeCaseUrl = this.getCompleteByCCaseUrl();

    //Stringify the template
        let stringifiedOpusCaseInfo = this.stringify(opusCaseInfo);

    //Get the promise
        return util.jqueryPostJson(closeCaseUrl, stringifiedOpusCaseInfo);
    }

  /**
  *
  * @desc - Save current case and then complete the case if applicable
  * @param {Object} finalDecision -
  * @param {Object} finalDecisionPopup -
  * @param {Object} actionDataInfo -
  * @param {Object} - multiple data needs and save parameters
  * @return {Promise} - promise from save
  *
  **/
    async saveFinalDecisionBySaveType(finalDecision, finalDecisionPopup, actionDataInfo,
    {saveType, opusCaseInfo, ...options}) {
    //Save appointment via actionDataInfo and return promise
        let savePromise = this.saveFinalDecision(finalDecision, finalDecisionPopup,
      actionDataInfo, {saveType, opusCaseInfo, ...options});

    //Wait for promise to resolve then then completeCase
        if(saveType.completeCase) {
            await savePromise;

            savePromise = this.completeCase(opusCaseInfo);
        }

        return savePromise;
    }

    copyLocationValuesForPrepopulate = (fd, proposed) => {
        for(let each of [1,2,3,4,5]){
            let fdLoc = fd["locationDisplayText"+each.toString()];
            let propLoc = proposed["locationDisplayText"+each.toString()];
            if(each===1){
                fdLoc.totalPercentTime = propLoc.totalPercentTime;
            }
            fdLoc.helpText = propLoc.helpText && !proposed.locationDisplayText1.isNumberDisabled ? propLoc.helpText : null;
            fdLoc.isNumberDisabled = propLoc.isNumberDisabled;
            fdLoc.numberValue = propLoc.numberValue;
            fdLoc.displayValue = propLoc.displayValue;
            fdLoc.showAdd = propLoc.showAdd;
            fdLoc.showDelete = propLoc.showDelete;
            fdLoc.isAddDisabled = propLoc.isAddDisabled;
            fdLoc.otherDescText = propLoc.otherDescText ? propLoc.otherDescText : null;
        }
        return fd;
    }
}
