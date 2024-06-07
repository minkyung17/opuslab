 import {assert} from 'chai';
import {difference, get} from 'lodash';


//My imports
import '../../../test-utility/setup-tests';
import * as tableTests from './DataTable.common';
import {constants} from '../../../test-utility/testing-constants';
import * as util from '../../../../opus-logic/common/helpers/';
import * as testHelpers from '../../../test-utility/helpers';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import EightYearClock from '../../../../opus-logic/datatables/classes/EightYearClock';
import {eightYearClockValidations} from
  '../../../../opus-logic/datatables/constants/EightYearClockConstants';
// import {config as dataTableConfiguration} from
//   '../../../../opus-logic/datatables/constants/AcademicHistoryConstants';


describe('EightYearClock Logic Class', () => {
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
    Logic = new EightYearClock(args);
    getRowDataFromCache = !!apiResults;
    done();
  });


  it('ensures "startLogic" was executed and variables were set', () => {
    let keys = ['access_token', 'adminData', 'globalData', 'opusPersonId'];
    assert.containsAllKeys(Logic, keys);
  });


  it('gets results from API', async (done) => {
    Logic.prependUrl = '/tomcat';
    apiResults = await tableTests.getAPIResults(Logic,
      {programTestData, getRowDataFromCache, api_cache_name, apiResults});
    assert.isObject(apiResults);
    done();
  });

  it('ensures the extracted rowData is Correct', () => {
    let {dataTableConfiguration} = Logic;
    rowData = Logic.extractRowDataFromServerResults(apiResults,
      {dataTableConfiguration});
    assert.isArray(rowData);
    assert(rowData.length > 0, 'rowData from server is BLANK!!');
  });

  it('ensures "getDataUrlParameters" returns opusId and access_token', () => {
    let {opusPersonId: opusId, access_token: accessToken} = Logic.getDataUrlParameters();
    assert.isFinite(opusId);
    assert.equal(accessToken.length, 36);
  });

  it('initiallyFormatDataTableConfiguration() making sure this function executes',
  () => {
    let dtConfig = Logic.initiallyFormatDataTableConfiguration({adminData,
      globalData});
    assert.containsAllKeys(dtConfig, ['columnKeys', 'columnConfiguration']);

    //already tested super.initiallyFormatDataTableConfiguration
    //already tested this.configureEditabilityViaDataTableConfiguration
  });

  it('ensures "setValidationFunctions" adds functions for TOC Taken & Credited', () => {
    let {validationFunctions: {unitTOCTakenCount, unitTOCYearCount}} = Logic;
    let unitTOCYearCountValidations =
      eightYearClockValidations.unitTOCYearCount.onSaveValidations;
    let unitTOCTakenCountValidations = [Logic.tocTakenBelowTOCCredited];

    assert.deepEqual(unitTOCYearCount.onSaveValidations, unitTOCYearCountValidations);
    assert.deepEqual(unitTOCTakenCount.onSaveValidations, unitTOCTakenCountValidations);
  });

  it('"canEditClockTable" returns true for edit capability', () => {
    let mockAdminData = {resourceMap: {'8_year_clock_edit_modal': {action: 'edit'}}};
    let canEditClockTable = Logic.canEditClockTable(mockAdminData);

    assert.isTrue(canEditClockTable);
  });

  it('"canEditClockTable" returns false for edit capability', () => {
    let mockAdminData = {resourceMap: {'8_year_clock_edit_modal': {action: 'view'}}};
    let canEditClockTable = Logic.canEditClockTable(mockAdminData);

    assert.isFalse(canEditClockTable);
  });

  it('"setServiceUnitTypeValue" ', () => {
    let serviceUnitTypeId = 5;
    let mockFieldData = {serviceUnitType: {}};
    let mockRowData = {originalData: {serviceUnitType: {serviceUnitTypeId}}};

    Logic.setServiceUnitTypeValue(mockFieldData, mockRowData);

    assert.equal(mockFieldData.serviceUnitType.value, serviceUnitTypeId);
  });

  it('ensures "tocTakenBelowTOCCredited" validates TOC Credited and TOC Taken', () => {
    let fieldData = Logic.createFieldData();

    //Must set fieldData to Logic so unitTOCTakenCount will have a value to
    //compare to in the closure. Check "tocTakenBelowTOCCredited" to see
    Logic.setClassData({fieldData});
    let {unitTOCYearCount, unitTOCTakenCount} = fieldData;
    unitTOCYearCount.value = 1;
    unitTOCTakenCount.value = 20;

    let unitTOCTakenCountIsValid = Logic.tocTakenBelowTOCCredited(
      unitTOCTakenCount.value);

    assert.isFalse(unitTOCTakenCountIsValid);

    //Now lets get rid of the error w/ a good value
    unitTOCTakenCount.value = 0;
    unitTOCTakenCountIsValid = Logic.tocTakenBelowTOCCredited(
      unitTOCTakenCount.value);
    assert.isTrue(unitTOCTakenCountIsValid);
  });


  it('"getArchivedMessage" gets message based on input "true"', () => {
    let message = `This table is displayed for historical/audit purposes only - the
    appointee is not currently accruing time on the clock.`;
    let opusPersonTenureArchived = true;
    let testMessage = Logic.getArchivedMessage(opusPersonTenureArchived);

    assert.equal(message, testMessage);
  });

  it('"getArchivedMessage" gets null based on input "false"', () => {
    let opusPersonTenureArchived = false;
    let testMessage = Logic.getArchivedMessage(opusPersonTenureArchived);

    assert.equal(testMessage, null);
  });

  it('ensures "validateFieldData" validates TOC Credited and TOC Taken', () => {
    let fieldData = Logic.createFieldData();

    //Must set fieldData to Logic so unitTOCTakenCount will have a value to
    //compare to in the closure. Check "tocTakenBelowTOCCredited" to see
    Logic.setClassData({fieldData});
    let {unitTOCYearCount, unitTOCTakenCount} = fieldData;

    //Actually validate these fields
    Logic.validateFieldData(fieldData);

    unitTOCYearCount.value = 1000;
    unitTOCTakenCount.value = 2000;

    //After validation fields should have errors
    assert.isTrue(unitTOCYearCount.hasError);
    assert.isTrue(unitTOCTakenCount.hasError);

    //Fields will have these error messages
    assert.equal(unitTOCYearCount.error, 'Please enter a number from 0 to 2.');
    assert.equal(unitTOCTakenCount.error, 'Field cannot be greater than TOC Credited');

    //Now test for acceptable values
    unitTOCYearCount.value = 2;
    unitTOCTakenCount.value = 2;
    Logic.validateFieldData(fieldData);

    //Should have no errors
    assert.isFalse(unitTOCYearCount.hasError);
    assert.isFalse(unitTOCTakenCount.hasError);

    //No error messages
    assert.isNull(unitTOCYearCount.error);
    assert.isNull(unitTOCTakenCount.error);

    //Since we reset the values lets set them to bad values to check errors
    unitTOCYearCount.value = -1;
    Logic.validateFieldData(fieldData);
    assert.isTrue(unitTOCYearCount.hasError);
    assert.equal(unitTOCYearCount.error, 'Please enter a number from 0 to 2.');
  });


  /*****************************************************************************
   *
   * @desc - Common Clock tests. Mostly related to creating fieldData
   *
   *****************************************************************************/
  it('ensures "createFieldData" creates fieldData w/ correct keys', () => {
    let fieldData = Logic.createFieldData();
    let attributes = ['name', 'visible', 'viewType', 'displayName', 'editable'];
    let {fieldDataNames} = Logic.dataTableConfiguration;
    assert.containsAllKeys(fieldData, fieldDataNames);
    for(let [name, field] of Object.entries(fieldData)) {
      assert.isString(name);
      assert.isObject(field);

      //Makes sure field has all these attributes
      assert.containsAllKeys(field, attributes, `${name} has missing attributes`);
      assert.isBoolean(field.visible, '"visible" field is not boolean');
      assert.isString(field.viewType, '"viewType" field is not boolean');
      assert.isString(field.displayName, '"displayName" field is not string');
      assert.isBoolean(field.editable, '"editable" field is not boolean');
    }
  });

  it('extractValueFromRowDataByPath() correctly extracts data by path', () => {
    let date = '01/01/2020';
    let row = {originalData: {test: {road: date}}};
    let field = {pathsInAPI: {appointment: {value: 'test.road'}}};
    let dateValue = Logic.extractValueFromRowDataByPath(field, row);
    assert.equal(dateValue, date);
  });

  it('getFormattedDateValueInField()', () => {
    let date = '01/01/2020';
    let editConfiguration = {date: {fromDateFormat: 'MM/DD/YYYY',
      toDateFormat: 'MM-DD-YYYY'}};
    let field = {editConfiguration, pathsInAPI: {appointment: {value: 'test.road'}}};
    let dateValue = Logic.getFormattedDateValueInField(field, date);

    assert.equal(dateValue, '01-01-2020');
  });

  it('ensures "attachRowValuesToFieldData" correctly adds values to fieldData', () => {
    //Create test data
    let date = '01/01/2020';
    let correctDate = '01-01-2020';
    let row = {originalData: {test: {road: date}}};
    let editConfiguration = {date: {fromDateFormat: 'MM/DD/YYYY',
      toDateFormat: 'MM-DD-YYYY'}};
    let field = {editConfiguration, value: date,
      pathsInAPI: {appointment: {value: 'test.road'}}};

    //Actually test the function
    Logic.attachRowValuesToFieldData({field}, row);

    // let value = Logic.extractValueFromRowDataByPath(field, row);
    // value = Logic.getFormattedDateValueInField(field, value);

    assert.equal(correctDate, field.value);
  });

  it('attachRowValuesToFieldData tests setting serviceUnitType', () => {
    let fieldData = {
      serviceUnitType: {pathsInAPI: {appointment: {value: 'serviceUnitType'}}},
      unitAYTotalCount: {pathsInAPI: {appointment: {value: 'unitAYTotalCount'}}}
    };
    let personData = {originalData: {serviceUnitType: {serviceUnitTypeId: 3}, unitAYTotalCount: 1}};

    Logic.attachRowValuesToFieldData(fieldData, personData);

    assert.equal(fieldData.serviceUnitType.value, 3);
    assert.equal(fieldData.unitAYTotalCount.value, 1);
  });

  it('canEditTOC()', () => {
    let canEditTOC = Logic.canEditTOC();
    let {isOA, isAPO} = Logic.Permissions;
    let isOAOrAPO = isOA || isAPO;

    assert.equal(canEditTOC, isOAOrAPO);
  });


  it('ensures "getServiceUnitTypeOptions" gets correct serviceUnitType options', () => {
    let {serviceUnitTypeMap} = rowData[0];
    let serviceUnitTypeOptions = Logic.getServiceUnitTypeOptions(serviceUnitTypeMap);
    let testServiceUnitTypeOptions = [{'-1': ''}, {3: 'Month'},
      {1: 'Quarter'}, {2: 'Semester'}];

    assert.deepEqual(serviceUnitTypeOptions, testServiceUnitTypeOptions);
  });


  it('ensures "attachServiceUnitTypeOptions" adds correct options to serviceUnitType', () => {
    let {serviceUnitTypeMap} = rowData[0];
    let fieldData = Logic.createFieldData();
    Logic.attachServiceUnitTypeOptions(fieldData, serviceUnitTypeMap);
    let testServiceUnitTypeOptions = [{'-1': ''}, {3: 'Month'},
      {1: 'Quarter'}, {2: 'Semester'}];

    assert.deepEqual(fieldData.serviceUnitType.options, testServiceUnitTypeOptions);
  });

  it('ensures "extractFieldDataValues" returns hash of names to values', () => {
    let fieldData = Logic.createFieldData();
    Logic.attachRowValuesToFieldData(fieldData, {originalData: rowData[0]});

    //Get the extracted values
    let extractedValues = Logic.extractFieldDataValues(fieldData);

    //Iterate values to ensure they were correctly extracted from fieldData
    for(let [name, extractedValue] of Object.entries(extractedValues)) {
      let {value} = fieldData[name];
      assert.equal(extractedValue, value, `Extracted value of ${name} is wrong`);
    }
  });

  it('ensures "getSaveTemplateUrl" returns correct url', () => {
    let saveTemplateUrl = Logic.getSaveTemplateUrl();
    let testUrl = `/restServices/rest/profile/save8YearClock?access_token=${access_token}`;

    assert.equal(saveTemplateUrl, testUrl);
  });

  it('ensures "createSaveTemplate" returns correctTemplate of names to values', () => {
    let fieldData = Logic.createFieldData();
    Logic.attachRowValuesToFieldData(fieldData, {originalData: rowData[0]});
    let template = Logic.createSaveTemplate(fieldData, rowData[0]);

    //Make sure template values are the same as fieldData
    for(let name in fieldData) {
      if(name==='academicYear'){
        assert.equal(fieldData[name].value, template.appointmentInfo[name]);
      }else if(name==="serviceUnitType"){
        assert.equal(fieldData[name].value, template.serviceUnitType.serviceUnitTypeId);
      }else{
        assert.equal(fieldData[name].value, template[name]);
      }
    }

    //serviceUnitTypeId must be set to value of serviceUnitType
    assert.equal(fieldData.serviceUnitType.value, template.serviceUnitType.serviceUnitTypeId);
  });
});
