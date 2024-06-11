import {assert} from 'chai';
import moment from 'moment';
import {difference, get, map, orderBy, filter, uniq} from 'lodash';

//My imports
import * as testHelpers from '../../../test-utility/helpers';
import {constants} from '../../../test-utility/testing-constants';
import * as util from '../../../../opus-logic/common/helpers/';
import {dataViewTypes} from '../../../../opus-logic/datatables/constants/DatatableConstants';
import configFilesByName from '../../../../opus-logic/datatables/constants/AllConfigConstants';


/**
 *
 * @desc - Check for getters and setters for the Logic Class
 * @param {Function} done - when 'done' is executed all the tests will start
 *
 **/
export function checkForLogicClassGetterSetter_test(Logic) {
  assert.isFunction(Logic.setClassData);
  assert.isFunction(Logic.getClassData);
}


/**
 *
 * @desc - ensures "startLogic" sets up the DataTable config file and creates \
 *  formattedOptions
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export function startLogic_test(Logic, {adminData,
  globalData, access_token, config_name} = {}) {
  let {dataTableConfiguration} = Logic;

  let {formattedColumnOptions, ...data} = Logic.startLogic({adminData,
    globalData, access_token, config_name});
  dataTableConfiguration = data.dataTableConfiguration;
  assert.isObject(dataTableConfiguration);

  for(let each of formattedColumnOptions) {
    let {visible, name, displayName} = each;
    assert.isBoolean(visible);
    assert.isString(name);
    assert.isString(displayName);
  }
}


/**
 *
 * @desc - ensures access_token, globalData & adminData are in the Logic class
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export function commonCallData_test(Logic) {
  let keys = ['access_token', 'adminData', 'globalData'];
  let data = Logic.getClassData(keys);
  assert.isString(data.access_token);
  assert.equal(data.access_token.length, 36,
    'Warning: access_token is not 36 characters!');
  assert.isObject(data.globalData);
  assert.isObject(data.adminData);
}

/**
 *
 * @desc - ensures columnKeys, columnConfiguration, dataColumnFilters are in
 *  'Logic
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export function datatableConfigKeys_test(Logic) {
  let keys = ['columnKeys', 'columnConfiguration', 'dataColumnFilters'];
  let {columnKeys, dataColumnFilters, columnConfiguration} =
    Logic.getDataFromDataTableConfiguration(keys);

  assert.isArray(columnKeys);
  assert.isObject(dataColumnFilters);
  assert.isObject(columnConfiguration);
  assert.isAtLeast(columnKeys.length, 1);
  assert.isAtLeast(Object.keys(columnConfiguration).length, 1);
  assert.isAtLeast(Object.keys(dataColumnFilters).length, 1);
}

/**
 *
 * @desc - ensures "getOptionsListFromAdminAndGlobalData" successfully creates
 *   key value pair of sorted column options
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export function getOptionsListFromAdminAndGlobalData_test(Logic) {
  let hash = Logic.getOptionsListFromAdminAndGlobalData();

  assert.isObject(hash);
  //Checking the names and array of options
  for(let [columnName, array] of Object.entries(hash)) {
    assert.isString(columnName);
    assert.isArray(array);
    assert.equal(array, Array.sort(array));
  }
}

/**
 *
 * @desc - ensures "getDataUrlParameters" returns "grouperPathText" and
 *  "access_token" are returned
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export function getDataUrlParameters_test(Logic) {
  let {grouperPathText, access_token: acc_tok} = Logic.getDataUrlParameters();
  assert.isString(grouperPathText);
  assert.isString(acc_tok);
  assert.equal(acc_tok.length, 36);
}

/**
 *
 * @desc - ensures "setDataTableConfiguration" successfully sets dataTableConfiguration
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export function setDataTableConfiguration_test(Logic) {
  let {dataTableConfiguration} = Logic;
  let newDataTableConfiguration = util.cloneObject(dataTableConfiguration);
  Logic.setDataTableConfiguration(newDataTableConfiguration);
  assert.equal(Logic.dataTableConfiguration, newDataTableConfiguration);
}

/**
 *
 * @desc - ensures "setDataTableConfigurationByConfigName" successfully sets
 *  dataTableConfiguration
 * @param {Function} Logic - Datatable Logic file
 * @param {String} config_name - Datatable Logic file
 * @return {void}
 *
 **/
