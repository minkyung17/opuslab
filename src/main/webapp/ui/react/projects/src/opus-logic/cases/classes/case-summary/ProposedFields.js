import {intersection, set, keys} from "lodash";


import CaseSummary from "./CaseSummary";
import * as util from "../../../common/helpers/";
import Validator from "../../../common/modules/Validate";
import {constants} from "../../constants/case-summary/CaseSummaryConstants";
import {fieldsInAPI} from "../../constants/FieldDataConstants";
import {constants as caseConstants} from "../../constants/CasesConstants";

/**
*
* @classdesc Specifically for dealing with proposed fields, saves comments,
*   saves and completes cases
* @author - Leon Aburime
* @class ProposedFields
* @extends CaseSummary
*
**/
export default class ProposedFields extends CaseSummary {

  /**
  *
  * @desc - Start
  * @param {Object} - adminData, access_token, globalData
  * @return {void}
  *
  **/
    constructor({adminData, access_token, globalData} = {}) {
        super({adminData, access_token, globalData});
    }

  /**
  *
  * @desc - Get starting fields
  * @param {Object} caseSummaryDataFromAPI -
  * @param {Object} actionDataInfo -
  * @return {Object} - fields needed for UI
  *
  **/
    initProposedFieldsFromAPIData(caseSummaryDataFromAPI, actionDataInfo) {
    //Format this class's validations and toggles based on actionType
        this.configureClassFromActionType(actionDataInfo.actionTypeInfo);

        let {casesProposedAttrMap, opusCaseInfo} = caseSummaryDataFromAPI;
        let fieldData = this.createProposedStatusFieldData(actionDataInfo,
      casesProposedAttrMap);

        this.setFieldDataPermissionsFromOpusCaseInfo(caseSummaryDataFromAPI);

    //TODO take this out. Ask Sony to pre-populate = true series, rank OPUSDEV-1914
        let {proposedAppointmentInfo} = actionDataInfo;
        this.updateFieldsOnStart_special(proposedAppointmentInfo, fieldData);
    //END of TODO to take out

    //Clone table data that wont change when modal fields update
        let tableData = util.cloneObject(fieldData);

    //Get original starting data
        let startingFieldData = util.cloneObject(fieldData);

    //Get appt display data and fields to show in the modal
        let apptIdsForCase = this.getApptIdsForCase(caseSummaryDataFromAPI, "caseSummary");
        let unarchivedAppts = this.getActiveApptsFromCasesData(caseSummaryDataFromAPI.apptDetailsList.appointmentInfo);
        let apptBlockData = this.AppointmentBlock.getDisplayFieldsFromAppointmentsForDisplayLayout(
                              apptIdsForCase, unarchivedAppts);
        let endowedChairData = actionDataInfo.endowedChairInfo;
        let endowedChairBlockData = this.EndowedChairBlock.getDisplayFieldsFromEndowedChairForDisplayLayout(endowedChairData);


    // RE-319 Find salary effective date dropdown options
        this.addSalaryEffDateOptions(startingFieldData, caseSummaryDataFromAPI);
        this.checkStepValueForLecturerSeries(actionDataInfo, startingFieldData, "proposed");

        return {tableData, fieldData, apptBlockData, startingFieldData, endowedChairBlockData};
    }

  /**
  *
  * @desc - Gets starting page data. Both action and status fields
  * @param {Object} caseSummaryDataFromAPI - straight from API
  * @return {Object} - filtered fieldData and other constants
  *
  **/
    initProposedFieldsSectionFromAPIData(caseSummaryDataFromAPI) {
        let {opusCaseInfo, casesProposedAttrMap, actionDataInfo} = caseSummaryDataFromAPI;

    //Reset permissions every time we get new data
        this.setFieldDataPermissionsFromOpusCaseInfo(caseSummaryDataFromAPI);

    //Create proposed Action section from attributes and caseSummary data
        let proposedAction = this.createProposedActionFieldData(actionDataInfo,
      casesProposedAttrMap);

    //Must know if there are proposed status fields to render section on screen
        let hasProposedStatusFields = this.hasProposedStatusFields(casesProposedAttrMap);

    //Lets copy this to be recopie every time modal is open
        let startingData = util.cloneObject({proposedAction});

        let tableData = util.cloneObject({proposedAction});

    //BA's will want tables to show up in order of affiliation
        let actionDataSortedByAffiliation = this.sortActionDataByAffiliationTypeId(
      actionDataInfo);

        return {proposedAction, hasProposedStatusFields, startingData, tableData,
      actionDataSortedByAffiliation, opusCaseInfo, actionDataInfo,
      casesProposedAttrMap, apoAnalystName: opusCaseInfo.apoAnalyst};
    }

