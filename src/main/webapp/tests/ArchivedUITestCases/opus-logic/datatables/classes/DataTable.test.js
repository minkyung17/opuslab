import {assert} from 'chai';

//My imports
import * as testHelpers from '../../../test-utility/helpers';
import {constants} from '../../../test-utility/testing-constants';
import configFilesByName from '../../../../opus-logic/datatables/constants/AllConfigConstants';
import * as util from '../../../../opus-logic/common/helpers/';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import {config as dataTableConfiguration} from
  '../../../../opus-logic/datatables/constants/ActiveCasesConstants';
import DataTable from '../../../../opus-logic/datatables/classes/DataTable';


describe('DataTable Base Class', () =>{

  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let DataTableLogic = null;
  let apiResults = null;
  let rowData = null;
  let dataTableConfiguration = null;
  let config_name = 'activeCases';
  let api_cache_name = 'activeCasesRowData';
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
    DataTableLogic = new DataTable(args);
    getRowDataFromCache = !!apiResults;

    done();
  });

  it('ensures "setClassData" and "getClassData" are functions', () => {
    assert.isFunction(DataTableLogic.setClassData);
    assert.isFunction(DataTableLogic.getClassData);
  });


  it(`ensures "startLogic" sets up the DataTable config file and creates \
  formattedOptions `, () => {
    let {formattedColumnOptions, ...data} = DataTableLogic.startLogic({adminData,
      globalData, access_token, config_name});
    dataTableConfiguration = data.dataTableConfiguration;
    // assert.isObject(options);

    for(let each of formattedColumnOptions) {
      let {visible, name, displayName} = each;
      assert.isBoolean(visible);
      assert.isString(name);
      assert.isString(displayName);
    }
  });

  it('ensures access_token, globalData & adminData are in DataTableLogic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    let data = DataTableLogic.getClassData(keys);
    assert.isString(data.access_token);
    assert.equal(data.access_token.length, 36,
      'Warning: access_token is not 36 characters!');
    assert.isObject(data.globalData);
    assert.isObject(data.adminData);
  });

  it('ensures columnKeys, columnConfiguration, dataColumnFilters are in ' +
      'DataTableLogic', () => {
    let keys = ['columnKeys', 'columnConfiguration', 'dataColumnFilters'];
    let {columnKeys, dataColumnFilters, columnConfiguration} =
      DataTableLogic.getDataFromDataTableConfiguration(keys);

    assert.isArray(columnKeys);
    assert.isObject(dataColumnFilters);
    assert.isObject(columnConfiguration);
    assert.isAtLeast(columnKeys.length, 1);
    assert.isAtLeast(Object.keys(columnConfiguration).length, 1);
    assert.isAtLeast(Object.keys(dataColumnFilters).length, 1);
  });

  it('ensures "getOptionsListFromAdminAndGlobalData" successfully creates key ' +
     'value pair of sorted column options', () => {
    let hash = DataTableLogic.getOptionsListFromAdminAndGlobalData();

    assert.isObject(hash);
    //Checking the names and array of options
    for(let [columnName, array] of Object.entries(hash)) {
      assert.isString(columnName);
      assert.isArray(array);
      assert.equal(array, Array.sort(array));
    }
  });

  it(`ensures "getDataUrlParameters" returns "grouperPathText" and "access_token" are
      returned`, () => {
    let {grouperPathText, access_token: acc_tok} = DataTableLogic.getDataUrlParameters();
    assert.isString(grouperPathText);
    assert.isString(acc_tok);
    assert.equal(acc_tok.length, 36);
  });

  it('ensures "setDataTableConfiguration" successfully sets dataTableConfiguration',
  () => {
    let newDataTableConfiguration = util.cloneObject(dataTableConfiguration);
    DataTableLogic.setDataTableConfiguration(newDataTableConfiguration);
    assert.equal(DataTableLogic.dataTableConfiguration, newDataTableConfiguration);
  });

  it(`ensures "setDataTableConfigurationByConfigName" successfully sets
    dataTableConfiguration`, () => {
    DataTableLogic.setDataTableConfigurationByConfigName(config_name);
    assert.deepEqual(configFilesByName[config_name], DataTableLogic.dataTableConfiguration);

    //Reset old dataTableConfiguration
    DataTableLogic.setDataTableConfiguration(dataTableConfiguration);
  });

  // it('gets results from API', async (done) => {
  //   let {karmaAliasBaseUrl} = constants;
  //   dataTableConfiguration.url = programTestData.url =
  //     `${karmaAliasBaseUrl}${dataTableConfiguration.url}`;
  //
  //   let results = apiResults = getRowDataFromCache ? apiResults
  //     : await DataTableLogic.retrieveResultsFromServer({dataTableConfiguration});
  //
  //   if(!getRowDataFromCache) {
  //     testHelpers.postAPIDataToCache(results, api_cache_name);
  //   }
  //
  //   assert.isObject(results);
  //   done();
  // });
  //
  // it('ensures the extracted rowData is Correct', () => {
  //   rowData = DataTableLogic.extractRowDataFromServerResults(apiResults,
  //     {dataTableConfiguration});
  //
  //   assert.isArray(rowData);
  //   assert(rowData.length > 0, 'rowData from server is BLANK!!');
  //
  //   assert.containsAllKeys(rowData[0], [
  //     'appointeeInfo', 'actionTypeInfo', 'appointmentInfo'
  //   ]);
  // });

  function setLogicClassVariables(Logic) {

    Logic.setLogicClassVariables();
    let {rawPermissions, rowDataUrl, grouperPathText, columnFilters} =
    Logic.getClassData(['rawPermissions', 'rowDataUrl', 'grouperPathText',
      'columnFilters']);

    assert.isArray(columnFilters);
    assert.isObject(rawPermissions);
    assert.isString(rowDataUrl);
    assert.isString(grouperPathText);
  }

  //TODO: Make a better test
  it(`ensures "setLogicClassVariables" works`, ()=>{
    setLogicClassVariables(DataTableLogic);
  });



  it('ensures "updateColumnVisibility" updates the visibility of a column', () => {
    let name = 'fullName';
    let {visible} = dataTableConfiguration.columnConfiguration[name];

    if(visible) {//If visible set to false
      DataTableLogic.updateColumnVisibility(name, false);
      assert.isFalse(dataTableConfiguration.columnConfiguration[name].visible);
    } else{//If not visible set to true
      DataTableLogic.updateColumnVisibility(name, true);
      assert.isTrue(dataTableConfiguration.columnConfiguration[name].visible);
    }

    //Reset to original value
    DataTableLogic.updateColumnVisibility(name, visible);
  });

  it('ensures "getVisibleColumnNames" works', () => {
    let visibleColumns = DataTableLogic.getVisibleColumnNames();
    for(let name of visibleColumns) {
      assert.isTrue(dataTableConfiguration.columnConfiguration[name].visible);
    }
  });

  it('ensures "updateSearchTextFilterInDataTableConfig" updates string match filter',
  () => {
    let name = 'fullName';
    let match = 'sam';
    dataTableConfiguration.dataColumnFilters.columnStringMatch = {};
    DataTableLogic.updateSearchTextFilterInDataTableConfig(name, match);
    assert.equal(dataTableConfiguration.dataColumnFilters.columnStringMatch[name],
      match);
  });

  it('ensures "shouldSort" returns false for omitted ui columns',
  () => {
    let name = 'reopen';
    let shouldSort = DataTableLogic.shouldSort(name, dataTableConfiguration);
    assert.isFalse(shouldSort);
    name = 'merge';
    shouldSort = DataTableLogic.shouldSort(name, dataTableConfiguration);
    assert.isFalse(shouldSort);
    name = 'delete';
    shouldSort = DataTableLogic.shouldSort(name, dataTableConfiguration);
    assert.isFalse(shouldSort);
  });

  it('ensures "shouldSort" returns true for anything not in omitted ui columns',
  () => {
    let name = 'name';
    let shouldSort = DataTableLogic.shouldSort(name, dataTableConfiguration);
    assert.isTrue(shouldSort);
  });

  it('ensures "updateSortOrderFilterInDataTableConfig" iterates correctly', () => {
    let name = 'fullName';

    //Start new filter iteration
    dataTableConfiguration.dataColumnFilters.columnSortOrder = {};
    let {columnSortOrder} = dataTableConfiguration.dataColumnFilters;

    //Iterate first time
    DataTableLogic.updateSortOrderFilterInDataTableConfig(name);
    assert.equal(columnSortOrder[name], 'asc');

    //Iterate second time
    DataTableLogic.updateSortOrderFilterInDataTableConfig(name);
    assert.equal(columnSortOrder[name], 'desc');

    //Iterate third time
    DataTableLogic.updateSortOrderFilterInDataTableConfig(name);
    assert.isUndefined(columnSortOrder[name]);
  });

  it('ensures "getSortOrderText" returns correct text', () => {
    let firstName = 'fullName';
    let secondName = 'departmentName';

    DataTableLogic.updateSortOrderFilterInDataTableConfig(firstName);
    DataTableLogic.updateSortOrderFilterInDataTableConfig(secondName);
    let sortingText = DataTableLogic.getSortOrderText();
    assert.equal(sortingText, 'Sorting by 1. Name 2. Department ');

    //Empty datatable filter
    dataTableConfiguration.dataColumnFilters.columnSortOrder = {};
  });


  it(`ensures "splitSortIntoNameAndDirection" splits and returns sort names\
  & sort order correctly`, () => {
    //Empty datatable filter
    dataTableConfiguration.dataColumnFilters.columnSortOrder = {};

    //Add 'asc' filters
    DataTableLogic.updateSortOrderFilterInDataTableConfig('fullName');
    DataTableLogic.updateSortOrderFilterInDataTableConfig('departmentName');
    let {sortColumns: sc, sortDirection: sd} = DataTableLogic.splitSortIntoNameAndDirection();
    assert.deepEqual(sc, ['fullName', 'departmentName']);
    assert.deepEqual(sd, ['asc', 'asc']);

    //Now lets 'desc' "departmentName"
    DataTableLogic.updateSortOrderFilterInDataTableConfig('departmentName');
    let {sortColumns: names, sortDirection: direcs} =
      DataTableLogic.splitSortIntoNameAndDirection();
    assert.deepEqual(names, ['fullName', 'departmentName']);
    assert.deepEqual(direcs, ['asc', 'desc']);

    //Iterate one more time to delete 'fullName'
    DataTableLogic.updateSortOrderFilterInDataTableConfig('departmentName');
    let {sortColumns, sortDirection} = DataTableLogic.splitSortIntoNameAndDirection();
    assert.deepEqual(sortColumns, ['fullName']);
    assert.deepEqual(sortDirection, ['asc']);

    //Empty datatable filter
    dataTableConfiguration.dataColumnFilters.columnSortOrder = {};
  });

  it(' "updateValueOptionsFilterInDataTableConfig" ', () => {
    DataTableLogic.updateValueOptionsFilterInDataTableConfig('affiliation',
      {Primary: false});//Should be false and not true. If true all filters wiped
    let {dataColumnFilters: {columnValueOptions}} = dataTableConfiguration;
    assert.isObject(columnValueOptions.affiliation);
    assert.equal(columnValueOptions.affiliation.Primary, false);
  });

  it('ensures "getVisibleTableFilters" returns only visible filters', () => {
    assert.equal(DataTableLogic.dataTableConfiguration, dataTableConfiguration);
    let {columnConfiguration} = dataTableConfiguration;
    columnConfiguration.uid.textSearch = true;
    dataTableConfiguration.dataColumnFilters.columnSortOrder = {};
    dataTableConfiguration.dataColumnFilters.columnValueOptions = {};
    dataTableConfiguration.dataColumnFilters.columnStringMatch = {};

    //These should show up
    DataTableLogic.updateColumnVisibility('fullName', true);
    DataTableLogic.updateSearchTextFilterInDataTableConfig('fullName', 'sam');

    DataTableLogic.updateColumnVisibility('affiliation', true);
    DataTableLogic.updateValueOptionsFilterInDataTableConfig('affiliation',
      {Primary: false});//Should be false and not true. If true all filters wiped

    DataTableLogic.updateColumnVisibility('departmentName', true);
    DataTableLogic.updateSortOrderFilterInDataTableConfig('departmentName');

    //These should not show up
    DataTableLogic.updateColumnVisibility('uid', false);
    DataTableLogic.updateSearchTextFilterInDataTableConfig('uid', '12');

    DataTableLogic.updateColumnVisibility('schoolName', false);
    DataTableLogic.updateValueOptionsFilterInDataTableConfig('schoolName',
      {Dentistry: false});//Should be false and not true. If true all filters wiped

    DataTableLogic.updateColumnVisibility('divisionName', false);
    DataTableLogic.updateSortOrderFilterInDataTableConfig('divisionName');

    let visibleFilters = DataTableLogic.getVisibleTableFilters();
    let {visibleColumnValueOptions, visibleColumnStringMatch,
      visibleColumnSortOrder} = visibleFilters;

    //Visible fields here should be defined
    assert.equal(visibleColumnStringMatch.fullName, 'sam');
    assert.equal(visibleColumnSortOrder.departmentName, 'asc');
    assert.isObject(visibleColumnValueOptions.affiliation);
    assert.equal(visibleColumnValueOptions.affiliation.Primary, false);

    //Invisible fields here should not be defined
    assert.isUndefined(visibleColumnStringMatch.uid);
    assert.isUndefined(visibleColumnSortOrder.divisionName);
    assert.isUndefined(visibleColumnValueOptions.schoolName);

    delete columnConfiguration.uid.textSearch;
  });

  it(` "filterAPITableData" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "retrieveResultsFromServer" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "getRowDataFromServer" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "getFormattedRowDataFromServer" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "getRowData" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "extractRowDataFromServerResultsPromise" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "extractRowDataFromServerResults" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(`"configureColumnInformation" returns display name, current visibility & \
  name of current columns`, () => {
    let columnData = DataTableLogic.configureColumnInformation();
    for(let column of columnData) {
      assert.isString(column.displayName);
      assert.isString(column.name);
      assert.isBoolean(column.visible);
    }
  });


  it('ensures "getOptionsListFromAdminAndGlobalData" has all the value option lists',
  () => {
    let optionsListNames = ['academicYearList', 'seriesList', 'rankList',
      'eligibilityActionTypeList', 'stepList', 'eligibilitySeriesString',
      'actionOutcomes', 'orgLocationList', 'apoAnalystList', 'affiliationTypeList',
      'areaList', 'departmentList', 'divisionList', 'schoolList', 'specialtyList'];
    let options = DataTableLogic.getOptionsListFromAdminAndGlobalData();
    for(let name of optionsListNames) {
      assert.isArray(options[name], `${name} is not an array`);
    }
  });

  it('ensures certain options from "getOptionsListFromAdminAndGlobalData" are sorted',
  () => {
    let sortedOptions = ['eligibilityActionTypeList', 'affiliationTypeList',
      'apoAnalystList', 'orgLocationList', 'academicYearList', 'areaList',
      'departmentList', 'divisionList', 'schoolList', 'specialtyList',
      'eligibilitySeriesString'];
    let options = DataTableLogic.getOptionsListFromAdminAndGlobalData();
    for(let name of sortedOptions) {
      assert.deepEqual(options[name], [...options[name]].sort(),
        `${name} is not sorted`);
    }
  });

  it('ensures "changeColumnFieldValue" changes the value of "name" in column', () => {
    let name = 'fullName';
    let field = 'visible';//Boolean so lets use this
    let value = dataTableConfiguration.columnConfiguration[name][field];

    DataTableLogic.changeColumnFieldValue(name, field, !value);
    assert(dataTableConfiguration.columnConfiguration[name][field] === !value,
      `"changeColumnFieldValue" func did not change the value for field "${name}"`);
  });


  it(` "printLoadTime" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "reconcileRowValuesFromServerData" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "configureAPITableData" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "exportCSV" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });


  it(` "setPermissions" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(` "configureData" `, () => {
    // DataTableLogic.dataTableConfiguration = null;
    // DataTableLogic.setDataTableConfiguration();
    // assert.isDefined(DataTableLogic.dataTableConfiguration);
  });


  it(`"cloneToStartingDataTableConfiguration" clones "startingDataTableConfiguration"\
  by ensuring they are not the sameobject object but are equal in values works `, () => {
    let startingDataTableConfiguration = DataTableLogic.
      cloneToStartingDataTableConfiguration(dataTableConfiguration);
    assert(dataTableConfiguration !== startingDataTableConfiguration);
    // OPUSDEV-2767 Remove 'Removed' from dropdown since reusing same list as profile
    // Messes with test case so need to keep it consistent here:
    dataTableConfiguration.columnConfiguration.appointmentStatus.valueOptions[3] = null;
    assert.deepEqual(dataTableConfiguration, startingDataTableConfiguration);
  });

  //TODO find out why 'deepEqual' aint workin. Not working because you added
  //options to the original data
  // it('"setStartingDataTableConfigurationByConfigName" clones '
  //     + '"startingDataTableConfiguration" by getting config name and ensures '
  //     + 'they are not the same object but are equal in values works ', () => {
  //   let startingDataTableConfiguration = DataTableLogic.
  //     setStartingDataTableConfigurationByConfigName(config_name);
  //   assert(dataTableConfiguration !== startingDataTableConfiguration);
  // });

  it(`ensures "resetDataTableConfiguration" successfully resets
    dataTableConfiguration`, () => {
    DataTableLogic.dataTableConfiguration = null;
    DataTableLogic.resetDataTableConfiguration();
    assert.isDefined(DataTableLogic.dataTableConfiguration);
  });

  it(`ensures "setTypeOfReq" Roster has the correct url`, () => {
    let url ='www.opusWeb.com';
    let functionUrl = DataTableLogic.setTypeOfReq(url, 'Roster')
    let testingUrl = url+'&typeOfReq=active'
    assert.equal(testingUrl, functionUrl)
  });

  it(`ensures "setTypeOfReq" InactiveRoster has the correct url`, () => {
    let url ='www.opusWeb.com';
    let functionUrl = DataTableLogic.setTypeOfReq(url, 'InactiveRoster')
    let testingUrl = url+'&typeOfReq=inactive'
    assert.equal(testingUrl, functionUrl)
  });

});
