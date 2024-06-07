import {get, uniq, keys, set, keyBy} from "lodash";


//My imports
import CaseFlow from "./CaseFlow";
import ActionType from "./ActionType";
import * as util from "../../../common/helpers/";
import {urls} from "../../constants/CasesConstants";
import FieldData from "../../../common/modules/FieldData";
import {fieldsInAPI} from "../../constants/FieldDataConstants";
import {proposedFieldValidations} from "../../constants/caseflow/ProposedFieldsValidation";
import {stringNotBlank} from "../../../common/helpers/validations";
import {Affiliations, constants, mergeOpusIdPaths} from
  "../../constants/caseflow/ProposedFieldsConstants.js";
import {appointmentInfoTemplate, actionsData, caseFlowTemplate} from
  "../../constants/CasesTemplates.js";
import * as ActionTypes from "../../constants/ActionCategoryType";

/**
*
* @classdesc Opus Logic class for ProposedFields in CaseFlow.
* @author - Leon Aburime
* @class ProposedFields
* @extends CaseFlow
*
**/
export default class ProposedFields extends CaseFlow {
    ActionType = null;
    selectedAppointment = [];
    FieldData = new FieldData();
    invalidValues = {null: true, "": true, undefined: true};

  /**
  *
  * @desc - On start get commonCall lists & init other Logic files used later
  * @param {Object} - adminData, globalData, ...args
  * @return {void}
  *
  **/
    constructor({adminData, globalData, ...args} = {}) {
        super({adminData, globalData, ...args});

    //Create formatted lists for the UI side
        this.formattedCommonCallLists = this.getFormattedListsFromCommonCallData(
      {adminData, globalData});
      // debugger;
    //Create ActionType class to get directions of how to create fieldData
        this.ActionType = new ActionType({adminData, globalData, ...args});
    }

  /**
  *
  * @desc - On start get commonCall lists & init other Logic files used later
  * @param {Object} - selectedPerson, actionType,  appointment, mergeOpusIdFlag,
  *  appointmentDirections
  * @return {void} - opusSortedAppointmentIds, proposedFields,
  *  apptDisplays, proposedAction, appointmentIds, statusFieldsTitlesByApptId,
  *  fieldData, appointmentTemplate, contactValue, proposedStatusByApptId,
  *  appointmentsByApptId
  *
  **/
    async initProposedFieldsFromAPIData({selectedPerson, actionType, appointment,
    appointmentDirections, mergeOpusIdFlag, prependUrl} = {}) {

    //Must set this to for toggling and validations
        this.configureClassFromActionType({actionType});

    //Key appointments by id to loop through later
        let appointmentsByApptId = this.getApptByApptIdfromAppointmentArray(
      appointment);

    //Create all needed fields for this modal
        let proposedFields = await this.getFieldData(actionType, appointment,
      {prependUrl});

    //Now extract the fields for whatever purpose
        let {proposedAction, proposedStatusByApptId, fieldData, appointmentTemplate,
      statusFieldsTitlesByApptId} = proposedFields;

        this.editFieldsByApptIdForActionTypeExceptions(proposedStatusByApptId,
      appointmentsByApptId, actionType);
        let appointmentIds = Object.keys(proposedStatusByApptId);

    //Get those appointment display blocks
        let apptIdsForCase = this.getApptIdsForCase(appointment, "proposedFields");
        let unarchivedAppts = this.getActiveApptsFromCasesData(selectedPerson.appointmentInfo);
        let apptDisplays = this.getDisplayFieldsFromAppointmentsForDisplayLayout(apptIdsForCase, unarchivedAppts);
        let endowedChairDisplays = [];
        if(actionType === ActionTypes.ENDOWED_CHAIR_APPT){
          endowedChairDisplays = this.getDisplayFieldsFromEndowedChairForDisplayLayout(apptIdsForCase); 
        }        
        let opusSortedAppointmentIds = this.getOpusSortedAppointmentIds(appointment);

        this.setClassData({appointmentsByApptId, proposedFields, actionType});

        return {opusSortedAppointmentIds, proposedFields, apptDisplays, endowedChairDisplays,
      proposedAction, appointmentIds, statusFieldsTitlesByApptId, fieldData,
      appointmentTemplate, proposedStatusByApptId, appointmentsByApptId};
    }



  /******* Section: Get AttributeProperties and create Field Data ***********/
  /**
  *
  * @desc - Get url that returns attributeProperties
  * @param {Object} actionType - action type to use
  * @return {String} - url to get cases attributes
  *
  **/
    getCaseAttrDataUrl(actionType, {access_token = this.access_token} = {}) {
        return urls.getCaseAttrData({actionType, access_token});
    }

  /**
  *
  * @desc -
  * @param {Object} actionType - actionType to use to get attribute properties
  * @param {String} prependUrl - if we need to prepend a string to the url
  * @return {Object} attrProps -
  *
  **/
    async getAttributePropertiesByActionTypeFromAPI(actionType =
    this.selectedActionType, prependUrl = "") {
        let url = prependUrl + this.getCaseAttrDataUrl(actionType);
        let attrProps = await util.fetchJson(url);
        return attrProps;
    }

  /**
  *
  * @desc - Takes care of having no appointments(default appt id of -1),
  *   1 appointment or  2 appointments(Appointment Set)
  * @param {Array} appointments - actionType to use to get attribute properties
  * @param {Object} defaultAppointmentId - actionType to use to get attribute properties
  * @return {Array} appointmentIds - array of appointmentIds
  *
  **/
    getAppointmentIds(appointments = []) {
        let appointmentIds = appointments.map(({appointmentId}) => appointmentId);
        return appointmentIds;
    }

  /**
  *
  * @desc - Adds values to proposedAction fields
  * @param {Array} proposedAction -
  * @param {Object} appointments -
  * @param {Object} actionType -
  * @return {Array} proposedAction -
  *
  **/
    formatProposedActionFields(proposedAction, appointments = [], actionType,
    formattedCommonCallLists = this.formattedCommonCallLists) {
    //Populate Proposed Action Fields
        if(appointments[0]) {
            this.prepopulateFieldDataFromAppointment(proposedAction, appointments[0]);
        }

    //Set actionType string
        let {actionTypeCodeToText} = formattedCommonCallLists;
        proposedAction.actionType.value = actionTypeCodeToText[actionType];

        return proposedAction;
    }