export function setDataTableConfigurationByConfigName_test(Logic, config_name) {
  let {dataTableConfiguration} = Logic;
  Logic.setDataTableConfigurationByConfigName(config_name);
  assert.deepEqual(configFilesByName[config_name], Logic.dataTableConfiguration);

  //Reset old dataTableConfiguration
  Logic.setDataTableConfiguration(dataTableConfiguration);
}

/**
 *
 * @desc - gets results from API
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export async function getAPIResults(Logic, {programTestData = {},
  getRowDataFromCache, api_cache_name, apiResults} = {}) {
  let {karmaAliasBaseUrl} = constants;
  let {dataTableConfiguration} = Logic;
  Logic.dataTableConfiguration.url = programTestData.url =
    `${karmaAliasBaseUrl}${dataTableConfiguration.url}`;

  let results = getRowDataFromCache ? apiResults
    : await Logic.retrieveResultsFromServer({dataTableConfiguration});

  if(!getRowDataFromCache) {
    testHelpers.postAPIDataToCache(results, api_cache_name);
  }

  return results;
}

/**
 *
 * @desc - ensures the extracted rowData is Correct
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export function extractRowData(Logic, {apiResults} = {}) {
  let {dataTableConfiguration} = Logic;
  let rowData = Logic.extractRowDataFromServerResults(apiResults,
    {dataTableConfiguration});

  assert.isArray(rowData);
  assert(rowData.length > 0, 'rowData from server is BLANK!!');
  return rowData;
}

/**
 *
 * @desc - ensures the extracted rowData has correct keys
 * @param {Array} rowData - rowData from API to check
 * @param {Array} checkForKeys - keys that should be in rowData
 * @return {void}
 *
 **/
export function correctRowDataKeys(rowData, checkForKeys = []) {
  assert.containsAllKeys(rowData[0], checkForKeys);
  return rowData;
}

/**
 *
 * @desc - ensures "setLogicClassVariables" successfully sets class keys and
 *  filters
 * @param {Function} Logic - Datatable Logic file
 * @param {String} config_name - Datatable Logic file
 * @return {void}
 *
 **/
export function setLogicClassVariables(Logic) {
  Logic.setLogicClassVariables();
  let {rawPermissions, rowDataUrl, grouperPathText, columnFilters} =
  Logic.getClassData(['rawPermissions', 'rowDataUrl', 'grouperPathText',
    'columnFilters']);

  assert.isArray(columnFilters);
  assert.isObject(rawPermissions);
  assert.isString(rowDataUrl);
  assert.isString(grouperPathText);
}

/**
 *
 * @desc - ensures "updateColumnVisibility" updates the visibility of a column
 * @param {Function} Logic - Datatable Logic file
 * @param {String} name - column to update with visibility
 * @return {void}
 *
 **/
export function updateColumnVisibility(Logic, name = 'fullName') {
  let {dataTableConfiguration} = Logic;
  let {visible} = dataTableConfiguration.columnConfiguration[name];

  if(visible) {//If visible set to false
    Logic.updateColumnVisibility(name, false);
    assert.isFalse(dataTableConfiguration.columnConfiguration[name].visible);
  } else{//If not visible set to true
    Logic.updateColumnVisibility(name, true);
    assert.isTrue(dataTableConfiguration.columnConfiguration[name].visible);
  }

  //Reset to original value
  Logic.updateColumnVisibility(name, visible);
}

