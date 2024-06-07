import {assert} from 'chai';

//My imports
import '../../../test-utility/setup-tests';
import {constants as dtConstants} from './datatable-testing-constants';
import {constants} from '../../../test-utility/testing-constants';
import * as util from '../../../../opus-logic/common/helpers/';
import * as testHelpers from '../../../test-utility/helpers';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import {Clock} from '../../../../opus-logic/datatables/classes/Clock';


describe('Clock Logic Class', () => {
  let opusPersonId = 3093;
  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let Logic = null;
  let apiResults = null;
  let rowData = null;
  let pristineRowData = null;
  let config_name = 'eightYearClock';
  let api_cache_name = 'eightYearClockRowData';
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
    let args = {config_name, adminData, globalData, access_token, opusPersonId};
    Logic = new Clock(args);
    getRowDataFromCache = !!apiResults;
    done();
  });


  it('setLogicClassVariables()', () => {
    Logic.setLogicClassVariables({opusPersonId: 1234, unitType: 1});

    assert.equal(Logic.opusPersonId, 1234);
    assert.equal(Logic.unitType, 1);
  });

  it('getDataUrlParameters()', () => {
    Logic.setLogicClassVariables({opusPersonId, access_token});


    let data = Logic.getDataUrlParameters();
    assert.equal(data.opusPersonId, opusPersonId);
    assert.equal(data.access_token, access_token);
  });


  it('canEditClockTable() is true for edit', () => {
    let newAdminData = {resourceMap: {'8_year_clock_edit_modal': {action: 'edit'}}};
    let canEdit = Logic.canEditClockTable(newAdminData);

    assert.isTrue(canEdit);
  });

  it('canEditClockTable() cannot edit as edit is false', () => {
    let newAdminData = {resourceMap: {'8_year_clock_edit_modal': {action: 'view'}}};
    let canEdit = Logic.canEditClockTable(newAdminData);

    assert.isFalse(canEdit);
  });

  it('canEditClockTable() is false cus no 8 year clock resource', () => {
    let newAdminData = {resourceMap: {}};
    let canEdit = Logic.canEditClockTable(newAdminData);

    assert.isFalse(canEdit);
  });

  it('configureEditabilityViaDataTableConfiguration()', () => {
    let newAdminData = {resourceMap: {'8_year_clock_edit_modal': {action: 'edit'}}};
    let dataTableConfiguration = {columnKeys: ['edit', 'delete']};

    Logic.configureEditabilityViaDataTableConfiguration(dataTableConfiguration,
      newAdminData);

    assert.include(dataTableConfiguration.columnKeys, 'edit');
  });

  it('configureEditabilityViaDataTableConfiguration()', () => {
    let newAdminData = {resourceMap: {'8_year_clock_edit_modal': {action: 'view'}}};
    let dataTableConfiguration = {columnKeys: ['edit', 'delete']};

    Logic.configureEditabilityViaDataTableConfiguration(dataTableConfiguration,
      newAdminData);

    assert.notInclude(dataTableConfiguration.columnKeys, 'edit');
  });

  it('removeEditColumnFromDataTableConfig()', () => {
    let dataTableConfiguration = {columnKeys: ['edit', 'delete']};

    Logic.removeEditColumnFromDataTableConfig(dataTableConfiguration);

    assert.notExists(dataTableConfiguration.columnKeys.edit);
  });

  it('createFieldData()', () => {
    let dataTableConfiguration = {
      fieldDataNames: ['serviceUnitType', 'outcome', 'effectiveDate'],
      columnConfiguration: {serviceUnitType: {displayName: 'Service Unit Type'},
        effectiveDate: {displayName: 'Effective Date'}}};

    let fieldData = Logic.createFieldData(dataTableConfiguration);

    assert.deepEqual(fieldData, {serviceUnitType: {displayName: 'Service Unit Type'},
      effectiveDate: {displayName: 'Effective Date'}});
  });

  it('extractValueFromRowDataByPath()', () => {
    let field = {pathsInAPI: {appointment: {value: 'salaryInfo.salary'}}};
    let template = {originalData: {salaryInfo: {salary: 100}}};

    let value = Logic.extractValueFromRowDataByPath(field, template);
    assert.equal(value, 100);
  });

  it('getFormattedDateValueInField()', () => {
    let field = {editConfiguration: {date: {fromDateFormat: 'YYYY-MM-DD',
      toDateFormat: 'MM/DD/YYYY'}}};
    let date = Logic.getFormattedDateValueInField(field, '2018-12-12');

    assert.equal(date, '12/12/2018');
  });

  it('attachRowValuesToFieldData()', () => {
    let fieldData = {
      unitAYTotalCount: {pathsInAPI: {appointment: {value: 'unitAYTotalCount'}}},
      effectiveDate: {pathsInAPI: {appointment: {value: 'effectiveDate'}},
      editConfiguration: {date: {fromDateFormat: 'YYYY-MM-DD', toDateFormat:
          'MM/DD/YYYY'}}}};
    let personData = {originalData: {unitAYTotalCount: 2, effectiveDate: '2018-12-12'}};

    Logic.attachRowValuesToFieldData(fieldData, personData);

    assert.equal(fieldData.unitAYTotalCount.value, 2);
    assert.equal(fieldData.effectiveDate.value, '12/12/2018');
  });

  it('getArchivedMessage()', () => {
    let message = Logic.getArchivedMessage();
    assert.equal(message, `This table is displayed for historical/audit purposes only - the
    appointee is not currently accruing time on the clock.`);
  });


  it('getServiceUnitTypeOptions()', () => {
    let {serviceUnitTypeMap} = dtConstants;

    let options = Logic.getServiceUnitTypeOptions(serviceUnitTypeMap);

    assert.deepEqual(options, [{1: 'Month'}, {2: 'Semester'}]);
  });

  it('attachServiceUnitTypeOptions()', () => {
    let fieldData = {serviceUnitType: {}};
    let {serviceUnitTypeMap} = dtConstants;

    Logic.attachServiceUnitTypeOptions(fieldData, serviceUnitTypeMap);

    assert.deepEqual(fieldData.serviceUnitType.options, [{1: 'Month'},
      {2: 'Semester'}]);
  });

  it('extractFieldDataValues()', () => {
    let fieldData = {school: {value: 'Ucla'}, departmentName: {value: 'Art'}};

    let extracted = Logic.extractFieldDataValues(fieldData);
    assert.deepEqual(extracted, {school: 'Ucla', departmentName: 'Art'});
  });

  it('createSaveTemplate()', () => {
    let fieldData = {serviceUnitType: {value: 3}, outcomeDate: {value: '12/12/2012'}};
    let personRowData = {opusPersonId: 1234, affiliation: 'Primary'};

    let saveTemplate = Logic.createSaveTemplate(fieldData, personRowData);
    let extracted = {serviceUnitType: {serviceUnitTypeId: 3}, outcomeDate: '12/12/2012'};

    let testTemplate = {...personRowData, ...extracted};

    assert.deepEqual(testTemplate, saveTemplate);
  });

  it('getSaveTemplateUrl()', () => {
    let saveDataUrl = '/restServices/rest/profile/save8YearClock';
    let dataTableConfiguration = {saveDataUrl};

    let url = Logic.getSaveTemplateUrl(dataTableConfiguration, access_token);

    let testUrl = `${saveDataUrl}?access_token=${access_token}`;

    assert.equal(url, testUrl);
  });

  //Not testing promises
  it('saveData()', () => {

  });
});
