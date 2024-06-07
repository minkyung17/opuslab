import {get, filter} from "lodash";

//Import local files
import {Cases} from "./Cases";
import * as util from "../../common/helpers/";
import {urls, constants} from "../constants/CasesConstants";
import * as ActionTypes from "../constants/ActionCategoryType";
import FieldDataToggle from "./toggles/CaseDossierFieldDataToggle";
import {fieldNamesValidation, validationsByActionType} from "../constants/FieldDataValidations";
import CasesAdminPermissions from "../../common/modules/CasesAdminPermissions";
import {proposedActionFlags} from "../constants/CasesConstants";

/**
*
* @classdesc Class that has all common functionalities for Case Summary &
*   Case Flow
* @author - Leon Aburime
* @class Cases
* @extends Opus
*
**/
export default class CasesDossier extends Cases {

  /**
  *
  * Instance variables
  *
  **/
    actionTypes = {};
    actionOutcomes = {};
    FieldDataToggle = new FieldDataToggle();
    validateFieldNames = fieldNamesValidation;
    CasesAdminPermissions = new CasesAdminPermissions(this.adminData);


  /**
  *
  * @desc - Set actionType, actionCategoryId, actionTypeId. Change validations
  *   by actionType
  * @param {String} - actionType, actionCategoryId, actionTypeId
  * @return {void}
  *
  **/
    configureClassFromActionType({actionType, actionCategoryId, actionTypeId} = {}) {
        this.setActionTypeData({actionType, actionCategoryId, actionTypeId});

        this.updateValidationsByActionType(this.actionType);
    }

  /**
  *
  * @desc - Some validations are nullified by actionType
  * @param {String} actionType - actionType
  * @return {void}
  *
  **/
    updateValidationsByActionType(actionType = this.actionType) {
    //Title Code has validations removed for "End Appointment"
        if(actionType === ActionTypes.END_APPOINTMENT) {
            this.validateFieldNames = {...this.validateFieldNames,
        ...validationsByActionType.endAppointment};
        }
    }

  /**
  *
  * @desc - Sets the actionCategoryId, actionTypeId, and formatted actionType
  * @param {Object} actionDataInfo - fields to use and show
  * @return {void}
  *
  **/
    initVariablesFromActionDataInfo(actionDataInfo = []) {
        let {actionTypeInfo: {actionCategoryId, actionTypeId}} = actionDataInfo[0];
        this.setActionTypeData({actionCategoryId, actionTypeId});
    }

  /**
  *
  * @desc - Sets the actionCategoryId, actionTypeId, and formatted actionType
  * @param {Object} - actionType, actionCategoryId, actionTypeId
  * @return {void}
  *
  **/
    setActionTypeData({actionType, actionCategoryId, actionTypeId} = {}) {
        if(actionType) {
            [actionCategoryId, actionTypeId] = actionType.split("-");
        } else if(actionCategoryId && actionTypeId) {
            actionType = `${actionCategoryId}-${actionTypeId}`;
        }

        this.setClassData({actionCategoryId, actionTypeId, actionType});
    }

  /**
   *
   * @desc - Excludes archived appointments
   * @param {Object} appointmentInfo -
   * @return {Array} - array of appointments that are not archived
   *
   **/
    getActiveApptsFromCasesData(appointmentInfo = []) {
        let appointments = [];
        for(let index in appointmentInfo){
            if(appointmentInfo[index].appointmentStatusType.toLowerCase() !== "archived"
        && appointmentInfo[index].appointmentStatusType.toLowerCase() !== "removed"){
                appointments.push(appointmentInfo[index]);
            }else if(appointmentInfo[index].appointmentStatusType.toLowerCase() === "archived" &&
        appointmentInfo[index].typeOfReq === "hasCases"){
                appointments.push(appointmentInfo[index]);
            }else if(appointmentInfo[index].appointmentStatusType.toLowerCase() === "removed" &&
        appointmentInfo[index].typeOfReq === "hasCases"){
          // Jira #3144 Added removed condition for appointment block
                appointments.push(appointmentInfo[index]);
            }
        }

        return appointments;
    }

  /**
  *
  * @desc - Gets url for case attributes
  * @param {String} actionType - ex. '2-7' i.e. Merit
  * @param {Object} access_token - access token
  * @return {String} - url
  *
  **/
    getCaseAttrDataUrl = (actionType, access_token = this.access_token) =>
    urls.getCaseAttrData({actionType, access_token});