/**
 *
 * @desc - ensures "getVisibleColumnNames" works
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export function getVisibleColumnNames(Logic) {
  let visibleColumns = Logic.getVisibleColumnNames();
  for(let name of visibleColumns) {
    assert.isTrue(Logic.dataTableConfiguration.columnConfiguration[name].visible);
  }
}

/**
 *
 * @desc - ensures "updateSearchTextFilterInDataTableConfig" updates string
 *  match filter
 * @param {Function} Logic - Datatable Logic file
 * @return {void}
 *
 **/
export function updateSearchTextFilterInDataTableConfig(Logic, {name = 'fullName',
  match = 'sam'} = {}) {
  let {dataTableConfiguration} = Logic;
  dataTableConfiguration.dataColumnFilters.columnStringMatch = {};
  Logic.updateSearchTextFilterInDataTableConfig(name, match);
  assert.equal(dataTableConfiguration.dataColumnFilters.columnStringMatch[name],
    match);
}

/**
*
* @desc - ensures "updateSortOrderFilterInDataTableConfig" iterates correctly
* @param {Function} Logic - Datatable Logic file
* @param {String} name - column name to sort
* @return {void}
*
**/
export function updateSortOrderFilterInDataTableConfig(Logic, name = 'fullName') {
  //Start new filter iteration
  Logic.dataTableConfiguration.dataColumnFilters.columnSortOrder = {};
  let {columnSortOrder} = Logic.dataTableConfiguration.dataColumnFilters;

  //Iterate first time
  Logic.updateSortOrderFilterInDataTableConfig(name);
  assert.equal(columnSortOrder[name], 'asc');

  //Iterate second time
  Logic.updateSortOrderFilterInDataTableConfig(name);
  assert.equal(columnSortOrder[name], 'desc');

  //Iterate third time
  Logic.updateSortOrderFilterInDataTableConfig(name);
  assert.isUndefined(columnSortOrder[name]);
}

/**
*
* @desc - ensures "getSortOrderText" returns correct text
* @param {Function} Logic - Datatable Logic file
* @param {String} firstName - first column to sort
* @param {String} secondName - second column to sort
* @return {void}
*
**/
export function getSortOrderText_test(Logic, firstName = 'fullName',
  secondName = 'departmentName') {
  Logic.updateSortOrderFilterInDataTableConfig(firstName);
  Logic.updateSortOrderFilterInDataTableConfig(secondName);
  let sortingText = Logic.getSortOrderText();
  assert.equal(sortingText, 'Sorting by 1. Name 2. Department ');

  //Empty datatable filter
  Logic.dataTableConfiguration.dataColumnFilters.columnSortOrder = {};
}

