 import {keyBy, keys, omit} from 'lodash';
import {intersection} from 'lodash';

import DataTable from './DataTable';
import CasesAdminPermissions from '../../common/modules/CasesAdminPermissions';
import {postJson, jsonToUrlArgs} from '../../common/helpers/';
import * as util from '../../common/helpers/';
import {proposedActionFlags} from '../constants/DatatableConstants'


/******************************************************************************
 * Cases
 *
 * @desc - Handles all the logic for the Active and Completed cases section
 *
 ******************************************************************************/
export default class Cases extends DataTable {
  startingDataTableConfiguration = null;
  CasesAdminPermissions = new CasesAdminPermissions(this.adminData);

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
   * @param {Object} dataTableConfiguration - config for class
   * @return {Object} - parameters needed for url call
   *
   **/
  getDataUrlParameters(dataTableConfiguration = this.dataTableConfiguration) {
    let {pageName} = dataTableConfiguration;
    let {grouperPathText, access_token, adminData} = this;

    return {grouperPathText, pageName, access_token,
      loggedInOpusId: adminData.adminOpusId, opusScreenName: dataTableConfiguration.pageName};
  }

  /**
   *
   * @desc - Come here to do special stuff to Roster table data
   * @param {Array} rowData - array of row table data
   * @return {Array} formattedRowData - reformatted rowData
   *
   **/
  configureAPITableData(rowData = []) {
    let formattedRowData = super.configureAPITableData(rowData);
    formattedRowData = this.addCasesLinkToRowData(formattedRowData);
    return formattedRowData;
  }

  /**
   *
   * @desc - Adds case summary link to rowData
   * @param {Array} rowData - array of row table data
   * @param {String} dataTableConfiguration -
   * @param {Array} - link_key, visibility key in column
   * @return {Array} rowData - reformed rowData
   *
   **/
  addCasesLinkToRowData(rowData, dataTableConfiguration = this.dataTableConfiguration,
    {link_key = 'link'} = {}) {
    let {caseSummaryLink} = dataTableConfiguration;

    for(let each of rowData) {
      let {originalData: {caseId, actionTypeId, actionCategoryId}} = each;
      each[link_key] = caseSummaryLink + jsonToUrlArgs({caseId, actionTypeId,
        actionCategoryId});
    }

    return rowData;
  }

