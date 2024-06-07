import {set, omit, sortBy} from "lodash";


/*******************************************************************************
*
* @desc - My imports
*
*******************************************************************************/
import Opus from "../../common/classes/Opus";
import * as util from "../../common/helpers/";
import SalaryToggle from "./toggles/SalaryToggle";
import Validator from "../../common/modules/Validate";
import CommonCallData from "../../common/modules/CommonCallData";
import FieldData from "../../common/modules/FieldData";
import FieldDataToggle from "./toggles/FieldDataToggle";
import Permissions from "../../common/modules/Permissions";
import AppointmentBlock from "../modules/AppointmentBlock";
import EndowedChairBlock from "../modules/EndowedChairBlock";
import {text} from '../constants/caseflow/NameSearchConstants';
//import {fieldsInAPI} from '../constants/FieldDataConstants';
import {urls, constants} from "../constants/CasesConstants";
import {fieldNamesValidation} from "../constants/FieldDataValidations";

/**
*
* @classdesc Base class that has all common functionalities for Profile, Case Summary, and
*   Case Flow
* @author - Leon Aburime
* @class Cases
* @extends Opus
*
**/
export class Cases extends Opus {

  /**
  *
  * Instance variables
  *
  **/
    endowedChair = {};
    label_key = text.label_key;
    endowedChair_key = text.endowedChair_key;
    formatteEndowedChairToDataHash = {};
    titleCodesMapList = {};
    pubOnScaleSalaries = {};
    validateFieldNames = fieldNamesValidation;
    invalidValues = {null: true, "": true, undefined: true};


  //Classes
    Permissions = null;
    CommonCallLists = null;
    Validator = new Validator();
    FieldData = new FieldData();
    SalaryToggleLogic = new SalaryToggle();
    FieldDataToggle = new FieldDataToggle();
    AppointmentBlock = new AppointmentBlock();
    EndowedChairBlock = new EndowedChairBlock();

  /*
  *
  * @desc - Instance variables
  *
  **/
    constructor({access_token, adminData, globalData, ...args} = {}) {
        super({access_token, adminData, globalData, ...args});

        this.initCommonCall({access_token, adminData, globalData});
        this.Permissions = new Permissions(adminData);

        this.setClassData({access_token, adminData, globalData});
    }

  /**
  *
  * @desc - Sets list for commonCall data
  * @param {String} - access_token, adminData, globalData
  * @return {void}
  *
  **/
    initCommonCall({access_token, adminData, globalData}) {
        this.CommonCallLists = new CommonCallData({access_token, adminData, globalData});
        this.formattedCommonCallLists = this.CommonCallLists.formattedCommonCallLists;
    }

  /**
  *
  * @desc - attaching access_token, adminData and other specific application
  *   variables
  * @param {Object} - access_token, adminData, globalData
  * @param {String} resource_name - Should be an object
  * @return {void}
  *
  **/
    initClassVariables({access_token, adminData, globalData} = {}, resource_name =
    "eligibility") {
        let grouperPathText = adminData.resourceMap[resource_name].grouperPathTexts;
        this.setClassData({access_token, adminData, globalData, grouperPathText});
    }

  /**
  *
  * @desc - Get the relevant field values to display in appt. sets
  * @param {Array} defaultAppointments - appointments to extract data from
  * @param {Object} fields - fields to use and show
  * @return {Object} - results of text
  *
  **/
    getDisplayFieldsFromAppointments = (defaultAppointments = []) =>
    this.AppointmentBlock.getDisplayFieldsFromAppointments(defaultAppointments);

  /**
  *
  * @desc - Get the relevant field values to display in appt. sets
  * @param {Array} defaultAppointments - appointments to extract data from
  * @param {Object} fields - fields to use and show
  * @return {Object} - results of text
  *
  **/
    getDisplayFieldsFromAppointmentsForDisplayLayout = (apptIdsForCase, defaultAppointments = []) =>
    this.AppointmentBlock.getDisplayFieldsFromAppointmentsForDisplayLayout(apptIdsForCase, defaultAppointments);

  /**
  *
  * @desc - Get the relevant field values to display in endowed chair
  * @param {Array} endowedChair - endowedChair to extract data from
  * @param {Object} fields - fields to use and show
  * @return {Object} - results of text
  *
  **/
    getDisplayFieldsFromEndowedChairForDisplayLayout = (endowedChair) =>
    this.EndowedChairBlock.getDisplayFieldsFromEndowedChairForDisplayLayout(endowedChair);

  /**
  *
  * @desc - Stringify whatever this function is given
  * @param {Object} data -
  * @return {String} - stringified data
  *
  **/
    stringify = (data = {}) => JSON.stringify(data)

  /**
  *
  * @desc - Get dept, division, school, if its not in
  * @param {Object} deptText - whole string to choose dept, school, division from
  * @param {Object} default_dept_text -
  * @return {String} shortened_name - one of the three
  *
  **/
    getShortenedDeptCodeText = (deptText = "", default_dept_text = "") =>
    util.getShortenedDeptCodeText(deptText, default_dept_text);

  /**
  *
  * @desc - Get dept, division, school, if its not in invalid
  * @param {Object} dept - whole string to choose dept, school, division from
  * @param {Object} school - whole string to choose dept, school, division from
  * @param {Object} division - whole string to choose dept, school, division from
  * @param {Object} deptText - whole string to choose dept, school, division from
  * @return {String} shortened_name - one of the three
  *
  **/
    getValidAcademicName = (dept = "", school = "", division = "") =>
    util.getValidAcademicName(dept, school, division);

  /**
  *
  * @desc - Get dept, division, school, if its not in invalid
  * @param {Object} dept - whole string to choose dept, school, division from
  * @param {Object} school - whole string to choose dept, school, division from
  * @param {Object} division - whole string to choose dept, school, division from
  * @param {Object} deptText - whole string to choose dept, school, division from
  * @return {String} shortened_name - one of the three
  *
  **/
    getValidAcademicNameSafe = (dept, school, division, {invalid =
    {"N/A": true, null: true, "": true}} = {}) =>
    util.getValidAcademicNameSafe(dept, school, division, {invalid})

