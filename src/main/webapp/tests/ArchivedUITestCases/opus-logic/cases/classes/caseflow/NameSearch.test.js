import {assert} from 'chai';
import {every} from 'lodash';

import * as testHelpers from '../../../../test-utility/helpers';
import {constants} from '../../../../test-utility/testing-constants';
import NameSearch from '../../../../../opus-logic/cases/classes/caseflow/NameSearch';


describe('NameSearch Logic Class in CaseFlow', () => {
  //let getRowDataFromCache = false;
  let adminData = null;
  let globalData = null;
  let apiResults = null;
  let access_token = null;
  let NameSearchLogic = null;
  let reformattedResults = null;
  let searchString = 'cuff';
  let apiCacheName = 'nameSearchAPIResults';
  let person_label = 'Cuff,  Dana, dcuff@aud.ucla.edu';

  /**
   *
   * @desc - Lets get access token and adminData before tests start
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getCacheDataAndCommonCallData(apiCacheName);

    apiResults = data.apiResults;
    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;
    NameSearchLogic = new NameSearch({globalData, adminData, access_token});

    done();
  });
  //
  // it('ensures access_token, adminData, & globalData are in NameSearchLogic', () => {
  //   let keys = ['access_token', 'adminData', 'globalData', 'grouperPathText'];
  //   assert.containsAllKeys(NameSearchLogic, keys);
  //   assert.isObject(NameSearchLogic.adminData);
  //   assert.isObject(NameSearchLogic.globalData);
  //   assert.isString(NameSearchLogic.access_token);
  //   assert.isString(NameSearchLogic.grouperPathText);
  // });
  //
  // it('ensures starting NameSearch static variables are correct', () => {
  //   assert.equal(NameSearch.noResults, 'No Results Found');
  // });
  //
  // it('ensures starting NameSearch instance variables are correct', () => {
  //   assert.equal(NameSearchLogic.label_key, 'label');
  //   assert.equal(NameSearchLogic.person_key, 'person');
  //   assert.isObject(NameSearchLogic.person);
  //   assert.isObject(NameSearchLogic.currentNameSearchResults);
  //   assert.isObject(NameSearchLogic.formattedNamesToDataHash);
  //   assert.isArray(NameSearchLogic.appointmentInfo);
  //   assert.isArray(NameSearchLogic.appointmentSetList);
  //   assert(NameSearchLogic.formattedNamesSet instanceof Set,
  //     '"formattedNamesSet" is not a "Set"');
  // });
  //
  // it(`getPossibleNamesUrlAndArgs() gets person data array for "${searchString}"`,
  //   async (done) => {
  //     let {karmaAliasBaseUrl} = constants;
  //     let {url, args} = NameSearchLogic.getPossibleNamesUrlAndArgs(searchString);
  //
  //     let full_url = karmaAliasBaseUrl + url;
  //     if(!apiResults) {//If  no api results get them and save to cache
  //       apiResults = await testHelpers.fetchJson(full_url, args);
  //       testHelpers.postAPIDataToCache(apiResults, apiCacheName);
  //     }
  //
  //     assert.isArray(apiResults);
  //     assert(apiResults.length > 0, 'Array should not be empty');
  //
  //     done();
  //   });
  //
  // //Not testing promises
  // it('fetchPossibleNames() ', () => {});
  //
  // it('reformatNameSearchResults() reformats apiResults w/ correct keys', () => {
  //   reformattedResults = NameSearchLogic.reformatNameSearchResults(apiResults);
  //
  //   assert.isArray(reformattedResults);
  //   assert(reformattedResults.length > 0, 'Array should not be empty');
  //   let sampleResult = reformattedResults[0];
  //   assert.hasAllKeys(sampleResult, ['email', 'label', 'opusId', 'person', 'value']);
  // });
  //
  //
  // it('ensures reformatted apiResult value types are correct', () => {
  //   let {email, label, value, opusId, person} = reformattedResults[0];
  //   assert.isString(email);
  //   assert.isString(label);
  //   assert.isString(value);
  //   assert.isNumber(opusId);
  //   assert.isObject(person);
  // });
  //
  // it(`isNameInSet() tests ${person_label} name in "formattedNamesSet"`, () => {
  //   NameSearchLogic.setAndSaveReformattedNameDataFromAPI(apiResults);
  //   let isInSet = NameSearchLogic.isNameInSet(person_label);
  //   assert.isTrue(isInSet);
  // });
  //
  // it(`personHasValidAppts() tests ${person_label} has valid appointments`, () => {
  //   NameSearchLogic.setAndSaveReformattedNameDataFromAPI(apiResults);
  //   let person = NameSearchLogic.getPersonApptDataFromName(person_label);
  //   let hasValidAppts = NameSearchLogic.personHasValidAppts(person);
  //   assert.isTrue(hasValidAppts);
  // });
  //
  // it('method "getNameResultsSet" sets "formattedNamesSet" in NameSearch Instance', () => {
  //   let nameSet = NameSearchLogic.getNameResultsSet(reformattedResults);
  //   NameSearchLogic.setNameResultsSet = nameSet;
  //
  //   assert(NameSearchLogic.formattedNamesSet instanceof Set);
  // });
  //
  // it(`getFormattedNamesToDataHash() sets "formattedNamesToDataHash"
  //     in NameSearch Instance`, () => {
  //   let formattedNamesToDataHash = NameSearchLogic.getFormattedNamesToDataHash(apiResults);
  //   NameSearchLogic.setFormattedNameToDataHash = formattedNamesToDataHash;
  //
  //   assert.isObject(NameSearchLogic.formattedNamesToDataHash);
  // });
  //
  // it(`method "getCompleteNameResultsData" ensures correct data is being
  //     returned`, () => {
  //   let {formattedNamesToDataHash, nameSet, nameOptions}
  //     = NameSearchLogic.getCompleteNameResultsData(reformattedResults);
  //
  //   assert(nameSet instanceof Set);
  //   assert.isObject(formattedNamesToDataHash);
  //   assert(every(nameOptions, String), 'Not all name options are String');
  // });
  //
  // it(`setAndSaveReformattedNameDataFromAPI() sets "formattedNamesToDataHash"
  //     and "formattedNamesSet" from raw API results in NameSearch Instance`, () => {
  //   //Resets 'formattedNamesToDataHash' & 'formattedNamesSet' to null
  //   NameSearchLogic.setFormattedNameToDataHash = null;
  //   NameSearchLogic.setNameResultsSet = null;
  //
  //   NameSearchLogic.setAndSaveReformattedNameDataFromAPI(apiResults);
  //
  //   assert.isObject(NameSearchLogic.formattedNamesToDataHash);
  //   assert(NameSearchLogic.formattedNamesSet instanceof Set);
  // });
  //
  // it('setAndSaveReformattedNameDataFromAPI() returns correct data', () => {
  //   let {formattedNamesToDataHash, nameSet, nameOptions, reformattedNameSearchResults}
  //     = NameSearchLogic.setAndSaveReformattedNameDataFromAPI(apiResults);
  //
  //   assert(nameSet instanceof Set);
  //   assert.isObject(formattedNamesToDataHash);
  //   assert.isArray(reformattedNameSearchResults);
  //   assert.isObject(reformattedNameSearchResults[0]);
  //   assert(every(nameOptions, String), 'Not all name options are String');
  // });
  //
  //
  // it('getPersonApptDataFromName() gets selected person by name & appt info', () => {
  //   NameSearchLogic.setAndSaveReformattedNameDataFromAPI(apiResults);
  //   let {label} = reformattedResults[0];
  //   let person = NameSearchLogic.getPersonApptDataFromName(label);
  //   let keys = ['appointmentSetList', 'appointmentInfo', 'appointeeInfo'];
  //   assert.hasAllKeys(person, keys);
  //   let {appointmentSetList, appointmentInfo, appointeeInfo} = person;
  //   assert.isObject(appointeeInfo);
  //   assert.isArray(appointmentInfo);
  //   assert.isArray(appointmentSetList);
  // });
});
