import {assert} from 'chai';
import {difference} from 'lodash';

//My imports
import '../../test-utility/setup-tests';
import * as util from '../../../opus-logic/common/helpers/';
import * as tableTests from '../datatables/classes/DataTable.common';
// import * as commonTests from './DataTable.common1';
import * as testHelpers from '../../test-utility/helpers';
// import {constants} from '../../test-utility/testing-constants';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import ReopenCase from '../../../opus-logic/cases-admin/ReopenCase';
import {config as dataTableConfiguration} from
  '../../../opus-logic/datatables/constants/ActiveCasesConstants';


describe('ReopenCase Logic', () => {
  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let ReopenCaseLogic = null;
  let apiResults = null;
  let rowData = null;
  // let pristineRowData = null;
  let config_name = 'completedCases';
  let api_cache_name = 'completedCasesRowData';
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
    ReopenCaseLogic = new ReopenCase(args);
    getRowDataFromCache = !!apiResults;
    done();
  });


  it('ensures config_name = "completedCases" ', () => {
    assert.equal(config_name, 'completedCases');
  });

  it('ensures access_token & adminData are in ReopenCaseLogic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    assert.containsAllKeys(ReopenCaseLogic, keys);
  });

  // describe('placeholder', () => {
  //
  //   commonTests.firstTests(ActiveCasesLogic, {adminData, globalData, access_token,
  //     config_name});
  // });

  it('ensures "getDataUrlParameters" returns requisite keys', () => {
    let urlParameters = ReopenCaseLogic.getDataUrlParameters();
    assert.isString(urlParameters.access_token);
    assert.isAbove(urlParameters.access_token.length, 20);
    assert.isString(urlParameters.grouperPathText);
    assert.equal(urlParameters.pageName, 'Completed');
    assert.containsAllKeys(urlParameters, [
      'access_token', 'grouperPathText', 'pageName'
    ]);
  });

  /****************************************************************************
   *
   * @desc - Reopen Logic tests
   *
   ****************************************************************************/
   it('gets results from API', async (done) => {
     apiResults = await tableTests.getAPIResults(ReopenCaseLogic,
       {programTestData, getRowDataFromCache, api_cache_name, apiResults});
     done();
   });

   it('ensures the extracted rowData is Correct', () => {
     rowData = tableTests.extractRowData(ReopenCaseLogic,
       {apiResults});
     // pristineRowData = util.cloneObject(rowData);
   });

   it('ensures the "reopenCasePermissions" has correct permissions', ()=>{
     let {adminData: {adminName: user}} = ReopenCaseLogic;
     rowData = ReopenCaseLogic.configureAPITableData(rowData);

     for(let row of rowData) {
       let reopenLogicPermissions = ReopenCaseLogic.reopenCasePermissions(row.originalData);
       let permissions = false;
       if(row.originalData.actionStatusId === 2 && row.originalData.rowStatusId === 2){
         permissions = true;
       }
       assert.equal(reopenLogicPermissions, permissions)
     }
   });

  it('ensures the "retrieveReopenCaseParameters" has requisite keys', ()=>{

    for(let row of rowData) {
      let urlParameters = ReopenCaseLogic.retrieveReopenCaseParameters(
        row, 'yes', 'comment');
      assert.isNumber(urlParameters.caseId, 'No caseId');
      assert.isDefined(urlParameters.bycPacketId);
      assert.equal(urlParameters.userComment, 'comment')
    }

  });

  it('ensures the "formatReopenCaseUrl" has requisite keys', ()=>{
    let {adminData: {adminName: user}} = ReopenCaseLogic;
    for(let row of rowData) {
      let url = ReopenCaseLogic.formatReopenCaseUrl(row);
      assert.isString(ReopenCaseLogic.access_token);
      assert.isString(user);
      assert.isString(url);
      assert.isAbove(url.length, 10);
    }
  });

  //Cant test this function. Will end up reopening a case every time
  it('tests "ReopenCase" ', ()=>{

  });
});