  /**
   *
   * @desc - Creates an object of FieldData. These usually double as form fields
   *  in the view layer
   * @param {Object} fieldData -
   * @param {String} displayValueKey - name of key of display value
   * @return {Object} fieldData - array of objects with names, labels, and opusPersonIds
   *
   **/
    reformatDisplayValuesBasedOnViewType(fieldData = {}, displayValueKey =
    "displayValue", valueKey = "value") {
        for(let name in fieldData) {
            if(fieldData[name][displayValueKey] in this.invalidValues) {
                continue;
            }

            switch(fieldData[name].displayType) {
            case "money":
                fieldData[name][displayValueKey] = util.reformatToMoneyDisplayValue(
          fieldData[name][displayValueKey]);
                break;
            case "percent":
                fieldData[name][displayValueKey] += "%";
                break;
            case "round2DecimalPercent":
                fieldData[name][displayValueKey] = parseFloat(Math.round(fieldData[name][displayValueKey] * Math.pow(10, 2)) /Math.pow(10,2)).toFixed(2) + "%";
                fieldData[name][valueKey] = parseFloat(Math.round(fieldData[name][valueKey] * Math.pow(10, 2)) /Math.pow(10,2)).toFixed(2);
                // fieldData[name][displayValueKey] += "%";
                break;
            default:
                break;
            }
        }
        return fieldData;
    }

  /**
  *
  * @desc - gets visible fields of 'fieldData' passed in
  * @param {Object} fieldData -
  * @return {Object} visibleStatusFieldsByApptId - key(apptId) to value(fieldData)
  *
  **/
    getVisibleFieldData(fieldData = {}) {
        let visibleFieldsData = {};

        for(let name in fieldData) {
            if(fieldData[name].visibility) {
                visibleFieldsData[name] = fieldData[name];
            }
        }

        return visibleFieldsData;
    }

  /**
   *
   * @desc - Extract all attributeProperties from from appointment
   * @param {Object} appointment -
   * @return {Object} - array of objects with names, labels, and opusPersonIds
   *
   **/
    getAttributePropertiesFromAppointment(appointment) {
        let {attributeProperties, academicHierarchyInfo = {}, affiliationType = {},
      salaryInfo = {}, salaryInfo: {academicProgramUnit} = {}, titleInformation = {},
      titleInformation: {rank, step} = {} } = appointment;

        let allAttributeProperties = {
            ...attributeProperties,
            ...rank.attributeProperties,
            ...step.attributeProperties,
            ...salaryInfo.attributeProperties,
            ...affiliationType.attributeProperties,
            ...titleInformation.attributeProperties,
            ...academicProgramUnit.attributeProperties,
            ...academicHierarchyInfo.attributeProperties
        };
        return allAttributeProperties;
    }

  /**
  *
  * @desc - inits the global objects call and sends it to be formatted
  * @param {Object} fieldData - fieldData
  * @param {Object} formattedCommonCallLists - formatted lists
  * @return {Object} fieldData - fieldData with added options
  *
  **/
    addOptionsListToFieldData(fieldData = {}, formattedCommonCallLists = {}) {
        for(let name in fieldData) {
            let {optionsInfo, dataType} = fieldData[name];

      //Not options or no optionsInfo
            if(dataType !== "options" && dataType !== "select-search"
              && dataType !== "searchoptions" && dataType!== "locationOptions"
              && dataType !== "departmentOptions" && dataType !== "titleOptions") {
                continue;
            }

            let {formattedListName} = optionsInfo;
            fieldData[name].options = formattedCommonCallLists[formattedListName];
        }
        return fieldData;
    }

  /**
  *
  * @desc - get all lists from adminData and globalData
  * @return {Object} - all the api lists from adminData and globalData
  *
  **/
    getAPIListsFromCommonCallData() {
        return this.CommonCallLists.getAPIListsFromCommonCallData();
    }

  /**
  *
  * @desc - Create dropdowns options, keyed lists etc
  * @param {Object} data -
  * @return {Promise}
  *
  **/
    getFormattedListsFromCommonCallData() {
        let formattedLists = this.CommonCallLists.formattedCommonCallLists;
        let affiliationLists = this.getFormattedAffiliationLists();

        Object.assign(formattedLists, affiliationLists);
        return formattedLists;
    }

  /**
  *
  * @desc - Get just affiliation lists
  * @return {Object} affiliationLists - assorted affiliation lists
  *
  **/
    getFormattedAffiliationLists() {
        let {affiliationTypeList} = this.CommonCallLists.getAPIListsFromCommonCallData();
        let affiliationList = this.getAffiliationList(affiliationTypeList);
        let affiliationIdToText = util.arrayOfObjectToObject(affiliationList);
        let affiliationLists = {affiliation: affiliationList, affiliationList,
      affiliationIdToText};

        return affiliationLists;
    }

  /**
  *
  * @desc - If formattedCommonCallLists hasnt been created then create it and
  *   set it back
  * @return {Object} formattedCommonCallLists
  *
  **/
    getCachedCommonCallLists() {
        let {formattedCommonCallLists} = this;
        if(!formattedCommonCallLists) {
            formattedCommonCallLists = this.getFormattedListsFromCommonCallData();
        }
        return formattedCommonCallLists;
    }

  /**
   *
   * @desc - Sort appointments by Brule-118.
   * @param {Object} appointments -
   * @return {Array} - array of objects
   *
   **/
    sortAppointmentsByOpusStandards(appointments = []) {
        let sortedAppointments = sortBy(appointments, "affiliationType.affiliationTypeId",
      "affiliationType.appointmentCategoryId", "academicHierarchyInfo.departmentName");

        return sortedAppointments;
    }

  /**
   *
   * @desc - Sort appointments so Primary Appointment comes first
   * @param {Object} appointments -
   * @return {Array} - array of sorted objects
   *
   **/
    sortAppointmentsByAffiliationTypeId(appointments = []) {
        return sortBy(appointments, "affiliationType.affiliationTypeId",
      "affiliationType.appointmentCategoryId");
    }

  /**
  *
  * @desc - In 'Cases' we only need 'Primary' and 'Additional'. Not the Joints
  *   or Splits
  * @param {Object} affiliationTypeList -
  * @param {Object} options -
  * @return {Object}
  *
  **/
    getAffiliationList(affiliationTypeList = [], options = {Primary: true,
    Additional: true}) {
        let filtered = affiliationTypeList.filter(({affiliation}) =>
      affiliation in options);

        return util.arrayOfObjectsToKVObject(filtered, "affiliationTypeId",
      "affiliation");
    }

  /**
  *
  * @desc - Give us varied data needed for titleCode dependency fields
  * @param {Object} fieldData -
  * @param {Object} formattedCommonCallLists -
  * @return {Object} fieldData
  *
  **/
    addStepOptionsByTitleCodeValue(fieldData = {}, formattedCommonCallLists = {}, typeOfReq) {
        let {titleCodeIdToStepOptions, titleCodeIdToActiveStepOptions} = formattedCommonCallLists;

    //TitleCode value used to extract step options
        let {titleCode: {value} = {}, step} = fieldData;

    //If valid value and there is a step then set options to titleCode
        if(typeOfReq==="active" && value && step){
            step.options = titleCodeIdToActiveStepOptions[value];
        }else if(value && step) {
            step.options = titleCodeIdToStepOptions[value];
        }

        return fieldData;
    }

