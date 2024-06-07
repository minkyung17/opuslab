import {assert} from 'chai';

import * as testHelpers from '../../../test-utility/helpers';
import {constants} from '../../../test-utility/testing-constants';
import BulkActions from '../../../../opus-logic/datatables/classes/BulkActions';

describe('Bulk Actions (DataTables) Logic Class', () => {
  let cachePaths = {
    apiTableData: 'bulkActions.tableData'
  };
  let tableDataFromAPI = null;
  let dataTableConfiguration = null;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let BulkActionsLogic = null;
  let results = null;
  let selectedActionType = '1-14'; //Reappointment

  /**
   *
   * @desc - Lets get access token and adminData before tests start
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getAccessTokenAdminDataGlobalData();

    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;

    BulkActionsLogic = new BulkActions({selectedActionType, globalData, adminData, access_token});

    dataTableConfiguration = BulkActionsLogic.dataTableConfiguration;
    done();
  });

  /**
   *
   * @desc - Get cache data
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let {apiTableData} = cachePaths;
    tableDataFromAPI = await testHelpers.getAPIDataFromCache(apiTableData);
    results = tableDataFromAPI;
    done();
  });

  /**
   *
   * @desc - Checks keys in Logic file
   *
   **/
  it('ensures access_token, adminData, & globalData are in BulkActionsLogic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    assert.containsAllKeys(BulkActionsLogic, keys);
  });

  /**
   *
   * @desc - Checks keys exist
   *
   **/
  it('ensures the urlParameters has requisite keys', ()=>{
    let urlParameters = BulkActionsLogic.getDataUrlParameters();
    assert.isString(urlParameters.access_token);
    assert.isString(urlParameters.grouperPathText);
    assert.isString(urlParameters.actionType);
  });

  /**
   *
   * @desc - Gets row data
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/

  it('ensures getRowDataFromServer() returns row results', async (done) => {
    let {apiTableData} = cachePaths;

    let {karmaAliasBaseUrl} = constants;
    dataTableConfiguration.url =
     `${karmaAliasBaseUrl}${dataTableConfiguration.url}`;
    if (!results) {
      results = await BulkActionsLogic.getRowDataFromServer({dataTableConfiguration});
      testHelpers.postAPIDataToCache(results, apiTableData);
    }
    assert.isArray(results);

    done();
  });

  /**
   *
   * @desc - sets Logic class variables.  Ensure that we are correctly overriding
   * with grouperPathTexts and not using formattedGrouperPathTexts in this special case.
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures setLogicClassVariables() has correct grouperPathText', async (done) => {
    BulkActionsLogic.setLogicClassVariables();
    let {grouperPathText} =
    BulkActionsLogic.getClassData(['grouperPathText']);

    let grouperPathTexts
      = adminData.resourceMap[dataTableConfiguration.grouperPathText].grouperPathTexts;
    let formattedGrouperPathTexts
      = adminData.resourceMap[dataTableConfiguration.grouperPathText].formattedGrouperPathTexts;

    assert.isString(grouperPathText);
    assert.equal(grouperPathText, grouperPathTexts);
    assert.notEqual(grouperPathText, formattedGrouperPathTexts);

    done();
  });

  /**
   *
   * @desc - Checks for keys in row result
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures reconcileRowValuesFromServerData() contains correct keys', async (done) => {
    let keyNames = ['appointeeInfo', 'appointmentInfo'];
    assert.containsAllKeys(results[0], keyNames);
    done();
  });

  /**
   *
   * @desc - Determines APU values for display in the datatable
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  it('ensures determineAPUDisplayValues() shows correct display values', async (done) => {
    let row = {
      appointmentInfo: {
        salaryInfo: {
          academicProgramUnit: {
            apuCode: 143001,
            apuDesc: 'NEUROBIO RESEARCH',
            budgetYear: '2018-2019'
          }
        }
      }
    }
    let apuDisplayValues = BulkActionsLogic.determineAPUDisplayValues(row);
    assert.equal(apuDisplayValues, '143001: NEUROBIO RESEARCH - 2018-2019');

    row = {
      appointmentInfo: {
        salaryInfo: {
          academicProgramUnit: {
            apuCode: null,
            apuDesc: '',
            budgetYear: ''
          }
        }
      }
    }
    apuDisplayValues = BulkActionsLogic.determineAPUDisplayValues(row);
    assert.equal(apuDisplayValues, '');

    done();
  });
});
