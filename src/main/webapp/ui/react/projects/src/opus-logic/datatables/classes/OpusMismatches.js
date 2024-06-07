import {intersection} from "lodash";

//My imports
import DataTable from "./DataTable";
import {searchCriteria} from "../constants/OpusMismatchesConstants";
import * as util from "../../common/helpers/";

export default class OpusMismatches extends DataTable {
  //Class variables
    rowData = [];

  /**
   * constructor()
   *
   * @desc -
   * @param {Object} args -
   * @return {void}
   *
   **/
    constructor(args = {}) {
        super(args);
        this.startLogic(args);
    }

  /**
   *
   * @desc - Gets url parameters for main data request
   * @param {String} fewRows - arg for API
   * @return {Object}
   *
   **/
    getDataUrlParameters(dataTableConfiguration = this.dataTableConfiguration) {
        let {pageName} = dataTableConfiguration;
        let {grouperPathText, access_token, adminData} = this;
        return {grouperPathText, access_token,
      loggedInOpusId: adminData.adminOpusId, opusScreenName: dataTableConfiguration.pageName};
    }

  // getFormattedRowDataFromServer = async () => {
  //     let originalRowData = await super.getFormattedRowDataFromServer();
  //     this.attachStatusToRowData(originalRowData);
  //     return originalRowData;
  // }

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
 * @desc - get filters for salary report
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
  * @desc - Filters data using saved filters in dataTableConfiguration
  * @param {Array} rowData - array of row data results from server
  * @param {Object} dataTableConfiguration -
  * @return {Array} filteredRowData -
  *
  **/
    filterAPITableData(rowData = this.rowData, dataTableConfiguration =
    this.dataTableConfiguration) {
        let filteredRowData = super.filterAPITableData(rowData, dataTableConfiguration);
        filteredRowData = this.filterRowDataByFlags(filteredRowData);
        return filteredRowData;
    }

  /**
   *
   * @desc - Come here to do special stuff to Roster table data
   * @param {Array} rowData - array of row table data
   * @return {Array} rowData - reformatted rowData
   *
   **/
    configureAPITableData(rowData = []) {
        let formattedRowData = super.configureAPITableData(rowData);
        formattedRowData = this.updateRowDataForMismatches(formattedRowData);
        return formattedRowData;
    }

  /**
 *
 * @desc - Update filters outside of the datatable such as Senate, isHSCP, etc.
 * If value is false, it is deleted from the outsideFilters and not taken
 * into consideration.
 * @param {Object} - name of column to change and value
 * @param {Object} dataTableConfiguration - is it visible or not
 * @return {void}
 *
 **/
    updateOutsideFiltersInDatatableConfig({name, value}, dataTableConfiguration
  = this.dataTableConfiguration) {
        let {dataColumnFilters: {outsideFilters}} = this.dataTableConfiguration;
        outsideFilters[name] = value;

        if(outsideFilters[name] === false) {
            delete outsideFilters[name];
        }

        return dataTableConfiguration;
    }

  /**
   *
   * @name filterRowDataByFlags
   * @desc -
   * @param {Object} rowData -
   * @param {Object} dataTableConfiguration -
   * @param {Array} filters -
   * @return {Array} filteredResults -
   *
   **/
    filterRowDataByFlags(rowData = [], dataTableConfiguration =
    this.dataTableConfiguration) {
        let {dataColumnFilters: {outsideFilters}} = dataTableConfiguration;
        let filteredResults = [];
        let {categories, affirmativeSearch} = searchCriteria;
        let filterKeys = Object.keys(outsideFilters);
    //Search keys for the 'mismatchUnit', 'mismatchAffiliation', etc
        let affirmativeSearchKeys = intersection(filterKeys, affirmativeSearch);
    //Loop through each result of the rows in the table
        for(let each of rowData) {
            let isValid = true;//keep track of which results to save to array at the end
      //Loop through each of the simple true/false keys
            for(let key of affirmativeSearchKeys) {
        //If the key for each row results != true dont end up pushing the result
                let key_name = categories[key].name;
                if(each.originalData[key_name] === "N") {
                    isValid = false;
                }
            }

      //If row result's keys all match lets push it to results
            if(isValid) {
                filteredResults.push(each);
            }
        }

        return filteredResults;
    }

  /**
   *
   * @desc -Combined 3 loop functions into 1:
   * 1. Set image for pending cases if it pendingCases = 1
   * 2. Adds profile link to rowData
   * 3. Changes 'null' emails to blank
   * @param {Array} formattedRowData - array of row table data
   * @param {Object} dataTableConfiguration - dtConfig for page
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
    updateRowDataForMismatches(formattedRowData, dataTableConfiguration =
    this.dataTableConfiguration, {link_key = "link"} = {}) {
        let {profileLink, columnConfiguration} = dataTableConfiguration;
        for(let row of formattedRowData) {
            if(row.originalData.caseExist === "Y") {
                row.imagePath = columnConfiguration.caseExist.image;
                row.caseExist = "a";
            }else{
                row.caseExist = "b";
            }
            row[link_key] = profileLink + row.originalData.opusId;
            let {originalData: {seriesMismatch, rankMismatch, stepMismatch, endDateMismatch}} = row;
            if(seriesMismatch === "Y") {
                row.primarySeriesHighlight = true;
                row.additionalSeriesHighlight = true;
            }
            if(rankMismatch === "Y") {
                row.primaryRankHighlight = true;
                row.additionalRankHighlight = true;
            }
            if(stepMismatch === "Y") {
                row.primaryStepHighlight = true;
                row.additionalStepHighlight = true;
            }
            if(endDateMismatch === "Y") {
                row.primaryEndDateHighlight = true;
                row.additionalEndDateHighlight = true;
            }
        }
        return formattedRowData;
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
        let {csvPageName} = this.getCsvUrlArgs();
        csv_url = `${csv_url}`;
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
        let {csvPageName} = dataTableConfiguration;
        return {csvPageName};
    }

  /**
   *
   * @desc - hide url and parameters
   * @param {Object}  - deleteData
   * OPUSDEV-3487 Added access_token, grouperPathText, and loggedInOpusId
   *
   **/
    async hideRow(rowData, hideFlag) {
        let {grouperPathText, access_token, adminData} = this;

        console.log("Hide Row data being sent to backend:");
        console.log(rowData);
        let stringified = JSON.stringify(rowData);
        let hideUrl = this.dataTableConfiguration.hideUrl;
        hideUrl = this.addAccessTokenAndGrouperToUrl(hideUrl, access_token, {grouperPathText, addGrouper: true});
        hideUrl = hideUrl+"&appointmentId="+rowData.primaryApptId+"&emplId="+rowData.emplId
                +"&additionalApptId="+rowData.additionalApptId+"&isHidden="+hideFlag+"&opusScreenName=OpusMismatch&grouperPathText="+grouperPathText;
        console.log(hideUrl);
        return util.jqueryPostJson(hideUrl, stringified);
    }

}