  /**
  *
  * @desc -
  * @param {Array} actionCategoryId - ex. '2-7' or Merit
  * @param {Object} access_token -
  * @return {Promise}
  *
  **/
    async getCaseAttrData(actionCategoryId, {access_token} = this) {
        let url = this.getCaseAttrDataUrl(actionCategoryId, access_token);
        let data = await util.fetchJson(url);
        return data;
    }

  /**
  *
  * @desc - Requirement for joint and split appt action where it shows additional
  *    as their affiliation and disabled because user can't change an joint/split
  *    affiliation because they can added only as additional appointment
  * @param {Object} fieldData -
  * @param {String} actionType - action types such as 3-1, 2-7
  * @param {String} affiliationExceptionActionTypes - Action types that are valid
  * for so we can prepopulate affiliation for this set of fieldData
  * @return {Object} - field values that are now populated
  *
  **/
    handleJointSplitAffiliationException(fieldData, actionType, affiliationExceptionActionTypes
    = constants.jointSplitAffiliationExceptionActionTypes) {
        let {affiliation} = fieldData;
        if(!affiliation) {
            return fieldData;
        }

        if(actionType in affiliationExceptionActionTypes) {
            let {displayText, value} = affiliationExceptionActionTypes[actionType];
            affiliation.value = value;
            affiliation.displayValue = displayText;
        }

        return fieldData;
    }

  /**
  *
  * @desc - Edit fields for various exception cases
  * @param {String} fieldsByApptId - proposedStatus fieldData keyed by apptId
  * @param {Object} appointmentsByApptId - actionType to use to get attribute properties
  * @param {Object} actionType -
  * @return {Object} -
  *
  **/
    editFieldsByApptIdForActionTypeExceptions(fieldsByApptId = {}, appointmentsByApptId,
    actionType) {
        for(let [id, appointment] of Object.entries(appointmentsByApptId)) {
            this.editFieldsForActionTypeExceptions(fieldsByApptId[id], appointment,
        actionType);
        }
        return fieldsByApptId;
    }

  /**
  *
  * @desc - Will have to edit proposedFields with exception cases for case flow
  * @param {String} fieldData - proposedStatus fieldData keyed by apptId
  * @param {Object} appointment - actionType to use to get attribute properties
  * @param {Object} actionType -
  * @return {Object} -
  *
  **/
    editFieldsForActionTypeExceptions(fieldData = {}, appointment, actionType, actionDataInfo = {}) {

    //Get automatic values for affiliation in Joint/Split action type
        this.handleJointSplitAffiliationException(fieldData, actionType);

        this.handleEmeritusChangeForEndAppt(fieldData, appointment, actionType);

        this.setTitleCodeOptionsByActionType(fieldData, actionType);

        this.setTitleCodeOptionsForPromotion(fieldData, appointment, actionType, actionDataInfo);

        return fieldData;
    }


  /**
  *
  * @desc - If case is Recall, Uni18TempAugContAPt, or Promotion then updated
  *   the titleCode options
  * @param {String} fieldData - proposedStatus fieldData keyed by apptId
  * @param {Object} appointment - actionType to use to get attribute properties
  * @param {Object} actionType -
  * @return {Object} -
  *
  **/
    setTitleCodeOptionsByActionType(fieldData, actionType) {
    //Is actionType '1-10', '3-27', '3-32'
        if(actionType in constants.filteredTitleCodeByActionType) {
      //Get filtered titleCodes and set them
            let restrictedTitleCodes = this.getRestrictedTitleCodeLists(actionType);

      //Filter titleCodes
            let formattedTitleCodes = util.arrayOfObjectsToKVObject(restrictedTitleCodes,
        "titleCodeId", "titleName");

      //Now set the options whatever it may be, filtered or not
            fieldData.titleCode.options = formattedTitleCodes;
        }
    }

  /**
  *
  * @desc - Extract value from appointment and set it into an object along with
  *   a key.
  * @param {Object} appointment - appt
  * @param {Object} fieldName - name of field to extract
  * @param {Object} valueToPath - path to value in appointment
  * @return {Object}
  *
  **/
    createFilterFieldFromExtractedApptValue(appointment, fieldName, valueToPath) {
        let value = get(appointment, valueToPath);
        let filterValue = {[fieldName]: value}; // i.e. {Series: 'Assistant'}

        return filterValue;
    }

