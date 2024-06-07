import {assert} from 'chai';

import * as testHelpers from '../../../../test-utility/helpers';
import {constants} from '../../../../test-utility/testing-constants';
import Recruit from '../../../../../opus-logic/cases/classes/caseflow/Recruit';
import AppointmentBlock from '../../../../../opus-logic/cases/modules/AppointmentBlock';

describe('Recruit Logic Class in CaseFlow', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    apiJobSearchData: 'recruit.jobSearchData',
    apiCheckUIDData: 'recruit.checkUIDData'
  };
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let jobSearchDataFromAPI = null;
  let checkUIDDatafromAPI = null;

  let RecruitLogic = null;
  let ApptBlock = null;
  let jobNumber = 'JPF00198';
  let jobNumberResults = null;
  let uid = '904886355';
  let uidResults = null;
  let isValidUID = null;

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

    RecruitLogic = new Recruit({globalData, adminData, access_token});
    ApptBlock = new AppointmentBlock();

    done();
  });

  /**
   *
   * @desc - Get cache data of jobData and checkUIDData
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let {apiJobSearchData, apiCheckUIDData} = cachePaths;
    jobSearchDataFromAPI = await testHelpers.getAPIDataFromCache(apiJobSearchData);
    jobNumberResults = jobSearchDataFromAPI;

    checkUIDDatafromAPI = await testHelpers.getAPIDataFromCache(apiCheckUIDData);
    uidResults = checkUIDDatafromAPI;
    done();
  });

  it('ensures that searchJobNumber() returns list of names associated with the jobNumber',
    async (done) => {
      let {apiJobSearchData} = cachePaths;

      let prependUrl = karmaAliasBaseUrl;
      if (!jobNumberResults) {
        jobNumberResults = await RecruitLogic.searchJobNumber(jobNumber, prependUrl);
        testHelpers.postAPIDataToCache(jobNumberResults, apiJobSearchData);
      }

      assert.isArray(jobNumberResults);

      let jobSearchResultKeys = ['applicantId', 'contactValue', 'employeeType', 'eppn', 'firstName', 'fullName',
        'hireDt', 'hrStatus', 'jobNumber', 'lastName', 'mergeOpusId', 'mergeOpusIdFlag', 'middleName',
        'officialEmail', 'opusEmail', 'opusPersonId', 'opusStatus', 'uclaLogonId', 'uid'];
      for (let jobNumberResult of jobNumberResults) {
        assert.containsAllKeys(jobNumberResult, jobSearchResultKeys);
      }
      done();
    });

  it('ensures that getFormattedJobSearchResults() formats the results correctly', () => {
    let nameToDataOptions = RecruitLogic.getFormattedJobSearchResults(jobNumberResults);
    assert.isObject(nameToDataOptions);

    let fullNameKeys = [];
    for (let record of jobNumberResults) {
      fullNameKeys.push(record.fullName);
    }
    assert.containsAllKeys(nameToDataOptions, fullNameKeys);
  });

  it(`ensures getRecruitInstructionText() returns text representing the instructionText
    text based on the results`, () => {
    let recruitInstructionText = RecruitLogic.getRecruitInstructionText(jobNumberResults);
    let text = jobNumberResults.length > 0
      ? 'Please choose a person:' :
      'No results for this job number.';
    assert.isString(recruitInstructionText);
    assert.equal(recruitInstructionText, text);
  });

  it('ensures checkUID() returns an object representing the person by UID',
    async (done) => {
      let {apiCheckUIDData} = cachePaths;

      let prependUrl = karmaAliasBaseUrl;
      if (!uidResults) {
        uidResults = await RecruitLogic.checkUID(uid, prependUrl);
        testHelpers.postAPIDataToCache(uidResults, apiCheckUIDData);
      }

      let keys = ['appointmentInfo', 'appointeeInfo'];
      assert.hasAllKeys(uidResults, keys);

      let {appointeeInfo} = uidResults;
      assert.isObject(appointeeInfo);
      done();
  });

  it('ensures getAppointeeInfo() returns an appointeeInfo object by result',
    () => {
      let appointeeInfo = RecruitLogic.getAppointeeInfo(uidResults);
      assert.isObject(appointeeInfo);
      assert.deepEqual(uidResults.appointeeInfo, appointeeInfo);
  });

  it('ensures getValidUID() returns a boolean based on mergeOpusId',
    () => {
      isValidUID = RecruitLogic.getValidUID(uidResults.appointeeInfo.mergeOpusId);
      let invalid = {null: true, '': true};
      let testResult = uidResults.appointeeInfo.mergeOpusId in invalid ? false : true;
      assert.isBoolean(isValidUID);
      assert.equal(isValidUID, testResult);
  });

  it('ensures getUIDStatusText() returns a String based on uidResult',
    () => {
      let statusText = RecruitLogic.getUIDStatusText(isValidUID);
      let text = isValidUID ? 'UID found' :
        `We have no record of an Opus appointment with this UID.
        Opus will associate this UID with the appointment you\'re
        creating for integration with other campus systems.`;
      assert.isString(statusText);
      assert.equal(statusText, text);
  });

  // it('ensures getAppointmentBlocks() returns an Object based on appointmentInfo',
  //   () => {
  //     let appointmentBlock = RecruitLogic.getAppointmentBlocks(uidResults.appointmentInfo);
  //     assert.isArray(appointmentBlock);
  //
  //     let apptKeys = ['appointment',
  //       'appointmentStatusType',
  //       'appointmentId',
  //       'departmentTitle',
  //       'apuId',
  //       'title',
  //       'titleCode',
  //       'payrollTitle',
  //       'departmentCode',
  //       'affiliation',
  //       'series',
  //       'rank',
  //       'step',
  //       'appointmentPctTime',
  //       'currentSalaryAmt',
  //       'appointmentEndDt'];
  //     for (let appt of appointmentBlock) {
  //       assert.containsAllKeys(appt, apptKeys);
  //     }
  // });
});
