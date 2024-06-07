import {assert} from 'chai';
import {difference} from 'lodash';

//My imports
import '../../../test-utility/setup-tests';
import * as util from '../../../../opus-logic/common/helpers/';
import * as tableTests from './DataTable.common';
import * as commonTests from './DataTable.common1';
import * as testHelpers from '../../../test-utility/helpers';
import {constants} from '../../../test-utility/testing-constants';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import WithdrawnCases from '../../../../opus-logic/datatables/classes/Cases';
import {config as dataTableConfiguration} from
  '../../../../opus-logic/datatables/constants/WithdrawnCasesConstants';


describe('WithdrawnCases Logic', () => {
  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let WithdrawnCasesLogic = null;
  let apiResults = null;
  let rowData = null;
  let pristineRowData = null;
  let config_name = 'withdrawnCases';
  let api_cache_name = 'withdrawnCasesRowData';
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
    WithdrawnCasesLogic = new WithdrawnCases(args);
    getRowDataFromCache = !!apiResults;
    done();
  });


  it('ensures config_name = "withdrawnCases" ', () => {
    assert.equal(config_name, 'withdrawnCases');
  });

  it('ensures access_token & adminData are in WithdrawnCasesLogic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    assert.containsAllKeys(WithdrawnCasesLogic, keys);
  });

  // describe('placeholder', () => {
  //
  //   commonTests.firstTests(WithdrawnCasesLogic, {adminData, globalData, access_token,
  //     config_name});
  // });

  it('ensures "getDataUrlParameters" returns requisite keys', () => {
    let urlParameters = WithdrawnCasesLogic.getDataUrlParameters();
    assert.isString(urlParameters.access_token);
    assert.isAbove(urlParameters.access_token.length, 20);
    assert.isString(urlParameters.grouperPathText);
    assert.equal(urlParameters.pageName, 'Withdrawn');
    assert.containsAllKeys(urlParameters, [
      'access_token', 'grouperPathText', 'pageName'
    ]);
  });

  /****************************************************************************
   *
   * @desc - Common DataTable tests
   *
   ****************************************************************************/
  it('Checks for getters and setters for the Logic Class', ()=>{
    tableTests.checkForLogicClassGetterSetter_test(WithdrawnCasesLogic);
  });

  it('ensures "startLogic" sets up the DataTable config file and creates ' +
    'formattedOptions', ()=>{
    tableTests.startLogic_test(WithdrawnCasesLogic, {config_name, adminData,
      globalData, access_token});
  });

  it('ensures access_token, globalData & adminData are in the Logic class', ()=>{
    tableTests.commonCallData_test(WithdrawnCasesLogic);
  });

  it('ensures columnKeys, columnConfiguration, dataColumnFilters are in "Logic"', ()=>{
    tableTests.datatableConfigKeys_test(WithdrawnCasesLogic);
  });

  it(`ensures "getOptionsListFromAdminAndGlobalData" successfully creates\
  key value pair of sorted column options`, ()=>{
    tableTests.getOptionsListFromAdminAndGlobalData_test(WithdrawnCasesLogic);
  });

  it(`ensures "getDataUrlParameters" returns "grouperPathText" and\
   "access_token" are returned`, ()=>{
    tableTests.getDataUrlParameters_test(WithdrawnCasesLogic);
  });

  it(`ensures "setDataTableConfigurationByConfigName" successfully sets\
  dataTableConfiguration`, ()=>{
    tableTests.setDataTableConfiguration_test(WithdrawnCasesLogic);
  });

  it(`ensures "setDataTableConfigurationByConfigName" successfully sets\
  dataTableConfiguration`, () => {
    tableTests.setDataTableConfigurationByConfigName_test(WithdrawnCasesLogic,
      config_name);
  });

  it('gets results from API', async (done) => {
    apiResults = await tableTests.getAPIResults(WithdrawnCasesLogic,
      {programTestData, getRowDataFromCache, api_cache_name, apiResults});
    done();
  });

  it('ensures the extracted rowData is Correct', () => {
    rowData = tableTests.extractRowData(WithdrawnCasesLogic,
      {apiResults});
    pristineRowData = util.cloneObject(rowData);
  });

  it(`ensures "setLogicClassVariables" successfully sets class keys and\
  filters`, ()=>{
    tableTests.setLogicClassVariables(WithdrawnCasesLogic);
  });

  it('ensures "updateColumnVisibility" updates the visibility of a column', ()=>{
    tableTests.updateColumnVisibility(WithdrawnCasesLogic);
  });

  it('ensures "getVisibleColumnNames" works', ()=>{
    tableTests.getVisibleColumnNames(WithdrawnCasesLogic);
  });

  it(`ensures "updateSearchTextFilterInDataTableConfig" updates string
  match filter`, ()=>{
    tableTests.updateSearchTextFilterInDataTableConfig(WithdrawnCasesLogic);
  });

  it('ensures "updateSortOrderFilterInDataTableConfig" iterates correctly', ()=>{
    tableTests.updateSortOrderFilterInDataTableConfig(WithdrawnCasesLogic);
  });

  it('ensures "getSortOrderText" returns correct text', ()=>{
    tableTests.getSortOrderText_test(WithdrawnCasesLogic);
  });

  it(`ensures "splitSortIntoNameAndDirection" splits and returns sort names\
  & sort order correctly`, ()=>{
    tableTests.splitSortIntoNameAndDirection(WithdrawnCasesLogic);
  });

  it(`ensures "updateValueOptionsFilterInDataTableConfig" correctly updates\
  value options`, ()=>{
    tableTests.updateValueOptionsFilterInDataTableConfig(WithdrawnCasesLogic);
  });

  it(`"configureColumnInformation" returns display name, current visibility & \
  name of current columns`, ()=>{
    tableTests.configureColumnInformation(WithdrawnCasesLogic);
  });

  it(`ensures "getOptionsListFromAdminAndGlobalData" has all the value\
  option lists`, ()=>{
    tableTests.getOptionsListFromAdminAndGlobalData(WithdrawnCasesLogic);
  });

  it(`ensures certain options from "getOptionsListFromAdminAndGlobalData" \
  are sorted`, ()=>{
    tableTests.sortOptionsListFromAdminAndGlobalData(WithdrawnCasesLogic);
  });

  it('ensures "changeColumnFieldValue" changes the value of "name" in column', ()=>{
    tableTests.changeColumnFieldValue(WithdrawnCasesLogic);
  });


  it('ensures "configureAPITableData" gets "columnsKeys" for each table result', ()=>{
    let rowDataClone = util.cloneObject(pristineRowData);
    tableTests.configureAPITableData(WithdrawnCasesLogic, rowDataClone);
  });


  // it('ensures "createDynamicFilterOptions" creates unique options for that column', ()=>{
  //   let rowDataClone = util.cloneObject(pristineRowData);
  //   tableTests.createDynamicFilterOptions(WithdrawnCasesLogic, rowDataClone);
  // });

  it('getVisibleColumnSortOrder()', () => {
    let columnSortOrder = {fullName: 'asc'};
    let visibleColumns = ['fullName', 'departmentName', 'titleCode'];
    let visibleColumnSortOrder = WithdrawnCasesLogic.getVisibleColumnSortOrder(
      columnSortOrder, visibleColumns);

    assert.deepEqual(visibleColumnSortOrder, columnSortOrder);
  });

  it('ensures "transformDatesInData" correctly transforms dates', ()=>{
    let rowDataClone = util.cloneObject(pristineRowData);
    tableTests.transformDatesInData(WithdrawnCasesLogic, rowDataClone);
  });

  it('ensures "filterBySimpleObject" correctly filters rowData', ()=>{
    let simpleFilter = {departmentName: 'Medicine'};
    let rowDataClone = util.cloneObject(pristineRowData);
    rowDataClone = WithdrawnCasesLogic.configureAPITableData(rowDataClone);
    tableTests.filterBySimpleObject(WithdrawnCasesLogic, rowDataClone, simpleFilter);
  });

  it('ensures "filterByStringMatch" correctly filters the string', ()=>{
    let columnStringMatch = {departmentName: 'Medi'};
    let rowDataClone = util.cloneObject(pristineRowData);
    rowDataClone = WithdrawnCasesLogic.configureAPITableData(rowDataClone);
    tableTests.filterByStringMatch(WithdrawnCasesLogic, rowDataClone, columnStringMatch);
  });

  it('ensures "filterColumnValueOptions" correctly filters by column values', ()=>{
    let columnValueOptions = {affiliation: {Primary: true}};
    let rowDataClone = util.cloneObject(pristineRowData);
    rowDataClone = WithdrawnCasesLogic.configureAPITableData(rowDataClone);
    tableTests.filterColumnValueOptions(WithdrawnCasesLogic, rowDataClone,
      columnValueOptions);
  });

  it('ensures "sortRowDataByObject" correctly sorts by current object', ()=>{
    let columnSortOrder = {divisionName: 'asc'};
    let rowDataClone = util.cloneObject(pristineRowData);
    rowDataClone = WithdrawnCasesLogic.configureAPITableData(rowDataClone);
    tableTests.sortRowDataByObject(WithdrawnCasesLogic, rowDataClone,
      columnSortOrder);
  });



  it('ensures "getFormattedExcelFilterVariables" correctly returns filters', ()=>{
    let columnVisibility = {fullName: true, affiliation: true,
      divisionName: true};
    let columnStringMatch = {fullName: 'sam'};
    let columnValueOptions = {affiliation: {Primary: true}};
    let sortColumnDirection = {divisionName: 'asc'};
    tableTests.getFormattedExcelFilterVariables(WithdrawnCasesLogic, {columnVisibility,
      columnStringMatch, columnValueOptions, sortColumnDirection});
  });

  it('ensures "createMoneyDisplayValue" correctly adds "$" to value', ()=>{
    let rowDataClone = util.cloneObject(pristineRowData);
    tableTests.createMoneyDisplayValue(WithdrawnCasesLogic, rowDataClone);
  });

  it('ensures "createPercentDisplayValue" correctly adds "%" to value', ()=>{
    let rowDataClone = util.cloneObject(pristineRowData);
    tableTests.createPercentDisplayValue(WithdrawnCasesLogic, rowDataClone);
  });

  it('ensures "replaceFilters" correctly replaces filters in dataTableConfiguration', ()=>{
    tableTests.replaceFilters(WithdrawnCasesLogic);
  });

  it(`"cloneToStartingDataTableConfiguration" clones "startingDataTableConfiguration" \
  by ensuring they are not the sameobject object but are equal in values works`, ()=>{
    tableTests.cloneToStartingDataTableConfiguration(WithdrawnCasesLogic);
  });

  it(`"resetDataTableConfiguration_test" clones "startingDataTableConfiguration"\
  by ensuring they are not the same object object but are equal in values`, ()=>{
    tableTests.resetDataTableConfiguration_test(WithdrawnCasesLogic);
  });
 /****************************************************************************
  *
  * End of Common Tests
  *
  ****************************************************************************/

  /****************************************************************************
   *
   * Modified tests - Copied from Datatable.common  - this function was deleted
   * from WithdrawnCases.js
   *
   ****************************************************************************/
  // it('ensures "getExportToExcelUrl" returns string url', () => {
  //   assert.isString(WithdrawnCasesLogic.access_token);
  //   assert.equal(WithdrawnCasesLogic.access_token.length, 36);
  //   assert.isString(WithdrawnCasesLogic.grouperPathText);
  //   assert.isString(WithdrawnCasesLogic.dataTableConfiguration.exportToExcelBaseUrl);
  //
  //   let {grouperPathText, dataTableConfiguration: {exportToExcelBaseUrl, csvPageName}}
  //     = WithdrawnCasesLogic;
  //   let direct_csv_url = WithdrawnCasesLogic.addAccessTokenAndGrouperToUrl(
  //     exportToExcelBaseUrl, access_token, {grouperPathText, addGrouper: true});
  //   direct_csv_url += `&pageName=${csvPageName}`;
  //
  //   let csv_url = WithdrawnCasesLogic.getExportToExcelUrl();
  //
  //   assert.equal(csv_url, direct_csv_url);
  // });
  /****************************************************************************
   *
   * End of modified tests
   *
   ****************************************************************************/

   /****************************************************************************
    *
    * Tests specific to this class
    *
    ****************************************************************************/

  it('ensures "configureAPITableData" creates necessary "columnKeys"', () => {
    rowData = WithdrawnCasesLogic.configureAPITableData(rowData);
    let {columnKeys, omitUIColumns} = dataTableConfiguration;
    let columnsName = difference(columnKeys, omitUIColumns);
    assert.containsAllKeys(rowData[0], columnsName);
  });

  it('ensures "addCasesLinkToRowData" creates a link to its Case Summary for every row', () => {
    for(let row of rowData) {
      assert.isString(row.link);
      assert.isAbove(row.link.length, 75);
    }
  });

  it('ensures "getCsvUrlArgs" returns args needed data for Excel export', () => {
    let {csvPageName} = WithdrawnCasesLogic.getCsvUrlArgs();
    assert.equal(csvPageName, 'Withdrawn');
  });

});