  /**
  *
  * @desc - Create and populate proposed Action fields actionData and attributeMap
  * @param {Object} actionDataInfo -
  * @param {Object} casesProposedAttrMap -
  * @return {Object} proposedAction -
  *
  **/
    createProposedActionFieldData(actionDataInfo, casesProposedAttrMap) {
        let {proposedAction} = this.createProposedActionAndStatusFieldsFromAttrProps(
      casesProposedAttrMap);

    //Add value options for dropdowns
        this.addOptionsListToFieldData(proposedAction, this.formattedCommonCallLists);

        this.addValuesToFieldData(proposedAction, actionDataInfo[0]);
        this.reformatDisplayValuesBasedOnViewType(proposedAction);

        return proposedAction;
    }

  /**
  *
  * @desc - Checks if there are ProposedStatusFields
  * @param {Object} casesProposedAttrMap -
  * @return {Boolean} hasFields -
  *
  **/
    hasProposedStatusFields(casesProposedAttrMap) {
    //Create proposed status fields and add values and select options to it
        let {proposedStatus} = this.createProposedActionAndStatusFieldsFromAttrProps(
      casesProposedAttrMap);

        let hasFields = !!Object.keys(proposedStatus).length;
        return hasFields;
    }

  /**
  *
  * @desc - Take values from actionDataInfo and put into fieldData. Change APU
  *   requires something different
  * @param {Object} fieldData -
  * @param {Object} actionDataInfo -
  * @return {Object} fieldData
  *
  **/
    addValuesToFieldData(fieldData, actionDataInfo) {
        let actionType = this.getActionTypeFromActionData(actionDataInfo);

        if(actionType === "3-37") {//Change APU
            this.addValuesToFieldDataForChangeAPU(fieldData, actionDataInfo);
        } else {
            super.addValuesToFieldData(fieldData, actionDataInfo);
        }

        return fieldData;
    }

  /**
  *
  * @desc - Must add values from only proposedAppointment and no fields are needed
  *   from actionData level...only proposedAppointment
  * @param {Object} fieldData -
  * @param {Object} actionDataInfo -
  * @return {void}
  *
  **/
    addValuesToFieldDataForChangeAPU(fieldData, actionDataInfo) {
        let {proposedAppointmentInfo} = actionDataInfo;
    //Add values from actionData to created fieldData
        super.addValuesToFieldData(fieldData, {...actionDataInfo, proposedAppointmentInfo,
      appointmentInfo: proposedAppointmentInfo});
    }

  /**
  *
  * @desc - Create fieldData and add values, options, and format it by exception
  * @param {Object} actionDataInfo -
  * @param {Object} casesProposedAttrMap -
  * @return {Object} proposedStatus -
  *
  **/
    createProposedStatusFieldData(actionDataInfo = {}, casesProposedAttrMap) {
    //Create proposed status fields and add values and select options to it
        let {proposedStatus} = this.createProposedActionAndStatusFieldsFromAttrProps(
      casesProposedAttrMap);

        this.addValuesToFieldData(proposedStatus, actionDataInfo);

    //If money prepend '$', percent add '%', etc
        this.reformatDisplayValuesBasedOnViewType(proposedStatus);

    //Add value options for dropdowns
        this.addOptionsListToFieldData(proposedStatus, this.formattedCommonCallLists);

    //Add step options from current title code
        this.addStepOptionsByTitleCodeValue(proposedStatus, this.formattedCommonCallLists);

    //Hide step if options are basically blank
        this.FieldDataToggle.updateStepVisibilityIfOptionsAreBlankAndNA(proposedStatus);

    //Get automatic values for affiliation
        let actionType = this.getActionTypeFromActionData(actionDataInfo);
        let {appointmentInfo} = actionDataInfo;

    //Take care of multiple exception cases
        this.editFieldsForActionTypeExceptions(proposedStatus, appointmentInfo, actionType);

    //Lets update the endowedChairType
        this.FieldDataToggle.updateFieldDataByEndowedChairType(proposedStatus);

    //Let's update the apu, if applicable
        let {aHPathIdsToDeptCode} = this.formattedCommonCallLists;
        let {proposedAppointmentInfo, appointmentInfo: currentAppointmentInfo} = actionDataInfo;
        let deptCode = this.getDeptCodeForAPUList(aHPathIdsToDeptCode, proposedAppointmentInfo, currentAppointmentInfo);

        this.FieldDataToggle.updateCasesAPUOptionsFromGlobalData(proposedStatus, deptCode, this.formattedCommonCallLists);

    // Find multiple locations
        this.setMultipleLocations(proposedStatus, actionDataInfo, "caseSummary", "proposed");

    //All created now go back
        return proposedStatus;
    }