/**
*
* @desc - ensures "splitSortIntoNameAndDirection" splits and returns sort names
*  & sort order correctly
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function splitSortIntoNameAndDirection(Logic) {
  //Empty datatable filter
  Logic.dataTableConfiguration.dataColumnFilters.columnSortOrder = {};

  //Add 'asc' filters
  Logic.updateSortOrderFilterInDataTableConfig('fullName');
  Logic.updateSortOrderFilterInDataTableConfig('departmentName');
  let {sortColumns: sc, sortDirection: sd} = Logic.splitSortIntoNameAndDirection();
  assert.deepEqual(sc, ['fullName', 'departmentName']);
  assert.deepEqual(sd, ['asc', 'asc']);

  //Now lets 'desc' "departmentName"
  Logic.updateSortOrderFilterInDataTableConfig('departmentName');
  let {sortColumns: names, sortDirection: direcs} =
    Logic.splitSortIntoNameAndDirection();
  assert.deepEqual(names, ['fullName', 'departmentName']);
  assert.deepEqual(direcs, ['asc', 'desc']);

  //Iterate one more time to delete 'fullName'
  Logic.updateSortOrderFilterInDataTableConfig('departmentName');
  let {sortColumns, sortDirection} = Logic.splitSortIntoNameAndDirection();
  assert.deepEqual(sortColumns, ['fullName']);
  assert.deepEqual(sortDirection, ['asc']);

  //Empty datatable filter
  Logic.dataTableConfiguration.dataColumnFilters.columnSortOrder = {};
}

/**
*
* @desc - ensures "updateValueOptionsFilterInDataTableConfig" correctly updates
*   value options
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function updateValueOptionsFilterInDataTableConfig(Logic) {
  Logic.updateValueOptionsFilterInDataTableConfig('affiliation',
    {Primary: false});//Should be false and not true. If true all filters wiped
  let {dataColumnFilters: {columnValueOptions}} = Logic.dataTableConfiguration;
  assert.isObject(columnValueOptions.affiliation);
  assert.equal(columnValueOptions.affiliation.Primary, false);
}

/**
*
* @desc - ensures "getVisibleTableFilters" returns only visible filters
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function getVisibleTableFilters(Logic) {
  assert.equal(Logic.dataTableConfiguration, Logic.dataTableConfiguration);
  let {columnConfiguration} = Logic.dataTableConfiguration;
  columnConfiguration.uid.textSearch = true;
  Logic.dataTableConfiguration.dataColumnFilters.columnSortOrder = {};
  Logic.dataTableConfiguration.dataColumnFilters.columnValueOptions = {};
  Logic.dataTableConfiguration.dataColumnFilters.columnStringMatch = {};

  //These should show up
  Logic.updateColumnVisibility('fullName', true);
  Logic.updateSearchTextFilterInDataTableConfig('fullName', 'sam');

  Logic.updateColumnVisibility('affiliation', true);
  Logic.updateValueOptionsFilterInDataTableConfig('affiliation',
    {Primary: false});//Should be false and not true. If true all filters wiped

  Logic.updateColumnVisibility('departmentName', true);
  Logic.updateSortOrderFilterInDataTableConfig('departmentName');

  //These should not show up
  Logic.updateColumnVisibility('uid', false);
  Logic.updateSearchTextFilterInDataTableConfig('uid', '12');

  Logic.updateColumnVisibility('schoolName', false);
  Logic.updateValueOptionsFilterInDataTableConfig('schoolName',
    {Dentistry: false});//Should be false and not true. If true all filters wiped

  Logic.updateColumnVisibility('divisionName', false);
  Logic.updateSortOrderFilterInDataTableConfig('divisionName');

  let visibleFilters = Logic.getVisibleTableFilters();
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
}

/**
 *
 * @desc - filters collection by simple object set in child classes
 * @param {Function} Logic - Datatable Class
 * @param {Array} rowData - rowData from the server
 * @param {Object} simpleFilters - key/value pair of possible options to
 *  filter by
 * @return {Array} formattedRowData - filtered options
 *
 **/
export function filterBySimpleObject(Logic, rowData = [], simpleFilters = {}) {
  let filteredRowData = Logic.filterBySimpleObject(rowData, simpleFilters);

  //Go through each filter
  for(let name in simpleFilters) {
    //Get unique results
    let uniqResults = uniq(filteredRowData.map(e => e[name]));
    //Ensure if result is in filter
    for(let result of uniqResults) {
      assert.equal(result, simpleFilters[name]);
    }
  }
}

/**
 *
 * @desc - filters collection by ensuring string is in value
 * @param {Function} Logic - Datatable Class
 * @param {Array} rowData - rowData from the server
 * @param {Object} columnStringMatch - key/string pair of possible options
 * @return {Array} formattedRowData - filtered options
 *
 **/
export function filterByStringMatch(Logic, rowData = [], columnStringMatch = {}) {
  let filteredRowData = Logic.filterByStringMatch(rowData, columnStringMatch);

  //Go through each filter
  for(let name in columnStringMatch) {
    //Get unique results
    let uniqResults = uniq(filteredRowData.map(e => e[name]));
    //Ensure if result is in filter

    for(let text of uniqResults) {
      assert(text.match(new RegExp(columnStringMatch[name], 'gi')) !== null);
    }
  }
}

/**
 *
 * @desc - Filters Collection by checking if the values of keys in row data
 *  are included in columnValueOptions
 * @param {Function} Logic - Datatable Class
 * @param {Array} rowData - rowData from the server
 * @param {Object} columnValueOptions - key/object pair of possible options
 * @return {Array} formattedRowData - filtered options
 **/
