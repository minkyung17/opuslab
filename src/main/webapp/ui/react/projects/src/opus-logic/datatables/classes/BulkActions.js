import DataTable from './DataTable';
import {text} from '../constants/BulkActionsConstants';
import * as ActionCategoryType from '../../cases/constants/ActionCategoryType';
import * as util from '../../common/helpers/';
import FileSaver from 'file-saver';

/******************************************************************************
 *
 * @desc - Bulk Actions
 *
 ******************************************************************************/

export default class BulkActions extends DataTable {

  /**
  *
  * @desc - Static variables
  *
  **/
  static code_text = text.code_text;
  static action_type_display_key = text.action_type_display_key;

  defaultConfigName = 'bulkActions';
  actionType = null;

  /**
   *
   * @desc -
   * @param {Object}
   *
   **/
  constructor({selectedActionType, ...args}) {
    super(args);
    this.setClassData({actionType: selectedActionType});
    this.startLogic(args);
    this.setLogicClassVariables(args);
  }

  /**
   *
   * @desc - Gets url parameters for main data request
   * @return {Object} - params needed for rowData call
   *
   **/
  getDataUrlParameters() {
    let {access_token, actionType, grouperPathText} = this;
    return {access_token, actionType, grouperPathText};
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
    let resultsPromise = this.retrieveResultsFromServer({dataTableConfiguration});
    let results = await resultsPromise;
    this.rowData = results;
    this.maxRowCount = this.rowData.length;
    return this.rowData;
  }

  /**
   *
   * @desc - Overriding the super class' function so that we can use grouperPathTexts
   * instead of formattedGrouperPathTexts in this special case.  Normally for datatables
   * we would use formattedGrouperPathTexts, but the backend is using a stored proc
   * instead of a native query this time.
   * @param {Object} - dataTableConfiguration
   * @return {void}
   *
   **/
  setLogicClassVariables({dataTableConfiguration = this.dataTableConfiguration,
    adminData = this.adminData, access_token = this.access_token} = {}) {
    //Get the Select Options
    let {grouperPathText: permissions_text, permissionNames, url}
      = dataTableConfiguration;
    let rawPermissions = adminData.resourceMap[permissions_text] || {};
    let columnFilters = rawPermissions.filterMap || [];
    let {grouperPathTexts: grouperPathText} = rawPermissions;

    //Permissions from adminData(i.e. backend API)
    let {permissions: apiPermissions, resourceMap} = adminData;
    this.setPermissions(permissionNames, resourceMap);
    this.setClassData({rawPermissions, grouperPathText, columnFilters});
  }

  /**
   *
   * @desc  - Format dataTableConfiguration before its cloned, set in Logic,
   *  or otherwise configured
   * @param {Object} - dataTableConfiguration, globalData, adminData
   * @return {Object} dataTableConfiguration
   *
   **/
  initiallyFormatDataTableConfiguration({dataTableConfiguration, globalData,
    adminData}) {

    super.initiallyFormatDataTableConfiguration({dataTableConfiguration, globalData,
      adminData});

    this.configureBulkActionColumnsViaDataTableConfiguration(dataTableConfiguration);

    return dataTableConfiguration;
  }

  /**
   *
   * @description - Determine table columns based upon bulk action type selected
   * @param {Object} dataTableConfiguration -
   * @return {void}
   *
   **/
  configureBulkActionColumnsViaDataTableConfiguration(dataTableConfiguration) {
    let {apuColumnKeys} = dataTableConfiguration;
    let {actionType} = this;

    if (actionType === ActionCategoryType.CHANGE_APU) {
      dataTableConfiguration.columnKeys = apuColumnKeys;
    }

    return dataTableConfiguration;
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
      // console.log(row);
    // let apuDisplayValues = this.determineAPUDisplayValues(row);

    // formattedRow = {
    //   ...row,
    //   ...formattedRow,
    //   apuCodeDescYear: apuDisplayValues
    // };

    return formattedRow;
  }

  /**
   *
   * @desc - Determine the APU values.  If all of the values are empty, return a blank
   * @param {Array} row -
   * @return {String} apuDisplayValues
   *
   **/
  /*determineAPUDisplayValues(row) {
    // let {appointmentInfo: {salaryInfo: {academicProgramUnit}}} = row;
    let {apuCode, apuDesc, budgetYear} = row;
    let invalidValues = {'': true, undefined: true, null: true};

    let apuDisplayValues = apuCode + ': ' + apuDesc + ' - ' + budgetYear;
    if (apuCode in invalidValues && apuDesc in invalidValues && budgetYear in invalidValues) {
      apuDisplayValues = '';
    }

    return apuDisplayValues;
  }*/

  /**
   *
   * @desc - adds parameters to csv url
   * @param {String}  - csv_url -> url for pdf/excel
   * @param {Array}  - array -> array that will turn into a string
   * @return {String} - formatted CSV url
   *
   **/
  stringifyArray(array) {
    let string;
    for(let index in array){
      if(index==="0"){
        string = array[index]
      }else{
        string = string+","+array[index]
      }
    }
    return string;
  }

  /**
   *
   * @desc - gets excel document from the server
   * @param {Object}  - options ->
   * @return {String} - formatted CSV url
   *
   **/
  getExportToExcelUrl() {
    let {grouperPathText, access_token, dataTableConfiguration} = this;
    let {exportToExcelBaseUrl: url} = dataTableConfiguration;
    let csv_url = this.addAccessTokenAndGrouperToUrl(url, access_token,
      {grouperPathText, addGrouper: true});
    return csv_url;
  }

  /**
   *
   * @desc - gets excel document from the server
   * @param {Object}  - options ->
   * @return {Promise} - promise for Export To Excel CSV
   *
   **/
  async exportCSV(selectedRows) {
    let csv_url = this.getExportToExcelUrl();
    let dt = this.dataTableConfiguration;
    let {adminData} = this;
    let rowString = this.stringifyArray(selectedRows);
    csv_url = csv_url+"&selectedRows="+rowString+"&actionType="+this.actionType;

    let filterVariables = this.getFormattedExcelFilterVariables();
    let stringifiedFilterVariables = JSON.stringify(filterVariables);

    util.print('Current filter variables being sent to '+filterVariables,
      'Sending request to ', csv_url);

    let promise = util.jqueryPostJson(csv_url, stringifiedFilterVariables);
    let response = await promise;

    let csvCreateFunc, csvArgs;
    let csvData = new Blob([response], {type: 'attachment/csv;charset=utf-8;'});
    let {excelFileName = 'BulkActions.csv'} = this.dataTableConfiguration;
    csvArgs = [csvData, excelFileName];
    let {msSaveBlob} = navigator;
    msSaveBlob = msSaveBlob ? msSaveBlob.bind(navigator) : null;
    csvCreateFunc = msSaveBlob ? msSaveBlob : FileSaver.saveAs;

    return csvCreateFunc(...csvArgs);
  }
}
