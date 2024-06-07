 import axios from 'axios';
import {assert} from 'chai';
import {hash as rsvpHash} from 'rsvp';


//My import
import '../../../../test-utility/setup-tests';
import * as testHelpers from '../../../../test-utility/helpers';
import * as util from '../../../../../opus-logic/common/helpers';
import {constants} from '../../../../test-utility/testing-constants';
import AppointmentSets from '../../../../../opus-logic/cases/classes/profile/AppointmentSets';
import {urlConfig, profileSaveTemplate, profileConstants}
  from '../../../../../opus-logic/cases/constants/profile/ProfileConstants';
import {urls} from '../../../../../opus-logic/cases/constants/CasesConstants';

describe('Profile Appointment Sets Logic Class', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    apiNameSearchResults: 'profile.nameSearchResults',
    apiApptData: 'profile.apptDataByOpusId'
  };
  let opusPersonId = 7612; //Benjamin Wu's id
  let nameString = 'sam';
  let nameSearchResults = null;
  let appointmentInfoList = null;
  let appointeeInfo = null;
  let appointmentData = null;
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let Logic = null;


  // /**
  //  *
  //  * @desc - Lets get access token and adminData to instantiate class
  //  * @param {Function} done - when 'done' is executed all the tests will start
  //  *
  //  **/
  // beforeAll(async (done) => {
  //   let data = await testHelpers.getAccessTokenAdminDataGlobalData();
  //
  //   adminData = data.adminData;
  //   globalData = data.globalData;
  //   access_token = data.access_token;
  //   Logic = new AppointmentSets({globalData, adminData, access_token});
  //
  //   done();
  // });
  //
  // /**
  //  *
  //  * @desc - Get cache data of nameSearchResults and apptData
  //  * @param {Function} done - when 'done' is executed all the tests will start
  //  *
  //  **/
  // beforeAll(async (done) => {
  //   let {apiNameSearchResults, apiApptData} = cachePaths;
  //   let data = await rsvpHash({
  //     nameSearchResults: testHelpers.getAPIDataFromCache(apiNameSearchResults),
  //     apptData: testHelpers.getAPIDataFromCache(apiApptData)
  //   });
  //   appointmentData = data.apptData;
  //   nameSearchResults = data.nameSearchResults;
  //   done();
  // });
  //
  // /************************** RETRIEVE API DATA FIRST *************************/
  // it(`getNameOptionsUrl() gets names results ${nameString}`, async (done) => {
  //   let url = Logic.getNameOptionsUrl(nameString);
  //   let {apiNameSearchResults} = cachePaths;
  //
  //   //Get nameSearchResults from API
  //   if(!nameSearchResults.length) {
  //     let apiUrl = karmaAliasBaseUrl + url;
  //     let {data} = await axios.get(apiUrl);
  //     nameSearchResults = data;
  //     testHelpers.postAPIDataToCache(nameSearchResults, apiNameSearchResults);
  //   }
  //
  //   assert.isArray(nameSearchResults);
  //   assert.isAtLeast(nameSearchResults.length, 1, `May have no results for \
  //     ${nameString} or wrong implementation of Profile nameSearch`);
  //   done();
  // });
  //
  // it('"getProfileDataUrlByOpusId" gets appointmentData & caches it', async (done) => {
  //   let {apiApptData} = cachePaths;
  //
  //   if(!appointmentData) {
  //     let apptDataUrl = Logic.getProfileDataUrlByOpusId(opusPersonId, 'active');
  //     let apiUrl = karmaAliasBaseUrl + apptDataUrl;
  //     let {data} = await axios.get(apiUrl);
  //     appointmentData = data;
  //     testHelpers.postAPIDataToCache(appointmentData, apiApptData);
  //   }
  //
  //   appointeeInfo = appointmentData.appointeeInfo;
  //   appointmentInfoList = appointmentData.appointmentInfoList;
  //
  //   assert.isObject(appointeeInfo);
  //   assert.isObject(appointmentData);
  //   assert.isArray(appointmentInfoList);
  //   assert.isObject(appointmentInfoList[0], 'No appointments to run tests!');
  //   done();
  // });
  // // /************************** END OF API DATA RETRIEVAL*************************/
  //
  // it('"startLogic" was run in constructor & set class variables', () => {
  //   assert.isObject(Logic.adminData);
  //   assert.isString(Logic.grouperPathText);
  //   assert.isObject(Logic.globalData);
  //   assert.isString(Logic.access_token);
  // });
  //
  // it('getGrouperPathText() runs in constructor & set class variables', () => {
  //   let grouperPathText = Logic.getGrouperPathText(adminData);
  //
  //   const permissions_text = profileConstants.view_permissions;
  //   const permissions = adminData.resourceMap[permissions_text];
  //   const testGrouperPathText = permissions.formattedGrouperPathTexts;
  //
  //   assert.equal(grouperPathText, Logic.grouperPathText);
  //   assert.equal(grouperPathText, testGrouperPathText);
  //   assert.equal(testGrouperPathText, Logic.grouperPathText);
  // });
  //
  // it('getLoggedInUserInfo()', () => {
  //   let loggedInUserInfo = Logic.getLoggedInUserInfo(adminData);
  //
  //   let testLoggedInUserInfo = util.cloneObject(adminData);
  //   delete testLoggedInUserInfo.adminDepartments;
  //
  //   assert.deepEqual(loggedInUserInfo, testLoggedInUserInfo);
  // });

  it(`getAppointmentSetData() gets correct results`, async () => {
    // // TODO: Backend API does not let test localhost:9876 to hit this api
    // let promise = Logic.getAppointmentSetData(opusPersonId, access_token);
    // let results = await promise;
    // assert.isObject(results);
    // done();
  });

  it(`getAppointmentSetDropdownOptionsFromAPI() gets correct results`, async () => {
    // // TODO: Backend API does not let test localhost:9876 to hit this api
    // let promise = Logic.getAppointmentSetDropdownOptionsFromAPI(opusPersonId, access_token);
    // let results = await promise;
    // assert.isObject(results);
    // done();
  });

});