export function filterColumnValueOptions(Logic, rowData = [],
  columnValueOptions = {}) {
  let formattedRowData = Logic.filterColumnValueOptions(rowData, columnValueOptions);

  for(let each of formattedRowData) {
    for(let column in columnValueOptions) {
      assert(each[column] in columnValueOptions[column],
        `${each[column]} is not in ${columnValueOptions[column]}`);
    }
  }
}

/**
 *
 * @desc - ensures "sortRowDataByObject" sort data
 * @param {Function} Logic - Datatable Class
 * @param {Array} rowData - url from the server
 * @param {Object} visibleColumnSortOrder - visible columns to use to sort
 * @param {Object} - check "uniqueIdToCheck" rather than checking complex objects
 * @return {Array} formattedRowData -
 *
 **/
export function sortRowDataByObject(Logic, rowData = [], columnSortOrder = {},
  {uniqueIdToCheck = 'uid'} = {}) {
  let formattedRowData = Logic.sortRowDataByObject(rowData, columnSortOrder);
  let formattedRowDataIds = formattedRowData.map(e => e[uniqueIdToCheck]);

  let clonedRowData = util.cloneObject(rowData);
  let [sortColumns, sortDirection] =
    util.destructureObjectIntoKeyValueArrays(columnSortOrder);
  let rowDataCheck = orderBy(clonedRowData, sortColumns, sortDirection);
  let rowDataCheckIds = rowDataCheck.map(e => e[uniqueIdToCheck]);

  assert.deepEqual(formattedRowDataIds, rowDataCheckIds);
}


// I may Need tests for these
// it(` "getRowDataFromServer" `, () => {
//   // Logic.dataTableConfiguration = null;
//   // Logic.setDataTableConfiguration();
//   // assert.isDefined(Logic.dataTableConfiguration);
// });
//
// it(` "getFormattedRowDataFromServer" `, () => {
//   // Logic.dataTableConfiguration = null;
//   // Logic.setDataTableConfiguration();
//   // assert.isDefined(Logic.dataTableConfiguration);
// });
//
// it(` "getRowData" `, () => {
//   // Logic.dataTableConfiguration = null;
//   // Logic.setDataTableConfiguration();
//   // assert.isDefined(Logic.dataTableConfiguration);
// });
//
// it(` "extractRowDataFromServerResultsPromise" `, () => {
//   // Logic.dataTableConfiguration = null;
//   // Logic.setDataTableConfiguration();
//   // assert.isDefined(Logic.dataTableConfiguration);
// });
//
// it(` "extractRowDataFromServerResults" `, () => {
//   // Logic.dataTableConfiguration = null;
//   // Logic.setDataTableConfiguration();
//   // assert.isDefined(Logic.dataTableConfiguration);
// });

