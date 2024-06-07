import {intersection} from "lodash";

//My imports
import DataTable from "./DataTable";
import {searchCriteria} from "../constants/PathOnlyConstants";
import * as util from "../../common/helpers/";

export default class PathOnly extends DataTable {
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
            row[link_key] = profileLink + row.originalData.opusId;
        }
        return formattedRowData;
    }

}