  /**
  *
  * @desc - Duplicate blank status fields and index them by appointmentId
  * @param {Array} actionDataInfo -
  * @param {Object} casesProposedAttrMap -
  * @return {Object} proposedStatusFieldsDataByApptId -
  *
  **/
    createProposedStatusFieldDataByApptId(actionDataInfo = [], casesProposedAttrMap) {
    //Key actionData by appointment to iterate throught
        let actionDataInfoByApptId = this.keyActionDataByApptId(actionDataInfo);

    //Create new status fields for each appointmentId
        let proposedStatusFieldsDataByApptId = {};
        for(let apptId in actionDataInfoByApptId) {
            proposedStatusFieldsDataByApptId[apptId] = this.createProposedStatusFieldData(
        actionDataInfoByApptId[apptId], casesProposedAttrMap);
        }

    //Return fieldData clones indexed by appointmentId
        return proposedStatusFieldsDataByApptId;
    }

  /**
  *
  * @desc - Create both action and status fields just from attributeProperties
  * @param {Object} casesProposedAttrMap -
  * @return {Object} - {proposedAction, proposedStatus}
  *
  **/
    createProposedActionAndStatusFieldsFromAttrProps(casesProposedAttrMap = {}) {
        let proposedFields = this.FieldData.createFieldDataByAttributeProperties(
      casesProposedAttrMap, {fieldDataOptions: fieldsInAPI});

        let {proposedAction, proposedStatus} =
    this.separateProposedActionAndStatusFieldsByAttrPropsSectionName(proposedFields);

        return {proposedAction, proposedStatus};
    }

  /*****************************************************************************
  *
  * @desc - Having to do with Saving Proposed Action
  *
  *****************************************************************************/

  /**
  *
  * @desc - Returns url with access token for saving proposedAction
  * @param {String} access_token -
  * @return {String} - completed url
  *
  **/
    getSaveProposedActionUrl({access_token} = this) {
        return `${constants.urls.updateAction}${access_token}`;
    }

  /**
  *
  * @desc - Gets formatted template to save to backend
  * @param {Object} fieldData -
  * @param {String} caseId - caseId
  * @return {Object} - formatted save template
  *
  **/
    getProposedActionSaveTemplate(fieldData, caseId) {
        let saveTemplate = util.cloneObject(constants.proposedActionTemplate);
        this.setValueOfInvisibleFields(fieldData);
        this.addFieldValuesToActionData(fieldData, saveTemplate);

        return {...saveTemplate, caseId, user: this.adminData.adminName};
    }

    addProposedActionFlagsToSaveTemplate(saveTemplate, proposedActionFlags){
        for(let index in proposedActionFlags) {
            let proposedActionFlagName = proposedActionFlags[index].name;
            saveTemplate[proposedActionFlagName] = proposedActionFlags[index].checked;
        }
        return saveTemplate;
    }


  /**
  *
  * @desc - Format template and save proposed action
  * @param {Object} fieldData -
  * @param {Object} - caseId
  * @return {Promise} -
  *
  **/
    saveProposedAction(fieldData = {}, {caseId} = {}, proposedActionFlags) {
    //Create the save Template
        let saveTemplate = this.getProposedActionSaveTemplate(fieldData, caseId);

    // OPUSDEV-3417 Backend request for analystType to be null
        saveTemplate.analystType = null;

    // Add proposed action flags
        saveTemplate = this.addProposedActionFlagsToSaveTemplate(saveTemplate, proposedActionFlags);

    //Print for the devs who want to check for errors
        console.log("Proposed Action Template sent to API", saveTemplate);

    //Formatted url to use to save
        let url = this.getSaveProposedActionUrl();

    //Save headers needed for the API to work
        let headers = this.getSaveHeaders();

    //Save promise
        return util.jqueryPostJson(url, saveTemplate, headers);
    }


  /*****************************************************************************
  *
  * @desc - Having to do with Saving Proposed Status
  *
  *****************************************************************************/

  /**
  *
  * @desc - Add any needed constants to proposed template
  * @param {Object} actionDataTemplate -
  * @param {Object} opusCaseInfo -
  * @return {Object} proposedStatusTemplate - formatted template for save
  *
  **/
    addPageNameToActionDataTemplate(actionDataTemplate = {}, actionDataInfo) {
        let caseIsCompleted = this.showCompleteCaseButton(actionDataInfo[0]);
        let pageName = caseIsCompleted ? "completed" : "active";
        actionDataTemplate.pageName = pageName;
        return actionDataTemplate;
    }