  /**
  *
  * @desc - Get the titles for each section of status fields unless its
  *   replicateSingleAppointment or pseudoNewAppointment
  * @param {Array} appointments - appointments
  * @return {Object} statusFieldsTitles - titles for each section of status
  *   fields
  *
  **/
    getStatusFieldsTitleTextFromAppointment(appointments = [{}], {pseudoNewAppointment
    = false, replicateSingleAppointment = false} = {}) {
    //Create holder for titles by appyId
        let statusFieldsTitles = {};

    //If either are true its a new appointment so add show titles
        if(replicateSingleAppointment || pseudoNewAppointment) {
            return statusFieldsTitles;
        }

        for(let each of appointments) {
            let {academicHierarchyInfo: {departmentName = ""} = {}, appointmentId,
        affiliationType: {affiliation = ""} = {}} = each;
            statusFieldsTitles[appointmentId] = `${departmentName} - ${affiliation}`;
        }
        return statusFieldsTitles;
    }

  /**
  *
  * @desc - Get directions for which appointment to make based on actionType
  * @param {Array} actionType -
  * @return {Object} - pseudoNewAppointment, replicateSingleAppointment
  *
  **/
    getActionTypeDirections(actionType = this.selectedActionType) {
    //Get booleans for informing how to create fields
        let directions = this.ActionType.getAppointmentTypeFromActionType(actionType);

    //Fields we need to inform how to create fields
        let {pseudoNewAppointment, replicateSingleAppointment} = directions;

        return {pseudoNewAppointment, replicateSingleAppointment};
    }

  /**
  *
  * @desc - Gets string values for yearsAtCurrentRankStep
  * @param {Object} fieldData - fieldData to be shown and updated
  * @param {Object} appointment - API appointment
  * @return {Object} fieldData - fieldData with values and displayText
  *
  **/
    prepopulateFieldDataFromAppointment(fieldData, appointment) {
        for(let name in fieldData) {
            let {attributeProperties: {prePopulate, pathToFieldDisplayText, pathToFieldValue} = {}}
        = fieldData[name];

            if(prePopulate) {
                fieldData[name].value = get(appointment, pathToFieldValue);
                fieldData[name].displayText = get(appointment, pathToFieldDisplayText);
            }
        }
        return fieldData;
    }

  /**
  *
  * @desc - For Joint and Split must replicate a single appointment that only
  *   has the appointmentId
  * @param {Object} originalAppointment -
  * @return {Object} apptTemplate - blank appointment w/ appointmentId
  *
  **/
    getReplicatedSingleAppointment(originalAppointment = {}) {
        let apptTemplate = util.cloneObject(appointmentInfoTemplate);

    //Attach appointmentId from the original appointment to the apptTemplate
        apptTemplate.appointmentId = originalAppointment.appointmentId;

        return apptTemplate;
    }


  /**
  *
  * @desc - For Appointment and Recall Appointment
  * @param {Object} defaultId - default Id is -1
  * @return {Object} apptTemplate -
  *
  **/
    getPseudoNewAppointment(defaultId = -1) {
        let apptTemplate = util.cloneObject(appointmentInfoTemplate);

    //Attach appointmentId from the original appointment to the apptTemplate
        apptTemplate.appointmentId = defaultId;

        return apptTemplate;
    }

  /**
  *
  * @desc - For Appointment and Recall Appointment
  * @param {Object} directions - whether pseudoNewAppointment, replicateSingleAppointment
  *   or not
  * @param {Array} appointments - appointments to extract information from
  * @return {Object} apptTemplate -
  *
  **/
    getAppointmentTemplateFromDirections(directions, appointments = []) {
        let {pseudoNewAppointment, replicateSingleAppointment} = directions;

        let appointmentTemplate = null;
        let noValidAppointment = Object.keys(appointments).length === 0;

    //Get very basic template w/ appointmentId
        if(replicateSingleAppointment) {
            appointmentTemplate = this.getReplicatedSingleAppointment(appointments[0]);

      //Turn appt into array
            appointmentTemplate = [appointmentTemplate];
        } else if (pseudoNewAppointment || noValidAppointment) {
      //Get appointmentTemplate w/ appointmentId of "-1"
            appointmentTemplate = this.getPseudoNewAppointment();

      //Turn appt into array
            appointmentTemplate = [appointmentTemplate];
        } else {
      //"appointments" should already be an array
            appointmentTemplate = appointments;
        }

        return appointmentTemplate;
    }

  /**
  *
  * @desc - For Appointment and Recall Appointment
  * @param {Object} directions - whether pseudoNewAppointment, replicateSingleAppointment
  *   or not
  * @param {Object} appointments - appointments to extract information from
  * @return {Object} proposedStatusByApptId - proposed status fields keyed by apptId
  *
  **/
    getProposedStatusByApptId(proposedStatusFields, appointmentIds = []) {
        let proposedStatusByApptId = {};
        appointmentIds.map(id => {
            proposedStatusByApptId[id] = util.cloneObject(proposedStatusFields);
        });

        return proposedStatusByApptId;
    }

  /**
  *
  * @desc - Gets common selectedPerson data needed for the UI
  * @param {Object} selectedPerson - selectedPerson API data
  * @param {Object} selectedAppointment - appointment
  * @return {viewData} - Data that will be shown on the front end
  *
  **/
    getViewDataFromSelectedPerson(selectedPerson = {}, selectedAppointment = {}) {
        let {yearsAtCurrentRankText, yearsAtCurrentStepText} =
      this.getYearsAtCurrentRankStepText(selectedAppointment);
        let jobNumber = this.getJobNumberFromSelectedPerson(selectedPerson);
        let jobNumberText = jobNumber ? `Recruit Tracking #: ${jobNumber}` : null;
        let {appointeeInfo: {fullName, uid} = {}} = selectedPerson;
        let viewData = {uid, fullName, yearsAtCurrentRankText, jobNumberText,
      yearsAtCurrentStepText};
        let doesNotExist = {"": true, null: true, undefined: true};
        if(jobNumber in doesNotExist && selectedPerson.appointmentInfo.length>0){
      //Only check for clock data if this is not the Recruit path
            viewData = this.getClockInfoFromSelectedPerson(viewData, selectedPerson);
        }
        if(selectedPerson.appointeeInfo.officialEmail){
            viewData.email = selectedPerson.appointeeInfo.officialEmail;
        }
        if(selectedPerson.appointeeInfo.hireDt) {
            viewData.hireDt = selectedPerson.appointeeInfo.hireDt;
        }
        return viewData;
    }