  /**
  *
  * @desc - Omit these fields as they cause problems in save
  * @param {String} allFieldData - proposedStatus fieldData keyed by apptId
  * @param {Array} remove - fields to remove. defaults to status fields
  * @return {Object} -
  *
  **/
    omitFieldsFromFieldData(allFieldData, remove = ["series", "rank"]) {
        return omit(allFieldData, remove);
    }

  /**
  *
  * @desc - Edit fields for various exception cases
  * @param {String} fieldData - proposedStatus fieldData keyed by apptId
  * @param {Object} template - actionType to use to get attribute properties
  * @return {Object} -
  *
  **/
    addFieldValuesToTemplateByAttrPropsPath(fieldData, template = {}) {
      console.log(fieldData);
    //Set values from fieldData into actionData by path in statusCaseFields
        for(let name in fieldData) {
            let {attributeProperties: {pathToFieldValue}} = fieldData[name];
            set(template, pathToFieldValue, fieldData[name].value);
        }
        return template;
    }

  /**
  *
  * @desc - Adjust apuId from apuCode in appointment
  * @param {Object} fieldData - fieldData
  * @param {Object} appointment - appointment
  * @return {Promise} - json request
  *
  **/
    addApuCodeToApptByFieldDataApuId(fieldData = {}, appointment, formattedCommonCallLists =
    this.formattedCommonCallLists) {
        if(!fieldData.apuCode) {
            return fieldData;
        }

    //Extract list that maps apuCode to Id
        let {apuIdToCodeWithPast} = formattedCommonCallLists;

    //Extract apuCode
        let {value: apuCodeValue} = fieldData.apuCode;

    //Put apuId into appointment or null if its not valid
        appointment.salaryInfo.academicProgramUnit.apuCode =
      apuIdToCodeWithPast[apuCodeValue] || null;

        return fieldData;
    }


  /**
  *
  * @desc - Adjust apuId from apuCode in appointment
  * @param {Object} fieldData - fieldData
  * @param {Object} appointment - appointment
  * @return {Promise} - json request
  *
  **/
    addAHPathAndDeptCodeToApptFromFieldData(fieldData = {}, appointment,
    formattedCommonCallLists = this.formattedCommonCallLists) {
    //If no departmentCode no operation to perform
        if(!fieldData.departmentCode) {
            return fieldData;
        }

    //Extract list that maps ahPath to deptCode in fieldData.departmentCode
        let {aHPathIdsToDeptCode} = formattedCommonCallLists;

    //Extract ahPath from fieldData.departmentCode
        let {value: ahPathId} = fieldData.departmentCode;

    //Put ahPath into appointment or null if its not valid
        appointment.academicHierarchyInfo.academicHierarchyPathId = ahPathId;

    //Put ahPath into appointment or null if its not valid
        let deptCodeFromAHPath = aHPathIdsToDeptCode[ahPathId] || null;
        appointment.academicHierarchyInfo.departmentCode = deptCodeFromAHPath || null;

        return fieldData;
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
        let formattedCommonCallLists = this.getCachedCommonCallLists();

        this.FieldDataToggle.updateFieldData(fieldData, nameOfChangedField,
      formattedCommonCallLists, typeOfReq);

        return fieldData;
    }

//   /**
//   *
//   * @desc - Used to update dependent fields
//   * @param {Object} fieldData - all field data
//   * @return {Object} fieldData - update fieldData
//   *
//   **/
//     updateAllFieldData(fieldData = {}) {
//         let names = ["departmentCode", "titleCode", "step"];
//         return names.map(name => this.updateFieldData(fieldData, name));
//     }

  /**
   *
   * @desc - Change fieldData based firmly on salary API data
   * @param {Object} fieldName - name of field that was changed
   * @param {Object} fieldData - all fields
   * @param {Object} appointment - appointment to draw data from
   * @param {Object} - callingApi is profile
   * @return {Object} - array of objects with names, labels, and opusPersonIds
   *
   **/
    updateFieldDataFromSalaryAPI = async (fieldName, fieldData = {}, appointment = {}, actionId,
    typeOfReq, {callingApi = "cases"} = {}) => {
        let formattedFieldData = fieldData;

    // Jira #2948 #3075 skip the salary api call if the selected SSED value is blank
        if(fieldData.salaryEffectiveDt && fieldData.salaryEffectiveDt.value!==""){
      //Only some fields trigger salary API call
            if(fieldName in constants.fieldNamesToTriggerSalaryAPICall) {
                let {access_token} = this;

                formattedFieldData = await this.SalaryToggleLogic.updateFieldDataBySalaryAPI(
          fieldData, appointment, actionId, typeOfReq, {callingApi, access_token});
            }
        }

        return formattedFieldData;
    }

  /**
  *
  * @desc - Extract certain fields from adminData and add them to loggedInUserInfo
  * @param {Object}  loggedInUserInfo -
  * @param {Object} adminData -
  * @return {Object} -
  *
  **/
    populateLoggedInUserInfoWithAdminData(loggedInUserInfo = {}, adminData =
    this.adminData) {
    //Extract the fields
        let {adminName, adminFirstName, adminOpusId, adminRoles, adminEmail,
      adminUclaLogon} = adminData;

        return {...loggedInUserInfo, adminName, adminFirstName, adminOpusId,
      adminRoles, adminEmail, adminUclaLogon};
    }


  /**
  *
  * @desc - Blank out fieldData that are not visible on save
  * @param {Object} fieldData - Blank out fieldData that are not visible on save
  * @param {Array} names - Blank out fieldData that are not visible on save
  * @return {Object} fieldData - fieldData that had its values wiped
  *
  **/
    wipeValuesOfInvisibleFieldData(fieldData = {}, names = Object.keys(fieldData)) {
        for(let name of names) {
            if(fieldData[name] && fieldData[name].visibility === false) {
                fieldData[name].value = null;
            }
        }
        return fieldData;
    }

