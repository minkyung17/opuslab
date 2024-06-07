import axios from 'axios';
import moment from 'moment';
import {assert} from 'chai';
import {hash as rsvpHash} from 'rsvp';
import {difference, keys, entries} from 'lodash';

//Testing constants
import '../../../../test-utility/setup-tests';
import {constants} from '../../../../test-utility/testing-constants';
import * as testHelpers from '../../../../test-utility/helpers';


//My import
import FieldData from '../../../../../opus-logic/common/modules/FieldData';
import * as commonTests from '../Cases.common.js';
import * as caseSummaryCommonTests from './CaseSummary.common.js';
import * as util from '../../../../../opus-logic/common/helpers';
import {fieldsInAPI} from '../../../../../opus-logic/cases/constants/FieldDataConstants';
import {constants as caseConstants, urls, actionDataTemplate} from
  '../../../../../opus-logic/cases/constants/CasesConstants';
import {constants as caseSummaryConstants} from
  '../../../../../opus-logic/cases/constants/case-summary/CaseSummaryConstants';
import CaseSummary from '../../../../../opus-logic/cases/classes/case-summary/CaseSummary';
import CasesAdminPermissions from '../../../../../opus-logic/common/modules/CasesAdminPermissions';


describe('Case Summary Logic Class', () => {
  let {karmaAliasBaseUrl} = constants;
  let cachePaths = {
    apiApptData: 'caseSummary.apiData'
  };
  let caseId = 4191;
  let actionDataInfo = null;
  let appointeeInfo = null;
  let appointmentData = null;
  let casesProposedAttrMap = null;
  let casesApprovedAttrMap = null;
  let caseSummaryDataFromAPI = null;
  let opusCaseInfo = null;
  let adminData = null;
  let globalData = null;
  let access_token = null;
  let newFieldData = null;
  let Logic = null;
  let PermissionsLogic = null;
  let FieldDataLogic = new FieldData();
  let clonedFieldData = null;
  let proposedFieldData = null;

  let roles = ['isAPO', 'isOA', 'isDA', 'isSA', 'isLibrarySA', 'isCAP', 'isVCAP', 'isCAP'];
  function resetPermissions(PermissionsInstance) {
    for(let role of roles) {
      PermissionsInstance[role] = false;
    }
  }

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
    Logic = new CaseSummary({globalData, adminData, access_token, caseId});
    PermissionsLogic = new CasesAdminPermissions(adminData);

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
    clonedFieldData = FieldDataLogic.createFieldDataByAttributeProperties(
      casesApprovedAttrMap, {fieldDataOptions: fieldsInAPI});
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

    //Create approved fields, fill them with values and options
    newFieldData = FieldDataLogic.createFieldDataByAttributeProperties(
      casesProposedAttrMap, {fieldDataOptions: fieldsInAPI});

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

  it('ensures initCaseSummary() in the constructor creates "Permissions" object', () => {
    assert.isDefined(Logic.Permissions);
    let {isOA, isAPO} = Logic.Permissions;
    assert.isDefined(isOA);
    assert.isDefined(isAPO);
  });

  it('ensures initCaseSummary() in the constructor creates "formattedCommonCallLists"', () => {
    assert.isObject(Logic.formattedCommonCallLists);
    let formattedCommonCallListKeys = ['locationList', 'titleCodeList'];
    assert.containsAllKeys(Logic.formattedCommonCallLists, formattedCommonCallListKeys);
  });

  it('ensures initCaseSummary() sets common call data', () => {
    assert.isString(Logic.access_token);
    assert.isObject(Logic.adminData);
    assert.isObject(Logic.globalData);
  });

  it('stringify() works', () => {
    let object = {key: 'value'};
    let testObject = Logic.stringify(object);

    //Known correct answer
    let stringifiedObject = JSON.stringify(object);

    assert.equal(testObject, stringifiedObject);
  });

  it('ensures getCaseSummaryDataAPIUrl() returns correct case summary url', () => {
    let url = Logic.getCaseSummaryDataAPIUrl();

    let testUrl = caseSummaryConstants.urls.getCaseSummary + access_token;

    assert.equal(url, testUrl);
  });

  it('ensures getCaseSummaryDataAPIArgs() returns correct case summary args', () => {
    let args = Logic.getCaseSummaryDataAPIArgs(caseId);
    assert.equal(args.caseId, caseId);
  });

  //TODO not testing promises
  //Functions here are covered in getCaseSummaryDataAPIUrl() & getCaseSummaryDataAPIArgs()
  it('ensures getCasesSummaryData() returns correct case summary args', () => {});

  it('getCaseSummaryPagePermissions() gets correct permissions', () => {
    let permissions = Logic.getCaseSummaryPagePermissions(adminData);

    let {resourceMap: {casesummary = {}}} = adminData;
    let canViewCaseSummary = casesummary.action in {edit: true, view: true};
    let canEditCaseSummary = casesummary.action === 'edit';

    assert.equal(permissions.canViewCaseSummary, canViewCaseSummary);
    assert.equal(permissions.canEditCaseSummary, canEditCaseSummary);
  });

  it('canViewRecommendations() gets correct permissions', () => {
    let permissions = Logic.canViewRecommendations(adminData);

    let {resourceMap: {case_rec = {}}} = adminData;
    let canViewActions = casesummary.action in {edit: true, view: true};

    assert.equal(permissions.canViewActions, canViewActions);
  });

  //Tests are taken care of by getProposedStatusPermissions() &
  //getFinalDecisionPermissions()
  it('setFieldDataPermissionsFromOpusCaseInfo() gets correct finalDecision permissions',
  () => {
    let {canEditProposedStatus} = Logic.getProposedStatusPermissions(caseSummaryDataFromAPI.actionDataInfo);
    let {canEditFinalDecision} = Logic.getFinalDecisionPermissions(opusCaseInfo);

    let permissions = Logic.setFieldDataPermissionsFromOpusCaseInfo(caseSummaryDataFromAPI);

    assert.equal(canEditProposedStatus, permissions.canEditProposedStatus);
    assert.equal(canEditFinalDecision, permissions.canEditFinalDecision);

    assert.equal(Logic.canEditProposedStatus, permissions.canEditProposedStatus);
    assert.equal(Logic.canEditFinalDecision, permissions.canEditFinalDecision);
  });

  it('ensures caseIsCompleted() returns if case is completed', () => {
    //From the Logic class
    let caseIsCompleted = Logic.caseIsCompleted(actionDataInfo[0]);

    //From the test
    let testIsCaseCompleted = (actionDataInfo[0].actionStatusId === 2 && actionDataInfo[0].rowStatusId === 2
    || actionDataInfo[0].actionStatusId === 4 && actionDataInfo[0].rowStatusId === 3);

    //Assertion to test
    assert.equal(caseIsCompleted, testIsCaseCompleted);
  });

  it('getIsSchoolAdministrator() if theres a role ending with "_sch_admin"', () => {
    //From the Logic class
    let isSchAdmin = Logic.getIsSchoolAdministrator(adminData);

    //From the test
    let testIsSchAdmin = !!adminData.adminRoles.filter(role =>
      role.endsWith('_sch_admin')).length;

    //Should be equal
    assert.equal(isSchAdmin, testIsSchAdmin);
  });

  // it('hasViewableRole() tests if adminData is opusAdmin or apoDirector ', () => {
  //   //From the Logic class
  //   let hasViewableRole = Logic.hasViewableRole(adminData);
  //
  //   //From the test
  //   let {isOA, isAPO} = Logic.Permissions;
  //   let testHasViewableRole = isOA || isAPO;
  //
  //   //Should be equal
  //   assert.equal(hasViewableRole, testHasViewableRole);
  // });

  it('isOAOrAPO() tests if adminData is opusAdmin or apoDirector ', () => {
    //From the Logic class
    let isOAOrAPO = Logic.isOAOrAPO(adminData);

    //From the test
    let {isOA, isAPO} = Logic.Permissions;
    let testIsOAorAPO = isOA || isAPO;

    //Should be equal
    assert.equal(isOAOrAPO, testIsOAorAPO);
  });

  //Already tested by isCaseCompleted(), getIsSchoolAdministrator(), hasViewableRole()
  it('ensures getFieldPermissionArgs() returns defined booleans ', () => {
    let {isOAOrAPO, isSchAdmin, isLibrarySchAdmin, isDeptAdmin, isVCAP, isCAP} =
      PermissionsLogic.getFieldPermissionArgs(adminData);

    assert.isDefined(isOAOrAPO);
    assert.isDefined(isSchAdmin);
    assert.isDefined(isLibrarySchAdmin);
    assert.isDefined(isDeptAdmin);
    assert.isDefined(isVCAP);
    assert.isDefined(isCAP);
  });

  it('getProposedStatusPermissions() gets correct proposedStatus permissions', () => {
    let {canEditProposedStatus} = Logic.getProposedStatusPermissions(caseSummaryDataFromAPI.actionDataInfo);

    //Extract all roles
    let {isOA, isAPO, isSA, isDA} = Logic.Permissions;

    //Can edit proposed status if any one of these roles
    let isOAOrAPOorSchoolAdmin = isOA || isAPO || isSA;

    //You can edit proposed status if caseIsCompleted and user is dept admin
    let caseIsCompleted = Logic.caseIsCompleted(actionDataInfo[0]);
    let isDA_CaseCompleted = caseIsCompleted && isDA;

    //Can edit if either one of these is true
    let testCanEditProposedStatus = isDA_CaseCompleted || isOAOrAPOorSchoolAdmin;

    assert.equal(canEditProposedStatus, testCanEditProposedStatus);
  });

  it('getFinalDecisionPermissions() gets correct finalDecision permissions', () => {
    let {canEditFinalDecision} = Logic.getFinalDecisionPermissions(opusCaseInfo);

    //Extract if you are an OA or APO, school admin, or if case is completed
    let {isSchAdmin, isOAOrAPO} = PermissionsLogic.getFieldPermissionArgs(adminData);

    let testCanEditFinalDecision = isSchAdmin || isOAOrAPO;
    assert.equal(canEditFinalDecision, testCanEditFinalDecision);
  });

  it('keyActionDataByApptId() keys actionData by appointmentId', () => {
    let actionDataInfoByApptId = Logic.keyActionDataByApptId(actionDataInfo);

    let keyedActionDataInfo = {};
    for (let actionData of actionDataInfo) {
      let {appointmentId} = actionData.appointmentInfo;
      keyedActionDataInfo[appointmentId] = actionData;
    }

    assert.deepEqual(actionDataInfoByApptId, keyedActionDataInfo);
  });


  it('getVisibleFieldData() returns only visible fields', () => {
    //Create approved fields, fill them with values and options
    let fieldData = FieldDataLogic.createFieldDataByAttributeProperties(
      casesProposedAttrMap, {fieldDataOptions: fieldsInAPI});

    fieldData.titleCode.visibility = false;
    fieldData.step.visibility = true;
    //Check basic visibility
    let visible = caseSummaryCommonTests.getVisibleFieldData(Logic, fieldData);

    //Additional test to make sure titleCode not seen but step is seen
    assert.property(visible, 'step');
    assert.notProperty(visible, 'titleCode');
  });

  it('getVisibleFieldDataOfObject()', () => {
    //Create approved fields, fill them with values and options
    let fieldData = FieldDataLogic.createFieldDataByAttributeProperties(
      casesProposedAttrMap, {fieldDataOptions: fieldsInAPI});

    //Change visibility of fields to add one more check
    fieldData.titleCode.visibility = false;
    fieldData.step.visibility = true;

    let fieldDataByKey = {key: fieldData};

    for(let key in fieldDataByKey) {
      let visible = caseSummaryCommonTests.getVisibleFieldData(Logic,
        fieldDataByKey[key]);

      //Additional test to make sure titleCode not seen but step is seen
      assert.property(visible, 'step');
      assert.notProperty(visible, 'titleCode');
    }
  });

  it('getActionTypeFromActionData() gets actionType i.e. "3-1" or "2-7"', () => {
    //From Logic class
    let actionType = Logic.getActionTypeFromActionData(actionDataInfo[0]);

    //For testing
    let {actionTypeInfo: {actionCategoryId, actionTypeId}} = actionDataInfo[0];
    let testActionType = `${actionCategoryId}-${actionTypeId}`;

    assert.equal(actionType, testActionType);
  });

  it('formatApoAnalystList() should be sorted by names in an array ', () => {
    //Create apoAnalystList that is a dropdown in the modals
    let apoAnalystList = Logic.formatApoAnalystList(globalData.apoAnalyst);

    //Get the names that are SORTED
    let apoAnalystListNames = apoAnalystList.map(each => Object.values(each));

    //Merge/Flatten the arrays
    apoAnalystListNames = [].concat.apply([], apoAnalystListNames);

    //Sort it myself
    let {apoAnalyst} = globalData;
    let testSortedAnalystNamesList = Object.values(apoAnalyst).sort();

    //Make sure they are sorted
    assert.deepEqual(testSortedAnalystNamesList, apoAnalystListNames);

    //Make sure the id(key) of apoAnalystList matches up to name(value)
    for(let sortedIdToName of apoAnalystList) {
      for(let key in sortedIdToName) {
        assert.equal(sortedIdToName[key], globalData.apoAnalyst[key]);
      }
    }
  });

  it('canViewTrackingDates() should return back correct permissions to view tracking dates for APO', () => {
    resetPermissions(PermissionsLogic);
    let testOpusCaseInfo = {
      bycPacketId: 123,
      packetTypeId: 456
    };
    let mockAdminData = {adminRoles: ['apo_director']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let canViewTrackingDates1 = Logic.canViewTrackingDates(testOpusCaseInfo, mockAdminData, PermissionsLogic);
    assert.isTrue(canViewTrackingDates1);
  });

  it('canViewTrackingDates() should return back correct permissions to view tracking dates for VCAP', () => {
    resetPermissions(PermissionsLogic);
    let testOpusCaseInfo = {
      bycPacketId: 123,
      packetTypeId: 456
    };
    let mockAdminData = {adminRoles: ['vice_chancellor_academic_personnel']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let canViewTrackingDates2 = Logic.canViewTrackingDates(testOpusCaseInfo, mockAdminData, PermissionsLogic);
    assert.isTrue(canViewTrackingDates2);
  });

  it('canViewTrackingDates() should return back correct permissions to view tracking dates for DA', () => {
    resetPermissions(PermissionsLogic);
    let testOpusCaseInfo = {
      bycPacketId: 123,
      packetTypeId: 456
    };
    let mockAdminData = {adminRoles: ['history_dept_admin']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let canViewTrackingDates3 = Logic.canViewTrackingDates(testOpusCaseInfo, mockAdminData, PermissionsLogic);
    assert.isFalse(canViewTrackingDates3);
  });

  it('canViewTrackingDates() should return back correct permissions to view tracking dates for SA', () => {
    resetPermissions(PermissionsLogic);
    let testOpusCaseInfo = {
      bycPacketId: null,
      packetTypeId: null
    };
    let mockAdminData = {adminRoles: ['english_sch_admin']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let canViewTrackingDates4 = Logic.canViewTrackingDates(testOpusCaseInfo, mockAdminData, PermissionsLogic);
    assert.isTrue(canViewTrackingDates4);
  });

  it('canViewTrackingDates() should return back correct permissions to view tracking dates for CAP', () => {
    resetPermissions(PermissionsLogic);
    let testOpusCaseInfo = {
      bycPacketId: 123,
      packetTypeId: 456
    };
    let mockAdminData = {adminRoles: ['cap_staff']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let canViewTrackingDates5 = Logic.canViewTrackingDates(testOpusCaseInfo, mockAdminData, PermissionsLogic);
    assert.isTrue(canViewTrackingDates5);
  });

  it('canViewTrackingDates() should return back correct permissions to view tracking dates for Library SA', () => {
    resetPermissions(PermissionsLogic);
    let testOpusCaseInfo = {
      bycPacketId: 123,
      packetTypeId: 456
    };
    let mockAdminData = {adminRoles: ['library_sch_admin']};
    PermissionsLogic.setAdminData(mockAdminData);
    PermissionsLogic.processAdminData(mockAdminData);
    let canViewTrackingDates6 = Logic.canViewTrackingDates(testOpusCaseInfo, mockAdminData, PermissionsLogic);
    assert.isTrue(canViewTrackingDates6);
  });

  it('extractCaseLocationFieldsFromFieldData() ', () => {
    //Create approved fields, fill them with values and options
    let fieldData = FieldDataLogic.createFieldDataByAttributeProperties(
      casesApprovedAttrMap, {fieldDataOptions: fieldsInAPI});

    //Extract caseLocation fields
    let caseLocation = Logic.extractCaseLocationFieldsFromFieldData(fieldData);

    //Make sure the sectionName in attributeProperties is 'caseLocation'
    for(let name in caseLocation) {
      assert.equal(caseLocation[name].attributeProperties.sectionName, 'caseLocation');
    }

    //Get names of fields that are not case location
    let nonCaseLocationFieldNames = difference(keys(fieldData), keys(caseLocation));

    //Now we check to make sure those fields are not caseLocation
    for(let field of nonCaseLocationFieldNames) {
      assert.notEqual(fieldData[field].attributeProperties.sectionName, 'caseLocation');
    }
  });

  it('createCaseLocationFieldData() ', () => {
    let caseLocationFields = Logic.createCaseLocationFieldData(caseSummaryDataFromAPI,
      casesApprovedAttrMap);

    //Ensure that sectionName is caseLocation
    for(let [, {attributeProperties}] of entries(caseLocationFields)) {
      assert.equal(attributeProperties.sectionName, 'caseLocation');
    }

    //Dummy data source to take care of opusCase to opusCaseInfo inconsistency
    let dummyDataSource = {opusCase: caseSummaryDataFromAPI.opusCaseInfo};
    caseSummaryCommonTests.addValuesToFieldData(Logic, caseLocationFields,
      dummyDataSource);

    commonTests.reformatDisplayValuesBasedOnViewType(Logic, caseLocationFields,
      caseSummaryDataFromAPI);
  });

  //Already tested by its superClass
  it('updateFieldDataByToggle() ', () => {});

  it('sortWorkFlowSteps() ', () => {
    let {workflowSteps} = appointmentData;
    let workFlowFields = Logic.sortWorkFlowSteps(workflowSteps);

    let sortedNumbers = workFlowFields.map(each => each.workFlowStepNumber);
    let testSortedNumbers = Array.sort(sortedNumbers);

    //Make sure the workflowSteps are sorted
    assert.deepEqual(sortedNumbers, testSortedNumbers);
  });

  it('createByWorkFlowData() ', () => {
    let {workflowSteps} = appointmentData;
    let workFlowFields = Logic.createByWorkFlowData(workflowSteps);

    //Iterate through formatted workflow fields to compare to the original
    for(let {name, value, workFlowStepNumber} of workFlowFields) {
      let {workFlowStepName, workFlowStepDt} = workflowSteps[workFlowStepNumber];

      //Make sure the names match up from the order
      assert.equal(name, workFlowStepName);

      //Ensure formatted date is transformed as they should be
      if(workFlowStepDt) {
        let testFormattedDate = moment(workFlowStepDt).format('MM/DD/YYYY');
        assert.equal(value, testFormattedDate);
      }
    }
  });

  it('formatAPOAnalystSaveTemplate() ', () => {
    let dummyId = 12345;
    let apoAnalystTemplate = Logic.formatAPOAnalystSaveTemplate(dummyId,
      opusCaseInfo);

    assert.equal(apoAnalystTemplate.apoAnalystOpusId, dummyId);
    assert.equal(apoAnalystTemplate.user, adminData.adminName);
    assert.equal(apoAnalystTemplate.caseId, opusCaseInfo.caseId);
  });


  it('getSaveHeaders() ', () => {
    let headers = Logic.getSaveHeaders();

    let testHeaders = caseConstants.saveOptions.urlEncodedHeaders;

    assert.equal(headers, testHeaders);
  });

  //Not testing promises. All functions in here are tested in previous 3 functions
  it('getSaveAPOAnalystUrl() ', () => {
    let url = Logic.getSaveAPOAnalystUrl();

    let testUrl = caseSummaryConstants.urls.saveProposedAction + access_token;

    let stringUrl = '/restServices/rest/activecase/updateApoAnalystAcData?access_token='
      + access_token;

    assert.equal(url, testUrl);
    assert.equal(url, stringUrl);
  });


  it('addAHPathAndDeptCodeToApptFromFieldData() ', () => {
    //Create approved fields, fill them with values and options
    let fieldData = util.cloneObject(newFieldData);

    //Not done
    let {proposedAppointmentInfo} = actionDataInfo[0];
    commonTests.addAHPathAndDeptCodeToApptFromFieldData(Logic, fieldData,
      proposedAppointmentInfo);
  });

  it('addApuCodeToApptByFieldDataApuId() ', () => {
    let fieldData = util.cloneObject(newFieldData);
    let {appointmentInfo} = util.cloneObject(actionDataInfo[0]);

    commonTests.addApuCodeToApptByFieldDataApuId(Logic, fieldData, appointmentInfo);
  });

  it('setValueOfInvisibleFields() ', () => {
    let fieldData = util.cloneObject(newFieldData);
    let nullValue = null;
    fieldData.titleCode.value = 5;
    fieldData.titleCode.visibility = false;

    Logic.setValueOfInvisibleFields(fieldData, nullValue);

    //Must be false
    assert.equal(fieldData.titleCode.value, nullValue);

    //Make sure invisible fields in fieldData are null
    for(let name in fieldData) {
      if(fieldData[name].visibility === false) {
        assert.isNull(fieldData[name].value, nullValue);
      }
    }
  });

  it('setValueOfUneditableFields() ', () => {
    let fieldData = util.cloneObject(newFieldData);
    let nullValue = null;
    fieldData.titleCode.value = 5;
    fieldData.titleCode.editable = false;

    Logic.setValueOfUneditableFields(fieldData, nullValue);

    //Must be false
    assert.equal(fieldData.titleCode.value, nullValue);

    //Make sure disabled fields in fieldData are null
    for(let name in fieldData) {
      if(fieldData[name].editable === false) {
        assert.isNull(fieldData[name].value, nullValue);
      }
    }
  });

  it('formatActionDataTemplate() ', () => {
    let sectionName = 'proposed';
    let actionDataKeys = Object.keys(actionDataInfo[0]);

    //Make sure I have keys
    assert.isAtLeast(actionDataKeys.length, 20);

    let actionDataTemplateTest = Logic.formatActionDataTemplate(actionDataInfo[0],
      opusCaseInfo, {sectionName});

    assert.equal(actionDataTemplateTest.caseId, opusCaseInfo.caseId);
    assert.equal(actionDataTemplateTest.sectionName, sectionName);
    assert.containsAllKeys(actionDataTemplateTest, actionDataKeys);
  });

  it('formatActionDataTemplate() ', () => {
    let sectionName = 'proposed';
    let actionDataKeys = Object.keys(actionDataInfo[0]);

    //Make sure I have keys
    assert.isAtLeast(actionDataKeys.length, 20);

    let actionDataTemplateTest = Logic.formatActionDataTemplate(actionDataInfo[0],
      opusCaseInfo, {sectionName});

    assert.equal(actionDataTemplateTest.caseId, opusCaseInfo.caseId);
    assert.equal(actionDataTemplateTest.sectionName, sectionName);
    assert.containsAllKeys(actionDataTemplateTest, actionDataKeys);
  });

  it('getDeptCodeForAPUList() returns back the correct deptCode based upon current or proposed/approved', () => {
    let aHPathIdsToDeptCode = {
      1: '100000',
      2: '120000',
      3: '135000'
    };
    let proposedOrApprovedAppointmentInfo = {
      academicHierarchyInfo: {
        academicHierarchyPathId: 1
      }
    };
    let currentAppointmentInfo = {
      academicHierarchyInfo: {
        academicHierarchyPathId: 2
      }
    };
    let deptCode = Logic.getDeptCodeForAPUList(aHPathIdsToDeptCode, proposedOrApprovedAppointmentInfo, currentAppointmentInfo);
    assert.equal(deptCode, 100000);
  });
});