  /**
  *
  * @desc - inserts clock info into viewData only if it is there
  * @param {Object} viewData - data that will display on the ui
  * @param {Object} selectedPerson - selected person for case flow
  *
  **/
    getClockInfoFromSelectedPerson(viewData, selectedPerson){
        let apptInfo = selectedPerson.appointmentInfo[0];
        if(apptInfo.timeOffTheClock) {
            viewData.timeOffTheClock = apptInfo.timeOffTheClock;
        }
        if(apptInfo.yearsOnTheClock) {
            viewData.yearsOnTheClock = apptInfo.yearsOnTheClock;
        }
        if(apptInfo.serviceAsProposedEffDt) {
            viewData.serviceAsProposedEffDt = apptInfo.serviceAsProposedEffDt;
        }
        return viewData;
    }

  /**
  *
  * @desc -
  * @param {Object} selectedAppointment -
  * @return {Array} opusSortedAppointmentIds
  *
  **/
    getOpusSortedAppointmentIds(selectedAppointment = []) {
    //Get appts sorted by affiliation then department
        let opusSortedAppointments = this.sortAppointmentsByOpusStandards(
      selectedAppointment);

    //Extract the Ids
        let opusSortedAppointmentIds = opusSortedAppointments.map(e => e.appointmentId);

    //New appointment so default it to -1 -> set to appointmentsByApptId
        if(selectedAppointment.length === 0) {
            opusSortedAppointmentIds = [-1];
        }

        return opusSortedAppointmentIds;
    }


  /**
  *
  * @desc - 1. Gets Attribute Properties. Renders Field Data from attr props
  * @param {String} actionType - actionType to use to get attribute properties
  * @param {Object} appointments - actionType to use to get attribute properties
  * @param {String} - pseudoNewAppointment
  * @return {Object} -
  *
  **/
    async getFieldData(actionType = this.selectedActionType, appointments, {
    prependUrl = ""} = {}) {
    //Get attributes to create blank field data
        let attrProps = await this.getAttributePropertiesByActionTypeFromAPI(actionType,
      prependUrl);

    //Create blank fieldData from attributeProperties received from the API
        let fieldData = this.FieldData.createFieldDataByAttributeProperties(attrProps,
      {fieldDataOptions: fieldsInAPI});



    //Get directions on how to create fieldData
        let directions = this.getActionTypeDirections(actionType);

    //Will be either blank w/ appropriate appointId or appointments passed in
        let appointmentTemplate = this.getAppointmentTemplateFromDirections(directions,
      appointments, actionType);

        let appointmentIds = this.getAppointmentIds(appointmentTemplate);
    //let formattedCommonCallLists = this.getFormattedListsFromCommonCallData();

        let statusFieldsTitlesByApptId = this.getStatusFieldsTitleTextFromAppointment(
      appointments, directions);

    //Lets get the separated fields
        let {proposedAction, proposedStatus} =
      this.separateProposedActionAndStatusFieldsByAttrPropsSectionName(fieldData);

    //Add values to proposedAction fields
        this.formatProposedActionFields(proposedAction, appointmentTemplate, actionType);

        let {formattedCommonCallLists: commonCallLists} = this;

    //Add value options
        this.addOptionsListToFieldData(proposedAction, commonCallLists);


        let proposedStatusByApptId = this.getProposedStatusByApptId(proposedStatus,
      appointmentIds);
    //Lets add the values from appointments to status fields
        for(let appt of appointmentTemplate) {
            let {appointmentId: id} = appt;

      //Index fields by appointment to be formatted for this appointmentId
            let fields = proposedStatusByApptId[id];

      //Some fieldData has actionTypes across both types of appointment
            let proposedAppointmentInfo = {proposedAppointmentInfo: appt,
        appointmentInfo: appt};

      //Put values from appointment into fieldData
            this.prepopulateFieldDataFromAppointment(fields, proposedAppointmentInfo);

      //Add value options
            this.addOptionsListToFieldData(fields, commonCallLists);

      //Specifically add step options after titleCode options
            this.addStepOptionsByTitleCodeValue(fields, commonCallLists, "active");

      //Take care of multiple exception cases
            this.editFieldsForActionTypeExceptions(fields, appt, actionType);

      //Lets update the fields of series and rank
            this.FieldDataToggle.updateSeriesRankFromTitleCodeLogic(fields, commonCallLists);

      //Lets update the step field for visibility by options or values
            this.FieldDataToggle.updateStep(fields, commonCallLists, "active");

      //Lets update the endowedChairType
            this.FieldDataToggle.updateFieldDataByEndowedChairType(fields);

      //Lets update the apu, if applicable
            let {academicHierarchyInfo: {departmentCode}} = appt;
            this.FieldDataToggle.updateCasesAPUOptionsFromGlobalData(fields, departmentCode, commonCallLists);

            // Set Multiple Locations
            this.setMultipleLocations(fields, proposedAppointmentInfo, "caseSummary", "proposed");
        }

        return {appointmentTemplate, fieldData, proposedAction, statusFieldsTitlesByApptId,
      proposedStatusByApptId};
    }


  /***************************** End of Section *******************************/

  /**
  *
  * @desc - Handles Case Flow Proposed Fields specific exceptions
  * @param {Object} fieldData - all field data
  * @param {Object} appt - appointment
  * @param {String} actionType - actionType
  * @return void
  *
  **/
    editFieldsForActionTypeExceptions(fields, appt, actionType) {
        super.editFieldsForActionTypeExceptions(fields, appt, actionType);
        this.wipeHSCPFieldsForChangeAPUException(fields, actionType);
    }

