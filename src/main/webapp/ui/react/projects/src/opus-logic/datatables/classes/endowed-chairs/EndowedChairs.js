import DataTable from "../DataTable";
import FileSaver from "file-saver";
import * as util from "../../../common/helpers";
import Permissions from "../../../common/modules/Permissions";
import moment from "moment";
import {editEndowedChairConstants} from '../../../cases/constants/endowed-chairs/EndowedChairSummaryConstants';

/******************************************************************************
 *
 * @desc - Endowed Chairs
 *
 ******************************************************************************/

export default class EndowedChairs extends DataTable {
    startingDataTableConfiguration = null;

  /**
  *
  * @desc - Static variables
  *
  **/
    defaultConfigName = "endowedChairs";

  /**
   *
   * @desc -
   * @param {Object}
   *
   **/
    constructor(args = {}) {
        super(args);
        this.startLogic(args);
        this.Permissions = new Permissions(adminData);
        this.args = args;
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
        this.filterViews = results["opusDisplayPreferences"];
        let rowData = results[dataTableConfiguration.dataRowName];
        this.rowData = rowData;
        this.maxRowCount = this.rowData.length;
        return this.rowData;
    }

    /**
     *
     * @desc - Check if user can edit EC
     * @param {Object} adminData - has edit resource
     * @return {Object} - can edit ec
     *
     **/
    checkForEditPermissions(rowData) {
        let {resourceMap} = this.adminData;
        let accessGranted = false;
        if(resourceMap[editEndowedChairConstants.name]
            && resourceMap[editEndowedChairConstants.name].action === editEndowedChairConstants.action) {
            accessGranted = true;
        }
        for(let row of rowData) {
            if(!accessGranted) {
                row.disabled = true;
            }
        }
        return rowData;
    }
   /**
   *
   * @desc - shows the active case image and endowed chair link
   * @param {Array} formattedRowData - array of row table data
   * @param {Object} dataTableConfiguration - dtConfig for page
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
   updateRowDataForEndowedChairs(formattedRowData, dataTableConfiguration =
    this.dataTableConfiguration, {link_key = "link"} = {}) {
        let {chairLink, columnConfiguration} = dataTableConfiguration;
        for(let row in formattedRowData) {
            let rowData = formattedRowData[row];
            rowData.dateEstablished = rowData.dateEstablished ? moment(rowData.dateEstablished).format("L") : "";
            rowData.dateDisestablished = rowData.dateDisestablished ? moment(rowData.dateDisestablished).format("L") : "";
            rowData.effectiveDate = rowData.effectiveDate ? moment(rowData.effectiveDate).format("L") : "";
            rowData.endDate = rowData.endDate ? moment(rowData.endDate).format("L") : "";
            // IOK-1173 lastOccupiedDate field can be sent from backend as "Unknown"
            this.checkForUnknown(rowData, "lastOccupiedDate");

            rowData.commentsCounter = rowData.originalData.commentsCounter;
            if(rowData.activeCase === "Y") {
                rowData.imagePath = columnConfiguration.activeCase.image;
            }
            rowData[link_key] = chairLink + rowData.endowedChairId;
        }
        return formattedRowData;
    }

          /**
   *
   * @desc - IOK-1173 lastOccupiedDate field can be sent from backend as "Unknown"
   * @param {Object} rowData - single row data
   * @param {String} fieldName - string to determine which field name to chnage
   * @return {Object} rowData - reformatted rowData
   *
   **/
    checkForUnknown = (rowData, fieldName) => {
        if(rowData[fieldName] && rowData[fieldName]!=="Unknown"){
            rowData[fieldName] = moment(rowData[fieldName]).format("L");
        }else if(!rowData[fieldName]){
            rowData[fieldName] = "";
        }
        return rowData;
    }

