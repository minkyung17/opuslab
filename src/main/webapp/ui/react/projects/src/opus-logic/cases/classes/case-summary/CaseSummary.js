import moment from "moment";
import {get, sortBy, keyBy} from "lodash";


//My imports
import CasesDossier from "../CasesDossier";
import * as util from "../../../common/helpers/";
import SalaryToggle from "../toggles/SalaryToggle";
import Validator from "../../../common/modules/Validate";
import FieldData from "../../../common/modules/FieldData";
// import Permissions from '../../../common/modules/Permissions';
import {fieldsInAPI} from "../../constants/FieldDataConstants";
import FieldDataToggle from "../toggles/CaseDossierFieldDataToggle";
//import {constants as caseConstants} from '../../constants/CasesConstants';
import {constants, actionDataTemplate} from "../../constants/case-summary/CaseSummaryConstants";
import {fieldNamesValidation} from "../../constants/case-summary/CaseSummaryFieldDataValidations";

/**
*
* Class dealing with Case Summary page and its functionality
* @author - Leon Aburime
* @class CaseSummary
* @extends Cases
*
**/
export default class CaseSummary extends CasesDossier {
    validateFieldNames = fieldNamesValidation;
    FieldData = new FieldData();
    Validator = new Validator();
  // Permissions = null;
    SalaryToggleLogic = new SalaryToggle();
    FieldDataToggle = new FieldDataToggle();
    approvedFields = {
        caseLocation: {},
        finalDecision: {},
        finalDecisionMain: {},
        finalDecisionPopup: {}
    }

  /**
  *
  * @desc - Initializes Case summary variables
  * @param {Object} - adminData, access_token, globalData
  * @return {void}
  *
  **/
    constructor({adminData, access_token, globalData, ...args} = {}) {
        super({adminData, access_token, globalData, ...args});

        this.initCaseSummary({adminData, access_token, globalData, ...args});
    }

  /**
  *
  * @desc - Inits permissions, gets formatted lists, & sets data
  * @param {String} - adminData, access_token, globalData
  * @return {void}
  *
  **/
    initCaseSummary({adminData, access_token, globalData, ...args}) {
    //Create permissions for permissions
    // this.Permissions = new Permissions(adminData);

    //Create common call lists for the UI to use later
        this.formattedCommonCallLists = this.getFormattedListsFromCommonCallData(
      {adminData, globalData});

    //Set this data in this Logic file for easy use
        this.setClassData({adminData, access_token, globalData});

    //Get case summary page permissions
        let permissions = this.getCaseSummaryPagePermissions(adminData);

    //Set them in this Logic file
        this.setClassData(permissions);
    }

  /**
  *
  * @desc - Gets a multitude of data needed typically for the UI layer
  * @param {Object} - caseSummaryDataFromAPI
  * @return {void}
  *
  **/
    getStartingCaseSummaryData(caseSummaryDataFromAPI) {

        let {workflowSteps, opusCaseInfo, casesProposedAttrMap, casesApprovedAttrMap,
      actionDataInfo} = caseSummaryDataFromAPI;

        let apptIdsForCase = this.getApptIdsForCase(caseSummaryDataFromAPI, "caseSummary");

        let unarchivedAppts = this.getActiveApptsFromCasesData(caseSummaryDataFromAPI.apptDetailsList.appointmentInfo);
        let apptBlockData = this.AppointmentBlock.getDisplayFieldsFromAppointmentsForDisplayLayout(apptIdsForCase, unarchivedAppts);
        let endowedChairData = actionDataInfo[0].endowedChairInfo;
        let endowedChairBlockData = this.EndowedChairBlock.getDisplayFieldsFromEndowedChairForDisplayLayout(endowedChairData);
    //Reset permissions every time we get new data
        this.setFieldDataPermissionsFromOpusCaseInfo(caseSummaryDataFromAPI);

    //Get caseLocation fields
        let caseLocation = this.createCaseLocationFieldData(caseSummaryDataFromAPI,
      casesApprovedAttrMap);
        let startingCaseLocationFields = util.cloneObject(caseLocation);

    //Get data for workFlow table
        let workFlowData = this.createByWorkFlowData(workflowSteps);
        let hasWorkFlow = !!workflowSteps;

    // APO Analyst
        let apoAnalyst = this.createAPOAnalystField(opusCaseInfo);
        let startingApoAnalystField = util.cloneObject(apoAnalyst);
        let canEditAnalyst = this.canEditAnalyst();

    //Get edit apo analyst signal from logic side
        let canEditApoAnalyst = this.canEditApoAnalyst();
    //Get apoAnalyst options from Logic side
        let apoAnalystOptions = this.getApoAnalystOptions();

    // Dean's Office
        let deansOfficeAnalyst = this.createDeansOfficeAnalystField(opusCaseInfo);
        let startingDeansOfficeAnalystField = util.cloneObject(deansOfficeAnalyst);
    //Get edit apo analyst signal from logic side
        let canEditDeansOfficeAnalyst = this.canEditDeansOfficeAnalyst();

    // Department Analyst
        let departmentAnalyst = this.createDepartmentAnalystField(opusCaseInfo);
        let startingDepartmentAnalystField = util.cloneObject(departmentAnalyst);
    //Get edit Department analyst signal from logic side
        let canEditDepartmentAnalyst = this.canEditDepartmentAnalyst();

        return {casesProposedAttrMap, unarchivedAppts, apptBlockData, caseLocation,
      startingCaseLocationFields, workFlowData, hasWorkFlow, endowedChairBlockData,
      apoAnalyst, startingApoAnalystField, canEditAnalyst, canEditApoAnalyst, apoAnalystOptions,
      deansOfficeAnalyst, startingDeansOfficeAnalystField, canEditDeansOfficeAnalyst,
      departmentAnalyst, startingDepartmentAnalystField, canEditDepartmentAnalyst,
      opusCaseInfo, casesApprovedAttrMap, actionDataInfo};
    }