  /**
  *
  * @desc - Wipes HSCP field values for the Change APU exception case
  * @param {Object} fieldData - all field data
  * @param {String} actionType - actionType
  * @return void
  *
  **/
    wipeHSCPFieldsForChangeAPUException(fieldData, actionType) {
    //Wipe HSCP fields if action type is Change APU
        if (actionType === ActionTypes.CHANGE_APU) {
            if(fieldData.hscpScale1to9) {
                fieldData.hscpScale1to9.value = null;
            }
            if(fieldData.hscpScale0) {
                fieldData.hscpScale0.value = null;
            }
            if(fieldData.hscpBaseScale) {
                fieldData.hscpBaseScale.value = null;
            }
            if(fieldData.hscpAddBaseIncrement) {
                fieldData.hscpAddBaseIncrement.value = null;
            }
        }
    }

  /**
  *
  * @desc - Gets the appointment that is "Primary".  If there is one then that
  *   is "Primary"
  * @param {Array} selectedAppointment - array of appointments
  * @return {Object} chosenAppt - chosenAppt
  *
  **/
    getPrimaryAppointment(selectedAppointment = []) {
        let chosenAppt = {};
    //Figure out which appointment is Primary
        if(selectedAppointment.length === 1) {
      //Take first appointment as it must be primary
            chosenAppt = selectedAppointment[0];
        } else if(selectedAppointment.length > 1) {
      //Filter out Primary appointment
            chosenAppt = selectedAppointment.filter(appointment =>
        appointment.affiliationType.affiliation === Affiliations.primary);

      //Set chosenAppt to Primary appt to extract data later
            chosenAppt = chosenAppt[0];
        }

        return chosenAppt;
    }

  /**
  *
  * @desc - Gets string values for yearsAtCurrentRankStep
  * @param {Object} selectedAppointment - selectedAppointment
  * @return {Object} - yearsAtCurrentRank/Step text
  *
  **/
    getYearsAtCurrentRankStep(selectedAppointment = this.selectedAppointment) {
        let chosenAppt = this.getPrimaryAppointment(selectedAppointment);

    //Extract text or nothing if not Primary appointment
        let {yearsAtCurrentRank, yearsAtCurrentStep} = chosenAppt || {};

        return {yearsAtCurrentRank, yearsAtCurrentStep};
    }

  /**
  *
  * @desc - get the actual text for yearsAtCurrentRank/Step
  * @param {Object} selectedAppointment - person chosen
  * @return {Object} - yearsAt text
  *
  **/
    getYearsAtCurrentRankStepText(selectedAppointment) {
        let yearsAtCurrentRankText = "";
        let yearsAtCurrentStepText = "";

        let {yearsAtCurrentRank, yearsAtCurrentStep} = this.getYearsAtCurrentRankStep(
      selectedAppointment);

        if(yearsAtCurrentRank && yearsAtCurrentStep) {
            yearsAtCurrentRankText = `Years at Current Rank: ${yearsAtCurrentRank}`;
            yearsAtCurrentStepText = `Years at Current Step: ${yearsAtCurrentStep}`;
        }
        return {yearsAtCurrentRankText, yearsAtCurrentStepText};
    }

  /**
  *
  * @desc - get a hash of appointments keyed by appointmentId
  * @param {Array} appointmentArray - array of appointments
  * @return {Object} - appointment hash keyed by appointmentId
  *
  **/
    getApptByApptIdfromAppointmentArray(appointmentArray = []) {
        let appointmentsByApptId = {};

    //Loop through to key appointments by appointmentId
        for(let appointment of appointmentArray) {
            appointmentsByApptId[appointment.appointmentId] = appointment;
        }
        return appointmentsByApptId;
    }

  /**
  *
  * @desc - extract job number from this person
  * @param {Object} selectedPerson - person chosen
  * @return {String} - job number
  *
  **/
    getJobNumberFromSelectedPerson(selectedPerson = this.selectedPerson) {
        let {appointeeInfo: {jobNumber} = {}} = selectedPerson;
        return jobNumber || "";
    }





  /**
  *
  * @desc - Formats the url that goes to Case Summary
  * @param {Object} - caseId, actionTypeId, actionCategoryId
  * @return {String} - finished url
  *
  **/
    getCaseCreatedUrl(caseId, actionType) {
        let [actionCategoryId, actionTypeId] = actionType.split("-");
        let args = util.jsonToUrlArgs({caseId, actionTypeId, actionCategoryId});
        return `/opusWeb/ui/admin/case-summary.shtml?${args}`;
    }

  /**
  *
  * @desc - AHPAthIds to be saved in opuscase depending on certain exceptions
  * @param {Object}  selectedAppointment -
  * @param {Object} selectedActionType -
  * @param {Object} ahPathIdConcatException -
  * @param {Object} - connector
  * @return {Array} ahPaths -
  *
  **/
    determineAdditionalAHPathIdsWithApptIdsForSave(selectedAppointment = [],
    selectedActionType = "", ahPathIdConcatException = constants.ahPathIdConcatException,
    {connector = "@"} = {}) {
        let ahPaths = [];
        if(!(selectedActionType in ahPathIdConcatException)) {
            ahPaths = selectedAppointment.map(each =>
        `${each.academicHierarchyInfo.academicHierarchyPathId}${connector}${each.appointmentId}`
      );
        }

        return ahPaths;
    }


  /**
  *
  * @desc - New fields added for ByC integration - this info is used to determine if a new user
  * needs to be created if a merge is happening with an inactive person.  Note that backend
  * needs these paths fields from the UID person because the Recruit person does not have eppn
  * or contactValue, which is needed by ByC.  As a result, there is a mix of how the fields are
  * populated in the newCaseFlowTemplates's appointeeInfo object - some fields are
  * from the Recruit person and some are from the UID person in the
  * case where a potential opusID merge is happening.
  * @param {Object} newCaseFlowTemplate -
  * @param {Object} mergeOpusId -
  * @param {Object} mergeOpusIdFlag -
  * @param {Object} selectedUIDPersonAppointeeInfo -
  * @return {Object} newCaseFlowTemplate -
  *
  **/
    handleOpusIdMerge(newCaseFlowTemplate, mergeOpusId, mergeOpusIdFlag,
    selectedUIDPersonAppointeeInfo = {}) {

        if (mergeOpusIdFlag === "Y") {
            newCaseFlowTemplate.appointeeInfo.mergeOpusId = mergeOpusId;

            let {paths} = mergeOpusIdPaths;

            for(let name in paths) {
                if(name==="contactValue" && (selectedUIDPersonAppointeeInfo.contactValue===""
          || selectedUIDPersonAppointeeInfo.contactValue===null)){
          // Do nothing
                }else{
                    set(newCaseFlowTemplate, paths[name], selectedUIDPersonAppointeeInfo[name]);
                }
            }
        }
        newCaseFlowTemplate.appointeeInfo.mergeOpusIdFlag = mergeOpusIdFlag;
        return newCaseFlowTemplate;
    }