  /**
  *
  * @desc - Always blank out apuDesc since it is not used by the backend and the
  * apuDesc value is not updated when we toggle to a new APU
  * @param {Object} data -
  * @param {String} status - Comes from either Cases, Case Summary, or Profile
  * @return {Object} data - data with updated apuDesc value
  *
  **/
    wipeApuDesc(data, status) {
    //Coming from Case Summary
        if (status === "case-summary-proposed" && data.proposedAppointmentInfo) {
            data.proposedAppointmentInfo.salaryInfo.academicProgramUnit.apuDesc = null;
        }
    // Removed as of Jira #3122
    // if (status === 'case-summary-approved' && data.approvedAppointmentInfo) {
    //   data.approvedAppointmentInfo.salaryInfo.academicProgramUnit.apuDesc = null;
    // }
    //Coming from Profile or Cases
        if ((status === "profile-current" || status === "cases-proposed")
      && data.salaryInfo) {
            data.salaryInfo.academicProgramUnit.apuDesc = null;
        }
        return data;
    }

  /**
  *
  * @desc - Blank out fieldData that are not visible on save
  * @param {Object} fieldData - Blank out fieldData that are not visible on save
  * @param {Array} nullInvisOnSave - Blank out fieldData that are not visible on save
  * @return {Object} fieldData - fieldData that had its values wiped
  *
  **/
    wipeValuesOfInvisibleFieldDataSubset(fieldData = {}, {wipeInvisibleFieldDataValues:
    wipeInvisOnSave} = constants) {
        return this.wipeValuesOfInvisibleFieldData(fieldData, wipeInvisOnSave);
    }


  /**
   *
   * @desc - Wipe error data from field. Useful if the field is invisible or not
  *   editable and shouldnt be validated
   * @param {Object} fieldData - fieldData
   * @return {JSX} - Proposed Action Table
   *
   **/
    wipeErrorsFromFieldData(fieldData = {}) {
        for(let name in fieldData) {
            fieldData[name].hasError = false;
            fieldData[name].error = null;
        }
        return fieldData;
    }

  /**
  *
  * @desc - Create and format template for Profile Save
  * @param {Object} allFieldData - appointment to send to API
  * @param {Object} validateFieldNames - key value pair of fieldName to validation
  *  type. Defaulted to "fieldNamesValidation" from FieldDataValidations.js
  * @return {Object} - fieldData
  *
  **/
    validateAllFieldDataOnSave(allFieldData = {}, validateFieldNames = this.validateFieldNames) {
        this.Validator.validateAllFieldDataOnSave(allFieldData, validateFieldNames);
        return allFieldData;
    }

    validateApptEndDate(fields){
        this.Validator.validateApptEndDate(fields);
    }

  /**
  *
  * @desc - Validate keyed fields i.e. {22: fieldData, 3: otherFieldData}
  * @param {Object} keyedFieldData - appointment to send to API
  * @return {Object} - fieldData
  *
  **/
    validateKeyedFieldsOnSave(keyedFieldData = {}) {
        let hasErrors = false;

    //Do status fields have errors? && = 'and' to find out
        for(let [, fieldData] of Object.entries(keyedFieldData)) {
      //Lets wipe old errors on start
            this.wipeErrorsFromFieldData(fieldData);

            this.validateAllFieldDataOnSave(fieldData);

            this.locationValidation(fieldData);
        }

        return hasErrors;
    }

  /**
  *
  * @desc - Validate fields on click
  * @param {Object} fieldData - fieldData
  * @param {Object} validationFunctions -  default object of array of validations
  * @return {Object} - fieldData
  *
  **/
    validateFieldOnUpdate(fieldData = {}, validateFieldNames = this.validateFieldNames) {
        let {onClickValidations} = validateFieldNames[fieldData.name] || {};
        if(onClickValidations) {
            this.Validator.validateFieldByFunctionList(fieldData, onClickValidations);
        }
        return fieldData;
    }

  /**
  *
  * @desc - Validate fields on blur
  * @param {Object} fieldData - fieldData
  * @param {Object} validationFunctions -  default object of array of validations
  * @return {Object} - fieldData
  *
  **/
    validateFieldOnBlur(fieldData = {}, validateFieldNames = this.validateFieldNames) {
        let {onBlurValidations} = validateFieldNames[fieldData.name] || {};
        if(onBlurValidations) {
            this.Validator.validateFieldByFunctionList(fieldData, onBlurValidations);
        }
        return fieldData;
    }

  /**
   *
   * @desc - Blank out fieldData that are not visible on save
   * @param {Object} fieldData - fields to be wiped out
   * @return {Object} fieldData -  changed fieldData
   *
   **/
    editStepValueByVisibility(fieldData = {}) {
        if(fieldData.step && fieldData.step.visibility === false) {
            fieldData.step.value = 0;
        }
        return fieldData;
    }

  /**
   *
   * @desc - Blank out fieldData that are not visible on save
   * @param {Object} fieldData - fields to be wiped out
   * @return {Object} fieldData -  changed fieldData
   *
   **/
    editAPUValueByVisibility(fieldData = {}, appointment) {
        if(fieldData.apuCode && fieldData.apuCode.visibility === false) {
            appointment.salaryInfo.academicProgramUnit.apuId = 0;
            appointment.salaryInfo.academicProgramUnit.apuCode = "N/A";
        }
        return appointment;
    }

  /**
   *
   * @desc - changes value of fields that are not visisble
   * @param {Object} fieldData -
   * @param {Object} value - value to set invisible fields
   * @return {Object} fieldData - fieldData that was passed in
   *
   **/
    setValueOfInvisibleFields(fieldData = {}, value = null) {
        for(let name in fieldData) {
            if(!fieldData[name].visibility) {
                fieldData[name].value = value;
            }
        }

        return fieldData;
    }

  /**
  *
  * @desc - Gets the url encoded headers
  * @return {Object} - urlEncodedHeaders
  *
  **/
    getSaveHeaders() {
        return constants.saveOptions.urlEncodedHeaders;
    }

  /**
  *
  * @desc - Save comment to backend
  * @param {Object} commentsText - String text
  * @param {Object} entityKeyColumnValue -
  * @param {Object} screenName -
  * @param {Object} commentAPIData - Previously created comment if not new
  * @return {Promise} - json request
  *
  **/
    formatSaveCommentTemplate(commentsText, entityKeyColumnValue, screenName =
    "case", commentAPIData = {}) {
        let {adminData: {adminName}} = this;

        let template = {
            commentsText,
            entityKeyColumnValue,
            screenName,
            loggedInUserName: adminName
        };
        return template;
    }

  /**
  *
  * @desc - Get comment url from backend
  * @return {Promise} - json request
  *
  **/
    getAddCommentUrl({access_token} = this) {
        return urls.addComment(access_token);
    }


