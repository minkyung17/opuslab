import {assert} from 'chai';

//My imports
import * as testHelpers from '../../../test-utility/helpers';
import {constants} from '../../../test-utility/testing-constants';
import configFilesByName from '../../../../opus-logic/datatables/constants/AllConfigConstants';
import * as util from '../../../../opus-logic/common/helpers/';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import {config as dataTableConfiguration} from
  '../../../../opus-logic/datatables/constants/ActiveCasesConstants';
import Cases from '../../../../opus-logic/datatables/classes/Cases';


describe('Cases Base Class', () =>{

  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let CasesLogic = null;
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
    CasesLogic = new Cases(args);
    getRowDataFromCache = !!apiResults;

    done();
  });

  it('ensures "setClassData" and "getClassData" are functions', () => {
    assert.isFunction(CasesLogic.setClassData);
    assert.isFunction(CasesLogic.getClassData);
  });


  it(`ensures "startLogic" sets up the DataTable config file and creates \
  formattedOptions `, () => {
    let {formattedColumnOptions, ...data} = CasesLogic.startLogic({adminData,
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

  it('ensures access_token, globalData & adminData are in CasesLogic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    let data = CasesLogic.getClassData(keys);
    assert.isString(data.access_token);
    assert.equal(data.access_token.length, 36,
      'Warning: access_token is not 36 characters!');
    assert.isObject(data.globalData);
    assert.isObject(data.adminData);
  });

  it('ensures columnKeys, columnConfiguration, dataColumnFilters are in ' +
      'CasesLogic', () => {
    let keys = ['columnKeys', 'columnConfiguration', 'dataColumnFilters'];
    let {columnKeys, dataColumnFilters, columnConfiguration} =
      CasesLogic.getDataFromDataTableConfiguration(keys);

    assert.isArray(columnKeys);
    assert.isObject(dataColumnFilters);
    assert.isObject(columnConfiguration);
    assert.isAtLeast(columnKeys.length, 1);
    assert.isAtLeast(Object.keys(columnConfiguration).length, 1);
    assert.isAtLeast(Object.keys(dataColumnFilters).length, 1);
  });

  it('ensures "getOptionsListFromAdminAndGlobalData" successfully creates key ' +
     'value pair of sorted column options', () => {
    let hash = CasesLogic.getOptionsListFromAdminAndGlobalData();

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
    let {grouperPathText, access_token: acc_tok} = CasesLogic.getDataUrlParameters();
    assert.isString(grouperPathText);
    assert.isString(acc_tok);
    assert.equal(acc_tok.length, 36);
  });

  it('ensures "setDataTableConfiguration" successfully sets dataTableConfiguration',
  () => {
    let newDataTableConfiguration = util.cloneObject(dataTableConfiguration);
    CasesLogic.setDataTableConfiguration(newDataTableConfiguration);
    assert.equal(CasesLogic.dataTableConfiguration, newDataTableConfiguration);
  });

  it(`ensures "setDataTableConfigurationByConfigName" successfully sets
    dataTableConfiguration`, () => {
    CasesLogic.setDataTableConfigurationByConfigName(config_name);
    assert.deepEqual(configFilesByName[config_name], CasesLogic.dataTableConfiguration);

    //Reset old dataTableConfiguration
    CasesLogic.setDataTableConfiguration(dataTableConfiguration);
  });

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

});
