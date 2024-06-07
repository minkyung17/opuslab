import DataTable from './DataTable';
import * as util from '../../common/helpers';
import {intersection} from 'lodash';
import {totals} from '../constants/SalaryCompensationConstants';
import {searchCriteria} from '../constants/SalaryCompensationConstants';

/******************************************************************************
 *
 * @desc - SalaryCompensation
 *
 ******************************************************************************/

export default class SalaryCompensation extends DataTable {

  /**
   *
   * @desc -
   * @param {Object}
   *
   **/
  constructor(args = {}) {
    super(args);
    this.startLogic(args);
    this.totals = totals;
  }


  /**
   *
   * @desc - Come here to do special stuff to Salary Report table data
   * @param {Array} rowData - array of row table data
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
  configureAPITableData(rowData = []) {
    let formattedRowData = super.configureAPITableData(rowData);
    formattedRowData = this.getFormattedData(formattedRowData);
    return formattedRowData;
  }

   /**
   *
   * @desc - Formats data and finds totals on load
   * @param {Array} rowData - array of row table data
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
  getFormattedData(rowData){
    let totals = this.totals;
    for(let each in rowData){
      for(let field of totals){
        let fieldName = field.name;
        let rowDataField;
        if(rowData[each][fieldName]){
          rowDataField = parseFloat(rowData[each][fieldName]);
        }

        if(rowDataField && rowDataField>=0){
          field.total += rowDataField;
          // Coming in as string so set integer version as field (for sort/totals):
          // rowData[each][fieldName] = util.reformatToMoneyDisplayValue(rowData[each][fieldName] =);
          rowData[each][fieldName] = rowDataField;
        }
      }
      // Convert off scale percent to an integer
      let offscalePct = parseInt(rowData[each].offscalePct);
      if(offscalePct>0){
        rowData[each].offscalePct = offscalePct;
      }
    }
    this.totals = totals;
    return rowData;
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
   * @desc - Filters data using saved filters in dataTableConfiguration
   * @param {Array} rowData - array of row data results from server
   * @param {Object} dataTableConfiguration -
   * @return {Array} formattedRowData
   *
   **/
  filterAPITableData(rowData = this.rowData, dataTableConfiguration =
    this.dataTableConfiguration) {
    let formattedRowData = super.filterAPITableData(rowData, dataTableConfiguration)

    formattedRowData = this.filterRowDataByFlags(formattedRowData);
    // Set current row data to find totals later on
    this.currentRowData = formattedRowData;
    return formattedRowData;
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
   * @desc - Finds Totals
   * @param {Array} rowData - array of row table data
   *
   **/
  findTotals(){
    let rowData = this.currentRowData;
    let totals = this.totals;
    // Reset totals here
    for(let each of totals){
      // Jira #3139 Reset to null value
      each.total = null;
    }
    // Find totals
    for(let each in rowData){
      for(let field of totals){
        let fieldName = field.name;
        let rowDataField;
        if(rowData[each][fieldName]){
          rowDataField = parseFloat(rowData[each][fieldName]);
        }
        if(rowDataField && rowDataField>=0){
          field.total += rowDataField;
        }
      }
    }
    this.totals = totals;
    return totals;
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
    let {categories, affirmativeSearch, exclusionarySearch}
      = searchCriteria;

    let filterKeys = Object.keys(outsideFilters);

    //Search keys for the 'Tenured', 'Senate', etc
    let affirmativeSearchKeys = intersection(filterKeys, affirmativeSearch);
    //Search keys for the 'Non-Tenured', 'Non-Senate', etc
    let exclusionarySearchKeys = intersection(filterKeys, exclusionarySearch);

    //Loop through each result of the rows in the table
    for(let each of rowData) {
      let isValid = true;//keep track of which results to save to array at the end

      //Loop through each of the simple true/false keys
      for(let key of affirmativeSearchKeys) {
        //If the key for each row results === 'N' dont end up pushing the result
        let key_name = categories[key].name;
        if(each.originalData[key_name] === 'N') {
          isValid = false;
        }
      }

      //Loop through each of the exclusionary keys
      for(let ex_key of exclusionarySearchKeys) {
        //If the key for each row results === 'Y' dont end up pushing the result
        let alternate_flagname = categories[ex_key].alternateFlag;
        let alt_keyname = categories[alternate_flagname].name;

        if(each.originalData[alt_keyname] === 'Y') {
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

}
