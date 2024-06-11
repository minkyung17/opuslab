import AdminComp from "./AdminComp";
import FileSaver from "file-saver";
import {postJson, jsonToUrlArgs} from "../../common/helpers/index";
import * as util from "../../common/helpers";
import {config, allocationsConfig, proposalsConfig} from "../constants/AdminCompAllocationsConstants";
import moment from "moment";
/******************************************************************************
 *
 * @desc - Administrative Compensation
 *
 ******************************************************************************/

export default class AdminCompAllocations extends AdminComp {
    startingDataTableConfiguration = null;

  /**
  *
  * @desc - Static variables
  *
  **/
    defaultConfigName = "adminCompAllocations";

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
        this.canViewAdminCompReportTab();
        this.canViewAdminCompTabs();
    }

  /**
   *
   * @desc - Everyone except DA, CAP and Chair cannot see report tabs
   **/
    canViewAdminCompReportTab() {
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
    canViewAdminCompTabs() {
        let {isAPO, isOA, isAPOAdmin} = this.Permissions;
        if(!isAPO && !isOA && !isAPOAdmin) {
            document.getElementById("reportTab").style.display = "block";
        }
    }


    /**
   *
   * @desc - gets data from server and then parses it out from the unique key i.e.
   *  {activeCaseDataRows: Array[9000 results]} via dtConfig
   * @param {Object} dataTableConfiguration - d.t. config
   * @return {Array} - configured column information
   *
   **/

    getFormattedRowDataFromServer = async () => {
        let originalRowData = await super.getFormattedRowDataFromServer();
        console.log(originalRowData);

        this.checkForDeletePermissions(originalRowData);
        return originalRowData;
    }

    async getRowDataFromServer({dataTableConfiguration = this.dataTableConfiguration} = {}) {
    // This is so that the Time Difference console log works for initial load
        this.consoleLogDifference("START");
        let results = await this.retrieveResultsFromServer({dataTableConfiguration});
        console.log(results);
        this.filterViews = results["opusDisplayPreferences"];
        let rowData = results[dataTableConfiguration.dataRowName];
        this.rowData = rowData;
    // this.checkForEditPermissions(rowData);
        this.maxRowCount = this.rowData.length;
        return this.rowData;
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
   * @return {Promise} - promise for Export To Excel CSV
   *
   **/
    async exportCSV() {
        let csv_url = this.getExportToExcelUrl();
    // let urlParameters = this.getDataUrlParameters(this.dataTableConfiguration);

        let filterVariables = this.getFormattedExcelFilterVariables();

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

}