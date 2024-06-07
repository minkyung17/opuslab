import axios from 'axios';
import {assert} from 'chai';
import {hash as rsvpHash} from 'rsvp';


//My import
import '../../../../test-utility/setup-tests';
import * as commonTests from '../Cases.common';
import {constants} from '../../../../test-utility/testing-constants';
import NewProfile from '../../../../../opus-logic/cases/classes/profile/NewProfile';
import FieldData from '../../../../../opus-logic/common/modules/FieldData';
import * as util from '../../../../../opus-logic/common/helpers';
import * as testHelpers from '../../../../test-utility/helpers';
import {urlConfig, profileSaveTemplate, profileConstants}
  from '../../../../../opus-logic/cases/constants/profile/ProfileConstants';
import {urls} from '../../../../../opus-logic/cases/constants/CasesConstants';

describe('NewProfile Logic Class', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    apiNameSearchResults: 'profile.nameSearchResults',
    apiApptData: 'profile.apptDataByOpusId'
  };
  let opusPersonId = 16930; //Dana Cuffs id
  let nameString = 'sam';
  let nameSearchResults = null;
  let appointmentInfoList = null;
  let appointeeInfo = null;
  let appointmentData = null;
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let Logic = null;
  //let fieldData = null;
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
    Logic = new NewProfile({globalData, adminData, access_token});

    done();
  });

  /**
   *
   * @desc - Get cache data of nameSearchResults and apptData
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let {apiNameSearchResults, apiApptData} = cachePaths;
    let data = await rsvpHash({
      nameSearchResults: testHelpers.getAPIDataFromCache(apiNameSearchResults),
      apptData: testHelpers.getAPIDataFromCache(apiApptData)
    });
    appointmentData = data.apptData;
    nameSearchResults = data.nameSearchResults;
    done();
  });

  it('getAffiliationList() ', () => {
    let affiliationTypeList = [
      {affiliation: 'Primary', affiliationTypeId: '1', appointmentCategoryId: '1'},
      {affiliation: 'Additional', affiliationTypeId: '2', appointmentCategoryId: '-1'},
      {affiliation: 'Additional - Split', affiliationTypeId: '2', appointmentCategoryId: '2'}
    ];

    let filtered = Logic.getAffiliationList(affiliationTypeList);

    let testAffiliationList = [{'1:1': 'Primary'}, {'2:-1': 'Additional'}];

    assert.deepEqual(filtered, testAffiliationList);
  });

  it('"showViewAddNewProfileWarning" is false when "appointmentInfoList"'
    + 'is not null', () => {
    let mockProfileData = {appointmentInfoList: []};
    let showAddNewWarning = Logic.showViewAddNewProfileWarning(mockProfileData);
    assert.isFalse(showAddNewWarning);
  });

  it('ensures "showViewAddNewProfileWarning" is true when "appointmentInfoList"'
    + 'is null', () => {
    let mockProfileData = {appointmentInfoList: null};
    let showAddNewWarning = Logic.showViewAddNewProfileWarning(mockProfileData);
    assert.isTrue(showAddNewWarning);
  });

  it('getAddNewUrl() ', () => {
    let newApptUrl = Logic.getAddNewUrl(opusPersonId);

    let testUrl = `/restServices/rest/profile/${opusPersonId}/appointment?` +
      `access_token=${access_token}`;
    assert.equal(testUrl, newApptUrl);
  });

  it('getSaveNewAppointmentUrl() ', () => {
    let saveApptUrl = Logic.getSaveNewAppointmentUrl(opusPersonId);

    let testUrl = `/restServices/rest/profile/${opusPersonId}/appointment?` +
      `access_token=${access_token}`;
    assert.equal(testUrl, saveApptUrl);
  });

  //Not testing promises
  it('getNewAppointmentProfileData() ', () => {
    //already tested by this.getAddNewUrl
  });
});
