// import {keyBy, omit} from 'lodash';
import moment from 'moment';

import Cases from './Cases';
// import {postJson, jsonToUrlArgs} from '../../common/helpers/';
// import * as util from '../../common/helpers/';
import {apoQueueConfig, deansOfficeQueueConfig, deptQueueConfig, capQueueConfig, libraryQueueConfig} from '../constants/CasesAtMyOfficeConstants'
/******************************************************************************
 * Cases
 *
 * @desc - Handles all the logic for the Completed cases section
 *
 ******************************************************************************/
export default class CasesAtMyOffice extends Cases {
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
    this.consoleLogDifference('START');
    // Initially show blank rowData
    if(!this.selectedFromQueueDropdownAtLeastOnce){
      this.rowData = [];
      this.maxRowCount = 0;
    }else{
      let results = await this.retrieveResultsFromServer({dataTableConfiguration});
      // console.log(results);
      this.filterViews = results['opusDisplayPreferences'];
      let rowData = results[dataTableConfiguration.dataRowName];
      rowData = this.attachStatusToRowData(rowData);
      this.rowData = rowData;
      this.maxRowCount = this.rowData.length;
    }
    return this.rowData;
  }

  attachStatusToRowData(rowData){
    // let columns = this.dataTableConfiguration.columnConfiguration;
    for(let eachRow in rowData){
      let data = rowData[eachRow];
      // for(let eachColumn in columns){
      //   let text = columns[eachColumn].displayName;
      //   if(columns[eachColumn].opusKey>=0 && (data[text]===null || data[text]===undefined)){
      //     rowData[eachRow][eachColumn] = 'N/A';
      //   }else if(columns[eachColumn].opusKey>=0 && data[text]===32472172800000){
      //     rowData[eachRow][eachColumn] = null;
      //   }
      // }

      // Change null fields to blank strings for dynamic filter search to checkmark blank option
      data.caseLocation===null ? data.caseLocation = '' : null;
      data.currentWorkFlowStep===null ? data.currentWorkFlowStep = '' : null;
      data.status===null ? data.status = '' : null;
      data.apoAnalyst===null ? data.apoAnalyst = '' : null;
      // console.log(data)
    }
    return rowData;
  }

  // Set queue name for url parameters
  getDataUrlParameters(){
    let params = super.getDataUrlParameters();
    if(!this.selectedFromQueueDropdownAtLeastOnce){
      params.queueName = this.findDefaultQueue();
    }else{
      let dtConfig = this.dataTableConfiguration;
      params.queueName = dtConfig.queueName;
    }
    return params;
  }

  // Finds default queue based on admin data
  findDefaultQueue(){
    let permissions = this.CasesAdminPermissions;
    let queueName = '';
    if(permissions.isAPO || permissions.isOA || permissions.isVCAP){
      queueName = 'APO';
    }else if(permissions.isDA || permissions.isChair){
      queueName = 'Department';
    }else if(permissions.isCAP){
      queueName = 'CAP';
    }else if(permissions.isDean || permissions.isSA){
      queueName = "Dean's Office";
    }else if(permissions.isLibrarySA){
      queueName = 'Library';
    }
    this.defaultQueue = queueName;
    return queueName;
  }

  getAPOQueueConfig = () => {
    return apoQueueConfig;
  }

  getDeansOfficeQueueConfig = () => {
    return deansOfficeQueueConfig;
  }

  getDepartmentQueueConfig = () => {
    return deptQueueConfig;
  }

  getCAPQueueConfig = () => {
    return capQueueConfig;
  }

  getLibraryQueueConfig = () => {
    return libraryQueueConfig;
  }

  setQueueDataTableConfiguration(name){
    let dataTableConfiguration;
    let {adminData, globalData} = this;
    if(name==='APO'){
      dataTableConfiguration = apoQueueConfig;
    }else if(name==="Dean's Office"){
      dataTableConfiguration = deansOfficeQueueConfig;
    }else if(name==='Department'){
      dataTableConfiguration = deptQueueConfig;
    }else if(name==='CAP'){
      dataTableConfiguration = capQueueConfig;
    }else if(name==='Library'){
      dataTableConfiguration = libraryQueueConfig;
    }
    dataTableConfiguration = this.initiallyFormatDataTableConfiguration({dataTableConfiguration, adminData, globalData})
    this.setDataTableConfiguration(dataTableConfiguration);
    return dataTableConfiguration;
  }

  // Change datatable configuration and rowData based on queue selection
  async queueSelection(name){
    this.selectedFromQueueDropdownAtLeastOnce = true;
    let dataTableConfiguration = this.setQueueDataTableConfiguration(name);
    // console.log(dataTableConfiguration)
    let originalRowData = await this.getFormattedRowDataFromServer(this.args);

    let sortingTextOrder = this.getSortOrderText(dataTableConfiguration);
    let rowData = this.filterAPITableData(originalRowData);
    console.log('Results: '+rowData.length)
    return {dataTableConfiguration, rowData, maxRowCount: this.maxRowCount, sortingTextOrder, originalRowData};
  }

}