  /**
  *
  * @desc - Get formatted comments url
  * @param {String} id - appointment id
  * @param {String} screenName - profile or cases. in this case 'profile'
  * @param {Object} access_token - get Comments
  * @return {Promise} - Promise to be resolved in comments
  *
  **/
    getCommentsUrlById(id, screenName = "case", {access_token} = this) {
        return `/restServices/rest/common/comments/${screenName}/${id}?access_token=`
      + access_token;
    }

  /**
  *
  * @desc - Get comments from backend
  * @param {String} id - appointment id
  * @param {String} screenName - profile or cases. in this case 'profile'
  * @param {Object} access_token - get Comments
  * @return {Promise} - Promise to be resolved in comments
  *
  **/
    getCommentsById = async (id, screenName = "case", {access_token} = this) => {
        let url = this.getCommentsUrlById(id, screenName, {access_token});
        let comments = await util.getJson(url);
        return comments;
    }

  /**
  *
  * @name isCommentValid
  * @desc - must have a comment w/ text of at least 1 to be valid
  * @param {String} commentsText - comments being checked
  * @return {Boolean} - if its valid
  *
  **/
    isCommentValid(commentsText = "") {
        return !!commentsText.length;
    }

  /**
   *
   * @desc - add salary effective date options to the field data
   * @param {Object} finalDecisionByApptId - array of final decisions
   * @param {Object} caseSummaryDataFromAPI - case summary data from which to get info
   * @return {Object} finalDecisionByApptId - final decision fields keyed by apptId
   *
   **/
    addSalaryEffDateOptions(fieldData, caseSummaryDataFromAPI) {
        if(fieldData.salaryEffectiveDt){
            fieldData.salaryEffectiveDt.dataType = "options";
      //OPUSDEV-5487: Loop and find correct SSED dropdown options in iteration
            let actionData = caseSummaryDataFromAPI.actionDataInfo;
            for(let each in actionData){
                if(actionData[each].proposedAppointmentInfo.salaryInfo.salaryEffectiveDtList){
                    fieldData.salaryEffectiveDt.options = actionData[each].proposedAppointmentInfo.salaryInfo.salaryEffectiveDtList;
                    break;
                }
            }
        }
        return fieldData;
    }

    /*****************************************************************************
     *
     * @ Department search function section
     *
     *****************************************************************************/

     updateDeptSearchOnChange = async (fieldData = {}, name, searchString) => {
         let commonCallLists = this.formattedCommonCallLists;
         let departmentList = commonCallLists.departmentOptions;
         let deptCodes = [];
         for(let each of departmentList){
             deptCodes.push(Object.values(each));
         }
         let mergedDeptCodes = [].concat.apply([], deptCodes);
         let searchedDeptCodes = [];
         for(let each of mergedDeptCodes){
             if(each.toLowerCase().includes(searchString.toLowerCase())){
                 searchedDeptCodes.push(each);
             }
         }
         fieldData.departmentSearch.options = searchedDeptCodes;
     }

     /*****************************************************************************
      *
      * @ Title search function section
      *
      *****************************************************************************/

      updateTitleSearchOnChange = async (fieldData = {}, name, searchString) => {
          let commonCallLists = this.formattedCommonCallLists;
          let titleList = commonCallLists.titleCodeOptions;
          let titleCodes = [];
          for(let each of titleList){
              titleCodes.push(Object.values(each));
          }
          let mergedTitleCodes = [].concat.apply([], titleCodes);
          let searchedTitleCodes = [];
          for(let each of mergedTitleCodes){
              if(each.toLowerCase().includes(searchString.toLowerCase())){
                  searchedTitleCodes.push(each);
              }
          }
          fieldData.titleCode.options = searchedTitleCodes;
      }

  /*****************************************************************************
   *
   * @ endowed chair search function section
   *
   ****************************************************************************/

   /**
   *
   * @desc - sets the key value pair of labels to names
   * @param {Set} person -
   * @return {void}
   *
   **/
   set setSelectedEndowedChair(endowedChair = {}) {
     this.endowedChair = endowedChair;
   }

   /**
   *
   * @desc - sets the key value pair of labels to names
   * @param {Set} nameHash -
   * @return {void} -
   *
   **/
   set setFormatteEndowedChairToDataHash(nameHash) {
     this.formatteEndowedChairToDataHash = nameHash;
   }

   searchForEndowedChairOnChange = async (fieldData = {}, name, searchString) => {
     let {access_token} = this;
     //Get grouperPathText to pass to the search url
     const grouperPathText = this.getGrouperPathText(this.adminData);
     let endowedChairSearchUrl = urls.endowedChairSearchUrl+searchString.toString();
     endowedChairSearchUrl = this.addAccessTokenAndGrouperToUrl(endowedChairSearchUrl, access_token,
                              {grouperPathText, addGrouper: true});
     let endowedSearchResults = await util.fetchJson(endowedChairSearchUrl);
     // console.log(endowedSearchResults);
     let reformattedEndowedSearchResults = this.reformatEndowedSearchResults(endowedSearchResults);
     let {formatteEndowedChairToDataHash, nameSet, endowedOptions} =
       this.getCompleteEndowedResultsData(reformattedEndowedSearchResults, this.label_key);
     fieldData.endowedChair.options = endowedOptions;
     return {formatteEndowedChairToDataHash, nameSet, endowedOptions};
   }

   /**
   *
   * @desc - Gets the appt data from name given to it
   * @param {String} name - name of EndowedChair to retrieve
   * @param {Object} - various arguments
   * @return {Object} EndowedChair - EndowedChair object to be returned
   *
   **/
   async getEndowedChairDataFromName(name, opusId, actionId, {access_token, grouperPathText} =
     this, {endowedChair_key = this.endowedChair_key} = {}) {

     let {[name]: selectedEndowedChair = {}} = this.formatteEndowedChairToDataHash;
     let endowedChairId = selectedEndowedChair[endowedChair_key].endowedChairId || {};
     let endowedChairHolderApptId = selectedEndowedChair[endowedChair_key].endowedChairHolderAppointmentId;
     if(endowedChairHolderApptId===null){
        endowedChairHolderApptId = -1;
     }
    //  IOK-1026 Added endowedChairHolderAppointmentId field as part of url:
     let url = urls.endowedChairDataFromNameUrl+access_token+"&endowedChairId="+endowedChairId+"&opusId="+opusId
        +"&endowedChairHolderAppointmentId="+endowedChairHolderApptId+"&actionId="+actionId;
     // let args = {endowedChairId, opusId};
     let endowedChairUrl = await util.fetchJson(url);
     // console.log(endowedChairUrl)
     return endowedChairUrl;
   }

