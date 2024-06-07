import AdminComp from './AdminComp';
import FileSaver from 'file-saver';
import DataTable from './DataTable';
import * as util from '../../common/helpers/';

/******************************************************************************
 * Cases
 *
 * @desc - Handles all the logic for the  Admin Comp Reports
 *
 ******************************************************************************/
export default class AdminCompReports extends AdminComp {
  startingDataTableConfiguration = null;

  /**
  *
  * @desc - Static variables
  *
  **/
  defaultConfigName = 'adminCompReports';

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
   * @desc - gets data from server and then parses it out from the unique key i.e.
   *  {activeCaseDataRows: Array[9000 results]} via dtConfig
   * @param {Object} dataTableConfiguration - d.t. config
   * @return {Array} - configured column information
   *
   **/
  async getRowDataFromServer({dataTableConfiguration = this.dataTableConfiguration} = {}) {
    // This is so that the Time Difference console log works for initial load
    this.consoleLogDifference('START');
    let results = await this.retrieveResultsFromServer({dataTableConfiguration});
    console.log(results)
    this.filterViews = results['opusDisplayPreferences'];
    let rowData = results[dataTableConfiguration.dataRowName];
    this.rowData = rowData;
    this.maxRowCount = this.rowData.length;
    return this.rowData;
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

    util.print('Current filter variables being sent to excel ', filterVariables,
      'Sending request to ', csv_url);

    let promise = util.jqueryPostJson(csv_url, stringifiedFilterVariables);
    // console.log(csv_url)
    let csv = await promise;

    let csvData = new Blob([csv], {type: 'attachment/csv;charset=utf-8;'});
    let {excelFileName} = this.dataTableConfiguration;
    excelFileName = excelFileName+".csv";
    let csvArgs = [csvData, excelFileName];
    let {msSaveBlob} = navigator;
    msSaveBlob = msSaveBlob ? msSaveBlob.bind(navigator) : null;
    let csvCreateFunc = msSaveBlob ? msSaveBlob : FileSaver.saveAs;
    return csvCreateFunc(...csvArgs);
  }

}