  /**
  *
  * @desc - Get just the url w/ the access_token appended
  * @param {String} access_token -
  * @return {String} url - complete url with access token
  *
  **/
    getCaseSummaryDataAPIUrl(access_token = this.access_token) {
        let url = `${constants.urls.getCaseSummary}${access_token}`;
        return url;
    }

  /**
  *
  * @desc - Gets text data for years at rank and step
  * @param {Object} caseSummaryDataFromAPI - main API data
  * @return {Object} - formatted text data
  *
  **/
    getOpusCaseInfoText(caseSummaryDataFromAPI) {
        let {opusCaseInfo, appointeeInfo} = caseSummaryDataFromAPI;
        let {hireDt, uid} = appointeeInfo;
        let {caseId, yearsAtCurrentRank, yearsAtCurrentStep} = opusCaseInfo;

        uid = uid ? `UID: ${uid}` : null;
        caseId = caseId ? `Case #: ${caseId}` : null;
        hireDt = hireDt ? `Hire Date: ${hireDt}` : null;
        yearsAtCurrentRank = "Years at Rank: " + (yearsAtCurrentRank || "");
        yearsAtCurrentStep = "Years at Step: " + (yearsAtCurrentStep || "");
        let email = appointeeInfo.officialEmail;
        let jobNumber = appointeeInfo.jobNumber ?
      "Recruit Tracking #: " + appointeeInfo.jobNumber : null;

        let {appointmentInfo} = caseSummaryDataFromAPI.actionDataInfo[0];
        let yearsOnTheClock = appointmentInfo.yearsOnTheClock ?
      "Years on the Clock: " + appointmentInfo.yearsOnTheClock : null;
        let timeOffTheClock = appointmentInfo.timeOffTheClock ?
      "Time off the Clock: " + appointmentInfo.timeOffTheClock : null;
        let serviceAsProposedEffDt = appointmentInfo.serviceAsProposedEffDt ?
      "Service as of Proposed Effective Date: " + appointmentInfo.serviceAsProposedEffDt : null;

        return {uid, caseId, yearsAtCurrentRank, yearsAtCurrentStep, hireDt, email,
      jobNumber, yearsOnTheClock, timeOffTheClock, serviceAsProposedEffDt};
    }

  /**
  *
  * @desc - Gets text data for years at rank and step
  * @param {Object} caseSummaryDataFromAPI - main API data
  * @return {Object} - formatted text data
  *
  **/
    getCAPInfoText(caseSummaryDataFromAPI) {
        let {opusCaseInfo, appointeeInfo, actionDataInfo} = caseSummaryDataFromAPI;
        let {hireDt, uid} = appointeeInfo;
        let {yearsAtCurrentRank, yearsAtCurrentStep, apoAnalyst, cAPToAPOSubmittedDt} = opusCaseInfo;
        let current = actionDataInfo[0].appointmentInfo;
        let proposed = actionDataInfo[0].proposedAppointmentInfo;
        hireDt = hireDt ? `Hire Date: ${hireDt}` : null;
        yearsAtCurrentRank = "Years at Rank: " + (yearsAtCurrentRank || "");
        yearsAtCurrentStep = "Years at Step: " + (yearsAtCurrentStep || "");

    //  Jira #2834 Figure out CAP received date
        let dateCapReceived = "";
        if(caseSummaryDataFromAPI.workflowSteps && caseSummaryDataFromAPI.workflowSteps.length){
            for(let each in caseSummaryDataFromAPI.workflowSteps){
                if(caseSummaryDataFromAPI.workflowSteps[each].workFlowStepName.includes("CAP")
          && caseSummaryDataFromAPI.workflowSteps[each].workFlowStepDt){
                    dateCapReceived = "Date CAP Received: "+moment(caseSummaryDataFromAPI.workflowSteps[each].workFlowStepDt).format("L");
                    break;
                }
            }
        }

        apoAnalyst = "APO Analyst: "+ (apoAnalyst || "");
        let actionType = actionDataInfo[0].actionTypeInfo.actionTypeDisplayText;
        let proposedEffectiveDt = actionDataInfo[0].proposedEffectiveDt;
        let yearsAccelerated = actionDataInfo[0].proposedYearsAcceleratedCnt;
        let yearsDeferred = actionDataInfo[0].proposedYearsDeferredCnt;

        let titleCode = proposed.titleInformation.titleName;
        let series = proposed.titleInformation.series;
        let rank = proposed.titleInformation.rank.rankTypeDisplayText;
        let step = proposed.titleInformation.step.stepName;
        let percentTime;
        if(proposed.appointmentPctTime!==null && proposed.appointmentPctTime>=0){
            percentTime = proposed.appointmentPctTime+"%";
        }
        let showProposedApptTable = false;
        if(titleCode || series || rank || step || percentTime){
            showProposedApptTable = true;
        }
        return {yearsAtCurrentRank, yearsAtCurrentStep, hireDt, dateCapReceived, apoAnalyst,
      actionType, proposedEffectiveDt, yearsAccelerated, yearsDeferred,
      titleCode, series, rank, step, percentTime, showProposedApptTable};
    }

  /**
  *
  * @desc - Get only the args needed for caseSummary
  * @param {String} caseId - api results
  * @return {Object} - caseId in an object
  *
  **/
    getCaseSummaryDataAPIArgs(caseId) {
        return {caseId};
    }

      /**
  *
  * @desc - APO and OA can edit apoAnalyst data
  * @return {Boolean} - whether user is OA or APO
  *
  **/
       canEditAnalyst() {
        let {isOA, isAPO, isSA, isDA, isAPOAdmin, isDivisionAdmin} = this.Permissions;
        return isOA || isAPO || isSA || isDA || isAPOAdmin || isDivisionAdmin;
    }

  /*****************************************************************************
  *
  * @desc - APO Analyst Options RE-494
  *
  *****************************************************************************/

  /**
  *
  * @desc - Get apoAnalyst options
  * @param {String} caseId - api results
  * @return {Array} apoAnalystOptions - Sorted array of possible apo analysts
  *
  **/
    getApoAnalystOptions() {
        let {apoAnalyst} = this.globalData;
        let apoAnalystOptions = this.formatApoAnalystList(apoAnalyst);
        return apoAnalystOptions;
    }