  /**
  *
  * @desc - Get ahPathId from fieldData.departmentCode if that field exists
  * @param {Object} fieldData -
  * @return {Number} ahPathId - extracted ahPathId
  *
  **/
    getAHPathIdFromFieldData(fieldData = {}) {
        let ahPathId = null;

        if(fieldData.departmentCode) {
            ahPathId = fieldData.departmentCode.value;
        }

        return ahPathId;
    }

  /**
  *
  * @desc - Get blank caseFlowTemplate
  * @return {Object} -
  *
  **/
    getNewCaseFlowTemplate() {
        return {...util.cloneObject(caseFlowTemplate)};
    }

  /**
  *
  * @name formatAppointeeInfo
  * @desc - Add appointeeInfo and contactValue to template's appointeeInfo
  * @param {Object} newCaseFlowTemplate -
  * @param {Object} appointeeInfo -
  * @param {Object} - contactValue
  * @return {Object} -
  *
  **/
    formatAppointeeInfo(newCaseFlowTemplate = {}, appointeeInfo) {
    //Set appointeeInfo
        Object.assign(newCaseFlowTemplate.appointeeInfo, appointeeInfo,
      {...constants.defaultOpusIDMergeConstants});

        return newCaseFlowTemplate;
    }

  /**
  *
  * @desc - Get departmentCode by taking departmentCode.value and matching
  *   it up with ahPath from the common call lists
  * @param {Object} fieldData -
  * @param {String} ahPathId -
  * @return {Object} -
  *
  **/
    getDeptCodeFromAHPath(fieldData = {}, commonCallLists = this.formattedCommonCallLists) {
        let deptCodeByAHPath = null;
    //let {formattedCommonCallLists: commonCallLists} = this;

    //If departmentCode get deptCode from AHPath i.e. departmentCode.value
        if(fieldData.departmentCode) {
            let ahPathId = fieldData.departmentCode.value;
            let dataByAHPath = commonCallLists.ahPathToDepartment[ahPathId] || {};
            deptCodeByAHPath = dataByAHPath.departmentCode;
        }

        return deptCodeByAHPath;
    }

  /**
  *
  * @desc - Get departmentCode by taking departmentCode.value and matching
  *   it up with ahPath from the common call lists
  * @param {Object} ahPathIdByDeptCode -
  * @param {String} apptId -
  * @param {String} actionType -
  * @param {String} - dummyId is "-1" for appropriate appointments
  * @return {Array} allAHPathIdsWithApptIdsByDeptCode - array of ahPathIds with
  *   with dummyIds or appointments formatted for the backend
  *
  **/
    getAHPathToApptIds(ahPathIdByDeptCode, apptId, actionType, {dummyId = -1} = {}) {
        let {ahPathIdConcatException, dummyIdahPathIdConcatException} = constants;

        let allAHPathIdsWithApptIdsByDeptCode = null;

        if(ahPathIdByDeptCode) {
            if(actionType in ahPathIdConcatException || actionType in dummyIdahPathIdConcatException) {
                allAHPathIdsWithApptIdsByDeptCode = `${ahPathIdByDeptCode}@${dummyId}`;
            } else {
                allAHPathIdsWithApptIdsByDeptCode = `${ahPathIdByDeptCode}@${apptId}`;
            }
        }

        return allAHPathIdsWithApptIdsByDeptCode;
    }

  /**
  *
  * @desc - Create blank template and put constants in there.
  * @param {Object} newCaseFlowTemplate - template to put constants in
  * @param {String} concatenatedAHPathIds -
  * @param {String} - dummyId is "-1" for appropriate appointments
  * @return {Array} newCaseFlowTemplate -
  *
  **/
    getOpusCaseForNewCaseTemplate(newCaseFlowTemplate, concatenatedAHPathIds) {
    //Extract opus case constants
        let {caseFlowOpusCaseDefaults} = constants;

    //Add opusCase defaults & concatted academicHierarchyPathIds to template
        newCaseFlowTemplate.opusCase = {...newCaseFlowTemplate.opusCase,
      ...caseFlowOpusCaseDefaults, academicHierarchyPathIds: concatenatedAHPathIds};

        return newCaseFlowTemplate;
    }

  /**
  *
  * @desc - Assign appointmentId to actionsDataTemplate in certain cases
  * @param {Object} actionsDataTemplate - template to put constants in
  * @param {String} appointment -
  * @param {Object} appointmentSetList -
  * @param {String} actionType -
  * @return {Array} actionsDataTemplate -
  *
  **/
    handleSaveExceptionApptIdFromSelectedAppt(actionsDataTemplate, appointment,
    appointmentSetList = [], actionType) {
    //Extract actionTypes to make exceptions for when saving
        let {excludeAddlAppts, saveExceptionApptIdFromSelectedAppt} = constants;

    //Set correct apptId for certain action types
        if(actionType in saveExceptionApptIdFromSelectedAppt ||
      (actionType in excludeAddlAppts && appointmentSetList.length === 0)) {
            actionsDataTemplate.appointmentInfo.appointmentId = appointment.appointmentId;
        }

        return actionsDataTemplate;
    }

  /**
  *
  * @desc - Put actionCategoryId & actionTypeId into template
  * @param {Object} template - actionsDataTemplate to modify
  * @param {Object} actionType - actionType for this template
  * @return {void}
  *
  **/
    formatTemplateWithActionTypeData(template, actionType) {
        let [actionCategoryId, actionTypeId] = actionType.split("-");

    //Assign by reference in memory
        Object.assign(template.actionTypeInfo, {actionCategoryId, actionTypeId});

        return template;
    }

