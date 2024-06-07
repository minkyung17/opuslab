import moment from "moment";
import {pick, set, get, omit} from "lodash";

//My imports
import {Cases} from "../Cases";
import * as util from "../../../common/helpers/";
import SalaryToggle from "../toggles/SalaryToggle";
import ProfileToggle from "../toggles/ProfileToggle.js";
import Validator from "../../../common/modules/Validate";
import FieldData from "../../../common/modules/FieldData";
import Permissions from "../../../common/modules/Permissions";
import {fieldsInAPI} from "../../constants/profile/ProfileFieldDataConstants";
import {profileValidations} from "../../constants/profile/ProfileValidations";
import {text, urlConfig, profileSaveTemplate, profileConstants, viewAppointmentSetConstants, editAppointmentSetConstants} from
  "../../constants/profile/ProfileConstants";


/**
*
* @classdesc Opus Logic class for Profile. Extends Cases subclass
* @class Profile
* @extends Cases
*
**/
export default class Profile extends Cases {
  /**
   *
   * @desc - Class Variables
   *
   **/
    Permissions = null;
    ProfileToggle = null;
    appointmentsById = {};
    FieldData = new FieldData();
    Validator = new Validator();
    SalaryToggleLogic = new SalaryToggle();
    invalidValues = {null: true, "": true, undefined: true};

  /**
   *
   * @desc - Initializes data for Profile Logic Layer
   * @param {Object} data - startup data
   * @return {void}
   *
   **/
    constructor(data = {}) {
        super(data);
        this.startLogic(data);
        this.ProfileToggle = new ProfileToggle(data);
    }

  /**
   *
   * @desc - Initializes data for Profile Logic Layer
   * @param {Object} attributeProperties -
   * @return {Object} - array of objects with names, labels, and opusPersonIds
   *
   **/
    startLogic({adminData, globalData, access_token} = {}) {
        this.Permissions = new Permissions(adminData);

    //Make lists to use to get options
        let formattedCommonCallLists = this.getFormattedListsFromCommonCallData(
      {adminData, globalData});

    //Get grouperPathText to save data
        const grouperPathText = this.getGrouperPathText(adminData);

    //Get slimmed logged in user info
        let loggedInUserInfo = this.getLoggedInUserInfo(adminData);

        this.setClassData({adminData, grouperPathText, globalData, access_token,
      formattedCommonCallLists, loggedInUserInfo});
    }

  /**
  *
  * @desc - Get grouperPathText from adminData via profile constants
  * @param {Object} adminData -
  * @return {String} grouperPathText -
  *
  **/
    getGrouperPathText(adminData) {
        const permissions_text = profileConstants.view_permissions;
        const permissions = adminData.resourceMap[permissions_text];
        const grouperPathText = permissions.formattedGrouperPathTexts;

        return grouperPathText;
    }

  /**
  *
  * @desc - Get loggedInUserInfo without heavy adminDepartments
  * @param {Object} adminData -
  * @return {Object} loggedInUserInfo -
  *
  **/
    getLoggedInUserInfo(adminData = this.adminData) {
        let loggedInUserInfo = util.cloneObject(adminData);
        delete loggedInUserInfo.adminDepartments;
        return loggedInUserInfo;
    }

  /**
  *
  * @desc - Check if user can inactive appointments
  * @return {Object} - can view inactive appointments
  *
  **/
    canViewInactiveAppointments() {
        let {isOA, isAPO, isDA, isSA} = this.Permissions;
        return (isOA || isAPO || isDA || isSA);
    }

  /**
  *
  * @desc - Check if user can inactive appointments
  * @return {Object} - can view inactive appointments
  *
  **/
    canViewAppointmentSets() {
        let {isOA, isAPO, isDA, isSA, isAA} = this.Permissions;
        return (isOA || isAPO || isDA || isSA);
    }

  /**
  *
  * @desc - Check if user can edit/delete appointments in appointment set
  * @return {Object} - can edit/delete appointments in appointment set
  *
  **/
    canEditDeleteAppointmentSets() {
        let {isOA, isAPO} = this.Permissions;
        return (isOA || isAPO );
    }

  /**
  *
  * @desc - Check if user can view 8 year clock
  * @param {Object} profileAPIData -
  * @param {Object} - adminData
  * @return {Object} - can view eightYearClock
  *
  **/
    canViewEightYearClock(profileAPIData = {}, {resourceMap} = this.adminData) {
        let {opusPersonTenure} = profileAPIData;
        let resource = resourceMap["8_year_clock"] || {};
        let canView = resource.action in {view: true, edit: true};

        return canView && opusPersonTenure;
    }

  /**
  *
  * @desc - Check if user can view 8 year clock
  * @param {Object} profileAPIData -
  * @param {Object} - adminData
  * @return {Object} - canViewExcellenceClock
  *
  **/
    canViewExcellenceClock(profileAPIData = {}, {resourceMap} = this.adminData) {
        let {opusPersonContApp} = profileAPIData;
        let resource = resourceMap["8_year_clock"] || {};
        let canView = resource.action in {view: true, edit: true};

        return canView && opusPersonContApp;
    }

  /**
  *
  * @desc - Can add new profile if youre opusAdmin or apoDirector and on the active
  * appointments page
  * @param {String} activePage - the current active page
  * @return {Boolean} - if youre OA or APO with a valid activePage
  *
  **/
    canViewAddNewAppointment(activePage) {
        let {isOA, isAPO} = this.Permissions;
        return ((isOA || isAPO) && activePage === "profile");
    }

  /**
  *
  * @desc - Check if user can inactive appointments
  * @return {Object} - can view inactive appointments
  *
  **/
/*  canViewInactiveAppointments() {
    // let {isOA, isAPO, isDA, isSA} = this.Permissions;
    // return (isOA || isAPO || isDA || isSA);
    let {resourceMap} = this.adminData;
    console.log(resourceMap);
    let accessGranted = false;
    if(resourceMap[viewAppointmentSetConstants.name]
      && resourceMap[viewAppointmentSetConstants.name].action === viewAppointmentSetConstants.action) {
      accessGranted = true;
    }
    return  accessGranted;
  } */

