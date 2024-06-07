import EndowedChairs from "./EndowedChairs";
import * as util from "../../../common/helpers";
import {endowedChairHoldersValidationFields, modalErrorMessage} from '../../../cases/constants/endowed-chairs/EndowedChairSummaryConstants';
import {urlConfig} from '../../../cases/constants/profile/ProfileConstants';

/******************************************************************************
 *
 * @desc - Endowed Chair Holders
 *
 ******************************************************************************/

export default class EndowedChairHolders extends EndowedChairs {
    startingDataTableConfiguration = null;

  /**
  *
  * @desc - Static variables
  *
  **/
    defaultConfigName = "endowedChairHolders";

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
        this.checkForEditPermissions(originalRowData);
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
        formattedRowData = this.updateRowDataForEndowedChairHolders(formattedRowData);
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
   * @desc - Gets url parameters for main data request
   * @return {Object} - params needed for rowData call
   *
   **/
      getDataUrlParameters(dataTableConfiguration = this.dataTableConfiguration) {
        let {pageName} = dataTableConfiguration;
        let {grouperPathText, access_token, adminData} = this;
        let {endowedChairId} = util.getUrlArgs();
        return {endowedChairId:endowedChairId, grouperPathText, access_token, loggedInOpusId: adminData.adminOpusId, opusScreenName: pageName};
    }


    async getRowDataFromServer({dataTableConfiguration = this.dataTableConfiguration} = {}) {
    // This is so that the Time Difference console log works for initial load
        this.consoleLogDifference("START");
        let results = await this.retrieveResultsFromServer({dataTableConfiguration});
        this.filterViews = results["opusDisplayPreferences"];
        let rowData = results[dataTableConfiguration.dataRowName];
        let endowedChair= results["endowedChair"];
        dataTableConfiguration.endowedChairId = endowedChair.endowedChairId;
        // Find dropdown options from API
        this.dataTableConfiguration = this.attachFilterLists(dataTableConfiguration, results);       
        this.rowData = rowData;
    // this.checkForEditPermissions(rowData);
        this.maxRowCount = this.rowData.length;
        return this.rowData;
    }

    attachFilterLists = (dataTableConfiguration, results) => {
        let chairApptStatusList = results["endowedChairAppointmentStatusList"];
        let seriesList = results["endowedChairAppointmentSeriesList"];
        let emplStatusList = results["employeeStatusList"];
        let valueOptions = [];
        // Chair Appt Status List
        valueOptions = chairApptStatusList;
        dataTableConfiguration.chairApptStatusOptions = valueOptions;
        valueOptions = [];
        // Series List
        valueOptions = seriesList;      
        dataTableConfiguration.seriesOptions = valueOptions;
        valueOptions = [];
        // Employee Status List
        valueOptions = emplStatusList;      
        dataTableConfiguration.emplStatusOptions = valueOptions;
        return dataTableConfiguration;
    }

