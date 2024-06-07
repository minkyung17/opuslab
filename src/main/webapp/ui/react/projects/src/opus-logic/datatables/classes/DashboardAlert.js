import DataTable from './DataTable';
import * as util from '../../common/helpers/';
import {dashboardAlertConfig} from '../constants/DashboardAlertConstants';

/******************************************************************************
 *
 * @desc - DashboardAlert Records
 *
 ******************************************************************************/

export default class DashboardAlert extends DataTable {

  /**
  *
  * @desc - Static variables
  *
  **/
  defaultConfigName = 'dashboardAlert';

  /**
   *
   * @desc -
   * @param {Object} args -
   *
   **/
  constructor(args = {}) {
    super(args);
    this.startLogic(args);
  }

  /**
   *
   * @desc - Gets url parameters for main data request
   * @return {Object} - params needed for rowData call
   *
   **/
  getDataUrlParameters() {
    let {access_token, grouperPathText} = this;
    return {access_token, grouperPathText};
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
    for (let each of results) {
      if (each.dashboard === 'DASA') {
        each.dashboard = 'DA / SA';
      } else if (each.dashboard === 'VCAP') {
        each.dashboard = 'VCAP / Deans / Chairs';
      } else {
        each.dashboard = each.dashboard;
      }
    }
    this.rowData = results;
    this.maxRowCount = this.rowData.length;
    return this.rowData;
  }

}