  /**
  *
  * @desc - Check if user can inactive appointments
  * @return {Object} - can view inactive appointments
  *
  **/
    canViewAppointmentSets() {
    // let {isOA, isAPO, isDA, isSA, isAA} = this.Permissions;
    // return (isOA || isAPO || isDA || isSA);

        let {resourceMap} = this.adminData;
        let accessGranted = false;
        if(resourceMap[viewAppointmentSetConstants.name]
      && resourceMap[viewAppointmentSetConstants.name].action === viewAppointmentSetConstants.action) {
            accessGranted = true;
        }
        return  accessGranted;
    }

  /**
  *
  * @desc - Check if user can edit/delete appointments in appointment set
  * @param {Object} adminData - has create/edit/delete appointment set
  * @return {Object} - can edit/delete appointments in appointment set
  *
  **/
    canEditDeleteAppointmentSets() {
    // let {isOA, isAPO} = this.Permissions;
    // return (isOA || isAPO );
        let {resourceMap} = this.adminData;
        let accessGranted = false;
        if(resourceMap[editAppointmentSetConstants.name]
      && resourceMap[editAppointmentSetConstants.name].action === editAppointmentSetConstants.action) {
            accessGranted = true;
        }
        return  accessGranted;
    }

  /**
  *
  * @desc - Get edit and view permission straight from profileAPIData from API
  * @param {Object} profileAPIData -
  * @return {Object} - canViewEightYearClock, canViewExcellenceClock
  *
  **/
    getClockViewPermissions(profileAPIData = {}) {
        let canViewEightYearClock = this.canViewEightYearClock(profileAPIData);
        let canViewExcellenceClock = this.canViewExcellenceClock(profileAPIData);

        return {canViewEightYearClock, canViewExcellenceClock};
    }

  /**
  *
  * @desc - If action in resourceMap has view profile equaling "view"
  * @param {Object} adminData -
  * @return {Object} -
  *
  **/
    getCanViewProfile(adminData = this.adminData) {
        let {resourceMap: {profile = {}}} = adminData;
        return profile.action === "view";
    }

  /**
 *
 * @desc -
 * @param {Object} appointment -
 * @return {Object} - return if appointment
 *
 **/
    appointmentIsAppointedOrInactive(appointment) {
        return (appointment.appointmentStatusType === "Appointed"
	|| appointment.appointmentStatusType === "Archived"
    || appointment.appointmentStatusType === "Removed"
    || appointment.appointmentStatusType === "Prospective");
    }

 /**
 *
 * @desc - checks if appointment status is appointed or Prospective
 * @param {Object} appointment -
 * @return {Object} - return if appointment
 *
 **/
    appointmentIsAppointedOrProspectiveOrInactive(appointment) {
        return (appointment.appointmentStatusType === "Appointed" || appointment.appointmentStatusType === "Prospective"
     || appointment.appointmentStatusType === "Archived"
     || appointment.appointmentStatusType === "Removed");
    }

 /**
 *
 * @desc - sorts path job api data by primary & secondary appointments
 * @param {Array} pathJobAPIData - path job api data coming in
 * @return {Array} pathJobAPIData - path job api data going out
 *
 **/
    sortPathJobAPIData(pathJobAPIData) {
        let sortedPathJobAPIData = [];
        let primary = [];
        let secondary = [];
        for(let pathJobId in pathJobAPIData){
            if(pathJobAPIData[pathJobId].jobIndicator==="Primary"){
                primary.push(pathJobAPIData[pathJobId]);
            }else{
                secondary.push(pathJobAPIData[pathJobId]);
            }
        }
        sortedPathJobAPIData = this.sortByAlphabeticalOrder(primary);
        sortedPathJobAPIData = sortedPathJobAPIData.concat(this.sortByAlphabeticalOrder(secondary));

        return sortedPathJobAPIData;
    }

 /**
  *
  * @desc - sort incoming tableArray by alphabetical order
  * @param {Array} tableArray -
  * @return {Array} sortedTableArray -
  *
  **/
    sortByAlphabeticalOrder(tableArray = []) {
        let sortedTableArray = [];
        sortedTableArray = tableArray.sort(function(a, b){
            if(a.deptDesc
       < b.deptDesc) { return -1; }
            if(a.deptDesc
       > b.deptDesc) { return 1; }
            return 0;
        });
        return sortedTableArray;
    }

  /**
  *
  * @desc - If user is able to edit profile strictly from values in adminData
  * @param {Object} adminData -
  * @return {Boolean} isEditActionable - if edits are allowed
  *
  **/
    getCanEditProfileFromAdminData(adminData = this.adminData) {
        let {resourceMap: {profile_edit_modal = {}}} = adminData;
        let isEditActionable = profile_edit_modal.action === "edit";
        return isEditActionable;
    }

  /**
  *
  * @desc - Get booleans for being able to view and edit profile
  * @param {Object} appointment -
  * @param {Object} adminData -
  * @return {Object} - if profile edits are allowed
  *
  **/
    getCanEditProfile(appointment, adminData = this.adminData) {
    //Appointment must be "Appointed", "Prospective" or inactive ("Archived" or "Withdrawn")
        let appointmentIsAppointedOrInactive = this.appointmentIsAppointedOrInactive(appointment);

    //profile_edit_modal === 'edit'
        let isProfileActionEditable = this.getCanEditProfileFromAdminData(adminData);

    //Put em all together and you have...
        return isProfileActionEditable && appointmentIsAppointedOrInactive;
    }

  /**
  *
  * @desc - Get booleans for being able to view and delete profile
  * @param {Object} appointment -
  * @param {Object} adminData -
  * @return {Object} - if profile deletes are allowed
  *
  **/
    getCanDeleteProfile(appointment, adminData = this.adminData) {
    //Appointment must be "Appointed" or "Prospective" or inactive ("Archived" or "Withdrawn")
        let appointmentIsAppointedOrProspectiveOrInactive = this.appointmentIsAppointedOrProspectiveOrInactive(appointment);

    //reusing the 'edit' resource to apply to delete
        let isProfileActionEditable = this.getCanEditProfileFromAdminData(adminData);

    //Put em all together and you have...
        return isProfileActionEditable && appointmentIsAppointedOrProspectiveOrInactive;
    }

  /**
  *
  * @desc - Get booleans for being able to view and edit profile
  * @param {Object} appointment -
  * @param {Object} adminData -
  * @return {Object} - canViewProfile, canEditProfile
  *
  **/
    getProfilePermissions(appointment, adminData = this.adminData) {
        let canViewProfile = this.getCanViewProfile(adminData);
        let canEditProfile = this.getCanEditProfile(appointment, adminData);
        return {canViewProfile, canEditProfile};
    }