    getEndowedChairHolderObject = () => {
        let url = this.dataTableConfiguration.newEndowedChairHolderUrl;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        return util.fetchJson(url);
    }
    getCommentsObject = () => {
        let url = this.dataTableConfiguration.newCommentsUrl;
        url = this.addAccessTokenAndGrouperToUrl(url, access_token, {addGrouper: false});
        return util.fetchJson(url);
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
   * @desc - takes the clone of the datatableConfig made at the beginning
   *  and sets it to the current dataTableConfiguration
   * @return {void} -
   *
   **/
     resetDataTableConfiguration = () => {
        let {cloneObject} = util;
        this.dataTableConfiguration = cloneObject(this.startingDataTableConfiguration);
        let filters = this.dataTableConfiguration.dataColumnFilters;
        filters.columnStringMatch = {};
        filters.outsideFilters = {};
        filters.columnSortOrder = {effectiveDate: "desc"};
        filters.columnValueOptions = {};
        return this.dataTableConfiguration;
    }

/******************************************************************************
 *
 * @desc - Modal functions and components
 *
 ******************************************************************************/
     getValidationFields = () => {
        return endowedChairHoldersValidationFields;
      }
 
      getModalErrorMessage = () => {
        return modalErrorMessage;
      }
  
      getErrorMessage = () => {
        return "This cannot be blank on save.";
      }    
 
  /****************************************************************************
   *
   * Section that gets and formats Names for NameSearch
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
        let pageName = "EndowedChair";
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
    //name search from profile
    async getOpusPersonInfo(opusPersonId) {
        let {access_token} = this;
        let url = urlConfig.getProfileSummaryDataByOpusIdUrl({opusPersonId, access_token});
        return util.fetchJson(url);
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

        let stringified = JSON.stringify(editData);
        let editUrl = this.dataTableConfiguration.saveEndowedChairHolderUrl;
        editUrl = this.addAccessTokenAndGrouperToUrl(editUrl, access_token,
      {grouperPathText, addGrouper: true});
        editUrl = editUrl+"&loggedInUserId="+loggedInOpusId;

        console.log("Edit URL:");
        console.log(editUrl);

        return util.jqueryPostJson(editUrl, stringified);
    }

/******************************************************************************
 *
 * @desc - Add Modal functions and components
 *
 ******************************************************************************/

   /**
   *
   * @desc - edit url and parameters
   * @param {Object}  - editData
   * OPUSDEV-3487 Added access_token, grouperPathText, and loggedInOpusId
   *
   **/
   async saveAddData(addData) {
    let {grouperPathText, access_token, adminData} = this;
    let loggedInOpusId = adminData.adminOpusId;

    console.log("New chair holder data being sent to backend:");
    console.log(addData);

    let stringified = JSON.stringify(addData);
    let addUrl = this.dataTableConfiguration.saveEndowedChairHolderUrl;
    addUrl = this.addAccessTokenAndGrouperToUrl(addUrl, access_token,
    {grouperPathText, addGrouper: true});
    addUrl = addUrl+"&loggedInUserId="+loggedInOpusId;

    console.log("Edit URL:");
    console.log(addUrl);

    return util.jqueryPostJson(addUrl, stringified);
}

   /**
   *
   * @desc - Save chair holder data
   * @param {Object}  - saveData
   * OPUSDEV-3487 Added access_token, grouperPathText, and loggedInOpusId
   *
   **/
   async saveComments(comments) {
    let {grouperPathText, access_token, adminData} = this;
    let loggedInOpusId = adminData.adminOpusId;

    console.log("New chair holder comments being sent to backend:");
    console.log(comments);

    let stringified = JSON.stringify(comments);
    let commentsUrl = this.dataTableConfiguration.saveCommentsUrl;
    commentsUrl = this.addAccessTokenAndGrouperToUrl(commentsUrl, access_token,
    {grouperPathText, addGrouper: true});
    commentsUrl = commentsUrl+"&loggedInUserId="+loggedInOpusId;

    console.log("Comments URL:");
    console.log(commentsUrl);

    return util.jqueryPostJson(commentsUrl, stringified);
}

/**
     *
     * @desc - Gets rank options
     * @param {Promise}  - promise
     *  OPUSDEV-3487 Added access_token, grouperPathText
     *
     **/
        async getRankOptions(value) {
        let {grouperPathText, access_token} = this;
        let {rankOptionsUrl} = this.dataTableConfiguration;        
        rankOptionsUrl = this.addAccessTokenAndGrouperToUrl(rankOptionsUrl, access_token,
        {grouperPathText, addGrouper: true});
        rankOptionsUrl = rankOptionsUrl+ "&seriesTypeId=" + value.toString();
        console.log("Rank Options URL : ",rankOptionsUrl);
        let resultsPromise = util.fetchJson(rankOptionsUrl);
        return resultsPromise;
    }

    /**
     *
     * @desc - Gets comments
     * @param {Promise}  - promise
     *  OPUSDEV-3487 Added access_token, grouperPathText
     *
     **/
    async getComments(endowedChairId, endowedChairHolderAppointmentId) {
        let {grouperPathText, access_token} = this;
        let {getCommentsUrl} = this.dataTableConfiguration;        
        getCommentsUrl = this.addAccessTokenAndGrouperToUrl(getCommentsUrl, access_token,
        {grouperPathText, addGrouper: false});
        getCommentsUrl = getCommentsUrl+ "&endowedChairId=" + endowedChairId + "&endowedChairHolderAppointmentId=" + endowedChairHolderAppointmentId;
        console.log("Get ECHA Comments URL : ",getCommentsUrl);
        let resultsPromise = util.fetchJson(getCommentsUrl);
        return resultsPromise;
    }

}