  /**
  *
  * @desc - Creates blank actionsDataTemplate with constants filled in
  * @param {Object} appointmentInfo - appointmentInfo to overlow onto actionsData
  * @return {void}
  *
  **/
    createActionsDataTemplate(appointmentInfo = {}) {
        let {caseFlowAppointmentStatusData} = constants;

    //Add all the parts into one actionData template
        let actionsDataTemplate = {...util.cloneObject(actionsData), appointmentInfo,
      sectionName: "proposed", ...caseFlowAppointmentStatusData};

        return actionsDataTemplate;
    }

  /**
  *
  * @desc - Concatenate all ahPath@DeptCode and ahPath@Appt ids and separate
  *   them by commas
  * @param {Object} allAHPathIdsWithApptIdsByDeptCode -
  * @param {String} appointmentAHPathIdsWithApptsIds -
  * @return {String} concatenatedAHPathIds
  *
  **/
    formatConcatenatedAHPathIds(allAHPathIdsWithApptIdsByDeptCode,
    appointmentAHPathIdsWithApptsIds) {
        let concatenatedAHPathIds = uniq([...allAHPathIdsWithApptIdsByDeptCode,
      ...appointmentAHPathIdsWithApptsIds]).join(",");

        return concatenatedAHPathIds;
    }

  /**
  *
  * @desc - If valid ahPath add it to proposedAppointmentInfo's academicHierarchyPathId
  * @param {Object} actionsDataTemplate -
  * @param {String} ahPathIdByDeptCode -
  * @return {String} concatenatedAHPathIds
  *
  **/
    setAHPathByDeptCodeInAppointment(actionsDataTemplate, ahPathIdByDeptCode) {
        if(ahPathIdByDeptCode) {
            actionsDataTemplate.proposedAppointmentInfo.academicHierarchyInfo.academicHierarchyPathId
        = ahPathIdByDeptCode;
        }

        return actionsDataTemplate;
    }

    /**
    *
    * @desc - If valid endowedChairId add it to actionData proposedEndowedChairId
    * @param {Object} actionsDataTemplate -
    * @param {String} endowedChair -
    * @return {String} endowedChairId
    *
    **/
    setProposedEndowedChairId(actionsDataTemplate, endowedChair) {
        if(endowedChair !== undefined && endowedChair.endowedChairId) {
            actionsDataTemplate.proposedEndowedChairId = endowedChair.endowedChairId;
        }

        return actionsDataTemplate;
    }

    /**
    *
    * @desc - If valid proposedTermEndDate add it to actionData proposedTermEndDate
    * @param {Object} actionsDataTemplate -
    * @param {String} proposedStatusFields -
    * @return {String} proposedTermEndDate
    *
    **/
    setProposedTermEndDate(actionsDataTemplate, proposedStatusFields) {
        if(proposedStatusFields.chairApptEndDate !== undefined && proposedStatusFields.chairApptEndDate.value) {
            actionsDataTemplate.proposedTermEndDate = proposedStatusFields.chairApptEndDate.value;
        }

        return actionsDataTemplate;
    }

  /**
  *
  * @desc - Sets deptCode into appointment
  * @param {Object} appointment -
  * @param {String} deptCodeByAHPath -
  * @return {Object} appointment
  *
  **/
    setDeptCodeInAppt(appointment, deptCodeByAHPath) {
        appointment.academicHierarchyInfo.departmentCode = deptCodeByAHPath;

        return appointment;
    }

  /**
  *
  * @desc - Wipe out appointmentInfo for certain actionTypes
  * @param {Object} actionsDataTemplate - actionsDataTemplate to modify
  * @param {String} actionType - actionType for this template
  * @param {Object} saveType - If exceptionType, recruit type or normal save
  * @return {Object} actionsDataTemplate
  *
  **/
    formatActionsTemplateByActionAndSaveType(actionsDataTemplate, actionType, saveType) {
        if(actionType in constants.saveExceptionActionTypes ||
      saveType.toLowerCase() === "recruit") {
            actionsDataTemplate.appointmentInfo = util.cloneObject(actionsData.appointmentInfo);
        }

        return actionsDataTemplate;
    }

  /**
  *
  * @desc - Wipe out appointmentInfo for certain actionTypes
  * @param {Object} appointment - actionsDataTemplate to modify
  * @param {String} proposedActionFields - actionType for this template
  * @param {Object} proposedStatusFields - If exceptionType, recruit type or normal save
  * @param {Object} - actionType, saveType, selectedPerson
  * @return {Object} actionsDataTemplate
  *
  **/
    getFormattedActionsDataTemplate(appointment, proposedActionFields, proposedStatusFields,
  {actionType, saveType, selectedPerson, endowedChair} = {}) {
        let actionsDataTemplate = this.createActionsDataTemplate(appointment);

        this.formatTemplateWithActionTypeData(actionsDataTemplate, actionType);

    //If deptCode this will be the ahPathId
        let ahPathIdByDeptCode = this.getAHPathIdFromFieldData(proposedStatusFields);

    //Get deptCode from the ahPath already in fieldData.departmentCode
        let deptCodeByAHPath = this.getDeptCodeFromAHPath(proposedStatusFields);

    //If ahPath set it in proposedAppointmentInfo from actionDataTemplate
        this.setAHPathByDeptCodeInAppointment(actionsDataTemplate, ahPathIdByDeptCode);

    
    this.setProposedEndowedChairId(actionsDataTemplate, endowedChair);

    this.setProposedTermEndDate(actionsDataTemplate, proposedStatusFields);

    //Add proposedAction fields to actionsDataTemplate
        this.omitFieldsFromFieldData(proposedActionFields, ["actionType"]);
        this.addFieldValuesToTemplateByAttrPropsPath(proposedActionFields,
      actionsDataTemplate);

    //Add proposedStatus fields to actionDataTemplate
        let {proposedAppointmentInfo, approvedAppointmentInfo} = actionsDataTemplate;

    //Manually set dept code when starting a case

    //Put the values from the fields into actionDataTemplate
        this.omitFieldsFromFieldData(proposedStatusFields);

    //Sets scale type id to -1 if not editable and visible (needs to be here before copying over to proposed)
    // #scaleTypeId=-1  Jira  #3048 #3050 #2427
        if(proposedStatusFields.scaleType && !proposedStatusFields.scaleType.visibility){
            proposedStatusFields.scaleType.value = -1;

            if(approvedAppointmentInfo.salaryInfo && approvedAppointmentInfo.salaryInfo.academicProgramUnit){
                approvedAppointmentInfo.salaryInfo.academicProgramUnit.scaleTypeId = -1;
            }
        }

    //Now set values from fieldData into proposedAppointmentInfo
        this.addFieldValuesToTemplateByAttrPropsPath(proposedStatusFields,
      {proposedAppointmentInfo, appointmentInfo: proposedAppointmentInfo});

    //Manually set apuId code when starting a case
        this.addApuCodeToApptByFieldDataApuId(proposedStatusFields, proposedAppointmentInfo);

    //Setting APUId to 0 and APUCode to N/A must be AFTER "addApuCodeToApptByFieldDataApuId"
        this.editAPUValueByVisibility(proposedStatusFields, proposedAppointmentInfo);

    //Clear apuDesc
        this.wipeApuDesc(appointment, "cases-proposed");

        this.setDeptCodeInAppt(proposedAppointmentInfo, deptCodeByAHPath);

    //Wipe out appointmentInfo for certain actionTypes
        this.formatActionsTemplateByActionAndSaveType(actionsDataTemplate, actionType,
      saveType);

    //Set correct apptId for certain action types
        this.handleSaveExceptionApptIdFromSelectedAppt(actionsDataTemplate, appointment,
      selectedPerson.appointmentSetList, actionType);

        return actionsDataTemplate;
    }