  /**
   *
   * @desc - gets formatted url thats used to get Profile Data of profile
   * NOTE: This is invoked by test case only, but is needed for the tests to run
   * @param {Object} opusPersonId - person to get data
   * @param {Object} - access_token
   * @return {void} - array of objects with names, labels, and opusPersonIds
   *
   **/
    getProfileDataUrlByOpusId(opusPersonId, typeOfReq, {access_token} = this) {
        return urlConfig.getProfileDataByOpusIdUrl({opusPersonId, typeOfReq, access_token});
    }

  /****************************************************************************
   *
   * Section that takes care of CREATING Field Data
   * @tags - create, field data
   *
   ****************************************************************************/
  /**
  *
  * @desc - In 'Profile' we need 'Primary', 'Additional', 'Joints' & 'Splits'
  * @param {Object} affiliationTypeList -
  * @param {Object} options -
  * @return {Array} filtered - array of key value pair
  *
  **/
    getAffiliationList(affiliationTypeList = []) {
    // As of RE-308, removed concatenated list
    // let filtered = affiliationTypeList.map(e => {
    //   let key = `${e.affiliationTypeId}:${e.appointmentCategoryId}`;
    //   return {[key]: e.affiliation};
    // });
        let filtered = [
            {
                1: "Primary"
            },
            {
                2: "Additional"
            }
        ];

        return filtered;
    }

  /**
  *
  * @desc - Takes in appointment and returns a concatenated value that represents
  *  whether affiliation is Primary, Additional(Joint/Split)
  * @param {Object} appointment - appointment
  * @return {Object} fieldData
  *
  **/
    getConcatenatedAffiliationValueFromAppointment(appointment) {
        let {affiliationType} = appointment;

        let {affiliationTypeId, appointmentCategoryId, affiliation} = affiliationType;

    //If appointmentCategoryId is null lets default it based on affiliation
        if(appointmentCategoryId in this.invalidValues) {
            let isPrimaryAffiliation = appointmentCategoryId || affiliation === "Primary";
            appointmentCategoryId = isPrimaryAffiliation ? 1 : -1;
        }

        let affiliationValue = `${affiliationTypeId}:${appointmentCategoryId}`;
        return affiliationValue;
    }


  /**
  *
  * @desc - Takes in appointment & returns title as department school or division
  * @param {Object} appointment - appointment
  * @return {String} tableTitle
  *
  **/
    getProfileTitleFromAppointment(appointment) {
        let {academicHierarchyInfo: {institutionName, schoolName, divisionName, departmentName}} =
      appointment;
        if (schoolName === "N/A") {
            schoolName = institutionName;
        }
        let tableTitle = this.getValidAcademicName(departmentName, schoolName,
      divisionName);

        return tableTitle;
    }

  /**
  * As of RE-308, this has been removed
  * @desc - Concat 'affiliationTypeId' and 'appointmentCategoryId' into one
  * @param {Object} fieldData - fieldData
  * @param {Object} appointment - appointment
  * @return {Object} fieldData
  *
  **/
    setFieldDataAffiliationValue(fieldData = {}, appointment = {}) {
        if(fieldData.affiliation) {
            let affiliationValue = this.getConcatenatedAffiliationValueFromAppointment(
        appointment);
            fieldData.affiliation.value = affiliationValue;
        }

        return fieldData;
    }

  /**
  *
  * @desc - finds and sets the field data value for appointment status type
  * @param {Object} fieldData - fieldData
  * @param {Object} appointment - appointment
  * @return {Object} fieldData
  *
  **/
    setFieldDataAppointmentStatusType(fieldData = {}, appointment = {}) {
        if(fieldData.appointmentStatusType) {
            for(let index in fieldData.appointmentStatusType.options){
                let int = parseInt(index);
                if(fieldData.appointmentStatusType.options[int]===appointment.appointmentStatusType){
                    fieldData.appointmentStatusType.value = index;
                    break;
                }
            }
        }
        return fieldData;
    }



  /**
   *
   * @desc - Gets fields divided by sections
   * @return {Object} - separated fields
   *
   **/
    getSectionNames = () => profileConstants.sectionKeys


  /**
   *
   * @desc - Lets create field data
   * @param {Object} appointment - appointment from API
   * @return {Object} - multiple independent parts of fieldData
   *
   **/
    getProfileFieldDataFromAppointment(appointment) {

        let tableTitle = this.getProfileTitleFromAppointment(appointment);
        let fieldData = this.createFieldDatafromAppointment(appointment);
        let tableSectionNames = this.getSectionNames();
        let startingFieldData = util.cloneObject(fieldData);
        let tableData = util.cloneObject(fieldData);

        return {fieldData, tableData, tableSectionNames, startingFieldData,
      tableTitle};
    }

  /**
  *
  * @desc -
  * @return {Array} fieldDataKeyNames - combines names of different sections
  *
  **/
    getAllFieldDataKeyNames() {
        let {main, appointment: apptFields, salary} = profileConstants.sectionKeys;
        let fieldDataKeyNames = [...main, ...apptFields, ...salary];

        return fieldDataKeyNames;
    }

  /**
  *
  * @desc - Tells if profileAPIData has at least one appointment
  * @param {Object} profileAPIData - api data from backend
  * @return {Bool} hasAppointments - tells if it has appointments or not
  *
  **/
    hasAppointments(profileAPIData) {
        let appointmentInfoList = profileAPIData.appointmentInfoList || [];
        let hasAppointments = !!appointmentInfoList.length;
        return hasAppointments;
    }

  /**
  *
  * @desc - Tells if profileAPIData has a valid opusPersonId
  * @param {Object} profileAPIData - api data from backend
  * @return {Bool} hasOpusPersonId - tells if there is a valid number for opusPersonId
  *
  **/
    hasOpusPersonId(profileAPIData) {
        let appointeeInfo = profileAPIData.appointeeInfo || {};
        let hasOpusPersonId = !!appointeeInfo.opusPersonId;
        return hasOpusPersonId;
    }

  /**
  *
  * @desc - Only OA can edit the profile summary
  * Added as part of Jira #3010
  * @param {Object} profileAPIData - api data from backend
  * @return {Bool} canEditSummary -
  *
  **/
    canEditSummary(profileAPIData = {}) {
        let {isOA, isAPO, isAPOAdmin, isSA, isDivisionAdmin, isDA} = this.Permissions;
        let canEditSummary = isOA || isAPO || isAPOAdmin || isSA || isDivisionAdmin || isDA;
        return canEditSummary;
    }