  /**
  *
  * @desc - Make title code restricted list for a handful of title codes
  * @param {Object} titleCodeIdsToNames -
  * @param {Object} sortedTitleCodeList - array of ids from the title code
  *   titleCode array
  * @return {Object}
  *
  **/
    getRestrictedTitleCodeLists(actionType, commonCallLists = this.formattedCommonCallLists) {
    //ActionType must be in here or no reason to proceed
        if(!(actionType in constants.filteredTitleCodeByActionType)) {
            return null;
        }

        let {fieldName, value} = constants.filteredTitleCodeByActionType[actionType];

    //Create filter for titleCode object
        let filterValue = {[fieldName]: value};

    //Now filter the options
        let filtered = filter(commonCallLists.sortedTitleCodeList, filterValue);

    //Map the id to name for selection
        return filtered;
    }

  /**
  *
  * @desc - Separates and returns proposed action and status fields
  * @param {String} fieldData - proposedStatus fieldData keyed by apptId
  * @return {Object} separatedFields - segregated proosedAction and proposedStatus
  *   fields
  *
  **/
    separateProposedActionAndStatusFieldsByAttrPropsSectionName(fieldData = {}) {
        let separatedFields = {proposedAction: {}, proposedStatus: {}};

        for(let name in fieldData) {
            let {attributeProperties: {sectionName}} = fieldData[name];
            separatedFields[sectionName][name] = fieldData[name];
        }

        return separatedFields;
    }

  /**
  *
  * @desc - BRule 187 - Part 1
  * @param {Object} fieldData -
  * @param {Object} appointment -
  * @param {String} actionType -
  * @return {void} -
  *
  **/
    handleEmeritusChangeForEndAppt(fieldData = {}, appointment, actionType =
    ActionTypes.END_APPOINTMENT, formattedCommonCallLists = this.formattedCommonCallLists) {
        let {appointmentEndDt, titleCode} = fieldData;
        if(!appointment && !appointmentEndDt || actionType !== ActionTypes.END_APPOINTMENT) {
            return;
        }

    //Add emeritus options to titleCode
        if(titleCode){
            let titleCodeOptions = this.getEmeritusTitleCodesForAppt(formattedCommonCallLists);
            this.formatTitleCodeFieldForEmeritus(titleCode, titleCodeOptions);
        }else{
            console.log("No titleCode in fieldData");
        }

        let checkAppt = this.checkEndApptForEmeritusAppt(appointment, appointmentEndDt,
      formattedCommonCallLists);
        if(checkAppt) {
            this.FieldDataToggle.updateTitleCodeVisibilityByApptEndDtValue(fieldData);
        }
    }

  /**
  *
  * @desc - BRule 187
  * @param {Object} appointment - chose appointment
  * @param {Object} endDateField - fieldData ...usually appointEndDt
  * @param {Object} formattedCommonCallLists - fieldData ...usually appointEndDt
  * @return {Boolean} - tells whether to filter title codes
  *
  **/
    checkEndApptForEmeritusAppt(appointment, endDateField, formattedCommonCallLists
    = this.formattedCommonCallLists) {
        let {titleCodesById} = formattedCommonCallLists;
        let {value} = endDateField;
        let {titleInformation: {titleCodeId}, affiliationType: {affiliation}} = appointment;
        let {academicSenate} = titleCodesById[titleCodeId] || {};

        return !!(value && academicSenate && affiliation === "Primary");
    }

  /**
  *
  * @desc - BRule 187
  * @param {Object} appointmentEndDt -
  * @param {Object} formattedCommonCallLists -
  * @return {Array} - whichever array is chosen
  *
  **/
    getEmeritusTitleCodesForAppt(formattedCommonCallLists) {
        return formattedCommonCallLists.emeritusTitleCodeIdsToNamesArray;
    }

  /**
  *
  * @desc - BRule 187 - Part 2
  * @param {Object} titleCodeFieldData -
  * @param {Object} titleCodeOptions -
  * @param {String} appointmentEndDtValue -
  * @return {void}
  *
  **/
    formatTitleCodeFieldForEmeritus(titleCodeFieldData, titleCodeOptions) {
        console.log(titleCodeFieldData);
        console.log(titleCodeOptions);
        titleCodeFieldData.options = titleCodeOptions;
        titleCodeFieldData.topText = constants.endApptTitleCodeText;
    }


