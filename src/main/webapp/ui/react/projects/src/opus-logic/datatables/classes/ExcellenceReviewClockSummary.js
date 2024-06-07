import DataTable from './DataTable';
import * as util from '../../common/helpers/';

/******************************************************************************
 *
 * @desc - Excellence Review Clock Summary
 *
 ******************************************************************************/

export default class ExcellenceReviewClockSummary extends DataTable {

  /**
  *
  * @desc - Static variables
  *
  **/
  defaultConfigName = 'excellenceReviewClockSummary';

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
   * @desc - Come here to do special stuff to ERC Summary table data
   * @param {Array} rowData - array of row table data
   * @return {Array} rowData - reformatted rowData
   *
   **/
  configureAPITableData(rowData = []) {
    let formattedRowData = super.configureAPITableData(rowData);
    formattedRowData = this.addProfileLinkToRowData(formattedRowData);
    return formattedRowData;
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
    this.rowData = results;
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
   * @desc - Adds profile link to rowData
   * @param {Array} rowData - array of row table data
   * @param {Object} dataTableConfiguration -
   * @return {Array} rowData - reformed rowData
   *
   **/
  addProfileLinkToRowData(rowData, dataTableConfiguration = this.dataTableConfiguration,
    {link_key = 'link'} = {}) {
    let {profileLink} = dataTableConfiguration;
    for(let each of rowData) {
      each[link_key] = profileLink + each.originalData.appointeeInfo.opusPersonId;
    }
    return rowData;
  }
}