    /**
  *
  * @desc - Reformat and sort APO Analyst collection by value
  * @param {Object} apoAnalyst - object of apoAnalyst with key=apoAnalystId &
  *   value=name
  * @return {Array} apoAnalystOptions
  *
  **/
    formatApoAnalystList(apoAnalyst = {}) {
        let apoAnalystOptions = util.reformatObjectIntoCollectionSortedByValue(apoAnalyst);
        return apoAnalystOptions;
    }


  /**
  *
  * @desc - Create initial apoAnalyst field
  * @param {Object} opusCaseInfo -
  * @return {Object} - Apo Analyst field
  *
  **/
    createAPOAnalystField(opusCaseInfo) {
        let {aPOAnalystOpusId, apoAnalystCaseAssignDate, apoAnalyst} = opusCaseInfo;
        let options = this.getApoAnalystOptions();

        let apoObject = {
            name:{
                options,
                visibility: true,
                editable: true,
                dataType: "options",
                name: "apoAnalyst",
                displayName: "Name",
                value: aPOAnalystOpusId,
                displayText: apoAnalyst,
                hasError: false
            },
            formerName:{
                name: "formerApoAnalyst",
                displayName: "Former Analyst",
                displayText: apoAnalyst,
                value: aPOAnalystOpusId,
                descriptionText: "This person was assigned to the case, but no longer has an administrator role in this unit. Please choose a new analyst from the dropdown.",
                shouldShow: false
            },
            date: {
                name: "apoAnalystCaseAssignDate",
                displayName: "Date Assigned",
                value: apoAnalystCaseAssignDate,
                showLabel: true
            }
        }
        return apoObject;
    }

  /**
  *
  * @desc - APO and OA can edit apoAnalyst data
  * @return {Boolean} - whether user is OA or APO
  *
  **/
    canEditApoAnalyst() {
        let {isOA, isAPO, isAPOAdmin} = this.Permissions;
        return isOA || isAPO || isAPOAdmin;
    }

  /*****************************************************************************
  *
  * @desc - Dean's Office Analyst Options RE-494
  *
  *****************************************************************************/
  /**
  *
  * @desc - Get deansOfficeAnalyst options
  * @param {String} caseId - api results
  * @return {Array} deansOfficeAnalystOptions - Sorted array of possible dean's office
  *
  **/
    async getDeansOfficeAnalystOptions(academicHierarchyPathId, access_token = this.access_token){
        let url = `${constants.urls.getDeanAnalystList}${access_token}`;
        let urlArgs = {academicHierarchyPathId};
        let data = await util.fetchJson(url, urlArgs);
        this.deansOfficeAnalystOptionsFromAPI = data;
        return data;
    }


/**
*
* @desc - Create initial deansOffice field
* @param {Object} opusCaseInfo -
* @return {Object} - Dean's Office field
*
**/
    createDeansOfficeAnalystField(opusCaseInfo) {
        let {deanAnalystOpusId, deanAnalystCaseAssignDate, deanAnalyst} = opusCaseInfo;

        let deanOfficeObject = {
            name:{
                options: [],
                visibility: true,
                editable: true,
                dataType: "options",
                name: "deansOfficeAnalyst",
                displayName: "Name",
                value: deanAnalystOpusId,
                displayText: deanAnalyst,
                hasError: false
            },
            formerName:{
                name: "formerDeansOfficeAnalyst",
                displayName: "Former Analyst",
                displayText: deanAnalyst,
                value: deanAnalystOpusId,
                descriptionText: "This person was assigned to the case, but no longer has an administrator role in this unit. Please choose a new analyst from the dropdown.",
                shouldShow: false
            },
            date: {
                name: "deanAnalystCaseAssignDate",
                displayName: "Date Assigned",
                value: deanAnalystCaseAssignDate,
                showLabel: true
            }
        }
        return deanOfficeObject;
    }

/**
*
* @desc - APO, OA and SA can edit deansOffice data
* @return {Boolean} - whether user is OA or APO
*
**/
    canEditDeansOfficeAnalyst() {
        let {isOA, isAPO, isSA, isAPOAdmin, isDivisionAdmin} = this.Permissions;
        return isOA || isAPO || isSA || isAPOAdmin || isDivisionAdmin;
    }

/*****************************************************************************
  *
  * @desc - Department Options RE-494
  *
  *****************************************************************************/
/**
  *
  * @desc - Get departmentAnalyst options
  * @param {String} caseId - api results
  * @return {Array} departmentAnalystOptions - Sorted array of possible department
  *
  **/
    async getDepartmentAnalystOptions(academicHierarchyPathId, access_token = this.access_token){
        let url = `${constants.urls.getDepartmentAnalystList}${access_token}`;
        let urlArgs = {academicHierarchyPathId};
        let data = await util.fetchJson(url, urlArgs);
        this.departmentAnalystOptionsFromAPI = data;
        return data;
    }


/**
*
* @desc - Create initial department field
* @param {Object} opusCaseInfo -
* @return {Object} - Department field
*
**/
    createDepartmentAnalystField(opusCaseInfo) {
        let {deptAnalystOpusId, deptAnalystCaseAssignDate, deptAnalyst} = opusCaseInfo;
        let deanOfficeObject = {
            name:{
                options: [],
                visibility: true,
                editable: true,
                dataType: "options",
                name: "departmentAnalyst",
                displayName: "Name",
                value: deptAnalystOpusId,
                displayText: deptAnalyst,
                hasError: false
            },
            formerName:{
                name: "formerDepartmentAnalyst",
                displayName: "Former Analyst",
                displayText: deptAnalyst,
                value: deptAnalystOpusId,
                descriptionText: "This person was assigned to the case, but no longer has an administrator role in this unit. Please choose a new analyst from the dropdown.",
                shouldShow: false
            },
            date: {
                name: "deptAnalystCaseAssignDate",
                displayName: "Date Assigned",
                value: deptAnalystCaseAssignDate,
                showLabel: true
            }
        }
        return deanOfficeObject;
    }

/**
*
* @desc - APO, OA and SA can edit department data
* @return {Boolean} - whether user is OA or APO
*
**/
    canEditDepartmentAnalyst() {
        let {isOA, isAPO, isSA, isDA, isAPOAdmin, isDivisionAdmin} = this.Permissions;
        return isOA || isAPO || isSA || isDA || isAPOAdmin || isDivisionAdmin;
    }