  /**
  *
  * @desc - BRule 187 - Part 2
  * @param {Object} titleCodeFieldData -
  * @param {String} appointmentEndDtValue -
  * @return {void}
  *
  **/
    formatTitleCodeVisibilityForEmeritus(titleCodeFieldData, appointmentEndDtValue) {
        titleCodeFieldData.visibility = !!appointmentEndDtValue;
    }

  /**
  *
  * @desc -
  * @param {Object} fieldData -
  * @param {Object} appointment -
  * @param {String} actionType -
  * @param {Object} formattedLists -
  * @return {void} -
  *
  **/
    filterTitleCodeOptionsBySeriesProfessorMatch(fieldData, appointment, actionType,
    formattedLists = this.formattedCommonCallLists) {
    //Is it a Promotion we are dealing with?
        if(!fieldData.titleCode || actionType !== ActionTypes.PROMOTION) {
            return fieldData;
        }

        let {titleInformation: {series}} = appointment;
        let {sortedTitleCodeList} = formattedLists;
        let filtered = null;

        if(series === "Act Professor") {
            let valid = {"Act Professor": true, "Reg Professor": true};
            filtered = sortedTitleCodeList.filter(each => each.series in valid);
        } else {
            filtered = sortedTitleCodeList.filter(each => each.series === series);
        }

        return filtered;
    }


  /**
  *
  * @desc - Creates formatted titleCode options for PROMOTION and sets them in
  *   titleCode
  * @param {Object} fieldData -
  * @param {Object} appointment -
  * @param {String} actionType -
  * @param {Object} formattedLists -
  * @return {void} -
  *
  **/
    setTitleCodeOptionsForPromotion(fieldData, appointment, actionType, actionDataInfo,
    formattedLists = this.formattedCommonCallLists) {
    //Is it a Promotion we are dealing with?
        if(!fieldData.titleCode || actionType !== ActionTypes.PROMOTION) {
            return fieldData;
        }

        let theAppointmentInfoThatWeAreSupposedToUse = appointment;
        if(actionDataInfo.approvedAppointmentInfo){
      // Jira #2611 filterTitleCodeOptionsBySeriesProfessorMatch will filter on series so if
      // one does not exist in approvedAppointmentInfo, then swap out the approved appointment
      // for current appointment which is called 'appointmentInfo'
            if(!actionDataInfo.approvedAppointmentInfo.titleInformation.series){
                theAppointmentInfoThatWeAreSupposedToUse = actionDataInfo.appointmentInfo;
            }
        }

        let filteredTitleCodeOptions = this.filterTitleCodeOptionsBySeriesProfessorMatch(
      fieldData, theAppointmentInfoThatWeAreSupposedToUse, actionType, formattedLists);

        fieldData.titleCode.options = util.arrayOfObjectsToArrayOfKVObjects(
      filteredTitleCodeOptions, "titleCodeId", "titleName");

        return fieldData;
    }

  /**
  *
  * @desc - Always show appointmentEndDt if actionType is "END_APPOINTMENT"
  * @param {Object} fieldData - all field dat
  * @param {String} actionType - actionType
  * @param {String} nameOfChangedField - name of field that was changed
  * @return {void}
  *
  **/
    updateFieldDataByToggleForEndAppt(fieldData, actionType = this.actionType,
    nameOfChangedField) {
        if(actionType === ActionTypes.END_APPOINTMENT && nameOfChangedField ===
      "appointmentEndDt") {
            this.FieldDataToggle.updateTitleCodeVisibilityByApptEndDtValue(fieldData,
        nameOfChangedField);
        }
    }

  /**
  *
  * @desc - Always show appointmentEndDt if actionType is "END_APPOINTMENT"
  * @param {Object} fieldData - all field data
  * @param {Object} nameOfChangedField - name of field that was changed
  * @return {void}
  *
  **/
    setApptEndDateVisibilityByEndAppt(fieldData, actionType = this.actionType,
    nameOfChangedField) {
        if(actionType === ActionTypes.END_APPOINTMENT && nameOfChangedField ===
      "titleCode") {
            fieldData.appointmentEndDt.editable = true;
            fieldData.appointmentEndDt.visibility = true;
        }
    }

