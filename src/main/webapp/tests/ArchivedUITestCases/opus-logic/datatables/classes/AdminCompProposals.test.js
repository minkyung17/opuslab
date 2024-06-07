import {assert} from 'chai';
import {difference} from 'lodash';

//My imports
import '../../../test-utility/setup-tests';
import * as util from '../../../../opus-logic/common/helpers';
import * as tableTests from './DataTable.common';
import * as commonTests from './DataTable.common1';
import * as testHelpers from '../../../test-utility/helpers';
import {constants} from '../../../test-utility/testing-constants';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import AdminCompProposals from '../../../../opus-logic/datatables/classes/AdminCompProposals';
import {config as dataTableConfiguration} from
  '../../../../opus-logic/datatables/constants/AdminCompConstants';


describe('AdminCompProposals Logic', () => {
  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let AdminCompLogic = null;
  let apiResults = null;
  let rowData = null;
  let pristineRowData = null;
  let config_name = 'adminComp';
  let api_cache_name = 'adminCompRowData';
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
    AdminCompLogic = new AdminCompProposals(args);
    getRowDataFromCache = !!apiResults;
    done();
  });


//  it('ensures config_name = "activeCases" ', () => {
//    assert.equal(config_name, 'activeCases');
//  });
//
//  it('ensures access_token & adminData are in ActiveCasesLogic', () => {
//    let keys = ['access_token', 'adminData', 'globalData'];
//    assert.containsAllKeys(ActiveCasesLogic, keys);
//  });
//
//
//  it('ensures "getDataUrlParameters" returns requisite keys', () => {
//    let urlParameters = ActiveCasesLogic.getDataUrlParameters();
//    assert.isString(urlParameters.access_token);
//    assert.isAbove(urlParameters.access_token.length, 20);
//    assert.isString(urlParameters.grouperPathText);
//    assert.equal(urlParameters.pageName, 'Active');
//    assert.containsAllKeys(urlParameters, [
//      'access_token', 'grouperPathText', 'pageName'
//    ]);
//  });

  /****************************************************************************
   *
   * @desc - Common DataTable tests
   *
   ****************************************************************************/
//  it('Checks for getters and setters for the Logic Class', ()=>{
//    tableTests.checkForLogicClassGetterSetter_test(ActiveCasesLogic);
//  });
//
//  it('ensures "startLogic" sets up the DataTable config file and creates ' +
//    'formattedOptions', ()=>{
//    tableTests.startLogic_test(ActiveCasesLogic, {config_name, adminData,
//      globalData, access_token});
//  });
//
//  it('ensures access_token, globalData & adminData are in the Logic class', ()=>{
//    tableTests.commonCallData_test(ActiveCasesLogic);
//  });
//
//  it('ensures columnKeys, columnConfiguration, dataColumnFilters are in "Logic"', ()=>{
//    tableTests.datatableConfigKeys_test(ActiveCasesLogic);
//  });
//
//  it(`ensures "getOptionsListFromAdminAndGlobalData" successfully creates\
//  key value pair of sorted column options`, ()=>{
//    tableTests.getOptionsListFromAdminAndGlobalData_test(ActiveCasesLogic);
//  });
//
//  it(`ensures "getDataUrlParameters" returns "grouperPathText" and\
//   "access_token" are returned`, ()=>{
//    tableTests.getDataUrlParameters_test(ActiveCasesLogic);
//  });
//
//  it(`ensures "setDataTableConfigurationByConfigName" successfully sets\
//  dataTableConfiguration`, ()=>{
//    tableTests.setDataTableConfiguration_test(ActiveCasesLogic);
//  });
//
//  it(`ensures "setDataTableConfigurationByConfigName" successfully sets\
//  dataTableConfiguration`, () => {
//    tableTests.setDataTableConfigurationByConfigName_test(ActiveCasesLogic,
//      config_name);
//  });
//
 it('gets results from API', async (done) => {
   apiResults = await tableTests.getAPIResults(AdminCompLogic,
     {programTestData, getRowDataFromCache, api_cache_name, apiResults});
   done();
 });

  it('ensures the extracted rowData is Correct', () => {
    pristineRowData = util.cloneObject({apiResults});
  });