  /**
   *
   * @desc - gets formatted csv url
   * @return {String} csv_url - formatted url for csv file
   *
   **/
  getExportToExcelUrl() {
    let csv_url = super.getExportToExcelUrl();
    let {csvPageName} = this.getCsvUrlArgs();
    csv_url = `${csv_url}&pageName=${csvPageName}`;
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
  * @desc - Formats the url that goes to Case Summary
  * @param {Object} - caseId, actionTypeId, actionCategoryId
  * @return {String} - finished url
  *
  **/
  getCaseCreatedUrl(caseId, actionType) {
    let [actionCategoryId, actionTypeId] = actionType.split('-');
    let args = util.jsonToUrlArgs({caseId, actionTypeId, actionCategoryId});
    return `/opusWeb/ui/admin/case-summary.shtml?${args}`;
  }

  /**
   *
   * @desc - Update filters outside of the datatable such as Retention, Retroactive, etc.
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
  * @return {Array} filteredRowData -
  *
  **/
  filterAPITableData(rowData = this.rowData, dataTableConfiguration =
    this.dataTableConfiguration) {
    let filteredRowData = super.filterAPITableData(rowData, dataTableConfiguration);
    filteredRowData = this.filterRowDataByFlags(filteredRowData);

    if(dataTableConfiguration.pageName==='Completed'
      && dataTableConfiguration.timePeriod!=='all'){
        filteredRowData = this.getFilteredTimePeriodRowData(dataTableConfiguration.timePeriod, filteredRowData);
      }
    // OPUSDEV-3684
    // super.createDynamicFilterOptions(filteredRowData, dataTableConfiguration);
    //SORT OPTIONS - If there are options to sort (Jira #2944)
    let {visibleColumnSortOrder} = this.getVisibleTableFilters(dataTableConfiguration);
    filteredRowData = this.sortRowDataByObject(filteredRowData,
      visibleColumnSortOrder);
    // console.log(filteredRowData);

    return filteredRowData;
  }

  /**
   *
   * @desc - Get sorting text order string
   * @param {Object} dataTableConfiguration - dataTableConfiguration
   * @return {String} sortingText
   *
   **/
  getSortOrderText(dataTableConfiguration = this.dataTableConfiguration) {
    let {dataColumnFilters: {columnSortOrder, outsideFilters}, columnConfiguration} =
      dataTableConfiguration;
    let sortingText = '';
    let columns = keys(columnSortOrder);
    let outsideFilterColumns = keys(outsideFilters);

    let showOnlyFilters = dataTableConfiguration.showOnlyFilters;

    if(columns.length) {
      sortingText = 'Sorting by ';
      columns.map((name, index) => {
        sortingText += `${(index + 1)}. ${columnConfiguration[name].displayName} `;
      });
    }

    let showOnlyFilterCount = 0;
    // Check if there is any filters inside the outside filters
    if(outsideFilterColumns.length>0){
      // Set initial text
      sortingText = sortingText+ '\xa0\xa0\xa0\xa0\xa0\xa0\xa0' + 'Show Only: ';
      // Loop through outside filters
      for(let outsideFilterIndex of outsideFilterColumns){
        if(showOnlyFilterCount===0){
          sortingText = sortingText+showOnlyFilters[outsideFilterIndex].displayName;
          showOnlyFilterCount++;
        }else{
          sortingText = sortingText+', '+showOnlyFilters[outsideFilterIndex].displayName;
        }
      }
    }

    return sortingText;
  }

  /**
   *
   * @name filterRowDataByFlags
   * @desc - copied over from roster's show only filters
   * @param {Object} rowData -
   * @param {Object} dataTableConfiguration -
   * @param {Array} filters -
   * @return {Array} filteredResults -
   *
   **/
  filterRowDataByFlags(rowData = [], dataTableConfiguration =
    this.dataTableConfiguration) {
    let {dataColumnFilters: {outsideFilters}, apptStatus} = dataTableConfiguration;
    let filteredResults = [];
    let filterKeys = Object.keys(outsideFilters);

    if(apptStatus!=='none'){
      //Loop through each result of the rows in the table
      for(let each of rowData) {
        let isValid = true;//keep track of which results to save to array at the end

        if(apptStatus==='active' && (each.appointmentStatus==='Archived' || each.appointmentStatus==='Removed')){
          isValid = false;
        }else if(apptStatus==='inactive' && each.appointmentStatus!=='Archived' && each.appointmentStatus!=='Removed'){
          isValid = false;
        }

        // Find the correct proposed action flag from the filters
        for(let key of filterKeys){
          if(key!=='5' && key!=='6'){
            // Show only for Cases as part of flat object data change 5/13/19 OPUS-3441
            let proposedActionFlagName = proposedActionFlags[key].name;
            let comparingProposedActionFlagName = each.originalData[proposedActionFlagName];

            if(outsideFilters[key] !== comparingProposedActionFlagName){
              isValid = false;
              break;
            }
          }

        }

        //If row result's keys all match lets push it to results
        if(isValid) {
          filteredResults.push(each);
        }
      }
    }

    return filteredResults;
  }

  /**
  *
  * @desc - Attaches the disabled and description text fields to rowData
  * @param {Object} rowData - rowData
  * @return {Array} - rowData with added fields
  *
  **/
  attachStatusToRowData(rowData) {
    for(let row of rowData) {
      if(row.originalData.actionStatusId === 4) {
        // If case is effective and migrated (effective date has already passed)
        row.disabled = true;
        row.descriptionText = 'This Case is already effective. You cannot reopen it.';
        row.buttonClass = 'ghostButton';
        // Different message for disapproved cases
        if(row.originalData.outcomeType==="Disapproved"){
          row.descriptionText = 'This Case has been disapproved.  You cannot reopen it.'
        }
      }else {
        // This is for completed cases
        // configure object to look like what getCaseButtonPermissions is expecting
        let actionDataInfo = {
          actionTypeInfo: {
            actionCategoryId: row.originalData.actionCategoryId,
            actionTypeId: row.originalData.actionTypeId
          },
          //This is needed for SA permissions to close a case based upon series/rank
          proposedAppointmentInfo: {
            titleInformation: {
              series: row.originalData.proposedSeries,
              rank: {
                rankTypeDisplayText:
                  row.originalData.proposedRank
              }
            }
          }
        };
        // Returns true or false value that determines if they can reopen a case
        let caseButtonPermissions = this.CasesAdminPermissions.getCaseButtonPermissions(actionDataInfo);
        // If you do not have permissions to reopen a case
        if(caseButtonPermissions) {
          row.disabled = true;
          row.descriptionText = 'You do not have access to reopen this case';
          row.buttonClass = 'ghostButton';
        }
      }
    }
    return rowData;
  }

}