  /**
  *
  * @desc - Used to update dependent fields generally when field data changes
  * @param {Object} fieldData - all field data
  * @param {Object} nameOfChangedField - name of field that was changed
  * @return {Object} fieldData - update fieldData
  *
  **/
    updateFieldDataByToggle(fieldData = {}, nameOfChangedField, typeOfReq) {
        super.updateFieldDataByToggle(fieldData, nameOfChangedField, typeOfReq);

        this.updateFieldDataByToggleForEndAppt(fieldData, this.actionType, nameOfChangedField);

    // OPUS-6441 CF/CS: End Date is always available but only required for certain titles.
    // this.setApptEndDateVisibilityByEndAppt(fieldData, this.actionType, nameOfChangedField);

        return fieldData;
    }

  /**
  *
  * @desc - Checks to see if the flag actions should display in modal
  * @param {actionType} template -
  * @return {array} - array of customized flag actions
  *
  **/
    setProposedActionFlagsDisplayInModal(actionType){
        for(let index in proposedActionFlags){

            if(proposedActionFlags[index].typeOfAction!==""){

        // checks to see if action is a merit action or not
                if(proposedActionFlags[index].typeOfAction === "merit"
        && (actionType === ActionTypes.MERIT)) {
                    proposedActionFlags[index].shouldDisplay = true;
                }else if(proposedActionFlags[index].typeOfAction === "retention"
          && (actionType === ActionTypes.MERIT
          || actionType === ActionTypes.PROMOTION
          || actionType === ActionTypes.OFF_SCALE_SALARY
          || actionType === ActionTypes.CHANGE_IN_SERIES
          || actionType === ActionTypes.CHANGE_OF_DEPARTMENT
          || actionType === ActionTypes.ENDOWED_CHAIR_APPT)) {
          // Checks for retention flag actions
                    proposedActionFlags[index].shouldDisplay = true;
                }else{
          // default display is false
                    proposedActionFlags[index].shouldDisplay = false;
                }

            }
      // reset checked value
      // (useful for when choosing an action type then going back
      // and reselecting a different action type when starting a case)
            proposedActionFlags[index].checked = false;
        }
        return proposedActionFlags;
    }

  /**
  *
  * @desc - Checks to see which proposed actions are checked
  * @param {actionType} template -
  * @return {array} - array of customized flag actions
  *
  **/
    setCheckedValueForProposedActionFlags(actionDataInfo, proposedActionFlags){
        for(let index in proposedActionFlags){
            let proposedActionFlagName = proposedActionFlags[index].name;
      // checks for if this is an action data info field
            if(proposedActionFlags[index].actionTypeInfoField) {
                proposedActionFlags[index].checked = actionDataInfo.actionTypeInfo[proposedActionFlagName];
            }else{
                proposedActionFlags[index].checked = actionDataInfo[proposedActionFlagName];
            }
        }
        return proposedActionFlags;
    }

  /**
  *
  * @desc - Checks to see which proposed actions are checked
  * @param {Boolean} checked - value of checkbox
  * @param {Object} action - entire object of proposed action flag
  * @param {Array} proposedActionFlagsArray - array of proposed action flags
  * @return {Array} - array of customized flag actions
  *
  **/
    changeProposedActionFlags(checked, action, proposedActionFlags){
        let index = proposedActionFlags.indexOf(action);
        if(checked){
            proposedActionFlags[index].checked = true;
        }else{
            proposedActionFlags[index].checked = false;
        }
        return proposedActionFlags;
    }

  /**
   *
   * @desc - Gets the appointment Ids for case
   * @param {Object} caseSummaryDataFromAPI -
   * @return {Array} apptIdsForCase
   *
   **/
    getApptIdsForCase(appointmentData, thisGotCalledFrom = "caseSummary") {
        let apptIdsForCase = [];
        let appointments = appointmentData;

        if(thisGotCalledFrom==="caseSummary"){
      // If appointment for this case has more than 1 appointment in it
            if(appointmentData.actionDataInfo.length>1){

        // 7/11/19 Changed to point back to actionDataInfo
        // appointments = appointmentData.apptDetailsList.appointmentSetList;

        // this points to the correct appointment data
                appointments = appointmentData.actionDataInfo;
        // this loops through the appointments array and pushes the ids into apptIdsForCase
                for(let each of appointments){
                    apptIdsForCase.push(each.appointmentInfo.appointmentId);
                }

            }else{
        // Else grab the one appointment
                apptIdsForCase.push(appointmentData.actionDataInfo[0].appointmentInfo.appointmentId);
            }
        }else{
      // Coming in from proposed fields modal on case flow
            for(let each of appointments){
                apptIdsForCase.push(each.appointmentId);
            }

        }

        return apptIdsForCase;
    }

}