/**
*
* @desc - "configureColumnInformation" returns display name, current visibility & \
*   name of current columns
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function configureColumnInformation(Logic) {
  let columnData = Logic.configureColumnInformation();
  for(let column of columnData) {
    assert.isString(column.displayName);
    assert.isString(column.name);
    assert.isBoolean(column.visible);
  }
}

/**
*
* @desc - ensures "getOptionsListFromAdminAndGlobalData" has all the value
*   option lists
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function getOptionsListFromAdminAndGlobalData(Logic) {
  let optionsListNames = ['academicYearList', 'seriesList', 'rankList',
    'eligibilityActionTypeList', 'stepList', 'eligibilitySeriesString',
    'actionOutcomes', 'orgLocationList', 'apoAnalystList', 'affiliationTypeList',
    'areaList', 'departmentList', 'divisionList', 'schoolList', 'specialtyList'];
  let options = Logic.getOptionsListFromAdminAndGlobalData();
  for(let name of optionsListNames) {
    assert.isArray(options[name], `${name} is not an array`);
  }
}

/**
*
* @desc - ensures certain options from "getOptionsListFromAdminAndGlobalData" are sorted
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function sortOptionsListFromAdminAndGlobalData(Logic) {
  let sortedOptions = ['eligibilityActionTypeList', 'affiliationTypeList',
    'apoAnalystList', 'orgLocationList', 'academicYearList', 'areaList',
    'departmentList', 'divisionList', 'schoolList', 'specialtyList',
    'eligibilitySeriesString'];
  let options = Logic.getOptionsListFromAdminAndGlobalData();
  for(let name of sortedOptions) {
    assert.deepEqual(options[name], [...options[name]].sort(),
      `${name} is not sorted`);
  }
}

/**
*
* @desc - ensures "changeColumnFieldValue" changes the value of "name" in column
* @param {Function} Logic - Datatable Logic file
* @param {String} name - column to be changed
* @param {String} field - field to be changed
* @return {void}
*
**/
export function changeColumnFieldValue(Logic, name = 'fullName', field = 'visible') {
  let value = Logic.dataTableConfiguration.columnConfiguration[name][field];

  Logic.changeColumnFieldValue(name, field, !value);
  assert(Logic.dataTableConfiguration.columnConfiguration[name][field] === !value,
    `"changeColumnFieldValue" func did not change the value for field "${name}"`);
}


/**
*
* @desc - ensures "configureAPITableData" has the 'columnKeys' for each result
* @param {Function} Logic - Datatable Logic file
* @param {Array} rowData - column to be changed
* @return {void}
*
**/
export function configureAPITableData(Logic, rowData = []) {
  let configuredRowData = Logic.configureAPITableData(rowData);
  let {columnKeys, omitUIColumns} = Logic.dataTableConfiguration;
  let keys = difference(columnKeys, omitUIColumns);

  assert.containsAllKeys(configuredRowData[0], keys);
  return rowData;
}

/**
*
* @desc - ensures "createDynamicFilterOptions" create array of options
* @param {Function} Logic - Datatable Logic file
* @param {Array} rowData - column to be changed
* @return {void}
*
**/
export function createDynamicFilterOptions(Logic, rowData = [],
  {select_options_key = 'valueOptions'} = {}) {
  //Lets draw out the values to the first level in rowData objects
  let configuredRowData = Logic.configureAPITableData(rowData);
  let {columnConfiguration} = Logic.createDynamicFilterOptions(configuredRowData,
    Logic.dataTableConfiguration);

  for(let name in columnConfiguration) {
    if(columnConfiguration[name].dynamicFilterSearch) {
      let options = columnConfiguration[name][select_options_key];
      assert.isArray(options);
      assert.isAbove(options.length, 1, `Check options for ${name}`);
    }
  }
}

/**
*
* @desc - ensures "transformDatesInData" correctly transforms dates
* @param {Function} Logic - Datatable Logic file
* @param {Array} rowData - column to be changed
* @return {void}
*
**/
export function transformDatesInData(Logic, rowData = []) {
  let {columnConfiguration} = Logic.dataTableConfiguration;

  //Lets draw out the values to the first level in rowData objects
  let configuredRowData = Logic.configureAPITableData(rowData);
  let rowDataClone = util.cloneObject(configuredRowData);
  Logic.transformDatesInData(columnConfiguration, configuredRowData);


  for(let name in columnConfiguration) {
    if(columnConfiguration[name].transformDate) {
      let {transformDate: {from, to, pathToGetValue, pathToSetValue = name},
      saveOriginalValueByKey} = columnConfiguration[name];

      configuredRowData.map((each, index) => {
        let originalValue = each[saveOriginalValueByKey];
        let value = get(each, pathToGetValue);//Get current value
        if(value) {
          let date = moment(originalValue, from).format(to);

          //Make sure it transfored the date
          assert.equal(date, each[pathToSetValue]);

          //Make sure original value is properly saved
          assert.equal(rowDataClone[index][pathToGetValue], originalValue);
        }
      });
    }
  }
}