    /**
    *
    * @desc - Only OA can edit the profile summary
    * Added as part of Jira #3010
    * @param {Object} profileAPIData - api data from backend
    * @return {Bool} canEditSummary -
    *
    **/
      canEditStatus(profileAPIData = {}) {
        let {isSA, isDivisionAdmin, isDA} = this.Permissions;
        let canEditStatus = isSA || isDivisionAdmin || isDA;
          return canEditStatus;
      }

  /**
  *
  * @desc - Can see the academic history table if valid person there are
  *   appointments and you are opusAdmin
  * RE-224: Changed so that all admins except CAP Admins can see academic history
  * @param {Object} profileAPIData - api data from backend
  * @return {Bool} canViewAcademicHistory -
  *
  **/
    canViewAcademicHistory(profileAPIData = {}) {
    //let hasAppointments = this.hasAppointments(profileAPIData);
        let {academicHierarchyLink} = profileAPIData;
        let hasOpusPersonId = this.hasOpusPersonId(profileAPIData);
        let {isCAP} = this.Permissions;
        let canViewAcademicHistory = hasOpusPersonId && !isCAP;

        return canViewAcademicHistory && academicHierarchyLink;
    }

  /**
   *
   * @desc - Creates an object of FieldData. These usually double as form fields
   *  in the view layer
   * @param {Object} appointment - appointment to extract values & attrProps from
   * @return {Object} - array of objects with names, labels, and opusPersonIds
   *
   **/
    createFieldDatafromAppointment(appointment = {}) {

        let allAttributeProperties = this.getAttributePropertiesFromAppointment(
      appointment);

    //Get field key names
        let fieldDataKeyNames = this.getAllFieldDataKeyNames();

    //Create the fields
        let fieldData = this.FieldData.createFieldDataByAttributeProperties(
      allAttributeProperties, {fieldNames: fieldDataKeyNames,
        fieldDataOptions: fieldsInAPI});

    //Fill the values
        fieldData = this.FieldData.setValuesInFieldDataFromDataByPath(appointment,
      fieldData, {pathToValueInDataKey: "pathsInAPI.appointment.value"});

    //Fill the display values
        fieldData = this.FieldData.setValuesInFieldDataFromDataByPath(appointment,
      fieldData, {pathToValueInDataKey: "pathsInAPI.appointment.displayText",
        setValueKey: "displayValue"});

    //Reformat display values based on type
        fieldData = this.reformatDisplayValuesBasedOnViewType(fieldData);

      // 8/4/2022 RE-308 Update to allow multiple locations
        fieldData = this.setMultipleLocations(fieldData, appointment);

    //Add value options
        let commonCallLists = this.formattedCommonCallLists;

        fieldData = this.addOptionsListToFieldData(fieldData, commonCallLists);
        fieldData = this.addStepOptionsByTitleCodeValue(fieldData, commonCallLists);

    //Get series and rank
        this.FieldDataToggle.updateSeriesRankFromTitleCodeLogic(fieldData, commonCallLists);

    //Update onscale and offScaleAmount
        this.FieldDataToggle.updateFieldDataByStep(fieldData);

    //Add apu list, if applicable
        let {departmentCode: {value}} = fieldData;
        let deptCode = commonCallLists.aHPathIdsToDeptCode[value] || {};
        this.ProfileToggle.updateProfileAPUOptionsFromGlobalData(fieldData, deptCode, commonCallLists);

    //Concat affiliationTypeId and appointmentCategoryId
    // As of RE-308, this has been removed:
    // fieldData = this.setFieldDataAffiliationValue(fieldData, appointment);

    // Find appointment status type:
        fieldData = this.setFieldDataAppointmentStatusType(fieldData, appointment);

        // Add button to unlink path position
        fieldData.positionNbr.showButton = true;
        fieldData.positionNbr.buttonMessage = "Unlink";

        return fieldData;
    }

  /****************************************************************************
   *
   * Section that takes care of Field Data toggling
   * @tags - create, field data
   *
   ****************************************************************************/

  /**
   *
   * @desc - When user changes something must update the fieldData
   * @param {Object} fieldData -
   * @param {String} name - name of changed field
   * @return {Object} - array of objects with names, labels, and opusPersonIds
   *
   **/
    updateFieldDataOnChange = async (fieldData = {}, name) => {
        this.ProfileToggle.updateWaiverEndDt(fieldData, name);

        if (name === "departmentCode") {
            let commonCallLists = this.formattedCommonCallLists;
            let {departmentCode: {value}} = fieldData;
            let deptCode = commonCallLists.aHPathIdsToDeptCode[value] || {};
            this.ProfileToggle.updateProfileAPUOptionsFromGlobalData(fieldData, deptCode, commonCallLists);
        }

        return super.updateFieldDataByToggle(fieldData, name);
    }

  /**
   *
   * @desc - Change fieldData based firmly on salary API data
   * @param {Object} name - name of changed field
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @param {Object} - callingApi is profile
   * @return {Object} - array of objects with names, labels, and opusPersonIds
   *
   **/
    async updateFieldDataFromAPI(name, fieldData = {}, appointment = {}, {
    callingApi = "profile"} = {}) {
        let promise = this.updateFieldDataFromSalaryAPI(name, fieldData, appointment,
      null, null, {callingApi});

        let affiliationPromise = this.updateFieldDataByAffiliationAPICall(name,
      fieldData, appointment);

        await promise;
        await affiliationPromise;

        return fieldData;
    }

  /**
   *
   * @desc - Gets only top level attributesProperties of appointment returned
   *  from affiliation call
   * @param {Object} appointment -
   * @return {Object} appointment.attributeProperties -
   *
   **/
    getAttributePropertiesOfApptFromAffiliationCall(appointment) {
        let {attributeProperties} = appointment;
        return attributeProperties;
    }

  /**
   *
   * @desc - Is the key 'affiliation'? If so lets continue making the call
   * @param {Object} name -
   * @return {Object} fieldData -
   *
   **/
    shouldAllowAffilationAPICall(name) {
        return name === "affiliation";
    }