    validateAnalystFields = (fieldData) => {
        if(fieldData.date.value && !fieldData.name.value){
            fieldData.name.hasError = true;
            fieldData.name.error = "Please fill out this required field.";
        }else{
            fieldData.name.hasError = false;
            fieldData.name.error = null;
        }
        return fieldData;
    }

    findFormerAnalysts = (analyst) => {
        let shouldShowFormerAnalyst = false;
        if(analyst.name &&  analyst.name.displayText!==null &&
            analyst.name.options && analyst.name.options.length>0){
            let foundInOptions = false;
            for(let each of analyst.name.options){
                let key = Object.keys(each).find(key => each[key] === analyst.name.displayText);
                if(key!==null && key!== undefined){
                    foundInOptions = true;
                }
            }
            if(!foundInOptions){
                shouldShowFormerAnalyst = true;
            }
            if(shouldShowFormerAnalyst){
                analyst.formerName.shouldShow = true;
            }else{
                analyst.formerName.shouldShow = false;
            }
        }
        return analyst;
    }



/**
*
* @desc - APO and OA can view Recommendations
* @return {Boolean} - whether user can view Recommendations section
*
**/
    canViewRecommendations() {
        let canViewActions = {edit: true, view: true};
        let {resourceMap: {case_rec: {action} = {}}} = this.adminData;
        return action in canViewActions;
    }

  /**
  *
  * @desc - CAP Admin and OA can view CAP Vote Boards
  * @return {Boolean} - whether user can view CAP Vote Board section
  *
  **/
    canViewCAPVoteBoard() {
        let {isOA, isCAP} = this.Permissions;
        return isOA || isCAP;
    }

  /**
  *
  * @desc - For some on blur fields we dont want to update fieldData,
  *   so we CAN update it if its not titleCode
  * @param {String} name - only field we shouldnt update is titleCode
  * @return {Boolean} - whether to update the field on blur
  *
  **/
    canUpdateFieldDataViaOnBlur(name) {
        let dontUpdateFields = {titleCode: true, locPercentTime1: true,
            locPercentTime2: true, locPercentTime3: true, locPercentTime4: true,
            locPercentTime5: true};
        return !(name in dontUpdateFields);
    }

  /**
  *
  * @desc - Get opusCaseInfo, actionDataInfo, and attributeProperties for
  *   approved and prospective cases
  * @param {String} caseId - api results
  * @param {String} access_token -
  * @return {Object} data - API Promise for case summary data
  *
  **/
    async getCasesSummaryData(caseId, access_token = this.access_token) {
        let caseSummaryUrl = this.getCaseSummaryDataAPIUrl(access_token);
        let caseSummaryArgs = this.getCaseSummaryDataAPIArgs(caseId);
        let data = await util.fetchJson(caseSummaryUrl, caseSummaryArgs);
        return data;
    }

  /**
  *
  * @desc - gets visible fields of 'fieldData' passed in
  * @param {Object} adminData - backend adminData
  * @return {Object} - can view and edit case summary
  *
  **/
    getCaseSummaryPagePermissions(adminData) {
        let {resourceMap: {casesummary = {}}} = adminData;
        let canViewCaseSummary = casesummary.action in {edit: true, view: true};
        let canEditCaseSummary = casesummary.action === "edit";
        return {canViewCaseSummary, canEditCaseSummary};
    }

  /**
  *
  * @desc - Get shortened department name and affiliation concatted together
  * @param {Object} appointment -
  * @return {String} title - concatenated deptName and affiliation
  *
  **/
    getTableTitleFromAppointment(appointment) {
        let {academicHierarchyInfo, affiliationType} = appointment;
        let {affiliation} = affiliationType;
        let {departmentName} = academicHierarchyInfo;
        let title = departmentName && affiliation ? `${departmentName} - ${affiliation}` : "";

        return title;
    }

  /**
  *
  * @desc - Get shortened department name and affiliation concatted together
  * @param {Object} actionDataInfo -
  * @return {String} - deptName and affiliation
  *
  **/
    getTableTitleFromActionDataInfo(actionDataInfo) {
        let {appointmentInfo} = actionDataInfo;
        return this.getTableTitleFromAppointment(appointmentInfo);
    }

  /**
   *
   * @desc - Sort appointments so Primary Appointment comes first
   * @param {Object} actionData -
   * @param {String} apptType - whether current, proposed or approved
   * @return {Array} - array of objects
   *
   **/
    sortActionDataByAffiliationTypeId(actionData = [], apptType = "appointmentInfo.") {
        return sortBy(actionData, apptType + "affiliationType.affiliationTypeId");
    }

  /**
   *
   * @desc - Modifies fieldData by applying toggles on start
   * @param {Object} actionDataInfoByApptId -
   * @param {Object} fieldDataByKey -
   * @return {void}
   *
   **/
    updateFieldsByIdOnStart_special(actionDataInfoByApptId, fieldDataByKey) {
        for(let id in fieldDataByKey) {
            let fieldData = fieldDataByKey[id];
            let {approvedAppointmentInfo} = actionDataInfoByApptId[id];

            this.updateFieldsOnStart_special(approvedAppointmentInfo, fieldData);
        }
    }

  /**
   *
   * @desc - Modifies proposedfields by applying toggles on start
   * @param {Object} actionDataInfoByApptId -
   * @param {Object} fieldDataByKey -
   * @return {void}
   *
   **/
    updateProposedFieldsByIdOnStart_special(actionDataInfoByApptId, fieldDataByKey) {
        for(let id in fieldDataByKey) {
            let fieldData = fieldDataByKey[id];
            let {proposedAppointmentInfo} = actionDataInfoByApptId[id];

            this.updateFieldsOnStart_special(proposedAppointmentInfo, fieldData);
        }
    }

