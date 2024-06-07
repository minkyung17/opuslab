import moment from "moment";
import {get, sortBy, keyBy} from "lodash";


//My imports
import CasesDossier from "../CasesDossier";
import * as util from "../../../common/helpers";
import SalaryToggle from "../toggles/SalaryToggle";
import Validator from "../../../common/modules/Validate";
import FieldData from "../../../common/modules/FieldData";
import CommonCallData from "../../../common/modules/CommonCallData";
import {fieldsInAPI} from "../../constants/FieldDataConstants";
import FieldDataToggle from "../toggles/CaseDossierFieldDataToggle";
//import {constants as caseConstants} from '../../constants/CasesConstants';
import {constants, saveOptions, editAdminCompProposalConstants,
  editAdminCompFinalDecisionConstants, viewAdminCompProposalConstants} from "../../constants/admin-comp-summary/AdminCompSummaryConstants";
import {fieldNamesValidation} from "../../constants/case-summary/CaseSummaryFieldDataValidations";

/**
*
* Class dealing with Case Summary page and its functionality
* @class CaseSummary
* @extends Cases
*
**/
export default class AdminCompSummary extends CasesDossier {
    validateFieldNames = fieldNamesValidation;
    FieldData = new FieldData();
    Validator = new Validator();
    SalaryToggleLogic = new SalaryToggle();
    FieldDataToggle = new FieldDataToggle();


