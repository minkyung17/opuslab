import axios from 'axios';
import {assert} from 'chai';
import {hash as rsvpHash} from 'rsvp';


//My import
import '../../../../test-utility/setup-tests';
import {constants} from '../../../../test-utility/testing-constants';
import * as util from '../../../../../opus-logic/common/helpers';
import Profile from '../../../../../opus-logic/cases/classes/profile/Profile';
import ProfileToggle from '../../../../../opus-logic/cases/classes/toggles/ProfileToggle';
import * as testHelpers from '../../../../test-utility/helpers';
import {urlConfig, profileSaveTemplate, profileConstants}
  from '../../../../../opus-logic/cases/constants/profile/ProfileConstants';
import {urls} from '../../../../../opus-logic/cases/constants/CasesConstants';

describe('ProfileToggle Logic Class', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    profileAppt: '',
    apiApptData: 'profileToggleAppt'
  };
  let opusPersonId = 25634; //John S Adams id
  let nameString = 'sam';
  let nameSearchResults = null;
  let appointmentInfoList = null;
  let appointeeInfo = null;
  let appointmentData = null;
  let singleAppointment = null;
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let ProfileLogic = null;
  let Logic = null;

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
    ProfileLogic = new Profile({globalData, adminData, access_token});
    Logic = new ProfileToggle({globalData, adminData, access_token});
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
    appointmentData = await testHelpers.getAPIDataFromCache(apiApptData);
    done();
  });

  /************************** RETRIEVE API DATA FIRST *************************/
  it('"getProfileDataUrlByOpusId" gets appointmentData & caches it', async (done) => {
    let {apiApptData} = cachePaths;

    if(!appointmentData) {
      let apptDataUrl = ProfileLogic.getProfileDataUrlByOpusId(opusPersonId, 'active');
      let apiUrl = karmaAliasBaseUrl + apptDataUrl;
      let {data} = await axios.get(apiUrl);
      appointmentData = data;

      testHelpers.postAPIDataToCache(appointmentData, apiApptData);
    }

    appointeeInfo = appointmentData.appointeeInfo;
    appointmentInfoList = appointmentData.appointmentInfoList;
    singleAppointment = appointmentInfoList[2];
    assert.isObject(appointeeInfo);
    assert.isObject(appointmentData);
    assert.isArray(appointmentInfoList);
    assert.isObject(appointmentInfoList[0], 'No appointments to run tests!');
    done();
  });
  // /************************** END OF API DATA RETRIEVAL*************************/
  function getAffiliationDataArgsForAPI_test(appointment) {
    let fieldData = ProfileLogic.createFieldDatafromAppointment(appointment);

    let affiliationArgs = Logic.getAffiliationDataArgsForAPI(fieldData,
      singleAppointment, ProfileLogic.formattedCommonCallLists);

    let {affiliation, affiliationTypeId, appointmentCategoryId} = affiliationArgs;

    //Extract affiliation to test against
    let {affiliationType} = appointment;

    assert.equal(affiliation, affiliationType.affiliation);
    assert.equal(affiliationTypeId, affiliationType.affiliationTypeId);

    //If its a Primary appointment the appointmentCategoryId always = "1"
    if(affiliation === 'Primary') {
      assert.equal(appointmentCategoryId, '1');
    } else if(affiliationType.appointmentCategoryId){
      //Otherwise these two values will be equal
      assert.equal(appointmentCategoryId, affiliationType.appointmentCategoryId);
    }
  }

  it('"constructor" ', () => {
    assert.equal(Logic.adminData, adminData);
    assert.equal(Logic.access_token, access_token);
    assert.equal(Logic.globalData, globalData);
  });

  it('"getAffiliationDataArgsForAPI" correctly tests appt affiliations', () => {
    appointmentInfoList.map(appt => getAffiliationDataArgsForAPI_test(appt));
  });


  it('"updateWaiverEndDt" hides waiverEndDt on Primary Affiliation', () => {
    let fieldData = {waiverEndDt: {}, affiliation: {value: '1:1'}};

    Logic.updateWaiverEndDt(fieldData, 'affiliation');

    assert.isNull(fieldData.waiverEndDt.value);
  });

  it('"updateWaiverEndDt" hides waiverEndDt on Additional - Split', () => {
    let fieldData = {waiverEndDt: {}, affiliation: {value: '2:3'}};

    Logic.updateWaiverEndDt(fieldData, 'affiliation');

    assert.isNull(fieldData.waiverEndDt.value);
  });

  it('"getAffiliationDataArgsForAPI"', () => {
    let fieldData = {affiliation: {value: '2:3'}};
    let commonCallLists = {affiliationIdToText: {'2:3': 'Additional-Split'}};

    let {affiliation, affiliationTypeId, appointmentCategoryId} =
      Logic.getAffiliationDataArgsForAPI(fieldData, {}, commonCallLists);

    assert.equal(affiliation, 'Additional-Split');
    assert.equal(appointmentCategoryId, '3');
    assert.equal(affiliationTypeId, '2');
  });

  it('"updateWaiverEndDt" doesnt change values', () => {
    let fieldData = {waiverEndDt: {value: '01/01/2001'}, affiliation: {value: '2:2'}};

    Logic.updateWaiverEndDt(fieldData, 'affiliation');

    assert.equal(fieldData.waiverEndDt.value, '01/01/2001');
  });

  it('"getAffiliationDataUrl" gets correct affiliation API url', () => {
    let fieldData = ProfileLogic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let affiliationArgs = Logic.getAffiliationDataArgsForAPI(fieldData,
      appointmentInfoList[0], ProfileLogic.formattedCommonCallLists);

    let {affiliation, affiliationTypeId, appointmentCategoryId}
      = affiliationArgs;

    let url = Logic.getAffiliationDataUrl({affiliation, affiliationTypeId,
      appointmentCategoryId});

    let testUrl = `/restServices/rest/profile/affiliation/${affiliation}/` +
    `${affiliationTypeId}/${appointmentCategoryId}?access_token=${access_token}`;

    assert.equal(url, testUrl);
  });

  it('"hideWaiverExpirationDateIfNull" changes visibility to false if value is null',
  () => {
    let fieldData = {waiverEndDt: {value: null}};

    Logic.hideWaiverExpirationDateIfNull(fieldData);

    assert.isFalse(fieldData.waiverEndDt.visibility);
  });

  it('"hideWaiverExpirationDateIfNull" leaves visibility as true for valid value',
  () => {
    let fieldData = {waiverEndDt: {visibility: true, value: '01/01/2001'}};

    Logic.hideWaiverExpirationDateIfNull(fieldData);

    assert.isTrue(fieldData.waiverEndDt.visibility);
  });

  //Not testing promise
  it('"getAffiliationDataFromAPI" gets correct data', () => {});


  //Functions are tested in "getAffiliationDataArgsForAPI" & "getAffiliationDataUrl"
  it('"getApptFromAffiliationChange" gets correct data', () => {});

});