  /**
   * TODO - take this out when Sony fixes the attributes properties
   * @desc - Specifically just update salary fields
   * @param {Object} appointment -
   * @param {Object} fieldData -
   * @return {Object} fieldData
   *
   **/
    updateSalaryFields_special(appointment, fieldData) {
    //Update salary fields visibility and editability
        let {salaryInfo: {attributeProperties: salAttrProps}} = appointment;
        let {salaryInfo: {academicProgramUnit: {attributeProperties}}} = appointment;

    //Combine all the attributes into one object
        let allSalaryAttrProps = {...salAttrProps, ...attributeProperties};

    //Now update all the salary fields
        this.FieldData.updateFieldDataByAttributeProperties(fieldData, allSalaryAttrProps);

        return fieldData;
    }

  /**
   * TODO - take this out when Sony fixes the attributes properties
   * @desc - Updates fieldData on start
   * @param {Object} appointment -
   * @param {Object} fieldData -
   * @return {void}
   *
   **/
    updateFieldsOnStart_special(appointment, fieldData) {
    //First update the salary fields
        this.updateSalaryFields_special(appointment, fieldData);

    //Extract common call lists
        let {formattedCommonCallLists: lists} = this;

    //Must be after salary update to take care of dentistryBaseSupplement not
    // being visible at the start but visible after API call
        this.FieldDataToggle.updateFieldsDependentOnDeptCode(fieldData, lists);

    //Update series and rank
        this.FieldDataToggle.updateSeriesRankFromTitleCodeLogic(fieldData, lists);

    //Update only step options
        this.FieldDataToggle.updateStepOptionsFromTitleCode(fieldData, lists);

    //Update start date fields
        this.FieldDataToggle.updateAllStartDateDependentFields(fieldData);

    //Update appointmentEndDt on start
        this.FieldDataToggle.appointmentEndDateLogic(fieldData, lists);

        this.setApptEndDateVisibilityByEndAppt(fieldData, this.actionType, "titleCode");

        this.updateFieldDataByToggleForEndAppt(fieldData, this.actionType,
      "appointmentEndDt");
    }


  /**
   *
   * @desc - Add values and displayValues to field data
   * @param {Object} fieldData - fields
   * @param {Object} data - appointment, opusCaseInfo  or other data to extract
   *  info from
   * @return {Object} fieldData
   *
   **/
    addValuesToFieldData(fieldData = {}, data = {}) {
    //Iterate thru each field
        for(let name in fieldData) {
      //Get the paths to the values from the attribute properties
            let {attributeProperties: {pathToFieldValue, pathToFieldDisplayText}}
        = fieldData[name];

      //Set the various values
            fieldData[name].value = get(data, pathToFieldValue);
            fieldData[name].displayValue = get(data, pathToFieldDisplayText);
        }
        return fieldData;
    }

  /**
   *
   * @desc - Gets if someone can edit the proposedStatus and finalDecision modals
   * @param {Object} opusCaseInfo - opusCaseInfo
   * @return {Object} - booleans for if we are allowed to edit proposedStatus and
   *  finalDecision
   *
   **/
    setFieldDataPermissionsFromOpusCaseInfo(caseSummaryDataFromAPI = {}) {
        let data = caseSummaryDataFromAPI.actionDataInfo;
        if(!data){
            data = {
                actionDataInfo: []
            };
        }
        let {canEditProposedStatus} = this.getProposedStatusPermissions(data);
        let {canEditFinalDecision} = this.getFinalDecisionPermissions(caseSummaryDataFromAPI);

        this.setClassData({canEditProposedStatus, canEditFinalDecision});
        return {canEditProposedStatus, canEditFinalDecision};
    }

  /**
  *
  * @desc - determines to show complete case button
  * Jira #2828 Made changes in condition
  * @param {Object} actionDataInfo - action data info
  * @return {Boolean} - to show complete case button or not
  *
  **/
    showCompleteCaseButton(actionDataInfo = {}) {
        let showCompleteCaseButton = false;
        if(actionDataInfo.actionStatusId === 1){
            showCompleteCaseButton = true;
        }
        return showCompleteCaseButton;
    }

  /**
  *
  * @desc - Is it opusAdmin or apoDirector
  * @param {Object} adminData - adminData
  * @return {Boolean} - if its viewable by being and opusAdmin or apo director
  *
  **/
    isOAOrAPO() {
        let {isOA, isAPO} = this.Permissions;
        let isOAOrAPO = isOA || isAPO;
        return isOAOrAPO;
    }

  /**
  *
  * @desc - Is it opusAdmin or apoDirector
  * @param {Object} adminData - adminData
  * @return {Boolean} - if its viewable by being and opusAdmin or apo director
  *
  **/
  //hasViewableRole = () => this.isOAOrAPO()

  /**
  *
  * @desc - Get if its school administrator
  * @return {Bool} - get if its school administrator
  *
  **/
    getIsSchoolAdministrator = () => this.Permissions.isSA

  /**
  *
  * @desc - Gets permissions specifically for proposedStatus
  * @param {Object} opusCaseInfo -
  * @param {Object} adminData -
  * @return {Object} - if user can edit canEditProposedStatus
  *
  **/
    getProposedStatusPermissions(actionDataInfo, adminData = this.adminData) {
    //Default value
        let canEditProposedStatus = false;

    //Extract if you are an OA or APO, school admin, or if case is completed
        let {isOAOrAPO, isSchAdmin, isDeptAdmin, isAreaAdmin} = this.CasesAdminPermissions.getFieldPermissionArgs(
      adminData);

    // Jira #2981 DA edit permissions changed to allow editing of withdrawn cases
    //If case is active or withdrawn and is DA you can edit proposedStatus
        if(isDeptAdmin && (actionDataInfo[0].actionStatusId===1 || actionDataInfo[0].actionStatusId===3)) {
            canEditProposedStatus = true;
        }

    //If you are school admin, OA, APO you can always edit it
    //Jira #2981 Allow Area Admins to edit because they can only see case summaries in their area anyway
        if(isOAOrAPO || isSchAdmin || isAreaAdmin) {
            canEditProposedStatus = true;
        }

        return {canEditProposedStatus};
    }