  /**
   *
   * @desc - Gets only top level attributesProperties of appointment returned
   *  from affiliation call
   * @param {Object} name -
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @return {Object} fieldData -
   *
   **/
    async updateFieldDataByAffiliationAPICall(name, fieldData, appointment) {
        if(!this.shouldAllowAffilationAPICall(name)) {
            return fieldData;
        }

        let affiliationAppt = await this.ProfileToggle.getApptFromAffiliationChange(
      fieldData, appointment, this.formattedCommonCallLists);

        let newAttrProps = this.getAttributePropertiesOfApptFromAffiliationCall(
      affiliationAppt);
        this.FieldData.updateFieldDataByAttributeProperties(fieldData, newAttrProps);
        return fieldData;
    }

  /****************************************************************************
   *
   * Section that gets and formats Names for NameSearch at the top of Profile
   *
   ****************************************************************************/

  /**
   *
   * @desc - Reformats the data from Profile API to array of objects
   *  with specific data
   * @param {Object} suggestions -
   * @return {Array} - array of objects with names, labels, and opusPersonIds
   *
   **/
    formatNameSearchSuggestions(suggestions = [], {additionalNameKey = "label"} = {}) {
        return suggestions.map(({fullName: name, opusPersonId: id, uid, contactValue}) => {
            let uid_str = uid ? ", "+uid : "";
            let contactValue_str = contactValue ? ", "+contactValue : "";
            return {name, [additionalNameKey]: name+uid_str+contactValue_str, value: name, id};
        });
    }

  /**
  *
  * @desc - gets formatted url with proper args for name search
  * @param {String} name -
  * @param {String} - access_token, grouperPathText
  * @return {String} - url string
  *
  **/
    getNameOptionsUrl = (name, {access_token, grouperPathText} = this) => {
        let pageName = "profile";
        let nameUrl = urlConfig.searchProfileNamesUrl({name, access_token,
      grouperPathText, pageName});
        nameUrl = encodeURI(nameUrl);
        return nameUrl;
    }