       /**
   *
   * @desc - shows the active case image and endowed chair link
   * @param {Array} formattedRowData - array of row table data
   * @param {Object} dataTableConfiguration - dtConfig for page
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
   updateRowDataForEndowedChairHolders(formattedRowData, dataTableConfiguration =
    this.dataTableConfiguration) {
        let {columnConfiguration} = dataTableConfiguration;
        for(let row of formattedRowData) {
            row.effectiveDate = row.effectiveDate ? moment(row.effectiveDate).format("L") : "";
            row.endDate = row.endDate ? moment(row.endDate).format("L") : "";
            if(row.activeCase === "Y") {
                row.imagePath = columnConfiguration.activeCase.image;
            }
            row.endowedChairAppointmentStatusId = row.originalData.endowedChairAppointmentStatusId;
            row.seriesTypeId = row.originalData.seriesTypeId;
            row.rankTypeId = row.originalData.rankTypeId;
            row.commentsCounter = row.originalData.commentsCounter;
        }
        return formattedRowData;
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

/******************************************************************************
 *
 * @desc - Add Modal functions and components
 *
 ******************************************************************************/

   /**
   *
   * @desc - Search unit
   * @param {Promise}  - promise
   *  OPUSDEV-3487 Added access_token, grouperPathText
   *
   **/
    async onSearchUnit(value) {
        let {grouperPathText, access_token} = this;

        let {unitSearchUrl} = this.dataTableConfiguration;
        unitSearchUrl = unitSearchUrl+value.toString();
        unitSearchUrl = this.addAccessTokenAndGrouperToUrl(unitSearchUrl, access_token,
      {grouperPathText, addGrouper: true});

        let resultsPromise = util.fetchJson(unitSearchUrl);
        return resultsPromise;
    }

    setAddData = (addData, adminCompInfo) => {
        let ahPathId = this.findAHPathId(addData.unitName);
        let unitName = addData.unitName.split(":");
        for(let each in adminCompInfo){
            if(each!=="adminCompID" && each!=="academicHierarchyPathId" && each!=="titleDescription"){
                let dataToSet = null;
                if(addData[each]){
                    dataToSet = addData[each];
                }
                if(each==="academicYear"){
                    dataToSet = addData.year;
                }else if(each==="titleCodeId"){
                    dataToSet = addData.title;
                }else if(each==="school"){
                    dataToSet = unitName[0];
                }else if(each==="division"){
                    dataToSet = unitName[1];
                }else if(each==="department"){
                    dataToSet = unitName[2];
                }
                adminCompInfo[each] = dataToSet;
            }else if(each==="academicHierarchyPathId"){
                adminCompInfo[each] = ahPathId;
            }
        }
        return adminCompInfo;
    }

    attachFilterLists = (dataTableConfiguration, results) => {
        let endowedChairTypeFilterList = results["endowedChairTypeFilterList"];
        let endowedChairStatusFilterList = results["endowedChairStatusFilterList"];
        let endowedChairTermRenewableFilterList = results["endowedChairTermRenewableFilterList"];
        let endowedChairFundingTypeFilterList = results["endowedChairFundingTypeFilterList"];
        let valueOptions = [];
    // Chair Type List
        for(let each in endowedChairTypeFilterList){
            if(endowedChairTypeFilterList[each] !== 'Other') {
                valueOptions.push(endowedChairTypeFilterList[each]);
            }
        }
        let formattedValueOptions = valueOptions.sort();
        formattedValueOptions.push('Other');
        dataTableConfiguration.columnConfiguration.endowedChairType.valueOptions = formattedValueOptions;
        valueOptions = [];
    // Chair Status List
        for(let each in endowedChairStatusFilterList){
            valueOptions.push(endowedChairStatusFilterList[each]);
        }
        dataTableConfiguration.endowedChairStatusOptions = valueOptions;
        valueOptions = [];
    // Term Renewable List
        for(let each in endowedChairTermRenewableFilterList){
               valueOptions.push(endowedChairTermRenewableFilterList[each]);
        }
        dataTableConfiguration.columnConfiguration.endowedChairTermRenewable.valueOptions = valueOptions;
        valueOptions = [];
    // Funding Type List
        for(let each in endowedChairFundingTypeFilterList){
            valueOptions.push(endowedChairFundingTypeFilterList[each]);
        }
        dataTableConfiguration.columnConfiguration.endowedChairFundingType.valueOptions = valueOptions;

        // Need to attach original filters for add modal later
        dataTableConfiguration.modalDropdownOptions = {
            endowedChairTypeFilterList,
            endowedChairStatusFilterList,
            endowedChairTermRenewableFilterList,
            endowedChairFundingTypeFilterList
        }
        return dataTableConfiguration;
    }
  /**
   *
   * @desc - find Ah Path Id
   * @param {String}  - ahPathId
   *
   **/
    findAHPathId(unitName){
        let {unitOptions} = this;
        let ahPathId;
        for(let each in unitOptions){
            if(unitOptions[each]===unitName){
                ahPathId = each;
                break;
            }
        }
        return ahPathId;
    }