  /**
  *
  * @desc - Should be able to edit if you are SA, OA, or APO
  * @param {Object} opusCaseInfo -
  * @param {Object} adminData -
  * @return {Object} - Permission saying if user can edit finalDecision
  *
  **/
    getFinalDecisionPermissions(caseSummaryDataFromAPI, adminData = this.adminData) {
    //Extract if you are an OA or APO, school admin, or if case is completed
        let {isOAOrAPO, isSchAdmin, isDeptAdmin} = this.CasesAdminPermissions.getFieldPermissionArgs(adminData);
        let canDeptAdminEdit = false;
        if(isDeptAdmin){
      // if DA can complete case, they should be able to see the edit final decision modal
            canDeptAdminEdit = !this.CasesAdminPermissions.getCaseButtonPermissions(caseSummaryDataFromAPI.actionDataInfo[0], adminData);
        }

        let canEditFinalDecision = isOAOrAPO || isSchAdmin || (isDeptAdmin && canDeptAdminEdit);
        return {canEditFinalDecision};
    }


  /**
  *
  * @desc - Turn array of actionDataInfo into a Hash keyed by appointment ID
  * @param {Array} actionDataInfo - array of actionData
  * @return {Object} - Hash of actionDataInfo
  *
  **/
    keyActionDataByApptId(actionDataInfo = []) {
        return keyBy(actionDataInfo, "appointmentInfo.appointmentId");
    }


  /**
  *
  * @desc - gets visible fields of 'fieldData' passed in
  * @param {Object} fieldData -
  * @return {Object} visibleStatusFieldsByApptId - key(apptId) to value(fieldData)
  *
  **/
    getVisibleFieldData(fieldData = {}) {
        let visibleFieldData = super.getVisibleFieldData(fieldData);
        return visibleFieldData;
    }


  /**
  *
  * @desc - gets visible fields of 'fieldData' passed in
  * @param {Object} fieldData -
  * @return {Object} visibleStatusFieldsByApptId - key(apptId) to value(fieldData)
  *
  **/
    getVisibleFieldDataOfObject(fieldData = {}) {
        let visibleFieldData = {};
        for(let key in fieldData) {
            visibleFieldData[key] = this.getVisibleFieldData(fieldData[key]);
        }

        return visibleFieldData;
    }


  /**
  *
  * @desc - Create and format template for Profile Save
  * @param {Object} allFieldData - appointment to send to API
  * @param {Object} validateFieldNames - key value pair of fieldName to validation
  *  type.
  * @return {Object} - fieldData
  *
  **/
    validateAllFieldDataOnSave(allFieldData = {}, validateFieldNames = this.validateFieldNames) {
        super.validateAllFieldDataOnSave(allFieldData, validateFieldNames);

    // OPUS-6441 CF/CS: End Date is always available but only required for certain titles.
        this.validateApptEndDate(allFieldData);

        return allFieldData;
    }


  /**
  * @tag - Final Decision
  * @desc - Concat actionCategoryId & actionTypeId to get actionType
  * @param {Object} actionData - actionData from API
  * @return {String} actionType - '2-7', 3-1', etc
  *
  **/
    getActionTypeFromActionData(actionData) {
        let {actionTypeInfo: {actionCategoryId, actionTypeId}} = actionData;
        let actionType = `${actionCategoryId}-${actionTypeId}`;
        return actionType;
    }


/**
*
* @desc - Determine whether or not the user can view the tracking dates
* @param {Object} opusCaseInfo -
* @param {Object} adminData
* @return {boolean}
*
**/
    canViewTrackingDates(opusCaseInfo, adminData = this.adminData, casesAdminPermissions = this.CasesAdminPermissions) {
        let {isOAOrAPO, isVCAP, isCAP, isLibrarySchAdmin} = casesAdminPermissions.getFieldPermissionArgs(adminData);
        let hasExistingCaseInByC = this.hasExistingCaseInByC(opusCaseInfo);
        return (!hasExistingCaseInByC || (hasExistingCaseInByC && (isOAOrAPO || isVCAP || isCAP || isLibrarySchAdmin)));
    }

/**
*
* @desc - Figure out if the case already exists in Interfolio
* @param {Object} opusCaseInfo - contains the bycPacketId and packetTypeId
* @return {boolean} - boolean representing if the case exists in Interfolio
*
**/
    hasExistingCaseInByC(opusCaseInfo) {
        let {bycPacketId, packetTypeId} = opusCaseInfo;
        return bycPacketId && packetTypeId ? true : false;
    }

  /**
  *
  * @desc - Extract caseLocation fields from passed in fieldData
  * @param {Object} fieldData - fieldData that has caseLocation fields in it
  * @return {Object} caseLocation - extracted caseLocation fields
  *
  **/
    extractCaseLocationFieldsFromFieldData(fieldData = {}) {
        let caseLocation = {};

        for(let field in fieldData) {
            let {sectionName} = fieldData[field].attributeProperties;

            if(sectionName === "caseLocation") {
                caseLocation[field] = fieldData[field];
            }
        }

        return caseLocation;
    }

  /**
  *
  * @desc - Create fields for Case Location table
  * @param {String} caseSummaryDataFromAPI -
  * @param {String} casesApprovedAttrMap -
  * @return {Object} caseLocation - fieldData
  *
  **/
    createCaseLocationFieldData(caseSummaryDataFromAPI, casesApprovedAttrMap) {
    //Create approved fields, fill them with values and options
        let approvedStatusFields = this.FieldData.createFieldDataByAttributeProperties(
      casesApprovedAttrMap, {fieldDataOptions: fieldsInAPI});

        let caseLocation = this.extractCaseLocationFieldsFromFieldData(approvedStatusFields);

    //Have to create this template to get around Sony's naming of
    //attributeProperties paths of "opusCase" instead of "opusCaseInfo"
        let template = {opusCase: caseSummaryDataFromAPI.opusCaseInfo};

    //Case Location field data
        this.addValuesToFieldData(caseLocation, template);
        this.reformatDisplayValuesBasedOnViewType(caseLocation);

        return caseLocation;
    }