  /**
  *
  * @desc - gets raw API results from nameSearch
  * @param {String} name - string to search for
  * @return {Array} - API results
  *
  **/
    getNameOptionsFromSearch = async (name) => {
        let validNameString = name.replace(/[#{?\\]/g, "");
        if(validNameString!==""){
            let nameUrl = this.getNameOptionsUrl(validNameString);
            return await util.fetchJson(nameUrl);
        }else{
            console.log("invalid name search");
        }
    }

  /**
  *
  * @desc - gets raw API results from nameSearch
  * @param {String} name - string to search for
  * @return {Array} - API results
  *
  **/
    getFormattedNameSearchOptions = async (name) => {
        let results = await this.getNameOptionsFromSearch(name);
        return this.formatNameSearchSuggestions(results);
    }

  /****************************************************************************
   *
   * Section dealing with getting and formatting data to show on page
   *
   ****************************************************************************/

  /**
  *
  * @desc - returns only visible field names in main, salary, and appointment
  * @param {Object} fieldData -
  * @param {Object} sectionKeys - field names for main salary appointment
  * @return {Object} - url string
  *
  **/
    getFieldDataBySection(fieldData = {}, sectionKeys = profileConstants.sectionKeys) {
        let {main, salary, appointment} = sectionKeys;

        let mainFieldData = pick(fieldData, main);
        let salaryFieldData = pick(fieldData, salary);
        let appointmentFieldData = pick(fieldData, appointment);

        return {main: mainFieldData, salary: salaryFieldData, appointment:
      appointmentFieldData};
    }


  /**
  *
  * @desc -
  * @param {Object} appointment -
  * @param {Object} appointeeInfo -
  * @return {Promise} - json request
  *
  **/
    getEditApptDataUrl(appointment, appointeeInfo) {
        let {access_token} = this;
        let {appointmentId} = appointment;
        let {opusPersonId} = appointeeInfo;
        let url = urlConfig.editAppointmentUrl({opusPersonId, access_token,
      appointmentId});
        return url;
    }

  /**
  *
  * @desc - gets profile data
  * @param {String} opusPersonId -
  * @param {String} typeOfReq -
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
    getProfileDataByOpusIdUrl(opusPersonId, typeOfReq, {access_token} = this) {
        return urlConfig.getProfileDataByOpusIdUrl({opusPersonId, access_token, typeOfReq});
    }

  /**
  * @desc - gets profile data
  * @param {Object} opusPersonId -
  * @param {String} typeOfReq -
  * @return {Promise} -
  *
  **/
    getProfileDataByOpusId(opusPersonId, typeOfReq) {
        let url = this.getProfileDataByOpusIdUrl(opusPersonId, typeOfReq);
        return util.fetchJson(url);
    }

  /**
  *
  * @desc - gets path job data
  * @param {String} opusPersonId -
  * @param {Object} - access_token
  * @return {Promise} -
  *
  **/
    getPathJobDataByOpusIdUrl(opusPersonId, {access_token} = this) {
        return urlConfig.getPathJobDataByOpusIdUrl({opusPersonId, access_token});
    }

  /**
  * @desc - gets path job data
  * @param {Object} opusPersonId -
  * @return {Promise} -
  *
  **/
    getPathJobDataByOpusId(opusPersonId) {
        let url = this.getPathJobDataByOpusIdUrl(opusPersonId);
        return util.fetchJson(url);
    }

  /**
   *
   * @desc - Calculate currentYearsAtRank and currentYearsAtStep by taking
   *  the current date and subtracting them from their respective parent fields
   *  and then rounding
   * @param {String} value -
   * @param {Object}  - options
   * @return {Object} formFields
   *
   **/
    calculateYearsAtCurrentRankStep(value, {suffix = text.year_suffix,
    date_format = "MM/DD/YYYY", milliseconds_in_a_year = profileConstants.millisec_year} = {}) {
        let text_date = moment(value, date_format);
        let rounded_years = Math.round((moment() - text_date) / milliseconds_in_a_year);
        let answer = `${rounded_years}${suffix}`;

        return answer;
    }

  /*****************************************************************************
  *
  * Section w/ functions for ADDING COMMENTS
  *
  *****************************************************************************/

  /**
  *
  * @desc - Get comments from backend
  * @param {String} id - appointment id
  * @param {String} screenName - profile or cases. in this case 'profile'
  * @param {Object} access_token - get Comments
  * @return {Promise} - Promise to be resolved in comments
  *
  **/
    getCommentsById = async (id, screenName = "profile", {access_token} = this) => {
        let url = this.getCommentsUrlById(id, screenName, {access_token});
        let comments = await util.getJson(url);
        return comments;
    }

  /**
  *
  * @desc - Save comment to backend
  * @param {Object} commentsText - String text
  * @param {Object} appointment - appointment from backend
  * @param {Object} commentAPIData - Previously created comment if not new
  * @return {Promise} - json request
  *
  **/
    getSaveCommentArgs(commentsText, appointment = {}) {
        let {commmentsPage = "profile"} = profileConstants;

        let commentUrl = this.getAddCommentUrl();
        let urlEncodedHeaders = this.getSaveHeaders();

    //let {urlEncodedHeaders} = super.getSaveCommentArgs(commmentsPage);
        let {appointmentId} = appointment;
        return {entityKeyColumnValue: appointmentId, screenName: commmentsPage,
      commentUrl, urlEncodedHeaders};
    }

  /**
  *
  * @desc - Save comment to backend
  * @param {Object} commentsText - String text
  * @param {Object} appointment - appointment from backend
  * @param {Object} commentAPIData - Previously created comment if not new
  * @return {Promise} - json request
  *
  **/
    async saveComment(commentsText, appointment = {}) {
        let args = this.getSaveCommentArgs(commentsText, appointment);
        let {entityKeyColumnValue, screenName} = args;
        let commentUrl = this.getAddCommentUrl();
        let template = this.formatSaveCommentTemplate(commentsText, entityKeyColumnValue,
      screenName);

        let {urlEncodedHeaders} = args;
        let didSaveComment = await util.jqueryPostJson(commentUrl, template,
      urlEncodedHeaders);
        return didSaveComment;
    }

  /*****************************************************************************
  *
  * Section that handles are functions for properly DELETING Profile Data
  *
  *****************************************************************************/

  /**
  *
  * @desc - Formats url to delete profile data
  * @param {Object} appointment -
  * @param {Object} appointeeInfo -
  * @return {Promise} - json request
  *
  **/
    async deleteProfileData(appointment, appointeeInfo) {
        let urlArgs = this.getDeleteProfileArgs(appointment, appointeeInfo);
        let url = urlConfig.deleteAppointmentUrl(urlArgs);
        return util.postJson(url);
    }

  /**
  *
  * @desc - Extract and formats args from appointment to delete profile
  * @param {Object} appointment -
  * @param {Object} appointeeInfo -
  * @return {Promise} - json request
  *
  **/
    getDeleteProfileArgs(appointment = {}, appointeeInfo, {adminData, access_token} = this) {
        let {appointmentId} = appointment;
        let {fullName, opusPersonId} = appointeeInfo;
        let {adminOpusId, adminEmail, adminName} = adminData;

        let urlArgs = {access_token, fullName, adminName, opusPersonId, appointmentId,
      adminOpusId, adminEmail};
        return urlArgs;
    }

  /*****************************************************************************
  *
  * Section that handles fieldData validation
  *
  *****************************************************************************/

  /**
  *
  * @desc - Validates on save
  * @param {Object} fieldData - appointment to send to API
  * @return {Object} - fieldData
  *
  **/
    validateAllFieldDataOnSave(fieldData = {}) {
        super.validateAllFieldDataOnSave(fieldData, profileValidations);
        return fieldData;
    }

  /**
  *
  * @desc - Validates on update
  * @param {Object} fieldData - appointment to send to API
  * @return {Object} - fieldData
  *
  **/
    validateFieldOnUpdate(fieldData = {}) {
        super.validateFieldOnUpdate(fieldData, profileValidations);
        return fieldData;
    }

  /**
  *
  * @desc - Validates on blur
  * @param {Object} fieldData - appointment to send to API
  * @return {Object} - fieldData
  *
  **/
    validateFieldOnBlur(fieldData = {}) {
        super.validateFieldOnBlur(fieldData, profileValidations);
        return fieldData;
    }

  /**
  *
  * @desc - Get the message to show for errors
  * @param {Object} fieldsHaveErrors - if fields have errors
  * @param {Object} commentIsValid - if comment is valid
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
  * @name isAppointmentStatusChangeValid
  * @desc - checks to make sure an archived or removed status type
  * isn't being set to appointed or prospective with a past appointment end date
  * 1:"Prospective" 2:"Appointed" 3:"Archived" 4:"Removed"
  * @param {Object} startingFieldData - original starting field data
  * @param {Object} fieldData - edit field data
  * @return {Boolean} - if appointment status change is valid
  *
  **/
    isAppointmentStatusChangeValid(startingFieldData, fieldData) {
        let initialAppointmentStatus = parseInt(startingFieldData.appointmentStatusType.value);
        let selectedAppointmentStatus = parseInt(fieldData.appointmentStatusType.value);
    // Check if archived/removed status is being changed to prospective/appointed
        if(initialAppointmentStatus!==selectedAppointmentStatus &&
      initialAppointmentStatus>=3 && selectedAppointmentStatus<=2){
            let isAppointmentEndDtValid = this.isAppointmentEndDtValid(fieldData.appointmentEndDt.value);
            if(!isAppointmentEndDtValid){
                fieldData.appointmentEndDt.hasError = true;
                fieldData.appointmentEndDt.error = "Please change the appointment end date to a date in the future.";
            }else{
                fieldData.appointmentEndDt.hasError = false;
                fieldData.appointmentEndDt.error = null;
            }
        }
        return fieldData;
    }

  /**
  *
  * @name isAppointmentEndDtValid
  * @desc - checks to see if appointment end date is in the past
  * probably could've used moment to compare
  * @param {String} date - appointment end date
  * @return {Boolean} - if date is in the past
  *
  **/
    isAppointmentEndDtValid(dateToBeChecked){
        let isAppointmentEndDtValid = false;

        if(dateToBeChecked){
            let currentDate = moment().format("L").split("/");
            let comparingDate = dateToBeChecked.split("/");

            let currentDateYear = parseInt(currentDate[2]);
            let currentDateMonth = parseInt(currentDate[0]);
            let currentDateDay = parseInt(currentDate[1]);
            let comparingDateYear = parseInt(comparingDate[2]);
            let comparingDateMonth = parseInt(comparingDate[0]);
            let comparingDateDay = parseInt(comparingDate[1]);

      // Check year
            if(currentDateYear===comparingDateYear){
        // If year is same, check month
                if(currentDateMonth===comparingDateMonth){
          // If month is same, check day
                    if(currentDateDay<=comparingDateDay){
            // dateToBeChecked is same year and month,
            // but day is current or in the future
                        isAppointmentEndDtValid = true;
                    }
                }else if(currentDateMonth<comparingDateMonth){
          // dateToBeChecked is same year but future month
                    isAppointmentEndDtValid = true;
                }
            }else if(currentDateYear<comparingDateYear){
      // dateToBeChecked is next year
                isAppointmentEndDtValid = true;
            }
        }else{
            isAppointmentEndDtValid = true;
        }

        return isAppointmentEndDtValid;
    }

  /*****************************************************************************
  *
  * Section that handles are functions for properly SAVING Profile Data
  *
  *****************************************************************************/

  /**
  *
  * @desc - Create and format template for Profile Save
  * @param {Object} appointment - appointment to send to API
  * @param {Object} appointeeInfo - loggedInUserInfo = adminData, appointeeInfo
  *   = person sent
  * @return {Object} saveTemplate - template that will be used to save
  *
  **/
    createProfileDataTemplate(appointment, appointeeInfo) {
        let loggedInUserInfo = this.getLoggedInUserInfo();
        let saveTemplate = util.cloneObject(profileSaveTemplate);
        saveTemplate = {...saveTemplate, appointeeInfo, loggedInUserInfo,
      appointmentInfoList: [appointment]};
        return saveTemplate;
    }

  /**
   * TODO - Get requirements data
   * @desc - Nullify fieldData that are not visible on save
   * @param {Object} fieldData - fields to be wiped out
   * @return {Object} fieldData -  changed fieldData
   *
   **/
  // wipeValuesOfInvisibleFieldData(fieldData = {}) {
  //   return super.wipeValuesOfInvisibleFieldData(fieldData);
  // }

  /**
  * TODO - Get requirements data
  * @desc - Update fieldData academicHierarchyPathId and departmentCode
  * @param {Object} fieldData - appointment from API
  * @return {fieldData} - reformated field data
  *
  **/
    formatDeptCodeByAHPath(fieldData = {}) {
    //Set DepartmentCode from ahPathId( i.e. departmentCode.value)
        let {value} = fieldData.departmentCode;
        let {aHPathIdsToDeptCode} = this.formattedCommonCallLists;
        let deptCodeFromAHPath = aHPathIdsToDeptCode[value] || null;
        fieldData.academicHierarchyPathId.value = value || null;
        fieldData.departmentCode.value = deptCodeFromAHPath;
        return fieldData;
    }

      // OPUSDEV-4198 Department Code was not being set properly so have to manually set here:
    setDepartmentCodeToAppt = (fieldData = {}, appointment = {}) => {
        appointment.academicHierarchyInfo.departmentCode = parseInt(fieldData.departmentCode.value);
        return appointment;
    }

  /**
  *
  * @desc - Deletes heavy "academicHierarchyList"
  * @param {Object} appointment - deletes "academicHierarchyList" thats heavy
  *   and unneeded
  * @return {void} -
  *
  **/
    removeExtraneousDataFromAppointment(appointment) {
        delete appointment.academicHierarchyList;
    }

  /**
  *
  * @desc - Put values in fieldData into template
  * @param {Object} fieldData -
  * @param {Object} template - object where values from fieldData will end up
  * @param {Object} - pathKey
  * @return {Object} fieldData -
  *
  **/
    setFieldDataValuesOntoTemplateByPathKey(fieldData, template, {pathKey} = {}) {
        for(let name in fieldData) {
            let field = fieldData[name];
            let path = get(field, pathKey);
            let value = field.value;

      //No path defined value to set
            if(!path || value === undefined) {
                continue;
            }
            set(template, path, value);
        }
        return fieldData;
    }

  /**
  *
  * @desc - Removes certain fields usually because they cause save errors on
  *   the backend
  * @param {Object} allFieldData -
  * @param {Object} remove - default to
  * @return {Object} fieldData -
  *
  **/
    omitFieldsForSave(allFieldData, remove = ["series", "rank", "hscpScale1to9"]) {
        return omit(allFieldData, remove);
    }

  /**
  *
  * @desc - Puts comment into appointment
  * @param {Object} appointment -
  * @param {Object} comment -
  * @return {Object} fieldData -
  *
  **/
    addCommentToAppointment(appointment, comment) {
        appointment.comment = comment;
        return appointment;
    }

  /**
  *
  * @desc - Formats the fieldData and puts it onto the template for saving
  * @param {Object} allFieldData -
  * @param {Object} appointment -
  * @param {Object} appointeeInfo -
  * @param {Object} - comment
  * @return {Object} appointment -
  *
  **/
    formatProfileDataForSave(allFieldData, appointment, appointeeInfo, {comment} = {}) {
    //Dont want to save these fields
        let fieldData = this.omitFieldsForSave(allFieldData, ["series", "rank", "hscpScale1to9", "offScalePercent"]);

    //Set all values from fieldData in appointment
        this.setFieldDataValuesOntoTemplateByPathKey(fieldData, appointment, {
            pathKey: "pathsInAPI.appointment.value"});

    //Now make specific Profile related adjustments
        this.editStepValueByVisibility(fieldData);
        this.wipeValuesOfInvisibleFieldData(fieldData);

        this.formatDeptCodeByAHPath(fieldData);
        // OPUSDEV-4198 Department Code was not being set properly so have to manually set here:
        this.setDepartmentCodeToAppt(fieldData, appointment);

        this.addApuCodeToApptByFieldDataApuId(fieldData, appointment);
        this.editAPUValueByVisibility(fieldData, appointment);
    // Removed as of Jira #3122
    // this.wipeApuDesc(appointment, 'profile-current');
        this.removeExtraneousDataFromAppointment(appointment);
        this.addCommentToAppointment(appointment, comment);
        this.addCorrectAppointmentStatusField(appointment);

    // Sets scale type id to -1 if not editable and visible #scaleTypeId=-1
    // Jira #3048 #3050
        if(fieldData.scaleType && !fieldData.scaleType.visibility){
            appointment.salaryInfo.academicProgramUnit.scaleTypeId = -1;
        }

    // Jira #3160 These were all added as backend needs these fields for email notification:
    // Change step type description from step type id
        appointment = this.setStepTypeDesc(fieldData, appointment);
    // IOK-678 Check if stepTypeId is null
        appointment = this.setStepTypeId(fieldData, appointment);
    // Change location from location id
        appointment = this.setLocationForSave(fieldData, appointment);
    // Change affiliation from affiliation id
        appointment = this.setAffiliation(fieldData, appointment);
    // Change apu description from apu id
        appointment = this.setApuDesc(fieldData, appointment);
    // Change hscp scale 1 to 9
        appointment = this.setHSCPScale1to9(fieldData, appointment);
    // Change title code from title code id
        appointment = this.setTitleCode(fieldData, appointment);

        return appointment;
    }

  /**
  *
  * @desc - get formatted template data and save it.  This function is needed
  * as it gets the URL and then calls saveProfileDataToAPI
  * @param {Object} allFieldData - appointment from API
  * @param {Object} appointment - appointment from API
  * @param {Object} appointeeInfo -
  * @param {Object} - comment
  * @return {Promise} - json request
  *
  **/
    saveProfileData(allFieldData, appointment, appointeeInfo, {comment} = {}) {
    //Get formatted url to save edited appointment
        let url = this.getEditApptDataUrl(appointment, appointeeInfo);

        return this.saveProfileDataToAPI(allFieldData, appointment, appointeeInfo,
      url, {comment});
    }

  /**
  *
  * @desc - Creates template from API fields and saves it with passed in url
  * @param {Object} allFieldData - fieldData, even the ones you dont need
  * @param {Object} appointment - appointment from API
  * @param {Object} appointeeInfo -
  * @param {Object} url - comment
  * @param {Object} - comment
  * @return {Promise} - json request
  *
  **/
    saveProfileDataToAPI(allFieldData, appointment, appointeeInfo, url, {comment} = {}) {

    //Put fieldData into appointment
        this.formatProfileDataForSave(allFieldData, appointment, appointeeInfo,
      {comment});

    //Combine them into save template
        let saveTemplate = this.createProfileDataTemplate(appointment, appointeeInfo);
        let stringifiedTemplate = this.stringify(saveTemplate);

        console.log("New Profile Save template sent to API", saveTemplate);

        return util.jqueryPostJson(url, stringifiedTemplate);
    }

  /**
  *
  * @desc - Finds correct title code based on if it is active or inactive
  * @param {Object} tableData - tableData
  * @param {Object} fieldData - fieldData
  * @return {String} - String value of correct title code to display
  *
  **/
    setCorrectTitleCode(tableData) {
        let titleCode = tableData.titleCode.displayValue;
        if(!titleCode){
            titleCode = tableData.inactiveTitle.displayValue;
        }

        return titleCode;
    }

    addCorrectAppointmentStatusField(appointment){
        appointment.appointmentStatusId = parseInt(appointment.appointmentStatusType);
        appointment.appointmentStatusType = null;
    }


  // Jira #3049 Added blank option in constants file and validation here for scaleTypeId
    scaleTypeValidation(fieldData){
        if(fieldData.scaleType && fieldData.scaleType.editable && fieldData.scaleType.value===null){
            fieldData.scaleType.hasError = true;
            fieldData.scaleType.error = "Please fill out this required field.";
        }else if(fieldData.scaleType){
            fieldData.scaleType.hasError = false;
            fieldData.scaleType.error = null;
        }
        return fieldData;
    }

  /**
   *
   * @desc - Change step type description using step type id
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @return {Object} appointment
   *
   **/
    setStepTypeDesc(fieldData, appointment){
        if(fieldData.step && fieldData.step.options){
            let value = fieldData.step.value;
            let options = fieldData.step.options;
            for(let each in options){
                if(options[each][value]){
                    appointment.titleInformation.step.stepTypeDescription = options[each][value];
                    break;
                }
            }
        }
        return appointment;
    }

      /**
   *
   * @desc - IOK-678 Check stepTypeId and send 0 if value is null
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @return {Object} appointment
   *
   **/
      setStepTypeId(fieldData, appointment){
        if(fieldData.step && (fieldData.step.value==='N/A' || fieldData.step.value===null)){
          console.log("setting StepTypeId to 0");
            appointment.titleInformation.step.stepTypeId = 0;
        }
        return appointment;
    }

  /**
   *
   * @desc - Change affiliation using affiliation id
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @return {Object} appointment
   *
   **/
    setAffiliation(fieldData, appointment){
        if(fieldData.appointmentAffiliation && fieldData.appointmentAffiliation.options){
            let value = fieldData.appointmentAffiliation.value;
            let options = fieldData.appointmentAffiliation.options;
            for(let each in options){
                if(options[each][value]){
                    appointment.affiliationType.appointmentAffiliation = options[each][value];
                    appointment.affiliationType.affiliation = options[each][value];
                    break;
                }
            }
        }
        return appointment;
    }

  /**
   *
   * @desc - Change apu description using apu code
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @return {Object} appointment
   *
   **/
    setApuDesc(fieldData, appointment){
        if(fieldData.apuCode && fieldData.apuCode.options){
            let value = fieldData.apuCode.value;
            let options = fieldData.apuCode.options;
            if(options[value]){
                appointment.salaryInfo.academicProgramUnit.apuDesc = options[value];
            }
        }
        return appointment;
    }

  /**
   *
   * @desc - Change hscpScale1to9
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @return {Object} appointment
   *
   **/
    setHSCPScale1to9(fieldData, appointment){
        if(fieldData.hscpScale0 && fieldData.hscpScale0.hscpScale1to9){
            appointment.salaryInfo.hscpScale1to9 = fieldData.hscpScale0.hscpScale1to9;
        }
        return appointment;
    }

  /**
   *
   * @desc - Change titleCode using titleCodeId
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @return {Object} appointment
   *
   **/
    setTitleCode(fieldData, appointment){
        if(fieldData.titleCode && fieldData.titleCode.options){
            let value = fieldData.titleCode.value;
            let options = fieldData.titleCode.options;
            for(let each in options){
                if(options[each][value]){
                    appointment.titleInformation.titleCode = options[each][value];
                    break;
                }
            }
        }
        return appointment;
    }

    /**
   *
   * @desc - Change titleCode using titleCodeId
   * @param {Object} fieldData -
   * @param {Object} appointment -
   * @return {Object} appointment
   *
   **/
    unlinkPathPosition = async (appointment, appointeeInfo) => {
        let {access_token, adminData: {adminName}} = this;
        let {appointmentId, positionNbr} = appointment;
        let {opusPersonId} = appointeeInfo;

        //Get grouperPathText to save data
        const grouperPathText = this.getGrouperPathText(adminData);

        let urlArgs = {access_token, grouperPathText, appointmentId, opusPersonId,
        positionNbr, adminName, typeOfReq: "unconfirm"};
        let url = urlConfig.getUnlinkPathPositionUrl(urlArgs);
        return util.postJson(url);
    }

}
