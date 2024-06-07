 import {assert} from 'chai';
import moment from 'moment';

import * as testHelpers from '../../../../test-utility/helpers';
import {constants} from '../../../../test-utility/testing-constants';
import * as util from '../../../../../opus-logic/common/helpers/';
import ProposedFields from '../../../../../opus-logic/cases/classes/caseflow/ProposedFields';
import {constants as propFieldsConstants, messages as propFieldMessages} from
  '../../../../../opus-logic/cases/constants/caseflow/ProposedFieldsConstants.js';
import NameSearch from '../../../../../opus-logic/cases/classes/caseflow/NameSearch';
import {appointmentInfoTemplate, caseFlowTemplate, actionsData} from
  '../../../../../opus-logic/cases/constants/CasesTemplates.js';

describe('ProposedFields Logic Class in CaseFlow', () => {
  //let getRowDataFromCache = false;
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let ProposedFieldsLogic = null;
  let searchString = 'abemayor';
  let apiCacheName = 'proposedFieldsAPIResults';
  let selectedActionType = '3-4';//Change of Department
  let selectedAppointment = null;
  let selectedPerson = null;
  let Logic = null;
  let NameSearchLogic = null;
  let startingAttributeProperties = null;
  let dummyAppts = [{appointmentId: 20, affiliationType: {}, academicHierarchyInfo: {},
    titleInformation: {rank: {}}, salaryInfo: {academicProgramUnit: {apuDesc: ''}}}, {appointmentId: 3,
      academicHierarchyInfo: {}, affiliationType: {}, titleInformation: {rank: {}},
    salaryInfo: {}}];

  /**
   *
   * @desc - Lets get access token and adminData before tests start
   * @param {Function} done - when 'done' is executed all the tests will start
   *
   **/
  beforeAll(async (done) => {
    let data = await testHelpers.getAccessTokenAdminDataGlobalData();
    let {karmaAliasBaseUrl} = constants;
    adminData = data.adminData;
    globalData = data.globalData;
    access_token = data.access_token;
    Logic = new ProposedFields({globalData, adminData, access_token});
    NameSearchLogic = new NameSearch({globalData, adminData, access_token});


    //Lets gets some attribute properties for regular appointment
    let actionType = '3-1';
    let attrPropsCacheName = 'proposedFieldsStartingAttributesCacheName';
    let apptAttrPropsPromise = testHelpers.getAPIDataFromCache(attrPropsCacheName);
    startingAttributeProperties = await apptAttrPropsPromise;
    if(!startingAttributeProperties) {
      startingAttributeProperties = await Logic.getAttributePropertiesByActionTypeFromAPI(
        actionType, karmaAliasBaseUrl);
      testHelpers.postAPIDataToCache(startingAttributeProperties, attrPropsCacheName);
    }


    done();
  });


  it('getAttributePropertiesByActionTypeFromAPI() on start', async () => {
    assert.containsAllKeys(startingAttributeProperties, ['actionType',
      'proposedEffectiveDt', 'departmentCode', 'divisionName', 'departmentName',
      'areaName', 'specialtyName', 'location', 'affiliation', 'titleCode', 'series',
      'rank', 'step', 'appointmentPctTime', 'appointmentEndDt', 'salary', 'scaleType',
      'onScaleSalary', 'offScalePercent', 'apuCode', 'hscpScale1to9', 'hscpScale0',
      'hscpBaseScale', 'hscpAddBaseIncrement', 'dentistryBaseSupplement']);
  });

  it('initProposedFieldsFromAPIData()', async () => {
    let {karmaAliasBaseUrl} = constants;
    let person = {appointeeInfo: {officialEmail: 'opus@ucla.edu'},
      appointmentSetList: []};
    let actionType = '3-1', appointmentDirections = {}, mergeOpusIdFlag = 'N';
    let appointment = [{appointmentId: 20, affiliationType: {}, academicHierarchyInfo: {},
      titleInformation: {rank: {}}, salaryInfo: {}}, {appointmentId: 3,
        academicHierarchyInfo: {}, affiliationType: {}, titleInformation: {rank: {}},
      salaryInfo: {}}];

    let startingDataCacheName = 'proposedFieldsStartingDataCacheName';
    let startingData = await testHelpers.getAPIDataFromCache(startingDataCacheName);

    if(!startingData) {
      startingData = startingData = await Logic.initProposedFieldsFromAPIData({
        selectedPerson: person, actionType, mergeOpusIdFlag, appointmentDirections, appointment,
        prependUrl: karmaAliasBaseUrl});
      testHelpers.postAPIDataToCache(startingData, startingDataCacheName);

      assert.equal(Logic.proposedFields, startingData.proposedFields);
      assert.equal(Logic.appointmentsByApptId, startingData.appointmentsByApptId);
      assert.equal(actionType, Logic.actionType);
    }

    //Checking these variables are set in the class from this function

    assert.containsAllKeys(startingData, ['appointmentIds', 'appointmentTemplate', 'appointmentsByApptId',
    'apptDisplays', 'email', 'fieldData', 'isInactiveAndHasNoEmail', 'opusSortedAppointmentIds',
    'proposedAction', 'proposedFields', 'proposedStatusByApptId', 'showEmailFieldForRecruitPath',
    'statusFieldsTitlesByApptId']);

    //this.configureClassFromActionType({actionType});
    //
    // already tested by getApptByApptIdfromAppointmentArray
    // already tested by getFieldData
    //
    // already tested by editFieldsByApptIdForActionTypeExceptions
    //
    // already tested by this.getDisplayFieldsFromAppointments
    //
    // already tested by showEmailFieldForRecruitPath
    //
    // already tested by getOpusSortedAppointmentIds

  });

  it('determineContactValue()', () => {
    let selectedPerson1 = {
      appointeeInfo: {
        officialEmail: 'notavailable@ucla.edu'
      }
    };
    let selectedPerson2 = {
      appointeeInfo: {
        officialEmail: 'invalid@ucla.edu',
        contactValue: 'valid@ucla.edu'
      }
    };
    let result1 = Logic.determineEmail(false, selectedPerson1);
    let result2 = Logic.determineEmail(true, selectedPerson2);
    assert.equal(result1, '');
    assert.equal(result2, 'valid@ucla.edu');
  });

  it('getAppointmentIds()', () => {
    let appointments = [{appointmentId: 1}, {appointmentId: 2}, {appointmentId: 3}];
    let appointmentIds = Logic.getAppointmentIds(appointments);

    assert.deepEqual(appointmentIds, [1, 2, 3]);
  });

  it('formatProposedActionFields()', () => {
    let commonCallLists = {actionTypeCodeToText: {'3-10': 'Joint Appt'}};
    let fieldData = {
      step: {attributeProperties: {prePopulate: true, pathToFieldValue: 'step',
        pathToFieldDisplayText: 'stepText'}},
      actionType: {}
    };
    let appointment = [{step: 5, stepText: 'WOP'}];

    Logic.formatProposedActionFields(fieldData, appointment, '3-10', commonCallLists);

    assert.equal(fieldData.step.value, appointment[0].step);
    assert.equal(fieldData.step.displayText, appointment[0].stepText);
    assert.equal(fieldData.actionType.value, 'Joint Appt');
  });

  it('getStatusFieldsTitleTextFromAppointment() for "replicateSingleAppointment"',
  () => {
    let appointments = [{appointmentId: 23, academicHierarchyInfo:
      {departmentName: 'Art'}, affiliationType: {affiliation: 'Primary'}},
      {appointmentId: 99, academicHierarchyInfo: {departmentName: 'Gym'},
      affiliationType: {affiliation: 'Additional'}}];
    let statusFieldsTitles = Logic.getStatusFieldsTitleTextFromAppointment(
      appointments, {replicateSingleAppointment: true});
    assert.deepEqual(statusFieldsTitles, {});
  });

  it('getStatusFieldsTitleTextFromAppointment() for "pseudoNewAppointment"',
  () => {
    let appointments = [{appointmentId: 23, academicHierarchyInfo:
      {departmentName: 'Art'}, affiliationType: {affiliation: 'Primary'}},
      {appointmentId: 99, academicHierarchyInfo: {departmentName: 'Gym'},
      affiliationType: {affiliation: 'Additional'}}];
    let statusFieldsTitles = Logic.getStatusFieldsTitleTextFromAppointment(
      appointments, {pseudoNewAppointment: true});
    assert.deepEqual(statusFieldsTitles, {});
  });

  it('getStatusFieldsTitleTextFromAppointment() gets titles', () => {
    let appointments = [{appointmentId: 23, academicHierarchyInfo:
      {departmentName: 'Art'}, affiliationType: {affiliation: 'Primary'}},
      {appointmentId: 99, academicHierarchyInfo: {departmentName: 'Gym'},
      affiliationType: {affiliation: 'Additional'}}];
    let statusFieldsTitles = Logic.getStatusFieldsTitleTextFromAppointment(
      appointments, {replicateSingleAppointment: false});

    assert.deepEqual(statusFieldsTitles[23], 'Art - Primary');
    assert.deepEqual(statusFieldsTitles[99], 'Gym - Additional');
  });

  it('getActionTypeDirections()', () => {
    let actionType = '3-2';

    let directions = Logic.getActionTypeDirections(actionType);

    assert.exists(directions.pseudoNewAppointment);
    assert.exists(directions.replicateSingleAppointment);
  });

  it('prepopulateFieldDataFromAppointment()', () => {
    let fieldData = {
      step: {attributeProperties: {prePopulate: true, pathToFieldValue: 'step',
        pathToFieldDisplayText: 'stepText'}},
      rank: {attributeProperties: {prePopulate: false, pathToFieldValue: 'rank',
        pathToFieldDisplayText: 'rankText'}}
    };
    let appointment = {step: 5, stepText: 'WOP', rank: 3, rankText: 'Assistant'};
    Logic.prepopulateFieldDataFromAppointment(fieldData, appointment);

    assert.equal(fieldData.step.value, appointment.step);
    assert.equal(fieldData.step.displayText, appointment.stepText);

    //Prepopulate was false
    assert.notExists(fieldData.rank.value);
    assert.notExists(fieldData.rank.displayText);
  });

  it('getReplicatedSingleAppointment() gets appointment', () => {
    let appointment = {appointmentId: 10};
    let replicated = Logic.getReplicatedSingleAppointment(appointment);

    assert.equal(replicated.appointmentId, 10);
  });

  it('getPseudoNewAppointment()', () => {
    let appointmentId = 10;
    let apptTemplate = Logic.getPseudoNewAppointment(appointmentId);

    assert.hasAllKeys(apptTemplate, [
      'academicHierarchyInfo',
      'affiliationType',
      'appointmentEndDt',
      'appointmentId',
      'appointmentPctTime',
      'appointmentRowStatusId',
      'comment',
      'currentSalaryAmt',
      'opusPersonId',
      'salaryInfo',
      'titleInformation',
      'waiverEndDt'
    ]);

    assert.equal(apptTemplate.appointmentId, appointmentId);
  });

  it('getAppointmentTemplateFromDirections() for "replicateSingleAppointment"', () => {
    let directions = {replicateSingleAppointment: true};
    let appointment = [{appointmentId: 20}];
    let templateArr = Logic.getAppointmentTemplateFromDirections(directions, appointment);

    assert.isArray(templateArr);

    let testTemplate = {...appointmentInfoTemplate, ...appointment[0]};
    assert.deepInclude(templateArr[0], testTemplate);
  });

  it('getAppointmentTemplateFromDirections() for "pseudoNewAppointment"', () => {
    let directions = {pseudoNewAppointment: true};
    let defaultId = -1;
    let templateArr = Logic.getAppointmentTemplateFromDirections(directions);

    assert.isArray(templateArr);

    let testTemplate = {...appointmentInfoTemplate, appointmentId: defaultId};
    assert.deepInclude(templateArr[0], testTemplate);
  });

  it('getAppointmentTemplateFromDirections() for "noValidAppointment"', () => {
    let directions = {};
    let defaultId = -1;
    let templateArr = Logic.getAppointmentTemplateFromDirections(directions);

    assert.isArray(templateArr);

    let testTemplate = {...appointmentInfoTemplate, appointmentId: defaultId};
    assert.deepInclude(templateArr[0], testTemplate);
  });

  it('getAppointmentTemplateFromDirections() returns appointment with -1 defaultId',
  () => {
    let directions = {};
    let appointments = [];
    let templateArr = Logic.getAppointmentTemplateFromDirections(directions,
      appointments);

    let defaultId = -1;
    let testTemplate = {...appointmentInfoTemplate, appointmentId: defaultId};
    assert.deepEqual(templateArr[0], testTemplate);
  });

  it('getProposedStatusByApptId()', () => {
    let appointmentIds = [1, 2];
    let proposedStatusFields = {step: {}, rank: {}};

    let proposedStatusByApptId = Logic.getProposedStatusByApptId(proposedStatusFields,
      appointmentIds);

    for(let apptId of appointmentIds) {
      assert.deepEqual(proposedStatusFields, proposedStatusByApptId[apptId]);
    }
  });

  it('getViewDataFromSelectedPerson()', () => {
    let person = {appointeeInfo: {jobNumber: '123', fullName: 'Opus', uid: 123}};
    let appointment = [{yearsAtCurrentRank: '4 Years', yearsAtCurrentStepText:
      '6 Years'}];

    let viewData = Logic.getViewDataFromSelectedPerson(person, appointment);

    assert.include(viewData, {fullName: 'Opus', uid: 123,
      jobNumberText: 'Recruit Tracking #: 123'});
  });

  it('getOpusSortedAppointmentIds()', () => {
    let first = {appointmentId: 16, affiliationType: {affiliationTypeId: 2,
      appointmentCategoryId: 100}};
    let second = {appointmentId: 5, affiliationType: {affiliationTypeId: 3,
      appointmentCategoryId: 2}};
    let third = {appointmentId: 10, affiliationType: {affiliationTypeId: 3,
      appointmentCategoryId: 1},
      academicHierarchyInfo: {departmentName: 'BB'}};
    let fourth = {appointmentId: 3, affiliationType: {affiliationTypeId: 3,
      appointmentCategoryId: 1}, academicHierarchyInfo: {departmentName: 'AA'}};

    let appointments = [third, fourth, second, first];
    let sorted = Logic.getOpusSortedAppointmentIds(appointments);

    assert.deepEqual(sorted, [16, 3, 10, 5]);
  });

  it('getFieldData() ensure this function executes without error. All functions '
  + 'here tested elsewhere', async () => {
    let appts = [{}];
    let {karmaAliasBaseUrl} = constants;

    let fieldDataCacheName = 'caseflowProposedFieldsFieldDataCacheName';
    let fieldData = await testHelpers.getAPIDataFromCache(fieldDataCacheName);

    if(!fieldData) {
      fieldData = await Logic.getFieldData('3-1', appts, {prependUrl:
        karmaAliasBaseUrl});
      testHelpers.postAPIDataToCache(fieldData, fieldDataCacheName);
    }

    assert.containsAllKeys(fieldData, ['appointmentTemplate', 'fieldData',
      'proposedAction', 'statusFieldsTitlesByApptId', 'proposedStatusByApptId']);

    assert.isObject(fieldData.fieldData);
    assert.isObject(fieldData.proposedAction);
    assert.isObject(fieldData.proposedStatusByApptId);
    assert.isObject(fieldData.statusFieldsTitlesByApptId);

    assert.isArray(fieldData.appointmentTemplate);
  });

  it('wipeHSCPFieldsForChangeAPUException() wipes fields correctly', () => {
    let actionType = '3-37';
    let fieldData = {
      hscpScale1to9: {
        value: 'HSCP-7'
      },
      hscpScale0: {
        value: 72800
      },
      hscpBaseScale: {
        value: 131000
      },
      hscpAddBaseIncrement: {
        value: 58200
      }
    };
    Logic.wipeHSCPFieldsForChangeAPUException(fieldData, actionType);
    assert.equal(fieldData.hscpScale1to9.value, null);
    assert.equal(fieldData.hscpScale0.value, null);
    assert.equal(fieldData.hscpBaseScale.value, null);
    assert.equal(fieldData.hscpAddBaseIncrement.value, null);
  });

  it('getPrimaryAppointment() gets only appointment as "Primary"', () => {
    let primaryAppt = {affiliationType: {affiliation: 'Primary'}};
    let appointments = [primaryAppt];

    let selectedPrimary = Logic.getPrimaryAppointment(appointments);

    assert.equal(primaryAppt, selectedPrimary);
  });

  it('getPrimaryAppointment() gets appointment as "Primary" among multiple'
  + ' appointments', () => {
    let primaryAppt = {affiliationType: {affiliation: 'Primary'}};
    let appointments = [{affiliationType: {affiliation: 'Affiliation'}}, primaryAppt];

    let selectedPrimary = Logic.getPrimaryAppointment(appointments);

    assert.equal(primaryAppt, selectedPrimary);
  });

  it('getYearsAtCurrentRankStep()', () => {
    let appointment = [{yearsAtCurrentRank: '4 Years', yearsAtCurrentStep: '6 Years',
      affiliationType: {affiliation: 'Primary'}}];
    let years = Logic.getYearsAtCurrentRankStep(appointment);
    let {yearsAtCurrentRank, yearsAtCurrentStep} = years;

    assert.equal(yearsAtCurrentRank, '4 Years');
    assert.equal(yearsAtCurrentStep, '6 Years');
  });

  it('getYearsAtCurrentRankStepText()', () => {
    let appointment = [{yearsAtCurrentRank: '4 Years', yearsAtCurrentStep: '6 Years',
      affiliationType: {affiliation: 'Primary'}}];
    let years = Logic.getYearsAtCurrentRankStepText(appointment);
    let {yearsAtCurrentRankText, yearsAtCurrentStepText} = years;

    assert.equal(yearsAtCurrentRankText, 'Years at Current Rank: 4 Years');
    assert.equal(yearsAtCurrentStepText, 'Years at Current Step: 6 Years');
  });

  it('getApptByApptIdfromAppointmentArray()', () => {
    let firstAppt = {appointmentId: 'first'};
    let secondAppt = {appointmentId: 'second'};

    let apptsByApptId = Logic.getApptByApptIdfromAppointmentArray([firstAppt,
      secondAppt]);

    assert.equal(apptsByApptId.first, firstAppt);
    assert.equal(apptsByApptId.second, secondAppt);
  });

  it('getJobNumberFromSelectedPerson()', () => {
    let person = {appointeeInfo: {jobNumber: 5}};
    let jobNumber = Logic.getJobNumberFromSelectedPerson(person);
    assert.equal(jobNumber, 5);
  });

  it('showEmailFieldForRecruitPath() is true when there is valid jobNumber and mergeFlag is "N"',
  () => {
    let person = {appointeeInfo: {jobNumber: 5}};
    let mergeOpusIdFlag = 'N';
    let showEmailFieldForRecruitPath = Logic.showEmailFieldForRecruitPath(person, mergeOpusIdFlag);

    assert.isTrue(showEmailFieldForRecruitPath);
  });

  it('showEmailFieldForRecruitPath() is false when there is invalid jobNumber and mergeFlag is "N"',
  () => {
    let person = {appointeeInfo: {jobNumber: null}};
    let mergeOpusIdFlag = 'N'
    let showEmailFieldForRecruitPath = Logic.showEmailFieldForRecruitPath(person, mergeOpusIdFlag);

    assert.isFalse(showEmailFieldForRecruitPath);
  });

  it('showEmailFieldForRecruitPath() is true when there is valid jobNumber, mergeFlag is "Y" and has valid email',
  () => {
    let person = {appointeeInfo: {jobNumber: 5}, officialEmail: 'someEmailThatIsValid@gmail.com'};
    let mergeOpusIdFlag = 'Y';
    let showEmailFieldForRecruitPath = Logic.showEmailFieldForRecruitPath(person, mergeOpusIdFlag);

    assert.isTrue(showEmailFieldForRecruitPath);
  });

  it('showEmailFieldForRecruitPath() is false when there is valid jobNumber, mergeFlag is "Y", opusStatus is "Y" and has invalid email',
  () => {
    let person = {appointeeInfo: {jobNumber: 5, opusStatus: 'Y', officialEmail: 'invalidEmail@gmail.com'}};
    let mergeOpusIdFlag = 'Y';
    let showEmailFieldForRecruitPath = Logic.showEmailFieldForRecruitPath(person, mergeOpusIdFlag);

    assert.isFalse(showEmailFieldForRecruitPath);
  });

  it('showEmailFieldForRecruitPath() is true when there is valid jobNumber, mergeFlag is "Y", opusStatus is "Y" and has blank email',
  () => {
    let person = {appointeeInfo: {jobNumber: 5, opusStatus: 'Y', officialEmail: ''}};
    let mergeOpusIdFlag = 'Y';
    let showEmailFieldForRecruitPath = Logic.showEmailFieldForRecruitPath(person, mergeOpusIdFlag);

    assert.isTrue(showEmailFieldForRecruitPath);
  });

  it('isInactiveAndHasNoEmail() is true when there is a blank email and opusStatus is "N"',
  () => {
    let person = {appointeeInfo: {opusStatus: "N", officialEmail: ""}};
    let isInactiveAndHasNoEmail = Logic.isInactiveAndHasNoEmail(person);

    assert.isTrue(isInactiveAndHasNoEmail);
  });

  it('isInactiveAndHasNoEmail() is true when there is an invalid email and opusStatus is "N"',
  () => {
    let person = {appointeeInfo: {opusStatus: "N", officialEmail: null}};
    let isInactiveAndHasNoEmail = Logic.isInactiveAndHasNoEmail(person);

    assert.isTrue(isInactiveAndHasNoEmail);
  });

  it('isInactiveAndHasNoEmail() is false when there is a blank email and opusStatus is "Y"',
  () => {
    let person = {appointeeInfo: {opusStatus: "Y", officialEmail: ""}};
    let isInactiveAndHasNoEmail = Logic.isInactiveAndHasNoEmail(person);

    assert.isFalse(isInactiveAndHasNoEmail);
  });

  it('isInactiveAndHasNoEmail() is false when there is an invalid email and opusStatus is "Y"',
  () => {
    let person = {appointeeInfo: {opusStatus: "Y", officialEmail: null}};
    let isInactiveAndHasNoEmail = Logic.isInactiveAndHasNoEmail(person);

    assert.isFalse(isInactiveAndHasNoEmail);
  });

  it('isInactiveAndHasNoEmail() is false when there is a valid email and opusStatus is "N"',
  () => {
    let person = {appointeeInfo: {opusStatus: "N", officialEmail: "opusemail@gmail.com"}};
    let isInactiveAndHasNoEmail = Logic.isInactiveAndHasNoEmail(person);

    assert.isFalse(isInactiveAndHasNoEmail);
  });

  it('getCaseCreatedUrl()', () => {
    let caseId = 100, actionCategoryId = '3', actionTypeId = '2', actionType =
        `${actionCategoryId}-${actionTypeId}`;
    let url = Logic.getCaseCreatedUrl(caseId, actionType);

    assert.equal(url, `/opusWeb/ui/admin/case-summary.shtml?caseId=${100}` +
      `&actionTypeId=${actionTypeId}&actionCategoryId=${actionCategoryId}`);
  });

  it('determineAdditionalAHPathIdsWithApptIdsForSave() returns empty array for' +
    ' invalid actionType thats not in "ahPathIdConcatException"', () => {
    let appts = [
      {appointmentId: 23, academicHierarchyInfo: {academicHierarchyPathId: 100}},
      {appointmentId: 45, academicHierarchyInfo: {academicHierarchyPathId: 567}}
    ];

    let ahPaths = Logic.determineAdditionalAHPathIdsWithApptIdsForSave(appts,
      '3-1');

    assert.deepEqual(ahPaths, []);
  });

  it('determineAdditionalAHPathIdsWithApptIdsForSave()', () => {
    let appts = [
      {appointmentId: 23, academicHierarchyInfo: {academicHierarchyPathId: 100}},
      {appointmentId: 45, academicHierarchyInfo: {academicHierarchyPathId: 567}}
    ];

    let ahPaths = Logic.determineAdditionalAHPathIdsWithApptIdsForSave(appts,
      '3-0');

    assert.deepEqual(ahPaths, ['100@23', '567@45']);
  });

  it('handleOpusIdMerge()', () => {
    let template = {appointeeInfo: {}};
    let mergeOpusId = '1234';
    let mergeOpusIdFlag = 'Y';
    let selectedUIDPersonAppointeeInfo = {
      firstName: 'Mr.',
      lastName: 'Opus',
      contactValue: 'opus@ucla.edu',
      opusStatus: 'sure',
      eppn: 'what the hell is an eppn'
    };

    Logic.handleOpusIdMerge(template, mergeOpusId, mergeOpusIdFlag,
      selectedUIDPersonAppointeeInfo);

    assert.equal(template.appointeeInfo.mergeOpusIdFlag, mergeOpusIdFlag);
    assert.equal(template.appointeeInfo.mergeOpusId, mergeOpusId);
    assert.include(template.appointeeInfo, selectedUIDPersonAppointeeInfo);
  });

  it('handleOpusIdMerge() does not transfer anything if mergeOpusIdFlag  "N"',
  () => {
    let template = {appointeeInfo: {}};
    let mergeOpusId = '1234';
    let mergeOpusIdFlag = 'N';
    let selectedUIDPersonAppointeeInfo = {
      firstName: 'Mr.',
      lastName: 'Opus',
      contactValue: 'opus@ucla.edu',
      opusStatus: 'sure',
      eppn: 'what the hell is an eppn'
    };

    Logic.handleOpusIdMerge(template, mergeOpusId, mergeOpusIdFlag,
      selectedUIDPersonAppointeeInfo);

    assert.notEqual(template.appointeeInfo.mergeOpusId, mergeOpusId);
    assert.notInclude(template.appointeeInfo, selectedUIDPersonAppointeeInfo);
  });

  it('getAHPathIdFromFieldData()', () => {
    let fieldData = {departmentCode: {value: 100}, step: {value: 'dont care'}};
    let ahPathId = Logic.getAHPathIdFromFieldData(fieldData);

    assert.equal(ahPathId, 100);
  });

  it('getNewCaseFlowTemplate()', () => {
    let template = Logic.getNewCaseFlowTemplate();
    assert.deepEqual(template, caseFlowTemplate);
  });

  it('formatAppointeeInfo()', () => {
    let newCaseFlowTemplate = {appointeeInfo: {}}, contactValue = 'opus@ucla.edu',
      opusEmail = null, officialEmail = null,
      appointeeInfo = {name: 'Opus', schoolName: 'UCLA'};

    Logic.formatAppointeeInfo(newCaseFlowTemplate, appointeeInfo, {contactValue, opusEmail, officialEmail});

    let combined = {contactValue, officialEmail, mergeOpusIdFlag: 'N', mergeOpusId: null, opusEmail,
      ...appointeeInfo};
    assert.deepInclude(newCaseFlowTemplate, {appointeeInfo: combined});
  });

  it('getDeptCodeFromAHPath()', () => {
    let fieldData = {departmentCode: {value: 5}};
    let commonCallLists = {ahPathToDepartment: {5: {departmentCode: 100}}};

    let deptCodeByAHPath = Logic.getDeptCodeFromAHPath(fieldData, commonCallLists);

    assert.equal(deptCodeByAHPath, 100);
  });

  it('getAHPathToApptIds() gets formatted ahPathI@appointmentId', () => {
    let ahPathIdByDeptCode = '5', apptId = '12345', actionType = '3-16';

    let allAHPathIdsWithApptIdsByDeptCode = Logic.getAHPathToApptIds(ahPathIdByDeptCode,
      apptId, actionType);

    assert.equal(allAHPathIdsWithApptIdsByDeptCode, '5@12345');
  });

  it('getAHPathToApptIds() gets formatted ahPathI@appointmentId where ahPath ' +
  'is in "ahPathIdConcatException" i.e. -1 for apptId', () => {
    let ahPathIdByDeptCode = '5', apptId = '12345', actionType = '3-1';

    let allAHPathIdsWithApptIdsByDeptCode = Logic.getAHPathToApptIds(ahPathIdByDeptCode,
      apptId, actionType);

    assert.equal(allAHPathIdsWithApptIdsByDeptCode, '5@-1');
  });

  it('getAHPathToApptIds() gets formatted ahPathI@appointmentId where ahPath ' +
  'is in "dummyIdahPathIdConcatException" i.e. -1 for apptId', () => {
    let ahPathIdByDeptCode = '5', apptId = '12345', actionType = '3-2';

    let allAHPathIdsWithApptIdsByDeptCode = Logic.getAHPathToApptIds(ahPathIdByDeptCode,
      apptId, actionType);

    assert.equal(allAHPathIdsWithApptIdsByDeptCode, '5@-1');
  });

  it('getAHPathToApptIds() gets empty array for invalid "ahPathIdByDeptCode"',
  () => {
    let ahPathIdByDeptCode = null, apptId = '12345', actionType = '3-2';

    let allAHPathIdsWithApptIdsByDeptCode = Logic.getAHPathToApptIds(ahPathIdByDeptCode,
      apptId, actionType);

    assert.deepEqual(allAHPathIdsWithApptIdsByDeptCode, null);
  });

  it('getOpusCaseForNewCaseTemplate()', () => {
    let newCaseFlowTemplate = {opusCase: {}};
    let concatenatedAHPathIds = '10@500';

    Logic.getOpusCaseForNewCaseTemplate(newCaseFlowTemplate, concatenatedAHPathIds);

    assert.deepInclude(newCaseFlowTemplate,
      { opusCase: {
        academicHierarchyPathIds: concatenatedAHPathIds,
        caseInitiatedDt: moment().format('MM/DD/YYYY'),
        isDeptDatesChanged: 'Y',
        isNewCase: 'Y',
        isTrackingDatesChanged: 'Y'
      }});
  });

  it('handleSaveExceptionApptIdFromSelectedAppt() does nothing in this case since' +
  'since the action type is not an exception', () => {
    let actionsDataTemplate = {appointmentInfo: {appointmentId: 'original'}};
    let appointment = {appointmentId: 100};
    let appointmentSetList = [];
    let actionType = '3-30';

    Logic.handleSaveExceptionApptIdFromSelectedAppt(actionsDataTemplate, appointment,
      appointmentSetList, actionType);

    assert.equal(actionsDataTemplate.appointmentInfo.appointmentId, 'original');
  });

  it('handleSaveExceptionApptIdFromSelectedAppt() sets nothing when actionType '
  + 'is included in "saveExceptionApptIdFromSelectedAppt" but appointmentSetList'
  + 'is not an empty array', () => {
    let actionsDataTemplate = {appointmentInfo: {appointmentId: 'original'}};
    let appointment = {appointmentId: 100};
    let appointmentSetList = [{}, {}];
    let actionType = '3-10';

    Logic.handleSaveExceptionApptIdFromSelectedAppt(actionsDataTemplate, appointment,
      appointmentSetList, actionType);

    assert.equal(actionsDataTemplate.appointmentInfo.appointmentId, 'original');
  });

  it('handleSaveExceptionApptIdFromSelectedAppt() sets appointmentId when actionType '
  + 'is included in "saveExceptionApptIdFromSelectedAppt" & appointmentSetList'
  + 'is blank', () => {
    let actionsDataTemplate = {appointmentInfo: {appointmentId: 'original'}};
    let appointment = {appointmentId: 100};
    let appointmentSetList = [];
    let actionType = '3-4';

    Logic.handleSaveExceptionApptIdFromSelectedAppt(actionsDataTemplate, appointment,
      appointmentSetList, actionType);

    assert.equal(actionsDataTemplate.appointmentInfo.appointmentId, 100);
  });

  it('handleSaveExceptionApptIdFromSelectedAppt() resets appointmentId in template' +
  ' when actionType is included "excludeAddlAppts"', () => {
    let actionsDataTemplate = {appointmentInfo: {appointmentId: 'original'}};
    let appointment = {appointmentId: 100};
    let appointmentSetList = [];
    let actionType = '3-2';

    Logic.handleSaveExceptionApptIdFromSelectedAppt(actionsDataTemplate, appointment,
      appointmentSetList, actionType);

    assert.equal(actionsDataTemplate.appointmentInfo.appointmentId, 100);
  });

  it('formatTemplateWithActionTypeData()', () => {
    let template = {actionTypeInfo: {}};
    let actionType = '3-2';
    Logic.formatTemplateWithActionTypeData(template, actionType);

    assert.equal(template.actionTypeInfo.actionCategoryId, '3');
    assert.equal(template.actionTypeInfo.actionTypeId, '2');
  });

  it('createActionsDataTemplate()', () => {
    let appointmentInfo = {};
    let actionsDataTemplate = Logic.createActionsDataTemplate(appointmentInfo);

    let testTemplate = {...util.cloneObject(actionsData), appointmentInfo,
      sectionName: 'proposed', ...propFieldsConstants.caseFlowAppointmentStatusData};

    assert.deepInclude(actionsDataTemplate, testTemplate);
  });

  // it('setAppointeeInfoIfRecruit() sets appointeeInfo into newCaseFlowTemplate ' +
  // 'if its a "Recruit" save', () => {
  //   let appointeeInfo = {name: 'Opus', schoolName: 'UCLA'};
  //   let newCaseFlowTemplate = {appointeeInfo: {}};
  //   let saveType = 'Recruit';
  //
  //   Logic.setAppointeeInfoIfRecruit(newCaseFlowTemplate, appointeeInfo, saveType);
  //
  //   assert.deepEqual(newCaseFlowTemplate.appointeeInfo, appointeeInfo);
  // });
  //
  // it('setAppointeeInfoIfRecruit() doesnt set appointeeInfo into newCaseFlowTemplate ' +
  // 'if its not a "Non-Recruit" save', () => {
  //   let appointeeInfo = {name: 'Opus', schoolName: 'UCLA'};
  //   let newCaseFlowTemplate = {appointeeInfo: {}};
  //   let saveType = 'Non-Recruit';
  //
  //   Logic.setAppointeeInfoIfRecruit(newCaseFlowTemplate, appointeeInfo, saveType);
  //
  //   assert.notEqual(newCaseFlowTemplate.appointeeInfo, appointeeInfo);
  // });

  it('formatConcatenatedAHPathIds() gets unique values', () => {
    let allAHPathIdsWithApptIdsByDeptCode = ['12@1234', '-1@90'];
    let appointmentAHPathIdsWithApptsIds = ['12@1234', '10@543'];

    let concatenatedAHPathIds = Logic.formatConcatenatedAHPathIds(
      allAHPathIdsWithApptIdsByDeptCode, appointmentAHPathIdsWithApptsIds);

    assert.equal(concatenatedAHPathIds, '12@1234,-1@90,10@543');
  });

  it('setAHPathByDeptCodeInAppointment() sets valid "academicHierarchyPathId"', () => {
    let actionsDataTemplate = {proposedAppointmentInfo: {academicHierarchyInfo: {}}};
    let ahPathIdByDeptCode = 100;

    Logic.setAHPathByDeptCodeInAppointment(actionsDataTemplate, ahPathIdByDeptCode);
    let {proposedAppointmentInfo: {academicHierarchyInfo}} = actionsDataTemplate;
    assert.equal(academicHierarchyInfo.academicHierarchyPathId, ahPathIdByDeptCode);
  });

  it('setAHPathByDeptCodeInAppointment() doesnt set valid "academicHierarchyPathId"'
  + 'for invalid "ahPathIdByDeptCode"', () => {
    let actionsDataTemplate = {proposedAppointmentInfo: {academicHierarchyInfo: {}}};
    let ahPathIdByDeptCode = null;

    Logic.setAHPathByDeptCodeInAppointment(actionsDataTemplate, ahPathIdByDeptCode);
    let {proposedAppointmentInfo: {academicHierarchyInfo}} = actionsDataTemplate;
    assert.notExists(academicHierarchyInfo.academicHierarchyPathId);
  });

  it('setDeptCodeInAppt()', () => {
    let appointment = {academicHierarchyInfo: {}};
    let deptCodeByAHPath = 100;

    Logic.setDeptCodeInAppt(appointment, deptCodeByAHPath);

    assert.equal(appointment.academicHierarchyInfo.departmentCode, 100);
  });

  it('formatActionsTemplateByActionAndSaveType() for recruit save', () => {
    let saveType = 'recruit';
    let actionType = '3-99';//No such actionType
    let actionsDataTemplate = {};
    let template = Logic.formatActionsTemplateByActionAndSaveType(
      actionsDataTemplate, actionType, saveType);

    assert.deepEqual(template.appointmentInfo, actionsData.appointmentInfo);
  });

  it('formatActionsTemplateByActionAndSaveType() for saveExceptionActionTypes ' +
    'save', () => {
    let saveType = '';
    let actionType = '3-1';
    let actionsDataTemplate = {};
    let template = Logic.formatActionsTemplateByActionAndSaveType(
      actionsDataTemplate, actionType, saveType);

    assert.deepEqual(template.appointmentInfo, actionsData.appointmentInfo);
  });

  it('formatActionsTemplateByActionAndSaveType() - not "saveExceptionActionTypes"'
  + ' or recruit save', () => {
    let saveType = '';
    let actionType = '3-99';
    let actionsDataTemplate = {};
    let template = Logic.formatActionsTemplateByActionAndSaveType(
      actionsDataTemplate, actionType, saveType);

    assert.notDeepEqual(template.appointmentInfo, actionsData.appointmentInfo);
  });

  it('getFormattedActionsDataTemplate() gets single actionData', () => {
    let appointment = dummyAppts[0];
    let proposedAction = {};
    let proposedStatusFields = {};
    let actionType = '3-1';
    let selectedPerson = {appointeeInfo: {}, appointmentSetList: [],
      appointmentInfo: {}};

    let actionsDataTemplate = Logic.getFormattedActionsDataTemplate(appointment,
      proposedAction, proposedStatusFields, {actionType, selectedPerson});

    assert.containsAllKeys(actionsDataTemplate, ['caseId', 'rowStatusId',
      'actionStatusId', 'actionId', 'proposedEffectiveDt', 'effectiveDt',
      'approvedSeriesStartDt', 'pageName', 'userComments', 'approvedActionOutcome',
      'actionCompletedDt', 'proposedAppointmentInfo', 'approvedAppointmentInfo',
      'actionTypeInfo', 'appointmentInfo', 'sectionName']);

    //tested with formatTemplateWithActionTypeData
    //tested with getAHPathIdFromFieldData
    //tested with getDeptCodeFromAHPath
    //tested with setAHPathByDeptCodeInAppointment
    //tested with omitFieldsFromFieldData
    //tested with addFieldValuesToTemplateByAttrPropsPath
    //tested with addApuCodeToApptByFieldDataApuId
    //tested with setDeptCodeInAppt
    //tested with formatActionsTemplateByActionAndSaveType
    //tested with handleSaveExceptionApptIdFromSelectedAppt
  });

  it('getAHPathIdsWithApptIdsByDeptCode()', () => {
    let proposedStatusFieldsByApptId = {
      1: {departmentCode: {value: 5}},
      2: {departmentCode: {value: 10}}
    };
    let uniqueApptIds = [1, 2];
    let actionType = '3-10'; //Not an exception or special case

    let allAHPathIdsWithApptIdsByDeptCode = Logic.getAHPathIdsWithApptIdsByDeptCode(
      proposedStatusFieldsByApptId, uniqueApptIds, actionType
    );

    assert.deepEqual(allAHPathIdsWithApptIdsByDeptCode, ['5@1', '10@2']);
  });

  it('getAllFormattedActionDataTemplates() checks each actionData for correct keys'
  + ' and default values', () => {
    let appointmentsById = {20: {appointmentId: 20, affiliationType: {},
      academicHierarchyInfo: {}, titleInformation: {rank: {}}, salaryInfo: {academicProgramUnit: {apuDesc: ''}}},
      3: {appointmentId: 3, academicHierarchyInfo: {}, affiliationType: {},
        titleInformation: {rank: {}}, salaryInfo: {academicProgramUnit: {apuDesc: ''}}}};
    let proposedAction = {};
    let proposedStatusByApptId = {20: {}, 3: {}};
    let uniqueApptIds = [3, 20];
    let actionType = '3-1';
    let saveType = '';
    let person = {appointmentSetList: [], appointmentInfo: []};

    let allActionsData = Logic.getAllFormattedActionDataTemplates(appointmentsById,
      proposedAction, proposedStatusByApptId, {uniqueApptIds, actionType, saveType,
        selectedPerson: person});

    for(let actionData of allActionsData) {
      assert.containsAllKeys(actionData, ['caseId', 'rowStatusId', 'actionStatusId',
        'actionId', 'proposedEffectiveDt', 'effectiveDt', 'approvedSeriesStartDt',
        'pageName', 'userComments', 'approvedActionOutcome', 'actionCompletedDt',
        'proposedAppointmentInfo', 'approvedAppointmentInfo', 'actionTypeInfo',
        'appointmentInfo', 'sectionName']);

      assert.include(actionData, {actionStatusId: 1, pageName: 'active',
        rowStatusId: 1, sectionName: 'proposed'});
    }
  });

  it('formatNewCaseTemplateForSave()', () => {
    let selectedPerson = {appointeeInfo: {}, appointmentSetList: [],
      appointmentInfo: []};
    let appt = dummyAppts[0];
    let proposedAction = {};
    let proposedStatus = {};
    let actionType = '3-1';
    let template = Logic.formatNewCaseTemplateForSave(appt, proposedAction,
      proposedStatus, {actionType, selectedPerson});

    assert.containsAllKeys(template, ['appointeeInfo', 'loggedInUserInfo',
      'opusCase', 'actionsData']);

    assert.isObject(template.opusCase);
    assert.isObject(template.appointeeInfo);
    assert.isObject(template.loggedInUserInfo);
    assert.isArray(template.actionsData);
    //already tested by getNewCaseFlowTemplate
    //already tested by formatAppointeeInfo
    //already tested by formatNewCaseTemplateForSave
    //already tested by getAllFormattedActionDataTemplates
    //already tested by populateLoggedInUserInfoWithAdminData
    //already tested by determineAdditionalAHPathIdsWithApptIdsForSave
    //already tested by getAHPathIdsWithApptIdsByDeptCode
    //already tested by formatConcatenatedAHPathIds
    //already tested by getAllFormattedActionDataTemplates
  });

  it('doProposedFieldsHaveErrors() for just proposedAction', () => {
    let proposedAction = {actionType: {hasError: true}};
    let proposedStatusFieldsByApptId = {1: {}};

    let hasError = Logic.doProposedFieldsHaveErrors(proposedAction, proposedStatusFieldsByApptId);

    assert.isTrue(hasError);
  });

  it('doProposedFieldsHaveErrors() for just proposedStatusFieldsByApptId', () => {
    let proposedAction = {actionType: {hasError: false}};
    let proposedStatusFieldsByApptId = {1: {step: {hasError: true}}};

    let hasError = Logic.doProposedFieldsHaveErrors(proposedAction, proposedStatusFieldsByApptId);

    assert.isTrue(hasError);
  });

  it('doProposedFieldsHaveErrors() for just proposedStatusFieldsByApptId', () => {
    let proposedAction = {actionType: {hasError: false}};
    let proposedStatusFieldsByApptId = {1: {step: {hasError: false}}};

    let hasError = Logic.doProposedFieldsHaveErrors(proposedAction, proposedStatusFieldsByApptId);

    assert.isFalse(hasError);
  });

  it('validateFieldOnBlur()', () => {
    let fieldData = {value: null, name: 'currentSalaryAmt', editable: true,
      visibility: true};

    Logic.validateFieldOnBlur(fieldData);

    assert.isString(fieldData.error);
    assert.isTrue(fieldData.hasError);
  });

  it('validateProposedFields()', () => {
    //doesnt matter what field
    let action = {titleCode: {value: null, editable: true, visibility: true}};
    let statusById = {1: {titleCode: {value: null, editable: true, visibility: true}}};

    Logic.validateProposedFields(action, statusById);

    assert.isString(action.titleCode.error);
    assert.isTrue(action.titleCode.hasError);

    assert.isString(statusById[1].titleCode.error);
    assert.isTrue(statusById[1].titleCode.hasError);
  });

  it('createACase() ensures it has correct keys.', () => {
    let template = Logic.createACase();
    assert.hasAllKeys(template, ['actionsData', 'appointeeInfo', 'loggedInUserInfo',
      'opusCase']);
  });

  it('getCreateCaseUrl()', () => {
    let url = Logic.getCreateCaseUrl();

    assert.equal(url, '/restServices/rest/activecase/saveCase?access_token=' +
      access_token);
  });

  it('saveNewCaseToAPI()', () => {
    //Already tested by this.stringify
    //Already tested by util.jqueryPostJson
  });

  it('validateIfEmailIsBlank() returns false if email is blank', () => {
    let emailField = Logic.validateIfEmailIsBlank('');

    assert.isFalse(emailField.isValid);
    assert.equal(emailField.message, propFieldMessages.blankEmailError,
);
  });

  it('validateIfEmailIsBlank() returns true if email is not blank', () => {
    let isEmailBlank = Logic.validateIfEmailIsBlank('validEmail@test.com');

    assert.isTrue(isEmailBlank.isValid);
  });

  it('getEmailErrorMessages()', () => {
    let emailErrorMessages = Logic.getEmailErrorMessages();

    assert.equal(emailErrorMessages.isNotUnique , propFieldMessages.uniqueEmailError);
    assert.equal(emailErrorMessages.isInvalid , propFieldMessages.invalidEmailError);
  });
});