  /**
  *
  * @desc - Used to update dependent fields generally when field data changes
  * @param {Object} fieldData - all field data
  * @param {Object} nameOfChangedField - name of field that was changed
  * @return {Object} fieldData - update fieldData
  * MOSES AND CELIA - YOU CAN DELETE THIS. Only here for readbility.  If you do
  *   delete the corresponding empty test
  **/
    updateFieldDataByToggle(fieldData = {}, nameOfChangedField) {
        return super.updateFieldDataByToggle(fieldData, nameOfChangedField);
    }

  /*****************************************************************************
  *
  * @desc - By Committee workflow data
  *
  *****************************************************************************/
  /**
  *
  * @desc - Sort array of workflowSteps based on 'workFlowStepNumber'
  * @param {Array} workflowSteps -
  * @return {Object} sorted - sorted workflowSteps
  *
  **/
    sortWorkFlowSteps(workflowSteps) {
        return util.sortObjectArray(workflowSteps, {sort_key: "workFlowStepNumber"});
    }

  /**
  *
  * @desc - Extract fields from workflow steps and orders them
  * @param {Array} workflowSteps -
  * @return {Object} fieldData - update fieldData
  *
  **/
    createByWorkFlowData(workflowSteps = []) {
        let sorted = this.sortWorkFlowSteps(workflowSteps);

        let workFlowFields = [];
    //Iterate the sorted steps
        for(let {workFlowStepName, workFlowStepDt: date, workFlowStepNumber} of sorted) {
      //Format the date to be show on the UI
            let formattedDate = date ? moment(date).format("MM/DD/YYYY") : null;

      //Set the variables...
            let args = {name: workFlowStepName, value: formattedDate, workFlowStepNumber};

      //...and push it into array
            workFlowFields.push(args);
        }

        return workFlowFields;
    }

  /*****************************************************************************
  *
  * @desc - Having to do with Saving Analyst
  *
  *****************************************************************************/
  /**
  *
  * @desc - Saves data for apo analyst
  * @param {Number} aPOAnalystOpusId -
  * @param {Object} opusCaseInfo -
  * @return {Promise} - save request
  *
  **/
   saveAnalysts(apoAnalyst, deansOfficeAnalyst, departmentAnalyst, opusCaseInfo = {}) {
    let saveArgs = this.getSaveHeaders();
    let saveAnalystTemplate = this.formatAnalystSaveTemplate(
        apoAnalyst, deansOfficeAnalyst, departmentAnalyst, opusCaseInfo);
    console.log("Current save object:")
    console.log(saveAnalystTemplate)
    let url = this.getSaveAnalystUrl();

    return util.jqueryPostJson(url, saveAnalystTemplate, saveArgs);
}



  /**
  *
  * @desc - Formats the save template for apoAnalyst template
  * @param {Number} aPOAnalystOpusId -
  * @param {Object} opusCaseInfo -
  * @return {Object} saveAnalystTemplate - formatted template
  *
  **/
    formatAnalystSaveTemplate(apoAnalyst, deansOfficeAnalyst, departmentAnalyst, opusCaseInfo = {}) {
        let {adminData} = this;
        let {analystTemplate} = constants;

    //Transfer values to save template
        let saveAnalystTemplate = util.cloneObject(analystTemplate);

        saveAnalystTemplate.apoAnalystOpusId = apoAnalyst.name.value!==null ? apoAnalyst.name.value : "";
        saveAnalystTemplate.apoAnalystCaseAssignDate = apoAnalyst.date.value!==null ? apoAnalyst.date.value : "";
        saveAnalystTemplate.deanAnalystOpusId = deansOfficeAnalyst.name.value!==null ? deansOfficeAnalyst.name.value : "";
        saveAnalystTemplate.deanAnalystCaseAssignDate = deansOfficeAnalyst.date.value!==null ? deansOfficeAnalyst.date.value : "";
        saveAnalystTemplate.deptAnalystOpusId = departmentAnalyst.name.value!==null ? departmentAnalyst.name.value : "";
        saveAnalystTemplate.deptAnalystCaseAssignDate = departmentAnalyst.date.value!==null ? departmentAnalyst.date.value : "";

        saveAnalystTemplate.user = adminData.adminName;
        saveAnalystTemplate.caseId = opusCaseInfo.caseId;

        return saveAnalystTemplate;
    }

  /**
  *
  * @desc - Get apo analyst url with access_token
  * @param {Number} access_token -
  * @return {String} - formtted url w/ access_token added
  *
  **/
   getSaveAnalystUrl({access_token} = this) {
        return constants.urls.updateAnalyst + access_token;
    }



  /*****************************************************************************
  *
  * @desc - Having to do with Saving CaseLocation
  *
  *****************************************************************************/

  /**
  *
  * @desc - Gets CaseLocation save url
  * @param {Number} aPOAnalystOpusId -
  * @param {Object} opusCaseInfo -
  * @return {String} - CaseLocation url with access_token added
  *
  **/
    getSaveCaseLocationUrl() {
        return constants.urls.saveCaseLocation + this.access_token;
    }

  /**
  *
  * @desc - Gets default constants for save opusCaseInfo
  * @return {Object} opusCaseConstants -
  *
  **/
    getOpusCaseSaveConstants() {
        let opusCaseConstants = {
            isNewCase: "N",
            isDeptDatesChanged: "Y",
            isTrackingDatesChanged: "Y"
        };

        return opusCaseConstants;
    }

