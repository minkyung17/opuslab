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
import DeleteOrWithdrawCase from '../../../opus-logic/cases-admin/DeleteOrWithdrawCase';
import {config as dataTableConfiguration} from
  '../../../opus-logic/datatables/constants/ActiveCasesConstants';


describe('DeleteOrWithdrawCase Logic', () => {
  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let DeleteOrWithdrawCaseLogic = null;
  let apiResults = null;
  let rowData = null;
  // let pristineRowData = null;
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
    DeleteOrWithdrawCaseLogic = new DeleteOrWithdrawCase(args);
    getRowDataFromCache = !!apiResults;
    done();
  });


  it('ensures config_name = "activeCases" ', () => {
    assert.equal(config_name, 'activeCases');
  });

  it('ensures access_token & adminData are in DeleteOrWithdrawCaseLogic', () => {
    let keys = ['access_token', 'adminData', 'globalData'];
    assert.containsAllKeys(DeleteOrWithdrawCaseLogic, keys);
  });

  // describe('placeholder', () => {
  //
  //   commonTests.firstTests(ActiveCasesLogic, {adminData, globalData, access_token,
  //     config_name});
  // });

  it('ensures "getDataUrlParameters" returns requisite keys', () => {
    let urlParameters = DeleteOrWithdrawCaseLogic.getDataUrlParameters();
    assert.isString(urlParameters.access_token);
    assert.isAbove(urlParameters.access_token.length, 20);
    assert.isString(urlParameters.grouperPathText);
    assert.equal(urlParameters.pageName, 'Active');
    assert.containsAllKeys(urlParameters, [
      'access_token', 'grouperPathText', 'pageName'
    ]);
  });

  /****************************************************************************
   *
   * @desc - delete or withdraw Logic tests
   *
   ****************************************************************************/
   it('gets results from API', async (done) => {
     apiResults = await tableTests.getAPIResults(DeleteOrWithdrawCaseLogic,
       {programTestData, getRowDataFromCache, api_cache_name, apiResults});
     done();
   });

   it('ensures the extracted rowData is Correct', () => {
     rowData = tableTests.extractRowData(DeleteOrWithdrawCaseLogic,
       {apiResults});
     // pristineRowData = util.cloneObject(rowData);
   });

   it('ensures "formatActionsLinkedToByCCase" returns correct array', () => {
     rowData = DeleteOrWithdrawCaseLogic.configureAPITableData(rowData);
     let correctArray = true;
     for(let row of rowData) {
       if(row.originalData.actionLinkedToByCCase){
         let linkedActions = DeleteOrWithdrawCaseLogic.formatActionsLinkedToByCCase(row.originalData.actionLinkedToByCCase);
         let linkedActionstoCompareWith = [];
         let splitData = row.originalData.actionLinkedToByCCase.split('|');
         splitData = splitData.join(",").split(',');
         for(let i = 0; i<splitData.length; i+=4){
           let splitDataObject = {
             action: splitData[i],
             effectiveDate: splitData[i+1],
             proposedEffectiveDate: splitData[i+2],
             status: splitData[i+3]
           }
           linkedActionstoCompareWith.push(splitDataObject);
          }
          // Does not like comparing 2 arrays so needed to compare individual fields
          for(let each in linkedActions){
            if(linkedActions[each].action!==linkedActionstoCompareWith[each].action){
              correctArray = false;
              break;
            }
            if(linkedActions[each].effectiveDate!==linkedActionstoCompareWith[each].effectiveDate){
              correctArray = false;
              break;
            }
            if(linkedActions[each].proposedEffectiveDate!==linkedActionstoCompareWith[each].proposedEffectiveDate){
              correctArray = false;
              break;
            }
            if(linkedActions[each].status!==linkedActionstoCompareWith[each].status){
              correctArray = false;
              break;
            }
          }
        }
     }
     assert.isTrue(correctArray);
   });

  it('ensures the "retrieveDeleteOrWithdrawCaseParameters" has requisite keys', ()=>{

    for(let row of rowData) {
      let urlParameters = DeleteOrWithdrawCaseLogic.retrieveDeleteOrWithdrawCaseParameters(
        row);
      assert.isNumber(urlParameters.caseId, 'No caseId');
      assert.isDefined(urlParameters.bycPacketId);
    }

  });

  it('ensures the "formatDeleteOrWithdrawCaseUrl" has requisite keys', ()=>{
    let {adminData: {adminName: user}} = DeleteOrWithdrawCaseLogic;
    for(let row of rowData) {
      let url = DeleteOrWithdrawCaseLogic.formatDeleteOrWithdrawCaseUrl(row);
      assert.isString(DeleteOrWithdrawCaseLogic.access_token);
      assert.isString(user);
      assert.isString(url);
      assert.isAbove(url.length, 10);
    }
  });

  //Cant test this function. Will end up deleting/withdrawing a case every time
  it('tests "delete or withdraw" ', ()=>{

  });
});
