import {assert} from 'chai';
import {every} from 'lodash';

//My imports
import '../../../test-utility/setup-tests';
import * as testHelpers from '../../../test-utility/helpers';
import {constants} from '../../../test-utility/testing-constants';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import Eligibility from '../../../../opus-logic/datatables/classes/Eligibility';


describe('Eligibility Logic Class', () => {
  let getRowDataFromCache = false;
  let dataTableConfiguration = null;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let Logic = null;
  let apiResults = null;
  let rowData = null;
  let config_name = 'eligibility';
  let api_cache_name = 'eligibilityRowData';
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
    Logic = new Eligibility(args);
    dataTableConfiguration = Logic.dataTableConfiguration;
    getRowDataFromCache = !!apiResults;
    done();
  });

  it('ensures access_token, adminData, & globalData are in Logic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    assert.containsAllKeys(Logic, keys);
  });

  it('"getDataUrlParameters"', () => {
    let fewRows = 'Y';
    let args = Logic.getDataUrlParameters({fewRows});

    assert.equal(Logic.access_token, args.access_token);
    assert.equal(fewRows, args.fewRows);
    assert.exists(Logic.grouperPathText);
  });


  it('filterAPITableData() running to show theres no error.  All functions tested'
  + ' elsewhere', () => {
    let apiRowData = [{name: 'OPUS'}];
    let filtered = Logic.filterAPITableData(apiRowData, dataTableConfiguration);

    assert.deepEqual(apiRowData, filtered);

    //already tested by super.filterAPITableData
    //already tested by filterRowDataByFlags
  });

  it('gets eligibility results from API', async (done) => {
    let {karmaAliasBaseUrl} = constants;
    dataTableConfiguration.url = programTestData.url =
      `${karmaAliasBaseUrl}${dataTableConfiguration.url}`;

    let results = apiResults = getRowDataFromCache ? apiResults
      : await Logic.retrieveResultsFromServer({dataTableConfiguration});

    if(!getRowDataFromCache) {
      let array = [];
      array.push(results[0])
      testHelpers.postAPIDataToCache(array, api_cache_name);
    }

    assert.isArray(results);
    done();
  });

  it('ensures the extracted Eligibility\'s rowData has values', () => {
    rowData = Logic.extractRowDataFromServerResults(apiResults,
      {dataTableConfiguration});

    assert.isArray(rowData);
    assert(rowData.length > 0, 'rowData from server is blank');
  });

  it('ensures "configureAPITableData" has necessary "columnKeys" ', () => {
    rowData = Logic.configureAPITableData(rowData);
    let {columnKeys} = dataTableConfiguration;
    assert.containsAllKeys(rowData[0], columnKeys);
  });


  it('ensures "reconcileRowValuesFromServerData" in rowData[0] has necessary keys ', () => {
    let keyNames = ['eligibleRankStep', 'currentRankStep'];
    assert.containsAllKeys(rowData[0], keyNames);
  });

  it('ensures "updateOutsideFiltersInDatatableConfig" updates ' +
      'mandatoryActionFlag filter ', () => {
    let {dataColumnFilters: {outsideFilters}} = dataTableConfiguration;
    let name = 'mandatoryActionFlag';

    //Set mandatoryActionFlag variable
    Logic.updateOutsideFiltersInDatatableConfig({name, value: true});
    //Make sure the variable's value was
    assert.isTrue(outsideFilters.mandatoryActionFlag, `${name} not set to true`);

    //Delete mandatoryActionFlag from filters
    Logic.updateOutsideFiltersInDatatableConfig({name, value: false});
    assert.isUndefined(outsideFilters.mandatoryActionFlag, `${name} filter not deleted`);
  });

  it('ensures "updateOutsideFiltersInDatatableConfig" correctly updates waiver filter ', () => {
    let {dataColumnFilters: {outsideFilters}} = dataTableConfiguration;

    //Set waiverFlag variable
    Logic.updateOutsideFiltersInDatatableConfig({name: 'waiverFlag',
      value: true});
    //Make sure the variable's value was
    assert.isTrue(outsideFilters.waiverFlag);

    //Delete waiverFlag from filters
    Logic.updateOutsideFiltersInDatatableConfig({name: 'waiverFlag',
      value: false});
    assert.isUndefined(outsideFilters.waiverFlag, 'waiverFlag filter not deleted');
  });


  it('ensures "filterRowDataByFlags" correctly filters by mandatoryActionFlag', () => {
    //Set mandatoryActionFlag variable
    Logic.updateOutsideFiltersInDatatableConfig({name: 'mandatoryActionFlag',
      value: true});

    //Filter the data and then check it
    let filteredData = Logic.filterRowDataByFlags(rowData);
    let mandatoryActionFlagValues = filteredData.map(e => e.mandatoryActionFlag);
    let valueArray = every(mandatoryActionFlagValues, (e) => e === true);
    assert.isTrue(valueArray);

    //Delete mandatoryActionFlag from filters
    Logic.updateOutsideFiltersInDatatableConfig({name: 'mandatoryActionFlag',
      value: false});
  });

  it('ensures "filterRowDataByFlags" correctly filters by waiverFlag ', () => {
    //Set mandatoryActionFlag variable
    Logic.updateOutsideFiltersInDatatableConfig({name: 'waiverFlag',
      value: true});

    //Filter the data and then check it
    let filteredData = Logic.filterRowDataByFlags(rowData);
    let waiverFlagValues = filteredData.map(e => e.waiverFlag);
    //Make sure every results is false
    let valueArray = every(waiverFlagValues, (e) => e === true);
    assert.isTrue(valueArray);

    //Delete waiverFlag from filters
    Logic.updateOutsideFiltersInDatatableConfig({name: 'waiverFlag',
      value: false});
  });

  it('"reconcileRowValuesFromServerData" tests waiverFlag and mandatoryActionFlag', () => {
    let row = {
        mandatoryActionFlag: true,
        waiverFlag: true
      }
    let formatted = Logic.reconcileRowValuesFromServerData(row, dataTableConfiguration);

    assert.isTrue(formatted.waiverFlag)
    assert.isTrue(formatted.mandatoryActionFlag)
  });
});
