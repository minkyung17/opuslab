import {assert} from 'chai';
import {filter} from 'lodash';

import * as testHelpers from '../../../test-utility/helpers';
import CasesDossier from '../../../../opus-logic/cases/classes/CasesDossier';
import {constants, proposedActionFlags} from '../../../../opus-logic/cases/constants/CasesConstants';

describe('Case Dossier Logic Class', () => {
  let access_token = null;
  let adminData = null;
  let globalData = null;
  let Logic = null;

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
    Logic = new CasesDossier({globalData, adminData, access_token});

    done();
  });

  it('initCommonCall() already runs when Logic is instantiated', () => {
    assert.exists(Logic.formattedCommonCallLists);
  });

  it('configureClassFromActionType() testing this function executes', () => {
    let actionType = '3-2', actionCategoryId = '3', actionTypeId = '2';
    Logic.configureClassFromActionType({actionType, actionCategoryId, actionTypeId});

    assert.include(Logic, {actionType, actionCategoryId, actionTypeId});
    //tested in setActionTypeData
    //tested in updateValidationsByActionType
  });

  it('updateValidationsByActionType() checks titleCode validation is empty ' +
  'for End Appointment actionType', () => {
    Logic.updateValidationsByActionType('3-38');
    assert.deepEqual(Logic.validateFieldNames.titleCode, {});
  });

  it('initVariablesFromActionDataInfo()', () => {
    let actionDataInfo = [{actionTypeInfo: {actionCategoryId: 5, actionTypeId: 50}}];
    Logic.initVariablesFromActionDataInfo(actionDataInfo);

    assert.equal(Logic.actionCategoryId, 5);
    assert.equal(Logic.actionTypeId, 50);
    assert.equal(Logic.actionType, '5-50');
  });

  it('setActionTypeData() sets "actionType" from "actionTypeId" & "actionCategoryId"',
  () => {
    let data = {actionCategoryId: 3, actionTypeId: 1, actionType: '3-1'};
    Logic.setActionTypeData(data);

    assert.equal(Logic.actionType, data.actionType);
    assert.equal(Logic.actionCategoryId, data.actionCategoryId);

    let actionType = `${data.actionCategoryId}-${data.actionTypeId}`;
    assert.equal(Logic.actionType, actionType);
  });

  it('setActionTypeData() sets "actionTypeId" & "actionCategoryId" from "actionType"',
  () => {
    let actionType = '3-1';
    Logic.setActionTypeData({actionType});
    assert.equal(Logic.actionType, actionType);

    assert.equal(Logic.actionCategoryId, 3);
    assert.equal(Logic.actionTypeId, 1);
  });

  it('getActiveApptsFromCasesData() sets correct active appts array',
  () => {
    let appointmentInfo = [
      {appointmentStatusType: 'Prospective'},
      {appointmentStatusType: 'Archived'},
      {appointmentStatusType: 'Completed'},
      {appointmentStatusType: 'Archived'}
    ];
    let logicAppointmentInfo = Logic.getActiveApptsFromCasesData(appointmentInfo);

    assert.equal(logicAppointmentInfo.length, 2);
  });

  it('getCaseAttrDataUrl()', () => {
    let actionType = '3-1';
    let url = Logic.getCaseAttrDataUrl(actionType);

    let testUrl = '/restServices/rest/activecase/getProposedCaseAttr?' +
      `actionTypeString=${actionType}&access_token=${access_token}`;
    assert(url, testUrl);
  });

  //Not testing promises
  it('getCaseAttrData()', () => {
    // let actionCategoryId = 3;
    // let url = Logic.getCaseAttrData(actionCategoryId);
  });

  it('handleJointSplitAffiliationException()', () => {
    let actionTypes = ['3-2', '3-3'];

    for(let actionType of actionTypes) {
      let fieldData = {affiliation: {}};
      Logic.handleJointSplitAffiliationException(fieldData, actionType);

      assert.equal(fieldData.affiliation.value, 2);
      assert.equal(fieldData.affiliation.displayValue, 'Additional');
    }
  });

  it('editFieldsByApptIdForActionTypeExceptions() - checking this function executed'
  + ' by evauluating if "handleJointSplitAffiliationException" results', () => {
    let actionType = '3-2';
    let appointment = {academicHierarchyInfo: {}, titleInformation: {},
      salaryInfo: {academicProgramUnit: {}}};
    let apptsById = {first: appointment};
    let fieldData = {first: {affiliation: {}}};

    Logic.editFieldsByApptIdForActionTypeExceptions(fieldData, apptsById, actionType);

    //Tests for handleJointSplitAffiliationException
    assert.equal(fieldData.first.affiliation.value, 2);
    assert.equal(fieldData.first.affiliation.displayValue, 'Additional');

    //LEON just make sure one works so as to know you went through it
    // already tested handleJointSplitAffiliationException
    // already tested handleEmeritusChangeForEndAppt
    // already tested setTitleCodeOptionsByActionType
    // already tested setTitleCodeOptionsForPromotion
  });

  //Everything here already tested by other functions
  it('editFieldsForActionTypeExceptions() - simply tests if function was executed'
  + 'and at least one subfunction was executed', () => {
    let actionType = '3-2';
    let appointment = {academicHierarchyInfo: {}, titleInformation: {},
      salaryInfo: {academicProgramUnit: {}}};
    let fieldData = {affiliation: {}};

    Logic.editFieldsForActionTypeExceptions(fieldData, appointment, actionType);

    //Tests for handleJointSplitAffiliationException
    assert.equal(fieldData.affiliation.value, 2);
    assert.equal(fieldData.affiliation.displayValue, 'Additional');

    //tested by super.handleJointSplitAffiliationException
    //tested by handleEmeritusChangeForEndAppt
    //tested by populateRestrictedTitleCodesByActionType
    //tested by editTitleCodeOptionsBySeriesProfessorMatch
  });


  it('setTitleCodeOptionsByActionType()', () => {
    let actionType = '1-10';
    let fieldData = {titleCode: {}};

    Logic.setTitleCodeOptionsByActionType(fieldData, actionType);
    assert.exists(fieldData.titleCode.options);
    assert.deepInclude(Logic.formattedCommonCallLists.titleCodeIdsToNames,
      fieldData.titleCode.options,
      );
  });

  it('createFilterFieldFromExtractedApptValue()', () => {
    let appointment = {salaryInfo: {salary: 1000}};
    let fieldName = 'salary';
    let valueToPath = 'salaryInfo.salary';
    let filtered = Logic.createFilterFieldFromExtractedApptValue(appointment,
      fieldName, valueToPath);

    assert.deepEqual(filtered, {salary: 1000});
  });

  it('getRestrictedTitleCodeLists() tests "1-10" for "unit18Continuing"', () => {
    let actionType = '1-10';
    let filtered = Logic.getRestrictedTitleCodeLists(actionType);

    let {sortedTitleCodeList} = Logic.formattedCommonCallLists;
    let {fieldName, value} = constants.filteredTitleCodeByActionType[actionType];
    let filterValue = {[fieldName]: value};
    let manualFiltered = filter(sortedTitleCodeList, filterValue);

    assert.deepEqual(filtered, manualFiltered);
  });

  it('separateProposedActionAndStatusFieldsByAttrPropsSectionName()', () => {
    let fieldData = {actionType: {attributeProperties: {sectionName: 'proposedAction'}},
      step: {attributeProperties: {sectionName: 'proposedStatus'}},
      titleCode: {attributeProperties: {sectionName: 'proposedStatus'}}
    };

    let fields = Logic.separateProposedActionAndStatusFieldsByAttrPropsSectionName(
      fieldData);
    let {proposedAction, proposedStatus} = fields;

    assert.exists(proposedStatus.step);
    assert.exists(proposedStatus.titleCode);
    assert.exists(proposedAction.actionType);
  });

  it('handleEmeritusChangeForEndAppt()', () => {
    let appointment = {affiliationType: {affiliation: 'Primary'}, titleInformation:
      {titleCodeId: 3}};
    let commonCallLists = {...Logic.formattedCommonCallLists,
      titleCodesById: {3: {academicSenate: true}}};
    let fieldData = {appointmentEndDt: {value: '01/01/2001'}, titleCode: {}};
    Logic.handleEmeritusChangeForEndAppt(fieldData, appointment, '3-38', commonCallLists);

    assert.equal(fieldData.titleCode.options,
      Logic.formattedCommonCallLists.emeritusTitleCodeIdsToNamesArray);
    assert.isTrue(fieldData.titleCode.visibility);
    assert.equal(fieldData.titleCode.topText, 'Would you like to make this person '
    + 'Emeritus? If not, leave blank.');
  });

  it('checkEndApptForEmeritusAppt() is true when theres valid endDate, Primary' +
    'and is academicSenate', () => {
    let endDate = {value: '01/01/2001'};
    let appointment = {affiliationType: {affiliation: 'Primary'}, titleInformation:
      {titleCodeId: 3}};
    let commonCallLists = {titleCodesById: {3: {academicSenate: true}}};
    let isEmeritusAppt = Logic.checkEndApptForEmeritusAppt(appointment, endDate,
      commonCallLists);

    assert.isTrue(isEmeritusAppt);
  });

  it('checkEndApptForEmeritusAppt() is false when theres invalid endDate', () => {
    let endDate = {value: null};
    let appointment = {affiliationType: {affiliation: 'Primary'}, titleInformation:
      {titleCodeId: 3}};
    let commonCallLists = {titleCodesById: {3: {academicSenate: true}}};
    let isEmeritusAppt = Logic.checkEndApptForEmeritusAppt(appointment, endDate,
      commonCallLists);

    assert.isFalse(isEmeritusAppt);
  });

  it('checkEndApptForEmeritusAppt() is false when not a "Primary" appointment',
  () => {
    let endDate = {value: null};
    let appointment = {affiliationType: {affiliation: 'Additional'}, titleInformation:
      {titleCodeId: 3}};
    let commonCallLists = {titleCodesById: {3: {academicSenate: true}}};
    let isEmeritusAppt = Logic.checkEndApptForEmeritusAppt(appointment, endDate,
      commonCallLists);

    assert.isFalse(isEmeritusAppt);
  });

  it('checkEndApptForEmeritusAppt() is false when appointment is not "academicSenate"',
  () => {
    let endDate = {value: null};
    let appointment = {affiliationType: {affiliation: 'Primary'}, titleInformation:
      {titleCodeId: 3}};
    let commonCallLists = {titleCodesById: {3: {academicSenate: false}}};
    let isEmeritusAppt = Logic.checkEndApptForEmeritusAppt(appointment, endDate,
      commonCallLists);

    assert.isFalse(isEmeritusAppt);
  });

  it('getEmeritusTitleCodesForAppt()', () => {
    let emeritusTitleCodeIdsToNamesArray = ['001100', '001200'];
    let commonCallLists = {emeritusTitleCodeIdsToNamesArray};

    let array = Logic.getEmeritusTitleCodesForAppt(commonCallLists);

    assert.equal(emeritusTitleCodeIdsToNamesArray, array);
  });

  it('formatTitleCodeFieldForEmeritus()', () => {
    let titleCode = {};
    let options = ['title', 'code'];
    Logic.formatTitleCodeFieldForEmeritus(titleCode, options);

    assert.equal(titleCode.options, options);
    assert.equal(titleCode.topText, 'Would you like to make this person Emeritus?' +
      ' If not, leave blank.');
  });

  it('formatTitleCodeVisibilityForEmeritus() should make titleCode visible on valid'
  + 'appointmentEndDt', () => {
    let validDate = '01/01/2001';
    let titleCode = {};
    Logic.formatTitleCodeVisibilityForEmeritus(titleCode, validDate);

    assert.isTrue(titleCode.visibility);
  });


  it('formatTitleCodeVisibilityForEmeritus() should make titleCode visible on valid'
  + 'appointmentEndDt', () => {
    let validDate = null;
    let titleCode = {};
    Logic.formatTitleCodeVisibilityForEmeritus(titleCode, validDate);

    assert.isFalse(titleCode.visibility);
  });

  it('filterTitleCodeOptionsBySeriesProfessorMatch() matches correctly for '
  + '"Act Professor" or "Reg Professor" for PROMOTION actionType if series in '
  + 'appointment is "Act Professor"', () => {
    let fieldData = {titleCode: {}};
    let PROMOTION = '2-9';
    let appointment = {titleInformation: {series: 'Act Professor'}};

    let filtered = Logic.filterTitleCodeOptionsBySeriesProfessorMatch(fieldData, appointment,
       PROMOTION);

    let validOptions = {'Act Professor': true, 'Reg Professor': true};

    for(let {series} of filtered) {
      assert.containsAllKeys(validOptions, series);
    }
  });


  it('filterTitleCodeOptionsBySeriesProfessorMatch() matches correctly for '
  + '"Reg Professor" for PROMOTION actionType if series in appointment is '
  + '"Reg Professor"', () => {
    let fieldData = {titleCode: {}};
    let PROMOTION = '2-9';
    let appointment = {titleInformation: {series: 'Reg Professor'}};

    let filtered = Logic.filterTitleCodeOptionsBySeriesProfessorMatch(fieldData,
      appointment, PROMOTION);

    for(let {series} of filtered) {
      assert.equal(series, 'Reg Professor');
    }
  });

  it('setTitleCodeOptionsForPromotion() ensures titleCode has options attached',
  () => {
    let fieldData = {titleCode: {}};
    let PROMOTION = '2-9';
    let appointment = {titleInformation: {series: 'Reg Professor'}};
    let actionDataInfo = {};

    Logic.setTitleCodeOptionsForPromotion(fieldData, appointment, PROMOTION, actionDataInfo);

    assert.exists(fieldData.titleCode.options);
  });

  it('updateFieldDataByToggleForEndAppt()', () => {
    let fieldData = {titleCode: {}, appointmentEndDt: {value: '12/12/1212'}};
    let actionType = '3-38';
    let changedField = 'appointmentEndDt';
    Logic.updateFieldDataByToggleForEndAppt(fieldData, actionType, changedField);
    assert.isTrue(fieldData.titleCode.visibility);
  });

  it('updateFieldDataByToggleForEndAppt() titleCode visibility is false when ' +
  'theres no value for appointmentEndDt', () => {
    let fieldData = {titleCode: {}, appointmentEndDt: {value: null}};
    let actionType = '3-38';
    let changedField = 'appointmentEndDt';
    Logic.updateFieldDataByToggleForEndAppt(fieldData, actionType, changedField);
    assert.isFalse(fieldData.titleCode.visibility);
  });

  it('setApptEndDateVisibilityByEndAppt() changes attributes of appointmentEndDt' +
  'form END_APPOINTMENT when titleCode changes', () => {
    let fieldData = {appointmentEndDt: {}};

    //Update appointmentEndDt attributes
    Logic.setApptEndDateVisibilityByEndAppt(fieldData, '3-38', 'titleCode');

    assert.isTrue(fieldData.appointmentEndDt.editable);
    assert.isTrue(fieldData.appointmentEndDt.visibility);
  });

  it('setApptEndDateVisibilityByEndAppt() doesnt changes attributes appointmentEndDt'
  + 'from END_APPOINTMENT when a field other than titleCode changes', () => {
    let fieldData = {appointmentEndDt: {visibility: false, editable: false}};

    //Update appointmentEndDt attributes
    Logic.setApptEndDateVisibilityByEndAppt(fieldData, '3-37', 'step');

    assert.isFalse(fieldData.appointmentEndDt.editable);
    assert.isFalse(fieldData.appointmentEndDt.visibility);
  });

  //Already tested by other functions
  it('updateFieldDataByToggle() - tested by other functions so lets '+
  'make sure it executes and returns something', () => {
    let fieldData = {titleCode: {}, appointmentEndDt: {}};
    let returned = Logic.updateFieldDataByToggle(fieldData);
    assert.equal(fieldData, returned);

    //tested by super.updateFieldDataByToggle
    //tested by updateFieldDataByToggleForEndAppt
    //tested by setApptEndDateVisibilityByEndAppt
  });

  it('setProposedActionFlagsDisplayInModal() returns correct booleans for should display depending on action type', () => {
    // 2-7 is merit, 3-15 is off scale salary, and 3-1 is appointment
    let testingArrayFromLogic = Logic.setProposedActionFlagsDisplayInModal('3-1');
    assert.isFalse(testingArrayFromLogic[0].shouldDisplay);
    assert.isTrue(testingArrayFromLogic[1].shouldDisplay);
    assert.isFalse(testingArrayFromLogic[2].shouldDisplay);
    assert.isFalse(testingArrayFromLogic[3].shouldDisplay);

    testingArrayFromLogic = Logic.setProposedActionFlagsDisplayInModal('2-7');
    assert.isTrue(testingArrayFromLogic[0].shouldDisplay);
    assert.isTrue(testingArrayFromLogic[1].shouldDisplay);
    assert.isTrue(testingArrayFromLogic[2].shouldDisplay);
    assert.isTrue(testingArrayFromLogic[3].shouldDisplay);

    testingArrayFromLogic = Logic.setProposedActionFlagsDisplayInModal('3-15');
    assert.isTrue(testingArrayFromLogic[0].shouldDisplay);
    assert.isTrue(testingArrayFromLogic[1].shouldDisplay);
    assert.isFalse(testingArrayFromLogic[2].shouldDisplay);
    assert.isFalse(testingArrayFromLogic[3].shouldDisplay);
  })

  it('setCheckedValueForProposedActionFlags() returns correct booleans', () => {
    let proposedActionFlagsArray = proposedActionFlags;
    let actionDataInfo = {
      actionTypeInfo: {
        retentionFlag: true,
        retroactiveFlag: false
      },
      chairsMeritFlag: true,
      deansMeritFlag: false
    };
    let testingArrayFromLogic = Logic.setCheckedValueForProposedActionFlags(actionDataInfo, proposedActionFlagsArray);
    assert.isTrue(testingArrayFromLogic[0].checked);
    assert.isFalse(testingArrayFromLogic[1].checked);
    assert.isTrue(testingArrayFromLogic[2].checked);
    assert.isFalse(testingArrayFromLogic[3].checked);
  })

  it('changeProposedActionFlags() returns correct booleans', () => {
    let proposedActionFlagsArray = proposedActionFlags;
    let testingArrayFromLogic = Logic.changeProposedActionFlags(true, proposedActionFlagsArray[1], proposedActionFlagsArray);
    assert.isTrue(testingArrayFromLogic[1].checked);
    testingArrayFromLogic = Logic.changeProposedActionFlags(true, proposedActionFlagsArray[2], proposedActionFlagsArray);
    assert.isTrue(testingArrayFromLogic[2].checked);
  })
});
