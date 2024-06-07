import AdminComp from "./AdminComp";
import FileSaver from "file-saver";
import {postJson, jsonToUrlArgs} from "../../common/helpers/index";
import * as util from "../../common/helpers";
import {config, totals} from "../constants/AdminCompProposalsConstants";
import moment from "moment";
import CommonCallData from "../../common/modules/CommonCallData";
//4-30-2021 name search from profile
import {text, urlConfig, profileSaveTemplate, profileConstants} from
  "../../../opus-logic/cases/constants/profile/ProfileConstants";
import {editAdminCompProposalConstants} from "../../../opus-logic/cases/constants/admin-comp-summary/AdminCompSummaryConstants";


/******************************************************************************
 *
 * @desc - Administrative Compensation
 *
 ******************************************************************************/

export default class AdminCompProposals extends AdminComp {
    startingDataTableConfiguration = null;

  /**
  *
  * @desc - Static variables
  *
  **/
    defaultConfigName = "adminCompProposals";

  /**
   *
   * @desc -
   * @param {Object}
   *
   **/
    constructor(args = {}) {
        super(args);
        this.startLogic(args);
        this.args = args;
        this.canViewAdminCompReportTab1();
        this.canViewAdminCompTabs1();
        this.initCommonCall();
        this.totals = totals;
    }

    /**
     *
     * @desc - Everyone except DA, CAP and Chair cannot see report tabs
     **/
    canViewAdminCompReportTab1() {
        let {isCAP, isVCAP, isDA, isSA, isDean, isAA,
          isChair, isLibrarySA, isDivisionAdmin} = this.Permissions;
        if(!isVCAP && !isCAP && !isDA && !isSA && !isDean
          && !isAA && !isChair && !isLibrarySA && !isDivisionAdmin) {
            document.getElementById("allAdminCompTabs").style.display = "block";
        }
    }

    /**
     *
     * @desc - Everyone except DA, CAP and Chair cannot see report tabs
     **/
    canViewAdminCompTabs1() {
        let {isAPO, isOA, isAPOAdmin} = this.Permissions;
        if(!isAPO && !isOA && !isAPOAdmin) {
            document.getElementById("reportTab").style.display = "block";
        }
    }

    initCommonCall() {
        let {access_token, adminData, globalData} = this;
        this.CommonCallLists = new CommonCallData({access_token, adminData, globalData});
        this.formattedCommonCallLists = this.CommonCallLists.formattedCommonCallLists;
    }

    getFormattedRowDataFromServer = async () => {
        let originalRowData = await super.getFormattedRowDataFromServer();
        this.attachStatusToRowData(originalRowData);
        return originalRowData;
    }
    /**
   *
   * @desc - gets data from server and then parses it out from the unique key i.e.
   *  {activeCaseDataRows: Array[9000 results]} via dtConfig
   * @param {Object} dataTableConfiguration - d.t. config
   * @return {Array} - configured column information
   *
   **/
    async getRowDataFromServer({dataTableConfiguration = this.dataTableConfiguration} = {}) {
    // This is so that the Time Difference console log works for initial load
        this.consoleLogDifference("START");
        let results = await this.retrieveResultsFromServer({dataTableConfiguration});
    // console.log(results)
        this.filterViews = results["opusDisplayPreferences"];
        let rowData = results[dataTableConfiguration.dataRowName];
    // Find dropdown options from API
        this.dataTableConfiguration = this.attachFilterLists(dataTableConfiguration, results);
        rowData = this.formatRowData(rowData);
        this.rowData = rowData;
        this.maxRowCount = this.rowData.length;
        return this.rowData;
    }

    /**
 *
 * @desc - Filters data using saved filters in dataTableConfiguration
 * @param {Array} rowData - array of row data results from server
 * @param {Object} dataTableConfiguration -
 * @return {Array} formattedRowData
 *
 **/
    filterAPITableData(rowData = this.rowData, dataTableConfiguration =
      this.dataTableConfiguration) {
        let formattedRowData = super.filterAPITableData(rowData, dataTableConfiguration);

      // Set current row data to find totals later on
        this.currentRowData = formattedRowData;
        return formattedRowData;
    }