   formatEndowedChairObject(name, results, series, rank, {endowedChair_key = this.endowedChair_key} = {}) {
     let endowedChair = results;
     endowedChair.seriesType = series;
     endowedChair.rankType = rank;
     // console.log(formattedObject);
     let endowedChairBlockData = this.EndowedChairBlock.getDisplayFieldsFromEndowedChairForDisplayLayout(endowedChair);

     return {endowedChair, endowedChairBlockData};
   }


   /**
   *
   * @desc - Returns the Set of unique names & array of endowedOptions, and hash
   *   of name labels to object data
   * @param {Array} reformattedNameResults - array of objects with to be transformed
   * @param {String} label - label to be used for the hash
   * @return {Set} - set of unique names from the labels from the hash
   *
   **/
   getCompleteEndowedResultsData(reformattedNameResults, {label = this.label_key} = {}) {
     let formatteEndowedChairToDataHash = util.arrayOfObjectsToObjectByKey(reformattedNameResults,
       label);
     let endowedOptions = Object.keys(formatteEndowedChairToDataHash);
     this.setFormatteEndowedChairToDataHash = formatteEndowedChairToDataHash;
     //Create set to prevent name search on user selecting endowedChair in autocomplete
     let nameSet = new Set(endowedOptions);
     return {formatteEndowedChairToDataHash, nameSet, endowedOptions};
   }

   /**
   *
   * @desc - Get names from name search API and reformat
   * @param {Array} data - api results
   * @return {Array} results -reformatted results
   *
   **/
   reformatEndowedSearchResults(data = []) {
     let results = [];

     for(let endowedChair of data) {
       if(!endowedChair.endowedChairName) {
         continue;
       }

       let {endowedChairId, endowedChairName} = endowedChair;
       let label = `${endowedChairName}`;

       results.push({label, endowedChairId, value: label, endowedChair});//Save each
     }

     return results;
   }

   /**
   *
   * @desc - Get grouperPathText from adminData via profile constants
   * @param {Object} adminData -
   * @return {String} grouperPathText -
   *
   **/
   getGrouperPathText(adminData) {
       const permissions = adminData.resourceMap["eligibility"];
       const grouperPathText = permissions.formattedGrouperPathTexts;

       return grouperPathText;
   }

  /*****************************************************************************
   *
   * @name Multiple Locations functions
   * @desc - Section for Multiple locations
   *
   *****************************************************************************/

    getExclusionFieldsForLocation = () => {
        return ["add", "delete", "locPercentTime1", "locPercentTime2", "locPercentTime3",
        "locPercentTime4", "locPercentTime5", "locationDisplayText1", "locationDisplayText2",
        "locationDisplayText3", "locationDisplayText4", "locationDisplayText5"];
    }

    handleLocationFields = (name, value, fieldData) => {
        let {helpText, locationError} = this;
        const buttonFields = ["add", "delete"];
        const pctTimeFields = ["locPercentTime1", "locPercentTime2", "locPercentTime3", "locPercentTime4", "locPercentTime5"];
        const displayFields = ["locationDisplayText1", "locationDisplayText2", "locationDisplayText3", "locationDisplayText4", "locationDisplayText5"];
        // Do not reload page OPUSDEV-4171 Moved to only included fields
        // OPUS-7127 RE-308 Exception logic for add/delete onClick
        if(buttonFields.includes(name)){
            this.addOrDeleteMultipleLocation(name, value, fieldData, helpText);
            // Percent Time fields:
        }else if(pctTimeFields.includes(name)){
            this.changePercentTime(name, value, fieldData);
            // Location Name fields:
        }else if(displayFields.includes(name)){
            this.changeLocationName(name, value, fieldData, locationError);
        }
        return fieldData;
    }

