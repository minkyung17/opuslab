import DataTable from "./DataTable";
import * as util from "../../common/helpers/";

/******************************************************************************
 * Cases
 *
 * @desc - Handles all the logic for the Active and Completed cases section
 *
 ******************************************************************************/
export default class Eligibility extends DataTable {


    startingDataTableConfiguration = null;

  /**
   *
   * @desc - init class with datatable params
   * @param {Object} args - config for class
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
    getDataUrlParameters({fewRows = "N"} = {}) {
        let {grouperPathText, access_token} = this;
        return {grouperPathText, fewRows, access_token};
    }

  /**
   *
   * @desc - Filters data using saved filters in dataTableConfiguration and
   *  then filters by waiverFlag or mandatoryActionFlag if necessary
   * @param {Array} rowData - array of row data results from server
   * @param {Object} dataTableConfiguration -
   * @return {void}
   **/
    filterAPITableData(rowData = this.rowData, dataTableConfiguration =
    this.dataTableConfiguration) {
        let filteredRowData = super.filterAPITableData(rowData, dataTableConfiguration);
        filteredRowData = this.filterRowDataByFlags(filteredRowData);
    //8-9-2021 debug log
        return filteredRowData;
    }

  /**
   *
   * @desc - get filters for salary report
   * @param {Object} dataTableConfiguration - dataTableConfiguration
   *
   **/
    async getFilters(dataTableConfiguration = this.dataTableConfiguration) {
        let {pageName} = dataTableConfiguration;
        let {grouperPathText, access_token, adminData} = this;
        let urlParameters = {grouperPathText, pageName, access_token,
        loggedInOpusId: adminData.adminOpusId, opusScreenName: dataTableConfiguration.pageName};
        let url = dataTableConfiguration.filtersUrl;
        let resultsPromise = util.fetchJson(url, urlParameters);
        this.filterViews = await resultsPromise;
    }

  /**
   *
   * @desc - Change visibility of given column
   * @param {Object} - name, value - name & value of column to change
   * @param {Array} dataTableConfiguration - visibility key in column
   * @return {void}
   *
   **/
    updateOutsideFiltersInDatatableConfig({name, value}, dataTableConfiguration
    = this.dataTableConfiguration) {
        let {dataColumnFilters: {outsideFilters}, //invertBooleanFilters,
      wipeIfFilterEquals} = dataTableConfiguration;
        outsideFilters[name] = value;

    //Switch the value to filter for the opposite condition. Used for confusing
    //descriptions in the UI
    // if(name in invertBooleanFilters) {
    //   outsideFilters[name] = !value;
    // }

    //Delete the condition so it has no bearing on the filtering of the data
        if(name in wipeIfFilterEquals &&
        wipeIfFilterEquals[name] === outsideFilters[name]) {
            delete outsideFilters[name];
        }
        return dataTableConfiguration;
    }

  /**
   *
   * @desc - For Eligibility page if we want to filter by any
   *  simple booleans such as 'waivers' or 'mandatory actions'
   * @param {Object} rowData -
   * @param {Object} dataTableConfiguration -
   * @return {Object} filteredRowData
   *
   */
    filterRowDataByFlags(rowData = this.rowData, dataTableConfiguration =
    this.dataTableConfiguration) {
        let {dataColumnFilters: {outsideFilters}} = dataTableConfiguration;
        let filteredRowData = util.filterCollectionByObject(rowData, outsideFilters);
        return filteredRowData;
    }


  /**
   * reconcileColumnValuesFromServerData - Main function to be used that will
   *  reconcile how the object is stored or 'flattened' from the server so it
   *  can be shown best in the UI datatable
   *
   * @desc - Fill in the column defaults and select options
   * @param {Array} row -
   * @param {Array} - columnConfiguration, columnKeys
   * @return {Object} formattedRow
   *
   **/
    reconcileRowValuesFromServerData(row, {columnConfiguration = {}, columnKeys = []}) {
        let formattedRow = super.reconcileRowValuesFromServerData(row,
      {columnConfiguration, columnKeys});

        formattedRow = {
            ...row,
            ...formattedRow,
            waiverFlag: row.waiverFlag,
            mandatoryActionFlag: row.mandatoryActionFlag
        };

    //8-9-2021 debug log
        return formattedRow;
    }
}