//  it(`ensures "setLogicClassVariables" successfully sets class keys and\
//  filters`, ()=>{
//    tableTests.setLogicClassVariables(ActiveCasesLogic);
//  });
//
//  it('ensures "updateColumnVisibility" updates the visibility of a column', ()=>{
//    tableTests.updateColumnVisibility(ActiveCasesLogic);
//  });
//
//  it('ensures "getVisibleColumnNames" works', ()=>{
//    tableTests.getVisibleColumnNames(ActiveCasesLogic);
//  });
//
//  it(`ensures "updateSearchTextFilterInDataTableConfig" updates string
//  match filter`, ()=>{
//    tableTests.updateSearchTextFilterInDataTableConfig(ActiveCasesLogic);
//  });
//
//  it('ensures "updateSortOrderFilterInDataTableConfig" iterates correctly', ()=>{
//    tableTests.updateSortOrderFilterInDataTableConfig(ActiveCasesLogic);
//  });
//
//  it('ensures "getSortOrderText" returns correct text', ()=>{
//    tableTests.getSortOrderText_test(ActiveCasesLogic);
//  });
//
//  it(`ensures "splitSortIntoNameAndDirection" splits and returns sort names\
//  & sort order correctly`, ()=>{
//    tableTests.splitSortIntoNameAndDirection(ActiveCasesLogic);
//  });
//
//  it(`ensures "updateValueOptionsFilterInDataTableConfig" correctly updates\
//  value options`, ()=>{
//    tableTests.updateValueOptionsFilterInDataTableConfig(ActiveCasesLogic);
//  });
//
//  it(`"configureColumnInformation" returns display name, current visibility & \
//  name of current columns`, ()=>{
//    tableTests.configureColumnInformation(ActiveCasesLogic);
//  });
//
//  it(`ensures "getOptionsListFromAdminAndGlobalData" has all the value\
//  option lists`, ()=>{
//    tableTests.getOptionsListFromAdminAndGlobalData(ActiveCasesLogic);
//  });
//
//  it(`ensures certain options from "getOptionsListFromAdminAndGlobalData" \
//  are sorted`, ()=>{
//    tableTests.sortOptionsListFromAdminAndGlobalData(ActiveCasesLogic);
//  });
//
//  it('ensures "changeColumnFieldValue" changes the value of "name" in column', ()=>{
//    tableTests.changeColumnFieldValue(ActiveCasesLogic);
//  });
//
//
//  it('ensures "configureAPITableData" gets "columnsKeys" for each table result', ()=>{
//    let rowDataClone = util.cloneObject(pristineRowData);
//    tableTests.configureAPITableData(ActiveCasesLogic, rowDataClone);
//  });
//
//
//  it('ensures "createDynamicFilterOptions" creates unique options for that column', ()=>{
//    let rowDataClone = util.cloneObject(pristineRowData);
//    tableTests.createDynamicFilterOptions(ActiveCasesLogic, rowDataClone);
//  });
//
//  it('getVisibleColumnSortOrder()', () => {
//    let columnSortOrder = {fullName: 'asc'};
//    let visibleColumns = ['fullName', 'departmentName', 'titleCode'];
//    let visibleColumnSortOrder = ActiveCasesLogic.getVisibleColumnSortOrder(
//      columnSortOrder, visibleColumns);
//
//    assert.deepEqual(visibleColumnSortOrder, columnSortOrder);
//  });
//
//  it('ensures "transformDatesInData" correctly transforms dates', ()=>{
//    let rowDataClone = util.cloneObject(pristineRowData);
//    tableTests.transformDatesInData(ActiveCasesLogic, rowDataClone);
//  });
//
//  it('ensures "filterBySimpleObject" correctly filters rowData', ()=>{
//    let simpleFilter = {departmentName: 'Medicine'};
//    let rowDataClone = util.cloneObject(pristineRowData);
//    rowDataClone = ActiveCasesLogic.configureAPITableData(rowDataClone);
//    tableTests.filterBySimpleObject(ActiveCasesLogic, rowDataClone, simpleFilter);
//  });
//
//  it('ensures "filterByStringMatch" correctly filters the string', ()=>{
//    let columnStringMatch = {departmentName: 'Medi'};
//    let rowDataClone = util.cloneObject(pristineRowData);
//    rowDataClone = ActiveCasesLogic.configureAPITableData(rowDataClone);
//    tableTests.filterByStringMatch(ActiveCasesLogic, rowDataClone, columnStringMatch);
//  });
//
//  it('ensures "filterColumnValueOptions" correctly filters by column values', ()=>{
//    let columnValueOptions = {affiliation: {Primary: true}};
//    let rowDataClone = util.cloneObject(pristineRowData);
//    rowDataClone = ActiveCasesLogic.configureAPITableData(rowDataClone);
//    tableTests.filterColumnValueOptions(ActiveCasesLogic, rowDataClone,
//      columnValueOptions);
//  });
//
//  it('ensures "sortRowDataByObject" correctly sorts by current object', ()=>{
//    let columnSortOrder = {divisionName: 'asc'};
//    let rowDataClone = util.cloneObject(pristineRowData);
//    rowDataClone = ActiveCasesLogic.configureAPITableData(rowDataClone);
//    tableTests.sortRowDataByObject(ActiveCasesLogic, rowDataClone,
//      columnSortOrder);
//  });
//
//
//
//  it('ensures "getFormattedExcelFilterVariables" correctly returns filters', ()=>{
//    let columnVisibility = {fullName: true, affiliation: true,
//      divisionName: true};
//    let columnStringMatch = {fullName: 'sam'};
//    let columnValueOptions = {affiliation: {Primary: true}};
//    let sortColumnDirection = {divisionName: 'asc'};
//    tableTests.getFormattedExcelFilterVariables(ActiveCasesLogic, {columnVisibility,
//      columnStringMatch, columnValueOptions, sortColumnDirection});
//  });
//
//  it('ensures "createMoneyDisplayValue" correctly adds "$" to value', ()=>{
//    let rowDataClone = util.cloneObject(pristineRowData);
//    tableTests.createMoneyDisplayValue(ActiveCasesLogic, rowDataClone);
//  });
//
//  it('ensures "createPercentDisplayValue" correctly adds "%" to value', ()=>{
//    let rowDataClone = util.cloneObject(pristineRowData);
//    tableTests.createPercentDisplayValue(ActiveCasesLogic, rowDataClone);
//  });
//
//  it('ensures "replaceFilters" correctly replaces filters in dataTableConfiguration', ()=>{
//    tableTests.replaceFilters(ActiveCasesLogic);
//  });
//
//  it(`"cloneToStartingDataTableConfiguration" clones "startingDataTableConfiguration" \
//  by ensuring they are not the sameobject object but are equal in values works`, ()=>{
//    tableTests.cloneToStartingDataTableConfiguration(ActiveCasesLogic);
//  });
//
//  it(`"resetDataTableConfiguration_test" clones "startingDataTableConfiguration"\
//  by ensuring they are not the same object object but are equal in values`, ()=>{
//    tableTests.resetDataTableConfiguration_test(ActiveCasesLogic);
//  });
 /****************************************************************************
  *
  * End of Common Tests
  *
  ****************************************************************************/

  /****************************************************************************
   *
   * Modified tests - Copied from Datatable.common  - this function was deleted
   * from ActiveCases.js
   *
   ****************************************************************************/
  // it('ensures "getExportToExcelUrl" returns string url', () => {
  //   assert.isString(ActiveCasesLogic.access_token);
  //   assert.equal(ActiveCasesLogic.access_token.length, 36);
  //   assert.isString(ActiveCasesLogic.grouperPathText);
  //   assert.isString(ActiveCasesLogic.dataTableConfiguration.exportToExcelBaseUrl);
  //
  //   let {grouperPathText, dataTableConfiguration: {exportToExcelBaseUrl, csvPageName}}
  //     = ActiveCasesLogic;
  //   let direct_csv_url = ActiveCasesLogic.addAccessTokenAndGrouperToUrl(
  //     exportToExcelBaseUrl, access_token, {grouperPathText, addGrouper: true});
  //   direct_csv_url += `&pageName=${csvPageName}`;
  //
  //   let csv_url = ActiveCasesLogic.getExportToExcelUrl();
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

//  it('ensures "configureAPITableData" creates necessary "columnKeys"', () => {
//    rowData = ActiveCasesLogic.configureAPITableData(rowData);
//    let {columnKeys, omitUIColumns} = dataTableConfiguration;
//    let columnsName = difference(columnKeys, omitUIColumns);
//    assert.containsAllKeys(rowData[0], columnsName);
//  });
//
//  it('ensures "addCasesLinkToRowData" creates a link to its Case Summary for every row', () => {
//    for(let row of rowData) {
//      assert.isString(row.link);
//      assert.isAbove(row.link.length, 75);
//    }
//  });
//

});