/**
*
* @desc - ensures "createMoneyDisplayValue" correctly transforms money
* @param {Function} Logic - Datatable Logic file
* @param {Array} rowData - column to be changed
* @return {void}
*
**/
export function createMoneyDisplayValue(Logic, rowData = []) {
  let {columnConfiguration} = Logic.dataTableConfiguration;

  //Lets draw out the values to the first level in rowData objects
  let configuredRowData = Logic.configureAPITableData(rowData);
  Logic.createMoneyDisplayValue(columnConfiguration, configuredRowData);

  for(let name in columnConfiguration) {
    if(columnConfiguration[name].viewType === dataViewTypes.money) {
      let {displayKey} = columnConfiguration[name];

      configuredRowData.map(each => {
        let value = get(each, displayKey);//Get current value
        if(!(value in {null: true, undefined: true})) {
          let money = `$${value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g,
            '$1,')}`;
          assert.equal(money, each[displayKey]);
        }
      });
    }
  }
}

/**
*
* @desc - ensures "createPercentDisplayValue" correctly transforms money
* @param {Function} Logic - Datatable Logic file
* @param {Array} rowData - column to be changed
* @return {void}
*
**/
export function createPercentDisplayValue(Logic, rowData = []) {
  let {columnConfiguration} = Logic.dataTableConfiguration;

  //Lets draw out the values to the first level in rowData objects
  let configuredRowData = Logic.configureAPITableData(rowData);
  Logic.createPercentDisplayValue(columnConfiguration, configuredRowData);

  for(let name in columnConfiguration) {
    if(columnConfiguration[name].viewType === dataViewTypes.percent) {
      let {displayKey, pathToGetValue = name} = columnConfiguration[name];

      //Transform values in row results
      configuredRowData.map(each => {
        let value = get(each, pathToGetValue);//Get current value
        if(!(value in {null: true, undefined: true})) {
          value += '%';
          assert.equal(value, each[displayKey]);
        }
      });
    }
  }
}


/**
*
* @desc - ensures "replaceFilters" overlays any of the filters in "dataColumnFilters"
* @param {Function} Logic - Datatable Logic file
* @param {Array} rowData - column to be changed
* @return {void}
*
**/
export function replaceFilters(Logic) {
  let {dataTableConfiguration: dtConfig} = Logic;

  //Column Sorting
  dtConfig.dataColumnFilters.columnSortOrder = {}; //Wipe the filter
  let columnSortOrder = {fullName: 'sort'}; //Set the filter
  Logic.replaceFilters({columnSortOrder}); //Replace the filter via Logic
  assert.deepEqual(columnSortOrder, dtConfig.dataColumnFilters.columnSortOrder);

  //Column String Match
  dtConfig.dataColumnFilters.columnStringMatch = {}; //Wipe the filter
  let columnStringMatch = {fullName: 'sam'}; //Set the filter
  Logic.replaceFilters({columnStringMatch}); //Replace the filter via Logic
  assert.deepEqual(columnStringMatch, dtConfig.dataColumnFilters.columnStringMatch);


  //Column Value Options
  dtConfig.dataColumnFilters.columnValueOptions = {}; //Wipe the filter
  let columnValueOptions = {schoolName: {Dentistry: true}}; //Set the filter
  Logic.replaceFilters({columnValueOptions}); //Replace the filter via Logic
  assert.deepEqual(columnValueOptions, dtConfig.dataColumnFilters.columnValueOptions);


  //Column Simple filtering
  dtConfig.dataColumnFilters.simpleFilters = {}; //Wipe the filter
  let simpleFilters = {waiverFlag: true}; //Set the filter
  Logic.replaceFilters({simpleFilters}); //Replace the filter via Logic
  assert.deepEqual(simpleFilters, dtConfig.dataColumnFilters.simpleFilters);


  //Column Outside filtering
  dtConfig.dataColumnFilters.outsideFilters = {}; //Wipe the filter
  let outsideFilters = {randomFilter: false}; //Set the filter
  Logic.replaceFilters({outsideFilters}); //Replace the filter via Logic
  assert.deepEqual(outsideFilters, dtConfig.dataColumnFilters.outsideFilters);
}