  /**
   *
   * @desc - add url and parameters
   * @param {Object}  - addData
   * OPUSDEV-3487 Added access_token, grouperPathText, and loggedInOpusId
   *
   **/
    async saveAddData(adminCompInfo) {
        let {grouperPathText, access_token, adminData} = this;
        let loggedInOpusId = adminData.adminOpusId;
        console.log("Create data being sent to backend:");
        console.log(adminCompInfo);

        let stringified = JSON.stringify(adminCompInfo);
        let addUrl = this.dataTableConfiguration.createUrl;;
        addUrl = this.addAccessTokenAndGrouperToUrl(addUrl, access_token,
      {grouperPathText, addGrouper: true});
        addUrl = addUrl+"&loggedInOpusId="+loggedInOpusId;

        console.log("Create URL:");
        console.log(addUrl);

        return util.jqueryPostJson(addUrl, stringified);
    }

/******************************************************************************
 *
 * @desc - Edit Modal functions and components
 *
 ******************************************************************************/

   /**
   *
   * @desc - edit url and parameters
   * @param {Object}  - editData
   * OPUSDEV-3487 Added access_token, grouperPathText, and loggedInOpusId
   *
   **/
    async saveEditData(editData) {
        let {grouperPathText, access_token, adminData} = this;
        let loggedInOpusId = adminData.adminOpusId;

        console.log("Edit data being sent to backend:");
        console.log(editData);

        let stringified = JSON.stringify(editData.originalData);
        let editUrl = this.dataTableConfiguration.editUrl;
        editUrl = this.addAccessTokenAndGrouperToUrl(editUrl, access_token,
      {grouperPathText, addGrouper: true});
        editUrl = editUrl+"&loggedInOpusId="+loggedInOpusId;

        console.log("Edit URL:");
        console.log(editUrl);

        return util.jqueryPostJson(editUrl, stringified);
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

        let stringified = JSON.stringify(deleteData.originalData);
        let deleteUrl = this.dataTableConfiguration.deleteUrl;
        deleteUrl = this.addAccessTokenAndGrouperToUrl(deleteUrl, access_token,
      {grouperPathText, addGrouper: true});
        deleteUrl = deleteUrl+"&loggedInOpusId="+loggedInOpusId;

        console.log("Delete URL:");
        console.log(deleteUrl);

        return util.jqueryPostJson(deleteUrl, stringified);
    }

    /**
   *
   * @desc - gets excel document from the server
   * @param {Object}  - options ->
   * @return {String} - formatted CSV url
   * OPUSDEV-3487 Added access_token, grouperPathText
   *
   **/
    getExportToExcelUrl() {
        let csv_url = super.getExportToExcelUrl();
        let {csvPageName, endowedChairStatusId} = this.getCsvUrlArgs();
        let {endowedChairId} = util.getUrlArgs();
        if(endowedChairId != null) {
            csv_url = `${csv_url}&opusScreenName=${csvPageName}&endowedChairId=${endowedChairId}`;
        } else {
            csv_url = `${csv_url}&opusScreenName=${csvPageName}&endowedChairStatusId=${endowedChairStatusId}`;
        }
        return csv_url;
    }


