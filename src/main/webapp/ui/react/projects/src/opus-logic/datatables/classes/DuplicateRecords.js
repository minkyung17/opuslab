import DataTable from './DataTable';
import * as util from '../../common/helpers/';
import {duplicateRecordsConfig} from '../constants/DuplicateRecordsConstants';

/******************************************************************************
 *
 * @desc - Duplicate Records
 *
 ******************************************************************************/

export default class DuplicateRecords extends DataTable {

  /**
  *
  * @desc - Static variables
  *
  **/
  defaultConfigName = 'duplicateRecords';

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
    this.rowData = results;
    this.maxRowCount = this.rowData.length;
    return this.rowData;
  }

  /**
   *
   * @desc - api request to get all fuzzy matches
   * @param {Object} rowData - case that will be used to find fuzzy matches
   * @returns {Promise} - promise for fuzzy matches
   *
   **/
  getFuzzyMatches = async (uid) => {
    let {access_token, grouperPathText} = this;
    let args = util.jsonToUrlArgs({access_token, grouperPathText});
    let url = `${duplicateRecordsConfig.getFuzzyMatches}${uid}${'/?'}${args}`;
    let getFuzzyMatchesPromise = util.fetchJson(url);
    return getFuzzyMatchesPromise;
  }

  mergeRecordsPromise = async (recordToBeMerged, recordsToBeMergedWith) => {
    console.log(recordToBeMerged);
    console.log(recordsToBeMergedWith);
    let {access_token, grouperPathText, adminData} = this;
    let mergingRecords = '';
    if(recordsToBeMergedWith.length>1){
      mergingRecords = recordsToBeMergedWith.join(',')
    } else {
      mergingRecords = recordsToBeMergedWith;
    }
    let args = util.jsonToUrlArgs({access_token, grouperPathText,
      loggedInUserId: adminData.adminOpusId,
      toOpusId: recordToBeMerged, fromOpusIds: mergingRecords});
    let url = `${duplicateRecordsConfig.mergeRecordsUrl}${args}`;
    let mergeRecordsPromise = util.postJson(url);
    return mergeRecordsPromise;
  }
}
