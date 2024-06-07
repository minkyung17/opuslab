import {assert} from 'chai';
import {difference} from 'lodash';


//My imports
import '../../../test-utility/setup-tests';
import * as tableTests from './DataTable.common';
import {constants} from '../../../test-utility/testing-constants';
import * as util from '../../../../opus-logic/common/helpers/';
import * as testHelpers from '../../../test-utility/helpers';
//import {DEBUG} from '../../../../opus-logic/common/helpers/';
import AcademicHistory from '../../../../opus-logic/datatables/classes/AcademicHistory';
// import {config as dataTableConfiguration} from
//   '../../../../opus-logic/datatables/constants/AcademicHistoryConstants';


describe('AcademicHistory Logic Class', () => {
  let opusPersonId = 3093;
  let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let Logic = null;
  let apiResults = null;
  let rowData = null;
  let pristineRowData = null;
  let config_name = 'academicHistory';
  let api_cache_name = 'academicHistoryRowData';
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
    Logic = new AcademicHistory({...args, opusPersonId});
    getRowDataFromCache = !!apiResults;
    done();
  });


  it('ensures "startLogic" was executed and variables were set', () => {
    let keys = ['access_token', 'adminData', 'globalData', 'opusPersonId'];
    assert.containsAllKeys(Logic, keys);
    assert.equal(Logic.opusPersonId, opusPersonId);
  });

  it('gets results from API', async (done) => {
    Logic.prependUrl = '/tomcat';
    apiResults = await tableTests.getAPIResults(Logic,
      {programTestData, getRowDataFromCache, api_cache_name, apiResults});

    assert.isArray(apiResults);
    done();
  });

  it('ensures the extracted rowData is an array of results', () => {
    rowData = apiResults;
    assert.isArray(rowData);
    assert(rowData.length > 0, 'rowData from server is BLANK!!');
  });

  it(`ensures "getRowDataUrl" return correctly formatted url via "opusPersonId"
  & "prependUrl"`, () => {
    let prependUrl = 'randomTextUrl';
    let rowDataUrl = Logic.getRowDataUrl({opusPersonId, prependUrl});
    let testUrl = `${prependUrl}/restServices/rest/profile/${opusPersonId}/academicHistory/`;
    assert.equal(testUrl, rowDataUrl);
  });

  it('ensures "configureAPITableData" has necessary "columnKeys"', () => {
    pristineRowData = util.cloneObject(rowData);
    pristineRowData = Logic.configureAPITableData(pristineRowData);
    let {columnKeys} = Logic.dataTableConfiguration;

    pristineRowData.map(each => {
      assert.containsAllKeys(each, columnKeys);
    });
  });


  it('ensures "configureAPITableData" has necessary "columnKeys"', () => {
    pristineRowData = util.cloneObject(rowData);
    pristineRowData = Logic.configureAPITableData(pristineRowData);
    let {columnKeys} = Logic.dataTableConfiguration;

    pristineRowData.map(each => {
      assert.containsAllKeys(each, columnKeys);
    });
  });

  it('ensures "doesHaveCaseSummaryLink" returns if link should be created', () => {
    let shouldHaveLink = Logic.doesHaveCaseSummaryLink({caseId: 1,
      actionCategoryId: 2, actionTypeId: 10});
    assert.isTrue(shouldHaveLink);

    shouldHaveLink = Logic.doesHaveCaseSummaryLink({caseId: null,
      actionCategoryId: 2, actionTypeId: 10});
    assert.isFalse(shouldHaveLink);

    shouldHaveLink = Logic.doesHaveCaseSummaryLink({caseId: 1,
      actionCategoryId: null, actionTypeId: 10});
    assert.isFalse(shouldHaveLink);

    shouldHaveLink = Logic.doesHaveCaseSummaryLink({caseId: 1,
      actionCategoryId: 2, actionTypeId: null});
    assert.isFalse(shouldHaveLink);

    shouldHaveLink = Logic.doesHaveCaseSummaryLink({actionCategoryId: 2,
      actionTypeId: 10});
    assert.isFalse(shouldHaveLink);
  });


  it('ensures "createActionTypeLinkArgs" returns if correct link', () => {
    let {editCasesUrl} = Logic.dataTableConfiguration;
    let caseId = 100;
    let args = {actionCategoryId: 2, actionTypeId: 10};
    let testLink = `${editCasesUrl}${caseId}&${util.jsonToUrlArgs(args)}`;
    let formattedLink = Logic.createActionTypeLinkArgs(editCasesUrl, {caseId,
      ...args});
    assert.equal(testLink, formattedLink);
  });

  it('"reconcileRowValuesFromServerData"', () => {

  });


  it('ensures "addActionTypeLinks" correctly adds links', () => {
    pristineRowData = util.cloneObject(rowData);
    pristineRowData = Logic.addActionTypeLinks(pristineRowData);
    for(let row of pristineRowData) {
      let {caseId, actionCategoryId, actionTypeId} = row;
      let hasLink = Logic.doesHaveCaseSummaryLink({caseId, actionCategoryId,
        actionTypeId});
      if(hasLink) {
        assert.isString(row.link);
        assert(row.link.length > 20, 'No link here');
      }
    }
  });

  it('ensures "configureData" correctly adds links', () => {
    pristineRowData = util.cloneObject(rowData);
    pristineRowData = Logic.addActionTypeLinks(pristineRowData);
    for(let row of pristineRowData) {
      let {caseId, actionCategoryId, actionTypeId} = row;
      let hasLink = Logic.doesHaveCaseSummaryLink({caseId, actionCategoryId,
        actionTypeId});
      if(hasLink) {
        assert.isString(row.link);
        assert(row.link.length > 20, 'No link here');
      }
    }
  });
});
