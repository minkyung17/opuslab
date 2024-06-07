import axios from 'axios';
import {assert} from 'chai';
import {values, keys, entries, get} from 'lodash';

//Testing imports
import '../../../../test-utility/setup-tests';
import * as testHelpers from '../../../../test-utility/helpers';
import {constants} from '../../../../test-utility/testing-constants';

//
import * as commonTests from '../Cases.common';
import * as caseSummaryCommonTests from './CaseSummary.common';
import * as util from '../../../../../opus-logic/common/helpers';
import FieldData from '../../../../../opus-logic/common/modules/FieldData';
import {fieldsInAPI} from '../../../../../opus-logic/cases/constants/FieldDataConstants';
import {urls, actionDataTemplate, constants as caseConstants} from
  '../../../../../opus-logic/cases/constants/CasesConstants';
import {constants as caseSummaryConstants} from
  '../../../../../opus-logic/cases/constants/case-summary/CaseSummaryConstants';
import ProposedFields from '../../../../../opus-logic/cases/classes/case-summary/ProposedFields';

describe('ProposedFields(Case Summ.) Logic Class', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    apiApptData: 'caseSummary.proposedFields.apiData'
  };

  //Case specific fields
  let caseId = 4191;
  let actionDataInfo = null;
  let appointeeInfo = null;
  let appointmentData = null;
  let casesProposedAttrMap = null;
  let casesApprovedAttrMap = null;
  let caseSummaryDataFromAPI = null;
  let opusCaseInfo = null;

  //Common test variables
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let Logic = null;
  let FieldDataLogic = new FieldData();


  /**
   *
   * @desc - Lets get access token and adminData to instantiate class
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getAccessTokenAdminDataGlobalData();

    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;
    Logic = new ProposedFields({globalData, adminData, access_token, caseId});

    done();
  });

  /**
   *
   * @desc - Get cache data of nameSearchResults and apptData
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let {apiApptData} = cachePaths;
    caseSummaryDataFromAPI = await testHelpers.getAPIDataFromCache(apiApptData);
    appointmentData = caseSummaryDataFromAPI;
    done();
  });


  /************************** RETRIEVE API DATA FIRST *************************/
  it('getCasesSummaryData() gets appointmentData & caches it', async (done) => {
    let {apiApptData} = cachePaths;

    if(!appointmentData) {
      let apptDataUrl = Logic.getCaseSummaryDataAPIUrl();
      let apiArgs = Logic.getCaseSummaryDataAPIArgs(caseId);
      let apiUrl = karmaAliasBaseUrl + apptDataUrl;
      let {data} = await axios.get(apiUrl, {params: apiArgs});
      appointmentData = data;
      testHelpers.postAPIDataToCache(appointmentData, apiApptData);
    }

    opusCaseInfo = appointmentData.opusCaseInfo;
    appointeeInfo = appointmentData.appointeeInfo;
    actionDataInfo = appointmentData.actionDataInfo;
    casesProposedAttrMap = appointmentData.casesProposedAttrMap;
    casesApprovedAttrMap = appointmentData.casesApprovedAttrMap;
    done();
  });
  // /************************** END OF API DATA RETRIEVAL*************************/

  it('ensures "appointmentData" is correct', () => {
    assert.isObject(appointeeInfo);
    assert.isObject(appointmentData);
    assert.isArray(actionDataInfo);
    assert.isObject(casesProposedAttrMap);
    assert.isObject(casesApprovedAttrMap);
    assert.isObject(actionDataInfo[0], 'No appointments to run tests!');
  });


  it('createProposedActionFieldData() correctly creates proposed action fields', () => {
    let proposedAction = Logic.createProposedActionFieldData(actionDataInfo,
      casesProposedAttrMap);

    let section = 'proposedAction';
    //Ensure they are all actually proposedAction fields
    Object.values(proposedAction).map(({attributeProperties: {sectionName}}) =>
      assert.equal(sectionName, section));

    //Test if values in fieldData are the same as in actionDataInfo
    caseSummaryCommonTests.addValuesToFieldData(Logic, proposedAction, actionDataInfo[0]);
    commonTests.reformatDisplayValuesBasedOnViewType(Logic, proposedAction,
      actionDataInfo[0]);
  });

  it('hasProposedStatusFields() returns correct booleans', () => {
    //Get if there are proposedStatus fields from attributeProperties
    let hasFields = Logic.hasProposedStatusFields(casesProposedAttrMap);

    let attributes = Object.values(casesProposedAttrMap).filter(e =>
      e.sectionName === 'proposedStatus');

    //If there are proposedStatus fields then its true
    let testHasFields = !!attributes.length;
    assert.equal(hasFields, testHasFields);
  });

  it('createProposedStatusFieldData() correctly creates proposed status fields', () => {
    //Create and formats fields with values and options
    let proposedStatus = Logic.createProposedStatusFieldData(actionDataInfo[0],
      casesProposedAttrMap);

    //Ensure they are all actually proposedAction fields
    let section = 'proposedStatus';
    Object.values(proposedStatus).map(({attributeProperties: {sectionName}}) =>
      assert.equal(sectionName, section));

    let actionData = actionDataInfo[0];

    //Test if values in fieldData are the same as in actionDataInfo
    caseSummaryCommonTests.addValuesToFieldData(Logic, proposedStatus, actionData);

    //Make sure the display values are formatted with '$', '%', etc
    commonTests.reformatDisplayValuesBasedOnViewType(Logic, proposedStatus, actionData);

    //Add select options to all fields
    commonTests.addOptionsListToFieldData(Logic, proposedStatus);

    //Check if step's options are correct
    commonTests.addStepOptionsByTitleCodeValue(Logic, proposedStatus);
  });

  it('createProposedStatusFieldDataByApptId() keys fields by appointmentId ', () => {
    let proposedStatusFieldsDataByApptId = Logic.createProposedStatusFieldDataByApptId(
      actionDataInfo, casesProposedAttrMap);

    //Make sure all appointment ids are keys in "proposedStatusFieldsDataByApptId"
    for(let {appointmentInfo: {appointmentId}} of actionDataInfo) {
      assert.isTrue(appointmentId in proposedStatusFieldsDataByApptId,
        `${appointmentId} not "proposedStatusFieldsDataByApptId"`);
    }
  });


  it('createProposedStatusFieldDataByApptId() keys proposedStatus fields by apptId', () => {
    let proposedStatusFieldsDataByApptId = Logic.createProposedStatusFieldDataByApptId(
      actionDataInfo, casesProposedAttrMap);

    //Filter out array of proposedStatus field names
    //All fieldNames here MUST be in "proposedStatusFieldsDataByApptId"
    let fieldNames = keys(casesProposedAttrMap).filter(name =>
      casesProposedAttrMap[name].sectionName === 'proposedStatus');

    //Make sure all appointment ids are keys in "proposedStatusFieldsDataByApptId"
    for(let id in proposedStatusFieldsDataByApptId) {
      let fieldData = proposedStatusFieldsDataByApptId[id];
      assert.containsAllKeys(fieldData, fieldNames);
    }
  });

  it('createProposedActionAndStatusFieldsFromAttrProps() creates action fields', () => {
    let fields = Logic.createProposedActionAndStatusFieldsFromAttrProps(casesProposedAttrMap);
    let {proposedAction} = fields;

    let testSectionName = 'proposedAction';
    for(let [, {attributeProperties: {sectionName}}] of entries(proposedAction)) {
      assert.equal(sectionName, testSectionName);
    }
  });

  it('createProposedActionAndStatusFieldsFromAttrProps() creates status fields', () => {
    let fields = Logic.createProposedActionAndStatusFieldsFromAttrProps(casesProposedAttrMap);
    let {proposedStatus} = fields;

    let testSectionName = 'proposedStatus';
    for(let [, {attributeProperties: {sectionName}}] of entries(proposedStatus)) {
      assert.equal(sectionName, testSectionName);
    }
  });

  it('ensures getSaveHeaders() returns correct headers', () => {
    let headers = Logic.getSaveHeaders();
    assert.deepEqual(headers, caseConstants.saveOptions.urlEncodedHeaders);
  });


  it('ensures getSaveProposedActionUrl() is correct', () => {
    let propActionUrl = Logic.getSaveProposedActionUrl();
    let testUrl = caseSummaryConstants.urls.saveProposedAction + access_token;
    assert.equal(propActionUrl, testUrl);
  });

  it('getProposedActionSaveTemplate() gets formatted template w/ variables', () => {
    let testValue = 5;
    let {proposedAction} = Logic.createProposedActionAndStatusFieldsFromAttrProps(
      casesProposedAttrMap);

    //Create template the first time without any values
    let template = Logic.getProposedActionSaveTemplate(proposedAction);

    //Ensure values in template are not equal to "testValue"
    for(let [, {attributeProperties: {pathToFieldValue}}] of entries(proposedAction)) {
      let value = get(template, pathToFieldValue);
      assert.notEqual(value, testValue);
    }

    //Fill proposedAction fields with "testValue"
    for(let name in proposedAction) {
      proposedAction[name].value = testValue;
      proposedAction[name].editable = true;
      proposedAction[name].visibility = true;
    }

    //Get new template with proposedAction values
    template = Logic.getProposedActionSaveTemplate(proposedAction, caseId);

    //Ensure template values are equal
    for(let [, {attributeProperties: {pathToFieldValue}}] of entries(proposedAction)) {
      let templateValue = get(template, pathToFieldValue);
      assert.equal(templateValue, testValue);
    }

    //Assert last two values match
    assert.equal(template.user, adminData.adminName);
    assert.equal(template.caseId, caseId);
  });


  //1. Not testing promises. 2. All functions here tested elsewhere
  it('saveProposedAction() ', () => {});


  it('formatProposedStatusTemplate() tests addApuCodeToApptByFieldDataApuId()', () => {
    //Create and formats fields with values and options
    let actionData = util.cloneObject(actionDataInfo[0]);
    let proposedStatus = Logic.createProposedStatusFieldData(actionData,
      casesProposedAttrMap);

    //Put apuCode in fieldData
    let validTestApuCode = '1400AD';
    proposedStatus.apuCode.value = validTestApuCode;
    proposedStatus.apuCode.editable = true;
    proposedStatus.apuCode.visibility = true;

    let template = Logic.formatProposedStatusTemplate(proposedStatus, actionData,
      {appointeeInfo, opusCaseInfo});

    commonTests.addApuCodeToApptByFieldDataApuId(Logic, proposedStatus,
      template.actionData.proposedAppointmentInfo);
  });


  it('formatProposedStatusTemplate() tests addAHPathAndDeptCodeToApptFromFieldData()', () => {
    //Create and formats fields with values and options
    let actionData = util.cloneObject(actionDataInfo[0]);
    let proposedStatus = Logic.createProposedStatusFieldData(actionData,
      casesProposedAttrMap);

    //Put ahPathId in fieldData
    let validTestAHPathID = '2';
    proposedStatus.departmentCode.value = validTestAHPathID;
    proposedStatus.departmentCode.editable = true;
    proposedStatus.departmentCode.visibility = true;

    let template = Logic.formatProposedStatusTemplate(proposedStatus, actionData,
      {appointeeInfo, opusCaseInfo});

    commonTests.addAHPathAndDeptCodeToApptFromFieldData(Logic, proposedStatus,
      template.actionData.proposedAppointmentInfo);
  });

  it('formatProposedStatusTemplate() tests addFieldValuesToActionData()', () => {
    //Create and formats fields with values and options
    let actionData = util.cloneObject(actionDataInfo[0]);
    let proposedStatus = Logic.createProposedStatusFieldData(actionData,
      casesProposedAttrMap);

    let template = Logic.formatProposedStatusTemplate(proposedStatus, actionData,
      {appointeeInfo, opusCaseInfo});


    //Delete deptCode since deptCode has ahPathId and not deptCode value
    delete proposedStatus.departmentCode;

    //Iterate status fields to ensure value is the same as those of actionData
    for(let [, fields] of Object.entries(proposedStatus)) {
      let {editable, visibility, attributeProperties: {pathToFieldValue}} = fields;

      //Must be editable and visible to test
      if(editable && visibility) {
        let templateValue = get(template.actionData, pathToFieldValue);
        assert.equal(fields.value, templateValue);
      }
    }
  });

  it('formatProposedStatusTemplate() ensures data in template it correct', () => {
    //Create and formats fields with values and options
    let actionData = util.cloneObject(actionDataInfo[0]);
    let proposedStatus = Logic.createProposedStatusFieldData(actionData,
      casesProposedAttrMap);

    let template = Logic.formatProposedStatusTemplate(proposedStatus, actionData,
      {appointeeInfo, opusCaseInfo});

    //Ensure values in template equal original from caseSummaryAPIData
    let loggedInUserInfo = commonTests.populateLoggedInUserInfoWithAdminData(Logic);

    //Ensure returned values in template match with expected values
    assert.deepEqual(template.loggedInUserInfo, loggedInUserInfo);
    assert.deepEqual(template.appointeeInfo, appointeeInfo);
    assert.equal(template.actionData.sectionName, 'proposed');
    assert.equal(template.actionData.caseId, caseId);
  });

  it('ensures getSaveProposedStatusUrl() is correct', () => {
    let propStatusUrl = Logic.getSaveProposedStatusUrl();
    let testUrl = caseSummaryConstants.urls.saveProposedStatus + access_token;

    let testStringUrl = '/restServices/rest/activecase/saveAction?access_token='
      + access_token;

    assert.equal(propStatusUrl, testUrl);
    assert.equal(propStatusUrl, testStringUrl);
  });

  //1. Not testing promises. 2. All functions here tested elsewhere
  it('saveProposedStatus() ', () => {});
});