/**
*
* @desc - "cloneToStartingDataTableConfiguration" clones "startingDataTableConfiguration"
*   by ensuring they are not the sameobject object but are equal in values works
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function cloneToStartingDataTableConfiguration(Logic) {
  let startingDataTableConfiguration = Logic.
    cloneToStartingDataTableConfiguration(Logic.dataTableConfiguration);
  assert(Logic.dataTableConfiguration !== startingDataTableConfiguration);
  assert.deepEqual(Logic.dataTableConfiguration, startingDataTableConfiguration);
}

/**
*
* @desc - "resetDataTableConfiguration_test" clones "startingDataTableConfiguration"
*   by ensuring they are not the same object object but are equal in values
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function resetDataTableConfiguration_test(Logic) {
  Logic.dataTableConfiguration = null;
  Logic.resetDataTableConfiguration();
  assert.isObject(Logic.dataTableConfiguration);
}

/**
*
* @desc - "getExportToExcelUrl" returns the correctly formatted url
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function getExportToExcelUrl(Logic) {
  assert.isString(Logic.access_token);
  assert.equal(Logic.access_token.length, 36);
  assert.isString(Logic.grouperPathText);
  assert.isString(Logic.dataTableConfiguration.exportToExcelBaseUrl);

  let {access_token, grouperPathText, dataTableConfiguration:
    {exportToExcelBaseUrl}} = Logic;
  let direct_csv_url = Logic.addAccessTokenAndGrouperToUrl(exportToExcelBaseUrl,
    access_token, {grouperPathText, addGrouper: true});

  let csv_url = Logic.getExportToExcelUrl();

  assert.equal(csv_url, direct_csv_url);
}

/**
*
* @desc - ensures "getFormattedExcelFilterVariables" returns correct (visible)
*   filters
* @param {Function} Logic - Datatable Logic file
* @return {void}
*
**/
export function getFormattedExcelFilterVariables(Logic, {columnVisibility = {},
  columnSortOrder = {}, columnStringMatch = {}, columnValueOptions = {}} = {}) {
  //Save old config
  let originalDtConfig = util.cloneObject(Logic.dataTableConfiguration);

  //Hide all the columns
  for(let name in Logic.dataTableConfiguration.columnConfiguration) {
    Logic.updateColumnVisibility(name, false);
  }

  //Show these columns
  for(let name in columnVisibility) {
    Logic.updateColumnVisibility(name, columnVisibility[name]);
  }

  //Lets replace all the filters
  Logic.replaceFilters({columnSortOrder, columnStringMatch,
    columnValueOptions});

  //Get variables from excel name
  let excel = Logic.getFormattedExcelFilterVariables();
  //Check column string match
  for(let name in excel.columnStringMatch) {
    assert.isTrue(columnVisibility[name]);//Field should be visible
    assert.equal(excel.columnStringMatch[name], columnStringMatch[name]);
  }

  //Check column value options
  for(let name in excel.columnSelectOptions) {
    let positives = Object.keys(columnValueOptions[name]);
    positives = positives.filter(each => columnValueOptions[name][each]);
    assert.isTrue(columnVisibility[name]);//Field should be visible
    assert.deepEqual(excel.columnSelectOptions[name], positives);
  }

  //Check column sort direction
  for(let name in excel.sortColumnDirection) {
    assert.isTrue(columnVisibility[name]);//Field should be visible
    assert.equal(excel.sortColumnDirection[name], columnSortOrder[name]);
  }

  for(let index in excel.sortFields) {
    let name = excel.sortFields[index];
    assert.isTrue(columnVisibility[name]);//Field should be visible
    assert.equal(excel.sortOrder[name], columnSortOrder[name]);
  }

  //Reset old config
  Logic.dataTableConfiguration = originalDtConfig;
}