  /**
  *
  * @desc - Create and format save template for proposedStatus to be saved
  * @param {Object} fieldData -
  * @param {Object} actionDataInfo -
  * @param {Object} - appointeeInfo, opusCaseInfo
  * @return {Object} proposedStatusTemplate - formatted template for save
  *
  **/
    formatProposedStatusTemplate(fieldData, actionDataInfo, endowedChair, {appointeeInfo,
    opusCaseInfo} = {}) {

        this.wipeValuesOfInvisibleFieldData(fieldData);

    //Setting step to zero must be AFTER "wipeValuesOfInvisibleFieldData"
        this.editStepValueByVisibility(fieldData);

    //Create actionDataTemplate
        let actionData = this.formatActionDataTemplate(actionDataInfo, opusCaseInfo,
      {sectionName: "proposed"});

    //Adds any other needed constants
        this.addPageNameToActionDataTemplate(actionData, actionDataInfo);

    //Extract the appointment to format
        let {proposedAppointmentInfo} = actionData;

    //Add Status fields actionData template
        this.addFieldValuesToActionData(fieldData, {proposedAppointmentInfo,
      appointmentInfo: proposedAppointmentInfo});

    //Add Status fields actionData template
        this.addFieldValuesToActionData(fieldData, actionData);

    //Add only visible fields actionData template. This is for scaleType as its
    //overwritten by the disabled or invisible hscpScale0-9
        this.addVisibleFieldValuesToActionData(fieldData, {proposedAppointmentInfo,
      appointmentInfo: proposedAppointmentInfo});

    //Add APU Id to fieldData
        this.addApuCodeToApptByFieldDataApuId(fieldData, proposedAppointmentInfo);

    //Setting APUId to 0 and APUCode to N/A must be AFTER "addApuCodeToApptByFieldDataApuId"
        this.editAPUValueByVisibility(fieldData, proposedAppointmentInfo);

    //Clear apuDesc
        this.wipeApuDesc(actionData, "case-summary-proposed");

    //Add AHPathId and departmentCode
        this.addAHPathAndDeptCodeToApptFromFieldData(fieldData, proposedAppointmentInfo);

    //Create loggedInUserInfo
        let loggedInUserInfo = this.populateLoggedInUserInfoWithAdminData();

    // Set multiple location fields
        this.setLocationForSave(fieldData, proposedAppointmentInfo);

    //Sets scale type id to -1 if not editable and visible #scaleTypeId=-1
    // Jira #3048 #3050
        if(fieldData.scaleType && !fieldData.scaleType.visibility){
            actionData.proposedAppointmentInfo.salaryInfo.academicProgramUnit.scaleTypeId = -1;
        }

        // jira OPUSDEV-4108
        let offScalePercentValue = actionData.proposedAppointmentInfo.salaryInfo.offScalePercent;
        if (offScalePercentValue !== null) {
            if (offScalePercentValue.toString().includes("%")) {
                actionData.proposedAppointmentInfo.salaryInfo.offScalePercent = offScalePercentValue.substr(0, offScalePercentValue.length - 1);
            }
        }
        if(endowedChair !== undefined && endowedChair.endowedChairId) {
          let endowedChairId = endowedChair.endowedChairId;
          actionData.proposedEndowedChairId = endowedChairId;
        }

        // IOK-1115 fields are called proposedTermEndDate and approvedTermEndDate in the API but called termEndDate for both fields in the ui
        if(fieldData.termEndDate && fieldData.termEndDate.visibility){
            actionData.proposedTermEndDate = fieldData.termEndDate.value;
        }

    //Complete Proposed Status Template
        return {actionData, appointeeInfo, loggedInUserInfo};
    }

  /**
  *
  * @desc - Returns url with access token for saving proposedStatus
  * @return {String} - formatted saveProposedStatus url
  *
  **/
    getSaveProposedStatusUrl() {
        return `${constants.urls.saveProposedStatus}${this.access_token}`;
    }

  /**
  *
  * @desc - Saves proposedStatus and returns promise
  * @param {Object} fieldData - fieldData holding the values from the UI
  * @param {Object} actionDataInfo - appointment data
  * @param {Object} - appointeeInfo, opusCaseInfo
  * @return {Promise} - promise for saving proposed status
  *
  **/
    saveProposedStatus(fieldData, actionDataInfo, endowedChair, {appointeeInfo,
    opusCaseInfo} = {}) {
    //Format template by adding values to it
        let proposedStatusTemplate = this.formatProposedStatusTemplate(fieldData,
      actionDataInfo, endowedChair, {appointeeInfo, opusCaseInfo});

    //Stringify template
        let stringifiedTemplate = this.stringify(proposedStatusTemplate);

    //Format url to save
        let url = this.getSaveProposedStatusUrl();

        console.log("Template sent to API", proposedStatusTemplate);

    //Save data and return promis
        return util.jqueryPostJson(url, stringifiedTemplate);
    }
}