  /**
  *
  * @desc - Initializes Case summary variables
  * @param {Object} - adminData, access_token, globalData
  * @return {void}
  *
  **/
    constructor({adminData, access_token, globalData, ...args} = {}) {
        super({adminData, access_token, globalData, ...args});
    // 7-13-2021 set for add comment
        this.initCommonCall({access_token, adminData, globalData});

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
  * @desc - Get just the url w/ the access_token appended
  * @param {String} access_token -
  * @return {String} url - complete url with access token
  *
  **/
    getAdminCompSummaryDataAPIUrl(access_token = this.access_token) {
        let url = `${constants.urls.getAdminCompSummary}${access_token}`;
        return url;
    }

  /**
  *
  * @desc - Get only the args needed for caseSummary
  * @param {String} caseId - api results
  * @return {Object} - caseId in an object
  *
  **/
    getAdminCompSummaryDataAPIArgs(adminCompId) {
        return {adminCompProposalId: adminCompId};
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
    async getAdminCompSummaryData(adminCompId, access_token = this.access_token) {
        let adminCompSummaryUrl = this.getAdminCompSummaryDataAPIUrl(access_token);
        let adminCompSummaryArgs = this.getAdminCompSummaryDataAPIArgs(adminCompId);
        let data = await util.fetchJson(adminCompSummaryUrl, adminCompSummaryArgs);
        return data;
    }

    getModalErrorMessage = () => {
        return constants.modalErrorMessage;
    }

    getProposedValidationFields = () => {
        return constants.proposedValidationFields;
    }

    getProposedEditFields = () => {
        return constants.proposedEditFields;
    }

    getApprovedValidationFields = () => {
        return constants.approvedValidationFields;
    }

    getApprovedEditFields = () => {
        return constants.approvedEditFields;
    }

    getErrorMessage = () => {
        return constants.errorMessage;
    }

    getNinthsOtherFieldErrorMessage = () => {
        return constants.ninthsOtherFieldErrorMessage;
    }

    getStipendOtherFieldErrorMessage = () => {
        return constants.stipendOtherFieldErrorMessage;
    }

    convertMoneyValueToDisplay = (value) => {
        let convertedValue = "$0";
        if(value && value>0){
            convertedValue = util.reformatToMoneyDisplayValue(value.toFixed(2));
        }
        return convertedValue;
    }

// Check if money value greater than 0 or else return null
    checkValueElseNull = (value) => {
        let checkedValue = null;
        if(value && value>0){
            checkedValue = value;
        }
        return checkedValue;
    }

// Check value and add to total if applicable
    addValuesToTotal = (total, arrayOfValues) => {
        let newTotal = total && total>0 ? total : 0;
        for(let each of arrayOfValues){
            if(each && each>0){
                newTotal = newTotal + each;
            }
        }
        return newTotal;
    }


   /**
   *
   * @desc - Search unit
   * @param {Promise}  - promise
   *  OPUSDEV-3487 Added access_token, grouperPathText
   *
   **/
    async onSearchUnit(value) {
        let {access_token} = this;
        //Get grouperPathText to pass to the search url
        const grouperPathText = this.getGrouperPathText(this.adminData);
        // console.log(value);
        // console.log(grouperPathText);
        // console.log(access_token);
        let unitSearchUrl = "/restServices/rest/admincomp/unitSearch/"+value.toString();
        unitSearchUrl = this.addAccessTokenAndGrouperToUrl(unitSearchUrl, access_token,
      {grouperPathText, addGrouper: true});
        let resultsPromise = util.fetchJson(unitSearchUrl);
        return resultsPromise;
    }

    /**
    *
    * @desc - Get grouperPathText from adminData via profile constants
    * @param {Object} adminData -
    * @return {String} grouperPathText -
    *
    **/
    getGrouperPathText(adminData) {
        const permissions = adminData.resourceMap[viewAdminCompProposalConstants.name];
        const grouperPathText = permissions.formattedGrouperPathTexts;

        return grouperPathText;
    }

  /**
    *
    * @desc - Set highlights
    * @param {Object} adminCompSummaryData -
    * @return {void}
    *
    **/
    setHighlight = (adminCompSummaryData) => {
        let ACSD = adminCompSummaryData;
        let highlights = {};
        if(ACSD.proposedEffectiveDT !== ACSD.approvedEffectiveDT){
            highlights.effectiveDT = " light-yellow ";
        }
        if(ACSD.proposedEndDT !== ACSD.approvedEndDT){
            highlights.endDT = " light-yellow ";
        }
        if(ACSD.proposedBaseSalary !== ACSD.approvedBaseSalary){
            highlights.baseSalary = " light-yellow ";
        }
        if(ACSD.proposedNSTP !== ACSD.approvedNSTP){
            highlights.nstp = " light-yellow ";
        }
    // FTE Highlights
        if(ACSD.proposedFteEVCP !== ACSD.approvedFteEVCP){
            highlights.fteEVCP = " light-yellow ";
        }
        if(ACSD.proposedFteOther !== ACSD.approvedFteOther){
            highlights.fteOther = " light-yellow ";
        }
    // Stipend Highlights
        if(ACSD.proposedStipendEVCP !== ACSD.approvedStipendEVCP){
            highlights.stipendEVCP = " light-yellow ";
        }
        if(ACSD.proposedStipendDean !== ACSD.approvedStipendDean){
            highlights.stipendDean = " light-yellow ";
        }
        if(ACSD.proposedStipendDept !== ACSD.approvedStipendDept){
            highlights.stipendDept = " light-yellow ";
        }
        if(ACSD.proposedStipendOther !== ACSD.approvedStipendOther){
            highlights.stipendOther = " light-yellow ";
        }
        if(ACSD.proposedStipendTotal !== ACSD.approvedStipendTotal){
            highlights.totalStipend = " light-yellow ";
        }
        if(ACSD.proposedStipendOtherTotal !== ACSD.approvedStipendOtherTotal) {
            highlights.stipendOther = " light-yellow ";
        }
    // # of 9ths Highlights
        if(ACSD.proposedNinthsEVCP !== ACSD.approvedNinthsEVCP){
            highlights.ninthsEVCP = " light-yellow ";
        }
        if(ACSD.proposedNinthsDean !== ACSD.approvedNinthsDean){
            highlights.ninthsDean = " light-yellow ";
        }
        if(ACSD.proposedNinthsDept !== ACSD.approvedNinthsDept){
            highlights.ninthsDept = " light-yellow ";
        }
        if(ACSD.proposedNinthsNumberTotal !== ACSD.approvedNinthsNumberTotal){
            highlights.ninthsTotal = " light-yellow ";
        }
        if(ACSD.proposedNinthsAmountTotal !== ACSD.approvedNinthsAmountTotal){
            highlights.ninthsAmountTotal = " light-yellow ";
        }
    // 9ths Total Amount Highlights
        if(ACSD.proposedNinthsEVCPAmount !== ACSD.approvedNinthsEVCPAmount){
            highlights.ninthsEVCPAmount = " light-yellow ";
        }
        if(ACSD.proposedNinthsDeanAmount !== ACSD.approvedNinthsDeanAmount){
            highlights.ninthsDeanAmount = " light-yellow ";
        }
        if(ACSD.proposedNinthsDeptAmount !== ACSD.approvedNinthsDeptAmount){
            highlights.ninthsDeptAmount = " light-yellow ";
        }
    // Course Releases Highlights
        if(ACSD.proposedCourseReleasesDisplayValue !== ACSD.approvedCourseReleasesDisplayValue){
            highlights.courseReleases = " light-yellow ";
        }
        if(ACSD.proposedCourseReleasesEstCostDisplayValue !== ACSD.approvedCourseReleasesEstCostDisplayValue){
            highlights.courseReleasesEstCost = " light-yellow ";
        }
    // Total Admin Comp Highlights
        if(ACSD.proposedTotalAdminComp !== ACSD.approvedTotalAdminComp){
            highlights.totalAdminComp = " light-yellow ";
        }

        return highlights;
    }


    getProposedICLThreshold = (editData) => {
        let {access_token, adminData} = this;
        console.log(editData);
        // let loggedInOpusId = adminData.adminOpusId;
        let url = constants.urls.getICLThresholdUrl;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        url = url+"&opusPersonId="+editData.opusId+"&ahPathId="+editData.academicHierarchyPathId+"&effectiveDate="+editData.proposedEffectiveDTDisplayValue;
        console.log("ICL Threshold URL:");
        console.log(url);
        return util.getJson(url);
    }

    getApprovedICLThreshold = (editData) => {
        let {access_token, adminData} = this;
        console.log(editData);
        // let loggedInOpusId = adminData.adminOpusId;
        let url = constants.urls.getICLThresholdUrl;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        url = url+"&opusPersonId="+editData.opusId+"&ahPathId="+editData.academicHierarchyPathId+"&effectiveDate="+editData.approvedEffectiveDTDisplayValue;
        console.log("ICL Threshold URL:");
        console.log(url);
        return util.getJson(url);
    }

    getStipendHeaders = (ahPathId, academicYear) => {
        let {access_token} = this;
        let url = constants.urls.getStipendHeadersUrl;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        url = url+"&ahPathId="+ahPathId+"&academicYear="+academicYear;
        console.log("Stipend Header URL:");
        console.log(url);
        return util.getJson(url);
    }

    getNinthsHeaders = (ahPathId, academicYear) => {
        let {access_token} = this;
        let url = constants.urls.getNinthsHeadersUrl;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        url = url+"&ahPathId="+ahPathId+"&academicYear="+academicYear;
        console.log("Ninths Header URL:");
        console.log(url);
        return util.getJson(url);
    }

    /**
   *
   * @desc - edit url and parameters
   * @param {Object}  - editData
   * @param submitFlag
   * OPUSDEV-3487 Added access_token, and loggedInOpusId
   *
   **/
    async saveProposedEditData(editData, adminCompSummaryDataFromAPI, submitFlag) {
        let {access_token, adminData} = this;
        let loggedInOpusId = adminData.adminOpusId;
        let loggedFirstName = adminData.adminFirstName;
        let loggedLastName = adminData.adminLastName;
        let loggedEmail = adminData.adminEmail;
        let dataToEdit = adminCompSummaryDataFromAPI.acPropComp;

    // Normal fields
        let fields = this.getProposedEditFields();
        for(let each of fields){
            dataToEdit[each] = editData[each];
        }

    // Component Related fields
        this.getComponentFields(dataToEdit, editData, constants.proposedFteFields);
        this.getComponentFields(dataToEdit, editData, constants.proposedStipendFields);
        this.getComponentFields(dataToEdit, editData, constants.proposedNinthsFields, "proposed", "9ths");

        if(editData.stipendOther && editData.stipendOther.length>0){
            this.createOtherSourceObject(dataToEdit, editData, "Proposed", "stipendOther");
        }
        if(editData.ninthsOther && editData.ninthsOther.length>0){
            this.createOtherSourceObject(dataToEdit, editData, "Proposed", "ninthsOther");
        }

        console.log("Edit data being sent to backend:");
        console.log(dataToEdit);

        let stringified = JSON.stringify(dataToEdit);
        let editUrl = constants.urls.saveProposedUrl;
        editUrl = this.addAccessTokenAndGrouperToUrl(editUrl, access_token,
      {addGrouper: false});
        editUrl = editUrl+"&loggedInOpusId="+loggedInOpusId+"&loggedFirstName="+loggedFirstName+"&loggedLastName="+loggedLastName+"&loggedEmail="+loggedEmail+"&submitFlag="+submitFlag;

        // console.log("Edit URL:");
        // console.log(editUrl);

        return util.jqueryPostJson(editUrl, stringified);
    }

  /**
   *
   * @desc - edit url and parameters
   * @param {Object}  - editData
   * OPUSDEV-3487 Added access_token, and loggedInOpusId
   *
   **/
    async saveApprovedEditData(editData, adminCompSummaryDataFromAPI, isCompleteFlag) {
        let {access_token, adminData} = this;
        let loggedInOpusId = adminData.adminOpusId;
        let loggedFirstName = adminData.adminFirstName;
        let loggedLastName = adminData.adminLastName;
        let loggedEmail = adminData.adminEmail;

        let dataToEdit = adminCompSummaryDataFromAPI.acPropComp;

    // Normal fields
        let fields = this.getApprovedEditFields();
        // console.log(fields);
        for(let each of fields){
            dataToEdit[each] = editData[each];
        }

    // Component Related fields
        this.getComponentFields(dataToEdit, editData, constants.approvedFteFields);
        this.getComponentFields(dataToEdit, editData, constants.approvedStipendFields);
        this.getComponentFields(dataToEdit, editData, constants.approvedNinthsFields, "approved", "9ths");

        if(editData.stipendOther && editData.stipendOther.length>0){
            this.createOtherSourceObject(dataToEdit, editData, "Approved", "stipendOther");
        }
        if(editData.ninthsOther && editData.ninthsOther.length>0){
            this.createOtherSourceObject(dataToEdit, editData, "Approved", "ninthsOther");
        }

        // console.log("Edit data being sent to backend:");
        // console.log(dataToEdit);

        let stringified = JSON.stringify(dataToEdit);
        let editUrl = constants.urls.saveFinalDecisionUrl;
        editUrl = this.addAccessTokenAndGrouperToUrl(editUrl, access_token,
      {addGrouper: false});
        editUrl = editUrl+"&loggedInOpusId="+loggedInOpusId+"&loggedFirstName="+loggedFirstName+"&loggedLastName="+loggedLastName+"&loggedEmail="+loggedEmail+"&isComplete="+isCompleteFlag;

        // console.log("Edit URL:");
        // console.log(editUrl);

        return util.jqueryPostJson(editUrl, stringified);
    }

    getComponentFields = (dataToEdit, editData, fields, typeOfOther = null, typeOfComponent = null) => {

        for(let each of fields){
            let index = editData[each+"Index"];
            let value = editData[each];
            let currentComponent = dataToEdit.components[index];
            if(currentComponent.componentValue!==value){
                currentComponent.componentValue = value;
                currentComponent.recStatus = "C";
            }
            if(typeOfComponent==="9ths"){
                // Find 9ths Amount component in editData

                let fieldToGet = typeOfOther+"NinthsEVCP";
                let componentField = "EVCP";
                if(currentComponent.sourceType==="Dean"){
                    fieldToGet = typeOfOther+"NinthsDean";
                    componentField = "Dean";
                }else if(currentComponent.sourceType==="Dept."){
                    fieldToGet = typeOfOther+"NinthsDept";
                    componentField = "Dept.";
                }

                // Find corresponding 9ths Number component
                for(let insideEach of dataToEdit.components){
                    if(insideEach.componentType==="9ths Number" && insideEach.sourceType===componentField
                        && currentComponent.proposedApprovedId===insideEach.proposedApprovedId){
                        insideEach.componentValue = editData[fieldToGet];
                        insideEach.recStatus = "C";
                    }
                }
            }
        }
        return dataToEdit;
    }

    createOtherSourceObject = (dataToEdit, editData, proposedApproved, typeOfOther) => {

    // stipendOther componentTypeId is 1, ninthsOther componentTypeId is 2
        let componentTypeId = 1

        if(typeOfOther==="ninthsOther"){
            componentTypeId = 2;
        }

        for(let each of editData[typeOfOther]){

      // Find correct component value
            let componentValue = proposedApproved==="Proposed" ? each.proposedValue : each.approvedValue;
            if(typeOfOther==="ninthsOther"){
                componentValue = proposedApproved==="Proposed" ? each.proposedNinthsValue : each.approvedNinthsValue;
            }
      // If Unchanged (recStatus is "U"), do nothing because it already exists in components

      // If New, create new object here (skip blank names since validation should force users to enter a value)
            if(each.recStatus==="N" && each.name && each.name!==""){
                let otherSourceObject = {
                    adminCompProposalId: editData.adminCompProposalId,
                    componentType: typeOfOther==="stipendOther" ? "Stipend" : "9ths Number",
                    componentTypeId: componentTypeId,
                    componentValue: componentValue,
                    otherDescription: each.name,
                    proposedApproved: proposedApproved,
                    proposedApprovedId: proposedApproved==="Proposed" ? 1 : 2,
                    recStatus: "N",
                    sourceType: "Other",
                    sourceTypeId: 4,
                    sourceTypeSequence: null
                };
                dataToEdit.components.push(otherSourceObject);
                // IOK-605 For Administrative 9ths, need to create a "9ths Amount" component along with the "9ths Number"
                if(typeOfOther!=="stipendOther"){
                    let otherSourceObject2 = {
                        adminCompProposalId: editData.adminCompProposalId,
                        componentType: "9ths Amount",
                        componentTypeId: 3,
                        componentValue: proposedApproved==="Proposed" ? each.proposedNinthsAmountValue : each.approvedNinthsAmountValue,
                        otherDescription: each.name,
                        proposedApproved: proposedApproved,
                        proposedApprovedId: proposedApproved==="Proposed" ? 1 : 2,
                        recStatus: "N",
                        sourceType: "Other",
                        sourceTypeId: 4,
                        sourceTypeSequence: null
                    };
                    dataToEdit.components.push(otherSourceObject2);
                }
            }else if(each.recStatus==="C" || each.recStatus==="D"){

        // Find index in components
                let index = proposedApproved==="Proposed" ? each.originalProposedFields.index : each.originalApprovedFields.index;
        // Set correct recStatus
                dataToEdit.components[index].recStatus = each.recStatus;

        // If edited, set changed value
                if(each.recStatus==="C"){
                    dataToEdit.components[index].otherDescription = each.name;
                    dataToEdit.components[index].componentValue = componentValue;
                    // dataToEdit.components[index].sourceTypeSequence = proposedApproved==="Proposed" ? each.originalProposedFields.sourceTypeSequence : each.originalApprovedFields.sourceTypeSequence;
                    if(proposedApproved==="Approved"){
                        let approvedIndex = each.originalApprovedFields.index;
            // Find corresponding approved and change otherDescription value;
                        dataToEdit.components[approvedIndex].otherDescription = each.name;
                    }

                    if(typeOfOther==="ninthsOther"){
                        // Find corresponding 9ths Amount component
                        for(let insideEach of dataToEdit.components){
                            let fields = each.originalProposedFields;
                            if(proposedApproved==="Approved"){
                                fields = each.originalApprovedFields;
                            }
                            if(fields.proposedApprovedId===insideEach.proposedApprovedId
                                && fields.sourceTypeId===insideEach.sourceTypeId
                                && fields.sourceTypeSequence===insideEach.sourceTypeSequence
                                && insideEach.componentTypeId === 3){
                                    insideEach.recStatus = "C";
                                    insideEach.componentValue = proposedApproved==="Proposed" ? each.proposedNinthsAmountValue : each.approvedNinthsAmountValue;
                                }
                        }
                    }
                }

            }
        }

        return dataToEdit;
    }

  /*****************************************************************************
  *
  * Section w/ functions for ADDING COMMENTS  7-9-2021
  *
  *****************************************************************************/
  /**
  *
  * @desc - Gets the url encoded headers
  * @return {Object} - urlEncodedHeaders
  *
  **/
    getSaveHeaders() {
        return saveOptions.urlEncodedHeaders;
    }

  /**
  *
  * @desc - Get comments from backend
  * @param {String} primaryKeyValue - adminCompId
  * @param {Object} access_token - get Comments
  * @return {Promise} - Promise to be resolved in comments
  *
  **/
    getCommentsByIdProposed = async (primaryKeyValue, {access_token} = this)  => {
        let secondaryKeyValue = 1;
        let url = constants.urls.getAdminCompProposalCommentsURL({primaryKeyValue, secondaryKeyValue, access_token});
        let comments = await util.getJson(url);
        return comments;
    }

    getCommentsByIdApproved = async (primaryKeyValue, {access_token} = this)  => {
        let secondaryKeyValue = 2;
        let url = constants.urls.getAdminCompProposalCommentsURL({primaryKeyValue, secondaryKeyValue, access_token});
        let comments = await util.getJson(url);
        return comments;
    }

  /**
  *
  * @desc - Get add comment url from backend for both proposed and approved
  * @return {Promise} - json request
  *
  **/
    getAddAdminCompCommentUrl({access_token} = this) {
        return constants.urls.addAdminCompProposalCommentsURL({access_token});
    }

  /**
  *
  * @desc - Save comment to backend
  * @param {Object} commentsText - String text
  * @param {Object} primaryKeyValue - adminComp from backend
  * @param {Object} commentAPIData - Previously created comment if not new
  * @return {Promise} - json request
  *
  **/
    getSaveCommentArgsProposed(commentsText, primaryKeyValue) {

        let commentUrl = this.getAddAdminCompCommentUrl();

        let urlEncodedHeaders = this.getSaveHeaders();

        return {entityKeyColumnValue: primaryKeyValue, entity2KeyColumnValue: 1,
      commentUrl, urlEncodedHeaders};
    }

    getSaveCommentArgsApproved(commentsText, primaryKeyValue) {

        let commentUrl = this.getAddAdminCompCommentUrl();

        let urlEncodedHeaders = this.getSaveHeaders();

        return {entityKeyColumnValue: primaryKeyValue, entity2KeyColumnValue: 2,
      commentUrl, urlEncodedHeaders};
    }

  /**
  *
  * @desc - Check if user can edit proposals
  * @param {Object} adminData - has edit proposal resource
  * @return {Object} - can edit proposals
  *
  **/
    canEditAdminCompProposals() {
        let {resourceMap} = this.adminData;
        let accessGranted = false;
        if(resourceMap[editAdminCompProposalConstants.name]
            && resourceMap[editAdminCompProposalConstants.name].action === editAdminCompProposalConstants.action) {
            accessGranted = true;
        }
        return  accessGranted;
    }

  /**
  *
  * @desc - Check if user can edit final decision
  * @param {Object} adminData - has edit final decision resource
  * @return {Object} - can edit final decision
  *
  **/
    canEditAdminCompFinalDecision() {
        let {resourceMap} = this.adminData;
        let accessGranted = false;
        if(resourceMap[editAdminCompFinalDecisionConstants.name]
          && resourceMap[editAdminCompFinalDecisionConstants.name].action === editAdminCompFinalDecisionConstants.action) {
            accessGranted = true;
        }
        return  accessGranted;
    }


    /**
    *
    * @desc - Check if save proposals button is enabled
    * @param {Object} clonedAdminCompSummaryData - has proposal status fields
    * @return {Object} - can edit proposals
    *
    **/
    shouldSaveButtonBeDisabledForProposedModal = (clonedAdminCompSummaryData) => {
        let {isOAOrAPO, isSA, isDivisionAdmin} = this.CasesAdminPermissions.getFieldPermissionArgs(this.adminData);
        let shouldItBeDisabled = false;
        let status = clonedAdminCompSummaryData.acPropComp.status;
        // Save button disabled if OA, APO or SA logs in and status is submitted, under review, or completed
        if((isSA || isOAOrAPO || isDivisionAdmin) &&
            (status === "Submitted" || status === "Under Review" || status === "Completed")){
            shouldItBeDisabled = true;
        }
        return  shouldItBeDisabled;
    }

    /**
    *
    * @desc - Check if submit proposals button is enabled
    * @param {Object} clonedAdminCompSummaryData - has proposal status fields
    * @return {Object} - can edit proposals
    *
    **/
    shouldSubmitBeDisabledForProposedModal = (clonedAdminCompSummaryData) => {
        let {isOAOrAPO, isSA, isDivisionAdmin} = this.CasesAdminPermissions.getFieldPermissionArgs(this.adminData);
        let shouldItBeDisabled = false;
        let status = clonedAdminCompSummaryData.acPropComp.status;
        // Save button disabled if SA and status is submitted
        if((isSA || isDivisionAdmin) && status === "Submitted") {
            shouldItBeDisabled = true;
        }
        // Save button disabled if OA, APO or SA logs in and status is under review, or completed
        if((isSA || isOAOrAPO || isDivisionAdmin) &&
            (status === "Under Review" || status === "Completed")){
            shouldItBeDisabled = true;
        }
        return  shouldItBeDisabled;
    }

        /**
    *
    * @desc - Check if save final decisions button is enabled
    * @param {Object} clonedAdminCompSummaryData - has final decision status fields
    * @return {Object} - can edit final decisions
    *
    **/
    shouldSaveButtonBeDisabledForFinalDecisionModal = (clonedAdminCompSummaryData) => {
        let {isOAOrAPO, isSA} = this.CasesAdminPermissions.getFieldPermissionArgs(this.adminData);
        let shouldItBeDisabled = false;
        let status = clonedAdminCompSummaryData.acPropComp.status;
            // Save button disabled if SA logs in and status is in submitted or under review
        if(isSA && (status === "Submitted" || status === "Under Review")){
            shouldItBeDisabled = true;
        }
            // Save button disabled if OA, APO or SA logs in and status is in progress or completed
        if((isSA || isOAOrAPO) &&
                (status === "In Progress" || status === "Completed")){
            shouldItBeDisabled = true;
        }
        return  shouldItBeDisabled;
    }

        /**
        *
        * @desc - Check if complete final decisions button is enabled
        * @param {Object} clonedAdminCompSummaryData - has final decision status fields
        * @return {Object} - can edit final decisions
        *
        **/
    shouldCompleteBeDisabledForFinalDecisionModal = (clonedAdminCompSummaryData) => {
        let {isOAOrAPO, isSA} = this.CasesAdminPermissions.getFieldPermissionArgs(this.adminData);
        let shouldItBeDisabled = false;
        let status = clonedAdminCompSummaryData.acPropComp.status;
            // Complete button disabled if SA logs in and status is in progress, submitted, under review or completed
        if((isSA) &&
                (status === "In Progress" || status === "Submitted" || status === "Under Review" || status === "Completed")){
            shouldItBeDisabled = true;
        }
            // Complete button disabled if OA or APO logs in and status is in progress
        if(isOAOrAPO && status === "In Progress"){
            shouldItBeDisabled = true;
        }
        return  shouldItBeDisabled;
    }

   /**
  *
  * @desc - Save comment to backend
  * @param {Object} commentsText - String text
  * @param {Object} entityKeyColumnValue - adminCompId
  * @param {Object} entity2KeyColumnValue - 1 or 2
  * @param {Object} commentAPIData - Previously created comment if not new
  * @return {Promise} - json request
  *
  **/
    formatSaveCommentTemplateProposed(commentsText, entityKeyColumnValue, entity2KeyColumnValue =
      "1", commentAPIData = {}) {
        let {adminData: {adminOpusId}} = this;

        let template = {
            commentsText,
            entityKeyColumnValue,
            entity2KeyColumnValue,
            loggedInUserName: adminOpusId
        };
        return template;
    }

    formatSaveCommentTemplateApproved(commentsText, entityKeyColumnValue, entity2KeyColumnValue =
      "2", commentAPIData = {}) {
        let {adminData: {adminOpusId}} = this;

        let template = {
            commentsText,
            entityKeyColumnValue,
            entity2KeyColumnValue,
            loggedInUserName: adminOpusId
        };
        return template;
    }
  /**
  *
  * @desc - Save comment to backend
  * @param {Object} commentsText - String text
  * @param {Object} adminCompSummaryData - adminCompSummary from backend
  * @param {Object} commentAPIData - Previously created comment if not new
  * @return {Promise} - json request
  *
  **/
    async saveCommentProposed(commentsText, adminCompSummaryData = {}) {
        let {access_token, adminData} = this;
        let loggedInOpusId = adminData.adminOpusId;

        let args = this.getSaveCommentArgsProposed(commentsText, adminCompSummaryData);
        let {entityKeyColumnValue, entity2KeyColumnValue} = args;
        let commentUrl = this.getAddAdminCompCommentUrl();

        let template = this.formatSaveCommentTemplateProposed(commentsText, entityKeyColumnValue,
      entity2KeyColumnValue);

        let {urlEncodedHeaders} = args;
        console.log("Proposed comments sent to back:");
        console.log(args);

        let didSaveComment = await util.jqueryPostJson(commentUrl, template,
      urlEncodedHeaders);

        console.log("Proposed comments URL:");
        console.log(commentUrl);

        return didSaveComment;
    }

    async saveCommentApproved(commentsText, adminCompSummaryData = {}) {
        let {access_token, adminData} = this;

        let args = this.getSaveCommentArgsApproved(commentsText, adminCompSummaryData);
        let {entityKeyColumnValue, entity2KeyColumnValue} = args;
        let commentUrl = this.getAddAdminCompCommentUrl();

        let template = this.formatSaveCommentTemplateProposed(commentsText, entityKeyColumnValue,
      entity2KeyColumnValue);

        let {urlEncodedHeaders} = args;
        console.log("Approved comments sent to back:");
        console.log(args);

        let didSaveComment = await util.jqueryPostJson(commentUrl, template,
      urlEncodedHeaders);

        console.log("Approved comments URL:");
        console.log(commentUrl);

        return didSaveComment;
    }
// end of Comment Modal

    getTrackingSearchErrorMessage = () => {
        return constants.trackingSearchErrorMessage;
    }

  /**
   * 5-10-2021
   * @desc - save tracking url and parameters
   * @param {Object}  - trackingData
   **/

    getTrackingFields = () => {
        return constants.trackingFields;
    }

    async saveTrackingData(trackingData, adminCompSummaryDataFromAPI) {
        let {access_token, adminData} = this;
        let loggedInOpusId = adminData.adminOpusId;

        let trackingDataToAdd = adminCompSummaryDataFromAPI.acProposalTracking;

    // Normal fields
        let fields = this.getTrackingFields();
        for(let each of fields){
            trackingDataToAdd[each] = trackingData[each];
        }

    // 5-11-2021 below under construction
        console.log("Tracking data that was changed:");
        console.log(trackingData);
        console.log("Tracking data being sent to backend:");
        console.log(trackingDataToAdd);

        let stringified = JSON.stringify(trackingDataToAdd);
        let trackingUrl = constants.urls.trackingUrl;
        trackingUrl = this.addAccessTokenAndGrouperToUrl(trackingUrl, access_token,
      {addGrouper: false});
        trackingUrl = trackingUrl+"&loggedInOpusId="+loggedInOpusId;

        console.log("Tracking URL:");
        console.log(trackingUrl);

        return util.jqueryPostJson(trackingUrl, stringified);

    }

    /*****************************************************************************
     *
     * RE-498 Common logic between proposed and final decision
     *
     *****************************************************************************/

    // validateDecimalInputsForNumberOfAdminNinths(e) {
    //     var beforeDecimal = 2;
    //     var afterDecimal = 4;
    //     e.target.value = e.target.value
    //         .replace(/[^\d.]/g, "")
    //         .replace(new RegExp("(^[\\d]{" + beforeDecimal + "})[\\d]", "g"), "$1")
    //         .replace(/(\..*)\./g, "$1")
    //         .replace(new RegExp("(\\.[\\d]{" + afterDecimal + "}).", "g"), "$1");
    //     return e;
    // }

    validateDecimalInputsForAmount(e) {
        // var beforeDecimal = 2;
        var afterDecimal = 2;
        e.target.value = e.target.value
            .replace(/[^\d.]/g, "")
            // .replace(new RegExp("(^[\\d]{" + beforeDecimal + "})[\\d]", "g"), "$1")
            .replace(/(\..*)\./g, "$1")
            .replace(new RegExp("(\\.[\\d]{" + afterDecimal + "}).", "g"), "$1");
        return e.target.value;
    }

    setRecStatus = (editData, typeOfOther, index) => {
        if(editData[typeOfOther][index].recStatus!=="N"){
            editData[typeOfOther][index].recStatus = "C";
        }
        return editData;
    }

    findOtherTotal = (editData, typeOfOther, fieldToSave, fieldToGet) => {
        let total = 0;
        let array = editData[typeOfOther];
        for(let each in array){
            if(array[each].recStatus!=="D"){
                total = total + array[each][fieldToGet];
            }
        }
        editData[fieldToSave] = total;
        return editData;
    }


}