    async getNewACProposal() {
        let {access_token, adminData} = this;
        let selectedOpusId = adminData.adminOpusId;
        let loggedInOpusId = adminData.adminOpusId;
        let urlParameters = {selectedOpusId, loggedInOpusId, access_token};
        let url = config.newACProposalUrl;
        let resultsPromise = util.fetchJson(url, urlParameters);
        return resultsPromise;
    }

    async getNewACProposalHeader(selectedOpusId) {
        let {access_token, adminData} = this;
        let loggedInOpusId = adminData.adminOpusId;
        let urlParameters = {selectedOpusId, loggedInOpusId, access_token};
        let url = config.newACProposalUrl;
        let resultsPromise = util.fetchJson(url, urlParameters);
        return resultsPromise;
    }

  /**
  *
  * @desc - Check if user can add proposals
  * @param {Object} adminData - has add proposal resouce
  * @return {Object} - can add proposals
  *
  **/
    canAddAdminCompProposals() {
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
  * @desc - get all lists from adminData and globalData
  * @return {Object} - all the api lists from adminData and globalData
  *
  **/
    getAPIListsFromCommonCallData() {
        return CommonCallLists.getAPIListsFromCommonCallData();
    }

    attachFilterLists = (dataTableConfiguration, results) => {
        let typeOfApptFilterList = results["typeOfApptFilterList"];
        let multipleAdminApptsFilterList = results["multipleAdminApptsFilterList"];
        let outcomeFilterList = results["outcomeFilterList"];
        let valueOptions = [];
    // Type of Appt. List
        for(let each in typeOfApptFilterList){
            valueOptions.push(typeOfApptFilterList[each]);
        }
        dataTableConfiguration.columnConfiguration.typeOfAppt.valueOptions = valueOptions;
        valueOptions = [];
    // Multiple Admin Appt.
        for(let each in multipleAdminApptsFilterList){
            valueOptions.push(multipleAdminApptsFilterList[each]);
        }
        dataTableConfiguration.columnConfiguration.multipleAdminAppts.valueOptions = valueOptions;
        valueOptions = [];
    // Outcome Actions
        for(let each in outcomeFilterList){
            valueOptions.push(outcomeFilterList[each]);
        }
        dataTableConfiguration.columnConfiguration.outcome.valueOptions = valueOptions;
    // OPUSDEV-3535
        dataTableConfiguration.columnConfiguration.overICL.valueOptions = ["Yes", "No"];
	dataTableConfiguration.columnConfiguration.nstp.valueOptions = ["Yes", "No"];

        return dataTableConfiguration;
    }

  // Totals
    findTotals = () => {
        let rowData = this.currentRowData ? this.currentRowData : [];
        let totals = this.totals;
    // Reset totals here
        for(let eachTotal of totals){
            let totalsInsideEachtotal = eachTotal.totals;
            for(let insideTotal of totalsInsideEachtotal){
                insideTotal.amount = 0;
                insideTotal.ninthsAmount ? insideTotal.ninthsAmount = 0 : null;
            }
        }
    // Find totals here
        for(let each of rowData){
            for(let eachTotal of totals){
                let totalsInsideEachtotal = eachTotal.totals;

                for(let insideTotal of totalsInsideEachtotal){

                    let name = insideTotal.name;
                    if(!name){
                        name = eachTotal.name;
                    }
                    if(name!=="grandTotal"){
                        insideTotal.amount = insideTotal.amount + each.originalData[name];
                        eachTotal.totals.length>1 ? eachTotal.totals[4].amount = eachTotal.totals[4].amount + each.originalData[name] : null;
                        if(insideTotal.ninthsName && each.originalData[insideTotal.ninthsName] && each.originalData[insideTotal.ninthsName]>0){
                            insideTotal.ninthsAmount = parseFloat((insideTotal.ninthsAmount + each.originalData[insideTotal.ninthsName]).toFixed(4));
                            eachTotal.totals.length>1 ? eachTotal.totals[4].ninthsAmount = parseFloat((eachTotal.totals[4].ninthsAmount + each.originalData[insideTotal.ninthsName]).toFixed(4)) : null;
                        }
                    }
                }

            }
        }
        return totals;
    }

    convertMoneyValueToDisplay = (value) => {
        let convertedValue = "$0";
        if(value && value>0){
            convertedValue = util.reformatToMoneyDisplayValue(value.toFixed(2));
        }
        return convertedValue;
    }


    /**
   *
   * @desc - Format incoming data to display correctly
   * @desc - ucPathPosition comes in separate  by # and @
   * @param {Object} match - match coming in
   * @return {Object} match - reformatted match
   *
   **/
    formatRowData = (rowData) => {
        for(let each in rowData){
            let row = rowData[each];
            row.proposedFte = row.proposedFte ? this.formatFieldToColumns(row.proposedFte, false) : [];
            row.approvedFte = row.approvedFte ? this.formatFieldToColumns(row.approvedFte, false) : [];
            row.proposedStipends = row.proposedStipends ? this.formatFieldToColumns(row.proposedStipends, true) : [];
            row.approvedStipends = row.approvedStipends ? this.formatFieldToColumns(row.approvedStipends, true) : [];
            row.proposedAdministrativeNinths = row.proposedAdministrativeNinths ? this.formatFieldToColumns(row.proposedAdministrativeNinths, true) : [];
            row.approvedAdministrativeNinths = row.approvedAdministrativeNinths ? this.formatFieldToColumns(row.approvedAdministrativeNinths, true) : [];
      // Convert date fields
            row.deanSubmissionDT = row.deanSubmissionDT ? moment(row.deanSubmissionDT).format("L") : null;
            row.effectiveDT = row.effectiveDT ? moment(row.effectiveDT).format("L") : null;
            row.endDT = row.endDT ? moment(row.endDT).format("L") : null;
            row.evcpapprovedDT = row.evcpapprovedDT ? moment(row.evcpapprovedDT).format("L") : null;
            row.ucopapprovedDT = row.ucopapprovedDT ? moment(row.ucopapprovedDT).format("L") : null;
            row.completedDT = row.completedDT ? moment(row.completedDT).format("L") : null;
            row.totalProposedAdminComp = row.totalProposedAdminComp ? parseFloat(row.totalProposedAdminComp.toFixed(2)) : null;
            row.totalApprovedAdminComp = row.totalApprovedAdminComp ? parseFloat(row.totalApprovedAdminComp.toFixed(2)) : null;
            row.totalProposedComp = row.totalProposedComp ? parseFloat(row.totalProposedComp.toFixed(2)) : null;
            row.totalApprovedComp = row.totalApprovedComp ? parseFloat(row.totalApprovedComp.toFixed(2)) : null;

      // OPUSDEV-3535 Outcome fields in proposals table is coming in as null values.  Our blank filter looks for blank strings that look like ““.
      // Null values get turned into string values such as “null” which misses the blank filtering.
            row.outcome = row.outcome ? row.outcome : "";

            row.organizationName = row.organizationName ? row.organizationName.charAt(0).toUpperCase() + row.organizationName.slice(1) : null;
            row.workingTitle = row.workingTitle ? row.workingTitle.charAt(0).toUpperCase() + row.workingTitle.slice(1) : null;

      // add Proposal Summary Page Link
            row.link = "/opusWeb/ui/admin/admin-comp-proposals-summary.shtml?adminCompId=" + row.adminCompProposalId.toString();
        }


        return rowData;
    }

    formatFieldToColumns = (field, shouldHaveExtraValue) => {
        let rowInCell = field.split("|");
    // for(let each in rowInCell){
    //   if(rowInCell[each]!==""){
    //     let formattedValue = rowInCell[each].split(":");
    //     let dollarSign = " ";
    //     let value1 = formattedValue[0]+":";
    //     let value2 = formattedValue[1];
    //     let extraValue = " ";
    //     if(shouldHaveExtraValue){
    //       let value2Split = value2.split("$");
    //       extraValue = value2Split[0];
    //       value2 = value2Split[1];
    //       dollarSign = "$";
    //     }
    //     console.log(value1, extraValue, dollarSign, value2)
    //     // debugger;
    //     rowInCell[each] = [value1, extraValue, dollarSign, value2];
    //   }else{
    //     rowInCell[each] = [" ", " ", " ", " "];
    //   }
    //   // console.log(rowInCell)
    // }
        let mergedRowInCell = [].concat.apply([], rowInCell);
        return mergedRowInCell;
    }



  /**
   *
   * @desc - Clone edit data from row data
   * @return {Object} - cloned object
   *
   **/
    cloneEditData = (rowData) => {
        return util.cloneObject(rowData);
    }

  /**
   *
   * @desc - Gets dropdown options from api call
   * @return {Object} - promise needed for dropdown call
   *
   **/
    async getDropdownOptions() {
        let {dropdownUrl} = this.dataTableConfiguration;
        let urlParameters = this.getDataUrlParameters(this.dataTableConfiguration);
        let resultsPromise = util.fetchJson(dropdownUrl, urlParameters);
        return resultsPromise;
    }

/******************************************************************************
 *
 * @desc - Add Modal functions and components
 *
 ******************************************************************************/

    getErrorMessage = () => {
        return "This cannot be blank on save.";
    }

    getNinthsOtherFieldErrorMessage = () => {
        return "Both the name and 9ths amount fields must be completed on save.";
    }

    getStipendOtherFieldErrorMessage = () => {
        return "Both the name and amount fields must be completed on save.";
    }

    getModalErrorMessage = () => {
        return "Sorry, there was a problem. Please check the form for errors.";
    }

    getAddNewValidationFields = () => {
        return ["academicYear", "typeOfApptId", "proposedEffectiveDT", "proposedEndDT", "unit", "proposedFteEVCP", "proposedFteOther",
    "organizationName", "titleCodeId", "workingTitle", "multipleAdminApptsId", "proposedBaseSalary", "proposedCourseReleases", "proposedCourseReleasesEstCost",
    "proposedStipendEVCP", "proposedStipendDean", "proposedStipendDept", "proposedNinthsEVCPAmount", "proposedNinthsDeanAmount", "proposedNinthsDeptAmount"];
    }

    getAddNewEditFields = () => {
        return ["emplName", "email", "uid", "opusId","academicHierarchyPathId", "academicYear", "typeOfApptId", "proposedEffectiveDT", "proposedEndDT",
    "organizationName", "titleCodeId", "workingTitle", "justification", "multipleAdminApptsId", "proposedBaseSalary", "proposedNSTP", "proposedNinthsRate",
    "proposedCourseReleases", "proposedCourseReleasesEstCost", "comments"];
    }

    getICLThreshold = (addData) => {
        let {access_token, dataTableConfiguration} = this;
        // let loggedInOpusId = adminData.adminOpusId;
        let url = dataTableConfiguration.getICLThresholdUrl;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        url = url+"&opusPersonId="+addData.opusId+"&ahPathId="+addData.academicHierarchyPathId+"&effectiveDate="+moment(addData.proposedEffectiveDT).format('L');
        console.log("ICL Threshold URL:");
        console.log(url);
        return util.getJson(url);
    }

    getStipendHeaders = (ahPathId, academicYear) => {
        let {access_token, dataTableConfiguration} = this;
        let url = dataTableConfiguration.getStipendHeadersUrl;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        url = url+"&ahPathId="+ahPathId+"&academicYear="+academicYear;
        console.log("Stipend Header URL:");
        console.log(url);
        return util.getJson(url);
    }

    getNinthsHeaders = (ahPathId, academicYear) => {
        let {access_token, dataTableConfiguration} = this;
        let url = dataTableConfiguration.getNinthsHeadersUrl;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        url = url+"&ahPathId="+ahPathId+"&academicYear="+academicYear;
        console.log("Ninths Header URL:");
        console.log(url);
        return util.getJson(url);
    }

      /**
   *
   * @desc - edit url and parameters
   * @param {Object}  - addData
   * OPUSDEV-3487 Added access_token, and loggedInOpusId
   *
   **/
    async saveAddData(addData, originalACPropComp) {
        let {access_token, adminData, dataTableConfiguration} = this;
        let loggedInOpusId = adminData.adminOpusId;

        let dataToEdit = originalACPropComp;

      // Normal fields
        let fields = this.getAddNewEditFields();
        for(let each of fields){
            dataToEdit[each] = addData[each];
        }
      // Need to send dean submission date
      // dataToEdit.deanSubmissionDT = moment().toDate();

      // Non Other Component Related fields
        this.setNonOtherComponentFields(dataToEdit, addData);

        if(addData.stipendOther && addData.stipendOther.length>0){
            this.createOtherSourceObject(dataToEdit, addData, "stipendOther");
        }
        if(addData.ninthsOther && addData.ninthsOther.length>0){
            this.createOtherSourceObject(dataToEdit, addData, "ninthsOther");
        }

        console.log("Add data being sent to backend:");
        console.log(dataToEdit);

        let stringified = JSON.stringify(dataToEdit);
        let createUrl = dataTableConfiguration.createUrl;
        createUrl = this.addAccessTokenAndGrouperToUrl(createUrl, access_token,
        {addGrouper: false});
        createUrl = createUrl+"&loggedInOpusId="+loggedInOpusId;

        console.log("Add New URL:");
        console.log(createUrl);

        return util.jqueryPostJson(createUrl, stringified);
    }


    setNonOtherComponentFields = (dataToEdit, addData) => {
        for(let each of dataToEdit.components){
            if(each.proposedApproved==="Proposed"){
          // FTE Fields
                if(each.componentType==="FTE"){
                    if(each.sourceType==="EVCP" && addData.proposedFteEVCP!==null){
                        each.componentValue = addData.proposedFteEVCP;
                    }else if(each.sourceType==="Other" && addData.proposedFteOther!==null){
                        each.componentValue = addData.proposedFteOther;
                    }
          // Stipend Fields
                }else if(each.componentType==="Stipend"){
                    if(each.sourceType==="EVCP" && addData.proposedStipendEVCP!==null){
                        each.componentValue = addData.proposedStipendEVCP;
                    }else if(each.sourceType==="Dean" && addData.proposedStipendDean!==null){
                        each.componentValue = addData.proposedStipendDean;
                    }else if(each.sourceType==="Dept" && addData.proposedStipendDept!==null){
                        each.componentValue = addData.proposedStipendDept;
                    }
          // Ninths Number Fields
                }else if(each.componentType==="9ths Number"){
                    if(each.sourceType==="EVCP" && addData.proposedNinthsEVCP!==null){
                        each.componentValue = addData.proposedNinthsEVCP;
                    }else if(each.sourceType==="Dean" && addData.proposedNinthsDean!==null){
                        each.componentValue = addData.proposedNinthsDean;
                    }else if(each.sourceType==="Dept" && addData.proposedNinthsDept!==null){
                        each.componentValue = addData.proposedNinthsDept;
                    }
        // Ninths Amount Fields
                }else if(each.componentType==="9ths Amount"){
                    if(each.sourceType==="EVCP" && addData.proposedNinthsEVCPAmount!==null){
                        each.componentValue = addData.proposedNinthsEVCPAmount;
                    }else if(each.sourceType==="Dean" && addData.proposedNinthsDeanAmount!==null){
                        each.componentValue = addData.proposedNinthsDeanAmount;
                    }else if(each.sourceType==="Dept" && addData.proposedNinthsDeptAmount!==null){
                        each.componentValue = addData.proposedNinthsDeptAmount;
                    }
                }
            }
        }
        return dataToEdit;
    }

    createOtherSourceObject = (dataToEdit, addData, typeOfOther) => {

    // stipendOther componentTypeId is 1, ninthsOther componentTypeId is 2
        let componentTypeId = typeOfOther==="stipendOther" ? 1 : 2;

        for(let each of addData[typeOfOther]){

      // Find correct component value
            let componentValue = each.proposedValue;
            if(typeOfOther==="ninthsOther"){
                componentValue = each.proposedNinthsValue;
            }
            let otherSourceObject = {
                adminCompProposalId: addData.adminCompProposalId,
                componentType: typeOfOther==="stipendOther" ? "Stipend" : "9ths Number",
                componentTypeId: componentTypeId,
                componentValue: componentValue,
                otherDescription: each.name,
                proposedApproved: "Proposed",
                proposedApprovedId: 1,
                recStatus: "N",
                sourceType: "Other",
                sourceTypeId: 4,
                sourceTypeSequence: null
            };

            dataToEdit.components.push(otherSourceObject);
            // IOK-605 For Administrative 9ths, need to create a "9ths Amount" component along with the "9ths Number"
            if(typeOfOther!=="stipendOther"){
                let otherSourceObject2 = {
                    adminCompProposalId: addData.adminCompProposalId,
                    componentType: "9ths Amount",
                    componentTypeId: 3,
                    componentValue: each.proposedNinthsAmountValue,
                    otherDescription: each.name,
                    proposedApproved: "Proposed",
                    proposedApprovedId:  1,
                    recStatus: "N",
                    sourceType: "Other",
                    sourceTypeId: 4,
                    sourceTypeSequence: null
                };
                dataToEdit.components.push(otherSourceObject2);
            }
        }

        return dataToEdit;
    }


/******************************************************************************
 *
 * @desc - Delete Modal functions and components
 *
 ******************************************************************************/

  /**
   *
   * @desc - delete url and parameters
   * @param {Object}  - deleteData
   * OPUSDEV-3487 Added access_token, grouperPathText, and loggedInOpusId
   *
   **/
    async deleteData(deleteData) {
        let {grouperPathText, access_token, adminData} = this;
        let loggedInOpusId = adminData.adminOpusId;

        console.log("Delete data being sent to backend:");
        console.log(deleteData);

        let adminCompProposalId = JSON.stringify(deleteData.originalData.adminCompProposalId);
        console.log(adminCompProposalId);

        let stringified = JSON.stringify(deleteData.originalData);

        let deleteUrl = this.dataTableConfiguration.deleteUrl;
        deleteUrl = this.addAccessTokenAndGrouperToUrl(deleteUrl, access_token,
      {grouperPathText, addGrouper: true});
        deleteUrl = deleteUrl+"&loggedInOpusId="+loggedInOpusId+"&adminCompProposalId="+adminCompProposalId;

        console.log("Delete URL:");
        console.log(deleteUrl);

        return util.jqueryPostJson(deleteUrl, stringified);
    }

    /**
   *
   * @desc - Format incoming data to display correctly
   * @desc - ucPathPosition comes in separate  by # and @
   * @param {Object} match - match coming in
   * @return {Object} match - reformatted match
   *
   **/
    formatRowDataAfterDelete = (rowData) => {
        for(let each in rowData){
            let row = rowData[each];
            row.proposedFte = row.proposedFte ? this.formatFieldToColumns(row.proposedFte, false) : [];
            row.approvedFte = row.approvedFte ? this.formatFieldToColumns(row.approvedFte, false) : [];
            row.proposedStipends = row.proposedStipends ? this.formatFieldToColumns(row.proposedStipends, true) : [];
            row.approvedStipends = row.approvedStipends ? this.formatFieldToColumns(row.approvedStipends, true) : [];
            row.proposedAdministrativeNinths = row.proposedAdministrativeNinths ? this.formatFieldToColumns(row.proposedAdministrativeNinths, true) : [];
            row.approvedAdministrativeNinths = row.approvedAdministrativeNinths ? this.formatFieldToColumns(row.approvedAdministrativeNinths, true) : [];
      // Convert date fields
            row.deanSubmissionDT = row.deanSubmissionDT ? moment(row.deanSubmissionDT).format("L") : null;
            row.effectiveDT = row.effectiveDT ? moment(row.effectiveDT).format("L") : null;
            row.endDT = row.endDT ? moment(row.endDT).format("L") : null;
            row.eVCPApprovedDT = row.eVCPApprovedDT ? moment(row.eVCPApprovedDT).format("L") : null;
            row.uCOPApprovedDT = row.uCOPApprovedDT ? moment(row.uCOPApprovedDT).format("L") : null;
            row.completedDT = row.completedDT ? moment(row.completedDT).format("L") : null;

      // OPUSDEV-3535 Outcome fields in proposals table is coming in as null values.  Our blank filter looks for blank strings that look like ““.
      // Null values get turned into string values such as “null” which misses the blank filtering.
            row.outcome = row.outcome ? row.outcome : "";

      // add Proposal Summary Page Link
      // row.link = "/opusWeb/ui/admin/admin-comp-proposals-summary.shtml?adminCompId=" + row.adminCompProposalId.toString();
        }


        return rowData;
    }

  /**
   *
   * @desc - gets excel document from the server
   * @param {Object}  - options ->
   * @return {Promise} - promise for Export To Excel CSV
   *
   **/
    async exportCSV() {
        let csv_url = this.getExportToExcelUrl();
    // let urlParameters = this.getDataUrlParameters(this.dataTableConfiguration);

        let filterVariables = this.getFormattedExcelFilterVariables();
        filterVariables= this.correctMultilineCellVariables(filterVariables);
        let visibleColumns = filterVariables.visibleColumns;
    // Jira #3097 Remove any sort if it is not visible
        let sortColumnDirection = filterVariables.sortColumnDirection;
        for(let each in sortColumnDirection){
            if(!visibleColumns.includes(each)){
                delete sortColumnDirection[each];
            }
        }
        let stringifiedFilterVariables = JSON.stringify(filterVariables);

        util.print("Current filter variables being sent to excel ", filterVariables,
      "Sending request to ", csv_url);

        let promise = util.jqueryPostJson(csv_url, stringifiedFilterVariables);
    // console.log(csv_url)
        let csv = await promise;

        let csvData = new Blob([csv], {type: "attachment/csv;charset=utf-8;"});
        let {excelFileName} = this.dataTableConfiguration;
        excelFileName = excelFileName+".csv";
        let csvArgs = [csvData, excelFileName];
        let {msSaveBlob} = navigator;
        msSaveBlob = msSaveBlob ? msSaveBlob.bind(navigator) : null;
        let csvCreateFunc = msSaveBlob ? msSaveBlob : FileSaver.saveAs;
        return csvCreateFunc(...csvArgs);
    }

    correctMultilineCellVariables = (filterVariables) => {
        let visibleColumns = filterVariables.visibleColumns;
        for(let each in visibleColumns){
            if(visibleColumns[each]==="proposedFte"){
                visibleColumns.splice(each, 1 , ["proposedFteEvcp", "proposedFteOther"]);
            }else if(visibleColumns[each]==="approvedFte"){
                visibleColumns.splice(each, 1 , ["approvedFteEvcp", "approvedFteOther"]);
            }else if(visibleColumns[each]==="proposedStipends"){
                visibleColumns.splice(each, 1 , ["proposedStipendsEvcp", "proposedStipendsDean", "proposedStipendsDept", "proposedStipendsOther"]);
            }else if(visibleColumns[each]==="approvedStipends"){
                visibleColumns.splice(each, 1 , ["approvedStipendsEvcp", "approvedStipendsDean", "approvedStipendsDept", "approvedStipendsOther"]);
            }else if(visibleColumns[each]==="proposedAdministrativeNinths"){
                visibleColumns.splice(each, 1 , ["proposedAdministrativeNinthsEvcp", "proposedAdministrativeNinthsDean", "proposedAdministrativeNinthsDept", "proposedAdministrativeNinthsOther",
        "proposedAdministrativeNinthsAmtEvcp", "proposedAdministrativeNinthsAmtDean", "proposedAdministrativeNinthsAmtDept", "proposedAdministrativeNinthsAmtOther"]);
            }else if(visibleColumns[each]==="approvedAdministrativeNinths"){
                visibleColumns.splice(each, 1 , ["approvedAdministrativeNinthsEvcp", "approvedAdministrativeNinthsDean", "approvedAdministrativeNinthsDept", "approvedAdministrativeNinthsOther",
        "approvedAdministrativeNinthsAmtEvcp", "approvedAdministrativeNinthsAmtDean", "approvedAdministrativeNinthsAmtDept", "approvedAdministrativeNinthsAmtOther"]);
            }
        }
        let merged = [].concat.apply([], visibleColumns);
        filterVariables.visibleColumns = merged;
        return filterVariables;
    }

  // 4-30-2021
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
        let pageName = "AdminComp";
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
  // end of 4-30-2021 name search from profile


  /**
  *
  * @desc - Attaches the disabled and description text fields to rowData
  * @param {Object} rowData - rowData
  * @return {Array} - rowData with added fields
  *
  **/
    attachStatusToRowData(rowData) {
        for(let row of rowData) {
            let {resourceMap} = this.adminData;
            let {isOA, isAPO, isAPOAdmin} = this.Permissions;
            if((!resourceMap[editAdminCompProposalConstants.name] || (resourceMap[editAdminCompProposalConstants.name]
            && resourceMap[editAdminCompProposalConstants.name].action === editAdminCompProposalConstants.action
            && (row.status === "Submitted" || row.status === "Under Review" || row.status === "Completed")))
            && !isOA && !isAPO && !isAPOAdmin) {
                row.disabled = true;
                row.descriptionText = "You do not have access to delete this proposal.";
                row.buttonClass = "ghostButton";
            }
        }
        return rowData;
    }
}
