import {assert} from 'chai';
import {difference} from 'lodash';


//My imports
import '../../../test-utility/setup-tests';
import * as tableTests from './DataTable.common';
import {constants} from '../../../test-utility/testing-constants';
import * as util from '../../../../opus-logic/common/helpers/';
import * as testHelpers from '../../../test-utility/helpers';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import CompletedCases from '../../../../opus-logic/datatables/classes/Cases';
import {config as dataTableConfiguration} from
  '../../../../opus-logic/datatables/constants/CompletedCasesConstants';


describe('CompletedCases Logic', () => {
  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let Logic = null;
  let apiResults = null;
  let rowData = null;
  let pristineRowData = null;
  let config_name = 'completedCases';
  let api_cache_name = 'completedCasesRowData';
  let programTestData = {};

  /**
   *
   * @desc - Lets get access token, globalData, and adminData before tests start
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getCacheDataAndCommonCallData(api_cache_name);
    apiResults = data.apiResults;
    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;
    let args = {config_name, adminData, globalData, access_token};
    Logic = new CompletedCases(args);
    getRowDataFromCache = !!apiResults;
    done();
  });

  it('ensures access_token & adminData are in Logic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    assert.containsAllKeys(Logic, keys);
  });


  it('ensures the urlParameters has requisite keys', ()=>{
    //let urlParameterArgs = {dataTableConfiguration, access_token};
    let urlParameters = Logic.getDataUrlParameters();

    assert.isString(urlParameters.access_token);
    assert.isString(urlParameters.grouperPathText);
    assert.equal(urlParameters.pageName, 'Completed');
    assert.containsAllKeys(urlParameters, [
      'access_token', 'grouperPathText', 'pageName'
    ]);
  });

  it('gets results from API', async (done) => {
    apiResults = await tableTests.getAPIResults(Logic,
      {programTestData, getRowDataFromCache, api_cache_name, apiResults});

    done();
  });

//   it('gets completed case results from API', async (done) => {
//     let {karmaAliasBaseUrl} = constants;
//     dataTableConfiguration.url = programTestData.url =
//       `${karmaAliasBaseUrl}${dataTableConfiguration.url}`;
//
//     let results = apiResults = getRowDataFromCache ? apiResults
//       : await Logic.retrieveResultsFromServer({dataTableConfiguration});
//
//     if(!getRowDataFromCache) {
//       testHelpers.postAPIDataToCache(results, api_cache_name);
//     }
//
//     assert.isObject(results);
//     done();
//   });

  it('ensures the extracted rowData is Correct', () => {
    rowData = Logic.extractRowDataFromServerResults(apiResults,
      {dataTableConfiguration});

    pristineRowData = util.cloneObject(rowData);
    assert.isArray(rowData);
    assert(rowData.length > 0, 'rowData from server is BLANK!!');
  });

  it('ensures "configureAPITableData" has necessary "columnKeys" when omitting ' +
      '"edit" and "delete"', () => {
    rowData = Logic.configureAPITableData(rowData);
    let {columnKeys, omitUIColumns} = dataTableConfiguration;
    let columnsName = difference(columnKeys, omitUIColumns);
    assert.containsAllKeys(rowData[0], columnsName);
  });

  it('ensures "getExportToExcelUrl" returns string url', () => {
    let csv_url = Logic.getExportToExcelUrl();
    assert.isString(csv_url);
  });

  it('ensures "getCsvUrlArgs" returns args needed data for Excel export', () => {
    let {csvPageName} = Logic.getCsvUrlArgs();
    assert.equal(csvPageName, 'Completed');
  });

  it('ensures "addCasesLinkToRowData" creates a link to its Case Summary for every row', () => {
    for(let row of rowData) {
      assert.isString(row.link);
      assert.isAbove(row.link.length, 75);
    }
  });

  // it('ensures "getCsvUrl" has correct args & returns a csv string', () => {
  //   let csvUrl = Logic.getCsvUrl();
  //   assert.isString();
  // });
});
