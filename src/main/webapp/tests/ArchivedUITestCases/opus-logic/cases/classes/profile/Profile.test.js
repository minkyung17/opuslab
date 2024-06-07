 import axios from 'axios';
import {assert} from 'chai';
import {hash as rsvpHash} from 'rsvp';


//My import
import '../../../../test-utility/setup-tests';
import * as commonTests from '../Cases.common';
import * as testHelpers from '../../../../test-utility/helpers';
import * as util from '../../../../../opus-logic/common/helpers';
import {constants} from '../../../../test-utility/testing-constants';
import FieldData from '../../../../../opus-logic/common/modules/FieldData';
import Profile from '../../../../../opus-logic/cases/classes/profile/Profile';
import {urlConfig, profileSaveTemplate, profileConstants}
  from '../../../../../opus-logic/cases/constants/profile/ProfileConstants';
import {urls} from '../../../../../opus-logic/cases/constants/CasesConstants';

describe('Profile Logic Class', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    apiNameSearchResults: 'profile.nameSearchResults',
    apiApptData: 'profile.apptDataByOpusId'
  };
  let opusPersonId = 7612;  //Benjamin Wu's id
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
    Logic = new Profile({globalData, adminData, access_token});

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


  /************************** RETRIEVE API DATA FIRST *************************/
  it(`getNameOptionsUrl() gets names results ${nameString}`, async (done) => {
    let url = Logic.getNameOptionsUrl(nameString);
    let {apiNameSearchResults} = cachePaths;

    //Get nameSearchResults from API
    if(!nameSearchResults.length) {
      let apiUrl = karmaAliasBaseUrl + url;
      let {data} = await axios.get(apiUrl);
      nameSearchResults = data;
      testHelpers.postAPIDataToCache(nameSearchResults, apiNameSearchResults);
    }

    assert.isArray(nameSearchResults);
    assert.isAtLeast(nameSearchResults.length, 1, `May have no results for \
      ${nameString} or wrong implementation of Profile nameSearch`);
    done();
  });

  it('"getProfileDataUrlByOpusId" gets appointmentData & caches it', async (done) => {
    let {apiApptData} = cachePaths;

    if(!appointmentData) {
      let apptDataUrl = Logic.getProfileDataUrlByOpusId(opusPersonId, 'active');
      let apiUrl = karmaAliasBaseUrl + apptDataUrl;
      let {data} = await axios.get(apiUrl);
      appointmentData = data;
      testHelpers.postAPIDataToCache(appointmentData, apiApptData);
    }

    appointeeInfo = appointmentData.appointeeInfo;
    appointmentInfoList = appointmentData.appointmentInfoList;

    assert.isObject(appointeeInfo);
    assert.isObject(appointmentData);
    assert.isArray(appointmentInfoList);
    assert.isObject(appointmentInfoList[0], 'No appointments to run tests!');
    done();
  });
  // /************************** END OF API DATA RETRIEVAL*************************/

  it('"startLogic" was run in constructor & set class variables', () => {
    assert.isObject(Logic.adminData);
    assert.isString(Logic.grouperPathText);
    assert.isObject(Logic.globalData);
    assert.isString(Logic.access_token);
  });

  it('getGrouperPathText() runs in constructor & set class variables', () => {
    let grouperPathText = Logic.getGrouperPathText(adminData);

    const permissions_text = profileConstants.view_permissions;
    const permissions = adminData.resourceMap[permissions_text];
    const testGrouperPathText = permissions.formattedGrouperPathTexts;

    assert.equal(grouperPathText, Logic.grouperPathText);
    assert.equal(grouperPathText, testGrouperPathText);
    assert.equal(testGrouperPathText, Logic.grouperPathText);
  });

  it('getLoggedInUserInfo()', () => {
    let loggedInUserInfo = Logic.getLoggedInUserInfo(adminData);

    let testLoggedInUserInfo = util.cloneObject(adminData);
    delete testLoggedInUserInfo.adminDepartments;

    assert.deepEqual(loggedInUserInfo, testLoggedInUserInfo);
  });

  it('canViewEightYearClock()', () => {

  });

  it('canViewExcellenceClock()', () => {

  });

  it('"canViewAddNewAppointment" is true for OA or APO', () => {
    let hasEditProfileRole = Logic.canViewAddNewAppointment('profile');
    let {isOA, isAPO} = Logic.Permissions;
    let isOAOrAPO = isOA || isAPO;
    assert.equal(hasEditProfileRole, isOAOrAPO);
  });

  it('"canViewAddNewAppointment" is false for non OA/APO', () => {
    let canViewAddNewAppointment = Logic.canViewAddNewAppointment('profile');
    let {isCAP, isSA, isDA, isVCAP} = Logic.Permissions;
    let notOAorAPO = isCAP || isSA || isDA || isVCAP;
    assert.notEqual(canViewAddNewAppointment, notOAorAPO);
  });

  it('"canViewInactiveAppointments" is false for non OA/APO', () => {
    let canViewInactiveAppointment = Logic.canViewInactiveAppointments();
    let {isCAP, isSA, isDA, isVCAP} = Logic.Permissions;
    let notOAorAPO = isCAP || isSA || isDA || isVCAP;
    assert.notEqual(canViewInactiveAppointment, notOAorAPO);
  });

  it('"canViewAppointmentSets" is true for OA or APO', () => {
    let canViewAppointmentSets = Logic.canViewAppointmentSets();
    let {isOA, isAPO} = Logic.Permissions;
    let isOAOrAPO = isOA || isAPO;
    assert.equal(canViewAppointmentSets, isOAOrAPO);
  });

  it('"canViewAppointmentSets" is false for non OA/APO', () => {
    let canViewAppointmentSets = Logic.canViewAppointmentSets();
    let {isCAP, isSA, isDA, isVCAP} = Logic.Permissions;
    let notOAorAPO = isCAP || isSA || isDA || isVCAP;
    assert.notEqual(canViewAppointmentSets, notOAorAPO);
  });

  it('"getClockViewPermissions" returns correct clock view permission', () => {
    let clockViewPermissions = Logic.getClockViewPermissions(appointmentData);
    let {opusPersonTenure, opusPersonContApp} = appointmentData;

    assert.equal(clockViewPermissions.canViewEightYearClock, opusPersonTenure);
    assert.equal(clockViewPermissions.canViewExcellenceClock, opusPersonContApp);
  });

  it('"getCanViewProfile" where profile.action == "edit" is false', () => {
    let mockAdminData = {resourceMap: {profile: {action: 'edit'}}};
    let canViewProfile = Logic.getCanViewProfile(mockAdminData);
    assert.isFalse(canViewProfile);
  });

  it('"getCanViewProfile" where profile.action == "view" is true', () => {
    let mockAdminData = {resourceMap: {profile: {action: 'view'}}};
    let canViewProfile = Logic.getCanViewProfile(mockAdminData);
    assert.isTrue(canViewProfile);
  });

  it('"appointmentIsAppointedOrInactive" is true when appointmentStatusType is Archived', () => {
    let mockAppointment = {appointmentStatusType: 'Archived'};
    let isAppointedOrInactive = Logic.appointmentIsAppointedOrInactive(mockAppointment);
    assert.isTrue(isAppointedOrInactive);
  });

  it('"appointmentIsAppointedOrInactive" is true when appointmentStatusType is Removed', () => {
    let mockAppointment = {appointmentStatusType: 'Removed'};
    let isAppointedOrInactive = Logic.appointmentIsAppointedOrInactive(mockAppointment);
    assert.isTrue(isAppointedOrInactive);
  });

  it('"appointmentIsAppointedOrInactive" is true when appointmentStatusType is "Appointed"', () => {
    let mockAppointment = {appointmentStatusType: 'Appointed'};
    let isAppointedOrInactive = Logic.appointmentIsAppointedOrInactive(mockAppointment);
    assert.isTrue(isAppointedOrInactive);
  });

  it('"appointmentIsAppointedOrInactive" is false when appointmentStatusType is "Prospective"', () => {
    let mockAppointment = {appointmentStatusType: 'Prospective'};
    let isAppointedOrInactive = Logic.appointmentIsAppointedOrInactive(mockAppointment);
    assert.isFalse(isAppointedOrInactive);
  });

  it('"appointmentIsAppointedOrProspectiveOrInactive" is false when appointmentStatusType is not "Appointed", "Prospective", "Archived" or "Removed"', () => {
    let mockAppointment = {appointmentStatusType: 'Other'};
    let isAppointedOrProspectiveOrInactive = Logic.appointmentIsAppointedOrProspectiveOrInactive(mockAppointment);
    assert.isFalse(isAppointedOrProspectiveOrInactive);
  });

  it('"appointmentIsAppointedOrProspectiveOrInactive" is true when appointmentStatusType is "Appointed"', () => {
    let mockAppointment = {appointmentStatusType: 'Appointed'};
    let isAppointedOrProspectiveOrInactive = Logic.appointmentIsAppointedOrProspectiveOrInactive(mockAppointment);
    assert.isTrue(isAppointedOrProspectiveOrInactive);
  });

  it('"appointmentIsAppointedOrProspectiveOrInactive" is true when appointmentStatusType is "Prospective"', () => {
    let mockAppointment = {appointmentStatusType: 'Prospective'};
    let isAppointedOrProspectiveOrInactive = Logic.appointmentIsAppointedOrProspectiveOrInactive(mockAppointment);
    assert.isTrue(isAppointedOrProspectiveOrInactive);
  });

  it('"appointmentIsAppointedOrProspectiveOrInactive" is true when appointmentStatusType is "Archived"', () => {
    let mockAppointment = {appointmentStatusType: 'Archived'};
    let isAppointedOrProspectiveOrInactive = Logic.appointmentIsAppointedOrProspectiveOrInactive(mockAppointment);
    assert.isTrue(isAppointedOrProspectiveOrInactive);
  });

  it('"appointmentIsAppointedOrProspectiveOrInactive" is true when appointmentStatusType is "Removed"', () => {
    let mockAppointment = {appointmentStatusType: 'Removed'};
    let isAppointedOrProspectiveOrInactive = Logic.appointmentIsAppointedOrProspectiveOrInactive(mockAppointment);
    assert.isTrue(isAppointedOrProspectiveOrInactive);
  });

  it('"getCanEditProfileFromAdminData" is false and cannot edit', () => {
    let mockAdminData = {resourceMap: {profile_edit_modal: {action: 'view'}}};
    let canEdit = Logic.getCanEditProfileFromAdminData(mockAdminData);
    assert.isFalse(canEdit);
  });

  it('"getCanEditProfileFromAdminData" is true and can edit', () => {
    let mockAdminData = {resourceMap: {profile_edit_modal: {action: 'edit'}}};
    let canEdit = Logic.getCanEditProfileFromAdminData(mockAdminData);
    assert.isTrue(canEdit);
  });

  it('"getCanEditProfile" returns correct permissions if appointment is appointed', () => {
    let mockAppointment = {appointmentStatusType: 'Appointed'};

    //REPLICATE VARIABLES IN getCanEditProfile()
    //Appointment must be "Appointed" or inactive
    let appointmentIsAppointedOrInactive = Logic.appointmentIsAppointedOrInactive(mockAppointment);
    let isProfileActionEditable = Logic.getCanEditProfileFromAdminData(adminData);
    let testGetCanEditProfile = appointmentIsAppointedOrInactive &&
      isProfileActionEditable;

    //Now test value returning from action function to compare
    let getCanEditProfile = Logic.getCanEditProfile(mockAppointment);

    assert.equal(getCanEditProfile, testGetCanEditProfile);
  });

  it('"getCanEditProfile" returns correct permissions if appointment is inactive', () => {
    let mockAppointment = {appointmentStatusType: 'Removed'};

    //REPLICATE VARIABLES IN getCanEditProfile()
    //Appointment must be "Appointed" or inactive
    let appointmentIsAppointedOrInactive = Logic.appointmentIsAppointedOrInactive(mockAppointment);
    let isProfileActionEditable = Logic.getCanEditProfileFromAdminData(adminData);
    let testGetCanEditProfile = appointmentIsAppointedOrInactive &&
      isProfileActionEditable;

    //Now test value returning from action function to compare
    let getCanEditProfile = Logic.getCanEditProfile(mockAppointment);

    assert.equal(getCanEditProfile, testGetCanEditProfile);
  });

  it('"getCanDeleteProfile" returns correct permissions if appointment is appointed', () => {
    let mockAppointment = {appointmentStatusType: 'Appointed'};

    //REPLICATE VARIABLES IN getCanDeleteProfile()
    //Appointment can be active or inactive
    let appointmentIsAppointedOrProspectiveOrInactive = Logic.appointmentIsAppointedOrProspectiveOrInactive(mockAppointment);
    let isProfileActionEditable = Logic.getCanEditProfileFromAdminData(adminData);
    let testGetCanDeleteProfile = appointmentIsAppointedOrProspectiveOrInactive &&
      isProfileActionEditable;

    //Now test value returning from action function to compare
    let getCanDeleteProfile = Logic.getCanDeleteProfile(mockAppointment);

    assert.equal(getCanDeleteProfile, testGetCanDeleteProfile);
  });

  it('"getCanDeleteProfile" returns correct permissions if appointment is inactive', () => {
    let mockAppointment = {appointmentStatusType: 'Removed'};

    //REPLICATE VARIABLES IN getCanDeleteProfile()
    //Appointment can be active or inactive
    let appointmentIsAppointedOrProspectiveOrInactive = Logic.appointmentIsAppointedOrProspectiveOrInactive(mockAppointment);
    let isProfileActionEditable = Logic.getCanEditProfileFromAdminData(adminData);
    let testGetCanDeleteProfile = appointmentIsAppointedOrProspectiveOrInactive &&
      isProfileActionEditable;

    //Now test value returning from action function to compare
    let getCanDeleteProfile = Logic.getCanDeleteProfile(mockAppointment);

    assert.equal(getCanDeleteProfile, testGetCanDeleteProfile);
  });

  it('getProfilePermissions()', () => {});

  it('"getProfileDataByOpusIdUrl" returns correct url', () => {
    let profileUrl = Logic.getProfileDataUrlByOpusId(opusPersonId, 'active');
    let testProfileUrl = urlConfig.getProfileDataByOpusIdUrl({opusPersonId, typeOfReq: 'active', access_token});
    let directProfileUrl = `/restServices/rest/profile/${opusPersonId}/active/?access_token=` +
    `${access_token}`;

    assert.equal(profileUrl, testProfileUrl);
    assert.equal(profileUrl, directProfileUrl);
  });

  it('"getAffiliationList" works', () => {
    let {affiliationTypeList} = globalData;
    let affiliationList = Logic.getAffiliationList(affiliationTypeList);

    let testAffiliationList = [{'1:1': 'Primary'}, {'2:-1': 'Additional'},
      {'2:2': 'Additional - Joint'}, {'2:3': 'Additional - Split'}];

    assert.deepEqual(testAffiliationList, affiliationList);
  });


  it('"getConcatenatedAffiliationValueFromAppointment" works', () => {
    let affiliationValue = Logic.getConcatenatedAffiliationValueFromAppointment(
      appointmentInfoList[0]);

      //Extract affiliation data
    let {affiliationTypeId, appointmentCategoryId, affiliation} =
      appointmentInfoList[0].affiliationType;

    //Create affiliation value here
    let invalidValues = {null: true, undefined: true, '': true};
    if(appointmentCategoryId in invalidValues) {
      let isPrimaryAffiliation = appointmentCategoryId || affiliation === 'Primary';
      appointmentCategoryId = isPrimaryAffiliation ? 1 : -1;
    }

    //Create by concatening option
    let testAffiliationValue = `${affiliationTypeId}:${appointmentCategoryId}`;

    assert.equal(testAffiliationValue, affiliationValue);
  });


  it('"getProfileTitleFromAppointment" returns departmentName', () => {
    let [schoolName, divisionName, departmentName] = ['school', 'division', 'department'];
    let mockAppointment = {academicHierarchyInfo: {schoolName, divisionName,
      departmentName}};
    let title = Logic.getProfileTitleFromAppointment(mockAppointment);

    assert.equal(title, departmentName);
  });

  it('"getProfileTitleFromAppointment" returns division name', () => {
    let [schoolName, divisionName, departmentName] = ['school', 'division', 'department'];
    let mockAppointment = {academicHierarchyInfo: {schoolName, divisionName,
      departmentName: ''}};
    let title = Logic.getProfileTitleFromAppointment(mockAppointment);

    assert.equal(title, divisionName);
  });

  it('"getProfileTitleFromAppointment" returns school name', () => {
    let [schoolName, divisionName, departmentName] = ['school', 'division', 'department'];
    let mockAppointment = {academicHierarchyInfo: {schoolName, divisionName: '',
      departmentName: ''}};
    let title = Logic.getProfileTitleFromAppointment(mockAppointment);

    assert.equal(title, schoolName);
  });

  it('"setFieldDataAffiliationValue" works', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let affiliationValue = Logic.getConcatenatedAffiliationValueFromAppointment(
      appointmentInfoList[0]);
    assert.equal(fieldData.affiliation.value, affiliationValue);
  });

  it('"setFieldDataAppointmentStatusType" sets the right fieldData value for appointment status type', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let appointment = {appointmentStatusType: 'Appointed'}
    Logic.setFieldDataAppointmentStatusType(fieldData, appointment);
    let appointmentStatusTypeValue = '';
    if(fieldData.appointmentStatusType) {
      for(let index in fieldData.appointmentStatusType.options){
        let int = parseInt(index);
        if(fieldData.appointmentStatusType.options[int]===appointment.appointmentStatusType){
          appointmentStatusTypeValue = index;
          break;
        }
      }
    }
    assert.equal(fieldData.appointmentStatusType.value, appointmentStatusTypeValue);
  });


  it('getSectionNames()', () => {
    let {main, appointment, salary} = Logic.getSectionNames();

    assert.deepEqual(main, ['appointmentStatusType', 'departmentCode', 'departmentName',
      'schoolName', 'divisionName', 'areaName', 'specialtyName', 'location',
      'affiliation', 'inactiveTitle', 'titleCode', 'series', 'rank', 'yearsAtCurrentRank', 'step',
      'yearsAtCurrentStep', 'appointmentPctTime', 'payrollSalary',
      'currentSalaryAmt', 'appointmentCategoryId', 'academicHierarchyPathId']);

    assert.deepEqual(salary, ['scaleType', 'onScaleSalary', 'offScalePercent', 'salaryEffectiveDt',
      'oldApuDesc', 'apuCode', 'hscpScale1to9', 'hscpScale0', 'hscpBaseScale', 'hscpAddBaseIncrement',
      'dentistryBaseSupplement']);

    assert.deepEqual(appointment, ['lastAdvancementActionEffectiveDt', 'hireDt',
      'startDateAtSeries', 'startDateAtRank', 'startDateAtStep', 'waiverEndDt',
      'appointmentEndDt', 'appointmentId', 'appointmentSetId']);
  });


  it('"getAllFieldDataKeyNames" returns field names', () => {
    let fieldDataKeyNames = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);

    let {main, appointment: apptFields, salary} = profileConstants.sectionKeys;
    let testFieldDataKeyNames = [...main, ...apptFields, ...salary];

    assert.containsAllKeys(fieldDataKeyNames, testFieldDataKeyNames);
  });


  it('hasAppointments() == false if "appointmentInfoList" is empty', () => {
    let mockProfileData = {appointmentInfoList: []};
    let hasAppointments = Logic.hasAppointments(mockProfileData);
    assert.isFalse(hasAppointments);
  });

  it('hasAppointments() == true if "appointmentInfoList" is data in it', () => {
    let mockProfileData = {appointmentInfoList: ['anything can go in here']};
    let hasAppointments = Logic.hasAppointments(mockProfileData);
    assert.isTrue(hasAppointments);
  });

  it('hasOpusPersonId() == false if there is no opusPersonId', () => {
    let mockProfileData = {appointeeInfo: {opusPersonId: null}};
    let hasOpusPersonId = Logic.hasOpusPersonId(mockProfileData);
    assert.isFalse(hasOpusPersonId);
  });

  it('hasOpusPersonId() == true if there is an opusPersonId', () => {
    let mockProfileData = {appointeeInfo: {opusPersonId: 12345}};
    let hasOpusPersonId = Logic.hasOpusPersonId(mockProfileData);
    assert.isTrue(hasOpusPersonId);
  });

  it('canViewAcademicHistory() == true if isOA, has appointments, & is valid person', () => {
    let appointmentInfoList = [{anything: 'can be in here'}];
    let appointeeInfo = {opusPersonId: 12345};
    let academicHierarchyLink = true;
    let mockProfileData = {appointeeInfo, appointmentInfoList, academicHierarchyLink};


    let testHasAppointments = Logic.hasAppointments(mockProfileData);
    let testHasOpusPersonId = Logic.hasOpusPersonId(mockProfileData);
    let {isOA, isAPO} = Logic.Permissions;
    let testCanViewAcademicHistory = (isOA || isAPO) && testHasAppointments &&
      testHasOpusPersonId;

    let canViewAcademicHistory = Logic.canViewAcademicHistory(mockProfileData);

    assert.equal(canViewAcademicHistory, testCanViewAcademicHistory);
  });

  it('canViewAcademicHistory() == false if isOA, has no appointments, & is valid person', () => {
    let appointmentInfoList = [];
    let appointeeInfo = {opusPersonId: 12345};
    let academicHierarchyLink = true;
    let mockProfileData = {appointeeInfo, appointmentInfoList, academicHierarchyLink};


    //let testHasAppointments = Logic.hasAppointments(mockProfileData);
    let testHasOpusPersonId = Logic.hasOpusPersonId(mockProfileData);
    let {isOA, isAPO} = Logic.Permissions;
    let testCanViewAcademicHistory = (isOA || isAPO) && testHasOpusPersonId;

    let canViewAcademicHistory = Logic.canViewAcademicHistory(mockProfileData);

    assert.equal(canViewAcademicHistory, testCanViewAcademicHistory);
  });

  it('canViewAcademicHistory() == false if isOA, has appointments, & isnt valid person', () => {
    let appointmentInfoList = [{anything: 'can be in here'}];
    let appointeeInfo = {opusPersonId: null};
    let academicHierarchyLink = true;
    let mockProfileData = {appointeeInfo, appointmentInfoList, academicHierarchyLink};

    let testHasAppointments = Logic.hasAppointments(mockProfileData);
    let testHasOpusPersonId = Logic.hasOpusPersonId(mockProfileData);
    let {isOA, isAPO} = Logic.Permissions;
    let testCanViewAcademicHistory = (isAPO || isOA) && testHasAppointments && testHasOpusPersonId;

    let canViewAcademicHistory = Logic.canViewAcademicHistory(mockProfileData);

    assert.equal(canViewAcademicHistory, testCanViewAcademicHistory);
  });

  //Come back to this. Need to specify functions that are being used
  it('"createFieldDatafromAppointment" creates fields from appt', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let fieldDataKeyNames = Logic.getAllFieldDataKeyNames();

    for(let name of fieldDataKeyNames) {
      assert.isObject(fieldData[name], `"${name}" attribute is missing`);
    }
  });


  it('"updateFieldDataOnChange" works', () => {
    //Tests are taken care of by ProfileToggle
    //Tests are taken care of by FieldDataToggle.test.js
  });

  it('updateFieldDataFromAPI() works', () => {
    //Tests are taken care of by ProfileToggle
    //Tests are taken care of by FieldDataToggle.test.js
  });


  //Need to ask Heather if there are only certain fields that should show up here
  it('"getAttributePropertiesOfApptFromAffiliationCall" works', () => {
    let attrProps = Logic.getAttributePropertiesOfApptFromAffiliationCall(appointmentInfoList[0]);
    let fields = ['waiverEndDt', 'appointmentPctTime', 'currentSalaryAmt'];
    for(let field of fields) {
      assert.isDefined(attrProps[field]);
    }
  });

  it('"shouldAllowAffilationAPICall" is true if fieldName == "affiliation"', () => {
    let testName = 'affiliation';
    let shouldAllowAffilationAPICall = Logic.shouldAllowAffilationAPICall(testName);

    assert.isTrue(shouldAllowAffilationAPICall);
  });

  it('"shouldAllowAffilationAPICall" is false if fieldName != "affiliation"', () => {
    let testName = 'notAffiliation';
    let shouldAllowAffilationAPICall = Logic.shouldAllowAffilationAPICall(testName);

    assert.isFalse(shouldAllowAffilationAPICall);
  });

  //All functions in this method tested in other places
  it('"updateFieldDataByAffiliationAPICall" works', () => {});

  it('formatNameSearchSuggestions() reformats & checks nameSearch results', () => {
    let reformattedNames = Logic.formatNameSearchSuggestions(nameSearchResults,
      {additionalNameKey: 'label'});

    reformattedNames.map(({name, label, value, id}) => {
      assert.isAbove(name.length, 5);
      assert.isAbove(label.length, 5);
      assert.isAbove(value.length, 5);
      assert.isNumber(id);
    });
  });

  it('"getNameOptionsUrl" correctly formats name url', () => {
    let nameUrl = Logic.getNameOptionsUrl(nameString);
    let {grouperPathText} = Logic;
    let nameUrlTest = urlConfig.searchProfileNamesUrl({name: nameString,
      access_token, grouperPathText});
    nameUrlTest = encodeURI(nameUrlTest);
    assert.equal(nameUrl, nameUrlTest);
  });

  //This test is taken care of in the beginning when setting up the cache
  it('getNameOptionsFromSearch() correctly formats name url', () => {});

  //The two functions in this class are already tested
  it('getFormattedNameSearchOptions() correctly formats name url', () => {});

  it('getFieldDataBySection() ', () => {
    let fieldData = {titleCode: {}, apuCode: {}, startDateAtRank: {}};
    let separated = Logic.getFieldDataBySection(fieldData);

    assert.containsAllKeys(separated.main, ['titleCode']);
    assert.containsAllKeys(separated.salary, ['apuCode']);
    assert.containsAllKeys(separated.appointment, ['startDateAtRank']);
  });

  it('getEditApptDataUrl() returns correct url to save profile edits', () => {
    let {appointmentId} = appointmentData.appointmentInfoList[0];

    //Now get url three different ways
    let urlArgs = {appointmentId, opusPersonId, access_token};
    let editApptUrl = Logic.getEditApptDataUrl(urlArgs, appointeeInfo);
    let testUrl = urlConfig.editAppointmentUrl(urlArgs);
    let directUrl = `/restServices/rest/profile/${opusPersonId}/appointment/` +
      `${appointmentId}/?access_token=${access_token}`;
    assert.equal(editApptUrl, testUrl);
    assert.equal(editApptUrl, directUrl);
  });

  //TODO: Not testing promises as of now
  it('"getEditApptData" returns correct results', () => {});


  it('getProfileDataByOpusIdUrl() returns correct url', () => {
    //Now get url three different ways
    let getApptUrl = Logic.getProfileDataByOpusIdUrl(opusPersonId, 'active');
    let testUrl = urlConfig.getProfileDataByOpusIdUrl({opusPersonId, typeOfReq: 'active', access_token});
    let directUrl = `/restServices/rest/profile/${opusPersonId}/active/?access_token=`
    + access_token;

    assert.equal(getApptUrl, testUrl);
    assert.equal(getApptUrl, directUrl);
  });

  it('getPathJobDataByOpusIdUrl() returns correct url', () => {
    //Now get url three different ways
    let getApptUrl = Logic.getPathJobDataByOpusIdUrl(opusPersonId);
    let testUrl = urlConfig.getPathJobDataByOpusIdUrl({opusPersonId, access_token});
    let directUrl = `/restServices/rest/profile/${opusPersonId}/pathJobInfo/?access_token=`
    + access_token;

    assert.equal(getApptUrl, testUrl);
    assert.equal(getApptUrl, directUrl);
  });

  //TODO: Not testing promises as of now
  it('"getProfileDataByOpusId" returns correct results', () => {});


  // it('"calculateYearsAtCurrentRankStep" correctly formats date', () => {
  //   let yearString = '1-1-2000';
  //   let yearsAtCurrRank = Logic.calculateYearsAtCurrentRankStep(yearString);
  //
  //   let years = new Date() - new Date(2000, 1, 1);
  //   let millisecInYear = 1000 * 60 * 60 * 24 * 365;
  //   let yearDifference = Math.round(years / millisecInYear) + ' Years(s)';
  //
  //   assert.equal(yearsAtCurrRank, yearDifference);
  // });


  //TODO: Not testing promises
  it('"getCommentsById" returns correct results', () => {});


  it('getSaveCommentArgs() returns correct save comment arguments', () => {
    let commentText = 'Hey Leon';
    let appointment = appointmentData.appointmentInfoList[0];
    let commentArgs = Logic.getSaveCommentArgs(commentText, appointment);

    let {entityKeyColumnValue, screenName, commentUrl, urlEncodedHeaders} =
      commentArgs;

    //Test Data
    let testUrl = urls.addComment(access_token, 'profile');
    let directTestUrl = '/restServices/rest/common/comments/?access_token=' +
    access_token;
    let headers = {headers: {'Content-Type': 'application/x-www-form-urlencoded'}};

    assert.equal(commentUrl, testUrl);
    assert.equal(commentUrl, directTestUrl);
    assert.equal(screenName, 'profile');
    assert.equal(entityKeyColumnValue, appointment.appointmentId);
    assert.deepEqual(urlEncodedHeaders, headers);
  });

  it('saveComment()', () => {});

  //TODO: Not testing promises as of now. Two functions in here tested elsewhere
  it('"deleteProfileData" returns correct results', () => {});

  it('"getDeleteProfileArgs" returns correct results', () => {
    let {appointmentInfoList: appointments} = appointmentData;
    let deleteProfileArgs = Logic.getDeleteProfileArgs(appointments[0], appointeeInfo);
    let {access_token: accessToken, fullName, adminName, opusPersonId: opusId,
      appointmentId, adminOpusId, adminEmail} = deleteProfileArgs;

    //Appointment comparisons
    assert.equal(opusId, opusPersonId);
    assert.equal(fullName, appointeeInfo.fullName);
    assert.equal(appointmentId, appointments[0].appointmentId);

    //AdminData comparisons
    assert.equal(accessToken, access_token);
    assert.equal(adminName, Logic.adminData.adminName);
    assert.equal(adminEmail, Logic.adminData.adminEmail);
    assert.equal(adminOpusId, Logic.adminData.adminOpusId);
  });

  //Taken care of in Validations class
  it('"validateAllFieldDataOnSave" returns correct results', () => {});

  //Taken care of in Validations class
  it('"validateFieldOnUpdate" returns correct results', () => {});

  //Taken care of in Validations class
  it('"validateFieldOnBlur" returns correct results', () => {});

  it('doFieldsHaveErrors() checks if at least 1 field w/ "hasError" === true ', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let {affiliation} = fieldData;

    //Should return w/ no errors bool
    let firstErrorPass = Logic.doFieldsHaveErrors(fieldData);
    assert.isNotTrue(firstErrorPass);

    //Should return true as having fieldErrors
    affiliation.hasError = true;
    let secondErrorPass = Logic.doFieldsHaveErrors(fieldData);
    assert.isTrue(secondErrorPass);
  });


  it('getErrorMessage() checks for message when fieldsHaveErrors', () => {
    let fieldsHaveErrors = true;
    let commentIsValid = false;

    let message = Logic.getErrorMessage(fieldsHaveErrors, commentIsValid);

    assert.equal(message, 'Sorry, there was a problem. Please check the form ' +
      'for errors.');
  });

  it('getErrorMessage() checks for message for no errors but invalid comment',
  () => {
    let fieldsHaveErrors = false;
    let commentIsValid = false;

    let message = Logic.getErrorMessage(fieldsHaveErrors, commentIsValid);

    assert.equal(message, 'Please add a comment to save.');
  });

  it('getErrorMessage() checks for message for no errors & valid comment',
  () => {
    let fieldsHaveErrors = false;
    let commentIsValid = true;

    let message = Logic.getErrorMessage(fieldsHaveErrors, commentIsValid);

    assert.isNull(message);
  });

  it('"isCommentValid" checks for blank & non-blank comment', () => {
    let invalidComment = '';
    let isCommentValid = Logic.isCommentValid(invalidComment);
    assert.isFalse(isCommentValid);

    let validComment = 'Im not a blank comment so Im valid';
    isCommentValid = Logic.isCommentValid(validComment);
    assert.isTrue(isCommentValid);
  });

  it('"isAppointmentStatusChangeValid" checks for valid appointment status type changes', () => {
    // changing from '1: Prospective' to '2: Appointed'
    let startingFieldData = {appointmentStatusType: {value: '1'}};
    let fieldData = {appointmentStatusType: {value: '2'}};
    let isAppointmentStatusChangeValid = Logic.isAppointmentStatusChangeValid(startingFieldData, fieldData);
    assert.isTrue(isAppointmentStatusChangeValid);

    // changing from '3: Archived' to '2: Appointed'
    startingFieldData = {appointmentStatusType: {value: '3'}};
    fieldData = {appointmentStatusType: {value: '2'}, appointmentEndDt: {value: '02/04/2019'}};
    isAppointmentStatusChangeValid = Logic.isAppointmentStatusChangeValid(startingFieldData, fieldData);
    assert.isFalse(isAppointmentStatusChangeValid);
  });

  it('"isAppointmentEndDtValid" returns true if date to be checked is in the future', () => {
    assert.isTrue(Logic.isAppointmentEndDtValid('02/05/2253'))
  });

  it('"isAppointmentEndDtValid" returns false if date to be checked is in the past', () => {
    assert.isFalse(Logic.isAppointmentEndDtValid('02/04/2019'))
  });

  it('"createProfileDataTemplate"', () => {
    let appointment = {};
    let loggedInUserInfo = Logic.getLoggedInUserInfo();
    let saveTemplate = util.cloneObject(profileSaveTemplate);
    saveTemplate = {...saveTemplate, appointeeInfo, loggedInUserInfo,
      appointmentInfoList: [appointment]};

    let template = Logic.createProfileDataTemplate(appointment, appointeeInfo);

    assert.deepEqual(template, saveTemplate);
    assert.containsAllKeys(template, ['opusPersonContApp', 'opusPersonTenure', 'locationList', 'affiliationTypeList',
      'titleCodeList', 'scaleTypeList', 'apuList', 'appointeeInfo', 'loggedInUserInfo',
      'appointmentInfoList']);
  });

  it('"formatProfileDataForSave" testing this executes without error as functions'
  + ' in here tested elsewhere', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let comment = 'Heres a comment';
    let appointment = {academicHierarchyInfo: {}, titleInformation: {
      academicProgramUnit: {}, affiliationType: {}}};
    let returned = Logic.formatProfileDataForSave(fieldData, appointment,
      appointeeInfo, {comment});

    assert.equal(appointment, returned);
    assert.equal(appointment.comment, comment);
    //already tested by this.omitFieldsForSave
    //already tested by this.splitFieldDataAffiliationValue
    //already tested by this.setFieldDataValuesOntoTemplateByPathKey
    //already tested by this.editStepValueByVisibility
    //already tested by this.wipeValuesOfInvisibleFieldData
    //already tested by this.formatDeptCodeByAHPath
    //already tested by this.addApuCodeToApptByFieldDataApuId
    //already tested by this.removeExtraneousDataFromAppointment
    //already tested by this.addCommentToAppointment
  });

  it('"editStepValueByVisibility" properly formats step field', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let {step} = fieldData;
    let value = 20;

    //Should have value stay where it is
    step.value = value;
    step.visibility = true;
    Logic.editStepValueByVisibility(fieldData);
    assert.equal(step.value, value);

    //Should have value set to zero
    step.visibility = false;
    Logic.editStepValueByVisibility(fieldData);
    assert.equal(step.value, 0);
  });

  it('"wipeValuesOfInvisibleFieldData" properly wipes fields', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let {affiliation, step, rank} = fieldData;
    let value = 20;

    Object.assign(rank, {value, visibility: true});
    Object.assign(step, {value, visibility: true});
    Object.assign(affiliation, {value, visibility: true});

    //Fields should retain their value
    Logic.wipeValuesOfInvisibleFieldData(fieldData);

    for(let name of ['rank', 'step', 'affiliation']) {
      assert.equal(fieldData[name].value, 20);
    }

    Object.assign(rank, {value, visibility: false});
    Object.assign(step, {value, visibility: false});
    Object.assign(affiliation, {value, visibility: false});

    //Should wipe fields now
    Logic.wipeValuesOfInvisibleFieldData(fieldData);

    for(let name of ['rank', 'step', 'affiliation']) {
      assert.isNull(fieldData[name].value);
    }

    for(let name in fieldData) {
      if(fieldData[name].visibility === false) {
        assert.isNull(fieldData[name].value);
      }
    }
  });


  it('"formatDeptCodeByAHPath" updates fieldData "deptCode" & "academicHierarchyPathId"', () => {
    let {formattedCommonCallLists: {aHPathIdsToDeptCode}} = Logic;

    //This is a valid ahPath and valid deptCode
    let startAhPathId = 2;

    //Create fieldData to test on
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let {departmentCode, academicHierarchyPathId} = fieldData;

    //Wipe value so we know what they are before checking for them
    departmentCode.value = startAhPathId;
    academicHierarchyPathId.value = null;

    //Get AHPath in deptCode & use that to get deptCode from commonCallList
    let {value: ahPathId} = departmentCode;
    let deptCodeFromAhPathId = aHPathIdsToDeptCode[ahPathId];

    //Make sure these values are not there before testing
    assert.isFinite(ahPathId);
    assert.notExists(academicHierarchyPathId.value);

    //Perform operation on "academicHierarchyPathId" & "departmentCode"
    Logic.formatDeptCodeByAHPath(fieldData);

    //Now check the values were correctly transferred
    assert.equal(departmentCode.value, deptCodeFromAhPathId);
    assert.equal(academicHierarchyPathId.value, ahPathId);
  });

  it('"addApuCodeToApptByFieldDataApuId" works', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);

    //Nullify the apuCode so we can start from blank
    fieldData.apuCode.value = null;

    commonTests.addApuCodeToApptByFieldDataApuId(Logic, fieldData, appointmentInfoList[0]);
  });

  it('"splitFieldDataAffiliationValue" works', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);


    let {affiliationType: {affiliationTypeId = 2, appointmentCategoryId = -2}} =
      appointmentInfoList[0];

    //Lets wipe "appointmentCategoryId" in fieldData
    fieldData.appointmentCategoryId.value = null;

    //Lets set the affiliation value
    fieldData.affiliation.value = `${affiliationTypeId}:${appointmentCategoryId}`;

    //Now run the function to test the result
    Logic.splitFieldDataAffiliationValue(fieldData);

    //Now check whether the affiliation fields were set correctly
    assert.equal(fieldData.affiliation.value, affiliationTypeId);
    assert.equal(fieldData.appointmentCategoryId.value, String(appointmentCategoryId));
  });

  it('"removeExtraneousDataFromAppointment" removes worthless data', () => {
    let appointment = appointmentData.appointmentInfoList[0];
    let clonedAppt = util.cloneObject(appointment);

    //Logic.removeExtraneousDataFromAppointment(clonedAppt);

    //ensure that "academicHierarchyList" is actually here
    assert.isNotNull(clonedAppt.academicHierarchyList);

    Logic.removeExtraneousDataFromAppointment(clonedAppt);

    //As if not this is the only object it removes
    assert.notExists(clonedAppt.academicHierarchyList);
  });


  it('setFieldDataValuesOntoTemplateByPathKey()', () => {
    let fieldData = {step: {value: 10, path: 'titleInformation.step'},
      salary: {value: 93, path: 'salary'}};
    let appointment = {};

    Logic.setFieldDataValuesOntoTemplateByPathKey(fieldData, appointment, {pathKey:
      'path'});

    assert.equal(fieldData.salary.value, appointment.salary);
    assert.equal(fieldData.step.value, appointment.titleInformation.step);
  });

  it('"omitFieldsForSave" works', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    assert.exists(fieldData.series);
    assert.exists(fieldData.rank);

    fieldData = Logic.omitFieldsForSave(fieldData);
    assert.notExists(fieldData.series);
    assert.notExists(fieldData.rank);
  });

  it('"addCommentToAppointment" works', () => {
    let appointment = util.cloneObject(appointmentData.appointmentInfoList[0]);
    let comment = 'Hey there tester';

    assert.notEqual(appointment.comment, comment);
    Logic.addCommentToAppointment(appointment, comment);
    assert.equal(appointment.comment, comment);
  });

  it('"formatProfileDataForSave" formats new template.  Executes and doesnt give'
  + 'errors as everything in this function is tested elsewhere', () => {
    let fieldData = Logic.createFieldDatafromAppointment(appointmentInfoList[0]);
    let appointment = util.cloneObject(appointmentData.appointmentInfoList[0]);

    let comment = 'comment';
    let returned = Logic.formatProfileDataForSave(fieldData, appointment,
      appointeeInfo, {comment});

    assert.equal(returned, appointment);

    // already tested by omitFieldsForSave
    // already tested by splitFieldDataAffiliationValue
    // already tested by setFieldDataValuesOntoTemplateByPathKey
    //
    // already tested by editStepValueByVisibility
    // already tested by wipeValuesOfInvisibleFieldData
    // already tested by formatDeptCodeByAHPath
    // already tested by addApuCodeToApptByFieldDataApuId
    // already tested by removeExtraneousDataFromAppointment
    // already tested by addCommentToAppointment
  });

  //Not testing promises
  it('"saveProfileDataToAPI" saves new template');

});
