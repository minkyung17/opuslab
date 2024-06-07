import EndowedChairs from "./EndowedChairs";
import FileSaver from "file-saver";
import * as util from "../../../common/helpers";

/******************************************************************************
 *
 * @desc - Pending Endowed Chairs
 *
 ******************************************************************************/

export default class PendingEndowedChairs extends EndowedChairs {
    startingDataTableConfiguration = null;

  /**
  *
  * @desc - Static variables
  *
  **/
    defaultConfigName = "pendingEndowedChairs";

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
        //this.canViewAdminCompReportTab();
        //this.canViewAdminCompTabs();
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

        this.checkForDeletePermissions(originalRowData);
        return originalRowData;
    }
    /**
     *
     * @desc - Come here to do special stuff to Endowed Chairs table data
     * @param {Array} rowData - array of row table data
     * @return {Array} rowData - reformatted rowData
     *
     **/
    configureAPITableData(rowData = []) {
        let formattedRowData = super.configureAPITableData(rowData);
        formattedRowData = this.updateRowDataForEndowedChairs(formattedRowData);
        return formattedRowData;
    }
   /**
   *
   * @desc - get filters
   * @param {Object} dataTableConfiguration - dataTableConfiguration
   *
   **/
   async getFilters(dataTableConfiguration = this.dataTableConfiguration) {
    let urlParameters = this.getDataUrlParameters(dataTableConfiguration);;
    let url = dataTableConfiguration.filtersUrl;
    let resultsPromise = util.fetchJson(url, urlParameters);
    this.filterViews = await resultsPromise;
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
/**
*
* @desc - Gets url parameters for main data request
* @return {Object} - params needed for rowData call
*
**/
  getDataUrlParameters(dataTableConfiguration = this.dataTableConfiguration) {
    let {pageName} = dataTableConfiguration;
    let {grouperPathText, access_token, adminData} = this;
    return {endowedChairStatusId:2,grouperPathText, access_token, loggedInOpusId: adminData.adminOpusId, opusScreenName: pageName};
}

    async getRowDataFromServer({dataTableConfiguration = this.dataTableConfiguration} = {}) {
    // This is so that the Time Difference console log works for initial load
        this.consoleLogDifference("START");
        let results = await this.retrieveResultsFromServer({dataTableConfiguration});
        console.log(results);
        this.filterViews = results["opusDisplayPreferences"];
        let rowData = results[dataTableConfiguration.dataRowName];
        // Find dropdown options from API
        this.dataTableConfiguration = this.attachFilterLists(dataTableConfiguration, results);
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


}