    /**
  *
  * @desc - 8/4/2022 Allow for multiple locations with own percent time
  * @param {Object} fieldData - fieldData
  * @param {Object} appointment - appointment
  * @return {Object} fieldData
  *
  **/
    setMultipleLocations(fieldData = {}, appointment = {}, comingFrom, typeOfReq) {
        // only set locations if there is a location field attribute for it
        if(fieldData.locationDisplayText1){

            let apptData = appointment;
            // Move to constants
            this.helpText = "You must enter the previous Location's % to be able to add additional locations.";
            this.locationError = "Each location may only be selected once.";
            this.locationDescText = "Location Name: This field is populated with UCLA Campus for all appointees. Appointees outside the School of Medicine are assumed to work on campus as opposed to an affiliate location. \n"
                + "<br/>&nbsp;<br/>"
                + `Location %: For appointees outside the School of Medicine, the UCLA Campus % will always be equivalent to the Percent Time in the department.
                For School of Medicine appointees, this value should reflect the percent time for the UCLA appointment as opposed to the percent time at an affiliate location.
                The sum of all the Location percentages must equal the Percent Time in the department. `;
            this.otherLocationDescText = "Location Name: Name of the affiliate. \n"
                + "<br/>&nbsp;<br/>"
                + "Location %: The percent time the appointee is at the affiliate location. The sum of all the Location percentages must equal the Percent Time in the department.";
            this.otherLocationModalDescText = "Location Name: Add all affiliate locations for the appointee and the percent time at the affiliate. We suggest adding the locations with the highest percentages first. There is a maximum of five locations. \n"
                + "<br/>&nbsp;<br/>"
                + "Location %: The percent time the appointee is at the affiliate location. The sum of all the Location percentages must equal the Percent Time in the department.";

          // Check where this function is being called and set correct data
            if(comingFrom==="caseSummary"){
                apptData = appointment[typeOfReq+"AppointmentInfo"];
                // Set location 1
                fieldData.locationDisplayText1.displayValue = "UCLA Campus";
            }

          // Set First location (UCLA Campus)
            let loc1 =  fieldData.locationDisplayText1;
            loc1.visibility = true;
            loc1.value = 1;
            loc1.disabled = true;

            let loc5 =  fieldData.locationDisplayText5;
            loc1.value = apptData.locationId1 || 1;

            if((apptData.locPercentTime1 || apptData.locPercentTime1===0) && apptData.locPercentTime1>=0){
                loc1.numberValue = apptData.locPercentTime1;
                console.log(apptData)
                loc1.displayValue = loc1.displayValue +": "+ apptData.locPercentTime1.toString()+"%";
            }else{
                console.log("appointment data locPercentTime1 field is null or undefined");
                loc1.displayValue = null;
            }

            loc1.totalPercentTime = apptData.appointmentPctTime;
            loc1.helpText = this.helpText;
            loc1.descriptionText = this.locationDescText;
          // Can only add locations if school is medicine
            let schoolName = apptData.academicHierarchyInfo.schoolName;

            if(schoolName==="Medicine"){
                loc1.showAdd = true;
                loc1.showDelete = true;
                loc1.isDeleteDisabled = true;
                loc5.isAddDisabled = true;
            }else{
                loc1.showAdd = false;
                loc1.showDelete = false;
                loc1.isNumberDisabled = true;
                // IOK-603 Do not set location 1 percent time to appt percent time.
                // loc1.numberValue = apptData.appointmentPctTime;
                loc1.helpText = null;
            }

        // Loop through other 4 locations and find correct fieldData attributes
            for(let each of [2,3,4,5] ){
                let locNum = each.toString();
                let locationDisplayTextAttr = fieldData["locationDisplayText"+locNum];
                locationDisplayTextAttr.descriptionText = this.otherLocationDescText;
                locationDisplayTextAttr.otherDescText = this.otherLocationModalDescText;
              // let locationPercentTimeAttr = fieldData["locPercentTime"+locNum];

                if(apptData["locationDisplayText"+locNum]!=="N/A" && apptData["locationDisplayText"+locNum]!==null){
                    locationDisplayTextAttr.displayName = "Location "+locNum;
                    locationDisplayTextAttr.name = "locationDisplayText"+locNum;
                    locationDisplayTextAttr.dataType = "locationOptions";
                    locationDisplayTextAttr.value = apptData["locationId"+locNum];

                    if((apptData["locPercentTime"+locNum] || apptData["locPercentTime"+locNum]===0) && apptData["locPercentTime"+locNum]>=0){
                        locationDisplayTextAttr.numberValue = apptData["locPercentTime"+locNum];
                        locationDisplayTextAttr.displayValue = apptData["locationDisplayText"+locNum] +": "+ apptData["locPercentTime"+locNum].toString()+"%";
                    }
                    locationDisplayTextAttr.pathsInAPI = {
                        appointment: {
                            displayText: "locationDisplayText"+locNum,
                            value: "locationId"+locNum
                        }
                    };
                    locationDisplayTextAttr.optionsInfo = {
                        formattedListName: "locationList"
                    };

                    let previousLocation = fieldData["locationDisplayText"+(each-1)];
                    let nextLocation = fieldData["locationDisplayText"+(each+1)];
                    previousLocation.showAdd = false;
                    previousLocation.showDelete = false;
                    previousLocation.helpText = null;

                    if(nextLocation && nextLocation.value!==0){
                        locationDisplayTextAttr.showAdd = false;
                        locationDisplayTextAttr.showDelete = false;
                    }else{
                        locationDisplayTextAttr.showAdd = true;
                        locationDisplayTextAttr.showDelete = true;

                    }
                    if(each!==5){
                        locationDisplayTextAttr.helpText = this.helpText;
                    }
                }else{
              // If "N/A", set visibility to false
                    locationDisplayTextAttr.visibility = false;
                }

            }
        }else{
            console.log("no locationDisplayText1 field attribute found");
        }

        return fieldData;
    }

    addOrDeleteMultipleLocation = (name, value, fieldData, helpText) => {
        let nameSplit = value.split("Text");
        let locNum = nameSplit[1];
        let locIndex = parseInt(locNum);
        let previousLoc = nameSplit[0]+"Text"+(locIndex-1);
        let nextLoc = nameSplit[0]+"Text"+(locIndex+1);
        fieldData[value].showAdd = false;
        fieldData[value].showDelete = false;
        fieldData[value].helpText = null;
        if(locIndex===4 && name==="add"){
            // Add from location 4
            fieldData[nextLoc].visibility = true;
            fieldData[nextLoc].showAdd = true;
            fieldData[nextLoc].showDelete = true;
            fieldData[nextLoc].isNumberDisabled = true;
            fieldData[nextLoc].isAddDisabled = true;
            fieldData[value].secondError = null;
        }else if(locIndex===2 && name=="delete"){
            // Delete from location 2
            fieldData[value].visibility = false;
            fieldData[value].value = 0;
            fieldData[value].numberValue = null;
            fieldData[value].hasError = false;
            fieldData[value].error = null;
            fieldData[value].secondError = null;
            fieldData[value].isNumberDisabled = true;

            fieldData[previousLoc].visibility = true;
            fieldData[previousLoc].showAdd = true;
            fieldData[previousLoc].showDelete = true;
            fieldData[previousLoc].helpText = helpText;
            fieldData[previousLoc].isAddDisabled = false;
            fieldData[previousLoc].isDeleteDisabled = true;
        }else if(name==="add"){
            // Add from location 1-3
            fieldData[nextLoc].visibility = true;
            fieldData[nextLoc].value = 0;
            fieldData[nextLoc].numberValue = null;
            fieldData[nextLoc].showAdd = true;
            fieldData[nextLoc].showDelete = true;
            fieldData[nextLoc].helpText = helpText;
            fieldData[nextLoc].isNumberDisabled = true;
            fieldData[nextLoc].isAddDisabled = true;
            fieldData[value].secondError = null;
        }else{
            // Delete from location 3-5
            fieldData[value].visibility = false;
            fieldData[value].value = 0;
            fieldData[value].numberValue = null;
            fieldData[value].hasError = false;
            fieldData[value].error = null;
            fieldData[value].secondError = null;
            fieldData[value].isNumberDisabled = true;
            fieldData[previousLoc].visibility = true;
            fieldData[previousLoc].showAdd = true;
            fieldData[previousLoc].showDelete = true;
            fieldData[previousLoc].helpText = helpText;
        }
        return fieldData;
    }

    changePercentTime = (name, value, fieldData) => {
        let locNum = name.split("Time")[1];
        let locationName = "locationDisplayText"+ locNum;
        if(util.isNumber(value)){
            fieldData[locationName].numberValue = parseInt(value);
            if(name!=="locPercentTime5"){
                fieldData[locationName].isAddDisabled = false;
            }
        }else if(value===""){
            fieldData[locationName].numberValue = "";
            fieldData[locationName].isAddDisabled = true;
        }
        return fieldData;
    }

    changeLocationName = (name, value, fieldData, locationError) => {
      // Find and make sure value is not the same as any other location value
        if(value!=="1"){
            let isDuplicate = false;
            for(let each of [2,3,4,5] ){
                let locNum = each.toString();
                let locationDisplayTextAttr = fieldData["locationDisplayText"+locNum];
                let loopingValue;
                if(locationDisplayTextAttr.value){
                    loopingValue = locationDisplayTextAttr.value;
                }
                if(loopingValue && loopingValue.toString()===value.toString()){
                    isDuplicate = true;
                    break;
                }
            }

            if(!isDuplicate){
                fieldData[name].value = value;
                fieldData[name].hasError = false;
                fieldData[name].error = null;
                fieldData[name].isNumberDisabled = false;
            }else{
                fieldData[name].hasError = true;
                fieldData[name].error = locationError;
            }
        }else{
            fieldData[name].hasError = true;
            fieldData[name].error = locationError;
        }
        return fieldData;
    }