  /**
  *
  * @desc - Gets an array of ahPaths from department code and concat it with
  *   appointmentId
  * @param {Object} proposedStatusFieldsByApptId -
  * @param {Object} uniqueApptIds -
  * @param {Object} actionType -
  * @return {Array} allAHPathIdsWithApptIdsByDeptCode
  *
  **/
    getAHPathIdsWithApptIdsByDeptCode(proposedStatusFieldsByApptId, uniqueApptIds,
    actionType) {
        let allAHPathIdsWithApptIdsByDeptCode = [];

        for(let apptId of uniqueApptIds) {
            let proposedStatusFields = proposedStatusFieldsByApptId[apptId] || {};

      //If deptCode this will be the ahPathId
            let ahPathIdByDeptCode = this.getAHPathIdFromFieldData(proposedStatusFields);

            if(ahPathIdByDeptCode) {
                let ahPathIdsWithApptIdsByDeptCode = this.getAHPathToApptIds(ahPathIdByDeptCode,
          apptId, actionType);
                allAHPathIdsWithApptIdsByDeptCode.push(ahPathIdsWithApptIdsByDeptCode);
            }
        }

        return allAHPathIdsWithApptIdsByDeptCode;
    }

  /**
  *
  * @desc - Go through each appointment and format each actionsData using
  *   action and status fields
  * @param {Object} appointmentsById -
  * @param {Object} proposedActionFields -
  * @param {Object} proposedStatusFieldsByApptId -
  * @param {Object} - uniqueApptIds, actionType, saveType, selectedPerson
  * @return {Array} allActionsData - all formatted actionsData template
  *
  **/
    getAllFormattedActionDataTemplates(appointmentsById, proposedActionFields,
    proposedStatusFieldsByApptId, {uniqueApptIds, actionType, saveType,
      selectedPerson, endowedChair} = {}) {
        let allActionsData = [];

        for(let apptId of uniqueApptIds) {
      //Fresh new object
            let appointment = appointmentsById[apptId] || {};

      //Get proposedStatus by appointmentId
            let proposedStatusFields = proposedStatusFieldsByApptId[apptId] || {};

      //Get each actionsData
            let actionsDataTemplate = this.getFormattedActionsDataTemplate(appointment,
        proposedActionFields, proposedStatusFields, {actionType, saveType,
        appointmentId: apptId, selectedPerson, endowedChair});

            // Change location from location id
            actionsDataTemplate = this.setLocationForSave(proposedStatusFields, actionsDataTemplate, "proposed");

            // IOK-1097 Send endowedChairHolderAppointmentId=null
            actionsDataTemplate.endowedChairHolderAppointmentId = null;

            allActionsData.push(actionsDataTemplate);
        }

        return allActionsData;
    }



  /**
  *
  * @desc - Replace broken up functions in this function
  * @param {Object} proposedActionFields -
  * @param {Object} proposedStatusFieldsByApptId -
  * @param {Object} chosenAppointments -
  * @param {Object} - lots of args
  * @return {Object} -
  *
  **/
    formatNewCaseTemplateForSave(chosenAppointments = [], proposedActionFields = {},
    proposedStatusFieldsByApptId = {}, {saveType = "", selectedPerson = {}, actionType,
    endowedChair, appointmentTemplate} = {}) {
        let appointmentsById = keyBy(chosenAppointments, "appointmentId");

    //Make appointment an array no matter what
        let appointments = Array.from(chosenAppointments || []);

    //Create object template that will be saved how the db wants it
        let newCaseFlowTemplate = this.getNewCaseFlowTemplate();

    //Set appointeeInfo data
        this.formatAppointeeInfo(newCaseFlowTemplate, selectedPerson.appointeeInfo);

        let apptTemplatesById = keyBy(appointmentTemplate, "appointmentId");
        let uniqueApptIds = uniq([...keys(apptTemplatesById), ...keys(proposedStatusFieldsByApptId)]);

        newCaseFlowTemplate.actionsData = this.getAllFormattedActionDataTemplates(
      appointmentsById, proposedActionFields, proposedStatusFieldsByApptId,
      {uniqueApptIds, actionType, saveType, selectedPerson, endowedChair});

        newCaseFlowTemplate.loggedInUserInfo = this.populateLoggedInUserInfoWithAdminData();

        let appointmentAHPathIdsWithApptsIds = this.determineAdditionalAHPathIdsWithApptIdsForSave(
      appointments, actionType);

        let allAHPathIdsWithApptIdsByDeptCode = this.getAHPathIdsWithApptIdsByDeptCode(
      proposedStatusFieldsByApptId, uniqueApptIds, actionType);

    //AHPath ids from dropdown and selected appointments
        let concatenatedAHPathIds = this.formatConcatenatedAHPathIds(
      allAHPathIdsWithApptIdsByDeptCode, appointmentAHPathIdsWithApptsIds);

    //Add opusCase defaults & concatted academicHierarchyPathIds to template
        this.getOpusCaseForNewCaseTemplate(newCaseFlowTemplate, concatenatedAHPathIds);

        return newCaseFlowTemplate;
    }