    /**
     *
     * @desc - get export to excel args specific to Cases
     * @param {Object} dataTableConfiguration - Classes datatableConfig
     * @return {Object} - csvPageName
     *
     **/
    getCsvUrlArgs(dataTableConfiguration = this.dataTableConfiguration) {
        let {csvPageName, endowedChairStatusId} = dataTableConfiguration;
        return {csvPageName, endowedChairStatusId};
    }

  /**
  *
  * @desc - Attaches the disabled and description text fields to rowData
  * @param {Object} rowData - rowData
  * @return {Array} - rowData with added fields
  *
  **/
    checkForDeletePermissions(rowData) {
        let {editAllocationsPermissions: {name, action} = {}} = this.dataTableConfiguration;
        let {resourceMap} = this.adminData;
        let {isDA, isSA, isLibrarySA, isAA, isChair, isDean, isDivisionAdmin, isVCAP} = this.Permissions;
        for(let row of rowData) {
            if(isDA || isSA || isLibrarySA || isDivisionAdmin || isAA || isChair || isDean || isVCAP) {
                row.disabled = true;
                row.descriptionText = "You do not have access to delete this allocation.";
                row.buttonClass = "ghostButton";
            }
        }
        return rowData;
    }

    getEndowedChairObject = () => {
        let {access_token} = this;
        let url = this.dataTableConfiguration.newEndowedChairObjectUrl;
        let endowedChairStatusId = this.dataTableConfiguration.endowedChairStatusId;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        url = `${url}&endowedChairStatusId=${endowedChairStatusId}`;
        let resultsPromise = util.fetchJson(url);
        return resultsPromise;
    }

    getModalErrorMessage = () => {
        return "Sorry, there was a problem. Please check the form for errors.";
    }

    getValidationFields = () => {
        return ["endowedChairName", "completeUnitName", "organizationName", "endowedChairStatus", "endowedChairType"];
    }

    getErrorMessage = () => {
        return "This cannot be blank on save.";
      }

        // Save Functions
    /**
   *
   * @desc - add url and parameters
   * @param {Object}  - addData
   * OPUSDEV-3487 Added access_token, grouperPathText, and loggedInOpusId
   *
   **/
    async saveEndowedChairData(adminCompInfo) {
        let {grouperPathText, access_token, adminData} = this;
        let loggedInOpusId = adminData.adminOpusId;
        console.log("save endowed chair data being sent to backend:");
        console.log(adminCompInfo);

        let stringified = JSON.stringify(adminCompInfo);
        let saveUrl = this.dataTableConfiguration.saveNewEndowedChairUrl;
        saveUrl = this.addAccessTokenAndGrouperToUrl(saveUrl, access_token,
          {grouperPathText, addGrouper: false});
        saveUrl = saveUrl+"&loggedInUserId="+loggedInOpusId
        // IOK-49 Added logged in user first name and last name to populate email content
        +"&loggedFirstName="+adminData.adminFirstName+"&loggedLastName="+adminData.adminLastName;
        console.log("Save Endowed Chair URL:");
        console.log(saveUrl);

        return util.jqueryPostJson(saveUrl, stringified);
    }
    /**
     *
     * @desc - Gets comments
     * @param {Promise}  - promise
     *  OPUSDEV-3487 Added access_token, grouperPathText
     *
     **/
    async getComments(endowedChairId) {
        let {grouperPathText, access_token} = this;
        let {getCommentsUrl} = this.dataTableConfiguration;
        getCommentsUrl = this.addAccessTokenAndGrouperToUrl(getCommentsUrl, access_token,
        {grouperPathText, addGrouper: false});
        getCommentsUrl = getCommentsUrl+ "&endowedChairId=" + endowedChairId;
        console.log("Get EC Comments URL : ",getCommentsUrl);
        let resultsPromise = util.fetchJson(getCommentsUrl);
        return resultsPromise;
    }
}