  /**
   *
   * @desc - Formates caseLocation data and then saves it
   * @param {Object} fieldData - fields to save
   * @param {Object} caseSummaryDataFromAPI - raw API data
   * @return {Object} appointment - the formatted appointment
   *
   **/
    saveCaseLocation(fieldData = {}, caseSummaryDataFromAPI = {}) {
    //Extract these to create template
        let {appointeeInfo, opusCaseInfo: opusCase} = caseSummaryDataFromAPI;

    //Lets get loggedInUserInfo
        let loggedInUserInfo = this.populateLoggedInUserInfoWithAdminData();

    //Generate template
        let opusCaseConstants = this.getOpusCaseSaveConstants();
        let template = {actionsData: [], appointeeInfo, opusCase, loggedInUserInfo};

    //Wipe out the fields if they are not seen
        this.setValueOfInvisibleFields(fieldData);

    //Place the fields in the template
        this.addFieldValuesToActionData(fieldData, template);

    //TODO ask Sony to change opusCase to opusCaseInfo on the API
        template.opusCase = {...opusCase, ...opusCaseConstants, ...template.opusCaseInfo};
        delete template.opusCaseInfo;
    //END of TODO

    //Stringify the template to save
        let stringifiedTemplate = this.stringify(template);

    //Get case location url to save
        let url = this.getSaveCaseLocationUrl();

    //Send the promise back
        return util.jqueryPostJson(url, stringifiedTemplate);
    }

  /*****************************************************************************
  *
  * @desc - Common Shortcut function
  *
  *****************************************************************************/


  /**
   *
   * @desc - Add the DeptCode and AHPathId to "academicHierarchyInfo"
   * @param {Object} fieldData -
   * @param {Object} appointment - proposed, approved, or current appointment
   * @return {Object} appointment - the formatted appointment
   *
   **/
    addAHPathAndDeptCodeToAppointment(fieldData = {}, appointment) {
    //Super class
        return this.addAHPathAndDeptCodeToApptFromFieldData(fieldData, appointment);
    }

  /**
   *
   * @desc - Add the APUId to appointment
   * @param {Object} fieldData -
   * @param {Object} appointment - proposed, approved, or current appointment
   * @return {Object} appointment - the formatted appointment
   *
   **/
    addApuCodeToApptByFieldDataApuId(fieldData = {}, appointment) {
    //Go to super class
        return super.addApuCodeToApptByFieldDataApuId(fieldData, appointment);
    }

  /**
   *
   * @desc - changes value of fields that are not editable
   * @param {Object} fieldData -
   * @param {Object} value - value to set uneditable fields
   * @return {Object} fieldData - fieldData that was passed in
   *
   **/
    setValueOfUneditableFields(fieldData = {}, value = null) {
        for(let name in fieldData) {
            if(!fieldData[name].editable) {
                fieldData[name].value = value;
            }
        }

        return fieldData;
    }

  /**
   *
   * @desc - Add the status fields to appointment
   * @param {Object} fieldData -
   * @param {Object} actionData -
   * @return {Object} appointment - the formatted appointment
   *
   **/
    addFieldValuesToActionData(fieldData, actionData = {}) {
        return this.addFieldValuesToTemplateByAttrPropsPath(fieldData, actionData);
    }

  /**
   *
   * @desc - Add only values of visible fields to actionData
   * @param {Object} fieldData -
   * @param {Object} actionData -
   * @return {Object} actionData - the formatted appointment
   *
   **/
    addVisibleFieldValuesToActionData(fieldData, actionData = {}) {
        let visibleFields = this.getVisibleFieldData(fieldData);


        return this.addFieldValuesToTemplateByAttrPropsPath(visibleFields, actionData);
    }

  /**
   *
   * @desc - Add the status fields to appointment
   * @param {Object} actionDataInfo -
   * @param {Object} opusCaseInfo -
   * @param {Object} - sectionName - 'proposed' 'approved'
   * @return {Object} actionData - newly cerated actionDataTemplate
   *
   **/
    formatActionDataTemplate(actionDataInfo, opusCaseInfo, {sectionName} = {}) {
        let actionData = {...util.cloneObject(actionDataTemplate), ...actionDataInfo,
      sectionName, caseId: opusCaseInfo.caseId};
        return actionData;
    }

  /**
   *
   * @desc - Get the deptCode.  If a proposed/approved value exists, use that one.
   * Otherwise, return the current deptCode
   * @param {Object} actionDataInfo -
   * @param {Object} ahPahtIdsToDeptCode -
   * @param {Object} proposedOrApprovedAppointmentInfo -
   * @param {Object} currentAppointmentInfo -
   * @return {String} deptCode
   *
   **/
    getDeptCodeForAPUList(aHPathIdsToDeptCode, proposedOrApprovedAppointmentInfo, currentAppointmentInfo) {
        let {academicHierarchyInfo: {academicHierarchyPathId: proposedOrApprovedAHPathId}} = proposedOrApprovedAppointmentInfo;
        let {academicHierarchyInfo: {academicHierarchyPathId: currentAHPathId}} = currentAppointmentInfo;
        let ahPathId = proposedOrApprovedAHPathId ? proposedOrApprovedAHPathId : currentAHPathId;
        let deptCode = aHPathIdsToDeptCode[ahPathId] || {};
        return deptCode;
    }

  /**
   *
   * @desc -  N/A Value in Step for lecturer series reference data changes
   * @param {Object} caseSummaryDataFromAPI -
   * @param {Object} fieldData -
   * @return {}
   *
   **/
    checkStepValueForLecturerSeries(actionDataInfo, fieldData, comingFrom) {
        if(actionDataInfo.actionStatusId>1 && actionDataInfo.actionStatusId<5){

      // Coming from either proposed or final decision
            let data = actionDataInfo.proposedAppointmentInfo.titleInformation;
            if(comingFrom==="approved"){
                let data = actionDataInfo.approvedAppointmentInfo.titleInformation;
            }

      // Find Specific Lecturer series and rank
            if(data.series==="Lecturer"
        && (data.rank.rankTypeDisplayText==="Lecturer PSOE"
        || data.rank.rankTypeDisplayText==="Lecturer SOE"
        || data.rank.rankTypeDisplayText==="Sr Lecturer SOE")
        && data.step.stepName==="N/A"
        && fieldData.step && fieldData.step.visibility===true
      ){
                fieldData.step.visibility = false;
            }
        }
        return fieldData;
    }
}
