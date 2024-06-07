import {assert} from 'chai';
import {difference} from 'lodash';


//My imports
import '../../../test-utility/setup-tests';
import * as tableTests from './DataTable.common';
import {constants as dtConstants} from './datatable-testing-constants';
import {constants} from '../../../test-utility/testing-constants';
import * as util from '../../../../opus-logic/common/helpers/';
import * as testHelpers from '../../../test-utility/helpers';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import ExcellenceClock from '../../../../opus-logic/datatables/classes/ExcellenceClock';
// import {config as dataTableConfiguration} from
//   '../../../../opus-logic/datatables/constants/AcademicHistoryConstants';


describe('ExcellenceClock Logic Class', () => {
  let opusPersonId = 65274;
  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let Logic = null;
  let apiResults = null;
  let rowData = null;
  let pristineRowData = null;
  let config_name = 'excellenceClock';
  let api_cache_name = 'excellenceClockRowData';
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
    Logic = new ExcellenceClock(args);
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

  it('getArchivedMessage tests opusPersonContAppArchived as true for message',
  () => {
    let opusPersonContAppArchived = true;
    let message = Logic.getArchivedMessage(opusPersonContAppArchived);

    assert.equal(message, `This table is displayed for historical/audit purposes only - the
    appointee is not currently accruing time on the clock.`);
  });

  it('getArchivedMessage tests opusPersonContAppArchived as false for message',
  () => {
    let opusPersonContAppArchived = false;
    let message = Logic.getArchivedMessage(opusPersonContAppArchived);

    assert.isNull(message);
  });

  it('initExcellenceClockPage', () => {
    let profileAPIData = {appointeeInfo: {fullName: 'Mrs. Opus'}};
    let id = '1234';
    let {serviceUnitTypeMap} = dtConstants;
    let person = [{originalData: {serviceUnitTypeMap}}];

    let data = Logic.initExcellenceClockPage(profileAPIData, {opusPersonId: id,
      rowData: person});

    let {fullName, fieldData} = data;

    assert.equal(fullName, profileAPIData.appointeeInfo.fullName);
    assert.isObject(fieldData);

    //Making sure fieldData has fields
    assert.isAtLeast(Object.keys(fieldData).length, 3);
  });

  it('initiallyFormatDataTableConfiguration() making sure this function executes',
  () => {
    let dtConfig = Logic.initiallyFormatDataTableConfiguration({adminData,
      globalData});
    assert.containsAllKeys(dtConfig, ['columnKeys', 'columnConfiguration']);

    //already tested super.initiallyFormatDataTableConfiguration
    //already tested this.configureEditabilityViaDataTableConfiguration
  });

  it('getDepartmentNameFromRowData', () => {
    let row = {originalData: {appointmentInfo: {academicHierarchyInfo: {departmentName: 'Art'}}}};

    let deptName = Logic.getDepartmentNameFromRowData(row);

    assert.equal(deptName, row.originalData.appointmentInfo.academicHierarchyInfo.departmentName);
  });

  it('getDepartmentNameFromRowData', () => {
    let row = null;

    let deptName = Logic.getDepartmentNameFromRowData(row);

    assert.equal(deptName, '');
  });


  it('ensures "getRowDataByAHPathID" correctly separates rowData by ahPathId', () => {
    pristineRowData = util.cloneObject(rowData);

    let path = 'appointmentInfo.academicHierarchyInfo.academicHierarchyPathId';
    let pristineRowDataByAHPathId = Logic.getRowDataByAHPathID(pristineRowData,
      path);

    //Make sure ahPath id is actually a finite number
    for(let ahPathId in pristineRowDataByAHPathId) {
      assert.isFinite(Number(ahPathId), 'Is not valid number');
    }

    //Make sure ahPathId result is an object
    for(let ahPathId in pristineRowDataByAHPathId) {
      let rowDataByAHPath = pristineRowDataByAHPathId[ahPathId];
      assert.isArray(rowDataByAHPath);
      rowDataByAHPath.map(row => assert.isObject(row));
    }
  });

  it('ensures "getTableDataByAHPathId" gets correctly formatted "ahPathIDs" ', () => {
    pristineRowData = util.cloneObject(rowData);
    let tempData = pristineRowData.map((originalData) => {return {originalData};});
    let path = 'originalData.appointmentInfo.academicHierarchyInfo.academicHierarchyPathId';
    let tableData = Logic.getTableDataByAHPathId(tempData, path);
    let {ahPathIDs} = tableData;
    assert.isArray(ahPathIDs);
    ahPathIDs.map(id => assert.isFinite(Number(id)));
  });

  it('ensures "getTableDataByAHPathId" gets correct "dataByAHPathID" ', () => {
    pristineRowData = util.cloneObject(rowData);
    let tempData = pristineRowData.map((originalData) => {return {originalData}});
    let path = 'originalData.appointmentInfo.academicHierarchyInfo.academicHierarchyPathId';
    let tableData = Logic.getTableDataByAHPathId(tempData, path);
    let {dataByAHPathID} = tableData;

    for(let ahId in dataByAHPathID) {
      //is it a valid number
      assert.isFinite(Number(ahId));
      let {maxRowCount, rowData: separatedRowData} = dataByAHPathID[ahId];

      //Verify rowData and maxRowCount are equal
      assert.equal(separatedRowData.length, maxRowCount);

      //Make sure I have an array of objects
      separatedRowData.map(row => assert.isObject(row));
    }
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


  it('ensures "getRowDataByAHPathID" gets correct "rowDataByAHPathID"', () => {
    let path = 'originalData.academicHierarchyPathId';
    let tempRowData = pristineRowData.map(e => { return {originalData: e};});
    let {rowDataByAHPathID} = Logic.getTableDataByAHPathId(tempRowData, path);

    //Make sure ahPath id is actually a finite number
    for(let ahPathId in rowDataByAHPathID) {
      assert.isFinite(Number(ahPathId), 'Is not valid number');
    }

    //Make sure ahPathId result is an object
    for(let ahPathId in rowDataByAHPathID) {
      let rowDataByAHPath = rowDataByAHPathID[ahPathId];
      assert.isArray(rowDataByAHPath);
      rowDataByAHPath.map(row => assert.isObject(row));
    }
  });


  it('ensures "configureAPITableData" has necessary "columnKeys"', () => {
    pristineRowData = util.cloneObject(rowData);
    pristineRowData = Logic.configureAPITableData(pristineRowData);
    let {columnKeys, omitUIColumns} = Logic.dataTableConfiguration;
    let columnsName = difference(columnKeys, omitUIColumns);

    pristineRowData.map(each => {
      assert.containsAllKeys(each, columnsName);
    });
  });
});