    resetLocations = (fieldData) => {
        if(fieldData.locationDisplayText1){
            fieldData.locationDisplayText1.showAdd = false;
            fieldData.locationDisplayText1.showDelete = false;
            fieldData.locationDisplayText1.helpText = null;
            fieldData.locationDisplayText1.numberValue = util.isNumber(fieldData.appointmentPctTime.value) ? parseInt(fieldData.appointmentPctTime.value) : null;
            fieldData.locationDisplayText1.isNumberDisabled = true;

            for(let each of [2,3,4,5] ){
                let locNum = each.toString();
                let locationDisplayTextAttr = fieldData["locationDisplayText"+locNum];
                locationDisplayTextAttr.visibility = false;
                locationDisplayTextAttr.showAdd = false;
                locationDisplayTextAttr.showDelete = false;
                locationDisplayTextAttr.value = 0;
                locationDisplayTextAttr.numberValue = null;
                locationDisplayTextAttr.hasError = false;
                locationDisplayTextAttr.error = null;
                locationDisplayTextAttr.secondError = null;
                locationDisplayTextAttr.isNumberDisabled = true;
                locationDisplayTextAttr.helpText = null;
            }
        }
        return fieldData;
    }

  // 8-22-2022 RE-308: multiple locations added so need to validate location name and percent time, also percent time total
  // needs to add up to appointment percent time total
    locationValidation(fieldData){
        if(fieldData.locationDisplayText1){
            let percentTimeTotal = 0;
            if(fieldData.appointmentPctTime){
                percentTimeTotal = parseInt(fieldData.appointmentPctTime.value);
            }else{
                console.log("locationValidation failed due to empty fieldData.appointmentPctTime in Cases.js");
            }
            let currentPercentTimeTotal = 0;
            // Validate UCLA Campus location (location 1)
            let uclaCampus = fieldData.locationDisplayText1;

             // Need to verify only ucla percent time
            if(uclaCampus && util.isNumber(uclaCampus.numberValue)){
                uclaCampus.hasError = false;
                uclaCampus.error = null;
                currentPercentTimeTotal = currentPercentTimeTotal + uclaCampus.numberValue;
            }else if(uclaCampus && !util.isNumber(uclaCampus.numberValue)){
                uclaCampus.hasError = true;
                uclaCampus.error = "Please fill out the UCLA Campus %.";
            }

            // Validate the 4 other locations and values
            for(let each of [2,3,4,5]){
                let currentLocation = fieldData["locationDisplayText"+each.toString()];
                let previousLocation = fieldData["locationDisplayText"+(each-1).toString()];
                let nextLocation = fieldData["locationDisplayText"+(each+1).toString()];

            // Only validate visible locations:
                if(currentLocation.visibility){
                    currentLocation.hasError = false;
                    currentLocation.error = null;

                    if(currentLocation && (currentLocation.value==="" || currentLocation.value===null || currentLocation.value===0)){
                        currentLocation.hasError = true;
                        currentLocation.error = "Location Name may not be blank.";
                    }

          // Different logic for location name error
                    if(currentLocation.hasError){
                        if(currentLocation && currentLocation.numberValue!==null && currentLocation.numberValue>0){
                            currentPercentTimeTotal = currentPercentTimeTotal + currentLocation.numberValue;
                        }else if(currentLocation && currentLocation.numberValue!==0 && !currentLocation.numberValue){
                            currentLocation.hasError = true;
                            currentLocation.error = "Location Name and % may not be blank.";
                        }else if(currentLocation && currentLocation.numberValue<0){
                            currentLocation.hasError = true;
                            currentLocation.error = "Location Name may not be blank and % must be greater than or equal to 0.";
                        }
                    }else{
            // Validate just percent time
                        if(currentLocation && currentLocation.numberValue!==null && currentLocation.numberValue>0){
                            currentPercentTimeTotal = currentPercentTimeTotal + currentLocation.numberValue;
                        }else if(currentLocation && currentLocation.numberValue!==0 && !currentLocation.numberValue){
                            currentLocation.hasError = true;
                            currentLocation.error = "Location % may not be blank.";
                        }else if(currentLocation && currentLocation.numberValue<0){
                            currentLocation.hasError = true;
                            currentLocation.error = "Location % must be greater than or equal to 0.";
                        }
                    }

                    if(each===5 && currentPercentTimeTotal!==percentTimeTotal){
                        currentLocation.hasError = true;
                        currentLocation.secondError = "The sum of all Location %'s must be equivalent to the Percent Time.";
                    }else if(each===5 && currentPercentTimeTotal===percentTimeTotal){
                        currentLocation.secondError = null;
                    }

                }else{
              // Set percent time error if not equal to appointment percent time total
                    if(currentPercentTimeTotal!==percentTimeTotal && (!nextLocation || !nextLocation.visibility)){
                        previousLocation.hasError = true;
                        previousLocation.secondError = "The sum of all Location %'s must be equivalent to the Percent Time.";
                    }else if(currentPercentTimeTotal===percentTimeTotal){
                        previousLocation.secondError = null;
                    }
                    break;
                }
            }
        }

        return fieldData;
    }

        /**
     *
     * @desc - Change location using location id
     * @param {Object} fieldData -
     * @param {Object} appointment - could be actionTemplate if coming from Case Flow
     * @return {Object} appointment
     *
     **/
    setLocationForSave(fieldData, appointment, typeOfReq){
        if(fieldData.locationDisplayText1){
            let dataSource = appointment;
            if(typeOfReq==="proposed"){
                dataSource = appointment.proposedAppointmentInfo;
            }else if(typeOfReq==="approved"){
                dataSource = appointment.approvedAppointmentInfo;
            }
            for(let each of [1,2,3,4,5] ){
                let locNum = each.toString();
                let fdLocation = fieldData["locationDisplayText"+locNum];
                dataSource["locationId"+locNum] = parseInt(fdLocation.value)>0 ? parseInt(fdLocation.value) : 0;
                dataSource["locPercentTime"+locNum] = (fdLocation.numberValue===0 || fdLocation.numberValue>0) ? fdLocation.numberValue : null;
            }
        }
        return appointment;
    }


}