  /**
  *
  * @desc - Goes through all proposed fields to test if there are errors
  * @param {Object} proposedActionFields -
  * @param {Object} proposedStatusFieldsByApptId -
  * @return {Boolean} hasErrors
  *
  **/
    doProposedFieldsHaveErrors(proposedActionFields, proposedStatusFieldsByApptId) {
    //Do top action fields have errors
        let hasErrors = this.doFieldsHaveErrors(proposedActionFields);

    //Do status fields have errors? && = 'and' to find out
        for(let [, fieldData] of Object.entries(proposedStatusFieldsByApptId)) {
            hasErrors = hasErrors || this.doFieldsHaveErrors(fieldData);
        }
        return hasErrors;
    }

  /**
  *
  * @desc - Validates all fields onBlur and add errors if needed
  * @param {Object} fieldData -
  * @param {Object} validateFieldNames - validations specific to proposedFields
  * @return {Object} fieldData -
  *
  **/
    validateFieldOnBlur(fieldData = {}, validateFieldNames = proposedFieldValidations) {
        super.validateFieldOnBlur(fieldData, validateFieldNames);
        return fieldData;
    }



  /**
  *
  * @desc - Validates all fields and add errors if needed
  * @param {Object} proposedActionFields -
  * @param {Object} proposedStatusFieldsByApptId -
  * @return {Object} - proposedActionFields & proposedStatusFieldsByApptId
  *
  **/
    validateProposedFields(proposedActionFields, proposedStatusFieldsByApptId) {

    //Validate these fields
        this.validateAllFieldDataOnSave(proposedActionFields, proposedFieldValidations);

    //Do status fields have errors? && = 'and' to find out
        for(let [, fieldData] of Object.entries(proposedStatusFieldsByApptId)) {
            this.validateAllFieldDataOnSave(fieldData, proposedFieldValidations);

            // OPUS-6441 CF/CS: End Date is always available but only required for certain titles.
            this.validateApptEndDate(fieldData);

            // IOK-1137 Custom validation for endowed chair appts.
            if(fieldData.selectedEndowedChair && fieldData.endowedChair.visibility && fieldData.selectedEndowedChair.visibility){
              this.validatedEndowedChairFields(fieldData);
            }
        }

    //Return if all fields have passed validations
        return {proposedActionFields, proposedStatusFieldsByApptId};
    }

    validatedEndowedChairFields = (fieldData) => {
      if(!fieldData.selectedEndowedChair.value){
        fieldData.selectedEndowedChair.hasError = true;
        fieldData.selectedEndowedChair.error = "May not be blank on Save.";
        fieldData.endowedChair.hasError = true;
      }else{
        fieldData.selectedEndowedChair.hasError = false;
        fieldData.selectedEndowedChair.error = null;
        fieldData.endowedChair.hasError = false;
      }
      return fieldData;
    }


  /**
  *
  * @desc - Get the relevant field values to display in appt. sets
  * @param {Object} proposedActionFields -
  * @param {Object} proposedStatusFieldsByApptId -
  * @param {Object} appointments -
  * @param {Object} - mergeOpusId, mergeOpusIdFlag, selectedUIDPersonAppointeeInfo
  * @return {Promise} - save promise
  *
  **/
    createACase(appointments = [], proposedActionFields = {}, proposedStatusFieldsByApptId = {},
    {mergeOpusId, mergeOpusIdFlag, selectedUIDPersonAppointeeInfo, endowedChair,
      appointmentTemplate, selectedPerson, ...options} = {}) {
    //Create the template to be saved
        let newCaseFlowTemplate = this.formatNewCaseTemplateForSave(appointments,
      proposedActionFields, proposedStatusFieldsByApptId, {mergeOpusId, mergeOpusIdFlag,
        endowedChair, appointmentTemplate, selectedPerson, ...options});

    //Handle opusId merge. Celias section
        newCaseFlowTemplate = this.handleOpusIdMerge(newCaseFlowTemplate, mergeOpusId, mergeOpusIdFlag,
      selectedUIDPersonAppointeeInfo);

        return newCaseFlowTemplate;
    }

  /**
  *
  * @desc - Url for save
  * @param {Object} url - base url
  * @param {Object} access_token - access_token
  * @return {String} - formatted url
  *
  **/
    getCreateCaseUrl(url = urls.saveCase, access_token = this.access_token) {
        return urls.saveCase + access_token;
    }

    addProposedActionFlagsToTemplate(template, proposedActionFlags){
        for(let index in proposedActionFlags) {
            let proposedActionFlagName = proposedActionFlags[index].name;
            if(proposedActionFlags[index].actionTypeInfoField){
                template.actionsData[0].actionTypeInfo[proposedActionFlagName] = proposedActionFlags[index].checked;
            }else{
                template.actionsData[0][proposedActionFlagName] = proposedActionFlags[index].checked;
            }
        }
        return template;
    }

  /**
  *
  * @desc - Stringify template and send to API
  * @param {Object} template -
  * @param {Object} url -
  * @param {Object} access_token -
  * @return {Promise} - promise to be resolved
  *
  **/
    saveNewCaseToAPI(appointments = [], proposedActionFields = {}, proposedStatusFieldsByApptId = {},
    {mergeOpusId, mergeOpusIdFlag, selectedUIDPersonAppointeeInfo, endowedChair,
      appointmentTemplate, proposedActionFlags, selectedPerson, ...options} = {}) {
    //Gets formatted template to create case
        let template = this.createACase(appointments, proposedActionFields,
      proposedStatusFieldsByApptId, {mergeOpusId, mergeOpusIdFlag, selectedUIDPersonAppointeeInfo,
        endowedChair, appointmentTemplate, selectedPerson, ...options});

    //Gets formatted url
        let createCaseUrl = this.getCreateCaseUrl();

    // Add proposed action flags to template
        template = this.addProposedActionFlagsToTemplate(template, proposedActionFlags);

    //Stringify template for api
        let stringifiedTemplate = this.stringify(template);

    //For Debugging purposes print template being sent to api
        console.log("New Proposed Data Sent to API", template);

    //Now save it and return the promise
        return util.jqueryPostJson(createCaseUrl, stringifiedTemplate);
    }


}
